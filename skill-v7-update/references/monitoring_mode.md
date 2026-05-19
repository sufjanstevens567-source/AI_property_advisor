# Daily Monitoring Mode

Load this file whenever the user triggers **Mode 3: Daily Monitoring Mode** — a scheduled task or manual request to check Gmail for new Daft.ie property alerts.

---

## Purpose

Process Daft.ie email alerts from Gmail automatically. Identify new listings that warrant a full analysis, run that analysis, update the master report, and produce a concise alert. Do nothing if no qualified listings are found — keep the process low-noise.

---

## Gmail Tools Available

Use these MCP tools:
- `search_threads` — search Gmail for Daft alert emails
- `get_thread` — read a thread to extract URLs and listing details
- `list_labels` — confirm the "Daft Property Alerts" label exists
- `label_thread` — optionally label processed threads

---

## Step 1: Load Project Files

Before doing anything else, load the current state from the workspace folder. These files persist between runs.

| File | Purpose | If missing |
|------|---------|-----------|
| `search_config.md` | Target areas, price range, BER minimum, yield threshold | Ask user to create it or use defaults |
| `seen_listings.csv` | All listings ever encountered | Create with headers; start fresh |
| `rejected_listings.csv` | C-tier rejections with reason | Create with headers |
| `watchlist.md` | B-tier and D-tier listings needing review | Create with section headers |
| `master_property_report.md` | Full analysis of all A-tier confirmed listings | Create empty if missing |
| `latest_alert.md` | Most recent daily alert | Overwrite on each run |
| `run_log.md` | Append-only log of each run | Create with header |

Read `references/file_schemas.md` for exact column definitions.

If `search_config.md` is missing, use these defaults and note it in the alert:
- Target areas: D2, D4, D6, D7, D8, GCD, Ringsend, IFSC, Smithfield, Spencer Dock, Coolock (for yield)
- Price range: €180,000–€700,000
- Minimum BER: D or better (E accepted only if price is materially discounted)
- Minimum gross yield threshold: 5.0% (at base rent)
- Beds: 1-bed or 2-bed preferred; 3-bed considered if price works

---

## Step 2: Search Gmail for Daft Alert Emails

### 2a. Find the label

Call `list_labels` to confirm a label named "Daft Property Alerts" exists. If not found, search by other likely names ("Daft", "Property Alerts", "daft.ie").

### 2b. Search for recent alert emails

Read `run_log.md` to find the date/time of the last successful run. Then search:

```
Search query: label:"Daft Property Alerts" after:[last_run_date]
```

If no last run date found (first run), search the last 7 days:
```
Search query: label:"Daft Property Alerts" newer_than:7d
```

Use `search_threads` with the query. If no results, try broader searches:
- `from:alerts@daft.ie`
- `subject:"New property" daft`
- `subject:"Property alert" daft`

### 2c. Extract listing URLs

For each email thread returned, call `get_thread` to read the content. Extract all Daft.ie **for-sale** listing URLs. These look like:
- `https://www.daft.ie/for-sale/...`
- `https://www.daft.ie/sale/...`

**Ignore rental listing URLs** (daft.ie/rental/...) — these are only useful as rent comp sources during full analysis, not as new purchase candidates.

Record: email date, email subject, URLs found.

### 2d. Error handling

If Gmail search fails entirely:
- Write to `run_log.md`: "ERROR: Gmail search failed — [error message]"
- Set `latest_alert.md` content to: "Gmail access failed. No listings checked today. Please verify Gmail MCP connection."
- Stop. Do not proceed.

If individual threads fail to load: note the thread ID in run_log, mark as D-tier (inaccessible), continue.

---

## Step 3: Normalise Listing Identity

For each URL extracted, determine the listing's unique identity.

### 3a. Extract listing ID

Daft.ie URLs typically contain a numeric listing ID, e.g.:
`https://www.daft.ie/for-sale/apartment-grand-canal-dock/12345678`

Extract the numeric ID at the end as `listing_id`. If no numeric ID found, use the normalized URL as the identifier (strip query parameters, lowercase, remove trailing slash).

### 3b. Match against seen_listings.csv

Look up `listing_id` in the seen listings file.

| Match result | Action |
|---|---|
| **Not found** | New listing — classify it (Step 4) |
| **Found, status = active, price unchanged** | Already seen; skip; increment seen count |
| **Found, price changed** | Mark as "price_change"; re-classify and potentially re-analyze |
| **Found, status = withdrawn/sale-agreed** | Mark last_seen date; log the change; skip analysis |
| **Found, new URL for same address+price** | Update URL; do not re-analyze unless price changed |

### 3c. Update seen_listings.csv

For every URL encountered (new or existing), update `last_seen` to today's date. For new listings, add a new row with status = "new".

---

## Step 4: Classify New and Changed Listings

For each new or changed listing, retrieve the listing page details. Use the `mcp__workspace__web_fetch` tool or similar to read the Daft listing page. If page access fails, use details available from the email alert and classify as D-tier.

### Classification Rules

**A-tier — Full Analysis Required**

All of these must be plausibly true:
- Address is in a target area (per search_config.md or defaults)
- Asking price is within target range
- Beds/baths suggest a rental-viable unit (1-bed, 2-bed, or 3-bed)
- Rough rent-to-price ratio appears plausible for positive cash flow:
  - Estimate: monthly rent ≥ (price × 0.005) as a quick filter (e.g., €400k → need ~€2,000/mo rent)
- BER is D or better, OR price appears materially discounted for weaker BER
- No obvious hard disqualifiers: not a commercial unit, not a bare site, not clearly unletable

**B-tier — Watchlist, No Full Analysis Yet**

One or more of:
- Missing BER, service charge, or size information — needs listing page review
- Slightly outside price range but potentially interesting
- Area is borderline (on the edge of target zones)
- Rent-to-price ratio is borderline (needs proper comp research to confirm)
- Penthouse or unusual unit type requiring more data

**C-tier — Reject**

Any of:
- Price too high for any plausible positive cash flow in the area
- BER E or worse without any discount signal
- Known development with unresolved major defects (if on internal blacklist in search_config.md)
- Sitting tenant with disclosed below-market rent and no clear path to reset
- Outside target geography entirely
- Not residential (commercial, site, car park)
- Already rejected previously with the same reason still valid

**D-tier — Manual Review**

Any of:
- Listing page inaccessible
- Email content too ambiguous to classify
- URL malformed or redirected
- Insufficient data even from email alert

### Recording Classifications

Update `seen_listings.csv`: set `classification` to A / B / C / D.
For C-tier: also append a row to `rejected_listings.csv` with `reject_reason`.
For B-tier and D-tier: add to `watchlist.md` under appropriate section.

---

## Step 5: Full Analysis for A-tier Listings

For each A-tier listing, run the complete analysis workflow from SKILL.md Steps 2–12:

1. Parse listing facts from Daft page
2. Research rent comparables on Daft rentals
3. Research Reddit/local sentiment (if meaningful — skip if time-constrained and no obvious red flags)
4. Build financial model (corrected formulas from `references/financial_model_formulas.md`)
5. Rent sensitivity table
6. Three tax scenarios
7. All 10 stress tests with resilience category
8. Building/OMC risk assessment and status block
9. RTB/rent-control status
10. Negotiation strategy (Sections A–H)
11. Pre-output audit (all 10 checks from `references/audit_checklist.md`)
12. Final verdict with conditional language

**Default assumptions for monitoring mode:**
- €300,000 cash deployed
- Self-managed
- 5.65% base rate, 25-year term
- Tax: show 20% base, 30% medium, 40% high
- Vacancy: 1 month base case

The new listing analysis must be self-contained: include all sections a user would need to make a go/no-go decision without reading the full master report.

**If the listing is unconfirmed** (no active Daft URL, or URL redirects to a dead page): do not run full analysis. Move to D-tier.

---

## Step 6: Update Master Report (A-tier listings found)

Only update `master_property_report.md` if at least one A-tier listing was analyzed this run.

### 6a. Insert new analysis

Add new property profiles at the top of the report under a "New This Run — [date]" section.

### 6b. Recalculate rankings

Recalculate yield ranking, resilience ranking, and overall risk-adjusted ranking across all confirmed analyzed properties. Unconfirmed/watchlist listings remain separate.

### 6c. Mark changes

- Price reductions on existing candidates: highlight in bold, note old vs. new price, recalculate metrics
- Status changes (withdrawn, sale-agreed): mark clearly; do not delete the entry
- New properties: mark as "[NEW]" in ranking tables

### 6d. Add "Changes Since Last Run" section

At the top of the master report, update or create a brief section:

```
## Changes Since Last Run — [date]

New listings analyzed: [count]
Price changes detected: [list any]
Status changes: [list any]
Current overall #1: [property name]
```

### 6e. If no A-tier listings found

Do NOT update `master_property_report.md`. Just update `run_log.md` and write `latest_alert.md`.

---

## Step 7: Generate Alert (latest_alert.md)

Always generate `latest_alert.md` regardless of whether A-tier listings were found.

### Alert when A-tier listings found

```markdown
# Daft Monitoring Alert — [date]

## New Qualified Listings Found

| Summary | Count |
|---------|-------|
| Emails checked | X |
| Listing URLs found | X |
| Already seen (no change) | X |
| A-tier (full analysis run) | X |
| B-tier (added to watchlist) | X |
| C-tier (rejected) | X |
| D-tier (manual review needed) | X |
| Price changes detected | X |

---

## Top New Candidate: [Property Name]

**Address:** [address]
**Asking price:** €[price]
**Verdict:** [verdict]
**Monthly CF (20% tax):** €[X]
**Eco ROI:** X.X%
**Stress resilience:** [category]
**Key risk:** [top 1–2 risks]
**Recommended action:** [1 sentence]
**Listing:** [URL]

[If changes ranking:] **This property would rank #X in the current overall ranking** (currently #1: [existing #1]).

---

## Master Report Updated: Yes

See master_property_report.md for full analysis and updated rankings.

---

## Watchlist Additions

[List B-tier properties added, with URL and one-line reason]

---

## Action Required

- [ ] [Any D-tier items needing manual review]
- [ ] [Any RTB/OMC/BER flags from A-tier analysis]
```

### Alert when no A-tier listings found

```markdown
# Daft Monitoring Alert — [date]

## No New Qualified Listings Found Today

| Summary | Count |
|---------|-------|
| Emails checked | X |
| Listing URLs found | X |
| Already seen (no change) | X |
| B-tier (added to watchlist) | X |
| C-tier (rejected) | X |
| D-tier (manual review) | X |
| Price changes on existing candidates | X |

Master report: Not updated.

[If price changes detected:]
## Price Changes Detected

| Property | Old Price | New Price | Change | Impact |
|----------|-----------|-----------|--------|--------|
| [name] | €X | €X | −X% | [Recalculate key metrics if material] |

[If no price changes:]
No price changes or status changes on existing shortlisted properties.

Next scheduled run: [tomorrow / as configured]
```

---

## Step 8: Update run_log.md

Append a new line to `run_log.md` after every run (successful or failed):

```
[ISO datetime] | emails_checked=X | links_found=X | new_listings=X | a_tier=X | b_tier=X | c_tier=X | d_tier=X | analyzed=X | price_changes=X | report_updated=[yes/no] | errors=[none / description]
```

---

## Step 9: Weekly Refresh Mode

Weekly Refresh is a separate, less frequent task. Run it when the user requests it or when the scheduled weekly task fires.

### Weekly Refresh Workflow

1. Load `master_property_report.md` and `seen_listings.csv`
2. For each property with status = "active" and a current listing URL, check whether the listing is still live on Daft
3. Detect price reductions: compare current Daft price against stored price
4. Refresh rent comps for the top 3–5 candidates (search Daft rentals for same-building or area comps)
5. Recalculate financial metrics for any candidate where rent or price has changed materially
6. Update `master_property_report.md` with refreshed figures
7. Produce a weekly summary in `latest_alert.md`:

```markdown
# Weekly Refresh — [date]

## Active Shortlist Status

| Property | Status | Price change | Rent comp change | ROI impact | Action |
|----------|--------|-------------|-----------------|-----------|--------|
| [name] | Active / Withdrawn | −X% / unchanged | +€X/mo / unchanged | +X% / unchanged | [none / re-evaluate] |

## Withdrawn / Sale-Agreed

[List any properties that have gone off the market since last check]

## Rank Changes

[Note if any ranking has shifted due to price or rent changes]

## Recommended Next Action

[1–3 sentences]
```

---

## Error Handling Summary

| Error | Response |
|-------|---------|
| Gmail search fails entirely | Alert user; log error; stop; do not claim search ran |
| Individual Daft page inaccessible | Use email details; classify D-tier; log; continue |
| run_log.md / seen_listings.csv missing | Create with correct headers; log creation; continue |
| master_property_report.md missing | Create empty; log; note that no prior analysis exists |
| A-tier analysis fails midway | Save partial analysis to latest_alert.md; log error; do not update master report |
| Listing confirmed unconfirmed (URL dead) | Move to D-tier; do not run analysis; note in alert |
| search_config.md missing | Use defaults; note in alert; suggest user create it |

**Do not fail silently.** Every error must appear in run_log.md and latest_alert.md.

---

## Monitoring Mode Language Standards

- Do not say "no new listings" if Gmail access failed — say "Gmail access failed; listings not checked"
- Do not add unconfirmed listings to the primary ranking even if they appear in email alerts
- Do not run a full analysis on a B-tier listing unless explicitly prompted
- Do not re-run the master report if no A-tier listings were analyzed
- Always flag RTB, OMC, BER, and tax issues — monitoring cannot resolve them
- Keep alerts concise — the user reads these every morning; make it skimmable
