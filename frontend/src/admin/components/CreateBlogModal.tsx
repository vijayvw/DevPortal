import { useRef, useState } from "react";
import { useCreateBlogPost } from "../queries/useCreateBlogPost";
import MediaPickerModal from "./MediaPickerModal";
import RichTextEditor, {
  RichTextEditorRef,
} from "@/components/editor/RichTextEditor";
import { useUploadMedia } from "../queries/useUploadMedia";
import HeroImageCropModal from "../../components/admin/HeroImageCropModal";
import { getCroppedImg } from "@/utils/imageCrop";
import { Area } from "react-easy-crop";

function slugify(text: string) {

  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateBlogModal({
  open,
  onClose,
}: Props) {
  const createMutation = useCreateBlogPost();
  const editorRef = useRef<RichTextEditorRef>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<"hero" | "editor">("hero");
  const uploadMutation = useUploadMedia();
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState("");
  

  const [form, setForm] = useState({
    
    title: "",
    slug: "",
    category: "",
    difficulty: "BEGINNER" as
      | "BEGINNER"
      | "INTERMEDIATE"
      | "ADVANCED",
    excerpt: "",
    contentMarkdown: "",
    featured: false,
    tags: "",
    heroImage: "",
    heroImageId: "",
  });

  if (!open) return null;

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    await createMutation.mutateAsync({
      title: form.title,
      slug: form.slug,
      category: form.category,
      difficulty: form.difficulty,
      excerpt: form.excerpt,
      contentMarkdown: form.contentMarkdown,
      featured: form.featured,

      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),

      heroImageId: form.heroImageId || undefined,
    });

    onClose();

    setForm({
      title: "",
      slug: "",
      category: "",
      difficulty: "BEGINNER",
      excerpt: "",
      contentMarkdown: "",
      featured: false,
      tags: "",
      heroImage: "",
      heroImageId: "",
    });
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
          rounded-xl
          bg-neutral-900
          p-8
        "
      >
        <h2 className="mb-6 text-2xl font-bold text-white">
          Add Blog Post
        </h2>

        <div className="space-y-4">

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((prev) => ({
                ...prev,
                title,
                slug: slugify(title),
              }));
            }}  
            className="w-full rounded bg-neutral-800 p-3 text-white"
          />

          <input
            placeholder="Slug"
            value={form.slug}
            onChange={(e) =>
              updateField("slug", slugify(e.target.value))
            }
            className="w-full rounded bg-neutral-800 p-3 text-white"
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              updateField("category", e.target.value)
            }
            className="w-full rounded bg-neutral-800 p-3 text-white"
          />

          <input
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => updateField("tags", e.target.value)}
            className="w-full rounded bg-neutral-800 p-3 text-white"
          />

          <select
            value={form.difficulty}
            onChange={(e) =>
              updateField(
                "difficulty",
                e.target.value as
                  | "BEGINNER"
                  | "INTERMEDIATE"
                  | "ADVANCED"
              )
            }
            className="w-full rounded bg-neutral-800 p-3 text-white"
          >
            <option>BEGINNER</option>
            <option>INTERMEDIATE</option>
            <option>ADVANCED</option>
          </select>

          <textarea
            placeholder="Excerpt"
            value={form.excerpt}
            onChange={(e) =>
              updateField("excerpt", e.target.value)
            }
            rows={3}
            className="w-full rounded bg-neutral-800 p-3 text-white"
          />

          <div className="space-y-2">
            <label className="text-white font-medium">
              Hero Image
            </label>

            <div className="flex gap-3">
              <input
                value={form.heroImage}
                readOnly
                placeholder="No image selected"
                className="flex-1 rounded bg-neutral-800 p-3 text-white"
              />

              <button
                type="button"
                onClick={() => {
                  setPickerMode("hero");
                  setPickerOpen(true);
                }}
                className="rounded bg-blue-600 px-4 text-white hover:bg-blue-700"
              >
                Choose
              </button>
            </div>

            {form.heroImage && (
              <img
                src={form.heroImage}
                alt="Preview"
                className="h-40 rounded border border-neutral-700"
              />
            )}
          </div>

          <RichTextEditor
            ref={editorRef}
            value={form.contentMarkdown}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                contentMarkdown: value,
              }))
            }
            onInsertImage={() => {
              setPickerMode("editor");
              setPickerOpen(true);
            }}
          />

          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                updateField(
                  "featured",
                  e.target.checked
                )
              }
            />
            Featured
          </label>

        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-neutral-700 px-4 py-2 text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            {createMutation.isPending
              ? "Creating..."
              : "Create Blog"}
          </button>
        </div>
      </form>
      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url, id) => {
          if (pickerMode === "hero") {
            setCropImage(url);

            setPickerOpen(false);
            setShowCropModal(true);

            return;
          }
          editorRef.current?.insertImage(url);
          setPickerOpen(false);
        }}
      />
    <HeroImageCropModal
      open={showCropModal}
      image={cropImage}
      onCancel={() => setShowCropModal(false)}
      onApply={async (cropArea: Area) => {
        console.log("Received crop:", cropArea);
        const blob = await getCroppedImg(cropImage, cropArea);

        const file = new File([blob], "hero-image.jpg", {
          type: "image/jpeg",
        });

        const media = await uploadMutation.mutateAsync(file);

        setForm((prev) => ({
          ...prev,
          heroImage: media.url,
          heroImageId: media.id,
        }));

        setShowCropModal(false);
      }}
    />
    </div>
  );
}