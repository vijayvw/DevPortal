import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createBlogPost,
  type CreateBlogRequest,
} from "../../api/services/adminBlog.service";

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlogRequest) =>
      createBlogPost(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-blog"],
      });
    },
  });
}
