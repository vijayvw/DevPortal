import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { AppError } from '../errors';
import { ApiResponse } from '../responses/ApiResponse';
import { logger } from '../logger/logger';
import { config } from '../../config';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    logger.warn({ errors }, 'Validation error');

    ApiResponse.error(res, 'Validation failed', 422, errors);
    return;
  }

  if (err instanceof AppError) {
    const logPayload = {
      statusCode: err.statusCode,
      message: err.message,
    };

    if (err.isOperational) {
      logger.warn(logPayload, 'Operational error');
    } else {
      logger.error(
        { ...logPayload, stack: err.stack },
        'Non-operational AppError',
      );
    }

    const errors = Array.isArray(err.errors) ? err.errors : undefined;

    ApiResponse.error(
      res,
      err.message,
      err.statusCode,
      errors,
    );

    return;
  }

  const error =
    err instanceof Error
      ? err
      : new Error('Unknown error');

  logger.error(
    {
      stack: error.stack,
      message: error.message,
    },
    'Unhandled exception',
  );

  ApiResponse.error(
    res,
    config.isProduction
      ? 'Internal server error'
      : error.message,
    500,
  );
}

export function notFoundHandler(
  req: Request,
  res: Response,
): void {
  ApiResponse.error(
    res,
    `Route ${req.method} ${req.originalUrl} not found`,
    404,
  );
}
