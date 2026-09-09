import { useEffect, useState } from "react";

import { useUpdateSkillCategory } from "../queries/useUpdateSkillCategory";
import SkillCategoryIconPicker from "./SkillCategoryIconPicker";

import type { SkillCategoryDto } from "../../api/services/skillCategories.service";

interface Props {
  category: SkillCategoryDto | null;
  onClose: () => void;
}

export default function EditSkillCategoryModal({
  category,
  onClose,
}: Props) {
  const mutation = useUpdateSkillCategory();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    icon: "",
    description: "",
    priority: 0,
    visible: true,
  });

  useEffect(() => {
    if (!category) return;

    setForm({
      name: category.name,
      slug: category.slug,
      icon: category.icon ?? "",
      description: category.description ?? "",
      priority: category.priority,
      visible: category.visible,
    });
  }, [category]);

  if (!category) return null;

  function update<K extends keyof typeof form>(
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

    await mutation.mutateAsync({
      id: category.id,
      data: {
        name: form.name,
        slug: form.slug,
        icon: form.icon || null,
        description: form.description || null,
        priority: form.priority,
        visible: form.visible,
      },
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-xl bg-neutral-900 p-8"
      >
        <h2 className="mb-6 text-2xl font-bold text-white">
          Edit Skill Category
        </h2>

        <div className="space-y-4">
          <input
            value={form.name}
            onChange={(e) =>
              update("name", e.target.value)
            }
            placeholder="Category name"
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
            required
          />

          <input
            value={form.slug}
            onChange={(e) =>
              update(
                "slug",
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-")
              )
            }
            placeholder="Slug"
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            required
          />

          <SkillCategoryIconPicker
            value={form.icon}
            onChange={(value) =>
              update("icon", value)
            }
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              update(
                "description",
                e.target.value
              )
            }
            rows={3}
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
          />

          <input
            type="number"
            min={0}
            value={form.priority}
            onChange={(e) =>
              update(
                "priority",
                Number(e.target.value)
              )
            }
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
          />

          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) =>
                update(
                  "visible",
                  e.target.checked
                )
              }
            />
            Visible on portfolio
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
            disabled={mutation.isPending}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {mutation.isPending
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
