import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { authService } from './auth.service';

export class AuthController {
  async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(
        email,
        password,
      );

      return ApiResponse.success(
        res,
        result,
        'Login successful',
      );
    } catch (error) {
      next(error);
    }
  }

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await authService.refresh(
        req.body.refreshToken,
      );

      return ApiResponse.success(
        res,
        result,
        'Token refreshed successfully',
      );
    } catch (error) {
      next(error);
    }
  }

  async logout(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await authService.logout(
        req.body.refreshToken,
      );

      return ApiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await authService.changePassword(
        req.user!.id,
        req.body.currentPassword,
        req.body.newPassword,
      );

      return ApiResponse.success(
        res,
        null,
        'Password changed successfully',
      );
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await authService.updateProfile(
        req.user!.id,
        req.body,
      );

      return ApiResponse.success(
        res,
        user,
        'Profile updated successfully',
      );
    } catch (error) {
      next(error);
    }
  }

  async me(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await authService.getCurrentUser(
        req.user!.id,
      );

      return ApiResponse.success(
        res,
        user,
        'Current user retrieved successfully',
      );
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
