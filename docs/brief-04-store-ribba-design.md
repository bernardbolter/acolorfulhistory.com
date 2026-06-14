# Chat Brief 04 — Store & RIBBA Builder Design
## A Colorful History · bernardbolter.com

*Brainstorm and design decisions only — no build in this chat.*
*Read alongside: design-system.md · handoff-store.md · handoff-ach-schema-extension.md*

---

## What this chat is for

Resolving all design decisions for the store experience — the triptych print editions and the RIBBA small print set builder. This is a post-June feature but design decisions are made now so schema and architecture choices don't need revisiting.

This chat is largely independent of Briefs 01–03 and can run in parallel.

---

## Commerce architecture in brief

**Vendure** handles all transactions — prices, inventory, cart, checkout, order history. Payload holds artwork data and a thin set of commerce-facing fields. The two systems are loosely coupled — only three things cross the boundary:

1. `vendureProductId` stored in Payload — links a triptych or SmallPrint record to the Vendure product
2. `printAvailableCount` synced back to Payload via webhook on each sale — so pages render remaining count without a live Vendure API call
3. Payload document IDs passed as custom fields in Vendure order line items — so any order resolves back to the archive permanently

Prices never live in Payload. The add-to-cart button hits Vendure directly from the client.

---

## The two commerce products

### Product 1 — MoP Triptych Print Editions

Per triptych (one new city approximately monthly):
- **Original set** — three paintings sold together. Status: `original-available` / `sold`.
- **Large print edition** — A3, edition of 15. Hand-signed and numbered.
- **Small print edition** — A5, edition of 30. Hand-signed and numbered.

The triptych page (Brief 02) carries the primary CTA. The store may also have a dedicated page listing all available triptych editions across all cities.

### Product 2 — RIBBA Small Print Set Builder

Any 5 square paintings from the full archive (~80 available works across all series — New York, Amsterdam, San Francisco, Berlin). User selects 5, purchases as a pack at a fixed price.

The 5 selected Payload SmallPrint document IDs are passed as custom fields on the Vendure order line. Bernard fulfils by looking up those IDs — the full painting title, city, and series come from the Payload Artwork record via the SmallPrint relation.

---

## What has been decided

- No individual panel sales — triptychs sold as complete sets only
- SmallPrints are cross-series — any square painting, not MoP-specific
- `printAvailableCount` displayed on page, updated via Vendure webhook
- `signedAndNumbered: true` for all Bernard editions
- Order confirmation email lists the 5 selected painting titles (Vendure email template)
- No crop needed for small prints — `primaryImage` from archive used directly

---

## What needs deciding in this chat

### 1. Store entry point and page structure

Where does the store live in the site navigation? Options:
- Accessible from the map sliding panel nav
- A dedicated `/store` page
- The triptych page is the primary store experience — no separate store page needed
- All of the above

What pages exist in the store section?

### 2. Triptych editions listing page

If there is a page listing all available triptych print editions across all cities:
- How are they organised — by city, by release date, by availability?
- Does a sold-out triptych still appear? With what treatment?
- How much information per triptych — just the image and availability, or more?

### 3. Triptych edition CTA on the triptych page

The triptych page (Brief 02) carries the CTA for that triptych's editions. How does this sit on the page without overwhelming the artwork?
- What information is shown: original availability, print edition remaining counts, price (from Vendure), add-to-cart
- What happens when `printAvailableCount` reaches 0 — does the edition disappear or show as sold out?
- Is original and print edition presented together or separately?

### 4. RIBBA builder — entry and context

Where does the RIBBA builder live? Its own page, a section of the store page, or reachable from individual artwork pages for square paintings?

What context does a visitor need before engaging with it — what is a RIBBA set, why would they want one, what does it look like physically?

### 5. RIBBA builder — selecting 5 from 80

This is the core UX problem. 80 paintings across multiple cities and series. The user must select exactly 5. Questions:
- How are the 80 paintings displayed — grid, strip, grouped by city/series?
- Is there filtering — by city, by series, by colour?
- What does the selected state look like on a painting card?
- How does the user see their current selection — a persistent tray showing the 5 slots?
- What happens if they try to add a 6th?
- Is there a minimum (exactly 5, or up to 5)?

### 6. RIBBA pack preview

Before checkout, can the user see what their set of 5 looks like together? A small preview of the 5 selected paintings as a group? Or is the checkout confirmation sufficient?

### 7. Mobile RIBBA builder

On mobile, selecting from 80 paintings in a grid is a significant interaction. What is the mobile-specific treatment? How does the selection tray work on a small screen?

### 8. Sold out states

Three sold-out scenarios to design for:
- Original set sold — badge on triptych page, no CTA
- Print edition sold out — show remaining count reaching 0, edition retired
- RIBBA print sold out (individual `available: false`) — disappears from the builder grid silently or shows as unavailable?

### 9. The physical object — what does the page communicate

Bernard's prints are hand-signed and numbered. The RIBBA set has a specific physical format. What information about the physical object needs to be on the page to make the purchase feel meaningful — paper, process, framing, signing?

---

## Design system constraints (from design-system.md)

- **Field zone / dense zone** — the artwork image is always field zone. Commerce information is always dense zone. The fault line separates them. Commerce never sits in the same zone as the painting.
- **Quiet and authoritative** — this is not a conventional shop. The commercial rhythm is one new city per month as an event. The store should carry mild occasion without being precious.
- **Damask pattern** — appropriate in the store dense zone as period texture
- **`overlayColors`** — the 3 colours from each triptych's painted fields can accent the edition card for that triptych. Each city gets its own colour accent derived from the work.
- **Limelight** — city names in edition cards are Limelight moments

---

## Output expected from this chat

Written design decisions covering all nine questions above. The RIBBA builder selection UX (question 5) is the most complex problem and deserves the most attention. The relationship between the triptych page CTA and any separate store page (questions 1–3) is the second priority.
