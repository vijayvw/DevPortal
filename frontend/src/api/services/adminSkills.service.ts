import { apiClient } from "../client";
import type { ApiEnvelope, SkillDto } from "../types";

export async function getAdminSkills() {
  const response = await apiClient.get<ApiEnvelope<SkillDto[]>>(
    "/admin/skills"
  );

  return response.data.data;
}
export interface CreateSkillRequest {
  name: string;
  category: string;
  categoryId: string;
  iconUrl?: string | null;
  proficiency: number;
  yearsExperience?: number | null;
  priority: number;
  visible: boolean;
}

export async function createSkill(
  data: CreateSkillRequest
) {
  const response = await apiClient.post(
    "/admin/skills",
    data
  );

  return response.data.data;
}

export async function getAdminSkill(id: string) {
  const response = await apiClient.get<ApiEnvelope<SkillDto>>(
    `/admin/skills/${id}`
  );

  return response.data.data;
}

export async function updateSkill(
  id: string,
  data: Partial<CreateSkillRequest>
) {
  const response = await apiClient.patch(
    `/admin/skills/${id}`,
    data
  );

  return response.data.data;
}

export async function deleteSkill(id: string) {
  await apiClient.delete(`/admin/skills/${id}`);
}
