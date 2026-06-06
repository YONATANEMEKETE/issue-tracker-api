import { prisma } from '../../shared/db/prisma.js';
import type { Issue } from '../../generated/prisma/client.js';
import { IssueStatus } from '../../generated/prisma/client.js';

export class IssueRepository {
  /**
   * Create a new issue.
   */
  async create(data: {
    title: string;
    description?: string | null;
    priority?: string | null;
    assigneeUserId?: string | null;
    projectId: string;
    workspaceId: string;
    createdByUserId: string;
  }): Promise<Issue> {
    return prisma.issue.create({
      data,
    });
  }

  /**
   * List all issues in a workspace (excluding archived issues by default).
   */
  async listByWorkspace(workspaceId: string): Promise<Issue[]> {
    return prisma.issue.findMany({
      where: {
        workspaceId,
        status: { not: 'archived' }, // Exclude archived issues
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * List all issues in a specific project.
   */
  async listByProject(
    projectId: string,
    workspaceId: string,
  ): Promise<Issue[]> {
    return prisma.issue.findMany({
      where: {
        projectId,
        workspaceId,
        status: { not: 'archived' },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find a single issue by ID.
   */
  async findById(issueId: string): Promise<Issue | null> {
    return prisma.issue.findUnique({
      where: { id: issueId },
    });
  }

  /**
   * Update issue fields (handles assignment, status changes, title, description).
   */
  async update(
    issueId: string,
    data: {
      title?: string;
      description?: string | null;
      status?: IssueStatus;
      priority?: string | null;
      assigneeUserId?: string | null;
    },
  ): Promise<Issue> {
    return prisma.issue.update({
      where: { id: issueId },
      data,
    });
  }

  /**
   * Soft-delete: Mark an issue as archived.
   */
  async archive(issueId: string): Promise<Issue> {
    return prisma.issue.update({
      where: { id: issueId },
      data: { status: 'archived' },
    });
  }
}

export const issueRepository = new IssueRepository();
