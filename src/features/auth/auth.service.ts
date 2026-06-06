import { prisma } from '../../shared/db/prisma.js';
import { hashPassword } from '../../shared/utils/hash.js';
import { conflict } from '../../shared/errors/error.js';
import { RegisterInput } from './auth.schema.js';
import { sanitizeUser } from '../../shared/utils/sanitize-user.js';
import { authRepository } from './auth.repository.js';

export class AuthService {
  async register(input: RegisterInput) {
    // 1. Check if email is already taken
    const existingUser = await authRepository.findByEmail(input.email);

    if (existingUser) {
      throw conflict('Email is already registered');
    }

    // 2. Hash the password
    const passwordHash = await hashPassword(input.password);

    // 3. Create the user record
    const user = await authRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    // 4. Sanitize and return the user object
    return sanitizeUser(user);
  }
}

export const authService = new AuthService();
