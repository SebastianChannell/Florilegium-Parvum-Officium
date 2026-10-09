import json
from pathlib import Path
root=Path(__file__).resolve().parents[2]; id='little-office-of-the-guardian-angel'
x=json.loads((root/'content/offices'/f'{id}.json').read_text())
assert not x['unpairedEnglish']
for s in x['sections']:
 for b in s['blocks']:
  assert b['english']
  b['alignment']='reviewed';b['verification']='visual-review'
b=next(s for s in x['sections'] if s['id']=='ordinary')['blocks']
season=b[8];a,c=season['source'].split('dicitur: ',1);d,e=season['english'].split('following is said: ',1)
season['source']=a+'dicitur:';season['english']=d+'following is said:'
new=dict(season);new.update(id='ordinary-b0012',source=c,english=e,type='prayer',when={'season':['septuagesima']});b.insert(9,new)
x['variants']=[{'id':'season','title':'Seasonal form','default':'ordinary','sourcePages':[413],'options':[{'id':'ordinary','title':'Alleluia'},{'id':'septuagesima','title':'Septuagesima until Easter'}]}]
b[7]['forms']={'season':{'septuagesima':{'source':b[7]['source'].replace(' Alleluia.',''),'english':b[7]['english'].replace(' Alleluia.','')}}}
x['editorialNotes']=[{'text':'The supplied English says “During Lent until Easter”; the Latin rubric says “A Septuagesima usque ad Pascha.” Both are preserved. The collect prints “aeterna sociate”; this suspected source error is retained.','pages':[413,414]}]
x['status']={'extraction':'reviewed','translation':'complete-supplied','verification':'visual-review'}
for s in x['sections']:
 if s['id'] in ['matins','prime','terce','sext','none','vespers','compline']:
  before=[b['id'] for b in b if b['id'] not in ['ordinary-b0001','ordinary-b0002','ordinary-b0003'] or s['id']=='matins']
  after=[v['id'] for v in next(t for t in x['sections'] if t['id']=='conclusion-of-the-hours')['blocks']]
  s['assembly']={'before':before,'after':after,'sourcePages':[413,414]}
(root/'content/overrides'/f'{id}.json').write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
