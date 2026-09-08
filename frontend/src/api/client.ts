import axios, { AxiosError } from 'axios';
import type { ApiEnvelope } from './types';

/**
 * Single Axios instance for all backend calls. Base URL comes from Vite's
 * env system (frontend/.env.development), not hardcoded, so staging/prod
 * builds can point elsewhere without a code change.
 */
  export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
  }

  return config;
});


apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * A normalized error shape every service function/query hook can rely on,
 * regardless of whether the failure was a network error, a timeout, or a
 * structured 4xx/5xx from the backend's ApiResponse.error() envelope.
 */
export class ApiClientError extends Error {
  public readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiEnvelope<unknown>>) => {
    const backendMessage = error.response?.data?.message;
    const message = backendMessage || error.message || 'Something went wrong. Please try again.';
    return Promise.reject(new ApiClientError(message, error.response?.status));
  }
);
