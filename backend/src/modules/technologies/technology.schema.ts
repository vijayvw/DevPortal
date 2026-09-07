import { z } from 'zod';

const fields = {
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  icon: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
};

export const createTechnologySchema = z.object({
  body: z.object(fields),
});

export const updateTechnologySchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object(fields).partial(),
});

export const technologyIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});
