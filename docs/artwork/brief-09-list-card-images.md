# Brief 09 — List Card (Single-Painting Images)
## A Colorful History · acolorfulhistory.com

> **Superseded for field names and image sizing.** Use [`docs/cards/brief-09-list-card-images.md`](../cards/brief-09-list-card-images.md) for title/metadata/tap-target, [`docs/cards/brief-10-homepage-artwork-query.md`](../cards/brief-10-homepage-artwork-query.md) for `aspectRatio` / `primaryImage` / `series.name`, and [`docs/cards/brief-12-list-image-sizing.md`](../cards/brief-12-list-image-sizing.md) for list image caps. This copy still says `artwork.proportion` — that is the retired field name. Do not implement from this file.

*Older implementation spec. Covers ordinary single-painting list cards only.*
*Read alongside: `brief-06-homepage-nav-revamp.md` Section 3 (content model — resolved there, unchanged here) · `brief-hero-list-system.md` (slot 0 / offset dependency) · `design-system.md`*

---

## Scope

This brief covers the **individual painting card** — the repeating unit that makes up the homepage list. It does **not** cover:

- The MoP spotlight/triptych card (three-panel row) — separate component, separate brief, not started
- Breaking Down Art's card treatment — explicitly deferred per `brief-06` §2, no content exists yet
- Hero/slot-0 behavior — that's `HeroListItem`, which wraps this card once its animation resolves; this brief defines what it resolves *into*

Build the single-painting card now. Triptych and spotlight cards come later as their own components — don't generalize this one to anticipate them.

---

## Content — already resolved, restated for build reference

Per `brief-06-homepage-nav-revamp.md` §3:

- **Image** — always true proportion, never cropped to a fixed grid cell. Width = height × `artwork.proportion`.
- **Title** — see typeface decision below.
- **Place + year** — same pairing style as the hero's phase-A caption ("Berlin, 1899")
- **Series label** — small caps, `$paint-burnt-amber`
- **Status badge** — only when non-default. "Original available" renders nothing. Only sold/prints-only get a visible badge. Silence is the resting state — do not render an empty badge slot or placeholder for the default case.

Nothing else belongs on this card. Medium, dimensions, exhibition history, and everything else stay exclusively on `/artwork/[slug]`.

---

## New — title typeface

**Josefin Sans replaces Limelight for card titles.** Weight 600, `~1.4rem` (tune against the comp), letter-spacing `~0.015em`.

Reasoning: Limelight's art-deco character read as too costume-heavy for a repeating list element — fine as a one-off page heading, too much repeated dozens of times down a scroll. Josefin Sans comes from the same general early-20th-century geometric sans lineage (Bauhaus-adjacent, Erbar/Kabel-era) without the deco theatrics, which also happens to sit closer to the Berlin-rooted material than an American marquee face did.

**Scope note — not yet resolved:** this swap is confirmed for list cards. Whether it also replaces Limelight on the artwork detail page title, city names, and series titles sitewide is a separate, larger decision not made yet. **Do not remove or modify Limelight's existing usage elsewhere in the codebase as part of this brief** — only the list card title changes. Flag this scope question back to Bernard before touching any other Limelight instance.

`design-system.md`'s Limelight usage table will need a follow-up edit once the sitewide question is resolved — not part of this build pass.

---

## Layout — offset rhythm and spacing

Confirmed in this session, working values (tune in browser, not locked to the pixel):

- Alternating horizontal offset: roughly `40px` on every other card — not every card, alternating, so the column reads as a loose stagger rather than a rigid zigzag
- Image height baseline: `~230px` at this comp's scale — this was tuned at desktop width; needs a real mobile pass (see Open items)
- Vertical gap between cards: `~44px` in the comp — treat as a starting value
- Text block below image: series label → title → place/year, top to bottom, left-aligned under the image regardless of the image's own offset

None of these are final pixel law — they're the values reacted to and approved in this session. Tune against the real component in browser rather than treating them as hard tokens.

---

## Badge treatment

- Position: top-left corner of the image, inset `~8px`
- Style: solid `$paint-charcoal` background, light text, small caps, `~8px` type
- Copy: "Prints only" / "Sold" — exact wording per status; confirm final copy list against Payload's status field options before hardcoding strings

---

## Data dependency

Card component needs, per artwork: `image`, `proportion`, `title`, `city`, `country`, `year`, `series` (label + slug for link), `status`. All already exist on the base archive record or ACH tab per prior schema work — no new fields required for this build.

---

## Open items — not resolved in this brief

1. **Mobile offset behavior** — does the alternating stagger persist at narrow widths, shrink, or drop to zero? Not tested yet.
2. **Limelight scope question** — does the Josefin Sans swap extend beyond cards? Flagged above, needs a separate decision.
3. **Badge copy strings** — placeholder wording above, confirm against actual Payload status enum values.
4. **Hero settle target** — now that card geometry has a real baseline, `hero-timeline.ts`'s D-phase (settle) should be tuned against this component's actual rendered position/scale rather than the earlier placeholder value.

---

## First chat prompt for Cursor

```
I'm building the individual list card component for A Colorful History
(acolorfulhistory.com), Next.js App Router + Tailwind. I have a full brief
at brief-09-list-card-images.md — please read it in full, along with
brief-06-homepage-nav-revamp.md Section 3, before writing any code.

This covers ONLY the single-painting card — not the MoP triptych/spotlight
card, which is a separate component not started yet. Don't build anything
that tries to anticipate the triptych card's shape.

Build the card with: image at true proportion (width = height × proportion,
never cropped), series label (small caps, burnt amber), title in Josefin
Sans (weight 600, ~1.4rem — do NOT touch Limelight anywhere else in the
codebase, this swap is card-scoped only), place + year, and a status badge
that renders NOTHING for the default "original available" state — only
sold/prints-only get a visible badge, top-left inset on the image.

Use the offset/spacing values in the brief as a starting point (40px
alternating horizontal offset, ~230px image height baseline, ~44px vertical
gap) — these are approved starting values from a design review, not final
tokens, so structure the component so they're easy to tune in browser.

Card data needs: image, proportion, title, city, country, year, series
(label + slug), status. All exist on the archive record already — flag me
if anything's actually missing when you wire up the query.
```
