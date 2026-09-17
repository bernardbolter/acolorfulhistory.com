# Decision — Drop WordPress GraphQL fallback
## A Colorful History · acolorfulhistory.com

*Confirmed Aug 18 2026. Payload CMS (bernardbolter.com) is the sole source of truth for all site data. Not exploratory.*

Related: [addendum-artwork-page-cursor-audit.md](./addendum-artwork-page-cursor-audit.md) (Tier 1 now assumes this decision).

---

## Decision

Remove the WordPress GraphQL fallback from the entire A Colorful History codebase. Where Payload data is missing for a field, the page renders its normal empty/nullable state. Do not backfill from WordPress-shaped fields (`storyEn`, `storyDe`, `colorfulFields`, `wikiLinkEn`/`wikiLinkDe`, etc.).

---

## What was removed (runtime)

- `lib/graphql.ts` — WPGraphQL queries (`allArtwork` where `categoryName: "A Colorful History"`)
- `lib/mappers/artworkFromGraphql.ts`
- `getDataSource()` graphql branch in `lib/payload.ts` / `lib/data.ts`
- `NEXT_PUBLIC_GRAPHQL_URL` / `GRAPHQL_URL` from `.env.example`
- `artism.org` from Next.js image remote patterns
- `colorfulFields` AR/story shims on the Artwork type and Payload mapper

`artwork.artworkFields` remains as an internal view-model pages read (city, medium, nested image URL). It is populated from Payload only.

---

## Editorial backfill checklist

Live dump: [payload-ach-live-audit.md](./payload-ach-live-audit.md). Empty UI now means the Payload field is genuinely unset **or the spec field was never added to the collection**.

| Spec / old WP | Live Payload | What the visitor sees until then |
|---|---|---|
| `olderStory` / `newerStory` (or WP `storyEn` / `storyDe`) | **Not in schema.** Closest unused field: `ach.location.conceptCopy` (EN only on `brandenburger-tor-1899`) | StoryColumns hidden (both strings empty) |
| AR videos + `arEnabled` | `ach.ar.arEnabled` false on all 76; no marker/videos | AR icon / link hidden |
| Per-date Wikipedia | `keyHistoricalDates[].wikiLink` (not localized). Only Brandenburg (5) and Cliff House 1863 (3) | Timeline hidden on 74/76; those two show EN links |
| Reveal `transferImage` | Only `brandenburger-tor-1899` | Slider hidden everywhere else |
| MoP `availabilityStatus` | Empty on all; **admin group not reachable** for `a-colorful-history`. Archive Commerce status is filled | Badge uses archive `available` → Original available, sold-like → Sold |

Stories cannot be typed in admin until `olderStory`/`newerStory` are added to the ACH Location group (or Bernard decides `conceptCopy` is the left column). Do not map `conceptCopy` into StoryColumns from this site without that decision.

This list goes to Bernard for schema + editorial work on the archive, not back into ACH frontend code.
