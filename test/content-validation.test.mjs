import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContent, readContent, notice } from '../scripts/validate-content.mjs';
const input=readContent();
const fixture=()=>{ const x=structuredClone(input); return x; };
test('all 82 visible offices are inventoried, including the unindexed p.86 office',()=>{
  const report=validateContent(input);
  assert.equal(report.totals.offices,82);
  assert.deepEqual(report.errors,[]);
  assert(input.boundaries.some(o=>o.pdfPages[0]===86));
});
test('complete English coverage still requires source review and resolved references for publication',()=>{
  const report=validateContent(input,true);
  assert.equal(report.complete,false);
  assert.equal(report.totals.missingEnglish,0);
  assert(report.pending.some(e=>/visual review/.test(e.message)));
  assert(report.pending.some(e=>/reference/.test(e.message)));
});
test('a missing translation still prevents publication',()=>{
  const x=fixture();
  const doc=x.documents.get('little-office-of-the-blessed-virgin-mary-according-to-the-ambrosian-rite');
  doc.sections[0].blocks[0].english=null;
  const report=validateContent(x,true);
  assert.equal(report.totals.missingEnglish,1);
  assert.equal(report.complete,false);
});
test('missing offices and duplicate identifiers are rejected',()=>{
  let x=fixture(); x.documents.delete(x.inventory.offices[0].id);
  assert(validateContent(x).errors.some(e=>e.message==='Missing office content.'));
  x=fixture(); x.inventory.offices.pop();
  assert(validateContent(x).errors.some(e=>/Missing office compared/.test(e.message)));
  x=fixture();x.inventory.offices.push(x.inventory.offices[0]);
  assert(validateContent(x).errors.some(e=>/Duplicate office/.test(e.message)));
});
test('prepared English requires the exact visible notice and passage provenance',()=>{
  const x=fixture(); const doc=x.documents.get('little-office-of-the-most-holy-trinity');
  assert.equal(doc.translationNotice,notice); doc.translationNotice=null;
  assert(validateContent(x).errors.some(e=>/required translation notice/.test(e.message)));
  doc.sections[0].blocks[0].translation=null;
  assert(validateContent(x).errors.some(e=>/English lacks provenance/.test(e.message)));
});
test('English-only source offices do not invent or duplicate Latin',()=>{
  for (const doc of input.documents.values()) if(doc.sourceLanguage==='English') {
    assert(doc.sections.every(s=>s.blocks.every(b=>b.source && b.english===null)));
  }
});
test('empty sections, broken links and invalid page provenance are rejected',()=>{
  const x=fixture();const doc=x.documents.values().next().value;
  doc.sections[0].assembly={before:['missing']};doc.sections[1].blocks=[];
  doc.sections[0].blocks[0].sourcePages=[9999];
  const messages=validateContent(x).errors.map(e=>e.message);
  assert(messages.some(m=>/Unresolved assembly/.test(m)));
  assert(messages.some(m=>/Empty section/.test(m)));
  assert(messages.some(m=>/Page outside office/.test(m)));
});
