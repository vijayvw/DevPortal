import { Router } from 'express';
import { blogPostController } from './blog-post.controller';
import {
  blogPostIdSchema,
  blogPostListSchema,
  blogPostSlugSchema,
} from './blog-post.schema';
import { validate } from '../../common/middleware/validate.middleware';

export const blogPostRouter = Router();

blogPostRouter.get(
  '/',
  validate(blogPostListSchema),
  blogPostController.list.bind(blogPostController),
);

blogPostRouter.get(
  '/slug/:slug',
  validate(blogPostSlugSchema),
  blogPostController.getBySlug.bind(blogPostController),
);

blogPostRouter.get(
  '/:id',
  validate(blogPostIdSchema),
  blogPostController.get.bind(blogPostController),
);

blogPostRouter.post(
  '/:id/view',
  validate(blogPostIdSchema),
  blogPostController.view.bind(blogPostController),
);

blogPostRouter.post(
  '/:id/like',
  validate(blogPostIdSchema),
  blogPostController.like.bind(blogPostController),
);

blogPostRouter.delete(
  '/:id/like',
  validate(blogPostIdSchema),
  blogPostController.unlike.bind(blogPostController),
);
