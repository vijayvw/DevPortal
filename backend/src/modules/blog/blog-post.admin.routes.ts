import { Router } from 'express';
import { blogPostService } from './blog-post.service';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { requireRoles } from '../../common/middleware/rbac.middleware';
import {
  createBlogPostSchema,
  updateBlogPostSchema,
  blogPostIdSchema,
  blogPostListSchema,
} from './blog-post.schema';
import { validate } from '../../common/middleware/validate.middleware';

export const blogPostAdminRouter = Router();

blogPostAdminRouter.use(
  requireAuth,
  requireRoles('ADMIN', 'EDITOR'),
);

blogPostAdminRouter.get(
  '/',
  validate(blogPostListSchema),
  async (req, res, next) => {
    try {
      return ApiResponse.success(
        res,
        await blogPostService.listAdmin(req.query),
      );
    } catch (error) {
      next(error);
    }
  },
);

blogPostAdminRouter.get(
  '/:id',
  validate(blogPostIdSchema),
  async (req, res, next) => {
    try {
      return ApiResponse.success(
        res,
        await blogPostService.getAdmin(req.params.id),
      );
    } catch (error) {
      next(error);
    }
  },
);

blogPostAdminRouter.post(
  '/',
  validate(createBlogPostSchema),
  async (req, res, next) => {
    try {
      return ApiResponse.created(
        res,
        await blogPostService.create(req.body),
      );
    } catch (error) {
      next(error);
    }
  },
);

blogPostAdminRouter.patch(
  '/:id',
  validate(updateBlogPostSchema),
  async (req, res, next) => {
    try {
      return ApiResponse.success(
        res,
        await blogPostService.update(
          req.params.id,
          req.body,
        ),
      );
    } catch (error) {
      next(error);
    }
  },
);

blogPostAdminRouter.patch(
  '/:id/status',
  async (req, res, next) => {
    try {
      const { publishStatus } = req.body ?? {};

      if (!['DRAFT', 'PUBLISHED', 'SCHEDULED'].includes(publishStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid publishStatus',
        });
      }

      return ApiResponse.success(
        res,
        await blogPostService.updateStatus(
          req.params.id,
          publishStatus,
        ),
      );
    } catch (error) {
      next(error);
    }
  },
);

blogPostAdminRouter.delete(
  '/:id',
  validate(blogPostIdSchema),
  async (req, res, next) => {
    try {
      await blogPostService.delete(req.params.id);
      return ApiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  },
);
