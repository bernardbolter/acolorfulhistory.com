# Addendum — Route & component inventory

Read-only audit. Code as of 16 September 2026. No quality judgments. Locale visitor paths assume next-intl default `localePrefix: 'always'` (`i18n/routing.js` sets locales `en` / `de` and default `en`, and does not set `localePrefix`). `proxy.ts` matches `/` and `/(de|en)/…`. Paths below are written as `/en/…`; `/de/…` is the same tree.

---

## 1. Routes

| Visitor path | File | Component tree | Content state |
|---|---|---|---|
| `/en` | `app/[locale]/page.tsx` | `PaintingList` → optional `HeroListItem` + `ListCard` (`PaintingListMeta`); `SiteChrome` → `Logo`, `Nav` → `NavPersistentRow`. Data: `getHomepageArtworks`, `getHeroEligibleArtwork`. | Real list. Empty copy when `listArtworks.length === 0 && !showHero` (`PaintingList.tsx`). Hero omitted unless default filters and a hero-eligible artwork exist. |
| `/en/map` | `app/[locale]/map/page.tsx` | `MapExplorerLoader` (dynamic, `ssr: false`) → `MapExplorer` → `ArtworkMap`, `FilterSort` → `FilterDot`, `ArtworkAnimationOverlay`; `SiteChrome`. Pins from `HistoryProvider` (`getArtworksLite` in locale layout). | Real map. Fallback tile style if `NEXT_PUBLIC_PROTOMAPS` unset (`ArtworkMap.tsx`). |
| `/en/series` | `app/[locale]/series/page.tsx` | none (server `redirect({ href: '/', locale })`) | Redirect to `/en`. |
| `/en/series/mediums-of-perception` | `app/[locale]/series/mediums-of-perception/page.tsx` | `MoPOverviewPage` → `TitleOrnament`, `TriptychOverviewRow` → `StatusBadge`; `SiteChrome`. Data: `getMoPSeriesOverview`. | Real if series doc exists. `comingSoon` if `overview` is null, or if overview exists but `triptychs.length === 0`. Optional MoW section if `discoverable === false` triptychs exist. |
| `/en/series/mediums-of-perception/[city]` | `app/[locale]/series/mediums-of-perception/[city]/page.tsx` | `TriptychPageShell` → `TitleOrnament`, `TriptychPanels`, `FaultLine`, `TriptychCommerce`; `SiteChrome`. Data: `getTriptychByCity`. | Real if triptych found. `comingSoon` if `triptych` is null. |
| `/en/experience` | `app/[locale]/experience/page.tsx` | `ExperiencePageShell` → `TitleOrnament`; `SiteChrome`. Data: `getExperiencePage`. Optional JSON-LD. | Real if global exists. `comingSoon` if `page` is null. |
| `/en/neighborhood` | `app/[locale]/neighborhood/page.tsx` | `NeighborhoodPageShell` → `TitleOrnament`, `NeighborhoodInquiryForm`; `SiteChrome`. Data: `getNeighborhoodPage` (CMS or `lib/neighborhoodDefaults.ts`). | Real (defaults if global empty). |
| `/en/about` | `app/[locale]/about/page.tsx` | `PlaceholderPage` → `TitleOrnament`; `SiteChrome`. | Placeholder / `comingSoon`. |
| `/en/store` | `app/[locale]/store/page.tsx` | `PlaceholderPage` → `TitleOrnament`; `SiteChrome`. | Placeholder / `comingSoon`. |
| `/en/design-system` | `app/[locale]/design-system/page.tsx` | `DesignSystemPreview` → `TitleOrnament`, `FaultLine`, `FieldZone`, `DenseZone`, `ArtworkImagePlaceholder`. No `SiteChrome`. | Real internal preview. |
| `/en/[slug]` | `app/[locale]/[slug]/page.tsx` | `ArtworkSlug` → `ArtworkPage` → `FieldZone`, `ArtworkImage` → `ArtworkImagePlaceholder`, `TitleBlock`, `MiniNav`, `FaultLine`, `DenseZone`, `InfoTab`, `StoryColumns`, `ARLink`, `HistoricalDatesTimeline`, `TriptychLink`, `StatusBadge`, `RevealSlider`, `ZoomMode`; `SiteChrome`. JSON-LD script. Data: `getArtworkBySlug`, `getTriptychPanelsForArtwork`. | Real artwork, or `notFound()` if reserved slug / missing doc. |
| `/en/[slug]/ar` | `app/[locale]/[slug]/ar/page.tsx` | `ARViewer` only. No `SiteChrome`. Data: `getArtworkBySlug`. | Real AR UI, or placeholder copy inside `ARViewer` when `!ach.arEnabled` or no video. `notFound()` if reserved / missing. |
| `/en/[slug]/opengraph-image` | `app/[locale]/[slug]/opengraph-image.tsx` | `ImageResponse` (no React page tree). Data: `getArtworkBySlug`. | Generated OG image. |
| `/en/archive.jsonld` | `app/[locale]/archive.jsonld/route.ts` | Route handler, no components. Data: `getArtworksLite`, `generateCorpusJsonLd`. | JSON-LD response. |
| `/en` layout | `app/[locale]/layout.tsx` | `NextIntlClientProvider` → `HistoryProvider` wrapping all locale pages. Fetches `getArtworksLite`. | Shell only. |
| `/` (html) | `app/layout.tsx` | Fonts + `globals.css` + `{children}`. | Shell only. |

Layouts / special files that are not visitor pages: `app/layout.tsx`, `app/[locale]/layout.tsx`, `app/[locale]/[slug]/opengraph-image.tsx`.

Locale middleware: `proxy.ts` (`next-intl` `createMiddleware`). No `middleware.ts`. No `app/**/not-found.tsx`.

### Reserved slugs vs route files

`lib/reservedSlugs.ts` `RESERVED_SLUGS`: `series`, `map`, `experience`, `neighborhood`, `about`, `store`, `fieldnotes`, `archive.jsonld`, `design-system`. `isReservedSlug` also treats `en` and `de` as reserved.

| Reserved slug | Matching route file |
|---|---|
| `series` | `app/[locale]/series/page.tsx` |
| `map` | `app/[locale]/map/page.tsx` |
| `experience` | `app/[locale]/experience/page.tsx` |
| `neighborhood` | `app/[locale]/neighborhood/page.tsx` |
| `about` | `app/[locale]/about/page.tsx` |
| `store` | `app/[locale]/store/page.tsx` |
| `fieldnotes` | **No corresponding route file** |
| `archive.jsonld` | `app/[locale]/archive.jsonld/route.ts` |
| `design-system` | `app/[locale]/design-system/page.tsx` |

| Route file segment | In `RESERVED_SLUGS`? |
|---|---|
| `series`, `map`, `experience`, `neighborhood`, `about`, `store`, `design-system`, `archive.jsonld` | Yes |
| `[slug]`, `[slug]/ar`, `series/mediums-of-perception`, `series/mediums-of-perception/[city]` | Nested under reserved `series` or catch-all; segments `mediums-of-perception`, `ar`, `[city]` are **not** in `RESERVED_SLUGS` (they do not need to be for `[slug]` collision: `series` is reserved). |

Nav entries with `href: '#'` (not routes): Breaking Down Art, The Gates of Perception, Mediums of War (`components/UI/Nav.tsx` lines 36–38).

---

## 2. Components

Import graph is from `.ts`/`.tsx` under `app/`, `components/`, `providers/`, `lib/` (excluding `node_modules`, `.next`, `.git`, `docs/`). Dynamic import of `MapExplorer` counted. Type-only imports counted.

| Path | Lines | Imported by |
|---|---|---|
| `components/AR/ARViewer.tsx` | 118 | `app/[locale]/[slug]/ar/page.tsx` |
| `components/Artwork/ARLink.tsx` | 23 | `components/Artwork/ArtworkPage.tsx` |
| `components/Artwork/ArtworkImage.tsx` | 39 | `components/Artwork/ArtworkPage.tsx` |
| `components/Artwork/ArtworkPage.tsx` | 214 | `components/Artworks/ArtworkSlug.tsx` |
| `components/Artwork/HistoricalDatesTimeline.tsx` | 93 | `components/Artwork/ArtworkPage.tsx` |
| `components/Artwork/InfoTab.tsx` | 129 | `components/Artwork/ArtworkPage.tsx` |
| `components/Artwork/MiniNav.tsx` | 97 | `components/Artwork/ArtworkPage.tsx` |
| `components/Artwork/RevealSlider.tsx` | 120 | `components/Artwork/ArtworkPage.tsx` |
| `components/Artwork/StatusBadge.tsx` | 30 | `components/Artwork/ArtworkPage.tsx`, `components/Triptych/TriptychOverviewRow.tsx` |
| `components/Artwork/StoryColumns.tsx` | 41 | `components/Artwork/ArtworkPage.tsx` |
| `components/Artwork/TitleBlock.tsx` | 62 | `components/Artwork/ArtworkPage.tsx` |
| `components/Artwork/TriptychLink.tsx` | 71 | `components/Artwork/ArtworkPage.tsx` |
| `components/Artwork/ZoomMode.tsx` | 87 | `components/Artwork/ArtworkPage.tsx` |
| `components/Artworks/ArtworkList.tsx` | 97 | `components/Artworks/Artworks.tsx` only |
| `components/Artworks/ArtworkMap.tsx` | 357 | `components/Artworks/MapExplorer.tsx`, `components/Artworks/Artworks.tsx` |
| `components/Artworks/ArtworkSlug.tsx` | 24 | `app/[locale]/[slug]/page.tsx` |
| `components/Artworks/Artworks.tsx` | 30 | **nothing** |
| `components/Artworks/MapExplorer.tsx` | 26 | `components/Artworks/MapExplorerLoader.tsx` (dynamic) |
| `components/Artworks/MapExplorerLoader.tsx` | 11 | `app/[locale]/map/page.tsx` |
| `components/Home/HeroFieldLayer.tsx` | 40 | `components/Home/HeroListItem.tsx` |
| `components/Home/HeroListItem.tsx` | 405 | `components/Home/PaintingList.tsx` |
| `components/Home/HomeListControls.tsx` | 178 | **nothing** (comment only in `PaintingList.tsx`) |
| `components/Home/HomeSectionRenderer.tsx` | 94 | `components/Pages/LandingPage.tsx` only |
| `components/Home/ListCard.tsx` | 67 | `components/Home/PaintingList.tsx`, `components/Home/HeroListItem.tsx` |
| `components/Home/PaintingList.tsx` | 47 | `app/[locale]/page.tsx` |
| `components/Home/PaintingListMeta.tsx` | 30 | `components/Home/ListCard.tsx`, `components/Home/HeroListItem.tsx` |
| `components/Home/hero-timeline.ts` | 360 | `components/Home/HeroListItem.tsx` |
| `components/Map/FilterDot.tsx` | 21 | `components/Map/FilterSort.tsx` |
| `components/Map/FilterSort.tsx` | 91 | `components/Artworks/MapExplorer.tsx`, `components/Artworks/Artworks.tsx` |
| `components/Map/MapNav.tsx` | 93 | `components/Artworks/ArtworkMap.tsx` |
| `components/Map/MapNavImage.tsx` | 48 | `components/Map/MapNav.tsx` |
| `components/Neighborhood/InquiryForm.tsx` | 184 | `components/Pages/NeighborhoodPageShell.tsx` |
| `components/Pages/ExperiencePageShell.tsx` | 88 | `app/[locale]/experience/page.tsx` |
| `components/Pages/LandingPage.tsx` | 38 | **nothing** |
| `components/Pages/MoPOverviewPage.tsx` | 69 | `app/[locale]/series/mediums-of-perception/page.tsx` |
| `components/Pages/NeighborhoodPageShell.tsx` | 231 | `app/[locale]/neighborhood/page.tsx` |
| `components/Pages/PlaceholderPage.tsx` | 22 | `app/[locale]/about/page.tsx`, `app/[locale]/store/page.tsx` |
| `components/Pages/TriptychPageShell.tsx` | 75 | `app/[locale]/series/mediums-of-perception/[city]/page.tsx` |
| `components/Shell/SiteChrome.tsx` | 11 | `app/[locale]/page.tsx`, `map/page.tsx`, `[slug]/page.tsx`, `about/page.tsx`, `store/page.tsx`, `experience/page.tsx`, `neighborhood/page.tsx`, `series/mediums-of-perception/page.tsx`, `series/mediums-of-perception/[city]/page.tsx` |
| `components/Triptych/TriptychCommerce.tsx` | 95 | `components/Pages/TriptychPageShell.tsx` |
| `components/Triptych/TriptychOverviewRow.tsx` | 65 | `components/Pages/MoPOverviewPage.tsx` |
| `components/Triptych/TriptychPanels.tsx` | 169 | `components/Pages/TriptychPageShell.tsx` |
| `components/UI/ArtworkAnimationOverlay.tsx` | 92 | `components/Artworks/MapExplorer.tsx`, `components/Artworks/Artworks.tsx` |
| `components/UI/ArtworkImagePlaceholder.tsx` | 70 | `components/Artwork/ArtworkImage.tsx`, `components/Artworks/ArtworkList.tsx`, `components/Triptych/TriptychPanels.tsx`, `components/UI/DesignSystemPreview.tsx` |
| `components/UI/DenseZone.tsx` | 15 | `components/Artwork/ArtworkPage.tsx`, `components/UI/DesignSystemPreview.tsx` |
| `components/UI/DesignSystemPreview.tsx` | 124 | `app/[locale]/design-system/page.tsx` |
| `components/UI/FaultLine.tsx` | 13 | `components/Artwork/ArtworkPage.tsx`, `components/Pages/TriptychPageShell.tsx`, `components/UI/DesignSystemPreview.tsx` |
| `components/UI/FieldZone.tsx` | 15 | `components/Artwork/ArtworkPage.tsx`, `components/UI/DesignSystemPreview.tsx` |
| `components/UI/Loader.tsx` | 14 | `components/Artworks/ArtworkList.tsx` only |
| `components/UI/Logo.tsx` | 72 | `components/Shell/SiteChrome.tsx` |
| `components/UI/Nav.tsx` | 238 | `components/Shell/SiteChrome.tsx` |
| `components/UI/NavPersistentRow.tsx` | 110 | `components/UI/Nav.tsx` |
| `components/UI/TitleOrnament.tsx` | 46 | `PlaceholderPage`, `ExperiencePageShell`, `MoPOverviewPage`, `TriptychPageShell`, `NeighborhoodPageShell`, `DesignSystemPreview` |
| `components/hero/HeroCanvas.tsx` | 116 | `components/hero/HeroSection.tsx` |
| `components/hero/HeroCopy.tsx` | 66 | `components/hero/HeroSection.tsx` |
| `components/hero/HeroMobileArrow.tsx` | 35 | `components/hero/HeroSection.tsx` |
| `components/hero/HeroSection.tsx` | 163 | `components/hero/HeroSectionLoader.tsx` |
| `components/hero/HeroSectionLoader.tsx` | 10 | `components/Home/HomeSectionRenderer.tsx` only |
| `components/hero/hero-states.ts` | 111 | `components/hero/HeroSection.tsx`, `HeroCanvas.tsx`, `HeroCopy.tsx`, `hero-timeline.ts` |
| `components/hero/hero-timeline.ts` | 116 | `components/hero/HeroSection.tsx` |

**Imported by nothing (zero importers):** `components/Artworks/Artworks.tsx`, `components/Home/HomeListControls.tsx`, `components/Pages/LandingPage.tsx`.

---

## 3. Dead and dormant code

### Components imported nowhere

| File | Notes |
|---|---|
| `components/Artworks/Artworks.tsx` | No importer. Former list/map toggle shell. |
| `components/Home/HomeListControls.tsx` | No import statement anywhere. |
| `components/Pages/LandingPage.tsx` | No importer. Former CMS-section homepage. |

### Components only reachable through unused parents

| File | Only imported by |
|---|---|
| `components/Artworks/ArtworkList.tsx` | `Artworks.tsx` |
| `components/UI/Loader.tsx` | `ArtworkList.tsx` |
| `components/Home/HomeSectionRenderer.tsx` | `LandingPage.tsx` |
| `components/hero/HeroSectionLoader.tsx` | `HomeSectionRenderer.tsx` |
| `components/hero/HeroSection.tsx` | `HeroSectionLoader.tsx` |
| `components/hero/HeroCanvas.tsx` | `HeroSection.tsx` |
| `components/hero/HeroCopy.tsx` | `HeroSection.tsx` |
| `components/hero/HeroMobileArrow.tsx` | `HeroSection.tsx` |
| `components/hero/hero-states.ts` | old hero stack |
| `components/hero/hero-timeline.ts` | `HeroSection.tsx` |

`ArtworkMap`, `FilterSort`, `ArtworkAnimationOverlay` are also imported by unused `Artworks.tsx`, but they are live via `/map`.

### Exported `lib/` (and helpers) functions/constants called nowhere

“Called nowhere” = no import/call outside the defining file (internal use in the same file does not count as unused).

| Export | File | Line |
|---|---|---|
| `ACH_SERIES_SLUG` | `lib/siteSeries.ts` | 46; re-exported `lib/data.ts` 42 |
| `getHomePageSections` | `lib/data.ts` | 186 |
| `getHomepageFacets` | `lib/homepageArtworks.ts` | 227 |
| `mapPayloadArtworkLite` | `lib/mappers/artworkFromPayload.ts` | 274 |
| `payloadMediaDimensions` | `lib/mappers/media.ts` | 24 |
| `relationTitle` | `lib/mappers/media.ts` | 68 |
| `sortArtworksForList` | `lib/sortArtworks.ts` | 4 |
| `artworkPlaceLabel` | `lib/sortArtworks.ts` | 12 |
| `listMediumLabel` | `lib/listCardMeta.ts` | 63 |
| `LIST_IMAGE_HEIGHT_CAP` | `lib/listImageSizing.ts` | 4 |
| `photoRectTransformOrigin` | `lib/heroFields.ts` | 209 |
| `ENABLE_HERO_UNPAINT_ON_EXIT` | `components/Home/hero-timeline.ts` | 70 |
| `seededPosition` | `helpers/seededRandom.ts` | 106 |
| `TITLE_POSITION_CELLS_ORIGINAL` | `helpers/seededRandom.ts` | 103 |

`getUnifiedAvailability` is only called from `artworkMatchesAvailabilityFilter` in the same file (`lib/unifiedAvailability.ts` 55). `artworkMatchesAvailabilityFilter` is imported by `lib/homepageArtworks.ts`.

### Commented-out, hardcoded false, unreachable conditions

| File | Line | Quote |
|---|---|---|
| `components/Home/PaintingList.tsx` | 34 | `{/* HomeListControls hidden for now — will become a fixed-position component later. */}` — no JSX for the component; import absent. |
| `components/Home/hero-timeline.ts` | 70 | `export const ENABLE_HERO_UNPAINT_ON_EXIT = false` — exported; never read. |
| `components/Artwork/ArtworkPage.tsx` | 38 | `const PREVIEW_ALL_MINI_NAV = true` |
| `components/Artwork/ArtworkPage.tsx` | 129–132 | `showSlider={PREVIEW_ALL_MINI_NAV \|\| hasReveal}` (and `showAr` / `showMagnifier` / `showShare`) — right-hand gates are unreachable while the constant is `true`. |
| `lib/heroFields.ts` | 22 | `export const HERO_FORCE_SLUG: HeroPoolSlug \| null = null` |
| `lib/heroFields.ts` | 31 | `if (HERO_FORCE_SLUG) return HERO_FORCE_SLUG` — unreachable while the constant is `null`. Same pattern at line 60. |
| `components/UI/Nav.tsx` | 36–38 | `{ href: '#', labelKey: 'breakingDownArt' }` (and Gates / Mediums of War) — links that do not navigate. |
| `components/Artwork/ARLink.tsx` | 13 | `if (!arEnabled) return null` — live on the artwork page; MiniNav AR icon is independently forced on by `PREVIEW_ALL_MINI_NAV`. |

No other `{/* <Component` comment-outs found under `components/`. `Nav.tsx` 188–194 is a documentation comment around live JSX, not a disabled component.

### `@deprecated`

| Marker | Replacement | Used everywhere? |
|---|---|---|
| `types/artwork.ts:50` `seriesTitle` — “Use seriesName” | `seriesName` | Mapper still writes both (`artworkFromPayload.ts` 269, 344). Live reader: `listSeriesLabel` (`lib/listCardMeta.ts:57`) `artwork.seriesName \|\| artwork.seriesTitle`. No other component reads `seriesTitle`. |
| `lib/siteSeries.ts:45` `ACH_SERIES_SLUG` — “Use SITE_SERIES_SLUGS” | `SITE_SERIES_SLUGS` / `ACH_MAIN_SERIES_SLUG` | `ACH_SERIES_SLUG` has no importers. `ACH_MAIN_SERIES_SLUG` is used (`listCardMeta.ts`, `homepageArtworks.ts` hero query). |

---

## 4. Payload field usage

Mappers: `lib/mappers/artworkFromPayload.ts` (`mapPayloadArtworkToArtwork` / `mapAchFields` / `mapPayloadArtworkForList`), `lib/mappers/triptychFromPayload.ts`, plus globals in `lib/data.ts` (`getExperiencePage`, `getNeighborhoodPage`, `getHomePageSections`). “Rendered” includes UI components, JSON-LD, and OG image.

### Fetched and rendered somewhere

| Field (Artwork / ACH / related) | Where rendered |
|---|---|
| `slug`, `title` | List, hero, artwork page, map, OG, JSON-LD, links |
| `primaryImageUrl` / `artworkFields.artworkImage.mediaItemUrl` | `ListCard`, `HeroListItem`, `ArtworkImage`, map thumbs, OG |
| `primaryImageThumbnailUrl` | `opengraph-image.tsx` |
| `placeholderBlurDataURL` | `ListCard`, `HeroListItem` (list mapper only) |
| `aspectRatio`, `artworkFields.proportion`, `orientation`, `sizeTier`, `widthCm`/`heightCm` / `artworkFields.width`/`height` | List sizing, artwork stage, InfoTab dimensions |
| `yearCreated` / `artworkFields.year` | InfoTab, list year fallback, JSON-LD |
| `artworkFields.city` | Titles, list meta, placeholders, OG fallback, triptych nav |
| `artworkFields.lat` / `lng` (and `ach.lat`/`lng`) | Map pins via `hasMapLocation` |
| `artworkFields.medium` | InfoTab via `formatMediumLabel` |
| `seriesSlug`, `seriesName` | List series tag; InfoTab series line; sibling query |
| `availabilityStatus` / `ach.availabilityStatus` | `StatusBadge`, list facets (if controls were mounted), `TriptychCommerce` status |
| `triptychSlug` / `ach.triptychSlug` / `ach.triptychPosition` | `TriptychLink`, InfoTab, sibling fetch |
| `ach.cityPlaceholderColor` | Placeholders, OG background |
| `ach.overlayColors` | MiniNav / StatusBadge accent, blur hex, map unused here |
| `ach.overlayRects` | `ArtworkImage` → `ArtworkImagePlaceholder` |
| `ach.source.sourceImageUrl`, `sourceImageAltText`, `sourceTitle`, `sourceCreator`, `sourceInstitution`, `imageCaptureType`/`imageCaptureLabel`, `approximateDateYear` | InfoTab, hero photo, `heroAssets`, list year |
| `ach.source.sourceCredit` | `TriptychPanels` |
| `ach.source.sourceWikimediaCommonsUrl` | JSON-LD `sameAs` |
| `ach.olderStory`, `newerStory` | `StoryColumns`; JSON-LD description |
| `ach.shareDescription` | Metadata, share, MiniNav `showShare` (gated while preview flag on) |
| `ach.keyHistoricalDates` | `HistoricalDatesTimeline`; JSON-LD `mentions` |
| `ach.locationWikidataUri`, `locationTGNUri` | JSON-LD Place |
| `ach.fieldRecordingUrl`, `transferImageUrl`, `sliderAxis` | `RevealSlider` |
| `ach.arEnabled`, `arMarkerFileUrl`, `arButtonColors`, `arVideos` | `ARLink`, `ARViewer`, MiniNav |
| `ach.hero.heroEligible`, `heroFields`, `heroPhotoUrl` | `HeroListItem` via `resolveHeroAnimationPayload` |
| `ach.imageCaptureLabel` | `TriptychPanels`, `TriptychOverviewRow` |
| Triptych: `city`, `year`, `concept`, `status`, `panels`, `printSets` (size, edition, `printAvailableCount`, `vendureProductId`), `vendureProductId`, `signedAndNumbered`, `printEditionReleaseDate` | `TriptychPageShell` / `TriptychCommerce` / overview row |
| Series: `title`/`name`, `description` | `MoPOverviewPage` heading + body |
| Experience global: `title`, `introduction`, `body`, `demoClips`, `storeLink` | `ExperiencePageShell` |
| Neighborhood global + defaults: `title`, `kicker`, `introduction`, `pitch`, `credibility`, `tiers`, `pricing`, `inquiryEmail`, `ctaLabel` | `NeighborhoodPageShell` / `InquiryForm` |

### Mapped into Artwork / ACH / Series / Triptych types but rendered nowhere

| Field | Mapper |
|---|---|
| `artwork.content` | Set to `newerStory \|\| olderStory` (`artworkFromPayload.ts` 248). JSON-LD prefers `ach` stories then `content`; UI uses `StoryColumns` only. Ambiguous whether JSON-LD counts; no component reads `artwork.content`. |
| `artwork.date` | 246 / 326 | No component read |
| `artwork.createdAt` | 250 / 327 | No component read (homepage “recent” sorts via Payload `-createdAt`, not this field) |
| `artworkFields.country` | 189 | Only unused `artworkPlaceLabel` |
| `artworkFields.forsale` | 192 (`availabilityStatus === 'original-available'`); list mapper hardcodes `false` (350) | No component read |
| `artworkFields.style` | always `''` (197 / 355) | No component read |
| `artworkFields.series` | 200–202 (detail mapper only) | UI uses `seriesName` / `seriesSlug` |
| `ach.mapPresence` | 81; list 366 | Map uses lat/lng, not this flag |
| `ach.tourSequence` | 90 | — |
| `ach.grandTour` | 91 | — |
| `ach.grandTourSequence` | 92 | — |
| `ach.tourStopCopy` | 93 | — |
| `ach.source.approximateDate` (string) | 100 | UI uses `approximateDateYear` |
| `ach.source.sourceLicense` | 110 | — |
| `ach.historyTranscript` | 143 | — |
| `ach.freestyleTranscript` | 146 | — |
| `ach.triptychId` | 157 | UI uses `triptychSlug` |
| `arVideos[].duration` | 44 | `ARViewer` does not read duration |
| Series `mapPresence`, `tourEnabled`, `tourIntro`, `grandTourIncluded`, `filterLabel`, `filterColor`, `coverImageUrl`, `period`, `cities` | `mapPayloadSeriesToSeries` | `MoPOverviewPage` only uses `title` + `description` |
| Triptych `featuredOrder`, `discoverable`, `seriesSlug` | mapper / `buildMoPOverview` filters | Used for sort/filter, not displayed |
| Home-page global `sections` | `getHomePageSections` | Function unused; `LandingPage` unused |
| `Artwork.index`, `ArtworkFields.size` | On `types/artwork.ts` (71, 32) | **Not mapped and not referenced in components** |

List mapper (`mapPayloadArtworkForList`) does not copy stories, AR, slider, transcripts, tour, share, historical dates, dimensions-as-ACH-source-full, `primaryImageThumbnailUrl`. Those exist on detail mapper only.

### Referenced in components but not present in the mappers

None found. Components read Artwork/ACH/Triptych/Series fields that the mappers set, or local props.

Ambiguous: `HeroListItem` reads `ach.source.approximateDateYear` which the **list** mapper sets (378–379) but the **detail** mapper also sets. `placeholderBlurDataURL` is list-mapper-only; detail pages do not use it.

### Fetch depth vs fields read

Default in `payloadFindDocs` / `payloadFindOneBySlug` / `payloadFindOneByField` / `payloadGetGlobal`: **depth 2**, limit 1000 (docs) or 1 (by slug/field) (`lib/payload.ts` 109–172).

| Query | Depth used | What the mapper/reader actually needs | Depth vs need |
|---|---|---|---|
| `getArtworksLite` | 1 (override), limit 500 | List mapper: `primaryImage` (+ thumbnail unused here), `series.name`, `ach` groups, `sourceImage`, lat/lng | Matches comment in `homepageArtworks.ts` 36. |
| `getHomepageArtworks` | 1, limit 500 | Same list mapper | Same. |
| `getHomepageFacets` | 0 on artworks; series names depth 0 | `seriesSlug`, `city`, `yearCreated`/`year`, `availabilityStatus`, `ach.mop.availabilityStatus` | Depth 0 is enough if `ach` groups are stored on the document (not relations). Function unused. |
| `getArtworkBySlug` | 2 (default) | Full mapper: nested media for source, transfer, field recording, AR video+poster, hero photo, series name | Depth 2 is required for AR `posterImage` inside `arVideos` (relation-in-array). |
| `getHeroEligibleArtwork` (prod + dev) | 2 | **List** mapper only (`mapPayloadArtworkForList`) plus `heroFields` JSON / `heroPhoto` / source image | **Depth 2 is higher than the list mapper’s relation depth (1).** `heroFields` is JSON on the doc (depth 0). |
| `getTriptychPanelsForArtwork` fallback | 1, limit 12 | **Full** mapper `mapPayloadArtworkToArtwork` | **Depth 1 is lower than the full mapper’s nested AR/media reads (2).** |
| `getTriptychByCity` / `getTriptychBySlug` | 2 default | Nested `panels[]` artworks + images | Depth 2 matches nested panels. |
| `getMoPSeriesOverview` series | 2 default | `name`/`title`, `description` rich text, unused cover image | Cover is a relation (depth 1 would populate it); unused. |
| `getMoPSeriesOverview` triptychs | 2 default, no limit override → 1000 | Panels + commerce fields | Depth 2 for nested panels. |
| `getHomePageSections` | 2 | Section objects on global | Unused caller. Depth 2 unused if sections have no media. |
| `getExperiencePage` | 2 | `demoClips.video` + `poster` media | Depth 2 matches nested media. |
| `getNeighborhoodPage` | 2 | `tiers[].images[].image` media | Depth 2 matches. |
| `fetchSeriesNameMap` | 0, limit 100 | `slug`, `name` | Matches. |
| `getHeroAssets` | via `getArtworkBySlug` depth 2 | `ach.source.sourceImageUrl` only | Depth 2 higher than a single media relation (1). |

---

## 5. Environment

No values from `.env.local` are listed. `NODE_ENV` is not referenced in app/lib/components (only mentioned in a docs file). `scripts/` has no `process.env` (no `generate-blur-placeholders` `process.env` under non-docs scope as scanned).

| Variable | File:line | In `.env.example`? | Fallback if unset |
|---|---|---|---|
| `PAYLOAD_API_URL` | `lib/payload.ts:13` | Yes (empty) | `''` then `NEXT_PUBLIC_PAYLOAD_API_URL`; `enabled: Boolean(baseUrl)` → fetches return `null` |
| `NEXT_PUBLIC_PAYLOAD_API_URL` | `lib/payload.ts:14` | **No** | Same chain; empty string |
| `PAYLOAD_API_KEY` | `lib/payload.ts:18` | Yes (empty) | `undefined`; Authorization header omitted |
| `NEXT_PUBLIC_VENDURE_SHOP_API` | `lib/vendure.ts:2` | Yes (empty) | `VENDURE_SHOP_API`; then falsy → `isVendureConfigured()` false, `addToCart` returns `{ success: false, error: 'Store not configured' }` |
| `VENDURE_SHOP_API` | `lib/vendure.ts:3` | **No** | Same |
| `NEXT_PUBLIC_PROTOMAPS` | `components/Artworks/ArtworkMap.tsx:38` | Yes (empty) | Demo style `https://demotiles.maplibre.org/style.json` (line 41) |
| `HERO_DEV_FALLBACK_SLUG` | `lib/heroFields.ts:29` | Yes, commented | `resolveHeroDevFallbackSlug()` returns `null` → production hero pool path |
| `NEIGHBORHOOD_INQUIRY_EMAIL` | `lib/data.ts:328`, `lib/neighborhoodDefaults.ts:83` | Yes, commented | `global.inquiryEmail` then env then defaults (`undefined` in defaults object if neither) |

---

## 6. Query inventory

All Payload HTTP goes through `payloadFetch` → `{baseUrl}/api/...`. Artwork vs not noted.

| File | Endpoint | Where / extra params | Limit | Depth | `buildSiteSeriesWhereParams`? |
|---|---|---|---|---|---|
| `lib/data.ts` `getArtworksLite` | `GET /api/artworks` | site series + `status=published` | 500 | 1 | **Yes** |
| `lib/data.ts` `getArtworkBySlug` | `GET /api/artworks` | `slug` equals + site series | 1 | 2 | **Yes** |
| `lib/data.ts` `getTriptychPanelsForArtwork` (fallback) | `GET /api/artworks` | `series.slug` equals current artwork’s series; `ach.mop.triptychPosition` exists; `status=published` | 12 | 1 | **No** (artwork query) |
| `lib/homepageArtworks.ts` `getHomepageArtworks` | `GET /api/artworks` | site series (or one selected series); optional `city`, decade year range; `sort` `yearCreated` or `-createdAt` | 500 | 1 | **Yes** |
| `lib/homepageArtworks.ts` `getHomepageFacets` | `GET /api/artworks` | site series; `sort=-createdAt` | 500 | 0 | **Yes** (unused caller) |
| `lib/homepageArtworks.ts` `getHeroEligibleArtwork` **dev slug** | `GET /api/artworks` | `status=published` + `slug` equals only | 1 | 2 | **No** (artwork query) |
| `lib/homepageArtworks.ts` `getHeroEligibleArtwork` **prod** | `GET /api/artworks` | `buildSiteSeriesWhereParams('a-colorful-history')` + `ach.hero.heroEligible=true` | 50 | 2 | **Yes** (scoped to `a-colorful-history` only, not full `SITE_SERIES_SLUGS`) |
| `lib/homepageArtworks.ts` `fetchSeriesNameMap` | `GET /api/series` | `status=published`; `slug in SITE_SERIES_SLUGS` | 100 | 0 | N/A (not artworks; uses `SITE_SERIES_SLUGS` directly) |
| `lib/data.ts` `getTriptychByCity` | `GET /api/triptychs` | `city` equals | 1 | 2 | N/A |
| `lib/data.ts` `getTriptychBySlug` | `GET /api/triptychs` | `slug` equals | 1 | 2 | N/A |
| `lib/data.ts` `getMoPSeriesOverview` | `GET /api/series` | `slug=mediums-of-perception` | 1 | 2 | N/A |
| `lib/data.ts` `getMoPSeriesOverview` | `GET /api/triptychs` | `series.slug=mediums-of-perception`; `sort=featuredOrder` | 1000 default | 2 | N/A |
| `lib/data.ts` `getHomePageSections` | `GET /api/globals/home-page` | — | — | 2 | N/A (unused caller) |
| `lib/data.ts` `getExperiencePage` | `GET /api/globals/experience-page` | — | — | 2 | N/A |
| `lib/data.ts` `getNeighborhoodPage` | `GET /api/globals/neighborhood-page` | — | — | 2 | N/A |
| `lib/heroAssets.ts` `getHeroAssets` | via `getArtworkBySlug` | same as slug query | 1 | 2 | **Yes** (inherits) |

**Artwork queries that do not use `buildSiteSeriesWhereParams`:**

1. `getHeroEligibleArtwork` when `HERO_DEV_FALLBACK_SLUG` is set (`homepageArtworks.ts` 256–264).
2. `getTriptychPanelsForArtwork` sibling fallback (`data.ts` 137–148) — filters by that artwork’s `series.slug` instead.

Vendure `POST {VENDURE_SHOP_API}/shop-api` in `lib/vendure.ts` is not Payload.

`SITE_SERIES_SLUGS` (`lib/siteSeries.ts` 10–16): `a-colorful-history`, `breaking-down-art`, `gates-of-perception`, `mediums-of-perception`, `mediums-of-war`.
