import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readContent, validateContent } from '../scripts/validate-content.mjs';
import { sectionBlocks, resolveVariants } from '../public/reader-model.js';

const input = readContent();
const expected = JSON.parse(fs.readFileSync(new URL('./fixtures/roman-source-digests.json', import.meta.url)));
const office = input.documents.get(expected.office);
const digest = text => createHash('sha256').update(text.replaceAll('follo- wing', 'following')
  .replaceAll('fol- lowing', 'following').replace(/\s+/g, ' ').trim()).digest('hex');

test('Roman pairing preserves both printed columns across all eight hours', () => {
  assert.deepEqual(office.sections.map(s => s.id), expected.sections.map(s => s.id));
  assert.deepEqual(office.unpairedEnglish, []);
  for (const section of expected.sections) {
    const blocks = office.sections.find(s => s.id === section.id).blocks;
    assert.equal(digest(blocks.map(b => b.source).join(' ')), section.sourceDigest, section.id);
    const printed = blocks.filter(b => b.pairingReview.suppliedEnglishIndices.length)
      .map(b => b.printedParallelText?.text || b.english).join(' ');
    assert.equal(digest(printed), section.printedRightDigest, `${section.id} right column`);
    assert(blocks.every(b => b.english?.trim()));
  }
  assert.equal(office.status.verification, 'visual-review');
  for (const b of office.sections.flatMap(s => s.blocks).filter(b => b.translation?.reusedFrom)) {
    const original = office.sections.flatMap(s => s.blocks).find(t => t.id === b.translation.reusedFrom);
    assert.equal(b.source, original.source);
    assert.equal(b.english, original.english);
    assert.deepEqual(b.englishPages, original.englishPages);
    assert.equal(b.translation.kind, 'supplied');
  }
});

test('Roman weekday selector includes exactly the printed psalm group and references resolve', () => {
  const groups = [['sun-mon-thu', ['Psalm 8', 'Psalm 18', 'Psalm 23']],
    ['tue-fri', ['Psalm 44', 'Psalm 45', 'Psalm 86']], ['wed-sat', ['Psalm 95', 'Psalm 96', 'Psalm 97']]];
  for (const [value, psalms] of groups) {
    const rendered = sectionBlocks(office, 'matins', resolveVariants(office, { 'matins-psalms': value }));
    assert.deepEqual(rendered.filter(b => /^Psalm \d+$/.test(b.source) && b.source !== 'Psalm 94').map(b => b.source), psalms);
  }
  for (const section of office.sections) assert.doesNotThrow(() => sectionBlocks(office, section.id, resolveVariants(office)));
  const prime = sectionBlocks(office, 'prime', resolveVariants(office));
  assert(prime.some(b => b.expandedFrom === 'lauds-b0002'));
  const compline = sectionBlocks(office, 'compline', resolveVariants(office));
  assert(compline.some(b => b.expandedFrom === 'lauds-b0103'));
  assert(!compline.some(b => /Alma Redemptoris Mater/.test(b.source)));
});

test('unaligned printed texts require visible notes and cannot be certified reviewed', () => {
  const changed = structuredClone(input);
  const block = changed.documents.get(expected.office).sections.flatMap(s => s.blocks)
    .find(b => b.originalAlignment === 'source-discrepancy');
  assert(block.editorialNote);
  block.alignment = 'source-discrepancy';
  block.english = block.originalSuppliedEnglish;
  block.translation = block.originalTranslation;
  block.verification = 'source-reading-pending';
  block.editorialNote = '';
  assert(validateContent(changed).errors.some(e => /Source discrepancy/.test(e.message)));
  block.editorialNote = 'The printed collects differ.';
  block.verification = 'visual-review';
  assert(validateContent(changed).errors.some(e => /Source discrepancy/.test(e.message)));
});
