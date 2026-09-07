import { apiClient } from '../client';
import type { ApiEnvelope, SkillDto } from '../types';

export interface ListSkillsParams {
  category?: string;
}

export async function getSkills(params: ListSkillsParams = {}): Promise<SkillDto[]> {
  const response = await apiClient.get<ApiEnvelope<SkillDto[]>>('/skills', { params });
  return response.data.data;
}
