// ✅ TEST SCRIPT - API con SQLite simple (no Prisma)
console.log('========================================');
console.log('  Testing Ultron User API (v0.2.0-dev)');
console.log('========================================\n');

const fs = require('fs');

// Simple local database (JSON file based for simplicity)
const initDB = () => {
  const dbPath = './memory.db';

  // Load or create empty DB
  let users = JSON.parse(fs.readFileSync(dbPath, 'utf-8') || '{}');
  if (!users.users) users.users = [];

  return users;
};

const saveDB = (data) => {
  fs.writeFileSync('./memory.db', JSON.stringify(data));
};

// Initialize DB
let db = initDB();

/**
 * Simulated MD5 hash for password (simplified for local testing)
 */
const md5Hash = str => Buffer.from(str).readHex().slice(10); // Basic simulation

/**
 * User Registration
 */
exports.registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  console.log('📝 Registering user:', email);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  // Check existing
  if (db.users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'El correo ya está registrado' });
  }

  // Create user
  const userId = db.users.length + 1;
  db.users.push({ id: userId, email, password, name });
  saveDB(db);

  console.log('✅ Usuario creado (ID:', userId, ')');

  // Generate JWT token (7 days)
  const token = jwt.sign(
    { sub: userId, email, role: 'user' },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );

  res.status(201).json({
    message: 'Usuario registrado exitosamente',
    user: { id: userId, name, email },
    token
  });
};

/**
 * User Login
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('🔑 Logging in:', email);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  // Find user
  const user = db.users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  console.log('✅ Credenciales válidas (ID:', user.id, ')');

  // Generate JWT token
  const token = jwt.sign(
    { sub: user.id, email, role: 'user' },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Inicio de sesión exitoso',
    user: { id: user.id, name: user.name, email: user.email },
    token
  });
};

/**
 * Get User by Token (Protected)
 */
exports.getUserByToken = async (req, res) => {
  const auth = req.headers.authorization?.split(' ');

  if (!auth || !auth[1]) {
    return res.status(401).json({ error: 'Falta el token' });
  }

  try {
    const token = auth[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    const user = db.users.find(u => u.email === payload.email);

    if (!user) {
      return res.status(401).json({ error: 'Token expirado o inválido' });
    }

    res.json({ message: 'Usuario encontrado', user });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

/**
 * Get all users (mock data)
 */
exports.getUsers = async (req, res) => {
  const mockUsers = [
    { id: 1, email: 'juan@test.com', name: 'Juan Pérez' },
    { id: 2, email: 'maria@test.com', name: 'María García' }
  ];

  res.json({ message: 'Usuarios listados', data: mockUsers });
};

// Export for testing
module.exports = exports;
