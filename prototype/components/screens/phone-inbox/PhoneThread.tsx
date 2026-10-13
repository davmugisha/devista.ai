'use client';

// Any other conversation from the Inbox (/m/chat?thread=sales), in the Chat board's layout: the
// thread's header, its messages from data.ts, what you sent, and the composer. Opening it clears
// its unread count everywhere.

import { ScrollShadow } from '@heroui/react';
import { useEffect } from 'react';
import { PhoneScreen } from '@/components/phone/PhoneFrame';
import { getThread, type Thread, type ThreadKey } from '@/lib/data';
import { phone } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { Bubble, ChatHeader, Composer, TimeLabel, useStickToBottom } from './ChatParts';
import { ThreadTile } from './parts';

/** The day above a conversation, from the Inbox time ("7:40", "Yest.", "Tue"). */
function dayOf(time: string): { day: string; time?: string } {
  if (time === 'Yest.') return { day: 'Yesterday' };
  if (time === 'Tue') return { day: 'Tuesday' };
  return { day: 'Today', time };
}

/** Group messages name their speaker ("Eric: I’ll take the Nyota call."). */
function splitSpeaker(thread: Thread, message: string): { speaker?: string; text: string } {
  if (thread.kind !== 'group') return { text: message };
  const m = /^([^:]{1,24}):\s(.+)$/.exec(message);
  return m ? { speaker: m[1], text: m[2] } : { text: message };
}

export function PhoneThread({ threadKey }: { threadKey: ThreadKey }) {
  const thread = getThread(threadKey) as Thread;
  const { state, sentTo, markRead } = usePrototype();
  const sent = sentTo(thread.key);
  const scrollRef = useStickToBottom(sent.length);
  const when = dayOf(thread.time);

  // Opening the conversation reads it. Runs again if a restored state arrives without the flag.
  const read = Boolean(state.read[thread.key]);
  useEffect(() => {
    if (!read) markRead(thread.key);
  }, [read, markRead, thread.key]);

  return (
    <PhoneScreen label={thread.title} className="leading-[normal]">
      <ChatHeader
        back={{ href: phone.inbox(), label: 'Back to Inbox' }}
        tile={<ThreadTile thread={thread} size={40} />}
        title={thread.title}
        sub={thread.kindLabel}
        action={{ href: phone.chat, label: 'Ask Chief of Staff about this', icon: 'chat' }}
      />

      <ScrollShadow ref={scrollRef} hideScrollBar size={24} className="flex min-h-0 grow flex-col px-5 pt-4 pb-4">
        <ol aria-label="Messages" className="m-0 flex list-none flex-col gap-3 p-0">
          <li className="self-center pb-1">
            <TimeLabel day={when.day} time={when.time} />
          </li>
          {thread.messages.map((m) => {
            const { speaker, text } = splitSpeaker(thread, m);
            return (
              <Bubble key={m} from="them" speaker={speaker}>
                {text}
              </Bubble>
            );
          })}
          {sent.map((text, i) => (
            <Bubble key={i} from="you">
              {text}
            </Bubble>
          ))}
        </ol>
      </ScrollShadow>

      {/* People, agents and groups are written to; an alert or a call recap is asked about. */}
      {thread.kind === 'alert' || thread.kind === 'call' ? (
        <Composer
          thread={thread.key}
          label={`Ask Chief of Staff about ${thread.title}`}
          placeholder={thread.kind === 'alert' ? 'Ask Chief of Staff about this alert' : 'Ask Chief of Staff about this call'}
        />
      ) : (
        <Composer thread={thread.key} label={`Message ${thread.title}`} placeholder={`Write to ${thread.title}`} />
      )}
    </PhoneScreen>
  );
}
