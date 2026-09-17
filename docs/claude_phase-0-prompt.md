# Phase 0 Prompt — Fix and Clear

*For Claude Code, in this repo. Written 17 September 2026.*

Phase 0 of `docs/build-spec.md` §10. Mechanical: eight fixes with line numbers, twelve
file deletions, no decisions. It is first because every later phase is easier in a
smaller codebase, and because several of these bugs would otherwise be mistaken for
intentional.

## Before you start

```bash
cd ~/Desktop/color/web/acolorfulhistory.com
git status
git add CLAUDE.md docs/build-spec.md docs/claude_vendure-prompts.md docs/claude_phase-0-prompt.md
git commit -m "docs: build spec, CLAUDE.md, Cursor and Claude Code prompts"
claude
```

Then press **shift+tab** for plan mode before sending the prompt. Phase 0 touches
around eighteen files; plan mode makes it propose an approach you approve rather than
discovering the scope halfway through.

Use **Sonnet** unless you have a reason not to. This work needs no architectural
judgment — the three audits already did that — and the line numbers are supplied.

---

## The prompt

```
Read CLAUDE.md and docs/build-spec.md before doing anything else. You are doing
Phase 0 from §10 of the build spec — only Phase 0.

Create a branch first: phase-0-fix-and-clear

FIXES

1. components/Artwork/ArtworkPage.tsx:38 — remove PREVIEW_ALL_MINI_NAV and make the
   gates at lines 129–132 depend on real data.
2. lib/data.ts getTriptychPanelsForArtwork (~137–148) — fetch at depth 2 to match the
   full mapper it uses, and route through buildSiteSeriesWhereParams instead of
   filtering on the artwork's own series.slug.
3. components/Home/ListCard.tsx:27,53–54 and components/Home/HeroListItem.tsx:106,
   363–364 — remove placeholder="blur" and the 1x1 blurDataURL. Then remove the CSS at
   globals.css:1748–1751 that exists only to suppress the gaussian.
4. lib/heroFields.ts:22,31,60 — remove HERO_FORCE_SLUG and its unreachable branches.
5. components/Home/hero-timeline.ts:70 — remove ENABLE_HERO_UNPAINT_ON_EXIT.
6. components/UI/Nav.tsx:36–38 — remove the three href:'#' entries. The site split
   sends those series to bernardbolter.com and their URLs there aren't settled, so no
   link is better than a dead one. Note in your report that this changes the nav's
   item count.
7. lib/mappers/artworkFromPayload.ts:350 — mapPayloadArtworkForList hardcodes
   forsale: false. Derive it the way the full mapper does.

8. lib/unifiedAvailability.ts — the fallthrough returns 'available' for any
   unrecognised status. DO NOT change it yet. Instead: report every archiveStatus and
   ach.availabilityStatus value that currently reaches that fallthrough, how many
   records hit it, and what they would become under a not-available default. Then
   propose a fix and wait. A commerce site defaulting to available lies about
   inventory, but flipping it blind could show the whole catalogue as sold.

DELETE these twelve dormant files:
  components/hero/HeroSection.tsx, HeroSectionLoader.tsx, HeroCanvas.tsx,
  HeroCopy.tsx, HeroMobileArrow.tsx, hero-states.ts, hero-timeline.ts
  components/Artworks/Artworks.tsx
  components/Artworks/ArtworkList.tsx
  components/UI/Loader.tsx
  components/Pages/LandingPage.tsx
  components/Home/HomeSectionRenderer.tsx

CRITICAL: two files are named hero-timeline.ts. components/hero/hero-timeline.ts is
dead and gets deleted. components/Home/hero-timeline.ts is LIVE — 360 lines, the
working hero choreography, imported by HeroListItem.tsx. Match on full paths, never
the basename.

DO NOT delete components/Home/HomeListControls.tsx. It is dormant but Phase 3 mounts it.

DO NOT resolve anything in §12 of the build spec — no typography changes, no nav panel
colour, no logo behaviour, no price styling.

GATE: npm run build and npm run lint both clean. Then report every file changed and
deleted, and list exactly what I should check visually — you cannot verify rendering
yourself.
```

---

## Verifying it

The build passing is necessary and not sufficient. Claude Code cannot see the page.
Run `npm run dev` and check three things yourself:

1. **The homepage hero still plays its full choreography.** This is the highest-risk
   item — `HeroListItem.tsx` and `components/Home/hero-timeline.ts` took eight briefs
   and the deletions happen in a directory with a confusingly similar name.
2. **The artwork page MiniNav shows only icons with data behind them.** Before this
   phase every icon was forced on. An artwork with no AR should now have no AR icon.
3. **List images still load cleanly** where the blur placeholder used to be — the
   `cityPlaceholderColor` + `overlayRects` path should cover the gap with no flash.

Then answer item 8's report before merging, since it is the only open decision in the
phase.

## After Phase 0

Phase 1 is the commerce boundary, and it now has much more to go on than when the
spec was written: §4.4a of the build spec carries the verified Vendure state, §4.4b
the channel and permission model, §4.5b the webhook contract. The `lib/vendure.ts`
channel-token bug belongs there, not here.

Running in parallel, and none of it code: LUCID registration, the zero-rate tax
category, a real payment handler, and the product copy, asset and SKU convention.
Those have lead times that Phase 0 does not.

---

*Written by Claude, 17 September 2026.*
