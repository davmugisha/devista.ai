import { STAGES } from '@/lib/content';

/** The engagement sequence. Numbered because it is a real order of work. */
export function Stages({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className="mt-12 grid grid-cols-1 gap-x-8 border-t border-rule sm:grid-cols-2 lg:grid-cols-3">
      {STAGES.map((s, i) => (
        <li key={s.name} className="border-b border-rule py-6 lg:[&:nth-last-child(-n+3)]:border-b-0">
          <div className="flex items-baseline gap-3">
            <span className="tabular text-sm font-semibold text-signal">{i + 1}</span>
            <h3 className="text-lg font-display tracking-display text-ink">{s.name}</h3>
          </div>
          <p className="mt-2 max-w-measure text-sm text-graphite">{s.detail}</p>
          {detailed ? (
            <p className="mt-3 text-sm text-ink">
              <span className="font-medium">Your part: </span>
              {s.you}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
