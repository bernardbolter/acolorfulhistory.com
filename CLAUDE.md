# CLAUDE.md — acolorfulhistory.com

Standing context for this repo. Every fact here was verified against code on
16 September 2026 by the three read-only audits in `docs/artwork/`:
`addendum-route-component-inventory.md`, `addendum-style-guide-reconciliation.md`,
`addendum-docs-inventory.md`. Where this file and a doc disagree, this file wins.
Where this file and the code disagree, say so rather than assuming.

---

## What this is

The commerce and narrative site for Bernard Bolter's *A Colorful History* —
paintings made by transferring a historical photograph onto canvas and completing
it in painted fields. It sells **commissions** (the business), **print sets**, and
**Mediums of Perception** editions.

It consumes a Payload CMS archive hosted separately at bernardbolter.com, which is
the single source of truth for all artwork data across several sites.

**What to build is in `docs/build-spec.md`.** This file is code facts and rules;
that one is product intent — the route map, the three products, the commerce
boundary, and eight phased tasks each with an acceptance gate. Read it before
starting any feature work. Its §12 is a stop list.

## Build status

Current as of merge `f08d324` on `main` (Phase 0 + 0b). Gates live in
`docs/build-spec.md` §10 (Phase 0b / availability structural fix under §10a-bis).

| Phase | Status |
|---|---|
| Phase 0 — Fix and clear | DONE |
| Phase 0b — Exhaustive `ARCHIVE_STATUS_MAP` + `forsale` from unified availability | DONE |
| Phase 1 — Commerce boundary | NOT STARTED |
| Phase 2 — Studio periods | NOT STARTED |
| Phase 3 — `/paintings` and the filter bar | NOT STARTED |
| Phase 4 — `/commissions` | NOT STARTED |
| Phase 5 — Homepage restructure | NOT STARTED |
| Phase 6 — The print packet | NOT STARTED |
| Phase 7 — The configurator | NOT STARTED |
| Phase 8 — Map filters | NOT STARTED |
| Artwork-page thinning (§3.3) | NOT STARTED |

## Commands

```
npm run dev       # next dev
npm run build     # next build — also runs type checking
npm run lint      # eslint
npx tsc --noEmit  # typecheck alone, when a full build is too slow
```

There is no `typecheck` script and there are no tests.

## Stack

Next 16.1.6 App Router · React 19.2 · Tailwind **3.4** (not v4) · Payload CMS v3
over REST · next-intl 4.8 (en/de) · MapLibre + `@vis.gl/react-maplibre` +
Protomaps · GSAP 3.15 · MindAR · Vendure (present but unconfigured).

Locale middleware is **`proxy.ts`**, not `middleware.ts`. There is no
`middleware.ts` and no `app/**/not-found.tsx`. There are no tests.

There is **no GraphQL client and no Vendure SDK in `package.json`**, and none should
be added. `lib/vendure.ts` talks to the shop API with a plain `fetch` POST to
`{VENDURE_SHOP_API}/shop-api`. Keep it that way.

---

## Hard rules

These are not preferences. Breaking one is a bug.

- **One breakpoint only: `l:` at 769px.** Never `sm:` `md:` `lg:` `xl:` `2xl:`.
  Currently clean — zero occurrences. Keep it that way.
- **Font sizes in rem, never px.** Currently clean.
- **No blur placeholders.** Use `cityPlaceholderColor` + `overlayRects`.
- **Never `react-medium-image-zoom`.** Zoom is `components/Artwork/ZoomMode.tsx`.
- **Never rebuild the logo wordmark in HTML/CSS.** It is SVG: `svgs/colorLogo.js`,
  used by `components/UI/Logo.tsx:28`. (The tagline and byline *are* HTML — that is
  an open question, not a licence to convert the wordmark.)
- **Never store prices in Payload.** Vendure holds prices. The neighborhood global's
  `pricing.priceLabel` is a display *label*, not a price record — do not generalise
  from it.
- **Never modify base archive fields.** All site-specific editorial lives on the
  Payload `ach` tab. Never duplicate data between the base record and the ACH tab.
- **`localized: true` by default** on every human-readable field.
- **Payload is the only data path.** The WordPress/GraphQL fallback was removed
  deliberately (`docs/artwork/decision-drop-wordpress-fallback.md`);
  `lib/graphql.ts` and `lib/mappers/artworkFromGraphql.ts` are gone. Do not
  reintroduce either.

## Architecture invariants

- **`SITE_SERIES_SLUGS` in `lib/siteSeries.ts` is the site-scope allowlist** — not
  Payload's `published` status, which is archive-wide across all of Bernard's sites
  (~217 works). A series appears on this site only if its slug is in that list.
  See `docs/artwork/decision-keep-site-series-allowlist.md`.
- **Every artwork query must route through `buildSiteSeriesWhereParams`.** The
  triptych sibling query (`getTriptychPanelsForArtwork`) does so as of `fc064c8`.
  The remaining thing to check is the opt-in `HERO_DEV_FALLBACK_SLUG` env path in
  `lib/heroFields.ts` — production leaves it unset.
- **Fetch depth must match the mapper being used.** `mapPayloadArtworkForList`
  needs depth 1; `mapPayloadArtworkToArtwork` needs depth 2 (AR poster images are a
  relation inside an array). Mismatches are silent data loss, not just waste.
- **`forsale` is derived from `getUnifiedAvailabilityFromDoc`** and is true for
  19 of 79 site records. Nothing may treat it as "has a buy button" — commissions,
  not inventory, are the business.

---

## Known-broken — fix, do not preserve

An agentic pass will find these and may assume they are intentional. They are not.
Verified still true by Audit 4 (`docs/artwork/addendum-build-state-oct2026.md`).

| Where | What |
|---|---|
| Lint baseline | **11 errors / 7 warnings** on `main`. New work must not exceed that count. Comparative check only — never report lint as "clean." |
| `app/[locale]/series/page.tsx` | Redirects to `/`. Spec target is `/paintings` (Phase 3; not yet built). |
| `/neighborhood` | Still the live commissions URL. No redirect to `/commissions` (Phase 4; route not yet renamed). |
| `components/Artwork/ArtworkPage.tsx` | Still renders `StoryColumns`; archive link is always shown (ungated). Thinning is §3.3 / not started. |
| `lib/siteSeries.ts` `SITE_SERIES_SLUGS` | Still admits Mediums of War (`world-war-one`, `world-war-two`, `vietnam-war-in-video-stills`). Build-spec §1 site split is not yet applied. |
| `lib/vendure.ts` | Sends no `vendure-token` header for the `a-colorful-history` channel. |

---

## Live vs dead — read this before editing anything

**The live hero** is `components/Home/HeroListItem.tsx` with
`components/Home/hero-timeline.ts`. It is the self-painting slot-0 hero on the
homepage list, driven by `ach.hero.heroFields` polygon data. That choreography
took eight briefs — **do not edit it** unless a phase explicitly says to.

The old `components/hero/` stack and the other dormant Artworks/Landing/Loader
files were deleted in Phase 0 (`fc064c8`).

**Only `components/Home/HomeListControls.tsx` remains dormant**, deliberately —
a complete filter bar imported nowhere (`PaintingList.tsx:34` is a comment). Its
styles (`globals.css:1634–1674`) and data layer (`getHomepageFacets` in
`lib/homepageArtworks.ts:227`) are live-but-unused. It mounts on `/paintings` in
Phase 3 of `docs/build-spec.md`. Do not mount it anywhere else, and do not mount
it on `/`.

Fourteen other `lib/` and `helpers/` exports are called nowhere; the inventory
lists them with line numbers.

---

## Open decisions — do not resolve these unilaterally

Each has been open for weeks and needs Bernard, not a judgement call.

- **Josefin Sans scope.** Applied on four selectors — `.painting-list-title`,
  `.hero-list-caption`, `.hero-list-play-hint`, `.historical-date-year`. The comment
  at `lib/fonts.ts:17` still says "list card titles only," which the code
  contradicts. Do not change either side.
- **Artwork title font and size.** Currently Barlow 1.125rem/600 at two surfaces
  (`TitleBlock.tsx:46`, `InfoTab.tsx:56`). `design-system.md` §3 specifies Limelight
  2.5rem; the `text-artwork-title` token exists and is unused.
- **Limelight on prices.** `NeighborhoodPageShell.tsx:170` uses `font-display` for
  the price, against §3's never-for-prices rule.
- **Nav panel colour.** `Nav.tsx:181` is `bg-[#FBFAF7]`; the `surface-nav` token is
  `#ECECEC` and unused. No token matches the live colour.
- **Open-nav logo behaviour.** Code fades the meta stack; the decision file says the
  group travels together.

---

## Where the real detail lives, and what not to trust

**Current as of 16 Sep 2026** — the three addenda named at the top of this file.
They describe code, with line numbers.

**Canonical but partly stale:** `docs/design-system.md`. Section 1 (Philosophy)
still describes a map-first site that no longer exists. Several sections carry
measurements the code has moved past. `docs/design/design-system.md` is a five-line
stub pointing at it.

**Do not trust without checking:**

- `docs/site-scaffolding-status.md` — says Neighborhood Commissions is unbuilt. It is built.
- `docs/brief-03-map-tour-design.md` — "the map is the homepage." It is not; the map is `/map`.
- `docs/brief-hero-animation-build.md` — describes the dead hero stack.
- `docs/cards/brief-10-homepage-artwork-query.md` — says do not hardcode a series allowlist. A later decision file says keep it. The allowlist exists.
- `docs/master-brief.md` — print editions as 15 sets A3 + 30 sets A5. Superseded.

**Filesystem dates are unreliable.** Most `docs/` mtimes were flattened to
`2026-09-16 17:45` by a bulk copy. Use in-document dates where they exist and the
contradiction table in `addendum-docs-inventory.md` §3.

---

## How to work in this repo

- **Branch per task.** Small, scoped changes. This codebase carries a lot of
  settled, hard-won detail — the hero choreography took eight briefs — and broad
  well-intentioned improvement is the main risk, not failure.
- **Read-only audit before anything wide.** The pattern here is
  `claude_*-prompt.md` → `addendum-*.md`: an audit reports findings and changes
  nothing. If an audit finds a bug, it records it. A later scoped task fixes it.
- **The floor for verification is a clean `npm run build`, plus `npm run lint` adding
  no new findings.** `next build` type-checks, so a clean build is a clean typecheck;
  `npx tsc --noEmit` is the faster loop while iterating. There are no tests.
  **Lint is not clean on `main`** — as of 17 Sep 2026 it reports 11 errors and 7
  warnings, mostly `react-hooks/set-state-in-effect` in `NavPersistentRow.tsx`,
  `HistoryProvider.tsx` and `RevealSlider.tsx`. That is pre-existing tech debt, not
  yours. So the test is comparative: stash your changes, run lint on the unmodified
  branch, and confirm the counts match. Never report lint as "clean"; report it as
  "no new findings" with the baseline stated.
- **Ask before resolving anything in Open decisions above.**
- **Never print or commit values from `.env.local`.** Variables not in
  `.env.example`: `NEXT_PUBLIC_PAYLOAD_API_URL`, `VENDURE_SHOP_API`.
