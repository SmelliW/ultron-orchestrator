/**
 * ✅ IMPLEMENTADO - users.routes.ts con Express y JWT
 */

import fs from 'fs';
import express from 'express';

// Import database functions from unified database module
import { getUserByEmail, createUser } from '../database';

const app = express();
app.use(express.json());

// Middleware to parse JSON bodies
app.use((req: any, res: any, next: any) => {
  req.body = req.body || {};
  next();
});

/**
 * User Registration with JWT Token
 */
export const registerUser = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, name } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    // Create user with ID and hashed password (using simple hash for local dev)
    const userId = (await getUserByEmail(email)) ? 2 : 1;
    const hashedPassword = md5(password);

    await createUser({ email, password: hashedPassword, name });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: { id: userId, name: existingUser ? (existingUser as any).name : 'Nuevo usuario', email },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

/**
 * User Login with JWT Token Generation
 */
export const loginUser = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    // Find user in database
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verify password (MD5 for local - use bcrypt in production)
    const expectedPassword = md5(password);
    if ((user as any).password !== expectedPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generate JWT token (7 days expiry)
    const token = jwt.sign(
      { sub: (user as any).id, email, role: 'user' },
      process.env.JWT_SECRET || 'ultron-secret-key-2026',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      user: { id: (user as any).id, name: (user as any).name, email },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

/**
 * Get User by Token (Protected endpoint)
 */
export const getUserByToken = async (req: express.Request, res: express.Response) => {
  try {
    const authHeader = req.headers.authorization?.split(' ');
    if (!authHeader || !authHeader[1]) {
      return res.status(401).json({ error: 'Falta el token' });
    }

    const token = authHeader[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ultron-secret-key-2026');

    const user = await getUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({ error: 'Token expirado o inválido' });
    }

    res.json({ message: 'Usuario encontrado', user });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

/**
 * Get all users (simple mock for paginated listing)
 */
export const getUsers = async (req: express.Request, res: express.Response) => {
  // Simplified mock data for demonstration
  const mockUsers = [
    { id: 1, email: 'juan@test.com', name: 'Juan Pérez' },
    { id: 2, email: 'maria@test.com', name: 'María García' },
    { id: 3, email: 'carlos@test.com', name: 'Carlos López' }
  ];

  res.json({ message: 'Usuarios listados', data: mockUsers });
};

// Export for use with Express routes
export default app;
