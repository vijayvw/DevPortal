import { useQuery } from "@tanstack/react-query";
import { getAdminBlogPosts } from "../../api/services/adminBlog.service";

export function useBlogPosts() {
  return useQuery({
    queryKey: ["admin-blog"],
    queryFn: getAdminBlogPosts,
  });
}
