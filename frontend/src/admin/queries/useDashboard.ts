import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../api/services/dashboard.service";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
  });
}
