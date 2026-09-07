import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createProject,
  CreateProjectRequest,
} from "../../api/services/adminProjects.service";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) =>
      createProject(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-projects"],
      });
    },
  });
}
