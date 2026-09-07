import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateBlogPost,
  type CreateBlogRequest,
} from "../../api/services/adminBlog.service";

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateBlogRequest>;
    }) => updateBlogPost(id, data),

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
