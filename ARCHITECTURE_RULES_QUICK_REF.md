# Architecture Rules — Quick Reference

- NO Prisma in Client Components
  - Reject imports from `@prisma/client`, `@/lib/prisma`, or any `prisma` symbol inside files marked `"use client"`.
- NO async client components
  - Client components must be synchronous React functions; use tRPC hooks for async data.
- AVOID direct fetch/axios in client components
  - Use `api.*.useQuery()` tRPC hooks or server actions instead.
- API routes should be thin
  - Move business logic into `src/server/routers` or shared server services; keep route handlers small.

Examples
- Good client component: uses `api.course.getAll.useQuery()` and is not `async`.
- Bad client component: imports `prisma` or contains `async` component body.
