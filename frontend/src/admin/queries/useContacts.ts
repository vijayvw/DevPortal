import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminContacts,
  getAdminContact,
  updateContactStatus,
  markContactReplied,
  deleteAdminContact,
  replyToAdminContact,
} from "../../api/services/adminContacts.service";

export function useContacts() {
  return useQuery({
    queryKey: ["admin-contacts"],
    queryFn: getAdminContacts,
  });
}

export function useContact(id?: string) {
  return useQuery({
    queryKey: ["admin-contact", id],
    queryFn: () => getAdminContact(id!),
    enabled: !!id,
  });
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
    }) => updateContactStatus(id, status),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-contacts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-contact", variables.id],
      });
    },
  });
}

export function useMarkReplied() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markContactReplied,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-contacts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-contact", id],
      });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminContact,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-contacts"],
      });

      queryClient.removeQueries({
        queryKey: ["admin-contact", id],
      });
    },
  });
}

export function useReplyToContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      message,
    }: {
      id: string;
      message: string;
    }) => replyToAdminContact(id, message),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-contacts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-contact", variables.id],
      });
    },
  });
}