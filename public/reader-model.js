export const MODES = new Set(['parallel', 'stacked', 'source', 'english']);
export function resolveSelection(catalog, requested = {}) {
  const office = catalog.find(o => o.id === requested.office) || catalog[0];
  if (!office || !office.sections.length) throw new Error('The office catalog is empty.');
  const section = office.sections.find(s => s.id === requested.section) || office.sections[0];
  return { office: office.id, section: section.id };
}
export function resolveVariants(office, requested = {}) {
  return Object.fromEntries((office.variants || []).map(v => [v.id,
    v.options.some(o => o.id === requested[v.id]) ? requested[v.id] : v.default]));
}
export function sectionBlocks(office, sectionId, variants = {}) {
  const section = office.sections.find(s => s.id === sectionId);
  if (!section) throw new Error('Section is absent from this office.');
  const index = new Map(office.sections.flatMap(s => s.blocks.map(b => [b.id, b])));
  const assembly = section.assembly || {};
  const blocks = [...(assembly.before || []).map(id => index.get(id)), ...section.blocks,
    ...(assembly.after || []).map(id => index.get(id))];
  function expand(block, ancestors = []) {
    if (!block) throw new Error('Unresolved prayer reference.');
    const targets = block.referenceExpansion?.targets;
    if (!targets) return [block];
    if (ancestors.includes(block.id)) throw new Error('Circular prayer reference.');
    return [{ ...block, type: 'rubric' }, ...targets.flatMap(id =>
      expand(index.get(id), [...ancestors, block.id]).map(b => ({ ...b,
        id: `${block.id}--${b.id}`, expandedFrom: b.expandedFrom || b.id })))];
  }
  return blocks.flatMap(b => expand(b)).filter(b => {
    if (!b) throw new Error('Unresolved prayer reference.');
    return !b.when || Object.entries(b.when).every(([id, values]) => values.includes(variants[id]));
  }).map(block => {
    const b = { ...block };
    for (const [id, value] of Object.entries(variants)) {
      if (b.forms?.[id]?.[value]) Object.assign(b, b.forms[id][value]);
    }
    return b;
  });
}
export function readRoute(hash) {
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  return { office: p.get('office'), section: p.get('section'), variants: Object.fromEntries(
    [...p].filter(([k]) => k.startsWith('v-')).map(([k,v]) => [k.slice(2),v])) };
}
export function writeRoute(selection, variants = {}) {
  const p = new URLSearchParams(selection);
  for (const [k,v] of Object.entries(variants)) p.set(`v-${k}`,v);
  return `#${p}`;
}
