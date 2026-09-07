import {
  FiBook,
  FiCode,
  FiFolder,
  FiMail,
} from "react-icons/fi";

import AdminLayout from "../components/AdminLayout";
import StatsCard from "../components/StatsCard";
import { useDashboard } from "../queries/useDashboard";

export default function Dashboard() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <AdminLayout>
        <p className="text-white">Loading...</p>
      </AdminLayout>
    );
  }

  if (error || !data) {
    return (
      <AdminLayout>
        <p className="text-red-500">
          Failed to load dashboard.
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="mb-8 text-4xl font-bold text-white">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Skills"
          value={data.counts.skills}
          icon={FiCode}
        />

        <StatsCard
          title="Projects"
          value={data.counts.projects}
          icon={FiFolder}
        />

        <StatsCard
          title="Blog Posts"
          value={data.counts.blogPosts}
          icon={FiBook}
        />

        <StatsCard
          title="Messages"
          value={data.counts.contactMessages}
          icon={FiMail}
        />
      </div>

      <div className="mt-10 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="mb-4 text-2xl font-bold text-white">
          Recent Activity
        </h2>

        <p className="text-neutral-400">
          Projects: {data.recent.projects.length}
        </p>

        <p className="text-neutral-400">
          Blog Posts: {data.recent.blogPosts.length}
        </p>

        <p className="text-neutral-400">
          Case Studies: {data.recent.caseStudies.length}
        </p>

        <p className="text-neutral-400">
          Contact Messages: {data.recent.contactMessages.length}
        </p>
      </div>
    </AdminLayout>
  );
}
