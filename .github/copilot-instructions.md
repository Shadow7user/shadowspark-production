<!-- Copilot instructions for AI coding agents in the ShadowSpark repo -->
# AI Agent Guide — ShadowSpark (actionable, guardrails-first)

Purpose: Provide compact, high-signal guidance so repo-aware agents produce on-stack, safe, and reviewable code.

Core rules (must obey)
- NEVER call Prisma directly from client components or client-side bundles. Always perform DB access inside server components, server actions, API routes, or through tRPC/router handlers.
- ALWAYS prefer `tRPC` or server actions for cross-layer calls. If adding an API surface, place handlers under `src/app/api` or `src/server/routers`.
- UI MUST use the shared shadcn/ui primitives in `src/components/ui` and `src/components/Shared`. Do not introduce new styling systems or raw global CSS — prefer Tailwind utility + existing components.
- Authentication flows use NextAuth v5 with JWT sessions. Respect `session.user.role` values `'STUDENT'|'CLIENT'|'ADMIN'` and the redirect patterns in `src/lib/utils/session.ts`.

Where to read first (fast path)
- `package.json` — confirm Node >=20 and scripts (`dev`, `build`, `seed`, `prisma:*`).
- `prisma/schema.prisma` — authoritative DB model source.
- `src/lib/prisma.ts` — singleton `PrismaClient` + `PrismaPg` adapter (do not instantiate new clients).
- `src/lib/auth.ts` and `src/app/api/auth/[...nextauth]/route.ts` — NextAuth setup and exported handlers.
- `src/middleware.ts` and `src/lib/utils/session.ts` — route protection and role helpers.

Quick workflows (commands)
```bash
# dev
npm run dev
# prisma
npx prisma generate
npx prisma db push
npm run seed
# quality
npm run type-check
npm run lint
npm run format
```

Short examples (follow these patterns)
- Export nextauth handlers: `export const { GET, POST } = handlers;` in `src/app/api/auth/[...nextauth]/route.ts`.
- Server-side protection: `const session = await auth(); if (!session) redirect('/login')` (see `src/lib/utils/session.ts`).

Validation prompt (use this to test Copilot suggestions)
"Create a protected dashboard widget component that: uses `src/components/ui` primitives, fetches data via a tRPC hook or server action (no direct Prisma calls), checks `session.user.role === 'CLIENT'` and redirects unauthorized users to `/dashboard`. Keep file under `src/app/dashboard/widgets/` and include a small Storybook-style example export."

Expansion checklist (pick items to add next)
- [ ] Add Paystack webhook signature verification example under `src/app/api/webhooks/paystack/`.
- [ ] Add canonical tRPC router + client example under `src/server/routers` and `src/lib/trpc`.
- [ ] Add CI checklist for Vercel preview/deploys in `.github/workflows/`.

Quick PR checklist for agents
- Run `npm run type-check` and `npm run lint` locally for any TS/format changes.
- If `prisma/schema.prisma` changed: run `npx prisma generate` and `npx prisma migrate dev --name <desc>` or `npx prisma db push` (use migrate for intentional schema history).
- Add or update seeds in `prisma/seed.js` when adding new models.

Notes and risks
- Keep this file concise (<800 lines). Use short bullets and examples only — long prose reduces instruction-following fidelity.
- If unsure whether code belongs on client or server, default to server-side and create a minimal tRPC or API handler.

Where to ask for help
- Open a PR and add reviewer `@project-owner` with the tag `area:infra` for infra changes, or `area:frontend` for UI changes.

Optional examples (paste when implementing payments)

Paystack webhook signature verification (place as `src/app/api/webhooks/paystack/route.ts`):

```typescript
export const runtime = 'nodejs';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const secret = process.env.PAYSTACK_SECRET!;
	const body = await req.text();
	const expected = crypto.createHmac('sha512', secret).update(body).digest('hex');
	const header = (req.headers.get('x-paystack-signature') || '').trim();
	if (!header || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(header))) {
		return new NextResponse('Invalid signature', { status: 401 });
	}
	const payload = JSON.parse(body);
	// handle event: payload.event, payload.data
	return NextResponse.json({ received: true });
}
```

Validation tests (use these prompts to measure before/after improvement)

- Prompt A (widget):
	"Create a protected dashboard widget component that: uses `src/components/ui` primitives, fetches data via a tRPC hook or server action (no direct Prisma calls), checks `session.user.role === 'CLIENT'` and redirects unauthorized users to `/dashboard`. Keep file under `src/app/dashboard/widgets/` and include a small Storybook-style example export. If any rule conflicts with the task, explain the trade-off and suggest a compliant alternative."

- Prompt B (role badge):
	"Create a Server Component `src/app/dashboard/components/RoleBadge.tsx` that reads the authenticated session server-side, renders a shadcn `Badge` with the user's role (`STUDENT|CLIENT|ADMIN`), and does not call Prisma from the component. Provide a tiny usage example in `src/app/dashboard/page.tsx`. If the session is missing, redirect to `/login`."

Before/after measurement

- Before: run prompts with no repo instructions (or remove file temporarily) and capture the top Copilot suggestion diff.
- After: restore `.github/copilot-instructions.md`, run same prompts, capture suggestion diff.
- Compare: check for (a) no direct Prisma calls in client code, (b) `src/components/ui` primitives used, (c) session usage via `auth()` or server action, (d) correct redirects.

Iteration checklist

- [ ] Run Prompt A and Prompt B before adding this file (or with file temporarily ignored) and save the suggested code.
- [ ] Add/update `.github/copilot-instructions.md` (this change).
- [ ] Run Prompt A and Prompt B again and save suggestions.
- [ ] Compare diffs and record whether suggestions follow: no client-side Prisma, use of shadcn/ui, server-side session checks, proper route placement.
- [ ] If suggestions still off-policy, specify which rule to strengthen (e.g., add explicit example forbidding `prisma` imports anywhere under `src/components`).

