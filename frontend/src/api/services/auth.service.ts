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

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
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
  await apiClient.post<ApiEnvelope<null>>(
    "/auth/change-password",
    payload
  );
}

export async function updateProfile(
  payload: UpdateProfileRequest
): Promise<AuthUser> {
  const response = await apiClient.patch<ApiEnvelope<AuthUser>>(
    "/auth/me",
    payload
  );

  return response.data.data;
}
