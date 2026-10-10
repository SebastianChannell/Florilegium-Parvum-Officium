# Readiness checkpoint — 9 October 2026

English coverage is complete across the 82 offices: 11,282 rows, zero missing aligned English and zero unpaired supplied-English rows. This is an editorial preview, not a release-ready edition.

This pass visually reviewed all eight English-only offices (Holy Tear, Bonaventure Passion, Immaculate Heart, Akathist, Dominic, Gertrude, Norbert and Serotina). Thirty-seven offices now have full visual review. The other 45 offices still require source and translation review. The current target of 45 remaining offices has been reached.

The strict release audit reports 4,545 outstanding checks: 4,489 passage reviews, 45 office reviews and 11 unresolved references. Prepared English attached to malformed Latin remains provisional; English coverage alone does not certify it.

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

`content/source-reading-reviews.json` records the book URLs, downloaded PDF SHA-256 hashes, page numbers and checked readings. Validation rejects missing records, mismatched readings, absent source fragments and malformed book provenance. Source digests and original supplied-English fixtures remain intact. The pending office count is now 45; the release gate remains intact.

## Restored and completed review checkpoint

Seven previously completed local reviews were restored after the workspace reset: Holy Name of Jesus (38–42), the three Japanese martyrs (545–547), Alexius (440–442), Stanislaus Kostka (602–604), Seven Dolours (395–397), Ignatius and Xavier (520–522), and Holy Ghost for obtaining true love (100–102). Their source-reading evidence and original prepared English are retained. The Holy Name hymn is corroborated by the undated CMAA Anerio score; the true-love hymn uses a comparison witness in Paradisus animae Christianae (1683). Neither witness certifies the office edition cited in the compilation.

Three additional offices completed full review: Ludger (555–560), Joachim and Anne (527–530), and Anne (436–439). Ludger was compared with the ULB Düsseldorf original booklet, catalogued after 1712; the 1712 date inside concerns indulgences and is not represented as a publication colophon. The printed persecutionem, lessus (lamentations), and conscendisti repair defective prepared English. Angliam is retained as printed; lucis is read as the ablative plural of lucus, groves. Joachim and Anne were compared with the cited Palmetum 1879 PDF 300–304: Marite resolves the unclear address, missing hymn lines are restored in prepared English, and the offering concerns a pair of turtledoves and the speaker’s heart. Anne uses earlier Rakoczianum 1745 PDF 225–227; its unusual stella maris address is retained literally with a visible ambiguity note, without certifying 1783.

Three reused English rubrics said Lent although the Latin begins at Septuagesima. Their corrected English is now prepared, with original English and exact reuse provenance retained. Regression fixtures check both the original and the explicitly reviewed correction; source digests are unchanged. There are 7,728 prepared English rows, zero missing English and 11 unresolved references.

## Further prepared-English review

Compared all attached pages for Child Jesus (52–53), Paul (583–585) and the opening passage of Bruno (472). Six prepared-English rows were corrected, with previous English and translation metadata retained in the overrides. The Latin, IDs, printed sections and supplied English were unchanged.

- Child Jesus: removed the unsupported “plunges” for `prosentitur`, “human” for `Ade`, and silently reconstructed curling golden hair for `auro dant crispo splendicant`. The English now identifies those unresolved words explicitly. The securely translated surrounding clauses and closing reference to love were revised.
- Paul: the Prime antiphon's printed `virgins` does not certify “with rods”; the conclusion's `frigisque vitae anteacta` does not certify “coldness of my former life”. These gaps are now explicit in the prepared English.
- Bruno: the opening prints `investigabiles`, meaning searchable, whereas the previous English silently read unsearchable. The English now follows the printed wording, explains the missing negative prefix, and marks the passage pending comparison.

These are corrections to provisional translations, not completed office certifications. There remain 45 pending offices and 11 unresolved references. The strict audit has 4,545 checks, one more because Bruno's previously unflagged discrepancy is now correctly pending. Structural validation, all 44 tests and the preview build pass.
