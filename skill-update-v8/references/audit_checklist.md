# Blocking Audit Checklist — v8

**This audit is a blocking gate, not an advisory checklist.** Run it before producing any report. If any check fails, output only the Audit Failure block. Do not add warning banners and continue — stop.

The audit table must be **visible in every report**. Do not simply state "audit passed."

---

## Audit Failure Output Template

```
# Audit Failure — Report Not Generated

| Failure | Property | Why it matters | Required fix |
|---------|----------|----------------|-------------|
| [check name] | [property] | [reason] | [action] |

Once corrected, rerun from Stage 1 (canonical_property_facts).
```

---

## Check 1: Canonical Facts Complete

- [ ] `canonical_property_facts` table exists for every property
- [ ] No field is blank — every field shows a value, "Unknown — not found in source," or "[ESTIMATED]"
- [ ] `exact_address` is not "unknown" — if unverifiable, property goes to Watchlist
- [ ] `current_status` confirms Active
- [ ] `service_charge_status` is Confirmed, Estimated, or Unknown — not blank
- [ ] `tenancy_status` is Vacant, Tenanted, or Unknown — not blank
- [ ] All canonical facts sourced from: current listing page, agent page, official source, uploaded document, or user-confirmed statement
- [ ] **Prior reports, memory, and previously generated analysis text are NOT valid sources**

---

## Check 2: Source Support Validated (v8 — enhanced)

- [ ] `source_register` exists for every material factual claim
- [ ] Every entry includes `support_level` (Exact / Partial / Directional / Contradictory / Access blocked / Unverified)
- [ ] Every rent comp has a Source ID with a URL
- [ ] Every building/OMC/remediation claim has a Source ID
- [ ] Every SC figure has a Source ID or is marked [ESTIMATED] with a rationale
- [ ] No confirmed field is based on a Partial / Directional / Access blocked / Unverified source
- [ ] No ranking input is based solely on Directional or Unverified sources
- [ ] Contradictory sources are flagged and resolved before proceeding
- [ ] "No reports found" appears only where a search was actually performed and logged

**Failure consequence:** Label unsourced/Unverified claims `UNSOURCED — do not use for ranking`. Downgrade Partial claims to estimated. Resolve Contradictory claims. Remove from scoring until resolved.

---

## Check 3: Micro-Location Resolver Run

- [ ] Micro-location resolver output exists for every property
- [ ] `exact_address` used to determine `scoring_location` — not agent's headline area
- [ ] If listing headline differs from exact-address area, report states: "Listed as [X]; scored as [Y] based on exact address"
- [ ] No property scored as premium area based solely on agent marketing language
- [ ] Hard regression checks passed:
  - [ ] Corn Mill: not labelled "Clontarf" unless address confirms
  - [ ] Fitzwilliam Point: not labelled "Fitzwilliam St Georgian core"
  - [ ] No "near [area]" property receives premium score without address evidence
- [ ] If location confidence is Medium or Low, Dim 1 and Dim 14 penalised accordingly

---

## Check 4: Rent Comp Search Log Present

- [ ] `rent_comp_search_log` exists for every property
- [ ] Levels 1–2 (exact building + exact street) searched before broader comps
- [ ] Each search entry shows a result status
- [ ] "No Tier A/B comps found" only stated if levels 1–2 logged as "Searched, not found" or "Access blocked"
- [ ] "Access blocked" used instead of "not found" when access was attempted but blocked
- [ ] User-reported comps recorded as "User-observed (not independently verified)"

---

## Check 5: Rent Comp Evidence Valid

- [ ] Every comp has a Source ID and URL
- [ ] No URL / no Source ID = comp labelled "unverified market signal" and excluded
- [ ] Comp Tier assigned to every comp (A/B/C/D)
- [ ] Every comp has a `support_level`
- [ ] Rent confidence is single-valued (Final Rent Confidence Table present, no contradictory labels)
- [ ] Final rent confidence is consistent with available comps and caps applied
- [ ] Rent comps are from the micro-area confirmed by the micro-location resolver

---

## Check 6: OMC/Building Search Log Complete (v8 — new)

- [ ] OMC/building search log exists for every property's development
- [ ] At minimum: fire safety, water ingress, defects, remediation, special levy, and news searches logged
- [ ] "No public red flags found" only stated if all minimum searches are logged as "Searched, not found"
- [ ] If OMC search is incomplete: OMC risk status = Unknown or Medium, not Low
- [ ] If documents not reviewed: Current OMC Liability score ≤6
- [ ] Development-level issue not treated as exact-building issue unless source proves applicability
- [ ] Evidence statuses applied to every OMC claim

---

## Check 7: Formula Audit (v8 — enhanced with exact tolerances)

- [ ] Mortgage = total acquisition cost − cash deployed
- [ ] Annual mortgage = monthly mortgage × 12
- [ ] Year-1 principal = annual mortgage − year-1 interest
- [ ] Tax = taxable profit × default rate (20% unless user specified)
- [ ] Annual after-tax CF = vacancy-adjusted rent − operating costs − annual mortgage − tax
- [ ] Economic return = annual CF + year-1 principal
- [ ] Economic ROI = economic return / cash deployed
- [ ] ROI with appreciation uses purchase price × appreciation rate
- [ ] S9 and S10 use the same tax and cash-flow formula as the base case
- [ ] All cash-flow tables reconcile to the same annual after-tax CF
- [ ] Tolerances: ≤€50/year CF variance, ≤0.05pp ROI variance, ≤€1/month rounding

**If any formula check fails:** blocking audit fails; do not produce rankings.

---

## Check 8: Input Audit (v8 — updated)

- [ ] Rent assumptions supported by verified comps with URLs
- [ ] Legal rent separated from market rent
- [ ] If previous rent is below market: ranking uses rent-capped case (market-rent case supplementary only)
- [ ] If tenancy unknown: both market-rent and rent-restricted cases shown; legal rent confidence is not High
- [ ] **BER is NOT a legal rent cap** — BER D/E suppresses achievable market rent; does not legally limit what can be charged
- [ ] Tenancy status columns present in master table
- [ ] SC is actual or clearly [ESTIMATED] with conservative estimate
- [ ] SC sensitivity table included for every property with [ESTIMATED] SC
- [ ] BERs confirmed or flagged; BER D or below has upgrade cost in acquisition budget
- [ ] Operating costs use Normal case (not Lean) for default rankings
- [ ] All required items in minimum cost stack present for each property
- [ ] Size is extracted or noted as "Unknown [NOT DISCLOSED IN LISTING]"
- [ ] If size unknown: compact/downside table present; primary ranking uses compact/downside rent; verdict capped at Conditional Buy

---

## Check 9: Tax Scenarios (v8 — updated default to 20%)

- [ ] Three tax scenarios shown for every top candidate: 20%, 30%, 40%
- [ ] **20% is the default/headline case** — all master tables, stress tests, and rankings use 20%
- [ ] 30% is the medium sensitivity case; 40% is the conservative stress
- [ ] **30% must NOT be used as the central headline case** — this is a blocking failure
- [ ] Tax caveat present: "20% default case used for modelling. This is not tax advice; confirm with Irish tax advisor."
- [ ] Non-resident flags noted: withholding, USC/PRSI, collecting agent, Bulgaria-Ireland treaty

**Failure consequence:** Replace 30% headline figures with 20% figures throughout. Recalculate rankings.

---

## Check 10: Ranking Integrity

- [ ] No unconfirmed properties in primary ranking
- [ ] No unconditional BUY where major condition is unresolved
- [ ] Size-unknown property does not outrank a similarly attractive verified property without explanation
- [ ] No premium location score from agent headline area — micro-location resolver used
- [ ] Top resilience property has resilience label matching stress test results
- [ ] Three rankings present: yield / resilience / overall
- [ ] Four price-tier rankings present (A/B/C/D)
- [ ] Category labels assigned to each top candidate
- [ ] "If X clears, ranking changes to Y" section included for all conditional-risk properties
- [ ] Unknown-size properties ranked using compact/downside rent case for primary ranking

---

## Check 11: Data Quality Scores

- [ ] Data Quality Score (1–10) present for every confirmed property
- [ ] DQ score reflects confirmed vs. estimated vs. unknown fields
- [ ] Size unknown: DQ Score capped at 7.0
- [ ] SC estimated: −1.0 deduction applied
- [ ] Tenancy unknown: −1.0 deduction applied
- [ ] Location uncertain (Medium confidence): −0.5 deduction applied
- [ ] Data Quality Summary Table present with columns: Property | Size | SC | BER | Tenancy | Location | Prev Rent | DQ Score | Key Gaps
- [ ] Any DQ Score < 7/10 has a note explaining unknowns and how uncertainty affects the financial model

---

## Check 12: Negotiation Terminology Consistency

- [ ] Only the six approved price terms used throughout
- [ ] **Walk-away ceiling is not used to describe a low opening bid**
- [ ] Walk-away ceiling ≥ stretch maximum ≥ target settlement ≥ opening offer
- [ ] Four price-tier ranking tables present: A (asking) / B (target settlement) / C (aggressive buyer-case) / D (walk-away ceiling)
- [ ] Offer amounts consistent across negotiation table, price-tier tables, and final recommendation
- [ ] All offer numbers rounded to nearest €500 or €1,000
- [ ] Walk-away ceiling constraints applied per SKILL.md §12 (cannot exceed asking with unresolved diligence)

---

## Check 13: Stale Listing Diagnostic

- [ ] Any property listed >60 days has a Stale Listing Diagnostic block
- [ ] >90 days listed: opening offer moves toward aggressive buyer-case (8–12% below asking)
- [ ] >90 days with no price reduction: explicitly flag "vendor may not be motivated — investigate reason before offer"

---

## Check 14: Service Charge Sensitivity Tables

- [ ] SC sensitivity table present for every property where SC is [ESTIMATED]
- [ ] Required format includes low, base, high, and confirmed worst-case rows
- [ ] CF figures in SC sensitivity table use 20% default tax (not 30%)
- [ ] If SC at high estimate makes the property Weak or Fragile: flagged with SC Risk Flag

---

## Check 15: Central Conclusions by Objective

- [ ] Section 25 (Central Conclusions by Objective) present in multi-property reports
- [ ] Objectives covered: highest income / best stress resilience / best if negotiated / cleanest risk / best for 40% tax / best if one conditional risk clears
- [ ] Conclusions are distinct per objective
- [ ] Each "best if negotiated" entry uses target settlement price from negotiation table

---

## Check 16: Calculation Ledger and Financial Reconciliation (v8 — new)

- [ ] Calculation ledger produced before master financial table
- [ ] Every number in master financial table traces to the ledger
- [ ] Financial reconciliation table present (visible in report or appendix)
- [ ] No cell in reconciliation table shows variance > €50/year
- [ ] "Financial reconciliation passed" only stated if table is present and all variances ≤€50/year

---

## Check 17: Property Registry and Fact-Change Log (v8 — new)

- [ ] Property registry checked (or incompleteness disclosed)
- [ ] Fact-change log present if any canonical fact changed from prior registry value
- [ ] No unresolved material fact conflict
- [ ] "No previously excluded properties" only stated if registry confirms it

---

## Check 18: Compact/Unknown-Size Downside Table (v8 — new)

- [ ] If any property has unknown size: compact/downside table present
- [ ] Primary ranking uses compact/downside rent for size-unknown properties
- [ ] Normal-size rent case labelled "upside only — not primary ranking driver"

---

## Check 19: v8 Compliance Check Present

- [ ] Section 27 (v8 Compliance Check) present at end of report
- [ ] All 12 items assessed as Pass or Fail
- [ ] "Do not rely on this report until failed v8 checks are resolved" present if any item fails

---

## Evidence Status Reference

| Status | Meaning | When to use |
|--------|---------|-------------|
| Found and verified | Source found; URL logged; claim directly supported | Confirmed comp, confirmed fact from listing |
| Found but incomplete | Source found but partially applicable | Comp from similar building, not exact |
| User-observed (not independently verified) | User reports seeing this; not confirmed | User mentions a same-building listing |
| Searched, not found | Search performed and logged; no result | Actual search run, returned nothing |
| Access blocked | Attempted but site blocked | Daft/RTB site returned 403 or redirect |
| Not searched | Search not performed | No attempt made; conclusion is provisional |
| Unknown | No search; no user input | Field simply not known |

---

## Language Standards Reference (v8)

| Use | Avoid |
|-----|-------|
| "Searched, not found — documents still required" | "No defect reports found" as proof of safety |
| "Access blocked — comp may exist" | "No Tier A/B comps found" without logging the search |
| "Not searched — conclusion provisional" | Silent omission of evidence status |
| "Listed as [X]; scored as [Y] based on exact address" | Agent headline area used uncritically |
| "BER D suppresses achievable market rent" | "BER limits legal rent" or "BER caps rent" |
| "Conditional Buy — verify [X]" | "BUY" on unresolved property |
| "20% default case for modelling" | 30% presented as central headline case |
| "Size unknown — compact/downside case used for primary ranking" | Treating size-unknown as fully equivalent to known |
| "Good under combined downside, but fails severe downside" | "Strong resilience" for Good-but-S10-negative |
