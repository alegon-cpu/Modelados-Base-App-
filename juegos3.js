/* ===================== 2.8: nombre de jugador, nivel, racha, Cardinalidad rápida, clasificación y temporadas ===================== */
// Temporadas: fondo animado automático según la fecha
function seasonNow(d){d=d||new Date();const md=(d.getMonth()+1)*100+d.getDate(),in_=(a,b)=>a<=b?md>=a&&md<=b:md>=a||md<=b;
  if(in_(1025,1102))return{fx:'halloween',n:'Halloween'};if(in_(1201,106))return{fx:'navidad',n:'Navidad'};if(in_(210,215))return{fx:'corazones',n:'San Valentín'};
  if(in_(922,1130))return{fx:'otono',n:'Otoño'};if(in_(107,319))return{fx:'nieve',n:'Invierno'};if(in_(320,620))return{fx:'sakura',n:'Primavera'};return{fx:'verano',n:'Verano'};}
const yKey=()=>{const d=new Date();d.setDate(d.getDate()-1);const z=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate());};
const LV_NEED=n=>100+20*(n-1); // experiencia para pasar del nivel n al n+1
const STREAK_PRIZE={3:2,7:5,14:10,30:20,60:30,100:50};

// Cardinalidad rápida: [frase, respuesta]
const CARD_Q=[['Un alumno se matricula en varias asignaturas y cada asignatura tiene muchos alumnos','N:M'],['Cada país tiene una capital y cada capital es de un país','1:1'],['Un cliente hace muchos pedidos y cada pedido es de un cliente','1:N'],
  ['Un autor escribe varios libros y un libro puede tener varios autores','N:M'],['Cada persona tiene un DNI y cada DNI es de una persona','1:1'],['Un equipo tiene muchos jugadores y cada jugador juega en un equipo','1:N'],
  ['Un médico atiende a muchos pacientes y cada paciente puede ir a varios médicos','N:M'],['Un departamento tiene muchos empleados y cada empleado pertenece a un departamento','1:N'],['Cada coche tiene una matrícula y cada matrícula es de un coche','1:1'],
  ['Un actor sale en muchas películas y en cada película salen muchos actores','N:M'],['Una provincia tiene muchos municipios y cada municipio está en una provincia','1:N'],['Cada empleado tiene un puesto de trabajo único y cada puesto lo ocupa un empleado','1:1'],
  ['Un profesor imparte varias asignaturas y cada asignatura la imparte un profesor','1:N'],['Un producto está en muchos pedidos y un pedido tiene muchos productos','N:M'],['Cada usuario tiene un perfil y cada perfil es de un usuario','1:1'],
  ['Un hotel tiene muchas habitaciones y cada habitación es de un hotel','1:N'],['Un socio coge prestados muchos libros y un libro lo cogen muchos socios a lo largo del tiempo','N:M'],['Cada matrimonio une a una persona con otra (monogamia)','1:1'],
  ['Una madre biológica tiene varios hijos y cada hijo tiene una madre biológica','1:N'],['Un estudiante pertenece a varios clubes y cada club tiene varios estudiantes','N:M'],['Cada aeropuerto tiene un código IATA y cada código es de un aeropuerto','1:1'],
  ['Una editorial publica muchos libros y cada libro lo publica una editorial','1:N'],['Un cantante canta en muchos festivales y en cada festival cantan muchos cantantes','N:M'],['Cada factura tiene un número único y cada número es de una factura','1:1'],
  ['Un cine tiene varias salas y cada sala es de un cine','1:N'],['Un ingrediente se usa en muchas recetas y una receta lleva muchos ingredientes','N:M'],['Cada alumno tiene un expediente y cada expediente es de un alumno','1:1'],
  ['Un usuario escribe muchos comentarios y cada comentario es de un usuario','1:N'],['Un jugador participa en muchos torneos y en cada torneo juegan muchos jugadores','N:M'],['Cada coche tiene un motor y cada motor está en un coche','1:1'],
  ['Una empresa tiene muchas sedes y cada sede es de una empresa','1:N'],['Un empleado trabaja en varios proyectos y en cada proyecto trabajan varios empleados','N:M'],['Cada ordenador del aula tiene una IP fija y cada IP es de un ordenador','1:1'],
  ['Un vuelo tiene muchos pasajeros y un pasajero hace muchos vuelos','N:M'],['Una categoría tiene muchos productos y cada producto es de una categoría','1:N'],['Cada presidente gobierna un país (a la vez) y cada país tiene un presidente','1:1'],
  ['Un curso tiene varios grupos y cada grupo es de un curso','1:N'],['Un hashtag aparece en muchas publicaciones y una publicación tiene muchos hashtags','N:M'],['Cada cuenta bancaria tiene un IBAN y cada IBAN es de una cuenta','1:1'],
  ['Un artista tiene muchos álbumes y cada álbum es de un artista','1:N'],['Un paciente toma muchos medicamentos y un medicamento lo toman muchos pacientes','N:M'],['Cada jugador de un equipo lleva un dorsal distinto y cada dorsal es de un jugador','1:1'],
  ['Un repartidor entrega muchos paquetes y cada paquete lo entrega un repartidor','1:N'],['Una ruta de autobús pasa por muchas paradas y por una parada pasan muchas rutas','N:M'],['Cada empleado tiene una taquilla y cada taquilla es de un empleado','1:1'],
  ['Una tienda tiene muchas facturas y cada factura es de una tienda','1:N'],['Un idioma se habla en muchos países y en un país se hablan muchos idiomas','N:M'],['Cada estado de un usuario es su configuración: una por usuario','1:1'],
  ['Un granjero tiene muchas vacas y cada vaca es de un granjero','1:N'],['Un profesor da clase a muchos grupos y cada grupo tiene muchos profesores','N:M'],['Cada teléfono móvil tiene un IMEI y cada IMEI es de un móvil','1:1'],
  ['Una playlist tiene muchas canciones y una canción está en muchas playlists','N:M'],['Un blog tiene muchas entradas y cada entrada es de un blog','1:N'],['Cada piso tiene una referencia catastral y cada referencia es de un piso','1:1'],
  ['Un museo expone muchas obras y cada obra está en un museo','1:N'],['Un veterinario atiende muchas mascotas y una mascota va a varios veterinarios','N:M'],['Cada concursante tiene un número de inscripción y cada número es de un concursante','1:1'],
  ['Un barco tiene muchos tripulantes y cada tripulante está en un barco','1:N'],['Un alumno hace muchos exámenes y cada examen lo hacen muchos alumnos','N:M']];
const CARD_N=10,CARD_T=10000;

Object.assign(Juegos,{
  /* ---------- experiencia y nivel ---------- */
  lvlInfo(){const s=this.st();let lv=1,xp=s.xp;while(xp>=LV_NEED(lv)){xp-=LV_NEED(lv);lv++;}return{lv,cur:xp,need:LV_NEED(lv)};},
  addXp(n,quiet){if(!(n>0))return;const s=this.st(),before=this.lvlInfo().lv;s.xp+=Math.round(n);const L=this.lvlInfo();
    if(L.lv>before){for(let v=before+1;v<=L.lv;v++){s.tokens+=2;s.earned+=2;const it=RW_NIVEL.find(x=>x.lvl===v);if(it&&!s.owned[it.id])s.owned[it.id]=1;
        toast(`¡Nivel ${v}! +2 tokens${it?' y '+it.n:''}`);if(it)this.celebrate(true);}s.lvl=L.lv;this.save();this.badge();this.rankSoon();}
    else this.save();const hb=document.getElementById('jglvl');if(hb&&!quiet)hb.outerHTML=this.lvlBar();},
  lvlBar(){const L=this.lvlInfo(),s=this.st();return `<div class="lv-bar" id="jglvl"><span class="lv-n" title="Nivel de jugador">Nv. <b>${L.lv}</b></span><span class="jg-prog"><i style="width:${L.cur/L.need*100}%"></i></span><small>${L.cur}/${L.need} XP</small><span class="lv-st" title="Días seguidos abriendo la app">🔥 <b>${s.streak.n}</b> día${s.streak.n===1?'':'s'}</span></div>`;},

  /* ---------- racha: cuenta abrir la app cada día ---------- */
  daily(){const s=this.st(),t=todayKey();if(s.streak.last===t)return;s.streak.n=s.streak.last===yKey()?s.streak.n+1:1;s.streak.last=t;s.streak.best=Math.max(s.streak.best||0,s.streak.n);
    const p=STREAK_PRIZE[s.streak.n];if(p){s.tokens+=p;s.earned+=p;}this.save();this.addXp(25+Math.min(10,s.streak.n)*5,true);
    setTimeout(()=>toast(`🔥 Racha de ${s.streak.n} día${s.streak.n===1?'':'s'}${p?` · +${p} tokens de premio`:''} · +${25+Math.min(10,s.streak.n)*5} XP`),1500);},

  /* ---------- nombre de jugador fijo ---------- */
  player(){return this.st().player||null;},
  playerTag(p){p=p||this.player();return p?`${p.name}#${p.tag}`:'';},
  playerBox(){if(this.player())return '';return `<section class="pl-new"><div><b>Elige tu nombre de jugador</b><small>Es el que verán tus compañeros en la clasificación. <b>No se podrá cambiar</b>, así que piénsalo bien. De 3 a 16 letras o números.</small></div>
      <div class="row"><input id="plname" maxlength="16" placeholder="Por ejemplo: Ale" autocomplete="off" spellcheck="false"><button class="ebtn pri" id="plgo">Crear</button></div></section>`;},
  playerWire(mv){const go=document.getElementById('plgo'),inp=document.getElementById('plname');if(!go)return;
    const make=()=>{const n=(inp.value||'').trim().replace(/\s+/g,' ');if(!/^[\p{L}\p{N}_ .-]{3,16}$/u.test(n)){toast('Usa de 3 a 16 letras, números, espacios, puntos o guiones.','warn');inp.focus();return;}
      App.confirm('¿Seguro?',`Tu nombre de jugador será «${n}» y no se podrá cambiar.`,'Sí, ese',()=>{const s=this.st();if(s.player)return;const rnd=new Uint8Array(8);crypto.getRandomValues(rnd);
        s.player={name:n,tag:String(1000+Math.floor(Math.random()*9000)),id:[...rnd].map(b=>b.toString(16).padStart(2,'0')).join(''),at:Date.now()};if(!s.nick){s.nick=n;}this.save();toast(`¡Hola, ${this.playerTag()}!`);this.rankSoon();App.renderMain();});};
    go.addEventListener('click',make);inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();make();}});},

  /* ---------- Cardinalidad rápida ---------- */
  cardView(mv){const s=this.st(),G=this._cd;
    if(!G){mv.innerHTML=this.head('Cardinalidad rápida',true)+`<div class="view jg"><div class="jg-in narrow"><section class="cd-start"><span class="jg-ic big">⏱️</span><h2>Cardinalidad rápida</h2>
        <p>Sale una frase y tienes <b>10 segundos</b> para decir si la relación es <b>1:1</b>, <b>1:N</b> o <b>N:M</b>. Rondas de ${CARD_N}. Con 7 o más aciertos, 1 token. Teclas 1, 2 y 3.</p>
        <button class="ebtn pri big" id="cdgo">▶ Empezar</button><small class="tnote">Mejor ronda: ${s.card.best}/${CARD_N} · rondas: ${s.card.rounds}</small></section></div></div>`;
      document.getElementById('cdgo').addEventListener('click',()=>{this._cd={list:shuffle(CARD_Q).slice(0,CARD_N),i:0,ok:0,res:[],t0:0};this.cardView(mv);});return;}
    if(G.i>=G.list.length){const win=G.ok>=7;mv.innerHTML=this.head('Cardinalidad rápida',true)+`<div class="view jg"><div class="jg-in narrow"><section class="cd-start"><span class="jg-ic big">${win?'🏆':'📚'}</span><h2>${G.ok} de ${G.list.length}</h2>
        <p>${win?'¡Token ganado!':'Te faltan aciertos para el token (7). ¡Otra!'}</p><ol class="cd-rev">${G.list.map(([q,a],i)=>`<li class="${G.res[i]===a?'ok':'ko'}"><span>${esc(q)}</span><b>${a}</b>${G.res[i]&&G.res[i]!==a?`<small>Dijiste ${G.res[i]==='-'?'nada (tiempo)':G.res[i]}</small>`:''}</li>`).join('')}</ol>
        <button class="ebtn pri big" id="cdgo">▶ Otra ronda</button></section></div></div>`;
      document.getElementById('cdgo').addEventListener('click',()=>{this._cd={list:shuffle(CARD_Q).slice(0,CARD_N),i:0,ok:0,res:[],t0:0};this.cardView(mv);});return;}
    const [q]=G.list[G.i];mv.innerHTML=this.head('Cardinalidad rápida',true)+`<div class="view jg"><div class="jg-in narrow"><section class="cd-q"><div class="cd-top"><span>${G.i+1} / ${G.list.length}</span><span>Aciertos: <b>${G.ok}</b></span></div>
      <div class="cd-time"><i id="cdbar"></i></div><p class="cd-frase">${esc(q)}</p><div class="cd-ops">${['1:1','1:N','N:M'].map((o,i)=>`<button class="cd-op" data-cd="${o}"><small>${i+1}</small>${o}</button>`).join('')}</div></section></div></div>`;
    G.t0=performance.now();const bar=document.getElementById('cdbar');
    const answer=o=>{if(G.done)return;G.done=true;cancelAnimationFrame(G.raf);G.unkey&&G.unkey();const a=G.list[G.i][1];G.res[G.i]=o;if(o===a){G.ok++;this.addXp(3,true);}
      mv.querySelectorAll('.cd-op').forEach(b=>{b.disabled=true;if(b.dataset.cd===a)b.classList.add('ok');else if(b.dataset.cd===o)b.classList.add('ko');});
      setTimeout(()=>{G.i++;G.done=false;if(G.i>=G.list.length)this.cardFinish();if(this.sub==='card')this.cardView(mv);},o===a?550:1300);};
    mv.querySelectorAll('.cd-op').forEach(b=>b.addEventListener('click',()=>answer(b.dataset.cd)));
    this._gm={stop:()=>{cancelAnimationFrame(G.raf);G.unkey&&G.unkey();this._cd=null;}};G.unkey=this.gameKeys(e=>{const o={'1':'1:1','2':'1:N','3':'N:M'}[e.key];if(o){answer(o);return true;}return false;});
    const tick=t=>{const k=(t-G.t0)/CARD_T;if(bar)bar.style.width=Math.max(0,100-k*100)+'%';if(bar&&k>.7)bar.classList.add('hurry');if(k>=1){answer('-');return;}G.raf=requestAnimationFrame(tick);};G.raf=requestAnimationFrame(tick);},
  cardFinish(){const s=this.st(),G=this._cd;s.card.rounds++;s.card.best=Math.max(s.card.best,G.ok);this.addXp(10+G.ok*2);if(G.ok>=7){s.card.perfect++;this.save();this.give(1,`${G.ok} de ${G.list.length} en Cardinalidad rápida`);}else this.save();this.rankSoon();},

  /* ---------- clasificación de la clase (repositorio de GitHub compartido) ---------- */
  rankData(){const s=this.st(),p=this.player(),L=this.lvlInfo(),pet=RWBY[s.eq.pet],tt=RWBY[s.eq.title];if(!p)return null;
    return {id:p.id,name:p.name,tag:p.tag,lvl:L.lv,xp:s.xp,streak:s.streak.n,streakBest:s.streak.best,tetris:s.tetris.best,snake:s.snake.wins,flappy:s.flappy.best,mines:s.mines.wins,card:s.card.best,quiz:s.quiz.perfect,
      bdq:s.bdq.perfect,coleccion:Object.keys(s.owned).length,pase:(s.pase&&s.pase.lv)||0,pet:pet?pet.e:'',title:tt?tt.n:'',t:Date.now(),v:VERSION};},
  rankSoon(){clearTimeout(this._rkT);this._rkT=setTimeout(()=>this.rankPush(),4000);},
  async rankConnect(){if(this._rkTry)return this._rkTry;this._rkTry=window.api.rankSetup().then(()=>true,e=>{this._rkTry=null;throw e;});return this._rkTry;},
  async rankPush(){try{const d=this.rankData();if(!d||!window.api.rankPublish)return;let i=await window.api.rankInfo();if(!i.on){await this.rankConnect();i=await window.api.rankInfo();}if(!i.on)return;await window.api.rankPublish(d);this._rkLast=Date.now();}catch(e){}},
  RANK_COLS:[['lvl','Nivel',r=>`Nv. ${r.lvl}`,(a,b)=>b.lvl-a.lvl||b.xp-a.xp],['streak','Racha',r=>`🔥 ${r.streak} días`,(a,b)=>b.streak-a.streak],['tetris','Tetris',r=>`${r.tetris} puntos`,(a,b)=>b.tetris-a.tetris],
    ['snake','Serpiente',r=>`${r.snake} mapas`,(a,b)=>b.snake-a.snake],['flappy','Flappy',r=>`${r.flappy} tubos`,(a,b)=>b.flappy-a.flappy],['mines','Buscaminas',r=>`${r.mines} ganadas`,(a,b)=>b.mines-a.mines],
    ['card','Cardinalidad',r=>`${r.card}/10`,(a,b)=>b.card-a.card],['coleccion','Colección',r=>`${r.coleccion} premios`,(a,b)=>b.coleccion-a.coleccion]],
  async rankView(mv){const by=this._rkBy||'lvl',me=this.player();let info={on:false};try{info=await window.api.rankInfo();}catch(e){}
    const page=body=>{mv.innerHTML=this.head('Clasificación de la clase',true)+`<div class="view jg"><div class="jg-in">${body}</div></div>`;};
    if(!info.on){page('<p class="tnote">Conectando con la clasificación de la clase…</p>');try{await this.rankConnect();info=await window.api.rankInfo();}catch(e){
        if(this.sub!=='rank')return;page(`<section class="rk-setup"><span class="jg-ic big">🏆</span><h2>No se ha podido conectar</h2><p>${esc(String(e.message||e).replace(/^Error: /,''))}</p><div class="row"><button class="ebtn pri" id="rkgo">Reintentar</button></div></section>`);
        document.getElementById('rkgo').addEventListener('click',()=>this.rankView(mv));return;}}
    if(this.sub!=='rank')return;page('<p class="tnote">Cargando la clasificación…</p>');
    await this.rankPush();let r={list:[]};try{r=await window.api.rankList();}catch(e){toast('No se ha podido cargar: '+String(e.message||e),'warn');}try{info=await window.api.rankInfo();}catch(e){}
    if(this.sub!=='rank')return;const C=this.RANK_COLS.find(c=>c[0]===by)||this.RANK_COLS[0],list=[...r.list].filter(p=>!(info.err==='noperm'&&me&&p.id===me.id)).sort(C[3]),mine=me&&list.some(p=>p.id===me.id);
    const warn=!me?'<p class="in-p warn">Crea tu nombre de jugador en el menú de «No cliques esto» para salir en la clasificación.</p>'
      :info.err==='noperm'?`<section class="rk-perm"><b>Aún no puedes salir en la clasificación</b><ol><li>Pide a <b>alegon-cpu</b> que te invite en GitHub (en el repositorio: <i>Settings › Collaborators › Add people</i>, con tu usuario de GitHub).</li><li>Acepta la invitación: te llega al correo de GitHub.</li><li>Pulsa «Actualizar». Si Git te pide iniciar sesión, entra con tu cuenta de GitHub.</li></ol><small>Mientras tanto puedes ver la clasificación de los demás.</small></section>`
      :info.err?`<p class="in-p warn">No se ha podido subir tu puntuación: ${esc(info.err)}</p>`:'';
    page(`<section class="rk-top"><div class="seg wide">${this.RANK_COLS.map(c=>`<button class="segb" data-rk="${c[0]}" aria-pressed="${c[0]===C[0]}">${c[1]}</button>`).join('')}</div>
        <div class="row"><button class="ebtn" id="rkre">↻ Actualizar</button></div></section>${r.offline?'<p class="in-p warn">Sin conexión: se enseña lo último que se descargó.</p>':''}${warn}
      <ol class="rk-list">${list.map((p,i)=>`<li class="${me&&p.id===me.id?'me':''}${i<3?' top'+(i+1):''}"><span class="rk-pos">${['🥇','🥈','🥉'][i]||i+1}</span><span class="rk-pet">${esc(p.pet||'🙂')}</span><span class="rk-name"><b>${esc(p.name)}<small>#${esc(p.tag)}</small></b><small>${esc(p.title||'')}${p.title?' · ':''}Nv. ${p.lvl|0} · 🔥 ${p.streak|0}</small></span><span class="rk-val">${esc(C[2](p))}</span></li>`).join('')||'<li class="empty">Aún no hay nadie. ¡Sé el primero jugando!</li>'}</ol>
      <p class="tnote">${list.length} jugador${list.length===1?'':'es'}${me&&mine?' · tu puntuación se sube sola cuando subes de nivel o juegas':''} · se guarda en <code>${esc(String(info.url).replace(/^https:\/\/github\.com\//,''))}</code></p>`);
    mv.querySelectorAll('[data-rk]').forEach(b=>b.addEventListener('click',()=>{this._rkBy=b.dataset.rk;this.rankView(mv);}));
    document.getElementById('rkre').addEventListener('click',()=>this.rankView(mv));}
});
// menú: tarjeta de Cardinalidad rápida
const _menuExtra=Juegos.menuExtra;
Juegos.menuExtra=function(){const X=_menuExtra.call(this),s=this.st();X.card=`<button class="jg-card" data-jg="card"><span class="jg-ic">⏱️</span><b>Cardinalidad rápida</b><small>Una frase, 10 segundos: ¿1:1, 1:N o N:M? Rondas de ${CARD_N}: con 7 aciertos, 1 token.</small><em>Mejor ronda: ${s.card.best}/${CARD_N}</em></button>`;return X;};
// el menú enseña el formulario del nombre de jugador si aún no lo tiene
const _render=Juegos.render;
Juegos.render=function(mv){_render.call(this,mv);if(this.sub==='menu'){const h=mv.querySelector('.jg-hero');if(h&&!this.player()){h.insertAdjacentHTML('afterend',this.playerBox());this.playerWire(mv);}}};
// en el perfil: nombre de jugador (fijo), nivel y racha
const _perfil=Juegos.perfilView;
Juegos.perfilView=function(mv){_perfil.call(this,mv);const p=this.player(),f=mv.querySelector('.jg-prof-f');if(!f)return;const s=this.st();
  f.insertAdjacentHTML('afterbegin',`<div class="pl-fixed">${p?`<span>Nombre de jugador <b>${esc(p.name)}<small>#${esc(p.tag)}</small></b> <em>fijo</em></span>`:'<span>Aún no tienes nombre de jugador: créalo en el menú de «No cliques esto».</span>'}${this.lvlBar()}<small>Mejor racha: ${s.streak.best||0} días</small></div>`);};
