# A Colorful History — Build Plan
## Actionable roadmap from existing scaffold to full site

*Generated June 2026. Read alongside the docs index below before starting any work.*

---

## Purpose

This document translates the locked design and architecture specs in `/docs` into a sequenced build plan. It maps **what already exists** in the Next.js repo against **what the docs require**, then breaks remaining work into phases with concrete tasks, acceptance criteria, and doc references.

Use this as the single checklist for implementation. Update task checkboxes as work completes.

---

## Doc reference index

| Document | Use when |
|---|---|
| `master-brief.md` | Ecosystem context, commercial rhythm, data architecture principles |
| `ach-site-design-and-architecture.md` | **Primary route map**, page specs, June scope, navigation structure |
| `design-system.md` | Tokens, typography, field/dense zones, component patterns, constraints |
| `ach-schema-and-build.md` | Payload ACH tab fields, commerce, JSON-LD, Cursor implementation order |
| `schema-summary.md` | Collection overview, city placeholder colours, Vendure sync model |
| `brief-01-artwork-page-design.md` | Individual artwork page — locked spec (in architecture doc) |
| `brief-02-triptych-page-design.md` | MoP triptych + series overview — locked spec |
| `brief-03-map-tour-design.md` | Map open questions (tour mode deferred; base map mostly built) |
| `brief-04-store-ribba-design.md` | Store + RIBBA builder — post-June design questions |
| `brief-05-schema-implementation.md` | Payload schema implementation checklist |
| `voice-and-hero-sequence.md` | Homepage hero animation, voice principles |
| `handoff-artwork-page.md` | Early artwork page planning prompt (superseded by Brief 01) |
| `handoff-mop-series-triptych.md` | MoP triptych handoff notes |
| `handoff-store.md` | Store handoff notes |
| `site-structure-handoff.md` | Planning prompt only — superseded by architecture doc |

---

## Current state audit

### What works today

| Area | Status | Location |
|---|---|---|
| Next.js App Router | ✓ Running | `app/` |
| i18n EN/DE | ✓ Configured | `i18n/`, `messages/` |
| Global artwork state | ✓ Partial | `providers/HistoryProvider.tsx` |
| Home page shell | ✓ List view only | `app/[locale]/page.tsx` |
| Artwork list | ✓ Basic layout | `components/Artworks/ArtworkList.tsx` |
| Navigation panel | ✓ Hamburger, map/list toggle, locale flags | `components/UI/Nav.tsx` |
| Logo | ✓ SVG component | `components/UI/Logo.tsx` |
| Artwork detail route | ✓ Placeholder only | `app/[locale]/[slug]/page.tsx` |
| AR route | ✓ Placeholder only | `app/[locale]/[slug]/ar/page.tsx` |
| Data fetch | ✓ WordPress GraphQL | `lib/data.ts`, `lib/graphql.ts` |

### Scaffold exists but is not wired or is broken

| Area | Issue | Location |
|---|---|---|
| Map view | Commented out on home; not reachable | `components/Artworks/Artworks.tsx` |
| MapLibre map | Code present; **deps not in package.json**; old import paths | `components/Artworks/ArtworkMap.tsx` |
| Map nav strip | Wrong import paths (`@/svg/` vs `@/svgs/`, `@/components/artwork/map/`) | `components/Map/MapNav.tsx` |
| Filter tab | Component exists; not integrated | `components/Map/FilterDot.tsx` |
| Artwork animation | Referenced in old map code; helper paths may be stale | `ArtworkMap.tsx`, `helpers/` |
| Design tokens | **Old rainbow spectrum** — docs require painting palette only | `app/globals.css`, `tailwind.config.js` |
| Typography | Arial default — docs require Barlow Semi Condensed + Limelight | `app/globals.css`, `app/layout.tsx` |
| Breakpoints | Uses `lg:` in artwork page — docs allow **only `l:` at 769px** | `components/Artworks/ArtworkSlug.tsx` |

### Not started (required by docs)

| Area | Target route(s) | Doc |
|---|---|---|
| Payload CMS data layer | Replace GraphQL | `schema-summary.md`, `ach-schema-and-build.md` |
| Route restructure | See architecture route map | `ach-site-design-and-architecture.md` |
| Landing page (flexible sections) | `/` | Architecture doc § Landing page |
| Series explorer (map + list) | `/series` | Architecture doc § Map page (route renamed — see below) |
| Full artwork page | `/[locale]/[slug]` | Brief 01 |
| MoP series overview | `/series/mediums-of-perception` | Brief 02 |
| Berlin triptych page | `/series/mediums-of-perception/berlin` | Brief 02 |
| AR experience page | `/experience` | Architecture doc § AR experience |
| JSON-LD (per page + corpus) | `/archive.jsonld`, embedded | `ach-schema-and-build.md` Part 5 |
| Vendure commerce on triptych | `#commerce` anchor | Brief 02, schema Part 3 |
| mind.js AR runtime | Artwork + print trigger | Brief 01 § AR |
| Hero animation | Landing `hero` section | `voice-and-hero-sequence.md` |
| About page | `/about` | Post-June |
| Store + RIBBA | `/store` | Brief 04 — post-June |
| Tours (Gates of Perception) | Map tour mode | Brief 08 in architecture doc |
| Field Notes system | `/fieldnotes/*` | Brief 07 — post-June |

### Route decisions

All routes live under `app/[locale]/…` for i18n. Locale prefix is omitted below (e.g. `/series` means `/en/series` or `/de/series`).

| Route | Status | Notes |
|---|---|---|
| `/[slug]` | ✓ Exists | **Artwork detail — keep as-is.** No `/artwork/` segment. |
| `/[slug]/ar` | ✓ Exists | AR runtime per artwork |
| `/` | Partial | Landing — flexible sections (not map/list) |
| `/series` | Not built | **Collection explorer** — map on load, list via toggle |
| `/series/mediums-of-perception` | Not built | MoP overview (nested under `/series`) |
| `/series/mediums-of-perception/[city]` | Not built | Triptych + commerce |
| `/experience` | Not built | AR editorial page |

**Intentional deviations from architecture doc:**

1. **Artwork URLs:** Doc specifies `/artwork/[slug]`. This project keeps `/[locale]/[slug]`. Brief 01 page spec unchanged.
2. **Collection explorer:** Doc specifies `/map`. This project uses **`/series`** — map is the default view, list is the alternate; the route name reflects the whole collection, not just the map. Map/list UI and behaviour unchanged from architecture doc § Map page.

**`/series` route tree:**

```
/series                              ← map (default) + list toggle, all artworks
/series/mediums-of-perception        ← MoP series overview
/series/mediums-of-perception/berlin ← triptych + commerce
```

**Slug collision guard:** Reserve top-level segments (`series`, `experience`, `about`, `store`, `fieldnotes`, etc.) so they are not treated as artwork slugs. Static routes under `app/[locale]/series/` take precedence over `[slug]`.

---

## Build phases

Work in phase order. Do not skip Phase 0–2 — later pages depend on them.

---

## Phase 0 — Repair the scaffold
*Goal: dev environment runs all existing components; map/list toggle works again.*

### 0.1 Dependencies

- [ ] Add map packages: `@vis.gl/react-maplibre`, `maplibre-gl`
- [ ] Add animation packages when needed: `gsap` (hero, tour scrub, artwork animation)
- [ ] Add AR when implementing runtime: `mind-ar` / `mind-ar-js` (confirm version from existing AR work)
- [ ] Remove or do not reinstall `react-medium-image-zoom` — docs explicitly retired it

**Acceptance:** `npm run build` passes with map deps installed.

### 0.2 Fix broken imports and paths

- [ ] Audit and fix all `@/svg/` → `@/svgs/` imports
- [ ] Fix `@/components/artwork/map/` → `@/components/Map/` paths
- [ ] Align `useHistory` import — some files use `@/providers/HistoryProvider`, others expect a hook export
- [ ] Reconcile `Artwork` type — `ArtworkMap.tsx` imports from `@/types/history` which may not exist; unify under `types/`

**Files to touch:** `components/Artworks/ArtworkMap.tsx`, `components/Map/MapNav.tsx`, `components/Map/MapNavImage.tsx`, `components/Map/FilterDot.tsx`, `helpers/index.ts`

**Acceptance:** No TypeScript errors on map-related components.

### 0.3 Reconnect map ↔ list toggle

- [ ] Uncomment / wire map in `components/Artworks/Artworks.tsx`
- [ ] Respect `history.viewMap` from Nav toggle — show `ArtworkMap` or `ArtworkList`
- [ ] Verify pin click → artwork animation → navigate to detail (per `site-structure-handoff.md`)

**Acceptance:** Map/list toggle works; map pins navigate to `/[slug]`. (Wired on home during Phase 0; moves to `/series` in Phase 3.)

### 0.4 Integrate filter tab + map nav strip

- [ ] Mount `FilterDot` on map view (series/city filter dots)
- [ ] Mount `MapNav` bottom strip (110px, thumbnail scroll)
- [ ] Connect filter state to `HistoryProvider.filtered`

**Doc ref:** `site-structure-handoff.md` § What already exists

**Acceptance:** Bottom strip scrolls; filter tab slides up; filtered pins update.

---

## Phase 1 — Design system foundation
*Goal: Tailwind tokens, fonts, and global constraints match `design-system.md` before building new pages.*

### 1.1 Color tokens

- [ ] Replace rainbow CSS variables in `globals.css` with painting palette tokens from `design-system.md` §2
- [ ] Update `tailwind.config.js` — remove retired spectrum colours; add `$paint-*` and surface/text tokens
- [ ] Add city placeholder colour utility or helper: Berlin, SF, Munich, Amsterdam, fallback (`schema-summary.md` § Image Placeholder Colours)

### 1.2 Typography

- [ ] Load **Barlow Semi Condensed** (UI, body, metadata) via `next/font`
- [ ] Load **Limelight** (artwork titles on detail page, series headings with ornament)
- [ ] Build `TitleOrnament` component (broken double rule + diamond ◆, 70% title width)
- [ ] Remove Arial as default body font

### 1.3 Layout primitives

- [ ] `FaultLine` component — 2px `#3A3F4A` + 1px `#F0E8C0` hairline
- [ ] Field zone / dense zone spacing utilities (generous vs tight padding)
- [ ] Configure Tailwind breakpoint: **only `l:` at 769px** — remove usage of `sm`/`md`/`lg`/`xl` in new code; fix existing violations

### 1.4 Shared image loading pattern

- [ ] `ArtworkImagePlaceholder` — flat `cityPlaceholderColor` + optional `overlayRects` animation
- [ ] Never use Next.js blur placeholder

**Doc ref:** `design-system.md`, `site-structure-handoff.md` § What NOT to do

**Acceptance:** A test page renders with correct fonts, palette, fault line, and placeholder behaviour.

---

## Phase 2 — Data layer & types
*Goal: frontend reads from Payload (bernardbolter.com) with ACH tab fields, not WordPress GraphQL.*

> **Note:** Payload CMS lives on the archive project. This site is a **consumer** (`schema-summary.md` § Architecture). Phase 2 assumes the archive Payload instance exposes a REST or GraphQL API with ACH fields populated.

### 2.1 API client

- [ ] Create `lib/payload.ts` — fetch helper with locale param, typed responses, revalidation
- [ ] Replace `lib/graphql.ts` usage in `lib/data.ts`
- [ ] Environment variables: `PAYLOAD_API_URL`, `PAYLOAD_API_KEY` (if needed)

### 2.2 TypeScript models

- [ ] Extend `types/artwork.ts` to match ACH tab groups (`ach-schema-and-build.md` Part 2):
  - Map & tour: `mapPresence`, `lat`, `lng`, `cityPlaceholderColor`, `overlayColors`, `overlayRects`, `tourStopCopy`
  - Source photograph group
  - Stories: `olderStory`, `newerStory`, `keyHistoricalDates`
  - Reveal slider: `transferImage`, `sliderAxis`
  - AR: `arEnabled`, `arVideos`, `arMarkerFile`, etc.
  - MoP: `imageCaptureLabel`, `triptychPosition`, `availabilityStatus`, `triptych` relation
- [ ] Add `types/triptych.ts`, `types/series.ts`, `types/homePage.ts` for singleton sections

### 2.3 Data fetching functions

- [ ] `getArtworksLite()` — map/list (slug, title, lat/lng, thumbnail, overlayColors, city, series, mapPresence)
- [ ] `getArtworkBySlug(slug, locale)` — full artwork page payload
- [ ] `getTriptychByCity(city, locale)` — triptych + 3 panel artworks + commerce fields
- [ ] `getMoPSeriesOverview(locale)` — all triptychs for series page
- [ ] `getHomePageSections(locale)` — HomePage singleton
- [ ] `getExperiencePage(locale)` — ExperiencePage singleton

**Acceptance:** Home page and artwork detail load from Payload with Berlin triptych panel data available.

---

## Phase 3 — Route architecture
*Goal: add missing routes under `app/[locale]/`; keep artwork at `/[locale]/[slug]`.*

Implement under `app/[locale]/`:

| Task | Route | File | Priority |
|---|---|---|---|
| [ ] Landing page | `/` | `page.tsx` (exists — replace list-only shell) | P0 — June |
| [ ] Series explorer (map + list) | `/series` | `series/page.tsx` | P0 — June |
| [ ] Artwork detail | `/[slug]` | `[slug]/page.tsx` (exists — expand in place) | P0 — June |
| [ ] AR runtime | `/[slug]/ar` | `[slug]/ar/page.tsx` (exists — expand in place) | P0 — June |
| [ ] MoP series overview | `/series/mediums-of-perception` | `series/mediums-of-perception/page.tsx` | P0 — June |
| [ ] Triptych detail | `/series/mediums-of-perception/[city]` | `series/mediums-of-perception/[city]/page.tsx` | P0 — June |
| [ ] AR experience | `/experience` | `experience/page.tsx` | P0 — June |
| [ ] JSON-LD corpus | `/archive.jsonld` | `archive.jsonld/route.ts` | P1 — June |
| [ ] About | `/about` | `about/page.tsx` | P2 — post-June |
| [ ] Store | `/store` | `store/page.tsx` | P2 — post-June |
| [ ] Field notes (protected) | `/fieldnotes/*` | `fieldnotes/…` | P3 — post-June |

### 3.1 Navigation update

- [ ] Update `Nav.tsx` links — artwork links use `/[slug]` not `/artwork/[slug]`
- [ ] Top-level items for June: Home, **Series** (`/series`), Mediums of Perception (`/series/mediums-of-perception`), Experience
- [ ] Store and About links hidden or marked post-June until built
- [ ] Series page pin click, list cards, triptych panel links → `/[locale]/[slug]`

### 3.2 Reserved segments & routing

- [ ] Define reserved slugs: `series`, `experience`, `about`, `store`, `fieldnotes`, `archive.jsonld` (and locale codes)
- [ ] Ensure `[slug]` dynamic route does not catch reserved paths — static routes take precedence in App Router; verify with integration test
- [ ] Keep `/[slug]/ar` for mind.js runtime; non-AR devices on artwork page link to `/experience` per Brief 01

**Acceptance:** All June routes resolve; nav and map links use `/[locale]/[slug]`; locale prefix preserved; no slug collisions with section routes.

---

## Phase 4 — June launch pages (MVP)
*Minimum for 48 Stunden Neukölln — Berlin triptych live and purchasable.*

### 4.1 Landing page `/`

**Doc:** Architecture doc § Landing page — flexible component stage

- [ ] `HomePage` singleton — `sections[]` with `type` + `visible`
- [ ] Section renderers:
  - [ ] `hero` — featured painting or current city drop
  - [ ] `series-feature` — MoP current series CTA
  - [ ] `series-link` — "Explore the full collection →" links to `/series`
  - [ ] `ar-feature` — AR experience promo
  - [ ] `exhibition` — pulls from Events ACH tab when `featuredOnACH && achVisible`
- [ ] Hero animation (GSAP) — defer full polish if needed, but reserve section slot (`voice-and-hero-sequence.md`)

**Acceptance:** Bernard can reorder/toggle sections in Payload; Berlin drop is featured.

### 4.2 Series page `/series`

**Doc:** Architecture doc § Map page; `site-structure-handoff.md` § Map  
*(Same UI and behaviour as the architecture “map page” — route renamed to `/series`.)*

- [ ] Move map/list explorer from home to `/series`
- [ ] **Default view: map** on page load (`history.viewMap: true`)
- [ ] Nav toggle switches map ↔ list (same components as today)
- [ ] Pin click → animation → `/[slug]`; list cards → `/[slug]`
- [ ] Keep: grayscale Protomaps tiles, palette pin colours, bottom strip, hamburger nav, filter tab
- [ ] Do **not** redesign existing map chrome
- [ ] Tour mode — **out of June scope** (Brief 03 + Brief 08 open questions)

**Acceptance:** `/series` loads map by default; list toggle works; all `mapPresence: true` artworks appear.

### 4.3 Artwork page `/[slug]`

**Doc:** Brief 01 (full spec in `ach-site-design-and-architecture.md`)

Build components in this order:

| # | Component | Notes |
|---|---|---|
| 1 | `ArtworkImage` | Full width, city placeholder + overlayRects loading |
| 2 | `TitleBlock` | Floating top-right, seeded random position, z-index toggle |
| 3 | `MiniNav` | Slider / AR / Magnifier / Share — conditional icons |
| 4 | `FaultLine` | Between field and dense zones |
| 5 | `InfoTab` | Painting object + source photograph panels |
| 6 | `StoryColumns` | `olderStory` / `newerStory` |
| 7 | `HistoricalDatesTimeline` | 3–5 dates, Wikipedia links, overlayColors nodes |
| 8 | `RevealSlider` | Three states, axis toggle, auto-sweep, optional field recording audio |
| 9 | `ZoomMode` | 1600px draggable, minimap key, zoom+reveal combined |
| 10 | `ARLink` + device-aware AR entry | mind.js on supported devices; else link to `/experience` |
| 11 | `TriptychLink` | MoP panels only — quiet link to triptych `#commerce` |
| 12 | `StatusBadge` | original-available / sold / prints-only |
| 13 | `opengraph-image.tsx` | Thumbnail centred on cityPlaceholderColor square |

- [ ] Embed `VisualArtwork` JSON-LD in page source
- [ ] Prev/next panel navigation when `triptychPosition` is set

**Acceptance:** Berlin triptych panels each have full ACH experience; share sheet produces correct OG image.

### 4.4 MoP series overview `/series/mediums-of-perception`

**Doc:** Brief 02 § MoP series overview page

- [ ] List all triptychs — three small panels, city in Limelight, technology arc labels, status badge
- [ ] Link each entry to triptych page
- [ ] Mediums of War section at bottom (not separate route)

**Acceptance:** Munich + Berlin triptychs listed; MoW reachable from bottom of page.

### 4.5 Triptych page `/series/mediums-of-perception/berlin`

**Doc:** Brief 02 § Triptych page

- [ ] Mobile: one large panel top, two small bottom, tap to swap featured panel
- [ ] Mobile: confirmation overlay on featured panel tap before navigating to artwork page
- [ ] Desktop: three equal panels, hover shows title + "View details →"
- [ ] `imageCaptureLabel` beneath each panel
- [ ] Source photographs small beneath each panel with credit
- [ ] Triptych concept copy (dense zone, damask optional)
- [ ] Commerce section `id="commerce"`:
  - [ ] Original set status
  - [ ] Large print edition (15) — `printAvailableCount` from Payload
  - [ ] Small print edition (30)
  - [ ] `signedAndNumbered` note
  - [ ] Add to cart → Vendure client API

**Acceptance:** Visitor can purchase Berlin prints; panel pages link to `#commerce`.

### 4.6 AR experience page `/experience`

**Doc:** Architecture doc § AR experience page

- [ ] Payload singleton — editable copy, demo clips
- [ ] Explain Making / History / Freestyle
- [ ] Physical print requirement framed positively
- [ ] Link to store / triptych commerce when available
- [ ] JSON-LD: `HowTo`, `VideoObject`, `Product` references

**Acceptance:** Non-AR devices land here from artwork AR icon; page is reachable from main nav.

### 4.7 AR runtime (mind.js)

**Doc:** Brief 01 § AR entry point

- [ ] Load `.mind` marker from Payload `arMarkerFile`
- [ ] Three video buttons using `arButtonColors` / posters
- [ ] 8–10s timeout overlay with Try again / Learn more → `/experience`
- [ ] Works on physical painting and print

**Acceptance:** AR demonstrable in studio at launch.

### 4.8 JSON-LD

**Doc:** `ach-schema-and-build.md` Part 5, Brief 07 Part 5

- [ ] `generateArtworkJsonLd()` utility — includes ACH fields, `isBasedOn`, `locationCreated.sameAs`
- [ ] Per-artwork embedded JSON-LD on artwork pages
- [ ] `/archive.jsonld` public corpus route (`revalidate: 3600`)

**Acceptance:** Valid VisualArtwork output for Berlin panels; corpus endpoint returns ItemList.

### 4.9 Vendure integration (minimal)

**Doc:** `ach-schema-and-build.md` Part 3

- [ ] Client-side add-to-cart on triptych commerce section
- [ ] Display `printAvailableCount` from Payload (webhook-synced)
- [ ] Webhook endpoint lives on archive/Payload side — confirm ownership; ACH only displays counts

**Acceptance:** Purchase flow completes for Berlin print edition.

---

## Phase 5 — Post-June

Prioritised backlog. Design decisions marked "open" in docs must be resolved in dedicated sessions before building.

### 5.1 Store `/store` + RIBBA builder

**Doc:** `brief-04-store-ribba-design.md`, `handoff-store.md`

- [ ] Resolve 9 open design questions (entry points, selection UX, sold-out states)
- [ ] RIBBA: select 5 from ~80 square prints, persistent tray, Vendure custom order fields
- [ ] `SmallPrints` collection populated in Payload

### 5.2 About page `/about`

**Doc:** `voice-and-hero-sequence.md`, architecture doc

- [ ] Hybrid archive facts + ACH editorial (Artists ACH tab)
- [ ] Damask in dense zones; core line + 120-year thought underneath
- [ ] Ambient overlay rects (randomised palette — no per-artwork data)

### 5.3 Map tours

**Doc:** Brief 03 (open questions), Brief 08 (Gates of Perception — detailed spec)

- [ ] `Tours` Payload collection
- [ ] Tour mode UI: scrub progress, play mode, legend panel, map layers (GeoJSON)
- [ ] Gates of Perception — 17 stops, first production tour
- [ ] Grand Tour — cross-city sequence

### 5.4 Field Notes system

**Doc:** Brief 07 in architecture doc

- [ ] FieldNotes collection + Hetzner processing pipeline
- [ ] Protected `/fieldnotes/*` UI
- [ ] `/fieldnotes.jsonld` public corpus

### 5.5 Hero animation (full polish)

**Doc:** `voice-and-hero-sequence.md`

- [ ] GSAP ScrollTrigger desktop / arrow-trigger mobile
- [ ] Brandenburger Tor → Kottbusser Tor arc with copy states
- [ ] Requires full uncropped source photographs (see dependencies)

### 5.6 Archive intelligence (external dependency)

**Doc:** `site-structure-handoff.md` § Separate project

- [ ] CLIP embeddings, agent-assisted field filling — built on bernardbolter.com, not here
- [ ] ACH consumes enriched data via Payload when available

---

## External dependencies & blockers

These are **content/infrastructure tasks**, not frontend code — but they block launch if missing.

| Blocker | Blocks | Owner |
|---|---|---|
| Payload ACH tab populated for Berlin triptych | Artwork + triptych pages | Art/Official + Bernard |
| Berlin AR videos × 9 + `.mind` markers | AR runtime | Bernard |
| Vendure products + pricing for Berlin editions | Commerce section | Vendure workstream |
| Payload API exposed to acolorfulhistory.com | Phase 2 | Archive project |
| Vendure webhook → Payload `printAvailableCount` | Accurate edition counts | Archive project |
| Brandenburg + Kottbusser uncropped source photos | Hero animation | Bernard |
| Brief 03 map tour decisions (9 questions) | Tour mode | Design session |
| Brief 04 store decisions (9 questions) | Store/RIBBA | Design session |

---

## Suggested sprint order

For a single developer/agent working sequentially:

```
Week A — Phase 0 + Phase 1
  Repair map, deps, imports → design tokens, fonts, primitives

Week B — Phase 2 + Phase 3
  Payload client + types → new routes + nav

Week C — Phase 4.2 + 4.3
  /series page (map + list) → artwork page (field zone + dense zone core)

Week D — Phase 4.3 continued + 4.5
  Reveal slider, zoom, AR entry → Berlin triptych page

Week E — Phase 4.1 + 4.4 + 4.6 + 4.7 + 4.8 + 4.9
  Landing, series overview, experience page, AR runtime, JSON-LD, Vendure

Post-launch — Phase 5 in doc priority order
```

---

## Definition of done — June launch

All must be true:

- [ ] `/` — landing with MoP Berlin feature, series link, AR feature
- [ ] `/series` — map on load, list toggle; full collection navigation
- [ ] `/[slug]` — full Brief 01 experience for each Berlin panel (flat slug, no `/artwork/` prefix)
- [ ] `/series/mediums-of-perception` — lists Munich + Berlin
- [ ] `/series/mediums-of-perception/berlin` — triptych + working commerce
- [ ] `/experience` — AR explanation page in EN + DE
- [ ] AR demonstrable on Berlin panels/prints via mind.js
- [ ] JSON-LD on artwork pages + `/archive.jsonld` live
- [ ] EN/DE throughout — UI from JSON files, content from Payload locales
- [ ] Design system constraints respected (palette, fonts, `l:` only, no blur placeholders)

---

## How to use this document

1. **Starting a work session:** Pick the next unchecked task in the current phase.
2. **Before coding a page:** Read the doc named in the task row + `design-system.md` constraints.
3. **After completing a phase:** Run `npm run build`, smoke-test routes, update checkboxes here.
4. **When specs change:** Update `ach-site-design-and-architecture.md` first, then sync this plan.

---

*This plan supersedes ad-hoc build order. Architecture and brief docs remain authoritative for design decisions — this document is authoritative for implementation sequencing.*
