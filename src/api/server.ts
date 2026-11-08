/**
 * ULTRON - REST API Server for User Management
 * Phase 1: Core infrastructure setup
 */

import { config } from 'dotenv';

// Load environment variables from .env file
config({ path: '.env' });

console.log('🤖 Ultron Brain Initializing...');
console.log(`Version: 0.1.0-beta`);
console.log(`Skills: Writing Plans, Executing Plans, Memory Management`);
console.log(`Model: ${process.env.OLLAMA_MODEL || 'qwen3.5:4b'}`);
