/**
 * Vehicle entity types
 */

import type { Coordinates, Status, Metadata } from '../types/common';

export enum VehicleType {
  VAN = 'VAN',
  TRUCK = 'TRUCK',
  SEMI_TRAILER = 'SEMI_TRAILER',
  MOTORCYCLE = 'MOTORCYCLE'
}

export interface VehicleCapacity {
  maxWeight: number; // kg
  maxVolume: number; // cubic meters
  maxPallets?: number;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  
  // Capacity
  capacity: VehicleCapacity;
  
  // Status
  status: Status;
  currentLocation?: Coordinates;
  
  // Assignment
  assignedDriverId?: string;
  currentRouteId?: string;
  
  // Maintenance
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  mileage: number; // km
  
  // Tracking
  fuelLevel?: number; // percentage
  batteryLevel?: number; // percentage (for electric)
  
  // Metadata
  metadata?: Metadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVehicleInput {
  registrationNumber: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  capacity: VehicleCapacity;
  metadata?: Metadata;
}

export interface UpdateVehicleInput {
  status?: Status;
  currentLocation?: Coordinates;
  assignedDriverId?: string;
  currentRouteId?: string;
  mileage?: number;
  fuelLevel?: number;
  batteryLevel?: number;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  metadata?: Metadata;
}
