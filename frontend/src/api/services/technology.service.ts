import { apiClient } from "../client";
import type { ApiEnvelope } from "../types";

export interface Technology {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  color?: string | null;
  description?: string | null;
}

export async function getTechnologies() {
  const response = await apiClient.get<ApiEnvelope<Technology[]>>(
    "/technologies"
  );

  return response.data.data;
}
