import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { UnauthorizedError } from '../errors';

export interface AuthenticatedUser {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const header = req.header('Authorization');

  if (!header?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authentication required'));
  }

  const token = header.substring(7).trim();

  try {
    const payload = jwt.verify(
      token,
      config.jwt.accessSecret,
    ) as jwt.JwtPayload;

    if (!payload.sub || typeof payload.role !== 'string') {
      throw new Error('Invalid token payload');
    }

    req.user = {
      id: String(payload.sub),
      role: payload.role,
    };

    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}
