import { apiClient } from "../client";
import type { ApiEnvelope } from "../types";

export interface PublicSettings {
  portfolioTitle: string | null;
  tagline: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  resumeUrl: string | null;
}

export async function getPublicSettings(): Promise<PublicSettings | null> {
  const response = await apiClient.get<ApiEnvelope<PublicSettings | null>>(
    "/settings"
  );

  return response.data.data;
}
