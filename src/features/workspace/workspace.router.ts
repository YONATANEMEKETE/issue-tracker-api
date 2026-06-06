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
import { projectsRouter } from '../projects/projects.router.js';
import { issuesRouter } from '../issues/issues.router.js';

export const workspaceRouter = Router();

// Apply authentication middleware globally to all workspace routes
workspaceRouter.use(requireAuth);

// 1. Nested Router mounting (must be placed BEFORE wildcard routes like `/:workspaceId` to avoid collision)
workspaceRouter.use(
  '/:workspaceId/projects',
  requireWorkspaceMember,
  projectsRouter,
);

// Mount workspace issues router (Step 9) - Add this line!
workspaceRouter.use(
  '/:workspaceId/issues',
  requireWorkspaceMember,
  issuesRouter,
);

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
