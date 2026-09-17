# Site Scaffolding Status — A Colorful History
*Synthesized Aug 25 2026, ahead of the Neighborhood Commissions page build. Reads across all briefs/handoffs/addenda in the project to date. Updated same day, twice: after the Homepage/Nav/Hero audit + two fix passes closed out, and again after the Triptych/MoP Series audit.*

---

## Why this doc exists

Bernard added `ach-neighborhood-commissions-page-brief.md` — a new page, living inside the existing ACH series presentation rather than as a standalone section. Before building it, the question came up: what does the rest of the site's scaffolding actually look like right now, and does it need a Cursor audit first? This is the answer, page by page, plus a recommendation.

---

## Page-by-page status

| Page / route | Spec status | Build status |
|---|---|---|
| **Homepage `/` (list + hero + nav)** | Redesigned from the ground up as a self-painting list (`brief-hero-list-system.md`), not the old `HomePage.sections` landing page. Iterated across 8 briefs since July. | **Closed out Aug 25 2026.** Audited ([addendum-homepage-cursor-audit.md](./artwork/addendum-homepage-cursor-audit.md)), two fix passes run ([addendum-homepage-fix-pass-1.md](./artwork/addendum-homepage-fix-pass-1.md), [addendum-homepage-fix-pass-2.md](./artwork/addendum-homepage-fix-pass-2.md)): killed a silent hero-pool fallback, retired a stale WordPress-era doc sample, closed the Gates-of-Perception allowlist gap (and proactively added MoP/MoW slugs ahead of content), fixed nav panel surface + Browse group, fixed list-card metadata + a font-weight mismatch. Four resulting open calls ratified ([decision-four-open-calls-pass-2.md](./artwork/decision-four-open-calls-pass-2.md)). **Remaining, explicitly queued as separate passes:** hero choreography (blocked on seeding a real Payload `heroEligible` record), the sort/filter UI (built but hidden), real routes for the Gates/BDA/MoW `#` nav stubs, MoP spotlight cards. |
| **Artwork page `/artwork/[slug]`** (built at `/[locale]/[slug]`) | Fully spec'd, locked (`brief-01-artwork-page-design.md`). | **Audited by Cursor Aug 18 2026** ([addendum-artwork-page-cursor-audit.md](./artwork/addendum-artwork-page-cursor-audit.md)). Tier 1 (silent data bugs) fixed. Tier 2 (layout: image not full-bleed, fault-line positioning, TitleBlock z-index broken, MiniNav placement, StatusBadge position, timeline layout) and Tier 3 (feature depth: ZoomMode stub, RevealSlider missing toggle, InfoTab/StoryColumns pan behavior, OGImage stub) **not yet addressed**. One item from this audit — "TriptychLink scope creep, prev/next not gated to MoP-only" — was re-investigated during the triptych audit below and turned out to be a mischaracterization: prev/next *is* correctly gated to a `triptych` relation. What's actually missing is that it doesn't wrap around the three panels. |
| **Triptych page `/series/mediums-of-perception/[city]`** | Core decisions resolved (`brief-02-triptych-page-design.md`), schema fully covered, no new fields needed. Panel-to-triptych navigation locked in [addendum-triptych-panel-detail-navigation.md](./artwork/addendum-triptych-panel-detail-navigation.md) (checked into this repo Aug 25 2026). | **Audited Aug 25 2026** ([addendum-triptych-series-cursor-audit.md](./artwork/addendum-triptych-series-cursor-audit.md)). Headline finding: **the Berlin and Munich triptychs described in the master brief were never actually entered into Payload** — zero `Triptychs` records, zero artworks tagged `mediums-of-perception` or `mediums-of-war`. This is a real content gap, not a silent filter bug like Gates of Perception was. The city detail routes (`/berlin`, `/munich`) correctly render "Coming soon" given no data — that part is honest and working. Prev/next wrap (I↔II↔III↔I) **fixed** same day in `TriptychLink` ([addendum-mop-code-fix-pass.md](./artwork/addendum-mop-code-fix-pass.md)); untested until a panel is seeded. |
| **MoP series overview `/series/mediums-of-perception`** | Spec'd (`brief-02` + `handoff-mop-series-triptych.md`): triptych list, Mediums of War at the bottom. | **Audited Aug 25 2026**, same report as above. Blank-`<h1>` / empty-list honesty **fixed** same day ([addendum-mop-code-fix-pass.md](./artwork/addendum-mop-code-fix-pass.md)): mapper reads Series `name`; empty triptych list shows Coming soon. Content gap (zero triptychs) unchanged. |
| **Map `/map`** | Existing component predates the design-brief series ("do not redesign"). `brief-03` (Map & Tour Design) is a **brainstorm-only doc** — 9 open questions never resolved into a build-ready brief. | Real gap — oldest unresolved design doc in the project. The `/map` route and the homepage's Map/List pill control are confirmed working; the deeper tour/pin design questions remain open. |
| **Experience `/experience`** (AR) | June-scope, described in `ach-site-design-and-architecture.md` and `brief-01`, but never got its own detailed brief. | Not confirmed built or audited. |
| **Store `/store`** | Post-June. `handoff-store.md` raised open questions never resolved into a numbered brief. Thin schema exists (`Products`, `printSets`, `SmallPrints`). | Not built. |
| **Tours (Gates of Perception)** | Schema resolved and build-ready. | Schema likely implementable now; the 17-stop `tourStopCopy` content still needs an Art/Official dialogue session with Bernard. Gates' 14 works are correctly surfaced on the homepage list (Fix Pass 1) independent of whether the dedicated tour experience gets built. |
| **Field Notes / creative pipeline** | Schema + protected UI spec'd in Brief 07. Rap Critic episode schema + camera-angle addendum already sent to Cursor. | Partially built — pipeline confirmed working (3 successful test notes). Moondream known-broken, out of scope for Rap Critic. |
| **Neighborhood Commissions page** `/neighborhood` | Full content/pricing/tier brief + Payload schema brief. Explicitly meant to live *inside* the existing ACH series presentation (i.e. `a-colorful-history`, the main series), **not** inside Mediums of Perception — so the MoP content gap does not block this page. | **Frontend shipped Aug 25 2026:** route, nav (More group), reserved slug, page shell (pitch / three tiers / founding pricing / inquiry form), static copy fallback, Payload global contract `neighborhood-page` ([neighborhood-payload-schema.md](./SFpainting/neighborhood-payload-schema.md)). Still needed on bernardbolter.com: create + seed the global; Tier 1 photo uploads; set `inquiryEmail`. Vendure deposit flow and full commission-brief upload intake remain later. |

**Site-wide, confirmed twice now:** the Payload instance behind acolorfulhistory.com is a shared archive across all of Bernard's sites (217 published artworks total, most unrelated to ACH). Any future page/query work needs the same site-scope allowlist pattern documented in [decision-keep-site-series-allowlist.md](./artwork/decision-keep-site-series-allowlist.md). The triptych audit confirmed MoP/MoW are already correctly on that allowlist — the empty result there is a genuine content gap, not another instance of the allowlist bug.

**A new pattern worth watching:** two of three audits so far (homepage, triptych/series) found the exact same bug shape — a component reading a series' `title` field when the live schema calls it `name`. Worth a repo-wide grep for `series.title` / `series\.title` across any page not yet audited (artwork page, map, experience), since it's clearly not a one-off. Confirmed hot spot today: `lib/mappers/triptychFromPayload.ts` `mapPayloadSeriesToSeries()` uses `doc.title` while live Series uses `name`.

---

## Recommendation

**Priority order, updated:**

1. ~~**Homepage (list + hero + nav bundle)**~~ — **done.**
2. ~~**Triptych page + MoP series overview**~~ — **audited.** Two small, real code bugs identified (blank `<h1>` on the series overview, prev/next doesn't wrap) that are worth fixing regardless of content timing. The larger blocker — seeding real Berlin/Munich triptych data — is a content task for Bernard (Payload admin + the `seed-picker.html`/`extract_hero_fields.py` pipeline + an Art/Official dialogue session for `olderStory`/`newerStory` and stop copy), not something a Cursor fix pass can resolve on its own.
3. **Map page** — the oldest unresolved design doc (`brief-03`) is still just 9 open questions.
4. **Experience / Store** — lower priority, Store is explicitly post-June and Experience has no confirmed build yet to audit.

Since Neighborhood Commissions nests inside the *main* ACH series presentation, not inside Mediums of Perception, it is **not blocked** by the MoP content gap — it can proceed once the ACH-level scaffolding (homepage, artwork page Tier 2/3, nav) is in a state Bernard's comfortable building on top of.

---

*Written Aug 25 2026. Updated same day after the homepage audit/fix passes and again after the triptych/series audit.*
