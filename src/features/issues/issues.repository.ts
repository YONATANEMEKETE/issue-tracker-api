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
   * List workspace issues with pagination, sorting, active filters, and stable ordering.
   */
  async listByWorkspace(
    workspaceId: string,
    query: {
      page: number;
      limit: number;
      sortBy: 'title' | 'status' | 'priority' | 'createdAt';
      sortOrder: 'asc' | 'desc';
      status?: IssueStatus;
      projectId?: string;
      assigneeUserId?: string;
    },
  ): Promise<{ total: number; data: Issue[] }> {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      status,
      projectId,
      assigneeUserId,
    } = query;
    const skip = (page - 1) * limit;
    // Build dynamic where clause based on active filters
    const where: any = {
      workspaceId,
      status: status ? status : { not: 'archived' }, // Exclude archived by default unless specifically requested
    };
    if (projectId) {
      where.projectId = projectId;
    }
    if (assigneeUserId) {
      where.assigneeUserId = assigneeUserId;
    }
    const [total, data] = await Promise.all([
      prisma.issue.count({ where }),
      prisma.issue.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { [sortBy]: sortOrder },
          { id: 'asc' }, // Stable sort fallback
        ],
      }),
    ]);
    return { total, data };
  }

  /**
   * List issues in a project with pagination, sorting, filters, and stable ordering.
   */
  async listByProject(
    projectId: string,
    workspaceId: string,
    query: {
      page: number;
      limit: number;
      sortBy: 'title' | 'status' | 'priority' | 'createdAt';
      sortOrder: 'asc' | 'desc';
      status?: IssueStatus;
      assigneeUserId?: string;
    },
  ): Promise<{ total: number; data: Issue[] }> {
    const { page, limit, sortBy, sortOrder, status, assigneeUserId } = query;
    const skip = (page - 1) * limit;
    const where: any = {
      projectId,
      workspaceId,
      status: status ? status : { not: 'archived' },
    };
    if (assigneeUserId) {
      where.assigneeUserId = assigneeUserId;
    }
    const [total, data] = await Promise.all([
      prisma.issue.count({ where }),
      prisma.issue.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { [sortBy]: sortOrder },
          { id: 'asc' }, // Stable sort fallback
        ],
      }),
    ]);
    return { total, data };
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
