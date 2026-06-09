"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
  STORAGE_KEY,
  type GameState,
  type GameTarget,
  type PlayerResult,
} from "@/lib/game";
import { CURATED_QUESTIONS, CURATED_THEME_GROUPS, type QuestionItem } from "@/lib/questions";
import type { Top30Result } from "@/lib/top30";

type AppView = "home" | "question" | "guess" | "reveal" | "results" | "finale";

const TARGET_PRESETS: { label: string; target: GameTarget }[] = [
  { label: "Endless", target: { mode: "endless" } },
  { label: "50 pts", target: { mode: "points", value: 50 } },
  { label: "100 pts", target: { mode: "points", value: 100 } },
  { label: "5 rounds", target: { mode: "rounds", value: 5 } },
];

function sameTarget(a: GameTarget, b: GameTarget): boolean {
  if (a.mode !== b.mode) return false;
  if (a.mode === "endless" || b.mode === "endless") return true;
  return a.value === b.value;
}

type ActiveQuestion = {
  id: string;
  cat: string;
  q: string;
  basis: string;
  items: QuestionItem[];
  aliases?: Record<string, string[]>;
};

// ===== ICONS =====

type IconProps = { size?: number; className?: string };

function Svg({ size = 20, children, className }: IconProps & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  );
}

const IcoHelp = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M9.2 9.3a2.8 2.8 0 0 1 5.4 1c0 1.9-2.6 2.2-2.6 3.7" /><circle cx="12" cy="17.4" r="0.6" fill="currentColor" stroke="none" /></Svg>
);
const IcoClose = (p: IconProps) => <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>;
const IcoBack = (p: IconProps) => <Svg {...p}><path d="M15 5l-7 7 7 7" /></Svg>;
const IcoPlus = (p: IconProps) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;
const IcoMinus = (p: IconProps) => <Svg {...p}><path d="M5 12h14" /></Svg>;
const IcoHistory = (p: IconProps) => (
  <Svg {...p}><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" /><path d="M3 4v3.5h3.5" /><path d="M12 8v4l2.5 1.5" /></Svg>
);
const IcoReset = (p: IconProps) => (
  <Svg {...p}><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" /><path d="M3 4v3.5h3.5" /></Svg>
);
const IcoChevron = (p: IconProps) => <Svg {...p}><path d="M9 6l6 6-6 6" /></Svg>;
const IcoCrown = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 7.5l3.6 3 3.4-5.2a1.2 1.2 0 0 1 2 0l3.4 5.2 3.6-3c.9-.7 2.1.2 1.7 1.2l-2 7.1a1 1 0 0 1-1 .7H5.3a1 1 0 0 1-1-.7l-2-7.1c-.4-1 .8-1.9 1.7-1.2z" />
  </svg>
);
const IcoTrophy = (p: IconProps) => (
  <Svg {...p}><path d="M7 4h10v3a5 5 0 0 1-10 0V4z" /><path d="M7 5H4.5a2.5 2.5 0 0 0 3 3M17 5h2.5a2.5 2.5 0 0 1-3 3" /><path d="M12 12v3M9 19h6M10 19c0-1.5.5-2 2-2s2 .5 2 2" /></Svg>
);
const IcoLock = (p: IconProps) => (
  <Svg {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>
);
const IcoEye = (p: IconProps) => (
  <Svg {...p}><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" /><circle cx="12" cy="12" r="2.6" /></Svg>
);
const IcoTarget = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" /></Svg>
);
const IcoLoader = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className={className}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

// ===== AVATAR =====

const AV_COLORS = ["#f4c430", "#8ec6b0", "#f0a868", "#a8c6f0", "#e69bbf", "#c3b1e1", "#b8d98a", "#f08c8c"];

function avatarColor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h * 31) + id.charCodeAt(i)) >>> 0;
  return AV_COLORS[h % AV_COLORS.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Avatar({ player, size = 30 }: { player: { id: string; name: string }; size?: number }) {
  return (
    <span className="avatar" style={{ width: size, height: size, background: avatarColor(player.id), fontSize: size * 0.38 }}>
      {initials(player.name)}
    </span>
  );
}

// ===== SHARED UI =====

function TopBar({ onBack, onHelp, onHistory, onReset }: { onBack?: () => void; onHelp?: () => void; onHistory?: () => void; onReset?: () => void }) {
  return (
    <header className="topbar">
      {onBack ? (
        <button className="iconbtn" onClick={onBack} aria-label="Back"><IcoBack /></button>
      ) : (
        <div className="topbar-title">
          <span>Game of</span>
          <span className="num">30</span>
        </div>
      )}
      <div className="spacer" />
      <div className="topbar-actions">
        {onReset && <button className="iconbtn" onClick={onReset} aria-label="Reset game"><IcoReset /></button>}
        {onHistory && <button className="iconbtn" onClick={onHistory} aria-label="History"><IcoHistory /></button>}
        {onHelp && <button className="iconbtn" onClick={onHelp} aria-label="How to play"><IcoHelp /></button>}
      </div>
    </header>
  );
}

function Sheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="sheet-grip" />
        {children}
      </div>
    </div>
  );
}

const RULES: [string, React.ReactNode][] = [
  ["Pick a list", <>Choose a ranked question everyone gets, like <b>most populous countries</b> or <b>biggest movie franchises</b>.</>],
  ["Everyone guesses secretly", <>Pass the phone around. Each player secretly names <b>one</b> thing they think is on the Top&nbsp;30 — no peeking at others&rsquo; answers.</>],
  ["Rank equals points", <>Your guess scores <b>its rank number</b>. Guess #1 and you get just <b>1 point</b>. Guess #28 and you bank <b>28</b>. Aim low.</>],
  ["Duplicates split the points", <>If two players guess the <b>same answer</b>, they <b>split</b> the points equally. Half the reward for half the originality.</>],
  ["Miss the list, score zero", <>A guess not in the Top&nbsp;30 is worth <b>0</b>. Highest total after all rounds wins — ties are broken by whoever scored highest in the last round.</>],
];

function RulesSheet({ onClose }: { onClose: () => void }) {
  return (
    <Sheet onClose={onClose}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
        <div>
          <div className="eyebrow">How to play</div>
          <h2 className="display" style={{ marginTop: 4 }}>The rules</h2>
        </div>
        <button className="iconbtn" onClick={onClose} aria-label="Close"><IcoClose /></button>
      </div>
      <div>
        {RULES.map(([title, body], i) => (
          <div className="rules-step" key={i}>
            <div className="n">{i + 1}</div>
            <div>
              <b style={{ fontSize: "1.02rem" }}>{title}</b>
              <p>{body}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="btn primary block" style={{ marginTop: 18 }} onClick={onClose}>Got it</button>
    </Sheet>
  );
}

function HistorySheet({ game, onClose }: { game: GameState; onClose: () => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const nameOf = (id: string) => game.players.find((p) => p.id === id)?.name ?? "Removed";

  return (
    <Sheet onClose={onClose}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <div className="eyebrow">Game log</div>
          <h2 className="display" style={{ marginTop: 4 }}>Round history</h2>
        </div>
        <button className="iconbtn" onClick={onClose} aria-label="Close"><IcoClose /></button>
      </div>
      {game.rounds.length === 0 ? (
        <div className="empty">No rounds played yet.</div>
      ) : (
        <div className="stack" style={{ gap: 10 }}>
          {game.rounds.map((round, i) => {
            const isOpen = open === round.id;
            const ranked = [...round.results].sort((a, b) => b.points - a.points);
            return (
              <div className="card" key={round.id} style={{ padding: 0, overflow: "hidden" }}>
                <button
                  className="row"
                  style={{ width: "100%", justifyContent: "space-between", gap: 12, padding: 14, textAlign: "left" }}
                  onClick={() => setOpen(isOpen ? null : round.id)}
                >
                  <span>
                    <span className="eyebrow" style={{ color: "var(--ink-3)" }}>Round {game.rounds.length - i}</span>
                    <span style={{ display: "block", fontWeight: 600, marginTop: 3, lineHeight: 1.2 }}>{round.question}</span>
                  </span>
                  <span style={{ color: "var(--ink-3)", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 160ms ease" }}>
                    <IcoChevron />
                  </span>
                </button>
                {isOpen && (
                  <div style={{ borderTop: "1px solid var(--line)", padding: 14 }}>
                    <div className="score-list">
                      {ranked.map((r) => (
                        <div className="score-row" key={r.playerId} style={{ padding: "8px 2px" }}>
                          <span className="place" />
                          <span className="who">
                            {nameOf(r.playerId)}
                            {r.guess
                              ? <span className="muted" style={{ fontWeight: 400, fontSize: "0.85rem" }}>· &ldquo;{r.guess}&rdquo;</span>
                              : null}
                          </span>
                          <span className="pts tnum" style={{ fontSize: "1.2rem" }}>+{r.points}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Sheet>
  );
}

// ===== HOME SCREEN =====

function HomeScreen({
  game, totals, standings, onStart, onAddPlayer, onRemovePlayer, onRenamePlayer, onSetTarget, onReset, onHelp, onHistory,
}: {
  game: GameState;
  totals: Record<string, number>;
  standings: GameState["players"];
  onStart: () => void;
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
  onRenamePlayer: (id: string, name: string) => void;
  onSetTarget: (target: GameTarget) => void;
  onReset: () => void;
  onHelp: () => void;
  onHistory: (() => void) | null;
}) {
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const hasRounds = game.rounds.length > 0;

  const add = () => {
    const v = name.trim();
    if (!v) return;
    onAddPlayer(v);
    setName("");
  };

  return (
    <>
      <TopBar
        onHelp={onHelp}
        onHistory={hasRounds && onHistory ? onHistory : undefined}
        onReset={hasRounds ? onReset : undefined}
      />
      <div className="screen screen-enter">
        <div style={{ marginBottom: 18 }}>
          <div className="eyebrow">A local party game</div>
          <h1 className="display" style={{ margin: "8px 0 10px" }}>Aim for<br />the bottom.</h1>
          <p className="lede" style={{ maxWidth: 360 }}>
            Name something that <em>barely</em> cracks the Top&nbsp;30. The lower it ranks, the more you score.
          </p>
        </div>

        {hasRounds && (
          <div className="card" style={{ padding: "8px 16px 6px", marginBottom: 18 }}>
            <div className="row" style={{ justifyContent: "space-between", padding: "10px 0 6px" }}>
              <span className="eyebrow">Standings</span>
              <span className="eyebrow tnum">
                {game.rounds.length} {game.rounds.length === 1 ? "round" : "rounds"}
              </span>
            </div>
            <div className="score-list">
              {standings.map((p, i) => (
                <div className={`score-row${i === 0 ? " leader" : ""}`} key={p.id}>
                  <span className="place">
                    {i === 0 ? <span className="crown"><IcoCrown size={18} /></span> : i + 1}
                  </span>
                  <span className="who"><Avatar player={p} size={28} />{p.name}</span>
                  <span className="pts tnum">{totals[p.id] ?? 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="row" style={{ marginBottom: 8 }}>
          <span className="eyebrow">Players</span>
          <div className="spacer" />
          {game.players.length > 0 && <span className="eyebrow tnum">{game.players.length}</span>}
        </div>

        {game.players.length === 0 ? (
          <div className="empty" style={{ marginBottom: 14 }}>Add at least one player to start.</div>
        ) : (
          <div className="chips" style={{ marginBottom: 14 }}>
            {game.players.map((p) => (
              <span className="chip" key={p.id}>
                <span className="avatar" style={{ width: 22, height: 22, background: avatarColor(p.id), fontSize: 9 }}>
                  {initials(p.name)}
                </span>
                {editing === p.id ? (
                  <input
                    autoFocus
                    defaultValue={p.name}
                    style={{ border: "none", background: "transparent", width: 90, fontWeight: 600, outline: "none" }}
                    onBlur={(e) => { onRenamePlayer(p.id, e.currentTarget.value); setEditing(null); }}
                    onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                  />
                ) : (
                  <span onClick={() => setEditing(p.id)} style={{ cursor: "text" }}>{p.name}</span>
                )}
                <button className="x" onClick={() => onRemovePlayer(p.id)} aria-label={`Remove ${p.name}`}>
                  <IcoClose size={14} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="row" style={{ gap: 8, marginBottom: 24 }}>
          <input
            className="field"
            placeholder="Add a player…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") add(); }}
          />
          <button className="btn ghost sm" style={{ height: 52, flex: "none", paddingInline: 16 }} onClick={add} aria-label="Add player">
            <IcoPlus />
          </button>
        </div>

        <div className="mt-auto stack" style={{ gap: 10 }}>
          {!hasRounds && (
            <div style={{ marginBottom: 4 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Game length</div>
              <div className="chips">
                {TARGET_PRESETS.map((preset) => {
                  const active = sameTarget(game.target, preset.target);
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      className={`btn sm ${active ? "primary" : "ghost"}`}
                      style={{ flex: 1, minWidth: 0, paddingInline: 8 }}
                      onClick={() => onSetTarget(preset.target)}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <button className="btn primary block" disabled={game.players.length === 0} onClick={onStart}>
            <IcoTarget size={20} /> Start a round
          </button>
          <button className="btn ghost block" onClick={onHelp}>How to play</button>
        </div>
      </div>
    </>
  );
}

// ===== QUESTION SCREEN =====

function QuestionScreen({ roundNo, onPick, onBack, onHelp }: {
  roundNo: number;
  onPick: (q: ActiveQuestion) => void;
  onBack: () => void;
  onHelp: () => void;
}) {
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const finalRef = useRef<{ left: number; top: number; width: number; height: number; radius: number } | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef(false);

  const prefersReduced = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const toActive = (q: ActiveQuestion): ActiveQuestion =>
    ({ id: q.id, cat: q.cat, q: q.q, basis: q.basis, items: q.items, aliases: q.aliases });

  const pickRandom = () => {
    const q = CURATED_QUESTIONS[Math.floor(Math.random() * CURATED_QUESTIONS.length)];
    onPick(toActive(q));
  };

  const submitCustom = async () => {
    const trimmed = custom.trim();
    if (trimmed.length < 3 || loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/top-30", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      let data: Partial<Top30Result> & { error?: string };
      try {
        data = await response.json() as Partial<Top30Result> & { error?: string };
      } catch {
        throw new Error("The server returned an unexpected response. Please try again.");
      }
      if (!response.ok) throw new Error(data.error ?? "Could not generate a list. Try rephrasing.");
      const result = data as Top30Result;
      onPick({
        id: `ai_${Date.now()}`,
        cat: "AI Generated",
        q: result.question,
        basis: result.rankingBasis,
        items: result.items.map((item) => ({
          rank: item.rank,
          name: item.name,
          note: item.value ?? item.note ?? undefined,
        })),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ----- geometry helper -----
  const rectIn = (el: HTMLElement, shellRect: DOMRect) => {
    const r = el.getBoundingClientRect();
    return { left: r.left - shellRect.left, top: r.top - shellRect.top, width: r.width, height: r.height };
  };

  // ----- open -----
  const openThemeAt = (idx: number, el: HTMLElement) => {
    if (openIdx != null) return;
    const shell = el.closest(".app") as HTMLElement | null;
    if (!shell) return;
    originRef.current = rectIn(el, shell.getBoundingClientRect());
    lastFocusRef.current = el;
    setOpenIdx(idx);
  };

  useLayoutEffect(() => {
    if (openIdx == null) return;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;
    const shell = panel.closest(".app") as HTMLElement | null;
    if (!shell) return;
    const o = originRef.current!;
    const content = panel.querySelector(".theme-focus-content") as HTMLElement;
    const focusPanel = () => { panelRef.current?.focus(); };

    // Resolve a floating, content-sized final rect: a centered card that hugs
    // its content (capped to the shell), not a full-screen sheet.
    const sr = shell.getBoundingClientRect();
    const mobile = window.matchMedia("(max-width: 600px)").matches;
    const mx = mobile ? 16 : 28;
    const my = mobile ? 20 : 36;
    const width = Math.min(sr.width - 2 * mx, 440);
    const left = Math.round((sr.width - width) / 2);
    panel.style.left = `${left}px`;
    panel.style.top = `${my}px`;
    panel.style.width = `${width}px`;
    panel.style.height = "auto";
    panel.style.borderRadius = "18px";
    const natural = panel.offsetHeight;
    const maxH = sr.height - 2 * my;
    const height = Math.min(natural, maxH);
    const top = Math.round((sr.height - height) / 2);
    const f = { left, top, width, height, radius: 18 };
    finalRef.current = f;

    Object.assign(panel.style, {
      left: `${f.left}px`, top: `${f.top}px`,
      width: `${f.width}px`, height: `${f.height}px`, borderRadius: `${f.radius}px`,
    });

    // Lock the inner content to the FINAL size so it is laid out once and never
    // re-wraps while the panel animates. The panel's overflow:hidden clips it,
    // so the growing panel simply reveals the already-positioned text instead
    // of the text reflowing to fit each intermediate width.
    content.style.width = `${f.width}px`;
    content.style.height = `${f.height}px`;

    if (prefersReduced()) {
      backdrop.style.opacity = "1";
      content.style.opacity = "1";
      focusPanel();
      return;
    }

    const ease = "cubic-bezier(.2,.9,.25,1.05)";
    const dur = 440;
    // fill "none": the panel's resting state (inline final geometry + default
    // opacities) IS the correct end state, so a throttled/non-ticking engine
    // still shows it correctly; the animation only layers motion on top.
    backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: "ease", fill: "none" });
    panel.animate([
      { left: `${o.left}px`, top: `${o.top}px`, width: `${o.width}px`, height: `${o.height}px`, borderRadius: "14px" },
      { left: `${f.left}px`, top: `${f.top}px`, width: `${f.width}px`, height: `${f.height}px`, borderRadius: `${f.radius}px` },
    ], { duration: dur, easing: ease, fill: "none" });
    content.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur, easing: "ease", fill: "none" });
    const a = panel.getAnimations().pop();
    if (a) a.onfinish = focusPanel;

    // Guaranteed finish: after the animation's lifetime, cancel any still-running
    // animations and pin the final visible state (protects against a throttled
    // engine whose currentTime never advances).
    const timer = window.setTimeout(() => {
      if (panelRef.current !== panel) return;
      [panel, backdrop, content].forEach((el) => el.getAnimations().forEach((an) => an.cancel()));
      Object.assign(panel.style, {
        left: `${f.left}px`, top: `${f.top}px`,
        width: `${f.width}px`, height: `${f.height}px`, borderRadius: `${f.radius}px`,
      });
      content.style.opacity = "1";
      backdrop.style.opacity = "1";
      focusPanel();
    }, dur + 120);
    return () => window.clearTimeout(timer);
  }, [openIdx]);

  // ----- close -----
  const closeTheme = () => {
    if (closingRef.current) return;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const restore = () => {
      setOpenIdx(null);
      const el = lastFocusRef.current;
      // defer until React commits the card back to visible — focus() is ignored
      // on a visibility:hidden element
      window.setTimeout(() => el?.focus(), 0);
    };
    if (!panel || !backdrop || prefersReduced()) { restore(); return; }
    const o = originRef.current!;
    const shell = panel.closest(".app") as HTMLElement;
    const f = finalRef.current ?? { ...rectIn(panel, shell.getBoundingClientRect()), radius: 18 };
    const content = panel.querySelector(".theme-focus-content") as HTMLElement;
    closingRef.current = true;
    const ease = "cubic-bezier(.2,.8,.2,1)";
    const dur = 360;
    backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, easing: "ease", fill: "both" });
    content.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: "ease", fill: "both" });
    const a = panel.animate([
      { left: `${f.left}px`, top: `${f.top}px`, width: `${f.width}px`, height: `${f.height}px`, borderRadius: `${f.radius}px` },
      { left: `${o.left}px`, top: `${o.top}px`, width: `${o.width}px`, height: `${o.height}px`, borderRadius: "14px" },
    ], { duration: dur, easing: ease, fill: "both" });
    let settled = false;
    const finish = () => { if (settled) return; settled = true; closingRef.current = false; restore(); };
    a.onfinish = finish;
    window.setTimeout(finish, dur + 120);
  };

  // ----- focus trap + escape -----
  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeTheme(); return; }
    if (e.key !== "Tab") return;
    const panel = panelRef.current;
    if (!panel) return;
    const f = panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const theme = openIdx != null ? CURATED_THEME_GROUPS[openIdx] : null;

  return (
    <>
      <TopBar onBack={onBack} onHelp={onHelp} />
      <div className="screen screen-enter">
        <div style={{ marginBottom: 18 }}>
          <div className="eyebrow">Round {roundNo}</div>
          <h2 className="display" style={{ margin: "8px 0 6px" }}>Choose a list</h2>
          <p className="lede">Pick a theme. Everyone will guess one answer to the same question.</p>
        </div>

        <div className="theme-grid">
          {CURATED_THEME_GROUPS.map((th, i) => (
            <button
              key={th.name}
              type="button"
              className="theme-card"
              aria-haspopup="dialog"
              aria-expanded={openIdx === i}
              style={{ visibility: openIdx === i ? "hidden" : "visible" }}
              onClick={(e) => openThemeAt(i, e.currentTarget)}
            >
              <span className="theme-card-name">{th.name}</span>
              <span className="theme-card-blurb">{th.blurb}</span>
              <span className="theme-card-count"><b className="tnum">{th.questions.length}</b> lists</span>
            </button>
          ))}
        </div>

        <div className="row" style={{ gap: 10, alignItems: "center", margin: "20px 0 16px" }}>
          <hr className="divider" style={{ flex: 1 }} />
          <span className="eyebrow">or</span>
          <hr className="divider" style={{ flex: 1 }} />
        </div>

        <div className="card" style={{ padding: 14, marginBottom: 16 }}>
          <span className="eyebrow" style={{ color: "var(--ink-3)" }}>Ask the AI</span>
          <div className="row" style={{ gap: 8, marginTop: 8 }}>
            <input
              className="field"
              placeholder="e.g. Best-selling video games of all time"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitCustom(); }}
              disabled={loading}
            />
          </div>
          {error && <p style={{ margin: "8px 2px 0", fontSize: "0.85rem", color: "var(--bad)" }}>{error}</p>}
          <p style={{ margin: "8px 2px 0", fontSize: "0.82rem", color: "var(--ink-3)" }}>
            The AI generates a live Top 30 list from the web.
          </p>
          <button
            className="btn ghost block sm"
            style={{ marginTop: 10 }}
            disabled={custom.trim().length < 3 || loading}
            onClick={submitCustom}
          >
            {loading ? <><IcoLoader className="spin" /> Generating…</> : "Generate this list"}
          </button>
        </div>

        <button className="btn ghost block" onClick={pickRandom}>Surprise me</button>
      </div>

      {theme && (
        <>
          <div className="theme-backdrop" ref={backdropRef} onClick={closeTheme} />
          <div
            className="theme-focus"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="theme-focus-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onPanelKeyDown}
          >
            <div className="theme-focus-content">
              <div className="theme-focus-head">
                <div>
                  <div className="eyebrow"><b className="tnum">{theme.questions.length}</b> lists</div>
                  <h2 className="display" id="theme-focus-title" style={{ fontSize: "1.55rem", margin: "5px 0 3px", lineHeight: 1.05 }}>{theme.name}</h2>
                  <p className="muted" style={{ fontSize: "0.9rem", margin: 0 }}>{theme.blurb}</p>
                </div>
                <button className="iconbtn" onClick={closeTheme} aria-label="Close theme"><IcoClose /></button>
              </div>
              <div className="theme-focus-body">
                {theme.questions.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    className="pick-row theme-pick"
                    onClick={() => onPick({ id: q.id, cat: q.cat, q: q.q, basis: q.basis, items: q.items, aliases: q.aliases })}
                  >
                    <span>
                      <span className="eyebrow" style={{ color: "var(--ink-3)" }}>{q.cat}</span>
                      <span className="theme-pick-q">{q.q}</span>
                    </span>
                    <span style={{ color: "var(--ink-3)", flex: "none" }}><IcoChevron /></span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ===== GUESS SCREEN =====

function GuessScreen({ question, players, onComplete, onBack }: {
  question: ActiveQuestion;
  players: GameState["players"];
  onComplete: (guesses: Record<string, string>) => void;
  onBack: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"handoff" | "input">("handoff");
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<Record<string, string>>({});
  const player = players[idx];

  const lockIn = (val?: string) => {
    const g = (val ?? guess).trim();
    const next = { ...guesses, [player.id]: g };
    setGuesses(next);
    setGuess("");
    if (idx + 1 < players.length) {
      setIdx(idx + 1);
      setPhase("handoff");
    } else {
      onComplete(next);
    }
  };

  return (
    <>
      <TopBar onBack={onBack} />
      <div className="screen screen-enter" style={{ justifyContent: "space-between" }}>
        <div className="center" style={{ paddingTop: 6 }}>
          <div className="eyebrow">{question.cat}</div>
          <p className="display" style={{ fontSize: "1.25rem", margin: "8px 0 0", lineHeight: 1.2 }}>{question.q}</p>
        </div>

        {phase === "handoff" ? (
          <div className="center stack" style={{ alignItems: "center", gap: 18, padding: "10px 0" }}>
            <Avatar player={player} size={84} />
            <div>
              <div className="eyebrow">Pass the phone to</div>
              <h2 className="display" style={{ fontSize: "2.4rem", margin: "6px 0 0" }}>{player.name}</h2>
            </div>
            <p className="muted" style={{ maxWidth: 280 }}>Keep your answer secret. Tap when you&rsquo;re holding the phone.</p>
            <button className="btn dark" onClick={() => setPhase("input")}>
              <IcoEye size={18} /> I&rsquo;m {player.name}
            </button>
          </div>
        ) : (
          <div className="stack" style={{ gap: 14, padding: "4px 0" }}>
            <div className="center">
              <Avatar player={player} size={48} />
              <h2 className="display" style={{ fontSize: "1.4rem", margin: "8px 0 0" }}>{player.name}, your guess</h2>
              <p className="muted" style={{ fontSize: "0.9rem", marginTop: 4 }}>Aim deep — the rarer it ranks, the more you score.</p>
            </div>
            <input
              className="field big"
              autoFocus
              placeholder="One answer…"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && guess.trim()) lockIn(); }}
            />
            <button className="btn primary block" disabled={!guess.trim()} onClick={() => lockIn()}>
              <IcoLock size={18} /> Lock it in
            </button>
            <button className="btn ghost block sm" onClick={() => lockIn("")}>Skip — no guess</button>
          </div>
        )}

        <div className="dots" style={{ paddingTop: 6 }}>
          {players.map((p, i) => (
            <span key={p.id} className={`dot${i < idx ? " done" : i === idx ? " now" : ""}`} />
          ))}
        </div>
      </div>
    </>
  );
}

// ===== REVEAL SCREEN =====

function RevealScreen({ question, players, guesses, onDone, onBack }: {
  question: ActiveQuestion;
  players: GameState["players"];
  guesses: Record<string, string>;
  onDone: (results: PlayerResult[]) => void;
  onBack: () => void;
}) {
  const [started, setStarted] = useState(false);
  const [shown, setShown] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const order = question.items;
  const done = shown >= order.length;

  useEffect(() => {
    if (!started || done) return;
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 260 : 165);
    return () => clearTimeout(t);
  }, [started, shown, done]);

  useEffect(() => {
    if (scrollRef.current && started) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [shown, started]);

  const hitsByRank = useMemo(() => {
    const m: Record<number, Array<{ player: GameState["players"][0] }>> = {};
    players.forEach((p) => {
      const g = (guesses[p.id] ?? "").trim();
      if (!g) return;
      const item = matchGuess(question.items, question.aliases, g);
      if (item) (m[item.rank] = m[item.rank] ?? []).push({ player: p });
    });
    return m;
  }, [players, guesses, question]);

  const commitResults = () => {
    const results: PlayerResult[] = players.map((p) => {
      const guess = (guesses[p.id] ?? "").trim();
      const item = guess ? matchGuess(question.items, question.aliases, guess) : null;
      return { playerId: p.id, guess, rank: item?.rank ?? null, points: item?.rank ?? 0 };
    });
    onDone(results);
  };

  const sortedVisible = [...order.slice(0, shown)].sort((a, b) => a.rank - b.rank);

  return (
    <>
      <TopBar onBack={onBack} />
      <div className="screen" style={{ paddingBottom: 0 }}>
        <div style={{ marginBottom: 8 }}>
          <div className="eyebrow">{question.cat} · The reveal</div>
          <h2 className="display" style={{ fontSize: "1.5rem", margin: "6px 0 2px", lineHeight: 1.12 }}>{question.q}</h2>
          <p className="muted" style={{ fontSize: "0.85rem" }}>{question.basis}</p>
        </div>

        {!started ? (
          <div className="center stack mt-auto" style={{ alignItems: "center", gap: 16, justifyContent: "center", flex: 1 }}>
            <span style={{ color: "var(--accent)" }}><IcoTarget size={56} /></span>
            <div>
              <div className="eyebrow">All {players.length} {players.length === 1 ? "guess is" : "guesses are"} in</div>
              <h2 className="display" style={{ fontSize: "2rem", margin: "6px 0 0" }}>Ready?</h2>
            </div>
            <p className="muted" style={{ maxWidth: 280 }}>Watch the Top 30 count up from #1.</p>
            <button className="btn primary" onClick={() => setStarted(true)}>Reveal the Top 30</button>
          </div>
        ) : (
          <>
            <div className="row" style={{ justifyContent: "space-between", margin: "4px 0 8px" }}>
              <span className="eyebrow tnum">{Math.min(shown, order.length)} / {order.length}</span>
              {!done && (
                <button className="btn ghost sm" style={{ height: 34 }} onClick={() => setShown(order.length)}>
                  Reveal all
                </button>
              )}
            </div>
            <div className="reveal-list" ref={scrollRef} style={{ flex: 1, overflowY: "auto", margin: "0 -6px" }}>
              {sortedVisible.map((item) => {
                const hits = hitsByRank[item.rank] ?? [];
                return (
                  <div className={`reveal-row pop-in${hits.length ? " hit" : ""}`} key={item.rank}>
                    <span className="rk">{item.rank}</span>
                    <span className="nm">
                      {item.name}
                      {item.note && <small>{item.note}</small>}
                    </span>
                    {hits.length > 0 && (
                      <span className="guess-tags">
                        {hits.map((h) => (
                          <span className="guess-tag" key={h.player.id}>
                            {initials(h.player.name)} +{item.rank}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "12px 0 4px", flexShrink: 0 }}>
              <button className="btn primary block" disabled={!done} onClick={commitResults}>
                {done ? "See the scores" : "Revealing…"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ===== RESULTS SCREEN =====

function ResultsScreen({ results, roundNo, totals, standings, players, gameOver, onAdjustScore, onNext, onFinale, onHome }: {
  results: PlayerResult[];
  roundNo: number;
  totals: Record<string, number>;
  standings: GameState["players"];
  players: GameState["players"];
  gameOver: boolean;
  onAdjustScore: (playerId: string, points: number) => void;
  onNext: () => void;
  onFinale: () => void;
  onHome: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const ranked = [...results].sort((a, b) => b.points - a.points);
  const top = ranked[0];
  const tieCount = ranked.filter((r) => r.points === top?.points && top.points > 0).length;
  const winner = top && top.points > 0 && tieCount === 1 ? top : null;
  const nameOf = (id: string) => players.find((p) => p.id === id)?.name ?? "?";

  return (
    <>
      <TopBar />
      <div className="screen screen-enter">
        <div className="center" style={{ marginBottom: 16 }}>
          <div className="eyebrow">Round {roundNo} · scored</div>
          {winner ? (
            <>
              <div style={{ color: "var(--accent)", marginTop: 8 }}><IcoCrown size={40} /></div>
              <h2 className="display" style={{ fontSize: "2rem", margin: "4px 0 0" }}>{nameOf(winner.playerId)} takes it</h2>
              <p className="muted" style={{ marginTop: 4 }}>
                &ldquo;{winner.guess || "—"}&rdquo; {winner.rank ? `ranked #${winner.rank}` : ""} for{" "}
                <b style={{ color: "var(--ink)" }}>{winner.points} points</b>
              </p>
            </>
          ) : (
            <>
              <div style={{ color: "var(--ink-3)", marginTop: 8 }}><IcoTrophy size={36} /></div>
              <h2 className="display" style={{ fontSize: "1.7rem", margin: "4px 0 0" }}>
                {tieCount > 1 ? "It's a tie!" : "Round scored"}
              </h2>
            </>
          )}
        </div>

        <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
          <span className="eyebrow">This round</span>
          <button
            type="button"
            className="eyebrow"
            style={{ color: editing ? "var(--ink)" : "var(--ink-3)", letterSpacing: "0.08em" }}
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? "Done" : "Adjust"}
          </button>
        </div>
        <div className="card" style={{ padding: "4px 14px", margin: "0 0 18px" }}>
          {ranked.map((r) => (
            <div className="score-row" key={r.playerId}>
              <span className="place">
                <Avatar player={{ id: r.playerId, name: nameOf(r.playerId) }} size={28} />
              </span>
              <span className="who" style={{ flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                <b style={{ fontWeight: 600 }}>{nameOf(r.playerId)}</b>
                <span style={{ fontSize: "0.86rem", color: "var(--ink-2)" }}>
                  {r.guess ? `“${r.guess}”` : "no guess"}
                  {r.rank ? ` · #${r.rank}` : r.guess && !r.rank ? " · not on the list" : ""}
                </span>
              </span>
              {editing ? (
                <span className="row" style={{ gap: 8 }}>
                  <button
                    type="button"
                    className="iconbtn"
                    style={{ width: 30, height: 30, border: "1.5px solid var(--line-strong)" }}
                    onClick={() => onAdjustScore(r.playerId, r.points - 1)}
                    aria-label={`Lower ${nameOf(r.playerId)}'s score`}
                  >
                    <IcoMinus size={16} />
                  </button>
                  <span className="pts tnum" style={{ minWidth: 28, textAlign: "center", fontSize: "1.25rem" }}>{r.points}</span>
                  <button
                    type="button"
                    className="iconbtn"
                    style={{ width: 30, height: 30, border: "1.5px solid var(--line-strong)" }}
                    onClick={() => onAdjustScore(r.playerId, r.points + 1)}
                    aria-label={`Raise ${nameOf(r.playerId)}'s score`}
                  >
                    <IcoPlus size={16} />
                  </button>
                </span>
              ) : (
                <span className="pts tnum" style={{ color: r.points > 0 ? "var(--ink)" : "var(--ink-3)" }}>
                  +{r.points}
                </span>
              )}
            </div>
          ))}
        </div>

        <span className="eyebrow">Standings</span>
        <div className="card" style={{ padding: "4px 14px", margin: "8px 0 0" }}>
          {standings.map((p, i) => (
            <div className={`score-row${i === 0 ? " leader" : ""}`} key={p.id}>
              <span className="place">
                {i === 0 ? <span className="crown"><IcoCrown size={16} /></span> : i + 1}
              </span>
              <span className="who"><Avatar player={p} size={26} />{p.name}</span>
              <span className="pts tnum" style={{ fontSize: "1.25rem" }}>{totals[p.id] ?? 0}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto stack" style={{ gap: 10, paddingTop: 22 }}>
          {gameOver ? (
            <button className="btn primary block" onClick={onFinale}><IcoCrown size={18} /> See final results</button>
          ) : (
            <button className="btn primary block" onClick={onNext}><IcoTarget size={18} /> Next round</button>
          )}
          <button className="btn ghost block" onClick={onHome}>Back to home</button>
        </div>
      </div>
    </>
  );
}

// ===== FINALE SCREEN =====

function FinaleScreen({ standings, totals, onNewGame, onHome }: {
  standings: GameState["players"];
  totals: Record<string, number>;
  onNewGame: () => void;
  onHome: () => void;
}) {
  const topScore = standings.length ? totals[standings[0].id] ?? 0 : 0;
  const champions = standings.filter((p) => (totals[p.id] ?? 0) === topScore && topScore > 0);
  const tie = champions.length > 1;

  return (
    <>
      <TopBar />
      <div className="screen screen-enter">
        <div className="center" style={{ marginBottom: 20 }}>
          <div className="eyebrow">Game over</div>
          <div style={{ color: "var(--accent)", marginTop: 10 }}><IcoCrown size={48} /></div>
          {tie ? (
            <h1 className="display" style={{ fontSize: "2.2rem", margin: "8px 0 0" }}>It&rsquo;s a draw!</h1>
          ) : (
            <>
              <h1 className="display" style={{ fontSize: "2.4rem", margin: "8px 0 0" }}>{champions[0]?.name ?? "Nobody"} wins</h1>
              <p className="muted" style={{ marginTop: 6 }}>
                with <b style={{ color: "var(--ink)" }}>{topScore} points</b>
              </p>
            </>
          )}
        </div>

        <span className="eyebrow">Final standings</span>
        <div className="card" style={{ padding: "4px 14px", margin: "8px 0 0" }}>
          {standings.map((p, i) => (
            <div className={`score-row${i === 0 ? " leader" : ""}`} key={p.id}>
              <span className="place">
                {i === 0 ? <span className="crown"><IcoCrown size={18} /></span> : i + 1}
              </span>
              <span className="who"><Avatar player={p} size={28} />{p.name}</span>
              <span className="pts tnum">{totals[p.id] ?? 0}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto stack" style={{ gap: 10, paddingTop: 22 }}>
          <button className="btn primary block" onClick={onNewGame}><IcoTarget size={18} /> New game</button>
          <button className="btn ghost block" onClick={onHome}>Back to home</button>
        </div>
      </div>
    </>
  );
}

// ===== ROOT =====

export default function Home() {
  const [game, setGame] = useState<GameState>(emptyGameState);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [view, setView] = useState<AppView>("home");
  const [showRules, setShowRules] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<ActiveQuestion | null>(null);
  const [guesses, setGuesses] = useState<Record<string, string>>({});
  const [roundResults, setRoundResults] = useState<PlayerResult[] | null>(null);

  useEffect(() => {
    setGame(parseStoredGameState(window.localStorage.getItem(STORAGE_KEY)));
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  }, [game, hasLoaded]);

  // iOS Safari pans the page to keep a focused input above the on-screen
  // keyboard and can leave the page wedged half-scrolled after the keyboard
  // closes. The document itself never needs to scroll (the .screen scrolls
  // internally), so snap the window back whenever focus leaves a field.
  useEffect(() => {
    const snapBack = () => {
      requestAnimationFrame(() => {
        if (window.scrollX !== 0 || window.scrollY !== 0) window.scrollTo(0, 0);
      });
    };
    window.addEventListener("focusout", snapBack);
    return () => window.removeEventListener("focusout", snapBack);
  }, []);

  const totals = useMemo(() => calculateTotals(game), [game]);
  const standings = useMemo(
    () => [...game.players].sort((a, b) => (totals[b.id] ?? 0) - (totals[a.id] ?? 0)),
    [game.players, totals]
  );
  const roundNo = game.rounds.length + 1;

  const startRound = () => { setActiveQuestion(null); setGuesses({}); setRoundResults(null); setView("question"); };
  const goHome = () => { setView("home"); setActiveQuestion(null); setGuesses({}); setRoundResults(null); };

  const commitResults = (results: PlayerResult[]) => {
    if (!activeQuestion) return;
    setRoundResults(results);
    setGame((prev) => addRound(prev, activeQuestion.q, activeQuestion.basis, results));
    setView("results");
  };

  const handleAdjustScore = (playerId: string, points: number) => {
    const roundId = game.rounds[0]?.id;
    if (!roundId) return;
    const safe = Math.max(0, Math.floor(points));
    setGame((g) => adjustRoundScore(g, roundId, playerId, safe));
    setRoundResults((rs) => (rs ? rs.map((r) => (r.playerId === playerId ? { ...r, points: safe } : r)) : rs));
  };

  const newGame = () => {
    setGame((g) => startNewGame(g));
    goHome();
  };

  return (
    <div className="stage">
      <div className="app">
        {view === "home" && (
          <HomeScreen
            game={game} totals={totals} standings={standings}
            onStart={startRound}
            onAddPlayer={(name) => setGame((g) => addPlayer(g, name))}
            onRemovePlayer={(id) => setGame((g) => removePlayer(g, id))}
            onRenamePlayer={(id, name) => setGame((g) => renamePlayer(g, id, name))}
            onSetTarget={(target) => setGame((g) => setTarget(g, target))}
            onReset={() => {
              if (window.confirm("Clear all rounds and start over? Players are kept.")) {
                setGame((g) => startNewGame(g));
              }
            }}
            onHelp={() => setShowRules(true)}
            onHistory={game.rounds.length > 0 ? () => setShowHistory(true) : null}
          />
        )}
        {view === "question" && (
          <QuestionScreen
            roundNo={roundNo}
            onPick={(q) => { setActiveQuestion(q); setView("guess"); }}
            onBack={goHome}
            onHelp={() => setShowRules(true)}
          />
        )}
        {view === "guess" && activeQuestion && (
          <GuessScreen
            question={activeQuestion}
            players={game.players}
            onComplete={(g) => { setGuesses(g); setView("reveal"); }}
            onBack={() => setView("question")}
          />
        )}
        {view === "reveal" && activeQuestion && (
          <RevealScreen
            question={activeQuestion}
            players={game.players}
            guesses={guesses}
            onDone={commitResults}
            onBack={() => setView("guess")}
          />
        )}
        {view === "results" && activeQuestion && roundResults && (
          <ResultsScreen
            results={roundResults}
            roundNo={game.rounds.length}
            totals={totals}
            standings={standings}
            players={game.players}
            gameOver={isGameOver(game)}
            onAdjustScore={handleAdjustScore}
            onNext={startRound}
            onFinale={() => setView("finale")}
            onHome={goHome}
          />
        )}
        {view === "finale" && (
          <FinaleScreen
            standings={standings}
            totals={totals}
            onNewGame={newGame}
            onHome={goHome}
          />
        )}

        {showRules && <RulesSheet onClose={() => setShowRules(false)} />}
        {showHistory && <HistorySheet game={game} onClose={() => setShowHistory(false)} />}
      </div>
    </div>
  );
}
