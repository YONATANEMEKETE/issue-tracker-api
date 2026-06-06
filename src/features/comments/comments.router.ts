import { Router } from 'express';
import { commentController } from './comments.controller.js';
import { createCommentSchema } from './comments.schema.js';
import { validate } from '../../shared/middlewares/validate.js';
import { requireWorkspaceRole } from '../workspace/workspace.middleware.js';

// mergeParams: true allows access to :workspaceId and :issueId from the parent router paths!
export const commentsRouter = Router({ mergeParams: true });

// POST /workspaces/:workspaceId/issues/:issueId/comments - Create comment (Admin/Member only)
commentsRouter.post(
  '/',
  requireWorkspaceRole(['admin', 'member']),
  validate({ body: createCommentSchema }),
  commentController.create.bind(commentController),
);

// GET /workspaces/:workspaceId/issues/:issueId/comments - List comments (All members)
commentsRouter.get('/', commentController.list.bind(commentController));
