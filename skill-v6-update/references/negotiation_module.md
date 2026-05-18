# Negotiation Strategy Module

## When to Use This Module

Load whenever the user asks:
- "What should I offer?" / "What's a fair offer?"
- "Can I haggle?" / "Is there room to negotiate?"
- "How would a lower price affect my ROI?"
- "What is my walk-away price?"
- Also trigger automatically when producing a single-property analysis where the user has shown purchase intent

---

## Core Philosophy

**Anchor to the financial model, not to the asking price.**

Your offer must be grounded in:
1. What rent the property can actually and legally achieve (RPZ-verified comps)
2. What yield and cash flow that rent delivers at different price points (corrected Economic ROI formula)
3. What the mortgage burden looks like under combined downside stress
4. What risks remain unresolved (BER, SC, OMC, RPZ, building condition, legal rent)
5. What comparable sales suggest the market actually clears at

**Critical:** Use the corrected Economic ROI formula from `financial_model_formulas.md`.
Economic ROI = (Annual after-tax CF + Year-1 principal) / EUR300,000.
Never use an inflated figure to justify an offer. If the corrected ROI is 2.5%, the negotiation starts from that reality.

Negotiation is risk management. Every EUR10k off the price reduces mortgage burden, improves yield, and provides a margin of safety against downside scenarios. The goal is to pay the price where the financial model genuinely works -- not where the seller wants to transact.

**Realism:** Not every opening offer will be accepted. Not every vendor will negotiate. If the property is well-priced and competitive, the room to discount is small. State the probability of acceptance honestly -- do not present aggressive offers as likely to succeed unless evidence (time on market, price history, known defects) supports it.

---

## Offer Rounding Rule

**All offer amounts must be rounded to the nearest EUR500 or EUR1,000.**

Never present a computed amount like EUR437,750 or EUR412,600 as an offer. These look machine-generated, not like real bids, and can undermine credibility with agents. Round sensibly:

| Computed amount | Correct rounded offer |
|----------------|----------------------|
| EUR437,750 | EUR438,000 |
| EUR441,450 | EUR441,500 or EUR441,000 |
| EUR412,600 | EUR412,500 or EUR413,000 |
| EUR375,250 | EUR375,000 or EUR375,500 |
| EUR423,200 | EUR423,000 or EUR423,500 |

The rounding direction should favour the buyer (round down for opening offers, round to nearest EUR500 for targets/stretch).

---

## Output Format: Eight Sections (A-H)

### Section A: Asking Price Analysis

| Metric | At Asking Price | Notes |
|--------|----------------|-------|
| Gross yield (purchase price) | X.X% | |
| Monthly after-tax CF (30% tax) | EUR X,XXX | positive / marginal / negative |
| Monthly after-tax CF (40% tax) | EUR X,XXX | |
| Year-1 principal repayment | EUR X,XXX | from amortisation |
| Economic return (CF + principal) | EUR X,XXX | |
| Economic ROI before appreciation | X.X% | = economic return / EUR300k |
| DSCR | X.XX | target >1.10 |
| Break-even rent | EUR X,XXX/mo | vs. underwriting rent EUR X,XXX |
| Combined downside CF (scenario #9) | EUR X,XXX | |
| Stress resilience category | [Robust/Good/Thin/Weak/Fragile] | |
| Verdict at asking price | Priced fairly / Overpriced / Underpriced | |

2-3 sentences: is the asking price reasonable? Does it survive combined stress? Does it only work with appreciation?

---

### Section B: Price Sensitivity Table

| Price | vs. Asking | Mortgage | Monthly Payment | Monthly CF | Eco ROI | ROI +2% | Stress CF (#9) | Verdict |
|-------|-----------|----------|-----------------|-----------|---------|---------|---------------|---------|
| Asking | -- | | | | | | | |
| -2.5% | | | | | | | | |
| -5.0% | | | | | | | | |
| -7.5% | | | | | | | | |
| -10.0% | | | | | | | | |
| Custom | | | | | | | | |

**Formulas:**
- Mortgage = (Price x 1.01) + EUR3,500 legal + EUR5,000 setup + refurb - EUR300,000 (or actual costs)
- Monthly CF = corrected formula; 30% tax central case
- Eco ROI = (Annual CF + Year-1 principal) / EUR300,000
- Stress CF = Combined downside scenario #9

**Bold** the row where base-case CF first turns positive, or where combined downside CF turns positive.

Offer ranges must be tied to specific rows, not generic discount percentages.

---

### Section C: Offer Recommendation (with Probability of Acceptance)

| Level | Amount | vs. Asking | Financial basis | Probability of acceptance |
|-------|--------|-----------|-----------------|--------------------------|
| **Opening offer** | EUR X,XXX,XXX | -X% | [specific model threshold] | Low / Medium / High |
| **Target price** | EUR X,XXX,XXX | -X% | [where CF is >= EUR0 at base] | Low / Medium / High |
| **Stretch** | EUR X,XXX,XXX | -X% | [max where Eco ROI is acceptable] | Low / Medium / High |
| **Walk-away** | EUR X,XXX,XXX | -X% | [combined stress negative above this] | n/a -- do not exceed |

**All amounts must be rounded to the nearest EUR500 or EUR1,000 before presenting.**

**Probability of acceptance guidance:**
- **Low**: offer is >7% below asking; property is well-priced; no known defects; market is competitive
- **Medium**: offer is 3-7% below asking; property has documented issues; has been listed >60 days; or price reduction already made
- **High**: offer is <=3% below asking; or vendor is motivated; or significant defects justify discount

**What must be true to justify the offer:**
List specific conditions that must hold for this offer to make sense:
- "Rent comps confirm EUR X,XXX achievable in same building"
- "OMC documents confirm no outstanding levies"
- "RTB confirms no RPZ cap applies"
- "BER upgrade cost confirmed at <=EUR X,XXX"

**DD findings that reduce the offer further:**
- "If OMC reveals a special levy >EUR10,000 outstanding"
- "If rent comps show achievable rent is EUR200/mo below base assumption"
- "If building survey identifies fire-safety works required"
- "If RTB confirms previous rent was EUR1,800 in RPZ -- capped rent case applies"

**DD findings that increase the offer (justify moving toward stretch):**
- "If OMC accounts are clean and sinking fund well-funded"
- "If same-building rent comp confirms EUR X,XXX achievable"
- "If fire-safety certificate and remediation completion certificate are provided"
- "If vacant possession confirmed and RTB shows no previous tenancy issues"

---

### Section D: Negotiation Rationale

3-5 paragraphs covering:
1. Why the asking price is [above/at/below] fair value -- cite corrected yield, CF, and stress results
2. Specific documented risks justifying a discount -- BER upgrade estimate, SC level vs. comparables, OMC unknown, RPZ risk, building age
3. Comparable sales and rental evidence
4. Seller's likely position -- motivated vs. not, time listed, tenanted vs. vacant
5. Why the target price is the right anchor

---

### Section E: Due-Diligence Levers

Only include items that are real and evidenced.

| Risk / Finding | Estimated Cost / Impact | Negotiation Argument |
|---------------|------------------------|---------------------|
| BER D -- heat pump + insulation | EUR8,000-EUR15,000 | Request price reduction equal to upgrade cost |
| BER E -- major retrofit required | EUR15,000-EUR25,000 | Hard leverage; substantial discount or walk |
| SC EUR3,200/yr (above area average ~EUR2,000) | +EUR1,200/yr drag; capitalised at 6% = EUR20,000 | Price reduction equal to SC premium capitalised |
| No parking where parking commands premium | -EUR100-EUR150/mo vs. comparable | EUR15,000-EUR20,000 price impact |
| RPZ / previous rent below market | Rent may be EUR300-EUR500/mo below market | Price based on capped rent; risk priced in |
| Celtic Tiger era; OMC docs not reviewed | Levy risk: EUR10,000-EUR50,000 | Price reduction or retention against levy contingency |
| Listed >90 days / price already reduced | Seller motivation rising | Patience is a negotiating asset |
| Refurbishment required before letting | EUR5,000-EUR20,000 | Include in acquisition cost; argue price reduction |

---

### Section F: Agent Script

> "Hi [Agent Name], I'm a serious buyer and I've done a thorough financial analysis of [Property Address].
> I'm genuinely interested in proceeding, but I need the price to reflect my investment model.
>
> My analysis shows:
> - Market rent is approximately EUR[X,XXX]/month [cite same-building or micro-area evidence]
> - At the asking price, my corrected net cash flow is approximately EUR[X,XXX]/month -- [positive/marginal/negative]
> - [Specific documented risk 1: e.g., 'The BER D rating will require a heat pump and insulation upgrade I've costed at EUR8,000-EUR12,000']
> - [Specific documented risk 2: e.g., 'The service charge of EUR3,200/yr is above comparable buildings in this area by approximately EUR1,200/yr']
> - [Specific documented risk 3: e.g., 'I've not yet been able to review OMC accounts, which is a risk I need to price in at this stage']
>
> Based on these factors, I'm prepared to make a clean offer of EUR[Opening Offer].
> I'm a cash-plus-mortgage buyer, pre-approved, and I can move quickly to signing.
> I'm happy to discuss. I want to be transparent about where I'm anchored and why."

The script is most effective when the buyer sounds informed and grounded in the numbers -- not aggressive. Never fabricate concerns.

---

### Section G: Escalation Plan

| Round | If seller responds... | Suggested move |
|-------|----------------------|---------------|
| 1 | Rejects, no counter | Restate rationale calmly. Ask: "What price would make this work for the vendor?" Then wait. |
| 2 | Counters above stretch | Hold at target. Offer to split the difference between target and stretch if needed. |
| 3 | Counters at or near stretch | Accept if all conditions confirmed (BER, SC, OMC, RTB/RPZ). |
| 4 | Counters above walk-away | Politely decline. Redirect to next-best alternative. |
| 5 | Accepts opening offer | Do not revise upward. Proceed quickly; secure with booking deposit. |

**Principles:**
- Never revise a bid upward without something in return (new information, changed conditions, real deadline)
- Use silence strategically -- countering immediately signals desperation
- Non-price concessions (faster closing, waiving conditions already verified) can break a deadlock
- Walk-away is a real line -- if reached, genuinely walk

---

### Section H: Deal Classification by Price

| Price Point | Classification | Investment Thesis |
|-------------|---------------|-------------------|
| Above asking | Not recommended | Yield deteriorates. Only viable with strong appreciation conviction and verified rent/OMC. |
| Asking price | [from model] | [e.g., CF marginal. Monthly CF -EUR X,XXX. Works only if rent confirmed and OMC clean.] |
| Target price | [from model] | [e.g., CF neutral to positive. Eco ROI X.X%. Acceptable under base case.] |
| Stretch price | [from model] | [e.g., CF marginal but Eco ROI X.X% acceptable. Tight -- no further downside capacity.] |
| Walk-away | Avoid above this | Eco ROI below minimum; combined stress CF materially negative. |

---

## Stale Listing Diagnostic

For any property listed >60 days on market, include this diagnostic block **before** the offer recommendation.

### Why Stale Listings Require Separate Analysis

A property listed >60 days in the Dublin market (which typically moves in 2-8 weeks for well-priced stock) signals one of:
1. **Overpriced** -- vendor holding to an unrealistic figure
2. **Tenancy complication** -- sitting tenant, RPZ constraint, or unknown rent cap
3. **Building issue** -- OMC problem, levy, fire safety, or structural concern discovered in surveys
4. **Condition issue** -- refurbishment required; photos don't reflect reality
5. **Test listing** -- not serious about selling at current price
6. **Market timing** -- listed in slow season; may be genuinely priced correctly

The risk profile is different from a fresh listing. The negotiating leverage is higher. But the reason for staleness must be established -- a property with a building defect is not just a negotiating opportunity.

### Stale Listing Diagnostic Format

| Factor | Finding |
|--------|---------|
| Days on market | [N days / N weeks / N months] |
| Listed since | [Date] |
| Price reductions | [None found / Reduced from EUR X on [date]] |
| Most likely explanation(s) | [overpriced / tenancy complication / building issue / condition / test listing / seasonal] |
| Evidence for staleness cause | [What the listing, Reddit, news, or OMC search suggests] |
| Key question for agent | ["Why has this not sold? Have there been offers? Any building surveys done?"] |
| Risk if explanation is building issue | [What to look for in OMC pack; what walk-away trigger is] |
| Negotiation leverage | Low / Medium / High |
| Model at asking price | CF [EUR X]/mo; S9 [EUR X]/mo |
| Impact on opening offer | [Moves toward Tier 2 or Tier 3 heuristics; justify X% below asking] |

**>90 days listed:** Move opening offer to Tier 3 heuristics (8-12% below asking) as the default starting point, unless the listing explanation is clearly non-structural (e.g., confirmed seasonal, confirmed price-reduced and now fair).

---

## OMC Cleared / Unresolved Offer Scenarios

For properties with unresolved OMC or building risk, model two offers:

| Scenario | Offer | Justification |
|----------|-------|--------------|
| OMC unresolved | EUR[lower offer] | OMC risk unpriced; levy contingency or retention required |
| OMC cleared | EUR[higher offer] | If documents confirm no levy and sinking fund funded, risk reduced; offer can improve |

**Logic:**
- If OMC file is clean: revise offer upward toward stretch
- If OMC reveals outstanding levy or insurance gap: reduce offer or walk away
- If multiple bidders / high demand: lowball strategy may fail -- state this explicitly
- If property is stale (>90 days listed), has had a price reduction, or has documented defects: more aggressive opening is justified

---

## Offer Heuristics by Property Quality Tier

Starting-point ranges to be calibrated against sensitivity table. **Always override with model-derived prices where they differ. Always round to nearest EUR500 or EUR1,000.**

### Tier 1 -- Strong / Clean (Qualitative 7+, BER A/B, clean public OMC profile, premium location, verified rent)
- Opening offer: 3-5% below asking (unless model shows CF already strong: 1-3%)
- Target: 2-4% below asking
- Stretch: 0-2% below asking
- Walk-away: at or very near asking if model works well
- Probability of acceptance at opening: Low; at target: Medium-High

### Tier 2 -- Decent but Not Outstanding (Qualitative 5-7, some concerns but manageable)
- Opening offer: 5-8% below asking -- tied to a specific documented risk
- Target: 3-6% below asking -- where monthly CF is approximately breakeven
- Stretch: 2-4% below asking
- Walk-away: at asking only if all risks resolved in DD
- Probability of acceptance at opening: Low; at target: Medium

### Tier 3 -- Issues Present (Qualitative 3-5: BER D/E, OMC unknown/concerning, RPZ risk)
- Opening offer: 8-12% below asking -- each issue provides specific justification
- Target: 6-10% below asking -- where model works on legally achievable rent
- Stretch: 4-6% below asking -- only if specific risks are resolved
- Walk-away: strictly below asking; paying asking means buying known problems at unknown cost
- Probability of acceptance at opening: Low (but justified by documented risk)

### Tier 4 -- Premium Asset / Thin Yield (Qualitative 7+, but yield marginal at asking)
- Anchor: maximum price at which corrected Eco ROI meets minimum acceptable threshold
- Opening offer: price where gross yield = minimum acceptable (e.g., 5.5%)
- Target: price where base monthly CF >= EUR0
- Walk-away: price where combined stress CF turns materially negative
- Probability of acceptance at opening: Low (likely near fair value)

---

## Calibration Reference Examples

Approximate ranges based on corrected models at 30% tax central case. Always recalculate from sensitivity table. Always round to nearest EUR500 or EUR1,000.

| Property | Asking | Tier | Opening | Target | Stretch | Walk-away |
|----------|--------|------|---------|--------|---------|-----------|
| 85 Fitzwilliam Quay (2B/1B, D4, B3) | EUR450k | 1 | EUR438k | EUR441k | EUR445k | EUR450k |
| 111 Corn Mill (2B/2B, D3, B3) | EUR475k | 2 | EUR451k | EUR464k | EUR475k | EUR475k |
| 314 Longboat Quay N (2B/2B, D2, C3) | EUR460k | 2-3 | EUR423k | EUR437k | EUR449k | EUR450k |
| 84 William Bligh (1B/1B, D4 Gasworks) | EUR420k | 2 | EUR410k | EUR413k | EUR420k | EUR420k |
| 84 Kirkpatrick House (2B/1B, Spencer Dock) | EUR440k | 3 | EUR396k | EUR407k | EUR418k | EUR425k |
| 77 Fitzwilliam Point (1B/1B, D4, D1) | EUR395k | 2-3 | EUR375k | EUR385k | EUR390k | EUR395k |

*Always recalculate from the sensitivity table for the specific property. These are approximate.*

---

## Integration with Ranking System

When negotiation is requested for a property from a multi-property comparison, show rank migration:

> "At the **asking price**, this property ranked **#X** overall. At the **target price** of EUR X,XXX,XXX, the improved corrected ROI and cash flow would move it to approximately **#Y**."

Recalculate Eco ROI, monthly CF, and combined stress CF at asking / target / stretch prices.

If a property moves from **Avoid -> Conditional Buy** at a realistic negotiated price, highlight this:
"[Property] is Avoid at asking (CF -EUR XXX/mo, Eco ROI 1.X%). At target EUR XXXk, CF turns to +EUR XXX/mo and Eco ROI improves to X.X% -- this becomes a Conditional Buy if OMC is clean."

---

## What This Module Does Not Do

- Does not predict what a specific seller will accept
- Does not guarantee the market will support the offered price
- Does not constitute legal or tax advice
- Does not replace due diligence -- offers should be conditional on satisfactory DD unless specific risks are fully priced in and verified
