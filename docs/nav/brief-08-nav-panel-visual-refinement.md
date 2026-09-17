# Brief 08 — Nav Panel Visual Refinement
## A Colorful History · acolorfulhistory.com

*Implementation spec for Cursor. Refines the open-state nav panel's visual treatment.*
*Read alongside: `brief-07-header-nav-sequence.md` (sequencing/structure — unchanged by this brief) · `design-system.md` Section 7 (Component Patterns)*

> **Amendment (Aug 25 2026):** Panel padding is `112px 24px 20px` (`pt-28 px-6 pb-5`), not `56px 24px 20px`. Top padding has to clear the persistent header row, which sits *outside* the panel. See [decision-four-open-calls-pass-2.md](../artwork/decision-four-open-calls-pass-2.md) §4.

---

## What this covers

`brief-07-header-nav-sequence.md` fixed the *structure* of the open nav — persistent row surviving open/close, sequencing of the reveal, group-based link list. This brief covers what that panel actually looks like once it's open. Four changes:

1. Panel needs an actual surface + backdrop scrim (currently the links float directly on the page with nothing behind them)
2. Map↔List becomes a segmented pill control, not the on/off dot toggle used elsewhere
3. Group labels ("Series", "More") drop the burnt-amber accent color
4. Link list styling: right-aligned, no per-link divider lines, group divider rule sized to content rather than full panel width

None of this changes the sequencing, timing, or component persistence work from Brief 07 — it's a styling pass on top of that structure.

---

## 1. Panel surface + backdrop scrim

Currently the open nav has no background of its own — links sit directly on whatever page content is behind them (e.g. the artwork image), which reads as unfinished and competes for attention.

- **Backdrop:** full-viewport scrim, `rgba(0,0,0,0.45)`, sits behind the panel and above the page content (`z-index` per existing stack — see `design-system.md` z-index table, sits above `map`/`nav-menu` levels)
- **Panel:** `#FBFAF7` background (warm off-white, matches the site's `$paint-warm-white` family rather than pure white), anchored right edge, existing `300px` width / slide mechanic from `design-system.md` Section 5 — unchanged
- Panel padding: `112px 24px 20px` — top padding clears the persistent control row, which sits *outside* the sliding panel (`top-14` / `z-nav-chrome`). Literal 56px would put Browse under the hamburger. Horizontal (`24px`) and bottom (`20px`) unchanged.

This is additive to the existing panel geometry (width, height, slide-in mechanic) already specced — only the surface + scrim are new.

---

## 2. Map↔List — segmented pill, not dot toggle

The persistent row currently reuses the same on/off dot-toggle SVG pattern used elsewhere in the design system (Section 7 — "The Toggle Switch," used for EN/DE and originally proposed for Map/List too). For Map/List specifically, replace it with a **segmented pill** — two labeled segments, active one filled:

- Container: pill shape, `border-radius: 12px`, muted background (`#EDEBE4` or equivalent neutral surface tone), `2px` internal padding
- Active segment: solid dark fill (`#3A3F4A` / `$paint-charcoal`), light text, `border-radius: 10px` (slightly less than container for the inset look)
- Inactive segment: transparent, muted text color (`#888`)
- Both segments same font size as the EN/DE control next to it (`~9-10px`, matches the persistent row's existing type scale)

**Why the change:** a dot toggle reads as "flip a setting" (binary, either state equally weighted); a segmented pill reads as "pick one of two views," which better matches what Map/List actually is — always exactly one of two named states, not an on/off flag. Keep the dot-toggle pattern as-is for EN/DE, since that's a closer fit for a true binary switch.

This control does not change position or context-awareness logic from Brief 07 — same persistent slot, same rule (Map/List on `/` and `/map`, "back to browse" elsewhere), only its visual mechanic changes.

---

## 3. Group labels — remove accent color

"Series" and "More" currently render in `$paint-burnt-amber`. Change to:

- Color: muted gray (`#999` / `$text-muted`), not an accent color
- Weight/size/letter-spacing: unchanged (`9px`, `600`, `0.12em` letter-spacing, uppercase)
- Add a hairline rule directly above each label — see §4 for exact sizing

**Why:** reserves the accent palette for things that are actually interactive (links, active states) rather than spreading it onto static structural labels. The burnt-amber on a non-clickable label was implying interactivity that wasn't there.

---

## 4. Link list — right-aligned, no per-link dividers, content-width group rule

- **Alignment:** all link text right-aligned within the panel (`text-align: right`), matching the panel's anchor to the right edge of the viewport
- **No border between individual links.** Remove any per-row `border-bottom` — grouping is conveyed by whitespace alone:
  - `10px` vertical gap between links within the same group
  - `26px` gap between the last link of one group and the next group's label
- **Group divider rule:** the hairline sitting above each group label is **not** full panel width. It's sized to match the width of that group's single longest rendered label, right-aligned so it sits flush with the text edge above/below it rather than spanning the panel.

  **Implementation note — this must be computed, not hardcoded:** label lengths change per locale ("Mediums of Perception" vs. its German equivalent won't match in character count), so the divider width can't be a fixed px value tied to the English copy. Measure the actual longest rendered label in the active group at runtime (e.g. render labels first, measure via `getBoundingClientRect()` or use CSS `width: max-content` on a wrapper sized to content) rather than hardcoding per-group pixel widths. If a pure-CSS approach is cleaner, explore `width: fit-content` on an element that wraps the group's own text content so it naturally tracks whichever language is active.

---

## Component inventory (updated)

| Element | Spec |
|---|---|
| Backdrop scrim | `rgba(0,0,0,0.45)`, full viewport, behind panel |
| Panel surface | `#FBFAF7`, `300px` width (desktop, unchanged), `112px 24px 20px` padding |
| EN/DE control | Unchanged — existing dot-toggle pattern |
| Map/List control | New — segmented pill, active state filled dark |
| Group label | Muted gray, no accent color, hairline rule above sized to content |
| Link rows | Right-aligned, no dividers, `10px` gap within group / `26px` between groups |

---

## First chat prompt for Cursor

```
I'm refining the visual styling of the open nav panel for A Colorful History
(acolorfulhistory.com). This builds on brief-07-header-nav-sequence.md, which
you should already have implemented — the sequencing, persistence, and group
structure from that brief are NOT changing. I have a new brief at
brief-08-nav-panel-visual-refinement.md — please read it in full before
touching any code.

Four changes, all styling only:

1. Add a backdrop scrim (rgba(0,0,0,0.45)) behind the nav panel, and give the
   panel itself a solid #FBFAF7 background — currently it has neither, so
   links float directly on page content.

2. Replace the Map/List control's current on/off dot-toggle with a segmented
   pill (two labeled segments, active one filled dark #3A3F4A with light
   text, inactive transparent with muted text). Leave the EN/DE control's
   existing dot-toggle pattern unchanged — this swap is Map/List only.

3. Remove the burnt-amber accent color from the "Series" and "More" group
   labels — switch to muted gray (#999), same weight/size/letter-spacing.

4. Restyle the link list: right-align all link text, remove any per-link
   border-bottom dividers (use 10px gap between links in a group, 26px
   between groups instead), and size each group's divider rule to match the
   width of that group's longest rendered label — not the full panel width.
   This must be computed at runtime since label length varies by locale
   (EN/DE), not hardcoded to English string lengths.

Don't touch the open/close sequencing, timing, or the persistent component
structure from brief-07 — this is a visual pass on top of that, not a
structural change.
```
