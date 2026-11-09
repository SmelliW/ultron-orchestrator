/**
 * Authentication middleware for API routes
 */

import { verifyToken, generateToken } from './token-generator';

export const requireAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization?.split(' ');

  if (!authHeader || !authHeader[1]) {
    return res.status(401).json({ error: 'Falta el token' });
  }

  const token = authHeader[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  req.user = decoded;
  next();
};

// Export middleware for use in routes
export default requireAuth;
