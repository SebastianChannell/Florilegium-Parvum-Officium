# Translation continuation — 8 October 2026

This continues the draft in PR #1. **The full edition is still incomplete.** The production completeness gate remains in place.

## Changes

- Added an exact-source translation memory with 189 entries and an idempotent application script. Applied English only to Latin-only offices; supplied bilingual offices were excluded. Existing English was not overwritten. Original transcription-review statuses remain unchanged.
- God the Father, pp. 23–25: all prayer blocks now have prepared English; seven actual hours plus Oblatio retained. Hymns translated; repeated Matins references expanded. Page 25 contains malformed Latin; its second offering has provisional English and an explicit source-reading warning.
- Blessed Sacrament, pp. 54–56: paired all supplied English, verified all three pages, corrected rubric types, and assembled the proper opening and conclusion around each of the seven actual hours. Preserved the Latin Septuagesima/English Lent discrepancy.
- Immaculate Conception, pp. 383–389: paired remaining supplied English and checked all pages. The rearranged Matins stanzas are aligned as a larger unit instead of false individual pairs. Preserved visible source mistakes and all supplied English. Separate Ordinary/Conclusion remain available; further assembly/seasonal ergonomics are not asserted complete.
- Benedictine Oblates (Alternative Version), p. 633: paired supplied English and visually checked the whole page; retained `ad adjuvandam` and the more explicit English seasonal instruction.
- Holy Ghost for Obtaining the True Love of God, pp. 100–102: all blocks now have prepared English, hymns in stanzas, source pages checked, opening invocation and referenced collect expanded. Two malformed readings remain explicitly provisional.
- Most Holy Sacrament of the Eucharist, pp. 57–59: all blocks now have English; prayers and hymns translated, repeated references expanded. Broken Prime text, incomplete Terce line, and corrupt Commendation are explicitly marked. English fields being filled does not mean these passages are ready for devotional publication.
- Against Evil Spirits, pp. 609–610: all blocks now have prepared English, headings corrected and page images checked. Two irregular source phrases remain flagged.
- Added visible section warnings for source-reading uncertainty.
- Added inline reference rendering and validation: keep original reference as rubric, show its same-office target text, reject broken/circular targets, and require matching resolution provenance.

## Coverage after this continuation

| Measure | Earlier handoff | Now |
| --- | ---: | ---: |
| Office entries | 82 | 82 |
| Candidate sections | 686 | 686 |
| Source blocks | 11,384 | 11,381 |
| Blocks without aligned English | 10,018 | 6,579 |
| Prepared English passages/notes | 64 | 3,450 |
| Unpaired supplied-English blocks | 1,613 | 1,564 |
| Offices with visual-review status | 2 | 5 |
| Unresolved reference candidates | 246 | 209 |

The three-block difference results from joining Immaculate Conception hymn units for accurate correspondence, not omitted text. Many new prepared blocks are repeated common prayers; do not interpret the count as thousands of unique translations. Additional visually inspected offices remain `source-reading-pending` because the PDF itself is defective.

## Verification

- Structural content check passed.
- All 16 Node tests passed, including exact-memory preservation/idempotence and inline-reference cases.
- Editorial preview build passed.
- Strict publication check still fails, correctly, for unfinished content and source review.
- A new browser smoke test could not launch: this environment has the Playwright library but no installed Chromium executable. The previous handoff's browser results apply only to its earlier version; do not claim new browser verification from them.

## Remaining work

Continue supplied-English alignment before generating replacement English. In particular, the large Roman/Dominican streams and other bilingual offices still contain 1,564 unpaired supplied blocks. There remain 6,579 missing aligned-English blocks, introductory-note work, Carmelite variant structure, source transcription review, and 209 unresolved reference candidates. Consult `docs/coverage.json` and the original `docs/HANDOFF.md` for the complete limitations.

No production deployment, DNS change, merge, or other repository modification was performed.
