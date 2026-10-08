import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const notice = 'English translation prepared for Sacrum Florilegium; not supplied in the source PDF.';
export function validateContent({ inventory, documents, boundaries, references = [] }, release = false) {
  const errors = [], pending = [], ids = new Set(), expected = new Set(boundaries.map(o => o.id));
  let blocks = 0, missingEnglish = 0, preparedEnglish = 0, unpairedEnglish = 0, reviewedOffices = 0;
  const add = (message, office) => errors.push({ office, message });
  for (const office of inventory.offices) {
    if (ids.has(office.id)) add('Duplicate office identifier.',office.id);
    ids.add(office.id);
    if (!expected.has(office.id)) add('Office is absent from the independent source boundary manifest.',office.id);
    const doc = documents.get(office.id);
    if (!doc) { add('Missing office content.',office.id); continue; }
    if (doc.id !== office.id) add('Content identifier differs from inventory.',office.id);
    const bound = boundaries.find(o => o.id === office.id);
    if (bound && JSON.stringify(bound.pdfPages) !== JSON.stringify(doc.source.pdfPages)) add('Office page boundaries differ from source manifest.',office.id);
    const sections = new Set(), blockIds = new Set();
    const inventorySections = new Set(office.sections.map(s => s.id));
    if (!doc.sections?.length) add('Office has no sections.',office.id);
    let prepared = 0, missing = 0;
    for (const section of doc.sections) {
      if (sections.has(section.id)) add(`Duplicate section: ${section.id}`,office.id);
      sections.add(section.id);
      if (!inventorySections.has(section.id)) add(`Broken inventory section link: ${section.id}`,office.id);
      if (!section.blocks.length) add(`Empty section: ${section.id}`,office.id);
      for (const b of section.blocks) {
        blocks++;
        if (blockIds.has(b.id)) add(`Duplicate block: ${b.id}`,office.id);
        blockIds.add(b.id);
        if (!b.source?.trim()) add(`Empty source passage: ${b.id}`,office.id);
        if (!b.sourcePages?.length) add(`Missing page provenance: ${b.id}`,office.id);
        if (b.sourcePages?.some(p => !Number.isInteger(p) || p < doc.source.pdfPages[0] || p > doc.source.pdfPages[1])) add(`Page outside office boundary: ${b.id}`,office.id);
        if (doc.sourceLanguage !== 'English' && !b.english?.trim()) { missing++; missingEnglish++; }
        if (doc.sourceLanguage === 'English' && b.english) add(`English-only office duplicates its source: ${b.id}`,office.id);
        if (b.english && !b.translation?.kind) add(`English lacks provenance: ${b.id}`,office.id);
        if (b.alignment === 'source-discrepancy' && (!b.editorialNote?.trim() || b.verification !== 'source-reading-pending')) add(`Source discrepancy lacks a visible note or pending review status: ${b.id}`,office.id);
        if (b.translation?.kind === 'prepared') { prepared++; preparedEnglish++; if (!b.english) add(`Prepared translation is empty: ${b.id}`,office.id); }
        if (/\b(?:TODO|TBD|LOREM IPSUM)\b/i.test(b.source+' '+(b.english || ''))) add(`Placeholder content: ${b.id}`,office.id);
        if (release && b.verification !== 'visual-review') pending.push({office:office.id,block:b.id,message:'Passage awaits visual review.'});
      }
    }
    for (const sid of inventorySections) if (!sections.has(sid)) add(`Inventory section is absent from content: ${sid}`,office.id);
    const blockMap = new Map(doc.sections.flatMap(s => s.blocks.map(b => [b.id,b])));
    function checkExpansion(id, chain = []) {
      const b = blockMap.get(id);
      if (!b) { add(`Unresolved inline prayer reference: ${id}`,office.id); return; }
      if (chain.includes(id)) { add(`Circular inline prayer reference: ${id}`,office.id); return; }
      if (!b.referenceExpansion) return;
      if (!b.referenceExpansion.targets?.length || !b.referenceExpansion.sourcePages?.length) {
        add(`Inline prayer reference lacks targets or source provenance: ${id}`,office.id); return;
      }
      for (const target of b.referenceExpansion.targets) checkExpansion(target,[...chain,id]);
    }
    for (const b of blockMap.values()) if (b.referenceExpansion) checkExpansion(b.id);
    for (const s of doc.sections) {
      for (const ref of [...(s.assembly?.before || []), ...(s.assembly?.after || [])]) if (!blockIds.has(ref)) add(`Unresolved assembly reference: ${ref}`,office.id);
    }
    for (const v of doc.variants || []) {
      const optionIds = v.options.map(o => o.id);
      if (new Set(optionIds).size !== optionIds.length || !optionIds.includes(v.default)) add(`Invalid variant: ${v.id}`,office.id);
    }
    for (const s of doc.sections) for (const b of s.blocks) for (const [v,options] of Object.entries(b.when || {})) {
      const variant=doc.variants?.find(x=>x.id===v);
      if (!variant || options.some(id=>!variant.options.some(o=>o.id===id))) add(`Invalid block variant: ${b.id}`,office.id);
    }
    for (const note of doc.introductoryNotes || []) {
      if (note.language !== 'English' && !note.english) { if (release) pending.push({office:office.id,message:'Source-language introduction needs English.'}); }
      if (note.translation?.kind === 'prepared') { prepared++; preparedEnglish++; if (!note.english) add('Prepared note has no English.',office.id); }
    }
    if (prepared && doc.translationNotice !== notice) add('Prepared English lacks the required translation notice.',office.id);
    if (prepared && doc.sections.some(s=>s.blocks.some(b=>b.translation?.kind==='supplied')) && doc.translationScope !== 'marked') add('Mixed English must identify marked prepared passages.',office.id);
    const unpaired = (doc.unpairedEnglish || []).reduce((n,s)=>n+s.blocks.length,0); unpairedEnglish+=unpaired;
    if (missing) pending.push({office:office.id,message:`${missing} source passages lack aligned English.`});
    if (unpaired) pending.push({office:office.id,message:`${unpaired} supplied English passages await pairing.`});
    if (doc.status.verification === 'visual-review') reviewedOffices++;
    else pending.push({office:office.id,message:'Office awaits visual source review.'});
  }
  for (const id of expected) if (!ids.has(id)) add('Missing office compared with source boundaries.',id);
  for (const id of documents.keys()) if (!ids.has(id)) add('Content document is absent from inventory.',id);
  for (const ref of references) {
    if (ref.status !== 'resolved') pending.push({office:ref.office,block:ref.block,message:'Internal source reference awaits resolution.'});
    else {
      const b = documents.get(ref.office)?.sections.flatMap(s=>s.blocks).find(b=>b.id===ref.block);
      if (!b?.referenceExpansion || JSON.stringify(b.referenceExpansion)!==JSON.stringify(ref.resolution)) add(`Resolved reference has no matching content expansion: ${ref.block}`,ref.office);
    }
  }
  return { complete:!errors.length && !pending.length, errors, pending,
    totals:{ offices:ids.size, sections:[...documents.values()].reduce((n,o)=>n+o.sections.length,0),blocks,missingEnglish,preparedEnglish,unpairedEnglish,reviewedOffices,
      englishOnly:inventory.offices.filter(o=>o.originalLanguages.length===1 && o.originalLanguages[0]==='English').length,
      latinOnly:inventory.offices.filter(o=>o.originalLanguages.length===1 && o.originalLanguages[0]==='Latin').length,
      suppliedBilingual:inventory.offices.filter(o=>o.originalLanguages.length===2).length,
      unresolvedReferences:references.filter(r=>r.status!=='resolved').length } };
}
export function readContent() {
  const read = p => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
  const inventory = read('content/inventory.json');
  const documents = new Map(fs.readdirSync(path.join(root,'content/offices')).filter(f=>f.endsWith('.json')).map(f=>{const d=read(`content/offices/${f}`);return [d.id,d];}));
  return { inventory, documents, boundaries:read('content/source/office-boundaries.json'), references:read('content/references.json') };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const release = process.argv.includes('--release');
  const report=validateContent(readContent(),release);
  fs.writeFileSync(path.join(root,'docs/coverage.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report.totals,null,2));
  for (const e of report.errors) console.error(`${e.office}: ${e.message}`);
  if (release && report.pending.length) console.error(`Release BLOCKED: ${report.pending.length} outstanding content checks. See docs/coverage.json.`);
  if (report.errors.length || release && !report.complete) process.exitCode=1;
}
