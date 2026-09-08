import { Router } from 'express';
import { projectService } from './project.service';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { requireRoles } from '../../common/middleware/rbac.middleware';
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdSchema,
  projectListSchema,
} from './project.schema';
import { validate } from '../../common/middleware/validate.middleware';

export const projectAdminRouter = Router();

projectAdminRouter.use(
  requireAuth,
  requireRoles('ADMIN', 'EDITOR'),
);

projectAdminRouter.get(
  '/',
  validate(projectListSchema),
  async (req, res, next) => {
    try {
      return ApiResponse.success(
        res,
        await projectService.listAdmin(req.query),
      );
    } catch (error) {
      next(error);
    }
  },
);

projectAdminRouter.get(
  '/:id',
  validate(projectIdSchema),
  async (req, res, next) => {
    try {
      return ApiResponse.success(
        res,
        await projectService.getAdmin(req.params.id),
      );
    } catch (error) {
      next(error);
    }
  },
);

projectAdminRouter.post(
  '/',
  validate(createProjectSchema),
  async (req, res, next) => {
    try {
      return ApiResponse.created(
        res,
        await projectService.create(req.body),
      );
    } catch (error) {
      next(error);
    }
  },
);

projectAdminRouter.patch(
  '/:id',
  validate(updateProjectSchema),
  async (req, res, next) => {
    try {
      return ApiResponse.success(
        res,
        await projectService.update(
          req.params.id,
          req.body,
        ),
      );
    } catch (error) {
      next(error);
    }
  },
);

projectAdminRouter.patch(
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
        await projectService.updateStatus(
          req.params.id,
          publishStatus,
        ),
      );
    } catch (error) {
      next(error);
    }
  },
);

projectAdminRouter.delete(
  '/:id',
  validate(projectIdSchema),
  async (req, res, next) => {
    try {
      await projectService.delete(req.params.id);
      return ApiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  },
);
