# ShadowSpark Platform Setup Guide

This guide will help you set up the ShadowSpark platform for development on Ubuntu or any other environment.

## Prerequisites

- Node.js 20+ and pnpm installed
- Git configured
- PostgreSQL database (Neon or local)

## Quick Start

### 1. Clone the Repository

#### Option A: Using HTTPS (Recommended for CI/CD)
```bash
git clone https://github.com/Shadow7user/shadowspark-production.git
cd shadowspark-production
```

#### Option B: Using SSH (Recommended for local development)
```bash
# First, set up SSH keys if not already done
ssh-keygen -t ed25519 -C "your-email@example.com"
cat ~/.ssh/id_ed25519.pub
# Copy the output and add it to GitHub: Settings → SSH Keys → Add

# Then clone
git clone git@github.com:Shadow7user/shadowspark-production.git
cd shadowspark-production
```

### 2. Configure Environment Variables

Copy the example environment file and update with your credentials:

```bash
cp .env.example .env
```

Edit `.env` and update the following:

#### Database Configuration (Neon)

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project or create a new one
3. Copy the connection string from the dashboard
4. **Important**: Verify the hostname carefully:
   - Check for common typos: `aglkkal` (2 k's) vs `aglkkkal` (3 k's)
   - Ensure the project is active (not suspended due to inactivity)

Update your `.env`:
```env
DATABASE_URL="postgresql://user:pass@ep-calm-glade-aglkkal.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-calm-glade-aglkkal.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

#### NextAuth Configuration

Generate a secure secret:
```bash
openssl rand -base64 32
```

Add to `.env`:
```env
NEXTAUTH_SECRET="<your-generated-secret>"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Set Up Database

Push the Prisma schema to your database:

```bash
pnpm prisma db push
```

If this fails, verify your database connection:

```bash
# Test DNS resolution
nslookup ep-calm-glade-aglkkal.c-2.eu-central-1.aws.neon.tech

# Test TCP connection
nc -zv ep-calm-glade-aglkkal.c-2.eu-central-1.aws.neon.tech 5432 -w 5
```

### 5. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Troubleshooting

### Neon Database Connection Issues

**Problem**: Connection timeout or "host not found"

**Solutions**:
1. **Check if project is suspended**: Free tier projects sleep after inactivity. Visit the Neon console and wake up your project.
2. **Verify hostname**: Double-check the connection string for typos, especially the project ID.
3. **Test connectivity**:
   ```bash
   # DNS resolution
   nslookup ep-calm-glade-aglkkal.c-2.eu-central-1.aws.neon.tech
   
   # TCP connection
   nc -zv ep-calm-glade-aglkkal.c-2.eu-central-1.aws.neon.tech 5432 -w 5
   ```
4. **Try pooler endpoint**: For some operations, use the pooled connection:
   ```
   ep-calm-glade-aglkkal-pooler.c-2.eu-central-1.aws.neon.tech
   ```

**Problem**: Prisma connection fails even when DNS/TCP tests pass

This usually indicates an **authentication issue** (wrong password or database doesn't exist), not a network problem.

**Solution**: Test the actual database connection with `psql`:

```bash
# Install PostgreSQL client if not already installed
sudo apt install postgresql-client -y

# Test direct connection (replace with your actual credentials)
psql "postgresql://neondb_owner:YOUR_PASSWORD@ep-calm-glade-aglkkal.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

**Possible outcomes**:
- ✅ **If it connects**: Prisma config issue, not credentials. Check your `.env` file format.
- ❌ **If `password authentication failed`**: Password may have changed or rotated. Get fresh credentials from Neon dashboard (see below).
- ❌ **If `database "neondb" does not exist`**: Database was renamed or deleted. Check database name in Neon console.

**Getting Fresh Credentials from Neon**:

If password authentication fails, get updated credentials:

1. Open browser: https://console.neon.tech
2. Click your project (e.g., shadowspark-production)
3. Go to "Connection Details" or "Dashboard"
4. Click the eye icon (👁️) to reveal the password
5. Copy the **FULL pooled connection string** (for DATABASE_URL)
6. Copy the **FULL direct connection string** (for DIRECT_URL)

Update your `.env` file:
```bash
# Update with fresh credentials
nano .env
# Replace DATABASE_URL and DIRECT_URL with the new strings

# Test immediately
psql "YOUR_FRESH_POOLED_URL_HERE" -c "SELECT 1 AS connected;"
```

Once `psql` connects successfully, try Prisma again:
```bash
npx prisma db push
```

### GitHub SSH Access

**Problem**: Permission denied (publickey)

**Solution**: Set up SSH keys:
```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Display public key
cat ~/.ssh/id_ed25519.pub

# Copy and add to GitHub: Settings → SSH and GPG keys → New SSH key
```

Test SSH connection:
```bash
ssh -T git@github.com
# Should see: "Hi username! You've successfully authenticated..."
```

### GitHub CLI Not Authenticated

**Problem**: `gh` commands fail with authentication error

**Solution**:

#### Option 1: Install from apt (if available)
```bash
sudo apt update
sudo apt install gh -y
```

#### Option 2: Install from official source (if apt fails)
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

#### Authenticate
```bash
gh auth login
# Select: GitHub.com → SSH → Yes → Login with browser
```

#### Verify
```bash
gh auth status
```

## GitHub Enterprise Features

If you have access to GitHub Enterprise, leverage these features:

1. **GitHub Actions**: Set up CI/CD pipelines in `.github/workflows/`
2. **Code Scanning**: Enable CodeQL for automatic security analysis
3. **Protected Branches**: Enforce code review on `main` branch
4. **Environments**: Configure staging and production deployment targets
5. **GitHub Copilot**: Already available if enabled on your account

Check your plan:
```bash
gh auth status
gh api /user | grep -i plan
```

## Development Workflow

### Setting Up Multiple Clones (Optional)

If you want to clone the repository to a different location for local development:

```bash
# Create project directory
mkdir -p ~/shadowspark/projects
cd ~/shadowspark/projects

# Clone the production repo
git clone git@github.com:Shadow7user/shadowspark-production.git shadowspark-platform

# Verify
cd shadowspark-platform
ls -la
git log --oneline -5
git status
```

### Standard Development Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test locally:
   ```bash
   pnpm dev
   ```

3. Run linting:
   ```bash
   pnpm lint
   ```

4. Build to verify:
   ```bash
   pnpm build
   ```

5. Commit and push:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request on GitHub

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Neon Documentation](https://neon.tech/docs)
- [GitHub CLI Documentation](https://cli.github.com/manual/)

## Support

For issues or questions:
- Open an issue on GitHub
- Contact: architect@shadowspark-technologies.com
