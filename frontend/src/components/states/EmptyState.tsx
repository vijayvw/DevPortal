import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

/** Shown when a query succeeds but returns zero items. */
export function EmptyState({ message = 'Nothing to show here yet.' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <Inbox className="w-10 h-10 text-neutral-600 mb-4" />
      <p className="text-neutral-400 text-sm">{message}</p>
    </div>
  );
}
