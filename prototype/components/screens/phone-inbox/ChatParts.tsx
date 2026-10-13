'use client';

// The pieces every phone conversation shares (Chat.dc.html): the header, message bubbles and the
// composer. Messages the owner sends go into the shared store, so they are still there after a
// reload and show on the web Inbox too.

import { Button, Form, Input, Label, TextField, cn } from '@heroui/react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/icons';
import { RoundLink } from '@/components/phone/RoundButton';
import type { ThreadKey } from '@/lib/data';
import { usePrototype } from '@/lib/store';

export function ChatHeader({
  back,
  tile,
  title,
  sub,
  action,
}: {
  back: { href: string; label: string };
  tile: ReactNode;
  title: string;
  sub: ReactNode;
  action: { href: string; label: string; icon: IconName };
}) {
  return (
    <header className="mx-4 mt-[52px] flex h-14 shrink-0 items-center gap-3">
      <RoundLink href={back.href} label={back.label}>
        <Icon name="back" size={22} className="size-[22px]" />
      </RoundLink>
      <div className="flex min-w-0 grow items-center gap-2.5">
        {tile}
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="m-0 truncate text-[16px] font-bold">{title}</h1>
          <p className="m-0 flex items-center gap-1.5 truncate text-[12px] font-semibold text-muted">{sub}</p>
        </div>
      </div>
      <RoundLink href={action.href} label={action.label} tone="soft">
        <Icon name={action.icon} size={22} className="size-[22px]" />
      </RoundLink>
    </header>
  );
}

/** The centred day and time above a conversation: "TODAY · 8:10". */
export function TimeLabel({ day, time }: { day: string; time?: string }) {
  return (
    <p className="m-0 self-center text-[12px] font-bold tracking-[0.06em] text-muted uppercase">
      {day}
      {time && (
        <>
          {' · '}
          <span className="font-mono">{time}</span>
        </>
      )}
    </p>
  );
}

/** One message. Yours sit on the right in soft cyan; everyone else's on the left in white. */
export function Bubble({ from, speaker, children }: { from: 'you' | 'them'; speaker?: string; children: ReactNode }) {
  const you = from === 'you';
  return (
    // The board's 78% is the text width; the bubble's padding comes on top of it.
    <li className={cn('flex max-w-[calc(78%+2rem)] flex-col gap-1', you ? 'self-end' : 'self-start')}>
      {speaker && <span className="px-1 text-[12px] font-bold text-muted">{speaker}</span>}
      <p
        className={cn(
          'm-0 px-4 py-3 text-[16px] leading-[1.4] break-words',
          you ? 'rounded-[22px_22px_6px_22px] bg-accent-soft font-semibold text-accent-deep' : 'rounded-[22px_22px_22px_6px] bg-surface font-medium text-foreground',
        )}
      >
        {you && <span className="sr-only">You: </span>}
        {children}
      </p>
    </li>
  );
}

/** Scrolls a conversation to its newest message whenever a message is added. */
export function useStickToBottom(count: number) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useRef(count);
  useEffect(() => {
    if (count > seen.current) {
      const el = ref.current;
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el?.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    }
    seen.current = count;
  }, [count]);
  return ref;
}

const NOTES = {
  attach: 'Attaching files is not part of this prototype yet.',
  voice: 'Voice notes are not part of this prototype yet.',
} as const;

/** Attach, the message box, and the voice note button, which turns into Send once you type. */
export function Composer({ thread, label, placeholder }: { thread: ThreadKey; label: string; placeholder: string }) {
  const { send } = usePrototype();
  const [text, setText] = useState('');
  const [note, setNote] = useState<keyof typeof NOTES | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!note) return;
    const t = window.setTimeout(() => setNote(null), 4000);
    return () => window.clearTimeout(t);
  }, [note]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = text.trim();
    if (!message) return;
    send(thread, message);
    setText('');
    inputRef.current?.focus();
  };

  const round = 'size-11 min-w-11 shrink-0 rounded-full p-0';

  return (
    <div className="relative mx-4 mb-7 shrink-0">
      <p
        role="status"
        className={cn(
          'pointer-events-none absolute inset-x-2 bottom-full mb-2 rounded-2xl bg-foreground px-4 py-2.5 text-center text-[13px] font-semibold text-background shadow-pop transition-opacity',
          note ? 'opacity-100' : 'opacity-0',
        )}
      >
        {note ? NOTES[note] : ''}
      </p>
      <Form onSubmit={submit} className="flex h-[60px] items-center gap-1.5 rounded-full bg-surface px-2">
        <Button isIconOnly type="button" aria-label="Attach a file" onPress={() => setNote('attach')} className={cn(round, 'bg-default text-foreground hover:bg-default-hover')}>
          <Icon name="plus" size={20} className="size-5" />
        </Button>
        <TextField value={text} onChange={setText} className="min-w-0 grow">
          <Label className="sr-only">{label}</Label>
          <Input
            ref={inputRef}
            placeholder={placeholder}
            autoComplete="off"
            className="h-11 w-full rounded-full border-0 bg-transparent px-0.5 text-[16px] font-semibold text-foreground shadow-none placeholder:text-muted focus:bg-transparent data-[focused=true]:bg-transparent data-[focused=true]:shadow-none data-[focused=true]:ring-0 data-[hovered=true]:bg-transparent"
          />
        </TextField>
        {text.trim() ? (
          <Button isIconOnly type="submit" aria-label="Send message" className={cn(round, 'bg-accent text-accent-foreground hover:bg-accent-hover')}>
            <Icon name="arrowRight" size={20} strokeWidth={2.5} className="size-5 -rotate-90" />
          </Button>
        ) : (
          <Button isIconOnly type="button" aria-label="Record a voice note" onPress={() => setNote('voice')} className={cn(round, 'bg-accent-soft text-accent hover:bg-accent-soft-hover')}>
            <Icon name="mic" size={20} className="size-5" />
          </Button>
        )}
      </Form>
    </div>
  );
}
