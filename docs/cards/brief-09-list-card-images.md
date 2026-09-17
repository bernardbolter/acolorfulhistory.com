# Brief 09 — List Card Anatomy & Images
## A Colorful History · acolorfulhistory.com

*Implementation spec for Cursor. Static list card only — no animation logic.*
*Read alongside: `brief-hero-list-system.md` (§7 frontend structure — this brief fills in the ordinary `list-item` card that section left undefined) · `design-system.md` (proportion system, spacing, typography) · `brief-06-homepage-nav-revamp.md` (spotlight card — explicitly out of scope here)*

> **Amendment (Aug 25 2026):** Series tag is shown when it is informative. Hide the primary ACH series (`a-colorful-history` / “A Colorful History”) — it is the site’s own name, not distinct metadata. Breaking Down Art and Gates of Perception still show. See [decision-four-open-calls-pass-2.md](../artwork/decision-four-open-calls-pass-2.md) §1.

---

## What this covers

`brief-hero-list-system.md` specced the homepage as a single-column list with a self-painting hero at slot 0, and named the components (`PaintingList.tsx`, `HeroListItem.tsx`) but deliberately left the **ordinary card** — what every non-hero list item actually looks like — undefined.

This brief closes that gap. Scope is the **static list only**:

- Card anatomy: image, title, metadata line
- Offset rhythm across the column
- Tap target behaviour

**Out of scope:** hero animation (slot 0 — covered in `brief-hero-list-system.md`), spotlight cards (covered separately in `brief-06-homepage-nav-revamp.md` §2, explicitly deferred). Build `HeroListItem.tsx` as a stub that renders this same ordinary card for now — no timeline, no field layer. It gets upgraded to the real hero treatment in a later pass.

---

## 1 · Card anatomy

Each list item, top to bottom:

| Element | Spec |
|---|---|
| **Image** | Fixed height **230px**. Width follows the artwork's `aspectRatio` field (width ÷ height) per the site-wide proportion system in `design-system.md` §6 — `width = 230 * aspectRatio`. Never a fixed square crop. |
| **Title** | **Josefin Sans**, below the image. This is a departure from `design-system.md`'s current rule (Limelight for all artwork/series titles) — confirmed decision: Josefin Sans for list-card titles specifically, chosen for its geometric sans character and Bauhaus/Erbar/Kabel lineage resonance with the Berlin material. Limelight is unchanged everywhere else (artwork detail page title, series headers, spotlight card city name). |
| **Metadata line** | Single line below the title: **place + year + series tag** — e.g. `Berlin, 1899 · Mediums of Perception`. Show the series tag when it is informative (Breaking Down Art, Gates of Perception, any future distinct series). **Exception:** hide the primary ACH series (`seriesSlug` `a-colorful-history`) — live `series.name` is “A Colorful History,” the site’s own name, so repeating it on nearly every card is noise, not metadata. Series tag uses the small-caps label treatment from `design-system.md` (`0.5625rem / 700 / letter-spacing 0.18em / uppercase`) but in **`$text-muted`, not `$paint-burnt-amber`** — the amber accent is reserved for spotlight card labels per `brief-06` §2, so the list card's series tag needs to read as neutral metadata, not a call-to-action. |

No dimensions, medium, or price on the list card — that's detail-page content per the existing artwork metadata pattern in `design-system.md`.

---

## 2 · Offset rhythm

- Ordinary list cards alternate **40px left / right** down the column, so it doesn't read as a rigid grid.
- **Hero item (slot 0) and spotlight cards are excluded from the offset** — both render full-width/centered. They're already visually distinct treatments (per `brief-hero-list-system.md` and `brief-06` respectively) and shouldn't also compete with the offset rhythm.
- Offset alternation restarts counting from the first *ordinary* card after slot 0 — i.e. slot 0 (hero) doesn't consume a position in the left/right sequence.

```
slot 0   — hero, no offset, full width
slot 1   — ordinary, offset left  (40px)
slot 2   — ordinary, offset right (40px)
slot 3   — ordinary, offset left  (40px)
...
```

If a spotlight card is later inserted at, say, position 4, it also sits un-offset and full-width, and the alternation resumes on the next ordinary card afterward from wherever it left off (not reset).

---

## 3 · Tap target

The **entire card is one clickable link** to the artwork detail page — image, title, and metadata line all inside a single `<Link>` / anchor, not separate clickable regions. Standard hover/focus state per `design-system.md` interaction patterns (no new pattern needed here).

---

## 4 · Data requirements

Per list item, pulled from the archive API:

- `title`
- `aspectRatio` (float, width ÷ height — Payload computed field)
- `imageUrl` (`primaryImage.url` at depth ≥ 2)
- `place` (`city`)
- `year` (`yearCreated`)
- `series` (`series.name`, for the metadata tag)
- `slug` (for the detail page link)

No new Payload fields required — this is a presentation-layer brief only.

---

## 5 · Component structure

Builds directly on `brief-hero-list-system.md` §7:

```
/components/home/
  PaintingList.tsx      — the column; owns offset alternation logic (skips hero + spotlight)
  ListCard.tsx           — NEW: the ordinary card (image, title, metadata, link) — this brief
  HeroListItem.tsx       — stub for now: renders <ListCard> with no offset; upgraded later
                            to the real self-painting treatment per brief-hero-list-system.md
```

`PaintingList.tsx` should track offset state by counting only ordinary `ListCard` renders — hero and (future) spotlight items must not advance or reset that count, per §2 above.

---

## 6 · Open items

1. **Josefin Sans weight/size** — needs a quick type-scale pass (weight, rem size, line-height) once real cards are on screen; not fully specced yet, use a reasonable default (e.g. 500, 1.125rem) and tune visually.
2. **Mobile offset behaviour** — whether the 40px offset holds at mobile widths or collapses to 0; not yet decided, flag as tunable.
3. **Empty/loading state** — skeleton treatment for cards while archive data loads; not covered here.

---

## First chat prompt for Cursor

```
I'm building the homepage list for A Colorful History (acolorfulhistory.com),
Next.js App Router + Tailwind. Please read brief-09-list-card-images.md in
full first, alongside brief-hero-list-system.md §7 for the component
structure this extends.

Build ListCard.tsx per section 1 of the brief: 230px fixed-height image
(width = 230 * artwork.aspectRatio), Josefin Sans title below it, and a
metadata line (place + year + series tag, small-caps, $text-muted). The
whole card is a single link to the artwork detail page.

Build PaintingList.tsx to render the column with 40px alternating left/right
offset per section 2 — hero (slot 0) and any future spotlight cards must be
excluded from the offset count, full-width/centered instead.

Stub HeroListItem.tsx to just render ListCard with no offset for now — do
NOT build any animation logic, that's a separate later brief.

Use design-system.md tokens for spacing, color, and the existing proportion
system — do not hardcode values outside the documented palette.
```

---

*Captured August 2026. Precedes the hero animation build pass — ships the static list first.*
