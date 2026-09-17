# Addendum — Share (MiniNav) + Open Graph Image
## A Colorful History · acolorfulhistory.com

*Build pass for the fourth MiniNav icon and the OG stub found in [addendum-artwork-page-cursor-audit.md](./addendum-artwork-page-cursor-audit.md) Tier 3. Decisions: `og:description` is a dedicated `shareDescription` field (not derived from `newerStory`); Share renders only when that field is non-empty.*
*Captured Aug 27 2026. Live fixtures: `/en/world-war-one` (I), `/en/world-war-two` (II), `/en/vietnam-war-in-video-stills` (III).*
*Screenshots: [share-og-build/](./share-og-build/).*

---

## Bottom line

Share is wired and gated. **None of the three MoW paintings show the Share icon** — `shareDescription` is empty on all three (the key is not even on the live Payload Location group yet). Magnifier is the only MiniNav button on each.

OG image is no longer the 1200×1200 title-text stub. Each painting now generates a 1200×1200 square with the 300px thumbnail centered on `cityPlaceholderColor`. MoW has no real city; live `ach.mapAndTour.cityPlaceholderColor` is `#F4F2EE` parchment on all three — confirmed in the OG output.

`generateMetadata` sets `og:title` to the artwork title and **omits `og:description`** when `shareDescription` is empty. `og:image` comes from the colocated `opengraph-image.tsx`.

---

## Step 1 — `shareDescription` field

**Shape (Group 4, same neighborhood as `olderStory` / `newerStory`):**

| Field | Type | Layer | Notes |
|---|---|---|---|
| `shareDescription` | Plain text (textarea), localized | artist / INTENT | Share-card copy only. Agent does not draft. Empty → Share hidden + `og:description` omitted. |

Frontend is ready to consume it from `ach.location.shareDescription` (fallback: document root). Types + mapper land the string as-is — no rich-text conversion.

**CMS status.** This repo is the ACH Next.js site, not the Payload collection config (`src/collections/Artworks.ts` lives on bernardbolter.com). Live Location keys on the three MoW docs (Aug 27): `conceptCopy`, `fieldRecordingCredit`, `fieldRecordingUrl`, `keyHistoricalDates`, `locationTGNUri`, `locationWikidataUri`, `newerStory`, `olderStory`, `wikipediaExcerpt`, `wikipediaUrl`. **`shareDescription` is not among them.** Until that field is added on the archive Artworks ACH Location group, every painting will keep Share hidden. Suggested Payload v3 field to paste on the archive:

```ts
{
  name: 'shareDescription',
  type: 'textarea',
  localized: true,
  admin: {
    description:
      'Artist-authored share-card copy. Not derived from newerStory. Leave empty to hide the MiniNav Share icon and omit og:description.',
  },
}
```

Schema docs updated: `docs/ach-schema-and-build.md` Group 4; MiniNav table + OG section in `docs/ach-site-design-and-architecture.md` (Share is no longer “Always”; `og:description` TBD is settled).

---

## Step 2 — OG image

`app/[locale]/[slug]/opengraph-image.tsx`:

- Canvas stays **1200×1200** (square OG).
- Background = `ach.cityPlaceholderColor` else city map else `#F4F2EE`.
- Center: Payload `sizes.thumbnail` (already 300×300 on these three) as a data URI. No title overlay.

Verified `GET /en/{slug}/opengraph-image` → `200 image/png` 1200×1200 for all three.

| Painting | Background | Thumbnail |
|---|---|---|
| World War One | `#F4F2EE` parchment | 300px, centered — [world-war-one-og.png](./share-og-build/world-war-one-og.png) |
| World War Two | `#F4F2EE` parchment | 300px, centered — [world-war-two-og.png](./share-og-build/world-war-two-og.png) |
| Vietnam War in Video Stills | `#F4F2EE` parchment | 300px, centered — [vietnam-war-in-video-stills-og.png](./share-og-build/vietnam-war-in-video-stills-og.png) |

Parchment fallback is visually confirmed — wide cream margins, painting in the middle, no overlaid title.

---

## Step 3 — `generateMetadata`

On `app/[locale]/[slug]/page.tsx`:

| Tag | Source | MoW result |
|---|---|---|
| `og:title` | artwork title | World War One / World War Two / Vietnam War in Video Stills |
| `og:description` | `shareDescription` only | **omitted** on all three |
| `og:image` | file-convention `opengraph-image` | `/en/{slug}/opengraph-image` |

Root layout’s generic site description does not leak into artwork `og:description`.

---

## Step 4 — Share icon

- **Action:** `navigator.share` with current URL + title + `shareDescription`. Abort (user cancel) does not fall through to clipboard; other failures copy the URL.
- **Render:** `showShare={Boolean(ach?.shareDescription?.trim())}`. Same presence-gating as Slider (`transferImage`) and AR (`arEnabled`).
- **SVG:** `svgs/ShareSvg.tsx` — 24×24, `stroke="currentColor"`, `strokeWidth={2}`, round caps/joins, matching `Enlarge.tsx` (the magnifier actually in MiniNav). Inventory table still lists `src/svg/`; this repo’s folder is `svgs/`. Filename for the inventory update: **`ShareSvg.tsx`**.
- **Colour:** default `$ui-icon` `#333333`. Hover/focus uses `--mini-nav-accent` = `overlayColors[0]` on **all four** MiniNav buttons (not a different colour per icon).

### MoW MiniNav after this pass

| Painting | Buttons | Share? | Default colour | `--mini-nav-accent` (`overlayColors[0]`) |
|---|---|---|---|---|
| World War One | Zoom only | **No** | `#333333` | `#D8E6DE` pale mint |
| World War Two | Zoom only | **No** | `#333333` | `#8FCCEA` |
| Vietnam | Zoom only | **No** | `#333333` | `#4098D6` |

Screenshot: [world-war-one-mininav.png](./share-og-build/world-war-one-mininav.png) — single Enlarge/Zoom control, no Share.

### Accent flag (do not guess around it)

World War One’s dominant-by-area colour is a very pale mint (`#D8E6DE`) on `#F4F2EE`. Hover will be weak. WWII (`#8FCCEA`) and Vietnam (`#4098D6`) will read more clearly. Share is hidden on all three today, so this only shows on Zoom hover until cataloguing fills `shareDescription`. A real hover screenshot on a painting with Share populated will settle it faster than swapping the accent rule.

---

## Files touched

- `types/ach.ts`, `types/payload.ts`, `types/artwork.ts`
- `lib/mappers/artworkFromPayload.ts`
- `app/[locale]/[slug]/opengraph-image.tsx`
- `app/[locale]/[slug]/page.tsx` (`generateMetadata`)
- `components/Artwork/MiniNav.tsx`
- `components/Artwork/ArtworkPage.tsx`
- `svgs/ShareSvg.tsx` *(new)*
- `app/globals.css` (MiniNav default/hover)
- `docs/ach-schema-and-build.md`
- `docs/ach-site-design-and-architecture.md`
- Screenshots under `docs/artwork/share-og-build/`

---

## Still open (not this pass)

- **Add `shareDescription` on bernardbolter.com** Artworks ACH Location group (snippet above). Until then Share stays absent site-wide.
- Cataloguing: write `shareDescription` painting-by-painting. First populated MoW work should be the first visual check of Share + `og:description` + mint hover.
- Icon inventory table in `docs/design-system.md` still lists `src/svg/` and does not include `ShareSvg` — update later as noted.
- Slider / AR MiniNav glyphs are still unicode / “AR” text, not `SliderSvg` / `ARsvg`. Out of scope.

---

*Suggested next: add the Payload textarea on the archive; then fill `shareDescription` in an Art/Official session so Share can be seen on a real painting.*
