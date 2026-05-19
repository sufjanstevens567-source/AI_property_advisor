# Blocking Audit Checklist

**This audit is a blocking gate, not an advisory checklist.** Run it before producing any report. If any blocking check fails, stop immediately and output only the Audit Failure block below. Do not add warning banners and continue — stop.

## Audit Failure Output Template

If any check fails, output this and nothing else:

```
# Audit Failure -- Report Not Generated

The following blocking checks failed. Correct these before rerunning the analysis.

| Failure | Property | Why it matters | Required fix |
|---------|----------|----------------|-------------|
| [check name] | [property] | [reason] | [action] |

Once these are corrected, rerun the analysis from Stage 1 (canonical_property_facts).
```

---

## Check 1: Canonical Facts Table Present and Complete

- [ ] `canonical_property_facts` table exists for every property in the analysis
- [ ] No field is blank — every field shows a value, "Unknown -- not found in source," or "[ESTIMATED]"
- [ ] `exact_address` is not "unknown" — if address cannot be verified, property goes to Watchlist
- [ ] `current_status` confirms the listing is Active (not Sale Agreed, Withdrawn, or Unknown)
- [ ] `service_charge_status` is Confirmed, Estimated, or Unknown — not blank
- [ ] `tenancy_status` is Vacant, Tenanted, or Unknown — not blank
- [ ] All canonical facts are sourced from: current listing page, agent page, official source, uploaded document, or user-confirmed statement
- [ ] **Prior reports, memory, and previously generated analysis text are NOT valid sources for canonical facts**

**Failure consequence:** Re-fetch the listing. If listing is no longer active, move to Watchlist. Do not proceed.

---

## Check 2: Source Register Complete

- [ ] `source_register` exists and contains an entry for every material factual claim
- [ ] Every rent comp has a Source ID with a URL
- [ ] Every building/OMC/remediation claim has a Source ID
- [ ] Every service charge figure (confirmed or estimated) has a Source ID or is marked [ESTIMATED] with a rationale
- [ ] No material claim in scoring, rent assumptions, OMC conclusions, or negotiation justification is labelled `UNSOURCED`
- [ ] "No reports found" appears only where a search was actually performed and logged

**Failure consequence:** Label unsourced claims `UNSOURCED -- do not use for ranking`. Remove them from scoring and negotiation justification. Rerun with sourced evidence.

---

## Check 3: Micro-Location Resolver Run

- [ ] Micro-location resolver output exists for every property
- [ ] `exact_address` from the listing was used to determine `scoring_location` — not the agent's headline area
- [ ] If listing headline area differs from exact-address area, the report states: "Listed as [X]; scored as [Y] based on exact address"
- [ ] No property is scored as a premium area based solely on agent marketing language
- [ ] Hard regression checks passed:
  - [ ] Corn Mill: not labelled "Clontarf" unless exact address confirms Clontarf
  - [ ] Fitzwilliam Point development: not labelled "Fitzwilliam St Georgian core" — scores as Ringsend D4 unless address contradicts this
  - [ ] No "near [area]" property receives the premium score without explicit address evidence
- [ ] If location confidence is Medium or Low, location score (dim 1) and resale liquidity (dim 14) are penalised accordingly

**Failure consequence:** Rerun the resolver with the correct address. Adjust location score and any rent comps that relied on the wrong area.

---

## Check 4: Rent Comp Search Log Present

- [ ] `rent_comp_search_log` exists for every property
- [ ] At minimum, levels 1--2 (exact building + exact street) were searched before jumping to micro-area comps
- [ ] Each search entry shows a result status: Found verified comp | Found incomplete comp | User-observed (not independently verified) | Searched, not found | Access blocked | Not searched
- [ ] "No Tier A/B comps found" is only stated if levels 1--2 are logged as "Searched, not found" or "Access blocked"
- [ ] If access was blocked: the report says "Access blocked -- comp may exist," not "no comps found"
- [ ] If user reported seeing same-building listings: recorded as "User-observed (not independently verified)" — not as "Found verified comp"

**Failure consequence:** Log the missing searches. If the search was not performed, the conclusion about comp availability is provisional -- state this.

---

## Check 5: Rent Comp Evidence Table Valid

- [ ] Every comp used in the model has a Source ID and URL
- [ ] No URL / no Source ID = comp is labelled "unverified market signal" and excluded from confidence scoring
- [ ] Comp Tier is assigned to every comp (A/B/C/D)
- [ ] Rent confidence level is consistent with available Tier A/B/C/D comps:
  - High: requires >=1 Tier A or B comp with URL
  - Medium: requires >=2 Tier C comps with URLs
  - Low: otherwise
- [ ] If size is unknown: rent confidence is capped at Low-Medium regardless of comp tier
- [ ] If subject size differs materially from comp size: an adjustment is noted
- [ ] Rent comps are from the same micro-area as confirmed by the micro-location resolver — not from the agent's headline area

**Failure consequence:** Downgrade any comp without URL to "unverified market signal." Recalculate rent confidence from the remaining verified comps.

---

## Check 6: Formula Audit

- [ ] **Mortgage = total acquisition cost -- cash deployed**
  - Total acquisition cost = price + stamp duty + legal/setup + refurb + BER upgrade (if applicable)
  - Mortgage is NOT simply (purchase price -- EUR300,000) unless all other costs are zero
- [ ] Monthly mortgage matches formula: M = P x r x (1+r)^n / ((1+r)^n -- 1) where r = rate/12, n = 300
- [ ] Annual cash flow = monthly cash flow x 12
- [ ] Economic ROI reconciles:
  - Annual after-tax CF + Year-1 principal = Economic return
  - Economic return / EUR300,000 = stated Eco ROI %
  - Sanity check: EUR400/mo CF + EUR3,100 principal = EUR7,900 -> 2.6% ROI
- [ ] ROI+2% and ROI+4% use purchase price x appreciation rate (not cash deployed)
- [ ] Stress scenarios #9 and #10 combine ALL factors simultaneously
  - #9: Rent x 0.90 AND costs x 1.25 AND occupancy 10/12 AND rate 7.0%
  - #10: Rent x 0.85 AND costs x 1.25 AND occupancy 9/12 AND rate 8.0%
- [ ] DSCR = vacancy-adjusted rent / annual mortgage repayment
- [ ] Tax scenarios use correct taxable profit base (deducts year-1 interest, SC, insurance, maintenance, accounting -- NOT capital items)

**Failure consequence:** Recalculate and correct all affected rows. Do not report incorrect ROI figures.

---

## Check 7: Input Audit

- [ ] Rent assumptions supported by verified comps with URLs
- [ ] Legal rent separated from market rent (fields: market rent / legally achievable rent / underwriting rent / RTB verification required / legal rent confidence)
- [ ] If previous rent is disclosed and below market: ranking uses rent-capped case (market-rent case is supplementary only)
- [ ] If tenancy status is unknown: both market-rent and rent-restricted cases shown; legal rent confidence is not High
- [ ] **BER rating is NOT a legal rent cap** -- BER D/E suppresses achievable market rent but does not legally limit what can be charged
- [ ] Tenancy status columns present in master table: Tenancy status / RTB Risk / Legal rent confidence
- [ ] Service charges are actual or clearly [ESTIMATED] with conservative estimate
- [ ] SC sensitivity table included for every property with [ESTIMATED] SC
- [ ] BERs confirmed or flagged; BER D or below has upgrade cost in acquisition budget
- [ ] Operating costs are property-specific (not identical bundles)
- [ ] Size is extracted or explicitly noted as "Unknown [NOT DISCLOSED IN LISTING]"; size unknown lowers DQ score
- [ ] If size is unknown: compact-unit downside case is modelled; verdict is capped at Conditional Buy

**Failure consequence:** Correct the specific input. Re-run the financial model with the corrected value.

---

## Check 8: Building Risk Check

- [ ] Historical building risk distinguished from current OMC liability risk (two separate scores)
- [ ] Issue specificity confirmed: "exact building" vs. "same development" vs. "neighbouring block" stated
- [ ] Current status stated: resolved / unresolved / unknown
- [ ] Evidence status stated for every OMC/building claim: Found and verified | Found but incomplete | User-observed (not independently verified) | Searched, not found | Access blocked | Not searched | Unknown
- [ ] "Searched, not found" only used if search was actually performed and logged in source_register
- [ ] "Access blocked" used instead of "not found" when access was attempted but blocked
- [ ] Celtic Tiger / OMC risk buildings: two scenarios modelled (OMC unresolved + OMC cleared)
- [ ] OMC score <= 6 unless documents reviewed
- [ ] Language is correct:
  - "Searched, not found; OMC documents still required" -- OK
  - "Professionally managed per listing/agent" -- OK
  - "No public OMC red flags found; documentation still required" -- OK
  - "Clean OMC" -- NOT OK unless documents have been reviewed

**Failure consequence:** Correct the language. If evidence status is misstated, re-state accurately. Do not imply non-existence from an unsearched source.

---

## Check 9: Tax Scenarios

- [ ] Three tax scenarios shown for every top candidate: 20%, 30%, 40%
- [ ] **30% is the central/headline case for a non-resident landlord** -- all master tables, stress tests, and rankings use 30%
- [ ] 20% is the minimum-withholding floor; 40% is the conservative stress
- [ ] If only one tax rate appears in a headline or ranking, it must be 30%
- [ ] **20% must NOT be used as the central case** -- this is a blocking failure
- [ ] Tax caveat present: "Not tax advice; confirm with Irish tax advisor"
- [ ] Non-resident flags noted: withholding, USC/PRSI, collecting agent, Bulgaria-Ireland treaty

**Failure consequence:** Replace 20% central figures with 30% figures throughout. Recalculate rankings.

---

## Check 10: Ranking Integrity

- [ ] No unconfirmed properties in primary ranking
- [ ] No unconditional BUY where major condition is unresolved
- [ ] Size-unknown property does not outrank a similarly attractive verified property without explicit explanation
- [ ] No premium location score from agent headline area alone -- micro-location resolver output used
- [ ] Top resilience property has resilience label matching stress test results (do not say "robust" for Thin or Weak)
- [ ] Three rankings present: yield / resilience / overall
- [ ] Four price-tier rankings present (see Check 12)
- [ ] Category labels assigned to each top candidate
- [ ] "If X clears, ranking changes to Y" section included for all conditional-risk properties

**Failure consequence:** Correct the ranking. Remove unconfirmed properties. Relabel resilience categories accurately.

---

## Check 11: Data Quality Scores

- [ ] Data Quality Score (1--10) present for every confirmed property
- [ ] DQ score reflects confirmed vs. estimated vs. unknown fields
- [ ] Size unknown: DQ Score capped at 7.0
- [ ] SC estimated: -1.0 deduction applied
- [ ] Tenancy unknown: -1.0 deduction applied
- [ ] Location uncertain (Medium confidence): -0.5 deduction applied
- [ ] Data Quality Summary Table present (Section 22) with columns: Property | Size | SC | BER | Tenancy | Location | Prev Rent | DQ Score | Key Gaps
- [ ] Any DQ Score < 7/10 has a note explaining what is unknown and what must be verified

**Failure consequence:** Recalculate DQ scores. Update the Data Quality Summary Table.

---

## Check 12: Negotiation Terminology Consistency

- [ ] Only the six approved price terms are used throughout the report (see SKILL.md Stage 12):
  - Asking price | Opening offer | Target settlement | Stretch maximum | Walk-away ceiling | Aggressive buyer-case price
- [ ] **Walk-away ceiling is not used to describe a low opening bid** -- a low bid is the "opening offer" or "aggressive buyer-case price"
- [ ] Walk-away ceiling >= stretch maximum >= target settlement >= opening offer
- [ ] Four price-tier ranking tables are present:
  - Table A: Asking Price ranking
  - Table B: Target Settlement ranking
  - Table C: Aggressive Buyer-Case ranking
  - Table D: Walk-Away Ceiling ranking
- [ ] Offer amounts in the negotiation table match amounts in the price-tier ranking tables and the final recommendation exactly
- [ ] All offer numbers are rounded to nearest EUR500 or EUR1,000

**Failure consequence:** Standardise all price references to the six approved terms. Recalculate and align tables. Inconsistent numbers across sections are a blocking failure.

---

## Check 13: Stale Listing Diagnostic

- [ ] Any property listed >60 days has a Stale Listing Diagnostic block

Stale Listing Diagnostic format:

| Factor | Finding |
|--------|---------|
| Days on market | [N days / weeks / months] |
| Price reductions | [None found / Reduced from EUR X on date] |
| Possible explanations | [List: overpriced / tenancy complication / building issue / structural concern / test listing] |
| Key question for agent | ["Why has this not sold? Any surveys or offers?"] |
| Negotiation leverage | Low / Medium / High |
| Model at asking price | [CF and S9 result -- stale listing typically justifies more aggressive opening] |

- [ ] If stale listing evidence improves the negotiation case: stated explicitly
- [ ] >90 days listed: opening offer moves toward aggressive buyer-case; Tier 3 heuristics apply (8--12% below asking)
- [ ] >90 days listed with no price reduction: explicitly flag as "vendor may not be motivated to discount -- investigate reason before offer"

---

## Check 14: Service Charge Sensitivity Tables

- [ ] SC sensitivity table present for every property where SC is [ESTIMATED]
- [ ] Required format:

| SC assumption | Annual SC | Monthly CF (30% tax) | Eco ROI | S9 CF | Impact vs. base |
|--------------|----------|---------------------|---------|-------|----------------|
| Low estimate | EUR X,XXX | | | | Optimistic |
| **Base [ESTIMATED]** | **EUR X,XXX** | | | | **Used in model** |
| High estimate | EUR X,XXX | | | | Conservative |
| Confirmed worst-case | EUR X,XXX | | | | If SC at top of range |

- [ ] If SC at high estimate makes the property Weak or Fragile: flagged explicitly with an SC Risk Flag
- [ ] SC sensitivity is not required for confirmed SC properties

---

## Check 15: Central Conclusions by Objective

- [ ] Section 23 (Central Conclusions by Objective) present in multi-property reports
- [ ] Required format:

| Objective | Best Property | Why | Second Choice |
|-----------|:------------:|-----|:------------:|
| Highest income (30% tax) | | | |
| Best stress resilience | | | |
| Best cash-flow if negotiated | | | |
| Cleanest risk profile | | | |
| Best for a 40% tax investor | | | |
| Best if one conditional risk clears | | | |

- [ ] Conclusions are distinct per objective -- they do not all point to the same property
- [ ] Each "best if negotiated" entry uses the target settlement price from the negotiation table

---

## Evidence Status Reference

Use these statuses consistently throughout every report. Never leave evidence status implicit.

| Status | Meaning | When to use |
|--------|---------|-------------|
| Found and verified | Source found; URL logged; claim directly supported | Confirmed comp, confirmed fact from listing |
| Found but incomplete | Source found but partially applicable | Comp from similar building, not exact |
| User-observed (not independently verified) | User reports seeing this; not confirmed | User mentions a same-building listing |
| Searched, not found | Search performed and logged; no result | Actual search run, returned nothing |
| Access blocked | Attempted but site blocked | Daft/RTB site returned 403 or redirect |
| Not searched | Search not performed | No attempt made; conclusion is provisional |
| Unknown | No search; no user input | Field simply not known |

**Rules:**
- "Not found" is only allowed if the search was actually performed and logged.
- "No public reports found" is only allowed if a public-source search is logged in the source_register.
- If evidence is "Not searched" or "Access blocked": the report must say the conclusion is provisional.
- Do not treat "not found" as proof of non-existence.

---

## Language Standards Reference

| Use | Avoid |
|-----|-------|
| "Searched, not found -- documents still required" | "No defect reports found" as proof of safety |
| "Access blocked -- comp may exist" | "No Tier A/B comps found" without logging the search |
| "Not searched -- conclusion provisional" | Silent omission of evidence status |
| "Listed as [X]; scored as [Y] based on exact address" | Agent headline area used uncritically |
| "BER D suppresses achievable market rent" | "BER limits legal rent" or "BER caps rent" |
| "Conditional Buy -- verify [X]" | "BUY" on unresolved property |
| "30% central case for non-resident" | 20% presented as central case |
| "Size unknown materially limits rent and resale confidence" | Treating size-unknown as fully equivalent to known |
