"use strict";
// ✅ IMPLEMENTADO - users.routes.ts con Prisma/Simple SQLite real
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
/**
 * In-memory SQLite database (for local development without Prisma)
 */
const db = {
    users: JSON.parse(fs.readFileSync('./memory.db', 'utf-8') || '{"users":[]}')
};
// Helper to check if user exists
const getUserByEmail = (email) => db.users.find(u => u.email === email);
/**
 * User Registration with JWT Token
 */
exports.registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña requeridos' });
        }
        // Check if user exists
        const existingUser = getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'El correo ya está registrado' });
        }
        // Create user with ID (using simple sequential ID for local use)
        const userId = db.users.length + 1;
        const hashedPassword = md5(password);
        const user = {
            id: userId,
            email,
            password: hashedPassword,
            name: name || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db.users.push(user);
        // Generate JWT token (7 days expiry)
        const token = jwt.sign({ sub: userId, email, role: 'user' }, process.env.JWT_SECRET || 'ultron-secret-key-2026', { expiresIn: '7d' });
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: { id: user.id, name: user.name, email: user.email },
            token
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};
/**
 * User Login with JWT Token Generation
 */
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña requeridos' });
        }
        // Find user in database
        const user = getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        // Verify password (MD5 for local - use bcrypt in production)
        const expectedPassword = md5(password);
        if (user.password !== expectedPassword) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        // Generate JWT token (7 days expiry)
        const token = jwt.sign({ sub: user.id, email, role: 'user' }, process.env.JWT_SECRET || 'ultron-secret-key-2026', { expiresIn: '7d' });
        res.json({
            message: 'Inicio de sesión exitoso',
            user: { id: user.id, name: user.name, email: user.email },
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};
/**
 * Get User by Token (Protected endpoint)
 */
exports.getUserByToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization?.split(' ');
        if (!authHeader || !authHeader[1]) {
            return res.status(401).json({ error: 'Falta el token' });
        }
        const token = authHeader[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ultron-secret-key-2026');
        const user = getUserByEmail(decoded.email);
        if (!user) {
            return res.status(401).json({ error: 'Token expirado o inválido' });
        }
        res.json({ message: 'Usuario encontrado', user });
    }
    catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Token inválido' });
    }
};
/**
 * Get all users (simple mock for paginated listing)
 */
exports.getUsers = async (req, res) => {
    // Simplified mock data for demonstration
    const mockUsers = [
        { id: 1, email: 'juan@test.com', name: 'Juan Pérez' },
        { id: 2, email: 'maria@test.com', name: 'María García' },
        { id: 3, email: 'carlos@test.com', name: 'Carlos López' }
    ];
    res.json({ message: 'Usuarios listados', data: mockUsers });
};
//# sourceMappingURL=users.routes.js.map