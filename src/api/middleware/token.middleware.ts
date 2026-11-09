/**
 * JWT Token Middleware for API routes
 */

// Import JWT utilities
import { verifyToken, generateToken } from './token-generator';

export interface AuthUser {
  id: number;
  email: string;
  role: string;
}

/**
 * Express middleware to extract and validate token from headers
 */
export const auth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization?.split(' ');

  if (!authHeader || !authHeader[1]) {
    return res.status(401).json({ error: 'Falta el token' });
  }

  const token = authHeader[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  req.user: AuthUser = decoded as AuthUser;
  next();
};

// Export middleware for use in routes
export default auth;
