# ShadowSpark Technologies - Project Phase Assessment
# Run as: .\scripts\check-project-phase.ps1

Write-Host "ShadowSpark Project Phase Assessment" -ForegroundColor Cyan
Write-Host ('=' * 60)

$phases = @{
    "Phase1_Database" = @{
        Files = @("prisma/schema.prisma", ".env.local")
        Commands = @("npx prisma --version")
        Status = "Unknown"
    }
    "Phase1_Auth" = @{
        Files = @("src/lib/auth.ts", "src/app/api/auth/[...nextauth]/route.ts")
        Commands = @()
        Status = "Unknown"
    }
    "Phase2_UI" = @{
        Files = @("src/components/ui/button.tsx", "tailwind.config.ts")
        Commands = @()
        Status = "Unknown"
    }
    "Phase2_Marketing" = @{
        Files = @("src/app/(marketing)/page.tsx")
        Commands = @()
        Status = "Unknown"
    }
}

Write-Host "Checking project structure..." -ForegroundColor Yellow

foreach ($phase in $phases.Keys) {
    $allFilesExist = $true
    
    foreach ($file in $phases[$phase].Files) {
        if (-not (Test-Path $file)) {
            $allFilesExist = $false
            break
        }
    }
    
    $phases[$phase].Status = if ($allFilesExist) { "✅ Complete" } else { "⏳ Pending" }
}

# Display results
Write-Host "PHASE STATUS:" -ForegroundColor Green
foreach ($phase in $phases.Keys) {
    $status = $phases[$phase].Status
    $color = if ($status -match "Complete") { "Green" } else { "Yellow" }
    Write-Host "  $phase : $status" -ForegroundColor $color
}

# Calculate overall progress
$completed = ($phases.Values | Where-Object { $_.Status -match "Complete" }).Count
$total = $phases.Count
$percentage = [math]::Round(($completed / $total) * 100)

Write-Host "OVERALL PROGRESS: $percentage% ($completed/$total phases)" -ForegroundColor Cyan

# Next actions
Write-Host "NEXT ACTIONS:" -ForegroundColor Yellow
if ($phases["Phase1_Database"].Status -notmatch "Complete") {
    Write-Host "  1. Complete database setup (QUICK_START.md)" -ForegroundColor White
}
elseif ($phases["Phase1_Auth"].Status -notmatch "Complete") {
    Write-Host "  1. Implement NextAuth.js authentication" -ForegroundColor White
    Write-Host "     - Create auth.ts config" -ForegroundColor Gray
    Write-Host "     - Setup login/register pages" -ForegroundColor Gray
}
else {
    Write-Host "  1. Phase 1 complete! Start Phase 2 (Marketing Site)" -ForegroundColor White
}
