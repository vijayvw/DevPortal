import { useQuery } from "@tanstack/react-query";
import { getAdminBlogPost } from "../../api/services/adminBlog.service";

export function useAdminBlogPost(id: string | null) {
  return useQuery({
    queryKey: ["admin-blog", id],
    queryFn: () => getAdminBlogPost(id!),
    enabled: !!id,
  });
}
