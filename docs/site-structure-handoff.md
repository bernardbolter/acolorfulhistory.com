# New Chat Prompt — A Colorful History: Site Structure

Drop this at the top of a new chat in the A Colorful History project to start working out the website structure page by page.

---

## What this chat is for

The design system for A Colorful History is locked. The next step is to plan the full page and route structure of the site **before building any components**. We need to know what pages exist, what lives on each one, how they connect, and what the user journey looks like — then components can be built with confidence.

This planning work may feed back into the design system. That is expected and fine.

---

## The project

**A Colorful History** is the website for Bernard Bolter, a Berlin-based artist. Mixed media paintings — acrylic photo transfers onto canvas combined with bold painted acrylic fields. Works in series, each with a distinct conceptual framework.

**Hard launch: 48 Stunden Neukölln, June 2025** — Berlin open studio. The Berlin triptych from *Mediums of Perception* must be live and purchasable. One new city triptych per month is the ongoing commercial rhythm post-launch.

**Series history:**
- 2003–2005 New York — *Vanishing Landscape*, first photo transfer experiments
- Amsterdam — *Digital City Series*, pure photo collage
- 2013 San Francisco — *A Colorful History*, first historical photographs, gallery success
- Berlin — *Gates of Perception*, *Mediums of War*, *Mediums of Perception* (current, ongoing)

**Current series — Mediums of Perception:**
Triptychs, one per city. Each takes one architectural subject through three image technologies: earliest known photograph → historical lithograph → contemporary aerial/digital. Each panel has an AR layer (mind.js) — point your phone at the painting, a video plays of the artist rapping the history of the place. Originals for sale. Print editions: 15 sets A3, 30 sets A5 per triptych.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js App Router |
| Styling | Tailwind CSS — single breakpoint `769px` → `l:` prefix only. Never sm/md/lg/xl. |
| CMS | PayloadCMS + Neon (Postgres) |
| Ecommerce | Vendure (independent service) |
| AR | mind.js |
| Maps | @vis.gl/react-maplibre + Protomaps grayscale vector tiles |
| i18n | next-intl (EN + DE) |
| Schema | schema.org + JSON-LD programmatic on every page |

---

## What already exists and works — do not redesign these

The site currently has a working home page. These components are built and functional:

**Map** — Full viewport MapLibre GL map. Grayscale Protomaps tiles. Artwork pins in painting palette colors (random per artwork, consistent via state). Popups with proportion-width thumbnails. Click-to-navigate triggers artwork animation. No zoom library — click only.

**Map nav strip** — 110px fixed bottom. Proportion-width × 100px thumbnails. TranslateX scroll (not native scroll). Left/right 30px arrow buttons.

**Navigation panel** — Hamburger button (4 spans, distinctive stagger). Slide panel 300px wide on desktop. Toggle switches for Map↔List and EN↔DE.

**Filter tab** — Fixed bottom-right. Slides up. Hard-edged 12×12px square filter dots in painting palette colors.

**Artwork animation** — Full viewport overlay, z-index 10000. Image animates from popup position to center of viewport. Click navigates to artwork detail.

**Logo** — SF Speakeasy font baked into SVG. 200px wide. Source of truth — never recreate in HTML/CSS.

---

## Design system — key decisions locked

**Two fonts only:**
- Barlow Semi Condensed — all UI, body, metadata, navigation
- Limelight — artwork titles on detail page (no ornament) and series/page headings (with ornament)

**Title ornament component:**
Broken double rule with centered diamond ◆ underneath Limelight titles at page/section level. 70% of title width, centered. Top rule 2px, bottom rule 1px at lower opacity. Diamond matches title color (#1A1A1A). Rule color: near-black for now (#1A1A1A at 55% opacity) — palette color per city/series deferred until pages are built.

**Painting palette** (extracted from 3 source paintings):
- Field colors: `$paint-sky-warm` #A8D6E8, `$paint-sky-vivid` #4AAED4, `$paint-warm-white` #F4F2EE, `$paint-mid-grey` #B8B8BC, `$paint-charcoal` #3A3F4A
- Accent colors: `$paint-cream` #F0E8C0, `$paint-deep-gold` #E8C15A, `$paint-burnt-amber` #B8742A, `$paint-terracotta` #D4785A, `$paint-dusty-salmon` #C4907A, `$paint-burgundy` #8C3A42, `$paint-mid-green` #8BAF62, `$paint-forest-green` #2A4A28
- Gate element: `$paint-gate` #2A1545 — deep purple, use once deliberately

**Small caps labels:** 0.5625rem / 700 / letter-spacing 0.18em / uppercase / $paint-burnt-amber

**Image loading placeholders:** Flat painting palette color fills artwork space before image loads. City-mapped: Berlin → sky warm, SF → mid grey, Munich → cream, Amsterdam → dusty salmon. Wrapper div approach, not Next.js blur.

**Rectangle overlay on artwork images (rough spec, to be built):**
On hover, 1–4 flat color rectangles animate over the artwork image. Colors and positions stored in Payload per artwork — artist-curated, referencing the painted fields in that specific canvas. Agent analyses image on upload and suggests positions/colors, Bernard confirms. Animation: slide from nearest edge or fade in, 300ms ease-out. Stay on hover, fade out on leave. Text inside rectangle not yet decided. About/Contact pages get an ambient version — randomised from painting palette, no per-artwork data needed.

**Damask wallpaper:** Baroque pattern at 7% opacity for information-heavy sections (About, series descriptions). Deferred to when those pages are built.

**What NOT to do:**
- Never use sm/md/lg/xl breakpoints — only `l:` (769px)
- Never px for font sizes — rem only
- Never use react-medium-image-zoom — removed, conflicts with artwork animation
- Never add zoom to map popups
- Never use blur placeholder on images — flat color wrapper approach only
- Never use the old spectrum/rainbow colors — retired, painting palette only
- Never duplicate data between archive and series layers

---

## Data architecture

PayloadCMS is the single source of truth. Two layers:

**Archive layer (universal fields, all artworks):**
Title, year, medium, dimensions, series name, city, country, size tier, orientation, exhibition history, one good image, overlay colors (curated field colors for rectangle hover), overlay rects (positioned rectangles per artwork).

**Series layer (series-specific fields, own Payload tab):**
For Mediums of Perception: source photograph details, image capture technology (daguerreotype/lithograph/aerial etc), historical context copy, three-part progression logic, AR video link per panel, lat/lng for map pins, edition/print data, AR rap script per panel.

---

## The map and tour feature

The map is the connective tissue of the whole practice. Two modes:
- **Series Tours** — focused thematic journey through one series or city
- **The Grand Tour** — New York → Amsterdam → San Francisco → Berlin → beyond, full autobiographical arc

Tours built from Payload — a Tour collection with ordered stops (artwork or series nodes), each with narrative copy. New city releases become new map pins automatically.

---

## What needs to be worked out in this chat

Work through the site structure page by page. For each page define:
1. Purpose — who is it for, what job does it do
2. Content — what lives here
3. Components needed — what needs to be built
4. Connections — how it links to other pages
5. Payload fields it needs
6. schema.org/JSON-LD output
7. June scope vs post-launch roadmap

**Known pages to work through (not exhaustive):**
- Home — map view (exists, needs review)
- Home — list view (toggle from map)
- Artwork detail page
- Series overview — Mediums of Perception
- Triptych detail — individual triptych (e.g. Berlin triptych)
- AR experience page / modal
- Store / prints
- About
- Contact
- The Grand Tour / map tour view
- Series archive pages (Gates of Perception, earlier work)

---

## Separate project — AI readability / archive intelligence

Being worked out in the **bernardbolter.com archive project**, not here. The idea: CLIP vector embeddings stored per artwork in Payload via pgvector on Neon, agent-assisted field filling on image upload, JSON-LD `VisualArtwork` schema on every page. Will feed back into A Colorful History once the archive model is established. Do not build this here — note it as a dependency.

---

## Files available in this project

- `design-system.md` — full design system reference for all agents building components
- `design-system-visual.html` — visual reference, open in browser alongside the md
- `master-brief.md` — full project context and ecosystem overview
- `damask-source.jpg` — baroque damask pattern asset for future use

*Prompt written: April 2026*
