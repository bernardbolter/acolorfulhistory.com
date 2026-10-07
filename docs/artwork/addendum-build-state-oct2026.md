# Addendum — Build state vs build spec

**Audit 4 · read-only · 7 October 2026**

Evidence against `docs/build-spec.md` §10 and related sections. Code and git history
are authoritative for what exists; the build spec for what was intended. No
recommendations.

Working tree at audit time: branch `phase-0b-availability-model` @ `fc064c8`, with
uncommitted edits to `lib/unifiedAvailability.ts`, `lib/mappers/artworkFromPayload.ts`,
and `docs/build-spec.md`. Where committed and working-tree differ, both are stated.

---

## 1. Git state

### Branches

| Branch | Tip | Date | Notes |
|---|---|---|---|
| `main` (local) | `162fb8c` | 2026-09-17 10:42 +0200 | Ahead of `origin/main` by 1. Message: *Snapshot current site work: Payload-only archive, homepage list hero, neighborhood commissions, and artwork-page refinements.* |
| `origin/main` | `2d6d46f` | 2026-06-14 22:02 +0200 | Last remote push: *Build June launch pages…* |
| `phase-0-fix-and-clear` | `fc064c8` | 2026-09-17 13:43 +0200 | *Phase 0: fix known-broken behavior, clear dormant files, correct availability model* |
| `phase-0b-availability-model` ★ current | `fc064c8` | 2026-09-17 13:43 +0200 | Same tip as `phase-0-fix-and-clear`. No additional commits. Uncommitted availability work in WT. |

No other local or remote branches. No stashes (`git stash list` empty).

### Merge status into `main`

| Branch | Merged into `main`? | Evidence |
|---|---|---|
| `phase-0-fix-and-clear` | **No** | `git branch --merged main` lists only `main`. `git log main..phase-0-fix-and-clear` → `fc064c8`. |
| `phase-0b-availability-model` | **No** | Same tip as phase-0; not an ancestor of `main`. |
| Any other `phase-*` | **None exist** | Only the two phase branches above. |

### Commits on `main` since 2026-09-17

| Hash | Date | Subject |
|---|---|---|
| `162fb8c` | 2026-09-17 10:42 +0200 | Snapshot current site work: Payload-only archive, homepage list hero, neighborhood commissions, and artwork-page refinements. |

(That commit's timestamp is on 17 Sep; nothing after it is on `main`.)

### Uncommitted / untracked (audit time)

| Path | Status |
|---|---|
| `docs/build-spec.md` | modified (uncommitted §10a-bis paragraph) |
| `lib/mappers/artworkFromPayload.ts` | modified (`forsale` → `getUnifiedAvailabilityFromDoc`) |
| `lib/unifiedAvailability.ts` | modified (`ARCHIVE_SOLD_STATUSES` → `ARCHIVE_STATUS_MAP`) |
| `docs/audit/` | untracked (includes this audit's prompt) |
| `docs/open-issues-audit-2026-09-17.md` | untracked |

---

## 2. Phase status

| Phase | Status | Branch / commit | Acceptance gate (quoted from §10) | Evidence |
|---|---|---|---|---|
| **Phase 0** — Fix and clear | **DONE** (on branch; **not on `main`**) | `phase-0-fix-and-clear` @ `fc064c8` | *build and typecheck clean; homepage and artwork page visually unchanged except that MiniNav icons now reflect real data.* | Commit deletes 14 dormant/placeholder files; fixes MiniNav, triptych depth/allowlist, blur, hero flags, nav stubs, badge availability. Build + `tsc --noEmit` pass on current tip. MiniNav gates data-driven at `ArtworkPage.tsx:125–129`. Not merged to `main` (`162fb8c` still has the pre-Phase-0 bugs). |
| **Phase 0b** — Availability model (§10a-bis structural fix) | **PARTIAL** | Branch `phase-0b-availability-model` @ `fc064c8` (no Phase-0b commit); work only in **working tree** | Spec places the exhaustive `Record` + `forsale` derivation under §10a-bis as Phase 1 work; branch name treats it as 0b. No separate gate text for "0b". | **Committed (`fc064c8`):** `ARCHIVE_SOLD_STATUSES` still present (`lib/unifiedAvailability.ts:8–14`); `forsale: raw.availabilityStatus === 'original-available'` (`artworkFromPayload.ts:191,344`). **WT:** exhaustive `ARCHIVE_STATUS_MAP` (`unifiedAvailability.ts:29–36`); both mappers use `getUnifiedAvailabilityFromDoc(...) === 'available'` (mapper diff). Uncommitted; not on any commit. |
| **Phase 1** — Commerce boundary | **NOT STARTED** | — | *typecheck clean; with `COMMERCE_ADAPTER` unset, a script round-trips…; with `COMMERCE_ADAPTER=vendure` and no URL… static fallback and logs the downgrade… live shop checks…* | No `lib/commerce/`. No `COMMERCE_ADAPTER`. No adapter script. Only flat `lib/vendure.ts`. |
| **Phase 2** — Studio periods | **NOT STARTED** | — | *the line renders real numbers from the static object on both surfaces.* | No `lib/studioPeriods.ts`. No studio-period line on `/` or `/neighborhood`. |
| **Phase 3** — `/paintings` + filter bar | **NOT STARTED** | — | *every filter and sort returns correct results; availability filter correct…* | No `app/[locale]/paintings/`. `paintings` not in `RESERVED_SLUGS`. `HomeListControls` still unmounted (`PaintingList.tsx:34`). `/series` still redirects to `/` (`series/page.tsx:10`). |
| **Phase 4** — `/commissions` | **NOT STARTED** | — | *the page renders complete with `fromCms: false`; inquiry form mailto + clipboard fallback both work.* | No `/commissions` route. Content still at `/neighborhood` (`neighborhood/page.tsx`). No redirect. `commissions` not in `RESERVED_SLUGS`. Inquiry form exists at neighborhood (mailto path present) but rename/redirect gate unmet. |
| **Phase 5** — Homepage restructure | **NOT STARTED** | — | *the hero animation is unchanged — same choreography, same timing.* | `/` still renders only `PaintingList` (`page.tsx`). No fault line, funnels, newsletter band on homepage. |
| **Phase 6** — Print packet | **NOT STARTED** | — | *a five-item selection reaches the terminal with all five slugs intact.* | No `/prints`. No `catalog.ts`. No pick-five UI. |
| **Phase 7** — Configurator | **NOT STARTED** | — | *both choices persist through to a submitted proposal; disclaimer present; sky options narrow…* | No `/commissions/configure`. No sky options. No photo pool. |
| **Phase 8** — Map filters | **NOT STARTED** | — | *all three filters correct; unmade-photograph filter routes into the configurator.* | Map exists with existing `FilterSort`; no unmade-photograph pool or third filter wired to configurator. |
| **Artwork-page thinning (§3.3)** | **NOT STARTED** | — | Keep timeline; drop StoryColumns; gate archive link; add commercial ask; remove `PREVIEW_ALL_MINI_NAV` (latter done in Phase 0). | `StoryColumns` still mounted (`ArtworkPage.tsx:154–157`). Archive link ungated (`178–185`). No commercial CTA. `HistoricalDatesTimeline` kept (`161`). MiniNav preview flag already removed in Phase 0. |

### Phase 0 — pieces present / absent

| Piece | At `fc064c8`? |
|---|---|
| Remove `PREVIEW_ALL_MINI_NAV` | Yes — constant absent; MiniNav data-gated |
| Fix `getTriptychPanelsForArtwork` depth 2 + allowlist | Yes — `lib/data.ts:140–141` |
| Remove blur placeholders + fighting CSS | Yes — no `placeholder="blur"` in list/hero; CSS comment block gone |
| Remove `HERO_FORCE_SLUG` / unreachable branches | Yes — `resolveHeroDevFallbackSlug()` at `lib/heroFields.ts:21–28` |
| Remove `ENABLE_HERO_UNPAINT_ON_EXIT` | Yes — deleted from `components/Home/hero-timeline.ts` |
| Point or remove `href: '#'` nav stubs | Yes — only MoP series link remains (`Nav.tsx:33–36`) |
| Delete dormant `components/hero/*` + Artworks/Landing/Loader/HomeSectionRenderer | Yes — 12 component files deleted in `fc064c8` |
| Delete `lib/placeholders.ts` + `.server.ts` | Yes |
| Keep `HomeListControls.tsx` | Yes — file remains, unmounted |
| Availability: not-for-sale / on-loan distinct from sold | Yes (Phase 0 commit) |
| Availability: exhaustive Record + forsale via unified helper | **No** in commit; **Yes** in WT only (Phase 0b / §10a-bis) |

---

## 3. Routes — target vs actual

### Actual routes today (re-audit of Audit 1)

| Route | File | What renders | Content |
|---|---|---|---|
| `/` | `app/[locale]/page.tsx` | `PaintingList` → optional `HeroListItem` + `ListCard`; `SiteChrome` | Real list |
| `/[slug]` | `app/[locale]/[slug]/page.tsx` | `ArtworkPage` | Real artwork / `notFound` |
| `/[slug]/ar` | `…/ar/page.tsx` | `ARViewer` | Real AR UI |
| `/[slug]/opengraph-image` | `…/opengraph-image.tsx` | `ImageResponse` | Generated OG |
| `/map` | `…/map/page.tsx` | `MapExplorerLoader` | Real map |
| `/series` | `…/series/page.tsx` | `redirect({ href: '/', locale })` | Redirect → `/` |
| `/series/mediums-of-perception` | `…/mediums-of-perception/page.tsx` | `MoPOverviewPage` | Real / comingSoon |
| `/series/mediums-of-perception/[city]` | `…/[city]/page.tsx` | `TriptychPageShell` + `TriptychCommerce` | Real / comingSoon |
| `/experience` | `…/experience/page.tsx` | `ExperiencePageShell` | Real / comingSoon |
| `/neighborhood` | `…/neighborhood/page.tsx` | `NeighborhoodPageShell` | Real (CMS or defaults) |
| `/about` | `…/about/page.tsx` | `PlaceholderPage` | Placeholder |
| `/store` | `…/store/page.tsx` | `PlaceholderPage` | Placeholder |
| `/design-system` | `…/design-system/page.tsx` | `DesignSystemPreview` | Real internal |
| `/archive.jsonld` | `…/archive.jsonld/route.ts` | JSON-LD handler | Real |

Diff vs Audit 1 (Sept 16): same route set. No new top-level routes since then.

### §3.1 target diff

| Target | Status | Notes |
|---|---|---|
| `/` | **exists but differs** | Still artwork list, not four-band homepage (§3.2) |
| `/paintings` | **does not exist** | — |
| `/[slug]` | **exists but differs** | Real; thinning (§3.3) not done |
| `/[slug]/ar` | **exists** | Unchanged |
| `/commissions` | **does not exist** | Lives at `/neighborhood` instead |
| `/commissions/configure` | **does not exist** | — |
| `/prints` | **does not exist** | — |
| `/series/mediums-of-perception` | **exists** | Real |
| `/series/mediums-of-perception/[city]` | **exists** | Real + commerce shell |
| `/series` | **exists but differs** | Redirects to `/`, not `/paintings` (`series/page.tsx:10`) |
| `/map` | **exists** | Real; Phase 8 filters not added |
| `/experience` | **exists** | Real |
| `/about` | **exists** | Placeholder (spec: eventual content, not this build) |
| `/store` | **exists** | Placeholder (spec: stays placeholder) |
| `/design-system` | **exists** | Real |
| `/archive.jsonld` | **exists** | Real |
| `/neighborhood` | **exists** (legacy) | No redirect to `/commissions` |

### Redirects claimed by spec

| Claim | Actual |
|---|---|
| `/neighborhood` → `/commissions` | **Absent.** Page still renders at `/neighborhood`. |
| `/series` → `/paintings` | **Absent.** Redirects to `/` (`app/[locale]/series/page.tsx:10`). |

### `RESERVED_SLUGS` (`lib/reservedSlugs.ts:4–14`)

| Slug | Present? |
|---|---|
| `series`, `map`, `experience`, `neighborhood`, `about`, `store`, `fieldnotes`, `archive.jsonld`, `design-system` | Yes |
| `paintings` | **No** |
| `commissions` | **No** |
| `prints` | **No** |

Every existing top-level route segment is in `RESERVED_SLUGS`. `fieldnotes` is reserved with no route file.

---

## 4. Commerce boundary

| Question | Finding | Evidence |
|---|---|---|
| `lib/commerce/catalog.ts`, `static.ts`, `vendure.ts` | **Do not exist** | No `lib/commerce/` directory |
| Only `lib/vendure.ts` knows Vendure / shop API? | **Yes** for URL + POST | `lib/vendure.ts:1–3,24`. `TriptychCommerce.tsx:4` imports public `addToCart` / `isVendureConfigured` only. No `@vendure/*` packages. Types carry `vendureProductId` strings (`types/payload.ts`, `types/triptych.ts`) — not Vendure SDK types. |
| `COMMERCE_ADAPTER` | **Absent** | Zero matches in `*.{ts,tsx}`. No default, no fail-closed log. |
| `vendure-token` for `a-colorful-history` | **Not sent** | Headers only `Content-Type: application/json` (`lib/vendure.ts:26`) |
| `.env.example` `COMMERCE_ADAPTER` | **Absent** | `.env.example` |
| `.env.example` `VENDURE_SHOP_API` | **Absent** (not even commented) | Only live empty `NEXT_PUBLIC_VENDURE_SHOP_API=` at `.env.example:16` |
| `vendureProductId` in seeds/fixtures | **None in repo** | `scripts/` has only `generate-blur-placeholders.mjs`. No fixtures with IDs. Live Payload not queried. |
| Print-packet terminal in `catalog.ts` | **N/A** — file missing | Spec §4.3 terminal not implemented |

---

## 5. Availability model

### Committed at `fc064c8` (Phase 0 tip)

| Question | Finding | Evidence |
|---|---|---|
| `ARCHIVE_SOLD_STATUSES` | **Still present** | `lib/unifiedAvailability.ts:8–14` (committed) — Set includes `sold`, `not-for-sale`, `on-loan`, `reserved`, `on-consignment` |
| Exhaustive `Record<ArchiveStatus, UnifiedAvailability>` | **No** (committed) | Special-case branches ahead of the Set (`:24–30`) |
| `forsale` in mappers | Wrong comparison still | `forsale: raw.availabilityStatus === 'original-available'` / same for list (`artworkFromPayload.ts:191,344` committed) |
| Fallthrough to `'available'` | **No** — fail-closed to `'not-for-sale'` | Committed `:32–35` |
| Phase 0 badge fix | `not-for-sale` / `on-loan` distinct | Checked ahead of Set; `StatusBadge` on next-intl |

### Working tree (uncommitted Phase 0b)

| Question | Finding | Evidence |
|---|---|---|
| `ARCHIVE_SOLD_STATUSES` | **Removed** | Replaced by `ARCHIVE_STATUS_MAP` |
| Exhaustive Record | **Yes** | `Record<ArchiveAvailabilityStatus, UnifiedAvailability>` covering six statuses (`unifiedAvailability.ts:29–36` WT). `reserved` / `on-consignment` → `'not-for-sale'` |
| `forsale` in both mappers | From unified helper | `getUnifiedAvailabilityFromDoc(...) === 'available'` (WT mapper `:192`, `:345`) |
| Fallthrough to `'available'` | **No** | Unknown → `'not-for-sale'` (`resolveArchiveStatus(...) ?? 'not-for-sale'`) |

---

## 6. Data layer

| Item | Exists? | Detail |
|---|---|---|
| `lib/studioPeriods.ts` | **No** | Spec shape (`dates`, `city`, `slotCount`, `slotsTaken`, `currentPriceByTier`) — no file, no consumers |
| Unmade photograph pool | **No** | No collection, static module, or dedicated type. Closest: empty `images: []` on browse tier (`neighborhoodDefaults.ts:40–44`). ACH `SourcePhotograph` is for painted works (`types/ach.ts`), not the pool. Spec minimum fields (slug, image, city, neighborhood, year, lat, lng, sourceLicense, sourceUrl, roughMask/transfer, skyOptions) — **none as a pool** |
| `SmallPrints` / `packetSalesCount` | **No** in `*.{ts,tsx}` | Named only in docs (`build-spec.md`, addenda) |
| `commission-inquiries` source field | **No** | Mailto form only (`InquiryForm.tsx`). Neighborhood string goes in email body, not an order store |
| Payload sale-webhook receiver | **No** | No `app/api/` routes. No HMAC-SHA256, timestamp check, or `orderCode` dedupe |

---

## 7. CLAUDE.md known-broken table

Quoted from current `CLAUDE.md` (still present on `fc064c8` and working tree). Code state at `fc064c8` / WT:

| CLAUDE.md quote | Still true of code? | Evidence |
|---|---|---|
| `ArtworkPage.tsx:38` — `PREVIEW_ALL_MINI_NAV = true` forces MiniNav; lines 129–132 unreachable | **False** | Constant gone. Props-only signature `:37–41`. MiniNav gated `:125–129` |
| `getTriptychPanelsForArtwork` (~137–148) — depth 1 + full mapper; bypasses allowlist | **False** | `lib/data.ts:140–141` — `buildSiteSeriesWhereParams(seriesSlug)`, `depth: 2` |
| `ListCard` / `HeroListItem` — `placeholder="blur"` + 1×1 `blurDataURL`; CSS fighting | **False** | No blur props in either component. Grep for `placeholder="blur"` / `blurDataURL` in `*.{ts,tsx}` → zero hits |
| `heroFields.ts:22,31,60` — `HERO_FORCE_SLUG = null` + unreachable branches | **False** | `resolveHeroDevFallbackSlug()` / `HERO_DEV_FALLBACK_SLUG` at `lib/heroFields.ts:21–28` |
| `hero-timeline.ts:70` — `ENABLE_HERO_UNPAINT_ON_EXIT = false`, unused | **False** | Export removed in `fc064c8` (3-line deletion vs `162fb8c`) |
| `Nav.tsx:36–38` — three `href: '#'` stubs | **False** | Series group is only MoP (`Nav.tsx:33–36`). No `#` stubs |

Dormant files named in CLAUDE.md “Live vs dead”: all deleted at `fc064c8` except `HomeListControls.tsx` (kept, unmounted).

---

## 8. Content readiness

| Surface | Real data | Hardcoded / placeholder / default |
|---|---|---|
| Homepage studio-period line | — | **Absent.** No UI, no `studioPeriods.ts`. `/` is list only (`page.tsx` → `PaintingList`) |
| `/commissions` price + ladder | Route missing; `/neighborhood` uses Payload global when seeded (`lib/data.ts:251–330`, `fromCms: true`) else defaults | Defaults: `priceLabel: '$1,800'`, `sizeLabel: '36″ × 36″'`, `fromCms: false` (`neighborhoodDefaults.ts:75–85`). Spec ladder ($800 / trip rungs) **not** in shell or defaults — founding-collector block only |
| Sky options | — | **Absent** (no configure UI, no named options) |
| Print-set paper-size labels | CMS `size` enum `large`/`small` only | UI: ``{set.size} print edition`` (`TriptychCommerce.tsx:57`) — capitalised enum, **not** A3/A5. Matches spec “no paper-size label” |
| In-situ photograph slots | — | Revisited tier images are caption-only, no URLs (`neighborhoodDefaults.ts:50–65`). Shell empty slot class `neighborhood-source-placeholder` (`NeighborhoodPageShell.tsx:97–100`) |
| MoP commerce copy | Edition / remaining / release from Payload when present | Disabled cart + “Store checkout will be available…” when Vendure unset (`TriptychCommerce.tsx:86–89`) |
| Homepage hero artwork | Payload `heroEligible` / heroFields (or optional `HERO_DEV_FALLBACK_SLUG`) | — |
| Homepage list | Payload via site-series allowlist | — |

---

## 9. Homepage and artwork page

### Homepage vs §3.2 four bands

| §3.2 band | Present on `/`? | What renders |
|---|---|---|
| 1. Hero | **Yes** (conditional) | `HeroListItem` when default filters + eligible artwork (`PaintingList.tsx:37–38`) |
| 2. Fault line | **No** | `FaultLine` not on homepage (used on artwork / triptych / design-system) |
| 3. Three funnels + studio-period line | **No** | List continues with `ListCard` only |
| 4. Newsletter (Substack) | **No** | Absent |

Also: `SiteChrome` after list. MoP link is in nav only, not a homepage band.

### Hero files vs pre–Phase 0 (`162fb8c`)

| File | Byte-identical to `162fb8c`? | Diff `162fb8c..fc064c8` |
|---|---|---|
| `components/Home/HeroListItem.tsx` | **No** | −4 lines: remove blur import/local/`placeholder="blur"` + `blurDataURL` |
| `components/Home/hero-timeline.ts` | **No** | −3 lines: remove `ENABLE_HERO_UNPAINT_ON_EXIT` |

WT identical to HEAD for both files. Choreography timing/structure otherwise unchanged (deletions only; no timing edits).

### ArtworkPage (§3.3 checklist)

| Item | State | Evidence |
|---|---|---|
| `StoryColumns` | Still rendered | `ArtworkPage.tsx:154–157` |
| `HistoricalDatesTimeline` | Kept | `:161` |
| Commercial ask | **Absent** | Status badge only `:172–177`; no inquire/buy/commission CTA |
| Archive link gate | **Ungated** — always shown | `:178–185` hardcoded `ARCHIVE_ARTWORK_BASE` + slug |
| MiniNav preview flag | Already removed (Phase 0) | `:125–129` data gates |

---

## 10. §12 open decisions — evidence only

| Decision | Current code state |
|---|---|
| Josefin Sans scope | Comment still “list card titles only” (`lib/fonts.ts:17–18`). Applied on four CSS selectors: `.painting-list-title`, `.hero-list-caption`, `.hero-list-play-hint`, `.historical-date-year` (`globals.css` ~1052, 1500, 1612, 1768). Tailwind `font-card` → Josefin (`tailwind.config.js:75`) |
| Artwork title font and size | TitleBlock / InfoTab: Barlow / body font **1.125rem/600** (`.title-block-text`, InfoTab styles). Token `text-artwork-title` = Limelight 2.5rem (`tailwind.config.js:93`) used on page shells (e.g. `NeighborhoodPageShell`), **not** on TitleBlock/InfoTab |
| Limelight on prices | `NeighborhoodPageShell.tsx:170–171` — price uses `font-display` (Limelight) |
| Nav panel colour | Live `bg-[#FBFAF7]` (`Nav.tsx:178`). Token `surface-nav: '#ECECEC'` (`tailwind.config.js:17`) unused by Nav |
| Open-nav logo behaviour | Wordmark shifts right when open (`Logo.tsx:15,24`). Tagline/byline stack fades `opacity-0` (`Logo.tsx:36–37`). Group does not travel together |

---

## 11. Health

| Check | Result | Detail |
|---|---|---|
| `npm run build` | **Pass** | Next 16.1.6 Turbopack; compiled + TypeScript + static generation OK |
| `npx tsc --noEmit` | **Pass** | Exit 0 |
| `npm run lint` | **11 errors / 7 warnings** | Matches Phase 0 baseline (11 / 7). No new findings relative to that baseline |

### Lint errors (11)

| File | Line (approx) | Rule / kind |
|---|---|---|
| `app/[locale]/layout.tsx` | 20 | `@typescript-eslint/no-explicit-any` |
| `components/Artwork/RevealSlider.tsx` | 34 | `react-hooks/set-state-in-effect` |
| `components/Artwork/TitleBlock.tsx` | 25 | `react-hooks/set-state-in-effect` |
| `components/Artworks/ArtworkMap.tsx` | 65 | `react-hooks/set-state-in-effect` |
| `components/Artworks/ArtworkMap.tsx` | 143 (×2) | Compilation skipped / memoization |
| `components/Home/HeroListItem.tsx` | 165 | `react-hooks/set-state-in-effect` |
| `components/UI/ArtworkAnimationOverlay.tsx` | 22 | `react-hooks/set-state-in-effect` |
| `components/UI/NavPersistentRow.tsx` | 32 | `react-hooks/set-state-in-effect` |
| `providers/HistoryProvider.tsx` | 176 | `react-hooks/set-state-in-effect` |
| `providers/HistoryProvider.tsx` | 191 | `react-hooks/set-state-in-effect` |

### Lint warnings (7)

| File | Kind |
|---|---|
| `app/[locale]/[slug]/opengraph-image.tsx` | `jsx-a11y/alt-text` |
| `components/Artworks/ArtworkMap.tsx` | `no-img-element`, unused var, exhaustive-deps |
| `components/Home/HeroListItem.tsx` | exhaustive-deps |
| `components/Home/hero-timeline.ts` | unused `_fieldCount` |
| `components/UI/ArtworkAnimationOverlay.tsx` | `no-img-element` |

---

## 12. Doc drift

Claims that are false or stale given the code evidence above. Quoted; not rewritten.

| Document | Claim | Evidence it is stale |
|---|---|---|
| `docs/build-spec.md` §10 Phase 0 | Marked **DONE 17 Sep 2026**, branch `phase-0-fix-and-clear` | Phase 0 commit exists and matches the work, but is **not merged into `main`**. `main` remains at pre-Phase-0 `162fb8c`. |
| `CLAUDE.md` Known-broken table (all six rows) | Lists PREVIEW_ALL_MINI_NAV, triptych depth, blur, HERO_FORCE_SLUG, ENABLE_HERO_UNPAINT, `#` nav stubs as current bugs | All six fixed in `fc064c8`; table unchanged on that same commit |
| `CLAUDE.md` Hard rules | *No blur placeholders… Currently violated* | Blur props removed at `fc064c8` |
| `CLAUDE.md` Architecture invariants | *Every artwork query must route through `buildSiteSeriesWhereParams`. Two currently do not* | Triptych sibling query fixed at `lib/data.ts:140`. (Hero dev path remains opt-in via env — separate.) |
| `CLAUDE.md` Live vs dead | *two hero implementations… Eleven files are dormant* | Dead stack deleted in `fc064c8`; only `HomeListControls` remains dormant-by-design |
| `CLAUDE.md` / `build-spec.md` §3 | Current `RESERVED_SLUGS` list omits that Phase 0 did not add `paintings`/`commissions`/`prints` | Still accurate as a *current* list; stale only if read as the target list |
| `docs/build-spec.md` §4 | *`VENDURE_SHOP_API` is not in `.env.example`. It should be added, commented out* | Still true — neither `VENDURE_SHOP_API` nor `COMMERCE_ADAPTER` added |
| `docs/build-spec.md` §10a-bis | Structural fix framed as Phase 1 work | Branch `phase-0b-availability-model` + uncommitted WT implement it outside Phase 1; no commit yet |
| Audit 1 route table | Describes pre-Phase-0 dormant components on artwork page stack as live | Still accurate for routes; dormant-file inventory in Audit 1 §component tables is superseded by Phase 0 deletions |

---

## Not found anywhere in the repo

Items the build spec names that have **no** trace in code, fixtures, or (where noted) only appear as prose in docs:

| Spec item | Searched | Result |
|---|---|---|
| `lib/commerce/` (`catalog.ts`, `static.ts`, `vendure.ts`) | filesystem | Absent |
| `COMMERCE_ADAPTER` env / reader | `*.{ts,tsx}`, `.env.example` | Absent |
| Commented `VENDURE_SHOP_API` in `.env.example` | `.env.example` | Absent (only `NEXT_PUBLIC_VENDURE_SHOP_API=`) |
| `vendure-token` header | `lib/vendure.ts` | Absent |
| Commerce adapter round-trip script (Phase 1 gate) | `scripts/` | Absent |
| Seeded / fixture `vendureProductId` values | `scripts/`, fixtures | Absent (type fields only) |
| Print-packet payment / order-request terminal | `catalog.ts` | File absent |
| `lib/studioPeriods.ts` | `lib/` | Absent |
| Unmade photograph pool (collection / static / type) | codebase | Absent |
| `skyOptions` data or UI | codebase | Absent |
| `/paintings` route | `app/` | Absent |
| `/commissions` route | `app/` | Absent |
| `/commissions/configure` route | `app/` | Absent |
| `/prints` route | `app/` | Absent |
| `paintings` / `commissions` / `prints` in `RESERVED_SLUGS` | `lib/reservedSlugs.ts` | Absent |
| `/neighborhood` → `/commissions` redirect | routes / `next.config` | Absent |
| `/series` → `/paintings` redirect | `series/page.tsx` | Absent (redirects to `/`) |
| Homepage fault-line band | homepage tree | Absent |
| Homepage three funnels | homepage tree | Absent |
| Homepage newsletter / Substack band | homepage tree | Absent |
| Homepage studio-period line | homepage tree | Absent |
| Artwork-page commercial ask | `ArtworkPage.tsx` | Absent |
| Archive-link prominence gate field | `ArtworkPage.tsx` | Absent (always loud) |
| `SmallPrints` collection | code | Absent (docs only) |
| `packetSalesCount` | code | Absent (docs only) |
| `commission-inquiries` + `source` field | code | Absent |
| Payload sale-webhook receiver (HMAC / timestamp / `orderCode` dedupe) | `app/api/` | Absent |
| Ladder copy on commissions page ($800 / trip rungs) | `neighborhoodDefaults` / shell | Absent |
| In-situ photograph image URLs | defaults / CMS wiring in this repo | Absent (caption-only placeholders) |

---

*Audit 4 · Composer · 7 October 2026 · read-only · output only this file*
