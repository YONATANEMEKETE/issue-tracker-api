import { prisma } from '../../shared/db/prisma.js';
import type { Project } from '../../generated/prisma/client.js';
import { ProjectQueryInput } from './projects.schema.js';

export class ProjectRepository {
  /**
   * Create a new project inside a workspace.
   */
  async create(data: {
    name: string;
    description?: string | null;
    workspaceId: string;
    createdByUserId: string;
  }): Promise<Project> {
    return prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        workspaceId: data.workspaceId,
        createdByUserId: data.createdByUserId,
      },
    });
  }

  /**
   * List all projects in a workspace (excluding archived projects by default, or listing them).
   * We will list all projects that belong to the workspace.
   */
  /**
   * List projects with pagination, sorting, and stable ordering.
   */
  async listByWorkspace(
    workspaceId: string,
    query: ProjectQueryInput,
  ): Promise<{ total: number; data: Project[] }> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;
    const where = { workspaceId };
    const [total, data] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
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
   * Find a single project by its unique ID.
   */
  async findById(projectId: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { id: projectId },
    });
  }

  /**
   * Update project fields.
   */
  async update(
    projectId: string,
    data: {
      name?: string;
      description?: string | null;
      status?: 'active' | 'archived';
    },
  ): Promise<Project> {
    return prisma.project.update({
      where: { id: projectId },
      data,
    });
  }

  /**
   * Soft-delete: Mark a project as archived.
   */
  async archive(projectId: string): Promise<Project> {
    return prisma.project.update({
      where: { id: projectId },
      data: { status: 'archived' },
    });
  }
}

export const projectRepository = new ProjectRepository();
