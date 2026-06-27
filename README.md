# MindSprint AI

**Reflect • Recover • Recharge**

MindSprint AI is an AI wellness copilot for students preparing for JEE, NEET, CAT, UPSC, and board exams. It identifies emotional themes, hidden stressors, and behavioral patterns — then delivers personalized wellness support.

> **Disclaimer:** MindSprint AI is NOT a therapist and NOT a medical tool. It never diagnoses mental illness.

---

## Features

- **Daily Reflection Form** — Capture exam type, study/sleep hours, exercise, diet, mock scores, and journal entries
- **Voice Reflection** — Browser SpeechRecognition API to dictate journal entries
- **Preliminary Stress Scoring** — Rule-based preprocessing before AI analysis
- **Resilient AI Fallback** — Gemini → DeepSeek R1 (OpenRouter) → Demo mode; app never fails
- **Brain Fuel Recommendations** — Context-aware meal suggestions with explanations
- **7-Day Stress Trend** — Synthetic trend visualization with Recharts
- **Glassmorphism Dashboard** — Dark theme with purple/emerald accents and Framer Motion animations
- **Demo Mode** — Fully functional without an API key
- **localStorage Persistence** — Latest analysis saved locally (no login required)
- **WCAG Accessibility** — Keyboard navigation, ARIA labels, focus rings, skip link

---

## Architecture

```
app/                    # Next.js App Router pages & layout
components/
  cards/                # Dashboard insight cards
  charts/               # Recharts visualizations
  forms/                # Reflection form & voice input
  ui/                   # shadcn-style UI primitives
actions/
  analyze.ts            # Server action — validation + Gemini call
lib/
  prompt.ts             # buildMindSprintPrompt()
  stress.ts             # Preliminary stress score computation
  sentiment.ts          # Journal sentiment heuristics
  gemini.ts             # AI provider fallback chain (Gemini → DeepSeek → Demo)
  demo.ts               # Demo mode fallback responses
  schemas.ts            # Zod validation schemas
  storage.ts            # localStorage helpers
  trend.ts              # Synthetic 7-day trend generator
types/
  index.ts              # TypeScript type definitions
__tests__/
  schema.test.ts        # Schema validation test
```

### Data Flow

1. User submits reflection form
2. Input sanitized (HTML stripped, Zod validated, 2500 char limit)
3. Preliminary stress score computed locally
4. Prompt sent through AI fallback chain (Gemini 2.5 Flash → DeepSeek R1 → demo mode)
5. Response parsed, validated, stress score clamped to ±10 of preliminary
6. Results saved to localStorage and rendered on dashboard

---

## Free Services Used

| Service | Purpose |
|---------|---------|
| [Google Gemini API](https://ai.google.dev/) | Primary AI wellness analysis (`gemini-2.5-flash`) |
| [OpenRouter](https://openrouter.ai/) | Secondary fallback (`deepseek/deepseek-r1-0528:free`) |
| [Vercel](https://vercel.com/) | Deployment hosting |
| Browser SpeechRecognition | Voice input (no external API) |
| localStorage | Client-side persistence |

---

## How to Run

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd h2smain

# Install dependencies
npm install

# (Optional) Add API keys
cp .env.example .env.local
# Edit .env.local and set GEMINI_API_KEY and/or OPENROUTER_API_KEY

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
npm run test     # Run Vitest tests
```

> **Note:** The app works fully in demo mode without any API keys.

---

## AI Provider Order

```
Gemini 2.5 Flash (Google)
        ↓
DeepSeek R1 Free (OpenRouter)
        ↓
Demo Mode (local)
```

The app **never fails** even if all API providers are unavailable — users always receive a complete wellness analysis.

---

## How to Deploy on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add environment variables (optional):
   - `GEMINI_API_KEY` = your Google Gemini API key
   - `OPENROUTER_API_KEY` = your OpenRouter API key
4. Click **Deploy**

Vercel auto-detects Next.js. No additional configuration needed.

---

## Submission Description

**MindSprint AI** — PromptWars 2026

An empathetic AI wellness copilot built for Indian competitive exam students. Combines rule-based stress preprocessing with Gemini 2.5 Flash prompt engineering to deliver actionable wellness insights — brain fuel, mindfulness exercises, recovery plans — without crossing into medical or therapeutic territory.

**Stack:** Next.js 15 App Router, TypeScript, TailwindCSS, shadcn/ui, Framer Motion, Recharts, Zod, Google Gemini API

**Key differentiators:**
- Strict safety guardrails in prompt engineering (no diagnosis, no psychiatric terms)
- Preliminary stress score with bounded AI adjustment (±10)
- Works offline-first for first-time visitors via demo mode
- Voice reflection via browser APIs
- Zero backend database — localStorage only

---

Built for **PromptWars 2026** 🚀
