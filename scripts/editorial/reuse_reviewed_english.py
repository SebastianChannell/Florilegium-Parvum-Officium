#!/usr/bin/env python3
"""Reuse reviewed English for identical complete Latin passages.

Whitespace alone is normalized. Conflicting English is never chosen silently.
Existing English and source-review status are preserved; no fuzzy matching,
prayer expansion, or copied visual certification is performed.
"""
import copy
import json
from collections import defaultdict
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
NOTICE='English translation prepared for Sacrum Florilegium; not supplied in the source PDF.'
def normalized(text):return ' '.join(text.split())
def apply(root=ROOT):
    documents=[]
    for path in sorted((root/'content/offices').glob('*.json')):
        override=root/'content/overrides'/path.name
        documents.append((override,json.loads((override if override.exists() else path).read_text())))
    memory=defaultdict(list)
    for _,doc in documents:
        for section in doc['sections']:
            for b in section['blocks']:
                if b.get('source') and b.get('english') and b.get('verification')=='visual-review' and b.get('alignment')=='reviewed' and (b.get('translation') or {}).get('kind') in ('supplied','prepared'):
                    memory[normalized(b['source'])].append((doc['id'],copy.deepcopy(b)))
    applied=0
    for target,doc in documents:
        if doc['sourceLanguage']=='English':continue
        changed=False
        for section in doc['sections']:
            for b in section['blocks']:
                if b.get('english') or not b.get('source'):continue
                matches=memory.get(normalized(b['source']),[])
                if not matches or len({normalized(v['english']) for _,v in matches})!=1:continue
                origin,original=next(((o,v) for o,v in matches if v['translation']['kind']=='supplied'),matches[0])
                kind=original['translation']['kind'];b['english']=original['english'];b['translation']={'kind':kind,'method':'exact-reviewed-pdf-reuse','reusedFromOffice':origin,'reusedFrom':original['id'],'sourcePages':original.get('englishPages',original['sourcePages']) if kind=='supplied' else b['sourcePages']}
                if kind=='supplied':b['englishPages']=original.get('englishPages',original['translation']['sourcePages'])
                else:b['translation'].update({'preparedFor':'Sacrum Florilegium','review':'editorial-review-complete'})
                b['alignment']='reviewed';b['editorialNote']='English reused from an identical complete Latin passage elsewhere in this PDF. This office’s source transcription still requires its own review.'
                changed=True;applied+=1
        if changed:
            blocks=[b for s in doc['sections'] for b in s['blocks']]
            if any((b.get('translation') or {}).get('kind')=='prepared' for b in blocks):doc['translationNotice']=NOTICE
            if any((b.get('translation') or {}).get('kind')=='supplied' for b in blocks) and doc.get('translationNotice'):doc['translationScope']='marked'
            doc['status']['translation']='incomplete' if any(not b.get('english') for b in blocks) else 'complete'
            target.write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n')
    return applied
if __name__=='__main__':print(f'Reused {apply()} exact reviewed English passages. Re-run import to refresh derived content.')
