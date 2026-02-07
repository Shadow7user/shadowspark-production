/**
 * Delivery simulation for scenario modeling
 */

import type { Route, Shipment } from '@logisticore/data-models';

export interface SimulationParams {
  routes: Route[];
  shipments: Shipment[];
  simulationDays: number;
  delayProbability?: number; // 0-1
  averageDelayMinutes?: number;
}

export interface SimulationResult {
  totalDeliveries: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  averageDelay: number;
  onTimePercentage: number;
  totalDistanceTraveled: number;
  totalTimeSpent: number;
}

/**
 * Simulate delivery operations over a period
 */
export function simulateDeliveries(params: SimulationParams): SimulationResult {
  const {
    routes,
    shipments,
    simulationDays,
    delayProbability = 0.15,
    averageDelayMinutes = 30
  } = params;
  
  let totalDeliveries = 0;
  let onTimeDeliveries = 0;
  let lateDeliveries = 0;
  let totalDelay = 0;
  let totalDistanceTraveled = 0;
  let totalTimeSpent = 0;
  
  // Simulate each day
  for (let day = 0; day < simulationDays; day++) {
    for (const route of routes) {
      // Simulate route execution
      const routeDeliveries = route.waypoints.length;
      totalDeliveries += routeDeliveries;
      totalDistanceTraveled += route.totalDistance;
      totalTimeSpent += route.estimatedDuration;
      
      // Simulate delays
      for (const waypoint of route.waypoints) {
        const hasDelay = Math.random() < delayProbability;
        
        if (hasDelay) {
          // Random delay around average
          const delay = Math.round(averageDelayMinutes * (0.5 + Math.random()));
          totalDelay += delay;
          lateDeliveries++;
        } else {
          onTimeDeliveries++;
        }
      }
    }
  }
  
  const averageDelay = totalDeliveries > 0 ? Math.round(totalDelay / totalDeliveries) : 0;
  const onTimePercentage = totalDeliveries > 0
    ? Math.round((onTimeDeliveries / totalDeliveries) * 100)
    : 0;
  
  return {
    totalDeliveries,
    onTimeDeliveries,
    lateDeliveries,
    averageDelay,
    onTimePercentage,
    totalDistanceTraveled: Math.round(totalDistanceTraveled),
    totalTimeSpent: Math.round(totalTimeSpent)
  };
}

/**
 * Compare two scenarios
 */
export function compareScenarios(
  scenario1: SimulationResult,
  scenario2: SimulationResult
): {
  improvement: {
    onTimePercentage: number;
    averageDelay: number;
    efficiency: number;
  };
  recommendation: string;
} {
  const onTimeImprovement = scenario2.onTimePercentage - scenario1.onTimePercentage;
  const delayImprovement = scenario1.averageDelay - scenario2.averageDelay;
  
  const efficiency1 = scenario1.totalDeliveries / (scenario1.totalDistanceTraveled / 100);
  const efficiency2 = scenario2.totalDeliveries / (scenario2.totalDistanceTraveled / 100);
  const efficiencyImprovement = ((efficiency2 - efficiency1) / efficiency1) * 100;
  
  const recommendation = onTimeImprovement > 5
    ? 'Scenario 2 shows significant improvement. Recommended for implementation.'
    : onTimeImprovement > 0
    ? 'Scenario 2 shows marginal improvement. Consider testing further.'
    : 'Scenario 1 performs better. Stick with current approach.';
  
  return {
    improvement: {
      onTimePercentage: Math.round(onTimeImprovement * 10) / 10,
      averageDelay: Math.round(delayImprovement * 10) / 10,
      efficiency: Math.round(efficiencyImprovement * 10) / 10
    },
    recommendation
  };
}
