/**
 * Load balancing algorithm for fleet optimization
 */

import type { Vehicle, VehicleCapacity } from '@logisticore/data-models';

export interface LoadAssignment {
  vehicleId: string;
  shipmentIds: string[];
  totalWeight: number;
  totalVolume: number;
  utilizationRate: number;
}

export interface LoadBalancingResult {
  assignments: LoadAssignment[];
  unassignedShipments: string[];
  averageUtilization: number;
  totalVehiclesUsed: number;
}

export interface Shipment {
  id: string;
  weight: number;
  volume: number;
}

/**
 * Balance load across available vehicles
 */
export function balanceLoad(
  shipments: Shipment[],
  vehicles: Array<{ id: string; capacity: VehicleCapacity }>
): LoadBalancingResult {
  // Sort shipments by weight (descending) for better bin packing
  const sortedShipments = [...shipments].sort((a, b) => b.weight - a.weight);
  
  const assignments: LoadAssignment[] = [];
  const unassignedShipments: string[] = [];
  
  // Initialize vehicle assignments
  for (const vehicle of vehicles) {
    assignments.push({
      vehicleId: vehicle.id,
      shipmentIds: [],
      totalWeight: 0,
      totalVolume: 0,
      utilizationRate: 0
    });
  }
  
  // First-fit decreasing algorithm
  for (const shipment of sortedShipments) {
    let assigned = false;
    
    for (const assignment of assignments) {
      const vehicle = vehicles.find(v => v.id === assignment.vehicleId);
      if (!vehicle) continue;
      
      // Check if shipment fits in vehicle
      const fitsWeight = assignment.totalWeight + shipment.weight <= vehicle.capacity.maxWeight;
      const fitsVolume = assignment.totalVolume + shipment.volume <= vehicle.capacity.maxVolume;
      
      if (fitsWeight && fitsVolume) {
        assignment.shipmentIds.push(shipment.id);
        assignment.totalWeight += shipment.weight;
        assignment.totalVolume += shipment.volume;
        
        // Calculate utilization (weighted average of weight and volume)
        const weightUtil = (assignment.totalWeight / vehicle.capacity.maxWeight) * 100;
        const volumeUtil = (assignment.totalVolume / vehicle.capacity.maxVolume) * 100;
        assignment.utilizationRate = Math.round((weightUtil + volumeUtil) / 2);
        
        assigned = true;
        break;
      }
    }
    
    if (!assigned) {
      unassignedShipments.push(shipment.id);
    }
  }
  
  // Calculate average utilization
  const usedVehicles = assignments.filter(a => a.shipmentIds.length > 0);
  const averageUtilization = usedVehicles.length > 0
    ? Math.round(usedVehicles.reduce((sum, a) => sum + a.utilizationRate, 0) / usedVehicles.length)
    : 0;
  
  return {
    assignments: usedVehicles,
    unassignedShipments,
    averageUtilization,
    totalVehiclesUsed: usedVehicles.length
  };
}

/**
 * Suggest optimal fleet size based on shipment volume
 */
export function suggestFleetSize(
  monthlyShipments: number,
  averageShipmentsPerVehiclePerDay: number,
  workingDaysPerMonth: number = 22
): {
  recommendedVehicles: number;
  utilizationRate: number;
  reasoning: string;
} {
  const dailyShipments = monthlyShipments / workingDaysPerMonth;
  const vehiclesNeeded = Math.ceil(dailyShipments / averageShipmentsPerVehiclePerDay);
  
  // Add 10% buffer for peak demand
  const recommendedVehicles = Math.ceil(vehiclesNeeded * 1.1);
  
  const utilizationRate = Math.round((vehiclesNeeded / recommendedVehicles) * 100);
  
  return {
    recommendedVehicles,
    utilizationRate,
    reasoning: `Based on ${monthlyShipments} monthly shipments (${Math.round(dailyShipments)} per day), ` +
      `you need ${vehiclesNeeded} vehicles. Recommended ${recommendedVehicles} with 10% buffer.`
  };
}
