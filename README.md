# Irish Rental Property Underwriter

A risk-first underwriting app for screening Irish residential rental properties, with a Dublin-first calibration and deterministic financial modelling.

The app is designed to help a user compare rental properties consistently: cash flow, downside resilience, rent evidence, document gaps, building risks, and negotiation price. It is a screening and scenario-analysis tool, not investment advice.

## What Changed In This MVP Pass

Since the initial prototype, the project has been upgraded from a mostly static demo into a usable risk-first MVP surface:

- Rebuilt the web app around plain-English, naive-user-friendly labels.
- Added a first-pass estimate flow for quick screening from asking price, expected rent, and annual management/service charge.
- Added a step-by-step property workflow: buying assumptions, property details, similar rentals, fact checking, and analysis.
- Added editable fact-confidence controls so confirmed, estimated, and unknown data affect confidence before analysis.
- Reoriented the dashboard around downside protection before upside return.
- Added live mortgage-rate stress testing with formula-based recalculation.
- Added rendered Markdown underwriting reports instead of raw report text.
- Added visual risk scoring with Recharts.
- Integrated the financial, scoring, and negotiation engines into the web UI.
- Expanded negotiation output with opening, target, highest acceptable, maximum price, sensitivity rows, and a plain-English agent script.
- Hardened deterministic financial logic for break-even rent and stress-test categorization.
- Added `docs/implementation-plan.md` with the remaining roadmap.

## Core Principles

- Financial calculations are deterministic TypeScript code, not LLM-generated math.
- AI, when added later, should only assist with extraction, classification, and narrative drafting.
- Every important property fact should be confirmed, estimated, or marked unknown.
- Low data confidence prevents a clean unconditional recommendation.
- The product language should be clear to a non-expert user, while still preserving auditability for advanced users.

## Project Structure

```text
apps/
  web/                         Next.js app and underwriting UI
packages/
  financial-engine/            Mortgage, cash flow, tax, ROI, break-even, and stress tests
  scoring-engine/              Qualitative scoring, data confidence, risk flags
  negotiation-engine/          Price sensitivity, offer bands, document-driven negotiation logic
  ai-prompts/                  Zod schemas and prompt scaffolding for future AI extraction/reporting
docs/
  implementation-plan.md       Implemented changes and remaining roadmap
  product-spec.md              Product requirements
  formula-spec.md              Financial formula specification
  scoring-spec.md              Scoring specification
  ux-flow.md                   UX workflow
```

## Current App Features

- Comparison dashboard for multiple saved sample properties.
- Sorts by combined downside resilience, overall score, monthly cash flow, estimated annual return, or clean candidates.
- First-pass estimate for quick screening.
- Investor assumptions with progressive disclosure for advanced settings.
- Manual property entry with confidence status per important fact.
- Similar rental evidence entry with plain-English match quality.
- Fact-checking screen before analysis.
- Risk-first analysis cards:
  - combined downside cash flow,
  - empty-month cushion,
  - monthly cash flow after tax,
  - data confidence,
  - estimated annual return,
  - mortgage required,
  - opening offer,
  - decision.
- Live mortgage-rate stress slider.
- Downside test matrix.
- Risk profile chart.
- Negotiation strategy and agent message.
- Rendered underwriting report.

## Packages

### `packages/financial-engine`

Pure TypeScript financial model covering:

- total acquisition cost,
- mortgage required,
- loan-to-value,
- mortgage payment,
- year-one interest and principal,
- annual rent,
- vacancy-adjusted rent,
- taxable profit,
- after-tax cash flow at 20%, 30%, and 40%,
- economic return and ROI,
- break-even rent,
- 10 stress scenarios.

### `packages/scoring-engine`

Scores qualitative risk and data confidence across location, rent evidence, legal rent confidence, building quality, energy rating, service charge, repair risk, liquidity, and operational hassle.

### `packages/negotiation-engine`

Generates:

- opening price,
- target price,
- highest acceptable price,
- maximum price,
- price sensitivity rows,
- document findings that should increase or decrease the offer,
- a plain-English agent script.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run The Web App

```bash
cd apps/web
npm run dev
```

The app runs locally at `http://localhost:3000`.

## Validation

Run the package tests:

```bash
cd packages/financial-engine
npm test

cd ../scoring-engine
npm test

cd ../negotiation-engine
npm test
```

Build and lint the web app:

```bash
cd apps/web
npm run build
npm run lint
```

## Current Limitations

The app is still an MVP. The next major work is:

- Supabase or equivalent persistence,
- user auth,
- URL/listing extraction with user confirmation,
- export workflows,
- richer fixtures and expected-result tests,
- Playwright end-to-end tests,
- separating future monitoring artifacts from the MVP scope.

## Disclaimer

This project provides screening, underwriting, and scenario analysis. It does not provide investment, tax, legal, mortgage, or surveying advice. Users should verify assumptions with a solicitor, tax advisor, broker, surveyor, and owners' management company documentation before making decisions.
