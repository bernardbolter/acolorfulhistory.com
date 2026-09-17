# Addendum — Painting/Source Info, Source Photograph Image, Stories, Timeline
## A Colorful History · acolorfulhistory.com

*Brief 16. Follows brief 15 (hero centering + MiniNav). Dense-zone remainder from the Aug 27 full-flow comp, plus a source-photograph thumbnail slot and the redesigned timeline.*
*Captured Aug 28 2026. Primary fixture: `/en/world-war-one`. Timeline layout checked on `/en/brandenburger-tor-1899` (the only live record with `keyHistoricalDates`). Viewports: desktop 1440×900, mobile **390×844** (not a resized desktop window).*
*Screenshots + metrics: [info-source-stories-timeline/](./info-source-stories-timeline/).*

---

## Bottom line

Painting and Source are **two columns with a thin rule**, not tabs. Photographer falls back to **Unknown**. Source image empty-state is the italic line **“Source photograph pending”** — no broken image, no empty box. Stories are two columns headed **“The Photograph”** / **“The Painting”**, both **“Not yet catalogued”** on live MoW. Timeline CSS is built; **it does not mount on any MoW record** because `keyHistoricalDates` is empty in Payload. Horizontal rail + mobile vertical rail were confirmed on Brandenburg 1899 at a real 390px viewport.

---

## Part 1 — Painting & Source info panels

Tabs are gone. `.artwork-info` is a two-column grid at `l:` (769px), single column below. Thin `1px` rule on the painting column’s right edge; no card boxes.

**Measured type (WWI, 1440×900):**

| | Spec | Live |
|---|---|---|
| Labels | `0.5625rem / 700 / 0.18em / uppercase` `$text-muted` | **9px**, weight 700, letter-spacing **1.62px** (0.18em of 9px), uppercase, `#777` |
| Values | `0.95rem` regular | **15.2px**, weight 400, `#3A3F4A` |
| Columns | two, side by side | `400px 400px` (800px dense column) |
| Tabs | none | `tabs: false` |

**WWI painting column (populated):**

| Field | Live |
|---|---|
| Heading | World War One |
| Year | 2022 |
| Medium | Acrylic Photo Transfer On Canvas |
| Dimensions | 80 × 80 cm |
| Series | Mediums of Perception · Panel I |

Medium is Payload’s slug `acrylic-photo-transfer-on-canvas`, run through the existing `formatMediumLabel()` helper (hyphens → title case). Not a new CMS label.

Series is the **live series name**, not the brief’s example “Mediums of War · Panel I”. Panel I is from `ach.mop.triptychPosition`.

**WWI source column (mostly fallback, as expected):**

| Field | Live |
|---|---|
| Heading | Source photograph |
| Photographer | **Unknown** (uncredited fallback — the Aug 18 audit finding, now built) |
| Technique | `[PLACEHOLDER] Black and white photography, WWI-era` — live `imageCaptureLabel` |
| Institution | omitted (field empty; no “Unknown” fallback — only photographer has one) |

Screenshots: [wwi-info-desktop.png](./info-source-stories-timeline/wwi-info-desktop.png) · [wwi-info-mobile.png](./info-source-stories-timeline/wwi-info-mobile.png) · in-page [wwi-info-stories-desktop-viewport.png](./info-source-stories-timeline/wwi-info-stories-desktop-viewport.png) · [wwi-info-mobile-viewport.png](./info-source-stories-timeline/wwi-info-mobile-viewport.png)

Mapper change: `ach.source` is **always** mapped, even with no `sourceImage`, so photographer / technique / institution can render. Previously the source object only existed when an image URL did.

City / place-of-making was on the old Painting-tab audit list. Brief 16’s painting column does not include it — not added.

---

## Part 2 — Source photograph image

Slot sits **above** the Source metadata, under the heading. Modest thumbnail (`11rem` wide, `object-contain`) — not a second hero.

**Live MoW:** all three records have no `sourceImage`. Empty state is the italic muted line **“Source photograph pending”**. No `<img>`, no missing-image icon, no empty frame.

Caption (institution — photographer) is wired for when an image exists. Example from the brief (“Imperial War Museum, London — photographer unknown”) will compose from the same fields as the metadata rows, not a second copy path. Not visible on MoW because there is no image yet.

### Decision — thumbnail tap?

**Skipped.** Not tappable. Easy to add a lightbox later; did not want to invent a second zoom surface next to MiniNav Reveal / Zoom without a lock. Flag if you want it in a follow-up.

---

## Part 3 — Stories

Two columns at `l:`, stacked on mobile. Copy as proposed:

| Column | Field | Heading | WWI live |
|---|---|---|---|
| Left | `olderStory` | **The Photograph** | *Not yet catalogued* |
| Right | `newerStory` | **The Painting** | *Not yet catalogued* |

Empty state is italic + `$text-muted`, same honesty as the source-image pending line. No blank gap, no lorem.

Screenshots: [wwi-stories-desktop.png](./info-source-stories-timeline/wwi-stories-desktop.png) · [wwi-stories-mobile.png](./info-source-stories-timeline/wwi-stories-mobile.png)

`olderStory` / `newerStory` remain empty on MoW (artist-authored; not invented). `conceptCopy` is still not mapped into these columns.

### Decision — heading wording?

**“The Photograph” / “The Painting”** is in the page as proposed. Headings are 1.125rem / 600 (same weight as “Source photograph”), not small-caps labels. Lock or rewrite before more records get story copy.

---

## Part 4 — Historical dates timeline

Built per the rail / tick / node / stem language. Even spacing along the rail (equal grid columns), **not** date-proportional. Nodes cycle `overlayColors`. Year is Josefin Sans 600 at 1.25rem. Per-date description + its own Wikipedia link.

| Viewport | Treatment | Confirmed |
|---|---|---|
| ≥769px | Horizontal 2px charcoal rail, square end caps, content alternates above/below | Yes — rail **800×2**, five equal columns `144px`, sides above / below / above / below / above |
| <769px | Vertical rail on the left, nodes on it, content to the right | Yes — at **390×844**, rail **2×489**, `display: block` |

### MoW — dates not in Payload

`HistoricalDatesTimeline` returns `null` when the array is empty. On `/en/world-war-one` (and the other two MoW panels) the section **does not mount**. No “dates pending” line — the brief didn’t ask for one. Say if you want the same quiet empty-state treatment as Stories.

WWI’s three dates (1914 / 1916 / 1918 or similar) are **not** in live `ach.location.keyHistoricalDates`. Nothing was invented.

### Layout proof — Brandenburg 1899

Only live ACH record with dates filled (five entries, each with a distinct Wikipedia URL). Used solely to confirm the rail, not as a MoW substitute.

Desktop: [brandenburg-timeline-desktop.png](./info-source-stories-timeline/brandenburg-timeline-desktop.png) · [brandenburg-timeline-desktop-viewport.png](./info-source-stories-timeline/brandenburg-timeline-desktop-viewport.png)

Mobile 390×844: [brandenburg-timeline-mobile.png](./info-source-stories-timeline/brandenburg-timeline-mobile.png) · [brandenburg-timeline-mobile-viewport.png](./info-source-stories-timeline/brandenburg-timeline-mobile-viewport.png)

| Year | Event (short) | Wikipedia | Node |
|---|---|---|---|
| 1791 | Gate completed by Langhans | Brandenburg Gate | `#87CEEB` |
| 1806 | Napoleon takes the quadriga | Battle of Jena–Auerstedt | `#B0B0B0` |
| 1814 | Quadriga returned; Schinkel | Karl Friedrich Schinkel | `#C87941` |
| 1961 | Wall built; gate isolated | Berlin Wall | `#87CEEB` (cycle) |
| 1989 | Wall falls; reunification symbol | Fall of the Berlin Wall | `#B0B0B0` (cycle) |

Marker X on desktop: 320, 484, 648, 812, 976 — **164px** apart. 1814→1961 is the same visual gap as 1791→1806.

---

## Flags / lock-ins

1. **Story headings** — “The Photograph” / “The Painting” is proposed copy, live now. Confirm or send replacements.
2. **Thumbnail tap** — skipped. Add later if you want a larger view without going through Reveal.
3. **Series string** — live data is “Mediums of Perception · Panel I”, not “Mediums of War”. CMS series name, not a frontend rewrite.
4. **Technique** — showing Payload’s `[PLACEHOLDER] …` string as-is. Replace in admin when ready.
5. **MoW timeline** — component ready; needs `keyHistoricalDates` seeded on the three panels before WWI’s three dates can appear.
6. **Timeline empty state** — currently absent (unmount). Stories and source image have quiet lines. Match or leave?
7. **Old pan/scroll-snap** — architecture previously said InfoTab/StoryColumns pan on mobile. Brief 16 stacks at 769px instead. Architecture table updated to match this brief.

---

## Files touched

- `components/Artwork/InfoTab.tsx` — two-column panels, thumb / pending, Unknown photographer
- `components/Artwork/StoryColumns.tsx` — Photograph / Painting headings, empty state
- `components/Artwork/HistoricalDatesTimeline.tsx` — rail timeline; even spacing; overlayColors
- `components/Artwork/ArtworkPage.tsx` — passes title, medium, dimensions, series, source, dates
- `lib/mappers/artworkFromPayload.ts` — always map `ach.source`
- `app/globals.css` — info, stories, timeline
- `docs/ach-site-design-and-architecture.md` — InfoTab / StoryColumns rows
- `docs/artwork/addendum-artwork-page-cursor-audit.md` — tab-switcher finding closed

---

*Suggested next: seed MoW `sourceImage` + `keyHistoricalDates` (and stories, when authored) on bernardbolter.com so the empty states on this page can be replaced with real content. Thumbnail lightbox only if you lock the tap.*
