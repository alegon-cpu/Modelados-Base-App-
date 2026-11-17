/* ===================== Modo examen (online, con Firebase) =====================
   El profesor crea el examen (código de 4 cifras, minutos, qué partes son obligatorias u opcionales) y lo empieza.
   Los alumnos entran con el código: es una «actividad» (p.act) con act.online, así que se reutiliza todo el bloqueo del modo estudiante.
   La hora de inicio y de fin la guarda el servidor y las reglas de Firestore la comprueban: nadie lee el enunciado antes
   ni entrega después (con 30 s de margen para la red). Cada ordenador calcula su desfase con la hora del servidor. */
const EXP_N={bo:'Boceto',er:'E-R',rel:'Relacional',ded:'DED',sql:'SQL'},EXP_K=['bo','er','rel','ded','sql'];
const EX_NUNCA=Date.UTC(2100,0,1); // «todavía sin empezar»
const FBV={
  enc(v){if(v instanceof Date)return {timestampValue:v.toISOString()};if(typeof v==='number')return Number.isInteger(v)?{integerValue:String(v)}:{doubleValue:v};if(typeof v==='boolean')return {booleanValue:v};if(v==null)return {nullValue:null};return {stringValue:String(v)};},
  dec(f){if(!f)return null;if('stringValue' in f)return f.stringValue;if('integerValue' in f)return +f.integerValue;if('doubleValue' in f)return +f.doubleValue;if('booleanValue' in f)return f.booleanValue;if('timestampValue' in f)return Date.parse(f.timestampValue);return null;},
  doc(o){return {fields:Object.fromEntries(Object.entries(o).map(([k,v])=>[k,this.enc(v)]))};},
  obj(d){return d&&d.fields?Object.fromEntries(Object.entries(d.fields).map(([k,v])=>[k,this.dec(v)])):null;},
  id(d){return String((d&&d.name)||'').split('/').pop();}};
const mmss=ms=>{ms=Math.max(0,ms);const s=Math.ceil(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h?h+':'+String(m).padStart(2,'0'):m)+':'+String(x).padStart(2,'0');};
const hhmm=t=>{const d=new Date(t);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');};

const EX={PROFE:'18rE9rYdWiaji91O7gxa1QbNmOH2',off:0,_offs:[],_rt:{},uid:null,
  P:{who:null,list:null,sel:null,ent:null,last:0,busy:false,err:''},
  now(){return Date.now()+this.off;},
  rt(p){return this._rt[p.folder]||(this._rt[p.folder]={});},
  // Petición a Firestore (la hace el proceso principal). De paso se ajusta el reloj con la hora del servidor.
  async q(role,method,path,body){const t0=Date.now(),r=await window.api.fbReq(role,method,path,body),t1=Date.now();
    if(r.date&&t1-t0<4000){this._offs.push(r.date+500-(t0+t1)/2);if(this._offs.length>9)this._offs.shift();const s=[...this._offs].sort((a,b)=>a-b);this.off=s[s.length>>1];}
    if(role==='alumno'&&r.uid)this.uid=r.uid;return r;},
  err(r){if(r.status===403)return 'Firebase no lo permite (permiso denegado).';const m=r.data&&r.data.error&&r.data.error.message;return m?'Firebase: '+m:'Error '+r.status+' de Firebase.';},
  parse(d){const o=FBV.obj(d);if(!o)return null;let pt={};try{pt=JSON.parse(o.partes||'{}');}catch(e){}
    return {...o,code:FBV.id(d),req:(pt.req||[]).filter(k=>EXP_N[k]),opt:(pt.opt||[]).filter(k=>EXP_N[k])};},
  async meta(code,role){const r=await this.q(role,'GET','examenes/'+code);if(r.status===404)return null;if(r.status!==200)throw new Error(this.err(r));return this.parse(r.data);},
  partsTxt(req,opt){return (req.length?'Obligatorio: '+req.map(k=>EXP_N[k]).join(', '):'')+(opt.length?(req.length?' · ':'')+'Opcional: '+opt.map(k=>EXP_N[k]).join(', '):'');},

  /* ---------------- Alumno ---------------- */
  joinModal(){let nm='';try{nm=localStorage.getItem('mb-ex-nombre')||'';}catch(e){}
    App.modal(`<h3>Entrar a un examen</h3><p>Escribe el código que te ha dado el profesor y tu nombre, tal como quieres que lo vea.</p>
      <label class="fld">Código del examen<input type="text" id="exc" inputmode="numeric" maxlength="4" placeholder="1234" autocomplete="off" spellcheck="false" class="ex-codein"></label>
      <label class="fld">Nombre y apellidos<input type="text" id="exn" maxlength="60" value="${escA(nm)}" placeholder="Por ejemplo: Lucía Pérez Gómez" spellcheck="false"></label>
      <div class="mrow"><button class="ebtn" data-m="close">Cancelar</button><button class="ebtn pri" data-m="ex-join">Entrar</button></div>`);
    setTimeout(()=>{const c=document.getElementById('exc');if(c)c.focus();},30);},
  async join(btn){const code=(document.getElementById('exc').value||'').replace(/\D/g,''),nombre=(document.getElementById('exn').value||'').trim().replace(/\s+/g,' ');
    if(code.length!==4){toast('El código tiene 4 cifras.','warn');return;}if(nombre.length<3){toast('Escribe tu nombre y apellidos.','warn');return;}
    if(btn){btn.disabled=true;btn.textContent='Conectando…';}
    let m;try{m=await this.meta(code,'alumno');}catch(e){toast(e.message,'warn');if(btn){btn.disabled=false;btn.textContent='Entrar';}return;}
    if(btn){btn.disabled=false;btn.textContent='Entrar';}
    if(!m){toast('No hay ningún examen con el código '+code+'.','warn');return;}
    if(this.now()>m.fin){toast('Ese examen ya ha terminado.','warn');return;}
    try{localStorage.setItem('mb-ex-nombre',nombre);}catch(e){}
    App.closeModal();
    // si ya había entrado a este mismo examen (por ejemplo, se cerró la app), se sigue en el mismo proyecto
    const old=App.projects.find(p=>p.act&&p.act.online&&p.act.online.code===code&&p.act.online.id===m.creado);
    if(old){App.go(old,'enun');toast('Sigues en tu examen.');this.rt(old).last=0;return;}
    const names=new Set(App.projects.map(p=>p.name.toLowerCase()));let name='Examen '+code+' · '+String(m.titulo||'').trim();
    if(names.has(name.toLowerCase())){let i=2;while(names.has((name+' ('+i+')').toLowerCase()))i++;name+=' ('+i+')';}
    const np=await App.run(()=>window.api.create(name));if(!np)return;
    const parts=EXP_K.filter(k=>m.req.includes(k)||m.opt.includes(k));
    EXP_K.slice(0,4).forEach(k=>{np[k]=cleanModel({},k);});np.sql='';np.enun='El enunciado aparecerá aquí cuando el profesor empiece el examen.';
    np.act={title:String(m.titulo||''),mins:m.mins,parts,req:m.req,opt:m.opt,state:'ready',show:['enun',...parts],online:{code,id:m.creado,nombre,ini:m.inicio,fin:m.fin}};
    np.updated=Date.now();await App.run(()=>window.api.save(plainProject(np),exportSVGs(np)));
    await App.reload(np.folder);App.go(App.cur,'enun');
    App.modal(`<h3>Examen «${esc(m.titulo||'')}»</h3><p>${esc(this.partsTxt(m.req,m.opt))}. Tiempo: <b>${m.mins} minutos</b>.</p>
      <ul class="plist"><li>Cuando el profesor lo empiece aparecerá el enunciado y empezará a contar el tiempo, igual para todos.</li>
      <li>Todo se hace a mano: no se puede pasar del E-R a tablas, ni generar el SQL, ni mirar la teoría, ni jugar.</li>
      <li>Lo que haces se envía solo cada minuto. Pulsa <b>Entregar</b> cuando acabes (puedes volver a entregar hasta el final).</li>
      <li>Al acabar el tiempo se entrega solo y el proyecto se bloquea. No cierres la app.</li></ul>
      <div class="mrow"><button class="ebtn pri" data-m="close">Entendido</button></div>`);},
  tickAll(){for(const p of App.projects||[]){const a=p.act;if(a&&a.online&&(a.state==='ready'||a.state==='run'))this.tick(p);}this.tickProfe();},
  tick(p){const a=p.act,o=a.online,r=this.rt(p),now=this.now();
    const every=a.state==='ready'?(o.ini-now<8000?1000:3000):15000;
    if(!r.busy&&Date.now()-(r.last||0)>every){r.last=Date.now();this.sync(p);}
    if(a.state==='run'){if(now>=o.fin){if(!r.ending)this.finish(p);}
      else if(p.updated>(r.sentUpd||0)&&Date.now()-(r.sentAt||0)>60000&&!r.sending)this.send(p,false);}
    if(App.cur===p&&!App.home){const c=document.getElementById('actclock');if(c){
      if(a.state==='run'){const l=o.fin-now;c.textContent='⏱ '+mmss(l);c.classList.toggle('low',l<60000);}
      else if(a.state==='ready')c.textContent=o.ini<EX_NUNCA&&o.ini>now?'Empieza en '+mmss(o.ini-now):'Esperando a que el profesor empiece…';}
      const s=document.getElementById('exsent');if(s)s.textContent=this.sentTxt(p);}},
  sentTxt(p){const r=this.rt(p),o=p.act.online;if(r.sendErr)return '⚠ '+r.sendErr;if(o.entregada)return '✓ Entregado a las '+hhmm(o.entregada)+(p.updated>(r.sentUpd||0)?' (con cambios después: vuelve a entregar)':'');
    return r.sentAt?'Enviado solo a las '+hhmm(r.sentAt):'Todavía sin enviar';},
  async sync(p){const a=p.act,o=a.online,r=this.rt(p);r.busy=true;
    try{const m=await this.meta(o.code,'alumno');
      if(!m||m.creado!==o.id){a.state='over';o.borrado=1;App.touch(p);App.renderMain();toast('El profesor ha borrado el examen.','warn');return;}
      const ext=a.state==='run'&&m.fin>o.fin+1000;o.ini=m.inicio;o.fin=m.fin;a.end=o.fin-this.off;
      if(ext)toast('El profesor ha añadido tiempo: ahora acaba a las '+hhmm(o.fin-this.off)+'.');
      if(a.state==='ready'&&this.now()>=o.ini){const e=await this.q('alumno','GET',`examenes/${o.code}/enunciado/main`);
        if(e.status===200){const d=FBV.obj(e.data)||{};p.enun=String(d.texto||'');a.state='run';a.start=o.ini-this.off;a.end=o.fin-this.off;
          App.touch(p);App.flushAll();r.sentUpd=p.updated;if(App.cur===p)App.go(p,a.req[0]||a.parts[0]||'enun');
          toast('¡Empieza el examen! Tienes hasta las '+hhmm(o.fin-this.off)+'.');}}}
    catch(e){if(App.cur===p){const c=document.getElementById('exsent');if(c)c.textContent='⚠ '+e.message;}}
    finally{r.busy=false;}},
  payload(p,final){const a=p.act,o=a.online,pr={};a.parts.forEach(k=>{pr[k]=k==='sql'?String(p.sql||''):cleanModel(p[k],k);});
    return FBV.doc({nombre:o.nombre,estado:final||o.entregada?'entregada':'borrador',hora:new Date(this.now()),proyecto:JSON.stringify(pr)});},
  async send(p,final){const o=p.act.online,r=this.rt(p);if(r.sending)return false;r.sending=true;const upd=p.updated;
    try{if(!this.uid){const w=await window.api.fbWho();this.uid=w.alumno;}if(!this.uid)await this.meta(o.code,'alumno');
      const x=await this.q('alumno','PATCH',`examenes/${o.code}/entregas/${this.uid}`,this.payload(p,final));
      if(x.status!==200)throw new Error(x.status===403?'No se pudo enviar: el examen no está en marcha.':this.err(x));
      r.sentAt=Date.now();r.sendErr='';if(final){o.entregada=Date.now();if(p.updated===upd){App.touch(p);r.sentUpd=p.updated;}else r.sentUpd=upd;}else r.sentUpd=upd;return true;}
    catch(e){r.sendErr=e.message;return false;}
    finally{r.sending=false;if(App.cur===p){const s=document.getElementById('exsent');if(s)s.textContent=this.sentTxt(p);}}},
  async deliver(p){const ok=await this.send(p,true);if(ok){toast('Examen entregado. Si cambias algo, vuelve a pulsar Entregar.');App.renderMain();}else toast(this.rt(p).sendErr||'No se pudo entregar.','warn');},
  async finish(p){const a=p.act,r=this.rt(p);r.ending=true;let ok=false;
    for(let i=0;i<4&&!ok;i++){ok=await this.send(p,true);if(!ok)await new Promise(s=>setTimeout(s,3000));}
    a.state='over';a.online.final=ok?1:0;App.touch(p);App.flushAll();r.ending=false;if(App.cur===p)App.renderMain();
    App.modal(`<h3>Se acabó el tiempo</h3>${ok?`<p>Tu examen <b>se ha entregado</b> ✓. El profesor ya lo tiene.</p>`:`<p class="in-p warn">No se ha podido enviar la última versión (${esc(r.sendErr||'sin conexión')}). Avisa al profesor: tu examen sigue guardado en este proyecto.</p>`}
      <p>El proyecto queda bloqueado. Cuando el profesor lo diga, pulsa «Salir del modo examen» para poder editarlo otra vez.</p><div class="mrow"><button class="ebtn pri" data-m="close">Entendido</button></div>`);},
  bar(p){const a=p.act,o=a.online,now=this.now();
    const clock=a.state==='run'?`<span class="act-clock${o.fin-now<60000?' low':''}" id="actclock">⏱ ${mmss(o.fin-now)}</span>`
      :a.state==='ready'?`<span class="act-clock wait" id="actclock">${o.ini<EX_NUNCA&&o.ini>now?'Empieza en '+mmss(o.ini-now):'Esperando a que el profesor empiece…'}</span>`
      :`<span class="act-clock over">${o.borrado?'Examen borrado':'Se acabó el tiempo'}${o.final?' · entregado ✓':''}</span>`;
    return `<div class="actbar exbar ${a.state}"><span class="act-tag">Examen ${esc(o.code)}</span><span class="act-t"><b>${esc(a.title||'Examen')}</b> · ${esc(this.partsTxt(a.req||a.parts,a.opt||[]))} · ${esc(o.nombre)}${a.state==='run'?`<small id="exsent">${esc(this.sentTxt(p))}</small>`:''}</span>
      ${clock}${a.state==='run'?`<button class="ebtn pri" data-act="ex-deliver">Entregar</button>`:`<button class="ebtn" data-act="act-exit">Salir del modo examen</button>`}</div>`;},

  /* ---------------- Profesor ---------------- */
  open(){App.showHome('examen');this.loadProfe();},
  async loadProfe(){const P=this.P;try{P.who=await window.api.fbWho();}catch(e){P.who={};}if(P.who&&P.who.profe)await this.refreshList();else App.renderMain();},
  async refreshList(){const P=this.P;
    try{const r=await this.q('profe','POST',':runQuery',{structuredQuery:{from:[{collectionId:'examenes'}],where:{fieldFilter:{field:{fieldPath:'profe'},op:'EQUAL',value:{stringValue:P.who.profe.uid}}}}});
      if(r.status!==200)throw new Error(this.err(r));P.list=(r.data||[]).filter(x=>x.document).map(x=>this.parse(x.document)).sort((a,b)=>(b.creado||0)-(a.creado||0));P.err='';
      if(P.sel&&!P.list.some(x=>x.code===P.sel))P.sel=null;if(P.sel)await this.refreshEnt(true);}
    catch(e){P.err=e.message;if(/sesión|Primero inicia/i.test(e.message)){P.who=await window.api.fbWho().catch(()=>({}));}}
    P.last=Date.now();if(App.home==='examen')App.renderMain();},
  async refreshEnt(quiet){const P=this.P;if(!P.sel)return;
    try{const r=await this.q('profe','GET',`examenes/${P.sel}/entregas?pageSize=300`);if(r.status!==200)throw new Error(this.err(r));
      P.ent=((r.data&&r.data.documents)||[]).map(d=>({uid:FBV.id(d),...FBV.obj(d)})).sort((a,b)=>String(a.nombre).localeCompare(String(b.nombre),'es'));}
    catch(e){P.err=e.message;}if(!quiet&&App.home==='examen')App.renderMain();},
  tickProfe(){const P=this.P;if(App.home!=='examen'||!P.who||!P.who.profe)return;
    if(!P.busy&&Date.now()-P.last>(P.sel?5000:20000)){P.busy=true;this.refreshList().finally(()=>{P.busy=false;});}
    document.querySelectorAll('[data-exclock]').forEach(el=>{const x=(P.list||[]).find(e=>e.code===el.dataset.exclock);if(x)el.textContent=this.stTxt(x);});},
  st(x){const n=this.now();return x.inicio>=EX_NUNCA?'wait':n<x.inicio?'soon':n<x.fin?'run':'over';},
  stTxt(x){const n=this.now(),s=this.st(x);return s==='wait'?'Sin empezar':s==='soon'?'Empieza en '+mmss(x.inicio-n):s==='run'?'En marcha · quedan '+mmss(x.fin-n):'Terminado a las '+hhmm(x.fin-this.off);},
  render(mv){const P=this.P,w=P.who;let body;
    if(!w)body='<p class="tnote">Conectando…</p>';
    else if(!w.profe)body=`<section class="ex-card ex-login"><h3>Entrar como profesor</h3><p>Usa el correo y la contraseña de la cuenta de profesor (la de Firebase › Authentication). La contraseña no se guarda: solo se recuerda la sesión en este ordenador.</p>
      <label class="fld">Correo<input type="email" id="exmail" autocomplete="username" spellcheck="false" value="${escA(P.mail||'')}"></label>
      <label class="fld">Contraseña<input type="password" id="expass" autocomplete="current-password"></label>
      <div class="row"><button class="ebtn pri" data-act="ex-login">Entrar</button></div>${P.err?`<p class="in-p warn">${esc(P.err)}</p>`:''}</section>`;
    else{const sel=(P.list||[]).find(x=>x.code===P.sel);
      body=`<div class="ex-top"><span class="tnote">Sesión: <b>${esc(w.profe.email)}</b></span>${w.profe.uid!==this.PROFE?'<span class="in-p warn">Esta cuenta no es la del profesor: Firebase no te dejará crear exámenes.</span>':''}<span class="tspace"></span><button class="ebtn" data-act="ex-logout">Cerrar sesión</button><button class="ebtn pri" data-act="ex-new">Nuevo examen</button></div>
      ${P.err?`<p class="in-p warn">${esc(P.err)}</p>`:''}
      <div class="ex-cols"><section class="ex-list"><h3>Tus exámenes</h3>${P.list==null?'<p class="tnote">Cargando…</p>':P.list.length?P.list.map(x=>`<button class="ex-it st-${this.st(x)}" data-act="ex-sel" data-code="${x.code}" aria-pressed="${x.code===P.sel}"><b class="ex-code">${x.code}</b><span><b>${esc(x.titulo||'Sin título')}</b><small data-exclock="${x.code}">${esc(this.stTxt(x))}</small></span></button>`).join(''):'<p class="tnote">Todavía no has creado ninguno. Pulsa «Nuevo examen».</p>'}</section>
      <section class="ex-det">${sel?this.detail(sel):'<p class="tnote">Elige un examen de la lista para verlo y controlarlo.</p>'}</section></div>`;}
    mv.innerHTML=`<header class="ph"><span class="pname static">Examen · profesor</span><div class="ph-acts"><button class="ebtn" data-act="home">← Inicio</button></div></header><div class="view ex-v">${body}</div>`;},
  detail(x){const s=this.st(x),E=this.P.ent||[],done=E.filter(e=>e.estado==='entregada').length;
    const has=(e,k)=>{try{const pr=JSON.parse(e.proyecto||'{}'),v=pr[k];return k==='sql'?!!String(v||'').trim():v&&((v.nodes&&v.nodes.length)||(v.t&&v.t.length));}catch(err){return false;}};
    return `<div class="ex-head"><div><div class="ex-big">${x.code}</div><button class="ebtn sm" data-act="ex-copy" data-code="${x.code}">Copiar código</button></div>
      <div class="ex-info"><h3>${esc(x.titulo||'Sin título')}</h3><p>${esc(this.partsTxt(x.req,x.opt))} · ${x.mins} min</p><p class="ex-st st-${s}" data-exclock="${x.code}">${esc(this.stTxt(x))}</p></div></div>
      <div class="row ex-ctl">${s==='wait'?`<button class="ebtn pri" data-act="ex-start">Empezar ahora</button>`:''}${s==='soon'||s==='run'?`<button class="ebtn" data-act="ex-plus">+5 minutos</button><button class="ebtn" data-act="ex-end">Terminar ya</button>`:''}${s==='over'&&E.length?`<button class="ebtn pri" data-act="ex-openall">Abrir todas en la app</button>`:''}<span class="tspace"></span><button class="ebtn danger" data-act="ex-del">Borrar examen</button></div>
      <h4>Entregas <small>${E.length} conectados · ${done} entregadas</small></h4>
      ${E.length?`<div class="ex-tw"><table class="ex-t"><thead><tr><th>Alumno</th><th>Estado</th><th>Última vez</th>${[...x.req,...x.opt].map(k=>`<th>${EXP_N[k]}</th>`).join('')}<th></th></tr></thead><tbody>
        ${E.map(e=>`<tr><td>${esc(e.nombre||'?')}</td><td><span class="ex-pill${e.estado==='entregada'?' st-ok':''}">${e.estado==='entregada'?'Entregada':'Trabajando'}</span></td><td>${e.hora?hhmm(e.hora):'—'}</td>${[...x.req,...x.opt].map(k=>`<td>${has(e,k)?'✓':'·'}</td>`).join('')}<td><button class="ebtn sm" data-act="ex-openone" data-uid="${escA(e.uid)}">Abrir</button></td></tr>`).join('')}</tbody></table></div>`
        :`<p class="tnote">${s==='wait'?'Cuando lo empieces, aquí irán apareciendo los alumnos (lo que hacen se envía solo cada minuto).':'Nadie ha enviado nada todavía.'}</p>`}`;},
  newModal(){const cur=App.cur,en=cur&&(cur.enun||'').trim()&&!cur.act?cur.enun:'',def={er:'req',rel:'req',ded:'req',sql:'opt',bo:'opt'};
    App.modal(`<h3>Nuevo examen</h3><p>Se genera un código de 4 cifras para los alumnos. Nadie ve el enunciado hasta que empiece, y el tiempo es el mismo para todos.</p>
      <label class="fld">Título<input type="text" id="extitle" value="${escA(cur&&!cur.act&&en?cur.name:'')}" placeholder="Por ejemplo: Examen tema 2 · Biblioteca" spellcheck="false"></label>
      <label class="fld">Enunciado<textarea id="exenun" rows="8" placeholder="Pega o escribe aquí el enunciado…">${esc(en)}</textarea></label>
      <div class="in-sub">Qué hay que hacer</div><div class="ex-parts">${EXP_K.map(k=>`<label class="ex-pt"><span>${EXP_N[k]}</span><select data-expt="${k}">${[['no','No'],['req','Obligatorio'],['opt','Opcional']].map(([v,l])=>`<option value="${v}" ${def[k]===v?'selected':''}>${l}</option>`).join('')}</select></label>`).join('')}</div>
      <label class="fld">Tiempo (minutos)<input type="number" id="exmins" value="50" min="1" max="600" step="1"></label>
      <div class="in-sub">Cuándo empieza</div><div class="seg"><label class="tg"><input type="radio" name="exwhen" value="btn" checked><span>Cuando yo pulse «Empezar»</span></label><label class="tg"><input type="radio" name="exwhen" value="at"><span>A una hora</span></label><input type="time" id="exat" class="ex-at"></div>
      <div class="mrow"><button class="ebtn" data-m="close">Cancelar</button><button class="ebtn pri" data-m="ex-create">Crear examen</button></div>`);},
  async create(btn){const P=this.P,title=document.getElementById('extitle').value.trim(),enun=document.getElementById('exenun').value.trim(),mins=Math.round(+document.getElementById('exmins').value||0);
    const pt={req:[],opt:[]};document.querySelectorAll('[data-expt]').forEach(s=>{if(s.value!=='no')pt[s.value].push(s.dataset.expt);});
    if(!title){toast('Pon un título.','warn');return;}if(!enun){toast('Escribe el enunciado.','warn');return;}if(!pt.req.length&&!pt.opt.length){toast('Elige al menos una cosa que hacer.','warn');return;}if(!(mins>0&&mins<=600)){toast('Pon los minutos (de 1 a 600).','warn');return;}
    let ini=EX_NUNCA;if((document.querySelector('[name=exwhen]:checked')||{}).value==='at'){const v=document.getElementById('exat').value;if(!v){toast('Elige la hora de inicio.','warn');return;}
      const [h,m]=v.split(':').map(Number),d=new Date();d.setHours(h,m,0,0);if(d.getTime()<Date.now()+30000){toast('Esa hora ya ha pasado.','warn');return;}ini=d.getTime()+this.off;}
    btn.disabled=true;btn.textContent='Creando…';
    try{let code=null;
      for(let i=0;i<10&&!code;i++){const c=String(1000+Math.floor(Math.random()*9000)),r=await this.q('profe','POST','examenes?documentId='+c,FBV.doc({titulo:title,profe:P.who.profe.uid,inicio:new Date(ini),fin:new Date(ini+mins*60000),mins,partes:JSON.stringify(pt),creado:new Date(this.now())}));
        if(r.status===200)code=c;else if(r.status!==409)throw new Error(this.err(r));}
      if(!code)throw new Error('No se encontró un código libre. Prueba otra vez.');
      const e=await this.q('profe','PATCH',`examenes/${code}/enunciado/main`,FBV.doc({texto:enun}));if(e.status!==200)throw new Error(this.err(e));
      App.closeModal();P.sel=code;P.ent=[];await this.refreshList();toast('Examen creado. Código: '+code);}
    catch(err){toast(err.message,'warn');btn.disabled=false;btn.textContent='Crear examen';}},
  async setTimes(code,ini,fin,msg){const r=await this.q('profe','PATCH',`examenes/${code}?updateMask.fieldPaths=inicio&updateMask.fieldPaths=fin`,FBV.doc({inicio:new Date(ini),fin:new Date(fin)}));
    if(r.status!==200){toast(this.err(r),'warn');return;}toast(msg);await this.refreshList();},
  async del(code){const P=this.P;try{const r=await this.q('profe','GET',`examenes/${code}/entregas?pageSize=300`);
      for(const d of (r.data&&r.data.documents)||[])await this.q('profe','DELETE',`examenes/${code}/entregas/${FBV.id(d)}`);
      await this.q('profe','DELETE',`examenes/${code}/enunciado/main`);const x=await this.q('profe','DELETE','examenes/'+code);if(x.status!==200)throw new Error(this.err(x));
      if(P.sel===code){P.sel=null;P.ent=null;}toast('Examen '+code+' borrado.');await this.refreshList();}catch(e){toast(e.message,'warn');}},
  // Las entregas se abren como proyectos normales dentro de una carpeta «Examen 1234 · título»
  async importEnt(x,list){const P=this.P,gname=('Examen '+x.code+' · '+(x.titulo||'')).trim();
    let enun='';try{const e=await this.q('profe','GET',`examenes/${x.code}/enunciado/main`);enun=String((FBV.obj(e.data)||{}).texto||'');}catch(e){}
    let g=(App.groups||[]).find(k=>k===gname||k.startsWith(gname+' ('));if(!g)g=await App.run(()=>window.api.mkGroup('',gname));if(!g)return null;
    let last=null;for(const e of list){let pr={};try{pr=JSON.parse(e.proyecto||'{}');}catch(err){}
      const np=await App.run(()=>window.api.create(String(e.nombre||'Alumno').slice(0,60),g));if(!np)continue;
      EXP_K.slice(0,4).forEach(k=>{np[k]=cleanModel(pr[k]||{},k);});np.sql=String(pr.sql||'');np.enun=enun;np.updated=Date.now();
      await App.run(()=>window.api.save(plainProject(np),exportSVGs(np)));last=np.folder;}
    await App.reload(last);return last;},
  /* ---------------- Clics ---------------- */
  async action(a,b){const P=this.P,p=App.cur,x=(P.list||[]).find(e=>e.code===P.sel);
    if(a==='ex-join'){this.joinModal();return;}
    if(a==='ex-profe'){this.open();return;}
    if(a==='ex-deliver'){if(p&&p.act&&p.act.online)await this.deliver(p);return;}
    if(a==='ex-login'){const m=P.mail=document.getElementById('exmail').value,pw=document.getElementById('expass');b.disabled=true;b.textContent='Entrando…';
      try{await window.api.fbLogin(m,pw.value);P.err='';pw.value='';P.list=null;await this.loadProfe();}catch(e){P.err=e.message;pw.value='';App.renderMain();}return;}
    if(a==='ex-logout'){await window.api.fbLogout();P.who=null;P.list=null;P.sel=null;P.ent=null;await this.loadProfe();return;}
    if(a==='ex-new'){this.newModal();return;}
    if(a==='ex-sel'){P.sel=b.dataset.code;P.ent=null;App.renderMain();await this.refreshEnt();return;}
    if(a==='ex-copy'){try{await navigator.clipboard.writeText(b.dataset.code);toast('Código copiado.');}catch(e){toast('Código: '+b.dataset.code);}return;}
    if(!x)return;
    if(a==='ex-start'){const n=this.now()+5000;await this.setTimes(x.code,n,n+x.mins*60000,'¡Examen empezado! Los alumnos lo verán en unos segundos.');return;}
    if(a==='ex-plus'){await this.setTimes(x.code,x.inicio,x.fin+300000,'+5 minutos: ahora acaba a las '+hhmm(x.fin+300000-this.off)+'.');return;}
    if(a==='ex-end'){App.confirm('Terminar el examen ya','Los alumnos tendrán 20 segundos más y luego se entregará solo lo que tengan.','Terminar',()=>{const n=this.now()+20000;this.setTimes(x.code,Math.min(x.inicio,n-1000),n,'El examen termina en 20 segundos.');});return;}
    if(a==='ex-del'){App.confirm('Borrar el examen '+x.code,'Se borran el examen, el enunciado y todas las entregas de Firebase. Las que ya abriste en la app se quedan.','Borrar',()=>this.del(x.code));return;}
    if(a==='ex-openone'){const e=(P.ent||[]).find(z=>z.uid===b.dataset.uid);if(!e)return;const f=await this.importEnt(x,[e]);const np=f&&App.projects.find(z=>z.folder===f);if(np){App.go(np,x.req[0]||'er');toast('Abierta la entrega de '+e.nombre+'.');}return;}
    if(a==='ex-openall'){const f=await this.importEnt(x,P.ent||[]);if(f){toast((P.ent||[]).length+' entregas abiertas en la carpeta «Examen '+x.code+'».');App.renderMain();}return;}},
  async m(k,b){if(k==='ex-join'){await this.join(b);return;}if(k==='ex-create'){await this.create(b);return;}}};
