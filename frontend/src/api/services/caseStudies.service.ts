import { apiClient } from '../client';
import type { ApiEnvelope, ApiResult, CaseStudyDetailDto, CaseStudyListItemDto } from '../types';

export interface ListCaseStudiesParams {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
}

export async function getCaseStudies(
  params: ListCaseStudiesParams = {}
): Promise<ApiResult<CaseStudyListItemDto[]>> {
  const response = await apiClient.get<ApiEnvelope<CaseStudyListItemDto[]>>('/case-studies', { params });
  return { data: response.data.data, meta: response.data.meta };
}

export async function getCaseStudyById(id: string): Promise<CaseStudyDetailDto> {
  const response = await apiClient.get<ApiEnvelope<CaseStudyDetailDto>>(`/case-studies/${id}`);
  return response.data.data;
}
