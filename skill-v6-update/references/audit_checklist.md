# Pre-Output Audit Checklist

Run ALL 14 checks before producing any final report or recommendation. If any check fails, add this banner at the top of the report:

> **Warning: Ranking is provisional because [specific issue]. Do not rely on this ranking until resolved.**

---

## Check 1: Confirmed vs. Unconfirmed Properties

- [ ] Every property in the primary ranking has: active listing URL, confirmed price, confirmed address, confirmed beds/baths, BER stated or labelled unknown, service charge stated or [ESTIMATED]
- [ ] Any property without a confirmed listing URL is in the Watchlist, not the primary ranking
- [ ] Watchlist properties are labelled: "Excluded from primary ranking -- illustrative only"
- [ ] No unconfirmed property appears in: yield ranking, resilience ranking, overall ranking, negotiation priority, or final recommendation
- [ ] If user provided a property without a URL: confirm it was moved to Watchlist or a URL was obtained

**Failure consequence:** Move unconfirmed properties to Watchlist. Re-run rankings without them.

---

## Check 2: Formula Audit

These checks verify mathematical correctness. Run for each property.

- [ ] **Mortgage = total acquisition cost - cash deployed**
  - Total acquisition cost = price + stamp duty + legal/setup + refurb + BER upgrade (if applicable)
  - Mortgage is NOT just (purchase price - EUR300,000) unless acquisition costs were zero

- [ ] **Monthly mortgage matches formula**
  - M = P x r x (1+r)^n / ((1+r)^n - 1) where r = rate/12, n = 300

- [ ] **Annual cash flow = monthly cash flow x 12**

- [ ] **Economic ROI reconciles**
  - Annual after-tax CF + Year-1 principal repayment = Economic return
  - Economic return / EUR300,000 = stated Eco ROI %
  - Sanity: EUR400/mo CF + EUR3,100 principal = EUR7,900 -> 2.6% ROI

- [ ] **ROI+2% and ROI+4% use purchase price x appreciation rate**
  - (Economic return + purchase price x 0.02) / EUR300,000

- [ ] **Stress scenarios #9 and #10 combine ALL factors simultaneously**
  - #9: Rent x 0.90 AND costs x 1.25 AND occupancy 10/12 AND M at 7.0% -- all at once
  - #10: Rent x 0.85 AND costs x 1.25 AND occupancy 9/12 AND M at 8.0% -- all at once

- [ ] **DSCR = vacancy-adjusted rent / annual mortgage repayment**

- [ ] **Tax scenarios use correct taxable profit base**
  - Taxable profit deducts: year-1 mortgage interest, SC, insurance, maintenance, accounting (NOT capital items)

---

## Check 3: Input Audit

- [ ] **Rent assumptions are supported by live comps**
  - Same-building (Tier A/B) comps used where available; stated if only Tier C/D
  - If only Tier C or D comps: confidence reduced to Medium or Low
  - Base rent reflects most likely achievable rent -- not most pessimistic
  - If conservative underwriting is intentional: label "conservative base"

- [ ] **Legal rent is separated from market rent**
  - Each property states: market rent / legally achievable rent / underwriting rent / RTB/RPZ verification required
  - If previous rent is disclosed and below market: ranking uses rent-capped case
  - If tenancy status is unknown: both market-rent and rent-restricted case are shown
  - **BER rating is NOT a legal rent cap** -- BER D/E reduces achievable market rent but does not legally limit what can be charged. Language must reflect this distinction.

- [ ] **Tenancy status columns present in master table**
  - Tenancy status (Vacant / Tenanted / Unknown), RTB Risk (Low/Medium/High), Legal rent confidence (High/Medium/Low)

- [ ] **Service charges are actual or clearly [ESTIMATED]**
  - Do not assume a low service charge without evidence
  - Conservative (higher) estimate if unknown
  - SC sensitivity table included for every property with [ESTIMATED] SC (see Check 14)

- [ ] **BERs confirmed or flagged**
  - BER D or below: upgrade cost estimate included in acquisition budget
  - BER unknown: labelled "Unknown [NOT DISCLOSED]" and flagged in data quality score

- [ ] **Operating costs are property-specific**
  - Not identical bundles across all property types
  - Large/penthouse/private lift units have higher maintenance reserve and insurance
  - BER D/E units have explicit upgrade allowance (separate from annual maintenance)

- [ ] **OMC/building risk assessed -- not just "no reports found"**
  - Building Risk Status block produced for any property with reported or potential issues
  - Dual scores: Historical Building Risk and Current OMC Liability Risk
  - "No reports found in public search" phrased as: "None found; OMC documents still required"

- [ ] **Size is extracted or explicitly noted as Unknown [NOT DISCLOSED IN LISTING]**
  - Size unknown must lower the data quality score; must not be silently omitted

- [ ] **Micro-location label verified for accuracy**
  - Do not rely solely on agent's area description; check actual street/development address
  - If label may be misleading, note discrepancy and apply the less premium interpretation

---

## Check 4: Rent Sensitivity Check

- [ ] **Rent sensitivity tables included for all top-half-ranking properties**
  - Shows: conservative / base / strong rent cases with monthly CF, Eco ROI, combined downside CF, verdict

- [ ] **1-bed rents are plausible for specific Dublin micro-location**
  - D2/D4/GCD 1-bed 50m2+: tested EUR2,200-EUR2,500 range before settling on base
  - BER discount separated from location discount

- [ ] **If rent range materially changes ranking: stated explicitly**

---

## Check 5: Building Risk Check

- [ ] **Historical building risk distinguished from current OMC liability risk**
  - Two separate scores on dimension 8
  - Ranking primarily uses Current OMC Liability Risk

- [ ] **Issue specificity confirmed**
  - "Exact building" vs. "same development" vs. "neighbouring block" stated
  - Timeframe stated (historical year vs. recent/current)
  - Current status stated (resolved / unresolved / unknown)

- [ ] **"No public reports found" not used as proof of safety**
  - Always add: "OMC accounts, AGM minutes, and a structural/fire-safety survey are still required"

- [ ] **Celtic Tiger / OMC risk buildings: two scenarios modelled**
  - OMC unresolved case (current score applied)
  - OMC cleared case (what score and ranking would be if documents confirm issue resolved)

- [ ] **OMC score <= 6 unless documents reviewed**
  - If documents reviewed and clean: 7-10 acceptable
  - If documents not reviewed and Celtic Tiger era: maximum 6

- [ ] **Language is correct:**
  - "No public OMC red flags found; documentation still required" -- OK
  - "Professionally managed per listing/agent" -- OK (not "professional OMC")
  - "Cleanest public-data profile" -- OK (not "clean OMC" without documents)

---

## Check 6: Tax Scenarios

- [ ] **Three tax scenarios shown for every top candidate**: 20%, 30%, 40%
- [ ] **30% is the central/headline case for a non-resident landlord**
  - Master financial tables, stress test tables, and ranking tables must use 30% as the central case
  - 20% is the minimum-withholding floor; 40% is the conservative stress
  - If only one tax rate is shown in a summary figure, it must be 30%
- [ ] **Tax caveat present**: "Not tax advice; confirm with Irish tax advisor"
- [ ] **Non-resident flags noted**: withholding, USC/PRSI, collecting agent, Bulgaria-Ireland treaty

---

## Check 7: Ranking Integrity

- [ ] **No unconfirmed properties in primary ranking**
- [ ] **No unconditional BUY where major condition is unresolved**
  - RTB/RPZ unverified -> must be "Conditional Buy" or weaker
  - OMC undocumented + building risk -> must be "Conditional Buy" or weaker
  - Previous rent below market and reset unverified -> must be "Conditional Buy" or "Avoid"

- [ ] **No premium property over-ranked because of appreciation**
  - CF-negative properties labelled "Capital Appreciation Play"

- [ ] **Top resilience property has resilience label that matches stress results**
  - Do not say "strongest resilience" if combined downside is Thin or Weak
  - Use exact category label: Robust / Good / Thin but positive / Weak / Fragile

- [ ] **Three rankings present and distinct**: yield / resilience / overall
- [ ] **Three price-tier rankings present**: asking / target / stretch

- [ ] **Category labels assigned**: Best Clean Confirmed / Best Yield Candidate / Best Upside if Clears / Best Negotiation Opportunity / etc.

- [ ] **"If X clears, ranking changes to Y" section included** for any property with resolvable conditional risk

---

## Check 8: Source Transparency

- [ ] **Every material claim has source type recorded**
  - Confirmed listing / Confirmed rent comp / Comp Tier stated (A/B/C/D) / Official/news / Agent claim / Forum anecdote / Unknown
  - Date and relevance (exact building vs. general area) noted

- [ ] **"EUR X million remediation" type claims cite specific source and confirm building applicability**
- [ ] **Building/OMC Risk Table has Source Confidence column**

---

## Check 9: Negotiation Realism

- [ ] **Every negotiation recommendation includes**:
  - Opening / target / stretch / walk-away prices
  - All offer amounts rounded to the nearest EUR500 or EUR1,000 (no falsely precise computed amounts like EUR437,750)
  - Probability of acceptance (Low / Medium / High)
  - What must be true to justify offer
  - DD findings that reduce offer
  - DD findings that increase offer

- [ ] **Aggressive offers not presented as certain or easy**
- [ ] **OMC-cleared offer scenario included** for Kirkpatrick/Longboat-type properties
- [ ] **RTB-capped rent used in offer calculation** where RPZ risk is present

---

## Check 10: Final Recommendation Structure

- [ ] **"What I Would Do Next" section uses the required action-plan format**
  - Specific properties named for each action
  - Go/no-go triggers stated for each top candidate
  - Evidence that improves ranking stated
  - Evidence that causes walk-away stated
  - Offer strategy with specific prices

---

## Check 11: Data Quality Scores

- [ ] **Data Quality Score (1-10) present for each confirmed property**
  - Score reflects: confirmed vs. estimated vs. unknown fields
  - Key fields: size, service charge, BER, tenancy status, micro-location accuracy
  - Score is summarised in Section 22 (Data Quality Summary Table)

- [ ] **Data Quality Summary Table present** with columns: Property | Size | SC | BER | Tenancy | Location Verified | Score
  - Any score below 7/10 has a note explaining what is unknown and what must be verified

---

## Check 12: Stale Listing Diagnostic

- [ ] **Any property listed >60 days has a Stale Listing Diagnostic block**

Stale Listing Diagnostic format:

| Factor | Finding |
|--------|---------|
| Days on market | [N days / N weeks / N months] |
| Price reductions | [None found / Reduced from EUR X on [date]] |
| Possible explanations | [List: overpriced / tenancy complication / building issue / structural concern / test listing] |
| Key question for agent | [e.g., "Why has this not sold? Any building surveys or offers?"] |
| Negotiation leverage | [Low / Medium / High] |
| Model at asking price | [CF and S9 result] -- stale listing typically justifies more aggressive opening |

- [ ] **If stale listing evidence improves negotiation case: stated explicitly**
  - >90 days listed: opening offer moves toward Tier 3 heuristics in negotiation module

---

## Check 13: Central Conclusions by Objective

- [ ] **Section 23 (Central Conclusions by Objective) present** in multi-property reports

Required format:

| Objective | Best Property | Why | Second Choice |
|-----------|--------------|-----|--------------|
| Highest income (30% tax) | [Name] | Monthly CF [EUR X] at asking | [Name] |
| Best stress resilience | [Name] | S9 [EUR X]/mo; category [Good/etc.] | [Name] |
| Best cash-flow if negotiated | [Name] | CF [EUR X] at target [EUR X] | [Name] |
| Cleanest risk profile | [Name] | [BER, SC confirmed, legal rent high confidence] | [Name] |
| Best for a 40% tax investor | [Name] | Monthly CF [EUR X] at 40% | [Name] |
| Best if one conditional risk clears | [Name] | [What clears and how it changes the ranking] | [Name] |

- [ ] **Conclusions are distinct per objective** -- they may not all point to the same property

---

## Check 14: Service Charge Sensitivity Tables

- [ ] **SC sensitivity table present for every property where SC is [ESTIMATED]**

Required format for each property with estimated SC:

| SC assumption | Annual SC | Monthly CF (30% tax) | Eco ROI | S9 CF | Impact vs. base |
|--------------|----------|---------------------|---------|-------|----------------|
| Low estimate | EUR X,XXX | | | | Optimistic |
| **Base [ESTIMATED]** | **EUR X,XXX** | | | | **Used in model** |
| High estimate | EUR X,XXX | | | | Conservative |
| Confirmed worst-case | EUR X,XXX | | | | If SC confirmed at top of range |

- [ ] **If SC at high estimate makes the property a Weak or Fragile stress case: flag this explicitly**
- [ ] **SC sensitivity does not need to be run for confirmed SC properties**

---

## Building/OMC Mandatory Disclosure Table

For every property, include in the Building/OMC Risk Table:

| Item | Status |
|------|--------|
| OMC accounts reviewed | Yes / No -- must obtain |
| Sinking fund reviewed | Yes / No -- must obtain |
| AGM minutes reviewed | Yes / No -- must obtain |
| Special levy history | Unknown / None found / Problematic |
| Fire-safety/remediation risk | Low / Medium / High / Unknown |
| Water-ingress/structural risk | Low / Medium / High / Unknown |
| Mortgageability concern | Low / Medium / High / Unknown |
| Defect reports found | None found in public search (documents still required) / Specific reports found [cite] |
| Source confidence | Confirmed listing / Official/news / Agent claim / Forum anecdote / Unknown |

**Rule:** "None found in public search" must always be followed by "OMC accounts, AGM minutes, and structural survey still required before proceeding."

---

## Language Standards

| Use | Avoid |
|-----|-------|
| "On current assumptions..." | Stating figures as certain fact |
| "Subject to RTB confirmation..." | "BUY" where rent legality unresolved |
| "No specific reports found in public search; OMC documents still required" | "No defect reports found" as proof of safety |
| "Professionally managed per listing/agent" | "Professional OMC" (implies verified) |
| "No public OMC red flags found; documentation still required" | "Clean OMC" (unless documents reviewed) |
| "Cleanest public-data profile among confirmed options" | "Clears all resilience criteria" |
| "Thin but positive stress resilience" | "Strongest resilience" for barely-positive combined downside |
| "This is a yield candidate, not the most resilient asset." | Ranking by yield alone |
| "This is a resilience candidate, not the highest ROI." | Ranking by resilience alone |
| "Conditional Buy -- verify [specific condition]" | Unconditional "BUY" on unresolved property |
| "Capital appreciation play, not a yield investment." | High ROI for CF-negative property |
| "Three tax scenarios: 20% / 30% / 40%; 30% central" | Single tax figure presented as definitive |
| "BER D suppresses achievable market rent" | "BER limits legal rent" or "BER caps what can be charged" |
| "Illustrative only -- excluded from primary ranking" | Unconfirmed property in primary ranking |
