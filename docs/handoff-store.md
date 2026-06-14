# New Chat Prompt — Store / Print Page

Drop this at the top of a new chat in the A Colorful History project.

---

## What this chat is for

Design the store and print purchase experience for A Colorful History. The goal is a custom, considered presentation layer for the print editions — not a generic product page — that hands off cleanly to a standard purchase flow using the site's design system.

This is a design conversation first. Schema and Vendure integration decisions will surface from it.

---

## Context

**A Colorful History** is the website for Bernard Bolter, Berlin-based artist. Mixed media paintings — acrylic photo transfers on canvas with bold painted acrylic fields. Built on Next.js App Router + Tailwind (single breakpoint `l:` at 769px only) + PayloadCMS + Vendure (ecommerce engine).

The store is not a standalone browse page. Prints are reached through artwork and triptych pages. The purchase moment is contextual — the visitor already knows the work before they see the store section.

---

## June scope — what needs to be live

**Berlin Triptych print sets:**
- Large (A3) — edition of 15
- Small (A5) — edition of 30

**Munich Triptych print sets:**
- Large (A3) — edition of 15
- Small (A5) — edition of 30

Vendure handles the actual commerce engine. Payload holds a thin product reference (vendureProductId, type, active). The store UI is custom-built in Next.js, calling Vendure for price, availability, and cart.

---

## Post-June product — RIBBA set builder

Bernard makes many paintings as small prints sized for IKEA RIBBA frames (fits well, looks great grouped). Selling individually with shipping is too much leg work. The idea: a page where you select a set of 5 prints for a fixed price.

The interface is drag-and-drop — pick 5 from a grid, see them together as a framed set before purchasing. The act of curation is part of buying. This is deferred from June but should be designed now so the schema accommodates it.

---

## The design challenge

The tension to resolve: a custom, beautiful presentation of the print editions that feels as considered as the paintings themselves — and then a clean, trustworthy purchase flow that doesn't require reinventing checkout.

The reference is something like how a gallery presents a limited edition print — with weight, context, care — but without being precious or slow. Think Shopify's purchase flow logic (reliable, clear, trusted) expressed entirely in Bernard's design system.

**What the print store section needs to convey:**
- This is a limited edition — scarcity is real, remaining count matters
- The physical object — paper quality, print size, how it looks framed
- The edition context — what number in the edition, signed or not
- Clear path to purchase — no friction, no surprise

---

## Architecture

**Where the store section lives:**
Embedded in the triptych detail page (`/series/mediums-of-perception/[city]`), below the concept section, separated by fault line. Not a separate page for June.

**Post-June:** A `/store` page may make sense as the edition list grows. Not needed at launch.

**Vendure integration:**
- Vendure holds price, inventory, cart, checkout
- ACH calls Vendure API for: current price, edition remaining, add to cart
- Checkout redirects to Vendure-hosted or custom checkout flow styled to match design system
- Edition remaining syncs from Vendure → Payload via webhook (so Payload always shows accurate count without a live API call on every page render)

---

## Design system essentials

**Two fonts:** Barlow Semi Condensed (all UI, body, metadata) / Limelight (titles — with ornament: broken double rule, centered diamond ◆, 70% title width)

**Fault line:** 2px `#3A3F4A` top / 1px `#F0E8C0` hairline below. Always asymmetric — lower third, never 50%.

**Painting palette:**
- Field colours: `$paint-sky-warm` #A8D6E8, `$paint-sky-vivid` #4AAED4, `$paint-warm-white` #F4F2EE, `$paint-mid-grey` #B8B8BC, `$paint-charcoal` #3A3F4A
- Accents: `$paint-cream` #F0E8C0, `$paint-deep-gold` #E8C15A, `$paint-burnt-amber` #B8742A, `$paint-terracotta` #D4785A, `$paint-dusty-salmon` #C4907A, `$paint-burgundy` #8C3A42, `$paint-mid-green` #8BAF62, `$paint-forest-green` #2A4A28
- Gate element: `$paint-gate` #2A1545 — use once deliberately per page

**Small caps labels:** 0.5625rem / 700 / letter-spacing 0.18em / uppercase / `$paint-burnt-amber`

**Image loading:** Flat city-mapped palette colour, wrapper div approach, not blur.

**What NOT to do:** Never sm/md/lg/xl. Never px for font sizes. Never blur placeholder.

---

## Open design questions to work through

**Print store section:**
1. How are the two edition sizes (large/small) presented — side by side, stacked, tabbed?
2. How is remaining edition count shown — a number, a visual indicator, both?
3. What physical information needs to be shown — paper type, print process, framing recommendation?
4. Does the section show all three triptych panel images again as print previews, or reference the images already seen above?
5. How does the add-to-cart moment feel — is there a cart drawer, a confirmation state, something else?
6. How does checkout hand off — redirect to Vendure, or a modal/overlay?

**RIBBA set builder (design now for schema):**
1. The grid of available small prints — how does it display?
2. The drag-and-drop selection of 5 — what does the selected set look like before purchase?
3. How is the framed set previewed — flat lay, mock frame, something else?
4. Fixed price for any 5 — how is pricing shown before selection is complete?

**Vendure ↔ Payload sync:**
1. Webhook from Vendure on sale → updates `printSets[].available` in Payload
2. Payload serves the count on page render (no live API call needed for count)
3. Add to cart calls Vendure directly from the client

---

## Schema context — what's already decided

**Triptych collection** (in bernardbolter.com Payload):
```
printSets: array of {
  size: large | small
  edition: number (15 or 30)
  price: number
  vendureProductId: string
  available: number  ← synced from Vendure via webhook
}
```

**Products collection** (thin Payload reference):
```
triptych: → Triptychs
vendureProductId: string
type: print-set-large | print-set-small | ribba-set
active: boolean
```

RIBBA set builder will need:
```
smallPrints collection:
  image: R2
  title: localized
  city: string
  year: number
  available: boolean

setPrice: number (fixed, any 5)
```

---

## Files in this project

- `design-system.md` — full design system reference
- `design-system-visual.html` — visual reference
- `master-brief.md` — full project context
- `site-structure-handoffs.md` — all eight paths, Payload collections, JSON-LD
- `voice-and-hero-sequence.md` — voice principles and hero animation spec
- `schema-summary.md` — Payload collections decided so far
