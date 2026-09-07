import { apiClient } from "../client";
import type { ApiEnvelope } from "../types";

export interface DashboardStats {
  counts: {
    projects: number;
    blogPosts: number;
    skills: number;
    caseStudies: number;
    contactMessages: number;
    unreadContactMessages: number;
  };

  recent: {
    projects: unknown[];
    blogPosts: unknown[];
    caseStudies: unknown[];
    contactMessages: unknown[];
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get<ApiEnvelope<DashboardStats>>(
    "/admin/dashboard/stats"
  );

  return response.data.data;
}
