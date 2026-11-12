/* ===================== Utilidades ===================== */
const VERSION='2.5.2';
const W=6000,H=4000;          // tamaño de la zona de trabajo
const ZMIN=0.2,ZMAX=3;
const escA=v=>esc(v).replace(/"/g,'&quot;');
let uidN=0; const uid=(p='n')=>p+Date.now().toString(36)+(uidN++).toString(36)+Math.random().toString(36).slice(2,6);
const parseF=s=>{const o={};(s||'').split(' ').forEach(x=>{if(x==='pk')o.pk=1;else if(x==='null')o.nul=1;else if(x==='uq')o.uq=1;else if(x.startsWith('fk:'))o.fk=x.slice(3);});return o;};
const joinF=o=>[o.pk&&'pk',o.nul&&'null',o.uq&&'uq',o.fk&&('fk:'+o.fk)].filter(Boolean).join(' ');
const lc=s=>String(s||'').trim().toLowerCase();
const VIEWS={enun:'Enunciado',bo:'Boceto',er:'E-R',rel:'Relacional',ded:'DED',sql:'SQL',test:'Probar'};
const TYPES=['INT','SMALLINT','TINYINT','VARCHAR(45)','VARCHAR(100)','CHAR(9)','DATE','TIME','DATETIME','DECIMAL(8,2)','TEXT','BOOLEAN'];
const ICO={
  folder:`<svg class="ico" width="16" height="16" viewBox="0 0 16 16"><path d="M1.5 4.5a1 1 0 0 1 1-1h3.6l1.4 1.5h6a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z" fill="var(--folder)"/></svg>`,
  grp:`<svg class="ico gico" width="16" height="16" viewBox="0 0 16 16"><path d="M1.5 4.5a1 1 0 0 1 1-1h3.6l1.4 1.5h6a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M1.5 7h13" stroke="currentColor" stroke-width="1.1"/></svg>`,
  find:`<svg class="ico" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m10.5 10.5 3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  chev:`<svg class="chev" width="12" height="12" viewBox="0 0 12 12"><path d="M4 2.5 7.5 6 4 9.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
  enun:`<svg class="ico" width="15" height="15" viewBox="0 0 16 16"><path d="M3.5 1.5h6l3 3v10h-9z" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M5.5 7.5h5M5.5 10h5M5.5 12.5h3" stroke="currentColor" stroke-width="1.2"/></svg>`,
  bo:`<svg class="ico" width="15" height="15" viewBox="0 0 16 16"><rect x="1" y="2" width="5.5" height="4" fill="none" stroke="var(--c-ent)" stroke-width="1.3"/><rect x="9.5" y="10" width="5.5" height="4" fill="none" stroke="var(--c-ent)" stroke-width="1.3"/><path d="M5 6l6 4" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 1.5"/></svg>`,
  er:`<svg class="ico" width="15" height="15" viewBox="0 0 16 16"><rect x="1" y="5.5" width="5" height="5" fill="none" stroke="var(--c-ent)" stroke-width="1.3"/><path d="M11.5 4.5 15 8l-3.5 3.5L8 8z" fill="none" stroke="var(--c-rel)" stroke-width="1.3"/><path d="M6 8h2" stroke="currentColor" stroke-width="1.3"/></svg>`,
  rel:`<svg class="ico" width="15" height="15" viewBox="0 0 16 16"><rect x="1" y="2" width="6" height="7" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="7" width="6" height="7" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M7 5h3v2" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`,
  ded:`<svg class="ico" width="15" height="15" viewBox="0 0 16 16"><rect x="1" y="2" width="14" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M1 6h14" stroke="var(--ded-head)" stroke-width="2.4"/><path d="M4 9h6M4 11.5h4" stroke="currentColor" stroke-width="1.1"/></svg>`,
  test:`<svg class="ico" width="15" height="15" viewBox="0 0 16 16"><path d="M4.5 2.5v4.2L1.8 12a1.3 1.3 0 0 0 1.2 1.9h10a1.3 1.3 0 0 0 1.2-1.9l-2.7-5.3V2.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M3.5 2.5h9M3.6 9.5h8.8" stroke="currentColor" stroke-width="1.2"/></svg>`,
  sql:`<svg class="ico" width="15" height="15" viewBox="0 0 16 16"><ellipse cx="8" cy="3.5" rx="5.5" ry="2" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M2.5 3.5v9c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-9M2.5 8c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`};
function toast(msg,kind){document.querySelectorAll('.toast').forEach(x=>x.remove());const t=document.createElement('div');t.className='toast'+(kind?' '+kind:'');t.setAttribute('role','status');t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),kind==='warn'?5200:3200);}
const cleanNotes=v=>((v&&v.notes)||[]).map(n=>({id:n.id,k:'note',x:n.x,y:n.y,w:n.w||180,c:n.c||'y',text:String(n.text||''),...(n.lk?{lk:1}:{}),...(n.from?{from:String(n.from)}:{})}));
// er y bo (boceto) comparten formato: nodos y líneas
const cleanModel=(v,m)=>(m==='er'||m==='bo')?{nodes:((v&&v.nodes)||[]).map(n=>({id:n.id,k:n.k,n:n.n,x:n.x,y:n.y,f:n.f||{}})),links:((v&&v.links)||[]).map(l=>({id:l.id,a:l.a,b:l.b,c:l.c||null,mn:l.mn??null,mx:l.mx??null,...(l.sup?{sup:1}:{}),...(l.ea?{ea:l.ea}:{}),...(l.eb?{eb:l.eb}:{}),...(Array.isArray(l.at)&&l.at.length?{at:l.at.map(String)}:{})})),notes:cleanNotes(v)}:{t:((v&&v.t)||[]).map(t=>({id:t.id,n:t.n,x:t.x,y:t.y,c:(t.c||[]).map(c=>[c[0],c[1],c[2]]),...(t.lk?{lk:1}:{})})),notes:cleanNotes(v)};
const isNote=n=>!!n&&n.k==='note';
const NOTE_COLORS={y:'Amarilla',b:'Azul',g:'Verde',p:'Rosa'};
// Parte el texto de una nota en líneas que caben en su ancho
function noteLines(n){const per=Math.max(8,Math.floor((n.w-22)/6.7)),out=[];
  String(n.text||'').split('\n').forEach(par=>{let line='';par.split(/\s+/).forEach(wd=>{while(wd.length>per){if(line){out.push(line);line='';}out.push(wd.slice(0,per));wd=wd.slice(per);}
    if(!line)line=wd;else if((line+' '+wd).length<=per)line+=' '+wd;else{out.push(line);line=wd;}});out.push(line);});
  return out.length?out:[''];}
function noteSize(n){n.w=n.w||180;n.lines=noteLines(n);n.h=Math.max(46,18+n.lines.length*16);return n;}
function noteSVG(n,cls=''){noteSize(n);const x=n.x,y=n.y,w=n.w,h=n.h,f=12;
  const tape=typeof document!=='undefined'&&document.documentElement.classList.contains('nt-cinta')?`<rect x="${x+w/2-28}" y="${y-9}" width="56" height="18" rx="2" class="note-tape" transform="rotate(-4 ${x+w/2} ${y})"/>`:'';
  return `<path d="M${x},${y} H${x+w-f} L${x+w},${y+f} V${y+h} H${x} Z" class="note nc-${n.c||'y'}${cls}"/>`+tape+`<path d="M${x+w-f},${y} V${y+f} H${x+w}" class="note-fold nc-${n.c||'y'}"/>`+
    n.lines.map((l,i)=>`<text x="${x+10}" y="${y+21+i*16}" class="note-tx">${esc(l)}</text>`).join('');}
const plainProject=p=>({folder:p.folder,name:p.name,created:p.created,updated:p.updated,...(p.act?{act:p.act}:{}),...(p.hl&&p.hl.length?{hl:p.hl}:{}),...(p.icon?{icon:p.icon}:{}),enun:p.enun||'',sql:p.sql||'',test:p.test||'',er:cleanModel(p.er,'er'),rel:cleanModel(p.rel,'rel'),ded:cleanModel(p.ded,'ded'),bo:cleanModel(p.bo,'bo')});
function guessType(name,f){
  const s=lc(name);
  if(f&&(f.pk||f.fk))return /^(dni|nif|nie)/.test(s)?'CHAR(9)':/^(mat|isbn|iata|cod[a-z]*str)/.test(s)?'VARCHAR(20)':'INT';
  if(/^(fec|fecha|date)/.test(s))return 'DATE';
  if(/^(hor|hora)/.test(s))return 'TIME';
  if(/^(dni|nif|nie)/.test(s))return 'CHAR(9)';
  if(/(precio|salario|sueldo|importe|presupuesto|coste|total|nota)/.test(s))return 'DECIMAL(8,2)';
  if(/^(num|cant|edad|n_|nro|anio|año)/.test(s))return 'INT';
  if(/^(tfn|tel)/.test(s))return 'VARCHAR(15)';
  if(/^(desc|obs|coment)/.test(s))return 'TEXT';
  return 'VARCHAR(45)';
}

/* ===================== Modelo E-R (funciones que no dependen del editor) ===================== */
const isEnt=n=>!!n&&(n.k==='ent'||n.k==='weak'), isRel=n=>!!n&&(n.k==='rel'||n.k==='idrel'), isAtt=n=>!!n&&n.k==='attr', isIsa=n=>!!n&&n.k==='isa';
// Entidad asociativa: una relación (rombo) metida en un rectángulo, que a su vez puede relacionarse con otras entidades
const isAssoc=n=>isRel(n)&&!!(n.f&&n.f.as);
// Devuelve [relación, extremo] si la línea a–b lleva cardinalidad (relación con entidad, o relación con entidad asociativa)
const pairRE=(a,b)=>{if(!a||!b)return null;if(isRel(a)&&isEnt(b))return[a,b];if(isRel(b)&&isEnt(a))return[b,a];
  if(isAssoc(b)&&isRel(a)&&!isAssoc(a))return[a,b];if(isAssoc(a)&&isRel(b)&&!isAssoc(b))return[b,a];return null;};
// Etiqueta de una jerarquía: (t,e) total exclusiva, (p,s) parcial solapada…
const isaLabel=f=>{f=f||{};return false?`{${f.tot?(LANG()==='en'?'complete':'completa'):(LANG()==='en'?'incomplete':'incompleta')}, ${f.dis===false?(LANG()==='en'?'overlapping':'solapada'):(LANG()==='en'?'disjoint':'disjunta')}}`:`(${f.tot?'t':'p'},${f.dis===false?'s':'e'})`;};
function mmOf(l){if(l.mn!=null||l.mx!=null)return{mn:l.mn??null,mx:l.mx??null};if(l.c){const m=String(l.c).match(/\((\w),(\w)\)/);if(m)return{mn:m[1],mx:m[2]};}return{mn:null,mx:null};}
// Relacionar en el DED preguntando como en el E-R: P.ca = cardinalidad junto a A, P.cb = junto a B
function dedPlan(P){const a=P.ca,b=P.cb;if(!a.mx||!b.mx||!a.mn||!b.mn)return null;const manyA=a.mx==='N',manyB=b.mx==='N',ident=P.line==='cont';
  if(manyA&&manyB)return{type:'NM',dir:'ab',req:true,ident:true};
  if(manyA!==manyB){const childIsA=manyA,nearParent=childIsA?b:a;return{type:'1N',dir:childIsA?'ba':'ab',req:nearParent.mn!=='0',ident};}
  const childIsB=a.mn==='1'&&b.mn!=='1',nearParent=childIsB?a:b;return{type:'11',dir:childIsB?'ab':'ba',req:nearParent.mn!=='0',ident};}
function erIdx(er){
  const N={};er.nodes.forEach(n=>N[n.id]=n);
  const linksOf=id=>er.links.filter(l=>l.a===id||l.b===id);
  const other=(l,id)=>N[l.a===id?l.b:l.a];
  const attrsOf=o=>linksOf(o.id).filter(l=>{const x=other(l,o.id);return isAtt(x)&&(!isAtt(o)||l.a===o.id);}).map(l=>other(l,o.id));
  const ownerOf=a=>{for(const l of linksOf(a.id)){const x=other(l,a.id);if(x&&!isAtt(x))return x;}for(const l of linksOf(a.id)){if(l.b===a.id&&isAtt(N[l.a]))return N[l.a];}return null;};
  const ends=r=>linksOf(r.id).filter(l=>{const p=pairRE(r,other(l,r.id));return p&&p[0]===r;}).map(l=>({l,e:other(l,r.id),...mmOf(l)}));
  const cardable=l=>!!pairRE(N[l.a],N[l.b]);
  const relType=r=>{const cs=ends(r).map(x=>x.mx);if(cs.length>=3)return 'ternaria';if(cs.length!==2||cs.some(c=>c==null))return '';const m=cs.map(c=>c!=='1');return m[0]&&m[1]?'N:M':m[0]||m[1]?'1:N':'1:1';};
  // Jerarquías (ISA): la línea con sup:1 va al supertipo, el resto a los subtipos
  const superOf=i=>{const l=linksOf(i.id).find(l=>l.sup&&isEnt(other(l,i.id)));return l?other(l,i.id):null;};
  const subsOf=i=>linksOf(i.id).filter(l=>!l.sup&&isEnt(other(l,i.id))).map(l=>other(l,i.id));
  const isaOfSub=e=>{for(const l of linksOf(e.id)){const o=other(l,e.id);if(isIsa(o)&&!l.sup)return o;}return null;};
  return {N,linksOf,other,attrsOf,ownerOf,ends,cardable,relType,superOf,subsOf,isaOfSub};
}
function erDups(er){
  const X=erIdx(er),bad=new Set(),cnt={};
  er.nodes.filter(isEnt).forEach(n=>{const k=lc(n.n);(cnt[k]=cnt[k]||[]).push(n.id);});
  Object.values(cnt).forEach(a=>{if(a.length>1)a.forEach(id=>bad.add(id));});
  er.nodes.filter(n=>!isAtt(n)||n.f.c).forEach(o=>{const m={};X.attrsOf(o).forEach(a=>{const k=lc(a.n);(m[k]=m[k]||[]).push(a.id);});Object.values(m).forEach(a=>{if(a.length>1)a.forEach(id=>bad.add(id));});});
  return bad;
}
function tableDups(model){
  const cnt={};model.t.forEach(t=>{const k=lc(t.n);cnt[k]=(cnt[k]||0)+1;});
  model.t.forEach(t=>{t._dup=cnt[lc(t.n)]>1;const m={};t.c.forEach(c=>{const k=lc(c[0]);m[k]=(m[k]||0)+1;});t._dupCols=new Set(Object.keys(m).filter(k=>m[k]>1&&k));});
  return model.t.some(t=>t._dup||t._dupCols.size);
}
// Comprueba que el E-R se puede pasar a tablas
function validateER(er,easy){
  const X=erIdx(er),out=[],ents=er.nodes.filter(isEnt);
  if(!ents.length){out.push('Tu E-R no tiene entidades todavía.');return out;}
  const dups=erDups(er);
  ents.forEach(e=>{const at=X.attrsOf(e),sub=X.isaOfSub(e);
    if(sub){if(dups.has(e.id))out.push(`Hay dos entidades que se llaman «${e.n}».`);return;} // un subtipo hereda la clave de su supertipo
    if(!at.length)out.push(`La entidad «${e.n}» no tiene atributos.`);
    else if(!at.some(a=>a.f.k||(e.k==='weak'&&a.f.p)))out.push(`La entidad «${e.n}» no tiene clave primaria (marca un atributo como PK).`);
    if(dups.has(e.id))out.push(`Hay dos entidades que se llaman «${e.n}».`);});
  er.nodes.filter(isAtt).forEach(a=>{if(!X.ownerOf(a))out.push(`El atributo «${a.n}» no está unido a ninguna entidad o relación.`);else if(dups.has(a.id))out.push(`El atributo «${a.n}» está repetido en «${X.ownerOf(a).n}».`);});
  er.nodes.filter(isIsa).forEach(i=>{const s=X.superOf(i),subs=X.subsOf(i);
    if(!s)out.push('Una jerarquía (ISA) no tiene supertipo: en su panel elige cuál es la entidad de arriba.');
    else if(!subs.length)out.push(`La jerarquía de «${s.n}» no tiene subtipos: une al triángulo las entidades hijas.`);});
  er.nodes.filter(isRel).forEach(r=>{const en=X.ends(r);
    if(en.length<2&&!(en.length===1&&X.linksOf(r.id).filter(l=>{const p=pairRE(r,X.other(l,r.id));return p&&p[0]===r;}).length>=2))out.push(`La relación «${r.n}» tiene que unir al menos dos entidades.`);
    else if(en.some(x=>x.mn==null||x.mx==null))out.push(`A la relación «${r.n}» le faltan cardinalidades (máximo y mínimo).`);});
  return out;
}
// Pasa el E-R a tablas. easy=true también convierte las relaciones.
function erToTables(er,easy){
  const X=erIdx(er),tables=[],byEnt={},notes=[];
  const uniqueCol=(t,name)=>{let n=name,i=2;while(t.c.some(c=>lc(c[0])===lc(n)))n=name+'_'+i++;return n;};
  const pkCols=t=>t.c.filter(c=>parseF(c[2]).pk);
  const flat=(o,skip)=>{const out=[];const add=a=>{if(a.f.d){skip.d++;return;}if(a.f.m){skip.m.push([o,a]);return;}if(a.f.c){const parts=X.attrsOf(a);if(parts.length){parts.forEach(add);return;}}
      const fl={pk:(a.f.k||a.f.p)?1:0,nul:a.f.o?1:0};out.push([a.n,guessType(a.n,fl),joinF(fl)]);};X.attrsOf(o).forEach(add);return out;};
  const skip={d:0,m:[]};
  er.nodes.filter(isEnt).forEach(e=>{const t={id:uid(),n:e.n,x:0,y:0,c:flat(e,skip),_src:e.id};tables.push(t);byEnt[e.id]=t;});
  isaToTables(er,X,tables,byEnt,notes,uniqueCol,pkCols);
  if(skip.d)notes.push(`No se pasan los atributos derivados (${skip.d}): no se guardan.`);
  if(easy){
    // Multivaluados: tabla aparte con la PK de la entidad + el atributo
    skip.m.forEach(([o,a])=>{const parent=byEnt[o.id];if(!parent)return;const t={id:uid(),n:parent.n+'_'+a.n,x:0,y:0,c:[],_mid:[parent]};
      pkCols(parent).forEach(c=>t.c.push([c[0],c[1],joinF({pk:1,fk:parent.n})]));t.c.push([a.n,guessType(a.n,{}),joinF({pk:1})]);tables.push(t);});
    const rattrs0=r=>flat(r,{d:0,m:[]}).map(c=>[c[0],c[1],joinF({nul:parseF(c[2]).nul})]);
    const addFK=(child,parent,{pk,uq,nul,suffix})=>{const pc=pkCols(parent);pc.forEach(c=>{let name=c[0];if(child.c.some(x=>lc(x[0])===lc(name)))name=uniqueCol(child,c[0]+'_'+(suffix||parent.n));
      child.c.push([name,c[1],joinF({pk:pk?1:0,uq:(uq&&pc.length===1)?1:0,nul:nul?1:0,fk:parent.n})]);});};
    er.nodes.filter(isRel).sort((a,b)=>isAssoc(b)-isAssoc(a)).forEach(r=>{
      const en=X.ends(r).filter(x=>byEnt[x.e.id]);if(en.length<2)return;
      if(isAssoc(r)){ // entidad asociativa: siempre tabla propia con las claves de sus entidades
        const t={id:uid(),n:r.n,x:0,y:0,c:[],_mid:en.map(x=>byEnt[x.e.id])},self=new Set(en.map(x=>x.e.id)).size<en.length;
        en.forEach((x,i)=>addFK(t,byEnt[x.e.id],{pk:1,suffix:self?String(i+1):x.e.n}));rattrs0(r).forEach(c=>t.c.push([uniqueCol(t,c[0]),c[1],c[2]]));tables.push(t);byEnt[r.id]=t;return;}
      const rattrs=flat(r,{d:0,m:[]}).map(c=>[c[0],c[1],joinF({nul:parseF(c[2]).nul})]);
      const ident=r.k==='idrel';
      if(en.length===2){
        const [A,B]=en,TA=byEnt[A.e.id],TB=byEnt[B.e.id],self=A.e.id===B.e.id;
        const manyA=A.mx!=='1',manyB=B.mx!=='1';
        if(manyA&&manyB){ // N:M -> tabla nueva
          const t={id:uid(),n:r.n||(TA.n+'_'+TB.n),x:0,y:0,c:[],_mid:[TA,TB]};
          addFK(t,TA,{pk:1,suffix:self?'1':TA.n});addFK(t,TB,{pk:1,suffix:self?'2':TB.n});rattrs.forEach(c=>t.c.push([uniqueCol(t,c[0]),c[1],c[2]]));tables.push(t);return;}
        // 1:N: la FK va a la entidad del lado N (la que tiene máximo N junto a ella)
        let child,parent,childEnd,parentEnd;
        if(manyA!==manyB){child=manyA?TA:TB;parent=manyA?TB:TA;childEnd=manyA?A:B;parentEnd=manyA?B:A;}
        else{ // 1:1: la FK va a la tabla cuya participación es obligatoria
          if(A.mn==='1'&&B.mn!=='1'){child=TB;parent=TA;parentEnd=A;}else{child=TA;parent=TB;parentEnd=B;}}
        const weakChild=ident&&er.nodes.find(n=>n.id===(child===TA?A.e.id:B.e.id)&&n.k==='weak');
        addFK(child,parent,{pk:!!weakChild,uq:manyA===manyB,nul:parentEnd.mn==='0'&&!weakChild,suffix:self?r.n:parent.n});
        rattrs.forEach(c=>child.c.push([uniqueCol(child,c[0]),c[1],c[2]]));
      } else { // ternaria o más
        const t={id:uid(),n:r.n,x:0,y:0,c:[],_mid:en.map(x=>byEnt[x.e.id])};
        en.forEach(x=>addFK(t,byEnt[x.e.id],{pk:x.mx!=='1'||en.every(y=>y.mx==='1'),suffix:x.e.n}));rattrs.forEach(c=>t.c.push([uniqueCol(t,c[0]),c[1],c[2]]));tables.push(t);}
    });
  } else {
    if(skip.m.length)notes.push(`Los multivaluados (${skip.m.length}) no se pasan: con el modo fácil irían en una tabla aparte.`);
  }
  // Colocación: misma distribución que en el E-R, sin quedar ni lejos ni pegadas
  layoutTables(tables,X);
  tables.forEach(t=>{delete t._src;delete t._mid;});
  return {tables,notes};
}
// Jerarquías (ISA) a tablas. Según lo elegido en cada una (f.map):
//  each: una tabla por entidad; cada subtipo recibe la PK del supertipo como PK y FK (siempre vale)
//  up:   solo la tabla del supertipo, con las columnas de los subtipos (opcionales) y una columna «tipo»
//  down: solo las tablas de los subtipos, con las columnas del supertipo (solo si es total)
function isaToTables(er,X,tables,byEnt,notes,uniqueCol,pkCols){
  const isas=er.nodes.filter(isIsa).map(i=>({i,sup:X.superOf(i),subs:X.subsOf(i)})).filter(o=>o.sup&&o.subs.length);
  const depth=e=>{let d=0,cur=e;for(let g=0;g<30;g++){const p=isas.find(o=>o.subs.includes(cur));if(!p)break;d++;cur=p.sup;}return d;};
  isas.sort((a,b)=>depth(a.sup)-depth(b.sup));
  for(const o of isas){const f=o.i.f||{};let mode=f.map||'each';const ST=byEnt[o.sup.id];if(!ST)continue;
    if(mode==='down'&&!f.tot){notes.push(`«${o.sup.n}»: solo se pueden quitar las tablas del supertipo si la jerarquía es total. Se ha hecho una tabla por entidad.`);mode='each';}
    if(mode==='down'&&er.nodes.filter(isRel).some(r=>X.ends(r).some(x=>x.e.id===o.sup.id))){notes.push(`«${o.sup.n}» participa en relaciones, así que su tabla se mantiene (una tabla por entidad).`);mode='each';}
    if(mode==='up'){
      o.subs.forEach(s=>{const T=byEnt[s.id];if(!T||T===ST)return;
        T.c.filter(c=>!parseF(c[2]).pk).forEach(c=>{const g=parseF(c[2]);g.nul=1;ST.c.push([uniqueCol(ST,c[0]),c[1],joinF(g)]);});
        tables.splice(tables.indexOf(T),1);byEnt[s.id]=ST;});
      if(f.dis!==false)ST.c.push([uniqueCol(ST,'tipo'),'VARCHAR(20)',joinF({nul:f.tot?0:1})]);
      else o.subs.forEach(s=>ST.c.push([uniqueCol(ST,'es_'+s.n),'BOOLEAN',joinF({})]));
      continue;}
    if(mode==='down'){
      o.subs.forEach(s=>{const T=byEnt[s.id];if(!T)return;const own=T.c.map(c=>{const g=parseF(c[2]);if(g.pk){g.pk=0;g.uq=1;}return[c[0],c[1],joinF(g)];});
        T.c=ST.c.map(c=>[c[0],c[1],c[2]]);own.forEach(c=>T.c.push([uniqueCol(T,c[0]),c[1],c[2]]));});
      tables.splice(tables.indexOf(ST),1);byEnt[o.sup.id]=null;continue;}
    o.subs.forEach(s=>{const T=byEnt[s.id];if(!T||T===ST)return;
      const own=T.c.map(c=>{const g=parseF(c[2]);if(g.pk){g.pk=0;g.uq=1;}return[c[0],c[1],joinF(g)];});
      T.c=[];pkCols(ST).forEach(c=>T.c.push([uniqueCol(T,c[0]),c[1],joinF({pk:1,fk:ST.n})]));own.forEach(c=>T.c.push([uniqueCol(T,c[0]),c[1],c[2]]));});
  }
}
// Copia las notas de un diagrama a otro (al pasar Boceto → E-R → Relacional → DED), sin repetirlas, a la derecha de lo que haya
function carryNotes(src,dst,tables){const from=(src&&src.notes)||[];if(!from.length)return 0;dst.notes=dst.notes||[];
  const have=new Set(dst.notes.map(n=>n.from||'')),txt=new Set(dst.notes.map(n=>lc(String(n.text||'').trim())));
  const add=from.filter(n=>!have.has(n.id)&&!have.has(n.from||'-')&&!txt.has(lc(String(n.text||'').trim())));if(!add.length)return 0;
  const boxes=tables?(dst.t||[]).map(t=>{const s=tableSize(t);return[t.x,t.y,t.x+s.w,t.y+s.h];}):(dst.nodes||[]).map(n=>[n.x-60,n.y-30,n.x+60,n.y+30]);
  dst.notes.forEach(n=>{noteSize(n);boxes.push([n.x,n.y,n.x+n.w,n.y+n.h]);});
  const x0=boxes.length?Math.max(...boxes.map(b=>b[2]))+60:W/2,y0=boxes.length?Math.min(...boxes.map(b=>b[1])):H/2;let y=y0;
  add.forEach(n=>{const c={id:uid(),k:'note',x:Math.round(Math.min(W-240,x0)),y:Math.round(y),w:n.w||180,text:n.text||'',c:n.c||'y',from:n.from||n.id};noteSize(c);dst.notes.push(c);y+=c.h+24;});
  return add.length;}
function tableSize(t){const tmp={W,H,t:[{n:t.n,x:0,y:0,c:t.c}]};prepTables(tmp);return {w:tmp.t[0].w,h:tmp.t[0].h};}
function layoutTables(tables,X){
  const main=tables.filter(t=>t._src),extra=tables.filter(t=>!t._src);
  main.forEach(t=>{const e=X.N[t._src];t._ex=e.x;t._ey=e.y;Object.assign(t,tableSize(t));});
  const cluster=(arr,key,th)=>{const s=[...arr].sort((a,b)=>a[key]-b[key]);let g=-1,start=-1e9;s.forEach(t=>{if(t[key]-start>th){g++;start=t[key];}t[key+'G']=g;});return g+1;};
  const nc=cluster(main,'_ex',170),nr=cluster(main,'_ey',130);
  const colW=Array(nc).fill(0),rowH=Array(nr).fill(0);
  main.forEach(t=>{colW[t._exG]=Math.max(colW[t._exG],t.w);rowH[t._eyG]=Math.max(rowH[t._eyG],t.h);});
  const colX=[],rowY=[];let acc=0;colW.forEach((w,i)=>{colX[i]=acc;acc+=w+110;});acc=0;rowH.forEach((h,i)=>{rowY[i]=acc;acc+=h+90;});
  main.forEach(t=>{t.x=colX[t._exG];t.y=rowY[t._eyG];});
  const placed=[...main];
  const hit=(t,o)=>t.x<o.x+o.w+50&&t.x+t.w+50>o.x&&t.y<o.y+o.h+40&&t.y+t.h+40>o.y;
  extra.forEach(t=>{Object.assign(t,tableSize(t));const ps=(t._mid||[]).filter(Boolean);
    if(ps.length){t.x=ps.reduce((s,p)=>s+p.x+p.w/2,0)/ps.length-t.w/2;t.y=ps.reduce((s,p)=>s+p.y+p.h/2,0)/ps.length-t.h/2;}else{t.x=0;t.y=acc;}
    let k=0;while(placed.some(o=>hit(t,o))&&k<200){t.y+=30;k++;}placed.push(t);});
  // Centrar el conjunto en mitad de la zona de trabajo
  const x0=Math.min(...placed.map(t=>t.x)),y0=Math.min(...placed.map(t=>t.y)),x1=Math.max(...placed.map(t=>t.x+t.w)),y1=Math.max(...placed.map(t=>t.y+t.h));
  const dx=W/2-(x0+x1)/2,dy=H/2-(y0+y1)/2;
  placed.forEach(t=>{t.x=Math.round(t.x+dx);t.y=Math.round(t.y+dy);['_ex','_ey','_exG','_eyG','w','h'].forEach(k=>delete t[k]);});
}

/* ===================== Iconos de los botones ===================== */
const gsv=(w,body)=>`<svg class="gl" width="${w}" height="16" viewBox="0 0 ${w} 16" aria-hidden="true">${body}</svg>`;
const GL={
  ent:gsv(22,'<rect x="1.5" y="3" width="19" height="10" fill="var(--e-fill)" stroke="var(--c-ent)" stroke-width="1.4"/>'),
  weak:gsv(22,'<rect x="1.5" y="2" width="19" height="12" fill="none" stroke="var(--c-ent)" stroke-width="1.3"/><rect x="4" y="4.5" width="14" height="7" fill="none" stroke="var(--c-ent)" stroke-width="1.1"/>'),
  rel:gsv(22,'<path d="M11 1.5 20.5 8 11 14.5 1.5 8z" fill="var(--r-fill)" stroke="var(--c-rel)" stroke-width="1.4"/>'),
  idrel:gsv(22,'<path d="M11 1 21 8 11 15 1 8z" fill="none" stroke="var(--c-rel)" stroke-width="1.2"/><path d="M11 4.2 16.5 8 11 11.8 5.5 8z" fill="none" stroke="var(--c-rel)" stroke-width="1"/>'),
  attr:gsv(22,'<ellipse cx="11" cy="8" rx="9.5" ry="5.5" fill="var(--a-fill)" stroke="var(--c-att)" stroke-width="1.4"/>'),
  link:gsv(22,'<rect x="1" y="5" width="6" height="6" fill="none" stroke="var(--c-ent)" stroke-width="1.3"/><path d="M17 3.5 21 8l-4 4.5L13 8z" fill="none" stroke="var(--c-rel)" stroke-width="1.3"/><path d="M7 8h6" stroke="currentColor" stroke-width="1.4"/>'),
  key:gsv(22,'<ellipse cx="11" cy="7" rx="9.5" ry="5.5" fill="var(--k-fill)" stroke="var(--c-key)" stroke-width="1.2"/><path d="M6 9.2h10" stroke="currentColor" stroke-width="1.6"/>'),
  partial:gsv(22,'<ellipse cx="11" cy="7" rx="9.5" ry="5.5" fill="none" stroke="var(--c-key)" stroke-width="1.2"/><path d="M6 9.2h10" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2 1.6"/>'),
  opt:gsv(22,'<text x="11" y="11.5" text-anchor="middle" font-size="10" font-weight="700" font-family="Consolas,monospace" fill="currentColor">(O)</text>'),
  deriv:gsv(22,'<ellipse cx="11" cy="8" rx="9.5" ry="5.5" fill="none" stroke="var(--c-att)" stroke-width="1.3" stroke-dasharray="2.6 1.8"/>'),
  multi:gsv(22,'<ellipse cx="11" cy="8" rx="10" ry="6.5" fill="none" stroke="var(--c-att)" stroke-width="1.1"/><ellipse cx="11" cy="8" rx="7" ry="3.8" fill="none" stroke="var(--c-att)" stroke-width="1.1"/>'),
  comp:gsv(22,'<ellipse cx="11" cy="4.5" rx="6.5" ry="3.2" fill="none" stroke="var(--c-att)" stroke-width="1.2"/><ellipse cx="5" cy="12.5" rx="4" ry="2.4" fill="none" stroke="var(--c-att)" stroke-width="1"/><ellipse cx="17" cy="12.5" rx="4" ry="2.4" fill="none" stroke="var(--c-att)" stroke-width="1"/><path d="M8.5 7.4 6 10.2M13.5 7.4 16 10.2" stroke="var(--c-att)" stroke-width="1"/>'),
  table:gsv(18,'<rect x="1.5" y="2" width="15" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 6h15" stroke="var(--ded-head)" stroke-width="2.6"/><path d="M7 6v8" stroke="currentColor" stroke-width="1.1"/>'),
  relate:gsv(24,'<rect x="1" y="4" width="7" height="8" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="16" y="4" width="7" height="8" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M8 8h8" stroke="var(--fk)" stroke-width="1.4"/><path d="M13 5.5 16 8l-3 2.5" fill="none" stroke="var(--fk)" stroke-width="1.3"/>'),
  fromer:gsv(26,'<rect x="1" y="5" width="7" height="6" fill="none" stroke="var(--c-ent)" stroke-width="1.2"/><path d="M10 8h5m-2-2.5L15.5 8 13 10.5" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="17" y="3" width="8" height="10" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M17 6h8" stroke="var(--ded-head)" stroke-width="1.6"/>'),
  back:gsv(16,'<path d="M14 8H3m4-4.5L2.5 8 7 12.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'),
  fwd:gsv(16,'<path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'),
  copy:gsv(18,'<rect x="1.5" y="1.5" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="6.5" y="4.5" width="10" height="10" fill="var(--surface)" stroke="currentColor" stroke-width="1.2"/>'),
  easy:gsv(18,'<path d="M9 1.5l1.9 4 4.4.5-3.3 3 .9 4.3L9 11.1l-3.9 2.2.9-4.3-3.3-3 4.4-.5z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>'),
  dist:gsv(18,'<rect x="1" y="1" width="5" height="5" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="12" y="1" width="5" height="5" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="1" y="12" width="5" height="5" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="12" y="12" width="5" height="5" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="9" cy="9" r="1.6" fill="currentColor"/>'),
  clear:gsv(16,'<path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.8 9.5h6.4l.8-9.5" fill="none" stroke="currentColor" stroke-width="1.3"/>'),
  find:gsv(16,'<circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m10.5 10.5 3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'),
  enun:gsv(16,'<path d="M3 1.5h7l3 3v10H3z" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M5 7.5h6M5 10h6M5 12.5h4" stroke="currentColor" stroke-width="1.1"/>'),
  open:gsv(18,'<path d="M1.5 4.5a1 1 0 0 1 1-1h4l1.5 1.5h6.5a1 1 0 0 1 1 1v1.5H5L2.5 14.5h-1z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M5 7.5h11.5L14 14.5H2.5z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>'),
  note:gsv(18,'<path d="M2 2h11l3 3v11H2z" fill="#FBE7A1" stroke="#B08A1E" stroke-width="1.2"/><path d="M5 7h8M5 10h8M5 13h5" stroke="#8A6A10" stroke-width="1.1"/>'),
  isa:gsv(22,'<path d="M11 1.5 20 14.5H2z" fill="var(--r-fill)" stroke="var(--c-rel)" stroke-width="1.4" stroke-linejoin="round"/>'),
  lock:gsv(14,'<rect x="2.5" y="6.5" width="9" height="7" rx="1.2" fill="currentColor"/><path d="M4.5 6.5V4.5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" stroke-width="1.4"/>'),
  sk:gsv(24,'<rect x="1" y="3" width="8" height="6" fill="var(--e-fill)" stroke="var(--c-ent)" stroke-width="1.3"/><rect x="15" y="7" width="8" height="6" fill="var(--e-fill)" stroke="var(--c-ent)" stroke-width="1.3"/><path d="M9 6.5l6 3" stroke="currentColor" stroke-width="1.3"/>'),
  pin:gsv(14,'<path d="M5 1.5h4l-.6 4 2.6 2.5H3L5.6 5.5z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M7 8v5" stroke="currentColor" stroke-width="1.3"/>'),
  pkcol:gsv(18,'<circle cx="5" cy="8" r="3.4" fill="var(--pk)"/><rect x="7.5" y="7" width="9" height="2.2" fill="var(--pk)"/><rect x="13.5" y="8" width="2.2" height="3.5" fill="var(--pk)"/>'),
  fkcol:gsv(14,'<path d="M7 2.5 12 8 7 13.5 2 8z" fill="var(--fk)"/>'),
  nncol:gsv(20,'<rect x="1" y="3" width="18" height="10" rx="2" fill="none" stroke="var(--col)" stroke-width="1.2"/><text x="10" y="11" text-anchor="middle" font-size="7.5" font-weight="700" font-family="Consolas,monospace" fill="var(--col)">NN</text>'),
  uqcol:gsv(20,'<rect x="1" y="3" width="18" height="10" rx="2" fill="none" stroke="var(--col)" stroke-width="1.2"/><text x="10" y="11" text-anchor="middle" font-size="7.5" font-weight="700" font-family="Consolas,monospace" fill="var(--col)">UQ</text>')
};
const ai=b=>`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">${b}</svg>`;
const ALG={l:ai('<path d="M2.5 1.5v15" stroke="currentColor" stroke-width="1.4"/><rect x="4.5" y="4" width="10" height="3.5" fill="currentColor"/><rect x="4.5" y="10.5" width="6" height="3.5" fill="currentColor"/>'),
  c:ai('<path d="M9 1.5v15" stroke="currentColor" stroke-width="1.4"/><rect x="3" y="4" width="12" height="3.5" fill="currentColor" opacity=".85"/><rect x="5.5" y="10.5" width="7" height="3.5" fill="currentColor" opacity=".85"/>'),
  r:ai('<path d="M15.5 1.5v15" stroke="currentColor" stroke-width="1.4"/><rect x="3.5" y="4" width="10" height="3.5" fill="currentColor"/><rect x="7.5" y="10.5" width="6" height="3.5" fill="currentColor"/>'),
  t:ai('<path d="M1.5 2.5h15" stroke="currentColor" stroke-width="1.4"/><rect x="4" y="4.5" width="3.5" height="10" fill="currentColor"/><rect x="10.5" y="4.5" width="3.5" height="6" fill="currentColor"/>'),
  m:ai('<path d="M1.5 9h15" stroke="currentColor" stroke-width="1.4"/><rect x="4" y="3" width="3.5" height="12" fill="currentColor" opacity=".85"/><rect x="10.5" y="5.5" width="3.5" height="7" fill="currentColor" opacity=".85"/>'),
  b:ai('<path d="M1.5 15.5h15" stroke="currentColor" stroke-width="1.4"/><rect x="4" y="3.5" width="3.5" height="10" fill="currentColor"/><rect x="10.5" y="7.5" width="3.5" height="6" fill="currentColor"/>'),
  dh:ai('<rect x="1.5" y="5" width="3" height="8" fill="currentColor"/><rect x="7.5" y="5" width="3" height="8" fill="currentColor"/><rect x="13.5" y="5" width="3" height="8" fill="currentColor"/>'),
  dv:ai('<rect x="5" y="1.5" width="8" height="3" fill="currentColor"/><rect x="5" y="7.5" width="8" height="3" fill="currentColor"/><rect x="5" y="13.5" width="8" height="3" fill="currentColor"/>')};
// Viñetas pegadas desde Word (caracteres de la fuente Symbol que no se ven): se cambian por •
const fixBullets=s=>String(s||'').replace(/[\uF0A7\uF0B7\uF0D8\uF0FC\uF076\uF06E\uF0A8]/g,'•');
const umlMult=c=>c.mn==null||c.mx==null?'?':c.mx==='1'?(c.mn==='0'?'0..1':'1'):(c.mn==='0'?'0..*':'1..*');
// Solo el máximo (uno o muchos) cuando el mínimo está sin decidir
function markerMax(P,u,many){const n=[-u[1],u[0]],at=d=>[P[0]+u[0]*d,P[1]+u[1]*d],off=(p,k)=>[p[0]+n[0]*k,p[1]+n[1]*k];
  if(many){const A=at(14);return seg(A,off(P,7))+seg(A,P)+seg(A,off(P,-7));}const B=at(7);return seg(off(B,7),off(B,-7));}
const BO_ENDS=[['','?','Sin decidir'],['01','0..1','Cero o uno'],['11','1','Uno'],['0N','0..N','Cero o muchos'],['1N','1..N','Uno o muchos'],['?1','…1','Como mucho uno'],['?N','…N','Muchos']];
const skLabel=t=>({'11':'1:1','1N':'1:N','N1':'N:1','NM':'N:M'})[t]||'';
const lockIcon=(x,y)=>`<g class="lockic" transform="translate(${f1(x-6)},${f1(y-6)})"><circle cx="6" cy="6" r="8" class="lockbg"/><rect x="2.2" y="5.2" width="7.6" height="5.6" rx="1" class="lockfg"/><path d="M3.8 5.2V3.8a2.2 2.2 0 0 1 4.4 0v1.4" fill="none" class="locksh"/></g>`;
const attrIcon=a=>a.f.k?GL.key:a.f.p?GL.partial:a.f.m?GL.multi:a.f.d?GL.deriv:a.f.c?GL.comp:GL.attr;

/* ===================== Menú contextual ===================== */
function closeCtx(){const m=document.querySelector('.ctxmenu');if(m)m.remove();}
function openCtx(x,y,items){closeCtx();if(!items.length)return;
  const m=document.createElement('div');m.className='ctxmenu';m.setAttribute('role','menu');
  m.innerHTML=items.map((it,i)=>it.sep?'<div class="cx-sep" role="separator"></div>':it.row?`<div class="cx-row">${it.row.map((r,j)=>r.swatch?`<button class="cx-sw nc-${r.swatch}${r.on?' on':''}" data-r="${i}:${j}" title="${escA(r.title)}" aria-label="${escA(r.title)}"></button>`:`<button class="cx-ic" data-r="${i}:${j}" title="${escA(r.title)}" aria-label="${escA(r.title)}">${r.icon}</button>`).join('')}</div>`:
    `<button class="cx-it${it.danger?' danger':''}" role="menuitem" data-i="${i}"${it.disabled?' disabled':''}><span class="cx-ck">${it.check?'✓':''}</span><span class="cx-lb">${esc(it.label)}</span>${it.key?`<span class="cx-k">${esc(it.key)}</span>`:''}</button>`).join('');
  document.body.appendChild(m);
  const r=m.getBoundingClientRect();m.style.left=Math.min(x,window.innerWidth-r.width-6)+'px';m.style.top=Math.min(y,window.innerHeight-r.height-6)+'px';
  m.addEventListener('click',e=>{const b=e.target.closest('[data-i],[data-r]');if(!b||b.disabled)return;let fn;
    if(b.dataset.i!=null)fn=items[+b.dataset.i].fn;else{const [i,j]=b.dataset.r.split(':').map(Number);fn=items[i].row[j].fn;}closeCtx();fn&&fn();});
  m.addEventListener('contextmenu',e=>e.preventDefault());
  const first=m.querySelector('button:not([disabled])');if(first)first.focus({preventScroll:true});
  m.addEventListener('keydown',e=>{const bs=[...m.querySelectorAll('button:not([disabled])')],i=bs.indexOf(document.activeElement);
    if(e.key==='ArrowDown'){e.preventDefault();bs[(i+1)%bs.length].focus();}else if(e.key==='ArrowUp'){e.preventDefault();bs[(i-1+bs.length)%bs.length].focus();}
    else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeCtx();}});
}
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.ctxmenu'))closeCtx();},true);
window.addEventListener('blur',closeCtx);window.addEventListener('resize',closeCtx);

/* ===================== Editor ===================== */
class Editor{
  constructor(app){this.app=app;this.p=null;this.mode='er';this.selIds=new Set();this.selLink=null;this.connect=false;this.from=null;this.pend=null;this.hist=[];this.redo=[];this.editing=false;
    const st=typeof Settings!=='undefined'?Settings.get():{};this.showEnun=st.showEnun!==false;this.pinned=!!st.pinInsp;this.easy=!!st.easy;}
  get m(){return this.p[this.mode]}
  get isER(){return this.mode==='er'||this.mode==='bo'}
  get isBo(){return this.mode==='bo'}
  // Solo lectura: actividad terminada, o pestaña que no toca en la actividad
  get ro(){return !!(this.app&&this.app.isRO&&this.p&&this.app.isRO(this.p,this.mode));}
  get inAct(){return !!(this.p&&this.p.act);}
  // Notación del E-R: chen (rombos y óvalos), crow (pata de gallo) o uml. El boceto siempre es sencillo.
  get not(){return 'chen';}
  locked(n){return !!n&&(isNote(n)||!this.isER?!!n.lk:!!(n.f&&n.f.lock));}
  setLock(n,v){if(!n)return;if(isNote(n)||!this.isER){if(v)n.lk=1;else delete n.lk;}else{n.f=n.f||{};if(v)n.f.lock=true;else delete n.f.lock;}}
  mount(el){
    const sp=(n,lab)=>`<div class="split" data-split="${n}" role="separator" aria-orientation="vertical" aria-label="${lab}" tabindex="0" title="Arrastra para cambiar el ancho · doble clic para restablecer"></div>`;
    el.innerHTML=`<div class="ed-tools"></div>
      <div class="ed-main"><div class="ed-en"><p class="lbl">Enunciado</p>${hlBar(false)}<div class="hlwrap"><div class="hlback" aria-hidden="true"></div><textarea class="notes" id="sideenun" placeholder="Escribe o pega aquí el enunciado del ejercicio."></textarea></div></div>${sp('en','Ancho del enunciado')}
      <div class="ed-cvc"><div class="bo-zone" hidden><label class="lbl" for="botxt">Una por línea · entidad: <code>Entidad; atributo1, atributo2…</code> · relación: <code>Entidad1-Entidad2; atributo…</code> (atributos opcionales) · solo los nombres: la clave y el tipo se deciden en el E-R</label><textarea id="botxt" class="bo-txt" spellcheck="false" placeholder="Alumno; DNI, Nombre, FechaNac&#10;Curso; Codigo, Nombre&#10;Profesor; DNI, Nombre&#10;Alumno-Curso; FechaMatricula, Nota&#10;Profesor-Curso"></textarea></div>
      <div class="ed-cv"><svg role="img" aria-label="Lienzo"></svg><div class="zoombar" role="group" aria-label="Zoom"><button class="zb" data-zoom="out" title="Alejar" aria-label="Alejar">−</button><button class="zb zpct" data-zoom="reset" title="Volver al 100 %">100 %</button><button class="zb" data-zoom="in" title="Acercar" aria-label="Acercar">+</button><button class="zb" data-zoom="fit" title="Ver todo el diagrama">Ajustar</button></div></div></div>${sp('in','Ancho del panel')}<div class="ed-in"></div></div>
      <datalist id="types">${TYPES.map(t=>`<option value="${t}">`).join('')}</datalist>`;
    this.el=el;this.tools=el.querySelector('.ed-tools');this.main=el.querySelector('.ed-main');
    this.cv=el.querySelector('.ed-cv');this.svg=this.cv.querySelector('svg');this.insp=el.querySelector('.ed-in');this.enP=el.querySelector('.ed-en');this.enT=el.querySelector('#sideenun');
    el.addEventListener('click',e=>this.onClick(e));
    this.tools.addEventListener('pointerdown',e=>this.toolDrag(e));
    this.svg.addEventListener('pointerdown',e=>this.onDown(e));
    this.svg.addEventListener('pointermove',e=>this.onMove(e));
    this.svg.addEventListener('pointerup',e=>this.onUp(e));
    this.svg.addEventListener('pointercancel',e=>this.onUp(e));
    this.cv.addEventListener('contextmenu',e=>e.preventDefault());
    this.cv.addEventListener('wheel',e=>this.onWheel(e),{passive:false});
    this.cv.querySelector('.zoombar').addEventListener('click',e=>{const b=e.target.closest('[data-zoom]');if(!b)return;const k=b.dataset.zoom;
      if(k==='fit')this.fit();else if(k==='reset')this.zoomAt(1);else this.zoomAt(this.v.z*(k==='in'?1.2:1/1.2));});
    this._cw=this._ch=null;if(this._ro)this._ro.disconnect();if(window.ResizeObserver){this._ro=new ResizeObserver(()=>{const cw=this.cv.clientWidth,ch=this.cv.clientHeight;
      // al aparecer el panel la vista no se mueve; solo si lo seleccionado queda tapado, se desplaza lo justo
      const narrower=this._cw&&cw<this._cw;if(cw&&ch){this._cw=cw;this._ch=ch;}
      if(narrower&&this.p&&this.p._views)this.keepSelVisible();this.applyView();});this._ro.observe(this.cv);}
    this.insp.addEventListener('focusin',()=>{this.editing=false;});
    this.insp.addEventListener('input',e=>{const t=e.target;if(t.type==='checkbox'||t.tagName==='SELECT')return;if(!this.editing){this.snap();this.editing=true;}this.apply(t);this.save();this.render();this.markDup();});
    this.insp.addEventListener('change',e=>{const t=e.target;if(!(t.type==='checkbox'||t.tagName==='SELECT')||t.dataset.pendchk)return;this.snap();this.apply(t);this.save();this.render();this.renderInsp();});
    this.insp.addEventListener('keydown',e=>this.onInspKey(e));
    this._hlDraw=hlWire(this.enT,el.querySelector('.ed-en .hlback'),()=>this.p,()=>this.app.touch(this.p));
    hlBind(el.querySelector('.ed-en .hlbar'),this.enT,()=>this.p,()=>{this.app.touch(this.p);this._hlDraw();});
    this.enT.addEventListener('input',()=>{const v=fixBullets(this.enT.value);if(v!==this.enT.value){const c=this.enT.selectionStart;this.enT.value=v;this.enT.setSelectionRange(c,c);}this.p.enun=v;this.app.touch(this.p);});
    this.boZ=el.querySelector('.bo-zone');this.boT=el.querySelector('#botxt');
    this.boT.addEventListener('input',()=>{if(this.ro)return;clearTimeout(this._boT);this._boT=setTimeout(()=>this.boFromText(this.boT.value),350);});
    this.boT.addEventListener('blur',()=>{clearTimeout(this._boT);if(this.isBo&&this.p&&!this.ro){this.boFromText(this.boT.value);this._boEd=false;this.boSync();}});
  }
  open(p,mode){
    closeCtx();this.closeSearch&&this.cv&&this.closeSearch();
    if(this.p!==p){this.hist=[];this.redo=[];}
    this.p=p;this.mode=mode;this.selIds=new Set();this.selLink=null;this.connect=false;this.from=null;this.pend=null;
    p._views=p._views||{};const first=!p._views[mode];if(first)p._views[mode]={x:0,y:0,z:1};
    if(mode==='bo')this.boFix();this.boZ.hidden=mode!=='bo';this._boEd=false;this.boT.readOnly=this.ro;this.enT.readOnly=!!p.act;
    this.enP.hidden=!this.showEnun;this.main.classList.toggle('withenun',this.showEnun);this.enT.value=fixBullets(p.enun||'');if(this._hlDraw)this._hlDraw();
    this.renderTools();this.render();this.renderInsp();
    if(first){if(this.hasContent())this.fit(true);else this.centerView();}else this.applyView();
  }
  save(){this.app.touch(this.p);}
  plainM(){return cleanModel(this.m,this.mode);}
  snap(){this.hist.push({mode:this.mode,data:JSON.stringify(this.plainM())});if(this.hist.length>100)this.hist.shift();this.redo=this.redo.filter(h=>h.mode!==this.mode);}
  restore(stackFrom,stackTo){for(let k=stackFrom.length-1;k>=0;k--){if(stackFrom[k].mode===this.mode){const h=stackFrom.splice(k,1)[0];stackTo.push({mode:this.mode,data:JSON.stringify(this.plainM())});this.p[this.mode]=JSON.parse(h.data);this.selIds=new Set();this.selLink=null;this.pend=null;this.save();this.render();this.renderInsp();return true;}}return false;}
  undo(){if(!this.restore(this.hist,this.redo))toast('No hay nada que deshacer.');}
  redoIt(){if(!this.restore(this.redo,this.hist))toast('No hay nada que rehacer.');}

  /* ---------- Barra de herramientas ---------- */
  renderTools(){
    const B=(act,txt,cls='',ic='',tip='',pressed)=>`<button class="ebtn ${cls}" data-act="${act}"${tip?` title="${tip}"`:''}${pressed!=null?` aria-pressed="${pressed}"`:''}>${ic?GL[ic]:''}<span>${txt}</span></button>`;
    let h='<div class="tgroup">';const st=Settings.get();
    const act=!!(this.p&&this.p.act),CB=(a,txt,tip,fw)=>`<button class="ebtn ch${fw?'f':'b'}" data-act="${a}" title="${tip}">${fw?'':GL.back}<span>${txt}</span>${fw?GL.fwd:''}</button>`,
      CH=(b,f)=>act&&!(f&&/bo2er/.test(f))?'':`</div><div class="tgroup chain" role="group" aria-label="Pasar entre diagramas">${act?'':b}${f}`,
      ERDP=act?'':`</div><div class="tgroup erdp" role="group" aria-label="ERDPlus"><span class="tlab">ERDPlus</span>${B('erdplus','Exportar','','copy','Guarda tu E-R en un archivo .erdplus que se abre en erdplus.com')}${B('erdplus-import','Importar','','open','Abre un archivo .erdplus y lo pasa a tu E-R')}`;
    if(this.isBo) h+=B('ent','Entidad','tool','ent','Pulsa para añadir una entidad, o arrástrala hasta donde la quieras')+B('connect','Unir','tool','sk','Une dos entidades con una línea (también: Mayús + clic)',this.connect)+B('note','Nota','tool','note','Pulsa para añadir una nota, o arrástrala hasta donde la quieras')+'</div><div class="tgroup">'+B('distribute','Distribuir','','dist','Ordena las entidades para que las líneas se crucen lo menos posible')+CH('',CB('bo2er','Pasar al E-R','Crea en el E-R las entidades que falten y una relación por cada línea, para terminarlas allí',1));
    else if(this.isER) h+=B('ent','Entidad','tool','ent','Pulsa para añadir una entidad, o arrástrala hasta donde la quieras')+B('rel','Relación','tool','rel','Pulsa para añadir una relación, o arrástrala hasta donde la quieras')+B('attr','Atributo','tool','attr','Pulsa para añadir un atributo a lo seleccionado, o arrástralo encima de una entidad')+B('connect','Unir','tool','link','Une dos elementos (también: Mayús + clic)',this.connect)+(st.showIsa!==false?B('isa','Jerarquía','tool','isa','Generalización / especialización (ISA): pulsa con el supertipo seleccionado, o arrastra el triángulo encima de él'):'')+B('note','Nota','tool','note','Pulsa para añadir una nota, o arrástrala hasta donde la quieras')+'</div><div class="tgroup">'+B('distribute','Distribuir','','dist','Coloca entidades, relaciones y atributos para que se vean bien')+ERDP+CH(CB('er2bo','Actualizar el boceto','Añade al boceto las entidades, atributos y líneas del E-R que le falten (no borra nada)'),CB('er2rel','Pasar al relacional','Va al relacional y crea las tablas a partir de este E-R',1));
    else h+=B('table','Tabla','tool','table','Pulsa para añadir una tabla, o arrástrala hasta donde la quieras')+B('relate','Relacionar','tool','relate','Relaciona dos tablas (también: Mayús + clic)',this.connect)+B('note','Nota','tool','note','Pulsa para añadir una nota, o arrástrala hasta donde la quieras')+'</div><div class="tgroup">'+B('distribute','Distribuir','','dist','Ordena las tablas: arriba las que no dependen de nadie y debajo las que les apuntan con su clave ajena')+'</div><div class="tgroup">'+B('fromer','Traer de mi E-R','','fromer','Crea aquí las tablas a partir del E-R')+(this.mode==='ded'?B('copyrel','Traer mi relacional','','copy','Copia aquí las tablas del relacional'):'')+B('easy','Modo fácil','toggle','easy','Activado: al pasar desde el E-R también se pasan las relaciones (claves ajenas y tablas N:M)',this.easy)+(this.mode==='rel'?ERDP+CH(CB('rel2er','Actualizar el E-R','Crea en el E-R las entidades, atributos y relaciones que falten a partir de estas tablas'),CB('rel2ded','Pasar al DED','Va al DED y copia allí estas tablas',1)):CH(CB('ded2rel','Actualizar el relacional','Copia estas tablas (con sus claves ajenas) al relacional'),CB('ded2sql','Pasar al SQL','Va al SQL y genera el script a partir de este DED',1)));
    const dfo=this.app&&this.app.diff&&this.app.diff.p===this.p;
    h+=`</div><div class="tgroup">${B('clear','Vaciar '+VIEWS[this.mode],'danger','clear','Borra todo este diagrama')}</div><span class="tspace"></span>${B('find','Buscar','','find','Buscar en el diagrama (Ctrl+F)')}${dfo?`<button class="ebtn dfchip" data-act="cleardiff" title="Verde: solo en el tuyo · ámbar: distinto. Pulsa para quitar las marcas.">Comparando con «${esc(this.app.diff.with)}» ✕</button>`:''}${B('toggleenun','Enunciado','','enun','Mostrar u ocultar el enunciado',this.showEnun)}`;
    if(this.ro)h=`<div class="tgroup"><span class="tnote rotag">${GL.lock} Solo lectura${this.p.act&&this.p.act.state==='over'?': se acabó el tiempo de la actividad':this.p.act&&this.p.act.state==='ready'?': pulsa «Empezar» para comenzar la actividad':': esta parte no hay que hacerla en la actividad'}</span></div><span class="tspace"></span>${B('find','Buscar','','find','Buscar en el diagrama (Ctrl+F)')}${B('toggleenun','Enunciado','','enun','Mostrar u ocultar el enunciado',this.showEnun)}`;
    this.tools.innerHTML=h;
    if(this.inAct)this.tools.querySelectorAll('[data-act=fromer],[data-act=copyrel],[data-act=easy],[data-act=bo2er]').forEach(b=>b.remove());
    this.tools.querySelectorAll('[data-tsel]').forEach(sel=>sel.addEventListener('change',()=>{Settings.set(sel.dataset.tsel,sel.value);this.renderTools();this.render();this.renderInsp();}));
  }
  /* ---------- Vista: zoom y desplazamiento ---------- */
  pt(e){const p=this.svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(this.svg.getScreenCTM().inverse());}
  get v(){return this.p._views[this.mode];}
  hasContent(){return this.items().length>0;}
  viewSize(){const cw=this.cv.clientWidth||800,ch=this.cv.clientHeight||600;return{w:cw/this.v.z,h:ch/this.v.z};}
  clampView(){const v=this.v,s=this.viewSize(),m=400;v.x=Math.min(W-s.w+m,Math.max(-m,v.x));v.y=Math.min(H-s.h+m,Math.max(-m,v.y));if(s.w>W+2*m)v.x=(W-s.w)/2;if(s.h>H+2*m)v.y=(H-s.h)/2;}
  applyView(){if(!this.p||!this.svg||!this.p._views)return;this.clampView();const v=this.v,s=this.viewSize();this.svg.setAttribute('viewBox',`${f1(v.x)} ${f1(v.y)} ${f1(s.w)} ${f1(s.h)}`);
    const z=this.cv.querySelector('.zpct');if(z)z.textContent=Math.round(v.z*100)+' %';
    const t=this.svg.querySelector('.emp');if(t){t.setAttribute('x',f1(v.x+s.w/2));t.setAttribute('y',f1(v.y+s.h/2));}}
  keepSelVisible(){const ids=[...this.selIds];if(!ids.length)return;const v=this.v,s=this.viewSize(),pad=30/v.z;
    const bs=ids.map(id=>this.node(id)).filter(Boolean).map(n=>this.boxOf(n));if(!bs.length)return;
    const x1=Math.max(...bs.map(b=>b[2])),x0=Math.min(...bs.map(b=>b[0]));
    if(x1+pad>v.x+s.w)v.x=Math.min(x0-pad,x1+pad-s.w);}
  centerView(){const v=this.v;v.z=1;const s=this.viewSize();v.x=W/2-s.w/2;v.y=H/2-s.h/2;this.applyView();}
  zoomAt(z,cx,cy){const v=this.v,r=this.cv.getBoundingClientRect();if(cx==null){cx=r.left+r.width/2;cy=r.top+r.height/2;}
    const px=v.x+(cx-r.left)/v.z,py=v.y+(cy-r.top)/v.z;v.z=Math.min(ZMAX,Math.max(ZMIN,z));v.x=px-(cx-r.left)/v.z;v.y=py-(cy-r.top)/v.z;this.applyView();}
  boxOf(n){if(isNote(n)){noteSize(n);return[n.x,n.y,n.x+n.w,n.y+n.h];}if(this.isER){this.size(n);return[n.x-n.w/2,n.y-n.h/2,n.x+n.w/2,n.y+n.h/2];}
    return this.mode==='ded'?[n.x,n.y,n.x+(n.w||180),n.y+(n.h||80)]:[n.x,n.y,n.x+(n.rw||160),n.y+18+(n.rh||60)];}
  bbox(){const arr=this.items();if(!arr.length)return null;const bs=arr.map(n=>this.boxOf(n));return[Math.min(...bs.map(b=>b[0])),Math.min(...bs.map(b=>b[1])),Math.max(...bs.map(b=>b[2])),Math.max(...bs.map(b=>b[3]))];}
  fit(maxOne){const b=this.bbox();if(!b){this.centerView();return;}
    const pad=90,cw=this.cv.clientWidth||800,ch=this.cv.clientHeight||600,bw=b[2]-b[0]+2*pad,bh=b[3]-b[1]+2*pad;
    let z=Math.min(cw/bw,ch/bh);z=Math.min(maxOne?1:1.5,Math.max(ZMIN,z));const v=this.v;v.z=z;v.x=(b[0]+b[2])/2-cw/z/2;v.y=(b[1]+b[3])/2-ch/z/2;this.applyView();}
  onWheel(e){e.preventDefault();closeCtx();if(!this.p)return;const k=(e.deltaMode===1?0.05:e.deltaMode===2?1:0.0016)*({slow:0.55,normal:1,fast:1.7}[Settings.get().zoomSpeed]||1);this.zoomAt(this.v.z*Math.exp(-e.deltaY*k),e.clientX,e.clientY);}
  viewCenter(){const j=()=>Math.round((Math.random()-.5)*60),v=this.v,s=this.viewSize();return{x:Math.round(Math.min(W-150,Math.max(150,v.x+s.w/2+j()))),y:Math.round(Math.min(H-120,Math.max(90,v.y+s.h/2+j())))};}

  freeSpot(w,h){ // busca un hueco libre cerca del centro de la vista (centro del elemento)
    const c=this.viewCenter(),arr=this.isER?this.m.nodes:this.m.t,bs=arr.map(n=>this.boxOf(n)),m=36;
    const free=(x,y)=>!bs.some(b=>x-w/2-m<b[2]&&x+w/2+m>b[0]&&y-h/2-m<b[3]&&y+h/2+m>b[1]);
    if(free(c.x,c.y))return c;
    for(let r=1;r<40;r++)for(let k=0;k<8*r;k++){const a=k/(8*r)*2*Math.PI,x=Math.round(c.x+Math.cos(a)*r*70),y=Math.round(c.y+Math.sin(a)*r*45);if(free(x,y))return{x,y};}
    return c;}
  /* ---------- Modelo ---------- */
  get notes(){return this.m.notes||(this.m.notes=[]);}
  items(){return [...(this.isER?this.m.nodes.filter(n=>this.not==='chen'||!isAtt(n)):this.m.t),...this.notes];}
  node(id){return (this.isER?this.m.nodes:this.m.t).find(n=>n.id===id)||this.notes.find(n=>n.id===id);}
  X(){return erIdx(this.m);}
  size(n,X){n.f=n.f||{};const nt=this.not;
    if(isEnt(n)&&this.isBo){n.w=Math.max(110,String(n.n).length*7.8+34);n.h=40;n.rows=null;} // en el boceto solo el nombre: los atributos están en el texto de arriba
    else if(isEnt(n)){if(nt==='chen'){n.w=Math.max(110,String(n.n).length*7.8+34);n.h=40;n.rows=null;}
      else{const rows=this.rowsOf(n,X);n.rows=rows;n.w=Math.max(120,String(n.n).length*7.8+34,...rows.map(r=>r.t.length*6.9+(nt==='crow'?46:26)));n.h=30+Math.max(1,rows.length)*17+6;}}
    else if(isRel(n)){if(nt==='chen'){n.w=Math.max(96,String(n.n).length*7.6+40);n.h=48;n.rows=null;if(n.f.as){n.w+=28;n.h=70;}}
      else{const rows=this.rowsOf(n,X);n.rows=rows;const nm=String(n.n).length*7.4+24;
        if(nt==='uml'&&!rows.length){const k=(X||this.X()).ends(n).length;if(k>=3){n.w=Math.max(44,nm);n.h=44;}else{n.w=Math.max(40,nm);n.h=22;}}
        else{n.w=Math.max(70,nm,...rows.map(r=>r.t.length*6.9+24));n.h=rows.length?26+rows.length*17+6:26;}}}
    else if(isIsa(n)){n.w=56;n.h=44;}
    else {n.lab=(n.f.c?'( '+n.n+' )':n.n)+(n.f.o?' (O)':'');n.rx=rxOf(n.lab);n.w=2*n.rx;n.h=26;}}
  // Filas de atributos dentro de la caja (pata de gallo y UML)
  rowsOf(o,X){X=X||this.X();const nt=this.not,out=[];
    const lab=a=>{let s=(a.f.d?'/':'')+a.n;if(a.f.m)s+=nt==='uml'?' [*]':' {M}';if(a.f.o)s+=nt==='uml'?' [0..1]':' (O)';return s;};
    const add=(a,dep)=>{out.push({id:a.id,t:(dep?'  · ':'')+lab(a),k:!!a.f.k,p:!!a.f.p&&!a.f.k,dep});if(a.f.c)X.attrsOf(a).forEach(x=>add(x,dep+1));};
    [...X.attrsOf(o)].sort((a,b)=>((b.f.k||b.f.p)?1:0)-((a.f.k||a.f.p)?1:0)).forEach(a=>add(a,0));return out;}
  uniqueName(base,list){const set=new Set(list.map(lc));if(!set.has(lc(base)))return base;let i=2;while(set.has(lc(base+i)))i++;return base+i;}
  placeAttr(owner,nn){
    this.m.nodes.forEach(n=>this.size(n));const X=this.X();
    const others=this.m.nodes.filter(n=>n!==nn&&n.x>-5000);
    const dirs=X.linksOf(owner.id).map(l=>X.other(l,owner.id)).filter(n=>n&&!isAtt(n)).map(n=>Math.atan2(n.y-owner.y,n.x-owner.x));
    if(isAtt(owner)){const par=X.ownerOf(owner);if(par)dirs.push(Math.atan2(par.y-owner.y,par.x-owner.x));}
    const angd=(a,b)=>{let d=Math.abs(a-b)%(2*Math.PI);return d>Math.PI?2*Math.PI-d:d;};
    let best=null;
    for(let ring=0;ring<5;ring++)for(let k=0;k<24;k++){
      const a=-Math.PI/2+k*Math.PI/12;
      const x=owner.x+Math.cos(a)*(owner.w/2+nn.rx+24+ring*46), y=owner.y+Math.sin(a)*(owner.h/2+13+28+ring*30);
      if(x-nn.rx<6||x+nn.rx>W-6||y<20||y>H-20)continue;
      if(others.some(o=>Math.abs(x-o.x)<(nn.w+o.w)/2+10&&Math.abs(y-o.y)<(26+o.h)/2+8))continue;
      const away=dirs.length?Math.min(...dirs.map(d=>angd(a,d))):Math.PI;
      const sc=ring*1.6+(away<0.6?3:0)-away*0.5;
      if(!best||sc<best.sc)best={x,y,sc};
    }
    if(!best)best={x:owner.x,y:owner.y-70};
    nn.x=Math.round(best.x);nn.y=Math.round(best.y);
  }
  addAttr(owner,focus=true){
    if(!owner)return;this.snap();const X=this.X();
    const nn={id:uid(),k:'attr',n:this.uniqueName(LANG()==='en'?'attribute':'atributo',X.attrsOf(owner).map(a=>a.n)),x:owner.x,y:owner.y,f:{}};this.size(nn);
    this.m.nodes.push(nn);this.m.links.push({id:uid(),a:owner.id,b:nn.id,c:null,mn:null,mx:null});
    if(isAtt(owner))owner.f.c=true;
    this.placeAttr(owner,nn);this.save();
    this.selIds=new Set([nn.id]);this.selLink=null;this.render();this.renderInsp();
    if(focus)this.focusName();
  }
  /* ---------- Relaciones entre tablas (flecha del relacional / línea del DED) ---------- */
  fkSel(){if(!this.selLink||this.isER)return null;const i=this.selLink.lastIndexOf('|'),tid=this.selLink.slice(0,i),pn=this.selLink.slice(i+1);
    const t=this.m.t.find(x=>x.id===tid),pa=this.m.t.find(x=>x.n===pn);if(!t||!pa)return null;const cols=t.c.filter(c=>parseF(c[2]).fk===pn);return cols.length?{t,pa,cols}:null;}
  fkRemove(){const s=this.fkSel();if(!s)return null;const fl=parseF(s.cols[0][2]);
    s.t.c=s.t.c.filter(c=>{const f=parseF(c[2]);if(f.fk!==s.pa.n)return true;if(f.pk){delete f.fk;c[2]=joinF(f);return true;}return false;});return fl;}
  fkAct(k){const s=this.fkSel();if(!s){this.selLink=null;this.renderInsp();return;}
    if(k==='del'){this.snap();this.fkRemove();this.selLink=null;this.save();this.render();this.renderInsp();toast(`Relación quitada: «${s.t.n}» ya no apunta a «${s.pa.n}».`);return;}
    if(k==='swap'){const pk=s.t.c.filter(c=>parseF(c[2]).pk&&parseF(c[2]).fk!==s.pa.n);
      if(!pk.length){toast(`«${s.t.n}» no tiene una clave primaria propia que pasar a «${s.pa.n}».`,'warn');return;}
      this.snap();const fl=this.fkRemove(),uniq=(t,n)=>{let x=n,i=2;while(t.c.some(c=>lc(c[0])===lc(x)))x=n+'_'+i++;return x;};
      pk.forEach(c=>{let name=c[0];if(s.pa.c.some(x=>lc(x[0])===lc(name)))name=uniq(s.pa,c[0]+'_'+s.t.n);s.pa.c.push([name,c[1],joinF({nul:fl.nul?1:0,uq:fl.uq&&pk.length===1?1:0,fk:s.t.n})]);});
      this.selLink=s.pa.id+'|'+s.t.n;this.save();this.render();this.renderInsp();toast(`Ahora la FK está en «${s.pa.n}» y apunta a «${s.t.n}».`);return;}
    if(['nul','uq','pk'].includes(k)){this.snap();const on=!s.cols.every(c=>parseF(c[2])[k]);s.cols.forEach(c=>{const f=parseF(c[2]);if(on)f[k]=1;else delete f[k];if(k==='pk'&&on)delete f.nul;if(k==='nul'&&on)delete f.pk;c[2]=joinF(f);});
      this.save();this.render();this.renderInsp();}}
  fkSet(k,on){const s=this.fkSel();if(!s)return;this.snap();s.cols.forEach(c=>{const f=parseF(c[2]);if(on)f[k]=1;else delete f[k];if(k==='pk'&&on)delete f.nul;if(k==='nul'&&on)delete f.pk;if(k==='uq'&&on&&s.cols.length>1)delete f.uq;c[2]=joinF(f);});
    if(k==='uq'&&on&&s.cols.length>1)toast('Con una FK de varias columnas, la 1:1 se marca con UNIQUE en el SQL.','warn');this.save();this.render();this.renderInsp();}
  toggleAssoc(n){this.snap();if(n.f.as){const X=this.X(),bad=X.linksOf(n.id).filter(l=>isRel(X.other(l,n.id)));if(bad.length){this.m.links=this.m.links.filter(l=>!bad.includes(l));toast(`Se han quitado ${bad.length} línea(s) que la unían a otras relaciones.`);}delete n.f.as;}else n.f.as=1;this.save();this.render();this.renderInsp();}
  connectNodes(aId,bId){
    if(aId===bId)return;if(isNote(this.node(aId))||isNote(this.node(bId))){toast('Las notas no se unen a nada: son solo para apuntar cosas.');return;}const A=this.node(aId),B=this.node(bId);if(!A||!B)return;const L=this.m.links;
    if(this.isBo){if(!isEnt(A)||!isEnt(B))return;if(L.some(l=>(l.a===aId&&l.b===bId)||(l.a===bId&&l.b===aId))){toast('Esas dos entidades ya están unidas.');return;}
      this.snap();const l={id:uid(),a:aId,b:bId,c:null,mn:null,mx:null};L.push(l);this.save();this.selIds=new Set();this.selLink=l.id;this.render();this.renderInsp();return;}
    if(isIsa(A)||isIsa(B)){const i=isIsa(A)?A:B,e=isIsa(A)?B:A;
      if(!isEnt(e)){toast('Una jerarquía solo se une a entidades.','warn');return;}
      if(L.some(l=>(l.a===i.id&&l.b===e.id)||(l.a===e.id&&l.b===i.id))){toast('Esos dos elementos ya están unidos.');return;}
      const X=this.X();this.snap();const sup=!X.superOf(i)&&e.y<i.y;L.push({id:uid(),a:i.id,b:e.id,c:null,mn:null,mx:null,...(sup?{sup:1}:{})});
      this.save();this.selIds=new Set([i.id]);this.selLink=null;this.render();this.renderInsp();
      toast(sup?`«${e.n}» es el supertipo de la jerarquía.`:`«${e.n}» es un subtipo.`);return;}
    if(isRel(A)&&isRel(B)&&!(isAssoc(A)!==isAssoc(B))){toast(isAssoc(A)?'No se pueden unir dos entidades asociativas directamente: ponles una relación en medio.':'No se pueden unir dos relaciones entre sí.','warn');return;}
    const asEnt=n=>isEnt(n)||(isAssoc(n)&&this.X().ends(n).length>=2);
    if(asEnt(A)&&asEnt(B)&&!(isAssoc(A)&&isEnt(B)&&this.X().ends(A).length<2)){ // dos entidades: se crea la relación en medio
      this.snap();const r={id:uid(),k:'rel',n:this.uniqueName(LANG()==='en'?'relationship':'relacion',this.m.nodes.filter(isRel).map(x=>x.n)),x:Math.round((A.x+B.x)/2),y:Math.round((A.y+B.y)/2),f:{}};
      if(Math.hypot(A.x-B.x,A.y-B.y)<260){r.y+=90;}
      this.m.nodes.push(r);L.push({id:uid(),a:r.id,b:A.id,c:null,mn:null,mx:null},{id:uid(),a:r.id,b:B.id,c:null,mn:null,mx:null});
      this.save();this.selIds=new Set([r.id]);this.selLink=null;this.render();this.renderInsp();this.focusName();return;}
    if(L.some(l=>(l.a===aId&&l.b===bId)||(l.a===bId&&l.b===aId))){toast('Esos dos elementos ya están unidos.');return;}
    const X=this.X();let a=aId,b=bId;
    if(isAtt(A)||isAtt(B)){
      if(isAtt(A)&&isAtt(B)){a=aId;b=bId;}else{const at=isAtt(A)?A:B,ow=isAtt(A)?B:A;a=ow.id;b=at.id;}
      const child=this.node(b);if(X.ownerOf(child)){toast(`«${child.n}» ya pertenece a «${X.ownerOf(child).n}». Bórralo de ahí antes.`,'warn');return;}
      this.snap();if(isAtt(this.node(a)))this.node(a).f.c=true;L.push({id:uid(),a,b,c:null,mn:null,mx:null});this.save();this.selIds=new Set([b]);this.render();this.renderInsp();return;}
    // relación con entidad
    this.snap();const pr=pairRE(A,B)||[isRel(A)?A:B,isRel(A)?B:A],r=pr[0],e=pr[1];L.push({id:uid(),a:r.id,b:e.id,c:null,mn:null,mx:null});this.save();this.selIds=new Set([r.id]);this.selLink=null;this.render();this.renderInsp();
  }
  startRelate(aId,bId){if(aId===bId)return;if(isNote(this.node(aId))||isNote(this.node(bId))){toast('Las notas no se unen a nada: son solo para apuntar cosas.');return;}this.pend={a:aId,b:bId,dir:'ab',type:'1N',req:true,ident:false,...(this.mode==='ded'?{ca:{},cb:{},line:'dash'}:{})};this.selIds=new Set([aId,bId]);this.selLink=null;this.connect=false;this.from=null;this.renderTools();this.render();this.renderInsp();}
  createRelation(){
    const P=this.pend;if(!P)return;const A=this.node(P.a),B=this.node(P.b);if(!A||!B){this.pend=null;this.renderInsp();return;}
    if(P.ca){const r=dedPlan(P);if(!r){toast('Faltan cardinalidades: elige máximo y mínimo en las dos preguntas.','warn');return;}Object.assign(P,r);}
    const parent=P.dir==='ab'?A:B,child=P.dir==='ab'?B:A;const pkOf=t=>t.c.filter(c=>parseF(c[2]).pk);
    const uniq=(t,n)=>{let x=n,i=2;while(t.c.some(c=>lc(c[0])===lc(x)))x=n+'_'+i++;return x;};
    if(P.type==='NM'){
      if(!pkOf(A).length||!pkOf(B).length){toast(`Las dos tablas necesitan clave primaria (PK).`,'warn');return;}
      this.snap();const t={id:uid(),n:this.uniqueName(A.n+'_'+B.n,this.m.t.map(x=>x.n)),x:Math.round((A.x+B.x)/2),y:Math.round(Math.max(A.y,B.y)+160),c:[]};
      [A,B].forEach(par=>pkOf(par).forEach(c=>t.c.push([uniq(t,c[0]),c[1],joinF({pk:1,fk:par.n})])));
      this.m.t.push(t);this.pend=null;this.save();this.selIds=new Set([t.id]);this.render();this.renderInsp();toast(`Tabla «${t.n}» creada con las dos claves.`);return;}
    const pk=pkOf(parent);if(!pk.length){toast(`«${parent.n}» no tiene clave primaria. Marca primero su PK.`,'warn');return;}
    this.snap();pk.forEach(c=>{let name=c[0];if(child.c.some(x=>lc(x[0])===lc(name)))name=uniq(child,c[0]+'_'+parent.n);
      child.c.push([name,c[1],joinF({pk:P.ident?1:0,uq:(P.type==='11'&&!P.ident&&pk.length===1)?1:0,nul:P.req||P.ident?0:1,fk:parent.n})]);});
    this.pend=null;this.save();this.selIds=new Set([child.id]);this.render();this.renderInsp();toast(`«${child.n}» recibe la clave de «${parent.n}».`);
  }
  create(a,pos,target){
    if(a==='attr'&&!pos){const one=this.single();if(one&&this.isER){this.addAttr(one);return;}}
    if(a==='attr'&&target&&(isEnt(target)||isRel(target)||isAtt(target))){ // soltado encima de algo: se une a ello
      this.snap();const X=this.X();const nn={id:uid(),k:'attr',n:this.uniqueName('atributo',X.attrsOf(target).map(x=>x.n)),x:Math.round(pos.x),y:Math.round(pos.y),f:{}};this.size(nn);
      this.m.nodes.push(nn);this.m.links.push({id:uid(),a:target.id,b:nn.id,c:null,mn:null,mx:null});if(isAtt(target))target.f.c=true;
      this.placeAttr(target,nn);this.save();this.selIds=new Set([nn.id]);this.selLink=null;this.render();this.renderInsp();this.focusName();return;}
    if(a==='isa'){const sup=target&&isEnt(target)?target:(!pos&&this.single()&&isEnt(this.single())?this.single():null);this.snap();
      const c=sup?{x:sup.x,y:sup.y+(sup.h||40)/2+70}:(pos||this.freeSpot(60,50));const i={id:uid(),k:'isa',n:'',x:Math.round(c.x),y:Math.round(c.y),f:{tot:false,dis:true,map:'each'}};
      this.m.nodes.push(i);if(sup)this.m.links.push({id:uid(),a:i.id,b:sup.id,c:null,mn:null,mx:null,sup:1});
      this.save();this.selIds=new Set([i.id]);this.selLink=null;this.render();this.renderInsp();
      toast(sup?`Jerarquía de «${sup.n}». Ahora une los subtipos al triángulo (Mayús+clic) o usa «Añadir subtipo».`:'Une el triángulo a la entidad de arriba (supertipo) y después a los subtipos.');return;}
    if(a==='note'){this.snap();const c=pos||this.freeSpot(180,50);const n={id:uid(),k:'note',x:Math.round(c.x-90),y:Math.round(c.y-23),w:180,c:'y',text:''};
      this.notes.push(n);this.save();this.selIds=new Set([n.id]);this.selLink=null;this.render();this.renderInsp();this.focusName();return;}
    this.snap();
    if(a==='table'){const c=pos||this.freeSpot(180,90);const en=LANG()==='en',t={id:uid(),n:this.uniqueName(en?'table':'tabla',this.m.t.map(x=>x.n)),x:Math.round(c.x-90),y:Math.round(c.y-(pos?14:60)),c:[[en?'Id':'Cod','INT','pk']]};
      this.m.t.push(t);this.save();this.selIds=new Set([t.id]);this.selLink=null;this.render();this.renderInsp();this.focusName();return;}
    const c=pos||this.freeSpot(a==='attr'?100:130,a==='attr'?30:50);
    const list=a==='attr'?[]:this.m.nodes.filter(a==='ent'?isEnt:isRel).map(x=>x.n);
    const en=LANG()==='en',n={id:uid(),k:a,n:a==='attr'?(en?'attribute':'atributo'):this.uniqueName(a==='ent'?(en?'entity':'entidad'):(en?'relationship':'relacion'),list),x:Math.round(c.x),y:Math.round(c.y),f:{}};
    this.m.nodes.push(n);this.save();this.selIds=new Set([n.id]);this.selLink=null;this.render();this.renderInsp();this.focusName();
  }
  // Arrastrar un botón (Entidad, Relación, Atributo, Tabla) hasta el lienzo
  toolDrag(e){
    const b=e.target.closest('.ebtn.tool[data-act]');if(!b||e.button!==0||this.ro)return;const a=b.dataset.act;if(!['ent','rel','attr','table','note','isa'].includes(a))return;
    const st={x0:e.clientX,y0:e.clientY,moving:false,g:null};
    const inCv=ev=>{const r=this.cv.getBoundingClientRect();return ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom;};
    const mv=ev=>{
      if(!st.moving){if(Math.hypot(ev.clientX-st.x0,ev.clientY-st.y0)<6)return;st.moving=true;
        st.g=document.createElement('div');st.g.className='dragghost';st.g.innerHTML=b.innerHTML;document.body.appendChild(st.g);document.body.classList.add('tooldrag');}
      st.g.style.left=ev.clientX+'px';st.g.style.top=ev.clientY+'px';st.g.classList.toggle('ok',inCv(ev));};
    const up=ev=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
      if(!st.moving)return;st.g.remove();document.body.classList.remove('tooldrag');
      this._noClick=true;setTimeout(()=>{this._noClick=false;},0);
      if(ev.type==='pointercancel'||!inCv(ev))return;
      const hit=document.elementFromPoint(ev.clientX,ev.clientY),g=hit&&hit.closest&&hit.closest('.ed-cv svg [data-id]');
      this.create(a,this.pt(ev),g&&this.isER?this.node(g.dataset.id):null);};
    window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  }
  onClick(e){
    if(this._noClick)return;
    const sg=e.target.closest('[data-card]');if(sg){const l=this.m.links.find(x=>x.id===sg.dataset.link);if(!l)return;this.snap();const cur=mmOf(l);cur[sg.dataset.card]=sg.dataset.v;l.mn=cur.mn;l.mx=cur.mx;l.c=(cur.mn!=null&&cur.mx!=null)?`(${cur.mn},${cur.mx})`:null;this.save();this.render();this.renderInsp();return;}
    const pc=e.target.closest('[data-pendc]');if(pc&&this.pend&&this.pend.ca){const c=this.pend['c'+pc.dataset.pendc],k=pc.dataset.k;c[k]=c[k]===pc.dataset.v?undefined:pc.dataset.v;this.renderInsp();return;}
    const pd=e.target.closest('[data-pend]');if(pd&&this.pend){const k=pd.dataset.pend,v=pd.dataset.v;if(k==='create'){this.createRelation();return;}if(k==='cancel'){this.pend=null;this.renderInsp();this.render();return;}this.pend[k]=k==='req'||k==='ident'?!this.pend[k]:v;this.renderInsp();return;}
    const io=e.target.closest('[data-isa]');if(io){const i=this.single();if(!isIsa(i))return;this.snap();const k=io.dataset.isa,v=io.dataset.v;
      if(k==='sup'){const X=this.X();X.linksOf(i.id).forEach(l=>{if(X.other(l,i.id).id===v)l.sup=1;else delete l.sup;});}
      else i.f[k]=v==='1'?true:v==='0'?false:v;this.save();this.render();this.renderInsp();return;}
    const fs=e.target.closest('[data-fkset]');if(fs){this.fkSet(fs.dataset.fkset,fs.dataset.v==='1');return;}
    const fa=e.target.closest('[data-fkact]');if(fa){this.fkAct(fa.dataset.fkact);return;}
    const bc=e.target.closest('[data-bocard]');if(bc){const l=this.m.links.find(x=>x.id===this.selLink);if(!l)return;this.snap();const k='e'+bc.dataset.bocard,v=(l[k]||'??').split('');
      const i=bc.dataset.k==='mn'?0:1;v[i]=v[i]===bc.dataset.v?'?':bc.dataset.v;const s=v.join('');if(s==='??')delete l[k];else l[k]=s;this.save();this.render();this.renderInsp();return;}
    const be=e.target.closest('[data-boe]');if(be){const l=this.m.links.find(x=>x.id===this.selLink);if(!l)return;this.snap();const k='e'+be.dataset.boe;if(be.dataset.v)l[k]=be.dataset.v;else delete l[k];this.save();this.render();this.renderInsp();return;}
    const sk=e.target.closest('[data-skt]');if(sk){const l=this.m.links.find(x=>x.id===this.selLink);if(!l)return;this.snap();if(sk.dataset.skt)l.t=sk.dataset.skt;else delete l.t;this.save();this.render();this.renderInsp();return;}
    const nc=e.target.closest('[data-ncol],[data-nw]');if(nc){const n=this.single();if(!isNote(n))return;this.snap();if(nc.dataset.ncol)n.c=nc.dataset.ncol;else n.w=+nc.dataset.nw;this.save();this.render();this.renderInsp();return;}
    const al=e.target.closest('[data-align]');if(al){this.align(al.dataset.align);return;}
    const go=e.target.closest('[data-goto]');if(go){this.selIds=new Set([go.dataset.goto]);this.selLink=null;this.render();this.renderInsp();return;}
    const b=e.target.closest('button[data-act]');if(!b||!this.el.contains(b))return;const a=b.dataset.act;
    if(a==='toggleenun'){this.showEnun=!this.showEnun;Settings.set('showEnun',this.showEnun);b.setAttribute('aria-pressed',String(this.showEnun));this.enP.hidden=!this.showEnun;this.main.classList.toggle('withenun',this.showEnun);return;}
    if(a==='pin'){Settings.set('pinInsp',!this.pinned);return;}
    if(a==='easy'){Settings.set('easy',!this.easy);toast(this.easy?'Modo fácil activado: también se pasan las relaciones.':'Modo fácil desactivado: solo entidades y atributos.');return;}
    if(a==='ent'||a==='rel'||a==='attr'||a==='note'||a==='isa'){this.create(a);return;}
    if(a==='bo2er'){this.boToER();return;}
    if(a==='addsub'){const i=this.single();if(isIsa(i))this.addSubtype(i);return;}
    if(a==='mkrel'){this.relBetween();return;}
    if(a==='lock'){this.toggleLock();return;}
    if(a==='cleardiff'){this.app.clearDiff();return;}
    if(a==='addattr'){const one=this.single();if(!one)return;const X=this.X();const owner=isAtt(one)&&!one.f.c&&X.ownerOf(one)?X.ownerOf(one):one;this.addAttr(owner);return;}
    if(a==='addpart'){const one=this.single();if(one)this.addAttr(one);return;}
    if(a==='connect'||a==='relate'){this.connect=!this.connect;this.from=null;this.pend=null;b.setAttribute('aria-pressed',String(this.connect));if(this.connect)toast(this.isER?'Pulsa el primer elemento y luego el segundo.':'Pulsa la primera tabla y luego la segunda.');this.render();this.renderInsp();return;}
    if(a==='table'){this.create('table');return;}
    if(a==='distribute'){this.distribute();return;}
    if(a==='fromer'){this.fromER();return;}
    if(a==='find'){this.openSearch();return;}
    if(a==='copyrel'){this.copyRel();return;}
    if(a==='er2bo'){this.erToBo();return;}
    if(a==='er2rel'){this.chainGo('rel',()=>this.fromER());return;}
    if(a==='rel2er'){this.relToER();return;}
    if(a==='rel2ded'){this.chainGo('ded',()=>this.copyRel());return;}
    if(a==='ded2rel'){this.dedToRel();return;}
    if(a==='ded2sql'){const p=this.p,app=this.app;app.go(p,'sql');app.action({dataset:{act:'sql-ded'}});return;}
    if(a==='erdplus'||a==='erdplus-import'){this.app.action({dataset:{act:a}});return;}
    if(a==='clear'){this.app.confirm(`Vaciar ${VIEWS[this.mode]}`,`Se borrará todo lo que hay en el ${VIEWS[this.mode]} de este proyecto. Puedes recuperarlo con Ctrl+Z.`,'Vaciar',()=>{this.snap();this.p[this.mode]=this.isER?{nodes:[],links:[],notes:[]}:{t:[],notes:[]};this.selIds=new Set();this.selLink=null;this.pend=null;this.save();this.render();this.renderInsp();});return;}
    if(a==='addcol'){this.addColumn();return;}
    if(a==='delcol'){const t=this.single();if(!t)return;this.snap();t.c.splice(+b.dataset.ci,1);this.save();this.render();this.renderInsp();return;}
  }
  addColumn(after){const t=this.single();if(!t||this.isER)return;this.snap();const at=after==null?t.c.length:after+1;t.c.splice(at,0,['',this.mode==='ded'?'VARCHAR(45)':'VARCHAR(45)','']);this.save();this.render();this.renderInsp();const ins=this.insp.querySelectorAll('[data-f=cname]');ins[at]?.focus();}
  onInspKey(e){
    if(e.key!=='Enter')return;const f=e.target.dataset.f;
    if(f==='cname'||f==='ctype'){e.preventDefault();this.addColumn(+e.target.dataset.ci);return;}
    if(f==='tname'){e.preventDefault();this.addColumn(-1);return;}
    if(f==='name'&&this.isER&&!this.isBo){e.preventDefault();const n=this.single();if(!n)return;const X=this.X();
      if(isAtt(n)){const ow=X.ownerOf(n);if(ow)this.addAttr(ow);}else if(isEnt(n)||isRel(n))this.addAttr(n);}
  }
  focusName(){const n=this.insp.querySelector('[data-f=name],[data-f=tname],[data-f=ntext]');if(n){n.focus();n.select();}}
  single(){if(this.selIds.size!==1)return null;return this.node([...this.selIds][0])||null;}
  deleteSel(){
    if(!this.selIds.size&&!this.selLink)return;this.snap();const nsel=new Set(this.selIds);this.m.notes=this.notes.filter(n=>!nsel.has(n.id));
    if(this.isER){const X=this.X(),kill=new Set(this.selIds);
      const addKids=o=>X.attrsOf(o).forEach(a=>{if(!kill.has(a.id)){kill.add(a.id);addKids(a);}});
      [...kill].forEach(id=>{const n=X.N[id];if(n)addKids(n);});
      this.m.nodes=this.m.nodes.filter(n=>!kill.has(n.id));this.m.links=this.m.links.filter(l=>!kill.has(l.a)&&!kill.has(l.b)&&l.id!==this.selLink);}
    else{if(this.selLink&&!this.selIds.size)this.fkRemove();const gone=this.m.t.filter(t=>this.selIds.has(t.id)).map(t=>t.n);this.m.t=this.m.t.filter(t=>!this.selIds.has(t.id));
      this.m.t.forEach(o=>o.c.forEach(c=>{const f=parseF(c[2]);if(gone.includes(f.fk)){delete f.fk;c[2]=joinF(f);}}));}
    this.selIds=new Set();this.selLink=null;this.pend=null;this.save();this.render();this.renderInsp();
  }
  selectAll(){this.selIds=new Set(this.items().map(n=>n.id));this.selLink=null;this.render();this.renderInsp();}
  copy(cut,silent){
    if(!this.selIds.size)return;
    if(this.isER){const X=this.X(),ids=new Set(this.selIds);const addKids=o=>X.attrsOf(o).forEach(a=>{if(!ids.has(a.id)){ids.add(a.id);addKids(a);}});[...ids].forEach(id=>{const n=X.N[id];if(n&&!isAtt(n))addKids(n);});
      Editor.clip={kind:'er',nodes:JSON.parse(JSON.stringify(this.m.nodes.filter(n=>ids.has(n.id)).map(n=>({id:n.id,k:n.k,n:n.n,x:n.x,y:n.y,f:n.f})))),links:JSON.parse(JSON.stringify(this.m.links.filter(l=>ids.has(l.a)&&ids.has(l.b))))};}
    else Editor.clip={kind:'tab',t:JSON.parse(JSON.stringify(this.m.t.filter(t=>this.selIds.has(t.id)).map(t=>({n:t.n,x:t.x,y:t.y,c:t.c}))))};
    Editor.clip.notes=JSON.parse(JSON.stringify(this.notes.filter(n=>this.selIds.has(n.id))));
    this.pasteN=0;const n=this.selIds.size;if(cut){this.deleteSel();toast(`${n} elemento(s) cortado(s).`);}else if(!silent)toast(`${n} elemento(s) copiado(s).`);
  }
  paste(){
    const C=Editor.clip;if(!C){toast('No hay nada copiado.');return;}
    if((C.kind==='er')!==this.isER&&((C.nodes||C.t||[]).length)){toast('Lo copiado es de otro tipo de diagrama.','warn');return;}
    this.snap();this.pasteN=(this.pasteN||0)+1;const off=40*this.pasteN;const sel=new Set();
    if(C.kind==='er'){const map={};const ents=this.m.nodes.filter(isEnt).map(n=>n.n);
      C.nodes.forEach(n=>{const id=uid();map[n.id]=id;const nn={id,k:n.k,n:n.n,x:n.x+off,y:n.y+off,f:{...n.f}};if(isEnt(nn)){nn.n=this.uniqueName(n.n,ents);ents.push(nn.n);}this.m.nodes.push(nn);sel.add(id);});
      C.links.forEach(l=>this.m.links.push({...l,id:uid(),a:map[l.a],b:map[l.b]}));}
    else{const names=this.m.t.map(t=>t.n),ren={};
      const nt=C.t.map(t=>{const n=this.uniqueName(t.n,names);names.push(n);ren[t.n]=n;return{id:uid(),n,x:t.x+off,y:t.y+off,c:t.c.map(c=>[c[0],c[1],c[2]])};});
      nt.forEach(t=>{t.c.forEach(c=>{const f=parseF(c[2]);if(f.fk&&ren[f.fk]){f.fk=ren[f.fk];c[2]=joinF(f);}});this.m.t.push(t);sel.add(t.id);});}
    (C.notes||[]).forEach(n=>{const id=uid();this.notes.push({...n,id,x:n.x+off,y:n.y+off});sel.add(id);});
    this.selIds=sel;this.selLink=null;this.save();this.render();this.renderInsp();
  }
  nudge(dx,dy){if(!this.selIds.size)return;this.snap();const X=this.isER?this.X():null,moved=new Set();
    const mv=n=>{if(moved.has(n.id)||this.locked(n))return;moved.add(n.id);n.x+=dx;n.y+=dy;if(X&&!isAtt(n))X.attrsOf(n).forEach(mv);};
    this.selIds.forEach(id=>{const n=this.node(id);if(n)mv(n);});this.save();this.render();}
  key(e){ // atajos del lienzo (llamado por la app)
    const k=e.key.toLowerCase(),ctrl=e.ctrlKey||e.metaKey,K=a=>keyIs(e,a),go=fn=>{e.preventDefault();fn();return true;};
    if(this.ro){if(K('selectAll'))return go(()=>this.selectAll());if(K('fit'))return go(()=>this.fit());if(K('copy'))return go(()=>this.copy(false));if(e.key==='Escape'){this.selIds=new Set();this.selLink=null;this.render();this.renderInsp();return true;}return false;}
    if(K('undo'))return go(()=>this.undo());
    if(K('redo')||(ctrl&&e.shiftKey&&k==='z'))return go(()=>this.redoIt());
    if(K('copy'))return go(()=>this.copy(false));
    if(K('cut'))return go(()=>this.copy(true));
    if(K('paste'))return go(()=>this.paste());
    if(K('selectAll'))return go(()=>this.selectAll());
    if(K('duplicate'))return go(()=>this.duplicate());
    if(K('rename'))return go(()=>this.rename());
    if(K('lock'))return go(()=>this.toggleLock());
    if(K('distribute'))return go(()=>this.distribute());
    if(K('fit'))return go(()=>this.fit());
    const mk={newEnt:'ent',newRel:'rel',newAttr:'attr',newIsa:'isa',newNote:'note',newTable:'table'};
    for(const [a,t] of Object.entries(mk))if(K(a)){const okHere=t==='note'||(t==='table'?!this.isER:this.isER&&(!this.isBo||t==='ent'));if(!okHere)return false;return go(()=>this.create(t));}
    if(K('del')||e.key==='Backspace'||(e.key==='Delete'&&!KEYS().del))return go(()=>this.deleteSel());
    if(e.key==='Escape'){this.connect=false;this.from=null;this.pend=null;this.selIds=new Set();this.selLink=null;this.renderTools();this.render();this.renderInsp();return true;}
    const st=e.shiftKey?10:1;const arrows={arrowleft:[-st,0],arrowright:[st,0],arrowup:[0,-st],arrowdown:[0,st]};
    if(arrows[k]&&this.selIds.size){e.preventDefault();this.nudge(...arrows[k]);return true;}
    return false;
  }
  /* ---------- Menú del botón derecho ---------- */
  duplicate(){if(!this.selIds.size)return;const keep=Editor.clip;this.copy(false,true);this.pasteN=0;this.paste();Editor.clip=keep;}
  rename(){const n=this.single();if(!n)return;this.main.classList.remove('noinsp');this.renderInsp();this.focusName();}
  contextMenu(e,P){
    if(this.ro){openCtx(e.clientX,e.clientY,[{label:'Ajustar la vista',fn:()=>this.fit()},{label:'Buscar…',fn:()=>this.openSearch()}]);return;}
    const id=P.g&&P.g.dataset.id,lid=P.hl&&P.hl.dataset.lid,at=this.pt(e),items=[];
    if(id&&!this.selIds.has(id)){this.selIds=new Set([id]);this.selLink=null;this.render();this.renderInsp();}
    if(!id&&lid&&this.isER){this.selIds=new Set();this.selLink=lid;this.render();this.renderInsp();}
    const n=id?this.node(id):null,multi=id&&this.selIds.size>1,K=a=>keyLabel(a);
    const I=(label,fn,o={})=>items.push({label,fn,...o}),SEP=()=>items.push({sep:true});
    const flag=(k,label)=>I(label,()=>{this.snap();n.f[k]=!n.f[k];if(k==='k'&&n.f.k)n.f.p=false;if(k==='p'&&n.f.p)n.f.k=false;this.save();this.render();this.renderInsp();},{check:!!n.f[k]});
    const lockI=()=>{const all=[...this.selIds].map(x=>this.node(x)).filter(Boolean),on=all.length&&all.every(x=>this.locked(x));I(multi?(on?'Desbloquear posición':'Bloquear posición'):'Bloquear posición',()=>this.toggleLock(),{check:!multi&&on,key:K('lock')});};
    const edit=(dup=true)=>{SEP();I('Copiar',()=>this.copy(false),{key:K('copy')});if(dup)I('Duplicar',()=>this.duplicate(),{key:K('duplicate')});lockI();SEP();};
    if(multi){
      items.push({row:[['l','Alinear a la izquierda'],['c','Centrar en horizontal'],['r','Alinear a la derecha'],['t','Alinear arriba'],['m','Centrar en vertical'],['b','Alinear abajo'],['dh','Repartir en horizontal'],['dv','Repartir en vertical']].map(([k,t])=>({icon:ALG[k],title:t,fn:()=>this.align(k)}))});
      const ents=[...this.selIds].map(x=>this.node(x)).filter(isEnt);
      if(this.isER&&!this.isBo&&ents.length>=2&&ents.length===this.selIds.size){SEP();I(ents.length===2?'Crear una relación entre las dos':`Crear una relación ${ents.length===3?'ternaria ':''}entre las ${ents.length}`,()=>this.relBetween());}
      edit();I(`Borrar ${this.selIds.size} elementos`,()=>this.deleteSel(),{danger:true,key:K('del')});}
    else if(isNote(n)){I('Editar texto',()=>this.rename(),{key:K('rename')});
      items.push({row:Object.entries(NOTE_COLORS).map(([k,t])=>({swatch:k,title:t,on:(n.c||'y')===k,fn:()=>{this.snap();n.c=k;this.save();this.render();this.renderInsp();}}))});
      edit();I('Borrar',()=>this.deleteSel(),{danger:true,key:K('del')});}
    else if(n&&this.isBo&&isEnt(n)){I('Renombrar',()=>this.rename(),{key:K('rename')});I('Unir con otra entidad…',()=>{this.connect=true;this.from=n.id;this.renderTools();this.render();toast('Pulsa la otra entidad.');});
      edit();I('Borrar',()=>this.deleteSel(),{danger:true,key:K('del')});}
    else if(n&&this.isER&&isEnt(n)){const X=this.X();I('Renombrar',()=>this.rename(),{key:K('rename')});I('Añadir atributo',()=>this.addAttr(n));
      I('Entidad débil',()=>{this.snap();n.k=n.k==='weak'?'ent':'weak';this.save();this.render();this.renderInsp();},{check:n.k==='weak'});
      if(Settings.get().showIsa!==false){const own=this.m.nodes.find(i=>isIsa(i)&&X.superOf(i)===n);I(own?'Añadir subtipo a su jerarquía':'Crear jerarquía (subtipos)',()=>{if(own)this.addSubtype(own);else{this.selIds=new Set([n.id]);this.create('isa');}});}
      edit();I('Borrar',()=>this.deleteSel(),{danger:true,key:K('del')});}
    else if(n&&this.isER&&isRel(n)){I('Renombrar',()=>this.rename(),{key:K('rename')});I('Añadir atributo',()=>this.addAttr(n));
      I('Identificadora',()=>{this.snap();n.k=n.k==='idrel'?'rel':'idrel';this.save();this.render();this.renderInsp();},{check:n.k==='idrel'});
      I('Entidad asociativa',()=>this.toggleAssoc(n),{check:!!n.f.as});
      I('Unir otra entidad (ternaria)…',()=>{this.connect=true;this.from=n.id;this.renderTools();this.render();toast('Pulsa la entidad que quieres añadir a la relación.');});
      edit(false);I('Borrar',()=>this.deleteSel(),{danger:true,key:K('del')});}
    else if(n&&isIsa(n)){const f=n.f;const set=(k,v)=>()=>{this.snap();n.f[k]=v;this.save();this.render();this.renderInsp();};
      I('Total',set('tot',true),{check:!!f.tot});I('Parcial',set('tot',false),{check:!f.tot});SEP();I('Exclusiva',set('dis',true),{check:f.dis!==false});I('Solapada',set('dis',false),{check:f.dis===false});SEP();
      I('Añadir subtipo',()=>this.addSubtype(n));lockI();SEP();I('Borrar jerarquía',()=>this.deleteSel(),{danger:true,key:K('del')});}
    else if(n&&this.isER&&isAtt(n)){const ow=this.X().ownerOf(n);I('Renombrar',()=>this.rename(),{key:K('rename')});SEP();
      flag('k','Clave primaria');if((ow&&ow.k==='weak')||n.f.p)flag('p','Clave parcial');flag('o','Opcional');flag('m','Multivaluado');flag('d','Derivado');flag('c','Compuesto');
      SEP();if(ow)I(`Añadir otro atributo a «${ow.n}»`,()=>this.addAttr(ow));lockI();I('Borrar',()=>this.deleteSel(),{danger:true,key:K('del')});}
    else if(n){I('Renombrar',()=>this.rename(),{key:K('rename')});I('Añadir columna',()=>{this.rename();this.addColumn();});
      edit();I('Borrar tabla',()=>this.deleteSel(),{danger:true,key:K('del')});}
    else if(lid&&this.isER){const l=this.m.links.find(x=>x.id===lid),X=this.X();
      if(l&&this.isBo){const A=X.N[l.a],B=X.N[l.b],set=(k,v)=>()=>{this.snap();if(v)l[k]=v;else delete l[k];this.save();this.render();this.renderInsp();};
        [['ea',A],['eb',B]].forEach(([k,e])=>{items.push({row:BO_ENDS.slice(1,5).map(([v,t,tip])=>({icon:`<b class="cx-t">${t}</b>`,title:`Junto a «${e.n}»: ${tip}`,fn:set(k,v)}))});});SEP();}
      else if(l&&X.cardable(l)){const c=mmOf(l),set=(k,v)=>()=>{this.snap();const cur=mmOf(l);cur[k]=v;l.mn=cur.mn;l.mx=cur.mx;l.c=(cur.mn!=null&&cur.mx!=null)?`(${cur.mn},${cur.mx})`:null;this.save();this.render();this.renderInsp();};
        I('Mínimo 0',set('mn','0'),{check:c.mn==='0'});I('Mínimo 1',set('mn','1'),{check:c.mn==='1'});SEP();I('Máximo 1',set('mx','1'),{check:c.mx==='1'});I('Máximo N',set('mx','N'),{check:c.mx==='N'});SEP();}
      I('Borrar línea',()=>this.deleteSel(),{danger:true,key:K('del')});}
    else{this.selIds=new Set();this.selLink=null;this.render();this.renderInsp();
      const here=k=>()=>this.create(k,{x:at.x,y:at.y});
      if(this.isBo)I('Añadir entidad aquí',here('ent'));else if(this.isER){I('Añadir entidad aquí',here('ent'));I('Añadir relación aquí',here('rel'));}else I('Añadir tabla aquí',here('table'));
      I('Añadir nota aquí',here('note'));SEP();
      I('Pegar',()=>this.paste(),{key:K('paste'),disabled:!Editor.clip});I('Seleccionar todo',()=>this.selectAll(),{key:K('selectAll')});SEP();
      I('Buscar…',()=>this.openSearch(),{key:K('find')});I('Ajustar la vista',()=>this.fit(),{key:K('fit')});I('Distribuir',()=>this.distribute(),{key:K('distribute')});
      if(this.app&&this.app.diff)I('Quitar las marcas de la comparación',()=>this.app.clearDiff());}
    openCtx(e.clientX,e.clientY,items);
  }
  // Bloquear / desbloquear la posición de lo seleccionado
  toggleLock(){const all=[...this.selIds].map(x=>this.node(x)).filter(Boolean);if(!all.length)return;const v=!all.every(x=>this.locked(x));
    this.snap();all.forEach(x=>this.setLock(x,v));this.save();this.render();this.renderInsp();toast(v?(all.length>1?`${all.length} elementos bloqueados: no se mueven.`:'Bloqueado: ya no se mueve sin querer.'):'Desbloqueado.');}
  // Añade una entidad nueva debajo de la jerarquía, ya unida como subtipo
  addSubtype(i){const X=this.X(),subs=X.subsOf(i);this.snap();
    const en=LANG()==='en',e={id:uid(),k:'ent',n:this.uniqueName(en?'subtype':'subtipo',this.m.nodes.filter(isEnt).map(x=>x.n)),x:Math.round(i.x+(subs.length?(subs.length%2?1:-1)*Math.ceil(subs.length/2)*190:0)),y:Math.round(i.y+120),f:{}};
    this.m.nodes.push(e);this.m.links.push({id:uid(),a:i.id,b:e.id,c:null,mn:null,mx:null});this.save();this.selIds=new Set([e.id]);this.selLink=null;this.render();this.renderInsp();this.focusName();}
  // Relación nueva (binaria, ternaria…) entre las entidades seleccionadas
  relBetween(){const ents=[...this.selIds].map(x=>this.node(x)).filter(isEnt);if(ents.length<2)return;this.snap();
    const r={id:uid(),k:'rel',n:this.uniqueName(LANG()==='en'?'relationship':'relacion',this.m.nodes.filter(isRel).map(x=>x.n)),x:Math.round(ents.reduce((s,e)=>s+e.x,0)/ents.length),y:Math.round(ents.reduce((s,e)=>s+e.y,0)/ents.length),f:{}};
    if(ents.length===2&&Math.hypot(ents[0].x-ents[1].x,ents[0].y-ents[1].y)<260)r.y+=90;
    this.m.nodes.push(r);ents.forEach(e=>this.m.links.push({id:uid(),a:r.id,b:e.id,c:null,mn:null,mx:null}));
    this.save();this.selIds=new Set([r.id]);this.selLink=null;this.render();this.renderInsp();this.focusName();
    if(ents.length>2)toast(`Relación ternaria creada. En el panel, contesta las ${ents.length} preguntas de cardinalidad.`);}
  /* ---------- Boceto: zona de texto «Entidad; atributo1, atributo2» ---------- */
  // Lo que muestra el texto: solo eso se puede borrar escribiendo (lo que se añade en el lienzo mientras escribes no se pierde)
  boSync(){this.boT.value=this.boText();this._boKnown=new Set([...this.m.nodes.filter(isEnt).map(n=>n.id),...this.m.links.map(l=>l.id)]);}
  boText(){const N={};this.m.nodes.forEach(n=>N[n.id]=n);
    return [...this.m.nodes.filter(isEnt).map(n=>n.n+((n.f.at||[]).length?'; '+n.f.at.join(', '):'')),
      ...this.m.links.filter(l=>isEnt(N[l.a])&&isEnt(N[l.b])).map(l=>N[l.a].n+'-'+N[l.b].n+((l.at||[]).length?'; '+l.at.join(', '):''))].join('\n');}
  boParse(txt){return String(txt||'').split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{const m=l.match(/^([^;:]*)[;:]?(.*)$/);
    return{name:m[1].trim(),at:m[2].split(',').map(x=>x.trim()).filter(Boolean)};}).filter(x=>x.name);}
  boSplit(lines){const ents=[],rels=[];const isRelLine=ln=>{const i=ln.name.indexOf('-');if(i<1)return null;return{a:ln.name.slice(0,i).trim(),b:ln.name.slice(i+1).trim()};};
    const names=new Set(lines.filter(ln=>!isRelLine(ln)).map(ln=>lc(ln.name)));
    lines.forEach(ln=>{const r=isRelLine(ln);if(r&&names.has(lc(r.a)))rels.push({...r,at:ln.at,ok:names.has(lc(r.b))});else ents.push(ln);});return{ents,rels};}
  // El texto manda: crea, renombra o borra entidades para que coincidan con las líneas
  boFromText(txt){if(!this.isBo||!this.p)return;const sp=this.boSplit(this.boParse(txt)),lines=sp.ents,K=this._boKnown,known=x=>!K||K.has(x.id),ents=this.m.nodes.filter(n=>isEnt(n)&&known(n)),idx=new Map(ents.map((e,i)=>[e,i]));
    const sig=()=>JSON.stringify([this.m.nodes.filter(isEnt).map(e=>[e.n,e.f.at||[]]),this.m.links.map(l=>[l.a,l.b,l.at||[]])]);const before=sig();
    const used=new Set(),as=new Array(lines.length);
    lines.forEach((ln,i)=>{const e=ents.find(e=>!used.has(e)&&lc(e.n)===lc(ln.name));if(e){used.add(e);as[i]=e;}});
    lines.forEach((ln,i)=>{if(as[i])return;let best=null;ents.forEach(e=>{if(used.has(e))return;const d=Math.abs(idx.get(e)-i);if(!best||d<best.d)best={e,d};});if(best){used.add(best.e);as[i]=best.e;}});
    const gone=ents.filter(e=>!used.has(e));
    const changes=gone.length||lines.some((ln,i)=>!as[i]||as[i].n!==ln.name||JSON.stringify(as[i].f.at||[])!==JSON.stringify(ln.at));
    const linkPlan=()=>{ // une cada línea «A-B» con una unión del lienzo (las que se están escribiendo a medias no borran nada)
      const byN={};this.m.nodes.filter(isEnt).forEach(e=>{byN[lc(e.n)]=byN[lc(e.n)]||e;});const L=this.m.links.filter(l=>isEnt(this.node(l.a))&&isEnt(this.node(l.b))&&known(l));
      const used=new Set(),as2=sp.rels.map(r=>{if(!r.ok)return null;const A=byN[lc(r.a)],B=byN[lc(r.b)];if(!A||!B)return null;
        const l=L.find(l=>!used.has(l)&&((l.a===A.id&&l.b===B.id)||(l.a===B.id&&l.b===A.id)));if(l)used.add(l);return l||{A,B};});
      const free=L.filter(l=>!used.has(l));sp.rels.forEach((r,i)=>{if(!as2[i]&&free.length){const l=free.shift();used.add(l);as2[i]={keep:l};}});
      return{as2,kill:L.filter(l=>!used.has(l)&&known(l))};};
    const lp=linkPlan(),lchg=lp.kill.length||sp.rels.some((r,i)=>{const x=lp.as2[i];return x&&(x.A||(!x.keep&&JSON.stringify(x.at||[])!==JSON.stringify(r.at)));});
    if(!changes&&!lchg&&lines.length===ents.length)return;
    if(!this._boEd){this.snap();this._boEd=true;}
    const kill=new Set(gone.map(e=>e.id));this.m.nodes=this.m.nodes.filter(n=>!kill.has(n.id));this.m.links=this.m.links.filter(l=>!kill.has(l.a)&&!kill.has(l.b));
    const order=[];lines.forEach((ln,i)=>{let e=as[i];
      if(!e){const c=this.freeSpot(140,60);e={id:uid(),k:'ent',n:ln.name,x:c.x,y:c.y,f:{}};this.m.nodes.push(e);}
      e.n=ln.name;if(ln.at.length)e.f.at=ln.at;else delete e.f.at;order.push(e);});
    const extra=this.m.nodes.filter(n=>isEnt(n)&&!known(n)&&!order.includes(n)),rest=this.m.nodes.filter(n=>!isEnt(n));this.m.nodes=[...order,...extra,...rest];
    { const lp2=linkPlan();const kill=new Set(lp2.kill);this.m.links=this.m.links.filter(l=>!kill.has(l));
      sp.rels.forEach((r,i)=>{let x=lp2.as2[i];if(!x)return;if(x.keep){if(K)K.add(x.keep.id);return;}if(x.A){const l={id:uid(),a:x.A.id,b:x.B.id,c:null,mn:null,mx:null};this.m.links.push(l);x=l;}
        if(K)K.add(x.id);if(r.at.length)x.at=r.at;else delete x.at;});
      if(K)order.forEach(e=>K.add(e.id)); }
    if(sig()!==before||gone.length){this.selIds=new Set([...this.selIds].filter(id=>this.node(id)));this.save();this.render();this.renderInsp();}}
  // Proyectos de la 1.9: el tipo de línea (1:N…) pasa a marcas en cada extremo
  boFix(){const bo=this.p.bo;if(!bo)return;(bo.links||[]).forEach(l=>{if(!l.t)return;const m={'11':['?1','?1'],'1N':['?1','?N'],'N1':['?N','?1'],'NM':['?N','?N']}[l.t];if(m&&!l.ea&&!l.eb){l.ea=m[0];l.eb=m[1];}delete l.t;});}
  // Del boceto al E-R: entidades (con sus atributos) y una relación con sus cardinalidades por cada línea
  boToER(){const bo=this.p.bo||{nodes:[],links:[]},ents=bo.nodes.filter(isEnt);if(!ents.length){toast('Tu boceto está vacío.');return;}
    const er=this.p.er,byName={};er.nodes.filter(isEnt).forEach(e=>byName[lc(e.n)]=e);const snapER=JSON.stringify(cleanModel(er,'er'));
    const ed2=new Editor(this.app);ed2.p=this.p;ed2.mode='er';
    const bx=ents.map(e=>e.x),by=ents.map(e=>e.y),cx=(Math.min(...bx)+Math.max(...bx))/2,cy=(Math.min(...by)+Math.max(...by))/2;
    let dx=W/2,dy=H/2;
    if(er.nodes.length){const ys=er.nodes.map(n=>n.y),xs=er.nodes.map(n=>n.x);dx=(Math.min(...xs)+Math.max(...xs))/2;dy=Math.max(...ys)+300+(Math.max(...by)-Math.min(...by))*0.9;}
    const map={};let ne=0,nr=0,na=0;
    ents.forEach(e=>{let t=byName[lc(e.n)];if(!t){t={id:uid(),k:'ent',n:e.n,x:Math.round(dx+(e.x-cx)*1.8),y:Math.round(dy+(e.y-cy)*1.8),f:{}};er.nodes.push(t);byName[lc(e.n)]=t;ne++;}map[e.id]=t;});
    const X=erIdx(er),relNames=er.nodes.filter(isRel).map(x=>x.n),card=v=>v?{mn:v[0]==='?'?null:v[0],mx:v[1]}:{mn:null,mx:null};
    const relAt=(r,list)=>{const have=new Set(erIdx(er).attrsOf(r).map(a=>lc(a.n)));(list||[]).forEach(a=>{const n=String(a).trim();if(!n||have.has(lc(n)))return;have.add(lc(n));
      const nn={id:uid(),k:'attr',n,x:r.x,y:r.y,f:{}};ed2.size(nn);er.nodes.push(nn);er.links.push({id:uid(),a:r.id,b:nn.id,c:null,mn:null,mx:null});ed2.size(r);ed2.placeAttr(r,nn);na++;});};
    bo.links.forEach(l=>{const A=map[l.a],B=map[l.b];if(!A||!B)return;
      const old=er.nodes.find(r=>isRel(r)&&(()=>{const es=X.ends(r).map(x=>x.e.id);return es.length===2&&es.includes(A.id)&&es.includes(B.id)&&(A!==B||es[0]===es[1]);})());
      if(old){relAt(old,l.at);return;}
      const r={id:uid(),k:'rel',n:this.uniqueName(LANG()==='en'?'relationship':'relacion',relNames),x:Math.round((A.x+B.x)/2),y:Math.round((A.y+B.y)/2),f:{}};relNames.push(r.n);
      if(A===B){r.x+=170;r.y-=100;}
      const ca=card(l.ea),cb=card(l.eb),lk=(e,c)=>({id:uid(),a:r.id,b:e.id,mn:c.mn,mx:c.mx,c:c.mn!=null&&c.mx!=null?`(${c.mn},${c.mx})`:null});
      er.nodes.push(r);er.links.push(lk(A,ca),lk(B,cb));nr++;relAt(r,l.at);});
    ents.forEach(e=>{const t=map[e.id],have=new Set(erIdx(er).attrsOf(t).map(a=>lc(a.n)));
      (e.f.at||[]).forEach(a=>{const n=String(a).trim();if(!n||have.has(lc(n)))return;have.add(lc(n));
        const nn={id:uid(),k:'attr',n,x:t.x,y:t.y,f:{}};ed2.size(nn);er.nodes.push(nn);er.links.push({id:uid(),a:t.id,b:nn.id,c:null,mn:null,mx:null});ed2.placeAttr(t,nn);na++;});});
    const nn=carryNotes(bo,er,false);
    if(!ne&&!nr&&!na&&!nn){toast('Tu E-R ya tiene todo lo del boceto.');return;}
    this.hist.push({mode:'er',data:snapER});this.app.touch(this.p);if(this.p._views)delete this.p._views.er;this.app.go(this.p,'er');
    toast(`Pasado al E-R: ${ne} entidad(es), ${na} atributo(s) y ${nr} relación(es). Ahora marca las claves, ponle un verbo a cada relación y completa lo que falte. Ctrl+Z lo deshace.`);}
  // Marcas de la comparación (verde: solo en el tuyo, ámbar: cambiado)
  diffMarks(){const d=this.app&&this.app.diff;return d&&d.p===this.p&&d.marks&&d.marks[this.mode]||{};}
  /* ---------- Buscar (Ctrl+F) ---------- */
  openSearch(){
    let box=this.cv.querySelector('.cv-search');
    if(!box){box=document.createElement('div');box.className='cv-search';box.setAttribute('role','search');
      box.innerHTML=`<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m10.5 10.5 3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><input type="search" placeholder="Buscar en el diagrama" aria-label="Buscar en el diagrama" spellcheck="false"><span class="cs-cnt" aria-live="polite"></span><button class="cs-b" data-s="prev" title="Anterior (Mayús+Enter)" aria-label="Anterior">‹</button><button class="cs-b" data-s="next" title="Siguiente (Enter)" aria-label="Siguiente">›</button><button class="cs-b" data-s="close" title="Cerrar (Esc)" aria-label="Cerrar búsqueda">✕</button><div class="cs-what"></div>`;
      this.cv.appendChild(box);const inp=box.querySelector('input');
      inp.addEventListener('input',()=>{this._sq=inp.value;this._si=0;this.runSearch(true);});
      inp.addEventListener('keydown',ev=>{if(ev.key==='Enter'){ev.preventDefault();this.stepSearch(ev.shiftKey?-1:1);}else if(ev.key==='Escape'){ev.preventDefault();this.closeSearch();}});
      box.addEventListener('click',ev=>{const b=ev.target.closest('[data-s]');if(!b)return;if(b.dataset.s==='close')this.closeSearch();else this.stepSearch(b.dataset.s==='next'?1:-1);});
      box.addEventListener('pointerdown',ev=>ev.stopPropagation());}
    const inp=box.querySelector('input');inp.value=this._sq||'';inp.focus();inp.select();this.runSearch(true);
  }
  closeSearch(){const b=this.cv.querySelector('.cv-search');if(b)b.remove();this._sq='';}
  searchHits(){
    const norm=x=>String(x||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase(),q=norm(this._sq).trim();if(!q)return[];
    const out=[];
    if(this.isBo){this.m.nodes.filter(isEnt).forEach(n=>{if(norm(n.n).includes(q))out.push({id:n.id,what:'Entidad «'+n.n+'»'});(n.f.at||[]).forEach(a=>{if(norm(a).includes(q))out.push({id:n.id,what:'Atributo «'+a+'» de «'+n.n+'»'});});});
      this.m.links.forEach(l=>(l.at||[]).forEach(a=>{const A=this.node(l.a),B=this.node(l.b);if(A&&B&&norm(a).includes(q))out.push({id:A.id,what:'Atributo «'+a+'» de la relación '+A.n+'-'+B.n});}));}
    else if(this.isER){const X=this.X(),hide=this.not!=='chen';this.m.nodes.forEach(n=>{if(!isIsa(n)&&norm(n.n).includes(q)){const ow=isAtt(n)?X.ownerOf(n):null;
      out.push({id:hide&&isAtt(n)&&ow?(isAtt(ow)?(X.ownerOf(ow)||ow).id:ow.id):n.id,what:(isEnt(n)?'Entidad':isRel(n)?'Relación':'Atributo')+' «'+n.n+'»'+(ow?' de «'+ow.n+'»':'')});}});}
    else this.m.t.forEach(t=>{if(norm(t.n).includes(q))out.push({id:t.id,what:'Tabla «'+t.n+'»'});
      t.c.forEach(c=>{if(norm(c[0]).includes(q))out.push({id:t.id,what:'Columna «'+c[0]+'» de «'+t.n+'»'});});});
    this.notes.forEach(n=>{if(norm(n.text).includes(q))out.push({id:n.id,what:'Nota'});});
    return out;
  }
  runSearch(jump){const box=this.cv.querySelector('.cv-search');if(!box)return;const hits=this.searchHits(),cnt=box.querySelector('.cs-cnt'),wh=box.querySelector('.cs-what');
    box.classList.toggle('none',!!this._sq&&!hits.length);
    if(!hits.length){cnt.textContent=this._sq?'0':'';wh.textContent=this._sq?'No hay nada con ese nombre.':'';return;}
    this._si=((this._si||0)%hits.length+hits.length)%hits.length;const h=hits[this._si];cnt.textContent=`${this._si+1}/${hits.length}`;wh.textContent=h.what;
    if(jump){this.selIds=new Set([h.id]);this.selLink=null;this.render();this.renderInsp();this.centerOn(this.node(h.id));}}
  stepSearch(d){this._si=(this._si||0)+d;this.runSearch(true);}
  centerOn(n){if(!n)return;const b=this.boxOf(n),v=this.v;if(v.z<0.7)v.z=1;const s=this.viewSize();v.x=(b[0]+b[2])/2-s.w/2;v.y=(b[1]+b[3])/2-s.h/2;this.applyView();}
  /* ---------- Ratón ---------- */
  onDown(e){
    if(e.button===2||e.button===1){e.preventDefault();closeCtx();this.pan={x0:e.clientX,y0:e.clientY,vx:this.v.x,vy:this.v.y,btn:e.button,g:e.target.closest('[data-id]'),hl:e.target.closest('[data-lid]'),moved:false};this.svg.setPointerCapture(e.pointerId);this.cv.classList.add('panning');return;}
    if(e.button!==0)return;
    e.preventDefault();
    const g=e.target.closest('[data-id]'),hl=e.target.closest('[data-lid]');
    if(this.ro){if(g)this.selIds=new Set([g.dataset.id]);else if(hl&&this.isER){this.selIds=new Set();this.selLink=hl.dataset.lid;}else{this.selIds=new Set();this.selLink=null;}this.render();this.renderInsp();return;}
    if(this.connect){
      if(g){const id=g.dataset.id;if(!this.from)this.from=id;else if(id!==this.from){const a=this.from;this.from=null;this.connect=false;this.renderTools();if(this.isER)this.connectNodes(a,id);else this.startRelate(a,id);return;}}
      else this.from=null;
      this.render();return;
    }
    if(g){const id=g.dataset.id;
      if(e.shiftKey&&this.selIds.size===1&&!this.selIds.has(id)){const a=[...this.selIds][0];if(this.isER)this.connectNodes(a,id);else this.startRelate(a,id);return;}
      if(e.ctrlKey||e.metaKey){if(this.selIds.has(id))this.selIds.delete(id);else this.selIds.add(id);this.selLink=null;this.render();this.renderInsp();return;}
      const already=this.selIds.has(id);if(!already){this.selIds=new Set([id]);this.selLink=null;this.pend=null;}
      const p=this.pt(e),X=this.isER?this.X():null,list=[],seen=new Set();
      const add=n=>{if(!n||seen.has(n.id)||this.locked(n))return;seen.add(n.id);list.push({n,ox:n.x,oy:n.y});if(X&&!isAtt(n))X.attrsOf(n).forEach(add);if(X&&isAtt(n)&&n.f.c)X.attrsOf(n).forEach(add);};
      this.selIds.forEach(sid=>add(this.node(sid)));
      if(!list.length&&this.locked(this.node(id))&&!this._lockTold){this._lockTold=1;toast('Está bloqueado: no se mueve. Desbloquéalo con el botón derecho.');}
      this.drag={x0:p.x,y0:p.y,list,moved:false,click:id,already};this.svg.setPointerCapture(e.pointerId);e.preventDefault();
      if(!already){this.render();this.renderInsp();}return;}
    const fkl=e.target.closest('[data-fk]');if(fkl&&!this.isER){this.selIds=new Set();this.selLink=fkl.dataset.fk;this.pend=null;this.connect=false;this.from=null;this.render();this.renderInsp();return;}
    if(hl&&this.isER){this.selIds=new Set();this.selLink=hl.dataset.lid;this.pend=null;this.render();this.renderInsp();return;}
    if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
    const p=this.pt(e);this.band={x0:p.x,y0:p.y,x1:p.x,y1:p.y,add:e.shiftKey||e.ctrlKey,base:new Set(this.selIds)};this.svg.setPointerCapture(e.pointerId);
    if(!this.band.add){this.selIds=new Set();this.selLink=null;this.pend=null;}
  }
  onMove(e){
    if(this.pan){if(Math.hypot(e.clientX-this.pan.x0,e.clientY-this.pan.y0)>4)this.pan.moved=true;this.v.x=this.pan.vx-(e.clientX-this.pan.x0)/this.v.z;this.v.y=this.pan.vy-(e.clientY-this.pan.y0)/this.v.z;this.applyView();return;}
    if(this.drag){const d=this.drag,p=this.pt(e);let dx=p.x-d.x0,dy=p.y-d.y0;if(!d.moved){if(Math.hypot(dx,dy)<3)return;this.snap();d.moved=true;}
      if(Settings.get().snap&&d.list.length){const o=d.list[0];dx=Math.round((o.ox+dx)/20)*20-o.ox;dy=Math.round((o.oy+dy)/20)*20-o.oy;}
      d.list.forEach(it=>{it.n.x=Math.round(Math.min(W-20,Math.max(20,it.ox+dx)));it.n.y=Math.round(Math.min(H-20,Math.max(20,it.oy+dy)));});this.render();return;}
    if(this.band){const p=this.pt(e);this.band.x1=p.x;this.band.y1=p.y;this.render();}
  }
  onUp(e){
    if(this.pan){const P=this.pan;this.pan=null;this.cv.classList.remove('panning');if(!P.moved&&P.btn===2&&e&&e.type==='pointerup')this.contextMenu(e,P);return;}
    if(this.drag){const d=this.drag;this.drag=null;if(d.moved)this.save();else if(d.already&&this.selIds.size>1){this.selIds=new Set([d.click]);this.render();this.renderInsp();}return;}
    if(this.band){const b=this.band;this.band=null;const x0=Math.min(b.x0,b.x1),x1=Math.max(b.x0,b.x1),y0=Math.min(b.y0,b.y1),y1=Math.max(b.y0,b.y1);
      if(x1-x0>4||y1-y0>4){const s=new Set(b.add?b.base:[]);this.items().forEach(n=>{const bb=this.boxOf(n);if(bb[0]<x1&&bb[2]>x0&&bb[1]<y1&&bb[3]>y0)s.add(n.id);});this.selIds=s;}
      this.render();this.renderInsp();}
  }
  /* ---------- Dibujo ---------- */
  render(){if(!this.p)return;{const em=this.isER?!this.m.nodes.length:!this.m.t.length;this.cv.dataset.empty=em&&!this.ro?({bo:'Escribe arriba «Entidad; atributos» o pulsa «Entidad» para empezar el boceto',er:'Pulsa «Entidad» en la barra de arriba para empezar tu E-R',rel:'Pulsa «Tabla» o «Pasar desde mi E-R» para empezar el relacional',ded:'Pulsa «Tabla», «Copiar mi relacional» o «Pasar desde mi E-R» para empezar el DED'}[this.mode]||''):'';}if(this.isBo&&this.boT&&document.activeElement!==this.boT)this.boSync();this.svg.innerHTML=this.isER?this.erString(true):this.tablesString(true);this.applyView();}
  gridSVG(){if(!Settings.get().grid)return '';return `<defs><pattern id="pdots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" class="pdot"/></pattern></defs><rect x="-400" y="-400" width="${W+800}" height="${H+800}" fill="url(#pdots)"/>`;}
  bandSVG(){const b=this.band;if(!b)return'';return `<rect x="${f1(Math.min(b.x0,b.x1))}" y="${f1(Math.min(b.y0,b.y1))}" width="${f1(Math.abs(b.x1-b.x0))}" height="${f1(Math.abs(b.y1-b.y0))}" class="band"/>`;}
  erString(live){
    const m=this.m,X=erIdx(m),N=X.N,nt=this.not,bo=this.isBo,hide=nt!=='chen';m.nodes.forEach(n=>this.size(n,X));const dups=live?erDups(m):new Set(),D=live?this.diffMarks():{};
    let L='',S='',MK='',TX='';
    const card=(P,u,c,full)=>{const n=[-u[1],u[0]],d=nt==='uml'?20:32,lp=[P[0]+u[0]*d+n[0]*13,P[1]+u[1]*d+n[1]*13],an=n[0]<-.35?'end':n[0]>.35?'start':'middle';
      const txt=nt==='uml'?umlMult(c):`(${c.mn??'?'},${c.mx??'?'})`;if(nt==='crow'&&full)return '';
      return `<text x="${f1(lp[0])}" y="${f1(lp[1]+4)}" text-anchor="${an}" class="card${full?'':' cardq'}">${nt==='crow'?'?':txt}</text>`;};
    m.links.forEach(l=>{const a=N[l.a],b=N[l.b];if(!a||!b)return;if(hide&&(isAtt(a)||isAtt(b)))return;const on=live&&this.selLink===l.id;
      const pr=pairRE(a,b),r=pr?pr[0]:null;
      L+=seg([a.x,a.y],[b.x,b.y],'ln'+(on?' lsel':'')+(r&&r.k==='idrel'&&hide?' lid':''))+(live?`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="hitl" data-lid="${l.id}"/>`:'');
      if(r){const en=r===a?b:a;const P=hitRect(en.x,en.y,en.w,en.h,r.x-en.x,r.y-en.y);const len=Math.hypot(r.x-P[0],r.y-P[1])||1;const u=[(r.x-P[0])/len,(r.y-P[1])/len];
        const c=mmOf(l),full=c.mn!=null&&c.mx!=null;if(full&&nt!=='uml')MK+=marker(P,u,c.mx!=='1',c.mn==='0');if(full||Settings.get().showCardQ!==false)TX+=card(P,u,c,full);}
      if(bo&&isEnt(a)&&isEnt(b)&&a!==b){
        if(Settings.get().boDiamond!==false){const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;MK+=`<polygon points="${f1(mx)},${f1(my-13)} ${f1(mx+21)},${f1(my)} ${f1(mx)},${f1(my+13)} ${f1(mx-21)},${f1(my)}" class="dia skd"/>`;}
        [[a,b,l.ea],[b,a,l.eb]].forEach(([e,o,v])=>{const P=hitRect(e.x,e.y,e.w,e.h,o.x-e.x,o.y-e.y),len=Math.hypot(o.x-P[0],o.y-P[1])||1,u=[(o.x-P[0])/len,(o.y-P[1])/len];
          const c={mn:v&&v[0]!=='?'?v[0]:null,mx:v&&v[1]!=='?'?v[1]:null},full=c.mn!=null&&c.mx!=null;
          if(full)MK+=marker(P,u,c.mx==='N',c.mn==='0');else if(c.mx)MK+=markerMax(P,u,c.mx==='N');
          if(full||Settings.get().showCardQ!==false)TX+=card(P,u,c,full);});}
    });
    m.nodes.forEach(n=>{if(hide&&isAtt(n))return;let g='';const dup=dups.has(n.id)?' dup':'';const x0=n.x-n.w/2,y0=n.y-n.h/2;
      const rows=(list,top,crowTag)=>list.map((r,i)=>{const y=top+14+i*17,tx=x0+(crowTag?36:10)+(r.dep?6:0);
        let s=crowTag&&(r.k||r.p)?`<text x="${f1(x0+9)}" y="${f1(y)}" class="ktag">${r.p?'PK*':'PK'}</text>`:'';
        s+=`<text x="${f1(tx)}" y="${f1(y)}" class="tx${r.k||r.p?' txk':''}">${esc(r.t)}</text>`;
        if(!crowTag&&(r.k||r.p)){const w=r.t.trim().length*CH;s+=`<line x1="${f1(tx)}" y1="${f1(y+2.5)}" x2="${f1(tx+w)}" y2="${f1(y+2.5)}" class="ul${r.p?' p':''}"/>`;}
        return s;}).join('');
      if(isEnt(n)){
        if(false){g+=`<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(n.w)}" height="${n.h}" class="ent${dup}"/><path d="M${f1(x0)},${f1(y0+28)} H${f1(x0+n.w)}" class="ent hd"/><text x="${n.x}" y="${f1(y0+19)}" text-anchor="middle" class="tb">${esc(n.n)}</text>`;
          n.f.at.forEach((a,i)=>{g+=`<text x="${f1(x0+10)}" y="${f1(y0+30+13+i*16)}" class="tx">${esc(a)}</text>`;});}
        else if(!hide){g+=`<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(n.w)}" height="${n.h}" class="ent${dup}"/>`;if(n.k==='weak')g+=`<rect x="${f1(x0+4)}" y="${f1(y0+4)}" width="${f1(n.w-8)}" height="${n.h-8}" class="ent in${dup}"/>`;g+=`<text x="${n.x}" y="${n.y+4.5}" text-anchor="middle" class="tb">${esc(n.n)}</text>`;}
        else{g+=`<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(n.w)}" height="${n.h}" rx="${nt==='crow'?4:0}" class="ent${dup}"/>`;if(n.k==='weak')g+=`<rect x="${f1(x0+3)}" y="${f1(y0+3)}" width="${f1(n.w-6)}" height="${n.h-6}" rx="${nt==='crow'?3:0}" class="ent in${dup}"/>`;
          g+=`<path d="M${f1(x0)},${f1(y0+28)} H${f1(x0+n.w)}" class="ent hd"/><text x="${n.x}" y="${f1(y0+19)}" text-anchor="middle" class="tb">${esc(n.n)}</text>`;
          g+=n.rows.length?rows(n.rows,y0+30,nt==='crow'):`<text x="${f1(x0+10)}" y="${f1(y0+44)}" class="tx cardq">${LANG()==='en'?'no attributes':'sin atributos'}</text>`;}}
      else if(isRel(n)){const t=Settings.get().showType!==false?X.relType(n):'';
        if(!hide){const w=(n.f.as?n.w-28:n.w)/2,h=24;if(n.f.as)g+=`<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(n.w)}" height="${n.h}" class="ent asc${dup}"/>`;g+=`<polygon points="${n.x},${n.y-h} ${n.x+w},${n.y} ${n.x},${n.y+h} ${n.x-w},${n.y}" class="dia"/>`;if(n.k==='idrel')g+=`<polygon points="${n.x},${n.y-h+6} ${n.x+w-11},${n.y} ${n.x},${n.y+h-6} ${n.x-w+11},${n.y}" class="dia in"/>`;g+=`<text x="${n.x}" y="${n.y+(t?1:4)}" text-anchor="middle" class="tr">${esc(n.n)}</text>`+(t?`<text x="${n.x}" y="${n.y+14}" text-anchor="middle" class="tt">${t}</text>`:'');}
        else if(nt==='uml'&&!n.rows.length){
          if(n.h>30){const w=n.w/2,h=n.h/2;g+=`<polygon points="${n.x},${n.y-h} ${n.x+w},${n.y} ${n.x},${n.y+h} ${n.x-w},${n.y}" class="dia"/>`;}
          else g+=`<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(n.w)}" height="${n.h}" class="rlab"/>`;
          g+=`<text x="${n.x}" y="${n.y+4}" text-anchor="middle" class="tr">${esc(n.n)}</text>`;}
        else{g+=`<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(n.w)}" height="${n.h}" rx="${nt==='crow'?11:0}" class="dia${nt==='uml'?' assoc':''}"/><text x="${n.x}" y="${f1(y0+17)}" text-anchor="middle" class="tr">${esc(n.n)}</text>`;
          if(n.rows.length)g+=`<path d="M${f1(x0)},${f1(y0+24)} H${f1(x0+n.w)}" class="dia hd"/>`+rows(n.rows,y0+26,false);}}
      else if(isIsa(n)){const h=n.h/2,w=n.w/2;g+=`<polygon points="${n.x},${n.y-h} ${n.x+w},${n.y+h} ${n.x-w},${n.y+h}" class="dia isa${dup}"/><text x="${n.x}" y="${f1(n.y+h-8)}" text-anchor="middle" class="tt">${LANG()==='en'?'IS A':'ES'}</text>`;
        TX+=`<text x="${f1(n.x+w+6)}" y="${f1(n.y+5)}" class="card isal">${esc(isaLabel(n.f))}</text>`;}
      else{const key=n.f.k||n.f.p,cls='att'+(key?' key':'')+(n.f.d?' dr':'')+dup;
        if(n.f.m)g+=`<ellipse cx="${n.x}" cy="${n.y}" rx="${f1(n.rx+4)}" ry="17" class="${cls}"/>`;
        g+=`<ellipse cx="${n.x}" cy="${n.y}" rx="${f1(n.rx)}" ry="13" class="${cls}"/><text x="${n.x}" y="${f1(n.y+3.8)}" text-anchor="middle" class="tx${key?' txk':''}">${esc(n.lab)}</text>`;
        if(key){const w=n.lab.length*CH;g+=`<line x1="${f1(n.x-w/2)}" y1="${f1(n.y+6.5)}" x2="${f1(n.x+w/2)}" y2="${f1(n.y+6.5)}" class="ul${n.f.p&&!n.f.k?' p':''}"/>`;}}
      if(live&&D[n.id])g+=`<rect x="${f1(x0-9)}" y="${f1(y0-9)}" width="${f1(n.w+18)}" height="${n.h+18}" rx="8" class="dfbox ${D[n.id]}"/>`;
      if(live&&this.selIds.has(n.id))g+=`<rect x="${f1(x0-6)}" y="${f1(y0-6)}" width="${f1(n.w+12)}" height="${n.h+12}" rx="6" class="selbox"/>`;
      if(live&&this.from===n.id)g+=`<rect x="${f1(x0-6)}" y="${f1(y0-6)}" width="${f1(n.w+12)}" height="${n.h+12}" rx="6" class="frombox"/>`;
      if(live&&this.locked(n))g+=lockIcon(x0+n.w-2,y0-2);
      S+=`<g class="node" data-id="${n.id}">${g}</g>`;});
    const empty=this.items().length||!live?'':`<text x="0" y="0" text-anchor="middle" class="emp">${bo?'Boceto vacío: añade entidades y únelas':'Lienzo vacío: empieza con «Entidad»'}</text>`;
    return (live?this.gridSVG():'')+L+S+MK+TX+this.notesSVG(live)+empty+(live?this.bandSVG():'');
  }
  tablesString(live){
    if(live)tableDups(this.m);else this.m.t.forEach(t=>{t._dup=false;t._dupCols=null;});
    const st=Settings.get(),spec={W,H,t:this.m.t,ortho:st.lines==='ortho',not:'chen',hit:live,selFk:live?this.selLink:null};let inner='',boxes=[];const D=live?this.diffMarks():{};
    if(this.mode==='ded'){inner=drawDED(spec).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');boxes=this.m.t.map(t=>[t,t.x,t.y,t.w,t.h]);}
    else {inner=drawRef(spec,true).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');boxes=this.m.t.map(t=>[t,t.x,t.y,t.rw,18+t.rh]);}
    let Hh='';if(live)boxes.forEach(([t,x,y,w,h])=>{Hh+=`<rect x="${x}" y="${y}" width="${f1(w)}" height="${f1(h)}" class="hitbox" data-id="${t.id}"/>`;
      if(D[t.id])Hh+=`<rect x="${x-9}" y="${y-9}" width="${f1(w+18)}" height="${f1(h+18)}" rx="9" class="dfbox ${D[t.id]}" pointer-events="none"/>`;
      if(this.locked(t))Hh+=`<g pointer-events="none">${lockIcon(x+w-2,y-2)}</g>`;
      if(this.selIds.has(t.id))Hh+=`<rect x="${x-6}" y="${y-6}" width="${f1(w+12)}" height="${f1(h+12)}" rx="8" class="selbox" pointer-events="none"/>`;
      if(this.from===t.id)Hh+=`<rect x="${x-6}" y="${y-6}" width="${f1(w+12)}" height="${f1(h+12)}" rx="8" class="frombox" pointer-events="none"/>`;});
    const empty=this.items().length||!live?'':`<text x="0" y="0" text-anchor="middle" class="emp">Lienzo vacío: empieza con «Tabla» o «Pasar desde mi E-R»</text>`;
    const grid=live?this.gridSVG():'';
    return grid+inner+Hh+this.notesSVG(live)+empty+(live?this.bandSVG():'');
  }
  notesSVG(live){const D=live?this.diffMarks():{};return this.notes.map(n=>{let g=noteSVG(n);if(live&&this.locked(n))g+=lockIcon(n.x+n.w-2,n.y-2);
    if(live&&this.selIds.has(n.id))g+=`<rect x="${n.x-6}" y="${n.y-6}" width="${n.w+12}" height="${n.h+12}" rx="6" class="selbox"/>`;
    return `<g class="node notecard" data-id="${n.id}">${g}</g>`;}).join('');}
  markDup(){ // marca en rojo el campo del nombre si está repetido
    const one=this.single();const inp=this.insp.querySelector('[data-f=name],[data-f=tname]');const w=this.insp.querySelector('.dupmsg');
    let bad=false;if(one&&this.isER)bad=erDups(this.m).has(one.id);else if(one){tableDups(this.m);bad=one._dup;}
    if(inp)inp.classList.toggle('bad',bad);if(w)w.hidden=!bad;
    this.insp.querySelectorAll('[data-f=cname]').forEach(i=>{const t=this.single();if(!t||!t._dupCols)return;i.classList.toggle('bad',t._dupCols.has(lc(i.value)));});
  }
  /* ---------- Panel de propiedades ---------- */
  cardQ(from,to,l){const c=mmOf(l);const sb=(k,v)=>`<button class="segb" data-card="${k}" data-v="${v}" data-link="${l.id}" aria-pressed="${c[k]===v}">${v}</button>`;
    return `<div class="cq"><div class="in-q"><b class="qe">${esc(from)}</b> ¿cuántas/os <b class="qe">${esc(to)}</b> puede tener como…</div>
      <div class="cardrow"><span>máximo</span><div class="seg">${sb('mx','1')}${sb('mx','N')}</div></div>
      <div class="cardrow"><span>mínimo</span><div class="seg">${sb('mn','0')}${sb('mn','1')}</div></div>
      <div class="cres">junto a «${esc(to)}»: <b class="cd">(${c.mn??'?'},${c.mx??'?'})</b></div></div>`;}
  cardBlock(r,onlyLink){const X=this.X(),ls=X.ends(r);let h='';
    if(ls.length===2){const [A,B]=ls;if(!onlyLink||onlyLink===B.l.id)h+=this.cardQ(A.e.n,B.e.n,B.l);if(!onlyLink||onlyLink===A.l.id)h+=this.cardQ(B.e.n,A.e.n,A.l);}
    else if(ls.length>2)ls.forEach(x=>{if(!onlyLink||onlyLink===x.l.id)h+=this.cardQ(ls.filter(y=>y!==x).map(y=>y.e.n).join(' + '),x.e.n,x.l);});
    else h+=`<p class="in-p">Une la relación con dos entidades.</p>`;return h;}
  attrList(o){const X=this.X(),dups=erDups(this.m),at=X.attrsOf(o);
    return `<div class="in-sub">${isAtt(o)?'Partes':'Atributos'} <span class="cnt">${at.length}</span></div><div class="alist">${at.map(a=>`<button class="aitem${dups.has(a.id)?' bad':''}" data-goto="${a.id}" title="Editar «${escA(a.n)}»">${attrIcon(a)}<span>${esc(a.n)}</span>${a.f.k?'<em>PK</em>':a.f.p?'<em>parcial</em>':''}</button>`).join('')||'<span class="in-p">Sin atributos todavía.</span>'}</div>
      <button class="ebtn" data-act="${isAtt(o)?'addpart':'addattr'}">${GL.attr}<span>Añadir ${isAtt(o)?'parte':'atributo'}</span></button>`;}
  renderInsp(){
    const one=this.single();const any=this.selIds.size>0||this.selLink||this.pend;
    const show=this.pinned||any;this.main.classList.toggle('noinsp',!show);if(!show){this.insp.innerHTML='';return;}
    const chk=(f,txt,on,ic,sub='')=>`<label class="chk"><input type="checkbox" data-f="${f}" ${on?'checked':''}><span class="chk-ic">${GL[ic]||''}</span><span class="chk-t">${txt}${sub?`<small>${sub}</small>`:''}</span><span class="sw" aria-hidden="true"></span></label>`;
    const head=t=>`<div class="in-h"><span>${t}</span><button class="pinb" data-act="pin" aria-pressed="${this.pinned}" title="${this.pinned?'Panel fijo: se queda aunque no haya nada seleccionado':'Panel automático: se oculta si no hay nada seleccionado'}">${GL.pin}</button></div>`;
    const lockChk=n=>chk('lock','Bloquear posición',this.locked(n),'lock','No se mueve al arrastrarlo ni al distribuir');
    const nameF=(f,v,lab)=>`<label class="fld">${lab}<input type="text" data-f="${f}" value="${escA(v)}" spellcheck="false"></label><p class="dupmsg" hidden>Ya hay otro elemento con este nombre. Cámbialo.</p>`;
    let h='';
    if(this.pend){const A=this.node(this.pend.a),B=this.node(this.pend.b),P=this.pend;
      const opt=(k,v,txt,sub)=>`<button class="opt" data-pend="${k}" data-v="${v}" aria-pressed="${P[k]===v}"><b>${txt}</b>${sub?`<small>${sub}</small>`:''}</button>`;
      if(P.ca){const q=(side,from,to)=>{const c=P['c'+side];const sb=(k,v)=>`<button class="segb" data-pendc="${side}" data-k="${k}" data-v="${v}" aria-pressed="${c[k]===v}">${v}</button>`;
          return `<div class="cq"><div class="in-q"><b class="qe">${esc(from)}</b> ¿cuántas/os <b class="qe">${esc(to)}</b> puede tener como…</div><div class="cardrow"><span>máximo</span><div class="seg">${sb('mx','1')}${sb('mx','N')}</div></div><div class="cardrow"><span>mínimo</span><div class="seg">${sb('mn','0')}${sb('mn','1')}</div></div><div class="cres">junto a «${esc(to)}»: <b class="cd">(${c.mn??'?'},${c.mx??'?'})</b></div></div>`;};
        const r=dedPlan(P),res=!r?'':r.type==='NM'?`N:M → se crea una tabla nueva con las dos claves (línea continua).`:`${r.type==='11'?'1:1':'1:N'} → «${esc(r.dir==='ab'?B.n:A.n)}» recibe la clave de «${esc(r.dir==='ab'?A.n:B.n)}»${r.req||r.ident?'':' (puede quedar vacía)'}.`;
        h+=head('Nueva relación')+`<p class="in-p"><b>${esc(A.n)}</b> y <b>${esc(B.n)}</b></p><div class="in-sub">Cardinalidades</div>`+q('b',A.n,B.n)+q('a',B.n,A.n)+
          `<div class="in-sub">Línea</div><div class="seg wide"><button class="segb" data-pend="line" data-v="cont" aria-pressed="${P.line==='cont'}"><svg width="22" height="6" aria-hidden="true" style="vertical-align:middle;margin-right:6px"><line x1="0" y1="3" x2="22" y2="3" stroke="currentColor" stroke-width="1.6"/></svg>Continua</button><button class="segb" data-pend="line" data-v="dash" aria-pressed="${P.line!=='cont'}"><svg width="22" height="6" aria-hidden="true" style="vertical-align:middle;margin-right:6px"><line x1="0" y1="3" x2="22" y2="3" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4 3"/></svg>Discontinua</button></div>
          <p class="in-p">${P.line==='cont'?'Identificadora: la FK formará parte de la PK.':'No identificadora: la FK será una columna normal.'}</p>`+(res?`<p class="in-p"><b>${res}</b></p>`:'')+
          `<div class="in-actions"><button class="ebtn" data-pend="cancel">Cancelar</button><button class="ebtn pri" data-pend="create">Crear relación</button></div>`;}
      else{h+=head('Nueva relación')+`<p class="in-p"><b>${esc(A.n)}</b> y <b>${esc(B.n)}</b></p>
        ${this.mode==='rel'?'':`<div class="in-sub">Tipo</div>`}<div class="seg wide"${this.mode==='rel'?' hidden':''}>${['1N','11','NM'].map(t=>`<button class="segb" data-pend="type" data-v="${t}" aria-pressed="${P.type===t}">${t==='1N'?'1:N':t==='11'?'1:1':'N:M'}</button>`).join('')}</div>
        ${P.type==='NM'?`<p class="in-p">Se crea una tabla nueva con las dos claves.</p>`:`<div class="in-sub">¿Qué tabla recibe la clave (FK)?</div>${opt('dir','ab',esc(B.n),'recibe la PK de '+esc(A.n))}${opt('dir','ba',esc(A.n),'recibe la PK de '+esc(B.n))}
        <label class="chk"${this.mode==='rel'?' hidden':''}><input type="checkbox" data-pendchk="req" ${P.req?'checked':''}><span class="chk-ic">${GL.nncol}</span><span class="chk-t">Obligatoria<small>La FK no puede quedar vacía (NOT NULL)</small></span><span class="sw"></span></label>
        <label class="chk"><input type="checkbox" data-pendchk="ident" ${P.ident?'checked':''}><span class="chk-ic">${GL.pkcol}</span><span class="chk-t">Identificadora<small>La FK forma parte de la PK (línea continua)</small></span><span class="sw"></span></label>`}
        <div class="in-actions"><button class="ebtn" data-pend="cancel">Cancelar</button><button class="ebtn pri" data-pend="create">Crear relación</button></div>`;}}
    else if(this.selIds.size>1){const ab=(k,t,ic)=>`<button class="algb" data-align="${k}" title="${t}" aria-label="${t}">${ic}</button>`;
      h+=head(`${this.selIds.size} elementos`)+`<p class="in-p">Arrástralos para moverlos juntos. Ctrl+C copia, Supr borra.</p>
        <div class="in-sub">Alinear</div><div class="alg">${ab('l','Alinear a la izquierda',ALG.l)}${ab('c','Centrar en horizontal',ALG.c)}${ab('r','Alinear a la derecha',ALG.r)}${ab('t','Alinear arriba',ALG.t)}${ab('m','Centrar en vertical',ALG.m)}${ab('b','Alinear abajo',ALG.b)}</div>
        <div class="in-sub">Repartir</div><div class="alg">${ab('dh','Repartir en horizontal (mismo espacio)',ALG.dh)}${ab('dv','Repartir en vertical (mismo espacio)',ALG.dv)}</div>`;
      const ents=[...this.selIds].map(x=>this.node(x)).filter(isEnt);
      if(this.isER&&!this.isBo&&ents.length>=2&&ents.length===this.selIds.size)h+=`<div class="in-actions"><button class="ebtn" data-act="mkrel">${GL.rel}<span>${ents.length===3?'Relación ternaria entre las 3':'Relación entre las '+ents.length}</span></button></div>`;
      h+=`<div class="in-actions"><button class="ebtn" data-act="lock">${GL.lock}<span>${[...this.selIds].every(x=>this.locked(this.node(x)))?'Desbloquear':'Bloquear'} posición</span></button></div>`;}
    else if(isNote(one)){h+=head('Nota')+`<label class="fld">Texto<textarea data-f="ntext" rows="5" spellcheck="true" placeholder="Escribe aquí tu duda o explicación">${esc(one.text||'')}</textarea></label>
        <div class="in-sub">Color</div><div class="seg wide">${Object.entries(NOTE_COLORS).map(([k,v])=>`<button class="segb ncsw nc-${k}" data-ncol="${k}" aria-pressed="${(one.c||'y')===k}">${v}</button>`).join('')}</div>
        <div class="in-sub">Ancho</div><div class="seg wide">${[[150,'Estrecha'],[200,'Normal'],[280,'Ancha']].map(([w,t])=>`<button class="segb" data-nw="${w}" aria-pressed="${Math.abs((one.w||180)-w)<30}">${t}</button>`).join('')}</div>`+lockChk(one);}
    else if(this.isBo&&one&&isEnt(one)){const X=this.X(),nb=X.linksOf(one.id).map(l=>X.other(l,one.id)).filter(isEnt);
      h+=head('Entidad (boceto)')+nameF('name',one.n,'Nombre')+`<div class="in-sub">Atributos <span class="cnt">${(one.f.at||[]).length}</span></div><p class="in-p">${(one.f.at||[]).length?(one.f.at.map(a=>esc(a)).join(', ')):'Escríbelos en la zona de arriba: <code>'+esc(one.n)+'; atributo1, atributo2</code>'}</p>`+`<div class="in-sub">Unida con <span class="cnt">${nb.length}</span></div><div class="alist">${nb.map(e=>`<button class="aitem" data-goto="${e.id}">${GL.ent}<span>${esc(e.n)}</span></button>`).join('')||'<span class="in-p">Con nadie todavía. Mayús + clic en otra entidad para unirlas.</span>'}</div>`+lockChk(one)+
        `<p class="in-p">En el boceto solo hay entidades y líneas: sirve para pensar qué se relaciona con qué. Cuando lo tengas, pulsa «Pasar al E-R».</p><div class="in-actions"><button class="ebtn" data-act="bo2er">${GL.fromer}<span>Pasar al E-R</span></button></div>`;}
    else if(!this.isER&&this.selLink){const s=this.fkSel();if(!s){this.selLink=null;return this.renderInsp();}const ded=this.mode==='ded',has=k=>s.cols.every(c=>parseF(c[2])[k]);
      const tg=(k,txt,sub,ic)=>`<button class="opt" data-fkact="${k}" aria-pressed="${has(k)}"><b>${GL[ic]||''} ${txt}</b><small>${sub}</small></button>`;
      h+=head(ded?'Relación (DED)':'Flecha (relacional)')+`<p class="in-p"><b>${esc(s.t.n)}</b> → <b>${esc(s.pa.n)}</b></p>
        <p class="in-p">La clave ajena (FK) está en «${esc(s.t.n)}»: <b>${s.cols.map(c=>esc(c[0])).join(', ')}</b>. Apunta a la clave primaria de «${esc(s.pa.n)}».</p>
        <div class="in-actions"><button class="ebtn" data-fkact="swap">${GL.fromer||''}<span>Pasar la FK a «${esc(s.pa.n)}»</span></button></div>`+
        (ded?(()=>{const sb=(k,v,on,t)=>`<button class="segb" data-fkset="${k}" data-v="${v}" aria-pressed="${on}">${t}</button>`,uq=has('uq'),nul=s.cols.some(c=>parseF(c[2]).nul),pk=has('pk');
          return `<div class="in-sub">Cardinalidades</div>
          <div class="cq"><div class="in-q"><b class="qe">${esc(s.pa.n)}</b> ¿cuántas/os <b class="qe">${esc(s.t.n)}</b> puede tener como…</div><div class="cardrow"><span>máximo</span><div class="seg">${sb('uq',1,uq,'1')}${sb('uq',0,!uq,'N')}</div></div><div class="cardrow"><span>mínimo</span><div class="seg"><button class="segb" disabled aria-pressed="true" title="En el DED el lado de la tabla hija siempre puede tener cero">0</button></div></div><div class="cres">junto a «${esc(s.t.n)}»: <b class="cd">(0,${uq?'1':'N'})</b></div></div>
          <div class="cq"><div class="in-q"><b class="qe">${esc(s.t.n)}</b> ¿cuántas/os <b class="qe">${esc(s.pa.n)}</b> puede tener como…</div><div class="cardrow"><span>máximo</span><div class="seg"><button class="segb" disabled aria-pressed="true" title="La FK guarda un solo valor">1</button></div></div><div class="cardrow"><span>mínimo</span><div class="seg">${sb('nul',1,nul,'0')}${sb('nul',0,!nul,'1')}</div></div><div class="cres">junto a «${esc(s.pa.n)}»: <b class="cd">(${nul?'0':'1'},1)</b></div></div>
          <div class="in-sub">Línea</div><div class="seg wide">${sb('pk',1,pk,'<svg width="22" height="6" aria-hidden="true" style="vertical-align:middle;margin-right:6px"><line x1="0" y1="3" x2="22" y2="3" stroke="currentColor" stroke-width="1.6"/></svg>Continua')}${sb('pk',0,!pk,'<svg width="22" height="6" aria-hidden="true" style="vertical-align:middle;margin-right:6px"><line x1="0" y1="3" x2="22" y2="3" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4 3"/></svg>Discontinua')}</div><p class="in-p">${pk?'Identificadora: la FK forma parte de la PK.':'No identificadora: la FK es una columna normal.'}</p>`;})():'')+
        `<div class="in-actions"><button class="ebtn danger" data-fkact="del">${GL.clear||''}<span>Quitar la relación</span></button></div>`;}
    else if(this.isBo&&this.selLink){const l=this.m.links.find(x=>x.id===this.selLink),X=this.X();if(!l){this.selLink=null;return this.renderInsp();}const A=X.N[l.a],B=X.N[l.b];
      const q=(side,from,to)=>{const v=l['e'+side]||'??',c={mn:v[0]==='?'?null:v[0],mx:v[1]==='?'?null:v[1]};
        const sb=(k,x)=>`<button class="segb" data-bocard="${side}" data-k="${k}" data-v="${x}" aria-pressed="${c[k]===x}">${x}</button>`;
        return `<div class="cq"><div class="in-q"><b class="qe">${esc(from)}</b> ¿cuántas/os <b class="qe">${esc(to)}</b> puede tener como…</div>
          <div class="cardrow"><span>máximo</span><div class="seg">${sb('mx','1')}${sb('mx','N')}</div></div>
          <div class="cardrow"><span>mínimo</span><div class="seg">${sb('mn','0')}${sb('mn','1')}</div></div>
          <div class="cres">junto a «${esc(to)}»: <b class="cd">(${c.mn??'?'},${c.mx??'?'})</b></div></div>`;};
      h+=head('Línea (boceto)')+`<p class="in-p"><b>${esc(A.n)}</b> — <b>${esc(B.n)}</b></p><div class="in-sub">Cardinalidades (opcional)</div>`+q('b',A.n,B.n)+q('a',B.n,A.n)+
        `<p class="in-p bo-leg">Igual que en el E-R. Al pulsar «Pasar al E-R» se ponen en la relación.</p>`+
        `<div class="in-sub">Atributos de la relación <span class="cnt">${(l.at||[]).length}</span></div><p class="in-p">${(l.at||[]).length?l.at.map(a=>esc(a)).join(', '):'Ninguno. Si la relación tiene atributos, escríbelos arriba: <code>'+esc(A.n)+'-'+esc(B.n)+'; atributo1, atributo2</code>'}</p>`;}
    else if(false){const l=null,A=null,B=null;
      h+=head('Línea (boceto)')+`<p class="in-p"><b>${esc(A.n)}</b> — <b>${esc(B.n)}</b></p><div class="in-sub">¿Qué crees que será? (opcional)</div>
        <div class="seg wide">${[['','?'],['11','1:1'],['1N','1:N'],['N1','N:1'],['NM','N:M']].map(([v,t])=>`<button class="segb" data-skt="${v}" aria-pressed="${(l.t||'')===v}">${t}</button>`).join('')}</div>
        <p class="in-p">${l.t==='1N'?`Una/o ${esc(A.n)} con muchas/os ${esc(B.n)}.`:l.t==='N1'?`Muchas/os ${esc(A.n)} con una/o ${esc(B.n)}.`:l.t==='NM'?'Muchas/os con muchas/os.':l.t==='11'?'Una/o con una/o.':'Aún sin decidir: no hace falta.'} Al pasarlo al E-R se ponen los máximos; los mínimos los decides allí.</p>`;}
    else if(isIsa(one)){const X=this.X(),sup=X.superOf(one),subs=X.subsOf(one),all=X.linksOf(one.id).map(l=>X.other(l,one.id)).filter(isEnt),f=one.f;
      const sb=(k,v,t,on)=>`<button class="segb" data-isa="${k}" data-v="${v}" aria-pressed="${on}">${t}</button>`;
      h+=head('Jerarquía (ISA)')+`<p class="in-p">Generalización / especialización. Etiqueta: <b>${esc(isaLabel(f))}</b></p>
        <div class="in-sub">Supertipo (la entidad general, arriba)</div>${all.length?`<div class="seg wide">${all.map(e=>sb('sup',e.id,esc(e.n),sup===e)).join('')}</div>`:'<p class="in-p warn">Une el triángulo a la entidad general (Mayús + clic).</p>'}
        <div class="in-sub">Subtipos <span class="cnt">${subs.length}</span></div><div class="alist">${subs.map(e=>`<button class="aitem" data-goto="${e.id}">${GL.ent}<span>${esc(e.n)}</span></button>`).join('')||'<span class="in-p">Ninguno todavía.</span>'}</div>
        <button class="ebtn" data-act="addsub">${GL.ent}<span>Añadir subtipo</span></button>
        <div class="in-sub">Cobertura</div><div class="seg wide">${sb('tot','1','Total',!!f.tot)}${sb('tot','0','Parcial',!f.tot)}</div><p class="in-p">${f.tot?'Todo '+esc(sup?sup.n:'supertipo')+' es de algún subtipo.':'Puede haber '+esc(sup?sup.n:'supertipo')+' que no sea de ningún subtipo.'}</p>
        <div class="in-sub">Solapamiento</div><div class="seg wide">${sb('dis','1','Exclusiva',f.dis!==false)}${sb('dis','0','Solapada',f.dis===false)}</div><p class="in-p">${f.dis===false?'Uno puede ser de varios subtipos a la vez.':'Cada uno es como mucho de un subtipo.'}</p>
        <div class="in-sub">Al pasar a tablas</div><div class="optcol">${[['each','Una tabla por entidad','Cada subtipo lleva la PK del supertipo (como PK y FK). Vale siempre.'],['up','Todo en la tabla del supertipo','Las columnas de los subtipos van al supertipo (pueden quedar vacías) y se añade «tipo».'],['down','Solo las tablas de los subtipos','Cada subtipo copia las columnas del supertipo. Solo si es total.']].map(([v,t,sub])=>`<button class="opt" data-isa="map" data-v="${v}" aria-pressed="${(f.map||'each')===v}"><b>${t}</b><small>${sub}</small></button>`).join('')}</div>`+lockChk(one);}
    else if(this.isER&&one){const X=this.X(),n=one;
      if(isEnt(n)){const isub=X.isaOfSub(n);h+=head('Entidad')+nameF('name',n.n,'Nombre')+chk('weak','Entidad débil',n.k==='weak','weak','Doble rectángulo')+(isub&&X.superOf(isub)?`<p class="in-p">Subtipo de <button class="lnk" data-goto="${isub.id}">${esc(X.superOf(isub).n)}</button>: hereda su clave, no necesita PK propia.</p>`:'')+this.attrList(n)+lockChk(n);}
      else if(isRel(n)){const t=X.relType(n),ne=X.ends(n).length;h+=head('Relación'+(t?` <span class="badge">${t}</span>`:''))+nameF('name',n.n,'Nombre')+chk('idrel','Identificadora',n.k==='idrel','idrel','Doble rombo')+chk('as','Entidad asociativa',!!n.f.as,'ent','Rectángulo alrededor del rombo: se puede relacionar con otras entidades')+`<div class="in-sub">Cardinalidades</div>`+this.cardBlock(n)+(ne===2?`<p class="in-p">¿Ternaria? Une una tercera entidad a la relación con Mayús + clic.</p>`:'')+this.attrList(n)+lockChk(n);}
      else{const ow=X.ownerOf(n),f=n.f;h+=head('Atributo')+nameF('name',n.n,'Nombre')+(ow?`<p class="in-p">De <button class="lnk" data-goto="${ow.id}">${esc(ow.n)}</button></p>`:`<p class="in-p warn">No está unido a nada. Usa Mayús + clic en su entidad.</p>`)+
        `<div class="in-sub">Tipo</div>`+chk('f-k','Clave primaria',f.k,'key','Subrayado')+(ow&&ow.k==='weak'||f.p?chk('f-p','Clave parcial',f.p,'partial','Subrayado discontinuo'):'')+chk('f-o','Opcional',f.o,'opt','Puede quedar vacío')+chk('f-d','Derivado',f.d,'deriv','Se calcula, no se guarda')+chk('f-m','Multivaluado',f.m,'multi','Varios valores')+chk('f-c','Compuesto',f.c,'comp','Formado por partes')+(f.c?this.attrList(n):'')+lockChk(n);}}
    else if(this.isER&&this.selLink){const l=this.m.links.find(x=>x.id===this.selLink),X=this.X();if(!l){this.selLink=null;return this.renderInsp();}
      const a=X.N[l.a],b=X.N[l.b];h+=head('Línea');if(X.cardable(l)){const r=isRel(a)?a:b;h+=this.cardBlock(r,l.id);}else h+=`<p class="in-p">${esc(a.n)} — ${esc(b.n)}</p>`;}
    else if(!this.isER&&one){const t=one,ded=this.mode==='ded',names=this.m.t.map(x=>x.n);tableDups(this.m);
      h+=head('Tabla')+nameF('tname',t.n,'Nombre')+`<div class="in-sub">Columnas <span class="cnt">${t.c.length}</span></div>`;
      t.c.forEach((c,k)=>{const f=parseF(c[2]),bad=t._dupCols.has(lc(c[0]));
        h+=`<div class="colrow"><input type="text" data-f="cname" data-ci="${k}" value="${escA(c[0])}" placeholder="Columna" aria-label="Nombre de la columna" spellcheck="false" class="${bad?'bad':''}">${ded?`<input type="text" class="ctype" data-f="ctype" data-ci="${k}" value="${escA(c[1])}" list="types" placeholder="Tipo" aria-label="Tipo" spellcheck="false">`:''}
        <button class="xbtn" data-act="delcol" data-ci="${k}" aria-label="Borrar columna">✕</button>
        <span class="tgs"><label class="tg" title="Clave primaria"><input type="checkbox" data-f="pk" data-ci="${k}" ${f.pk?'checked':''}>${GL.pkcol}<span>PK</span></label><label class="tg" title="Clave ajena"><input type="checkbox" data-f="fk" data-ci="${k}" ${f.fk?'checked':''}>${GL.fkcol}<span>FK</span></label><label class="tg" title="NOT NULL: no puede quedar vacía"><input type="checkbox" data-f="nn" data-ci="${k}" ${f.nul?'':'checked'}>${GL.nncol}<span>NN</span></label><label class="tg" title="UNIQUE: no se puede repetir"><input type="checkbox" data-f="uq" data-ci="${k}" ${f.uq?'checked':''}>${GL.uqcol}<span>Único</span></label></span>
        ${f.fk?`<select data-f="fkt" data-ci="${k}" aria-label="Tabla a la que apunta">${names.map(nm=>`<option ${nm===f.fk?'selected':''}>${esc(nm)}</option>`).join('')}</select>`:''}</div>`;});
      h+=`<div class="in-actions"><button class="ebtn" data-act="addcol">${GL.table}<span>Añadir columna</span></button></div>`+lockChk(t);}
    else h+=head('Propiedades')+`<p class="in-p">Selecciona algo para editarlo.</p>`;
    if(this.ro)h=`<p class="in-p rotag">${GL.lock} Solo lectura</p>`+h;
    this.insp.innerHTML=h;
    if(this.ro)this.insp.querySelectorAll('input,select,textarea,button:not(.pinb):not([data-goto])').forEach(x=>{x.disabled=true;});
    this.insp.querySelectorAll('[data-pendchk]').forEach(i=>i.addEventListener('change',()=>{this.pend[i.dataset.pendchk]=i.checked;}));
    this.markDup();
  }
  apply(el){
    const f=el.dataset.f;if(!f||el.dataset.pendchk)return;
    const sn=this.single();if(f==='lock'){this.setLock(sn,el.checked);return;}if(isNote(sn)){if(f==='ntext')sn.text=el.value;return;}
    if(this.isER){const n=this.single();if(!n)return;
      if(f==='name')n.n=el.value;else if(f==='weak')n.k=el.checked?'weak':'ent';else if(f==='idrel')n.k=el.checked?'idrel':'rel';else if(f==='as'){if(!!n.f.as!==el.checked)this.toggleAssoc(n);}
      else if(f.startsWith('f-')){n.f[f.slice(2)]=el.checked;if(f==='f-k'&&el.checked)n.f.p=false;if(f==='f-p'&&el.checked)n.f.k=false;}
      return;}
    const t=this.single();if(!t)return;
    if(f==='tname'){const old=t.n;t.n=el.value;this.m.t.forEach(o=>o.c.forEach(c=>{const g=parseF(c[2]);if(g.fk===old){g.fk=t.n;c[2]=joinF(g);}}));return;}
    const c=t.c[+el.dataset.ci];if(!c)return;
    if(f==='cname')c[0]=el.value;else if(f==='ctype')c[1]=el.value;
    else{const g=parseF(c[2]);
      if(f==='pk'||f==='uq')g[f]=el.checked?1:0;else if(f==='nn')g.nul=el.checked?0:1;
      else if(f==='fk')g.fk=el.checked?(this.m.t.find(o=>o!==t)||t).n:null;else if(f==='fkt')g.fk=el.value;
      c[2]=joinF(g);}
  }
  align(k){
    const its=[...this.selIds].map(id=>this.node(id)).filter(Boolean);if(its.length<2)return;
    if((k==='dh'||k==='dv')&&its.length<3){toast('Para repartir hacen falta al menos 3 elementos.');return;}
    this.snap();const X=this.isER?this.X():null,sel=this.selIds;
    const move=(n,dx,dy)=>{const seen=new Set();const mv=o=>{if(seen.has(o.id)||this.locked(o))return;seen.add(o.id);o.x=Math.round(o.x+dx);o.y=Math.round(o.y+dy);
      if(X&&!isNote(o)&&(!isAtt(o)||o.f.c))X.attrsOf(o).forEach(a=>{if(!sel.has(a.id))mv(a);});};mv(n);};
    const B=its.map(n=>({n,b:this.boxOf(n)}));
    const x0=Math.min(...B.map(o=>o.b[0])),x1=Math.max(...B.map(o=>o.b[2])),y0=Math.min(...B.map(o=>o.b[1])),y1=Math.max(...B.map(o=>o.b[3]));
    if(k==='dh'||k==='dv'){const h=k==='dh',a=h?0:1,z=h?2:3,s=[...B].sort((p,q)=>p.b[a]-q.b[a]);
      const size=s.reduce((t,o)=>t+o.b[z]-o.b[a],0);let gap=((h?x1-x0:y1-y0)-size)/(s.length-1);if(gap<16)gap=30;let cur=h?x0:y0;
      s.forEach(o=>{const d=cur-o.b[a];move(o.n,h?d:0,h?0:d);cur+=o.b[z]-o.b[a]+gap;});}
    else B.forEach(({n,b})=>{const d={l:[x0-b[0],0],r:[x1-b[2],0],c:[(x0+x1)/2-(b[0]+b[2])/2,0],t:[0,y0-b[1]],b:[0,y1-b[3]],m:[0,(y0+y1)/2-(b[1]+b[3])/2]}[k];move(n,d[0],d[1]);});
    this.save();this.render();this.renderInsp();
  }
  /* ---------- Distribuir el relacional / DED ---------- */
  distributeTables(){
    const ts=this.m.t;if(!ts.length)return;const free=ts.filter(t=>!this.locked(t)),fixed=ts.filter(t=>this.locked(t));
    if(!free.length){toast('Todas las tablas están bloqueadas.');return;}this.snap();
    const rel=this.mode==='rel',size=t=>rel?refSize(t):tableSize(t);
    const tmp=free.map(t=>({n:t.n,c:t.c}));layoutSmart(tmp,{size,others:ts});
    free.forEach((t,i)=>{t.x=tmp[i].x;t.y=tmp[i].y;});
    if(fixed.length)keepClear(free,fixed,size);
    this.save();this.render();this.fit(true);toast(fixed.length?'Tablas distribuidas (las bloqueadas no se mueven). Ctrl+Z para volver atrás.':'Tablas distribuidas. Ctrl+Z para volver atrás.');
  }
  /* ---------- Distribuir el E-R ---------- */
  distribute(){
    // Coloca las entidades en una cuadrícula siguiendo sus relaciones, cada relación entre sus entidades
    // y los atributos repartidos alrededor de su dueño, por el lado contrario a las líneas.
    if(!this.isER){this.distributeTables();return;}
    if(!this.m.nodes.length)return;this.snap();const X=this.X();const ns=this.m.nodes;ns.forEach(n=>this.size(n,X));
    // lo bloqueado (y los atributos de una entidad bloqueada) se queda donde está
    const keep=new Map();const keepIt=n=>{if(keep.has(n.id))return;keep.set(n.id,[n.x,n.y]);if(!isAtt(n)||n.f.c)X.attrsOf(n).forEach(keepIt);};ns.filter(n=>this.locked(n)).forEach(keepIt);
    const ents=ns.filter(isEnt),rels=ns.filter(isRel),attrs=ns.filter(isAtt),isas=ns.filter(isIsa);
    const deg=new Map(ents.map(e=>[e.id,0])),adj=new Map(ents.map(e=>[e.id,new Set()]));
    const join=es=>es.forEach(a=>{deg.set(a,deg.get(a)+1);es.forEach(b=>{if(a!==b)adj.get(a).add(b);});});
    rels.forEach(r=>join([...new Set(X.ends(r).map(x=>x.e.id))]));
    this.m.links.forEach(l=>{if(isEnt(X.N[l.a])&&isEnt(X.N[l.b])&&l.a!==l.b)join([l.a,l.b]);}); // líneas directas del boceto
    const supOf={};isas.forEach(i=>{const s=X.superOf(i);if(!s)return;X.subsOf(i).forEach(e=>{supOf[e.id]=s.id;join([s.id,e.id]);});});
    const nAtt=o=>X.attrsOf(o).length,maxA=Math.max(60,...attrs.map(a=>a.w));
    const cellW=this.isBo?Math.max(110,...ents.map(e=>e.w))+170:Math.max(110,...ents.map(e=>e.w))+2*(maxA+34)+140;
    const cellH=this.isBo?Math.max(40,...ents.map(e=>e.h))+130:Math.max(...ents.map(e=>nAtt(e)>4?250:200),200)+140;
    // 1) entidades en la cuadrícula
    const done=new Set(),byDeg=(a,b)=>adj.get(b.id).size-adj.get(a.id).size||nAtt(b)-nAtt(a);
    let ox=0,oy=0,rowH=0;const ROWMAX=4;
    for(const root of [...ents].sort(byDeg)){
      if(done.has(root.id))continue;
      const comp=[],q=[root];done.add(root.id);
      while(q.length){const e=q.shift();comp.push(e);[...adj.get(e.id)].map(id=>X.N[id]).sort(byDeg).forEach(n=>{if(!done.has(n.id)){done.add(n.id);q.push(n);}});}
      const pos={},taken=new Set(),K=(x,y)=>x+','+y;
      comp.forEach((e,i)=>{
        if(!i){pos[e.id]=[0,0];taken.add(K(0,0));return;}
        const nb=[...adj.get(e.id)].filter(id=>pos[id]),base=pos[nb[0]];let best=null;
        for(let dx=-3;dx<=3;dx++)for(let dy=-3;dy<=3;dy++){const c=[base[0]+dx,base[1]+dy];if(taken.has(K(...c)))continue;
          let sc=0;nb.forEach(id=>{const p=pos[id],ax=Math.abs(p[0]-c[0]),ay=Math.abs(p[1]-c[1]);sc+=ax+ay+(ax&&ay?0.5:0);
            // evita quedar en línea recta detrás de otra entidad (la línea la atravesaría)
            if((ax===0&&ay>1)||(ay===0&&ax>1))sc+=1.5;});
          sc+=Math.abs(dy)*0.1+Math.abs(dx)*0.02;
          // en una jerarquía, los subtipos debajo del supertipo
          if(supOf[e.id]&&pos[supOf[e.id]]&&c[1]<=pos[supOf[e.id]][1])sc+=4;
          Object.keys(supOf).forEach(sid=>{if(supOf[sid]===e.id&&pos[sid]&&c[1]>=pos[sid][1])sc+=4;});
          // que el conjunto quede compacto (ni una fila larga ni una columna)
          const xs=[...Object.values(pos).map(p=>p[0]),c[0]],ys=[...Object.values(pos).map(p=>p[1]),c[1]];
          sc+=0.45*Math.max(0,Math.max(...xs)-Math.min(...xs)-2)+0.45*Math.max(0,Math.max(...ys)-Math.min(...ys)-1);
          if(!best||sc<best.sc)best={c,sc};}
        pos[e.id]=best.c;taken.add(K(...best.c));});
      const P=Object.values(pos),x0=Math.min(...P.map(p=>p[0])),x1=Math.max(...P.map(p=>p[0])),y0=Math.min(...P.map(p=>p[1])),y1=Math.max(...P.map(p=>p[1]));
      const w=x1-x0+1,h=y1-y0+1;
      if(ox>0&&ox+w>ROWMAX){ox=0;oy+=rowH;rowH=0;}
      comp.forEach(e=>{const p=pos[e.id];e.x=(p[0]-x0+ox)*cellW;e.y=(p[1]-y0+oy)*cellH;});
      ox+=w;rowH=Math.max(rowH,h);
    }
    // 2) relaciones
    const box=n=>[n.x-n.w/2,n.y-n.h/2,n.x+n.w/2,n.y+n.h/2];
    const hits=(n,m)=>ents.some(e=>e!==n&&Math.abs(n.x-e.x)<(n.w+e.w)/2+m&&Math.abs(n.y-e.y)<(n.h+e.h)/2+m)||rels.some(r=>r!==n&&r._p&&Math.abs(n.x-r.x)<(n.w+r.w)/2+10&&Math.abs(n.y-r.y)<(n.h+r.h)/2+10);
    const pairN={},pairI={};
    rels.forEach(r=>{const es=[...new Set(X.ends(r).map(x=>x.e.id))].sort().join('|');r._k=es;pairN[es]=(pairN[es]||0)+1;});
    rels.forEach(r=>{const es=[...new Set(X.ends(r).map(x=>x.e))];const i=pairI[r._k]=(pairI[r._k]||0)+1,n=pairN[r._k],off=(i-1-(n-1)/2)*80;
      if(es.length===1){const e=es[0];r.x=e.x+e.w/2+r.w/2+40+(i-1)*30;r.y=e.y-cellH*0.32-(i-1)*60;}
      else if(es.length===2){const [A,B]=es,dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy)||1;r.x=(A.x+B.x)/2-dy/d*off;r.y=(A.y+B.y)/2+dx/d*off;}
      else if(es.length>2){r.x=es.reduce((s,e)=>s+e.x,0)/es.length;r.y=es.reduce((s,e)=>s+e.y,0)/es.length+off;}
      else{r.x=-1e5;r._p=1;return;}
      // si choca con algo, el hueco libre más cercano a su sitio ideal
      if(hits(r,24)){const x0=r.x,y0=r.y;let found=false;
        for(let ring=1;ring<14&&!found;ring++)for(let k=0;k<8*ring&&!found;k++){const ang=k/(8*ring)*2*Math.PI;r.x=x0+Math.cos(ang)*ring*36;r.y=y0+Math.sin(ang)*ring*30;if(!hits(r,24))found=true;}
        if(!found){r.x=x0;r.y=y0;}}
      r._p=1;});
    isas.forEach(i=>{const s=X.superOf(i),subs=X.subsOf(i);if(!s){i.x=-1e5;return;}
      const my=subs.length?subs.reduce((t,e)=>t+e.y,0)/subs.length:s.y+cellH,mx=subs.length?subs.reduce((t,e)=>t+e.x,0)/subs.length:s.x;
      i.x=Math.round((s.x*2+mx)/3);i.y=Math.round(s.y+(my-s.y)*0.45);});
    const orphans=[...rels.filter(r=>r.x===-1e5),...isas.filter(i=>i.x===-1e5),...ents.filter(e=>!done.has(e.id))];
    // 3) atributos alrededor de su dueño
    attrs.forEach(a=>{a.x=-9999;a.y=-9999;});
    const placed=()=>ns.filter(n=>n.x>-5000);
    const free=(a,x,y)=>!placed().some(o=>o!==a&&Math.abs(x-o.x)<(a.w+o.w)/2+8&&Math.abs(y-o.y)<(a.h+o.h)/2+6);
    const angd=(p,q)=>{let d=Math.abs(p-q)%(2*Math.PI);return d>Math.PI?2*Math.PI-d:d;};
    const around=o=>{const list=X.attrsOf(o);if(!list.length)return;
      const lines=X.linksOf(o.id).map(l=>X.other(l,o.id)).filter(n=>n&&!isAtt(n)&&n.x>-5000).map(n=>Math.atan2(n.y-o.y,n.x-o.x));
      if(isAtt(o)){const ow=X.ownerOf(o);if(ow)lines.push(Math.atan2(ow.y-o.y,ow.x-o.x));}
      const used=[];
      // la PK primero, arriba; después el resto repartido
      [...list].sort((a,b)=>(b.f.k||b.f.p?1:0)-(a.f.k||a.f.p?1:0)).forEach((a,idx)=>{
        let best=null;
        for(let ring=0;ring<4&&!best;ring++)for(let s=0;s<72;s++){const ang=-Math.PI/2+s*Math.PI/36;
          const rx=o.w/2+a.w/2+(isAtt(o)?14:22)+ring*44,ry=o.h/2+13+(isAtt(o)?18:30)+ring*34;
          const x=o.x+Math.cos(ang)*rx,y=o.y+Math.sin(ang)*ry;if(!free(a,x,y))continue;
          const toLine=lines.length?Math.min(...lines.map(l=>angd(ang,l))):Math.PI,toUsed=used.length?Math.min(...used.map(u=>angd(ang,u))):Math.PI;
          if(toLine<0.45)continue;
          const sc=Math.min(toLine*1.2,toUsed)+(idx===0&&!used.length?-angd(ang,-Math.PI/2)*0.6:0);
          if(!best||sc>best.sc)best={x,y,ang,sc};}
        if(!best){this.placeAttr(o,a);used.push(Math.atan2(a.y-o.y,a.x-o.x));}
        else{a.x=Math.round(best.x);a.y=Math.round(best.y);used.push(best.ang);}
        if(a.f.c)around(a);});};
    [...ents,...rels.filter(r=>r.x>-5000)].forEach(around);
    // 4) lo que no está unido a nada, en una fila debajo
    const b0=placed();const yb=Math.max(...b0.map(n=>n.y+n.h/2))+120;let xb=Math.min(...b0.map(n=>n.x-n.w/2));
    [...orphans,...attrs.filter(a=>a.x<-5000)].forEach(n=>{n.x=Math.round(xb+n.w/2);n.y=Math.round(yb);xb+=n.w+40;if(isAtt(n)===false)around(n);});
    // 5) centrar en la zona de trabajo
    const all=ns,bx0=Math.min(...all.map(n=>n.x-n.w/2)),bx1=Math.max(...all.map(n=>n.x+n.w/2)),by0=Math.min(...all.map(n=>n.y-n.h/2)),by1=Math.max(...all.map(n=>n.y+n.h/2));
    const dx=W/2-(bx0+bx1)/2,dy=H/2-(by0+by1)/2;
    all.forEach(n=>{n.x=Math.round(n.x+dx);n.y=Math.round(n.y+dy);delete n._p;delete n._k;});
    keep.forEach(([x,y],id)=>{const n=X.N[id];if(n){n.x=x;n.y=y;}});
    this.save();this.render();this.fit(true);toast(keep.size?'Diagrama distribuido (lo bloqueado no se mueve). Ctrl+Z para volver atrás.':'Diagrama distribuido. Ctrl+Z para volver atrás.');
  }
  /* ---------- Pasar del E-R a tablas ---------- */
  fromER(){
    const er=this.p.er,probs=validateER(er,this.easy);
    if(probs.length){this.app.modal(`<h3>Antes de pasarlo hay que arreglar el E-R</h3><ul class="plist">${probs.map(p=>`<li>${esc(p)}</li>`).join('')}</ul><div class="mrow"><button class="ebtn pri" data-m="close">Entendido</button></div>`);return;}
    const {tables,notes}=erToTables(er,this.easy);
    const doIt=replace=>{this.snap();
      if(replace)this.p[this.mode]={t:tables,notes:this.notes};
      else{const have=new Set(this.m.t.map(t=>lc(t.n)));const add=tables.filter(t=>!have.has(lc(t.n)));
        const exist=this.m.t.map(t=>{const s=tableSize(t);return{x:t.x,y:t.y,w:s.w,h:s.h};});
        add.forEach(t=>{const s=tableSize(t);let k=0;while(exist.some(o=>t.x<o.x+o.w+50&&t.x+s.w+50>o.x&&t.y<o.y+o.h+40&&t.y+s.h+40>o.y)&&k<300){t.y+=30;k++;}exist.push({x:t.x,y:t.y,w:s.w,h:s.h});this.m.t.push(t);});
        if(!add.length){toast('Ya tienes una tabla para cada entidad.');return;}}
      const nn=carryNotes(this.p.er,this.m,true);
      this.selIds=new Set();this.save();this.render();this.renderInsp();this.fit(true);
      toast(`${replace?tables.length:'Nuevas'} tabla(s) creadas${this.easy?' con sus relaciones':''}.`+(nn?` También ${nn} nota(s) del E-R.`:'')+(notes.length?' '+notes.join(' '):''),notes.length?'warn':'');};
    if(!this.m.t.length){doIt(true);return;}
    this.app.modal(`<h3>Ya hay tablas en el ${VIEWS[this.mode]}</h3><p>¿Qué hago con lo que ya tienes?</p><div class="mrow"><button class="ebtn" data-m="close">Cancelar</button><button class="ebtn" data-m="fe-add">Añadir solo lo que falta</button><button class="ebtn pri" data-m="fe-rep">Sustituirlo todo</button></div>`);
    this.app._feCb=doIt;
  }
  copyRel(){
    const src=this.p.rel.t;if(!src.length){toast('Tu relacional está vacío.');return;}
    const easy=this.easy;
    const doIt=()=>{this.snap();this.p.ded={notes:(this.p.ded.notes||[]),t:src.map(t=>({id:uid(),n:t.n,x:t.x,y:t.y,c:t.c.map(c=>{const f=parseF(c[2]),ty=c[1]&&c[1]!=='INT'?c[1]:guessType(c[0],f);if(!easy){delete f.fk;}return[c[0],ty,easy?c[2]:joinF(f)];})}))};carryNotes(this.p.rel,this.p.ded,true);this.selIds=new Set();this.selLink=null;this.save();this.render();this.renderInsp();this.fit(true);
      toast(easy?'Tablas copiadas con sus relaciones. Ajusta los tipos de cada columna.':'Tablas copiadas sin relaciones. Únelas con «Relacionar» o marca FK en cada columna (con el modo fácil se copian también las relaciones).');};
    if(!this.m.t.length){doIt();return;}
    this.app.confirm('Copiar el relacional','Se sustituirán las tablas del DED por las del relacional. Puedes volver atrás con Ctrl+Z.','Sustituir',doIt);
  }
  /* ---------- Cadena Boceto ⇄ E-R ⇄ Relacional ⇄ DED ⇄ SQL ---------- */
  chainGo(view,fn){if(this.p.act&&this.app.isRO&&this.app.isRO(this.p,view)){toast('En esta actividad no se puede cambiar esa pestaña.','warn');return;}this.app.go(this.p,view);fn();}
  // E-R → Boceto: añade entidades, atributos y una línea por relación binaria (con sus cardinalidades). No borra nada.
  erToBo(){const p=this.p,er=p.er,X=erIdx(er),ents=er.nodes.filter(isEnt);if(!ents.length){toast('Tu E-R está vacío.');return;}
    p.bo=p.bo||{nodes:[],links:[],notes:[]};const bo=p.bo;bo.nodes=bo.nodes||[];bo.links=bo.links||[];
    const snapBo=JSON.stringify(cleanModel(bo,'bo')),byName={},bents=bo.nodes.filter(isEnt);bents.forEach(e=>byName[lc(e.n)]=e);
    const bx=ents.map(e=>e.x),by=ents.map(e=>e.y),cx=(Math.min(...bx)+Math.max(...bx))/2,cy=(Math.min(...by)+Math.max(...by))/2;
    let dx=W/2,dy=H/2;if(bents.length){dx=(Math.min(...bents.map(n=>n.x))+Math.max(...bents.map(n=>n.x)))/2;dy=Math.max(...bents.map(n=>n.y))+180+(Math.max(...by)-Math.min(...by))/3.6;}
    const map={},names=o=>X.attrsOf(o).map(a=>String(a.n||'').trim()).filter(Boolean);let ne=0,na=0,nl=0,skip=0;
    ents.forEach(e=>{let t=byName[lc(e.n)];if(!t){t={id:uid(),k:'ent',n:e.n,x:Math.round(dx+(e.x-cx)/1.8),y:Math.round(dy+(e.y-cy)/1.8),f:{}};bo.nodes.push(t);byName[lc(e.n)]=t;ne++;}map[e.id]=t;
      t.f=t.f||{};const at=t.f.at||[];names(e).forEach(n=>{if(!at.some(x=>lc(x)===lc(n))){at.push(n);na++;}});if(at.length)t.f.at=at;});
    const mark=x=>x&&x.mx?(x.mn||'?')+x.mx:null,used=new Set();
    er.nodes.filter(isRel).forEach(r=>{const en=X.ends(r);if(en.length!==2){if(en.length>2)skip++;return;}
      const A=map[en[0].e.id],B=map[en[1].e.id];if(!A||!B)return;
      let l=bo.links.find(l=>!used.has(l)&&((l.a===A.id&&l.b===B.id)||(l.a===B.id&&l.b===A.id)));
      if(!l){l={id:uid(),a:A.id,b:B.id};bo.links.push(l);nl++;}
      used.add(l);if(!l.ea&&!l.eb){const fw=l.a===A.id,ea=mark(fw?en[0]:en[1]),eb=mark(fw?en[1]:en[0]);if(ea)l.ea=ea;if(eb)l.eb=eb;}
      const ra=names(r);if(ra.length){l.at=l.at||[];ra.forEach(n=>{if(!l.at.some(x=>lc(x)===lc(n))){l.at.push(n);na++;}});}});
    const nn=carryNotes(er,bo,false);
    if(!ne&&!na&&!nl&&!nn){toast('Tu boceto ya tiene todo lo del E-R.');return;}
    this.hist.push({mode:'bo',data:snapBo});this.app.touch(p);if(p._views)delete p._views.bo;this.app.go(p,'bo');
    toast(`Boceto actualizado: ${ne} entidad(es), ${na} atributo(s) y ${nl} línea(s) nuevas.`+(skip?` Las relaciones de 3 o más entidades (${skip}) no caben en el boceto.`:'')+' Ctrl+Z lo deshace.');}
  // Relacional → E-R (ingeniería inversa): tabla = entidad; columna FK = relación 1:N (o 1:1 si es única); tabla cuya PK son solo FK = relación N:M
  relToER(){const p=this.p,src=(p.rel.t||[]).filter(t=>String(t.n||'').trim());if(!src.length){toast('Tu relacional está vacío.');return;}
    const tBy={};src.forEach(t=>tBy[lc(t.n)]=t);
    const C=t=>t.c.filter(c=>String(c[0]||'').trim()).map(c=>({n:String(c[0]).trim(),f:parseF(c[2])})),pkN=t=>Math.max(1,C(t).filter(c=>c.f.pk).length);
    const refs=cols=>{const g={};cols.filter(c=>c.f.fk&&tBy[lc(c.f.fk)]).forEach(c=>{(g[lc(c.f.fk)]=g[lc(c.f.fk)]||[]).push(c);});const out=[];
      Object.entries(g).forEach(([k,cs])=>{const n=pkN(tBy[k]);for(let i=0;i<cs.length;i+=n)out.push({P:tBy[k],cs:cs.slice(i,i+n)});});return out;};
    const isLink=t=>{const cs=C(t),pk=cs.filter(c=>c.f.pk);if(pk.length<2||!pk.every(c=>c.f.fk&&tBy[lc(c.f.fk)]))return false;if(cs.some(c=>!c.f.pk&&c.f.fk))return false;return refs(pk).length>=2;};
    const doIt=replace=>{const er0=JSON.stringify(cleanModel(p.er,'er')),wasEmpty=!p.er.nodes.length||replace;
      const er=replace?{nodes:[],links:[],notes:p.er.notes||[]}:p.er,X0=erIdx(er),ed2=new Editor(this.app);ed2.p=p;ed2.mode='er';
      const eBy={};er.nodes.filter(isEnt).forEach(e=>eBy[lc(e.n)]=e);let ne=0,na=0,nr=0;
      const ents=src.filter(t=>!isLink(t)),boxes=ents.map(t=>{const s=tableSize(t);return{t,x:t.x+s.w/2,y:t.y+s.h/2};});
      const xs=boxes.map(b=>b.x),ys=boxes.map(b=>b.y),cx=xs.length?(Math.min(...xs)+Math.max(...xs))/2:0,cy=ys.length?(Math.min(...ys)+Math.max(...ys))/2:0;
      let dx=W/2,dy=H/2;if(!wasEmpty&&er.nodes.length){const ex=er.nodes.map(n=>n.x),ey=er.nodes.map(n=>n.y);dx=(Math.min(...ex)+Math.max(...ex))/2;dy=Math.max(...ey)+320+(ys.length?(Math.max(...ys)-Math.min(...ys))*0.8:0);}
      const addAttr=(o,c,fl)=>{const X=erIdx(er);if(X.attrsOf(o).some(a=>lc(a.n)===lc(c.n)))return;const nn={id:uid(),k:'attr',n:c.n,x:o.x,y:o.y,f:fl};ed2.size(nn);er.nodes.push(nn);er.links.push({id:uid(),a:o.id,b:nn.id,c:null,mn:null,mx:null});ed2.size(o);if(!wasEmpty)ed2.placeAttr(o,nn);na++;};
      boxes.forEach(({t,x,y})=>{const cs=C(t),pk=cs.filter(c=>c.f.pk),weak=pk.some(c=>c.f.fk)&&pk.some(c=>!c.f.fk);let e=eBy[lc(t.n)];
        if(!e){e={id:uid(),k:weak?'weak':'ent',n:t.n,x:Math.round(dx+(x-cx)*1.6),y:Math.round(dy+(y-cy)*1.6),f:{}};er.nodes.push(e);eBy[lc(t.n)]=e;ne++;}
        cs.filter(c=>!c.f.fk).forEach(c=>{const fl={};if(c.f.pk){if(weak)fl.p=1;else fl.k=1;}if(c.f.nul&&!c.f.pk)fl.o=1;addAttr(e,c,fl);});});
      const relNames=er.nodes.filter(isRel).map(r=>r.n),has=(A,B)=>{const X=erIdx(er);return er.nodes.some(r=>isRel(r)&&(()=>{const es=X.ends(r).map(x=>x.e.id);return es.length===2&&es.includes(A.id)&&es.includes(B.id)&&(A!==B||es[0]===es[1]);})());};
      const lk=(r,e,mn,mx)=>({id:uid(),a:r.id,b:e.id,mn,mx,c:`(${mn},${mx})`});
      const mkRel=(name,ends,k)=>{const r={id:uid(),k:k||'rel',n:this.uniqueName(name,relNames),x:Math.round(ends.reduce((s,x)=>s+x[0].x,0)/ends.length),y:Math.round(ends.reduce((s,x)=>s+x[0].y,0)/ends.length),f:{}};
        if(ends.length===2&&ends[0][0]===ends[1][0]){r.x+=170;r.y-=100;}relNames.push(r.n);er.nodes.push(r);ends.forEach(([e,mn,mx])=>er.links.push(lk(r,e,mn,mx)));nr++;return r;};
      const base=LANG()==='en'?'relationship':'relacion';
      ents.forEach(t=>{const E=eBy[lc(t.n)];refs(C(t)).forEach(({P,cs})=>{const PE=eBy[lc(P.n)];if(!PE)return;if(!replace&&has(E,PE))return;
        const uq=cs.every(c=>c.f.uq)||(cs.every(c=>c.f.pk)&&C(t).filter(c=>c.f.pk).length===cs.length),nul=cs.some(c=>c.f.nul),ident=E.k==='weak'&&cs.every(c=>c.f.pk);
        mkRel(base,[[E,'0',uq?'1':'N'],[PE,nul?'0':'1','1']],ident?'idrel':'rel');});});
      src.filter(isLink).forEach(t=>{const rs=refs(C(t).filter(c=>c.f.pk)),ends=rs.map(({P})=>eBy[lc(P.n)]).filter(Boolean);if(ends.length<2)return;
        if(!replace&&ends.length===2&&has(ends[0],ends[1]))return;
        const r=mkRel(t.n,ends.map(e=>[e,'0','N']));C(t).filter(c=>!c.f.pk&&!c.f.fk).forEach(c=>addAttr(r,c,c.f.nul?{o:1}:{}));});
      if(!ne&&!na&&!nr){toast('Tu E-R ya tiene todo lo del relacional.');return;}
      this.hist.push({mode:'er',data:er0});p.er=er;carryNotes(p.rel,p.er,false);this.app.touch(p);if(p._views)delete p._views.er;this.app.go(p,'er');
      if(wasEmpty&&this.isER)this.distribute();
      toast(`E-R ${replace?'rehecho':'actualizado'} desde el relacional: ${ne} entidad(es), ${na} atributo(s) y ${nr} relación(es). Pon un verbo a cada relación y revisa las cardinalidades mínimas. Ctrl+Z lo deshace.`);};
    if(!p.er.nodes.length){doIt(true);return;}
    this.app.modal(`<h3>Tu E-R no está vacío</h3><p>¿Qué hago con lo que ya tienes?</p><div class="mrow"><button class="ebtn" data-m="close">Cancelar</button><button class="ebtn" data-m="fe-add">Añadir solo lo que falta</button><button class="ebtn pri" data-m="fe-rep">Rehacerlo entero</button></div>`);
    this.app._feCb=doIt;}
  // DED → Relacional: copia las tablas tal cual (con sus claves ajenas)
  dedToRel(){const p=this.p,src=p.ded.t||[];if(!src.length){toast('Tu DED está vacío.');return;}
    const doIt=()=>{this.hist.push({mode:'rel',data:JSON.stringify(cleanModel(p.rel,'rel'))});
      p.rel={notes:p.rel.notes||[],t:src.map(t=>({id:uid(),n:t.n,x:t.x,y:t.y,c:t.c.map(c=>[c[0],c[1],c[2]])}))};carryNotes(p.ded,p.rel,true);
      if(p._views)delete p._views.rel;this.app.touch(p);this.app.go(p,'rel');toast('Relacional actualizado con las tablas del DED. Ctrl+Z lo deshace.');};
    if(!(p.rel.t||[]).length){doIt();return;}
    this.app.confirm('Actualizar el relacional','Se sustituirán las tablas del relacional por las del DED (con sus claves ajenas). Puedes volver atrás con Ctrl+Z en el relacional.','Sustituir',doIt);}
}
Editor.clip=null;
