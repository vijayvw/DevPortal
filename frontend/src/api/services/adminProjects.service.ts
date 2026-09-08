import { apiClient } from "../client";
import type { ApiEnvelope } from "../types";

export interface AdminProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  status: string;
  publishStatus: string;
  featured: boolean;
  pinned: boolean;

  shortDescription?: string;
  description?: string;
  longDescription?: string;

  technologyIds?: string[];

  coverImageId?: string;
  coverImageUrl?: string;

  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
}

export async function getAdminProjects() {
  const response = await apiClient.get<ApiEnvelope<{ items: AdminProject[]; meta: any }>>(
    "/admin/projects"
  );

  return response.data.data.items;
}

export interface CreateProjectRequest {
  title: string;
  slug: string;
  shortDescription: string;

  longDescription?: string;

  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

  status: string;

  featured: boolean;
  pinned: boolean;

  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;

  technologyIds: string[];

  coverImageId?: string;
}


export async function createProject(
  data: CreateProjectRequest
) {
  const response = await apiClient.post(
    "/admin/projects",
    data
  );

  return response.data.data;
}

export async function getAdminProject(id: string) {
  const response = await apiClient.get<ApiEnvelope<AdminProject>>(
    `/admin/projects/${id}`
  );

  const project = response.data.data;

  return {
    ...project,
    longDescription:
      project.longDescription ??
      project.description ??
      "",
    technologyIds: Array.isArray(project.technologyIds)
      ? project.technologyIds
      : [],
    coverImageId: project.coverImageId ?? "",
  };
}

export async function updateProject(
  id: string,
  data: Partial<CreateProjectRequest>
) {
  const response = await apiClient.patch(
    `/admin/projects/${id}`,
    data
  );

  return response.data.data;
}

export async function updateProjectStatus(
  id: string,
  publishStatus: "DRAFT" | "PUBLISHED" | "SCHEDULED"
) {
  const response = await apiClient.patch(
    `/admin/projects/${id}/status`,
    { publishStatus }
  );

  return response.data.data;
}
export async function deleteProject(id: string) {
  await apiClient.delete(`/admin/projects/${id}`);
}
