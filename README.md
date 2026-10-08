# Parvum Officium · Sacrum Florilegium

An independent static reader for **A Big Book of Little Offices** (Little Office Guild, 2025). The exact attached PDF is committed at `content/source/book.pdf`. This project does not use Divinum Officium's content, prayer engine, API, calendar, or server.

**Status: unfinished editorial preview.** This branch preserves work for another session. It is not the complete bilingual edition requested. Read [the handoff](docs/HANDOFF.md) before continuing.

The working reader provides office search and source categories, office-specific section selection, stable shareable URLs, restoration, manual variants, text-size controls, parallel/stacked/language-only modes, introductory notes, translation provenance, and source PDF links. English-only source material stays single-column. The source inventory contains 82 visible office entries, including the unindexed office on p. 86, and separate Marian rites. Extracted blocks and pairings remain candidates until reviewed.

## Local development

Node 22 or later and Python 3 suffice to build/read committed content. No runtime npm dependency, database, or translation service is required.

```sh
npm run check
npm test
npm run build:preview
npm run serve
```

Open `http://localhost:4173`. The preview build creates lazy-loaded `public/content/`, the source PDF link, and the coverage page. Generated assets are ignored by Git and rebuilt from committed source content.

```sh
npm run coverage
npm run build
```

These commands intentionally fail while required English, correspondence, source review, or reference resolution remains unfinished. Do not weaken the gate to label this branch complete.

Optional extraction/browser tools:

```sh
python3 -m pip install -r scripts/requirements.txt
python3 scripts/inventory.py
python3 scripts/import_pdf.py
npm run build:preview
python3 test/browser_ui.py http://localhost:4173 /usr/bin/chromium
```

Browser checks require a running local server and Chromium. Screenshots from the current work are committed under `docs/screenshots/`.

## Content

See [content maintenance](docs/CONTENT.md), [source review](docs/SOURCE-REVIEW.md), and [coverage](docs/coverage.json).

- `content/inventory.json`: inventory, source pages, headings, notes, variant mentions, references, workflow status.
- `content/source/office-boundaries.json`: independent boundary manifest for completeness checks.
- `content/source/layout.json`: original PDF strings and text geometry.
- `content/offices/`: structured candidate/reviewed documents.
- `content/overrides/`: curated documents that take precedence during import; edit these to preserve corrections/translations.
- `content/references.json`: unresolved reference candidates.
- `public/`: reader and styling; selected-office loading, with at most three offices cached in memory.

## Hosting

The accessible Officium repository establishes **Cloudflare Pages** with static `public/` output. Use Framework: None, production branch: `main`, build: `npm run build`, output: `public`, Node: 22 or later. A deliberately labeled branch preview may use `npm run build:preview`; production remains blocked until the edition is complete.

A Pages project/account binding and desired domain still need configuration. No deployment, DNS, domain, Pages project, or other Sacrum Florilegium repository has been changed. The design follows the inspected Officium/Domus typography, colors, and existing Sites menu; the favicon is the existing Domus purple cross.
