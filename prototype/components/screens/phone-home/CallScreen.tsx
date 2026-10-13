'use client';

// The interactive call with Chief of Staff (Call.dc.html): the speaking orb, one visual on screen
// at a time (invoices, runway, proposal) with its live caption, and the call controls. Approving
// the reminders here decides them in the shared store, so every count drops with it.

import { Button, ToggleButton, ToggleButtonGroup, cn } from '@heroui/react';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { RoundLink } from '@/components/phone/RoundButton';
import { PhoneScreen } from '@/components/phone/PhoneFrame';
import { ButtonLink, Mono, StateDot } from '@/components/ui';
import { INVOICES, NUMBERS, OVERDUE_TOTAL, approvalResult, getApproval } from '@/lib/data';
import { phone } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { CALL_VISUALS, CAPTIONS, DEFAULT_VISUAL, PROPOSAL_CLIENT, RUNWAY_MONTHS } from './callContent';
import { ClientOrb, useFitSize } from './ClientOrb';
import { FOCUS_RING, Glyph } from './PhoneChrome';
import { CALL_ELAPSED_AT_OPEN, callStartedAt, endCall, formatCallTime, usePins, type CallVisual } from './session';

// Round call controls: inset grey, filled with the accent while on (muted, speaker on).
const ROUND_CONTROL = cn(
  'size-[62px] min-w-[62px] rounded-full p-0',
  '[--toggle-button-bg:var(--color-inset)] [--toggle-button-bg-hover:var(--color-track)] [--toggle-button-bg-pressed:var(--color-track)] [--toggle-button-fg:var(--foreground)]',
  '[--toggle-button-bg-selected:var(--accent)] [--toggle-button-bg-selected-hover:var(--accent-hover)] [--toggle-button-bg-selected-pressed:var(--accent-hover)] [--toggle-button-fg-selected:var(--accent-foreground)]',
);

// Captions: white while off, soft cyan while on.
const CAPTIONS_TOGGLE = cn(
  'size-12 min-w-12 rounded-full p-0',
  '[--toggle-button-bg:var(--surface)] [--toggle-button-bg-hover:var(--color-selected)] [--toggle-button-bg-pressed:var(--color-selected)] [--toggle-button-fg:var(--color-ink-3)]',
  '[--toggle-button-bg-selected:var(--accent-soft)] [--toggle-button-bg-selected-hover:var(--accent-soft-hover)] [--toggle-button-bg-selected-pressed:var(--accent-soft-hover)] [--toggle-button-fg-selected:var(--accent)]',
);

// Pin: the card's own grey, soft cyan once pinned.
const PIN_TOGGLE = cn(
  'size-11 min-w-11 shrink-0 rounded-full p-0',
  '[--toggle-button-bg:var(--color-inset)] [--toggle-button-bg-hover:var(--color-track)] [--toggle-button-bg-pressed:var(--color-track)] [--toggle-button-fg:var(--foreground)]',
  '[--toggle-button-bg-selected:var(--accent-soft)] [--toggle-button-bg-selected-hover:var(--accent-soft-hover)] [--toggle-button-bg-selected-pressed:var(--accent-soft-hover)] [--toggle-button-fg-selected:var(--accent)]',
);

// Visual switcher pills: white, the one on screen filled with the accent.
const VISUAL_PILL = cn(
  'h-11 rounded-full px-4 text-[14px]',
  '[--toggle-button-bg:var(--surface)] [--toggle-button-bg-hover:var(--color-selected)] [--toggle-button-bg-pressed:var(--color-selected)] [--toggle-button-fg:var(--color-ink-2)]',
  '[--toggle-button-bg-selected:var(--accent)] [--toggle-button-bg-selected-hover:var(--accent-hover)] [--toggle-button-bg-selected-pressed:var(--accent-hover)] [--toggle-button-fg-selected:var(--accent-foreground)]',
);

export function CallScreen() {
  const [visual, setVisual] = useState<CallVisual>(DEFAULT_VISUAL);
  const [captions, setCaptions] = useState(true);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const elapsed = useCallClock();
  const [orbRef, orbSize] = useFitSize<HTMLDivElement>(180, 96);
  const visualLabel = CALL_VISUALS.find((v) => v.key === visual)?.label ?? '';

  return (
    <PhoneScreen className="overflow-x-hidden overflow-y-auto leading-[normal]">
      <div className="mt-[52px] flex h-12 shrink-0 items-center justify-between px-4">
        <RoundLink href={phone.home} label="Minimize call" tone="surface" size={48}>
          <Glyph name="chevronDown" size={22} />
        </RoundLink>
        <div className="flex flex-col items-center gap-0.5">
          <h1 className="m-0 text-[16px] font-bold text-foreground">Chief of Staff</h1>
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-muted">
            <StateDot pulse className="size-[7px]" />
            <Mono>
              <span className="sr-only">Call time </span>
              {formatCallTime(elapsed)}
            </Mono>
          </div>
        </div>
        <ToggleButton isIconOnly aria-label="Live captions" isSelected={captions} onChange={setCaptions} className={CAPTIONS_TOGGLE}>
          <Glyph name="captions" size={22} />
        </ToggleButton>
      </div>

      <div className="flex max-h-[204px] min-h-[110px] grow basis-0 flex-col pt-2.5 pb-1">
        <div ref={orbRef} className="flex min-h-0 grow justify-center">
          <ClientOrb size={orbSize} highlights={0} speaking />
        </div>
      </div>

      <section aria-label={`On screen: ${visualLabel}`} className="relative mx-5 h-[278px] shrink-0">
        <div aria-hidden className="absolute inset-x-8 -top-4 h-[60px] rounded-3xl bg-surface" />
        <div aria-hidden className="absolute inset-x-4 -top-2 h-[60px] rounded-3xl bg-inset" />
        <div className="absolute inset-0 flex flex-col gap-3 overflow-hidden rounded-[26px] bg-inset p-[18px]">
          {visual === 'run' && <RunwayVisual />}
          {visual === 'inv' && <InvoicesVisual />}
          {visual === 'pro' && <ProposalVisual />}
        </div>
      </section>

      <div aria-live="polite" className="mx-7 mt-2.5 flex h-16 shrink-0 items-center justify-center">
        {captions && (
          <p className="m-0 text-center text-[16px] leading-[1.45] font-semibold text-balance text-foreground">{CAPTIONS[visual]}</p>
        )}
      </div>

      <ToggleButtonGroup
        aria-label="Visuals"
        selectionMode="single"
        disallowEmptySelection
        isDetached
        selectedKeys={[visual]}
        onSelectionChange={(keys) => {
          const next = [...keys][0];
          if (next === 'inv' || next === 'run' || next === 'pro') setVisual(next);
        }}
        className="mt-2.5 shrink-0 gap-2 self-center"
      >
        {CALL_VISUALS.map((v) => (
          <ToggleButton key={v.key} id={v.key} className={VISUAL_PILL}>
            {v.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Stays on screen on short phones while the visual scrolls under it. */}
      <div className="sticky bottom-0 z-10 mt-auto flex shrink-0 items-start justify-between bg-linear-to-b from-background/0 to-background to-[18px] px-7 pt-4 pb-[26px]">
        <Control label={muted ? 'Unmute' : 'Mute'}>
          <ToggleButton isIconOnly aria-label="Mute microphone" isSelected={muted} onChange={setMuted} className={ROUND_CONTROL}>
            <Glyph name={muted ? 'micOff' : 'mic'} size={24} />
          </ToggleButton>
        </Control>
        <Control label="Speaker">
          <ToggleButton isIconOnly aria-label="Speaker" isSelected={speaker} onChange={setSpeaker} className={ROUND_CONTROL}>
            <Glyph name="speaker" size={24} />
          </ToggleButton>
        </Control>
        <Link href={phone.chat} className={cn('group flex flex-col items-center gap-1.5 rounded-[31px] text-[12px] font-bold text-ink-3 hover:text-ink-3', FOCUS_RING)}>
          <span className="flex size-[62px] items-center justify-center rounded-full bg-inset text-foreground transition-colors group-hover:bg-track">
            <Glyph name="chat" size={24} />
          </span>
          Chat
        </Link>
        <Link
          href={phone.home}
          onClick={endCall}
          className={cn('group flex flex-col items-center gap-1.5 rounded-[31px] text-[12px] font-bold text-ink-3 hover:text-ink-3', FOCUS_RING)}
        >
          <span className="flex size-[62px] items-center justify-center rounded-full bg-danger text-danger-foreground transition-opacity group-hover:opacity-90">
            <Glyph name="hangUp" size={26} />
          </span>
          End
        </Link>
      </div>
    </PhoneScreen>
  );
}

/** The call clock: 03:12 when the screen opens, still running if the call was only minimised. */
function useCallClock(): number {
  const [elapsed, setElapsed] = useState(CALL_ELAPSED_AT_OPEN);
  useEffect(() => {
    const started = callStartedAt(Date.now());
    const tick = () => setElapsed(Math.floor((Date.now() - started) / 1000));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return elapsed;
}

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {children}
      {/* The button carries the name; this is the visible word under it. */}
      <span aria-hidden className="text-[12px] font-bold text-ink-3">
        {label}
      </span>
    </div>
  );
}

/** The top of each visual: a small caps label, the headline figure and the pin. */
function VisualHead({ eyebrow, pin, children }: { eyebrow: string; pin: CallVisual; children: ReactNode }) {
  const { isPinned, toggle } = usePins();
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="m-0 text-[12px] font-bold tracking-[0.06em] text-muted uppercase">{eyebrow}</h2>
        {children}
      </div>
      <ToggleButton isIconOnly aria-label="Pin to dashboard" isSelected={isPinned(pin)} onChange={() => toggle(pin)} className={PIN_TOGGLE}>
        <Glyph name="pin" size={20} />
      </ToggleButton>
    </div>
  );
}

function RunwayVisual() {
  return (
    <>
      <VisualHead eyebrow="Cash runway" pin="run">
        <span className="flex items-baseline gap-2">
          <Mono className="text-[26px] font-semibold text-ink-3">{NUMBERS.runway.months}</Mono>
          <span aria-hidden className="text-[18px] text-muted">
            →
          </span>
          <span className="sr-only">to</span>
          <Mono className="text-[26px] font-semibold text-accent">{NUMBERS.runway.after}</Mono>
          <span className="text-[14px] font-semibold text-ink-3">months</span>
        </span>
      </VisualHead>
      <svg viewBox="0 0 314 116" className="h-auto w-full shrink-0" role="img" aria-label="Cash runway, today versus both invoices paid">
        <path d="M12 110H302" className="fill-none stroke-border" strokeWidth={1} />
        <polyline
          points="12,26.5 70,46.4 128,66.3 186,86.1 244,106 255.6,110"
          className="fill-none stroke-muted"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="12,10 70,29.6 128,49.2 186,68.8 244,88.4 302,108"
          className="fill-none stroke-accent"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="255.6" cy="110" r="4" className="fill-muted" />
        <circle cx="302" cy="108" r="4" className="fill-accent" />
      </svg>
      <div className="flex justify-between px-0.5 text-[11px] font-bold text-muted">
        {RUNWAY_MONTHS.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <div className="flex gap-4 text-[12px] font-bold text-ink-3">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="h-[3px] w-3.5 rounded-xs bg-muted" />
          Today
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="h-[3px] w-3.5 rounded-xs bg-accent" />
          Both invoices paid
        </span>
      </div>
    </>
  );
}

function InvoicesVisual() {
  const { decisionOf, choiceOf, approve } = usePrototype();
  const reminder = getApproval('remind');
  const decision = decisionOf('remind');
  return (
    <>
      <VisualHead eyebrow="Overdue invoices" pin="inv">
        <Mono className="text-[26px] font-semibold text-warning">{OVERDUE_TOTAL}</Mono>
      </VisualHead>
      <ul className="m-0 flex list-none flex-col p-0">
        {INVOICES.map((inv) => (
          <li key={inv.number} className="flex items-center justify-between gap-3 border-t border-border py-[9px]">
            <span className="text-[15px] font-semibold text-foreground">
              {inv.client} <span className="text-muted">· {inv.late.replace(/ late$/, '')}</span>
            </span>
            <Mono className="text-[14px] text-foreground">{inv.amount}</Mono>
          </li>
        ))}
      </ul>
      <div aria-live="polite" className="flex min-h-11 items-center justify-between gap-2.5">
        {decision && reminder ? (
          <>
            <p className="m-0 flex items-center gap-2 text-[13px] font-semibold text-ink-2">
              {decision === 'approved' && (
                <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Glyph name="check" size={14} />
                </span>
              )}
              {approvalResult(reminder, decision, choiceOf('remind'))}
            </p>
            {decision === 'rejected' && (
              <ButtonLink href={phone.approval('remind')} className="h-11 shrink-0 rounded-full px-[18px] text-[15px]">
                Review
              </ButtonLink>
            )}
          </>
        ) : (
          <>
            <span className="text-[13px] font-semibold text-ink-3">Say “send them” or tap</span>
            <Button onPress={() => approve('remind')} className="h-11 shrink-0 rounded-full px-[18px] text-[15px]">
              Approve
            </Button>
          </>
        )}
      </div>
    </>
  );
}

function ProposalVisual() {
  const { decisionOf, choiceOf } = usePrototype();
  const proposal = getApproval('umoja');
  const decision = decisionOf('umoja');
  const facts = [
    { label: 'Scope', value: 'Client portal' },
    { label: 'Timeline', value: '6 weeks' },
    { label: 'Fee', value: '$4,800', mono: true },
  ];
  return (
    <>
      <VisualHead eyebrow="Proposal · v2" pin="pro">
        <span className="truncate text-[22px] font-bold text-foreground">{PROPOSAL_CLIENT}</span>
      </VisualHead>
      <dl className="m-0 grid grid-cols-[1.4fr_1fr_1fr] gap-2">
        {facts.map((f) => (
          <div key={f.label} className="flex min-w-0 flex-col gap-0.5 rounded-2xl bg-surface px-3 py-2.5">
            <dt className="text-[11px] font-bold text-muted">{f.label}</dt>
            <dd className={cn('m-0 truncate text-[14px] text-foreground', f.mono ? 'font-mono font-semibold tabular-nums' : 'font-bold')}>{f.value}</dd>
          </div>
        ))}
      </dl>
      <p className="m-0 text-[14px] leading-[1.45] font-semibold text-ink-3">
        {decision && proposal
          ? approvalResult(proposal, decision, choiceOf('umoja'))
          : 'Written by Proposal writer from the discovery call notes. Pricing checked by CFO agent.'}
      </p>
      <div className="flex gap-2">
        <ButtonLink href={phone.approval('umoja')} className="h-11 rounded-full px-[18px] text-[15px]">
          Review
        </ButtonLink>
        <ButtonLink href={phone.chat} variant="tertiary" className="h-11 rounded-full px-[18px] text-[15px]">
          Open in chat
        </ButtonLink>
      </div>
    </>
  );
}
