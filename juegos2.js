/* ===================== 2.7: pase de temporada, conjuntos, pieles, mascotas, Tetris, Flappy, Buscaminas y Ruleta ===================== */
const PASE={id:'T1',name:'Temporada 1 · Invierno',end:new Date(2026,11,15,23,59,59),per:100,
  lv:[{tok:3},{it:'x-tt0'},{tok:5},{it:'x-pet0'},{tok:10},{it:'x-fr0'},{tok:5},{it:'x-sk0'},{tok:10},{it:'x-bg0'},
      {tok:5},{it:'x-tt1'},{tok:10},{it:'x-cur0'},{tok:15},{it:'x-sk1'},{tok:10},{it:'x-tr0'},{tok:20},{it:'x-pet1'}]};
const todayKey=()=>{const d=new Date(),z=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate());};

Object.assign(Juegos,{
  /* ---------- fragmentos y pase de temporada ---------- */
  addFrags(n,why){if(!(n>0))return;const s=this.st();s.frags+=n;this.paseAdd(n);this.save();this.badge();},
  paseOn(){return Date.now()<=PASE.end.getTime();},
  paseSt(){const s=this.st();if(s.pase.id!==PASE.id)s.pase={id:PASE.id,f:0,lv:0};return s.pase;},
  paseAdd(n){if(!(n>0)||!this.paseOn())return;const s=this.st(),P=this.paseSt();P.f+=n;const lv=Math.min(PASE.lv.length,Math.floor(P.f/PASE.per));
    while(P.lv<lv){P.lv++;const R=PASE.lv[P.lv-1];let what;if(R.tok){s.tokens+=R.tok;s.earned+=R.tok;what=`+${R.tok} tokens`;}else{s.owned[R.it]=(s.owned[R.it]||0)+1;what=RWBY[R.it].n;}
      toast(`¡Nivel ${P.lv} del pase de temporada! ${what}`);if(!R.tok)this.celebrate(true);}
    this.save();},
  paseDays(){return Math.max(0,Math.ceil((PASE.end.getTime()-Date.now())/86400000));},
  paseView(mv){const s=this.st(),P=this.paseSt(),on=this.paseOn(),max=PASE.lv.length,inLv=P.lv>=max?PASE.per:P.f%PASE.per,d=this.paseDays();
    mv.innerHTML=this.head('Pase de temporada',true)+`<div class="view jg"><div class="jg-in"><section class="ps-hero"><div class="ps-snow" aria-hidden="true"></div>
      <div class="ps-t"><small>${esc(PASE.name)}</small><h2>Nivel <b>${P.lv}</b> de ${max}</h2><p>${on?`Termina el <b>15/12</b> · quedan <b>${d}</b> día${d===1?'':'s'}`:'<b>Esta temporada ha terminado.</b> Lo que conseguiste es tuyo para siempre.'}</p>
      <div class="ps-bar"><span class="jg-prog"><i style="width:${inLv/PASE.per*100}%"></i></span><span>${P.lv>=max?'¡Pase completado!':`${inLv} / ${PASE.per} ◆ para el nivel ${P.lv+1}`}</span></div></div>
      <div class="ps-how"><b>Cada ${PASE.per} fragmentos ◆ que ganes = 1 nivel</b><small>Los fragmentos salen de: Tetris (1 por línea), Serpiente (1 cada 5 frutas), Flappy (1 cada 5 tubos), Buscaminas, la Ruleta diaria y los premios repetidos de las tiradas. Gastarlos no te quita niveles.</small></div></section>
      <div class="ps-track">${PASE.lv.map((R,i)=>{const n=i+1,got=P.lv>=n,x=R.it&&RWBY[R.it];
        return `<div class="ps-lv${got?' got':''}${n===P.lv+1&&on?' next':''}${x?' item':''}"><span class="ps-n">${n}</span>${x?this.rewardThumb(x,true):`<span class="rw-th emo">🎟️</span>`}<b>${x?esc(x.n):`${R.tok} tokens`}</b><small>${x?this.kindName[x.kind]:'Tokens'}</small>${got?'<em class="new">✓ Conseguido</em>':''}</div>`;}).join('')}</div>
      <p class="tnote">Los premios del pase son exclusivos: no salen en las tiradas. Se dan solos al subir de nivel y se equipan desde el Álbum o el Perfil.</p></div></div>`;},

  /* ---------- conjuntos (perfiles de decoración) ---------- */
  presetsHTML(){const s=this.st();return `<section class="ps-sets"><h3>Conjuntos <small>Guarda lo que llevas puesto y cámbialo de un clic</small></h3>
      ${s.presets.length?`<div class="set-list">${s.presets.map((p,i)=>`<div class="set-it"><b>${esc(p.n)}</b><small>${Object.values(p.eq).filter(Boolean).length} cosas</small><button class="ebtn pri" data-pre-use="${i}">Usar</button><button class="ebtn" data-pre-up="${i}" title="Guardar aquí lo que llevas puesto ahora">Actualizar</button><button class="ebtn danger" data-pre-del="${i}">Borrar</button></div>`).join('')}</div>`:'<p class="tnote">Aún no tienes conjuntos. Ponte lo que quieras y guárdalo con un nombre, por ejemplo «Modo examen» o «Navidad».</p>'}
      <div class="row"><input id="prename" maxlength="24" placeholder="Nombre del conjunto"><button class="ebtn" id="presave">Guardar lo que llevo puesto</button></div></section>`;},
  presetsWire(mv){const s=this.st(),nm=document.getElementById('prename'),sv=document.getElementById('presave');
    const save=()=>{const n=(nm.value||'').trim()||('Conjunto '+(s.presets.length+1));if(s.presets.length>=12){toast('Como mucho 12 conjuntos: borra alguno.','warn');return;}s.presets.push({n,eq:{...s.eq}});this.save();toast(`Conjunto «${n}» guardado.`);this.perfilView(mv);};
    sv.addEventListener('click',save);nm.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();save();}});
    mv.querySelectorAll('[data-pre-use]').forEach(b=>b.addEventListener('click',()=>{const p=s.presets[+b.dataset.preUse];if(!p)return;const eq={};Object.entries(p.eq).forEach(([k,v])=>{if(v&&s.owned[v])eq[k]=v;});s.eq=eq;this.save();this.apply();toast(`Puesto el conjunto «${p.n}».`);this.perfilView(mv);}));
    mv.querySelectorAll('[data-pre-up]').forEach(b=>b.addEventListener('click',()=>{const p=s.presets[+b.dataset.preUp];if(!p)return;p.eq={...s.eq};this.save();toast(`Conjunto «${p.n}» actualizado.`);}));
    mv.querySelectorAll('[data-pre-del]').forEach(b=>b.addEventListener('click',()=>{s.presets.splice(+b.dataset.preDel,1);this.save();this.perfilView(mv);}));},

  /* ---------- pieles de la serpiente ---------- */
  skinSwatch(sk){const c=sk.c||[],bg={grad:`linear-gradient(90deg,${c[0]},${c[1]})`,stripes:`repeating-linear-gradient(90deg,${c.map((x,i)=>`${x} ${i*8}px ${(i+1)*8}px`).join(',')})`,neon:`linear-gradient(90deg,${c[0]},${c[1]})`,
      fire:`linear-gradient(90deg,${c[2]},${c[1]},${c[0]})`,robot:`repeating-linear-gradient(90deg,${c[0]} 0 10px,${c[1]} 10px 12px)`,dragon:`linear-gradient(90deg,${c[1]},${c[0]})`,
      rainbow:'linear-gradient(90deg,#FF3D7F,#FF9A3D,#FFE14A,#3DD68C,#3BA4FF,#B66DFF)',galaxy:`radial-gradient(circle at 30% 40%,#fff 0 1px,transparent 2px),radial-gradient(circle at 70% 60%,#fff 0 1px,transparent 2px),linear-gradient(90deg,${c[0]},${c[1]},${c[2]})`,
      gold:`linear-gradient(90deg,${c[2]},${c[1]},${c[0]},${c[1]},${c[2]})`,ice:`linear-gradient(90deg,${c[2]},${c[1]},${c[0]})`}[sk.t]||'#888';
    return `<span class="sksw sk-${sk.t}" style="background:${bg}"><i></i></span>`;},
  skinHead(sk,now){const c=sk.c||[];if(sk.t==='rainbow')return `hsl(${(now/10)%360},90%,58%)`;if(sk.t==='neon')return '#0B1020';if(sk.t==='gold')return c[1];if(sk.t==='fire')return c[1];if(sk.t==='ice')return c[1];if(sk.t==='galaxy')return c[1];if(sk.t==='robot')return c[0];return c[0];},
  snkSkin(x,pts,lw,sk,now,cell){const n=pts.length,c=sk.c||[];if(!n)return;
    const seg=(i,col,w)=>{x.strokeStyle=col;x.lineWidth=w||lw;x.beginPath();x.moveTo(pts[i-1][0],pts[i-1][1]);x.lineTo(pts[i][0],pts[i][1]);x.stroke();};
    const all=(col,w)=>{x.strokeStyle=col;x.lineWidth=w||lw;x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));if(n===1)x.lineTo(pts[0][0]+.01,pts[0][1]);x.stroke();};
    const lin=(cols)=>{const g=x.createLinearGradient(pts[0][0],pts[0][1],pts[n-1][0]+.01,pts[n-1][1]+.01);cols.forEach((cc,i)=>g.addColorStop(i/(cols.length-1||1),cc));return g;};
    const mix=(a,b,t)=>{const h=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),A=h(a),B=h(b);return `rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')})`;};
    x.lineCap='round';x.lineJoin='round';
    if(sk.t==='grad')all(lin([c[1],c[0]]));
    else if(sk.t==='stripes'){all(c[0]);for(let i=1;i<n;i++)seg(i,c[(n-1-i)%c.length]);}
    else if(sk.t==='neon'){all(c[1]+'40',lw*1.45);all(c[0]+'66',lw*1.1);all('#0B1020',lw*0.78);all(c[0],lw*0.2);}
    else if(sk.t==='fire'){for(let i=1;i<n;i++){const t=Math.min(1,Math.max(0,(n-1-i)/Math.max(6,n)+Math.sin(now/110+i*0.9)*0.08));seg(i,t<.5?mix(c[0],c[1],t*2):mix(c[1],c[2],(t-.5)*2));}if(n===1)all(c[1]);}
    else if(sk.t==='robot'){all(c[1]);x.fillStyle=c[0];pts.forEach((p,i)=>{const r=lw*0.42;x.beginPath();x.roundRect?x.roundRect(p[0]-r,p[1]-r,r*2,r*2,r*0.35):x.rect(p[0]-r,p[1]-r,r*2,r*2);x.fill();});x.fillStyle=c[1];pts.forEach(p=>{x.beginPath();x.arc(p[0],p[1],lw*0.09,0,6.3);x.fill();});}
    else if(sk.t==='dragon'){all(lin([c[1],c[0]]));x.fillStyle=c[2];for(let i=1;i<n-1;i+=1){const a=pts[i-1],b=pts[i],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
      x.beginPath();x.moveTo(mx+nx*lw*0.25-dx/L*lw*0.18,my+ny*lw*0.25-dy/L*lw*0.18);x.lineTo(mx+nx*lw*0.62,my+ny*lw*0.62);x.lineTo(mx+nx*lw*0.25+dx/L*lw*0.18,my+ny*lw*0.25+dy/L*lw*0.18);x.fill();}}
    else if(sk.t==='rainbow'){for(let i=1;i<n;i++)seg(i,`hsl(${((n-1-i)*22+now/8)%360},90%,58%)`);if(n===1)all(`hsl(${(now/8)%360},90%,58%)`);}
    else if(sk.t==='galaxy'){all(lin([c[0],c[1],c[2]]));x.fillStyle='#fff';pts.forEach((p,i)=>{const a=.4+.6*Math.abs(Math.sin(now/300+i*1.7));x.globalAlpha=a;x.beginPath();x.arc(p[0]+Math.sin(i*2.3)*lw*.2,p[1]+Math.cos(i*1.9)*lw*.2,lw*0.07,0,6.3);x.fill();});x.globalAlpha=1;}
    else if(sk.t==='gold'){for(let i=1;i<n;i++){const t=.5+.5*Math.sin(i*0.55-now/140);seg(i,t>.5?mix(c[1],c[0],(t-.5)*2):mix(c[2],c[1],t*2));}if(n===1)all(c[1]);}
    else if(sk.t==='ice'){all(lin([c[2],c[1],c[0]]));x.fillStyle='#fff';pts.forEach((p,i)=>{if((i+Math.floor(now/250))%4)return;x.beginPath();x.arc(p[0]-lw*.15,p[1]-lw*.15,lw*0.08,0,6.3);x.fill();});}
    else all(c[0]||'#2F6B4F');},

  /* ---------- menú: tarjetas nuevas ---------- */
  menuExtra(){const s=this.st(),P=this.paseSt(),on=this.paseOn(),spun=s.ruleta.last===todayKey();
    return {pase:`<button class="jg-feat ps" data-jg="pase"><span class="jg-feat-bg" aria-hidden="true"></span><span class="jg-feat-ic">❄️</span>
        <span class="jg-feat-t"><small>${on?`Termina el 15/12 · quedan ${this.paseDays()} días`:'Temporada terminada'}</small><b>Pase de temporada</b><span>Cada ${PASE.per} fragmentos ◆ subes de nivel y consigues premios <b>exclusivos</b>: mascotas, pieles, marcos, títulos y un fondo de Navidad.</span>
          <span class="jg-prog"><i style="width:${P.lv/PASE.lv.length*100}%"></i></span></span>
        <span class="jg-feat-cta"><span class="jg-feat-tok">${P.lv}<small>de ${PASE.lv.length}</small></span><span class="jg-feat-go">Ver →</span></span></button>`,
      cards:`<button class="jg-card" data-jg="tetris"><span class="jg-ic">🧱</span><b>Tetris</b><small>El de siempre. Cada línea que borras, 1 fragmento ◆; cada 10 líneas en una partida, 1 tirada (1 token).</small><em>Récord: ${s.tetris.best} puntos</em></button>
        <button class="jg-card" data-jg="flappy"><span class="jg-ic">🐤</span><b>Flappy</b><small>Vuela entre los tubos sin chocar. 1 fragmento ◆ cada 5 tubos y 1 token si pasas 30 en una partida.</small><em>Récord: ${s.flappy.best} tubos</em></button>
        <button class="jg-card" data-jg="mines"><span class="jg-ic">💣</span><b>Buscaminas</b><small>Destapa todo sin pisar ninguna mina. Si ganas: fácil 1 token, medio 2, difícil 4 (y fragmentos ◆).</small><em>Ganadas: ${s.mines.wins}</em></button>
        <button class="jg-card${spun?'':' hot'}" data-jg="ruleta"><span class="jg-ic">🎡</span><b>Ruleta diaria</b><small>Una tirada gratis al día con ${RUL.length} premios posibles: tokens, fragmentos y premios de las tiradas.</small><em>${spun?'Vuelve mañana':'¡Disponible hoy!'}</em></button>`};},

  /* ---------- ganar un premio al azar de una rareza ---------- */
  grantRandom(r){const s=this.st(),pool=GACHA.filter(x=>x.r===r),it=pool[Math.floor(Math.random()*pool.length)];const dup=!!s.owned[it.id];s.owned[it.id]=(s.owned[it.id]||0)+1;if(dup)this.addFrags(RAR[r].frag);this.save();return{it,dup};},

  /* ---------- teclado de los juegos (solo mientras se juega) ---------- */
  gameKeys(fn){const h=e=>{if(!this._gm||document.querySelector('.modal:not([hidden])'))return;if(e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(fn(e)){e.preventDefault();e.stopPropagation();}};window.addEventListener('keydown',h,true);return()=>window.removeEventListener('keydown',h,true);}
});

/* ============================== Tetris ============================== */
const TT_COL={I:'#2EC4D6',O:'#F2C94C',T:'#9B4FD6',S:'#3DB86B',Z:'#E5484D',J:'#2F6BD6',L:'#F28C28'};
const TT_SH={I:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],O:[[1,1],[1,1]],T:[[0,1,0],[1,1,1],[0,0,0]],S:[[0,1,1],[1,1,0],[0,0,0]],Z:[[1,1,0],[0,1,1],[0,0,0]],J:[[1,0,0],[1,1,1],[0,0,0]],L:[[0,0,1],[1,1,1],[0,0,0]]};
const ttRot=m=>m[0].map((_,i)=>m.map(r=>r[i]).reverse());
Object.assign(Juegos,{
  tetrisView(mv){const s=this.st();
    mv.innerHTML=this.head('Tetris',true)+`<div class="view jg"><div class="jg-in"><section class="tt-wrap">
      <div class="tt-side"><div class="tt-box"><b>Siguiente</b><canvas id="ttnext" width="120" height="240"></canvas></div><div class="tt-box"><b>Guardada <small>(C)</small></b><canvas id="tthold" width="120" height="80"></canvas></div></div>
      <div class="tt-board"><canvas id="tt" tabindex="0" aria-label="Tablero de Tetris"></canvas><div class="tt-over" id="ttover"><b>Tetris</b><small>← → mover · ↑ o X girar · Z girar al revés · ↓ bajar · Espacio soltar · C guardar · P pausa</small><button class="ebtn pri big" id="ttgo">▶ Jugar</button></div></div>
      <div class="tt-side"><div class="tt-box tt-stats"><span>Puntos<b id="ttsc">0</b></span><span>Líneas<b id="ttln">0</b></span><span>Nivel<b id="ttlv">1</b></span><span>◆ ganados<b id="ttfr">0</b></span></div>
        <div class="tt-box"><small>Cada línea: 1 fragmento ◆. Cada 10 líneas en una partida: 1 tirada (1 token). El nivel sube cada 10 líneas y va más rápido.</small><small>Récord: <b>${s.tetris.best}</b> · Líneas en total: ${s.tetris.lines}</small></div></div>
    </section></div></div>`;
    this.ttSize();this.ttDraw(null);document.getElementById('ttgo').addEventListener('click',()=>this.ttStart());},
  ttSize(){const cv=document.getElementById('tt');if(!cv)return;const d=devicePixelRatio||1,h=Math.min(640,Math.max(400,innerHeight-230)),cs=Math.floor(h/20);cv.style.width=cs*10+'px';cv.style.height=cs*20+'px';cv.width=cs*10*d;cv.height=cs*20*d;this._ttcs=cs*d;},
  ttStart(){this.stopAll();const g={b:Array.from({length:22},()=>Array(10).fill(null)),bag:[],next:[],hold:null,canHold:true,sc:0,ln:0,lv:1,fr:0,over:false,pause:false,acc:0,lock:0,lockN:0,clear:null,last:0};
    const bag=()=>{if(!g.bag.length)g.bag=shuffle(Object.keys(TT_SH));return g.bag.pop();};g.take=()=>{while(g.next.length<4)g.next.push(bag());return g.next.shift();};
    this._gm={stop:()=>{cancelAnimationFrame(g.raf);g.unkey&&g.unkey();}};this._tt=g;this.ttSpawn(g,g.take());
    document.getElementById('ttover').hidden=true;const cv=document.getElementById('tt');cv.focus();
    g.unkey=this.gameKeys(e=>{const k=e.key.toLowerCase();if(g.over)return false;
      if(k==='p'||k==='escape'){g.pause=!g.pause;return true;}if(g.pause)return ['arrowleft','arrowright','arrowup','arrowdown',' '].includes(k);
      if(k==='arrowleft'){this.ttMove(g,-1,0);return true;}if(k==='arrowright'){this.ttMove(g,1,0);return true;}
      if(k==='arrowdown'){if(this.ttMove(g,0,1)){g.sc+=1;g.acc=0;}return true;}if(k==='arrowup'||k==='x'){this.ttTurn(g,1);return true;}if(k==='z'){this.ttTurn(g,-1);return true;}
      if(k===' '){let n=0;while(this.ttMove(g,0,1,true))n++;g.sc+=n*2;this.ttLock(g);return true;}
      if(k==='c'){if(g.canHold){const t=g.p.t;if(g.hold){const h=g.hold;g.hold=t;this.ttSpawn(g,h);}else{g.hold=t;this.ttSpawn(g,g.take());}g.canHold=false;}return true;}return false;});
    const frame=t=>{if(this._tt!==g)return;if(!document.getElementById('tt')){this.stopAll();return;}g.raf=requestAnimationFrame(frame);const dt=Math.min(100,t-(g.last||t));g.last=t;
      if(!g.pause&&!g.over){if(g.clear){g.clear.t+=dt;if(g.clear.t>=220)this.ttCollapse(g);}else{const sp=Math.max(55,800*Math.pow(0.84,g.lv-1));g.acc+=dt;
        if(this.ttFits(g,g.p.m,g.p.x,g.p.y+1)){g.lock=0;while(g.acc>=sp){g.acc-=sp;if(!this.ttMove(g,0,1,true))break;}}else{g.acc=0;g.lock+=dt;if(g.lock>=480)this.ttLock(g);}}}
      this.ttDraw(g,t);};g.raf=requestAnimationFrame(frame);this.ttHud(g);},
  ttSpawn(g,t){const m=TT_SH[t].map(r=>[...r]);g.p={t,m,x:Math.floor((10-m[0].length)/2),y:t==='I'?0:1};g.lock=0;g.lockN=0;if(!this.ttFits(g,m,g.p.x,g.p.y)){g.over=true;this.ttEnd(g);}},
  ttFits(g,m,px,py){for(let y=0;y<m.length;y++)for(let x=0;x<m[y].length;x++)if(m[y][x]){const X=px+x,Y=py+y;if(X<0||X>=10||Y>=22||(Y>=0&&g.b[Y][X]))return false;}return true;},
  ttMove(g,dx,dy,quiet){if(g.clear||g.over)return false;if(this.ttFits(g,g.p.m,g.p.x+dx,g.p.y+dy)){g.p.x+=dx;g.p.y+=dy;if(!quiet&&dx&&g.lockN<15){g.lock=0;g.lockN++;}return true;}return false;},
  ttTurn(g,dir){if(g.clear||g.over||g.p.t==='O')return;let m=g.p.m;m=dir>0?ttRot(m):ttRot(ttRot(ttRot(m)));for(const [kx,ky] of [[0,0],[-1,0],[1,0],[0,-1],[-2,0],[2,0],[0,1]])if(this.ttFits(g,m,g.p.x+kx,g.p.y+ky)){g.p.m=m;g.p.x+=kx;g.p.y+=ky;if(g.lockN<15){g.lock=0;g.lockN++;}return;}},
  ttLock(g){if(g.clear||g.over)return;const {m,x:px,y:py,t}=g.p;let top=false;m.forEach((r,y)=>r.forEach((v,x)=>{if(v){if(py+y<2)top=true;g.b[py+y][px+x]=t;}}));
    const full=[];g.b.forEach((r,y)=>{if(r.every(Boolean))full.push(y);});g.canHold=true;
    if(full.length){g.clear={rows:full,t:0};}else if(top){g.over=true;this.ttEnd(g);}else this.ttSpawn(g,g.take());this.ttHud(g);},
  ttCollapse(g){const rows=g.clear.rows,n=rows.length;g.b=g.b.filter((_,y)=>!rows.includes(y));while(g.b.length<22)g.b.unshift(Array(10).fill(null));g.clear=null;
    const before=g.ln;g.ln+=n;g.sc+=[0,100,300,500,800][n]*g.lv;g.lv=1+Math.floor(g.ln/10);g.fr+=n;this.addFrags(n);const s=this.st();s.tetris.lines+=n;
    const tir=Math.floor(g.ln/10)-Math.floor(before/10);if(tir>0)this.give(tir,`${Math.floor(g.ln/10)*10} líneas en Tetris: ${tir>1?tir+' tiradas':'1 tirada'}`);this.save();this.ttHud(g);this.ttSpawn(g,g.take());},
  ttHud(g){const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};set('ttsc',g.sc);set('ttln',g.ln);set('ttlv',g.lv);set('ttfr',g.fr);},
  ttEnd(g){const s=this.st(),rec=g.sc>s.tetris.best;s.tetris.best=Math.max(s.tetris.best,g.sc);this.save();g.unkey&&g.unkey();const o=document.getElementById('ttover');
    if(o){o.hidden=false;o.innerHTML=`<b>¡Fin!</b><small>${g.sc} puntos · ${g.ln} líneas · +${g.fr} ◆${rec?' · ¡nuevo récord!':''}</small><button class="ebtn pri big" id="ttgo">▶ Otra</button>`;document.getElementById('ttgo').addEventListener('click',()=>this.ttStart());}},
  ttCell(x,px,py,cs,col,a){x.globalAlpha=a==null?1:a;x.fillStyle=col;x.fillRect(px+1,py+1,cs-2,cs-2);x.fillStyle='rgba(255,255,255,.28)';x.fillRect(px+1,py+1,cs-2,cs*0.18);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(px+1,py+cs*0.8,cs-2,cs*0.2-1);x.globalAlpha=1;},
  ttDraw(g,now){const cv=document.getElementById('tt');if(!cv)return;const x=cv.getContext('2d'),cs=this._ttcs||30,W=cv.width,H=cv.height,dk=isDarkUI();
    x.fillStyle=dk?'#0E1218':'#F4F6F9';x.fillRect(0,0,W,H);x.strokeStyle=dk?'rgba(255,255,255,.05)':'rgba(0,0,0,.06)';x.lineWidth=1;for(let i=1;i<10;i++){x.beginPath();x.moveTo(i*cs+.5,0);x.lineTo(i*cs+.5,H);x.stroke();}for(let j=1;j<20;j++){x.beginPath();x.moveTo(0,j*cs+.5);x.lineTo(W,j*cs+.5);x.stroke();}
    if(!g)return;
    for(let y=2;y<22;y++)for(let c=0;c<10;c++){const v=g.b[y][c];if(!v)continue;const fl=g.clear&&g.clear.rows.includes(y);this.ttCell(x,c*cs,(y-2)*cs,cs,fl?'#FFFFFF':TT_COL[v],fl?1-g.clear.t/220*.6:1);}
    if(!g.clear&&!g.over){let gy=g.p.y;while(this.ttFits(g,g.p.m,g.p.x,gy+1))gy++;g.p.m.forEach((r,yy)=>r.forEach((v,xx)=>{if(!v||gy+yy<2)return;x.strokeStyle=TT_COL[g.p.t];x.lineWidth=2;x.globalAlpha=.55;x.strokeRect((g.p.x+xx)*cs+2,(gy+yy-2)*cs+2,cs-4,cs-4);x.globalAlpha=1;}));
      g.p.m.forEach((r,yy)=>r.forEach((v,xx)=>{if(v&&g.p.y+yy>=2)this.ttCell(x,(g.p.x+xx)*cs,(g.p.y+yy-2)*cs,cs,TT_COL[g.p.t]);}));}
    if(g.pause){x.fillStyle='rgba(0,0,0,.45)';x.fillRect(0,0,W,H);x.fillStyle='#fff';x.font=`700 ${Math.round(cs*0.9)}px ${getComputedStyle(document.body).fontFamily}`;x.textAlign='center';x.fillText('Pausa (P)',W/2,H/2);}
    const mini=(id,list,rows)=>{const c2=document.getElementById(id);if(!c2)return;const y=c2.getContext('2d'),s2=20;y.clearRect(0,0,c2.width,c2.height);list.forEach((t,i)=>{if(!t)return;const m=TT_SH[t].filter(r=>r.some(Boolean)),w=m[0].length;m.forEach((r,yy)=>r.forEach((v,xx)=>{if(v)this.ttCell(y,(c2.width-w*s2)/2+xx*s2,10+i*rows+yy*s2,s2,TT_COL[t]);}));});};
    mini('ttnext',g.next.slice(0,3),76);mini('tthold',[g.hold],0);}
});

/* ============================== Flappy ============================== */
Object.assign(Juegos,{
  flappyView(mv){const s=this.st();
    mv.innerHTML=this.head('Flappy',true)+`<div class="view jg"><div class="jg-in"><section class="fl-wrap"><div class="fl-board"><canvas id="fl" tabindex="0" aria-label="Flappy"></canvas>
      <div class="tt-over" id="flover"><b>Flappy</b><small>Espacio, ↑ o clic para aletear. 1 fragmento ◆ cada 5 tubos y 1 token si pasas 30.${(RWBY[s.eq.pet]||{}).e?' ¡Vuela tu mascota!':''}</small><button class="ebtn pri big" id="flgo">▶ Jugar</button></div></div>
      <p class="tnote">Récord: <b>${s.flappy.best}</b> tubos · Partidas: ${s.flappy.games}</p></section></div></div>`;
    this.flSize();this.flDraw(null,0);document.getElementById('flgo').addEventListener('click',()=>this.flStart());},
  flSize(){const cv=document.getElementById('fl');if(!cv)return;const d=devicePixelRatio||1,h=Math.min(620,Math.max(420,innerHeight-220)),w=Math.round(h*0.66);cv.style.width=w+'px';cv.style.height=h+'px';cv.width=w*d;cv.height=h*d;this._flk=cv.height/600;},
  flStart(){this.stopAll();const g={y:280,vy:0,pipes:[],sc:0,fr:0,over:false,started:false,t:0,last:0,dist:0,tok:false,flap:0};this._fl=g;
    this._gm={stop:()=>{cancelAnimationFrame(g.raf);g.unkey&&g.unkey();const cv=document.getElementById('fl');if(cv&&g.click)cv.removeEventListener('pointerdown',g.click);}};
    document.getElementById('flover').hidden=true;const cv=document.getElementById('fl');cv.focus();
    const flap=()=>{if(g.over)return;g.started=true;g.vy=-7.6;g.flap=1;};g.click=e=>{e.preventDefault();flap();};cv.addEventListener('pointerdown',g.click);
    g.unkey=this.gameKeys(e=>{if(e.key===' '||e.key==='ArrowUp'||e.key.toLowerCase()==='w'){if(!e.repeat)flap();return true;}return false;});
    const frame=t=>{if(this._fl!==g)return;if(!document.getElementById('fl')){this.stopAll();return;}g.raf=requestAnimationFrame(frame);const f=Math.min(3,(t-(g.last||t))/16.67);g.last=t;g.t+=f;
      if(g.started&&!g.over){g.vy+=0.46*f;g.y+=g.vy*f;g.flap=Math.max(0,g.flap-0.08*f);const sp=2.7+Math.min(1.6,g.sc*0.03);g.dist+=sp*f;
        if(!g.pipes.length||g.pipes[g.pipes.length-1].x<400-215){const gap=Math.max(128,158-g.sc*0.8);g.pipes.push({x:420,top:70+Math.random()*(600-140-gap-80),gap,ok:false});}
        g.pipes.forEach(p=>{p.x-=sp*f;if(!p.ok&&p.x+60<90){p.ok=true;g.sc++;if(g.sc%5===0){g.fr++;this.addFrags(1);}if(g.sc>=30&&!g.tok){g.tok=true;this.give(1,'30 tubos en Flappy');}}});g.pipes=g.pipes.filter(p=>p.x>-80);
        const r=15;if(g.y+r>600-60||g.y-r<0)this.flEnd(g);g.pipes.forEach(p=>{if(90+r>p.x&&90-r<p.x+60&&(g.y-r<p.top||g.y+r>p.top+p.gap))this.flEnd(g);});}
      else if(!g.started)g.y=280+Math.sin(g.t/12)*8;
      this.flDraw(g,t);};g.raf=requestAnimationFrame(frame);},
  flEnd(g){if(g.over)return;g.over=true;const s=this.st();s.flappy.games++;const rec=g.sc>s.flappy.best;s.flappy.best=Math.max(s.flappy.best,g.sc);this.save();g.unkey&&g.unkey();
    setTimeout(()=>{const o=document.getElementById('flover');if(!o)return;o.hidden=false;o.innerHTML=`<b>¡Choque!</b><small>${g.sc} tubos · +${g.fr} ◆${g.tok?' · +1 token':''}${rec?' · ¡nuevo récord!':''}</small><button class="ebtn pri big" id="flgo">▶ Otra</button>`;document.getElementById('flgo').addEventListener('click',()=>this.flStart());},500);},
  flDraw(g,now){const cv=document.getElementById('fl');if(!cv)return;const x=cv.getContext('2d'),k=this._flk||1,W=cv.width/k,dist=g?g.dist:0;x.setTransform(k,0,0,k,0,0);
    const sky=x.createLinearGradient(0,0,0,600);sky.addColorStop(0,'#5EC8F2');sky.addColorStop(1,'#C9EEFA');x.fillStyle=sky;x.fillRect(0,0,W,600);
    x.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<5;i++){const cx=((i*170-dist*0.25)%(W+200)+W+200)%(W+200)-100,cy=70+i*37%140;x.beginPath();x.arc(cx,cy,22,0,6.3);x.arc(cx+22,cy-8,26,0,6.3);x.arc(cx+48,cy,20,0,6.3);x.fill();}
    x.fillStyle='#8FD18A';for(let i=0;i<8;i++){const hx=((i*90-dist*0.5)%(W+120)+W+120)%(W+120)-60;x.beginPath();x.arc(hx,540,60,Math.PI,0);x.fill();}
    if(g)g.pipes.forEach(p=>{const pg=(y,h,cap)=>{const gr=x.createLinearGradient(p.x,0,p.x+60,0);gr.addColorStop(0,'#3FA34D');gr.addColorStop(.45,'#7BD86F');gr.addColorStop(1,'#2E7D3A');x.fillStyle=gr;x.fillRect(p.x,y,60,h);x.fillStyle='#2E7D3A';x.fillRect(p.x-5,cap,70,22);x.fillStyle='rgba(255,255,255,.25)';x.fillRect(p.x-2,cap+3,8,16);};
      pg(0,p.top-22,p.top-22);pg(p.top+p.gap+22,600-60-(p.top+p.gap+22),p.top+p.gap);});
    x.fillStyle='#DEC27A';x.fillRect(0,540,W,60);x.fillStyle='#7BC043';x.fillRect(0,540,W,12);x.fillStyle='rgba(0,0,0,.08)';for(let i=0;i<W/24+2;i++){const sx=i*24-(dist%24);x.fillRect(sx,552,12,48);}
    const by=g?g.y:280,ang=g?Math.max(-0.5,Math.min(1.2,g.vy*0.07)):0,pet=(RWBY[this.st().eq.pet]||{}).e;x.save();x.translate(90,by);x.rotate(ang);
    if(pet){x.font='34px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';x.textAlign='center';x.textBaseline='middle';x.scale(-1,1);x.fillText(pet,0,2);}
    else{x.fillStyle='#FFD23F';x.beginPath();x.ellipse(0,0,18,15,0,0,6.3);x.fill();x.strokeStyle='#C99A1E';x.lineWidth=2;x.stroke();x.fillStyle='#FFF';x.beginPath();x.arc(7,-5,6,0,6.3);x.fill();x.fillStyle='#222';x.beginPath();x.arc(9,-5,2.6,0,6.3);x.fill();
      x.fillStyle='#F28C28';x.beginPath();x.moveTo(13,1);x.lineTo(25,4);x.lineTo(13,8);x.fill();x.fillStyle='#FFE88A';x.beginPath();x.ellipse(-6,3+(g&&g.flap>0?-6*g.flap:Math.sin((now||0)/90)*3),9,5,-0.3,0,6.3);x.fill();}
    x.restore();
    if(g&&g.started){x.fillStyle='#fff';x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=5;x.font='800 46px system-ui,sans-serif';x.textAlign='center';x.strokeText(g.sc,W/2,80);x.fillText(g.sc,W/2,80);}
    x.setTransform(1,0,0,1,0,0);}
});

/* ============================== Buscaminas ============================== */
const MN_DIFF={f:['Fácil',9,9,10,1,3],m:['Medio',16,16,40,2,6],d:['Difícil',16,30,99,4,12]}; // nombre, filas, columnas, minas, tokens, fragmentos
Object.assign(Juegos,{
  minesView(mv){const s=this.st(),D=MN_DIFF[s.mines.diff]?s.mines.diff:'f';s.mines.diff=D;const [nm,R,C,M,tk,fr]=MN_DIFF[D];
    mv.innerHTML=this.head('Buscaminas',true)+`<div class="view jg"><div class="jg-in"><section class="mn-wrap">
      <div class="mn-top"><div class="seg">${Object.entries(MN_DIFF).map(([k,v])=>`<button class="segb" data-mn-d="${k}" aria-pressed="${D===k}">${v[0]} <small>${v[1]}×${v[2]}</small></button>`).join('')}</div>
        <span class="mn-hud"><span>💣 <b id="mnleft">${M}</b></span><span>⏱ <b id="mntime">0</b></span></span><button class="ebtn" id="mnnew">🙂 Nueva</button></div>
      <div class="mn-grid" id="mngrid" style="--c:${C}" oncontextmenu="return false"></div>
      <p class="tnote">Clic para destapar, clic derecho para poner bandera. Clic en un número con sus banderas puestas destapa lo de alrededor. Si ganas: ${tk} token${tk>1?'s':''} y ${fr} ◆. Ganadas: ${s.mines.wins}.</p></section></div></div>`;
    mv.querySelectorAll('[data-mn-d]').forEach(b=>b.addEventListener('click',()=>{s.mines.diff=b.dataset.mnD;this.save();this.stopAll();this.minesView(mv);}));
    document.getElementById('mnnew').addEventListener('click',()=>{this.stopAll();this.minesView(mv);});this.mnNew(R,C,M,D);},
  mnNew(R,C,M,D){const g={R,C,M,D,cells:Array.from({length:R*C},()=>({m:false,o:false,f:false,n:0})),started:false,over:false,t0:0,iv:0,open:0};this._mn=g;
    this._gm={stop:()=>clearInterval(g.iv)};const grid=document.getElementById('mngrid');
    grid.innerHTML=g.cells.map((_,i)=>`<button class="mn-c" data-i="${i}" aria-label="Casilla"></button>`).join('');
    grid.addEventListener('mousedown',e=>{const b=e.target.closest('.mn-c');if(!b||g.over)return;const i=+b.dataset.i;if(e.button===2){this.mnFlag(g,i);}else if(e.button===0){g.cells[i].o?this.mnChord(g,i):this.mnOpen(g,i);}this.mnPaint(g);});
    grid.addEventListener('keydown',e=>{const b=e.target.closest('.mn-c');if(!b||g.over)return;const i=+b.dataset.i;if(e.key==='f'||e.key==='F'){this.mnFlag(g,i);this.mnPaint(g);}else if(e.key==='Enter'||e.key===' '){e.preventDefault();g.cells[i].o?this.mnChord(g,i):this.mnOpen(g,i);this.mnPaint(g);}});},
  mnNb(g,i){const r=Math.floor(i/g.C),c=i%g.C,o=[];for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){if(!dr&&!dc)continue;const rr=r+dr,cc=c+dc;if(rr>=0&&rr<g.R&&cc>=0&&cc<g.C)o.push(rr*g.C+cc);}return o;},
  mnSeed(g,safe){const ban=new Set([safe,...this.mnNb(g,safe)]),free=g.cells.map((_,i)=>i).filter(i=>!ban.has(i));shuffle(free).slice(0,g.M).forEach(i=>g.cells[i].m=true);
    g.cells.forEach((c,i)=>{c.n=this.mnNb(g,i).filter(j=>g.cells[j].m).length;});g.started=true;g.t0=Date.now();g.iv=setInterval(()=>{const e=document.getElementById('mntime');if(!e){clearInterval(g.iv);return;}e.textContent=Math.floor((Date.now()-g.t0)/1000);},500);},
  mnOpen(g,i){const c=g.cells[i];if(c.f||c.o)return;if(!g.started)this.mnSeed(g,i);if(c.m){c.o=true;this.mnEnd(g,false,i);return;}
    const st=[i];while(st.length){const j=st.pop(),d=g.cells[j];if(d.o||d.f)continue;d.o=true;g.open++;if(!d.n)this.mnNb(g,j).forEach(k=>{if(!g.cells[k].o&&!g.cells[k].m)st.push(k);});}
    if(g.open===g.R*g.C-g.M)this.mnEnd(g,true);},
  mnChord(g,i){const c=g.cells[i];if(!c.n)return;const nb=this.mnNb(g,i);if(nb.filter(j=>g.cells[j].f).length!==c.n)return;nb.forEach(j=>{if(!g.over)this.mnOpen(g,j);});},
  mnFlag(g,i){const c=g.cells[i];if(c.o)return;c.f=!c.f;const e=document.getElementById('mnleft');if(e)e.textContent=g.M-g.cells.filter(x=>x.f).length;},
  mnEnd(g,win,boom){g.over=true;clearInterval(g.iv);const s=this.st(),[nm,,,,tk,fr]=MN_DIFF[g.D],secs=Math.floor((Date.now()-g.t0)/1000);
    if(win){s.mines.wins++;this.save();this.give(tk,`Buscaminas ${nm.toLowerCase()} en ${secs} s`);this.addFrags(fr);this.celebrate(g.D==='d');}
    g.boom=boom;this.mnPaint(g);const b=document.getElementById('mnnew');if(b)b.textContent=win?'😎 Otra':'😵 Otra';},
  mnPaint(g){const grid=document.getElementById('mngrid');if(!grid)return;const B=grid.children;g.cells.forEach((c,i)=>{const b=B[i];let cls='mn-c',t='';
    if(c.o){cls+=' o';if(c.m){cls+=' boom';t='💥';}else if(c.n){t=c.n;cls+=' n'+c.n;}}else if(g.over&&c.m){cls+=' mine';t=c.f?'🚩':'💣';}else if(c.f){cls+=' f';t='🚩';if(g.over&&!c.m)t='❌';}
    if(b.className!==cls)b.className=cls;if(b.textContent!==String(t))b.textContent=t;});}
});

/* ============================== Ruleta diaria ============================== */
// [texto, peso, premio]
const RUL=[['1 token',20,{tok:1}],['5 ◆',16,{fr:5}],['2 tokens',14,{tok:2}],['10 ◆',10,{fr:10}],['3 tokens',9,{tok:3}],['Premio raro',8,{it:'r'}],['25 ◆',5,{fr:25}],['5 tokens',5,{tok:5}],
  ['Premio épico',4,{it:'e'}],['50 ◆',1.5,{fr:50}],['10 tokens',1.5,{tok:10}],['Premio legendario',1,{it:'l'}]];
const RUL_COL=['#2F86D6','#6C4CF0','#3DB86B','#9B4FD6','#F28C28','#2EC4D6','#C2329E','#E5484D','#9B4FD6','#14606E','#E0A21A','#FF3D7F'];
Object.assign(Juegos,{
  ruletaView(mv){const s=this.st(),spun=s.ruleta.last===todayKey();
    mv.innerHTML=this.head('Ruleta diaria',true)+`<div class="view jg"><div class="jg-in"><section class="ru-wrap"><div class="ru-wheel"><span class="ru-pin" aria-hidden="true"></span><canvas id="ru" width="460" height="460" aria-label="Ruleta"></canvas><button class="ru-go" id="rugo" ${spun?'disabled':''}>${spun?'Mañana':'¡Girar!'}</button></div>
      <div class="ru-side"><h3>Premios posibles</h3><ul class="ru-list">${RUL.map(([t,w],i)=>`<li><i style="background:${RUL_COL[i]}"></i><span>${t}</span><small>${(w/RUL.reduce((a,b)=>a+b[1],0)*100).toFixed(1)} %</small></li>`).join('')}</ul>
      <p class="tnote" id="rumsg">${spun?`Ya has girado hoy. Vuelve mañana (${this.ruLeft()}).`:'Una tirada gratis al día. Los premios de las tiradas, si ya los tienes, se convierten en fragmentos ◆.'}</p><small class="tnote">Giros en total: ${s.ruleta.spins}</small></div></section></div></div>`;
    this._ruA=this._ruA||0;this.ruDraw(this._ruA);document.getElementById('rugo').addEventListener('click',()=>this.ruSpin());},
  ruLeft(){const n=new Date(),m=new Date(n.getFullYear(),n.getMonth(),n.getDate()+1),h=Math.floor((m-n)/3600000),mi=Math.floor((m-n)/60000)%60;return `${h} h ${mi} min`;},
  ruDraw(a){const cv=document.getElementById('ru');if(!cv)return;const x=cv.getContext('2d'),W=cv.width,c=W/2,r=c-10,n=RUL.length,sl=Math.PI*2/n;x.clearRect(0,0,W,W);
    x.save();x.translate(c,c);x.rotate(a);for(let i=0;i<n;i++){x.beginPath();x.moveTo(0,0);x.arc(0,0,r,i*sl-Math.PI/2,(i+1)*sl-Math.PI/2);x.closePath();x.fillStyle=RUL_COL[i];x.fill();x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=2;x.stroke();
      x.save();x.rotate(i*sl+sl/2-Math.PI/2);x.fillStyle='#fff';x.font='700 15px system-ui,sans-serif';x.textAlign='right';x.textBaseline='middle';x.shadowColor='rgba(0,0,0,.35)';x.shadowBlur=3;x.fillText(RUL[i][0],r-14,0);x.restore();}
    x.restore();x.beginPath();x.arc(c,c,r,0,6.3);x.strokeStyle='#1B1B1B';x.lineWidth=6;x.stroke();for(let i=0;i<n;i++){const an=i*sl-Math.PI/2+a;x.fillStyle='#FFE14A';x.beginPath();x.arc(c+Math.cos(an)*(r-1),c+Math.sin(an)*(r-1),4,0,6.3);x.fill();}},
  ruSpin(){const s=this.st();if(s.ruleta.last===todayKey()||this._ruSpin)return;const tot=RUL.reduce((a,b)=>a+b[1],0);let v=Math.random()*tot,win=0;for(let i=0;i<RUL.length;i++){v-=RUL[i][1];if(v<0){win=i;break;}}
    s.ruleta.last=todayKey();s.ruleta.spins++;this.save();const b=document.getElementById('rugo');b.disabled=true;b.textContent='…';this._ruSpin=true;
    const n=RUL.length,sl=Math.PI*2/n,from=this._ruA%(Math.PI*2),target=-(win*sl+sl/2)+(Math.random()-.5)*sl*0.6,to=from+Math.PI*2*6+(((target-from)%(Math.PI*2))+Math.PI*2)%(Math.PI*2),T=4600,t0=performance.now();
    const step=t=>{const k=Math.min(1,(t-t0)/T),e=1-Math.pow(1-k,4);this._ruA=from+(to-from)*e;this.ruDraw(this._ruA);if(k<1&&document.getElementById('ru'))requestAnimationFrame(step);else{this._ruSpin=false;this.ruPrize(win);}};requestAnimationFrame(step);},
  ruPrize(i){const [t,,P]=RUL[i];let msg;if(P.tok){this.give(P.tok,'Ruleta diaria');msg=`¡${t}!`;}else if(P.fr){this.addFrags(P.fr);msg=`¡${t}!`;toast(`Ruleta diaria: +${P.fr} ◆`);}
    else{const o=this.grantRandom(P.it);msg=`¡${RAR[P.it].n}: ${o.it.n}!${o.dup?` (repetido: +${RAR[P.it].frag} ◆)`:''}`;toast('Ruleta diaria: '+msg);if(P.it!=='r')this.celebrate(P.it==='l');}
    const m=document.getElementById('rumsg');if(m)m.innerHTML=`<b>${esc(msg)}</b> Vuelve mañana (${this.ruLeft()}).`;const b=document.getElementById('rugo');if(b)b.textContent='Mañana';}
});

/* ============================== Mascota (abajo a la derecha) ============================== */
const Pet={el:null,id:null,
  set(x){const id=x?x.id:null;if(id===this.id&&(!id||this.el))return;this.id=id;if(this.el){this.el.remove();this.el=null;}document.documentElement.classList.toggle('has-pet',!!x);if(!x)return;
    const el=document.createElement('button');el.id='mbpet';el.type='button';el.className='pet r-'+x.r;el.title=x.n.replace(/^Mascota /,'')+' · haz clic para acariciar';el.setAttribute('aria-label','Mascota: '+x.n);
    el.innerHTML=`<span class="pet-aura" aria-hidden="true"></span><span class="pet-e">${x.e}</span><span class="pet-sh" aria-hidden="true"></span>`;document.body.appendChild(el);this.el=el;
    el.addEventListener('click',()=>{if(el.classList.contains('pet-spin'))return;el.classList.add('pet-spin');const n=x.r==='m'?7:x.r==='l'?5:3;
      for(let i=0;i<n;i++){const h=document.createElement('span');h.className='pet-heart';h.textContent=x.r==='m'?['💖','✨','🌈','💫'][i%4]:x.r==='l'?['💛','✨'][i%2]:'❤️';h.style.setProperty('--dx',(Math.random()*60-30)+'px');h.style.animationDelay=(i*90)+'ms';el.appendChild(h);setTimeout(()=>h.remove(),1500+i*90);}
      setTimeout(()=>el.classList.remove('pet-spin'),900);});}
};
