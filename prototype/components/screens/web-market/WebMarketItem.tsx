'use client';

// One Marketplace listing on the web (WebMarketItem.dc.html): what it is, what it does, what it
// will ask for and which agents it works with, beside the plan card. The plan card has three
// stages: choose a plan, Chief of Staff's checks before anything is bought, and done. Buying goes
// through the shared store, so the listing stays installed on reload, on the Marketplace cards and
// on the phone.

import { Button, Card, Chip, RadioGroup, Separator, cn } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/icons';
import { WebPage } from '@/components/web/WebPage';
import { ButtonLink, InitialsTile, KindTile } from '@/components/ui';
import {
  KIND_CATEGORY,
  KIND_LABEL,
  PERMISSION_LEVEL,
  buyChecks,
  buyWords,
  type Listing,
  type PermissionLevel,
  type PlanKey,
} from '@/lib/data';
import { web } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { CardRadio, CheckDot, CosTile, KindChip, MarketBreadcrumb, RadioMark, StepNumber, categoryOf, marketHref } from './parts';

const LEVEL_TILE: Record<PermissionLevel, string> = {
  read: 'bg-inset text-ink-2',
  draft: 'bg-accent-soft text-accent',
  act: 'bg-warning-soft text-warning',
};

const LEVEL_TEXT: Record<PermissionLevel, string> = {
  read: 'text-muted',
  draft: 'text-accent',
  act: 'text-warning',
};

export function WebMarketItem({ listing }: { listing: Listing }) {
  const kind = listing.kind;
  return (
    <WebPage label={listing.title} className="leading-[normal]">
      <MarketBreadcrumb
        trail={[{ label: KIND_CATEGORY[kind], href: marketHref({ category: categoryOf(kind) }) }, { label: listing.title }]}
      />
      <div className="flex flex-wrap items-start gap-8">
        <div className="flex min-w-0 flex-[999_1_460px] flex-col gap-8">
          <div className="flex flex-wrap items-center gap-5">
            <KindTile kind={kind} iconSize={40} className={cn('size-[88px]', kind !== 'expert' && 'rounded-[26px]')} />
            <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-2">
              <h1 className="m-0 text-[34px] leading-[1.15] font-bold tracking-[-0.01em]">{listing.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-ink-3">
                <KindChip tone="accent">{KIND_LABEL[kind]}</KindChip>
                <span>
                  by <span className="font-bold text-foreground">{listing.seller}</span>
                </span>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-[5px]">
                  <Icon name="star" size={15} className="text-accent" />
                  <span className="font-mono text-foreground tabular-nums">{listing.rating}</span>
                  <span className="sr-only">out of 5,</span> from {listing.reviews} reviews
                </span>
              </div>
            </div>
          </div>

          {listing.why && (
            <div className="flex items-start gap-3.5 rounded-[22px] bg-selected px-5 py-[18px] shadow-[inset_0_0_0_1px_var(--accent-soft)]">
              <CosTile className="size-[34px] rounded-[11px]" />
              <div className="flex flex-col gap-[3px]">
                <span className="text-[14px] font-bold text-accent">Chief of Staff suggests it</span>
                <p className="m-0 text-[16px] leading-[1.45] font-semibold text-ink-2">{listing.why}</p>
              </div>
            </div>
          )}

          <p className="m-0 max-w-[68ch] text-[18px] leading-[1.55] font-medium text-ink-2">{listing.blurb}</p>

          <section aria-label="What it does" className="flex flex-col gap-3.5">
            <h2 className="m-0 text-[19px] font-bold">What it does</h2>
            <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5 p-0">
              {listing.steps.map((step, i) => (
                <li key={step} className="flex flex-col gap-3 rounded-[20px] bg-surface p-4 shadow-[inset_0_0_0_1px_var(--color-inset)]">
                  <StepNumber n={i + 1} />
                  <span className="text-[15px] leading-[1.4] font-semibold">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-7">
            <section aria-label="Permissions" className="flex flex-col gap-3">
              <h2 className="m-0 text-[19px] font-bold">It will ask for</h2>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {listing.asks.map((ask) => (
                  <li key={ask.text} className="flex items-center gap-3">
                    <span aria-hidden className={cn('flex size-[38px] shrink-0 items-center justify-center rounded-xl', LEVEL_TILE[ask.level])}>
                      <Icon name={PERMISSION_LEVEL[ask.level].icon} size={18} />
                    </span>
                    <span className="flex flex-col gap-px">
                      <span className="text-[15px] font-bold">{ask.text}</span>
                      <span className={cn('text-[12px] font-semibold', LEVEL_TEXT[ask.level])}>{PERMISSION_LEVEL[ask.level].label}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section aria-label="Works with" className="flex flex-col gap-3">
              <h2 className="m-0 text-[19px] font-bold">Works with your</h2>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {listing.uses.map((u) => (
                  <li key={u.initials}>
                    <Chip className="h-10 gap-2 rounded-full bg-surface py-0 pr-3.5 pl-1.5 text-[14px] font-bold text-foreground">
                      <InitialsTile initials={u.initials} className="size-7 rounded-[9px] bg-accent-soft text-accent" />
                      {u.name}
                    </Chip>
                  </li>
                ))}
              </ul>
              <p className="m-0 text-[14px] leading-normal font-semibold text-muted">Chief of Staff connects it to them when you approve.</p>
            </section>
          </div>
        </div>

        <aside aria-label={`Get ${listing.title}`} className="sticky top-6 min-w-0 flex-[1_1_320px]">
          <PlanCard listing={listing} />
        </aside>
      </div>
    </WebPage>
  );
}

type Stage = 'browse' | 'review';

/** Choose a plan, then Chief of Staff's checks, then done. Installed listings open on done. */
function PlanCard({ listing }: { listing: Listing }) {
  const { isInstalled, install } = usePrototype();
  const installed = isInstalled(listing.key);
  const [planKey, setPlanKey] = useState<PlanKey>(listing.plans[0].key);
  const [stage, setStage] = useState<Stage>('browse');
  const plan = listing.plans.find((p) => p.key === planKey) ?? listing.plans[0];
  const words = buyWords(listing, plan);
  const checks = buyChecks(listing, plan);
  const shown = installed ? 'done' : stage;

  // Keyboard and screen reader users follow the card from stage to stage.
  const focusNext = useRef<'review' | 'browse' | 'done' | null>(null);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const cta = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const target = focusNext.current;
    if (!target || target !== shown) return;
    focusNext.current = null;
    if (target === 'review') reviewHeading.current?.focus();
    if (target === 'done') doneHeading.current?.focus();
    if (target === 'browse') cta.current?.focus();
  }, [shown]);

  const go = (next: Stage) => {
    focusNext.current = next;
    setStage(next);
  };
  const approve = () => {
    focusNext.current = 'done';
    install({ listing: listing.key, plan: plan.key });
    setStage('browse');
  };

  return (
    <Card className="gap-[18px] rounded-[28px] bg-surface p-6 shadow-[inset_0_0_0_1px_var(--color-inset)]">
      {shown === 'browse' && (
        <>
          <h2 className="m-0 text-[19px] font-bold">Choose a plan</h2>
          <RadioGroup aria-label="Plans" value={plan.key} onChange={(v) => setPlanKey(v as PlanKey)} className="gap-2">
            {listing.plans.map((p) => (
              <CardRadio
                key={p.key}
                value={p.key}
                isSelected={p.key === plan.key}
                contentClassName="min-h-16 gap-3 rounded-[18px] bg-surface px-4 py-3 text-left font-semibold shadow-[inset_0_0_0_2px_var(--surface)]"
              >
                <RadioMark />
                <span className="flex min-w-0 grow flex-col gap-0.5">
                  <span className="text-[15px] font-bold">{p.label}</span>
                  <span className="text-[12px] font-semibold text-muted">{p.note}</span>
                </span>
                <span className="shrink-0 font-mono text-[16px] font-semibold tabular-nums">{p.price}</span>
              </CardRadio>
            ))}
          </RadioGroup>
          <Separator className="bg-inset" />
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[14px] font-bold text-ink-3">Charged today</span>
            <span className="font-mono text-[24px] font-semibold tabular-nums">{plan.charge}</span>
          </div>
          <Button ref={cta} fullWidth onPress={() => go('review')} className="h-14 rounded-full text-[17px] font-bold">
            {words.cta}
          </Button>
          <p className="m-0 text-[13px] leading-normal font-semibold text-muted">
            Chief of Staff checks the budget and permissions with you before anything runs.
          </p>
        </>
      )}

      {shown === 'review' && (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-ink-3">
              <CosTile className="size-[26px]" />
              Chief of Staff checked it
            </div>
            <h2 ref={reviewHeading} tabIndex={-1} className="m-0 text-[22px] leading-[1.2] font-bold outline-none">
              {listing.title} · {plan.label}
            </h2>
          </div>
          <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
            {checks.map((c) => (
              <li key={c.title} className="flex items-start gap-3">
                <CheckDot />
                <span className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-bold">{c.title}</span>
                  <span className="text-[13px] leading-[1.4] font-semibold text-ink-3">{c.sub}</span>
                </span>
              </li>
            ))}
          </ul>
          {/* Side by side when the approve words fit, otherwise one full-width button per row. */}
          <div className="flex flex-wrap gap-2.5">
            <Button variant="tertiary" onPress={() => go('browse')} className="h-14 grow rounded-full px-[22px] text-[16px] font-bold">
              Cancel
            </Button>
            <Button onPress={approve} className="h-14 grow-[999] rounded-full px-4 text-[16px] font-bold [&_svg]:size-[18px]">
              <Icon name="check" size={18} strokeWidth={2.5} />
              {words.approve}
            </Button>
          </div>
        </>
      )}

      {shown === 'done' && (
        <>
          <div role="status" className="flex flex-col gap-2.5">
            <CheckDot size={56} iconSize={28} />
            <h2 ref={doneHeading} tabIndex={-1} className="m-0 text-[22px] leading-[1.2] font-bold text-accent outline-none">
              {listing.done.title}
            </h2>
            <p className="m-0 text-[15px] leading-normal font-semibold text-ink-2">{listing.done.text}</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <ButtonLink href={web.marketplace} variant="tertiary" className="h-[52px] grow rounded-full px-5 text-[15px] font-bold">
              Back to Marketplace
            </ButtonLink>
            <ButtonLink
              href={listing.done.web === 'inbox' ? web.inbox() : web.home}
              className="h-[52px] grow-[999] rounded-full px-5 text-[15px] font-bold"
            >
              {listing.done.action}
            </ButtonLink>
          </div>
        </>
      )}
    </Card>
  );
}
