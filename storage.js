// Guardado de proyectos como carpetas reales:
//   <carpeta base>/<proyecto>/proyecto.json
//                            /Enunciado.txt
//                            /E-R/diagrama.json (+ diagrama.svg)
//                            /Relacional/diagrama.json (+ diagrama.svg)
//                            /DED/diagrama.json (+ diagrama.svg)
//                            /SQL/script.sql y pruebas.sql
const fs = require('fs');
const path = require('path');

const SUBS = { er: 'E-R', rel: 'Relacional', ded: 'DED' };
const EMPTY = { er: () => ({ nodes: [], links: [] }), rel: () => ({ t: [] }), ded: () => ({ t: [] }) };
const RESERVED = /^(con|prn|aux|nul|com\d|lpt\d)$/i;

function safeName(n) {
  let s = String(n || '').replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-').replace(/\s+/g, ' ').trim().replace(/[. ]+$/, '');
  if (!s) s = 'proyecto';
  if (RESERVED.test(s)) s = '_' + s;
  return s.slice(0, 80);
}
function inside(base, folder) {
  const f = String(folder || '');
  if (!f || f.includes('/') || f.includes('\\') || f === '.' || f === '..') throw new Error('Nombre de carpeta no válido');
  const full = path.join(base, f);
  if (path.dirname(full) !== path.resolve(base)) throw new Error('Ruta fuera de la carpeta de proyectos');
  return full;
}
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
  for (const [k, s] of Object.entries(SUBS)) {
    const v = readJSON(path.join(dir, s, 'diagrama.json'), null);
    p[k] = v && typeof v === 'object' ? v : EMPTY[k]();
  }
  try { p.sql = fs.readFileSync(path.join(dir, 'SQL', 'script.sql'), 'utf8'); } catch (e) { p.sql = ''; }
  try { p.test = fs.readFileSync(path.join(dir, 'SQL', 'pruebas.sql'), 'utf8'); } catch (e) { p.test = ''; }
  return p;
}
function list(base) {
  fs.mkdirSync(base, { recursive: true });
  return fs.readdirSync(base, { withFileTypes: true })
    .filter(d => d.isDirectory() && isProject(path.join(base, d.name)))
    .map(d => load(base, d.name))
    .sort((a, b) => (a.created || 0) - (b.created || 0) || a.name.localeCompare(b.name));
}
function save(base, p, svgs) {
  const dir = inside(base, p.folder);
  writeAtomic(path.join(dir, 'proyecto.json'), JSON.stringify({ app: 'modelado-bases', version: 2, name: p.name, created: p.created, updated: p.updated }, null, 2));
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
function create(base, name) {
  fs.mkdirSync(base, { recursive: true });
  const folder = unique(base, name);
  const now = Date.now();
  const p = { folder, name, created: now, updated: now, enun: '', sql: '', test: '', er: EMPTY.er(), rel: EMPTY.rel(), ded: EMPTY.ded() };
  save(base, p, null);
  return p;
}
function rename(base, folder, name) {
  const from = inside(base, folder);
  const nf = unique(base, name, folder);
  if (nf !== folder) {
    if (nf.toLowerCase() === folder.toLowerCase()) { // solo cambia mayúsculas (Windows)
      const tmp = from + '.renombrando';
      fs.renameSync(from, tmp); fs.renameSync(tmp, path.join(base, nf));
    } else fs.renameSync(from, path.join(base, nf));
  }
  const f = path.join(base, nf, 'proyecto.json');
  const m = readJSON(f, {}); m.name = name; m.updated = Date.now();
  writeAtomic(f, JSON.stringify(m, null, 2));
  return nf;
}
function duplicate(base, folder) {
  const src = load(base, folder);
  const name = src.name + ' (copia)';
  const nf = unique(base, name);
  fs.cpSync(inside(base, folder), path.join(base, nf), { recursive: true });
  const f = path.join(base, nf, 'proyecto.json');
  const m = readJSON(f, {}); m.name = name; m.created = m.updated = Date.now();
  writeAtomic(f, JSON.stringify(m, null, 2));
  return load(base, nf);
}
function projectRoots(dir) {
  if (isProject(dir)) return [dir];
  return fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory() && isProject(path.join(dir, d.name))).map(d => path.join(dir, d.name));
}
function importDir(base, dir) {
  const roots = projectRoots(dir);
  const out = [];
  for (const r of roots) {
    const meta = readJSON(path.join(r, 'proyecto.json'), {});
    const nf = unique(base, meta.name || path.basename(r));
    fs.cpSync(r, path.join(base, nf), { recursive: true, filter: s => !s.endsWith('.tmp') });
    out.push(nf);
  }
  return out;
}
function exportZip(base, folders, dest) {
  const AdmZip = require('adm-zip');
  const z = new AdmZip();
  for (const f of folders) z.addLocalFolder(inside(base, f), f, n => !n.endsWith('.tmp'));
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
module.exports = { SUBS, safeName, inside, list, load, save, create, rename, duplicate, importDir, importZip, exportZip };
