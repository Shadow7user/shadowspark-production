#!/bin/bash
set -e # Exit immediately on error

echo "🤖 [FORGE-AUTO] STARTING ZERO-TOUCH SCAFFOLDING..."

# CONFIGURATION
PROJECT_NAME="nexusbank-us"
REPO_URL="https://github.com/Shadow7user/nexusbank-us.git"

# 1. CLEANUP (Ensure fresh start)
if [ -d "$PROJECT_NAME" ]; then
  echo "⚠️  Removing old directory..."
  rm -rf "$PROJECT_NAME"
fi

# 2. NEXT.JS INITIALIZATION (The "Perfect" Flags)
# Sources: Next.js CLI Documentation for CI/CD
echo "⚡ Generating Next.js Core..."
npx create-next-app@latest "$PROJECT_NAME" \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm \
  --no-git \
  --yes \
  --no-turbopack 

cd "$PROJECT_NAME"

# 3. SHADCN-UI PRE-CONFIGURATION (Bypass the Wizard)
# We write the config FIRST so 'shadcn init' sees it and shuts up.
echo "🎨 Pre-configuring Design System..."
cat << 'JSON' > components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
JSON

# 4. INSTALL UI DEPENDENCIES (Silent Mode)
echo "📦 Installing Dependencies..."
pnpm add lucide-react class-variance-authority clsx tailwind-merge animate.css
# Force initialization using the config we just made
npx shadcn@latest init --yes

# 5. GIT AUTOMATION (Force Push)
echo "🚀 Pushing to GitHub..."
git init
git branch -M main
git remote add origin "$REPO_URL"
git add .
git commit -m "feat: complete zero-touch scaffold execution"
# Attempt push (will fail gracefully if auth is missing, but won't hang)
git push -u origin main --force || echo "⚠️  Git Push skipped (Auth required). Code is ready locally."

echo "✅ [FORGE-AUTO] MISSION COMPLETE. Project ready in ./$PROJECT_NAME"
