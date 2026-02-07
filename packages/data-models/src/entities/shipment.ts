/**
 * Shipment entity types
 */

import type { Address, Priority, Status, TimeWindow, Metadata } from '../types/common';

export enum ShipmentType {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  SAME_DAY = 'SAME_DAY',
  FREIGHT = 'FREIGHT'
}

export interface PackageDimensions {
  length: number; // cm
  width: number; // cm
  height: number; // cm
  weight: number; // kg
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  type: ShipmentType;
  priority: Priority;
  status: Status;
  
  // Origin and Destination
  origin: Address;
  destination: Address;
  
  // Package Details
  dimensions: PackageDimensions;
  description: string;
  value: number; // monetary value
  
  // Scheduling
  pickupTime?: Date;
  deliveryTime?: Date;
  estimatedDelivery?: Date;
  timeWindow?: TimeWindow;
  
  // Assignment
  vehicleId?: string;
  driverId?: string;
  routeId?: string;
  
  // Tracking
  currentLocation?: Address;
  statusHistory: ShipmentStatusUpdate[];
  
  // Metadata
  metadata?: Metadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShipmentStatusUpdate {
  status: Status;
  location?: Address;
  timestamp: Date;
  notes?: string;
  updatedBy: string;
}

export interface CreateShipmentInput {
  type: ShipmentType;
  priority: Priority;
  origin: Address;
  destination: Address;
  dimensions: PackageDimensions;
  description: string;
  value: number;
  timeWindow?: TimeWindow;
  metadata?: Metadata;
}

export interface UpdateShipmentInput {
  status?: Status;
  currentLocation?: Address;
  estimatedDelivery?: Date;
  vehicleId?: string;
  driverId?: string;
  routeId?: string;
  metadata?: Metadata;
}
