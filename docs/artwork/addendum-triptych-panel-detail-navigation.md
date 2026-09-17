# Addendum — Triptych Panel Detail Navigation
## A Colorful History · bernardbolter.com

*Resolves two open items from handoff-mop-series-triptych.md and brief-02-triptych-page-design.md.*
*Read alongside: handoff-mop-series-triptych.md · brief-01-artwork-page-design.md (resolved) · ach-site-design-and-architecture.md · [addendum-triptych-series-cursor-audit.md](./addendum-triptych-series-cursor-audit.md)*

---

## What this resolves

1. Whether a triptych panel's detail view is a separate/lighter page or the regular artwork page.
2. What prev/next does on the artwork page when the current artwork is a triptych panel.

---

## Decision 1 — Panel detail is the regular artwork page, unmodified

Tapping a panel for detail (mobile: tap featured panel → "View full details →"; desktop: hover → "View details →") leads to the standard `/artwork/[slug]` page — the full ACH experience: floating title block, mini nav, zoom mode, reveal slider, AR section, duality mirror story columns, historical dates timeline, info tab, status badge, archive link.

*(Route note: this site builds the artwork page at `/[locale]/[slug]`, not `/artwork/[slug]` — same page, locale-prefixed App Router path.)*

**No separate or trimmed-down triptych-panel view is built.** Reasons:

- Panel-level data (`imageCaptureLabel`, `conceptCopy`, `sourceImage`, `overlayColors`, `arEnabled`) already lives on the individual Artwork record specifically so it has somewhere full to live — the artwork page is that place.
- A second detail view would either duplicate the artwork page's components or under-serve the panel relative to how it would appear from a map pin or list card. Both outcomes are inconsistent with archive-first architecture (no duplicated data paths) and with treating every Artwork record equally regardless of entry point.
- The triptych page's job stays composition-only: the three as one work, the technology arc, the commerce. The artwork page's job stays single-painting depth. No overlap.

The connection between the two pages remains exactly as already specified: a quiet "Part of [City] Triptych →" link on the artwork page, anchoring to `#commerce` on the triptych page, plus the mobile confirmation-overlay / desktop hover-link gesture on the triptych page itself to prevent accidental navigation away from the triptych composition.

---

## Decision 2 — Prev/next cycles within the triptych for MoP panels

When the current artwork is a triptych panel, prev/next on the artwork page cycles through the triptych's three panels in `triptychPosition` order, **wrapping**:

```
I  ↔  II  ↔  III  ↔  I
```

- From Panel I, “next” → II; “prev” → III
- From Panel II, “next” → III; “prev” → I
- From Panel III, “next” → I; “prev” → II

No dead ends at either end, and no fallback to generic "related works" logic for a triptych panel — the only adjacent works that make sense for a piece sold exclusively as part of a set are its own two siblings. This reinforces the triptych-as-one-work reading even while a visitor is deep inside a single panel's page.

For non-MoP artworks, prev/next continues to use whatever general adjacency logic already governs "related works" elsewhere — unaffected by this addendum.

**Implementation note:** No schema change. Computed purely from `triptychPosition` (I/II/III) and the `triptych` relation already on the Artwork record — wrap is modulo arithmetic over the three positions.

---

## Build status (Aug 25–27 2026)

Verified in [addendum-triptych-series-cursor-audit.md](./addendum-triptych-series-cursor-audit.md) and [claude_addendum-artwork-page-fix-pass-1.md](./claude_addendum-artwork-page-fix-pass-1.md):

- Decision 1 — **lands.** Panel taps go to the standard artwork page; no trimmed panel view exists.
- Decision 2 gate — **lands.** `TriptychLink` mounts when panels (or a `triptych` relation) are available; non-panel pages stay clean.
- Decision 2 wrap — **fixed Aug 25** (modulo); **verified live Aug 27** on MoW panels World War One / Two / Vietnam (`I↔II↔III↔I`). Triptych collection still empty on public API — sibling fallback by series + `triptychPosition` supplies panels until the Triptych record is seeded.

---

*Resolved June 2026. Folds into handoff-mop-series-triptych.md and ach-site-design-and-architecture.md navigation structure at next consolidation. Checked into the ACH frontend repo Aug 25 2026 so future Cursor sessions can read it without an inline paste.*
