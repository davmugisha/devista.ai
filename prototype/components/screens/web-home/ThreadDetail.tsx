'use client';

// A conversation in the web Inbox detail: the messages, then what the owner sent (kept in the
// shared store, so it survives a reload), and a composer. Opening it clears its unread badge.

import { Button, Form, Input, Label, TextField, cn } from '@heroui/react';
import { useEffect, useState } from 'react';
import type { Thread } from '@/lib/data';
import { usePrototype } from '@/lib/store';
import { ThreadTile } from './inbox-items';

export function ThreadDetail({ thread, headingId }: { thread: Thread; headingId: string }) {
  const { sentTo, send, markRead, unreadOf } = usePrototype();
  const [draft, setDraft] = useState('');
  const mine = sentTo(thread.key);
  const unread = unreadOf(thread.key);

  // Re-runs when the saved state is restored after hydration, so the badge stays cleared.
  useEffect(() => {
    if (unread > 0) markRead(thread.key);
  }, [unread, thread.key, markRead]);

  return (
    <>
      <div className="flex items-center gap-3">
        <ThreadTile thread={thread} className="size-11" iconSize={22} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 id={headingId} tabIndex={-1} className="text-[24px] font-bold outline-none">
            {thread.title}
          </h2>
          <span className="text-[14px] font-semibold text-ink-3">{thread.kindLabel}</span>
        </div>
      </div>

      <ol aria-label="Messages" className="m-0 flex list-none flex-col gap-2.5 p-0">
        {thread.messages.map((text, i) => (
          <Bubble key={`them-${i}`} text={text} />
        ))}
        {mine.map((text, i) => (
          <Bubble key={`you-${i}`} text={text} you />
        ))}
      </ol>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          const text = draft.trim();
          if (!text) return;
          send(thread.key, text);
          setDraft('');
        }}
        className="flex flex-row items-stretch gap-2"
      >
        <TextField value={draft} onChange={setDraft} className="min-w-0 grow">
          <Label className="sr-only">Message {thread.title}</Label>
          <Input
            placeholder={`Write to ${thread.title}`}
            autoComplete="off"
            className="h-[52px] w-full rounded-full border-0 bg-background px-5 text-[15px] font-semibold text-foreground shadow-[inset_0_0_0_1px_var(--border)] placeholder:text-muted hover:bg-background focus:bg-background"
          />
        </TextField>
        <Button type="submit" className="h-[52px] shrink-0 rounded-full px-[22px] text-[15px]">
          Send
        </Button>
      </Form>
    </>
  );
}

function Bubble({ text, you }: { text: string; you?: boolean }) {
  return (
    <li
      className={cn(
        'max-w-[78%] px-4 py-3 text-[15px] leading-[1.5] font-semibold',
        you
          ? 'self-end rounded-[20px_20px_6px_20px] bg-accent text-accent-foreground'
          : 'self-start rounded-[20px_20px_20px_6px] bg-background text-foreground',
      )}
    >
      {you && <span className="sr-only">You: </span>}
      {text}
    </li>
  );
}
