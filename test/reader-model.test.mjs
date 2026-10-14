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
test('Carthusian separates the printed dry Mass appendix and applies its manual choices', () => {
  const office=documents.get('little-office-of-the-blessed-virgin-mary-according-to-the-carthusian-usage');
  const compline=sectionBlocks(office,'compline');
  assert(!compline.some(b=>Number(b.id.split('-b')[1])>=83));
  const ordinary=sectionBlocks(office,'missae-siccae',{ 'dry-mass':'outside-advent' });
  const advent=sectionBlocks(office,'missae-siccae',{ 'dry-mass':'advent' });
  assert.equal(ordinary.length,92);
  assert.equal(advent.length,73);
  assert.equal(ordinary[0].id,'compline-b0083');
  assert.equal(advent[0].id,'compline-b0083');
  assert(ordinary.some(b=>b.id==='compline-b0084'));
  assert(!advent.some(b=>b.id==='compline-b0084'));
  assert(advent.some(b=>b.id==='compline-b0246'));
  for (const [choice,first,last] of [['sun-mon-thu',19,29],['tue-fri',30,40],['wed-sat',41,51]]) {
    const selected=sectionBlocks(office,'matins',{'matins-psalms':choice});
    assert.deepEqual(selected.filter(b=>/^matins-b00(19|[234][0-9]|5[01])$/.test(b.id)).map(b=>b.id),Array.from({length:last-first+1},(_,i)=>`matins-b${String(first+i).padStart(4,'0')}`));
  }
  const alone=sectionBlocks(office,'matins',{recitation:'alone'});
  assert(!alone.some(b=>b.id==='matins-b0057'));
  assert.equal(alone.filter(b=>b.id==='matins-b0059').length,1);
  const praise=sectionBlocks(office,'compline',{season:'septuagesima'});
  assert(!compline.some(b=>b.id==='compline-b0007'));
  assert(praise.some(b=>b.id==='compline-b0007'));
  assert(!praise.find(b=>b.id==='compline-b0006').source.includes('Alleluja'));
  assert.match(praise.find(b=>b.id==='compline-b0006').english,/Praise be to Thee/);
});
test('Ambrosian preserves both Sext headings and selects the actual printed alternatives', () => {
  const office=documents.get('little-office-of-the-blessed-virgin-mary-according-to-the-ambrosian-rite');
  assert.equal(office.sections.find(s=>s.id==='sext-2').sourceHeading,'Ad Sextam');
  assert.match(office.sections.find(s=>s.id==='sext-2').title,/second printed heading/);
  assert(!office.sections.some(s=>s.id==='none'));
  for (const [choice,first,last] of [['sun',29,49],['mon-thu',50,69],['tue-wed',70,90],['wed-sat',91,112]]) {
    const selected=sectionBlocks(office,'matins',{'matins-days':choice});
    assert(selected.some(b=>b.id===`matins-b${String(first).padStart(4,'0')}`));
    assert(selected.some(b=>b.id===`matins-b${String(last).padStart(4,'0')}`));
    assert.equal(selected.filter(b=>/^matins-b/.test(b.id)&&Number(b.id.split('-b')[1])>=29&&Number(b.id.split('-b')[1])<=112).length,last-first+1);
  }
  const solemn=sectionBlocks(office,'matins',{solemnity:'solemn','te-deum':'omit','lauds-connection':'joined'});
  assert(solemn.some(b=>b.id==='matins-b0017'));
  assert(!solemn.some(b=>b.id==='matins-b0016'));
  assert(!solemn.some(b=>b.id==='matins-b0135'||b.id==='matins-b0140'));
  assert.equal(sectionBlocks(office,'lauds',{'lauds-connection':'joined'})[0].id,'lauds-b0005');
  const praise=sectionBlocks(office,'prime',{acclamation:'praise'}).find(b=>b.id==='prime-b0004');
  assert.match(praise.english,/Praise be to Thee/);
  assert(!praise.source.includes('Alleluia'));
  for (const [choice,id] of [['inviolata',45],['ave',53],['alma',60],['salve',68],['regina',77]]) {
    const selected=sectionBlocks(office,'compline',{'final-antiphon':choice});
    assert(selected.some(b=>b.id===`compline-b${String(id).padStart(4,'0')}`));
    assert(!selected.some(b=>Number(b.id.split('-b')[1])>43&&b.id!==`compline-b${String(id).padStart(4,'0')}`&&[45,53,60,68,77].includes(Number(b.id.split('-b')[1]))));
  }
  assert(sectionBlocks(office,'compline',{'final-antiphon':'omitted'}).every(b=>Number(b.id.split('-b')[1])<=43));
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
test('Joseph, Anthony and Sacred Heart assemble their printed common opening and conclusion', () => {
  for (const id of ['little-office-of-s-joseph','little-office-of-s-anthony-of-padua','little-office-of-the-sacred-heart-of-jesus']) {
    const office=documents.get(id);
    for (const hour of ['matins','prime','terce','sext','none','vespers','compline']) {
      const rows=sectionBlocks(office,hour,{season:'ordinary'});
      assert(rows.some(b=>/^℣. Deus in adiutorium/.test(b.source)));
      assert(rows.some(b=>b.id.startsWith('conclusion-of-the-hours-b')));
      assert(!rows.some(b=>b.source.startsWith('A Septuagesima')));
      const seasonal=sectionBlocks(office,hour,{season:'septuagesima'});
      assert(seasonal.some(b=>b.source.startsWith('A Septuagesima')));
      assert(!seasonal.find(b=>b.source.startsWith('℟. Sicut erat')).source.includes('Alleluia'));
      assert.equal(rows.some(b=>/^℣. Domine labia/.test(b.source)),hour==='matins');
      if (id!=='little-office-of-the-sacred-heart-of-jesus') assert.equal(rows.some(b=>/^℣. Converte nos/.test(b.source)),hour==='compline');
    }
    if (id!=='little-office-of-the-sacred-heart-of-jesus') assert(!office.sections.some(s=>s.id==='lauds'));
  }
});
test('Anthony Matins restores the reversed printed columns without discarding either text', () => {
  const office=documents.get('little-office-of-s-anthony-of-padua');
  const stanza=office.sections.find(s=>s.id==='matins').blocks[0];
  assert.match(stanza.source,/^Dum mundi/);
  assert.match(stanza.english,/^While in the world/);
  assert.equal(stanza.originalExtractedSource,stanza.english);
  assert.equal(stanza.originalExtractedEnglish,stanza.source);
});
