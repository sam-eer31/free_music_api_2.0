import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { config } from './config/index.js';
import apiRoutes from './routes/api.js';
import v1Routes from './routes/v1.js';

const app = express();

// Disable technology disclosure headers
app.disable('x-powered-by');

// Bulletproof Permissive CORS Configuration
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Length');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root status & API Service Overview
app.get('/', (req, res) => {
  res.json({
    service: 'Crisper Audio Core API',
    status: 'active',
    version: '3.0.0',
    endpoint: 'GET /api/v1/audio?input=:query_or_url'
  });
});

// API Routes
app.use('/api/v1', v1Routes);
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    error: true,
    message: err.message || 'Internal server error occurred'
  });
});

// Start Server
app.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(`✨ crisper Audio Core running on port: ${config.port}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🎯 Temp directory: ${config.tempDir}`);
  console.log(`=========================================`);
});

export default app;
