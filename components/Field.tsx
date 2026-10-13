import { Check } from 'lucide-react';
import type { ReactNode, Ref } from 'react';

const control =
  'block w-full rounded-control border bg-panel px-4 text-base text-ink transition-colors duration-150 ' +
  'placeholder:text-slate hover:border-graphite focus-visible:border-signal-bright disabled:bg-mist disabled:text-graphite';

export function controlClass(invalid: boolean, extra = '') {
  return `${control} ${invalid ? 'border-alert' : 'border-rule-strong'} ${extra}`;
}

type Props = {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
};

/** Label, optional hint, the control, and an error that says what is wrong and how to fix it. */
export function Field({ id, label, optional, hint, error, children }: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {optional ? <span className="font-normal text-graphite"> (optional)</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-graphite">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">{children}</div>
      <p id={`${id}-error`} className={error ? 'mt-2 flex items-start gap-2 text-sm text-alert' : 'sr-only'} aria-live="polite">
        {error ? (
          <>
            <svg viewBox="0 0 16 16" aria-hidden="true" className="mt-1 size-3 shrink-0 fill-current">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 3.5h1.5v5h-1.5v-5Zm0 6.25h1.5v1.5h-1.5v-1.5Z" />
            </svg>
            <span>{error}</span>
          </>
        ) : null}
      </p>
    </div>
  );
}

export function describedBy(id: string, hint?: boolean) {
  return [hint ? `${id}-hint` : '', `${id}-error`].filter(Boolean).join(' ');
}

/**
 * A `website` field hidden from people and assistive technology. Bots fill it, and the API then
 * answers with a success that does nothing (readForm in lib/api-http.ts).
 */
export function Honeypot({ id, ref }: { id: string; ref?: Ref<HTMLInputElement> }) {
  return (
    <div aria-hidden="true" className="sr-only">
      <label htmlFor={id}>Website</label>
      <input ref={ref} id={id} name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}

/** The tick that opens a form's confirmation. */
export function CheckBadge() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-dot bg-signal-tint" aria-hidden="true">
      <Check className="size-4 text-signal-bright" strokeWidth={2.2} />
    </span>
  );
}

export function Chevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 fill-none stroke-graphite"
      strokeWidth="1.6"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}
