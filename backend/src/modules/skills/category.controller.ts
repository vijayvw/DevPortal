import type {
  Request,
  Response,
  NextFunction,
} from 'express';

import { ApiResponse } from '../../common/responses/ApiResponse';
import { categoryService } from './category.service';

export class CategoryController {
  async list(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      return ApiResponse.success(
        res,
        await categoryService.listPublic(),
      );
    } catch (error) {
      next(error);
    }
  }

  async adminList(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      return ApiResponse.success(
        res,
        await categoryService.listAdmin(),
      );
    } catch (error) {
      next(error);
    }
  }

  async get(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      return ApiResponse.success(
        res,
        await categoryService.get(req.params.id),
      );
    } catch (error) {
      next(error);
    }
  }

  async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      return ApiResponse.created(
        res,
        await categoryService.create(req.body),
      );
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      return ApiResponse.success(
        res,
        await categoryService.update(
          req.params.id,
          req.body,
        ),
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await categoryService.delete(req.params.id);
      return ApiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
