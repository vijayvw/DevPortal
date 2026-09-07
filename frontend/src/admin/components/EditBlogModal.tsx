import { useEffect, useRef, useState } from "react";
import { useAdminBlogPost } from "../queries/useAdminBlogPost";
import { useUpdateBlogPost } from "../queries/useUpdateBlogPost";
import MediaPickerModal from "./MediaPickerModal";
import RichTextEditor, {
  RichTextEditorRef,
} from "@/components/editor/RichTextEditor";

interface Props {
  postId: string | null;
  onClose: () => void;
}

export default function EditBlogModal({
  postId,
  onClose,
}: Props) {
  const { data, isLoading } = useAdminBlogPost(postId);
  const updateMutation = useUpdateBlogPost();

  const editorRef = useRef<RichTextEditorRef>(null);

  const [pickerOpen, setPickerOpen] = useState(false);

  const [pickerMode, setPickerMode] = useState<
    "hero" | "editor"
  >("hero");

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
    heroImageId: null as string | null,
  });

  useEffect(() => {
    if (!data) return;

    setForm({
      title: data.title,
      slug: data.slug,
      category: data.category,
      difficulty: data.difficulty,
      excerpt: data.excerpt ?? "",
      contentMarkdown: data.contentMarkdown ?? "",
      featured: data.featured,
      tags: data.tags.join(", "),

      heroImage: data.heroImageUrl ?? "",
      heroImageId: data.heroImageId ?? null,
    });
  }, [data]);

  if (!postId) return null;
  if (!data && isLoading) {
  return null;
}

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

    await updateMutation.mutateAsync({
      id: postId,
      data: {
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

        heroImageId: form.heroImageId,
      },
    });

    onClose();
  }
    return (
    <>
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
            Edit Blog Post
          </h2>

          {isLoading ? (
            <p className="text-white">Loading...</p>
          ) : (
            <div className="space-y-4">

              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  updateField("title", e.target.value)
                }
                className="w-full rounded bg-neutral-800 p-3 text-white"
              />

              <input
                placeholder="Slug"
                value={form.slug}
                onChange={(e) =>
                  updateField("slug", e.target.value)
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
                <label className="font-medium text-white">
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
                    {form.heroImageId ? "Change" : "Choose"}
                  </button>

                  {form.heroImageId && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          heroImage: "",
                          heroImageId: null,
                        }))
                      }
                      className="rounded bg-red-600 px-4 text-white hover:bg-red-700"
                    >
                      Remove
                    </button>
                  )}
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
          )}

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
              disabled={
                updateMutation.isPending || isLoading
              }
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              {updateMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
                  </form>
      </div>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url, id) => {
          if (pickerMode === "hero") {
            setForm((prev) => ({
              ...prev,
              heroImage: url,
              heroImageId: id,
            }));

            setPickerOpen(false);
            return;
          }

          editorRef.current?.insertImage(url);
          setPickerOpen(false);
        }}
      />
    </>
  );
}