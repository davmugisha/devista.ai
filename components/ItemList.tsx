type Item = { title: string; detail: string };

/**
 * A ruled two-column list of titled statements. Used for gaps, controls and product parts
 * instead of a grid of identical cards.
 */
export function ItemList({ items, columns = 2, as: H = 'h3' }: { items: readonly Item[]; columns?: 1 | 2; as?: 'h3' | 'h4' }) {
  return (
    <ul className={'mb-2 grid grid-cols-1 gap-x-12 ' + (columns === 2 ? 'md:grid-cols-2' : '')}>
      {items.map((it) => (
        <li key={it.title} className="border-t border-rule py-6">
          <H className="text-lg font-display tracking-display text-ink">{it.title}</H>
          <p className="mt-2 max-w-measure text-base text-graphite">{it.detail}</p>
        </li>
      ))}
    </ul>
  );
}
