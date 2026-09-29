# Site audit, 2026-09-29

Scope: the two live routes, `/` and `/book`, on the production build (`next build`, `next start`), captured at 375, 768, 1280 and 1440 px. Full-page captures are in `redesign/before/` (`home-<width>.png`, `book-<width>.png`, plus extracted text). Close-up regions are in `redesign/before/regions/` and are cited below as `regions/<file>`.

Baseline measurements (Lighthouse 12, mobile emulation, local production server):

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 61 | 100 | 100 | 91 | 6.8 s | 440 ms | 0 |
| `/book` | 90 | 100 | 100 | 91 | 2.6 s | 230 ms | 0 |

axe-core (WCAG 2.2 A/AA plus best practice): `/` clean at 375 and 1280. `/book` has one serious issue (colour contrast, 2 nodes at 1280) and three moderate landmark issues (a `main` nested inside the page's `main`).

Findings are ranked by their effect on booked audits.

### 1. Lead path: every booking and newsletter signup is silently discarded

Area: lead path end to end, interaction states.

Evidence: `regions/book-1440-s00.png`, `regions/book-375-s00.png`; `app/_v2/Book.logic.ts` and `BookMobile.logic.ts`. `schedule()` only sets `step: 3` and shows "Confirmed". No request is sent anywhere. The open slots come from `slotsFor()`, a seeded pattern (`(i * 5 + seed) % 4`), not a calendar, so a visitor can "book" a time nobody holds. The footer newsletter `subscribe()` in `Main.logic.ts` also stores nothing.

Why it costs us: this is the worst outcome the brief names. A COO who books, receives no invite, and hears nothing will not try again, and will tell the person who referred them. The confirmation screen promises an invite that never comes.

Fix: one real destination (form endpoint, CRM, or inbox) chosen by the owner, a server-side handler that validates and forwards the lead, a visible error state if delivery fails, and a confirmation that says what happens next. Offer a real scheduler after submission only if one exists. Remove the newsletter form until it has a destination.

### 2. Positioning sells headcount reduction to a small-business owner, not an operating layer to an established company

Area: messaging.

Evidence: `regions/home-1440-s00.png` (hero), `regions/home-1440-s03.png`. The hero reads "Run a bigger business without a bigger payroll." The how-it-works heading promises "a business that runs without you in every detail". The eyebrow targets "growing businesses", and `PRODUCT.md` scopes the buyer at 10 to 200 people. The product is framed as an agency deliverable ("Devista sets up AI agents") and as a "Co-Pilot OS".

Why it costs us: the brief's buyer is a CEO, COO or CFO at an established multi-department company. "Without a bigger payroll" is a headcount pitch, which the brief rules out and which makes department heads (the people who can block the deal) hostile. "Sets up AI agents" reads as an automation agency, which the product is explicitly not. Nothing in the hero names the real situation: the gaps between systems they already run.

Fix: an outcome headline about running the company from one controlled view, a one-sentence definition of the Business OS, and a problem section written to handoffs, re-keying and hand-built reports. Human command, AI execution as the central idea, never payroll.

### 3. Invented numbers, unconfirmed integrations and visible template placeholders

Area: messaging, visual design, trust.

Evidence: `regions/home-1440-s03.png` ("10 departments", "44 specialist agents ready to deploy", "24/7"); `regions/home-1440-s02.png` ("Tasks done 318", "Hours back 42 h"); the three-tier split "10% / 30% / 60%"; the ROI calculator's "$274,560" yearly figure; `regions/home-1440-s01.png` (a 16-logo tool strip: HubSpot, QuickBooks, Xero, Stripe and others, with no confirmation that any integration is live). Placeholders ship to visitors: "[48 hours]" twice, "[hello@devista.ai]", "[PHONE]", "[Registered business address]" (`regions/home-1440-s13.png`), and `href="[PRIVACY_URL]"`, `[TERMS_URL]`, `[LINKEDIN_URL]`, `[X_URL]`, `[INSTAGRAM_URL]`, `[YOUTUBE_URL]`.

Why it costs us: a skeptical executive arriving from a referral is checking for exactly this. One unsupported number or a third-party logo that turns out not to integrate discredits every true claim beside it and carries legal risk. Bracketed placeholders and dead Privacy and Terms links read as an unfinished vendor, which feeds the "young vendor disappearing" fear directly.

Fix: remove every statistic and percentage that is not measured; show tool logos only for integrations the owner confirms live; label illustrative figures as examples; real legal pages and contact details, or omit the element until they exist.

### 4. The audit offer is too thin and internally inconsistent for this buyer

Area: messaging, lead path.

Evidence: `regions/home-1440-s00.png` ("15 minutes, free, no obligation to buy"), `regions/home-1440-s12.png` (the 0 to 5, 5 to 10, 10 to 15 minute agenda), `regions/book-1440-s00.png` ("In writing within [48 hours]": Workflow Cost Audit, Prioritized AI Roadmap, AI OS Architecture).

Why it costs us: a 15-minute call cannot credibly produce a costed audit of every workflow plus an architecture diagram in 48 hours, and an executive will notice. A company-wide operating system decision needs an offer that looks like real diagnostic work: who attends, what gets examined, and what the company keeps.

Fix: a scoped operations audit with a stated format, duration, attendees, deliverables and next step (drafted for Checkpoint 1), plus a short intro call as its first step.

### 5. Stock photography where the product should be

Area: visual design, messaging.

Evidence: `regions/home-1440-s00.png` (hero: a stock photo of a woman high-fiving, with a phone mock-up laid over it), `regions/home-1440-s03.png` and `regions/home-1440-s04.png` (stock team and sticky-note photos), plus `allhands.jpg`, `hands.jpg`, `consult.jpg`.

Why it costs us: stock imagery is the strongest signal of a template site, and it answers none of the buyer's questions. The brief asks for the product as the hero visual. It also drives LCP (see finding 7).

Fix: the hero visual becomes a faithful rendering of the command center (approvals, departments, status), with labeled placeholder frames at real aspect ratios for the product screens the owner will supply. Drop all stock photos.

### 6. Information architecture: one 12,000 px page, ambiguous navigation, no Security or Company page

Area: information architecture.

Evidence: `redesign/before/home-1440.png` is 11,960 px tall at 1440 (15,267 px at 375) with about 16 sections. Navigation is "Product, Solution, How To, Pricing" (`regions/home-1440-s00.png`), all anchors on the same page. "Solution" and "How To" do not say what they contain. There is no page for security, for the company, or for the audit itself beyond the calendar. The department picker lists Software Dev, Engineering and Design first (`regions/home-1440-s06.png`), which points the site toward engineering buyers.

Why it costs us: the IT or security lead, who can block the deal, has nowhere to go. A referral visitor checking who is behind the company finds a founder quote but no company page. Long single pages bury the answers to specific objections.

Fix: the brief's spine. Navigation: Product, How it works, Security, Company, plus the booking button. A homepage that answers one buyer question per section in nine sections, with deeper pages for product, process, security and company, and a booking page that carries the full audit offer.

### 7. Performance: both layouts ship at once, all client-side, with heavy JPEGs

Area: performance, mobile.

Evidence: Lighthouse `/` mobile performance 61, LCP 6.8 s, TBT 440 ms. `app/page.tsx` renders the desktop artboard and the mobile artboard together and hides one with CSS, so every visitor downloads and hydrates both (346 KB of generated TSX and logic in `app/_v2/`). Every artboard is a client component. Images are plain `<img>` JPEGs up to 492 KB with no responsive sizes or modern formats (Lighthouse flags `modern-image-formats`, `offscreen-images`, `render-blocking-resources`, `unused-javascript`, `dom-size`). `/book` renders nothing on the server (`ssr: false`).

Why it costs us: an executive opening a referral link on a phone waits nearly 7 seconds for the main content. The target is under 2.5 s.

Fix: one responsive, server-rendered layout; client JavaScript only for the signature interactive, the FAQ disclosure and the booking form; no hero photograph; any real product screens served through `next/image` in AVIF or WebP with sizes.

### 8. Tablet gets the phone layout stretched to full width

Area: mobile, visual design.

Evidence: `regions/home-768-s00.png`. At 768 px the 375 px artboard stretches: a 728 px wide primary button, a single text column running the full width, and the stock photo filling the screen. The switch to the desktop artboard happens at 1024 px.

Why it costs us: iPad is a common executive reading device, and this is the view that looks least designed.

Fix: fluid, mobile-first layout with intermediate breakpoints; buttons sized to content above phone widths.

### 9. Calls to action have five names for one action

Area: messaging, interaction states.

Evidence: "Book Free Call" (desktop header and footer), "Book call" (mobile header), "Book a free audit" (hero), "Get my exact number" (calculator), "See how it works" with an appended arrow, and "Subscribe".

Why it costs us: the brief requires one name per action so the visitor always knows what the button does. "Book Free Call" undersells the audit, and Title Case breaks the sentence-case rule.

Fix: "Book an operations audit" everywhere as the primary action; one secondary action for the product tour; no arrows on labels.

### 10. SEO: no descriptions, canonical URLs, social previews, sitemap or robots rules

Area: SEO.

Evidence: Lighthouse SEO 91 on both pages (`meta-description` failing). `app/layout.tsx` sets a title only. `/robots.txt` and `/sitemap.xml` return 404. There are no Open Graph images, no canonical URLs and no Organization structured data. Both pages render two `h1` elements in the DOM (desktop and mobile artboards). Crawlers are not blocked anywhere, which is correct for production.

Why it costs us: a referral visitor often searches the company name before opening the link, and a shared link in chat or email shows no preview.

Fix: per-page title and description, canonical URLs from one site URL setting, generated Open Graph images, `sitemap.ts`, `robots.ts` that allows indexing in production and blocks preview environments, and Organization JSON-LD.

### 11. Accessibility gaps concentrated on the booking page

Area: accessibility, interaction states.

Evidence: axe on `/book` at 1280: `color-contrast` (serious, 2 nodes) and `landmark-no-duplicate-main`, `landmark-main-is-top-level`, `landmark-unique` (moderate), because `app/book/page.tsx` wraps the artboard's own `main`. Lighthouse flags `label-content-name-mismatch`. The submit button is disabled by opacity with a "Still needed" sentence rather than field-level errors tied to each input. Dates are formatted with a fixed `en-US` locale.

Why it costs us: an inaccessible form loses leads outright, and a disabled button with no per-field message makes people guess.

Fix: one `main` per page, per-field inline errors linked with `aria-describedby`, an error summary that moves focus on submit, token colours that pass 4.5:1, locale-aware dates.

### 12. Visual design leans on generated-site defaults

Area: visual design.

Evidence: `regions/home-1440-s01.png` (numbered "01, 02, 03" on Audit, Automate and Approve, which is not a sequence), `regions/home-1440-s02.png` (meta text joined with middle dots: "Deals · Deal Desk agent"), `regions/book-1440-s00.png` (tracked all-caps "IN WRITING WITHIN [48 HOURS]"), pill-shaped buttons throughout, "See how it works" with an appended arrow, a logo marquee, the pricing section's numbered "01 to 04" factors, and an emerald plus amber palette used for decoration as well as state.

Why it costs us: each is small, but together they signal a template, and the buyer is judging whether this vendor is serious enough to run their operations.

Fix: a token system with one action accent, squared-off controls, numbering only on the real engagement sequence, and restraint everywhere except the signature interactive.

### 13. Worldwide buyer, US-only assumptions

Area: messaging, lead path.

Evidence: `app/_v2/Book.logic.ts`: time zone list leads with four US zones and defaults to New York when the visitor's zone is not in a nine-item list; `toLocaleDateString('en-US')`; the calculator uses dollars and US-style hourly costs; the booking form has a phone field with no international format.

Why it costs us: an operations lead in Nairobi, Dubai or London sees a form that was not built for them.

Fix: detect the visitor's IANA time zone and show it by name; locale-aware dates; no phone field (the brief allows its omission); no currency on the site outside labelled examples.

### 14. No analytics on the only commercial path

Area: lead path.

Evidence: no analytics package in `package.json` and no tracking calls in `app/`.

Why it costs us: without CTA-click, form-start and submission counts there is no way to tell whether the redesign improves booked audits.

Fix: a thin, vendor-neutral `track()` helper that the chosen tool plugs into, recommended at Checkpoint 1 rather than installed.

### 15. The site is generated from a design canvas outside the repo

Area: maintainability (affects every later change).

Evidence: `app/_v2/*` headers: "Generated by .unlazy/visual-color-2026-09-26/to-next.mjs ... Change the canvas and regenerate rather than editing here." `.unlazy/` is gitignored, so the generator and its source are not in version control. Styles are inline per element, not tokens.

Why it costs us: indirect, but real. Copy fixes need a round trip through a canvas, and the brief's requirement that every colour, size and space come from tokens cannot be met by generated inline styles.

Fix: replace the generated artboards with hand-written, token-driven components in the repo. The generated files move to the dated archive rather than being deleted, subject to the owner's approval at Checkpoint 1.
