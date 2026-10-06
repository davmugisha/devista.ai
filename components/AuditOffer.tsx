import { AUDIT } from '@/lib/content';

/**
 * The audit's concrete terms: what it costs, how long, who attends, what happens, what you keep.
 * `except` leaves out deliverables already shown on the page (as `AuditDeliverables` previews).
 */
export function AuditOffer({ headingLevel = 3, except = [] }: { headingLevel?: 3 | 2; except?: readonly string[] }) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  const keep = AUDIT.deliverables.filter((d) => !except.includes(d.title));
  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <dl className="divide-y divide-rule border-y border-rule">
          {AUDIT.facts.map((f) => (
            <div key={f.term} className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-sm font-semibold text-ink">{f.term}</dt>
              <dd className="col-span-2 text-sm text-graphite">{f.detail}</dd>
            </div>
          ))}
        </dl>
        <H className="mt-10 text-lg font-display tracking-display text-ink">Who should attend</H>
        <ul className="mt-3 space-y-2">
          {AUDIT.attendees.map((a) => (
            <li key={a} className="flex gap-3 text-sm text-graphite">
              <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-dot bg-signal-bright" />
              {a}
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <H className="text-lg font-display tracking-display text-ink">How it runs</H>
        <ol className="mt-3 space-y-3">
          {AUDIT.steps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[auto_1fr] gap-x-3">
              <span className="tabular text-sm font-semibold text-signal-bright">{i + 1}</span>
              <p className="text-sm text-graphite">
                <span className="font-medium text-ink">{s.title}. </span>
                {s.detail}
              </p>
            </li>
          ))}
        </ol>
        <H className="mt-10 text-lg font-display tracking-display text-ink">
          {except.length ? 'What else you keep' : 'What you keep'}
        </H>
        <ul className="mt-3 divide-y divide-rule border-y border-rule">
          {keep.map((d) => (
            <li key={d.title} className="py-3">
              <p className="text-sm font-medium text-ink">{d.title}</p>
              <p className="text-sm text-graphite">{d.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
