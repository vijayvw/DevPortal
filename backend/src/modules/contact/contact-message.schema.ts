import { z } from 'zod';

export const createContactMessageSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    subject: z.string().min(1).max(200),
    message: z.string().min(1).max(5000),
  }),
});

export const contactMessageIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const contactMessageListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    status: z.string().optional(),
  }),
});

export const updateContactMessageSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    status: z.string().optional(),
    repliedAt: z.string().nullable().optional(),
  }),
});
