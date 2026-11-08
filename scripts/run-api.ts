/**
 * ULTRON - User Management REST API Server
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


console.log('🤖 Ultron Brain Initializing...');
console.log(`Version: 0.1.0-beta`);
console.log(`Model: ${process.env.OLLAMA_MODEL || 'qwen3.5:4b'}`);

// Middleware setup
const app = express();
app.use(cors());
app.use(express.json());
import { default as usersRoutes } from '../src/api/routes/users.routes';

app.use('/api', usersRoutes);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
    message: 'ULTRON User Management API - Ready',
    version: '0.1.0-beta',
    status: 'healthy'
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(`❌ Server error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 ULTRON API server running at http://localhost:${PORT}`);
  console.log('   - Register new user: POST /api/users/register');
  console.log('   - Login user: POST /api/users/login');
  console.log('   - List users: GET /api/users?limit=20');
});
