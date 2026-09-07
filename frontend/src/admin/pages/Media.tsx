import { useRef } from "react";
import AdminLayout from "../components/AdminLayout";
import { useMedia } from "../queries/useMedia";
import { useUploadMedia } from "../queries/useUploadMedia";
import { useDeleteMedia } from "../queries/useDeleteMedia";

export default function Media() {
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useMedia();
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();

  if (isLoading) {
    return (
      <AdminLayout>
        <p className="text-white">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">
          Media Library
        </h1>

        <button
          onClick={() => fileRef.current?.click()}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          Upload Image
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            if (e.target.files?.[0]) {
              uploadMutation.mutate(e.target.files[0]);
            }
          }}
        />
      </div>

      <div className="grid grid-cols-5 gap-6">
        {data?.map((media) => (
          <div
            key={media.id}
            className="rounded-xl border border-neutral-700 bg-neutral-900 p-3"
          >
            <img
              src={media.url}
              alt={media.filename}
              className="mb-3 h-40 w-full rounded object-cover"
            />

            <p className="truncate text-sm text-white">
              {media.filename}
            </p>

            <p className="text-xs text-neutral-400">
              {(media.size / 1024).toFixed(1)} KB
            </p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(media.url)}
                className="rounded bg-blue-600 px-3 py-1 text-xs text-white"
              >
                Copy URL
              </button>

              <button
                onClick={() => deleteMutation.mutate(media.id)}
                className="rounded bg-red-600 px-3 py-1 text-xs text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
