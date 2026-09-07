import AdminLayout from "../components/AdminLayout";
import { useBlogPosts } from "../queries/useBlogPosts";
import { useState } from "react";
import CreateBlogModal from "../components/CreateBlogModal";
import { useUpdateBlogStatus } from "../queries/useUpdateBlogStatus";
import { useDeleteBlogPost } from "../queries/useDeleteBlogPost";
import EditBlogModal from "../components/EditBlogModal";

export default function Blog() {
  const { data, isLoading, error } = useBlogPosts();
  const [open, setOpen] = useState(false);
  const statusMutation = useUpdateBlogStatus();
  const deleteMutation = useDeleteBlogPost();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

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
          Failed to load blog posts.
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">
          Blog
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Add Post
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
          {data?.map((post) => (
            <tr key={post.id} className="border-b border-neutral-800">
                <td className="p-3">{post.title}</td>
                <td className="p-3">{post.category}</td>
                <td className="p-3">{post.difficulty}</td>

                <td className="p-3">
                  <span
                    className={`rounded px-2 py-1 text-xs font-bold ${
                      post.publishStatus === "PUBLISHED"
                        ? "bg-green-600"
                        : post.publishStatus === "DRAFT"
                        ? "bg-yellow-600"
                        : "bg-blue-600"
                    }`}
                  >
                    {post.publishStatus}
                  </span>
                </td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() =>
                      statusMutation.mutate({
                        id: post.id,
                        status:
                          post.publishStatus === "PUBLISHED"
                            ? "DRAFT"
                            : "PUBLISHED",
                      })
                    }
                    className={`rounded px-3 py-1 text-sm text-white ${
                      post.publishStatus === "PUBLISHED"
                        ? "bg-gray-600 hover:bg-gray-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {post.publishStatus === "PUBLISHED"
                      ? "Unpublish"
                      : "Publish"}
                  </button>

                  <button
                    onClick={() => setSelectedPost(post.id)}
                    className="rounded bg-yellow-600 px-3 py-1 text-sm hover:bg-yellow-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete "${post.title}"?`
                        )
                      ) {
                        deleteMutation.mutate(post.id);
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
      <CreateBlogModal
        open={open}
        onClose={() => setOpen(false)}
      />
      <EditBlogModal
        postId={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </AdminLayout>
  );
}
