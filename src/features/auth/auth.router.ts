import { Router } from 'express';
import { authController } from './auth.controller.js';
import { registerSchema } from './auth.schema.js';
import { validate } from '../../shared/middlewares/validate.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validate({ body: registerSchema }),
  authController.register.bind(authController),
);
