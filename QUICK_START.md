# ⚡ Quick Start Guide - Next Steps

## 🎯 Where You Are Right Now

You have completed:
- ✅ Project planning and architecture design
- ✅ Database schema designed (15 tables)
- ✅ Environment configuration strategy
- ✅ Tech stack finalized

You are ready to:
- ⏳ Create your Next.js project on your EliteBook
- ⏳ Setup Neon PostgreSQL database
- ⏳ Initialize Prisma and push the schema

---

## 📋 Immediate Actions (Next 2 Hours)

### Step 1: Create Neon Account (15 minutes)
```
1. Open browser: https://console.neon.tech
2. Click "Sign Up" → Use GitHub OAuth
3. Create project: "shadowspark-production"
4. Region: "AWS Europe (Frankfurt)" (closest to Nigeria)
5. Copy BOTH connection strings:
   - Pooled connection (DATABASE_URL)
   - Direct connection (DIRECT_URL)
6. Save in password manager or secure note
```

**Why Frankfurt?** ~200ms latency to Lagos (vs 300ms+ for other regions)

---

### Step 2: Create Next.js Project (20 minutes)

Open **Cursor IDE** on your EliteBook and run:

```bash
# Navigate to your projects folder
cd C:\Users\Administrator\Documents
mkdir Projects
cd Projects

# Create Next.js app with all optimizations
npx create-next-app@latest shadowspark-platform --typescript --tailwind --app --src-dir --import-alias "@/*"

# Navigate into project
cd shadowspark-platform

# Open in Cursor
cursor .
```

**What to select during setup:**
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- `src/` directory: **Yes**
- App Router: **Yes**
- Import alias: **Yes** (use default `@/*`)

---

### Step 3: Install Dependencies (10 minutes)

In Cursor's integrated terminal:

```bash
# Core dependencies
npm install @prisma/client next-auth@beta @auth/prisma-adapter bcryptjs zod class-variance-authority clsx tailwind-merge

# Dev dependencies
npm install -D prisma @types/bcryptjs prettier prettier-plugin-tailwindcss
```

**Memory check:** This will use ~300MB RAM during installation, then drop to ~50MB.

---

### Step 4: Initialize Prisma (10 minutes)

```bash
# Initialize Prisma (creates prisma folder)
npx prisma init

# Rename .env to .env.local (Next.js convention)
# Windows Command Prompt:
ren .env .env.local

# OR if you're using Git Bash / PowerShell:
mv .env .env.local
```

---

### Step 5: Setup Environment Variables (15 minutes)

**5.1 Open `.env.local` in Cursor**

**5.2 Replace contents with:**

```env
# Database (Neon PostgreSQL)
DATABASE_URL="paste-your-pooled-connection-from-neon-here"
DIRECT_URL="paste-your-direct-connection-from-neon-here"

# Example format:
# DATABASE_URL="postgresql://shadowspark_owner:abc123@ep-cool-forest-12345.eu-central-1.aws.neon.tech/shadowspark_db?sslmode=require&pgbouncer=true"
# DIRECT_URL="postgresql://shadowspark_owner:abc123@ep-cool-forest-12345.eu-central-1.aws.neon.tech/shadowspark_db?sslmode=require"

# NextAuth.js (generate secret below)
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

**5.3 Generate NEXTAUTH_SECRET:**

Open **Git Bash** (comes with Git for Windows) and run:
```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` value.

**Alternative (if openssl not available):**
Visit: https://generate-secret.vercel.app/32
Copy the generated secret.

---

### Step 6: Setup Prisma Schema (15 minutes)

**6.1 Navigate to `prisma/schema.prisma` in Cursor**

**6.2 Delete all default content**

**6.3 Copy the complete schema from:**
`shadowspark-foundation/config/schema.prisma` (from this package)

**6.4 Save the file** (Ctrl+S)

---

### Step 7: Push Schema to Database (10 minutes)

```bash
# Generate Prisma Client (creates TypeScript types)
npx prisma generate

# Push schema to Neon (creates all 15 tables)
npx prisma db push
```

**Expected output:**
```
🚀 Your database is now in sync with your Prisma schema.
✔ Generated Prisma Client (5.x.x)
```

---

### Step 8: Verify Setup (15 minutes)

**8.1 Create database client file:**

Create `src/lib/db.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**8.2 Open Prisma Studio:**

```bash
npx prisma studio
```

Browser opens at `http://localhost:5555`

**You should see 15 tables:**
- users, accounts, sessions, verification_tokens
- courses, modules, lessons, enrollments
- projects, milestones
- payments
- blog_posts

**8.3 Close Prisma Studio** (free up RAM)

---

### Step 9: Start Development Server (5 minutes)

```bash
npm run dev
```

Open browser: `http://localhost:3000`

You should see the default Next.js welcome page.

---

## ✅ Setup Complete Checklist

Before moving to Phase 2, confirm:

- [ ] Neon database created and accessible
- [ ] Next.js project running on `localhost:3000`
- [ ] Prisma Studio shows all 15 tables
- [ ] `.env.local` has all 3 environment variables
- [ ] No errors in terminal when running `npm run dev`
- [ ] Task Manager shows <3GB RAM usage total

---

## 📊 Expected RAM Usage (Task Manager Check)

```
Node.js (npm run dev):    ~400MB
Cursor IDE:               ~800MB
Chrome (1 tab):           ~300MB
Windows 11 System:        ~2GB
═══════════════════════════════
Total:                    ~3.5GB / 8GB ✅
```

You still have 4.5GB free for other apps.

---

## 🚨 Common Issues & Solutions

### Issue: "Can't reach database server"
**Solution:** 
1. Check `DATABASE_URL` in `.env.local` (no typos, no extra spaces)
2. Verify Neon project is active (go to Neon dashboard)
3. Ensure internet connection is stable

### Issue: "Module not found: @prisma/client"
**Solution:**
```bash
npm install @prisma/client
npx prisma generate
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Kill existing process (Windows)
netstat -ano | findstr :3000
taskkill /PID [process-id] /F

# Or use different port
npm run dev -- -p 3001
```

### Issue: Prisma Studio won't open
**Solution:**
```bash
# Ensure port 5555 is free
netstat -ano | findstr :5555

# If blocked, use different port
npx prisma studio --port 5556
```

---

## 🎯 What's Next? (After Setup Complete)

### Phase 2: Authentication System (Week 1, Days 3-5)

**You will build:**
1. Login page (`/login`)
2. Register page (`/register`)
3. NextAuth.js configuration
4. Protected routes middleware
5. User session management

**Files you'll create:**
- `src/lib/auth.ts` (NextAuth config)
- `src/app/api/auth/[...nextauth]/route.ts` (Auth API)
- `src/app/(auth)/login/page.tsx` (Login UI)
- `src/app/(auth)/register/page.tsx` (Register UI)
- `src/middleware.ts` (Route protection)

**Estimated time:** 6-8 hours of focused work

---

## 📞 Support

If you get stuck during setup:

1. **Check the detailed guide:** `docs/SETUP_GUIDE.md`
2. **Review error messages** carefully (copy-paste to troubleshoot)
3. **Verify environment variables** (most common issue)
4. **Check Node.js version:** `node -v` (should be 20.x)

---

## 🎉 Ready to Build!

Once you complete these 9 steps, you have:
- ✅ Production-ready development environment
- ✅ Cloud database with 15 tables
- ✅ Type-safe Prisma Client
- ✅ Next.js 15 with App Router
- ✅ Foundation for authentication system

**Time to start coding! 🚀**

---

**Next Document to Open:** `docs/PHASE_2_AUTHENTICATION.md` (will be created after you confirm setup complete)
