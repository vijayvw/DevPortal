import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { dashboardService } from './dashboard.service';

export class DashboardController {
  async stats(_req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await dashboardService.getStats(),
      );
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController =
  new DashboardController();
