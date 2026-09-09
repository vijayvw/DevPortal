import AdminLayout from "../components/AdminLayout";
import ProfileCard from "../components/settings/ProfileCard";
import PasswordCard from "../components/settings/PasswordCard";
import PortfolioCard from "../components/settings/PortfolioCard";
import SystemInfoCard from "../components/settings/SystemInfoCard";

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="mt-2 text-zinc-400">
            Manage your account and portfolio settings.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ProfileCard />
          <PasswordCard />
        </div>

        <PortfolioCard />
        <SystemInfoCard />
      </div>
    </AdminLayout>
  );
}
