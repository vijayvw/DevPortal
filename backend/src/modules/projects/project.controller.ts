import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { projectService } from './project.service';

export class ProjectController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await projectService.listPublic(req.query),
      );
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await projectService.getPublic(req.params.id),
      );
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      return ApiResponse.success(
        res,
        await projectService.getPublicBySlug(
          req.params.slug,
        ),
      );
    } catch (error) {
      next(error);
    }
  }

  async view(req: Request, res: Response, next: NextFunction) {
    try {
      await projectService.incrementViews(req.params.id);
      return ApiResponse.success(res, null, 'View recorded');
    } catch (error) {
      next(error);
    }
  }

  async like(req: Request, res: Response, next: NextFunction) {
    try {
      await projectService.incrementLikes(req.params.id);
      return ApiResponse.success(res, null, 'Like recorded');
    } catch (error) {
      next(error);
    }
  }

  async unlike(req: Request, res: Response, next: NextFunction) {
    try {
      await projectService.decrementLikes(req.params.id);
      return ApiResponse.success(res, null, 'Like removed');
    } catch (error) {
      next(error);
    }
  }
}

export const projectController =
  new ProjectController();
