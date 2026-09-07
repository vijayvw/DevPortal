import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { technologyService } from './technology.service';

export class TechnologyController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await technologyService.list(
          req.query.search as string | undefined,
        ),
      );
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await technologyService.get(req.params.id),
      );
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.created(
        res,
        await technologyService.create(req.body),
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await technologyService.update(
          req.params.id,
          req.body,
        ),
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await technologyService.delete(req.params.id);
      return ApiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const technologyController =
  new TechnologyController();
