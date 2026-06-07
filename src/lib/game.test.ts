import { describe, expect, it } from "vitest";
import {
  addPlayer,
  addRound,
  adjustRoundScore,
  calculateTotals,
  emptyGameState,
  isGameOver,
  matchGuess,
  parseStoredGameState,
  removePlayer,
  renamePlayer,
  setTarget,
  startNewGame,
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

describe("game target & win condition", () => {
  function twoPlayerGame() {
    let state = addPlayer(emptyGameState, "Dimash");
    state = addPlayer(state, "Alex");
    return state;
  }

  it("is never over before any round is played", () => {
    const state = setTarget(twoPlayerGame(), { mode: "points", value: 10 });
    expect(isGameOver(state)).toBe(false);
  });

  it("ends a points game once a player reaches the target", () => {
    let state = setTarget(twoPlayerGame(), { mode: "points", value: 25 });
    const [p1, p2] = state.players;
    state = addRound(state, "Q1", "Basis", [
      { playerId: p1.id, guess: "A", rank: 24, points: 24 },
      { playerId: p2.id, guess: "B", rank: 1, points: 1 },
    ]);
    expect(isGameOver(state)).toBe(false);
    state = addRound(state, "Q2", "Basis", [
      { playerId: p1.id, guess: "C", rank: 5, points: 5 },
      { playerId: p2.id, guess: "D", rank: 1, points: 1 },
    ]);
    expect(isGameOver(state)).toBe(true);
  });

  it("ends a rounds game once the round count is reached", () => {
    let state = setTarget(twoPlayerGame(), { mode: "rounds", value: 2 });
    const [p1] = state.players;
    state = addRound(state, "Q1", "Basis", [{ playerId: p1.id, guess: "A", rank: 1, points: 1 }]);
    expect(isGameOver(state)).toBe(false);
    state = addRound(state, "Q2", "Basis", [{ playerId: p1.id, guess: "A", rank: 1, points: 1 }]);
    expect(isGameOver(state)).toBe(true);
  });

  it("never ends an endless game", () => {
    let state = twoPlayerGame();
    const [p1] = state.players;
    state = addRound(state, "Q1", "Basis", [{ playerId: p1.id, guess: "A", rank: 30, points: 30 }]);
    expect(isGameOver(state)).toBe(false);
  });
});

describe("adjustRoundScore", () => {
  it("overrides a player's points and clamps to non-negative integers", () => {
    let state = addPlayer(emptyGameState, "Dimash");
    const [p1] = state.players;
    state = addRound(state, "Q1", "Basis", [{ playerId: p1.id, guess: "A", rank: null, points: 0 }]);
    const roundId = state.rounds[0].id;

    state = adjustRoundScore(state, roundId, p1.id, 12);
    expect(calculateTotals(state)[p1.id]).toBe(12);

    state = adjustRoundScore(state, roundId, p1.id, -5);
    expect(calculateTotals(state)[p1.id]).toBe(0);
  });
});

describe("startNewGame", () => {
  it("clears rounds but keeps players and target", () => {
    let state = setTarget(addPlayer(emptyGameState, "Dimash"), { mode: "points", value: 50 });
    const [p1] = state.players;
    state = addRound(state, "Q1", "Basis", [{ playerId: p1.id, guess: "A", rank: 1, points: 1 }]);
    state = startNewGame(state);
    expect(state.rounds).toEqual([]);
    expect(state.players).toHaveLength(1);
    expect(state.target).toEqual({ mode: "points", value: 50 });
  });
});

describe("parseStoredGameState", () => {
  it("falls back to empty state when data is missing or invalid", () => {
    expect(parseStoredGameState(null)).toEqual(emptyGameState);
    expect(parseStoredGameState("{")).toEqual(emptyGameState);
    expect(parseStoredGameState(JSON.stringify({ players: [], rounds: [] }))).toEqual(emptyGameState);
  });

  it("defaults the target for games saved before targets existed", () => {
    const legacy = JSON.stringify({ players: [{ id: "p1", name: "A" }], rounds: [] });
    expect(parseStoredGameState(legacy).target).toEqual({ mode: "endless" });
  });
});
