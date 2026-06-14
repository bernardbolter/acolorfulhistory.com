# Schema Summary — A Colorful History
*Current state. April 2026.*

---

## Architecture

**One Payload instance** — bernardbolter.com is the single source of truth. All artwork data lives there. A Colorful History queries it. No sync problem, no duplication.

**bernardbolter.com Payload** owns:
- Base artwork records (universal fields for all series)
- ACH-specific tab on each artwork record
- All ACH collections: Triptychs, Series, Tours, Products

**acolorfulhistory.com** is a consumer — Next.js App Router queries the archive Payload via API.

**Cloudflare R2** — all images and videos. Already hooked up to Payload.

**Vendure** — commerce engine, independent service. Payload holds thin product references. Vendure holds price, inventory, cart, checkout.

---

## Collections

### Artworks
*Base collection — universal fields for all Bernard's work*

| Field | Type | Notes |
|---|---|---|
| `title` | Localized text | |
| `year` | Number | |
| `medium` | Text | e.g. *Acrylic photo transfer on canvas* |
| `dimensions` | Text | e.g. *80 × 80 cm* |
| `city` | Text | Drives map pin placement and image placeholder colour |
| `country` | Text | |
| `series` | Relationship → Series | |
| `triptych` | Relationship → Triptychs | Parent triptych if applicable, nullable |
| `image` | Upload → R2 | Single hero image |
| `slug` | Text | URL slug |
| `exhibitionHistory` | Array of text | Gallery, year |
| `status` | Select: available / sold / prints-only | Original availability |

**ACH tab — A Colorful History specific fields:**

| Field | Type | Notes |
|---|---|---|
| `overlayColors` | Array of hex strings | 2–6 curated field colours from this painting |
| `overlayRects` | Array of `{color, x, y, w, h}` | 1–4 positioned rectangles, artist-curated |
| `lat` | Number | GPS latitude. Null for MoW (no map presence) |
| `lng` | Number | GPS longitude. Null for MoW |
| `mapPresence` | Boolean | Whether to show on map. False for MoW |
| `tourSequence` | Number | Position in series tour, nullable |
| `grandTour` | Boolean | Include in Grand Tour |
| `grandTourSequence` | Number | Position in Grand Tour |
| `tourStopCopy` | Localized text | Short narrative for when this stop is active |

*Note: `overlayRects` are artist-curated, not algorithmic. An agent suggests positions on image upload, Bernard confirms. Agent proposes, Bernard decides.*

---

### Triptychs
*Parent works. Three Artwork children per triptych.*

| Field | Type | Notes |
|---|---|---|
| `title` | Localized text | e.g. *Berlin, 2024* |
| `series` | Relationship → Series | MoP or MoW |
| `city` | Text | |
| `year` | Number | |
| `concept` | Localized rich text | Conceptual framework for this triptych |
| `panels` | Relationship → Artworks (array of 3) | The three individual paintings |
| `arUrl` | Text | e.g. `/ar/berlin` — loads all three markers |
| `videos` | Array of `{panel: 1/2/3, type: making/history/freestyle, url: R2}` | 9 videos per triptych |
| `status` | Select: available / sold / prints-only | Original set availability |
| `printSets` | Array — see below | |
| `printSets[].size` | Select: large / small | A3 or A5 |
| `printSets[].edition` | Number | 15 large / 30 small |
| `printSets[].price` | Number | |
| `printSets[].vendureProductId` | Text | Sync with Vendure |
| `printSets[].available` | Number | Remaining — synced from Vendure via webhook |
| `featuredOrder` | Number | Position on MoP series page |
| `discoverable` | Boolean | False for MoW — not in nav, reached via MoP only |
| `slug` | Text | |

---

### Series
*Gates of Perception, Vanishing Landscape, Mediums of Perception, Mediums of War*

| Field | Type | Notes |
|---|---|---|
| `title` | Localized text | |
| `slug` | Text | |
| `description` | Localized rich text | |
| `period` | Text | e.g. *2003–2005* |
| `cities` | Array of text | |
| `mapPresence` | Boolean | Whether artworks appear on main map |
| `tourEnabled` | Boolean | Post-June — activates tour UI when true |
| `tourIntro` | Localized rich text | Narrative intro for the tour |
| `grandTourIncluded` | Boolean | |
| `filterLabel` | Localized text | Short label for map/list filter dot |
| `filterColor` | Hex | From painting palette |
| `coverImage` | Upload → R2 | |

---

### Tours
*Post-June collection. Schema built now so field decisions don't need revisiting.*

| Field | Type | Notes |
|---|---|---|
| `title` | Localized text | |
| `series` | Relationship → Series | |
| `type` | Select: series / grand | |
| `intro` | Localized rich text | Arc-level narrative |
| `stops` | Ordered relationship → Artworks | The sequence |
| `active` | Boolean | Toggle to activate tour UI — default false |

*Rationale for separate collection vs fields only on Artwork:*
Tours need arc-level metadata (intro, type, narrative) that doesn't belong on any individual artwork. The Grand Tour spans Bernard's whole career across multiple cities and needs its own structure. Artwork still holds `tourStopCopy` (what Bernard says when standing there) but the sequence and arc live on the Tour.

---

### Products
*Thin Payload reference. Vendure is the commerce source of truth.*

| Field | Type | Notes |
|---|---|---|
| `triptych` | Relationship → Triptychs | |
| `vendureProductId` | Text | |
| `type` | Select: print-set-large / print-set-small / ribba-set | ribba-set is post-June |
| `active` | Boolean | |

---

### Small Prints *(post-June — RIBBA set builder)*

| Field | Type | Notes |
|---|---|---|
| `image` | Upload → R2 | |
| `title` | Localized text | |
| `city` | Text | |
| `year` | Number | |
| `available` | Boolean | In stock for set building |

*The RIBBA set builder allows selecting 5 small prints for a fixed price. Drag-and-drop interface, see them grouped as a framed set before purchase. Schema placeholder only — full design to be worked out in store session.*

---

## Multilingual Strategy

**JSON files** (`/messages/en.json`, `/messages/de.json`) — all UI chrome:
- Navigation labels and question cards
- Button text
- Error messages
- Common labels (series, year, medium, edition, etc.)

**Payload locale fields** — all content:
- Artwork titles and descriptions
- Series descriptions and tour narratives
- Tour stop copy
- Triptych concept text

Every content text field in Payload has a locale variant from day one. When a new language is added for a new city series, one JSON file covers the UI and Payload handles the content fields.

---

## Vendure ↔ Payload Sync

**On sale in Vendure:** Webhook fires → updates `printSets[].available` in Payload

**On page render:** ACH reads `available` from Payload (no live Vendure call needed for count display)

**Add to cart:** ACH client calls Vendure API directly

**Checkout:** Vendure-hosted or custom flow styled to design system — to be decided in store session

---

## Image Placeholder Colours (city-mapped)

| City | Colour | Token |
|---|---|---|
| Berlin | `#A8D6E8` | `$paint-sky-warm` |
| San Francisco | `#B8B8BC` | `$paint-mid-grey` |
| Munich | `#F0E8C0` | `$paint-cream` |
| Amsterdam | `#C4907A` | `$paint-dusty-salmon` |
| New York | `#B8B8BC` | `$paint-mid-grey` |
| Fallback | `#F4F2EE` | `$paint-warm-white` |

---

## What's Not Yet in the Schema

These will surface from the design sessions:

- Individual artwork page — any additional fields needed for the concept/context section per series
- MoP triptych detail — any fields the responsive triptych design requires
- Store — RIBBA set builder fields (placeholder above, detail deferred)
- About page — content fields TBD in its own session
- Archive tab — full field list for ACH tab on Artwork needs mapping against existing bernardbolter.com schema once that's uploaded

---

## Pre-Build Dependencies

These block launch if not resolved before build begins:

- [ ] Brandenburg Tor — full uncropped B&W source photograph (hero sequence)
- [ ] Kottbusser Tor — full uncropped colour source photograph (hero reveal)
- [ ] Berlin AR videos × 9 produced and uploaded to R2
- [ ] Berlin Mind.js marker file generated from panel images
- [ ] Vendure products created and priced
- [ ] Munich print files print-ready and on R2
- [ ] bernardbolter.com archive schema uploaded — to map ACH tab fields against existing structure

---

*Schema will be updated after each design session as new fields surface.*
*Next sessions: Individual Artwork Page, MoP Series + Triptych Detail, Store.*
