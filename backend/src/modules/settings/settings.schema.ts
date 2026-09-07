import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    portfolioTitle: z.string().optional(),
    tagline: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    resumeUrl: z.string().url().optional(),
  }),
});
