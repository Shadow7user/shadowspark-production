#!/bin/bash
set -e
echo "🏦 SCAFFOLDING NEXUS BANK (US PROTOTYPE)..."

# 1. Install pnpm using its standalone installer
echo "📦 Ensuring pnpm is available..."
curl -fsSL https://get.pnpm.io/install.sh | sh -
export PATH="$HOME/.local/share/pnpm:$PATH"

# 2. Setup Temp Directory
rm -rf temp-nexus
mkdir temp-nexus
cd temp-nexus

# 3. Initialize Next.js, piping a newline to accept the default "No" for the compiler prompt.
echo "⚡ Initializing Next.js using pnpm..."
printf '\n' | pnpm create next-app . -- --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git

# 4. Install Core UI Libs
echo "🎨 Installing Shadcn & Lucide..."
pnpm add lucide-react class-variance-authority clsx tailwind-merge
pnpm dlx shadcn-ui@latest init -y -d

echo "✅ NEXUS BANK SCAFFOLDED."
cd ..
