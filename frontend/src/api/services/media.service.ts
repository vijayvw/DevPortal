import { apiClient } from "../client";

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  folder?: string | null;
}

export async function uploadMedia(file: File, folder = "projects") {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("folder", folder);

  const response = await apiClient.post(
  "/admin/media",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);

  return response.data.data as MediaAsset;
}
