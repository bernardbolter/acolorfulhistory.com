# State of Play — and Where the Parts Don't Meet
## A Colorful History · direct commission business

*Written Sept 14 2026, at the end of a long working session. Supersedes parts of
`claude_trade-audit-and-site-map.md`, `claude_commission-funnel-research.md` and
`claude_direct-sales-plan.md` — see §4.*

*Part 1 is the summary. **Part 2 is the point of this document**: the places
where pieces designed separately don't yet connect.*

---

# 1. Where we are

## 1.1 The business

| | |
|---|---|
| **Model** | Direct to customer. Commissions are the revenue; prints are customer acquisition. |
| **Production** | 5–6 commissions scheduled, then painted in one batch during a San Francisco studio trip. Deposits (50%) collected before departure fund the trip. |
| **Commission tiers** | 80 cm / 30 in — **$800**  ·  50 cm / 20 in — **~$450** |
| **Ladder** | Published, counted in **trips** not paintings: trip 1 $800, trip 2 $1,100, trip 3 $1,400, trip 4+ $1,800 |
| **Modes** | **Yours** (client's own photograph) · **Found** (sourced from the archives) · **Taken** (Bernard photographs the place) |
| **Prints** | Set of five 140 mm squares, 6-up on A3, 270 gsm matte. First-order price; acquisition, not margin. |
| **Sources** | Turn-of-the-century, Wikimedia Commons, filtered hard to PD-old. `sourceLicense` becomes a gate, not a note. |

## 1.2 The transfer system

One image proportion — **√2 (1:1.414)** — with the short edge held at **~37% of
the canvas edge**, which is what sets how much canvas is left for the sky field.

| canvas | transfer image | from |
|---|---|---|
| 80 cm | 29.7 × 42.0 cm | A3, full bleed |
| 30 in | 11.0 × 15.6 in | Tabloid, long edge trimmed |
| 50 cm | 18.5 × 26.2 cm | A4, inset |
| 20 in | 7.35 × 10.4 in | Letter, inset |

All four within half a percentage point on both dimensions. The small tier is
literally the large tier scaled by 1/√2. Transfers are laser prints; print them
in Berlin and carry them, so the SF shed stays a painting space.

## 1.3 The two sites

**acolorfulhistory.com** — the shop. Classical historical-photo paintings,
commissions, print sets, and Mediums of Perception as demonstration plus prints.

**bernardbolter.com** — the archive, and now the home of the experimental work:
Mediums of War, Breaking Down Art, collector editions.

The test that decides every case, including future series: **a photograph of a
place, painted.** MoP passes. Gates passes whole. MoW fails — a photograph of
an *event*. Breaking Down Art fails — essays about art.

Mechanism: `SITE_SERIES_SLUGS` in `lib/siteSeries.ts`. Every artwork query on
ACH routes through it.

## 1.4 The site

**Homepage:** hero animation settles into one painting → fault line → three
funnels (commission · the set of five · browse the work) → newsletter band.
The painting list moves to `/paintings` with the filter bar finally switched on.

**Artwork page, thinned:** keep the historical dates timeline, drop the
older/newer story columns, promote `shareDescription` to carry the one-paragraph
job, make the archive link loud rather than a whisper — and use the reclaimed
space for the commercial ask the page currently lacks entirely.

**Wireframe:** published, four artboards.

## 1.5 The funnel

**City release cycle, two-monthly.** One research burst produces three outputs:
the commission photo pool, the Instagram content, and eventually the MoP
triptych. The photographs go live at research speed; the triptych floats.

**Instagram `@acolorfulhistory`** — separate from Bernard Bolter the artist so
it can be pushed commercially. Subject is the *photographs*, roughly 10:1
against paintings. Differentiator: every other account in the genre is an
archive where the photograph is the end. Here it's the beginning.

**Substack** — cadence is the city cycle, not the calendar. Bio link points at
the newsletter, not the shop. Signup incentives are digital (PD file sets) and
the street offer, never a free physical print.

## 1.6 The standing principle worth keeping

Derived four separate times today: **anything that depends on a painting being
finished should be able to ship without one.**

---

# 2. The seams

Ranked by consequence. These are integration gaps, not to-do items — each is a
place where two things we settled separately don't yet fit together.

## 2.1 There is no "studio period" anywhere in the data

The most important dynamic element on the homepage is meant to read:

> Next studio period: March 2027 · 4 of 6 slots open

Nothing in Payload holds a trip, a slot count, or which rung of the ladder is
current. The commission tiers, the batch model and the published ladder all
depend on this existing, and it is the one new concept the schema has no home
for. Everything else reuses fields that exist.

**Needs:** a small `StudioPeriods` global or collection — dates, city, slot
count, slots taken, current price per tier. It's also what the commission page,
the homepage block and the Substack all read from, so it's a single source
feeding three surfaces.

## 2.2 Two of the three commission modes ignore the city cycle

The city release opens a pool of sourced photographs — that is the **found**
mode, and only that one. **Yours** is not city-scoped at all: someone can send
a photograph of anywhere, at any time. **Taken** is city-scoped but by a
different constraint — Bernard has to physically be there, which realistically
means San Francisco and Berlin only.

So the marketing engine runs on cities while two thirds of the product doesn't.
As written, the plan implies all commissions are city-gated. They aren't.

**Needs deciding:** does the cycle govern only *found*? Are *yours* and *taken*
always-open? And is *taken* explicitly limited to SF and Berlin, or offered
anywhere with travel priced in?

## 2.3 The city cadence and the trip cadence don't align

City releases are every two months — six a year. Studio trips are two or three
a year. So there will be three city issues between trips, and trips with no
city release attached.

Which breaks the Substack's stated ask. "These photographs are open for
commission this cycle" only works if slots exist. Otherwise the letter opens a
pool nobody can order from, or slots open with no letter to announce them.

**Needs deciding:** either the letter's ask changes per issue (some issues open
slots, some just release photographs), or the cycles are deliberately
synchronised — e.g. every third city release is a trip release. The second is
cleaner and gives the year a visible rhythm.

## 2.4 A visitor meets two different triads

**Products:** historical photograph · present-day photograph · Mediums of
Perception.
**Commission modes:** yours · found · taken.

They nearly map onto each other and then don't: historical↔found,
present-day↔taken, MoP↔nothing, yours↔nothing. Two sets of three, overlapping
but not congruent, on the same site.

This is the most likely thing to confuse an actual visitor, and it's a
vocabulary problem rather than a structural one.

**Suggestion:** drop the product triad as *visitor-facing* language. It's a
useful internal sort and a good way to group `/paintings`, but the visitor only
needs one set of three, and the commission modes are the one that leads to
money. Let the categories be section headings on `/paintings` and nothing more.

## 2.5 Nothing measures the print-buyer → commission path

The path is designed: checkout asks which neighborhood is theirs, a card in the
box invites a commission, the Substack converts over months. But there's no
record linking a print order to a later commission inquiry, and
`commission-inquiries` as specced connects to neither Vendure orders nor
Substack subscribers.

Which means in a year's time the central question — *did the print set actually
produce commissions?* — will be unanswerable. Given the whole strategy rests on
prints being an acquisition line, that's the one number worth being able to see.

**Needs:** a `source` field on commission inquiries, and the neighborhood
question stored on the order rather than just printed on a card.

## 2.6 Currency has no single answer

Commissions are priced in USD to American buyers. Prints ship from Berlin and
will be priced in EUR. The site is EN/DE. Vendure holds prices; Payload holds
none by standing decision.

Not fatal, but it needs one decision rather than drifting: which currency is
authoritative per product, whether the EN/DE toggle also switches currency, and
whether the commission ladder is quoted in USD only.

## 2.7 Almost none of this has content behind it

Every section above is design. The content position:

- Berlin MoP triptych — not painted
- In-situ photographs of finished work — none exist anywhere
- The print set — untested on paper, unpriced, no sheet-yield or postal-class figures
- Studio period data — no schema, no records
- The inventory sheet — not built; the archive fetches are still unapproved
- `heroEligible` pool — four paintings have heroFields, which is enough

That isn't a criticism of the plan; it's the reason the build order puts
`/commissions` first. But it's worth seeing in one list, because the gap between
"decided" and "exists" is currently very wide.

---

# 3. What to settle at high level, in order

1. **Studio periods as a data object** (§2.1) — blocks the commission page, the homepage block and the Substack simultaneously.
2. **Synchronise the city and trip cycles** (§2.3) — probably every third city release is a trip release.
3. **Scope the three modes** (§2.2) — which are always-open, and where *taken* is available.
4. **Collapse to one visitor-facing triad** (§2.4) — the commission modes.
5. **Decide the measurement fields** (§2.5) before the store is built, not after.
6. **One currency decision** (§2.6).

None of these need code. All of them block briefs.

---

# 4. What the earlier documents still get right, and what they don't

| document | status |
|---|---|
| `claude_trade-audit-and-site-map.md` | The **audit** (§1–2) stands entirely — route inventory, the switched-off filter bar, the availability default, the mailto intake. The **route map** (§4) is superseded: no `/available`, no trade lane, and the series routes largely evaporate with the site split. |
| `claude_commission-funnel-research.md` | The research (§2) and the reframe (§3) stand. The designer/agent emphasis (§4) is superseded by direct-to-customer. The six-block page structure (§5.2) still holds, with the pricing block now carrying tiers and studio periods. |
| `claude_direct-sales-plan.md` | The burst sequence and the critical path (§1, §3) stand, including "commissions don't need Vendure." The ladder (§2) is superseded by the trip-based one. §5, the SF trip as production engine, is now central rather than a section. |

---

*Written by Claude, Sept 14 2026.*
