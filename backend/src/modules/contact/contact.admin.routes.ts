import { Router } from 'express';
import { contactMessageController } from './contact-message.controller';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { requireRoles } from '../../common/middleware/rbac.middleware';
import { validate } from '../../common/middleware/validate.middleware';
import {
  contactMessageIdSchema,
  contactMessageListSchema,
  updateContactMessageSchema,
} from './contact-message.schema';

export const contactAdminRouter = Router();

contactAdminRouter.use(
  requireAuth,
  requireRoles('ADMIN', 'EDITOR'),
);

contactAdminRouter.get(
  '/',
  validate(contactMessageListSchema),
  contactMessageController.list.bind(contactMessageController),
);

contactAdminRouter.get(
  '/:id',
  validate(contactMessageIdSchema),
  contactMessageController.get.bind(contactMessageController),
);

contactAdminRouter.patch(
  '/:id',
  validate(updateContactMessageSchema),
  contactMessageController.update.bind(contactMessageController),
);
