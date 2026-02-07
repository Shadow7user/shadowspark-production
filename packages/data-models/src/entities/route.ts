/**
 * Route entity types
 */

import type { Coordinates, Status, Metadata } from '../types/common';

export interface RouteWaypoint {
  id: string;
  location: Coordinates;
  address?: string;
  arrivalTime?: Date;
  departureTime?: Date;
  shipmentIds: string[];
  sequence: number;
  completed: boolean;
}

export interface Route {
  id: string;
  name: string;
  status: Status;
  
  // Assignment
  vehicleId: string;
  driverId: string;
  
  // Route Details
  waypoints: RouteWaypoint[];
  startLocation: Coordinates;
  endLocation: Coordinates;
  
  // Timing
  plannedStartTime: Date;
  plannedEndTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  
  // Metrics
  totalDistance: number; // km
  estimatedDuration: number; // minutes
  actualDuration?: number; // minutes
  
  // Progress
  currentWaypointIndex: number;
  completedWaypoints: number;
  
  // Optimization
  optimizationScore?: number;
  
  // Metadata
  metadata?: Metadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRouteInput {
  name: string;
  vehicleId: string;
  driverId: string;
  waypoints: Omit<RouteWaypoint, 'id' | 'completed'>[];
  plannedStartTime: Date;
  plannedEndTime: Date;
  metadata?: Metadata;
}

export interface UpdateRouteInput {
  status?: Status;
  currentWaypointIndex?: number;
  actualStartTime?: Date;
  actualEndTime?: Date;
  actualDuration?: number;
  metadata?: Metadata;
}

export interface RouteOptimizationRequest {
  vehicleId: string;
  startLocation: Coordinates;
  endLocation: Coordinates;
  shipmentIds: string[];
  timeConstraints?: {
    earliestStart: Date;
    latestEnd: Date;
  };
}

export interface RouteOptimizationResult {
  optimizedWaypoints: RouteWaypoint[];
  totalDistance: number;
  estimatedDuration: number;
  optimizationScore: number;
  savingsPercentage: number;
}
