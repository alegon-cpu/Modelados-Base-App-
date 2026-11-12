const { app, BrowserWindow, ipcMain, dialog, shell, Menu, nativeTheme, net } = require('electron');
const path = require('path');
const fs = require('fs');
const S = require('./storage');
const makeGit = require('./git'); // se carga aquí, antes del modo instalador (que desactiva leer dentro del .asar)

const VERSION = '2.5';
let win, cfgFile, cfg = {};
const solos = new Map(); // ventanas de un solo proyecto: webContents.id -> { w, folder }
const DATA_NAME = 'Modelados BDD';
const base = () => { if (!cfg.dataDir) throw new Error('Primero elige dónde guardar la carpeta Modelados BDD.'); return cfg.dataDir; };
function saveCfg() { try { fs.writeFileSync(cfgFile, JSON.stringify(cfg, null, 2)); } catch (e) {} }
// Idioma de los diálogos (lo dice la ventana al arrancar)
let LG = 'es';
const DT = { 'Elige dónde crear la carpeta ': 'Choose where to create the folder ', 'Elige dónde mover la carpeta ': 'Choose where to move the folder ', 'Mover': 'Move', 'Cancelar': 'Cancel',
  'Mover proyectos': 'Move projects', 'Se moverá la carpeta ': 'The folder ', ' con todos tus proyectos a:': ' will be moved, with all your projects, to:', 'Importar carpeta de proyecto': 'Import project folder',
  'Exportar a ERDPlus': 'Export to ERDPlus', 'Diagrama ERDPlus': 'ERDPlus diagram', 'Guardar imagen': 'Save image' };
const T = s => LG === 'en' ? (DT[s] || s) : s;
const bg = () => nativeTheme.shouldUseDarkColors ? '#1C1D1F' : '#F3F2EF';
// Barra de título integrada: los botones de Windows se pintan con los colores del tema
const TB_H = 36;
const overlay = () => nativeTheme.shouldUseDarkColors ? { color: '#222326', symbolColor: '#E7E6E3', height: TB_H } : { color: '#FAF9F7', symbolColor: '#22211F', height: TB_H };
function paintOverlays() {
  for (const w of BrowserWindow.getAllWindows()) {
    if (w.isDestroyed()) continue;
    w.setBackgroundColor(bg());
    try { w.setTitleBarOverlay(overlay()); } catch (e) {}
  }
}
// Posición y tamaño de la ventana principal, para "Como la dejé"
function boundsVisible(b) {
  const { screen } = require('electron');
  return !!b && screen.getAllDisplays().some(d => { const a = d.workArea; return b.x < a.x + a.width - 80 && b.x + b.width > a.x + 80 && b.y >= a.y - 10 && b.y < a.y + a.height - 60; });
}

// ---------- Modo instalador ----------
// Para actualizar, la app vieja abre la versión NUEVA (ya descomprimida en Temp) con --mb-install.
// Esa copia no abre ventanas: espera a que la vieja se cierre, copia sus archivos encima y vuelve a abrir el programa.
const ARG = k => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : null; };
const INSTALLER = !!ARG('mb-install');
if (INSTALLER) {
  process.noAsar = true;
  app.disableHardwareAcceleration();
  try { app.setPath('userData', path.join(app.getPath('temp'), 'modelado-bases-instalador')); } catch (e) {}
  runInstaller().catch(() => app.exit(1));
} else if (!app.requestSingleInstanceLock()) { app.exit(0); }
async function runInstaller() {
  const dst = ARG('mb-install'), src = ARG('mb-src') || path.dirname(process.execPath);
  const pid = parseInt(ARG('mb-pid') || '0', 10), log = ARG('mb-log'), relaunch = process.argv.includes('--mb-relaunch');
  const L = m => { if (log) try { fs.appendFileSync(log, new Date().toTimeString().slice(0, 8) + ' ' + m + '\r\n'); } catch (e) {} };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const alive = p => { if (!p) return false; try { process.kill(p, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
  L('inicio (instalador ' + VERSION + '): ' + src + ' -> ' + dst);
  for (let i = 0; i < 120 && alive(pid); i++) await sleep(500);
  if (alive(pid)) { L('la app vieja no se cierra: se cierra a la fuerza'); try { process.kill(pid); } catch (e) {} await sleep(1500); }
  await sleep(800);
  const copyDir = (a, b) => {
    fs.mkdirSync(b, { recursive: true });
    for (const d of fs.readdirSync(a, { withFileTypes: true })) {
      const x = path.join(a, d.name), y = path.join(b, d.name);
      if (d.isDirectory()) copyDir(x, y); else fs.copyFileSync(x, y);
    }
  };
  let ok = false, err = '';
  for (let t = 0; t < 25 && !ok; t++) {
    try { copyDir(src, dst); ok = true; }
    catch (e) {
      err = (e.code || '') + ' ' + e.message; L('reintento ' + (t + 1) + ': ' + err);
      // Algún proceso viejo del programa (GPU, crashpad...) sigue usando los archivos: se cierra
      if (t === 4 && process.platform === 'win32') {
        try {
          require('child_process').execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
            `Get-Process | Where-Object { $_.Id -ne ${process.pid} -and $_.Path -and $_.Path.StartsWith('${dst.replace(/'/g, "''")}\\', [StringComparison]::OrdinalIgnoreCase) } | Stop-Process -Force`],
            { windowsHide: true, timeout: 20000, stdio: 'ignore' });
          L('procesos viejos cerrados');
        } catch (e2) { L('no se pudieron cerrar procesos viejos: ' + e2.message); }
      }
      await sleep(1500);
    }
  }
  L(ok ? 'copiado ok' : 'no se pudo copiar: ' + err);
  if (relaunch) {
    const exe = path.join(dst, process.platform === 'win32' ? 'Modelado Bases.exe' : 'Modelado Bases');
    // En Windows la abre el Explorador: así no depende de que este instalador siga vivo
    const win32 = process.platform === 'win32';
    try {
      const c = require('child_process').spawn(win32 ? 'explorer.exe' : exe, win32 ? [exe] : [], { cwd: dst, detached: true, stdio: 'ignore' });
      c.on('error', e => L('no se pudo abrir: ' + e.message));
      c.on('spawn', () => L('abriendo la app'));
      c.unref();
    } catch (e) { L('no se pudo abrir: ' + e.message); }
    await sleep(4000);
  }
  L('instalador terminado');
  app.exit(0);
}
// Si ya hay una copia abierta, se enseña su ventana (o se abre una si se había quedado sin ninguna)
app.on('second-instance', () => {
  if (win && !win.isDestroyed()) { if (win.isMinimized()) win.restore(); win.show(); win.focus(); }
  else if (app.isReady() && !quitting) openMain();
});

function makeWindow(opts, query) {
  const w = new BrowserWindow(Object.assign({
    width: 1440, height: 900, minWidth: 900, minHeight: 600, title: 'Modelado Bases ' + VERSION,
    icon: path.join(__dirname, 'icon.png'), backgroundColor: bg(), show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false },
    titleBarStyle: 'hidden', titleBarOverlay: overlay()
  }, opts));
  w.once('ready-to-show', () => {
    const start = cfg.winStart || 'max';
    if (start === 'remember' && !query && boundsVisible(cfg.bounds)) { w.setBounds(cfg.bounds); if (cfg.maximized) w.maximize(); }
    else if (start !== 'normal') w.maximize();
    else w.center();
    if (cfg.onTop) w.setAlwaysOnTop(true);
    w.show();
  });
  w.loadFile(path.join(__dirname, 'index.html'), query ? { query } : undefined);
  w.webContents.setVisualZoomLevelLimits(1, 1).catch(() => {});
  w.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  w.webContents.on('will-navigate', e => e.preventDefault());
  w.webContents.on('before-input-event', (e, input) => {
    if (input.type === 'keyDown' && input.key === 'F12') w.webContents.toggleDevTools();
    if (input.type === 'keyDown' && input.key === 'F11') { e.preventDefault(); w.setFullScreen(!w.isFullScreen()); }
  });
  // Antes de cerrar, la ventana comprueba si hay cambios sin guardar
  w.on('close', e => {
    if (w === win && !w.isDestroyed()) { cfg.maximized = w.isMaximized(); if (!w.isFullScreen()) cfg.bounds = w.getNormalBounds(); saveCfg(); }
    if (w._canClose) return;
    e.preventDefault();
    w._ack = false;
    w.webContents.send('app:close-request');
    clearTimeout(w._fb);
    w._fb = setTimeout(() => { if (!w._ack && !w.isDestroyed()) { w._canClose = true; w.close(); } }, 2500);
  });
  return w;
}
function sendSolos() {
  if (win && !win.isDestroyed()) win.webContents.send('win:list', [...solos.values()].map(s => s.folder));
}

app.whenReady().then(() => {
  if (INSTALLER) return;
  // Si venimos de una actualización, se apunta en el registro que la app ha arrancado
  try {
    const lg = path.join(app.getPath('temp'), 'modelado-bases-update', 'update.log');
    if (Date.now() - fs.statSync(lg).mtimeMs < 5 * 60 * 1000) fs.appendFileSync(lg, new Date().toTimeString().slice(0, 8) + ' arranca la app ' + VERSION + '\r\n');
  } catch (e) {}
  cfgFile = path.join(app.getPath('userData'), 'config.json');
  try { cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8')) || {}; } catch (e) { cfg = {}; }
  if (cfg.dataDir) { try { fs.mkdirSync(cfg.dataDir, { recursive: true }); } catch (e) {} }
  Menu.setApplicationMenu(null);
  openMain();
});
function openMain() {
  win = makeWindow({});
  win.on('closed', () => { win = null; for (const s of solos.values()) if (!s.w.isDestroyed()) s.w.close(); });
}
// Al cerrar la última ventana, la app se cierra del todo (y si algo la retiene, se fuerza)
let quitting = false;
function quitForSure(ms) {
  quitting = true;
  app.quit();
  setTimeout(() => app.exit(0), ms || 4000);
}
app.on('window-all-closed', () => quitForSure());
app.on('before-quit', () => { quitting = true; });

const winOf = e => BrowserWindow.fromWebContents(e.sender);
const h = (ch, fn) => ipcMain.handle(ch, async (e, ...a) => {
  try { return { ok: true, v: await fn(...a, e) }; }
  catch (err) { return { ok: false, error: String((err && err.message) || err) }; }
});
h('app:ack', (e) => { const w = winOf(e); if (w) { w._ack = true; clearTimeout(w._fb); } });
h('app:ready', (e) => { const w = winOf(e); if (w && !w.isDestroyed()) { w._canClose = true; w.close(); } });
h('app:solo', (e) => { const s = solos.get(e.sender.id); return s ? s.folder : null; });
h('win:open', (folder, name) => {
  S.inside(base(), folder);
  for (const s of solos.values()) if (s.folder === folder && !s.w.isDestroyed()) { s.w.focus(); return true; }
  const w = makeWindow({ title: (name || folder) + ' · Modelado Bases' }, { solo: folder });
  const id = w.webContents.id;
  solos.set(id, { w, folder });
  w.on('closed', () => {
    const s = solos.get(id); solos.delete(id);
    sendSolos();
    if (s && win && !win.isDestroyed()) { win.webContents.send('win:closed', s.folder); win.focus(); }
  });
  sendSolos();
  return true;
});
h('win:list', () => [...solos.values()].map(s => s.folder));
h('win:focus', folder => { for (const s of solos.values()) if (s.folder === folder && !s.w.isDestroyed()) { s.w.focus(); return true; } return false; });
h('win:title', (t, e) => { const w = winOf(e); if (w) w.setTitle(String(t)); });
h('base:get', () => cfg.dataDir || null);
// Sincronizar con GitHub (git.js)
const GitSync = makeGit(() => base(), () => cfg, saveCfg);
h('git:info', () => GitSync.info());
h('win:close', (e) => { const w = winOf(e); if (w && !w.isDestroyed()) w.close(); });
h('git:check', () => GitSync.check());
h('git:setup', f => GitSync.setup(f || {}));
h('git:opts', o => GitSync.setOpts(o || {}));
h('git:off', () => GitSync.disconnect());
h('git:open', () => GitSync.open());
h('git:claim', () => GitSync.claim());
h('git:sync', o => GitSync.sync(o || {}));
h('git:pending', () => GitSync.pending());
// Progreso (tokens, premios, ajustes): un archivo en la carpeta que elija el usuario (por defecto, la de proyectos)
const PROG_NAME = 'progreso-modelado.json';
const progDir = () => (cfg.progDir && fs.existsSync(cfg.progDir)) ? cfg.progDir : base();
const progInfo = () => { let dir = null; try { dir = progDir(); } catch (e) {} return { dir, custom: !!cfg.progDir, file: dir ? path.join(dir, PROG_NAME) : null }; };
h('prog:info', () => progInfo());
// Con GitHub activado se guarda también una copia en la carpeta de proyectos, que es la que se sincroniza; al leer manda la más nueva
const gitOn = () => !!(cfg.git && cfg.git.enabled && cfg.git.url);
const readProg = f => { try { return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; } catch (e) { return null; } };
h('prog:read', () => { const a = readProg(path.join(progDir(), PROG_NAME)); if (!gitOn()) return a; const b = readProg(path.join(base(), PROG_NAME)); return (b && (!a || (+b.updated || 0) > (+a.updated || 0))) ? b : a; });
h('prog:write', d => { const dir = progDir(); fs.mkdirSync(dir, { recursive: true }); const f = path.join(dir, PROG_NAME), tmp = f + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(d, null, 1)); fs.renameSync(tmp, f);
  if (gitOn() && path.resolve(dir) !== path.resolve(base())) { const g = path.join(base(), PROG_NAME); fs.writeFileSync(g + '.tmp', JSON.stringify(d, null, 1)); fs.renameSync(g + '.tmp', g); }
  return true; });
h('prog:choose', async (e) => { const r = await dialog.showOpenDialog(winOf(e) || win, { title: T('Elige la carpeta donde guardar tu progreso'), defaultPath: progInfo().dir || undefined, properties: ['openDirectory', 'createDirectory'] });
  if (r.canceled || !r.filePaths[0]) return null; cfg.progDir = r.filePaths[0]; saveCfg(); return progInfo(); });
h('prog:reset', () => { delete cfg.progDir; saveCfg(); return progInfo(); });
h('prog:reveal', () => { const i = progInfo(); if (i.file && fs.existsSync(i.file)) shell.showItemInFolder(i.file); else if (i.dir) shell.openPath(i.dir); });
h('base:reveal', () => shell.openPath(base()));
function dataDirIn(parent) { return path.basename(parent) === DATA_NAME ? parent : path.join(parent, DATA_NAME); }
function moveDir(from, to) {
  try { fs.renameSync(from, to); }
  catch (e) { fs.cpSync(from, to, { recursive: true }); fs.rmSync(from, { recursive: true, force: true }); }
}
// Trae proyectos de una carpeta antigua a la nueva (sin pisar nada)
function bringProjects(fromDir, toDir) {
  let n = 0;
  if (!fs.existsSync(fromDir) || path.resolve(fromDir) === path.resolve(toDir)) return 0;
  for (const d of fs.readdirSync(fromDir, { withFileTypes: true })) {
    const src = path.join(fromDir, d.name);
    if (!d.isDirectory() || d.name.startsWith('.')) continue; // proyectos y carpetas de proyectos
    let name = d.name, i = 2;
    while (fs.existsSync(path.join(toDir, name))) name = `${d.name} (${i++})`;
    moveDir(src, path.join(toDir, name)); n++;
  }
  return n;
}
h('base:setup', async useDefault => {
  let parent = app.getPath('documents');
  if (!useDefault) {
    const r = await dialog.showOpenDialog(win, { title: T('Elige dónde crear la carpeta ') + DATA_NAME, defaultPath: parent, properties: ['openDirectory', 'createDirectory'] });
    if (r.canceled || !r.filePaths[0]) return null;
    parent = r.filePaths[0];
  }
  const dir = dataDirIn(parent);
  fs.mkdirSync(dir, { recursive: true });
  let migrated = 0;
  const docs = app.getPath('documents');
  for (const old of [cfg.baseDir, path.join(docs, 'Modelado Bases'), path.join(docs, 'Estudio E-R')].filter(Boolean)) {
    try { migrated += bringProjects(old, dir); } catch (e) {}
  }
  cfg.dataDir = dir; delete cfg.baseDir; saveCfg();
  return { dir, migrated };
});
h('base:choose', async () => {
  const cur = base();
  if (solos.size) throw new Error('Cierra antes las ventanas de proyecto que tienes abiertas.');
  const r = await dialog.showOpenDialog(win, { title: T('Elige dónde mover la carpeta ') + DATA_NAME, defaultPath: path.dirname(cur), properties: ['openDirectory', 'createDirectory'] });
  if (r.canceled || !r.filePaths[0]) return null;
  const dir = dataDirIn(r.filePaths[0]);
  if (path.resolve(dir) === path.resolve(cur)) return null;
  if (path.resolve(dir).startsWith(path.resolve(cur) + path.sep)) throw new Error('No puedes mover la carpeta dentro de sí misma.');
  const ok = await dialog.showMessageBox(win, { type: 'question', buttons: [T('Mover'), T('Cancelar')], defaultId: 0, cancelId: 1, title: T('Mover proyectos'),
    message: T('Se moverá la carpeta ') + DATA_NAME + T(' con todos tus proyectos a:'), detail: dir });
  if (ok.response !== 0) return null;
  if (!fs.existsSync(dir)) moveDir(cur, dir);
  else { bringProjects(cur, dir); try { fs.rmdirSync(cur); } catch (e) {} }
  cfg.dataDir = dir; saveCfg();
  return dir;
});
h('proj:list', () => S.list(base()));
h('proj:load', folder => S.load(base(), folder));
h('proj:create', (name, parent) => S.create(base(), name, parent || ''));
h('grp:list', () => S.groups(base()));
h('grp:create', (parent, name) => S.mkGroup(base(), parent || '', name));
h('grp:rename', (g, name) => S.renameGroup(base(), g, name));
h('grp:delete', g => shell.trashItem(S.inside(base(), g)));
h('proj:move', (folder, to) => S.move(base(), folder, to || ''));
h('proj:save', (p, svgs) => S.save(base(), p, svgs));
h('proj:rename', (folder, name, e) => {
  const nf = S.rename(base(), folder, name);
  const s = solos.get(e.sender.id);
  if (s) { s.folder = nf; s.w.setTitle(name + ' · Modelado Bases'); sendSolos(); }
  return nf;
});
h('proj:delete', folder => shell.trashItem(S.inside(base(), folder)));
h('proj:dup', folder => S.duplicate(base(), folder));
h('proj:reveal', folder => shell.openPath(S.inside(base(), folder)));
h('proj:importDir', async (e) => {
  const r = await dialog.showOpenDialog(winOf(e) || win, { title: T('Importar carpeta de proyecto'), properties: ['openDirectory'] });
  if (r.canceled || !r.filePaths[0]) return [];
  if (path.resolve(path.dirname(r.filePaths[0])) === path.resolve(base())) throw new Error('Ese proyecto ya está en tu carpeta de proyectos.');
  return S.importDir(base(), r.filePaths[0]);
});
// Exportar el E-R a un archivo que se abre en ERDPlus (erdplus.com)
h('file:erdplus', async (folder, name, text, e) => {
  let def = app.getPath('documents');
  try { def = S.inside(base(), folder); } catch (err) {}
  const r = await dialog.showSaveDialog(winOf(e) || win, { title: T('Exportar a ERDPlus'), defaultPath: path.join(def, S.safeName(name) + '.erdplus'),
    filters: [{ name: T('Diagrama ERDPlus'), extensions: ['erdplus'] }] });
  if (r.canceled || !r.filePath) return null;
  fs.writeFileSync(r.filePath, String(text), 'utf8');
  return r.filePath;
});
h('proj:saveCapture', (folder, name, b64) => {
  const dir = path.join(S.inside(base(), folder), 'Captura');
  fs.mkdirSync(dir, { recursive: true });
  const f = path.join(dir, S.safeName(name) + '.png');
  fs.writeFileSync(f, Buffer.from(String(b64), 'base64'));
  return f;
});
// Guardar un texto (exportar .sql para Workbench / phpMyAdmin)
h('file:saveText', async (o, e) => {
  o = o || {};
  let def = app.getPath('documents');
  try { if (o.folder) def = S.inside(base(), o.folder); } catch (err) {}
  const r = await dialog.showSaveDialog(winOf(e) || win, { title: String(o.title || ''), defaultPath: path.join(def, S.safeName(String(o.name || 'script')) + (o.ext || '.sql')),
    filters: Array.isArray(o.filters) ? o.filters : [] });
  if (r.canceled || !r.filePath) return null;
  fs.writeFileSync(r.filePath, String(o.text || ''), 'utf8');
  return r.filePath;
});
h('win:reload', e => { e.sender.reload(); });
h('app:lang', l => { LG = l === 'en' ? 'en' : 'es'; });
h('sqljs:wasm', () => fs.readFileSync(path.join(__dirname, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm')));
h('file:show', f => { shell.showItemInFolder(path.resolve(String(f || ''))); });
// ---------- Avisos de versión nueva (Releases de GitHub) ----------
const REPO = 'alegon-cpu/Modelados-Base-App-';
const vnum = s => String(s || '').trim().replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
const isNewer = (a, b) => { const x = vnum(a), y = vnum(b); for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
const DL_PREFIX = `https://github.com/${REPO}/releases/download/`;
// ¿Se puede instalar sola? Solo en Windows, con la app empaquetada y su carpeta con permiso de escritura
function installDir() { return path.dirname(process.execPath); }
// ¿Se está abriendo desde dentro del .zip / .rar? (Windows y WinRAR lo sacan a una carpeta temporal)
function fromArchive() {
  if (process.platform !== 'win32' || !app.isPackaged) return false;
  const exe = process.execPath.toLowerCase(), tmp = path.resolve(app.getPath('temp')).toLowerCase() + path.sep;
  return exe.startsWith(tmp) || /[\\/](rar\$ex|temp\d*_|7z[a-z0-9]*)[^\\/]*[\\/]/i.test(process.execPath);
}
h('app:fromArchive', () => fromArchive());
function canSelfUpdate() {
  if (process.platform !== 'win32' || !app.isPackaged || fromArchive()) return false;
  const t = path.join(installDir(), '.mb-write-test');
  try { fs.writeFileSync(t, 'ok'); fs.unlinkSync(t); return true; } catch (e) { return false; }
}
h('update:check', async () => {
  const r = await net.fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { 'User-Agent': 'Modelado-Bases', Accept: 'application/vnd.github+json' } });
  if (r.status === 404) return { current: app.getVersion(), tag: null, newer: false };
  if (!r.ok) throw new Error('GitHub respondió ' + r.status);
  const j = await r.json();
  const asset = (j.assets || []).find(a => /windows.*\.zip$/i.test(a.name)) || (j.assets || []).find(a => /\.zip$/i.test(a.name)) || null;
  return { current: app.getVersion(), tag: j.tag_name, name: j.name || j.tag_name, body: String(j.body || '').slice(0, 5000),
    newer: isNewer(j.tag_name, app.getVersion()), canInstall: !!asset && canSelfUpdate(),
    asset: asset && { name: asset.name, url: asset.browser_download_url, size: asset.size } };
});
async function downloadTo(url, f, sender) {
  url = String(url || '');
  if (!url.startsWith(DL_PREFIX)) throw new Error('Enlace de descarga no válido.');
  const r = await net.fetch(url, { headers: { 'User-Agent': 'Modelado-Bases' } });
  if (!r.ok || !r.body) throw new Error('No se pudo descargar (' + r.status + ').');
  const total = parseInt(r.headers.get('content-length') || '0', 10) || 0;
  const tmp = f + '.part', out = fs.createWriteStream(tmp);
  let got = 0, last = 0;
  try {
    const rd = r.body.getReader();
    for (;;) {
      const { done, value } = await rd.read();
      if (done) break;
      got += value.length;
      if (!out.write(Buffer.from(value))) await new Promise(res => out.once('drain', res));
      const now = Date.now();
      if (now - last > 150 && !sender.isDestroyed()) { last = now; sender.send('update:progress', { got, total }); }
    }
    await new Promise((res, rej) => out.end(err => err ? rej(err) : res()));
  } catch (err) { out.destroy(); try { fs.unlinkSync(tmp); } catch (x) {} throw err; }
  if (total && got !== total) { try { fs.unlinkSync(tmp); } catch (x) {} throw new Error('La descarga se cortó. Inténtalo otra vez.'); }
  fs.renameSync(tmp, f);
  if (!sender.isDestroyed()) sender.send('update:progress', { got, total: got });
  return f;
}
h('update:download', async (url, e) => {
  const name = path.basename(decodeURIComponent(String(url || '').split('?')[0])).replace(/[\\/:*?"<>|]/g, '_');
  const dir = app.getPath('downloads');
  let f = path.join(dir, name), i = 2;
  while (fs.existsSync(f)) f = path.join(dir, name.replace(/(\.zip)?$/i, ` (${i++})$1`));
  return downloadTo(url, f, e.sender);
});
// Busca la carpeta que contiene "Modelado Bases.exe" dentro de lo descomprimido
function findAppDir(dir, depth = 0) {
  if (fs.existsSync(path.join(dir, 'Modelado Bases.exe')) && !fs.existsSync(path.join(dir, 'resources', 'app.asar'))) return null;
  if (fs.existsSync(path.join(dir, 'Modelado Bases.exe')) && fs.existsSync(path.join(dir, 'resources'))) return dir;
  if (depth >= 3) return null;
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) if (d.isDirectory()) { const r = findAppDir(path.join(dir, d.name), depth + 1); if (r) return r; }
  return null;
}
// Descarga y descomprime la versión nueva en una carpeta temporal (no toca el programa todavía)
let prepared = null, prepPromise = null;
// Electron trata los .asar como carpetas: para tocar la versión descargada hay que desactivarlo un momento
function noAsar(fn) { const prev = process.noAsar; process.noAsar = true; try { return fn(); } finally { process.noAsar = prev; } }
async function prepareUpdate(url, sender) {
  if (!canSelfUpdate()) throw new Error('Esta copia no se puede actualizar sola.');
  if (prepared && prepared.url === url && noAsar(() => fs.existsSync(prepared.src))) return prepared;
  const work = path.join(app.getPath('temp'), 'modelado-bases-update');
  noAsar(() => fs.rmSync(work, { recursive: true, force: true }));
  fs.mkdirSync(work, { recursive: true });
  const zip = path.join(work, 'update.zip');
  await downloadTo(url, zip, sender);
  if (!sender.isDestroyed()) sender.send('update:progress', { phase: 'extract' });
  const AdmZip = require('adm-zip');
  const src = noAsar(() => { new AdmZip(zip).extractAllTo(path.join(work, 'x'), true); return findAppDir(path.join(work, 'x')); });
  if (!src) throw new Error('El zip descargado no contiene el programa.');
  prepared = { url, work, zip, src };
  return prepared;
}
// Abre la versión nueva en modo instalador: espera a que esta se cierre, copia sus archivos y (si se pide) vuelve a abrir el programa
function launchInstaller(p, relaunch) {
  const dst = installDir(), log = path.join(p.work, 'update.log');
  const exe = path.join(p.src, 'Modelado Bases.exe');
  try { fs.appendFileSync(log, new Date().toTimeString().slice(0, 8) + ' la app ' + VERSION + ' abre el instalador\r\n'); } catch (e) {}
  const args = ['--mb-install=' + dst, '--mb-pid=' + process.pid, '--mb-log=' + log].concat(relaunch ? ['--mb-relaunch'] : []);
  const { spawn } = require('child_process');
  return new Promise((res, rej) => {
    const c = spawn(exe, args, { cwd: p.src, detached: true, stdio: 'ignore' });
    c.once('error', err => rej(new Error('No se pudo iniciar el instalador (' + err.message + ').')));
    c.once('spawn', () => { c.unref(); res(); });
  });
}
// En segundo plano: se deja preparada y se instala sola al cerrar la app
h('update:prepare', async (url, e) => {
  if (!prepPromise) prepPromise = prepareUpdate(url, e.sender).catch(err => { prepPromise = null; throw err; });
  await prepPromise;
  return true;
});
// "Reiniciar y actualizar": se instala ya y se vuelve a abrir
let installing = false;
h('update:install', async (url, e) => {
  const p = await (prepPromise || prepareUpdate(url, e.sender));
  await launchInstaller(p, true);
  installing = true;
  // Ya se ha guardado todo antes de llamar aquí: se cierran las ventanas sin volver a preguntar
  setTimeout(() => {
    for (const w of BrowserWindow.getAllWindows()) { w._canClose = true; if (!w.isDestroyed()) w.destroy(); }
    quitForSure(3000);
  }, 300);
  return true;
});
app.on('will-quit', () => {
  if (installing || !prepared || !noAsar(() => fs.existsSync(prepared.src))) return;
  installing = true;
  launchInstaller(prepared, false).catch(() => {});
});
h('update:page', () => shell.openExternal(`https://github.com/${REPO}/releases/latest`));
h('theme:set', mode => {
  nativeTheme.themeSource = ['light', 'dark'].includes(mode) ? mode : 'system';
  paintOverlays();
});
nativeTheme.on('updated', paintOverlays);
// Ajustes de ventana
h('win:pref', p => {
  p = p || {};
  if (['max', 'remember', 'normal'].includes(p.start)) cfg.winStart = p.start;
  cfg.onTop = !!p.onTop; saveCfg();
  for (const w of BrowserWindow.getAllWindows()) if (!w.isDestroyed()) w.setAlwaysOnTop(cfg.onTop);
});
h('win:zoom', (f, e) => { f = Math.min(1.75, Math.max(0.75, +f || 1)); e.sender.setZoomFactor(f); });
h('win:fullscreen', e => { const w = winOf(e); if (w) w.setFullScreen(!w.isFullScreen()); });
// Abrir un archivo de texto (importar ERDPlus o SQL)
h('file:openText', async (o, e) => {
  o = o || {};
  const r = await dialog.showOpenDialog(winOf(e) || win, { title: String(o.title || 'Abrir'), properties: ['openFile'], filters: Array.isArray(o.filters) ? o.filters : [] });
  if (r.canceled || !r.filePaths[0]) return null;
  const f = r.filePaths[0];
  if (fs.statSync(f).size > 30 * 1024 * 1024) throw new Error('El archivo es demasiado grande (más de 30 MB).');
  // Modelo de MySQL Workbench: es un zip con el modelo en document.mwb.xml
  if (/\.mwb$/i.test(f)) {
    const AdmZip = require('adm-zip');
    let xml = null;
    try { const z = new AdmZip(f), en = z.getEntry('document.mwb.xml'); if (en) xml = z.readAsText(en, 'utf8'); } catch (err) {}
    if (!xml) throw new Error('No he podido leer el modelo de Workbench (¿el .mwb está dañado?).');
    return { name: path.basename(f), kind: 'mwb', text: xml };
  }
  if (fs.statSync(f).size > 10 * 1024 * 1024) throw new Error('El archivo es demasiado grande (más de 10 MB).');
  return { name: path.basename(f), kind: 'text', text: fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, '') };
});
