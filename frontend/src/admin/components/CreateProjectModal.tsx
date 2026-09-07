import { useState } from "react";
import { useCreateProject } from "../queries/useCreateProject";
import { useTechnologies } from "../queries/useTechnologies";
import ImageUploader from "./media/ImageUploader";
import MediaPickerModal from "./MediaPickerModal";


interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({
  open,
  onClose,
}: Props) {
  const createMutation = useCreateProject();
  const { data: technologies = [] } = useTechnologies();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode] = useState<"cover">("cover");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    category: "",
    difficulty: "BEGINNER" as
      | "BEGINNER"
      | "INTERMEDIATE"
      | "ADVANCED",
    status: "Completed",
    featured: false,
    pinned: false,
    coverImageId: "",
    technologyIds: [] as string[],
    longDescription: "",
    githubUrl: "",
    liveUrl: "",
    videoUrl: "",
    
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


    await createMutation.mutateAsync(form);

    onClose();

    setForm({
      title: "",
      slug: "",
      shortDescription: "",
      longDescription: "",
      category: "",
      difficulty: "BEGINNER",
      status: "Completed",
      githubUrl: "",
      liveUrl: "",
      videoUrl: "",
      featured: false,
      pinned: false,
      coverImageId: "",
      technologyIds: [],
      
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
          Add Project
        </h2>

        <div className="space-y-4">

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              updateField("title", e.target.value)
            }
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
          />

          <input
            placeholder="Slug"
            value={form.slug}
            onChange={(e) =>
              updateField("slug", e.target.value)
            }
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
          />

          <textarea
            placeholder="Short Description"
            value={form.shortDescription}
            onChange={(e) => {
              updateField("shortDescription", e.target.value);
            }}
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
          />

          <div>
            <label className="mb-2 block font-medium text-white">
              Project Description
            </label>

            <textarea
  value={form.longDescription}
  onChange={(e) => updateField("longDescription", e.target.value)}
  placeholder="Paste your GitHub README.md here..."
  className="w-full h-[600px] rounded-lg border border-neutral-700 bg-neutral-900 p-4 text-white font-mono text-sm"
/>
          </div>

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              updateField("category", e.target.value)
            }
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
          />

          <input
            placeholder="GitHub URL"
            value={form.githubUrl}
            onChange={(e) =>
              updateField("githubUrl", e.target.value)
            }
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
          />

          <input
            placeholder="Live Demo URL"
            value={form.liveUrl}
            onChange={(e) =>
              updateField("liveUrl", e.target.value)
            }
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
          />

          <input
            placeholder="Video URL"
            value={form.videoUrl}
            onChange={(e) =>
              updateField("videoUrl", e.target.value)
            }
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
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
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
          >
            <option>BEGINNER</option>
            <option>INTERMEDIATE</option>
            <option>ADVANCED</option>
          </select>

          <ImageUploader
              value={form.coverImageId}
              onChange={(id) =>
                updateField("coverImageId", id)
              }
            />

          <div>
            <label className="mb-2 block text-white font-medium">
              Technologies
            </label>

            <div className="grid grid-cols-2 gap-2 rounded border border-neutral-700 bg-neutral-800 p-3">
              {technologies.map((tech) => (
                <label
                  key={tech.id}
                  className="flex items-center gap-2 text-white"
                >
                  <input
                    type="checkbox"
                    checked={form.technologyIds.includes(tech.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm((prev) => ({
                          ...prev,
                          technologyIds: [...prev.technologyIds, tech.id],
                        }));
                      } else {
                        setForm((prev) => ({
                          ...prev,
                          technologyIds: prev.technologyIds.filter(
                            (id) => id !== tech.id
                          ),
                        }));
                      }
                    }}
                  />

                  {tech.name}
                </label>
              ))}
            </div>
          </div>

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

          <label className="flex items-center gap-3 text-white">
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
              : "Create Project"}
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