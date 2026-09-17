# Live Payload ACH audit — Aug 18 2026
## Production: bernardbolter.com (published EN/DE, no locale fallback)

*Read-only query from the archive project. ACH frontend (`acolorfulhistory.com`) already consumes this instance. Local Postgres on :5433 was down; this is live archive data.*

Related: [addendum-artwork-page-cursor-audit.md](./addendum-artwork-page-cursor-audit.md) · [decision-drop-wordpress-fallback.md](./decision-drop-wordpress-fallback.md)

---

## Bottom line

`olderStory` / `newerStory` are **not in the Payload schema and are not on any live document**. Empty StoryColumns on ACH are unset fields here, not a frontend bug. The ACH mapper does read `ach.location` first, then root — those keys are just never stored.

ACH tab in admin (`src/collections/Artworks.ts`, group `ach`) is shown only when `seriesSlug === 'a-colorful-history'` (exact match). MoP group (`ach.mop`) is hidden unless `seriesSlug` is `mediums-of-perception` or `mediums-of-war`. Net: **MoP `availabilityStatus` is not reachable in admin for any current record.** Archive Commerce `availabilityStatus` is filled on all 76 queried works.

Zero triptych documents. Zero artworks with `seriesSlug` `mediums-of-perception` / `mediums-of-war`. Berlin/Munich “MoP panels” sit on `a-colorful-history` with empty `ach.mop` and no triptych join.

---

## Admin field map (what actually exists)

| Admin group | Path | Notes |
|---|---|---|
| Map & Tour | `ach.mapAndTour` | lat/lng, mapPresence, tour copy |
| Overlay & colour | `ach.overlay` | overlayColors, overlayRects |
| Source photographs | `ach.sourcePhotographs` + `ach.sourcePhotograph` | image + metadata |
| Location & historical context | `ach.location` | Wikidata/TGN, `wikipediaUrl`, excerpt, dates, **`conceptCopy`** |
| Reveal slider | `ach.revealSlider` | `transferImage`, `sliderAxis` |
| AR experience | `ach.ar` | `arEnabled` (mind.js) — distinct from Core AR tab |
| MoP series | `ach.mop` | `availabilityStatus`: original-available / sold / prints-only — **admin-hidden for current series** |

**Location keys on every live record:** `locationWikidataUri`, `locationTGNUri`, `wikipediaUrl`, `wikipediaExcerpt`, `keyHistoricalDates`, `conceptCopy`, `fieldRecordingUrl`, `fieldRecordingCredit`.

**Not present:** `olderStory`, `newerStory` (Location, ACH root, document root, `payload-types.ts`).

Closest story-like field the mapper does **not** read: `ach.location.conceptCopy` (localized rich text — “Bernard contextual text”). Filled in EN only on `brandenburger-tor-1899`.

Dates Wikipedia URL: schema field is `ach.location.keyHistoricalDates[].wikiLink`, not `wikipediaUrl`. ACH mapper already accepts `wikipediaUrl ?? wikiLink`.

Two availability fields:

- ACH page: `ach.mop.availabilityStatus` — empty on all queried works; group not visible for `a-colorful-history`
- Archive Commerce tab: root `availabilityStatus` — `available` / `sold` / `not-for-sale` / `on-loan` / `reserved` / `on-consignment`

Two `arEnabled` fields:

- ACH page: `ach.ar.arEnabled` (mapper uses this first)
- Archive wall AR tab: root `arEnabled` (model-viewer)

Triptych: no root `triptych` on Artworks. ACH mapper looks at `doc.triptych` (does not exist). Reverse relation is `triptychs.panels[].artwork`. `ach.mop.relatedTriptychs` is empty on all queried works.

BDA / Gates: Breaking Down Art and Gates of Perception do not get the ACH tab (`seriesSlug` is not `a-colorful-history`). No `encounterContext` / `compositionalResponse` fields exist yet.

---

## What ACH actually loads

Site filter: `seriesSlug` in `a-colorful-history` | `breaking-down-art`, `status` published.

| seriesSlug | published works | On ACH `/en/[slug]`? |
|---|---|---|
| `a-colorful-history` | 59 | yes |
| `breaking-down-art` | 3 | yes |
| `gates-of-perception` | 14 | no — detail fetch excludes this slug |
| `mediums-of-perception` / `mediums-of-war` | 0 artworks | series records exist (parent: A Colorful History); no works, no triptychs |

Known slugs exist, published, `a-colorful-history`: `brandenburger-tor-1899`, `berliner-schloss-1900`, `powell-street-1895-v2`. Aliases: `powell-street-1895`, `powell-street-1895-v1`; also `berliner-schloss-2019`. No Munich or Amsterdam works.

DE titles are unset (`fallbackLocale=none`). The site will fall back to EN titles if fallback is on.

`sliderAxis: horizontal` is the schema default — returned even when Bernard never chose it.

---

## Records with any Location / slider ACH content

Only two of 62 ACH-site works:

- **`brandenburger-tor-1899`** — EN `conceptCopy`, EN `wikipediaExcerpt`, EN location `wikipediaUrl`, 5 dates all with `wikiLink`, transfer image, axis `vertical`. DE copies empty. MoP status empty. Archive **sold**.
- **`cliff-house-1863`** — EN excerpt + location `wikipediaUrl`, 3 dates all with `wikiLink`. No transfer image. MoP empty. Archive **sold**.

All other ACH + BDA works: empty older/newer (fields absent), 0 dates, no transfer, AR false, MoP empty, archive sale state set, no triptych.

Gates of Perception (14) are in Payload, not in the ACH site series filter. Opening `/en/anhalters-tor-2018` will not resolve via that filter.

---

## Browser check (ACH frontend — not a schema test)

No slugs match the original Tier 1 rule (needs `location.olderStory` / `newerStory`, which do not exist). MoP `availabilityStatus` is empty on all 76. Archive status is set on all 76.

Open these anyway:

| URL | Expect |
|---|---|
| `/en/brandenburger-tor-1899` | No StoryColumns (both stories empty → component returns null). Badge **Sold** from archive. Reveal slider **shown**. Timeline **5 dates with Wikipedia links**. AR **hidden**. |
| `/en/berliner-schloss-1900` | No stories, no dates, no slider, badge **Sold**. |
| `/en/powell-street-1895-v2` | Same empty ACH pattern, badge **Sold**. |
| `/en/jungfernstieg-1890` or `/en/adolf-sutro-1830-1898` | Badge **Original available** (archive `available`). |

If the badge is missing on those pages, that is a frontend question — Payload archive status is set. If StoryColumns appear with copy, that copy is **not** coming from Payload `olderStory`/`newerStory`.

---

## Editorial / schema (Bernard — not ACH frontend)

**Stories.** Every ACH/BDA work. There is nowhere in admin to type `olderStory`/`newerStory` today. Spec still wants two columns. Live Location has `conceptCopy` (one field, EN only on Brandenburg). Mapping `conceptCopy` into StoryColumns would be a new product decision, not a bugfix.

**AR.** All 76: `ach.ar.arEnabled` false, no marker, no videos. Root model-viewer `arEnabled` also false.

**Dates.** 74/76 have no dates (timeline hidden). Filled EN dates with `wikiLink`: Brandenburg (5), Cliff House 1863 (3). DE event text empty; links are English Wikipedia URLs (`wikiLink` is not localized).

**Reveal slider.** `transferImage` on 1/76 (`brandenburger-tor-1899` only).

**MoP commerce status.** Empty on every record; admin group not reachable for `a-colorful-history` works. Archive Commerce is filled (among the 76: sold 46 / available 16 / not-for-sale 13 / on-loan 1). ACH badge currently falls back to that archive field.

**Triptychs / Munich.** Zero triptychs. Zero MoP/MoW artworks. No Munich records.

**BDA** (`venice-biennale-2007`, `venice-in-the-middle`, `skulptur-projekte-m-nster-2007`): no ACH location stories; ACH tab hidden in admin.

**Unused by StoryColumns, present on some records:** `conceptCopy`, `wikipediaExcerpt`. Legacy WP `storyEn` was imported to hidden `description` (`cliff-house-1902` still has EN `description`); `descriptionLong` is filled on five works including Brandenburg Gate and Cliff House 1863.

---

## Mapper vs schema (ACH frontend)

`mapAchFields` still reads `location?.olderStory ?? raw.olderStory` (and newer). `mergeAchFields` only spreads the `ach` group, so “root” means `ach.olderStory` or a document-level `olderStory`. Neither key exists. Not localized-draft-only — absent in EN and DE.

Dates: mapper `wikipediaUrl ?? wikiLink` matches live schema.

Triptych: mapper `doc.triptych` does not exist on Artworks. No live reverse-populated panels to consume until triptych documents exist.
