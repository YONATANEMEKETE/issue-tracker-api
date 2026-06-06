import { prisma } from '../../shared/db/prisma.js';
import type { Comment } from '../../generated/prisma/client.js';

export class CommentRepository {
  /**
   * Create a comment on an issue.
   */
  async create(data: {
    body: string;
    issueId: string;
    workspaceId: string;
    authorUserId: string;
  }): Promise<Comment> {
    return prisma.comment.create({
      data: {
        body: data.body,
        issueId: data.issueId,
        workspaceId: data.workspaceId,
        authorUserId: data.authorUserId,
      },
    });
  }

  /**
   * List all comments for a specific issue.
   * Include the author details so the client knows who wrote each comment.
   */
  async listByIssue(issueId: string, workspaceId: string): Promise<any[]> {
    return prisma.comment.findMany({
      where: {
        issueId,
        workspaceId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' }, // Order chronologically
    });
  }
}

export const commentRepository = new CommentRepository();
