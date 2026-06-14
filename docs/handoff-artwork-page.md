# New Chat Prompt — Individual Artwork Page

Drop this at the top of a new chat in the A Colorful History project.

---

## What this chat is for

Design the Individual Artwork Page for A Colorful History. This is the most visited page on the site — every map pin, every list card, every triptych panel leads here. We need to work out how it composes visually and responsively before any component is built.

This is a design conversation first. Schema decisions will surface from it.

---

## Context

**A Colorful History** is the website for Bernard Bolter, Berlin-based artist. Mixed media paintings — acrylic photo transfers on canvas with bold painted acrylic fields. The site is map-first, multilingual (EN/DE), built on Next.js App Router + Tailwind (single breakpoint `l:` at 769px only) + PayloadCMS.

**Route:** `/artwork/[slug]`

**Entry points to this page:**
- Map pin click → artwork animation → lands here
- List view card click
- Triptych panel on MoP series page — if panel is clicked individually
- Related works on another artwork page

---

## What we know this page needs

**Full-bleed image** — As large as physically possible. Loading placeholder is city-mapped painting palette colour (Berlin → `#A8D6E8`, SF → `#B8B8BC`, Munich → `#F0E8C0`, Amsterdam → `#C4907A`). Overlay rects animate on interaction — 1–4 flat colour rectangles referencing the painted fields in that specific canvas, artist-curated positions stored in Payload.

**Metadata block** — Below the fault line (2px charcoal top / 1px cream hairline below, sits at lower third not 50%):
- Title in Limelight font with ornament
- Year, medium, dimensions
- City, country
- Series label (small caps, `$paint-burnt-amber`)
- Status badge — original available / sold / prints only
- Exhibition history

**Concept / context copy** — Series-specific. For MoP panels: the image capture technology label and historical context. Damask wallpaper texture at 7% in this section.

**Triptych link** — If this artwork has a `triptych` reference in Payload: a quiet *"Part of [Triptych title] →"* link leading to the full triptych page. This is how a map visitor who discovers one panel finds the full work.

**Related works** — Other artworks from same city or series. Max 4 cards.

---

## Design system essentials

**Two fonts:** Barlow Semi Condensed (all UI, body, metadata) / Limelight (titles, series headings — with ornament component: broken double rule, centered diamond ◆, 70% title width)

**Fault line:** 2px `#3A3F4A` top / 1px `#F0E8C0` hairline below. Always asymmetric — lower third, never 50%.

**Painting palette:**
- Field colours: `$paint-sky-warm` #A8D6E8, `$paint-sky-vivid` #4AAED4, `$paint-warm-white` #F4F2EE, `$paint-mid-grey` #B8B8BC, `$paint-charcoal` #3A3F4A
- Accents: `$paint-cream` #F0E8C0, `$paint-deep-gold` #E8C15A, `$paint-burnt-amber` #B8742A, `$paint-terracotta` #D4785A, `$paint-dusty-salmon` #C4907A, `$paint-burgundy` #8C3A42, `$paint-mid-green` #8BAF62, `$paint-forest-green` #2A4A28
- Gate element: `$paint-gate` #2A1545 — use once deliberately

**Image loading:** Flat painting palette colour fills space before image loads. Wrapper div approach, not Next.js blur.

**Small caps labels:** 0.5625rem / 700 / letter-spacing 0.18em / uppercase / `$paint-burnt-amber`

**What NOT to do:** Never sm/md/lg/xl breakpoints. Never px for font sizes. Never blur placeholder. Never old rainbow colours.

---

## Voice principles (from voice session)

Direct and technical about method. Expansive and quiet about time. Never tells the viewer what to feel. Dry, self-aware, not precious. The best unsolicited response about the work: people feel calm.

---

## Open design questions to work through

1. How does the full-bleed image work on mobile vs desktop — does it fill the whole viewport height, or does some metadata show immediately below without scrolling?
2. Where and how do the overlay rects animate on mobile (no hover)?
3. How does the triptych link present — how quiet is quiet? Where does it sit relative to the metadata?
4. What does the status badge look like — and does it have a buy/print CTA attached or is that separate?
5. Related works — grid or strip? How do they relate visually to the main image?
6. Does this page carry the damask texture, and if so where exactly?

---

## Files in this project

- `design-system.md` — full design system reference
- `design-system-visual.html` — visual reference
- `master-brief.md` — full project context
- `site-structure-handoffs.md` — all eight paths, Payload collections, JSON-LD
- `voice-and-hero-sequence.md` — voice principles and hero animation spec
- `schema-summary.md` — Payload collections decided so far
