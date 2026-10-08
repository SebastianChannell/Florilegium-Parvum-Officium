# Content maintenance

`content/source/book.pdf` is the authoritative attached file. Inventory uses visible headings rather than incomplete bookmarks. Raw source strings, line/block boxes, fonts, sizes, and colors are retained in `layout.json`.

```sh
python3 scripts/inventory.py
python3 scripts/import_pdf.py
```

Import loads any same-ID `content/overrides/` document in preference to a generated candidate. It refreshes inventory statuses/sections/coverage and reference candidates. Re-running inventory alone resets workflow metadata: run import immediately afterward.

The independent `office-boundaries.json` is not regenerated automatically. Change it only after visual source-boundary review; validation compares it with inventory/documents.

## Model

Office documents contain stable `id`, title/category, `source.pdfPages`, `sourceLanguage`, notes, translation notice/status, ordered sections, and `unpairedEnglish`. Sections preserve title, source heading, pages, and ordered blocks. Blocks preserve `id`, `type`, source/optional English, source pages, translation provenance, correspondence, and verification status. Keep existing URLs/IDs stable when correcting text.

Block types: `prayer` (words to pray), `rubric` (local instruction), `heading` (prayer-level heading). Notes are distinct from hour blocks. Verify types visually: red text may be prayer, regular text may be instruction.

## English provenance

Preserve supplied English, including unusual wording. Prepared English uses `translation.kind: "prepared"`, `preparedFor: "Sacrum Florilegium"`, source-page provenance, and editorial translation-review status. The office must visibly contain:

> English translation prepared for Sacrum Florilegium; not supplied in the source PDF.

Mixed cases use `translationScope: "marked"`: the reader explains scope and adds † to prepared passages/notes. Translation review is distinct from source transcription verification. Conjectural readings must be explicit and keep the affected source block/office pending.

English-only sources use `sourceLanguage: "English"`, supplied text in `source`, `english: null`, and `source-English` provenance. Never duplicate English into bilingual columns or invent Latin.

## References and variants

Section `assembly.before` / `assembly.after` reference exact block IDs to display source Ordinary/Conclusion material around an hour. Assemble only what actual source rubrics support, preserving source pages. Missing IDs fail validation.

Office `variants` specify selector IDs, source pages, options/default. Block `when` controls inclusion; `forms` supplies exact selected source/English text. Selection is manual and independent of any calendar.

`references.json` contains unresolved **candidates**. Resolution needs a curated workflow with actual target block/source provenance; changing a status alone is insufficient. Some abbreviations still require manual discovery.

## Checks

```sh
npm run check
npm test
npm run build:preview
npm run coverage
```

Structural checks cover missing offices/sections/blocks, duplicate IDs, source pages, English-only duplication, translation provenance/notices, variants, and assembly links. The strict gate also requires visual review, complete English, paired supplied text, and resolved references. Preview remains visibly incomplete while the gate fails.

Record suspected source errors separately from extraction errors in `docs/SOURCE-REVIEW.md`, with office/page/literal reading/disposition. Preserve historical statements as source claims, not present-day approval.

## Exact translation memory

`content/translations/exact-memory.json` contains prepared English keyed to the **complete exact source string**. Apply with:

```sh
python3 scripts/editorial/apply_translation_memory.py
python3 scripts/import_pdf.py
```

Application is limited to offices inventoried as Latin-only. It never replaces existing English, never operates on supplied bilingual offices, never normalizes different Latin readings into one key, and never certifies a passage's source transcription or an office's visual review. Each applied translation records its memory ID and that passage's own PDF pages. The operation is idempotent; curated overrides remain authoritative.

## Inline source references

A manually reviewed `block.referenceExpansion` contains `targets` (same-office block IDs), `sourcePages`, and an explanatory `note`. The reader retains the original abbreviated reference as a rubric and follows it with the referenced text. Nested expansions reject missing targets and cycles. Validation requires the reference manifest and content expansion to agree; a bare `resolved` status is insufficient.

`source-reading-pending` passages remain pending even when provisional English exists. The reader displays a section warning in addition to the office's detailed editorial notes. Do not remove that warning or promote an office's status merely because all its English fields are populated.
