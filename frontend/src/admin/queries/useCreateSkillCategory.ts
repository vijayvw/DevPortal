import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSkillCategory,
  type CreateSkillCategoryRequest,
} from "../../api/services/skillCategories.service";
import { skillCategoryKeys } from "./useSkillCategories";

export function useCreateSkillCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSkillCategoryRequest) =>
      createSkillCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: skillCategoryKeys.all,
      });
    },
  });
}
