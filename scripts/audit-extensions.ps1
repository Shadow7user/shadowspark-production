npm run setup
npm run dev

# ShadowSpark Technologies - VSCode Extension Audit Script
# Run as: .\scripts\audit-extensions.ps1

Write-Host "ShadowSpark VSCode Extension Audit" -ForegroundColor Cyan
Write-Host ('=' * 60)

# Get all installed extensions
$extensions = code --list-extensions --show-versions

# Count extensions
$extensionCount = ($extensions | Measure-Object).Count
Write-Host "`nTotal Extensions Installed: $extensionCount" -ForegroundColor Yellow

# Categorize extensions
$categories = @{
    Essential = @()
    Deprecated = @()
    Unknown = @()
}

# Essential extensions for Next.js 15 + Prisma + TypeScript
$essentialList = @(
    'dbaeumer.vscode-eslint',
    'esbenp.prettier-vscode',
    'prisma.prisma',
    'bradlc.vscode-tailwindcss',
    'GitHub.copilot',
    'GitHub.copilot-chat',
    'usernamehw.errorlens',
    'YoavBls.pretty-ts-errors',
    'christian-kohler.path-intellisense',
    'formulahendry.auto-rename-tag'
)

# Deprecated/unnecessary extensions (built into VSCode now)
$deprecatedList = @(
    'CoenraadS.bracket-pair-colorizer-2',
    'CoenraadS.bracket-pair-colorizer',
    '2gua.rainbow-brackets',
    'naumovs.color-highlight',
    'shardulm94.trailing-spaces',
    'HookyQR.beautify',
    'ms-vscode.vscode-typescript-tslint-plugin',
    'eg2.vscode-npm-script',
    'christian-kohler.npm-intellisense'
)

Write-Host "`nEXTENSION BREAKDOWN:" -ForegroundColor Green

foreach ($ext in $extensions) {
    $extName = ($ext -split '@')[0]
    if ($essentialList -contains $extName) {
        $categories.Essential += $ext
        Write-Host "  ESSENTIAL: $ext" -ForegroundColor Green
    }
    elseif ($deprecatedList -contains $extName) {
        $categories.Deprecated += $ext
        Write-Host "  DEPRECATED: $ext" -ForegroundColor Red
    }
    else {
        $categories.Unknown += $ext
        Write-Host "  REVIEW: $ext" -ForegroundColor Yellow
    }
}

# Summary
Write-Host ('=' * 60)
Write-Host "AUDIT SUMMARY:" -ForegroundColor Cyan
Write-Host "  Essential Extensions: $($categories.Essential.Count)" -ForegroundColor Green
Write-Host "  Deprecated/Unnecessary: $($categories.Deprecated.Count)" -ForegroundColor Red
Write-Host "  Needs Review: $($categories.Unknown.Count)" -ForegroundColor Yellow

# Export to file
$outputPath = "vscode-extension-audit-$(Get-Date -Format 'yyyy-MM-dd-HHmm').txt"
$extensions | Out-File $outputPath
Write-Host "Full extension list saved to: $outputPath" -ForegroundColor Cyan

# Recommend uninstalls
if ($categories.Deprecated.Count -gt 0) {
    Write-Host "RECOMMENDED ACTIONS:" -ForegroundColor Yellow
    Write-Host "  Run the cleanup script to remove deprecated extensions:"
    Write-Host "  .\scripts\cleanup-extensions.ps1" -ForegroundColor White
}
