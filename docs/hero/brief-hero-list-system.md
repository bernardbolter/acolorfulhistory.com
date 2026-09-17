# Brief — Homepage Hero System (list + self-painting first item)
## A Colorful History · acolorfulhistory.com

*Full system spec: concept, data architecture, extraction pipeline, animation mechanics, and the add-a-painting workflow. **Replaces all previous hero briefs** (`brief-hero-animation-build.md` and the v2 single-gesture revision). Read alongside: `design-system.md` · `site-structure-handoff.md` · `ach-schema-and-build.md`.*

---

## 1 · Concept

The homepage **is the list of paintings** — a single column, each entry a square painting with its info, with slight left/right offsets so the column doesn't read as a uniform grid. There is no separate hero section.

On arrival, the **top item performs the practice**: it opens as its bare black-and-white source photograph with only place and date, the painted colour fields fly in and land exactly where they sit in the real painting, the photograph settles into its position within the composition, and the whole stack resolves into the actual painting with its info faded in. Then it sits at the top of the list as an ordinary entry.

**Start = the photograph** (the raw material history handed over).
**End = the finished painting** (the destination of the animation is the destination of the site).

The painting that performs is **drawn at random per visit** from the pool of hero-eligible artworks. Only the first item animates — every other list entry is static. The gesture means something because one painting does it.

**Eligibility: square-format paintings only.** One spatial template for choreography, copy placement, and settle geometry; every painting inherits it with only its field data changing.

---

## 2 · The sequence

Timeline phases (GSAP, single timeline):

**A — Photograph.** Top item renders generously large (roughly 70–75vh square on desktop — tunable), showing the B&W source photo full-frame within the item. Caption only: place + year (from the artwork record — no per-painting copy to write).

**B — Fields fly in.** Each extracted field is an SVG polygon whose **destination is its extracted geometry**. Each starts with a randomized offset, scale, and rotation (randomization ranges are the choreography template — global, not per painting) and tweens to identity, staggered so each landing reads as a deliberate placement. Simultaneously the photograph scales/translates from full-frame into its `photoRect` position within the composition — the photo is being composed along with everything else.

**C — Resolve.** The instant the last field lands, the entire animated stack **crossfades to the real painting image** (the standard archive square). Figures painted around, canvas texture, true edges all appear — the approximation resolves into the truth. Extracted polygons only need to be accurate in motion, never at rest.

**D — Settle.** The resolved painting eases down from performance scale into list-item scale and position; info fades in beside/below it per the list layout. Short and quiet — a nudge into place, not a collapse.

Working copy during B (single thesis line, same for every painting — Bernard rewrites):
> A photograph transferred to canvas. The rest, painted.

Total autoplay length target: **3–5 seconds** A through D.

---

## 3 · Behaviour rules

- **Autoplay on load** (desktop and mobile — same timeline, no scroll dependency to start). Gate start on the photo image `decode()` so it never plays over a blank frame.
- **Un-paint on exit / repaint on return:** after settling, the hero item behaves like a list item, with one exception — as it scrolls out of the viewport, its fields lift off toward the photo state, tied to exit progress; scrolling back reassembles it. Applies **only to the hero item**; implement as its own ScrollTrigger scrubbing the B-phase portion of the timeline in reverse. Build it so it can be disabled with one flag if it proves noisy in practice.
- **Scroll during autoplay:** scroll takes over instantly — jump the timeline to the scroll-mapped state, never fight the visitor.
- **Filters and sorting demote the hero.** The animation is a page-load event, not a list feature. The moment any filter or sort is touched, the top painting becomes an ordinary item subject to the query — no re-animation on filter clear, no new draw. Hard reload = new random draw. The list/filter code never knows the animation exists.
- **`prefers-reduced-motion`:** skip everything; render the resolved painting statically at list scale with its info.
- **No pool available** (no eligible artworks returned): render the plain list. The system degrades to nothing, silently.

---

## 4 · Data architecture

Per the universal ACH tab principle: hero data lives in the **ACH tab** on the Artwork record in Payload — base archive fields are never modified.

New fields on the ACH tab:

| Field | Type | Notes |
|---|---|---|
| `heroEligible` | checkbox | Only square paintings with completed extraction. This is the pool. |
| `heroFields` | JSON | Output of `extract_hero_fields.py`, pasted verbatim. Contains `photoRect`, `fields[]` with normalized polygons, centroids, bboxes, hexes. |
| `heroPhoto` | upload (media) | The B&W source photograph, square export matching the painting's aspect. Distinct from any `sourceImage` used elsewhere — this one is cropped/prepared for the hero. |

The painting image used in phase C is the **standard archive square image** already on the record — no new asset.

**Random draw:** server-side per request (Next.js server component queries `heroEligible: true`, picks one) so the page renders with the chosen painting immediately — no client-side flash or layout shift. All geometry ships as data; the frontend contains zero painting-specific code.

---

## 5 · Extraction pipeline (netcup)

Two artifacts, delivered alongside this brief:

**`seed-picker.html`** — local browser tool, no server needed. Load the square painting image, click once inside each painted field (records seed coordinate + sampled hex + editable name/tolerance), switch to Photo corners mode and click two opposite corners of the photograph area, download `*.seeds.json`.

**`extract_hero_fields.py`** — runs on the netcup box (or locally): `pip install opencv-python-headless numpy`.

```
python extract_hero_fields.py painting.jpg brandenburg.seeds.json \
       -o heroFields.json --debug overlay.png
```

Per field it flood-fills from the seed in LAB colour space with fixed-range tolerance (Photoshop magic-wand behaviour), closes small gaps, takes the **external contour only** (holes from figures painted around are deliberately ignored — phase C restores them), simplifies to a polygon, and outputs everything normalized 0–1. The `--debug` overlay renders the polygons over the painting for a visual check before the JSON goes anywhere near Payload.

Tuning knobs, all per-field in the seeds file: `tolerance` (raise if a field fragments, lower if it bleeds into a neighbour — the near-value greys in Brandenburg will need this), `epsilon` (polygon simplification; raise for organic edges like the hedge if the point count gets heavy).

Fallback: if any painting's fields won't threshold cleanly, the Photoshop ExtendScript route (MoW AR coordinate pattern — fields as named layers → JSON) produces the same schema by hand.

---

## 6 · Adding a new painting (the repeatable workflow)

1. Painting photographed → standard square archive image on the Payload record (existing workflow, unchanged).
2. Prepare the square B&W source-photo export → upload as `heroPhoto` on the ACH tab.
3. Open `seed-picker.html`, load the painting image, click each field, set the photo rectangle, download seeds JSON. (~5 minutes.)
4. Run `extract_hero_fields.py`, eyeball the debug overlay, re-tune tolerances if needed.
5. Paste the output JSON into `heroFields`, tick `heroEligible`.
6. Done — the painting is in the random pool. No frontend deploy, no code change.

Initial pool candidates (all square): Brandenburger Tor 1899, Berlin Wall 1961, Powell Street 1895, Cliff House 1863, 8th & Kirkham.

---

## 7 · Frontend structure

```
/components/home/
  PaintingList.tsx      — the column; offsets; knows nothing about the hero
  HeroListItem.tsx      — wraps slot 0 when a draw exists; owns the timeline
  hero-timeline.ts      — phase construction from heroFields data; randomization
                          ranges + stagger (the global choreography template)
  HeroFieldLayer.tsx    — SVG polygons over the photo layer
```

- Fields render as SVG polygons (points straight from `heroFields`), transforms via GSAP.
- The crossfade target (archive painting image) is preloaded during phase B.
- All colours from `heroFields` hexes — which are the design-token values by construction.
- Choreography tuning (randomization ranges, stagger, easings, settle duration) lives in one config object in `hero-timeline.ts`. Tune it once on Brandenburg; it applies to the whole pool.

---

## 8 · Open items

1. **Thesis-line copy** — Bernard's own-voice pass on the phase-B line.
2. **Performance scale + settle geometry** — 70–75vh opening is a starting value; tune against the real list layout.
3. **Un-paint-on-exit** — build behind a flag; keep or cut after feeling it.
4. **List offset rhythm** — the left/right adjustment pattern for the column belongs to the homepage layout spec, not this brief, but the hero's settled position must land on whatever slot 0's offset is.

---

## First chat prompt for Cursor

```
I'm rebuilding the homepage of A Colorful History (acolorfulhistory.com),
Next.js App Router + Tailwind + GSAP. Read brief-hero-list-system.md in full —
it REPLACES all previous hero briefs and changes the homepage structure:
the homepage is now a single-column list of paintings, and the top item
performs a self-painting animation on load using per-artwork polygon data
fetched from Payload (heroFields JSON on the ACH tab).

Delete the previous hero section entirely (all six states, the pinned
ScrollTrigger scrub, the mobile arrow, the Kottbusser Tor references).

Build: PaintingList, HeroListItem, hero-timeline.ts, HeroFieldLayer per
section 7 of the brief. The random painting draw happens server-side.
Choreography values live in one config object. The list/filter code must
have zero knowledge of the animation (section 3 rules). Use design-system.md
tokens; field colours come from the heroFields data itself.
```

---

*The Kottbusser Tor purple-square concept remains reserved for the Kottbusser Tor artwork page — separate brief when that page is designed.*
