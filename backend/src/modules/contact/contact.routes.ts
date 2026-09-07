import { Router } from 'express';
import { contactMessageController } from './contact-message.controller';
import { validate } from '../../common/middleware/validate.middleware';
import { createContactMessageSchema } from './contact-message.schema';

export const contactRouter = Router();

contactRouter.post(
  '/',
  validate(createContactMessageSchema),
  contactMessageController.create.bind(contactMessageController),
);
