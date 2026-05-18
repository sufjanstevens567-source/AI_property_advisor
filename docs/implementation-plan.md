# Implementation Plan: Prototype to Risk-First MVP

## Objective

Elevate the Irish Buy-to-Let Underwriter from a prototype into a risk-first underwriting MVP. The system must treat deterministic calculations as the source of truth, expose data quality and unresolved risk clearly, and reserve AI for extraction or narrative only.

## Completed Implementation Steps

1. Harden deterministic engines.
   - Financial engine now solves break-even rent through the same tax-floor logic used in cash-flow calculations.
   - Stress classification treats break-even combined downside as "Thin but positive".
   - Scoring engine now distinguishes estimated vs unknown service charge and penalises missing/weak rent comps.
   - Negotiation engine now outputs opening, target, stretch, walk-away, probability, price sensitivity, due-diligence levers, and a risk-grounded agent script.

2. Restore MVP product flow.
   - Dashboard now ranks saved properties by stress resilience, overall score, cash flow, yield, or clean-candidate status.
   - Manual entry now captures property facts, status/confidence fields, tenancy, micro-location, service charge, BER, operating costs, and OMC notes.
   - Fact confirmation now explicitly shows value, status, and underwriting impact before analysis.
   - Rent comps now include source, address, rent, beds, baths, size, BER, parking, same-building flag, tier, and notes.

3. Implement risk-first UX.
   - Analysis cards prioritise Stress #9 cash flow, break-even vacancy tolerance, 30% tax cash flow, and data quality before ROI.
   - Quick Triage estimates monthly cash flow from asking price, expected rent, and service charge.
   - Advanced assumptions are progressively disclosed using native disclosure controls.

4. Add tactile analysis tools.
   - Interest-rate slider updates deterministic financial outputs in real time.
   - Radar chart visualises qualitative risk footprint across high-weight dimensions.

5. Improve report rendering.
   - Markdown reports now render through ReactMarkdown with Tailwind typography.
   - Report content is generated from deterministic model outputs and includes due-diligence caveats.

## Remaining Product Work

1. Add persistent storage, auth, and a database-backed saved-property workflow.
2. Add URL extraction and a mandatory user confirmation screen for imported listing facts.
3. Add Markdown export/download and eventually PDF export.
4. Add fixtures for the five canonical Dublin property patterns and expected outputs.
5. Replace remaining legacy monitoring artifacts with a clearly separated future-monitoring module.
6. Add Playwright end-to-end coverage once the data model stabilises.
