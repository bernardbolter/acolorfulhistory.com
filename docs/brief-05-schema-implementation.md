# Chat Brief 05 — Schema Implementation
## A Colorful History · Payload CMS · bernardbolter.com

*This is a Cursor implementation chat. Design decisions are complete. Build from the spec.*
*Read all referenced documents in full before writing any code.*

---

## What this chat is for

Implementing the ACH schema extension in the Payload CMS instance. This is greenfield work — a new tab on the existing Artworks collection, two new collections, and a webhook endpoint. No existing fields are modified.

---

## Documents to read before starting

Read these in order. Do not skip any.

1. `artist-archive-schema-final.md` — the base archive schema. Understand the conventions, field naming, layer system, and what NOT to do before touching anything.
2. `handoff-ach-schema-extension.md` — the complete spec for everything to be built in this chat. This is the authoritative source.
3. `design-system.md` — not for implementation, but read Part 1 (Philosophy) to understand what this project is.

---

## What gets built in this chat

### 1. ImageCaptureTechnologies collection (Part 1 of handoff)
A new Payload collection. No dependencies — implement first.

### 2. Seed records for ImageCaptureTechnologies (Part 1.2)
The initial vocabulary of 11 technology slugs. Seeded via a Payload seed script.

### 3. ACH tab on Artworks collection (Part 2 of handoff)
A new tab added to the existing Artworks collection config. Seven field groups. Do not touch any existing base archive fields.

### 4. Triptych commerce fields (Part 3 of handoff)
New fields added to the existing Triptychs collection. Includes the `printSets` array and private provenance fields.

### 5. SmallPrints collection (Part 4 of handoff)
A new Payload collection for the RIBBA set builder. Relates to Artworks.

### 6. Vendure webhook endpoint (Part 3.3 of handoff)
A Next.js API route that receives Vendure sale events and decrements `printAvailableCount` on the correct Triptych record.

### 7. JSON-LD extension (Part 5 of handoff)
Extend `generateArtworkJsonLd.ts` to include ACH fields in the VisualArtwork output.

---

## Implementation order

Follow this exactly. Do not reorder.

| Step | Task |
|---|---|
| 1 | `ImageCaptureTechnologies` collection |
| 2 | Seed ImageCaptureTechnologies records |
| 3 | ACH tab — Groups 1, 2, 7 |
| 4 | ACH tab — Group 3 (Source Photograph) |
| 5 | ACH tab — Groups 4, 5, 6 |
| 6 | Triptych commerce fields + webhook endpoint |
| 7 | SmallPrints collection |
| 8 | JSON-LD extension |

Use the Cursor prompt templates in Part 6 of the handoff for each step. Each template has read-first instructions, task, constraints, and done-when criteria.

---

## Hard rules — read before writing any code

These are non-negotiable. Violations require a full revert.

- **Payload v3 syntax only** — no v2 patterns
- **No language-suffix field variants** — never `titleDE`, `conceptCopyEN` etc. Always `localized: true` on the field
- **No auto-publish** — default status always `draft` on every collection
- **No hardcoded JSON-LD** — all output generated programmatically from stored field values
- **Private fields are always access-controlled** — `access: { read: artistOrAdmin }`, never in public API response
- **ACH tab is a tab on Artworks, not a new collection** — do not create a separate ACH collection
- **No base archive fields duplicated** — title, year, medium, dimensions, series, city, country, status, primaryImage are on the base record, not the ACH tab
- **`overlayColors` and `arButtonColors` must enforce exactly 3 items** — array length validation required
- **`printAvailableCount` is read-only in admin** — updated by webhook only, never manually
- **`originalsSoldDate` and `originalsBuyer` never in public API** — private fields
- **SmallPrints `artwork` relation must enforce `orientation: square`** — validate hook required
- **Webhook endpoint must verify Vendure secret before any Payload write**
- **Prices never stored in Payload** — price lives in Vendure only

---

## Environment and stack

- **CMS:** Payload v3
- **Framework:** Next.js 14+ (App Router)
- **Storage:** Cloudflare R2 (all media uploads)
- **Database:** PostgreSQL (Payload default)
- **Languages:** TypeScript throughout
- **Localisation:** EN / DE — `localized: true` fields render EN/DE tabs in Payload admin

---

## Files to create or modify

| File | Action |
|---|---|
| `src/collections/ImageCaptureTechnologies.ts` | Create |
| `src/collections/Artworks.ts` | Modify — add ACH tab only |
| `src/collections/Triptychs.ts` | Modify — add commerce fields only |
| `src/collections/SmallPrints.ts` | Create |
| `src/payload.config.ts` | Modify — register new collections |
| `src/app/api/webhooks/vendure-sale/route.ts` | Create |
| `src/utilities/generateArtworkJsonLd.ts` | Modify — add ACH fields |
| `src/seed/imageCapturetechnologies.ts` | Create |

Do not modify any other files. Do not touch any existing collection fields.

---

## Done when

- [ ] All 8 steps complete
- [ ] ImageCaptureTechnologies appears in Payload admin with all fields and EN/DE tabs
- [ ] ACH tab appears on Artwork records with all 7 groups
- [ ] Group 7 fields hidden on non-MoP/MoW artworks via `admin.condition`
- [ ] `overlayColors` enforces exactly 3 items
- [ ] `arEnabled: true` blocked by validate hook unless `arMarkerFile` is uploaded
- [ ] Triptych commerce fields present, `printAvailableCount` read-only in admin
- [ ] `originalsSoldDate` and `originalsBuyer` not accessible via public API
- [ ] SmallPrints collection registered, `artwork` relation validates `orientation: square`
- [ ] Webhook endpoint accepts POST, verifies secret, decrements correct `printAvailableCount`, returns correct status codes
- [ ] JSON-LD outputs `locationCreated.sameAs` as array with both Wikidata and TGN URIs when present
- [ ] JSON-LD outputs `isBasedOn` block when `sourceImage` exists, omits it when null
- [ ] `isBasedOn.creator` is a typed object, never a plain string
- [ ] No existing archive fields modified
- [ ] No hardcoded values anywhere
