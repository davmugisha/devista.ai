import { ChevronDown } from 'lucide-react';
import { delay } from './Section';

type Item = { q: string; a: string };

/**
 * Questions as separate rounded cards, after altari.ai's FAQ: a chevron that turns, and a tinted
 * card with an accent edge while open. Native disclosures, so keyboard and screen readers work
 * without client JavaScript.
 */
export function Faq({ items, className = '' }: { items: readonly Item[]; className?: string }) {
  return (
    <div className={'space-y-3 ' + className}>
      {items.map((item, i) => (
        <details
          key={item.q}
          open={i === 0}
          data-reveal
          style={delay(Math.min(i, 6) * 50)}
          className="group rounded-frame border-2 border-rule bg-mist px-5 transition-colors duration-200 hover:border-rule-strong/50 open:border-signal/30 open:bg-panel/50"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-base font-medium text-ink marker:hidden [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <ChevronDown aria-hidden="true" className="mt-1 size-4 shrink-0 text-slate transition-transform duration-200 group-open:rotate-180" strokeWidth={2} />
          </summary>
          <p className="max-w-measure pb-5 pr-6 text-sm text-graphite">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
