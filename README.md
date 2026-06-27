# MindSprint AI

![Build Passing](https://img.shields.io/badge/Build-Passing-brightgreen)
![Tests Passing](https://img.shields.io/badge/Tests-74%20Passing-brightgreen)
![Coverage >95%](https://img.shields.io/badge/Coverage-%3E95%25-brightgreen)

**Reflect • Recover • Recharge**

MindSprint AI is an AI wellness copilot for students preparing for JEE, NEET, CAT, UPSC, and board exams. It identifies emotional themes, hidden stressors, and behavioral patterns — then delivers personalized wellness support.

> **Disclaimer:** MindSprint AI is NOT a therapist and NOT a medical tool. It never diagnoses mental illness.

---

## Features

- **Daily Reflection Form** — Capture exam type, study/sleep hours, exercise, diet, mock scores, and journal entries
- **Preliminary Stress Scoring** — Rule-based preprocessing before AI analysis
- **Resilient AI Fallback** — Gemini → DeepSeek R1 (OpenRouter) → Demo mode; app never fails
- **Brain Fuel Recommendations** — Context-aware meal suggestions with explanations
- **Glassmorphism Dashboard** — Dark theme with purple/emerald accents and Framer Motion animations
- **Demo Mode** — Fully functional without an API key
- **localStorage Persistence** — Latest analysis saved locally (no login required)
- **WCAG Accessibility** — Keyboard navigation, ARIA labels, focus rings, skip link

---

## Architecture

MindSprint AI is a client-heavy Next.js App Router application. User input is validated on the server, analyzed through a resilient AI provider chain, enriched with deterministic scoring, and persisted locally in the browser.

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Reflection  │────▶│ Server Action    │────▶│ AI Fallback     │
│ Form        │     │ analyze.ts       │     │ Gemini→DeepSeek │
└─────────────┘     └────────┬─────────┘     │ →Demo           │
                             │               └────────┬────────┘
                             ▼                        │
                    ┌────────────────┐                │
                    │ Zod Schema +   │◀───────────────┘
                    │ Enrichment     │
                    └────────┬───────┘
                             ▼
                    ┌────────────────┐     ┌─────────────┐
                    │ localStorage   │────▶│ Dashboard   │
                    │ (storage.ts)   │     │ Cards       │
                    └────────────────┘     └─────────────┘
```

### Folder Structure

```
app/                    # Next.js App Router pages & layout
actions/
  analyze.ts            # Server action — sanitize, validate, AI call
components/
  cards/                # Dashboard insight cards
  forms/                # Reflection form
  ui/                   # shadcn-style UI primitives
lib/
  constants.ts          # Centralized thresholds and limits
  config.ts             # AI and loading configuration
  prompt.ts             # buildMindSprintPrompt()
  stress.ts             # Preliminary stress score computation
  sentiment.ts          # Journal sentiment heuristics
  scores.ts             # Efficiency and fatigue scoring
  gemini.ts             # AI provider fallback chain
  demo.ts               # Demo mode fallback responses
  demo-helpers.ts       # Demo persona, badge, coach tip generators
  enrichment.ts         # Post-AI score enrichment
  schemas.ts            # Zod validation schemas
  storage.ts            # localStorage with safe read/write helpers
  utils.ts              # stripHtml, safeParseJson, safeLocalStorage*
  reflection-input.ts   # exactOptionalPropertyTypes-safe normalizer
types/
  index.ts              # TypeScript type definitions
__tests__/              # Vitest unit, integration, component, a11y, security tests
.github/workflows/      # CI pipeline
```

### Data Flow

1. User submits reflection form
2. Input sanitized (HTML stripped, Zod validated, 2500 char limit)
3. Preliminary stress score computed locally
4. Prompt sent through AI fallback chain (Gemini 2.5 Flash → DeepSeek R1 → demo mode)
5. Response parsed, validated, stress score clamped to ±10 of preliminary
6. Results enriched with efficiency/fatigue/music scores
7. Results saved to localStorage and rendered on dashboard

---

## AI Provider Hierarchy

```
Gemini 2.5 Flash (Google)
        ↓ (on failure)
DeepSeek R1 Free (OpenRouter)
        ↓ (on failure)
Demo Mode (local, deterministic)
```

The app **never fails** even if all API providers are unavailable — users always receive a complete wellness analysis.

### Fallback Strategy

| Stage | Trigger | Behavior |
|-------|---------|----------|
| Primary | `GEMINI_API_KEY` valid | Gemini JSON response, schema validated |
| Secondary | Gemini timeout/error | OpenRouter DeepSeek R1 with JSON mode |
| Tertiary | Both providers fail | `generateDemoAnalysis()` with input-aware content |
| Recovery | All async paths | try/catch with graceful error messages; no unhandled rejections |

API keys are **server-only** (`process.env`) and never exposed to the client.

---

## Testing Strategy

**74 tests** across unit, integration, component, accessibility, and security suites.

```bash
npm run test            # Run all tests
npm run test:coverage   # Run with v8 coverage + HTML report (coverage/)
```

| Suite | Files | Coverage |
|-------|-------|----------|
| Unit | `stress`, `sentiment`, `utils`, `storage`, `demo`, `schemas`, `gemini`, `scores`, `prompt`, `enrichment` | Core lib logic |
| Integration | `analyzeReflection`, localStorage persistence, AI fallback chain | End-to-end server action |
| Component | `reflection-form`, `dashboard`, `loading-flow`, `persona-card`, `badge-card` | Render + interaction |
| Accessibility | jest-axe on form, dashboard, emergency calm modal | WCAG violations |
| Security | XSS stripping, journal truncation, schema rejection, corrupt localStorage | Input hardening |

### Coverage Thresholds (lib + actions)

| Metric | Target | Current |
|--------|--------|---------|
| Lines | >95% | 98.59% |
| Functions | >95% | 97.87% |
| Statements | >95% | 96.67% |
| Branches | >90% | 90.9% |

---

## Accessibility

- Skip link to main content
- ARIA labels on all interactive elements (buttons, inputs, sliders, dialogs)
- `aria-live` regions on loading flow
- Focus-visible rings on all focusable controls
- `prefers-reduced-motion` respected via CSS
- jest-axe tests on Reflection Form, Dashboard, and Emergency Calm Kit modal

---

## Security

| Control | Implementation |
|---------|----------------|
| Journal max length | 2500 chars (`JOURNAL_MAX_LENGTH`) |
| HTML stripping | `stripHtml()` before storage and AI |
| Schema validation | Zod on input and AI output |
| API keys | Server-only env vars, placeholder detection |
| XSS prevention | No `dangerouslySetInnerHTML`, no `eval`, no `Function` constructor |
| Safe storage | `safeParseJson()`, `safeLocalStorageRead/Write()` — never crash on corrupt data |
| Secrets | `.env` gitignored; `.env.example` committed without real keys |

---

## How to Run

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/rikh-raj/mindsprint-ai.git
cd mindsprint-ai
npm install

# Optional API keys
cp .env.example .env
# Set GEMINI_API_KEY and/or OPENROUTER_API_KEY

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
npm run dev           # Development server
npm run build         # Production build
npm run start         # Start production server
npm run lint          # ESLint
npm run test          # Vitest (74 tests)
npm run test:coverage # Coverage report → coverage/index.html
```

> The app works fully in demo mode without any API keys.

---

## Deployment

### Vercel

1. Push code to GitHub
2. Import repository at [vercel.com](https://vercel.com)
3. Add environment variables (optional):
   - `GEMINI_API_KEY`
   - `OPENROUTER_API_KEY`
4. Deploy — Vercel auto-detects Next.js

### CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on every push/PR:

```
npm ci → npm run lint → npm run test → npm run build
```

All steps must pass. Coverage thresholds enforced via Vitest.

---

## Free Services Used

| Service | Purpose |
|---------|---------|
| [Google Gemini API](https://ai.google.dev/) | Primary AI wellness analysis (`gemini-2.5-flash`) |
| [OpenRouter](https://openrouter.ai/) | Secondary fallback (`deepseek/deepseek-r1-0528:free`) |
| [Vercel](https://vercel.com/) | Deployment hosting |
| localStorage | Client-side persistence |

---

Built for **PromptWars 2026**
