#!/bin/bash
# Deployment script for LOGISTICORE applications

set -e

ENV=${1:-"staging"}

echo "🚀 Deploying LOGISTICORE to $ENV..."

# Build all packages
echo "📦 Building packages..."
npm run build:packages

# Deploy based on environment
if [ "$ENV" = "production" ]; then
  echo "🌍 Deploying to production..."
  vercel --prod
elif [ "$ENV" = "staging" ]; then
  echo "🔬 Deploying to staging..."
  vercel
else
  echo "❌ Unknown environment: $ENV"
  exit 1
fi

echo "✅ Deployment complete!"
