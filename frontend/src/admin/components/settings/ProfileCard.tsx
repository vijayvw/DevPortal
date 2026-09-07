import { User } from "lucide-react";

export default function ProfileCard() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-blue-600/20 p-2">
          <User className="h-5 w-5 text-blue-400" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Profile</h2>

          <p className="text-sm text-zinc-400">
            Manage your account information.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Name
          </label>

          <input
            type="text"
            placeholder="Your name"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Email
          </label>

          <input
            type="email"
            placeholder="admin@example.com"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        <button className="mt-6 w-fit rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700">
          Save Profile
        </button>
      </div>
    </div>
  );
}