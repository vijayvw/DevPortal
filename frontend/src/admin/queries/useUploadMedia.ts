import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadMedia } from "../api/services/media.service";

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["media"],
      });
    },
  });
}
