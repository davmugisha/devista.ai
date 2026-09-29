@AGENTS.md

## Marketing site rules

This repo is the Devista AI marketing site (Next.js 16 App Router, Tailwind 4). Its one job is booked operations audits. `redesign/HANDOFF.md` explains how it got here.

### Tokens

- All colours, type sizes, spacing, radii, shadows, widths and easing live in the `@theme` block of `app/globals.css`. The Tailwind defaults are cleared (`--*: initial`), so only token utilities exist: `text-ink`, `bg-mist`, `p-6`, `rounded-control`, `max-w-measure`.
- One accent, `signal` (#0B6649), for primary buttons, focus, selected and approved states only. `alert` is for errors and `hold` for waiting or escalated states. `brand-mark` emerald appears only in the logo mark.
- No hex, `rgb()`, or arbitrary `[12px]` values outside `app/globals.css` and `lib/tokens.ts`. `lib/tokens.ts` mirrors the colours for places CSS can't reach (Open Graph images in `lib/og.tsx`, `themeColor`). Change both together.
- Type: Instrument Sans only (through `next/font`). Headings use the semi-condensed width (`wdth` 88), weight `font-display`, `tracking-display`. Body copy stays within `max-w-measure` (68ch).
- Radii by role: `rounded-chip` for tags, `rounded-control` for buttons and inputs, `rounded-frame` for frames. No pill buttons. Borders instead of shadows; `shadow-float` only for things that float.
- Motion: `animate-arrive` (240ms) only in response to what the visitor does, plus the one hero load sequence. Always add `motion-reduce:` fallbacks. No scroll-triggered entrance animations.

### Components

- `ButtonLink` / `buttonClass` (`components/Button.tsx`): variants are `primary`, `secondary` and `quiet`. Pass `track="<location>"` on every call to action. Only primary links prefetch.
- Section layout: `Section` for one buyer question per section (h2, one-sentence lede, content), `PageIntro` for each inner page's h1 and call to action, and `CtaBand` for the closing call to action.
- Content blocks: `ItemList` for ruled lists of titled statements (never a grid of identical cards). `MediaFrame` holds product screens and video at their real aspect ratio and shows a labelled placeholder until `src` is set.
- Forms: `Field` and `controlClass` for inputs. Every input needs a label and an error linked with `aria-describedby`. Validation rules live in `lib/lead.ts` and run on both the client and the server.
- Shared copy (audit offer, stages, FAQ, controls) lives in `lib/content.ts`, and the example workflows in `lib/workflows.ts`. Each fact is stated once there.
- The workflow interactive renders its first state on the server (`ExplorerView`) and takes over on the client (`ExplorerIsland` → `WorkflowExplorer`). Keep the markup shared.
- Analytics go only through `track()` in `lib/analytics.ts` (`cta_click`, `form_start`, `form_submit`, `form_error`).

### Copy

- The primary action is always "Book an operations audit", linking to `/book`, with the same words everywhere. The secondary action is "See the product".
- Sentence case for headings and buttons. No em dashes, no arrows on labels, no "Get started" or "Learn more".
- Never use: revolutionize, unlock, supercharge, seamless, cutting-edge, next-generation, game-changing, leverage, synergy, empower, "transform your business", or "AI-powered" as a badge. Never pitch headcount cuts or "bigger business without a bigger payroll".
- Write to the gaps between systems the buyer already runs (handoffs, re-keying, approvals chased over chat, reports built by hand). Never imply the buyer has no systems.
- No invented proof: no customer logos, testimonials, statistics, percentages, certifications, prices, or named integrations unless the owner has confirmed them in `redesign/CHECKPOINT-1.md`. Illustrations carry an "example data" caption.
- Worldwide audience: no US-only formats, no currency figures, and the visitor's time zone detected and shown by name.

### Lead delivery

- `/book` posts to the server action in `app/book/actions.ts`, which sends the lead through Resend. It needs `RESEND_API_KEY`, `LEAD_TO_EMAIL` and `LEAD_FROM_EMAIL` (on a domain verified in Resend).
- The form shows its confirmation only when Resend accepts the message. Never add a path that confirms without delivering.
