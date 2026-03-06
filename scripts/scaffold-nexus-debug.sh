#!/bin/bash
set -ex

echo "

[DEBUG] SCRIPT START"
pwd


# Setup
rm -rf temp-nexus
mkdir temp-nexus
cd temp-nexus

echo "

[DEBUG] AFTER CD-ING INTO TEMP-NEXUS:"
pwd
ls -la

# Create Next App
echo "

[DEBUG] BEFORE NEXT APP CREATE:"
pnpm create next-app . -- --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git < /dev/null

echo "

[DEBUG] AFTER NEXT APP CREATE:"
pwd
ls -la

# Install Libs
echo "

[DEBUG] BEFORE PNPM ADD:"
pnpm add lucide-react class-variance-authority clsx tailwind-merge

echo "

[DEBUG] AFTER PNPM ADD:"
pwd
ls -la

# ShadCN
pnpm dlx shadcn-ui@latest init -y -d

echo "

[DEBUG] AFTER SHADCN:"
pwd
ls -la

cd ..
echo "

[DEBUG] SCRIPT END"
pwd
