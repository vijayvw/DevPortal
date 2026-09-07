import { Router } from 'express';
import { technologyController } from './technology.controller';

export const technologyRouter = Router();

technologyRouter.get(
  '/',
  technologyController.list.bind(technologyController),
);

technologyRouter.get(
  '/:id',
  technologyController.get.bind(technologyController),
);
