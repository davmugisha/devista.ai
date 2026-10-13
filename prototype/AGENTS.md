<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Saydeed app prototype

A working prototype of the Saydeed app design (`../extracted/saydeed-app`, viewed through its
`preview.html`), rebuilt in Next.js 16 App Router, Tailwind CSS 4 and HeroUI v3. It is a separate
project from the marketing site in the repository root and shares nothing with it. Every name,
number, invoice, listing, seller and rating is example data from the design.

Run it with `npm run dev` (port 3100). `/preview` lays out every screen like the design canvas.

## Stack

- HeroUI v3 open source: `@heroui/react` and `@heroui/styles` 3.2.6, with `react-aria` 3.52.1 and
  `react-aria-components` 1.21.1 pinned (3.53.1 shipped broken). HeroUI Pro needs a licence and a
  `npx heroui-pro login`; it is not installed. Pro sits on the same packages and theme, so it can be
  added later without restyling.
- No provider is needed for HeroUI. `app/providers.tsx` wires HeroUI links to the Next router, the
  shared store and the toast region.

## Rules

- Colours, shadows and fonts live in `app/globals.css` only: HeroUI's theme variables carry the
  Saydeed palette (`bg-accent`, `bg-accent-soft`, `text-muted`, `bg-surface`, `bg-background`,
  `bg-default`, `text-warning`, `bg-warning-soft`...) plus design roles HeroUI has no name for
  (`text-ink-2`, `text-ink-3`, `bg-inset`, `bg-selected`, `text-accent-deep`, `bg-person`,
  `text-person-foreground`, `bg-track`, `shadow-ring`, `shadow-pop`). No hex, `rgb()`, Tailwind
  default palette (`bg-blue-500`, `text-white`) or arbitrary colour classes anywhere else
  (`lib/tokens.ts` is the one mirror, for the theme-color meta tag). Sizes and spacing may use
  arbitrary values (`text-[15px]`, `h-[46px]`) where the design needs an exact size.
- Every control is a HeroUI component: `Button`, `ToggleButtonGroup` (segmented controls, with the
  `segmented-accent` or `segmented-raised` class and `isDetached fullWidth`), `RadioGroup`,
  `SearchField`, `TextField`/`Input`/`TextArea`, `ComboBox`, `Dropdown`, `Drawer`/`Modal` (sheets),
  `Tabs`, `Chip`, `Meter`/`ProgressBar`, `Avatar`, `Separator`, `ScrollShadow`, `Toast`. No raw
  `<button>`, `<input>`, `<textarea>` or `<select>`. Navigation is Next `<Link>`, styled as a button
  with `ButtonLink` (`components/ui.tsx`) or `RoundLink` (`components/phone/RoundButton.tsx`).
- Icons come from `components/icons.tsx`, copied path for path from the boards. No icon library.
- Facts shared by screens live once in `lib/data.ts`. Routes come from `lib/routes.ts`. Shared
  state (decisions, purchases, listings submitted, messages sent, Work or Code) lives in
  `lib/store.tsx` through `usePrototype()`, so approving on one screen updates every count; local
  `useState` is only for view state (filters, selected tab, wizard step, a plan not yet bought).
- Copy is the design's copy, word for word, including the accessible names (`aria-label`s) on the
  boards. Sentence case, no em dashes. A design `href="#"` becomes a link to the matching "not
  designed yet" section page, never a dead link.
- Web pages render inside `WebShell` (rail and top bar) via `app/(web)/layout.tsx` and use
  `WebPage` for their `<main>`. They work down to 390px wide with no sideways scroll. Phone screens
  render inside `PhoneFrame` via `app/m/layout.tsx` and use `PhoneScreen`; sheets and menus portal
  into the phone, not the window.
- Screen components live in `components/screens/<group>/`; pages in `app/` stay thin.
- `params` and `searchParams` are promises in Next 16 (`await params`). Unknown slugs call
  `notFound()`.
