import { ArrowDownRight } from 'lucide-react';
import { delay } from './Section';
import { STEPS } from '@/lib/content';

/** The four steps from the first call to a trained team, each ending in what the buyer has. */
export function StageCards({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {STEPS.map((s, i) => (
        <li key={s.name} data-reveal style={delay((i % 4) * 90)} className="card flex flex-col p-6">
          <span className="tabular flex size-9 items-center justify-center rounded-dot border border-rule bg-panel text-sm font-semibold text-signal-bright">
            {i + 1}
          </span>
          <h3 className="mt-5 text-xl font-display tracking-snug text-ink">{s.name}</h3>
          <p className="mt-2 text-sm text-graphite">{s.detail}</p>
          {detailed ? (
            <p className="mt-3 text-sm text-ink">
              <span className="font-semibold text-signal-bright">Your part: </span>
              {s.you}
            </p>
          ) : null}
          <div className="mt-auto pt-5">
            <div className="flex items-start gap-3 rounded-control border border-rule bg-panel px-4 py-3">
              <ArrowDownRight aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-signal-bright" strokeWidth={2} />
              <p className="text-sm">
                <span className="block text-xs font-semibold uppercase tracking-wide text-slate">You get</span>
                <span className="font-medium text-ink">{s.output}</span>
              </p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
