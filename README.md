# Game of 30

A local, pass-the-phone party game. Everyone guesses **one** answer to the same
ranked question — and your guess scores **its rank number**. The trick: aim for
the *bottom* of the Top 30. Name the obscure-but-real answer that barely makes
the list and you bank big points; nail the obvious #1 and you score just 1.

**Live demo:** [game-of-30.vercel.app](https://game-of-30.vercel.app)

---

## How to play

1. **Add players** and pick a game length (endless, to 50/100 points, or 5 rounds).
2. **Choose a list** — from 23 curated trivia lists across 6 themes, or ask the AI
   to generate a live Top 30 from any question.
3. **Pass the phone.** Each player secretly enters one guess.
4. **Reveal** the Top 30, counting up from #1, with each player's hits highlighted.
5. **Score:** a guess at rank #N is worth **N points**; a guess that misses the
   list scores 0. The host can manually adjust any score for judgment calls.
6. Highest total when the target is reached **wins**.

> Why "aim for the bottom"? Because rank = points. Guessing #1 (e.g. "India" for
> most populous countries) earns 1 point. Guessing #30 earns 30. The game rewards
> deep knowledge of the long tail.

---

## Features

- **23 curated lists** in 6 expandable themes — World & Geography, Nature &
  Science, India, Movies, Pop Culture, and Money & Records.
- **AI-generated lists** — ask any ranked question and get a live Top 30 from the
  web, via Google Gemini, OpenRouter, or OpenAI.
- **Pass-the-phone flow** with secret guessing and an animated cascade reveal.
- **Flexible game length** — endless, first-to-points, or fixed rounds.
- **Smart guess matching** — fuzzy matching with aliases (e.g. "Bombay" → Mumbai,
  "USA" → United States).
- **Host score override** and a one-tap reset to start a new game.
- **Local persistence** — players, rounds, and standings are saved in the browser.
- **Round history** and a running scoreboard.

---

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router) + TypeScript
- React 18, client-side state with `localStorage`
- [Zod](https://zod.dev/) for validating AI responses
- AI providers via the `@google/genai` and `openai` SDKs
- Vitest (unit) + Playwright (e2e) for tests
- Deployed on [Vercel](https://vercel.com/)

---

## Getting started

```bash
# install dependencies
npm install

# run the dev server
npm run dev
# → http://localhost:3000
```

The curated lists work fully offline. The **"Ask the AI"** feature needs an API
key from one provider (see below).

---

## Configuration

Create a `.env.local` file (see [`.env.example`](.env.example)). Pick **one**
provider, or leave `TOP30_PROVIDER=auto` to auto-detect from whichever key is set.

### Option 1 — Google Gemini (free tier in Google AI Studio)

```env
TOP30_PROVIDER=gemini
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-2.5-flash-lite
```

### Option 2 — OpenRouter (one key, many models)

```env
TOP30_PROVIDER=openrouter
OPENROUTER_API_KEY=your-key
OPENROUTER_MODEL=google/gemini-2.5-flash
# append ":online" to any model to enable live web search
```

### Option 3 — OpenAI

```env
TOP30_PROVIDER=openai
OPENAI_API_KEY=your-key
OPENAI_MODEL=gpt-5.4-mini
```

> On Vercel, add these under **Project → Settings → Environment Variables**, then
> redeploy.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint with ESLint |
| `npm run typecheck` | Type-check with `tsc` |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |

---

## Project structure

```
src/
├─ app/
│  ├─ page.tsx            # all screens: home, picker, guess, reveal, results
│  ├─ layout.tsx          # fonts + root layout
│  ├─ globals.css         # design system
│  └─ api/top-30/route.ts # AI list generation (Gemini / OpenRouter / OpenAI)
└─ lib/
   ├─ game.ts             # game state, scoring, win conditions
   ├─ questions.ts        # the 23 curated lists, grouped into themes
   └─ top30.ts            # Zod schemas for AI output
```

---

## Notes on content

Most lists are evergreen (geography, science, films). A few "current" lists —
top YouTube channels, Instagram accounts, companies by market cap, Olympic golds
— are approximate and drift over time; their on-screen "basis" line says so.

---

## License

Personal project — feel free to fork and adapt.
