import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProject,
  CreateProjectRequest,
} from "../../api/services/adminProjects.service";

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateProjectRequest>;
    }) => updateProject(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-projects"],
      });
    },
  });
}
