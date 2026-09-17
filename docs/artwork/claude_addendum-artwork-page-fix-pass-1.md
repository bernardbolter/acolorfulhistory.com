# Addendum — Artwork Page Fix Pass 1 (Tier 2 Layout + Triptych Wrap)
## A Colorful History · acolorfulhistory.com

*Scoped fix pass following [addendum-artwork-page-cursor-audit.md](./addendum-artwork-page-cursor-audit.md) Tier 2 and [addendum-triptych-series-cursor-audit.md](./addendum-triptych-series-cursor-audit.md) wrap finding. Measured against locked Brief 01 in `ach-site-design-and-architecture.md` (page structure + field zone) and [addendum-triptych-panel-detail-navigation.md](./addendum-triptych-panel-detail-navigation.md).*
*Captured Aug 27 2026. Live fixtures: `/en/world-war-one` (I), `/en/world-war-two` (II), `/en/vietnam-war-in-video-stills` (III).*
*Screenshots + metrics: [fix-pass-1-screenshots/](./fix-pass-1-screenshots/).*

---

## Bottom line

All five Tier 2 layout findings from the Aug 18 audit **still held** against real MoW data (not empty-state artifacts). They are fixed in this pass. Prev/next wrap **I↔II↔III↔I** is live and verified on the three MoW panels.

Tier 3 (zoom, reveal toggle, InfoTab split, OG) was not touched.

---

## Step 1 — Re-confirm Tier 2 against real MoW data (before any fix)

Desktop metrics at 1440×900 on `/en/world-war-one` (same shape on II and III). Screenshots: `*-before-viewport.png`, `*-before-full.png`, `*-before-metrics.json`.

| # | Finding (Aug 18 wording) | Still holds? | Before-fix evidence |
|---|---|---|---|
| 1 | **ArtworkImage isn't full-bleed** — capped `max-width: 65vw`, locked `aspect-ratio: 3/4`, field-zone padding | **Yes** | Wrap **608×810** (42% of viewport), `maxWidth: 936px` (65vw), `aspect: 3/4`, field padding `96px 48px`. Real primaryImage + overlayRects rendered inside the inset portrait frame — not an empty-state illusion. |
| 2 | **Fault line positioned by document flow, not viewport** — after padded field zone, not lower-third horizon | **Yes** | `faultTopViewport: 1002` vs `vh: 900` / `lowerThirdY: 600` — fault below the first viewport; scrolls with content. Colors still correct (`#3A3F4A` / `#F0E8C0`). Damask still absent (`public/damask.jpg` missing — noted, not fixed; asset gap). |
| 3 | **TitleBlock z-index toggle broken** — click only clears MiniNav context; image has no z-index; click image doesn't restore; no retrievable edge; no city; type undersized | **Yes** | Starts as `title-block-back` (`z-index: 2`); image `z-index: auto`. Title floats over painting visually but toggle could not send it *behind* a stacking image. No city line. |
| 4 | **MiniNav positioned wrong** — overlaid on the image; spec wants immediately below, left-aligned; no `overlayColors` accents; slider on source-or-transfer | **Yes** | `miniInsideWrap: true` — absolute `bottom: 0` inside `.artwork-image-wrap`. Accents unused. `hasReveal` was true if source **or** transfer existed (spec: transfer only). |
| 5 | **StatusBadge in the wrong page position** — top of dense zone; spec puts it last with archive link | **Yes** | First dense child was the badge flex row. No “Full archive record →”. |

**All three MoW pages shared this layout shell** (same wrap %, fault offset, title/mini-nav structure). Overlay rect colors differ per painting; layout bugs did not.

**Triptych nav before fix:** `hasTriptychNav: false` on all three. Live Payload: artwork `triptych` relation is **null**; `GET /api/triptychs` → **totalDocs: 0** (claimed id 2 / slug `mediums-of-war` not publicly readable). Panels do carry `ach.mop.triptychPosition` I/II/III and share series `mediums-of-perception`. Wrap code already used modulo (Aug 25 mop fix pass) but never mounted without panels.

---

## Step 2 — Tier 2 fixes

### 1. Full-bleed image

- Removed `max-width: 65vw` and forced `3/4` aspect.
- Field zone horizontal/vertical padding zeroed for the painting plane.
- Wrap is **100% viewport width**; aspect from `artwork.aspectRatio` (inline style; default `1`).
- `sizes="100vw"`.

**After (WWI):** wrap **1440×1440**, `pctOfViewport: 100`, `maxWidth: none`, `aspect: 1 / 1`.

### 2. Fault line

- Fault sits flush under image + mini-nav (still document flow, but field zone is no longer a padded inset).
- On these square MoW paintings, fault is at ~1500px document Y — **below the first desktop viewport** by design of full-bleed square. Landscape works will land nearer the lower third. Honest tradeoff vs the old 65vw/3:4 inset that also failed the lower-third read.
- Damask still not applied (asset missing).

### 3. TitleBlock z-index

- Title starts **front** (`z-index: 6`).
- Image stack `z-index: 3`. Click title → back (`z-index: 2`, hit hidden); **retrievable edge** button (`z-index: 7`) peeks; click image wrap → front again.
- City line under title (when Payload `city` is set — MoW currently null).
- Type bumped to ~1.125rem / 600.

**Verified in browser:** `front → back → front` via title click then image click; edge present while back.

### 4. MiniNav

- Moved **out of** `.artwork-image-wrap` to sit immediately below the painting, left-aligned.
- `overlayColors` drive border/text accents per button.
- Slider gated on `transferImageUrl` only (not source alone).

**Amendment (Brief 15, Aug 27 2026):** left-aligned is superseded. MiniNav is **bottom-right**, immediately below the viewport-capped hero. Labels + 1.6px stroke icons. See [claude_addendum-hero-centering-mininav-styling.md](./claude_addendum-hero-centering-mininav-styling.md).

### 5. Status badge + archive link

- Dense order now: InfoTab → StoryColumns → ARLink → Timeline → TriptychLink → **status row**.
- Status row last: badge + `Full archive record →` → `https://bernardbolter.com/{slug}`.

---

## Step 3 — Triptych prev/next wrap

### What changed

- Wrap math was already modulo in `TriptychLink.tsx` (Aug 25). This pass made it **mount and receive panels** on live MoW:
  - `getTriptychPanelsForArtwork()` prefers Triptych collection; **falls back** to published siblings in the same series with `ach.mop.triptychPosition` set (needed while `/api/triptychs` is empty and artwork `triptych` is null).
  - Gate relaxed: panels alone are enough (city optional; MoW has no city yet).
  - Commerce CTA copy aligned to spec: “Available as part of the … Triptych →”.

### Verified on live MoW

| From | Prev | Next |
|---|---|---|
| World War One (I) | ← Panel III → `vietnam-war-in-video-stills` | Panel II → `world-war-two` |
| World War Two (II) | ← Panel I → `world-war-one` | Panel III → `vietnam-war-in-video-stills` |
| Vietnam (III) | ← Panel II → `world-war-two` | Panel I → `world-war-one` |

No dead ends. Matches [addendum-triptych-panel-detail-navigation.md](./addendum-triptych-panel-detail-navigation.md) Decision 2.

---

## Docs housekeeping

- [addendum-triptych-panel-detail-navigation.md](./addendum-triptych-panel-detail-navigation.md) was **already in the repo** (checked in Aug 25). Not re-added. Build-status note updated to “wrap verified on live MoW Aug 27”.

---

## Still open (not this pass)

- **Payload Triptych record** for MoW — still `totalDocs: 0` on public API; artwork `triptych` null. Sibling fallback works; prefer seeding the real Triptych + relations so MoW doesn’t share a series-scoped pool with future MoP panels under `mediums-of-perception`.
- MoW `city` empty — commerce link falls back to `/series/mediums-of-perception`.
- Damask texture — `public/damask.jpg` still missing.
- InfoTab dimensions showing raw pixel figures as cm (mapper) — pre-existing, out of scope.
- Tier 3: ZoomMode, RevealSlider toggle/direction, InfoTab left/right, OG image.

---

## Files touched

- `components/Artwork/ArtworkPage.tsx`
- `components/Artwork/TitleBlock.tsx`
- `components/Artwork/MiniNav.tsx`
- `components/Artwork/TriptychLink.tsx`
- `components/Artwork/ArtworkImage.tsx`
- `app/[locale]/[slug]/page.tsx`
- `lib/data.ts` (`getTriptychPanelsForArtwork`)
- `app/globals.css` (artwork page layout)
- `docs/artwork/addendum-triptych-panel-detail-navigation.md` (status note)
- Screenshots under `docs/artwork/fix-pass-1-screenshots/`

---

*Suggested next: seed MoW Triptych relation on bernardbolter.com; then Tier 3 interaction depth, or Map brief.*
