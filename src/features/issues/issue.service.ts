import { issueRepository } from './issues.repository.js';
import { projectRepository } from '../projects/projects.repository.js';
import { workspaceRepository } from '../workspace/workspace.repository.js';
import { notFound, validationError } from '../../shared/errors/error.js';
import type { Issue } from '../../generated/prisma/client.js';
import { CreateIssueInput, UpdateIssueInput } from './issues.schema.js';

export class IssueService {
  /**
   * Business rule: Create an issue in a project.
   * Safety check: Verify the project belongs to the workspace, and the assignee is a member.
   */
  async createIssue(
    input: CreateIssueInput,
    projectId: string,
    workspaceId: string,
    userId: string,
  ): Promise<Issue> {
    // 1. Verify project exists and belongs to the target workspace
    const project = await projectRepository.findById(projectId);
    if (!project || project.workspaceId !== workspaceId) {
      throw notFound('Project not found in this workspace');
    }

    // 2. Verify assignee (if provided) is actually a member of the workspace
    if (input.assigneeUserId) {
      const membership = await workspaceRepository.findMembership(
        input.assigneeUserId,
        workspaceId,
      );
      if (!membership) {
        throw validationError('Assignee must be a member of the workspace');
      }
    }

    return issueRepository.create({
      ...input,
      projectId,
      workspaceId,
      createdByUserId: userId,
    });
  }

  /**
   * Business rule: List all issues in a workspace.
   */
  async listWorkspaceIssues(workspaceId: string): Promise<Issue[]> {
    return issueRepository.listByWorkspace(workspaceId);
  }

  /**
   * Business rule: List all issues in a specific project.
   */
  async listProjectIssues(
    projectId: string,
    workspaceId: string,
  ): Promise<Issue[]> {
    // Verify project exists and belongs to the workspace
    const project = await projectRepository.findById(projectId);
    if (!project || project.workspaceId !== workspaceId) {
      throw notFound('Project not found in this workspace');
    }

    return issueRepository.listByProject(projectId, workspaceId);
  }

  /**
   * Security check (Resource Scope Layer): Fetch a single issue, ensuring it belongs to the workspace.
   */
  async getIssue(issueId: string, workspaceId: string): Promise<Issue> {
    const issue = await issueRepository.findById(issueId);

    if (!issue || issue.workspaceId !== workspaceId) {
      throw notFound('Issue not found in this workspace');
    }

    return issue;
  }

  /**
   * Business rule: Update an issue (handles status transitions, assignment updates, details).
   */
  async updateIssue(
    issueId: string,
    workspaceId: string,
    input: UpdateIssueInput,
  ): Promise<Issue> {
    // 1. Verify the issue exists and belongs to the workspace
    await this.getIssue(issueId, workspaceId);

    // 2. Verify assignee (if changed) is a member of the workspace
    if (input.assigneeUserId) {
      const membership = await workspaceRepository.findMembership(
        input.assigneeUserId,
        workspaceId,
      );
      if (!membership) {
        throw validationError('Assignee must be a member of the workspace');
      }
    }

    return issueRepository.update(issueId, input);
  }

  /**
   * Business rule: Soft-delete (archive) an issue.
   */
  async deleteIssue(issueId: string, workspaceId: string): Promise<Issue> {
    // Verify issue existence and scope
    await this.getIssue(issueId, workspaceId);

    return issueRepository.archive(issueId);
  }
}

export const issueService = new IssueService();
