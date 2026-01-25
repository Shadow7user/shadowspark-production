<#
.SYNOPSIS
  Fix _global-error prerender crash (useContext null) — Cursor Agent instruction block.

.DESCRIPTION
  Applies the documented fix for "Cannot read properties of null (reading 'useContext')"
  during Next.js build. Run before auth-implement.ps1 -Phase Full.

  Steps (NIST SP 800-53 Rev5 / Next.js docs §prerender-errors):
  1. Ensure src/app/global-error.tsx exists (minimal "use client", no useContext).
  2. Ensure src/app/not-found.tsx exists (force-dynamic or minimal Server Component).
  3. Add force-dynamic to login and dashboard to avoid prerender of auth-dependent pages.
  4. Delete .next and run npm run build.
  5. If build succeeds, run auth-implement.ps1 -Phase Full.

.PARAMETER SkipBuild
  Only ensure files; do not run build or auth-implement.

.PARAMETER SkipAuthScript
  Run build only; do not run auth-implement.ps1 -Phase Full.

.NOTES
  Doc: SS-2026-01-v1.1 | If build still fails on /_global-error, the cause is
  likely Next.js 16 / React 19 prerender of client components (framework-level).
#>

[CmdletBinding()]
param(
    [switch] $SkipBuild,
    [switch] $SkipAuthScript
)

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

# 1. global-error.tsx — minimal "use client", no useEffect/onClick/useContext
$globalError = @"
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <h2>Something went wrong!</h2>
        <a href="/">Try again</a>
      </body>
    </html>
  );
}
"@
$gf = Join-Path $Root "src\app\global-error.tsx"
$gfDir = Split-Path $gf
if (-not (Test-Path $gfDir)) { New-Item -ItemType Directory -Path $gfDir -Force | Out-Null }
Set-Content -Path $gf -Value $globalError -Encoding UTF8
Write-Host "[1/5] Ensured src/app/global-error.tsx" -ForegroundColor Green

# 2. not-found.tsx — minimal, force-dynamic to reduce prerender issues
$notFound = @"
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-cyan-900 p-4">
      <h2 className="text-2xl font-bold text-white">Not Found</h2>
      <p className="text-gray-400 mt-2">Could not find requested resource</p>
      <Link href="/" className="mt-4 text-cyan-400 hover:underline">
        Return Home
      </Link>
    </div>
  );
}
"@
$nf = Join-Path $Root "src\app\not-found.tsx"
Set-Content -Path $nf -Value $notFound -Encoding UTF8
Write-Host "[2/5] Ensured src/app/not-found.tsx" -ForegroundColor Green

# 3. force-dynamic on login and dashboard (patch if missing)
$loginPage = Get-Content (Join-Path $Root "src\app\login\page.tsx") -Raw
if ($loginPage -notmatch "dynamic\s*=\s*[\`"]force-dynamic[\`"]") {
    $loginPage = $loginPage -replace "(\s*)(export default function LoginPage)", "`$1export const dynamic = `"force-dynamic`";`n`$1`$2"
    Set-Content -Path (Join-Path $Root "src\app\login\page.tsx") -Value $loginPage -Encoding UTF8
}
$dashPage = Get-Content (Join-Path $Root "src\app\dashboard\page.tsx") -Raw
if ($dashPage -notmatch "dynamic\s*=\s*[\`"]force-dynamic[\`"]") {
    $dashPage = $dashPage -replace "(\s*)(export default async function DashboardPage)", "`$1export const dynamic = `"force-dynamic`";`n`$1`$2"
    Set-Content -Path (Join-Path $Root "src\app\dashboard\page.tsx") -Value $dashPage -Encoding UTF8
}
Write-Host "[3/5] Ensured force-dynamic on login and dashboard" -ForegroundColor Green

if ($SkipBuild) {
    Write-Host "[4/5] SKIP: build (SkipBuild)" -ForegroundColor Yellow
    Write-Host "[5/5] SKIP: auth-implement (SkipBuild)" -ForegroundColor Yellow
    exit 0
}

# 4. Delete .next and run build
Set-Location $Root
if (Test-Path .next) { Remove-Item -Path .next -Recurse -Force }
Write-Host "[4/5] Deleted .next, running npm run build..." -ForegroundColor Cyan
npm run build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Fix build errors before running auth-implement.ps1 -Phase Full." -ForegroundColor Red
    exit 1
}
Write-Host "[4/5] npm run build succeeded" -ForegroundColor Green

if ($SkipAuthScript) {
    Write-Host "[5/5] SKIP: auth-implement (SkipAuthScript)" -ForegroundColor Yellow
    exit 0
}

# 5. Run auth-implement.ps1 -Phase Full (load .env.local if present)
$envFile = Join-Path $Root ".env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#=][^=]*)=(.*)$') {
            $k = $matches[1].Trim(); $v = $matches[2].Trim() -replace '^["'']|["'']$'
            Set-Item -Path "Env:$k" -Value $v
        }
    }
}
Write-Host "[5/5] Running auth-implement.ps1 -Phase Full..." -ForegroundColor Cyan
& (Join-Path $Root "auth-implement.ps1") -Phase Full
exit $LASTEXITCODE
