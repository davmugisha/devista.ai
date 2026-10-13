# Product

<!-- impeccable:product-schema 1 -->

Product facts below come from GOAL.md (written 2026-10-11), the offers the owner confirmed that
day, and the site copy in lib/content.ts. Anything not stated there is not a fact. The visual
direction is the bright white and cyan build described in CLAUDE.md. Confirm or correct any line
marked (inferred).

## Platform

web

## Users

Small agency owners first. Founders and solo operators second. They do repeat work by hand: lead
research, outreach, client reports, proposals. They already run their own tools (email, a CRM,
spreadsheets, chat); the cost is the manual work between those tools. They are not engineers.
They read the page to decide one thing: whether someone they have not met can put working agents
on one of their workflows in a week, with a small risk if it does not fit. Visitors come from all
over the world and arrive cold.

## Product Purpose

Saydeed sells a done for you Agent Team Setup: 3 to 5 AI agents installed on one workflow in 7
days, plus one training call for the buyer's team. The product underneath is Saydeed Work, where
agents do the repeat work and a person approves what matters. Only Work is usable today. Design
and Finance are not sold.

The site has one job: get a visitor to book a free 30 minute call. The call leads to a written
scope and an invoice, and work starts only after payment.

## Positioning

Saydeed does not sell a tool to configure. It installs a small team of agents on one workflow,
shows what they do, and keeps people in charge of the decisions that carry risk. It writes to the
gaps between the systems the buyer already runs: handoffs, re-keying, approvals chased over chat,
reports built by hand. It never pitches cutting staff.

## Operating Context

The engagement runs in four steps: a free call, a written scope and invoice, a 7 day install
(tested on examples from the buyer's own work), and a training call. The 7 days start when the
buyer has paid and the workflow is agreed. Clients keep their existing tools, and agents use them
where they can be connected. One person sends the messages and runs the calls, so the site must
not suggest a large team. The site takes bookings only and never takes payment.

## Capabilities and Constraints

- Offers, all paid upfront, with prices shown on the site: Agent Team Setup, US$1,500 for the first
  3 founding clients and US$3,000 after that; AI Ops Install, US$5,000 setup plus US$1,000 a
  month; custom agent or AI app, US$5,000 to US$15,000 at a fixed price. These are the only
  prices the site may show.
- Controls the product offers: approvals, permissions, rules, escalation and an activity record of
  what people and agents did.
- Booking: a calendar event with a Meet link on the host's Google Calendar. Hours and copy live in
  lib/booking-config.ts.
- A worldwide audience: no US-only formats, and the visitor's time zone is detected and named.

## Brand Commitments

- Name and mark: the name comes from lib/site.ts, never typed by hand. The mark is the slashed S in
  lib/brand.ts, white on a deep cyan tile.
- Colour: a bright canvas, white surfaces, pale cyan panels and fine blue-grey borders. Dark ink
  for primary actions, deep cyan for selected and approved states, amber for waiting or escalated.
  Values live in app/globals.css and lib/tokens.ts.
- Type: Instrument Sans only.
- Voice: plain English, sentence case, specific over clever. The primary action is always "Book a
  free call"; the secondary action is "See the product".

## Evidence on Hand

None yet: no clients, logos, testimonials, case studies, certifications or measured results.
Nothing of that kind may be invented. Past projects appear as portfolio only after the client
agrees in writing. Illustrations are labelled as example data, and a placeholder says so until a
real screenshot or video exists.

## Product Principles

1. One job: book the free call. Say it in the same words everywhere.
2. No invented proof. Use honest placeholders and promises in writing instead.
3. Show prices and the process up front. Every offer is paid upfront, and the scope is written down
   before payment.
4. Show the product (Saydeed Work) in renderings and diagrams rather than describing it, and label
   every example.
5. Never imply the buyer has no systems, and never pitch headcount cuts.

## Accessibility & Inclusion

WCAG 2.2 AA contrast, full keyboard use, reduced-motion support that stops every animation, and
layouts from 360px to 1440px.
