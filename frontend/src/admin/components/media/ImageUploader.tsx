import { useEffect, useState } from "react";
import { uploadMedia } from "../../../api/services/media.service";

interface Props {
  value?: string;
  imageUrl?: string | null;
  onChange: (mediaId: string) => void;
}

export default function ImageUploader({
  value,
  imageUrl,
  onChange,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(null);
  }, [value, imageUrl]);

  async function handleFile(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    setUploading(true);

    try {
      const media = await uploadMedia(file, "projects");
      onChange(media.id);
    } finally {
      setUploading(false);
    }
  }

  const displayImage = preview || imageUrl;

  return (
    <div className="space-y-3">
      <label className="block font-medium text-white">
        Cover Image
      </label>

      {displayImage && (
        <img
          src={displayImage}
          alt="Project cover"
          className="h-48 w-full rounded-lg object-cover"
        />
      )}

      {!displayImage && value && (
        <p className="text-sm text-green-400">
          Existing image attached
        </p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
      />

      {uploading && (
        <p className="text-sm text-blue-400">
          Uploading...
        </p>
      )}
    </div>
  );
}
