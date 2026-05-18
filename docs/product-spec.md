# Product Specification: Irish Buy-to-Let Underwriting App

## Product Thesis
Build an Irish residential buy-to-let screening and underwriting app.

The app allows a user to:
1. Set investor assumptions once.
2. Add Irish property listings manually or via URL.
3. Confirm/edit extracted listing facts.
4. Enter or verify rent comparables.
5. Run deterministic financial modelling.
6. Score risks and data quality.
7. Compare properties.
8. Generate a simple scorecard and full underwriting report.
9. Calculate negotiation ranges and next due-diligence actions.

**Note:** This is a decision-control system for screening, underwriting, scenario analysis, risk flags, and due diligence, not investment advice.

## Core Principles
1. **Deterministic Calculations:** All financial calculations (mortgage, CF, ROI, stress tests) must be code-based (TypeScript), not LLM-generated. The LLM handles extraction, summaries, and drafting.
2. **User Confirmation:** Every auto-extracted property fact must be confirmed/edited by the user before analysis.
3. **Data Quality is First-Class:** Every property tracks confirmed, estimated, and unknown fields, generating a data quality score (1-10) and ranking confidence.
4. **Dublin-First, Ireland-Capable:** Initial logic/calibration focuses on Dublin.
5. **No Monitoring in MVP:** Scheduled ingestion/monitoring of Daft alerts is excluded from v1.

## Architecture & Stack
- **Frontend:** Next.js + React + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend/API:** Next.js API routes / Server Actions
- **Database:** Supabase Postgres
- **Auth:** Supabase Auth or Clerk
- **ORM:** Prisma or Drizzle
- **Packages:**
  - `packages/financial-engine` (Deterministic TypeScript math)
  - `packages/scoring-engine` (Qualitative and Data Quality scoring)
  - `packages/negotiation-engine` (Offer sensitivity)
  - `packages/ai-prompts` (Extraction and narratives)
  - `packages/report-schema` (Schema for reports)
- **Testing:** Vitest

## Phasing
The MVP will be built across 10 sequential phases, starting with a UI-less deterministic financial engine and ending with report generation and export.
