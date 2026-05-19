# install-v8.ps1
# Deploys the Dublin Buy-to-Let Analyst v8 skill files to the Claude AppData skills directory.
# Run this script once from PowerShell after reviewing the staged files in skill-update-v8\.
#
# Usage:
#   Right-click PowerShell > "Run as Administrator" (not required, but avoids permission issues)
#   Navigate to this folder:
#     cd "C:\Users\seanh\Desktop\Sean\Claude Cowork Projects (MP)\Dublin rental project\skill-update-v8"
#   Then run:
#     .\install-v8.ps1

$ErrorActionPreference = "Stop"

# --- Paths ---
$stagingDir  = $PSScriptRoot   # this script lives in skill-update-v8\
$skillDir    = "C:\Users\seanh\AppData\Roaming\Claude\local-agent-mode-sessions\skills-plugin\3577633a-af6c-49b3-830a-ed3586c48d49\b01acd7d-36b2-4ad8-96fa-c98e23a38ba3\skills\dublin-rental-property-analyst"

# --- Verify staging files exist ---
$filesToInstall = @(
    "SKILL.md",
    "references\financial_model_formulas.md",
    "references\audit_checklist.md",
    "references\scoring_rubric.md",
    "references\negotiation_module.md",
    "references\monitoring_mode.md",
    "references\file_schemas.md"
)

Write-Host ""
Write-Host "=== Dublin Buy-to-Let Analyst — v8 Installer ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Staging directory : $stagingDir"
Write-Host "Skill directory   : $skillDir"
Write-Host ""

# Check skill directory exists
if (-not (Test-Path $skillDir)) {
    Write-Host "ERROR: Skill directory not found:" -ForegroundColor Red
    Write-Host "  $skillDir" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check that Claude is installed and the path is correct." -ForegroundColor Yellow
    exit 1
}

# Check all staging files exist
$missing = @()
foreach ($f in $filesToInstall) {
    $src = Join-Path $stagingDir $f
    if (-not (Test-Path $src)) { $missing += $f }
}
if ($missing.Count -gt 0) {
    Write-Host "ERROR: The following staged files are missing:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    exit 1
}

Write-Host "All staged files found. Ready to install." -ForegroundColor Green
Write-Host ""

# --- Backup existing files ---
$backupDir = Join-Path $skillDir "backup-pre-v8-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Write-Host "Creating backup at:" -ForegroundColor Yellow
Write-Host "  $backupDir"
New-Item -ItemType Directory -Path $backupDir | Out-Null
New-Item -ItemType Directory -Path (Join-Path $backupDir "references") | Out-Null

$backupFiles = @(
    "SKILL.md",
    "references\financial_model_formulas.md",
    "references\audit_checklist.md",
    "references\scoring_rubric.md",
    "references\negotiation_module.md",
    "references\monitoring_mode.md",
    "references\file_schemas.md"
)
foreach ($f in $backupFiles) {
    $src = Join-Path $skillDir $f
    $dst = Join-Path $backupDir $f
    if (Test-Path $src) {
        Copy-Item $src $dst
        Write-Host "  Backed up: $f" -ForegroundColor DarkGray
    } else {
        Write-Host "  Not found (skip backup): $f" -ForegroundColor DarkGray
    }
}
Write-Host ""

# --- Install files ---
Write-Host "Installing v8 files..." -ForegroundColor Cyan
foreach ($f in $filesToInstall) {
    $src = Join-Path $stagingDir $f
    $dst = Join-Path $skillDir $f

    # Ensure destination subdirectory exists
    $dstDir = Split-Path $dst -Parent
    if (-not (Test-Path $dstDir)) {
        New-Item -ItemType Directory -Path $dstDir | Out-Null
    }

    Copy-Item $src $dst -Force
    Write-Host "  Installed: $f" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== v8 install complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Backup of previous files saved to:"
Write-Host "  $backupDir"
Write-Host ""
Write-Host "To verify, open Claude and run:" -ForegroundColor Yellow
Write-Host "  'Check my Gmail for new Daft property alerts'"
Write-Host "  or paste a Daft.ie listing URL to trigger a full analysis."
Write-Host ""
Write-Host "If anything looks wrong, restore from the backup directory above." -ForegroundColor Yellow
