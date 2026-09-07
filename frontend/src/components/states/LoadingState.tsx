import { motion } from 'framer-motion';

interface LoadingStateProps {
  /** Shown next to the terminal prompt, e.g. "Fetching projects..." */
  label?: string;
}

/**
 * Terminal-themed loading indicator. Matches the existing `$ command`
 * prompt style used throughout the site (see TerminalHeader) rather than
 * introducing a generic spinner that would look out of place.
 */
export function LoadingState({ label = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="font-mono text-neutral-400 flex items-center gap-2">
        <span className="text-primary-500">$</span>
        <span>{label}</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-primary-500"
        >
          _
        </motion.span>
      </div>
    </div>
  );
}
