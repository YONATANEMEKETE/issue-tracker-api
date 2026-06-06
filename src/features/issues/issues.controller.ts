import { Request, Response, NextFunction } from 'express';
import { issueService } from './issue.service.js';
import { CreateIssueInput, UpdateIssueInput } from './issues.schema.js';

export class IssueController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, projectId } = req.params;
      const userId = req.user!.id;
      const body = req.body as CreateIssueInput;

      const issue = await issueService.createIssue(
        body,
        projectId as string,
        workspaceId as string,
        userId,
      );

      res.status(201).json({
        data: issue,
      });
    } catch (error) {
      next(error);
    }
  }

  async listWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const issues = await issueService.listWorkspaceIssues(
        workspaceId as string,
      );

      res.status(200).json({
        data: issues,
      });
    } catch (error) {
      next(error);
    }
  }

  async listProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, projectId } = req.params;
      const issues = await issueService.listProjectIssues(
        projectId as string,
        workspaceId as string,
      );

      res.status(200).json({
        data: issues,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, issueId } = req.params;
      const issue = await issueService.getIssue(
        issueId as string,
        workspaceId as string,
      );

      res.status(200).json({
        data: issue,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, issueId } = req.params;
      const body = req.body as UpdateIssueInput;

      const issue = await issueService.updateIssue(
        issueId as string,
        workspaceId as string,
        body,
      );

      res.status(200).json({
        data: issue,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, issueId } = req.params;

      await issueService.deleteIssue(issueId as string, workspaceId as string);

      res.sendStatus(204); // 204 No Content for soft-deleting issues
    } catch (error) {
      next(error);
    }
  }
}

export const issueController = new IssueController();
