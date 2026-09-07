import { useQuery } from "@tanstack/react-query";
import { getAdminSkill } from "../../api/services/adminSkills.service";

export function useAdminSkill(id: string | null) {
  return useQuery({
    queryKey: ["admin-skill", id],
    queryFn: () => getAdminSkill(id!),
    enabled: !!id,
  });
}
