import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { auditLogService } from './audit-log.service';

export class AuditLogController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await auditLogService.list(req.query),
      );
    } catch (error) {
      next(error);
    }
  }
}

export const auditLogController =
  new AuditLogController();
