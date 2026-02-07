# @logisticore/sim-engine

Logistics simulation and optimization engine for the LOGISTICORE platform.

## Installation

This package is part of the LOGISTICORE monorepo and is automatically available to all applications via workspace references.

```typescript
import { optimizeRoute, simulateFleet } from '@logisticore/sim-engine';
```

## Features

- **Route Optimization**: Nearest-neighbor algorithm for delivery routes
- **Load Balancing**: Bin-packing algorithm for fleet utilization
- **Delivery Simulation**: Scenario modeling and analysis
- **Fleet Planning**: Capacity planning and ROI calculations
- **Distance Calculations**: Haversine formula for accurate distances
- **Performance Metrics**: KPI calculations and analytics

## Modules

### Route Optimization (`algorithms/routeOptimizer`)

Optimize delivery routes using nearest-neighbor heuristic:

```typescript
import { optimizeRoute } from '@logisticore/sim-engine';

const optimized = optimizeRoute({
  startLocation: { latitude: 6.5244, longitude: 3.3792 },
  endLocation: { latitude: 6.5244, longitude: 3.3792 },
  waypoints: [
    { location: { latitude: 6.6018, longitude: 3.3515 }, shipmentIds: ['S1'] }
  ],
  vehicleSpeed: 45
});

console.log(`Distance: ${optimized.totalDistance}km`);
console.log(`Duration: ${optimized.estimatedDuration} minutes`);
```

### Load Balancing (`algorithms/loadBalancer`)

Balance shipments across available vehicles:

```typescript
import { balanceLoad } from '@logisticore/sim-engine';

const result = balanceLoad(shipments, vehicles);
console.log(`Used ${result.totalVehiclesUsed} vehicles`);
console.log(`Average utilization: ${result.averageUtilization}%`);
```

### Delivery Simulation (`simulators/deliverySimulator`)

Simulate delivery operations over time:

```typescript
import { simulateDeliveries } from '@logisticore/sim-engine';

const simulation = simulateDeliveries({
  routes: myRoutes,
  shipments: myShipments,
  simulationDays: 30,
  delayProbability: 0.10
});

console.log(`On-time rate: ${simulation.onTimePercentage}%`);
```

### Fleet Simulation (`simulators/fleetSimulator`)

Plan fleet capacity and analyze performance:

```typescript
import { simulateFleet } from '@logisticore/sim-engine';

const performance = simulateFleet(
  {
    vehicleCount: 10,
    averageSpeed: 40,
    workingHoursPerDay: 8,
    maintenanceRate: 10
  },
  {
    dailyShipments: 50,
    peakDayMultiplier: 1.5,
    averageDistance: 15
  }
);

console.log(performance.insights);
```

### Distance Utilities (`utils/distance`)

Calculate distances between coordinates:

```typescript
import { calculateDistance } from '@logisticore/sim-engine';

const distance = calculateDistance(
  { latitude: 6.5244, longitude: 3.3792 },
  { latitude: 6.6018, longitude: 3.3515 }
);
console.log(`Distance: ${distance}km`);
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
├── algorithms/       # Optimization algorithms
│   ├── routeOptimizer.ts
│   └── loadBalancer.ts
├── simulators/       # Simulation engines
│   ├── deliverySimulator.ts
│   └── fleetSimulator.ts
├── utils/           # Utility functions
│   ├── distance.ts
│   └── performance.ts
└── index.ts         # Main export file
```

## Algorithm Complexity

- **Route Optimization**: O(n²) where n is waypoints
- **Load Balancing**: O(n × m) where n is shipments, m is vehicles
- **Distance Calculation**: O(1)

## API Reference

See [API Reference](../../docs/API_REFERENCE.md) for detailed documentation.

---

**Version**: 1.0.0  
**License**: Proprietary
