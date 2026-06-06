import { Router } from 'express';
import { workspaceController } from './workspace.controller.js';
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from './workspace.schema.js';
import { validate } from '../../shared/middlewares/validate.js';
import { requireAuth } from '../auth/auth.middleware.js';
import {
  requireWorkspaceMember,
  requireWorkspaceRole,
} from './workspace.middleware.js';

export const workspaceRouter = Router();

// Apply authentication middleware globally to all workspace routes
workspaceRouter.use(requireAuth);

// POST /workspaces - Create a new workspace
workspaceRouter.post(
  '/',
  validate({ body: createWorkspaceSchema }),
  workspaceController.create.bind(workspaceController),
);

// GET /workspaces - List user's workspaces
workspaceRouter.get('/', workspaceController.list.bind(workspaceController));

// GET /workspaces/:workspaceId - Get workspace details (requires membership)
workspaceRouter.get(
  '/:workspaceId',
  requireWorkspaceMember,
  workspaceController.get.bind(workspaceController),
);

// PATCH /workspaces/:workspaceId - Update workspace (requires admin role)
workspaceRouter.patch(
  '/:workspaceId',
  requireWorkspaceMember,
  requireWorkspaceRole(['admin']),
  validate({ body: updateWorkspaceSchema }),
  workspaceController.update.bind(workspaceController),
);
