import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { requireRoles } from '../../common/middleware/rbac.middleware';

export const dashboardRouter = Router();

dashboardRouter.use(
  requireAuth,
  requireRoles('ADMIN', 'EDITOR'),
);

dashboardRouter.get(
  '/stats',
  dashboardController.stats.bind(dashboardController),
);
