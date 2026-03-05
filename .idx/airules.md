# SHADOWSPARK TECHNOLOGIES — AI AGENT MASTER INSTRUCTIONS
# This file is read by ALL AI agents in this repo.
# Firebase Studio Gemini, GitHub Copilot, and Cursor all
# check this file for project-specific behavior rules.

## PROJECT IDENTITY
Company: ShadowSpark Technologies
Domain: shadowspark-tech.org (LIVE on Cloudflare Workers)
Founder: ARCHITECT (architect@shadowspark-tech.org)
Revenue target: ₦1.5M by March 31 2026
Repo: Shadow7user/shadowspark-production

## TECH STACK (mandatory — never suggest alternatives)
- Next.js 16.1.6 (App Router, NOT pages router)
- TypeScript strict (zero `any` types, ever)
- Prisma 6.10.0 (NOT 7, NO adapter-neon package)
- Neon PostgreSQL (serverless, pgbouncer pooling)
- NextAuth.js v5 (NOT v4)
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- pnpm (NEVER npm or yarn)
- Cloudflare Workers via @opennextjs/cloudflare
- Railway (chatbot Fastify service)
- Gemini 2.0 Flash primary AI
- OpenAI GPT-4o-mini fallback
- Paystack (Nigerian payments, NOT Stripe primary)
- Resend (email, domain: shadowspark-tech.org)

## CRITICAL RULES
1. NEVER add @prisma/adapter-neon (wrong for Prisma 6)
2. NEVER use `any` TypeScript type
3. NEVER use npm — always pnpm
4. NEVER run prisma db push --accept-data-loss
5. NEVER git push --force to main
6. NEVER overwrite .env without backing up
7. ALWAYS commit after each completed task
8. ALWAYS run pnpm build before committing
9. proxy.ts handles routing (NOT middleware.ts — renamed in Next.js 16)
10. Server components by default, 'use client' only when needed

## BRAND PERSONA & CONTENT RULES
1. Tone: Friendly, empathetic, and action-oriented.
2. Language: Nigerian English (e.g., use phrases like 'Traffic and logistics delays happen sometimes, especially in Lagos').
3. Data Source: Reference 'config/demo-responses.json' for all chatbot response logic.
4. Discounts: Reference 5% off first order (WELCOME5) and bulk discounts for 3+ or 20+ units as per local codebase.
5. Goal: Help the customer quickly with an exact ETA or direct connection to the wholesale team.

## CURRENT BLOCKERS (fix these first)
- src/lib/prisma.ts uses wrong adapter — REMOVE IT
- .env needs real Neon credentials
- prisma db push never completed
- Railway chatbot service sleeping

## CORRECT prisma.ts PATTERN