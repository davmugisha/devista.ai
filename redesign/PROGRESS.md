# Redesign progress

Branch: `redesign/operations-audit`.

## Decisions (Checkpoint 1, 2026-09-29)

- Name: Devista AI. Leads: email through Resend. Audit: free, no obligation. No scheduler: we reply within one working day with times. Analytics: Vercel Web Analytics.
- Claims: the core control model is live (command center, approvals, permissions, policies, escalation, audit trail, works with existing tools). Departments and agents appear only as configurable examples. No integration logos, no security specifics, until the claims table in `CHECKPOINT-1.md` is marked.
- Company details come later; the Company page ships as a labelled draft.
- Design plan approved as written in `CHECKPOINT-1.md`. The generated `app/_v2` homepage and stock photos are archived in `.unlazy/retired-2026-09-29/` (not deleted).

## Done

- Phase 0 and 1: recon, before screenshots, `AUDIT.md` (15 findings), `CHECKPOINT-1.md`.
- Phase 2, vertical slice:
  - Tokens in `app/globals.css` (`@theme` with the Tailwind defaults cleared), mirrored for images in `lib/tokens.ts`.
  - Instrument Sans with its width axis, self-hosted through `next/font`.
  - Header (sticky; the booking button is visible at every width), mobile menu, footer.
  - Hero with an HTML rendering of the command center, labelled as an illustration with example data.
  - The signature interactive: `components/home/WorkflowExplorer.tsx`, with data in `lib/workflows.ts`.
  - The components in use so far are `ButtonLink`, `Section`, `PageIntro`, `ModeGlyph` and `ClickTracker`, with analytics events sent through `lib/analytics.ts`.
  - Starter pages for Product, How it works, Security and Company, so the header links work.
  - Screenshots in `redesign/slice/`.

## Defaults I caught myself reaching for (kept out of the rest of the build)

- **Checkbox-like glyph:** an outlined square for "agent" looked like an unchecked checkbox. The glyphs are now a circle for a person, a half-filled circle for AI-assisted, and a diamond for an agent.
- **Truncated text on phones:** product rows ended in ellipses on phones. Text now wraps below 640px.
- **Glyphs as separators:** mode glyphs sat inside hero rows where the legend isn't shown yet, so they read as separator dots. Removed from the hero.
- **Scroll entrance animations:** I was about to add them to the interactive's steps. Steps only animate when the visitor changes department, and exit animations are not used.
- **"Example" chips:** I nearly put one on every element. There is one caption per illustration instead.
- **Headline breaking mid-thought:** the side-by-side hero broke the headline as "work. The". The headline now spans the full width and breaks at its sentences.

## Next

- Checkpoint 2: owner reviews `redesign/slice/`.
- Phase 3 builds the remaining homepage sections, the Product, How it works, Security and Company pages, the booking page and form, the delivery route to Resend, Privacy and Terms, the sitemap, robots rules and Open Graph images.

## Open questions

- The claims table in `CHECKPOINT-1.md` section 5 (still unmarked).
- Company details: team, location, contact email, legal entity.
- The Resend API key and the inbox address that receives leads.
