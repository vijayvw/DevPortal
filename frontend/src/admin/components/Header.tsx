import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const auth = useAuth();

  return (
    <header className="h-16 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between px-8">
      <h1 className="text-xl font-bold text-white">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-neutral-400">
          {auth.user?.name}
        </span>

        <button
          onClick={auth.logout}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
