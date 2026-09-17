# Structural Audit + Trade Repositioning
## A Colorful History · acolorfulhistory.com

*Written Sept 12 2026. Audited against the actual codebase at
`Desktop/color/web/acolorfulhistory.com`, not against the briefs — the briefs
are stale in at least one material way (see §1.1).*

*Scope: audit the site as built, then propose a structure that serves interior
designers and real estate agents alongside the existing art-first experience.
City-agnostic structure, San Francisco content first.*

*This is a decision document, not a Cursor brief. Nothing here goes to Cursor
until §6 is answered.*

---

# 1. What is actually there

## 1.1 The briefs are stale in one important way

`claude/site-scaffolding-status-aug2026.md` and the Sept 1 roadmap both say
Neighborhood Commissions has **"Nothing built. No page design brief yet."**

That is no longer true. As of the Aug 31 commit the repo contains:

- `app/[locale]/neighborhood/page.tsx`
- `components/Pages/NeighborhoodPageShell.tsx` (8.6 KB — hero, pitch,
  credibility, three tiers, pricing block, inquiry section)
- `components/Neighborhood/InquiryForm.tsx` (name, email, neighborhood, tier
  select, room notes, message)
- `lib/neighborhoodDefaults.ts` (full EN + partial DE copy, hardcoded)
- `docs/SFpainting/neighborhood-payload-schema.md` (the `neighborhood-page`
  global spec)
- `neighborhood` already in `lib/reservedSlugs.ts`
- Nav entry already wired under **More**

The page was built straight from the Aug 25 content brief without an
intermediate design brief. It renders today on static defaults
(`fromCms: false`) because the Payload global `neighborhood-page` has not been
created yet. **Editing that page currently means editing TypeScript.**

Everything below assumes this, not the status doc.

## 1.2 Route inventory — verified

| Route | State | Notes |
|---|---|---|
| `/` | **Built** | `PaintingList` — hero + shuffled cards |
| `/map` | **Built** | MapLibre, predates the brief series |
| `/[slug]` | **Built** | Full artwork page — zoom, reveal, stories, timeline, triptych link, status badge |
| `/[slug]/ar` | **Built** | `ARViewer` |
| `/series` | **Redirect → `/`** | Former series explorer, now a stub |
| `/series/mediums-of-perception` | **Built, empty** | Renders "Coming soon" — zero Triptych records |
| `/series/mediums-of-perception/[city]` | **Built, empty** | Same |
| `/experience` | **Built** | CMS-driven singleton |
| `/neighborhood` | **Built** | Static defaults, mailto intake |
| `/store` | **Placeholder** | `PlaceholderPage` → "Coming soon" |
| `/about` | **Placeholder** | `PlaceholderPage` → "Coming soon" |
| `/archive.jsonld` | **Built** | Public corpus |
| `/design-system` | **Built** | Internal reference |

## 1.3 Navigation — verified in `components/UI/Nav.tsx`

```
Browse        List                      → /
              Map                       → /map

Series        Mediums of Perception     → /series/mediums-of-perception  (empty)
              Breaking Down Art         → #      DEAD
              the Gates of Perception   → #      DEAD
              Mediums of War            → #      DEAD

More          Experience                → /experience
              Neighborhood Commissions  → /neighborhood
              Art Prints                → /store   ("Coming soon")
              About                     → /about   ("Coming soon")
```

**Ten nav links. Five lead nowhere real** — three `#` stubs plus two
placeholder pages. The only page on the site that asks anyone for money is
sixth in the list, in a group called *More*, below an AR explainer.

## 1.4 The built-and-switched-off filter system

This is the most consequential finding in the audit.

`components/Home/HomeListControls.tsx` is a complete, working filter and sort
bar — sort (random / recent / chronological) plus series, city, decade and
availability facets. `lib/homepageArtworks.ts` has the whole supporting
apparatus: `parseHomepageFilters`, `buildServerSearchParams`,
`getHomepageFacets`, `buildFacetsFromDocs`.

`PaintingList.tsx` line 34:

```tsx
{/* HomeListControls hidden for now — will become a fixed-position component later. */}
```

`HomeListControls` is imported by nothing. `getHomepageFacets` is called by
nothing. Both are dead code in a working state.

---

# 2. Five structural problems for a trade buyer

## 2.1 The site cannot be searched the way a designer thinks

The facets that exist — series, city, decade, availability — are
**art-historical axes**. They answer *what is this work about*.

A designer specifying a room filters on: **size, orientation, palette, price
band, lead time, availability**. Not one of the first four is exposed.

The genuinely good news, and the reason this is a cheap fix rather than a
rebuild: **the data is already on every list card.**
`mapPayloadArtworkForList` returns, for every artwork, at `depth=1`:

| Field | Source | Designer use |
|---|---|---|
| `sizeTier` | `doc.sizeTier` — `md \| lg \| xl` | Scale band |
| `widthCm` / `heightCm` | `widthWhole` / `heightWhole` | Exact wall fit |
| `artworkFields.orientation` | `doc.orientation` | Portrait / landscape / square |
| `aspectRatio` | `doc.aspectRatio` | Proportion matching |
| `ach.overlayColors` | `ach.overlay.overlayColors[]` — 3 hex per painting | **Palette** |
| unified availability | `ach.mop.availabilityStatus` + archive status | Can I get it |

`overlayColors` is the standout. Three hex values per painting, already
extracted for the hero animation, already on the card object, currently used
only to tint a blur placeholder. That is a palette facet sitting in the data
unused — the single most designer-native filter a painting site can offer, and
it costs a bucketing function, not a schema change.

`buildFacetsFromDocs` reads five fields off each doc and ignores all of the
above.

## 2.2 The default view is randomised

`filters.sort` defaults to `'random'`, and `getHomepageArtworks` calls
`shuffleArtworks` on every request. For an art visitor that is a nice gesture —
the collection feels alive.

For trade it is actively hostile:

- A designer cannot send a client "the third one down."
- Returning to a painting seen yesterday means scrolling and hoping.
- The same link shows two people two different things — which is a problem when
  the designer and their client are on a call together.

Compounding it: `isDefaultHomepageView()` allows the hero **only** when no
filter or sort is active. The moment anyone filters, the site loses its most
seductive element. The art visitor gets the beauty; the buyer gets a plain list.
That is exactly backwards from what this pivot wants.

## 2.3 There is no price anywhere on the site

Locked principle: *never store prices in Payload — Vendure only.* Vendure is
not built. `/store` is a placeholder. `lib/vendure.ts` exists and is unused.

Net effect: the **only** price string anywhere in the codebase is `'$1,800'`,
hardcoded in `lib/neighborhoodDefaults.ts`.

Designers and agents work to budget lines. A work with no price is not a work
they can shortlist — it is a work they have to email about before they know
whether it is even in range, and they mostly will not. The "inquire for price"
convention is a gallery convention, and going outside the gallery model was the
whole point.

This does not require breaking the Vendure principle. A **price band** is not a
price (see §5).

## 2.4 Availability silently defaults to "available"

`resolveUnifiedAvailability` in `lib/unifiedAvailability.ts`:

```ts
if (archiveStatus && ARCHIVE_SOLD_STATUSES.has(archiveStatus)) return 'sold'
return 'available'   // ← fallthrough
```

An artwork with neither `ach.mop.availabilityStatus` nor archive
`availabilityStatus` set reads as **available**. Across a 217-work archive with
a five-series site allowlist, that is a real chance of showing a designer
something that is sold, on loan, or in a private collection.

Tolerable when the site is a catalogue raisonné. Not tolerable when the site is
a shop and the person reading it is about to put it in a client presentation.

(Note `getStatusBadgeAvailability` deliberately does *not* default — so the
artwork-page badge and the list filter can disagree about the same painting.)

## 2.5 The commission intake is a `mailto:`

`InquiryForm.tsx` assembles a plain-text brief and does:

```ts
window.location.href = `mailto:${inquiryEmail}?subject=…&body=…`
```

No persistence, no confirmation, no record. If `inquiryEmail` is unset — it
resolves from `process.env.NEIGHBORHOOD_INQUIRY_EMAIL`, which is present in
`.env.example` but **commented out** at line 20, so it is unset unless you
added it to `.env.local` — the form silently degrades to *copying the brief to
the clipboard*, which is not a conversion path at all. Worth a 30-second check
that it is actually set in whatever environment this deploys to.

Three failure modes for a trade buyer specifically:

1. Designers work on machines where the default mail client is often
   unconfigured or is webmail. `mailto:` opens nothing, or opens Mail.app
   signed into a personal account.
2. There is no way to attach wall photos — which is the *one thing* that makes
   a remote-briefed commission workable from Berlin, and which the original
   brief itself identifies as essential.
3. Nothing is stored, so there is no follow-up list, no way to know how many
   inquiries the page has produced, and no way to tell whether any of this is
   working.

The `commission-inquiries` collection is already sketched in
`neighborhood-payload-schema.md` under *"Future (not this ship)."* It should be
promoted to *this ship*.

---

# 3. The argument

## 3.1 The site is built for a reader; the buyer is not reading

Every strong thing about ACH is built for sustained attention: the reveal
slider through source → transfer → finished, the older/newer story columns, the
historical date timeline, AR, the tour infrastructure, the JSON-LD corpus for
machines. It is a genuinely unusual art site and the depth is the moat.

None of it helps someone who has a 72 × 48 inch wall in a Pacific Heights
listing and eleven days.

The mistake to avoid is concluding that the depth should be reduced. It should
not. It is the reason a stranger trusts a commission — the Aug 25 brief gets
this exactly right: *this isn't a new artist asking for trust, it's a long
practice finally showing its work.* The archive is the credential.

**The correct move is not to make the art site more commercial. It is to build a
second, shallow, fast path through the same material, and let the depth sit one
click away as proof rather than as the road.**

## 3.2 Designers and agents are not one audience

The Aug 25 brief treats them as one line — *"Designer/agent-referred
commissions: hold higher, $2,500–3,000+."* They are two different products.

| | Interior designer | Real estate agent |
|---|---|---|
| Buying for | A client's room, specified months out | A listing, or a closing gift |
| Timeline | 8–16 weeks is normal | Days to weeks — **a commission is almost always wrong** |
| Decides on | Size, palette, how it sits with the scheme | Price point, local delivery, "will this photograph well" |
| Needs from you | Trade terms, lead time, in-situ images, options to present to their client, invoicing | Available now, under a budget line, delivered/hung, one decision |
| Repeat potential | High — one good project becomes three | Moderate — but volume, and they talk to each other |
| Right product | Commission, or a large available original | **Available original, or a print** |

A single page addressed to "designers and agents" will serve the designer badly
and the agent not at all. The agent path barely touches `/neighborhood` —
agents want the *existing* work, fast, priced.

That reframes what is missing. It is not mainly a commissions problem. **It is
that the site has no route that says "here is work you can have, at this size,
in this palette, for this much, by this date."** The store is a placeholder, the
filters are switched off, and no price is displayed. The commission page is the
only commercial surface, and it is the slowest, most bespoke, most expensive
product of the three.

## 3.3 Where the trade lane lives

Two models were considered.

**Model A — a lane inside ACH.** One domain, one archive, one build. The
credibility story stays attached to the offer.

**Model B — a separate trade front door.** Cleaner audience separation, no risk
of the shop tone leaking into the art site. But it is a second build, a second
deploy, a second content surface — with the store still unbuilt, MoW content
still not seeded, and the map brief still unresolved.

**Recommend A**, with one correction: the trade lane needs a real front door,
not a slot in *More*. The archive proximity is the whole differentiator — a
standalone trade site would be a stranger asking for $1,800, which is precisely
the position the brief works so hard to escape.

The tone risk in Model A is real but manageable, because of how trade buyers
actually arrive.

## 3.4 They arrive by link, not by browsing

A designer does not discover you through the homepage. They get a URL in an
email after a studio visit, an SF trip introduction, or a referral. The agent
gets it from the designer.

So the trade page must **work cold** — carry the entire offer on one screen's
worth of scroll, with no assumed context and no prerequisite tour of the
archive. Sizes, price bands, lead time, terms, proof, and a real intake, all on
the page.

This has a useful consequence: getting the deep page right matters far more
than restructuring the homepage. The homepage changes in §4 are worth doing and
they are cheap, but they are second priority. **The trade page is the work.**

---

# 4. Proposed route map

New routes marked **NEW**. Everything else exists.

```
/                          Browse — list           (filters ON, sort default changed)
/map                       Browse — map
/available             NEW Work available now — grid, size + palette + price band
/[slug]                    Artwork

/series                NEW Series index            (currently redirects to /)
/series/a-colorful-history          NEW    ← the series the commissions belong to
/series/mediums-of-perception              existing
/series/mediums-of-perception/[city]       existing
/series/mediums-of-war              NEW    ← replaces nav # stub
/series/gates-of-perception         NEW    ← replaces nav # stub
/series/breaking-down-art           NEW    ← replaces nav # stub

/trade                 NEW Trade front door — designers and agents, two lanes
/neighborhood              Commissions             (exists; gains a trade section)
/neighborhood/[city]       later — only when a second city exists

/store                     Prints                  (still placeholder)
/experience                AR
/about                     About                   (still placeholder)
/archive.jsonld            Public corpus
```

## 4.1 `/available` — the workhorse

The route both audiences actually use, and the one that does not exist.

Not the homepage with a filter preset. The homepage is an editorial,
single-column, deliberately slow reading experience with a self-painting hero.
`/available` is a **specification grid**: thumbnail, title, dimensions in cm and
inches, orientation, palette swatches from `overlayColors`, price band, lead
time, status. Stable sort. Shareable URL with filters in the query string, so a
designer can send *exactly* what they are looking at.

Everything it needs is already on the list card object except price band and
lead time (§5).

This is the highest-value new route on the list. If only one thing gets built,
build this.

## 4.2 `/trade` — one page, two lanes

A single page with two clearly separated sections rather than
`/trade/designers` and `/trade/agents`. One page to write, one to maintain, and
the split is legible on the page itself. Promote to separate routes only if the
traffic justifies it.

Structure:

```
Who this is for — one sentence, then the fork

  FOR INTERIOR DESIGNERS
    Working sizes and formats available
    Palette-led selection → /available
    Commission path, lead time, what a brief needs → /neighborhood
    Trade terms — discount, deposit, invoicing, W-9
    Installed work — in situ images                    ← content gap, §5
    Proof: ArtSpan Selections 2017, auction resale, prior designer commission

  FOR REAL ESTATE AGENTS
    Available now, delivered — the fast path → /available?availability=available
    Price bands that fit a closing-gift or staging budget
    Local SF delivery and hanging; Berlin equivalent later
    Turnaround in days, not weeks
    Staging vs. gift — two different asks, named plainly

Contact — a real form, not a mailto
```

The Berlin/SF honest frame stays on `/neighborhood` where it does trust work
for a bespoke commission. On `/trade` it is a distraction — an agent does not
care where you live, only whether the painting arrives before the open house.

## 4.3 Revised navigation

```
Browse         List                      → /
               Map                       → /map
               Available now             → /available            NEW

Series         A Colorful History        → /series/a-colorful-history   NEW
               Mediums of Perception     → /series/mediums-of-perception
               Mediums of War            → /series/mediums-of-war       NEW
               Gates of Perception       → /series/gates-of-perception  NEW
               Breaking Down Art         → /series/breaking-down-art    NEW

Commissions    Neighborhood Commissions  → /neighborhood          MOVED UP
               For designers & agents    → /trade                 NEW

More           Experience                → /experience
               Prints                    → /store
               About                     → /about
```

Three `#` stubs die. The commercial paths get their own group at eye level
instead of sharing *More* with an AR explainer. Ten links become twelve, but
twelve that resolve.

`a-colorful-history` deserves a series page of its own: it is the main series,
it is what the commissions extend, and right now `/series` redirects to `/` so
the series the whole offering sits inside is invisible as a body of work.

## 4.4 Homepage changes — cheap, second priority

1. **Turn the filter bar on.** It is built and dead. One import.
2. **Add the designer facets** to `buildFacetsFromDocs`: size tier, orientation,
   palette bucket, price band. All but price band come free from data already on
   the card.
3. **Change the default sort** from `random` to `recent`, keeping `random` as an
   explicit option. Preserves the gesture; stops the link being non-deterministic.
   *Alternatively* — seed the shuffle per session rather than per request, so a
   link is stable for the person who sends it. That keeps the aliveness and fixes
   the sharing problem. Worth discussing; it is the better answer if the shuffle
   matters to you.
4. **Let the hero survive filtering** — or at least survive sorting. Losing the
   best thing on the site the instant someone engages with it is the wrong trade.

---

# 5. What this implies for schema

Following the locked principles: ACH tab only, base archive fields never
modified, no prices in Payload, globals for editorial pages.

## 5.1 New ACH tab group on Artworks — `ach.trade`

| Field | Type | Notes |
|---|---|---|
| `tradeEligible` | boolean | Not every work should be offered to trade. Default false. |
| `priceBand` | select | `under-1k` \| `1-3k` \| `3-5k` \| `5k-plus` \| `poa`. **A band is not a price** — the actual figure still lives only in Vendure. This satisfies the designer's shortlist question without breaking the principle. |
| `leadTimeWeeks` | number | Nullable. Available work → 0–2; commission → 8–16. |
| `installedImages` | array → media | **The biggest content gap on the site.** |
| `installedImages[].caption` | text, localized | Room / context |
| `installedImages[].credit` | text | Designer or photographer credit where applicable |

### On `installedImages`

Every image in the system is a 1600 × 1600 square painting on flat colour. That
is right for the archive and right for the art pages.

Designers do not buy paintings. They buy *a painting on a wall in a room*. The
entire trade proposition rests on images that do not currently exist anywhere in
the schema or, as far as the brief indicates, in the photo library — the one
known installed piece has a lost photograph, which the Aug 25 brief already
flags as worth chasing.

**This is a shoot, not a build.** No amount of routing fixes it. If the October
SF trip produces one thing beyond paintings, it should be photographs of
finished work hung in real rooms — including, if the owners agree, work already
placed. That asset unlocks `/trade` in a way no code does.

## 5.2 New global — `trade-page`

Mirrors the `neighborhood-page` pattern exactly: locale-aware copy, arrays of
curated media, static defaults in `lib/tradeDefaults.ts` until seeded. Same
shape, same fallback behaviour, no new pattern to learn.

## 5.3 Promote `commission-inquiries` to a real collection

Already specced as future work. Fields: name, email, audience
(`collector | designer | agent`), neighborhood/address, tier, room notes,
budget band, timeline, message, source page, created date. Write API with spam
protection; file uploads for wall photos in a second step, not the first form.

The `audience` field matters — it is what lets you tell, six months from now,
whether the trade pivot actually did anything.

## 5.4 Facet extension — no schema change

`HomepageFacets` gains `sizeTiers`, `orientations`, `palettes`, `priceBands`.
The first three are derivable in `buildFacetsFromDocs` from data the list query
already returns at `depth=0`. Only `priceBands` needs 5.1.

Palette bucketing: cluster the three `overlayColors` hex values per painting
into a small named set — warm / cool / neutral / earth / high-contrast, or
whatever vocabulary you prefer. Client-side, no fetch, no CMS work. Start with
five buckets; the naming is an aesthetic decision, not a technical one, and it
should be yours.

---

# 6. Decisions needed before any of this becomes a brief

Working conversationally first, as always. Nothing goes to Cursor until these
are settled.

1. **Model A confirmed?** Trade lane inside ACH, `/trade` as a real nav group —
   versus a separate front door. I argue A in §3.3.

2. **Price bands on the site — yes or no?** This is the biggest single
   conversion lever and the one that most changes how the site feels. A band is
   not a price and does not breach the Vendure principle, but it does mean
   numbers appear next to paintings for the first time.

3. **Does the shuffle stay?** Per-request random is the current behaviour and it
   breaks link-sharing. Options: switch the default to `recent`; or seed the
   shuffle per session so a link stays stable. I lean session-seeded — it keeps
   what the shuffle is *for*.

4. **Agents: which product?** My read is that agents want available originals
   and prints, not commissions — which makes `/store` a blocker for that half of
   the audience, and pushes `/available` to the top of the build order. Does
   that match what you are hearing from them?

5. **Are there in-situ photographs anywhere?** Old client photos, installation
   shots, anything from the ArtSpan showing or the earlier designer commission.
   This determines whether `/trade` can launch with proof or launches thin and
   waits for October.

6. **SF-first content, but what about the Berlin lane?** The structure proposed
   here is city-agnostic. The content is entirely SF. Berlin trade — designers,
   Immobilienmakler, staging firms — has no groundwork at all, and you are
   physically there. Worth deciding whether Berlin is a later phase or should
   shape the copy now.

7. **Build order.** My proposed sequence, if the answers above hold:

   ```
   1. Turn the filter bar on + designer facets          — hours, pure win
   2. /available                                        — the workhorse route
   3. commission-inquiries collection + real form       — fixes the broken funnel
   4. /trade page                                       — needs §6.5 answered
   5. Nav restructure + series routes                   — kills the # stubs
   6. ach.trade schema + installedImages                — needs the October shoot
   ```

   Note this sequence deliberately does **not** wait for the store, and does not
   compete with the MoW/AR/store work still open from the Sept 1 roadmap. Items
   1–3 are independent of all of it.

---

*Written by Claude, Sept 12 2026. Audited against the repo at commit state of
Aug 31 2026. Supersedes the Neighborhood Commissions rows in
`claude/site-scaffolding-status-aug2026.md` and the Sept 1 roadmap, both of
which predate the `/neighborhood` build.*
