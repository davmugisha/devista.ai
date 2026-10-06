# Redesign handoff

Branch `redesign/operations-audit`. Not merged, pushed or deployed: those are your calls.

## What changed, and why

| Before | After | Why it matters to this buyer |
|---|---|---|
| The booking form showed "Confirmed" and sent nothing. Slots came from a formula, not a calendar | The form validates on the client and the server, sends each lead to your inbox through Resend, and confirms only when Resend accepts it. A failed delivery shows an error and keeps the answers | No lead can be lost silently. Every booking reaches a person |
| "Run a bigger business without a bigger payroll", pitched at small-business owners | "Your systems work. The work between them doesn't.", written for CEOs, COOs and CFOs of established companies | No headcount pitch. It names the gaps between systems they already run |
| Invented figures (44 agents, 10/30/60%, 318 tasks, a $274,560 calculator), a 16-logo integration strip, bracketed placeholders, dead Privacy and Terms links | No statistic, logo, certification or price anywhere. A claims gate checks every page. Illustrations carry an "example data" caption | A skeptical referral visitor finds nothing to disprove |
| A 15-minute call promising three documents in 48 hours | A free operations audit: intro call, two working sessions, readout, about two weeks, one department, named deliverables | Concrete and credible for a company-wide decision |
| One 12,000 px page, "Solution" and "How To" navigation, no Security or Company page | Product, How it works, Security and Company pages, plus `/book`, Privacy and Terms. The homepage answers one buyer question per section | The IT lead and the skeptic each have a page to go to |
| Stock photos in the hero and throughout | HTML renderings of the product with example data: command center, approvals queue, department view, agent permissions and audit trail. Also a systems-and-handoffs diagram and previews of the audit deliverables. Only the product tour keeps a labelled 16:9 frame | Shows the product, not people high-fiving |
| Desktop and phone layouts both sent to every visitor, all client-rendered, 492 KB JPEGs | One responsive, server-rendered layout. JavaScript only for the menu, the form and the workflow interactive, which loads as it nears the viewport | Homepage LCP down from 6.8 s (see scores) |
| At 768 px, the phone layout stretched across a tablet screen | Fluid layout checked at 375, 768, 1280 and 1440 | iPads look designed |
| No description, canonical URL, Open Graph image, sitemap or robots rules | All of those on every page, plus Organization structured data. Previews are noindexed on Vercel | Shared links show a proper preview |
| Five names for one action ("Book Free Call", "Book call", "Book a free audit") | "Book an operations audit" everywhere | The visitor always knows what the button does |

**The signature moment** is "People command. AI executes. Every step has an owner." You pick Finance, Sales, Operations or Support and see one example workflow step by step. Each step says who does it: a person, AI-assisted work, or an agent under your rules. It also shows where the approval gate sits and what escalates, and to whom. It works fully by keyboard and is readable on a phone.

**The visual pass.** After review, the first build read as text-heavy and wireframe-like. Lists and grey frames stood in for the product. The pages now show the product instead:

- **Home, problem:** a diagram of five everyday systems (CRM, ERP, accounting, help desk, spreadsheets). "Today", people carry the work across each gap. "With Devista", agents carry it and people approve.
- **Home and `/product`:** the approvals queue (why an agent stopped, what happens next, Approve and Send back) and a department view (workflows, owners, people and agents).
- **Home and `/security`:** one dark band for control. It shows an agent's written permissions (can do, needs approval, never allowed) beside the audit trail.
- **Home and `/book`:** the audit deliverables as documents (workflow map, tool review, work allocation) rather than bullet points.
- **Home and `/how-it-works`:** the six stages as a numbered path, then the order in which departments follow.

Every rendering is labelled "example data". Departments and agents appear only as examples, as agreed at Checkpoint 1. The renderings are one shared `Window` frame (`components/screens/`), built from tokens, so they stay sharp at any size and cost almost nothing to load.

## Screenshots

- Before: `redesign/before/` (full pages at the four widths) and `redesign/before/regions/` (the areas the audit cites).
- After: `redesign/after/` (every page at the four widths).
- Interaction states: `redesign/states/`. These cover validation errors, inline error, loading, failed delivery, confirmation, mobile menu, hover, keyboard focus, highlight filter, FAQ open, placeholder frames and 404.

Key pages, before and after:

| Page | Before | After |
|---|---|---|
| Home, desktop | `before/home-1440-part1.png` to `part3` | `after/home-1440-part1.png` to `part3` |
| Home, phone | `before/home-375-part1.png` to `part4` | `after/home-375-part1.png` to `part4` |
| Home, tablet | `before/home-768-part1.png` to `part4` | `after/home-768-part1.png` to `part3` |
| Booking, desktop | `before/book-1440.png` | `after/book-1440.png` |
| Booking, phone | `before/book-375.png` | `after/book-375.png` |

All captures are at 2x. Long pages are split into 4,000 px tiles (`-partN`), because Chrome cannot capture more than 16,384 device pixels in one image.

## Scores

Lighthouse 12, mobile, on a local production build. Figures are the median of three runs; any run taken while the machine was busy (CPU benchmark under 600) was repeated.

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Home, before | 61 | 100 | 100 | 91 | 6.8 s | 0 | 440 ms |
| Booking, before | 90 | 100 | 100 | 91 | 2.6 s | 0 | 230 ms |
| Home | 87 | 100 | 100 | 100 | 2.9 s | 0 | 340 ms |
| Product | 93 | 100 | 100 | 100 | 2.5 s | 0 | 190 ms |
| How it works | 93 | 100 | 100 | 100 | 2.5 s | 0 | 170 ms |
| Security | 91 | 100 | 100 | 100 | 2.6 s | 0 | 230 ms |
| Company | 93 | 100 | 100 | 100 | 2.6 s | 0 | 220 ms |
| Booking | 94 | 100 | 100 | 100 | 2.4 s | 0 | 180 ms |
| Privacy | 94 | 100 | 100 | 100 | 2.4 s | 0 | 210 ms |
| Terms | 95 | 100 | 100 | 100 | 2.4 s | 0 | 190 ms |

Final run on the committed code (`c759edc`), with the machine's CPU benchmark between 888 and 1,331. The per-run figures are in `redesign/after/lighthouse.json`.

axe-core (WCAG 2.2 A and AA plus best practice) found zero serious or critical issues on all eight pages at 375 and 1280.

**Seven of eight pages meet every target: performance 90 or more, accessibility 95, best practices 95, SEO 100. The homepage misses performance at 87** (runs of 85, 87 and 87). What that means:

- **Content is fast.** LCP is 2.4 to 2.9 s, against 6.8 s before, and nothing shifts (CLS 0 everywhere; it was 0.037 on Booking).
- **The homepage carries the most script time.** Its TBT is 340 ms against about 200 ms on the other pages. It is the longest page, so it has the largest document to parse and the most elements for React to hydrate.
- **This machine measures inconsistently.** Earlier runs, taken while the machine was busy (CPU benchmark 680 to 870), put every page 5 to 15 points lower. Confirm the final figures with PageSpeed Insights on the deployed site or a preview deployment.

Performance work already done:
- one server-rendered layout instead of two
- no photographs
- the workflow interactive loads as it nears the viewport
- below-the-fold homepage sections skip layout until needed
- only the booking link prefetches
- only the Latin font file is preloaded
- a width-matched fallback font for headings, so they don't shift

The next lever is fewer client components per page. The mobile menu, header button and click tracker could become one small script.


## Placeholders waiting on a real asset or fact

| Where | What it needs |
|---|---|
| `/product` "Product tour." | Product tour video (16:9). When it exists, pass `src` to the `MediaFrame` there and rename the secondary action to "Watch the product tour" in `lib/site.ts` |
| Command center (`components/home/CommandCenter.tsx`), approvals queue, department view and agent permissions (`components/screens/`), audit trail (`components/ActivityLog.tsx`) | HTML illustrations with example data. Check each against the real product: labels, states and actions should match what a customer will see |
| `/company` "Who you will work with" | Team profiles, location, contact, legal entity |
| Footer | Contact email, legal entity and registered address (removed until supplied) |
| `/privacy`, `/terms` | Drafts marked as awaiting legal review. They need your entity and contact details, and a lawyer's read, before launch |

If you would rather show real screenshots, put the image in `public/product/` and replace the rendering with a `MediaFrame` that has `src="/product/<file>"` and `alt`. Keep the renderings wherever the real screen holds customer data.

## Open decisions

1. **Before launch: lead delivery.** Set up Resend with a verified sending domain, then add `RESEND_API_KEY`, `LEAD_FROM_EMAIL` (for example audits@devista.ai) and `LEAD_TO_EMAIL` to the host's environment. Until then the form shows its failure message: it never pretends.
2. **Claims table.** `CHECKPOINT-1.md` section 5 is still unmarked. The Security page now lists the questions answered in writing, not practices. Once you confirm hosting, encryption, SSO, retention or named integrations, they can be stated there.
3. **Audit format.** The drafted format (30-minute intro, two 90-minute sessions, 60-minute readout, about two weeks) is on the site. Confirm it or adjust it in `lib/content.ts`.
4. **Commitments in the copy.** Confirm these three:
   - "We reply within one working day."
   - "No access to your systems is needed" for the audit.
   - The FAQ promise that the proposal sets out in writing what you own and how your data is handled if you leave.
5. **Analytics.** Vercel Web Analytics loads only when hosted on Vercel. The custom events (`cta_click`, `form_start`, `form_submit`, `form_error`) need a Vercel plan that includes custom events.
6. **Site URL.** Canonical URLs, the sitemap and Open Graph links use `https://devista.ai`. Set `NEXT_PUBLIC_SITE_URL` if production lives elsewhere.
7. **Archive.** The generated v2 artboards, the canvas-era booking page and the stock photos are in `.unlazy/retired-2026-09-29/` (gitignored). Tell me if and when to delete them.

## What I would do next

1. Check the renderings against the real product, and record the tour video. Seeing the product is the strongest proof the site can offer.
2. After deploying, measure with PageSpeed Insights on the real host. Local Lighthouse on this machine runs on a slow CPU (benchmark index about 1,000 against the roughly 1,500 or more it calibrates for) and varies by up to 14 points between runs.
3. Mark the claims table, then give the Security page concrete answers for the IT lead.
4. Send the requester an automatic acknowledgement email from the same Resend setup.
5. Add bot protection such as Cloudflare Turnstile if spam appears. The hidden honeypot field is the only guard today.
6. Render the Open Graph images in Instrument Sans (they use the default font now).

## How the work was verified

The gate checks live in `.unlazy/redesign-2026-09-29/checks/` (local, gitignored). Each runs against a production build (`next build` then `next start`):

- **`render`:** no horizontal scroll or element wider than the viewport, exactly one `h1` and one `main`, no console errors, and the header call to action visible, on every page at four widths.
- **`copy`:** no em dashes, banned words, arrows, bracketed placeholders or Title Case labels.
- **`claims`:** no certifications, security specifics, named integrations, percentages, prices, customer proof or headcount pitch.
- **`axe-gate`:** zero serious or critical WCAG 2.2 AA issues at 375 and 1280.
- **`seo`:** unique title and description, canonical URL, Open Graph image returning a PNG, JSON-LD, sitemap, and robots rules that allow indexing.
- **`interactive`:** tabs, Home, End and the highlight toggles work by keyboard at 375 and 1280.
- **`flow`:** the booking flow runs against a mock Resend. It checks the empty-submit summary, inline errors, the loading state, a failed delivery that must not confirm, and a successful delivery whose email contains every field.
- **`lead-unit`:** server validation of each field, and a delivery with no configuration must fail.
- **`tokens`:** no raw colour or size outside the token files.
- **`spacing`:** every spacing class exists in the token scale. With Tailwind's defaults cleared, an undefined one such as `mt-14` is silently dropped.
- **`lighthouse`:** mobile, median of three runs per page.
