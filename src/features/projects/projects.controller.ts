import { Request, Response, NextFunction } from 'express';
import { projectService } from './projects.services.js';
import {
  CreateProjectInput,
  ProjectQueryInput,
  UpdateProjectInput,
} from './projects.schema.js';

export class ProjectController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const userId = req.user!.id;
      const body = req.body as CreateProjectInput;

      const project = await projectService.createProject(
        body,
        workspaceId as string,
        userId,
      );

      res.status(201).json({
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const query = req.query as unknown as ProjectQueryInput;
      const { total, data } = await projectService.listProjects(
        workspaceId as string,
        query,
      );
      res.status(200).json({
        data,
        meta: {
          page: query.page,
          limit: query.limit,
          total,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, projectId } = req.params;
      const project = await projectService.getProject(
        projectId as string,
        workspaceId as string,
      );

      res.status(200).json({
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, projectId } = req.params;
      const body = req.body as UpdateProjectInput;

      const project = await projectService.updateProject(
        projectId as string,
        workspaceId as string,
        body,
      );

      res.status(200).json({
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, projectId } = req.params;

      await projectService.deleteProject(
        projectId as string,
        workspaceId as string,
      );

      res.sendStatus(204); // 204 No Content for successful soft deletion
    } catch (error) {
      next(error);
    }
  }
}

export const projectController = new ProjectController();
