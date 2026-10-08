#!/usr/bin/env python3
"""Reuse reviewed English for identical complete Latin passages.

Whitespace alone is normalized by default. The explicit --word-sequence mode
compares every Unicode letter/number token in order, ignoring punctuation and
capitalization only. It never removes accents, words, or numbers, or substitutes
spellings. Conflicting English is never chosen silently.
Existing English and source-review status are preserved; no fuzzy matching,
prayer expansion, or copied visual certification is performed.
"""
import copy
import json
import re
import sys
from collections import defaultdict
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
NOTICE='English translation prepared for Sacrum Florilegium; not supplied in the source PDF.'
def normalized(text):return ' '.join(text.split())
def word_sequence(text):return ' '.join(re.findall(r'[^\W_]+',text.lower()))
def apply(root=ROOT,word_variants=False):
    key=word_sequence if word_variants else normalized
    documents=[]
    for path in sorted((root/'content/offices').glob('*.json')):
        override=root/'content/overrides'/path.name
        documents.append((override,json.loads((override if override.exists() else path).read_text())))
    memory=defaultdict(list)
    for _,doc in documents:
        for section in doc['sections']:
            for b in section['blocks']:
                if b.get('source') and b.get('english') and b.get('verification')=='visual-review' and b.get('alignment')=='reviewed' and (b.get('translation') or {}).get('kind') in ('supplied','prepared'):
                    if key(b['source']):memory[key(b['source'])].append((doc['id'],copy.deepcopy(b)))
    applied=0
    for target,doc in documents:
        if doc['sourceLanguage']=='English':continue
        changed=False
        for section in doc['sections']:
            for b in section['blocks']:
                if b.get('english') or not b.get('source'):continue
                matches=memory.get(key(b['source']),[])
                if not matches or len({normalized(v['english']) for _,v in matches})!=1:continue
                origin,original=next(((o,v) for o,v in matches if v['translation']['kind']=='supplied'),matches[0])
                kind=original['translation']['kind'];b['english']=original['english'];b['translation']={'kind':kind,'method':'exact-reviewed-pdf-reuse','reusedFromOffice':origin,'reusedFrom':original['id'],'sourcePages':original.get('englishPages',original['sourcePages']) if kind=='supplied' else b['sourcePages']}
                if word_variants:
                    b['translation'].update({'method':'reviewed-pdf-word-sequence-reuse','normalizationPolicy':'unicode-letters-numbers-lowercase-v1'})
                if kind=='supplied':b['englishPages']=original.get('englishPages',original['translation']['sourcePages'])
                else:b['translation'].update({'preparedFor':'Sacrum Florilegium','review':'editorial-review-complete'})
                b['alignment']='reviewed';b['editorialNote']='English reused from an identical complete Latin passage elsewhere in this PDF. This office’s source transcription still requires its own review.'
                if word_variants:
                    b['editorialNote']='English reused from a reviewed passage elsewhere in this PDF with the same complete sequence of Latin words and numbers. Only punctuation and capitalization differ; the target Latin is retained. This office’s source transcription still requires its own review.'
                if original.get('editorialNote'):
                    b['editorialNote']+=' Original printed-text note: '+original['editorialNote']
                if 'Septuagesima' in b['source'] and 'Lent' in b['english'] and 'Septuagesima' not in b['english']:
                    b['editorialNote']+=' The original Latin says Septuagesima; the supplied English says Lent. These differing printed terms are retained.'
                changed=True;applied+=1
        if changed:
            blocks=[b for s in doc['sections'] for b in s['blocks']]
            if any((b.get('translation') or {}).get('kind')=='prepared' for b in blocks):doc['translationNotice']=NOTICE
            if any((b.get('translation') or {}).get('kind')=='supplied' for b in blocks) and doc.get('translationNotice'):doc['translationScope']='marked'
            doc['status']['translation']='incomplete' if any(not b.get('english') for b in blocks) else 'complete'
            target.write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n')
    return applied
if __name__=='__main__':
    variants='--word-sequence' in sys.argv[1:]
    if any(a!='--word-sequence' for a in sys.argv[1:]):raise SystemExit('Usage: reuse_reviewed_english.py [--word-sequence]')
    print(f'Reused {apply(word_variants=variants)} reviewed English passages ({"complete word sequence" if variants else "exact text"}). Re-run import to refresh derived content.')
