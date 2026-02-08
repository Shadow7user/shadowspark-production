# ShadowSpark Technologies - VSCode Extension Performance Profiler
# Run as: .\scripts\profile-extensions.ps1

Write-Host "⚡ ShadowSpark VSCode Performance Profiler" -ForegroundColor Cyan
Write-Host "=" * 60

Write-Host "`nOpening VSCode Process Explorer..." -ForegroundColor Yellow
Write-Host "Look for 'Extension Host' process with high CPU% or Memory" -ForegroundColor Gray

# Open Process Explorer
code --command "workbench.action.processExplorer"

Write-Host "`n📋 PERFORMANCE CHECKLIST:" -ForegroundColor Green
Write-Host "  1. Check Extension Host CPU% (should be <5% idle)" -ForegroundColor White
Write-Host "  2. Check Extension Host Memory (should be <500MB)" -ForegroundColor White
Write-Host "  3. If high, run VSCode Extension Bisect:" -ForegroundColor White
Write-Host "     Ctrl+Shift+P → 'Help: Start Extension Bisect'" -ForegroundColor Gray

Write-Host "`n🔍 ALTERNATIVE: Check startup performance:" -ForegroundColor Yellow
Write-Host "  Ctrl+Shift+P → 'Developer: Startup Performance'" -ForegroundColor Gray

Write-Host "`n⏱️  Extensions taking >1000ms are problematic." -ForegroundColor Red
