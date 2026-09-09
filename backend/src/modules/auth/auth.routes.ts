import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from './auth.controller';
import {
  loginSchema,
  refreshSchema,
  changePasswordSchema,
  updateProfileSchema,
} from './auth.schema';
import { validate } from '../../common/middleware/validate.middleware';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { config } from '../../config';

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: config.rateLimit.loginWindowMs,
  max: config.rateLimit.loginMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  authController.login.bind(authController),
);

authRouter.post(
  '/refresh',
  validate(refreshSchema),
  authController.refresh.bind(authController),
);

authRouter.post(
  '/logout',
  validate(refreshSchema),
  authController.logout.bind(authController),
);

authRouter.get(
  '/me',
  requireAuth,
  authController.me.bind(authController),
);


authRouter.patch(
  '/me',
  requireAuth,
  validate(updateProfileSchema),
  authController.updateProfile.bind(authController),
);

authRouter.post(
  '/change-password',
  requireAuth,
  validate(changePasswordSchema),
  authController.changePassword.bind(authController),
);
