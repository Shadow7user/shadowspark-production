/**
 * Fleet simulation for capacity planning
 */

export interface FleetConfig {
  vehicleCount: number;
  averageSpeed: number; // km/h
  workingHoursPerDay: number;
  maintenanceRate: number; // percentage unavailable
}

export interface DemandProfile {
  dailyShipments: number;
  peakDayMultiplier: number;
  averageDistance: number; // km per delivery
}

export interface FleetPerformance {
  dailyCapacity: number;
  peakCapacity: number;
  utilizationRate: number;
  canHandlePeakDemand: boolean;
  recommendedVehicles: number;
  insights: string[];
}

/**
 * Simulate fleet performance against demand
 */
export function simulateFleet(
  config: FleetConfig,
  demand: DemandProfile
): FleetPerformance {
  const insights: string[] = [];
  
  // Calculate effective fleet size (accounting for maintenance)
  const effectiveVehicles = Math.floor(
    config.vehicleCount * (1 - config.maintenanceRate / 100)
  );
  
  // Calculate deliveries per vehicle per day
  const kmPerVehiclePerDay = config.averageSpeed * config.workingHoursPerDay;
  const deliveriesPerVehicle = Math.floor(kmPerVehiclePerDay / demand.averageDistance);
  
  // Calculate capacities
  const dailyCapacity = effectiveVehicles * deliveriesPerVehicle;
  const peakCapacity = dailyCapacity;
  
  // Calculate peak demand
  const peakDemand = Math.round(demand.dailyShipments * demand.peakDayMultiplier);
  
  // Utilization
  const utilizationRate = Math.round((demand.dailyShipments / dailyCapacity) * 100);
  const canHandlePeakDemand = peakCapacity >= peakDemand;
  
  // Recommendations
  let recommendedVehicles = config.vehicleCount;
  
  if (!canHandlePeakDemand) {
    const additionalNeeded = Math.ceil(
      (peakDemand - peakCapacity) / deliveriesPerVehicle / (1 - config.maintenanceRate / 100)
    );
    recommendedVehicles = config.vehicleCount + additionalNeeded;
    insights.push(
      `Need ${additionalNeeded} more vehicles to handle peak demand of ${peakDemand} shipments`
    );
  }
  
  if (utilizationRate < 50) {
    insights.push(
      `Low utilization (${utilizationRate}%). Consider reducing fleet size or increasing shipments`
    );
  } else if (utilizationRate > 85) {
    insights.push(
      `High utilization (${utilizationRate}%). Consider expanding fleet for buffer capacity`
    );
  } else {
    insights.push(
      `Optimal utilization (${utilizationRate}%). Fleet size is well-balanced`
    );
  }
  
  insights.push(
    `Each vehicle can handle ~${deliveriesPerVehicle} deliveries per day at ${config.averageSpeed}km/h`
  );
  
  return {
    dailyCapacity,
    peakCapacity,
    utilizationRate,
    canHandlePeakDemand,
    recommendedVehicles,
    insights
  };
}

/**
 * Calculate ROI for fleet expansion
 */
export function calculateFleetExpansionROI(
  currentVehicles: number,
  proposedVehicles: number,
  costPerVehicle: number,
  revenuePerDelivery: number,
  deliveriesPerVehiclePerMonth: number,
  monthlyMaintenanceCost: number
): {
  additionalRevenue: number;
  additionalCosts: number;
  netProfit: number;
  roi: number;
  breakEvenMonths: number;
} {
  const additionalVehicles = proposedVehicles - currentVehicles;
  const capitalInvestment = additionalVehicles * costPerVehicle;
  
  const monthlyAdditionalRevenue = additionalVehicles * deliveriesPerVehiclePerMonth * revenuePerDelivery;
  const monthlyAdditionalCosts = additionalVehicles * monthlyMaintenanceCost;
  const monthlyNetProfit = monthlyAdditionalRevenue - monthlyAdditionalCosts;
  
  const breakEvenMonths = monthlyNetProfit > 0
    ? Math.ceil(capitalInvestment / monthlyNetProfit)
    : Infinity;
  
  const annualNetProfit = monthlyNetProfit * 12;
  const roi = (annualNetProfit / capitalInvestment) * 100;
  
  return {
    additionalRevenue: Math.round(monthlyAdditionalRevenue),
    additionalCosts: Math.round(monthlyAdditionalCosts),
    netProfit: Math.round(monthlyNetProfit),
    roi: Math.round(roi * 10) / 10,
    breakEvenMonths
  };
}
