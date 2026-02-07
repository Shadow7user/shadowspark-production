/**
 * LOGISTICORE Demo API
 * Express.js REST API for logistics operations
 */

import express from 'express';
import cors from 'cors';
import { optimizeRoute, simulateDeliveries } from '@logisticore/sim-engine';
import type { Coordinates } from '@logisticore/data-models';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Example route optimization endpoint
app.post('/api/optimize/route', (req, res) => {
  try {
    const { startLocation, endLocation, waypoints, vehicleSpeed } = req.body;
    
    const optimized = optimizeRoute({
      startLocation,
      endLocation,
      waypoints,
      vehicleSpeed
    });
    
    res.json({
      success: true,
      data: optimized
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Example shipment tracking endpoint
app.get('/api/shipments/:trackingNumber', (req, res) => {
  const { trackingNumber } = req.params;
  
  // Mock response - in real app, fetch from database
  res.json({
    success: true,
    data: {
      trackingNumber,
      status: 'IN_PROGRESS',
      currentLocation: {
        latitude: 6.5244,
        longitude: 3.3792,
        address: 'Lagos, Nigeria'
      },
      estimatedDelivery: new Date(Date.now() + 86400000).toISOString()
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LOGISTICORE Demo API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
