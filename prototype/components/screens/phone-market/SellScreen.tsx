'use client';

// Sell on Marketplace (MarketSell.dc.html): pick something the company already runs, price it
// and name it, check what buyers will see, then submit it for review through the shared store.
// The Marketplace's Sell view lists the submission as "In review" from then on.

import {
  Button,
  Description,
  FieldError,
  Input,
  InputGroup,
  Label,
  ProgressBar,
  Radio,
  RadioGroup,
  TextArea,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  cn,
} from '@heroui/react';
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { Icon } from '@/components/icons';
import { PhoneScreen } from '@/components/phone/PhoneFrame';
import { RoundLink } from '@/components/phone/RoundButton';
import { ButtonLink, Mono } from '@/components/ui';
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
import { phone } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { CheckRow, RADIO_CARD_HIT, SCROLL_Y, Tile } from './shared';

const STEPS = ['pick', 'price', 'check'] as const;
type Step = (typeof STEPS)[number] | 'sent';

/** The form as typed. `null` means "not touched yet": show the chosen thing's own value. */
interface Draft {
  thing: SellableKey;
  model: PriceModel;
  price: string | null;
  name: string | null;
  pitch: string | null;
}

const FIELD_LABEL = 'text-[13px] leading-[normal] font-bold text-ink-3';
const FIELD_BOX = 'rounded-[18px] border-0 bg-surface shadow-[inset_0_0_0_1px_var(--border)]';

export function SellScreen() {
  const { submit } = usePrototype();
  const [step, setStep] = useState<Step>('pick');
  const [draft, setDraft] = useState<Draft>({ thing: 'cash-note', model: 'month', price: null, name: null, pitch: null });
  const [showErrors, setShowErrors] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const priceInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);

  const thing = SELLABLES.find((t) => t.key === draft.thing) ?? SELLABLES[0];
  const price = draft.price ?? thing.price;
  // "12." and "040" are fine while typing; buyers see "12" and "40".
  const shownPrice = price.replace(/\.$/, '').replace(/^0+(?=\d)/, '');
  const name = draft.name ?? thing.title;
  const pitch = draft.pitch ?? thing.pitch;
  const kind = KIND_LABEL[thing.kind];
  const paid = draft.model !== 'free';
  const index = step === 'sent' ? STEPS.length : STEPS.indexOf(step);

  const nameError = name.trim() ? null : 'Give it a name buyers will see.';
  const priceError = paid && !(Number(price) > 0) ? 'Add a price, or choose Free.' : null;

  // Each new step is announced from its heading, but the first one does not steal focus on load.
  useEffect(() => {
    if (moved.current) heading.current?.focus();
  }, [step]);

  const go = (next: Step) => {
    moved.current = true;
    setShowErrors(false);
    setStep(next);
  };

  const pickThing = (key: SellableKey) => {
    const t = SELLABLES.find((s) => s.key === key);
    if (!t) return;
    // A new pick starts from its own name, pitch and price. An expert sells their time once.
    setDraft((d) => ({ thing: t.key, model: t.kind === 'expert' ? 'once' : d.model, price: null, name: null, pitch: null }));
  };

  const next = () => {
    if (step === 'pick') go('price');
    else if (step === 'price') {
      if (nameError || priceError) {
        setShowErrors(true);
        (priceError ? priceInput : nameInput).current?.focus();
        return;
      }
      go('check');
    } else if (step === 'check') {
      submit({ thing: thing.key, name: name.trim(), pitch: pitch.trim(), model: draft.model, price: paid ? shownPrice : '' });
      go('sent');
    }
  };

  // Enter in the price or the name continues, as it would submit a form.
  const continueOnEnter = (e: { key: string }) => {
    if (e.key === 'Enter') next();
  };

  const back = () => {
    if (step === 'price') go('pick');
    else if (step === 'check') go('price');
  };

  return (
    <PhoneScreen label="Sell on Marketplace" className="overflow-hidden pt-[52px] leading-[normal]">
      <header className="flex h-12 shrink-0 items-center gap-3 px-4">
        <RoundLink href={phone.marketplace} label="Close and go back to Marketplace">
          <Icon name="close" size={20} className="size-5" />
        </RoundLink>
        <span className="grow text-[13px] font-bold tracking-[0.08em] text-muted uppercase">Sell on Marketplace</span>
        <Mono className="shrink-0 text-[13px] font-semibold text-ink-3">{step === 'sent' ? 'Done' : `${index + 1} of 3`}</Mono>
      </header>

      <div aria-hidden className="mx-5 mt-3 flex h-1.5 shrink-0 gap-1.5">
        {STEPS.map((s, i) => (
          <ProgressBar key={s} aria-label={`Step ${i + 1}`} value={i <= index ? 100 : 0} className="grow basis-0 gap-0">
            <ProgressBar.Track className="h-1.5 rounded-[3px] bg-inset">
              <ProgressBar.Fill className="rounded-[3px]" />
            </ProgressBar.Track>
          </ProgressBar>
        ))}
      </div>

      <div className={cn('mt-[18px] flex min-h-0 grow flex-col gap-[18px] px-5 pb-5', SCROLL_Y)}>
        {step === 'pick' && (
          <>
            <StepHead ref={heading} title="What do you want to sell?">
              Pick something your company already runs. Buyers get the steps, never your data.
            </StepHead>
            <RadioGroup
              aria-label="Things you built"
              value={draft.thing}
              onChange={(v) => pickThing(v as SellableKey)}
              className="flex flex-col gap-2"
            >
              {SELLABLES.map((t) => (
                <Radio key={t.key} value={t.key} className="m-0 w-full">
                  <Radio.Content
                    className={cn(
                      'group flex min-h-[72px] w-full items-center gap-3 rounded-[20px] leading-[normal] bg-surface px-3.5 py-3 text-foreground shadow-[inset_0_0_0_2px_var(--surface)] transition-[background-color,box-shadow]',
                      'data-[selected=true]:bg-selected data-[selected=true]:shadow-[inset_0_0_0_2px_var(--accent)]',
                      'data-[hovered=true]:bg-row-hover data-[selected=true]:data-[hovered=true]:bg-selected',
                      'data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-focus data-[focus-visible=true]:ring-offset-2 data-[focus-visible=true]:ring-offset-background',
                      RADIO_CARD_HIT,
                    )}
                  >
                    <Tile kind={t.kind} size="size-11" radius="rounded-[14px]" iconSize={22} />
                    <span className="flex min-w-0 grow flex-col gap-[3px]">
                      <span className="text-[15px] font-bold">{t.title}</span>
                      <span className="text-[13px] font-semibold text-ink-3">
                        {KIND_LABEL[t.kind]} · {t.proof}
                      </span>
                    </span>
                    <Radio.Control className="size-6 rounded-full border-2 border-hairline bg-transparent shadow-none group-data-[selected=true]:border-accent group-data-[selected=true]:bg-accent" />
                  </Radio.Content>
                </Radio>
              ))}
            </RadioGroup>
          </>
        )}

        {step === 'price' && (
          <>
            <StepHead ref={heading} title="Price it and name it">
              {thing.title} · {kind}
            </StepHead>

            <ToggleButtonGroup
              aria-label="How buyers pay"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={[draft.model]}
              onSelectionChange={(keys) => {
                const [model] = keys;
                if (model) setDraft((d) => ({ ...d, model: model as PriceModel }));
              }}
              isDetached
              fullWidth
              className="segmented-accent h-[52px] shrink-0 gap-1 p-1"
            >
              {PRICE_MODELS.map((m) => (
                <ToggleButton key={m.key} id={m.key} className="h-11 text-[15px]">
                  {m.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            {paid && (
              <TextField
                value={price}
                onChange={(v) => setDraft((d) => ({ ...d, price: cleanPrice(v) }))}
                isInvalid={showErrors && Boolean(priceError)}
                onKeyDown={continueOnEnter}
                inputMode="decimal"
                autoComplete="off"
                maxLength={9}
                className="shrink-0 gap-1.5 [--danger:var(--warning)]"
              >
                <Label className={FIELD_LABEL}>Price in US dollars{draft.model === 'month' ? ', per month' : ''}</Label>
                <InputGroup className={cn('h-14 gap-1.5 px-[18px]', FIELD_BOX)}>
                  <InputGroup.Prefix className="h-auto border-0 p-0 font-mono text-[18px] text-muted">$</InputGroup.Prefix>
                  <InputGroup.Input ref={priceInput} className="h-11 min-w-0 px-0.5 py-0 font-mono text-[18px] font-semibold text-foreground" />
                </InputGroup>
                <Description className="text-[12px] leading-[normal] font-semibold text-muted">You keep the price minus the marketplace fee.</Description>
                <FieldError className="px-0 text-[12px] leading-[normal] font-bold">{priceError}</FieldError>
              </TextField>
            )}

            <TextField
              value={name}
              onChange={(v) => setDraft((d) => ({ ...d, name: v }))}
              isInvalid={showErrors && Boolean(nameError)}
              onKeyDown={continueOnEnter}
              autoComplete="off"
              maxLength={60}
              className="shrink-0 gap-1.5 [--danger:var(--warning)]"
            >
              <Label className={FIELD_LABEL}>Listing name</Label>
              <Input ref={nameInput} className={cn('h-14 px-[18px] text-[16px] font-semibold', FIELD_BOX)} />
              <FieldError className="px-0 text-[12px] leading-[normal] font-bold">{nameError}</FieldError>
            </TextField>

            <TextField value={pitch} onChange={(v) => setDraft((d) => ({ ...d, pitch: v }))} maxLength={240} className="shrink-0 gap-1.5">
              <Label className={FIELD_LABEL}>What it does, in one or two lines</Label>
              <TextArea rows={3} className={cn('resize-none px-[18px] py-3.5 text-[15px] leading-[1.45] font-semibold', FIELD_BOX)} />
            </TextField>
          </>
        )}

        {step === 'check' && (
          <>
            <StepHead ref={heading} title="Before it goes live">
              This is what buyers will see, and what stays with you.
            </StepHead>
            <div className="flex shrink-0 items-center gap-3 rounded-[22px] bg-surface p-4">
              <Tile kind={thing.kind} size="size-12" radius="rounded-[14px]" iconSize={22} icon="tag" />
              <span className="flex min-w-0 grow flex-col gap-[3px]">
                <span className="truncate text-[16px] font-bold">{name.trim()}</span>
                <span className="text-[13px] font-semibold text-ink-3">
                  {kind} · {COMPANY.name}
                </span>
              </span>
              <Mono className="shrink-0 text-[16px] font-semibold">{priceLabel(draft.model, shownPrice)}</Mono>
            </div>
            <div className="flex shrink-0 flex-col gap-3.5">
              {SELL_PROMISES.map((p) => (
                <CheckRow key={p.title} title={p.title} sub={p.sub} />
              ))}
            </div>
          </>
        )}

        {step === 'sent' && (
          <div className="flex shrink-0 flex-col items-center gap-4 pt-10 text-center">
            <span aria-hidden className="flex size-[88px] items-center justify-center rounded-full bg-selected text-accent">
              <Icon name="check" size={40} strokeWidth={2.5} />
            </span>
            <h1 ref={heading} tabIndex={-1} className="m-0 text-[28px] leading-[1.15] font-bold outline-none">
              Submitted for review
            </h1>
            <p className="m-0 text-[16px] leading-normal font-semibold text-ink-3">
              {name.trim()} goes live once our review is done. You will hear back in Inbox, and Chief of Staff answers the buyer
              questions it can.
            </p>
          </div>
        )}
      </div>

      <div className="relative h-[108px] shrink-0">
        <div className="absolute right-5 bottom-7 left-5 flex h-[60px] gap-2.5">
          {step === 'sent' ? (
            <ButtonLink href={phone.marketplace} className="h-[60px] grow rounded-full text-[17px]">
              Back to Marketplace
            </ButtonLink>
          ) : (
            <>
              {index > 0 && (
                <Button
                  variant="tertiary"
                  onPress={back}
                  className="h-[60px] shrink-0 rounded-full bg-inset px-6 text-[16px] text-foreground hover:bg-track"
                >
                  Back
                </Button>
              )}
              <Button onPress={next} className="h-[60px] grow rounded-full text-[17px]">
                {step === 'check' ? 'Submit for review' : 'Continue'}
              </Button>
            </>
          )}
        </div>
      </div>
    </PhoneScreen>
  );
}

function StepHead({ ref, title, children }: { ref: Ref<HTMLHeadingElement>; title: string; children: ReactNode }) {
  return (
    <div className="flex shrink-0 flex-col gap-1.5">
      <h1 ref={ref} tabIndex={-1} className="m-0 text-[28px] leading-[1.15] font-bold outline-none">
        {title}
      </h1>
      <p className="m-0 text-[15px] leading-[1.45] font-semibold text-ink-3">{children}</p>
    </div>
  );
}
