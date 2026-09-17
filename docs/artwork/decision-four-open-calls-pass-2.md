# Decision — Four Open Calls from Homepage Fix Pass 2
## A Colorful History · acolorfulhistory.com

*Captured Aug 25 2026. Ratifies the "Open questions for Bernard" section of [addendum-homepage-fix-pass-2.md](./addendum-homepage-fix-pass-2.md). Read alongside that doc and [decision-keep-site-series-allowlist.md](./decision-keep-site-series-allowlist.md) for the allowlist precedent this follows the same pattern as.*

---

## What this resolves

Fix Pass 2 shipped four things that either diverged from a locked brief or weren't explicitly speced, and reported them back rather than deciding unilaterally. All four are now decided. Future audits should read these as settled, not as open mismatches against `brief-07-header-nav-sequence.md` / `brief-09-list-card-images.md` / `design-system.md`.

---

## 1 · ACH series tag — stays hidden

**Decision:** Keep hiding "A Colorful History" as a series tag on list cards. Breaking Down Art and Gates of Perception continue to show their tags.

**Why:** `series.name` for the main catalogue is literally the site's own name — showing it on ~59 of 76 cards would repeat the site name back at the visitor rather than tell them anything. Brief-09's spec example (`Berlin, 1899 · Mediums of Perception`) assumed every card's series label would be distinct, informative content, which only holds for the non-primary series today.

**Amends:** `docs/cards/brief-09-list-card-images.md` §1 — the series-tag requirement is confirmed as "show it when it's informative," and the primary ACH series is the one confirmed exception, not a bug. `listSeriesLabel()`'s hiding of `ACH_MAIN_SERIES_SLUG` is the correct, permanent behavior — no further flag or TODO needed on it.

---

## 2 · Logo shift — stays at 318px

**Decision:** Keep `left: calc(100% - 318px)` on the open-state logo shift. Do not change to the spec's 270px.

**Why:** The actual `ColorLogo` SVG is 298×25px, plus ~1.25rem (20px) of left chrome padding — that's already ~318px. The spec's 270px was written before (or without reference to) the real asset dimensions; applying it as written would clip the wordmark into the 300px nav panel.

**Amends:** `brief-07-header-nav-sequence.md` / `design-system.md`'s stated `calc(100% - 270px)` value is superseded by 318px for the current logo asset. If the logo SVG is ever resized smaller, this value should be revisited — it's tied to the asset, not an arbitrary design constant.

---

## 3 · Tagline + byline travel with the logo

**Decision:** Confirmed correct as shipped — tagline ("The medium shapes the memory.") and byline ("by Bernard Bolter") now travel with the wordmark as one `logo-chrome-stack` on nav open, replacing the old fade-to-`opacity-0` behavior. No further visual-check follow-up needed; this is the intended final behavior.

**Why:** The fade-out had no documented rationale — it was a chrome-overlap workaround, not a deliberate design choice. Matches the plain reading of brief-07/design-system's "logo + tagline + byline shift together."

---

## 4 · Panel top padding — stays at 112px (`pt-28`)

**Decision:** Keep `pt-28` (112px) as the open-panel top padding, not the spec's 56px.

**Why:** The persistent header row (hamburger + language/Map-List controls) sits *outside* the sliding panel, at `top-14` / `z-nav-chrome`. Literal 56px top padding would place the Browse group underneath that chrome. 112px is the padding value that actually clears it — this is a structural constraint from the persistent-row architecture (`brief-07` §"Critical build note"), not a decorative deviation.

**Amends:** `brief-08-nav-panel-visual-refinement.md` §1's stated `56px 24px 20px` padding — the vertical figure is superseded by 112px; horizontal (`24px`) and bottom (`20px`) are unchanged and correct as specced.

---

## Still separate, still queued (unchanged from Fix Pass 2's suggested next steps)

- Hero choreography — blocked on seeding a real Payload `heroEligible` record.
- Sort/filter UI (`HomeListControls`) — blocked on resolving paint-year vs. historical-year for the decade facet.
- Real Gates of Perception / Breaking Down Art / Mediums of War series routes, replacing `#` nav stubs.
- MoP spotlight cards.
- Brief-12 placeholder mechanism swap (CSS wrapper vs. current `blurDataURL`).
- Landscape width-cap confirmation (currently forced to the square cap by deliberate CSS comment — flagged, not reverted, still worth a conscious sign-off at some point but not blocking).

---

*Written Aug 25 2026, from Bernard's direct confirmation of Fix Pass 2's four open questions.*
