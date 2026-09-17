# Addendum — Navigation Memory & TitleBlock Exclusion Zone
## A Colorful History · acolorfulhistory.com

*Brief 14. Closes brief-06 §5 (“back to browse — always `/` vs. remembers prior view”) and the unreconciled TitleBlock vs. persistent-header collision (brief-01 vs brief-06 §5).*
*Captured Aug 27 2026. Fixtures: `/en/map`, `/en/world-war-one`, `/en/vietnam-war-in-video-stills`.*
*Screenshots: [nav-memory-titleblock/](./nav-memory-titleblock/).*

---

## Bottom line

**Part 1.** `sessionStorage` key **`ach-last-browse-view`**. Visiting `/map` then an artwork, then “Back to browse,” lands on **`/en/map`**, not `/`. Cold / Share arrivals still fall through to `/`.

**Part 2.** TitleBlock was not a hand-picked list — it was a 616-cell integer-percent grid (`top` 8–35%, `right` 4–25%). The header’s live box is **241×51px EN / 277×51px DE**, `top: 10px`, flush right. On mobile that box covers most of a 390px row; Vietnam at `top: 13% / right: 5%` overlapped it. Overlapping cells (tops **8–19%**, 264 of 616) are removed from the seed set. Vietnam is now `20% / 25%`, **no overlap**.

Artwork pages also now mount `SiteChrome`. Without that, neither “back to browse” nor the collision existed on `[slug]` — chrome was missing from `app/[locale]/[slug]/page.tsx`.

Scroll/pan restore inside list or map is **not** built. Call it out later if wanted.

---

## Part 1 — Browse memory

### Key

`ach-last-browse-view` → `"list"` | `"map"`  
Helpers: `lib/lastBrowseView.ts`. Written in `NavPersistentRow` whenever pathname is `/` or `/map`. Read for the context-slot link on every other route.

Session-scoped, as recommended. Easy to swap to `localStorage` later.

### Before / after

| Step | Before | After |
|---|---|---|
| Visit `/map` | nothing stored | `sessionStorage['ach-last-browse-view'] = "map"` |
| Open `/en/world-war-one` | “Back to browse” → `/` | href **`/en/map`** |
| Tap the link | lands on `/en` (list) | lands on **`/en/map`** |

Verified (Puppeteer, desktop): `storedOnMap: "map"` → browse link `/en/map` → `pathname: "/en/map"`.

No stored value (first load this tab, or a Share landing) → `/`.

---

## Part 2 — TitleBlock exclusion

### Candidate set found in code (before)

`helpers/seededRandom.ts` `seededPosition(slug)` — **not** a named list:

```
topPct   = 8  + (hash % 28)        →  8–35%
rightPct = 4  + ((hash >> 4) % 22) →  4–25%
```

616 discrete cells. Applied as `%` of `.artwork-image-wrap` (`position: absolute; top; right`).

### Header bounding box (measured live, menu closed)

Same cluster geometry at both breakpoints; only the viewport changes. Artwork context slot (“Back to browse”), not the Map/List pill.

| | Desktop 1440×900 | Mobile 390×844 |
|---|---|---|
| Cluster EN | top **10**, bottom **61.2**, left **1198.8**, width **241.2**, height **51.2** | top **10**, bottom **61.2**, left **148.8**, width **241.2**, height **51.2** |
| Cluster DE | width **277.1**, left **1162.9** (“Zurück zur Übersicht”) | width **277.1**, left **112.9** |
| Hamburger | 40×40 at right | 40×40 at right |
| Image wrap (MoW square) | 1440×1440 @ (0,0) | 390×390 @ (0,0) |

Mobile needs its **own** exclusion: 277px of chrome on a 390px row, so the top-right seed zone overlaps the header **horizontally for nearly every `right%`**. Desktop square MoW already cleared the header vertically (8% of 1440 = 115px > 61px); short/landscape wraps and all mobile squares do not. One combined set (exclude if it hits **either** reference wrap) so SSR/client stay in sync — no `matchMedia` reroll.

Buffer **16px**. Title size from live Vietnam block (longest MoW): desktop 218×40, mobile 164×63; seed uses 220×48 / 168×64. Desktop wrap height **900** (viewport, conservative vs 1440 square) so landscape isn’t ignored.

### Adjusted set (after)

264 cells dropped — **all `top` 8–19%**. Allowed: **`top` 20–35% × `right` 4–25%** = **352** cells. Hash indexes the remaining list (`hash % 352`).

| Slug | Before | After | Overlapped header? |
|---|---|---|---|
| world-war-one | 18% / 4% | 20% / 10% | yes (mobile strip) |
| world-war-two | 16% / 14% | 27% / 22% | yes (mobile strip) |
| vietnam-war-in-video-stills | **13% / 5%** | **20% / 25%** | **yes — visible collision** |

Vietnam mobile before: title top **50.7px** vs header bottom **61.2px**, title under EN/DE + Back to browse.  
[vietnam-mobile-title-before.png](./nav-memory-titleblock/vietnam-mobile-title-before.png)

Vietnam mobile after: `top: 20%` → **78px**, header bottom 61.2, **overlap: false**.  
[vietnam-mobile-title-after.png](./nav-memory-titleblock/vietnam-mobile-title-after.png)

---

## Files touched

- `lib/lastBrowseView.ts` *(new)*
- `components/UI/NavPersistentRow.tsx`
- `helpers/seededRandom.ts`
- `app/[locale]/[slug]/page.tsx` (`SiteChrome` on artwork pages)
- Screenshots under `docs/artwork/nav-memory-titleblock/`

---

## Still open (not this pass)

- Restoring list scroll offset or map pan/zoom when returning to browse.
- `localStorage` instead of session if a longer-lived preference is wanted.
- AR route still has no site chrome (immersive) — unchanged.

---

*Suggested next: nothing blocking. Optional follow-up is in-view restore (scroll/pin) as a separate brief.*
