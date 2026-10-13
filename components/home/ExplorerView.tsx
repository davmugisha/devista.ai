import type { KeyboardEvent, MutableRefObject } from 'react';
import { ModeGlyph } from '../ModeGlyph';
import { MODES, MODE_ORDER, WORKFLOWS, type Mode } from '@/lib/workflows';

type Props = {
  uid: string;
  active: number;
  focus: Mode | null;
  /** Replays the arrive motion; only after the visitor changes workflow. */
  animate?: boolean;
  onSelect?: (i: number) => void;
  onTabKey?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  onToggle?: (m: Mode) => void;
  tabRefs?: MutableRefObject<(HTMLButtonElement | null)[]>;
  /** True once the client component has taken over from the server markup. */
  interactive?: boolean;
};

/**
 * Markup for the workflow interactive. No hooks and no directive, so the server can render the
 * first state as plain HTML and the client component can render every later state.
 */
export function ExplorerView({ uid, active, focus, animate = false, onSelect, onTabKey, onToggle, tabRefs, interactive = false }: Props) {
  const wf = WORKFLOWS[active];
  const arrive = animate ? 'animate-arrive ' : '';
  const counts = MODE_ORDER.map((m) => ({
    mode: m,
    n: wf.steps.filter((s) => s.kind === 'step' && s.mode === m).length,
  }));
  let stepNo = 0;

  return (
    <div className="mt-14 overflow-hidden rounded-card border border-rule bg-mist shadow-float" data-interactive={interactive ? 'true' : undefined}>
      <div className="flex flex-col gap-4 border-b border-rule px-4 pt-4 md:flex-row md:items-end md:justify-between md:px-6 md:pt-5">
        <div role="tablist" aria-label="Example workflows" className="-mb-px flex gap-1 overflow-x-auto">
          {WORKFLOWS.map((w, i) => (
            <button
              key={w.id}
              ref={
                tabRefs
                  ? (el) => {
                      tabRefs.current[i] = el;
                    }
                  : undefined
              }
              role="tab"
              id={`${uid}-tab-${w.id}`}
              aria-selected={i === active}
              aria-controls={`${uid}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={onSelect ? () => onSelect(i) : undefined}
              onKeyDown={onTabKey}
              className={
                'h-11 shrink-0 whitespace-nowrap border-b-2 px-3 text-sm font-medium transition-colors duration-150 ' +
                (i === active ? 'border-signal-bright text-ink' : 'border-transparent text-graphite hover:text-ink')
              }
            >
              {w.tab ?? w.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1 pb-2 md:pb-1" role="group" aria-label="Highlight who does the work">
          {MODE_ORDER.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={focus === m}
              onClick={onToggle ? () => onToggle(m) : undefined}
              className={
                'inline-flex h-10 items-center gap-2 rounded-control px-2 text-sm transition-colors duration-150 ' +
                (focus === m ? 'bg-signal-tint text-ink' : 'text-graphite hover:bg-panel hover:text-ink')
              }
            >
              <ModeGlyph mode={m} />
              {MODES[m].short}
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${wf.id}`}
        tabIndex={0}
        className="grid gap-8 p-4 md:p-6 lg:grid-cols-12 lg:gap-12"
      >
        <div key={`${wf.id}-head`} className={arrive + 'self-start lg:sticky lg:top-24 lg:col-span-4'}>
          <p className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-chip border border-rule bg-panel px-2 py-px text-xs text-graphite">Example workflow</span>
            <span className="inline-flex rounded-chip bg-signal-tint px-2 py-px text-xs font-medium text-signal-bright">{wf.department}</span>
          </p>
          <h3 className="mt-3 text-xl font-display tracking-display">{wf.name}</h3>
          <p className="mt-2 max-w-measure text-sm text-graphite">{wf.summary}</p>
          <ul className="mt-6 space-y-3 border-t border-rule pt-4" aria-label="Who does the work in this workflow">
            {counts.map(({ mode, n }) => (
              <li key={mode} className="flex items-start gap-3">
                <ModeGlyph mode={mode} className="mt-1 size-3" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{MODES[mode].label}</p>
                  <p className="text-xs text-graphite">{MODES[mode].description}</p>
                </div>
                <p className="tabular shrink-0 text-sm font-semibold text-ink">
                  {n} {n === 1 ? 'step' : 'steps'}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <ol key={`${wf.id}-steps`} className="relative lg:col-span-8" aria-label={`${wf.name}, step by step`}>
          {wf.steps.map((s, i) => {
            if (s.kind === 'gate') {
              return (
                <li
                  key={i}
                  className={'relative my-3 flex items-start gap-3 rounded-control border border-signal/60 bg-signal-tint px-4 py-3 ' + arrive}
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true" className="mt-px size-4 shrink-0 fill-none stroke-signal-bright" strokeWidth="1.6">
                    <rect x="3" y="7" width="10" height="7" rx="1.5" />
                    <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-ink">Approval gate</p>
                    <p className="text-sm text-graphite">{s.detail}</p>
                  </div>
                </li>
              );
            }
            stepNo += 1;
            const dim = focus !== null && focus !== s.mode;
            return (
              <li
                key={i}
                className={
                  'relative grid grid-cols-[auto_1fr] gap-x-4 border-t border-rule py-4 transition-opacity duration-200 first:border-t-0 ' +
                  arrive +
                  (dim ? 'opacity-35' : 'opacity-100')
                }
              >
                <span className="tabular flex size-7 items-center justify-center rounded-control border border-rule text-xs font-semibold text-graphite">
                  {stepNo}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h4 className="text-base font-semibold text-ink">{s.title}</h4>
                    <span className="inline-flex items-center gap-2 text-xs text-graphite">
                      <ModeGlyph mode={s.mode} />
                      {MODES[s.mode].label}
                    </span>
                  </div>
                  <p className="mt-1 max-w-measure text-sm text-graphite">{s.detail}</p>
                  {s.escalation ? (
                    <p className="mt-2 flex items-start gap-2 text-sm text-hold">
                      <span className="mt-2 size-2 shrink-0 rounded-dot bg-hold" aria-hidden="true" />
                      <span>
                        <span className="font-semibold">Escalates to a person: </span>
                        {s.escalation}
                      </span>
                    </p>
                  ) : null}
                  {s.system ? <p className="mt-2 text-xs text-slate">In: {s.system}</p> : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
