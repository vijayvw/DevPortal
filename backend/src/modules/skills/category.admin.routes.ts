import { Router } from 'express';

import { categoryController } from './category.controller';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { requireRoles } from '../../common/middleware/rbac.middleware';
import { validate } from '../../common/middleware/validate.middleware';

import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from './category.schema';

export const categoryAdminRouter = Router();

categoryAdminRouter.use(
  requireAuth,
  requireRoles('ADMIN', 'EDITOR'),
);

categoryAdminRouter.get(
  '/',
  categoryController.adminList.bind(categoryController),
);

categoryAdminRouter.get(
  '/:id',
  validate(categoryIdSchema),
  categoryController.get.bind(categoryController),
);

categoryAdminRouter.post(
  '/',
  validate(createCategorySchema),
  categoryController.create.bind(categoryController),
);

categoryAdminRouter.patch(
  '/:id',
  validate(updateCategorySchema),
  categoryController.update.bind(categoryController),
);

categoryAdminRouter.delete(
  '/:id',
  validate(categoryIdSchema),
  categoryController.delete.bind(categoryController),
);
