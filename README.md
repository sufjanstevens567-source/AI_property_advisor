# Irish Buy-to-Let Underwriter MVP

A robust, deterministic underwriting application designed for analyzing residential real estate investments in Ireland (with a focus on Dublin).

## Overview
This project transitions a previous AI-prompt-based "Skill" into a deterministic TypeScript Next.js web application. It enforces strict mathematical modeling over LLM generation, ensuring that all financial models, stress tests, and scoring logic are perfectly reliable. AI is reserved strictly for factual extraction from URLs and narrative report generation.

## Project Structure
This repository uses a monorepo structure:
- \`apps/web\`: The Next.js frontend featuring the manual property entry UI, rent comparables tool, and comparison dashboard.
- \`packages/financial-engine\`: Deterministic logic for mortgage, cash flow (at 20/30/40% tax brackets), economic ROI, and stress testing.
- \`packages/scoring-engine\`: 16-dimension qualitative scoring model, data quality tracker, and resilience overlay.
- \`packages/negotiation-engine\`: Calculates optimal target, opening, and walk-away prices based on stress resilience and days on market, outputting dynamic agent scripts.
- \`packages/ai-prompts\`: Strict \`zod\` schemas and system prompts for LLM integration (extraction and report narrative).
- \`docs/\`: Project specifications covering UX flow, mathematical formulas, and the scoring rubric.

## Key Features
1. **Deterministic Financials**: No hallucinated math. 10 unique stress test scenarios including vacancy spikes, rent drops, and cost inflation.
2. **Data Quality is First-Class**: Variables entered as "Estimated" directly reduce the overall data quality score, preventing unconditional "Buy" recommendations if the risk is too high.
3. **Comparison Dashboard**: Dynamically compare multiple properties on cash flow, yield, and resilience.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository.
2. Run \`npm install\` in the root directory to install workspace dependencies.
3. Run \`npm run dev\` inside \`apps/web\` to launch the local Next.js development server.

## Testing
The logic engines are rigorously tested with Vitest.
To run tests for a specific package:
\`\`\`bash
cd packages/financial-engine
npm run test
\`\`\`
