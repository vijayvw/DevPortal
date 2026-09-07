import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlogPost } from "../../api/services/adminBlog.service";

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBlogPost(id),

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
