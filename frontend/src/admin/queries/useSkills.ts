import { useQuery } from "@tanstack/react-query";
import { getAdminSkills } from "../../api/services/adminSkills.service";

export function useSkills() {
  return useQuery({
    queryKey: ["admin-skills"],
    queryFn: getAdminSkills,
  });
}
