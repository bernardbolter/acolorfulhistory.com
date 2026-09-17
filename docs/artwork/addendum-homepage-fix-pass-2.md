# Addendum — Homepage Fix Pass 2 (Allowlist Follow-Up + Nav Surface + List-Card Copy)
## A Colorful History · acolorfulhistory.com

*Scoped fix pass following [addendum-homepage-cursor-audit.md](./addendum-homepage-cursor-audit.md) and [addendum-homepage-fix-pass-1.md](./addendum-homepage-fix-pass-1.md). Allowlist rationale: [decision-keep-site-series-allowlist.md](./decision-keep-site-series-allowlist.md).*
*Captured Aug 25 2026. The four open calls from this pass are settled in [decision-four-open-calls-pass-2.md](./decision-four-open-calls-pass-2.md).*

**Not touched:** hero choreography / `HeroListItem` timeline, `HomeListControls`, MoP spotlight cards, a real Gates series page, Gates/BDA/MoW `#` nav stubs, placeholder mechanism, landscape width-cap override, default sort.

---

## Bottom line

Three follow-ups from the audit / Pass 1 are closed.

1. **Allowlist.** `mediums-of-perception` and `mediums-of-war` are in `SITE_SERIES_SLUGS` now, with a file-level comment explaining this is a *site-scope* list, not Payload `published`. Homepage count is still **76** (both series are empty today). `breaking-down-art` was already present — not re-flagged.
2. **Nav panel.** Solid `#FBFAF7` surface, no per-link chips, Browse group first (List / Map), tagline + byline travel with the wordmark. Logo shift is **318px**; panel top padding is **112px**. Both settled — not open mismatches.
3. **List cards.** One metadata line, no medium, place/year in `$text-muted`. ACH series tag still hidden. Josefin 500 is actually loaded. Landscape width cap left as-is (deliberate CSS comment; not reverted).

---

## Step 0 — Series allowlist

### What changed

- `lib/siteSeries.ts` now lists: `a-colorful-history`, `breaking-down-art`, `gates-of-perception`, **`mediums-of-perception`**, **`mediums-of-war`**.
- File comment (the actual fix): this is a site-scope allowlist because Payload `published` is archive-wide (~217 works). Add a slug here when a series is meant to appear on this site, even at 0 artworks. Points at [decision-keep-site-series-allowlist.md](./decision-keep-site-series-allowlist.md).
- `ACH_MAIN_SERIES_SLUG` is a standalone `'a-colorful-history'` const (not `SITE_SERIES_SLUGS[0]`), so reordering the list cannot silently retarget “hide the primary series tag.”
- `.env.example` comment updated to point at `lib/siteSeries.ts`.

`breaking-down-art` was already in the list (3 live works). No action.

### Confirmed (live Payload, Aug 25 2026)

| seriesSlug | Published docs | Homepage |
|---|---|---|
| `a-colorful-history` | 59 | 59 |
| `breaking-down-art` | 3 | 3 |
| `gates-of-perception` | 14 | 14 |
| `mediums-of-perception` | **0** | 0 |
| `mediums-of-war` | **0** | 0 |
| **homepage list** | | **76** (unchanged from Pass 1) |

Local `GET /en`: **76** `painting-list-item`, **0** `hero-list-item`. Adding two empty slugs did not change the rendered set.

Hero eligible query remains scoped to `a-colorful-history` (independent of this list).

---

## Step 1 — Nav panel

### Before (from the audit)

- Panel `bg-transparent`. Each link was its own `bg-[#FBFAF7]/80 backdrop-blur` chip; darkened page showed through the gaps.
- Padding `pt-32 px-6 pb-5` (128 / 24 / 20). No comment. Brief-08: `56px 24px 20px`.
- `NAV_GROUPS`: Series, More. `messages/en.json` `"browse": "Browse"` unused.
- Wordmark only shifted (`left-[calc(100%-318px)]`). Tagline + byline were a **separate** fixed stack that **faded to `opacity-0`** on open.

### What changed

1. **Solid surface.** `<nav>` is `bg-[#FBFAF7]`. Per-link chips and `backdrop-blur` are gone. Links are text on the panel. Scrim (`bg-black/45`) left alone.
2. **Padding.** Horizontal / bottom match the spec (`px-6 pb-5` = 24 / 20). Top is **`pt-28` (112px), not 56px.** Chrome (hamburger + persistent row) sits *outside* the panel at `top-14` / `z-nav-chrome`. Literal `pt-14` would put Browse under the hamburger. Comment in `Nav.tsx` records that. Desktop height is `min-h-[470px] h-auto` so the extra Browse group can grow past the old fixed `h-nav-panel`.
3. **Browse group** is first: List → `/`, Map → `/map`. Then Series, then More. Gates / BDA / MoW remain `href: '#'`.
4. **Logo + tagline + byline** are one `logo-chrome-stack` that shares the same `left` transition. Fade-out is gone. No documented reason for the fade (it was a chrome-overlap workaround); spec version shipped, flagged below.
5. **Logo shift stays `calc(100% - 318px)`.** Brief-07 / design-system specify `270px`. There was no comment and no visual-tuning commit. Reason to keep 318: `ColorLogo` is **298×25px** plus `1.25rem` left chrome padding ≈ 318px. `270px` would clip the wordmark into the 300px panel. Comment is now in `Logo.tsx`. Spec 270px should only land if the SVG is resized.

Left alone (audit already fine): scrim, muted group labels, right-aligned links, no per-link dividers, content-width group rule, Map/List pill vs EN/DE text, persistent-row no-remount.

### Confirmed

- EN `GET /en`: `"Browse"` in the document; `href="/en"` and `href="/en/map"` present; `bg-[#FBFAF7]` present; `backdrop-blur` absent from the page HTML.
- DE `GET /de`: `"Entdecken"` is the Browse label (`messages/de.json` already had it — not added this pass). `href="/de/map"` present.
- `GET /en/map` → **200**. List/Map in the open panel are the same routes as the persistent-row pill.
- No browser MCP in this session — open-panel screenshot not captured. Tagline travel, 318px shift, and 112px top padding were later ratified as final — [decision-four-open-calls-pass-2.md](./decision-four-open-calls-pass-2.md). Do not re-open as a visual-check item.

### Open panel — description

**Before:** links floated as separate frosted chips over the dimmed painting; two groups (Series, More); wordmark tucked right, tagline gone.

**After:** one cream slab on the right (full-width on mobile). Three groups, Browse on top (List / Map), then Series, then More. Wordmark + “The medium shapes the memory.” + “by Bernard Bolter” slide together. Links are plain type, right-aligned, no chips.

---

## Step 2 — List-card metadata + Josefin

### Metadata line

`PaintingListMeta.tsx` is one `<p class="painting-list-meta-line">`. Medium (`listMediumLabel`) is not rendered. Series tag is an inline `<span class="painting-list-series-tag">` after ` · ` when present. Place/year color is `$text-muted` (`#777`), same as the tag. Brief-09 small-caps treatment is now the spec values (`0.5625rem / 700 / 0.18em / uppercase`) rather than the previous `0.6875rem` / `0.16em` on a second line.

`listMediumLabel()` remains exported in `lib/listCardMeta.ts` for artwork-page use; the list does not call it. InfoTab still shows medium.

### Series tag — investigated, not flipped

Live `series.name` for the main catalogue is **“A Colorful History”** — the site’s own name. Brief-09’s example (`Berlin, 1899 · Mediums of Perception`) assumed a *distinct* series label. Showing “A Colorful History” on ~59 of 76 cards would repeat the site name, not add information.

**Left `listSeriesLabel()` hiding `ACH_MAIN_SERIES_SLUG`.** Settled as permanent in [decision-four-open-calls-pass-2.md](./decision-four-open-calls-pass-2.md) §1. Non-primary series still show.

### Confirmed on `GET /en` (76 cards, one meta `<p>` each)

| Card | After (visible line) | Series tag |
|---|---|---|
| ACH — *Brandenburger Tor. 1899* | `Berlin, 1899` | hidden (was never “Mediums of Perception”) |
| ACH — *Dennewitz Strasse 1905* | `Berlin, 1905` | hidden |
| BDA — *Venice Biennale 2007* | `Venice, 2007 · Breaking Down Art` | **shows** |
| BDA — *Soft Power, AKA Venice in the Middle* | `Berlin, 2025 · Breaking Down Art` | **shows** |
| BDA — *Münster* work | `Münster, 2007 · Breaking Down Art` | **shows** |
| Gates — *Anhalters Tor 2018* | `Berlin, 2018 · Gates of Perception` | **shows** |
| Gates — *Oranienburger Tor . 1867* | `Berlin, 1867 · Gates of Perception` | **shows** |

Counts: **59** lines with no ` · ` (ACH), **3** Breaking Down Art, **14** Gates of Perception = 76. **0** visible meta lines contain “A Colorful History.” **0** meta lines contain medium-ish words (Oil / Acrylic / Photograph / etc.). Second `<p class="painting-list-meta-line--series">` is gone.

**Before** (audit): two `<p>`s, e.g. place/year in `#666`, then a second line with medium + series tag. ACH had no series line; BDA/Gates had a second line.

### Josefin

`.painting-list-title` stays `font-weight: 500` / `1.125rem` (cards brief-09 default; weight is tunable). `lib/fonts.ts` now registers Josefin at **`['500', '600']`** so 500 is a real file, not a synthetic from 600. Size unchanged.

### Explicitly not in this step

- **Placeholder** still `blurDataURL` PNG on `next/image`, not brief-12’s CSS wrapper. Separate pass.
- **Landscape width cap** still forced to `--list-square-cap` (`app/globals.css` ~1254–1267) with comment “same display width as a square (not × aspectRatio).” That is a **deliberate visual choice**, not an accidental override of brief-12’s 100%. Do not revert without Bernard confirming. Portrait/square caps still follow brief-12.
- **Default sort / hero gated on `random`** — still coupled to hidden `HomeListControls`. Not touched.

---

## Open questions — settled

Ratified in [decision-four-open-calls-pass-2.md](./decision-four-open-calls-pass-2.md). Do not re-flag against brief-07 / brief-08 / brief-09 / design-system:

1. **ACH series tag** — hide. BDA and Gates show.
2. **Logo shift** — `calc(100% - 318px)`. Revisit only if the SVG is resized.
3. **Tagline travel** — intended final behavior; no further visual-check follow-up.
4. **Panel top padding** — `pt-28` (112px). Horizontal 24 / bottom 20 unchanged.

---

## Suggested next step

Do not mix these into a Pass 2 follow-up:

1. Seed a Payload `heroEligible` record, then a dedicated choreography pass (`HERO_DEV_FALLBACK_SLUG` locally until then).
2. Sort/filter UI — only after paint-year vs historical-year is decided.
3. Real Gates / BDA / MoW series routes (replace `#` stubs) and MoP spotlight cards — new pages/features.
4. Optional: brief-12 placeholder swap; landscape-width confirmation.
