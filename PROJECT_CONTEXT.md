# ShadowSpark Technologies — Project Context for Codex

## Identity
- Company: ShadowSpark Technologies (CAC registered Private Limited)
- Founder: ARCHITECT — Okoronkwo Stephen Chijioke
- Base: Port Harcourt, Rivers State, Nigeria
- Domain: shadowspark-tech.org
- Repo: Shadow7user/shadowspark-production
- Email: architect@shadowspark-tech.org
- Revenue target: ₦1,500,000 by March 31, 2026
- Primary business goal: convert Nigerian SME visitors into demo requests
  and WhatsApp conversations for AI automation services

## Stack (do not change without explicit instruction)
- Framework: Next.js 15, App Router, TypeScript strict (no `any` types)
- Styling: Tailwind CSS + shadcn/ui
- Database: Neon PostgreSQL via Prisma 6 (NO Prisma adapters — ever)
- Auth: NextAuth v5 beta.30, JWT sessions
- Payments: Paystack (primary, Naira-based)
- Email: Resend
- AI: OpenRouter — model: google/gemini-2.0-flash-001 (~$0.0004/call)
- Deployment: Vercel (auto-deploy on push to main)
- Package manager: pnpm ONLY — never npm or yarn

## Architecture rules
- Import Prisma ONLY from `@/lib/prisma`
- NEVER write `new PrismaClient()` outside src/lib/prisma.ts
- All dashboard/app routes MUST export: `export const dynamic = "force-dynamic"`
- Server Components by default — `"use client"` only when strictly required
- Zod for all input validation on new flows
- All async operations must have try/catch error handling

## Brand system
- Background: #050508
- Primary (cyan): #00FFD5
- Accent (purple): #BD00FF
- Style: dark cyberpunk, glassmorphism cards, mobile-first, high-contrast
- Typography: high contrast on dark, never pure white text

## Three-gate rule — before EVERY commit, all three must pass
1. pnpm tsc --noEmit
2. pnpm lint
3. pnpm build

## Verified production state (as of March 14, 2026)
- Live at shadowspark-tech.org (Vercel, server: Vercel confirmed)
- 27 routes deployed, all passing
- /login is the correct auth route (NOT /auth/login)
- /dashboard redirects unauthenticated users to /login
- Middleware scoped to: /dashboard/:path*, /admin/:path*, /finance/:path*, /support/:path*
- Public marketing routes are NOT protected by middleware
- Team DB accounts: architect@ (ADMIN), emmanuel@ (ADMIN), reginald@ (USER)

## Verified demo-site routes (all return HTTP 200)
- /demo-sites (index)
- /demo-sites/logistics  — SwiftMove Logistics
- /demo-sites/school     — Brightmind Academy
- /demo-sites/restaurant — Mama's Kitchen PH
- /demo-sites/hospital   — MedCare Specialist Clinic
- /demo-sites/church     — Covenant Life Assembly

## Demo engine flow
/demo → fill industry form → POST /api/generate-demo → /preview/[id] → /demo/claim → WhatsApp alert to sales

## Important: do not assume
- Do not assume route-group folder names (e.g. (marketing)) without running
  `find src/app -type d` first and confirming they exist
- Do not assume any page exists without checking the file tree

## Nigerian market context (use to inform copy and CTA decisions)
- 95% of Nigeria's digital population uses WhatsApp daily (CreativeTechAfrica, 2026)
- 99% of Nigerian SMEs now accept digital payments (Mastercard SME Index, Feb 2025)
- Nigeria's digital economy projected at $11.71B in 2025, growing 18.17% CAGR to 2030
- Nigeria's GDP expected to grow 4.0% in 2026, outpacing global 3.1% (Mastercard MEI, Jan 2026)
- WhatsApp open rate: 98% vs email 20%; click-through: 45-60% vs email 2-5%
- WhatsApp API pricing model (effective July 1, 2025): per-message, not per-conversation
  - Marketing messages: ~$0.025-$0.05/msg (Nigerian tier)
  - Utility messages within 24hr customer window: FREE
  - Service messages (customer-initiated): FREE
- WhatsApp Coexistence mode is NOT yet available in Nigeria (+234) — still pending Meta compliance
- Nigeria is classified as Authentication-International market by Meta
- Primary SME pain points: manual customer follow-up, lead leakage, WhatsApp inbox chaos,
  no-show appointments, slow response times, inability to scale support without hiring

## Future workstream (after marketing rewrite)
Next major build: WhatsApp chatbot MVP
- Repo: Shadow7user/shadowspark-chatbot
- Stack: Fastify + BullMQ + Upstash Redis + Railway
- Meta Phone Number ID: 395867530276543
- WhatsApp Portfolio ID: 1433341798269798
