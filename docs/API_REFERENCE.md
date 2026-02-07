# LOGISTICORE API Reference

## @logisticore/data-models

Shared TypeScript types and data structures for the LOGISTICORE platform.

### Installation

```typescript
import { Shipment, Vehicle, Route, Warehouse, Driver } from '@logisticore/data-models';
```

### Common Types

#### Coordinates
```typescript
type Coordinates = {
  latitude: number;   // -90 to 90
  longitude: number;  // -180 to 180
};
```

#### Address
```typescript
type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: Coordinates;
};
```

#### Status
```typescript
enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}
```

#### Priority
```typescript
enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}
```

### Entity Types

#### Shipment

```typescript
interface Shipment {
  id: string;
  trackingNumber: string;
  type: ShipmentType;
  priority: Priority;
  status: Status;
  origin: Address;
  destination: Address;
  dimensions: PackageDimensions;
  description: string;
  value: number;
  pickupTime?: Date;
  deliveryTime?: Date;
  estimatedDelivery?: Date;
  vehicleId?: string;
  driverId?: string;
  routeId?: string;
  currentLocation?: Address;
  statusHistory: ShipmentStatusUpdate[];
  metadata?: Metadata;
  createdAt: Date;
  updatedAt: Date;
}

enum ShipmentType {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  SAME_DAY = 'SAME_DAY',
  FREIGHT = 'FREIGHT'
}

interface PackageDimensions {
  length: number;  // cm
  width: number;   // cm
  height: number;  // cm
  weight: number;  // kg
}
```

#### Vehicle

```typescript
interface Vehicle {
  id: string;
  registrationNumber: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  capacity: VehicleCapacity;
  status: Status;
  currentLocation?: Coordinates;
  assignedDriverId?: string;
  currentRouteId?: string;
  mileage: number;
  fuelLevel?: number;
  metadata?: Metadata;
  createdAt: Date;
  updatedAt: Date;
}

enum VehicleType {
  VAN = 'VAN',
  TRUCK = 'TRUCK',
  SEMI_TRAILER = 'SEMI_TRAILER',
  MOTORCYCLE = 'MOTORCYCLE'
}

interface VehicleCapacity {
  maxWeight: number;    // kg
  maxVolume: number;    // cubic meters
  maxPallets?: number;
}
```

#### Route

```typescript
interface Route {
  id: string;
  name: string;
  status: Status;
  vehicleId: string;
  driverId: string;
  waypoints: RouteWaypoint[];
  startLocation: Coordinates;
  endLocation: Coordinates;
  plannedStartTime: Date;
  plannedEndTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  totalDistance: number;        // km
  estimatedDuration: number;    // minutes
  currentWaypointIndex: number;
  completedWaypoints: number;
  optimizationScore?: number;
  metadata?: Metadata;
  createdAt: Date;
  updatedAt: Date;
}

interface RouteWaypoint {
  id: string;
  location: Coordinates;
  address?: string;
  arrivalTime?: Date;
  departureTime?: Date;
  shipmentIds: string[];
  sequence: number;
  completed: boolean;
}
```

#### Driver

```typescript
interface Driver {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  license: DriverLicense;
  status: DriverStatus;
  currentVehicleId?: string;
  currentRouteId?: string;
  totalDeliveries: number;
  rating: number;              // 0-5
  onTimeDeliveryRate: number;  // percentage
  hoursWorkedToday: number;
  maxHoursPerDay: number;
  metadata?: Metadata;
  createdAt: Date;
  updatedAt: Date;
}

enum DriverStatus {
  AVAILABLE = 'AVAILABLE',
  ON_ROUTE = 'ON_ROUTE',
  ON_BREAK = 'ON_BREAK',
  OFF_DUTY = 'OFF_DUTY'
}
```

#### Warehouse

```typescript
interface Warehouse {
  id: string;
  code: string;
  name: string;
  type: WarehouseType;
  address: Address;
  coordinates: Coordinates;
  capacity: WarehouseCapacity;
  currentUtilization: number;  // percentage
  operatingHours: {
    open: string;   // HH:mm
    close: string;  // HH:mm
  };
  isOperational: boolean;
  inventoryCount: number;
  metadata?: Metadata;
  createdAt: Date;
  updatedAt: Date;
}

enum WarehouseType {
  DISTRIBUTION_CENTER = 'DISTRIBUTION_CENTER',
  FULFILLMENT = 'FULFILLMENT',
  CROSS_DOCK = 'CROSS_DOCK',
  COLD_STORAGE = 'COLD_STORAGE'
}
```

---

## @logisticore/sim-engine

Logistics simulation and optimization engine.

### Installation

```typescript
import {
  optimizeRoute,
  balanceLoad,
  simulateDeliveries,
  simulateFleet,
  calculateDistance
} from '@logisticore/sim-engine';
```

### Route Optimization

#### optimizeRoute()

Optimizes delivery route using nearest-neighbor heuristic.

```typescript
function optimizeRoute(options: OptimizationOptions): OptimizedRoute

interface OptimizationOptions {
  startLocation: Coordinates;
  endLocation: Coordinates;
  waypoints: Array<{
    location: Coordinates;
    shipmentIds: string[];
    timeWindow?: { start: Date; end: Date };
  }>;
  maxRouteTime?: number;    // minutes
  vehicleSpeed?: number;    // km/h (default: 40)
}

interface OptimizedRoute {
  waypoints: RouteWaypoint[];
  totalDistance: number;
  estimatedDuration: number;
  optimizationScore: number;  // 0-100
}
```

**Example**:
```typescript
const optimized = optimizeRoute({
  startLocation: { latitude: 6.5244, longitude: 3.3792 },
  endLocation: { latitude: 6.5244, longitude: 3.3792 },
  waypoints: [
    { location: { latitude: 6.6018, longitude: 3.3515 }, shipmentIds: ['S1', 'S2'] },
    { location: { latitude: 6.4531, longitude: 3.3958 }, shipmentIds: ['S3'] }
  ],
  vehicleSpeed: 50
});

console.log(`Total distance: ${optimized.totalDistance}km`);
console.log(`Estimated duration: ${optimized.estimatedDuration} minutes`);
```

### Load Balancing

#### balanceLoad()

Balances shipments across available vehicles using first-fit decreasing algorithm.

```typescript
function balanceLoad(
  shipments: Shipment[],
  vehicles: Array<{ id: string; capacity: VehicleCapacity }>
): LoadBalancingResult

interface LoadBalancingResult {
  assignments: LoadAssignment[];
  unassignedShipments: string[];
  averageUtilization: number;
  totalVehiclesUsed: number;
}

interface LoadAssignment {
  vehicleId: string;
  shipmentIds: string[];
  totalWeight: number;
  totalVolume: number;
  utilizationRate: number;  // percentage
}
```

**Example**:
```typescript
const result = balanceLoad(shipments, vehicles);
console.log(`Used ${result.totalVehiclesUsed} vehicles`);
console.log(`Average utilization: ${result.averageUtilization}%`);
```

#### suggestFleetSize()

Suggests optimal fleet size based on shipment volume.

```typescript
function suggestFleetSize(
  monthlyShipments: number,
  averageShipmentsPerVehiclePerDay: number,
  workingDaysPerMonth?: number  // default: 22
): {
  recommendedVehicles: number;
  utilizationRate: number;
  reasoning: string;
}
```

### Delivery Simulation

#### simulateDeliveries()

Simulates delivery operations over a period.

```typescript
function simulateDeliveries(params: SimulationParams): SimulationResult

interface SimulationParams {
  routes: Route[];
  shipments: Shipment[];
  simulationDays: number;
  delayProbability?: number;      // 0-1 (default: 0.15)
  averageDelayMinutes?: number;   // default: 30
}

interface SimulationResult {
  totalDeliveries: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  averageDelay: number;
  onTimePercentage: number;
  totalDistanceTraveled: number;
  totalTimeSpent: number;
}
```

**Example**:
```typescript
const simulation = simulateDeliveries({
  routes: myRoutes,
  shipments: myShipments,
  simulationDays: 30,
  delayProbability: 0.10  // 10% chance of delay
});

console.log(`On-time rate: ${simulation.onTimePercentage}%`);
```

#### compareScenarios()

Compares two simulation scenarios.

```typescript
function compareScenarios(
  scenario1: SimulationResult,
  scenario2: SimulationResult
): {
  improvement: {
    onTimePercentage: number;
    averageDelay: number;
    efficiency: number;
  };
  recommendation: string;
}
```

### Fleet Simulation

#### simulateFleet()

Simulates fleet performance against demand.

```typescript
function simulateFleet(
  config: FleetConfig,
  demand: DemandProfile
): FleetPerformance

interface FleetConfig {
  vehicleCount: number;
  averageSpeed: number;         // km/h
  workingHoursPerDay: number;
  maintenanceRate: number;      // percentage unavailable
}

interface DemandProfile {
  dailyShipments: number;
  peakDayMultiplier: number;
  averageDistance: number;      // km per delivery
}

interface FleetPerformance {
  dailyCapacity: number;
  peakCapacity: number;
  utilizationRate: number;
  canHandlePeakDemand: boolean;
  recommendedVehicles: number;
  insights: string[];
}
```

**Example**:
```typescript
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

### Utility Functions

#### calculateDistance()

Calculates great-circle distance using Haversine formula.

```typescript
function calculateDistance(from: Coordinates, to: Coordinates): number  // km
```

#### calculateRouteDistance()

Calculates total distance for a route with multiple points.

```typescript
function calculateRouteDistance(points: Coordinates[]): number  // km
```

#### findNearestPoint()

Finds the nearest point from a given location.

```typescript
function findNearestPoint(
  from: Coordinates,
  points: Coordinates[]
): { index: number; distance: number; point: Coordinates } | null
```

#### isWithinRadius()

Checks if a point is within a radius of another point.

```typescript
function isWithinRadius(
  center: Coordinates,
  point: Coordinates,
  radiusKm: number
): boolean
```

### Performance Utilities

#### calculateOnTimeRate()

```typescript
function calculateOnTimeRate(metrics: PerformanceMetrics): number  // percentage
```

#### calculatePerformanceScore()

```typescript
function calculatePerformanceScore(metrics: PerformanceMetrics): number  // 0-100
```

#### calculateEfficiency()

```typescript
function calculateEfficiency(
  totalDeliveries: number,
  totalDistance: number
): number  // deliveries per km
```

---

## Usage Examples

### Complete Route Planning Example

```typescript
import { optimizeRoute, balanceLoad } from '@logisticore/sim-engine';
import type { Coordinates } from '@logisticore/data-models';

// 1. Balance shipments across vehicles
const loadResult = balanceLoad(shipments, vehicles);

// 2. For each vehicle, optimize route
for (const assignment of loadResult.assignments) {
  const vehicleShipments = shipments.filter(s => 
    assignment.shipmentIds.includes(s.id)
  );
  
  const waypoints = vehicleShipments.map(s => ({
    location: s.destination.coordinates!,
    shipmentIds: [s.id]
  }));
  
  const optimized = optimizeRoute({
    startLocation: warehouse.coordinates,
    endLocation: warehouse.coordinates,
    waypoints,
    vehicleSpeed: 45
  });
  
  console.log(`Vehicle ${assignment.vehicleId}:`);
  console.log(`  - ${optimized.waypoints.length} stops`);
  console.log(`  - ${optimized.totalDistance}km`);
  console.log(`  - ${optimized.estimatedDuration} minutes`);
}
```

### Simulation and Analysis Example

```typescript
import { simulateDeliveries, compareScenarios } from '@logisticore/sim-engine';

// Simulate current scenario
const currentScenario = simulateDeliveries({
  routes: currentRoutes,
  shipments: allShipments,
  simulationDays: 30
});

// Simulate optimized scenario
const optimizedScenario = simulateDeliveries({
  routes: optimizedRoutes,
  shipments: allShipments,
  simulationDays: 30
});

// Compare
const comparison = compareScenarios(currentScenario, optimizedScenario);
console.log(comparison.recommendation);
console.log(`On-time improvement: ${comparison.improvement.onTimePercentage}%`);
```

---

## Type Safety

All functions are fully typed. TypeScript will provide:
- Autocomplete for function parameters
- Type checking at compile time
- IntelliSense documentation

```typescript
// TypeScript will catch this error
optimizeRoute({
  startLocation: { lat: 6.5, lng: 3.3 },  // ❌ Wrong property names
  // ...
});

// Correct usage
optimizeRoute({
  startLocation: { latitude: 6.5, longitude: 3.3 },  // ✅ Correct
  // ...
});
```

---

For more examples and use cases, see the test files in each package directory.
