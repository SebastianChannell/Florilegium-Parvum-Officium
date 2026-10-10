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
