const { contextBridge, ipcRenderer } = require('electron');
const call = async (ch, ...a) => { const r = await ipcRenderer.invoke(ch, ...a); if (!r.ok) throw new Error(r.error); return r.v; };
contextBridge.exposeInMainWorld('api', {
  baseGet: () => call('base:get'), baseSetup: d => call('base:setup', d), baseChoose: () => call('base:choose'), baseReveal: () => call('base:reveal'),
  list: () => call('proj:list'), load: f => call('proj:load', f), create: n => call('proj:create', n), save: (p, svgs) => call('proj:save', p, svgs),
  rename: (f, n) => call('proj:rename', f, n), remove: f => call('proj:delete', f), dup: f => call('proj:dup', f),
  reveal: f => call('proj:reveal', f), importDir: () => call('proj:importDir'),
  saveERDPlus: (f, n, t) => call('file:erdplus', f, n, t), saveCapture: (f, n, b64) => call('proj:saveCapture', f, n, b64), showFile: f => call('file:show', f),
  setTheme: m => call('theme:set', m),
  updateCheck: () => call('update:check'), updateDownload: u => call('update:download', u), updateInstall: u => call('update:install', u), updatePage: () => call('update:page'),
  onUpdateProgress: cb => ipcRenderer.on('update:progress', (e, d) => cb(d)),
  solo: () => call('app:solo'), openWindow: (f, n) => call('win:open', f, n), windows: () => call('win:list'), focusWindow: f => call('win:focus', f), setTitle: t => call('win:title', t),
  onWindows: cb => ipcRenderer.on('win:list', (e, l) => cb(l)), onWindowClosed: cb => ipcRenderer.on('win:closed', (e, f) => cb(f)),
  onCloseRequest: cb => ipcRenderer.on('app:close-request', () => cb()), ack: () => call('app:ack'), ready: () => call('app:ready')
});
