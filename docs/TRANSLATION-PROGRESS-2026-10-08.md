# Translation continuation: supplied English fully paired

All supplied bilingual streams have been paired, including all eight Dominican hours. No unpaired supplied English remains. Both printed columns are conserved in independent fixtures; English-only supplements have an explicit source-absence display.

Four further Latin-only offices now have English throughout:

- Holy Cross, pp.64–67: fully visually reviewed; full references displayed from the same office; no Lauds invented; hymn stanzas and seasonal instructions translated.
- Most Holy Name of Jesus, pp.38–42: every stanza translated; fragments joined; only the six printed hours retained. Printed “vaniae” has provisional “pardon” with a source note; office remains pending for that reading.
- Most Amiable Child Jesus, pp.52–53: hymns, versicles, and collect translated; recurring prayer references expanded. Three irregular source readings remain explicitly provisional.
- Child Jesus in the Manger, pp.49–51: hymns, antiphons, and collects translated; repeated opening references expanded. Abbreviated conclusions and three malformed source readings are retained and explained.

606 further empty English fields now reuse a complete, identical Latin passage from an already reviewed source elsewhere in the PDF: 600 supplied and six prepared. Only whitespace is normalized. Conflicting candidates, existing English, and source-review status remain untouched. Original English PDF pages and source office/block are recorded and validated. The script is idempotent: the second pass adds zero passages. Many reused rows are short common prayers or headings; 606 is a passage count, not a count of newly translated unique prayers.

Checks: structural validation, all 32 Node tests, Python syntax checks, and editorial preview build pass. Browser integration assertions were updated for the English-only supplement, but no browser run was performed because Chromium is not installed in this runtime.

Remaining: 3,920 source passages without English, 153 unresolved reference candidates, Latin source notes, transcription/variant structure review, and final publication acceptance. Nine offices have full visual-review status; several others have been inspected but remain pending because the PDF itself contains defects. The production gate remains intact. This is a preserved continuation, not a finished publication.

## Further continuation

Ten further offices now have English rows throughout: Saint Anne (436–439), Saint Barbara (450–452), Saint Sebastian (590–593), the Monastic BVM office (321–347), Aloysius Gonzaga (429–431), Ignatius and Francis Xavier (520–522), the three Japanese martyrs (545–547), John of God (541–544), Mary Magdalene (566–568), and the Dead (611–613). All relevant PDF pages were visually inspected. Malformed source clauses remain provisional; several unintelligible clauses are explicitly marked in English rather than assigned invented meanings. These ten offices remain pending for source resolution and are not certified publication-ready.

Monastic Matins now selects its three printed weekday psalm groups, Advent/non-Advent lessons, and the printed responsory additions/substitutions associated with saying the Te Deum. No Te Deum text or calendar is invented. Repeated opening, conclusion, and Marian-anthem instructions expand within the office. Eight wrap fragments are joined, preserving original extracted text and identifiers.

Source notes are now carried with reused English, including differences between Septuagesima in Latin and Lent in the supplied English. Nineteen additional identical reviewed passages are reused, for a cumulative 625. Regression fixtures preserve all ten offices’ original source text, existing supplied English, and actual sections; tests also exercise all twelve Monastic Matins combinations.
