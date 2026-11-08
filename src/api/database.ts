/**
 * ULTRON - Database Setup with Prisma (SQLite)
 */

import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient();

// Example: Create User model schema in .prisma/schema.prisma
// User {
//   id    Int            @id @default(autoincrement())
//   email  String         @unique
//   passwordHash String
//   firstName String?
//   lastName String?
// }

console.log('🗄️ Database initialized');
