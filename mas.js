/* ===================== Atajos de teclado (se pueden cambiar en Ajustes) ===================== */
const KEYS_DEF={undo:'Ctrl+Z',redo:'Ctrl+Y',copy:'Ctrl+C',cut:'Ctrl+X',paste:'Ctrl+V',selectAll:'Ctrl+A',duplicate:'Ctrl+D',rename:'F2',del:'Delete',
  find:'Ctrl+F',fit:'Ctrl+0',distribute:'Ctrl+Shift+D',lock:'Ctrl+L',newEnt:'',newRel:'',newAttr:'',newIsa:'',newTable:'',newNote:'',
  save:'Ctrl+S',settings:'Ctrl+,',controls:'F1',projector:'Ctrl+Shift+P'};
const KEY_NAMES=[['Editar',[['undo','Deshacer'],['redo','Rehacer'],['copy','Copiar'],['cut','Cortar'],['paste','Pegar'],['duplicate','Duplicar'],['rename','Renombrar'],['del','Borrar lo seleccionado'],['selectAll','Seleccionar todo'],['lock','Bloquear / desbloquear posición']]],
  ['Crear',[['newEnt','Nueva entidad'],['newRel','Nueva relación'],['newAttr','Nuevo atributo'],['newIsa','Nueva jerarquía (ISA)'],['newTable','Nueva tabla'],['newNote','Nueva nota']]],
  ['Lienzo',[['find','Buscar en el diagrama'],['fit','Ajustar la vista'],['distribute','Distribuir']]],
  ['General',[['save','Guardar'],['settings','Ajustes'],['controls','Ver los controles'],['projector','Modo proyector']]]];
const KEYS=()=>({...KEYS_DEF,...((Settings.get().keys)||{})});
// "Ctrl+Shift+D" a partir de una pulsación
function comboOf(e){
  if(['Control','Shift','Alt','Meta'].includes(e.key))return '';
  const c=e.code||'';let k=c.startsWith('Key')?c.slice(3):c.startsWith('Digit')?c.slice(5):c.startsWith('Numpad')&&/\d$/.test(c)?c.slice(-1):e.key;
  if(k===' ')k='Space';if(k.length===1)k=k.toUpperCase();if(k==='Del')k='Delete';
  return [(e.ctrlKey||e.metaKey)&&'Ctrl',e.altKey&&'Alt',e.shiftKey&&'Shift',k].filter(Boolean).join('+');}
const keyIs=(e,a)=>{const k=KEYS()[a];return !!k&&comboOf(e)===k;};
const keyLabel=a=>{const k=KEYS()[a];return k?(k==='Delete'?'Supr':k):'';};

/* ===================== Distribuir tablas ===================== */
// Busca una colocación en cuadrícula con pocos cruces de líneas, sin líneas por encima de otras tablas y compacta.
function refSize(t){const tmp={t:[{n:t.n,x:0,y:0,c:t.c}]};drawRef(tmp,true);return {w:tmp.t[0].rw,h:18+tmp.t[0].rh};}
function layoutSmart(tables,opt={}){
  const n=tables.length;if(!n)return;const size=opt.size||tableSize;
  const S=tables.map(t=>size(t)),idx={};tables.forEach((t,i)=>idx[lc(t.n)]=i);
  const E=[],seen=new Set();
  tables.forEach((t,i)=>(t.c||[]).forEach(c=>{const f=parseF(c[2]).fk;if(!f)return;const j=idx[lc(f)];if(j==null||j===i)return;const k=Math.min(i,j)+'-'+Math.max(i,j);if(seen.has(k))return;seen.add(k);E.push([i,j]);}));
  if(n===1){tables[0].x=Math.round(W/2-S[0].w/2);tables[0].y=Math.round(H/2-S[0].h/2);return;}
  const C=Math.max(2,Math.ceil(Math.sqrt(n*1.4))),R=Math.ceil(n/C)+1,CELLS=C*R,GX=110,GY=90;
  // posiciones a partir de qué tabla va en cada celda (las filas y columnas vacías no ocupan sitio)
  const place=(slot,out)=>{const cw=new Array(C).fill(0),rh=new Array(R).fill(0);
    for(let i=0;i<n;i++){const s=slot[i],r=(s/C)|0,c=s%C;if(S[i].w>cw[c])cw[c]=S[i].w;if(S[i].h>rh[r])rh[r]=S[i].h;}
    const cx=[],ry=[];let a=0;for(let c=0;c<C;c++){cx[c]=a;if(cw[c])a+=cw[c]+GX;}a=0;for(let r=0;r<R;r++){ry[r]=a;if(rh[r])a+=rh[r]+GY;}
    for(let i=0;i<n;i++){const s=slot[i],r=(s/C)|0,c=s%C;out[i]=[cx[c]+(cw[c]-S[i].w)/2,ry[r]+(rh[r]-S[i].h)/2];}};
  const crossAB=(p1,p2,p3,p4)=>{const d=(a,b,c)=>(c[0]-a[0])*(b[1]-a[1])-(c[1]-a[1])*(b[0]-a[0]);
    const d1=d(p3,p4,p1),d2=d(p3,p4,p2),d3=d(p1,p2,p3),d4=d(p1,p2,p4);return ((d1>0)!==(d2>0))&&((d3>0)!==(d4>0))&&d1&&d2&&d3&&d4;};
  const segBox=(p,q,b)=>{ // ¿el segmento atraviesa la caja b? (Liang-Barsky)
    let t0=0,t1=1;const dx=q[0]-p[0],dy=q[1]-p[1];
    for(const [pp,qq] of [[-dx,p[0]-b[0]],[dx,b[2]-p[0]],[-dy,p[1]-b[1]],[dy,b[3]-p[1]]]){if(pp===0){if(qq<0)return false;}else{const r=qq/pp;if(pp<0){if(r>t1)return false;if(r>t0)t0=r;}else{if(r<t0)return false;if(r<t1)t1=r;}}}
    return t0<t1;};
  const pos=new Array(n);
  const cost=slot=>{place(slot,pos);const ctr=pos.map((p,i)=>[p[0]+S[i].w/2,p[1]+S[i].h/2]);let k=0;
    const segs=E.map(([a,b])=>[ctr[a],ctr[b],a,b]);
    for(let i=0;i<segs.length;i++){const [p,q,a,b]=segs[i];
      k+=Math.hypot(q[0]-p[0],q[1]-p[1])/160;
      if(Math.abs(q[0]-p[0])<4||Math.abs(q[1]-p[1])<4)k-=0.25; // recta horizontal o vertical: queda más limpio
      for(let j=i+1;j<segs.length;j++){const s=segs[j];if(s[2]===a||s[2]===b||s[3]===a||s[3]===b)continue;if(crossAB(p,q,s[0],s[1]))k+=9;}
      for(let o=0;o<n;o++){if(o===a||o===b)continue;const bx=[pos[o][0]-8,pos[o][1]-8,pos[o][0]+S[o].w+8,pos[o][1]+S[o].h+8];if(segBox(p,q,bx))k+=14;}}
    // tablas sueltas: cerca del resto; y que el conjunto no quede ni muy ancho ni muy alto
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(let i=0;i<n;i++){x0=Math.min(x0,pos[i][0]);y0=Math.min(y0,pos[i][1]);x1=Math.max(x1,pos[i][0]+S[i].w);y1=Math.max(y1,pos[i][1]+S[i].h);}
    const w=x1-x0,h=y1-y0;k+=(w+h)/900;if(w>2.6*h)k+=(w/h-2.6)*3;if(h>1.3*w)k+=(h/w-1.3)*3;
    return k;};
  // orden inicial: por niveles (las tablas a las que apuntan, arriba)
  const lev=new Array(n).fill(0);for(let it=0;it<n;it++)E.forEach(([a,b])=>{const ch=tables[a].c.some(c=>lc(parseF(c[2]).fk)===lc(tables[b].n))?a:b,pa=ch===a?b:a;if(lev[ch]<lev[pa]+1&&lev[pa]<n)lev[ch]=lev[pa]+1;});
  const order=[...Array(n).keys()].sort((a,b)=>lev[a]-lev[b]);
  let seed=7;tables.forEach(t=>{for(const ch of t.n)seed=(seed*31+ch.charCodeAt(0))>>>0;});
  const rnd=()=>{seed=(seed+0x6D2B79F5)>>>0;let t=seed;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};
  let best=null,bestC=Infinity;
  const run=start=>{const slot=start.slice(),occ=new Array(CELLS).fill(-1);slot.forEach((s,i)=>occ[s]=i);let cur=cost(slot),loc=slot.slice(),locC=cur;
    const iters=Math.min(14000,900*n+2000);let T=3;
    for(let it=0;it<iters;it++){T=3*Math.pow(0.02/3,it/iters);const i=(rnd()*n)|0,to=(rnd()*CELLS)|0,from=slot[i];if(to===from)continue;const j=occ[to];
      slot[i]=to;occ[to]=i;occ[from]=j;if(j>=0)slot[j]=from;const c=cost(slot);
      if(c<=cur||rnd()<Math.exp((cur-c)/T)){cur=c;if(c<locC){locC=c;loc=slot.slice();}}
      else{slot[i]=from;occ[from]=i;occ[to]=j;if(j>=0)slot[j]=to;}}
    // mejora final: probar cada tabla en cada celda
    let better=true,guard=0;const s2=loc.slice(),occ2=new Array(CELLS).fill(-1);s2.forEach((s,i)=>occ2[s]=i);let c2=locC;
    while(better&&guard++<4){better=false;for(let i=0;i<n;i++)for(let to=0;to<CELLS;to++){const from=s2[i];if(to===from)continue;const j=occ2[to];
      s2[i]=to;occ2[to]=i;occ2[from]=j;if(j>=0)s2[j]=from;const c=cost(s2);if(c<c2-1e-9){c2=c;better=true;}else{s2[i]=from;occ2[from]=i;occ2[to]=j;if(j>=0)s2[j]=to;}}}
    if(c2<bestC){bestC=c2;best=s2.slice();}};
  const start0=new Array(n);order.forEach((i,k)=>start0[i]=k);run(start0);
  for(let r=0;r<2;r++){const cells=[...Array(CELLS).keys()].sort(()=>rnd()-.5);run(cells.slice(0,n));}
  place(best,pos);
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(let i=0;i<n;i++){x0=Math.min(x0,pos[i][0]);y0=Math.min(y0,pos[i][1]);x1=Math.max(x1,pos[i][0]+S[i].w);y1=Math.max(y1,pos[i][1]+S[i].h);}
  const dx=W/2-(x0+x1)/2,dy=H/2-(y0+y1)/2;
  tables.forEach((t,i)=>{t.x=Math.round(pos[i][0]+dx);t.y=Math.round(pos[i][1]+dy);});
}
// Si lo distribuido pisa a lo bloqueado, se aparta todo el grupo a la derecha
function keepClear(moved,fixed,size){
  const box=t=>{const s=size(t);return[t.x,t.y,t.x+s.w,t.y+s.h];};const A=moved.map(box),B=fixed.map(box);
  const hit=A.some(a=>B.some(b=>a[0]<b[2]+60&&a[2]+60>b[0]&&a[1]<b[3]+60&&a[3]+60>b[1]));if(!hit)return;
  const dx=Math.max(...B.map(b=>b[2]))+140-Math.min(...A.map(a=>a[0])),dy=Math.min(...B.map(b=>b[1]))-Math.min(...A.map(a=>a[1]));
  moved.forEach(t=>{t.x=Math.round(t.x+dx);t.y=Math.round(t.y+dy);});
}

/* ===================== Comparar dos versiones ===================== */
// Nombres «parecidos» cuentan como el mismo: sin tildes, mayúsculas, espacios ni guiones, y singular/plural
const normName=s=>{let x=String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  if(x.length>4&&x.endsWith('es'))x=x.slice(0,-2);else if(x.length>3&&x.endsWith('s'))x=x.slice(0,-1);return x;};
const attrFlags=f=>[f.k&&'PK',f.p&&'clave parcial',f.o&&'opcional',f.d&&'derivado',f.m&&'multivaluado',f.c&&'compuesto'].filter(Boolean);
function diffER(mine,other){
  const out={add:[],del:[],chg:[],marks:{}},A=erIdx(mine),B=erIdx(other);
  const ents=m=>{const o={};m.nodes.filter(isEnt).forEach(e=>o[normName(e.n)]=e);return o;};const EA=ents(mine),EB=ents(other);
  const attrs=(X,o)=>{const r={};const add=(a,pre)=>{r[pre+normName(a.n)]=a;if(a.f.c)X.attrsOf(a).forEach(x=>add(x,pre+normName(a.n)+'.'));};X.attrsOf(o).forEach(a=>add(a,''));return r;};
  const mark=(id,k)=>{if(!out.marks[id]||k==='add')out.marks[id]=k;};
  // entidades renombradas: mismo conjunto de atributos con otro nombre
  const alias={};Object.entries(EA).forEach(([k,e])=>{if(EB[k])return;const sig=Object.keys(attrs(A,e)).sort().join();if(!sig)return;
    const hit=Object.entries(EB).find(([k2,o])=>!EA[k2]&&!Object.values(alias).includes(k2)&&Object.keys(attrs(B,o)).sort().join()===sig);
    if(hit){alias[hit[0]]=k;EB[k]=hit[1];delete EB[hit[0]];out.chg.push(`Entidad «${e.n}»: en la otra se llama «${hit[1].n}»`);mark(e.id,'chg');}});
  const nB=n=>{const k=normName(n);return alias[k]||k;};
  Object.entries(EA).forEach(([k,e])=>{const o=EB[k];if(!o){out.add.push(`Entidad «${e.n}»`);mark(e.id,'add');return;}
    if((e.k==='weak')!==(o.k==='weak')){out.chg.push(`«${e.n}»: ${e.k==='weak'?'es débil':'no es débil'} (en la otra ${o.k==='weak'?'sí':'no'})`);mark(e.id,'chg');}
    const a1=attrs(A,e),a2=attrs(B,o);
    Object.entries(a1).forEach(([ak,a])=>{const b=a2[ak];if(!b){out.add.push(`Atributo «${a.n}» de «${e.n}»`);mark(a.id,'add');mark(e.id,'chg');return;}
      const f1=attrFlags(a.f).join(', ')||'normal',f2=attrFlags(b.f).join(', ')||'normal';if(f1!==f2){out.chg.push(`«${e.n}.${a.n}»: ${f1} (en la otra: ${f2})`);mark(a.id,'chg');mark(e.id,'chg');}});
    Object.entries(a2).forEach(([ak,b])=>{if(!a1[ak]){out.del.push(`Atributo «${b.n}» de «${e.n}»`);mark(e.id,'chg');}});});
  Object.entries(EB).forEach(([k,o])=>{if(!EA[k])out.del.push(`Entidad «${o.n}»`);});
  // relaciones: se emparejan por las entidades que unen (y si hay varias, por nombre)
  const rels=(X,m,f)=>m.nodes.filter(isRel).map(r=>{const en=X.ends(r);return{r,key:en.map(x=>f(x.e.n)).sort().join('+'),en};});
  const RA=rels(A,mine,normName),RB=rels(B,other,nB),used=new Set();
  RA.forEach(ra=>{let rb=RB.find(x=>!used.has(x)&&x.key===ra.key&&normName(x.r.n)===normName(ra.r.n))||RB.find(x=>!used.has(x)&&x.key===ra.key);
    const label=`«${ra.r.n}» (${ra.en.map(x=>x.e.n).join(' – ')||'sin entidades'})`;
    if(!rb){out.add.push('Relación '+label);mark(ra.r.id,'add');return;}used.add(rb);const ch=[];
    if(normName(ra.r.n)!==normName(rb.r.n))ch.push(`se llama «${rb.r.n}» en la otra`);
    if((ra.r.k==='idrel')!==(rb.r.k==='idrel'))ch.push(ra.r.k==='idrel'?'aquí es identificadora':'en la otra es identificadora');
    ra.en.forEach(x=>{const y=rb.en.find(z=>nB(z.e.n)===normName(x.e.n));if(y&&(x.mn!==y.mn||x.mx!==y.mx))ch.push(`junto a «${x.e.n}»: (${x.mn??'?'},${x.mx??'?'}) y en la otra (${y.mn??'?'},${y.mx??'?'})`);});
    const ra1=Object.keys(attrs(A,ra.r)).sort().join(),rb1=Object.keys(attrs(B,rb.r)).sort().join();if(ra1!==rb1)ch.push('atributos distintos');
    if(ch.length){out.chg.push(`Relación ${label}: ${ch.join('; ')}`);mark(ra.r.id,'chg');}});
  RB.forEach(rb=>{if(!used.has(rb))out.del.push(`Relación «${rb.r.n}» (${rb.en.map(x=>x.e.n).join(' – ')})`);});
  // jerarquías
  const isas=(X,m,f)=>m.nodes.filter(isIsa).map(i=>({i,key:f(X.superOf(i)?.n)+'>'+X.subsOf(i).map(e=>f(e.n)).sort().join('+')}));
  const IA=isas(A,mine,normName),IB=isas(B,other,nB);
  IA.forEach(x=>{const y=IB.find(z=>z.key===x.key);if(!y){out.add.push(`Jerarquía de «${A.superOf(x.i)?.n||'?'}»`);mark(x.i.id,'add');}
    else if(isaLabel(x.i.f)!==isaLabel(y.i.f)){out.chg.push(`Jerarquía de «${A.superOf(x.i)?.n}»: ${isaLabel(x.i.f)} y en la otra ${isaLabel(y.i.f)}`);mark(x.i.id,'chg');}});
  IB.forEach(y=>{if(!IA.some(x=>x.key===y.key))out.del.push(`Jerarquía de «${B.superOf(y.i)?.n||'?'}»`);});
  return out;
}
function diffTables(mine,other){
  const out={add:[],del:[],chg:[],marks:{}},TA={},TB={};mine.t.forEach(t=>TA[normName(t.n)]=t);other.t.forEach(t=>TB[normName(t.n)]=t);
  const fl=c=>{const f=parseF(c[2]);return [f.pk&&'PK',f.fk&&('FK→'+f.fk),!f.nul&&'NN',f.uq&&'UQ'].filter(Boolean).join(' ')||'—';};
  Object.entries(TA).forEach(([k,t])=>{const o=TB[k];if(!o){out.add.push(`Tabla «${t.n}»`);out.marks[t.id]='add';return;}
    const ca={},cb={};t.c.forEach(c=>ca[normName(c[0])]=c);o.c.forEach(c=>cb[normName(c[0])]=c);const ch=[];
    Object.entries(ca).forEach(([ck,c])=>{const d=cb[ck];if(!d){ch.push(`sobra/nueva «${c[0]}»`);return;}
      if(fl(c).replace(/FK→(\S+)/,(_,x)=>'FK→'+normName(x))!==fl(d).replace(/FK→(\S+)/,(_,x)=>'FK→'+normName(x)))ch.push(`«${c[0]}»: ${fl(c)} (en la otra: ${fl(d)})`);
      else if(lc(c[1]).replace(/\s/g,'')!==lc(d[1]).replace(/\s/g,''))ch.push(`«${c[0]}»: tipo ${c[1]} (en la otra ${d[1]})`);});
    Object.entries(cb).forEach(([ck,d])=>{if(!ca[ck])ch.push(`le falta «${d[0]}»`);});
    if(ch.length){out.chg.push(`«${t.n}»: ${ch.join('; ')}`);out.marks[t.id]='chg';}});
  Object.entries(TB).forEach(([k,o])=>{if(!TA[k])out.del.push(`Tabla «${o.n}»`);});
  return out;
}
// Parecido de 0 a 100 (cuántas cosas coinciden)
function diffScore(d,total){const bad=d.add.length+d.del.length+d.chg.length;return total?Math.max(0,Math.round(100*(1-bad/Math.max(total,bad)))):100;}
