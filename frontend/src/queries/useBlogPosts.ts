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
    mutationFn: ({ id }: { id: string; slug: string }) => likeBlog(id),

    onSuccess: (_data, { slug }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.blogPosts.detail(slug),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.blogPosts.all,
      });
    },
  });
}

export function useUnlikeBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; slug: string }) => unlikeBlog(id),

    onSuccess: (_data, { slug }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.blogPosts.detail(slug),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.blogPosts.all,
      });
    },
  });
}

export function useViewBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; slug: string }) => viewBlog(id),

    onSuccess: (_data, { slug }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.blogPosts.detail(slug),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.blogPosts.all,
      });
    },
  });
}
