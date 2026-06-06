import { prisma } from '../../shared/db/prisma.js';
import type { WorkspaceMembership } from '../../generated/prisma/client.js';

export class WorkspaceRepository {
  /**
   * Look up a user's membership in a specific workspace.
   */
  async findMembership(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMembership | null> {
    return prisma.workspaceMembership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
  }
}

export const workspaceRepository = new WorkspaceRepository();
