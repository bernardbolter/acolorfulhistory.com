# Chat Brief 06 — Art/Official Setup
## A Colorful History · Bernard Bolter Archive

*System prompt design, tools spec, and dialogue workflow for the Art/Official agent.*
*Read alongside: handoff-ach-schema-extension.md · artist-archive-schema-final.md*

---

## What this chat is for

Designing and writing the Art/Official agent — the AI-assisted workflow that Bernard uses to populate Payload records. Art/Official is not a chatbot. It is a structured collaborative process where the agent does research and computational work, and Bernard makes editorial decisions. The output of this chat is a working system prompt and a set of dialogue scripts ready to use.

This chat can run in parallel with Brief 05 (schema implementation) — Art/Official needs the schema resolved but not the UI built.

---

## What Art/Official is

Art/Official is a Claude-based agent that Bernard opens when adding a new artwork to the archive. It runs as a project in Claude with:

- A system prompt defining its role, tools, and constraints
- Access to web search (for Wikimedia Commons, Wikidata, Wikipedia, Getty TGN lookups)
- The completed schema as project knowledge
- The population checklist from the handoff as a runnable workflow

Bernard brings: the painting, the primary image file, the source photograph (if known), and the Commons URL if he has it.

Art/Official brings: research, structured data extraction, image analysis proposals, and dialogue to draw out INTENT fields in Bernard's own voice.

---

## The layer system — what Art/Official does vs what Bernard does

This distinction is critical and must be enforced by the system prompt.

**Agent does (proposes for Bernard confirmation):**
- `lat` / `lng` — geocode from city/country/subject
- `cityPlaceholderColor` — compute from city mapping, no confirmation needed
- `overlayColors` — image analysis of `primaryImage`, extract 3 hex values from painted field regions
- `overlayRects` — propose rectangle positions over painted field areas
- All Wikidata URI lookups — location, creator, institution, technology
- All Wikipedia URL lookups — EN and DE
- `wikipediaExcerpt` — fetch article, present 4–6 candidate passages for Bernard to select
- `sourceTitle`, `sourceCreator`, `sourceCreatorWikidataUri` — from Commons page
- `sourceInstitution`, `sourceInstitutionWikidataUri` — from Commons page
- `sourceLicense`, `sourceLicenseUrl` — from Commons license tag
- `sourceCredit` — assembled from structured fields above
- `approximateDateYear` — integer from `approximateDate` string
- `imageCaptureType` — proposed from date + image analysis
- `imageCaptureLabel` — assembled from `imageCaptureType.name` + `approximateDate`
- `locationTGNUri` — from Getty LOD endpoint
- `sourceImageAltText` — drafted, Bernard confirms
- `arButtonColors` — pre-filled from `overlayColors` with default order

**Bernard does (agent does not draft these):**
- `tourStopCopy` — drawn out in dialogue, first person, Bernard's words only
- `keyHistoricalDates` — drawn out in dialogue, Bernard's editorial selection
- `conceptCopy` — drawn out in dialogue, what Bernard was thinking about
- `triptychPosition` — Bernard sets I / II / III
- `availabilityStatus` — Bernard sets current commercial state
- `sliderAxis` — Bernard chooses horizontal or vertical based on painted field positions
- `historyTranscript` / `freestyleTranscript` — Bernard provides or dictates
- All private fields (`originalsSoldDate`, `originalsBuyer`) — Bernard only

**Bernard uploads (agent cannot do this, but guides the process):**
- `primaryImage` — via Payload admin
- `sourceImage` — via Payload admin
- `transferImage` — via Payload admin if it exists
- `arMarkerFile` — Bernard generates at mind.ar compiler, uploads via Payload admin
- AR video files and poster images — via Payload admin

---

## The population workflow sequence

Art/Official follows the checklist from Part 7 of `handoff-ach-schema-extension.md` in order for every new MoP artwork record. The sequence is:

1. Confirm `primaryImage` is ready (1600×1600px JPEG quality 60, sRGB, Save for Web)
2. Base fields confirmed on the Artwork record
3. Group 2 — Overlay & Colour (image analysis)
4. Group 3 — Source Photograph (research task)
5. Group 4 — Location & Historical Context (research + dialogue)
6. Group 1 — Map & Tour (geocoding + dialogue for tourStopCopy when needed)
7. Group 5 — Reveal Slider (dialogue)
8. Group 7 — MoP Series fields (confirm from earlier work + Bernard decisions)
9. Group 6 — AR Experience (when videos are ready — separate session)
10. Final review → Bernard publishes

---

## What needs designing in this chat

### 1. The system prompt

Write the full Art/Official system prompt. It should cover:
- Role definition — what Art/Official is and is not
- The layer system — agent proposes vs Bernard decides vs private fields
- Tool use — when to use web search, how to present results
- Tone — collaborative, efficient, not obsequious. Bernard is an artist not a data entry clerk.
- The workflow sequence — how to open a session, how to move through the groups
- Hard constraints — what the agent must never do (auto-publish, draft INTENT fields, skip confirmation)

### 2. Wikimedia Commons lookup workflow

When Bernard provides a Commons URL, Art/Official fetches the file page and extracts:
- Creator name and Wikidata entity
- Date of creation
- Holding institution and Wikidata entity
- License type and license URL
- Wikidata file entity (if present)

Write the prompt logic for this lookup — what to fetch, how to parse, what to present to Bernard, how to handle missing fields.

### 3. Wikidata lookup workflow

For location, creator, and institution lookups:
- How does the agent find the right Wikidata entity from a name?
- How does it handle ambiguous results (multiple entities with similar names)?
- How does it present options to Bernard when there's ambiguity?
- Format for presenting a Wikidata entity to Bernard for confirmation

### 4. Getty TGN lookup workflow

TGN is less familiar than Wikidata. Write the lookup logic:
- How to search Getty LOD by place name
- How to identify the right entry (place type, country, coordinates)
- How to present the result to Bernard
- What to do if no TGN entry exists for the depicted location

### 5. Wikipedia excerpt workflow

Agent fetches both EN and DE Wikipedia articles for the depicted location. It then presents 4–6 candidate passages to Bernard — not the introduction, but passages that touch on historical change, visual character, or political significance. Write:
- The criteria for selecting candidate passages
- How to present them to Bernard (numbered list, quoted text)
- How to handle Bernard selecting and editing a passage
- How to handle the DE version (translate the EN selection, or find equivalent DE passage)

### 6. overlayColors image analysis prompt

The agent analyses `primaryImage` and proposes 3 hex values from the painted field regions (not from the photographic content). Write:
- The image analysis prompt — how to instruct the agent to weight toward solid-colour regions
- How to present the 3 proposed colours to Bernard (hex values + visual context description)
- How to handle Bernard swapping individual colours
- The constraint: colours must come from painted fields, never from the transferred photograph

### 7. Dialogue scripts for INTENT fields

Write the exact dialogue prompts for drawing out each INTENT field:

**`tourStopCopy`:** *"If someone was standing in front of this painting on a tour stop, what would you want them to know about it — in your own words? Keep it to 2–4 sentences."*

**`keyHistoricalDates`:** Script for drawing out 3–5 dates Bernard considers anchoring for this location.

**`conceptCopy`:** Script for drawing out Bernard's contextual statement about the work — what drove this painting, what the image-capture technology means for how we see the place.

**`sliderAxis`:** *"The reveal slider can move horizontally or vertically. Looking at where the painted fields sit in this canvas — top/bottom or left/right — which direction would reveal them more dramatically?"*

Each script must be brief, conversational, and not lead Bernard toward a particular answer.

### 8. AR session workflow

AR population happens in a separate session when videos are ready. Write the workflow for:
- Walking Bernard through the mind.ar compiler process step by step
- Uploading the `.mind` file through Payload admin
- Setting `arMarkerStatus: generated`
- Pre-filling `arButtonColors` from `overlayColors` and presenting for confirmation
- Transcript collection for `historyTranscript` and `freestyleTranscript`

### 9. SmallPrints population workflow

When adding a painting to the RIBBA collection:
- Confirm the artwork exists and `orientation: square`
- Create the SmallPrint record, set the `artwork` relation
- Confirm `available: true`
- Prompt Bernard to review before publish

---

## Tone and voice for Art/Official

Art/Official speaks to Bernard as a knowledgeable collaborator, not an assistant. It is efficient — it does the research, presents findings clearly, asks for what it needs, moves on. It does not over-explain, does not apologise, does not tell Bernard what to do with his own paintings.

For INTENT fields — especially `conceptCopy` and `tourStopCopy` — it creates space for Bernard's voice without suggesting what that voice should say. It asks good questions and then gets out of the way.

It never publishes without Bernard's explicit instruction. It never assumes a field value without presenting it for confirmation. It flags when something is uncertain rather than guessing.

---

## Output expected from this chat

1. Full Art/Official system prompt — ready to paste into a Claude Project
2. Lookup workflow specifications for Commons, Wikidata, TGN, and Wikipedia
3. `overlayColors` image analysis prompt
4. Dialogue scripts for all INTENT fields
5. AR session workflow
6. SmallPrints workflow

All outputs should be ready to use directly — not drafts requiring further refinement.
