import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readContent, notice } from '../scripts/validate-content.mjs';
import { sectionBlocks, resolveVariants } from '../public/reader-model.js';

const { documents } = readContent();
const baseline = JSON.parse(fs.readFileSync(new URL('./fixtures/bilingual-source-digests.json', import.meta.url)));
const digest = text => createHash('sha256').update(text
  .replaceAll('Alle- luia', 'Alleluia').replaceAll('Allelu- ia', 'Alleluia')
  .replaceAll('Tempo- re', 'Tempore').replace(/\s+/g, ' ').trim()).digest('hex');

test('reviewed bilingual pairings preserve every source and supplied-English passage', () => {
  for (const expected of baseline.offices) {
    const office = documents.get(expected.office);
    assert.deepEqual(office.sections.map(s => s.id), expected.sections.map(s => s.id));
    assert.deepEqual(office.unpairedEnglish, []);
    for (const section of expected.sections) {
      const { blocks } = office.sections.find(s => s.id === section.id);
      const label = `${office.id}/${section.id}`;
      assert.equal(digest(blocks.map(b => b.source).join(' ')), section.sourceDigest, `${label} source`);
      assert.equal(digest(blocks.filter(b => b.translation?.kind === 'supplied').map(b => b.english).join(' ')),
        section.suppliedEnglishDigest, `${label} supplied English`);
      assert(blocks.every(b => b.english?.trim()), `${label} has English for every passage`);
    }
    assert(office.editorialNotes.every(n => n.text?.trim()), 'editorial notes must be visible to the reader');
  }
});

test('Oblates missing hymn stanza is marked prepared and printed Sext remains shortened', () => {
  const office = documents.get('little-office-for-benedictine-oblates');
  const prepared = office.sections.flatMap(s => s.blocks).filter(b => b.translation?.kind === 'prepared');
  assert.equal(prepared.length, 1);
  assert.match(prepared[0].source, /^Sint puris cordis intima/);
  assert.match(prepared[0].english, /moderation in food and drink/);
  assert.equal(office.translationScope, 'marked');
  assert.equal(office.translationNotice, notice);
  const sext = sectionBlocks(office, 'sext').map(b => b.source).join(' ');
  assert.match(sext, /Rector potens/);
  assert(!sext.includes('Exstingue flammas')); // Not printed in this office.
});

test('Benedict opening references expand before the Lauds antiphon and hymn substitution works', () => {
  const office = documents.get('little-office-of-s-benedict');
  const ordinary = resolveVariants(office);
  for (const hour of ['matins', 'lauds', 'prime', 'terce', 'sext', 'none', 'compline']) {
    const blocks = sectionBlocks(office, hour, ordinary);
    assert.equal(blocks.filter(b => b.expandedFrom === 'vespers-b0002').length, 1);
    assert.equal(blocks.filter(b => b.expandedFrom === 'vespers-b0005').length, 1);
  }
  const lauds = sectionBlocks(office, 'lauds', ordinary);
  assert(lauds.findIndex(b => b.expandedFrom === 'vespers-b0005') < lauds.findIndex(b => b.id === 'lauds-b0002-antiphon'));
  const usual = sectionBlocks(office, 'matins', ordinary);
  const feast = sectionBlocks(office, 'matins', { 'matins-hymn': 'march-21' });
  assert(usual.some(b => b.id === 'matins-b0004'));
  assert(!usual.some(b => b.id === 'matins-b0006'));
  assert(feast.some(b => b.id === 'matins-b0006'));
  assert(!feast.some(b => b.id === 'matins-b0004'));
});
