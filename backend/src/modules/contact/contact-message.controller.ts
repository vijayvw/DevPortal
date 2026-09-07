import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { contactMessageService } from './contact-message.service';

export class ContactMessageController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.created(
        res,
        await contactMessageService.create(req.body),
        'Message sent successfully',
      );
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await contactMessageService.list(req.query),
      );
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await contactMessageService.get(req.params.id),
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await contactMessageService.update(req.params.id, req.body),
      );
    } catch (error) {
      next(error);
    }
  }
}

export const contactMessageController =
  new ContactMessageController();
