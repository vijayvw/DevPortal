import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMedia } from "../api/services/media.service";

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["media"],
      });
    },
  });
}
