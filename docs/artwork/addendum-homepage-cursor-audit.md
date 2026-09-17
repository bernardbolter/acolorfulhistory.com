# Addendum — Homepage Bundle Build Audit (List + Hero + Nav)
## A Colorful History · acolorfulhistory.com

*Cursor's status check of the homepage list, self-painting hero, and persistent header/nav against the locked briefs listed below. Report only — nothing was changed in this pass.*
*Captured Aug 25 2026. Format follows [addendum-artwork-page-cursor-audit.md](./addendum-artwork-page-cursor-audit.md).*

**Briefs read in the requested order** (later supersede earlier where noted): `docs/hero/brief-hero-list-system.md` · `docs/hero/brief-11-hero-animation-fields.md` · `docs/hero/brief-13-hero-animation-choreography.md` · `docs/cards/brief-09-list-card-images.md` (title / metadata / tap-target still in force; §§1–2 superseded by brief-12) · `docs/cards/brief-10-homepage-artwork-query.md` · `docs/cards/brief-12-list-image-sizing.md` · `docs/nav/brief-07-header-nav-sequence.md` · `docs/nav/brief-08-nav-panel-visual-refinement.md` · `docs/design-system.md` · [decision-drop-wordpress-fallback.md](./decision-drop-wordpress-fallback.md).

**Missing from the repo:** `brief-06-homepage-nav-revamp.md` is cited by briefs 07–10 and by `docs/artwork/brief-09-list-card-images.md`, but no file of that name exists anywhere in the project. Spotlight-card and Browse-group requirements below are reconstructed from those later briefs, not from brief-06 itself.

**Conflicting sibling docs (not used as source of truth here, but they will trap the next pass):** `docs/artwork/brief-09-list-card-images.md` still specifies `artwork.proportion`, a burnt-amber series label, and a status badge — all superseded by `docs/cards/brief-09` + brief-10. Two design-system files exist (`docs/design-system.md` and `docs/design/design-system.md`); they have diverged (see Tier 1).

Live Payload check (Aug 25 2026, production `bernardbolter.com`, public `/api/artworks`): `ach.hero` **exists** on the Artworks document (`heroEligible` / `heroFields` / `heroPhoto`). Every inspected record has `heroEligible: false`, `heroFields: null`, `heroPhoto: null`. Eligible query returns **0 docs**. `primaryImage` at `depth=1` and `depth=2` is a populated media object with a top-level `url` (R2). `series.name` is the display field (`series.title` is null). `yearCreated` is the paint year (e.g. Brandenburg 2017), not the historical year in the title.

---

## Bottom line

The static list is the most solid of the three subsystems: Payload is the only data path, `primaryImage.url` + `aspectRatio` + `series.name` are wired to the live schema, the 40px offset is actually gone, Josefin is used for list-card titles, and the whole card is one link. That is real progress on the class of bug brief-10 was written to catch.

What is **not** solid is the gap between “the later briefs exist” and “the later briefs landed.” The hero is a scroll-scrubbed, play-button performance with local JSON geometry, not the autoplay CMS-pool animation in brief-hero-list-system §3 and brief-13. Sort/filter controls were built and then hidden. The nav persistent row and Map/List pill are in place, but the panel still has no solid surface, and the three-group list is missing Browse. `docs/design-system.md` still contains the exact WordPress-era Image sample brief-10 retired — the trap that caused the last homepage breakage is still sitting in the canonical token doc.

This does **not** block Neighborhood Commissions as a separate page (that brief is its own intake/pricing surface inside ACH). It **does** make series-level scaffolding unreliable for anything that assumes the homepage list, series nav, or hero pool is the locked spec: Gates of Perception is still silently dropped from the site query, MoP spotlight cards were never built, ACH-series tags are hidden on the list, and the hero will keep animating three hardcoded slugs even though the CMS pool is empty. Fix the silent data/hero-pool issues before treating this bundle as a stable foundation.

---

## Tier 1 — silent bugs

Broken functionality or wrong data that produces incorrect output without visibly erroring.

- **CMS hero pool is empty; the frontend silently substitutes a hardcoded local pool.** Live `GET /api/artworks?where[ach.hero.heroEligible][equals]=true` returns 0 docs. Brandenburg, Berliner Schloss, Powell Street v2, and Cliff House 1902 all have `ach.hero.heroEligible: false` and null `heroFields` / `heroPhoto`. `getHeroEligibleArtwork()` in `lib/homepageArtworks.ts` (lines 248–284) queries that pool, then on empty (or when `HERO_FORCE_SLUG` is set) falls through to `pickRandomHeroPoolSlug()` — a three-slug allowlist in `lib/heroFields.ts` (`powell-street-1895-v2`, `brandenburger-tor-1899`, `berliner-schloss-1900`) plus checked-in JSON under `docs/hero/`. `resolveHeroAnimationPayload()` prefers Payload geometry, then **local JSON for that slug**, and prefers `heroPhoto` then the ACH source photograph. Brief-hero-list-system §3 says no eligible pool degrades **silently to a plain list**. Today the homepage always performs one of those three paintings from repo files, so it looks as if Brief 11 is populated. It is not. `heroPhoto` is unused in production. The grayscale-filter fallback in `HeroListItem.tsx` (lines 109–110, 333–335) is the prototype stand-in brief-13 §6 warned about.

- **Series allowlist still silently drops a published series.** `SITE_SERIES_SLUGS` in `lib/siteSeries.ts` is `a-colorful-history` + `breaking-down-art` only. `buildSiteSeriesWhereParams()` is applied to the homepage fetch, the hero fetch, and `getArtworksLite()` in `lib/data.ts` (used by `[locale]/layout.tsx`). Live counts: ACH 59, BDA 3, **Gates of Perception 14**, MoP/MoW series slugs 0. BDA is back (the original brief-10 breakage is fixed for that series). Gates is the same class of silent omission brief-10 was written to stop: “Do not hardcode a series allowlist/exclusion list in the query.” Neighborhood Commissions copy sits inside ACH, so this does not hide that offering — but any series-level page or nav that assumes “one unfiltered published-artworks query” is still lying.

- **Decade filter is keyed to paint year, not the year the card displays.** Brief-10 §2b specs `yearCreated` as the decade range field. Live `yearCreated` is the paint year (`brandenburger-tor-1899` → 2017; several 2022–2025 Berlin landscapes). Card metadata in `lib/listCardMeta.ts` `listHistoricalYear()` prefers `ach.source.approximateDateYear`, then a year parsed from title/slug, then paint year — so the visitor reads “Berlin, 1899” while a decade control built on `yearCreated` would put that work in the 2010s. `HomeListControls` is currently hidden (see Tier 3), so this is not visitor-facing today; the query in `lib/homepageArtworks.ts` `buildServerSearchParams()` (lines 103–108) and facet extraction (lines 176–179) are already wired this way. Same shape as the stale-field bugs: the control will look fine and return the wrong set.

- **`docs/design-system.md` still contains the retired WordPress Image sample.** Brief-10’s entire reason for existing was that this snippet (`artwork.artworkFields.artworkImage.mediaDetails.sizes[1].sourceUrl`, `artwork.artworkFields.proportion`) was copied into the homepage. It is still in `docs/design-system.md` lines 1036–1059 (`CITY_PLACEHOLDER` + that `src=`). Section 6 still documents a `proportion` field; §14 still says “Every image must respect `artwork.artworkFields.proportion`.” The sibling `docs/design/design-system.md` had the `src=` line rewritten to `artwork.primaryImageUrl` / `aspectRatio`, but still uses `getArtworkPlaceholder(artwork.artworkFields.city)` and still has the proportion “What NOT To Do” line. Two files, two truths — the trap is not retired.

- **WordPress-era field names are still live in the homepage/hero read path.** Decision-drop said Payload is the sole source, and `lib/graphql.ts` is gone (good). It also said `artwork.artworkFields` remains as an internal view-model. On this bundle that view-model is still the primary read for city, orientation, medium, and a second image URL: `ListCard.tsx` line 23 (`primaryImageUrl || artworkFields.artworkImage?.mediaItemUrl`), `HeroListItem.tsx` lines 58–64 and 80, `lib/listCardMeta.ts`, `lib/listImageSizing.ts` lines 51–55. Mapper `mapPayloadArtworkForList()` still writes `artworkFields.proportion` and `artworkImage.mediaDetails` (`lib/mappers/artworkFromPayload.ts` lines 329–347). `types/artwork.ts` still has `seriesTitle` (deprecated alias) and `ArtworkMediaDetails.sizes`. `colorfulFields` was not found in this bundle. These do not currently null-out images (the mapper fills them from Payload), but they are the exact names brief-10 said not to reintroduce, and they will keep teaching the next pass the old shape.

- **Brief 11 validate hook cannot be confirmed from this repo.** `ach.hero` is on the live document shape, which is the schema half of brief-11. The `validate` hook that must block `heroEligible: true` without both `heroFields` and `heroPhoto` lives in the Payload collection config on bernardbolter.com, not in acolorfulhistory.com. Empty eligible pool is consistent with the hook working **or** with nobody having filled the fields. Untested either way.

---

## Tier 2 — structural / layout mismatches vs. the locked specs

### A. Homepage list (`PaintingList.tsx`, `ListCard.tsx`)

- **Landscape width cap is not 100%.** Brief-12 §1: landscape 100% / portrait ~85% / square ~65% desktop; 100 / 92 / 85 mobile; then `min(widthFromContainer, widthFromHeight)` at 85vh. CSS in `app/globals.css` sets those portrait/square caps (lines 1231–1241, 1315–1335) and the 85vh height cap (`--list-height-cap`). Landscape is then **overridden** (lines 1254–1267) to the square cap (`--list-square-cap`, 0.85 mobile / 0.65 desktop) with a comment “same display width as a square (not × aspectRatio).” That is a deliberate post-brief visual choice, not the locked formula. `--list-size-scale` from Payload `sizeTier` + cm dimensions (`lib/listImageSizing.ts` `resolveListSizeScale`) is multiplied into the width — extra constraint, not in brief-12.

- **Metadata line is not the spec line.** Brief-09 §1 (still in force): one line, **place + year + series tag**, small-caps series in `$text-muted` (not burnt-amber). `PaintingListMeta.tsx` splits this into two `<p>`s, inserts **medium** between place/year and series (`listMediumLabel` — brief-09 said medium is artwork-page-only), and `listSeriesLabel()` **hides** the main ACH series (`ACH_MAIN_SERIES_SLUG === 'a-colorful-history'`). Live `series.name` is “A Colorful History”, not “Mediums of Perception”. The spec example `Berlin, 1899 · Mediums of Perception` cannot appear as written. Place/year uses `text-secondary` (`#666`); only the series tag is `text-muted`. Series tag small-caps treatment is otherwise in the right neighborhood (`0.6875rem` / 700 / tracking / uppercase).

- **Josefin weight does not match what is loaded.** Title class `.painting-list-title` is Josefin `1.125rem` / `font-weight: 500` (`app/globals.css` lines 1304–1312) — the cards/brief-09 default. `lib/fonts.ts` only registers Josefin at **600** (the `docs/artwork/brief-09` value). The browser cannot serve 500 from that file; you get 600 or a synthetic 500. Size `1.125rem` is the cards brief, not the artwork-brief `~1.4rem`.

- **Placeholder mechanism is overlay-colored but not the brief-12 wrapper.** Color source: `resolvePlaceholderHex()` in `lib/placeholders.ts` does pick a random `overlayColors[]` hex when present (mapper reads `ach.overlay.overlayColors[].hex` — live Brandenburg has three). Fallback is still `cityPlaceholderColor` then `lib/cityPlaceholder.ts` `CITY_PLACEHOLDER_COLORS` (the retired city map, renamed). Mechanism is a generated 1×1 PNG `blurDataURL` on `next/image` (`ListCard.tsx` lines 39–56, `.painting-list-image--blur` kills the gaussian blur). Brief-12 §3 wanted a CSS background on the wrapper that clears on `onLoad`, “not an image at all.”

- **Default sort is `random`, not `-createdAt`.** Brief-10: default is most recently added. `parseHomepageFilters()` in `lib/homepageArtworks.ts` (lines 51–56) treats anything other than `chronological`/`recent` as `random`, and `getHomepageArtworks()` shuffles. `isDefaultHomepageView()` requires `sort === 'random'` for the hero to run — so the hero and the spec default sort are coupled to a third, unspecified default. Unfiltered `/` is a shuffled list with a hero on top, not “most recent, hero in slot 0.”

- **MoP spotlight cards are not in the build.** No `SpotlightCard` (or equivalent) under homepage components. BDA is not half-built (correctly deferred). The MoP-only spotlight from brief-06 §2 / `docs/artwork/brief-09` (“three-panel row — not started”) is still not started. `PaintingList.tsx` has no slot for one.

### B. Hero animation (`HeroListItem.tsx`, `hero-timeline.ts`, `HeroFieldLayer.tsx`)

- **The interaction model is not autoplay.** Brief-hero-list-system §3: autoplay on load, gated on photo `decode()`, scroll during autoplay jumps the timeline. What shipped: a pinned `ScrollTrigger` scrub (`HeroListItem.tsx` lines 245–263, `HERO_CHOREOGRAPHY.scrollScrubEnd: '+=450%'`) plus a centered play button that **animates `window.scrollY`** (`handlePlay`, lines 136–163). `decode()` is awaited before setup (good). There is no autoplay start. Reduced-motion skips to `ListCard` in `useEffect` (lines 171–175) — after first paint of the performing UI, so reduced-motion users can flash the photo stage.

- **`HERO_CHOREOGRAPHY` exists as one object, then ignores most of brief-13 §5.** File: `components/Home/hero-timeline.ts` lines 5–37.

  | Key | Brief-13 §5 | Build |
  |---|---|---|
  | `photoDwellMs` | 1200 | **0** (and unused — Phase B starts at t=0) |
  | `photoZoomOutMs` | 1100 | **1600** |
  | `fieldEntryRotationDeg` | ±220 | **180**, and spin is alternating ± by index, not random |
  | `fieldEntryScale` | 0.3 | **0.7** |
  | `fieldLandDurationMs` | 850 | **1600** |
  | `fieldLandEase` | `back.out(1.7)` | **`power2.out`** |
  | `fieldStaggerMs` | 130 | **0** (all fields tween together) |
  | `resolveDelayAfterLastFieldMs` | 250 | 250 (match) |
  | `resolveDurationMs` | 700 | 700 (match) |
  | `settleDelayAfterResolveMs` | 950 | 950 (match) |
  | `settleDurationMs` / `settleEase` | 800 / `power2.out` | 800 / `power2.out` (match) |
  | `fieldEntryRadiusMin/Max` | 1.5–3.5 × diagonal | Present in the object, **never read** |

  Extra keys not in the brief: `fieldCornerOvershoot`, `captionFadeMs`, `scrollScrubEnd`, `scrollScrubSmoothing`, plus `PHOTO_REST_TUNE` / `COMPOSITION_VH = 0.72`.

- **Field entry is shuffled viewport corners, not random angle + radius.** Brief-13 §2: per field, per page load, `angle = random(0, 2π)`, `radius = canvasSize * random(1.5, 3.5)`. `computeFieldEntryTransforms()` (lines 114–137) shuffles four corners, jitters 0.95–1.07, and uses `fieldCornerOvershoot`. Fresh per load (yes), but not the spec distribution. Fields do not stagger.

- **Phase A is full-viewport, not a ~70–75vh square.** Brief-hero-list-system §2 / brief-13 §4: large square performance frame, then settle to list size. Build sets the stage to `window.innerWidth × innerHeight` (`HeroListItem.tsx` lines 223–226), then shrinks to `min(92vw, 72vh)` square, then to list size. `computePhotoCoverTransform()` in the `useLayoutEffect` is passed **viewport** width/height (lines 121–125), not a square container — photoRect percentages are applied to a rectangle first.

- **Phase B thesis line is missing.** Caption is place + year, then fades out (`hero-timeline.ts` line 299). No crossfade to “A photograph transferred to canvas. The rest, painted.” That copy still only lives on the **old** six-state hero (`components/hero/hero-states.ts` line 73).

- **Un-paint-on-exit was not built behind the flag.** `ENABLE_HERO_UNPAINT_ON_EXIT = false` in `hero-timeline.ts` line 70 is never imported. Reverse motion is the full pinned scrub playing backward — not “after settle, fields lift off as the item leaves the viewport, disable-able with one flag” (brief-hero-list-system §3 / §8).

- **Photo rest position (brief-13 §7) largely did land — with two caveats.** `photoRectStyle()` sets `left/top/width/height` from tuned `photoRect` (`hero-timeline.ts` lines 188–201); `.hero-list-photo` comments that this is the §7 rest position (`app/globals.css` lines 1083–1089). `computePhotoCoverTransform()` uses `Math.max(1/w, 1/h)` (not a hardcoded 3.0) and `photoZoomScale: 3.0` is documented as fallback only. Phase B tweens that wrapper toward `photoRestTransform()` (`translate` offsets + `scale: 1` + `photoRect.rot`). Caveats: `.hero-list-photo` is `overflow: visible` (spec CSS was `overflow: hidden`); rest transform includes rotation, which §7’s snippet did not; `PHOTO_REST_TUNE` can still nudge away from true photoRect.

### C. Navigation (persistent row + slide panel)

- **Browse group is missing.** `NAV_GROUPS` in `components/UI/Nav.tsx` lines 24–42 is **Series** then **More** only. `messages/en.json` has `"browse": "Browse"` unused. Series includes MoP (real href) plus BDA / Gates / Mediums of War as `href: '#'`. More: Experience, Art Prints, About. Brief-07: three groups Browse / Series / More, replacing the old flat Home / Series / MoP / Experience list. Home is not in the open panel at all.

- **Panel has no solid surface.** Brief-08 §1: backdrop `rgba(0,0,0,0.45)` + panel `#FBFAF7`, padding `56px 24px 20px`. Scrim exists (`Nav.tsx` lines 154–166, `bg-black/45`). The `<nav>` is `bg-transparent` (line 173). Each link has its own `bg-[#FBFAF7]/80 backdrop-blur` chip (lines 207–210). Links still float over darkened page content. Desktop width is 300px (`l:w-nav-panel`); padding is `pt-32 px-6 pb-5`, not `56px 24px 20px`.

- **EN/DE is not the design-system dot-toggle; Map/List is a pill.** Brief-08: keep EN/DE as the existing Toggle Switch, change **only** Map/List to a segmented pill. `NavPersistentRow.tsx`: EN/DE is plain `EN ⇄ DE` text (lines 24–35) — this matches brief-07’s “replace flags with EN ⇄ Deutsch” more than brief-08. Map/List **is** a two-segment pill with charcoal active fill (lines 38–81). The two controls are visually distinct, which was the point of §2. Label crossfade at 250–300ms (brief-07) does not apply to a always-visible two-segment control.

- **Logo shift value and tagline behavior differ from spec.** Brief-07 / design-system: logo + tagline + byline shift to `left: calc(100% - 270px)`. `Logo.tsx` line 22 uses `left-[calc(100%-318px)]` for the wordmark only; tagline/byline **fade out** on open (lines 32–35) instead of traveling with it. Hamburger is still the 4-span mechanic (good).

- **Group stagger is implemented; close is close-but-not-exact.** Open: hamburger + logo concurrent (`navOpen` immediately), panel `delay-[350ms]`, groups stagger with `PANEL_OPEN_DELAY_MS + 60 + groupIndex * 80 + linkIndex * 40` (`Nav.tsx` lines 101–103, 182–201). Brief-07 wanted group-then-link stagger — that is what shipped; the audit prompt’s “not link-by-link” is stricter than brief-07 itself. Close: links fade 150ms (`CLOSE_LINKS_MS`), then `navOpen` flips and panel/logo reverse together (`duration-fast` = 500ms). Spec close step 2–3 wanted panel close and logo return after the link fade; that order is there. During `closing`, `isMenuOpen` stays true for 150ms so the logo does not start returning until links have faded.

- **Mobile row-vs-panel divider is absent.** No `1px $ui-line` between the chrome cluster and the full-width panel. Because the panel is transparent, they do not merge into one cream surface — they merge into page content instead. Persistent row `z-nav-chrome` (200) sits above the panel `z-nav-menu` (100) and scrim `z-[90]`, so the row does stay visually on top.

- **Group divider width is CSS `w-fit`, not a measured longest *label*.** Wrapper is `w-fit max-w-full text-right` with `h-px w-full` above the group title (`Nav.tsx` lines 183–195). That tracks locale via the widest child in the group (usually a link, e.g. “Mediums of Perception”), which is what brief-08 §4 actually asked for. Not a hardcoded English px width. Group labels are `#999`, no burnt-amber (match). Links right-aligned, no per-link borders, `gap-2.5` / `gap-[26px]` (match).

---

## Tier 3 — features present but shallow / stubbed

- **Sort/filter controls exist as code, not as UI.** `HomeListControls.tsx` implements combinable Series / City / Decade / Availability plus sort (random / recent / chronological). `getUnifiedAvailability()` in `lib/unifiedAvailability.ts` matches brief-10 open item 5 (ACH `original-available` / `prints-only` / `sold` vs archive `available` / sold-like set). `PaintingList.tsx` line 34: `{/* HomeListControls hidden for now — will become a fixed-position component later. */}`. `getHomepageFacets()` is never called. URL query params (`?series=&city=&decade=&availability=&sort=`) would still filter if typed by hand, and they **do** demote the hero via `isDefaultHomepageView()` in `app/[locale]/page.tsx`. Visitor-facing: no controls.

- **Hero draw is server-side — with a client architecture that re-derives everything.** `app/[locale]/page.tsx` picks the painting on the server (no wrong-painting flash). Geometry then comes from Payload-or-local JSON on the client. `HERO_FORCE_SLUG` is currently `null` (not locked to one painting). Hard reload draws a new slug from the **three-item local pool**, not from CMS.

- **Nav Series links for BDA / Gates / Mediums of War are `#` stubs.** MoP routes to `/series/mediums-of-perception`. `/series` itself redirects to `/` (`app/[locale]/series/page.tsx`).

- **Old six-state hero is still in the tree.** `components/hero/*` (`HeroSection`, `HeroCanvas`, `hero-states.ts` with hardcoded Brandenburg rectangles, mobile arrow, Kottbusser-era copy) was supposed to be deleted by brief-hero-list-system’s first Cursor prompt. Homepage `page.tsx` does not mount it. `HomeSectionRenderer.tsx` still switches `type: 'hero'` to `HeroSectionLoader`. `LandingPage.tsx` still renders that switcher; no route imports `LandingPage`. Dead unless a Payload home-page global is wired later.

- **`prefers-reduced-motion` is a post-mount swap to `ListCard`**, not a first-paint static resolved painting. Flag as shallow a11y, not missing entirely.

---

## Confirmed working against spec

- **Payload is the sole runtime data source for this bundle.** No `lib/graphql.ts`, no `artworkFromGraphql`, no `NEXT_PUBLIC_GRAPHQL_URL` in `.env.example`. Matches [decision-drop-wordpress-fallback.md](./decision-drop-wordpress-fallback.md) for the fetch path.

- **`primaryImage` populated shape (brief-10 open item 1), live-checked Aug 25 2026.** At `depth=1` and `depth=2`: object with `url`, `filename`, `width`, `height`, `sizes.thumbnail` only (no `card` / `tablet`). Mapper `payloadMediaUrl()` reads `media.url`. List fetch uses `LIST_FETCH_DEPTH = 1` (`lib/homepageArtworks.ts` line 37) — enough for `url` + `series.name` + `ach.overlay.overlayColors`. Brandenburg image URL is the full R2 file, not a 300px thumb.

- **`aspectRatio` (not `proportion`) drives list sizing; null/invalid → 1.** `resolveListAspectRatio()` in `lib/listImageSizing.ts` lines 32–35; mapper also clamps `aspectRatio > 0 ? aspectRatio : 1`. Live sample `lombard-street-1922-v2`: `aspectRatio: 1`, `proportion: null`. BDA `venice-in-the-middle`: `aspectRatio: 0.714286`, `orientation: portrait`.

- **`series.name` is what the mapper reads.** `relationName()` in `lib/mappers/media.ts` prefers `name`, falls back to legacy `title`. Live series objects have `name` and null `title`. BDA’s three published slugs from brief-10 (`venice-in-the-middle`, `venice-biennale-2007`, `skulptur-projekte-m-nster-2007`) are in the site query.

- **40px alternating offset is gone.** `PaintingList.tsx` is a centered column (`align-items: center` on `.painting-list-card`); no offset state, no 40px left/right. Matches brief-12 §2.

- **Whole card is one `Link`.** `ListCard.tsx` lines 34–64 wrap image, title, and metadata. Matches brief-09 §3.

- **Josefin Sans is used for list-card titles** (and not as the site title face). `lib/fonts.ts` comment is explicit; Limelight remains `font-display`. Exception to the Limelight-for-titles rule is in place.

- **Hero and list are separate queries; filters demote the hero.** `getHeroEligibleArtwork()` is independent of `getHomepageArtworks()`. `showHero = isDefaultHomepageView(filters)` in `app/[locale]/page.tsx`. PaintingList then de-dupes the hero slug from the column.

- **Brief-13 §7 photoRect rest + computed cover scale is in the code** (see caveats in Tier 2). `HeroFieldLayer.tsx` renders SVG polygons from `heroFields` hexes. Field colors are data-driven.

- **Persistent header row is one shared component** that does not remount on open/close. `NavPersistentRow` sits in the chrome cluster beside the hamburger (`Nav.tsx` lines 114–115), not inside the panel. Context slot: Map/List pill on `/` and `/map`, “Back to browse” everywhere else (`NavPersistentRow.tsx` lines 13–15, 37–89).

- **Map/List is a segmented pill; EN/DE is not.** Distinct patterns, as brief-08 required for Map/List specifically.

- **Scrim, muted group labels, right-aligned link list, no per-link dividers, content-width group rule** are in place (panel *surface* is the miss).

- **`getUnifiedAvailability()` is a single helper**, not copied per component. Archive sold-like states collapse; `prints-only` only from ACH MoP status.

- **No 230px fixed-height list images remain** in `ListCard` / painting-list CSS.

---

## Not part of spec but present in the build

- Play button + “or scroll” hint on the hero (`HeroListItem.tsx` lines 382–401) — replaces specified autoplay.
- Full-viewport pin + `+=450%` scroll scrub as the timeline driver.
- Payload `sizeTier` / cm-based `--list-size-scale` on list images.
- Landscape images forced to square-cap width (post-brief visual tuning).
- Medium on the list-card metadata; ACH series tag hidden; metadata split onto two lines.
- Default sort `random` (and hero gated on it).
- `PHOTO_REST_TUNE` px nudge / scale on the photo wrapper.
- Field fly-in from viewport corners instead of polar randomization.
- Old `components/hero/` six-state system retained (unmounted on `/`).
- `HERO_POOL_SLUGS` + local `docs/hero/*.json` as a frontend geometry source (spec: CMS only, zero painting-specific frontend code).
- Nav Series entries that 404-as-`#` for unpublished series pages.
- Duplicate, conflicting `docs/artwork/brief-09-list-card-images.md` and two `design-system.md` files.

---

## Suggested next step

Ordered punch list for a **scoped fix pass**, same grain as the artwork-page audit. Do not mix a hero-choreography rewrite with a nav-surface pass in one session.

1. **Kill the silent hero-pool fallback or make it honest.** Until live records have `heroEligible` + `heroFields` + `heroPhoto`, `getHeroEligibleArtwork()` should return `null` and PaintingList should render a plain list (brief-hero-list-system §3). Optionally keep local JSON behind an explicit `HERO_FORCE_SLUG` / env flag for tuning — not as the production default. Confirm the Payload validate hook on bernardbolter.com in the same pass (this repo cannot see it). Seed at least one record (Brandenburg) so the CMS path can be tested.

2. **Retire the WordPress Image sample from `docs/design-system.md`** (lines 1036–1076 and the §14 `artworkFields.proportion` line), and either delete or clearly mark `docs/design/design-system.md` as a stale copy. This is how the last homepage breakage happened.

3. **Decide the series allowlist.** If ACH’s public catalogue is intentionally only `a-colorful-history` + `breaking-down-art`, write that down so brief-10 is amended. If not, drop `SITE_SERIES_SLUGS` from the base fetch so Gates (14) is not silently missing. Same decision feeds Neighborhood Commissions only insofar as it shares `getArtworksLite` / series nav.

4. **Wire or delete `HomeListControls`.** If they ship: show them, default sort to `recent` without killing the hero (hero is a separate query — `isDefaultHomepageView` should key off “no user filter,” not `sort === 'random'`), and do **not** use paint-year `yearCreated` for a visitor-facing decade facet without a historical-year field. If they stay hidden, do not leave a half-wired query that will be wrong on the next “just uncomment it” pass.

5. **List-card copy pass (brief-09, still in force):** single metadata line, no medium, series tag visible in `$text-muted`, resolve “A Colorful History” vs “Mediums of Perception” as the tag string, load Josefin at the weight the CSS actually uses.

6. **Hero choreography vs product decision.** Either restore autoplay + brief-13 §5 numbers + polar field entry + 1200ms dwell + thesis line, or formally replace those briefs with the scroll-scrub/play-button model that shipped. Right now the code and the locked spec describe different products. Brief-13 §7 (photoRect rest, computed cover scale) should be kept either way.

7. **Nav visual + Browse group (brief-07/08), as its own session:** solid `#FBFAF7` panel, restore Browse group, replace `#` series stubs or hide them, leave the persistent row and Map/List pill alone — those are the parts that already match.

Live records worth using as fixtures in the fix pass: `/en` (hero + list), a BDA title such as `/en/venice-in-the-middle` (series tag + portrait sizing), `/en/brandenburger-tor-1899` (square, overlayColors, empty `ach.hero`), `/en/map` (Map/List pill), any interior page (back-to-browse).
