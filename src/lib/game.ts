import type { QuestionItem } from "@/lib/questions";

export const STORAGE_KEY = "game-of-30:v2";

export type Player = {
  id: string;
  name: string;
};

export type PlayerResult = {
  playerId: string;
  guess: string;
  rank: number | null;
  points: number;
};

export type GameRound = {
  id: string;
  question: string;
  basis: string;
  createdAt: string;
  results: PlayerResult[];
};

export type GameTarget =
  | { mode: "endless" }
  | { mode: "points"; value: number }
  | { mode: "rounds"; value: number };

export type GameState = {
  players: Player[];
  rounds: GameRound[];
  target: GameTarget;
};

export const DEFAULT_TARGET: GameTarget = { mode: "endless" };

export const emptyGameState: GameState = { players: [], rounds: [], target: DEFAULT_TARGET };

export function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function addPlayer(state: GameState, name: string): GameState {
  return {
    ...state,
    players: [...state.players, { id: createId("p"), name: name.trim() || "Player" }],
  };
}

export function removePlayer(state: GameState, playerId: string): GameState {
  return {
    ...state,
    players: state.players.filter((p) => p.id !== playerId),
    rounds: state.rounds.map((r) => ({
      ...r,
      results: r.results.filter((x) => x.playerId !== playerId),
    })),
  };
}

export function renamePlayer(state: GameState, playerId: string, name: string): GameState {
  return {
    ...state,
    players: state.players.map((p) =>
      p.id === playerId ? { ...p, name: name.trim() || p.name } : p
    ),
  };
}

export function calculateTotals(state: GameState): Record<string, number> {
  return state.players.reduce<Record<string, number>>((totals, player) => {
    totals[player.id] = state.rounds.reduce((sum, round) => {
      const result = round.results.find((r) => r.playerId === player.id);
      return sum + (result?.points ?? 0);
    }, 0);
    return totals;
  }, {});
}

function norm(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\b(the|a|an|of)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchGuess(
  items: QuestionItem[],
  aliases: Record<string, string[]> | undefined,
  guess: string
): QuestionItem | null {
  const g = norm(guess);
  if (!g) return null;
  for (const item of items) {
    const cands = [item.name, ...(aliases?.[item.name] ?? [])].map(norm);
    if (cands.some((c) => c && c === g)) return item;
  }
  if (g.length >= 4) {
    for (const item of items) {
      const cands = [item.name, ...(aliases?.[item.name] ?? [])].map(norm);
      if (cands.some((c) => c && (c.includes(g) || g.includes(c)))) return item;
    }
  }
  return null;
}

export function addRound(
  state: GameState,
  question: string,
  basis: string,
  results: PlayerResult[]
): GameState {
  const round: GameRound = {
    id: createId("round"),
    question,
    basis,
    createdAt: new Date().toISOString(),
    results,
  };
  return { ...state, rounds: [round, ...state.rounds] };
}

export function setTarget(state: GameState, target: GameTarget): GameState {
  return { ...state, target };
}

export function adjustRoundScore(
  state: GameState,
  roundId: string,
  playerId: string,
  points: number
): GameState {
  const safe = Number.isFinite(points) ? Math.max(0, Math.floor(points)) : 0;
  return {
    ...state,
    rounds: state.rounds.map((round) =>
      round.id === roundId
        ? {
            ...round,
            results: round.results.map((r) =>
              r.playerId === playerId ? { ...r, points: safe } : r
            ),
          }
        : round
    ),
  };
}

export function startNewGame(state: GameState): GameState {
  return { ...state, rounds: [] };
}

/** Returns true once the game's target has been reached. */
export function isGameOver(state: GameState): boolean {
  if (state.rounds.length === 0) return false;
  const target = state.target ?? DEFAULT_TARGET;
  if (target.mode === "rounds") return state.rounds.length >= target.value;
  if (target.mode === "points") {
    const totals = calculateTotals(state);
    return Object.values(totals).some((t) => t >= target.value);
  }
  return false;
}

export function describeTarget(target: GameTarget): string {
  if (target.mode === "points") return `Play to ${target.value}`;
  if (target.mode === "rounds") return `${target.value} rounds`;
  return "Endless";
}

export function parseStoredGameState(value: string | null): GameState {
  if (!value) return emptyGameState;
  try {
    const parsed = JSON.parse(value) as Partial<GameState>;
    if (!Array.isArray(parsed.players) || !Array.isArray(parsed.rounds)) return emptyGameState;
    return {
      players: parsed.players,
      rounds: parsed.rounds,
      target: parsed.target ?? DEFAULT_TARGET,
    };
  } catch {
    return emptyGameState;
  }
}
