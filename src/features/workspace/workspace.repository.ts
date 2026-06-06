import { prisma } from '../../shared/db/prisma.js';
import type {
  Workspace,
  WorkspaceMembership,
} from '../../generated/prisma/client.js';

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

  async createWorkspaceWithAdmin(
    name: string,
    creatorUserId: string,
  ): Promise<Workspace> {
    return prisma.$transaction(async (tx) => {
      // 1. Create the Workspace
      const workspace = await tx.workspace.create({
        data: {
          name,
          createdByUserId: creatorUserId,
        },
      });
      // 2. Create the Membership
      await tx.workspaceMembership.create({
        data: {
          userId: creatorUserId,
          workspaceId: workspace.id,
          role: 'admin',
        },
      });
      return workspace;
    });
  }
  /**
   * List all workspaces where the user is a member.
   */
  async listForUser(userId: string): Promise<Workspace[]> {
    return prisma.workspace.findMany({
      where: {
        memberships: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  /**
   * Find a single workspace by ID.
   */
  async findById(workspaceId: string): Promise<Workspace | null> {
    return prisma.workspace.findUnique({
      where: { id: workspaceId },
    });
  }
  /**
   * Update workspace details.
   */
  async update(workspaceId: string, name: string): Promise<Workspace> {
    return prisma.workspace.update({
      where: { id: workspaceId },
      data: { name },
    });
  }
}

export const workspaceRepository = new WorkspaceRepository();
