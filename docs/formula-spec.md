# Formula Specification

This specification defines the deterministic financial formulas required for `packages/financial-engine`.

## 1. Acquisition & Mortgage
- **Total Acquisition Cost** = Purchase Price + Stamp Duty (1% up to €1M, 2% above) + Legal/Setup Fees + Furnishing/Setup + Refurbishment Allowance + BER Upgrade Allowance.
- **Cash Deployed** = Default €300,000 (configurable).
- **Mortgage Required** = Total Acquisition Cost - Cash Deployed.
- **LTV** = Mortgage Required / Purchase Price.
- **Monthly Mortgage Payment (M)** = P × r × (1+r)^n / ((1+r)^n - 1)
  - P = Mortgage Required
  - r = Annual Interest Rate / 12
  - n = Term in Months (e.g., 25 years × 12 = 300)
- **Annual Mortgage Payment** = M × 12
- **Year-1 Interest** = Iterative sum of the first 12 months' interest.
  - Month 1 Interest = P × r
  - Month 1 Principal = M - Month 1 Interest
  - Balance after Month 1 = P - Month 1 Principal
- **Year-1 Principal** = Annual Mortgage Payment - Year-1 Interest

## 2. Rental Income
- **Annual Headline Rent** = Monthly Rent × 12
- **Vacancy-Adjusted Rent** = Annual Rent × ((12 - Vacancy Months) / 12) (Default 1 month vacancy: 11/12).
- **Gross Yield on Price** = Annual Headline Rent / Purchase Price
- **Gross Yield on Acquisition Cost** = Annual Headline Rent / Total Acquisition Cost

## 3. Operating Costs
Total Annual Costs (ex-mortgage) = Sum of:
- Service Charge (actual or estimated)
- Maintenance Reserve
- Landlord Insurance
- Accounting/Compliance
- Letting Fee (amortised)
- Capex Reserve
- Annual BER Allowance (if applicable)

## 4. Taxes & Cash Flow
- **Taxable Profit** = Vacancy-Adjusted Rent - 100% Year-1 Mortgage Interest - Total Annual Costs.
- **Estimated Tax** = Calculated at three scenarios: 20%, 30% (Central Case), 40%.
- **Annual After-Tax Cash Flow** = Vacancy-Adjusted Rent - Total Annual Costs - Estimated Tax - Annual Mortgage Payment.
- **Monthly After-Tax Cash Flow** = Annual After-Tax CF / 12.

## 5. Economic ROI & Appreciation
- **Economic Return** = Annual After-Tax CF + Year-1 Principal Repayment.
- **Economic ROI** = Economic Return / Cash Deployed.
- **ROI with 2% Appreciation** = (Economic Return + Purchase Price × 0.02) / Cash Deployed.
- **ROI with 4% Appreciation** = (Economic Return + Purchase Price × 0.04) / Cash Deployed.

## 6. Debt Service & Break-Even
- **DSCR** = Vacancy-Adjusted Rent / Annual Mortgage Payment.
- **Break-Even Rent** = Monthly rent required to yield a Monthly After-Tax CF of exactly €0 (solved iteratively or algebraically).

## 7. Stress Tests
Run 10 scenarios and recalculate CF and DSCR:
1. Base
2. Rent -10%
3. Rent -15%
4. Costs +25%
5. 2 Months Vacancy
6. 3 Months Vacancy
7. Rate 7%
8. Rate 8%
9. **Combined Downside:** Rent × 0.90, Costs × 1.25, 10/12 Occupancy, Rate 7%
10. **Severe Downside:** Rent × 0.85, Costs × 1.25, 9/12 Occupancy, Rate 8%

## 8. Service Charge & Rent Sensitivity
- **Service Charge Sensitivity:** Generate variations if SC is estimated (Low, Base [Estimated], High, Worst-Case).
- **Rent Sensitivity:** Generate variations for Conservative, Base, and Strong rent tiers.
