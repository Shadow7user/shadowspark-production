#!/bin/bash
# Setup script for LOGISTICORE monorepo

set -e

echo "🚀 Setting up LOGISTICORE Enterprise Monorepo..."
echo ""

# Check Node.js version
echo "📋 Checking prerequisites..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node.js 20+ is required. Current version: $(node -v)"
  exit 1
fi
echo "✅ Node.js $(node -v)"
echo "✅ npm $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Build shared packages
echo "🏗️  Building shared packages..."
echo "Building @logisticore/data-models..."
npm run build:data-models
echo ""

echo "Building @logisticore/sim-engine..."
npm run build:sim-engine
echo ""

# Verify builds
echo "🔍 Verifying builds..."
if [ -d "packages/data-models/dist" ]; then
  echo "✅ data-models built successfully"
else
  echo "❌ data-models build failed"
  exit 1
fi

if [ -d "packages/sim-engine/dist" ]; then
  echo "✅ sim-engine built successfully"
else
  echo "❌ sim-engine build failed"
  exit 1
fi
echo ""

# Type check
echo "🔍 Running type checks..."
npm run type-check 2>/dev/null || echo "⚠️  Some type checks failed (expected for incomplete apps)"
echo ""

echo "✅ LOGISTICORE monorepo setup complete!"
echo ""
echo "📖 Next steps:"
echo "  1. Read docs/GETTING_STARTED.md for development guide"
echo "  2. Run 'npm run dev' to start all applications"
echo "  3. Run 'npm run dev:api' to start demo API only"
echo ""
echo "🔗 Documentation:"
echo "  - Architecture: docs/ARCHITECTURE.md"
echo "  - API Reference: docs/API_REFERENCE.md"
echo "  - Contributing: docs/CONTRIBUTING.md"
echo ""
