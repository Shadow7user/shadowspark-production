# apps/web - LOGISTICORE Web Application

Customer-facing Next.js application for the LOGISTICORE logistics platform.

## Overview

This is the main web application that provides:
- Public logistics platform interface
- Real-time shipment tracking
- Quote request system
- Customer portal with authentication
- Responsive design for all devices

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + shadcn/ui components
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js v5
- **Database**: Prisma + PostgreSQL

## Development

```bash
# Install dependencies (from root)
npm install

# Run development server
npm run dev:web

# Build for production
npm run build:web
```

## Features

### Current
- Placeholder application structure
- Integration with @logisticore packages

### Planned
- Homepage with service overview
- Shipment tracking interface
- Customer dashboard
- Quote request forms
- Real-time notifications

## Structure

```
apps/web/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and configurations
│   └── types/           # TypeScript types
├── public/              # Static assets
├── package.json
└── next.config.ts
```

## Integration with Shared Packages

This app uses the following shared packages:

- `@logisticore/data-models`: For type definitions
- `@logisticore/sim-engine`: For route optimization features

```typescript
import { Shipment, Vehicle } from '@logisticore/data-models';
import { optimizeRoute } from '@logisticore/sim-engine';
```

## Environment Variables

Create `.env.local` file:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

## Deployment

Deployed on Vercel with automatic deployments from main branch.

---

**Status**: 🚧 Week 0-1 Scaffolding Phase
