# File Schemas — Persistent State Files

These files live in the user's workspace folder (the Dublin rental project folder). They persist between runs. Claude must read them at the start of every Daily Monitoring run and update them at the end.

---

## seen_listings.csv

Tracks every listing ever encountered. One row per listing.

### Columns

| Column | Type | Description |
|--------|------|-------------|
| `listing_id` | string | Daft numeric ID extracted from URL, or normalised URL if no ID found |
| `url` | string | Full Daft.ie listing URL |
| `title` | string | Listing title as shown in email or page |
| `address` | string | Full address as shown on listing |
| `price` | integer | Asking price in EUR (no symbols or commas) |
| `first_seen` | date (YYYY-MM-DD) | Date first encountered in a Daft email alert |
| `last_seen` | date (YYYY-MM-DD) | Date last encountered in any email alert |
| `status` | string | `active` / `price_change` / `withdrawn` / `sale_agreed` / `unknown` |
| `last_analyzed` | date (YYYY-MM-DD) | Date full analysis was last run; blank if never analyzed |
| `classification` | string | `A` / `B` / `C` / `D` / blank if not yet classified |
| `notes` | string | Free-text notes: rejection reason, price change history, flags |

### Header row

```
listing_id,url,title,address,price,first_seen,last_seen,status,last_analyzed,classification,notes
```

### Example rows

```
12345678,https://www.daft.ie/for-sale/apartment-grand-canal-dock-dublin-2/12345678,2 Bed Apartment Grand Canal Dock,15 Forbes Quay Dublin 2,450000,2026-05-10,2026-05-17,active,2026-05-10,A,Analyzed May 10 — ranked #3 overall
23456789,https://www.daft.ie/for-sale/apartment-coolock-dublin-5/23456789,3 Bed Apartment Coolock,111 Corn Mill Drive Dublin 5,275000,2026-05-12,2026-05-17,active,,B,Missing service charge — needs manual check
34567890,https://www.daft.ie/for-sale/apartment-airfield-manor-dublin-4/34567890,1 Bed Apartment Airfield Manor,7 Airfield Manor Dublin 4,545000,2026-05-14,2026-05-14,active,,C,Price too high for BER E1 — yield impossible
```

### Price change handling

When a price change is detected, update the `price` column to the new price, set `status` to `price_change`, and append to `notes`: `"Price changed from €X to €Y on YYYY-MM-DD"`. Keep the most recent price in the `price` column.

---

## rejected_listings.csv

Records all C-tier rejections with reason. Prevents re-analyzing known rejects.

### Columns

| Column | Type | Description |
|--------|------|-------------|
| `listing_id` | string | Same as seen_listings.csv |
| `url` | string | Full URL |
| `title` | string | Listing title |
| `address` | string | Full address |
| `price` | integer | Asking price at time of rejection |
| `date_seen` | date (YYYY-MM-DD) | Date first encountered |
| `reject_reason` | string | One of the standard reasons below (see Reject Reason Codes) |

### Header row

```
listing_id,url,title,address,price,date_seen,reject_reason
```

### Reject Reason Codes

Use these standard reasons for consistency:

| Code | Meaning |
|------|---------|
| `price_too_high` | Price too high for any plausible yield in the area |
| `ber_too_weak` | BER E or worse without sufficient price discount |
| `outside_area` | Outside target geography entirely |
| `not_residential` | Commercial, site, car park, or other non-residential |
| `sitting_tenant_capped` | Sitting tenant with clearly below-market rent; no reset path evident |
| `known_defects` | Development is on blacklist in search_config.md due to documented unresolved defects |
| `insufficient_data` | Insufficient data to classify (use D-tier instead for page-access failures) |
| `already_analyzed_avoid` | Previously analyzed and verdict was Avoid; no material change |
| `outside_price_range` | Below minimum price (may be unusual/non-standard unit) |

---

## watchlist.md

Groups listings that need further review but are not yet ready for full analysis.

### Structure

```markdown
# Property Watchlist

Last updated: YYYY-MM-DD

---

## Needs Manual Review (D-tier)

Listings where the page was inaccessible or data was too thin to classify.

| Listing ID | URL | Title | Date found | Reason |
|-----------|-----|-------|-----------|--------|
| [id] | [url] | [title] | [date] | Page inaccessible / email ambiguous / URL malformed |

---

## B-tier Watchlist

Potentially interesting listings not yet ready for full analysis.

| Listing ID | URL | Title | Address | Price | Date | Missing data | Notes |
|-----------|-----|-------|---------|-------|------|-------------|-------|
| [id] | [url] | [title] | [address] | €[price] | [date] | [what's missing] | [notes] |

---

## Unconfirmed Opportunities

Properties mentioned by the user or found in alerts without a verified active listing URL.

| Name/description | Source | Date | Notes |
|----------------|--------|------|-------|
| [name] | [user-provided / email] | [date] | Excluded from primary ranking — listing not confirmed |

---

## Price-Change Watchlist

Previously rejected or borderline listings that may be worth re-evaluating after a price reduction.

| Listing ID | URL | Title | Old price | New price | Change | Re-evaluate? |
|-----------|-----|-------|-----------|-----------|--------|-------------|
| [id] | [url] | [title] | €[old] | €[new] | −X% | [Yes if now within range / No] |
```

---

## run_log.md

Append-only log. One line per run. Never delete entries.

### Header

```
# Run Log — Dublin Rental Property Monitoring

Format: [datetime] | emails_checked=X | links_found=X | new_listings=X | a_tier=X | b_tier=X | c_tier=X | d_tier=X | analyzed=X | price_changes=X | report_updated=[yes/no] | errors=[none/description]
```

### Example entries

```
2026-05-17T08:05:12 | emails_checked=3 | links_found=7 | new_listings=2 | a_tier=1 | b_tier=1 | c_tier=0 | d_tier=0 | analyzed=1 | price_changes=0 | report_updated=yes | errors=none
2026-05-18T08:04:55 | emails_checked=0 | links_found=0 | new_listings=0 | a_tier=0 | b_tier=0 | c_tier=0 | d_tier=0 | analyzed=0 | price_changes=0 | report_updated=no | errors=none
2026-05-19T08:06:33 | emails_checked=1 | links_found=3 | new_listings=3 | a_tier=0 | b_tier=2 | c_tier=1 | d_tier=0 | analyzed=0 | price_changes=1 | report_updated=no | errors=none
2026-05-20T08:03:11 | emails_checked=0 | links_found=0 | new_listings=0 | a_tier=0 | b_tier=0 | c_tier=0 | d_tier=0 | analyzed=0 | price_changes=0 | report_updated=no | errors=Gmail search failed — authentication error
```

---

## search_config.md

User-editable configuration file. Claude reads this to set search criteria. If missing, defaults apply.

### Template

```markdown
# Search Configuration — Dublin Rental Property Monitor

## Target Areas
D2, D4, D6, D7, D8, Grand Canal Dock, Ringsend, IFSC, Smithfield, Spencer Dock, Coolock

## Price Range
Minimum: €150,000
Maximum: €700,000

## Minimum BER
D (E accepted only if asking price appears materially discounted)

## Minimum Gross Yield Threshold (quick filter)
5.0% at estimated base rent

## Preferred Bed Count
1-bed, 2-bed (3-bed considered if price/yield works)

## Blacklisted Developments
(Add developments with known unresolved defects here)
# Example: Smithfield Market — fire safety defects unresolved as of 2026-05

## Notes / Custom Rules
# Add any additional filters here
```

---

## latest_alert.md

Overwritten on every run. Contains the most recent monitoring alert.

See `references/monitoring_mode.md` for the exact alert format (A-tier found vs. no A-tier found templates).

---

## master_property_report.md

The full analysis report. Updated only when A-tier listings are analyzed. Structure follows the 19-section output format from SKILL.md. At the top, always maintain:

```markdown
# Dublin Buy-to-Let Master Report

Last updated: YYYY-MM-DD
Properties in primary ranking: X
Watchlist properties: X
Current overall #1: [property name]

## Changes Since Last Run — [date]
[Brief summary of what changed]
```
