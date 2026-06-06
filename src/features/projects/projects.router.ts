import { Router } from 'express';
import { projectController } from './projects.controller.js';
import { createProjectSchema, updateProjectSchema } from './projects.schema.js';
import { validate } from '../../shared/middlewares/validate.js';
import { requireWorkspaceRole } from '../workspace/workspace.middleware.js';
import { issueController } from '../issues/issues.controller.js';
import { createIssueSchema } from '../issues/issues.schema.js';

// mergeParams: true allows us to access :workspaceId from the parent router path!
export const projectsRouter = Router({ mergeParams: true });

// POST /workspaces/:workspaceId/projects - Create project (Admin only)
projectsRouter.post(
  '/',
  requireWorkspaceRole(['admin']),
  validate({ body: createProjectSchema }),
  projectController.create.bind(projectController),
);

// GET /workspaces/:workspaceId/projects - List projects (All members can view)
projectsRouter.get('/', projectController.list.bind(projectController));

// GET /workspaces/:workspaceId/projects/:projectId - Get single project (All members can view)
projectsRouter.get(
  '/:projectId',
  projectController.get.bind(projectController),
);

// PATCH /workspaces/:workspaceId/projects/:projectId - Update project (Admin only)
projectsRouter.patch(
  '/:projectId',
  requireWorkspaceRole(['admin']),
  validate({ body: updateProjectSchema }),
  projectController.update.bind(projectController),
);

// DELETE /workspaces/:workspaceId/projects/:projectId - Delete/Archive project (Admin only)
projectsRouter.delete(
  '/:projectId',
  requireWorkspaceRole(['admin']),
  projectController.delete.bind(projectController),
);

// --- Nested Issue Endpoints inside Projects ---
// Paths are relative to: /workspaces/:workspaceId/projects
// POST /workspaces/:workspaceId/projects/:projectId/issues - Create an issue (Admin/Member only)
projectsRouter.post(
  '/:projectId/issues',
  requireWorkspaceRole(['admin', 'member']),
  validate({ body: createIssueSchema }),
  issueController.create.bind(issueController),
);
// GET /workspaces/:workspaceId/projects/:projectId/issues - List issues in a project (All members)
projectsRouter.get(
  '/:projectId/issues',
  issueController.listProject.bind(issueController),
);
