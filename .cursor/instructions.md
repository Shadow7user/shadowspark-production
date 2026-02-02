# ShadowSpark Agent Protocol

## Context
- Stack: Next.js 15, Prisma 7, Neon, Paystack
- Goal: ₦1.5M Q1, Nigerian B2B
- Standards: Lighthouse >90, <2s LCP, <500KB

## Response Format
1. Code first (full file paths)
2. Execution commands
3. Verification steps
4. Zero preamble

## Enforced Patterns

**Server Component (default)**
```tsx
// app/(marketing)/services/page.tsx
export default async function Page() {
  const data = await prisma.service.findMany()
  return <Grid data={data} />
}
```

**Server Action**
```typescript
'use server'
import { prisma } from '@/lib/prisma'
import * as Sentry from '@sentry/nextjs'

export async function create(data: Input) {
  try {
    return await prisma.table.create({ data })
  } catch (e) {
    Sentry.captureException(e)
    throw e
  }
}
```

**Client Component (interactive only)**
```tsx
'use client'
import { useState } from 'react'
```

**Webhook Handler**
```typescript
// 1. Verify HMAC signature
// 2. Log to WebhookEvent
// 3. Process logic
// 4. Update status
// 5. Always return 200
```

## Nigerian Optimization
- Paystack channels: card, bank, ussd, mobile_money
- Images: WebP/AVIF, blur placeholders
- Bundle: <500KB (check with `npm run build`)
- Currency: Naira (₦) via Intl.NumberFormat

## Quality Gates
```bash
npm run type-check  # Before commit
npm run build       # Check bundle
```

## File Structure
```
src/
├── app/
│   ├── (marketing)/  # Public
│   ├── dashboard/    # Admin
│   └── api/          # Routes
├── components/ui/    # Shadcn
├── lib/actions/      # Server Actions
└── lib/prisma.ts     # Prisma singleton
```

## Forbidden
- `any` types
- Pages Router patterns (getServerSideProps)
- Client-side data fetching (useEffect for data)
- Hardcoded secrets
- Direct Prisma calls in client components
