# ShadowSpark Technologies - VSCode Extension Cleanup Script
# Run as: .\scripts\cleanup-extensions.ps1

Write-Host "🧹 ShadowSpark VSCode Extension Cleanup" -ForegroundColor Cyan
Write-Host "=" * 60

# Extensions to uninstall (deprecated/unnecessary for our stack)
$toUninstall = @(
    'CoenraadS.bracket-pair-colorizer-2',
    'CoenraadS.bracket-pair-colorizer',
    '2gua.rainbow-brackets',
    'shardulm94.trailing-spaces',
    'HookyQR.beautify',
    'ms-vscode.vscode-typescript-tslint-plugin',
    'eg2.vscode-npm-script',
    'christian-kohler.npm-intellisense',
    'xabikos.JavaScriptSnippets',  # React snippets better
    'MS-CEINTL.vscode-language-pack-*',  # If not using translations
    'ms-vscode.live-server',  # Not needed for Next.js
    'ritwickdey.LiveServer'  # Not needed for Next.js
)

$uninstalled = 0

foreach ($ext in $toUninstall) {
    # Check if installed
    $installed = code --list-extensions | Select-String -Pattern $ext
    
    if ($installed) {
        Write-Host "  🗑️  Uninstalling: $ext" -ForegroundColor Yellow
        code --uninstall-extension $ext
        $uninstalled++
    }
}

Write-Host "`n✅ Cleanup complete! Uninstalled $uninstalled extensions." -ForegroundColor Green
Write-Host "⚡ Restart VSCode for changes to take effect." -ForegroundColor Cyan
