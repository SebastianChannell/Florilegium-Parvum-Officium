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

### Passages printed only in the English column

An `english-supplement` block preserves supplied English without inventing Latin. It requires `source: null`, `sourceOmission: true`, nonempty supplied English, an explanatory `editorialNote`, and identical `sourcePages`, `englishPages`, and `translation.sourcePages`. Those pages identify the printed English, not a missing Latin passage. The reader shows an explicit source-absence message in parallel or stacked mode, the supplied text in English mode, and omits the supplement in source-only mode. Ordinary source passages must still have nonempty source text.

### Exact reviewed English reuse

`scripts/editorial/reuse_reviewed_english.py` may fill an empty English field when the complete Latin passage matches a reviewed source passage after whitespace normalization alone. It skips conflicting English candidates and does not overwrite existing English or source-review status. Supplied English retains the original PDF pages and source-office/block identifiers. Prepared English retains the required notice. Validation verifies the referenced original, the complete Latin equality, the copied English, and supplied-page provenance. Reused bilingual content requires `translationScope: marked` when the office also contains prepared English.

### Reusing reviewed PDF English across punctuation/case variants

`python3 scripts/editorial/reuse_reviewed_english.py --word-sequence` is an explicit conservative alternative to the default whitespace-only pass. It requires the same complete ordered Unicode letter/number sequence after lowercasing, without removing accents or changing spellings. Existing English and source-verification status are preserved; conflicting English candidates are skipped. Provenance uses `method: reviewed-pdf-word-sequence-reuse`, `normalizationPolicy: unicode-letters-numbers-lowercase-v1`, and the original office/block identifiers. A visible note explains the punctuation/case difference and carries original printed-text notes. Supplied English retains its original PDF English pages. The validator independently recomputes the sequence and checks the reviewed origin and unchanged English. This never certifies the target source or expands abbreviations.
