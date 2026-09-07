import { apiClient } from '../client';
import type { ApiEnvelope, ApiResult, ProjectDetailDto, ProjectListItemDto } from '../types';

export interface ListProjectsParams {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  sortBy?: 'createdAt' | 'title' | 'pinned';
  sortOrder?: 'asc' | 'desc';
}

export async function getProjects(
  params: ListProjectsParams = {}
): Promise<ApiResult<ProjectListItemDto[]>> {
  const response = await apiClient.get<ApiEnvelope<ProjectListItemDto[]>>('/projects', { params });
  return { data: response.data.data, meta: response.data.meta };
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetailDto> {
  const response = await apiClient.get<ApiEnvelope<ProjectDetailDto>>(`/projects/${slug}`);
  return response.data.data;
}

export async function recordProjectView(slug: string): Promise<void> {
  await apiClient.post(`/projects/${slug}/view`);
}

export async function likeProject(slug: string): Promise<void> {
  await apiClient.post(`/projects/${slug}/like`);
}

export async function unlikeProject(slug: string): Promise<void> {
  await apiClient.delete(`/projects/${slug}/like`);
}
