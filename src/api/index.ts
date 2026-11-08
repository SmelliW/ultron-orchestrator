/**
 * ULTRON - REST API Application Entry Point
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load configuration
import config from './config';

// Import routes
import userRoutes from './routes/users.routes';

// Initialize database
import { db } from './database';

console.log('🤖 ULTRON REST API Starting...');

// Create Express application
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);

// Health check endpoint
app.get('/', (req: any, res: any) => {
  console.log('✅ ULTRON API is running on port 3000');
  res.json({
    message: 'ULTRON User Management API - Ready',
    version: '0.1.0-beta',
    status: 'healthy'
  });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(`❌ Server error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = config.port;
app.listen(PORT, async () => {
  console.log(`🚀 ULTRON API server running at http://localhost:${PORT}`);

  // Initialize database
  try {
    await db.$connect();
    console.log('✅ Database connection established');
  } catch (e) {
    console.error(`❌ Database connection failed: ${e.message}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  db.$disconnect();
  process.exit(0);
});

export default app;
