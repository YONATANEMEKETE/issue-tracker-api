import { workspaceRepository } from './workspace.repository.js';
import { notFound } from '../../shared/errors/error.js';
import type { Workspace } from '../../generated/prisma/client.js';

export class WorkspaceService {
  /**
   * Business rule: Create a workspace and automatically establish the creator's admin membership.
   */
  async createWorkspace(name: string, userId: string): Promise<Workspace> {
    return workspaceRepository.createWorkspaceWithAdmin(name, userId);
  }

  /**
   * Business rule: Get all workspaces that the user belongs to.
   */
  async listWorkspaces(userId: string): Promise<Workspace[]> {
    return workspaceRepository.listForUser(userId);
  }

  /**
   * Business rule: Fetch specific workspace details.
   */
  async getWorkspaceDetails(workspaceId: string): Promise<Workspace> {
    const workspace = await workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw notFound('Workspace not found');
    }
    return workspace;
  }

  /**
   * Business rule: Update workspace metadata (e.g. name).
   * Note: Permission checks are already handled by route middleware.
   */
  async updateWorkspace(workspaceId: string, name: string): Promise<Workspace> {
    return workspaceRepository.update(workspaceId, name);
  }
}

export const workspaceService = new WorkspaceService();
