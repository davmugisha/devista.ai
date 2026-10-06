import { delay } from './Section';

type Item = { q: string; a: string };

/** Native disclosures with keyboard and screen-reader support, without client JavaScript. */
export function Faq({ items, className = '' }: { items: readonly Item[]; className?: string }) {
  return (
    <div className={'divide-y divide-rule border-y border-rule ' + className}>
      {items.map((item, i) => (
        <details
          key={item.q}
          open={i === 0}
          data-reveal
          style={delay(i * 60)}
          className="group transition-colors duration-200 hover:bg-panel/60"
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-medium text-ink marker:hidden [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <span className="flex size-8 shrink-0 items-center justify-center text-signal transition-transform duration-300 ease-out group-open:rotate-45">
              <svg viewBox="0 0 16 16" aria-hidden="true" className="size-5 fill-none stroke-current" strokeWidth="1.4">
                <path d="M8 2.5v11M2.5 8h11" />
              </svg>
            </span>
          </summary>
          <p className="max-w-measure pb-6 pr-10 text-sm text-graphite">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
