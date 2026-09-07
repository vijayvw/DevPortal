import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBlogStatus } from "../../api/services/adminBlog.service";

export function useUpdateBlogStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
    }) => updateBlogStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-blog"],
      });

      queryClient.invalidateQueries({
        queryKey: ["blog-posts"],
      });
    },
  });
}
