// Guardado de proyectos como carpetas reales:
//   <carpeta base>/<proyecto>/proyecto.json
//                            /Enunciado.txt
//                            /E-R/diagrama.json (+ diagrama.svg)
//                            /Relacional/diagrama.json (+ diagrama.svg)
//                            /DED/diagrama.json (+ diagrama.svg)
//                            /SQL/script.sql y pruebas.sql
const fs = require('fs');
const path = require('path');

const SUBS = { bo: 'Boceto', er: 'E-R', rel: 'Relacional', ded: 'DED' };
const EMPTY = { bo: () => ({ nodes: [], links: [] }), er: () => ({ nodes: [], links: [] }), rel: () => ({ t: [] }), ded: () => ({ t: [] }) };
const RESERVED = /^(con|prn|aux|nul|com\d|lpt\d)$/i;

function safeName(n) {
  let s = String(n || '').replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-').replace(/\s+/g, ' ').trim().replace(/[. ]+$/, '');
  if (!s) s = 'proyecto';
  if (RESERVED.test(s)) s = '_' + s;
  return s.slice(0, 80);
}
// «folder» es una ruta relativa con «/»: «Ejercicios/Tema 1/Pizzas»
function inside(base, folder) {
  const f = String(folder || '');
  const segs = f.split('/');
  if (!f || f.includes('\\') || segs.some(s => !s || s === '.' || s === '..' || !s.trim())) throw new Error('Nombre de carpeta no válido');
  const root = path.resolve(base), full = path.resolve(root, ...segs);
  if (!full.startsWith(root + path.sep)) throw new Error('Ruta fuera de la carpeta de proyectos');
  return full;
}
const dirOf = (base, parent) => parent ? inside(base, parent) : base;
const join = (parent, name) => parent ? parent + '/' + name : name;
const parentOf = folder => { const i = String(folder).lastIndexOf('/'); return i < 0 ? '' : folder.slice(0, i); };
const leafOf = folder => String(folder).slice(String(folder).lastIndexOf('/') + 1);
function unique(base, name, except) {
  const n = safeName(name);
  let c = n, i = 2;
  while (fs.existsSync(path.join(base, c)) && !(except && c.toLowerCase() === except.toLowerCase())) c = `${n} (${i++})`;
  return c;
}
function writeAtomic(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, data);
  fs.renameSync(tmp, file);
}
function readJSON(file, def) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return def; } }
const isProject = dir => fs.existsSync(path.join(dir, 'proyecto.json'));

function load(base, folder) {
  const dir = inside(base, folder);
  const meta = readJSON(path.join(dir, 'proyecto.json'), {});
  let enun = '';
  try { enun = fs.readFileSync(path.join(dir, 'Enunciado.txt'), 'utf8'); } catch (e) {}
  const p = { folder, name: meta.name || folder, created: meta.created || 0, updated: meta.updated || 0, enun };
  if (meta.act && typeof meta.act === 'object') p.act = meta.act;
  if (typeof meta.icon === 'string' && meta.icon.length <= 8) p.icon = meta.icon;
  if (Array.isArray(meta.hl)) p.hl = meta.hl.filter(m => m && ['ent', 'rel', 'att'].includes(m.k) && (typeof m.t === 'string' || (Number.isInteger(m.s) && Number.isInteger(m.e) && m.e > m.s))).map(m => typeof m.t === 'string' ? { t: m.t, k: m.k } : { s: m.s, e: m.e, k: m.k });
  for (const [k, s] of Object.entries(SUBS)) {
    const v = readJSON(path.join(dir, s, 'diagrama.json'), null);
    p[k] = v && typeof v === 'object' ? v : EMPTY[k]();
  }
  try { p.sql = fs.readFileSync(path.join(dir, 'SQL', 'script.sql'), 'utf8'); } catch (e) { p.sql = ''; }
  try { p.test = fs.readFileSync(path.join(dir, 'SQL', 'pruebas.sql'), 'utf8'); } catch (e) { p.test = ''; }
  return p;
}
// Recorre la carpeta de proyectos: las carpetas sin proyecto.json son carpetas para agrupar (pueden ir unas dentro de otras)
function walk(base) {
  fs.mkdirSync(base, { recursive: true });
  const projects = [], groups = [];
  const go = (dir, rel, depth) => {
    let ents = [];
    try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
    for (const d of ents) {
      if (!d.isDirectory() || d.name.startsWith('.') || d.name.endsWith('.renombrando')) continue;
      const full = path.join(dir, d.name), r = join(rel, d.name);
      if (isProject(full)) projects.push(r);
      else if (depth < 8) { groups.push(r); go(full, r, depth + 1); }
    }
  };
  go(base, '', 0);
  return { projects, groups };
}
function list(base) {
  return walk(base).projects.map(f => load(base, f))
    .sort((a, b) => (a.created || 0) - (b.created || 0) || a.name.localeCompare(b.name));
}
function groups(base) { return walk(base).groups.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base', numeric: true })); }
function mkGroup(base, parent, name) {
  const pd = dirOf(base, parent), n = unique(pd, name || 'Carpeta');
  fs.mkdirSync(path.join(pd, n), { recursive: true });
  return join(parent, n);
}
// Mueve un proyecto o una carpeta dentro de otra carpeta ('' = la raíz). Devuelve la ruta nueva.
function move(base, folder, toParent) {
  const from = inside(base, folder), to = dirOf(base, toParent);
  if (path.resolve(to) === from || path.resolve(to).startsWith(from + path.sep)) throw new Error('No se puede mover una carpeta dentro de sí misma.');
  if (parentOf(folder) === (toParent || '')) return folder;
  if (toParent && isProject(to)) throw new Error('Eso es un proyecto, no una carpeta.');
  const n = unique(to, leafOf(folder));
  fs.renameSync(from, path.join(to, n));
  return join(toParent, n);
}
function renameGroup(base, g, name) {
  const from = inside(base, g), pd = path.dirname(from), n = unique(pd, name, leafOf(g));
  if (n !== leafOf(g)) {
    if (n.toLowerCase() === leafOf(g).toLowerCase()) { const tmp = from + '.renombrando'; fs.renameSync(from, tmp); fs.renameSync(tmp, path.join(pd, n)); }
    else fs.renameSync(from, path.join(pd, n));
  }
  return join(parentOf(g), n);
}
function save(base, p, svgs) {
  const dir = inside(base, p.folder);
  writeAtomic(path.join(dir, 'proyecto.json'), JSON.stringify(Object.assign({ app: 'modelado-bases', version: 2, name: p.name, created: p.created, updated: p.updated }, p.act ? { act: p.act } : {}, Array.isArray(p.hl) && p.hl.length ? { hl: p.hl } : {}, typeof p.icon === 'string' && p.icon ? { icon: p.icon } : {}), null, 2));
  writeAtomic(path.join(dir, 'Enunciado.txt'), p.enun || '');
  for (const [k, s] of Object.entries(SUBS)) {
    writeAtomic(path.join(dir, s, 'diagrama.json'), JSON.stringify(p[k] || EMPTY[k](), null, 1));
    if (svgs) {
      const f = path.join(dir, s, 'diagrama.svg');
      if (svgs[k]) writeAtomic(f, svgs[k]);
      else if (fs.existsSync(f)) fs.unlinkSync(f);
    }
  }
  const tq = path.join(dir, 'SQL', 'pruebas.sql');
  if (p.test && p.test.trim()) writeAtomic(tq, p.test);
  else if (fs.existsSync(tq)) writeAtomic(tq, '');
  const sq = path.join(dir, 'SQL', 'script.sql');
  if (p.sql && p.sql.trim()) writeAtomic(sq, p.sql);
  else if (fs.existsSync(sq)) writeAtomic(sq, '');
}
function create(base, name, parent) {
  fs.mkdirSync(base, { recursive: true });
  const folder = join(parent || '', unique(dirOf(base, parent || ''), name));
  const now = Date.now();
  const p = { folder, name, created: now, updated: now, enun: '', sql: '', test: '', er: EMPTY.er(), rel: EMPTY.rel(), ded: EMPTY.ded(), bo: EMPTY.bo() };
  save(base, p, null);
  return p;
}
function rename(base, folder, name) {
  const from = inside(base, folder), pd = path.dirname(from), leaf = leafOf(folder);
  const n = unique(pd, name, leaf);
  if (n !== leaf) {
    if (n.toLowerCase() === leaf.toLowerCase()) { // solo cambia mayúsculas (Windows)
      const tmp = from + '.renombrando';
      fs.renameSync(from, tmp); fs.renameSync(tmp, path.join(pd, n));
    } else fs.renameSync(from, path.join(pd, n));
  }
  const nf = join(parentOf(folder), n);
  const f = path.join(pd, n, 'proyecto.json');
  const m = readJSON(f, {}); m.name = name; m.updated = Date.now();
  writeAtomic(f, JSON.stringify(m, null, 2));
  return nf;
}
function duplicate(base, folder) {
  const src = load(base, folder);
  const name = src.name + ' (copia)';
  const pd = path.dirname(inside(base, folder)), leaf = unique(pd, name), nf = join(parentOf(folder), leaf);
  fs.cpSync(inside(base, folder), path.join(pd, leaf), { recursive: true });
  const f = path.join(pd, leaf, 'proyecto.json');
  const m = readJSON(f, {}); m.name = name; m.created = m.updated = Date.now();
  writeAtomic(f, JSON.stringify(m, null, 2));
  return load(base, nf);
}
function projectRoots(dir) {
  if (isProject(dir)) return [dir];
  return fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory() && isProject(path.join(dir, d.name))).map(d => path.join(dir, d.name));
}
function importDir(base, dir, parent) {
  const roots = projectRoots(dir);
  const out = [], pd = dirOf(base, parent || '');
  for (const r of roots) {
    const meta = readJSON(path.join(r, 'proyecto.json'), {});
    const leaf = unique(pd, meta.name || path.basename(r));
    fs.cpSync(r, path.join(pd, leaf), { recursive: true, filter: s => !s.endsWith('.tmp') });
    out.push(join(parent || '', leaf));
  }
  return out;
}
function exportZip(base, folders, dest) {
  const AdmZip = require('adm-zip');
  const z = new AdmZip();
  for (const f of folders) z.addLocalFolder(inside(base, f), leafOf(f), n => !n.endsWith('.tmp'));
  z.writeZip(dest);
  return dest;
}
function importZip(base, zipFile, tmpRoot) {
  const AdmZip = require('adm-zip');
  const tmp = fs.mkdtempSync(path.join(tmpRoot, 'estudio-er-'));
  try {
    const z = new AdmZip(zipFile);
    for (const e of z.getEntries()) { // evita rutas fuera de la carpeta temporal
      const target = path.resolve(tmp, e.entryName);
      if (!target.startsWith(path.resolve(tmp) + path.sep) && target !== path.resolve(tmp)) throw new Error('El .zip contiene rutas no válidas');
    }
    z.extractAllTo(tmp, true);
    return importDir(base, tmp);
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}
module.exports = { SUBS, safeName, inside, list, groups, mkGroup, move, renameGroup, parentOf, load, save, create, rename, duplicate, importDir, importZip, exportZip };
