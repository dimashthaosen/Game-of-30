import type { Top30Result } from "@/lib/top30";

export const STORAGE_KEY = "game-of-30:v1";

export type Player = {
  id: string;
  name: string;
};

export type RoundScore = {
  playerId: string;
  points: number;
};

export type GameRound = {
  id: string;
  question: string;
  title: string;
  rankingBasis: string;
  createdAt: string;
  scores: RoundScore[];
  result: Top30Result | null;
};

export type GameState = {
  players: Player[];
  rounds: GameRound[];
};

export const emptyGameState: GameState = {
  players: [],
  rounds: [],
};

export function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createPlayer(name: string): Player {
  return {
    id: createId("player"),
    name: name.trim() || "Player",
  };
}

export function addPlayer(state: GameState, name: string): GameState {
  return {
    ...state,
    players: [...state.players, createPlayer(name)],
  };
}

export function removePlayer(state: GameState, playerId: string): GameState {
  return {
    players: state.players.filter((player) => player.id !== playerId),
    rounds: state.rounds.map((round) => ({
      ...round,
      scores: round.scores.filter((score) => score.playerId !== playerId),
    })),
  };
}

export function renamePlayer(state: GameState, playerId: string, name: string): GameState {
  return {
    ...state,
    players: state.players.map((player) =>
      player.id === playerId ? { ...player, name: name.trim() || "Player" } : player,
    ),
  };
}

export function normalizePoints(value: string | number): number {
  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue) || numberValue < 0) {
    return 0;
  }
  return Math.floor(numberValue);
}

export function calculateTotals(state: GameState): Record<string, number> {
  return state.players.reduce<Record<string, number>>((totals, player) => {
    totals[player.id] = state.rounds.reduce((sum, round) => {
      const score = round.scores.find((item) => item.playerId === player.id);
      return sum + (score?.points ?? 0);
    }, 0);
    return totals;
  }, {});
}

export function createRound(result: Top30Result, scores: RoundScore[]): GameRound {
  return {
    id: createId("round"),
    question: result.question,
    title: result.title,
    rankingBasis: result.rankingBasis,
    createdAt: new Date().toISOString(),
    scores,
    result,
  };
}

export function addRound(state: GameState, result: Top30Result, pointsByPlayerId: Record<string, number>): GameState {
  const scores = state.players.map((player) => ({
    playerId: player.id,
    points: normalizePoints(pointsByPlayerId[player.id] ?? 0),
  }));

  return {
    ...state,
    rounds: [createRound(result, scores), ...state.rounds],
  };
}

export function parseStoredGameState(value: string | null): GameState {
  if (!value) {
    return emptyGameState;
  }

  try {
    const parsed = JSON.parse(value) as GameState;
    if (!Array.isArray(parsed.players) || !Array.isArray(parsed.rounds)) {
      return emptyGameState;
    }
    return parsed;
  } catch {
    return emptyGameState;
  }
}
