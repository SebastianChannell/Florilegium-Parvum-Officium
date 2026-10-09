# Translation continuation: supplied English fully paired

All supplied bilingual streams have been paired, including all eight Dominican hours. No unpaired supplied English remains. Both printed columns are conserved in independent fixtures; English-only supplements have an explicit source-absence display.

Four further Latin-only offices now have English throughout:

- Holy Cross, pp.64–67: fully visually reviewed; full references displayed from the same office; no Lauds invented; hymn stanzas and seasonal instructions translated.
- Most Holy Name of Jesus, pp.38–42: every stanza translated; fragments joined; only the six printed hours retained. Printed “vaniae” has provisional “pardon” with a source note; office remains pending for that reading.
- Most Amiable Child Jesus, pp.52–53: hymns, versicles, and collect translated; recurring prayer references expanded. Three irregular source readings remain explicitly provisional.
- Child Jesus in the Manger, pp.49–51: hymns, antiphons, and collects translated; repeated opening references expanded. Abbreviated conclusions and three malformed source readings are retained and explained.

606 further empty English fields now reuse a complete, identical Latin passage from an already reviewed source elsewhere in the PDF: 600 supplied and six prepared. Only whitespace is normalized. Conflicting candidates, existing English, and source-review status remain untouched. Original English PDF pages and source office/block are recorded and validated. The script is idempotent: the second pass adds zero passages. Many reused rows are short common prayers or headings; 606 is a passage count, not a count of newly translated unique prayers.

Checks: structural validation, all 35 Node tests, Python syntax checks, and editorial preview build pass. Browser integration assertions were updated for the English-only supplement, but no browser run was performed because Chromium is not installed in this runtime.

Remaining: 2,909 source passages without English, 85 unresolved reference candidates, transcription/variant structure review, and final publication acceptance. Ten offices have full visual-review status; several others have been inspected but remain pending because the PDF itself contains defects. The production gate remains intact. This is a preserved continuation, not a finished publication.

## Further continuation

Ten further offices now have English rows throughout: Saint Anne (436–439), Saint Barbara (450–452), Saint Sebastian (590–593), the Monastic BVM office (321–347), Aloysius Gonzaga (429–431), Ignatius and Francis Xavier (520–522), the three Japanese martyrs (545–547), John of God (541–544), Mary Magdalene (566–568), and the Dead (611–613). All relevant PDF pages were visually inspected. Malformed source clauses remain provisional; several unintelligible clauses are explicitly marked in English rather than assigned invented meanings. These ten offices remain pending for source resolution and are not certified publication-ready.

Monastic Matins now selects its three printed weekday psalm groups, Advent/non-Advent lessons, and the printed responsory additions/substitutions associated with saying the Te Deum. No Te Deum text or calendar is invented. Repeated opening, conclusion, and Marian-anthem instructions expand within the office. Eight wrap fragments are joined, preserving original extracted text and identifiers.

Source notes are now carried with reused English, including differences between Septuagesima in Latin and Lent in the supplied English. Nineteen additional identical reviewed passages are reused, for a cumulative 625. Regression fixtures preserve all ten offices’ original source text, existing supplied English, and actual sections; tests also exercise all twelve Monastic Matins combinations.

## Checked reuse and introductory notes

154 further English rows reuse reviewed PDF passages with the exact complete sequence of Unicode letter/number tokens. The explicit `--word-sequence` mode ignores punctuation and capitalization only: accents, spellings, word order, omitted/added words, and numbers must match. Differing English candidates are rejected. Target Latin, existing English, and target verification status remain untouched. The validator independently checks the policy and origin; tests reject missing/added/reordered words, different accents/numbers, and copied certification. This mode is separate from the 625 whitespace-only exact reuses.

All 17 previously untranslated Latin introductory notes now have prepared English; 21 non-English introductory notes in total now have English. Each retains its original text and PDF pages and displays above the office. The Norbertine note has malformed source wording and its relevant clause remains explicitly provisional; no calendar automation is inferred from any historical instruction.

Two more offices have English throughout: Francis Borgia (498–500) and the Mozarabic bedtime prayer (651–652). Both were compared visually with all their PDF pages and preserve their original contents. Their malformed printed passages remain flagged, including an ambiguous Creed phrase; no clauses are added from a standard Creed. The bedtime office retains its single non-hour section. Source-preservation fixtures now cover twelve continued offices.

After the two new translations, a further 19 complete-word-sequence matches became available; the next pass adds zero, with all 35 tests still passing.

## Six further source-reviewed continuations

Francis Xavier (505–507), Lawrence (552–554), Alexius (440–442), Joachim and Anne (527–530), Philip Neri (586–589), and Bruno (472–475) now have English rows throughout. All relevant PDF pages were visually inspected. Their seven printed hours and non-hour concluding material remain; none adds Lauds. Distinct Philip Neri collects remain distinct. Repeated prayer groups in the other five offices expand from their own Matins. Defective grammatical constructions and unintelligible printed clauses are explicitly provisional or marked unresolved in English, keeping source-review status pending.

Seven more complete-word-sequence reuses became available after the first three offices, bringing that mode to 161 cumulative reuses. The next pass adds zero. Source-preservation fixtures now cover eighteen continued offices and protect their original Latin, existing English, and printed sections. All 35 tests, the structural check, and the editorial preview build pass. No browser integration run, production publication, or merge is claimed.


## Role-preserving reuse and three further offices

Word-sequence reuse now requires the same ordered versicle/response signs. Twenty-three earlier copies with differing signs or expanded incipits were replaced by direct prepared translations of the target text, retaining the source and its review status. One additional unambiguous match was reused. Thirty-nine differing-version groups were individually compared and recorded in `reviewed-reuse-selections.json`; 118 previously empty rows now reuse those explicit choices. Automatic conflicting-version selection remains disabled. The current word-sequence reuse total is 257 (including 118 explicitly selected rows); whitespace-only exact reuse remains 625. Tests cover conflicting versions, nonmatching selected origins, role differences, lexical differences, and preserved review status.

Paul (583–585), Stanislaus Kostka (602–604), and Liborius (548–551) now have English rows throughout after all ten PDF pages were inspected. Paul and Stanislaus retain defective printed phrases and visibly unresolved or provisional translations; both remain pending source reading. Liborius has full visual review, with minor printed forms documented. Seven Paul versicle/response extraction artefacts are corrected to the visually verified glyphs, with original extracted text preserved. Fourteen further printed references expand from their own office’s Matins. No absent Lauds or additional hours are introduced. Preservation fixtures cover 21 continued offices.

All 36 tests, structural validation, and the editorial preview build pass. Current coverage: 82 offices, 686 sections, 11,282 rows, 3,270 missing English rows, 4,461 prepared translations including notes, no unpaired supplied English, ten fully visually reviewed offices, and 109 unresolved reference candidates. Browser integration and publication remain outstanding; the release gate is unchanged.


## Four further Marian and saint offices

Seven Dolours (395–397), Dismas (476–479), Seven Joys (398–401), and Holy Innocents (523–526) now have English rows throughout after visual comparison with all 15 PDF pages. The first and third retain seven printed hours and no Lauds; Dismas and Holy Innocents retain eight. All include their concluding prayers and printed supplementary material. Seven Joys retains seven distinct collects. Printed repetitions expand only within their own office. Its final closing incipits have no complete target in that office and remain pending rather than being imported or invented. Defective printed clauses are explicitly unresolved or provisional. All four offices remain pending source reading.

These four offices add 191 prepared rows and resolve 15 recorded reference candidates. Original source text, prior English, and printed section preservation fixtures now cover 25 continued offices. All 36 tests, structural validation, and the editorial preview build pass. Coverage is now 3,079 missing English rows, 4,652 prepared translations including notes, ten fully visually reviewed offices, and 94 unresolved reference candidates. Publication remains gated; no browser run or merge is claimed.


## Ludger, Anastasia, and Niccolò Albergati

Ludger (555–560), Anastasia (432–435), and Niccolò Albergati (569–572) now have English rows throughout after all 14 PDF pages were inspected. The eight Ludger hours and seven hours in the other two remain; no absent Lauds is added. Full and abbreviated closing prayers in Anastasia expand within the office, using the Prime opening response without adding Matins’ Alleluia. The later Benedicamus response signs differ from the full Matins versicle and are retained with an explicit pending discrepancy note. Printed historical names, destinations, and unusual words such as Ludger’s perfectionem and Niccolò’s Insulam and Exultat improbitas are not silently replaced. Defective hymn clauses remain provisional or unresolved. All three offices remain pending source reading.

Seven additional whitespace-only exact and six word-sequence reuses became available, bringing their cumulative totals to 632 and 263 respectively. Preservation fixtures cover 28 continued offices. All 36 tests, structural validation, and the editorial preview build pass. Coverage: 2,909 empty English rows across 24 offices (64,490 source words), 4,822 prepared translations including notes, no unpaired supplied English, ten fully visually reviewed offices, and 85 unresolved reference candidates. The remaining large rite offices require extensive translation, source review, and variant assembly. This checkpoint is not a finished publication.


## Saint Augustine continuation

Saint Augustine, for True and Sincere Conversion to God (446–449), now has English for all 46 previously empty rows after visual comparison with all four PDF pages. The invocation, seven printed hours, and commendation remain; no Lauds or missing Sext collect is introduced. Existing English and every original Latin passage are conserved in the source-preservation fixtures, now covering 29 continued offices. Hymn and invocation line divisions are represented in the prepared English. Printed abbreviated conclusions remain abbreviated.

The source contains defective or ambiguous readings, including Saclicque, Supemis, mista, istuarum, Lucent, and Amoros. These retain their printed Latin and explicit provisional or unresolved English notes. The office remains source-reading-pending. This adds 46 prepared translations, bringing coverage to 2,863 missing English rows across 23 offices, 4,868 prepared translations including notes, no unpaired supplied English, ten fully visually reviewed offices, and 85 unresolved reference candidates.

Structural validation, all 36 Node tests (including source and prior-English preservation), and the editorial preview build pass. Publication remains gated. No browser run, production deployment, or merge is claimed.


## Francis of Paola, Ignatius, and Michael

Francis of Paola (501–504), Ignatius (516–519), and Michael the Archangel (416–419) now have English for all 142 previously empty rows after visual comparison with all twelve PDF pages. The printed hours, distinct prayers, and supplementary commendations remain: eight hours in Paola and Michael, seven in Ignatius. No absent Lauds or Vespers response is added. Original Latin and prior English preservation fixtures now cover 32 continued offices. Their defective source clauses retain visible provisional or unresolved English; all three offices remain source-reading-pending.

Paola’s seven “Verse and prayer as above” references now display the versicle, response, and collect from his own Matins. Six Ignatius collect incipits likewise display his own Matins collect, preserving its defective wording and abbreviated conclusion. Twelve previously recorded reference candidates are resolved; the Compline incipit also expands, although it was not detected by the reference inventory. Michael retains eight distinct collects and adds a manual Septuagesima-to-Easter form substituting the exact printed “Laus tibi” text for Alleluia in each hour’s opening. No calendar automation is introduced. Lauds retains its printed omission of Amen.

One further whitespace-only exact reviewed reuse became available in the Suffering Christ office, bringing that mode to 633 cumulative reuses; complete-word-sequence reuse remains 263. Repeating both passes adds zero. Coverage: 2,720 empty English rows across 20 offices, 5,011 prepared translations including notes, no unpaired supplied English, ten fully visually reviewed offices, and 73 unresolved reference candidates. Unresolved source readings are not counted as empty English rows and still prevent publication.

All 37 Node tests, structural validation, and the editorial preview build pass. The added regression verifies both offices’ exact same-office prayer targets, preservation of abbreviated and uncertain conclusions, all eight Michael seasonal forms, and the Lauds Amen omission. No browser integration run, production deployment, or merge is claimed. The publication gate remains intact.


## Checkpoint below 2,000 missing English rows

Ten further offices now have English throughout: George (508–512), John Nepomucene (536–540), Marcellinus and Peter (561–565), Peter the Apostle (578–582), John the Baptist (531–535), the Five Wounds (81–85), All Saints (424–428), Thomas Aquinas (594–601), Suffering Christ / Finding and Exaltation of the Cross (86–89), and the Holy Ghost according to the Order of the Most Holy Saviour (92–99). All 55 printed pages were visually compared. This adds 725 prepared English rows and reaches the requested target: **1,995 missing English rows**, down from 2,720. There are 5,736 prepared translations including notes, no unpaired supplied English, ten fully visually reviewed offices, and 38 unresolved reference candidates. The ten continued offices retain source-reading-pending status; filled English includes visibly provisional or unresolved source readings and is not a claim of publication readiness.

Original Latin, every pre-existing English passage, row identifiers and order, source pages, and actual printed sections are conserved. The preservation fixtures now cover 42 continued offices; a separate comparison against the prior Git commit confirms byte-for-byte Latin and prior-English preservation for this batch and matching authoritative overrides. No absent Lauds or other missing hour is introduced. The Five Wounds keeps its distinct collects at each printed hour. Thomas keeps only the printed portions of its psalms and Te Deum, plus the conditional Matins ending. The Holy Ghost office retains Prime’s Credimus versus Credamus elsewhere and Sext’s omission of Amen from its hymn doxology. Page-boundary conclusion fragments remain aligned to their source rows.

Thirty-five recorded references now expand within their own office, with additional undetected incipits likewise linked only to printed same-office targets. All Saints repeats its printed Matins conclusion; Thomas repeats its hymn doxology and Vespers chapter from Lauds; Holy Ghost Compline expands the seven-stanza Vespers hymn. The Suffering Christ office retains its February, May and September alternatives in sequence, with their distinct prayer references, without automatic seasonal selection. Peter’s short opening incipits and John the Baptist’s abbreviated closing formulas remain short where no complete same-office counterpart is printed. No new cross-office translation-memory pass was applied.

Structural validation, all 37 Node tests, and the editorial preview build pass. The source-preservation comparison verifies exactly 725 added English rows across these ten offices and no changed Latin or existing English. No new browser integration run, production deployment, or merge is claimed. Further source-reading review, variant assembly and the remaining translations are still required; publication remains gated.
