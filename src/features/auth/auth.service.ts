import { prisma } from '../../shared/db/prisma.js';
import { hashPassword, verifyPassword } from '../../shared/utils/hash.js';
import { conflict, unauthorized } from '../../shared/errors/error.js';
import { LoginInput, RegisterInput } from './auth.schema.js';
import { sanitizeUser } from '../../shared/utils/sanitize-user.js';
import { authRepository } from './auth.repository.js';
import { User } from '../../shared/types/user.js';

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
  // login: service
  async login(input: LoginInput): Promise<User> {
    // 1. Find user by email using the Repository
    const user = await authRepository.findByEmail(input.email);

    // 2. If user doesn't exist, throw generic unauthorized error (security hardening)
    if (!user) {
      throw unauthorized('Invalid email or password');
    }

    // 3. Verify the password hash
    const isValidPassword = await verifyPassword(
      user.passwordHash,
      input.password,
    );
    if (!isValidPassword) {
      throw unauthorized('Invalid email or password');
    }

    // 4. Sanitize and return the user
    return sanitizeUser(user);
  }
}

export const authService = new AuthService();
