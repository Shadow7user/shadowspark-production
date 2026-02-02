# Security

## Auth

NextAuth v5, JWT sessions (7d expiry)

## Data

- DB: SSL-enforced Neon PostgreSQL
- Transit: TLS 1.3
- Rest: AES-256

## API

- Rate limit: 100/min (Vercel)
- Validation: Zod
- Injection: Prisma parameterized

## Payments

PCI Level 1 (Paystack hosted), HMAC webhook verification

## Monitoring

Sentry errors, Vercel analytics
