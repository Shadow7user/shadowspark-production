# apps/admin - LOGISTICORE Admin Dashboard

Internal administration dashboard for managing the LOGISTICORE platform.

## Overview

This application provides:
- Fleet management interface
- Analytics and reporting dashboards
- User and system management
- Configuration tools
- Real-time monitoring

## Technology Stack

- **Framework**: Next.js 15 or standalone React
- **UI**: React 19 + shadcn/ui components
- **Styling**: Tailwind CSS
- **Charts**: Recharts or Chart.js
- **Auth**: NextAuth.js with admin role check

## Development

```bash
# Install dependencies (from root)
npm install

# Run development server
npm run dev:admin

# Build for production
npm run build:admin
```

## Features

### Current
- Placeholder application structure
- Integration with @logisticore packages

### Planned
- Dashboard with key metrics
- Fleet management (vehicles, drivers)
- Route monitoring and optimization
- Shipment management
- User management
- System configuration
- Analytics and reports

## Structure

```
apps/admin/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── dashboard/    # Main dashboard
│   │   ├── fleet/        # Fleet management
│   │   ├── shipments/    # Shipment tracking
│   │   └── settings/     # Configuration
│   ├── components/       # React components
│   ├── lib/             # Utilities
│   └── types/           # TypeScript types
├── public/              # Static assets
└── package.json
```

## Dashboard Sections

### Overview Dashboard
- Total shipments today
- Active vehicles
- On-time delivery rate
- Fleet utilization

### Fleet Management
- Vehicle list and status
- Driver assignments
- Maintenance schedules
- Performance metrics

### Route Optimization
- Live route monitoring
- Optimization suggestions
- Historical route analysis
- Scenario simulation

### Shipments
- All shipments list
- Status tracking
- Manual updates
- Issue resolution

### Analytics
- Performance trends
- Cost analysis
- Delivery metrics
- Driver performance

## Integration with Shared Packages

```typescript
import { Shipment, Vehicle, Driver } from '@logisticore/data-models';
import { 
  simulateFleet, 
  calculatePerformanceScore 
} from '@logisticore/sim-engine';

// Use simulation for capacity planning
const fleetPerformance = simulateFleet(config, demand);
```

## Authentication

Admin-only access with role-based permissions:

```typescript
// Middleware check
if (session.user.role !== 'ADMIN') {
  return redirect('/unauthorized');
}
```

## Environment Variables

Create `.env.local` file:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-here"
ADMIN_API_KEY="admin-api-key"
```

## Deployment

Deployed on Vercel with authentication:
- Protected routes with NextAuth.js
- Admin role verification
- Audit logging

---

**Status**: 🚧 Week 0-1 Scaffolding Phase
