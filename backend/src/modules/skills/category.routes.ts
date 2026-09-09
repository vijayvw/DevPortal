import { Router } from 'express';
import { categoryController } from './category.controller';

export const categoryRouter = Router();

categoryRouter.get(
  '/',
  categoryController.list.bind(categoryController),
);

categoryRouter.get(
  '/:id',
  categoryController.get.bind(categoryController),
);
