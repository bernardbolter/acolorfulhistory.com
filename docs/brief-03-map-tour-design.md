# Chat Brief 03 — Map & Tour Design
## A Colorful History · bernardbolter.com

*Brainstorm and design decisions only — no build in this chat.*
*Read alongside: design-system.md · site-structure-handoff.md · handoff-ach-schema-extension.md*

---

## What this chat is for

Resolving all design decisions for the ACH map experience — the primary navigation mode for the site. The map is the homepage. Everything else is reached through it.

This chat can run in parallel with Briefs 01 and 02 — the map is largely independent of the artwork page design.

---

## The map in brief

A full-viewport map showing pins for every artwork in the ACH collection. Each pin represents one painting located at its depicted real-world location. Clicking a pin leads to the artwork page. The map is grayscale — the paintings supply colour. A bottom thumbnail strip and sliding panel nav layer over the map.

**Map library:** The existing implementation uses a map tile library (confirm which — Mapbox or similar) with grayscale tile styling.

**ACH schema fields that drive the map:**
- `lat` / `lng` — GPS position of the depicted location
- `mapPresence` — boolean, whether this artwork appears on the map at all
- `cityPlaceholderColor` — flat colour shown during image load, derived from city
- `overlayColors` — 3 hex values from painted fields, available for pin or panel accent colour
- `tourSequence` — position in city tour
- `grandTour` — boolean, included in Grand Tour
- `grandTourSequence` — position in Grand Tour sequence
- `tourStopCopy` — Bernard's text for this stop when in a tour

---

## What has been decided

- Map is the homepage — primary navigation mode
- Grayscale map tiles — paintings supply all colour
- Pins represent individual artworks, not cities
- `mapPresence: false` for all MoW (Mediums of War) works — they don't have real-world locations
- City placeholder colour during image load — flat colour div, no blur
- Bottom thumbnail strip exists
- Tour sequences stored in schema — city tours and Grand Tour

---

## What needs deciding in this chat

### 1. Pin design

What does a map pin look like? Options:
- Minimal dot in one of the artwork's `overlayColors`
- Small thumbnail of the painting
- A custom shape that references the fault line aesthetic
- Standard pin shape, coloured

On hover/tap — what changes? Does a preview appear?

### 2. Pin click — what opens

When a visitor taps or clicks a pin, what happens?
- Navigate directly to the artwork page
- Open a panel or card with a preview — image, title, city, status badge — with a link to the full artwork page
- Expand the bottom strip to show this artwork

### 3. Bottom thumbnail strip

The strip shows artwork thumbnails. Questions:
- Is it always visible or does it appear on interaction?
- Does it show all artworks or only those in the current map view?
- Does it scroll horizontally or show a fixed set?
- How does it relate to pin selection — does clicking a pin highlight the corresponding thumbnail?

### 4. Sliding panel nav

A panel slides in from one side. What does it contain?
- Full artwork list
- Series filter
- Tour selection
- All of the above

Where does it slide from — left or right? What triggers it?

### 5. Tour mode

When a city tour or Grand Tour is activated:
- How does the UI change to indicate tour mode is active?
- How does the user navigate between tour stops — next/previous, or map-driven?
- Does `tourStopCopy` appear as an overlay, a panel, or inline somewhere?
- How does the user exit tour mode?

### 6. Grand Tour vs city tour

Are these the same UI mode with different sequences, or do they feel different? The Grand Tour crosses cities — does the map zoom behaviour change to accommodate this?

### 7. MoP triptych pins

Each MoP triptych is three paintings but they depict the same location. Do all three panels share one pin, or does each panel get its own pin at the same coordinates? If one pin — what does clicking it show?

### 8. Mobile map

On a phone the map, thumbnail strip, and panel nav all compete for a 390px screen. What is the mobile-specific layout? Does the thumbnail strip collapse? Does the panel nav become a bottom sheet?

### 9. New city release moment

Bernard adds one new city approximately monthly. The new pin appearing on the map is an event. Is there any UI treatment for a newly released city — a subtle highlight, a recency indicator — or does it just appear like any other pin?

---

## Design system constraints (from design-system.md)

- **Grayscale map** — the map itself contributes no colour. Pins and UI elements can use `overlayColors` from artworks or neutral chrome colours only.
- **Limelight typeface** — city names on the map or in tour mode are Limelight moments
- **Field zone principle** — the map is the field zone. The thumbnail strip and panel nav are the dense zone. The fault line sits between them.
- **Damask pattern** — only in dense/information zones. The sliding panel nav interior qualifies. The map surface does not.
- **Quiet and authoritative** — the map UI should feel like a museum floor plan, not a navigation app. Minimal chrome, generous space.

---

## Output expected from this chat

Written design decisions covering all nine questions above. The pin design and pin-click behaviour are the most critical — everything else follows from those two decisions. Mobile map layout is the second priority given that most visitors will arrive on phone.
