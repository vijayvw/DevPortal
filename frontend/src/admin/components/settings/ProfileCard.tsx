import { FormEvent, useEffect, useState } from "react";
import { CheckCircle, Loader2, User } from "lucide-react";

import { updateProfile } from "../../../api/services/auth.service";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileCard() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }

    try {
      setSaving(true);

      const updatedUser = await updateProfile({
        name: trimmedName,
        email: trimmedEmail,
      });

      updateUser(updatedUser);

      setName(updatedUser.name);
      setEmail(updatedUser.email);

      setMessage("Profile updated successfully.");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            disabled={saving}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white focus:border-blue-500 focus:outline-none disabled:opacity-60"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Login Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
            disabled={saving}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white focus:border-blue-500 focus:outline-none disabled:opacity-60"
          />

          <p className="mt-2 text-xs text-zinc-500">
            This email is used to log in to the admin panel.
          </p>
        </div>

        {message && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-800/50 bg-emerald-900/20 px-4 py-3 text-sm text-emerald-400">
            <CheckCircle className="h-4 w-4" />
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
