# Scheduled Task Prompts

Copy-pasteable prompts for setting up automated tasks in Claude Cowork.

---

## 1. Daily Daft Gmail Alert Monitor

**Schedule:** Daily — recommended 7:00–8:00 AM

**What it does:** Checks Gmail for new Daft.ie property alert emails, classifies new listings, runs full analysis on qualified A-tier properties, updates the master report, and writes a concise alert to latest_alert.md.

**Prompt to use:**

```
Run Daily Monitoring Mode for my Dublin buy-to-let search.

Project folder: C:\Users\seanh\Desktop\Sean\Claude Cowork Projects (MP)\Dublin rental project

Steps:
1. Load state files from the project folder: seen_listings.csv, rejected_listings.csv, watchlist.md, master_property_report.md, run_log.md, search_config.md.
2. Search Gmail label "Daft Property Alerts" for emails since the last run date in run_log.md. If no last run date, check the last 7 days.
3. Extract all Daft.ie for-sale listing URLs from those emails.
4. Compare against seen_listings.csv. Classify new and changed listings as A / B / C / D tier.
5. For any A-tier listings: run full Dublin rental property analysis (financial model, rent comps, stress tests, tax scenarios, building risk, negotiation strategy).
6. If A-tier listings were analyzed: update master_property_report.md with new analysis and recalculated rankings.
7. Write latest_alert.md with the run summary.
8. Update seen_listings.csv, rejected_listings.csv, watchlist.md, and run_log.md.
9. Save all updated files back to the project folder.
```

**Notes:**
- If Gmail has no new Daft alerts, the run completes quickly with a "no new listings" alert
- Only A-tier listings trigger a full analysis and master report update
- All files are saved back to the project folder after each run

---

## 2. Weekly Active Shortlist Refresh

**Schedule:** Weekly — recommended Sunday morning

**What it does:** Checks whether existing shortlisted properties are still active on Daft, detects price reductions, refreshes rent comps for top candidates, recalculates rankings, and produces a weekly summary.

**Prompt to use:**

```
Run Weekly Refresh Mode for my Dublin buy-to-let shortlist.

Project folder: C:\Users\seanh\Desktop\Sean\Claude Cowork Projects (MP)\Dublin rental project

Steps:
1. Load master_property_report.md and seen_listings.csv from the project folder.
2. For each confirmed active property in the master report, check whether its Daft.ie listing is still live. Note any that are withdrawn or sale-agreed.
3. Detect price reductions: compare current Daft asking price against the price stored in seen_listings.csv.
4. For the top 3–5 overall-ranked properties, refresh rent comparables by searching Daft.ie rental listings for same-building or micro-area comps.
5. Recalculate financial metrics (monthly CF, Eco ROI, stress CF) for any property where price or rent has changed materially.
6. Update master_property_report.md with refreshed figures and a "Weekly Refresh — [date]" summary section at the top.
7. Write latest_alert.md with the weekly summary: active/withdrawn status, price changes, rent comp changes, ranking shifts, recommended next action.
8. Update seen_listings.csv with any price changes or status changes detected.
9. Append a line to run_log.md: weekly refresh run summary.
10. Save all updated files to the project folder.
```

---

## 3. Manual "Analyze This New Listing" Fallback

**Use when:** You spot a listing yourself (not via email alert), or want to force a full analysis on a B-tier or D-tier listing.

**Prompt to use (adapt as needed):**

```
Analyze this new Dublin buy-to-let listing and add it to my master report if it qualifies.

Listing URL: [paste Daft.ie URL here]

Project folder: C:\Users\seanh\Desktop\Sean\Claude Cowork Projects (MP)\Dublin rental project

Steps:
1. Load master_property_report.md, seen_listings.csv, and run_log.md from the project folder.
2. Retrieve the listing from the URL and confirm it is active.
3. Run a full Dublin rental property analysis: listing facts, rent comps, building risk, financial model (corrected formulas), rent sensitivity, three tax scenarios, 10 stress tests with resilience category, RTB/rent-control status, negotiation strategy, pre-output audit.
4. If the listing is confirmed and qualifies (A-tier): add the analysis to master_property_report.md and recalculate rankings.
5. If the listing does not qualify: explain why and add it to the appropriate tier in seen_listings.csv and watchlist.md.
6. Update seen_listings.csv and run_log.md.
7. Save all files to the project folder.
```

---

## 4. First-Time Setup Prompt

**Use once** to initialise the project folder with the required state files before the first scheduled run.

**Prompt to use:**

```
Set up the Dublin buy-to-let monitoring project files in my project folder.

Project folder: C:\Users\seanh\Desktop\Sean\Claude Cowork Projects (MP)\Dublin rental project

Create these files if they do not already exist:
1. seen_listings.csv — with correct headers (listing_id, url, title, address, price, first_seen, last_seen, status, last_analyzed, classification, notes)
2. rejected_listings.csv — with correct headers (listing_id, url, title, address, price, date_seen, reject_reason)
3. watchlist.md — with four section headers: Needs Manual Review, B-tier Watchlist, Unconfirmed Opportunities, Price-Change Watchlist
4. run_log.md — with header line explaining format
5. search_config.md — with default search criteria (target areas D2/D4/D6/D7/D8/GCD/Ringsend/IFSC/Smithfield/Spencer Dock/Coolock, price range €150k–€700k, minimum BER D, minimum gross yield 5.0%)
6. latest_alert.md — empty placeholder

Do not overwrite any of these files if they already exist and contain data.
Confirm which files were created and which already existed.
```

---

## Tips for Scheduled Tasks

- **Gmail label:** Make sure your Daft.ie email alerts are automatically labelled "Daft Property Alerts" in Gmail. You can set this up in Gmail's filter settings.
- **First run:** Run the First-Time Setup prompt once before scheduling the daily task.
- **Project folder:** All prompts reference the same project folder — keep this consistent.
- **Run log:** Check run_log.md occasionally to confirm the scheduled task is running and to spot any recurring errors.
- **Watchlist:** Review watchlist.md weekly — B-tier listings may become A-tier if service charge or BER data becomes available.
- **search_config.md:** Edit this file directly to adjust target areas, price range, or blacklisted developments without needing to change the prompt.
