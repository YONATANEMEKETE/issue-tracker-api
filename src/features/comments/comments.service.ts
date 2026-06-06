import { commentRepository } from './comments.repository.js';
import { issueRepository } from '../issues/issues.repository.js';
import { notFound } from '../../shared/errors/error.js';
import type { Comment } from '../../generated/prisma/client.js';

export class CommentService {
  /**
   * Business rule: Create a comment on an issue.
   * Safety check: Verify the target issue exists and is scoped to the correct workspace.
   */
  async createComment(
    body: string,
    issueId: string,
    workspaceId: string,
    authorUserId: string,
  ): Promise<Comment> {
    // 1. Verify the issue exists and belongs to the workspace
    const issue = await issueRepository.findById(issueId);
    if (!issue || issue.workspaceId !== workspaceId) {
      throw notFound('Issue not found in this workspace');
    }

    // 2. Create the comment record
    return commentRepository.create({
      body,
      issueId,
      workspaceId,
      authorUserId,
    });
  }

  /**
   * Business rule: List comments for an issue.
   * Safety check: Verify the target issue exists and belongs to the workspace.
   */
  async listComments(issueId: string, workspaceId: string): Promise<any[]> {
    // Verify the issue exists and belongs to the workspace
    const issue = await issueRepository.findById(issueId);
    if (!issue || issue.workspaceId !== workspaceId) {
      throw notFound('Issue not found in this workspace');
    }

    return commentRepository.listByIssue(issueId, workspaceId);
  }
}

export const commentService = new CommentService();
