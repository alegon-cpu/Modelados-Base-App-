// Modo examen: conexión con Firebase (proyecto «modeladosbdd»), solo desde el proceso principal.
// Las sesiones (tokens) no salen de aquí: la ventana solo pide «haz esta petición como alumno/profesor».
// La apiKey no es secreta: identifica el proyecto. Lo que protege los datos son las reglas de Firestore.
const { net, safeStorage, app } = require('electron');
const fs = require('fs');
const path = require('path');

const KEY = 'AIzaSyCkyca5ILgWPxkZwhoCGHqitrA16v4xWxQ';
const PROJ = 'modeladosbdd';
const DOCS = `https://firestore.googleapis.com/v1/projects/${PROJ}/databases/(default)/documents`;
const AUTH = 'https://identitytoolkit.googleapis.com/v1/accounts:';
const TOKEN = `https://securetoken.googleapis.com/v1/token?key=${KEY}`;

let st = null; // { alumno: {uid, refresh, idToken, exp}, profe: {uid, email, refresh, idToken, exp} }
const file = () => path.join(app.getPath('userData'), 'examen.json');
const enc = s => { try { if (safeStorage.isEncryptionAvailable()) return 'e:' + safeStorage.encryptString(s).toString('base64'); } catch (e) {} return null; };
const dec = s => { try { if (s && s.startsWith('e:')) return safeStorage.decryptString(Buffer.from(s.slice(2), 'base64')); } catch (e) {} return null; };
function load() {
  if (st) return st; st = { alumno: null, profe: null };
  try {
    const d = JSON.parse(fs.readFileSync(file(), 'utf8'));
    if (d.alumno && d.alumno.uid && d.alumno.refresh) st.alumno = { uid: d.alumno.uid, refresh: d.alumno.refresh };
    const r = d.profe && dec(d.profe.refresh); if (r) st.profe = { uid: d.profe.uid, email: d.profe.email, refresh: r };
  } catch (e) {}
  return st;
}
function save() {
  const o = {};
  if (st.alumno) o.alumno = { uid: st.alumno.uid, refresh: st.alumno.refresh };
  // la sesión del profesor solo se recuerda si se puede cifrar con la cuenta de Windows
  const r = st.profe && enc(st.profe.refresh); if (r) o.profe = { uid: st.profe.uid, email: st.profe.email, refresh: r };
  try { fs.writeFileSync(file(), JSON.stringify(o)); } catch (e) {}
}

const MSG = {
  INVALID_LOGIN_CREDENTIALS: 'Usuario o contraseña incorrectos.', INVALID_PASSWORD: 'Usuario o contraseña incorrectos.', EMAIL_NOT_FOUND: 'Usuario o contraseña incorrectos.',
  INVALID_EMAIL: 'Usuario o contraseña incorrectos.', USER_DISABLED: 'Esa cuenta está desactivada.', TOO_MANY_ATTEMPTS_TRY_LATER: 'Demasiados intentos. Espera un poco y vuelve a probar.',
  ADMIN_ONLY_OPERATION: 'El acceso anónimo no está activado en Firebase.', OPERATION_NOT_ALLOWED: 'Ese tipo de acceso no está activado en Firebase.',
  TOKEN_EXPIRED: 'La sesión ha caducado. Vuelve a entrar.', INVALID_REFRESH_TOKEN: 'La sesión ha caducado. Vuelve a entrar.', USER_NOT_FOUND: 'La sesión ya no vale. Vuelve a entrar.'
};
async function post(url, body, form) {
  let r;
  try { r = await net.fetch(url, { method: 'POST', headers: { 'Content-Type': form ? 'application/x-www-form-urlencoded' : 'application/json' }, body: form ? new URLSearchParams(body).toString() : JSON.stringify(body) }); }
  catch (e) { throw new Error('Sin conexión a internet.'); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { const m = String((j.error && j.error.message) || r.status).split(/[ :]/)[0]; throw new Error(MSG[m] || 'Error de Firebase: ' + m); }
  return j;
}
// El profesor entra con un usuario, no con un correo. Firebase necesita un correo detrás: se forma con el usuario
// y el dominio del propio proyecto (no es un buzón real). Ejemplo: «EvaBDD_Daw1» → evabdd_daw1@modeladosbdd.firebaseapp.com
const DOM = '@' + PROJ + '.firebaseapp.com';
const USER_RX = /^[A-Za-z0-9._-]{3,40}$/;
const userOf = email => String(email || '').toLowerCase().endsWith(DOM) ? String(email).slice(0, -DOM.length) : String(email || '');
const exp = s => Date.now() + (Math.max(60, +s || 3600) - 120) * 1000;

async function anon() { const j = await post(AUTH + 'signUp?key=' + KEY, { returnSecureToken: true }); st.alumno = { uid: j.localId, refresh: j.refreshToken, idToken: j.idToken, exp: exp(j.expiresIn) }; save(); }
async function login(user, pass) {
  load(); user = String(user || '').trim(); if (!user || !pass) throw new Error('Escribe el usuario y la contraseña.');
  if (user.includes('@')) throw new Error('Escribe el usuario del profesor, no un correo.');
  if (!USER_RX.test(user)) throw new Error('Usuario o contraseña incorrectos.');
  const email = user.toLowerCase() + DOM;
  const j = await post(AUTH + 'signInWithPassword?key=' + KEY, { email, password: String(pass), returnSecureToken: true });
  st.profe = { uid: j.localId, email: j.email || email, refresh: j.refreshToken, idToken: j.idToken, exp: exp(j.expiresIn) }; save();
  return { uid: st.profe.uid, user: userOf(st.profe.email) };
}
function logout() { load(); st.profe = null; save(); return true; }
function who() { load(); return { profe: st.profe ? { uid: st.profe.uid, user: userOf(st.profe.email) } : null, alumno: st.alumno ? st.alumno.uid : null }; }
async function token(role) {
  load(); let s = st[role];
  if (!s) { if (role !== 'alumno') throw new Error('Primero inicia sesión como profesor.'); await anon(); return st.alumno.idToken; }
  if (!s.idToken || Date.now() > s.exp) {
    try { const j = await post(TOKEN, { grant_type: 'refresh_token', refresh_token: s.refresh }, true); s.idToken = j.id_token; s.refresh = j.refresh_token || s.refresh; s.exp = exp(j.expires_in); save(); }
    catch (e) { if (/Sin conexión/.test(e.message)) throw e; if (role === 'alumno') { await anon(); return st.alumno.idToken; } st.profe = null; save(); throw e; }
  }
  return s.idToken;
}
// p: ruta dentro de la base de datos (siempre bajo «examenes») o ':runQuery'
async function req(role, method, p, body) {
  if (role !== 'alumno' && role !== 'profe') throw new Error('Rol no válido.');
  p = String(p || ''); method = String(method || 'GET').toUpperCase();
  if (!/^((examenes|compartir)(\/[\w-]+)*(\?[\w.=&%-]*)?|:runQuery)$/.test(p) || !['GET', 'POST', 'PATCH', 'DELETE'].includes(method)) throw new Error('Petición no permitida.');
  const t = await token(role);
  let r;
  try { r = await net.fetch(DOCS + (p.startsWith(':') ? p : '/' + p), { method, headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' }, body: body == null ? undefined : JSON.stringify(body) }); }
  catch (e) { throw new Error('Sin conexión a internet.'); }
  const data = await r.json().catch(() => null);
  return { status: r.status, data, date: Date.parse(r.headers.get('date') || '') || 0, uid: st[role] ? st[role].uid : null };
}
module.exports = { login, logout, who, req };
