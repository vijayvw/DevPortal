import { apiClient } from '../client';
import type { ApiEnvelope, ApiResult, BlogPostDetailDto, BlogPostListItemDto } from '../types';

export interface ListBlogPostsParams {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  sortBy?: 'createdAt' | 'publishedAt' | 'views' | 'likes' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export async function getBlogPosts(
  params: ListBlogPostsParams = {}
): Promise<ApiResult<BlogPostListItemDto[]>> {
  const response = await apiClient.get<ApiEnvelope<BlogPostListItemDto[]>>('/blog', { params });
  return { data: response.data.data, meta: response.data.meta };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetailDto> {
  const response = await apiClient.get<ApiEnvelope<BlogPostDetailDto>>(`/blog/${slug}`);
  return response.data.data;
}

export async function likeBlog(slug: string): Promise<void> {
  await apiClient.post(`/blog/${slug}/like`);
}

export async function unlikeBlog(slug: string): Promise<void> {
  await apiClient.delete(`/blog/${slug}/like`);
}
