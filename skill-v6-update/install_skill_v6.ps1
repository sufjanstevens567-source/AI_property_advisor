# Dublin BTL Analyst Skill v6 -- Install Script
# Run this from PowerShell as your normal user (no admin needed)

$skillRoot = "$env:APPDATA\Claude\local-agent-mode-sessions\skills-plugin\3577633a-af6c-49b3-830a-ed3586c48d49\b01acd7d-36b2-4ad8-96fa-c98e23a38ba3\skills\dublin-rental-property-analyst"
$updateRoot = "$env:USERPROFILE\Desktop\Sean\Claude Cowork Projects (MP)\Dublin rental project\skill-v6-update"

Write-Host "Installing Dublin BTL Analyst Skill v6..."
Write-Host "Source: $updateRoot"
Write-Host "Target: $skillRoot"

# Copy SKILL.md
Copy-Item "$updateRoot\SKILL.md" "$skillRoot\SKILL.md" -Force
Write-Host "OK: SKILL.md"

# Copy reference files
$refs = @(
    "audit_checklist.md",
    "due_diligence_checklist.md",
    "financial_model_formulas.md",
    "negotiation_module.md",
    "property_input_template.md",
    "scoring_rubric.md"
)

foreach ($f in $refs) {
    Copy-Item "$updateRoot\references\$f" "$skillRoot\references\$f" -Force
    Write-Host "OK: references/$f"
}

Write-Host ""
Write-Host "Skill v6 installed. Restart Claude Cowork to pick up changes."
