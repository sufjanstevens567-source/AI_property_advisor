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
| `last_analyzed` | date (YYYY-MM-DD) | Date full analysis (Stages 1–12) was last run; blank if never analyzed |
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

## Queued for Full Analysis (A-tier, not yet analyzed)

Listings that passed the quick-filter classification but have not yet had Stages 1–12 run.

| Listing ID | URL | Address | Price | Date queued | Notes |
|-----------|-----|---------|-------|-------------|-------|
| [id] | [url] | [address] | €[price] | [date] | [quick-filter note] |

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
2026-05-17T08:05:12 | emails_checked=3 | links_found=7 | new_listings=2 | a_tier=1 | b_tier=1 | c_tier=0 | d_tier=0 | analyzed=0 | price_changes=0 | report_updated=no | errors=none
2026-05-18T08:04:55 | emails_checked=0 | links_found=0 | new_listings=0 | a_tier=0 | b_tier=0 | c_tier=0 | d_tier=0 | analyzed=0 | price_changes=0 | report_updated=no | errors=none
2026-05-19T08:06:33 | emails_checked=1 | links_found=3 | new_listings=3 | a_tier=0 | b_tier=2 | c_tier=1 | d_tier=0 | analyzed=0 | price_changes=1 | report_updated=no | errors=none
2026-05-20T08:03:11 | emails_checked=0 | links_found=0 | new_listings=0 | a_tier=0 | b_tier=0 | c_tier=0 | d_tier=0 | analyzed=0 | price_changes=0 | report_updated=no | errors=Gmail search failed — authentication error
```

Note (v8): `analyzed` reflects Stages 1–12 completions, not A-tier classification counts. In scheduled monitoring, `analyzed` is typically 0.

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

See `references/monitoring_mode.md` for the exact alert format (A-tier queued vs. full analysis run vs. no A-tier found templates).

---

## master_property_report.md

The full analysis report. Updated only when a full property analysis (Stages 1–12) was completed in the run. Structure follows the v8 27-section output format from SKILL.md. At the top, always maintain:

```markdown
# Dublin Buy-to-Let Master Report

Last updated: YYYY-MM-DD
Properties in primary ranking: X
Watchlist properties: X
Current overall #1: [property name]
Default tax case: 20% (not tax advice — confirm with Irish tax advisor)

## Changes Since Last Run — [date]
[Brief summary of what changed]
```

---

## property_registry.csv

**New in v8.** Canonical facts registry for all properties ever analyzed or considered. Used by the Fact-Change Reconciliation step (Stage 0f in SKILL.md) to detect when a canonical fact has changed between runs or analysis versions.

### Columns

| Column | Type | Description |
|--------|------|-------------|
| `property_id` | string | Stable internal identifier; use Daft listing ID if available |
| `canonical_name` | string | Short display name used consistently across reports (e.g., "Corn Mill Drive 3-bed") |
| `listing_url` | string | Most recent Daft.ie listing URL |
| `exact_address` | string | Full verified address as confirmed from listing page or official source |
| `eircode` | string | Eircode if known; blank if not found |
| `development` | string | Development/complex name if applicable |
| `micro_location` | string | Micro-location as resolved by the Micro-Location Resolver (Stage 0c); NOT the agent's marketing label |
| `county` | string | County (typically Dublin) |
| `postal_district` | string | Dublin postal district or area code (D1, D2, D4, etc.) |
| `asking_price` | integer | Most recent asking price in EUR |
| `beds` | integer | Number of bedrooms |
| `baths` | integer | Number of bathrooms |
| `size_m2` | string | Floor area in m², or "Unknown" |
| `ber` | string | BER rating (e.g., C3, D1, E2); or "Unknown" |
| `service_charge` | integer | Annual service charge in EUR; 0 if none; -1 if unknown |
| `service_charge_status` | string | `Confirmed` / `Estimated` / `Unknown` |
| `tenancy_status` | string | `Vacant` / `Tenanted` / `Unknown` |
| `previous_rent` | integer | Most recently disclosed rent in EUR/month; 0 if none disclosed; -1 if unknown |
| `status` | string | `active` / `sale_agreed` / `withdrawn` / `analyzed` / `watchlist` / `rejected` |
| `last_verified_at` | date (YYYY-MM-DD) | Date the canonical facts in this row were last confirmed from a live source |
| `source_ids` | string | Comma-separated Source IDs from source_register that support these facts |
| `notes` | string | Free-text: analysis verdict, ranking position, flags, conflicts, why excluded |

### Header row

```
property_id,canonical_name,listing_url,exact_address,eircode,development,micro_location,county,postal_district,asking_price,beds,baths,size_m2,ber,service_charge,service_charge_status,tenancy_status,previous_rent,status,last_verified_at,source_ids,notes
```

### Example rows

```
12345678,Forbes Quay 2-bed,https://www.daft.ie/for-sale/apartment-grand-canal-dock-dublin-2/12345678,15 Forbes Quay Dublin 2,D02 XY12,Forbes Quay,Grand Canal Dock D2,Dublin,D2,450000,2,2,72,B3,3200,Confirmed,Vacant,0,analyzed,2026-05-10,S1 S4 S7,Ranked #2 overall; Conditional Buy — OMC docs pending
23456789,Corn Mill Drive 3-bed,https://www.daft.ie/for-sale/apartment-coolock-dublin-5/23456789,111 Corn Mill Drive Dublin 5,,Corn Mill,Coolock D5,Dublin,D5,275000,3,2,Unknown,C2,-1,Unknown,Unknown,-1,watchlist,2026-05-12,S2,B-tier — size unknown; missing service charge
34567890,Airfield Manor 1-bed,https://www.daft.ie/for-sale/apartment-airfield-manor-dublin-4/34567890,7 Airfield Manor Dublin 4,,Airfield Manor,Donnybrook D4,Dublin,D4,545000,1,1,48,E1,2800,Confirmed,Vacant,0,rejected,2026-05-14,S3,Rejected: price_too_high for BER E1
```

### Rules for use

**Incompleteness disclosure:** If `property_registry.csv` does not exist or is empty, write:
> "Historical candidate registry not available; Previously Considered / Excluded section is incomplete. Do not say 'no previously excluded properties' unless registry confirms it."

**Fact-change detection:** Before producing a new report, compare the new canonical facts table against the registry. For any field that differs, output a Fact Change Log (Stage 0f). See SKILL.md §13 for the full Fact-Change Reconciliation procedure.

**Status transitions:**
- New listing discovered → `active`
- Full Stages 1–12 analysis completed → `analyzed`
- Added to watchlist without full analysis → `watchlist`
- Rejected (C-tier) → `rejected`
- Listing no longer active on Daft → `withdrawn` or `sale_agreed`

**Do not reuse stale registry facts as confirmed.** If `last_verified_at` is more than 30 days old and the listing is still active, re-verify key facts (price, tenancy status, SC) before relying on them in a new analysis.
