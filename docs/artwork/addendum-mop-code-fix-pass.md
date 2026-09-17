# Addendum — MoP / Triptych Code Fix Pass (Empty Overview + Prev/Next Wrap)
## A Colorful History · acolorfulhistory.com

*Scoped code fixes following [addendum-triptych-series-cursor-audit.md](./addendum-triptych-series-cursor-audit.md). No Payload seeding. No layout polish on empty shells beyond empty-state honesty.*
*Captured Aug 25 2026.*

---

## Bottom line

Three independent code bugs are closed. Content gap (zero Triptychs / zero MoP artworks) is unchanged.

1. **Series `name` vs `title`.** `mapPayloadSeriesToSeries()` now uses `relationName(doc)` (prefer `name`, fall back to `title`, then slug). MoP overview `<h1>` reads “Mediums of Perception” again.
2. **Empty overview honesty.** With a Series document but zero triptychs, the page shows the real series title plus **Coming soon** — same honesty as the city routes.
3. **Prev/next wrap.** `TriptychLink` cycles I↔II↔III with modulo arithmetic per [addendum-triptych-panel-detail-navigation.md](./addendum-triptych-panel-detail-navigation.md). Gate unchanged (only when `triptych` relation is set). Untested on live panels until one is seeded.

---

## Repo-wide `series.name` / `series.title` sweep

| Location | Before | After |
|---|---|---|
| `lib/mappers/triptychFromPayload.ts` `mapPayloadSeriesToSeries` | `title: doc.title` → blank h1 | `relationName(doc) \|\| doc.slug` |
| `lib/mappers/artworkFromPayload.ts` | already `relationName(series)` → `seriesName` | unchanged |
| `lib/homepageArtworks.ts` `fetchSeriesNameMap` | already `doc.name ?? doc.slug` | comment only |
| `lib/mappers/media.ts` `relationName` | prefer name, then title | comment strengthened |
| `types/payload.ts` `PayloadSeriesDocument.title` | required `string` | optional; docs say use `name` |

No other consumer was reading a Series document’s `title` alone. Artwork/triptych **painting** titles correctly use Artwork `title` — left alone.

---

## Confirmed locally

- `GET /en/series/mediums-of-perception` → **200**, h1 **“Mediums of Perception”**, visible **“Coming soon”**, no empty `<h1>`.
- Wrap logic is unit-clear in `TriptychLink.tsx`; no live MoP panel to click through until Payload is seeded.

---

## Still open (not this pass)

- Seed Berlin/Munich triptychs in Payload (content task).
- MoW overview query (fetches only MoP series slug — latent Gates-shaped bug).
- City URL vs Payload `city` case (`berlin` vs `Berlin`).
- Brief 02 layout polish (mobile overlay, desktop sources, damask, Vendure).

---

*Suggested next: Bernard’s choice — Map design questions, Neighborhood Commissions page brief, or Payload MoP seeding.*
