import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSkill,
  CreateSkillRequest,
} from "../../api/services/adminSkills.service";

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSkillRequest) =>
      createSkill(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-skills"],
      });
    },
  });
}
