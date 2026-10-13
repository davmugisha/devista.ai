# Saydeed app prototype

A working prototype of the Saydeed app design (the canvas in `../extracted/saydeed-app`, viewed
through its `preview.html`), rebuilt as a Next.js app with Tailwind CSS and HeroUI. Every board on
the canvas is a real route, and the screens share one state: approve a decision on the phone and
the web Home, the rail, the Inbox and the Brain Map all change with it.

Every name, number, invoice, listing, seller and rating is example data from the design
("Samuel Shami", "Branshs LLC" and the rest). This app is not deployed and is not linked from
saydeed.com.

## Run it

```sh
npm install
npm run dev        # http://localhost:3100
```

| Open | What you get |
|---|---|
| `/preview` | The design canvas, live: every screen in a frame at its canvas position, or one by one with Screens |
| `/` | The web app (Home, Inbox, Marketplace, Listing, Sell) with the left rail and top bar |
| `/m` | The phone app (Brain Map, Dashboard, Chat, Call, Menu, Inbox, Approval, Create, Marketplace) |
| `/ia` | The information architecture |

The profile menu ("SS") and the canvas header both have "Reset example data", which puts every
decision, purchase and message back as the design shows them.

## Boards and routes

| Board | Route |
|---|---|
| 00 · Information architecture | `/ia` |
| 01 · Brain Map (home) | `/m` |
| 02 · Dashboard | `/m/dashboard` |
| 03 · Let’s Chat · Chief of Staff | `/m/chat` (other conversations: `/m/chat?thread=<key>`) |
| 04 · Interactive Call | `/m/call` |
| 05 · Sidebar (Work, Code) | `/m/menu` |
| 06 · Inbox | `/m/inbox` (`?filter=needs`, `agent`, `human`, `group`, `call`, `alert`) |
| 07 · Approval | `/m/inbox/remind`, `/m/inbox/umoja`, `/m/inbox/portal` |
| 08 · Create | `/m/create` |
| 09 · Marketplace | `/m/marketplace` |
| 10 · Listing | `/m/marketplace/<listing>` (all 8 listings) |
| 11 · Sell what you built | `/m/marketplace/sell` |
| 12 · Web · Home | `/` |
| 13 · Web · Inbox | `/inbox` (`?item=<decision or conversation>`) |
| 14 · Web · Marketplace | `/marketplace` |
| 15 · Web · Listing | `/marketplace/<listing>` |
| 16 · Web · Sell | `/marketplace/sell` |
| Component · Brain orb | `/parts/brain` |
| Component · Web nav rail | `/parts/rail` |
| Component · Web top bar | `/parts/top-bar` |

Menu items the design links to nowhere (Goals, Tasks, Org, Knowledge, Skills, Finance and the Code
sections) open a page that says the section is not designed yet, at `/<section>` and `/m/<section>`.

## Stack

- Next.js 16.3 (App Router, Turbopack), React 19.3, TypeScript.
- Tailwind CSS 4.3. The theme lives in `app/globals.css`: HeroUI's variables carry the Saydeed
  palette, and the design's extra roles are Tailwind tokens (`text-ink-2`, `bg-selected`,
  `bg-person`...). Nothing outside that file (and the `lib/tokens.ts` mirror) holds a colour.
- HeroUI v3 (`@heroui/react` and `@heroui/styles` 3.2.6) for every control, with `react-aria`
  3.52.1 and `react-aria-components` 1.21.1 pinned because 3.53.1 shipped without a file it needs.
- Quicksand and JetBrains Mono through `next/font`. Icons are the design's own SVG paths
  (`components/icons.tsx`).

### HeroUI Pro

Pro is not installed. Its npm package downloads the components only after a licensed sign-in, and
the installer answered "No active license found" on this machine. Pro is built on the same HeroUI
v3 packages and theme variables, so adding it changes no styling:

```sh
npx heroui-pro@latest login     # GitHub sign-in with the licensed account
npx heroui-pro@latest install   # adds @heroui-pro/react and downloads the components
```

Then add `@import "@heroui-pro/react/css";` after `@import "@heroui/styles";` in
`app/globals.css`. The natural swaps: `AppLayout` and `Sidebar` for the web shell and rail
(`components/web/`), `Command` for the top bar search, `Sheet` for the phone sheets and menu,
`KPI` and the chart components for the numbers, `DataGrid` for the seller's listings table.

## Where things are

```
app/(web)/          web pages inside the shell (rail and top bar)
app/m/              phone screens inside the phone frame
app/ia, app/preview, app/parts
components/screens/ each screen group's components
components/web/     WebShell, WebRail, WebTopBar, WebPage
components/phone/   PhoneFrame, PhoneScreen, RoundLink, RoundButton
components/         icons, shared UI pieces, BrainOrb, NotDesigned
lib/data.ts         the example data, each fact once
lib/store.tsx       shared state (usePrototype), kept in sessionStorage
lib/routes.ts       every route
lib/boards.ts       the canvas: board to route, position and size
```

Conventions for anyone changing the app are in `AGENTS.md`.
