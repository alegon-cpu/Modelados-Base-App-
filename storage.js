// Guardado de proyectos como carpetas reales:
//   <carpeta base>/<proyecto>/proyecto.json
//                            /Enunciado.txt
//                            /E-R/diagrama.json (+ diagrama.svg)
//                            /Relacional/diagrama.json (+ diagrama.svg)
//                            /DED/diagrama.json (+ diagrama.svg)
//                            /SQL/script.sql y pruebas.sql
// Con versiones (el mismo ejercicio en varias versiones), todo lo de arriba menos proyecto.json va dentro de
//   <proyecto>/Version 1/…, <proyecto>/Version 2/…  y proyecto.json lleva «vers» (las notas) y «vcur» (la abierta).
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
// Lo último que se escribió en cada archivo: si no ha cambiado (ni lo ha tocado nadie desde fuera), no se vuelve a escribir.
// El autoguardado salta cada poco y antes reescribía los 4 diagramas, sus SVG y el SQL aunque solo cambiase uno.
const written = new Map();
function writeAtomic(file, data) {
  const prev = written.get(file);
  if (prev && prev.data === data) { try { if (fs.statSync(file).mtimeMs === prev.t) return; } catch (e) {} }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, data);
  fs.renameSync(tmp, file);
  try { written.set(file, { data: typeof data === 'string' ? data : null, t: fs.statSync(file).mtimeMs }); } catch (e) { written.delete(file); }
}
function readJSON(file, def) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return def; } }
const isProject = dir => fs.existsSync(path.join(dir, 'proyecto.json'));

// Los archivos de un proyecto. «read» devuelve el texto o null: así la misma lógica sirve para leer de forma normal o en paralelo
const VDIR = i => 'Version ' + (i + 1);
const cleanVers = v => Array.isArray(v) ? v.slice(0, 20).map(x => ({ nota: String((x && x.nota) || '').slice(0, 2000), ...(x && Array.isArray(x.hl) ? { hl: x.hl } : {}) })) : null;
// Versiones del proyecto según proyecto.json: null si no tiene (proyecto normal)
function versOf(meta) { const v = cleanVers(meta && meta.vers); return v && v.length ? v : null; }
const vcurOf = (meta, vers) => Math.max(0, Math.min(vers.length - 1, parseInt(meta.vcur, 10) || 0));
// Carpeta donde están el enunciado y los diagramas de la versión abierta (o la del proyecto, si no tiene versiones)
function contentDir(dir, meta) { const v = versOf(meta); return v ? path.join(dir, VDIR(vcurOf(meta, v))) : dir; }
const contentFiles = cd => [path.join(cd, 'Enunciado.txt'), ...Object.values(SUBS).map(s => path.join(cd, s, 'diagrama.json')), path.join(cd, 'SQL', 'script.sql'), path.join(cd, 'SQL', 'pruebas.sql')];
const projFiles = dir => [path.join(dir, 'proyecto.json'), ...contentFiles(dir)];
const cleanHl = hl => hl.filter(m => m && ['ent', 'rel', 'att'].includes(m.k) && (typeof m.t === 'string' || (Number.isInteger(m.s) && Number.isInteger(m.e) && m.e > m.s))).map(m => typeof m.t === 'string' ? { t: m.t, k: m.k } : { s: m.s, e: m.e, k: m.k });
function fromFiles(folder, dir, read) {
  const json = (f, def) => { const t = read(f); if (t == null) return def; try { return JSON.parse(t); } catch (e) { return def; } };
  const meta = json(path.join(dir, 'proyecto.json'), {}) || {};
  const vers = versOf(meta), cd = contentDir(dir, meta);
  const enun = read(path.join(cd, 'Enunciado.txt')) || '';
  const p = { folder, name: meta.name || folder, created: meta.created || 0, updated: meta.updated || 0, enun };
  if (meta.act && typeof meta.act === 'object') p.act = meta.act;
  if (typeof meta.icon === 'string' && meta.icon.length <= 8) p.icon = meta.icon;
  if (vers) {
    p.vcur = vcurOf(meta, vers);
    p.vers = vers.map((v, i) => ({ nota: v.nota, ...(i !== p.vcur && v.hl ? { hl: v.hl } : {}) }));
    // los enunciados de las otras versiones: la app avisa si son exactamente iguales
    p.vens = vers.map((v, i) => i === p.vcur ? null : (read(path.join(dir, VDIR(i), 'Enunciado.txt')) || ''));
    if (Array.isArray(vers[p.vcur].hl)) p.hl = cleanHl(vers[p.vcur].hl);
  } else if (Array.isArray(meta.hl)) p.hl = cleanHl(meta.hl);
  for (const [k, s] of Object.entries(SUBS)) {
    const v = json(path.join(cd, s, 'diagrama.json'), null);
    p[k] = v && typeof v === 'object' ? v : EMPTY[k]();
  }
  p.sql = read(path.join(cd, 'SQL', 'script.sql')) || '';
  p.test = read(path.join(cd, 'SQL', 'pruebas.sql')) || '';
  return p;
}
function load(base, folder) {
  const dir = inside(base, folder);
  return fromFiles(folder, dir, f => { try { return fs.readFileSync(f, 'utf8'); } catch (e) { return null; } });
}
// Igual que load, pero lee los archivos en paralelo sin bloquear la app (se usa al listar todos los proyectos al arrancar)
async function loadAsync(base, folder) {
  const dir = inside(base, folder);
  const meta = await fs.promises.readFile(path.join(dir, 'proyecto.json'), 'utf8').then(JSON.parse).catch(() => ({}));
  const vers = versOf(meta);
  const files = [path.join(dir, 'proyecto.json'), ...contentFiles(contentDir(dir, meta)), ...(vers ? vers.map((v, i) => path.join(dir, VDIR(i), 'Enunciado.txt')) : [])];
  const txt = await Promise.all(files.map(f => fs.promises.readFile(f, 'utf8').catch(() => null)));
  const m = new Map(files.map((f, i) => [f, txt[i]]));
  return fromFiles(folder, dir, f => m.has(f) ? m.get(f) : null);
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
async function listAsync(base) {
  const ps = await Promise.all(walk(base).projects.map(f => loadAsync(base, f)));
  return ps.sort((a, b) => (a.created || 0) - (b.created || 0) || a.name.localeCompare(b.name));
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
  const root = inside(base, p.folder);
  const hl = Array.isArray(p.hl) && p.hl.length ? p.hl : null;
  let vers = cleanVers(p.vers), vcur = 0;
  const dmeta = readJSON(path.join(root, 'proyecto.json'), {}), disk = versOf(dmeta);
  // un proyecto que ya tiene versiones nunca se vuelve a guardar «sin versiones» (p. ej. desde una copia antigua en memoria)
  if ((!vers || !vers.length) && disk) { vers = disk.map(d => ({ ...d })); p = { ...p, vcur: vcurOf(dmeta, disk) }; }
  if (vers && vers.length) {
    // la lista de versiones manda la del disco (por si se ha añadido o borrado una desde otra ventana); las notas, las de la app
    if (disk && disk.length !== vers.length) vers = disk.map((d, i) => vers[i] ? { ...d, nota: vers[i].nota } : d);
    vcur = Math.max(0, Math.min(vers.length - 1, parseInt(p.vcur, 10) || 0));
    vers = vers.map((v, i) => { const o = { nota: v.nota }; const h = i === vcur ? hl : (disk && disk[i] && disk[i].hl) || v.hl; if (h && h.length) o.hl = h; return o; });
  } else vers = null;
  writeAtomic(path.join(root, 'proyecto.json'), JSON.stringify(Object.assign({ app: 'modelado-bases', version: 2, name: p.name, created: p.created, updated: p.updated }, p.act ? { act: p.act } : {}, !vers && hl ? { hl } : {}, vers ? { vers, vcur } : {}, typeof p.icon === 'string' && p.icon ? { icon: p.icon } : {}), null, 2));
  if (vers) vers.forEach((v, i) => { const f = path.join(root, VDIR(i), 'Cambios.txt'); if (v.nota.trim()) writeAtomic(f, v.nota); else if (fs.existsSync(f)) writeAtomic(f, ''); });
  const dir = vers ? path.join(root, VDIR(vcur)) : root;
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
// ---- Versiones de un mismo ejercicio ----
const CONTENT = ['Enunciado.txt', ...Object.values(SUBS), 'SQL'];
// Crea otra versión copiando la que está abierta. Si el proyecto aún no tenía versiones, lo que había pasa a «Version 1».
function addVersion(base, folder) {
  const root = inside(base, folder), mf = path.join(root, 'proyecto.json');
  const meta = readJSON(mf, {});
  let vers = versOf(meta);
  if (!vers) {
    const v1 = path.join(root, VDIR(0));
    fs.mkdirSync(v1, { recursive: true });
    for (const n of CONTENT) { const s = path.join(root, n); if (fs.existsSync(s)) fs.renameSync(s, path.join(v1, n)); }
    vers = [{ nota: '', ...(Array.isArray(meta.hl) && meta.hl.length ? { hl: meta.hl } : {}) }];
    delete meta.hl; meta.vcur = 0;
  }
  if (vers.length >= 20) throw new Error('Como mucho 20 versiones.');
  const from = path.join(root, VDIR(vcurOf(meta, vers))), n = vers.length, to = path.join(root, VDIR(n));
  if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true, filter: s => !s.endsWith('.tmp') && path.basename(s) !== 'Cambios.txt' });
  const cur = vers[vcurOf(meta, vers)];
  vers.push({ nota: '', ...(cur.hl ? { hl: cur.hl } : {}) });
  meta.vers = vers; meta.vcur = n; meta.updated = Date.now();
  writeAtomic(mf, JSON.stringify(meta, null, 2));
  return load(base, folder);
}
function setVersion(base, folder, i) {
  const mf = path.join(inside(base, folder), 'proyecto.json'), meta = readJSON(mf, {}), vers = versOf(meta);
  if (!vers) throw new Error('Este proyecto no tiene versiones.');
  meta.vcur = Math.max(0, Math.min(vers.length - 1, parseInt(i, 10) || 0));
  writeAtomic(mf, JSON.stringify(meta, null, 2));
  return load(base, folder);
}
// Copia una parte (bo, er, rel, ded, sql, enun) de la versión abierta a otra versión: sustituye la que tuviera
function sendToVersion(base, folder, k, i, data) {
  const root = inside(base, folder), meta = readJSON(path.join(root, 'proyecto.json'), {}), vers = versOf(meta);
  i = parseInt(i, 10);
  if (!vers || !(i >= 0 && i < vers.length) || i === vcurOf(meta, vers)) throw new Error('Esa versión no existe.');
  const vd = path.join(root, VDIR(i));
  if (SUBS[k]) {
    const v = data && typeof data === 'object' ? data : EMPTY[k]();
    writeAtomic(path.join(vd, SUBS[k], 'diagrama.json'), JSON.stringify(v, null, 1));
    const svg = path.join(vd, SUBS[k], 'diagrama.svg'); if (fs.existsSync(svg)) fs.unlinkSync(svg); // se vuelve a hacer al guardar esa versión
  } else if (k === 'sql') writeAtomic(path.join(vd, 'SQL', 'script.sql'), String(data || ''));
  else if (k === 'enun') writeAtomic(path.join(vd, 'Enunciado.txt'), String(data || ''));
  else throw new Error('No se puede enviar eso.');
  return true;
}
// Borra una versión (su carpeta va a la papelera desde main.js) y renumera las siguientes
function dropVersion(base, folder, i, trash) {
  const root = inside(base, folder), mf = path.join(root, 'proyecto.json'), meta = readJSON(mf, {}), vers = versOf(meta);
  i = parseInt(i, 10);
  if (!vers || vers.length < 2 || !(i >= 0 && i < vers.length)) throw new Error('No se puede borrar la única versión.');
  const tmp = path.join(root, '.borrando-' + Date.now());
  fs.renameSync(path.join(root, VDIR(i)), tmp);
  for (let j = i + 1; j < vers.length; j++) fs.renameSync(path.join(root, VDIR(j)), path.join(root, VDIR(j - 1)));
  const cur = vcurOf(meta, vers);
  vers.splice(i, 1);
  meta.vers = vers; meta.vcur = cur > i ? cur - 1 : cur === i ? Math.max(0, i - 1) : cur; meta.updated = Date.now();
  writeAtomic(mf, JSON.stringify(meta, null, 2));
  return { tmp, p: load(base, folder) };
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
module.exports = { addVersion, setVersion, sendToVersion, dropVersion, SUBS, safeName, inside, list, listAsync, loadAsync, groups, mkGroup, move, renameGroup, parentOf, load, save, create, rename, duplicate, importDir, importZip, exportZip };
