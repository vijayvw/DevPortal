import { apiClient } from '../client';
import type { ApiEnvelope, ContactMessageDto } from '../types';

export interface SubmitContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactMessage(
  input: SubmitContactMessageInput
): Promise<ContactMessageDto> {
  const response = await apiClient.post<ApiEnvelope<ContactMessageDto>>('/contact', input);
  return response.data.data;
}
