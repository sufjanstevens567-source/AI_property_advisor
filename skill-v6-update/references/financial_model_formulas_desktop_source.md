# Financial Model Formulas

## Mortgage Calculation

Monthly payment:
```
M = P × r × (1+r)^n / ((1+r)^n − 1)
```
Where:
- P = mortgage principal (purchase price + stamp duty − cash deployed, or as specified)
- r = annual interest rate / 12
- n = term in years × 12 (default: 25 × 12 = 300)

Annual mortgage repayment = M × 12

First-year interest:
```
Month 1 interest = P × r
Month 1 principal = M − (P × r)
Remaining balance after month 1 = P − Month 1 principal
... iterate for 12 months to get first-year totals
```

Simplified first-year interest approximation:
```
First-year interest ≈ P × annual_rate × (1 − (M×12 − P×annual_rate) / (2×P×annual_rate))
```
Or more simply: `First-year interest ≈ P × annual_rate − (annual_principal_repayment / 2)`

First-year principal repayment = Annual mortgage repayment − First-year interest

---

## Acquisition Costs

| Item | Calculation |
|------|-------------|
| Purchase price | As listed |
| Stamp duty | 1% of purchase price (up to €1M); 2% on amount above €1M |
| Legal fees | Estimate €2,500–€4,000 |
| Valuation fee | Estimate €150–€300 |
| Mortgage arrangement fee | If applicable, per lender |
| Initial furnishing/setup | €3,000–€8,000 depending on condition |
| Refurbishment | As estimated from listing condition |
| **Total acquisition cost** | Sum of all above |

LTV = Mortgage required / Purchase price × 100

---

## Rental Income

| Metric | Formula |
|--------|---------|
| Annual headline rent | Monthly rent × 12 |
| Vacancy-adjusted rent (1 month) | Annual rent × (11/12) |
| Vacancy-adjusted rent (2 months) | Annual rent × (10/12) |
| Vacancy-adjusted rent (3 months) | Annual rent × (9/12) |
| Gross yield on purchase price | Annual headline rent / Purchase price × 100 |
| Gross yield on total acquisition cost | Annual headline rent / Total acquisition cost × 100 |
| Gross yield on cash deployed | Vacancy-adjusted rent / Cash deployed × 100 |

---

## Annual Costs

| Cost | Typical Range | Notes |
|------|---------------|-------|
| Service charge / OMC | Actual if known, else €1,500–€3,000 | Higher for D1/D2 premium blocks |
| Maintenance reserve | €1,000–€1,500/yr | For repairs, appliance replacement |
| Insurance (landlord) | €300–€500/yr | Contents + building top-up if needed |
| Accounting/compliance | €500–€1,000/yr | Tax return, PRTB, non-resident agent |
| Management fee | 0% (self-manage) or 6–10% of rent | |
| Letting fee (re-let) | 1 month rent amortized, or ~€500–€1,000/yr | |
| Vacancy cost | Included via vacancy-adjusted rent | |
| Capex / refurb reserve | €500–€1,000/yr | Kitchen/bathroom refresh over 10–15 yrs |

**Total annual costs** = sum of all applicable items

---

## Taxable Rental Profit & Tax

```
Taxable rental profit = Vacancy-adjusted rent
                       − Deductible mortgage interest (100% of interest for Irish rental)
                       − Service charge
                       − Insurance
                       − Maintenance/repairs (revenue, not capital)
                       − Accounting/compliance
                       − Management fee
                       − Other allowable expenses
```

Tax estimate (non-resident, simplified):
- If taxable profit is low / user has no other Irish income: 20% rate may apply on initial band
- Standard rate band for single non-resident: ~€42,000 at 20%, above at 40%
- USC and PRSI may apply depending on circumstances
- Non-resident landlord withholding (20%) applies unless collecting agent appointed

**Always caveat:** This is a simplified estimate. The user's actual tax position depends on their full circumstances. Professional Irish tax advice is needed.

After-tax cash flow (before principal):
```
= Vacancy-adjusted rent − Total costs − Estimated tax
```

After-tax cash flow (after mortgage):
```
= After-tax cash flow before principal − Annual principal repayment
```

Monthly after-tax cash flow = Annual after-tax cash flow / 12

---

## Return Metrics

| Metric | Formula |
|--------|---------|
| Net cash yield on cash deployed | After-tax cash flow (after mortgage) / Cash deployed × 100 |
| Economic return (before appreciation) | After-tax cash flow (before principal) + Principal repayment |
| Economic ROI (before appreciation) | Economic return / Cash deployed × 100 |
| Economic ROI with X% appreciation | (Economic return + Purchase price × X%) / Cash deployed × 100 |
| Break-even rent | Total costs + Tax + Mortgage repayment (solve for rent where cash flow = 0) |
| DSCR | Vacancy-adjusted rent / Annual mortgage repayment |
| Break-even mortgage rate | Rate at which after-tax cash flow = 0 (iterate or solve) |

---

## Stress Test Calculations

For each stress scenario, recalculate from the modified inputs through to after-tax monthly cash flow:

| Scenario | Modified Input |
|----------|---------------|
| Base case | Base rent, 5.65%, 1mo vacancy |
| Rent -10% | Annual rent × 0.90 |
| Rent -15% | Annual rent × 0.85 |
| Costs +25% | Total costs × 1.25 |
| 2 months vacancy | Rent × (10/12) |
| 3 months vacancy | Rent × (9/12) |
| Rate 7.0% | Recalculate M with r = 0.07/12 |
| Rate 8.0% | Recalculate M with r = 0.08/12 |
| Combined downside | Rent × 0.90, Costs × 1.25, 10/12 occupancy, M at 7% |
| Severe downside | Rent × 0.85, Costs × 1.25, 9/12 occupancy, M at 8% |

For combined/severe: apply ALL modifications simultaneously, then calculate through the full P&L.

---

## Rate Comparison Table

When presenting mortgage sensitivity, show monthly payment and annual cash flow at each rate:

| Rate | Monthly Payment | Annual Repayment | First-Year Interest | Monthly Cash Flow |
|------|----------------|------------------|---------------------|-------------------|
| 4.85% | calc | calc | calc | calc |
| 5.30% | calc | calc | calc | calc |
| 5.65% | calc | calc | calc | calc |
| 5.85% | calc | calc | calc | calc |
| 7.00% | calc | calc | calc | calc |
| 8.00% | calc | calc | calc | calc |