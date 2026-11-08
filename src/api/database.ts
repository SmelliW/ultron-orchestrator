/**
 * ULTRON - Database Client with better-sqlite3 (Pure JS)
 * Handles CRUD operations for User model and observations
 * No Prisma dependency - works directly with SQLite
 */

import betterSqlite3 from 'better-sqlite3';

// Initialize database connection
let db: betterSqlite3.Database | null = null;

/**
 * Get database instance (creates if needed)
 */
export function getDb(): betterSqlite3.Database {
  if (!db) {
    const dbPath = process.env.DATABASE_URL || 'file:ultron.db';
    if (dbPath.startsWith('sqlite://')) {
      dbPath = dbPath.replace('sqlite://', '');
    }
    console.log(`📦 Using database: ${dbPath}`);
    db = new betterSqlite3(dbPath);
    // Set pragmas for stability
    db.pragma('journal_mode=DELETE');
    db.pragma('synchronous=NORMAL');
  }
  return db;
}

/**
 * Initialize database schema (create tables if not exist)
 */
export function initDatabase(): boolean {
  try {
    const sqlite = getDb();

    // Create Users table
    sqlite.exec(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      firstName TEXT,
      lastName TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )`);

    // Create Observations table
    sqlite.exec(`CREATE TABLE IF NOT EXISTS observations (
      id TEXT UNIQUE,
      userId TEXT,
      context TEXT NOT NULL,
      summary TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      createdAt TEXT
    )`);

    console.log('✅ ULTRON Database initialized with better-sqlite3');
    return true;
  } catch (error) {
    console.error(`❌ Database initialization failed: ${error.message}`);
    return false;
  }
}

/**
 * Create a new user
 */
export function createUser(
  email: string,
  passwordHash: string,
  firstName?: string,
  lastName?: string
): boolean {
  try {
    const sqlite = getDb();

    // Check if user exists
    const existingEmail = sqlite.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existingEmail) {
      console.log(`⚠️ User already exists: ${email}`);
      return false;
    }

    sqlite.exec(`INSERT INTO users (id, email, password, firstName, lastName, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)`);

    // Get created user
    const inserted = sqlite.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (!inserted) {
      console.error('❌ Failed to create user');
      return false;
    }

    console.log(`✅ User created: ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating user: ${error.message}`);
    return false;
  }
}

/**
 * Get user by email
 */
export function getUserByEmail(email: string): any | null {
  try {
    const sqlite = getDb();
    const user = sqlite.prepare("SELECT id, email, password, firstName, lastName, createdAt, updatedAt FROM users WHERE email = ?").get(email);
    console.log(`🔍 User lookup: ${email}`);
    return user;
  } catch (error) {
    console.error(`❌ Error getting user by email: ${error.message}`);
  }
  return null;
}

/**
 * Get user by ID
 */
export function getUserById(id: string): any | null {
  try {
    const sqlite = getDb();
    const user = sqlite.prepare("SELECT id, email, password, firstName, lastName, createdAt, updatedAt FROM users WHERE id = ?").get(id);
    console.log(`🔍 User lookup by ID: ${id}`);
    return user;
  } catch (error) {
    console.error(`❌ Error getting user by ID: ${error.message}`);
  }
  return null;
}

/**
 * Update user data
 */
export function updateUser(
  id: string,
  firstName?: string,
  lastName?: string,
  password?: string
): boolean {
  try {
    const sqlite = getDb();

    // Get current user first
    let userData = getUserById(id);
    if (!userData) {
      console.log(`❌ User not found: ${id}`);
      return false;
    }

    sqlite.exec(`UPDATE users SET firstName = ?, lastName = ? WHERE id = ?`);

    // Update password if provided (base64 hash already stored)
    if (password) {
      userData.password = password;
      sqlite.exec(`UPDATE users SET password = ? WHERE id = ?`, [password, id]);
    }

    console.log(`✅ User updated: ${id}`);
    return true;
  } catch (error) {
    console.error(`❌ Error updating user: ${error.message}`);
    return false;
  }
}

/**
 * Delete a user
 */
export function deleteUser(id: string): boolean {
  try {
    const sqlite = getDb();

    sqlite.exec("DELETE FROM users WHERE id = ?", [id]);
    console.log(`✅ User deleted: ${id}`);
    return true;
  } catch (error) {
    console.error(`❌ Error deleting user: ${error.message}`);
    return false;
  }
}

/**
 * Get paginated users with filter
 */
export function getUsers(skip?: number, limit?: number): any[] {
  try {
    const sqlite = getDb();

    // Get total count
    const total = sqlite.prepare("SELECT COUNT(*) as cnt FROM users").get();
    const totalCount = total.cnt || 0;

    // Get paginated results
    const users = sqlite.prepare(`SELECT id, email, password, firstName, lastName, createdAt, updatedAt FROM users ORDER BY createdAt DESC LIMIT ? OFFSET ?`).all(limit || 20, skip);

    console.log(`📊 Retrieved ${users.length} of ${totalCount} users`);
    return users;
  } catch (error) {
    console.error(`❌ Error getting users: ${error.message}`);
  }
  return [];
}

/**
 * Get user count
 */
export function getUserCount(): number {
  try {
    const sqlite = getDb();
    const total = sqlite.prepare("SELECT COUNT(*) as cnt FROM users").get();
    console.log(`📊 Total users: ${total.cnt}`);
    return total.cnt || 0;
  } catch (error) {
    console.error(`❌ Error counting users: ${error.message}`);
  }
  return 0;
}

/**
 * Save observation to memory
 */
export function saveObservation(
  userId: string,
  context: any,
  summary: string
): boolean {
  try {
    const sqlite = getDb();

    // Check if exists first
    const existingId = sqlite.prepare("SELECT id FROM observations WHERE id = ?").get(summary);
    if (existingId) {
      console.log(`⚠️ Observation already exists: ${summary}`);
      return false;
    }

    sqlite.exec(`INSERT INTO observations (id, userId, context, summary, timestamp, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)`);

    const id = sqlite.prepare("SELECT last_insert_rowid()").get();
    console.log(`💾 Memory observation saved: ${summary.substring(0, 50)}`);
    return true;
  } catch (error) {
    console.error(`❌ Error saving observation: ${error.message}`);
    return false;
  }
}

/**
 * Search observations
 */
export function searchObservations(query: string, limit?: number): any[] {
  try {
    const sqlite = getDb();
    const results = sqlite.prepare(`SELECT id, userId, context, summary, timestamp, createdAt FROM observations WHERE summary LIKE ? ORDER BY createdAt DESC LIMIT ?`).all(`${query}%", limit || 10`);

    return results;
  } catch (error) {
    console.error(`❌ Error searching observations: ${error.message}`);
  }
  return [];
}

/**
 * Hash password for storage
 */
function hashPassword(password: string): string {
  const hash = Buffer.from(password).toString('base64');
  return hash;
}

// Initialize database on import (for CommonJS compatibility)
if (typeof require !== 'undefined') {
  require('module').internalRequire('./init-db.js')?.then(() => {});
}
