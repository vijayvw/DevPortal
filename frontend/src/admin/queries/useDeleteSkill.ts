import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSkill } from "../../api/services/adminSkills.service";

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSkill(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-skills"],
      });
    },
  });
}
