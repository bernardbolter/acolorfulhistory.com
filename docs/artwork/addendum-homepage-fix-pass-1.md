# Addendum — Homepage Fix Pass 1 (Honesty Fixes)
## A Colorful History · acolorfulhistory.com

*Scoped fix pass following [addendum-homepage-cursor-audit.md](./addendum-homepage-cursor-audit.md). Hero choreography, list-card copy, sort/filter UI, and nav visual styling were not touched.*
*Captured Aug 25 2026.*

---

## Bottom line

Three silent “looks correct, isn’t” bugs are closed.

1. **Hero.** Live CMS `heroEligible` pool is still **zero**. The homepage now degrades to a plain list instead of animating a hardcoded local-JSON painting. Local geometry remains behind `HERO_DEV_FALLBACK_SLUG` (unset in `.env.local` / production).
2. **Docs.** Canonical `docs/design-system.md` no longer contains the WordPress Image sample. `docs/design/design-system.md` is a stub pointing at the canonical file.
3. **Series.** Git history had **no** rationale for excluding Gates. The allowlist was **not** deleted (Payload is a 217-work shared archive). `gates-of-perception` was added. Homepage list is **76** cards (59 ACH + 3 BDA + 14 Gates). `/en/anhalters-tor-2018` now 200s.

---

## Step 1 — Hero fallback

### What changed

- `getHeroEligibleArtwork()` (`lib/homepageArtworks.ts`) queries `ach.hero.heroEligible: true` and returns **`null` on an empty pool**. There is no `pickRandomHeroPoolSlug()` in that default path.
- `app/[locale]/page.tsx` already passed `showHero={showHero && Boolean(heroArtwork)}`; `PaintingList` only mounts `HeroListItem` when both are set. Empty pool → ordinary `ListCard` column. List/filter code still does not know the animation exists.
- Opt-in: `HERO_DEV_FALLBACK_SLUG` (documented in `.env.example`). Values: a slug, or `random` / `true` / `1`. `HERO_FORCE_SLUG` is still the in-code lock, but it is **only honored when that env var is set** — a leftover non-null constant cannot ship a fake hero on its own. It remains `null`.
- `HeroFieldLayer.tsx`, `hero-timeline.ts` choreography, and the grayscale photo fallback were not edited.

### Confirmed

- Live `GET /api/artworks?where[ach.hero.heroEligible][equals]=true` → **`totalDocs: 0`** (unchanged; nothing was seeded).
- Local `GET /en` (dev, no `HERO_DEV_FALLBACK_SLUG`): **`hero-list-item` count 0**, **`hero-list-play` count 0**, **`painting-list-item` count 76**. First titles are ordinary list cards (e.g. Dennewitz Strasse 1905, Alcatraz 1938) — no pin, no play button, no full-viewport photo stage.

### Still open

- Seed at least one Payload record (`heroEligible` + `heroFields` + `heroPhoto`) before the real animation can run in production. Validate hook on bernardbolter.com still cannot be inspected from this repo.
- Local JSON in `resolveHeroAnimationPayload()` still fills geometry when Payload fields are empty **on a hero that was already selected**. Production will not select one until the CMS pool is non-empty (or the env flag is set). Fix Pass 3 can decide whether that secondary fallback stays.

---

## Step 2 — Design-system WordPress sample

### What changed

- **Canonical file is `docs/design-system.md`.** Every brief that says “read `design-system.md`” already pointed here (`docs/build-plan.md`, brief-07/08/10/12, architecture doc, etc.). `docs/design/design-system.md` was an unmarked duplicate that had already drifted.
- Canonical §6, map-popup width table, and §14 now use `artwork.aspectRatio`. §20 Image sample is `artwork.primaryImageUrl` + `aspectRatio ?? 1`. `CITY_PLACEHOLDER` / `mediaDetails.sizes[1].sourceUrl` / `artworkFields.proportion` are gone as copy-paste samples (they remain only as “do not use” warnings).
- `docs/design/design-system.md` is now a **five-line stub** pointing at `docs/design-system.md`. The retired snippet is not in that file.
- `docs/artwork/brief-09-list-card-images.md` got a superseded banner (it still said `artwork.proportion`). Left `docs/cards/brief-10` and `brief-12` alone — those mention the old names as the thing being retired.

### Confirmed

- Repo markdown search: no remaining **usable** Image sample with `artworkFields.artworkImage.mediaDetails.sizes[1].sourceUrl` or `width={100 * artwork.artworkFields.proportion}`.
- Code still reads `artworkFields` for city/orientation/medium (`ListCard.tsx`, etc.) — out of scope, as the audit said.

### Still open

- Code-level `artworkFields.proportion` / `mediaDetails` on the mapper view-model (audit Tier 1, later pass).

---

## Step 3 — Series allowlist

### What I found

- `lib/siteSeries.ts` is **untracked** — no git history, no commit message.
- `git log -S 'SITE_SERIES'` / `-S 'breaking-down-art'` on `lib/` produced nothing useful. `.env.example` previously said this site filters to `seriesSlug=a-colorful-history`. `payload-ach-live-audit.md` recorded the ACH+BDA filter as current behavior, not as a product decision to hide Gates.
- Architecture Brief 08 (`docs/ach-site-design-and-architecture.md`) is a **Tours** collection / map-tour treatment for Gates — it does not say “keep Gates off the general artwork list.”
- Nav already lists “the Gates of Perception” under Series (`href: '#'` still; nav stubs are Fix Pass 3).
- Brief-10 is explicit that Gates should come back from the site query.

**Why the allowlist was not deleted:** live Payload has **217 published artworks**. Series `status: published` is archive-wide (oils 32, vanishing landscapes 29, watercolors 29, digital city 28, …). Dropping `SITE_SERIES_SLUGS` would dump the full bernardbolter.com catalog onto acolorfulhistory.com. Brief-10’s “no client allowlist” assumes Series `status` is the ACH-site visibility switch; on this shared CMS it is not.

### Path taken

Kept a **site-scope** allowlist. Added `gates-of-perception`. Did not add Mediums of Perception / Mediums of War (0 artworks; prompt said leave that alone). Hero eligible query still scopes to `a-colorful-history` (ACH tab).

### New homepage query counts (published, live)

| seriesSlug | Before | After |
|---|---|---|
| `a-colorful-history` | 59 | 59 |
| `breaking-down-art` | 3 | 3 |
| `gates-of-perception` | **0 (excluded)** | **14** |
| **homepage list** | 62 | **76** |

`/en/anhalters-tor-2018` returns **200** (was excluded by `getArtworkBySlug`’s site filter). BDA `/en/venice-in-the-middle` still 200.

---

## Suggested next step

Fix Pass 2 / 3 as already queued in the audit — do not mix them into this diff:

1. Hero choreography vs the scroll-scrub/play-button that shipped (only after a CMS record is seeded, or behind `HERO_DEV_FALLBACK_SLUG`).
2. List-card copy (single metadata line, Josefin weight, series tag).
3. Nav panel surface + Browse group; optionally turn the Gates `#` stub into a real series route.
4. Sort/filter UI still hidden — do not uncomment without fixing paint-year vs historical-year.

`HERO_DEV_FALLBACK_SLUG=random` locally is the way to keep tuning the animation without putting the silent pool back into production.
