# Brief 11 — Hero Animation Fields (Payload Schema)
## A Colorful History · bernardbolter.com

*Implementation spec for Cursor. Schema-only — adds the fields `brief-hero-list-system.md` already fully specs, confirmed missing from a live inspection of the current ACH tab (Aug 2026).*
*Read alongside: `brief-hero-list-system.md` §4 (field definitions, full detail) and §6 (extraction pipeline) — this brief does not repeat that content, only implements it.*

---

## Why this brief exists

`brief-hero-list-system.md` was written assuming three ACH-tab fields (`heroEligible`, `heroFields`, `heroPhoto`) that a live schema inspection (Aug 2026) confirmed **do not exist** anywhere in the current Payload config. The live ACH tab has a related-but-different feature (`overlay.overlayRects[]` — simple artist-curated rectangles, unrelated pipeline, likely serving a different display purpose) and an unrelated `revealSlider` group (`transferImage` + `sliderAxis`). Neither of those is the hero animation's data source — **leave both untouched.**

Confirmed decision: the hero animation keeps its original polygon-fidelity design (true painted-field edges via `extract_hero_fields.py`'s flood-fill/contour pipeline), not a simplified rectangle-based approach. So the three fields need building as originally speced, not substituted.

---

## 1 · Fields to add — ACH tab

Add to the existing ACH tab on `Artworks` (inside the `ach` group, alongside `mapAndTour`, `overlay`, `revealSlider`, etc. — a new sub-group, e.g. `ach.hero`, keeps it consistent with how the tab is already organized per the live inspection).

| Field | Type | Definition |
|---|---|---|
| `heroEligible` | checkbox, default `false` | Only square paintings (`orientation: square`) with completed extraction. This is the random-draw pool for the homepage hero slot. |
| `heroFields` | JSON | Output of `extract_hero_fields.py`, pasted verbatim. Contains `photoRect` and `fields[]` — each field a normalized polygon (points 0–1), with centroid, bbox, and hex colour. Full shape documented in `brief-hero-list-system.md` §4 and §6. |
| `heroPhoto` | upload → media | The B&W source photograph, square export matching the painting's aspect, prepared specifically for the hero's full-frame opening state (phase A). **Distinct from `sourcePhotograph.sourceImage`** — that field holds the general ACH source photo (any aspect, any crop); this one is a deliberate square curation so the hero's opening frame is exactly what Bernard chose, not an automatic crop of a differently-composed image. |

## 2 · Validation

- `heroEligible: true` should be blocked by a `validate` hook unless both `heroFields` and `heroPhoto` are present — mirrors the existing pattern used for `arEnabled` requiring `arMarkerFile` elsewhere in this schema. Prevents an incomplete record from entering the random-draw pool and breaking the homepage.
- No enforcement needed on `heroFields`'s internal JSON shape at the Payload level — malformed JSON is a pipeline/authoring problem (caught by the `--debug overlay.png` visual check in the extraction script), not something to validate server-side.

## 3 · What NOT to touch

- Do not modify `overlay.overlayColors[]` or `overlay.overlayRects[]` — separate feature, already in use elsewhere, out of scope.
- Do not modify `revealSlider.transferImage` or `revealSlider.sliderAxis` — separate feature (slider-reveal interaction, unrelated to the self-painting hero sequence), out of scope.
- Do not modify `sourcePhotograph.sourceImage` or the `sourcePhotographs[]` array — `heroPhoto` is additive, not a replacement or reuse of these.

## 4 · Done when

- [ ] `ach.hero.heroEligible`, `ach.hero.heroFields`, `ach.hero.heroPhoto` exist on the Artworks ACH tab
- [ ] `validate` hook blocks `heroEligible: true` without both `heroFields` and `heroPhoto` present
- [ ] No existing ACH fields (`overlay`, `revealSlider`, `sourcePhotograph`, etc.) modified
- [ ] Confirmed via `/api/artworks?limit=1&depth=2` that the new fields appear in the API response shape as expected

---

## First chat prompt for Cursor

```
I need to add three fields to the ACH tab on the Artworks collection in
Payload (bernardbolter.com). Please read brief-11-hero-animation-fields.md
in full first, and brief-hero-list-system.md section 4 for the detailed
field shape reference (don't re-derive the design, just implement it).

Add a new sub-group ach.hero (consistent with the existing ach.mapAndTour,
ach.overlay, ach.revealSlider pattern) containing:
- heroEligible: checkbox, default false
- heroFields: JSON field
- heroPhoto: upload, relationTo media

Add a validate hook: heroEligible cannot be set to true unless both
heroFields and heroPhoto are present on the record.

Do not touch overlay.overlayColors, overlay.overlayRects, revealSlider, or
sourcePhotograph — these are separate existing features.

Confirm when done by hitting /api/artworks?limit=1&depth=2 and pasting the
ach.hero shape from the response.
```

---

*Captured August 2026. Prerequisite for the hero animation frontend build — nothing in `brief-hero-list-system.md` §1–3/§7 can be tested until these fields exist and at least one record (Brandenburg Tor) has real data in them.*
