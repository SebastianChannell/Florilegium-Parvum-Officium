import json
from pathlib import Path
root=Path(__file__).resolve().parents[2];id='little-office-of-the-holy-ghost';x=json.load(open(root/'content/offices'/f'{id}.json'))
t={
'ordinary':[
'May the grace of the Holy Ghost illumine our senses and our hearts. Amen.',
'℣. O Lord, Thou shalt open my lips.',
'℟. And my mouth shall declare Thy praise.',
'℣. Convert us, O God our Saviour.',
'℟. And turn away Thine anger from us.',
'℣. O God, come to my assistance.',
'℟. O Lord, make haste to help me.',
'℣. Glory be to the Father. Alleluia.',
'From Septuagesima until Easter, instead of Alleluia is said: Praise be to Thee, O Lord, King of everlasting glory.'
],
'matins':['May the grace of the Holy Ghost be given unto us,\nBy which the Virgin of virgins was overshadowed,\nWhen by the holy Angel she was greeted.\nThe Word was made flesh; the Virgin became fruitful.'],
'prime':['Of the Virgin Mary Christ was born;\nCrucified, dead, and buried;\nRising again, He was shown unto the disciples,\nAnd, while they beheld Him, was lifted up into heaven.'],
'terce':['God sent His Holy Spirit,\nOn the day of Pentecost He strengthened the Apostles,\nAnd with fiery tongues He set them aflame;\nHe refused to leave them as orphans.'],
'sext':['Then they received the sevenfold grace,\nWhereby they understood all tongues;\nThey went forth unto the diverse regions of the world,\nAnd then preached the Catholic faith.'],
'none':['The Spirit was called the Paraclete,\nThe Gift of God, charity, a quickened fount,\nSpiritual anointing, burning fire,\nSevenfold grace, and a gift of grace.'],
'vespers':['May the Finger of the right hand of God, spiritual power,\nDefend us and deliver us from all evils,\nThat the infernal demon may do us no harm;\nMay He protect and nourish us, and cherish us beneath His wings.'],
'compline':['May the Spirit, the Paraclete, deign to help us,\nTo direct and illumine our steps,\nThat, when God shall come to judge all men,\nHe may deign to call us all unto His right hand.'],
'conclusion':[
'Ant. Come, Holy Ghost, fill the hearts of Thy faithful, and kindle in them the fire of Thy love.',
'℣. Send forth Thy Spirit, and they shall be created.',
'℟. And Thou shalt renew the face of the earth.',
'Let us pray,',
'May the power of the Holy Ghost be with us, we beseech Thee, O Lord, both mercifully to cleanse our hearts and to defend us from all adversity. Through our Lord.'
],
'commendatio':['These canonical Hours I have said with devotion,\nUnto Thee, O Holy Ghost, with pious intent,\nThat Thou mayest visit us with Thine inspiration,\nAnd that we may live for ever in the realm of heaven.','Amen.']
}
for s in x['sections']:
 assert len(s['blocks'])==len(t[s['id']])
 for b,en in zip(s['blocks'],t[s['id']]):
  b['english']=en;b['translation']={'kind':'prepared','preparedFor':'Sacrum Florilegium','sourcePages':b['sourcePages'],'review':'editorial-review-complete'};b['alignment']='reviewed';b['verification']='visual-review'
  if s['id'] in ['matins','prime','terce','sext','none','vespers','compline']:
   b['poetry']=True
# Do not silently alter the malformed reading visibly printed by the PDF.
next(s for s in x['sections'] if s['id']=='prime')['blocks'][0]['verification']='source-reading-pending'
x['translationNotice']='English translation prepared for Sacrum Florilegium; not supplied in the source PDF.'
x['status']={'extraction':'reviewed','translation':'complete-prepared-reading-pending','verification':'source-reading-pending'}
x['editorialNotes']=[{'text':'At Prime the source visibly prints “ccelos.” The English “heaven” is an explicitly conjectural reading of that word; the source spelling remains unchanged. At None “fons vivificatus” is rendered literally as “a quickened fount.” The source abbreviations “Gloria Patri” and “Per Dominum” are retained as abbreviations.','pages':[90]}]
(root/'content/overrides'/f'{id}.json').write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
