/**
 * Simple MD5 hash function for password hashing (local development only)
 */

// Import crypto module
import crypto from 'crypto';

/**
 * Hash a string using MD5
 */
export const md5 = (str: string): string => {
  return crypto.createHash('md5').update(str).digest('hex');
};

// Export for use in routes
export default md5;
