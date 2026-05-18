# Dublin Property Monitor Search Config

## Gmail source
Label: `Daft-Property-Alerts`

## Purpose
Daily monitoring of Daft.ie email alerts for Dublin buy-to-let apartment candidates. The monitor should identify new or materially changed listings, classify them, run the Dublin Rental Property Analyst skill only when warranted, update the master report when new A-tier candidates appear, and send a concise alert.

## Investor assumptions
- Cash deployed into property: €300,000
- Mortgage: covers remaining total acquisition cost
- Mortgage term: 25 years
- Base BTL mortgage rate: 5.65%
- Stress mortgage rates: 7.0% and 8.0%
- Management: self-managed, 0% management fee
- Vacancy base case: 1 month/year
- Tax: simplified low Irish-rental-income case unless overridden
- Dividends/foreign income: not taxable in Ireland unless user says otherwise
- Objective: risk-adjusted ROI, durable rental demand, recession resilience, and clean downside protection

## Target areas
Primary:
- Ringsend
- Grand Canal Dock
- Dublin 2
- Dublin 4
- IFSC
- Spencer Dock
- The Gasworks
- Fitzwilliam Quay
- Longboat Quay
- Kirkpatrick House

Secondary / watchlist:
- Drumcondra
- Corn Mill
- North Strand
- Crosbie’s Yard
- Ballybough / North Strand only if yield is compelling
- Smithfield only if building/OMC defects are demonstrably resolved

## Property types
- Apartments
- 2-bed preferred
- 2-bed / 2-bath preferred over 2-bed / 1-bath, all else equal
- Premium 1-bed acceptable if 50m²+, strong location, good rent-to-price, and manageable BER/service-charge risk
- 3-bed / penthouse only if rent evidence is strong and tenant pool is credible

## Price range
Preferred:
- €350,000–€500,000

Watchlist:
- €500,000–€575,000

Avoid unless exceptional:
- >€575,000

## Positive filters
Prioritize listings with:
- BER B or better
- Parking
- Vacant possession
- Service charge disclosed
- Strong same-building or same-area rental comps
- Low LTV after €300k cash deployed
- 2-bed flexibility
- Professional tenant pool
- No obvious OMC/building remediation concerns
- Southside / Dublin 2 / Dublin 4 / Grand Canal edge resilience
- Strong cash flow under conservative rent and 7%–8% rate stress

## Hard red flags
Reject, downgrade, or place in manual review if:
- BER E or worse unless heavily discounted and retrofit is costed
- Known unresolved fire-safety, water-ingress, cladding, structural, insurance, or special-levy issues
- Sitting tenant with below-market rent unless price is heavily discounted and rent cap is modelled
- Prior rent materially below market with unclear RPZ/rent-reset status
- No service-charge information for apartment where SC may materially affect yield
- Weak or absent rent evidence
- Poor area/safety sentiment
- High mortgage burden and negative or thin cash flow
- Property relies mainly on appreciation rather than rental economics
- Daft page inaccessible and email lacks enough facts

## Classification rules
A-tier: run full analysis immediately
- Strong fit with target areas and price range
- Plausible rent-to-price ratio
- Likely positive base cash flow
- Acceptable BER or compensating discount
- No obvious hard red flags
- Enough listing facts to model credibly

B-tier: add to watchlist
- Potentially interesting but missing data
- Slightly outside criteria
- Rent, BER, service charge, or OMC status needs manual checking
- Could become A-tier after price drop or better facts

C-tier: reject
- Poor fit with strategy
- Too expensive for yield
- Very poor BER without discount
- Known unresolved defects
- Sitting tenant below market with no discount
- Weak rental case or poor resilience

D-tier: manual review
- Email/page ambiguous
- Listing inaccessible
- Core facts missing
- Possible duplicate/relist that cannot be matched reliably

## Daily task behavior
- Search Gmail label `Daft-Property-Alerts`
- Extract Daft.ie for-sale listing URLs
- Ignore rental URLs unless needed for rent comps during full analysis
- Compare against seen_listings.csv
- Do not re-analyze unchanged seen listings
- Analyze only new/changed A-tier listings
- Add B-tier to watchlist.md
- Add C-tier to rejected_listings.csv
- Add D-tier to manual review in watchlist.md
- Update master_property_report.md only if new A-tier analysis is completed or material ranking changes occur
- Always update latest_alert.md and run_log.md

## Weekly refresh behavior
- Check active shortlist status
- Detect price changes, sale agreed, withdrawn, relisted
- Refresh rent comps for serious candidates
- Recalculate rankings only when facts materially change
- Produce concise weekly summary

## Required due diligence flags
Always flag unresolved:
- RTB/rent history and rent-control status
- OMC accounts, AGM minutes, sinking fund, levy history
- Service charge confirmation
- BER certificate and upgrade path if C/D/E
- Survey/building condition
- Mortgageability/lender comfort
- Irish tax advice for non-resident landlord treatment
