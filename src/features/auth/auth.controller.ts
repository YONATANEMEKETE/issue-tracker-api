import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { RegisterInput } from './auth.schema.js';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // req.body is already validated and typed by our middleware
      const validatedData = req.body as RegisterInput;

      const user = await authService.register(validatedData);

      // Establish session
      req.session.userId = user.id;

      res.status(201).json({
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
