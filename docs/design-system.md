# Design System — A Colorful History
## Bernard Bolter / Mediums of Perception series focus
*Generated April 2026 — port from Sass/Next.js to Tailwind/Next.js*

---

## 1. Philosophy

**A Colorful History** is a map-first, artwork-centric experience. The UI is deliberately recessive — a quiet stage for the paintings. The paintings supply all the color; the chrome stays neutral.

The site has one primary mode: a full-viewport grayscale map with artwork pins, a bottom thumbnail strip, and a sliding panel nav. Everything is fixed-position and layered. The "list" view is secondary. The artwork detail page is immersive — the image fills as much screen as physically possible.

### The Conceptual Framework — From the Paintings

The visual identity of this site is derived directly from the tension in the paintings themselves. Every canvas shares the same structural logic: a large flat painted field (the sky, the ground) meeting a densely detailed photographic zone at a hard, asymmetric horizon line. The painting fields are pure — one color, no texture, no detail. The photograph is complex, historical, layered.

The site translates this into three spatial principles:

**Field zones** — large areas of near-nothing. Sky-like. One element sitting in generous space. Used for page headers, hero areas, the map itself. No competing elements. Vertical padding is generous — almost uncomfortably so.

**Dense zones** — where information concentrates, like the photograph. Tight line-height, smaller type, metadata, narrative, store content. The texture and detail live here.

**The fault line** — the asymmetric horizontal boundary between field and dense zone. Marked by a double rule: `2px charcoal (#3A3F4A)` on top, `1px cream (#F0E8C0)` hairline below. The fault line never sits at 50% — it offsets toward the lower third, as in the paintings.

The two reference paintings for all layout decisions are **Brandenburger Tor 1899** (classical, perfected form) and **Kotbusser Tor 2018** (deconstructed, the fault line pushed to an extreme asymmetry). New components should feel like they sit somewhere on that spectrum.

### The Audience

Five people arrive at this site, each needing something different:

1. **The Kunstmarkt visitor** — met Bernard in person, high intent but fragile moment. Needs: immediate recognition of the work, a direct path to buy, enough narrative to make the purchase feel meaningful.
2. **The architect** — responds to spatial logic, proportion, hard geometry. Will notice lazy layout. Needs: physical dimensions clearly stated, conceptual framework stated cleanly, a site that respects their intelligence.
3. **The social media arrival** — comes from an Instagram city drop. Needs: immediate visual impact, enough context to stay, path to series and prints.
4. **The Berlin local** — knows the places, has emotional relationship with specific paintings. Needs: the story behind the work, the map as navigation by place, rewards for deeper exploration.
5. **The collector/curator** — evaluating the full practice arc. Needs: the Grand Tour, CV, conceptual lineage, editions and provenance.

### Voice of the Interface

Quiet, authoritative, European. Modern clean as the primary register — Barlow Semi Condensed carries all functional text. Period as a secondary layer — Limelight (1920s Art Deco) appears only for city names and series titles, never in metadata or navigation. The damask wallpaper pattern at 7% opacity appears in dense/information zones as a period texture, never behind artwork images or the map.

The commercial rhythm is one new city per month. Each release is an event — a new map pin, a new edition. The site should carry a mild sense of occasion without being precious about it.

---

## 2. Color Tokens

### New token names → Sass originals

#### Surfaces
| Token | Value | Old Sass var |
|---|---|---|
| `$surface-page` | `#EDEDED` | `$background` |
| `$surface-nav` | `#ECECEC` | `$nav-background` |
| `$surface-list` | `#F8F8F8` | `$art-list-background` |
| `$surface-dark` | `#5E5E5E` | `$less-dark` |
| `$surface-loader` | `#AAAAAA` | `$light-dark` |
| `$surface-warm-white` | `#F4F2EE` | — new, from Kotbusser Tor ground |

#### Text
| Token | Value | Old Sass var |
|---|---|---|
| `$text-primary` | `#333333` | `$text` / `$dark-fill` |
| `$text-secondary` | `#666666` | `$text-light` |
| `$text-muted` | `#777777` | `$filter-dark` |
| `$text-menu` | `#717171` | `$menu-color` |
| `$text-dark` | `#3A3F4A` | replaces `$dark` — charcoal from Powell Street |

#### UI Chrome
| Token | Value | Old Sass var |
|---|---|---|
| `$ui-line` | `#777777` | `$filter-dark` |
| `$ui-icon` | `#333333` | `$dark-fill` |
| `$ui-fault-heavy` | `#3A3F4A` | fault line top rule — 2px |
| `$ui-fault-light` | `#F0E8C0` | fault line bottom rule — 1px cream hairline |

#### Status
| Token | Value | Old Sass var |
|---|---|---|
| `$status-error` | `#BE4352` | `$error-red` |

---

### The Painting Palette — Compositional Accent Colors

Extracted from three source paintings: Brandenburger Tor 1899, Kotbusser Tor 2018, Powell Street 1895. These replace the old rainbow spectrum for all site usage except the logo SVG.

#### Field colors — large areas, sky zones, section backgrounds
| Token | Value | Source | Role |
|---|---|---|---|
| `$paint-sky-warm` | `#A8D6E8` | All three paintings | Sky — pale, grey-washed. Primary field color. |
| `$paint-sky-vivid` | `#4AAED4` | Kotbusser Tor | Sky — saturated, vivid. Most contemporary. |
| `$paint-warm-white` | `#F4F2EE` | Kotbusser Tor ground | Large white field. Slightly warm. |
| `$paint-mid-grey` | `#B8B8BC` | Brandenburg ground | Neutral grey field. |
| `$paint-charcoal` | `#3A3F4A` | Powell Street foreground | Near-black. Text, dark field zones. |

#### Accent colors — from the painted fields
| Token | Value | Source | Role |
|---|---|---|---|
| `$paint-cream` | `#F0E8C0` | Brandenburg light shaft | Fault line hairline rule. Section dividers. Period highlight. |
| `$paint-deep-gold` | `#E8C15A` | Powell Street ground | Warm accent. Display type. |
| `$paint-burnt-amber` | `#B8742A` | Brandenburg right wall | Primary display type color. Section labels. |
| `$paint-terracotta` | `#D4785A` | Powell Street right zone | Secondary display type color. |
| `$paint-dusty-salmon` | `#C4907A` | Powell Street right zone | Soft accent. |
| `$paint-burgundy` | `#8C3A42` | Powell Street right zone | Dark accent. |
| `$paint-mid-green` | `#8BAF62` | Powell Street mid band | Accent. |
| `$paint-forest-green` | `#2A4A28` | Brandenburg hedge | Dark accent. |

#### The gate element
| Token | Value | Source | Notes |
|---|---|---|---|
| `$paint-gate` | `#2A1545` | Kotbusser Tor rectangle | Deep purple. Used once per page maximum, deliberately. Reads near-black straight-on, unmistakably purple at an angle. See Section 17 — The Gate Element. |

---

### The Logo Palette — Warm-to-Cool Sequence

The `ColorLogo` SVG uses the painting palette arranged in a warm-to-cool sequence across the letters of "A COLORFUL", with "HISTORY" in charcoal at 75% opacity. The old rainbow spectrum is retired from all other site usage.

| Letter | Color | Token |
|---|---|---|
| A | `#E8C15A` | `$paint-deep-gold` |
| C | `#B8742A` | `$paint-burnt-amber` |
| O | `#D4785A` | `$paint-terracotta` |
| L | `#C4907A` | `$paint-dusty-salmon` |
| O | `#8BAF62` | `$paint-mid-green` |
| R | `#2A4A28` | `$paint-forest-green` |
| F | `#A8D6E8` | `$paint-sky-warm` |
| U | `#4AAED4` | `$paint-sky-vivid` |
| L | `#2A1545` | `$paint-gate` |
| HISTORY | `#3A3F4A` at 75% opacity | `$paint-charcoal` |

The sequence runs earth → amber → terracotta → salmon → green → forest → sky pale → sky vivid → the rectangle → grey. The gate color ends the colored sequence, just before history goes neutral. This is intentional.

---

### Retired — Spectrum Colors

The 17-color rainbow spectrum (`$red` through `$purple`) is retired from all site usage. It remains in `vars.module.scss` only for the `decideColor()` function used by map pins, and in the old `ColorLogo`/`FarbenLogo` SVG files until those are updated to the new palette sequence above.

**Map pins** will migrate to use the painting palette accent colors for their random assignment. The `decideColor()` function should be updated to draw from `$paint-burnt-amber`, `$paint-terracotta`, `$paint-mid-green`, `$paint-sky-vivid`, `$paint-burgundy`, `$paint-deep-gold`, `$paint-forest-green`, `$paint-dusty-salmon`.

**Filter dots** will use painting palette accent colors, lightened. See `--filter-dot-base` and `--filter-dot-lightness` CSS variables — provisional values, tune in browser.

---

## 3. Typography

### Two-font system

**Body / UI font: Barlow Semi Condensed**
Google Font. All functional text — navigation, metadata, body copy, labels, captions, buttons. Loaded via Next.js `next/font/google`.

```tsx
import { Barlow_Semi_Condensed } from "next/font/google"
const barlow = Barlow_Semi_Condensed({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800", "900"] 
})
```

**Display / title font: Limelight**
Google Font. 1920s Art Deco — geometric, condensed, inline stroke detail. Used only for city names, series titles, and section titles. Single weight (400) only. Loaded as needed on pages that use it.

```tsx
import { Limelight } from "next/font/google"
const limelight = Limelight({ subsets: ["latin"], weight: ["400"] })
```

**Font smoothing (global):**
```scss
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Where Limelight is used — strict rules

Limelight appears in exactly these contexts, nowhere else:

- **City names** at large display scale — page/section level headings: `3.5rem` (hero), `2rem` (section)
- **Series titles** as page/section level headings: `1.75rem` (large), `1.375rem` (section)
- **Page headings** — About, Contact, Store, series overview pages: `1.75–2rem`
- **Artwork titles** on the detail page: `2.5rem` — Limelight, no ornament

Limelight is **never** used for: navigation links, metadata, body copy, prices, button labels, captions, map popup text, filter labels, or any text below `1.125rem`. If in doubt, use Barlow Semi Condensed.

**Limelight color:**
- On light backgrounds: near-black `#1A1A1A`
- On sky/field backgrounds: warm white `#F4F2EE`
- Never a palette accent color in the title itself — color lives in the ornament only (see below)

---

### The Title Ornament Component

Used beneath Limelight titles at page/section level. **Not** used beneath artwork titles on detail pages. Not used in navigation, metadata, or body copy.

**Structure:**
```
[rule segment] ◆ [rule segment]
```

- Total width: 70% of the title above it, centered
- Left and right rule segments are equal flex — the diamond sits exactly center
- Top rule: `2px solid` in the ornament color
- Bottom rule: `1px solid` in the ornament color at `40%` opacity, `2px` below the top rule
- Diamond `◆`: same color as the title text (`#1A1A1A` on light, `#F4F2EE` on sky)
- Diamond size: `13px` at large titles (`3.5rem`), `11px` at medium (`1.75rem`), `10px` at small (`1.375rem`)
- Gap between title and ornament: `6–7px`

**Ornament color — current state:**
Rule segments use `#1A1A1A` at `55%` opacity (thick rule) and `20%` opacity (thin rule). Near-black, neutral. The darkened painting palette color system (deterministic per city — see table below) is specced but **not yet applied** — the color assignment will be confirmed when building actual series pages. Do not implement palette colors for the ornament until the page structure is decided.

**Ornament color map — for future implementation:**

| City / Series | Ornament color | Source |
|---|---|---|
| Berlin | `#6B420F` | burnt amber darkened ~40% |
| San Francisco | `#1F6A85` | sky vivid darkened ~40% |
| Munich | `#8A6A18` | deep gold darkened ~40% |
| Amsterdam | `#4A1520` | burgundy darkened ~40% |
| New York | `#0F2B0E` | forest green darkened ~40% |
| Gates of Perception | `#6B420F` | burnt amber |
| Mediums of Perception | `#1F6A85` | sky vivid |
| Mediums of War | `#4A1520` | burgundy |
| About / Contact / Store | `#6B420F` | burnt amber — default |

**Implementation (React component):**
```tsx
// TitleOrnament.tsx
interface TitleOrnamentProps {
  color: string        // darkened palette color e.g. '#6B420F'
  textColor?: string   // diamond color, defaults to '#1A1A1A'
  diamondSize?: number // px, defaults to 11
}

// Usage:
// <TitleOrnament color={ornamentColor} />
// Sits immediately after the Limelight title element
// Parent must be display:inline-block or have defined width
```

```css
.title-ornament {
  display: flex;
  justify-content: center;
  margin-top: 6px;
}
.title-ornament-inner {
  display: flex;
  align-items: center;
  width: 70%;
}
.title-ornament-seg {
  flex: 1;
}
.title-ornament-thick {
  height: 2px;
  background: var(--ornament-color);
  display: block;
}
.title-ornament-thin {
  height: 1px;
  background: var(--ornament-color);
  opacity: 0.4;
  display: block;
  margin-top: 2px;
}
.title-ornament-diamond {
  flex-shrink: 0;
  padding: 0 9px;
  color: var(--ornament-text-color, #1A1A1A);
  line-height: 1;
  display: flex;
  align-items: center;
}
```

---

### The 1920s highlight layer — period texture through typography

Two typographic elements that add period character. Use sparingly — one per section, never both simultaneously:

**Small caps labels** — section category labels, metadata keys. `0.5625rem / 700 / letter-spacing: 0.18em / text-transform: uppercase`. Color: `$paint-burnt-amber` for active/accent labels, `$text-muted` for neutral metadata keys. Never use for artwork titles or navigation.

**Cream vertical rule** — column separator in metadata grids. `1px solid #F0E8C0`. Use to divide metadata items horizontally (Medium · Dimensions · Year). Never use as a full-height page divider.

**Font smoothing (global):**
```scss
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Type Scale in Use — Barlow Semi Condensed

All font sizes in **rem** (base 16px). Never use px for font sizes — rem respects browser accessibility settings.

| Use | rem | px equiv | Weight | Notes |
|---|---|---|---|---|
| Logo title | SVG | — | — | ColorLogo SVG component, not live text |
| Logo tagline | `0.75rem` | 12px | 400 | `$text-dark`, opacity 0.8 |
| Logo byline | `0.5625rem` | 9px | 500 | `#000000` |
| Nav links | `1rem` | 16px | 400 | `$text-dark`, line-height 1.7 |
| Filter/sort label | `0.6875rem` | 11px | 700 | `$text-muted` |
| Filter city label | `0.875rem` | 14px | 500 | `$text-primary` |
| Map popup caption | `0.625rem` | 10px | 500 | `$text-primary` |
| Map nav minimize | `0.625rem` | 10px | 400 | `$text-primary` |
| Artwork title (detail) | `2.5rem` | 40px | 300 | `$text-primary` |
| Artwork metadata label | `0.875rem` | 14px | 600 | `$text-secondary` |
| Map/List switch label | `0.6875rem` | 11px | 800 | `$text-primary` |
| Artwork dimensions/medium | `0.8125rem` | 13px | 400 | `$text-secondary` |
| Small caps label | `0.5625rem` | 9px | 700 | `$paint-burnt-amber` or `$text-muted`, `letter-spacing: 0.18em` |
| Body / narrative | `0.875rem` | 14px | 400 | `$text-primary`, line-height 1.75 |
| AR body text | `1.0625rem` | 17px | 400 | — |
| Loader text | `1.5rem` | 24px | 400 | white on `$surface-loader` |

### Type Scale in Use — Limelight (display only)

| Use | rem | px equiv | Ornament | Notes |
|---|---|---|---|---|
| City name — hero | `3.5rem` | 56px | ✓ | Page/section level only |
| City name — section | `2rem` | 32px | ✓ | Page/section level only |
| Series title — large | `1.75rem` | 28px | ✓ | Page/section level only |
| Series title — section | `1.375rem` | 22px | ✓ | Page/section level only |
| Page heading (About, Contact, Store) | `1.75rem` | 28px | ✓ | Page/section level only |
| Artwork title — detail page | `2.5rem` | 40px | ✗ | Limelight, no ornament |

Limelight has one weight only. Never bold, never italic. Letter-spacing: `0.03em` at large sizes, `0.02em` at smaller. Color always `#1A1A1A` on light backgrounds, `#F4F2EE` on sky fields.

---

## 3a. px vs rem — The Rule

**rem for anything that scales with text. px for anything that is geometry.**

| Use rem | Use px |
|---|---|
| All font sizes | Borders (1px, 2px) |
| Line heights that relate to text | SVG stroke widths |
| Padding/margin around text content | Fixed structural dimensions (nav strip height, panel width, pin size) |
| Spacing that should grow if browser font size increases | Layout offsets (top: 20px, right: 20px) |
| | Thumbnail geometry (100px height, proportion × 100px width) |
| | Gap between thumbnails (5px) |

**Quick reference — common values:**

| px | rem |
|---|---|
| 8px | `0.5rem` |
| 9px | `0.5625rem` |
| 10px | `0.625rem` |
| 11px | `0.6875rem` |
| 12px | `0.75rem` |
| 13px | `0.8125rem` |
| 14px | `0.875rem` |
| 16px | `1rem` |
| 17px | `1.0625rem` |
| 18px | `1.125rem` |
| 24px | `1.5rem` |
| 40px | `2.5rem` |

**Never mix in the same property.** `font-size: 14px` anywhere in the new codebase is a bug. `width: 110px` for the map nav strip is correct.

---

## 4. Spacing & Layout

### Breakpoints

| Name | Value | Usage |
|---|---|---|
| `s` (default/mobile) | `< 769px` | Single column, nav slides down from top |
| `l` (desktop) | `>= 769px` | Nav becomes right-side panel (300px), logo shifts |

Only one breakpoint. Everything is mobile-first. Tailwind config: use `l:` prefix (not `lg:`).

```js
// tailwind.config.ts
screens: {
  l: '769px',
}
```

### Z-Index Stack

| Layer | z-index | Element |
|---|---|---|
| Map | 1 | `.artworks-container` / map base |
| Filter tab | 300 | `.filter-sort-container` |
| Popups | 301 | `.map-single-pop-overlay`, `.map-pop-multiple-overlay` |
| Logo | 200 | `.logo` |
| Nav button | 200 | `.nav-button` |
| Nav menu | 100 | `.nav-menu` |
| Map nav strip | 2100 | `.map-nav-container` |
| Animation overlay | 10000 | `.artwork-animation-overlay` |

*Map nav (2100) sits above everything except the animation overlay. Logo and nav button (200) sit above the nav panel (100) so the close button is always clickable.*

### Key Layout Measurements

| Element | Value |
|---|---|
| Map nav strip height | `110px` |
| Nav panel width (desktop) | `300px` |
| Logo width | `200px` |
| Logo position | `top: 20px, left: 20px` |
| Nav button position | `top: 10px, right: 20px` |
| Nav button dimensions | `30px × 30px` |
| Map popup image height | `100px` (fixed) |
| Map popup image width | `100 * artwork.proportion` (px) |
| Filter tab bottom offset | `0` (map) or `110px` (above nav strip) |

### Spacing Scale

No formal spacing scale in source — values are ad-hoc. Recommended Tailwind mapping. Note: **px for fixed geometry, rem for text-adjacent padding**.

| Concept | Value | Unit rationale | Tailwind approx |
|---|---|---|---|
| Tight padding (filter tab) | `3px 10px` | px — UI geometry | `px-2.5 py-0.5` |
| Component gap | `5px` | px — thumbnail geometry | `gap-[5px]` |
| Nav link line-height | `1.7` | unitless | `leading-[1.7]` |
| Nav padding (desktop) | `60px 30px 5px` | px — panel geometry | `pt-[60px] px-[30px] pb-[5px]` |
| Logo top offset | `20px` | px — layout offset | `top-5` |
| Logo left offset | `20px` | px — layout offset | `left-5` |
| Nav button top | `10px` | px — layout offset | `top-2.5` |
| Nav button right | `20px` | px — layout offset | `right-5` |
| Map nav inner margin | `0 30px` | px — layout geometry | `mx-[30px]` |
| Map nav arrow width | `30px` | px — UI geometry | `w-[30px]` |
| Thumbnail gap | `5px` | px — geometry | `mr-[5px]` |
| Nav link padding (text) | `0.5rem 0` | rem — text-adjacent | `py-2` |

---

## 5. Responsive Behaviour

### Mobile (< 769px)
- Nav menu: full width (`90%`), slides down from `top: -470px` to `top: 0`
- Artwork detail: single column, stacked image then info
- Map nav: full width bottom strip
- Logo: stays `top: 20px, left: 20px`

### Desktop (>= 769px)
- Nav menu: `300px` right panel, `height: 470px`, slides from right edge
- Logo: shifts right to `calc(100% - 270px)` when nav is open (transition)
- Nav button: moves right with logo shift
- Artwork detail: two-column grid `1fr 1fr`, `gap: 4rem`

### Architectural shifts at 769px
- Nav: vertical slide → right panel (significant layout change)
- Artwork: single col → two col
- Image: `max-width: 90%` → `max-width: 65%` (within detail page)

---

## 6. Artwork Sizing

**The proportion system is the most important data pattern in the site.**

Every artwork has a `proportion` field (width ÷ height float). This drives all thumbnail and popup sizing:

```
thumbnail width = 100 * artwork.proportion (px)
thumbnail height = 100px (fixed)
```

This means square works are 100×100, landscape works are wider, portrait works are narrower. The map nav strip is a horizontal scroll of proportionally-sized thumbnails.

**Map popup:** same system — images at `100px` height × `100 * proportion` width.

**Detail page:** artwork fills as much of `65vw` as possible on desktop, constrained to `90vh`. Portrait works fill by height; landscape works fill by width.

**Animation overlay:** scales from popup rect to 75% viewport height, proportion-aware. Width = `75vh * proportion`, unless that exceeds `90vw` in which case width-constrained.

**Rule:** Never display artwork at a fixed square crop. Always respect proportion.

---

## 7. Component Patterns

### The Hamburger Button
4 `<span>` elements, not 3. Two narrow spans (17px) alternate with two full-width spans (23px), creating a distinctive uneven stagger. On open: spans 1 and 3 rotate to form ×, spans 2 and 4 fade. The button itself is 30×30px with `background: none, border: none`.

### The Toggle Switch (Map/List, EN/DE)
Custom SVG pill toggle — not a native checkbox. SVG viewBox `0 0 36 20`. Path draws the pill outline; circle is the handle. Circle translates `16px` horizontally on `switch-svg-on`. The pill fill is `rgba(255,255,255,0.4)` with `$text-dark` stroke. Used for both Map↔List and EN↔DE toggles.

### The Filter Tab
Fixed to bottom-right edge. Tab header is always visible; content slides up via `max-height` animation (`0 → 800px`, 0.7s linear). The `hover` state shows `6px` of content as a peek. Filter checkbox is a `12×12px` square (not rounded) with `1px $ui-line` border, filled with a painting palette accent color when checked (drawn from `$paint-burnt-amber`, `$paint-terracotta`, `$paint-mid-green`, `$paint-sky-vivid` etc). Two CSS variables control appearance: `--filter-dot-base` (color) and `--filter-dot-lightness` (0–100%, how much to lighten toward white). Tune in browser.

### The Map Nav Strip
110px fixed bottom strip. Left and right `30px` arrow buttons at fixed position. Inner scroll area is `calc(100% - 60px)` with `scrollbar-width: none`. The inner container uses `translateX` for software-controlled navigation (not native scroll). Thumbnails are proportion-width × 100px height, `5px` right margin.

### Map Pins
SVG pins colored from the painting palette accent colors — random but consistent per artwork via `pinColors` state map. Scale with zoom level via `interpolate(zoom, 0, 23, 0, 2)`. Pin shape: standard teardrop with circular hole. Color pool: `$paint-burnt-amber`, `$paint-terracotta`, `$paint-mid-green`, `$paint-sky-vivid`, `$paint-burgundy`, `$paint-deep-gold`, `$paint-forest-green`, `$paint-dusty-salmon`.

### Map Popups
**Maplibre GL** popups with `padding: 5px`, `box-shadow: 4px 6px 4px rgba(0,0,0,0.1)`. Single artwork: `100px` tall, centered. Multiple artworks at same location: horizontal carousel with left/right `30px` white arrow buttons. **Click-to-navigate only** — no zoom library, no `ControlledZoom`. Clicking triggers `triggerArtworkAnimation()` and routes to artwork page. Do not add zoom back to popups.

### The Artwork Animation
Full-viewport overlay (`z-index: 10000`). Image animates from popup rect → center of viewport (75% height). Background fades to `rgba(255,255,255,0.85)`. Uses `cubic-bezier(0.4, 0, 0.2, 1)` for the position/size transition. Reverse animation plays in reverse. `pointer-events: none` throughout.

### The Logo
`ColorLogo` is a fixed SVG (298×25px) with letters colored in the new painting palette warm-to-cool sequence (see Section 2 — Logo Palette). "HISTORY" is charcoal `#3A3F4A` at 75% opacity. It is never replaced with text. Below it: tagline at `0.75rem/400`, byline `by Bernard Bolter` at `0.5625rem/500/#000000`. The logo has a `logo-menu-open` state that on desktop shifts to `left: calc(100% - 270px)`.

---

## 8. Animation Patterns

| Pattern | Duration | Easing |
|---|---|---|
| Nav open/close | 0.5s | `ease-in-out` (`$fast`) |
| Logo position shift | 0.5s | `ease-in-out` (`$fast`) |
| Filter content expand | 0.7s | `linear` |
| Artwork scale animation | 0.6s | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Artwork total animation | 1.0s | compound |
| Popup overlay hover | 0.5s | `ease-in-out` |
| Map nav carousel translate | 0.5s | `ease-in-out` |
| Toggle switch circle | 0.2s | `ease-in-out` |
| Nav spans on open | 0.22s + stagger | `ease-in` |
| Hamburger span top | 0.1s / 0.2s | `ease-in` (staggered with transform) |

---

## 9. Tailwind Configuration

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      screens: {
        l: '769px',
        // Do NOT use sm, md, lg — this site uses only one breakpoint
      },
      colors: {
        // Surfaces
        'surface-page':       '#EDEDED',
        'surface-nav':        '#ECECEC',
        'surface-list':       '#F8F8F8',
        'surface-dark':       '#5E5E5E',
        'surface-loader':     '#AAAAAA',
        'surface-warm-white': '#F4F2EE',
        // Text
        'text-primary':   '#333333',
        'text-secondary': '#666666',
        'text-muted':     '#777777',
        'text-menu':      '#717171',
        'text-dark':      '#3A3F4A',
        // UI
        'ui-line':         '#777777',
        'ui-icon':         '#333333',
        'ui-fault-heavy':  '#3A3F4A',
        'ui-fault-light':  '#F0E8C0',
        // Status
        'status-error': '#BE4352',
        // Painting palette — field colors
        'paint-sky-warm':    '#A8D6E8',
        'paint-sky-vivid':   '#4AAED4',
        'paint-warm-white':  '#F4F2EE',
        'paint-mid-grey':    '#B8B8BC',
        'paint-charcoal':    '#3A3F4A',
        // Painting palette — accent colors
        'paint-cream':         '#F0E8C0',
        'paint-deep-gold':     '#E8C15A',
        'paint-burnt-amber':   '#B8742A',
        'paint-terracotta':    '#D4785A',
        'paint-dusty-salmon':  '#C4907A',
        'paint-burgundy':      '#8C3A42',
        'paint-mid-green':     '#8BAF62',
        'paint-forest-green':  '#2A4A28',
        // The gate element — use once, deliberately
        'paint-gate': '#2A1545',
        // Ornament colors — darkened palette, deterministic per city
        'ornament-berlin':       '#6B420F',
        'ornament-sf':           '#1F6A85',
        'ornament-munich':       '#8A6A18',
        'ornament-amsterdam':    '#4A1520',
        'ornament-ny':           '#0F2B0E',
        'ornament-default':      '#6B420F',
      },
      fontFamily: {
        sans:    ['"Barlow Semi Condensed"', 'sans-serif'],
        display: ['"Limelight"', 'cursive'],
      },
      fontSize: {
        // All values in rem. Never px for font sizes.
        'logo-tag':      ['0.75rem',   { lineHeight: '1',    fontWeight: '400' }],  // 12px
        'logo-by':       ['0.5625rem', { lineHeight: '1',    fontWeight: '500' }],  // 9px, #000
        'small-caps':    ['0.5625rem', { lineHeight: '1',    fontWeight: '700' }],  // 9px, burnt amber
        'map-caption':   ['0.625rem',  { lineHeight: '1',    fontWeight: '500' }],  // 10px
        'filter-label':  ['0.6875rem', { lineHeight: '1',    fontWeight: '700' }],  // 11px
        'switch-label':  ['0.6875rem', { lineHeight: '1',    fontWeight: '800' }],  // 11px
        'filter-city':   ['0.875rem',  { lineHeight: '1',    fontWeight: '500' }],  // 14px
        'body':          ['0.875rem',  { lineHeight: '1.75', fontWeight: '400' }],  // 14px
        'artwork-meta':  ['0.875rem',  { lineHeight: '1.4',  fontWeight: '600' }],  // 14px
        'artwork-dim':   ['0.8125rem', { lineHeight: '1.4',  fontWeight: '400' }],  // 13px
        'nav-link':      ['1rem',      { lineHeight: '1.7',  fontWeight: '400' }],  // 16px
        'ar-body':       ['1.0625rem', { lineHeight: '1.6',  fontWeight: '400' }],  // 17px
        // Limelight display sizes
        'artwork-title': ['2.5rem',    { lineHeight: '1',    fontWeight: '400' }],  // 40px — Limelight, no ornament
        'display-hero':  ['3.5rem',    { lineHeight: '0.95', fontWeight: '400' }],  // 56px — Limelight + ornament
        'display-lg':    ['2rem',      { lineHeight: '1',    fontWeight: '400' }],  // 32px — Limelight + ornament
        'display-md':    ['1.75rem',   { lineHeight: '1',    fontWeight: '400' }],  // 28px — Limelight + ornament
        'display-sm':    ['1.375rem',  { lineHeight: '1',    fontWeight: '400' }],  // 22px — Limelight + ornament
      },
      zIndex: {
        'map':           '1',
        'nav-menu':      '100',
        'nav-chrome':    '200',
        'filter':        '300',
        'popup-overlay': '301',
        'map-nav':       '2100',
        'animation':     '10000',
      },
      height: {
        'map-nav':   '110px',
        'nav-panel': '470px',
      },
      width: {
        'nav-panel': '300px',
        'logo':      '200px',
        'arrow-btn': '30px',
      },
      transitionTimingFunction: {
        'artwork': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'fast':    '500ms',
        'artwork': '600ms',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 10. CSS Variable Bridge

For values that need to cross the JS boundary (e.g., `decideColor()` still reads from the vars module), keep `vars.module.scss` for the spectrum colors only. Everything else migrates to Tailwind.

```scss
// vars.module.scss — keep only the spectrum export
// (all other vars replaced by Tailwind tokens)

$red: #A41E22;
$redOrange: #CB5722;
$orange: #F09120;
$orangeYellow: #EAA121;
$yellow: #E1B324;
$yellowOlive: #B4AA45;
$olive: #869F66;
$oliveGreen: #6BA155;
$green: #4DA446;
$greenAqua: #419279;
$aqua: #1D9F97;
$aquaColbolt: #3482AD;
$colbalt: #3482AD;
$colbaltBlue: #3770AA;
$blue: #3B5BA9;
$bluePurple: #50559A;
$purple: #674D8C;

:export {
  red: $red;
  redOrange: $redOrange;
  orange: $orange;
  orangeYellow: $orangeYellow;
  yellow: $yellow;
  yellowOlive: $yellowOlive;
  olive: $olive;
  oliveGreen: $oliveGreen;
  green: $green;
  greenAqua: $greenAqua;
  aqua: $aqua;
  aquaColbolt: $aquaColbolt;
  colbalt: $colbalt;
  colbaltBlue: $colbaltBlue;
  blue: $blue;
  bluePurple: $bluePurple;
  purple: $purple;
}
```

Global CSS vars for the few values used in inline styles:

```css
/* globals.css */
:root {
  --surface-nav: #ECECEC;
  --surface-page: #EDEDED;
  --text-primary: #333333;
  --text-muted: #777777;
  --ui-line: #777777;
  --accent-gold: #E1B324;
  --fast: 500ms;
}
```

---

## 11. SVG Icon Inventory

All icons are custom SVG components in `src/svg/`. None use an icon library.

| Component | File | Usage | Fill target |
|---|---|---|---|
| `ColorLogo` | `colorLogo.js` | Main logo — spectrum colored | hardcoded per letter |
| `FarbenLogo` | `farbenLogo.js` | German variant logo | same |
| `ARsvg` | `ARsvg.js` | AR trigger button on artwork | inherited |
| `MapPin` | `mapPin.js` | Map markers | spectrum random color |
| `MapPoint` | `mapPoint.js` | Alt pin style (unused?) | spectrum random |
| `RightArrow` | `rightArrow.js` | Carousel prev/next, map nav | `$dark-fill` |
| `Enlarge` | `enlarge.js` | Popup hover overlay | `$filter-dark` |
| `Filter` | `filter.js` | Filter tab header | `$filter-dark` |
| `Sort` | `sort.js` | Sort tab header | `$filter-dark` |
| `ToggleArrow` | `toggleArrow.js` | Toggle arrow (possibly unused) | — |
| `MagnifyPlus` | `magnifyplus.js` | Zoom in | — |
| `MagnifyMinus` | `magnifyMinus.js` | Zoom out | — |
| `SliderSvg` | `sliderSvg.js` | AR/interaction slider | — |
| `DEflag` | `DE.js` | Language switcher | national colors |
| `USflag` | `US.js` | Language switcher | national colors |

**Switch SVG** is inline in `Nav.tsx` — not extracted to a component. 30×18px pill, `circle cx="9.5" cy="9.5" r="5"`. Reused for both Map/List and EN/DE.

---

## 12. Third-Party Dependencies to Carry Over

| Library | Purpose | Notes |
|---|---|---|
| `@vis.gl/react-maplibre` | Map rendering | Confirmed. Grayscale Protomaps vector tiles. Do not switch to Leaflet. |
| `maplibre-gl` | Map engine | CSS import required |
| `next-intl` | EN/DE localisation | Replaces entire old i18next stack (see below) |

**Removed from old stack — do not carry over:**
- `i18next`, `react-i18next` — replaced by next-intl
- `accept-language` — next-intl middleware handles language detection natively
- `react-cookie` — no longer needed
- `i18next-browser-languagedetector`, `i18next-resources-to-backend` — no longer needed
- `react-medium-image-zoom` — removed entirely (see Map Popups below)

**Why MapLibre, not Leaflet:** The grayscale Protomaps vector tile style is load-bearing to the design — it creates the neutral stage for artwork pins. Leaflet is raster-tile based and getting a clean grayscale vector style requires additional plugins. All popup and pin behaviour is already working in MapLibre. Do not switch.

**Map style URL:** `https://api.protomaps.com/styles/v5/grayscale/en.json?key=${NEXT_PUBLIC_PROTOMAPS}`

**next-intl migration notes:**
- Replace `src/app/i18n/` folder entirely with next-intl setup
- Locale JSON files move from `src/app/i18n/locales/en/common.json` → `messages/en.json` (and `de.json`)
- Middleware replaces the old `accept-language` middleware — next-intl's `createMiddleware` handles path-prefixed routing (`/en/`, `/de/`) natively
- `useTranslation(lng, 'common')` calls in components become next-intl's `useTranslations('common')`
- Server components use `getTranslations()`, client components use `useTranslations()`
- The `[lng]` dynamic segment in the route structure is preserved — next-intl uses the same path pattern

**Map popup interaction — click only, no zoom:**
`react-medium-image-zoom` has been removed. Popup thumbnails are click-to-navigate only — clicking triggers `triggerArtworkAnimation()` and routes to the artwork page. No pinch-zoom, no `ControlledZoom` wrapper, no `isZoomedIndex` state. This was intentional — the zoom was intercepting click/navigation and causing interaction conflicts. Do not add zoom back to popups.

---

## 13. Provisional Systems (confirm after first build)

- **Map nav height:** currently `110px`. May need to increase for larger devices or taller artwork thumbnails. Check against actual artwork proportions.
- **Nav panel height (desktop):** `470px` hardcoded. Will need adjustment if nav content grows (new series links).
- **Logo shift on menu open:** `left: calc(100% - 270px)` — magic number derived from nav panel width. Update if nav panel width changes.
- **Filter tab bottom offset:** `110px` when map nav is visible, `0` when not. Currently controlled via inline style from `history.viewMap`. Confirm this is the right approach or convert to a CSS class toggle.
- **Artwork animation timing:** `600ms` scale + `400ms` total = `1000ms`. May feel slow on fast connections where the new page loads instantly. Consider reducing to `400ms` + `200ms` = `600ms`.
- **Spectrum duplicate:** `$aquaColbolt` and `$colbalt` are both `#3482AD`. Intentional? Check logo SVGs — they may need distinct values.

---

## 14. What NOT To Do

- **Do not use `font-size: Npx` anywhere in the new codebase.** All font sizes are rem. `font-size: 14px` is a bug — use `0.875rem`.
- **Do not use rem for fixed structural geometry.** `width: 6.875rem` for the map nav strip is wrong — use `110px`. The rule: text scales, structure doesn't. This site has one breakpoint: `l:` (`>= 769px`). Using standard Tailwind breakpoints will create unintended intermediate states.
- **Do not display artwork at fixed square crops.** Every image must respect `artwork.artworkFields.proportion`.
- **Do not replace the ColorLogo SVG with a text element.** The spectrum-colored SVG logo is part of the identity.
- **Do not add a second typeface.** Barlow Semi Condensed at varying weights is the entire type system.
- **Do not use rounded corners on the filter checkbox.** It is a hard-edged `12×12px` square.
- **Do not add padding to `<body>`.** All layout is via fixed-position elements. Body padding breaks the map-first layout.
- **Do not use native `<input type="checkbox">` for filters.** The custom `FilterDot` component must be preserved.
- **Do not apply background color to the map wrapper.** The Maplibre canvas fills 100vw/100vh.
- **Do not add a footer.** The map nav strip at the bottom IS the footer equivalent.
- **Do not use `position: relative` wrappers that would clip fixed children.**

---

## 15. File Map (src/)

```
src/
├── app/
│   ├── layout.tsx          — root layout (passthrough)
│   ├── [lng]/
│   │   ├── layout.tsx      — Barlow font, HistoryProvider, global SCSS import
│   │   ├── page.tsx        — home: Nav + Logo + FilterTab + Artworks (map)
│   │   ├── about/page.tsx  — stub
│   │   ├── contact/page.tsx — stub
│   │   └── [slug]/
│   │       ├── page.tsx    — artwork list with slug-first ordering
│   │       └── ar/page.tsx — AR view (mind.js, TODO)
│   └── api/                — legacy fetch helper (unused)
├── messages/
│   ├── en.json             — English strings (migrated from i18n/locales/en/common.json)
│   └── de.json             — German strings (migrated from i18n/locales/de/common.json)
├── components/
│   ├── Animation/ArtworkAnimation.tsx  — overlay animation
│   ├── AR/ARView.tsx       — stub
│   ├── Artworks/
│   │   ├── Artworks.tsx    — map wrapper + loader
│   │   ├── ArtworkList.tsx — list view
│   │   ├── Artwork.tsx     — detail view
│   │   └── ArtworkAR.tsx   — AR preview (not yet wired)
│   ├── Map/
│   │   ├── Map.tsx         — main map, markers, popups
│   │   ├── MapNav.tsx      — bottom thumbnail strip
│   │   ├── MapNavImage.tsx — individual thumbnail
│   │   └── FilterDot.tsx   — spectrum-colored checkbox
│   ├── Navigation/
│   │   ├── Nav.tsx         — hamburger + slide panel + switches
│   │   ├── Logo.tsx        — ColorLogo + taglines
│   │   └── FilterTab.tsx   — filter & sort panel
│   ├── Contact.tsx         — stub
│   └── Loader.tsx          — loading state
├── helpers/
│   ├── helpers.ts          — interpolate(), decideColor()
│   └── animation.ts        — animation state helpers
├── lib/graphql.ts          — all GQL queries + TS interfaces
├── middleware.ts           — next-intl createMiddleware, handles /en/ /de/ routing
├── providers/
│   └── HistoryProvider.tsx — global state (artwork list, map, animation)
├── style/
│   ├── vars.module.scss    — KEEP: spectrum colors for JS export (pending migration to painting palette)
│   ├── index.scss          — global import barrel
│   └── [component].scss    — migrate each to Tailwind classes
├── public/
│   └── damask.jpg          — baroque damask pattern tile (source: 1129.jpg)
├── svg/                    — all SVG components (preserve as-is)
└── types/mindAR.ts         — MindAR TypeScript interfaces
```

---

## 16. Token Migration Map (old Sass → new tokens)

| Old | New (Tailwind class or CSS var) |
|---|---|
| `$background` | `bg-surface-page` |
| `$nav-background` | `bg-surface-nav` |
| `$art-list-background` | `bg-surface-list` |
| `$less-dark` | `bg-surface-dark` |
| `$light-dark` | `bg-surface-loader` |
| `$dark-fill` | `text-text-primary` / `fill-ui-icon` |
| `$text` | `text-text-primary` |
| `$text-light` | `text-text-secondary` |
| `$filter-dark` | `text-text-muted` / `fill-ui-line` |
| `$menu-color` | `text-text-menu` |
| `$dark` | `text-text-dark` → now `$paint-charcoal` `#3A3F4A` |
| `$accent` | `$paint-burnt-amber` `#B8742A` |
| `$accent-light` | `$paint-deep-gold` `#E8C15A` |
| `$error-red` | `text-status-error` |
| `$red` through `$purple` | retired — painting palette only, logo SVG pending update |
| `$fast` | `duration-fast ease-in-out` |
| `$slow` | `duration-[1000ms] ease-in-out` |
| `$desktop` | `l:` breakpoint prefix |

---

## 17. Damask Wallpaper Pattern

**Source file:** `public/damask.jpg` — baroque damask, fleur-de-lis and acanthus scrolls, white motif on white ground. Originally `1129.eps` (Adobe Illustrator, 2015).

**Usage opacity:** `7%` — present as texture, never competing with text.

**Where it appears:**
- Dense zones — information-heavy sections: About, series descriptions, store context, artwork narrative
- The right 70% of a 30/70 split layout (left plain, right patterned)
- Full-section background on pages with no artwork imagery (About page, contact)

**Where it never appears:**
- Behind artwork images
- Behind the map
- In field/sky zones
- On the map nav strip
- On any navigation element

**Implementation:**
```css
.dense-zone {
  position: relative;
}
.dense-zone::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/damask.jpg');
  background-size: 300px 300px;
  opacity: 0.07;
  pointer-events: none;
  z-index: 0;
}
.dense-zone > * {
  position: relative;
  z-index: 1;
}
```

**Tile size:** `300px × 300px`. The source image is approximately 2×2 repeat — crop to a single tile for the web asset. The pattern is symmetric so any crop point works.

**The 30/70 split:** Plain left zone width is exactly `30%`. The dividing line between zones fades at top and bottom using a gradient — it appears as a natural boundary, not a hard rule:
```css
.split-divider {
  position: absolute;
  left: 30%;
  top: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, transparent, #C8C4BC 20%, #C8C4BC 80%, transparent);
}
```

---

## 18. Rectangle Overlay — Hover Interaction on Artwork Images

Inspired by the Kotbusser Tor painting: a flat color rectangle appears over an artwork image on hover, the way the painted field covers part of the photograph in the canvas. The gesture is interactive — the user sees it happen. It makes the gate element legible as behaviour rather than decoration.

### Where it appears
- **Artwork images** — on the artwork detail page hero image, and on artwork cards in any list/grid view
- **About / Contact pages** — a looser, more ambient version using the full painting palette (see below)

### Per-artwork rectangle data (stored in Payload)

Each artwork record stores a curated set of overlay rectangles. Bernard places them — the agent builds them. Not algorithmic, not random. Each rectangle is compositionally considered, referencing the painted fields in that specific canvas.

```json
"overlayRects": [
  { "color": "#A8D6E8", "x": "12%", "y": "8%",  "w": "35%", "h": "18%" },
  { "color": "#3A3F4A", "x": "58%", "y": "65%", "w": "22%", "h": "30%" }
]
```

**Payload fields per artwork (new tab — Overlay):**
- `overlayRects` — array of `{ color, x, y, w, h }` — 1 to 4 rectangles
- `overlayColors` — flat array of hex values used in this artwork's painted fields (2–6 colors, curated by Bernard). Used for simpler contexts where full rect data isn't needed.

### Agent-assisted setup

When an artwork image is uploaded to Payload, an agent can analyse the image and suggest:
- Which painted field colors are dominant (hex values)
- Proposed rectangle positions based on where the painted fields sit in the composition
- Bernard confirms, adjusts, or overrides

This is rough spec for now — the implementation will be worked out when building the Payload admin and the archive. The key principle is that the data is **artist-curated, not algorithmically generated**. The agent proposes, Bernard decides.

### Animation behaviour

On hover:
- Rectangles animate in — slide from nearest edge or fade up from 0% opacity
- Stay visible while hovering
- Fade out on mouse leave
- Duration: `300ms ease-out` in, `200ms ease-in` out

Text inside the rectangle: **not yet decided** — may show title + small caps series label in `$paint-warm-white`, or may be purely color. To be worked out when building the artwork card component.

### About / Contact — ambient version

No per-artwork data. Rectangles drawn from the full painting palette accent colors, randomised position and size on each page load. Lighter touch — 2–3 rectangles maximum, smaller scale, lower opacity. More like the Gallery Weekend Berlin mechanic. To be designed when building those pages.

---

## 19. The Gate Element — Reserved for Future Use

The Kotbusser Tor rectangle (`#2A1545` — deep purple, reads near-black straight-on) was explored as a UI element but shelved. The concept is right — a deliberate compositional interruption derived from the painting — but the execution needs the right context. It is not a design system component yet.

**What it is:** A flat color block placed over content in a way that violates compositional rules, as the purple rectangle in Kotbusser Tor 2018 was painted flat over the photograph. It represents a gate — something that covers, something you have to engage with to pass through.

**When it might appear:** On a specific page where the backstory of that painting is the content itself — perhaps the Gates of Perception series page. Not as a general UI pattern.

**If implemented:** The block must be anchored to a structural edge (page boundary, column join, fault line rule) — never floating free. It should cover narrative text, not metadata or navigation. Color can be drawn from the painting palette, not exclusively purple. The gate color `#2A1545` should be reserved for the most significant single use.

**Do not implement** until the specific page context makes the gesture legible. Without the story, it is just a box.

---

## 20. Image Loading Placeholders

No blur placeholders. No grey boxes. Artwork spaces fill with a flat painting palette color before the image loads — like the painted fields themselves appearing before the photograph arrives.

**How it works in Next.js:**
Each `<Image>` component receives a `placeholder="blur"` prop with a custom `blurDataURL` — a base64-encoded 1×1 pixel PNG in a painting palette color. The color is deterministic per artwork, derived from the artwork's city.

**Color assignment per city:**
| City | Placeholder color | Token |
|---|---|---|
| Berlin | `#A8D6E8` | `$paint-sky-warm` |
| San Francisco | `#B8B8BC` | `$paint-mid-grey` |
| Munich | `#F0E8C0` | `$paint-cream` |
| Amsterdam | `#C4907A` | `$paint-dusty-salmon` |
| New York | `#B8B8BC` | `$paint-mid-grey` |
| Unknown / fallback | `#F4F2EE` | `$paint-warm-white` |

**Base64 1×1 PNG generator:**
```ts
// lib/placeholders.ts
export function colorToBlurDataURL(hex: string): string {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  
  // 1x1 PNG in base64 — hardcoded minimal PNG structure
  // Use a lookup table of pre-generated values for each palette color
  return PLACEHOLDER_MAP[hex] ?? PLACEHOLDER_MAP['#F4F2EE']
}

// Pre-generated base64 1×1 PNGs for each palette color
// Generate once with: node -e "const {createCanvas}=require('canvas'); ..."
export const PLACEHOLDER_MAP: Record<string, string> = {
  '#A8D6E8': 'data:image/png;base64,...', // sky warm
  '#B8B8BC': 'data:image/png;base64,...', // mid grey
  '#F0E8C0': 'data:image/png;base64,...', // cream
  '#C4907A': 'data:image/png;base64,...', // dusty salmon
  '#F4F2EE': 'data:image/png;base64,...', // warm white fallback
}

// City to color map
export const CITY_PLACEHOLDER: Record<string, string> = {
  'Berlin':        '#A8D6E8',
  'San Francisco': '#B8B8BC',
  'Munich':        '#F0E8C0',
  'Amsterdam':     '#C4907A',
  'New York':      '#B8B8BC',
}

export function getArtworkPlaceholder(city: string): string {
  const color = CITY_PLACEHOLDER[city] ?? '#F4F2EE'
  return colorToBlurDataURL(color)
}
```

**Usage on Image component:**
```tsx
<Image
  src={artwork.artworkFields.artworkImage.mediaDetails.sizes[1].sourceUrl}
  alt={artwork.title}
  width={100 * artwork.artworkFields.proportion}
  height={100}
  placeholder="blur"
  blurDataURL={getArtworkPlaceholder(artwork.artworkFields.city)}
/>
```

**Note:** The `blurDataURL` with `placeholder="blur"` in Next.js applies a CSS blur filter over the placeholder — disable this blur effect with `style={{ filter: 'none' }}` on the image, or use a custom loading state instead. The goal is a flat color, not a blurred pixel. An alternative approach is a CSS background color on the image wrapper div that disappears once the image loads via the `onLoad` callback.

**Alternative — wrapper approach (no blur artefact):**
```tsx
const [loaded, setLoaded] = useState(false)
const placeholderColor = getArtworkPlaceholderColor(artwork.artworkFields.city)

<div style={{ background: loaded ? 'transparent' : placeholderColor, transition: 'background 0.3s ease' }}>
  <Image
    src={...}
    onLoad={() => setLoaded(true)}
    ...
  />
</div>
```

---

*This document is the single reference for all agents building ACH / Mediums of Perception components. Update it when reality diverges from spec. The token names are the contract. Last substantially updated: April 2026.*
