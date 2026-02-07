/**
 * Distance calculation utilities
 */

import type { Coordinates } from '@logisticore/data-models';

/**
 * Calculate great-circle distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(from: Coordinates, to: Coordinates): number {
  const R = 6371; // Earth's radius in km
  
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);
  
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate total distance for a route
 */
export function calculateRouteDistance(points: Coordinates[]): number {
  let totalDistance = 0;
  
  for (let i = 0; i < points.length - 1; i++) {
    totalDistance += calculateDistance(points[i], points[i + 1]);
  }
  
  return totalDistance;
}

/**
 * Find nearest point from a given location
 */
export function findNearestPoint(
  from: Coordinates,
  points: Coordinates[]
): { index: number; distance: number; point: Coordinates } | null {
  if (points.length === 0) return null;
  
  let nearestIndex = 0;
  let minDistance = calculateDistance(from, points[0]);
  
  for (let i = 1; i < points.length; i++) {
    const distance = calculateDistance(from, points[i]);
    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = i;
    }
  }
  
  return {
    index: nearestIndex,
    distance: minDistance,
    point: points[nearestIndex]
  };
}

/**
 * Check if a point is within a radius of another point
 */
export function isWithinRadius(
  center: Coordinates,
  point: Coordinates,
  radiusKm: number
): boolean {
  return calculateDistance(center, point) <= radiusKm;
}
