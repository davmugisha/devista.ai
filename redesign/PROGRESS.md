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

## Defaults I caught myself reaching for (kept out of the build)

- **Checkbox-like glyph:** an outlined-square "agent" glyph read as an unchecked checkbox. The glyphs are now a circle, a half-filled circle and a diamond.
- **Truncated text on phones:** product rows ended in ellipses; text now wraps below 640px.
- **Glyphs as separators:** mode glyphs sat inside hero rows before the legend explains them. Removed from the hero.
- **Scroll entrance animations:** kept out; steps animate only when the visitor changes department.
- **"Example" chips:** I nearly put one on every element. There is one caption per illustration instead.
- **Headline breaking mid-thought:** the side-by-side hero broke the headline as "work. The". It now spans the full width.
- **Grids of identical cards:** replaced by the ruled `ItemList` everywhere.
- **Skipping every section below the fold:** that caused layout shift on short inner pages. Now used only on homepage sections well below the fold.

## Open

- **Performance target:** met on 7 of 8 pages (91 to 95) in the final run. The homepage is at 87 against 90. See `HANDOFF.md`, Scores.
- **Needs the owner:**
  - Resend key and inbox
  - the claims table
  - company details
  - legal review of Privacy and Terms
  - confirming the drafted audit format and the reply-time commitment
