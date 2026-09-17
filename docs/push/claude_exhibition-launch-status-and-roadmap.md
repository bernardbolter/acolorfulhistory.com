# Exhibition Launch — Status & Roadmap
## A Colorful History · acolorfulhistory.com

*Written Sept 1 2026. Reads across claude/site-scaffolding-status-aug2026.md
(Aug 25) plus everything decided since. Scoped to the three things needed
live for the exhibition: Mediums of War on the site, AR ready for those
paintings, and a store that sells the triptych print set.*

---

## The window

**7 days to Sept 9** (exhibition + Bernard's birthday, the launch moment
for paintings, website, AR, Instagram, and the print edition).
**10 days to Sept 12** (East Side Gallery performance, Berlin Art Week).

That's tight enough that this roadmap is written to be ruthless about
what's minimum-viable vs. what waits. Anywhere below says "cut for launch,"
that's a real option, not a suggestion to do everything anyway.

---

## Where things actually stand

| Piece | Status | What's actually blocking it |
|---|---|---|
| **MoW content in Payload** | Three stub records exist (WWI 242, WWII 243, Vietnam 245) linked to Triptych record 2, MoW nested under MoP. | Unknown whether the stubs have real images, dimensions, and copy filled in, or are still placeholders. This needs a direct check before anything else — see Phase 1. |
| **A route that shows MoW to a visitor** | Nav has a `#` stub for MoW; no real route exists yet. | This was explicitly queued as a separate pass after the homepage audit, never started. |
| **MoW triptych page** | Older architecture docs (handoff-mop-series-triptych.md, ach-site-design-and-architecture.md) say MoW gets the shared triptych template but explicitly **no AR, no store** — "replaced with a note connecting MoW to MoP." That's no longer the plan. | Nobody has rewritten that page spec to reflect AR + store now being in scope for MoW specifically. Real gap, not just a build gap. |
| **AR for MoW** | Existing AR schema (Group 6: `arEnabled`, `arVideos[].type` = making/history/freestyle) was designed for MoP panels. The MoW AR concept described in memory — passive cinematic Instagram-style video over the painting, plus interactive tap-to-reveal of source photos at Photoshop-extracted coordinates — is a different shape. | No brief exists for this version. It hasn't been decided whether MoW reuses the making/history/freestyle schema with different content, or needs its own field structure. |
| **MoW Instagram videos** | Format settled (3 per painting), cut sequences done for WWI videos 1–3, 27-shot master list exists. | Vietnam's source photographer is still unconfirmed, and footage is sourced from YouTube — full reshoot + close-up crops needed before that can be resolved. This blocks Vietnam's video, not WWI's or WWII's. |
| **Store — any product** | Nothing built. `handoff-store.md` is stale (June scope: Berlin/Munich MoP triptychs, two edition sizes each, A3+A5). Thin Payload schema exists (`Products`, `printSets`, `SmallPrints`) but no Vendure products, no store UI, no page. | Needs a fresh, narrowly-scoped brief for exactly one product: the MoW triptych set, 42×42cm per panel, edition of 10 + 1 AP, Hahnemühle Albrecht Dürer 210gsm. Not the June two-size structure — this is one size, one edition. |
| **Print production** | Canon PRO-1100 in house. MoW triptych edition specs locked. Berlin Wall 1961 print also ready to spec (edition of 10, A3, ~€50). | Test prints not yet run per the critical path (test prints → shoot → edit → website/AR). |
| **PPWR/LUCID compliance** | Registration on verpackungsregister.org required before the *first* sale ships, plus a dual-system provider (e.g. Grüner Punkt), ~€80/year. | Not started, and this has its own lead time separate from any dev work — worth starting this week regardless of where the store build lands. |
| **Style system doc** | design-system.md is mostly current (WordPress sample retired, nav values reconciled Aug 25) but Section 1 (Philosophy) still describes the old map-first paradigm, and Section 3 (Typography) doesn't mention Josefin Sans at all despite it being live on list-card titles. | Audit prompt for this is ready to hand to Cursor now — see the companion file, `claude_style-system-audit-prompt.md`. |

---

## Roadmap

### Phase 0 — Style audit (today, report-only, doesn't block anything else)

Hand `claude_style-system-audit-prompt.md` to Cursor. It's read-only — no
code changes, no risk to the exhibition timeline — and gives you and Cursor
a clean, current reference before the MoW pages and store get built against
it this week. Comes back same-day.

### Phase 1 — Confirm what's actually true about the MoW records (today/tomorrow)

Before writing any new brief: check the three Payload stub records (242,
243, 245) directly. Do they have `primaryImage`, dimensions, medium filled
in? Has an Art/Official session produced `olderStory`/`newerStory` for any
of them, or is that still open? This determines whether Phase 2 is "wire a
route to real content" or "wire a route + still need copy sessions in
parallel." Worth 20 minutes to know now rather than discover mid-week.

### Phase 2 — MoW route + triptych page (this week, Cursor build)

Rewrite the MoW section of the triptych page spec to reflect the actual
current plan (AR + store in scope, not the old "no AR, no store, just a
connecting note"), then hand that to Cursor alongside a real route
replacing the nav `#` stub. This can reuse the existing MoP triptych
template/schema — no new schema needed for the page itself, per
ach-site-design-and-architecture.md's own note that the triptych page's
data model is already fully covered by `printSets`, `imageCaptureLabel`,
`triptychPosition`, `concept`, and `sourceImage`.

**Fallback if the week runs short:** a plain triptych page with the three
paintings, concept copy, and a "prints available — inquire" line is a
legitimate minimum. AR and live checkout are the parts worth cutting first
if needed, not the page itself.

### Phase 3 — AR for MoW (this week, needs a decision before it needs a brief)

The open question is schema, not concept: does MoW's AR reuse the
`arVideos[].type` = making/history/freestyle structure with your three
Instagram videos mapped onto those three slots, or does it need its own
field shape for passive cinematic playback + coordinate-based tap-to-reveal?
Given the timeline, reusing the existing schema with the WWI/WWII videos
you already have cut sequences for is the faster path — worth deciding that
explicitly rather than defaulting into a new build.

**Fallback if the week runs short:** cinematic mode only (video plays over
the painting) is a real, demonstrable AR experience on its own. Tap-to-reveal
of source photos at coordinates is the part worth deferring past Sept 9 if
the Photoshop/ExtendScript coordinate workflow isn't done for all three
paintings by then.

### Phase 4 — Store: MoW triptych print set only (this week, Cursor build)

Not the June store brief — a narrower one. One product: the MoW triptych
set, 42×42cm × 3, edition of 10 + 1 AP, Hahnemühle Albrecht Dürer 210gsm,
hand-signed and numbered. Reuses the existing `printSets` array shape
(one entry instead of the large/small pair) and the existing
`vendureProductId` reference pattern. Needs a single Vendure product
created and wired — this is the piece with the least existing groundwork,
so it's the one to start on the moment Phase 1 confirms content is ready.

**In parallel, not blocking dev work:** start the verpackungsregister.org
registration this week. It has its own timeline independent of the build
and is a hard requirement before the first print ships, exhibition or not.

**Fallback if the week runs short:** a store section that shows the print,
the edition detail, and price with an email/inquiry path is a legitimate
launch state — full Vendure cart/checkout can follow within days of the
exhibition without costing the launch moment itself.

---

## What this roadmap deliberately doesn't cover

Map page brief-03, the RIBBA set builder, Neighborhood Commissions, and the
sort/filter UI stay exactly where the Aug 25 status doc left them —
untouched, not blocking, not worth pulling forward this week.

---

## Suggested order of operations, in short

1. Send the style audit to Cursor today (Phase 0) — no risk, runs in the
   background of everything else.
2. Spend 20 minutes confirming the real state of Payload records 242/243/245
   (Phase 1) before writing anything else.
3. Decide the AR schema question (reuse making/history/freestyle vs. new
   shape) — that decision, not more research, is what's blocking Phase 3
   from becoming a brief.
4. Write the two real briefs this week needs: the rewritten MoW triptych
   page spec (Phase 2) and the narrow MoW-only store brief (Phase 4).
   Conversationally first, same as always, before they go to Cursor.
5. Start the verpackungsregister.org registration in parallel — it doesn't
   compete with dev time.

---

*Written by Claude, Sept 1 2026. Companion file: claude_style-system-audit-prompt.md.*
