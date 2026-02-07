# apps/demo-api - LOGISTICORE Demo REST API

RESTful API service for demonstrations and integrations with the LOGISTICORE platform.

## Overview

This API provides:
- REST endpoints for logistics operations
- Webhook integrations
- Rate limiting and authentication
- OpenAPI/Swagger documentation
- Demo data for testing

## Technology Stack

- **Framework**: Express.js or Fastify
- **Language**: TypeScript
- **Validation**: Zod (from @logisticore/data-models)
- **Documentation**: Swagger/OpenAPI

## Development

```bash
# Install dependencies (from root)
npm install

# Run development server
npm run dev:api

# Build for production
npm run build:api
```

## API Endpoints

### Shipments
- `GET /api/shipments` - List all shipments
- `GET /api/shipments/:id` - Get shipment details
- `POST /api/shipments` - Create new shipment
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment

### Routes
- `GET /api/routes` - List all routes
- `POST /api/routes/optimize` - Optimize route
- `GET /api/routes/:id` - Get route details

### Vehicles
- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Register new vehicle

### Simulation
- `POST /api/simulate/deliveries` - Run delivery simulation
- `POST /api/simulate/fleet` - Run fleet simulation
- `POST /api/optimize/route` - Optimize delivery route
- `POST /api/optimize/load` - Balance load across fleet

## Structure

```
apps/demo-api/
├── src/
│   ├── routes/          # API route handlers
│   ├── middleware/      # Express middleware
│   ├── services/        # Business logic
│   └── index.ts         # Entry point
├── package.json
└── tsconfig.json
```

## Integration with Shared Packages

Uses shared packages for type safety and business logic:

```typescript
import { Shipment, Vehicle, CreateShipmentSchema } from '@logisticore/data-models';
import { optimizeRoute, simulateDeliveries } from '@logisticore/sim-engine';
```

## Authentication

API keys or JWT tokens for authentication:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:4000/api/shipments
```

## Environment Variables

Create `.env` file:

```env
PORT=4000
DATABASE_URL="postgresql://..."
API_KEY="your-api-key"
RATE_LIMIT=100
```

## Rate Limiting

- 100 requests per 15 minutes per API key
- 1000 requests per day for free tier

## Documentation

API documentation available at:
- Swagger UI: `http://localhost:4000/api-docs`
- OpenAPI spec: `http://localhost:4000/api-docs.json`

## Deployment

Can be deployed to:
- Vercel Serverless Functions
- AWS Lambda
- Docker container

---

**Status**: 🚧 Week 0-1 Scaffolding Phase
