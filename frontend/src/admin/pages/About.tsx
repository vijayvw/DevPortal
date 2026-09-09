import AdminLayout from "../components/AdminLayout";
import AboutCard from "../components/settings/AboutCard";

export default function About() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">About</h1>
          <p className="mt-2 text-zinc-400">
            Manage the content displayed on your public About page.
          </p>
        </div>

        <AboutCard />
      </div>
    </AdminLayout>
  );
}
