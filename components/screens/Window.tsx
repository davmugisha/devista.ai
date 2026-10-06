import type { ReactNode } from 'react';
import { Mark } from '../Logo';

type Props = {
  title: string;
  meta?: string;
  /** One sentence describing what the illustration shows, for screen readers. */
  label: string;
  className?: string;
  children: ReactNode;
};

/**
 * Chrome for every product rendering: window dots, the mark, the screen's name and a context
 * tag. The inside is decorative for assistive technology; the label carries the meaning.
 */
export function Window({ title, meta, label, className = '', children }: Props) {
  return (
    <div role="img" aria-label={label} className={'overflow-hidden rounded-window border border-rule bg-mist text-left shadow-float ' + className}>
      <div aria-hidden="true">
        <WindowBar title={title} meta={meta} />
        {children}
      </div>
    </div>
  );
}

export function WindowBar({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-rule bg-panel/60 px-4 py-3">
      <span className="mr-2 hidden gap-1 sm:flex">
        <span className="size-2 rounded-dot bg-rule-strong/60" />
        <span className="size-2 rounded-dot bg-rule-strong/60" />
        <span className="size-2 rounded-dot bg-rule-strong/60" />
      </span>
      <Mark className="size-4" />
      <span className="text-sm font-semibold text-ink">{title}</span>
      {meta ? <span className="ml-auto truncate rounded-chip border border-rule px-2 py-px text-xs text-graphite">{meta}</span> : null}
    </div>
  );
}

/** A small status pill used inside renderings. Tone carries meaning, never decoration. */
export function Status({ tone, children }: { tone: 'run' | 'wait' | 'done' | 'stop'; children: ReactNode }) {
  const tones = {
    run: 'bg-panel text-graphite',
    wait: 'bg-hold-tint text-hold',
    done: 'bg-signal-tint text-signal-bright',
    stop: 'bg-alert-tint text-alert',
  } as const;
  return <span className={'inline-flex shrink-0 items-center rounded-chip px-2 py-px text-xs font-medium ' + tones[tone]}>{children}</span>;
}
