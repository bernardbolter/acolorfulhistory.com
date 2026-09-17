# Addendum — Docs inventory & contradictions

Read-only. No staleness judgments, no archive recommendations. Evidence only. 16 September 2026.

Scope: every `.md` under `docs/` (55 files). Reference existence uses [addendum-route-component-inventory.md](./addendum-route-component-inventory.md) plus the live `app/` / `components/` / `lib/` tree.

**Date note:** filesystem `mtime` is listed as last-modified. Many files share `2026-09-16 17:45` (bulk copy or checkout). Where a document prints its own date, that is cited in contradictions. Word counts are whitespace-separated tokens.

---

## 1. Inventory

Newest first.

| Last-modified (fs) | Words | Path | What it claims to decide or describe |
|---|---|---|---|
| 2026-09-16 18:03 | 2199 | `docs/artwork/addendum-style-guide-reconciliation.md` | Where live CSS/tokens differ from `design-system.md`, in three buckets; unused tokens; commerce classes. |
| 2026-09-16 17:59 | 3354 | `docs/artwork/addendum-route-component-inventory.md` | Routes, component import graph, dead code, Payload field usage, env, Payload queries. |
| 2026-09-16 17:45 | 951 | `docs/artwork/addendum-artwork-page-cursor-audit.md` | Artwork-page build audit (Aug 2026): Tier 1 data bugs closed; Payload-only data path. |
| 2026-09-16 17:45 | 1088 | `docs/cards/brief-09-list-card-images.md` | Static homepage list-card anatomy (image, Josefin title, metadata line, tap target). |
| 2026-09-16 17:45 | 1267 | `docs/nav/brief-07-header-nav-sequence.md` | Persistent language + Map/List controls outside the open panel; open/close sequence. |
| 2026-09-16 17:45 | 1309 | `docs/artwork/claude_addendum-info-source-stories-timeline.md` | InfoTab two-column painting/source, stories, historical-date timeline — as built. |
| 2026-09-16 17:45 | 932 | `docs/artwork/claude_addendum-share-og-build.md` | MiniNav share gated on `shareDescription`; OG image route. |
| 2026-09-16 17:45 | 1114 | `docs/brief-01-artwork-page-design.md` | Design decisions for the single artwork page before implementation. |
| 2026-09-16 17:45 | 340 | `docs/artwork/addendum-mop-code-fix-pass.md` | MoP empty overview honesty + triptych prev/next wrap code fixes. |
| 2026-09-16 17:45 | 1238 | `docs/nav/brief-08-nav-panel-visual-refinement.md` | Open-nav panel surface, type, grouping, padding after brief-07 structure. |
| 2026-09-16 17:45 | 4005 | `docs/artwork/addendum-homepage-cursor-audit.md` | Homepage list+hero+nav audit vs live Payload (Aug 25 2026). |
| 2026-09-16 17:45 | 544 | `docs/SFpainting/neighborhood-payload-schema.md` | Payload global `neighborhood-page` contract (`GET /api/globals/neighborhood-page`). |
| 2026-09-16 17:45 | 1106 | `docs/artwork/claude_addendum-artwork-page-fix-pass-1.md` | Artwork-page Tier 2 layout + I↔II↔III wrap against MoW data. |
| 2026-09-16 17:45 | 3734 | `docs/build-plan.md` | Sequenced build plan mapping repo vs docs; Phase 0–4 checklists. |
| 2026-09-16 17:45 | 1171 | `docs/site-scaffolding-status.md` | Per-route scaffolding status as of Aug 25 2026 (list homepage, map, MoP, neighborhood). |
| 2026-09-16 17:45 | 2962 | `docs/artwork/addendum-triptych-series-cursor-audit.md` | Triptych + MoP overview audit; zero triptych docs in Payload (Aug 25). |
| 2026-09-16 17:45 | 1360 | `docs/SFpainting/ach-neighborhood-commissions-page-brief.md` | Neighborhood Commissions page: copy, tiers, pricing, intake. |
| 2026-09-16 17:45 | 699 | `docs/artwork/claude_addendum-hero-centering-mininav-styling.md` | Artwork hero full-bleed centering + MiniNav under the painting. |
| 2026-09-16 17:45 | 13081 | `docs/ach-site-design-and-architecture.md` | Site IA, routes, map as primary mode, MoP/store/AR, 48h NK launch scope. |
| 2026-09-16 17:45 | 293 | `docs/artwork/decision-keep-site-series-allowlist.md` | Keep `SITE_SERIES_SLUGS` as site-scope allowlist, not Payload `published`. |
| 2026-09-16 17:45 | 634 | `docs/artwork/addendum-triptych-panel-detail-navigation.md` | Panel detail is the regular artwork page; prev/next wrap. |
| 2026-09-16 17:45 | 1451 | `docs/artwork/addendum-homepage-fix-pass-2.md` | Allowlist follow-up, nav surface, list-card copy, Josefin 500. |
| 2026-09-16 17:45 | 8922 | `docs/ach-schema-and-build.md` | ACH Payload schema extension, Triptychs, SmallPrints, Vendure sync. |
| 2026-09-16 17:45 | 4416 | `docs/artwork/addendum-style-system-audit.md` | `design-system.md` vs live front page (1 Sep 2026). |
| 2026-09-16 17:45 | 366 | `docs/artwork/decision-drop-wordpress-fallback.md` | Drop WordPress GraphQL fallback; Payload is the only data path. |
| 2026-09-16 17:45 | 7350 | `docs/design-system.md` | Canonical visual system: map-first, two fonts, tokens, components. |
| 2026-09-16 17:45 | 765 | `docs/artwork/claude_addendum-nav-memory-titleblock-exclusion.md` | Last-browse session memory; TitleBlock vs header collision. |
| 2026-09-16 17:45 | 1084 | `docs/artwork/payload-ach-live-audit.md` | Live Payload ACH tab/commerce/series counts (18 Aug 2026). |
| 2026-09-16 17:45 | 937 | `docs/artwork/addendum-homepage-fix-pass-1.md` | Homepage honesty fixes (hero fallback, WordPress sample, Gates allowlist). |
| 2026-09-16 17:45 | 1042 | `docs/artwork/brief-09-list-card-images.md` | Older list-card spec; banner says use `docs/cards/brief-09` for field names. |
| 2026-09-16 17:45 | 669 | `docs/artwork/decision-four-open-calls-pass-2.md` | Four Pass-2 calls: series tag hide, landscape cap, logo travel, panel padding 112px. |
| 2026-09-16 17:45 | 58 | `docs/design/design-system.md` | Stub: do not use; canonical file is `docs/design-system.md`. |
| 2026-09-12 13:09 | 3012 | `docs/SFpainting/claude_commission-funnel-research.md` | Commission funnel research; commissions as product not inventory. |
| 2026-09-12 12:36 | 3788 | `docs/SFpainting/claude_trade-audit-and-site-map.md` | Trade repositioning + proposed site map (new series/trade routes). |
| 2026-09-01 15:48 | 1432 | `docs/push/claude_exhibition-launch-status-and-roadmap.md` | Exhibition launch status and phased roadmap (Aug 25 + later). |
| 2026-08-13 11:58 | 1546 | `docs/hero/brief-13-hero-animation-choreography.md` | GSAP choreography for the list-slot hero (assumes Brief 11 fields). |
| 2026-08-12 13:37 | 1077 | `docs/cards/brief-12-list-image-sizing.md` | List image fill-by-constraint, orientation caps, placeholders. |
| 2026-08-12 13:26 | 729 | `docs/hero/brief-11-hero-animation-fields.md` | Payload `ach.hero` fields (`heroEligible` / `heroFields` / `heroPhoto`). |
| 2026-08-12 12:36 | 1613 | `docs/cards/brief-10-homepage-artwork-query.md` | Homepage artwork query rewrite; no client series allowlist. |
| 2026-08-03 13:24 | 2106 | `docs/cards/HotelBerlin_SpotlightCard_BuildBrief.md` | Hotel Berlin `SpotlightCard` (venues/events/people) — other site. |
| 2026-07-18 22:10 | 1603 | `docs/hero/brief-hero-list-system.md` | Homepage is the painting list; slot-0 self-painting hero. Claims to replace prior hero briefs. |
| 2026-07-08 00:40 | 1380 | `docs/brief-hero-animation-build.md` | Homepage hero as Brandenburg + Kottbusser two-photo sequence (pre-list-hero). |
| 2026-06-14 17:52 | 1559 | `docs/art-official-agent-design.md` | Art/Official agent workflow to populate Payload. |
| 2026-06-14 17:52 | 1061 | `docs/brief-02-triptych-page-design.md` | MoP triptych page design (three panels as one work). |
| 2026-06-14 17:52 | 952 | `docs/brief-03-map-tour-design.md` | Map & tour design; “the map is the homepage.” Brainstorm only. |
| 2026-06-14 17:52 | 1153 | `docs/brief-04-store-ribba-design.md` | Store + RIBBA 5-print set builder design. |
| 2026-06-14 17:52 | 939 | `docs/brief-05-schema-implementation.md` | Implement ACH schema in Payload (tab, collections, webhook). |
| 2026-06-14 17:52 | 717 | `docs/handoff-artwork-page.md` | New-chat prompt for the individual artwork page. |
| 2026-06-14 17:52 | 1108 | `docs/handoff-mop-series-triptych.md` | New-chat prompt for MoP overview + triptych detail. |
| 2026-06-14 17:52 | 1052 | `docs/handoff-store.md` | New-chat prompt for store / print page. |
| 2026-06-14 17:52 | 1081 | `docs/master-brief.md` | Master project brief: phased digital ecosystem, Vendure, print editions. |
| 2026-06-14 17:52 | 2299 | `docs/mow-instagram-storyboard.md` | Mediums of War Instagram posts (1 still + 4 video frames). |
| 2026-06-14 17:52 | 1453 | `docs/schema-summary.md` | Collection overview, city placeholder colours, Vendure sync model. |
| 2026-06-14 17:52 | 1352 | `docs/site-structure-handoff.md` | New-chat prompt to work out the website page by page. |
| 2026-06-14 17:52 | 1132 | `docs/voice-and-hero-sequence.md` | Voice principles and hero sequence copy from Bernard. |

---

## 2. References

Existence keyed to the inventory. **EXISTS** = route file, component file, or lib mapper/collection used in this repo. **NOT FOUND** = named in the document, absent from the inventory / tree (including git-deleted `lib/graphql.ts`, `lib/mappers/artworkFromGraphql.ts`). `proxy.ts` exists; `middleware.ts` does not.

Payload collections that **EXIST** as query targets in `lib/data.ts` / `homepageArtworks.ts`: `artworks`, `triptychs`, `series`, globals `home-page`, `experience-page`, `neighborhood-page`. **NOT FOUND** as code collections/queries: `small-prints` / `SmallPrints`, `ImageCaptureTechnologies`, `FieldNotes`.

| Document | Named routes | Named components / files | Payload collections / fields |
|---|---|---|---|
| `addendum-route-component-inventory.md` | Live tree — EXISTS (its own inventory) | Live tree — EXISTS | `artworks` `triptychs` `series` `*-page` globals EXISTS |
| `addendum-style-guide-reconciliation.md` | `/` `/map` `/series` EXISTS | Live visual components EXISTS | — |
| `addendum-style-system-audit.md` | `/` `/map` `/neighborhood` `/experience` `/store` `/about` `/design-system` `/series/mediums-of-perception` EXISTS. Contact NOT FOUND | `PaintingList` `ListCard` `Logo` `Nav` EXISTS. `Filter.js` `FarbenLogo` NOT FOUND | — |
| `design-system.md` | `/` as map-first (see §3). `/en/` `/de/` EXISTS | `Logo` `Nav` `MapNav` `ArtworkList` `Artworks` EXISTS (latter two unused). `FilterTab` `Contact` `ARView` `Artwork` `ArtworkAR` `Map` `middleware.ts` NOT FOUND | `artworks` EXISTS |
| `design/design-system.md` | none | none | none |
| `build-plan.md` | `/series` as collection explorer (file EXISTS, now redirect). `/` landing sections. `/map` EXISTS. `/artwork/[slug]` NOT FOUND (uses `/[slug]`). `/fieldnotes.jsonld` NOT FOUND | `Artworks` `ArtworkList` `graphql.ts` NOT FOUND (deleted) | `artworks` `triptychs` `series` `smallprints` — last NOT FOUND in code |
| `ach-site-design-and-architecture.md` | `/map` EXISTS. `/artwork/[slug]` NOT FOUND. `/fieldnotes*` NOT FOUND. `/` described as former map | `middleware.ts` NOT FOUND. `opengraph-image.tsx` EXISTS | `artworks` `triptychs` `smallprints` |
| `site-scaffolding-status.md` | `/` list, `/map`, `/neighborhood`, MoP routes EXISTS. `/berlin` `/munich` as city shortcuts — city lives under `/series/mediums-of-perception/[city]` EXISTS | `triptychFromPayload.ts` EXISTS | `neighborhood-page` EXISTS as query |
| `brief-hero-list-system.md` | homepage list (no `/map` as home) | `PaintingList` `HeroListItem` `HeroFieldLayer` EXISTS | `ach.hero` fields — mapped EXISTS |
| `brief-hero-animation-build.md` | `/components/hero/` `public/hero/…jpg` EXISTS | `HeroSection` `HeroCanvas` `HeroCopy` EXISTS, unused | — |
| `hero/brief-11` `brief-13` | `/` | `HeroListItem` `hero-timeline.ts` EXISTS | `heroEligible` `heroFields` `heroPhoto` mapped EXISTS |
| `cards/brief-09` `brief-10` `brief-12` | `/` | `ListCard` `PaintingList` EXISTS | `primaryImageUrl` `aspectRatio` `series.name` mapped EXISTS |
| `artwork/brief-09-list-card-images.md` | `/artwork/[slug]` NOT FOUND | — | `artwork.proportion` — mapper still writes `artworkFields.proportion`; list uses `aspectRatio` |
| `nav/brief-07` `brief-08` | `/` `/map` EXISTS | persistent row — `NavPersistentRow` EXISTS | — |
| `brief-01` `handoff-artwork-page.md` | `/artwork/[slug]` NOT FOUND | — | ACH tab fields — mapped EXISTS |
| `brief-02` `handoff-mop-series-triptych.md` | `/series/mediums-of-perception` EXISTS. `/triptych/[slug]` `/ar/[city]` NOT FOUND | — | `triptychs` EXISTS |
| `brief-03-map-tour-design.md` | map as homepage (no path table) | — | `mapPresence` mapped, not used for pins |
| `brief-04` `handoff-store.md` | `/store` EXISTS (placeholder). RIBBA UI NOT FOUND | — | `smallprints` NOT FOUND in code |
| `brief-05` `ach-schema-and-build.md` `schema-summary.md` | webhook `route.ts` NOT FOUND | `Artworks.ts` `Triptychs.ts` (CMS repo) NOT FOUND here | `SmallPrints` NOT FOUND in this app |
| `SFpainting/ach-neighborhood-commissions-page-brief.md` | `/neighborhood` EXISTS. `/commissions` `/neighborhood/[city]` NOT FOUND | — | `neighborhood-page` EXISTS |
| `SFpainting/neighborhood-payload-schema.md` | `/neighborhood` EXISTS. `/neighborhood/[city]` NOT FOUND | `neighborhoodDefaults.ts` EXISTS | `neighborhood-page` `experience-page` EXISTS |
| `SFpainting/claude_trade-audit-and-site-map.md` | `/` `/map` `/neighborhood` EXISTS. `/series/a-colorful-history` `/series/mediums-of-war` `/series/breaking-down-art` `/series/gates-of-perception` `/trade*` `/available` `/archive` NOT FOUND | `PaintingList` `InquiryForm` EXISTS. `tradeDefaults.ts` NOT FOUND | `neighborhood-page` EXISTS |
| `SFpainting/claude_commission-funnel-research.md` | `/neighborhood` EXISTS. `/commissions` `/available` `/commissions/trade` NOT FOUND | — | — |
| `decision-keep-site-series-allowlist.md` | — | `siteSeries.ts` EXISTS | five series slugs — allowlist EXISTS |
| `decision-drop-wordpress-fallback.md` | — | `graphql.ts` `artworkFromGraphql.ts` NOT FOUND (deleted, as the decision specifies) | — |
| `decision-four-open-calls-pass-2.md` | — | — | `a-colorful-history` seriesSlug EXISTS |
| `payload-ach-live-audit.md` | `/en/[slug]` EXISTS | `Artworks.ts` (CMS) NOT FOUND here | counts for `artworks` `series` `triptychs` |
| `addendum-homepage-*` `addendum-mop-*` `addendum-triptych-*` `claude_addendum-*` | mix of `/en` `/map` `/[slug]` EXISTS | named live files generally EXISTS. `ARLine.tsx` NOT FOUND (`claude_addendum-hero-centering`) | as each audit states |
| `cards/HotelBerlin_SpotlightCard_BuildBrief.md` | `/here` `/nachbarschaft` `/you-me-and-berlin` NOT FOUND in this repo | `SpotlightCard` NOT FOUND | — |
| `art-official-agent-design.md` | none | none | SmallPrints / series — CMS-side |
| `mow-instagram-storyboard.md` | none | none | — |
| `master-brief.md` `site-structure-handoff.md` `voice-and-hero-sequence.md` | Contact named in structure handoff — route NOT FOUND | — | `artworks` `triptychs` |
| `push/claude_exhibition-launch-status-and-roadmap.md` | `/` | — | `triptychs` `smallprints` |
| `site-scaffolding-status.md` | `/experience` `/store` EXISTS | — | — |

---

## 3. Contradictions

Incompatible claims about the same subject. Not adjudicated. Dates: in-document where printed; else filesystem.

### Which route the artwork list lives on

| Document | Date | Claim |
|---|---|---|
| `docs/design-system.md` §1 | Aug 2026 (footer) | “one primary mode: a full-viewport grayscale map… The ‘list’ view is secondary.” |
| `docs/brief-03-map-tour-design.md` | 2026-06-14 | “The map is the homepage. Everything else is reached through it.” |
| `docs/ach-site-design-and-architecture.md` | (fs 09-16; body: `/map` “Built ✓ (was `/`)”) | Full map at `/map`, was `/`. |
| `docs/build-plan.md` | (fs 09-16) | Collection explorer is **`/series`**: map default, list toggle. `/` is “Landing — flexible sections (not map/list).” |
| `docs/hero/brief-hero-list-system.md` | 2026-07-18 | “The homepage **is the list of paintings**.” No separate hero section. |
| `docs/cards/brief-09-list-card-images.md` | (fs 09-16; amendment Aug 25) | Homepage is a single-column list with `PaintingList` / `HeroListItem`. |
| `docs/site-scaffolding-status.md` | Aug 25 2026 | Homepage `/` is list + hero + nav; `/series` not used as explorer. |
| `app/[locale]/series/page.tsx` (code, quoted in inventory) | — | “Former series explorer — list lives at `/`, map at `/map`.” Redirects `/series` → `/`. |

### What the map is for

| Document | Date | Claim |
|---|---|---|
| `brief-03-map-tour-design.md` | 2026-06-14 | Primary navigation mode; pins for every ACH artwork; homepage. |
| `design-system.md` §1 | Aug 2026 | Primary mode: full-viewport grayscale map + strip + panel. |
| `ach-site-design-and-architecture.md` | — | `/map` = “Full map — all artworks”; nav item Map. |
| `build-plan.md` | — | Map is the default view **of `/series`**. |
| `site-scaffolding-status.md` | Aug 25 2026 | `/map` route and Map/List pill work; “deeper tour/pin design questions remain open.” Brief-03 called brainstorm-only. |
| `nav/brief-07-header-nav-sequence.md` | — | Map and List are parallel persistent browse modes (`/` vs `/map`). |

### Which series appear on this site

| Document | Date | Claim |
|---|---|---|
| `docs/cards/brief-10-homepage-artwork-query.md` | 2026-08-12 | Do not hardcode a series allowlist; published Series status is the switch. |
| `docs/artwork/payload-ach-live-audit.md` | 18 Aug 2026 | Site filter: `a-colorful-history` \| `breaking-down-art` only. Gates omitted. MoP/MoW 0 artworks. |
| `docs/artwork/addendum-homepage-cursor-audit.md` | Aug 25 2026 | `SITE_SERIES_SLUGS` is ACH+BDA; Gates 14 silently dropped; brief-10 violated. |
| `docs/artwork/addendum-homepage-fix-pass-1.md` | — | Kept allowlist; added `gates-of-perception`; did **not** add MoP/MoW. |
| `docs/artwork/addendum-homepage-fix-pass-2.md` | — | Added `mediums-of-perception` and `mediums-of-war` (0 works). |
| `docs/artwork/decision-keep-site-series-allowlist.md` | — | Keep five-slug allowlist; do not use `published` as site visibility. |
| `docs/SFpainting/claude_trade-audit-and-site-map.md` | 2026-09-12 | New series pages: `/series/a-colorful-history`, `/series/mediums-of-war`, `/series/breaking-down-art`, `/series/gates-of-perception`. |
| Inventory / `lib/siteSeries.ts` | 16 Sep 2026 | Five slugs in allowlist; no per-series routes except MoP. Nav MoW/BDA/Gates are `href: '#'`. |

### Print sizes and editions

| Document | Date | Claim |
|---|---|---|
| `docs/master-brief.md` | 2026-06-14 | Print editions: **15 sets A3, 30 sets A5** per triptych. |
| `docs/ach-schema-and-build.md` / `brief-05` / `schema-summary.md` | 2026-06-14 | `printSets[].size`: `large` · `small`. **Large = A3, Small = A5.** Edition totals on the set. Prices not in Payload. |
| `docs/brief-04-store-ribba-design.md` | 2026-06-14 | Triptych editions **plus** RIBBA pack of **5** small prints, one Vendure product. |
| `docs/SFpainting/ach-neighborhood-commissions-page-brief.md` | (fs 09-16) | Commissions: custom work, not editioned prints; pricing on the page; Vendure as deposit later. |
| `TriptychCommerce.tsx` (code) | — | Renders `set.size` + `set.edition` + `printAvailableCount`; no A3/A5 labels in the component. |

### Commerce architecture

| Document | Date | Claim |
|---|---|---|
| `master-brief.md` / `ach-schema-and-build.md` | 2026-06-14 | Payload archive + **Vendure** cart/checkout; webhook decrements `printAvailableCount`; **prices never stored in Payload**. |
| `brief-04` / `handoff-store.md` | 2026-06-14 | Store page + RIBBA builder; Vendure products for originals and both print sizes. |
| `build-plan.md` | — | Vendure client add-to-cart on triptych `#commerce` checked; webhook still open. `/store` in later phases. |
| `neighborhood-payload-schema.md` | — | `pricing.priceLabel` (and related) **on the Payload global**. Inquiry email. |
| `ach-neighborhood-commissions-page-brief.md` | — | Intake is a form, not the product catalog; Vendure deposit later. |
| `site-scaffolding-status.md` | Aug 25 2026 | Neighborhood frontend shipped; Vendure deposit and brief-upload later. `/store` still a stub. |
| Code inventory | 16 Sep 2026 | `lib/vendure.ts` optional; `/store` is `PlaceholderPage`; neighborhood `priceLabel` from CMS/defaults; no webhook route. |

### Typography

| Document | Date | Claim |
|---|---|---|
| `design-system.md` §3 | Aug 2026 | Two fonts: Barlow + Limelight. Artwork titles Limelight **2.5rem**. “Do not add a second typeface.” Limelight never for prices. |
| `handoff-artwork-page.md` | 2026-06-14 | “Title in Limelight font with ornament.” |
| `docs/cards/brief-09-list-card-images.md` | (amendment Aug 25) | List-card titles Josefin. |
| `docs/artwork/addendum-homepage-fix-pass-2.md` | — | Josefin **500 and 600** loaded; `.painting-list-title` 1.125rem/500. |
| `docs/artwork/addendum-style-system-audit.md` | 1 Sep 2026 | Three faces live; overlay title Barlow 1.125rem/600; Josefin also on hero captions and timeline years; Neighborhood price in Limelight. |
| `docs/artwork/addendum-style-guide-reconciliation.md` | 16 Sep 2026 | Same four Josefin selectors; artwork titles still Barlow; `font-card` unused. |

---

## 4. Coverage gaps

### In the codebase, mentioned by no document except the 16 Sep inventories (and sometimes the 1 Sep style audit)

From inventory §2 vs grep across `docs/` excluding the two newest addenda:

| Code | Mentioned in older docs? |
|---|---|
| `MapExplorer.tsx` / `MapExplorerLoader.tsx` | No |
| `SiteChrome.tsx` | Only `claude_addendum-nav-memory-titleblock-exclusion.md` |
| `ArtworkSlug.tsx` | `claude_addendum-hero-centering-mininav-styling.md`, `build-plan.md` |
| `StatusBadge.tsx` | No (commerce pill) |
| `proxy.ts` (next-intl middleware) | `addendum-style-system-audit.md` only; others still say `middleware.ts` |
| `/design-system` lab route | Style audit only |
| `InquiryForm.tsx` | `claude_trade-audit-and-site-map.md` |
| `lib/lastBrowseView.ts` | `claude_addendum-nav-memory-titleblock-exclusion.md` |
| `opengraph-image.tsx` | architecture doc + share addendum |

### Documents describing a feature with no corresponding code in this repo

| Document | Feature named | Code |
|---|---|---|
| `ach-site-design-and-architecture.md`, `build-plan.md`, `reservedSlugs` | Fieldnotes (`/fieldnotes`, compile/search/upload) | No route; slug reserved only |
| `site-structure-handoff.md`, `design-system.md` | Contact page | No route |
| `brief-04`, `handoff-store`, `ach-schema-and-build`, `schema-summary` | RIBBA builder, `SmallPrints` collection | No collection, no UI |
| `brief-05`, `ach-schema-and-build` | Vendure webhook → Payload | No `app/api` webhook |
| `design-system.md` §17 | `public/damask.jpg` | File not present |
| `art-official-agent-design.md` | Art/Official agent | No app in this repo |
| `mow-instagram-storyboard.md` | Instagram posts | No code |
| `cards/HotelBerlin_SpotlightCard_BuildBrief.md` | Hotel Berlin `SpotlightCard`, `/here` | Other product; not in this tree |
| `SFpainting/claude_trade-audit-and-site-map.md` | `/trade`, `/available`, per-series pages | Not in inventory routes |
| `brief-hero-animation-build.md` | Brandenburg/Kottbusser two-photo hero as homepage | `components/hero/*` files exist, **not mounted** (inventory §3) |
| `brief-03-map-tour-design.md` | Tour / Gates 17-stop experience | `tourStopCopy` mapped, rendered nowhere (inventory §4) |

---

## 5. Duplicates

Same or near-identical filenames or overlapping briefs. Paths and dates only.

| Pair / set | Paths | Dates (fs unless noted) |
|---|---|---|
| Design system | `docs/design-system.md` (7350 words) vs `docs/design/design-system.md` (58-word stub pointing at the first) | both 2026-09-16 17:45 |
| Brief 09 | `docs/artwork/brief-09-list-card-images.md` (“List Card (Single-Painting Images)”, banner: superseded for field names) vs `docs/cards/brief-09-list-card-images.md` (“List Card Anatomy & Images”) | both 2026-09-16 17:45 |
| Schema implementation | `docs/ach-schema-and-build.md` (8922) vs `docs/brief-05-schema-implementation.md` (939) vs `docs/schema-summary.md` (1453) | 09-16 / 06-14 / 06-14 |
| Artwork page start | `docs/brief-01-artwork-page-design.md` vs `docs/handoff-artwork-page.md` | both 2026-06-14 17:52 |
| MoP / triptych start | `docs/brief-02-triptych-page-design.md` vs `docs/handoff-mop-series-triptych.md` | both 2026-06-14 17:52 |
| Store start | `docs/brief-04-store-ribba-design.md` vs `docs/handoff-store.md` | both 2026-06-14 17:52 |
| Hero briefs | `docs/brief-hero-animation-build.md` (2026-07-08; two-photo sequence) vs `docs/hero/brief-hero-list-system.md` (2026-07-18; header: “Replaces all previous hero briefs”) vs `docs/hero/brief-11-hero-animation-fields.md` vs `docs/hero/brief-13-hero-animation-choreography.md` | Jul 8 / Jul 18 / Aug 12 / Aug 13 |
| Style audits | `docs/artwork/addendum-style-system-audit.md` (1 Sep 2026, in body) vs `docs/artwork/addendum-style-guide-reconciliation.md` (16 Sep 2026) | 09-16 17:45 / 09-16 18:03 |
| Neighborhood | `docs/SFpainting/ach-neighborhood-commissions-page-brief.md` vs `docs/SFpainting/neighborhood-payload-schema.md` vs `docs/SFpainting/claude_commission-funnel-research.md` | 09-16 / 09-16 / 09-12 |
| Site map / IA | `docs/ach-site-design-and-architecture.md` vs `docs/site-structure-handoff.md` vs `docs/SFpainting/claude_trade-audit-and-site-map.md` vs `docs/build-plan.md` | 09-16 / 06-14 / 09-12 / 09-16 |
