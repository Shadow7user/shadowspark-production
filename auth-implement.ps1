<#
.SYNOPSIS
  ShadowSpark Auth Implementation & Validation Script (Cursor Agent / GitHub Actions §2.4)

.DESCRIPTION
  Step-by-step auth implementation and validation. Supports:
  - Direct agent execution (non-interactive, CI-friendly)
  - NIST SP 800-53 Rev5–style stepwise validation
  - Zero-interrupt rollout: Validate and build before any production change

.PARAMETER Phase
  Validate | Implement | SmokeTest | Full (default: Full)

.PARAMETER DryRun
  Log actions only; do not execute (stakeholder visibility).

.PARAMETER SmokePort
  Port for smoke-test server (default: 3001). Use to avoid conflict with running dev.

.EXAMPLE
  .\auth-implement.ps1 -Phase Full
  .\auth-implement.ps1 -Phase Validate -DryRun
  .\auth-implement.ps1 -Phase SmokeTest -SmokePort 3002

.NOTES
  Doc: SS-2026-01 | Q1 Rollout: 2026-03-31
#>

[CmdletBinding()]
param(
    [ValidateSet("Validate", "Implement", "SmokeTest", "Full")]
    [string] $Phase = "Full",

    [switch] $DryRun,

    [int] $SmokePort = 3001
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$ExitValidate = 1
$ExitImplement = 2
$ExitSmoke = 3

function Write-Step { param([string]$Id, [string]$Msg) Write-Host "[$Id] $Msg" -ForegroundColor Cyan }
function Write-Pass { param([string]$Id) Write-Host "[$Id] PASS" -ForegroundColor Green }
function Write-Fail { param([string]$Id, [string]$Msg) Write-Host "[$Id] FAIL: $Msg" -ForegroundColor Red; throw $Msg }
function Write-Skip { param([string]$Id, [string]$Msg) Write-Host "[$Id] SKIP: $Msg" -ForegroundColor Yellow }

# ---------- Phase: Validate ----------
# NIST SP 800-53 Rev5: step-by-step validation before implementation
function Invoke-PhaseValidate {
    Set-Location $ProjectRoot

    # V1: Required env (NEXTAUTH_SECRET, NEXTAUTH_URL; DATABASE_URL for Prisma)
    Write-Step "V1" "Checking required environment (NEXTAUTH_SECRET, NEXTAUTH_URL, DATABASE_URL)"
    if ($DryRun) { Write-Skip "V1" "DryRun: would check env"; return }
    $missing = @()
    if (-not $env:NEXTAUTH_SECRET) { $missing += "NEXTAUTH_SECRET" }
    if (-not $env:NEXTAUTH_URL)    { $env:NEXTAUTH_URL = "http://localhost:3000" }
    if (-not $env:DATABASE_URL)    { $missing += "DATABASE_URL" }
    if ($missing.Count -gt 0) { Write-Fail "V1" "Missing: $($missing -join ', ')" }
    Write-Pass "V1"

    # V2: Auth and API files exist
    Write-Step "V2" "Checking auth and API routes exist"
    if ($DryRun) { Write-Skip "V2" "DryRun: would check files"; return }
    $files = @(
        "src\lib\auth.ts",
        "src\app\api\auth\[...nextauth]\route.ts",
        "src\app\login\page.tsx",
        "src\middleware.ts",
        "prisma\schema.prisma"
    )
    foreach ($f in $files) {
        $full = Join-Path $ProjectRoot $f
        if (-not (Test-Path -LiteralPath $full)) { Write-Fail "V2" "Missing: $f" }
    }
    Write-Pass "V2"

    # V3: package.json has next-auth and prisma
    Write-Step "V3" "Checking package.json (next-auth, @prisma/client)"
    if ($DryRun) { Write-Skip "V3" "DryRun: would check package.json"; return }
    $pkg = Get-Content (Join-Path $ProjectRoot "package.json") -Raw | ConvertFrom-Json
    if (-not $pkg.dependencies."next-auth")   { Write-Fail "V3" "next-auth not in dependencies" }
    if (-not $pkg.dependencies."@prisma/client") { Write-Fail "V3" "@prisma/client not in dependencies" }
    Write-Pass "V3"
}

# ---------- Phase: Implement ----------
# Zero-interrupt: build and generate only; no DB push or production deploy in this script
function Invoke-PhaseImplement {
    Set-Location $ProjectRoot

    # I1: Install deps
    Write-Step "I1" "Installing dependencies (npm install)"
    if ($DryRun) { Write-Skip "I1" "DryRun: would run npm install"; return }
    npm install 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { Write-Fail "I1" "npm install failed" }
    Write-Pass "I1"

    # I2: Prisma generate
    Write-Step "I2" "Generating Prisma client (npx prisma generate)"
    if ($DryRun) { Write-Skip "I2" "DryRun: would run prisma generate"; return }
    npx prisma generate 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Fail "I2" "prisma generate failed (exit $LASTEXITCODE)" }
    Write-Pass "I2"

    # I3: Build
    Write-Step "I3" "Building app (npm run build)"
    if ($DryRun) { Write-Skip "I3" "DryRun: would run npm run build"; return }
    npm run build 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Fail "I3" "npm run build failed (exit $LASTEXITCODE)" }
    Write-Pass "I3"
}

# ---------- Phase: SmokeTest ----------
# Starts server on SmokePort, hits /login, /api/auth/providers, /api/auth/session; then stops (zero-interrupt to main dev)
function Invoke-PhaseSmokeTest {
    Set-Location $ProjectRoot
    if (-not $DryRun -and -not (Test-Path (Join-Path $ProjectRoot ".next"))) {
        Write-Fail "S0" "No .next build found. Run -Phase Implement or -Phase Full first."
    }
    $base = "http://localhost:$SmokePort"

    # S1: Start production server in background
    Write-Step "S1" "Starting production server on port $SmokePort"
    if ($DryRun) { Write-Skip "S1" "DryRun: would start next start -p $SmokePort"; return }
    $job = Start-Job -ScriptBlock {
        param($root, $port)
        Set-Location $root
        npx next start -p $port 2>&1
    } -ArgumentList $ProjectRoot, $SmokePort
    Start-Sleep -Seconds 10
    $state = (Get-Job $job).State
    if ($state -eq "Failed") { Receive-Job $job; Write-Fail "S1" "Server failed to start" }
    Write-Pass "S1"

    try {
        # S2: /login returns 200
        Write-Step "S2" "GET /login (expect 200)"
        if (-not $DryRun) {
            $r = Invoke-WebRequest -Uri "$base/login" -UseBasicParsing -TimeoutSec 15 -ErrorAction SilentlyContinue
            if ($r.StatusCode -ne 200) { Write-Fail "S2" "Status $($r.StatusCode)" }
        } else { Write-Skip "S2" "DryRun" }
        Write-Pass "S2"

        # S3: /api/auth/providers returns 200
        Write-Step "S3" "GET /api/auth/providers (expect 200)"
        if (-not $DryRun) {
            $r = Invoke-WebRequest -Uri "$base/api/auth/providers" -UseBasicParsing -TimeoutSec 15 -ErrorAction SilentlyContinue
            if ($r.StatusCode -ne 200) { Write-Fail "S3" "Status $($r.StatusCode)" }
        } else { Write-Skip "S3" "DryRun" }
        Write-Pass "S3"

        # S4: /api/auth/session returns 200 or 401 (both acceptable when unauthenticated)
        Write-Step "S4" "GET /api/auth/session (expect 200 or 401)"
        if (-not $DryRun) {
            try {
                $r = Invoke-WebRequest -Uri "$base/api/auth/session" -UseBasicParsing -TimeoutSec 15
                if ($r.StatusCode -ne 200 -and $r.StatusCode -ne 401) { Write-Fail "S4" "Status $($r.StatusCode)" }
            } catch {
                if ($_.Exception.Response.StatusCode.value__ -ne 401) { Write-Fail "S4" $_.Exception.Message }
            }
        } else { Write-Skip "S4" "DryRun" }
        Write-Pass "S4"
    } finally {
        if ($job) { Stop-Job $job -ErrorAction SilentlyContinue; Remove-Job $job -Force -ErrorAction SilentlyContinue }
    }
}

# ---------- Main ----------
$total = 0
$fail = $null

try {
    if ($Phase -eq "Validate" -or $Phase -eq "Full") { Invoke-PhaseValidate }
    if ($Phase -eq "Implement" -or $Phase -eq "Full") { Invoke-PhaseImplement }
    if ($Phase -eq "SmokeTest" -or $Phase -eq "Full") { Invoke-PhaseSmokeTest }
} catch {
    $fail = $_
}

if ($fail) {
    Write-Host "`nRESULT: FAILED - $($fail.Message)" -ForegroundColor Red
    if ($fail.Message -match "V1|V2|V3") { exit $ExitValidate }
    if ($fail.Message -match "I1|I2|I3") { exit $ExitImplement }
    if ($fail.Message -match "S1|S2|S3|S4") { exit $ExitSmoke }
    exit 1
}

Write-Host "`nRESULT: PASSED (Phase=$Phase, DryRun=$DryRun)" -ForegroundColor Green
exit 0
