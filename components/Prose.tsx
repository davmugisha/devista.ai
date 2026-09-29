import type { ReactNode } from 'react';

/** Long-form text (legal pages): readable measure, clear hierarchy, token spacing. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-page px-4 py-16 md:px-8 md:py-20">
      <div className="max-w-measure text-base text-graphite [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-display [&_h2]:tracking-display [&_h2]:text-ink [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>
    </div>
  );
}

export function DraftNotice({ updated }: { updated: string }) {
  return (
    <p className="rounded-control border border-hold bg-hold-tint px-4 py-3 text-sm text-hold">
      Draft, last updated {updated}. This notice is awaiting legal review and may change.
    </p>
  );
}
