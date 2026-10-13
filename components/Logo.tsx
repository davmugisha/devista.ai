import Link from 'next/link';
import { BRAND } from '@/lib/brand';
import { SITE } from '@/lib/site';

/** The Saydeed mark (see lib/brand.ts), drawn as a crisp one-colour vector. */
export function Mark({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={'shrink-0 fill-current text-signal-bright ' + className}>
      {BRAND.mark.map((path) => <path key={path} d={path} />)}
    </svg>
  );
}

export function Logo({ wordmarkFrom = 'always' }: { wordmarkFrom?: 'always' | 'xs' }) {
  return (
    <Link href="/" prefetch={false} className="inline-flex items-center gap-2 rounded-chip" aria-label={`${SITE.name}, home`}>
      <Mark />
      <span className={'text-lg font-semibold tracking-snug text-ink ' + (wordmarkFrom === 'xs' ? 'hidden xs:inline' : '')}>
        {SITE.shortName}
      </span>
    </Link>
  );
}
