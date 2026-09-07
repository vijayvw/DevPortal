import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { skillService } from './skill.service';

export class SkillController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await skillService.listPublic(),
      );
    } catch (error) {
      next(error);
    }
  }

  async adminList(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await skillService.listAdmin(),
      );
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await skillService.get(req.params.id),
      );
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.created(
        res,
        await skillService.create(req.body),
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await skillService.update(
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
      await skillService.delete(req.params.id);
      return ApiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const skillController = new SkillController();
