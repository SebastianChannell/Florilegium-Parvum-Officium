import fs from 'node:fs';
import path from 'node:path';
import { root, readContent, validateContent } from './validate-content.mjs';
const preview = process.argv.includes('--preview');
const content=readContent(); const report=validateContent(content,!preview);
if (report.errors.length || !preview && !report.complete) {
  console.error('Build blocked: the source edition is incomplete. Run npm run coverage for the report. An explicitly labeled editorial preview can be built with npm run build:preview.');
  process.exit(1);
}
const out=path.join(root,'public/content');
fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(path.join(out,'offices'),{recursive:true});
for (const [id,doc] of content.documents) fs.writeFileSync(path.join(out,'offices',`${id}.json`),JSON.stringify(doc));
const catalog={schemaVersion:1,complete:report.complete,book:content.inventory.book,offices:content.inventory.offices.map(o=>({
  id:o.id,title:o.title,category:o.category,sourceLanguage:o.originalLanguages[0],sections:o.sections,source:o.source,status:o.status,coverage:o.coverage
}))};
fs.writeFileSync(path.join(out,'catalog.json'),JSON.stringify(catalog));
fs.mkdirSync(path.join(root,'public/source'),{recursive:true});
fs.copyFileSync(path.join(root,'content/source/book.pdf'),path.join(root,'public/source/book.pdf'));
const escape=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rows=content.inventory.offices.map(o=>`<tr><td><a href="./#office=${encodeURIComponent(o.id)}&amp;section=${encodeURIComponent(o.sections[0].id)}">${escape(o.title)}</a></td><td>${o.source.pdfPages.join('–')}</td><td>${escape(o.originalLanguages.join(' / '))}</td><td>${o.coverage.missingEnglish} missing English; ${o.coverage.unpairedEnglishBlocks} awaiting pairing; ${escape(o.status.verification)}</td></tr>`).join('\n');
fs.writeFileSync(path.join(root,'public/coverage.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Edition coverage · Parvum Officium</title><link rel="stylesheet" href="./styles.css"><body><main class="app-shell"><p><a href="./">← Parvum Officium</a></p><h1>Edition coverage</h1><p class="edition-notice">${report.complete?'Complete edition.':'Editorial preview. This is an incomplete bilingual edition and is not ready for publication.'}</p><p class="coverage-summary">${report.totals.offices} offices inventoried; ${report.totals.reviewedOffices} visually reviewed; ${report.totals.missingEnglish} source blocks lack aligned English; ${report.totals.unpairedEnglish} supplied English blocks await pairing; ${report.totals.unresolvedReferences} reference candidates await resolution.</p><p>62 offices have Latin prayer text, 12 supply Latin and English, and 8 are English-only. The inventory includes the unindexed office beginning on page 86. Newly prepared English is individually attributed in the reader. The source book's historical claims are retained as source statements.</p><p><a href="./source/book.pdf">Authoritative source PDF</a></p><table class="coverage-table"><thead><tr><th scope="col">Office</th><th scope="col">Pages</th><th scope="col">Source languages</th><th scope="col">Status</th></tr></thead><tbody>${rows}</tbody></table></main></body></html>`);
console.log(`Built ${preview?'editorial preview':'complete edition'}: ${content.documents.size} office files, lazy-loaded by the reader.`);
