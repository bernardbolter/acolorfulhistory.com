# New Chat Prompt — MoP Series Page + Triptych Detail

Drop this at the top of a new chat in the A Colorful History project.

---

## What this chat is for

Design the Mediums of Perception series page and the individual triptych detail page. The triptych presentation is the most complex responsive design problem on the site — three 80×80cm square paintings that work as one work but are also individual pieces. We need to work out how these pages compose visually before any component is built.

This is a design conversation first. Schema decisions will surface from it.

---

## Context

**A Colorful History** is the website for Bernard Bolter, Berlin-based artist. Mixed media paintings — acrylic photo transfers on canvas with bold painted acrylic fields. Built on Next.js App Router + Tailwind (single breakpoint `l:` at 769px only) + PayloadCMS.

---

## The two pages

### Page 1 — MoP Series Overview
**Route:** `/series/mediums-of-perception`

**Purpose:** Present the full Mediums of Perception series as a growing body of work. Multiple triptychs in sequence. Sell prints. Mediums of War lives at the bottom as a discovered sub-path.

**Current triptychs:**
- Berlin, 2024 — originals available + prints for sale
- Munich — originals sold, prints available
- Future cities added monthly via Payload, no code change

**Mediums of War** sits below the triptych list, separated by fault line. Three paintings, no store, no map presence. It's the origin story of MoP — the first series to explore how image capture technology shapes historical memory. Subject matter (WWI, WWII, Vietnam) caused strong reactions that overshadowed the concept. MoP is the calmer, more focused evolution. MoW is discoverable here, not in the nav.

### Page 2 — Triptych Detail
**Route:** `/series/mediums-of-perception/[city]`
*e.g. `/series/mediums-of-perception/berlin`*

**Purpose:** Single triptych in full depth. The concept, the three panels, the AR experience, the store. Where a print gets purchased.

**The triptych:** Three 80×80cm paintings. Bernard thinks of them as one work but they are also individual pieces. Each panel depicts the same architectural subject through a different image capture technology:
- Panel I — earliest known photograph (daguerreotype / glass plate etc)
- Panel II — historical lithograph or engraving
- Panel III — contemporary aerial / digital photograph

Each panel has an AR layer (mind.js) — point phone at painting, choose from three videos: The Making, History, Freestyle (Bernard freestyles about the place).

**Mediums of War variant:** Same template, no store section, no AR section, replaced with a note connecting MoW to MoP.

---

## Key design problem — the triptych

Three square paintings, each 80×80cm, presented as one work.

**Desktop:** Three panels side by side — this works naturally.

**Mobile:** This is the problem to solve. Options to consider:
- Swipeable horizontal — feels native but loses the sense of one work
- Stacked vertically — shows all three but loses the triptych relationship
- One panel at a time with panel selector — focuses attention but hides the whole
- A zoomed-out view that shows all three small, tappable to zoom — preserves the whole

Bernard thinks of them as one work. The design should reinforce that while being usable on a phone screen.

---

## What the triptych detail page needs

**Triptych header** — City in Limelight large, year, status badge

**Three panel presentation** — The responsive problem above

**Panel labels** — Each panel: number (I, II, III) + technology label (e.g. *Daguerreotype, 1850*) + AR entry button

**Concept section** — Rich text, damask texture, the conceptual framework for this specific triptych. Historical context for the place and the photographs.

**AR section** — Prominent. Three video types described:
- *The Making* — animation of painting being built colour by colour
- *History* — history of place + history of camera that took the photograph
- *Freestyle* — Bernard raps the history
Main CTA → `/ar/[city]`

**Print store section** — Fault line separator. Two print set options:
- Large (A3) — edition of 15
- Small (A5) — edition of 30
Price, add to cart via Vendure, remaining edition count.

**Series navigation** — Previous / next triptych. Back to series overview.

---

## What the series page needs

**Series header** — Limelight title with ornament, series concept copy, damask texture

**Triptych list** — Ordered by `featuredOrder` in Payload. Each entry shows the triptych as a set — how? This is part of what needs designing. Options:
- Three panels shown together as a horizontal strip
- A single representative image with city/year prominent
- Something that conveys the triptych structure at a glance

**Status and CTA per triptych** — Status badge + print CTA + AR link

**Mediums of War section** — Below, separated by fault line. Intro connecting MoW to MoP. Three painting cards, no store.

---

## Design system essentials

**Two fonts:** Barlow Semi Condensed (all UI, body, metadata) / Limelight (titles — with ornament: broken double rule, centered diamond ◆, 70% title width)

**Fault line:** 2px `#3A3F4A` top / 1px `#F0E8C0` hairline below. Always asymmetric — lower third, never 50%.

**Painting palette:**
- Field colours: `$paint-sky-warm` #A8D6E8, `$paint-sky-vivid` #4AAED4, `$paint-warm-white` #F4F2EE, `$paint-mid-grey` #B8B8BC, `$paint-charcoal` #3A3F4A
- Accents: `$paint-cream` #F0E8C0, `$paint-deep-gold` #E8C15A, `$paint-burnt-amber` #B8742A, `$paint-terracotta` #D4785A, `$paint-dusty-salmon` #C4907A, `$paint-burgundy` #8C3A42, `$paint-mid-green` #8BAF62, `$paint-forest-green` #2A4A28
- Gate element: `$paint-gate` #2A1545 — use once deliberately per page

**Damask wallpaper:** Baroque pattern at 7% opacity in information-dense sections

**Image loading:** Flat painting palette colour (city-mapped) fills space before image loads. Wrapper div, not blur.

**Small caps labels:** 0.5625rem / 700 / letter-spacing 0.18em / uppercase / `$paint-burnt-amber`

**What NOT to do:** Never sm/md/lg/xl. Never px for font sizes. Never blur placeholder.

---

## Open design questions to work through

**Series page:**
1. How does each triptych entry present in the list — three panels or representative single image?
2. How does the list scale as more cities are added monthly?
3. How does the MoW section feel distinct without feeling like a different site?

**Triptych detail:**
1. The mobile triptych problem — swipe, stack, or something else?
2. How prominent is the AR section — does it compete with the store or lead into it?
3. How does the store section present the two edition sizes — which comes first, how is remaining edition count shown?
4. How does the concept section balance text-heaviness against the image-led rest of the page?

---

## Files in this project

- `design-system.md` — full design system reference
- `design-system-visual.html` — visual reference
- `master-brief.md` — full project context
- `site-structure-handoffs.md` — all eight paths, Payload collections, JSON-LD
- `voice-and-hero-sequence.md` — voice principles and hero animation spec
- `schema-summary.md` — Payload collections decided so far
