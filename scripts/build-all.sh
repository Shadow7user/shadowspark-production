#!/bin/bash
# Build all packages and applications in the monorepo

set -e

echo "🏗️  Building LOGISTICORE Monorepo..."

# Build shared packages first
echo "📦 Building shared packages..."
npm run build:data-models
npm run build:sim-engine

# Build applications
echo "🌐 Building applications..."
npm run build:web
# npm run build:api  # Uncomment when ready
# npm run build:admin  # Uncomment when ready

echo "✅ Build complete!"
