import { z } from 'zod';

const fields = {
  projectId: z.string().nullable().optional(),
  title: z.string().min(1).max(200),
  subtitle: z.string().optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
  timelineStart: z.string().nullable().optional(),
  timelineEnd: z.string().nullable().optional(),
  duration: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  impact: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  impactMetrics: z.array(z.unknown()).optional(),
  architectureComponents: z.array(z.unknown()).optional(),
  pattern: z.string().optional(),
  publishStatus: z.string().optional(),
};

export const createCaseStudySchema = z.object({
  body: z.object(fields),
});

export const updateCaseStudySchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object(fields).partial(),
});

export const caseStudyIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const caseStudyListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    category: z.string().optional(),
    featured: z.coerce.boolean().optional(),
    search: z.string().optional(),
  }),
});
