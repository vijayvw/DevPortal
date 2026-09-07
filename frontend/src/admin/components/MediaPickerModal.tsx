import { useMedia } from "../queries/useMedia";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, id: string) => void;
}

export default function MediaPickerModal({
  open,
  onClose,
  onSelect,
}: Props) {
  const { data, isLoading } = useMedia();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70">
      <div className="w-full max-w-5xl rounded-xl bg-neutral-900 p-8">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            Select Image
          </h2>

          <button
            onClick={onClose}
            className="rounded bg-neutral-700 px-4 py-2 text-white"
          >
            Close
          </button>
        </div>

        {isLoading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <div className="grid grid-cols-4 gap-5">
            {data?.map((media) => (
              <div
                key={media.id}
                onClick={() => {

                  onSelect(
                    media.url,
                    media.id
                  );

                  onClose();
                }}
                className="cursor-pointer overflow-hidden rounded-lg border border-neutral-700 hover:border-blue-500"
              >
                <img
                  src={media.url}
                  className="h-40 w-full object-cover"
                />

                <div className="p-2 text-xs text-white truncate">
                  {media.filename}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
