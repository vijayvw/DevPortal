import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProjectStatus } from "../../api/services/adminProjects.service";

export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
    }) => updateProjectStatus(id, status),

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
