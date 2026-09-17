# Brief 13 — Hero Animation Choreography (GSAP build)
## A Colorful History · acolorfulhistory.com

*Implementation spec for Cursor. Tuned, approved choreography values — validated in a working CSS-transition prototype against real extracted Brandenburg Gate 1899 data before being handed off here. This brief translates that prototype into the GSAP timeline `brief-hero-list-system.md` §7 calls for.*
*Read alongside: `brief-hero-list-system.md` (concept, phases A–D, behaviour rules, file structure — unchanged) · `brief-11-hero-animation-fields.md` (ACH schema fields — must be live before this can run against real data).*

---

## Dependency check before starting

This brief assumes `ach.hero.heroEligible` / `heroFields` / `heroPhoto` already exist on the Artworks collection per Brief 11, and that Brandenburg Gate 1899 has real `heroFields` data seeded (attached to this brief as `brandenburg-heroFields.json` — paste directly into the record's `heroFields` field once the schema exists). **If Brief 11 hasn't been run yet, do that first** — this brief has nothing to render against otherwise.

---

## What changed from the original brief

`brief-hero-list-system.md` §2 specified phase B's randomization ("randomized offset, scale, and rotation... staggered") without concrete values — that was left as "the choreography template, global, not per painting" to be tuned once real data existed. It's now tuned. This brief supplies the actual numbers, validated by eye against real polygon geometry, replacing the placeholder language in that section.

---

## 1 · Phase A — Photograph

- Container shows the B&W `heroPhoto`, zoomed so `photoRect` fills the frame (crop, not letterbox).
- Zoom origin: `transform-origin` set to the center of `photoRect` (`x + w/2`, `y + h/2` from `heroFields`, as a percentage) — this point stays fixed when the container later zooms back out in phase B, so the "pull back" reads as one continuous camera move rather than a cut.
- Zoom scale at rest: **3.0** (tune per painting only if `photoRect` is unusually small/large relative to canvas — 3.0 was right for Brandenburg's `photoRect` at ~0.625 × 0.28 of canvas).
- Caption: place + year, fades in over 300ms.
- **Dwell: 1200ms** before phase B begins. (Prototype started at 900ms — confirmed too fast, 1200ms is the corrected value.)

## 2 · Phase B — Fields fly in

Per-field entry, **each field independently randomized** at animation start (new random values every page load — this is a feature, not noise; no two visits look identical):

- **Entry position:** random angle 0–360°, at a distance of **150%–350% of the canvas diagonal** from the field's landing position (i.e., well off-canvas in a random direction — fields arrive from all sides, not just a small jitter near their landing spot). Implement as: pick `angle = random(0, 2π)`, `radius = canvasSize * random(1.5, 3.5)`, start offset `= (cos(angle) * radius, sin(angle) * radius)` relative to the field's final position.
- **Entry rotation:** random between **-220° and +220°** — noticeably more than a full quarter-turn in either direction, so the spin reads as deliberate rather than a subtle wobble.
- **Entry scale:** starts at **0.3** of final size, tweens to 1.0.
- **Entry opacity:** starts at 0, fades in over the first ~40% of the tween.
- **Landing tween:** duration **850ms**, easing **back-out with overshoot** (CSS prototype used `cubic-bezier(.22, 1.4, .36, 1)` — in GSAP, `"back.out(1.7)"` or similar is the equivalent; tune the overshoot amount by eye, this is an approximation).
- **Stagger:** **130ms** between each field's tween start (not duration — fields overlap in flight, which is intentional, staggered starts not staggered completes).
- Simultaneous with the first field's tween starting: the photo container zooms from 3.0 back to 1.0 scale, duration **1100ms**, easing `cubic-bezier(.22, 1, .36, 1)` (ease-out, no overshoot — the camera pull-back should feel smooth and continuous, unlike the fields' punchier landing).
- Caption crossfades to the phase-B thesis line at the same moment.

**Total phase B duration** = `130ms × (fieldCount - 1) + 850ms` from its start — varies by painting based on field count (Brandenburg's 7 fields: ~1630ms).

## 3 · Phase C — Resolve

- Trigger **250ms after the last field's landing tween completes** (not after it starts — give the last field a beat to visibly settle before the crossfade begins).
- The real archive painting image crossfades in over the whole stack: opacity 0→1, **700ms**, ease.
- Simultaneously, the field SVG layer and photo layer both fade to 0 opacity over the same 700ms — a true crossfade, not a hard swap.
- Caption fades out.

## 4 · Phase D — Settle

- Trigger **950ms after phase C begins** (giving the crossfade time to fully resolve before the scale-down starts — these should not overlap, unlike B and C which do).
- Container animates from performance scale/position to list-item scale/position (per Brief 12's sizing system for whatever orientation the painting is — square, per hero eligibility rules), duration **800ms**, `cubic-bezier(.22, 1, .36, 1)`.
- Metadata (title, place/year, series) fades in beside/below per the list card layout from Brief 09/12.

---

## 5 · Config object shape

Per `brief-hero-list-system.md` §7, all of the above lives in one tunable config in `hero-timeline.ts`, not scattered through component code:

```ts
export const HERO_CHOREOGRAPHY = {
  photoZoomScale: 3.0,
  photoDwellMs: 1200,
  photoZoomOutMs: 1100,
  photoZoomOutEase: "power2.out", // GSAP equivalent of cubic-bezier(.22,1,.36,1)

  fieldEntryRadiusMin: 1.5, // × canvas diagonal
  fieldEntryRadiusMax: 3.5,
  fieldEntryRotationDeg: 220, // ± range
  fieldEntryScale: 0.3,
  fieldLandDurationMs: 850,
  fieldLandEase: "back.out(1.7)",
  fieldStaggerMs: 130,

  resolveDelayAfterLastFieldMs: 250,
  resolveDurationMs: 700,

  settleDelayAfterResolveMs: 950,
  settleDurationMs: 800,
  settleEase: "power2.out",
} as const;
```

Tune once here; applies to every painting in the hero-eligible pool, not per-painting.

---

## 6 · What's still approximate — do not treat as final without another look

- **`heroPhoto` doesn't exist yet for Brandenburg** — the prototype faked phase A with a grayscale filter over the full-color archive image. Once a real cropped B&W export is uploaded per Brief 11, look at phase A again — real photographic detail will read differently than a desaturated stand-in.
- **Zoom scale of 3.0 is Brandenburg-specific** — paintings with a larger or smaller `photoRect` relative to canvas will need a different zoom scale, or a formula deriving it from `photoRect`'s dimensions rather than a flat constant. Worth deciding whether to hardcode 3.0 as a global default or compute it per painting once a second painting's data is live.
- **Back-out overshoot amount** (`back.out(1.7)`) is a guess at translating the CSS cubic-bezier — GSAP's back ease and CSS cubic-bezier back-out don't map 1:1, confirm the landing motion still feels right once actually built in GSAP, not just assumed equivalent.

---

## 7 · Addendum — photo must rest at photoRect, not fill the frame

**Bug found during initial Brandenburg build:** the photo was rendering full-frame at rest, so phase B's "pull back" had nothing correct to pull back *to* — the photo just stayed full-frame while fields landed around it, misaligned with where the photo actually sits in the finished composition.

**Fix:** the photo needs a true rest position matching `photoRect`, in the same normalized coordinate system the field polygons already use — phase A's zoomed-in view is a *transform applied to that same element*, not a separate state.

```css
.photo-wrapper {
  position: absolute;
  left: {photoRect.x * 100}%;
  top: {photoRect.y * 100}%;
  width: {photoRect.w * 100}%;
  height: {photoRect.h * 100}%;
  overflow: hidden;
}
.photo-wrapper img { width: 100%; height: 100%; object-fit: cover; }
```

At rest (no transform) this sits exactly where the photo belongs. Phase A's zoom is computed, not hardcoded:

```js
const scale = Math.max(1 / photoRect.w, 1 / photoRect.h); // cover the frame
const centerX = (photoRect.x + photoRect.w / 2) * containerSize;
const centerY = (photoRect.y + photoRect.h / 2) * containerSize;
const dx = containerSize / 2 - centerX;
const dy = containerSize / 2 - centerY;
// transform-origin: 50% 50% on the wrapper itself
wrapper.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
```

Phase B tweens this transform back to `translate(0,0) scale(1)` using the existing `photoZoomOutMs`/`photoZoomOutEase` from the config — same timing, now applied to the correctly-positioned wrapper. `photoZoomScale: 3.0` in the config becomes a fallback only; prefer computing scale per-painting from its own `photoRect`, since it varies (Brandenburg computes to ~3.57, not 3.0).

---

## First chat prompt for Cursor

```
I'm building the hero animation timeline for A Colorful History
(acolorfulhistory.com), Next.js + GSAP. Please read brief-13-hero-animation-
choreography.md in full first, alongside brief-hero-list-system.md (concept
and phases, unchanged) and brief-11-hero-animation-fields.md (schema
dependency — confirm those fields exist before starting).

Build hero-timeline.ts with the HERO_CHOREOGRAPHY config object from section
5 of brief-13, and implement the four phases (A-D) per sections 1-4 using
GSAP timelines against real heroFields polygon data. Field entry position is
computed per-field at runtime: random angle + radius (1.5-3.5x canvas
diagonal) relative to each field's landing position, per section 2 — this
must be freshly randomized on every page load, not fixed.

Wire it into HeroListItem.tsx and HeroFieldLayer.tsx per the file structure
in brief-hero-list-system.md section 7. Test against Brandenburg Gate 1899
once its heroFields data is pasted into Payload (attached as
brandenburg-heroFields.json).

Respect the existing behaviour rules from brief-hero-list-system.md section
3 unchanged: autoplay gated on photo decode(), prefers-reduced-motion skips
to static resolved painting, scroll interrupts jump the timeline instantly,
filters/sort demote the hero.
```

---

*Captured August 2026. Choreography values validated against a working prototype using real Brandenburg Gate 1899 field data before being handed to Cursor — not guessed from the design brief alone.*
