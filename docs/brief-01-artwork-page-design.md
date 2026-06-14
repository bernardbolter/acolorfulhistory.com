# Chat Brief 01 — Artwork Page Design
## A Colorful History · bernardbolter.com

*Brainstorm and design decisions only — no build in this chat.*
*Read alongside: design-system.md · handoff-artwork-page.md · handoff-ach-schema-extension.md*

---

## What this chat is for

Resolving all design decisions for the single artwork page before implementation begins. This page is the highest-traffic page on the site and the most compositionally complex. Every decision made here cascades into the triptych page, the map panel, and the store. Get this right first.

---

## The site in brief

A Colorful History is the series site for Bernard Bolter's Mediums of Perception series. Mixed media paintings — acrylic photo transfers onto canvas with bold painted acrylic fields. The UI is deliberately recessive: a quiet stage for the paintings. The paintings supply all the colour; the chrome stays neutral.

**Stack:** Next.js · Payload CMS · Cloudflare R2 · Tailwind · mind.js (AR)
**Languages:** EN / DE (Payload localization)
**Design system:** Field zones (sky-like, generous space) · Dense zones (information, tight) · The fault line (asymmetric horizon between the two, double rule: 2px charcoal on top, 1px cream hairline below, sits at lower third not 50%)

---

## What has been decided

- **Image size:** 1600×1600px JPEG quality 60, Save for Web, sRGB, no metadata
- **Zoom:** The image must be zoomable to full pixel size with scroll/pan when screen is smaller than the image. This is a hard requirement.
- **Three-state reveal:** Source photograph → transfer on canvas → finished painting. Slider reveals between states. Axis (horizontal or vertical) stored per artwork.
- **Overlay rects:** 1–4 painted-field colour rectangles positioned over the canvas. Animate on hover (desktop) or on a trigger (mobile — not yet decided).
- **AR section:** Three buttons — Making / History / Freestyle. Each button has a poster image, a colour from the painting's `overlayColors` (3 stored per artwork), and opens a video. Only present when `arEnabled: true` on the artwork record.
- **Status badge:** `original-available` · `sold` · `prints-only` — displayed somewhere on the page.
- **Related works strip:** Max 4 works. At the bottom.
- **Wikipedia excerpt:** A Bernard-selected passage from the Wikipedia article for the depicted location. Displayed somewhere in the context section.
- **Key historical dates:** 3–5 dates Bernard selects. Displayed as a quiet timeline element.
- **Triptych link:** For MoP panels — a quiet link back to the parent triptych. Exact placement not yet decided.

---

## What needs deciding in this chat

### 1. Initial view — what is visible without scrolling

The zoom requirement means the image doesn't need to fill the viewport entirely — the user can zoom in. So the question is: what is the right initial composition on load?

Options on the table:
- Image at a comfortable size (say 70% viewport width on desktop) with title and key metadata already visible alongside or below
- Image large but not full-bleed, fault line and start of metadata block visible at bottom of viewport
- Something else

The two reference paintings for all layout decisions: **Brandenburger Tor 1899** (classical, perfected form) and **Kotbusser Tor 2018** (fault line pushed to extreme asymmetry).

### 2. Zoom container behaviour

- Does zoom happen in-place (image expands within its container) or does it open a lightbox/overlay?
- Pan behaviour on mobile — pinch to zoom, then drag to scroll?
- Is there a zoom affordance UI element or is it gesture-only?
- What happens to the page layout when the image is zoomed — does the metadata below shift or is the zoom contained?

### 3. Metadata layout

What lives in the field zone (above the fault line) and what lives in the dense zone (below)?

Fields available: title · year · medium · dimensions · city · series · `imageCaptureLabel` (MoP only) · `conceptCopy` · `wikipediaExcerpt` · `keyHistoricalDates` · `exhibitionHistory` · status badge · triptych link (MoP only)

### 4. Fault line placement on this page

The fault line is the asymmetric horizon. On the artwork page it separates the image/field zone from the metadata dense zone. Where does it sit? Does it sit below the image, or does the image cross it?

### 5. Overlay rect gesture on mobile

Desktop: hover triggers rect animation. Mobile has no hover. Options:
- Tap to reveal, tap again to dismiss
- Auto-play briefly on load (2s delay, then recede)
- Scroll-driven — animate in as image enters viewport

### 6. Reveal slider interaction design

Three states: source photograph → transfer → finished painting. How does the user navigate between them?
- Single draggable handle (shows two states at once — left of handle = one state, right = other)
- Two handles (one for each transition)
- Click/tap through the three states sequentially
- Something else

On mobile especially — how does the slider coexist with pinch-to-zoom on the image?

### 7. AR section layout on the artwork page

The AR section appears when `arEnabled: true`. It has three buttons (Making / History / Freestyle), each with a poster image and a colour. How does this section sit on the page? Where in the page order does it appear? What does it look like before any button is tapped?

### 8. Triptych link placement (MoP panels only)

The handoff calls this quiet — a reference to the parent triptych without being a banner. Options discussed: part of metadata block · its own thin full-width element above or below fault line · inline in concept copy. Where does it land?

---

## Design system constraints (from design-system.md)

- **Typography:** Barlow Semi Condensed for all functional text · Limelight (Art Deco) for city names and series titles only — never metadata or navigation
- **Fault line:** `2px #3A3F4A` top rule + `1px #F0E8C0` hairline below · always lower third asymmetry
- **Damask pattern:** 7% opacity · dense/information zones only · never behind artwork images
- **Colour palette:** UI chrome stays neutral — paintings supply colour · `overlayColors` from the artwork drive any accent colour on this page
- **Vertical padding:** Generous, almost uncomfortable — field zone principle
- **No blur placeholders:** City-mapped flat colour div during image load (`cityPlaceholderColor` from ACH schema)

---

## Output expected from this chat

A set of written design decisions covering all eight questions above, detailed enough that a Cursor implementation chat can build the page without guessing at layout or interaction. Rough layout description or ASCII wireframe is sufficient — no visual mockup needed unless it helps.
