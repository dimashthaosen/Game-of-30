"use client";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Eraser,
  ExternalLink,
  HelpCircle,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Trophy,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  addPlayer,
  addRound,
  calculateTotals,
  emptyGameState,
  parseStoredGameState,
  removePlayer,
  renamePlayer,
  STORAGE_KEY,
  type GameState,
} from "@/lib/game";
import type { Top30Item, Top30Result } from "@/lib/top30";

type ApiState = "idle" | "loading" | "success" | "error";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function blankScores(players: GameState["players"]): Record<string, number> {
  return players.reduce<Record<string, number>>((scores, player) => {
    scores[player.id] = 0;
    return scores;
  }, {});
}

function normalizeEditedItems(items: Top30Item[]): Top30Item[] {
  return items.map((item, index) => ({
    ...item,
    rank: index + 1,
    name: item.name.trim() || `Item ${index + 1}`,
    sourceUrls: item.sourceUrls ?? [],
  }));
}

export default function Home() {
  const [game, setGame] = useState<GameState>(emptyGameState);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [question, setQuestion] = useState("");
  const [apiState, setApiState] = useState<ApiState>("idle");
  const [error, setError] = useState("");
  const [currentResult, setCurrentResult] = useState<Top30Result | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [expandedRoundId, setExpandedRoundId] = useState<string | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  useEffect(() => {
    setGame(parseStoredGameState(window.localStorage.getItem(STORAGE_KEY)));
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
    }
  }, [game, hasLoaded]);

  useEffect(() => {
    setScores((previous) => ({
      ...blankScores(game.players),
      ...previous,
    }));
  }, [game.players]);

  useEffect(() => {
    if (!isRulesOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsRulesOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isRulesOpen]);

  const totals = useMemo(() => calculateTotals(game), [game]);
  const sortedPlayers = useMemo(
    () => [...game.players].sort((a, b) => (totals[b.id] ?? 0) - (totals[a.id] ?? 0)),
    [game.players, totals],
  );

  async function generateTop30() {
    const trimmed = question.trim();
    if (!trimmed) {
      setError("Enter a question first.");
      setApiState("error");
      return;
    }

    setApiState("loading");
    setError("");
    setCurrentResult(null);

    try {
      const response = await fetch("/api/top-30", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      let data: Top30Result | { error?: string };
      try {
        data = (await response.json()) as Top30Result | { error?: string };
      } catch {
        throw new Error("The server returned an unexpected response. Please try again.");
      }

      if (!response.ok) {
        throw new Error("error" in data && data.error ? data.error : "The ranked list could not be generated.");
      }

      setCurrentResult(data as Top30Result);
      setScores(blankScores(game.players));
      setApiState("success");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "The ranked list could not be generated.");
      setApiState("error");
    }
  }

  function addNamedPlayer() {
    setGame((state) => addPlayer(state, newPlayerName || `Player ${state.players.length + 1}`));
    setNewPlayerName("");
  }

  function saveRound() {
    if (!currentResult) {
      return;
    }

    const cleanedResult = {
      ...currentResult,
      items: normalizeEditedItems(currentResult.items),
    };

    setGame((state) => addRound(state, cleanedResult, scores));
    setCurrentResult(null);
    setQuestion("");
    setScores(blankScores(game.players));
    setApiState("idle");
  }

  function resetGame() {
    setGame(emptyGameState);
    setCurrentResult(null);
    setScores({});
    setQuestion("");
    setApiState("idle");
    setError("");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function updateCurrentItem(rank: number, field: keyof Pick<Top30Item, "name" | "value" | "note">, value: string) {
    setCurrentResult((result) => {
      if (!result) {
        return result;
      }

      return {
        ...result,
        items: result.items.map((item) => (item.rank === rank ? { ...item, [field]: value } : item)),
      };
    });
  }

  return (
    <main className="app-shell">
      <section className="top-bar">
        <div>
          <p className="eyebrow">Local party mode</p>
          <h1>Game of 30</h1>
        </div>
        <div className="top-actions">
          <button className="icon-button" type="button" onClick={() => setIsRulesOpen(true)} aria-label="Game rules" title="Game rules">
            <HelpCircle aria-hidden="true" size={18} />
          </button>
          <button className="icon-button danger" type="button" onClick={resetGame} aria-label="Reset game" title="Reset game">
            <RefreshCw aria-hidden="true" size={18} />
          </button>
        </div>
      </section>

      {isRulesOpen ? (
        <div className="rules-backdrop" role="presentation" onClick={() => setIsRulesOpen(false)}>
          <section
            aria-labelledby="rules-title"
            aria-modal="true"
            className="rules-dialog"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="rules-header">
              <div>
                <p className="eyebrow">How to play</p>
                <h2 id="rules-title">Game rules</h2>
              </div>
              <button className="icon-button ghost" type="button" onClick={() => setIsRulesOpen(false)} aria-label="Close rules" title="Close rules">
                <X aria-hidden="true" size={18} />
              </button>
            </div>

            <ol className="rules-list">
              <li>Pick a ranked question everyone can understand, like most populous countries or biggest movie franchises.</li>
              <li>Everyone makes one guess before the answer list is revealed.</li>
              <li>The app generates a Top 30 list, and you can edit the list if the casual search needs cleanup.</li>
              <li>Rank number equals points: rank 1 gives 1 point, rank 25 gives 25 points.</li>
              <li>If a guess is not in the Top 30, the usual score is 0.</li>
              <li>Enter points manually for each player and save the round. Highest total wins.</li>
            </ol>
          </section>
        </div>
      ) : null}

      <section className="layout-grid">
        <aside className="scoreboard panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Players</p>
              <h2>Scoreboard</h2>
            </div>
            <Trophy className="panel-icon" aria-hidden="true" size={22} />
          </div>

          <div className="add-player">
            <input
              aria-label="New player name"
              placeholder="New player"
              value={newPlayerName}
              onChange={(event) => setNewPlayerName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  addNamedPlayer();
                }
              }}
            />
            <button className="icon-button" type="button" onClick={addNamedPlayer} aria-label="Add player" title="Add player">
              <UserPlus aria-hidden="true" size={18} />
            </button>
          </div>

          {game.players.length === 0 ? (
            <div className="empty-state">Add players before saving scores.</div>
          ) : (
            <ol className="player-list">
              {sortedPlayers.map((player, index) => (
                <li key={player.id} className="player-row">
                  <span className="place">{index + 1}</span>
                  <input
                    aria-label={`Name for ${player.name}`}
                    value={player.name}
                    onChange={(event) => setGame((state) => renamePlayer(state, player.id, event.target.value))}
                  />
                  <strong>{totals[player.id] ?? 0}</strong>
                  <button
                    className="icon-button ghost"
                    type="button"
                    onClick={() => setGame((state) => removePlayer(state, player.id))}
                    aria-label={`Remove ${player.name}`}
                    title="Remove player"
                  >
                    <Trash2 aria-hidden="true" size={16} />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </aside>

        <section className="game-column">
          <section className="question-panel panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Round setup</p>
                <h2>Ask a ranked question</h2>
              </div>
              <button
                className="icon-button"
                type="button"
                onClick={() => setQuestion("")}
                aria-label="Clear question"
                title="Clear question"
              >
                <Eraser aria-hidden="true" size={18} />
              </button>
            </div>

            <div className="question-row">
              <textarea
                aria-label="Round question"
                placeholder="Which countries have the largest populations?"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />
              <button className="primary-button" type="button" onClick={generateTop30} disabled={apiState === "loading"}>
                {apiState === "loading" ? <Loader2 aria-hidden="true" className="spin" size={18} /> : <Search aria-hidden="true" size={18} />}
                Generate
              </button>
            </div>

            {apiState === "error" ? <div className="alert">{error}</div> : null}
          </section>

          {currentResult ? (
            <section className="result-grid">
              <div className="ranking-panel panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Reveal</p>
                    <h2>{currentResult.title}</h2>
                    <p className="muted">{currentResult.rankingBasis}</p>
                  </div>
                </div>

                {currentResult.warnings.length > 0 ? (
                  <div className="warning-list">
                    {currentResult.warnings.map((warning) => (
                      <span key={warning}>{warning}</span>
                    ))}
                  </div>
                ) : null}

                <div className="ranking-list">
                  {currentResult.items.map((item) => (
                    <div key={item.rank} className="ranking-row">
                      <span className="rank">{item.rank}</span>
                      <input
                        aria-label={`Rank ${item.rank} name`}
                        value={item.name}
                        onChange={(event) => updateCurrentItem(item.rank, "name", event.target.value)}
                      />
                      <input
                        aria-label={`Rank ${item.rank} value`}
                        placeholder="Value"
                        value={item.value ?? ""}
                        onChange={(event) => updateCurrentItem(item.rank, "value", event.target.value)}
                      />
                      <input
                        aria-label={`Rank ${item.rank} note`}
                        placeholder="Note"
                        value={item.note ?? ""}
                        onChange={(event) => updateCurrentItem(item.rank, "note", event.target.value)}
                      />
                    </div>
                  ))}
                </div>

                {currentResult.sources.length > 0 ? (
                  <div className="sources">
                    {currentResult.sources.map((source) => (
                      <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                        <ExternalLink aria-hidden="true" size={14} />
                        {source.title}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="panel score-entry">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Manual scoring</p>
                    <h2>Enter points</h2>
                  </div>
                </div>

                {game.players.length === 0 ? (
                  <div className="empty-state">Add players to save this round.</div>
                ) : (
                  <div className="score-inputs">
                    {game.players.map((player) => (
                      <label key={player.id}>
                        <span>{player.name}</span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={scores[player.id] ?? 0}
                          onChange={(event) =>
                            setScores((previous) => ({
                              ...previous,
                              [player.id]: Math.max(0, Math.floor(Number(event.target.value) || 0)),
                            }))
                          }
                        />
                      </label>
                    ))}
                  </div>
                )}

                <button className="primary-button save-button" type="button" onClick={saveRound} disabled={game.players.length === 0}>
                  <Check aria-hidden="true" size={18} />
                  Save round
                </button>
              </div>
            </section>
          ) : (
            <section className="panel idle-board">
              <Plus aria-hidden="true" size={24} />
              <span>Generate a list to reveal the round table.</span>
            </section>
          )}
        </section>
      </section>

      <section className="history panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Saved rounds</p>
            <h2>Round history</h2>
          </div>
        </div>

        {game.rounds.length === 0 ? (
          <div className="empty-state">No saved rounds yet.</div>
        ) : (
          <div className="round-list">
            {game.rounds.map((round) => (
              <article key={round.id} className="round-card">
                <button
                  type="button"
                  className="round-summary"
                  onClick={() => setExpandedRoundId((current) => (current === round.id ? null : round.id))}
                >
                  <span>
                    <strong>{round.title}</strong>
                    <small>{formatDate(round.createdAt)}</small>
                  </span>
                  {expandedRoundId === round.id ? <ChevronUp aria-hidden="true" size={18} /> : <ChevronDown aria-hidden="true" size={18} />}
                </button>

                {expandedRoundId === round.id ? (
                  <div className="round-detail">
                    <p>{round.question}</p>
                    <div className="round-scores">
                      {round.scores.map((score) => {
                        const player = game.players.find((item) => item.id === score.playerId);
                        return (
                          <span key={score.playerId}>
                            {player?.name ?? "Removed player"}: <strong>{score.points}</strong>
                          </span>
                        );
                      })}
                    </div>
                    {round.result ? (
                      <ol>
                        {round.result.items.slice(0, 10).map((item) => (
                          <li key={item.rank}>
                            {item.name}
                            {item.value ? <span> · {item.value}</span> : null}
                          </li>
                        ))}
                      </ol>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
