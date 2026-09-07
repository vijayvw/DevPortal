import { Router } from 'express';
import { technologyController } from './technology.controller';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { requireRoles } from '../../common/middleware/rbac.middleware';
import { validate } from '../../common/middleware/validate.middleware';
import {
  createTechnologySchema,
  updateTechnologySchema,
  technologyIdSchema,
} from './technology.schema';

export const technologyAdminRouter = Router();

technologyAdminRouter.use(
  requireAuth,
  requireRoles('ADMIN', 'EDITOR'),
);

technologyAdminRouter.post(
  '/',
  validate(createTechnologySchema),
  technologyController.create.bind(technologyController),
);

technologyAdminRouter.patch(
  '/:id',
  validate(updateTechnologySchema),
  technologyController.update.bind(technologyController),
);

technologyAdminRouter.delete(
  '/:id',
  validate(technologyIdSchema),
  technologyController.delete.bind(technologyController),
);
