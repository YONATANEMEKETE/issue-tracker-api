import { Router } from 'express';
import { issueController } from './issues.controller.js';
import { updateIssueSchema } from './issues.schema.js';
import { validate } from '../../shared/middlewares/validate.js';
import { requireWorkspaceRole } from '../workspace/workspace.middleware.js';

export const issuesRouter = Router({ mergeParams: true });

// GET /workspaces/:workspaceId/issues - List all issues in workspace
issuesRouter.get('/', issueController.listWorkspace.bind(issueController));

// GET /workspaces/:workspaceId/issues/:issueId - Fetch single issue details
issuesRouter.get('/:issueId', issueController.get.bind(issueController));

// PATCH /workspaces/:workspaceId/issues/:issueId - Update issue (Admin/Member only)
issuesRouter.patch(
  '/:issueId',
  requireWorkspaceRole(['admin', 'member']),
  validate({ body: updateIssueSchema }),
  issueController.update.bind(issueController),
);

// DELETE /workspaces/:workspaceId/issues/:issueId - Soft delete issue (Admin/Member only)
issuesRouter.delete(
  '/:issueId',
  requireWorkspaceRole(['admin', 'member']),
  issueController.delete.bind(issueController),
);
