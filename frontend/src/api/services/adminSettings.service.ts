import { apiClient } from "../client";
import type { ApiEnvelope } from "../types";

export interface PortfolioSettings {
  id: string;
  portfolioTitle: string | null;
  tagline: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  resumeUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePortfolioRequest {
  portfolioTitle?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  address?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  resumeUrl?: string;
}

export async function getPortfolioSettings() {
  const response = await apiClient.get<
    ApiEnvelope<PortfolioSettings>
  >("/admin/settings");

  return response.data.data;
}

export async function updatePortfolioSettings(
  data: UpdatePortfolioRequest
) {
  const response = await apiClient.patch<
    ApiEnvelope<PortfolioSettings>
  >(
    "/admin/settings",
    data
  );

  return response.data.data;
}
