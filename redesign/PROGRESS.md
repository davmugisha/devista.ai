# Redesign progress

Branch: `redesign/operations-audit`. Not merged, pushed or deployed.

## Decisions (Checkpoint 1, 2026-09-29)

- **Name and delivery:** the site stays Devista AI, and leads go out by email through Resend.
- **Audit and follow-up:** the audit is free with no obligation. There's no scheduler; we reply within one working day with call times.
- **Analytics:** Vercel Web Analytics.
- **Claims:** the core control model is live (command center, approvals, permissions, policies, escalation, audit trail, works with existing tools). Departments and agents appear only as examples. No integration logos and no security specifics until the claims table in `CHECKPOINT-1.md` is marked.
- **Company details:** these come later, so the Company page ships as a labelled draft.
- **Design:** the plan in `CHECKPOINT-1.md` is approved. The old generated site and stock photos are archived in `.unlazy/retired-2026-09-29/`.

## Done

- **Phase 0, recon:** before screenshots.
- **Phase 1, audit:** `AUDIT.md` (15 findings) and `CHECKPOINT-1.md`.
- **Phase 2, vertical slice:** tokens, header, footer, hero and the workflow interactive. Approved at Checkpoint 2.
- **Phase 3, full build:**
  - every homepage section
  - the Product, How it works, Security, Company, Book, Privacy and Terms pages
  - the booking flow with Resend delivery
  - sitemap, robots rules, Open Graph images and structured data
- **Phase 4, measure:**
  - every page captured at four widths into `redesign/after/`
  - every interaction state captured into `redesign/states/`
  - Lighthouse and axe on every page, and the whole booking flow walked end to end with a mock inbox
  - fixes that came out of it:
    - layout shift on Booking, Product and How it works
    - the interactive now loads lazily
    - only the booking link prefetches
    - only the Latin font file is preloaded
    - a width-matched fallback font for headings
    - the homepage FAQ now covers the brief's eight objections
- **Phase 5, handoff:** `HANDOFF.md` and the "Marketing site rules" section in `CLAUDE.md`.
- **Visual pass (after owner review, 2026-09-29):** the owner found the build text-heavy and "low level" and chose "rich product visuals". Changes:
  - product renderings in one shared `Window` frame: approvals queue, department view, agent permissions
  - a systems-and-handoffs diagram for the problem section
  - the audit deliverables as documents
  - the six stages as a numbered path, with the department order
  - one dark band for control
  - larger section headings and varied layouts (split, stepped, sticky FAQ column)
  - no people on the site until the owner supplies photos
  - a new `spacing` check, after an undefined `mt-14` was silently dropped

## Defaults I caught myself reaching for (kept out of the build)

- **Checkbox-like glyph:** an outlined-square "agent" glyph read as an unchecked checkbox. The glyphs are now a circle, a half-filled circle and a diamond.
- **Truncated text on phones:** product rows ended in ellipses; text now wraps below 640px.
- **Glyphs as separators:** mode glyphs sat inside hero rows before the legend explains them. Removed from the hero.
- **Scroll entrance animations:** kept out; steps animate only when the visitor changes department.
- **"Example" chips:** I nearly put one on every element. There is one caption per illustration instead.
- **Headline breaking mid-thought:** the side-by-side hero broke the headline as "work. The". It now spans the full width.
- **Grids of identical cards:** replaced by the ruled `ItemList` everywhere.
- **Skipping every section below the fold:** that caused layout shift on short inner pages. Now used only on homepage sections well below the fold.
- **Restraint read as emptiness:** the first build removed invented proof and put text lists and grey frames in its place. It was honest, but the page showed nothing. Renderings with example data show the product without claiming anything.
- **Overlapping product windows:** a stepped overlap hid the Approve button. The windows now step without covering each other.
- **The checkbox glyph, again:** an outlined square slipped back into the approvals queue. It is now the amber hold dot.
- **A horizontal diagram at tablet width:** five systems and four handoffs overflowed at 768. The diagram goes horizontal only from 1024.

## Open

- **Performance target:** met on 7 of 8 pages (91 to 95) in the final run. The homepage is at 87 against 90. See `HANDOFF.md`, Scores.
- **Needs the owner:**
  - Resend key and inbox
  - the claims table
  - company details
  - legal review of Privacy and Terms
  - confirming the drafted audit format and the reply-time commitment

## Dark immersive rebuild (2026-09-30)

The owner found the rich-visuals light build still "not great" and asked for a site modelled on xtract.framer.ai. Decisions: dark with a blue glow like Meznt AI, the whole site, and honest replacements wherever the template uses proof we don't have. The light build is archived in `.unlazy/retired-2026-09-30/light-rich-visuals/`.

- **New design system:** dark tokens with one blue accent, a star field, a rotating glow behind headlines, glowing cards and scroll reveals that stay visible without JavaScript. Everything stops under reduced motion.
- **Homepage:**
  - hero with a tilted command center, four floating cards and mouse parallax
  - an endless strip of the kinds of system Devista works across
  - a problem diagram that switches between Today and With Devista
  - four product rows: company overview, a typing agent log, a working approvals queue, agent permissions
  - the workflow explorer, six benefit cards and six stage cards with small animations
  - pricing cards with a "what you get / what you decide" toggle
  - four written commitments in place of testimonials, then the FAQ and a glowing closing card
- **Inner pages:** Product, How it works, Security, Company (About, with a Today / With Devista comparison) and Book (Contact, with info cards and the form in a glowing card) all rebuilt in the same style.
- **Checks passed on every page:** copy rules, no unconfirmed claims, layout at four widths, and no serious or critical accessibility violations.
- **Still needs the owner:** the reversed white logo mark on the dark site (the favicon is still emerald), plus everything listed under Open above.
