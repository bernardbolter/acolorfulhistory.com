# Addendum — Hero Viewport Centering & MiniNav Styling
## A Colorful History · acolorfulhistory.com

*Brief 15. Closes brief-01 §1 (“Initial view — what is visible without scrolling”). MiniNav visual pass from the artwork-page full-flow comp. Header offset taken from brief-14 Part 2 (do not re-guess).*
*Captured Aug 27 2026. Fixtures: `/en/world-war-one`, `/en/world-war-two`, `/en/vietnam-war-in-video-stills`.*
*Screenshots + metrics: [hero-centering-mininav/](./hero-centering-mininav/).*

---

## Bottom line

On load the painting is **full-bleed width**, height-capped to the viewport minus the persistent header (**61.2px**), cropped with `object-fit: cover` / `object-position: center`. MiniNav sits immediately below that block — **just past the fold**, bottom-right, icon + small-caps label. Production gating is unchanged (Zoom only on live MoW). `?mininav=all` forces all four in development so they can be styled together; it is a no-op in production.

---

## Part 1 — Hero at load

Header measurement reused from brief-14 (closed, artwork “Back to browse” cluster): **top 10, height 51.2, bottom 61.2**. CSS: `--artwork-header-offset: 61.2px`.

| | Desktop 1440×900 | Mobile 390×844 |
|---|---|---|
| Field-zone padding-top | 61.2px | 61.2px |
| Hero / wrap | **1440 × 838.8** at y=61.2 | **390 × 782.8** at y=61.2 |
| Image | `object-fit: cover`, `object-position: 50% 50%` | same |
| MiniNav top | **900** (fold) | **844** (fold) |

Hero height = `100dvh − 61.2px` (`100vh` as fallback). MiniNav starts at the viewport edge — a short scroll reveals it. Full-bleed width from fix-pass-1 is kept; the list-sized inset from the later size pass is not. No per-orientation special-casing.

Screenshots at load (MiniNav below fold, as specified):

- [world-war-one-desktop-load.png](./hero-centering-mininav/world-war-one-desktop-load.png)
- [world-war-one-mobile-load.png](./hero-centering-mininav/world-war-one-mobile-load.png)

**Redmi A3.** Verified against this project’s CSS mobile reference (390×844) in headless Chrome, not on the physical device. `100dvh` is in the CSS; URL-bar show/hide on the Redmi itself still wants a device check.

---

## Part 2 — MiniNav styling

**Position:** `justify-content: flex-end` on a full-width row immediately under `.artwork-hero`. Supersedes left-aligned (Aug 18 audit + fix-pass-1).

**Order:** Zoom → Reveal source → AR → Share.

**Chrome:** 1.6px stroke SVGs (`Enlarge`, `SliderSvg`, `ARLine`, `ShareSvg`). Label 0.6rem, uppercase / small-caps, `$text-muted` `#777`. Icon default `$ui-icon` `#333`. Hover/focus: icon **and** label → `overlayColors[0]` (one accent for the set). WWII Zoom hover measured `#8FCCEA` / `rgb(143, 204, 234)` on Zoom only; siblings stayed `#333` / `#777`.

Default strip (forced four): [mininav-all-default-strip.png](./hero-centering-mininav/mininav-all-default-strip.png)  
Hover Zoom: [mininav-all-hover-zoom-strip.png](./hero-centering-mininav/mininav-all-hover-zoom-strip.png)  
In-page: [mininav-all-default-desktop.png](./hero-centering-mininav/mininav-all-default-desktop.png), [mininav-all-hover-zoom-desktop.png](./hero-centering-mininav/mininav-all-hover-zoom-desktop.png), [mininav-all-default-mobile.png](./hero-centering-mininav/mininav-all-default-mobile.png)

The circular **N** in the bottom-left of screenshots is Next.js’s dev overlay, not MiniNav.

WWI hover accent remains pale mint `#D8E6DE` on parchment — same flag as the Share pass. WWII and Vietnam read clearly.

---

## Part 3 — Force-all override (dev only)

`?mininav=all` on an artwork URL. Wired from `searchParams` in `app/[locale]/[slug]/page.tsx`. Gated with `process.env.NODE_ENV !== 'production'`. Production conditionals stay:

| Icon | Condition |
|---|---|
| Zoom | primary image exists |
| Reveal | `transferImageUrl` |
| AR | `arEnabled: true` |
| Share | `shareDescription` non-empty |

### Live MoW (no override)

| Painting | Icons |
|---|---|
| World War One | **Zoom only** |
| World War Two | **Zoom only** |
| Vietnam War in Video Stills | **Zoom only** |

Expected until Reveal / AR / Share data exists on those records.

---

## Docs updated for left-aligned → bottom-right

| Doc | What changed |
|---|---|
| [brief-01-artwork-page-design.md](../brief-01-artwork-page-design.md) §1 | Marked decided — viewport-capped hero |
| [ach-site-design-and-architecture.md](../ach-site-design-and-architecture.md) Mini nav strip | Bottom-right; icon order Zoom / Reveal / AR / Share |
| [addendum-artwork-page-cursor-audit.md](./addendum-artwork-page-cursor-audit.md) | Amendment on the MiniNav finding |
| [claude_addendum-artwork-page-fix-pass-1.md](./claude_addendum-artwork-page-fix-pass-1.md) §4 | Amendment: left-aligned superseded |

---

## Files touched

- `components/Artwork/ArtworkPage.tsx` (hero wrapper; list-size stage removed)
- `components/Artwork/ArtworkImage.tsx` (`object-cover`, `sizes="100vw"`)
- `components/Artwork/MiniNav.tsx`
- `components/Artworks/ArtworkSlug.tsx`
- `app/[locale]/[slug]/page.tsx` (`?mininav=all`)
- `app/globals.css` (hero height, MiniNav)
- `svgs/Enlarge.tsx`, `svgs/ShareSvg.tsx` (optional `strokeWidth`)
- `svgs/SliderSvg.tsx`, `svgs/ARLine.tsx` *(new)*
- Docs listed above
- Screenshots under `docs/artwork/hero-centering-mininav/`

---

## Still open (not this pass)

- Physical Redmi A3 check of `100dvh` vs. URL-bar chrome.
- Live Reveal / AR / Share on MoW still need Payload data (`transferImage`, `arEnabled`, `shareDescription`).
- WWI mint hover remains weak on parchment.
- Next.js bottom-left **N** overlay is local-dev only.

---

*Suggested next: device-check `100dvh` on the Redmi; then fill Reveal/AR/Share data when those records are ready.*
