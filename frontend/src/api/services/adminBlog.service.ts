import { apiClient } from "../client";
import type { ApiEnvelope } from "../types";

export interface AdminBlogPostList {
  id: string;
  title: string;
  slug: string;

  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  excerpt: string;
  featured: boolean;
  tags: string[];
  heroImageUrl: string | null;
  publishStatus: string;
}

export interface AdminBlogPost extends AdminBlogPostList {
  contentMarkdown: string;
  heroImageId: string | null;
}

export async function getAdminBlogPosts() {
  const response = await apiClient.get<
    ApiEnvelope<AdminBlogPostList[]>
  >("/admin/blog");

  return response.data.data;
}

export interface CreateBlogRequest {
  title: string;
  slug: string;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  excerpt: string;
  contentMarkdown: string;
  featured: boolean;
  tags: string[];
  heroImageId?: string;
}

export async function createBlogPost(
  data: CreateBlogRequest
) {
  const response = await apiClient.post(
    "/admin/blog",
    data
  );

  return response.data.data;
}

export async function updateBlogStatus(
  id: string,
  publishStatus: "DRAFT" | "PUBLISHED" | "SCHEDULED"
) {
  const response = await apiClient.patch(
    `/admin/blog/${id}/status`,
    { publishStatus }
  );

  return response.data.data;
}

export async function deleteBlogPost(id: string) {
  await apiClient.delete(`/admin/blog/${id}`);
}

export async function getAdminBlogPost(id: string) {
  const response = await apiClient.get<
    ApiEnvelope<AdminBlogPost>
  >(`/admin/blog/${id}`);

  return response.data.data;
}

export async function updateBlogPost(
  id: string,
  data: Partial<CreateBlogRequest>
) {
  const response = await apiClient.put(
    `/admin/blog/${id}`,
    data
  );

  return response.data.data;
}