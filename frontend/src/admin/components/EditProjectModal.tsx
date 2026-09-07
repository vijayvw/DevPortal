import { useAdminProject } from "../queries/useAdminProject";
import { useUpdateProject } from "../queries/useUpdateProject";
import { useTechnologies } from "../queries/useTechnologies";
import ImageUploader from "./media/ImageUploader";
import { useEffect, useRef, useState } from "react";
import MediaPickerModal from "./MediaPickerModal";


interface Props {
  projectId: string | null;
  onClose: () => void;
}

export default function EditProjectModal({
  projectId,
  onClose,
}: Props) {
  const { data, isLoading } = useAdminProject(projectId);
  const updateMutation = useUpdateProject();
  const { data: technologies = [] } = useTechnologies();

  const [pickerOpen, setPickerOpen] = useState(false);

  const [form, setForm] = useState({
  title: "",
  slug: "",
  shortDescription: "",
  category: "",
  difficulty: "BEGINNER" as
    | "BEGINNER"
    | "INTERMEDIATE"
    | "ADVANCED",
  status: "",
  featured: false,
  pinned: false,
  technologyIds: [] as string[],
  longDescription: "",
  githubUrl: "",
  liveUrl: "",
  videoUrl: "",
  coverImageId: "",
});

  useEffect(() => {
    if (!data) return;

    setForm({
  title: data.title,
  slug: data.slug,
  shortDescription: data.shortDescription ?? "",
  longDescription: data.longDescription ?? "",

  category: data.category,
  difficulty: data.difficulty,
  status: data.status,

  githubUrl: data.githubUrl ?? "",
  liveUrl: data.liveUrl ?? "",
  videoUrl: data.videoUrl ?? "",

  coverImageId: data.coverImageId ?? "",

  featured: data.featured,
  pinned: data.pinned,

  technologyIds:
    data.technologies
      ?.map((name) =>
        technologies.find((t) => t.name === name)?.id
      )
      .filter(Boolean) as string[],
});
  }, [data, technologies]);

  if (!projectId) return null;

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    await updateMutation.mutateAsync({
      id: projectId,
      data: {
        ...form,
        githubUrl: form.githubUrl || undefined,
        liveUrl: form.liveUrl || undefined,
        videoUrl: form.videoUrl || undefined,
        longDescription: form.longDescription || undefined,
        coverImageId: form.coverImageId || undefined,
      },
    });

    onClose();
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
          Edit Project
        </h2>

        {isLoading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <div className="space-y-4">
            <input
              value={form.title}
              onChange={(e) =>
                updateField("title", e.target.value)
              }
              className="w-full rounded bg-neutral-800 p-3 text-white"
            />

            <input
              value={form.slug}
              onChange={(e) =>
                updateField("slug", e.target.value)
              }
              className="w-full rounded bg-neutral-800 p-3 text-white"
            />

            <textarea
              value={form.shortDescription}
              onChange={(e) =>
                updateField(
                  "shortDescription",
                  e.target.value
                )
              }
              className="w-full rounded bg-neutral-800 p-3 text-white"
            />

            <div>
              <label className="mb-2 block font-medium text-white">
                Project Description
              </label>

              <textarea
  value={form.longDescription}
  onChange={(e) =>
    updateField("longDescription", e.target.value)
  }
  placeholder="Paste your GitHub README.md here..."
  className="w-full h-[600px] rounded-lg border border-neutral-700 bg-neutral-900 p-4 font-mono text-sm text-white"
/>
            </div>

            <input
              value={form.category}
              onChange={(e) =>
                updateField("category", e.target.value)
              }
              className="w-full rounded bg-neutral-800 p-3 text-white"
            />

            <input
              placeholder="GitHub URL"
              value={form.githubUrl}
              onChange={(e) =>
                updateField("githubUrl", e.target.value)
              }
              className="w-full rounded bg-neutral-800 p-3 text-white"
            />

            <input
              placeholder="Live Demo URL"
              value={form.liveUrl}
              onChange={(e) =>
                updateField("liveUrl", e.target.value)
              }
              className="w-full rounded bg-neutral-800 p-3 text-white"
            />

            <input
              placeholder="Video URL"
              value={form.videoUrl}
              onChange={(e) =>
                updateField("videoUrl", e.target.value)
              }
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
            <div>

              <ImageUploader
                value={form.coverImageId}
                onChange={(id) =>
                  updateField("coverImageId", id)
                }
              />

              <label className="mb-2 block text-white font-medium">
                Technologies
              </label>

              <div className="grid grid-cols-2 gap-2">
                {technologies.map((tech) => (
                  <label
                    key={tech.id}
                    className="flex items-center gap-2 rounded bg-neutral-800 p-2 text-white"
                  >
                    <input
                      type="checkbox"
                      checked={form.technologyIds.includes(tech.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateField("technologyIds", [
                            ...form.technologyIds,
                            tech.id,
                          ]);
                        } else {
                          updateField(
                            "technologyIds",
                            form.technologyIds.filter(
                              (id) => id !== tech.id
                            )
                          );
                        }
                      }}
                    />

                    {tech.name}
                  </label>
                ))}
              </div>
            </div>

            <label className="flex gap-2 text-white">
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

            <label className="flex gap-2 text-white">
              <input
                type="checkbox"
                checked={form.pinned}
                onChange={(e) =>
                  updateField(
                    "pinned",
                    e.target.checked
                  )
                }
              />
              Pinned
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
            disabled={updateMutation.isPending}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            {updateMutation.isPending
              ? "Saving..."
              : "Save"}
          </button>
        </div>
      </form>
      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(_, id) => {
          updateField("coverImageId", id);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}