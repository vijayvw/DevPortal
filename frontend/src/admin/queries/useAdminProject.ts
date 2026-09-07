import { useQuery } from "@tanstack/react-query";
import { getAdminProject } from "../../api/services/adminProjects.service";

export function useAdminProject(id: string | null) {
  return useQuery({
    queryKey: ["admin-project", id],
    queryFn: () => getAdminProject(id!),
    enabled: !!id,
  });
}
