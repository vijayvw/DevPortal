import { z } from 'zod';

export const createBlogPostSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    slug: z.string().min(1).max(200),
    category: z.string().optional(),
    difficulty: z.string().optional(),
    excerpt: z.string().optional(),
    contentMarkdown: z.string().optional(),
    tags: z.array(z.string()).optional(),
    heroImageId: z.string().nullable().optional(),
    readTime: z.number().int().positive().optional(),
    featured: z.boolean().optional(),
    publishStatus: z.string().optional(),
    publishAt: z.string().nullable().optional(),
    publishedAt: z.string().nullable().optional(),
  }),
});

export const updateBlogPostSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: createBlogPostSchema.shape.body.partial(),
});

export const blogPostIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const blogPostSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
});

export const blogPostListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    category: z.string().optional(),
    search: z.string().optional(),
  }),
});
