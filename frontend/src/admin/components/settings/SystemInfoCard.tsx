import { Server } from "lucide-react";

export default function SystemInfoCard() {
  const info = [
    ["Backend", "Online"],
    ["Database", "PostgreSQL"],
    ["Redis", "Connected"],
    ["Environment", "Development"],
    ["API Version", "v1"],
  ];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-purple-600/20 p-2">
          <Server className="h-5 w-5 text-purple-400" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">System Information</h2>
          <p className="text-sm text-zinc-400">
            Current backend and application status.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {info.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3"
          >
            <span className="text-zinc-400">{label}</span>

            <span className="font-medium text-white">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
