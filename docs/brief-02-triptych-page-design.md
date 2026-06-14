# Chat Brief 02 — MoP Triptych Page Design
## A Colorful History · bernardbolter.com

*Brainstorm and design decisions only — no build in this chat.*
*Read alongside: design-system.md · handoff-mop-series-triptych.md · handoff-ach-schema-extension.md · brief-01-artwork-page-design.md (resolved)*

---

## Dependency

**Complete Brief 01 (Artwork Page Design) before starting this chat.** The triptych page inherits the single artwork panel view. Decisions about the zoom container, fault line placement, and metadata layout on the individual panel page all affect how the triptych page assembles the three panels together.

---

## What this chat is for

Resolving all design decisions for the MoP triptych page — the page that presents all three panels of one triptych as a single work. This is a distinct page from the individual artwork page, though the two are closely related.

URL pattern: `/triptych/[slug]` e.g. `/triptych/berlin-reichstag`

---

## The triptych structure in brief

Each MoP triptych is one city seen through three image capture technologies:

- **Panel I** — earliest known photograph of the subject (daguerreotype, wet plate, etc.)
- **Panel II** — historical colour lithograph or engraving
- **Panel III** — contemporary aerial or digital photograph

Each panel is an individual 1600×1600px painting. Each has its own Payload Artwork record with individual metadata — `imageCaptureLabel`, `conceptCopy`, `sourceImage`, `overlayColors`, `arEnabled` etc. The triptych record holds the shared concept copy and the commercial data (print editions, availability).

The three panels are always presented in order I → II → III. They are sold exclusively as a set — never individually.

---

## What has been decided

- **Three panels, individual artwork records** — all panel-level data (image capture technology, source photograph, concept copy, overlay colours, AR) lives per-panel on the Artwork record
- **Triptych-level concept** — the overarching concept copy for the triptych as a whole lives on the Triptych record, separate from per-panel concept copy
- **Commerce on the triptych record** — original set availability, print edition sizes (15 large A3 / 30 small A5), available count — all on the triptych, not per panel
- **Quiet triptych link from individual panel pages** — panels link back to this page (placement decided in Brief 01)
- **Print edition CTA** — this page carries the primary CTA for purchasing prints (connects to Vendure)
- **Status badge** — `original-available` · `sold` · `prints-only` at the triptych level

---

## What needs deciding in this chat

### 1. Primary presentation — how do the three panels sit together

The three panels are each square paintings. Together they could be presented as:
- A horizontal triptych (all three side by side) — natural reading order, but very wide, especially on mobile
- A vertical stack — mobile-first, loses the triptych-as-single-work reading
- A large featured panel with the other two smaller alongside or below
- Something that starts with one panel and reveals the others through interaction

What is the right primary composition for this page?

### 2. Individual panel detail — how much of the individual artwork page lives here

Each panel has its own `imageCaptureLabel`, `conceptCopy`, `sourceImage`, and potentially AR. Does the triptych page show:
- Just the three paintings and triptych-level content only — individual panel detail lives on the individual artwork page
- A summary of each panel's technology and concept inline on this page
- A hybrid — expand/collapse per panel for more detail without leaving the page

### 3. Navigation between triptych page and individual panel pages

How does a visitor move between the triptych view and an individual panel's full artwork page? Options:
- Click a panel image → go to individual artwork page
- Click a panel image → expand panel detail inline on this page
- Both — click image area = expand, click a detail link = go to full page

### 4. The source photograph reveal on this page

Each panel has a source photograph and a reveal slider (source → transfer → finished). Does the triptych page show any of this, or is the reveal slider only on the individual artwork pages? If it appears here, in what form?

### 5. Triptych concept copy placement

The triptych has its own concept copy — the overarching statement about this city and the three-technology arc. Where does this sit? Above the three panels, below, or interspersed? Does it relate to the fault line?

### 6. Commerce section

The print edition CTA lives on this page. For each triptych:
- Original set — `original-available` / `sold`
- Large print edition — remaining count of 15
- Small print edition — remaining count of 30

How does this section sit on the page without feeling like a shop? It needs to be present and functional without overwhelming the artwork. The fault line principle — field zone above (artwork), dense zone below (information including commerce) — probably applies here.

### 7. Mobile — three square paintings

Three 1600×1600px paintings on a 390px wide screen is a hard layout problem. What is the right mobile treatment? Full-width one at a time with swipe? Smaller thumbnails in a row with tap to expand? Something else?

### 8. Image capture technology arc

One of the most interesting things about the triptych is the arc from oldest to newest technology. Panel I = daguerreotype, Panel III = satellite. Does the page make this arc visually legible — a timeline element, technology labels, the source photographs shown small beneath each panel? Or is it communicated through text only?

---

## Design system constraints (from design-system.md)

Same constraints as Brief 01 apply here. Additionally:

- **Limelight typeface** — used for city names and series titles. The triptych title (city name) is a Limelight moment.
- **Fault line** — applies to this page as to all pages. Field zone = the three paintings. Dense zone = concept copy, technology arc, commerce.
- **`overlayColors`** — each panel has its own 3 colours. How these interact visually when three panels are shown together is a design question — three different colour sets in the same viewport.
- **Damask pattern** — appears in the dense/information zone of this page

---

## Output expected from this chat

Written design decisions covering all eight questions above, detailed enough for Cursor implementation. Particular attention to the mobile three-panel layout and the relationship between this page and the individual artwork page — the navigation model between them needs to be unambiguous.
