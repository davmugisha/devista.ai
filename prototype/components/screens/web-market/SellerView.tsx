'use client';

// The Sell view of the web Marketplace (WebMarketplace.dc.html): what Branshs LLC earns from what
// it sells, its listings (with anything submitted in this session as "In review"), the buyer
// question waiting for it, and the way into the sell form.

import { Card, Table } from '@heroui/react';
import Link from 'next/link';
import { Icon } from '@/components/icons';
import { ButtonLink } from '@/components/ui';
import { KIND_LABEL, MY_LISTINGS, SELLABLES, priceLabel } from '@/lib/data';
import { web } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { StatusChip } from './parts';

/** What the web table adds to each of the company's own listings: its price and buyer count. */
const TABLE_DETAIL: Record<string, { price: string; buyers: number }> = {
  'Client portal checklist': { price: '$25', buyers: 31 },
  'Proposal style guide': { price: '$9/mo', buyers: 7 },
  'Delivery check-in': { price: '$15', buyers: 0 },
  'Weekly cash note': { price: '$12/mo', buyers: 0 },
};

interface Row {
  id: string;
  title: string;
  type: string;
  price: string;
  buyers: number;
  status: 'Live' | 'In review' | 'Draft';
}

const HEAD = 'bg-transparent leading-[normal] py-3.5 text-[13px] font-bold text-muted after:hidden first:pl-[18px] last:pr-[18px] px-3';
const CELL = 'leading-[normal] border-t border-b-0 border-inset bg-transparent px-3 py-4 text-[15px] font-semibold first:pl-[18px] last:pr-[18px] group-hover:bg-row-hover';

export function SellerView() {
  const { state } = usePrototype();

  const rows: Row[] = [
    ...MY_LISTINGS.map((l) => ({
      id: l.title,
      title: l.title,
      type: l.sub.split(' · ')[0],
      price: TABLE_DETAIL[l.title]?.price ?? '',
      buyers: TABLE_DETAIL[l.title]?.buyers ?? 0,
      status: l.status,
    })),
    ...state.submissions.map((s) => {
      const thing = SELLABLES.find((t) => t.key === s.thing);
      return {
        id: s.id,
        title: s.name || 'Untitled listing',
        type: thing ? KIND_LABEL[thing.kind] : '',
        price: priceLabel(s.model, s.price),
        buyers: 0,
        status: 'In review' as const,
      };
    }),
  ];
  const live = rows.filter((r) => r.status === 'Live').length;
  const inReview = rows.filter((r) => r.status === 'In review').length;
  const drafts = rows.filter((r) => r.status === 'Draft').length;
  const buyers = rows.reduce((sum, r) => sum + r.buyers, 0);

  const stats = [
    { label: 'Earned this month', value: '$412', note: 'After the marketplace fee' },
    { label: 'Live listings', value: String(live), note: `${inReview} in review, ${drafts} ${drafts === 1 ? 'draft' : 'drafts'}` },
    { label: 'Buyers', value: String(buyers), note: 'Companies using your work' },
    { label: 'Rating', value: '4.8', note: 'Across both listings' },
  ];

  return (
    <>
      <section aria-label="Your numbers" className="grid grid-cols-2 gap-3.5 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {stats.map((s) => (
          <Card key={s.label} className="gap-1.5 rounded-[24px] bg-surface p-5 shadow-none">
            <span className="text-[14px] font-bold text-ink-3">{s.label}</span>
            <span className="font-mono text-[32px] font-semibold tabular-nums">{s.value}</span>
            <span className="text-[13px] font-semibold text-muted">{s.note}</span>
          </Card>
        ))}
      </section>

      <div className="flex flex-wrap items-start gap-6">
        <section aria-label="Your listings" className="flex min-w-0 flex-[999_1_520px] flex-col gap-3.5">
          <h2 className="m-0 text-[19px] font-bold">Your listings</h2>
          <Table variant="secondary" className="rounded-[22px] shadow-[inset_0_0_0_1px_var(--color-inset)]">
            <Table.ScrollContainer>
              <Table.Content aria-label="Your listings" className="min-w-[560px]">
                <Table.Header>
                  <Table.Column isRowHeader className={HEAD}>
                    Listing
                  </Table.Column>
                  <Table.Column className={HEAD}>Type</Table.Column>
                  <Table.Column className={HEAD}>Price</Table.Column>
                  <Table.Column className={HEAD}>Buyers</Table.Column>
                  <Table.Column className={HEAD}>Status</Table.Column>
                </Table.Header>
                <Table.Body>
                  {rows.map((r) => (
                    <Table.Row key={r.id} id={r.id} className="group">
                      <Table.Cell className={`${CELL} font-bold`}>{r.title}</Table.Cell>
                      <Table.Cell className={`${CELL} text-ink-3`}>{r.type}</Table.Cell>
                      <Table.Cell className={`${CELL} font-mono tabular-nums`}>{r.price}</Table.Cell>
                      <Table.Cell className={`${CELL} font-mono tabular-nums`}>{r.buyers}</Table.Cell>
                      <Table.Cell className={CELL}>
                        <StatusChip status={r.status} />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </section>

        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3.5">
          <Card render={(props) => <section {...props} aria-label="Needs you" />} className="gap-3 rounded-[24px] bg-surface p-5 shadow-none">
            <h2 className="m-0 flex items-center gap-2 text-[17px] font-bold text-warning-soft-foreground">
              <span aria-hidden className="size-2 rounded-full bg-warning" />
              Needs you
            </h2>
            <Link href={web.inbox()} className="group flex items-center gap-3 rounded-2xl text-foreground outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2">
              <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-warning-soft text-warning">
                <Icon name="bubble" size={22} />
              </span>
              <span className="flex min-w-0 grow flex-col gap-[3px]">
                <span className="text-[15px] font-bold group-hover:underline">Answer a buyer question</span>
                <span className="text-[13px] font-semibold text-ink-3">Amani Foods · Client portal checklist</span>
              </span>
              <Icon name="chevronRight" size={18} className="text-muted" />
            </Link>
          </Card>

          <Card className="gap-3.5 rounded-[24px] bg-selected p-[22px] shadow-[inset_0_0_0_1px_var(--accent-soft)]">
            <h2 className="m-0 text-[18px] font-bold">Sell what you already run</h2>
            <p className="m-0 text-[14px] leading-normal font-semibold text-ink-2">
              Pick a workflow, agent, pipeline or tool your company uses. Saydeed strips your data and reviews it before buyers see it.
            </p>
            <ButtonLink href={web.sell} fullWidth className="h-[52px] gap-2 rounded-full text-[16px] font-bold [&_svg]:size-[18px]">
              <Icon name="plus" size={18} strokeWidth={2.5} />
              Sell something you built
            </ButtonLink>
          </Card>
        </div>
      </div>
    </>
  );
}
