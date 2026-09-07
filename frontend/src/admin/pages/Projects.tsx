import AdminLayout from "../components/AdminLayout";
import { useProjects } from "../queries/useProjects";
import { useState } from "react";
import CreateProjectModal from "../components/CreateProjectModal";
import { useUpdateProjectStatus } from "../queries/useUpdateProjectStatus";
import { useDeleteProject } from "../queries/useDeleteProject";
import EditProjectModal from "../components/EditProjectModal";

export default function Projects() {
  const { data, isLoading, error } = useProjects();
  const [open, setOpen] = useState(false);
  const statusMutation = useUpdateProjectStatus();
  const deleteMutation = useDeleteProject();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

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
          Failed to load projects.
        </p>
      </AdminLayout>
    );
  }

  return (
  <AdminLayout>
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-4xl font-bold text-white">
        Projects
      </h1>

      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
      >
        + Add Project
      </button>
    </div>

    <table className="w-full text-left text-white">
        <thead>
          <tr className="border-b border-neutral-700">
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Difficulty</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((project) => (
            <tr
              key={project.id}
              className="border-b border-neutral-800"
            >
              <td className="p-3">{project.title}</td>

              <td className="p-3">{project.category}</td>

              <td className="p-3">{project.difficulty}</td>

              <td className="p-3">
                <span
                  className={`rounded px-2 py-1 text-xs font-bold ${
                    project.publishStatus === "PUBLISHED"
                      ? "bg-green-600"
                      : project.publishStatus === "DRAFT"
                      ? "bg-yellow-600"
                      : "bg-blue-600"
                  }`}
                >
                  {project.publishStatus}
                </span>
              </td>

              <td className="p-3 space-x-2">
                <button
                  onClick={() =>
                    statusMutation.mutate({
                      id: project.id,
                      status:
                        project.publishStatus === "PUBLISHED"
                          ? "DRAFT"
                          : "PUBLISHED",
                    })
                  }
                  className={`rounded px-3 py-1 text-sm text-white ${
                    project.publishStatus === "PUBLISHED"
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {project.publishStatus === "PUBLISHED"
                    ? "Unpublish"
                    : "Publish"}
                </button>

                <button
                  onClick={() => setSelectedProject(project.id)}
                  className="rounded bg-yellow-600 px-3 py-1 text-sm hover:bg-yellow-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete "${project.title}"?`
                      )
                    ) {
                      deleteMutation.mutate(project.id);
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

      <CreateProjectModal
        open={open}
        onClose={() => setOpen(false)}
      />
      <EditProjectModal
        projectId={selectedProject}
        onClose={() => setSelectedProject(null)}
      />


    </AdminLayout>
  );
}
