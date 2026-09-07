import { apiClient } from "../../../api/client";
import type { ApiEnvelope } from "../../../api/types";

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  folder?: string;
  createdAt: string;
}

export async function getMediaAssets() {
  const response = await apiClient.get<ApiEnvelope<MediaAsset[]>>(
    "/admin/media"
  );

  return response.data.data;
}

export async function uploadMedia(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post(
    "/admin/media",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data;
}

export async function deleteMedia(id: string) {
  await apiClient.delete(`/admin/media/${id}`);
}
