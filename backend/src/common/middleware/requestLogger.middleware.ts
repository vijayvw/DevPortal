import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { logger } from '../logger/logger';
import { runWithRequestContext } from '../context/request-context';

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const requestId = req.header('X-Request-Id') || randomUUID();

  res.setHeader('X-Request-Id', requestId);

  const start = process.hrtime.bigint();

  runWithRequestContext(requestId, () => {
    res.on('finish', () => {
      const durationMs =
        Number(process.hrtime.bigint() - start) / 1_000_000;

      logger.info(
        {
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          durationMs: Number(durationMs.toFixed(2)),
          ip: req.ip,
        },
        'HTTP request completed',
      );
    });

    next();
  });
}
