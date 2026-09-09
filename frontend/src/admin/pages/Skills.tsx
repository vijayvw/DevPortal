import { useState } from "react";

import AdminLayout from "../components/AdminLayout";

import { useSkills } from "../queries/useSkills";
import { useDeleteSkill } from "../queries/useDeleteSkill";
import { useAdminSkillCategories } from "../queries/useSkillCategories";
import { useDeleteSkillCategory } from "../queries/useDeleteSkillCategory";

import CreateSkillModal from "../components/CreateSkillModal";
import EditSkillModal from "../components/EditSkillModal";
import CreateSkillCategoryModal from "../components/CreateSkillCategoryModal";
import EditSkillCategoryModal from "../components/EditSkillCategoryModal";

import type { SkillCategoryDto } from "../../api/services/skillCategories.service";

export default function Skills() {
  const {
    data: skills,
    isLoading: skillsLoading,
    error: skillsError,
  } = useSkills();

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useAdminSkillCategories();

  const [skillModalOpen, setSkillModalOpen] = useState(false);

  const [selectedSkill, setSelectedSkill] =
    useState<string | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState<SkillCategoryDto | null>(null);

  const deleteMutation = useDeleteSkill();
  const deleteCategoryMutation = useDeleteSkillCategory();

  if (skillsLoading || categoriesLoading) {
    return (
      <AdminLayout>
        <p className="text-white">Loading...</p>
      </AdminLayout>
    );
  }

  if (skillsError || categoriesError) {
    return (
      <AdminLayout>
        <p className="text-red-500">
          Failed to load skills or categories.
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">
          Skills
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
          >
            + Add Category
          </button>

          <button
            onClick={() => setSkillModalOpen(true)}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Add Skill
          </button>
        </div>
      </div>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-white">
          Skill Categories
        </h2>

        <div className="overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full text-left text-white">
            <thead>
              <tr className="border-b border-neutral-700 bg-neutral-900">
                <th className="p-3">Name</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Visible</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories?.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-neutral-800"
                >
                  <td className="p-3 font-semibold">
                    {category.name}
                  </td>

                  <td className="p-3 text-neutral-400">
                    {category.slug}
                  </td>

                  <td className="p-3">
                    {category.priority}
                  </td>

                  <td className="p-3">
                    {category.visible ? (
                      <span className="text-green-400">
                        Yes
                      </span>
                    ) : (
                      <span className="text-neutral-500">
                        No
                      </span>
                    )}
                  </td>

                  <td className="p-3 space-x-2">
                    <button
                      onClick={() =>
                        setSelectedCategory(category)
                      }
                      className="rounded bg-yellow-600 px-3 py-1 text-sm hover:bg-yellow-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        if (
                          !window.confirm(
                            `Delete category "${category.name}"?`
                          )
                        ) {
                          return;
                        }

                        deleteCategoryMutation.mutate(
                          category.id,
                          {
                            onError: (error) => {
                              window.alert(
                                error instanceof Error
                                  ? error.message
                                  : "Failed to delete category."
                              );
                            },
                          }
                        );
                      }}
                      disabled={deleteCategoryMutation.isPending}
                      className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-white">
          Skills
        </h2>

        <div className="overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full text-left text-white">
            <thead>
              <tr className="border-b border-neutral-700 bg-neutral-900">
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Level</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {skills?.map((skill) => (
                <tr
                  key={skill.id}
                  className="border-b border-neutral-800"
                >
                  <td className="p-3">
                    {skill.name}
                  </td>

                  <td className="p-3">
                    {categories?.find(
                      (category) =>
                        category.id === skill.categoryId
                    )?.name ?? skill.category}
                  </td>

                  <td className="p-3">
                    {skill.proficiency}
                  </td>

                  <td className="p-3 space-x-2">
                    <button
                      onClick={() =>
                        setSelectedSkill(skill.id)
                      }
                      className="rounded bg-yellow-600 px-3 py-1 text-sm hover:bg-yellow-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete "${skill.name}"?`
                          )
                        ) {
                          deleteMutation.mutate(skill.id);
                        }
                      }}
                      className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CreateSkillCategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />

      <EditSkillCategoryModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />

      <CreateSkillModal
        open={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
      />

      <EditSkillModal
        skillId={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />
    </AdminLayout>
  );
}
