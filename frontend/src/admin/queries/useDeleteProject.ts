import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteProject } from "../../api/services/adminProjects.service";

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-projects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}
