# 🚀 ShadowSpark Technologies - Full-Stack Platform

> **Enterprise-Grade AI-Powered Digital Agency Platform**  
> Next.js 15 · TypeScript · Prisma · PostgreSQL · NextAuth.js · Paystack

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [What We're Building](#what-were-building)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [Development Workflow](#development-workflow)
8. [Deployment Strategy](#deployment-strategy)
9. [Performance Targets](#performance-targets)
10. [Contributing](#contributing)

---

## 🎯 Project Overview

**ShadowSpark Technologies** is a modern digital agency platform serving the Nigerian/West African market with:

- 🌐 **Web & App Development Services** (B2B project management)
- 🤖 **AI Chatbot Solutions** (WhatsApp, Instagram, Web integrations)
- 🎨 **Design Services** (Brand identity, UI/UX, graphics)
- 📈 **SEO & Digital Marketing** (Content, analytics, optimization)
- 🎓 **AI Academy** (Online courses with payment integration)
- 🧠 **AI Consulting** (Enterprise transformation services)

### Business Model
- **B2B Services:** Project-based client work (₦150K - ₦5M per project)
- **B2C Education:** Online courses (₦15K - ₦75K per course)
- **Recurring Revenue:** Monthly SEO retainers, chatbot maintenance

---

## 🏗️ What We're Building

### Phase 1: Foundation (Current)
✅ Database schema design (15 tables, RBAC, soft deletes)  
✅ Environment configuration (Neon PostgreSQL cloud)  
⏳ Authentication system (NextAuth.js v5)  
⏳ UI component library (shadcn/ui, Tailwind)  

### Phase 2: Core Features (Week 2-4)
- [ ] Marketing website (homepage, services, about, contact)
- [ ] Client dashboard (project tracking, milestones, invoices)
- [ ] Academy platform (course catalog, video player, progress tracking)
- [ ] Payment integration (Paystack primary, Stripe fallback)

### Phase 3: Advanced Features (Week 5-8)
- [ ] Admin CMS (course creation, blog management, user management)
- [ ] Email automation (Resend + React Email templates)
- [ ] SEO optimization (meta tags, sitemaps, structured data)
- [ ] Analytics dashboard (PostHog, Google Analytics 4)

### Phase 4: Launch Prep (Week 9-10)
- [ ] Performance optimization (Core Web Vitals <2s LCP)
- [ ] Security hardening (CSP headers, rate limiting)
- [ ] Error monitoring (Sentry integration)
- [ ] Production deployment (Vercel, CI/CD pipeline)

---

## 🛠️ Tech Stack

### Frontend
```typescript
Framework:     Next.js 15.1 (App Router, React Server Components)
Language:      TypeScript 5.3 (strict mode, no `any` types)
Styling:       Tailwind CSS 3.4 + shadcn/ui components
State:         React Query (server state) + Zustand (client state)
Forms:         React Hook Form + Zod validation
Icons:         Lucide React
```

### Backend
```typescript
API:           Next.js API Routes + tRPC (type-safe RPC)
Database:      PostgreSQL 16 (Neon serverless)
ORM:           Prisma 5.x (type-safe queries, migrations)
Auth:          NextAuth.js v5 (JWT sessions, OAuth, credentials)
File Storage:  Cloudinary (images, videos, documents)
Email:         Resend (transactional emails)
```

### Payments
```typescript
Primary:       Paystack (Nigerian naira, mobile money)
Fallback:      Stripe (international cards, USD/EUR)
Webhooks:      Verified signature validation
```

### DevOps
```typescript
Hosting:       Vercel (Edge Network, automatic HTTPS)
CI/CD:         GitHub Actions (lint, test, deploy)
Monitoring:    Sentry (errors) + PostHog (analytics)
Version:       Git + GitHub (conventional commits)
```

### Development Tools
```typescript
IDE:           Cursor (AI-powered VSCode fork)
Linting:       ESLint + Prettier (auto-format on save)
Testing:       Vitest (unit) + Playwright (E2E)
Database UI:   Prisma Studio (visual data explorer)
```

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     VERCEL EDGE NETWORK                      │
│                    (CDN + Edge Functions)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
│   Marketing  │  │   Academy   │  │ Dashboard  │
│   Website    │  │   Platform  │  │  (Client)  │
│              │  │             │  │            │
│ - Homepage   │  │ - Courses   │  │ - Projects │
│ - Services   │  │ - Videos    │  │ - Invoices │
│ - Portfolio  │  │ - Lessons   │  │ - Settings │
│ - Contact    │  │ - Checkout  │  │            │
└──────────────┘  └─────────────┘  └────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                ┌────────▼────────┐
                │  Next.js App    │
                │  (API Routes)   │
                │                 │
                │ - Auth API      │
                │ - tRPC API      │
                │ - Webhooks      │
                └────────┬────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
│   Neon       │  │  Cloudinary │  │  Paystack  │
│  PostgreSQL  │  │   (Images)  │  │ (Payments) │
└──────────────┘  └─────────────┘  └────────────┘
```

### Data Flow Example: Course Purchase
```
1. User clicks "Buy Course" (₦15,000)
2. Next.js validates user session (NextAuth.js)
3. Paystack popup initiated (client-side SDK)
4. User completes payment on Paystack
5. Paystack sends webhook to /api/webhooks/paystack
6. Webhook handler validates signature
7. Prisma creates Enrollment record
8. Resend sends confirmation email
9. User redirected to course dashboard
```

---

## 📁 Project Structure

```
shadowspark-platform/
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI/CD
├── prisma/
│   ├── schema.prisma              # Database schema (15 tables)
│   ├── migrations/                # Migration history
│   └── seed.ts                    # Development data seeder
├── public/
│   ├── icons/                     # Favicon, app icons
│   └── images/                    # Static images
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/               # Auth routes group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (marketing)/          # Public pages
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── services/
│   │   │   ├── about/
│   │   │   └── contact/
│   │   ├── (academy)/            # Course platform
│   │   │   ├── courses/
│   │   │   ├── [courseId]/
│   │   │   └── checkout/
│   │   ├── (dashboard)/          # Client portal
│   │   │   ├── overview/
│   │   │   ├── projects/
│   │   │   └── settings/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth.js
│   │   │   ├── trpc/[trpc]/         # tRPC handler
│   │   │   └── webhooks/
│   │   │       ├── paystack/
│   │   │       └── stripe/
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── marketing/            # Landing page sections
│   │   ├── academy/              # Course components
│   │   ├── dashboard/            # Admin components
│   │   └── shared/               # Reusable components
│   ├── lib/
│   │   ├── db.ts                 # Prisma client singleton
│   │   ├── auth.ts               # NextAuth config
│   │   ├── utils.ts              # Utility functions (cn, etc.)
│   │   ├── validations/          # Zod schemas
│   │   └── trpc/                 # tRPC setup
│   ├── server/
│   │   ├── routers/              # tRPC routers
│   │   │   ├── course.ts
│   │   │   ├── project.ts
│   │   │   └── user.ts
│   │   └── context.ts            # tRPC context
│   ├── hooks/                    # Custom React hooks
│   ├── types/                    # TypeScript types
│   └── config/                   # App configuration
├── tests/
│   ├── e2e/                      # Playwright tests
│   └── unit/                     # Vitest tests
├── .env.example                  # Environment template
├── .env.local                    # Local secrets (gitignored)
├── .gitignore
├── next.config.js                # Next.js configuration
├── package.json
├── prettier.config.js            # Code formatting
├── tailwind.config.ts            # Tailwind customization
└── tsconfig.json                 # TypeScript config
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** 20.x LTS ([Download](https://nodejs.org/))
- **Git:** Latest version ([Download](https://git-scm.com/))
- **Neon Account:** Free tier ([Sign up](https://console.neon.tech))
- **Cursor IDE:** AI-powered editor ([Download](https://cursor.sh/))

### Hardware Requirements
- **Minimum:** 8GB RAM, 10GB free disk space
- **Recommended:** 16GB RAM, 20GB free disk space
- **OS:** Windows 11, macOS, or Linux

### Installation (Detailed in `SETUP_GUIDE.md`)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/shadowspark-platform.git
cd shadowspark-platform

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Neon credentials

# 4. Initialize database
npx prisma generate
npx prisma db push

# 5. Seed development data (optional)
npx prisma db seed

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔄 Development Workflow

### Daily Development
```bash
# Pull latest changes
git pull origin develop

# Create feature branch
git checkout -b feature/course-enrollment

# Make changes, then commit
git add .
git commit -m "feat: add course enrollment flow"

# Push and create PR
git push origin feature/course-enrollment
```

### Database Changes
```bash
# After modifying schema.prisma
npx prisma migrate dev --name add-payment-status

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Run tests
npm run test        # Unit tests
npm run test:e2e    # E2E tests
```

---

## 🚢 Deployment Strategy

### Environments
```
Development  → localhost:3000 (Neon dev branch)
Staging      → staging.shadowspark-technologies.com (Neon staging branch)
Production   → www.shadowspark-technologies.com (Neon main branch)
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### CI/CD Pipeline (GitHub Actions)
1. **On PR:** Lint → Type check → Unit tests → Build preview
2. **On merge to `develop`:** Deploy to staging
3. **On merge to `main`:** Deploy to production

---

## 📊 Performance Targets

### Core Web Vitals (Mobile)
- **LCP (Largest Contentful Paint):** <2.5s ✅
- **FID (First Input Delay):** <100ms ✅
- **CLS (Cumulative Layout Shift):** <0.1 ✅

### Lighthouse Scores
- **Performance:** >90
- **Accessibility:** >95
- **Best Practices:** >95
- **SEO:** >95

### Optimization Strategies
- Image optimization (next/image, Cloudinary CDN)
- Code splitting (dynamic imports)
- Font optimization (next/font)
- Database query optimization (Prisma indexes)
- Edge caching (Vercel Edge Network)

---

## 🤝 Contributing

### Coding Standards
- **TypeScript:** Strict mode, no `any` types
- **Components:** Atomic design (atoms → molecules → organisms)
- **Naming:** camelCase (variables), PascalCase (components)
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`)

### Pull Request Process
1. Create feature branch from `develop`
2. Write tests for new features
3. Ensure all tests pass (`npm run test`)
4. Update documentation if needed
5. Submit PR with clear description
6. Address review feedback
7. Squash merge to `develop`

---

## 📚 Documentation

- **Setup Guide:** [`SETUP_GUIDE.md`](./docs/SETUP_GUIDE.md) - Complete installation walkthrough
- **Architecture:** [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md) - System design deep dive
- **API Reference:** [`API.md`](./docs/API.md) - tRPC endpoints documentation
- **Database Schema:** [`DATABASE.md`](./docs/DATABASE.md) - Prisma models explained
- **Deployment:** [`DEPLOYMENT.md`](./docs/DEPLOYMENT.md) - Production checklist

---

## 📞 Support

- **Email:** architect@shadowspark-technologies.com
- **Domain:** www.shadowspark-technologies.com
- **GitHub Issues:** Report bugs or request features

---

## 📄 License

Proprietary - ShadowSpark Technologies © 2025

---

## 🎯 Project Milestones

### ✅ Completed
- [x] Tech stack finalized
- [x] Database schema designed (15 tables)
- [x] Neon PostgreSQL setup guide
- [x] Environment variable configuration

### 🚧 In Progress
- [ ] NextAuth.js authentication (Week 1)
- [ ] shadcn/ui component library (Week 1)

### 📅 Upcoming
- [ ] Marketing website (Week 2)
- [ ] Academy platform (Week 3-4)
- [ ] Payment integration (Week 4)
- [ ] Admin dashboard (Week 5-6)
- [ ] Production launch (Week 10)

---

**Built with ❤️ in Nigeria | Powered by AI**
