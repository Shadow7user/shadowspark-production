# Validator Test Suite

Add these test files to `tests/validator/` when running automated checks locally.

1) Bad client component (`bad-client.tsx`)

```tsx
"use client";
import { prisma } from '@/lib/prisma';
export default async function Bad() {
  const data = await prisma.course.findMany();
  return <div>{data.length}</div>;
}
```

Expected: 3 violations (Prisma import, async component, direct Prisma usage).

2) Good client component (`good-client.tsx`)

```tsx
"use client";
import { api } from '@/lib/api';
export default function Good() {
  const { data } = api.course.getAll.useQuery();
  return <div>{data?.length ?? 0}</div>;
}
```

Expected: No violations.

3) Large API route (`big-route.ts`)

Create an artificially large API route (>400 lines) and expect a 'Large API route' violation.

Usage

Place test files under `tests/validator/` and run the validator pointing at `src/` (default). Compare outputs to expected.
