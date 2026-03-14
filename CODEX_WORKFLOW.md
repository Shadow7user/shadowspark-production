# ShadowSpark — Codex Operating Workflow
# For Codex: read this alongside PROJECT_CONTEXT.md and REWRITE_SCOPE.md.
# This workflow keeps production safe and deploys never break.

---

## How to open Codex for this repo (run every session)

# Safe default — approval prompts before any shell command, workspace-write sandbox
cd /home/shadowweaver/shadowspark-production
codex --full-auto

# If you want to review every single file change before it's applied (most cautious)
codex --approval-mode suggest

# For Phase 1 copy-only changes (no logic, no API, no schema) — faster
codex --approval-mode auto-edit

# NEVER use on this repo — bypasses all approvals and sandboxing
# codex --dangerously-bypass-approvals-and-sandbox   ← DO NOT USE

## Switch approval mode mid-session without restarting
# /mode suggest      ← safest, review everything
# /mode auto-edit    ← auto file edits, approve shell commands
# /mode full-auto    ← auto everything (only for safe copy tasks)

## Resume a previous session
codex resume

## Use /compact if context gets long (Codex auto-compacts but manual is cleaner)
# /compact

---

## First prompt — paste this at the start of every Codex session

"Read PROJECT_CONTEXT.md, REWRITE_SCOPE.md, and CODEX_TASKLIST.md in full.

Then run: find src/app -type d | head -80

Report the actual route and folder structure you see.
Do not assume route group names like (marketing) or (dashboard) — confirm them first.
Do not change any files until you have reported the structure and I have confirmed the task."

---

## Operating loop — follow this sequence for every task

1. INSPECT   — run find/ls commands, read relevant files, confirm paths exist
2. REPORT    — summarize what you found: structure, issues, relevant components
3. PLAN      — describe exactly what you will change and why, file by file
4. CONFIRM   — wait for explicit go-ahead before editing (do not skip this)
5. EDIT      — make the smallest change that achieves the task
6. VALIDATE  — run all three gates (see below)
7. REPORT    — list exactly what changed, which files, which lines

Do not combine steps. Do not edit before reporting. Do not commit before gates pass.

---

## Protected areas — NEVER touch these

src/app/api/*                  ← all API routes
src/lib/prisma.ts              ← Prisma singleton
prisma/schema.prisma           ← database schema
src/middleware.ts              ← auth scoping (already correct)
src/app/(dashboard)/*          ← if this route group exists
src/app/(auth)/*               ← auth pages
NextAuth configuration files
Paystack integration files
Resend email configuration

These areas affect live production logic. One wrong edit breaks auth or payments.

---

## Safe edit areas (marketing rewrite scope only)

Marketing pages and sections
Layout components and navigation
CTA components
Static copy and headlines
Blog pages and post templates
Industry and solution page content
Pricing page copy
Security page (add to top only — never remove existing content)

---

## Validation gate — ALL THREE must pass before any commit

pnpm tsc --noEmit
pnpm lint
pnpm build

If any gate fails:
- Fix the error before continuing
- Do not propose a commit until all three are green
- Report what failed and what you did to fix it

NOTE: pnpm build inside Codex sandbox may fail on font/image fetches due to
network restrictions. This is a sandbox limitation, not a code error.
If tsc and lint pass and the only build failure is a network fetch,
commit and push — Vercel will confirm the true build result.

---

## Coding rules

- pnpm ONLY — never npm or yarn
- TypeScript strict — no `any` types
- Server Components by default
- `"use client"` only when strictly required (event handlers, browser APIs, hooks)
- Zod for any new input validation flows
- Prisma imported ONLY from `@/lib/prisma` — never `new PrismaClient()` elsewhere
- Dashboard and app routes MUST export: `export const dynamic = "force-dynamic"`

---

## Commit rules

- Small, focused commits — one concern per commit
- Never bundle a refactor with a feature in one commit
- Commit message format: type(scope): description
  Examples:
  fix(homepage): remove zero-value lead metrics
  feat(cta): standardize book demo buttons site-wide
  feat(solutions): add solutions page with 5 categories
  chore(config): add industry config files

- Run the three-gate check before every commit:
  pnpm tsc --noEmit && pnpm lint && pnpm build

---

## Inspection commands (use at start of every task)

# Full app route structure
find src/app -type d | head -80

# Full component structure
find src/components -type d | head -40

# All CTA buttons across marketing files
grep -r "Book Demo\|Get Started\|Start Free Trial\|Create Account\|Request Demo\|Sign Up\|Try Now" \
  src/app --include="*.tsx" -l

# Find zero-value metrics
grep -r "0\|Leads Generated\|Workflows Active\|Clients Served" \
  src/app --include="*.tsx" -n

# Check all existing demo-site routes are intact
curl -o /dev/null -s -w "%{http_code}" https://shadowspark-tech.org/demo-sites/logistics
curl -o /dev/null -s -w "%{http_code}" https://shadowspark-tech.org/demo-sites/school
curl -o /dev/null -s -w "%{http_code}" https://shadowspark-tech.org/demo-sites/restaurant
curl -o /dev/null -s -w "%{http_code}" https://shadowspark-tech.org/demo-sites/hospital
curl -o /dev/null -s -w "%{http_code}" https://shadowspark-tech.org/demo-sites/church
# All five must return 200 before and after every deploy

---

## CTA enforcement rules

Primary CTA text:    "Book Demo"
Primary CTA link:    https://calendly.com/morontomornica7/audit

Secondary CTA text:  "Chat on WhatsApp"
Secondary CTA link:  https://wa.me/2349045770572

Rule: one primary CTA per page, above the fold.
Rule: "Create Account", "Start Free Trial" must not appear on marketing pages.
Rule: "Sign In" may remain in the top navigation only.

When you find a non-conforming CTA, replace it.
Do not ask — this is a confirmed standing rule.

---

## What "minimal change" means for this project

Phase 1 (copy + CTA only):
- Change text content and link hrefs
- Do not restructure components
- Do not move files
- Do not change visual design or Tailwind classes unless a CTA needs contrast

Phase 2 (new pages):
- Create new route files only in confirmed-safe locations
- Reuse existing components where possible
- Add to CODEX_TASKLIST.md as tasks complete

Phase 3 (refactor):
- Only after Phases 1 and 2 are deployed and verified
- Extract components one at a time
- Config files before component restructure

---

## Current workstream
Marketing funnel rewrite — see REWRITE_SCOPE.md for full scope.
Check CODEX_TASKLIST.md for task status before starting any session.
Mark tasks [x] done as you complete them.

## Next workstream (do not start until marketing rewrite is deployed)
WhatsApp chatbot MVP
Repo: Shadow7user/shadowspark-chatbot
Stack: Fastify + BullMQ + Upstash Redis + Railway
Context will be provided when this workstream begins.

---

## If you are unsure about anything

Do not guess. Do not assume. Do not proceed.
Ask: "I'm not sure about [X]. Should I [option A] or [option B]?"
That is always better than an unrecoverable edit to a live production repo.

---

## Network access (updated March 2026)

Codex CLI blocks network by default — git push, pnpm install, and curl
will fail with "Could not resolve host" errors.

Permanent fix (run once):
  mkdir -p ~/.codex
  echo '[sandbox_workspace_write]' >> ~/.codex/config.toml
  echo 'network_access = true' >> ~/.codex/config.toml

Per-session fix:
  codex --sandbox workspace-write -c 'sandbox_workspace_write.network_access=true'

Verify network is live at session start:
  /status   run this first in every Codex session
  network_access: true must show before any git or curl command

