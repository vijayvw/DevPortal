import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { settingsService } from './settings.service';

export class SettingsController {
  async get(_req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await settingsService.get(),
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await settingsService.update(req.body),
      );
    } catch (error) {
      next(error);
    }
  }
}

export const settingsController =
  new SettingsController();
