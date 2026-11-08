/**
 * ULTRON - JWT Token Generator for User Management API
 */

import { sign as jwtSign } from 'jsonwebtoken';

interface CreateUserOptions {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export async function createToken(email: string): Promise<string> {
  const payload = {
    sub: email,
    email: email,
    iat: Date.now() / 1000,
    exp: Math.floor(Date.now() / 1000) + (86400 * 7), // 7 days
  };

  const token = jwtSign(payload, process.env.JWT_SECRET || 'ultron-secret-key');

  console.log('🎫 Token created');

  return token;
}
