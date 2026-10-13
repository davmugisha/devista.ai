'use client';

// Web Inbox (WebInbox.dc.html): the list beside the open item. The open item is the URL
// (/inbox?item=umoja), so reloads and links keep it; choosing a row shows it at once and then
// replaces the URL. Below 768px the list and the detail take turns, with "Back to Inbox".

import { Button, Card, cn } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@/components/icons';
import { WebPage } from '@/components/web/WebPage';
import { getApproval, getThread } from '@/lib/data';
import { web } from '@/lib/routes';
import { ApprovalDetail } from './ApprovalDetail';
import { DEFAULT_ITEM, type InboxKey } from './inbox-items';
import { InboxList } from './InboxList';
import { ThreadDetail } from './ThreadDetail';

const NARROW = '(max-width: 767px)';

export function WebInbox({ item }: { item?: InboxKey }) {
  const router = useRouter();
  const listHeadingId = useId();
  const detailHeadingId = useId();
  const listRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLElement>(null);

  // What was just chosen, shown before the URL catches up with it.
  const [chosen, setChosen] = useState<InboxKey | null>(null);
  // On a narrow screen: the detail (true) or the list (false). A link to an item opens on it.
  const [detailOnNarrow, setDetailOnNarrow] = useState(Boolean(item));
  const [seenItem, setSeenItem] = useState(item);
  if (item !== seenItem) {
    setSeenItem(item);
    // Arriving from elsewhere (search, a Review link) opens the item, even on a narrow screen.
    if (item && item !== chosen) setDetailOnNarrow(true);
  }
  if (chosen && chosen === item) setChosen(null);

  const selected: InboxKey = chosen ?? item ?? DEFAULT_ITEM;
  const approval = getApproval(selected);
  const thread = approval ? undefined : getThread(selected);
  const title = approval?.title ?? thread?.title ?? '';

  // Focus moves only when the thing that had it goes away or the detail opens out of sight.
  // Each request is a new object, so asking twice for the same place still moves focus.
  const [focus, setFocus] = useState<{ to: 'detail' | 'list'; key: InboxKey } | null>(null);
  useEffect(() => {
    if (!focus) return;
    if (focus.to === 'detail') {
      document.getElementById(detailHeadingId)?.focus();
      return;
    }
    const row = listRef.current?.querySelector<HTMLElement>(`[data-inbox-row="${focus.key}"]`);
    (row ?? document.getElementById(listHeadingId))?.focus();
  }, [focus, detailHeadingId, listHeadingId]);

  const select = (key: InboxKey, moveFocus: boolean) => {
    setChosen(key);
    setDetailOnNarrow(true);
    router.replace(web.inbox(key), { scroll: false });
    if (moveFocus) setFocus({ to: 'detail', key });
  };

  /** True when the detail is not beside the list: hidden behind it, or wrapped below it. */
  const detailIsApart = () => {
    if (window.matchMedia(NARROW).matches) return true;
    const list = listRef.current?.getBoundingClientRect();
    const detail = detailRef.current?.getBoundingClientRect();
    return Boolean(list && detail && detail.top >= list.bottom);
  };

  return (
    <WebPage className="flex-row flex-wrap items-start gap-5 pt-7 leading-[normal]">
      <InboxList
        sectionRef={listRef}
        headingId={listHeadingId}
        selected={selected}
        onSelect={(key) => select(key, detailIsApart())}
        hiddenOnNarrow={detailOnNarrow}
      />
      <Card<'section'>
        ref={detailRef}
        aria-label={title}
        render={(props) => <section {...props} />}
        className={cn(
          'min-w-0 flex-[999_1_460px] gap-[22px] rounded-[24px] p-7 max-sm:p-5',
          'shadow-[0_0_0_1px_var(--border),0_8px_24px_color-mix(in_srgb,var(--foreground)_6%,transparent)]',
          !detailOnNarrow && 'max-md:hidden',
        )}
      >
        <Button
          variant="tertiary"
          onPress={() => {
            setDetailOnNarrow(false);
            setFocus({ to: 'list', key: selected });
          }}
          className="h-10 gap-1.5 self-start rounded-full pr-4 pl-2.5 text-[14px] text-foreground md:hidden"
        >
          <Icon name="back" size={18} className="size-[18px]" />
          Back to Inbox
        </Button>
        {approval && (
          <ApprovalDetail key={approval.key} approval={approval} headingId={detailHeadingId} onSelect={(key) => select(key, true)} />
        )}
        {thread && <ThreadDetail key={thread.key} thread={thread} headingId={detailHeadingId} />}
      </Card>
    </WebPage>
  );
}
