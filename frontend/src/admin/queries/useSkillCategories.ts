import { useQuery } from "@tanstack/react-query";
import {
  getAdminSkillCategories,
  getSkillCategories,
} from "../../api/services/skillCategories.service";

export const skillCategoryKeys = {
  all: ["skill-categories"] as const,
  public: () => [...skillCategoryKeys.all, "public"] as const,
  admin: () => [...skillCategoryKeys.all, "admin"] as const,
};

export function useSkillCategories() {
  return useQuery({
    queryKey: skillCategoryKeys.public(),
    queryFn: getSkillCategories,
  });
}

export function useAdminSkillCategories() {
  return useQuery({
    queryKey: skillCategoryKeys.admin(),
    queryFn: getAdminSkillCategories,
  });
}
