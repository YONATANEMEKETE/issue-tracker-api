import type { User as PrismaUser } from '../../generated/prisma/client.js';
import type { User } from '../../shared/types/user.js';

export function sanitizeUser(dbUser: PrismaUser): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    createdAt: dbUser.createdAt,
    updatedAt: dbUser.updatedAt,
  };
}
