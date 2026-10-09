import json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
id='little-office-of-the-most-holy-trinity'
x=json.loads((root/'content/offices'/f'{id}.json').read_text())
translations={
'ordinary':[
'Blessed be the holy and undivided Trinity, now and always, and unto infinite ages of ages. Amen.',
'At Matins.',
'℣. O Lord, Thou shalt open my lips.',
'℟. And my mouth shall declare Thy praise.',
'At Compline.',
'℣. Convert us, O God our Saviour.',
'℟. And turn away Thine anger from us.',
'At all the Hours.',
'℣. O God, come to my assistance.',
'℟. O Lord, make haste to help me.',
'℣. Glory be to the Father, and to the Son, and to the Holy Ghost.',
'℟. As it was in the beginning, is now, and ever shall be, world without end. Amen. Alleluia.',
'From Septuagesima until Easter, instead of Alleluia, is said:',
'Praise be to Thee, O Lord, King of everlasting glory.'
],
'matins':[
'Hymn',
'O blessed Light, O Trinity,\nAnd sovereign Unity,\nNow the fiery sun withdraweth;\nPour Thy light into our hearts.',
'Ant. Blessed be the holy Trinity, Creator and Ruler of all things, holy and undivided, now and always, and unto infinite ages of ages. Amen.'
],
'prime':[
'Hymn',
'The rising morning star shineth forth,\nAnd proclaimeth the scattered light;\nThe darkness of the nights falleth away;\nMay holy light illumine us.',
'Ant. Thanks be to Thee, O God, thanks be to Thee, true and one Trinity, one and supreme Godhead, holy and one Unity.'
],
'terce':[
'Hymn',
'O God of highest clemency,\nAnd Maker of the fabric of the world,\nOne in power,\nAnd Three in Persons.',
'Ant. Thee we invoke, Thee we praise, Thee we adore, our hope, our honour; deliver us, give us life, O blessed Trinity.'
],
'sext':[
'Hymn',
'Give Thy right hand to those who arise,\nThat a sober mind may rise up,\nBurning, and in praise of God\nRendering the thanks that are due.',
'Ant. The Father is charity, the Son is grace, the Holy Ghost is communion. The Father is truth, the Son is truth, the Holy Ghost is truth. The Father and the Son and the Holy Ghost are one substance, O blessed Trinity.'
],
'none':[
'Hymn',
'Thou, Unity of the Trinity,\nWho rulest the world with might,\nAttend to the song of praise\nWhich we sing as we keep watch.',
'Ant. To Thee be praise, to Thee be glory, to Thee be thanksgiving unto everlasting ages: and blessed be the name of Thy glory, holy and worthy of praise, exalted above all unto the ages, O blessed Trinity.'
],
'vespers':[
'Hymn',
'Thee in the morning with a song of praise,\nThee in the evening we beseech;\nMay our humble praise\nLaud Thee throughout all ages.',
'Ant. Thee, God the Father unbegotten, Thee, the only-begotten Son, Thee, the Holy Ghost the Paraclete, the holy and undivided Trinity, with our whole heart and mouth we confess, praise and bless; to Thee be glory unto the ages.'
],
'compline':[
'Hymn',
'Glory be to Thee, O Trinity,\nEqual, one Godhead;\nBoth before all ages,\nAnd now, and for ever.',
'Ant. Glory be to the Father, who created us; glory be to the Son, who redeemed us; glory be to the Holy Ghost, who sanctified us; glory be to the supreme and undivided Trinity, our God, world without end.'
],
'conclusion-of-the-hours':[
'℣. Let us bless the Father and the Son, with the Holy Ghost.',
'℟. Let us praise and exalt Him above all for ever.',
'Let us pray,',
'Almighty and everlasting God, who hast granted Thy servants, in the confession of the true faith, to acknowledge the glory of the eternal Trinity, and in the power of Thy Majesty to adore the Unity, we beseech Thee that, by steadfastness in this same faith, we may ever be defended from all adversity. Through our Lord.'
],
'commendatio':[
'These canonical Hours I have said with devotion,\nO holy Trinity, for Thy sake,\nThat Thou mayest be present with me in the agony of death,\nAnd that we may reign for ever in the realm of heaven. Amen.'
]
}
for s in x['sections']:
 assert len(s['blocks'])==len(translations[s['id']]),s['id']
 for b,en in zip(s['blocks'],translations[s['id']]):
  b['english']=en
  b['translation']={'kind':'prepared','preparedFor':'Sacrum Florilegium','sourcePages':b['sourcePages'],'review':'editorial-review-complete'}
  b['alignment']='reviewed'; b['verification']='visual-review'
  if b['source']=='Hymnus':b['type']='heading'
# Restore hymn and Commendatio lines from visual inspection of the PDF.
poetry={
'matins-b0002':'O lux beata Trinitas,\nEt principalis unitas,\nJam sol recedit igneus;\nInfunde lumen cordibus.',
'prime-b0002':'Ortus refulget lucifer,\nSparsamque lucem nuntiat;\nCadunt tenebrae noctium,\nLux sancta nos illuminet.',
'terce-b0002':'Summae Deus clementiae,\nMundi que factor machinae,\nUnus potentialiter,\nTrinusque personaliter.',
'sext-b0002':'Da dexteram surgentibus,\nExurgat ut mens sobria,\nFlagrans et in laudem Dei\nGrates rependat debitas.',
'none-b0002':'Tu, Trinitatis unitas,\nOrbem potenter quae regis,\nAttende laudis canticum\nQuod excubantes psallimus.',
'vespers-b0002':'Te mane laudum carmine,\nTe deprecamur vespere,\nTe nostra supplex gloria\nPer cuncta laudet saecula.',
'compline-b0002':'Gloria tibi, Trinitas,\nAequalis, una Deitas;\nEt ante omnia saecula,\nEt nunc, et in perpetuum.',
'commendatio-b0001':'Has horas canonicas cum devotione.\nDixi, sancta Trinitas, tui ratione,\nUt sis mihi praesens mortis in agone.\nEt regnemus jugiter in coeli regione. Amen.'
}
for s in x['sections']:
 for b in s['blocks']:
  if b['id'] in poetry:b['source']=poetry[b['id']];b['poetry']=True
x['translationNotice']='English translation prepared for Sacrum Florilegium; not supplied in the source PDF.'
x['status']={'extraction':'reviewed','translation':'complete-prepared','verification':'visual-review'}
x['editorialNotes']=[{'text':'The source prints “Mundi que” in the hymn at Terce; that spacing is retained. The collect ends with the abbreviated “Per Dominum” in the PDF.','pages':[21,22]}]
x['variants']=[{'id':'season','title':'Seasonal form','options':[{'id':'ordinary','title':'Alleluia'},{'id':'septuagesima','title':'Septuagesima until Easter'}],'default':'ordinary','sourcePages':[21]}]
blocks={b['id']:b for s in x['sections'] for b in s['blocks']}
blocks['ordinary-b0012']['forms']={'season':{'septuagesima':{'source':blocks['ordinary-b0012']['source'].replace(' Alleluia.',''),'english':blocks['ordinary-b0012']['english'].replace(' Alleluia.','')}}}
blocks['ordinary-b0014']['when']={'season':['septuagesima']}
for s in x['sections']:
 if s['id'] in ['matins','prime','terce','sext','none','vespers','compline']:
  before=['ordinary-b0001']
  if s['id']=='matins':before += ['ordinary-b0002','ordinary-b0003','ordinary-b0004']
  if s['id']=='compline':before += ['ordinary-b0005','ordinary-b0006','ordinary-b0007']
  before += [f'ordinary-b{n:04}' for n in range(8,15)]
  s['assembly']={'before':before,'after':[b['id'] for b in next(v for v in x['sections'] if v['id']=='conclusion-of-the-hours')['blocks']], 'sourcePages':[21,22]}
(root/'content/overrides'/f'{id}.json').write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
