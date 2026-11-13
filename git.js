// Sincronizar la carpeta de proyectos con un repositorio de GitHub (usa el Git instalado en el ordenador).
// Todas las operaciones van en cola, una detrás de otra.
// Desde la 2.6: al ABRIR manda lo que hay en GitHub (lo de aquí se sustituye; si había algo distinto se guarda un respaldo local)
// y al GUARDAR/CERRAR manda lo de este ordenador (se sube encima de lo que haya en GitHub).
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const LOCK = '.modelado-en-uso.json';
const IGNORE = ['*.tmp', '*.renombrando', 'desktop.ini', 'Thumbs.db', '.DS_Store', ''].join('\n');
const PC = () => { try { return os.hostname() || 'este ordenador'; } catch (e) { return 'este ordenador'; } };

let gitBin = null;
function findGit() {
  if (gitBin) return gitBin;
  const cands = ['git'];
  if (process.platform === 'win32') {
    const pf = [process.env.ProgramFiles, process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs')].filter(Boolean);
    pf.forEach(p => cands.push(path.join(p, 'Git', 'cmd', 'git.exe')));
  }
  gitBin = cands;
  return cands;
}
function run1(bin, args, cwd, timeout) {
  return new Promise(res => {
    execFile(bin, args, { cwd, timeout: timeout || 120000, windowsHide: true, maxBuffer: 32 * 1024 * 1024,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'auto', LANG: 'C', LC_ALL: 'C' } },
    (err, out, errOut) => res({ code: err ? (typeof err.code === 'number' ? err.code : -1) : 0, out: String(out || ''), err: String(errOut || (err && err.message) || ''), missing: !!(err && err.code === 'ENOENT') }));
  });
}
let chosen = null;
async function git(args, cwd, timeout) {
  if (chosen) return run1(chosen, args, cwd, timeout);
  for (const b of findGit()) {
    if (b !== 'git' && !fs.existsSync(b)) continue;
    const r = await run1(b, args, cwd, timeout);
    if (!r.missing) { chosen = b; return r; }
  }
  return { code: -1, out: '', err: 'No se encuentra Git en este ordenador. Instala «Git para Windows» desde git-scm.com y vuelve a intentarlo.', missing: true };
}
const must = async (args, cwd, timeout) => { const r = await git(args, cwd, timeout); if (r.code !== 0) throw new Error(explain(r.err || r.out)); return r; };
// Mensajes de Git en español
function explain(t) {
  t = String(t || '');
  if (/not found|ENOENT|No se encuentra Git/i.test(t)) return 'No se encuentra Git en este ordenador. Instala «Git para Windows» desde git-scm.com.';
  if (/Authentication failed|could not read Username|terminal prompts disabled|403|denied/i.test(t)) return 'GitHub no ha aceptado el inicio de sesión. Pulsa «Comprobar y conectar» e inicia sesión en la ventana de GitHub que se abre.';
  if (/Repository not found|does not appear to be a git repository|not found/i.test(t)) return 'No se encuentra ese repositorio. Revisa la dirección y que tu cuenta tenga acceso.';
  if (/Could not resolve host|unable to access|Failed to connect|timed out|Operation timed out|network/i.test(t)) return 'Sin conexión con GitHub. Se reintentará más tarde; tus cambios están a salvo en este ordenador.';
  return t.split('\n').filter(Boolean).slice(-3).join(' ').slice(0, 400) || 'Error de Git.';
}
const offline = e => /Sin conexión/.test(String(e && e.message || e));

let chain = Promise.resolve();
const queue = fn => { const p = chain.then(fn, fn); chain = p.catch(() => {}); return p; };

async function branchOf(dir) { const r = await git(['rev-parse', '--abbrev-ref', 'HEAD'], dir); return r.code === 0 && r.out.trim() !== 'HEAD' ? r.out.trim() : 'main'; }
async function hasRemoteBranch(dir, br) { const r = await git(['rev-parse', '--verify', '--quiet', 'refs/remotes/origin/' + br], dir); return r.code === 0; }
async function commitAll(dir, msg) {
  await must(['add', '-A'], dir);
  const st = await git(['diff', '--cached', '--quiet'], dir);
  if (st.code === 0) return false;
  await must(['commit', '-q', '-m', msg], dir);
  return true;
}
const stamp = () => new Date().toLocaleString('es-ES', { hour12: false });

// Fusiona lo de GitHub. Si un proyecto se cambió en los dos sitios, se queda el de aquí y se guarda el otro como «X (otro ordenador)».
async function mergeRemote(dir, br, first) {
  const before = (await git(['rev-parse', 'HEAD'], dir)).out.trim();
  const m = await git(['merge', '--no-edit', '--no-ff', '--allow-unrelated-histories', 'origin/' + br], dir);
  const conflicts = [];
  if (m.code !== 0) {
    const u = await git(['diff', '--name-only', '--diff-filter=U', '-z'], dir);
    const files = u.out.split('\0').filter(Boolean);
    if (!files.length) { await git(['merge', '--abort'], dir); throw new Error(explain(m.err || m.out)); }
    const projs = new Map(); // carpeta del proyecto → archivos en conflicto
    for (const f of files) {
      // la carpeta del proyecto es la que tiene proyecto.json más cerca
      let d = path.posix.dirname(f.replace(/\\/g, '/')), proj = null;
      while (d && d !== '.') { if (fs.existsSync(path.join(dir, d, 'proyecto.json')) || (await git(['cat-file', '-e', 'MERGE_HEAD:' + d + '/proyecto.json'], dir)).code === 0) { proj = d; break; } d = path.posix.dirname(d); }
      if (!proj) { // archivo suelto (por ejemplo el progreso): se queda el más nuevo
        let side = '--ours';
        if (/progreso-modelado\.json$/.test(f)) { const a = await git(['show', ':2:' + f], dir), b = await git(['show', ':3:' + f], dir);
          const t = s => { try { return +JSON.parse(s).updated || 0; } catch (e) { return 0; } }; if (b.code === 0 && (first || a.code !== 0 || t(b.out) > t(a.out))) side = '--theirs'; }
        const o = await git(['checkout', side, '--', f], dir); if (o.code !== 0) await git(['checkout', side === '--ours' ? '--theirs' : '--ours', '--', f], dir);
        await git(['add', '-A', '--', f], dir); continue; }
      if (!projs.has(proj)) projs.set(proj, []);
      projs.get(proj).push(f);
    }
    for (const [proj] of projs) {
      // copia completa de la versión de GitHub en una carpeta nueva
      const ls = await git(['ls-tree', '-r', '-z', '--name-only', 'MERGE_HEAD', '--', proj], dir);
      const parent = path.posix.dirname(proj), leaf = path.posix.basename(proj);
      let n = leaf + ' (otro ordenador)', i = 2; while (fs.existsSync(path.join(dir, parent === '.' ? '' : parent, n))) n = leaf + ' (otro ordenador ' + i++ + ')';
      const dst = path.join(dir, parent === '.' ? '' : parent, n);
      for (const f of ls.out.split('\0').filter(Boolean)) {
        const r = await new Promise(res => execFile(chosen || 'git', ['show', 'MERGE_HEAD:' + f], { cwd: dir, encoding: 'buffer', maxBuffer: 64 * 1024 * 1024, windowsHide: true }, (e, out) => res(e ? null : out)));
        if (!r) continue;
        const out = path.join(dst, path.posix.relative(proj, f));
        fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, r);
      }
      try { const pj = path.join(dst, 'proyecto.json'), meta = JSON.parse(fs.readFileSync(pj, 'utf8')); meta.name = (meta.name || leaf) + ' (otro ordenador)'; fs.writeFileSync(pj, JSON.stringify(meta, null, 2)); } catch (e) {}
      // la versión de aquí se queda como estaba
      for (const f of projs.get(proj)) { const o = await git(['checkout', '--ours', '--', f], dir); if (o.code !== 0) await git(['rm', '-q', '--cached', '--', f], dir); }
      conflicts.push({ proyecto: leaf, copia: n });
    }
    await must(['add', '-A'], dir);
    await must(['commit', '-q', '--no-edit', '-m', 'Modelado Bases: dos versiones guardadas (' + PC() + ', ' + stamp() + ')'], dir);
  }
  const after = (await git(['rev-parse', 'HEAD'], dir)).out.trim();
  return { changed: before !== after, conflicts };
}

function readLock(dir) { try { return JSON.parse(fs.readFileSync(path.join(dir, LOCK), 'utf8')); } catch (e) { return null; } }

module.exports = function makeGit(getBase, getCfg, saveCfg) {
  const C = () => getCfg().git || {};
  const on = () => { const c = C(); return !!(c.enabled && c.url); };
  async function ensureRepo(dir, c) {
    if (!fs.existsSync(path.join(dir, '.git'))) {
      const r = await git(['init', '-q', '-b', 'main'], dir);
      if (r.code !== 0) { await must(['init', '-q'], dir); await git(['checkout', '-q', '-b', 'main'], dir); }
    }
    if (c.name) await must(['config', 'user.name', c.name], dir);
    if (c.email) await must(['config', 'user.email', c.email], dir);
    await git(['config', 'core.autocrlf', 'false'], dir); await git(['config', 'core.quotepath', 'false'], dir);
    const rem = await git(['remote', 'get-url', 'origin'], dir);
    if (rem.code !== 0) await must(['remote', 'add', 'origin', c.url], dir);
    else if (rem.out.trim() !== c.url) await must(['remote', 'set-url', 'origin', c.url], dir);
    const gi = path.join(dir, '.gitignore'); if (!fs.existsSync(gi)) fs.writeFileSync(gi, IGNORE);
  }
  // Al abrir: lo de aquí se sustituye por lo de GitHub. Si aquí había cambios que GitHub no tiene, quedan en una rama de respaldo local.
  async function takeRemote(dir) {
    const br = await branchOf(dir);
    await commitAll(dir, 'Modelado Bases: cambios de ' + PC() + ' (' + stamp() + ')');
    await must(['fetch', '-q', 'origin'], dir, 90000);
    if (!(await hasRemoteBranch(dir, br))) return { changed: false, conflicts: [] };
    const head = (await git(['rev-parse', 'HEAD'], dir)).out.trim(), rem = (await git(['rev-parse', 'origin/' + br], dir)).out.trim();
    if (!head || head === rem) return { changed: false, conflicts: [] };
    // GitHub no tiene nada nuevo (solo lo de aquí está por subir): no se toca nada
    if ((await git(['merge-base', '--is-ancestor', 'origin/' + br, 'HEAD'], dir)).code === 0) return { changed: false, conflicts: [] };
    let backup = null;
    if ((await git(['merge-base', '--is-ancestor', 'HEAD', 'origin/' + br], dir)).code !== 0) {
      const d = new Date(), z = n => String(n).padStart(2, '0');
      backup = 'respaldo-' + d.getFullYear() + z(d.getMonth() + 1) + z(d.getDate()) + '-' + z(d.getHours()) + z(d.getMinutes()) + z(d.getSeconds());
      await git(['branch', '-f', backup, 'HEAD'], dir);
      // solo se guardan los 5 respaldos más nuevos
      const l = await git(['for-each-ref', '--sort=-refname', '--format=%(refname:short)', 'refs/heads/respaldo-*'], dir);
      for (const b of l.out.split('\n').map(x => x.trim()).filter(Boolean).slice(5)) await git(['branch', '-D', b], dir);
    }
    await must(['reset', '-q', '--hard', 'origin/' + br], dir);
    return { changed: true, conflicts: [], backup };
  }
  // Al subir: lo de este ordenador manda. Si GitHub tenía algo distinto, se junta quedándose con lo de aquí.
  async function keepLocal(dir) {
    const br = await branchOf(dir);
    await commitAll(dir, 'Modelado Bases: cambios de ' + PC() + ' (' + stamp() + ')');
    await must(['fetch', '-q', 'origin'], dir, 90000);
    if (!(await hasRemoteBranch(dir, br))) return;
    if ((await git(['merge-base', '--is-ancestor', 'origin/' + br, 'HEAD'], dir)).code === 0) return;
    await must(['merge', '-q', '--no-edit', '--allow-unrelated-histories', '-s', 'ours', '-m', 'Modelado Bases: se sube lo de ' + PC() + ' (' + stamp() + ')', 'origin/' + br], dir);
  }
  async function pullIn(dir, first) {
    const br = await branchOf(dir);
    await commitAll(dir, 'Modelado Bases: cambios de ' + PC() + ' (' + stamp() + ')');
    await must(['fetch', '-q', 'origin'], dir, 90000);
    if (!(await hasRemoteBranch(dir, br))) return { changed: false, conflicts: [] };
    return mergeRemote(dir, br, first);
  }
  async function pushOut(dir) {
    const br = await branchOf(dir);
    for (let i = 0; i < 2; i++) {
      const r = await git(['push', '-q', '-u', 'origin', br], dir, 120000);
      if (r.code === 0) return true;
      if (/rejected|fetch first|non-fast-forward/i.test(r.err)) { await keepLocal(dir); continue; }
      throw new Error(explain(r.err || r.out));
    }
    throw new Error('GitHub tiene cambios nuevos que no se han podido juntar. Pulsa «Sincronizar ahora».');
  }
  const api = {
    info: () => ({ ...C(), pc: PC(), last: C().last || null }),
    async check() { const r = await git(['--version']); return { ok: r.code === 0, version: r.out.trim(), error: r.code === 0 ? null : explain(r.err) }; },
    // Guardar el formulario y conectar: crea el repositorio local si hace falta, junta lo que hubiera en GitHub y sube lo de aquí
    setup: (form) => queue(async () => {
      const url = String(form.url || '').trim(), name = String(form.name || '').trim(), email = String(form.email || '').trim();
      if (!/^(https:\/\/|git@|ssh:\/\/|file:\/\/|\/|[A-Za-z]:[\\/])/.test(url)) throw new Error('Pega la dirección del repositorio, por ejemplo https://github.com/usuario/modelados-bdd.git');
      if (!name || !email) throw new Error('Escribe tu nombre y tu email (puede ser el email privado de GitHub).');
      const cfg = getCfg(); cfg.git = { ...(cfg.git || {}), url, name, email, enabled: true, push: (cfg.git && cfg.git.push) || 'save', onClose: cfg.git && cfg.git.onClose === false ? false : true, lock: cfg.git && cfg.git.lock === false ? false : true };
      saveCfg();
      const ch = await api.check(); if (!ch.ok) throw new Error(ch.error);
      const dir = getBase(); await ensureRepo(dir, cfg.git);
      // al conectar un ordenador nuevo, el progreso que manda es el de GitHub
      const r = await pullIn(dir, true); await pushOut(dir);
      cfg.git.last = Date.now(); saveCfg();
      return { ...r, info: api.info() };
    }),
    setOpts: (o) => { const cfg = getCfg(); cfg.git = { ...(cfg.git || {}) }; ['push', 'onClose', 'lock'].forEach(k => { if (o[k] !== undefined) cfg.git[k] = o[k]; }); saveCfg(); return api.info(); },
    disconnect: () => { const cfg = getCfg(); if (cfg.git) cfg.git.enabled = false; saveCfg(); return api.info(); },
    // Al abrir: lo de aquí se sustituye por lo de GitHub, y se avisa si está abierta en otro ordenador
    open: () => queue(async () => {
      if (!on()) return { off: true };
      const dir = getBase(), c = C(); await ensureRepo(dir, c);
      let r = { changed: false, conflicts: [] }, err = null;
      try { r = await takeRemote(dir); } catch (e) { err = e.message; }
      const lk = readLock(dir), other = c.lock !== false && lk && lk.pc && lk.pc !== PC() && (Date.now() - (lk.t || 0)) < 12 * 3600 * 1000 ? lk : null;
      return { ...r, error: err, offline: err ? offline({ message: err }) : false, other };
    }),
    // Marcar «en uso» en este ordenador (después de que el usuario acepte si estaba en otro)
    claim: () => queue(async () => {
      if (!on() || C().lock === false) return true;
      const dir = getBase(); fs.writeFileSync(path.join(dir, LOCK), JSON.stringify({ pc: PC(), t: Date.now() }, null, 1));
      try { await commitAll(dir, 'Modelado Bases: abierta en ' + PC()); await pushOut(dir); } catch (e) {}
      return true;
    }),
    // Subir lo de aquí: lo de este ordenador se pone encima de lo que haya en GitHub
    sync: (o = {}) => queue(async () => {
      if (!on()) return { off: true };
      const dir = getBase();
      if (o.release) { const lk = readLock(dir); if (lk && lk.pc === PC()) { try { fs.unlinkSync(path.join(dir, LOCK)); } catch (e) {} } }
      await keepLocal(dir); await pushOut(dir);
      const cfg = getCfg(); cfg.git.last = Date.now(); saveCfg();
      return { changed: false, conflicts: [], last: cfg.git.last };
    }),
    // ¿Hay cambios sin subir?
    pending: async () => { if (!on()) return false; const dir = getBase(); const s = await git(['status', '--porcelain'], dir); if (s.out.trim()) return true; const a = await git(['rev-list', '--count', '@{u}..HEAD'], dir); return a.code === 0 && +a.out.trim() > 0; }
  };
  return api;
};
