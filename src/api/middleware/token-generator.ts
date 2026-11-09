/**
 * JWT Token Generator & Validator
 */

// Add TypeScript types for jsonwebtoken
import type { JWTPayload, Secret } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'ultron-secret-key-2026';
const JWT_EXPIRES_IN = '7d'; // 7 days default

/**
 * Generate JWT token for user
 */
export const generateToken = (data: { id: number; email: string; role?: string }): string => {
  return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify and decode JWT token
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

/**
 * Token expiration time (ms)
 */
export const TOKEN_EXPIRES_IN_MS = parseInt(JWT_EXPIRES_IN.replace(/\D/g, ''), 10);

// Export para usar en otros módulos
export default {
  generateToken,
  verifyToken,
  TOKEN_EXPIRES_IN_MS
};
