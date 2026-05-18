# UX Flow Specification

This specification outlines the user journey and views for the MVP.

## 1. Onboarding & Setup
- **Investor Profile Setup:** User sets global assumptions (Cash Deployed, Mortgage Rate, Term, Tax Rate, Vacancy Base, Management preference). These default values populate all future property models.

## 2. Property Ingestion (Two Paths)
### Path A: URL Extraction (Phase 7)
- User pastes a Daft.ie or MyHome URL.
- Backend fetches and parses the listing using AI extraction.
- **Fact Confirmation Screen (Crucial Gate):** User must review extracted fields. Unknowns are highlighted. User edits/approves to proceed.

### Path B: Manual Entry (Phase 2)
- User manually fills a form with property details (Price, Beds, BER, Service Charge, Tenancy, etc.).
- User specifies if data is Confirmed, Estimated, or Unknown.

## 3. Rent Comparables (Phase 4)
- User enters comparable rentals to justify the rental assumption.
- User selects Comp Tier (A: Same Building, B: Adjacent Block, C: Micro-Area, D: Broad Area).
- App dynamically calculates Rent Confidence based on entered comps.

## 4. Single Property Analysis Results
### Simple View
- High-level cards: Verdict, Price, Mortgage Required, Base Rent, Monthly CF (30%), Economic ROI, Stress #9 result, Data Quality score, Top Risks, Recommended Offer.

### Full View (Tabbed Interface)
- **Listing Facts:** The confirmed dataset.
- **Rent Comps:** Table of comps and confidence tier.
- **Financials:** Full acquisition breakdown and operating costs.
- **Tax Sensitivity:** Comparison of 20%, 30%, 40% scenarios.
- **Stress Tests:** Table of 10 scenarios with CF and DSCR.
- **Risks & Scoring:** Visual representation of 16 dimensions and resilience categories.
- **Negotiation:** Price sensitivity table, opening/target/stretch prices, and agent script.

## 5. Comparison Dashboard (Phase 6)
- **Table View:** Side-by-side metrics for 2-20 properties (Asking Price, CF, ROI, Stress CF, DQ Score, Verdict).
- **Objective Rankings:** View filtered lists (e.g., "Highest Cash Flow", "Best Resilience").

## 6. Report Export (Phase 9)
- User clicks "Export Report".
- App generates a markdown formatted summary (Phase 8 AI narrative integration) for sharing with brokers or solicitors.
