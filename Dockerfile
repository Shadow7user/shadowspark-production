# ---------- Base ----------
FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# IMPORTANT: disable Prisma completely for worker globally
ENV SKIP_PRISMA=true

# ---------- Dependencies ----------
FROM base AS deps

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

# ---------- Builder ----------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# IMPORTANT: disable Prisma completely for worker
ENV SKIP_PRISMA=true

# build if needed (only if your worker has TS/compiled code)
RUN npm install -g pnpm && pnpm build || echo "No build step"

# ---------- Runner ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV SKIP_PRISMA=true

# copy only what is needed
COPY --from=builder /app ./

# optional: prune dev deps (faster runtime)
RUN npm install -g pnpm && pnpm prune --prod

# 👇 IMPORTANT: set your worker entry point
CMD ["npx", "tsx", "src/cli/rag-sync.ts"]
