/* ===================== Imágenes SVG de cada diagrama (se guardan junto a diagrama.json) ===================== */
const LIGHT={'er-stroke':'#2B2A27','surface':'#FFFFFF','ink':'#22211F','card':'#A2441C','muted':'#6B6A64','bad':'#C0362C',
  'c-ent':'#2F5D8A','e-fill':'#EDF3F9','c-rel':'#9C6510','r-fill':'#FBF2E0','c-att':'#3D7A4E','a-fill':'#EEF6EF','c-key':'#7A4FB8','k-fill':'#F3EDFB',
  'ded-border':'#A9B2C0','ded-head':'#33557F','ded-head-ink':'#FFFFFF','pk':'#8E5FD0','fk':'#B4364E','pk-ink':'#6B3FA8','fk-ink':'#A3304A','col':'#2A7F8F','accent':'#2F6B4F',
  'f-mono':"Consolas,'JetBrains Mono','Courier New',monospace",'f-ui':"'Segoe UI',Arial,sans-serif"};
const SVG_RULES=`.ln{stroke:var(--er-stroke);stroke-width:1.2}.mk{stroke:var(--er-stroke);stroke-width:1.5;fill:none}.mo{fill:var(--surface);stroke:var(--er-stroke);stroke-width:1.5}
.ent{fill:var(--e-fill);stroke:var(--c-ent);stroke-width:1.5}.dia{fill:var(--r-fill);stroke:var(--c-rel);stroke-width:1.5}.att{fill:var(--a-fill);stroke:var(--c-att);stroke-width:1.2}.att.key{fill:var(--k-fill);stroke:var(--c-key)}.att.dr{stroke-dasharray:4 3}
.ent.in,.dia.in{fill:none}.dup{stroke:var(--bad);stroke-width:2.4}
.tx{fill:var(--ink);font:11px var(--f-mono)}.txk{fill:var(--pk-ink);font-weight:600}.tb{font:600 13px var(--f-mono);fill:var(--c-ent)}.tr{font:600 12px var(--f-mono);fill:var(--c-rel)}.tt{font:600 10px var(--f-mono);fill:var(--muted)}
.ul{stroke:var(--pk-ink);stroke-width:1}.ul.p{stroke-dasharray:3 2}.card{font:600 11px var(--f-mono);fill:var(--card);paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round}.cardq{fill:var(--muted)}
.tbox{fill:var(--surface);stroke:var(--ded-border);stroke-width:1}.thd{fill:var(--ded-head)}.thx{font:600 12.5px var(--f-mono);fill:var(--ded-head-ink)}.cx{font:11.5px var(--f-mono);fill:var(--ink)}.cpk{fill:var(--pk-ink);font-weight:600}.cfk{fill:var(--fk-ink)}.cty{fill:var(--muted);font-weight:400}.uq{font:600 9px var(--f-mono);fill:var(--col)}
.lk{stroke:var(--muted);stroke-width:1.4;fill:none}.lk.dash{stroke-dasharray:6 4}.lkm{stroke:var(--muted);stroke-width:1.5;fill:none}.lko{fill:var(--surface);stroke:var(--muted);stroke-width:1.5}
.ipk{fill:var(--pk)}.ifk{fill:var(--fk)}.icol{fill:var(--col)}.inul{fill:none;stroke:var(--col);stroke-width:1.3}
.rbox{fill:var(--surface);stroke:var(--ink);stroke-width:1.1}.rnm{font:600 12.5px var(--f-mono);fill:var(--c-ent)}.rcol{font:12px var(--f-mono);fill:var(--ink)}.rpk{font-weight:700;fill:var(--pk-ink)}.rfk{fill:var(--fk-ink)}.rul{stroke:var(--pk-ink);stroke-width:1.1}
.rtag{font:600 9.5px var(--f-mono);fill:var(--muted)}.rarr{fill:none;stroke:var(--fk);stroke-width:1.1}.rhead{fill:var(--fk)}
.ent.hd,.dia.hd{fill:none}.ktag{font:700 9px var(--f-mono);fill:var(--muted)}.rlab{fill:#FFFFFF;stroke:none;opacity:.92}.dia.assoc{stroke-dasharray:5 3}.ln.lid{stroke-width:2.2}.isal{fill:var(--c-rel)}.skt{fill:var(--c-ent)}
.thx.dup{fill:#FFC2BD}.cx.dup,.rnm.dup,.rcol.dup{fill:var(--bad);text-decoration:underline}
.note{stroke-width:1.2}.note-fold{stroke-width:1.2}.nc-y{fill:#FFF4C2;stroke:#D2AE36}.nc-b{fill:#DDEBFA;stroke:#7AA3D6}.nc-g{fill:#DFF2E1;stroke:#7DBB87}.nc-p{fill:#FBE1EC;stroke:#D98AAE}.note-fold{filter:brightness(.93)}.note-tx{font:12px var(--f-ui);fill:#2B2A27}`;
const SVG_CSS=SVG_RULES.replace(/var\(--([\w-]+)\)/g,(_,k)=>LIGHT[k]||'#000');
function svgParts(p){
  const ed=new Editor(null);ed.p={er:cleanModel(p.er,'er'),rel:cleanModel(p.rel,'rel'),ded:cleanModel(p.ded,'ded')};
  const out={};
  for(const mode of ['er','rel','ded']){
    ed.mode=mode;const m=ed.p[mode];
    const nts=(m.notes||[]).map(n=>{noteSize(n);return[n.x,n.y,n.x+n.w,n.y+n.h];});
    if(mode==='er'?!m.nodes.length&&!nts.length:!m.t.length&&!nts.length){out[mode]=null;continue;}
    let inner,b;
    let bs;
    if(mode==='er'){inner=ed.erString(false);bs=m.nodes.map(n=>[n.x-n.w/2,n.y-n.h/2,n.x+n.w/2,n.y+n.h/2]);}
    else{inner=ed.tablesString(false);bs=m.t.map(t=>mode==='ded'?[t.x,t.y,t.x+t.w,t.y+t.h]:[t.x-26,t.y,t.x+t.rw,t.y+18+t.rh]);}
    bs=[...bs,...nts];b=[Math.min(...bs.map(x=>x[0])),Math.min(...bs.map(x=>x[1])),Math.max(...bs.map(x=>x[2])),Math.max(...bs.map(x=>x[3]))];
    out[mode]={inner,b};
  }
  return out;
}
function standalone({inner,b}){
  const pad=60,x0=Math.floor(b[0]-pad),y0=Math.floor(b[1]-pad),w=Math.ceil(b[2]-b[0]+2*pad),h=Math.ceil(b[3]-b[1]+2*pad);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${w} ${h}" width="${w}" height="${h}"><style>${SVG_CSS}</style><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#ffffff"/>${inner}</svg>\n`;
}
function exportSVGs(p){const parts=svgParts(p),o={};for(const k of ['er','rel','ded'])o[k]=parts[k]?standalone(parts[k]):null;return o;}

/* ===================== Captura: E-R, relacional y DED en una sola imagen ===================== */
const SECCIONES=[['er','Modelo Entidad-Relación'],['rel','Modelo relacional'],['ded','Diagrama de estructura de datos (DED)']];
function captureSVG(p){
  const parts=svgParts(p),secs=SECCIONES.filter(([k])=>parts[k]);
  if(!secs.length)return null;
  const pad=50,M=64,gap=64;
  const W2=Math.round(Math.max(1000,...secs.map(([k])=>parts[k].b[2]-parts[k].b[0]+2*pad))+2*M);
  const fecha=new Date().toLocaleDateString(LANG()==='en'?'en-GB':'es-ES',{day:'numeric',month:'long',year:'numeric'});
  let y=M,body=`<text x="${M}" y="${y+24}" class="h1">${esc(p.name)}</text><text x="${W2-M}" y="${y+24}" text-anchor="end" class="h2">${esc(fecha)}</text>`;
  y+=44;body+=`<line x1="${M}" y1="${y}" x2="${W2-M}" y2="${y}" class="sep"/>`;y+=34;
  secs.forEach(([k,title],i)=>{
    const {inner,b}=parts[k],w=b[2]-b[0]+2*pad,h=b[3]-b[1]+2*pad;
    body+=`<text x="${M}" y="${y+16}" class="h3">${i+1}. ${esc(t(title))}</text>`;y+=30;
    const dx=M+(W2-2*M-w)/2-(b[0]-pad),dy=y-(b[1]-pad);
    body+=`<rect x="${M}" y="${y}" width="${W2-2*M}" height="${Math.ceil(h)}" class="frame"/><g transform="translate(${f1(dx)},${f1(dy)})">${inner}</g>`;
    y+=Math.ceil(h)+gap;
  });
  const H2=Math.round(y-gap+M);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}" viewBox="0 0 ${W2} ${H2}"><style>${SVG_CSS}.h1{font:600 24px 'Segoe UI',Arial,sans-serif;fill:#22211F}.h2{font:14px 'Segoe UI',Arial,sans-serif;fill:#6B6A64}.h3{font:600 16px 'Segoe UI',Arial,sans-serif;fill:#22211F}.sep{stroke:#22211F;stroke-width:1.2}.frame{fill:#FFFFFF;stroke:#E2E0DB}</style><rect width="${W2}" height="${H2}" fill="#F6F5F2"/>${body}</svg>`;
  return {svg,w:W2,h:H2};
}
async function captureProject(p){
  const c=captureSVG(p);if(!c)return null;
  const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(c.svg);await img.decode();
  const sc=Math.min(+Settings.get().captureScale||2,12000/Math.max(c.w,c.h));const cv=document.createElement('canvas');cv.width=Math.round(c.w*sc);cv.height=Math.round(c.h*sc);
  const x=cv.getContext('2d');x.scale(sc,sc);x.drawImage(img,0,0,c.w,c.h);
  return window.api.saveCapture(p.folder,p.name,cv.toDataURL('image/png').split(',')[1]);
}

/* ===================== Exportar a ERDPlus ===================== */
function toERDPlus(er){
  const X=erIdx(er),shapes=[],connectors=[],ids={};let next=1;
  const ed=new Editor(null);er.nodes.forEach(n=>ed.size(n));
  const x0=Math.min(...er.nodes.map(n=>n.x-n.w/2))-60,y0=Math.min(...er.nodes.map(n=>n.y-n.h/2))-60;
  const X0=n=>Math.round(n.x-n.w/2-x0),Y0=n=>Math.round(n.y-n.h/2-y0);
  er.nodes.forEach(n=>ids[n.id]=next++);
  er.nodes.filter(isEnt).forEach(n=>shapes.push({type:'Entity',details:{name:n.n,type:n.k==='weak'?'weak':'regular',x:X0(n),y:Y0(n),id:ids[n.id]}}));
  er.nodes.filter(isAtt).forEach(n=>{const f=n.f||{};
    shapes.push({type:'Attribute',details:{name:n.n,isDerived:!!f.d,isMultivalued:!!f.m,isOptional:!!f.o,isComposite:!!f.c,isUnique:!!(f.k||f.p),x:X0(n),y:Y0(n),id:ids[n.id]}});
    const ow=X.ownerOf(n);if(ow)connectors.push({type:'Connector',details:{id:next++},source:ids[n.id],destination:ids[ow.id]});});
  er.nodes.filter(isRel).forEach(r=>{const en=X.ends(r);
    const slots=en.map((x,i)=>({slotIndex:i,minimum:'',maximum:'',participation:x.mn==='1'?'mandatory':'optional',cardinality:x.mx==='1'?'one':'many',role:'',entityId:ids[x.e.id]}));
    shapes.push({type:'Relationship',details:{name:r.n,isIdentifying:r.k==='idrel',x:X0(r),y:Y0(r),slots,id:ids[r.id]}});
    en.forEach((x,i)=>connectors.push({type:'RelationshipConnector',details:{slotIndex:i,id:next++},source:ids[x.e.id],destination:ids[r.id]}));});
  const width=Math.max(800,...er.nodes.map(n=>X0(n)+n.w+60)),height=Math.max(600,...er.nodes.map(n=>Y0(n)+n.h+60));
  return JSON.stringify({version:2,www:'erdplus.com',shapes,connectors,width,height});
}

/* ===================== Código para exportar / importar ===================== */
const b64u={enc(a){let s='';for(let i=0;i<a.length;i+=0x8000)s+=String.fromCharCode.apply(null,a.subarray(i,i+0x8000));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');},
  dec(t){t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';const s=atob(t),a=new Uint8Array(s.length);for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return a;}};
async function pipeBytes(data,stream){return new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(stream)).arrayBuffer());}
async function toCode(list){
  const json=JSON.stringify({app:'modelado-bases',v:1,by:(()=>{try{const p=Juegos.profile();return p.nick||p.title?p:undefined;}catch(e){return undefined;}})(),proyectos:list.map(p=>{const q=plainProject(p);return{name:q.name,enun:q.enun,sql:q.sql,test:q.test,bo:q.bo,er:q.er,rel:q.rel,ded:q.ded};})});
  return 'MB1-'+b64u.enc(await pipeBytes(json,new CompressionStream('deflate-raw')));
}
async function fromCode(txt){
  const t=String(txt||'').trim();let json;
  if(t.startsWith('{'))json=t;
  else{const m=t.replace(/\s+/g,'');if(!m.startsWith('MB1-'))throw new Error('Ese texto no es un código de Modelado Bases. Debe empezar por MB1-');
    let bytes;try{bytes=b64u.dec(m.slice(4));json=new TextDecoder().decode(await pipeBytes(bytes,new DecompressionStream('deflate-raw')));}catch(e){throw new Error('El código está incompleto o dañado. Cópialo entero otra vez.');}}
  let d;try{d=JSON.parse(json);}catch(e){throw new Error('El código está incompleto o dañado. Cópialo entero otra vez.');}
  const list=(Array.isArray(d.proyectos)?d.proyectos:(d&&d.er?[d]:[])).filter(p=>p&&typeof p==='object');
  if(!list.length)throw new Error('El código no contiene ningún proyecto.');
  list.act=d.act&&typeof d.act==='object'?d.act:null;
  return list;
}


/* ===================== Sincronizar con GitHub ===================== */
// Al abrir: trae lo último (y avisa si la app está abierta en otro ordenador). Mientras trabajas: sube según Ajustes › GitHub. Al cerrar: sube lo último.
const GH={info:null,busy:false,_t:null,_iv:null,dirty:false,
  on(){return !!(this.info&&this.info.enabled&&this.info.url);},
  ago(t){if(!t)return '';const d=new Date(t);return d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});},
  paint(kind,txt){const b=document.getElementById('ghst');if(!b)return;b.hidden=!this.on();if(!this.on())return;b.className='ghst '+(kind||'');b.querySelector('span').textContent=txt;b.title=txt+' · Pulsa para sincronizar ahora';},
  cover(txt){let o=document.getElementById('ghcover');if(!txt){if(o)o.remove();return;}if(!o){o=document.createElement('div');o.id='ghcover';o.innerHTML='<div><span class="spin" aria-hidden="true"></span><b></b><small>No cierres la app.</small></div>';document.body.appendChild(o);}o.querySelector('b').textContent=txt;},
  async load(){try{this.info=await window.api.gitInfo();}catch(e){this.info=null;}this.schedule();this.paint('ok',this.info&&this.info.last?'GitHub · al día '+this.ago(this.info.last):'GitHub');return this.info;},
  schedule(){clearInterval(this._iv);this._iv=null;if(!this.on())return;const m=this.info.push;if(m==='5'||m==='15')this._iv=setInterval(()=>{if(this.dirty)this.sync(false);},(+m)*60000);},
  // Al abrir la app (antes de cargar los proyectos)
  async start(app){await this.load();if(!this.on())return false;this.cover('Trayendo lo último de GitHub…');let r=null;
    try{r=await window.api.gitOpen();}catch(e){r={error:e.message};}finally{this.cover(null);}
    if(r&&r.error){this.paint(r.offline?'warn':'bad',r.offline?'GitHub · sin conexión':'GitHub · error');toast((r.offline?'':'GitHub: ')+r.error,'warn');}
    else this.paint('ok','GitHub · al día '+this.ago(Date.now()));
    if(r&&r.conflicts&&r.conflicts.length)this.showConflicts(app,r.conflicts);
    if(r&&r.other){app.modal(`<h3>La app está abierta en otro ordenador</h3><p>Según GitHub, Modelado Bases está abierta en <b>${esc(r.other.pc)}</b> (desde ${esc(new Date(r.other.t).toLocaleString('es-ES'))}).</p><p>Si trabajas aquí a la vez, al juntar los cambios puede haber dos versiones del mismo proyecto. Lo mejor es cerrarla allí primero.</p><p class="tnote">Si allí ya está cerrada (por ejemplo, se apagó sin internet), puedes seguir aquí sin problema.</p><div class="mrow"><button class="ebtn" data-m="gh-quit">Cerrar la app</button><button class="ebtn pri" data-m="gh-claim">Seguir aquí</button></div>`);}
    else window.api.gitClaim().catch(()=>{});
    return !!(r&&r.changed);},
  showConflicts(app,list){app.modal(`<h3>Se han guardado dos versiones</h3><p>Estos proyectos se cambiaron aquí y en otro ordenador a la vez. No se ha perdido nada: tienes la versión de aquí y, al lado, la del otro ordenador.</p><ul class="plist">${list.map(c=>`<li><b>${esc(c.proyecto)}</b> → la otra está en <b>${esc(c.copia)}</b></li>`).join('')}</ul><p>Quédate con la buena y borra la otra cuando quieras.</p><div class="mrow"><button class="ebtn pri" data-m="close">Entendido</button></div>`);},
  saved(){if(!this.on())return;this.dirty=true;this.paint('','GitHub · cambios sin subir');if(this.info.push==='save'||!this.info.push){clearTimeout(this._t);this._t=setTimeout(()=>this.sync(false),15000);}},
  async sync(manual){if(!this.on()||this.busy)return;this.busy=true;clearTimeout(this._t);this.paint('busy','GitHub · sincronizando…');
    try{await App.flushAll();const r=await window.api.gitSync({});this.dirty=false;this.info.last=r.last;this.paint('ok','GitHub · al día '+this.ago(r.last));
      if(r.changed){await App.refreshFromDisk();if(await Sync.load())App.afterSync();}
      if(r.conflicts&&r.conflicts.length)this.showConflicts(App,r.conflicts);else if(manual)toast('Sincronizado con GitHub.');}
    catch(e){const off=/Sin conexión/.test(e.message);this.paint(off?'warn':'bad',off?'GitHub · sin conexión (pendiente)':'GitHub · error');if(manual||!off)toast(e.message,'warn');}
    finally{this.busy=false;}},
  // Al cerrar: subir lo último (como mucho 25 s; si no hay internet, se sube la próxima vez)
  async close(){if(!this.on()||this.info.onClose===false)return;this.cover('Subiendo tus cambios a GitHub…');
    try{await Promise.race([window.api.gitSync({release:true}),new Promise((_,ko)=>setTimeout(()=>ko(new Error('tarda')),25000))]);}catch(e){}finally{this.cover(null);}}
};

/* ===================== Tema claro / oscuro ===================== */
const Theme={
  get(){try{return localStorage.getItem('mb:theme')||'system';}catch(e){return 'system';}},
  apply(m){try{const sk=Juegos.skinMode();if(sk)m=sk;}catch(e){}if(m==='light'||m==='dark')document.documentElement.setAttribute('data-theme',m);else document.documentElement.removeAttribute('data-theme');
    document.querySelectorAll('[data-theme-set]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeSet===m)));
    try{window.api.setTheme&&window.api.setTheme(m).catch(()=>{});}catch(e){}},
  set(m){try{localStorage.setItem('mb:theme',m);}catch(e){}this.apply(m);if(typeof App!=='undefined'&&App.ed&&App.ed.p&&App.ed.svg)App.ed.render();},
  init(){this.apply(this.get());document.addEventListener('click',e=>{const b=e.target.closest('[data-theme-set]');if(b)this.set(b.dataset.themeSet);});
    window.addEventListener('storage',e=>{if(e.key==='mb:theme')this.apply(this.get());});}
};

/* ===================== Cambiar el tamaño de cada parte ===================== */
const SPLITS={side:{v:'--side-w',def:248,min:170,dir:1},en:{v:'--en-w',def:300,min:170,dir:1},in:{v:'--in-w',def:300,min:220,dir:-1}};
const Splits={
  get(n){return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(SPLITS[n].v))||SPLITS[n].def;},
  max(n){const W=window.innerWidth,other=k=>k===n?0:(k==='en'&&!document.querySelector('.ed-main.withenun')?0:k==='side'&&document.body.classList.contains('solo')?0:this.get(k));
    return Math.max(SPLITS[n].min,W-300-other('side')-other('en')-other('in')-60);},
  set(n,px,save){const c=SPLITS[n];px=Math.round(Math.min(this.max(n),Math.max(c.min,px)));document.documentElement.style.setProperty(c.v,px+'px');
    if(save){try{localStorage.setItem('mb:w:'+n,String(px));}catch(e){}if(typeof App!=='undefined'&&App.ed&&App.ed.p&&App.ed.svg)App.ed.render();}},
  init(){
    for(const n of Object.keys(SPLITS)){let v=null;try{v=localStorage.getItem('mb:w:'+n);}catch(e){}if(v)document.documentElement.style.setProperty(SPLITS[n].v,(+v)+'px');}
    document.addEventListener('pointerdown',e=>{const h=e.target.closest('[data-split]');if(!h||e.button!==0)return;e.preventDefault();
      const n=h.dataset.split,x0=e.clientX,w0=this.get(n);h.classList.add('drag');document.body.classList.add('resizing');h.setPointerCapture(e.pointerId);
      const mv=ev=>this.set(n,w0+SPLITS[n].dir*(ev.clientX-x0),false);
      const up=()=>{h.classList.remove('drag');document.body.classList.remove('resizing');h.removeEventListener('pointermove',mv);h.removeEventListener('pointerup',up);h.removeEventListener('pointercancel',up);this.set(n,this.get(n),true);};
      h.addEventListener('pointermove',mv);h.addEventListener('pointerup',up);h.addEventListener('pointercancel',up);});
    document.addEventListener('dblclick',e=>{const h=e.target.closest('[data-split]');if(h)this.set(h.dataset.split,SPLITS[h.dataset.split].def,true);});
    document.addEventListener('keydown',e=>{const h=e.target.closest&&e.target.closest('[data-split]');if(!h)return;const n=h.dataset.split,st=e.shiftKey?64:16;
      if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();this.set(n,this.get(n)+SPLITS[n].dir*(e.key==='ArrowRight'?st:-st),true);}
      if(e.key==='Home'){e.preventDefault();this.set(n,SPLITS[n].def,true);}});
    window.addEventListener('resize',()=>{for(const n of Object.keys(SPLITS))if(this.get(n)>this.max(n))this.set(n,this.max(n),false);});
  }
};

/* ===================== Textos: controles y novedades ===================== */
const ico=b=>`<svg class="gl" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">${b}</svg>`;
const SET_SECS=[['general','General',ico('<path d="M2.5 8 9 2.5 15.5 8M4 7v8h3.5v-4.5h3V15H14V7" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>')],['apariencia','Apariencia',ico('<circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M9 2.5a6.5 6.5 0 0 0 0 13z" fill="currentColor"/>')],
  ['ventana','Ventana',ico('<rect x="2" y="3" width="14" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2 6.5h14" stroke="currentColor" stroke-width="1.3"/>')],
  ['accesibilidad','Accesibilidad',ico('<circle cx="9" cy="3.5" r="1.6" fill="currentColor"/><path d="M3 6.5h12M9 6.5v4.5l-3 4.5M9 11l3 4.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>')],
  ['lienzo','Lienzo',ico('<path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="6" cy="6" r=".9" fill="currentColor"/><circle cx="9" cy="6" r=".9" fill="currentColor"/><circle cx="12" cy="6" r=".9" fill="currentColor"/><circle cx="6" cy="9" r=".9" fill="currentColor"/><circle cx="9" cy="9" r=".9" fill="currentColor"/><circle cx="12" cy="9" r=".9" fill="currentColor"/><circle cx="6" cy="12" r=".9" fill="currentColor"/><circle cx="9" cy="12" r=".9" fill="currentColor"/><circle cx="12" cy="12" r=".9" fill="currentColor"/>')],
  ['sql','SQL',ico('<ellipse cx="9" cy="4" rx="6" ry="2.2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3 4v10c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2V4M3 9c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2" fill="none" stroke="currentColor" stroke-width="1.3"/>')],
  ['exportar','Guardar y exportar',ico('<path d="M9 2.5v9M5.5 8 9 11.5 12.5 8M3 13.5v2h12v-2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>')],
  ['atajos','Atajos',ico('<rect x="1.5" y="4.5" width="15" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M4 7.5h1.5M7 7.5h1.5M10 7.5h1.5M13 7.5h1M5 10.5h8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>')],
  ['github','GitHub',ico('<path d="M9 1.8a7.2 7.2 0 0 0-2.3 14c.4.1.5-.2.5-.4v-1.3c-2 .4-2.4-.9-2.4-.9-.3-.8-.8-1.1-.8-1.1-.7-.5 0-.5 0-.5.7.1 1.1.8 1.1.8.7 1.1 1.7.8 2.1.6.1-.5.3-.8.5-1-1.6-.2-3.3-.8-3.3-3.6 0-.8.3-1.4.7-1.9 0-.2-.3-.9.1-1.9 0 0 .6-.2 2 .7a6.9 6.9 0 0 1 3.6 0c1.4-.9 2-.7 2-.7.4 1 .1 1.7.1 1.9.5.5.7 1.1.7 1.9 0 2.8-1.7 3.4-3.3 3.6.3.2.5.7.5 1.3v2c0 .2.1.5.5.4A7.2 7.2 0 0 0 9 1.8z" fill="currentColor"/>')],
  ['actualizaciones','Actualizaciones',ico('<path d="M14.5 6.5A6 6 0 1 0 15 11" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M15 2.5v4h-4" fill="none" stroke="currentColor" stroke-width="1.4"/>')],
  ['acerca','Acerca de',ico('<circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M9 8v4.5" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="5.5" r="1" fill="currentColor"/>')]];
const kb=s=>s.split('+').map(k=>`<kbd>${k}</kbd>`).join('+');
const CONTROLS=[
  ['Lienzo',[['Rueda del ratón','Zoom (acercar y alejar)'],['Clic derecho y arrastrar','Moverte por el lienzo (también con la rueda pulsada)'],['Clic en un hueco y arrastrar','Seleccionar varias cosas a la vez'],['Ctrl+clic','Añadir o quitar de la selección'],['@selectAll','Seleccionar todo'],['@find','Buscar en el diagrama'],['@fit','Ajustar la vista'],['@distribute','Distribuir'],['@lock','Bloquear / desbloquear la posición'],['Clic derecho','Menú con opciones del elemento (sin mover el ratón)'],['Arrastrar un elemento','Moverlo (una entidad se lleva sus atributos)'],['Arrastrar un botón','Entidad, Relación, Atributo o Tabla: suéltalo donde lo quieras (un atributo encima de una entidad se une a ella)'],['Flechas','Mover lo seleccionado (con Mayús, más rápido)'],['Varios seleccionados','Alinear y repartir desde el panel derecho']]],
  ['Editar',[['@copy','Copiar'],['@cut','Cortar'],['@paste','Pegar'],['@duplicate','Duplicar'],['@rename','Renombrar'],['@del','Borrar lo seleccionado (también Retroceso)'],['@undo','Deshacer'],['@redo','Rehacer'],['Esc','Cancelar / quitar la selección']]],
  ['Unir y relacionar',[['Mayús+clic','Une lo seleccionado con el elemento que pulses'],['Dos entidades','Al unirlas se crea una relación en medio'],['Mayús+clic en Rel/DED','Relaciona dos tablas: eliges quién recibe la clave'],['Clic en una línea','Poner máximo y mínimo de esa línea']]],
  ['Panel',[['Enter en un atributo','Crea otro atributo en la misma entidad'],['Enter en una columna','Crea otra columna debajo'],['Enter en el nombre de la tabla','Añade una columna']]],
  ['General',[['@save','Guardar'],['Ctrl+1 … Ctrl+7','Enunciado, Boceto, E-R, Relacional, DED, SQL, Probar'],['@controls','Ver estos controles'],['@settings','Ajustes'],['@projector','Modo proyector'],['F11','Pantalla completa']]]
];
const RESUMEN=["Proyectos guardados como carpetas en «Modelados BDD», en el sitio que elijas. Cada uno con su enunciado, E-R, relacional, DED y SQL.", "Boceto y E-R: entidades (normales y débiles), relaciones (binarias, ternarias e identificadoras), jerarquías (ISA) y atributos de todos los tipos. Máximo y mínimo con preguntas sencillas; el tipo (1:1, 1:N, N:M) sale solo.", "Relacional y DED: tablas con PK, FK, NN y Único. Se pueden crear desde el E-R (con o sin las relaciones) y relacionar entre sí con Mayús+clic.", "SQL para MySQL, SQL Server, Oracle o PostgreSQL, con datos de ejemplo; se puede editar, y también al revés: de un SQL dibuja las tablas.", "Pestaña Probar: una base de datos SQLite de verdad dentro de la app para ejecutar consultas y comprobar las claves ajenas.", "Avisa de nombres repetidos, de entidades sin PK y de relaciones a medias antes de pasar a tablas.", "Lienzo grande con zoom, selección múltiple, copiar y pegar, deshacer, Distribuir, alinear, notas y arrastrar los botones hasta donde quieras.", "Inicio con tus últimos proyectos y la teoría explicada con dibujos. Actividades en grupo con tiempo (modo estudiante). Ajustes de accesibilidad. Se guarda solo (y con Ctrl+S). Pasar proyectos con un código, imagen del ejercicio (Captura), exportar a ERDPlus, abrir un proyecto en su propia ventana, tema claro u oscuro. Se actualiza sola."];
const RESUMEN_EN=["Projects saved as folders in «Modelados BDD», wherever you choose. Each one with its brief, E-R, relational, DSD, SQL and tests.",
  "Sketch and E-R: entities (normal and weak), relationships (binary, ternary, identifying), hierarchies (ISA) and every kind of attribute. Maximum and minimum with simple questions; the type (1:1, 1:N, N:M) appears by itself.",
  "Relational and DSD: tables with PK, FK, NN and Unique. They can be created from the E-R (with or without the relationships) and related with Shift+click.",
  "SQL for MySQL, SQL Server, Oracle or PostgreSQL, with sample data. And the other way round: from an SQL script it draws the tables.",
  "Test tab: a real SQLite database inside the app to run queries and check the foreign keys.",
  "Warns about repeated names, entities without a PK and unfinished relationships before converting to tables.",
  "Large canvas with zoom, multiple selection, right-click menu, find (Ctrl+F), copy and paste, undo, Arrange, align, notes and drag-and-drop buttons.",
  "Full theory, accessibility settings, Spanish and English. Saves automatically (and with Ctrl+S), updates itself, shares projects with a code, exports images and ERDPlus files."];
const parOf=f=>{f=String(f||'');const i=f.lastIndexOf('/');return i<0?'':f.slice(0,i);},leafOf=f=>String(f||'').slice(String(f||'').lastIndexOf('/')+1);
const NOVEDADES_EN=["Sync with GitHub (Settings › GitHub). Paste your private repository address, your name and email, and your projects and progress live on GitHub for any computer, each in its chosen folder.","On opening, the app pulls the latest from GitHub; while you work it pushes your changes (on save, every 5 or 15 minutes, or only with the button); on closing it pushes the latest. Without internet it pushes as soon as it is back.","It warns if the app is open on another computer, and if a project is changed in two places it keeps both versions. Nothing is ever lost.","At the bottom, next to the folder, you see the GitHub status. Clicking it syncs right away.","When there is a new version it shows full screen, with «Download and restart» or «Later».","Every «Don't click this» screen (menu, pulls, album, profile and games) is centred and bigger on wide screens.","The «Don't click this» menu is centred and redesigned, with Pulls highlighted at the top. The profile is centred too.","In the Album (and the other game screens) you can now scroll to see every rarity.","You can put your own picture in your profile (Profile › «Upload picture…»). It also shows on Home.","Fixed the «Change…», «Open» and «Use the projects folder» buttons of the progress folder in Settings › General.","«Don't click this» (top): mini-games to earn tokens. Snake (choose speed and size; every 10 wins, 1 token), a culture quiz with more than 1000 questions (10 out of 10 = 1 token) and «Is the diagram right?» with 100 E-R, Relational and DSD diagrams to find their mistakes (5 out of 5 = 1 token).","Pulls with tokens: accent colours and project icons (common 60 %), titles (rare 28 %), full themes (epic 10 %) and special themes, note styles, cursor, frame and effects (legendary 2 %). Legendary guaranteed at 40 pulls, epic guaranteed in 10-pulls. Duplicates give fragments.","Album with your collection and profile with your name, title and theme; shown on Home and in the projects you share. An icon for each project with right-click.","Your progress and settings are also saved in «progreso-modelado.json», in the folder you choose in Settings › General (by default, your projects folder).","The brief highlighter is now manual: choose a marker (Entity, Relationship or Attribute) and drag the mouse over what you want to highlight. The eraser removes it.","Brief highlighter: select a word and mark it as Entity (blue), Relationship (orange) or Attribute (green). It is marked in the whole text, also in the brief next to the canvas. «To the Sketch» creates the entities, their attributes and the lines.","Folders and subfolders to organise projects (e.g. Exercises › Unit 1). Folder button next to «My projects», right-click to create, rename or move, and you can drag projects and folders.","In the Sketch text, relationships with attributes: «Entity1-Entity2; attribute1, attribute2». They are not drawn in the sketch; «To the E-R» puts them on the relationship.","Notes carry over between diagrams: Sketch to E-R, E-R to Relational or DSD, Relational to DSD. They are not repeated if you do it again.","«Find» button in each diagram's toolbar (also Ctrl+F). In the Sketch it also finds attributes.","Associative entity in the E-R: the diamond inside a rectangle. Turn it on in the relationship panel or with right-click; it can be joined to other entities with its own relationship. When converted to tables it gets its own table with the keys of its entities.","In the Relational the arrows, and in the DSD the lines, can be tapped: you see which FK it is, and you can move the FK to the other table or remove the relationship.","In the DSD, the line and «Relate» ask like in the E-R (maximum and minimum on each side) and whether the line is solid or dashed.","In the Relational, «Relate» only asks where the arrow goes (which table gets the FK): no zero, one or many.","«Copy my relational» to the DSD also copies the relationships only with easy mode; otherwise only the tables.","New theory: associative entity, and in the DSD when the line is solid or dashed, with examples.","In the Sketch each line's cardinalities are chosen like in the E-R (maximum 1/N and minimum 0/1) and shown as (min,max) next to each entity.","Small diamond in the middle of Sketch lines. It can be turned off in Settings › Canvas › «Diamond on Sketch lines».","In the Sketch the entities show only their name; attributes are written in the box above and appear with «To the E-R».","Bullets pasted from Word no longer show as little squares in the brief.",'Home screen when the app opens, with your last opened projects (in order, with a diagram thumbnail). «Home» button at the top left.',
  'The theory is now in Home, explained with pictures: E-R model, relational model, DSD, SQL to create tables and SQL queries (SELECT, WHERE, JOIN, GROUP BY…).',
  'Group activity: «Create activity» makes a code with the brief, what to do and the minutes. Each classmate imports it, clicks Start and does it by hand against the clock; when time is up it locks until «Leave student mode».',
  "Sketch with a box to write «Entity; attribute1, attribute2…» above the canvas, and zero (○), one (|) or many (crow's foot) marks next to each entity on the lines. «To the E-R» also brings the attributes and cardinalities.",
  'More settings: what opens first, tab when opening a project, recents, SQL (DBMS, DROP DATABASE, sample rows), saving images and «Export exercise» quality.',
  'The notation option is gone (always Chen again).'];
const NOVEDADES=[
  '2.4: sincronizar con GitHub (Ajustes › GitHub). Pegas la dirección de tu repositorio privado, tu nombre y tu email, y tus proyectos y tu progreso quedan en GitHub para usarlos en cualquier ordenador, cada uno en la carpeta que tenga elegida.',
  '2.4: al abrir la app trae lo último de GitHub; mientras trabajas sube los cambios (al guardar, cada 5 o 15 minutos, o solo con el botón, como elijas); al cerrar sube lo último. Si no hay internet, se sube en cuanto vuelva.',
  '2.4: avisa si la app está abierta en otro ordenador, y si un proyecto se cambia en dos sitios a la vez guarda las dos versiones («Pizzas» y «Pizzas (otro ordenador)»). Nunca se pierde nada.',
  '2.4: abajo, junto a la carpeta, se ve el estado de GitHub (al día, subiendo, sin conexión). Pulsándolo se sincroniza al momento.',
  '2.4: cuando hay una versión nueva sale a pantalla completa, con «Descargar y reiniciar» o «Más tarde».',
  '2.3.2: todas las pantallas de «No cliques esto» (menú, tiradas, álbum, perfil y juegos) salen centradas y más grandes en pantallas anchas.',
  '2.3.1: el menú de «No cliques esto» está centrado y rediseñado, con las Tiradas destacadas arriba. El perfil también está centrado.',
  '2.3.1: en el Álbum (y en las demás pantallas de juegos) ya se puede bajar para ver todas las rarezas.',
  '2.3.1: puedes poner tu propia imagen en el perfil (Perfil › «Subir imagen…»). Sale también en Inicio.',
  '2.3.1: arreglados los botones «Cambiar…», «Abrir» y «Usar la de proyectos» de la carpeta del progreso en Ajustes › General.',
  '2.3: «No cliques esto» (arriba): minijuegos para ganar tokens. Serpiente (eliges velocidad y tamaño; cada 10 partidas superadas, 1 token), Quiz de cultura con más de 1000 preguntas (10 de 10 = 1 token) y «¿Está bien el diagrama?» con 100 diagramas de E-R, Relacional y DED para encontrar sus fallos (5 de 5 = 1 token).',
  '2.3: tiradas con los tokens: colores de acento e iconos de proyecto (común 60 %), títulos (rara 28 %), temas completos (épica 10 %) y temas especiales, estilos de nota, cursor, marco y efectos (legendaria 2 %). Legendaria asegurada a las 40 tiradas y épica asegurada en las de 10. Los repetidos dan fragmentos.',
  '2.3: álbum con tu colección y perfil con tu nombre, título y tema; salen en Inicio y en los proyectos que compartes. Icono para cada proyecto con el botón derecho.',
  '2.3: tu progreso y tus ajustes se guardan también en «progreso-modelado.json», en la carpeta que elijas en Ajustes › General (por defecto, la de tus proyectos). Si la carpeta está en OneDrive o Drive, lo tienes en todos tus ordenadores.',
  '2.3: el subrayador del enunciado ahora es a mano: elige un rotulador (Entidad, Relación o Atributo) y arrastra el ratón sobre lo que quieras subrayar. Con la goma lo quitas.',
  '2.2: subrayador del enunciado: selecciona una palabra y márcala como Entidad (azul), Relación (naranja) o Atributo (verde). Se marca en todo el texto, también en el enunciado de al lado del lienzo. Con «Pasar al Boceto» se crean las entidades, sus atributos y las líneas.',
  '2.2: carpetas y subcarpetas para ordenar los proyectos (por ejemplo Ejercicios › Tema 1). Botón de carpeta junto a «Mis proyectos», botón derecho para crear, renombrar o mover, y se pueden arrastrar proyectos y carpetas.',
  '2.2: en el texto del Boceto, las relaciones con atributos: «Entidad1-Entidad2; atributo1, atributo2». En el boceto no se dibujan, y al «Pasar al E-R» se ponen en la relación.',
  '2.2: las notas pasan de un diagrama a otro: del Boceto al E-R, del E-R al Relacional o al DED, y del Relacional al DED. No se repiten si lo pasas otra vez.',
  '2.2: botón «Buscar» en la barra de cada diagrama (también Ctrl+F). En el Boceto también encuentra atributos.',
  '2.1: entidad asociativa en el E-R: el rombo dentro de un rectángulo. Se activa en el panel de la relación o con el botón derecho, y se puede unir a otras entidades con su propia relación. Al pasar a tablas sale su tabla con las claves de sus entidades.',
  '2.1: en el Relacional las flechas y en el DED las líneas se pueden tocar: ves qué FK es, puedes pasar la FK a la otra tabla o quitar la relación.',
  '2.1: en el DED, la línea y «Relacionar» preguntan como en el E-R (máximo y mínimo de cada lado) y si la línea es continua o discontinua.',
  '2.1: en el Relacional, «Relacionar» solo pregunta hacia dónde va la flecha (qué tabla recibe la FK): sin cero, uno ni muchos.',
  '2.1: «Copiar mi relacional» al DED copia también las relaciones solo con el modo fácil; si no, copia solo las tablas.',
  '2.1: teoría nueva: entidad asociativa, y en el DED cuándo la línea es continua o discontinua, con ejemplos.',
  '2.0.2: en el Boceto las cardinalidades de cada línea se eligen igual que en el E-R (máximo 1/N y mínimo 0/1) y se ven como (mín,máx) junto a cada entidad.',
  '2.0.2: rombo pequeño en el centro de las líneas del Boceto. Se puede quitar en Ajustes › Lienzo › «Rombo en las líneas del Boceto».',
  '2.0.1: en el Boceto las entidades salen solo con su nombre; los atributos se escriben en la zona de arriba y aparecen al «Pasar al E-R».',
  '2.0.1: las viñetas pegadas desde Word ya no salen como cuadraditos en el enunciado.',
  '2.0: pantalla de Inicio al abrir la app, con tus últimos proyectos abiertos (en orden y con una miniatura del diagrama). Botón «Inicio» arriba a la izquierda.',
  '2.0: la teoría está ahora en Inicio, explicada con dibujos: Modelo E-R, Modelo relacional, DED, SQL para crear tablas y SQL de consultas (SELECT, WHERE, JOIN, GROUP BY…).',
  '2.0: actividad conjunta: «Crear actividad» genera un código con el enunciado, lo que hay que hacer y los minutos. Cada compañero lo importa, pulsa Empezar y lo hace a mano con el tiempo contado; al acabar queda bloqueado hasta «Salir del modo estudiante».',
  '2.0: Boceto con una zona para escribir «Entidad; atributo1, atributo2…» encima del lienzo, y en las líneas las marcas de cero (○), uno (|) o muchos (pata de gallo) junto a cada entidad. «Pasar al E-R» lleva también los atributos y las cardinalidades.',
  '2.0: más ajustes: qué sale al abrir, pestaña al abrir un proyecto, recientes, SQL (gestor, DROP DATABASE, filas de ejemplo), guardar imágenes y calidad de «Exportar ejercicio».',
  '2.0: fuera la opción de notaciones (vuelve a ser siempre Chen).',
  '1.9: pestaña Boceto (justo después del Enunciado): solo entidades y líneas entre ellas, para pensar qué se relaciona con qué. «Pasar al E-R» crea las entidades y un rombo por cada línea.',
  '1.9: jerarquías (ISA, generalización / especialización): botón «Jerarquía», total o parcial, exclusiva o solapada, y tres formas de pasarlas a tablas.',
  '1.9: relaciones ternarias más fáciles: selecciona 3 entidades y «Relación ternaria entre las 3»; o une una tercera entidad a una relación.',
  '1.9: «Distribuir» del relacional y del DED rehecho: busca la colocación con menos cruces de líneas y sin líneas por encima de las tablas.',
  '1.9: líneas en ángulo recto en el relacional y el DED (Ajustes › Lienzo).',
  '1.9: bloquear la posición de cualquier elemento (botón derecho o Ctrl+L): no se mueve al arrastrar ni al distribuir.',
  '1.9: comparar dos versiones (botón «Comparar»): con otro proyecto o un código, te dice qué falta, qué sobra y qué cambia, y lo marca en el diagrama.',
  '1.9: los errores de SQL de la pestaña Probar se explican en español, con una pista para arreglarlos y la consulta que falla.',
  '1.9: atajos de teclado a tu gusto (Ajustes › Atajos) y modo proyector para clase (Ctrl+Mayús+P).',
  '1.7.6: tras «Actualizar ahora» la app se vuelve a abrir sola con la versión nueva.',
  '1.7.5: comprobado que la actualización automática funciona: esta versión ha llegado sola.',
  '1.7.4: actualizar ya funciona de verdad: la versión nueva se instala sola (sin depender de PowerShell) y la app se vuelve a abrir.',
  '1.7.3: «Distribuir» también en el relacional y en el DED: arriba las tablas que no dependen de nadie y debajo las que les apuntan, ordenadas para que las flechas se crucen lo menos posible.',
  '1.7.1: la app se cierra del todo al salir, y «Reiniciar y actualizar» la vuelve a abrir con la versión nueva.',
  '1.7.2: Importar de MySQL Workbench o phpMyAdmin (pestaña SQL): abre un modelo .mwb o un .sql exportado de ellos y dibuja el DED y el relacional. Exportar sigue en el botón de al lado.',
  '1.7.1: si abres la app desde dentro del .zip (o .rar) sin extraerla, te avisa y te explica cómo extraerla.',
  '1.7: menú del botón derecho en cada elemento (renombrar, añadir atributo, entidad débil, clave primaria, opcional, duplicar, borrar…). Mantener pulsado y arrastrar sigue moviendo el lienzo.',
  '1.7: buscar en el diagrama con Ctrl+F: entidades, relaciones, atributos, tablas, columnas y notas.',
  '1.7: la app también está en inglés (Ajustes › Apariencia › Idioma).',
  '1.7: nueva pestaña Probar en cada proyecto: una base de datos SQLite dentro de la app. Créala desde el DED o el SQL, rellénala con datos de ejemplo, ejecuta consultas y comprueba que las claves ajenas funcionan.',
  '1.7: datos de ejemplo: INSERT coherentes que respetan PK, FK y UNIQUE.',
  '1.7: SQL para MySQL, SQL Server, Oracle o PostgreSQL: cambian los tipos y los detalles de cada uno.',
  '1.7: atajos nuevos: F2 renombrar, Ctrl+D duplicar, Ctrl+F buscar, Ctrl+6 pestaña Probar.',
  '1.7: «Para Workbench / phpMyAdmin» (pestaña SQL): guarda un .sql para MySQL que MySQL Workbench convierte en diagrama y phpMyAdmin importa como base de datos.',
  '1.6.4: arreglado el fallo «ENOTEMPTY» al actualizar. La descarga de las versiones nuevas se ve abajo, con su porcentaje.',
  '1.6.3: aspecto de aplicación, con la barra de título integrada y los botones de Windows.',
  '1.6.3: Ajustes (rueda dentada arriba a la derecha o Ctrl+,): tema y color, ventana (al abrir, siempre encima, pantalla completa), accesibilidad (tamaño, alto contraste, líneas gruesas, colores para daltonismo), lienzo y actualizaciones.',
  '1.6.3: Teoría completa dentro de la app (botón del libro o Ajustes › Teoría), con buscador.',
  '1.6.3: Notas: apuntes de colores pegados al diagrama, en el E-R, el relacional y el DED.',
  '1.6.3: Alinear y repartir: selecciona varios elementos y usa los botones del panel derecho.',
  '1.6.3: Importar de ERDPlus (archivos .erdplus) a tu E-R.',
  '1.6.3: Importar SQL: pega un script con CREATE TABLE (o abre un .sql) y la app dibuja el DED y el relacional.',
  '1.6.2: se actualiza sola. Cuando hay una versión nueva se descarga mientras usas la app y se instala al cerrarla; la próxima vez que la abras ya está al día. Si tienes prisa, «Reiniciar y actualizar» en la barra de abajo.',
  '1.6.1: «Actualizar ahora»: la app descarga la versión nueva, se cierra y se vuelve a abrir ya actualizada, sin descomprimir nada.',
  '1.6: avisa cuando hay una versión nueva y la descarga con un solo botón (a tu carpeta Descargas). También puedes buscarla tú desde «Buscar actualizaciones» (pulsando la versión, arriba a la izquierda).',
  '1.5.7: vuelve «Exportar ejercicio»: guarda una imagen con el E-R, el relacional y el DED en la subcarpeta Captura. Y «Capturas de todos» en la barra lateral.',
  '1.5.6: Entidad, Relación, Atributo y Tabla se pueden arrastrar desde la barra hasta donde las quieras (o pulsarlas, como antes).',
  '1.5.6: «Código de todos» en la barra lateral ya no se corta.',
  '1.5.5: «Distribuir» rehecho: entidades en cuadrícula según sus relaciones, cada relación entre sus entidades y los atributos alrededor sin pisar las líneas.',
  '1.5.5: las claves primarias ahora son violetas, para no confundirlas con las relaciones.',
  '1.5.1: el guardado vuelve a ser automático, y además puedes guardar a mano con Ctrl+S o con el botón Guardar.',
  'La rueda del ratón hace zoom directamente.',
  'Selección de varias cosas arrastrando, y copiar, cortar y pegar (Ctrl+C, Ctrl+X, Ctrl+V).',
  'Mayús+clic para unir. Al unir dos entidades se crea la relación en medio.',
  'Cada atributo se edita desde el propio atributo. Preguntas de cardinalidad más cortas: «Pizzería ¿cuántas/os Animatrónico puede tener como…».',
  'Nombres repetidos en rojo. No deja pasar el E-R a tablas si falta una PK o una relación está a medias.',
  'Modo fácil: al pasar desde el E-R también se pasan las relaciones (FK y tablas N:M). Las tablas salen colocadas como en tu E-R.',
  'Relacionar tablas en el relacional y el DED: eliges quién recibe la clave y el tipo (1:N, 1:1, N:M).',
  'Nueva pestaña SQL: genera el CREATE TABLE desde el DED o el relacional, y lo puedes editar.',
  'Exportar a ERDPlus, botón Distribuir, Vaciar diagrama y Vaciar proyecto.',
  'Abrir un proyecto en su propia ventana, a pantalla completa.',
  'Se guarda solo cada vez que cambias algo, y también a mano con Ctrl+S o el botón Guardar. Columnas NOT NULL por defecto.',
  'Botón Controles con todos los atajos. Colores suaves para cada tipo de elemento y nuevo aspecto.',
];

/* ===================== App ===================== */
const SOLO=new URLSearchParams(location.search).get('solo');
const App={
  projects:[], cur:null, view:'er', open:{}, ed:null, base:'', locked:new Set(), solo:SOLO,
  get autosave(){return true;},
  async start(){
    if(this.solo)document.body.classList.add('solo');
    Sync.hook();Settings.init();I18N.start();try{window.api.setLang(LANG());}catch(e){}Theme.init();Splits.init();this.ed=new Editor(this);this.bind();setInterval(()=>this.actTick(),1000);
    window.api.onCloseRequest(()=>this.onCloseRequest());
    window.api.onWindows(l=>{this.locked=new Set(l);this.renderTree();if(this.cur&&this.view)this.renderMain();});
    window.api.onWindowClosed(f=>this.afterWindow(f));
    try{this.base=await window.api.baseGet();}catch(e){}
    if(this.base&&!this.solo){const fresh=await Sync.load();Sync._ready=true;if(fresh)this.afterSync(true);}else Sync._ready=!this.solo;
    Juegos._s=null;
    try{this._prog=await window.api.progInfo();}catch(e){}
    Juegos.apply();
    this.renderFoot();
    if(this.solo){await this.startSolo();return;}
    setTimeout(()=>this.archiveWarn(),900);
    if(!this.base){this.showSetup();this.maybeNews();setTimeout(()=>this.checkUpdates(false),1500);return;}
    try{this.locked=new Set(await window.api.windows());}catch(e){}
    try{if(await GH.start(this)){if(await Sync.load())this.afterSync(true);}}catch(e){}
    let back=null;try{back=JSON.parse(sessionStorage.getItem('mb:reopen')||'null');sessionStorage.removeItem('mb:reopen');}catch(e){}
    await this.reload(back&&back.f);if(back&&back.f&&this.cur&&VIEWS[back.v]){this.go(this.cur,back.v);if(back.set)this.showSettings(back.set);}
    else if(back&&back.home){this.home=back.home;this.renderMain();}
    else if(!this.cur&&Settings.get().startScreen==='last'){const r=Recent.get().map(x=>this.projects.find(p=>p.folder===x.f)).find(Boolean);if(r)this.go(r,Settings.get().openTab||'er');}
    this.maybeNews();
    setTimeout(()=>this.checkUpdates(false),1500);
  },
  // Tras traer cambios de GitHub: volver a leer los proyectos del disco (no hay nada sin guardar: se guarda antes de sincronizar)
  async refreshFromDisk(){const f=this.cur&&this.cur.folder,v=this.view,home=this.home;this.projects=[];this.cur=null;await this.reload(f);if(!home&&this.cur&&v&&VIEWS[v])this.go(this.cur,v);else{this.renderTree();this.renderMain();}},
  // Tras traer el progreso del archivo: volver a leer ajustes, tema y juegos sin recargar la ventana
  afterSync(quiet){try{Settings._c=null;Settings.apply(Settings.get());}catch(e){}try{Theme.apply(Theme.get());}catch(e){}Juegos._s=null;Juegos.apply();
    if(!quiet){this.renderTree();this.renderMain();}},
  keepPlace(){try{sessionStorage.setItem('mb:reopen',JSON.stringify({f:this.home?null:this.cur&&this.cur.folder,v:this.view,home:this.home||null,set:this.settingsOpen?this._sec:null}));}catch(e){}},
  async startSolo(){
    try{const p=await window.api.load(this.solo);p._id=uid('p');this.projects=[p];this.cur=p;this.view='er';this.status('ok','Todo guardado');
      document.title=p.name+' · Modelado Bases';}
    catch(e){this.status('bad','No se pudo abrir el proyecto: '+e.message);}
    this.renderMain();
  },
  async archiveWarn(){
    let a=false;try{a=await window.api.fromArchive();}catch(e){}
    if(!a||document.querySelector('.mbox'))return;
    this.modal(`<h3>Estás abriendo la app desde dentro del .zip</h3><p>Así Windows (o WinRAR) la saca a una carpeta temporal: <b>no se puede actualizar</b> y esa carpeta se borra cuando cierras.</p>
      <ol class="steps"><li>Cierra Modelado Bases.</li><li>Clic derecho en el .zip › <b>Extraer todo…</b> (con WinRAR: <b>Extraer aquí</b>) y ponlo, por ejemplo, en Documentos.</li><li>Abre <b>Modelado Bases.exe</b> desde la carpeta extraída. Consejo: clic derecho › Enviar a › Escritorio (crear acceso directo).</li></ol>
      <p class="tnote">Tus proyectos no se pierden: están en la carpeta Modelados BDD, que es aparte.</p><div class="mrow"><button class="ebtn pri" data-m="close">Entendido</button></div>`);
  },
  async checkUpdates(manual){
    if(this.solo)return;
    let r;try{r=await window.api.updateCheck();}catch(e){if(manual)toast('No se ha podido comprobar: no hay conexión o GitHub no responde.','warn');return;}
    if(!r.tag||!r.newer){if(manual)toast(`Ya tienes la última versión (${VERSION}).`);return;}
    // Versión nueva: pantalla completa con «Descargar y reiniciar» o «Más tarde»
    if(r.canInstall&&!(this._updLater===r.tag&&!manual)){this._upd=r;this.updateScreen(r);return;}
    if(!manual&&r.canInstall&&Settings.get().autoUpdate){this._upd=r;this.prepareSilently(r);return;}
    let skip=null,later=0;try{skip=localStorage.getItem('mb:upd:skip');later=+localStorage.getItem('mb:upd:later')||0;}catch(e){}
    if(!manual&&(skip===r.tag||Date.now()-later<20*3600e3))return;
    const show=()=>{
      if(!document.getElementById('modal').hidden){setTimeout(show,1200);return;}
      this._upd=r;const ver=String(r.tag).replace(/^v/i,''),mb=r.asset&&r.asset.size?` (${(r.asset.size/1048576).toFixed(0)} MB)`:'';
      this.modal(`<h3>Hay una versión nueva: ${esc(ver)}</h3><p>Tienes la ${esc(VERSION)}. Tus proyectos no se tocan al actualizar.</p>
        ${r.body?`<div class="relnotes">${esc(r.body)}</div>`:''}
        <div class="dlbar" id="dlbar" hidden><div class="dlfill" id="dlfill"></div></div><p class="mmeta" id="dltxt" hidden></p>
        <div class="mrow"><button class="lnk mmeta" data-m="upd-skip">No avisar de esta versión</button>${r.canInstall?'<button class="ebtn" data-m="upd-get">Solo descargar el zip</button>':''}<button class="ebtn" data-m="upd-later">Más tarde</button>${r.canInstall?`<button class="ebtn pri" data-m="upd-install">Actualizar ahora${mb}</button>`:`<button class="ebtn pri" data-m="upd-get">${r.asset?'Descargar'+mb:'Abrir la página de descarga'}</button>`}</div>
        ${r.canInstall?'<p class="mmeta" style="margin:6px 0 0">«Actualizar ahora» descarga la versión nueva, cierra la app y la vuelve a abrir ya actualizada.</p>':''}`);};
    show();
  },
  updateScreen(r){if(document.getElementById('updfull'))return;const ver=String(r.tag).replace(/^v/i,''),mb=r.asset&&r.asset.size?` · ${(r.asset.size/1048576).toFixed(0)} MB`:'';
    const o=document.createElement('div');o.id='updfull';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-labelledby','updfull-t');
    o.innerHTML=`<div class="uf-box"><div class="uf-ic" aria-hidden="true">⬆</div><p class="uf-k">Actualización disponible</p><h2 id="updfull-t">Modelado Bases ${esc(ver)}</h2><p class="uf-sub">Tienes la ${esc(VERSION)}${mb}. Tus proyectos y tu progreso no se tocan.</p>
      ${r.body?`<div class="uf-notes">${esc(r.body)}</div>`:''}
      <div class="uf-bar" hidden><i></i></div><p class="uf-txt" hidden></p>
      <div class="uf-btns"><button class="ebtn big" data-uf="later">Más tarde</button><button class="ebtn pri big" data-uf="go">Descargar y reiniciar</button></div></div>`;
    document.body.appendChild(o);o.querySelector('[data-uf=go]').focus();
    o.addEventListener('click',async e=>{const b=e.target.closest('[data-uf]');if(!b)return;
      if(b.dataset.uf==='later'){this._updLater=r.tag;o.remove();if(Settings.get().autoUpdate)this.prepareSilently(r);else{const el=document.getElementById('updready');if(el){el.hidden=false;el.innerHTML=`<span class="sb-sep"></span><span class="upd-dot"></span><span>Versión ${esc(ver)} disponible</span><button class="sbtn" data-act="upd-show">Actualizar</button>`;}}return;}
      o.querySelectorAll('[data-uf]').forEach(x=>x.disabled=true);b.textContent='Descargando…';const bar=o.querySelector('.uf-bar'),fill=bar.querySelector('i'),txt=o.querySelector('.uf-txt');bar.hidden=false;txt.hidden=false;
      this._ufFill=(pc,t)=>{fill.style.width=pc+'%';txt.textContent=t;};this.bindProgress();
      try{await this.flushAll();await GH.close();await window.api.updateInstall(r.asset.url);txt.textContent='Listo. La app se cierra y se vuelve a abrir sola con la versión nueva.';b.textContent='Reiniciando…';}
      catch(err){o.querySelectorAll('[data-uf]').forEach(x=>x.disabled=false);b.textContent='Reintentar';txt.textContent='No se pudo actualizar: '+err.message;}});},
  bindProgress(){
    if(this._dlBound)return;this._dlBound=true;
    window.api.onUpdateProgress(({got,total,phase})=>{
      const pc=total?Math.min(100,got/total*100):0,mb=`${(got/1048576).toFixed(1)}${total?' de '+(total/1048576).toFixed(1):''} MB`;
      // Ventana de actualización
      const f=document.getElementById('dlfill'),t=document.getElementById('dltxt');
      if(f&&t){if(phase==='extract'){f.style.width='100%';t.textContent='Preparando la instalación…';}else{f.style.width=pc.toFixed(1)+'%';t.textContent=`Descargando… ${Math.floor(pc)} % (${mb})`;}}
      if(this._ufFill)this._ufFill(phase==='extract'?100:pc.toFixed(1),phase==='extract'?'Preparando la instalación…':`Descargando… ${Math.floor(pc)} % (${mb})`);
      // Barra de abajo (descarga en segundo plano)
      const st=document.getElementById('updtxt'),bar=document.getElementById('updfill');
      if(st&&this._bgVer){if(phase==='extract'){st.textContent=`Preparando la versión ${this._bgVer}…`;if(bar)bar.style.width='100%';}
        else{st.textContent=`Descargando la versión ${this._bgVer}… ${Math.floor(pc)} %`;if(bar)bar.style.width=pc.toFixed(1)+'%';st.title=mb;}}
    });
  },
  async prepareSilently(r){
    const el=document.getElementById('updready');if(!el)return;
    const ver=this._bgVer=String(r.tag).replace(/^v/i,'');
    el.innerHTML=`<span class="sb-sep"></span><span class="upd-mini"><span class="upd-fill" id="updfill"></span></span><span id="updtxt">Descargando la versión ${esc(ver)}…</span>`;el.hidden=false;
    this.bindProgress();
    try{await window.api.updatePrepare(r.asset.url);}
    catch(e){el.innerHTML=`<span class="sb-sep"></span><span class="upd-dot bad"></span><span title="${escA(e.message)}">No se pudo descargar la versión ${esc(ver)}</span><button class="sbtn" data-act="upd-retry">Reintentar</button>`;return;}
    el.innerHTML=`<span class="sb-sep"></span><span class="upd-dot"></span><span>Versión ${esc(ver)} lista: se instalará al cerrar</span><button class="sbtn" data-act="upd-now" title="Cierra la app, instala la versión nueva y la vuelve a abrir">Reiniciar y actualizar</button>`;
  },
  async installUpdate(btn){
    const r=this._upd;if(!r||!r.asset)return;
    document.querySelectorAll('.mbox [data-m]').forEach(b=>b.disabled=true);btn.textContent='Descargando…';
    const bar=document.getElementById('dlbar'),txt=document.getElementById('dltxt');bar.hidden=false;txt.hidden=false;
    this.bindProgress();
    try{await this.flushAll();await window.api.updateInstall(r.asset.url);
      txt.textContent='Listo. Modelado Bases se va a cerrar y se abrirá sola con la versión nueva en unos segundos.';btn.textContent='Instalando…';}
    catch(e){document.querySelectorAll('.mbox [data-m]').forEach(b=>b.disabled=false);btn.textContent='Reintentar';txt.textContent='No se pudo actualizar: '+e.message+' Puedes usar «Solo descargar el zip».';}
  },
  async downloadUpdate(btn){
    const r=this._upd;if(!r)return;
    if(!r.asset){window.api.updatePage();this.closeModal();return;}
    btn.disabled=true;btn.textContent='Descargando…';document.querySelectorAll('[data-m=upd-later],[data-m=upd-skip]').forEach(b=>b.disabled=true);
    const bar=document.getElementById('dlbar'),fill=document.getElementById('dlfill'),txt=document.getElementById('dltxt');bar.hidden=false;txt.hidden=false;
    this.bindProgress();
    try{
      const f=await window.api.updateDownload(r.asset.url);
      this.modal(`<h3>Descarga completa</h3><p>La versión nueva está en tu carpeta <b>Descargas</b>:</p><div class="folder-demo" style="margin:0">${esc(f)}</div>
        <p style="margin-top:10px">Para instalarla: <b>cierra Modelado Bases</b>, descomprime el zip y abre el programa nuevo (puedes sustituir la carpeta del anterior). Tus proyectos siguen en <b>Modelados BDD</b>.</p>
        <div class="mrow"><button class="ebtn" data-m="close">Cerrar</button><button class="ebtn pri" data-m="showfile" data-f="${escA(f)}">Mostrar en la carpeta</button></div>`);
    }catch(e){btn.disabled=false;btn.textContent='Reintentar';document.querySelectorAll('[data-m=upd-later],[data-m=upd-skip]').forEach(b=>b.disabled=false);txt.textContent='No se pudo descargar: '+e.message;}
  },
  // Al actualizar solo salen las notas de la versión; el resumen del programa, solo la primera vez (o desplegándolo)
  maybeNews(){let seen=null;try{seen=localStorage.getItem('mb:seen');}catch(e){}if(seen!==VERSION){this.showNews(seen==null);try{localStorage.setItem('mb:seen',VERSION);}catch(e){}}},
  showNews(full){const en=LANG()==='en',RES=en?RESUMEN_EN:RESUMEN,mm=VERSION.split('.').slice(0,2).join('.'),mine=n=>VERSION.split('.').length>2?n.startsWith(VERSION+':'):(n.startsWith(mm+':')||n.startsWith(mm+'.')),NOV=en?NOVEDADES_EN.slice(0,NOVEDADES.filter(mine).length):NOVEDADES.filter(mine).map(n=>{const t=n.slice(n.indexOf(':')+2);return t.charAt(0).toUpperCase()+t.slice(1);});
    const res=`<ul class="news notr">${RES.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>`;
    this.modal(`<h3>${full?'Modelado Bases '+VERSION:'Novedades de la '+VERSION}</h3>${full?`<p>Programa para hacer el E-R, el relacional, el DED y el SQL de tus ejercicios de bases de datos.</p><p class="news-h">Qué puedes hacer</p>${res}<p class="news-h">Novedades de la ${VERSION}</p>`:''}<ul class="news notr">${NOV.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>${full?'':`<details class="older"><summary>Qué puede hacer el programa</summary>${res}</details>`}${en?'':`<details class="older"><summary>Cambios anteriores</summary><ul class="news">${NOVEDADES.filter(n=>!mine(n)).map(n=>`<li>${esc(n)}</li>`).join('')}</ul></details>`}<div class="mrow"><button class="lnk mmeta" data-m="upd-check">Buscar actualizaciones</button><button class="ebtn" data-m="controls">Ver controles</button><button class="ebtn pri" data-m="close">Empezar</button></div>`);},
  showSettings(sec){this._sec=sec||this._sec||'general';this.settingsOpen=true;
    this.modal(`<div class="set-wrap"><nav class="set-nav" aria-label="Ajustes"><p class="set-title">Ajustes</p>${SET_SECS.map(([k,t,ic])=>`<button class="set-nb" data-sec="${k}">${ic}<span>${t}</span></button>`).join('')}</nav><div class="set-body" id="setbody"></div><button class="set-x" data-m="close" aria-label="Cerrar ajustes" title="Cerrar (Esc)">✕</button></div>`,'settings');
    this.renderSettings();},
  renderSettings(){
    const body=document.getElementById('setbody');if(!body)return;const c=Settings.get(),sec=this._sec;
    document.querySelectorAll('.set-nb').forEach(b=>b.setAttribute('aria-current',String(b.dataset.sec===sec)));
    const tog=(k,t,sub)=>`<label class="chk"><input type="checkbox" data-set="${k}" ${c[k]?'checked':''}><span class="chk-t">${t}${sub?`<small>${sub}</small>`:''}</span><span class="sw" aria-hidden="true"></span></label>`;
    const seg=(k,t,sub,opts)=>`<div class="set-row"><div class="set-lab"><b>${t}</b>${sub?`<small>${sub}</small>`:''}</div><div class="seg" role="group" aria-label="${escA(t)}">${opts.map(([v,l])=>`<button class="segb" data-setv="${k}" data-v="${v}" aria-pressed="${String(c[k])===String(v)}">${l}</button>`).join('')}</div></div>`;
    const H=(t,sub)=>`<h3>${t}</h3>${sub?`<p class="set-sub">${sub}</p>`:''}`;
    let h='';
    if(sec==='general'){h=H('General')+seg('startScreen','Al abrir la app','Inicio: últimos proyectos y teoría. Último proyecto: entra directo donde lo dejaste.',[['home','Inicio'],['last','Último proyecto']])+
        seg('openTab','Pestaña al abrir un proyecto','Desde Inicio o desde la lista de la izquierda.',[['enun','Enunciado'],['bo','Boceto'],['er','E-R'],['rel','Relacional'],['ded','DED']])+
        seg('recentN','Proyectos recientes en Inicio','',[[4,'4'],[8,'8'],[12,'12'],[20,'20']])+
        (()=>{const P=this._prog||{};return `<div class="set-row"><div class="set-lab"><b>Dónde se guarda tu progreso</b><small>Tokens, premios, temas, ajustes, atajos y recientes, en <code>progreso-modelado.json</code>. Ahora: <code>${esc(P.dir||'—')}</code>${P.custom?'':' (la carpeta de proyectos)'}. Si eliges una carpeta que ya tiene un progreso más nuevo, se carga ese.</small></div><div class="row"><button class="ebtn" data-act="prog-choose">Cambiar…</button><button class="ebtn" data-act="prog-reveal">Abrir</button>${P.custom?'<button class="ebtn" data-act="prog-reset">Usar la de proyectos</button>':''}</div></div>`;})()+
        tog('showEnun','Enunciado al lado del diagrama','Al abrir un diagrama, el enunciado se ve a la izquierda (también con el botón «Enunciado»).')+
        tog('pinInsp','Panel de propiedades siempre visible','Si no, se oculta cuando no hay nada seleccionado.');}
    else if(sec==='sql'){h=H('SQL')+seg('sqlDialect','Gestor por defecto','Para qué se genera el SQL (también se cambia en la pestaña SQL).',[['mysql','MySQL'],['sqlserver','SQL Server'],['oracle','Oracle'],['postgres','PostgreSQL']])+
        tog('sqlDrop','Empezar borrando la base de datos','El script empieza con DROP DATABASE IF EXISTS: así se puede ejecutar varias veces. Quítalo si no quieres perder una base que ya tengas.')+
        seg('sampleRows','Filas de datos de ejemplo','Cuántas filas por tabla en «Añadir datos de ejemplo» y en la pestaña Probar.',[[3,'3'],[5,'5'],[10,'10'],[20,'20']])+
        tog('easy','Modo fácil activado al empezar','Al «Pasar desde mi E-R» también se pasan las relaciones (claves ajenas y tablas N:M).');}
    else if(sec==='exportar'){h=H('Guardar y exportar','Todo se guarda solo al momento, y también con Ctrl+S.')+
        tog('svgFiles','Guardar también una imagen de cada diagrama','Un archivo diagrama.svg junto a cada diagrama.json, para abrirlo sin la app.')+
        seg('captureScale','Calidad de «Exportar ejercicio»','Tamaño de la imagen PNG. Más grande se ve mejor al imprimir, pero ocupa más.',[[1,'Normal'],[2,'Alta'],[3,'Muy alta']]);}
    else if(sec==='apariencia'){const th=Theme.get();
      h=H('Apariencia')+`<div class="set-row"><div class="set-lab"><b>Tema</b><small>Auto sigue el modo de Windows.</small></div><div class="seg">${[['light','Claro'],['dark','Oscuro'],['system','Auto']].map(([v,l])=>`<button class="segb" data-theme-set="${v}" aria-pressed="${th===v}">${l}</button>`).join('')}</div></div>`+
        seg('accent','Color principal','Botones, pestañas y selección.',[['green','Verde'],['blue','Azul'],['purple','Morado'],['orange','Naranja']])+
        `<div class="set-row"><div class="set-lab"><b>Idioma</b><small>Idioma de la aplicación.</small></div><div class="seg" role="group" aria-label="Idioma"><button class="segb notr" data-setv="lang" data-v="es" aria-pressed="${LANG()==='es'}">Español</button><button class="segb notr" data-setv="lang" data-v="en" aria-pressed="${LANG()==='en'}">English</button></div></div>`+
        `<div class="set-prev"><span class="set-chip">Así se ve</span><button class="ebtn pri" tabindex="-1">Botón</button><button class="ebtn" aria-pressed="true" tabindex="-1">Activado</button></div>`;}
    else if(sec==='ventana'){h=H('Ventana')+seg('winStart','Al abrir la app','',[['max','Maximizada'],['remember','Como la dejé'],['normal','Ventana normal']])+
        tog('onTop','Siempre visible encima','La ventana se queda por encima de las demás (útil para copiar de un PDF).')+
        `<div class="set-row"><div class="set-lab"><b>Pantalla completa</b><small>También con la tecla F11.</small></div><button class="ebtn" data-m="fullscreen">Pantalla completa</button></div>`+
        `<div class="set-row"><div class="set-lab"><b>Proyecto en su propia ventana</b><small>Desde cada proyecto, botón «Abrir en ventana».</small></div></div>`;}
    else if(sec==='accesibilidad'){h=H('Accesibilidad')+seg('uiScale','Tamaño de la interfaz','Agranda letras, botones y paneles.',[[90,'90 %'],[100,'100 %'],[110,'110 %'],[125,'125 %'],[150,'150 %']])+
        tog('contrast','Alto contraste','Bordes y textos más marcados.')+tog('thick','Líneas más gruesas en los diagramas','Entidades, relaciones, tablas y flechas se ven mejor.')+
        tog('cb','Colores para daltonismo','Cambia los colores de los diagramas por otros que se distinguen con cualquier tipo de daltonismo.')+
        tog('projector','Modo proyector','Para enseñarlo en clase: tema claro, alto contraste, líneas gruesas y todo más grande. Atajo: '+(keyLabel('projector')||'—')+'.')+
        tog('focusAll','Marcar siempre el elemento activo','Un borde de color en el botón o campo donde estás, también con el ratón.')+tog('reduceMotion','Reducir animaciones','Quita transiciones y movimientos.');}
    else if(sec==='github'){const g=GH.info||{},on=GH.on(),opt=(k,v,l)=>`<button class="segb" data-gho="${k}" data-v="${v}" aria-pressed="${String((g[k]===undefined?{push:'save',onClose:true,lock:true}[k]:g[k]))===String(v)}">${l}</button>`;
      h=H('GitHub','Guarda tus proyectos y tu progreso en un repositorio tuyo de GitHub para tenerlos en todos tus ordenadores.')+
        (on?`<div class="gh-ok">${ico('<path d="M3.5 9.5 7 13l7.5-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>')}<div><b>Conectado</b><small>${esc(g.url)} · ${esc(g.name||'')} · en este ordenador: ${esc(g.pc||'')}${g.last?' · última vez: '+esc(new Date(g.last).toLocaleString('es-ES')):''}</small></div><button class="ebtn pri" data-ghact="sync">Sincronizar ahora</button></div>`:
          `<ol class="gh-steps"><li>Crea una cuenta en <b>github.com</b> (gratis) y un repositorio <b>privado</b> vacío, por ejemplo <code>modelados-bdd</code>.</li><li>Instala <b>Git para Windows</b> (git-scm.com) con las opciones normales.</li><li>Pega aquí la dirección del repositorio, tu nombre y tu email, y pulsa <b>Comprobar y conectar</b>. La primera vez se abre una ventana de GitHub para iniciar sesión: acéptala y queda recordado.</li></ol>`)+
        `<div class="gh-form"><label><b>Dirección del repositorio</b><input id="ghurl" placeholder="https://github.com/tu-usuario/modelados-bdd.git" value="${escA(g.url||'')}" spellcheck="false"></label>
          <label><b>Tu nombre</b><input id="ghname" placeholder="Por ejemplo: Ale" value="${escA(g.name||'')}"></label>
          <label><b>Tu email</b><input id="ghemail" placeholder="tu email o el privado de GitHub (…@users.noreply.github.com)" value="${escA(g.email||'')}" spellcheck="false"></label>
          <div class="row"><button class="ebtn pri" data-ghact="setup">${on?'Guardar y comprobar':'Comprobar y conectar'}</button>${on?'<button class="ebtn danger" data-ghact="off">Desconectar</button>':''}<span class="tnote" id="ghmsg"></span></div></div>`+
        (on?`<p class="set-g">Cuándo se sincroniza</p><div class="set-row"><div class="set-lab"><b>Al abrir la app</b><small>Siempre trae lo último de GitHub antes de empezar.</small></div><span class="tnote">Siempre</span></div>
          <div class="set-row"><div class="set-lab"><b>Subir mientras trabajas</b><small>Si no hay internet, se sube en cuanto vuelva. Nunca se pierde nada: todo está también en este ordenador.</small></div><div class="seg">${opt('push','save','Al guardar')}${opt('push','5','Cada 5 min')}${opt('push','15','Cada 15 min')}${opt('push','manual','Solo con el botón')}</div></div>
          <div class="set-row"><div class="set-lab"><b>Subir al cerrar la app</b><small>Antes de cerrarse sube lo último (como mucho espera 25 segundos).</small></div><div class="seg">${opt('onClose',true,'Sí')}${opt('onClose',false,'No')}</div></div>
          <div class="set-row"><div class="set-lab"><b>Avisar si está abierta en otro ordenador</b><small>Así no cambias lo mismo en dos sitios a la vez. Si pasa, se guardan las dos versiones.</small></div><div class="seg">${opt('lock',true,'Sí')}${opt('lock',false,'No')}</div></div>`:'')+
        `<p class="tnote">Se sincroniza la carpeta de proyectos (con sus subcarpetas) y tu progreso. En cada ordenador, en la carpeta que tengas elegida. No uses a la vez OneDrive o Drive en esa misma carpeta.</p>`;}
    else if(sec==='atajos'){const K=KEYS();
      h=H('Atajos de teclado','Pulsa «Cambiar» y después la combinación que quieras (por ejemplo Ctrl+Mayús+E). Esc cancela.')+KEY_NAMES.map(([g,rows])=>`<p class="set-g">${g}</p>`+rows.map(([a,l])=>`<div class="set-row"><div class="set-lab"><b>${l}</b></div><div class="keyrow">${this._capKey===a?'<span class="keycap wait">Pulsa la combinación…</span>':K[a]?`<span class="keycap">${kb(K[a]==='Delete'?'Supr':K[a])}</span>`:'<span class="keycap none">Sin atajo</span>'}<button class="ebtn" data-m="key-set" data-k="${a}">Cambiar</button>${K[a]?`<button class="ebtn" data-m="key-clear" data-k="${a}" title="Quitar el atajo" aria-label="Quitar el atajo">✕</button>`:''}</div></div>`).join('')).join('')+
        `<div class="set-row"><div class="set-lab"><b>Volver a los de siempre</b></div><button class="ebtn danger" data-m="keys-reset">Restablecer atajos</button></div>`;}
    else if(sec==='lienzo'){h=H('Lienzo')+seg('lines','Líneas del relacional y del DED','En ángulo: solo tramos horizontales y verticales, más limpio.',[['straight','Rectas'],['ortho','En ángulo']])+
        tog('showIsa','Botón «Jerarquía» (ISA) en el E-R','Generalización / especialización. Si no lo usas, quítalo de la barra.')+
        tog('boDiamond','Rombo en las líneas del Boceto','Un rombo pequeño, sin texto, en el centro de cada línea del Boceto (como en el E-R).')+
        tog('showType','Tipo de relación debajo del rombo','Muestra 1:1, 1:N o N:M en cada relación.')+tog('showCardQ','Marcar las cardinalidades que faltan','Pone (?,?) en las líneas que aún no tienen máximo y mínimo.')+
        tog('grid','Mostrar la cuadrícula de puntos','')+tog('snap','Ajustar a la cuadrícula al mover','Los elementos se colocan de 20 en 20 para que queden alineados.')+
        seg('zoomSpeed','Velocidad del zoom con la rueda','',[['slow','Lenta'],['normal','Normal'],['fast','Rápida']])+
        `<p class="set-sub">Para alinear varios elementos, selecciónalos (arrastrando en un hueco) y usa los botones de «Alinear» y «Repartir» del panel derecho.</p>`;}
    else if(sec==='actualizaciones'){h=H('Actualizaciones',`Tienes la versión <b>${VERSION}</b>.`)+tog('autoUpdate','Actualizar automáticamente','Las versiones nuevas se descargan solas y se instalan al cerrar la app. Si lo quitas, te avisará y elegirás tú.')+
        `<div class="set-row"><div class="set-lab"><b>Buscar ahora</b></div><button class="ebtn" data-m="upd-check">Buscar actualizaciones</button></div>`;}
    else if(sec==='teoria'){const TL=LANG()==='en'?TEORIA_EN:TEORIA,q=lc(this._thq||''),list=TL.filter(t=>!q||lc(t.t+' '+t.k+' '+t.h.replace(/<[^>]+>/g,' ')).includes(q));
      if(!list.some(t=>t.id===this._th))this._th=(list[0]||TL[0]).id;const cur=TL.find(t=>t.id===this._th);
      h=`<div class="th-wrap"><div class="th-side"><input type="search" class="th-q" id="thq" placeholder="Buscar en la teoría" value="${escA(this._thq||'')}" aria-label="Buscar en la teoría">
        <div class="th-list">${list.map((t,i)=>`<button class="th-nb" data-th="${t.id}" aria-current="${t.id===this._th}"><span class="th-n">${TL.indexOf(t)+1}</span>${esc(t.t)}</button>`).join('')||'<p class="set-sub">Nada coincide.</p>'}</div></div>
        <article class="th-art" id="thart"><h3>${esc(cur.t)}</h3>${cur.h}</article></div>`;}
    else if(sec==='acerca'){h=H('Acerca de')+`<div class="about"><div class="about-logo"><svg viewBox="0 0 18 18" width="40" height="40" aria-hidden="true"><rect x="1" y="6" width="6" height="6" fill="none" stroke="var(--accent)" stroke-width="1.6"/><path d="M13 4.5 17 9l-4 4.5L9 9z" fill="none" stroke="var(--accent)" stroke-width="1.6"/><path d="M7 9h2" stroke="var(--accent)" stroke-width="1.6"/></svg><div><b>Modelado Bases ${VERSION}</b><small>E-R, relacional, DED y SQL para ejercicios de bases de datos.</small></div></div>
        <div class="set-row"><div class="set-lab"><b>Novedades y resumen</b></div><button class="ebtn" data-m="news">Ver novedades</button></div>
        <div class="set-row"><div class="set-lab"><b>Atajos de teclado</b></div><button class="ebtn" data-m="controls">Ver controles</button></div>
        <div class="set-row"><div class="set-lab"><b>Página del programa</b><small>Versiones publicadas en GitHub.</small></div><button class="ebtn" data-m="repo">Abrir</button></div>
        <div class="set-row"><div class="set-lab"><b>Restablecer ajustes</b><small>Vuelve a dejar todos los ajustes como venían. Tus proyectos no se tocan.</small></div><button class="ebtn danger" data-m="set-reset">Restablecer</button></div></div>`;}
    body.innerHTML=h;
    const q=document.getElementById('thq');if(q){q.addEventListener('input',()=>{this._thq=q.value;const pos=q.selectionStart;this.renderSettings();const n=document.getElementById('thq');if(n){n.focus();n.setSelectionRange(pos,pos);}});}
  },
  // Guardar un atajo nuevo (si ya lo usaba otra acción, a esa se le quita)
  setKey(a,c){const K=KEYS(),ks={...(Settings.get().keys||{})};const other=Object.keys(K).find(x=>x!==a&&K[x]===c);
    if(other){ks[other]='';const nm=KEY_NAMES.flatMap(g=>g[1]).find(r=>r[0]===other);toast(`${c} ya era «${nm?nm[1]:other}»: se lo he quitado.`,'warn');}
    ks[a]=c;this._capKey=null;Settings.set('keys',ks);this.renderSettings();},
  /* ---------- Comparar dos versiones ---------- */
  showCompare(){const p=this.cur;if(!p)return;const others=this.projects.filter(x=>x!==p);
    this.modal(`<h3>Comparar «${esc(p.name)}»</h3><p>Compara este proyecto con otro (por ejemplo, tu versión con la de un compañero o la del profesor) y te dice qué hay en uno y no en el otro, y qué cambia.</p>
      <div class="cmp-src"><label class="chk"><input type="radio" name="cmpsrc" value="proj" ${others.length?'checked':'disabled'}><span class="chk-t">Con otro de mis proyectos<small>${others.length?'':'No tienes otros proyectos.'}</small></span></label>
      ${others.length?`<select id="cmpproj" class="cmp-sel">${others.map(o=>`<option value="${o._id}">${esc(o.name)}</option>`).join('')}</select>`:''}
      <label class="chk"><input type="radio" name="cmpsrc" value="code" ${others.length?'':'checked'}><span class="chk-t">Con un código<small>El que sale en «Exportar código». Pégalo aquí:</small></span></label>
      <textarea id="cmpcode" class="cmp-code" rows="3" spellcheck="false" placeholder="MB1-…"></textarea></div>
      <div class="in-sub">Qué comparar</div><div class="cmp-parts">${[['bo','Boceto'],['er','E-R'],['rel','Relacional'],['ded','DED']].map(([v,l])=>`<label class="tg"><input type="checkbox" data-cmp="${v}" ${v!=='bo'?'checked':''}><span>${l}</span></label>`).join('')}</div>
      <div class="mrow"><button class="ebtn" data-m="close">Cancelar</button><button class="ebtn pri" data-m="cmp-go">Comparar</button></div>`);
    const code=document.getElementById('cmpcode');code.addEventListener('focus',()=>{const r=document.querySelector('input[name=cmpsrc][value=code]');if(r)r.checked=true;});},
  async runCompare(){const p=this.cur;const src=(document.querySelector('input[name=cmpsrc]:checked')||{}).value,parts=[...document.querySelectorAll('[data-cmp]:checked')].map(x=>x.dataset.cmp);
    if(!parts.length){toast('Elige qué comparar.','warn');return;}
    let o;if(src==='proj'){o=this.byId(document.getElementById('cmpproj').value);}
    else{try{const list=await fromCode(document.getElementById('cmpcode').value);o=list[0];}catch(err){toast(err.message,'warn');return;}}
    if(!o){toast('Elige con qué comparar.','warn');return;}
    const res={},marks={},T={bo:'Boceto',er:'E-R',rel:'Relacional',ded:'DED'};
    parts.forEach(v=>{const A=cleanModel(p[v],v),B=cleanModel(o[v],v);const d=(v==='er'||v==='bo')?diffER(A,B):diffTables(A,B);
      const total=(v==='er'||v==='bo')?A.nodes.filter(n=>!isNote(n)).length+B.nodes.length/2:A.t.reduce((s,t)=>s+1+t.c.length,0);
      d.score=diffScore(d,Math.max(1,total));res[v]=d;marks[v]=d.marks;});
    this._cmp={marks,parts,with:o.name};
    const L=(arr,cls,t)=>arr.length?`<p class="cmp-h ${cls}">${t} <span class="cnt">${arr.length}</span></p><ul class="cmp-l">${arr.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
    const any=parts.some(v=>res[v].add.length||res[v].del.length||res[v].chg.length);
    this.modal(`<h3>Comparación: «${esc(p.name)}» y «${esc(o.name)}»</h3>${any?'':'<p class="tst-ok">Son iguales en todo lo que has elegido.</p>'}
      ${parts.map(v=>{const d=res[v];return `<section class="cmp-sec"><div class="cmp-top"><b>${T[v]}</b><span class="cmp-pct" style="--p:${d.score}">${d.score} % parecido</span></div>
        ${!d.add.length&&!d.del.length&&!d.chg.length?'<p class="tnote">Igual.</p>':L(d.add,'add',`Solo en «${esc(p.name)}»`)+L(d.del,'del',`Solo en «${esc(o.name)}» (te falta)`)+L(d.chg,'chg','Distinto')}</section>`;}).join('')}
      <p class="tnote">Los nombres parecidos cuentan como iguales (mayúsculas, tildes, singular o plural).</p>
      <div class="mrow"><button class="ebtn" data-m="close">Cerrar</button>${any?'<button class="ebtn pri" data-m="cmp-mark">Marcarlo en el diagrama</button>':''}</div>`,'wide');},
  clearDiff(){this.diff=null;if(this.ed&&this.ed.p&&this.ed.svg){this.ed.renderTools();this.ed.render();}toast('Marcas quitadas.');},
  showControls(){const kk=k=>k.startsWith('@')?(keyLabel(k.slice(1))?kb(keyLabel(k.slice(1))):'<span class="mut">—</span>'):!k.includes(' ')?kb(k):k.startsWith('Ctrl+1')?kb('Ctrl+1')+' … '+kb('Ctrl+7'):esc(k);
    this.modal(`<h3>Controles</h3><div class="ctrls">${CONTROLS.map(([t,rows])=>`<section><h4>${t}</h4><dl>${rows.map(([k,v])=>`<dt>${kk(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></section>`).join('')}</div><p class="tnote">Los atajos se pueden cambiar en Ajustes › Atajos.</p><div class="mrow"><button class="ebtn" data-m="set-keys">Cambiar atajos</button><button class="ebtn pri" data-m="close">Cerrar</button></div>`,'wide');},
  async reload(selectFolder){
    // Conserva en memoria los proyectos con cambios sin guardar
    const keep={};this.projects.forEach(p=>{if(p._dirty)keep[p.folder]=p;});
    try{this.projects=(await window.api.list()).map(p=>keep[p.folder]||Object.assign(p,{_id:uid('p')}));this.updateStatus();}
    catch(e){this.projects=[];this.status('bad','No se pudo leer la carpeta: '+e.message);}
    try{this.groups=await window.api.groups();}catch(e){this.groups=[];}
    const want=selectFolder||(this.cur&&this.cur.folder);
    this.cur=want?this.projects.find(p=>p.folder===want)||null:null;
    if(this.cur)this.open[this.cur._id]=true;
    this.renderTree();this.renderMain();
  },
  async afterWindow(folder){ // se cerró la ventana de un proyecto: se vuelve a leer del disco
    try{const p=await window.api.load(folder);const i=this.projects.findIndex(x=>x.folder===folder);
      if(i>=0){p._id=this.projects[i]._id;const was=this.cur===this.projects[i];this.projects[i]=p;if(was)this.cur=p;}else await this.reload();}
    catch(e){await this.reload();return;}
    this.renderTree();this.renderMain();
  },
  showSetup(){
    this.status('busy','Falta elegir la carpeta');document.getElementById('tree').innerHTML='';
    document.getElementById('mainv').innerHTML=`<header class="ph"><span class="pname static">Modelado Bases</span></header>
      <div class="view"><div class="welcome"><h2>¿Dónde quieres guardar tus proyectos?</h2>
      <p>La app crea una carpeta llamada <b>Modelados BDD</b> y guarda ahí dentro todos tus proyectos. Elige en qué lugar de tu ordenador quieres tenerla (por ejemplo, Documentos, el Escritorio o un USB).</p>
      <div class="folder-demo">${ICO.folder} (el sitio que elijas)<br><span class="d">└─</span> ${ICO.folder} Modelados BDD<br>&nbsp;&nbsp;&nbsp;<span class="d">└─</span> ${ICO.folder} proyecto 1 …</div>
      <p>Si tenías proyectos de una versión anterior, se traen aquí solos. Podrás moverla más tarde desde «Cambiar…» en la barra de abajo.</p>
      <div class="row"><button class="ebtn pri" data-act="setup-choose">Elegir ubicación…</button><button class="ebtn" data-act="setup-default">Usar Documentos</button></div></div></div>`;
  },
  status(kind,txt){const d=document.getElementById('sdot');d.className='dot '+kind;document.getElementById('stxt').textContent=txt;},
  dirtyList(){return this.projects.filter(p=>p._dirty);},
  updateStatus(){const n=this.dirtyList().length;const sb=document.getElementById('savebtn');if(sb)sb.disabled=!n;
    if(n)this.status('busy',this.autosave?'Guardando…':(n===1?'Cambios sin guardar':`Cambios sin guardar en ${n} proyectos`));else this.status('ok','Todo guardado');},
  renderFoot(){const el=document.getElementById('bpath');el.textContent=this.base||'—';el.title=this.base||'';
},
  queue(p,fn){p._q=(p._q||Promise.resolve()).then(fn).catch(e=>{this.status('bad','Error al guardar: '+e.message);});return p._q;},
  touch(p){p.updated=Date.now();const was=p._dirty;p._dirty=true;clearTimeout(p._t);p._t=null;
    if(this.autosave)p._t=setTimeout(()=>this.flush(p),600);
    this.updateStatus();this.renderCounts(p);if(!was)this.markDirty(p);},
  markDirty(p){const el=document.querySelector(`.pf[data-pid="${p._id}"]`);if(el)el.classList.toggle('dirty',!!p._dirty);},
  flush(p){clearTimeout(p._t);p._t=null;if(!p._dirty)return p._q||Promise.resolve();p._dirty=false;
    return this.queue(p,async()=>{try{await window.api.save(plainProject(p),Settings.get().svgFiles!==false?exportSVGs(p):null);GH.saved();}catch(e){p._dirty=true;throw e;}finally{this.markDirty(p);this.updateStatus();}});},
  async flushAll(){
    this.projects.forEach(p=>{if(p._rn){clearTimeout(p._rn);p._rn=null;this.doRename(p);}});
    await Promise.all(this.projects.filter(p=>p._dirty).map(p=>this.flush(p)));
    await Promise.all(this.projects.map(p=>p._q).filter(Boolean));
  },
  async saveNow(){const n=this.dirtyList().length;await this.flushAll();if(n&&!this.dirtyList().length)toast('Guardado.');},
  doRename(p){return this.queue(p,async()=>{const old=p.folder,nf=await window.api.rename(p.folder,p.name);p.folder=nf;if(old!==nf)Recent.rename(old,nf);this.updateStatus();});},
  renameSoon(p){clearTimeout(p._rn);p._rn=setTimeout(()=>{p._rn=null;this.doRename(p);},900);},
  async onCloseRequest(){
    window.api.ack().catch(()=>{});
    this.projects.forEach(p=>{if(p._rn){clearTimeout(p._rn);p._rn=null;this.doRename(p);}});
    await Promise.all(this.projects.map(p=>p._q).filter(Boolean));
    await this.flushAll();
    const d=this.dirtyList();
    if(!d.length){GH.close().finally(()=>window.api.ready());return;}
    this.modal(`<h3>No se han podido guardar algunos cambios</h3><p>${d.length===1?`El proyecto <b>${esc(d[0].name)}</b> tiene cambios que no has guardado.`:`Estos proyectos tienen cambios sin guardar: ${d.map(p=>'<b>'+esc(p.name)+'</b>').join(', ')}.`}</p>
      <div class="mrow"><button class="ebtn" data-m="close">Cancelar</button><button class="ebtn danger" data-m="quit-nosave">Salir sin guardar</button><button class="ebtn pri" data-m="quit-save">Guardar y salir</button></div>`);
    document.querySelector('[data-m="quit-save"]').focus();
  },
  bind(){
    document.querySelector('.side').addEventListener('click',e=>this.onSide(e));
    { const tr=document.getElementById('tree');tr.addEventListener('contextmenu',e=>this.treeMenu(e));
      tr.addEventListener('keydown',e=>{const gf=e.target.closest&&e.target.closest('.gf');if(gf&&(e.key==='Enter'||e.key===' ')&&!e.target.closest('.gname')){e.preventDefault();gf.click();}});
      // Arrastrar proyectos y carpetas a otra carpeta (o a «Mis proyectos» para sacarlos)
      tr.addEventListener('dragstart',e=>{const pf=e.target.closest&&e.target.closest('.pf'),gf=e.target.closest&&e.target.closest('.gf');this._drag=pf?{p:this.byId(pf.dataset.pid)}:gf?{g:gf.dataset.g}:null;if(this._drag){e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain','mb');}});
      tr.addEventListener('dragover',e=>{const d=e.target.closest&&e.target.closest('[data-gdrop]');if(!d||!this._drag)return;e.preventDefault();tr.querySelectorAll('.dropin').forEach(x=>x!==d&&x.classList.remove('dropin'));d.classList.add('dropin');});
      tr.addEventListener('dragleave',e=>{const d=e.target.closest&&e.target.closest('[data-gdrop]');if(d&&!d.contains(e.relatedTarget))d.classList.remove('dropin');});
      tr.addEventListener('drop',e=>{const d=e.target.closest&&e.target.closest('[data-gdrop]');tr.querySelectorAll('.dropin').forEach(x=>x.classList.remove('dropin'));if(!d||!this._drag)return;e.preventDefault();const w=this._drag;this._drag=null;this.moveTo(w,d.dataset.gdrop);});
      tr.addEventListener('dragend',()=>{this._drag=null;tr.querySelectorAll('.dropin').forEach(x=>x.classList.remove('dropin'));}); }
    document.getElementById('statusbar').addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(b)this.action(b);});
    document.getElementById('mainv').addEventListener('click',e=>this.onMain(e));
    document.getElementById('modal').addEventListener('click',e=>this.onModal(e));
    document.getElementById('modal').addEventListener('change',e=>{const k=e.target.dataset&&e.target.dataset.set;if(k){Settings.set(k,e.target.checked);this.renderSettings();}});
    document.getElementById('titlebar').addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(b)this.action(b);});
    document.addEventListener('keydown',e=>{
      const tg=e.target.tagName,typing=tg==='INPUT'||tg==='SELECT'||tg==='TEXTAREA',ctrl=e.ctrlKey||e.metaKey,modalOpen=!document.getElementById('modal').hidden;
      if(this._capKey&&modalOpen){e.preventDefault();e.stopPropagation();if(e.key==='Escape'){this._capKey=null;this.renderSettings();return;}const c=comboOf(e);if(c)this.setKey(this._capKey,c);return;}
      if(modalOpen){if(e.key==='Escape'){this.closeModal();}return;}
      const K=a=>keyIs(e,a),edv=this.cur&&['bo','er','rel','ded'].includes(this.view)&&this.ed.p&&!this.locked.has(this.cur.folder);
      if(K('controls')){e.preventDefault();this.showControls();return;}
      if(K('settings')){e.preventDefault();this.showSettings();return;}
      if(K('find')&&edv){e.preventDefault();this.ed.openSearch();return;}
      if(K('save')){e.preventDefault();this.saveNow();return;}
      if(K('projector')){e.preventDefault();const v=!Settings.get().projector;Settings.set('projector',v);toast(v?'Modo proyector activado (vuelve a pulsar el atajo para quitarlo).':'Modo proyector desactivado.');return;}
      if(ctrl&&!e.shiftKey&&!e.altKey&&/^[1-7]$/.test(e.key)&&this.cur&&!this.locked.has(this.cur.folder)){e.preventDefault();this.go(this.cur,Object.keys(VIEWS)[+e.key-1]);return;}
      if(typing||!edv)return;
      this.ed.key(e);
    });
  },
  counts(p){const ents=p.er.nodes.filter(n=>n.k==='ent'||n.k==='weak').length,be=((p.bo&&p.bo.nodes)||[]).filter(n=>n.k==='ent').length;return{enun:p.enun&&p.enun.trim()?'✓':'',bo:be?be+' ent.':'',er:ents?ents+' ent.':'',rel:p.rel.t.length?p.rel.t.length+' tab.':'',ded:p.ded.t.length?p.ded.t.length+' tab.':'',sql:p.sql&&p.sql.trim()?'✓':'',test:Pruebas.dbs[p._id]?'BD':''};},
  renderCounts(p){const c=this.counts(p);Object.keys(c).forEach(v=>{const el=document.querySelector(`.pi[data-pid="${p._id}"][data-view="${v}"] .cnt`);if(el)el.textContent=c[v];});},
  renderTree(){
    const t=document.getElementById('tree');if(this.solo){t.innerHTML='';return;}
    const G=this.groups||[],GO=this.gopen(),hdr=`<div class="tree-h" data-gdrop=""><span>Mis proyectos</span><button class="tree-add" data-act="newgroup" title="Nueva carpeta para agrupar proyectos" aria-label="Nueva carpeta">${ICO.grp}<span>+</span></button></div>`;
    if(!this.projects.length&&!G.length){t.innerHTML=hdr+`<p class="in-p" style="padding:0 8px">Aún no tienes proyectos.</p>`;return;}
    const proj=p=>{const op=this.open[p._id]??(this.cur===p);const c=this.counts(p),lk=this.locked.has(p.folder);
      return `<div class="proj"><button class="pf${p._dirty?' dirty':''}" data-pid="${p._id}" draggable="true" aria-expanded="${op}" title="${escA(p.name)}${lk?' · abierto en otra ventana':''}">${ICO.chev}${p.icon?`<span class="picon">${esc(p.icon)}</span>`:ICO.folder}<span class="nm">${esc(p.name)}</span>${lk?'<span class="win-tag">ventana</span>':''}<span class="ddot" aria-label="sin guardar"></span></button>
      ${op?`<div class="sub">${Object.entries(VIEWS).filter(([v])=>!p.act||(p.act.show||[]).includes(v)).map(([v,l])=>`<button class="pi" data-pid="${p._id}" data-view="${v}" aria-current="${this.cur===p&&this.view===v}">${ICO[v]}<span>${l}</span><span class="cnt">${c[v]}</span></button>`).join('')}</div>`:''}</div>`;};
    const grp=g=>{const op=!!GO[g],kg=G.filter(x=>parOf(x)===g),kp=this.projects.filter(p=>parOf(p.folder)===g),n=this.projects.filter(p=>p.folder.startsWith(g+'/')).length,ed=this._gEdit===g;
      return `<div class="grp"><div class="gf" role="button" tabindex="0" data-g="${escA(g)}" data-gdrop="${escA(g)}" draggable="${!ed}" aria-expanded="${op}" title="${escA(g)}">${ICO.chev}${ICO.grp}${ed?`<input class="gname" value="${escA(leafOf(g))}" spellcheck="false" aria-label="Nombre de la carpeta">`:`<span class="nm">${esc(leafOf(g))}</span>`}<span class="cnt">${n||''}</span></div>
        ${op?`<div class="gsub">${kg.map(grp).join('')}${kp.map(proj).join('')}${!kg.length&&!kp.length?`<p class="gempty">Vacía. Arrastra proyectos aquí o usa el botón derecho.</p>`:''}</div>`:''}</div>`;};
    t.innerHTML=hdr+G.filter(g=>!parOf(g)).map(grp).join('')+this.projects.filter(p=>!parOf(p.folder)).map(proj).join('');
    const gi=t.querySelector('.gname');if(gi){gi.focus();gi.select();let done=false;const fin=ok=>{if(done)return;done=true;const g=this._gEdit;this._gEdit=null;const v=gi.value.trim();if(ok&&v&&v!==leafOf(g))this.renameGroup(g,v);else this.renderTree();};
      gi.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();fin(true);}else if(e.key==='Escape'){e.preventDefault();fin(false);}});gi.addEventListener('blur',()=>fin(true));gi.addEventListener('click',e=>e.stopPropagation());}
  },
  /* ---------- Carpetas para agrupar proyectos ---------- */
  gopen(){try{return JSON.parse(localStorage.getItem('mb:gopen')||'{}')||{};}catch(e){return {};}},
  setGOpen(g,v){const o=this.gopen();if(v)o[g]=1;else delete o[g];try{localStorage.setItem('mb:gopen',JSON.stringify(o));}catch(e){}},
  openPath(folder){let f=parOf(folder);while(f){this.setGOpen(f,true);f=parOf(f);}},
  async newGroup(parent){const g=await this.run(()=>window.api.mkGroup(parent||'',LANG()==='en'?'New folder':'Nueva carpeta'));if(!g)return;
    this.groups=await window.api.groups();if(parent)this.setGOpen(parent,true);this.openPath(g);this._gEdit=g;this.renderTree();},
  async renameGroup(g,name){await this.flushAll();const ng=await this.run(()=>window.api.renameGroup(g,name));if(!ng)return this.renderTree();this.reprefix(g,ng);this.groups=await window.api.groups();this.renderTree();},
  reprefix(a,b){if(a===b)return;this.projects.forEach(p=>{if(p.folder.startsWith(a+'/')){const old=p.folder;p.folder=b+p.folder.slice(a.length);Recent.rename(old,p.folder);}});
    const o=this.gopen(),n={};Object.keys(o).forEach(k=>{n[k===a||k.startsWith(a+'/')?b+k.slice(a.length):k]=1;});try{localStorage.setItem('mb:gopen',JSON.stringify(n));}catch(e){}this.updateStatus();},
  async moveTo(what,to){to=to||'';
    if(what.p){const p=what.p;if(this.locked.has(p.folder)){toast('Ese proyecto está abierto en otra ventana: ciérrala antes de moverlo.','warn');return;}if(parOf(p.folder)===to)return;
      let nf=null;await this.queue(p,async()=>{const old=p.folder;nf=await window.api.move(p.folder,to);p.folder=nf;Recent.rename(old,nf);});if(!nf)return;
      if(to)this.setGOpen(to,true);this.openPath(nf);this.updateStatus();this.renderTree();toast(to?`«${p.name}» movido a «${leafOf(to)}».`:`«${p.name}» sacado de la carpeta.`);return;}
    const g=what.g;if(g===to||parOf(g)===to)return;if(to===g||to.startsWith(g+'/')){toast('No se puede meter una carpeta dentro de sí misma.','warn');return;}
    if(this.projects.some(p=>p.folder.startsWith(g+'/')&&this.locked.has(p.folder))){toast('Hay un proyecto de esa carpeta abierto en otra ventana: ciérrala antes.','warn');return;}
    await this.flushAll();const ng=await this.run(()=>window.api.move(g,to));if(!ng)return;this.reprefix(g,ng);this.groups=await window.api.groups();if(to)this.setGOpen(to,true);this.renderTree();toast(`Carpeta movida.`);},
  async deleteGroup(g){const inn=this.projects.filter(p=>p.folder.startsWith(g+'/'));
    if(inn.some(p=>this.locked.has(p.folder))){toast('Hay un proyecto de esa carpeta abierto en otra ventana: ciérrala antes.','warn');return;}
    this.confirm('Eliminar la carpeta',inn.length?`La carpeta «${leafOf(g)}» y sus ${inn.length} proyecto(s) irán a la papelera de Windows (se pueden recuperar desde ahí).`:`La carpeta «${leafOf(g)}» irá a la papelera.`,'Eliminar',async()=>{
      await this.flushAll();const r=await this.run(()=>window.api.removeGroup(g));if(r===null)return;if(this.cur&&this.cur.folder.startsWith(g+'/')){this.cur=null;this.home='inicio';}await this.reload();toast('Carpeta eliminada.');});},
  pickFolder(p){const G=this.groups||[],cur=parOf(p.folder),row=(g,d)=>`<button class="mvopt" data-m="mv" data-to="${escA(g)}" ${g===cur?'disabled':''} style="padding-left:${10+d*16}px">${g?ICO.grp:ICO.home||''}<span>${g?esc(leafOf(g)):'Mis proyectos (sin carpeta)'}</span>${g===cur?'<small>aquí está</small>':''}</button>`;
    const tree=(par,d)=>G.filter(g=>parOf(g)===par).map(g=>row(g,d)+tree(g,d+1)).join('');
    this._mvP=p;this.modal(`<h3>Mover «${esc(p.name)}»</h3><p>Elige la carpeta:</p><div class="mvlist">${row('',0)}${tree('',1)}</div><div class="mrow"><button class="ebtn" data-m="mv-new">Nueva carpeta…</button><button class="ebtn" data-m="close">Cancelar</button></div>`);},
  treeMenu(e){const gf=e.target.closest('.gf'),pf=e.target.closest('.pf'),hd=e.target.closest('.tree-h');if(!gf&&!pf&&!hd)return;e.preventDefault();
    if(gf){const g=gf.dataset.g;openCtx(e.clientX,e.clientY,[{label:'Nuevo proyecto aquí',fn:()=>this.newProject(g)},{label:'Nueva subcarpeta',fn:()=>this.newGroup(g)},{sep:1},{label:'Renombrar',fn:()=>{this._gEdit=g;this.renderTree();}},{label:'Mover a…',fn:()=>this.pickGroupFolder(g)},{label:'Abrir en el explorador',fn:()=>this.run(()=>window.api.reveal(g))},{sep:1},{label:'Eliminar carpeta',danger:true,fn:()=>this.deleteGroup(g)}]);return;}
    if(pf){const p=this.byId(pf.dataset.pid);openCtx(e.clientX,e.clientY,[{label:'Abrir',fn:()=>this.go(p,Settings.get().openTab||'er')},{label:'Mover a carpeta…',fn:()=>this.pickFolder(p)},{label:'Icono del proyecto…',fn:()=>this.pickIcon(p)},{label:'Abrir en el explorador',fn:()=>this.run(()=>window.api.reveal(p.folder))}]);return;}
    openCtx(e.clientX,e.clientY,[{label:'Nueva carpeta',fn:()=>this.newGroup('')},{label:'Nuevo proyecto',fn:()=>this.newProject('')}]);},
  pickIcon(p){const s=Juegos.st(),own=REWARDS.filter(x=>x.kind==='icon'&&s.owned[x.id]);this._icP=p;
    this.modal(`<h3>Icono de «${esc(p.name)}»</h3>${own.length?`<div class="ic-grid"><button class="ic-o${p.icon?'':' on'}" data-m="ic" data-ic="">${ICO.folder}<small>Normal</small></button>${own.map(x=>`<button class="ic-o${p.icon===x.e?' on':''}" data-m="ic" data-ic="${escA(x.e)}"><span>${x.e}</span><small>${esc(x.n.replace(/^Icono /,''))}</small></button>`).join('')}</div>`:`<p>Aún no tienes iconos. Se consiguen en las tiradas de «No cliques esto».</p>`}<div class="mrow"><button class="ebtn" data-m="close">Cerrar</button></div>`);},
  pickGroupFolder(g){const G=(this.groups||[]).filter(x=>x!==g&&!x.startsWith(g+'/')),cur=parOf(g),row=(x,d)=>`<button class="mvopt" data-m="mvg" data-to="${escA(x)}" ${x===cur?'disabled':''} style="padding-left:${10+d*16}px">${ICO.grp}<span>${x?esc(leafOf(x)):'Mis proyectos (arriba del todo)'}</span>${x===cur?'<small>aquí está</small>':''}</button>`;
    const tree=(par,d)=>G.filter(x=>parOf(x)===par).map(x=>row(x,d)+tree(x,d+1)).join('');this._mvG=g;
    this.modal(`<h3>Mover la carpeta «${esc(leafOf(g))}»</h3><div class="mvlist">${row('',0)}${tree('',1)}</div><div class="mrow"><button class="ebtn" data-m="close">Cancelar</button></div>`);},
  async newProject(parent){const base=LANG()==='en'?'project ':'proyecto ',names=new Set(this.projects.map(x=>x.name.toLowerCase()));let n=this.projects.length+1;while(names.has((base+n)))n++;
    const np=await this.run(()=>window.api.create(base+n,parent||''));if(!np)return;np._id=uid('p');this.projects.push(np);if(parent)this.openPath(np.folder);this.go(np,'er');
    const i=document.getElementById('pname');if(i){i.focus();i.select();}},
  /* ---------- Actividad conjunta (modo estudiante) ---------- */
  isRO(p,view){const a=p&&p.act;if(!a)return false;if(a.state!=='run')return true;if(view==='enun')return true;return !(a.parts||[]).includes(view);},
  actLeft(p){return Math.max(0,(p.act.end||0)-Date.now());},
  actBar(p){const a=p.act,T={bo:'Boceto',er:'E-R',rel:'Relacional',ded:'DED',sql:'SQL'},parts=(a.parts||[]).map(x=>T[x]).join(', ');
    const left=a.state==='run'?this.actLeft(p):0,mm=Math.floor(left/60000),ss=Math.floor(left%60000/1000);
    return `<div class="actbar ${a.state}"><span class="act-tag">Modo estudiante</span><span class="act-t"><b>${esc(a.title||'Actividad')}</b> · hay que hacer: ${esc(parts)} · ${a.mins} min</span>
      ${a.state==='ready'?`<button class="ebtn pri" data-act="act-start">Empezar</button>`:a.state==='run'?`<span class="act-clock${left<60000?' low':''}" id="actclock">⏱ ${mm}:${String(ss).padStart(2,'0')}</span>`:`<span class="act-clock over">Se acabó el tiempo</span>`}
      <button class="ebtn" data-act="act-exit">Salir del modo estudiante</button></div>`;},
  actTick(){const p=this.cur;if(!p||!p.act||p.act.state!=='run')return;
    if(this.actLeft(p)<=0){p.act.state='over';this.touch(p);this.saveNow();this.renderMain();
      this.modal(`<h3>Se acabó el tiempo</h3><p>La actividad «${esc(p.act.title||'')}» ha terminado. El proyecto queda bloqueado: ya no se puede cambiar.</p><p>Enséñaselo a quien hizo la actividad. Cuando terminéis, pulsa «Salir del modo estudiante» para poder editarlo otra vez.</p><div class="mrow"><button class="ebtn pri" data-m="close">Entendido</button></div>`);return;}
    const c=document.getElementById('actclock');if(c){const l=this.actLeft(p),mm=Math.floor(l/60000),ss=Math.floor(l%60000/1000);c.textContent=`⏱ ${mm}:${String(ss).padStart(2,'0')}`;c.classList.toggle('low',l<60000);}},
  startActivity(p){if(!p||!p.act||p.act.state!=='ready')return;p.act.state='run';p.act.start=Date.now();p.act.end=Date.now()+p.act.mins*60000;this.touch(p);this.saveNow();
    this.go(p,(p.act.parts||[])[0]||'enun');toast(`¡Empieza! Tenéis ${p.act.mins} minutos.`);},
  exitActivity(p){if(!p||!p.act)return;const run=p.act.state==='run';
    this.confirm('Salir del modo estudiante',run?'La actividad todavía no ha terminado. Si sales, el tiempo se para y podrás usar todo otra vez (Pasar desde mi E-R, teoría…).':'El proyecto vuelve a ser normal: puedes editarlo y usar todas las pestañas.','Salir',()=>{delete p.act;this.touch(p);this.saveNow();this.renderMain();toast('Has salido del modo estudiante.');});},
  showMakeActivity(){const p=this.cur;if(!p)return;const T=[['bo','Boceto'],['er','E-R'],['rel','Relacional'],['ded','DED'],['sql','SQL']];
    this.modal(`<h3>Crear una actividad</h3><p>Se genera un código con el enunciado de este proyecto. Cada compañero lo pega en «Importar código» y hace su versión a la vez, con el tiempo contado. Sin pasar nada automáticamente ni mirar la teoría.</p>
      ${(p.enun||'').trim()?'':'<p class="in-p warn">Este proyecto no tiene enunciado: escríbelo antes en la pestaña Enunciado.</p>'}
      <label class="fld">Título<input type="text" id="acttitle" value="${escA(p.name)}" spellcheck="false"></label>
      <div class="in-sub">Qué hay que hacer</div><div class="cmp-parts">${T.map(([v,l])=>`<label class="tg"><input type="checkbox" data-actp="${v}" ${['er','rel','ded'].includes(v)?'checked':''}><span>${l}</span></label>`).join('')}</div>
      <label class="fld">Tiempo (minutos)<input type="number" id="actmins" value="45" min="1" max="600" step="1"></label>
      <label class="chk"><input type="checkbox" id="actref"><span class="chk-t">Dar hecho lo de las otras pestañas<small>Por ejemplo, el E-R ya hecho para que hagan las tablas. Se ve pero no se puede cambiar.</small></span><span class="sw"></span></label>
      <div class="mrow"><button class="ebtn" data-m="close">Cancelar</button><button class="ebtn pri" data-m="act-code">Crear código</button></div>`);},
  async makeActivityCode(){const p=this.cur,parts=[...document.querySelectorAll('[data-actp]:checked')].map(x=>x.dataset.actp),mins=Math.round(+document.getElementById('actmins').value||0);
    if(!parts.length){toast('Elige al menos una cosa que hacer.','warn');return;}if(!(mins>0)){toast('Pon los minutos.','warn');return;}
    const ref=document.getElementById('actref').checked,title=document.getElementById('acttitle').value.trim()||p.name,q=plainProject(p);
    const pr={name:title,enun:q.enun};if(ref)['bo','er','rel','ded'].forEach(k=>{if(!parts.includes(k))pr[k]=q[k];});if(ref&&!parts.includes('sql'))pr.sql=q.sql;
    const json=JSON.stringify({app:'modelado-bases',v:1,act:{title,mins,parts,ref},proyectos:[pr]});
    const code='MB1-'+b64u.enc(await pipeBytes(json,new CompressionStream('deflate-raw')));
    this.modal(`<h3>Código de la actividad</h3><p>Pásalo a tus compañeros. Cada uno lo pega en <b>Importar código</b>, y cuando estéis todos pulsáis <b>Empezar</b>: desde ahí cuentan ${mins} minutos.</p><textarea id="exptxt" readonly>${esc(code)}</textarea>
      <div class="mrow"><button class="ebtn" data-m="close">Cerrar</button><button class="ebtn pri" data-m="copy">Copiar código</button></div>`);
    const t=document.getElementById('exptxt');t.focus();t.select();},
  async importActivity(act,src,names){const T={bo:'bo',er:'er',rel:'rel',ded:'ded',sql:'sql'};
    let name='Actividad · '+String(act.title||src.name||'').trim();if(names.has(name.toLowerCase())){let i=2;while(names.has((name+' ('+i+')').toLowerCase()))i++;name+=' ('+i+')';}
    const np=await this.run(()=>window.api.create(name));if(!np)return;
    const parts=(act.parts||[]).filter(x=>T[x]);np.enun=String(src.enun||'');
    ['bo','er','rel','ded'].forEach(k=>{np[k]=cleanModel(parts.includes(k)?{}:(src[k]||{}),k);});np.sql=parts.includes('sql')?'':String(src.sql||'');
    const has=k=>k==='sql'?!!np.sql.trim():k==='er'||k==='bo'?np[k].nodes.length>0:np[k].t.length>0;
    np.act={title:String(act.title||''),mins:Math.max(1,Math.round(+act.mins||45)),parts,state:'ready',show:['enun',...['bo','er','rel','ded','sql'].filter(k=>parts.includes(k)||(act.ref&&has(k)))]};
    np.updated=Date.now();await this.run(()=>window.api.save(plainProject(np),exportSVGs(np)));
    await this.reload(np.folder);this.go(this.cur,'enun');
    this.modal(`<h3>Actividad «${esc(np.act.title)}»</h3><p>Hay que hacer: <b>${parts.map(x=>({bo:'Boceto',er:'E-R',rel:'Relacional',ded:'DED',sql:'SQL'})[x]).join(', ')}</b> en <b>${np.act.mins} minutos</b>.</p>
      <ul class="plist"><li>Todo se hace a mano: no se puede pasar del E-R a tablas, ni generar el SQL, ni mirar la teoría.</li><li>Cuando se acabe el tiempo, el proyecto se bloquea hasta que pulses «Salir del modo estudiante».</li></ul>
      <p>Lee el enunciado. Cuando estéis todos, pulsa <b>Empezar</b>.</p><div class="mrow"><button class="ebtn" data-m="close">Todavía no</button><button class="ebtn pri" data-m="act-start">Empezar</button></div>`);},
  showHome(k){this.home=k||'inicio';if(k==='teoria'&&!this._thc)this._thc='er';this.renderTree();this.renderMain();document.getElementById('mainv').scrollTop=0;},
  // Miniatura de un proyecto: su E-R, o si no su DED o su relacional
  thumb(p){const key=p.folder+':'+(p.updated||0);this._th=this._th||{};if(this._th[key]!=null)return this._th[key];let h='';
    try{const parts=svgParts(p),k=['er','ded','rel'].find(x=>parts[x]);if(k){const {inner,b}=parts[k],pd=30;h=`<svg viewBox="${f1(b[0]-pd)} ${f1(b[1]-pd)} ${f1(b[2]-b[0]+2*pd)} ${f1(b[3]-b[1]+2*pd)}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;}}catch(e){}
    return this._th[key]=h;},
  renderHome(mv){const en=LANG()==='en';
    if(this.home==='juegos'){Juegos.render(mv);return;}
    if(this.home==='teoria'){
      mv.innerHTML=`<header class="ph"><span class="pname static">${en?'Theory':'Teoría'}</span><div class="ph-acts"><button class="ebtn" data-act="home">← ${en?'Home':'Inicio'}</button></div></header><div class="view home-th" id="thview">${theoryHTML(this._thc,this._ths,this._thq)}</div>`;
      const q=document.getElementById('thq2');q.addEventListener('input',()=>{this._thq=q.value;const pos=q.selectionStart;this.renderMain();const q2=document.getElementById('thq2');q2.focus();q2.setSelectionRange(pos,pos);});
      if(this._ths){const s=document.getElementById('ths-'+this._ths);if(s)s.scrollIntoView({block:'start'});}
      return;}
    const N=Settings.get().recentN||8,rec=Recent.get().map(r=>({p:this.projects.find(p=>p.folder===r.f),t:r.t})).filter(x=>x.p).slice(0,N);
    const extra=this.projects.filter(p=>!rec.some(r=>r.p===p)).slice(0,Math.max(0,N-rec.length)).map(p=>({p,t:0}));
    const list=[...rec,...extra];
    mv.innerHTML=`<header class="ph"><span class="pname static">${en?'Home':'Inicio'}</span></header><div class="view home">
      <section class="home-top"><div><h2>Modelado Bases</h2><p>E-R, relacional, DED y SQL de tus ejercicios de bases de datos.</p></div>${Juegos.profileCard()}
        <div class="row"><button class="ebtn pri" data-act="newproj">Nuevo proyecto</button><button class="ebtn" data-act="import" title="También para unirte a una actividad: pega el código que te han pasado">Importar código o actividad</button><button class="ebtn" data-act="controls">Controles</button><button class="ebtn" data-act="settings">Ajustes</button></div></section>
      <section><h3>Últimos proyectos abiertos</h3>${list.length?`<div class="rc-grid">${list.map(({p,t})=>{const c=this.counts(p);return `<button class="rc" data-pid="${p._id}"><span class="rc-th">${this.thumb(p)||'<span class="rc-empty">Vacío</span>'}</span><b class="rc-n">${esc(p.name)}</b><small>${t?ago(t):'Sin abrir todavía'}${[c.er,c.ded||c.rel].filter(Boolean).map(x=>' · '+x).join('')}${p.act?' · Actividad':''}</small></button>`;}).join('')}</div>`:'<p class="tnote">Todavía no tienes proyectos. Pulsa «Nuevo proyecto».</p>'}</section>
      <section><h3>Teoría</h3><div class="thc-grid">${TH_CH.map(c=>`<button class="thc" data-thc="${c.id}">${ICO[c.ico]||''}<b>${esc(en?c.te:c.t)}</b><small>${thSections(c).slice(0,5).map(s=>esc(s.t)).join(' · ')}${thSections(c).length>5?' …':''}</small></button>`).join('')}</div></section></div>`;},
  renderMain(){
    const tp=document.getElementById('tbproj');if(tp)tp.textContent=this.cur&&!this.home?this.cur.name:'';
    const mv=document.getElementById('mainv');
    if(this.home||(!this.cur&&this.base&&!this.solo)){this.home=this.home||'inicio';this.renderHome(mv);return;}
    if(!this.cur){
      if(this.solo){mv.innerHTML=`<div class="view"><div class="welcome"><h2>No se pudo abrir el proyecto</h2><p>Cierra esta ventana y ábrelo desde la ventana principal.</p></div></div>`;return;}
      mv.innerHTML=`<header class="ph"><span class="pname static">Modelado Bases</span></header>
      <div class="view"><div class="welcome"><h2>${this.projects.length?'Elige un proyecto o crea uno nuevo':'Crea tu primer proyecto'}</h2>
      <p>Cada proyecto es una carpeta dentro de <b>Modelados BDD</b>, con su enunciado y una subcarpeta para el E-R, el relacional, el DED y el SQL.</p>
      <div class="folder-demo">${ICO.folder} proyecto 1<br><span class="d">├─</span> Enunciado.txt<br><span class="d">├─</span> ${ICO.folder} E-R<br><span class="d">├─</span> ${ICO.folder} Relacional<br><span class="d">├─</span> ${ICO.folder} DED<br><span class="d">├─</span> ${ICO.folder} SQL<br><span class="d">└─</span> ${ICO.folder} Captura</div>
      <p>Para pasarle un proyecto a otra persona, pulsa <b>Exportar código</b> y envíale el código. Ella lo pega en <b>Importar código</b>.</p><p><b>Exportar ejercicio</b> guarda una imagen con el E-R, el relacional y el DED en la subcarpeta <b>Captura</b>.</p>
      <div class="row"><button class="ebtn pri add" data-act="newproj">Nuevo proyecto</button><button class="ebtn" data-act="import">Importar código</button><button class="ebtn" data-act="controls">Controles</button></div></div></div>`;
      return;
    }
    const p=this.cur;
    if(!this.solo&&this.locked.has(p.folder)){
      mv.innerHTML=`<header class="ph"><span class="pname static">${esc(p.name)}</span></header><div class="view"><div class="welcome"><h2>Este proyecto está abierto en otra ventana</h2>
        <p>Para no pisar los cambios, edítalo allí. Cuando cierres esa ventana, volverá a aparecer aquí con todo lo que hayas hecho.</p>
        <div class="row"><button class="ebtn pri" data-act="focuswin">Ir a esa ventana</button></div></div></div>`;return;}
    const B=(a,t,cls='',tip='')=>`<button class="ebtn ${cls}" data-act="${a}"${tip?` title="${tip}"`:''}>${t}</button>`;
    mv.innerHTML=`<header class="ph">
      <input class="pname" id="pname" value="${escA(p.name)}" aria-label="Nombre del proyecto" spellcheck="false">
      ${p.act?this.actBar(p):`<div class="ph-acts">${this.solo?'':B('window','Abrir en ventana','','Abre solo este proyecto en una ventana nueva, a pantalla completa')+'<span class="ph-sep"></span>'}${B('capture','Exportar ejercicio','','Guarda una imagen con el E-R, el relacional y el DED en la subcarpeta Captura')}${B('export','Exportar código','','Genera un código para pasar el proyecto a otra persona')}${B('erdplus','Exportar a ERDPlus','','Guarda el E-R en un archivo .erdplus que se abre en erdplus.com')}${B('erdplus-import','Importar de ERDPlus','','Abre un archivo .erdplus y lo pasa a tu E-R')}${B('compare','Comparar','','Compara este proyecto con otro (o con un código) y te dice qué cambia')}${B('mkact','Crear actividad','','Genera un código para que varios compañeros hagáis este ejercicio a la vez, con tiempo')}<span class="ph-sep"></span>${B('reveal','Abrir carpeta')}${this.solo?'':B('dup','Duplicar')}${B('clearproj','Vaciar proyecto','danger','Borra todos los diagramas sin borrar el proyecto')}${this.solo?'':B('delproj','Eliminar','danger')}</div>`}</header>
      <div class="vtabs" role="tablist">${Object.entries(VIEWS).filter(([v])=>!p.act||(p.act.show||[]).includes(v)).map(([v,l])=>`<button class="vtab" role="tab" data-view="${v}" aria-selected="${this.view===v}">${ICO[v]}<span>${l}</span></button>`).join('')}</div>
      <div class="view" id="view"></div>`;
    document.getElementById('pname').addEventListener('input',e=>{p.name=e.target.value.trim()||'Sin nombre';const nm=document.querySelector(`.pf[data-pid="${p._id}"] .nm`);if(nm)nm.textContent=p.name;const tp=document.getElementById('tbproj');if(tp)tp.textContent=p.name;if(this.solo)document.title=p.name+' · Modelado Bases';this.renameSoon(p);});
    const v=document.getElementById('view');
    if(p.act&&!(p.act.show||[]).includes(this.view)){this.view='enun';return this.renderMain();}
    if(p.act&&this.view==='sql'){const ro=this.isRO(p,'sql');
      v.innerHTML=`<div class="ed-tools"><span class="tnote">${ro?'Solo lectura':'Escribe el SQL a mano: en la actividad no se puede generar solo.'}</span></div><textarea class="sqlbox" id="sqltxt" spellcheck="false" ${ro?'readonly':''} placeholder="CREATE TABLE …">${esc(p.sql||'')}</textarea>`;
      if(!ro){const t=document.getElementById('sqltxt');t.addEventListener('input',e=>{p.sql=e.target.value;this.touch(p);});t.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const s=t.selectionStart;t.setRangeText('  ',s,t.selectionEnd,'end');p.sql=t.value;this.touch(p);}});}
      return;}
    if(this.view==='enun'){
      v.innerHTML=`<div class="enview"><p class="lbl">Enunciado · se guarda en Enunciado.txt</p>${hlBar(true)}<div class="hlwrap"><div class="hlback" aria-hidden="true"></div><textarea class="notes" id="enun" spellcheck="true" placeholder="Pega o escribe aquí el enunciado del ejercicio. También lo puedes ver al lado del lienzo con el botón «Enunciado».">${esc(p.enun||'')}</textarea></div><div class="hlchips" id="hlchips"></div></div>`;
      const et=document.getElementById('enun');if(et.value!==fixBullets(et.value))et.value=fixBullets(et.value);
      const chips=()=>{const el=document.getElementById('hlchips');if(!el)return;const txt=et.value,L=hlHits(txt,hlList(p));
        el.innerHTML=L.length?Object.keys(HL_K).map(k=>{const g=new Map();L.filter(m=>m.k===k).forEach(m=>{const key=lc(m.t.trim().replace(/\s+/g,' '));g.set(key,(g.get(key)||{t:m.t.trim(),n:0}));g.get(key).n++;});
          return g.size?`<div class="hlrow"><span class="hlk hl-${k}">${{ent:'Entidades',rel:'Relaciones',att:'Atributos'}[k]}</span>${[...g.entries()].map(([key,o])=>`<span class="hlchip hl-${k}">${esc(o.t)}${o.n>1?` <small>×${o.n}</small>`:''}<button data-hlx="${escA(key)}" data-hlk="${k}" aria-label="Quitar ${escA(o.t)}">✕</button></span>`).join('')}</div>`:'';}).join(''):
          `<p class="tnote">Elige un rotulador (<b>Entidad</b> para sustantivos como alumno o curso, <b>Relación</b> para verbos como matricula o imparte, <b>Atributo</b> para datos como nombre o DNI) y arrastra el ratón sobre las palabras para subrayarlas. Con la <b>Goma</b> lo quitas. Luego «Pasar al Boceto».</p>`;};
      const draw=hlWire(et,v.querySelector('.hlback'),()=>p,()=>{this.touch(p);chips();});chips();
      hlBind(v.querySelector('.hlbar'),et,()=>p,w=>{if(w==='tobo'){this.hlToBoceto(p);return;}this.touch(p);draw();chips();});
      v.querySelector('#hlchips').addEventListener('click',e=>{const x=e.target.closest('[data-hlx]');if(!x)return;const txt=et.value;p.hl=hlList(p).filter(m=>!(m.k===x.dataset.hlk&&lc(txt.slice(m.s,m.e).trim().replace(/\s+/g,' '))===x.dataset.hlx));this.touch(p);draw();chips();});
      if(p.act)et.readOnly=true;else et.addEventListener('input',e=>{const t=e.target,v=fixBullets(t.value);if(v!==t.value){const c=t.selectionStart;t.value=v;t.setSelectionRange(c,c);}p.enun=v;this.touch(p);});
    } else if(this.view==='sql'){
      const dl=Settings.get().sqlDialect||'mysql';
      v.innerHTML=`<div class="ed-tools"><div class="tgroup"><span class="tlab">Para</span><div class="seg dial" role="group" aria-label="Gestor de base de datos">${Object.entries(DIALECTS).map(([k,l])=>`<button class="segb" data-act="sql-dialect" data-v="${k}" aria-pressed="${dl===k}">${l}</button>`).join('')}</div></div><div class="tgroup"><button class="ebtn" data-act="sql-ded">${GL.table}<span>Generar desde el DED</span></button><button class="ebtn" data-act="sql-rel">${GL.relate}<span>Generar desde el relacional</span></button></div><div class="tgroup"><button class="ebtn" data-act="sql-draw">${GL.fromer}<span>Dibujar desde este SQL</span></button><button class="ebtn" data-act="sql-open">${GL.open}<span>Abrir archivo .sql</span></button></div><div class="tgroup"><button class="ebtn" data-act="sql-sample" title="Añade al final INSERT con datos inventados pero coherentes (respetan PK, FK y UNIQUE)">${GL.table}<span>Añadir datos de ejemplo</span></button><button class="ebtn" data-act="sql-copy">${GL.copy}<span>Copiar</span></button></div><div class="tgroup"><span class="tlab">Workbench / phpMyAdmin</span><button class="ebtn" data-act="sql-wb" title="Guarda un archivo .sql para MySQL que se abre en MySQL Workbench (te dibuja el diagrama) y en phpMyAdmin">${GL.copy}<span>Exportar</span></button><button class="ebtn" data-act="wb-import" title="Abre un modelo de MySQL Workbench (.mwb) o un .sql exportado de Workbench o phpMyAdmin y dibuja el DED y el relacional">${GL.open}<span>Importar</span></button></div><span class="tspace"></span><span class="tnote">Se guarda en SQL/script.sql · lo puedes editar a mano</span></div>
        <textarea class="sqlbox" id="sqltxt" spellcheck="false" placeholder="Pulsa «Generar desde el DED» (o desde el relacional) para crear el script, o escríbelo aquí.">${esc(p.sql||'')}</textarea>`;
      document.getElementById('sqltxt').addEventListener('input',e=>{p.sql=e.target.value;this.touch(p);});
      document.getElementById('sqltxt').addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const t=e.target,s=t.selectionStart;t.setRangeText('  ',s,t.selectionEnd,'end');p.sql=t.value;this.touch(p);}});
    } else if(this.view==='test'){Pruebas.render(v,p);
    } else {if(this.view==='bo'&&!p.bo)p.bo={nodes:[],links:[],notes:[]};this.ed.mount(v);this.ed.open(p,this.view);}
  },
  hlToBoceto(p){const r=hlToBo(p.enun||'',hlList(p));if(!r.ents.length){toast('Subraya primero alguna entidad en el enunciado.');return;}
    if(p.act&&this.isRO(p,'bo')){toast('En esta actividad no se puede cambiar el Boceto.','warn');return;}
    this.go(p,'bo');const ed=this.ed;if(!ed||!ed.isBo)return;const was=ed.m.nodes.filter(isEnt).length;
    const sp=ed.boSplit(ed.boParse(ed.boText())),E=sp.ents.map(x=>({name:x.name,at:[...x.at]})),R=sp.rels.filter(x=>x.ok).map(x=>({a:x.a,b:x.b,at:[...x.at]}));let ne=0,na=0,nr=0;
    r.ents.forEach(n=>{if(!E.some(x=>lc(x.name)===lc(n))){E.push({name:n,at:[]});ne++;}});
    Object.entries(r.at).forEach(([n,list])=>{const e=E.find(x=>lc(x.name)===lc(n));if(!e)return;list.forEach(a=>{if(!e.at.some(x=>lc(x)===lc(a))){e.at.push(a);na++;}});});
    r.rels.forEach(([a,b])=>{if(!R.some(x=>(lc(x.a)===lc(a)&&lc(x.b)===lc(b))||(lc(x.a)===lc(b)&&lc(x.b)===lc(a)))){R.push({a,b,at:[]});nr++;}});
    if(!ne&&!na&&!nr){toast('El Boceto ya tiene todo lo que has marcado.');return;}
    ed.boFromText([...E.map(x=>x.name+(x.at.length?'; '+x.at.join(', '):'')),...R.map(x=>x.a+'-'+x.b+(x.at.length?'; '+x.at.join(', '):''))].join('\n'));ed._boEd=false;
    if(!was)ed.distribute();ed.fit(true);
    toast(`Pasado al Boceto: ${ne} entidad(es), ${na} atributo(s) y ${nr} línea(s). Revisa el texto de arriba y corrige lo que haga falta. Ctrl+Z lo deshace.`);},
  go(p,view){this.home=null;Recent.touch(p.folder);if(p.folder&&p.folder.includes('/'))this.openPath(p.folder);this.cur=p;this.view=view;this.open[p._id]=true;this.renderTree();this.renderMain();},
  byId(id){return this.projects.find(x=>x._id===id);},
  onSide(e){
    const gf=e.target.closest('.gf');if(gf){if(e.target.closest('.gname'))return;const g=gf.dataset.g;this.setGOpen(g,gf.getAttribute('aria-expanded')!=='true');this.renderTree();return;}
    const pf=e.target.closest('.pf');if(pf){const p=this.byId(pf.dataset.pid);const op=pf.getAttribute('aria-expanded')==='true';this.open[p._id]=!op;if(!op&&this.cur!==p){this.go(p,'er');return;}this.renderTree();return;}
    const pi=e.target.closest('.pi');if(pi){this.go(this.byId(pi.dataset.pid),pi.dataset.view);return;}
    const b=e.target.closest('[data-act]');if(b)this.action(b);
  },
  onMain(e){
    if(this.home==='juegos'&&Juegos.onClick(e))return;
    const vt=e.target.closest('.vtabs [data-view]');if(vt){this.go(this.cur,vt.dataset.view);return;}
    const rc=e.target.closest('.home .rc[data-pid]');if(rc){this.go(this.byId(rc.dataset.pid),Settings.get().openTab||'er');return;}
    const tc=e.target.closest('[data-thc]');if(tc&&this.home){this._thc=tc.dataset.thc;this._ths=tc.dataset.ths||null;this.home='teoria';if(!tc.dataset.ths)this._thq=this._thq||'';this.renderMain();if(!tc.dataset.ths){const a=document.getElementById('thart2');if(a)a.scrollTop=0;}return;}
    const hb=e.target.closest('.home [data-act], .home-th [data-act], .ph [data-act=home]');if(hb){this.action(hb);return;}
    const b=e.target.closest('.ph [data-act], .welcome [data-act]')||((this.view==='sql'||this.view==='test')&&e.target.closest('#view [data-act]'));if(b)this.action(b);
  },
  async run(fn,okMsg){try{const r=await fn();if(okMsg&&r!==null&&r!==undefined)toast(typeof okMsg==='function'?okMsg(r):okMsg);return r;}catch(e){toast(e.message,'warn');this.status('bad',e.message);return null;}},
  confirm(title,text,btn,cb,extra=''){this._cf=cb;this.modal(`<h3>${esc(title)}</h3><p>${esc(text)}</p>${extra}<div class="mrow"><button class="ebtn" data-m="close">Cancelar</button><button class="ebtn pri danger-pri" data-m="cf-ok">${esc(btn)}</button></div>`);},
  async action(b){
    const a=b.dataset.act,p=this.cur;
    if(a==='controls'){this.showControls();return;}
    if(a==='settings'){this.showSettings();return;}
    if(a==='theory'){if(this.cur&&this.cur.act&&!this.home){toast('Durante la actividad no se puede mirar la teoría.','warn');return;}this.showHome('teoria');return;}
    if(a==='mkact'){this.showMakeActivity();return;}
    if(a==='act-start'){this.startActivity(this.cur);return;}
    if(a==='act-exit'){this.exitActivity(this.cur);return;}
    if(a==='gh-sync'){GH.sync(true);return;}
    if(a==='upd-show'){if(this._upd){this._updLater=null;this.updateScreen(this._upd);}return;}
    if(a==='home'){Juegos.stopAll();this.showHome('inicio');return;}
    if(a==='games'||a==='games-profile'){if(this.cur&&this.cur.act&&this.cur.act.state==='run'&&!this.home){toast('Durante la actividad no se puede jugar.','warn');return;}Juegos.stopAll();Juegos.sub=a==='games'?'menu':'perfil';Juegos._qz=null;Juegos._bdq=null;this.showHome('juegos');return;}
    if(a==='prog-choose'){const r=await this.run(()=>window.api.progChoose());if(!r)return;this._prog=r;if(await Sync.load()){this.afterSync();toast('He cargado el progreso que había en esa carpeta.');this.renderSettings();return;}Sync.save(true);toast('Tu progreso se guarda ahora en '+r.dir);this.renderSettings();return;}
    if(a==='prog-reset'){const r=await this.run(()=>window.api.progReset());if(!r)return;this._prog=r;if(await Sync.load()){this.afterSync();this.renderSettings();return;}Sync.save(true);this.renderSettings();return;}
    if(a==='prog-reveal'){this.run(()=>window.api.progReveal());return;}
    if(a==='news'){this.showNews();return;}
    if(a==='save'){this.saveNow();return;}
    if(a==='upd-retry'){if(this._upd)this.prepareSilently(this._upd);return;}
    if(a==='upd-now'){b.disabled=true;b.textContent='Actualizando…';try{await this.flushAll();await window.api.updateInstall(this._upd.asset.url);}catch(e){b.disabled=false;b.textContent='Reiniciar y actualizar';toast('No se pudo actualizar: '+e.message,'warn');}return;}
    if(a==='setup-choose'||a==='setup-default'){
      const r=await this.run(()=>window.api.baseSetup(a==='setup-default'));if(!r)return;
      this.base=r.dir;try{if(await Sync.load())this.afterSync(true);this._prog=await window.api.progInfo();}catch(e){}this.renderFoot();await this.reload();
      toast(r.migrated?`Carpeta lista. He traído ${r.migrated} proyecto(s) de la versión anterior.`:'Carpeta Modelados BDD lista en '+r.dir);return;}
    if(!this.base){toast('Primero elige dónde guardar la carpeta Modelados BDD.');return;}
    if(a==='newproj'){await this.newProject('');return;}
    if(a==='newgroup'){await this.newGroup('');return;}
    if(a==='import'){this.modal(`<h3>Importar código</h3><p>Pega el código que te han pasado (empieza por <code>MB1-</code>). Los proyectos se añaden a los tuyos; no se borra nada.</p>
      <textarea id="imptxt" spellcheck="false" placeholder="MB1-…"></textarea>
      <div class="mrow"><button class="lnk mmeta" data-m="dir">o importar una carpeta de proyecto…</button><button class="ebtn" data-m="close">Cancelar</button><button class="ebtn pri" data-m="code">Importar</button></div>`);document.getElementById('imptxt').focus();return;}
    if(a==='captureall'){if(!this.projects.length){toast('No tienes proyectos.');return;}await this.flushAll();await this.captureMany(this.projects);return;}
    if(a==='exportall'){if(!this.projects.length){toast('No tienes proyectos que exportar.');return;}this.showCode(this.projects,'Código de todos tus proyectos ('+this.projects.length+')');return;}
    if(a==='basereveal'){this.run(()=>window.api.baseReveal());return;}
    if(a==='basechoose'){await this.flushAll();const keep=this.cur&&this.cur.folder;const nb=await this.run(()=>window.api.baseChoose());if(nb){this.base=nb;this.renderFoot();await this.reload(keep);toast('Carpeta movida. Tus proyectos están ahora en '+nb);}return;}
    if(!p)return;
    if(a==='focuswin'){this.run(()=>window.api.focusWindow(p.folder));return;}
    if(a==='window'){if(p._rn){clearTimeout(p._rn);p._rn=null;await this.doRename(p);}await this.flush(p);await (p._q||Promise.resolve());
      if(p._dirty){toast('No se pudo guardar antes de abrir la ventana.','warn');return;}
      await this.run(()=>window.api.openWindow(p.folder,p.name));return;}
    if(a==='reveal'){this.run(()=>window.api.reveal(p.folder));return;}
    if(a==='capture'){await this.flushAll();await this.captureMany([p]);return;}
    if(a==='export'){this.showCode([p],'Código del proyecto «'+p.name+'»');return;}
    if(a==='compare'){this.showCompare();return;}
    if(a==='cleardiff'){this.clearDiff();return;}
    if(a==='erdplus'){
      if(!p.er.nodes.length){toast('Tu E-R está vacío.');return;}
      let txt;try{txt=toERDPlus(cleanModel(p.er,'er'));}catch(e){toast('No se pudo generar: '+e.message,'warn');return;}
      if(p._rn){clearTimeout(p._rn);p._rn=null;await this.doRename(p);}
      const f=await this.run(()=>window.api.saveERDPlus(p.folder,p.name,txt));
      if(f)this.modal(`<h3>Archivo para ERDPlus guardado</h3><p>Para abrirlo: entra en <b>erdplus.com</b>, crea o abre un diagrama y usa <b>Open</b> (o <b>Import</b>) para elegir este archivo:</p><div class="folder-demo" style="margin:0">${esc(f)}</div><div class="mrow"><button class="ebtn" data-m="close">Cerrar</button><button class="ebtn pri" data-m="showfile" data-f="${escA(f)}">Mostrar en la carpeta</button></div>`);
      return;}
    if(a==='dup'){await this.flushAll();const c=await this.run(()=>window.api.dup(p.folder));if(!c)return;c._id=uid('p');this.projects.push(c);this.go(c,this.view);toast('Proyecto duplicado.');return;}
    if(a==='clearproj'){this.confirm('Vaciar proyecto',`Se borrarán el E-R, el relacional, el DED y el SQL de «${p.name}». El proyecto y su carpeta se quedan.`,'Continuar…',()=>{
        setTimeout(()=>this.modal(`<h3>¿Seguro que quieres vaciarlo?</h3><p>Esto no se puede deshacer con Ctrl+Z.</p><label class="chk"><input type="checkbox" id="cl-enun"><span class="chk-ic">${GL.enun}</span><span class="chk-t">Vaciar también el enunciado</span><span class="sw"></span></label>
          <div class="mrow"><button class="ebtn" data-m="close">Cancelar</button><button class="ebtn pri danger-pri" data-m="clear-go">Sí, vaciar</button></div>`),0);});return;}
    if(a==='delproj'){
      if(!b.dataset.armed){b.dataset.armed=1;b.textContent='¿Eliminar? Pulsa otra vez';setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent='Eliminar';}},3000);return;}
      clearTimeout(p._t);p._t=null;clearTimeout(p._rn);if(p._rn){p._rn=null;await this.doRename(p);}
      await (p._q||Promise.resolve());
      const ok=await this.run(()=>window.api.remove(p.folder).then(()=>true));if(!ok)return;
      Pruebas.forget(p._id);this.projects=this.projects.filter(x=>x!==p);this.cur=null;this.updateStatus();this.renderTree();this.renderMain();toast('Proyecto movido a la papelera de reciclaje.');return;}
    if(a==='sql-ded'||a==='sql-rel'){const from=a==='sql-ded'?'ded':'rel';let r;
      try{r=genSQL(p,from);}catch(e){toast(e.message,'warn');return;}
      const put=()=>{p.sql=r.sql;this.touch(p);const t=document.getElementById('sqltxt');if(t)t.value=p.sql;toast(r.warn.length?`SQL generado con ${r.warn.length} aviso(s): míralos al principio.`:'SQL generado.',r.warn.length?'warn':'');};
      if(p.sql&&p.sql.trim()&&p.sql!==r.sql)this.confirm('Generar el SQL de nuevo',`Se sustituirá el SQL actual por uno nuevo hecho desde el ${from==='ded'?'DED':'relacional'}. Si lo habías cambiado a mano, esos cambios se pierden.`,'Sustituir',put);else put();return;}
    if(a==='erdplus-import'){
      const f=await this.run(()=>window.api.openText({title:t('Importar de ERDPlus'),filters:[{name:t('Diagrama de ERDPlus'),extensions:['erdplus','json']}]}));if(!f)return;
      let er;try{er=fromERDPlus(f.text);}catch(e){toast(e.message,'warn');return;}
      const put=kind=>{if(this.ed.p===p)this.ed.hist.push({mode:'er',data:JSON.stringify(cleanModel(p.er,'er'))});
        if(kind==='rep')p.er={nodes:er.nodes,links:er.links,notes:[...(p.er.notes||[]),...er.notes]};
        else{const ex=p.er.nodes,mx=Math.max(...ex.map(n=>n.x))+260,mn=Math.min(...er.nodes.map(n=>n.x)),cy=ex.reduce((s,n)=>s+n.y,0)/ex.length,iy=er.nodes.reduce((s,n)=>s+n.y,0)/er.nodes.length;
          [...er.nodes,...er.notes].forEach(n=>{n.x=Math.round(n.x-mn+mx);n.y=Math.round(n.y-iy+cy);});
          p.er.nodes.push(...er.nodes);p.er.links.push(...er.links);p.er.notes=[...(p.er.notes||[]),...er.notes];}
        if(p._views)delete p._views.er;this.touch(p);this.go(p,'er');
        const c=k=>er.nodes.filter(k).length;toast(`Importado de ERDPlus: ${c(isEnt)} entidades, ${c(isRel)} relaciones y ${c(isAtt)} atributos.`);};
      if(!p.er.nodes.length){put('rep');return;}
      this._imp=put;this.modal(`<h3>Tu E-R no está vacío</h3><p>¿Qué hago con el diagrama de ERDPlus?</p><div class="mrow"><button class="ebtn" data-m="close">Cancelar</button><button class="ebtn" data-m="imp-add">Añadirlo al lado</button><button class="ebtn pri" data-m="imp-rep">Sustituir mi E-R</button></div>`);return;}
    if(a==='sql-open'){
      const f=await this.run(()=>window.api.openText({title:t('Abrir archivo SQL'),filters:[{name:'SQL',extensions:['sql','txt']}]}));if(!f)return;
      const load=()=>{p.sql=f.text;this.touch(p);const t=document.getElementById('sqltxt');if(t)t.value=p.sql;this.drawSQL(p);};
      if(p.sql&&p.sql.trim()&&p.sql!==f.text)this.confirm('Abrir archivo SQL',`Se sustituirá el SQL de este proyecto por el de «${f.name}».`,'Sustituir',load);else load();return;}
    if(a==='sql-draw'){this.drawSQL(p);return;}
    if(a==='wb-import'){this.modal(`<h3>Importar de MySQL Workbench o phpMyAdmin</h3><p>Elige uno de estos archivos y se dibujan solos el DED y el relacional (y su SQL queda en esta pestaña):</p>
        <p class="news-h">MySQL Workbench</p><ul class="steps"><li>El modelo tal cual: el archivo <b>.mwb</b> (se respeta dónde tenías cada tabla).</li><li>O un script: <b>File › Export › Forward Engineer SQL CREATE Script…</b> y guárdalo como .sql.</li></ul>
        <p class="news-h">phpMyAdmin</p><ul class="steps"><li>Entra en la base de datos, pestaña <b>Exportar</b>, formato <b>SQL</b> y pulsa <b>Exportar</b> (o <b>Continuar</b>).</li></ul>
        <div class="mrow"><button class="ebtn" data-m="close">Cancelar</button><button class="ebtn pri" data-m="wb-pick">Elegir archivo…</button></div>`);return;}
    if(a==='sql-wb'){const from=p.ded.t.length?'ded':p.rel.t.length?'rel':null;if(!from){toast('Primero haz el DED (o el relacional): el archivo se crea a partir de sus tablas.','warn');return;}
      this._wbFrom=from;this.modal(`<h3>Exportar para MySQL Workbench y phpMyAdmin</h3><p>Se guarda un archivo <b>.sql</b> para MySQL hecho desde tu ${from==='ded'?'DED':'relacional'}, con la base de datos, las tablas, las claves y sus relaciones.</p>
        <label class="chk"><input type="checkbox" id="wb-data" checked><span class="chk-t">Incluir datos de ejemplo<small>INSERT coherentes, para tener filas con las que probar.</small></span><span class="sw"></span></label>
        <div class="mrow"><button class="ebtn" data-m="close">Cancelar</button><button class="ebtn pri" data-m="wb-save">Guardar .sql</button></div>`);return;}
    if(a==='tst-build'){await Pruebas.build(p,b.dataset.v);return;}
    if(a==='tst-fill'){Pruebas.fill(p);return;}
    if(a==='tst-fk'){Pruebas.fkCheck(p);return;}
    if(a==='tst-empty'){this.confirm('Vaciar datos','Se borrarán todas las filas de la base de prueba (las tablas se quedan).','Vaciar',()=>Pruebas.empty(p));return;}
    if(a==='tst-run'){Pruebas.run(p);return;}
    if(a==='tst-show'){Pruebas.show(p,b.dataset.v);return;}
    if(a==='sql-dialect'){Settings.set('sqlDialect',b.dataset.v);document.querySelectorAll('[data-act=sql-dialect]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
      toast(`Los próximos «Generar» y datos de ejemplo serán para ${DIALECTS[b.dataset.v]}.`);return;}
    if(a==='sql-sample'){const from=p.ded.t.length?'ded':p.rel.t.length?'rel':null;if(!from){toast('Primero haz el DED (o el relacional): los datos se inventan a partir de sus tablas.','warn');return;}
      let sc;try{sc=schemaOf(p[from].t,from==='rel');}catch(e){toast(e.message,'warn');return;}
      const d=Settings.get().sqlDialect||'mysql',data=sampleRows(sc,Settings.get().sampleRows||5),txt=(LANG()==='en'?`\n-- Sample data (${DIALECTS[d]}), made up from the ${from==='ded'?'DSD':'relational'}\n`:`\n-- Datos de ejemplo (${DIALECTS[d]}), inventados a partir del ${from==='ded'?'DED':'relacional'}\n`)+insertsSQL(sc,data,d);
      p.sql=(p.sql||'').replace(/\s*$/,'\n')+txt;this.touch(p);const t=document.getElementById('sqltxt');if(t){t.value=p.sql;t.scrollTop=t.scrollHeight;}
      toast(data.warn.length?data.warn[0]:'Datos de ejemplo añadidos al final del script.',data.warn.length?'warn':'');return;}
    if(a==='sql-copy'){const t=document.getElementById('sqltxt');if(!t||!t.value.trim()){toast('No hay SQL que copiar.');return;}
      try{await navigator.clipboard.writeText(t.value);toast('SQL copiado.');}catch(e){t.focus();t.select();toast('Pulsa Ctrl+C para copiarlo.');}return;}
  },
  drawSQL(p,pos){
    const t=document.getElementById('sqltxt'),txt=t?t.value:(p.sql||'');let r;
    try{r=parseSQL(txt);}catch(e){toast(e.message,'warn');return;}
    if(pos)placeLike(r.tables,pos);
    const put=()=>{const clone=()=>r.tables.map(t=>({id:uid(),n:t.n,x:t.x,y:t.y,c:t.c.map(c=>[c[0],c[1],c[2]])}));
      if(this.ed.p===p)this.ed.hist.push({mode:'rel',data:JSON.stringify(cleanModel(p.rel,'rel'))},{mode:'ded',data:JSON.stringify(cleanModel(p.ded,'ded'))});
      p.rel={t:clone(),notes:p.rel.notes||[]};p.ded={t:clone(),notes:p.ded.notes||[]};if(p._views){delete p._views.rel;delete p._views.ded;}
      this.touch(p);this.go(p,'ded');
      if(r.warn.length)this.modal(`<h3>${r.tables.length} tabla(s) dibujadas, con avisos</h3><ul class="plist">${r.warn.map(w=>`<li>${esc(w)}</li>`).join('')}</ul><div class="mrow"><button class="ebtn pri" data-m="close">Entendido</button></div>`);
      else toast(`${r.tables.length} tabla(s) dibujadas en el DED y en el relacional. Ctrl+Z las quita.`);};
    if(p.rel.t.length||p.ded.t.length)this.confirm('Dibujar desde el SQL','Se sustituirán las tablas del Relacional y del DED por las de este SQL. Tus notas se quedan, y puedes volver atrás con Ctrl+Z.','Dibujar',put);else put();
  },
  modal(html,cls=''){const m=document.getElementById('modal');m.innerHTML=`<div class="mbox ${cls}" role="dialog" aria-modal="true">${html}</div>`;m.hidden=false;(m.querySelector('.ebtn.pri')||m.querySelector('button'))?.focus({preventScroll:true});const bx=m.querySelector('.mbox');if(bx)bx.scrollTop=0;},
  closeModal(){this.settingsOpen=false;const m=document.getElementById('modal');m.hidden=true;m.innerHTML='';},
  async showCode(list,title){
    let code;try{code=await toCode(list);}catch(e){toast('No se pudo generar el código: '+e.message);return;}
    this.modal(`<h3>${esc(title)}</h3><p>Copia el código y envíaselo a quien quieras (WhatsApp, correo…). Para abrirlo: <b>Importar código</b> y pegarlo.</p>
      <textarea id="exptxt" readonly spellcheck="false">${esc(code)}</textarea>
      <div class="mrow"><span class="mmeta">${code.length.toLocaleString('es-ES')} caracteres</span><button class="ebtn" data-m="close">Cerrar</button><button class="ebtn pri" data-m="copy">Copiar código</button></div>`);
    const t=document.getElementById('exptxt');t.focus();t.select();
  },
  async captureMany(list){
    const done=[],empty=[];this.status('busy','Generando capturas…');
    for(const p of list){if(p._rn){clearTimeout(p._rn);p._rn=null;await this.doRename(p);}
      try{const f=await captureProject(p);if(f)done.push([p,f]);else empty.push(p.name);}catch(e){toast('Error con «'+p.name+'»: '+e.message,'warn');}}
    this.updateStatus();
    if(!done.length){toast(empty.length?'No hay nada que capturar: los diagramas están vacíos.':'No se ha podido generar ninguna captura.');return;}
    this.modal(`<h3>${done.length===1?'Captura guardada':done.length+' capturas guardadas'}</h3><p>Cada imagen tiene el E-R, el relacional y el DED del proyecto, y está en su subcarpeta <b>Captura</b>.</p>
      <div class="folder-demo" style="margin:0">${done.map(([p,f])=>`${ICO.folder} ${esc(p.name)} <span class="d">›</span> Captura <span class="d">›</span> ${esc(f.split(/[\\/]/).pop())}`).join('<br>')}</div>
      ${empty.length?`<p style="margin-top:8px">Sin diagramas (no se ha generado imagen): ${empty.map(esc).join(', ')}</p>`:''}
      <div class="mrow"><button class="ebtn" data-m="close">Cerrar</button><button class="ebtn pri" data-m="showfile" data-f="${escA(done[done.length-1][1])}">Mostrar en la carpeta</button></div>`);
  },
  async importCode(txt){
    let list;try{list=await fromCode(txt);}catch(e){toast(e.message,'warn');return;}
    this.closeModal();
    const names=new Set(this.projects.map(p=>p.name.toLowerCase()));const got=[];
    if(list.act){await this.importActivity(list.act,list[0],names);return;}
    for(const src of list){
      let name=String(src.name||'proyecto importado').trim()||'proyecto importado';if(names.has(name.toLowerCase()))name+=' (importado)';names.add(name.toLowerCase());
      const np=await this.run(()=>window.api.create(name));if(!np)continue;
      np.enun=String(src.enun||'');np.sql=String(src.sql||'');np.test=String(src.test||'');np.er=cleanModel(src.er||{},'er');np.rel=cleanModel(src.rel||{},'rel');np.ded=cleanModel(src.ded||{},'ded');np.bo=cleanModel(src.bo||{},'bo');np.updated=Date.now();
      await this.run(()=>window.api.save(plainProject(np),exportSVGs(np)));got.push(np.folder);
    }
    if(got.length){await this.reload(got[0]);const by=list.by&&(list.by.nick||list.by.title)?` Compartido por ${list.by.nick||'alguien'}${list.by.title?' («'+list.by.title+'»)':''}.`:'';toast((got.length===1?'Proyecto importado.':`${got.length} proyectos importados.`)+by);}
  },
  async onModal(e){
    if(e.target.id==='modal'){this.closeModal();return;}
    if(e.target.closest('[data-theme-set]')&&this.settingsOpen){setTimeout(()=>this.renderSettings(),0);return;}
    const pa=e.target.closest('[data-act^="prog-"]');if(pa){await this.action(pa);return;}
    const go=e.target.closest('[data-gho]');if(go){const v=go.dataset.v==='true'?true:go.dataset.v==='false'?false:go.dataset.v;try{GH.info=await window.api.gitOpts({[go.dataset.gho]:v});GH.schedule();}catch(er){}this.renderSettings();return;}
    const ga=e.target.closest('[data-ghact]');if(ga){const k=ga.dataset.ghact,msg=t=>{const m=document.getElementById('ghmsg');if(m)m.textContent=t;};
      if(k==='sync'){await GH.sync(true);this.renderSettings();return;}
      if(k==='off'){GH.info=await window.api.gitOff();GH.schedule();GH.paint();this.renderSettings();toast('Desconectado de GitHub. Tus archivos siguen en este ordenador.');return;}
      if(k==='setup'){const f={url:document.getElementById('ghurl').value,name:document.getElementById('ghname').value,email:document.getElementById('ghemail').value};ga.disabled=true;msg('Conectando… (si se abre una ventana de GitHub, inicia sesión)');
        try{await this.flushAll();const r=await window.api.gitSetup(f);GH.info=r.info;GH.schedule();GH.paint('ok','GitHub · al día '+GH.ago(Date.now()));await this.refreshFromDisk();if(await Sync.load(true))this.afterSync();
          window.api.gitClaim().catch(()=>{});toast('Conectado con GitHub. Ya están subidos tus proyectos.');if(r.conflicts&&r.conflicts.length)GH.showConflicts(this,r.conflicts);else this.renderSettings();}
        catch(er){msg('');toast(er.message,'warn');ga.disabled=false;try{GH.info=await window.api.gitInfo();}catch(x){}}return;}}
    const sb=e.target.closest('[data-sec]');if(sb){this._sec=sb.dataset.sec;this.renderSettings();document.getElementById('setbody').scrollTop=0;return;}
    const sv=e.target.closest('[data-setv]');if(sv&&sv.dataset.setv==='lang'){if(sv.dataset.v!==LANG()){Settings.set('lang',sv.dataset.v);await this.flushAll();this.keepPlace();window.api.reload();}return;}
    if(sv){const v=sv.dataset.v;Settings.set(sv.dataset.setv,/^\d+$/.test(v)?+v:v);this.renderSettings();return;}
    const tn=e.target.closest('[data-th]');if(tn){this._th=tn.dataset.th;this.renderSettings();const a=document.getElementById('thart');if(a)a.scrollTop=0;return;}
    const b=e.target.closest('[data-m]');if(!b)return;const k=b.dataset.m;
    if(k==='close'){this._capKey=null;this.closeModal();return;}
    if(k==='set-keys'){this._sec='atajos';this.showSettings();return;}
    if(k==='ic'){const p=this._icP;this.closeModal();if(!p)return;if(b.dataset.ic)p.icon=b.dataset.ic;else delete p.icon;this.touch(p);this.renderTree();return;}
    if(k==='gh-claim'){this.closeModal();window.api.gitClaim().catch(()=>{});return;}
    if(k==='gh-quit'){this.closeModal();GH.info.onClose=false;window.api.closeWin();return;}
    if(k==='mv'){const p=this._mvP;this.closeModal();if(p)await this.moveTo({p},b.dataset.to);return;}
    if(k==='mvg'){const g=this._mvG;this.closeModal();if(g)await this.moveTo({g},b.dataset.to);return;}
    if(k==='mv-new'){const p=this._mvP;this.closeModal();const g=await this.run(()=>window.api.mkGroup('',LANG()==='en'?'New folder':'Nueva carpeta'));if(!g)return;this.groups=await window.api.groups();if(p)await this.moveTo({p},g);this._gEdit=g;this.renderTree();return;}
    if(k==='key-set'){this._capKey=b.dataset.k;this.renderSettings();return;}
    if(k==='key-clear'){const ks={...(Settings.get().keys||{})};ks[b.dataset.k]='';Settings.set('keys',ks);this.renderSettings();return;}
    if(k==='keys-reset'){Settings.set('keys',{});this._capKey=null;this.renderSettings();toast('Atajos restablecidos.');return;}
    if(k==='cmp-go'){this.runCompare();return;}
    if(k==='act-code'){this.makeActivityCode();return;}
    if(k==='act-start'){this.closeModal();this.startActivity(this.cur);return;}
    if(k==='cmp-mark'){const d=this._cmp;if(!d)return;this.diff={p:this.cur,marks:d.marks,with:d.with};this.closeModal();const first=['er','rel','ded'].find(v=>d.parts.includes(v)&&Object.keys(d.marks[v]||{}).length)||d.parts[0];this.go(this.cur,first);toast('Verde: solo en el tuyo. Ámbar: cambiado. Lo que falta está en la lista.');return;}
    if(k==='controls'){this.showControls();return;}
    if(k==='news'){this.showNews();return;}
    if(k==='fullscreen'){window.api.winFullscreen();return;}
    if(k==='imp-add'||k==='imp-rep'){const f=this._imp;this._imp=null;this.closeModal();if(f)f(k==='imp-add'?'add':'rep');return;}
    if(k==='repo'){window.api.updatePage();return;}
    if(k==='set-reset'){Settings.reset();Theme.set('system');this.renderSettings();toast('Ajustes restablecidos.');return;}
    if(k==='wb-pick'){this.closeModal();const p=this.cur;
      const f=await this.run(()=>window.api.openText({title:t('Importar de MySQL Workbench o phpMyAdmin'),filters:[{name:'Workbench / SQL',extensions:['mwb','sql','txt']}]}));if(!f)return;
      let sql=f.text,pos=null;
      if(f.kind==='mwb'){try{const r=mwbToSQL(f.text,f.name);sql=r.sql;pos=r.pos;}catch(e){toast(e.message,'warn');return;}}
      const load=()=>{p.sql=sql;this.touch(p);const tx=document.getElementById('sqltxt');if(tx)tx.value=p.sql;this.drawSQL(p,pos);};
      if(p.sql&&p.sql.trim()&&p.sql!==sql)this.confirm('Importar',`Se sustituirá el SQL de este proyecto por el de «${f.name}».`,'Sustituir',load);else load();return;}
    if(k==='wb-save'){const p=this.cur,from=this._wbFrom,data=document.getElementById('wb-data').checked;let r,sc;
      try{r=genSQL(p,from,'mysql');sc=schemaOf(p[from].t,from==='rel');}catch(err){toast(err.message,'warn');return;}
      let txt=r.sql;if(data)txt+=(LANG()==='en'?'\n-- Sample data\n':'\n-- Datos de ejemplo\n')+insertsSQL(sc,sampleRows(sc,Settings.get().sampleRows||5),'mysql');
      this.closeModal();if(p._rn){clearTimeout(p._rn);p._rn=null;await this.doRename(p);}
      const f=await this.run(()=>window.api.saveText({title:t('Exportar para MySQL Workbench y phpMyAdmin'),folder:p.folder,name:p.name,ext:'.sql',text:txt,filters:[{name:'SQL',extensions:['sql']}]}));
      if(!f)return;
      this.modal(`<h3>Archivo .sql guardado</h3><div class="folder-demo" style="margin:0 0 10px">${esc(f)}</div>
        <p class="news-h">MySQL Workbench</p><ol class="steps"><li>Menú <b>File › Import › Reverse Engineer MySQL Create Script…</b></li><li>Elige este archivo y marca <b>Place imported objects on a diagram</b>.</li><li>Pulsa <b>Execute</b> y luego <b>Finish</b>: te dibuja el diagrama (EER) con las tablas y sus relaciones.</li><li>Para crear la base de datos de verdad: <b>File › Open SQL Script…</b>, abre el archivo y pulsa el rayo (ejecutar).</li></ol>
        <p class="news-h">phpMyAdmin</p><ol class="steps"><li>Entra en phpMyAdmin (por ejemplo, desde XAMPP) y abre la pestaña <b>Importar</b>.</li><li>Elige este archivo y pulsa <b>Importar</b> (o <b>Continuar</b>). Se crea la base de datos con sus tablas.</li><li>Dentro de la base, en <b>Más › Diseñador</b>, verás las tablas y sus relaciones.</li></ol>
        <p class="tnote">Ojo: el archivo empieza con DROP DATABASE IF EXISTS, así que si ya tenías una base con ese nombre, se sustituye.</p>
        <div class="mrow"><button class="ebtn" data-m="close">Cerrar</button><button class="ebtn pri" data-m="showfile" data-f="${escA(f)}">Mostrar en la carpeta</button></div>`,'wide');return;}
    if(k==='upd-get'){this.downloadUpdate(b);return;}
    if(k==='upd-install'){this.installUpdate(b);return;}
    if(k==='upd-later'){try{localStorage.setItem('mb:upd:later',String(Date.now()));}catch(e){}this.closeModal();return;}
    if(k==='upd-skip'){try{localStorage.setItem('mb:upd:skip',this._upd.tag);}catch(e){}this.closeModal();return;}
    if(k==='upd-check'){this.closeModal();this.checkUpdates(true);return;}
    if(k==='cf-ok'){const cb=this._cf;this._cf=null;this.closeModal();if(cb)cb();return;}
    if(k==='fe-add'||k==='fe-rep'){const cb=this._feCb;this._feCb=null;this.closeModal();if(cb)cb(k==='fe-rep');return;}
    if(k==='clear-go'){const p=this.cur,en=document.getElementById('cl-enun').checked;this.closeModal();if(!p)return;
      p.er={nodes:[],links:[]};p.rel={t:[]};p.ded={t:[]};p.sql='';if(en)p.enun='';this.ed.hist=[];this.ed.redo=[];this.touch(p);this.renderMain();toast('Proyecto vaciado.');return;}
    if(k==='quit-save'){b.disabled=true;await this.flushAll();if(this.dirtyList().length){toast('No se pudo guardar todo. Revisa la barra de abajo.','warn');b.disabled=false;return;}GH.close().finally(()=>window.api.ready());return;}
    if(k==='quit-nosave'){GH.close().finally(()=>window.api.ready());return;}
    if(k==='code'){await this.importCode(document.getElementById('imptxt').value);return;}
    if(k==='copy'){const t=document.getElementById('exptxt');
      try{await navigator.clipboard.writeText(t.value);b.textContent='Copiado';}catch(err){t.focus();t.select();b.textContent='Pulsa Ctrl+C';}return;}
    if(k==='showfile'){this.run(()=>window.api.showFile(b.dataset.f));this.closeModal();return;}
    if(k==='dir'){this.closeModal();
      const got=await this.run(()=>window.api.importDir());
      if(got&&got.length){await this.reload(got[0]);toast(got.length===1?'Proyecto importado.':`${got.length} proyectos importados.`);}
      else if(got)toast('No se ha encontrado ningún proyecto ahí.');}
  }
};
App.start();
