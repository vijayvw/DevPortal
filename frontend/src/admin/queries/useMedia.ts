import { useQuery } from "@tanstack/react-query";
import { getMediaAssets } from "../api/services/media.service";

export function useMedia() {
  return useQuery({
    queryKey: ["media"],
    queryFn: getMediaAssets,
  });
}
