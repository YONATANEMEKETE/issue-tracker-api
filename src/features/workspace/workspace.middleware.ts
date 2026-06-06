import { Request, Response, NextFunction } from 'express';
import { WorkspaceRole } from '../../generated/prisma/client.js';
import { workspaceRepository } from '../../features/workspace/workspace.repository.js';
import {
  forbidden,
  unauthorized,
  validationError,
} from '../../shared/errors/error.js';
/**
 * Middleware: Verifies that the user is a member of the workspace specified in the URL params.
 *
 * Scoped routes must use this middleware (e.g., `/workspaces/:workspaceId/...`).
 * It extracts `workspaceId`, checks the DB, and attaches the membership to `req.membership`.
 */
export async function requireWorkspaceMember(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // 1. Ensure the user is authenticated (defensive guard)
    if (!req.user) {
      throw unauthorized('Authentication required');
    }
    // 2. Extract the workspaceId from URL params
    const { workspaceId } = req.params;
    if (!workspaceId) {
      throw validationError('Workspace ID is required');
    }
    // 3. Lookup the membership in the database
    const membership = await workspaceRepository.findMembership(
      req.user.id,
      workspaceId as string,
    );
    // 4. If no membership exists, reject with 403 Forbidden
    if (!membership) {
      throw forbidden('You are not a member of this workspace');
    }
    // 5. Attach the membership details to the request context
    req.membership = membership;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireWorkspaceRole(allowedRoles: WorkspaceRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // 1. Ensure the membership context was already populated by requireWorkspaceMember
    if (!req.membership) {
      throw forbidden(
        'Workspace membership check is required before verifying roles',
      );
    }
    // 2. Check if the user's role is in the list of allowed roles
    if (!allowedRoles.includes(req.membership.role)) {
      throw forbidden('You do not have permission to perform this action');
    }
    next();
  };
}
