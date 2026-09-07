import type { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors';

export function requireRoles(...roles: string[]) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
}
