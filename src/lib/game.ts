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

/** Levenshtein edit distance between two strings. */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

/** How many typos to forgive, scaled to the length of the guess. */
function fuzzyThreshold(len: number): number {
  if (len <= 4) return 1;
  if (len <= 7) return 2;
  return 3;
}

export function matchGuess(
  items: QuestionItem[],
  aliases: Record<string, string[]> | undefined,
  guess: string
): QuestionItem | null {
  const g = norm(guess);
  if (!g) return null;

  const candsFor = (item: QuestionItem) =>
    [item.name, ...(aliases?.[item.name] ?? [])].map(norm).filter(Boolean);

  // 1) exact (normalized) match against names + aliases
  for (const item of items) {
    if (candsFor(item).some((c) => c === g)) return item;
  }

  if (g.length < 4) return null;

  // 2) substring containment (e.g. "united states of america" ⊃ "united states")
  for (const item of items) {
    if (candsFor(item).some((c) => c.includes(g) || g.includes(c))) return item;
  }

  // 3) fuzzy: forgive small typos by edit distance.
  //    Take the single closest answer, and reject ambiguous ties between
  //    different items so a typo never silently lands on the wrong rank.
  const threshold = fuzzyThreshold(g.length);
  let best: { item: QuestionItem; dist: number } | null = null;
  let ambiguous = false;

  for (const item of items) {
    for (const c of candsFor(item)) {
      // skip very short aliases (e.g. "up", "cr7") — too easy to false-match
      if (c.length < 4) continue;
      const d = editDistance(g, c);
      if (d > threshold) continue;
      if (!best || d < best.dist) {
        best = { item, dist: d };
        ambiguous = false;
      } else if (d === best.dist && item !== best.item) {
        ambiguous = true;
      }
    }
  }

  return best && !ambiguous ? best.item : null;
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
