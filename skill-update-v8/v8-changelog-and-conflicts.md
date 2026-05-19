# Dublin Buy-to-Let Analyst — v8 Changelog and Conflict Report

**Prepared:** 2026-05-19
**Skill path:** `skills/dublin-rental-property-analyst/`
**Files updated:** SKILL.md, financial_model_formulas.md, audit_checklist.md, scoring_rubric.md, negotiation_module.md, monitoring_mode.md, file_schemas.md

---

## Summary

v8 is a comprehensive correctness patch. The most impactful change is the reversal of the default tax case from 30% to 20%. All other changes close specific failure modes identified in the v7 report: financial model opacity, weak source validation, ambiguous OMC risk claims, contradictory rent confidence labels, and over-permissive walk-away ceilings on unresolved properties.

---

## Changelog by File

### SKILL.md

| # | Change | Where in SKILL.md |
|---|--------|------------------|
| 1 | **Default tax case changed to 20%.** Investor profile table updated. Headlines, rankings, negotiation, and final recommendation all now use 20%. 30% = medium sensitivity; 40% = conservative stress. | §0 Default Investor Profile |
| 2 | **Financial Reconciliation Audit added.** Mandatory table before rankings: 10-column reconciliation per property per rent case; tolerance ≤€50/year CF, ≤0.05pp ROI, ≤€1/month rounding. Blocking failure if exceeded. | §1 (new) |
| 3 | **Calculation Ledger required before Sections 7–12.** Every number in the master financial table must trace to a ledger entry. Ledger includes 20 fields per property per rent case. | §4 (new) |
| 4 | **Exact tax formula embedded in SKILL.md.** Taxable profit definition, deductible items listed explicitly, taxable profit floor (negative → tax = €0), cash flow, economic return, and economic ROI formulas all stated verbatim. | §5 (new) |
| 5 | **Minimum operating-cost stack defined.** 8 required cost items. Three cost cases: Lean / Normal / Conservative. Default rankings use Normal; Lean must be labelled "not used for default ranking." Operating-cost table format specified. | §6 (new) |
| 6 | **Unknown-size ranking rule.** Primary ranking must use compact/downside rent (−≥10% for 2-bed, −≥5% for 1-bed). Normal-size rent shown as upside only. Mandatory compact/downside table. Size-unknown properties capped at: rent confidence Low-Medium, DQ score 7.0, verdict Conditional Buy, layout score 5, cannot receive Best Yield Candidate. | §7 (new) |
| 7 | **Rent confidence made single-valued.** Three-column table: pre-cap confidence, cap reason, final confidence. Final confidence is the only rating used in scoring/ranking. Contradictory labels (e.g., "High, capped at Low-Medium") eliminated. | §8 (new) |
| 8 | **Source-support validation added.** Source register gains `support_level` column: Exact / Partial / Directional / Contradictory / Access blocked / Unverified. Partial/Directional/Access blocked/Unverified cannot drive confirmed fields or ranking inputs. Contradictory = blocking failure. | §2 (updated) |
| 9 | **OMC/Building Search Log added.** 10 required search queries per development. Minimum 6 searches required before "no public red flags found" is valid. OMC risk score capped at 6 without reviewed documents. | §6 (new) / pre-analysis output 0e |
| 10 | **Monitoring/Underwriting Split enforced.** Daily Monitoring Mode may classify and queue; it must not generate full memos, overwrite canonical facts, or update primary rankings unless Stages 1–12 are explicitly invoked. | §11 (new) |
| 11 | **Property registry made mandatory for multi-property reports.** If registry missing, section must be labelled incomplete; do not say "no previously excluded properties." | §12 (new) |
| 12 | **Fact-Change Reconciliation added.** Fact Change Log required when canonical facts differ from prior registry. Material fact conflicts are blocking failures. | §13 (new) |
| 13 | **Walk-away ceiling constraints tightened.** Walk-away ceiling cannot exceed asking price if OMC unreviewed, tenancy unknown, size unknown, SC estimated, rent/legal rent confidence < High, source support Partial/Directional, building risk score < 6, or BER D/E without funded plan. | §12 (new) |
| 14 | **Stress-resilience categories defined in SKILL.md.** Robust / Good / Thin but positive / Weak / Fragile defined with exact monthly CF thresholds for S9 and S10. Narrative rules for edge cases. Takes precedence over scoring_rubric.md if conflict. | §13 (new) |
| 15 | **All non-negotiable blockers duplicated in SKILL.md.** Reference files remain, but critical rules no longer depend solely on reference file context being loaded. | §16 preamble |
| 16 | **Visible Blocking Audit Table required.** 17-check table must be explicitly printed; cannot simply state "passed." New checks: Financial Reconciliation, Property Registry. | §8 (updated) |
| 17 | **Output structure expanded.** Pre-analysis outputs: 0a–0i (was 0a–0d). Main report: 27 sections (was 24). New sections: Final Rent Confidence Table (Sec 6), Compact/Unknown-Size Downside Table (Sec 7), 3-case Cost Table (Sec 8), v8 Compliance Check (Sec 27). | §15 Output Structure |
| 18 | **v8 Compliance Check added as Section 27.** 12-item checklist at end of every report. Failed checks trigger: "Do not rely on this report until failed v8 checks are resolved." | §19 (new) |
| 19 | **Blocking check for 30% central case** (reverse of v7 check for 20% central case). Now: using 30% as headline is a blocking failure; 20% is the required default. | §8 Blocking Audit |

---

### references/financial_model_formulas.md

| Change | Detail |
|--------|--------|
| Default tax changed to 20% | All "30% central case" language replaced with "20% default case" throughout |
| Financial Reconciliation Audit table added | Exact 10-column format, tolerance rules, blocking failure conditions |
| Minimum operating-cost stack added | 8 required items, 3 cost cases (Lean/Normal/Conservative), table format |
| SC sensitivity table header updated | "Monthly CF (20% default)" replacing "Monthly CF (30%)" |
| Master comparison table column updated | "Estimated tax (20% default)" replacing prior 30% label |
| Final Rent Confidence Table format added | Three-column structure: pre-cap, cap reason, final |
| Compact/downside table format added | Required for all size-unknown properties |
| Exact tax formula stated | Verbatim deductible items list; taxable profit floor; CF, economic return, ROI formulas |

---

### references/audit_checklist.md

| Change | Detail |
|--------|--------|
| **Check 9 REVERSED** (critical conflict — see Conflicts section below) | Old: "20% must NOT be central case — blocking failure." New: "30% must NOT be central headline case — blocking failure." |
| Check 2 updated | Source support validation (support_level column) now required |
| Check 6 added | OMC/Building Search Log complete (≥6 required searches logged) |
| Check 8 updated | Default rankings must use Normal cost case, not Lean |
| Check 16 added | Calculation Ledger and Financial Reconciliation present and passed |
| Check 17 added | Property Registry available or incompleteness disclosed |
| Check 18 added | Compact/Unknown-Size Downside Table present for all size-unknown properties |
| Check 19 added | v8 Compliance Check present as Section 27 |
| All SC sensitivity table references | Updated to "20% default" tax |

---

### references/scoring_rubric.md

| Change | Detail |
|--------|--------|
| SC sensitivity table header | "Monthly CF (20% default tax)" |
| v8 note at top | Confirms 20% default tax change |
| Stress-category precedence note | "SKILL.md §13 takes precedence if conflict" |
| Layout/Size Quality | "Size unknown: maximum Dim 12 score = 5" added |
| Best Yield Candidate label | Compact/downside rent case must also support yield |
| Source Confidence Classification | support_level requirement added |

---

### references/negotiation_module.md

| Change | Detail |
|--------|--------|
| Walk-Away Ceiling Constraints section added | Verbatim from SKILL.md §12; 10 conditions under which ceiling cannot exceed asking price |
| Section A investment summary table | "Monthly CF (20% default)" row added; 30% and 40% rows retained as sensitivity |
| Section B price sensitivity | Column heading changed to "Monthly CF (20%)" |
| All four price-tier tables (A/B/C/D) | "(30%)" changed to "(20% default)" |
| Calibration reference note | "30% tax central case" changed to "20% default tax case" |
| Terminology Consistency Check | Walk-away constraints added as required check item |

---

### references/monitoring_mode.md

| Change | Detail |
|--------|--------|
| v8 Monitoring/Underwriting Split section added at top | Hard constraints: monitoring must not generate full memos, overwrite canonical facts, update primary rankings without Stages 1–12 |
| A-tier classification behaviour updated | A-tier now queues listings; does not trigger inline analysis |
| Alert templates updated | "Queued for Full Analysis" template added; existing templates updated to say "20% default tax" in any CF figures |
| Step 5 rewritten | Full analysis is a separate mode; monitoring queues, not analyzes |
| Step 6 updated | Master report update only if Stages 1–12 explicitly completed |
| run_log note added | `analyzed` field clarified: reflects Stages 1–12 completions, not A-tier count |
| Weekly Refresh | Refreshed headline figures now use 20% default tax |
| property_registry.csv | Added to file list in Step 1; "incompleteness disclosed" error handling added |
| Language standards updated | 3 new entries: "20% default tax", "queued for full analysis", "do not blend monitoring and full report generation" |

---

### references/file_schemas.md

| Change | Detail |
|--------|--------|
| **property_registry.csv schema added** (new in v8) | 22 columns; full column definitions, header row, example rows, rules for use |
| `property_registry` rules section | Incompleteness disclosure, fact-change detection, status transitions, staleness rule (>30 days → re-verify) |
| `watchlist.md` structure updated | "Queued for Full Analysis (A-tier, not yet analyzed)" section added |
| `run_log.md` example and notes updated | `analyzed` field note clarified for v8 |
| `master_property_report.md` notes updated | v8 27-section format noted; "Default tax case: 20%" added to report header template |

---

## Conflicts Found Between v7 Files and v8 Patch

### Conflict 1 — CRITICAL: Blocking check for 20% tax (audit_checklist.md, Check 9)

**Severity:** Critical — direct contradiction between old skill and v8 patch

**Old text (v7 audit_checklist.md Check 9):**
> "20% tax used as central case for non-resident" → BLOCKING FAILURE
> The v7 skill explicitly blocked 20% as the default, treating 30% as the required central case.

**v8 patch requirement:**
> Set default/central tax case to 20%. 30% is now "medium sensitivity." 30% as headline = blocking failure.

**Resolution:** Check 9 completely reversed. New text reads: "30% used as central headline case (not user-specified) → BLOCKING FAILURE. 20% must be the default unless user specifies otherwise."

**Risk if not resolved:** The skill would refuse to produce any report using 20% as the default, directly contradicting the v8 patch's most important change.

---

### Conflict 2 — Tax language throughout reference files

**Severity:** High — pervasive inconsistency

**Old text (financial_model_formulas.md, negotiation_module.md, scoring_rubric.md):**
Multiple references to "30% central case," "headline at 30%," "30% tax case used for rankings," "30% for non-resident (practical central case)."

**v8 patch requirement:**
20% is the default/central case. 30% is medium sensitivity.

**Resolution:** Replaced all "30% central case" and "practical central case" references with "20% default case" across all six reference files. 30% retained as a sensitivity row in every tax table.

---

### Conflict 3 — Contradictory rent confidence labels (SKILL.md and source register usage)

**Severity:** Medium — produces misleading report outputs

**Old behaviour:**
The v7 skill allowed labels like "High, capped at Low-Medium" in rent confidence. This is self-contradictory: a value cannot be simultaneously High and Low-Medium.

**v8 patch requirement:**
Rent confidence must be single-valued. Three-column structure: pre-cap, cap reason, final. Final is the only value used in scoring.

**Resolution:** §8 of new SKILL.md enforces single-valued final_rent_confidence_table. Resolved in financial_model_formulas.md (table format added) and audit_checklist.md (Check 13 updated).

---

### Conflict 4 — Monitoring mode ran full analyses automatically (monitoring_mode.md)

**Severity:** Medium — caused blending of monitoring state and underwriting state

**Old behaviour (v7 monitoring_mode.md, Step 5):**
"For each A-tier listing, run the complete analysis workflow from SKILL.md Steps 2–12." This meant every A-tier listing found during scheduled monitoring automatically triggered a full 12-step analysis and updated the master report.

**v8 patch requirement:**
Monitoring must not generate full memos or update primary rankings. A-tier listings are queued for Full Property Analysis Mode; the user must explicitly trigger Stages 1–12.

**Resolution:** Step 5 of monitoring_mode.md completely rewritten. Alert templates updated with "Queued for Full Analysis" section. Master report update gated on explicit user request.

---

### Conflict 5 — OMC risk score could reach 7–8 without reviewed documents (scoring_rubric.md, audit_checklist.md)

**Severity:** Medium — over-optimistic OMC risk scoring

**Old behaviour:**
The v7 scoring rubric allowed OMC Current Liability scores of 7–8 based on "no reports found" from web searches, without requiring that actual OMC documents be reviewed.

**v8 patch requirement:**
"No reports found" cannot raise score above 6. OMC documents (accounts, AGM minutes, sinking fund, levy history) required to score 7+. Minimum 6 search queries must be logged before "no red flags found" is valid.

**Resolution:** scoring_rubric.md updated with the score-6 cap. audit_checklist.md Check 6 (new) enforces OMC search log. negotiation_module.md walk-away constraints reference building risk score < 6 as a ceiling trigger.

---

### Conflict 6 — Walk-away ceiling had no diligence-based constraints (negotiation_module.md)

**Severity:** Medium — permitted aggressive walk-away ceilings on unresolved properties

**Old behaviour:**
Walk-away ceiling was set purely by financial model outputs with no constraint based on unresolved diligence (unknown OMC, unknown size, estimated SC, etc.).

**v8 patch requirement:**
Walk-away ceiling cannot exceed asking price if OMC unreviewed, tenancy unknown, size unknown, SC estimated, rent confidence < High, legal rent confidence < High, source support Partial/Directional, building risk score < 6, or BER D/E without funded upgrade plan.

**Resolution:** Walk-Away Ceiling Constraints section added to negotiation_module.md. Same constraints duplicated in SKILL.md §12. Terminology Consistency Check updated.

---

### Conflict 7 — Property registry not defined or required (file_schemas.md)

**Severity:** Low-Medium — "no previously excluded properties" could be stated without registry evidence

**Old behaviour:**
No `property_registry.csv` schema existed. The v7 skill's "Previously Considered / Excluded Properties" section could say "no previously excluded properties" without any registry backing.

**v8 patch requirement:**
Property registry is mandatory for multi-property reports. If missing, section must be labelled incomplete. 22-column schema defined.

**Resolution:** property_registry.csv schema added to file_schemas.md. Fact-Change Reconciliation added to SKILL.md §13. watchlist.md structure updated with "Queued for Full Analysis" section.

---

## Files Not Changed

| File | Reason |
|------|--------|
| `references/scoring_rubric.md` (most content) | v7 content largely compatible; only 5 targeted additions made (noted above) |
| `references/scheduled_task_prompts.md` | No conflicts with v8 patch; scheduled task prompts unchanged |
| All workspace CSV/MD data files | Data files are not skill files; unchanged by this patch |

---

## Installation

1. Review the staged files in `skill-update-v8\`
2. Run `install-v8.ps1` from PowerShell (see script for instructions)
3. The script backs up all existing files to a timestamped `backup-pre-v8-*` folder before overwriting
4. Restart Claude or start a new conversation to pick up the updated skill

If you need to roll back: copy files from the backup folder back to the skill directory.
