import { apiClient } from "../client";
import type { ApiEnvelope } from "../types";

export interface SkillCategoryDto {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  priority: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateSkillCategoryRequest {
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  priority: number;
  visible: boolean;
}

export async function getSkillCategories() {
  const response = await apiClient.get<
    ApiEnvelope<SkillCategoryDto[]>
  >("/skill-categories");

  return response.data.data;
}

export async function getAdminSkillCategories() {
  const response = await apiClient.get<
    ApiEnvelope<SkillCategoryDto[]>
  >("/admin/skill-categories");

  return response.data.data;
}

export async function getAdminSkillCategory(id: string) {
  const response = await apiClient.get<
    ApiEnvelope<SkillCategoryDto>
  >(`/admin/skill-categories/${id}`);

  return response.data.data;
}

export async function createSkillCategory(
  data: CreateSkillCategoryRequest,
) {
  const response = await apiClient.post<
    ApiEnvelope<SkillCategoryDto>
  >("/admin/skill-categories", data);

  return response.data.data;
}

export async function updateSkillCategory(
  id: string,
  data: Partial<CreateSkillCategoryRequest>,
) {
  const response = await apiClient.patch<
    ApiEnvelope<SkillCategoryDto>
  >(`/admin/skill-categories/${id}`, data);

  return response.data.data;
}

export async function deleteSkillCategory(id: string) {
  await apiClient.delete(
    `/admin/skill-categories/${id}`,
  );
}
