# Readiness checkpoint — 9 October 2026

English coverage is complete across the 82 offices: 11,282 rows, zero missing aligned English and zero unpaired supplied-English rows. This is an editorial preview, not a release-ready edition.

This pass visually reviewed all eight English-only offices (Holy Tear, Bonaventure Passion, Immaculate Heart, Akathist, Dominic, Gertrude, Norbert and Serotina). Twenty-seven offices now have full visual review. The other 55 offices still require source and translation review. The current target is 20 remaining offices.

The strict release audit reports 4,607 outstanding checks: 4,541 passage reviews, 55 office reviews and 11 unresolved references. Prepared English attached to malformed Latin remains provisional; English coverage alone does not certify it.

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

Structural validation, all 44 Node tests and the editorial preview build pass. The release audit fails with the outstanding checks above; no production publication or merge is certified. Browser integration was not rerun: this runtime has no Chromium executable. Regression tests cover the repaired Bonaventure assembly, the non-repeated Carthusian blessing and complete/nested reference expansions.

Continue source review using `content/source/book.pdf`; save curated changes in `content/overrides/`, run the importer, and rerun validation. Keep the release gate intact.

## Source comparison continuation

Nine further offices have completed review: Sacred Heart (43–48), Joseph (420–423), Anthony of Padua (443–445), Holy Ghost (90–91), Barbara (450–452), Francis Xavier (505–507), Francis Borgia (498–500), Aloysius (429–431), and the Dead (611–613). Their attached pages and English rows were compared, and the affected ordinary prayer assemblies were repaired. Anthony’s Matins stanza had reversed printed columns; both original extracted texts remain in its review history.

The cited 1879 Coeleste Palmetum scan resolves Holy Ghost’s cœlos and the Dead’s defective hymn lines. Barbara’s sanabo is confirmed in both editions and now translated literally as heal; the prior conjectural singing translation is withdrawn. The 1745 Officium Rakoczianum supports readings in Xavier, Borgia and Aloysius. It is explicitly identified as an earlier edition: this comparison does not verify the cited 1783 edition. Attached Latin remains unchanged, and every adopted earlier reading has a visible note. Literal oddities, including Borgia’s power of demons, remain literal rather than silently acquiring a new meaning.

`content/source-reading-reviews.json` records the book URLs, downloaded PDF SHA-256 hashes, page numbers and checked readings. Validation rejects missing records, mismatched readings, absent source fragments and malformed book provenance. Source digests and original supplied-English fixtures remain intact. The reduction from 64 to 55 pending offices is a review checkpoint; work toward 20 continues.
