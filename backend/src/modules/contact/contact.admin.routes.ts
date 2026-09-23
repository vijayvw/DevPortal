import { Router } from 'express';
import { contactMessageController } from './contact-message.controller';
import { requireAuth } from '../../common/middleware/auth.middleware';
import { requireRoles } from '../../common/middleware/rbac.middleware';
import { validate } from '../../common/middleware/validate.middleware';
import {
  contactMessageIdSchema,
  contactMessageListSchema,
  replyContactMessageSchema,
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

contactAdminRouter.delete(
  '/:id',
  validate(contactMessageIdSchema),
  contactMessageController.delete.bind(contactMessageController),
);

contactAdminRouter.post(
  '/:id/reply',
  validate(replyContactMessageSchema),
  contactMessageController.reply.bind(contactMessageController),
);