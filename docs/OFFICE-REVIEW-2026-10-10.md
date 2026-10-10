# Office source review — 10 October 2026

Authoritative witness: `content/source/book.pdf`, SHA-256 `f66a42ac2a0497c5fe5f67ba00c36a704768e82dd7961ca09c86fe2e7239c149`. All page numbers below are PDF/printed numbers. Rendered pages were inspected at 1.4–1.5 times PDF resolution and compared with every source/English block of these four offices. This record does not certify any other office.

## Independently documented source blockers

| Office | Pages personally inspected | Pending block | Literal attached reading and disposition |
| --- | --- | --- | --- |
| God the Father | 23–25, all 47 blocks | `oblatio-b0003` | p.25 prints `creatus`, `et dic me fiat`, `extra cujus terminus, nec ipse possem`, `ad mihi crucem ferre`, and `divinam voluntatis`. The previous English silently repaired the syntax. Unresolved clauses are now bracketed, original English/provenance archived. The separate mistranslation of the soul as a separate “my spirit” is corrected. No replacement Latin invented. |
| Ante Lectulo | 651–652, all 57 blocks | `opening-prayers-b0020` | p.651 prints `Preceliamus simbolum`. “Let us first recite the Creed” was an unsupported repair and is now bracketed. |
| Ante Lectulo | 651–652 | `opening-prayers-b0022` | p.651 prints `atque tuosque dissice`; duplicated conjunction and unsupplied noun remain visible. The former supplied “followers” is replaced with literal “thine own” and an uncertainty marker. |
| Ante Lectulo | 651–652 | `opening-prayers-b0051` | p.652 prints `kariatis`, `corde nostra`, `muniarum`, `quieberint`, `Vigilate tua custodia`. Unresolved construction/words are identified in English instead of silently normalised. |
| Against Evil Spirits | 609–610, all 13 blocks | `opening-prayers-b0006` | p.609 prints `vade inter super inimicos meos formido et pavor`. The unsupported fluent repair is now bracketed. |
| John of God | 541–544, all 92 blocks | `matins-b0010` | p.541 prints `Apparente sed mutavit / Divae Deiparae`. Incompatible case endings make the earlier unqualified ablative-absolute translation conjectural. That clause is bracketed; remaining lines translated. |

These six passages remain `source-reading-pending`, as do their four offices. They require evidence for a reading or an explicitly justified literal construction; none is certified through an invented emendation. The source’s historical introductory attributions remain source claims. No external edition was consulted in this pass.

## Verified passages and corrections

- Ante Lectulo `opening-prayers-b0027`: complete Creed verified across the p.651/652 continuation, including `unicum Deum`, absence of communion of saints and `Carnis huius resurrectionem`; no standard Creed inserted.
- Against Evil Spirits `opening-prayers-b0007`: complete paragraph verified on p.609; `pertraxi fugam a me` translated literally with a visible note, without replacing it with another psalm reading.
- John of God `none-b0004`: `Sitam` retained and translated literally as “laid low”, without substituting `Suam`; stanza continues on p.543.
- John of God `commendatio-b0007`: full p.544 collect verified; nominative `coruscata` has an understood copula, now explicitly marked `[is]` in English. No source replacement needed.

Rubrics, introductory notes, paragraph continuations, repeated prayers, seven printed hours (no invented Lauds), separate concluding material and source pages were compared in all four offices. Curated overrides and reader documents agree. All previous prepared English and translation provenance are preserved in changed rows. Earlier office notes about provisional English are historical and superseded by the dated inline notes above.

## Coverage and validation

The previously committed `docs/coverage.json` contained a tool-output warning prefix and truncated pending entries. It was not valid JSON. Regenerated directly with `npm run coverage`: 37 of 82 offices reviewed, 45 outstanding; 4,485 passages await review; no missing English or unpaired English; eleven reference issues remain independently tracked. Four passages were verified in this pass; no office was falsely promoted.

`npm run check`, all 44 tests and `npm run build:preview` pass. `npm run coverage` intentionally fails with 4,541 pending checks (4,485 passages + 45 offices + 11 references). This is an incomplete review checkpoint, not release acceptance. Nothing merged or deployed.

## Subsequent Lawrence review

Personally inspected all of PDF pp.552–554 and compared all 79 passages, source introduction, seven printed hours, every six-hour `Vers. et Oratio ut supra` expansion against Matins, and the separate Conclusion. Source paragraphs continued across pp.552/553 and pp.553/554 were checked in order. No Lauds, external collect ending or missing hymn line was supplied.

| Pending block | Page | Actual printed reading and disposition |
| --- | --- | --- |
| `matins-b0007` | 552 | `Martyum Delitio`; the earlier “martyrs” silently supplied an unverified genitive. Uncertainty now identified in English. |
| `sext-b0005` | 553 | `Hosce Christo coacervat`, following `Tibi; sed Laurentio`; old second-person “Thou heapest” contradicted the printed third-person verb. Subject/construction bracketed rather than harmonised. |
| `vespers-b0006` | 554 | `Lecatulum Craticulum`; previously certified English silently repaired the former word into a little bed. Passage returned to pending; old prepared English/provenance preserved. |
| `compline-b0006` | 554 | `parum fragrata`; earlier English supplied a finite verb. Printed irregular form now identified without replacement Latin. |
| `conclusion-b0001` | 554 | `Magna Martyr`, `0Tua`; adjective agreement unresolved; zero retained as printed rather than normalised into a role sign or word. |
| `conclusion-b0002` | 554 | `0Digna`; printed zero retained; stanza remains part of the unresolved conclusion invocation. |
| `conclusion-b0003` | 554 | `Omnes ardeat immensius`, `0Aevi`; object/construction unresolved; zero retained. |

Lawrence remains blocked by these independently identified readings. Across this session’s five fully compared offices, thirteen passages remain source blockers. Four other passages were verified; one previously certified passage was returned to pending after finding its unsupported English repair.

Latest strict coverage: 37 offices reviewed, 45 outstanding, **4,486 pending passages**, and the eleven separate reference issues (4,542 outstanding checks in all). Check, all 44 tests and preview build pass; strict release coverage remains blocked. Earlier numeric checkpoint above remains historical. This goal is still in progress: the other forty outstanding offices have not been fully compared in this session and are not classified as source blockers by this record.
