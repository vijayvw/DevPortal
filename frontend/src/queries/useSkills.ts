import { useQuery } from '@tanstack/react-query';
import { getSkills, type ListSkillsParams } from '../api/services/skills.service';
import { queryKeys } from './queryKeys';

const STALE_TIME_MS = 10 * 60 * 1000; // skills change even less often than content

export function useSkills(params: ListSkillsParams = {}) {
  return useQuery({
    queryKey: queryKeys.skills.list(params),
    queryFn: () => getSkills(params),
    staleTime: STALE_TIME_MS,
  });
}
