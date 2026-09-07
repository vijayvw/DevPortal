import type { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    meta?: PaginationMeta,
    statusCode = 200,
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta ? { meta } : {}),
    });
  }

  static created<T>(
    res: Response,
    data: T,
    message = 'Created successfully',
  ) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static noContent(res: Response) {
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: null,
    });
  }

  static error(
    res: Response,
    message: string,
    statusCode = 500,
    errors?: unknown,
    data: unknown = null,
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      data,
      ...(errors !== undefined ? { errors } : {}),
    });
  }
}
