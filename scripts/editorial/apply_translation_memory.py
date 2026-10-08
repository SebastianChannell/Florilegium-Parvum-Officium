#!/usr/bin/env python3
"""Apply exact, reviewed source-text translations to Latin-only offices.

Never touch supplied bilingual text or replace existing English. No fuzzy matching,
accent stripping, abbreviation expansion, or concatenation of fragments. Office
visual-review and reference-resolution statuses are deliberately left unchanged.
"""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
NOTICE = 'English translation prepared for Sacrum Florilegium; not supplied in the source PDF.'

def apply(root=ROOT):
    inventory = json.loads((root/'content/inventory.json').read_text())
    memory = json.loads((root/'content/translations/exact-memory.json').read_text())
    entries = {x['source']: x for x in memory['entries']}
    if len(entries) != len(memory['entries']):
        raise ValueError('Duplicate exact translation-memory source.')
    applied = 0
    for office in inventory['offices']:
        if office['originalLanguages'] != ['Latin']:
            continue
        target = root/'content/overrides'/f"{office['id']}.json"
        source = target if target.exists() else root/'content/offices'/target.name
        doc = json.loads(source.read_text())
        changed = False
        for section in doc['sections']:
            for block in section['blocks']:
                if block.get('english') or block['source'] not in entries:
                    continue
                entry = entries[block['source']]
                block['english'] = entry['english']
                block['translation'] = {'kind':'prepared', 'preparedFor':'Sacrum Florilegium',
                    'sourcePages':block['sourcePages'], 'review':'editorial-review-complete',
                    'method':'exact-source-memory', 'memoryId':entry['id']}
                block['alignment'] = 'reviewed'
                changed = True
                applied += 1
        if changed:
            doc['translationNotice'] = NOTICE
            missing = any(not b.get('english') for s in doc['sections'] for b in s['blocks'])
            doc['status']['translation'] = 'incomplete' if missing else 'complete-prepared'
            target.write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n')
    return applied

if __name__ == '__main__':
    print(f'Added {apply()} exact source-text translations. Re-run import to refresh derived content.')
