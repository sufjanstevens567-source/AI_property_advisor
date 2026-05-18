# Qualitative Scoring Rubric

Score each property 1-10 on each dimension. Use the anchors below for consistency.

**For resilience-focused analysis** (default for this user): double-weight dimensions 2, 3, 6, 8, 9, 14. See resilience overlay at the end.

---

## 1. Location Quality

| Score | Meaning |
|-------|---------|
| 9-10 | D2/D4 premium: Ballsbridge, Merrion, St Stephen's Green, top Grand Canal Dock, Fitzwilliam |
| 7-8 | Good D2/D4/D6, Smithfield premium, strong southside, Ringsend improving, IFSC prime |
| 5-6 | Decent but not premium: established northside pockets, IFSC fringe, solid suburbs |
| 3-4 | Mixed or transitional areas, some negative perception, limited amenity |
| 1-2 | Known problem areas, isolated, very weak amenity, or stigmatised |

**Location label accuracy:** Do not rely solely on the agent's area headline. Verify the actual street address and development location. If the development is on the edge of a more prestigious area, use the more conservative scoring. Example: a property listed as "Fitzwilliam" but located on a side street near Ringsend should score for its actual micro-location, not the aspirational label.

## 2. Safety / Tenant Perception (HIGH WEIGHT)

| Score | Meaning |
|-------|---------|
| 9-10 | Perceived very safe; professionals and families comfortable walking at night |
| 7-8 | Generally safe; occasional minor incidents but strong overall perception |
| 5-6 | Mixed perception; some tenants hesitate, others fine |
| 3-4 | Noticeable safety concerns in forums/Reddit; some active avoidance |
| 1-2 | Widely perceived unsafe; significant tenant reluctance; narrows pool severely |

## 3. Recession Resilience (HIGH WEIGHT)

| Score | Meaning |
|-------|---------|
| 9-10 | Demand holds even in downturns; large diversified employer base; essential-worker proximity |
| 7-8 | Demand likely dips moderately but recovers quickly; diverse tenant pool |
| 5-6 | Would see noticeable vacancy/rent pressure in a downturn |
| 3-4 | Highly cyclical; dependent on narrow employment sector or transient demand |
| 1-2 | First to suffer vacancy; last to recover; very narrow demand base |

## 4. Tenant Demand

| Score | Meaning |
|-------|---------|
| 9-10 | Would let within days; massive demand pool; waiting lists common |
| 7-8 | Strong demand; lets within 1-2 weeks at market rent |
| 5-6 | Adequate demand; may take 2-4 weeks; some competition from similar stock |
| 3-4 | Softer demand; may need rent concession or longer vacancy |
| 1-2 | Difficult to let; very narrow or weak tenant pool |

## 5. Likelihood of Achieving Base Rent

| Score | Meaning |
|-------|---------|
| 9-10 | Multiple same-building live comps confirm base rent; very high confidence |
| 7-8 | Strong area comps; minor uncertainty but base rent is realistic |
| 5-6 | Reasonable estimate but limited direct evidence; could be +/-5-10% |
| 3-4 | Thin evidence; significant uncertainty; rent may be optimistic |
| 1-2 | No reliable comps; rent assumption is largely speculative |

## 6. Rent-Control / Legal Rent Confidence (HIGH WEIGHT)

| Score | Meaning |
|-------|---------|
| 9-10 | Vacant possession, no RPZ constraint, clear legal basis for market rent |
| 7-8 | RPZ applies but previous rent is close to market; modest reset risk |
| 5-6 | Some uncertainty about previous rent or RPZ compliance; needs verification |
| 3-4 | Previous rent materially below market; RPZ cap likely limits achievable rent |
| 1-2 | Clear legal barrier to charging market rent; or major unresolved RPZ dispute |

If previous rent is materially below market: **score must be 3 or below** until legal reset is verified.

**Note on BER and rent:** BER D/E does NOT legally cap rent. It reduces what the market will pay because tenants factor energy costs into rental decisions. Dimension 6 scores legal rent certainty only. The practical impact of BER on achievable market rent is captured in Dimension 9 (BER/Energy Efficiency Risk) and Dimension 5 (likelihood of achieving base rent).

## 7. Building Quality

| Score | Meaning |
|-------|---------|
| 9-10 | Modern, well-maintained, no known defects, strong construction quality |
| 7-8 | Good condition; minor cosmetic issues; well-managed building |
| 5-6 | Adequate but aging; some maintenance backlog; no structural concerns |
| 3-4 | Visible issues; reports of defects or remediation needed; Celtic Tiger concerns present |
| 1-2 | Known serious defects: fire safety, water ingress, structural issues, remediation ongoing |

## 8. OMC / Service-Charge / Remediation Risk (HIGH WEIGHT)

This dimension scores **Current OMC Liability Risk** -- not historical risk.

| Score | Meaning |
|-------|---------|
| 9-10 | Professional OMC confirmed by documents; transparent accounts; stable charges; no special levies expected |
| 7-8 | Functional OMC; charges reasonable; no levy evidence; documents not yet reviewed |
| 5-6 | OMC somewhat opaque; charges rising; possible future levy for maintenance; Celtic Tiger era but no confirmed issue |
| 3-4 | Current unresolved issue suspected or partially evidenced; special levy possible or pending |
| 1-2 | Known current unresolved levy; dysfunctional OMC; legal disputes; proven mortgageability concern |

**Critical scoring rules:**
- Do not score below 5 solely because of historical issues unless current status is confirmed unresolved
- Score maximum 6 if Celtic Tiger era and OMC documents have NOT been reviewed
- Score maximum 4 if there is evidence of a current outstanding levy or insurance gap
- Score 9-10 only if OMC accounts, AGM minutes, sinking fund, levy history, and insurance have been reviewed and are clean

### Building Risk Status Block Format

For every property with any building/OMC risk, output this block:

```
### Building Risk Status: [Property Name]

**Historical Building Risk:** [1-10] -- [brief justification]
**Current OMC Liability Risk:** [1-10] -- [brief justification]

| Factor | Details |
|--------|---------|
| Issue type | fire safety / water ingress / windows / cladding / structural / insurance / sinking fund / special levy |
| Development affected | exact building / wider estate / neighbouring block / unclear |
| Timeframe | [year if known] / historical / recent / current |
| Current status | resolved / unresolved / unknown |
| Evidence strength | official/news/source / forum/anecdotal / unclear |
| Likely investor impact | no current impact / diligence only / price discount required / avoid unless resolved / avoid |
| Documents required | OMC accounts / AGM minutes / sinking fund review / fire-safety certificate / remediation completion cert / special levy history / solicitor confirmation / lender confirmation |

**Source:** [source type + date + relevance to exact building]
**Confidence:** [Confirmed listing / Official/news source / Forum anecdote / Unknown]
```

## 9. BER / Energy Efficiency Risk (HIGH WEIGHT)

| Score | Meaning |
|-------|---------|
| 9-10 | BER A1-A3: no upgrade needed; fully future-proof |
| 7-8 | BER B1-B3: good standard; minor improvement possible but not urgent |
| 5-6 | BER C1-C3: acceptable now but may need upgrade within 5-10 years |
| 3-4 | BER D: material risk; needs significant investment (EUR8,000-EUR15,000); regulatory exposure |
| 1-2 | BER E-G: major problem; expensive to remediate (EUR15,000-EUR25,000+); high regulatory risk |

**BER D:** Include estimated upgrade budget in acquisition cost. Penalise unless price is discounted.
**BER E or worse:** Requires costed retrofit plan. Do not rank highly unless price is materially reduced.

## 10. Service-Charge Reasonableness

| Score | Meaning |
|-------|---------|
| 9-10 | < EUR1,200/yr for standard apartment; well justified |
| 7-8 | EUR1,200-EUR2,000/yr; reasonable for location and amenities |
| 5-6 | EUR2,000-EUR2,800/yr; high side but explainable (lift, concierge, gym) |
| 3-4 | EUR2,800-EUR3,500/yr; expensive; materially hurting yield |
| 1-2 | > EUR3,500/yr or rapidly escalating; potentially unsustainable |

If service charge is unknown, estimate conservatively and flag. Do not assume low.

## 11. Maintenance / Capex Risk

| Score | Meaning |
|-------|---------|
| 9-10 | Newly built/refurbished; minimal capex for 10+ years |
| 7-8 | Good condition; one or two items may need attention within 5 years |
| 5-6 | Kitchen or bathroom aging; carpet/floors need refresh; EUR5-10k within 5 years |
| 3-4 | Significant refurb needed soon; EUR10-20k exposure |
| 1-2 | Major works required immediately or imminently; EUR20k+ |

## 12. Layout and Size Quality

| Score | Meaning |
|-------|---------|
| 9-10 | Generous size for bed count; good layout; functional rooms; storage |
| 7-8 | Good size; functional layout; meets strong tenant expectations |
| 5-6 | Adequate but compact; open-plan may limit appeal; minimal storage |
| 3-4 | Small for bed count; awkward layout; compromised living |
| 1-2 | Very small; poor layout; difficult to furnish |

**1-bed vs 2-bed scoring guidance:**
- 1-bed strengths: lower price, smaller mortgage, often better DSCR, easier entry
- 1-bed weaknesses: narrower tenant pool, more turnover risk, lower rent ceiling, less resale flexibility
- 2-bed strengths: broader tenant pool (sharers/couples/WFH), stronger resale liquidity, better downturn resilience
- 2-bed weaknesses: higher price, larger mortgage, sometimes weaker yield
- Do not penalise a 1-bed solely because it is a 1-bed -- penalise small size, weak BER, narrow tenant pool in a weak location

## 13. Parking Value

| Score | Meaning |
|-------|---------|
| 9-10 | Dedicated secure underground; adds EUR50-100/mo rental premium |
| 7-8 | Dedicated space; secure; clearly valuable in context |
| 5-6 | Shared or surface; some value but limited premium |
| 3-4 | No parking but on-street available; minor penalty |
| 1-2 | No parking in area where it matters; tenant deterrent |

In city-centre locations with excellent transport, no parking is less penalised (5-6 rather than 3-4).

## 14. Resale Liquidity (HIGH WEIGHT)

| Score | Meaning |
|-------|---------|
| 9-10 | Highly liquid; strong owner-occupier and investor demand; sells quickly at fair value |
| 7-8 | Good liquidity; reasonable time to sell |
| 5-6 | Adequate; may take time; investor-only pool |
| 3-4 | Narrow buyer pool; may need price concession |
| 1-2 | Very illiquid; building issues or stigma make resale difficult |

## 15. Operational Hassle

| Score | Meaning |
|-------|---------|
| 9-10 | Set-and-forget; strong tenant pool, low maintenance, simple management |
| 7-8 | Low hassle; occasional attention needed |
| 5-6 | Moderate management load; some maintenance calls |
| 3-4 | Higher hassle; building issues, OMC disputes, or challenging tenancy management |
| 1-2 | High hassle; ongoing problems likely; intensive management required |

## 16. Overall Risk-Adjusted Attractiveness

This is NOT a simple average. Weight scores according to the user's objective (resilience-focused).

| Score | Meaning |
|-------|---------|
| 9-10 | Exceptional risk-adjusted opportunity; recommend confidently |
| 7-8 | Good investment; manageable risks; clear path to solid returns |
| 5-6 | Acceptable but with meaningful risks or modest returns |
| 3-4 | Marginal; risks may outweigh returns unless conditions improve |
| 1-2 | Poor risk-adjusted proposition; avoid unless price drops significantly |

---

## Data Quality Score (New: v6)

This score reflects the reliability of the underlying data for a given property. Low data quality means the financial model is based more on assumptions and estimates than confirmed facts.

| Score | Meaning |
|-------|---------|
| 9-10 | All key fields confirmed: size, BER, SC, tenancy status, micro-location, price |
| 7-8 | 1-2 minor fields estimated (e.g., SC estimated but plausible); no structural unknowns |
| 5-6 | 2-3 significant fields estimated or unknown (e.g., SC estimated AND size unknown) |
| 3-4 | Multiple key fields unknown or unverifiable; model relies heavily on assumptions |
| 1-2 | Most fields estimated or unknown; model is largely speculative |

### Key Fields and their Data Quality Impact

| Field | If confirmed | If estimated | If unknown/missing |
|-------|-------------|-------------|-------------------|
| Size (m2) | No penalty | -0.5 | -1.5 |
| Service charge | No penalty | -1.0 | -1.5 |
| BER rating | No penalty | -0.5 | -1.0 |
| Tenancy status | No penalty | -0.5 | -1.0 |
| Micro-location accuracy | No penalty | -0.5 | -1.5 |
| Previous rent (if relevant) | No penalty | -0.5 | -1.0 |

Start from 10 and apply deductions. Round to nearest 0.5.

### Data Quality Summary Table Format

Include as Section 22 of the output:

| Property | Size | SC | BER | Tenancy | Location | Prev Rent | DQ Score | Key Gaps |
|----------|:----:|:--:|:---:|:-------:|:--------:|:---------:|:--------:|---------|
| [Name] | Confirmed | ESTIMATED | Confirmed | Unknown | Verified | N/A | 7/10 | SC and tenancy status unconfirmed |

Properties with DQ Score < 7/10 must have a note explaining what to verify and how that uncertainty affects the financial model.

---

## Resilience Overlay

Apply this overlay for all analyses (default for this user):

**Double-weight these dimensions:**
- Dimension 2 -- Safety/Tenant Perception
- Dimension 3 -- Recession Resilience
- Dimension 6 -- Rent-Control Confidence
- Dimension 8 -- OMC/Remediation Risk (Current)
- Dimension 9 -- BER
- Dimension 14 -- Resale Liquidity

**Reduce reliance on:**
- Raw spreadsheet yield (especially if driven by low price in weak area)
- Assumed appreciation
- Optimistic or unverified rent assumptions
- "No rent cap" claims not RTB-verified
- Low service charge (may reflect building under-investment)
- Cheap price alone (without understanding why it is cheap)

**Resilience penalty triggers** (reduce Dimension 16 by 1-2 points each):
- Combined downside (scenario #9) is negative
- Safety/tenant perception score below 6
- Legal rent confidence score below 6
- Current OMC liability risk score below 6
- BER D or below without funded upgrade plan
- Rank relies primarily on appreciation rather than cash flow

---

## Stress Resilience Categories

Apply one label per property and include it in the main ranking:

| Category | Definition |
|----------|-----------|
| **Robust** | Combined downside (#9) > +EUR300/mo AND severe downside (#10) >= EUR0 |
| **Good** | Combined downside +EUR100 to +EUR300/mo |
| **Thin but positive** | Combined downside EUR0 to +EUR100/mo |
| **Weak** | Combined downside negative; base case positive |
| **Fragile** | Base case weak or multiple stress scenarios negative |

**Do not say "strong resilience" for Thin or Weak categories.** Use precise labels.
A clean property with Thin stress resilience is not automatically more resilient than a messier property with Good or Robust stress resilience. Explain the trade-off.

---

## OMC Cleared / Unresolved Scenario Scoring

For properties penalised for unresolved OMC/building risk, model two scenarios:

| Property | OMC status | Historical risk | Current liability risk | Overall score | Ranking |
|----------|-----------|----------------|----------------------|--------------|---------|
| [Name] | Unresolved | [1-10] | [1-10] | [1-10] | #X |
| [Name] | Cleared (if docs confirm) | [1-10] | [revised 1-10] | [revised 1-10] | #Y |

Show how the ranking changes if documentation confirms the issue is resolved.

---

## Investment Category Labels

Assign one primary label to each property:

| Label | Criteria |
|-------|---------|
| **Best Clean Confirmed Asset** | Confirmed listing, cleanest public-data profile, BER B or better, no current OMC red flags, reasonable CF |
| **Best Yield Candidate** | Highest Eco ROI; may have unresolved conditions (label them) |
| **Best Upside if Diligence Clears** | High yield but currently penalised for specific resolvable risk |
| **Best Negotiation Opportunity** | Improves most in ranking when bought at target vs. asking price |
| **Best Low-Hassle Asset** | Strong tenant pool, low maintenance, premium management, small size advantage |
| **Capital Appreciation Play** | CF marginal or negative at base; thesis depends on price growth |
| **Conditional -- needs [X] before ranking** | Material unresolved condition prevents confident ranking |
| **Avoid / Exclude** | Structural flaw, unresolvable issue, or BER too weak; or unconfirmed listing |

---

## Source Confidence Classification

For every material external factual claim, record source type:

| Source type | Examples |
|------------|---------|
| Confirmed listing | Daft, MyHome, agent website -- property-specific |
| Confirmed rent comp | Same-building or strong micro-area comp -- dated |
| Same-building rent comp (Tier A) | Exact development / block |
| Development comp (Tier B) | Same complex, adjacent block |
| Area comp (Tier C/D) | Micro-area or broader area |
| Official/news source | Irish Times, EchoLive, RTB report, planning records |
| Agent claim | Agent-stated SC, condition, OMC description -- unverified |
| Forum anecdote | Boards.ie, Reddit post |
| Unknown | No clear source found |

Include a "Source confidence" column in the Building/OMC Risk Table.
