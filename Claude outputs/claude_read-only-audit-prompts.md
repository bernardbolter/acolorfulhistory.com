# Three Read-Only Cursor Audits
## acolorfulhistory.com · prompts, ready to paste

*Written Sept 16 2026. All three are read-only: no code changes, no file moves,
no deletions. Each ends in an addendum file, following the existing
`claude_*-prompt.md` → `addendum-*.md` pattern.*

**Run them in this order.** Audit 1 produces the inventory that 2 and 3 both
reference, so running it first makes the other two sharper and shorter.

| # | Audit | Output |
|---|---|---|
| 1 | Route & component inventory | `docs/artwork/addendum-route-component-inventory.md` |
| 2 | Style guide reconciliation | `docs/artwork/addendum-style-guide-reconciliation.md` |
| 3 | Docs inventory & contradictions | `docs/artwork/addendum-docs-inventory.md` |

---

# Audit 1 — Route & component inventory

```
CURSOR — READ-ONLY AUDIT 1: ROUTE & COMPONENT INVENTORY

This is a read-only audit. Do not change, move, delete or create any file
except the single output file named at the end. Do not refactor anything you
find, however tempting. If you think something is a bug, record it — do not
fix it.

SCOPE
Read the whole repository except node_modules, .next, .git and docs/.

PRODUCE, as markdown tables:

1. ROUTES
   Every route under app/. For each: the route path as a visitor sees it
   (resolving the [locale] segment), the file, what component tree it renders,
   and whether it renders real content, a placeholder, a redirect, or an
   empty/"coming soon" state. Note any route present in lib/reservedSlugs.ts
   that has no corresponding route file, and any route file whose segment is
   missing from reservedSlugs.

2. COMPONENTS
   Every file under components/. For each: path, line count, and every file
   that imports it. Mark clearly any component imported by nothing.

3. DEAD AND DORMANT CODE
   - Components imported nowhere.
   - Exported functions and constants in lib/ called nowhere.
   - Anything rendered behind a commented-out line, a hardcoded false, or an
     unreachable condition. Quote the line and give the file and line number.
     (One is already known — HomeListControls in components/Home/PaintingList.tsx.
     Find the rest.)
   - Any @deprecated marker and whether its replacement is used everywhere.

4. PAYLOAD FIELD USAGE
   Trace from lib/mappers/* through to components. Produce three lists:
   - fields fetched AND rendered somewhere
   - fields mapped into the Artwork/ACH types but rendered nowhere
   - fields referenced in components but not present in the mappers
   Include the fetch depth each query uses and note any query fetching at a
   depth higher than the fields it actually reads require.

5. ENVIRONMENT
   Every process.env reference, the file it is in, whether it appears in
   .env.example, and whether the code has a fallback when it is unset. Do not
   print any values from .env.local.

6. QUERY INVENTORY
   Every call that hits the Payload API: the file, the endpoint, the where
   clauses, the limit, and whether it routes through
   buildSiteSeriesWhereParams. Flag any artwork query that does not.

OUTPUT
Write everything to docs/artwork/addendum-route-component-inventory.md.
Tables over prose. No recommendations, no opinions on quality — this is an
inventory, not a review. Where something is ambiguous, say so rather than
guessing.
```

---

# Audit 2 — Style guide reconciliation

```
CURSOR — READ-ONLY AUDIT 2: STYLE GUIDE RECONCILIATION

This is a read-only audit. Do not change any file except the single output
file named at the end. In particular: do NOT edit design-system.md, and do
NOT change any token, class or component to resolve a discrepancy you find.
Report only.

READ FIRST
- docs/design-system.md
- docs/design/design-system.md
- docs/artwork/addendum-style-system-audit.md   (an earlier audit — do not
  repeat findings it already records; note where its findings are now out of
  date instead)
- docs/artwork/addendum-route-component-inventory.md   (if present)

THEN READ AS THE SOURCE OF TRUTH
- tailwind.config.js
- app/globals.css
- lib/fonts.ts
- every file under components/

The CODE is authoritative for what the site currently does. The DOCUMENT is
authoritative for nothing — it may be right, stale, or aspirational. Your job
is to say where they differ and to sort each difference into one of three
buckets.

PRODUCE

1. DISCREPANCIES, in three buckets

   BUCKET A — code is right, the doc is out of date
   Cases where the code is clearly correct and the document simply describes
   an older state. Give the doc section, the doc's claim, and the code's
   actual value with file and line.

   BUCKET B — the doc is right, the code diverges
   Cases where the document states a rule the code breaks. Give the rule, the
   violating file and line, and how many occurrences.
   Check these rules specifically:
     - single breakpoint `l:` at 769px only — flag every sm:/md:/lg:/xl: use
     - rem for font sizes, never px
     - no blur placeholders; cityPlaceholderColor + overlayRects only
     - no react-medium-image-zoom
     - the logo is SVG only, never rebuilt in HTML/CSS
     - damask pattern in dense zones only, never behind artwork imagery

   BUCKET C — needs a human decision
   Cases where neither is wrong and a call is missing. These two are already
   known to be open; confirm the current state of each with evidence rather
   than restating the question:
     - Josefin Sans: list every file and selector where it is actually
       applied. Is it card-scoped only, or has it spread to hero captions and
       timeline years?
     - Artwork detail page titles: what font is actually applied, in which
       file and line?
   Add any other decision-shaped gap you find.

2. TOKENS
   - Every token or utility class defined in tailwind.config.js or
     globals.css that nothing uses.
   - Every hardcoded value in a component that duplicates an existing token
     (e.g. arbitrary values like text-[0.5625rem] or bg-[#FBFAF7] where a
     token exists). Give file, line, the hardcoded value, and the token it
     should be.

3. UNDOCUMENTED COMPONENTS
   Every component with visual styling that design-system.md does not
   describe at all. Just the list.

4. COMMERCE VOCABULARY
   The design system was written for an editorial site. List every style
   currently doing commerce work — prices, availability, selection states,
   buttons, form fields — wherever it lives, including one-off classes on the
   neighborhood page (.home-cta, .neighborhood-field, .neighborhood-submit and
   any others). For each, say whether it is defined in globals.css, in
   tailwind.config.js, or inline.

OUTPUT
docs/artwork/addendum-style-guide-reconciliation.md. Every finding needs a
file and line reference. Do not propose a rewritten design-system.md.
```

---

# Audit 3 — Docs inventory & contradictions

```
CURSOR — READ-ONLY AUDIT 3: DOCS INVENTORY

This is a read-only audit. Do not move, rename, archive or delete any
document. Do not create directories. Write only the single output file named
at the end.

IMPORTANT — WHAT NOT TO DO
Do not judge whether a document is stale, current or superseded, and do not
recommend archiving anything. Staleness here is not detectable from the
documents: several read as internally consistent and confident while
describing decisions that were later reversed in conversations not recorded in
this repository. Collect evidence; the human will make the calls.

SCOPE
Every .md file under docs/, including subdirectories.

PRODUCE

1. INVENTORY
   One row per document: path, last-modified date, approximate word count,
   and in one sentence what it claims to decide or describe. Sort by date,
   newest first.

2. REFERENCES
   For each document, list the routes, components, Payload fields and
   collections it names. Then mark each reference: EXISTS in the codebase, or
   NOT FOUND. Use docs/artwork/addendum-route-component-inventory.md if it is
   present.

3. CONTRADICTIONS
   Where two or more documents make incompatible claims about the same thing.
   For each: the subject, the documents, what each says, and the date of each.
   Do not adjudicate. Report the conflict and let the dates speak.
   Look particularly at: which route the artwork list lives on, what the map
   is for, which series appear on this site, print sizes and editions,
   commerce architecture, and typography.

4. COVERAGE GAPS
   - Components and routes present in the codebase that no document mentions.
   - Documents describing a feature with no corresponding code.

5. DUPLICATES
   Documents with the same or near-identical filenames or content. Report the
   paths and dates; do not deduplicate.

OUTPUT
docs/artwork/addendum-docs-inventory.md. Tables. No recommendations.
```

---

## After they come back

Audit 1 makes the refactor plannable. Audit 2's bucket C is the only part that
needs you rather than a tool. Audit 3 is the raw material for archiving
decisions — which stay yours, and should be a separate, explicitly scoped
task once you've marked up the list.

*Written by Claude, Sept 16 2026.*
