import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {readContent,validateContent} from '../scripts/validate-content.mjs';
import {sectionBlocks,resolveVariants} from '../public/reader-model.js';
const input=readContent();
const expected=JSON.parse(fs.readFileSync(new URL('./fixtures/october-prepared-source-digests.json',import.meta.url)));
const digest=t=>createHash('sha256').update(t.replace(/\s+/g,' ').trim()).digest('hex');
test('four prepared offices preserve the original Latin, printed sections, and translation provenance',()=>{
 for(const entry of expected){
  const office=input.documents.get(entry.office);
  assert.deepEqual(office.sections.map(s=>s.id),entry.sections.map(s=>s.id));
  for(const section of entry.sections){
   const rows=office.sections.find(s=>s.id===section.id).blocks;
   assert.equal(digest(rows.map(b=>b.source).join(' ')),section.digest);
   assert(rows.every(b=>b.english?.trim()&&b.translation?.kind==='prepared'));
   assert.doesNotThrow(()=>sectionBlocks(office,section.id,resolveVariants(office)));
  }
 }
 const cross=input.documents.get('little-office-of-the-holy-cross');
 assert(!cross.sections.some(s=>s.id==='lauds'));
 const rendered=sectionBlocks(cross,'compline',resolveVariants(cross));
 assert(rendered.some(b=>b.expandedFrom==='prime-b0002'));
 assert(rendered.some(b=>b.expandedFrom==='matins-b0013'));
 const child=input.documents.get('little-office-of-the-most-amiable-child-jesus');
 assert(sectionBlocks(child,'vespers',resolveVariants(child)).some(b=>b.expandedFrom==='matins-b0010'));
});
test('all cross-office English reuse points to identical reviewed Latin and original English',()=>{
 let count=0;
 for(const office of input.documents.values())for(const b of office.sections.flatMap(s=>s.blocks)){
  if(b.translation?.method!=='exact-reviewed-pdf-reuse')continue;
  count++;
  const original=input.documents.get(b.translation.reusedFromOffice).sections.flatMap(s=>s.blocks).find(t=>t.id===b.translation.reusedFrom);
  assert.equal(b.source.replace(/\s+/g,' ').trim(),original.source.replace(/\s+/g,' ').trim());
  assert.equal(b.english,original.english);
  assert.equal(original.verification,'visual-review');
 }
 assert(count>=606);
 const changed=structuredClone(input);
 const b=[...changed.documents.values()].flatMap(o=>o.sections.flatMap(s=>s.blocks)).find(b=>b.translation?.method==='exact-reviewed-pdf-reuse');
 b.english='An unrelated prayer';
 assert(validateContent(changed).errors.some(e=>e.message.includes('identical reviewed source')));
});
