type Item = { q: string; a: string };

/** Native disclosures: keyboard and screen-reader support with no client JavaScript. */
export function Faq({ items }: { items: readonly Item[] }) {
  return (
    <div className="mt-10 max-w-narrow border-t border-rule">
      {items.map((item) => (
        <details key={item.q} className="group border-b border-rule">
          <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-6 py-5 text-md font-medium text-ink marker:hidden hover:text-signal [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 fill-none stroke-current transition-transform duration-200 ease-out group-open:rotate-45 motion-reduce:transition-none"
              strokeWidth="1.6"
            >
              <path d="M8 2.5v11M2.5 8h11" />
            </svg>
          </summary>
          <p className="max-w-measure pb-6 text-base text-graphite">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
