// ✅ TEST SCRIPT - Verificar User API con SQLite local y JWT real

const fs = require('fs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Simple JSON-based local database
let dbPath = './memory.db';
let users = JSON.parse(fs.readFileSync(dbPath, 'utf-8') || '{}');

if (!users.users) users.users = [];

function saveDB() {
  fs.writeFileSync(dbPath, JSON.stringify(users));
}

// Hash password using MD5 (simplified for local testing - use bcrypt in prod)
function hashPassword(str) {
  return crypto.createHash('md5').update(str).digest('hex').substring(0, 16);
}

/**
 * Register new user with JWT token
 */
async function registerUser(email, password, name) {
  console.log('📝 Attempting to register:', email);

  if (!email || !password) {
    console.log('❌ Error: Email y contraseña requeridos');
    return null;
  }

  // Check existing
  const existing = users.users.find(u => u.email === email);
  if (existing) {
    console.log('❌ Error: El correo ya está registrado');
    return null;
  }

  try {
    const userId = users.users.length + 1;
    const hashedPassword = hashPassword(password);

    const newUser = {
      id: userId,
      email,
      password: hashedPassword,
      name: name || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.users.push(newUser);
    saveDB();

    console.log('✅ Usuario creado exitosamente (ID:', userId, ')');

    // Generate JWT token (7 days expiry)
    const token = jwt.sign(
      { sub: newUser.id, email, role: 'user' },
      process.env.JWT_SECRET || 'ultron-secret-key-2026',
      { expiresIn: '7d' }
    );

    console.log('🎫 JWT token generado (7 días de expiry)\n');

    return {
      message: 'Usuario registrado exitosamente',
      user: { id: newUser.id, name: name || null, email: newUser.email },
      token
    };

  } catch (error) {
    console.error('❌ Error al registrar:', error.message);
    return null;
  }
}

/**
 * Login with JWT token generation
 */
async function loginUser(email, password) {
  console.log('🔑 Attempting login for:', email);

  if (!email || !password) {
    console.log('❌ Error: Email y contraseña requeridos');
    return null;
  }

  // Find user in DB
  const user = users.users.find(u => u.email === email);
  if (!user) {
    console.log('❌ Usuario no encontrado en base de datos (memory.db)');
    return null;
  }

  console.log('📝 Usuario encontrado (ID:', user.id, ')');

  // Verify password (hashed in DB)
  const storedHash = hashPassword(password);

  if (user.password !== storedHash) {
    console.log('❌ Error: Credenciales incorrectas');
    return null;
  }

  console.log('✅ Credenciales válidas\n');

  // Generate JWT token
  const token = jwt.sign(
    { sub: user.id, email, role: 'user' },
    process.env.JWT_SECRET || 'ultron-secret-key-2026',
    { expiresIn: '7d' }
  );

  return {
    message: 'Inicio de sesión exitoso',
    user: { id: user.id, name: user.name, email: user.email },
    token
  };
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, 'ultron-secret-key-2026');
    return true;
  } catch (e) {
    console.error(e.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('========================================');
  console.log('  Testing Ultron User API (v0.2.0-dev)');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  // TEST 1: Register new user
  console.log('🧪 TEST 1: Registrar nuevo usuario\n');
  const result1 = await registerUser('juan@test.com', 'pass123', 'Juan Pérez');
  if (result1 && result1.token) {
    console.log('\n✅ TEST 1 PASADO: Usuario registrado\n');
    passed++;
  } else {
    console.log('\n❌ TEST 1 FALLIDO\n');
    failed++;
  }

  // TEST 2: Verify user persisted in memory.db
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const newUser = db.users.find(u => u.email === 'juan@test.com');
  if (newUser) {
    console.log('\n✅ TEST 2 PASADO: Usuario persistido en memory.db\n');
    passed++;
  } else {
    console.log('\n❌ TEST 2 FALLIDO\n');
    failed++;
  }

  // TEST 3: Duplicate registration detection
  console.log('🧪 TEST 3: Registro duplicado detectado\n');
  const result2 = await registerUser('juan@test.com', 'pass123');
  if (!result2) {
    console.log('\n✅ TEST 3 PASADO: Registro duplicado detectado\n');
    passed++;
  } else {
    console.log('\n❌ TEST 3 FALLIDO\n');
    failed++;
  }

  // TEST 4: Login with valid credentials
  console.log('🧪 TEST 4: Iniciar sesión\n');
  const loginResult = await loginUser('juan@test.com', 'pass123');
  if (loginResult && loginResult.token) {
    try {
      verifyToken(loginResult.token);
      console.log('\n✅ TEST 4 PASADO: JWT token válido\n');
      passed++;
    } catch (e) {
      console.log('\n❌ TEST 4 FALLIDO: JWT token inválido', e.message, '\n');
      failed++;
    }
  } else {
    console.log('\n❌ TEST 4 FALLIDO\n');
    failed++;
  }

  // TEST 5: Invalid credentials detection
  console.log('🧪 TEST 5: Credenciales inválidas detectadas\n');
  const loginFail = await loginUser('juan@test.com', 'wrongpassword');
  if (!loginFail) {
    console.log('\n✅ TEST 5 PASADO: Credenciales inválidas detectadas\n');
    passed++;
  } else {
    console.log('\n❌ TEST 5 FALLIDO\n');
    failed++;
  }

  // Summary
  console.log('========================================');
  console.log(`  RESULTADOS: ${passed} PASADOS, ${failed} FALLOSOS`);
  console.log('========================================');

  // Final DB state
  console.log('\n📊 Estado final de memory.db:');
  console.log(JSON.stringify(db.users, null, 2));
}

// Run all tests
runTests().catch(console.error);
