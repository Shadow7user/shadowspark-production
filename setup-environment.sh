#!/bin/bash

echo "🚀 ShadowSpark Platform Setup Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running from project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo "Step 1: Checking prerequisites..."
echo "---------------------------------"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js 20+"
    exit 1
fi

# Check pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    echo -e "${GREEN}✓${NC} pnpm installed: $PNPM_VERSION"
else
    echo -e "${YELLOW}⚠${NC} pnpm not found. Installing..."
    npm install -g pnpm
fi

# Check Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓${NC} Git installed: $GIT_VERSION"
else
    echo -e "${RED}✗${NC} Git not found. Please install Git"
    exit 1
fi

echo ""
echo "Step 2: Setting up environment file..."
echo "---------------------------------------"

# Check if .env exists
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC} .env file already exists. Skipping..."
else
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓${NC} Created .env from .env.example"
        echo -e "${YELLOW}⚠${NC} IMPORTANT: Edit .env with your actual credentials!"
        echo ""
        echo "  Required values to update:"
        echo "  - DATABASE_URL (get from Neon console)"
        echo "  - DIRECT_URL (get from Neon console)"
        echo "  - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
        echo ""
    else
        echo -e "${RED}✗${NC} .env.example not found"
        exit 1
    fi
fi

echo ""
echo "Step 3: Testing database connectivity..."
echo "----------------------------------------"

# Extract hostname from DATABASE_URL in .env
if [ -f ".env" ]; then
    DB_HOST=$(grep DATABASE_URL .env | cut -d'@' -f2 | cut -d'/' -f1 | cut -d':' -f1)
    
    if [ -n "$DB_HOST" ] && [ "$DB_HOST" != "username" ]; then
        echo "Testing connection to: $DB_HOST"
        
        # Test DNS resolution
        if nslookup "$DB_HOST" > /dev/null 2>&1; then
            echo -e "${GREEN}✓${NC} DNS resolution successful"
            
            # Test TCP connection
            if nc -zv "$DB_HOST" 5432 -w 5 > /dev/null 2>&1; then
                echo -e "${GREEN}✓${NC} TCP connection successful (port 5432)"
            else
                echo -e "${YELLOW}⚠${NC} TCP connection failed. Database may be suspended or credentials incorrect."
            fi
        else
            echo -e "${YELLOW}⚠${NC} DNS resolution failed. Check hostname in .env"
        fi
    else
        echo -e "${YELLOW}⚠${NC} DATABASE_URL not configured yet. Skipping connectivity test."
    fi
fi

echo ""
echo "Step 4: Installing dependencies..."
echo "-----------------------------------"

pnpm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed successfully"
else
    echo -e "${RED}✗${NC} Failed to install dependencies"
    exit 1
fi

echo ""
echo "Step 5: Testing GitHub connectivity..."
echo "---------------------------------------"

# Test HTTPS access
if git ls-remote https://github.com/Shadow7user/shadowspark-production.git > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} GitHub HTTPS access working"
else
    echo -e "${YELLOW}⚠${NC} GitHub HTTPS access failed"
fi

# Test SSH access
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo -e "${GREEN}✓${NC} GitHub SSH access working"
else
    echo -e "${YELLOW}⚠${NC} GitHub SSH not configured (optional for CI/CD)"
    echo "  To set up SSH:"
    echo "  1. ssh-keygen -t ed25519 -C \"your-email@example.com\""
    echo "  2. cat ~/.ssh/id_ed25519.pub"
    echo "  3. Add to GitHub: Settings → SSH Keys"
fi

# Check gh CLI
if command -v gh &> /dev/null; then
    if gh auth status > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} GitHub CLI authenticated"
    else
        echo -e "${YELLOW}⚠${NC} GitHub CLI not authenticated (optional)"
        echo "  Run: gh auth login"
    fi
else
    echo -e "${YELLOW}⚠${NC} GitHub CLI not installed (optional)"
    echo "  Install with: sudo apt install gh -y"
fi

echo ""
echo "======================================"
echo "Setup Summary"
echo "======================================"
echo ""

if [ -f ".env" ]; then
    DB_CONFIGURED=$(grep -v "^#" .env | grep DATABASE_URL | grep -v "username:password" | wc -l)
    AUTH_CONFIGURED=$(grep -v "^#" .env | grep NEXTAUTH_SECRET | grep -v "your-super-secret" | wc -l)
    
    if [ "$DB_CONFIGURED" -eq "0" ]; then
        echo -e "${YELLOW}⚠ ACTION REQUIRED:${NC} Configure DATABASE_URL in .env"
    else
        echo -e "${GREEN}✓${NC} Database configured"
    fi
    
    if [ "$AUTH_CONFIGURED" -eq "0" ]; then
        echo -e "${YELLOW}⚠ ACTION REQUIRED:${NC} Generate and set NEXTAUTH_SECRET in .env"
        echo "  Run: openssl rand -base64 32"
    else
        echo -e "${GREEN}✓${NC} NextAuth configured"
    fi
fi

echo ""
echo "Next Steps:"
echo "1. Edit .env with your Neon database credentials"
echo "2. Generate NextAuth secret: openssl rand -base64 32"
echo "3. Run: pnpm prisma db push"
echo "4. Run: pnpm dev"
echo "5. Visit: http://localhost:3000"
echo ""
echo "For detailed setup instructions, see SETUP.md"
echo ""
