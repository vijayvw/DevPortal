import { useQuery } from "@tanstack/react-query";
import { adminAuditService } from "../../api/services/adminAudit.service";

export function useAuditLogs(params?: {
  page?: number;
  limit?: number;
  entityType?: string;
  action?: string;
  actorId?: string;
}) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => adminAuditService.getAuditLogs(params),
  });
}
