# Vendure Prompts — three stages, for Cursor

*Written 16 September 2026. For the Vendure project, not the ACH repo.*

The goal: get OrderLine selection fields in place so the €35 print packet can be one
SKU that records which five prints went out, plus reusable tooling for creating
products as cities are released.

**Run the stages in order and stop between them.** Stage 1 is read-only. Stage 2
writes config and generates a migration but does not run it. Stage 3 only happens
after you have applied the migration yourself.

| Stage | What it does | You do in between |
|---|---|---|
| 1 | Reports the instance state, then stops | Read it, paste it back to Claude, approve stage 2 |
| 2 | Adds two OrderLine custom fields + a zero-rate shipping method, generates a migration | Run the migration yourself |
| 3 | Writes a product definitions file and an idempotent apply script | Fill in the TODOs, run with `--apply` |

Why staged: the custom-field API differs between Vendure majors. An agent that
guesses it writes code that compiles and misbehaves, which is worse than code that
fails.

---

## Stage 1 — report, then stop

```
CURSOR — VENDURE CONFIG, STAGE 1: REPORT ONLY

This is stage 1 of 3. Report and then STOP. Do not write any code in this stage.

Throughout all stages: do NOT run migrations, do NOT run seed or populate scripts,
do NOT create/update/delete any entity, do NOT restart the server, do NOT execute
admin-api mutations, and do NOT print secret values — report whether a variable is
set, never what it contains.

Read package.json, vendure-config.ts and everything it imports, the migrations
directory, and any plugins directory. Report:

1. The exact @vendure/core version installed.

2. Every existing customFields definition, grouped by entity. State specifically
   whether OrderLine already has any.

3. Whether this version's addItemToOrder mutation accepts customFields, and its
   exact signature — quote it from the installed @vendure/core types, not from docs.

4. For this version: which custom field option controls whether a field is settable
   from the storefront shop-api and readable back on the active order. Name the
   actual option (internal / public / readonly / other) and its default.

5. Whether prices in this version are stored and set in minor units (cents), and
   confirm with a reference to the installed types.

6. The migration setup: how migrations are generated and run in this project, and
   whether the migrations directory is currently in a clean state.

7. Tax configuration: tax zones, tax categories, tax rates, and whether prices are
   configured tax-inclusive or tax-exclusive. Report only — change nothing.

8. Channel configuration: code, token, default currency, available currencies, and
   whether a vendure-token header is required on shop-api calls.

9. Every shipping method configured, with its eligibility checker and calculator.

10. Every payment method handler configured, and whether checkout can currently
    complete. If not, say what is missing.

11. Whether Vendure's own services can be used from a standalone script in this
    project — specifically whether bootstrapWorker is available and how the project
    is set up to run one-off scripts.

Then stop. Write nothing until I approve stage 2.
```

---

## Stage 2 — config and migration

Paste this only after stage 1 comes back and you have read it.

```
CURSOR — VENDURE CONFIG, STAGE 2: ORDERLINE SELECTION FIELDS

Same prohibitions as stage 1. In particular: generate the migration but DO NOT run
it, and create no products.

Add two custom fields to OrderLine in vendure-config.ts.

FIELD 1
  name: selectionIds
  type: string, list: true
  purpose: the five selected Payload document IDs for a print packet order line.
  requirement: must be settable via addItemToOrder from the storefront and readable
  back on the active order. Use whichever option achieves that in this version, per
  your stage 1 finding.

FIELD 2
  name: selectionSnapshot
  type: text
  purpose: a JSON array captured at order time, one object per print, each with id,
  title and city. This is a historical record — it must never be recomputed from the
  CMS after the order is placed. Same storefront readability requirement as field 1.

VALIDATION — server side, in the field definition's validate function, never in the
storefront:
  - selectionIds must contain exactly 5 entries. Reject anything else with a clear
    error message naming the actual count received.
  - Each entry must be a non-empty string.
  - Duplicates ARE allowed.
  - selectionSnapshot must parse as JSON and contain exactly 5 objects, each with a
    non-empty id and title.

SHIPPING
Add a shipping method: flat rate, zero cost, eligible for all addresses. The print
packet is priced shipping-inclusive, so checkout must add nothing. If a suitable
method already exists per stage 1, say so and add nothing.

THEN
  - Generate the migration for the new columns. DO NOT run it. Tell me the exact
    command to run it myself.
  - Confirm the project typechecks and builds.
  - Write docs/addendum-orderline-selection-fields.md recording the field
    definitions, the validation rules, the migration filename, and the apply command.

DO NOT:
  - create any product, variant or SKU
  - change tax configuration
  - change channel or currency configuration
  - modify any existing custom field
```

---

## Stage 3 — product definitions and apply script

Paste this only after you have applied the stage 2 migration.

```
CURSOR — VENDURE CONFIG, STAGE 3: PRODUCT DEFINITIONS + APPLY SCRIPT

Same prohibitions as stages 1 and 2. Additionally: do not run the script you write,
not even in dry-run mode.

Create two things.

1. A TYPED DEFINITIONS FILE — products as data, not code. One entry per product,
   each with: slug, name, description, SKU, price in minor units, currency, asset
   filename, tax category, and whether stock is tracked.

   Seed it with ONE active entry:

     slug:        print-packet-five
     name:        Print Packet — Five Prints
     SKU:         TODO — I will set the convention
     price:       3500
     currency:    EUR
     description: TODO — do NOT write product copy
     asset:       TODO

   Then leave commented placeholder entries for the Mediums of Perception city
   editions, unpriced, so I can fill them in per release.

2. AN APPLY SCRIPT. Requirements:
   - Use bootstrapWorker and inject Vendure's own services (ProductService,
     ProductVariantService and whatever else is needed). Do NOT call the admin-api
     over HTTP and do NOT handle admin credentials anywhere.
   - Idempotent: look up each product by slug first. If it exists, report and skip.
     Never update and never delete an existing product.
   - Supports --dry-run, printing exactly what it would create and exiting without
     writing. Dry-run is the DEFAULT; require an explicit --apply to write anything.
   - Refuses to run at all if any definition still contains a TODO placeholder.
   - Exits non-zero on any failure.
   - On success, prints the created product and variant IDs so I can paste them into
     Payload's vendureProductId fields.
   - Never calls Vendure's populate routine or anything else that clears data.

   Do not run it. Tell me the commands for dry-run and for apply.

Record both in docs/addendum-product-apply-script.md.
```

---

## What you supply, not Cursor

Three things gate the packet product, and none of them are the price:

- **Description copy** — paper stock, print size, open edition, shipping-inclusive.
  Left as a TODO on purpose. An agent writing this puts invented marketing text on a
  live shop.
- **An asset.** At least one image. No in-situ photograph of a packed set exists yet.
- **A SKU convention.** Set it once, deliberately, before the first product exists.

---

## Not in these prompts, and why

- **MoP edition products.** Unpriced. The recommendation on file is one A3 set of
  three at €135 and dropping the A5 tier, but that is not confirmed.
- **Tax changes.** Stage 1 reports the setup and stops. Given the §19 UStG
  Kleinunternehmer position, any change there is a conversation with a Steuerberater,
  not an agent edit to a live shop.
- **Anything on the ACH side.** These prompts touch only the Vendure project. The
  site-side work is `docs/build-spec.md` Phase 1 in the ACH repo.

---

## One seam to stay on top of

After stage 3, €35 exists in three places: `docs/build-spec.md`, the ACH repo's
`lib/commerce/catalog.ts` (static mode only), and the Vendure definitions file.

**Vendure is authoritative once live.** The definitions file is a record of the
intent that created the data, not a live source. If a price changes, change it in
Vendure Admin and update the other two to match.

---

*Written by Claude, 16 September 2026.*
