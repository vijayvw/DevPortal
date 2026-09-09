import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/responses/ApiResponse';
import { settingsService } from './settings.service';

export class SettingsController {
  async get(_req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await settingsService.get(),
      );
    } catch (error) {
      next(error);
    }
  }

  async getPublic(_req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingsService.get();

      if (!settings) {
        return ApiResponse.success(res, null);
      }

      return ApiResponse.success(res, {
        portfolioTitle: settings.portfolioTitle ?? null,
        tagline: settings.tagline ?? null,
        shortDescription: settings.shortDescription ?? null,
        yearsExperience: settings.yearsExperience ?? null,
        cloudPlatforms: settings.cloudPlatforms ?? null,
        technologies: settings.technologies ?? null,
        aboutGreeting: settings.aboutGreeting ?? null,
        aboutParagraphs: settings.aboutParagraphs ?? [],
        aboutQuote: settings.aboutQuote ?? null,
        aboutGoal: settings.aboutGoal ?? null,
        specializations: settings.specializations ?? [],
        timelineTitle: settings.timelineTitle ?? null,
        timelineSubtitle: settings.timelineSubtitle ?? null,
        timeline: settings.timeline ?? [],
        email: settings.email ?? null,
        phone: settings.phone ?? null,
        address: settings.address ?? null,
        github: settings.github ?? null,
        linkedin: settings.linkedin ?? null,
        twitter: settings.twitter ?? null,
        resumeUrl: settings.resumeUrl ?? null,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        await settingsService.update(req.body),
      );
    } catch (error) {
      next(error);
    }
  }
}

export const settingsController =
  new SettingsController();
