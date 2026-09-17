# Brief 10 — Homepage Artwork API Query (Rewrite)
## A Colorful History · acolorfulhistory.com

*Implementation spec for Cursor. Rewrites the homepage data-fetching layer against the confirmed live Payload schema — replaces guesswork in `brief-09-list-card-images.md` and retires a stale WordPress-era code sample in `design-system.md`.*
*Read alongside: `brief-09-list-card-images.md` (card anatomy — unchanged by this brief) · `brief-hero-list-system.md` §7 (component structure)*

---

## Why this brief exists

The homepage list was returning small/broken images, no series tag, and was missing the entire "Breaking Down Art" series. Root cause, confirmed by direct inspection of the live Payload instance (see inspection report, Aug 2026):

1. **`design-system.md` contains a stale WordPress/WPGraphQL-era code sample** (`artwork.artworkFields.artworkImage.mediaDetails.sizes[1].sourceUrl`, `artwork.artworkFields.proportion`) that doesn't correspond to anything in the current Payload schema. **This snippet is retired as of this brief — do not use it for any new work.**
2. **`brief-09-list-card-images.md` inherited the same wrong field name** (`proportion`) from that stale doc. The live field is `aspectRatio`.
3. **The homepage query itself was never rebuilt for Payload** — it's not that Breaking Down Art was filtered out on purpose, the query needs writing fresh. BDA's series record exists, is published, and has three published artworks (`venice-in-the-middle`, `venice-biennale-2007`, `skulptur-projekte-m-nster-2007`) — a correctly-written "all published artworks" query returns it automatically, no special-casing needed.

This brief is the fresh, correct version of that query, grounded in the confirmed live schema.

---

## 1 · Corrected field names

| Old (wrong) | Correct (live schema) | Notes |
|---|---|---|
| `artwork.artworkFields.proportion` | `artwork.aspectRatio` | Number. `widthMm ÷ heightMm`, computed server-side. |
| `artwork.artworkFields.artworkImage.mediaDetails.sizes[1].sourceUrl` | `artwork.primaryImage` (populated at `depth ≥ 2`) | Upload relation → `media` collection. Populated object shape needs one quick check — see §4 open item. |
| implied `title` on series | `series.name` | Series collection uses `name`, not `title`, as its display field (`useAsTitle: 'name'`). |

Update `brief-09-list-card-images.md` §1 and §4 in place: `proportion` → `aspectRatio` everywhere it appears. No other part of brief-09 changes.

---

## 2 · The query

```
GET https://bernardbolter.com/api/artworks
  ?where[status][equals]=published
  &depth=2
  &sort=-createdAt
  &limit=500
```

- `status=published` is technically redundant (the collection's public read access already restricts to `status: published` + `recordOrigin: artist-catalogued`), but keep it explicit in the query for readability and in case access rules change later.
- **No series filter of any kind on the base fetch.** Every published series — Mediums of Perception, Mediums of War, Breaking Down Art, Gates of Perception, and any future series — comes back from one unfiltered call. Filtering (§2b) is applied client-side or as additional `where` params against this same endpoint, never a separate per-series query.
- `depth=2` is required to get `primaryImage` and `series` populated as nested objects instead of bare IDs. Confirmed from the live response: at `depth=2`, `series` returns `{ id, name, slug, status, ... }` — use `series.name` for the metadata tag, not `series.title`.
- `sort=-createdAt` — **default sort, confirmed:** most recently added first. Payload's standard `createdAt` timestamp field, descending.
- `limit=500` — **fetch-everything mode, confirmed for now.** No pagination at launch; catalogue is small enough that one call covers it. Revisit and add real pagination once the catalogue grows past what's comfortable in a single payload — not an issue today. `500` is a generous ceiling, not a real cap; bump if the catalogue ever approaches it.

### 2a · Hero exclusion — no change needed

Per `brief-hero-list-system.md` §3, the hero draw (slot 0) is a **separate, independent query** against the `heroEligible` pool — it does not come from this list query, and touching sort/filter on the list already correctly "demotes the hero" per that brief's existing rule. This brief's query sits entirely underneath that rule; no new logic required here. Worth restating for Cursor's benefit since it's easy to conflate the two fetches while rewriting this one.

### 2b · Sort and filter (user-facing)

The homepage needs a sort/filter UI, not just a fixed fetch. Confirmed facets and behavior:

| Facet | Live field | Notes |
|---|---|---|
| **Series** | `where[seriesSlug][equals]=<slug>` | Use `seriesSlug` (denormalized text field), not the `series` relation ID — avoids an extra lookup to resolve slug → ID. |
| **City** | `where[city][equals]=<city>` | Direct text field match. |
| **Year / decade** | `where[yearCreated][greater_than_equal]=X&where[yearCreated][less_than_equal]=Y` | Decade UI groups into a range query under the hood. |
| **Availability** | See open item 5 below — field/value mapping isn't settled yet. |

Sort control (separate from filter): expose at minimum "most recent" (`-createdAt`, default) and "chronological" (`yearCreated`, ascending) — both cheap, both already-confirmed fields. Additional sort options (e.g. by city alphabetically) can be added later without a schema change.

Filters are combinable (e.g. series = Mediums of Perception + city = Berlin) — standard `where` param stacking, Payload supports this natively via multiple `where[field][operator]=value` params in one request.

---

## 3 · Field mapping for `ListCard.tsx`

Per `brief-09-list-card-images.md` §4, the data requirements for each card, mapped to actual live field paths:

| Brief-09 requirement | Live field path |
|---|---|
| `title` | `title` |
| `proportion` | `aspectRatio` |
| `imageUrl` | `primaryImage.url` (verify exact key — see open item 1) |
| `place` | `city` |
| `year` | `yearCreated` |
| `series` (name) | `series.name` |
| `slug` | `slug` |

Image width calc from brief-09 §1 stays the same formula, corrected field name:
```
width = 230 * artwork.aspectRatio
```

---

## 4 · Open items — confirm before or during build

1. **Exact `primaryImage` populated shape** — the inspection report confirmed `primaryImage` is an `upload → media` relation but didn't capture the populated object's exact keys (`url` vs `filename` + `sizes.card.url` etc., typical of Payload uploads with R2 storage). Quick check: hit `/api/artworks?limit=1&depth=2` and inspect the `primaryImage` object directly before wiring `ListCard.tsx`'s image `src`.
2. ~~Sort order~~ — **resolved:** default is `-createdAt` (most recently added first). See §2.
3. ~~Pagination / limit~~ — **resolved:** fetch everything (`limit=500`), no pagination for now. See §2.
4. **`aspectRatio` can be `null`** if dimensions are missing on a record (confirmed in the computed-field notes). `ListCard.tsx` needs a sane fallback width (e.g. treat as square, `aspectRatio = 1`) rather than breaking layout.
5. **Availability filter — resolved: unified visitor-facing filter.** One set of options is shown to the visitor regardless of which underlying field backs a given series — visitors don't think in schema, they think "can I get this." Mapping:

   | Visitor sees | Archive `availabilityStatus` | ACH `ach.mop.availabilityStatus` |
   |---|---|---|
   | **Available** | `available` | `original-available` |
   | **Sold** | `sold`, `not-for-sale`, `on-loan`, `reserved`, `on-consignment` (all collapse here — visitor doesn't need four more granular states) | `sold` |
   | **Prints only** | *(no archive-level equivalent yet)* | `prints-only` |

   Series without an ACH tab (e.g. Breaking Down Art, Gates of Perception today) simply never surface "Prints only" as a live option — they fall under Available/Sold like anything else, which is accurate, not a gap. This is forward-compatible: when a series gains print editions later, it starts appearing under "Prints only" with no filter-logic changes needed, only data.

   Implementation note: this mapping should live in one shared constant (e.g. `getUnifiedAvailability(artwork)`), not duplicated per-component — same principle as the proportion/aspectRatio and offset-counting logic elsewhere in these briefs.

---

## 5 · What NOT to do

- Do not reintroduce any reference to `artworkFields`, `mediaDetails`, or `proportion` — these belong to a retired WordPress-era data shape and don't exist in the live Payload schema.
- Do not hardcode a series allowlist/exclusion list in the query. If a series shouldn't appear on the homepage for editorial reasons, that's a `status` or visibility decision made in Payload on the Series record itself — not a client-side filter.
- Do not duplicate this query logic per-series. One fetch, filtered/grouped client-side if needed for spotlight card placement (per `brief-06-homepage-nav-revamp.md` §2).

---

## First chat prompt for Cursor

```
I'm fixing the homepage artwork data-fetching for A Colorful History
(acolorfulhistory.com). Please read brief-10-homepage-artwork-query.md in
full first — it corrects field names from an earlier stale doc and confirms
the live Payload schema.

Task:
1. Write/replace the homepage artwork fetch to call
   GET https://bernardbolter.com/api/artworks?where[status][equals]=published&depth=2&sort=-createdAt&limit=500
   with no series filter on the base fetch — all published series must come
   back in one call, Breaking Down Art included.
2. Confirm the exact populated shape of `primaryImage` at depth=2 (hit the
   live endpoint, inspect the object) and wire ListCard.tsx's image src to
   the correct key.
3. Update ListCard.tsx per brief-09-list-card-images.md, using the corrected
   field mapping in section 3 of brief-10: `aspectRatio` (not `proportion`),
   `series.name` (not `series.title`), `city`/`yearCreated` for the metadata
   line. Handle `aspectRatio: null` with a square fallback.
4. Remove any reference to the old artworkFields/mediaDetails shape from
   design-system.md's Image component example — replace it with the
   corrected primaryImage + aspectRatio version once step 2 confirms the
   exact key.
5. Build sort control: "Most recent" (`-createdAt`, default) and
   "Chronological" (`yearCreated` ascending) per section 2b.
6. Build filter controls for Series, City, Year/decade, and Availability per
   section 2b — these are combinable, stack multiple `where` params in one
   request. For Availability, implement the unified mapping in open item 5
   (a single shared helper, e.g. `getUnifiedAvailability(artwork)`, not
   duplicated per-component) so the visitor sees Available / Sold / Prints
   only regardless of which underlying field a given series uses.
7. Confirm hero draw (slot 0) remains a fully separate query against the
   heroEligible pool per brief-hero-list-system.md §3 — do not fold it into
   this fetch, and confirm filter/sort interactions still "demote the hero"
   per that brief's existing rule.

Do not add any series-specific filtering logic to the base fetch itself —
filtering happens via explicit user-facing controls (step 6), not hardcoded
inclusion/exclusion.
```

---

*Captured August 2026. Supersedes the image-fetching portion of `brief-09-list-card-images.md` and the WordPress-era Image component sample in `design-system.md`.*
