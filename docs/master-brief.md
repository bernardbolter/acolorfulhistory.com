# Master Project Brief
## Artist: Bernard Bolter — Digital Ecosystem Build 2025

### What This Is
A phased build of a connected digital ecosystem for Bernard Bolter, a working artist based in Berlin. The goal is to create an independent commercial and archival infrastructure — removing dependency on galleries, enabling direct sales, and making the full body of work machine-readable and AI-discoverable.

---

### The Ecosystem

```
PayloadCMS (Bernard Bolter Archive)
└── Single source of truth for all artwork data
└── Feeds all sites via API

Vendure (Ecommerce)
└── Independent shop backend
└── Serves all series sites
└── Prints, originals, editions

Artist Archive Site (bernardbolter.com or similar)
└── Clean retrospective of all work
└── Machine readable, schema.org / JSON-LD
└── Portfolio and CV function
└── No selling, no deep narrative

Series Sites (starting with Mediums of Perception)
└── Each series gets its own world
└── Expressive design extending base system
└── Deep narrative, AR, map, tours
└── Ecommerce pulls from Vendure
```

---

### The Artist's Practice

Mixed media paintings combining acrylic photo transfers onto canvas with bold painted acrylic fields. Works in series, each series with a distinct conceptual framework. Current and ongoing series is **Mediums of Perception** — open ended, one new city triptych per month approximately.

**Series history in brief:**
- 2003–2005 New York — Vanishing Landscape, first photo transfer experiments
- Amsterdam — Digital City Series, pure photo collage
- 2013 San Francisco — A Colorful History, first use of historical photographs, gallery success
- Berlin — Gates of Perception, War series, current Mediums of Perception

---

### The Conceptual Thread

How the technology used to capture an image shapes our perception of that historical moment. Each Mediums of Perception triptych takes one architectural subject through three image technologies — earliest known photograph, historical color lithograph, contemporary aerial or digital photograph — with a distinct painted palette for each panel reflecting its era.

---

### Mediums of Perception — Series Details

- **Format:** Triptychs, one per city, released approximately monthly
- **Cities so far:** Munich (commission), Berlin (in progress for launch)
- **Originals:** Available for sale per triptych
- **Print editions:** 15 sets A3, 30 sets A5 per triptych
- **AR layer:** mind.js, phone pointed at painting, video plays on top
- **AR content:** Artist freestyle rap narrating history of the place and image technology
- **Conceptual lineage:** Extends Gates of Perception (Huxley reference), War series

---

### Hard Launch — 48 Stunden Neukölln, June 2025

- Physical open studio, Neukölln Berlin
- Mediums of Perception: Berlin on show
- AR live and demonstrable in physical space
- Print editions available to buy
- Site live enough to send foot traffic to

---

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (App Router) |
| Styling | Tailwind CSS |
| CMS | PayloadCMS + Neon (Postgres) |
| Ecommerce | Vendure (independent) |
| AR | mind.js |
| Map | TBD |
| Schema | schema.org + JSON-LD programmatic |

---

### Design Principles

- **Archive:** clean, neutral, work speaks, authoritative
- **Series sites:** expressive, each its own world, extends base system
- **All sites:** machine readable, graph connected, AI discoverable
- Physical size representation of artworks in display (see archive brief for full spec)

---

### Data Architecture Principle

Archive holds clean essential universal data. Series sites hold deep relational narrative data. Never duplicate, never bleed between layers. Each series gets its own Payload tab with series-specific fields.

**The information hierarchy:**
- Archive → who, what, when, where, how big. Nothing more.
- Series sites → full experience, context, concept, relationships, AR, tours, map, narrative, selling

**General Payload fields (archive-wide):**
- Title, year, medium, dimensions, series name, city, country, size tier, orientation, exhibition history, one good image

**A Colorful History tab (series-specific):**
- Source photograph details
- Image capture technology / medium type (daguerreotype, lithograph, aerial etc.)
- Historical context copy
- Three-part progression logic (first known image → historical → contemporary)
- AR video link per panel
- Lat / lng for map pins
- Edition / print data
- AR rap script per panel

---

### The Map & Tour Feature

The map is the connective tissue of the whole practice — not just a navigation element but a way to experience the journey of the work itself.

**Two modes:**
- **Series Tours** — focused thematic journeys through a single series or city
- **The Grand Tour** — New York → Amsterdam → San Francisco → Berlin → beyond, the full autobiographical arc

**How tours are built:**
- Tour collection in Payload with ordered stops (artwork or series nodes)
- Each stop has narrative copy
- Tours derive automatically from the data — fields are filled, tours build themselves
- New city releases become new map pins, each drop is an event

---

### Parallel Workstreams

Each has its own chat. All chats start with this master brief plus their specific workstream directive.

| # | Workstream | First Deliverable |
|---|-----------|------------------|
| 1 | Archive site | design-system.md (base, clean) |
| 2 | Mediums of Perception site | design-system.md (expressive, extends base) |
| 3 | Vendure ecommerce | Ready for June, originals + print editions |
| 4 | Social media strategy | Timed to 48hrs Neukölln launch |
| 5 | Print editions offer | Pricing, packaging, fulfillment refinement |

---

### Key Principles Across All Chats

- Schema.org and JSON-LD on everything, programmatically generated
- Elements connect like a graph — tours, map, timeline all derive from data
- Design system before components, components before pages
- Scope ruthlessly for June, roadmap everything else
- Archive is foundation, series sites derive from it
- One new city per month post-launch is the commercial rhythm
- Machine understandable AND visually understandable — both matter equally

---

### Current State

| Project | Status |
|---------|--------|
| Archive | ~80% complete on old stack, migrating to Payload |
| Mediums of Perception site | Frontend started, rebuilding with proper design system |
| Vendure | Started, needs focus for June |
| Munich triptych | Complete (commission) |
| Berlin triptych | In progress for June launch |

---

### How To Use This Document

Drop this at the top of any new chat along with the relevant workstream directive. This brief gives full context. The workstream directive gives the specific brief for that chat's deliverable.

*Last updated: April 2025 — initial brief*
