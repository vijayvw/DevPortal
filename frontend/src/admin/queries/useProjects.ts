import { useQuery } from "@tanstack/react-query";
import { getAdminProjects } from "../../api/services/adminProjects.service";

export function useProjects() {
  return useQuery({
    queryKey: ["admin-projects"],
    queryFn: getAdminProjects,
  });
}
