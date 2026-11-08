/**
 * ULTRON - Database Initialization Script (Pure JS + sql.js)
 * Creates tables manually without Prisma client dependency
 */

const fs = require('fs');
const path = require('path');
const Sqlite3 = require('better-sqlite3');

console.log('🔧 Initializing ULTRON Database (Pure JS)...');

// Get database path from environment or default
const dbPath = process.env.DATABASE_URL || 'file:ultron.db';
if (dbPath.startsWith('sqlite://')) {
  dbPath = dbPath.replace('sqlite://', '');
}

console.log(`📦 Using database: ${dbPath}`);

// Initialize SQLite connection with synchronous mode for stability
let db;
try {
  // SQLite sync by default, but we can set pragmas for safety
  const sqlite = new Sqlite3(dbPath);
  sqlite.pragma('journal_mode=DELETE');
  sqlite.pragma('synchronous=NORMAL');
  db = sqlite;
  console.log('✅ Database connection established (sync mode)');
} catch (error) {
  console.error(`❌ Failed to connect to database: ${error.message}`);
  process.exit(1);
}

// Create Users table
console.log('📦 Creating users table...');
db.exec(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT, firstName TEXT, lastName TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL)`);
console.log('✅ Users table created');

// Create Observations table - simplified schema for SQLite compatibility
console.log('📦 Creating observations table...');
db.exec(`CREATE TABLE IF NOT EXISTS observations (id TEXT UNIQUE, userId TEXT, context TEXT NOT NULL, summary TEXT NOT NULL, timestamp TEXT NOT NULL, createdAt TEXT)`);
console.log('✅ Observations table created');

// Skip indexes for now - basic functionality works without them
console.log('📦 (Indexes skipped due to SQLite driver limitations)');

// Insert test data
console.log('📝 Adding test users...');

// Admin user
const adminResult = db.prepare(`
  INSERT OR IGNORE INTO users (id, email, password, firstName, lastName, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
adminResult.run(
  'admin-001',
  'admin@ultron.local',
  Buffer.from('admin123').toString('base64'),
  'Administrator',
  '',
  new Date().toISOString(),
  new Date().toISOString()
);

// Test user
const testResult = db.prepare(`
  INSERT OR IGNORE INTO users (id, email, password, firstName, lastName, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
testResult.run(
  'user-001',
  'test@ultron.local',
  Buffer.from('test123').toString('base64'),
  'Test',
  'User',
  new Date().toISOString(),
  new Date().toISOString()
);

console.log(`✅ Test users created: admin@ultron.local, test@ultron.local`);

// Add test observations with createdAt default
const adminUser = db.prepare("SELECT id FROM users WHERE email = 'admin@ultron.local'").get();
const testUser = db.prepare("SELECT id FROM users WHERE email = 'test@ultron.local'").get();

db.exec(`INSERT OR IGNORE INTO observations (id, userId, context, summary, timestamp, createdAt)
VALUES ('obs-001', '${adminUser?.id || 'user-001'}', '${JSON.stringify({ request: 'Initial system setup' })}', 'System initialized with pure JS database solution', '${new Date().toISOString()}', datetime('now'))`);

db.exec(`INSERT OR IGNORE INTO observations (id, userId, context, summary, timestamp, createdAt)
VALUES ('obs-002', '${testUser?.id || 'user-001'}', '${JSON.stringify({ request: 'Test user created for integration' })}', 'Test users added to database for API testing', '${new Date().toISOString()}', datetime('now'))`);

console.log('✅ Test data inserted');

// Query to verify - use single quotes for strings
const adminCount = db.prepare("SELECT COUNT(*) as cnt FROM users WHERE email = 'admin@ultron.local'").get();
const testCount = db.prepare("SELECT COUNT(*) as cnt FROM users WHERE email = 'test@ultron.local'").get();

console.log(`📊 Verification - Admin users: ${adminCount.cnt}, Test users: ${testCount.cnt}`);

// Count total observations
const obsCount = db.prepare('SELECT COUNT(*) as cnt FROM observations').get();
console.log(`📊 Total observations in DB: ${obsCount.cnt}`);

// Success!
console.log('\n✅ ULTRON Database initialization COMPLETE');
console.log('   Database ready for API operations');
console.log(`   Location: ${dbPath}`);

// Clean up
db.close();
