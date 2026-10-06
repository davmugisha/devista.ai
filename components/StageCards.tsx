import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { ModeGlyph } from './ModeGlyph';
import { Chip, delay } from './Section';
import { STAGES } from '@/lib/content';
import { SITE } from '@/lib/site';

const box = 'relative mt-6 h-40 overflow-hidden rounded-control border border-rule bg-paper/50 p-4';

function Discover() {
  return (
    <div className={box + ' flex items-center gap-5'}>
      <div className="relative size-28 shrink-0 rounded-dot border border-rule">
        <span className="absolute inset-4 rounded-dot border border-rule" />
        <span className="absolute inset-9 rounded-dot border border-rule" />
        <span className="sweep absolute inset-0" />
        <span className="absolute left-8 top-10 size-1.5 rounded-dot bg-signal-bright animate-blink" />
        <span className="absolute bottom-8 right-7 size-1.5 rounded-dot bg-hold animate-blink" style={{ animationDelay: '1s' }} />
      </div>
      <div className="min-w-0">
        <p className="text-shimmer text-xs font-medium">Learning how the company runs</p>
        <ul className="mt-3 space-y-1.5 text-xs text-ink">
          {['Departments', 'Workflows', 'Tools in use'].map((t, i) => (
            <li key={t} className="check-seq flex items-center gap-2" style={delay(i * 700)}>
              <Check className="size-3 text-signal-bright" strokeWidth={2.6} />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Diagnose() {
  return (
    <div className={box}>
      <div className="flex items-center justify-between rounded-chip border border-rule bg-panel px-3 py-1.5 text-xs">
        <span className="text-ink">Order received</span>
        <span className="text-slate">CRM</span>
      </div>
      <p className="my-1 ml-4 border-l-2 border-dashed border-hold py-1.5 pl-3 text-xs text-hold">
        <span className="animate-blink">Re-keyed by hand</span>
      </p>
      <div className="flex items-center justify-between rounded-chip border border-rule bg-panel px-3 py-1.5 text-xs">
        <span className="text-ink">Order created</span>
        <span className="text-slate">ERP</span>
      </div>
    </div>
  );
}

function Architect() {
  const rows = [
    { step: 'Capture invoices', mode: 'agent' as const, label: 'Agent' },
    { step: 'Code to cost centers', mode: 'assisted' as const, label: 'AI-assisted' },
    { step: 'Approve above the limit', mode: 'person' as const, label: 'Person' },
  ];
  return (
    <div className={box + ' space-y-2'}>
      {rows.map((r, i) => (
        <div key={r.step} className="check-seq flex items-center gap-3 rounded-chip bg-panel px-3 py-2 text-xs" style={delay(i * 600)}>
          <ModeGlyph mode={r.mode} className={'size-3 ' + (r.mode === 'person' ? 'text-hold' : 'text-signal-bright')} />
          <span className="flex-1 text-ink">{r.step}</span>
          <span className="text-slate">{r.label}</span>
        </div>
      ))}
    </div>
  );
}

function Build() {
  return (
    <div className={box + ' flex items-center justify-between px-6'}>
      <div className="flex flex-col items-center gap-2">
        <span className="orb size-12" />
        <span className="text-xs font-medium text-ink">{SITE.shortName}</span>
      </div>
      <svg viewBox="0 0 120 20" aria-hidden="true" className="mx-3 h-5 flex-1">
        <path d="M0 10 H120" className="stroke-signal-bright/70 flow" strokeWidth="1.5" fill="none" />
        <circle r="3" className="fill-glow-cyan motion-reduce:hidden">
          <animateMotion dur="2.4s" repeatCount="indefinite" path="M0 10 H120" />
        </circle>
      </svg>
      <div className="flex flex-col items-center gap-2">
        <span className="grid size-12 grid-cols-2 gap-1 rounded-control border border-rule bg-panel p-2">
          <span className="rounded-chip bg-rule-strong/60" />
          <span className="rounded-chip bg-rule-strong/60" />
          <span className="rounded-chip bg-rule-strong/60" />
          <span className="rounded-chip bg-signal-bright/70" />
        </span>
        <span className="text-xs font-medium text-ink">Your systems</span>
      </div>
    </div>
  );
}

function Deploy() {
  return (
    <ul className={box + ' space-y-2'}>
      {['Permissions set', 'Approvals tested', 'Switchover plan signed off', 'Department live'].map((t, i) => (
        <li key={t} className="check-seq flex items-center gap-3 text-xs text-ink" style={delay(i * 800)}>
          <span className="flex size-5 items-center justify-center rounded-dot bg-signal-tint">
            <Check className="size-3 text-signal-bright" strokeWidth={2.6} />
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

function Operate() {
  const rows = [
    { name: 'Finance', state: 'Live', tone: 'text-signal-bright', dot: 'bg-signal-bright' },
    { name: 'Operations', state: 'Next', tone: 'text-ink', dot: 'bg-graphite' },
    { name: 'Sales', state: 'Later', tone: 'text-slate', dot: 'bg-rule-strong' },
  ];
  return (
    <ul className={box + ' space-y-2'}>
      {rows.map((r, i) => (
        <li key={r.name} className="flex items-center gap-3 rounded-chip border border-rule bg-panel px-3 py-2 text-xs">
          <span className="relative flex size-2">
            {i === 0 ? <span className={'absolute inline-flex size-full rounded-dot animate-ping ' + r.dot} /> : null}
            <span className={'relative inline-flex size-2 rounded-dot ' + r.dot} />
          </span>
          <span className="flex-1 text-ink">{r.name}</span>
          <span className={r.tone}>{r.state}</span>
        </li>
      ))}
    </ul>
  );
}

const VISUALS: ReactNode[] = [<Discover key="d" />, <Diagnose key="g" />, <Architect key="a" />, <Build key="b" />, <Deploy key="p" />, <Operate key="o" />];

/** The six stages of an engagement as cards, each with a small working illustration. */
export function StageCards({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {STAGES.map((s, i) => (
        <li key={s.name} data-reveal style={delay((i % 3) * 90)} className="card flex flex-col p-6">
          <Chip className="self-start text-xs">Step {i + 1}</Chip>
          <h3 className="mt-4 text-xl font-display tracking-snug text-ink">{s.name}</h3>
          <p className="mt-2 text-sm text-graphite">{s.detail}</p>
          {detailed ? (
            <p className="mt-3 text-sm text-ink">
              <span className="font-semibold text-signal-bright">Your part: </span>
              {s.you}
            </p>
          ) : null}
          <div aria-hidden="true" className="mt-auto">
            {VISUALS[i]}
          </div>
        </li>
      ))}
    </ol>
  );
}
