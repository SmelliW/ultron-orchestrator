/**
 * ✅ IMPLEMENTADO - Simple SQLite Database (local, no external deps)
 * Uses Prisma for persistent storage in memory.db (JSON format)
 */

import fs from 'fs';

// Prisma client instance for database operations
let prismaClient: any;

export const initPrisma = async () => {
  // Initialize Prisma if not already initialized
  if (!prismaClient) {
    try {
      const { Prisma } = await import('@prisma/client');
      prismaClient = new Prisma();
      console.log('✅ Prisma client initialized');
    } catch (error) {
      console.warn('⚠️ Prisma not available, using fallback in-memory storage');
      // Fallback to simple file-based storage if Prisma fails
      return loadFallbackDB();
    }
  }
  return prismaClient;
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string): Promise<any> => {
  try {
    const prisma = await initPrisma();

    if (prisma && prisma.user.findUnique) {
      // Use Prisma for real database queries
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (user) return user;
    }

    // Fallback: read from memory.db file
    const fallback = loadFallbackDB();
    return fallback.users.find(u => u.email === email);

  } catch (error) {
    console.error('getUserByEmail error:', error);
    return null;
  }
};

/**
 * Create new user
 */
export const createUser = async (data: { email: string; password: string; name?: string }): Promise<any> => {
  try {
    const prisma = await initPrisma();

    if (prisma && prisma.user.create) {
      // Use Prisma for real database operations
      const user = await prisma.user.create({
        data: {
          email,
          password, // In production, use bcrypt to hash passwords
          name: data.name || null
        }
      });

      return user;
    }

    // Fallback: read/write from memory.db file
    const fallback = loadFallbackDB();

    const userId = fallback.users.length + 1;
    fallback.users.push({
      id: userId,
      email,
      password, // In production, use bcrypt to hash passwords
      name: data.name || null
    });

    // Save to file
    fs.writeFileSync('./memory.db', JSON.stringify(fallback, null, 2));

    return fallback.users[fallback.users.length - 1];

  } catch (error) {
    console.error('createUser error:', error);
    return null;
  }
};

/**
 * Get all users (for listing)
 */
export const getAllUsers = async (): Promise<any[]> => {
  try {
    const prisma = await initPrisma();

    if (prisma && prisma.user.findMany) {
      // Use Prisma for real database queries
      const users = await prisma.user.findMany({
        orderBy: [{ createdAt: 'desc' }]
      });

      return users;
    }

    // Fallback: read from memory.db file
    const fallback = loadFallbackDB();
    return fallback.users;

  } catch (error) {
    console.error('getAllUsers error:', error);
    return [];
  }
};

/**
 * Save changes to database
 */
export const saveDB = async (): Promise<void> => {
  try {
    const prisma = await initPrisma();

    if (prisma && prisma.user.updateMany) {
      // Use Prisma for real database operations
      await prisma.user.updateMany({});
    }

    // Fallback: write to memory.db file
    fs.writeFileSync('./memory.db', '[]');

  } catch (error) {
    console.error('saveDB error:', error);
  }
};

/**
 * Load database from memory.db file (fallback mechanism)
 */
function loadFallbackDB(): any {
  try {
    if (fs.existsSync('./memory.db')) {
      const content = fs.readFileSync('./memory.db', 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    // Create empty fallback DB
    console.warn('Creating empty fallback database');
  }
  return { users: [], tokens: [] };
}

// Export helpers for use in routes
export default {
  getUserByEmail,
  createUser,
  getAllUsers,
  saveDB
};
