import { useEffect, useState } from "react";

import { useAdminSkill } from "../queries/useAdminSkill";
import { useUpdateSkill } from "../queries/useUpdateSkill";

interface Props {
  skillId: string | null;
  onClose: () => void;
}

export default function EditSkillModal({
  skillId,
  onClose,
}: Props) {
  const { data, isLoading } = useAdminSkill(skillId);
  const updateMutation = useUpdateSkill();

  const [form, setForm] = useState({
    name: "",
    category: "",
    proficiency: 0,
    priority: 0,
    yearsExperience: 0,
    iconUrl: "",
    visible: true,
  });

  useEffect(() => {
    if (!data) return;

    setForm({
      name: data.name,
      category: data.category,
      proficiency: data.proficiency,
      priority: data.priority,
      yearsExperience: data.yearsExperience ?? 0,
      iconUrl: data.iconUrl ?? "",
      visible: true,
    });
  }, [data]);

  if (!skillId) return null;

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
      id: skillId,
      data: {
        ...form,
        iconUrl: form.iconUrl || null,
        yearsExperience: form.yearsExperience || null,
      },
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-xl bg-neutral-900 p-8"
      >
        <h2 className="mb-6 text-2xl font-bold text-white">
          Edit Skill
        </h2>

        {isLoading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <div className="space-y-4">

            <input
              value={form.name}
              onChange={(e) =>
                updateField("name", e.target.value)
              }
              className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
            />

            <input
              value={form.category}
              onChange={(e) =>
                updateField("category", e.target.value)
              }
              className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
            />

            <input
              type="number"
              value={form.proficiency}
              onChange={(e) =>
                updateField(
                  "proficiency",
                  Number(e.target.value)
                )
              }
              className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
            />

            <input
              type="number"
              value={form.priority}
              onChange={(e) =>
                updateField(
                  "priority",
                  Number(e.target.value)
                )
              }
              className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
            />

            <input
              type="number"
              value={form.yearsExperience}
              onChange={(e) =>
                updateField(
                  "yearsExperience",
                  Number(e.target.value)
                )
              }
              className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
            />

            <input
              value={form.iconUrl}
              onChange={(e) =>
                updateField("iconUrl", e.target.value)
              }
              className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white"
              placeholder="Icon URL"
            />

            <label className="flex items-center gap-3 text-white">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(e) =>
                  updateField("visible", e.target.checked)
                }
              />
              Visible
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
            {updateMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
