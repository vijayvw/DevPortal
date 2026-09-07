import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProjectBySlug,
  recordProjectView,
  likeProject,
  unlikeProject,
} from "../api/services/projects.service";

export function useProject(slug?: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug(slug!),
    enabled: !!slug,
  });
}

export function useRecordProjectView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordProjectView,
    onSuccess: (_data, slug) => {
      queryClient.invalidateQueries({
        queryKey: ["project", slug],
      });
    },
  });
}

export function useLikeProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likeProject,
    onSuccess: (_data, slug) => {
      queryClient.invalidateQueries({
        queryKey: ["project", slug],
      });
    },
  });
}

export function useUnlikeProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unlikeProject,
    onSuccess: (_data, slug) => {
      queryClient.invalidateQueries({
        queryKey: ["project", slug],
      });
    },
  });
}