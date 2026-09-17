# A Colorful History — Neighborhood Commissions Page
*Brief for building this page inside the ACH site project*

---

## Naming & URL — decided Aug 25 2026

**Nav label / page title: "Neighborhood Commissions."** Short, matches how the rest of the site's nav reads (Experience, Store, About — descriptive noun phrases, not full sentences). The "A Colorful History —" framing from the section below stays as page-level context/copy, not the literal label a visitor clicks.

**URL: `/neighborhood`.** Chosen over `/commissions` deliberately, so the offering can expand beyond San Francisco later without a URL change — a future second city doesn't force a rename or a redirect. Everything in this brief today is 100% San Francisco-specific (2559 27th Ave, SF interior designer, ArtSpan SF, City Art Gallery), so for now `/neighborhood` is a single page, not yet a `/neighborhood/[city]` pattern — no need to build the per-city routing until there's an actual second city to route to. If/when that happens, the natural move is to mirror the pattern already established for `/series/mediums-of-perception` → `/series/mediums-of-perception/[city]`: an overview at `/neighborhood` and per-city detail pages beneath it. Worth keeping that shape in mind during page design so today's single-city build doesn't paint itself into a corner, but not worth building the routing scaffolding for a hypothetical second city now.

---

## Naming (original)

**"A Colorful History — Neighborhood Commissions"** — kept inside the existing ACH series name, not a new standalone brand. Reads as a mature extension of established work, not a fresh side venture. Sits *inside* the ACH series presentation on the site (not a separate top-level section walled off from the art) — art first, commissions offer second, natural progression for a visitor.

---

## The core pitch

A native San Franciscan, based in Berlin, returns to SF regularly to paint custom, one-of-a-kind commissions rooted in a client's own neighborhood history — painted in the family shed studio (2559 27th Ave, Sunset District), delivered personally by hand, and permanently documented in Artism, the ongoing artist archive.

**The honest frame, worth carrying into the copy directly:** *"I live in Berlin, where I make more experimental, cutting-edge work. San Francisco is home — this is how I stay connected to it."* This isn't a weakness to hide, it's the differentiator. No repainting, no repeats — every commission is fully custom.

**Why this is credible right now, not just a claim:** the archive coming online at the same moment this offering launches isn't a coincidence to smooth over — it's the evidence. A 30+ year practice that has just built a permanent, structured, machine-readable record of itself is demonstrating exactly the kind of seriousness and foresight that makes a stranger's commission feel safe. Worth stating this plainly on the page, not just implying it: *this isn't a new artist asking for trust — it's a long practice finally showing its work.*

---

## Page structure — three tiers of entry

**Tier 1 — Browse unpainted historical photos.** A curated set of sourced-but-not-yet-painted SF neighborhood images. Visitor picks one; pre-approves the source material, speeds up and de-risks the commission for both sides.

**Tier 2 — Revisited subjects.** A small set of early historical photos painted years ago, now revisited with three more decades of practice. Copy needs to explicitly distinguish this from the "no repaints" rule: *the photo has history, the painting doesn't* — each new painting is a wholly new, unique work.

Draft copy direction:
> *A few historical photographs I painted years ago — I've returned to them now with three more decades of practice. Each new painting is entirely its own work, not a repeat, but a chance to do more justice to a subject I still think about.*

**Two real proof pieces for this tier:**
- **Piece A** — commissioned for a client's home via an SF interior designer, years ago. Contact/photo of the piece installed has been lost — worth a quiet, low-pressure attempt to track down (old email, invoice, the designer's name) before this page goes live, since finding it would yield both a photo and a second archive-ownership documentation story, same pattern as the City Art Gallery outreach. If not found in time, the piece can still be named plainly in copy without a photo: *"One of these was commissioned for a client's home through a San Francisco designer."*
- **Piece B — the strongest proof point available.** A revisited-subject painting selected for ArtSpan Selections 2017 (juried exhibition, part of ArtSpan's Annual Art Bridge Gala at Heron Arts) — and recently resold at auction. This single piece carries both juried critical recognition and real market validation. Full event record already exists at `bernardbolter.com/events/artspan-selections-2017-heron-arts` — worth linking directly from this page rather than re-describing it. The original 2017 sale ($800, led to a follow-up commission) is documented; the recent auction resale is not yet reflected in that event record and should be added when there's time.

**Tier 3 — Fully custom research.** For a neighborhood not yet represented, offer to research and source the right historical photo directly — general internet research plus a contact at the SF photo archive world. Deepest, most bespoke tier, likely the highest-value offering.

---

## Pricing

**Founding batch: 5 commissions, 36"×36", $1,800 each (direct/newsletter price).**

Framed explicitly on the page as intentional launch pricing, not the ongoing rate — protects future price increases from reading as a bait-and-switch. Suggested language: *"Founding collectors — first five commissions of the series, priced to start it."*

**Reasoning worth having in mind while writing the copy (doesn't need to appear on the page directly):** an old direct SF sale (~$800, roughly a decade ago) is far below what a mature, custom, hand-delivered, archive-documented commission is actually worth. A price that reads as too low signals *something's wrong with it* to a buyer with real money — it doesn't read as generosity. $1,800 is a confident, considered number backed by a real decade-long track record inside this specific series (ArtSpan selection, the auction resale, the designer commission) — not a guess, not an apology.

**Designer/agent-referred commissions:** hold higher, $2,500–$3,000+ — different buyer context, designers expect and mark up to gallery-adjacent pricing.

**Ongoing rate after the founding batch:** expected to move toward $2,500–$4,000+ direct, as delivered work builds a visible track record. Each documented delivery (photo, story, newsletter feature) does real pricing work for the next batch — don't need to state this on the page, just keep it in mind for how the founding-batch framing is worded.

---

## What the page should NOT do

- Don't undersell the offer with apologetic or hedging language around price.
- Don't bury the native-SF, decade-in-this-series, juried/auction facts — state them plainly, they're doing real trust work.
- Don't present the founding-batch price as "all it's worth" — frame it as a deliberate opening move.
- Don't let this page compete with or dilute the main ACH series presentation — it's an extension, reached naturally, not a wall between visitor and art.

---

## Practical/integration notes

- Vendure's role here is lighter than for prints/editions — no fixed stock, no fixed price. Realistically a deposit-taking mechanism once a commission is agreed (standard: 50% to start, balance on delivery), not a browsable "buy now" product. The actual intake (neighborhood, address, brief) needs its own lightweight flow — likely a simple form, not routed through the product catalog.
- A commission brief format is needed as its own small spec: room dimensions, wall photos, light direction, client's palette/mood, neighborhood/address, any existing pieces in the space. This is what makes remote-briefed, in-person-painted commissions actually workable from Berlin.
- Next SF trip (October) is the natural first production window — aim to have 1–2 commissions already booked from warm leads before arriving, so the trip has real production time rather than starting cold.

---

## Build status (ACH frontend)

Shipped Aug 25 2026 on acolorfulhistory.com:

- Route `/neighborhood` (reserved slug; nav under **More**)
- Page shell with pitch, three tiers, founding pricing, inquiry form
- Payload global contract `neighborhood-page` — see [neighborhood-payload-schema.md](./neighborhood-payload-schema.md)
- Static copy fallback until the global is seeded on bernardbolter.com
- Inquiry: mailto when `inquiryEmail` / `NEIGHBORHOOD_INQUIRY_EMAIL` is set; otherwise clipboard draft
