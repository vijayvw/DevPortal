import { useAuditLogs } from "../queries/useAuditLogs";

export default function AuditLogsPage() {
  const { data, isLoading, error } = useAuditLogs({
    page: 1,
    limit: 20,
  });

  if (isLoading) {
    return <div className="p-6">Loading audit logs...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load audit logs.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="mt-2 text-zinc-400">
          View all admin activity across the application.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Entity</th>
              <th className="px-4 py-3 text-left">Actor</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {data?.items.map((log) => (
              <tr
                key={log.id}
                className="border-t border-zinc-800"
              >
                <td className="px-4 py-3">{log.action}</td>
                <td className="px-4 py-3">{log.entityType}</td>
                <td className="px-4 py-3">
                  {log.actorId ?? "-"}
                </td>
                <td className="px-4 py-3">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
