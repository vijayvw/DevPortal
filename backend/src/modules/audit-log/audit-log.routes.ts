import { Router } from 'express';
import { auditLogController } from './audit-log.controller';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { requireRoles } from '../../common/middleware/rbac.middleware';

export const auditLogRouter = Router();

auditLogRouter.use(
  requireAuth,
  requireRoles('ADMIN'),
);

auditLogRouter.get(
  '/',
  auditLogController.list.bind(auditLogController),
);
