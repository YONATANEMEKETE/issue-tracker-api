import { Request, Response, NextFunction } from 'express';
import { commentService } from './comments.service.js';
import { CreateCommentInput } from './comments.schema.js';

export class CommentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, issueId } = req.params;
      const authorUserId = req.user!.id; // req.user is populated by requireAuth
      const { body } = req.body as CreateCommentInput;

      const comment = await commentService.createComment(
        body,
        issueId as string,
        workspaceId as string,
        authorUserId as string,
      );

      res.status(201).json({
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, issueId } = req.params;

      const comments = await commentService.listComments(
        issueId as string,
        workspaceId as string,
      );

      res.status(200).json({
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const commentController = new CommentController();
