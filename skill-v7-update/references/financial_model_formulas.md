# Financial Model Formulas

## CRITICAL: Correct Mortgage Principal Calculation

The mortgage must include ALL acquisition costs, not just purchase price minus cash:

```
Total acquisition cost = purchase price
                       + stamp duty (1% up to EUR1M; 2% above)
                       + legal/valuation fees (default EUR3,500; EUR4,500 if non-resident complexities)
                       + furnishing/setup (default EUR5,000 rentable-condition)
                       + refurbishment allowance (EUR0-EUR20,000+ depending on condition and BER)
                       + BER upgrade allowance (separate from refurb -- see below)

Mortgage required = total acquisition cost - cash deployed (default EUR300,000)
```

Always present the full breakdown in the acquisition table. If mortgage differs from (purchase price - EUR300k), the table explains why.

### BER Upgrade Cost in Acquisition Budget

Do not bury BER upgrade cost in annual maintenance. Include it as a one-off acquisition item:
- BER D: add EUR8,000-EUR15,000 (heat pump, insulation, windows)
- BER E: add EUR15,000-EUR25,000 (major retrofit)
- BER F/G: add EUR25,000+ (full retrofit) -- likely unlendable

**IMPORTANT -- BER is not a legal rent cap:** BER D or E does NOT legally cap the rent that can be charged. It suppresses achievable market rent because tenants factor energy costs into their decision. Always write "BER D1 reduces achievable market rent" not "BER D1 caps rent." The distinction matters for rent sensitivity analysis -- you should model what the market will actually pay given the BER, not assume a legal ceiling.

---

## Mortgage Amortisation

Monthly payment:
```
M = P x r x (1+r)^n / ((1+r)^n - 1)
```
Where:
- P = mortgage principal (all acquisition costs minus EUR300,000)
- r = annual interest rate / 12
- n = term months (default: 25 x 12 = 300)

Annual mortgage repayment = M x 12

First-year interest (iterate 12 months -- do not estimate):
```
Month 1 interest = P x r
Month 1 principal = M - (P x r)
Balance after month 1 = P - month 1 principal
... repeat for months 2-12
Year-1 interest = sum of 12 monthly interest amounts
Year-1 principal repayment = Annual mortgage repayment - Year-1 interest
```

---

## Rental Income

| Metric | Formula |
|--------|---------|
| Annual headline rent | Monthly rent x 12 |
| Vacancy-adjusted rent (1 month out) | Annual rent x (11/12) |
| Vacancy-adjusted rent (2 months out) | Annual rent x (10/12) |
| Vacancy-adjusted rent (3 months out) | Annual rent x (9/12) |
| Gross yield on purchase price | Annual rent / Purchase price x 100 |
| Gross yield on total acquisition cost | Annual rent / Total acquisition cost x 100 |

---

## Property-Specific Operating Costs

Do NOT apply identical cost bundles across different property types. Produce an actual annual cost breakdown for each property.

### Cost Component Guidance

| Cost Item | 1-bed clean | 1-bed weak BER | Std 2-bed | 2-bed old/D-E BER | 3-bed/penthouse |
|-----------|-------------|---------------|-----------|-------------------|-----------------|
| Maintenance reserve | EUR800-EUR1,000 | EUR1,200-EUR1,500 | EUR1,000-EUR1,500 | EUR1,500-EUR2,000 | EUR2,000-EUR3,000 |
| Landlord insurance | EUR300-EUR400 | EUR350-EUR450 | EUR350-EUR500 | EUR400-EUR550 | EUR600-EUR900 |
| Accounting/compliance | EUR500-EUR750 | EUR500-EUR750 | EUR600-EUR900 | EUR600-EUR900 | EUR750-EUR1,000 |
| Letting fee (amortised) | EUR400-EUR600 | EUR400-EUR600 | EUR500-EUR750 | EUR500-EUR750 | EUR700-EUR1,000 |
| Capex reserve | EUR400-EUR700 | EUR600-EUR900 | EUR600-EUR900 | EUR900-EUR1,200 | EUR1,200-EUR2,000 |
| BER annual allowance | EUR0 | EUR500-EUR1,000 | EUR0 | EUR800-EUR1,500 | per assessment |
| Large terrace/private lift | n/a | n/a | n/a | n/a | add EUR500-EUR1,500 |

Service charge: use actual if confirmed; else estimate conservatively (label [ESTIMATED]). Do not assume a low figure without evidence.

Maintenance/capex reserve exceptions:
- Known remediation-risk building: do NOT bury in normal capex -- create a separate "remediation contingency" line as a scenario, not a base-cost assumption
- BER D/E: add a separate explicit upgrade allowance in the acquisition budget (not in annual costs)

### Example Annual Cost Table Format

| Cost Item | Source | Annual Amount |
|-----------|--------|--------------|
| Service charge | [Actual/ESTIMATED] | EUR X,XXX |
| Maintenance reserve | Standard for type | EUR X,XXX |
| Landlord insurance | Estimate | EUR XXX |
| Accounting/compliance | Estimate | EUR XXX |
| Letting fee (amortised) | Estimate | EUR XXX |
| Capex reserve | Standard for type | EUR XXX |
| BER annual allowance | [if applicable] | EUR XXX |
| **Total annual costs (ex-mortgage)** | | **EUR X,XXX** |

---

## Three Tax Scenarios

Every serious candidate must show three tax scenarios. Never present just the 20% case as definitive.

```
Taxable rental profit =
    vacancy-adjusted rent
  - 100% of year-1 mortgage interest (deductible for Irish rental)
  - service charge
  - insurance
  - maintenance/repairs (revenue only)
  - accounting/compliance
  - other allowable expenses

Low tax (20%): estimated tax = taxable profit x 0.20
Medium tax (30%): estimated tax = taxable profit x 0.30
High tax (40%): estimated tax = taxable profit x 0.40
```

**Central case for a Bulgaria-based non-resident: 30%**

For a non-resident landlord with no Irish collecting agent, 20% withholding tax is the minimum legal requirement. However:
- USC (Universal Social Charge) and PRSI may apply on top of income tax
- Stage 1 / Stage 2 Irish income tax band interaction may push effective rate above 20%
- Bulgaria-Ireland tax treaty reduces double-taxation but does not eliminate all Irish tax
- Practical effective rate for a non-resident with rental income and no other Irish income is typically 30-40%

Therefore: **Use 30% as the headline/central case.** The 20% case is the optimistic floor; the 40% case is the conservative ceiling. When showing a single figure in headlines or rankings, use 30%.

### Tax Sensitivity Table Format

| Tax case | Rate | Monthly CF | Eco ROI | Comment |
|----------|------|-----------|---------|---------|
| Low (floor) | 20% | EUR XXX | X.X% | Minimum withholding only |
| **Medium (central)** | **30%** | **EUR XXX** | **X.X%** | **Practical non-resident approximation** |
| High (stress) | 40% | EUR XXX | X.X% | Conservative; full USC+PRSI |

Always add: *"This is not tax advice. Confirm with Irish tax advisor -- non-resident landlord treatment, collecting agent/withholding, USC/PRSI, credits, and Bulgaria-Ireland treaty all affect the outcome."*

Non-resident considerations to flag:
- 20% withholding may apply if no collecting agent appointed
- USC and PRSI may apply to rental income
- Tax treaty between Ireland and Bulgaria may affect treatment
- Stage 1 / Stage 2 Irish income tax band interaction

---

## CRITICAL: Correct Cash Flow and ROI Formulas

**Annual after-tax cash flow (after full mortgage payment):**
```
Annual after-tax CF =
    vacancy-adjusted rent
  - total annual costs (ex-mortgage)
  - estimated tax
  - annual mortgage repayment (P+I)
```

```
Monthly after-tax CF = Annual after-tax CF / 12
```

**Year-1 principal repayment:**
```
Year-1 principal repayment = Annual mortgage repayment - Year-1 interest
```
(Use the amortisation iteration above -- not an estimate.)

**Economic return before appreciation:**
```
Economic return = Annual after-tax CF + Year-1 principal repayment
```

**Economic ROI before appreciation:**
```
Economic ROI = Economic return / Cash deployed x 100
```

**ROI with appreciation:**
```
ROI with X% appreciation = (Economic return + Purchase price x X%) / Cash deployed x 100
```

Note: appreciation applied to **purchase price**, not cash deployed.

### Mandatory Sanity Check

Before reporting any ROI:
```
Annual after-tax CF + Year-1 principal approx Economic return
Economic return / EUR300,000 approx Stated ROI %
```

Example:
- Monthly CF: +EUR400 -> Annual CF: EUR4,800
- Year-1 principal on EUR150k mortgage at 5.65%: ~EUR3,100
- Economic return: EUR7,900
- Economic ROI: 7,900 / 300,000 = **2.6%** -- not 7%, not 11%

If monthly CF is negative but ROI is positive (due to principal): flag as:
*"Monthly CF is negative but principal repayment creates positive economic return -- this is a capital-growth-weighted investment, not a yield investment."*

---

## Rent Assumption Protocol

**Search first, then build evidence.** Before producing any rent assumption, run the `rent_comp_search_log` in SKILL.md Stage 4 and log every search. You may only conclude "no Tier A/B comps found" if those searches were actually performed and logged as "Searched, not found" or "Access blocked."

For every property:

1. Run rent_comp_search_log (see SKILL.md Stage 4) for this property
2. Match comps by: beds, baths, size, BER, parking, floor, condition
3. Build the rent comp evidence table (all comps must have Source ID and URL):

| Comp | Source ID | URL | Comp Tier | Same building? | Same development? | Beds/baths | Size | BER | Parking | Rent/mo | Adjustment | Relevance |
|------|:---------:|-----|:---------:|:--------------:|:-----------------:|---:|---:|---|---|---:|---|---|

**Comp Tier classification:**
- **Tier A** -- Same building / same block. Highest confidence. Use directly.
- **Tier B** -- Same development / adjacent block. High confidence with minor adjustment.
- **Tier C** -- Same micro-area, within ~500m, similar spec. Medium confidence.
- **Tier D** -- Broader area, less comparable. Low confidence; widen the conservative/base spread.

**A comp without a URL and Source ID cannot be used as a rent comp.** It may be noted as an "unverified market signal" but cannot support a rent assumption or be counted toward a confidence level.

If no Tier A or Tier B comps exist, state this explicitly and reduce rent confidence to Low or Medium. Medium requires >=2 strong Tier C comps with URLs; High requires >=1 Tier A or B comp with URL.

4. Three tiers:

| Tier | Meaning |
|------|---------|
| Conservative | Achievable in a soft market or with below-average condition |
| Base | Most likely if legally chargeable and property presented well |
| Strong | Optimistic but plausible with premium condition and strong season |

5. Confidence: **High** (Tier A/B comp with URL) / **Medium** (>=2 Tier C comps with URLs) / **Low** (only Tier D or fewer than 2 Tier C comps)

6. Legal rent separation:

| Field | Definition |
|-------|-----------|
| Market rent | What the unit could achieve if freely let with no legal constraint |
| Legally achievable rent | What can actually be charged given RPZ, previous rent, tenancy history |
| Underwriting rent | Used in financial model -- must be legally achievable rent |
| RTB/RPZ verification required | Yes / No |
| Legal rent confidence | High / Medium / Low |

7. Tenancy status columns (required in master table):

| Column | Values |
|--------|--------|
| Tenancy status | Vacant / Tenanted / Unknown |
| RTB risk | Low / Medium / High |
| Underwriting rent legal confidence | High / Medium / Low |

**Critical:** If previous rent is disclosed and below market, default ranking must use rent-capped case.
If tenancy status is unknown, show both market-rent case and a plausible rent-restricted case.

---

## Unknown and Compact Unit Size Rules

### If size is Unknown (not disclosed in listing)

- Rent confidence maximum = Low-Medium regardless of comp quality
- Data Quality Score maximum = 7.0
- Layout/size quality score (dim 12) maximum = 5
- Overall verdict maximum = Conditional Buy until size is confirmed
- **Model two cases:**

| Case | Assumption | Rent/mo | Notes |
|------|-----------|--------:|-------|
| **A: Normal size** | Assumes ~65m2 2-bed or ~50m2 1-bed | Base comp rent | Optimistic case |
| **B: Compact size** | Assumes 55m2 2-bed or 42m2 1-bed | Base comp rent - 10% minimum | Conservative case; use for base ranking |

- Do not use normal-size comps without an explicit discount unless same-building evidence proves the unit is standard size.
- Conservative rent must be at least 10% below same-spec normal-size comps.
- Report must state: **"Size unknown materially limits rent and resale confidence. Conservative case used for ranking; normal-size case shown as upside."**

### If 2-bed is under 55 m2 (compact 2-bed)

- Classify as **compact 2-bed** in canonical facts and report
- Reduce layout/size score (dim 12) by 1--2 points
- Reduce rent confidence by one level unless same-size comps directly support rent
- Apply tenant-pool penalty: narrow sharers market; professional couples prefer 60m2+
- Apply resale-liquidity penalty: compact 2-beds face a narrower buyer pool

### If 1-bed is under 45 m2 (compact 1-bed)

- Classify as **compact 1-bed** in canonical facts and report
- Reduce layout/size score (dim 12) by 1--2 points
- Reduce resale liquidity score (dim 14) by 1 point
- Include stronger vacancy/rent sensitivity scenarios (add a 2.5-month vacancy scenario)

### Size-unknown property vs. verified property (ranking rule)

Do not let a size-unknown property rank above a similarly attractive but fully verified property unless the report explicitly explains why the size-unknown property's other advantages outweigh the uncertainty. State this comparison explicitly in the ranking commentary.

---

## Rent Sensitivity Tables

For every property in the top half of the ranking, include:

| Rent/mo | Annual rent | Monthly CF | Eco ROI | Combined downside CF (#9) | Verdict |
|-------:|-----------|----------:|------:|------------------------:|---------|
| EUR X,XXX (Conservative) | | | | | |
| EUR X,XXX (Base) | | | | | |
| EUR X,XXX (Strong) | | | | | |
| EUR X,XXX (+EUR150 upside) | | | | | |

If the rent range materially changes the ranking (e.g., strong rent moves from Marginal to Possible Buy), say so explicitly.

Required for: Fitzwilliam Quay, William Bligh, Fitzwilliam Point, Crosbie's Yard, Longboat Quay, Kirkpatrick, Corn Mill.

---

## Service Charge Sensitivity Tables

For every property where service charge is [ESTIMATED], include an SC sensitivity table:

| SC assumption | Annual SC | Monthly CF (30% tax) | Eco ROI | S9 CF | vs. base case |
|--------------|----------|---------------------|---------|-------|--------------|
| Low estimate | EUR X,XXX | | | | Optimistic |
| **Base [ESTIMATED]** | **EUR X,XXX** | | | | **Used in model** |
| High estimate | EUR X,XXX | | | | Conservative |
| Worst-case confirmed | EUR X,XXX | | | | If SC confirmed at top of range |

Guidelines for SC sensitivity range:
- For standard 2-bed: low = EUR1,500, base = estimated figure, high = EUR3,000, worst = EUR3,500
- For Celtic Tiger era building: low = EUR2,000, base = estimated, high = EUR3,500, worst = EUR4,500
- For 1-bed: low = EUR1,200, base = estimated figure, high = EUR2,500, worst = EUR3,200

If the high-estimate SC makes the property Weak or Fragile under combined stress, flag this as:
> **SC Risk Flag: If SC is confirmed above EUR[high estimate], the stress resilience category degrades to [Weak/Fragile]. Verify SC before offer.**

SC sensitivity is NOT required for properties where SC is confirmed from the listing or OMC pack.

---

## Stress Test Scenarios

Run all 10 scenarios. For each: recalculate annual after-tax CF and monthly CF from scratch.

| # | Scenario | Modifications |
|---|----------|--------------|
| 1 | Base case | Base rent, 5.65%, 1 month vacancy |
| 2 | Rent -10% | Annual rent x 0.90; otherwise base |
| 3 | Rent -15% | Annual rent x 0.85; otherwise base |
| 4 | Costs +25% | Total costs x 1.25; otherwise base |
| 5 | 2 months vacancy | Rent x (10/12); otherwise base |
| 6 | 3 months vacancy | Rent x (9/12); otherwise base |
| 7 | Rate 7.0% | Recalculate M at r = 7.0%/12; otherwise base |
| 8 | Rate 8.0% | Recalculate M at r = 8.0%/12; otherwise base |
| 9 | Combined downside | **All simultaneously**: Rent x 0.90 AND Costs x 1.25 AND occupancy 10/12 AND M at 7% |
| 10 | Severe downside | **All simultaneously**: Rent x 0.85 AND Costs x 1.25 AND occupancy 9/12 AND M at 8% |

Stress table columns:
- Monthly cash flow
- DSCR (vacancy-adjusted rent / annual mortgage)
- Status: Positive / Marginal (within EUR100) / Negative
- Commentary

### Stress Resilience Categories

Apply one label per property based on combined downside (#9) and severe downside (#10):

| Category | Definition |
|----------|-----------|
| **Robust** | Combined downside > +EUR300/mo AND severe downside >= EUR0 |
| **Good** | Combined downside +EUR100 to +EUR300/mo |
| **Thin but positive** | Combined downside EUR0 to +EUR100/mo |
| **Weak** | Combined downside negative; base case positive |
| **Fragile** | Base case weak or multiple stress scenarios negative |

Do not describe a Thin property as having "strong" or "robust" resilience. Use the exact category label.

---

## Price-Tier Rankings

Every multi-property report must show three rankings:

### Ranking at Asking Price
- Use main analysis figures

### Ranking at Target Settlement Price
- Per negotiation module, recalculate: mortgage, monthly payment, monthly CF, Eco ROI, combined downside CF
- Show rank change vs. asking price

### Ranking at Stretch/Walk-Away Price
- Recalculate the same metrics

### Price-Tier Ranking Table Format

| Rank | Property | Asking metrics | Target price metrics | Improvement |
|------|----------|--------------|--------------------|-----------:|
| | | CF/mo / Eco ROI | CF/mo / Eco ROI | delta CF / delta ROI |

For each property where target price changes the verdict (e.g., Marginal -> Possible Buy), highlight this explicitly.

---

## Required Output Columns for Master Comparison Table

| Column | Formula / Source |
|--------|-----------------|
| Asking price | Listing |
| Stamp duty | 1% x price |
| Legal/setup | Default or actual |
| Refurb/furnishing | Estimate |
| BER upgrade (if applicable) | Separate line |
| Total acquisition cost | Sum |
| Cash deployed | EUR300,000 default |
| Mortgage required | Total acq. cost - EUR300k |
| LTV | Mortgage / price |
| Monthly mortgage | M formula |
| Underwriting rent | Legally achievable; base tier |
| Rent confidence | High / Medium / Low |
| Legal rent confidence | High / Medium / Low |
| Annual costs (ex-mortgage) | Property-specific sum |
| Taxable profit | Rent - interest - costs |
| Estimated tax (30% central) | Taxable profit x 0.30 |
| Annual after-tax CF | Rent - costs - tax - mortgage |
| Monthly after-tax CF | Annual / 12 |
| Year-1 principal | From amortisation |
| Economic return | CF + principal |
| Economic ROI (no appreciation) | Return / EUR300k |
| ROI +2% appreciation | (Return + price x 2%) / EUR300k |
| ROI +4% appreciation | (Return + price x 4%) / EUR300k |
| Combined downside CF | Stress test #9 monthly CF |
| Stress resilience category | Robust / Good / Thin / Weak / Fragile |
| Gross yield | Annual rent / price |
| DSCR | Vacancy-adj rent / annual mortgage |
| Tenancy status | Vacant / Tenanted / Unknown |
| RTB risk | Low / Medium / High |
| OMC/building risk (current) | Low / Medium / High / Unknown |
| BER risk | Low / Medium / High |
| Data Quality Score | 1-10 |
| Confirmed? | Yes / Watchlist |
| Verdict | Conditional verdict |
