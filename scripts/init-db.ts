/**
 * ULTRON - Database Initialization Script
 * Creates tables manually for Prisma v4 compatibility
 */

// Import for CommonJS compatibility (Prisma v4)
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']
});

async function main() {
  console.log('🔧 Initializing ULTRON Database...');

  try {
    await prisma.$connect();
    console.log('✅ Connected to database');

    // Create Users table
    console.log('📦 Creating users table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT,
        firstName TEXT,
        lastName TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
    console.log('✅ Users table created');

    // Create Observations table
    console.log('📦 Creating observations table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS observations (
        id TEXT PRIMARY KEY,
        userId TEXT,
        context TEXT NOT NULL,
        summary TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Observations table created');

    // Create indexes
    console.log('📦 Creating indexes...');
    await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS idx_observations_userId ON observations(userId)');
    await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS idx_observations_timestamp ON observations(timestamp)');
    console.log('✅ Indexes created');

    // Insert test data
    console.log('📝 Adding test users...');

    // Admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@ultron.local' },
      update: {},
      create: {
        id: 'admin-001',
        email: 'admin@ultron.local',
        password: Buffer.from('admin123').toString('base64'),
        firstName: 'Administrator',
        lastName: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });

    // Test user
    const testUser = await prisma.user.upsert({
      where: { email: 'test@ultron.local' },
      update: {},
      create: {
        id: 'user-001',
        email: 'test@ultron.local',
        password: Buffer.from('test123').toString('base64'),
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });

    console.log(`✅ Test users created: ${adminUser.email}, ${testUser.email}`);

    // Add test observations
    await prisma.observation.createMany({
      data: [
        {
          id: 'obs-001',
          userId: adminUser.id,
          context: JSON.stringify({ request: 'Initial system setup' }),
          summary: 'System initialized with Prisma ORM and SQLite backend',
          timestamp: new Date().toISOString()
        },
        {
          id: 'obs-002',
          userId: testUser.id,
          context: JSON.stringify({ request: 'Test user created for integration' }),
          summary: 'Test users added to database for API testing',
          timestamp: new Date().toISOString()
        }
      ]
    });

    console.log('✅ Test data inserted');

  } catch (error) {
    console.error(`❌ Database initialization failed: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
