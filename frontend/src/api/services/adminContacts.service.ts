import { apiClient } from "../client";
import type { ApiEnvelope } from "../types";

export type ContactStatus =
  | "UNREAD"
  | "READ"
  | "REPLIED"
  | "ARCHIVED";



export interface AdminContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;

  status: ContactStatus;

  repliedAt: string | null;
  createdAt: string;
}

export async function getAdminContacts() {
  const response =
    await apiClient.get<ApiEnvelope<AdminContact[]>>(
      "/contact"
    );

  return response.data.data;
}

export async function getAdminContact(id: string) {
  const response =
    await apiClient.get<ApiEnvelope<AdminContact>>(
      `/contact/${id}`
    );

  return response.data.data;
}

export async function updateContactStatus(
  id: string,
  status: ContactStatus
) {
  const response = await apiClient.patch(
    `/contact/${id}/status`,
    { status }
  );

  return response.data.data;
}

export async function markContactReplied(id: string) {
  const response = await apiClient.patch(
    `/contact/${id}/reply`
  );

  return response.data.data;
}
