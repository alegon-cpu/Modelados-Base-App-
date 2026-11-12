/* ===================== Progreso en un archivo ===================== */
// Todo lo que la app guarda en localStorage («mb:…»: ajustes, atajos, tema, recientes, tokens y premios) se copia también a progreso-modelado.json,
// en la carpeta elegida en Ajustes (por defecto la de proyectos). Al arrancar, si el archivo es más nuevo, manda el archivo.
const Sync={_t:null,
  dump(){const d={};try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('mb:')&&k!=='mb:sync-t'&&!k.startsWith('mb:w:'))d[k]=localStorage.getItem(k);}}catch(e){}return d;},
  hook(){if(this._h)return;this._h=1;const orig=Storage.prototype.setItem,rm=Storage.prototype.removeItem,self=this;
    Storage.prototype.setItem=function(k,v){orig.call(this,k,v);if(this===window.localStorage&&String(k).startsWith('mb:')&&k!=='mb:sync-t'&&!String(k).startsWith('mb:w:'))self.save();};
    Storage.prototype.removeItem=function(k){rm.call(this,k);if(this===window.localStorage&&String(k).startsWith('mb:')&&k!=='mb:sync-t')self.save();};},
  // Devuelve true si ha traído datos más nuevos del archivo (hay que recargar)
  async load(){let f=null;try{f=await window.api.progRead();}catch(e){return false;}let lt=0;try{lt=+(localStorage.getItem('mb:sync-t')||0);}catch(e){}
    if(f&&f.data&&typeof f.data==='object'&&(+f.updated||0)>lt){try{Object.entries(f.data).forEach(([k,v])=>{if(String(k).startsWith('mb:')&&typeof v==='string')Storage.prototype.setItem.call(localStorage,k,v);});localStorage.setItem('mb:sync-t',String(+f.updated));}catch(e){}return true;}
    if(!f||lt>(+f.updated||0))this.save(true);return false;},
  save(now){if(!this._ready)return;clearTimeout(this._t);const go=()=>{const t=Date.now();try{localStorage.setItem('mb:sync-t',String(t));}catch(e){}
    window.api.progWrite({app:'modelado-bases',que:'Progreso y ajustes de Modelado Bases',updated:t,data:this.dump()}).catch(()=>{});};if(now)go();else this._t=setTimeout(go,700);}
};

/* ===================== «No cliques esto»: minijuegos, tokens y tiradas ===================== */
// Todo se guarda en este ordenador (localStorage «mb:juego»). No hay dinero de por medio: los tokens solo se ganan jugando.
const RAR={c:{n:'Común',p:60,frag:1,col:'#7C8A96'},r:{n:'Rara',p:28,frag:3,col:'#2F86D6'},e:{n:'Épica',p:10,frag:8,col:'#9B4FD6'},l:{n:'Legendaria',p:2,frag:20,col:'#E0A21A'}};
const PITY=40,FRAG_TOKEN=10;
// ---------- Catálogo de premios (50 comunes, 25 raros, 15 épicos, 10 legendarios) ----------
const RW_ACC=[['Esmeralda','#1E8E5A'],['Turquesa','#138A8A'],['Cielo','#2B7BC0'],['Cobalto','#2F55C8'],['Índigo','#4B48B8'],['Violeta','#7A45C2'],['Orquídea','#A2479F'],['Frambuesa','#C2366B'],['Coral','#D9573E'],['Mandarina','#C9690F'],
  ['Ámbar','#AE7E0B'],['Oliva','#6B7A1F'],['Lima','#4F8A16'],['Pino','#2E6B3F'],['Pizarra azul','#4F6475'],['Chocolate','#7A4A2A'],['Burdeos','#8C2639'],['Lavanda','#7E66C2'],['Salmón','#C9605A'],['Grafito','#4A4A4A']];
const RW_ICO=[['Pizza','🍕'],['Libros','📚'],['Mando','🎮'],['Cohete','🚀'],['Música','🎵'],['Balón','⚽'],['Planeta','🌍'],['Fuego','🔥'],['Bombilla','💡'],['Probeta','🧪'],['Gato','🐱'],['Perro','🐶'],['Zorro','🦊'],['Panda','🐼'],['Arcoíris','🌈'],
  ['Estrella','⭐'],['Luna','🌙'],['Trébol','🍀'],['Paleta','🎨'],['Puzle','🧩'],['Trofeo','🏆'],['Diamante','💎'],['Diana','🎯'],['Herramientas','🛠️'],['Dragón','🐉'],['Dónut','🍩'],['Guitarra','🎸'],['Canasta','🏀'],['Cactus','🌵'],['Unicornio','🦄']];
const RW_TIT=['Domador de FK','Señor de las N:M','Cazador de NULLs','Arquitecto de Tablas','Normalizador Supremo','Maestro del JOIN','El que nunca olvida la PK','Guardián de la Integridad','Susurrador de Cardinalidades','Rey del SELECT',
  'Reina del WHERE','Mago del GROUP BY','Explorador de Esquemas','Caballero de la 3FN','Pirata de los Índices','Hacker del DED','Rompediagramas','Leyenda del E-R','Ninja de las Claves','Alquimista del SQL','Sensei del Boceto','Dueño del CASCADE','Viajero Relacional','Ojo de Halcón','Tejedor de Relaciones'];
// Temas: [nombre, oscuro, bg, panel, surface, ink, muted, line, line2, hover, accent, accentInk, sel, selInk, grid, dedHead]
const RW_THEME=[['Océano',1,'#0E1B2A','#12243A','#162C45','#E3EEF9','#8FA7C0','#23405F','#2F5478','#1B3552','#4FC3F7','#04202E','#1D4566','#DDF3FF','#1A3048','#2A6F9E'],
  ['Atardecer',0,'#FBF1EA','#FFF7F2','#FFFFFF','#3A2320','#8A6A60','#F0DCD0','#E2C3B2','#F7E6DC','#D0532E','#FFFFFF','#FBE0D4','#7A2A12','#F3E3D9','#B8502F'],
  ['Bosque',1,'#111C16','#15241C','#1A2D23','#E2EFE6','#93AD9C','#26402F','#33553F','#1E3628','#6FCF8E','#0B2414','#234A32','#DBF5E3','#1C3024','#2F7A4B'],
  ['Lavanda',0,'#F4F1FA','#F9F7FD','#FFFFFF','#2B2440','#6E6789','#E3DDF2','#CEC5E6','#ECE7F7','#7B5CC9','#FFFFFF','#E6DEF8','#3D2A7A','#ECE8F5','#5E46A8'],
  ['Arena',0,'#F5EFE3','#FAF6EE','#FFFDF8','#3B3326','#7D705A','#E7DCC6','#D6C7A8','#EFE6D4','#9C6A1E','#FFFFFF','#F1E2C4','#5C3D0E','#EDE4D2','#8C6424'],
  ['Medianoche',1,'#0D0F1A','#121527','#171B31','#E4E6F5','#9096BA','#262B4A','#343A62','#1D2240','#8C9EFF','#10163A','#262E5C','#E3E7FF','#1A1E36','#4453A8'],
  ['Cereza',0,'#FBF0F3','#FDF6F8','#FFFFFF','#3B1F28','#8C6371','#F2DAE1','#E5BFCB','#F8E4EA','#C2345D','#FFFFFF','#F8D9E3','#6E1530','#F5E4E9','#A6304F'],
  ['Café',1,'#1C1612','#231C17','#2A221C','#F0E6DC','#B3A08F','#3D3128','#514135','#322920','#D9A066','#2A1606','#4A3725','#FBEBD9','#2E251E','#8A5A2E'],
  ['Menta',0,'#EEF8F4','#F5FCF9','#FFFFFF','#1D3A31','#5E8277','#D5EDE4','#B6DDCE','#E3F4ED','#178A69','#FFFFFF','#D3F0E5','#0D4A37','#E2F2EB','#167A5D'],
  ['Grafito',1,'#161718','#1C1D1F','#222326','#E8E8E9','#A0A1A6','#333539','#45474D','#2A2C2F','#E0E0E0','#161718','#3A3C41','#FFFFFF','#242528','#55585F'],
  ['Glaciar',0,'#EEF5FA','#F5F9FC','#FFFFFF','#1C2B38','#5C7286','#D6E4EF','#B9CFE0','#E4EEF6','#2A7DB8','#FFFFFF','#D4E8F6','#0E3E5F','#E3EDF5','#2C6B99'],
  ['Volcán',1,'#1A0F0E','#221312','#2A1816','#F6E4E0','#C29A92','#432522','#5C322D','#33201D','#FF6B4A','#2A0A04','#55241C','#FFE2DA','#2C1A18','#A8372A'],
  ['Limón',0,'#FBF9E8','#FDFCF1','#FFFFFF','#33311A','#7A7650','#EEEAC7','#DEDAA4','#F5F2D8','#7D780C','#FFFFFF','#F1EDBE','#4B4805','#F2EFD5','#7A7512'],
  ['Aurora',1,'#0C1418','#101C21','#14242A','#E0F4F2','#8DB3B0','#1F3A40','#2B4F57','#18302F','#7CF2C9','#072019','#1D4A45','#DCFFF4','#15282D','#3F7FA3'],
  ['Papel antiguo',0,'#EFE6D2','#F5EEDD','#FBF6EA','#3E3424','#7E6E52','#DCCFB3','#C9B891','#E9DEC5','#8B4A2B','#FFFFFF','#E8D6BC','#4F2612','#E6DBC3','#6E4A2E']];
const RW_LEG=[
  {id:'l-pizarra',n:'Pizarra',kind:'theme',d:'Tema de pizarra verde con trazos de tiza.',t:['Pizarra',1,'#1F3326','#22382A','#284232','#F1F0E6','#B8C4B0','#3B5A45','#4E7259','#2D4A37','#F4E37C','#22301F','#3A5A42','#FFFBE0','#2A4533','#3D5E48'],
    x:'--er-stroke:#EFEFE4;--c-ent:#F4F1E1;--c-rel:#F7D774;--c-att:#B8F0C0;--c-key:#F9B8D8;--e-fill:#284232;--r-fill:#284232;--a-fill:#284232;--k-fill:#284232;--card:#F7D774;--ded-border:#CBD8C7;--pk:#F9B8D8;--fk:#F7D774;--pk-ink:#F9B8D8;--fk-ink:#F7D774;--col:#B8F0C0;'},
  {id:'l-neon',n:'Neón',kind:'theme',d:'Tema oscuro con diagramas que brillan.',t:['Neón',1,'#07070F','#0C0C18','#111122','#F2F2FF','#9C9CC9','#23234A','#34346B','#17172E','#FF2E97','#1A0010','#3A1236','#FFD6EE','#12122A','#1B1B44'],
    x:'--er-stroke:#00E5FF;--c-ent:#00E5FF;--c-rel:#FF2E97;--c-att:#7CFF6B;--c-key:#FFE600;--e-fill:#0B1E2A;--r-fill:#2A0B1E;--a-fill:#0E2410;--k-fill:#2A2600;--card:#FFE600;--pk:#FFE600;--fk:#FF2E97;--pk-ink:#FFE600;--fk-ink:#FF6FB8;--col:#00E5FF;'},
  {id:'l-matrix',n:'Matrix',kind:'theme',d:'Tema verde sobre negro con lluvia de caracteres en Inicio.',t:['Matrix',1,'#000A02','#021006','#04160A','#B9FFC8','#5FB36F','#0D3A18','#165A26','#082410','#29FF6A','#001A07','#0F3E1C','#D2FFDD','#052010','#0F5A24'],
    x:'--er-stroke:#7DFF9E;--c-ent:#29FF6A;--c-rel:#B9FFC8;--c-att:#62D982;--c-key:#E8FFB0;--e-fill:#04160A;--r-fill:#04160A;--a-fill:#04160A;--k-fill:#04160A;--card:#B9FFC8;--pk:#E8FFB0;--fk:#29FF6A;--pk-ink:#E8FFB0;--fk-ink:#7DFF9E;--col:#62D982;--f-ui:"Cascadia Mono",Consolas,monospace;'},
  {id:'l-terminal',n:'Terminal retro',kind:'theme',d:'Tema ámbar de terminal antigua, con líneas de pantalla.',t:['Terminal retro',1,'#0A0A06','#0F0F09','#14140C','#FFB000','#B07A00','#3A2E00','#5A4600','#1E1A08','#FFB000','#1A1200','#3A2C00','#FFE2A0','#18150A','#4A3A00'],
    x:'--er-stroke:#FFB000;--c-ent:#FFB000;--c-rel:#FFD27A;--c-att:#E09A00;--c-key:#FFE9B8;--e-fill:#14140C;--r-fill:#14140C;--a-fill:#14140C;--k-fill:#14140C;--card:#FFD27A;--pk:#FFE9B8;--fk:#FFB000;--pk-ink:#FFE9B8;--fk-ink:#FFB000;--col:#E09A00;--f-ui:"Cascadia Mono",Consolas,monospace;'},
  {id:'l-posit',n:'Notas pósit',kind:'note',d:'Las notas parecen pósits de verdad: sombra y letra a mano.'},
  {id:'l-cinta',n:'Notas con cinta',kind:'note',d:'Las notas llevan un trozo de cinta adhesiva arriba.'},
  {id:'l-cursor',n:'Cursor lápiz',kind:'cursor',d:'El ratón se convierte en un lápiz.'},
  {id:'l-marco',n:'Marco dorado',kind:'frame',d:'Marco dorado y brillante para tu avatar del perfil.'},
  {id:'l-confeti',n:'Confeti',kind:'fx',d:'Lluvia de confeti cada vez que aciertas o ganas.'},
  {id:'l-chispas',n:'Chispas',kind:'fx',d:'Chispas de colores cada vez que aciertas o ganas.'}];
const REWARDS=[
  ...RW_ACC.map(([n,c],i)=>({id:'c-acc'+i,r:'c',kind:'acc',n:'Color '+n,c})),
  ...RW_ICO.map(([n,e],i)=>({id:'c-ico'+i,r:'c',kind:'icon',n:'Icono '+n,e})),
  ...RW_TIT.map((n,i)=>({id:'r-tit'+i,r:'r',kind:'title',n})),
  ...RW_THEME.map((t,i)=>({id:'e-th'+i,r:'e',kind:'theme',n:'Tema '+t[0],t})),
  ...RW_LEG.map(x=>({...x,r:'l',n:x.kind==='theme'?'Tema '+x.n:x.n}))];
const RWBY=Object.fromEntries(REWARDS.map(x=>[x.id,x]));

const Juegos={
  /* ---------- estado ---------- */
  st(){if(this._s)return this._s;let s={};try{s=JSON.parse(localStorage.getItem('mb:juego')||'{}')||{};}catch(e){}
    s.tokens=s.tokens|0;s.frags=s.frags|0;s.pity=s.pity|0;s.pulls=s.pulls|0;s.owned=s.owned||{};s.eq=s.eq||{};s.nick=s.nick||'';s.snake=s.snake||{wins:0,best:0,speed:'normal',size:'m'};
    s.quiz=s.quiz||{rounds:0,perfect:0,seen:[]};s.bdq=s.bdq||{rounds:0,perfect:0,ok:0,seen:[]};s.earned=s.earned|0;return this._s=s;},
  save(){try{localStorage.setItem('mb:juego',JSON.stringify(this.st()));}catch(e){}},
  give(n,why){const s=this.st();s.tokens+=n;s.earned+=n;this.save();toast(`+${n} token${n>1?'s':''}${why?' · '+why:''}. Ya tienes ${s.tokens}.`);this.celebrate(true);},
  profile(){const s=this.st(),t=RWBY[s.eq.title];return{nick:s.nick||'',title:t?t.n:''};},
  /* ---------- aspecto: lo equipado ---------- */
  skinMode(){const s=this.st(),t=RWBY[s.eq.theme];return t?(t.t[1]?'dark':'light'):null;},
  apply(){const s=this.st(),R=document.documentElement,th=RWBY[s.eq.theme],ac=RWBY[s.eq.acc];let css='';
    if(th){const t=th.t;R.setAttribute('data-skin',th.id);
      css+=`html[data-skin]:root{--bg:${t[2]};--panel:${t[3]};--surface:${t[4]};--ink:${t[5]};--muted:${t[6]};--line:${t[7]};--line-2:${t[8]};--hover:${t[9]};--accent:${t[10]};--accent-ink:${t[11]};--sel:${t[12]};--sel-ink:${t[13]};--grid:${t[14]};--ded-head:${t[15]};color-scheme:${t[1]?'dark':'light'};${th.x||''}}`;}
    else R.removeAttribute('data-skin');
    if(ac){const c=ac.c,dk=`--accent:color-mix(in srgb,${c} 68%,white);--accent-ink:#141414;--sel:color-mix(in srgb,${c} 30%,var(--surface));--sel-ink:color-mix(in srgb,${c} 25%,white);`;R.setAttribute('data-acc','1');
      css+=`html[data-acc]:root{--accent:${c};--accent-ink:#FFFFFF;--sel:color-mix(in srgb,${c} 15%,var(--surface));--sel-ink:color-mix(in srgb,${c} 70%,var(--ink));}`+
        `@media (prefers-color-scheme:dark){html[data-acc]:root:not([data-theme="light"]){${dk}}}html[data-acc][data-theme="dark"]:root{${dk}}`;}
    else R.removeAttribute('data-acc');
    let el=document.getElementById('mbskin');if(!el){el=document.createElement('style');el.id='mbskin';document.head.appendChild(el);}el.textContent=css;
    ['l-pizarra','l-neon','l-matrix','l-terminal'].forEach(k=>R.classList.toggle('sk-'+k.slice(2),s.eq.theme===k));
    R.classList.toggle('nt-posit',s.eq.note==='l-posit');R.classList.toggle('nt-cinta',s.eq.note==='l-cinta');R.classList.toggle('cur-pen',s.eq.cursor==='l-cursor');
    if(typeof Theme!=='undefined')Theme.apply(Theme.get());if(typeof App!=='undefined'&&App.ed&&App.ed.p&&App.ed.svg)App.ed.render();this.rain();},
  equip(id){const s=this.st(),x=RWBY[id];if(!x||!s.owned[id])return;const slot={acc:'acc',theme:'theme',title:'title',note:'note',cursor:'cursor',frame:'frame',fx:'fx'}[x.kind];if(!slot)return;
    s.eq[slot]=s.eq[slot]===id?null:id;this.save();this.apply();},
  /* ---------- tiradas ---------- */
  roll(force){const s=this.st();let r;
    if(s.pity>=PITY-1)r='l';else{const x=Math.random()*100;r=x<RAR.l.p?'l':x<RAR.l.p+RAR.e.p?'e':x<RAR.l.p+RAR.e.p+RAR.r.p?'r':'c';}
    if(force&&(r==='c'||r==='r'))r='e';
    s.pity=r==='l'?0:s.pity+1;s.pulls++;const pool=REWARDS.filter(x=>x.r===r),it=pool[Math.floor(Math.random()*pool.length)];
    const dup=!!s.owned[it.id];if(dup)s.frags+=RAR[r].frag;s.owned[it.id]=(s.owned[it.id]||0)+1;return{it,dup};},
  pull(n){const s=this.st();if(s.tokens<n){toast(`Te faltan tokens: necesitas ${n} y tienes ${s.tokens}. Gánalos en los minijuegos.`,'warn');return null;}
    s.tokens-=n;const out=[];for(let i=0;i<n;i++)out.push(this.roll(false));
    if(n===10&&!out.some(o=>o.it.r==='e'||o.it.r==='l')){const last=out.pop(),sv=s;sv.owned[last.it.id]--;if(!sv.owned[last.it.id])delete sv.owned[last.it.id];if(last.dup)sv.frags-=RAR[last.it.r].frag;sv.pity=Math.max(0,sv.pity-1);sv.pulls--;out.push(this.roll(true));}
    this.save();return out;},
  /* ---------- efectos al acertar ---------- */
  celebrate(big,at){const fx=this.st().eq.fx;if(!fx)return;try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;}catch(e){}
    const cv=document.createElement('canvas');cv.className='mbfx';cv.width=innerWidth;cv.height=innerHeight;document.body.appendChild(cv);const g=cv.getContext('2d');
    const cx=at?at[0]:innerWidth/2,cy=at?at[1]:innerHeight/3,P=[],n=big?140:40,cols=['#FF4D6D','#FFC233','#3DD68C','#3BA4FF','#B66DFF','#FF8A3D'];
    for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=(fx==='l-confeti'?4:2.5)+Math.random()*(big?9:5);
      P.push({x:fx==='l-confeti'&&big?Math.random()*innerWidth:cx,y:fx==='l-confeti'&&big?-20:cy,vx:Math.cos(a)*v*(fx==='l-confeti'&&big?.3:1),vy:fx==='l-confeti'&&big?Math.random()*3+2:Math.sin(a)*v,r:Math.random()*Math.PI,s:3+Math.random()*5,c:cols[i%cols.length],life:1});}
    const t0=performance.now(),dur=big?1800:900;
    const step=t=>{const k=(t-t0)/dur;g.clearRect(0,0,cv.width,cv.height);
      P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=fx==='l-confeti'?0.15:0.05;p.vx*=0.985;p.r+=0.15;g.save();g.globalAlpha=Math.max(0,1-k);g.translate(p.x,p.y);g.rotate(p.r);g.fillStyle=p.c;
        if(fx==='l-confeti')g.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);else{g.beginPath();for(let j=0;j<8;j++){const rr=j%2?p.s*0.35:p.s;g.lineTo(Math.cos(j*Math.PI/4)*rr,Math.sin(j*Math.PI/4)*rr);}g.closePath();g.fill();}g.restore();});
      if(k<1)requestAnimationFrame(step);else cv.remove();};requestAnimationFrame(step);},
  // Lluvia de caracteres del tema Matrix (solo en Inicio, Teoría y aquí)
  rain(){const on=this.st().eq.theme==='l-matrix';let cv=document.getElementById('mbrain');
    if(!on){if(cv)cv.remove();cancelAnimationFrame(this._rf);return;}
    try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;}catch(e){}
    if(!cv){cv=document.createElement('canvas');cv.id='mbrain';document.body.appendChild(cv);}
    const g=cv.getContext('2d'),fs=16;let cols=[],last=0;const rs=()=>{cv.width=innerWidth;cv.height=innerHeight;cols=Array(Math.ceil(innerWidth/fs)).fill(0).map(()=>Math.random()*-50);};rs();addEventListener('resize',rs);
    const ch='アイウエオカキクケコサシスセソ01SELECTFROMWHEREJOIN';cancelAnimationFrame(this._rf);
    const step=t=>{this._rf=requestAnimationFrame(step);const vis=typeof App!=='undefined'&&!!App.home;cv.style.display=vis?'':'none';if(!vis||t-last<55)return;last=t;
      g.fillStyle='rgba(0,10,2,0.12)';g.fillRect(0,0,cv.width,cv.height);g.fillStyle='#29FF6A';g.font=fs+'px Consolas,monospace';
      cols.forEach((y,i)=>{g.fillText(ch[Math.floor(Math.random()*ch.length)],i*fs,y*fs);cols[i]=y*fs>cv.height&&Math.random()>0.975?0:y+1;});};this._rf=requestAnimationFrame(step);},
  /* ---------- pantallas ---------- */
  sub:'menu',
  go(k){this.stopAll();this.sub=k;if(k==='quiz')this._qz=null;if(k==='bdq')this._bdq=null;App.renderMain();document.getElementById('mainv').scrollTop=0;},
  stopAll(){if(this._snk){clearInterval(this._snk.iv);this._snk=null;}},
  head(t,back){const s=this.st();return `<header class="ph"><span class="pname static">${t}</span><div class="ph-acts"><span class="jg-tok" title="Tokens para tiradas">${GL.tok||'🎟️'} <b>${s.tokens}</b> token${s.tokens===1?'':'s'}</span><span class="jg-frag" title="Fragmentos (de premios repetidos): ${FRAG_TOKEN} = 1 token">◆ ${s.frags}</span>${back?`<button class="ebtn" data-jg="menu">← Juegos</button>`:''}<button class="ebtn" data-act="home">← Inicio</button></div></header>`;},
  avatar(big){const s=this.st(),p=this.profile(),ini=(p.nick||'?').trim().slice(0,2).toUpperCase()||'?',img=typeof s.avatar==='string'&&s.avatar.startsWith('data:image/')?s.avatar:'';
    return `<span class="jg-av${big?' big':''}${img?' img':''}${s.eq.frame==='l-marco'?' fr-gold':''}"${img?` style="background-image:url('${img}')"`:''}><span>${img?'':esc(ini)}</span></span>`;},
  // Foto propia del avatar: se recorta en cuadrado y se reduce a 160×160 para que ocupe poco
  async setAvatar(file){if(!file||!/^image\//.test(file.type)){toast('Elige una imagen (PNG, JPG, GIF o WebP).','warn');return;}
    const url=URL.createObjectURL(file);try{const img=await new Promise((ok,ko)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=ko;i.src=url;});
      const S=160,c=document.createElement('canvas');c.width=c.height=S;const g=c.getContext('2d'),m=Math.min(img.naturalWidth,img.naturalHeight);
      g.drawImage(img,(img.naturalWidth-m)/2,(img.naturalHeight-m)/2,m,m,0,0,S,S);this.st().avatar=c.toDataURL('image/jpeg',0.85);this.save();toast('Foto del perfil puesta.');}
    catch(e){toast('No se pudo leer esa imagen.','warn');}finally{URL.revokeObjectURL(url);}},
  profileCard(){const p=this.profile();return `<button class="jg-pcard" data-act="games-profile" title="Tu perfil">${this.avatar(false)}<span class="jg-pc-t"><b>${esc(p.nick||'Sin nombre')}</b><small>${esc(p.title||'Sin título: consíguelos en las tiradas')}</small></span></button>`;},
  render(mv){const k=this.sub;
    if(k==='snake')return this.snakeView(mv);if(k==='quiz')return this.quizView(mv);if(k==='bdq')return this.bdqView(mv);
    if(k==='gacha')return this.gachaView(mv);if(k==='album')return this.albumView(mv);if(k==='perfil')return this.perfilView(mv);
    const s=this.st(),w=s.snake.wins%10,own=Object.keys(s.owned).length,leg=PITY-s.pity;
    mv.innerHTML=this.head('No cliques esto')+`<div class="view jg"><div class="jg-in">
      <section class="jg-hero"><div><h2>Vale, has clicado.</h2><p>Ya que estás: juega, gana <b>tokens</b> y haz <b>tiradas</b> para conseguir temas, colores, títulos e iconos.</p></div>${this.profileCard()}</section>
      <button class="jg-feat" data-jg="gacha"><span class="jg-feat-bg" aria-hidden="true"></span><span class="jg-feat-ic">🎰</span>
        <span class="jg-feat-t"><small>Lo mejor de aquí</small><b>Tiradas</b><span>Temas, colores, títulos, iconos y efectos legendarios. Legendaria asegurada en <b>${leg}</b> tirada${leg===1?'':'s'}; en las de ×10, épica asegurada.</span>
          <span class="jg-feat-rates">${Object.entries(RAR).map(([k,r])=>`<i class="r-${k}">${r.n} ${r.p} %</i>`).join('')}</span></span>
        <span class="jg-feat-cta"><span class="jg-feat-tok">${s.tokens}<small>token${s.tokens===1?'':'s'}</small></span><span class="jg-feat-go">Tirar →</span></span></button>
      <h3 class="jg-h">Gana tokens</h3>
      <div class="jg-grid">
        <button class="jg-card" data-jg="snake"><span class="jg-ic">🐍</span><b>Serpiente</b><small>Elige velocidad y tamaño del mapa. Cada 10 partidas superadas, 1 token.</small><span class="jg-prog"><i style="width:${w*10}%"></i></span><em>${w}/10 para el próximo token</em></button>
        <button class="jg-card" data-jg="quiz"><span class="jg-ic">🧠</span><b>Quiz de cultura</b><small>${QZ_ALL().length} preguntas de curiosidades y de 1º de DAW. Si aciertas las 10 de una ronda, 1 token.</small><em>Rondas perfectas: ${s.quiz.perfect}</em></button>
        <button class="jg-card" data-jg="bdq"><span class="jg-ic">🔎</span><b>¿Está bien el diagrama?</b><small>${BDQ.bank().length} diagramas de E-R, Relacional y DED con fallos escondidos. Si aciertas los 5 de una ronda, 1 token.</small><em>Rondas perfectas: ${s.bdq.perfect}</em></button>
      </div>
      <h3 class="jg-h">Lo tuyo</h3>
      <div class="jg-grid two">
        <button class="jg-card row" data-jg="album"><span class="jg-ic">📒</span><span><b>Álbum</b><small>Tu colección: ${own} de ${REWARDS.length}.</small><span class="jg-prog"><i style="width:${own/REWARDS.length*100}%"></i></span></span></button>
        <button class="jg-card row" data-jg="perfil"><span class="jg-ic">🪪</span><span><b>Perfil</b><small>Foto, nombre, título y tema. Salen en Inicio y en lo que compartes.</small></span></button>
      </div></div></div>`;},
  rewardThumb(x,owned){if(!owned)return `<span class="rw-th lock">?</span>`;
    if(x.kind==='acc')return `<span class="rw-th" style="background:${x.c}"></span>`;if(x.kind==='icon')return `<span class="rw-th emo">${x.e}</span>`;
    if(x.kind==='title')return `<span class="rw-th tit">«»</span>`;
    if(x.kind==='theme'){const t=x.t;return `<span class="rw-th th" style="background:${t[2]}"><i style="background:${t[4]};border-color:${t[7]}"></i><i style="background:${t[10]}"></i><i style="background:${t[5]}"></i></span>`;}
    return `<span class="rw-th emo">${{note:'🗒️',cursor:'✏️',frame:'🖼️',fx:x.id==='l-confeti'?'🎊':'✨'}[x.kind]||'★'}</span>`;},
  kindName:{acc:'Color de acento',icon:'Icono de proyecto',title:'Título',theme:'Tema',note:'Estilo de nota',cursor:'Cursor',frame:'Marco de avatar',fx:'Efecto al acertar'},
  gachaView(mv,res){const s=this.st();
    mv.innerHTML=this.head('Tiradas',true)+`<div class="view jg"><div class="jg-in">
      <section class="jg-gacha"><div class="jg-machine"><div class="jg-orb">🎰</div><div class="jg-btns">
        <button class="ebtn pri big" data-jg-pull="1" ${s.tokens<1?'disabled':''}>Tirar ×1 <small>1 token</small></button>
        <button class="ebtn pri big" data-jg-pull="10" ${s.tokens<10?'disabled':''}>Tirar ×10 <small>10 tokens · épica asegurada</small></button>
        <button class="ebtn" data-jg-swap ${s.frags<FRAG_TOKEN?'disabled':''}>Canjear ${FRAG_TOKEN} ◆ fragmentos por 1 token</button></div>
        <div class="jg-pity"><span>Legendaria asegurada en <b>${PITY-s.pity}</b> tirada${PITY-s.pity===1?'':'s'}</span><span class="jg-prog"><i style="width:${s.pity/PITY*100}%"></i></span></div></div>
        <div class="jg-rates"><h3>Probabilidades</h3>${Object.entries(RAR).map(([k,r])=>{const tot=REWARDS.filter(x=>x.r===k).length,own=REWARDS.filter(x=>x.r===k&&s.owned[x.id]).length;
          return `<div class="jg-rate r-${k}"><b>${r.n}</b><span>${r.p} %</span><small>${{c:'Colores de acento e iconos de proyecto',r:'Títulos',e:'Temas completos',l:'Temas especiales, notas, cursor, marco y efectos'}[k]} · tienes ${own}/${tot}</small></div>`;}).join('')}
          <p class="tnote">Si te sale uno repetido se convierte en fragmentos ◆ (común 1, rara 3, épica 8, legendaria 20). Con ${FRAG_TOKEN} fragmentos canjeas 1 token. Total de tiradas: ${s.pulls}.</p></div></section>
      ${res?`<section class="jg-res${res.length>1?' ten':''}">${res.map((o,i)=>`<div class="rw r-${o.it.r}" style="animation-delay:${i*90}ms">${this.rewardThumb(o.it,true)}<b>${esc(o.it.n)}</b><small>${RAR[o.it.r].n} · ${this.kindName[o.it.kind]}</small>${o.dup?`<em class="dup">Repetido · +${RAR[o.it.r].frag} ◆</em>`:'<em class="new">¡Nuevo!</em>'}</div>`).join('')}</section>`:''}
    </div></div>`;},
  albumView(mv){const s=this.st();
    mv.innerHTML=this.head('Álbum',true)+`<div class="view jg"><div class="jg-in"><p class="tnote">Pulsa un premio que tengas para usarlo (o dejar de usarlo). Los iconos se ponen a cada proyecto con el botón derecho › «Icono del proyecto…».</p>
      ${Object.entries(RAR).map(([k,r])=>{const L=REWARDS.filter(x=>x.r===k);return `<section class="jg-alb"><h3 class="r-${k}">${r.n} <small>${L.filter(x=>s.owned[x.id]).length}/${L.length} · ${r.p} %</small></h3><div class="rw-grid">${L.map(x=>{const o=!!s.owned[x.id],on=Object.values(s.eq).includes(x.id);
        return `<button class="rw r-${k}${o?'':' locked'}${on?' on':''}" ${o?`data-jg-eq="${x.id}"`:'disabled'} title="${o?escA(x.n+(x.d?' — '+x.d:'')):'Aún no lo tienes'}">${this.rewardThumb(x,o)}<b>${o?esc(x.n):'???'}</b><small>${this.kindName[x.kind]}${o&&s.owned[x.id]>1?' · ×'+s.owned[x.id]:''}</small>${on?'<em class="new">En uso</em>':''}</button>`;}).join('')}</div></section>`;}).join('')}</div></div>`;},
  perfilView(mv){const s=this.st(),own=k=>REWARDS.filter(x=>x.kind===k&&s.owned[x.id]),sel=(slot,k,none)=>`<select data-jg-slot="${slot}"><option value="">${none}</option>${(Array.isArray(k)?k.flatMap(own):own(k)).map(x=>`<option value="${x.id}" ${s.eq[slot]===x.id?'selected':''}>${esc(x.n)}</option>`).join('')}</select>`;
    mv.innerHTML=this.head('Perfil',true)+`<div class="view jg"><div class="jg-in narrow"><section class="jg-prof">${this.avatar(true)}<div class="jg-prof-f">
      <div class="jg-avbtns"><label class="ebtn">Subir imagen…<input type="file" id="jgimg" accept="image/png,image/jpeg,image/gif,image/webp" hidden></label>${s.avatar?'<button class="ebtn" id="jgimgx">Quitar imagen</button>':''}</div>
      <label class="set-lab"><b>Tu nombre o apodo</b><input id="jgnick" maxlength="24" value="${escA(s.nick)}" placeholder="Por ejemplo: Ale"></label>
      <div class="jg-rows">
        <label><b>Título</b>${sel('title','title','Sin título')}</label><label><b>Tema</b>${sel('theme','theme','El normal de la app')}</label>
        <label><b>Color de acento</b>${sel('acc','acc','El del tema')}</label><label><b>Notas</b>${sel('note','note','Normales')}</label>
        <label><b>Cursor</b>${sel('cursor','cursor','Normal')}</label><label><b>Marco del avatar</b>${sel('frame','frame','Sin marco')}</label><label><b>Efecto al acertar</b>${sel('fx','fx','Ninguno')}</label></div>
      <p class="tnote">Tu nombre y tu título salen en Inicio y en los proyectos que compartes con «Exportar código». Mientras uses un tema, los botones Claro/Oscuro no cambian nada.</p>
      <div class="jg-stats"><span>Tokens ganados: <b>${s.earned}</b></span><span>Tiradas: <b>${s.pulls}</b></span><span>Serpiente: <b>${s.snake.wins}</b> superadas · récord ${s.snake.best}</span><span>Quiz: <b>${s.quiz.perfect}</b>/${s.quiz.rounds} perfectas</span><span>Diagramas: <b>${s.bdq.perfect}</b>/${s.bdq.rounds} perfectas</span></div></div></section></div></div>`;
    const fi=document.getElementById('jgimg');fi.addEventListener('change',async()=>{await this.setAvatar(fi.files[0]);this.perfilView(mv);});
    const fx=document.getElementById('jgimgx');if(fx)fx.addEventListener('click',()=>{delete s.avatar;this.save();this.perfilView(mv);});
    const n=document.getElementById('jgnick');n.addEventListener('input',()=>{s.nick=n.value.trim().slice(0,24);this.save();const av=mv.querySelector('.jg-av:not(.img) span');if(av)av.textContent=(s.nick||'?').slice(0,2).toUpperCase();});
    mv.querySelectorAll('[data-jg-slot]').forEach(el=>el.addEventListener('change',()=>{s.eq[el.dataset.jgSlot]=el.value||null;this.save();this.apply();this.go('perfil');}));},
  onClick(e){const b=e.target.closest('[data-jg],[data-jg-pull],[data-jg-swap],[data-jg-eq]');if(!b)return false;
    if(b.dataset.jg){this.go(b.dataset.jg);return true;}
    if(b.dataset.jgPull){const r=this.pull(+b.dataset.jgPull);if(!r)return true;this.gachaView(document.getElementById('mainv'),r);const best=r.some(o=>o.it.r==='l')?'l':r.some(o=>o.it.r==='e')?'e':'';if(best)this.celebrate(best==='l');return true;}
    if(b.hasAttribute('data-jg-swap')){const s=this.st();if(s.frags>=FRAG_TOKEN){s.frags-=FRAG_TOKEN;s.tokens++;this.save();toast('Canjeado: +1 token.');}this.gachaView(document.getElementById('mainv'));return true;}
    if(b.dataset.jgEq){const x=RWBY[b.dataset.jgEq];if(x.kind==='icon'){toast('Los iconos se ponen a cada proyecto: botón derecho sobre el proyecto › «Icono del proyecto…».');return true;}this.equip(x.id);this.albumView(document.getElementById('mainv'));return true;}
    return false;}
};

/* ---------- Serpiente ---------- */
const SNK_SPEED={lenta:['Lenta',170],normal:['Normal',115],rapida:['Rápida',80],extrema:['Extrema',55]};
const SNK_SIZE={s:['Pequeño',12,12],m:['Mediano',18,18],l:['Grande',24,25]}; // [nombre, casillas por lado, manzanas para superarla]
Object.assign(Juegos,{
  snakeView(mv){const s=this.st(),S=s.snake,w=S.wins%10;
    mv.innerHTML=this.head('Serpiente',true)+`<div class="view jg"><section class="snk-wrap">
      <div class="snk-side">
        <div class="snk-opt"><b>Velocidad</b><div class="seg wide">${Object.entries(SNK_SPEED).map(([k,v])=>`<button class="segb" data-snk-speed="${k}" aria-pressed="${S.speed===k}">${v[0]}</button>`).join('')}</div></div>
        <div class="snk-opt"><b>Tamaño del mapa</b><div class="seg wide">${Object.entries(SNK_SIZE).map(([k,v])=>`<button class="segb" data-snk-size="${k}" aria-pressed="${S.size===k}">${v[0]} <small>${v[1]}×${v[1]}</small></button>`).join('')}</div></div>
        <p class="tnote">Para superarla come <b>${SNK_SIZE[S.size][2]} manzanas</b> sin chocar con las paredes ni contigo. Flechas o WASD para moverte, espacio para pausar.</p>
        <div class="snk-tok"><b>Próximo token</b><span class="jg-prog big"><i style="width:${w*10}%"></i></span><span>${w}/10 partidas superadas</span><small>Total superadas: ${S.wins} · récord: ${S.best} manzanas</small></div>
        <button class="ebtn pri big" id="snkgo">${GL.play||'▶'} Jugar</button></div>
      <div class="snk-board"><canvas id="snk" width="504" height="504" tabindex="0" aria-label="Tablero de la serpiente"></canvas><div class="snk-hud"><span id="snkscore">0 / ${SNK_SIZE[S.size][2]}</span><span id="snkmsg">Pulsa «Jugar»</span></div></div>
    </section></div>`;
    this.snkDraw(null);
    mv.querySelectorAll('[data-snk-speed]').forEach(b=>b.addEventListener('click',()=>{S.speed=b.dataset.snkSpeed;this.save();this.stopAll();this.snakeView(mv);}));
    mv.querySelectorAll('[data-snk-size]').forEach(b=>b.addEventListener('click',()=>{S.size=b.dataset.snkSize;this.save();this.stopAll();this.snakeView(mv);}));
    document.getElementById('snkgo').addEventListener('click',()=>this.snkStart());},
  snkStart(){this.stopAll();const S=this.st().snake,N=SNK_SIZE[S.size][1],goal=SNK_SIZE[S.size][2],m=Math.floor(N/2);
    const g={N,goal,body:[[m-2,m],[m-1,m],[m,m]],dir:[1,0],q:[],eat:0,over:false,pause:false};g.food=this.snkFood(g);this._snk=g;
    const cv=document.getElementById('snk');cv.focus();
    if(!this._snkKey){this._snkKey=e=>{const G=this._snk;if(!G||!document.getElementById('snk'))return;const k=e.key.toLowerCase(),D={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]}[k];
      if(D||k===' '){e.preventDefault();e.stopPropagation();}if(k===' '){if(!G.over){G.pause=!G.pause;this.snkMsg(G.pause?'Pausa':'');}return;}
      if(D&&G.q.length<3){const last=G.q.length?G.q[G.q.length-1]:G.dir;if(last[0]!==-D[0]||last[1]!==-D[1])G.q.push(D);}};window.addEventListener('keydown',this._snkKey,true);}
    this.snkMsg('');g.iv=setInterval(()=>this.snkTick(),SNK_SPEED[S.speed][1]);this.snkDraw(g);},
  snkFood(g){const free=[];for(let x=0;x<g.N;x++)for(let y=0;y<g.N;y++)if(!g.body.some(b=>b[0]===x&&b[1]===y))free.push([x,y]);return free[Math.floor(Math.random()*free.length)];},
  snkMsg(t){const el=document.getElementById('snkmsg');if(el)el.textContent=t;},
  snkTick(){const g=this._snk;if(!g)return;if(!document.getElementById('snk')){this.stopAll();return;}if(g.pause||g.over)return;
    if(g.q.length)g.dir=g.q.shift();const h=g.body[g.body.length-1],n=[h[0]+g.dir[0],h[1]+g.dir[1]];
    const grow=g.food&&n[0]===g.food[0]&&n[1]===g.food[1];
    if(n[0]<0||n[1]<0||n[0]>=g.N||n[1]>=g.N||g.body.slice(grow?0:1).some(b=>b[0]===n[0]&&b[1]===n[1])){g.over=true;clearInterval(g.iv);this.snkEnd(false);this.snkDraw(g);return;}
    g.body.push(n);if(grow){g.eat++;const sc=document.getElementById('snkscore');if(sc)sc.textContent=`${g.eat} / ${g.goal}`;if(g.eat>=g.goal){g.over=true;clearInterval(g.iv);this.snkDraw(g);this.snkEnd(true);return;}g.food=this.snkFood(g);}else g.body.shift();
    this.snkDraw(g);},
  snkEnd(win){const s=this.st(),S=s.snake,g=this._snk;S.best=Math.max(S.best,g?g.eat:0);
    if(win){S.wins++;this.save();if(S.wins%10===0){this.give(1,'10 partidas de la serpiente superadas');}else{this.celebrate(false);toast(`¡Superada! Llevas ${S.wins%10}/10 para el próximo token.`);}}
    else{this.save();this.snkMsg(`Has chocado: ${g?g.eat:0} manzanas. Pulsa «Jugar» para otra.`);}
    const mv=document.getElementById('mainv');const tok=mv&&mv.querySelector('.snk-tok');if(tok){const w=S.wins%10;tok.innerHTML=`<b>Próximo token</b><span class="jg-prog big"><i style="width:${w*10}%"></i></span><span>${w}/10 partidas superadas</span><small>Total superadas: ${S.wins} · récord: ${S.best} manzanas</small>`;}
    if(win)this.snkMsg('¡Superada! Pulsa «Jugar» para otra.');},
  snkDraw(g){const cv=document.getElementById('snk');if(!cv)return;const x=cv.getContext('2d'),cs=getComputedStyle(document.documentElement),V=k=>cs.getPropertyValue(k).trim();
    const S=this.st().snake,N=g?g.N:SNK_SIZE[S.size][1],c=cv.width/N;x.fillStyle=V('--surface');x.fillRect(0,0,cv.width,cv.height);
    for(let i=0;i<N;i++)for(let j=0;j<N;j++)if((i+j)%2){x.fillStyle=V('--hover');x.fillRect(i*c,j*c,c,c);}
    if(!g)return;const acc=V('--accent');
    if(g.food){x.fillStyle='#E0402F';x.beginPath();x.arc(g.food[0]*c+c/2,g.food[1]*c+c/2+1,c*0.36,0,Math.PI*2);x.fill();x.fillStyle='#3B8F3A';x.fillRect(g.food[0]*c+c/2-1,g.food[1]*c+c*0.12,2.5,c*0.22);}
    g.body.forEach((b,i)=>{const t=i/g.body.length;x.globalAlpha=0.55+0.45*t;x.fillStyle=acc;const p=c*0.08;const r=c*0.28;const X=b[0]*c+p,Y=b[1]*c+p,W=c-2*p;
      x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+W,Y,X+W,Y+W,r);x.arcTo(X+W,Y+W,X,Y+W,r);x.arcTo(X,Y+W,X,Y,r);x.arcTo(X,Y,X+W,Y,r);x.fill();});x.globalAlpha=1;
    const h=g.body[g.body.length-1];x.fillStyle=V('--surface');const e1=[h[0]*c+c/2+g.dir[0]*c*0.18-g.dir[1]*c*0.16,h[1]*c+c/2+g.dir[1]*c*0.18-g.dir[0]*c*0.16],e2=[h[0]*c+c/2+g.dir[0]*c*0.18+g.dir[1]*c*0.16,h[1]*c+c/2+g.dir[1]*c*0.18+g.dir[0]*c*0.16];
    [e1,e2].forEach(e=>{x.beginPath();x.arc(e[0],e[1],c*0.09,0,Math.PI*2);x.fill();});
    if(g.over){x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,0,cv.width,cv.height);x.fillStyle='#fff';x.font='bold 28px '+V('--f-ui');x.textAlign='center';x.fillText(g.eat>=g.goal?'¡Superada!':'Fin',cv.width/2,cv.height/2);}}
});

/* ---------- Quiz de cultura ---------- */
// Preguntas en preguntas.js: QZ = [[categoría, "pregunta|correcta|mal1|mal2|mal3\n…"], …]
let _qzAll=null;
function QZ_ALL(){if(_qzAll)return _qzAll;_qzAll=[];(typeof QZ!=='undefined'?QZ:[]).forEach(([cat,txt])=>txt.split('\n').map(l=>l.trim()).filter(Boolean).forEach(l=>{const p=l.split('|').map(x=>x.trim());if(p.length>=4&&p.every(Boolean))_qzAll.push({c:cat,q:p[0],a:p[1],w:p.slice(2)});}));return _qzAll;}
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
Object.assign(Juegos,{
  quizView(mv){const Q=this._qz;
    if(!Q){const s=this.st(),cats=[...new Set(QZ_ALL().map(q=>q.c))];
      mv.innerHTML=this.head('Quiz de cultura',true)+`<div class="view jg"><section class="qz-start"><span class="jg-ic big">🧠</span><h2>10 preguntas al azar</h2>
        <p>Hay <b>${QZ_ALL().length}</b> preguntas de: ${cats.map(c=>`<span class="qz-cat">${esc(c)}</span>`).join(' ')}</p><p>Si aciertas <b>las 10</b>, ganas <b>1 token</b>.</p>
        <button class="ebtn pri big" data-qz="start">Empezar ronda</button><p class="tnote">Rondas jugadas: ${s.quiz.rounds} · perfectas: ${s.quiz.perfect}</p></section></div>`;
      mv.querySelector('[data-qz=start]').addEventListener('click',()=>this.qzStart());return;}
    const q=Q.list[Q.i],done=Q.ans[Q.i]!=null;
    if(Q.i>=Q.list.length){const ok=Q.ans.filter(Boolean).length,perfect=ok===Q.list.length;
      mv.innerHTML=this.head('Quiz de cultura',true)+`<div class="view jg"><section class="qz-start"><span class="jg-ic big">${perfect?'🏆':ok>=7?'👏':'📚'}</span><h2>${ok} de ${Q.list.length}</h2>
        <p>${perfect?'¡Perfecta! Has ganado 1 token.':'Para ganar el token hay que acertar las 10. ¡Otra!'}</p>
        <div class="qz-rev">${Q.list.map((x,i)=>`<div class="${Q.ans[i]?'ok':'bad'}"><b>${Q.ans[i]?'✓':'✗'}</b> ${esc(x.q)} <small>→ ${esc(x.a)}</small></div>`).join('')}</div>
        <button class="ebtn pri big" data-qz="start">Otra ronda</button></section></div>`;
      mv.querySelector('[data-qz=start]').addEventListener('click',()=>this.qzStart());return;}
    mv.innerHTML=this.head('Quiz de cultura',true)+`<div class="view jg"><section class="qz">
      <div class="qz-top"><span class="qz-cat">${esc(q.c)}</span><span class="qz-n">Pregunta ${Q.i+1} de ${Q.list.length}</span><span class="qz-dots">${Q.list.map((x,i)=>`<i class="${Q.ans[i]==null?'':Q.ans[i]?'ok':'bad'}${i===Q.i?' cur':''}"></i>`).join('')}</span></div>
      <h2 class="qz-q">${esc(q.q)}</h2>
      <div class="qz-opts">${Q.opts.map((o,i)=>`<button class="qz-o${done?(o===q.a?' ok':o===Q.pick?' bad':''):''}" data-qo="${i}" ${done?'disabled':''}><span>${'ABCD'[i]}</span>${esc(o)}</button>`).join('')}</div>
      ${done?`<div class="qz-fb ${Q.ans[Q.i]?'ok':'bad'}">${Q.ans[Q.i]?'¡Correcto!':'No. La respuesta es: <b>'+esc(q.a)+'</b>'}<button class="ebtn pri" data-qz="next">${Q.i+1<Q.list.length?'Siguiente →':'Ver resultado'}</button></div>`:''}
    </section></div>`;
    mv.querySelectorAll('[data-qo]').forEach(b=>b.addEventListener('click',e=>{const o=Q.opts[+b.dataset.qo];Q.pick=o;Q.ans[Q.i]=o===q.a;if(Q.ans[Q.i])this.celebrate(false,[e.clientX,e.clientY]);this.quizView(mv);}));
    const nx=mv.querySelector('[data-qz=next]');if(nx){nx.focus();nx.addEventListener('click',()=>{Q.i++;Q.pick=null;if(Q.i<Q.list.length)Q.opts=shuffle([Q.list[Q.i].a,...Q.list[Q.i].w.slice(0,3)]);else this.qzFinish();this.quizView(mv);});}},
  qzStart(){const s=this.st(),all=QZ_ALL(),seen=new Set(s.quiz.seen||[]);let pool=all.map((q,i)=>i).filter(i=>!seen.has(i));if(pool.length<10){s.quiz.seen=[];pool=all.map((q,i)=>i);}
    const pick=shuffle(pool).slice(0,10);s.quiz.seen=[...(s.quiz.seen||[]),...pick].slice(-Math.max(10,all.length-20));this.save();
    const list=pick.map(i=>all[i]);this._qz={list,i:0,ans:[],pick:null,opts:shuffle([list[0].a,...list[0].w.slice(0,3)])};this.quizView(document.getElementById('mainv'));},
  qzFinish(){const s=this.st(),Q=this._qz,ok=Q.ans.filter(Boolean).length;s.quiz.rounds++;if(ok===Q.list.length){s.quiz.perfect++;this.save();this.give(1,'ronda perfecta del quiz');}else this.save();}
});
