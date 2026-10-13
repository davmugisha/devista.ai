import { BellRing, FileText, Repeat, Search, Sheet, type LucideIcon } from 'lucide-react';
import { delay, Section } from '../Section';
import { PAINS } from '@/lib/content';

const ICONS: Record<(typeof PAINS)[number]['id'], LucideIcon> = {
  leads: Search,
  reports: Sheet,
  proposals: FileText,
  chasing: BellRing,
};

/** Who this is for: the repeat work an agency recognises, and how often it comes back. */
export function Pains() {
  return (
    <Section
      id="familiar"
      chip="Who this is for"
      title="Any of this sound familiar?"
      lede="Your agency runs on good tools. The copying, chasing and rebuilding between them still lands on your people."
    >
      <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PAINS.map((p, i) => {
          const Icon = ICONS[p.id];
          return (
            <li key={p.id} data-reveal style={delay(i * 80)} className="card flex flex-col p-6">
              <span className="flex size-10 items-center justify-center rounded-control border border-rule bg-panel">
                <Icon aria-hidden="true" className="size-5 text-signal-bright" strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 text-lg font-display tracking-snug text-ink">{p.title}</h3>
              <p className="mt-2 text-sm text-graphite">{p.detail}</p>
              <p className="mt-auto flex items-center gap-2 border-t border-rule pt-4 text-sm font-medium text-ink">
                <Repeat aria-hidden="true" className="size-4 text-signal-bright" strokeWidth={2} />
                {p.when}
              </p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
