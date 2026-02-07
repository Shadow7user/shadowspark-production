# @logisticore/data-models

Shared TypeScript types and data structures for the LOGISTICORE platform.

## Installation

This package is part of the LOGISTICORE monorepo and is automatically available to all applications via workspace references.

```typescript
import { Shipment, Vehicle, Route } from '@logisticore/data-models';
```

## Features

- **Type Safety**: Strongly-typed domain models
- **Runtime Validation**: Zod schemas for input validation
- **Consistent Data**: Single source of truth for types
- **Tree-Shakeable**: Import only what you need

## Exported Types

### Common Types
- `Coordinates`: Geographic coordinates (lat/lng)
- `Address`: Physical address with optional coordinates
- `Status`: Entity status enum
- `Priority`: Priority levels
- `Metadata`: Flexible metadata type

### Entity Types
- `Shipment`: Delivery shipment details
- `Vehicle`: Fleet vehicle information
- `Route`: Delivery route with waypoints
- `Warehouse`: Storage facility details
- `Driver`: Driver information and metrics

### Validation Schemas
- Zod schemas for all entity types
- Input validation for create/update operations
- Runtime type checking

## Usage Examples

### Basic Type Usage

```typescript
import type { Shipment, Status } from '@logisticore/data-models';

const shipment: Shipment = {
  id: 'S001',
  trackingNumber: 'TRK123456',
  type: 'EXPRESS',
  priority: 'HIGH',
  status: 'IN_PROGRESS',
  origin: {
    street: '123 Main St',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    postalCode: '100001'
  },
  destination: {
    street: '456 Oak Ave',
    city: 'Abuja',
    state: 'FCT',
    country: 'Nigeria',
    postalCode: '900001'
  },
  dimensions: {
    length: 50,
    width: 30,
    height: 20,
    weight: 10
  },
  description: 'Electronics package',
  value: 50000,
  statusHistory: [],
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### Validation with Zod

```typescript
import { CreateShipmentSchema } from '@logisticore/data-models';

const input = {
  type: 'EXPRESS',
  priority: 'HIGH',
  origin: { /* ... */ },
  destination: { /* ... */ },
  dimensions: { length: 50, width: 30, height: 20, weight: 10 },
  description: 'Package',
  value: 1000
};

// Validate input
const validated = CreateShipmentSchema.parse(input);
```

## Development

```bash
# Build package
npm run build

# Watch mode
npm run dev

# Type check
npm run type-check
```

## Structure

```
src/
├── entities/          # Entity type definitions
│   ├── shipment.ts
│   ├── vehicle.ts
│   ├── route.ts
│   ├── warehouse.ts
│   └── driver.ts
├── types/            # Common types
│   └── common.ts
├── schemas/          # Zod validation schemas
│   └── validation.ts
└── index.ts          # Main export file
```

## API Reference

See [API Reference](../../docs/API_REFERENCE.md) for detailed documentation.

---

**Version**: 1.0.0  
**License**: Proprietary
