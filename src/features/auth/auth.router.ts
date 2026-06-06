import { Router } from 'express';
import { authController } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.schema.js';
import { validate } from '../../shared/middlewares/validate.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validate({ body: registerSchema }),
  authController.register.bind(authController),
);

authRouter.post(
  '/login',
  validate({ body: loginSchema }),
  authController.login.bind(authController),
);
