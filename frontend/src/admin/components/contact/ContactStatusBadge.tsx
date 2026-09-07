interface Props {
  status: string;
}

const colors = {
  UNREAD: "bg-blue-500/20 text-blue-400",
  READ: "bg-green-500/20 text-green-400",
  REPLIED: "bg-purple-500/20 text-purple-400",
  ARCHIVED: "bg-zinc-700 text-zinc-300",
};

export default function ContactStatusBadge({ status }: Props) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        colors[status as keyof typeof colors]
      }`}
    >
      {status}
    </span>
  );
}
