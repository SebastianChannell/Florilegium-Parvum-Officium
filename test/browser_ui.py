#!/usr/bin/env python3
"""Browser integration checks against a locally served editorial preview.

python test/browser_ui.py [http://127.0.0.1:4173] [chromium executable]
Requires Playwright and Chromium. No translation/network service is contacted.
"""
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
BASE=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:4173'
BROWSER=sys.argv[2] if len(sys.argv)>2 else '/usr/bin/chromium'
INVENTORY=json.loads((ROOT/'content/inventory.json').read_text())['offices']
ARTIFACTS=ROOT/'test/artifacts'
ARTIFACTS.mkdir(exist_ok=True)

def check_width(page):
    assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'), 'Page-wide horizontal overflow'

def choose(page, office, section=None):
    page.locator('#officeSearch').fill('')
    page.locator('#categorySelect').select_option('')
    page.locator('#officeSelect').select_option(office['id'])
    page.wait_for_function('(id)=>document.querySelector("#officeTitle").textContent===id',arg=office['title'])
    page.wait_for_selector('.prayer-row')
    if section:
        page.locator('#sectionSelect').select_option(section)
        page.wait_for_function('(id)=>new URLSearchParams(location.hash.slice(1)).get("section")===id',arg=section)

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=BROWSER,headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2)
    errors=[]
    requests=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.on('request',lambda request:requests.append(request.url))
    page.goto(BASE);page.wait_for_selector('.prayer-row')
    initial=[url for url in requests if '/content/offices/' in url]
    assert len(initial)==1, 'Initial load fetched more than one office'
    assert not any(url.endswith('.pdf') for url in requests), 'PDF eagerly downloaded'
    for i,office in enumerate(INVENTORY):
        choose(page,office)
        actual=page.locator('#sectionSelect option').evaluate_all('(nodes)=>nodes.map(n=>n.value)')
        assert actual==[s['id'] for s in office['sections']],office['id']
        for section in office['sections']:
            page.locator('#sectionSelect').select_option(section['id'])
            assert page.locator('#sectionTitle').inner_text()==section['title']
            assert page.locator('.prayer-row').count()>0
        check_width(page)
        if i%20==0: print(f'Checked {i+1}/82 offices',flush=True)
    trinity=INVENTORY[0]
    for width in [320,390,430,1280]:
        page.set_viewport_size({'width':width,'height':844})
        choose(page,trinity,'matins')
        for mode in ['parallel','stacked','source','english']:
            page.locator('#layoutSelect').select_option(mode)
            check_width(page)
            if mode=='parallel':
                source=page.locator('#prayerBlocks .source-cell').first.bounding_box();english=page.locator('#prayerBlocks .english-cell').first.bounding_box()
                assert source['x']<english['x'] and abs(source['y']-english['y'])<1
            if mode=='stacked':
                source=page.locator('#prayerBlocks .source-cell').first.bounding_box();english=page.locator('#prayerBlocks .english-cell').first.bounding_box()
                assert english['y']>source['y']
        page.locator('#layoutSelect').select_option('parallel')
        page.screenshot(path=str(ARTIFACTS/f'trinity-{width}.png'),full_page=True)
    page.set_viewport_size({'width':390,'height':844})
    season=page.locator('#variantControls select')
    season.select_option('septuagesima')
    assert page.locator('[data-block="ordinary-b0014"]').count()==1
    page.reload();page.wait_for_selector('.prayer-row')
    assert page.locator('#sectionSelect').input_value()=='matins'
    assert page.locator('#variantControls select').input_value()=='septuagesima'
    page.goto(BASE);page.wait_for_selector('.prayer-row')
    assert page.locator('#sectionSelect').input_value()=='matins', 'Last section not restored'
    page.locator('#sectionSelect').select_option('prime')
    page.locator('#sectionSelect').select_option('sext')
    page.go_back();page.wait_for_function('document.querySelector("#sectionSelect").value==="prime"')
    page.locator('#officeSearch').fill('Sarum')
    assert page.locator('#officeSelect option').count()==1
    page.locator('#officeSearch').fill('a-search-that-cannot-match')
    assert page.locator('#officeSelect').is_disabled()
    english=next(o for o in INVENTORY if o['source']['pdfPages'][0]==60)
    choose(page,english,'matins')
    assert page.locator('.english-cell').count()==0
    assert page.locator('#languageLabels').inner_text()=='ENGLISH · SOURCE TEXT'
    assert all(lang=='en' for lang in page.locator('#prayerBlocks .source-cell').evaluate_all('(n)=>n.map(e=>e.lang)'))
    page.screenshot(path=str(ARTIFACTS/'english-only-390.png'),full_page=True)
    mixed=next(o for o in INVENTORY if o['source']['pdfPages'][0]==280)
    choose(page,mixed)
    assert page.locator('#translationNotice').is_visible()
    assert 'marked †' in page.locator('#translationNotice').inner_text()
    page.locator('#notesDetails summary').click()
    assert page.locator('#officeNotes .prepared-mark').count()==3
    check_width(page)
    page.screenshot(path=str(ARTIFACTS/'mixed-long-notes-390.png'),full_page=True)
    page.locator('#sectionSelect').select_option('lauds')
    assert page.locator('.english-supplement').count()==1
    assert 'Psalm 66' in page.locator('.english-supplement .english-cell').inner_text()
    assert 'No corresponding source-language passage' in page.locator('.english-supplement .source-cell').inner_text()
    for mode in ['parallel','stacked','english','source']:
        page.locator('#layoutSelect').select_option(mode)
        assert page.locator('.english-supplement').count()==(0 if mode=='source' else 1)
        check_width(page)
    page.locator('#layoutSelect').select_option('parallel')
    for trigger in ['#fontUp' ,'#fontDown','#shareButton','#officeSearch','#officeSelect','#sectionSelect']:
        assert page.locator(trigger).bounding_box()['height']>=44
    page.locator('.skip-link').focus();page.keyboard.press('Enter')
    assert page.locator('#reader').evaluate('(e)=>document.activeElement===e')
    assert not errors,errors
    print('PASS: all 82 office selectors; all sections; 320/390/430/1280 widths; four layouts; seasonal URLs; restoration; history; keyboard skip link; 44px controls; lazy loading.',flush=True)
    browser.close()
