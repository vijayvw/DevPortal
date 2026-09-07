import ContactStatusBadge from "./ContactStatusBadge";
import type { AdminContact } from "../../../api/services/adminContacts.service";

interface Props {
  contacts: AdminContact[];
  loading: boolean;
  onSelect: (id: string) => void;
}

export default function ContactTable({
  contacts,
  loading,
  onSelect,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-800 p-8">
        Loading...
      </div>
    );
  }

  if (!contacts.length) {
    return (
      <div className="rounded-xl border border-zinc-800 p-8 text-center text-zinc-500">
        No contact messages found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full">
        <thead className="bg-zinc-900">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Subject</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              tabIndex={0}
              role="button"
              onClick={() => onSelect(contact.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelect(contact.id);
                }
              }}
              className="cursor-pointer border-t border-zinc-800 hover:bg-zinc-900"
            >
              <td className="p-4">{contact.name}</td>

              <td className="p-4">{contact.email}</td>

              <td className="p-4">{contact.subject}</td>

              <td className="p-4">
                <ContactStatusBadge status={contact.status} />
              </td>

              <td className="p-4">
                {new Date(contact.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
