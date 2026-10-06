@AGENTS.md

## Marketing site rules

This repo is the Devista AI marketing site (Next.js 16 App Router, Tailwind 4). Its one job is booked operations audits. `redesign/HANDOFF.md` explains how it got here. The current visual direction, supplied on 2026-09-30, is a bright white and cyan hero with layered product visuals. An older light build is archived in `.unlazy/retired-2026-09-30/`.

### Tokens

- All colours, type sizes, radii, shadows, widths and easing live in the `@theme` block of `app/globals.css`. The Tailwind defaults are cleared (`--*: initial`), so only token utilities exist: `text-ink`, `bg-mist`, `rounded-frame`, `max-w-measure`. Spacing is any multiple of 4px (`--spacing: 0.25rem`).
- The site is light with a soft cyan hero. Colour names are roles: `paper` is the page, `mist` a white raised surface, `panel` a pale cyan surface inside a surface, `rule` a hairline, `rule-strong` a form-control border, `ink` / `graphite` / `slate` the three text levels.
- One accent, `signal` (deep cyan), for focus, selected and approved states, always with `text-on-signal` where it fills a control. Primary calls to action use dark `ink`. Use `signal-bright` for accent text and icons on light. `glow`, `glow-cyan` and `glow-deep` are light sources for decoration only, never text. `alert` is for errors and `hold` for waiting or escalated states.
- No hex, `rgb()`, or arbitrary `[12px]` values outside `app/globals.css` and `lib/tokens.ts`. `lib/tokens.ts` mirrors the colours for places CSS can't reach (Open Graph images in `lib/og.tsx`, `themeColor`). Change both together.
- Type: Instrument Sans only (through `next/font`), normal width. Headings use `font-display` and `tracking-display`. Body copy stays within `max-w-measure` (68ch).
- Radii by role: `rounded-chip` for tags, `rounded-control` for inputs, `rounded-window` for product windows, `rounded-frame` for cards, `rounded-card` for the hero window, and `rounded-dot` for CTA pills, dots and small badges.
- Effects are classes in `app/globals.css`, not one-off utilities: `hero-sky` (white and cyan hero wash), `hero-showcase` (stronger cyan behind the product), `stars` (subtle dots in the closing CTA), `glow-pool`, `card` / `card-lit` / `card-quiet`, `orb`, `sweep`, `flow`, `tilt` and `parallax-near` / `parallax-far` (driven by `HeroStage`).
- Motion: scroll reveals through `data-reveal` (with `delay(ms)` from `components/Section.tsx` to stagger), armed by the inline script in `app/layout.tsx` and run by `RevealObserver`. Content must stay visible without JavaScript. Hero and page intros use `animate-hero` on load. Loops (`animate-float`, `animate-marquee`, typing, auto-cycling diagrams) are decorative. One `prefers-reduced-motion` rule in `globals.css` stops every animation; client components that animate in JavaScript check it themselves.

### Components

- `ButtonLink` / `buttonClass` (`components/Button.tsx`): variants are `primary`, `secondary` and `quiet`. Pass `track="<location>"` on every call to action. Only primary links prefetch.
- Section layout: `Section` (chip, centred h2, one-sentence lede, content) for one buyer question per section; `SectionHead` and `Chip` when a section needs its own layout; `PageIntro` for each inner page's chip, h1 and call to action under the glow; `CtaBand` for the closing glowing card.
- Show the product rather than describe it. Product renderings live in `components/screens/` and use the `Window` frame (`role="img"` with a full `aria-label`, example data, a caption saying so). Interactive examples (`ApprovalsDemo`, `HubDiagram`, `Pricing` toggle, the workflow explorer) use real buttons and say they are examples. `MediaFrame` holds real screenshots and video and shows a labelled placeholder until `src` is set.
- Where a template would show client logos, testimonials, case-study numbers or prices, use the honest replacements already built: `SystemsMarquee` (kinds of system, never vendors), `Commitments` (promises in writing), example workflows, and `Pricing` (free audit, scoped fee, subscription).
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
