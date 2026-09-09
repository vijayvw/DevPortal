import { Router } from 'express';
import { settingsController } from './settings.controller';

export const publicSettingsRouter = Router();

publicSettingsRouter.get(
  '/',
  settingsController.getPublic.bind(settingsController),
);
