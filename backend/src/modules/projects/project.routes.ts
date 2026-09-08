import { Router } from 'express';
import { projectController } from './project.controller';
import {
  projectIdSchema,
  projectListSchema,
  projectSlugSchema,
} from './project.schema';
import { validate } from '../../common/middleware/validate.middleware';

export const projectRouter = Router();

projectRouter.get(
  '/',
  validate(projectListSchema),
  projectController.list.bind(projectController),
);

projectRouter.get(
  '/slug/:slug',
  validate(projectSlugSchema),
  projectController.getBySlug.bind(projectController),
);

projectRouter.get(
  '/:slug',
  validate(projectSlugSchema),
  projectController.getBySlug.bind(projectController),
);

projectRouter.post(
  '/:id/view',
  validate(projectIdSchema),
  projectController.view.bind(projectController),
);

projectRouter.post(
  '/:id/like',
  validate(projectIdSchema),
  projectController.like.bind(projectController),
);

projectRouter.delete(
  '/:id/like',
  validate(projectIdSchema),
  projectController.unlike.bind(projectController),
);
