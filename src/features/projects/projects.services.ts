import { projectRepository } from './projects.repository.js';
import { notFound } from '../../shared/errors/error.js';
import type { Project } from '../../generated/prisma/client.js';
import { CreateProjectInput, UpdateProjectInput } from './projects.schema.js';

export class ProjectService {
  /**
   * Business rule: Create a project inside a workspace.
   */
  async createProject(
    input: CreateProjectInput,
    workspaceId: string,
    userId: string,
  ): Promise<Project> {
    return projectRepository.create({
      ...input,
      workspaceId,
      createdByUserId: userId,
    });
  }

  /**
   * Business rule: List all projects in a workspace.
   */
  async listProjects(workspaceId: string): Promise<Project[]> {
    return projectRepository.listByWorkspace(workspaceId);
  }

  /**
   * Security rule (Resource Scope Layer): Fetch a project, but ensure it belongs to the target workspace.
   * If it doesn't match, throw a 404 (to avoid leaking project existence to non-members).
   */
  async getProject(projectId: string, workspaceId: string): Promise<Project> {
    const project = await projectRepository.findById(projectId);

    if (!project || project.workspaceId !== workspaceId) {
      throw notFound('Project not found in this workspace');
    }

    return project;
  }

  /**
   * Business rule: Update project settings.
   */
  async updateProject(
    projectId: string,
    workspaceId: string,
    input: UpdateProjectInput,
  ): Promise<Project> {
    // 1. Verify that the project exists and is in the correct workspace
    await this.getProject(projectId, workspaceId);

    // 2. Perform the update
    return projectRepository.update(projectId, input);
  }

  /**
   * Business rule: Soft-delete (archive) a project.
   */
  async deleteProject(
    projectId: string,
    workspaceId: string,
  ): Promise<Project> {
    // 1. Verify that the project exists and is in the correct workspace
    await this.getProject(projectId, workspaceId);

    // 2. Archive the project
    return projectRepository.archive(projectId);
  }
}

export const projectService = new ProjectService();
