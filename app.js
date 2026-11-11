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
  const sc=Math.min(2,12000/Math.max(c.w,c.h));const cv=document.createElement('canvas');cv.width=Math.round(c.w*sc);cv.height=Math.round(c.h*sc);
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
  const json=JSON.stringify({app:'modelado-bases',v:1,proyectos:list.map(p=>{const q=plainProject(p);return{name:q.name,enun:q.enun,sql:q.sql,test:q.test,bo:q.bo,er:q.er,rel:q.rel,ded:q.ded};})});
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
  return list;
}

/* ===================== Tema claro / oscuro ===================== */
const Theme={
  get(){try{return localStorage.getItem('mb:theme')||'system';}catch(e){return 'system';}},
  apply(m){if(m==='light'||m==='dark')document.documentElement.setAttribute('data-theme',m);else document.documentElement.removeAttribute('data-theme');
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
const SET_SECS=[['apariencia','Apariencia',ico('<circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M9 2.5a6.5 6.5 0 0 0 0 13z" fill="currentColor"/>')],
  ['ventana','Ventana',ico('<rect x="2" y="3" width="14" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2 6.5h14" stroke="currentColor" stroke-width="1.3"/>')],
  ['accesibilidad','Accesibilidad',ico('<circle cx="9" cy="3.5" r="1.6" fill="currentColor"/><path d="M3 6.5h12M9 6.5v4.5l-3 4.5M9 11l3 4.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>')],
  ['lienzo','Lienzo',ico('<path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="6" cy="6" r=".9" fill="currentColor"/><circle cx="9" cy="6" r=".9" fill="currentColor"/><circle cx="12" cy="6" r=".9" fill="currentColor"/><circle cx="6" cy="9" r=".9" fill="currentColor"/><circle cx="9" cy="9" r=".9" fill="currentColor"/><circle cx="12" cy="9" r=".9" fill="currentColor"/><circle cx="6" cy="12" r=".9" fill="currentColor"/><circle cx="9" cy="12" r=".9" fill="currentColor"/><circle cx="12" cy="12" r=".9" fill="currentColor"/>')],
  ['atajos','Atajos',ico('<rect x="1.5" y="4.5" width="15" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M4 7.5h1.5M7 7.5h1.5M10 7.5h1.5M13 7.5h1M5 10.5h8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>')],
  ['actualizaciones','Actualizaciones',ico('<path d="M14.5 6.5A6 6 0 1 0 15 11" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M15 2.5v4h-4" fill="none" stroke="currentColor" stroke-width="1.4"/>')],
  ['teoria','Teoría',ico('<path d="M2.5 3.5c2.5-1 4.5-1 6.5.5v11c-2-1.5-4-1.5-6.5-.5zM15.5 3.5c-2.5-1-4.5-1-6.5.5v11c2-1.5 4-1.5 6.5-.5z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>')],
  ['acerca','Acerca de',ico('<circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M9 8v4.5" stroke="currentColor" stroke-width="1.5"/><circle cx="9" cy="5.5" r="1" fill="currentColor"/>')]];
const kb=s=>s.split('+').map(k=>`<kbd>${k}</kbd>`).join('+');
const CONTROLS=[
  ['Lienzo',[['Rueda del ratón','Zoom (acercar y alejar)'],['Clic derecho y arrastrar','Moverte por el lienzo (también con la rueda pulsada)'],['Clic en un hueco y arrastrar','Seleccionar varias cosas a la vez'],['Ctrl+clic','Añadir o quitar de la selección'],['@selectAll','Seleccionar todo'],['@find','Buscar en el diagrama'],['@fit','Ajustar la vista'],['@distribute','Distribuir'],['@lock','Bloquear / desbloquear la posición'],['@notation','Cambiar de notación'],['Clic derecho','Menú con opciones del elemento (sin mover el ratón)'],['Arrastrar un elemento','Moverlo (una entidad se lleva sus atributos)'],['Arrastrar un botón','Entidad, Relación, Atributo o Tabla: suéltalo donde lo quieras (un atributo encima de una entidad se une a ella)'],['Flechas','Mover lo seleccionado (con Mayús, más rápido)'],['Varios seleccionados','Alinear y repartir desde el panel derecho']]],
  ['Editar',[['@copy','Copiar'],['@cut','Cortar'],['@paste','Pegar'],['@duplicate','Duplicar'],['@rename','Renombrar'],['@del','Borrar lo seleccionado (también Retroceso)'],['@undo','Deshacer'],['@redo','Rehacer'],['Esc','Cancelar / quitar la selección']]],
  ['Unir y relacionar',[['Mayús+clic','Une lo seleccionado con el elemento que pulses'],['Dos entidades','Al unirlas se crea una relación en medio'],['Mayús+clic en Rel/DED','Relaciona dos tablas: eliges quién recibe la clave'],['Clic en una línea','Poner máximo y mínimo de esa línea']]],
  ['Panel',[['Enter en un atributo','Crea otro atributo en la misma entidad'],['Enter en una columna','Crea otra columna debajo'],['Enter en el nombre de la tabla','Añade una columna']]],
  ['General',[['@save','Guardar'],['Ctrl+1 … Ctrl+7','Enunciado, Boceto, E-R, Relacional, DED, SQL, Probar'],['@controls','Ver estos controles'],['@settings','Ajustes'],['@projector','Modo proyector'],['F11','Pantalla completa']]]
];
const RESUMEN=["Proyectos guardados como carpetas en «Modelados BDD», en el sitio que elijas. Cada uno con su enunciado, E-R, relacional, DED y SQL.", "Boceto y E-R: entidades (normales y débiles), relaciones (binarias, ternarias e identificadoras), jerarquías (ISA) y atributos de todos los tipos, en notación Chen, pata de gallo o UML. Máximo y mínimo con preguntas sencillas; el tipo (1:1, 1:N, N:M) sale solo.", "Relacional y DED: tablas con PK, FK, NN y Único. Se pueden crear desde el E-R (con o sin las relaciones) y relacionar entre sí con Mayús+clic.", "SQL para MySQL, SQL Server, Oracle o PostgreSQL, con datos de ejemplo; se puede editar, y también al revés: de un SQL dibuja las tablas.", "Pestaña Probar: una base de datos SQLite de verdad dentro de la app para ejecutar consultas y comprobar las claves ajenas.", "Avisa de nombres repetidos, de entidades sin PK y de relaciones a medias antes de pasar a tablas.", "Lienzo grande con zoom, selección múltiple, copiar y pegar, deshacer, Distribuir, alinear, notas y arrastrar los botones hasta donde quieras.", "Teoría completa y ajustes de accesibilidad. Se guarda solo (y con Ctrl+S). Pasar proyectos con un código, imagen del ejercicio (Captura), exportar a ERDPlus, abrir un proyecto en su propia ventana, tema claro u oscuro. Se actualiza sola."];
const RESUMEN_EN=["Projects saved as folders in «Modelados BDD», wherever you choose. Each one with its brief, E-R, relational, DSD, SQL and tests.",
  "Sketch and E-R: entities (normal and weak), relationships (binary, ternary, identifying), hierarchies (ISA) and every kind of attribute, in Chen, crow's foot or UML notation. Maximum and minimum with simple questions; the type (1:1, 1:N, N:M) appears by itself.",
  "Relational and DSD: tables with PK, FK, NN and Unique. They can be created from the E-R (with or without the relationships) and related with Shift+click.",
  "SQL for MySQL, SQL Server, Oracle or PostgreSQL, with sample data. And the other way round: from an SQL script it draws the tables.",
  "Test tab: a real SQLite database inside the app to run queries and check the foreign keys.",
  "Warns about repeated names, entities without a PK and unfinished relationships before converting to tables.",
  "Large canvas with zoom, multiple selection, right-click menu, find (Ctrl+F), copy and paste, undo, Arrange, align, notes and drag-and-drop buttons.",
  "Full theory, accessibility settings, Spanish and English. Saves automatically (and with Ctrl+S), updates itself, shares projects with a code, exports images and ERDPlus files."];
const NOVEDADES_EN=['New Sketch tab (right after the Brief): only entities and lines between them, to think about what relates to what. «To the E-R» creates the entities and a diamond for each line.',
  'Hierarchies (ISA, generalization / specialization): «Hierarchy» button, total or partial, disjoint or overlapping, and three ways to convert them to tables.',
  'Easier ternary relationships: select 3 entities and «Ternary relationship between the 3»; or join a third entity to a relationship.',
  "Choose the notation: Chen, crow's foot or UML, in the E-R and the DSD (diagram bar or Settings › Canvas).",
  'Arrange in the relational and DSD redone: it looks for the layout with fewest line crossings and no lines over tables.',
  'Right-angled lines in the relational and the DSD (Settings › Canvas).',
  'Lock the position of any element (right button or Ctrl+L): it does not move when dragged or arranged.',
  'Compare two versions («Compare» button): with another project or a code, it tells you what is missing, extra or different, and marks it on the diagram.',
  'SQL errors in the Test tab are explained, with a tip to fix them and the failing statement.',
  'Keyboard shortcuts your way (Settings › Shortcuts) and projector mode for class (Ctrl+Shift+P).'];
const NOVEDADES=[
  '1.9: pestaña Boceto (justo después del Enunciado): solo entidades y líneas entre ellas, para pensar qué se relaciona con qué. «Pasar al E-R» crea las entidades y un rombo por cada línea.',
  '1.9: jerarquías (ISA, generalización / especialización): botón «Jerarquía», total o parcial, exclusiva o solapada, y tres formas de pasarlas a tablas.',
  '1.9: relaciones ternarias más fáciles: selecciona 3 entidades y «Relación ternaria entre las 3»; o une una tercera entidad a una relación.',
  '1.9: notación a elegir: Chen, pata de gallo o UML, en el E-R y en el DED (barra del diagrama o Ajustes › Lienzo).',
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
    Settings.init();I18N.start();try{window.api.setLang(LANG());}catch(e){}Theme.init();Splits.init();this.ed=new Editor(this);this.bind();
    window.api.onCloseRequest(()=>this.onCloseRequest());
    window.api.onWindows(l=>{this.locked=new Set(l);this.renderTree();if(this.cur&&this.view)this.renderMain();});
    window.api.onWindowClosed(f=>this.afterWindow(f));
    try{this.base=await window.api.baseGet();}catch(e){}
    this.renderFoot();
    if(this.solo){await this.startSolo();return;}
    setTimeout(()=>this.archiveWarn(),900);
    if(!this.base){this.showSetup();this.maybeNews();setTimeout(()=>this.checkUpdates(false),1500);return;}
    try{this.locked=new Set(await window.api.windows());}catch(e){}
    let back=null;try{back=JSON.parse(sessionStorage.getItem('mb:reopen')||'null');sessionStorage.removeItem('mb:reopen');}catch(e){}
    await this.reload(back&&back.f);if(back&&back.f&&this.cur&&VIEWS[back.v]){this.go(this.cur,back.v);if(back.set)this.showSettings(back.set);}this.maybeNews();
    setTimeout(()=>this.checkUpdates(false),1500);
  },
  keepPlace(){try{sessionStorage.setItem('mb:reopen',JSON.stringify({f:this.cur&&this.cur.folder,v:this.view,set:this.settingsOpen?this._sec:null}));}catch(e){}},
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
    // Lo normal: se descarga sola en segundo plano y se instala al cerrar la app
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
  bindProgress(){
    if(this._dlBound)return;this._dlBound=true;
    window.api.onUpdateProgress(({got,total,phase})=>{
      const pc=total?Math.min(100,got/total*100):0,mb=`${(got/1048576).toFixed(1)}${total?' de '+(total/1048576).toFixed(1):''} MB`;
      // Ventana de actualización
      const f=document.getElementById('dlfill'),t=document.getElementById('dltxt');
      if(f&&t){if(phase==='extract'){f.style.width='100%';t.textContent='Preparando la instalación…';}else{f.style.width=pc.toFixed(1)+'%';t.textContent=`Descargando… ${Math.floor(pc)} % (${mb})`;}}
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
  maybeNews(){let seen=null;try{seen=localStorage.getItem('mb:seen');}catch(e){}if(seen!==VERSION){this.showNews();try{localStorage.setItem('mb:seen',VERSION);}catch(e){}}},
  showNews(){const en=LANG()==='en',RES=en?RESUMEN_EN:RESUMEN,NOV=en?NOVEDADES_EN:NOVEDADES.filter(n=>{const mm=VERSION.split('.').slice(0,2).join('.');return n.startsWith(mm+':')||n.startsWith(mm+'.');}).map(n=>n.slice(n.indexOf(':')+2));
    this.modal(`<h3>Modelado Bases ${VERSION}</h3><p>Programa para hacer el E-R, el relacional, el DED y el SQL de tus ejercicios de bases de datos.</p><p class="news-h">Qué puedes hacer</p><ul class="news notr">${RES.map(n=>`<li>${esc(n)}</li>`).join('')}</ul><p class="news-h">Novedades de la ${VERSION}</p><ul class="news notr">${NOV.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>${en?'':`<details class="older"><summary>Cambios anteriores (1.5 – 1.6.4)</summary><ul class="news">${NOVEDADES.filter(n=>!n.startsWith(VERSION+':')).map(n=>`<li>${esc(n)}</li>`).join('')}</ul></details>`}<div class="mrow"><button class="lnk mmeta" data-m="upd-check">Buscar actualizaciones</button><button class="ebtn" data-m="controls">Ver controles</button><button class="ebtn pri" data-m="close">Empezar</button></div>`);},
  showSettings(sec){this._sec=sec||this._sec||'apariencia';this.settingsOpen=true;
    this.modal(`<div class="set-wrap"><nav class="set-nav" aria-label="Ajustes"><p class="set-title">Ajustes</p>${SET_SECS.map(([k,t,ic])=>`<button class="set-nb" data-sec="${k}">${ic}<span>${t}</span></button>`).join('')}</nav><div class="set-body" id="setbody"></div><button class="set-x" data-m="close" aria-label="Cerrar ajustes" title="Cerrar (Esc)">✕</button></div>`,'settings');
    this.renderSettings();},
  renderSettings(){
    const body=document.getElementById('setbody');if(!body)return;const c=Settings.get(),sec=this._sec;
    document.querySelectorAll('.set-nb').forEach(b=>b.setAttribute('aria-current',String(b.dataset.sec===sec)));
    const tog=(k,t,sub)=>`<label class="chk"><input type="checkbox" data-set="${k}" ${c[k]?'checked':''}><span class="chk-t">${t}${sub?`<small>${sub}</small>`:''}</span><span class="sw" aria-hidden="true"></span></label>`;
    const seg=(k,t,sub,opts)=>`<div class="set-row"><div class="set-lab"><b>${t}</b>${sub?`<small>${sub}</small>`:''}</div><div class="seg" role="group" aria-label="${escA(t)}">${opts.map(([v,l])=>`<button class="segb" data-setv="${k}" data-v="${v}" aria-pressed="${String(c[k])===String(v)}">${l}</button>`).join('')}</div></div>`;
    const H=(t,sub)=>`<h3>${t}</h3>${sub?`<p class="set-sub">${sub}</p>`:''}`;
    let h='';
    if(sec==='apariencia'){const th=Theme.get();
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
    else if(sec==='atajos'){const K=KEYS();
      h=H('Atajos de teclado','Pulsa «Cambiar» y después la combinación que quieras (por ejemplo Ctrl+Mayús+E). Esc cancela.')+KEY_NAMES.map(([g,rows])=>`<p class="set-g">${g}</p>`+rows.map(([a,l])=>`<div class="set-row"><div class="set-lab"><b>${l}</b></div><div class="keyrow">${this._capKey===a?'<span class="keycap wait">Pulsa la combinación…</span>':K[a]?`<span class="keycap">${kb(K[a]==='Delete'?'Supr':K[a])}</span>`:'<span class="keycap none">Sin atajo</span>'}<button class="ebtn" data-m="key-set" data-k="${a}">Cambiar</button>${K[a]?`<button class="ebtn" data-m="key-clear" data-k="${a}" title="Quitar el atajo" aria-label="Quitar el atajo">✕</button>`:''}</div></div>`).join('')).join('')+
        `<div class="set-row"><div class="set-lab"><b>Volver a los de siempre</b></div><button class="ebtn danger" data-m="keys-reset">Restablecer atajos</button></div>`;}
    else if(sec==='lienzo'){h=H('Lienzo')+seg('notation','Notación del E-R y del DED','Chen: rombos y óvalos. Pata de gallo: cajas con los atributos dentro y patas en las líneas. UML: clases con multiplicidades (0..*, 1…).',[['chen','Chen'],['crow','Pata de gallo'],['uml','UML']])+
        seg('lines','Líneas del relacional y del DED','En ángulo: solo tramos horizontales y verticales, más limpio.',[['straight','Rectas'],['ortho','En ángulo']])+
        tog('showIsa','Botón «Jerarquía» (ISA) en el E-R','Generalización / especialización. Si no lo usas, quítalo de la barra.')+
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
    return this.queue(p,async()=>{try{await window.api.save(plainProject(p),exportSVGs(p));}catch(e){p._dirty=true;throw e;}finally{this.markDirty(p);this.updateStatus();}});},
  async flushAll(){
    this.projects.forEach(p=>{if(p._rn){clearTimeout(p._rn);p._rn=null;this.doRename(p);}});
    await Promise.all(this.projects.filter(p=>p._dirty).map(p=>this.flush(p)));
    await Promise.all(this.projects.map(p=>p._q).filter(Boolean));
  },
  async saveNow(){const n=this.dirtyList().length;await this.flushAll();if(n&&!this.dirtyList().length)toast('Guardado.');},
  doRename(p){return this.queue(p,async()=>{const nf=await window.api.rename(p.folder,p.name);p.folder=nf;this.updateStatus();});},
  renameSoon(p){clearTimeout(p._rn);p._rn=setTimeout(()=>{p._rn=null;this.doRename(p);},900);},
  async onCloseRequest(){
    window.api.ack().catch(()=>{});
    this.projects.forEach(p=>{if(p._rn){clearTimeout(p._rn);p._rn=null;this.doRename(p);}});
    await Promise.all(this.projects.map(p=>p._q).filter(Boolean));
    await this.flushAll();
    const d=this.dirtyList();
    if(!d.length){window.api.ready();return;}
    this.modal(`<h3>No se han podido guardar algunos cambios</h3><p>${d.length===1?`El proyecto <b>${esc(d[0].name)}</b> tiene cambios que no has guardado.`:`Estos proyectos tienen cambios sin guardar: ${d.map(p=>'<b>'+esc(p.name)+'</b>').join(', ')}.`}</p>
      <div class="mrow"><button class="ebtn" data-m="close">Cancelar</button><button class="ebtn danger" data-m="quit-nosave">Salir sin guardar</button><button class="ebtn pri" data-m="quit-save">Guardar y salir</button></div>`);
    document.querySelector('[data-m="quit-save"]').focus();
  },
  bind(){
    document.querySelector('.side').addEventListener('click',e=>this.onSide(e));
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
      if(K('notation')){e.preventDefault();const o=['chen','crow','uml'],c=Settings.get().notation||'chen',n=o[(o.indexOf(c)+1)%3];Settings.set('notation',n);if(edv)this.ed.renderTools();toast('Notación: '+{chen:'Chen',crow:'Pata de gallo',uml:'UML'}[n]);return;}
      if(ctrl&&!e.shiftKey&&!e.altKey&&/^[1-7]$/.test(e.key)&&this.cur&&!this.locked.has(this.cur.folder)){e.preventDefault();this.go(this.cur,Object.keys(VIEWS)[+e.key-1]);return;}
      if(typing||!edv)return;
      this.ed.key(e);
    });
  },
  counts(p){const ents=p.er.nodes.filter(n=>n.k==='ent'||n.k==='weak').length,be=((p.bo&&p.bo.nodes)||[]).filter(n=>n.k==='ent').length;return{enun:p.enun&&p.enun.trim()?'✓':'',bo:be?be+' ent.':'',er:ents?ents+' ent.':'',rel:p.rel.t.length?p.rel.t.length+' tab.':'',ded:p.ded.t.length?p.ded.t.length+' tab.':'',sql:p.sql&&p.sql.trim()?'✓':'',test:Pruebas.dbs[p._id]?'BD':''};},
  renderCounts(p){const c=this.counts(p);Object.keys(c).forEach(v=>{const el=document.querySelector(`.pi[data-pid="${p._id}"][data-view="${v}"] .cnt`);if(el)el.textContent=c[v];});},
  renderTree(){
    const t=document.getElementById('tree');if(this.solo){t.innerHTML='';return;}
    if(!this.projects.length){t.innerHTML=`<div class="tree-h">Mis proyectos</div><p class="in-p" style="padding:0 8px">Aún no tienes proyectos.</p>`;return;}
    t.innerHTML=`<div class="tree-h">Mis proyectos</div>`+this.projects.map(p=>{const op=this.open[p._id]??(this.cur===p);const c=this.counts(p),lk=this.locked.has(p.folder);
      return `<div class="proj"><button class="pf${p._dirty?' dirty':''}" data-pid="${p._id}" aria-expanded="${op}" title="${escA(p.name)}${lk?' · abierto en otra ventana':''}">${ICO.chev}${ICO.folder}<span class="nm">${esc(p.name)}</span>${lk?'<span class="win-tag">ventana</span>':''}<span class="ddot" aria-label="sin guardar"></span></button>
      ${op?`<div class="sub">${Object.entries(VIEWS).map(([v,l])=>`<button class="pi" data-pid="${p._id}" data-view="${v}" aria-current="${this.cur===p&&this.view===v}">${ICO[v]}<span>${l}</span><span class="cnt">${c[v]}</span></button>`).join('')}</div>`:''}</div>`;}).join('');
  },
  renderMain(){
    const tp=document.getElementById('tbproj');if(tp)tp.textContent=this.cur?this.cur.name:'';
    const mv=document.getElementById('mainv');
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
      <div class="ph-acts">${this.solo?'':B('window','Abrir en ventana','','Abre solo este proyecto en una ventana nueva, a pantalla completa')+'<span class="ph-sep"></span>'}${B('capture','Exportar ejercicio','','Guarda una imagen con el E-R, el relacional y el DED en la subcarpeta Captura')}${B('export','Exportar código','','Genera un código para pasar el proyecto a otra persona')}${B('erdplus','Exportar a ERDPlus','','Guarda el E-R en un archivo .erdplus que se abre en erdplus.com')}${B('erdplus-import','Importar de ERDPlus','','Abre un archivo .erdplus y lo pasa a tu E-R')}${B('compare','Comparar','','Compara este proyecto con otro (o con un código) y te dice qué cambia')}<span class="ph-sep"></span>${B('reveal','Abrir carpeta')}${this.solo?'':B('dup','Duplicar')}${B('clearproj','Vaciar proyecto','danger','Borra todos los diagramas sin borrar el proyecto')}${this.solo?'':B('delproj','Eliminar','danger')}</div></header>
      <div class="vtabs" role="tablist">${Object.entries(VIEWS).map(([v,l])=>`<button class="vtab" role="tab" data-view="${v}" aria-selected="${this.view===v}">${ICO[v]}<span>${l}</span></button>`).join('')}</div>
      <div class="view" id="view"></div>`;
    document.getElementById('pname').addEventListener('input',e=>{p.name=e.target.value.trim()||'Sin nombre';const nm=document.querySelector(`.pf[data-pid="${p._id}"] .nm`);if(nm)nm.textContent=p.name;const tp=document.getElementById('tbproj');if(tp)tp.textContent=p.name;if(this.solo)document.title=p.name+' · Modelado Bases';this.renameSoon(p);});
    const v=document.getElementById('view');
    if(this.view==='enun'){
      v.innerHTML=`<div class="enview"><p class="lbl">Enunciado · se guarda en Enunciado.txt</p><textarea class="notes" id="enun" spellcheck="true" placeholder="Pega o escribe aquí el enunciado del ejercicio. También lo puedes ver al lado del lienzo con el botón «Enunciado».">${esc(p.enun||'')}</textarea></div>`;
      document.getElementById('enun').addEventListener('input',e=>{p.enun=e.target.value;this.touch(p);});
    } else if(this.view==='sql'){
      const dl=Settings.get().sqlDialect||'mysql';
      v.innerHTML=`<div class="ed-tools"><div class="tgroup"><span class="tlab">Para</span><div class="seg dial" role="group" aria-label="Gestor de base de datos">${Object.entries(DIALECTS).map(([k,l])=>`<button class="segb" data-act="sql-dialect" data-v="${k}" aria-pressed="${dl===k}">${l}</button>`).join('')}</div></div><div class="tgroup"><button class="ebtn" data-act="sql-ded">${GL.table}<span>Generar desde el DED</span></button><button class="ebtn" data-act="sql-rel">${GL.relate}<span>Generar desde el relacional</span></button></div><div class="tgroup"><button class="ebtn" data-act="sql-draw">${GL.fromer}<span>Dibujar desde este SQL</span></button><button class="ebtn" data-act="sql-open">${GL.open}<span>Abrir archivo .sql</span></button></div><div class="tgroup"><button class="ebtn" data-act="sql-sample" title="Añade al final INSERT con datos inventados pero coherentes (respetan PK, FK y UNIQUE)">${GL.table}<span>Añadir datos de ejemplo</span></button><button class="ebtn" data-act="sql-copy">${GL.copy}<span>Copiar</span></button></div><div class="tgroup"><span class="tlab">Workbench / phpMyAdmin</span><button class="ebtn" data-act="sql-wb" title="Guarda un archivo .sql para MySQL que se abre en MySQL Workbench (te dibuja el diagrama) y en phpMyAdmin">${GL.copy}<span>Exportar</span></button><button class="ebtn" data-act="wb-import" title="Abre un modelo de MySQL Workbench (.mwb) o un .sql exportado de Workbench o phpMyAdmin y dibuja el DED y el relacional">${GL.open}<span>Importar</span></button></div><span class="tspace"></span><span class="tnote">Se guarda en SQL/script.sql · lo puedes editar a mano</span></div>
        <textarea class="sqlbox" id="sqltxt" spellcheck="false" placeholder="Pulsa «Generar desde el DED» (o desde el relacional) para crear el script, o escríbelo aquí.">${esc(p.sql||'')}</textarea>`;
      document.getElementById('sqltxt').addEventListener('input',e=>{p.sql=e.target.value;this.touch(p);});
      document.getElementById('sqltxt').addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const t=e.target,s=t.selectionStart;t.setRangeText('  ',s,t.selectionEnd,'end');p.sql=t.value;this.touch(p);}});
    } else if(this.view==='test'){Pruebas.render(v,p);
    } else {if(this.view==='bo'&&!p.bo)p.bo={nodes:[],links:[],notes:[]};this.ed.mount(v);this.ed.open(p,this.view);}
  },
  go(p,view){this.cur=p;this.view=view;this.open[p._id]=true;this.renderTree();this.renderMain();},
  byId(id){return this.projects.find(x=>x._id===id);},
  onSide(e){
    const pf=e.target.closest('.pf');if(pf){const p=this.byId(pf.dataset.pid);const op=pf.getAttribute('aria-expanded')==='true';this.open[p._id]=!op;if(!op&&this.cur!==p){this.go(p,'er');return;}this.renderTree();return;}
    const pi=e.target.closest('.pi');if(pi){this.go(this.byId(pi.dataset.pid),pi.dataset.view);return;}
    const b=e.target.closest('[data-act]');if(b)this.action(b);
  },
  onMain(e){
    const vt=e.target.closest('.vtabs [data-view]');if(vt){this.go(this.cur,vt.dataset.view);return;}
    const b=e.target.closest('.ph [data-act], .welcome [data-act]')||((this.view==='sql'||this.view==='test')&&e.target.closest('#view [data-act]'));if(b)this.action(b);
  },
  async run(fn,okMsg){try{const r=await fn();if(okMsg&&r!==null&&r!==undefined)toast(typeof okMsg==='function'?okMsg(r):okMsg);return r;}catch(e){toast(e.message,'warn');this.status('bad',e.message);return null;}},
  confirm(title,text,btn,cb,extra=''){this._cf=cb;this.modal(`<h3>${esc(title)}</h3><p>${esc(text)}</p>${extra}<div class="mrow"><button class="ebtn" data-m="close">Cancelar</button><button class="ebtn pri danger-pri" data-m="cf-ok">${esc(btn)}</button></div>`);},
  async action(b){
    const a=b.dataset.act,p=this.cur;
    if(a==='controls'){this.showControls();return;}
    if(a==='settings'){this.showSettings();return;}
    if(a==='theory'){this.showSettings('teoria');return;}
    if(a==='news'){this.showNews();return;}
    if(a==='save'){this.saveNow();return;}
    if(a==='upd-retry'){if(this._upd)this.prepareSilently(this._upd);return;}
    if(a==='upd-now'){b.disabled=true;b.textContent='Actualizando…';try{await this.flushAll();await window.api.updateInstall(this._upd.asset.url);}catch(e){b.disabled=false;b.textContent='Reiniciar y actualizar';toast('No se pudo actualizar: '+e.message,'warn');}return;}
    if(a==='setup-choose'||a==='setup-default'){
      const r=await this.run(()=>window.api.baseSetup(a==='setup-default'));if(!r)return;
      this.base=r.dir;this.renderFoot();await this.reload();
      toast(r.migrated?`Carpeta lista. He traído ${r.migrated} proyecto(s) de la versión anterior.`:'Carpeta Modelados BDD lista en '+r.dir);return;}
    if(!this.base){toast('Primero elige dónde guardar la carpeta Modelados BDD.');return;}
    if(a==='newproj'){
      const base=LANG()==='en'?'project ':'proyecto ',names=new Set(this.projects.map(x=>x.name.toLowerCase()));let n=this.projects.length+1;while(names.has((base+n)))n++;
      const np=await this.run(()=>window.api.create(base+n));if(!np)return;np._id=uid('p');this.projects.push(np);this.go(np,'er');
      const i=document.getElementById('pname');if(i){i.focus();i.select();}return;}
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
    for(const src of list){
      let name=String(src.name||'proyecto importado').trim()||'proyecto importado';if(names.has(name.toLowerCase()))name+=' (importado)';names.add(name.toLowerCase());
      const np=await this.run(()=>window.api.create(name));if(!np)continue;
      np.enun=String(src.enun||'');np.sql=String(src.sql||'');np.test=String(src.test||'');np.er=cleanModel(src.er||{},'er');np.rel=cleanModel(src.rel||{},'rel');np.ded=cleanModel(src.ded||{},'ded');np.bo=cleanModel(src.bo||{},'bo');np.updated=Date.now();
      await this.run(()=>window.api.save(plainProject(np),exportSVGs(np)));got.push(np.folder);
    }
    if(got.length){await this.reload(got[0]);toast(got.length===1?'Proyecto importado.':`${got.length} proyectos importados.`);}
  },
  async onModal(e){
    if(e.target.id==='modal'){this.closeModal();return;}
    if(e.target.closest('[data-theme-set]')&&this.settingsOpen){setTimeout(()=>this.renderSettings(),0);return;}
    const sb=e.target.closest('[data-sec]');if(sb){this._sec=sb.dataset.sec;this.renderSettings();document.getElementById('setbody').scrollTop=0;return;}
    const sv=e.target.closest('[data-setv]');if(sv&&sv.dataset.setv==='lang'){if(sv.dataset.v!==LANG()){Settings.set('lang',sv.dataset.v);await this.flushAll();this.keepPlace();window.api.reload();}return;}
    if(sv){const v=sv.dataset.v;Settings.set(sv.dataset.setv,/^\d+$/.test(v)?+v:v);this.renderSettings();return;}
    const tn=e.target.closest('[data-th]');if(tn){this._th=tn.dataset.th;this.renderSettings();const a=document.getElementById('thart');if(a)a.scrollTop=0;return;}
    const b=e.target.closest('[data-m]');if(!b)return;const k=b.dataset.m;
    if(k==='close'){this._capKey=null;this.closeModal();return;}
    if(k==='set-keys'){this._sec='atajos';this.showSettings();return;}
    if(k==='key-set'){this._capKey=b.dataset.k;this.renderSettings();return;}
    if(k==='key-clear'){const ks={...(Settings.get().keys||{})};ks[b.dataset.k]='';Settings.set('keys',ks);this.renderSettings();return;}
    if(k==='keys-reset'){Settings.set('keys',{});this._capKey=null;this.renderSettings();toast('Atajos restablecidos.');return;}
    if(k==='cmp-go'){this.runCompare();return;}
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
    if(k==='quit-save'){b.disabled=true;await this.flushAll();if(this.dirtyList().length){toast('No se pudo guardar todo. Revisa la barra de abajo.','warn');b.disabled=false;return;}window.api.ready();return;}
    if(k==='quit-nosave'){window.api.ready();return;}
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
