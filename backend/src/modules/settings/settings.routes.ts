import { Router } from 'express';
import { settingsController } from './settings.controller';
import { validate } from '../../common/middleware/validate.middleware';
import { updateSettingsSchema } from './settings.schema';

export const settingsRouter = Router();

settingsRouter.get(
  '/',
  settingsController.get.bind(settingsController),
);

settingsRouter.put(
  '/',
  validate(updateSettingsSchema),
  settingsController.update.bind(settingsController),
);
