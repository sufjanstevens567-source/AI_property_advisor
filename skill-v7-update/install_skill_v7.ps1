# Dublin BTL Analyst Skill v7 -- Install Script
# Run from PowerShell (no Administrator required)

$TargetDir = "$env:LOCALAPPDATA\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude\local-agent-mode-sessions\skills-plugin\3577633a-af6c-49b3-830a-ed3586c48d49\b01acd7d-36b2-4ad8-96fa-c98e23a38ba3\skills\dublin-rental-property-analyst"
$UpdateRoot = "$env:USERPROFILE\Desktop\Sean\Claude Cowork Projects (MP)\Dublin rental project\skill-v7-update"

if (-not (Test-Path $TargetDir)) {
    Write-Error "Skill directory not found at: $TargetDir"
    exit 1
}

Write-Host "Installing to: $TargetDir"

# Copy SKILL.md
Copy-Item "$UpdateRoot\SKILL.md" "$TargetDir\SKILL.md" -Force
Write-Host "  Copied: SKILL.md"

# Copy all reference files
$RefSrc = "$UpdateRoot\references"
$RefDst = "$TargetDir\references"
New-Item -ItemType Directory -Force -Path $RefDst | Out-Null
Get-ChildItem "$RefSrc\*.md" | ForEach-Object {
    Copy-Item $_.FullName "$RefDst\$($_.Name)" -Force
    Write-Host "  Copied: $($_.Name)"
}

Write-Host ""
Write-Host "v7 skill installed successfully. Restart Claude to pick up the new version."
