/* ===================== Quiz «¿Está bien el diagrama?» ===================== */
// 14 ejercicios base × E-R / Relacional / DED. Se preparan 100 preguntas fijas (misma semilla): 10 bien hechas y 90 con entre 1 y 4 fallos.
// Cardinalidades como en la app: ca = junto a A, cb = junto a B.
const BDQ_S=[
  {ents:[['Cliente',0,0,['*DNI','Nombre','Telefono']],['Pedido',520,0,['*Numero','Fecha','Total']]],rels:[['hace',260,0,'Cliente',['1','1'],'Pedido',['0','N'],[]]],
    t:'De cada cliente se guarda su DNI, que lo identifica, su nombre y su teléfono. De cada pedido, su número, que lo identifica, la fecha y el total. Un cliente puede hacer ninguno o muchos pedidos, y cada pedido lo hace exactamente un cliente.'},
  {ents:[['Alumno',0,0,['*DNI','Nombre','Email']],['Asignatura',540,0,['*Codigo','Nombre','Horas']]],rels:[['matricula',270,0,'Alumno',['1','N'],'Asignatura',['0','N'],['Nota']]],
    t:'De cada alumno se guarda su DNI (lo identifica), su nombre y su email. De cada asignatura, su código (la identifica), su nombre y sus horas. Un alumno se puede matricular en ninguna o muchas asignaturas, y en cada asignatura hay al menos un alumno, pudiendo haber muchos. De cada matrícula se guarda la nota.'},
  {ents:[['Socio',0,0,['*NumSocio','Nombre','Telefono']],['Libro',520,0,['*ISBN','Titulo','Autor']]],rels:[['presta',260,0,'Socio',['0','N'],'Libro',['0','N'],['FechaPrestamo']]],
    t:'De cada socio de la biblioteca se guarda su número de socio (lo identifica), su nombre y su teléfono. De cada libro, su ISBN (lo identifica), el título y el autor. Un socio puede tener prestados ninguno o muchos libros, y un libro puede haber estado prestado a ninguno o muchos socios. De cada préstamo se guarda la fecha.'},
  {ents:[['Medico',0,0,['*NumColegiado','Nombre','Especialidad']],['Paciente',540,0,['*NSS','Nombre','FechaNac']]],rels:[['atiende',270,0,'Medico',['1','1'],'Paciente',['0','N'],[]]],
    t:'De cada médico se guarda su número de colegiado (lo identifica), su nombre y su especialidad. De cada paciente, su número de la Seguridad Social (NSS, lo identifica), su nombre y su fecha de nacimiento. Cada paciente tiene exactamente un médico que lo atiende, y un médico atiende a ninguno o muchos pacientes.'},
  {ents:[['Departamento',0,0,['*Codigo','Nombre']],['Empleado',560,0,['*DNI','Nombre','Sueldo']]],rels:[['pertenece',280,0,'Departamento',['1','1'],'Empleado',['1','N'],[]]],
    t:'De cada departamento se guarda su código (lo identifica) y su nombre. De cada empleado, su DNI (lo identifica), su nombre y su sueldo. Cada empleado pertenece exactamente a un departamento, y en cada departamento hay al menos un empleado, pudiendo haber muchos.'},
  {ents:[['Cliente',0,0,['*DNI','Nombre','Telefono']],['Coche',520,0,['*Matricula','Marca','Modelo']]],rels:[['tiene',260,0,'Cliente',['1','1'],'Coche',['1','N'],[]]],
    t:'En el taller, de cada cliente se guarda su DNI (lo identifica), su nombre y su teléfono. De cada coche, su matrícula (lo identifica), la marca y el modelo. Un cliente tiene uno o muchos coches, y cada coche es exactamente de un cliente.'},
  {ents:[['Grupo',0,0,['*Nombre','Pais']],['Disco',520,0,['*Codigo','Titulo','Anio']]],rels:[['graba',260,0,'Grupo',['1','1'],'Disco',['0','N'],[]]],
    t:'De cada grupo de música se guarda su nombre (lo identifica) y su país. De cada disco, su código (lo identifica), su título y su año. Un grupo puede haber grabado ninguno o muchos discos, y cada disco lo graba exactamente un grupo.'},
  {ents:[['Pelicula',0,0,['*Codigo','Titulo','Duracion']],['Actor',540,0,['*Codigo','Nombre']]],rels:[['actua',270,0,'Pelicula',['1','N'],'Actor',['1','N'],['Papel']]],
    t:'De cada película se guarda su código (la identifica), su título y su duración. De cada actor, su código (lo identifica) y su nombre. En cada película actúa al menos un actor, pudiendo ser muchos, y cada actor ha actuado al menos en una película, pudiendo ser muchas. De cada actuación se guarda el papel.'},
  {ents:[['Equipo',0,0,['*Nombre','Ciudad']],['Jugador',520,0,['*DNI','Nombre','Dorsal']]],rels:[['juega',260,0,'Equipo',['0','1'],'Jugador',['1','N'],[]]],
    t:'De cada equipo se guarda su nombre (lo identifica) y su ciudad. De cada jugador, su DNI (lo identifica), su nombre y su dorsal. Un jugador juega como mucho en un equipo, aunque puede estar sin equipo, y cada equipo tiene al menos un jugador, pudiendo tener muchos.'},
  {ents:[['Profesor',0,0,['*DNI','Nombre']],['Despacho',520,0,['*Numero','Planta']]],rels:[['ocupa',260,0,'Profesor',['0','1'],'Despacho',['1','1'],[]]],
    t:'De cada profesor se guarda su DNI (lo identifica) y su nombre. De cada despacho, su número (lo identifica) y su planta. Cada profesor ocupa exactamente un despacho, y en cada despacho hay como mucho un profesor (puede estar vacío).'},
  {ents:[['Socio',0,0,['*DNI','Nombre','Telefono']],['Clase',520,0,['*Codigo','Nombre','Hora']]],rels:[['apunta',260,0,'Socio',['0','N'],'Clase',['0','N'],[]]],
    t:'En el gimnasio, de cada socio se guarda su DNI (lo identifica), su nombre y su teléfono. De cada clase, su código (la identifica), su nombre y la hora. Un socio se puede apuntar a ninguna o muchas clases, y en una clase puede haber ninguno o muchos socios apuntados.'},
  {ents:[['Duenio',0,0,['*DNI','Nombre','Telefono']],['Mascota',520,0,['*Chip','Nombre','Especie']]],rels:[['tiene',260,0,'Duenio',['1','1'],'Mascota',['1','N'],[]]],
    t:'En el veterinario, de cada dueño se guarda su DNI (lo identifica), su nombre y su teléfono. De cada mascota, su número de chip (la identifica), su nombre y su especie. Un dueño tiene una o muchas mascotas, y cada mascota es exactamente de un dueño.'},
  {ents:[['Cliente',0,0,['*DNI','Nombre']],['Pedido',460,0,['*Numero','Fecha']],['Producto',460,330,['*Codigo','Nombre','Precio']]],
    rels:[['hace',230,0,'Cliente',['1','1'],'Pedido',['0','N'],[]],['contiene',460,165,'Pedido',['0','N'],'Producto',['1','N'],['Cantidad']]],
    t:'De cada cliente se guarda su DNI (lo identifica) y su nombre. De cada pedido, su número (lo identifica) y su fecha. De cada producto, su código (lo identifica), su nombre y su precio. Un cliente hace ninguno o muchos pedidos y cada pedido lo hace exactamente un cliente. Cada pedido contiene uno o muchos productos, y un producto puede estar en ninguno o muchos pedidos. De cada producto de un pedido se guarda la cantidad.'},
  {ents:[['Profesor',0,0,['*DNI','Nombre']],['Curso',480,0,['*Codigo','Nombre']],['Aula',480,330,['*Numero','Capacidad']]],
    rels:[['imparte',240,0,'Profesor',['1','1'],'Curso',['0','N'],[]],['se_da_en',480,165,'Curso',['0','N'],'Aula',['1','1'],[]]],
    t:'De cada profesor se guarda su DNI (lo identifica) y su nombre. De cada curso, su código (lo identifica) y su nombre. De cada aula, su número (la identifica) y su capacidad. Cada curso lo imparte exactamente un profesor, y un profesor imparte ninguno o muchos cursos. Cada curso se da exactamente en un aula, y en un aula se pueden dar ninguno o muchos cursos.'}];
const BDQ={
  _bank:null,
  rng(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};},
  baseER(S){return mkER(S.ents.map(([n,x,y,at])=>[n,x,y,at]),S.rels.map(([n,x,y,a,ca,b,cb,at])=>[n,x,y,[[a,ca[0],ca[1]],[b,cb[0],cb[1]]],at]));},
  baseTables(S,ded){const er=this.baseER(S),{tables}=erToTables(er,true);tables.forEach(t=>{delete t._src;delete t._mid;delete t._ex;delete t._ey;t.c=t.c.map(c=>{const f=parseF(c[2]);return[c[0],ded?(c[1]&&c[1]!=='INT'?c[1]:guessType(c[0],f)):c[1],c[2]];});});return{t:tables,notes:[]};},
  // Fallos que se pueden meter en cada tipo de diagrama
  mutsER(m,S,R){const X=erIdx(m),out=[];
    m.links.filter(l=>X.cardable(l)).forEach(l=>{const e=X.N[l.b]||X.N[l.a],en=isEnt(X.N[l.a])?X.N[l.a]:X.N[l.b];
      out.push({tg:'l:'+l.id,go:()=>{const ok=`(${l.mn},${l.mx})`;l.mx=l.mx==='1'?'N':'1';l.c=`(${l.mn},${l.mx})`;return `Junto a «${en.n}» la cardinalidad debe ser ${ok}.`;}});
      out.push({tg:'l:'+l.id,go:()=>{const ok=`(${l.mn},${l.mx})`;l.mn=l.mn==='0'?'1':'0';l.c=`(${l.mn},${l.mx})`;return `Junto a «${en.n}» la cardinalidad debe ser ${ok}.`;}});});
    m.nodes.filter(isEnt).forEach(e=>{const at=X.attrsOf(e),key=at.find(a=>a.f.k),rest=at.filter(a=>!a.f.k);
      if(key)out.push({tg:'n:'+key.id,go:()=>{key.f.k=false;return `«${key.n}» identifica a «${e.n}»: debe ser clave (subrayado).`;}});
      if(rest.length)out.push({tg:'n:'+rest[0].id,go:()=>{rest[0].f.k=true;return `«${rest[0].n}» no identifica a «${e.n}»: no debe ser clave.`;}});
      if(rest.length>1){const a=rest[rest.length-1];out.push({tg:'n:'+e.id,go:()=>{m.nodes=m.nodes.filter(n=>n!==a);m.links=m.links.filter(l=>l.a!==a.id&&l.b!==a.id);return `A «${e.n}» le falta el atributo «${a.n}».`;}});}});
    m.nodes.filter(isRel).forEach(r=>{const at=X.attrsOf(r),en=X.ends(r).map(x=>x.e);if(!at.length||!en.length)return;const a=at[0],e=en[0];
      out.push({tg:'n:'+a.id,go:()=>{const l=m.links.find(l=>(l.a===r.id&&l.b===a.id)||(l.b===r.id&&l.a===a.id));l.a=e.id;l.b=a.id;a.x=e.x-40;a.y=e.y+110;return `«${a.n}» es un atributo de la relación «${r.n}», no de «${e.n}».`;}});});
    return out;},
  mutsT(m,S,ded){const out=[],T=n=>m.t.find(t=>t.n===n),own=t=>t.c.filter(c=>{const f=parseF(c[2]);return f.pk&&!f.fk;}),fkc=(t,p)=>t.c.filter(c=>parseF(c[2]).fk===p);
    m.t.forEach(t=>{const pk=own(t),plain=t.c.filter(c=>{const f=parseF(c[2]);return!f.pk&&!f.fk;});
      if(pk.length)out.push({tg:'n:'+t.id,go:()=>{pk.forEach(c=>{const f=parseF(c[2]);delete f.pk;c[2]=joinF(f);});return `«${t.n}» no tiene clave primaria: ${pk.map(c=>c[0]).join(', ')} debe ser PK.`;}});
      if(plain.length>1){const c=plain[plain.length-1];out.push({tg:'n:'+t.id,go:()=>{t.c=t.c.filter(x=>x!==c);return `A «${t.n}» le falta la columna «${c[0]}».`;}});}
      if(ded){const ty=t.c.find(c=>{const f=parseF(c[2]);return!f.fk&&/^(fecha|nombre|titulo|precio|total|sueldo|nota)/i.test(c[0]);});
        if(ty)out.push({tg:'n:'+t.id,go:()=>{const ok=ty[1],bad=/^(precio|total|sueldo|nota)/i.test(ty[0])?'VARCHAR(45)':'INT';ty[1]=bad;return `En «${t.n}», «${ty[0]}» debería ser ${ok}, no ${bad}.`;}});}});
    // relaciones: las FK de cada tabla
    m.t.forEach(t=>{const ps=[...new Set(t.c.map(c=>parseF(c[2]).fk).filter(Boolean))];
      ps.forEach(pn=>{const P=T(pn);if(!P)return;const cols=fkc(t,pn),ident=cols.every(c=>parseF(c[2]).pk),key=t.id+'|'+pn;
        if(ident){ // tabla de una N:M: le quitamos una de las dos claves
          out.push({tg:'n:'+t.id,go:()=>{t.c=t.c.filter(c=>!cols.includes(c));return `«${t.n}» debe llevar también la clave de «${pn}» (como PK y FK).`;}});return;}
        const sr=S.rels.find(r=>(r[3]===pn&&r[5]===t.n)||(r[5]===pn&&r[3]===t.n));const one=sr&&sr[4][1]==='1'&&sr[6][1]==='1';
        const grp='rel:'+t.id+'|'+pn;if(!one)out.push({tg:'f:'+P.id+'|'+t.n,grp,block:['n:'+t.id,'n:'+P.id],go:()=>{const ppk=own(t);t.c=t.c.filter(c=>!cols.includes(c));ppk.forEach(c=>P.c.push([P.c.some(x=>lc(x[0])===lc(c[0]))?c[0]+'_'+t.n:c[0],c[1],joinF({fk:t.n})]));return `La FK está al revés: debe ir en «${t.n}» (el lado N) apuntando a «${pn}».`;}});
        if(ded){out.push({tg:'f:'+key,grp,go:()=>{cols.forEach(c=>{const f=parseF(c[2]);f.pk=1;delete f.nul;c[2]=joinF(f);});return `La línea entre «${t.n}» y «${pn}» debe ser discontinua: la FK no forma parte de la PK.`;}});
          out.push({tg:'f:'+key,grp,go:()=>{const was=cols.some(c=>parseF(c[2]).nul);cols.forEach(c=>{const f=parseF(c[2]);if(was)delete f.nul;else f.nul=1;c[2]=joinF(f);});return was?`La FK de «${t.n}» hacia «${pn}» puede quedar vacía: según el enunciado es opcional (círculo).`:`La FK de «${t.n}» hacia «${pn}» es obligatoria según el enunciado: no lleva círculo de opcional.`;}});}});});
    return out;},
  build(i,R){const S=BDQ_S[i%BDQ_S.length],mode=['er','rel','ded'][Math.floor(i/BDQ_S.length)%3];
    const m=mode==='er'?this.baseER(S):this.baseTables(S,mode==='ded'),good=i%10===7;
    let errs=[];if(!good){const M=mode==='er'?this.mutsER(m,S,R):this.mutsT(m,S,mode==='ded'),want=1+Math.floor(R()*4),used=new Set();
      for(const k of M.map(x=>[R(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1])){if(errs.length>=want)break;const g=k.grp||k.tg;if(used.has(g)||used.has(k.tg)||(k.block||[]).some(x=>used.has(x)))continue;
        // una tabla o una entidad solo con un fallo, y no tocar dos cosas que se pisan
        const msg=k.go();used.add(k.tg);used.add(g);(k.block||[]).forEach(x=>used.add(x));errs.push({tg:k.tg,msg});}}
    return{mode,S,m,errs,id:i};},
  bank(){if(this._bank)return this._bank;const R=this.rng(20261112),out=[];for(let i=0;i<100;i++){try{out.push(this.build(i,R));}catch(e){console.error('bdq',i,e);}}
    // si alguna con fallos se quedó sin fallos (no había ninguno posible), cuenta como bien hecha
    return this._bank=out;},
  svg(q,marks,reveal){const ed=new Editor(null);ed.p={[q.mode]:q.m};ed.mode=q.mode;let inner,bs;
    if(q.mode==='er'){inner=ed.erString(true);bs=q.m.nodes.map(n=>[n.x-n.w/2,n.y-n.h/2,n.x+n.w/2,n.y+n.h/2]);}
    else{inner=ed.tablesString(true);bs=q.m.t.map(t=>q.mode==='ded'?[t.x,t.y,t.x+t.w,t.y+t.h]:[t.x-26,t.y,t.x+t.rw,t.y+18+t.rh]);}
    const p=40,x0=Math.min(...bs.map(b=>b[0]))-p,y0=Math.min(...bs.map(b=>b[1]))-p,x1=Math.max(...bs.map(b=>b[2]))+p,y1=Math.max(...bs.map(b=>b[3]))+p;
    return `<svg class="bdq-svg" viewBox="${f1(x0)} ${f1(y0)} ${f1(x1-x0)} ${f1(y1-y0)}" style="max-width:${Math.round((x1-x0)*1.15)}px">${inner}</svg>`;}
};
Object.assign(Juegos,{
  bdqView(mv){const B=this._bdq,s=this.st();
    if(!B){mv.innerHTML=this.head('¿Está bien el diagrama?',true)+`<div class="view jg"><section class="qz-start"><span class="jg-ic big">🔎</span><h2>¿Está bien hecho?</h2>
        <p>Te sale un enunciado corto y su diagrama (E-R, Relacional o DED). <b>Casi siempre tiene fallos</b>: entre 1 y 4. Pulsa sobre lo que esté mal (una entidad, un atributo, una cardinalidad, una tabla o una flecha) y luego «Comprobar». Si crees que está perfecto, pulsa «Está bien».</p>
        <p>Rondas de <b>5 diagramas</b>: si aciertas los 5, ganas <b>1 token</b>.</p><button class="ebtn pri big" data-bq="start">Empezar ronda</button>
        <p class="tnote">Rondas: ${s.bdq.rounds} · perfectas: ${s.bdq.perfect} · diagramas acertados: ${s.bdq.ok}</p></section></div>`;
      mv.querySelector('[data-bq=start]').addEventListener('click',()=>this.bqStart());return;}
    if(B.i>=B.list.length){const ok=B.res.filter(Boolean).length,perfect=ok===B.list.length;
      mv.innerHTML=this.head('¿Está bien el diagrama?',true)+`<div class="view jg"><section class="qz-start"><span class="jg-ic big">${perfect?'🏆':ok>=3?'👏':'📚'}</span><h2>${ok} de ${B.list.length}</h2><p>${perfect?'¡Perfecta! Has ganado 1 token.':'Para ganar el token hay que acertar los 5. ¡Otra!'}</p><button class="ebtn pri big" data-bq="start">Otra ronda</button></section></div>`;
      mv.querySelector('[data-bq=start]').addEventListener('click',()=>this.bqStart());return;}
    const q=B.list[B.i],done=B.res[B.i]!=null,T=new Set(q.errs.map(e=>e.tg)),M=B.marks;
    mv.innerHTML=this.head('¿Está bien el diagrama?',true)+`<div class="view jg"><section class="bdq">
      <div class="qz-top"><span class="qz-cat">${{er:'E-R',rel:'Relacional',ded:'DED'}[q.mode]}</span><span class="qz-n">Diagrama ${B.i+1} de ${B.list.length}</span><span class="qz-dots">${B.list.map((x,i)=>`<i class="${B.res[i]==null?'':B.res[i]?'ok':'bad'}${i===B.i?' cur':''}"></i>`).join('')}</span></div>
      <p class="bdq-t">${esc(q.S.t)}</p>
      <div class="bdq-cv${done?' done':''}" id="bdqcv">${BDQ.svg(q)}</div>
      ${done?`<div class="qz-fb ${B.res[B.i]?'ok':'bad'}"><div>${B.res[B.i]?(q.errs.length?'¡Bien visto! Has encontrado todos los fallos.':'¡Correcto! Estaba bien hecho.'):(q.errs.length?'No del todo.':'No: este estaba bien hecho.')}
          ${q.errs.length?`<ul class="bdq-err">${q.errs.map(e=>`<li class="${M.has(e.tg)?'ok':'miss'}">${M.has(e.tg)?'✓':'✗'} ${esc(e.msg)}</li>`).join('')}</ul>`:''}
          ${[...M].filter(k=>!T.has(k)).length?`<p class="tnote">Lo marcado en rojo estaba bien.</p>`:''}</div><button class="ebtn pri" data-bq="next">${B.i+1<B.list.length?'Siguiente →':'Ver resultado'}</button></div>`:
        `<div class="bdq-acts"><span class="tnote">Marcados: <b>${M.size}</b>. Pulsa otra vez para desmarcar.</span><button class="ebtn" data-bq="ok">Está bien</button><button class="ebtn pri" data-bq="check" ${M.size?'':'disabled'}>Comprobar</button></div>`}
    </section></div>`;
    const cv=document.getElementById('bdqcv'),key=el=>el.dataset.fk?'f:'+el.dataset.fk:el.dataset.lid?'l:'+el.dataset.lid:'n:'+el.dataset.id;
    const paint=()=>{cv.querySelectorAll('.qmk,.qok,.qbad,.qmiss').forEach(x=>x.classList.remove('qmk','qok','qbad','qmiss'));
      cv.querySelectorAll('[data-id],[data-lid],[data-fk]').forEach(el=>{const k=key(el);if(!done){if(M.has(k))el.classList.add('qmk');return;}
        if(T.has(k))el.classList.add(M.has(k)?'qok':'qmiss');else if(M.has(k))el.classList.add('qbad');});};paint();
    if(!done)cv.addEventListener('pointerdown',e=>{const el=e.target.closest('[data-fk],[data-lid],[data-id]');if(!el)return;e.preventDefault();const k=key(el);if(M.has(k))M.delete(k);else M.add(k);this.bdqView(mv);});
    const fin=ok=>{B.res[B.i]=ok;if(ok){const s=this.st();s.bdq.ok++;this.save();this.celebrate(false);}this.bdqView(mv);};
    const b=mv.querySelector('[data-bq=check]');if(b)b.addEventListener('click',()=>fin(M.size===T.size&&[...M].every(k=>T.has(k))));
    const o=mv.querySelector('[data-bq=ok]');if(o)o.addEventListener('click',()=>{M.clear();fin(T.size===0);});
    const n=mv.querySelector('[data-bq=next]');if(n){n.focus();n.addEventListener('click',()=>{B.i++;B.marks=new Set();if(B.i>=B.list.length)this.bqFinish();this.bdqView(mv);});}},
  bqStart(){const s=this.st(),all=BDQ.bank(),seen=new Set(s.bdq.seen||[]);let pool=all.map(q=>q.id).filter(i=>!seen.has(i));if(pool.length<5){s.bdq.seen=[];pool=all.map(q=>q.id);}
    const pick=shuffle(pool).slice(0,5);s.bdq.seen=[...(s.bdq.seen||[]),...pick].slice(-90);this.save();
    this._bdq={list:pick.map(i=>all.find(q=>q.id===i)),i:0,res:[],marks:new Set()};this.bdqView(document.getElementById('mainv'));},
  bqFinish(){const s=this.st(),B=this._bdq,ok=B.res.filter(Boolean).length;s.bdq.rounds++;if(ok===B.list.length){s.bdq.perfect++;this.save();this.give(1,'ronda perfecta de diagramas');}else this.save();}
});
