import { useQuery } from '@tanstack/react-query';
import { getProjectBySlug, getProjects, type ListProjectsParams } from '../api/services/projects.service';
import { queryKeys } from './queryKeys';

/** Content that changes rarely once published — 5 minutes avoids
 * refetching on every tab focus while still staying reasonably fresh. */
const STALE_TIME_MS = 5 * 60 * 1000;

export function useProjects(params: ListProjectsParams = {}) {
  return useQuery({
    queryKey: queryKeys.projects.list(params),
    queryFn: () => getProjects(params),
    staleTime: STALE_TIME_MS,
  });
}

export function useProject(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.projects.detail(slug ?? ''),
    queryFn: () => getProjectBySlug(slug as string),
    enabled: Boolean(slug),
    staleTime: STALE_TIME_MS,
  });
}
