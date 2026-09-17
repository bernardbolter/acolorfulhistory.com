# Brief 07 — Header & Nav Sequence Fix
## A Colorful History · acolorfulhistory.com

*Implementation spec for Cursor. Corrects the current hamburger build to match `brief-06-homepage-nav-revamp.md`.*
*Read alongside: `design-system.md` (Section 7 — Component Patterns, Section 8 — Animation Patterns) · `brief-06-homepage-nav-revamp.md` (Section 4–5) · `wireframes-homepage-nav.html`*

> **Amendment (Aug 25 2026):** Open-state logo shift is `left: calc(100% - 318px)`, not 270px — tied to the current `ColorLogo` SVG (298px + left chrome). Tagline + byline travel with the wordmark. See [decision-four-open-calls-pass-2.md](../artwork/decision-four-open-calls-pass-2.md) §§2–3.

---

## What's wrong with the current build

The hamburger open/close mechanic works — logo slide, panel drop, hamburger-to-× — but two controls that were meant to be **persistent** are currently only rendering inside the opened panel:

- The language switcher (currently flags — separately being replaced with plain "EN ⇄ Deutsch" text per the design system update)
- The Map↔List toggle (not in the build at all yet)

Per `brief-06-homepage-nav-revamp.md` §5, both belong in a **persistent header row** that's visible in the closed state, not something that only appears after the hamburger fires. Right now there's no way to switch language or view on a normal closed page.

The open-state link list is also currently flat (Home / Series / Mediums of Perception / Experience) and needs restructuring into three labeled groups (Browse / Series / More) per §4 of the same brief.

This brief covers the sequence and mechanics only. Component content (exact copy in each group, EN/Deutsch string source) is already resolved elsewhere — don't re-derive it here.

---

## Component inventory

| Element | Closed state | Open state |
|---|---|---|
| Logo + tagline + byline | Top-left | Top-right, shifted via existing `logo-menu-open` translation |
| Language switcher | Top-right, plain text "EN ⇄ Deutsch" | Same position, same control — does not remount |
| Context-aware slot | Map↔List toggle (on `/` and `/map`) or "back to browse" link (elsewhere) | Same slot, toggle label flips to reflect the *other* view (e.g. shows "List" once you're viewing Map) |
| Hamburger / × | 4-span hamburger icon | Spans rotate to × (existing mechanic, unchanged) |
| Nav groups (Browse / Series / More) | Not rendered | Slide/fade in below the header row |

**Critical build note:** the language switcher and context-aware slot must be a single shared component that persists across both states — not two separate instances (one for closed, one inside the panel). If it's remounted on open, you'll get a flash or jump as the DOM element is destroyed and recreated. Same component, same position in the row, just recalculated label/target.

---

## Sequence — what animates, in what order

Building on the existing timing table in `design-system.md` §8 (nav open/close 0.5s ease-in-out, logo shift 0.5s ease-in-out, hamburger spans 0.1s/0.2s staggered ease-in, nav spans on open 0.22s + stagger ease-in) — nothing here introduces new easing curves or durations, it only sequences the *existing* pieces plus the two new ones.

### On hamburger click (open):

1. **0ms** — Hamburger spans begin their rotate-to-× transform (0.1s/0.2s staggered, per existing spec). This starts immediately; it's the fastest-reading feedback that the tap registered.
2. **0ms, concurrent** — Logo + tagline + byline begin their shift to `left: calc(100% - 318px)` (desktop) — 0.5s ease-in-out. (Was written as 270px; superseded — value is tied to the 298px `ColorLogo` asset + chrome, not panel width.)
3. **0ms, concurrent** — The persistent row (language switcher + context-aware slot) does **not** move or restyle yet. It stays exactly where it is through the logo shift — it's anchored to the header edge, not to the logo, so it has no reason to travel. Its only change is the context-aware slot's label flip (Map → List, or similar), which can crossfade in place, timed to land around 250–300ms — after the logo shift is visually settled but before the panel finishes.
4. **~350ms** (once the logo shift is most of the way through, giving the row somewhere to land) — the nav panel container begins its drop/slide-in (0.5s ease-in-out, existing mechanic).
5. **~400–450ms**, inside the panel — the three groups' links animate in with the existing "nav spans on open" pattern: 0.22s duration per span, staggered. Stagger by group first, then by link within group, so **Browse** appears first, then **Series**, then **More** — reading top to bottom the same way the eye will read the finished panel, rather than every link firing at once.

### On × click (close): reverse order, not a mirrored animation

Closing should not simply play the opening sequence backward — that reads as sluggish, since the person is trying to exit, not admire the choreography. Recommended:

1. Nav links fade out fast, together, no stagger (~150ms) — they're leaving, not entering, so the eye doesn't need to track a sequence.
2. Panel closes (0.5s ease-in-out, same as open).
3. Logo returns to top-left (0.5s ease-in-out), hamburger spans reverse to the hamburger icon, concurrent with the logo's return.
4. Persistent row's context-aware slot label flips back, timed with the logo's return rather than waiting for it to fully land.

---

## Mobile

Per your note, this should carry over close to as-is. The one thing to verify once built: on mobile the panel is full-width rather than a 300px right-side slide, so confirm the persistent row (language + context slot) doesn't get visually swallowed by the full-width panel when it opens — it should still read as sitting *above* the panel, anchored to the header, not part of the panel's own content block. If the panel's top edge butts right up against the header row with no gap, add a thin `1px $ui-line` division so the two don't visually merge into one surface.

No new breakpoint logic needed — this rides the existing `l:` 769px breakpoint already governing panel width/position.

---

## First chat prompt for Cursor

```
I'm fixing the header/nav sequence for A Colorful History (acolorfulhistory.com).
I have a full brief at brief-07-header-nav-sequence.md — please read it in full,
along with design-system.md Section 7-8 and brief-06-homepage-nav-revamp.md
Section 4-5, before touching any code.

The current hamburger open/close animation works and should NOT be rebuilt from
scratch. What needs to change:

1. Extract the language switcher and Map/List toggle into a single shared
   component that renders in the persistent header row in BOTH open and closed
   states — currently they only exist inside the opened panel, which is wrong.
   Do not remount this component between states; it should persist across the
   open/close transition with only its label/target changing.

2. Sequence the existing animations per the brief's timing table: hamburger
   spans + logo shift fire together on open, the persistent row's label flips
   partway through, the panel drop follows after the logo settles, and the
   three nav groups (Browse/Series/More) stagger in group-by-group, not
   link-by-link across the whole list.

3. Closing should NOT mirror the opening sequence — nav links fade out fast
   and together, then the panel/logo/hamburger reverse together. See the
   brief's "close" sequence for exact ordering.

4. Restructure the open-state link list from its current flat list (Home,
   Series, Mediums of Perception, Experience) into the three labeled groups
   already specced in brief-06 Section 4.

Use the existing durations/easing from design-system.md Section 8 — don't
introduce new timing values. Verify on mobile that the persistent row reads
as sitting above the full-width panel, not merged into it.
```

---

*This brief covers sequencing and component structure only. Visual styling of the persistent row (spacing, exact type sizes) is already specced in design-system.md Section 3 (type scale) and Section 7 (Toggle Switch pattern) — don't redesign those here.*
