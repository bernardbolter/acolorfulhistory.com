# A Colorful History — Voice & Hero Sequence
*Captured from working session, April 2026*

---

## Voice Principles

These emerged from Bernard describing the work in his own words. Every piece of copy on the site should be checked against these.

**Direct and technical about method.**
When describing how the work is made, no mystification. Just what it is. "A photograph transferred to canvas. The rest, painted in acrylic." The technique is the concept — it doesn't need decoration.

**Expansive and quiet about time.**
The big ideas get simple sentences. The 120-year thought, the idea of making work for 2140 — these land harder when they're stated plainly, not dressed up.

**Never tells the viewer what to feel.**
Art is subjective. The work earns its responses. The best unsolicited response received: people feel calm. That's an observation, not a directive.

**Dry, self-aware, not precious.**
The practice can hold a joke. "Sometimes it's just paint" is a real line that belongs on the homepage. That self-deprecating register is part of the voice — it keeps the work honest.

**Palette over city, city over biography.**
The paintings know where they come from. San Francisco has different colors than Berlin. That specificity of place is always present in the language.

---

## The 120-Year Thought

*This is the conceptual core. It should inform the About page, series descriptions, and any long-form copy.*

When a photograph from 1890 is transferred onto canvas, that image is 120 years old at the moment of making. The question that follows: will this painting still exist in 120 years from now — in 2140 — and what would it be for someone to look at it then? The same experience Bernard has looking at the 1890 photograph. The work is made for now and for then. For everyone alive and for everyone not yet born.

This is not stated didactically on the site. It lives underneath everything.

---

## The Origin of the Practice

*For the About page and any biographical copy.*

Bernard grew up in San Francisco. Returning home, he found himself in conversations about how the city had changed — what had been lost, what remained. That sent him to the 19th-century photographs. What had changed since then? The painted fields came later: a way of freezing the present day around those historical images, making both exist at the same time on the same surface.

---

## The Core Line

*To be used in full or as the anchor for longer copy.*

> "The painted fields freeze the present day and bring the past to the present."

This is Bernard's own language, stated directly. It is physically accurate — describing what is literally happening on the canvas — and conceptually true at the same time. Don't paraphrase it.

---

## Hero Animation — Full Sequence Spec

### Concept

The homepage hero demonstrates the entire conceptual arc of the practice through a single animated sequence. The visitor experiences the method before reading about it. The two paintings used — *Brandenburger Tor 1899* and *Kottbusser Tor 2018* — are the bookends of a series that deconstructed itself. They are used here as raw material for the experience, not presented as artworks.

### Technical Approach

- **Library:** GSAP ScrollTrigger (desktop) / GSAP with arrow-triggered playback (mobile)
- **Desktop:** Section is pinned. Scroll position drives animation progress.
- **Mobile:** Section pins with an arrow button that triggers the animation forward through states.
- **Copy:** State-based. Fades in/out at defined ScrollTrigger progress points.
- **Images:** Brandenburger Tor 1899 photograph (B&W) + Kottbusser Tor 2018 photograph (colour). Full uncropped source photos required — the animation reveals what is under the painted fields, including what is under the $paint-gate purple square in the Kottbusser Tor painting (this is a conceptual moment — some viewers will know the painting and have never seen what's beneath the purple).

---

### State 0 — Arrival
**Visual:** Full-bleed B&W photograph, zoomed in tight. Crop on the umbrella figure and the gate in the background. Intimate. Historical. No paint fields present. Logo visible.

**Copy:**
> Berlin, 1899

---

### State 1 — Fields Enter
**Visual:** Camera begins to pull back (zoom out). As the full composition becomes visible, the Brandenburg painted fields animate in and land exactly where they sit in the actual painting:
- Sky warm (#A8D6E8) — upper field
- Cream (#F0E8C0) — diagonal light shaft across the ground
- Mid-grey (#B8B8BC) — left zone
- Burnt amber (#B8742A) — right wall

The fields follow the geometry of the photograph — rooflines, horizon. They are completing it, not decorating it.

**Copy:**
> A photograph transferred to canvas. The rest, painted.

---

### State 2 — Time Shifts
**Visual:** The B&W photograph begins gaining colour — transitioning toward the Kottbusser Tor contemporary photograph. Simultaneously, the Brandenburg fields begin to fade and retract, as if being pulled toward the new image. The crossfade is the transition between historical and contemporary Berlin.

**Copy:**
> The painted fields freeze the present day and bring the past to the present.

---

### State 3 — Kottbusser Tor Takes Over
**Visual:** Now in the colour photograph. The Kottbusser Tor painted fields arrive — sky vivid (#4AAED4) taking the top half, warm white (#F4F2EE) rising from the bottom, compressing the photograph into its lower band exactly as in the painting. The $paint-gate purple square (#2A1545) slides in and covers the centre of the photograph.

For viewers who know the Kottbusser Tor painting: recognition.
For everyone else: mystery. What's under the purple?

**Copy:**
> But sometimes it's just paint.

---

### State 4 — Everywhere
**Visual:** The purple continues to expand, taking the frame. The photograph is almost entirely gone. The purple IS the screen.

**Copy:**
> Everywhere.

*(Single word. Lands as the purple completes its takeover.)*

---

### State 5 — CTA
**Visual:** Purple holds. Logo prominent. Navigation emerges from the purple — clean, minimal.

**Copy / CTA:**
> See the work

*(Or: Enter. To be finalised.)*

---

## Copy Tone Notes for Future Pages

- **Series descriptions:** Lead with place and time, then method. Not the other way around.
- **Artwork titles:** Stated plainly. *Kottbusser Tor 2018.* No embellishment.
- **Store / prints:** Functional and direct. Edition sizes stated as fact. No pressure language.
- **About page:** First person, matter-of-fact. The 120-year thought lives here in full.
- **AR experience:** Minimal instruction copy. The experience should explain itself.

---

## What Still Needs Writing

- About page full text (Bernard to draft in own voice, then edit)
- Series descriptions for Mediums of Perception, Gates of Perception, earlier work
- CTA final wording (State 5 above)
- State 3 / State 4 copy — confirmed above, needs sign-off
- Print edition descriptions for store

---

*Next session: Full site structure, page by page.*
