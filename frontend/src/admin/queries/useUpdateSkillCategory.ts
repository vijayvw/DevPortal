import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateSkillCategory,
  type CreateSkillCategoryRequest,
} from "../../api/services/skillCategories.service";
import { skillCategoryKeys } from "./useSkillCategories";

export function useUpdateSkillCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateSkillCategoryRequest>;
    }) => updateSkillCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: skillCategoryKeys.all,
      });
    },
  });
}
