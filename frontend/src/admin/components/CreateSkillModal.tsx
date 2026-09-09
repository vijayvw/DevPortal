import { useState } from "react";
import { useCreateSkill } from "../queries/useCreateSkill";
import { useAdminSkillCategories } from "../queries/useSkillCategories";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateSkillModal({
  open,
  onClose,
}: Props) {
  const mutation = useCreateSkill();
  const { data: categories, isLoading: categoriesLoading } =
    useAdminSkillCategories();

  const [form, setForm] = useState({
    name: "",
    category: "",
    categoryId: "",
    proficiency: 80,
    priority: 0,
    yearsExperience: 0,
    iconUrl: "",
    visible: true,
  });

  if (!open) return null;

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.categoryId) return;

    await mutation.mutateAsync({
      ...form,
      iconUrl: form.iconUrl || null,
      yearsExperience: form.yearsExperience || null,
    });

    onClose();

    setForm({
      name: "",
      category: "",
      categoryId: "",
      proficiency: 80,
      priority: 0,
      yearsExperience: 0,
      iconUrl: "",
      visible: true,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-xl bg-neutral-900 p-8"
      >
        <h2 className="mb-6 text-2xl font-bold text-white">
          Create Skill
        </h2>

        <div className="space-y-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
            required
          />

          <select
            value={form.categoryId}
            onChange={(e) => {
              const categoryId = e.target.value;
              const category = categories?.find(
                (item) => item.id === categoryId
              );

              update("categoryId", categoryId);
              update("category", category?.slug ?? "");
            }}
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
            required
            disabled={categoriesLoading}
          >
            <option value="">
              {categoriesLoading
                ? "Loading categories..."
                : "Select Category"}
            </option>

            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Proficiency"
            min={0}
            max={100}
            value={form.proficiency}
            onChange={(e) =>
              update("proficiency", Number(e.target.value))
            }
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
          />

          <input
            type="number"
            placeholder="Priority"
            min={0}
            value={form.priority}
            onChange={(e) =>
              update("priority", Number(e.target.value))
            }
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
          />

          <input
            type="number"
            placeholder="Years Experience"
            min={0}
            max={50}
            value={form.yearsExperience}
            onChange={(e) =>
              update("yearsExperience", Number(e.target.value))
            }
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
          />

          <input
            placeholder="Icon URL"
            value={form.iconUrl}
            onChange={(e) => update("iconUrl", e.target.value)}
            className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
          />

          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) =>
                update("visible", e.target.checked)
              }
            />
            Visible
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
            disabled={mutation.isPending || !form.categoryId}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
