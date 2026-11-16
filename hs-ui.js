/* ===================== Ecos de Prisma: menús, invocación y progreso =====================
   El progreso va en el estado de los juegos («mb:juego» → progreso-modelado.json → GitHub), así que pasa de un ordenador a otro. */
const HS_MIS=[['t','Aguanta 5 minutos en una partida',300,2],['k','Derrota 400 enemigos',400,2],['u','Usa 6 definitivas',6,1],['r','Provoca 30 reacciones',30,1],['b','Rompe la dureza de 5 enemigos',5,1]];
const HS_ACH=[
  ['run1','Primera función','Juega tu primera partida',m=>m.runs>=1,2],['t5','Aguante','Llega al minuto 5',m=>m.best.t>=300,2],['t10','Resistencia','Llega al minuto 10',m=>m.best.t>=600,3],
  ['win','¡Telón!','Vence al jefe del minuto 15',m=>m.wins>=1,8],['t30','Hasta el Juicio','Llega al minuto 30',m=>m.best.t>=1800,15],
  ['k1k','Mil','Derrota 1.000 enemigos en total',m=>m.tot.kills>=1000,2],['k10k','Diez mil','Derrota 10.000 enemigos en total',m=>m.tot.kills>=10000,6],['k50k','La horda entera','Derrota 50.000 enemigos en total',m=>m.tot.kills>=50000,12],
  ['r100','Químico','Provoca 100 reacciones',m=>m.tot.react>=100,2],['r1k','Alquimista','Provoca 1.000 reacciones',m=>m.tot.react>=1000,5],['br50','Rompedor','Rompe 50 barras de dureza',m=>m.tot.breaks>=50,3],
  ['gf1','¡Que empiece la función!','Haz tu primera Gran Función',m=>m.tot.gf>=1,3],['gf10','Compañía estable','Haz 10 Grandes Funciones',m=>m.tot.gf>=10,5],['el','Cazador de élites','Derrota 25 élites',m=>m.tot.elites>=25,3],
  ['gold','Brillo dorado','Derrota una élite dorada',m=>m.tot.gold>=1,10],['ch20','Saqueador','Abre 20 cofres',m=>m.tot.chests>=20,3],['own10','Compañía','Ten 10 personajes',m=>Object.keys(m.ch).length>=10,4],
  ['ownall','Elenco completo','Ten todos los personajes',m=>Object.keys(m.ch).length>=HS_CHARS.length,15],['c6','Constelación completa','Lleva un personaje a C6',m=>Object.values(m.ch).some(c=>c.c>=6),8],
  ...Object.keys(HS_GUARD).map(k=>['g'+k,'Resonancia: '+HS_EL[k].n,'Vence a '+HS_GUARD[k].n,m=>!!m.guards[k],4])];
const _hsStop=Juegos.stopAll;
Juegos.stopAll=function(){_hsStop.call(this);if(typeof HSG!=='undefined')HSG.stop();};
const _hsMenu=Juegos.menuExtra;
Juegos.menuExtra=function(){const X=_hsMenu.call(this),M=this.hsMeta();X.cards=`<button class="jg-card hs-menucard" data-jg="hs"><span class="jg-ic">🎭</span><b>Ecos de Prisma</b><small>Hordas sin fin con un equipo de 4: elementos y reacciones, jefes cada 3 minutos, portales, la Gran Función de la Farsa y ${HS_CHARS.length} personajes que conseguir. Partidas de 15 minutos.</small><em>Récord: ${HSG.fmt(M.best.t)} · ${Object.keys(M.ch).length}/${HS_CHARS.length} personajes</em></button>`+X.cards;return X;};
const _hsRender=Juegos.render;
Juegos.render=function(mv){if(this.sub==='hs')return this.hsView(mv);return _hsRender.call(this,mv);};
Object.assign(Juegos,{
  hsMeta(){const s=this.st();if(!s.hs){s.hs={lumen:500,sellos:10,ch:{},g:{},team:[...HS_START],p5:0,p4:0,pulls:0,best:{t:0,k:0,lvl:0},runs:0,wins:0,guards:{},mis:{day:'',p:{},done:{}},ach:{},tot:{}};HS_START.forEach(id=>s.hs.ch[id]={c:0,up:{}});}
    const M=s.hs;M.ch=M.ch||{};M.g=M.g||{};M.best=M.best||{t:0,k:0,lvl:0};M.guards=M.guards||{};M.ach=M.ach||{};M.tot=M.tot||{};['kills','react','breaks','gf','chests','elites','gold','ults','bosses'].forEach(k=>M.tot[k]=M.tot[k]|0);
    M.team=(M.team||[]).filter(id=>M.ch[id]).slice(0,3);if(!M.team.length)M.team=Object.keys(M.ch).slice(0,1);
    const day=typeof todayKey==='function'?todayKey():new Date().toISOString().slice(0,10);if(!M.mis||M.mis.day!==day)M.mis={day,p:{},done:{}};return M;},
  hsImg(c,alt){const k=c.id+(alt?'*':'');this._hsImg=this._hsImg||{};return this._hsImg[k]||(this._hsImg[k]=HSG.sprite(c,alt).toDataURL());},
  hsView(mv){const M=this.hsMeta(),tab=this._hsTab||'jugar';
    const T=(k,t)=>`<button class="segb" data-hstab="${k}" aria-pressed="${tab===k}">${t}</button>`;
    const misReady=HS_MIS.filter(([k,,n])=>(M.mis.p[k]|0)>=n&&!M.mis.done[k]).length+HS_ACH.filter(a=>a[3](M)&&!M.ach[a[0]]).length;
    mv.innerHTML=this.head('Ecos de Prisma',true)+`<div class="view jg"><div class="jg-in hs-in"><div class="hs-logo"><b>Ecos de Prisma</b><small>Hordas, elementos y la Gran Función</small></div>
      <div class="hs-top"><div class="seg">${T('jugar','▶ Jugar')}${T('pers','Personajes')}${T('inv','Invocar')}${T('mis','Misiones y logros'+(misReady?` <span class="hs-dot">${misReady}</span>`:''))}</div>
        <div class="hs-cur"><span title="Lumen: para mejorar personajes">✨ <b>${M.lumen}</b> lumen</span><span title="Sellos: para invocar personajes">🎟 <b>${M.sellos}</b> sellos</span></div></div>
      <div class="hs-body"></div></div></div>`;
    const body=mv.querySelector('.hs-body');({jugar:this.hsPlay,pers:this.hsPers,inv:this.hsInv,mis:this.hsMis}[tab]||this.hsPlay).call(this,body,M);
    mv.querySelectorAll('[data-hstab]').forEach(b=>b.addEventListener('click',()=>{this._hsTab=b.dataset.hstab;this.hsView(mv);}));},
  /* ---------- Jugar: elegir equipo ---------- */
  hsPlay(body,M){const own=HS_CHARS.filter(c=>M.ch[c.id]);
    const slotH=i=>{const id=M.team[i],c=HS_BY[id],lab=i?'Apoyo '+i:'Principal';if(!c)return `<div class="hs-slot empty${i?' sup':' main'}"><span class="hs-k">${lab}</span><span>${i?'Hueco de apoyo':'Elige a tu personaje'}</span><small>Pulsa un personaje de abajo</small></div>`;
      const sp=HS_SUPP[c.role]||HS_SUPP.dps;return `<button class="hs-slot${i?' sup':' main'}" data-rm="${i}" title="Quitar"><span class="hs-k">${lab}</span><img src="${this.hsImg(c,M.ch[id].alt&&M.ch[id].useAlt)}" alt=""><b>${esc(c.n)}</b><small>${HS_EL[c.el].ic} ${HS_ROLE[c.role]}</small>${i?`<em class="hs-pas">Pasivo: ${esc(sp.d)}${HS_SUPPX[c.id]?'. '+esc(HS_SUPPX[c.id]):''}<br>Ataque extra: ${esc(this.hsPat(c.s,'u'))}</em>`:`<em class="hs-pas">Lo manejas tú: básico y habilidad automáticos, definitiva con Espacio</em>`}</button>`;};
    body.innerHTML=`<div class="hs-play"><section class="hs-teambox"><h3>Tu equipo <small>1 principal que manejas + 2 apoyos que te dan un pasivo y atacan de vez en cuando</small></h3>
      <div class="hs-team">${[0,1,2].map(slotH).join('')}</div>
      <div class="hs-go"><button class="ebtn pri big" id="hsgo" ${M.team.length?'':'disabled'}>▶ Empezar partida</button><div class="hs-best">Récord: <b>${HSG.fmt(M.best.t)}</b> · ${M.best.k} bajas · nivel ${M.best.lvl} · ${M.runs} partidas · ${M.wins} completadas</div></div>
      <div class="hs-syn">${this.hsSyn(M.team)}</div></section>
      <section><h3>Tus personajes <small>${own.length} de ${HS_CHARS.length} · consigue más en «Invocar»</small></h3><div class="hs-grid">${own.map(c=>this.hsCard(c,M,M.team.includes(c.id))).join('')}</div></section>
      <section class="hs-help"><h3>Cómo se juega</h3><ul>${HS_TIPS.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p class="tnote">Al terminar ganas lumen y sellos para este juego, y también experiencia y fragmentos ◆ para la app. Si completas los 15 minutos, 1 token.</p></section></div>`;
    body.querySelectorAll('[data-pick]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.pick,i=M.team.indexOf(id);if(i>=0)M.team.splice(i,1);else if(M.team.length<3)M.team.push(id);else{toast('El equipo ya tiene 3 (1 principal y 2 apoyos). Quita a alguien primero.');return;}this.save();this.hsPlay(body,M);}));
    body.querySelectorAll('[data-rm]').forEach(b=>b.addEventListener('click',()=>{M.team.splice(+b.dataset.rm,1);this.save();this.hsPlay(body,M);}));
    const go=body.querySelector('#hsgo');if(go)go.addEventListener('click',()=>this.hsStart());},
  hsSyn(team){const cs=team.map(id=>HS_BY[id]).filter(Boolean),out=[];if(!cs.length)return '';const els=new Set(cs.map(c=>c.el));
    Object.entries(HS_REACT).forEach(([k,R])=>{if(els.has(k[0])&&els.has(k[1]))out.push(`${HS_EL[k[0]].ic}+${HS_EL[k[1]].ic} ${R.n.replace(/[¡!]/g,'')}`);});
    if(els.has('v')&&els.size>1)out.push('🌀 Remolino');if(els.has('t')&&els.size>1)out.push('⛰️ Cristal');
    const far=cs.filter(c=>c.role==='farsa');if(far.length)out.push(`🎭 Gran Función con ${far.length} (pulsa R)`+(cs.some(c=>c.lead)?' · dirige Risón':''));if(cs.some(c=>c.role==='heal'))out.push('💚 Sanación');if(cs.some(c=>c.role==='tank'))out.push('🛡 Escudo');
    return out.length?`<b>Sinergias:</b> ${out.map(x=>`<span>${x}</span>`).join('')}`:'<b>Sinergias:</b> <span>Mezcla elementos para provocar reacciones</span>';},
  hsCard(c,M,sel,locked){const o=M.ch[c.id];return `<button class="hs-ch r${c.r}${sel?' sel':''}${locked?' locked':''}" ${locked?`data-info="${c.id}"`:`data-pick="${c.id}" data-info2="${c.id}"`} style="--el:${HS_EL[c.el].c}">
      <span class="hs-stars">${'★'.repeat(c.r)}</span>${o&&o.c?`<span class="hs-cons">C${o.c}</span>`:''}<img src="${this.hsImg(c,o&&o.alt&&o.useAlt)}" alt="">
      <b>${locked?'???':esc(c.n)}</b><small>${HS_EL[c.el].ic} ${HS_EL[c.el].n} · ${HS_WEAP[c.w]}</small><small>${HS_ROLE[c.role]}</small></button>`;},
  /* ---------- Personajes: archivo y mejoras ---------- */
  hsPers(body,M){const sel=this._hsSel&&HS_BY[this._hsSel]?HS_BY[this._hsSel]:HS_CHARS.find(c=>M.ch[c.id]);
    body.innerHTML=`<div class="hs-pers"><div class="hs-grid small">${HS_CHARS.map(c=>`<button class="hs-ch mini r${c.r}${M.ch[c.id]?'':' locked'}${sel===c?' sel':''}" data-sel="${c.id}" style="--el:${HS_EL[c.el].c}"><img src="${this.hsImg(c)}" alt=""><b>${M.ch[c.id]?esc(c.n):'???'}</b></button>`).join('')}</div>
      <div class="hs-detail">${sel?this.hsDetail(sel,M):''}</div></div>
      <section class="hs-gup"><h3>Mejoras de cuenta</h3><div class="hs-upg">${Object.entries(HS_GUPG).map(([k,[n,d,max,base]])=>{const r=M.g[k]|0,cost=Math.round(base*(1+r*.8));return `<div class="hs-u"><b>${n}</b><small>${d}</small><span>${r}/${max}</span><button class="ebtn" data-gup="${k}" ${r>=max||M.lumen<cost?'disabled':''}>${r>=max?'Al máximo':cost+' ✨'}</button></div>`;}).join('')}</div></section>`;
    body.querySelectorAll('[data-sel]').forEach(b=>b.addEventListener('click',()=>{this._hsSel=b.dataset.sel;this.hsPers(body,M);}));
    body.querySelectorAll('[data-up]').forEach(b=>b.addEventListener('click',()=>{const c=sel,k=b.dataset.up,[,,max,base]=HS_UPG[k],o=M.ch[c.id];o.up=o.up||{};const r=o.up[k]|0,cost=Math.round(base*(1+r*.6));if(r>=max||M.lumen<cost)return;M.lumen-=cost;o.up[k]=r+1;this.save();this.hsView(document.getElementById('mainv'));}));
    body.querySelectorAll('[data-gup]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.gup,[,,max,base]=HS_GUPG[k],r=M.g[k]|0,cost=Math.round(base*(1+r*.8));if(r>=max||M.lumen<cost)return;M.lumen-=cost;M.g[k]=r+1;this.save();this.hsView(document.getElementById('mainv'));}));
    const alt=body.querySelector('[data-alt]');if(alt)alt.addEventListener('click',()=>{const o=M.ch[sel.id];o.useAlt=!o.useAlt;this.save();this.hsPers(body,M);});},
  hsDetail(c,M){const o=M.ch[c.id],E=HS_EL[c.el];const kit=(S,nm,k)=>`<li><b>${nm}</b> <small>${this.hsPat(S,k)}</small></li>`;
    return `<div class="hs-dh" style="--el:${E.c}"><img src="${this.hsImg(c,o&&o.alt&&o.useAlt)}" alt=""><div><h3>${o?esc(c.n):'???'} <span class="hs-stars">${'★'.repeat(c.r)}</span></h3><p class="hs-tt">${o?esc(c.t):'Aún no lo tienes'}</p>
      <p>${E.ic} ${E.n} · ${HS_WEAP[c.w]} · ${HS_ROLE[c.role]}${o?` · Constelación C${o.c|0}`:''}</p></div></div>
      ${o?`<p class="hs-desc">${esc(c.d)}</p>
      <ul class="hs-kit">${kit(c.b,'Básico (automático)','b')}${kit(c.s,'Habilidad (automática)','s')}${kit(c.u,'Definitiva (Espacio, '+c.u.cost+' de energía)','u')}<li><b>Pasivo</b> <small>${esc(c.pas)}</small></li>${c.perf?`<li><b>Actuación en la Gran Función</b> <small>${esc(c.perf)}</small></li>`:''}</ul>
      <div class="hs-stats"><span>Vida <b>${c.hp}</b></span><span>Ataque <b>×${c.atk}</b></span><span>Crítico <b>${Math.round(c.crit*100)} %</b></span><span>Constelación <b>+${(o.c|0)*10} % daño</b></span></div>
      ${o.alt?`<button class="ebtn" data-alt>${o.useAlt?'Usar el atuendo normal':'Usar el atuendo alternativo'}</button>`:''}
      <h4>Mejoras de ${esc(c.n)}</h4><div class="hs-upg">${Object.entries(HS_UPG).map(([k,[n,d,max,base]])=>{const r=(o.up&&o.up[k])|0,cost=Math.round(base*(1+r*.6));return `<div class="hs-u"><b>${n}</b><small>${d}</small><span>${r}/${max}</span><button class="ebtn" data-up="${k}" ${r>=max||M.lumen<cost?'disabled':''}>${r>=max?'Al máximo':cost+' ✨'}</button></div>`;}).join('')}</div>`
      :`<p class="hs-desc">Consíguelo en «Invocar». ${HS_FEATURED.includes(c.id)?'<b>Está destacado ahora mismo.</b>':''}</p>`}`;},
  hsPat(S,k){const P={arc:'Corte en abanico delante',thrust:'Estocadas que atraviesan'+(S.combo?`; cada ${S.combo}.º golpe es más largo`:''),spin:'Giro que golpea alrededor',shot:'Disparos'+(S.bounce?' que rebotan':'')+(S.pierce?' que atraviesan':'')+(S.charge?`; cada ${S.charge}.º es cargado`:''),homing:'Orbes que persiguen',orbit:'Orbes que giran a tu alrededor',nova:'Onda alrededor'+(S.slow?' que ralentiza':''),meteor:'Meteorito en el enemigo más cercano'+(S.petrify?' que petrifica':''),rain:'Lluvia de golpes sobre varios enemigos',chain:'Rayo en cadena',chainbig:`Rayo que salta ${S.n||8} veces`,beam:'Rayo continuo',vortex:'Remolino que atrae',vortexbig:'Gran remolino que atrae',tornado:'Tornado que te sigue',trail:'Deja un rastro que daña',turret:'Pone una torreta',summon:'Invoca un eco que pelea',summonbig:'Invoca un eco grande',heal:'Cura a todo el equipo',healzone:'Zona que cura y daña',shield:'Escudo',buff:'+25 % de daño al equipo',dash:'Acometida rápida',mark:'Marca a los enemigos más fuertes',taunt:'Provoca y gana escudo',crystal:'Cristales de escudo y onda',wave:'Ola que lo atraviesa todo',slash:'Tajo que cruza la pantalla',judgment:'Tajo que cruza la pantalla y Modo Tronante',stars:'Estrellas que rebotan',erase:'Borra balas y deja débiles al Vacío',dice:'Dado gigante ×1–×6',confetti:'Confeti que daña a todos y da Risas',detonate:'Hace estallar todo el daño en el tiempo',eye:'Orbe de tormenta: rayo cada vez que golpeas (dura '+(S.dur||25)+' s)'}[S.p]||S.p;
    return P+(S.cd&&k!=='u'?` · cada ${S.cd} s`:'');},
  /* ---------- Invocar ---------- */
  hsInv(body,M,res){const s=this.st(),F=HS_FEATURED.map(id=>HS_BY[id]);
    body.innerHTML=`<div class="hs-inv"><section class="hs-banner"><div class="hs-bart">${F.map(c=>`<img src="${this.hsImg(c)}" alt="">`).join('')}</div><div class="hs-btxt"><h3>Invocación estelar</h3><p>Destacados: <b>${F.map(c=>esc(c.n)).join('</b> y <b>')}</b>. Si sale un 5★, la mitad de las veces es uno de ellos.</p>
      <p class="tnote">5★: 1,5 % (asegurado a las 70) · 4★: 13 % (asegurado cada 10) · Repetidos: +1 constelación (hasta C6) · Atuendo alternativo: 1 de cada 100.<br>Llevas <b>${M.p5}</b> sin 5★ y <b>${M.p4}</b> sin 4★.</p>
      <div class="hs-mrow"><button class="ebtn pri" data-pull="1" ${M.sellos<1?'disabled':''}>Invocar ×1 · 1 🎟</button><button class="ebtn pri" data-pull="10" ${M.sellos<10?'disabled':''}>Invocar ×10 · 10 🎟</button><button class="ebtn" data-swap ${s.tokens<1?'disabled':''} title="Cambia un token de la app por sellos">1 token de la app → 5 🎟</button></div></div></section>
      <div class="hs-res">${res?res.map(r=>`<div class="hs-ri r${r.c?r.c.r:0}${r.alt?' alt':''}">${r.c?`<img src="${this.hsImg(r.c,r.alt)}" alt=""><b>${esc(r.c.n)}</b><small>${r.nuevo?'¡Nuevo!':r.alt?'¡Atuendo alternativo!':r.cons>6?'+300 ✨':'C'+r.cons}</small>`:`<span class="hs-lum">✨</span><b>+${r.l} lumen</b>`}</div>`).join(''):'<p class="tnote">Los sellos se ganan jugando: cofres, jefes, portales, misiones y logros. No hay dinero real.</p>'}</div></div>`;
    body.querySelectorAll('[data-pull]').forEach(b=>b.addEventListener('click',()=>{const n=+b.dataset.pull;if(M.sellos<n)return;M.sellos-=n;const r=[];for(let i=0;i<n;i++)r.push(this.hsPull(M,n===10&&i===9));this.save();this.hsReveal(r,()=>this.hsView(document.getElementById('mainv')),body,M);}));
    const sw=body.querySelector('[data-swap]');if(sw)sw.addEventListener('click',()=>{const s=this.st();if(s.tokens<1)return;s.tokens--;M.sellos+=5;this.save();this.badge();this.hsView(document.getElementById('mainv'));});},
  hsPull(M,last10){M.pulls++;M.p5++;M.p4++;let r5=.015;if(M.p5>60)r5+=(M.p5-60)*.06;const x=Math.random();let c=null;
    if(M.p5>=70||x<r5){M.p5=0;const fives=HS_CHARS.filter(c=>c.r===5);c=Math.random()<.5?HS_BY[HS_FEATURED[Math.floor(Math.random()*HS_FEATURED.length)]]:fives[Math.floor(Math.random()*fives.length)];}
    else if(M.p4>=10||x<r5+.13||last10&&M.p4>=9){M.p4=0;const fours=HS_CHARS.filter(c=>c.r===4);c=fours[Math.floor(Math.random()*fours.length)];}
    if(!c){const l=20+Math.floor(Math.random()*40);M.lumen+=l;return{l};}
    const o=M.ch[c.id];let nuevo=false,alt=false,cons=0;if(!o){M.ch[c.id]={c:0,up:{}};nuevo=true;}else{o.c=(o.c|0)+1;cons=o.c;if(o.c>6){o.c=6;M.lumen+=300;cons=7;}}
    if(Math.random()<.01){M.ch[c.id].alt=true;alt=true;}return{c,nuevo,alt,cons};},
  hsReveal(r,done,body,M){const best=r.reduce((b,x)=>Math.max(b,x.c?x.c.r:0),0);const ov=document.createElement('div');ov.className='hs-warp b'+best;ov.innerHTML=`<div class="hs-shoot"></div><button class="ebtn hs-skip">Saltar ⏭</button>`;document.body.appendChild(ov);
    let ended=false;const end=()=>{if(ended)return;ended=true;ov.remove();const mv=document.getElementById('mainv');if(!mv)return;this._hsTab='inv';this.hsView(mv);this.hsInv(mv.querySelector('.hs-body'),M,r);if(best===5)this.celebrate(true);};
    ov.querySelector('.hs-skip').addEventListener('click',end);setTimeout(end,best===5?2600:1700);},
  /* ---------- Misiones y logros ---------- */
  hsMis(body,M){body.innerHTML=`<div class="hs-mis"><section><h3>Misiones de hoy <small>se renuevan cada día</small></h3><div class="hs-list">${HS_MIS.map(([k,t,n,rw])=>{const p=Math.min(n,M.mis.p[k]|0),ok=p>=n,dn=M.mis.done[k];return `<div class="hs-li${dn?' done':''}"><span><b>${esc(t)}</b><span class="jg-prog"><i style="width:${p/n*100}%"></i></span><small>${k==='t'?HSG.fmt(p)+' / '+HSG.fmt(n):p+' / '+n}</small></span><button class="ebtn${ok&&!dn?' pri':''}" data-mis="${k}" ${ok&&!dn?'':'disabled'}>${dn?'Hecha':'+'+rw+' 🎟'}</button></div>`;}).join('')}</div></section>
      <section><h3>Logros <small>${Object.keys(M.ach).length} de ${HS_ACH.length}</small></h3><div class="hs-list">${HS_ACH.map(([id,t,d,f,rw])=>{const ok=f(M),dn=M.ach[id];return `<div class="hs-li${dn?' done':''}"><span><b>${esc(t)}</b><small>${esc(d)}</small></span><button class="ebtn${ok&&!dn?' pri':''}" data-ach="${id}" ${ok&&!dn?'':'disabled'}>${dn?'Conseguido':'+'+rw+' 🎟'}</button></div>`;}).join('')}</div></section></div>`;
    body.querySelectorAll('[data-mis]').forEach(b=>b.addEventListener('click',()=>{const m=HS_MIS.find(x=>x[0]===b.dataset.mis);if(!m||M.mis.done[m[0]]||(M.mis.p[m[0]]|0)<m[2])return;M.mis.done[m[0]]=1;M.sellos+=m[3];this.save();this.hsView(document.getElementById('mainv'));}));
    body.querySelectorAll('[data-ach]').forEach(b=>b.addEventListener('click',()=>{const a=HS_ACH.find(x=>x[0]===b.dataset.ach);if(!a||M.ach[a[0]]||!a[3](M))return;M.ach[a[0]]=1;M.sellos+=a[4];this.save();this.hsView(document.getElementById('mainv'));}));},
  /* ---------- partida ---------- */
  hsStart(){const M=this.hsMeta(),mv=document.getElementById('mainv');if(!M.team.length)return;this.stopAll();
    mv.innerHTML=this.head('Ecos de Prisma',true)+`<div class="view jg"><div class="jg-in hs-in"><div class="hs-host"></div></div></div>`;
    const host=mv.querySelector('.hs-host');HSG.start(host,{meta:M,team:M.team.map(id=>id),onEnd:res=>this.hsEnd(res)});
    this._gm={stop:()=>HSG.stop()};},
  hsEnd(res){const M=this.hsMeta();HSG.stop();this._gm=null;M.runs++;M.lumen+=res.lumen;M.sellos+=res.sellos;
    if(res.time>M.best.t)M.best.t=Math.floor(res.time);M.best.k=Math.max(M.best.k,res.kills);M.best.lvl=Math.max(M.best.lvl,res.lvl);if(res.won)M.wins++;
    res.guards.forEach(k=>M.guards[k]=1);const T=M.tot;T.kills+=res.kills;T.react+=res.react;T.breaks+=res.breaks;T.gf+=res.gf;T.chests+=res.chests;T.elites+=res.elites;T.gold+=res.gold;T.ults+=res.ults;T.bosses+=res.bosses;
    const P=M.mis.p;P.t=Math.max(P.t|0,Math.floor(res.time));P.k=(P.k|0)+res.kills;P.u=(P.u|0)+res.ults;P.r=(P.r|0)+res.react;P.b=(P.b|0)+res.breaks;
    this.save();
    const xp=Math.min(250,Math.round(res.time/60*12+res.bosses*25)),fr=Math.floor(res.time/120);if(xp>0)this.addXp(xp);if(fr>0)this.addFrags(fr);if(res.won)this.give(1,'Ecos de Prisma: 15 minutos');
    const mv=document.getElementById('mainv');if(!mv)return;const newAch=HS_ACH.filter(a=>a[3](M)&&!M.ach[a[0]]).length;
    mv.innerHTML=this.head('Ecos de Prisma',true)+`<div class="view jg"><div class="jg-in hs-in"><section class="hs-end"><h2>${res.won?'¡Partida completada!':'Fin de la función'}</h2>
      <div class="hs-team end">${res.team.map(id=>`<img src="${this.hsImg(HS_BY[id])}" alt="">`).join('')}</div>
      <div class="hs-pstats"><span>Tiempo <b>${HSG.fmt(res.time)}</b></span><span>Nivel <b>${res.lvl}</b></span><span>Bajas <b>${res.kills}</b></span><span>Jefes <b>${res.bosses}</b></span><span>Reacciones <b>${res.react}</b></span><span>Rupturas <b>${res.breaks}</b></span>${res.gf?`<span>Grandes Funciones <b>${res.gf}</b></span>`:''}${res.guards.length?`<span>Resonancias <b>${res.guards.map(k=>HS_EL[k].ic).join(' ')}</b></span>`:''}</div>
      <div class="hs-rw"><span>+${res.lumen} ✨ lumen</span><span>+${res.sellos} 🎟 sellos</span><span>+${xp} XP de la app</span>${fr?`<span>+${fr} ◆</span>`:''}${res.won?'<span>+1 token</span>':''}</div>
      ${newAch?`<p class="tnote">Tienes ${newAch} logro${newAch>1?'s':''} nuevo${newAch>1?'s':''} para cobrar en «Misiones y logros».</p>`:''}
      <div class="hs-mrow"><button class="ebtn pri big" id="hsagain">▶ Otra partida</button><button class="ebtn" id="hsback">Volver al menú</button></div></section></div></div>`;
    mv.querySelector('#hsagain').addEventListener('click',()=>this.hsStart());mv.querySelector('#hsback').addEventListener('click',()=>{this._hsTab='jugar';this.hsView(mv);});},
});
