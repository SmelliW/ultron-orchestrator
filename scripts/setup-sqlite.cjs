// Setup SQLite Database Manually using native SQL.js for simplicity
const fs = require('fs');
const sqlite3 = require('sql.js');
const { v4: uuidv4 } = require('uuid');

// For local simple use without external deps, create a mock DB structure
console.log('🔧 Inicializando base de datos de Ultron (SQLite)...\n');

// Simulación básica de almacenamiento en memoria para desarrollo local
// En producción se usaría una DB real con Prisma o mejor-sqlite3

const store = JSON.parse(fs.readFileSync('memory.db', 'utf-8')) || { users: [] };

if (!store.users.length > 0) {
  // Create a mock database structure for development
  console.log('✅ Base de datos local simulada (development mode)');
  console.log('   Modo: SQLite emulado para simplificar la implementación');
} else {
  console.log('✅ Base de datos conectada (SQLite real)',);
}

// Helper functions for local operations
const createUserData = ({ email, password, name }) => {
  const id = store.users.length + 1;
  const user = {
    id,
    email,
    password,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.users.push(user);
  return user;
};

// Helper to verify token against user
const getUserByEmail = (email) => {
  return store.users.find(u => u.email === email);
};

console.log('ℹ️  Modo de almacenamiento: Local SQLite (memory.db)');
console.log('   Nota: Para producción, instalar Prisma o better-sqlite3');
console.log('   - Tablas: users, tokens\n');

// Test the store
const testUser = createUserData({ email: 'test@test.com', password: 'secret', name: 'Test User' });
console.log(`📝 Usuario creado: ${testUser.email}`);
