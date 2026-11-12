const { contextBridge, ipcRenderer } = require('electron');
const call = async (ch, ...a) => { const r = await ipcRenderer.invoke(ch, ...a); if (!r.ok) throw new Error(r.error); return r.v; };
contextBridge.exposeInMainWorld('api', {
  progInfo: () => call('prog:info'), progRead: () => call('prog:read'), progWrite: d => call('prog:write', d), progChoose: () => call('prog:choose'), progReset: () => call('prog:reset'), progReveal: () => call('prog:reveal'),
  baseGet: () => call('base:get'), baseSetup: d => call('base:setup', d), baseChoose: () => call('base:choose'), baseReveal: () => call('base:reveal'),
  list: () => call('proj:list'), load: f => call('proj:load', f), create: (n, parent) => call('proj:create', n, parent), groups: () => call('grp:list'), mkGroup: (parent, n) => call('grp:create', parent, n), renameGroup: (g, n) => call('grp:rename', g, n), removeGroup: g => call('grp:delete', g), move: (f, to) => call('proj:move', f, to), save: (p, svgs) => call('proj:save', p, svgs),
  rename: (f, n) => call('proj:rename', f, n), remove: f => call('proj:delete', f), dup: f => call('proj:dup', f),
  reveal: f => call('proj:reveal', f), importDir: () => call('proj:importDir'),
  saveERDPlus: (f, n, t) => call('file:erdplus', f, n, t), saveCapture: (f, n, b64) => call('proj:saveCapture', f, n, b64), showFile: f => call('file:show', f),
  setTheme: m => call('theme:set', m), sqlWasm: () => call('sqljs:wasm'), setLang: l => call('app:lang', l), reload: () => call('win:reload'),
  winPref: p => call('win:pref', p), winZoom: f => call('win:zoom', f), winFullscreen: () => call('win:fullscreen'), openText: o => call('file:openText', o), saveText: o => call('file:saveText', o),
  updateCheck: () => call('update:check'), updateDownload: u => call('update:download', u), updateInstall: u => call('update:install', u), updatePrepare: u => call('update:prepare', u), updatePage: () => call('update:page'), fromArchive: () => call('app:fromArchive'),
  onUpdateProgress: cb => ipcRenderer.on('update:progress', (e, d) => cb(d)),
  solo: () => call('app:solo'), openWindow: (f, n) => call('win:open', f, n), windows: () => call('win:list'), focusWindow: f => call('win:focus', f), setTitle: t => call('win:title', t),
  onWindows: cb => ipcRenderer.on('win:list', (e, l) => cb(l)), onWindowClosed: cb => ipcRenderer.on('win:closed', (e, f) => cb(f)),
  onCloseRequest: cb => ipcRenderer.on('app:close-request', () => cb()), ack: () => call('app:ack'), ready: () => call('app:ready')
});
