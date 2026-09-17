# Decision — Keep a site-scope series allowlist
## A Colorful History · acolorfulhistory.com

*Confirmed Aug 25 2026 in Homepage Fix Pass 1. Not exploratory.*

Related: [addendum-homepage-fix-pass-1.md](./addendum-homepage-fix-pass-1.md) · [brief-10-homepage-artwork-query.md](../cards/brief-10-homepage-artwork-query.md)

---

## Decision

Keep `SITE_SERIES_SLUGS` in `lib/siteSeries.ts` as a **site-scope allowlist** for acolorfulhistory.com. Do not treat Payload `status: published` as “show this on this site.”

When a series is meant to appear here, **add its slug to that list**. Do not wait for the first artwork to exist — empty series (0 docs) are harmless, and forgetting the slug is how Gates of Perception stayed invisible after it was already published.

---

## Why not drop the list (brief-10 §5)

Brief-10 says not to hardcode a series allowlist and to use Series `status` for visibility. That assumes this Payload instance is ACH-only.

Live check (Aug 25 2026): bernardbolter.com has **217 published artworks** across many series (OG oils, watercolors, vanishing landscapes, digital city, etc.). `status: published` is archive-wide. An unfiltered `GET /api/artworks?where[status][equals]=published` would dump the full catalog onto this site.

So: brief-10’s rule still applies **inside** the ACH site (don’t silently omit a series that belongs here). It does not mean “fetch every published record on the shared CMS.”

---

## What belongs on this list

| Slug | Why |
|---|---|
| `a-colorful-history` | This site’s main catalogue |
| `breaking-down-art` | Brief-10; 3 published works |
| `gates-of-perception` | Brief-10 + nav; 14 published works; architecture Brief 08 is a future *tour*, not a hide-from-list rule |
| `mediums-of-perception` | Flagship series (master-brief, nav). 0 artworks today — listed so it cannot silently miss when content lands |
| `mediums-of-war` | Same. 0 artworks today |

Hero eligible query stays scoped to `a-colorful-history` (ACH tab / `heroEligible`). That is independent of this list.
