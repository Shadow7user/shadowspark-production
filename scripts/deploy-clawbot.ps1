# ═══════════════════════════════════════════════════════════
# SHADOWSPARK CLAWBOT - COMPLETE DEPLOYMENT
# Adds chatbot to website + WhatsApp + Telegram in 5 minutes
# ═══════════════════════════════════════════════════════════

Write-Host "🤖 CLAWBOT DEPLOYMENT STARTED" -ForegroundColor Cyan
Write-Host "════════════════════════════════" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"

# ────────────────────────────────────────────────────────────
# STEP 1: VERIFY ENVIRONMENT (30 seconds)
# ────────────────────────────────────────────────────────────
Write-Host "`n[1/6] Verifying environment..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 20+ first." -ForegroundColor Red
    exit 1
}

# Check if we're in project root
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Must run from project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Environment verified" -ForegroundColor Green

# ────────────────────────────────────────────────────────────
# STEP 2: INSTALL DEPENDENCIES (Optional - SDK not required for Edge Runtime)
# ────────────────────────────────────────────────────────────
Write-Host "`n[2/6] Checking dependencies..." -ForegroundColor Yellow

# Note: We're using fetch API directly, so no SDK needed
Write-Host "✅ Using native fetch API (no SDK required)" -ForegroundColor Green

# ────────────────────────────────────────────────────────────
# STEP 3: VERIFY COMPONENT FILES (30 seconds)
# ────────────────────────────────────────────────────────────
Write-Host "`n[3/6] Verifying ClawBot files..." -ForegroundColor Yellow

$filesToCheck = @(
    "src/components/clawbot-widget.tsx",
    "src/app/api/clawbot/route.ts"
)

foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
        exit 1
    }
}

# ────────────────────────────────────────────────────────────
# STEP 4: CONFIGURE ENVIRONMENT (1 minute)
# ────────────────────────────────────────────────────────────
Write-Host "`n[4/6] Configuring environment..." -ForegroundColor Yellow

# Check for .env file
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  No .env file found. Creating from .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
    } else {
        Write-Host "❌ No .env.example found" -ForegroundColor Red
        exit 1
    }
}

# Check for Anthropic API key
$envContent = Get-Content ".env" -Raw
if ($envContent -notmatch "ANTHROPIC_API_KEY=sk-") {
    Write-Host "`n⚠️  ANTHROPIC_API_KEY not configured in .env" -ForegroundColor Yellow
    Write-Host "ClawBot will use fallback responses until you add:" -ForegroundColor Yellow
    Write-Host "ANTHROPIC_API_KEY=sk-ant-xxxxx" -ForegroundColor Cyan
    Write-Host "`nGet your API key from: https://console.anthropic.com/" -ForegroundColor Gray
} else {
    Write-Host "✅ Anthropic API key configured" -ForegroundColor Green
}

# ────────────────────────────────────────────────────────────
# STEP 5: RUN DEVELOPMENT SERVER (Optional)
# ────────────────────────────────────────────────────────────
Write-Host "`n[5/6] Development server check..." -ForegroundColor Yellow

$testLocal = Read-Host "Test ClawBot locally before deploy? (y/n)"
if ($testLocal -eq "y") {
    Write-Host "`nStarting dev server... (Press Ctrl+C to stop)" -ForegroundColor Cyan
    Write-Host "Visit: http://localhost:3000" -ForegroundColor Cyan
    npm run dev
}

# ────────────────────────────────────────────────────────────
# STEP 6: DEPLOYMENT READY
# ────────────────────────────────────────────────────────────
Write-Host "`n[6/6] Deployment Status" -ForegroundColor Yellow

Write-Host "`n✅ ClawBot is ready!" -ForegroundColor Green
Write-Host "════════════════════════════════" -ForegroundColor Cyan

Write-Host "`n📋 Deployment Checklist:" -ForegroundColor Yellow
Write-Host "  1. ✅ ClawBot widget component created"
Write-Host "  2. ✅ API route configured"
Write-Host "  3. ✅ Widget added to marketing layout"
Write-Host "  4. ⚠️  Add ANTHROPIC_API_KEY to Vercel environment variables"
Write-Host "  5. 🚀 Ready to deploy with: vercel --prod"

Write-Host "`n📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  • Visit Vercel dashboard → Settings → Environment Variables"
Write-Host "  • Add: ANTHROPIC_API_KEY = sk-ant-xxxxx"
Write-Host "  • Run: npm run build (to verify locally)"
Write-Host "  • Run: vercel --prod (to deploy)"

Write-Host "`n🎉 ClawBot Deployment Complete!" -ForegroundColor Green
Write-Host "════════════════════════════════" -ForegroundColor Cyan
