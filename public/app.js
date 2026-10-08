import { MODES, resolveSelection, resolveVariants, sectionBlocks, readRoute, writeRoute } from './reader-model.js';

const $ = id => document.getElementById(id);
const STORE = 'parvum-officium-v1';
let catalog = [], selection, currentOffice, variants = {}, request = 0;
let mode = 'parallel', fontSize = 18, remembered = {};
try { remembered = JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch { /* Reading works without storage. */ }
if (MODES.has(remembered.mode)) mode = remembered.mode;
if (Number.isFinite(remembered.fontSize)) fontSize = Math.min(28, Math.max(16, remembered.fontSize));
const cache = new Map();

function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function message(id, text) {
  $(id).textContent = text || '';
  $(id).hidden = !text;
}
function persist() {
  try { localStorage.setItem(STORE, JSON.stringify({ ...selection, variants, mode, fontSize })); } catch { /* Private browsers may deny storage. */ }
}
function setRoute(replace = false) {
  const hash = writeRoute(selection, variants);
  if (location.hash !== hash) history[replace ? 'replaceState' : 'pushState'](null, '', hash);
  persist();
}
function officeOptions() {
  const query = $('officeSearch').value.trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const category = $('categorySelect').value;
  const matches = catalog.filter(o => (!category || o.category === category) &&
    `${o.title} ${o.category} ${o.sourceLanguage}`.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().includes(query));
  $('officeSelect').replaceChildren();
  for (const cat of [...new Set(matches.map(o => o.category))]) {
    const group = el('optgroup'); group.label = cat;
    for (const office of matches.filter(o => o.category === cat)) {
      const option = el('option', office.title); option.value = office.id;
      group.append(option);
    }
    $('officeSelect').append(group);
  }
  if (selection && matches.some(o => o.id === selection.office)) $('officeSelect').value = selection.office;
  else $('officeSelect').selectedIndex = -1;
  $('officeSelect').disabled = !matches.length;
  $('resultCount').textContent = `${matches.length} ${matches.length === 1 ? 'office' : 'offices'}`;
}
function cell(text, language, className, prepared = false) {
  const node = el('div', undefined, `prayer-cell ${className}`);
  node.lang = language === 'Latin' ? 'la' : 'en';
  node.append(el('span', language, 'prayer-label'), document.createTextNode(text));
  if (prepared && currentOffice?.translationScope === 'marked') {
    const marker = el('span', '†', 'prepared-mark');
    marker.title = 'English prepared for Sacrum Florilegium; not supplied in the source PDF.';
    marker.setAttribute('aria-label', marker.title);
    node.append(marker);
  }
  return node;
}
function renderNotes(office) {
  $('officeNotes').replaceChildren();
  for (const note of office.introductoryNotes || []) {
    const row = el('div', undefined, `note-row${note.english ? ' bilingual' : ''}`);
    row.append(cell(note.text, note.language || office.sourceLanguage, 'source-cell'));
    if (note.english) row.append(cell(note.english, 'English', 'english-cell', note.translation?.kind === 'prepared'));
    $('officeNotes').append(row);
  }
  for (const note of office.editorialNotes || []) $('officeNotes').append(el('p', `Website editorial note: ${note.text}`, 'editorial-note'));
  $('notesDetails').hidden = !$('officeNotes').childNodes.length;
}
function renderVariants(office) {
  $('variantControls').replaceChildren();
  for (const v of office.variants || []) {
    const label = el('label'); label.append(el('span', v.title));
    const select = el('select'); select.setAttribute('aria-label', v.title);
    for (const option of v.options) { const node = el('option', option.title); node.value = option.id; select.append(node); }
    select.value = variants[v.id];
    select.addEventListener('change', () => { variants[v.id] = select.value; renderSection(); setRoute(); });
    label.append(select); $('variantControls').append(label);
  }
}
function renderSection(focus = false) {
  const office = currentOffice;
  const section = office.sections.find(s => s.id === selection.section);
  const blocks = sectionBlocks(office, section.id, variants);
  const englishSource = office.sourceLanguage === 'English';
  $('reader').dataset.layout = englishSource ? 'source' : mode;
  $('reader').hidden = false;
  $('sectionTitle').textContent = section.title;
  $('sectionSelect').value = section.id;
  for (const button of $('sectionNav').children) {
    if (button.dataset.section === section.id) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  }
  $('languageLabels').replaceChildren();
  const languages = englishSource ? ['English · source text'] : mode === 'source' ? [office.sourceLanguage] : mode === 'english' ? ['English'] : [office.sourceLanguage,'English'];
  $('languageLabels').style.gridTemplateColumns = languages.length === 1 ? '1fr' : '';
  for (const language of languages) $('languageLabels').append(el('span',language));
  $('prayerBlocks').replaceChildren();
  for (const b of blocks) {
    if (mode === 'english' && !englishSource && !b.english) continue;
    const row = el('div', undefined, `prayer-row ${b.type}${englishSource || !b.english ? ' single' : ''}`);
    row.dataset.block = b.id;
    row.append(cell(b.source, office.sourceLanguage, `source-cell${englishSource ? ' english-source' : ''}`));
    if (!englishSource && b.english) row.append(cell(b.english, 'English', 'english-cell', b.translation?.kind === 'prepared'));
    $('prayerBlocks').append(row);
  }
  const missing = englishSource ? 0 : blocks.filter(b => !b.english).length;
  const uncertain = blocks.some(b => b.alignment === 'candidate');
  const sourceUncertain = blocks.some(b => b.verification === 'source-reading-pending');
  const messages = [];
  if (missing) messages.push(mode === 'english' ? 'English is not yet complete for this section. Choose Source only to read the source text.' : 'English is not yet complete for this section. Passages without English appear in a single source column.');
  if (uncertain) messages.push('Bilingual correspondence in this section is awaiting editorial review.');
  if (sourceUncertain) messages.push('This section contains an uncertain reading in the source PDF. See the editorial notes before using its provisional English.');
  message('sectionStatus', messages.join(' '));
  const unpaired = (office.unpairedEnglish || []).filter(s => s.section === section.id);
  $('unpairedDetails').hidden = !unpaired.length;
  $('unpairedEnglish').replaceChildren();
  for (const run of unpaired) for (const b of run.blocks) $('unpairedEnglish').append(el('p', b.text, 'unpaired-block'));
  const index = office.sections.indexOf(section);
  $('previousSection').disabled = index === 0;
  $('nextSection').disabled = index === office.sections.length - 1;
  document.title = `${section.title} · ${office.title} · Parvum Officium`;
  $('status').textContent = `${office.title} · ${section.title}`;
  if (focus) { $('reader').focus({ preventScroll: true }); $('reader').scrollIntoView({ block: 'start' }); }
}
async function choose(requested, { replace = false, focus = false } = {}) {
  selection = resolveSelection(catalog, requested);
  const serial = ++request;
  $('reader').hidden = true;
  $('status').textContent = 'Opening the office…';
  officeOptions();
  try {
    let office = cache.get(selection.office);
    if (!office) {
      const response = await fetch(`./content/offices/${encodeURIComponent(selection.office)}.json`);
      if (!response.ok) throw new Error(`The office could not be loaded (${response.status}).`);
      office = await response.json();
      if (office.id !== selection.office) throw new Error('The requested office does not match its content file.');
      cache.set(office.id, office);
      if (cache.size > 3) cache.delete(cache.keys().next().value);
    }
    if (serial !== request) return;
    currentOffice = office;
    selection = resolveSelection([office], selection);
    variants = resolveVariants(office, requested.variants || {});
    $('officeCategory').textContent = office.category;
    $('officeTitle').textContent = office.title;
    message('translationNotice', office.translationNotice ? `${office.translationNotice}${office.translationScope === 'marked' ? ' This notice applies only to passages marked †; other English is supplied by the PDF.' : ''}` : '');
    message('officeStatus', office.status.verification !== 'visual-review' ? 'Draft transcription. This office is awaiting text, translation, or correspondence review. Consult the source PDF for authoritative readings.' : '');
    renderNotes(office);
    const [start,end] = office.source.pdfPages;
    $('sourcePages').textContent = `PDF and printed pages ${start}${start !== end ? `–${end}` : ''}`;
    $('sourceLink').href = `./source/book.pdf#page=${start}`;
    $('sectionSelect').replaceChildren(); $('sectionNav').replaceChildren();
    for (const s of office.sections) {
      const option = el('option', s.title); option.value = s.id; $('sectionSelect').append(option);
      const button = el('button', s.title); button.type = 'button'; button.dataset.section = s.id;
      button.addEventListener('click', () => chooseSection(s.id)); $('sectionNav').append(button);
    }
    renderVariants(office); renderSection(focus); setRoute(replace);
  } catch (error) {
    if (serial !== request) return;
    $('reader').hidden = true;
    $('status').textContent = `${error.message} Reload the page to try again, or open the source PDF.`;
  }
}
function chooseSection(section, focus = false) {
  selection = resolveSelection([currentOffice], { office:currentOffice.id, section });
  renderSection(focus); setRoute();
}
$('officeSearch').addEventListener('input', officeOptions);
document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  $('reader').focus({preventScroll:true});
  $('reader').scrollIntoView({block:'start'});
});
$('categorySelect').addEventListener('change', officeOptions);
$('officeSelect').addEventListener('change', () => choose({ office:$('officeSelect').value }));
$('sectionSelect').addEventListener('change', () => chooseSection($('sectionSelect').value));
$('layoutSelect').value = mode;
$('layoutSelect').addEventListener('change', () => { mode = $('layoutSelect').value; if (currentOffice) renderSection(); persist(); });
function changeFont(delta) { fontSize = Math.max(16, Math.min(28, fontSize + delta)); document.documentElement.style.setProperty('--reader-size', `${fontSize}px`); $('fontDown').disabled = fontSize === 16; $('fontUp').disabled = fontSize === 28; persist(); }
changeFont(0);
$('fontDown').addEventListener('click', () => changeFont(-1));
$('fontUp').addEventListener('click', () => changeFont(1));
for (const [id,step] of [['previousSection',-1],['nextSection',1]]) $(id).addEventListener('click', () => {
  const index = currentOffice.sections.findIndex(s => s.id === selection.section);
  const next = currentOffice.sections[index + step]; if (next) chooseSection(next.id, true);
});
$('shareButton').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href); $('status').textContent = 'Prayer link copied.'; }
  catch { $('status').textContent = `Share this prayer: ${location.href}`; }
});
addEventListener('popstate', () => { if (catalog.length) choose(readRoute(location.hash), { replace:true }); });
addEventListener('hashchange', () => { if (catalog.length && writeRoute(selection, variants) !== location.hash) choose(readRoute(location.hash), { replace:true }); });
try {
  const response = await fetch('./content/catalog.json');
  if (!response.ok) throw new Error(`The catalog could not be loaded (${response.status}).`);
  const data = await response.json(); catalog = data.offices;
  message('editionStatus', data.complete ? '' : 'Editorial preview · The full bilingual edition is still in preparation. Coverage and unresolved readings are recorded below.');
  for (const category of [...new Set(catalog.map(o => o.category))]) { const option = el('option',category); option.value = category; $('categorySelect').append(option); }
  await choose(location.hash ? readRoute(location.hash) : remembered, { replace:true });
} catch (error) { $('status').textContent = `${error.message} Open the source PDF or reload to try again.`; }
