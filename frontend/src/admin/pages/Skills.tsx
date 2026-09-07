import AdminLayout from "../components/AdminLayout";
import { useSkills } from "../queries/useSkills";
import { useState } from "react";
import CreateSkillModal from "../components/CreateSkillModal";
import EditSkillModal from "../components/EditSkillModal";
import { useDeleteSkill } from "../queries/useDeleteSkill";

export default function Skills() {
  const { data, isLoading, error } = useSkills();

  const [open, setOpen] = useState(false);

  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const deleteMutation = useDeleteSkill();

  if (isLoading) {
    return (
      <AdminLayout>
        <p className="text-white">Loading...</p>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <p className="text-red-500">
          Failed to load skills.
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

  	<button
    	 onClick={() => setOpen(true)}
         className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
  	 >
    	 + Add Skill
  	</button>
       </div>   

<table className="w-full text-left text-white">
  <thead>
    <tr className="border-b border-neutral-700">
      <th className="p-3">Name</th>
      <th className="p-3">Category</th>
      <th className="p-3">Level</th>
      <th className="p-3">Actions</th>
    </tr>
  </thead>

  <tbody>
    {data?.map((skill) => (
      <tr
        key={skill.id}
        className="border-b border-neutral-800"
      >
        <td className="p-3">{skill.name}</td>

        <td className="p-3">{skill.category}</td>

        <td className="p-3">{skill.proficiency}</td>

        <td className="p-3 space-x-2">
         <button
           onClick={() => setSelectedSkill(skill.id)}
           className="rounded bg-yellow-600 px-3 py-1 text-sm hover:bg-yellow-700"
         >
           Edit
         </button>

         <button
           onClick={() => {
             if (window.confirm(`Delete "${skill.name}"?`)) {
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
    <CreateSkillModal
      open={open}
      onClose={() => setOpen(false)}
    />

    <EditSkillModal
      skillId={selectedSkill}
      onClose={() => setSelectedSkill(null)}
    />
  </AdminLayout>
);
}
