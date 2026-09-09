import { z } from 'zod';

const skillFields = {
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  categoryId: z.string().min(1).max(100).optional(),
  iconUrl: z.string().url().nullable().optional(),
  proficiency: z.number().int().min(0).max(100),
  yearsExperience: z.number().int().min(0).max(50).nullable().optional(),
  priority: z.number().int().default(0),
  visible: z.boolean().default(true),
};

export const createSkillSchema = z.object({
  body: z.object(skillFields),
});

export const updateSkillSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object(skillFields).partial(),
});

export const skillIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
