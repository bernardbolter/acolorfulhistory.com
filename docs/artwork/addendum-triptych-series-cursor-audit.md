# Addendum — Triptych Page + MoP Series Overview Build Audit
## A Colorful History · acolorfulhistory.com

*Cursor's status check of `/series/mediums-of-perception` and `/series/mediums-of-perception/[city]` (and the artwork-page panel nav that connects them) against the locked specs listed below. Report only — nothing was changed in this pass.*
*Captured Aug 25 2026. Format follows [addendum-artwork-page-cursor-audit.md](./addendum-artwork-page-cursor-audit.md) and [addendum-homepage-cursor-audit.md](./addendum-homepage-cursor-audit.md).*

**Briefs read in the requested order** (later supersede earlier where noted): `docs/ach-site-design-and-architecture.md` (route map + MoP overview + Triptych page + embedded Brief 02) · `docs/handoff-mop-series-triptych.md` (brainstorm; open questions treated as **resolved by Brief 02**, not still-open) · `docs/schema-summary.md` · canonical `docs/design-system.md` · [decision-keep-site-series-allowlist.md](./decision-keep-site-series-allowlist.md) · [addendum-artwork-page-cursor-audit.md](./addendum-artwork-page-cursor-audit.md) (TriptychLink scope-creep finding) · [addendum-homepage-cursor-audit.md](./addendum-homepage-cursor-audit.md) (format, read last).

**Panel navigation addendum:** [addendum-triptych-panel-detail-navigation.md](./addendum-triptych-panel-detail-navigation.md) (checked in Aug 25 2026 after this audit). Decisions: (1) panel detail is the standard artwork page; (2) prev/next cycles the triptych’s three panels in `triptychPosition` order **and wraps** (`I↔II↔III↔I`). Brief 02 in `ach-site-design-and-architecture.md` says “computed from `triptychPosition`” without spelling wrap — the addendum is the lock for wrapping. Non-MoP artworks keep whatever general related-works adjacency exists elsewhere (today: none).

**Sibling brief:** `docs/brief-02-triptych-page-design.md` is the *pre-resolution* chat brief (old URL `/triptych/[slug]`). The locked spec is the Brief 02 **embedded in** `ach-site-design-and-architecture.md` (route `/series/mediums-of-perception/[city]`). Handoff items superseded by that Brief 02 (AR section on the triptych page, prev/next *triptych* navigation, “what needs deciding”) are not treated as open.

Live Payload check (Aug 25 2026, production `bernardbolter.com`, public API, no key): `GET /api/triptychs` → **200, `totalDocs: 0`**. `GET /api/artworks?where[seriesSlug][equals]=mediums-of-perception` → **0**. Same for `mediums-of-war`, `series.slug` relation, drafts, `draft=true`, trash. Series *records* `mediums-of-perception` and `mediums-of-war` exist (`status: published`, `name` set, `title` absent, `description: null`). Consistent with [payload-ach-live-audit.md](./payload-ach-live-audit.md) (Aug 18): still zero triptychs, still zero MoP/MoW artworks, still no Munich.

---

## Bottom line

**The Berlin and Munich triptychs were never entered into Payload.** This is not a Gates-of-Perception-class silent filter. The `Triptychs` collection exists (the endpoint is live). It is empty. No Artwork is tagged `mediums-of-perception` or `mediums-of-war`, published or draft. No Munich slug/title/city exists. Existing Berlin paintings (Reichstag, Brandenburg Gate, Berliner Schloss, Gates of Perception tor series, etc.) are `a-colorful-history` or `gates-of-perception` with `triptych: null` and empty `ach.mop` (`triptychPosition` / `imageCaptureLabel` / `availabilityStatus` all null). They are the main catalogue, not unpublished MoP panels sitting behind the wrong series slug.

`SITE_SERIES_SLUGS` already includes `mediums-of-perception` and `mediums-of-war` ([decision-keep-site-series-allowlist.md](./decision-keep-site-series-allowlist.md), Fix Pass 2). The allowlist cannot be hiding records that are not there. Triptych queries on this bundle **do not use** the artwork allowlist; they query collection `triptychs` by `series.slug`.

That changes how to read the rest of this audit. The **routes exist and render**. They have never been tested against real triptych data. `/en/series/mediums-of-perception/berlin` and `/munich` are honest empty states (“Coming soon” + city heading). The **overview is a worse empty:** the Series document exists, so the page skips “Coming soon,” renders a **blank `<h1>`** (mapper reads `series.title`; live field is `name`), and an empty list — it looks like a built page with no content, not like an unseeded CMS.

The component tree for Brief 02 is substantially sketched (mobile swap, desktop hover, `#commerce`, overview row, artwork-page `TriptychLink`). Several mismatches are already visible in code and will bite the first time a record is published: MoW triptychs queried from the MoP series filter (Gates-shaped latent bug), city lookup is exact-match on the URL segment (`berlin` vs `Berlin`), prev/next does not wrap, desktop omits source photographs, damask is not implemented, Vendure is unconfigured.

Do not treat this bundle as a layout-QA target until at least one Payload triptych (three panels + `featuredOrder` + `concept` + commerce fields) is published. Seeding is the first punch-list item, not a polish pass on empty shells.

---

## Investigation — live Payload (read this before the page scores)

### Triptychs collection

| Check | Result |
|---|---|
| `GET /api/triptychs` | **200** — collection exists |
| `totalDocs` (unfiltered) | **0** |
| `where[status][equals]=published` | 0 (`status` on this collection is commerce: available / sold / prints-only per schema-summary, not draft/published) |
| `draft=true` / trash | 0 |
| `/api/triptych`, `/api/Triptychs` | 404 — slug is `triptychs` |

No Berlin record. No Munich record. No `featuredOrder`, `discoverable`, `panels`, or `concept` to inspect.

### Artwork panels

| Query | Published docs |
|---|---|
| `seriesSlug=mediums-of-perception` | **0** |
| `seriesSlug=mediums-of-war` | **0** |
| `series.slug=mediums-of-perception` / `mediums-of-war` | **0** |
| `ach.mop.triptychPosition=I` | **0** |
| `ach.mop.imageCaptureLabel` exists | **0** |
| `city=Munich` / `München` / `muenchen` | **0** |
| title/slug `like` Munich / München / Triptych | **0** |
| `city=Berlin` published | **32** — none are MoP |

Sample Berlin ACH work `brandenburger-tor-1899` at depth 2: `triptych: null`. `ach.mop`: `{ imageCaptureType: null, imageCaptureLabel: null, triptychPosition: null, availabilityStatus: null, relatedTriptychs: [] }`. Same empty MoP group shape appears on other Berlin records; it does not mean they are triptych panels.

Reichstag slugs (`reichstag-1894`, `reichstag-2020`, `reichstag-1971-2020`) are `a-colorful-history`, not a three-technology MoP set.

### Series records (exist; empty of children)

Both **published**, parent `a-colorful-history`:

- `mediums-of-perception` (id 2) — `name: "Mediums of Perception"`, **no `title` key**, `description: null`, created 2026-05-18
- `mediums-of-war` (id 3) — `name: "Mediums of War"`, same shape

Master-brief / handoff (“Berlin in progress for June 2025 launch”, “Munich commission, originals sold, prints available”) describe work that was never written into this CMS. The public API would return drafts if Payload exposed them without a key; `draft=true` still returns 0. If drafts exist only in authenticated admin, this audit cannot see them — but the consumer site cannot see them either.

### Allowlist vs this empty set

`lib/siteSeries.ts` includes both MoP slugs. `getArtworksLite` / `getArtworkBySlug` use `buildSiteSeriesWhereParams()`. `getMoPSeriesOverview` / `getTriptychByCity` / `getTriptychBySlug` **do not**. Triptychs are ACH-exclusive by schema (MoP or MoW on the Triptych `series` relation). The empty overview is not an allowlist omission.

---

## Tier 1 — silent bugs

Wrong data or broken functionality without a visible error. Several are **latent** (they fire when the first record is published). One is **live today**.

- **Overview title is empty while the Series record exists.** `mapPayloadSeriesToSeries()` (`lib/mappers/triptychFromPayload.ts` line 69) sets `title: doc.title`. Live Series uses `name` (`useAsTitle: 'name'`), same as artworks — `lib/mappers/media.ts` `relationName()` already documents this. `getMoPSeriesOverview` finds the series, so `MoPOverviewPage` skips the `comingSoon` branch (`components/Pages/MoPOverviewPage.tsx` lines 14–27 vs 29–46). Local `GET /en/series/mediums-of-perception` → **200**, visible “Coming soon” **false**, `<h1 …></h1>` **empty**, empty `ul.space-y-8`. Nav still prints “Mediums of Perception” from `messages/en.json`. Looks like a designed blank page.

- **MoW triptychs would never appear on the overview (Gates-shaped, latent).** `getMoPSeriesOverview` (`lib/data.ts` lines 110–116) queries `where[series.slug][equals]=mediums-of-perception` only. `buildMoPOverview` (`lib/mappers/triptychFromPayload.ts` lines 93–100) then splits `discoverable !== false` vs `discoverable === false` **on that same array**. A Mediums of War triptych (`series.slug=mediums-of-war`, `discoverable: false` per schema-summary) never enters the query. The MoW section (`MoPOverviewPage.tsx` lines 50–58) stays unmounted even after MoW is seeded. Spec: MoW lives at the bottom of this page, reached by scrolling, not a separate series page.

- **City page lookup is exact-match on the URL segment (latent).** `getTriptychByCity` (`lib/data.ts` lines 64–80) uses `where[city][equals]=` the `[city]` param. Overview links `triptych.city.toLowerCase()` (`TriptychOverviewRow.tsx` line 16). Handoff/schema examples are `Berlin`, not `berlin`. First published record with `city: "Berlin"` will 200 the overview row and **Coming-soon the detail page**. No slug fallback (`getTriptychBySlug` exists but the city route does not use it).

- **`getArtworkBySlug` would 404 a MoP panel that was published but forgotten from the allowlist — that is not the current failure.** The slugs are already on the list. The current failure is: there are no panel documents. If Bernard enters panels under `a-colorful-history` (how every Berlin work lives today), they will show on the homepage list and **not** as MoP triptych children. Admin: ACH MoP group is hidden unless `seriesSlug` is mop/mow ([payload-ach-live-audit.md](./payload-ach-live-audit.md)) — `triptychPosition` / MoP `availabilityStatus` cannot be filled on ACH-tagged works.

- **Prev/next does not wrap.** `TriptychLink.tsx` lines 28–33: `prev` only if `currentIndex > 0`; `next` only if not last. Panel I has no prev; III has no next. The missing addendum / this prompt wanted `I↔III↔II↔I`. Brief 02 does not spell wrap; the build matches a linear list, not a cycle.

---

## Tier 2 — structural / layout mismatches vs. the locked specs

Code-level. **Not visually verified on real panels** — city routes never mount `TriptychPanels` / `TriptychCommerce`.

### A. MoP series overview (`app/[locale]/series/mediums-of-perception/page.tsx`)

Route **exists** (`GET /en` → 200). Distinct from `/series`, which **307s to `/`**.

| Spec | Build |
|---|---|
| List ordered by `featuredOrder` | Query `sort: featuredOrder` (`lib/data.ts` line 114) plus client sort in `buildMoPOverview` lines 93–95. Untested (0 docs). |
| Three panels as a small row | `TriptychOverviewRow.tsx` — 80×80 `object-cover` row. **No sort by `triptychPosition`**; order is Payload `panels[]` / `slice(0, 3)`. |
| City name in Limelight | `h2.font-display` (`tailwind` `font-display` → `--font-limelight`). Ornament is on the **page** title (`TitleOrnament`), not per row. |
| Technology arc labels, oldest-to-newest | `imageCaptureLabel` or fallback `triptychPosition`. Oldest-to-newest only if `panels[]` is already I→II→III. |
| Availability badge | `StatusBadge` from **triptych** `status` mapped available → `original-available`. Hidden if status unset. |
| Link to triptych page | Whole row is one `Link` to `/series/mediums-of-perception/${city.toLowerCase()}`. |
| MoW below, fault line, no store/AR, not in primary nav | MoW section only if `mediumsOfWarTriptychs.length > 0` (never, see Tier 1). Separator is `border-t border-ui-line/20`, **not** `FaultLine`. Same `TriptychOverviewRow` as MoP (includes status badge + link onto the MoP city URL, which always mounts commerce). Nav **does** list Mediums of War as `href: '#'` (`components/UI/Nav.tsx` lines 34–38) — spec/handoff: discoverable by scrolling this page, **not** in nav. |
| Site-scoping | Triptych query is series-slug-scoped, not `SITE_SERIES_SLUGS`. Correct for Triptychs-as-ACH-only. Artwork allowlist is irrelevant until panels exist. |
| Damask on series header | `.zone-dense` has no damask. `public/damask.jpg` is **not in the repo**. `globals.css` has no `.dense-zone::before` from design-system §17. |

### B. Triptych detail (`app/[locale]/series/mediums-of-perception/[city]/page.tsx`)

Empty: `TriptychPageShell` lines 20–33, Limelight capitalized city, “Coming soon”, link back to overview. `/en/series/mediums-of-perception/berlin` and `/munich` both **200** this shell. **No `#commerce`** on the empty shell — panel-page `#commerce` links would land on a page without the anchor.

When `triptych` is non-null, structure in `TriptychPageShell.tsx` lines 36–73:

```
header (ornament + Limelight city + year)
TriptychPanels
FaultLine
concept (if set)
TriptychCommerce id="commerce"
← series link
```

Brief 02 order is panels (images + labels + sources) → concept → `#commerce` → series link. Year/ornament above panels is extra (handoff wanted a header; Brief 02’s block list starts at the three-panel presentation). Fault line sits **between panels and concept** — matches “field = three paintings / dense = concept + commerce.”

**Mobile (`TriptychPanels.tsx` lines 99–117, CSS 1332–1410):** One featured + two in a half-width grid. Tap bottom → `setFeaturedIndex` (immediate, no delay). Tap featured → confirmation UI. **Mismatch:** spec wants a **subtle overlay on the bottom of the featured panel** (title + “View full details →” + tap-elsewhere-to-dismiss). Build is a **full-viewport dim + bottom sheet** (`position: fixed; inset: 0`, `triptych-confirm-overlay`). Dismiss is a **“Stay on {city} triptych” button**, not tap-elsewhere / tap-scrim (`onClick` only on that button; overlay itself is not a dismiss target). Desktop hover block is also rendered inside the mobile `PanelThumb` with `l:block hidden` (lines 58–61) — inert on small screens.

**Desktop (lines 119–148):** `l:grid-cols-3`, equal columns, hover fades in title + “View details →” (`globals.css` 1367–1374). No confirmation overlay (correct). Entire panel is one `<Link href={\`/${panel.slug}\`}>` — standard artwork route, not `/artwork/[slug]`. **Source photographs are omitted on desktop** (only in `PanelThumb`, used by the mobile tree). Spec: sources small beneath each panel **both breakpoints**, with credit.

**`imageCaptureLabel`:** Mobile shows it twice (inside the button `l:hidden` + `.triptych-capture-label`). Desktop once, below the image, not as hover-only.

**Commerce (`TriptychCommerce.tsx`):** `id="commerce"` (line 45). Original-set status from triptych `status`. Print rows: edition size + remaining of `printSets[].printAvailableCount`. `signedAndNumbered` note. Add-to-cart calls `lib/vendure.ts` `addToCart`. **Vendure is not configured** (`.env.local` has no `NEXT_PUBLIC_VENDURE_SHOP_API`; `.env.example` leaves it empty) → “Store checkout will be available when Vendure is configured.” That is the brief-06-style fallback in spirit; empty `printSets` still renders a “Commerce” heading and no editions. Always mounted — **no MoW variant** (handoff: MoW template has no store/AR).

**Panel → `#commerce` copy:** `TriptychLink.tsx` lines 53–58: `Part of {city} Triptych →` to `/series/mediums-of-perception/${city.toLowerCase()}#commerce`. Spec: **“Available as part of the [City] Triptych →.”**

**`overlayColors`:** Brief 02 deferred visual treatment. **Nothing was built** — panels do not read `ach.overlayColors`. Report only.

**Damask:** Not behind panels (good). Also **not** in concept/commerce (spec: appropriate in dense zone). Same missing `damask.jpg` as the artwork-page audit.

### C. Panel-to-triptych-page navigation (artwork page)

- **No trimmed panel view.** Search of `app/` and `components/` found no `/triptych-panel` (or similar) route. `TriptychPanels` desktop `Link` and the confirmation `Link` go to `/${slug}`. Artwork is `app/[locale]/[slug]/page.tsx` (same locale-prefixed path the artwork-page audit already noted vs spec `/artwork/[slug]`).

- **Artwork-page audit “TriptychLink scope creep” — resolved as gated, not generic.** `ArtworkPage.tsx` lines 119–126 mounts `TriptychLink` only when `triptychCity || artwork.triptychSlug`. `TriptychLink` itself returns `null` unless **both** `triptychSlug` and `city` (`TriptychLink.tsx` line 20). `[slug]/page.tsx` lines 19–22 loads panels only via `getTriptychBySlug`. Live `/en/brandenburger-tor-1899`: **0** `triptych-link-nav`, **0** “Part of”, **0** “Panel I”. Non-MoP pages do **not** show generic prev/next. There is **no** separate “related works” adjacency for everyone else — the fallback is *nothing*, not a catalogue prev/next.

- Gate is **“has a triptych relation”**, not `seriesSlug === 'mediums-of-perception'`. That matches the missing addendum’s “when `triptych` is set” better than a series-slug check. Today no artwork has that relation, so the row is untestable.

- Wrap: not implemented (Tier 1). Copy: “Part of…” vs “Available as part of…”.

---

## Tier 3 — features present but shallow / stubbed

- **Commerce is wired to a shop that is not live.** `addToCart` + `isVendureConfigured()` are real; without `NEXT_PUBLIC_VENDURE_SHOP_API` every add is a placeholder message. Edition counts would come from Payload `printSets[].printAvailableCount` (schema-summary: synced from Vendure webhook) — also empty until records exist.

- **Overview empty state is the wrong empty.** City pages say “Coming soon.” Overview, because the Series row exists, says nothing.

- **`TriptychCommerce` on every city page** including a future MoW city that reused this shell.

- **Source photograph tap** (Brief 02: inline slider vs artwork page with slider pre-opened, TBD at build) — **not built**. Desktop has no source image; mobile is display-only.

- **`overlayColors` across three panels** — deferred, and unused.

- **Handoff AR block on the triptych page** (`/ar/[city]`, three video types) — **correctly absent**; Brief 02’s locked page list has no AR section (AR lives on the individual artwork page).

---

## Confirmed working against spec

- Routes exist at the Brief 02 paths; `/series` is not a competing explorer (redirects home).
- Payload is the only data path (`getMoPSeriesOverview` / `getTriptychByCity` / `getTriptychBySlug` in `lib/data.ts`). No WordPress/GraphQL fallback on this bundle.
- `Triptychs` collection slug `triptychs` matches the API.
- MoP Series **document** is published and fetchable by slug.
- `SITE_SERIES_SLUGS` already contains mop/mow — seeding panels with those slugs will not repeat the Gates omission.
- Limelight (`font-display`) + `TitleOrnament` on both page headers.
- `l:` 769px split for mobile swap vs desktop three-column is the actual breakpoint.
- Fault line component (2px charcoal + 1px cream) is used on the detail page between field and dense.
- `#commerce` id is reserved on the real (non-empty) shell.
- Panel detail is the standard artwork page; `TriptychLink` is gated off non-triptych artworks.
- Nav already has a real href to `/series/mediums-of-perception` (not a `#` stub).

---

## Not part of spec, but present in the build

- Mediums of War as a Series-group `#` stub in the open nav (spec: not in primary nav).
- “Stay on {city} triptych” dismiss control (spec: tap elsewhere).
- Duplicate mobile `imageCaptureLabel`.
- Year under the city title on the detail header (handoff header; not in Brief 02’s top-to-bottom list).
- `label-small-caps` “Commerce” heading (burnt-amber small-caps).
- Overview row is a single link wrapping panels + meta (fine, not forbidden).

---

## Suggested next step

Ordered punch list for a **scoped** pass. Do not mix CMS seeding with a visual polish session on empty Coming-soon shells.

1. **Seed Payload (blocker).** Create the `Triptychs` records (Berlin first; Munich if the commission is real) with `series` → Mediums of Perception, `city` value that matches the URL strategy, `featuredOrder`, `concept`, `status`, `printSets`, `discoverable`. Create **three Artwork** children per triptych with `seriesSlug: mediums-of-perception`, `triptych` relation, `ach.mop.triptychPosition` I/II/III, `imageCaptureLabel`, `sourceImage` / source credit, `primaryImage`. Confirm admin MoP group is visible for that series slug. Until this exists, every layout claim is untested.

2. **Decide URL `city` vs Payload `city`.** Lowercase slug field vs display “Berlin”. Point `getTriptychByCity` at a slug (or case-insensitive match) before the first publish, or the overview will link to a Coming-soon page.

3. **Overview mapper: `name` not `title`.** Same `relationName()` rule as artworks, so the Series page does not ship a blank h1. Empty triptych list should look like an empty catalogue (or reuse “Coming soon”), not a broken heading.

4. **MoW query.** Second `triptychs` fetch `where[series.slug][equals]=mediums-of-war` (and/or `discoverable: false`). `FaultLine` above that block. Do not mount `TriptychCommerce` / AR for MoW. Remove or keep the nav `#` stub as a separate nav decision (spec says off-nav).

5. **Artwork-page panel nav, once a triptych exists.** Implement wrap if Bernard still wants I↔III↔II↔I (write it into the missing addendum so it is a locked brief). Align CTA copy to “Available as part of the [City] Triptych →.” Confirm `/en/[panel-slug]` is the full artwork page, `#commerce` lands, non-MoP pages stay clean.

6. **Brief 02 layout pass on a live Berlin page:** mobile overlay on the featured panel + tap-elsewhere dismiss; desktop source photos + credits; single `imageCaptureLabel` per panel; damask in dense zone only (`public/damask.jpg` is currently missing); `overlayColors` treatment as a conscious build-time choice. Vendure env or a clearer empty-commerce state.

Live fixtures to use after seed: `/en/series/mediums-of-perception`, `/en/series/mediums-of-perception/berlin#commerce`, each panel slug, a non-MoP artwork such as `/en/brandenburger-tor-1899` (must stay without panel prev/next).
