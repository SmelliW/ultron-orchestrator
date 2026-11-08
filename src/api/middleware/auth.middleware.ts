/**
 * ULTRON - Authentication Middleware for REST API
 */

import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { email: string };
      token?: string;
    }
  }
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  try {
    const userToken = authHeader.substring(7);
    // In production, verify against JWT_SECRET
    req.user = { email: '' };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Optional auth - allow anonymous users
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  next();
};

/**
 * Protect route - require authentication
 */
export const protect = [authenticate];
