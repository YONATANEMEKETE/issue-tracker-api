import { Request, Response, NextFunction } from 'express';
import { authRepository } from './auth.repository.js';
import { sanitizeUser } from '../../shared/utils/sanitize-user.js';
import { unauthorized } from '../../shared/errors/error.js';

/**
 * Global middleware to populate req.user if a session exists.
 * Does not block unauthenticated requests.
 */
export async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userId = req.session?.userId;

  if (userId) {
    try {
      const user = await authRepository.findById(userId);
      if (user) {
        req.user = sanitizeUser(user);
      }
    } catch (error) {
      req.log.error({ error }, 'Failed to deserialize user');
    }
  }

  next();
}

/**
 * Route guard that blocks request if the user is not authenticated.
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    throw unauthorized('You must be logged in to access this resource');
  }
  next();
}
