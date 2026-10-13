'use client';

// Sell something you built (WebMarketSell.dc.html): pick something the company already runs, say
// how buyers pay, name it, read what Saydeed promises, and submit it for review while a preview
// shows how buyers will see it. Submitting goes through the shared store, so the listing appears
// as "In review" on the Marketplace's Sell view.

import {
  Button,
  Card,
  Chip,
  Description,
  FieldError,
  Fieldset,
  Form,
  Input,
  InputGroup,
  Label,
  RadioGroup,
  TextArea,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  cn,
} from '@heroui/react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Icon } from '@/components/icons';
import { WebPage } from '@/components/web/WebPage';
import { ButtonLink, KindTile } from '@/components/ui';
import {
  COMPANY,
  KIND_LABEL,
  PRICE_MODELS,
  SELLABLES,
  SELL_PROMISES,
  cleanPrice,
  priceLabel,
  type PriceModel,
  type SellableKey,
} from '@/lib/data';
import { usePrototype } from '@/lib/store';
import { CardRadio, CheckDot, KindChip, MarketBreadcrumb, RadioMark, StepNumber, marketHref } from './parts';

const FIELD_LABEL = 'text-[13px] leading-[normal] font-bold text-ink-3';
const FIELD_ERROR = 'px-0 text-[13px] leading-[normal] font-semibold text-danger';

function Legend({ n, id, children }: { n: number; id?: string; children: string }) {
  return (
    <Fieldset.Legend id={id} className="mb-3.5 flex items-center gap-3 p-0 text-[20px] font-bold text-foreground">
      <StepNumber n={n} />
      {children}
    </Fieldset.Legend>
  );
}

export function WebMarketSell() {
  const { submit } = usePrototype();
  const first = SELLABLES[0];
  const [thing, setThing] = useState<SellableKey>(first.key);
  const [model, setModel] = useState<PriceModel>('month');
  const [price, setPrice] = useState(first.price);
  const [name, setName] = useState(first.title);
  const [pitch, setPitch] = useState(first.pitch);
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState<{ name: string; price: string } | null>(null);

  const chosen = SELLABLES.find((t) => t.key === thing) ?? first;
  const expert = chosen.kind === 'expert';
  const paid = model !== 'free';
  const label = priceLabel(model, price);
  const nameMissing = !name.trim();
  const priceMissing = paid && !(Number(price) > 0);

  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const sentHeading = useRef<HTMLHeadingElement>(null);
  const formHeading = useRef<HTMLHeadingElement>(null);
  // Focus follows the page: to "Submitted for review" on submit, back to the form for another.
  const returning = useRef(false);
  useEffect(() => {
    if (sent) sentHeading.current?.focus();
    else if (returning.current) formHeading.current?.focus();
    returning.current = false;
  }, [sent]);

  /** Picking something to sell starts its name, pitch and price afresh; an expert is paid once. */
  const pick = (key: SellableKey) => {
    const t = SELLABLES.find((s) => s.key === key);
    if (!t) return;
    setThing(t.key);
    setName(t.title);
    setPitch(t.pitch);
    setPrice(t.price);
    if (t.kind === 'expert') setModel('once');
    setTried(false);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nameMissing || priceMissing) {
      setTried(true);
      (priceMissing ? priceRef : nameRef).current?.focus();
      return;
    }
    submit({ thing, name: name.trim(), pitch: pitch.trim(), model, price: paid ? price : '' });
    setSent({ name: name.trim(), price: label });
  };

  /** "Sell something else": the same pick and model, with its name, pitch and price restored. */
  const again = () => {
    returning.current = true;
    setSent(null);
    setName(chosen.title);
    setPitch(chosen.pitch);
    setPrice(chosen.price);
    setTried(false);
  };

  return (
    <WebPage className="gap-8 leading-[normal]">
      <MarketBreadcrumb trail={[{ label: 'Sell' }]} />

      {sent ? (
        <Card role="status" className="max-w-[640px] gap-4 rounded-[28px] bg-surface p-9 shadow-[inset_0_0_0_1px_var(--color-inset)] max-sm:p-6">
          <CheckDot size={72} iconSize={34} />
          <h1 ref={sentHeading} tabIndex={-1} className="m-0 text-[34px] leading-[1.15] font-bold outline-none">
            Submitted for review
          </h1>
          <p className="m-0 text-[17px] leading-normal font-semibold text-ink-3">
            {sent.name} goes live {sent.price === 'Free' ? 'for free' : `at ${sent.price}`} once our review is done. You will hear back in Inbox, and Chief of Staff answers the buyer
            questions it can.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <ButtonLink href={marketHref({ view: 'sell' })} className="h-[52px] rounded-full px-[22px] text-[16px] font-bold">
              Back to Marketplace
            </ButtonLink>
            <Button variant="tertiary" onPress={again} className="h-[52px] rounded-full px-[22px] text-[16px] font-bold">
              Sell something else
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            <h1 ref={formHeading} tabIndex={-1} className="m-0 text-[34px] leading-[1.1] font-bold tracking-[-0.01em] outline-none">
              Sell something you built
            </h1>
            <p className="m-0 max-w-[62ch] text-[17px] leading-normal font-semibold text-ink-3">
              Pick something your company already runs, price it and name it. Buyers get the steps, never your data.
            </p>
          </div>

          <div className="flex flex-wrap items-start gap-8">
            <Form
              aria-label="New listing"
              validationBehavior="aria"
              onSubmit={onSubmit}
              className="m-0 flex min-w-0 flex-[999_1_480px] flex-col gap-9"
            >
              <Fieldset className="m-0 min-w-0 grow-0 basis-auto gap-3.5 border-0 p-0">
                <Legend n={1} id="sell-what">
                  What do you want to sell?
                </Legend>
                <RadioGroup
                  aria-labelledby="sell-what"
                  value={thing}
                  onChange={(v) => pick(v as SellableKey)}
                  className="grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-2.5"
                >
                  {SELLABLES.map((t) => (
                    <CardRadio
                      key={t.key}
                      value={t.key}
                      isSelected={t.key === thing}
                      contentClassName="h-full flex-col items-stretch gap-3 rounded-[20px] bg-surface p-4 text-left shadow-[inset_0_0_0_2px_var(--color-inset)]"
                    >
                      <span className="flex items-center justify-between">
                        <KindTile kind={t.kind} className={cn(t.kind !== 'expert' && 'rounded-[14px]')} />
                        <RadioMark className="size-[22px]" />
                      </span>
                      <span className="flex flex-col gap-[3px]">
                        <span className="text-[16px] font-bold">{t.title}</span>
                        <span className="text-[13px] font-semibold text-ink-3">
                          {KIND_LABEL[t.kind]} · {t.proof}
                        </span>
                      </span>
                    </CardRadio>
                  ))}
                </RadioGroup>
              </Fieldset>

              <Fieldset className="m-0 min-w-0 grow-0 basis-auto gap-3.5 border-0 p-0">
                <Legend n={2}>How buyers pay</Legend>
                <div className="flex flex-wrap items-end gap-4">
                  <ToggleButtonGroup
                    aria-label="Pricing model"
                    selectionMode="single"
                    disallowEmptySelection
                    isDetached
                    fullWidth
                    selectedKeys={[model]}
                    onSelectionChange={(keys) => {
                      const next = PRICE_MODELS.find((m) => m.key === [...keys][0]);
                      if (next) setModel(next.key);
                    }}
                    className="segmented-accent h-[52px] flex-[0_1_360px] gap-1 p-1"
                  >
                    {PRICE_MODELS.map((m) => (
                      <ToggleButton key={m.key} id={m.key} className="h-11 px-3 text-[15px]">
                        {m.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  {paid && (
                    <TextField
                      value={price}
                      onChange={(v) => setPrice(cleanPrice(v))}
                      isInvalid={tried && priceMissing}
                      aria-describedby={tried && priceMissing ? 'sell-price-error sell-price-hint' : 'sell-price-hint'}
                      className="flex max-w-[280px] min-w-0 flex-[1_1_220px] flex-col gap-1.5"
                    >
                      <Label className={FIELD_LABEL}>Price in US dollars{model === 'month' ? ', per month' : ''}</Label>
                      <InputGroup className="h-[52px] w-full gap-1.5 rounded-2xl border-0 bg-surface px-[18px] shadow-[inset_0_0_0_1px_var(--border)]">
                        <InputGroup.Prefix className="h-auto border-0 bg-transparent p-0 font-mono text-[17px] text-muted">$</InputGroup.Prefix>
                        <InputGroup.Input
                          ref={priceRef}
                          inputMode="decimal"
                          autoComplete="off"
                          className="h-11 min-w-0 px-0 font-mono text-[17px] font-semibold text-foreground"
                        />
                      </InputGroup>
                    </TextField>
                  )}
                </div>
                {/* Below the row, so the price box stays level with the segmented control. */}
                {paid && tried && priceMissing && (
                  <p id="sell-price-error" className={cn('m-0', FIELD_ERROR)}>
                    Add a price, or choose Free.
                  </p>
                )}
                <Description id="sell-price-hint" className="text-[13px] leading-[normal] font-semibold text-muted">
                  You keep the price minus the marketplace fee, paid out on the 1st of each month.
                </Description>
              </Fieldset>

              <Fieldset className="m-0 min-w-0 grow-0 basis-auto gap-3.5 border-0 p-0">
                <Legend n={3}>Name it for buyers</Legend>
                <TextField value={name} onChange={setName} isInvalid={tried && nameMissing} className="flex flex-col gap-1.5">
                  <Label className={FIELD_LABEL}>Listing name</Label>
                  <Input ref={nameRef} autoComplete="off" className="h-[52px] rounded-2xl px-[18px] text-[16px] font-semibold" />
                  <FieldError className={FIELD_ERROR}>Give it a name buyers will see.</FieldError>
                </TextField>
                <TextField value={pitch} onChange={setPitch} className="flex flex-col gap-1.5">
                  <Label className={FIELD_LABEL}>What it does, in one or two lines</Label>
                  <TextArea rows={3} className="resize-y rounded-2xl px-[18px] py-3.5 text-[15px] leading-[1.45] font-semibold" />
                </TextField>
              </Fieldset>

              <Fieldset className="m-0 min-w-0 grow-0 basis-auto gap-3.5 border-0 p-0">
                <Legend n={4}>Before it goes live</Legend>
                <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-4 p-0 md:grid-cols-2">
                  {SELL_PROMISES.map((p) => (
                    <li key={p.title} className="flex items-start gap-3">
                      <CheckDot />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[15px] font-bold">{p.title}</span>
                        <span className="text-[13px] leading-[1.45] font-semibold text-ink-3">{p.sub}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Fieldset>

              <div className="flex flex-wrap gap-2.5">
                <Button type="submit" className="h-14 rounded-full px-7 text-[17px] font-bold">
                  Submit for review
                </Button>
                <ButtonLink href={marketHref({ view: 'sell' })} variant="tertiary" className="h-14 rounded-full px-6 text-[16px] font-bold">
                  Cancel
                </ButtonLink>
              </div>
            </Form>

            <section aria-label="How buyers will see it" className="flex min-w-0 flex-[1_1_300px] flex-col gap-3.5 min-[1180px]:sticky min-[1180px]:top-6">
              <h2 className="m-0 text-[19px] font-bold">How buyers will see it</h2>
              <Card className="gap-3 rounded-[24px] bg-surface p-[18px] shadow-[inset_0_0_0_1px_var(--color-inset)]">
                <div className="flex items-center justify-between gap-2.5">
                  <span
                    aria-hidden
                    className={cn(
                      'flex size-12 shrink-0 items-center justify-center',
                      expert ? 'rounded-full bg-person text-person-foreground' : 'rounded-[14px] bg-accent-soft text-accent',
                    )}
                  >
                    <Icon name="tag" size={22} />
                  </span>
                  <KindChip>{KIND_LABEL[chosen.kind]}</KindChip>
                </div>
                <div className="flex flex-col gap-[3px]">
                  <h3 className="m-0 text-[17px] font-bold [overflow-wrap:anywhere]">{name.trim() || 'Untitled listing'}</h3>
                  <span className="text-[13px] font-semibold text-muted">by {COMPANY.name}</span>
                </div>
                <p className="m-0 text-[14px] leading-[1.45] font-semibold text-ink-3 [overflow-wrap:anywhere]">{pitch}</p>
                <div className="flex items-center justify-between gap-2.5">
                  <Chip className="h-6 rounded-full bg-accent-soft px-[9px] py-0 text-[12px] leading-none font-bold text-accent">New</Chip>
                  <span className="font-mono text-[15px] font-semibold tabular-nums">{label}</span>
                </div>
              </Card>
              <p className="m-0 text-[13px] leading-normal font-semibold text-muted">
                Buyers also see what it reads, drafts and does, taken from how it runs at {COMPANY.name} today.
              </p>
            </section>
          </div>
        </>
      )}
    </WebPage>
  );
}
