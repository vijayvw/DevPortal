import { useState } from "react";
import { uploadMedia } from "../../../api/services/media.service";

interface Props {
  value?: string;
  onChange: (mediaId: string) => void;
}

export default function ImageUploader({
  value,
  onChange,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));

    setUploading(true);

    try {
      const media = await uploadMedia(file, "projects");

      onChange(media.id);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-white font-medium">
        Cover Image
      </label>

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="h-48 w-full rounded-lg object-cover"
        />
      )}

      {!preview && value && (
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
