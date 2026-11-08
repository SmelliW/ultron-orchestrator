/**
 * ULTRON - API Configuration
 */

export const config = {
  port: process.env.PORT || 3000,
  host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
  jwtSecret: process.env.JWT_SECRET || 'ultron-secret-key-change-in-production',
  database: process.env.DB_URL || 'sqlite://ultron.db',
};
