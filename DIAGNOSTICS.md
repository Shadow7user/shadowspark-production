# Diagnostic Commands Quick Reference

This document provides quick diagnostic commands to troubleshoot common issues.

## Database Connectivity (Neon)

### Test DNS Resolution
```bash
nslookup ep-calm-glade-aglkkal.c-2.eu-central-1.aws.neon.tech
```

Expected: Should resolve to multiple IP addresses

### Test TCP Connection
```bash
nc -zv ep-calm-glade-aglkkal.c-2.eu-central-1.aws.neon.tech 5432 -w 5
```

Expected: "Connection succeeded"

### Test Pooler Connection (Alternative)
```bash
nc -zv ep-calm-glade-aglkkal-pooler.c-2.eu-central-1.aws.neon.tech 5432 -w 5
```

### Test Database Authentication with psql

If DNS and TCP tests pass but Prisma fails, the issue is likely authentication:

```bash
# Install PostgreSQL client
sudo apt install postgresql-client -y

# Test actual database connection (replace with your credentials)
psql "postgresql://neondb_owner:YOUR_PASSWORD@ep-calm-glade-aglkkal.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

**Possible outcomes:**
- ✅ Connects successfully → Prisma config issue, check `.env` format
- ❌ `password authentication failed` → Get fresh password from Neon dashboard
- ❌ `database "neondb" does not exist` → Check database name in Neon console

### Test Database Connection via Prisma
```bash
# Set up environment first
cp .env.example .env
# Edit .env with your credentials

# Test connection
pnpm prisma db push --preview-feature
```

## GitHub Connectivity

### Test HTTPS Access
```bash
git ls-remote https://github.com/Shadow7user/shadowspark-production.git | head -3
```

Expected: Should list refs/heads

### Test SSH Access
```bash
ssh -T git@github.com
```

Expected: "Hi [username]! You've successfully authenticated..."

### Check SSH Keys
```bash
ls -la ~/.ssh/
cat ~/.ssh/id_ed25519.pub
```

### Generate New SSH Key
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
cat ~/.ssh/id_ed25519.pub
# Copy output and add to GitHub: Settings → SSH Keys
```

## GitHub CLI

### Check gh Installation
```bash
which gh
gh --version
```

### Install GitHub CLI

#### Option 1: From apt
```bash
sudo apt update
sudo apt install gh -y
```

#### Option 2: Official installation (if apt fails)
```bash
(type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)) \
  && sudo mkdir -p -m 755 /etc/apt/keyrings \
  && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  && cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
  && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && sudo apt update \
  && sudo apt install gh -y
```

### Check Authentication Status
```bash
gh auth status
```

### Login to GitHub
```bash
gh auth login
# Select: GitHub.com → SSH → Yes → Login with browser
```

### Check User Plan
```bash
gh api /user | jq '.plan'
```

### List Workflows
```bash
gh workflow list
```

### View Recent Workflow Runs
```bash
gh run list --limit 5
```

### View Specific Run
```bash
gh run view <run-id>
```

## Environment Setup

### Check Environment Variables
```bash
# Show (masked) environment variables
grep -v "^#" .env | grep -v "^$" | sed 's/=.*/=***/'
```

### Verify Required Variables
```bash
# Check if all required variables are set
cat .env | grep -E "DATABASE_URL|NEXTAUTH_SECRET" | grep -v "username:password" | grep -v "your-super-secret"
```

### Generate NextAuth Secret
```bash
openssl rand -base64 32
```

## Project Health

### Check Git Status
```bash
git status
git log --oneline -5
```

### Check Dependencies
```bash
pnpm list --depth=0
```

### Check for Vulnerabilities
```bash
pnpm audit
```

### Check Node/pnpm Versions
```bash
node -v
pnpm -v
```

## Application Testing

### Test Build
```bash
pnpm build
```

### Test Linting
```bash
pnpm lint
```

### Test Type Checking
```bash
pnpm exec tsc --noEmit
```

### Start Development Server
```bash
pnpm dev
```

### Check Port Usage
```bash
lsof -i :3000
```

## Comprehensive Diagnostic Script

Run all diagnostics at once:

```bash
#!/bin/bash
echo "=== ShadowSpark Platform Diagnostics ==="
echo ""

echo "1. Node/pnpm versions:"
node -v
pnpm -v
echo ""

echo "2. Neon Database:"
nslookup ep-calm-glade-aglkkal.c-2.eu-central-1.aws.neon.tech 2>&1 | grep "Name:" | head -1
nc -zv ep-calm-glade-aglkkal.c-2.eu-central-1.aws.neon.tech 5432 -w 5 2>&1 | tail -1
echo ""

echo "3. GitHub Access:"
git ls-remote https://github.com/Shadow7user/shadowspark-production.git 2>&1 | head -1
ssh -T git@github.com 2>&1 | head -1
echo ""

echo "4. GitHub CLI:"
which gh && gh auth status 2>&1 | head -3 || echo "gh not installed"
echo ""

echo "5. Environment:"
test -f .env && echo "✓ .env exists" || echo "✗ .env missing"
test -f .env.example && echo "✓ .env.example exists" || echo "✗ .env.example missing"
echo ""

echo "6. Git Status:"
git status -s
echo ""

echo "7. Dependencies:"
test -d node_modules && echo "✓ node_modules exists" || echo "✗ node_modules missing - run pnpm install"
echo ""

echo "=== Diagnostics Complete ==="
```

Save as `diagnostics.sh`, make executable with `chmod +x diagnostics.sh`, and run with `./diagnostics.sh`.

## Common Issues and Solutions

### Issue: "Cannot connect to database"
**Solution**:
1. Check if Neon project is active (not suspended)
2. Verify DATABASE_URL in .env
3. Run: `nc -zv <your-neon-host> 5432 -w 5`

### Issue: "Permission denied (publickey)"
**Solution**:
1. Generate SSH key: `ssh-keygen -t ed25519`
2. Add to GitHub: Copy `~/.ssh/id_ed25519.pub` to Settings → SSH Keys

### Issue: "gh not authenticated"
**Solution**:
```bash
gh auth login
# Follow prompts
```

### Issue: "Module not found"
**Solution**:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: "Port 3000 already in use"
**Solution**:
```bash
lsof -ti:3000 | xargs kill -9
# Or use different port: PORT=3001 pnpm dev
```

## Quick Links

- [Neon Console](https://console.neon.tech)
- [GitHub Settings](https://github.com/settings/profile)
- [GitHub SSH Keys](https://github.com/settings/keys)
- [Repository](https://github.com/Shadow7user/shadowspark-production)
- [Setup Guide](./SETUP.md)
- [GitHub Enterprise Guide](./GITHUB_ENTERPRISE.md)
