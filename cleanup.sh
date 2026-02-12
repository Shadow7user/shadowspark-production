#!/bin/bash
echo "🧹 Cleaning up ShadowSpark processes..."

# Kill all Next.js processes
pkill -f "next dev"
echo "✅ Stopped Next.js servers"

# Kill all Prisma Studio processes  
pkill -f "prisma studio"
echo "✅ Stopped Prisma Studio"

# Show remaining processes
echo ""
echo "📊 Remaining Node processes:"
ps aux | grep node | grep -v grep || echo "None running ✅"

echo ""
echo "✨ Cleanup complete! Ready for fresh start."
