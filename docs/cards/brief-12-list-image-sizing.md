# Brief 12 — List Image Sizing & Loading Placeholder
## A Colorful History · acolorfulhistory.com

*Implementation spec for Cursor. Supersedes `brief-09-list-card-images.md` §1 (fixed 230px image height) and §2 (40px offset rhythm — removed for now, may return later as a randomized offset once sizing is proven). Title, metadata line, and tap target from brief-09 are unchanged.*
*Read alongside: `design-system.md` §6 (existing fill-by-height/fill-by-width logic for the artwork detail page — this brief extends the same principle to the list) · `brief-10-homepage-artwork-query.md` (data layer, unchanged).*

---

## Why this changes

Brief-09 gave every list image a fixed 230px height regardless of orientation. With a real mix of portrait, landscape, and square works in the catalogue, that reads flat and wastes the compositional difference between them. This brief replaces it with a system where **orientation drives how much of the screen an image claims**, matching how the artwork detail page already treats proportion as the most important data pattern in the site (`design-system.md` §6) — extended here to the list instead of being detail-page-only.

---

## 1 · Sizing system

Each list item's image width is capped as a percentage of the list container's width, based on `artwork.orientation`. Height then follows the image's real `aspectRatio` — never a fixed crop, per the existing site-wide rule.

**Desktop width caps:**

| Orientation | Width cap |
|---|---|
| Landscape | 100% — edge to edge, no side margin |
| Portrait | ~85% — a visible but subtle inset |
| Square | ~65% — the most inset, sits smallest in the column |

**Mobile width caps** (below the `l:` 769px breakpoint) — same inset relationship, scaled down so the difference is subtler on a narrow screen:

| Orientation | Width cap |
|---|---|
| Landscape | 100% |
| Portrait | ~92% |
| Square | ~85% |

*(These mobile numbers are a starting point, not final — tune by eye once real images are on a real device; flag as open item 1 below.)*

**Height cap:** every image is additionally constrained to a max viewport height (proposed `85vh` — tunable, open item 2) so an extreme aspect ratio (very tall portrait, very wide panorama) never forces absurd scroll distance for one item. This is the "works with the viewheight and viewwidth" requirement — both constraints apply simultaneously:

```
widthFromContainer = orientationWidthCap * containerWidth
widthFromHeight     = heightCap(vh) * artwork.aspectRatio
finalWidth  = min(widthFromContainer, widthFromHeight)
finalHeight = finalWidth / artwork.aspectRatio
```

This is the same fill-by-the-binding-constraint logic already documented for the artwork detail page in `design-system.md` §6 ("portrait works fill by height; landscape works fill by width") — same formula, just with list-specific cap values instead of the detail page's `65vw` / `90vh`.

**`aspectRatio: null` fallback:** treat as `1` (square) per brief-10 §4 item 4 — unchanged.

---

## 2 · Offset rhythm — removed for now

Brief-09 §2's fixed 40px alternating left/right offset is **removed**. With landscape now full-width (no margin to shift into), a uniform fixed-px offset doesn't make sense across all three orientation widths.

**Confirmed direction for later:** once sizing is live and tuned, a randomized offset (rather than strict alternation) may be added for portrait/square images specifically, within whatever margin their inset leaves available. **Not part of this brief — ship without any offset first**, revisit as its own follow-up once the sizing system is proven on real content.

For now: every image (landscape, portrait, square) is simply centered within the list column at its calculated width.

---

## 3 · Loading placeholder — artwork-specific color, no new pipeline needed

Replace the current placeholder logic (`design-system.md`'s `CITY_PLACEHOLDER` city-to-color map) with one driven by each artwork's own palette — no new field, no image-processing script required. `overlayColors[]` already exists on every artwork's ACH tab (exactly 3 artist-curated hex values, confirmed live).

```tsx
// Replaces getArtworkPlaceholder(city) — old city-map version retired
function getArtworkPlaceholderColor(overlayColors: string[]): string {
  if (!overlayColors?.length) return '#F4F2EE' // warm-white fallback, unchanged
  return overlayColors[Math.floor(Math.random() * overlayColors.length)]
}
```

Same wrapper-div approach already documented in `design-system.md` (background color on the wrapper, `onLoad` callback swaps it to transparent) — only the color source changes. No `blurDataURL`/base64 pixel generation needed; this is a plain CSS background color, not an image at all, so there's nothing to pre-generate or store. **No custom script or new Payload field required for this** — it's pure render-time logic against existing data.

---

## 4 · Open items

1. **Mobile width caps** — proposed `100 / 92 / 85` are a starting point, need visual tuning on a real device once built.
2. **Height cap value** — proposed `85vh`, needs visual confirmation once real images (a genuine mix of orientations) are on screen — may want it looser or tighter.
3. **Random offset for portrait/square** — explicitly deferred, own follow-up brief once sizing ships and looks right.
4. **Random vs. fixed placeholder color per artwork** — currently specced as random per page load (§3). If a consistent color per artwork across visits is preferred instead (e.g. always the first `overlayColors[0]`), that's a one-line change — flag if you want it locked rather than random.

---

## First chat prompt for Cursor

```
I'm updating the homepage list image sizing for A Colorful History
(acolorfulhistory.com). Please read brief-12-list-image-sizing.md in full
first — it supersedes brief-09-list-card-images.md sections 1 and 2 only
(title, metadata line, and tap target from brief-09 are unchanged).

Task:
1. Replace the fixed 230px image height in ListCard.tsx with the
   orientation-aware sizing system in section 1: width caps per
   orientation (landscape 100%, portrait ~85%, square ~65% desktop;
   100/92/85 mobile), height-capped at 85vh, using the
   min(widthFromContainer, widthFromHeight) formula given. Reuse the
   existing fill-by-constraint pattern from design-system.md section 6
   (artwork detail page) rather than writing new sizing logic from
   scratch — same principle, different cap values.
2. Remove the 40px alternating offset from PaintingList.tsx entirely —
   every image is centered in the column at its calculated width for now.
   Do not build the randomized-offset follow-up yet, that's a separate
   later brief.
3. Replace the CITY_PLACEHOLDER-based loading placeholder with the
   overlayColors-based version in section 3 — pick a random hex from
   artwork.overlayColors[] as the wrapper background color until the
   image's onLoad fires. No new field, no image-processing script.
4. Handle artwork.aspectRatio: null with a square (1) fallback, per
   brief-10.

Flag back the open items in section 4 (mobile cap values, height cap,
random-vs-fixed placeholder color) rather than guessing final numbers —
those need a visual pass once real mixed-orientation content is on screen.
```

---

*Captured August 2026.*
