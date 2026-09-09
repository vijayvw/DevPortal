import { z } from 'zod';

const categoryFields = {
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must contain only lowercase letters, numbers, and hyphens',
    ),
  icon: z.string().min(1).max(50).nullable().optional(),
  description: z.string().max(300).nullable().optional(),
  priority: z.number().int().min(0).default(0),
  visible: z.boolean().default(true),
};

export const createCategorySchema = z.object({
  body: z.object(categoryFields),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object(categoryFields).partial(),
});

export const categoryIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
