/**
 * Warehouse entity types
 */

import type { Address, Coordinates, Metadata } from '../types/common';

export enum WarehouseType {
  DISTRIBUTION_CENTER = 'DISTRIBUTION_CENTER',
  FULFILLMENT = 'FULFILLMENT',
  CROSS_DOCK = 'CROSS_DOCK',
  COLD_STORAGE = 'COLD_STORAGE'
}

export interface WarehouseCapacity {
  totalArea: number; // square meters
  storageCapacity: number; // pallets
  dockDoors: number;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  type: WarehouseType;
  
  // Location
  address: Address;
  coordinates: Coordinates;
  
  // Capacity
  capacity: WarehouseCapacity;
  currentUtilization: number; // percentage
  
  // Operational
  operatingHours: {
    open: string; // HH:mm
    close: string; // HH:mm
  };
  isOperational: boolean;
  
  // Inventory
  inventoryCount: number;
  
  // Metadata
  metadata?: Metadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: string;
  warehouseId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  location: string; // bay/aisle/shelf
  lastUpdated: Date;
}

export interface CreateWarehouseInput {
  code: string;
  name: string;
  type: WarehouseType;
  address: Address;
  coordinates: Coordinates;
  capacity: WarehouseCapacity;
  operatingHours: {
    open: string;
    close: string;
  };
  metadata?: Metadata;
}

export interface UpdateWarehouseInput {
  name?: string;
  isOperational?: boolean;
  currentUtilization?: number;
  operatingHours?: {
    open: string;
    close: string;
  };
  metadata?: Metadata;
}
