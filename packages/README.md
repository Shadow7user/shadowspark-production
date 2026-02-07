# LOGISTICORE Packages

Shared packages used across all LOGISTICORE applications.

## Available Packages

### @logisticore/data-models
Shared TypeScript types and data structures.

**Features**:
- Entity types (Shipment, Vehicle, Route, Warehouse, Driver)
- Common types (Coordinates, Address, Status, Priority)
- Validation schemas (Zod)
- Type-safe data structures

**Usage**:
```typescript
import { Shipment, Vehicle, Status } from '@logisticore/data-models';
```

[📖 Full Documentation](./data-models/README.md)

### @logisticore/sim-engine
Logistics simulation and optimization engine.

**Features**:
- Route optimization (nearest-neighbor algorithm)
- Load balancing (bin-packing algorithm)
- Delivery simulation
- Fleet capacity planning
- Performance metrics

**Usage**:
```typescript
import { optimizeRoute, simulateFleet } from '@logisticore/sim-engine';
```

[📖 Full Documentation](./sim-engine/README.md)

## Development

### Building Packages

```bash
# Build all packages
npm run build:packages

# Build specific package
npm run build:data-models
npm run build:sim-engine

# Watch mode
cd packages/data-models
npm run dev
```

### Adding a New Package

1. Create package directory:
   ```bash
   mkdir -p packages/new-package/src
   cd packages/new-package
   ```

2. Create `package.json`:
   ```json
   {
     "name": "@logisticore/new-package",
     "version": "1.0.0",
     "main": "./dist/index.js",
     "types": "./dist/index.d.ts"
   }
   ```

3. Create `tsconfig.json`
4. Add to root workspaces in root `package.json`
5. Update `turbo.json` if needed

## Package Dependencies

```
@logisticore/sim-engine
    ↓ depends on
@logisticore/data-models
```

Applications can depend on both packages.

## Version Management

All packages use workspace versioning:
- Local development: `workspace:*`
- Published: Semantic versioning (1.0.0, 1.1.0, etc.)

## Publishing (Future)

When ready to publish to npm:

```bash
# Update versions
npm version patch  # or minor, major

# Build
npm run build:packages

# Publish
npm publish --workspace=@logisticore/data-models
npm publish --workspace=@logisticore/sim-engine
```

---

For detailed information about each package, see their individual README files.
