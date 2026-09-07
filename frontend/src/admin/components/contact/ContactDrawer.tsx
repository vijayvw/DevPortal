import {
  useContact,
  useMarkReplied,
  useUpdateContactStatus,
} from "../../queries/useContacts";

interface Props {
  contactId: string | null;
  onClose: () => void;
}

export default function ContactDrawer({
  contactId,
  onClose,
}: Props) {
  const { data, isLoading } = useContact(contactId ?? undefined);

  const updateStatus = useUpdateContactStatus();
  const markReplied = useMarkReplied();

  if (!contactId) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60"
      onClick={onClose}
    >
      
      <div
        className="absolute right-0 top-0 h-full w-[540px] overflow-y-auto border-l border-zinc-800 bg-zinc-900 p-8"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          onClick={onClose}
          className="mb-8 rounded-lg bg-zinc-800 px-4 py-2 hover:bg-zinc-700"
        >
          Close
        </button>

        {isLoading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : !data ? (
          <p className="text-red-400">Contact not found.</p>
        ) : (
          <>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                {data.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div className="flex-1">

                <h2 className="text-2xl font-bold">
                  {data.name}
                </h2>

                <a
                  href={`mailto:${data.email}`}
                  className="text-blue-400 hover:underline"
                >
                  {data.email}
                </a>

              </div>

            </div>


            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
                  Status
                </p>

                <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm">
                  {data.status}
                </span>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
                  Submitted
                </p>

                <p className="text-sm text-zinc-300">
                  {new Date(data.createdAt).toLocaleString()}
                </p>
              </div>

            </div>

            <div className="mt-8">
              <p className="mb-2 text-sm text-zinc-500">
                Subject
              </p>

              <p className="font-medium">
                {data.subject}
              </p>
            </div>

            <div className="mt-8">
              <p className="mb-2 text-sm text-zinc-500">
                Message
              </p>

              <div className="min-h-[180px] rounded-xl border border-zinc-800 bg-black/40 p-5 text-zinc-200 whitespace-pre-wrap leading-7">
                {data.message}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              
                {data.status === "UNREAD" && (
                  <button
                    disabled={updateStatus.isPending}
                    onClick={() =>
                      updateStatus.mutate(
                        {
                          id: data.id,
                          status: "READ",
                        },
                        {
                          onSuccess: () => onClose(),
                        }
                      )
                    }
                    className="rounded-lg bg-green-600 px-4 py-2 transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updateStatus.isPending ? "Updating..." : "Mark Read"}
                  </button>
                )}
      

              {data.status === "READ" && (
                <button
                  disabled={markReplied.isPending}
                  onClick={() =>
                    markReplied.mutate(data.id, {
                      onSuccess: () => onClose(),
                    })
                  }
                  className="rounded-lg bg-purple-600 px-4 py-2 transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {markReplied.isPending ? "Updating..." : "Mark Replied"}
                </button>
              )}

              {data.status !== "ARCHIVED" && (
                <button
                  disabled={updateStatus.isPending}
                  onClick={() => {
                    const confirmed = window.confirm(
                      "Are you sure you want to archive this message?"
                    );

                    if (!confirmed) return;

                    updateStatus.mutate(
                      {
                        id: data.id,
                        status: "ARCHIVED",
                      },
                      {
                        onSuccess: () => onClose(),
                      }
                    );
                  }}
                  className="rounded-lg bg-zinc-700 px-4 py-2 transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updateStatus.isPending ? "Archiving..." : "Archive"}
                </button>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
}
