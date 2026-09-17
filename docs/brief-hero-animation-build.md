# Brief — Homepage Hero Animation Build
## A Colorful History · acolorfulhistory.com

*Implementation spec for Cursor. Design decisions resolved — this is the build.*
*Read alongside: `design-system.md` · `voice-and-hero-sequence.md` · `site-structure-handoff.md`*

---

## What this is

The homepage hero is a single animated sequence that demonstrates the entire conceptual arc of Bernard's practice before the visitor reads a word of copy. It uses two source photographs — *Brandenburger Tor, 1899* (B&W) and *Kottbusser Tor, 2018* (colour) — as raw material, not as presented artworks. The sequence moves from a historical photograph, through the painted fields arriving exactly where they sit in the real paintings, to a contemporary photograph, and closes on the `$paint-gate` purple square.

The core line, stated once, is the thesis of the whole sequence:

> "The painted fields freeze the present day and bring the past to the present."

---

## Tech approach

- **Library:** GSAP + ScrollTrigger
- **Desktop:** Hero section is pinned (`pin: true`). Scroll position drives animation progress via a single timeline scrubbed by `ScrollTrigger.progress`.
- **Mobile:** Section pins; an arrow button advances the timeline forward through states instead of scroll (no reliable scroll-scrub on mobile viewports at this zoom level). Same GSAP timeline, driven by discrete `tl.tweenTo()` calls per tap instead of scroll progress.
- **Copy:** State-based text layer, absolutely positioned, cross-faded in/out at defined progress points on the same timeline (not separate ScrollTriggers).
- **Breakpoint:** Single breakpoint `l:` at 769px per design system — no intermediate tablet treatment.

Suggested file structure:
```
/components/hero/
  HeroSection.tsx       — pins section, sets up ScrollTrigger, owns timeline ref
  HeroCanvas.tsx         — the two images + painted field SVG/div overlays
  HeroCopy.tsx           — state-based copy layer
  HeroMobileArrow.tsx    — arrow control, only rendered below 769px
  hero-timeline.ts       — GSAP timeline construction, exported so both scroll and arrow drivers can call it
```

---

## Sequence — states, visuals, copy

### State 0 — Arrival
Full-bleed B&W photograph (Brandenburger Tor 1899), zoomed in tight — crop on the umbrella figure and the gate in the background. No paint fields. Logo visible.

> Berlin, 1899

### State 1 — Fields Enter
Camera pulls back (zoom out) to reveal the full composition. Brandenburg painted fields animate in, landing exactly where they sit in the real painting, following the photo's rooflines and horizon — completing it, not decorating it:

| Field | Colour | Position |
|---|---|---|
| Sky warm | `#A8D6E8` | Upper field |
| Cream | `#F0E8C0` | Diagonal light shaft across the ground |
| Mid-grey | `#B8B8BC` | Left zone |
| Burnt amber | `#B8742A` | Right wall |

> A photograph transferred to canvas. The rest, painted.

### State 2 — Time Shifts
The B&W photograph crossfades toward the Kottbusser Tor contemporary colour photograph. Simultaneously the Brandenburg fields fade and retract, as if pulled toward the new image.

> The painted fields freeze the present day and bring the past to the present.

*(This is the core line — do not paraphrase.)*

### State 3 — The Box Arrives
**Revised architecture — read this before building.** The Kottbusser Tor 2018 source photograph is permanently unrecoverable — it will not be found later. This is not a placeholder waiting for an asset; it is the resolved design. There is no photograph behind the purple box and no reveal mechanic. Do not build toward "what's under the purple" — there is nothing under it, and the sequence should not imply otherwise.

The Kottbusser Tor painted fields arrive on their own — sky vivid `#4AAED4` taking the top half, warm white `#F4F2EE` rising from the bottom. The `$paint-gate` purple square (`#2A1545`) slides in over the centre, small and contained from the start — not a takeover in progress. Think vault, flight recorder, small grave: a deliberate, steady object, not an expanding field.

> This one was never found.

### State 4 — What Remains
The box holds, unchanging in scale — it does not expand further or fill the frame. This state confirms the box as the permanent resolution, not a transition toward something else.

> So this is what took its place.

### State 5 — CTA
Box holds, still small and steady in frame. Logo prominent. Navigation emerges from/around it, clean and minimal.

> See the work

*(Copy above is a placeholder Bernard will revise in his own voice — safe to build against now, expect it to change.)*

---

## ⚠️ Status of States 3–5

The Kottbusser Tor 2018 source photograph is **permanently unrecoverable** — not missing-for-now, not pending a hard drive search. This is confirmed, not an open risk. States 3–5 above reflect that: no reveal mechanic, no photograph ever appears, the purple box is the resolved design rather than a stand-in for one.

**Still open:** the copy for States 3–5 is a placeholder draft. Bernard will revise it in his own voice before launch. Build against the placeholder now — it's structurally final (box arrives small, holds, CTA emerges), only the words will change. Don't build any logic that depends on the specific wording.

---

## Assets needed

### 1. Brandenburger Tor 1899 — you have this

**Size:** Export at **2560px on the longest edge**, original aspect ratio preserved — do **not** crop to square. This is different from the standard archive image spec (1600×1600 square) because the hero needs headroom to zoom in tight (State 0) without softness, and the animation reveals areas near the frame edges that a square crop would cut off.

**Format:** JPEG, quality ~80 (higher than the archive's quality-60 standard — this is the single largest, most prominent image on the site), sRGB, no metadata, Save for Web.

**Name:** `berlin-brandenburgertor-1899-hero.jpg`
*(Matches the site's `[city]-[title-slug]-[source-years]` convention with a `-hero` suffix, so it's never confused with the artwork page's own `sourceImage` asset if that's cropped differently.)*

**Where it goes:**
- Upload through the Payload admin UI as the `sourceImage` field on the Brandenburger Tor 1899 Artwork record (this keeps bernardbolter.com as the single source of truth — Cloudflare R2 storage and the URL are handled automatically by that upload).
- The hero component on acolorfulhistory.com fetches this artwork's `sourceImage` URL via the Payload API at build/render time — it should **not** be a separately hardcoded file in the Next.js repo.
- For local development before that record exists in Payload, Cursor can drop a temporary copy at `/public/hero/berlin-brandenburgertor-1899-hero.jpg` and swap in the API call once the record is live — flag this as a TODO in code.

### 2. Kottbusser Tor 2018 — no asset, and none is coming

Confirmed permanently unrecoverable — not a pending dependency. No image asset is needed for States 3–5; the purple box is the final visual, not a placeholder for a photo. Remove this from any pre-build dependency tracking as a "to locate" item.

---

## Suggested phased build

1. **Build States 0–2** now, using only the Brandenburg Tor asset. This is fully specified and unblocked.
2. **Build States 3–5 as final architecture**, not a stub — the purple box, small and contained, is the permanent design. Use the placeholder copy above, marked `// TODO: Bernard's final State 3–5 copy pass` in code so it's easy to find and swap later. This is a copy change only, not a structural one.
3. **No asset swap step** — there is no Kottbusser photograph coming. Don't build any code path that expects one (e.g. no lazy-loaded image placeholder, no "reveal" logic behind the box).

---

## First chat prompt for Cursor

```
I'm building the homepage hero for A Colorful History (acolorfulhistory.com),
a Next.js App Router + Tailwind site. I have a full brief at
brief-hero-animation-build.md — please read it in full first.

Build States 0–2 of the hero animation sequence using GSAP + ScrollTrigger,
pinned on desktop, arrow-advanced on mobile (single breakpoint at 769px).
Stub States 3–5 with placeholder purple blocks per the brief's phasing notes.

Use the design system tokens in design-system.md for all colours — do not
hardcode hex values outside of the documented palette. Structure the timeline
state configs in a single hero-timeline.ts file so swapping in the Kottbusser
asset and final copy later is a data change, not a rebuild.
```

---

*This brief covers the hero animation build only. Site-wide navigation, logo behaviour, and homepage sections below the hero are covered in `site-structure-handoff.md`.*
