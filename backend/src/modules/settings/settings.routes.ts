import { Router } from 'express';

import { settingsController } from './settings.controller';
import { validate } from '../../common/middleware/validate.middleware';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { requireRoles } from '../../common/middleware/rbac.middleware';

import { updateSettingsSchema } from './settings.schema';

export const settingsRouter = Router();

settingsRouter.use(
  requireAuth,
  requireRoles('ADMIN', 'EDITOR'),
);

settingsRouter.get(
  '/',
  settingsController.get.bind(settingsController),
);

settingsRouter.patch(
  '/',
  validate(updateSettingsSchema),
  settingsController.update.bind(settingsController),
);
