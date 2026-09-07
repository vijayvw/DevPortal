import { Router } from 'express';
import { skillController } from './skill.controller';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { requireRoles } from '../../common/middleware/rbac.middleware';
import { validate } from '../../common/middleware/validate.middleware';
import {
  createSkillSchema,
  updateSkillSchema,
  skillIdSchema,
} from './skill.schema';

export const skillAdminRouter = Router();

skillAdminRouter.use(
  requireAuth,
  requireRoles('ADMIN', 'EDITOR'),
);

skillAdminRouter.get(
  '/',
  skillController.adminList.bind(skillController),
);

skillAdminRouter.get(
  '/:id',
  validate(skillIdSchema),
  skillController.get.bind(skillController),
);

skillAdminRouter.post(
  '/',
  validate(createSkillSchema),
  skillController.create.bind(skillController),
);

skillAdminRouter.patch(
  '/:id',
  validate(updateSkillSchema),
  skillController.update.bind(skillController),
);

skillAdminRouter.delete(
  '/:id',
  validate(skillIdSchema),
  skillController.delete.bind(skillController),
);
