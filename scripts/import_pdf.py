#!/usr/bin/env python3
"""Deterministic, reviewable extraction. Candidate alignments are NEVER certified.

The PDF geometry and original strings are retained in source/layout.json.
Manual corrections, translations and verified pairings live in content/overrides/.
"""
import json
import re
from collections import Counter
from pathlib import Path
from inventory import ROOT, slug

HOURS = {
    'matins': 'Matins', 'matutinum': 'Matins', 'ad matutinum': 'Matins', 'at matins': 'Matins',
    'ad vigilias': 'Vigils', 'ad officium noc': 'Night Office',
    'lauds': 'Lauds', 'ad laudes': 'Lauds', 'in laudibus': 'Lauds',
    'prime': 'Prime', 'ad primam': 'Prime', 'at prime': 'Prime',
    'terce': 'Terce', 'ad tertiam': 'Terce', 'ad teriam': 'Terce', 'at terce': 'Terce',
    'sext': 'Sext', 'ad sextam': 'Sext', 'at sext': 'Sext',
    'none': 'None', 'ad nonam': 'None', 'at none': 'None',
    'vespers': 'Vespers', 'ad vesperas': 'Vespers', 'ad vesperos': 'Vespers', 'at vespers': 'Vespers',
    'compline': 'Compline', 'ad completorium': 'Compline', 'at compline': 'Compline',
    'matins and lauds': 'Matins and Lauds',
    'ordinaria': 'Ordinary', 'ordinary': 'Ordinary',
    'conclusio horae': 'Conclusion of the Hours', 'conclusio': 'Conclusion',
    'conclusion of the hours': 'Conclusion of the Hours', 'conclusion of hours': 'Conclusion of the Hours',
    'conclusion of the above hours': 'Conclusion of the Hours', 'conclusion of the hour': 'Conclusion of the Hours',
    'comm endatio': 'Commendatio', 'commendatio': 'Commendatio', 'commendation': 'Commendatio',
    'ad commendationem': 'Commendatio', 'at commendation': 'Commendatio',
    'oblatio': 'Oblatio', 'praeparatio': 'Preparation', 'invocatio': 'Invocation',
    'ingressus': 'Ingressus', 'initio': 'Beginning', 'gratulatio': 'Gratulatio',
    'adhortatio': 'Adhortatio', 'ordo ad medium noctis': 'Ordo Ad Médium Noctis',
    'suspiria ad christum patientem': 'Suspiria ad Christum patientem',
    'oratio ad deum spiritum sanctum': 'Oratio ad Deum Spiritum Sanctum',
    'salve regina': 'Salve Regina', 'commemorationes ad libitum': 'Commemorationes ad libitum',
    'praefatio': 'Praefatio',
}
SECTION_PREFIX = re.compile(r'^(?:[IVX]+\s*[-–]|Kontakion\s+\d|Ikos\s+\d|Trisagion Prayers|Prayer (?:for|in |to |Before|After)|Closing Prayer|Formula S\.|Devota Oratio|Commendatio ad)', re.I)
REFERENCE = re.compile(r'\but supra\b|\b(?:as above|see page|vide supra|supra in)\b|\b(?:pag\.|p\.)\s*\d', re.I)

def clean(text):
    return text.replace('>V.', '℣.').replace('=R.', '℟.').replace('\u00ad', '').replace('\ufb01', 'fi').replace('\ufb02', 'fl')

def key(text):
    import unicodedata
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode().lower()
    return text.strip(' .:')

def section_title(text):
    k = key(text)
    return HOURS.get(k) or (text.strip() if SECTION_PREFIX.match(text) else None)

def line_kind(line):
    spans = [s for s in line['spans'] if s['text'].strip()]
    if spans and all('Italic' in s['font'] for s in spans):
        return 'rubric'
    if spans and all('Bold' in s['font'] for s in spans):
        return 'heading'
    return 'prayer'

def is_section(line):
    text = line['text'].strip()
    title = section_title(text)
    if not title:
        return False
    kind = line_kind(line)
    if kind == 'heading':
        return True
    # Italic hour names within the Ordinary are local rubrics, not new hours.
    if key(text) in HOURS:
        return kind == 'rubric' and line['box'][0] > (322 if line['box'][0]>=307 else 78)
    return kind in ['heading','rubric']

def merge_lines(lines):
    # Drop capitals are separate PDF lines at the same y coordinate.
    merged = []
    for l in sorted(lines, key=lambda x: (round(x['box'][1], 1), x['box'][0])):
        l = dict(l)
        if merged and abs(merged[-1]['box'][1]-l['box'][1]) < 1:
            old = merged[-1]
            # A capital adjoining the first word has no intervening space.
            gap = l['box'][0]-old['box'][2]
            old['text'] += ('' if len(old['text']) == 1 and gap < 5 and l['text'][:1].islower() else ' ') + l['text']
            old['spans'] += l['spans']
            old['box'] = [old['box'][0], old['box'][1], l['box'][2], max(old['box'][3],l['box'][3])]
        else:
            merged.append(l)
    return merged

def paragraphs(page_columns):
    blocks = []
    for page, lines in page_columns:
        prev = None
        for line in merge_lines(lines):
            text = clean(line['text']).strip()
            if not text:
                continue
            kind = line_kind(line)
            title = section_title(text) if is_section(line) else None
            if title:
                kind = 'section'
            # A marker starts a new paragraph. Keep continuation lines with it.
            split = (not blocks or title or kind != blocks[-1]['type'] or
                     re.match(r'^[℣℟]\.', text) or
                     (prev and line['box'][1]-prev['box'][3] > 8))
            if prev is None and blocks:
                # Across pages/columns only join an apparent continuation.
                split = bool(title or kind != blocks[-1]['type'] or
                             re.match(r'^[℣℟]\.',text) or
                             blocks[-1]['text'].rstrip().endswith(('.', ';', ':', '!', '?', 'Amen.')))
            if split:
                blocks.append({'type': kind, 'text': text, 'pages': [page],
                               **({'sectionTitle': title} if title else {})})
            else:
                old = blocks[-1]
                if old['text'].endswith('-') and re.match(r'^[a-zà-ž]', text):
                    old['text'] = old['text'][:-1] + text
                else:
                    old['text'] += '\n' + text
                if page not in old['pages']:
                    old['pages'].append(page)
            prev = line
    for block in blocks:
        # Reflow extraction line wraps while retaining paragraph boundaries.
        block['text'] = re.sub(r'\s+', ' ', block['text']).strip()
    return blocks

def split_sections(blocks):
    sections = []
    counts = Counter()
    for b in blocks:
        if b['type'] == 'section' or not sections:
            title = b.get('sectionTitle', 'Opening Prayers')
            counts[slug(title)] += 1
            sid = slug(title)+(f'-{counts[slug(title)]}' if counts[slug(title)] > 1 else '')
            sections.append({'id': sid, 'title': title, 'sourceHeading': b.get('text') if b['type']=='section' else None,
                             'pages': [], 'blocks': []})
            if b['type'] == 'section':
                continue
        sections[-1]['blocks'].append(b)
        sections[-1]['pages'] = sorted(set(sections[-1]['pages']+b['pages']))
    return [s for s in sections if s['blocks']]

def align_candidate(left, right):
    """Pair only structurally equal streams; unequal runs remain explicitly unpaired.

    An equal block count does not prove correspondence: every pair needs review.
    Never assign missing English from the following prayer by index shifting.
    """
    if len(left) == len(right) and all(a['type']==b['type'] and
        (not a['text'].startswith(('℣.','℟.')) or a['text'][:2]==b['text'][:2]) for a,b in zip(left,right)):
        return [{'type': a['type'], 'source': a['text'], 'english': b['text'],
                 'sourcePages': a['pages'], 'englishPages': b['pages'],
                 'translation': {'kind': 'supplied', 'sourcePages': b['pages']},
                 'alignment': 'candidate'} for a,b in zip(left,right)]
    # The importer declines to invent correspondence. Editors resolve these runs.
    return [{'type': a['type'], 'source': a['text'], 'english': None,
             'sourcePages': a['pages'], 'translation': None, 'alignment': 'unpaired'} for a in left], right

def extract(office, pages):
    start,end = office['source']['pdfPages']
    bilingual = office['originalLanguages'] == ['Latin','English']
    english_only = office['originalLanguages'] == ['English']
    left,right,notes = [],[],[]
    for n in range(start,end+1):
        lines = [l for l in pages[n-1] if not any(s['size']>=17 and 'Bold' in s['font'] for s in l['spans'])]
        # Introductory material spans the full page above the two-column body.
        intro = []
        # Only on the opening page: centered attribution also belongs to notes.
        if n == start:
            # Use block geometry: the last line of a full-width introductory
            # paragraph can be very short. Column text may begin above the first
            # named hour on the other side and must not be folded into notes.
            intro = [l for l in lines if l['blockBox'][0]<307 and l['blockBox'][2]>307 and not is_section(l)]
            first_column = min((l['box'][1] for l in lines if l['box'][0]<307 and is_section(l)), default=None)
            if first_column is not None and start == 634:
                intro += [l for l in lines if l['box'][0]<307 and l['box'][2]<307 and l['box'][1]<first_column-4 and l not in intro]
        # A full-width seasonal heading in the body belongs to the source stream.
        # Do not discard it as introductory material.
        ids = {id(l) for l in intro}
        if intro:
            notes.append((n,intro))
        body = [l for l in lines if id(l) not in ids]
        a=[l for l in body if l['box'][0]<307]
        b=[l for l in body if l['box'][0]>=307]
        left.append((n,a))
        if bilingual:
            right.append((n,b))
        else:
            left.append((n,b))
    ls = split_sections(paragraphs(left))
    rs = split_sections(paragraphs(right)) if bilingual else []
    unpaired = []
    sections = []
    for si,sec in enumerate(ls):
        if bilingual:
            matching = next((s for s in rs if s['id']==sec['id']), None)
            paired = align_candidate(sec['blocks'], matching['blocks'] if matching else [])
            if isinstance(paired, tuple):
                blocks, unused = paired
                if unused:
                    unpaired.append({'section':sec['id'], 'blocks':unused})
            else:
                blocks = paired
        else:
            blocks = [{'type':b['type'], 'source':b['text'], 'english':None,
                       'sourcePages':b['pages'], 'translation':{'kind':'source-English','sourcePages':b['pages']} if english_only else None,
                       'alignment':'single-language'} for b in sec['blocks']]
        for bi,b in enumerate(blocks):
            b['id'] = f'{sec["id"]}-b{bi+1:04}'
            b['verification'] = 'pending'
        sections.append({k:v for k,v in sec.items() if k!='blocks'} | {'blocks':blocks})
    if len(sections) == 1 and sections[0]['id'] == 'opening-prayers':
        sections[0]['title'] = office['title']
    for sec in rs:
        if not any(s['id']==sec['id'] for s in ls):
            unpaired.append({'section':sec['id'], 'title':sec['title'], 'blocks':sec['blocks']})
    introductions = paragraphs(notes)
    for b in introductions:
        b['type'] = 'source-note'
        b['language'] = 'English' if re.search(r'\b(?:From|Taken|Courtesy|The|the|This|published)\b',b['text']) else 'Latin'
    return {'schemaVersion':1, 'id':office['id'], 'title':office['title'], 'category':office['category'],
            'source':office['source'], 'sourceLanguage':'English' if english_only else 'Latin',
            'introductoryNotes':introductions, 'translationNotice':None,
            'status':{'extraction':'candidate', 'translation':'source-English' if english_only else 'incomplete', 'verification':'pending'},
            'sections':sections, 'unpairedEnglish':unpaired}

def main():
    inv_path = ROOT/'content/inventory.json'
    inv=json.loads(inv_path.read_text())
    pages=json.loads((ROOT/'content/source/layout.json').read_text())
    review=[]
    for office in inv['offices']:
        doc=extract(office,pages)
        override=ROOT/'content/overrides'/f'{office["id"]}.json'
        if override.exists():
            doc=json.loads(override.read_text())
        (ROOT/'content/offices'/f'{office["id"]}.json').write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n')
        office['sections']=[{k:s[k] for k in ['id','title','pages']} for s in doc['sections']]
        office['introductoryNotes']=doc['introductoryNotes']
        office['status']=doc['status']
        office['coverage']={'blocks':sum(len(s['blocks']) for s in doc['sections']),
                            'missingEnglish':sum(not b['english'] for s in doc['sections'] for b in s['blocks']) if doc['sourceLanguage']!='English' else 0,
                            'unpairedEnglishBlocks':sum(len(s['blocks']) for s in doc['unpairedEnglish']),
                            'preparedEnglish':sum(b.get('translation',{}).get('kind')=='prepared' for s in doc['sections'] for b in s['blocks'] if b.get('translation'))}
        for s in doc['sections']:
            for b in s['blocks']:
                if REFERENCE.search(b['source']):
                    review.append({'office':doc['id'], 'section':s['id'], 'block':b['id'], 'pages':b['sourcePages'],
                                   'kind':'internal-reference', 'text':b['source'],
                                   'status':'resolved' if b.get('referenceExpansion') else 'unresolved',
                                   **({'resolution':b['referenceExpansion']} if b.get('referenceExpansion') else {})})
    inv_path.write_text(json.dumps(inv,ensure_ascii=False,indent=2)+'\n')
    (ROOT/'content/references.json').write_text(json.dumps(review,ensure_ascii=False,indent=2)+'\n')
    print(f'Extracted all {len(inv["offices"])} offices. Candidates require review; {len(review)} reference candidates recorded.')

if __name__=='__main__':main()
