/**
 * Driver entity types
 */

import type { Status, Metadata } from '../types/common';

export enum DriverStatus {
  AVAILABLE = 'AVAILABLE',
  ON_ROUTE = 'ON_ROUTE',
  ON_BREAK = 'ON_BREAK',
  OFF_DUTY = 'OFF_DUTY'
}

export interface DriverLicense {
  number: string;
  type: string;
  expiryDate: Date;
  issuingCountry: string;
}

export interface Driver {
  id: string;
  employeeId: string;
  
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // License
  license: DriverLicense;
  
  // Status
  status: DriverStatus;
  currentVehicleId?: string;
  currentRouteId?: string;
  
  // Performance
  totalDeliveries: number;
  rating: number; // 0-5
  onTimeDeliveryRate: number; // percentage
  
  // Work Hours
  hoursWorkedToday: number;
  maxHoursPerDay: number;
  
  // Metadata
  metadata?: Metadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDriverInput {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  license: DriverLicense;
  maxHoursPerDay?: number;
  metadata?: Metadata;
}

export interface UpdateDriverInput {
  status?: DriverStatus;
  currentVehicleId?: string;
  currentRouteId?: string;
  phone?: string;
  email?: string;
  hoursWorkedToday?: number;
  metadata?: Metadata;
}

export interface DriverPerformanceMetrics {
  driverId: string;
  period: {
    start: Date;
    end: Date;
  };
  totalDeliveries: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  averageDeliveryTime: number; // minutes
  customerRating: number;
  fuelEfficiency: number; // km per liter
}
