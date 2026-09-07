import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { userRepository } from '../users/user.dynamodb.repository';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from './jwt.util';
import { cacheService } from '../../infrastructure/cache/DynamoDBCacheService';
import {
  UnauthorizedError,
  NotFoundError,
} from '../../common/errors';

const REFRESH_PREFIX = 'AUTH_REFRESH#';

function getRefreshCacheKey(jti: string): string {
  return `${REFRESH_PREFIX}${jti}`;
}

function getExpirySeconds(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);

  if (!match) {
    return 7 * 24 * 60 * 60;
  }

  const value = Number(match[1]);

  switch (match[2]) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      return 7 * 24 * 60 * 60;
  }
}

export class AuthService {
  async login(
    email: string,
    password: string,
  ) {
    const user = await userRepository.findByEmail(email);

    if (!user || user.deletedAt) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const valid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id, user.role);

    const decoded = verifyRefreshToken(refreshToken);

    await cacheService.set(
      getRefreshCacheKey(decoded.jti),
      {
        userId: user.id,
      },
      getExpirySeconds(configuredRefreshExpiry()),
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string) {
    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const cached = await cacheService.get<{ userId: string }>(
      getRefreshCacheKey(payload.jti),
    );

    if (!cached || cached.userId !== payload.sub) {
      throw new UnauthorizedError('Refresh token is invalid');
    }

    await cacheService.del(
      getRefreshCacheKey(payload.jti),
    );

    const user = await userRepository.findById(payload.sub);

    if (!user || user.deletedAt) {
      throw new NotFoundError('User not found');
    }

    const newAccessToken = signAccessToken(
      user.id,
      user.role,
    );

    const newRefreshToken = signRefreshToken(
      user.id,
      user.role,
    );

    const newPayload = verifyRefreshToken(newRefreshToken);

    await cacheService.set(
      getRefreshCacheKey(newPayload.jti),
      {
        userId: user.id,
      },
      getExpirySeconds(configuredRefreshExpiry()),
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = verifyRefreshToken(refreshToken);

      await cacheService.del(
        getRefreshCacheKey(payload.jti),
      );
    } catch {
      // Logout remains idempotent for invalid/expired tokens.
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await userRepository.findById(userId);

    if (!user || user.deletedAt) {
      throw new NotFoundError('User not found');
    }

    const valid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!valid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(
      newPassword,
      12,
    );

    await userRepository.update(userId, {
      passwordHash,
    });
  }

  async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user || user.deletedAt) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}

function configuredRefreshExpiry(): string {
  // Kept as a function so token/cache expiry stays centralized.
  return require('../../config').config.jwt.refreshExpiry;
}

export const authService = new AuthService();
