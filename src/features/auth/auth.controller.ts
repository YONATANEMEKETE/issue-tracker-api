import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { LoginInput, RegisterInput } from './auth.schema.js';

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

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = req.body as LoginInput;
      const user = await authService.login(validatedData);
      // Save the user ID to the session cookie
      req.session.userId = user.id;
      res.status(200).json({
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      // Clear the session cookie on the client browser
      res.clearCookie('sid');

      // Return 204 No Content (matching our API contract)
      res.sendStatus(204);
    });
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
