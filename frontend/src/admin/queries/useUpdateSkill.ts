import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateSkill,
  CreateSkillRequest,
} from "../../api/services/adminSkills.service";

export function useUpdateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateSkillRequest>;
    }) => updateSkill(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-skills"],
      });
    },
  });
}
