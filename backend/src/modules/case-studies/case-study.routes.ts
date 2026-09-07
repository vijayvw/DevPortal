import { Router } from 'express';
import { caseStudyController } from './case-study.controller';
import {
  caseStudyIdSchema,
  caseStudyListSchema,
} from './case-study.schema';
import { validate } from '../../common/middleware/validate.middleware';

export const caseStudyRouter = Router();

caseStudyRouter.get(
  '/',
  validate(caseStudyListSchema),
  caseStudyController.list.bind(caseStudyController),
);

caseStudyRouter.get(
  '/:id',
  validate(caseStudyIdSchema),
  caseStudyController.get.bind(caseStudyController),
);
