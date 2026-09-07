import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { config } from '../../config';

export interface AccessTokenPayload {
  sub: string;
  role: string;
}

export interface RefreshTokenPayload {
  sub: string;
  role: string;
  jti: string;
}

export function signAccessToken(
  userId: string,
  role: string,
): string {
  return jwt.sign(
    {
      sub: userId,
      role,
    },
    config.jwt.accessSecret,
    {
      expiresIn: config.jwt.accessExpiry as jwt.SignOptions['expiresIn'],
    },
  );
}

export function signRefreshToken(
  userId: string,
  role: string,
): string {
  return jwt.sign(
    {
      sub: userId,
      role,
      jti: randomUUID(),
    },
    config.jwt.refreshSecret,
    {
      expiresIn:
        config.jwt.refreshExpiry as jwt.SignOptions['expiresIn'],
    },
  );
}

export function verifyAccessToken(
  token: string,
): AccessTokenPayload {
  return jwt.verify(
    token,
    config.jwt.accessSecret,
  ) as AccessTokenPayload;
}

export function verifyRefreshToken(
  token: string,
): RefreshTokenPayload {
  return jwt.verify(
    token,
    config.jwt.refreshSecret,
  ) as RefreshTokenPayload;
}
