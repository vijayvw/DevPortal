import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Shown when a React Query call fails (network error, 4xx/5xx from the
 * backend). `onRetry` is optional — pass `refetch` from the query hook
 * when the caller wants a retry button; omit it for a message-only state.
 */
export function ErrorState({ message = 'Something went wrong. Please try again.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <AlertTriangle className="w-10 h-10 text-accent-500 mb-4" />
      <p className="font-mono text-neutral-300 mb-1">Error</p>
      <p className="text-neutral-400 text-sm max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-bg-elevated border border-neutral-700 rounded-md text-primary-500 font-mono text-sm hover:border-primary-500/50 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
