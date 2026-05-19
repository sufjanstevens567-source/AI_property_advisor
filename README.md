# Irish Rental Property Underwriter

A risk-first underwriting app for screening Irish residential rental properties, with a Dublin-first calibration and deterministic financial modelling.

The app is designed to help a user compare rental properties consistently: cash flow, downside resilience, rent evidence, document gaps, building risks, and negotiation price. It is a screening and scenario-analysis tool, not investment advice.

## Recent Updates: UX, Accessibility, and Mobile Overhaul

The application recently underwent a comprehensive 0-5 rubric-based design audit and overhaul to transition from a technical MVP to an institutional-grade, highly accessible financial decision-support tool. Key improvements include:

- **Mobile & Responsive Redesign**: The desktop comparison table seamlessly converts into a touch-friendly vertical card stack on mobile. Metric grids reflow intelligently, and wizard steps use horizontal snap-scrolling to preserve large touch targets.
- **Narrative Synthesis**: Added a "Bottom Line" card that automatically translates the complex financial metrics into a plain-English narrative paragraph.
- **Improved Information Hierarchy**: Replaced flat, comma-separated risk lists with structured bullet points and color-coded status indicators (green/amber/red).
- **Accessibility & Trust**: Replaced technical financial jargon with naive-user-friendly labels (e.g., "Comfortable safety margin"). Added inline benchmarks for complex ratios.
- **Interactive Polish**: Implemented clickable wizard step buttons with completion checkmarks, dynamic color-responsive stress sliders, and hover-state elevations.
- **Print-Ready Final Report**: The final underwriting report now renders fully formatted HTML tables for financials and stress tests (via `remark-gfm`), includes prioritized next-step checklists, and features a 1-click "Copy Report" functionality.
- **Refined Agent Script**: The auto-generated negotiation email is now more natural, less robotic, and ready to send.

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
