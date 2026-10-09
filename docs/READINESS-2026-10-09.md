# Readiness checkpoint — 9 October 2026

English coverage is complete across the 82 offices: 11,282 rows, zero missing aligned English and zero unpaired supplied-English rows. This is an editorial preview, not a release-ready edition.

This pass visually reviewed all eight English-only offices (Holy Tear, Bonaventure Passion, Immaculate Heart, Akathist, Dominic, Gertrude, Norbert and Serotina). Eighteen offices now have full visual review. The other 64 offices still require source and translation review.

The strict release audit reports 4,762 outstanding checks: 4,687 passage reviews, 64 office reviews and 11 unresolved references. Prepared English attached to malformed Latin remains provisional; English coverage alone does not certify it.

## Reader corrections

- Bonaventure Vespers now includes the continuation printed under a misplaced Compline heading on p.77. The original heading, all passages and legacy links are preserved. The actual Compline remains separate.
- The Akathist title now reads the printed Ever-Virgin; its identifier remains unchanged.
- Thirty-four same-office reference expansions were curated in five offices. The net unresolved reference count fell from 38 to 11. Newly recognized incipits are included in the reference manifest.
- Reference explanations are visible beside the text. The Carthusian solitary-recitation rubric identifies the already displayed blessing without making the reader repeat it.
- English-only transcriptions were compared in full with the PDF. Three Holy Tear drop-capital spacing defects were corrected, retaining original extracted text. Printed repetitions, grammatical irregularities, abbreviated texts and alternative prayer instructions are preserved.

## Remaining reference work

| Office | Block | PDF pages | Required work |
| --- | --- | --- | --- |
| little-office-of-the-blessed-virgin-mary-according-to-the-rite-of-the-order-of-the-brothers-of-the-blessed-virgin-mary-of-mount-carmel-carmelites | `compline-b0031` | 209 | Assemble the seasonal ordinary and proper texts with explicit manual selection; a whole ordinary office cannot be expanded under one hour. |
| little-office-of-the-blessed-virgin-mary-according-to-the-rite-of-the-order-of-the-brothers-of-the-blessed-virgin-mary-of-mount-carmel-carmelites | `sext-2-b0001` | 211 | Assemble the seasonal ordinary and proper texts with explicit manual selection; a whole ordinary office cannot be expanded under one hour. |
| little-office-of-the-blessed-virgin-mary-according-to-the-rite-of-the-order-of-the-brothers-of-the-blessed-virgin-mary-of-mount-carmel-carmelites | `iv-temporare-paschali-b0001` | 212 | Assemble the seasonal ordinary and proper texts with explicit manual selection; a whole ordinary office cannot be expanded under one hour. |
| little-office-of-the-blessed-virgin-mary-according-to-the-cistercian-usage | `vespers-b0014` | 262 | The PDF gives only the hymn incipit “Ave, maris stella” here. This Cistercian office contains no full version of that hymn; a full text from another usage has not been substituted. |
| little-office-of-the-blessed-virgin-mary-according-to-the-rite-of-lyon | `night-office-b0054` | 269 | This “ut supra” incipit has no complete antecedent in the Lyon office on PDF pp.265–279. The referenced responsory or hymn cannot be expanded from this volume without selecting an external edition; its printed incipit is retained. |
| little-office-of-the-blessed-virgin-mary-according-to-the-rite-of-lyon | `night-office-b0057` | 269 | This “ut supra” incipit has no complete antecedent in the Lyon office on PDF pp.265–279. The referenced responsory or hymn cannot be expanded from this volume without selecting an external edition; its printed incipit is retained. |
| little-office-of-the-blessed-virgin-mary-according-to-the-rite-of-lyon | `night-office-b0060` | 269 | This “ut supra” incipit has no complete antecedent in the Lyon office on PDF pp.265–279. The referenced responsory or hymn cannot be expanded from this volume without selecting an external edition; its printed incipit is retained. |
| little-office-of-the-blessed-virgin-mary-according-to-the-rite-of-lyon | `lauds-b0014` | 271 | This “ut supra” incipit has no complete antecedent in the Lyon office on PDF pp.265–279. The referenced responsory or hymn cannot be expanded from this volume without selecting an external edition; its printed incipit is retained. |
| little-office-of-the-blessed-virgin-mary-according-to-the-premonstratensian-use-norbetines | `compline-b0033` | 368, 369 | Resolve the conditional prayer or commemoration assembly against the printed ordering and conclusions. |
| little-office-of-the-blessed-virgin-mary-according-to-the-premonstratensian-use-norbetines | `compline-b0041` | 369 | The printed rubric refers to an antiphon in “Psalt. 135,” an external psalter page, not PDF p.135 (which belongs to the Roman office). No seasonal antiphon is chosen from a different usage; this requires the referenced psalter. |
| little-office-of-the-blessed-virgin-mary-according-to-the-premonstratensian-use-norbetines | `lauds-b0053` | 378 | Resolve the conditional prayer or commemoration assembly against the printed ordering and conclusions. |

Six references have no complete target in the attached office: the Cistercian Ave maris stella, four Lyon hymn/responsory incipits, and the Norbertine external psalter antiphon. Completing them requires the corresponding usage-specific source editions; substituting another usage would conceal a source gap. The five other unresolved references require seasonal or conditional assembly work.

## Validation

Structural validation, all 41 Node tests and the editorial preview build pass. The release audit fails with the outstanding checks above; no production publication or merge is certified. Browser integration was not rerun: this runtime has no Chromium executable. Regression tests cover the repaired Bonaventure assembly, the non-repeated Carthusian blessing and complete/nested reference expansions.

Continue source review using `content/source/book.pdf`; save curated changes in `content/overrides/`, run the importer, and rerun validation. Keep the release gate intact.
