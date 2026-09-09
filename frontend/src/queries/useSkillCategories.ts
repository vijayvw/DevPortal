import { useQuery } from "@tanstack/react-query";
import {
  getSkillCategories,
} from "../api/services/skillCategories.service";

export const skillCategoryKeys = {
  all: ["skill-categories"] as const,
  public: () => [...skillCategoryKeys.all, "public"] as const,
};

export function useSkillCategories() {
  return useQuery({
    queryKey: skillCategoryKeys.public(),
    queryFn: getSkillCategories,
  });
}
