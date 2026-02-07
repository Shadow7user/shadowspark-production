/**
 * Performance calculation utilities
 */

export interface PerformanceMetrics {
  totalDeliveries: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  averageDeliveryTime: number;
}

/**
 * Calculate on-time delivery rate
 */
export function calculateOnTimeRate(metrics: PerformanceMetrics): number {
  if (metrics.totalDeliveries === 0) return 0;
  return Math.round((metrics.onTimeDeliveries / metrics.totalDeliveries) * 100);
}

/**
 * Calculate performance score (0-100)
 */
export function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  const onTimeRate = calculateOnTimeRate(metrics);
  
  // Weight: 70% on-time rate, 30% inverse of average delay
  const onTimeScore = onTimeRate * 0.7;
  
  // Normalize average delivery time (assuming 60 min is baseline)
  const timeScore = Math.max(0, 100 - (metrics.averageDeliveryTime / 60) * 100) * 0.3;
  
  return Math.round(onTimeScore + timeScore);
}

/**
 * Calculate efficiency (deliveries per km)
 */
export function calculateEfficiency(
  totalDeliveries: number,
  totalDistance: number
): number {
  if (totalDistance === 0) return 0;
  return Math.round((totalDeliveries / totalDistance) * 100) / 100;
}

/**
 * Calculate cost per delivery
 */
export function calculateCostPerDelivery(
  totalCosts: number,
  totalDeliveries: number
): number {
  if (totalDeliveries === 0) return 0;
  return Math.round((totalCosts / totalDeliveries) * 100) / 100;
}

/**
 * Calculate profit margin
 */
export function calculateProfitMargin(
  revenue: number,
  costs: number
): number {
  if (revenue === 0) return 0;
  return Math.round(((revenue - costs) / revenue) * 100 * 10) / 10;
}
