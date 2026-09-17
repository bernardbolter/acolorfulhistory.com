# Addendum — Artwork Page Build Audit (Cursor, Aug 2026)
## A Colorful History · bernardbolter.com

*Cursor's status check of `/artwork/[slug]` (built at `/[locale]/[slug]`) against the locked spec in `ach-site-design-and-architecture.md` (Brief 01).*
*Captured Aug 18 2026. Updated same day after Tier 1 fix pass and the site-wide WordPress fallback removal — see [decision-drop-wordpress-fallback.md](./decision-drop-wordpress-fallback.md).*

---

## Bottom line

Tier 1 (the two silent data bugs) is fixed. The WordPress fallback that used to mask missing Payload content has since been removed site-wide — so as of now, Payload is the only data path, full stop. An empty story column, missing AR link, or missing Wikipedia link on this page means the Payload ACH data genuinely isn't there yet, not an artifact of a fallback source with different data shape. See [decision-drop-wordpress-fallback.md](./decision-drop-wordpress-fallback.md) for the backfill checklist.

Layout and interaction (Tier 2 / Tier 3 below) are unchanged from the original audit — still first-pass stubs, not matching the locked spec.

Route note: page is wired at `/[locale]/[slug]`, not `/artwork/[slug]` as written in the spec docs — locale-prefixed routing, not necessarily wrong, but worth reconciling in the docs so future briefs reference the real path.

Live Payload check (Aug 18 2026, production bernardbolter.com): **`olderStory` / `newerStory` do not exist in the Artworks schema.** Empty StoryColumns are correct. No record can satisfy the original “Location-group stories + archive-only sale state” test. Closest browser check is `/en/brandenburger-tor-1899` — no stories, badge from archive `sold`, slider + dates present. Full dump: [payload-ach-live-audit.md](./payload-ach-live-audit.md).

---

## Tier 1 — silent data bugs — FIXED

- **`olderStory` / `newerStory`.** Mapper reads `ach.location` then root. Live schema does not have those keys anywhere — StoryColumns stay empty until Payload adds the fields (or a separate decision maps `conceptCopy`). Not a frontend read bug.
- **Status badge.** ACH `availabilityStatus` is no longer silently overwritten by archive values. `getStatusBadgeAvailability()`: prefers the MoP field if set, else maps archive `available` → "Original available" and archive sold-like states → "Sold". If neither source is set, the badge stays hidden rather than defaulting to "available" (which is what the homepage does — the artwork page intentionally does not inherit that default).

---

## Tier 2 — structural / layout mismatches vs. the locked spec (unchanged, not yet addressed)

- **ArtworkImage isn't full-bleed.** Capped at `max-width: 65vw`, locked `aspect-ratio: 3/4`, field-zone padding around it. Spec calls for full width. This also undercuts the fault-line "lower third of viewport" read.
- **Fault line positioned by document flow, not viewport.** Colors correct, but sits after the padded field zone rather than pinned to a lower-third horizon. Dense zone still missing damask texture.
- **TitleBlock z-index toggle is broken.** Click-to-send-behind only clears MiniNav, not the image (image has no z-index). Clicking the image doesn't restore the title. No "retrievable edge," no city name near the title, type undersized vs. spec.
- **MiniNav positioned wrong.** Overlaid on the image; spec wants it immediately below, left-aligned. No `overlayColors` accents. Icons are literal glyphs, not a built icon set. Slider shows on source-or-transfer instead of transfer-only. No double-tap-to-zoom.
  - **Amendment (Brief 15, Aug 27 2026):** placement is **bottom-right** below the hero, not left-aligned. Left-aligned was the Aug 18 / fix-pass-1 reading and is superseded. See [claude_addendum-hero-centering-mininav-styling.md](./claude_addendum-hero-centering-mininav-styling.md).
- **StatusBadge in the wrong page position.** Sits at top of dense zone; spec puts it last, paired with a "Full archive record →" link that doesn't exist yet.
- **HistoricalDatesTimeline has no desktop horizontal layout** — always vertical. Single accent color instead of cycling `overlayColors`.

---

## Tier 3 — features present but shallow (unchanged, not yet addressed)

- **ZoomMode is closer to a stub:** static drag lightbox, no real minimap (scaled rectangles, live position, zoom %), no placeholder-while-loading, no pinch, no combined zoom+reveal, no arrow-key panning.
- **RevealSlider** has the core mechanic (handle, three layers, `sliderAxis`, first-open auto-sweep, optional field-recording audio) but is missing the Source/Transfer vs. Transfer/Finished toggle, visitor H/V override, and the auto-sweep direction is wrong (rests at 100 instead of sweeping out-and-back to rest at 50). Opacity crossfade, not the spec's implied clip-wipe. No zoom+reveal combined mode.
- **InfoTab is two columns, not a tab switcher** (closed Brief 16, Aug 28 2026 — [claude_addendum-info-source-stories-timeline.md](./claude_addendum-info-source-stories-timeline.md)). Painting + source side by side; photographer falls back to Unknown; technique from `imageCaptureLabel`/`imageCaptureType`.
- **StoryColumns** doesn't share InfoTab's pan/scroll-snap behavior.
- **ARLink** works but is ordered after the timeline instead of before it.
- **OGImage is a stub** — 1200×1200 square + title text, not the spec's 300px thumbnail centered on the square. No `generateMetadata` for `og:title`/`og:description`.
- **TriptychLink has scope creep** — a full prev/next panel nav row not in the Brief 01 spec, and not gated to MoP-only.

---

## Confirmed working against spec

- `arEnabled` mapping and `ARLink` device-aware behavior
- Consumer-side mapping for `overlayRects`/`overlayColors`/`cityPlaceholderColor`, `transferImage`/`sliderAxis`, triptych relation, `keyHistoricalDates[]`
- `olderStory`/`newerStory` locale-aware mapping, status badge source-of-truth logic — both fixed and now single-sourced from Payload (WordPress fallback removed)

---

## Not part of this page's spec, but present in the build

- Prev/next triptych panel nav on the artwork page (belongs conceptually to the triptych page)
- Homepage list cards using blur placeholders (artwork page itself avoids this correctly)

---

## Suggested next step

1. Manually verify Tier 1 on a live record per the note above.
2. Cross-check a known MoP panel's Payload ACH Location / AR / MoP groups against the backfill table in [decision-drop-wordpress-fallback.md](./decision-drop-wordpress-fallback.md) — that's how to find which titles need `olderStory`/`newerStory`/AR video/Wikipedia link data written now that WordPress can no longer paper over the gaps.
3. Once verified, move to a Tier 2 fix pass — full-bleed image, fault-line viewport positioning, TitleBlock z-index, MiniNav placement — as its own scoped Cursor session, separate from Tier 3 interaction depth work.
