/**
 * Mirrors the backend's standard API response envelope exactly
 * (backend/src/common/responses/ApiResponse.ts). Every endpoint returns
 * this shape — the Axios client's response interceptor unwraps it once,
 * centrally, so service functions never repeat that logic.
 */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
  errors?: ApiErrorDetail[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

/** What a service function returns to its React Query hook. */
export interface ApiResult<T> {
  data: T;
  meta?: PaginationMeta;
}

// ── DTOs, mirrored exactly from the backend service layer ──────────────
// (backend/src/modules/{projects,blog,skills,case-studies}/*.service.ts)
// Kept in sync manually for now — see frontend README M5 section for the
// tradeoff note on why this isn't code-generated yet.

export interface ProjectListItemDto {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  status: string;
  difficulty: string;
  category: string;
  technologies: string[];
  tags: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  videoUrl: string | null;
  pinned: boolean;
  featured: boolean;
  coverImageUrl: string | null;
  createdAt: string;
}

export interface ProjectDetailDto extends ProjectListItemDto {
  longDescription: string | null;
  dockerfile: string | null;
  dockerCompose: string | null;
  terraformCode: string | null;
  helmCharts: string | null;
  kubernetesYaml: string | null;
  lessonsLearned: string | null;
  challenges: string | null;
  solutions: string | null;
  futureImprovements: string | null;
  architectureDiagramUrl: string | null;
  galleryImages: string[];
  caseStudyIds: string[];
}

export interface BlogPostListItemDto {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  excerpt: string;
  tags: string[];
  heroImageUrl: string | null;
  readTimeMinutes: number;
  views: number;
  likes: number;
  commentsCount: number;
  featured: boolean;
  publishedAt: string | null;
}

export interface BlogPostDetailDto extends BlogPostListItemDto {
  contentMarkdown: string;
}

export interface SkillDto {
  id: string;
  name: string;
  category: string;
  iconUrl: string | null;
  proficiency: number;
  yearsExperience: number | null;
  priority: number;
}

export interface CaseStudyListItemDto {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  featured: boolean;
  timelineStart: string;
  timelineEnd: string;
  timelineDuration: string;
  technologies: string[];
  projectSlug: string | null;
}

export interface CaseStudyDetailDto extends CaseStudyListItemDto {
  challenge: string;
  solution: string[];
  impact: string[];
  impactMetrics: unknown;
  architectureComponents: string[];
  architecturePattern: string | null;
}

export interface ContactMessageDto {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  repliedAt: string | null;
  createdAt: string;
}
