import { useMutation } from '@tanstack/react-query';
import { submitContactMessage, type SubmitContactMessageInput } from '../api/services/contact.service';

/**
 * First mutation (as opposed to query) in the app — POST /contact has no
 * cached data to read, just a side effect. No cache invalidation is
 * needed here since there's no admin inbox view querying this data yet.
 */
export function useContactForm() {
  return useMutation({
    mutationFn: (input: SubmitContactMessageInput) => submitContactMessage(input),
  });
}
