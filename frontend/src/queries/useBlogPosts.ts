import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getBlogPostBySlug,
  viewBlog,
  getBlogPosts,
  likeBlog,
  unlikeBlog,
  type ListBlogPostsParams,
} from '../api/services/blog.service';
import { queryKeys } from './queryKeys';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useBlogPosts(params: ListBlogPostsParams = {}) {
  return useQuery({
    queryKey: queryKeys.blogPosts.list(params),
    queryFn: () => getBlogPosts(params),
    staleTime: STALE_TIME_MS,
  });
}

export function useBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.blogPosts.detail(slug ?? ''),
    queryFn: () => getBlogPostBySlug(slug as string),
    enabled: Boolean(slug),
    staleTime: STALE_TIME_MS,
  });
}

export function useLikeBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => likeBlog(slug),

    onSuccess: (_data, slug) => {

      queryClient.invalidateQueries({
        queryKey: queryKeys.blogPosts.list({}),
      });
    },
  });
}

export function useUnlikeBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => unlikeBlog(slug),

    onSuccess: (_data, slug) => {

      queryClient.invalidateQueries({
        queryKey: queryKeys.blogPosts.list({}),
      });
    },
  });
}

export function useViewBlog() {
  return useMutation({
    mutationFn: (id: string) => viewBlog(id),
  });
}
