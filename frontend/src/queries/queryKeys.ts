import type { ListBlogPostsParams } from '../api/services/blog.service';
import type { ListCaseStudiesParams } from '../api/services/caseStudies.service';
import type { ListProjectsParams } from '../api/services/projects.service';
import type { ListSkillsParams } from '../api/services/skills.service';

/**
 * Single source of truth for every React Query cache key used in the app.
 * Centralizing these (rather than inlining array literals in each hook)
 * means two things: no risk of two hooks accidentally using slightly
 * different keys for the same data (which would silently create two
 * separate cache entries), and one place to look when reasoning about
 * cache invalidation.
 *
 * Convention: each entity has a `list(params)` key (params included, so
 * different filter/sort/page combinations cache independently) and a
 * `detail(id)` key.
 */
export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    list: (params: ListProjectsParams) => ['projects', 'list', params] as const,
    detail: (slug: string) => ['projects', 'detail', slug] as const,
  },
  blogPosts: {
    all: ['blogPosts'] as const,
    list: (params: ListBlogPostsParams) => ['blogPosts', 'list', params] as const,
    detail: (slug: string) => ['blogPosts', 'detail', slug] as const,
  },
  skills: {
    all: ['skills'] as const,
    list: (params: ListSkillsParams) => ['skills', 'list', params] as const,
  },
  caseStudies: {
    all: ['caseStudies'] as const,
    list: (params: ListCaseStudiesParams) => ['caseStudies', 'list', params] as const,
    detail: (id: string) => ['caseStudies', 'detail', id] as const,
  },
  // No list/detail queries yet — POST /contact is a mutation, not a
  // query. Reserved for the future admin inbox view (M-later).
  contact: {
    all: ['contact'] as const,
  },
} as const;
