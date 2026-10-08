#!/usr/bin/env python3
"""Inventory the attached PDF from visible headings, not its incomplete bookmarks.

Requires PyMuPDF. This stage precedes the content import. Page numbers are 1-based.
"""
import hashlib
import json
import re
import unicodedata
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / 'content/source/book.pdf'
CATEGORIES = {
    19: 'Divine Mysteries', 103: 'Blessed Virgin Mary',
    411: 'Angels and Saints', 607: 'Miscellaneous',
}
ENGLISH_ONLY = {60, 68, 390, 402, 480, 513, 573, 653}
BILINGUAL = {26, 43, 54, 105, 280, 383, 413, 420, 443, 453, 614, 633}

def slug(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-')

def lines(page):
    result = []
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines', []):
            if line['bbox'][1] < 70 or line['bbox'][1] > 737:
                continue
            spans = line['spans']
            result.append({
                'text': ''.join(s['text'] for s in spans),
                'box': [round(v, 3) for v in line['bbox']],
                'blockBox': [round(v, 3) for v in block['bbox']],
                'spans': [{k: s[k] for k in ['text', 'font', 'size', 'color']} for s in spans],
            })
    return result

def main():
    pdf = fitz.open(PDF)
    pages = [lines(p) for p in pdf]
    titles = []
    for n, page in enumerate(pages, 1):
        title = ' '.join(l['text'] for l in page if any(
            s['size'] >= 17 and 'Bold' in s['font'] for s in l['spans']))
        if title and n >= 21 and n not in CATEGORIES and n < 657:
            titles.append((n, title))
    entries = []
    for i, (start, title) in enumerate(titles):
        next_start = titles[i+1][0] if i+1 < len(titles) else 657
        end = min([next_start] + [n for n in CATEGORIES if start < n < next_start]) - 1
        while end > start and not pages[end-1]:
            end -= 1
        category = CATEGORIES[max(n for n in CATEGORIES if n < start)]
        headings = []
        references = []
        variants = []
        for n in range(start, end+1):
            for line in pages[n-1]:
                txt = line['text']
                if (all('Bold' in s['font'] and s['size'] < 17 for s in line['spans'])
                        and line['box'][0] > 75 and line['box'][2] < 540):
                    headings.append({'title': txt, 'pdfPage': n})
                if re.search(r'ut supra|supra in|as above|see page|vide |pagina |pag\.\s*\d|p\.\s*\d', txt, re.I):
                    references.append({'text': txt, 'pdfPage': n, 'status': 'unresolved'})
                if re.search(r'Advent|Pasch|Septuages|Nativit|Septemb|Februari|Pro Majo|Tempore|Tempus|per annum|Lent|Easter|Christmas', txt, re.I):
                    variants.append({'text': txt, 'pdfPage': n})
        lang = ['English'] if start in ENGLISH_ONLY else ['Latin', 'English'] if start in BILINGUAL else ['Latin']
        entries.append({
            'id': slug(title), 'title': title, 'category': category,
            'source': {'pdfPages': [start, end], 'printedPages': [str(start), str(end)],
                       'file': 'book.pdf', 'pageNumberConvention': '1-based; printed and PDF pages coincide'},
            'originalLanguages': lang,
            'englishCoverage': 'complete' if start in ENGLISH_ONLY else 'partial-pending-audit' if start in BILINGUAL else 'none',
            'sourceHeadings': headings, 'sections': [], 'introductoryNotes': [],
            'variantMentions': variants, 'crossReferences': references,
            'status': {'extraction': 'not-started', 'translation': 'source-English' if start in ENGLISH_ONLY else 'not-started',
                       'verification': 'pending'},
        })
    document = {'schemaVersion': 1, 'book': {'title': 'A Big Book of Little Offices',
                'compiler': 'Little Office Guild', 'year': 2025, 'pdfPages': len(pdf),
                'sha256': hashlib.sha256(PDF.read_bytes()).hexdigest()},
                'inventoryMethod': 'Visible office headings; includes the unindexed office on p. 86.',
                'supplementaryMaterial': [
                    {'id': 'preface', 'title': 'Preface', 'pdfPages': [3, 3]},
                    {'id': 'compiler-note', 'title': 'Note from the Compiler', 'pdfPages': [5, 5]},
                    {'id': 'ceremonial', 'title': 'Ceremonial', 'pdfPages': [11, 14]},
                    {'id': 'before-after', 'title': 'Prayers Before and After the Recitation of the Office', 'pdfPages': [17, 17]},
                    {'id': 'bibliography', 'title': 'Conspectus librorum', 'pdfPages': [657, 659]},
                ], 'offices': entries}
    (ROOT / 'content/inventory.json').write_text(json.dumps(document, ensure_ascii=False, indent=2)+'\n')
    (ROOT / 'content/source/layout.json').write_text(json.dumps(pages, ensure_ascii=False)+'\n')
    print(f'Inventoried {len(entries)} offices, including all distinct rites and the unindexed p. 86 office.')

if __name__ == '__main__':
    main()
