# Addendum — Style System Audit (design-system.md vs. the live front page)
## A Colorful History · acolorfulhistory.com

*Cursor's status check of `docs/design-system.md` against the site that is actually live. Report only — nothing was changed in this pass. A scoped rewrite of the document follows once this is reviewed with Bernard.*
*Captured Sep 1 2026. Format follows [addendum-homepage-cursor-audit.md](./addendum-homepage-cursor-audit.md).*

**Read in the requested order:** `docs/design-system.md` (full, start to finish) · `docs/hero/brief-hero-list-system.md` · `docs/cards/brief-09-list-card-images.md` · `docs/cards/brief-12-list-image-sizing.md` · [addendum-homepage-cursor-audit.md](./addendum-homepage-cursor-audit.md) · [addendum-homepage-fix-pass-1.md](./addendum-homepage-fix-pass-1.md) · [addendum-homepage-fix-pass-2.md](./addendum-homepage-fix-pass-2.md) · [decision-four-open-calls-pass-2.md](./decision-four-open-calls-pass-2.md).

**Ground truth:** the front page as implemented in this repo — `app/[locale]/page.tsx` → `PaintingList` at `/` and `/en`; map at `/map`. Production hostname `acolorfulhistory.com` did not resolve from this agent environment (DNS failure), so live URLs below are the routes and components that render those pages, not a fresh production HTTP capture. Fix Pass 1/2 already live-checked `GET /en` against this same tree.

**Already closed in the document — confirmed, not re-opened:**

| Item | Still true? |
|---|---|
| WordPress Image sample retired (`primaryImageUrl` / `aspectRatio`; `artworkFields.proportion` only as a do-not-use warning) | Yes — §6 line 478, §14 line 784, §20 lines 1020–1029 |
| Logo shift `calc(100% - 318px)` | Yes — §5 line 448, §7 line 506, §13 line 773; `Logo.tsx` line 15 |
| ACH series tag hidden on list cards | Yes — `PaintingListMeta.tsx`; not a design-system topic |
| Josefin 500 actually loaded | Yes — `lib/fonts.ts` lines 18–23, weights `['500', '600']` |
| `docs/design/design-system.md` is a five-line stub | Yes — still points at `docs/design-system.md`; has not drifted back into a copy |

Panel top padding **112px** was ratified in [decision-four-open-calls-pass-2.md](./decision-four-open-calls-pass-2.md) §4 and is commented in `Nav.tsx` lines 188–195 (`pt-28`). It is **not** in `design-system.md` — the §4 spacing table still says `60px 30px 5px` (line 426). That is a remaining doc gap (Tier 2), not a re-litigation of 56 vs 112.

---

## Bottom line

The document is still a **port-era map-first style guide** with a handful of August 2026 patches (Payload field names, 318px logo shift, WordPress sample retired). Read top to bottom, it describes a different product than `/` and `/en`: a full-viewport grayscale map with a bottom thumbnail strip, Limelight as the only display face, and almost everything fixed-position and layered. The live front page is a **scrolling column of paintings** (Josefin titles, Barlow chrome, ColorLogo SVG), with the map at its own route.

**Typography is the bigger contributor to “the style guide feels off.”** Philosophy is the louder structural lie (wrong primary mode in the first paragraph), but Bernard’s read is about *style* — and the front page’s most repeated type is a font Section 3 does not mention, used in a role Section 3 assigns to Limelight. You can finish the Philosophy rewrite and the opening will stop describing a map; the type chapter will still teach a two-font system the homepage does not use. Fix both; lead with type if the goal is “the written style guide matches the site I am looking at.”

---

## Tier 1 — the document actively misleads

Places where `design-system.md` describes something materially untrue about the live site.

### 1. Philosophy’s “one primary mode” is the old landing page

**Doc:** §1 lines 9–11 — “map-first, artwork-centric experience”; “one primary mode: a full-viewport grayscale map with artwork pins, a bottom thumbnail strip, and a sliding panel nav. Everything is fixed-position and layered. The ‘list’ view is secondary.”

**Live:** `/` and `/en` render `PaintingList` (`app/[locale]/page.tsx` lines 27–34) — a single scrolling column of `ListCard`s, optional `HeroListItem` in slot 0. The map is `app/[locale]/map/page.tsx` → `MapExplorer` at `/map`, reached from the persistent-row Map/List pill (`NavPersistentRow.tsx` lines 55–99) and from the Browse group (`Nav.tsx` lines 24–30). `/series` redirects to `/` (`app/[locale]/series/page.tsx` lines 7–11). Homepage layout is a document (`min-height: 100vh`, padding, overflow), not a stack of `position: fixed` layers. The map strip (`MapNav`, 110px) exists only on `/map`.

**What Philosophy would need to say** (report only — not edited here):

- **Primary mode is the list.** The homepage *is* the catalogue: one scrolling column of paintings on `$surface-page`, each card an image + Josefin title + metadata line. Brief-hero-list-system §1 is the product sentence; the map-first sentence is retired.
- **The map is a parallel browse mode, not a secondary overlay on the same page.** Same collection, own route (`/map`), full-viewport grayscale Protomaps, pins, bottom thumbnail strip, filter tab. The visitor switches with the segmented Map/List pill (and with Browse → List / Map in the open panel). Memory of which browse they were in is what “Back to browse” returns to. The map is still the place-based instrument for the Berlin-local audience; it is no longer the first thing the site *is*.
- **Field / dense / fault still apply — restated for a list-first layout, not discarded.**
  - **Field zones** still hold: the homepage *is* a field. `.painting-list-page` plus `.zone-field` (`PaintingList.tsx` line 33, `globals.css` lines 1385–1395) — generous vertical padding (7rem / 8rem desktop), paintings sitting in near-nothing, `$surface-page` `#EDEDED`. The map at `/map` remains a field too (the whole viewport). Artwork-page hero is a field (`FieldZone` / `.artwork-field-zone`). “The map itself” is no longer the only, or primary, field example.
  - **Dense zones** still hold, almost entirely *off* the homepage: artwork page below the fault line (`DenseZone` / `.artwork-dense-zone`), Neighborhood copy, About/Store stubs. The list card’s metadata line is a small dense moment under each image, not a dense *page*.
  - **The fault line** still holds as the 2px charcoal + 1px cream rule (`FaultLine.tsx`, tokens `$ui-fault-heavy` / `$ui-fault-light`) and still “never sits at 50%.” It is **not** a homepage device. It marks the jump from painting-as-field to information on the artwork page (`ArtworkPage.tsx` line 143) and section breaks on Neighborhood (`NeighborhoodPageShell.tsx` lines 46–48, 148–150). The list-first layout does not have a page-level horizon; the paintings *are* the dense objects in a continuous field. Do not force a homepage fault line to keep the metaphor.
- **Voice paragraph (line 39) is the same mismatch in miniature:** “Limelight … appears only for city names and series titles, never in metadata or navigation.” True that it never appears in nav/metadata. Untrue that those are its live jobs on the front page — Limelight does not appear on `/` at all. Damask at 7% is specified here and in §17; it is not in the build (see Tier 1.7).
- **Commercial rhythm (line 41)** — “a new map pin, a new edition” — still fits the map, but the release also has to land as a new row in the list, which is what most visitors will see first.

### 2. Section 3’s two-font system does not describe the live type

**Doc:** §3 lines 148–186 — Barlow for all functional text; Limelight for city names, series titles, page headings, and artwork titles, “nowhere else.” Josefin is not named. Line 184: artwork titles on the detail page are Limelight `2.5rem`, no ornament. Line 330 table repeats that. §14 line 786: “Do not add a second typeface. Barlow Semi Condensed at varying weights is the entire type system” — internally stale even against §3’s own two-font rule, and now three fonts are loaded.

**Live fonts actually loaded** (`lib/fonts.ts`, applied on `<html>` in `app/layout.tsx` line 20):

| Face | Variable | Weights | Tailwind family |
|---|---|---|---|
| Barlow Semi Condensed | `--font-barlow` | 400–900 | `font-sans` (body) |
| Limelight | `--font-limelight` | 400 | `font-display` |
| Josefin Sans | `--font-josefin` | **500 and 600** | `font-card` (registered, **never used as a class**) |

**Josefin — every live render site (not just cards):**

| Surface | Selector / component | Size / weight | Route |
|---|---|---|---|
| List-card titles | `.painting-list-title` (`globals.css` 1773–1781), `ListCard.tsx` line 61 `<h2>` | `1.125rem` / 500 / tracking `0.015em` | `/`, `/en` — **this is the intended brief-09 exception** |
| Hero performance caption | `.hero-list-caption` (`globals.css` 1612–1620) | `0.9375rem` / 500 | `/` when a hero is mounted |
| Hero play hint | `.hero-list-play-hint` (`globals.css` 1500–1508) | `0.75rem` / 500 / lowercase tracking | `/` when a hero is mounted |
| Artwork timeline years | `.historical-date-year` (`globals.css` 1052–1060) | `1.25rem` / **600** | artwork pages with `keyHistoricalDates` (e.g. `/en/brandenburger-tor-1899`) |

Josefin has **crept past cards**. The creep is small and consistent (hero chrome + timeline years, not nav, not body, not page titles), but it is not “list-card titles only” as `lib/fonts.ts` line 17 still comments. `font-card` in `tailwind.config.js` line 75 is unused — Josefin is applied via the CSS variable in `globals.css`.

If the CMS `heroEligible` pool is still empty (Fix Pass 1: it was), production `/` will not show the hero Josefin usages; list-card titles and timeline years remain.

**Limelight — checked against §3’s “strict rules” list:**

| §3 promised context | Live? | Where |
|---|---|---|
| City names at display scale (hero `3.5rem` / section `2rem`) | **Partial, not on the homepage.** MoP / triptych city `h1`s use `font-display text-artwork-title` (2.5rem), not `display-hero` 3.5rem. `TriptychPageShell.tsx` lines 24, 40; `TriptychOverviewRow.tsx` line 41. No Limelight city name on `/`. |
| Series titles as page/section headings | **Yes, off-home.** `/en/series/mediums-of-perception` — `MoPOverviewPage.tsx` lines 18, 37. |
| Page headings — About, Contact, Store | **About and Store yes** (`PlaceholderPage.tsx` line 15, `font-display text-artwork-title`). **No Contact route.** Experience and Neighborhood use the same treatment (`ExperiencePageShell.tsx` lines 17, 31; `NeighborhoodPageShell.tsx` line 36). |
| Artwork titles on the detail page, `2.5rem`, no ornament | **No.** Overlay title is Barlow: `.title-block-text` `1.125rem` / 600 (`globals.css` 732–737), `TitleBlock.tsx`. Repeated in the dense zone as `.artwork-info-heading`, also Barlow `1.125rem` / 600 (`globals.css` 879–885, `InfoTab.tsx` line 56). Not Limelight, not 2.5rem. |

**Limelight extra (not in the strict list):** Neighborhood **price** is `font-display text-display-sm` (`NeighborhoodPageShell.tsx` lines 170–172) — §3 line 186 says Limelight is never used for prices. Neighborhood tier titles, pricing headline, and inquiry heading are also Limelight `display-sm`. Experience clip titles (`ExperiencePageShell.tsx` line 52) use `font-display text-section-title` — **`text-section-title` is not in `tailwind.config.js`**, so those get Limelight at unset/body size. Old `components/hero/HeroCopy.tsx` and `HomeSectionRenderer.tsx` still use `font-display`; they are not mounted on `/`. `/en/design-system` (`DesignSystemPreview.tsx`) still *teaches* Barlow + Limelight and never mentions Josefin.

**The actual current split (the open Bernard question, reported not decided):**

It is **not** a clean “Limelight for page/series-level headings, Josefin for card-level titles.”

- **Homepage (`/`, `/en`):** Josefin for card titles (and hero caption/hint if mounted). **Zero Limelight.** Barlow for metadata, nav, logo tagline/byline.
- **Artwork detail:** Barlow for the painting title (overlay + InfoTab). Josefin for historical-date years. Limelight unused.
- **Interior pages (About, Store, Experience, Neighborhood, MoP, triptych cities):** Limelight for headings, with TitleOrnament above several of them. Neighborhood also puts Limelight on a price.
- **Nav / map / chrome:** Barlow only.

So: Josefin is the **list (and a couple of related) title face**; Limelight is the **interior page/series heading face**; artwork-detail titles have been **pulled out of Limelight into Barlow** and the doc does not know that. That last point is as important as the Josefin exception. If Bernard locks “Josefin = cards only,” the rewrite still has to say what the artwork-page title is, because it is not Limelight `2.5rem`.

### 3. Artwork sizing §6 still describes map-thumbnails and a two-column detail page

**Doc:** §6 lines 463–476 — every thumbnail is `100px` tall × `100 * aspectRatio` wide; detail page “fills as much of `65vw` as possible on desktop, constrained to `90vh`”; §5 lines 450, 455 — desktop artwork is two-column `1fr 1fr`, image `max-width: 65%`.

**Live homepage:** brief-12 orientation caps + 85vh height cap + `--list-size-scale` (`lib/listImageSizing.ts`, `globals.css` 1689–1804). Landscape is further forced to the square cap (comment at 1729–1741 — deliberate, already flagged in Fix Pass 2, not reverted). Not 230px (brief-09, superseded) and not 100px.

**Live artwork page:** same list formula with a 1.08 bump and 92vh cap (`.artwork-field-zone`, `globals.css` 582–646) — “list-sized × 1.08, not full-bleed.” Single column: FieldZone (image + MiniNav) → FaultLine → DenseZone. Not `65vw` / `90vh`, not two-column.

**Still true of §6:** `aspectRatio` (not `proportion`) drives sizing; null → 1; never a fixed square crop. Map nav thumbnails on `/map` still use the 100px-height formula (`lib/mapArtwork.ts` `getThumbnailWidth`, `MapNav.tsx`). The 100px rule is a **map-strip** rule now, not a site-wide thumbnail rule.

### 4. §14 “What NOT To Do” still forbids the live homepage

Lines 786–792, checked against `/`:

| Prohibition | Live |
|---|---|
| “Do not add a second typeface. Barlow … is the entire type system.” | Three faces loaded. |
| “Do not add padding to `<body>`. All layout is via fixed-position elements. Body padding breaks the map-first layout.” | Homepage is a padded scrolling document (`.painting-list-page` padding 7rem / 8rem). The prohibition is true **of `/map`**, false of `/`. |
| “Do not add a footer. The map nav strip at the bottom IS the footer equivalent.” | Homepage has no strip and no footer. Strip exists on `/map` only. |
| “Do not apply background color to the map wrapper.” | Fine for `/map`. Irrelevant as a site-wide rule. |

An agent following §14 on the homepage would treat the list layout itself as a bug.

### 5. Component patterns §7 describe WordPress-era chrome, not the shipped header

**Toggle (lines 487–488):** “Custom SVG pill … viewBox `0 0 36 20` … Used for both Map↔List and EN↔DE.” **No such SVG exists in the repo** (search for `switch-svg` / that viewBox: zero hits). Live: EN⇄DE is plain text; Map/List is a two-segment charcoal pill (`NavPersistentRow.tsx` lines 41–99). The type-scale row “Map/List switch label `0.6875rem` / 800” (line 314) happens to match `text-switch-label`. The component description does not.

**Logo (lines 505–506):** tagline `0.75rem/400`, byline `0.5625rem/500/#000000`; “Logo + tagline + byline shift together as one group.” Live `tailwind.config.js` lines 78–79: `logo-tag` is **`0.875rem`**, `logo-by` is **`0.6875rem`**. `Logo.tsx` lines 44–66: tagline uses `text-logo-tag`; “Bernard Bolter” is **`text-[0.9375rem] font-bold`**. On open, the **wordmark** shifts `318px`; the tagline/byline stack **fades to `opacity-0`** (`Logo.tsx` lines 32–38) and does not travel. Fix Pass 2 + decision §3 ratified travel-together; current `Logo.tsx` is the fade. The rewrite needs to capture whichever of those Bernard still wants — the doc currently describes the ratified version, the file describes the fade.

**Hamburger (lines 484–485):** four spans, two narrow / two full, 1+3 rotate, 2+4 fade — **that mechanic is live** (`Nav.tsx` lines 133–156). Dimensions are not: button is `.nav-menu-toggle` **`2.5rem × 2.5rem`** (40px), not `30px`; it lives in `.nav-chrome-cluster` with the persistent row, not at `top: 10px; right: 20px` alone. Span animation is `duration-300`, not 0.22s.

**Nav panel:** doc §4 line 426 `60px 30px 5px`, §5 line 447 `300px` × `470px`, `$surface-nav` `#ECECEC`. Live: `bg-[#FBFAF7]`, `pt-28 px-6 pb-5` (112 / 24 / 20), `l:w-nav-panel l:min-h-[470px] l:h-auto` (`Nav.tsx` 176–195). Width 300px and min-height 470px still match; surface and padding do not. Persistent row, scrim `z-[90]`, Browse group — none of these are in §7.

### 6. Overlay rectangles are a load dissolve, not a hover, and not on list cards

**Doc:** §18 lines 936–972 — on hover, on the detail hero **and on artwork cards in any list/grid**; slide from nearest edge or fade; 300ms in / 200ms out; text inside “not yet decided.”

**Live:** `ArtworkImagePlaceholder.tsx` shows `overlayRects` while the image loads, then `artwork-overlay-rect-out` after `onLoad` (280ms delay). CSS is scale+fade (`globals.css` 130–145), not edge-slide. `ListCard.tsx` has **no overlay**. Hover on cards only tints the Josefin title (`globals.css` 1701–1703). No text in the rectangles. Artist-curated `overlayRects` data path is real (`ArtworkImage.tsx` passes `ach?.overlayRects`).

### 7. Damask §17 is specified as if it ships

**Doc:** lines 878–928 — `public/damask.jpg` at 7% in dense zones, 30/70 split, never behind artwork or the map.

**Live:** no `public/damask.jpg`, no `damask` string in `ts/tsx/css`. Dense zones are flat `$surface-page`. The 30/70 split and faded divider are unimplemented. Voice-of-interface (line 39) repeats the same claim.

### 8. File map §15 and several code samples are a previous repo

**Doc §15 lines 796–849:** `src/app/[lng]/page.tsx` is “home: Nav + Logo + FilterTab + Artworks (map)”; `ArtworkList.tsx` is the list view; Sass in `src/style/`; `vars.module.scss`; `src/svg/`.

**Live:** App Router at repo root (`app/[locale]/page.tsx` is the list). No `src/`. No Sass, no `vars.module.scss`. SVGs in `svgs/`. `proxy.ts` is the next-intl middleware (Next 16), not `middleware.ts`. §9 Tailwind sample `content: ['./src/**/*…']` (line 534) vs actual `tailwind.config.js` lines 4–7 (`./app/**`, `./components/**`, `./providers/**`). §10 still prints a full `vars.module.scss` spectrum export and a `:root` that includes **`--accent-gold: #E1B324`** (retired spectrum yellow). Live `:root` (`globals.css` 7–53) has the painting-palette-aligned tokens plus `--chrome-surface*`; no `--accent-gold`.

**§11 SVG inventory** still lists `src/svg/`, `FarbenLogo`, `Filter.js`, `Sort.js`, `mapPoint.js`, `magnifyMinus.js`, `toggleArrow.js` — none of those files exist. Live: `svgs/colorLogo.js`, `MapPin.tsx`, `MagnifyPlus.tsx`, `ShareSvg.tsx` (new), `SliderSvg.tsx`, `ARsvg.js`, `RightArrow.tsx`, `Enlarge.tsx`, `DE.js`, `US.js`. Flags are unused (EN⇄DE is text).

**§12 next-intl notes** still say replace `src/app/i18n/` and `useTranslation(lng, 'common')`. That migration has happened (`messages/en.json`, `i18n/request.js`, `proxy.ts`).

This is the same class of trap as the retired WordPress Image sample: an agent copying structure from the canonical doc will scaffold the wrong tree.

---

## Tier 2 — the document is silent on things the live site does consistently

Shipped patterns that never made it back into the canonical doc. Fix Pass 2’s 318px amendment is the model; these did not get that treatment.

### Type and chrome (front-page visible)

- **Josefin Sans** as a third face, with a documented scope. `lib/fonts.ts`, `tailwind.config.js` `font-card`, `.painting-list-title`. Brief-09 already decided this; `design-system.md` §3 never absorbed it.
- **List-card system** — image (brief-12 orientation caps, 85vh, `--list-size-scale`, landscape forced to square cap), Josefin title, one metadata line (place + year, series tag when informative, ACH series hidden), whole card one `Link`, no 40px offset. The front page *is* this component. The design system has no list-card section.
- **Chrome-surface** — translucent `$surface-page` pills behind logo, tagline, and the nav cluster (`.chrome-surface`, `--chrome-surface` / `--soft` / `--hover`, inner-only 2px radius). `globals.css` 15–17, 165–197; `Logo.tsx`, `Nav.tsx`. This is the live header’s material. Not in the token tables.
- **Persistent header row** — language + Map/List pill on `/` and `/map`, “Back to browse” elsewhere. `NavPersistentRow.tsx`. Not in §4 layout measurements or §7.
- **Segmented Map/List pill** (charcoal active fill, `#888` inactive) vs EN⇄DE text. Distinct patterns; §7 still says one SVG for both.
- **Logo type scale as shipped** — tagline 0.875rem, byline label 0.6875rem, “Bernard Bolter” 0.9375rem/700 with tracking hover. §3 table still 0.75 / 0.5625.
- **Open-nav logo behavior as shipped** — wordmark translates 318px; tagline/byline currently fade. Document only the travel-together sentence.
- **Panel surface `#FBFAF7` and padding `112px 24px 20px`.** 318px made it into the doc; 112px and the cream slab did not. Spacing table still `60px 30px 5px`.

### Layout systems that replaced the port-era rules

- **Fill-by-constraint on the list and the artwork hero**, with orientation width caps (and the landscape=square-cap exception). §6 only documents map-thumb 100px and detail `65vw`/`90vh`.
- **Artwork page structure:** overlay Barlow title that can pass behind the image (`TitleBlock`), MiniNav under the painting, fault line, then InfoTab / stories / timeline. §5’s two-column 1fr 1fr is the previous page.
- **Homepage as a field, not a fixed map.** `.painting-list-page` padding, `zone-field`, no page-level fault line.

### Tokens and helpers that exist in code

- **`--chrome-surface*` CSS variables** in `:root`.
- **`PIN_PALETTE` / `decideColor()`** already draw from the painting accent list (`lib/mapArtwork.ts` lines 4–13). §2 lines 136–140 still say spectrum remains in `vars.module.scss` for `decideColor()` and that map pins “will migrate.” They have migrated; the Sass file is gone.
- **Small-caps as live metadata keys** — InfoTab `dt` (`globals.css` 895–901) uses the §3 small-caps metrics (`0.5625rem` / 700 / 0.18em / uppercase) in `$text-muted`, not `$paint-burnt-amber`. Neighborhood uses `.label-small-caps` (which *is* burnt-amber via `globals.css` 71–73) and then overrides many to `text-text-muted`. The dual use (amber vs muted) is the interesting live rule; the doc only specs amber-or-muted without saying which surface gets which.
- **Title ornament** is implemented (`TitleOrnament.tsx`, CSS in `globals.css` 87–122) and used on interior pages. City/series palette colors still not applied (defaults to near-black 55% / 20%) — that part of §3 is still accurate as “specced, not yet applied.” Missing: that ornament sits **above** several headings (`mb-4` then `h1`), not “immediately after the Limelight title” as line 240 says.

### Interior pages the file map does not know

- `/map`, `/neighborhood`, `/experience`, `/series/mediums-of-perception`, `/[slug]/ar`, `/design-system` (lab). Contact does not exist. `/store` and `/about` are coming-soon stubs with Limelight + ornament.

---

## Confirmed accurate

Sections that still correctly describe the live site, so the rewrite should not re-litigate them.

**Color tokens (§2 surfaces, text, UI chrome, status, painting palette).** Hexes match `tailwind.config.js` and `globals.css` `:root`. ColorLogo letters match the logo palette table (including gate `#2A1545` on the last L of COLORFUL, HISTORY at charcoal 75%). `$paint-gate` is reserved in UI; the old six-state hero still contains a gate box (`HeroCanvas.tsx`) but that hero is not mounted on `/`.

**Fault-line construction.** 2px `$ui-fault-heavy` + 1px `$ui-fault-light`, implemented in `FaultLine.tsx` / `.fault-line-*`. Used on artwork + neighborhood, not the homepage.

**Barlow as the UI/body face.** Navigation, metadata, buttons, InfoTab, logo tagline. Loaded weights match the sample. Global font-smoothing (`globals.css` 56–59) matches §3.

**Limelight single weight, no bold/italic** — wherever it *is* used, it is `font-display` / weight 400.

**Breakpoint `l: 769px` only.** `tailwind.config.js` line 12. Mobile-first. Homepage, artwork, nav panel all key off it.

**Z-index numbers that still exist.** Map `1`, nav menu `100`, nav chrome `200`, filter `300`, popup `301`, map-nav `2100`, animation `10000`. Extra live layers not in the table (scrim `90`, MiniNav local, zoom/reveal `10002`) do not invalidate these.

**Map as a product (on `/map`, not `/`).** MapLibre + grayscale Protomaps URL (§12 line 754) is what `ArtworkMap.tsx` lines 38–40 request. Pins from painting-palette `PIN_PALETTE`. 110px strip, 5px gaps, proportion-width thumbnails, `translateX` nav. Filter tab: bottom-right, `max-height` 0→800px / 0.7s linear, 12×12 hard square, `decideColor` fill. Popup padding 5px / the documented box-shadow; click triggers `triggerArtworkAnimation` and routes — no `react-medium-image-zoom`. Do-not-switch-to-Leaflet still correct.

**Hamburger 4-span stagger mechanic** (not the 30px geometry).

**Nav open/close timing** `duration-fast` = 500ms ease-in-out. Logo left transition same. Toggle (pill) color 200ms.

**§3a rem vs px rule** as a principle (fonts in rem; borders/strip/pins in px). Live is messier at the edges (hamburger `2.5rem`) but the rule is still the right one to keep.

**Title ornament geometry** (70% width, diamond, 2px+1px rules, default near-black; city palette not applied). Component matches the CSS sample closely.

**Gate element §19** — still reserved, still not a general UI component. Correct as written. (Logo using gate as a letter color is already in §2.)

**Placeholder *intent* §20** — flat painting-palette color, not grey boxes, not gaussian blur. Color prefers `overlayColors[]`, fallback `#F4F2EE`. List kills Next’s blur with `.painting-list-image--blur { filter: none }`. **Mechanism** differs (1×1 `blurDataURL` on the list, wrapper+`onLoad` on the artwork page; `CITY_PLACEHOLDER` still exists in `lib/cityPlaceholder.ts` as a fallback despite the doc saying it is retired) — that is a remaining code/docs nuance, not a wrong intent.

**Payload field names in §6 / §20 / §14** after Fix Pass 1 — `primaryImageUrl`, `aspectRatio`, do-not-use `artworkFields.proportion`. Still the right contract.

**318px logo shift** — doc, decision, and `Logo.tsx` agree.

---

## Suggested next step

Ordered punch list for a **document rewrite** of `docs/design-system.md`. Do not mix Bernard’s Josefin-scope call into a mechanical cleanup of the file map. Do not restyle the front page to match the current document.

1. **Typography rewrite (§3, Voice, §9 `fontFamily`, §14 “second typeface”).** Lead with this. Write the live three-face system: Barlow = UI/body; Josefin = (scope TBD); Limelight = (scope TBD). Include the type-scale rows that actually ship (list title `1.125rem/500`, logo-tag `0.875rem`, overlay artwork title Barlow `1.125rem/600` — not Limelight `2.5rem`). Delete “Limelight nowhere else” and “do not add a second typeface” until they match the call. **Bernard input required** on Josefin scope:
   - *Narrow:* list-card titles only (brief-09 as written). Then hero caption/hint and `.historical-date-year` are documented exceptions to pull back, or to explicitly keep.
   - *List-adjacent:* cards + hero caption/hint + timeline years (what ships today).
   - *Card-level titles generally:* would imply moving the artwork overlay title from Barlow → Josefin, which the live detail page does *not* do.
   Also confirm whether artwork-detail titles staying Barlow is intentional (it displaces Limelight from the strict list) and whether Neighborhood prices in Limelight stay or revert to Barlow.

2. **Philosophy rewrite (§1).** Separate pass, after or beside type. Replace map-first / list-secondary with list-as-homepage, map as `/map` parallel browse, pill as the switch. Restate field / dense / fault for a scrolling list (homepage = field of paintings; fault line = artwork-page and interior section mark, not a homepage horizon). Update the audience “map as navigation by place” line so it points at `/map`, not at arrival. Drop damask from Voice until it exists.

3. **Absorb the shipped homepage + header into the canonical doc** (the Fix Pass 2 amendment pattern). New or rewritten sections for: list card; chrome-surface; persistent row + Map/List pill vs EN⇄DE; panel `#FBFAF7` + `112px 24px 20px`; logo type scale and open-state (shift vs fade — confirm current `Logo.tsx` fade against decision §3); fill-by-constraint sizing for list *and* artwork hero, including the landscape=square-cap exception as a documented choice. Put 112px in the §4 table the same way 318px was put in §5/§7/§13.

4. **Correct the leftover port-era traps in one mechanical pass** (no Bernard call): §15 file map → current `app/` / `components/` / `svgs/` / `proxy.ts`; §9 Tailwind `content` + `font-card` + live `logo-tag`/`logo-by`; §10 drop `vars.module.scss` and `--accent-gold`, document live `:root` including `--chrome-surface*`; §11 SVG inventory; §12 next-intl notes as done; §2 spectrum paragraph — pins already use `PIN_PALETTE`, Sass file gone; §7 retire the SVG toggle and 100px-as-universal-thumb; §14 split map-only prohibitions from site-wide ones; §18 overlay as load-dissolve on the detail image, not hover, not on list cards; §17 damask marked unimplemented (or cut from Voice until built); §5 drop two-column artwork; §6 scope 100px to `MapNav`.

5. **Lab page.** `/en/design-system` (`DesignSystemPreview.tsx`) still demonstrates Barlow + Limelight + ornament and never shows Josefin or a list card. Either update it in the same rewrite so it cannot re-teach the old system, or mark it internal and out of date.

Leave locked: painting-palette hexes, ColorLogo sequence, `l:` 769px, rem-vs-px principle, fault-line construction, gate reserved, MapLibre/Protomaps on `/map`, 318px shift, Payload `primaryImageUrl` / `aspectRatio`, stub at `docs/design/design-system.md`.

Live routes worth using as rewrite fixtures: `/en` (list + Josefin + chrome-surface, no Limelight), `/en/map` (the old primary mode, still correctly described once scoped), `/en/brandenburger-tor-1899` (Barlow overlay title, fault line, Josefin timeline years, overlayRects on load), `/en/series/mediums-of-perception` (Limelight + ornament), `/en/neighborhood` (Limelight headings and price), `/en/about` (Limelight stub).
