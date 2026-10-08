import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { sectionBlocks } from '../public/reader-model.js';
import { readContent, validateContent } from '../scripts/validate-content.mjs';

test('reviewed PDF reuse carries source notes and differing seasonal terminology',()=>{
 const output=execFileSync('python3',['-c',`
import importlib.util,json,tempfile,pathlib
spec=importlib.util.spec_from_file_location('reuse','scripts/editorial/reuse_reviewed_english.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
with tempfile.TemporaryDirectory() as t:
 r=pathlib.Path(t)
 for p in ['content/offices','content/overrides']:(r/p).mkdir(parents=True)
 b={'id':'a','source':'A Septuagesima.','english':'From Lent.','sourcePages':[1],'englishPages':[2],'verification':'visual-review','alignment':'reviewed','translation':{'kind':'supplied','sourcePages':[2]},'editorialNote':'The printed English differs.'}
 source={'id':'source','sourceLanguage':'Latin','status':{'translation':'complete'},'sections':[{'blocks':[b]}]}
 target={'id':'target','sourceLanguage':'Latin','status':{'translation':'incomplete'},'sections':[{'blocks':[{'id':'b','source':b['source'],'english':None,'sourcePages':[3],'verification':'pending'}]}]}
 for d in [source,target]:(r/'content/offices'/(d['id']+'.json')).write_text(json.dumps(d))
 assert m.apply(r)==1
 row=json.loads((r/'content/overrides/target.json').read_text())['sections'][0]['blocks'][0]
 assert 'The printed English differs.' in row['editorialNote']
 assert 'Latin says Septuagesima; the supplied English says Lent' in row['editorialNote']
 assert row['english']=='From Lent.' and row['verification']=='pending'
 assert m.apply(r)==0
 print('notes preserved')
`],{encoding:'utf8'});
 assert.match(output,/notes preserved/);
});

test('exact translation memory protects supplied English, variant spellings, and review status', () => {
  const output = execFileSync('python3', ['-c', `
import importlib.util,json,tempfile,pathlib
spec=importlib.util.spec_from_file_location('memory','scripts/editorial/apply_translation_memory.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
with tempfile.TemporaryDirectory() as t:
 r=pathlib.Path(t)
 for p in ['content/offices','content/overrides','content/translations']:(r/p).mkdir(parents=True)
 def write(p,d):(r/p).write_text(json.dumps(d))
 write('content/inventory.json',{'offices':[{'id':'latin','originalLanguages':['Latin']},{'id':'bilingual','originalLanguages':['Latin','English']}]})
 write('content/translations/exact-memory.json',{'entries':[{'id':'one','source':'Exact.','english':'Prepared.'}]})
 blocks=[{'id':str(i),'source':s,'english':e,'sourcePages':[1],'verification':'pending'} for i,(s,e) in enumerate([('Exact.',None),('Exact.','Existing.'),('Exact!',None)])]
 for id in ['latin','bilingual']:write('content/offices/'+id+'.json',{'id':id,'sections':[{'blocks':blocks}],'status':{'verification':'pending'}})
 assert m.apply(r)==1
 d=json.loads((r/'content/overrides/latin.json').read_text());b=d['sections'][0]['blocks']
 assert b[0]['english']=='Prepared.' and b[0]['verification']=='pending'
 assert b[1]['english']=='Existing.' and b[2]['english'] is None
 assert not (r/'content/overrides/bilingual.json').exists()
 assert m.apply(r)==0
 print('protected')
`], {encoding:'utf8'});
  assert.match(output,/protected/);
});

test('word-sequence reuse allows case/punctuation and rejects every lexical difference',()=>{
 const output=execFileSync('python3',['-c',`
import importlib.util,json,tempfile,pathlib
spec=importlib.util.spec_from_file_location('reuse','scripts/editorial/reuse_reviewed_english.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
with tempfile.TemporaryDirectory() as t:
 r=pathlib.Path(t)
 for p in ['content/offices','content/overrides']:(r/p).mkdir(parents=True)
 source={'id':'origin','sourceLanguage':'Latin','status':{'translation':'complete'},'sections':[{'blocks':[{'id':'a','source':'℣. Glória Patri, non 12.','english':'The supplied English.','sourcePages':[1],'englishPages':[2],'verification':'visual-review','alignment':'reviewed','translation':{'kind':'supplied','sourcePages':[2]}}]}]}
 texts=['GLÓRIA PATRI; NON: 12!','Gloria Patri non 12','Glória Patri 12','Glória Patri non 13','Patri Glória non 12','Glória Patri non 12 et','Glória Patri non 12','...']
 blocks=[{'id':str(i),'source':s,'english':'Existing.' if i==6 else None,'sourcePages':[3],'verification':'pending'} for i,s in enumerate(texts)]
 target={'id':'target','sourceLanguage':'Latin','status':{'translation':'incomplete'},'sections':[{'blocks':blocks}]}
 for d in [source,target]:(r/'content/offices'/(d['id']+'.json')).write_text(json.dumps(d))
 assert m.apply(r,word_variants=True)==1
 rows=json.loads((r/'content/overrides/target.json').read_text())['sections'][0]['blocks']
 assert rows[0]['english']=='The supplied English.' and rows[0]['source']==texts[0]
 assert rows[0]['verification']=='pending' and rows[0]['englishPages']==[2]
 assert rows[0]['translation']['normalizationPolicy']=='unicode-letters-numbers-lowercase-v1'
 assert all(rows[i]['english'] is None for i in [1,2,3,4,5,7])
 assert rows[6]['english']=='Existing.'
 assert m.apply(r,word_variants=True)==0
 print('lexical differences protected')
`],{encoding:'utf8'});
 assert.match(output,/lexical differences protected/);
});

test('every word-sequence reuse has reviewed provenance and unchanged English',()=>{
 const input=readContent();let count=0;
 const words=t=>t.toLowerCase().match(/[\p{L}\p{N}]+/gu).join(' ');
 for(const d of input.documents.values())for(const b of d.sections.flatMap(s=>s.blocks)){
  if(b.translation?.method!=='reviewed-pdf-word-sequence-reuse')continue;
  count++;
  const original=input.documents.get(b.translation.reusedFromOffice).sections.flatMap(s=>s.blocks).find(x=>x.id===b.translation.reusedFrom);
  assert.equal(words(b.source),words(original.source));assert.equal(b.english,original.english);
  assert.equal(original.verification,'visual-review');assert.equal(original.alignment,'reviewed');
  assert(b.editorialNote.includes('complete sequence'));
 }
 assert(count>=135);
 const changed=structuredClone(input);
 const row=[...changed.documents.values()].flatMap(d=>d.sections.flatMap(s=>s.blocks)).find(b=>b.translation?.method==='reviewed-pdf-word-sequence-reuse');
 row.source+=' non';
 assert(validateContent(changed).errors.some(e=>e.message.includes('identical reviewed source')));
});

test('all non-English introductory source notes have English and prepared provenance',()=>{
 const {documents}=readContent();let count=0;
 for(const office of documents.values())for(const note of office.introductoryNotes||[]){
  if(note.language==='English')continue;
  assert(note.english?.trim());assert.equal(note.translation.kind,'prepared');
  assert.deepEqual(note.translation.sourcePages,note.pages);assert(office.translationNotice);
  count++;
 }
 assert.equal(count,21);
});

test('reviewed supplied translations remain supplied and complete', () => {
  const {documents} = readContent();
  for (const id of ['little-office-of-the-blessed-sacrament','little-office-of-the-immaculate-conception','little-office-for-benedictine-oblates-alternative-version']) {
    const d=documents.get(id);
    assert.equal(d.unpairedEnglish.length,0);
    for (const b of d.sections.flatMap(s=>s.blocks)) {
      assert(b.english);
      assert.equal(b.translation.kind,'supplied');
    }
  }
});

test('inline references expand the correct source prayers without inventing hours', () => {
  const {documents} = readContent();
  const d=documents.get('little-office-of-god-the-father');
  const b=sectionBlocks(d,'prime');
  assert(b.some(x=>x.expandedFrom==='matins-b0009' && /superexaltemus/.test(x.source)));
  assert(b.some(x=>x.expandedFrom==='matins-b0014' && /Grant us/.test(x.english)));
  assert.equal(d.sections.some(s=>s.id==='lauds'),false);
});

test('cyclic and missing inline reference targets are rejected', () => {
  const d={sections:[{id:'prime',blocks:[{id:'a',referenceExpansion:{targets:['b']}},{id:'b',referenceExpansion:{targets:['a']}}]}]};
  assert.throws(()=>sectionBlocks(d,'prime'),/Circular/);
  d.sections[0].blocks[1].referenceExpansion.targets=['missing'];
  assert.throws(()=>sectionBlocks(d,'prime'),/Unresolved/);
  const all=readContent();
  const ref=all.references.find(r=>r.status==='resolved');
  ref.resolution={targets:['invented'],sourcePages:[1]};
  assert(validateContent(all).errors.some(e=>e.message.includes('no matching content expansion')));
});
