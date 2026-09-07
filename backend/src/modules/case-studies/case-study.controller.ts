import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { caseStudyService } from './case-study.service';

export class CaseStudyController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await caseStudyService.listPublic(req.query),
      );
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await caseStudyService.getPublic(req.params.id),
      );
    } catch (error) {
      next(error);
    }
  }

  async adminList(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await caseStudyService.listAdmin(req.query),
      );
    } catch (error) {
      next(error);
    }
  }

  async adminGet(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await caseStudyService.getAdmin(req.params.id),
      );
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.created(
        res,
        await caseStudyService.create(req.body),
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await caseStudyService.update(
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
      await caseStudyService.delete(req.params.id);
      return ApiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const caseStudyController =
  new CaseStudyController();
