# AGENTS.md — ShadowSpark Technologies
# Repository: Shadow7user/shadowspark-production
# Stack: Next.js 16, TypeScript strict, Prisma 6, Neon PostgreSQL, pnpm, Tailwind, shadcn/ui

---

## 1. Identity & Constraints

You are working inside ShadowSpark Technologies — a Nigerian AI agency platform.
Owner: ARCHITECT (Okoronkwo Stephen Chijioke)
Revenue target: ₦1,500,000 by March 31, 2026.
Three warm leads are waiting for demos. Every task you complete moves toward closing them.

---

## 2. Package Manager

**ALWAYS use `pnpm`. Never npm or yarn.**

```bash
pnpm add <package>          # install
pnpm add -D <package>       # dev dependency
pnpm tsc --noEmit           # type-check (run after every file change)
pnpm lint                   # ESLint check
pnpm build                  # production build (Next.js)
```

---

## 3. Mandatory Verification Gates

Run these in order after **every task** before declaring done.
Do not skip any gate. Do not declare success until all pass.

```bash
# Gate 1 — Type safety
pnpm tsc --noEmit

# Gate 2 — Lint
pnpm lint

# Gate 3 — Build (run only when Gate 1 and Gate 2 pass)
pnpm build
```

If Gate 1 fails → fix all TypeScript errors first. Do not proceed to Gate 2.
If Gate 2 fails → fix all lint errors. Do not proceed to Gate 3.
If Gate 3 fails → fix the build error. Re-run all gates from Gate 1.

**Never report a task as complete if any gate has errors or warnings.**

---

## 4. TypeScript Rules

- Strict mode is ON. `noImplicitAny`, `strictNullChecks` are enforced.
- **No `any` types.** Ever. Use `unknown` + type guards if shape is uncertain.
- No `@ts-ignore` or `@ts-expect-error` without a comment explaining why.
- All async functions must have explicit return types.
- All props interfaces must be named and exported.
- Prefer `type` over `interface` for object shapes unless extending.
- Use `satisfies` operator for config objects instead of casting with `as`.

---

## 5. Prisma Rules — CRITICAL

- The Prisma client singleton is at `src/lib/prisma.ts`.
- **ALWAYS import like this:**
  ```ts
  import { prisma } from "@/lib/prisma"
  ```
- **NEVER** write `new PrismaClient()` anywhere outside `src/lib/prisma.ts`.
- **NEVER** add adapter options (`@prisma/adapter-neon` or similar) to the client.
- **NEVER** use `prisma.$transaction` with interactive callbacks for simple operations; use batch arrays instead.
- After any schema change:
  ```bash
  pnpm prisma db push
  pnpm prisma generate
  pnpm tsc --noEmit   # confirm types regenerated correctly
  ```
- Neon free tier auto-suspends. If `prisma db push` times out, wake the DB at console.neon.tech first.

---

## 6. Next.js App Router Rules

- All files go in `src/app/`. Never in `pages/`.
- Server Components are the default. Add `"use client"` only when you need:
  - `useState`, `useEffect`, `useRef`, or other React hooks
  - Browser APIs (`window`, `document`, `localStorage`)
  - Event handlers that run on the client
- `useSearchParams()` must always be wrapped in a `<Suspense>` boundary. Pattern:
  ```tsx
  // page.tsx — server component wrapper
  import { Suspense } from "react"
  import PageContent from "./PageContent"
  export default function Page() {
    return <Suspense fallback={<div>Loading...</div>}><PageContent /></Suspense>
  }
  // PageContent.tsx — "use client", reads useSearchParams()
  ```
- Route groups: `(marketing)`, `(academy)`, `(dashboard)`, `(auth)` — respect existing structure.
- Layouts in route groups handle their own nav/sidebar. Never add layout logic to page files.

---

## 7. Import Aliases

Always use the `@/` alias. Never use relative paths that climb more than one level.

```ts
// Correct
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"

// Wrong
import { prisma } from "../../lib/prisma"
```

---

## 8. API Routes

- All API routes live in `src/app/api/`.
- Every route must export a typed `NextRequest`/`NextResponse` handler.
- Wrap all async handlers in try/catch. Return structured JSON errors:
  ```ts
  return NextResponse.json({ error: "Message" }, { status: 400 })
  ```
- Validate all incoming request bodies with Zod before touching the database.
- Never trust `req.body` types without validation.

---

## 9. Environment Variables

- `.env.local` is gitignored. Never read or modify it directly.
- Access variables only via `process.env.VARIABLE_NAME`.
- If a new env var is needed, add it to `.env.example` with a placeholder value.
- **Never log or expose API keys in any output, console.log, or comment.**
- Current critical vars: `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, `OPENROUTER_API_KEY`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `NEXT_PUBLIC_APP_URL`

---

## 10. Component Conventions

- Atomic design: `ui/` (shadcn primitives) → `shared/` (composites) → `features/` or page-level.
- Every component file exports one default component named identically to the file (PascalCase).
- Co-locate component-specific types in the same file unless shared across 2+ components.
- shadcn/ui components must be imported from `@/components/ui/`.
- Never install a UI library when an existing shadcn/ui component covers the use case.
- Use `cn()` from `@/lib/utils` for conditional Tailwind class merging. Never string concatenation.

---

## 11. Git Discipline

- Work on a feature branch, never directly on `main`.
- Commit message format: `type(scope): description`
  - Types: `feat`, `fix`, `refactor`, `chore`, `docs`
  - Example: `feat(demo): wire OpenRouter AI into generate-demo route`
- Run all verification gates before committing.
- Stage only files you intentionally changed. Review with `git diff --staged` before commit.
- Never commit: `.env.local`, `node_modules/`, `.next/`, any file containing real API keys.

---

## 12. AI / OpenRouter Integration

- Model: `openai/gpt-4o-mini` (cost-efficient for Nigerian agency margins)
- Import client from `@openrouter/sdk` — already installed.
- Always set a `max_tokens` budget. Never fire unbounded completions.
- Wrap all AI calls in try/catch. If AI fails, return a graceful fallback — never crash the route.
- Never log full AI responses to console in production paths.

---

## 13. Demo Engine — Current Files (Do Not Recreate)

These files exist and build cleanly. Modify only; never recreate from scratch:

```
src/app/demo/page.tsx                    — industry picker
src/app/demo/start/page.tsx              — onboarding form
src/app/demo/claim/page.tsx              — Suspense wrapper
src/app/demo/claim/ClaimPageContent.tsx  — "use client", reads searchParams
src/app/preview/[id]/page.tsx            — preview with fallback config
src/app/api/generate-demo/route.ts       — POST: create DemoSession
src/app/api/demo-claim/route.ts          — POST: update status, send WhatsApp alert
src/components/dashboard/LeadDashboard.tsx
src/lib/actions/leads.ts
src/lib/schemas.ts
src/lib/prisma.ts                        — SINGLETON — never touch
```

Demo flow: `/demo` → `/demo/start?industry=X` → POST `/api/generate-demo` → `/preview/[id]` → `/demo/claim?sessionId=X`

---

## 14. Demo Sites — Target Structure

Each demo site lives in `src/app/demo-sites/[vertical]/page.tsx`.
Verticals: `logistics`, `school`, `restaurant`, `hospital`, `church`.
Index at `src/app/demo-sites/page.tsx`.
Each is a **server component** with hardcoded Nigerian SME demo data. No DB queries needed.
Style: cyberpunk dark mode — bg `#050508`, primary `#00FFD5`, accent `#BD00FF`, Tailwind only.

---

## 15. Definition of "Done" for Any Task

A task is complete ONLY when:
1. `pnpm tsc --noEmit` → 0 errors
2. `pnpm lint` → 0 errors (warnings acceptable if pre-existing)
3. `pnpm build` → exits 0, all pages compile
4. The feature works as described in the task prompt
5. No new `any` types introduced
6. No `new PrismaClient()` calls added outside `src/lib/prisma.ts`

If you cannot reach this state, stop and report exactly which gate is failing and why.
Do not attempt workarounds that suppress errors without fixing the root cause.

---

## 16. What NOT to Do

- Do not run `npm install` or `yarn add` — pnpm only.
- Do not create files in `pages/` — App Router only.
- Do not add Docker or containerization tooling.
- Do not install tRPC, React Query, or Zustand unless ARCHITECT explicitly requests it.
- Do not modify `src/lib/prisma.ts`.
- Do not add Prisma adapters.
- Do not expose secrets in any file tracked by git.
- Do not declare a task done if any verification gate fails.
- Do not run `pnpm build` inside an active `pnpm dev` session (corrupts .next).
- Do not use `localStorage` in Server Components.
- Do not import from `next/navigation` hooks in Server Components.

---

## 17. Useful Commands Reference

```bash
# Start dev server
pnpm dev

# Full verification sequence (run this after every task)
pnpm tsc --noEmit && pnpm lint && pnpm build

# Prisma workflow
pnpm prisma db push        # sync schema to Neon (wake DB first)
pnpm prisma generate       # regenerate client types
pnpm prisma studio         # visual DB browser at localhost:5555

# Git workflow
git status
git diff --staged
git add -p                 # interactive staging — only stage what you intend
git commit -m "feat(scope): message"
git push origin HEAD

# Check what's broken fast
pnpm tsc --noEmit 2>&1 | head -50
```

---

*Last updated: March 2026 | ShadowSpark Technologies*
