# Handoff — 8 October 2026

**Latest readiness:** See [READINESS-2026-10-09.md](READINESS-2026-10-09.md) for complete English coverage, the eight English-only reviews, reader corrections and the exact remaining release blockers.

**Updated work:** See [CONTINUATION-2026-10-08.md](CONTINUATION-2026-10-08.md) for the subsequent translation and pairing pass. The counts below describe the earlier checkpoint.

The user requested: **“Push all current work, including unfinished translations and progress notes, to a branch in Florilegium-Parvum-Officium so another session can continue.”** This is preserved partial work, not a completed bilingual edition.

## Repository and source

- Branch: `feat/parvum-officium` in `SebastianChannell/Florilegium-Parvum-Officium`.
- Started from initial commit `5753a75`; the repository contained only a README and no repository-specific instructions or hosting setup.
- Exact attached source: `content/source/book.pdf`, 661 pages. SHA-256 recorded in the inventory.
- 82 visible office headings, including the unindexed distinct office on pp. 86–89. Category bookmarks are misdirected; actual visible headings/dividers determined boundaries.

## Coverage at handoff

| Measure | Count |
| --- | ---: |
| Visible office entries | 82 |
| Candidate sections | 686 |
| Source prayer/rubric blocks | 11,384 |
| Source blocks without aligned English | 10,018 |
| Unpaired supplied English blocks | 1,613 |
| Prepared English passages/notes | 64 |
| Offices marked visually reviewed | 2 |
| Unresolved reference candidates | 246 |

Principal prayer-language coverage: 62 Latin-only entries, 12 with supplied Latin/English, 8 English-only. Introductions/rubrics can have different coverage. **Section counts, internal versions, and paragraph boundaries are candidates, not final verified inventory totals.** Missing aligned English includes passages whose supplied English is in an unpaired run; not all need newly prepared translations.

## Curated overrides

Five full-document overrides preserve current editorial work:

1. **Most Holy Trinity, pp. 21–22:** 40 prepared English blocks; both pages visually checked; hymn/Commendatio line divisions restored; explicit seasonal selection; Ordinary/Conclusion assembly for the seven actual hours. `Mundi que` and abbreviated `Per Dominum` are retained and noted.
2. **Guardian Angel, pp. 413–415:** supplied bilingual pairings visually checked across all three pages. Seasonal rubric/prayer separated. Latin Septuagesima versus English Lent terminology both retained. The malformed source `aeterna sociate` is preserved and noted.
3. **Sacred Heart, pp. 43–48:** supplied Matins/Compline paragraph runs reconciled. The conclusion is reversed in the PDF (English left, Latin right); reordered for the reader with provenance. This remains pending full visual certification.
4. **Holy Ghost, pp. 90–91:** 23 prepared English blocks; both pages visually inspected. Prime visibly prints `ccelos`; English `heaven` is explicitly conjectural, source spelling retained. Office/block remains `source-reading-pending`. Source hymn line divisions, abbreviated formulas, shared beginnings, and seasonal controls need further work.
5. **BVM — Dominican rite, pp. 280–320:** Latin introductory note has prepared English, mixed notice, and † mark. Historical indulgence statement distinguished from present-day claims. Supplied body English/pairings/references remain substantially unfinished.

English is stored as project content; no live translation service is used. Preparation recipes for Trinity, Guardian Angel, and Holy Ghost are saved in `scripts/editorial/` as work records. The overrides are authoritative for later edits; do not rerun a recipe over newer corrections.

## Reader and checks

- Independent static HTML/CSS/JS; no database/framework/runtime dependency.
- Officium visual/font stacks, exact existing Sites destinations, and Domus cross favicon reused. Reference repositories read only.
- Search/categories; actual candidate sections; visible current office/hour; native accessible controls; hash URLs/explicit variants; storage; four reading modes; font size; notes/provenance.
- Shared row for corresponding prayer blocks. Unpaired supplied English retained in an explicitly unverified panel. Incomplete English is visibly identified; English-only sources never duplicate English or invent Latin.
- `npm run check`: passed.
- `npm test`: 12 tests passed.
- `npm run build:preview`: passed.
- Browser checks passed all 82 office selectors and every candidate section at 320/390/430/1280 widths; four layouts; row alignment/stacked order; seasonal URLs; reload/storage/history; search; keyboard skip link; 44px controls; no horizontal overflow/page errors. Initial load fetched one office and no PDF.
- Browser run preceded the final Holy Ghost override (text/status only). Structural/unit checks and preview build were rerun afterward.
- `npm run coverage` and production build deliberately fail; never describe that as content acceptance passing.

## Continuation priorities

1. Preserve the five curated overrides; save all new corrections/translations under `content/overrides/`.
2. Visually verify all supplied bilingual offices, especially Roman/Dominican long streams, paragraph continuations, beginnings/endings, and reversed language runs. Equal block counts are only candidates, not proof of correspondence.
3. Make Carmelite seasonal structure explicit. Repeated Matins/Lauds/etc. labels remain ambiguous; some seasonal headings are within notes/blocks. Use reviewed manual variants and source labels, not inferred calendar rules.
4. Resolve references from this PDF, retaining target IDs and page provenance. Expand abbreviations only when exact text can be established from the PDF; do not use DO or another edition. The current regex does not detect every abbreviation.
5. Translate every remaining untranslated Latin paragraph/note in the requested register. **Do not replace supplied English just because pairing is unfinished.** A common-prayer translation-memory approach was considered but has not been implemented/applied.
6. Verify rubric/prayer distinctions and meaningful stanza divisions. Some red/italic spans contain prayers; some regular-font English spans are instructions. Font metadata is only a hint.
7. Audit English-only entries, extra prayers, and non-hour Mozarabic texts. General material (Preface, compiler note, Ceremonial, p. 17 prayers, bibliography) is inventoried and in the full PDF, but lacks a separate structured reader.
8. Repeat appropriate checks after corrections. Keep the publication gate blocked until every office, required translation, pairing, and reference is reviewed.
9. Hosting remains unconfigured. Follow Cloudflare Pages conventions; no DNS/other-site changes without a separate request.

## Importer limitations

The importer refuses unequal stream pairing, but structurally equal candidate pairs still require review. It uses geometry/fonts/title mappings, not a liturgical parser. Hyphen removal is heuristic; raw strings/geometry are retained. Font changes can split source sentences (e.g. Carthusian `Do-` / `minus`). Some geometric material can be classified as notes rather than prayers. Some Latin office rubrics are English. These defects remain in draft offices and are not certified as corrected.

This is a comprehensive **first-pass office inventory**, not verified internal version/hour/text completeness. The existence of 82 content JSON files does not satisfy the user's full-content acceptance criteria.
