# Payload schema — Neighborhood Commissions page
*For bernardbolter.com Payload. Consumer: acolorfulhistory.com `/neighborhood`.*
*Written Aug 25 2026.*

---

## Why a global (not a collection)

Same pattern as `experience-page`: one editorial page, locale-aware copy, arrays of curated media. ACH reads `GET /api/globals/neighborhood-page?locale=en|de&depth=2`.

Until this global exists and is populated, the ACH site renders solid static defaults from `lib/neighborhoodDefaults.ts` (silent 404 / empty global).

---

## Global slug

`neighborhood-page`

---

## Fields

| Field | Type | Localized | Notes |
|---|---|---|---|
| `title` | text | yes | Nav/page title — **Neighborhood Commissions** |
| `kicker` | text | yes | e.g. *A Colorful History — San Francisco* (page context, not nav label) |
| `introduction` | richText | yes | Core pitch paragraph |
| `pitch` | richText | yes | Berlin / SF honest frame |
| `credibility` | richText | yes | Archive / 30+ year practice trust copy |
| `tiers` | array | — | Ordered; expect three entries |
| `tiers[].id` | select | no | `browse` \| `revisited` \| `research` |
| `tiers[].title` | text | yes | |
| `tiers[].body` | richText | yes | |
| `tiers[].images` | array | — | Source photos / proof pieces |
| `tiers[].images[].id` | text | no | Stable key for React / analytics |
| `tiers[].images[].title` | text | yes | |
| `tiers[].images[].neighborhood` | text | yes | optional |
| `tiers[].images[].yearLabel` | text | yes | e.g. *c. 1910* |
| `tiers[].images[].image` | upload → media | no | Tier 1 browse photos; Tier 2 when available |
| `tiers[].images[].caption` | textarea | yes | |
| `tiers[].images[].proofUrl` | text | no | External URL (ArtSpan event record, etc.) |
| `tiers[].images[].proofLabel` | text | yes | Link label |
| `pricing.headline` | text | yes | e.g. *Founding collectors* |
| `pricing.body` | richText | yes | Launch-pricing framing |
| `pricing.sizeLabel` | text | yes | `36″ × 36″` |
| `pricing.priceLabel` | text | yes | `$1,800` |
| `pricing.batchLabel` | text | yes | `5 commissions` |
| `pricing.note` | textarea | yes | Designer/agent note, etc. |
| `inquiryEmail` | email | no | Mailto target for the inquiry form |
| `ctaLabel` | text | yes | Form submit / section heading |

---

## Access

Public read (same as other ACH-facing globals). Writes admin-only.

---

## Future (not this ship)

| Piece | Notes |
|---|---|
| `commission-inquiries` collection | Persist form submissions instead of mailto; needs write API + spam protection |
| Per-city routes `/neighborhood/[city]` | Mirror MoP: overview at `/neighborhood`, city detail beneath — only when a second city exists |
| Vendure deposit product | 50% start / balance on delivery — after a commission is agreed, not a catalog SKU |
| Commission brief uploads | Wall photos belong in a later intake step, not the first lightweight form |

---

## Seed suggestion (first CMS pass)

1. Create global, paste EN copy from `lib/neighborhoodDefaults.ts`.
2. Add DE locale variants (or leave DE falling through to EN until translated).
3. Set `inquiryEmail`.
4. Upload Tier 1 browse photos as they clear rights.
5. Keep ArtSpan proof link on the revisited tier item (`https://bernardbolter.com/events/artspan-selections-2017-heron-arts`).
