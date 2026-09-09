import { useQuery } from "@tanstack/react-query";
import {
  getPublicSettings,
  type PublicSettings,
} from "../api/services/settings.service";

export function usePublicSettings() {
  return useQuery<PublicSettings | null>({
    queryKey: ["public-settings"],
    queryFn: getPublicSettings,
    staleTime: 5 * 60 * 1000,
  });
}
