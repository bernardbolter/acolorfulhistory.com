# Addendum — Style guide reconciliation

Read-only. Code is authoritative. `docs/design-system.md` is not. Captured 16 September 2026. Does not rewrite the design system.

Canonical doc: `docs/design-system.md`. Stub `docs/design/design-system.md` still only points at the canonical file (unchanged since [addendum-style-system-audit.md](./addendum-style-system-audit.md)).

Inventory used: [addendum-route-component-inventory.md](./addendum-route-component-inventory.md).

---

## Currency of addendum-style-system-audit.md (1 Sep 2026)

That audit’s Tier 1–2 findings still match the files cited. Not restated below.

| Sep 1 claim | 16 Sep |
|---|---|
| `/` is `PaintingList`; map is `/map`; `/series` redirects | Still true (`app/[locale]/page.tsx`, `map/page.tsx`, `series/page.tsx`) |
| Three faces loaded; `font-card` unused; Josefin via CSS variables on four selectors | Still true — same four selectors (lines below) |
| Artwork overlay title Barlow `.title-block-text` 1.125rem/600, not Limelight 2.5rem | Still true |
| Logo 318px shift; tagline/byline fade; panel `#FBFAF7` + `pt-28` | Still true (`Logo.tsx` 15, 37; `Nav.tsx` 181, 195) |
| No `sm:`/`md:`/`lg:`/`xl:`; only `l:` 769px | Still true (zero breakpoint-prefix hits) |
| No `public/damask.jpg`; no damask string in ts/tsx/css | Still true |
| No `react-medium-image-zoom` | Still true; zoom is `ZoomMode.tsx` |
| Overlay rects = load dissolve on detail, not hover, not on `ListCard` | Still true |
| `CITY_PLACEHOLDER_COLORS` still in `lib/cityPlaceholder.ts` despite §20 “retired” | Still true |
| `text-section-title` used, not in `tailwind.config.js` | Still true |
| Old `components/hero/*` not mounted on `/` | Confirmed unused (inventory §3) |
| `docs/design/design-system.md` five-line stub | Still true |
| Josefin 500+600 loaded | Still true (`lib/fonts.ts` 18–23) |

Nothing in that audit is contradicted by current code. New material below is either the mandated rule checks (with current line numbers) or findings it did not inventory (unused tokens, hardcoded duplicates, commerce classes, undocumented component list).

---

## 1. Discrepancies

### Bucket A — code is right, the doc is out of date

Sep 1 already listed the large set (Philosophy map-first, two-font system, §6 100px thumbs / two-column detail, §14 body-padding, §7 SVG toggle, §15 `src/` file map, §17 damask as if shipping, §18 hover overlays). Those remain Bucket A.

Additions not in that audit:

| Doc section | Doc claim | Code |
|---|---|---|
| §9 fontFamily | Sample config does not include `card` | `tailwind.config.js` 75: `card: ['var(--font-josefin)', 'sans-serif']` exists; **no file uses `font-card`**. Josefin is applied in `globals.css` (see Bucket C). |
| §4 z-index table | Layers use Tailwind `z-*` names | Map/filter/popup/map-nav/animation z-indexes are raw CSS (`globals.css` 265, 336, 369, 436, 557). Tailwind `z-map`, `z-filter`, `z-popup-overlay`, `z-map-nav`, `z-animation` have **zero** class uses. Live extra: scrim `z-[90]` (`Nav.tsx` 168), zoom/reveal `z-index: 10002` (`globals.css` 1255). |
| §20 | `CITY_PLACEHOLDER` retired; prefer `overlayColors[]` then `#F4F2EE` | `getCityPlaceholderColor` still maps city names (`lib/cityPlaceholder.ts` 2–16) and is called from `artworkFromPayload.ts` 87 / 370, `ArtworkImagePlaceholder.tsx` 27, `opengraph-image.tsx` 33. |
| §3 Limelight “nowhere else” + never prices | Prices never Limelight | Neighborhood price `dd` is `font-display text-display-sm` (`NeighborhoodPageShell.tsx` 170–172). |

### Bucket B — the doc is right, the code diverges

Mandated rule checks:

| Rule | Result | Evidence |
|---|---|---|
| Single breakpoint `l:` at 769px only | **No `sm:` / `md:` / `lg:` / `xl:` / `2xl:` prefix in app, components, or `globals.css`.** CSS media queries are `min-width: 769px` or `max-width: 768px` (`globals.css` 637, 863, 944, 1117, 1367, 1420, 1784, 1908, 2008, 2034, 2047). | 0 occurrences of the forbidden prefixes. |
| rem for font sizes, never px | **No `font-size: Npx` and no `text-[Npx]`.** Font sizes in CSS are rem. | Closest geometry-as-type: `.mini-nav` related `font-size: 0.6rem` (`globals.css` 810). |
| No blur placeholders; `cityPlaceholderColor` + `overlayRects` only | **List and hero painting images use Next `placeholder="blur"` + 1×1 `blurDataURL`.** Detail image uses wrapper + overlay rects. CSS tries to kill the gaussian (`globals.css` 1748–1751). `HeroMobileArrow.tsx` 24 uses `backdrop-blur-sm` (old hero stack, unmounted). | `ListCard.tsx` 27, 53–54; `HeroListItem.tsx` 106, 363–364; `ArtworkImage.tsx` 20–22 passes `city` / `color` / `overlayRects`. Occurrences of `placeholder="blur"`: **2 files, 2 sites**. |
| No `react-medium-image-zoom` | **Not in `package.json` or any import.** Zoom is custom `ZoomMode.tsx`. | 0 occurrences. |
| Logo is SVG only, never rebuilt in HTML/CSS | **Wordmark is SVG** (`svgs/colorLogo.js`, used `Logo.tsx` 28). **Tagline and “Bernard Bolter” are HTML/CSS** (`Logo.tsx` 44–66). | 1 SVG wordmark; 1 HTML meta stack. |
| Damask in dense zones only, never behind artwork | **Damask is not implemented.** No file references it, so it is not behind artwork. Dense zones are flat `--surface-page`. | 0 occurrences. Doc §17 still specifies `public/damask.jpg` at 7%. |

Other Bucket B (doc rule, code breaks) not already in Sep 1’s “live vs prohibition” tables:

| Rule | File:line | How many |
|---|---|---|
| §3 artwork titles are Limelight `2.5rem` | `.title-block-text` `globals.css` 732–737; `TitleBlock.tsx` 46. `.artwork-info-heading` `globals.css` 879–885; `InfoTab.tsx` 56. | 2 title surfaces, both Barlow 1.125rem/600 |
| §7 logo tagline/byline “shift together as one group” | `Logo.tsx` 32–38: meta stack `opacity-0` on open; wordmark translates | 1 |
| §20 do not use city placeholder map | `lib/cityPlaceholder.ts` 2–16, called from 4 sites listed in Bucket A | 1 map + 4 call sites |
| §3 Limelight never for prices | `NeighborhoodPageShell.tsx` 170 | 1 |

### Bucket C — needs a human decision

#### Josefin Sans — every applied selector

Loaded: `lib/fonts.ts` 17–23 (weights 500, 600), `app/layout.tsx` 20 `--font-josefin` on `<html>`. Tailwind `font-card` (`tailwind.config.js` 75) is **never used as a class**.

| File | Selector | Size / weight | Surface |
|---|---|---|---|
| `app/globals.css` 1773–1781 | `.painting-list-title` | 1.125rem / 500 / tracking 0.015em | `ListCard.tsx` 61 `<h2>`; `HeroListItem.tsx` 377 `<h2>` (list rest state) |
| `app/globals.css` 1612–1620 | `.hero-list-caption` | 0.9375rem / 500 | Hero performance captions (`HeroListItem`) |
| `app/globals.css` 1500–1508 | `.hero-list-play-hint` | 0.75rem / 500 / lowercase tracking 0.12em | Hero play hint (`HeroListItem`) |
| `app/globals.css` 1052–1060 | `.historical-date-year` | 1.25rem / **600** | Artwork timeline years (`HistoricalDatesTimeline.tsx`) |

It is **not card-scoped only**. It is on list-card titles **and** hero captions/hints **and** timeline years. It is not on nav, body, page `<h1>`s, or artwork overlay titles.

`lib/fonts.ts` 17 still comments “List card titles only — do not use for page/series Limelight contexts.”

#### Artwork detail page titles — font actually applied

| Surface | File:line | Font | Size / weight |
|---|---|---|---|
| Overlay on the painting | `TitleBlock.tsx` 46 `className="title-block-text"`; `globals.css` 732–737 | `var(--font-body)` = Barlow (`app/layout.tsx` 22 `bodyFontClassName`) | 1.125rem / 600 / line-height 1.25 / `--text-dark` |
| Dense-zone heading (repeats the painting title) | `InfoTab.tsx` 56 `className="artwork-info-heading"`; `globals.css` 879–885 | inherit (Barlow body) | 1.125rem / 600 |
| City under overlay title | `globals.css` 740–746 `.title-block-city` | Barlow | 0.75rem / 500 |

Not Limelight. Not Josefin. Not `text-artwork-title` (2.5rem).

#### Other decision-shaped gaps

| Gap | Evidence |
|---|---|
| Nav panel cream `#FBFAF7` vs token `$surface-nav` `#ECECEC` | `Nav.tsx` 181 `bg-[#FBFAF7]`; `tailwind.config.js` 17 `surface-nav`. No token for `#FBFAF7`. |
| `text-section-title` is not a token | Used `ExperiencePageShell.tsx` 52, `TriptychOverviewRow.tsx` 41, `TriptychPanels.tsx` 153, unused `HomeSectionRenderer.tsx` 19/51/68. Falls through to body size + `font-display`. |
| Dual placeholder mechanisms | List: `placeholder="blur"` + 1×1 PNG. Detail: `cityPlaceholderColor` + `overlayRects`. §20 documents both as alternatives. |
| Logo wordmark SVG vs HTML tagline | See Bucket B logo row. |
| Limelight on Neighborhood price | `NeighborhoodPageShell.tsx` 170 vs §3 never-prices. |
| Ornament city colors registered, unused | `tailwind.config.js` 52–57 `ornament-*`; `TitleOrnament.tsx` 13 default `#1A1A1A`. |
| Open-nav logo: fade (code) vs travel-together (decision / doc) | Same as Sep 1; still unresolved. |

---

## 2. Tokens

### Defined in `tailwind.config.js` and unused as classes

| Token | Defined | Used as a utility class? |
|---|---|---|
| `font-card` | 75 | No |
| `font-sans` | 73 | No (`body` uses `barlow.className`) |
| `text-small-caps` | 80–83 | No (see hardcoded duplicates) |
| `text-map-caption` | 84 | No |
| `text-filter-city` | 87 | No |
| `text-ar-body` | 92 | No |
| `text-display-hero` | 94 | No |
| `text-filter-label` | 85 | `DesignSystemPreview.tsx` 62 only |
| `text-artwork-dim` | 90 | `DesignSystemPreview.tsx` 80 only |
| `text-display-lg` | 95 | `DesignSystemPreview.tsx` 41 only |
| `ornament-berlin` / `sf` / `munich` / `amsterdam` / `ny` / `default` | 52–57 | No class uses |
| `bg-surface-nav` / `surface-nav` as a class | 17 | No (CSS var `--surface-nav` exists; panel uses `#FBFAF7`) |
| `z-map`, `z-filter`, `z-popup-overlay`, `z-map-nav`, `z-animation` | 100–106 | No (`z-nav-menu`, `z-nav-chrome` are used) |
| `h-map-nav`, `h-nav-panel`, `w-logo`, `w-arrow-btn` | 108–116 | No (`w-nav-panel` is used `Nav.tsx` 185) |
| `ease-artwork`, `duration-artwork` | 118–123 | No (`duration-fast` is used) |

`text-display-md` is used only by unmounted `HeroCopy.tsx` and `DesignSystemPreview.tsx`.

Legacy aliases (`background`, `nav-background`, `menu-color`, `dark-fill`, `filter-dark`, `text`, `dark`, `error-red`, `less-dark`, `light-dark`, `art-list-background`, `text-light`) still appear as CSS variables in `globals.css` 39–52 and some map CSS; several have no Tailwind class usage outside those aliases.

### `globals.css` classes whose only consumers are unused (inventory §3)

`.home-section`, `.home-cta` on the unused homepage sections; old `.hero-copy-line` / `.hero-section` / `.hero-cta` / `.hero-mobile-arrow` (unmounted `components/hero/*`). `.home-list-controls*` (`globals.css` 1634–1674) is written for `HomeListControls.tsx`, which is not imported.

### Hardcoded values that duplicate an existing token

| File | Line | Hardcoded | Token that already exists |
|---|---|---|---|
| `app/globals.css` | 72 | `text-[0.5625rem] … tracking-[0.18em]` in `.label-small-caps` | `text-small-caps` (`tailwind.config.js` 80–83) |
| `components/UI/Nav.tsx` | 208 | `text-[0.5625rem] font-semibold uppercase tracking-[0.12em]` | `text-small-caps` (weight/tracking differ: 600 vs 700, 0.12em vs 0.18em) |
| `app/globals.css` | 897 | `.artwork-info-dl dt` `font-size: 0.5625rem` / 700 / 0.18em | `text-small-caps` |
| `app/globals.css` | 1658 | `.home-list-control-label` same 0.5625rem / 700 / 0.18em | `text-small-caps` |
| `app/globals.css` | 1766 | `.painting-list-series-tag` same | `text-small-caps` |
| `app/globals.css` | 2066 | `.neighborhood-field span` same | `text-small-caps` |
| `app/globals.css` | 450, 473, 853, 1936 | `font-size: 0.6875rem` | `text-filter-label` / `text-logo-by` / `text-switch-label` (all 0.6875rem; weights differ) |
| `app/globals.css` | 279, 495, 518, 532, 933, 1246, 1268, 2057 | `font-size: 0.875rem` | `text-body` / `text-logo-tag` / `text-filter-city` / `text-artwork-meta` |
| `app/globals.css` | 843, 1064, 1671, 1759, 1839 | `font-size: 0.8125rem` | `text-artwork-dim` |
| `app/globals.css` | 1857 | `font-size: 0.625rem` | `text-map-caption` |
| `components/UI/Logo.tsx` | 57 | `text-[0.9375rem] font-bold` | no 0.9375rem token; nearest `text-logo-tag` 0.875rem |
| `app/globals.css` | 1615 | `.hero-list-caption` `font-size: 0.9375rem` | same |
| `app/globals.css` | 1511, 1959 | `color: #f4f2ee` | `paint-warm-white` / `--surface-warm-white` |
| `components/UI/NavPersistentRow.tsx` | 73, 92 | `text-[#888]` | no `#888` token; nearest `text-muted` `#777` or `text-secondary` `#666` |
| `components/UI/Nav.tsx` | 181 | `bg-[#FBFAF7]` | no matching token (`surface-nav` is `#ECECEC`) |
| `components/UI/Nav.tsx` | 207–208 | `bg-[#999]/50`, `text-[#999]` | no `#999` token |
| `components/UI/DesignSystemPreview.tsx` | 41, 52, 59, 70, 103 | `text-[#1A1A1A]` | §3 Limelight-on-light color; not a Tailwind token (`text-primary` is `#333333`) |
| `components/UI/TitleOrnament.tsx` | 13 | default `textColor = '#1A1A1A'` | same |

---

## 3. Undocumented components

Visual styling not described in `docs/design-system.md` (search of that file: no hits for these names). Just the list.

**Live on a route**

- `PaintingList`, `ListCard`, `PaintingListMeta`, `HeroListItem`, `HeroFieldLayer`
- `NavPersistentRow`
- `ArtworkPage`, `ArtworkSlug`, `ArtworkImage`
- `TitleBlock`, `MiniNav`, `InfoTab`, `StoryColumns`, `HistoricalDatesTimeline`
- `RevealSlider`, `ZoomMode`, `ARLink`, `TriptychLink`, `StatusBadge`
- `NeighborhoodPageShell`, `InquiryForm`
- `ExperiencePageShell`
- `MoPOverviewPage`, `TriptychPageShell`, `TriptychOverviewRow`, `TriptychPanels`, `TriptychCommerce`
- `PlaceholderPage`
- `DesignSystemPreview`
- `MapExplorer`, `MapExplorerLoader`
- `ARViewer`
- `SiteChrome`, `FieldZone`, `DenseZone` (zones named in Philosophy; these components are not)

`ArtworkImagePlaceholder` is partly §20; overlay behaviour is §18 (and does not match). `Logo`, `Nav` hamburger, `FilterSort`/`FilterDot`, `MapNav`/`MapNavImage`, `ArtworkMap` pins/popups, `ArtworkAnimationOverlay`, `TitleOrnament`, `FaultLine` are the ones the doc does describe (often with stale measurements).

**Present, not mounted** (inventory §3): `Artworks`, `ArtworkList`, `Loader`, `LandingPage`, `HomeSectionRenderer`, `HomeListControls`, `HeroSection`, `HeroSectionLoader`, `HeroCanvas`, `HeroCopy`, `HeroMobileArrow`.

---

## 4. Commerce vocabulary

Editorial design system has no commerce section. Current commerce styling:

| Style | Where | Defined |
|---|---|---|
| `.status-badge` — availability pill (Original available / Sold / Prints only) | `StatusBadge.tsx` 26; `globals.css` 849–856 | `globals.css` |
| `.artwork-status-row` | `ArtworkPage.tsx` 175; `globals.css` 832 | `globals.css` |
| `.home-list-control*` — availability (and series/city/decade) `<select>` | `HomeListControls.tsx` 68–168; `globals.css` 1634–1674 | `globals.css` (component unmounted) |
| `.triptych-add-to-cart` — add-to-cart button, disabled opacity | `TriptychCommerce.tsx` 64–71; `globals.css` 1887–1898 | `globals.css` |
| `.triptych-print-set` / `.triptych-commerce` — edition, remaining count, release date | `TriptychCommerce.tsx` 45–84 | `globals.css` (section) + Tailwind `text-body` inline |
| `.home-cta` — underlined text link used for store / Berlin prints / inquiry adjacent CTAs | `ExperiencePageShell.tsx` 77–82, `NeighborhoodPageShell.tsx` 123, 222–225, `TriptychPageShell.tsx` 68, `ARViewer.tsx` 40 | `globals.css` 1374–1378 |
| Neighborhood price | `NeighborhoodPageShell.tsx` 170 `font-display text-display-sm` | Tailwind inline (`font-display`, `text-display-sm`) |
| Neighborhood pricing block (headline, size/price/batch labels) | `NeighborhoodPageShell.tsx` 148–180 | Tailwind inline (`label-small-caps`, `text-artwork-meta`, `font-display`) |
| `.neighborhood-field`, `.neighborhood-field--full` — inquiry labels + inputs | `InquiryForm.tsx` 104–161; `globals.css` 2053–2091 | `globals.css` |
| `.neighborhood-submit` — inquiry submit | `InquiryForm.tsx` 172; `globals.css` 2093–2108 | `globals.css` |
| `.neighborhood-inquiry-grid` | `InquiryForm.tsx`; `globals.css` 2047–2050 | `globals.css` |
| Nav “Art Prints” / Store | `Nav.tsx` 46 `href: '/store'` | Tailwind `text-nav-link` on panel links; destination is placeholder |
| Vendure unconfigured note | `TriptychCommerce.tsx` 86–89 | Tailwind `text-body text-text-muted` inline |

No commerce tokens in `tailwind.config.js`. Selection/active states on map filters use `.filter-sort-option-active` (`globals.css` 523) — browse, not commerce.
