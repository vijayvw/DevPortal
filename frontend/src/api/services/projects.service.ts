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
  const response = await apiClient.get<
    ApiEnvelope<{ items: ProjectListItemDto[]; meta: NonNullable<ApiEnvelope<unknown>['meta']> }>
  >('/projects', { params });

  return {
    data: response.data.data.items,
    meta: response.data.data.meta,
  };
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetailDto> {
  const response = await apiClient.get<ApiEnvelope<ProjectDetailDto>>(`/projects/${slug}`);
  return response.data.data;
}

export async function recordProjectView(id: string): Promise<void> {
  await apiClient.post(`/projects/${id}/view`);
}

export async function likeProject(id: string): Promise<void> {
  await apiClient.post(`/projects/${id}/like`);
}

export async function unlikeProject(id: string): Promise<void> {
  await apiClient.delete(`/projects/${id}/like`);
}
