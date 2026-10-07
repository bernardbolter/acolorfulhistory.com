# Read-Only Audit 4 — Build State vs Build Spec
## acolorfulhistory.com · prompt, ready to paste into Cursor

*Written Oct 7 2026. Read-only. Follows Audits 1–3 (Sept 16) and Phase 0 (Sept 17).
Purpose: establish what is actually built against `docs/build-spec.md` §10, so the
roadmap is made from evidence rather than from the last document anyone wrote.*

---

```
CURSOR — READ-ONLY AUDIT 4: BUILD STATE VS BUILD SPEC

This is a read-only audit. Do not change, move, delete or create any file except
the single output file named at the end. Do not fix anything you find. If you run
commands, they must be read-only (git log/status/diff, npm run build, npm run lint,
tsc --noEmit, grep). Do NOT call the live Vendure shop-api with any mutation, and do
not print any value from .env.local.

READ FIRST
- CLAUDE.md
- docs/build-spec.md
- docs/artwork/addendum-route-component-inventory.md (Audit 1, Sept 16)
- docs/artwork/addendum-style-guide-reconciliation.md (Audit 2)

The CODE and GIT HISTORY are authoritative for what exists. The documents are
authoritative for what was intended. Report the difference. Do not adjudicate it.

PRODUCE, as markdown tables. Every row needs a file and line reference or a commit
hash. Where something is ambiguous, say so rather than guessing.

1. GIT STATE
   - Current branch, every local and remote branch, last commit date on each.
   - Which of these are merged into main: phase-0-fix-and-clear and any other
     phase-* branch.
   - Commits on main since 2026-09-17, one line each.
   - Uncommitted or untracked changes right now (git status), and any stashes.

2. PHASE STATUS
   One row for each of: Phase 0, Phase 0b, Phase 1, Phase 2, Phase 3, Phase 4,
   Phase 5, Phase 6, Phase 7, Phase 8, and the artwork-page thinning (§3.3).
   Columns: status (DONE / PARTIAL / NOT STARTED), the branch or commit that holds
   it, the acceptance gate quoted from §10, and the evidence that the gate is or
   is not met. For PARTIAL, list exactly which pieces of the phase exist and which
   do not. Do not mark DONE on the strength of a branch name or commit message —
   mark it on what the code does.

3. ROUTES — TARGET VS ACTUAL
   Re-do Audit 1's route table as it stands today, then diff it against the §3.1
   target table. For each target route: exists / does not exist / exists but
   differs, and what renders (real content, placeholder, redirect, empty state).
   Confirm RESERVED_SLUGS contains paintings, commissions, prints, neighborhood,
   and that every route file's segment is in it. Confirm the redirects:
   /neighborhood → /commissions, /series → /paintings.

4. COMMERCE BOUNDARY
   - Do lib/commerce/catalog.ts, static.ts, vendure.ts exist? Does lib/vendure.ts
     remain the only module that imports Vendure types or the shop API URL? List
     any component or lib file outside it that does.
   - COMMERCE_ADAPTER: where read, what the default is, whether the fail-closed
     fallback logs.
   - Does the Vendure client send the vendure-token header for a-colorful-history?
   - .env.example: is COMMERCE_ADAPTER present, is VENDURE_SHOP_API present and
     commented out?
   - vendureProductId values stored on Payload triptych print sets (read from
     seed scripts or fixtures in the repo, not from the live API): list each,
     and say whether it looks like a real catalogue ID or a placeholder.
   - What the print-packet terminal in catalog.ts currently is (payment link,
     order-request form, or none).

5. AVAILABILITY MODEL
   - Is ARCHIVE_SOLD_STATUSES still present? Is there an exhaustive
     Record<ArchiveStatus, UnifiedAvailability>?
   - Where is forsale derived in both mappers, and from what?
   - Any remaining fallthrough to 'available'.

6. DATA LAYER
   - lib/studioPeriods.ts: exists? Shape, accessor signature, and every consumer.
   - The unmade photograph pool (§5.4): does any collection, static file or type
     exist? Fields present vs the §5.4 minimum list.
   - SmallPrints / packetSalesCount: exists anywhere?
   - commission-inquiries: is there a source field? Is the neighborhood answer
     stored on an order anywhere?
   - Payload sale-webhook receiver: exists? Does it verify HMAC-SHA256 against the
     raw body, check timestamp age, and dedupe on orderCode?

7. CLAUDE.md KNOWN-BROKEN TABLE
   Quote each row of the known-broken table and state whether it is still true,
   with evidence.

8. CONTENT READINESS
   For every page and component built so far, list what renders from real data and
   what renders from a hardcoded default, placeholder string, TODO or
   fromCms: false. Specifically check: homepage studio-period line, /commissions
   price and ladder copy, sky options, print-set dimensions or paper-size labels
   (the spec says none should appear), and any in-situ photograph slots.

9. HOMEPAGE AND ARTWORK PAGE
   - What the homepage renders today, band by band, against §3.2's four bands.
   - Whether the hero choreography files (components/Home/HeroListItem.tsx,
     components/Home/hero-timeline.ts) are byte-identical to their state at the
     Sept 17 commit before Phase 0, or what changed.
   - ArtworkPage: is StoryColumns still rendered, is HistoricalDatesTimeline kept,
     is there any commercial ask on the page, what gates the archive link.

10. §12 OPEN DECISIONS — EVIDENCE ONLY
    For each of the five CLAUDE.md decisions (Josefin Sans scope, artwork title
    font and size, Limelight on prices, nav panel colour, open-nav logo
    behaviour), report the current state in code with file and line. Do not
    recommend.

11. HEALTH
    Run npm run build, npm run lint and tsc --noEmit. Report pass/fail and the
    error and warning counts against the Phase 0 baseline of 11 errors / 7 warnings.
    List any new errors by file.

12. DOC DRIFT
    Claims in CLAUDE.md and docs/build-spec.md that are now false or out of date
    given what you found above. Quote the claim, give the section, give the
    evidence. Do not rewrite either document.

OUTPUT
Write everything to docs/artwork/addendum-build-state-oct2026.md. Tables over
prose. No recommendations and no opinions on quality — this is an inventory of
state, not a review. Finish with a single table titled "Not found anywhere in the
repo" listing every item the spec names that has no trace in code, fixtures or
docs.
```

---

## After it comes back

Bring the addendum back here. It feeds three things: the status column for the roadmap, a corrected `CLAUDE.md`, and the list of what is genuinely blocking versus merely unbuilt.

*Written by Claude, Oct 7 2026.*
