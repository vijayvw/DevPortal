import { useCallback, useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

interface HeroImageCropModalProps {
  image: string;
  open: boolean;
  onCancel: () => void;
  onApply: (croppedAreaPixels: Area) => void;
}

export default function HeroImageCropModal({
  image,
  open,
  onCancel,
  onApply,
}: HeroImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const onCropComplete = useCallback(
  (_: Area, croppedPixels: Area) => {
    console.log("Crop Pixels:", croppedPixels);
    setCroppedAreaPixels(croppedPixels);
  },
  []
);
  useEffect(() => {
    if (open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(undefined);
    }
  }, [image, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-xl shadow-xl w-[900px] max-w-[95vw] p-6">
        <h2 className="text-xl font-semibold mb-4">
          Crop Hero Image
        </h2>

        <div className="relative h-[500px] bg-gray-900 rounded-lg overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            cropShape="rect"
            showGrid
            objectFit="horizontal-cover"
            restrictPosition={true}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-5">
          <label className="block text-sm mb-2">
            Zoom
          </label>

          <input
            className="w-full"
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (croppedAreaPixels) {
                onApply(croppedAreaPixels);
              }
            }}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}
