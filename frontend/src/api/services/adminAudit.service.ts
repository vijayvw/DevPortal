import { apiClient } from "../client";

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  actorId: string | null;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface AuditLogResponse {
  items: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

export const adminAuditService = {
  async getAuditLogs(params?: {
    page?: number;
    limit?: number;
    entityType?: string;
    action?: string;
    actorId?: string;
  }) {
    const { data } = await apiClient.get<AuditLogResponse>("/audit-logs", {
      params,
    });

    return data;
  },
};
