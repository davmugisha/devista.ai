'use client';

// Phone Approval (Approval.dc.html): one decision, with what it traces to, the draft itself and
// what approving will do. The reminder pages through both emails, the proposal shows its summary
// and the launch date offers the dates the team can do. Edit changes the draft in place before
// approving (the edits stay on this screen). Approve, reject and undo go through the shared store,
// so Inbox, Home and every count change with them.

import { Button, Chip, Input, ScrollShadow, Separator, Surface, TextArea, ToggleButton, ToggleButtonGroup, cn } from '@heroui/react';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Icon } from '@/components/icons';
import { PhoneScreen } from '@/components/phone/PhoneFrame';
import { RoundButton, RoundLink } from '@/components/phone/RoundButton';
import { ButtonLink } from '@/components/ui';
import { APPROVALS, approvalResult, getApproval, type Approval, type ApprovalKey } from '@/lib/data';
import { phone } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { APPROVAL_SHORT, Figures } from './parts';

interface Draft {
  to?: string;
  subject?: string;
  body: string;
}

/** The drafts this screen can edit: each reminder email, or the one summary. */
function draftsOf(a: Approval): Draft[] {
  if (a.emails) return a.emails.map((e) => ({ to: e.to, subject: e.subject, body: e.body }));
  return [{ body: a.body }];
}

const LABEL = 'm-0 text-[12px] font-bold tracking-[0.08em] text-muted uppercase';

/** Inset pill controls on the action bar (Edit, Undo). */
const SOFT_PILL = 'h-[60px] shrink-0 rounded-full bg-default px-[22px] text-[16px] font-bold text-foreground hover:bg-default-hover';

/** The date pills: white with a hairline, the accent fill when chosen. */
const DATE = [
  // Once confirmed the group is disabled; the chosen date stays at full strength.
  'h-11 min-w-0 rounded-full px-2 text-[14px] font-bold inset-ring inset-ring-border data-[selected=true]:inset-ring-accent data-[selected=true]:opacity-100',
  '[--toggle-button-bg:var(--surface)] [--toggle-button-bg-hover:var(--color-selected)] [--toggle-button-bg-pressed:var(--color-track)] [--toggle-button-fg:var(--foreground)]',
  '[--toggle-button-bg-selected:var(--accent)] [--toggle-button-bg-selected-hover:var(--accent-hover)] [--toggle-button-bg-selected-pressed:var(--accent-hover)] [--toggle-button-fg-selected:var(--accent-foreground)]',
].join(' ');

export function PhoneApproval({ approvalKey }: { approvalKey: ApprovalKey }) {
  const a = getApproval(approvalKey) as Approval;
  const { pending, pendingCount, decisionOf, choiceOf, approve, reject, undo, choose } = usePrototype();
  const decision = decisionOf(a.key);
  const choice = choiceOf(a.key);

  const original = draftsOf(a);
  const [drafts, setDrafts] = useState<Draft[]>(original);
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState(false);
  const draft = drafts[page];
  const edited = drafts.some((d, i) => d.subject !== original[i].subject || d.body !== original[i].body);
  const canEdit = !a.choices;

  const update = (patch: Partial<Draft>) => setDrafts((ds) => ds.map((d, i) => (i === page ? { ...d, ...patch } : d)));

  // The next decision still waiting, in Inbox order after this one.
  const at = APPROVALS.findIndex((x) => x.key === a.key);
  const next = [...APPROVALS.slice(at + 1), ...APPROVALS.slice(0, at)].find((x) => !decisionOf(x.key));
  const position = pending.findIndex((x) => x.key === a.key) + 1;

  // After a decision the bar changes; keep keyboard focus on the bar instead of losing it.
  const [acted, setActed] = useState<'decided' | 'undone' | null>(null);
  const nextRef = useRef<HTMLAnchorElement>(null);
  const approveRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (acted === 'decided') nextRef.current?.focus();
    if (acted === 'undone') approveRef.current?.focus();
  }, [acted, decision]);

  const decide = (how: 'approve' | 'reject') => {
    setEditing(false);
    if (how === 'approve') approve(a.key);
    else reject(a.key);
    setActed('decided');
  };

  // Swipe between the two emails on a touch screen.
  const swipeFrom = useRef<number | null>(null);
  const onPointerDown = (e: PointerEvent) => {
    swipeFrom.current = e.pointerType === 'touch' && !editing ? e.clientX : null;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeFrom.current === null) return;
    const dx = e.clientX - swipeFrom.current;
    swipeFrom.current = null;
    if (Math.abs(dx) < 40) return;
    setPage((p) => Math.min(Math.max(p + (dx < 0 ? 1 : -1), 0), drafts.length - 1));
  };

  const result = decision ? approvalResult(a, decision, choice) : '';
  const nextHref = next ? phone.approval(next.key) : phone.inbox();

  return (
    <PhoneScreen label={a.title} className="leading-[normal]">
      <header className="mx-4 mt-[52px] flex h-12 shrink-0 items-center justify-between gap-3">
        <RoundLink href={phone.inbox()} label="Back to Inbox">
          <Icon name="back" size={22} className="size-[22px]" />
        </RoundLink>
        {!decision ? (
          <p className="m-0 flex items-center gap-2 text-[13px] font-bold text-warning">
            <span aria-hidden className="size-2 rounded-full bg-warning" />
            <span>
              Needs you · <span className="font-mono text-ink-3">{position} of {pendingCount}</span>
            </span>
          </p>
        ) : decision === 'approved' ? (
          <p className="m-0 flex items-center gap-1.5 text-[13px] font-bold text-accent">
            <Icon name="check" size={16} strokeWidth={2.5} />
            {a.choices ? 'Confirmed' : 'Approved'}
          </p>
        ) : (
          <p className="m-0 flex items-center gap-1.5 text-[13px] font-bold text-ink-3">
            <Icon name="close" size={16} strokeWidth={2.5} />
            Rejected
          </p>
        )}
        <RoundLink href={phone.chat} label="Ask Chief of Staff about this" tone="soft">
          <Icon name="chat" size={22} className="size-[22px]" />
        </RoundLink>
      </header>

      <ScrollShadow hideScrollBar size={24} className="flex min-h-0 grow flex-col gap-[18px] px-6 pt-5 pb-6">
        <div className="flex flex-col gap-2.5">
          <p className="m-0 flex items-center gap-2 text-[13px] font-semibold text-ink-3">
            <span aria-hidden className="flex size-[26px] items-center justify-center rounded-[9px] bg-accent-soft font-mono text-[9px] font-semibold text-accent">
              {a.who}
            </span>
            <span>
              {a.asker} asks · <span className="font-mono">{a.time}</span>
            </span>
          </p>
          <h1 className="m-0 text-[28px] leading-[1.15] font-bold">{a.title}</h1>
        </div>

        <section aria-labelledby="traces" className="flex flex-col gap-2.5">
          <h2 id="traces" className={LABEL}>
            Traces to
          </h2>
          <ol className="m-0 flex list-none flex-col p-0">
            {a.traces.map((t, i) => {
              const last = i === a.traces.length - 1;
              return (
                <li key={t.title} className="flex gap-3">
                  <span aria-hidden className="flex w-3 shrink-0 flex-col items-center">
                    {last ? (
                      <span className="mt-[5px] size-2.5 rounded-[3px] border-2 border-accent" />
                    ) : (
                      <>
                        <span className="mt-[5px] size-2.5 rounded-full bg-accent" />
                        <span className="w-0.5 grow bg-hairline" />
                      </>
                    )}
                  </span>
                  <span className={cn('flex flex-col gap-0.5', !last && 'pb-3')}>
                    <span className="text-[15px] font-bold">
                      <Figures text={t.title} />
                    </span>
                    <span className="text-[13px] font-semibold text-muted">{t.sub}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <Surface
          className={cn('flex flex-col gap-2.5 rounded-3xl bg-surface p-[18px]', drafts.length > 1 && 'touch-pan-y')}
          aria-label={a.emails ? `Email ${page + 1} of ${drafts.length}` : a.previewTitle}
          role="group"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className={LABEL}>{a.emails ? `Email ${page + 1} of ${drafts.length}` : a.previewTitle}</h2>
              {edited && (
                <Chip size="sm" className="bg-accent-soft px-2 text-[11px] font-bold text-accent-deep">
                  Edited
                </Chip>
              )}
            </div>
            {drafts.length > 1 && (
              <ToggleButtonGroup
                aria-label="Emails"
                selectionMode="single"
                disallowEmptySelection
                isDetached
                selectedKeys={[`email-${page}`]}
                onSelectionChange={(keys) => {
                  const key = [...keys][0];
                  if (typeof key === 'string') setPage(Number(key.slice(6)));
                }}
                className="-my-1 -mr-[3px] gap-0"
              >
                {drafts.map((_, i) => (
                  <ToggleButton
                    key={i}
                    id={`email-${i}`}
                    aria-label={`Email ${i + 1}`}
                    className="group h-6 min-w-0 rounded-full bg-transparent px-[3px] hover:bg-transparent"
                  >
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-hairline transition-all group-hover:bg-track group-data-[selected=true]:w-[18px] group-data-[selected=true]:bg-accent"
                    />
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
          </div>

          <dl className="m-0 grid grid-cols-[minmax(56px,max-content)_minmax(0,1fr)] items-baseline gap-x-2.5 gap-y-1 text-[14px] font-semibold">
            {a.emails ? (
              <>
                <dt className="text-muted">To</dt>
                <dd className="m-0">{draft.to}</dd>
                <dt className="text-muted">Subject</dt>
                <dd className="m-0">
                  {editing ? (
                    <Input
                      aria-label="Subject"
                      value={draft.subject}
                      onChange={(e) => update({ subject: e.target.value })}
                      className="h-9 w-full rounded-xl border-0 bg-background px-2.5 text-[14px] font-semibold shadow-none"
                    />
                  ) : (
                    <Figures text={draft.subject ?? ''} />
                  )}
                </dd>
              </>
            ) : (
              a.fields.map((f) => (
                <div key={f.label} className="contents">
                  <dt className="text-muted">{f.label}</dt>
                  <dd className="m-0">
                    <Figures text={f.value} />
                  </dd>
                </div>
              ))
            )}
          </dl>

          <Separator className="bg-separator" />

          {editing ? (
            <TextArea
              aria-label={a.emails ? `Email ${page + 1} text` : a.previewTitle}
              value={draft.body}
              onChange={(e) => update({ body: e.target.value })}
              autoFocus
              className="field-sizing-content min-h-32 w-full resize-none rounded-2xl border-0 bg-background p-3 text-[15px] leading-normal font-medium text-ink-2 shadow-none"
            />
          ) : (
            <p className="m-0 text-[15px] leading-normal font-medium whitespace-pre-line text-ink-2">{draft.body}</p>
          )}

          {a.choices && (
            <ToggleButtonGroup
              aria-label="Launch date"
              selectionMode="single"
              disallowEmptySelection
              isDetached
              fullWidth
              isDisabled={Boolean(decision)}
              selectedKeys={[String(choice)]}
              onSelectionChange={(keys) => {
                const key = [...keys][0];
                if (key !== undefined) choose(a.key, Number(key));
              }}
              className="mt-1 gap-2"
            >
              {a.choices.map((c, i) => (
                <ToggleButton key={c} id={String(i)} className={DATE}>
                  {c}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        </Surface>

        {/* Three equal tiles, as on the board; a longer fact ("Client sees it") widens its own tile
            rather than breaking, and on a very narrow phone the last tile moves to its own row. */}
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {a.facts.map((f) => (
            <li key={f.label} className={cn('flex min-w-max grow basis-0 flex-col gap-0.5 rounded-2xl px-3 py-2.5', f.warn ? 'bg-warning-wash' : 'bg-surface')}>
              <span className={cn('text-[15px]', f.value.startsWith('$') ? 'font-mono font-semibold' : 'font-bold', f.warn && 'text-warning')}>{f.value}</span>
              <span className={cn('text-[12px] font-semibold', f.warn ? 'text-warning-soft-foreground' : 'text-muted')}>{f.label}</span>
            </li>
          ))}
        </ul>
      </ScrollShadow>

      <footer className="shrink-0 px-5 pt-3 pb-7">
        <div role="status" aria-live="polite" className={cn(decision && 'mb-2.5')}>
          {decision === 'approved' && (
            <p className="m-0 flex items-start gap-2 text-[15px] font-bold text-accent">
              <Icon name="check" size={20} />
              <span>{result}</span>
            </p>
          )}
          {decision === 'rejected' && <p className="m-0 text-[15px] font-bold text-ink-3">{result}</p>}
        </div>

        {!decision && (
          <div className="flex items-center gap-2.5">
            <RoundButton label="Reject" tone="inset" size={60} onPress={() => decide('reject')}>
              <Icon name="close" size={22} className="size-[22px]" />
            </RoundButton>
            {canEdit && (
              <Button variant="tertiary" aria-pressed={editing} onPress={() => setEditing((v) => !v)} className={SOFT_PILL}>
                {editing ? 'Done' : 'Edit'}
              </Button>
            )}
            <Button
              ref={approveRef}
              variant="primary"
              onPress={() => decide('approve')}
              className="h-[60px] min-w-0 grow gap-2 rounded-full px-4 text-[17px] font-bold"
            >
              <Icon name="check" size={20} strokeWidth={2.5} className="size-5" />
              {a.approveLabel.replace(' and ', ' & ')}
            </Button>
          </div>
        )}

        {decision === 'approved' && (
          <ButtonLink ref={nextRef} href={nextHref} fullWidth className="h-[60px] gap-2 rounded-full text-[17px] font-bold">
            {next ? `Next: ${APPROVAL_SHORT[next.key]}` : 'Back to Inbox'}
            <Icon name="arrowRight" size={20} className="size-5" />
          </ButtonLink>
        )}

        {decision === 'rejected' && (
          <div className="flex gap-2.5">
            <Button
              variant="tertiary"
              onPress={() => {
                undo(a.key);
                setActed('undone');
              }}
              className={SOFT_PILL}
            >
              Undo
            </Button>
            <ButtonLink ref={nextRef} href={nextHref} className="h-[60px] min-w-0 grow rounded-full text-[17px] font-bold">
              {next ? 'Next approval' : 'Back to Inbox'}
            </ButtonLink>
          </div>
        )}
      </footer>
    </PhoneScreen>
  );
}
