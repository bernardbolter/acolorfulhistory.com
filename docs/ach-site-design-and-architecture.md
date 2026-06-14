# ACH Site Design & Architecture
## A Colorful History · bernardbolter.com

*All design decisions, page specs, interaction specs, and site architecture in one document.*
*Combine with: ach-schema-and-build.md (for Cursor) · art-official-agent-design.md (for agent setup) · working-principles.md (always)*

*Sections:*
*1. Site Architecture & Route Map*
*2. Artwork Page Spec (Brief 01) — resolved*
*3. Triptych Page Spec (Brief 02) — resolved*
*4. Map & Tour Design (Brief 03) — open questions + tour spec*
*5. Store & RIBBA Builder (Brief 04) — post-June*
*6. Field Notes & Media Pipeline (Brief 07)*
*7. Gates of Perception Tour (Brief 08)*

---

# Site Architecture
## A Colorful History · bernardbolter.com

*Resolved route map. Reflects all decisions as of May 2026.*
*Supersedes site-structure-handoff.md which was a planning prompt, not a spec.*
*Read alongside: design-system.md · working-principles.md*

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js App Router |
| Styling | Tailwind CSS — single breakpoint `l:` at 769px only. Never sm/md/lg/xl. |
| CMS | Payload CMS v3 + Neon (Postgres) |
| Ecommerce | Vendure (independent service, loosely coupled) |
| AR | mind.js |
| Maps | @vis.gl/react-maplibre + Protomaps grayscale vector tiles |
| i18n | next-intl (EN / DE at launch, future languages via Payload locale config) |
| Schema | schema.org + JSON-LD programmatic on every page |
| Storage | Cloudflare R2 |

---

## Route map

### Public routes

| Route | Page | Status | Brief |
|---|---|---|---|
| `/` | Landing page — flexible component stage | June scope | — |
| `/map` | Full map — all artworks | Built ✓ (was `/`) | Brief 03 |
| `/artwork/[slug]` | Individual artwork page | Spec'd | Brief 01 |
| `/series/mediums-of-perception` | MoP series overview | June scope | Brief 02 |
| `/series/mediums-of-perception/[city]` | Triptych page | June scope | Brief 02 |
| `/experience` | AR experience singleton | June scope | — |
| `/store` | Store + RIBBA builder | Post-June | Brief 04 |
| `/about` | About — hybrid archive + ACH editorial | Post-June | — |
| `/archive.jsonld` | Public JSON-LD corpus — all artworks | Brief 05 | Brief 07 |
| `/fieldnotes.jsonld` | Public JSON-LD corpus — field notes | Post-June | Brief 07 |

### Protected routes

| Route | Page | Notes |
|---|---|---|
| `/fieldnotes` | Field notes UI — recent captures | Post-June, auth required |
| `/fieldnotes/upload` | Upload form | Post-June |
| `/fieldnotes/compile` | Storyboard compiler | Post-June |
| `/fieldnotes/[id]` | Clip detail | Post-June |

---

## June launch scope

Minimum viable for 48 Stunden Neukölln launch:

```
/                    Landing page with MoP feature + map link
/map                 Full map (existing, moved from /)
/artwork/[slug]      Individual artwork page (Brief 01)
/series/mediums-of-perception     MoP series overview
/series/mediums-of-perception/berlin  Berlin triptych page (Brief 02)
/experience          AR experience singleton
```

The Berlin triptych must be live and purchasable. One new city per month post-launch.

---

## Landing page — flexible component stage

**Route:** `/`
**Payload:** `HomePage` singleton with `sections` array

Each section has a `type` select and `visible` boolean. Bernard reorders and toggles via Payload admin. Frontend renders active sections in order.

**Section types:**

| Type | Purpose | June scope |
|---|---|---|
| `hero` | Featured painting or current city drop | ✓ |
| `series-feature` | MoP series — current active series | ✓ |
| `map-link` | "Explore the full collection →" | ✓ |
| `ar-feature` | AR experience feature | ✓ |
| `exhibition` | Current exhibition — pulls from Events ACH tab | ✓ when applicable |
| `store` | Prints and RIBBA | Post-June |
| `field-notes` | Recent field notes stream | Post-June |

The landing page evolves as the practice grows. New series launches, new components appear. Exhibitions come and go. Nothing is hardcoded.

---

## Map page

**Route:** `/map`
**Status:** Built and working (was the home page at `/`)

Existing components — do not redesign:
- Full viewport MapLibre GL map, grayscale Protomaps tiles
- Artwork pins in painting palette colours
- Popups with proportion-width thumbnails
- Click → artwork animation → navigates to `/artwork/[slug]`
- Map nav strip — 110px fixed bottom, thumbnail strip
- Navigation panel — hamburger, slide panel, Map↔List toggle, EN↔DE toggle
- Filter tab — fixed bottom-right, slides up, series filter dots

Map design decisions deferred to Brief 03.

---

## Individual artwork page

**Route:** `/artwork/[slug]`
**Status:** Fully spec'd — Brief 01

See Brief 01 for complete component and interaction spec. Summary:

- Field zone: full-width painting, floating title block (dynamic position, top right), mini nav strip (slider / AR / magnifier / share)
- Zoom mode: full 1600px, draggable, minimap key, zoom + reveal combined
- Reveal slider: three states, auto-sweep, axis toggle, ambient audio
- Fault line
- Dense zone: info tab (painting object / source photograph), story columns (olderStory / newerStory), AR link, key historical dates timeline, triptych link (MoP only), status badge, archive link

---

## MoP series overview page

**Route:** `/series/mediums-of-perception`
**Top level nav item** — direct link from homepage and main navigation

Lists all triptychs as they grow — one new city per month. Per entry:
- Three panels as a row (small)
- City name in Limelight
- Technology arc labels
- Availability status badge
- Link to triptych page

Mediums of War lives at the bottom of this page.

---

## Triptych page

**Route:** `/series/mediums-of-perception/[city]`
**Status:** Core decisions resolved — Brief 02

Mobile: one large panel top, two small bottom, tap to switch, confirmation overlay on featured panel tap.
Desktop: three equal panels side by side, hover reveals title and details link.
Below panels: triptych concept copy, commerce section (`id="commerce"` anchor).
Individual panel pages link directly to `#commerce` on this page.

---

## AR experience page

**Route:** `/experience`
**Payload:** Singleton page, fully editable
**Top level nav item**

Standalone editorial page explaining the AR experience. Not the AR runtime itself — that's triggered from artwork pages. This page:
- Explains what the AR experience is (Making / History / Freestyle)
- Shows demo clips of all three parts
- Explains the physical print requirement positively
- Links to store for prints
- Full JSON-LD for AEO — `HowTo`, `VideoObject`, `Product` references

Reachable from: artwork pages (AR icon on non-AR devices), main navigation, about page, store.

---

## Data architecture

**Two systems, loosely coupled:**

Payload (archive + ACH layer) is the source of truth for all content. Vendure handles commerce transactions only.

**Archive base record** — permanent structured facts. Universal across all series. Never modified for presentation concerns.

**ACH tab** — series-specific editorial layer. Added to every archive collection that surfaces on the ACH site. Same pattern universally:
- `Artworks` → stories, AR, slider, map presence
- `Events` → poster image, featured copy, CTA
- `Series` → hero image, featured triptych, editorial copy
- `Artists` → About page editorial content (hybrid)

**ACH singletons** — pages with no archive equivalent: `HomePage`, `ExperiencePage`.

**Vendure connection** — three thin references only:
1. `vendureProductId` in Payload → links to Vendure product
2. `printAvailableCount` synced via webhook → display without live API call
3. Payload document IDs in Vendure order custom fields → permanent order resolution

---

## JSON-LD endpoints

| Endpoint | Access | Contents |
|---|---|---|
| `/archive.jsonld` | Public | All published Artworks as JSON-LD ItemList |
| `/fieldnotes.jsonld` | Public | All processed FieldNotes as JSON-LD ItemList (post-June) |
| Individual artwork pages | Public | VisualArtwork JSON-LD embedded in page source |
| `/experience` | Public | HowTo + VideoObject + Product JSON-LD |

---

## Navigation structure

```
Homepage (/)
├── Mediums of Perception → /series/mediums-of-perception
├── Map → /map
├── Experience → /experience
├── Store → /store (post-June)
└── About → /about (post-June)

/map
└── pin click → artwork animation → /artwork/[slug]

/series/mediums-of-perception
└── city card → /series/mediums-of-perception/[city]

/series/mediums-of-perception/[city]
├── panel tap + confirm → /artwork/[slug]
└── #commerce → Vendure checkout

/artwork/[slug]
├── prev/next panel → adjacent /artwork/[slug]
├── triptych link → /series/mediums-of-perception/[city]#commerce
└── archive link → archive.bernardbolter.com/artwork/[slug]
```

---

## What NOT to do

- Never use sm/md/lg/xl breakpoints — only `l:` at 769px
- Never px for font sizes — rem only
- Never blur placeholder — flat cityPlaceholderColor wrapper div only
- Never duplicate data between archive base record and ACH tab
- Never store prices in Payload — Vendure only
- Never put commerce fields on individual Artwork records — triptych level only
- Never hardcode JSON-LD — always programmatic from Payload fields
- Never recreate the logo in HTML/CSS — SVG source of truth only
- Never use react-medium-image-zoom — conflicts with artwork animation

---

*Written May 2026. Update when new routes are added or decisions change.*
*This document is the reference for site structure — update before starting any new page implementation.*
-e 
---

# Brief 01 — Artwork Page Spec
## A Colorful History · bernardbolter.com

*All design decisions resolved. This is the implementation spec.*
*Read alongside: design-system.md · handoff-ach-schema-extension.md · working-principles.md*

---

## The site in brief

A Colorful History is the series site for Bernard Bolter's Mediums of Perception series. Mixed media paintings — acrylic photo transfers onto canvas with bold painted acrylic fields. The UI is deliberately recessive: a quiet stage for the paintings. The paintings supply all the colour; the chrome stays neutral.

**Stack:** Next.js · Payload CMS · Cloudflare R2 · Tailwind · mind.js (AR)
**Languages:** EN / DE at launch. All human-readable text fields `localized: true`. Future languages added via Payload locale config — no schema or code changes required.
**Design system:** Field zones (sky-like, generous space) · Dense zones (information, tight) · The fault line (asymmetric horizon, 2px charcoal + 1px cream hairline, lower third)

---

## Image spec

- 1600×1600px JPEG quality 60, Save for Web, sRGB, no metadata
- Naming: `[city]-[title-slug]-[source-years].jpg` · double hyphen `--` appended with painting year only on slug collision
- Cloudflare R2 stores: full size original + 300px thumbnail (square, unpadded)
- Open Graph image: generated on the fly by Next.js `opengraph-image.tsx` route — fetches 300px thumbnail, composes centered on `cityPlaceholderColor` square background using `ImageResponse`. Cached after first request. No padded version stored in R2.

---

## New schema fields confirmed in this session

Add to ACH tab on Artworks collection:

| Field | Type | Notes |
|---|---|---|
| `olderStory` | Rich text, localized | Left story column. The older layer — source photograph context, place history, technology history, loss of record. Bernard's choice per painting. |
| `newerStory` | Rich text, localized | Right story column. The newer layer — Bernard painting it, when, why, process. Always comes after the older layer. |
| `keyHistoricalDates[].wikipediaUrl` | Text (URI), localized | Per-date Wikipedia link. Most specific relevant article per date, not always the main location article. Nullable per entry. |

Remove from ACH tab:
- ~~`wikipediaUrl`~~ — removed. Per-date links in `keyHistoricalDates[]` replace it.
- ~~`wikipediaExcerpt`~~ — removed entirely. Story columns and key dates do this work better.

`titlePosition` — not a schema field. Frontend only. Seeded random within top-right zone, based on artwork slug. Consistent per painting across page loads, different per painting.

---

## Page structure overview

```
[Field zone]
  Painting — full width
  Title block — floating top right, dynamic position
  Mini nav strip — bottom left of painting

[Fault line]
  2px #3A3F4A + 1px #F0E8C0 hairline

[Dense zone]
  Info tab
  Story columns
  AR link (conditional)
  Key historical dates timeline
  Triptych link (MoP only)
  Status badge + archive link
```

---

## Field zone

### Loading placeholder
- `cityPlaceholderColor` as full-width base
- `overlayRects` animate in — the painted field rectangles gesture over the colour field
- Dissolve out as the painting loads in
- Same placeholder behaviour in zoom mode while the full image loads
- Never a blur — always flat colour + overlay rects

### Title block
- Floats over the painting, top right quadrant
- Position: seeded random within the zone, based on artwork slug. All paintings have large flat colour skies in the top area — no conflict with composition.
- Content: painting title · city name (small, Barlow Semi Condensed, quiet)
- City name is separate from the formal artwork title — near the title block but not part of it
- Z-index toggle: click title block → sends behind image. Click image → brings title block back to front. A subtle visible edge remains when behind so user knows it's retrievable.
- Barlow Semi Condensed throughout — Limelight is not used here

### Mini nav strip
Sits immediately below the painting, left-aligned. Icon-only or icon + small label. Uses `overlayColors` as accents.

| Icon | Condition | Action |
|---|---|---|
| Slider | `transferImage` exists | Toggles reveal mode |
| AR | `arEnabled: true` | Device-aware — see AR section |
| Magnifier | Always | Enters zoom mode |
| Share | Always | Native share sheet → URL → OG image |

---

## Zoom mode

Triggered by: magnifier icon tap · double tap image on mobile.

- Full 1600px image loads centered on screen
- Same `cityPlaceholderColor` + `overlayRects` loading placeholder while image fetches
- If image larger than screen (most cases): draggable in all directions, no hard borders
- If image smaller than screen (large displays): centered, `cityPlaceholderColor` fills remainder

**Minimap key — bottom right:**
- Two grey boxes: smaller = screen viewport, larger = full image dimensions, both to scale
- Position indicator moves within as user drags — coloured in one of the `overlayColors`
- Zoom percentage displayed in minimap area

**Controls in zoom mode:**
- Slider icon — if `transferImage` exists, enters zoom + reveal combined mode
- Close button — exits zoom, returns to artwork page
- Pinch beyond 100% on mobile — allowed
- Arrow key panning on desktop — nice to have, implement if straightforward
- Click and hold desktop to enter zoom — nice to have, implement if straightforward

**Zoom + reveal combined:**
- Reveal handle fixed to viewport, image moves behind it as user drags
- Reveal boundary always bisects what's currently visible
- Minimap key remains bottom right
- Close reveal button: exits reveal, stays in zoom
- Close zoom button: exits zoom entirely

---

## Reveal slider

Triggered by slider icon in mini nav.

**Mechanics:**
- Single draggable handle, starts at 50%
- Three states: source photograph → transfer on canvas → finished painting
- Small toggle above slider: "Source / Transfer" or "Transfer / Finished" — switches which two states are being compared. Handle always starts at 50% when toggled.
- `sliderAxis` stored per painting (horizontal / vertical). Visitor can override via H/V axis toggle.
- Handle coloured in one of the `overlayColors`

**On first open:**
- Auto-sweep: slow automatic move left to right and back once, then stops at 50%
- Communicates the interaction without instruction
- Never repeats after the first sweep

**Audio:**
- If `fieldRecordingUrl` exists, ambient audio plays quietly when reveal slider is active
- Fades in with slider open, fades out when closed

**In zoom + reveal mode:**
- Handle fixed to viewport — see zoom section above

---

## AR entry point

### Mini nav icon
- `arEnabled: false` → icon not shown
- `arEnabled: true`, device supports AR → opens AR experience directly. If no marker detected after 8–10 seconds, overlay appears: "Having trouble? Make sure you're pointing at the painting or print." Two options: Try again / Learn more →  (links to experience page)
- `arEnabled: true`, device doesn't support AR → links to experience page

### Inline AR link in dense zone
- One quiet line of context + link
- Appears after story columns, before key historical dates
- Same device-aware logic: AR direct or experience page
- Conditional on `arEnabled: true`
- Not buttons, not poster images — just a line and a link

### Experience page
- Standalone singleton page, top level nav
- Full explanation of the AR experience, demo clips of all three parts
- Explains physical print requirement positively — the AR lives in the physical work
- Links to shop
- Full JSON-LD for AEO — `HowTo`, `VideoObject` for demo clips, `Product` references
- Designed separately — not in scope for this brief

---

## Dense zone

### Info tab
Left and right panels. Pan on mobile. Scroll-snap behaviour on mobile: starts 50/50, snaps to left panel as user scrolls down. Implement and evaluate on actual site — flag as try-and-see.

**Left panel — the painting as object:**
- Title
- Medium
- Dimensions
- Year made
- Series + `imageCaptureLabel` (MoP only, e.g. "Mediums of Perception · Daguerreotype, c. 1861")
- Place of making — only shown if different from the depicted place

**Right panel — the source photograph:**
- Photographer name (or "unknown" / "unrecorded")
- Approximate date
- Technique (from `imageCaptureType` relation → `ImageCaptureTechnologies.name`)
- Institution or archive
- Bernard's own photographs credited the same way
- Commons link if `sourceWikimediaCommonsUrl` exists

### Story columns
Left and right panels. Same pan-on-mobile behaviour as info tab. Consistent interaction pattern — user learns it once.

**Left — `olderStory`:** The older layer. Source photograph context, place history, technology history, photographer story, loss of historical record. Bernard's choice per painting — whichever is most interesting. The left always came before the right.

**Right — `newerStory`:** The newer layer. Bernard painting it — when, why, process, what was happening. Always the response to the left.

Both localized rich text. Both nullable. Art/Official draws them out in dialogue — never drafted by the agent, always Bernard's voice.

The left/right = older/newer relationship mirrors the paintings themselves. The viewer reads past to present, left to right. The layout is the argument.

### AR link
- One quiet line + link
- Conditional on `arEnabled: true`
- Device-aware

### Key historical dates timeline
- 3–5 dates, Bernard's editorial selection
- Horizontal timeline on desktop, vertical on mobile
- Each date: year prominent, event text below, Wikipedia link
- `overlayColors` accent the nodes — 3 colours cycling through
- Tapping a node opens the Wikipedia link in a new tab
- `keyHistoricalDates[].event` localized · `keyHistoricalDates[].wikipediaUrl` localized, nullable per entry
- The timeline makes the time compression of the series visible — the span between dates speaks for itself

### Triptych link
- MoP panels only
- Quiet — "Part of Berlin Triptych →"
- One line, restrained

### Status badge + archive link
- `original-available` / `sold` / `prints-only`
- Overlay colour accent on badge
- "Full archive record →" — quiet, small, Barlow Semi Condensed
- Archive page carries: concept copy, exhibition history, provenance, condition notes, Bernard's intent and outcome notes — everything exhaustive

---

## What is NOT on this page

These live on the archive artwork page, not here:
- `conceptCopy` — the formal artist statement for this work
- Exhibition history
- Provenance
- Condition notes
- `intentVsOutcome` and `formalContributionAssessment`
- Wikipedia excerpt — removed from schema entirely

These were considered and removed:
- Related works strip — removed, not needed
- Wikipedia excerpt as visible content — removed, story columns and key dates do this better
- Overlay rects as persistent page design element — resolved as loading placeholder only

---

## Open Graph / sharing

- Share icon in mini nav triggers native share sheet with current URL
- `og:title` — painting title
- `og:description` — first sentence of `newerStory` or a dedicated `shareDescription` field — TBD, whichever is less work
- `og:image` — generated by `opengraph-image.tsx`: 300px thumbnail centered on `cityPlaceholderColor` square
- Square format shares cleanly on all platforms — Instagram, WhatsApp, iMessage

---

## Design system constraints

- **Typography:** Barlow Semi Condensed for all functional text · Limelight for city names in dense zone section headers only — not in the floating title block
- **Fault line:** `2px #3A3F4A` + `1px #F0E8C0` hairline · lower third
- **Damask pattern:** Dense zone only · never behind artwork image
- **Colour:** UI chrome neutral · `overlayColors` from the artwork drive all accent colour on this page — minimap indicator, slider handle, date timeline nodes, status badge
- **Padding:** Generous in field zone · tight in dense zone
- **No blur placeholders:** Always `cityPlaceholderColor` + `overlayRects` animation

---

## Localization rule (standing principle)

Every human-readable text field is `localized: true` by default. EN / DE at launch. Future languages added via Payload locale config — no schema or frontend changes required. This applies to every project on this stack, not just this page.

---

## New schema fields to add — summary for Brief 05

| Field | Collection | Type | Notes |
|---|---|---|---|
| `olderStory` | Artworks ACH tab | Rich text, localized | Left story column |
| `newerStory` | Artworks ACH tab | Rich text, localized | Right story column |
| `keyHistoricalDates[].wikipediaUrl` | Artworks ACH tab | Text URI, localized | Per-date Wikipedia link, nullable |

Remove from ACH tab:
- `wikipediaUrl` — no longer needed
- `wikipediaExcerpt` — no longer needed

---

## Components needed

| Component | Notes |
|---|---|
| `ArtworkImage` | Full width, loading placeholder, overlayRects animation |
| `TitleBlock` | Floating, seeded random position, z-index toggle |
| `MiniNav` | Slider / AR / Magnifier / Share icons, conditional rendering |
| `ZoomMode` | Full image, draggable, minimap key, zoom percentage |
| `RevealSlider` | Single handle, three states, axis toggle, auto-sweep, ambient audio |
| `InfoTab` | Left/right panels, pan on mobile, scroll-snap |
| `StoryColumns` | Left/right panels, pan on mobile, same behaviour as InfoTab |
| `ARLink` | Conditional, device-aware, one line |
| `HistoricalDatesTimeline` | Horizontal/vertical, overlayColors nodes, Wikipedia links |
| `TriptychLink` | MoP only, quiet |
| `StatusBadge` | Three states, overlayColor accent |
| `OGImage` | opengraph-image.tsx — thumbnail + cityPlaceholderColor square |

---

*Spec locked. Ready for implementation.*
*Pass to Cursor alongside: handoff-ach-schema-extension.md · design-system.md · working-principles.md*
-e 
---

# Brief 02 — MoP Triptych Page Design
## A Colorful History · bernardbolter.com

*Core decisions resolved. Some visual details deferred to build.*
*Read alongside: design-system.md · handoff-ach-schema-extension.md · brief-01-artwork-page-design.md*

---

## Dependency

Brief 01 (Artwork Page Design) is resolved. This page inherits from the individual panel page and links back to it.

---

## The triptych structure

Each MoP triptych is one city seen through three image capture technologies:
- **Panel I** — earliest known photograph (daguerreotype, wet plate etc)
- **Panel II** — historical colour lithograph or engraving
- **Panel III** — contemporary aerial or digital photograph

Each panel is an individual 1600×1600px painting with its own Artwork record, individual page, and full ACH experience. The triptych record holds the shared concept copy and commerce data.

**Route:** `/series/mediums-of-perception/[city]`
e.g. `/series/mediums-of-perception/berlin`

---

## Two distinct pages — resolved

The key architectural decision: the individual panel page and the triptych page are distinct pages doing different jobs.

**Individual panel artwork page** (`/artwork/[slug]`) — the primary experience. Full image, zoom, reveal slider, AR, story columns, historical dates, all ACH features. The triptych is referenced quietly — prev/next navigation and a "Part of Berlin Triptych →" link. Commerce link anchors to `#commerce` on the triptych page.

**Triptych page** — shows the three together. Its job is the composition as a whole — the technology arc made visible, the concept at the series level, the commerce. Not a duplicate of the individual pages. Lean and focused.

---

## What is resolved

### Mobile layout — three panels
One large panel top (full width), two smaller panels bottom (half width each). Tap a bottom panel → it moves to the featured top position, the other two drop to the bottom row. Immediate swap, no animation delay needed.

Tap the featured top panel → a subtle overlay appears at the bottom of the panel:
- Painting title
- "View full details →" link → goes to individual artwork page
- Tap anywhere else → dismisses overlay, stays on triptych page

This prevents accidental navigation for someone exploring the three panels. Confirmed on mobile only — no confirmation overlay needed on desktop.

### Desktop layout
Three panels side by side at equal size. Hover shows title and "View details →" link naturally. No switching behaviour needed — all three visible simultaneously.

### Source photographs
Each panel's source photograph shown small beneath its panel — both mobile and desktop. Credit line beneath each. Clicking a source photograph opens the reveal slider for that panel inline, or links to the individual panel page with the slider pre-opened. TBD at build time.

### Technology arc
`imageCaptureLabel` displayed beneath each panel (e.g. "Daguerreotype, c. 1861"). The arc from oldest to newest technology is visible across the three labels without needing further explanation.

### Page structure — top to bottom
```
Three panel presentation
  ↳ Panel images
  ↳ imageCaptureLabel per panel
  ↳ Source photographs small beneath each panel

Triptych concept copy
  ↳ The overarching statement about this city and the three-technology arc
  ↳ From triptych.concept field

Commerce section  ← id="commerce" anchor
  ↳ Original set — available / sold status
  ↳ Large print edition — remaining of 15
  ↳ Small print edition — remaining of 30
  ↳ signedAndNumbered note
  ↳ Add to cart → Vendure

Link to series page
  ↳ "← All cities" or similar quiet navigation
```

### Commerce from individual panel page
The "Available as part of the Berlin Triptych →" link on each panel page anchors directly to `#commerce` on this page. Visitor arrives at the purchase section without scrolling through panels and concept copy they've already experienced on the individual page.

### Schema — fully covered
Everything this page needs already exists in the current schema:
- Three panel images → `primaryImage` per Artwork
- Technology labels → `imageCaptureLabel` per panel
- Panel ordering → `triptychPosition` (I / II / III)
- Triptych concept → `concept` on Triptych record
- Source photographs → `sourceImage` per panel
- Commerce → `printSets`, `vendureProductId`, `printAvailableCount` on Triptych record
- Panel navigation → computed from `triptychPosition`
- Link from panel to triptych → `triptych` relation on base Artwork record

No new schema fields needed for this page.

---

## What is deferred to build

- Exact visual treatment of the concept copy section — fault line above it, damask background, or plain dense zone flow
- Whether source photograph tap opens reveal slider inline or navigates to individual page
- Exact styling of the technology arc labels
- Panel transition animation on mobile swap (if any)
- Desktop hover card exact design

---

## MoP series overview page

**Route:** `/series/mediums-of-perception`
**Top level nav** — direct link from homepage

Lists all triptychs in the series as they grow. Per triptych entry:
- Three panels as a row (small)
- City name in Limelight
- Technology arc labels (three small labels)
- Availability status badge
- Link to triptych page

Mediums of War lives at the bottom of this page — not a separate series page.

---

## Navigation structure

```
Homepage (landing page)
  → "Mediums of Perception" top nav link
  → Map link

/series/mediums-of-perception  ← MoP overview, all cities
  → each city → /series/mediums-of-perception/[city]

/series/mediums-of-perception/[city]  ← triptych page
  → each panel → /artwork/[slug]
  → commerce → Vendure

/artwork/[slug]  ← individual panel page
  → prev/next panel navigation (computed from triptychPosition)
  → "Part of [city] Triptych →" → /series/mediums-of-perception/[city]#commerce
  → map icon → /map
```

---

## Design system constraints

- **Fault line** — applies. Field zone = the three paintings. Dense zone = concept copy, technology arc, commerce.
- **Limelight** — city name is a Limelight moment on this page.
- **`overlayColors`** — each panel has its own 3 colours. On the triptych page three different colour sets are visible simultaneously. Visual treatment of this deferred to build.
- **Damask** — appropriate in the dense zone (concept copy, commerce section).
- **Single breakpoint `l:` at 769px** — mobile layout (switching panels) vs desktop layout (three equal panels) is the primary responsive decision.

---

*Core decisions locked. Visual details deferred to build.*
*Pass to Cursor alongside: handoff-ach-schema-extension.md · design-system.md · brief-01-artwork-page-design.md*
-e 
---

# Chat Brief 03 — Map & Tour Design
## A Colorful History · bernardbolter.com

*Brainstorm and design decisions only — no build in this chat.*
*Read alongside: design-system.md · site-structure-handoff.md · handoff-ach-schema-extension.md*

---

## What this chat is for

Resolving all design decisions for the ACH map experience — the primary navigation mode for the site. The map is the homepage. Everything else is reached through it.

This chat can run in parallel with Briefs 01 and 02 — the map is largely independent of the artwork page design.

---

## The map in brief

A full-viewport map showing pins for every artwork in the ACH collection. Each pin represents one painting located at its depicted real-world location. Clicking a pin leads to the artwork page. The map is grayscale — the paintings supply colour. A bottom thumbnail strip and sliding panel nav layer over the map.

**Map library:** The existing implementation uses a map tile library (confirm which — Mapbox or similar) with grayscale tile styling.

**ACH schema fields that drive the map:**
- `lat` / `lng` — GPS position of the depicted location
- `mapPresence` — boolean, whether this artwork appears on the map at all
- `cityPlaceholderColor` — flat colour shown during image load, derived from city
- `overlayColors` — 3 hex values from painted fields, available for pin or panel accent colour
- `tourSequence` — position in city tour
- `grandTour` — boolean, included in Grand Tour
- `grandTourSequence` — position in Grand Tour sequence
- `tourStopCopy` — Bernard's text for this stop when in a tour

---

## What has been decided

- Map is the homepage — primary navigation mode
- Grayscale map tiles — paintings supply all colour
- Pins represent individual artworks, not cities
- `mapPresence: false` for all MoW (Mediums of War) works — they don't have real-world locations
- City placeholder colour during image load — flat colour div, no blur
- Bottom thumbnail strip exists
- Tour sequences stored in schema — city tours and Grand Tour

---

## What needs deciding in this chat

### 1. Pin design

What does a map pin look like? Options:
- Minimal dot in one of the artwork's `overlayColors`
- Small thumbnail of the painting
- A custom shape that references the fault line aesthetic
- Standard pin shape, coloured

On hover/tap — what changes? Does a preview appear?

### 2. Pin click — what opens

When a visitor taps or clicks a pin, what happens?
- Navigate directly to the artwork page
- Open a panel or card with a preview — image, title, city, status badge — with a link to the full artwork page
- Expand the bottom strip to show this artwork

### 3. Bottom thumbnail strip

The strip shows artwork thumbnails. Questions:
- Is it always visible or does it appear on interaction?
- Does it show all artworks or only those in the current map view?
- Does it scroll horizontally or show a fixed set?
- How does it relate to pin selection — does clicking a pin highlight the corresponding thumbnail?

### 4. Sliding panel nav

A panel slides in from one side. What does it contain?
- Full artwork list
- Series filter
- Tour selection
- All of the above

Where does it slide from — left or right? What triggers it?

### 5. Tour mode

When a city tour or Grand Tour is activated:
- How does the UI change to indicate tour mode is active?
- How does the user navigate between tour stops — next/previous, or map-driven?
- Does `tourStopCopy` appear as an overlay, a panel, or inline somewhere?
- How does the user exit tour mode?

### 6. Grand Tour vs city tour

Are these the same UI mode with different sequences, or do they feel different? The Grand Tour crosses cities — does the map zoom behaviour change to accommodate this?

### 7. MoP triptych pins

Each MoP triptych is three paintings but they depict the same location. Do all three panels share one pin, or does each panel get its own pin at the same coordinates? If one pin — what does clicking it show?

### 8. Mobile map

On a phone the map, thumbnail strip, and panel nav all compete for a 390px screen. What is the mobile-specific layout? Does the thumbnail strip collapse? Does the panel nav become a bottom sheet?

### 9. New city release moment

Bernard adds one new city approximately monthly. The new pin appearing on the map is an event. Is there any UI treatment for a newly released city — a subtle highlight, a recency indicator — or does it just appear like any other pin?

---

## Design system constraints (from design-system.md)

- **Grayscale map** — the map itself contributes no colour. Pins and UI elements can use `overlayColors` from artworks or neutral chrome colours only.
- **Limelight typeface** — city names on the map or in tour mode are Limelight moments
- **Field zone principle** — the map is the field zone. The thumbnail strip and panel nav are the dense zone. The fault line sits between them.
- **Damask pattern** — only in dense/information zones. The sliding panel nav interior qualifies. The map surface does not.
- **Quiet and authoritative** — the map UI should feel like a museum floor plan, not a navigation app. Minimal chrome, generous space.

---

## Output expected from this chat

Written design decisions covering all nine questions above. The pin design and pin-click behaviour are the most critical — everything else follows from those two decisions. Mobile map layout is the second priority given that most visitors will arrive on phone.
-e 
---

# Chat Brief 04 — Store & RIBBA Builder Design
## A Colorful History · bernardbolter.com

*Brainstorm and design decisions only — no build in this chat.*
*Read alongside: design-system.md · handoff-store.md · handoff-ach-schema-extension.md*

---

## What this chat is for

Resolving all design decisions for the store experience — the triptych print editions and the RIBBA small print set builder. This is a post-June feature but design decisions are made now so schema and architecture choices don't need revisiting.

This chat is largely independent of Briefs 01–03 and can run in parallel.

---

## Commerce architecture in brief

**Vendure** handles all transactions — prices, inventory, cart, checkout, order history. Payload holds artwork data and a thin set of commerce-facing fields. The two systems are loosely coupled — only three things cross the boundary:

1. `vendureProductId` stored in Payload — links a triptych or SmallPrint record to the Vendure product
2. `printAvailableCount` synced back to Payload via webhook on each sale — so pages render remaining count without a live Vendure API call
3. Payload document IDs passed as custom fields in Vendure order line items — so any order resolves back to the archive permanently

Prices never live in Payload. The add-to-cart button hits Vendure directly from the client.

---

## The two commerce products

### Product 1 — MoP Triptych Print Editions

Per triptych (one new city approximately monthly):
- **Original set** — three paintings sold together. Status: `original-available` / `sold`.
- **Large print edition** — A3, edition of 15. Hand-signed and numbered.
- **Small print edition** — A5, edition of 30. Hand-signed and numbered.

The triptych page (Brief 02) carries the primary CTA. The store may also have a dedicated page listing all available triptych editions across all cities.

### Product 2 — RIBBA Small Print Set Builder

Any 5 square paintings from the full archive (~80 available works across all series — New York, Amsterdam, San Francisco, Berlin). User selects 5, purchases as a pack at a fixed price.

The 5 selected Payload SmallPrint document IDs are passed as custom fields on the Vendure order line. Bernard fulfils by looking up those IDs — the full painting title, city, and series come from the Payload Artwork record via the SmallPrint relation.

---

## What has been decided

- No individual panel sales — triptychs sold as complete sets only
- SmallPrints are cross-series — any square painting, not MoP-specific
- `printAvailableCount` displayed on page, updated via Vendure webhook
- `signedAndNumbered: true` for all Bernard editions
- Order confirmation email lists the 5 selected painting titles (Vendure email template)
- No crop needed for small prints — `primaryImage` from archive used directly

---

## What needs deciding in this chat

### 1. Store entry point and page structure

Where does the store live in the site navigation? Options:
- Accessible from the map sliding panel nav
- A dedicated `/store` page
- The triptych page is the primary store experience — no separate store page needed
- All of the above

What pages exist in the store section?

### 2. Triptych editions listing page

If there is a page listing all available triptych print editions across all cities:
- How are they organised — by city, by release date, by availability?
- Does a sold-out triptych still appear? With what treatment?
- How much information per triptych — just the image and availability, or more?

### 3. Triptych edition CTA on the triptych page

The triptych page (Brief 02) carries the CTA for that triptych's editions. How does this sit on the page without overwhelming the artwork?
- What information is shown: original availability, print edition remaining counts, price (from Vendure), add-to-cart
- What happens when `printAvailableCount` reaches 0 — does the edition disappear or show as sold out?
- Is original and print edition presented together or separately?

### 4. RIBBA builder — entry and context

Where does the RIBBA builder live? Its own page, a section of the store page, or reachable from individual artwork pages for square paintings?

What context does a visitor need before engaging with it — what is a RIBBA set, why would they want one, what does it look like physically?

### 5. RIBBA builder — selecting 5 from 80

This is the core UX problem. 80 paintings across multiple cities and series. The user must select exactly 5. Questions:
- How are the 80 paintings displayed — grid, strip, grouped by city/series?
- Is there filtering — by city, by series, by colour?
- What does the selected state look like on a painting card?
- How does the user see their current selection — a persistent tray showing the 5 slots?
- What happens if they try to add a 6th?
- Is there a minimum (exactly 5, or up to 5)?

### 6. RIBBA pack preview

Before checkout, can the user see what their set of 5 looks like together? A small preview of the 5 selected paintings as a group? Or is the checkout confirmation sufficient?

### 7. Mobile RIBBA builder

On mobile, selecting from 80 paintings in a grid is a significant interaction. What is the mobile-specific treatment? How does the selection tray work on a small screen?

### 8. Sold out states

Three sold-out scenarios to design for:
- Original set sold — badge on triptych page, no CTA
- Print edition sold out — show remaining count reaching 0, edition retired
- RIBBA print sold out (individual `available: false`) — disappears from the builder grid silently or shows as unavailable?

### 9. The physical object — what does the page communicate

Bernard's prints are hand-signed and numbered. The RIBBA set has a specific physical format. What information about the physical object needs to be on the page to make the purchase feel meaningful — paper, process, framing, signing?

---

## Design system constraints (from design-system.md)

- **Field zone / dense zone** — the artwork image is always field zone. Commerce information is always dense zone. The fault line separates them. Commerce never sits in the same zone as the painting.
- **Quiet and authoritative** — this is not a conventional shop. The commercial rhythm is one new city per month as an event. The store should carry mild occasion without being precious.
- **Damask pattern** — appropriate in the store dense zone as period texture
- **`overlayColors`** — the 3 colours from each triptych's painted fields can accent the edition card for that triptych. Each city gets its own colour accent derived from the work.
- **Limelight** — city names in edition cards are Limelight moments

---

## Output expected from this chat

Written design decisions covering all nine questions above. The RIBBA builder selection UX (question 5) is the most complex problem and deserves the most attention. The relationship between the triptych page CTA and any separate store page (questions 1–3) is the second priority.
-e 
---

# Chat Brief 07 — Field Notes System & Media Pipeline
## A Colorful History · bernardbolter.com

*System design, schema, and implementation spec.*
*Read alongside: handoff-ach-schema-extension.md · brief-05-schema-implementation.md · brief-06-art-official-setup.md*

---

## What this chat is for

Designing and building the Field Notes system — the creative capture layer fully integrated into the existing bernardbolter.com Payload instance. This system handles raw creative material: street photographs, video clips, voice observations, B-roll with spoken descriptions. It feeds three downstream workflows: the video storyboard session, the weekly social content session, and the long-term AI-parseable creative corpus.

This chat also covers two additions to Brief 05 (schema implementation): the `archive.jsonld` and `fieldnotes.jsonld` collection endpoints.

---

## Architecture — one system, not several

FieldNotes is a collection in the existing Payload instance — same Neon database, same R2 bucket, same Next.js site as everything else. The protected field notes UI is a route section of bernardbolter.com behind auth middleware. Nothing is separate.

```
bernardbolter.com (Next.js + Payload + Neon)
└── Artworks collection
└── Triptychs collection
└── SmallPrints collection
└── FieldNotes collection        ← just another collection
└── Protected /fieldnotes UI     ← just another route section
└── archive.jsonld endpoint
└── fieldnotes.jsonld endpoint

Hetzner server (€16/month CPU)
└── Processing worker only — no database, no UI, nothing persistent
└── Watches R2 for new uploads
└── Runs ffmpeg + Moondream + Whisper
└── Writes results back to Payload via Payload REST API
└── FCPXML export script

Cloudflare R2
└── All media — artwork images, videos, field note clips, audio
```

The Hetzner server is a dumb processing worker. It picks up files, runs inference, writes results to Payload, done. All data lives in Payload. All media lives in R2. The field notes benefit from everything already in Payload — localization, access control, R2 upload handling, JSON-LD generation utilities — without reinventing any of it.

The connection between a formal archive record and a field note from that location is a standard Payload relation between two records in the same database. Not a cross-system API call.

---

## The core idea

The field note is the atomic unit of creative capture. Everything is a field note — a written observation, a street photograph, a B-roll clip with a spoken description, a voice memo, a location observation on camera. The format varies, the impulse is the same: capture what you notice before it disappears, privately, without performance pressure.

The system inverts the usual social media workflow. Capture is private and instant — no audience, no editing, no decisions. Publishing is automatic and unconditional — everything goes into the public JSON-LD corpus. The only moment of curation is in the weekly reasoning session, where patterns are found and posts are shaped from what was actually captured. The pressure of being cool in public in real time is removed entirely.

---

## The philosophy — why everything is public

The field notes JSON-LD endpoint is fully public. No authentication, no delay, no per-note public/private flag. This is a deliberate decision:

- Bernard's practice is already built on authenticity over curation — unedited freestyle raps on SoundCloud, failure hooks in YouTube episodes, raw process as content
- Deciding public/private in the moment reintroduces the performance pressure the system is designed to remove
- The public corpus is more interesting and more useful as an AI-parseable document if it contains the full unedited record, not a curated selection
- An AI agent reasoning over bernardbolter.com in 2030 gets the complete picture — the formal archive and the living creative process behind it
- The field notes help Bernard's own process — knowing captures go into a permanent record creates discipline without pressure

The protected section of the website is the working interface, not a privacy mechanism. The data is public. The UI for working with it is private.

---

## Part 1 — The FieldNotes Collection

*New Payload collection. Replaces the separate `RawFootage` concept — everything is a field note, `mediaType` describes the format.*

### 1.1 Fields

| Field | Type | Notes |
|---|---|---|
| `mediaType` | Select | `text` · `photo` · `video-broll` · `video-observation` · `video-performance` · `video-process` · `voice-memo` |
| `capturedAt` | DateTime | When the note was captured. Defaults to upload time. |
| `city` | Text | City where captured. Optional — set manually or inferred from GPS. |
| `location` | Group: `{ lat, lng }` | GPS coordinates. Optional. |
| `locationName` | Text | Human-readable location name. e.g. "Brandenburger Tor, west side" |
| `mediaFile` | Upload → R2 | The photograph, video, or audio file. |
| `writtenNote` | Text | For `mediaType: text` or supplementary written note on any type. |
| `relatedArtwork` | Relation → Artworks | Optional connection to an archive painting. |
| `processingStatus` | Select | `pending` · `processing` · `complete` · `failed`. Default `pending`. |

**Processing outputs — written by Hetzner server, not manually:**

| Field | Type | Notes |
|---|---|---|
| `audioTranscript` | Text | Whisper transcription of spoken audio. For `video-broll` this is Bernard's spoken description over the shot. For `video-observation` and `video-performance` this is the speech content. |
| `transcriptType` | Select | `shooter-description` (broll) · `speech` (observation/performance) · `none` |
| `keyframes` | Array of `{ timestamp: seconds, imageUrl: R2 path, tags: [text] }` | Extracted frames + Moondream visual tags. One frame per N seconds. |
| `detectedLanguage` | Text | ISO language code from Whisper. |
| `duration` | Number | Video duration in seconds. |

### 1.2 Processing pipeline logic by mediaType

| mediaType | ffmpeg | Moondream | Whisper | Transcript label |
|---|---|---|---|---|
| `text` | — | — | — | — |
| `photo` | — | ✓ on image | — | — |
| `video-broll` | keyframes + audio | ✓ on keyframes | ✓ on audio | `shooter-description` |
| `video-observation` | keyframes + audio | ✓ on keyframes | ✓ on audio | `speech` |
| `video-performance` | keyframes + audio | ✓ on keyframes | ✓ on audio | `speech` |
| `video-process` | keyframes + audio | ✓ on keyframes | ✓ on audio | `speech` |
| `voice-memo` | audio only | — | ✓ on audio | `speech` |

### 1.3 Clip length guideline

Target 30–90 seconds per clip for location and observation footage. One clip, one idea. This produces cleaner transcripts, better visual tags, and more useful building blocks for the storyboard session. Process footage (tape peel, paint mixing) can be longer as it documents continuous action. B-roll clips can be shorter — often 15–30 seconds per shot.

### 1.4 B-roll description convention

For `video-broll` clips, Bernard speaks a brief description over or immediately before/after the shot — not a script, just what he sees and what it means. This description is more emotionally and conceptually precise than Moondream's visual tags. Both are stored. The storyboard reasoning session uses visual tags for technical matching and the spoken description for thematic and narrative matching.

Example Moondream output: *"exterior architecture stone columns daylight wide"*
Example spoken description: *"this is the exact angle the daguerreotypist would have stood, same morning light 160 years later"*

Both are needed. Neither alone is sufficient.

---

## Part 2 — The Hetzner Server Stack

*€16/month CPU server. Background processing pipeline. No real-time inference required.*

### 2.1 Software stack

| Tool | Purpose |
|---|---|
| **ffmpeg** | Keyframe extraction at configurable interval (default: 1 frame per 10 seconds). Audio track extraction. Single pass — reads source file once, outputs both. |
| **Moondream** (1.8B, 4-bit quantized) | Visual tagging of keyframes. Runs on CPU. ~15-30 seconds per image at this spec. Adequate for broad category tags. |
| **Whisper** (small or medium model) | Speech-to-text transcription. Runs on CPU. ~2-3 minutes per 60-second clip. Handles English well. Freestyle rap transcription will need Bernard's review — mark as draft. |

### 2.2 Processing flow

```
New file detected in R2 upload bucket
↓
ffmpeg: extract keyframes + audio track
↓
Moondream: tag each keyframe → visual tags array
↓
Whisper: transcribe audio → transcript text + detected language
↓
Write all outputs back to FieldNotes record in Payload
↓
Set processingStatus: complete
```

Runs as a background daemon on the Hetzner server. Watches R2 for new uploads via webhook or polling. Processes one file at a time. Overnight processing is the default — captures during the day, ready by morning.

### 2.3 Whisper accuracy notes

- Location observation clips (clear speech, deliberate delivery) → high accuracy, minimal correction needed
- History video takes (slower speech) → high accuracy
- Freestyle rap (fast delivery, creative vocabulary) → rough draft, always requires Bernard review before `freestyleTranscript` field is marked complete in Payload
- B-roll descriptions (brief, natural speech) → good accuracy for short descriptions

---

## Part 3 — The Video Production Workflow

*Three Claude sessions + Hetzner processing + DaVinci edit.*

### Session 1 — Pre-production (Claude subscription chat)

Bernard opens a conversation and talks through the video concept. Claude has access to the artwork page JSON-LD (fetched from the public URL) for the relevant city — `conceptCopy`, `keyHistoricalDates`, `wikipediaExcerpt`, `imageCaptureLabel`, source photograph context.

Together they arrive at:
- The narrative arc — which Failure Hook, what the Discovery moment is
- A loose shot list — the moments that need to exist, not a rigid script
- The conceptual thread — what the episode is actually about
- Key phrases and ideas to have in mind while shooting — anchors, not lines

Output: a rough plan. Bernard goes out with it in his head, not in his hand.

### Production — shooting

Bernard shoots with the plan loosely in mind. Multiple takes per shot. B-roll with spoken descriptions. Location observation clips thinking out loud. All clips uploaded to R2, `mediaType` set at upload. Hetzner processes overnight.

**Shooting discipline:**
- 30–90 seconds per clip
- One idea per clip
- Describe B-roll shots aloud — what you see and why it matters
- Talk through observations on location clips — what you're thinking, what connects to the historical context
- Multiple takes are expected — the storyboard session selects the strongest

### Session 2 — Storyboard reasoning session (Claude subscription chat)

Bernard opens a new session after overnight processing. He provides:

1. The artwork page URL → Claude fetches JSON-LD, has full archive context
2. The processed clip list → pasted as structured text from the protected field notes UI

```
Clip 01 — video-broll — 0:38
  Tags: exterior, gate, morning, wide, architecture
  Description: "this is the exact angle the daguerreotypist would have stood,
                same morning light 160 years later"

Clip 02 — video-observation — 1:14
  Tags: exterior, street, medium, people
  Transcript: "this is where the wall divided the city right here, you can
               feel it even now, the space is different on each side"
...
```

Claude reads the clip list alongside the archive data and produces:

- A proposed edit structure built from what actually exists — Failure Hook, Journey, Discovery, Payoff sections with specific clip assignments
- In/out timestamp suggestions per clip
- Take selection for multiple takes of the same shot — narrows to 2 candidates, Bernard chooses
- Gap identification — specific missing shots worth going out to get (typically 2–3 targeted shots, not a new full shoot)
- B-roll suggestions for each dialogue section — candidates from the clip library by visual tag and description match

Output: a structured edit plan with clip IDs, timestamps, section labels, and gap notes.

### DaVinci edit

The edit plan is converted to FCPXML by a small script on the Hetzner server. FCPXML imports directly into DaVinci Resolve — rough assembly lands in the timeline with clips in sequence, in/out points set, sections colour-coded by episode arc. Bernard refines from there — pacing, cuts, music, the creative decisions that can't be automated.

### Post-edit session (optional, Claude subscription chat)

After the edit is complete and published, a brief session to capture what was actually used:

- Which clips made the final cut
- Which takes were chosen over others
- What was shot that didn't get used
- Any observations about the process

This goes back into the FieldNotes records as a `usedInEdit` boolean and an `editNotes` text field. Over time this builds a picture of Bernard's editing preferences — what he consistently shoots but doesn't use, where the gaps tend to appear, what kinds of clips consistently work. Future storyboard sessions get better from this feedback.

---

## Part 4 — Weekly Social Content Session

*Drawing from field notes + archive to produce a week of posts.*

Bernard opens a session and fetches both:
```
bernardbolter.com/archive.jsonld        → full formal archive
bernardbolter.com/fieldnotes.jsonld     → full field notes corpus
```

Claude reasons across both and produces:

- Pattern identification — what Bernard has been noticing across recent field notes, recurring themes, unexpected connections to archive paintings
- 3 post drafts for the week — each grounded in a specific field note + archive connection, in Bernard's voice
- Thread outline — the historical context of a location told as a series of posts, drawn from `keyHistoricalDates` + `wikipediaExcerpt`
- Caption variants — short (Instagram), medium (carousel), story format
- DE versions — translated from EN using the localized fields already in Payload
- Hashtag suggestions — from `city`, `series`, `imageCaptureType`

The posts are not AI-generated fluff. They are syntheses of Bernard's actual observations (field notes transcripts) and structured historical research (archive JSON-LD). The content is completely specific to this practice and this person. Nobody else can make it.

---

## Part 5 — JSON-LD Collection Endpoints

*Two new routes to add to Brief 05 implementation.*

### 5.1 archive.jsonld

**Route:** `bernardbolter.com/archive.jsonld`
**Access:** Fully public
**Content-Type:** `application/ld+json`

Returns all published Artwork records as a JSON-LD `ItemList`. Each item is the full VisualArtwork JSON-LD block — same output as the individual artwork page, aggregated into one document.

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Bernard Bolter Archive",
  "description": "Complete archive of paintings by Bernard Bolter",
  "url": "https://bernardbolter.com/archive.jsonld",
  "numberOfItems": 84,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "VisualArtwork",
        ... full artwork JSON-LD block ...
      }
    },
    ...
  ]
}
```

**Implementation:** Next.js route at `src/app/archive.jsonld/route.ts`. Queries all Payload Artwork records where `status: published`. Formats as JSON-LD ItemList. Returns with `Content-Type: application/ld+json` header. No authentication required.

**Size estimate:** ~80 artworks × ~3,000 tokens per record = ~240,000 tokens. Well within Claude's 1M context window. Grows comfortably to 300+ artworks before context becomes a consideration.

**Use cases:**
- Claude subscription chat: fetch once, reason across entire archive in storyboard or social sessions
- AI agents crawling the web: complete structured data about the practice in one document
- Future semantic search tools: full corpus for embedding and indexing

### 5.2 fieldnotes.jsonld

**Route:** `bernardbolter.com/fieldnotes.jsonld`
**Access:** Fully public — deliberate decision, see Part 1 philosophy
**Content-Type:** `application/ld+json`

Returns all FieldNotes records where `processingStatus: complete` as a JSON-LD collection. Uses schema.org `CreativeWork` type with extensions for the field note context.

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Bernard Bolter Field Notes",
  "description": "Creative field observations, captured footage transcripts, 
                  and location notes from the practice of Bernard Bolter",
  "url": "https://bernardbolter.com/fieldnotes.jsonld",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "CreativeWork",
        "dateCreated": "2026-05-15T09:23:00Z",
        "locationCreated": {
          "@type": "Place",
          "name": "Brandenburger Tor",
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 52.5163,
            "longitude": 13.3777
          }
        },
        "encodingFormat": "video/broll",
        "description": "this is the exact angle the daguerreotypist would have stood, same morning light 160 years later",
        "keywords": ["exterior", "gate", "morning", "wide", "architecture"],
        "isRelatedTo": {
          "@type": "VisualArtwork",
          "url": "https://bernardbolter.com/artwork/berlin-brandenburger-tor-1899-2024"
        }
      }
    },
    ...
  ]
}
```

**Implementation:** Next.js route at `src/app/fieldnotes.jsonld/route.ts`. Queries all Payload FieldNotes records where `processingStatus: complete`. Formats as JSON-LD ItemList. Returns with correct Content-Type header.

**What it omits:** Raw media file URLs are not included in the JSON-LD — only the text content (transcripts, descriptions, tags). The media files themselves remain on R2 and are not publicly linked from this endpoint. The intellectual content is public; the raw files are not.

**Cursor implementation prompt:**

```
CURSOR AGENT PROMPT — BRIEF 07: JSON-LD Collection Endpoints

Read first:
- brief-07-field-notes-media-pipeline.md — Part 5
- handoff-ach-schema-extension.md — Part 5 (JSON-LD extensions)
- artist-archive-schema-final.md — Section 1.10 (JSON-LD)

Task:
Create two new Next.js route handlers for the JSON-LD collection endpoints.

Files to create:
- src/app/archive.jsonld/route.ts
- src/app/fieldnotes.jsonld/route.ts

Constraints:
- Both routes return Content-Type: application/ld+json
- archive.jsonld: query all Artworks where status: published
  Format as JSON-LD ItemList using the same generateArtworkJsonLd utility
  already implemented in Brief 05
- fieldnotes.jsonld: query all FieldNotes where processingStatus: complete
  Format as JSON-LD ItemList using schema.org CreativeWork type
  Include: dateCreated, locationCreated (with GeoCoordinates), encodingFormat,
  description (audioTranscript), keywords (flattened tags array), isRelatedTo
  (artwork URL if relatedArtwork is set)
  Omit: mediaFile URLs — do not expose R2 paths in the public endpoint
- No authentication on either route — fully public
- No caching headers that would prevent fresh data — use revalidate: 3600
  so the endpoint rebuilds at most once per hour

Done when:
- Both routes return valid JSON-LD
- archive.jsonld validates as schema.org ItemList containing VisualArtwork items
- fieldnotes.jsonld validates as schema.org ItemList containing CreativeWork items
- Neither route exposes R2 media file paths
- Both routes accessible without authentication
```

---

## Part 6 — Protected Field Notes UI

*A private section of bernardbolter.com for working with captured material.*

### 6.1 Purpose

The protected UI is the working interface — where Bernard uploads clips, reviews processed results, browses the capture archive, and compiles clip lists for storyboard sessions. It is not a privacy mechanism; the data is public. It is an interface designed for how Bernard actually works with this material.

### 6.2 Authentication

Simple Next.js middleware with magic link or password. Single user — no multi-user auth system needed. Session persists across the working day. All routes under `/fieldnotes/*` require authentication.

### 6.3 Views

**Recent captures** — default view. All field notes from the last 14 days, newest first. Grid of keyframe thumbnails for video, image thumbnails for photos. Each card shows: thumbnail, mediaType badge, city, duration/timestamp, first line of transcript. Quick visual scan before a storyboard session.

**City view** — all field notes grouped by city. Useful when preparing for a specific episode. Same card layout, grouped by city heading.

**Full text search** — searches across all transcripts, descriptions, location names, and written notes. Returns matching clips with the matched text highlighted. Finding a specific observation by searching a keyword or phrase.

**Clip detail** — opens a single field note. Shows: all keyframes in sequence, full transcript, all Moondream tags, written note if present, related artwork link, processingStatus, duration. Edit button for `relatedArtwork` relation and `city` field if not set correctly at upload.

**Storyboard compiler** — select a city or date range, check the clips to include, generate a structured clip list document. Copy to clipboard for pasting into a Claude session. One-tap workflow from browsing to reasoning session.

### 6.4 Upload interface

Mobile-friendly upload form. Fields:
- File upload (photo or video)
- `mediaType` select — defaults based on file type (video → `video-observation` as default, photo → `photo`)
- `city` text — optional, pre-filled if GPS available
- `relatedArtwork` relation — optional, searchable select
- `writtenNote` — optional supplementary note

Submit → file goes to R2 → FieldNotes record created in Payload with `processingStatus: pending` → Hetzner server picks up and processes overnight.

### 6.5 Processing status indicators

The recent captures view shows processing status per clip:
- `pending` — grey indicator, "waiting for processing"
- `processing` — animated indicator, "processing now"
- `complete` — green indicator, transcript and tags visible
- `failed` — red indicator, retry button

---

## Part 7 — FCPXML Export for DaVinci Resolve

*Converts storyboard session output to a DaVinci-importable timeline.*

### 7.1 Why FCPXML

DaVinci Resolve imports FCPXML directly. The spec is well documented, Python libraries exist (`fcpxml` package). More practical to generate than DaVinci's native `.drp` format or AAF. The resulting timeline lands with clips in sequence, in/out points set, sections labelled.

### 7.2 The storyboard output format

The Claude storyboard session outputs a structured edit plan as JSON:

```json
{
  "title": "Berlin — Brandenburger Tor Episode",
  "sections": [
    {
      "label": "failure-hook",
      "clips": [
        {
          "fieldNoteId": "abc123",
          "r2Path": "fieldnotes/clip-01.mp4",
          "inPoint": 14,
          "outPoint": 47,
          "note": "Failed freestyle attempt — frustrated look at camera"
        }
      ]
    },
    {
      "label": "journey",
      "clips": [ ... ]
    }
  ],
  "gaps": [
    "Need one close-up of photo transfer process",
    "Need a clean AR scan reveal with finished painting"
  ]
}
```

### 7.3 Conversion script

A small Python script on the Hetzner server takes the JSON and outputs FCPXML. Bernard pastes the JSON into a simple web form on the protected field notes UI, clicks Export, downloads the `.fcpxml` file. Opens DaVinci, imports — rough assembly is in the timeline, sections colour-coded by episode arc label.

Clips must be available locally for DaVinci to read them — standard practice is to sync the relevant R2 clips to local SSD before the edit session. The FCPXML references local file paths.

---

## Part 8 — Post-Edit Feedback Loop

*Storing edit decisions back in the system for future improvement.*

After the edit is published, Bernard records what was used:

Simple form in the protected field notes UI — checkboxes next to each clip: "used in final edit / not used". Optional note per clip.

This writes back to the FieldNotes record:
- `usedInEdit` boolean
- `editNotes` text — why it was or wasn't used

**What this builds over time:**

The storyboard reasoning session can query edit history — "Bernard consistently shoots wide location shots but rarely uses them beyond the Journey section opening", "close-up process clips are used in 90% of edits", "Discovery moment clips are almost never captured on the first shoot day." 

Future storyboard sessions use this pattern data to sharpen suggestions and gap identification. The system gets better from Bernard's actual editing decisions, not from assumptions about what should work.

---

## Implementation notes for Cursor

### New collections to implement
- `FieldNotes` collection in Payload (Part 1)
- Two JSON-LD route handlers (Part 5)

### New infrastructure to set up on Hetzner
- ffmpeg installation and configuration
- Moondream model download and inference server
- Whisper model download and inference server
- Processing daemon that watches R2 and triggers pipeline
- FCPXML export script

### New protected UI routes
- `/fieldnotes` — recent captures view
- `/fieldnotes/city/[city]` — city view
- `/fieldnotes/search` — full text search
- `/fieldnotes/[id]` — clip detail
- `/fieldnotes/compile` — storyboard compiler
- `/fieldnotes/upload` — upload form
- All routes behind Next.js middleware authentication

### Files to create or modify
| File | Action |
|---|---|
| `src/collections/FieldNotes.ts` | Create |
| `src/payload.config.ts` | Modify — register FieldNotes |
| `src/app/archive.jsonld/route.ts` | Create |
| `src/app/fieldnotes.jsonld/route.ts` | Create |
| `src/app/fieldnotes/page.tsx` | Create — recent captures |
| `src/app/fieldnotes/upload/page.tsx` | Create — upload form |
| `src/app/fieldnotes/compile/page.tsx` | Create — storyboard compiler |
| `src/middleware.ts` | Modify — protect /fieldnotes/* routes |
| `hetzner/pipeline.py` | Create — processing daemon |
| `hetzner/fcpxml_export.py` | Create — FCPXML generation script |

---

*This document covers the Field Notes system, media processing pipeline, video production workflow, social content session, JSON-LD collection endpoints, protected UI, and DaVinci FCPXML export.*
*Next sessions: Brief 01 (Artwork Page Design) · Brief 06 (Art/Official Setup) · Brief 06b (API Router)*
-e 
---

# Brief 08 — Gates of Perception Tour
## A Colorful History · bernardbolter.com

*Two purposes: (1) establish the Tours collection schema, (2) produce the Gates of Perception tour content brief for Art/Official.*
*Read alongside: voice-and-hero-sequence.md · handoff-ach-schema-extension.md · design-system.md · working-principles.md*

---

## What this chat is for

Designing and building the tour feature — starting with Gates of Perception as the first concrete instance. The Tours collection schema is generic enough to handle any future tour. The Gates of Perception tour is the proof of concept that proves the template works.

Two outputs from this chat:
1. The Tours collection Payload schema — ready for Cursor to implement
2. The Gates of Perception tour content brief — ready for Art/Official to write stop copy

---

## The series — Gates of Perception

16 paintings about the gates of the Berlin Akzisemauer (customs wall, 1737–1860). Plus one additional painting — the Charlottenburger Gate, which was not part of the customs wall but was painted before that was known. 17 paintings total in the tour.

**Historical context:**
The Akzisemauer was a ring wall around Berlin used for tax collection, not defence. It stood from 1737 to 1860 when it was demolished and became boulevards. It had 14–18 gates, named after the cities their roads led to. Today the gates survive only as U-Bahn station names and street intersections — Kottbusser Tor, Frankfurter Tor, Schlesisches Tor, Oranienburger Tor. The Brandenburg Gate is the only one still standing physically. The wall's 15.9km circuit still shapes Berlin's urban geography.

**The series divides into two halves — this arc is the tour's conceptual spine:**

**Paintings 1–8 — Found photographs:**
Historical archive photographs were found for these gates. Classical San Francisco technique — photograph transferred to canvas, bold painted acrylic fields completing the composition. The technique Bernard developed before Berlin. The wall exists in historical record.

**Paintings 9–16 — Bernard's own photographs:**
No historical photographs existed for these gates. Bernard photographed the present-day locations himself. The technique began to deconstruct — the classical approach breaking down when the historical anchor wasn't there. The wall exists only as a street name, a vague urban memory.

**The Charlottenburger Gate (painting 17):**
Painted using a historical photograph, classical technique, before it was known this gate wasn't part of the customs wall. Include in the tour — the mistake is more interesting than omitting it. The stop copy acknowledges the error directly. The customs wall is already a wall most people don't know about — a gate that people thought was part of it but wasn't is a layer of historical complexity that fits the series.

**Connection to the hero animation:**
The site's hero animation (voice-and-hero-sequence.md) uses Brandenburger Tor (painting 1 — found photograph, classical technique) and Kottbusser Tor (painting from the second half — Bernard's own photograph, deconstructed technique) as its two bookends. The hero animation is the tour's thesis statement compressed into 30 seconds. The full Gates of Perception tour is the expanded version of what the hero demonstrates.

---

## The tour interaction spec

### Navigation
- **Linear prev/next** — the primary path. Bernard's intended sequence. Prev/next arrows in the tour controls bar.
- **Non-linear jump** — bottom strip shows all paintings in tour sequence order, swipeable. Tap any painting to jump to that stop. The sequence is suggested, not enforced.
- **Map pins** — numbered pins for each stop. Tap any pin to jump non-linearly.

### Bottom strip in tour mode
Filtered to the Gates of Perception series only. Shows all 17 paintings in tour sequence order. The visual progression from classical technique (found photographs, rich colour fields) to deconstructed technique is visible across the strip before visiting each stop. Scrubbing the strip scrubs the whole tour.

### Stop copy display
Fades in and out with subtle scale — 0.92 to 1.0. Not a slide. The copy materialises and dematerialises. Appears above the map, below the header. Does not conflict with the bottom strip.

Scale and opacity tied to tour progress value — copy arrives as you approach the stop, holds while you're there, departs as you leave.

### Scrub interaction
A single progress value (0 to N stops) drives everything simultaneously:
- Map `flyTo` — interpolated between stop coordinates
- Stop copy — fades in/out with scale
- Bottom strip — scrolls to keep current stop centred
- Active map layer segment — highlights the relevant section of the wall route
- Tour progress indicator in controls bar

Swipe left/right on map → scrubs directly
Drag bottom strip → scrubs in concert with map
Tap prev/next → animates to next stop at set speed
Everything moves as one system.

### Play mode
Play button in tour controls bar. Runs through all stops at a set rhythm:
- Map flies to stop location (2–3 seconds)
- Copy fades in at scale, holds for `stopDuration` seconds (default 7, overridable per stop)
- Copy fades out
- Map flies to next stop

Stop duration is computed: base seconds + reading time calculated from word count. Longer copy gets more time automatically.

Touching the map or strip at any point pauses play, returns to manual scrub mode. Resume with play button.

### Audio layers
**Tour ambient music** — plays throughout the whole tour from `tour.ambientMusicUrl`. Background layer, low volume.

**Per-stop field recording** — if `artwork.fieldRecordingUrl` exists, crossfades in over the ambient music as the stop copy appears. Crossfades back out as the map moves to the next stop. The location's present-day sound surfaces and recedes.

Override logic:
```
Arriving at stop:
  if artwork.fieldRecordingUrl exists → crossfade to field recording
  else → tour ambient music continues

Leaving stop:
  if was playing field recording → crossfade back to ambient music
  else → ambient music continues uninterrupted
```

Crossfade duration: 1–2 seconds.

### Map layers
Multiple historical geography layers toggled independently in the legend panel. For Gates of Perception:

| Layer | Content | Default | Style |
|---|---|---|---|
| Tour route | Line connecting stops in sequence order | Toggleable | Solid, burnt amber |
| Akzisemauer 1737–1860 | The customs wall circuit | Visible | Solid, burnt amber 60% |
| Cold War Wall 1961–1989 | The Berlin Wall | Hidden | Dashed, muted red 40% |
| Medieval wall 13th century | Original Berlin wall | Hidden | Dotted, stone grey 30% |

The relationship between three centuries of Berlin defining its own boundaries becomes spatially legible without explanation. Toggle two layers on simultaneously to see how each wall roughly followed the previous one's logic.

---

## Tours collection schema

*New Payload collection. Generic — works for any tour, not Gates of Perception specific.*

| Field | Type | Notes |
|---|---|---|
| `title` | Text, localized | Display title e.g. "Gates of Perception" |
| `slug` | Text | URL-safe, auto-generated, never changes after publish |
| `series` | Relation → Series | Which series this tour belongs to. Nullable for cross-series tours. |
| `concept` | Rich text, localized | The tour's overarching arc — what the visitor understands by the end |
| `introduction` | Rich text, localized | Shown before tour begins — "before you start" context |
| `estimatedDuration` | Number | Minutes, for display in legend |
| `stopDuration` | Number | Default seconds per stop in play mode. Default 7. |
| `ambientMusicUrl` | Upload → R2 | Background audio for the whole tour. Nullable. |
| `mapRouteGeoJSON` | JSON | The tour path connecting stops in sequence. Separate from historical layers. Nullable. |
| `showMapRoute` | Boolean | Whether to draw the tour path line. Default true. |
| `mapLayers` | Array | Historical/contextual geographic layers. See sub-fields below. |
| `tourImages` | Array | Historical maps, period photographs, contextual documents. See sub-fields below. |
| `artworks` | Relation → Artworks (ordered array) | The stops in sequence. Order here is the tour order — independent of any geographic logic. |
| `enabled` | Boolean | Tour is live and accessible. Default false. |

**`mapLayers` sub-fields:**
```
{
  layerId: text  — unique identifier
  label: localized text  — shown in legend toggle
  geoJsonUrl: text  — R2 path to GeoJSON file
  color: hex  — line colour
  opacity: number  — 0–1
  lineStyle: "solid" | "dashed" | "dotted"
  defaultVisible: boolean
  description: localized text  — short context in legend
}
```

**`tourImages` sub-fields:**
```
{
  image: Upload → R2
  caption: localized text
  credit: text
  wikimediaUrl: text  — nullable, source URL if from Commons
}
```

**New fields on Artworks ACH tab:**

| Field | Type | Notes |
|---|---|---|
| `tourStopDuration` | Number | Per-stop pause override in seconds. Nullable — uses `tour.stopDuration` when null. |
| `tourReady` | Boolean | All tour fields populated, ready to include in a tour. Art/Official sets this. Default false. |

Note: `tourStopCopy`, `tourSequence`, `grandTour`, `grandTourSequence` already exist in the schema.
Note: `fieldRecordingUrl` already exists and doubles as the per-stop audio override — no new field needed.

---

## GeoJSON data sources

The following historical routes need to be sourced as GeoJSON LineString files and stored in R2:

| Layer | Source |
|---|---|
| Akzisemauer route | OpenHistoricalMap, Wikimedia Commons georeferenced maps, Berlin city archives. The 15.9km circuit is well documented. |
| Cold War Berlin Wall | Extensively mapped. OpenStreetMap historical data, Berliner Mauer documentation centre. |
| Medieval Berlin Wall | Less precise. Berlin city archaeology records, OpenHistoricalMap. |
| Tour route | Computed from stop coordinates in `artworks` array order — generated programmatically, not stored as a separate GeoJSON. |

Art/Official or Cursor sources the GeoJSON files. Bernard does not need to handle this — it's a research and data task.

---

## The legend panel

Appears when tour mode is active. Contains:

- Tour title and concept (short version)
- Estimated duration
- Play/pause button
- Stop counter — "Stop 4 of 17 · Rosenthaler Tor"
- Map layer toggles — one per `mapLayers` entry with colour swatch and label
- Tour images — small gallery of historical maps and documents
- Link to full series page

---

## Art/Official tour content session

Before Art/Official can write `tourStopCopy` for each painting, Bernard needs to provide:

### 1. The stop sequence
List all 17 gates in the preferred tour order. This is Bernard's editorial decision — probably found-photographs first (paintings 1–8 in some geographic or conceptual order), then Bernard's own photographs (paintings 9–16), then the Charlottenburger Gate outlier last or placed where it makes narrative sense.

### 2. One angle per stop
For each gate — a sentence or phrase about what makes this specific stop interesting. Not the copy itself — just the angle. This is drawn out in dialogue with Bernard in the Art/Official session:

*"Tell me what you want someone to understand when standing at this stop — not a full description, just what's most interesting about this one."*

### 3. The tour arc confirmed
Bernard confirms the arc in his own words: what does someone understand at the end that they didn't at the beginning? This becomes the `concept` field on the Tours record and shapes every individual stop's copy.

### Art/Official dialogue for stop copy
Once sequence, angles, and arc are confirmed, Art/Official draws out each stop's copy in dialogue:

*"We're at Rosenthaler Tor — stop 3. You found a historical photograph for this one. What do you want someone to know about this gate and this painting when they're standing here?"*

Copy register: present-tense, intimate, as if Bernard is standing there with the visitor. Not a history lecture — personal. The historical context is in the `keyHistoricalDates` on the artwork record. The `tourStopCopy` is Bernard's voice in the moment.

Maximum 3–4 sentences per stop. Enough to read in 7 seconds without rushing.

---

## Tour as template

This infrastructure is generic. The same Tours collection, map layers, play mode, scrub interaction, and audio system works for:

- Any Bernard series with a geographic logic
- Other artists' series on future instances of the archive
- Museum audio guides
- Literary city walks
- Historical route tours
- Any sequenced geographic experience

The Gates of Perception tour is the first instance. Build it right and everything else is configuration, not construction.

**Future Bernard tours that become obvious once this infrastructure exists:**
- Mediums of Perception Grand Tour — Berlin, Munich, and future cities
- San Francisco A Colorful History tour — the original series as a neighbourhood walk
- Any new series Bernard makes specifically because the tour infrastructure exists

---

## Cursor implementation notes

**Implementation order:**
1. `Tours` collection in Payload
2. New fields on Artworks ACH tab (`tourStopDuration`, `tourReady`)
3. GeoJSON files sourced and uploaded to R2
4. Tour mode UI — controls bar, bottom strip filtered, map layers, legend panel
5. Scrub interaction — GSAP progress value driving map + copy + strip simultaneously
6. Play mode — rhythm, stop duration, word count calculation
7. Audio layers — ambient music + field recording crossfade

**The scrub implementation:**
Single GSAP progress value 0–N. MapLibre camera driven by coordinate interpolation from the same value. Copy opacity and scale tied to fractional distance from stop centre. Bottom strip scroll position derived from the same value. Everything from one number.

**`USE_VIEW_TRANSITIONS` pattern** from the map-to-artwork transition applies here too — wrap any experimental animation in a feature flag constant for easy disable during testing.

**GeoJSON layers** loaded as MapLibre GL sources at tour mode activation. Each layer added as a separate source and layer in MapLibre, toggled via `setLayoutProperty('visibility', 'visible'/'none')`.

---

*This brief covers the Tours collection schema and the Gates of Perception tour content session.*
*Pass to Cursor for schema + interaction implementation.*
*Pass to Art/Official for tour content session after Bernard provides the stop sequence and angles.*
*Next: Brief 03 (Map & Tour Design) should be updated to reference this brief for tour mode details.*
