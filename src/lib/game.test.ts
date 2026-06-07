import { describe, expect, it } from "vitest";
import {
  addPlayer,
  addRound,
  calculateTotals,
  emptyGameState,
  matchGuess,
  parseStoredGameState,
  removePlayer,
  renamePlayer,
} from "@/lib/game";

describe("player management", () => {
  it("adds, renames, and removes players, cleaning up their results", () => {
    let state = addPlayer(emptyGameState, "Dimash");
    state = addPlayer(state, "Alex");
    const [dimash, alex] = state.players;

    state = renamePlayer(state, alex.id, "Asha");
    state = addRound(state, "Q1", "Basis", [
      { playerId: dimash.id, guess: "India", rank: 1, points: 1 },
      { playerId: alex.id, guess: "China", rank: 2, points: 2 },
    ]);
    state = removePlayer(state, dimash.id);

    expect(state.players).toEqual([{ id: alex.id, name: "Asha" }]);
    expect(state.rounds[0].results).toEqual([
      { playerId: alex.id, guess: "China", rank: 2, points: 2 },
    ]);
  });
});

describe("scoring", () => {
  it("calculates totals from round results", () => {
    let state = addPlayer(emptyGameState, "Dimash");
    state = addPlayer(state, "Alex");
    const [p1, p2] = state.players;

    state = addRound(state, "Q1", "Basis", [
      { playerId: p1.id, guess: "A", rank: 25, points: 25 },
      { playerId: p2.id, guess: "B", rank: 1, points: 1 },
    ]);
    state = addRound(state, "Q2", "Basis", [
      { playerId: p1.id, guess: "", rank: null, points: 0 },
      { playerId: p2.id, guess: "C", rank: 30, points: 30 },
    ]);

    expect(calculateTotals(state)).toEqual({ [p1.id]: 25, [p2.id]: 31 });
  });
});

describe("matchGuess", () => {
  const items = [
    { rank: 1, name: "India" },
    { rank: 2, name: "China" },
    { rank: 3, name: "United States" },
  ];
  const aliases = { "United States": ["usa", "us", "america"] };

  it("matches exact names case-insensitively", () => {
    expect(matchGuess(items, aliases, "india")?.rank).toBe(1);
    expect(matchGuess(items, aliases, "CHINA")?.rank).toBe(2);
  });

  it("matches aliases", () => {
    expect(matchGuess(items, aliases, "USA")?.rank).toBe(3);
    expect(matchGuess(items, aliases, "america")?.rank).toBe(3);
  });

  it("returns null for no match", () => {
    expect(matchGuess(items, aliases, "Germany")).toBeNull();
  });
});

describe("parseStoredGameState", () => {
  it("falls back to empty state when data is missing or invalid", () => {
    expect(parseStoredGameState(null)).toEqual(emptyGameState);
    expect(parseStoredGameState("{")).toEqual(emptyGameState);
    expect(parseStoredGameState(JSON.stringify({ players: [], rounds: [] }))).toEqual(emptyGameState);
  });
});
