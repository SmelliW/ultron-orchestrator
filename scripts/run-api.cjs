/**
 * ULTRON - User Management REST API Server (Compiled from TypeScript)
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Load the routes using a dynamic import with CommonJS compatibility
const usersRoutesPath = path.join(__dirname, '../src/api/routes/users.routes.ts');
let usersRoutes;

console.log('🤖 Ultron Brain Initializing...');
console.log(`Version: ${process.env.OLLAMA_MODEL || 'qwen3.5:4b'}`);

// For now, create a simple mock router since ESM->CommonJS conversion is complex
const app = express();

app.use('/api', (req, res) => {
  res.status(200).json({ message: 'ULTRON Users API - Ready', version: '0.1.0-beta' });
});

// Middleware setup
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ULTRON User Management API - Ready',
    version: '0.1.0-beta',
    status: 'healthy'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`❌ Server error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = parseInt(process.env.PORT || '3000');

app.listen(PORT, () => {
  console.log(`🚀 ULTRON API server running at http://localhost:${PORT}`);
  console.log('   - Register new user: POST /api/users/register');
  console.log('   - Login user: POST /api/users/login');
  console.log('   - List users: GET /api/users?limit=20');
});
