import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {readContent} from '../scripts/validate-content.mjs';
import {sectionBlocks,resolveVariants} from '../public/reader-model.js';
const {documents}=readContent();
const expected=JSON.parse(fs.readFileSync(new URL('./fixtures/october-continuation-source-digests.json',import.meta.url)));
const digest=t=>createHash('sha256').update(t.replace(/\s+/g,' ').trim()).digest('hex');
test('continued offices conserve source text, existing English, and printed hours',()=>{
 for(const entry of expected){
  const office=documents.get(entry.office);
  assert.deepEqual(office.sections.map(s=>s.id),entry.sections.map(s=>s.id));
  for(const section of entry.sections){
   const rows=office.sections.find(s=>s.id===section.id).blocks;
   assert.equal(digest(rows.map(b=>b.originalExtractedSource??b.source).join(' ')),section.sourceDigest);
   for(const [id,hash] of Object.entries(section.existingEnglish))assert.equal(digest(rows.find(b=>b.id===id).english),hash);
   assert(rows.every(b=>b.english?.trim()&&['prepared','supplied'].includes(b.translation?.kind)));
   for(const row of rows.filter(b=>b.verification==='source-reading-pending'))assert(row.editorialNote?.trim());
   assert.doesNotThrow(()=>sectionBlocks(office,section.id,resolveVariants(office)));
  }
  assert.equal(office.status.verification,entry.verification??'source-reading-pending');
 }
});
test('Monastic Matins selects its printed weekday psalms and lesson/responsory alternatives',()=>{
 const office=documents.get('little-office-of-the-blessed-virgin-mary-according-to-the-monastic-usage');
 for(const [weekday,psalm,other] of [['sun-mon-thu','matins-b0025','matins-b0041'],['tue-fri','matins-b0041','matins-b0063'],['wed-sat','matins-b0063','matins-b0025']]){
  for(const season of ['outside-advent','advent'])for(const te of ['with-te-deum','without-te-deum']){
   const rows=sectionBlocks(office,'matins',resolveVariants(office,{'matins-psalms':weekday,'matins-lessons':season,'matins-responsory':te}));
   assert(rows.some(b=>b.id===psalm));assert(!rows.some(b=>b.id===other));
   assert.equal(rows.some(b=>b.id==='matins-b0079'),season==='outside-advent');
   assert.equal(rows.some(b=>b.id==='matins-b0117'),season==='advent');
   assert.equal(rows.some(b=>b.id==='matins-b0104'),season==='outside-advent'&&te==='without-te-deum');
   assert.equal(rows.some(b=>b.id==='matins-b0096'),season==='outside-advent'&&te==='with-te-deum');
   assert.equal(rows.some(b=>b.id==='matins-b0133'),season==='advent'&&te==='with-te-deum');
  }
 }
 const minor=sectionBlocks(office,'terce',resolveVariants(office));
 assert(minor.some(b=>b.expandedFrom==='lauds-b0002'));
 assert(minor.some(b=>b.expandedFrom==='matins-b0162'));
 assert(minor.some(b=>b.expandedFrom==='lauds-b0099'));
 assert(!minor.some(b=>b.expandedFrom==='lauds-b0007'));
});
test('repeated saint and departed prayers expand without adding absent hours',()=>{
 const mary=documents.get('little-office-of-saint-mary-magdalene-patroness-of-penitents');
 assert(sectionBlocks(mary,'lauds').some(b=>b.expandedFrom==='matins-b0013'));
 const dead=documents.get('little-office-of-the-dead');
 assert(!dead.sections.some(s=>s.id==='lauds'));
 const rows=sectionBlocks(dead,'prime');
 assert(rows.some(b=>b.expandedFrom==='matins-b0001'));
 assert(rows.some(b=>b.expandedFrom==='matins-b0011'));
 assert(rows.some(b=>b.expandedFrom==='matins-b0014'));
});
