/**
 * Validation schemas using Zod
 */

import { z } from 'zod';

// Common Schemas
export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

export const AddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postalCode: z.string().min(1),
  coordinates: CoordinatesSchema.optional()
});

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20)
});

// Package Dimensions Schema
export const PackageDimensionsSchema = z.object({
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  weight: z.number().positive()
});

// Vehicle Capacity Schema
export const VehicleCapacitySchema = z.object({
  maxWeight: z.number().positive(),
  maxVolume: z.number().positive(),
  maxPallets: z.number().int().positive().optional()
});

// Driver License Schema
export const DriverLicenseSchema = z.object({
  number: z.string().min(1),
  type: z.string().min(1),
  expiryDate: z.date(),
  issuingCountry: z.string().min(2).max(2)
});

// Route Waypoint Schema
export const RouteWaypointSchema = z.object({
  location: CoordinatesSchema,
  address: z.string().optional(),
  arrivalTime: z.date().optional(),
  departureTime: z.date().optional(),
  shipmentIds: z.array(z.string()),
  sequence: z.number().int().nonnegative(),
  completed: z.boolean()
});
