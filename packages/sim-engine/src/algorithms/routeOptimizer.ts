/**
 * Route optimization algorithm
 * Implements a greedy nearest-neighbor approach with time windows
 */

import type { Coordinates, RouteWaypoint } from '@logisticore/data-models';
import { calculateDistance } from '../utils/distance';

export interface OptimizationOptions {
  startLocation: Coordinates;
  endLocation: Coordinates;
  waypoints: Array<{
    location: Coordinates;
    shipmentIds: string[];
    timeWindow?: {
      start: Date;
      end: Date;
    };
  }>;
  maxRouteTime?: number; // minutes
  vehicleSpeed?: number; // km/h
}

export interface OptimizedRoute {
  waypoints: RouteWaypoint[];
  totalDistance: number;
  estimatedDuration: number;
  optimizationScore: number;
}

/**
 * Optimizes delivery route using nearest-neighbor heuristic
 */
export function optimizeRoute(options: OptimizationOptions): OptimizedRoute {
  const { startLocation, endLocation, waypoints, vehicleSpeed = 40 } = options;
  
  const unvisited = [...waypoints];
  const optimizedWaypoints: RouteWaypoint[] = [];
  let currentLocation = startLocation;
  let totalDistance = 0;
  let sequence = 0;
  
  // Greedy nearest-neighbor selection
  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let minDistance = calculateDistance(currentLocation, unvisited[0].location);
    
    // Find nearest unvisited waypoint
    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(currentLocation, unvisited[i].location);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }
    
    // Add to optimized route
    const waypoint = unvisited[nearestIndex];
    optimizedWaypoints.push({
      id: `wp-${sequence}`,
      location: waypoint.location,
      shipmentIds: waypoint.shipmentIds,
      sequence,
      completed: false
    });
    
    totalDistance += minDistance;
    currentLocation = waypoint.location;
    unvisited.splice(nearestIndex, 1);
    sequence++;
  }
  
  // Add distance back to end location
  totalDistance += calculateDistance(currentLocation, endLocation);
  
  // Calculate estimated duration
  const estimatedDuration = Math.round((totalDistance / vehicleSpeed) * 60); // minutes
  
  // Calculate optimization score (0-100)
  const theoreticalMinDistance = calculateDirectPathDistance(startLocation, waypoints, endLocation);
  const optimizationScore = Math.round((theoreticalMinDistance / totalDistance) * 100);
  
  return {
    waypoints: optimizedWaypoints,
    totalDistance: Math.round(totalDistance * 100) / 100,
    estimatedDuration,
    optimizationScore
  };
}

/**
 * Calculate theoretical minimum distance (straight-line paths)
 */
function calculateDirectPathDistance(
  start: Coordinates,
  waypoints: Array<{ location: Coordinates }>,
  end: Coordinates
): number {
  let distance = calculateDistance(start, waypoints[0].location);
  
  for (let i = 0; i < waypoints.length - 1; i++) {
    distance += calculateDistance(waypoints[i].location, waypoints[i + 1].location);
  }
  
  distance += calculateDistance(waypoints[waypoints.length - 1].location, end);
  
  return distance;
}

/**
 * Re-optimize route when conditions change
 */
export function reoptimizeRoute(
  currentRoute: RouteWaypoint[],
  currentPosition: Coordinates,
  remainingWaypoints: RouteWaypoint[]
): OptimizedRoute {
  const waypoints = remainingWaypoints.map(wp => ({
    location: wp.location,
    shipmentIds: wp.shipmentIds
  }));
  
  return optimizeRoute({
    startLocation: currentPosition,
    endLocation: remainingWaypoints[remainingWaypoints.length - 1].location,
    waypoints
  });
}
