
import { useContacts } from "../queries/useContacts";
import ContactTable from "../components/contact/ContactTable";
import ContactDrawer from "../components/contact/ContactDrawer";
import { useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";

export default function ContactsPage() {
  const { data = [], isLoading } = useContacts();

  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
  "ALL" | "UNREAD" | "READ" | "REPLIED" | "ARCHIVED"
>("ALL");

  const [sortBy, setSortBy] = useState<
  "NEWEST" | "OLDEST" | "NAME_ASC" | "NAME_DESC"
>("NEWEST");

  const filteredContacts = useMemo(() => {
    const query = search.toLowerCase();

    const filtered = data.filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.subject.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || contact.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "NEWEST":
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );

        case "OLDEST":
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          );

        case "NAME_ASC":
          return a.name.localeCompare(b.name);

        case "NAME_DESC":
          return b.name.localeCompare(a.name);

        default:
          return 0;
      }
    });

    return filtered;
  }, [data, search, statusFilter, sortBy]);


  const stats = useMemo(() => {
    return {
      total: data.length,
      unread: data.filter((c) => c.status === "UNREAD").length,
      read: data.filter((c) => c.status === "READ").length,
      replied: data.filter((c) => c.status === "REPLIED").length,
      archived: data.filter((c) => c.status === "ARCHIVED").length,
    };
  }, [data]);

  const exportCSV = () => {
    const headers = ["Name", "Email", "Subject", "Status", "Date"];

    const rows = filteredContacts.map((contact) => [
      contact.name,
      contact.email,
      contact.subject,
      contact.status,
      new Date(contact.createdAt).toLocaleDateString(),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout> 
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>

            <p className="mt-2 text-zinc-400">
              Manage messages submitted through your portfolio.
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Export CSV
          </button>
        </div>
      

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <p className="text-sm text-zinc-400">Total</p>
        <h2 className="mt-2 text-3xl font-bold">{stats.total}</h2>
      </div>

      <div className="rounded-xl border border-blue-800 bg-zinc-900 p-5">
        <p className="text-sm text-blue-400">Unread</p>
        <h2 className="mt-2 text-3xl font-bold text-blue-400">
          {stats.unread}
        </h2>
      </div>

      <div className="rounded-xl border border-green-800 bg-zinc-900 p-5">
        <p className="text-sm text-green-400">Read</p>
        <h2 className="mt-2 text-3xl font-bold text-green-400">
          {stats.read}
        </h2>
      </div>

      <div className="rounded-xl border border-purple-800 bg-zinc-900 p-5">
        <p className="text-sm text-purple-400">Replied</p>
        <h2 className="mt-2 text-3xl font-bold text-purple-400">
          {stats.replied}
        </h2>
      </div>

      <div className="rounded-xl border border-yellow-700 bg-zinc-900 p-5">
        <p className="text-sm text-yellow-400">Archived</p>
        <h2 className="mt-2 text-3xl font-bold text-yellow-400">
          {stats.archived}
        </h2>
      </div>

    </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Search by name, email or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
        />

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value as
                | "NEWEST"
                | "OLDEST"
                | "NAME_ASC"
                | "NAME_DESC"
            )
          }
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="NEWEST">Newest First</option>
          <option value="OLDEST">Oldest First</option>
          <option value="NAME_ASC">Name (A-Z)</option>
          <option value="NAME_DESC">Name (Z-A)</option>
        </select>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["ALL", "UNREAD", "READ", "REPLIED", "ARCHIVED"].map((status) => (
          <button
            key={status}
            onClick={() =>
              setStatusFilter(
                status as "ALL" | "UNREAD" | "READ" | "REPLIED" | "ARCHIVED"
              )
            }
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              statusFilter === status
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <ContactTable
        contacts={filteredContacts}
        loading={isLoading}
        onSelect={setSelectedContact}
      />

      <ContactDrawer
        contactId={selectedContact}
        onClose={() => setSelectedContact(null)}
      />  


    </div>
  </AdminLayout>
  );
}
