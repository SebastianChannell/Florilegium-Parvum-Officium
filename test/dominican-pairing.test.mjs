import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {readContent} from '../scripts/validate-content.mjs';
import {sectionBlocks, resolveVariants} from '../public/reader-model.js';
const prime=JSON.parse(fs.readFileSync(new URL('./fixtures/dominican-prime-source-digests.json',import.meta.url)));
const minor=JSON.parse(fs.readFileSync(new URL('./fixtures/dominican-minor-source-digests.json',import.meta.url)));
const office=readContent().documents.get(prime.office);
const digest=t=>createHash('sha256').update(t.replace(/\s+/g,' ').trim()).digest('hex');
test('Dominican minor hours preserve both original printed streams and supply every English row',()=>{
 for(const f of [{...prime,id:'prime'},...minor.sections.map(s=>({...s,id:s.section}))]){
  const blocks=office.sections.find(s=>s.id===f.id).blocks;
  assert.equal(digest(blocks.map(b=>b.source).join(' ')),f.sourceDigest);
  assert.equal(digest(blocks.filter(b=>b.pairingReview.suppliedEnglishIndices.length).map(b=>b.printedParallelText?.text||b.english).join(' ')),f.printedRightDigest);
  assert(blocks.every(b=>b.english?.trim()&&b.verification==='visual-review'));
  assert(!office.unpairedEnglish.some(s=>s.section===f.id));
 }
 assert.equal(office.translationScope,'marked');
 assert.notEqual(office.status.verification,'visual-review');
});
test('Dominican missing translations are marked and printed Latin in the right column is preserved',()=>{
 const blocks=office.sections.find(s=>s.id==='prime').blocks;
 for(const id of ['prime-b0003','prime-b0004']){
  const b=blocks.find(b=>b.id===id);
  assert.equal(b.printedParallelText.language,'Latin');
  assert.equal(b.translation.kind,'prepared');
  assert(b.editorialNote);
 }
 for(const sid of ['terce','sext','none']){
  const rows=sectionBlocks(office,sid,resolveVariants(office));
  assert(rows.some(b=>b.expandedFrom==='prime-b0006'));
  assert(rows.some(b=>b.expandedFrom==='prime-b0008'));
 }
 const collect=office.sections.find(s=>s.id==='terce').blocks.find(b=>b.id==='terce-b0021');
 assert.equal(collect.translation.kind,'prepared');
 assert(collect.english.endsWith('Through our Lord.'));
});
