# Financial Model Formulas — v8

> **v8 change:** Default/central tax case is now **20%**. All headline figures, master tables, and rankings use 20% unless the user specifies otherwise. 30% is the medium sensitivity case; 40% is the conservative stress. This is a modelling default only — not a statement that 20% is the correct effective rate. Confirm with an Irish tax advisor.

---

## Acquisition Cost Build

```
Total acquisition cost =
    purchase price
  + stamp duty (1% up to €1M; 2% above)
  + legal/valuation fees (default €3,500; €4,500 if non-resident complexities)
  + furnishing/setup (default €5,000)
  + refurbishment allowance (€0–€20,000+ depending on condition and BER)
  + BER upgrade allowance (separate from refurb — see below)

Mortgage required = total acquisition cost − cash deployed (default €300,000)
```

Always present the full breakdown in the acquisition table.

### BER Upgrade Cost in Acquisition Budget

Include as a one-off acquisition item (NOT in annual maintenance):
- BER D: add €8,000–€15,000 (heat pump, insulation, windows)
- BER E: add €15,000–€25,000 (major retrofit)
- BER F/G: add €25,000+ (full retrofit) — likely unlendable

**BER is NOT a legal rent cap.** BER D/E suppresses achievable market rent because tenants factor energy costs into their decision. Write "BER D suppresses achievable market rent" — not "BER D caps rent."

---

## Mortgage Amortisation

```
M = P × r × (1+r)^n / ((1+r)^n − 1)
```
Where P = mortgage principal, r = annual rate / 12, n = 300 (25 years)

Annual mortgage repayment = M × 12

First-year interest (iterate 12 months — do not estimate):
```
Month 1 interest = P × r
Month 1 principal = M − (P × r)
Balance after month 1 = P − month 1 principal
... repeat for months 2–12
Year-1 interest = sum of 12 monthly interest amounts
Year-1 principal = annual mortgage repayment − year-1 interest
```

---

## Rental Income

| Metric | Formula |
|--------|---------|
| Annual headline rent | Monthly rent × 12 |
| Vacancy-adjusted rent (1 month out) | Annual rent × (11/12) |
| Vacancy-adjusted rent (2 months out) | Annual rent × (10/12) |
| Vacancy-adjusted rent (3 months out) | Annual rent × (9/12) |
| Gross yield on purchase price | Annual rent / Purchase price × 100 |
| Gross yield on total acquisition cost | Annual rent / Total acquisition cost × 100 |

---

## Minimum Operating-Cost Stack (v8)

Every property must include ALL of the following in the Normal cost case:

| Item | Required |
|------|---------|
| Service charge | Yes |
| Landlord insurance | Yes |
| Repairs/maintenance reserve | Yes |
| Accounting/compliance | Yes |
| Letting/reletting allowance (even if self-managed) | Yes |
| Capex reserve | Yes |
| BER/energy reserve (where applicable) | Yes |
| Property-specific special allowance | Where relevant |

**Three cost cases:**
- **Lean:** Minimal realistic. Label "Lean — not used for default ranking."
- **Normal:** Default. Used for all rankings.
- **Conservative:** Higher-cost stress. Used in sensitivity tables.

**Do NOT apply identical cost bundles across different properties. Produce an actual breakdown.**

### Cost Component Guidance

| Item | 1-bed clean | 1-bed weak BER | Std 2-bed | 2-bed old/D-E BER | 3-bed/penthouse |
|------|-------------|---------------|-----------|-------------------|-----------------|
| Maintenance reserve | €800–€1,000 | €1,200–€1,500 | €1,000–€1,500 | €1,500–€2,000 | €2,000–€3,000 |
| Landlord insurance | €300–€400 | €350–€450 | €350–€500 | €400–€550 | €600–€900 |
| Accounting/compliance | €500–€750 | €500–€750 | €600–€900 | €600–€900 | €750–€1,000 |
| Letting fee (amortised) | €400–€600 | €400–€600 | €500–€750 | €500–€750 | €700–€1,000 |
| Capex reserve | €400–€700 | €600–€900 | €600–€900 | €900–€1,200 | €1,200–€2,000 |
| BER annual allowance | €0 | €500–€1,000 | €0 | €800–€1,500 | per assessment |

Service charge: use actual if confirmed; else estimate conservatively (label [ESTIMATED]).

### Operating Cost Table Format

| Property | Cost case | SC | Insurance | Maintenance | Accounting | Letting/reletting | Capax reserve | BER reserve | Other | Total ops |
|----------|-----------|---|-----------|-------------|------------|------------------|---------------|-------------|-------|-----------|

---

## Tax Scenarios (v8)

```
Taxable rental profit =
    headline annual rent
  − year-1 deductible mortgage interest (100% deductible for Irish rental)
  − service charge
  − landlord insurance
  − repairs/maintenance (revenue items only)
  − accounting/compliance
  − letting/reletting allowance (if deductible)
  − other allowable expenses
  [Capital items — refurb, BER upgrade — are NOT deducted from taxable profit]
  [If taxable profit is negative: tax = €0]
```

| Case | Rate | Label | Notes |
|------|------|-------|-------|
| **Default (modelling)** | **20%** | **Default modelling case** | **Use for headline, rankings, negotiation** |
| Medium | 30% | Medium sensitivity | Practical non-resident approximation |
| Conservative | 40% | Conservative stress | Full USC+PRSI |

**Tax sensitivity table format:**

| Tax case | Rate | Monthly CF | Eco ROI | Comment |
|----------|------|-----------|---------|---------|
| **Default (modelling)** | **20%** | **€XXX** | **X.X%** | **Headline case** |
| Medium | 30% | €XXX | X.X% | Practical non-resident approximation |
| Conservative | 40% | €XXX | X.X% | Full USC+PRSI |

Always add: *"20% default case used for modelling. This is not tax advice. Confirm non-resident landlord treatment, withholding, USC/PRSI, credits, deductions, and Bulgaria-Ireland treaty treatment with an Irish tax advisor."*

---

## Exact Cash-Flow and ROI Formulas (v8)

```
Annual after-tax CF =
    vacancy-adjusted annual rent
  − annual operating costs (all items, inc. SC, insurance, maintenance, letting, capex, BER reserve)
  − annual mortgage repayment (principal + interest)
  − tax

Monthly after-tax CF = annual after-tax CF / 12

Year-1 principal = annual mortgage repayment − year-1 interest

Economic return = annual after-tax CF + year-1 principal

Economic ROI = economic return / cash deployed × 100

ROI with X% appreciation = (economic return + purchase price × X%) / cash deployed × 100
```

Note: Appreciation applied to **purchase price**, not cash deployed.

### Mandatory Sanity Check

Before reporting any ROI:
```
Annual CF + Year-1 principal ≈ Economic return
Economic return / €300,000 ≈ Stated ROI %
```

Example: €667/mo CF × 12 = €8,004 + €3,099 principal = €11,103 → €11,103 / €300,000 = 3.70% ✓

---

## Financial Reconciliation Audit (v8 — mandatory)

Before producing rankings, run this audit for every property and every modelled rent case.

| Property | Rent case | A: vac-adj rent/yr | B: operating costs | C: annual mortgage | D: year-1 interest | E: taxable profit | F: tax at 20% | G: reported annual after-tax CF | H: recomputed CF = A−B−C−F | Variance G−H | Pass/Fail |
|----------|-----------|-------------------:|------------------:|------------------:|------------------:|------------------:|-------------:|--------------------------------:|---------------------------:|------------:|:---------:|

**Tolerances:** ≤€50/year CF | ≤0.05pp ROI | ≤€1/month monthly CF rounding
**If any variance exceeds tolerance: blocking audit fails. Do not produce rankings.**

The financial reconciliation table must be visible in the report or appendix. Do not simply state "passed."

---

## Rent Assumption Protocol

**Search first, then build evidence.** Before producing any rent assumption, run the `rent_comp_search_log` (SKILL.md §4) and log every search.

### Comp Tiers

| Tier | Description |
|------|-------------|
| A | Same building / same block. Highest confidence. Use directly. |
| B | Same development / adjacent block. High confidence with minor adjustment. |
| C | Same micro-area, within ~500m, similar spec. Medium confidence. |
| D | Broader area, less comparable. Low confidence; widen conservative/base spread. |

**A comp without a URL and Source ID cannot be used as a rent comp.**

### Rent Confidence

| Level | Requirement |
|-------|------------|
| High | ≥1 Tier A or B comp with URL |
| Medium | ≥2 strong Tier C comps with URLs |
| Low | Only Tier D, or <2 Tier C comps |
| Cap: Low-Medium | Size unknown — applies regardless of comp tier |

### Final Rent Confidence Table (v8 — single-valued)

| Property | Pre-cap confidence | Cap reason | Final confidence | Used in ranking |
|----------|-------------------|------------|-----------------|-----------------|

Do not write "High, capped at Low-Medium." Use only the final value in scoring and ranking.

### Rent Evidence Table Columns

| Comp | Source ID | URL | Comp Tier | Same bldg? | Same dev? | Beds/baths | Size | BER | Parking | Rent/mo | Adjustment | Support level | Relevance |

### Rent Output per Property

- Market rent range
- Legally achievable rent
- Underwriting rent (= legally achievable rent)
- Final rent confidence
- Legal rent confidence
- Evidence weakness statement
- RTB/RPZ verification required: Yes / No

---

## Unknown and Compact Unit Size Rules

### If size is Unknown

- Rent confidence maximum: Low-Medium
- Data Quality Score maximum: 7.0
- Layout/size quality score maximum: 5
- Verdict maximum: Conditional Buy
- **Primary ranking must use compact/downside rent case:**

| Case | Assumption | Rent/mo | Notes |
|------|-----------|--------:|-------|
| **A: Compact/downside** | Assumes compact size | Base comp rent − ≥10% (2-bed) / −≥5% (1-bed) | **Use for primary ranking** |
| B: Normal size | Assumes standard size | Base comp rent | Shown as upside only |

Compact/unknown-size downside table (required in report — missing = blocking failure):

| Property | Size status | Normal comp rent | Compact/downside rent | Rent in primary ranking | Why |
|----------|-------------|-----------------|----------------------|------------------------|-----|

### If 2-bed < 55m² (compact 2-bed)

- Classify as compact 2-bed
- Reduce layout/size score by 1–2 points
- Reduce rent confidence unless same-size comps support rent
- Apply tenant-pool and resale-liquidity penalty

### If 1-bed < 45m² (compact 1-bed)

- Classify as compact 1-bed
- Reduce layout/size score by 1–2 points
- Reduce resale liquidity score by 1 point
- Include 2.5-month vacancy scenario

---

## Stress Test Scenarios

| # | Scenario | Modifications |
|---|----------|--------------|
| 1 | Base | Base rent, 5.65%, 11/12 occ, base costs |
| 2 | Rent −10% | Annual rent × 0.90 |
| 3 | Rent −15% | Annual rent × 0.85 |
| 4 | Costs +25% | Total costs × 1.25 |
| 5 | Occ 10/12 | Rent × (10/12) |
| 6 | Occ 9/12 | Rent × (9/12) |
| 7 | Rate 7.0% | Recalculate M at 7.0%/12 |
| 8 | Rate 8.0% | Recalculate M at 8.0%/12 |
| 9 | Combined | Rent × 0.90 AND Costs × 1.25 AND occ 10/12 AND rate 7.0% |
| 10 | Severe | Rent × 0.85 AND Costs × 1.25 AND occ 9/12 AND rate 8.0% |

S9 and S10 must use the same tax formula and cash-flow formula as the base case.

---

## Service Charge Sensitivity Tables

For every property where SC is [ESTIMATED]:

| SC assumption | Annual SC | Monthly CF (20% default) | Eco ROI | S9 CF | vs. base |
|--------------|----------|--------------------------|---------|-------|----------|
| Low estimate | €X,XXX | | | | Optimistic |
| **Base [ESTIMATED]** | **€X,XXX** | | | | **Used in model** |
| High estimate | €X,XXX | | | | Conservative |
| Worst-case confirmed | €X,XXX | | | | If SC at top of range |

Guidelines:
- Standard 2-bed: low €1,500, base = estimated, high €3,000, worst €3,500
- Celtic Tiger era building: low €2,000, base = estimated, high €3,500, worst €4,500
- 1-bed: low €1,200, base = estimated, high €2,500, worst €3,200

If high-estimate SC makes the property Weak or Fragile: flag as "SC Risk Flag."

SC sensitivity NOT required where SC is confirmed.

---

## Rent Sensitivity Tables

For every property in top half of ranking:

| Rent/mo | Annual rent | Monthly CF (20% default) | Eco ROI | S9 CF | Verdict |
|-------:|-----------|------------------------:|------:|------:|---------|

If rent range changes the ranking, say so explicitly.

---

## Required Output Columns for Master Comparison Table

| Column | Formula |
|--------|---------|
| Asking price | Listing |
| Stamp duty | 1% × price |
| Legal/setup | Default or actual |
| Refurb/furnishing | Estimate |
| BER upgrade | Separate line where applicable |
| Total acquisition cost | Sum |
| Cash deployed | €300,000 default |
| Mortgage required | Total acq − €300k |
| LTV | Mortgage / price |
| Monthly mortgage | M formula |
| Underwriting rent | Legally achievable; base tier |
| Final rent confidence | From final rent confidence table |
| Legal rent confidence | Separate value |
| Annual costs (ex-mortgage) | Property-specific; Normal case |
| Taxable profit | Rent − interest − deductible costs |
| Estimated tax (20% default) | Taxable profit × 0.20 |
| Annual after-tax CF | Rent − costs − tax − mortgage |
| Monthly after-tax CF | Annual / 12 |
| Year-1 principal | From amortisation |
| Economic return | CF + principal |
| Economic ROI (20% default) | Return / €300k |
| ROI +2% appreciation | (Return + price × 2%) / €300k |
| ROI +4% appreciation | (Return + price × 4%) / €300k |
| S9 combined downside CF | Stress test #9 monthly CF |
| Stress resilience category | Robust / Good / Thin / Weak / Fragile |
| Gross yield | Annual rent / price |
| DSCR | Vacancy-adj rent / annual mortgage |
| Tenancy status | Vacant / Tenanted / Unknown |
| RTB risk | Low / Medium / High |
| OMC/building risk (current) | Low / Medium / High / Unknown |
| BER risk | Low / Medium / High |
| Data Quality Score | 1–10 |
| Confirmed? | Yes / Watchlist |
| Verdict | Conditional verdict |
