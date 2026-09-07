import { apiClient } from "../client";
import type { ApiEnvelope } from "../types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export async function login(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await apiClient.post<ApiEnvelope<LoginResponse>>(
    "/auth/login",
    credentials
  );

  return response.data.data;
}



export async function changePassword(
  payload: ChangePasswordRequest
): Promise<void> {
  await apiClient.put<ApiEnvelope<null>>(
    "/auth/change-password",
    payload
  );
}