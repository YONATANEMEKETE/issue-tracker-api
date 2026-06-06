import { Request, Response, NextFunction } from 'express';
import { workspaceService } from './workspace.service.js';
import {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from './workspace.schema.js';

export class WorkspaceController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id; // req.user is guaranteed by requireAuth
      const { name } = req.body as CreateWorkspaceInput;

      const workspace = await workspaceService.createWorkspace(name, userId);

      res.status(201).json({
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const workspaces = await workspaceService.listWorkspaces(userId);

      res.status(200).json({
        data: workspaces,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const workspace = await workspaceService.getWorkspaceDetails(
        workspaceId as string,
      );

      res.status(200).json({
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const { name } = req.body as UpdateWorkspaceInput;

      const workspace = await workspaceService.updateWorkspace(
        workspaceId as string,
        name,
      );

      res.status(200).json({
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const workspaceController = new WorkspaceController();
