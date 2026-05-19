# Negotiation Strategy Module — v8

> **v8 change:** All price-tier tables now use **20% default tax case** in headline figures. 30% and 40% shown in tax sensitivity table. Walk-away ceiling constraints from SKILL.md §12 are embedded here.

---

## Price Terminology Glossary

**Use only these six terms throughout all sections and all report tables. Any mismatch between negotiation table, price-tier tables, and final recommendation is a blocking audit failure.**

| Term | Definition | Where used |
|------|------------|-----------|
| **Asking price** | Seller's listed price | All tables |
| **Opening offer** | First bid — the lowest credible anchor; expect counter-offer or rejection | Section C, price-tier Table A |
| **Target settlement** | Desired likely landing price; where you hope the deal closes | Section C, price-tier Table B |
| **Stretch maximum** | Highest price you may accept if all due diligence is clean | Section C, price-tier Table D |
| **Walk-away ceiling** | Above this price, do not proceed under any circumstances | Section C |
| **Aggressive buyer-case price** | A scenario showing deal metrics if a tough low offer succeeds — not the expected outcome, not the walk-away | Price-tier Table C |

**Walk-away ceiling ≥ stretch maximum ≥ target settlement ≥ opening offer.**

**Common mistakes to avoid:**
- Do NOT call a low opening bid a "walk-away price"
- Do NOT label stretch maximum the same as walk-away ceiling unless genuinely identical
- "Aggressive buyer-case" is a scenario for analysis — not a recommendation

---

## Walk-Away Ceiling Constraints (v8)

**Walk-away ceiling cannot exceed asking price if any of the following are true:**
- OMC documents not reviewed
- Tenancy unknown
- Previous rent unknown in RPZ area
- Size unknown
- Service charge estimated
- Rent confidence below High
- Legal rent confidence below High
- Source support is Partial/Directional for material facts
- Building risk current liability score < 6
- BER D/E without confirmed funded upgrade plan

For Conditional Buy assets: walk-away ceiling should normally be at or below asking. If above asking, justify explicitly with clean diligence.

---

## Core Philosophy

**Anchor to the financial model, not to the asking price.**

Your offer must be grounded in:
1. What rent the property can actually and legally achieve
2. What yield and cash flow that rent delivers at different price points (corrected Economic ROI formula)
3. What the mortgage burden looks like under combined downside stress
4. What risks remain unresolved (BER, SC, OMC, RPZ, building condition, legal rent)
5. What comparable sales suggest the market clears at

**Economic ROI = (Annual after-tax CF + Year-1 principal) / €300,000.**

---

## Offer Rounding Rule

**All offer amounts must be rounded to the nearest €500 or €1,000.**

| Computed amount | Correct rounded offer |
|----------------|----------------------|
| €437,750 | €438,000 |
| €441,450 | €441,500 or €441,000 |
| €412,600 | €412,500 or €413,000 |
| €375,250 | €375,000 or €375,500 |

---

## Output Format: Eight Sections (A-H)

### Section A: Asking Price Analysis

| Metric | At Asking Price | Notes |
|--------|----------------|-------|
| Gross yield (purchase price) | X.X% | |
| Monthly after-tax CF (20% default) | €X,XXX | |
| Monthly after-tax CF (30%) | €X,XXX | |
| Monthly after-tax CF (40%) | €X,XXX | |
| Year-1 principal repayment | €X,XXX | from amortisation |
| Economic return (CF + principal) | €X,XXX | |
| Economic ROI (20% default) | X.X% | |
| DSCR | X.XX | target >1.10 |
| Combined downside CF (S9) | €X,XXX | |
| Stress resilience category | [Robust/Good/Thin/Weak/Fragile] | |
| Verdict at asking price | Priced fairly / Overpriced / Underpriced | |

---

### Section B: Price Sensitivity Table

| Price | vs. Asking | Mortgage | Monthly Payment | Monthly CF (20%) | Eco ROI | S9 CF | Verdict |
|-------|-----------|----------|-----------------|-----------------|---------|-------|---------|
| Asking | — | | | | | | |
| −2.5% | | | | | | | |
| −5.0% | | | | | | | |
| −7.5% | | | | | | | |
| −10.0% | | | | | | | |

**Bold** the row where base-case CF first turns positive, or where S9 CF turns positive.

---

### Section C: Offer Recommendation

| Level | Amount | vs. Asking | Financial basis | Probability |
|-------|--------|-----------|-----------------|------------|
| **Opening offer** | €X,XXX,XXX | −X% | [model threshold] | Low / Medium / High |
| **Target settlement** | €X,XXX,XXX | −X% | [where S9 CF ≥ €0] | Low / Medium / High |
| **Stretch maximum** | €X,XXX,XXX | −X% | [max if all DD clean] | Low / Medium / High |
| **Walk-away ceiling** | €X,XXX,XXX | −X% | [above this: avoid] | n/a |

*Note: Aggressive buyer-case shown separately in price-tier Table C. It is a scenario, not a recommendation.*

**Probability of acceptance guidance:**
- **Low:** offer >7% below asking; property well-priced; no known defects
- **Medium:** offer 3–7% below asking; documented issues; listed >60 days; or price reduction already made
- **High:** offer ≤3% below asking; or vendor is motivated; or significant defects justify discount

---

### Section D: Negotiation Rationale

3–5 paragraphs: why asking price is [above/at/below] fair value; specific risks justifying discount; comparable evidence; seller's likely position; why target is the right anchor.

---

### Section E: Due-Diligence Levers

| Risk / Finding | Estimated Cost / Impact | Negotiation Argument |
|---------------|------------------------|---------------------|
| BER D | €8,000–€15,000 upgrade | Request price reduction equal to upgrade cost |
| BER E | €15,000–€25,000 | Hard leverage; substantial discount or walk |
| High SC vs. area average | +€1,200/yr drag → capitalised ~€20,000 | Price reduction equal to SC premium capitalised |
| No parking where it adds premium | −€100–150/mo | €15,000–€20,000 price impact |
| RPZ / previous rent below market | Rent may be €300–500/mo below market | Price based on capped rent; risk priced in |
| Celtic Tiger era; OMC not reviewed | Levy risk: €10,000–€50,000 | Price reduction or retention against levy contingency |
| Listed >90 days / no price reduction | Seller motivation rising | Patience is a negotiating asset |
| Refurbishment required | €5,000–€20,000 | Include in acquisition cost; argue price reduction |

---

### Section F: Agent Script

> "Hi [Agent], I'm a serious buyer and have done a thorough financial analysis of [Property].
>
> My analysis shows:
> - Market rent approximately €[X,XXX]/month [cite same-building or micro-area evidence]
> - At asking price, my corrected net cash flow is approximately €[X,XXX]/month
> - [Specific documented risk 1 — e.g., BER D requiring €8,000–€12,000 upgrade]
> - [Specific documented risk 2 — e.g., SC of €3,200/yr is above comparables by ~€1,200/yr]
> - [Specific documented risk 3 — e.g., OMC accounts not yet reviewed]
>
> Based on these factors, I'm prepared to make a clean offer of €[Opening Offer].
> I'm a cash-plus-mortgage buyer, pre-approved, and can move quickly.
> I'm happy to discuss. I want to be transparent about where I'm anchored and why."

---

### Section G: Escalation Plan

| Round | If seller responds... | Suggested move |
|-------|----------------------|---------------|
| 1 | Rejects, no counter | Restate rationale. Ask: "What price would make this work?" Then wait. |
| 2 | Counters above stretch | Hold at target. Offer to split between target and stretch if needed. |
| 3 | Counters at or near stretch | Accept if all conditions confirmed (BER, SC, OMC, RTB/RPZ). |
| 4 | Counters above walk-away | Politely decline. Redirect to next-best alternative. |
| 5 | Accepts opening offer | Do not revise upward. Proceed quickly; secure with booking deposit. |

---

### Section H: Deal Classification by Price

| Price Point | Classification | Investment Thesis |
|-------------|---------------|-------------------|
| Above asking | Not recommended | Yield deteriorates |
| Asking price | [from model] | [e.g., CF marginal at 20% tax; requires OMC clean] |
| Target price | [from model] | [e.g., CF positive; Eco ROI X.X%; acceptable] |
| Stretch price | [from model] | [e.g., CF marginal; tight; no further downside capacity] |
| Walk-away | Avoid above this | Eco ROI below minimum; S9 CF materially negative |

---

## Stale Listing Diagnostic

For any property listed >60 days:

| Factor | Finding |
|--------|---------|
| Days on market | |
| Listed since | |
| Price reductions | |
| Most likely explanation(s) | overpriced / tenancy complication / building issue / condition / test listing / seasonal |
| Evidence for staleness cause | |
| Key question for agent | "Why has this not sold? Have there been offers? Any building surveys done?" |
| Risk if explanation is building issue | |
| Negotiation leverage | Low / Medium / High |
| Model at asking price | CF €X/mo (20%); S9 €X/mo |
| Impact on opening offer | Tier 2 or Tier 3 heuristics |

**>90 days listed:** Move opening offer to Tier 3 heuristics (8–12% below asking) unless clearly non-structural.

---

## OMC Cleared / Unresolved Offer Scenarios

| Scenario | Offer | Justification |
|----------|-------|--------------|
| OMC unresolved | €[lower offer] | OMC risk unpriced; levy contingency required |
| OMC cleared | €[higher offer] | If documents confirm no levy; risk reduced; offer can improve |

---

## Offer Heuristics by Property Quality Tier

### Tier 1 — Strong / Clean (Qualitative 7+, BER A/B, clean OMC profile, verified rent)
- Opening: 3–5% below asking
- Target: 2–4% below asking
- Stretch: 0–2% below asking
- Walk-away: at or near asking (if model works well and diligence clean)

### Tier 2 — Decent but Not Outstanding (Qualitative 5–7, some concerns manageable)
- Opening: 5–8% below asking
- Target: 3–6% below asking
- Stretch: 2–4% below asking
- Walk-away: at asking only if all risks resolved in DD

### Tier 3 — Issues Present (Qualitative 3–5: BER D/E, OMC unknown, RPZ risk)
- Opening: 8–12% below asking
- Target: 6–10% below asking
- Stretch: 4–6% below asking
- Walk-away: **strictly below asking** — paying asking means buying known problems at unknown cost

### Tier 4 — Premium Asset / Thin Yield (Qualitative 7+, yield marginal at asking)
- Anchor: maximum price where Eco ROI meets minimum acceptable threshold
- Opening: price where gross yield = minimum acceptable
- Target: price where base monthly CF ≥ €0
- Walk-away: price where S9 CF turns materially negative

---

## Section I: Four Price-Tier Ranking Tables (Multi-Property Reports)

Every multi-property report must include all four tables. Use terminology glossary consistently.

### Table A: Ranking at Asking Price

| Rank | Property | Asking | CF/mo (20% default) | Eco ROI | S9 CF | Resilience |
|------|----------|:------:|:-------------------:|:-------:|:-----:|:----------:|

### Table B: Ranking at Target Settlement

*Recalculate mortgage, monthly payment, CF, Eco ROI, and S9 CF at each property's target settlement.*

| Rank | Property | Target Settlement | CF/mo (20% default) | Eco ROI | S9 CF | vs. Asking CF | Rank change |
|------|----------|:-----------------:|:-------------------:|:-------:|:-----:|:-------------:|:-----------:|

### Table C: Ranking at Aggressive Buyer-Case Price

*Label clearly: "Aggressive buyer-case — not the expected outcome."*

| Rank | Property | Aggressive Price | CF/mo (20% default) | Eco ROI | S9 CF | Prob. acceptance |
|------|----------|:----------------:|:-------------------:|:-------:|:-----:|:----------------:|

### Table D: Ranking at Walk-Away Ceiling

| Rank | Property | Walk-Away Ceiling | CF/mo (20% default) | Eco ROI | S9 CF | Note |
|------|----------|:-----------------:|:-------------------:|:-------:|:-----:|------|

For each property where moving Table A → Table B changes the verdict: state this explicitly.

---

## Terminology Consistency Check

- [ ] Opening offer in Section C matches Table A (or clearly lower for aggressive case)
- [ ] Target settlement in Section C matches Table B
- [ ] Stretch maximum in Section C matches Table D or clearly explained as different
- [ ] Aggressive buyer-case in Table C labelled as scenario, not recommendation
- [ ] All amounts rounded to nearest €500 or €1,000
- [ ] No "stretch" used as synonym for "walk-away"
- [ ] Same amounts in negotiation table, price-tier tables, and Final Recommendation
- [ ] Walk-away ceiling constraints per SKILL.md §12 obeyed

**Inconsistent numbers across sections = blocking audit failure.**
