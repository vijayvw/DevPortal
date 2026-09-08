import { z } from 'zod';

const projectFields = {
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  shortDescription: z.string().optional(),

  // Frontend uses longDescription; backend keeps legacy
  // description compatibility for existing DynamoDB records.
  longDescription: z.string().optional(),
  description: z.string().optional(),

  status: z.string().optional(),
  difficulty: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),

  // Project technologies are stored as technology IDs.
  technologyIds: z.array(z.string()).optional(),

  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
  dockerUrl: z.string().url().optional().or(z.literal('')),
  terraformUrl: z.string().url().optional().or(z.literal('')),
  helmUrl: z.string().url().optional().or(z.literal('')),
  kubernetesUrl: z.string().url().optional().or(z.literal('')),
  lessons: z.array(z.string()).optional(),
  challenges: z.array(z.string()).optional(),
  solutions: z.array(z.string()).optional(),
  futureImprovements: z.array(z.string()).optional(),
  pinned: z.boolean().optional(),
  featured: z.boolean().optional(),
  publishStatus: z.string().optional(),
  publishAt: z.string().nullable().optional(),
  coverImageId: z.string().nullable().optional(),
  architectureImageId: z.string().nullable().optional(),
  galleryImageIds: z.array(z.string()).optional(),
  caseStudyIds: z.array(z.string()).optional(),
};

export const createProjectSchema = z.object({
  body: z.object(projectFields),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object(projectFields).partial(),
});

export const projectIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const projectSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
});

export const projectListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    category: z.string().optional(),
    search: z.string().optional(),
  }),
});
