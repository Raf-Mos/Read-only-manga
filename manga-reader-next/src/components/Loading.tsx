import { cn } from './utils';

export default function Loading({ className = '' }: { className?: string }) {
  // Pure CSS spinner to avoid any SSR/CSR mismatch
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <span
        className="inline-block h-8 w-8 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin"
        aria-label="Loading"
        role="status"
      />
    </div>
  );
}
