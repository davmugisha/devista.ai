'use client';

// A decision in the web Inbox detail (WebInbox.dc.html): who asks, what it traces to, a preview
// of what will happen, the cost, then approve, ask why or reject. Decided, it shows the result
// with Undo and a way on to the next decision. Everything goes through the shared store.

import { Button, Chip, ToggleButton, ToggleButtonGroup, cn } from '@heroui/react';
import { Fragment, useEffect, useRef } from 'react';
import { Icon } from '@/components/icons';
import { InitialsTile, Mono } from '@/components/ui';
import { approvalResult, type Approval, type Decision } from '@/lib/data';
import { usePrototype } from '@/lib/store';
import type { InboxKey } from './inbox-items';

const STATE: Record<'pending' | Decision, { label: string; className: string }> = {
  pending: { label: 'Needs you', className: 'bg-warning-soft text-warning-soft-foreground' },
  approved: { label: 'Approved', className: 'bg-selected text-accent' },
  rejected: { label: 'Rejected', className: 'bg-inset text-ink-2' },
};

export function ApprovalDetail({
  approval: a,
  headingId,
  onSelect,
}: {
  approval: Approval;
  headingId: string;
  /** Open another item and move focus to it (Next decision, Ask Chief of Staff why). */
  onSelect: (key: InboxKey) => void;
}) {
  const { decisionOf, choiceOf, choose, approve, reject, undo, pending } = usePrototype();
  const decision = decisionOf(a.key);
  const choice = choiceOf(a.key);
  const next = pending.find((p) => p.key !== a.key);
  const state = STATE[decision ?? 'pending'];

  // Keyboard focus follows the decision: deciding lands on Undo, undoing lands on Approve.
  const focusAfter = useRef<'result' | 'approve' | null>(null);
  const undoRef = useRef<HTMLButtonElement>(null);
  const approveRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const target = focusAfter.current;
    focusAfter.current = null;
    if (target === 'result') undoRef.current?.focus();
    if (target === 'approve') approveRef.current?.focus();
  }, [decision]);

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2.5 text-[14px] font-semibold text-ink-3">
          <InitialsTile initials={a.who} className="size-[30px] rounded-[10px]" />
          <span>
            {a.asker} asks · <Mono>{a.time}</Mono>
          </span>
          <Chip className={cn('h-[26px] rounded-full px-2.5 py-0 text-xs font-bold', state.className)}>{state.label}</Chip>
        </div>
        <h2 id={headingId} tabIndex={-1} className="text-[28px] leading-[1.2] font-bold outline-none">
          {a.title}
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-[14px] font-bold text-ink-3">Traces to</h3>
        <ol className="m-0 flex list-none flex-col p-0">
          {a.traces.map((t, i) => (
            <li key={t.title} className="flex gap-3">
              <span aria-hidden className="flex w-3 shrink-0 flex-col items-center">
                <span className="mt-[5px] size-2.5 shrink-0 rounded-full bg-accent" />
                {i < a.traces.length - 1 && <span className="w-0.5 grow bg-border" />}
              </span>
              <span className="flex flex-col gap-0.5 pb-3">
                <span className="text-[15px] font-bold">{t.title}</span>
                <span className="text-[13px] font-semibold text-muted">{t.sub}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-3 rounded-[18px] bg-background/75 p-5">
        <h3 className="text-[14px] font-bold text-ink-3">{a.previewTitle}</h3>
        <dl className="m-0 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1.5 text-[14px] font-semibold">
          {a.fields.map((f) => (
            <Fragment key={f.label}>
              <dt className="text-muted">{f.label}</dt>
              <dd className="m-0 min-w-0">{f.value}</dd>
            </Fragment>
          ))}
        </dl>
        <p className="max-w-[68ch] text-[15px] leading-[1.55] font-medium text-ink-2">{a.body}</p>
        {a.choices && (
          <ToggleButtonGroup
            aria-label="Launch date"
            selectionMode="single"
            disallowEmptySelection
            isDetached
            isDisabled={Boolean(decision)}
            selectedKeys={[String(choice)]}
            onSelectionChange={(keys) => {
              const index = Number([...keys][0]);
              if (Number.isInteger(index)) choose(a.key, index);
            }}
            className="flex w-full flex-wrap justify-start gap-2"
          >
            {a.choices.map((label, i) => (
              <ToggleButton
                key={label}
                id={String(i)}
                className={cn(
                  'h-11 rounded-full px-4 text-[14px]',
                  '[--toggle-button-bg-hover:var(--color-row-hover)] [--toggle-button-bg-pressed:var(--default)] [--toggle-button-bg:var(--surface)] [--toggle-button-fg:var(--foreground)]',
                  '[--toggle-button-bg-selected-hover:var(--accent-hover)] [--toggle-button-bg-selected-pressed:var(--accent-hover)] [--toggle-button-bg-selected:var(--accent)] [--toggle-button-fg-selected:var(--accent-foreground)]',
                  'shadow-[inset_0_0_0_1px_var(--border)] data-[selected=true]:shadow-[inset_0_0_0_1px_var(--accent)]',
                  // Once decided the dates lock; the one that was confirmed stays at full strength.
                  'disabled:data-[selected=true]:opacity-100',
                )}
              >
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      </div>

      <p className="flex flex-wrap gap-x-3.5 gap-y-1 text-[15px] font-semibold text-ink-3">
        {a.facts.map((x) => (
          <span key={x.label}>
            <span className={cn('font-bold', x.warn ? 'text-warning' : 'text-foreground')}>{x.value}</span> {x.label.toLowerCase()}
          </span>
        ))}
      </p>

      {decision ? (
        <div
          role="status"
          className={cn(
            'flex flex-wrap items-center justify-between gap-3 rounded-2xl px-[18px] py-4',
            decision === 'approved' ? 'bg-selected' : 'bg-background',
          )}
        >
          <span className={cn('text-[15px] font-bold', decision === 'approved' ? 'text-accent' : 'text-ink-2')}>
            {approvalResult(a, decision, choice)}
          </span>
          <span className="flex gap-2">
            <Button
              ref={undoRef}
              variant="tertiary"
              onPress={() => {
                focusAfter.current = 'approve';
                undo(a.key);
              }}
              className="h-10 rounded-full px-4 text-[14px] text-foreground [--button-bg-hover:var(--default)] [--button-bg-pressed:var(--default)] [--button-bg:var(--surface)]"
            >
              Undo
            </Button>
            {next && (
              <Button onPress={() => onSelect(next.key)} className="h-10 rounded-full px-4 text-[14px]">
                Next decision
              </Button>
            )}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <Button
            ref={approveRef}
            fullWidth
            onPress={() => {
              focusAfter.current = 'result';
              approve(a.key);
            }}
            className="h-[52px] rounded-full px-[22px] text-[16px]"
          >
            <Icon name="check" size={18} strokeWidth={2.5} className="size-[18px]" />
            {a.approveLabel}
          </Button>
          <div className="flex gap-2.5">
            <Button
              onPress={() => onSelect('cos')}
              className="h-12 min-w-0 flex-1 rounded-full px-4 text-[15px] [--button-bg-hover:var(--accent-soft-hover)] [--button-bg-pressed:var(--accent-soft-hover)] [--button-bg:var(--accent-soft)] [--button-fg:var(--color-accent-deep)]"
            >
              {/* One text run: the button lays its children out with a gap. */}
              <span>
                Ask<span className="max-md:hidden"> Chief of Staff</span> why
              </span>
            </Button>
            <Button
              variant="tertiary"
              onPress={() => {
                focusAfter.current = 'result';
                reject(a.key);
              }}
              className="h-12 min-w-0 flex-1 rounded-full px-4 text-[15px] text-foreground"
            >
              Reject
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
