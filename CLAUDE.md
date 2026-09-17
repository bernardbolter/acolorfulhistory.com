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
  *Currently violated* — see Known-broken below.
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
- **Every artwork query must route through `buildSiteSeriesWhereParams`.** Two
  currently do not — see Known-broken.
- **Fetch depth must match the mapper being used.** `mapPayloadArtworkForList`
  needs depth 1; `mapPayloadArtworkToArtwork` needs depth 2 (AR poster images are a
  relation inside an array). Mismatches are silent data loss, not just waste.

---

## Known-broken — fix, do not preserve

An agentic pass will find these and may assume they are intentional. They are not.

| Where | What |
|---|---|
| `components/Artwork/ArtworkPage.tsx:38` | `PREVIEW_ALL_MINI_NAV = true` forces every MiniNav icon on regardless of data. Visitors get an AR icon with no AR, a slider with no transfer image, a share with no `shareDescription`. Lines 129–132 have unreachable right-hand gates because of it. |
| `lib/data.ts` `getTriptychPanelsForArtwork` (~137–148) | Fetches depth 1 but runs the **full** mapper, which needs depth 2. Nested AR media comes back unpopulated. Also the only artwork query besides the hero dev path that bypasses `buildSiteSeriesWhereParams` — it filters by the artwork's own `series.slug` instead, which will leak works from series not on the allowlist. |
| `components/Home/ListCard.tsx:27,53–54` · `components/Home/HeroListItem.tsx:106,363–364` | `placeholder="blur"` with a 1×1 `blurDataURL`, against the never-blur rule, with CSS at `globals.css:1748–1751` trying to suppress the gaussian. Two placeholder mechanisms fighting. |
| `lib/heroFields.ts:22,31,60` | `HERO_FORCE_SLUG = null` with unreachable branches behind it. |
| `components/Home/hero-timeline.ts:70` | `ENABLE_HERO_UNPAINT_ON_EXIT = false`, exported, read nowhere. |
| `components/UI/Nav.tsx:36–38` | Three nav entries with `href: '#'` — Breaking Down Art, Gates of Perception, Mediums of War. Links that do not navigate. |

---

## Live vs dead — read this before editing anything

There are **two hero implementations** and one is dead. Eleven files are dormant.

**The live hero** is `components/Home/HeroListItem.tsx` (405 lines) with
`components/Home/hero-timeline.ts` (360 lines). It is the self-painting slot-0 hero
on the homepage list, driven by `ach.hero.heroFields` polygon data.

**Dead — imported by nothing:**
`components/Artworks/Artworks.tsx` · `components/Home/HomeListControls.tsx` ·
`components/Pages/LandingPage.tsx`

**Dead — only reachable through the above:**
`components/Artworks/ArtworkList.tsx` · `components/UI/Loader.tsx` ·
`components/Home/HomeSectionRenderer.tsx` · and the entire old hero stack:
`components/hero/HeroSection.tsx`, `HeroSectionLoader.tsx`, `HeroCanvas.tsx`,
`HeroCopy.tsx`, `HeroMobileArrow.tsx`, `hero-states.ts`, `hero-timeline.ts`

**`HomeListControls.tsx` is a complete, working filter bar that is imported
nowhere** — `PaintingList.tsx:34` has only a comment where it used to render. Its
styles (`globals.css:1634–1674`) and its data layer (`getHomepageFacets` in
`lib/homepageArtworks.ts:227`) are also live-but-unused. Switching it back on was a
deliberate decision rather than a repair — **and the decision has now been made**:
it gets mounted on the new `/paintings` route in Phase 3 of `docs/build-spec.md`.
Do not mount it anywhere else, and do not mount it on `/`.

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
