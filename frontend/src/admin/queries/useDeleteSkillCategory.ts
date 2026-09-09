import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSkillCategory } from "../../api/services/skillCategories.service";
import { skillCategoryKeys } from "./useSkillCategories";

export function useDeleteSkillCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSkillCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: skillCategoryKeys.all,
      });
    },
  });
}
