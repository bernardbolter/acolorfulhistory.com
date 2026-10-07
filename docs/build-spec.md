# Build Spec — acolorfulhistory.com

**The product specification every build task reads from.** Written 16 September 2026.

`CLAUDE.md` says what the repo *is* — stack, hard rules, known-broken, what not to
trust. This document says what to *build*. Where they overlap, `CLAUDE.md` wins on
code facts and this document wins on product intent.

Code claims here were verified against the three read-only audits in
`docs/artwork/` (`addendum-route-component-inventory.md`,
`addendum-style-guide-reconciliation.md`, `addendum-docs-inventory.md`). Every file
path and line number below came from those. Nothing here was inferred from a doc in
`docs/` without checking the code — several of those documents describe reversed
decisions.

---

## 0. How to use this with an agent

Each phase in §10 is **one task, one branch**. A phase names what to build, which
files it may touch, and a literal acceptance gate. Run them in order; they are
ordered by dependency, not by appeal.

Three standing instructions for any agent working from this:

1. **The gate is `npm run build` plus a clean typecheck.** There are no tests. A
   phase is not done until both pass.
2. **Stay inside the phase.** This codebase carries a lot of settled detail — the
   hero choreography alone took eight briefs. Broad well-intentioned improvement is
   the main risk here, not failure.
3. **§12 is a stop list.** If a phase seems to require resolving something in §12,
   stop and ask rather than choosing.

---

## 1. Decisions this document locks

These have been circling for weeks. They are now settled, so that no task reopens
them.

| Question | Decision |
|---|---|
| What does this site sell? | **Commissions.** Prints are customer acquisition. Editions are a third line. |
| Print packet price | **€35**, one price for all destinations, pegged to the US cost. EUR only — costs are in euros, so no FX exposure and one Vendure currency. |
| Does the price vary by region? | **No.** Absorbing US postage later is an announced promotion, never a permanently lower US price. |
| MoP A3 triptych print set | **€150**, signed and numbered, shipping included. Edition of 15. |
| MoP small print set | **€40**, three panels, **signed and numbered**, shipping included. Edition of 30. Not "A5" — the real dimensions are unmeasured; do not put a paper size in copy or the SKU until they are. |
| Why both print tiers exist | Different intents, not different price points. The €35 packet is "five nice prints"; the €40 small set is "the Berlin triptych". Nobody weighs them against each other, so they do not compete. |
| Edition sizes are coupled, not chosen separately | Printed on **A3+**: three sheets yield one A3 set plus two small sets, a fixed **1:2** ratio. So an A3 edition of 15 yields exactly 30 small sets. The 15/30 in `handoff-store.md` is this production method written down, not a stale guess. **Choose only the A3 count; the small count follows at double.** |
| MoP original triptych set | **€2,000**, the complete three panels, **shipping quoted separately**. |
| Shipping rule | **Prints ship included, originals ship at cost.** Anything needing a crate is a conversation, not a cart. |
| What Vendure sells | **Three SKUs** — the €35 packet, the €40 MoP small set, the €150 MoP A3 set. All flat, light, shipping-inclusive, one zero-rate shipping method. The two MoP sets track stock (editions of 15 and 30); the packet does not. |
| What Vendure does not sell | Commissions, and **MoP originals**. Both are inquiry → proposal → manual invoice. A €2,000 painting with crated, insured, possibly export-papered shipping is not an add-to-cart, and building that flow costs more than the sales it enables. |
| What belongs on this site? | The test: **a photograph of a place, painted.** Mediums of Perception passes. Gates of Perception passes whole. Mediums of War fails (an event). Breaking Down Art fails (essays about art). |
| Where does the failing work go? | bernardbolter.com — the archive, plus experimental work and collector editions. |
| Mechanism for the split | `SITE_SERIES_SLUGS` in `lib/siteSeries.ts`. Nothing else. |
| Does the artwork list stay on `/`? | **No.** It moves to `/paintings`. |
| Does `HomeListControls` get switched on? | **Yes.** `CLAUDE.md` correctly flags this as a decision rather than a repair. This is the decision. |
| Commerce backend | **Vendure, scaffolded and not connected.** See §4. |
| Style default | Classic clean. See §9. |
| Are the story columns kept on the artwork page? | No. Keep the historical dates timeline, drop older/newer. See §3.3. |

---

## 2. The business, in one page

| | |
|---|---|
| **Model** | Direct to customer. |
| **Production** | 5–6 commissions scheduled, then painted in one batch during a San Francisco studio trip. 50% deposits collected before departure fund the trip. |
| **Tiers** | 80 cm / 30 in square — **$800**  ·  50 cm / 20 in square — **~$450** |
| **Ladder** | Published, counted in **trips**, not paintings: trip 1 $800 · trip 2 $1,100 · trip 3 $1,400 · trip 4+ $1,800 |
| **Modes** | **Yours** — the client's own photograph · **Found** — sourced from the archives · **Taken** — Bernard photographs the place |
| **Prints** | A packet of five 140 mm squares. 6-up on A3, 270 gsm matte. **€35, one price, all destinations.** Introductory — first order or launch window only. |
| **Editions** | Mediums of Perception print sets, already modelled in Payload (`printSets`: `size`, `edition`, `printAvailableCount`, `vendureProductId`). |
| **Sources** | Turn-of-the-century, from Wikimedia Commons, filtered hard to PD-old. `sourceLicense` is a **gate**, not a note. |
| **Cadence** | A city release every two months. One research burst yields three outputs: the commission photo pool, the Instagram content, and eventually the MoP triptych. |

### The transfer geometry

One image proportion — **√2 (1:1.414)** — with the short edge held at **~37% of the
canvas edge**. That ratio is what decides how much canvas is left for the sky field,
so it is a product constant, not a printing detail.

| canvas | transfer image | printed from |
|---|---|---|
| 80 cm | 29.7 × 42.0 cm | A3, full bleed |
| 30 in | 11.0 × 15.6 in | Tabloid, long edge trimmed |
| 50 cm | 18.5 × 26.2 cm | A4, inset |
| 20 in | 7.35 × 10.4 in | Letter, inset |

All four land within half a percentage point on both dimensions. The small tier is
the large tier scaled by 1/√2.

### The standing principle

**Anything that depends on a painting being finished should be able to ship without
one.** This was derived four separate times from four different problems. It is why
the build order below puts commissions before inventory, and static data before
Payload schema work.

---

## 3. Route map

Artwork detail pages live at the top-level catch-all `app/[locale]/[slug]/page.tsx`.
That is why `lib/reservedSlugs.ts` exists. **Every new top-level route must be added
to `RESERVED_SLUGS` in the same commit that creates it**, or it will be shadowed by,
or shadow, an artwork slug.

Current `RESERVED_SLUGS`: `series`, `map`, `experience`, `neighborhood`, `about`,
`store`, `fieldnotes`, `archive.jsonld`, `design-system`. Note `fieldnotes` is
reserved with no route file — that is intentional headroom, not a bug.

### 3.1 Target routes

| Route | State now | Target |
|---|---|---|
| `/` | The artwork list (`PaintingList` + `HeroListItem`) | Homepage proper: hero settles → fault line → three funnels → newsletter band. §3.2 |
| `/paintings` | Does not exist | The list, moved off `/`, with the filter bar on. **Add `paintings` to `RESERVED_SLUGS`.** |
| `/[slug]` | Artwork page, real | Thinned. §3.3 |
| `/[slug]/ar` | Real | Unchanged. |
| `/commissions` | Lives at `/neighborhood` | Rename the route; keep `NeighborhoodPageShell`. **Add `commissions` to `RESERVED_SLUGS`, keep `neighborhood` reserved, and redirect `/neighborhood` → `/commissions`.** |
| `/commissions/configure` | Does not exist | The configurator. §7 |
| `/prints` | Does not exist | The print packet. **Add to `RESERVED_SLUGS`.** |
| `/series/mediums-of-perception` | Real | Unchanged. Reached from the homepage as a link, not a funnel — it carries the intellectual base of the whole practice, and the AR, and its own editions. |
| `/series/mediums-of-perception/[city]` | Real, with `TriptychCommerce` | Unchanged. |
| `/series` | Redirects to `/` | Redirect to `/paintings` instead, once that exists. |
| `/map` | Real | One map, three filters. §8 |
| `/experience` | Real | Unchanged. |
| `/about` | `PlaceholderPage` | Real content, eventually. Not in this build. |
| `/store` | `PlaceholderPage` | **Stays a placeholder.** Reserved for when Vendure is live and there is a real cart. `/prints` is the product page; it does not need `/store`. |
| `/design-system` | Real internal preview | Keep. Extend it with the commerce styles from §9. |
| `/archive.jsonld` | Real | Unchanged. |

Series routes beyond MoP do not get built. The site split removes the need for them,
and the three dead nav stubs at `components/UI/Nav.tsx:36–38` (Breaking Down Art,
Gates of Perception, Mediums of War) should point at bernardbolter.com or be removed
— not at new local routes.

### 3.2 Homepage

Four bands, top to bottom:

1. **Hero.** The existing live hero — `components/Home/HeroListItem.tsx` with
   `components/Home/hero-timeline.ts`, driven by `ach.hero.heroFields` polygon data
   — settles into one finished painting. Four paintings currently have `heroFields`,
   which is enough. This is the site's one piece of motion.
2. **Fault line.** `components/UI/FaultLine.tsx`. Unchanged.
3. **Three funnels**, equal weight, in this order: *commission a painting* ·
   *the set of five* · *browse the work*. Plus one dynamic line, which is the most
   important text on the page:

   > Next studio period: March 2027 · 4 of 6 slots open

   That line needs §5.1.
4. **Newsletter band.** Substack. The bio link on Instagram points here, not at the
   shop.

A link to Mediums of Perception belongs on this page, but as a link — not a fourth
funnel.

### 3.3 Artwork page, thinned

`components/Artwork/ArtworkPage.tsx` currently renders more than this site needs now
that bernardbolter.com carries the depth.

- **Keep** `HistoricalDatesTimeline`. It works and it earns its space.
- **Drop** `StoryColumns` (older/newer). The material is already fully recorded on
  the archive; it does not need to be here too.
- **Promote** `shareDescription` to carry the one-paragraph job that the story
  columns were doing.
- **Archive link**: loud where the record is deep, quiet where it isn't. Gate its
  prominence on a field, the way the share icon is already gated on
  `shareDescription` — not on a constant.
- **Use the reclaimed space for the commercial ask**, which this page currently
  lacks entirely. Every artwork page is a place where someone has just decided they
  like a painting, and right now there is nothing to do about it.
- `PREVIEW_ALL_MINI_NAV = true` at line 38 must go — it is in `CLAUDE.md`'s
  known-broken table and it is what makes lines 129–132 unreachable.

---

## 4. The commerce boundary

**A live Vendure instance exists and is being connected.** The site still defaults
to the static catalog, and switches to Vendure deliberately at Phase 6 — not because
a URL became reachable. The important thing is that this is already how the codebase
works, so the job is to *generalise an existing pattern*, not to introduce a new one.

What exists today:

- `lib/vendure.ts` reads `NEXT_PUBLIC_VENDURE_SHOP_API` then `VENDURE_SHOP_API`,
  exposes `isVendureConfigured()`, and `addToCart()` returns
  `{ success: false, error: 'Store not configured' }` when neither is set.
- `components/Triptych/TriptychCommerce.tsx` renders edition, remaining count and
  release date, has a disabled add-to-cart button (`.triptych-add-to-cart`,
  `globals.css:1887–1898`), and prints an explicit unconfigured note at lines 86–89.
- Payload's Triptych already carries `vendureProductId` per print set.
- `VENDURE_SHOP_API` is **not** in `.env.example`. It should be added, commented
  out, the way `NEIGHBORHOOD_INQUIRY_EMAIL` already is at line 20.

### 4.1 The rule

**Nothing outside `lib/vendure.ts` may know that Vendure exists.** No component
imports a GraphQL document, a Vendure type, or the shop API URL. Components ask
`lib/vendure.ts` for a price or a cart and get back a plain domain object.

That single module gets a second implementation behind the same surface:

```
lib/vendure.ts          ← the public surface. Unchanged signature.
lib/commerce/catalog.ts ← static SKUs, prices, currency. The source of truth today.
lib/commerce/static.ts  ← reads catalog.ts. The default implementation.
lib/commerce/vendure.ts ← the real shop-api calls. Written, typed, never selected.
```

### The switch is explicit, not inferred

**Do not select the adapter by asking whether a Vendure URL happens to be set.** A
stale `VENDURE_SHOP_API`, or one pointing at a server that exists but isn't seeded,
would make `isVendureConfigured()` return true, the static path would never be
selected, and the site would silently try to transact against a dead shop. Presence
of a URL is not the same question as *should this site be taking orders through
Vendure.*

So: one variable, `COMMERCE_ADAPTER`, values `static` | `vendure`, **defaulting to
`static` when unset or unrecognised**. Add it to `.env.example` with `static` as the
documented default, alongside `VENDURE_SHOP_API` commented out.

`isVendureConfigured()` stays, demoted to a second guard that can only fail closed:
if `COMMERCE_ADAPTER=vendure` but no URL resolves, fall back to static and log it
loudly rather than throwing. Two conditions, and the safe state is the default of
both. Turning the shop on later is then one deliberate environment change, and no
accident of a leftover variable can do it.

Because a live shop now exists, `lib/commerce/vendure.ts` can be **tested** rather
than only typechecked — which is a real upgrade, and it is why Phase 1's gate now
includes a query against the live endpoint. But testing the adapter and routing
customers through it are separate acts. Phases 0–5 touch no commerce at all; the
switch stays on `static` through all of them.

### 4.4a What the live shop actually is — verified 16 Sep 2026

From a read-only audit of the Vendure project. This supersedes anything earlier in
this document that treats Vendure as hypothetical.

| | |
|---|---|
| Version | **@vendure/core 3.7.1** |
| Shop API | `https://commerce.art-official.org/shop-api` |
| Channels | **two** — `__default_channel__` and `a-colorful-history` |
| ACH channel | EUR only · `pricesIncludeTax: **true**` · **no shipping method assigned** |
| Default channel | EUR default, USD also available · `pricesIncludeTax: false` |
| Tax | 19% Standard Tax Rate, **enabled**, Europe zone, `isDefault: true` |
| Payment | **`dummyPaymentHandler` only**, `automaticSettle: true` on both channels |
| Prices | integers in **minor units** (3500 = €35.00) |
| Migrations | `runMigrations(config)` runs **on server start**; no migration history before Sept 2026 |
| Custom fields | `selectionIds` + `selectionSnapshot` added to OrderLine, stored as `text` |

**`lib/vendure.ts` must send the `vendure-token` header for `a-colorful-history`.**
Omitting it silently reads `__default_channel__`, which has a different catalogue and
different currency and tax settings. The current code sends no token. This is a
Phase 1 bug, not a future enhancement.

**`selectionIds` is a `text` column, not a Postgres array** — Vendure JSON-serializes
`list: true` string fields. So selections cannot be queried or aggregated in Vendure
at all. This confirms §4.4's decision empirically: per-print counting happens in
Payload, via the webhook, or not at all.

### 4.4b Channels: both, always — and why that stops mattering

**Every product is on `__default_channel__` as well as ACH, permanently.** On create,
`ChannelService.assignToCurrentChannel` assigns to `[activeChannel, defaultChannel]`
unconditionally, and `removeProductsFromChannel` refuses to remove from the default
channel at all (`error.items-cannot-be-removed-from-default-channel`). Core also seeds
a default-channel `ProductVariantPrice` on every variant because querying without one
errors. Default-channel membership is an assumption in Vendure, not a setting. Do not
build anything that depends on channel isolation.

The consequence while tax is live: ACH is `pricesIncludeTax: true` and default is
`false`, so one stored net price reads as **€35 on ACH and €29.41 on the default
channel** — two public prices for one object. **The zero-rate tax category fixes this
as a side effect**: at 0%, `price` and `priceWithTax` are equal and
`pricesIncludeTax` is irrelevant. So §4.5a item 1 is not only the legal blocker, it is
also what makes pricing coherent across a channel that cannot be escaped.

Remaining default-channel cleanup is then just deleting the three sample products, so
nothing public shows a €12,000 placeholder.

**Creating products correctly:** create under a channel-scoped `RequestContext` and
call no assign method. A context built by `RequestContextService.create()` without a
`user` has `activeUserId: null` and therefore **zero permissions** — `isAuthorized:
true` on a synthetic context grants nothing. Any assign or remove call from such a
context throws `error.forbidden`. Giving a script real permissions means resolving a
superadmin `User` with `roles` and `roles.channels` loaded and passing it to
`RequestContextService.create({ user })`.

**How the sample products broke**, for the record: `seed-ach-channel.cjs` called
`assignProductsToChannel` *before* any variants existed, so it assigned an empty list,
and then created the variants over admin-api with Bearer auth and **no
`vendure-token`** — so they landed on the default channel. An ordering bug plus a
missing header, not a permission failure.

**Soft delete does not free a slug for the idempotency check.** `findOneBySlug`
filters `deletedAt IS NULL`, so a soft-deleted product reads as absent and a naive
existence check will happily create a second product with the same slug. Any create
script must query with `withDeleted: true`.

### 4.5a Launch blockers on the commerce side

Three, none of which are code in this repo:

1. **The 19% tax rate will attach VAT to every order.** With `pricesIncludeTax: true`
   on the ACH channel, €35 records as €29.41 net + €5.59 VAT. Under the §19 UStG
   Kleinunternehmer position that VAT must not be charged or shown, and an incorrect
   tax statement on an invoice can create liability for the amount shown. Needs a
   zero-rate tax category and the §19 note on the invoice template. Tax rates are
   database entities, so this is Admin UI work — and a Steuerberater question first.
   **Demonstrated live, 17 Sep 2026:** a variant created at `price: 100` came back
   from shop-api as `price: 84` — 100 ÷ 1.19. The rate is not theoretical, it is
   already rewriting prices. Fixing it also resolves the dual-channel price split in
   §4.4b, so this one action clears two problems.
2. **The ACH channel has no shipping method.** `activeShippingMethods: []`. The one
   existing zero-rate method belongs to the default channel and has `code: ""`. Make
   a properly-coded zero-rate method for ACH rather than reusing it.
3. **No real payment handler.** `dummy-payment` with `automaticSettle: true` means
   orders settle with no money moving — which fires the webhook and decrements counts
   for sales that never happened. Remove or disable it on the ACH channel before the
   shop is public.

Plus §10a (LUCID), which blocks shipping anything at all.

### 4.5b The Payload sale webhook contract

`PayloadSaleWebhookPlugin` already existed and has been rewritten. It subscribes to
`OrderStateTransitionEvent` and fires on `PaymentSettled`.

**Before:** one POST per order *line*, body `{ vendureProductId, quantitySold }`,
authenticated by sending the shared secret in an `x-vendure-webhook-secret` header.
Three defects: no selection data, so per-print attribution was impossible; no
idempotency key, so a retry double-decremented; and the secret travelled in plaintext
on every request, replayable by anyone who captured it.

**Now:** one POST per *order* —
`{ event, orderId, orderCode, occurredAt, channel, lines[] }` — with each line
carrying `vendureProductId`, `vendureVariantId`, `quantitySold`, `selectionIds` and
`selectionSnapshot` (null where absent). Signed with HMAC-SHA256 over
`"<timestamp>.<raw body>"`, sent as `x-vendure-signature` plus `x-vendure-timestamp`.
Three retries with backoff on 5xx and network errors, never on 4xx.

Consumer rules: **`orderCode` is the idempotency key** — deduplicate on it or counts
double-apply. Verify against the **raw request body bytes**, never a
parsed-and-restringified object. Reject timestamps older than five minutes. Return
4xx for a bad signature so the sender stops, 5xx only for transient failure.

Until a `SmallPrints` collection exists (§4.4 — it does not), the receiver stores
`selectionIds` and `selectionSnapshot` on the event record unprocessed, so counts can
be backfilled rather than lost.

### 4.5 Verify against the live shop before flipping the switch

Four things the audits could not know, all of which will break a customer-facing page
quietly if wrong. Establish them before `COMMERCE_ADAPTER=vendure` is ever set
outside a local shell.

1. **Vendure major version.** The shop-api schema differs across v1/v2/v3.
   `lib/vendure.ts` was written against an assumption that nothing has tested. The
   adapter's queries must match the running version.
2. **Channel and channel token.** Requests to a non-default channel need a
   `vendure-token` header. If the shop uses a named channel, that header is
   mandatory and its absence fails every call.
3. **Currency.** The channel's currency configuration forces the decision currently
   marked open in §11 — Vendure will not let it stay undecided. Whatever the channel
   says becomes the answer for anything sold through Vendure; commissions, which
   bypass it, can still be quoted in USD.
4. **`vendureProductId` on existing Payload triptychs.** These fields were populated
   against a shop that did not exist. If they hold guesses or placeholders,
   `TriptychCommerce` will render a live add-to-cart that posts an invalid ID. Audit
   every one against the real catalogue.

Point 4 is the sharpest edge here, and it is worth being explicit about why.
Unconfigured, a bad product ID is invisible: `addToCart` returns
`{ success: false, error: 'Store not configured' }` and the button is disabled, so
nothing is exercised. Connected, the same bad ID returns a GraphQL error on a page a
customer is standing on. **Connecting the shop does not reveal these bugs — it
converts them from unreachable to customer-facing.** That is the whole argument for
the explicit switch in §4.1 rather than inferring from URL presence.

### 4.2 Prices

`CLAUDE.md`: **never store prices in Payload.** That holds. In static mode prices
live in `lib/commerce/catalog.ts` as typed constants with an explicit `currency` per
SKU — which also defers the unresolved currency question (§11) instead of being
blocked by it. The neighborhood global's `pricing.priceLabel` is a display *label*
and stays one; do not generalise from it.

### 4.3 What static mode terminates in

With a live Vendure, checkout is solved for anything modelled in it — so this
section now only applies to a product that ships *before* it has been modelled.
Which is a live possibility: the print packet is a pick-five selection (§4.4) and
modelling it is a real decision, so it may well be ready to sell before it is ready
to be a Vendure product.

A cart that cannot check out is a dead end, and the print packet is the acquisition
line — it has to be able to take money on day one. Three options, in order of how
much they cost to build:

1. **A hosted payment link per SKU** (Stripe Payment Link, PayPal button). Needs no
   backend at all, takes real money immediately, and is replaced later by changing
   one field in `catalog.ts`. Recommended.
2. **An order-request form**, exactly like the commission inquiry, and a manual
   invoice. Zero payment integration, but every order costs Bernard an email.
3. **Nothing** — the packet is announced but not purchasable until Vendure is live.
   Only acceptable if the packet ships after the shop does.

Option 1 is a decision for Bernard, not an agent (§12). The build should put the
terminal behind a single field in `catalog.ts` so all three remain reachable.

Commissions never touch any of this. A commission terminates in a **proposal**, not
a checkout — the deposit is invoiced by hand. That is what removed Vendure from the
critical path in the first place.

### 4.4 The print packet is not thirty variants

Five squares chosen from a pool is **one SKU** with a selection attached, not a
combinatorial variant set. Anything else explodes. This confirms the plan already set
in `ach-site-design-and-architecture.md`: the five selected Payload IDs ride on the
Vendure order line as custom fields.

**Two custom fields on OrderLine, each with one job:**

| Field | Type | Purpose |
|---|---|---|
| `selectionIds` | `string`, `list: true` | The five Payload IDs. Machine reference, read by the webhook. |
| `selectionSnapshot` | `text` (JSON) | id + title + city per print, captured at order time. The historical record. |

The snapshot is not redundant. An order is a historical record and Payload titles are
localized and mutable, so a line storing only IDs silently rewrites its own history
every time the CMS changes. It is also what lets the confirmation email and packing
slip print real titles with no lookup.

**Validation belongs in the Vendure config, not the client.** Custom fields take a
`validate` function; enforce exactly five there, because `addItemToOrder` is a public
mutation. Whether duplicates are allowed is a small open call — probably yes.

**Tracking which prints sold does not query Vendure.** There is no native aggregation
over a custom-field list, so counting sales per image from order lines would need a
custom plugin. Use the webhook already specced for `printAvailableCount` instead: on
order settled, read `selectionIds` and increment a **`packetSalesCount`** on each of
the five Payload records. Popularity then becomes an ordinary sortable field, usable
on the site with no Vendure call — and it can drive a "most requested" sort in the
print picker.

**Quantity works by default.** Vendure keys order lines by variant *plus* custom
fields, so two packets with different selections are two lines, and two with the same
selection are quantity 2 on one line. Both correct. Confirm for the installed version.

**Inventory settings are opposite for the two product types, and getting the packet
wrong is a silent total failure.**

| Product | `trackInventory` | Why |
|---|---|---|
| Print packet | **false** | Open edition, printed on demand. There is no stock. |
| MoP edition | **true**, with real counts | Edition of 15 means 15 units, decrementing to permanently sold out. |

With tracking on and stock at zero, the packet exists and **nobody can ever buy it** —
`addItemToOrder` fails with `No items were added to the order due to insufficient
stock` before it ever reaches the custom-field path. This was found by the
verification script on 17 Sep 2026 and would otherwise have surfaced on the first
real customer.

**Verified GraphQL shape** (live introspection, ACH channel, 17 Sep 2026):

```
addItemToOrder(productVariantId: ID!, quantity: Int!, customFields: OrderLineCustomFieldsInput)
OrderLineCustomFieldsInput { selectionIds: [String], selectionSnapshot: String }
```

Two consequences for the storefront. `selectionIds` is `[String]`, not `[String!]!` —
the schema accepts a null list, null entries, or three items, so **the `validate`
functions are the only gate** and they are what must be trusted. And
`selectionSnapshot` is `String`, not a JSON scalar, so the client must
`JSON.stringify` on the way in while the webhook parses on the way out. Stringify
twice and you get a quoted string that parses back to a string rather than an array.

**Verified end to end against the live instance, 17 Sep 2026** — all nine cases pass.
Validation enforces exactly five in both directions, rejects invalid JSON, and checks
per-object fields (`selectionSnapshot[2].title must be a non-empty string`).

**Line-merge behaviour, measured:** two *different* selections on the same variant
produce **two order lines**; two *identical* selections produce **one line at quantity
2**. So the consumer rule is: **for each line, increment each print in `selectionIds`
by that line's `quantitySold`** — not by 1, and not once per order. Getting this wrong
undercounts a double order by half. The picker UI should likewise show a quantity
rather than two identical rows.

**Which collection this is.** The packet prints from **finished square paintings** —
the ~80 works — not from the unmade photograph pool in §5.4, which feeds commissions.
Different collections, different jobs. The audit found `SmallPrints` does not exist in
code, so this data layer needs **building, not extending**, and `packetSalesCount`
lives there.

---

## 5. Data

### 5.1 Studio periods — the one genuinely new concept

Nothing in Payload holds a trip, a slot count, or which rung of the ladder is
current. The homepage dynamic line, the commission page and the Substack all read
from this, so it is one source feeding three surfaces.

Shape: `dates`, `city`, `slotCount`, `slotsTaken`, `currentPriceByTier`.

**Build it as `lib/studioPeriods.ts` first** — a typed static object behind an
accessor with the same signature a Payload global would have. That way the homepage
block and `/commissions` ship now, and moving it into Payload later is an
implementation swap behind an unchanged call site. This is the standing principle
applied to data: don't block a shippable surface on a schema change.

### 5.2 What needs no schema work

`mapPayloadArtworkForList` already returns `sizeTier`, `widthCm`, `heightCm`,
`orientation`, `aspectRatio` and `ach.overlayColors` at depth 1. Every facet the
filter bar and the map need is already mapped. No Payload change is required to
switch `HomeListControls` on.

Two existing bugs matter here and are in `CLAUDE.md`'s known-broken table:
`mapPayloadArtworkForList` hardcodes `forsale: false` (line 350), and
`lib/unifiedAvailability.ts` falls through to `'available'` for anything it does not
recognise. A commerce site that silently defaults to available will lie about
inventory. Both need fixing before any availability filter is shown to a visitor.

### 5.3 Measurement, decided before the store not after

The strategy rests on prints producing commissions. Today nothing links a print
buyer to a later commission inquiry, so in a year the one question worth asking
would be unanswerable.

- A `source` field on commission inquiries.
- The "which neighborhood is yours" answer stored on the order, not just printed on
  a card in the box.

Cheap now, impossible to backfill.

### 5.4 The unmade photo pool

The pool of sourced, not-yet-painted photographs is what the city cadence releases,
what feeds Instagram, what the configurator picks from, and what the map's second
filter shows. It is its own collection — not artworks with a status — because a
photograph in the pool has no painting, no dimensions and no availability.

Minimum fields: `slug`, `image`, `city`, `neighborhood`, `approximate year`, `lat`,
`lng`, `sourceLicense`, `sourceUrl`, `roughMask` or transfer placement, and a
`skyOptions` reference. Static first, per §5.1.

---

## 6. The three products

**Commission.** Two tiers, three modes, trip-based ladder. Terminates in a proposal.
The page is `/commissions` and it needs: what the work is, the two sizes with
prices, the three modes, the current studio period with slots, the ladder stated
plainly, the sky choice explained, a positioning disclaimer, and the inquiry form.
The existing `NeighborhoodPageShell` (231 lines) and `InquiryForm` (184 lines) are
the starting point, already running on `lib/neighborhoodDefaults.ts` with
`fromCms: false`. The `mailto:` handoff in `InquiryForm` — with its clipboard
fallback when `inquiryEmail` is unset — can stay for launch. A real POST is a later,
separate task.

**Print packet.** Five 140 mm squares, chosen by the visitor from the pool, 6-up on
A3. Drag-and-drop or click-to-select; five slots, visibly five. Flat shipping.
Priced at cost recovery. This is the first rung of the ladder and the newsletter's
reason to exist.

**MoP editions.** Already built at `/series/mediums-of-perception/[city]` with
`TriptychCommerce`. Needs nothing except whatever §4 does to `lib/vendure.ts`, which
it should inherit for free. Do not rebuild it.

---

## 7. The configurator

**`/commissions/configure` is a commitment ladder, not a funnel.** Do not gate it,
do not require an email to enter it, do not put a step count on it. Its purpose is
that by the end, the visitor has made two choices and is emotionally involved. It
ends in a proposal.

Two choices, in this order:

1. **The photograph.** Picked from the pool (§5.4), browsable as a grid or on the
   map (§8). Pre-made rough placements and rough masks are fine and save a
   conversation — they do not remove anything, because the positioning was never
   negotiable anyway.
2. **The sky.** Three to five named options, each referencing the sky of an existing
   painting: light blue through greenish to faintly red. Plus **"or I'll choose"**,
   which must be a real, unembarrassed option and is probably the best answer.

The sky choice is the whole answer to *"will it match my couch."* It converts an
open-ended request for direction into a discrete, bounded choice — which is exactly
the right shape, because direction damages the work. Too much of it, or repainting a
photograph the same way twice, loses the passion the painting depends on; the success
lives in small unplanned decisions. So: the client chooses the photograph and the
sky. After that it is Bernard's.

Two constraints on the UI:

- **A positioning disclaimer is required.** Final placement of the transfer is not
  determined at order time and cannot be promised.
- **Contemporary colour photographs are less flexible** on sky than black and white,
  because the colour is taken from the existing sky so that it blends. The UI should
  narrow the options on those rather than offering a choice it can't honour.

---

## 8. The map

**One map, three filters** — not three maps.

| Filter | Shows |
|---|---|
| All | Everything below |
| Unmade photographs | The pool (§5.4) — browsable, and a route into the configurator |
| Available paintings | Finished work |

`components/Map/FilterSort.tsx` and `FilterDot.tsx` already exist and are live via
`/map`. Extend them; do not build a second filter mechanism. Pins currently come
from `HistoryProvider` via `getArtworksLite` in the locale layout, so the pool needs
its own lite fetch alongside that rather than being forced into the artwork shape.

The map's second job is orientation: someone sees where a place is in relation to
where they are. That is a reason for someone with no interest in art history to
commission a painting, and it is worth more than the browsing.

---

## 9. Style: classic clean

**When a visual decision is open, choose the plainer option.** Concretely, for any
new surface:

- **Type**: Barlow Semi Condensed. Not Limelight, not Josefin Sans. Limelight is
  display-only and `design-system.md` §3 forbids it on prices — a rule the existing
  `NeighborhoodPageShell.tsx:170` already breaks, which is an open decision (§12),
  not a precedent.
- **Colour**: no new tokens. Use the named ones that exist. If nothing fits, say so
  rather than adding a hex literal — the audit already found arbitrary values
  duplicating existing tokens, and that list should not grow.
- **Layout**: left-aligned, one column on mobile, two at `l:`. Whitespace rather
  than boxes, rules and cards. Generous vertical rhythm.
- **Dividers**: the fault line (2 px `#3A3F4A` over 1 px `#F0E8C0`) is the only
  decorative divider. Elsewhere, a hairline or nothing.
- **Motion**: none on commerce surfaces. The hero is the site's one piece of motion
  and it should stay that way.
- **Buttons and fields**: four commerce styles already exist — `.home-cta`,
  `.neighborhood-field`, `.neighborhood-submit`, `.triptych-add-to-cart`. **Reuse
  them. Do not invent a fifth.** If a new surface needs something genuinely new, add
  it to `/design-system` in the same commit so it is visible rather than buried.
- **Pattern**: damask stays in dense zones only, never behind artwork imagery.

**One limit on this.** Classic clean is a tiebreak for *new* surfaces. It is not
permission to resolve the five open decisions in §12, and not a reason to strip
Josefin Sans from the four selectors where it currently lives. Existing surfaces
change only when a phase says to change them.

---

## 10. Build order

Eight phases. One task, one branch, one gate.

### Phase 0 — Fix and clear · **DONE 17 Sep 2026**, branch `phase-0-fix-and-clear`

All eight fixes applied and fourteen files deleted — the twelve dormant ones plus
`lib/placeholders.ts` and `lib/placeholders.server.ts`, which only became dead once
the blur props were removed. Side benefit: `getArtworkBlurDataURL` was running a
synchronous CRC32 + `zlib.deflateSync` PNG encode per artwork inside
`mapPayloadArtworkForList`, on every list fetch across ~79 records. Gone from the
request path.

Four availability bugs were found along the way — see §10a-bis. Lint baseline
established at 11 errors / 7 warnings on `main`, unchanged by the phase.


Everything in `CLAUDE.md`'s known-broken table. Remove `PREVIEW_ALL_MINI_NAV`; fix
the depth-1/full-mapper mismatch and the allowlist bypass in
`getTriptychPanelsForArtwork`; remove the blur placeholders and the CSS at
`globals.css:1748–1751` fighting them; remove `HERO_FORCE_SLUG` and
`ENABLE_HERO_UNPAINT_ON_EXIT` and their unreachable branches; point or remove the
three `href: '#'` nav stubs. Fix `forsale: false` and the availability fallthrough.

Then delete twelve dormant files — the whole of `components/hero/`
(`HeroSection.tsx`, `HeroSectionLoader.tsx`, `HeroCanvas.tsx`, `HeroCopy.tsx`,
`HeroMobileArrow.tsx`, `hero-states.ts`, `hero-timeline.ts`), plus
`components/Artworks/Artworks.tsx`, `components/Artworks/ArtworkList.tsx`,
`components/UI/Loader.tsx`, `components/Pages/LandingPage.tsx`,
`components/Home/HomeSectionRenderer.tsx`.

> **Two files are named `hero-timeline.ts`.** `components/hero/hero-timeline.ts` is
> dead and gets deleted. **`components/Home/hero-timeline.ts` is live** — 360 lines,
> the working hero choreography, imported by `HeroListItem.tsx`. Deleting the wrong
> one destroys eight briefs of work. Match on the full path, never the basename.

**Keep `components/Home/HomeListControls.tsx`** — Phase 3 needs it. It is dormant
but it is not dead.

*Gate:* build and typecheck clean; homepage and artwork page visually unchanged
except that MiniNav icons now reflect real data.

### Phase 1 — The commerce boundary
§4. `lib/commerce/` with both adapters, `catalog.ts`, the static cart. No UI.
Add `COMMERCE_ADAPTER` (default `static`) and a commented `VENDURE_SHOP_API` to
`.env.example`.

*Gate:* typecheck clean; with `COMMERCE_ADAPTER` unset, a script round-trips a
five-item selection through the static adapter and back; with
`COMMERCE_ADAPTER=vendure` and no URL set, the same script still succeeds via the
static fallback and logs the downgrade. Then, against the live shop in a local shell
only: the adapter successfully reads the channel and at least one product, and §4.5's
four checks are recorded with real answers.

### Phase 2 — Studio periods
§5.1. `lib/studioPeriods.ts` plus the homepage dynamic line and the block on
`/commissions`.

*Gate:* the line renders real numbers from the static object on both surfaces.

### Phase 3 — `/paintings` and the filter bar
Move the list off `/`. Add `paintings` to `RESERVED_SLUGS`. Mount
`HomeListControls`. Its styles (`globals.css:1634–1674`) and data layer
(`getHomepageFacets`, `lib/homepageArtworks.ts:227`) are already live and unused.
Redirect `/series` → `/paintings`.

*Gate:* every filter and sort returns correct results; availability filter correct
now that Phase 0 fixed the fallthrough.

### Phase 4 — `/commissions`
§6. Rename the route, add both slugs to `RESERVED_SLUGS`, redirect `/neighborhood`.
Build the full page on static defaults.

*Gate:* the page renders complete with `fromCms: false`; the inquiry form's
`mailto:` and clipboard fallback both work.

### Phase 5 — Homepage restructure
§3.2. Four bands. Touches the hero, which is why it is not earlier.

*Gate:* the hero animation is unchanged — same choreography, same timing. Verify
against the existing behaviour before and after.

### Phase 6 — The print packet
§6, §4.4. `/prints`, added to `RESERVED_SLUGS`. Pick-five UI, flat shipping, the
terminal from §4.3.

*Gate:* a five-item selection reaches the terminal with all five slugs intact.

### Phase 7 — The configurator
§7. Highest design risk, no dependencies on anything above except the pool.

*Gate:* both choices persist through to a submitted proposal; disclaimer present;
sky options narrow correctly on contemporary colour sources.

### Phase 8 — Map filters
§8. Extend `FilterSort`.

*Gate:* all three filters correct; the unmade-photograph filter routes into the
configurator.

The artwork page thinning (§3.3) can go anywhere after Phase 0. It is small and
independent.

---

## 10a-bis. The availability model — found during Phase 0, 17 Sep 2026

Phase 0 was specified as eight line-numbered fixes. Four of them acted as probes and
turned up bugs no audit had found, because the audits read code while these were only
visible once the code was touched. Recorded here because the remaining items are
Phase 1 work.

### Two fields, two enums, and one broken bridge

| Field | Values |
|---|---|
| `doc.availabilityStatus` (archive-wide) | `available` · `sold` · `not-for-sale` · `on-loan` |
| `doc.ach.mop.availabilityStatus` | `original-available` · `sold` · `prints-only` |

`buildArtworkFields` derives `forsale` from `raw.availabilityStatus ===
'original-available'`, where `raw = mergeAchFields(doc)` — a shallow
`{...doc, ...doc.ach}`. The field actually lives at `doc.ach.mop.availabilityStatus`,
so the shallow spread never reaches it and `raw.availabilityStatus` resolves to the
*archive* field, compared against a string from the *MoP* enum. **It has never
matched: `forsale` is false for all 220 records.** Nothing reads it today, so it is
dormant — but Phase 6 will.

**Fix it in Phase 1, and not in the mapper.** `lib/unifiedAvailability.ts` exists to
reconcile these two layers into one answer; `buildArtworkFields` doing its own
comparison duplicates that job badly enough to have been wrong for months. Derive
`forsale` from `getUnifiedAvailability`, at the commerce boundary where it belongs.

### What was live and wrong

`ARCHIVE_SOLD_STATUSES` contained `sold`, `not-for-sale`, `on-loan`, `reserved` and
`on-consignment`, and everything in it resolved to `'sold'`. With **13 of 79** site
records marked `not-for-sale` (117 of 220 archive-wide), paintings Bernard still owns
were telling visitors they had sold — in the artwork-page badge, which is live, not
just in the dormant filter path.

Fixed in Phase 0: `not-for-sale` and `on-loan` now have their own branches and labels
in both `resolveUnifiedAvailability` and `getStatusBadgeAvailability`, the
`UnifiedAvailability` union was widened to carry them, and the badge was moved onto
`next-intl` — it had been hardcoded English on an EN/DE site since it was written.

### The structural fix, for Phase 1

`reserved` and `on-consignment` remain in the Set and would read as "Sold" the day
they appear. A reserved work is held for someone and still owned; a consigned work is
sitting in a gallery. That is the same bug a fourth time.

**Three rounds of special-casing means the abstraction is inverted.** A Set named
`ARCHIVE_SOLD_STATUSES` treats sold as the default and every other state as an
exception, when only `sold` means sold. Replace it with an exhaustive
`Record<ArchiveStatus, UnifiedAvailability>` — the shape `StatusBadge`'s
`STATUS_KEYS` now has — so a new status fails the typecheck until someone gives it a
deliberate answer instead of silently becoming a false claim.

This also settles a smaller question rather than leaving it open. The two functions'
fallthroughs now differ: `resolveUnifiedAvailability` must return a union member so it
buckets an unknown status as `not-for-sale`, while `getStatusBadgeAvailability` can
return `undefined` and claim nothing. Both are the best choice each signature allows,
so it is not two policies disagreeing — and the exhaustive Record makes both
fallthroughs unreachable by construction. Don't pick a fallthrough policy; remove the
need for one.

### Check this on bernardbolter.com

**117 of 220 archive records are `not-for-sale`.** If that site shares this resolution
logic against the same Payload fields, over half its catalogue may be displaying as
sold — nine times the ACH problem, on the site that is meant to be the authoritative
record. And it would be wrong *inside* the JSON-LD, not only in the rendered page.
Worth checking before the JSON-LD work there, not after.

---

## 10b. Deploy order for the Vendure changes

Production Vendure runs from `~/apps/vendure/` on the server, **not** from the local
checkout. So a migration generated locally does not exist in production until a
deploy, and `runMigrations` on server start only applies what has been deployed.

Two traps. **If the deploy script auto-restarts** (`git pull && npm run build &&
pm2 restart`), the migration applies the instant you deploy — before any backup and
before the receiver is ready. Check before deploying. And **both sides must read the
same `VENDURE_WEBHOOK_SECRET`**; the old receiver may have hardcoded it or used a
different variable name. Compare a hash of each rather than printing either.

1. Back up the Vendure database, on the server, where the `DB_*` vars live.
2. Deploy the Payload receiver and confirm it is live.
3. Confirm the shared secret matches on both sides.
4. Deploy Vendure and restart — migration applies, new webhook code loads.
5. Introspect `MutationAddItemToOrderArgs` and confirm `customFields` is really there.
6. Run the selection verification script.
7. Admin UI: zero-rate tax category, shipping method on the ACH channel.
8. Products.

---

## 10a. Hard prerequisite, upstream of everything above

**LUCID / `verpackungsregister.org` registration must be complete before the first
sale ships.** Germany's packaging law applies the moment packaged goods are placed on
the market, registration is free, and it is not retroactive. This blocks the entire
print line — both the €35 packet and the MoP editions — and it sits upstream of every
pricing and Vendure question in this document. It is not a build task and no agent can
do it; it is named here so it does not get discovered the week of launch.

---

## 11. Still unknown — do not invent

Marked so an agent does not fill these in with something plausible.

- **The inventory of the ~80 works** from San Francisco, Berlin and Hamburg does not
  exist as data. The archive fetches were never approved.
- **Currency.** Commissions are priced in USD to American buyers; prints ship from
  Berlin and are naturally EUR; the site is EN/DE. Whether the locale toggle also
  switches currency is undecided. `catalog.ts` carries `currency` per SKU so this
  can wait — but the live Vendure channel's currency configuration now forces the
  answer for anything sold through the shop, so read it off the channel rather than
  deciding it twice. Commissions bypass Vendure and can stay USD regardless.
- **Postal class for the print packet.** The €35 price is pegged to the expensive
  destination (US) at an assumed €8 flat-letter rate — Warenpost International, not
  parcel. Postage is roughly 60% of the cost stack, so this one figure decides
  whether the price works. The risk is **thickness**, not weight: a padded rigid
  mailer can exceed the flat-class cap and reclassify to parcel, which roughly
  doubles US postage and halves the margin. **The packaging is therefore a postage
  decision, not an aesthetic one — thin and stiff, not thick and protective.** Weigh
  and measure a packed sample before the price is published.
- **In-situ photographs of finished work** do not exist anywhere. Every page that
  wants one will have to do without. Frames are a known weak point.
- **The Berlin MoP triptych** is not painted. The site launches without it.
- **The actual printed dimensions of both MoP print tiers.** Printed on A3+ with a
  known empirical yield, but the panel sizes have never been measured. They are needed
  for product copy, the SKU, and any certificate. Measure an existing Colorful History
  print. Until then, no paper-size label goes anywhere near the catalogue — "A5" was
  wrong and had already reached three documents.
- **Is *Venice in the Middle* still an ACH product?** An earlier note makes it the
  first single-painting print product for this store. It predates the site split, and
  under the locked test — a photograph of a place, painted — Breaking Down Art fails.
  It should move to bernardbolter.com with the rest of that series. Confirm before
  anything gets built.
- **Sky option names.** Three to five, each referencing a real existing painting's
  sky. Bernard names them.
- **The city and trip cadences do not align** — six city releases a year against two
  or three trips. So the Substack's ask has to vary per issue: some issues open
  slots, some only release photographs. This is a content problem, not a code one,
  but it means the homepage line must render honestly when zero slots are open.

---

## 12. What an agent must not decide

The five open decisions in `CLAUDE.md` — Josefin Sans scope, artwork title font and
size, Limelight on prices, nav panel colour, open-nav logo behaviour — plus:

- Prices, tiers, or the rungs of the ladder.
- Which series are in `SITE_SERIES_SLUGS`.
- The static-mode payment terminal (§4.3).
- Sky option names or how many there are.
- Anything in §11.
- Whether to move `lib/studioPeriods.ts` into Payload.

Everything else in this document is settled. Build it.

---

*Written by Claude, 16 September 2026. Supersedes the route map in
`claude_trade-audit-and-site-map.md` §4, the ladder in `claude_direct-sales-plan.md`
§2, and the designer/agent emphasis in `claude_commission-funnel-research.md` §4.
The audit sections of all three still stand.*
