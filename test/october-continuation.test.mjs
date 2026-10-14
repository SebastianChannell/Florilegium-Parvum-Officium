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
   for(const [id,hash] of Object.entries(section.existingEnglish)){
    const row=rows.find(b=>b.id===id);
    const correction=section.reviewedEnglishCorrections?.[id];
    const supplied=section.suppliedEnglishCorrections?.[id];
    if(supplied){
     assert(supplied.review?.trim());
     assert.equal(digest(row.originalSuppliedEnglish),hash);
     assert.equal(digest(row.english),supplied.digest);
     assert.equal(row.originalTranslation.kind,'supplied');
     assert(row.originalEnglishPages.length>0);
     assert.equal(row.printedParallelText.text,row.originalSuppliedEnglish);
     assert.deepEqual(row.printedParallelText.pages,row.originalEnglishPages);
     assert.equal(row.translation.kind,'prepared');
     assert.equal(row.translation.method,'visual-pdf-prepared-translation');
     assert.equal(row.translation.review,'editorial-review-complete');
     assert.equal(row.verification,supplied.verification);
     assert.deepEqual(row.sourcePages,supplied.sourcePages);
     assert(row.editorialNote.includes(row.originalSuppliedEnglish));
     assert(row.editorialNote.includes(supplied.requiredNoteText));
    }else if(correction){
     assert(correction.review?.trim());
     assert.equal(digest(row.originalPreparedEnglish),hash);
     assert.equal(digest(row.english),correction.digest);
     assert.equal(row.originalTranslation.method,'exact-reviewed-pdf-reuse');
     assert(row.originalEnglishPages.length>0);
     assert.equal(row.translation.kind,'prepared');
     assert.equal(row.translation.review,'editorial-review-complete');
     assert.equal(row.verification,'visual-review');
     assert(row.editorialNote?.includes(correction.requiredNoteText ?? 'Septuagesima'));
    }else if(section.visualPreparedEnglishCorrections?.[id]){
     const visual=section.visualPreparedEnglishCorrections[id];
     assert(visual.review?.trim());
     assert.equal(digest(row.originalPreparedEnglish),hash);
     assert.equal(digest(row.english),visual.digest);
     assert.equal(row.originalTranslation.method,'exact-source-memory');
     assert.equal(row.translation.kind,'prepared');
     assert.equal(row.translation.method,'visual-pdf-prepared-translation');
     assert.equal(row.translation.review,'editorial-review-complete');
     assert.equal(row.verification,'visual-review');
     assert.deepEqual(row.sourcePages,visual.sourcePages);
     assert(row.editorialNote?.includes(visual.requiredNoteText));
    }else if(section.visualWordSequenceEnglishCorrections?.[id]){
     const visual=section.visualWordSequenceEnglishCorrections[id];
     assert(visual.review?.trim());
     assert.equal(digest(row.originalPreparedEnglish),hash);
     assert.equal(digest(row.english),visual.digest);
     assert.equal(row.originalTranslation.kind,'prepared');
     assert.equal(row.originalTranslation.method,'reviewed-pdf-word-sequence-reuse');
     assert.equal(row.translation.method,'visual-pdf-prepared-translation');
     assert.equal(row.translation.kind,'prepared');
     assert.equal(row.translation.review,'editorial-review-complete');
     assert.equal(row.verification,'visual-review');
     assert.deepEqual(row.sourcePages,visual.sourcePages);
     assert(row.editorialNote.includes(visual.requiredNoteText));
    }else if(section.pendingEnglishCorrections?.[id]){
     const pending=section.pendingEnglishCorrections[id];
     assert(pending.review?.trim());
     assert.equal(digest(row.originalPreparedEnglish),hash);
     assert.equal(digest(row.english),pending.digest);
     assert(row.originalTranslation);
     assert.equal(row.translation.kind,'prepared');
     assert.equal(row.verification,'source-reading-pending');
     assert.deepEqual(row.sourcePages,pending.sourcePages);
     assert(row.editorialNote?.includes(pending.requiredNoteText));
    }else assert.equal(digest(row.english),hash);
   }
   if(!entry.partial)assert(rows.every(b=>b.english?.trim()));
   assert(rows.filter(b=>b.english?.trim()).every(b=>['prepared','supplied'].includes(b.translation?.kind)));
   if(entry.partial)assert(rows.filter(b=>b.verification==='source-reading-pending'&&b.english).every(b=>b.editorialNote?.trim()));
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

test('Paola and Ignatius repeat their own printed prayers and Michael preserves the seasonal alternatives',()=>{
 const paola=documents.get('little-office-of-s-francis-of-paola-founder-of-the-order-of-minims');
 for(const section of ['lauds','prime','terce','sext','none','vespers','compline']){
  const rows=sectionBlocks(paola,section,resolveVariants(paola));
  assert.deepEqual(rows.filter(b=>b.expandedFrom).map(b=>b.expandedFrom),['matins-b0011','matins-b0012','matins-b0013','matins-b0014','matins-b0015']);
  assert.equal(rows.at(-1).english,'etc.');
 }
 const ignatius=documents.get('little-office-of-s-igantius-founder-of-the-society-of-jesus');
 assert(!ignatius.sections.some(s=>s.id==='lauds'));
 for(const section of ['prime','terce','sext','none','vespers','compline']){
  const rows=sectionBlocks(ignatius,section,resolveVariants(ignatius));
  assert.deepEqual(rows.filter(b=>b.expandedFrom).map(b=>b.expandedFrom),['matins-b0013','matins-b0014']);
  assert(rows.at(-1).english.endsWith('Who livest and reignest, etc.'));
  assert.equal(rows.at(-1).verification,'source-reading-pending');
 }
 const michael=documents.get('little-office-of-s-michael-the-archangel');
 assert.equal(michael.sections.length,9);
 for(const section of michael.sections.filter(s=>s.id!=='commendatio')){
  const ordinary=sectionBlocks(michael,section.id,resolveVariants(michael));
  const seasonal=sectionBlocks(michael,section.id,resolveVariants(michael,{season:'septuagesima'}));
  const opening=ordinary.find(b=>b.source.endsWith('Alleluia.'));
  assert(opening);
  const alternative=seasonal.find(b=>b.id===opening.id);
  assert.equal(alternative.source,opening.source.replace(/Alleluia\.$/,'Laus tibi Domine Rex aeternae gloriae.'));
  assert(alternative.english.endsWith('Praise be to Thee, O Lord, King of everlasting glory.'));
  assert.equal(seasonal.filter(b=>b.type==='prayer'&&b.source.endsWith('Alleluia.')).length,0);
 }
 assert(!michael.sections.find(s=>s.id==='lauds').blocks[0].english.endsWith('Amen.'));
 assert(michael.sections.find(s=>s.id==='compline').blocks.find(b=>b.id==='compline-b0013').editorialNote.includes('attenuis'));
});

test('Cistercian minor hours select the printed weekday psalms and octave omission',()=>{
 const office=documents.get('little-office-of-the-blessed-virgin-mary-according-to-the-cistercian-usage');
 const expected={
  sun:{prime:['53','84','116'],terce:['119','120','121'],sext:['122','123','124'],none:['125','126','127']},
  mwf:{prime:['118 (I)','118 (II)','118 (III)'],terce:['118 (V)','118 (VI)','118 (VII)'],sext:['118 (VIII)','118 (IX)','118 (X)'],none:['118 (XI)','118 (XII)','118 (XIII)']},
  tths:{prime:['53','84','116'],terce:['118 (XIV)','118 (XV)','118 (XVI)'],sext:['118 (XVII)','118 (XVIII) — Justus es, Domine','118 (XIX)'],none:['118 (XX)','118 (XXI)','118 (XXII)']}
 };
 for(const [weekday,hours] of Object.entries(expected))for(const [hour,psalms] of Object.entries(hours)){
  const rows=sectionBlocks(office,hour,resolveVariants(office,{'minor-hour-psalms':weekday}));
  assert.deepEqual(rows.filter(b=>b.source.startsWith('Psalmus ')).map(b=>b.source.slice(8)),psalms);
  assert(rows.some(b=>b.id===`${hour}-b0001`));
 }
 const omitted=sectionBlocks(office,'lauds',resolveVariants(office,{'saints-commemoration':'omit'}));
 assert(!omitted.some(b=>b.id==='lauds-b0048'));
 assert(omitted.some(b=>b.id==='lauds-b0046'));
 assert(omitted.some(b=>b.id==='lauds-b0053'));
 assert(sectionBlocks(office,'lauds',resolveVariants(office)).some(b=>b.id==='lauds-b0048'));
 const unusual=sectionBlocks(office,'sext',resolveVariants(office,{'minor-hour-psalms':'tths'})).find(b=>b.id==='sext-b0026');
 assert(unusual.source.includes('Feci judicium et justitiam'));
});

test('Carmelite assembly restores column continuations and selects only the printed alternatives',()=>{
 const office=documents.get('little-office-of-the-blessed-virgin-mary-according-to-the-rite-of-the-order-of-the-brothers-of-the-blessed-virgin-mary-of-mount-carmel-carmelites');
 const ids=section=>sectionBlocks(office,section,resolveVariants(office)).map(b=>b.id);
 const tail=Array.from({length:13},(_,i)=>`matins-2-b${String(i+3).padStart(4,'0')}`);
 assert.deepEqual(ids('compline').slice(-13),tail);
 assert(!ids('compline').includes('compline-b0031'));
 assert.equal(ids('matins-2')[0],'compline-b0031');
 assert(ids('matins-2').includes('matins-2-b0017'));
 assert(tail.every(id=>!ids('matins-2').includes(id)));
 assert.deepEqual(ids('sext-2'),['lauds-3-b0002','lauds-3-b0003','lauds-3-b0004']);
 assert.equal(ids('lauds-3')[0],'sext-2-b0001');
 assert(!ids('lauds-3').includes('lauds-3-b0002'));
 assert.deepEqual(ids('lauds-3').slice(-6),Array.from({length:6},(_,i)=>`vespers-2-b${String(i+7).padStart(4,'0')}`));
 assert.deepEqual(ids('vespers-2'),Array.from({length:6},(_,i)=>`vespers-2-b${String(i+1).padStart(4,'0')}`));
 for(const [group,psalm] of [['first','matins-b0030'],['second','matins-b0042'],['third','matins-b0053']]){
  const rows=sectionBlocks(office,'matins',resolveVariants(office,{'matins-psalms':group}));
  assert(rows.some(b=>b.id===psalm));
  assert.equal(rows.filter(b=>['matins-b0030','matins-b0042','matins-b0053'].includes(b.id)).length,1);
 }
 for(const [form,addition] of [['ordinary',null],['paschal','matins-b0023'],['ascension','matins-b0025'],['pentecost','matins-b0027']]){
  const selected=resolveVariants(office,{'paschal-form':form});
  const rows=sectionBlocks(office,'matins',selected);
  const additions=rows.filter(b=>['matins-b0023','matins-b0025','matins-b0027'].includes(b.id));
  assert.deepEqual(additions.map(b=>b.id),addition?[addition]:[]);
  if(addition)assert(rows.findIndex(b=>b.id===addition)<rows.findIndex(b=>b.id==='matins-b0020'));
  for(const [hour,ordinary,paschal] of [['prime','prime-b0029','prime-b0038'],['terce','terce-b0029','terce-b0034'],['sext','sext-b0029','sext-b0033'],['none','none-b0029','none-b0034']]){
   const hourRows=sectionBlocks(office,hour,selected);
   assert.equal(hourRows.some(b=>b.id===ordinary),form==='ordinary');
   assert.equal(hourRows.some(b=>b.id===paschal),form!=='ordinary');
  }
 }
 const omitted=sectionBlocks(office,'matins',resolveVariants(office,{'te-deum':'omit'}));
 assert(!omitted.some(b=>b.id==='matins-b0089'));
 assert.equal(omitted.filter(b=>b.id==='matins-b0084').length,1);
 assert(office.sections.find(s=>s.id==='none-2').title.includes('Advent'));
 assert(office.sections.find(s=>s.id==='sext-3').title.includes('Nativity'));
});
