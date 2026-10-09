import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSelection, resolveVariants, sectionBlocks, readRoute, writeRoute } from '../public/reader-model.js';
import { readContent } from '../scripts/validate-content.mjs';
const { inventory, documents } = readContent();
test('every office/section URL resolves to that actual office and section', () => {
  for (const o of inventory.offices) for (const s of o.sections) {
    const selected={office:o.id,section:s.id};
    assert.deepEqual(resolveSelection(inventory.offices,readRoute(writeRoute(selected))),selected);
  }
});
test('switching to a different office always chooses one of its actual sections', () => {
  for (const o of inventory.offices) {
    const selected=resolveSelection(inventory.offices,{office:o.id,section:'an-hour-absent-from-every-office'});
    assert.equal(selected.section,o.sections[0].id);
  }
  assert.equal(resolveSelection(inventory.offices,{office:'invalid'}).office,inventory.offices[0].id);
});
test('Sarum contains Matins and Lauds, and the Holy Name of Jesus contains no invented Sext', () => {
  const sarum=inventory.offices.find(o=>o.source.pdfPages[0]===348);
  assert(sarum.sections.some(s=>s.title==='Matins'));
  assert(sarum.sections.some(s=>s.title==='Lauds'));
  assert(!sarum.sections.some(s=>['Prime','Terce','Sext','None','Vespers','Compline'].includes(s.title)));
  const holyName=inventory.offices.find(o=>o.source.pdfPages[0]===38);
  assert(!holyName.sections.some(s=>s.title==='Sext'));
});
test('combined Matins and Lauds and non-hour material retain their identity', () => {
  const heart=inventory.offices.find(o=>o.source.pdfPages[0]===390);
  assert(heart.sections.some(s=>s.title==='Matins and Lauds'));
  const bedtime=inventory.offices.find(o=>o.source.pdfPages[0]===651);
  assert.equal(bedtime.sections.length,1);
  assert(!/Compline/.test(bedtime.sections[0].title));
});
test('manual seasonal selection replaces Alleluia without using a calendar', () => {
  const office=documents.get('little-office-of-the-most-holy-trinity');
  assert.deepEqual(resolveVariants(office,{season:'invalid'}),{season:'ordinary'});
  const ordinary=sectionBlocks(office,'matins',{season:'ordinary'});
  const seasonal=sectionBlocks(office,'matins',{season:'septuagesima'});
  assert(ordinary.some(b=>b.id==='ordinary-b0012' && b.source.endsWith('Alleluia.')));
  assert(!ordinary.some(b=>b.id==='ordinary-b0014'));
  assert(seasonal.some(b=>b.id==='ordinary-b0012' && !b.source.endsWith('Alleluia.')));
  assert(seasonal.some(b=>b.id==='ordinary-b0014'));
  assert(seasonal.some(b=>b.id==='conclusion-of-the-hours-b0004'));
});
test('section assembly refuses unresolved prayer links', () => {
  assert.throws(()=>sectionBlocks({sections:[{id:'matins',blocks:[],assembly:{before:['missing']}}]},'matins'),/Unresolved/);
  assert.throws(()=>sectionBlocks({sections:[]},'missing'),/absent/);
});
test('Bonaventure Vespers includes the continuation under the printed Compline heading', () => {
  const office=documents.get('little-office-of-the-passion-of-our-lord-by-s-bonaventure');
  const vespers=sectionBlocks(office,'vespers');
  assert.equal(vespers.length,26);
  assert(vespers.some(b=>/Magnificat/.test(b.source)));
  assert(vespers.some(b=>/hour of Vespers/i.test(b.source)));
  assert.deepEqual(sectionBlocks(office,'compline').map(b=>b.id),vespers.map(b=>b.id));
  const compline=sectionBlocks(office,'compline-2');
  assert(compline.some(b=>/Canticle of Simeon/i.test(b.source)));
  assert(compline.some(b=>/^Now Thou dost dismiss Thy servant/.test(b.source)));
  assert(!compline.some(b=>/Magnificat/.test(b.source)));
  assert.equal(office.sections.find(s=>s.id==='compline').sourceHeading,'Compline');
});
test('Carthusian solitary blessing instruction does not repeat the already displayed blessing', () => {
  const office=documents.get('little-office-of-the-blessed-virgin-mary-according-to-the-carthusian-usage');
  const blocks=sectionBlocks(office,'matins');
  assert.equal(blocks.filter(b=>b.id==='matins-b0059' || b.expandedFrom==='matins-b0059').length,1);
  assert(blocks.find(b=>b.id==='matins-b0060').referenceExpansion.note);
});
test('Cistercian collect and Premonstratensian nested suffrage expand complete same-office text', () => {
  const cistercian=documents.get('little-office-of-the-blessed-virgin-mary-according-to-the-cistercian-usage');
  const vespers=sectionBlocks(cistercian,'vespers');
  assert(vespers.some(b=>b.id==='vespers-b0020--lauds-b0044'));
  assert(vespers.some(b=>b.id==='vespers-b0020--lauds-b0045'));
  const norbertine=documents.get('little-office-of-the-blessed-virgin-mary-according-to-the-premonstratensian-use-norbetines');
  const lauds=sectionBlocks(norbertine,'lauds');
  assert(lauds.some(b=>b.id==='lauds-b0052--vespers-b0073--vespers-b0111'));
});
