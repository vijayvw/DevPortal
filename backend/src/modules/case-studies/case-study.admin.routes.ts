import { Router } from 'express';
import { caseStudyController } from './case-study.controller';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { requireRoles } from '../../common/middleware/rbac.middleware';
import { validate } from '../../common/middleware/validate.middleware';
import {
  createCaseStudySchema,
  updateCaseStudySchema,
  caseStudyIdSchema,
  caseStudyListSchema,
} from './case-study.schema';

export const caseStudyAdminRouter = Router();

caseStudyAdminRouter.use(
  requireAuth,
  requireRoles('ADMIN', 'EDITOR'),
);

caseStudyAdminRouter.get(
  '/',
  validate(caseStudyListSchema),
  caseStudyController.adminList.bind(caseStudyController),
);

caseStudyAdminRouter.get(
  '/:id',
  validate(caseStudyIdSchema),
  caseStudyController.adminGet.bind(caseStudyController),
);

caseStudyAdminRouter.post(
  '/',
  validate(createCaseStudySchema),
  caseStudyController.create.bind(caseStudyController),
);

caseStudyAdminRouter.patch(
  '/:id',
  validate(updateCaseStudySchema),
  caseStudyController.update.bind(caseStudyController),
);

caseStudyAdminRouter.delete(
  '/:id',
  validate(caseStudyIdSchema),
  caseStudyController.delete.bind(caseStudyController),
);
