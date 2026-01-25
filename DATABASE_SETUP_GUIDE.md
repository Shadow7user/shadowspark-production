# 🗄️ ShadowSpark Database Setup Guide
## Phase 1: Neon PostgreSQL + Prisma Configuration

---

## 📋 Prerequisites Checklist

Before proceeding, ensure you have:
- [x] Node.js 20 LTS installed (run `node -v` to verify)
- [x] Git for Windows installed
- [x] Cursor IDE open
- [x] 8GB RAM EliteBook ready
- [ ] Neon account created (we'll do this now)

---

## 🚀 Step 1: Create Neon Account & Database

### 1.1 Sign Up for Neon
```
1. Visit: https://console.neon.tech
2. Click "Sign Up" → Choose "Continue with GitHub" (recommended)
3. Authorize Neon to access your GitHub account
```

### 1.2 Create Your First Project
```
1. Project name: "shadowspark-production"
2. Region: Choose closest to Nigeria:
   - Recommended: "AWS Europe (Frankfurt)" - eu-central-1
   - Alternative: "AWS US East (N. Virginia)" - us-east-1
3. Postgres version: 16 (latest)
4. Click "Create Project"
```

### 1.3 Get Connection Strings
After project creation, you'll see the connection details:

```
📋 Copy BOTH connection strings:

1. POOLED CONNECTION (for app queries):
   postgresql://shadowspark_owner:AbCd1234@ep-cool-forest-12345.eu-central-1.aws.neon.tech/shadowspark_db?sslmode=require&pgbouncer=true

2. DIRECT CONNECTION (for migrations):
   postgresql://shadowspark_owner:AbCd1234@ep-cool-forest-12345.eu-central-1.aws.neon.tech/shadowspark_db?sslmode=require
```

**Security Tip:** Immediately save these in a password manager (Bitwarden/1Password).

---

## 💻 Step 2: Initialize Next.js Project (Cursor IDE)

### 2.1 Open Cursor Terminal
```bash
# Navigate to your development directory
cd C:\Users\Administrator\Documents\Projects

# Create Next.js project with optimal settings
npx create-next-app@latest shadowspark-platform --typescript --tailwind --app --src-dir --import-alias "@/*"

# Navigate into project
cd shadowspark-platform
```

**What just happened?**
- `--typescript`: Strict type safety (no `any` types allowed)
- `--tailwind`: Tailwind CSS pre-configured
- `--app`: Next.js 15 App Router (vs old Pages Router)
- `--src-dir`: Organizes code in `/src` folder
- `--import-alias`: Use `@/components` instead of `../../components`

### 2.2 Open in Cursor
```bash
# Open the project in Cursor
cursor .
```

---

## 🗄️ Step 3: Install Prisma & Dependencies

### 3.1 Install Core Dependencies
```bash
# Prisma ORM
npm install @prisma/client
npm install -D prisma

# Authentication
npm install next-auth@beta @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs

# Validation
npm install zod

# Utilities
npm install class-variance-authority clsx tailwind-merge
```

**Why these packages?**
- `@prisma/client`: Database queries (type-safe)
- `next-auth@beta`: NextAuth.js v5 (latest with App Router support)
- `zod`: Runtime validation (prevents bad data)
- `bcryptjs`: Password hashing

### 3.2 Initialize Prisma
```bash
# Create Prisma folder structure
npx prisma init
```

This creates:
- `prisma/schema.prisma` (we'll replace this with our custom schema)
- `.env` file (we'll rename to `.env.local`)

---

## 🔧 Step 4: Configure Environment Variables

### 4.1 Rename and Secure .env File
```bash
# Rename .env to .env.local (Next.js convention)
# Windows Command Prompt:
ren .env .env.local
```

### 4.2 Add Database Connection Strings
Open `.env.local` in Cursor and add your Neon credentials:

```env
# Copy the pooled connection from Neon dashboard
DATABASE_URL="postgresql://shadowspark_owner:YOUR_PASSWORD@ep-XXXX.eu-central-1.aws.neon.tech/shadowspark_db?sslmode=require&pgbouncer=true"

# Copy the direct connection from Neon dashboard
DIRECT_URL="postgresql://shadowspark_owner:YOUR_PASSWORD@ep-XXXX.eu-central-1.aws.neon.tech/shadowspark_db?sslmode=require"

# Generate a secret for NextAuth (run this command in Git Bash):
# openssl rand -base64 32
NEXTAUTH_SECRET="paste-generated-secret-here"

NEXTAUTH_URL="http://localhost:3000"
```

### 4.3 Verify .gitignore
Ensure `.env.local` is NOT committed to Git:

Open `.gitignore` and confirm these lines exist:
```
.env*.local
.env
```

---

## 📄 Step 5: Replace Prisma Schema

### 5.1 Replace Default Schema
Delete the auto-generated `prisma/schema.prisma` and replace with our enterprise schema:

**In Cursor:**
1. Navigate to `prisma/schema.prisma`
2. Delete all contents (Ctrl+A, Delete)
3. Copy the entire schema from `/home/claude/prisma/schema.prisma` (provided earlier)
4. Paste and save (Ctrl+S)

---

## 🚀 Step 6: Run Database Migrations

### 6.1 Generate Prisma Client
```bash
# Generate TypeScript types from schema
npx prisma generate
```

**What this does:**
- Creates `node_modules/@prisma/client` with type-safe functions
- Generates TypeScript types for all models
- Enables autocomplete in Cursor

### 6.2 Push Schema to Neon Database
```bash
# Apply schema to database (creates tables)
npx prisma db push
```

**Expected Output:**
```
✔ Generated Prisma Client (5.x.x) to ./node_modules/@prisma/client
🚀  Your database is now in sync with your Prisma schema.
```

**Performance Note:** This command uses `DIRECT_URL` to modify the database structure.

### 6.3 Open Prisma Studio (Visual Database Explorer)
```bash
# Launch Prisma Studio (optional - uses ~150MB RAM)
npx prisma studio
```

Opens browser at `http://localhost:5555` showing your empty database tables.

**EliteBook Tip:** Close Prisma Studio after use to free RAM.

---

## 🔍 Step 7: Verify Setup

### 7.1 Test Database Connection
Create `src/lib/db.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma Client (prevents multiple instances)
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

**Why this pattern?**
- Prevents "Too many connections" errors in development (hot reload creates new clients)
- Logs SQL queries in dev mode (helps with debugging)

### 7.2 Test Query (Optional)
Create `src/app/api/test-db/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Test query: Count users
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      userCount,
      message: 'Database connection successful!',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
```

**Test it:**
```bash
# Start development server
npm run dev

# Open browser: http://localhost:3000/api/test-db
# Expected: {"success":true,"userCount":0,"message":"Database connection successful!"}
```

---

## 🎯 Step 8: Create Database Seed Script (Optional)

### 8.1 Create Seed File
Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@2025!', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'architect@shadowspark-technologies.com' },
    update: {},
    create: {
      email: 'architect@shadowspark-technologies.com',
      name: 'ShadowSpark Admin',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample course
  const course = await prisma.course.create({
    data: {
      slug: 'ai-prompting-101',
      title: 'AI Prompting Mastery 101',
      description: 'Master ChatGPT, Midjourney, and Claude AI for business automation.',
      category: 'AI_PROMPTING',
      level: 'BEGINNER',
      price: 15000,
      thumbnail: 'https://placeholder.com/course-thumb.jpg',
      published: true,
      modules: {
        create: [
          {
            title: 'Introduction to AI',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'What is AI?',
                  order: 1,
                  duration: 10,
                  isFree: true,
                  content: 'Welcome to AI Prompting 101...',
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Sample course created:', course.title);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 8.2 Configure Seed Script
Add to `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Install ts-node:
```bash
npm install -D ts-node
```

### 8.3 Run Seed
```bash
npx prisma db seed
```

---

## ✅ Setup Complete!

### What You've Accomplished:
1. ✅ Neon PostgreSQL database created (cloud-hosted)
2. ✅ Prisma ORM configured with enterprise schema
3. ✅ Environment variables secured in `.env.local`
4. ✅ Database tables created (15 tables total)
5. ✅ Admin user seeded (login ready)
6. ✅ Sample course data seeded

### Memory Footprint Check:
- **Node.js process**: ~200MB
- **Cursor IDE**: ~800MB
- **Chrome DevTools**: ~500MB
- **Total**: ~1.5GB (well within 8GB limit)

---

## 🚨 Troubleshooting

### Error: "Can't reach database server"
**Solution:** Check your `DATABASE_URL` in `.env.local`. Ensure no spaces/typos.

### Error: "P1001: Can't reach database"
**Solution:** Verify Neon project is active (check Neon dashboard). Free tier suspends after 7 days of inactivity.

### Error: "Module not found: 'bcryptjs'"
**Solution:** Run `npm install bcryptjs @types/bcryptjs`

### Prisma Studio not opening?
**Solution:** Ensure port 5555 is free. Close and retry `npx prisma studio`.

---

## 📚 Next Steps

✅ **Database Complete** → Ready for Phase 2: Authentication
- NextAuth.js configuration
- Login/Register pages
- Protected routes middleware

**Estimated RAM for Next Phase:** +300MB (NextAuth routes)

---

## 🔗 Useful Commands Reference

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Apply schema changes to database
npx prisma db push

# Create a new migration (production-ready)
npx prisma migrate dev --name description-of-changes

# Open Prisma Studio (visual database browser)
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Seed database
npx prisma db seed
```

---

**🎉 Database Architecture Phase Complete!**

Stand by for Phase 2: Authentication System Implementation.
