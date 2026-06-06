import { describe, expect, it, vi } from "vitest";
import {
  addPlayer,
  addRound,
  calculateTotals,
  emptyGameState,
  normalizePoints,
  parseStoredGameState,
  removePlayer,
  renamePlayer,
  type GameState,
} from "@/lib/game";
import type { Top30Result } from "@/lib/top30";

const sampleResult: Top30Result = {
  question: "Largest countries by population?",
  title: "Largest Countries by Population",
  rankingBasis: "Ranked by estimated population.",
  generatedAt: "2026-06-07T00:00:00.000Z",
  items: [
    { rank: 1, name: "India", value: "1.4B", sourceUrls: [] },
    { rank: 2, name: "China", value: "1.4B", sourceUrls: [] },
  ],
  sources: [{ title: "Example", url: "https://example.com" }],
  warnings: [],
};

describe("game helpers", () => {
  it("adds, renames, and removes players without keeping stale scores", () => {
    vi.setSystemTime(new Date("2026-06-07T00:00:00.000Z"));

    let state = addPlayer(emptyGameState, "Dimash");
    state = addPlayer(state, "Alex");

    const dimash = state.players[0];
    const alex = state.players[1];
    state = renamePlayer(state, alex.id, "Asha");
    state = addRound(state, sampleResult, { [dimash.id]: 25, [alex.id]: 1 });
    state = removePlayer(state, dimash.id);

    expect(state.players).toEqual([{ id: alex.id, name: "Asha" }]);
    expect(state.rounds[0].scores).toEqual([{ playerId: alex.id, points: 1 }]);
  });

  it("calculates totals from saved manual scores", () => {
    const state: GameState = {
      players: [
        { id: "p1", name: "Dimash" },
        { id: "p2", name: "Alex" },
      ],
      rounds: [
        {
          id: "r1",
          question: "Q1",
          title: "Round 1",
          rankingBasis: "Basis",
          createdAt: "2026-06-07T00:00:00.000Z",
          result: null,
          scores: [
            { playerId: "p1", points: 25 },
            { playerId: "p2", points: 1 },
          ],
        },
        {
          id: "r2",
          question: "Q2",
          title: "Round 2",
          rankingBasis: "Basis",
          createdAt: "2026-06-07T00:00:00.000Z",
          result: null,
          scores: [
            { playerId: "p1", points: 0 },
            { playerId: "p2", points: 30 },
          ],
        },
      ],
    };

    expect(calculateTotals(state)).toEqual({ p1: 25, p2: 31 });
  });

  it("normalizes point entry to non-negative whole numbers", () => {
    expect(normalizePoints("25.9")).toBe(25);
    expect(normalizePoints("-4")).toBe(0);
    expect(normalizePoints("nope")).toBe(0);
  });

  it("falls back to an empty state when stored data is missing or invalid", () => {
    expect(parseStoredGameState(null)).toEqual(emptyGameState);
    expect(parseStoredGameState("{")).toEqual(emptyGameState);
    expect(parseStoredGameState(JSON.stringify({ players: [], rounds: [] }))).toEqual(emptyGameState);
  });
});
