import Link from 'next/link';

/** The Devista mark: the existing emerald square with a D, kept as the one use of the brand green. */
export function Mark({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="7" className="fill-brand-mark" />
      <path d="M10 8.5h6.2c5 0 8.3 3 8.3 7.5s-3.3 7.5-8.3 7.5H10V8.5Zm4 3.4v8.2h2c2.6 0 4.3-1.6 4.3-4.1s-1.7-4.1-4.3-4.1h-2Z" className="fill-brand-mark-ink" />
    </svg>
  );
}

export function Logo({ wordmarkFrom = 'always' }: { wordmarkFrom?: 'always' | 'xs' }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2 rounded-chip" aria-label="Devista AI, home">
      <Mark />
      <span
        className={
          'text-lg font-semibold tracking-snug text-ink wdth-display ' + (wordmarkFrom === 'xs' ? 'hidden xs:inline' : '')
        }
      >
        Devista
      </span>
    </Link>
  );
}
