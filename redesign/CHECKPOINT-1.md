# Checkpoint 1: decisions for the owner

Everything here is a proposal. Nothing is built until you answer.

## 0. Two things in the brief that do not match the repo

- **Name.** The brief says "Automation AI". The repo, domain, logo and every page say **Devista AI** (devista.ai, operated by David LLC). I assume "Automation AI" is a placeholder name in the brief and will keep Devista AI unless you say otherwise.
- **How the site is built.** Today's pages are generated from a design canvas by a script in the gitignored `.unlazy/` folder (audit finding 15). The redesign needs hand-written, token-driven components, so the generated `app/_v2/` files would move to `.unlazy/retired-2026-09-29/` (archived, not deleted), and the canvas stops being the source of truth. The two routes `/` and `/book` keep their URLs.

## 1. Sitemap and homepage order

| Route | Purpose | Primary action |
|---|---|---|
| `/` | Homepage, nine sections below | Book an operations audit |
| `/product` | Command center, departments, AI workforce, approvals, in depth | Book an operations audit |
| `/how-it-works` | Discover, Diagnose, Architect, Build, Deploy, Operate; how pricing works | Book an operations audit |
| `/security` | Control model, data ownership, security practices you confirm | Book an operations audit |
| `/company` | Who is behind Devista, contact, legal entity | Book an operations audit |
| `/book` | Full audit offer and the booking form | Submit the form |
| `/privacy`, `/terms` | Legal pages (footer only) | none |

Homepage: 1 hero, 2 the problem, 3 the idea (signature interactive), 4 the product, 5 control and security, 6 how it works, 7 the audit, 8 FAQ, 9 closing call to action.

Deviations from the brief's spine, one line each:

- `/book` keeps its current URL instead of a new one, so existing shared links keep working.
- `/privacy` and `/terms` are added because the booking form collects personal data and the footer needs them; their text needs your legal details (see section 6).
- No pricing page, as the brief says; "how pricing works" lives on `/how-it-works` and in the FAQ.
- The secondary action is "See the product" (to `/product`) until the demo video exists, then it becomes "Watch the product tour".

## 2. Hero headline and subhead

1. **Your systems work. The work between them doesn't.**
   Devista connects the tools, teams and data you already run into one operating layer, where AI agents handle the handoffs and your people approve what matters.
2. **Run the whole company from one controlled view.**
   Devista is a business operating system that sits over your existing systems: people set direction and approve, AI agents carry out the work between tools, and every step is recorded.
3. **Approvals, handoffs and reporting, handled in one place.**
   Devista links every department's tools into one operating layer and assigns each task to a person, an AI assistant or an agent working under your rules.

**Pick: 1.** It names the exact situation of a company that already has systems, without implying it has none, and it sets up the problem section directly. Option 2 is the fallback if you want the outcome stated first.

## 3. Design plan (after self-review)

**Light, and why.** The buyer reads this on a laptop during the working day, often beside documents and dashboards, and is judging whether we are financial-grade and transparent. A clean white page with precise product visuals reads as an instrument, not a pitch. Dark would read as developer tooling, which audit finding 6 already flags as the wrong signal.

**Colour (all as CSS variables)**

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0F1720` | Headings, body text, product chrome |
| `--graphite` | `#4B5563` | Secondary text (7.6:1 on white) |
| `--paper` | `#FFFFFF` | Page background |
| `--mist` | `#F2F4F7` | Alternate section and product-frame surface (cool grey, not cream) |
| `--rule` | `#D9DEE5` | Dividers only (decorative). Input and control borders use a derived `--rule-strong` at 3:1 or better |
| `--signal` | `#0B6649` | The one accent: primary buttons, focus ring, selected and approved states (6.9:1 on white) |

Functional, used only for state: `--alert #B42318` (errors), `--hold #8A5A00` (waiting for approval, escalated). The existing bright emerald `#10B981` stays in the logo mark only.

**Type.** One family: **Instrument Sans** (variable, with a width axis), self-hosted through `next/font`. Display sizes use the semi-condensed width at weight 560 with tight tracking (-0.02em); body is normal width at 400, line height 1.55; UI labels 500. Tabular figures for any number in product renderings.

**Type scale (rem):** 0.8125, 0.875, 1, 1.125, 1.25, 1.5, 2, 2.5, 3.25, 4.25 (the top three fluid with `clamp`). Body measure capped at 68ch.

**Spacing scale (px):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Section padding 96 desktop, 64 mobile.

**Radius and elevation.** Controls and inputs 6px; product frames and media 10px; status chips 4px; no pill buttons. Flat by default, with 1px `--rule` borders instead of shadows. One shadow token, for floating things only (mobile menu, the product frame in the hero).

**Motion.** One orchestrated moment on first load: in the hero's command-center rendering, three queued items resolve in order (routed, drafted, waiting for approval) over about 1.2 s. After that, motion only answers the visitor: steps expanding in the interactive, FAQ opening, the form submitting and confirming, 150 to 250 ms, ease-out. `prefers-reduced-motion` shows the final state with no movement.

**Signature interactive: "Who does each step".** Tabs for four departments (Finance: supplier invoice approval; Sales: new customer onboarding; Operations: purchase requests; Support: ticket triage). Each workflow shows five to seven steps in a vertical track. Each step shows who does it: **Person** (solid square), **AI-assisted** (half-filled square), **Agent under rules** (outlined square). Approval gates sit between steps as a marked line with the approver's role; escalation rules appear on the step they apply to ("Over the approval limit: goes to the finance lead"). Labelled "Example workflow". Arrow keys move between tabs, every step is readable without hover, and on a phone it is one column.

**Homepage wireframe (1280)**

```
+--------------------------------------------------------------------------+
| [D] Devista   Product  How it works  Security  Company  [Book an ops audit]|
+--------------------------------------------------------------------------+
| Your systems work.                     +-------------------------------+ |
| The work between them doesn't.         | Command center                | |
| One sentence: what the OS is.          | Approvals (3) | Status | Alerts| |
| [Book an operations audit] See the product | invoice 4471  waiting: CFO  | |
|                                        | onboarding    agent running   | |
|                                        | weekly report ready to review | |
|                                        +-------------------------------+ |
+--------------------------------------------------------------------------+
| THE PROBLEM   Four specific gaps: re-keying, approvals in chat,          |
|               reports built by hand, nobody sees the whole picture.      |
|               Drawn as a simple diagram of tools with people in between. |
+--------------------------------------------------------------------------+
| THE IDEA      Human command, AI execution.                               |
|  [Finance][Sales][Operations][Support]                                   |
|  step 1 ■ person ... step 2 ◧ AI-assisted ... ── approval: CFO ──        |
|  step 3 □ agent under rules ... escalates if over limit                  |
+--------------------------------------------------------------------------+
| THE PRODUCT   Command center | Departments | AI workforce | Approvals    |
|               tabbed product frames at 16:10, labelled placeholders      |
+--------------------------------------------------------------------------+
| CONTROL       Approvals, permissions, policies, audit trail, escalation, |
|               data ownership. Plain list with a small activity-log frame.|
+--------------------------------------------------------------------------+
| HOW IT WORKS  1 Discover 2 Diagnose 3 Architect 4 Build 5 Deploy 6 Operate|
|               start with one department, then expand                     |
+--------------------------------------------------------------------------+
| THE AUDIT     What happens, who attends, how long, what you keep, cost   |
|               [Book an operations audit]                                 |
+--------------------------------------------------------------------------+
| FAQ           eight objections, disclosure list                          |
+--------------------------------------------------------------------------+
| CLOSE         One line, one button                                       |
| FOOTER        pages, legal, contact, entity                              |
+--------------------------------------------------------------------------+
```

**Self-review: what read as a default, and what changed**

- Geist on white with an emerald accent is today's site and the stock Vercel-starter look. Replaced with Instrument Sans (width axis for a condensed, engineered display) and a deep ledger green used only for action.
- My first draft colour-coded the three work modes (black, amber, green). That is three accents and a traffic-light cliché. Replaced with shape encoding (solid, half, outline) in ink, so the one accent stays reserved for actions and approvals.
- First draft had a dark stats band for contrast. Removed: it needs numbers we do not have, and a dark block is the "near-black with one accent" default.
- First draft used 24px radii on every frame. Replaced with three radii by role and no pills.
- First draft had a small caps label above each section title. Removed: section titles carry the question in sentence case; no eyebrows.
- First draft animated each section in on scroll. Removed: one load moment only.

## 4. Drafted audit offer (not in the inputs)

- **Name:** Operations audit.
- **Format:** a 30-minute introductory call to confirm fit and choose one department or workflow; then two working sessions (about 90 minutes each, remote) with the people who run it; then a 60-minute readout.
- **Duration:** about two weeks from introductory call to readout.
- **Who attends:** an executive sponsor (CEO, COO or CFO), the head of the department in scope, and one or two people who do the work every day. The IT lead is welcome for the integration questions. No system access is needed; we work from walkthroughs and a list of the tools in use.
- **What the company keeps:** a map of the workflows in scope, showing every handoff and every tool; a tool-stack review (what connects, what is duplicated, what is inadequate); each step assigned to human-led, AI-assisted or autonomous, with the reasoning; approval and escalation points; and a scoped first implementation with timeline and fee.
- **Cost:** free, with no obligation (my recommendation while Devista is building its first references). Alternative: a fixed fee credited against the implementation.
- **What happens next:** you decide whether to go ahead with the scoped implementation. If you do not, the documents are yours.

## 5. Every product and security claim, for you to mark

I will only publish what you mark **live**. Anything marked **coming soon** is labelled so or omitted. Everything is **unknown** until you answer.

| Claim | Where it would appear | Status |
|---|---|---|
| Command center: goals, tasks, approvals, alerts, status, reports | Hero, Product | unknown |
| Department modules: operations, sales, marketing, finance, support, projects | Product, interactive | unknown |
| Modules: engineering, software development, design, knowledge, documents, communications, analytics | Product | unknown |
| Modules: HR, legal | Product (as coming soon) | coming soon (per brief) |
| Agents: research, sales, support, marketing, finance, reporting, operations, document, knowledge | Product | unknown |
| Agents: developer, QA | Product | unknown |
| Approvals before an agent acts on defined actions | Everywhere | unknown |
| Role-based permissions per person and per agent | Security | unknown |
| Policies (rules agents must follow) | Security, interactive | unknown |
| Escalation to a named human on exceptions or limits | Interactive, Security | unknown |
| Full audit trail of every agent and human action | Security | unknown |
| Spend limit per department (on today's site) | Product | unknown, not in the product definition, dropped unless you confirm |
| Continuous optimization: bottlenecks, unused software, failing workflows, agent performance | Product | unknown |
| Works with existing tools, no rip-and-replace | Everywhere | live (per brief) |
| Named integrations (HubSpot, QuickBooks, Xero, Stripe, Gmail, Google Drive, Slack, Microsoft 365, Salesforce and others) | Product | unknown; no logos shown until you list confirmed ones |
| Customer owns its data and configuration; exportable | Security | unknown |
| Access can be revoked at any time | Security | unknown |
| Customer data is not used to train AI models | Security | unknown |
| Encryption in transit and at rest | Security | unknown |
| Hosting provider and region(s) | Security | unknown |
| Single sign-on | Security | unknown |
| Data retention and deletion on request | Security | unknown |
| Deployment options (our cloud, customer cloud, on-premises) | Security | unknown |
| Any certification (SOC 2, ISO 27001) | nowhere unless held | unknown; nothing shown |
| Demo video or product tour | Hero secondary action | coming soon (per brief) |

## 6. Blocked on you

- **Lead destination (hard blocker for launch).** The form will post to a server route. It needs somewhere real to deliver: an email inbox (needs an email-sending account such as Resend and its API key), a CRM form endpoint (HubSpot, Pipedrive and others), or a webhook (Zapier, Make, n8n). Until you choose, I will build the form against the route and make it refuse to show "confirmed" unless delivery succeeds, so no lead can be silently lost.
- **Scheduler.** If you have a real booking calendar (Cal.com, Calendly, LeadConnector), I will show it after submission. If not, the confirmation says you will email times within one working day, which is what I will write unless you say otherwise.
- **Analytics.** Nothing is installed. Recommendation: Plausible or Vercel Web Analytics (no cookies, so no consent banner), with events for CTA clicks, form start and form submit through one `track()` helper. I will build the helper and the events, and install nothing until you choose.
- **Company page.** Founder name and role (David Mugisha, founder, per today's site?), team, location, contact email, legal entity (David LLC?) and registered address.
- **Legal pages.** I can draft a plain privacy notice covering what the form collects; it needs your entity and contact details and your own legal review before launch.
- **Assets.** Product screens and the demo video when ready. Until then, labelled frames at 16:10.
- **Retiring the generated site.** Archiving `app/_v2/` and the stock photos in `public/img/` to `.unlazy/retired-2026-09-29/` (not deleting).
