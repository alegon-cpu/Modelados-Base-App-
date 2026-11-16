/* ===================== 2.x: más juegos =====================
   Memory (normal y de BDD), Corredor (dino), Asteroides, Cruza la calle (frogger), Tiro al plato, Cueva (helicóptero) y Solitario.
   Todo con dibujos propios. El récord de cada uno va en el estado de los juegos (se sincroniza como lo demás). */
const G4_KEYS=['memory','dino','ast','frog','skeet','heli','sol'];
const MEM_EMO=['🍎','🍋','🍇','🍒','🥝','🍑','🍍','🥥','🌵','🌻','🍄','🐙','🦊','🐢','🐝','🦋','🚀','🎈','🎲','🎧','⚽','🎸','💎','🔑'];
const MEM_BDD=[['PK','Identifica cada fila sin repetirse'],['FK','Apunta a la clave de otra tabla'],['UNIQUE','No se puede repetir, pero no es la clave'],['NOT NULL','No puede quedar vacío'],
  ['1:N','Uno con muchos: la FK va en el lado N'],['N:M','Necesita una tabla intermedia'],['Entidad débil','Depende de otra para identificarse'],['Atributo multivaluado','Puede tener varios valores'],
  ['Atributo derivado','Se calcula a partir de otros'],['1FN','Valores atómicos, sin grupos repetidos'],['2FN','Sin dependencias de parte de la clave'],['3FN','Sin dependencias transitivas'],
  ['SELECT','Elige las columnas que quieres ver'],['WHERE','Filtra filas'],['GROUP BY','Agrupa filas para contar o sumar'],['HAVING','Filtra grupos'],['JOIN','Junta filas de dos tablas'],['ORDER BY','Ordena el resultado'],
  ['DED','Diagrama de estructura de datos'],['Cardinalidad','Cuántos de uno con cuántos del otro'],['Jerarquía','Supertipo con subtipos'],['DELETE CASCADE','Al borrar el padre, borra los hijos'],['Dominio','Valores que puede tomar un atributo'],['Tupla','Otra forma de llamar a una fila']];
Object.assign(Juegos,{
  g4(){const s=this.st();s.g4=s.g4||{};G4_KEYS.forEach(k=>{s.g4[k]=s.g4[k]||{best:0,games:0,wins:0};});return s.g4;},
  // Lienzo con tamaño lógico fijo que se escala a la pantalla
  g4Board(mv,o){const S=this.g4()[o.key];
    mv.innerHTML=this.head(o.title,true)+`<div class="view jg"><div class="jg-in"><section class="g4-wrap"><div class="g4-board"><canvas id="g4cv" tabindex="0" aria-label="${escA(o.title)}"></canvas>
      <div class="tt-over" id="g4over"><b>${esc(o.title)}</b><small>${o.help}</small><button class="ebtn pri big" id="g4go">▶ Jugar</button></div></div>
      <p class="tnote" id="g4note">${o.note(S)}</p></section></div></div>`;
    const cv=document.getElementById('g4cv'),fit=()=>{const d=devicePixelRatio||1,maxW=Math.min(mv.clientWidth-60,1000),maxH=Math.max(320,innerHeight-230),k=Math.min(maxW/o.w,maxH/o.h);cv.style.width=Math.round(o.w*k)+'px';cv.style.height=Math.round(o.h*k)+'px';cv.width=Math.round(o.w*k*d);cv.height=Math.round(o.h*k*d);cv._k=k*d;};
    fit();return{cv,fit};},
  g4Over(title,sub,btn){const ov=document.getElementById('g4over');if(!ov)return;ov.hidden=false;ov.innerHTML=`<b>${title}</b><small>${sub}</small><button class="ebtn pri big" id="g4go">${btn||'▶ Otra vez'}</button>`;},
  // Bucle genérico: g.upd(dt), g.draw(ctx). Teclas con gameKeys. Devuelve el objeto del juego.
  g4Run(o,g){this.stopAll();const cv=document.getElementById('g4cv'),x=cv.getContext('2d');g.keys={};g.t=0;
    const ov=document.getElementById('g4over');if(ov)ov.hidden=true;cv.focus();
    g.unkey=this.gameKeys(e=>{const k=e.key.toLowerCase();if(e.type==='keyup')return false;if(g.over){if(k===' '||k==='enter'){o.restart();return true;}return false;}if(k==='p'||k==='escape'){g.pause=!g.pause;return true;}return g.key?g.key(k,true):false;});
    g.ku=e=>{const k=e.key.toLowerCase();g.keys[k]=0;if(g.key)g.key(k,false);};g.kd=e=>{g.keys[e.key.toLowerCase()]=1;};window.addEventListener('keyup',g.ku,true);window.addEventListener('keydown',g.kd,true);
    if(g.pd){g.pdh=e=>{const r=cv.getBoundingClientRect();g.pd(e.type,(e.clientX-r.left)/r.width*o.w,(e.clientY-r.top)/r.height*o.h,e);};['pointerdown','pointerup','pointermove'].forEach(t=>cv.addEventListener(t,g.pdh));}
    const loop=t=>{if(this._g4!==g)return;if(!document.getElementById('g4cv')){this.stopAll();return;}const dt=Math.min(.05,g.last?(t-g.last)/1000:0);g.last=t;if(!g.pause&&!g.over){g.t+=dt;g.upd(dt);}
      x.setTransform(cv._k,0,0,cv._k,0,0);g.draw(x,o.w,o.h);if(g.pause){x.fillStyle='rgba(0,0,0,.45)';x.fillRect(0,0,o.w,o.h);x.fillStyle='#fff';x.font='800 28px system-ui';x.textAlign='center';x.fillText('Pausa',o.w/2,o.h/2);x.font='14px system-ui';x.fillText('P o Esc para seguir',o.w/2,o.h/2+26);x.textAlign='left';}
      g.raf=requestAnimationFrame(loop);};
    this._g4=g;this._gm={stop:()=>{cancelAnimationFrame(g.raf);g.unkey&&g.unkey();window.removeEventListener('keyup',g.ku,true);window.removeEventListener('keydown',g.kd,true);if(g.pdh)['pointerdown','pointerup','pointermove'].forEach(t=>cv.removeEventListener(t,g.pdh));this._g4=null;}};
    g.raf=requestAnimationFrame(loop);return g;},
  g4End(key,score,o){const S=this.g4()[key];S.games++;const rec=score>S.best;if(rec)S.best=score;if(o.win)S.wins++;this.save();
    if(o.xp)this.addXp(o.xp,true);if(o.frags>0)this.addFrags(o.frags);if(o.token)this.give(1,o.token);
    const n=document.getElementById('g4note');if(n&&o.note)n.innerHTML=o.note(S);return rec;},
  g4Txt(x,t,X,Y,size,col,al){x.font=`800 ${size}px system-ui`;x.textAlign=al||'left';x.lineWidth=4;x.strokeStyle='rgba(0,0,0,.45)';x.strokeText(t,X,Y);x.fillStyle=col||'#fff';x.fillText(t,X,Y);x.textAlign='left';},
  rr4(x,X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath();},

  /* =================== MEMORY =================== */
  memoryView(mv){const S=this.g4().memory,m=this._memMode||'f';
    const B=(k,t)=>`<button class="segb" data-memm="${k}" aria-pressed="${m===k}">${t}</button>`;
    mv.innerHTML=this.head('Memory',true)+`<div class="view jg"><div class="jg-in"><section class="mem-wrap"><div class="mem-top"><div class="seg">${B('f','Fácil 4×4')}${B('d','Difícil 6×6')}${B('b','BDD: concepto y definición')}</div>
      <div class="mem-hud"><span>⏱ <b id="memt">0:00</b></span><span>Intentos <b id="memn">0</b></span><span>Parejas <b id="memp">0</b></span></div><button class="ebtn" id="memgo">↻ Nueva</button></div>
      <div class="mem-grid ${m}" id="memg"></div><p class="tnote">${m==='b'?'Une cada concepto con su definición. Si lo haces con 4 fallos o menos: 1 token y 5 fragmentos ◆.':'Encuentra todas las parejas. Al terminar: '+(m==='d'?'6 fragmentos ◆ (y 1 token si lo haces en menos de 40 intentos)':'3 fragmentos ◆')+'.'} Partidas ganadas: ${S.wins}.</p></section></div></div>`;
    mv.querySelectorAll('[data-memm]').forEach(b=>b.addEventListener('click',()=>{this._memMode=b.dataset.memm;this.memoryView(mv);}));
    document.getElementById('memgo').addEventListener('click',()=>this.memoryView(mv));this.memStart();},
  memStart(){this.stopAll();const m=this._memMode||'f';let cards;
    if(m==='b'){const pairs=shuffle([...MEM_BDD]).slice(0,6);cards=[];pairs.forEach((p,i)=>{cards.push({id:i,t:p[0],k:'c'});cards.push({id:i,t:p[1],k:'d'});});}
    else{const n=m==='d'?18:8;cards=[];shuffle([...MEM_EMO]).slice(0,n).forEach((e,i)=>{cards.push({id:i,t:e});cards.push({id:i,t:e});});}
    cards=shuffle(cards);const G={m,cards,open:[],done:new Set(),n:0,t0:0,lock:false,iv:null,bad:0};this._mem=G;
    const g=document.getElementById('memg');g.innerHTML=cards.map((c,i)=>`<button class="mem-c${c.k?' '+c.k:''}" data-mi="${i}" aria-label="Carta ${i+1}"><span class="mem-in"><span class="mem-back"></span><span class="mem-front">${esc(c.t)}</span></span></button>`).join('');
    g.querySelectorAll('[data-mi]').forEach(b=>b.addEventListener('click',()=>this.memFlip(+b.dataset.mi,b)));
    this._gm={stop:()=>{clearInterval(G.iv);}};},
  memFlip(i,b){const G=this._mem;if(!G||G.lock||G.done.has(i)||G.open.includes(i))return;if(!G.t0){G.t0=Date.now();G.iv=setInterval(()=>{const el=document.getElementById('memt');if(!el){clearInterval(G.iv);return;}const s=Math.floor((Date.now()-G.t0)/1000);el.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');},500);}
    b.classList.add('up');G.open.push(i);if(G.open.length<2)return;G.n++;document.getElementById('memn').textContent=G.n;
    const [a,c]=G.open,A=G.cards[a],C=G.cards[c],ok=A.id===C.id&&(G.m!=='b'||A.k!==C.k);
    if(ok){G.done.add(a);G.done.add(c);G.open=[];setTimeout(()=>{document.querySelectorAll(`[data-mi="${a}"],[data-mi="${c}"]`).forEach(e=>e.classList.add('ok'));},250);document.getElementById('memp').textContent=G.done.size/2;
      if(G.done.size===G.cards.length)setTimeout(()=>this.memWin(),500);}
    else{G.bad++;G.lock=true;setTimeout(()=>{document.querySelectorAll(`[data-mi="${a}"],[data-mi="${c}"]`).forEach(e=>{e.classList.remove('up');e.classList.add('no');setTimeout(()=>e.classList.remove('no'),300);});G.open=[];G.lock=false;},800);}},
  memWin(){const G=this._mem;clearInterval(G.iv);const secs=Math.floor((Date.now()-G.t0)/1000);let fr=G.m==='d'?6:G.m==='b'?5:3,tok=null;
    if(G.m==='b'&&G.bad<=4)tok='Memory de BDD casi sin fallos';if(G.m==='d'&&G.n<40)tok='Memory difícil en menos de 40 intentos';if(G.m==='b'&&!tok)fr=2;
    this.g4End('memory',0,{win:1,xp:G.m==='d'?30:20,frags:fr,token:tok});this.celebrate(!!tok);
    const g=document.getElementById('memg');if(g)g.insertAdjacentHTML('beforeend',`<div class="mem-win"><b>¡Completado!</b><span>${G.n} intentos · ${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')} · +${fr} ◆${tok?' · +1 token':''}</span><button class="ebtn pri" onclick="Juegos.memoryView(document.getElementById('mainv'))">Otra vez</button></div>`);},

  /* =================== CORREDOR (dino) =================== */
  dinoView(mv){const o={key:'dino',title:'Corredor',w:800,h:260,help:'Espacio, ↑ o clic para saltar; ↓ para agacharte. 1 fragmento ◆ cada 200 puntos y 1 token si llegas a 1.500.',note:S=>`Récord: <b>${S.best}</b> · Partidas: ${S.games}`};
    this.g4Board(mv,o);o.restart=()=>this.dinoStart(o);document.getElementById('g4go').addEventListener('click',o.restart);this.dinoDraw(this.ctx4(),null,o.w,o.h);},
  ctx4(){const cv=document.getElementById('g4cv'),x=cv.getContext('2d');x.setTransform(cv._k,0,0,cv._k,0,0);return x;},
  dinoStart(o){const G0=270,g={o,y:G0,vy:0,G0,duck:false,sp:340,dist:0,obs:[],next:1.2,clouds:[...Array(5)].map((_,i)=>({x:i*180+Math.random()*80,y:30+Math.random()*60})),frT:0,fr:0,tok:false,pt:[]};
    g.y=200;g.G0=200;
    const jump=()=>{if(g.y>=g.G0-1&&!g.duck){g.vy=-720;for(let i=0;i<6;i++)g.pt.push({x:80,y:g.G0+20,vx:-60-Math.random()*80,vy:-Math.random()*60,l:.4});}};
    g.key=(k,down)=>{if(!down){if(k==='arrowdown'||k==='s')g.duck=false;return false;}if(k===' '||k==='arrowup'||k==='w'){jump();return true;}if(k==='arrowdown'||k==='s'){g.duck=true;if(g.y<g.G0)g.vy=Math.max(g.vy,700);return true;}return false;};
    g.pd=(t)=>{if(t==='pointerdown'){if(g.over)o.restart();else jump();}};
    g.upd=dt=>{g.sp=Math.min(900,340+g.dist*.05);g.dist+=g.sp*dt;g.vy+=2200*dt*(g.keys[' ']||g.keys.arrowup?.7:1);g.y=Math.min(g.G0,g.y+g.vy*dt);if(g.y>=g.G0)g.vy=0;
      g.next-=dt;if(g.next<=0){const sc=g.dist/10;const bat=sc>300&&Math.random()<.3;if(bat)g.obs.push({x:820,k:'bat',w:40,h:26,y:g.G0-[18,52,80][Math.floor(Math.random()*3)]});else{const n=1+Math.floor(Math.random()*(sc>500?3:2));g.obs.push({x:820,k:'cry',w:18*n+6,h:30+Math.random()*22,y:g.G0+40,n});}
        g.next=Math.max(.55,(1.1+Math.random()*.9)-g.sp/1600);}
      g.obs.forEach(b=>b.x-=g.sp*dt);g.obs=g.obs.filter(b=>b.x>-80);g.clouds.forEach(c=>{c.x-=g.sp*.15*dt;if(c.x<-80){c.x=820;c.y=30+Math.random()*60;}});
      g.pt.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt;p.l-=dt;});g.pt=g.pt.filter(p=>p.l>0);if(g.y>=g.G0&&Math.random()<.25)g.pt.push({x:70,y:g.G0+38,vx:-g.sp*.3,vy:-30,l:.3});
      const ph=g.duck&&g.y>=g.G0?24:40,px=62,py=g.G0+40-ph;
      for(const b of g.obs){const by=b.k==='bat'?b.y:b.y-b.h;if(px+8<b.x+b.w-4&&px+34>b.x+4&&py+4<by+b.h&&py+ph>by+4){this.dinoEnd(g);return;}}
      const sc=Math.floor(g.dist/10);if(Math.floor(sc/200)>g.fr){g.fr=Math.floor(sc/200);g.flash=.6;}if(sc>=1500&&!g.tok){g.tok=true;this.give(1,'1.500 en el Corredor');}};
    g.draw=(x,W,H)=>this.dinoDraw(x,g,W,H);this.g4Run(o,g);},
  dinoEnd(g){g.over=true;const sc=Math.floor(g.dist/10);const rec=this.g4End('dino',sc,{xp:Math.min(60,Math.round(sc/40)),frags:g.fr,note:g.o.note});this.g4Over(rec?'¡Nuevo récord!':'¡Te has chocado!',`${sc} puntos · +${g.fr} ◆${g.tok?' · +1 token':''} · Espacio para repetir`);document.getElementById('g4go').addEventListener('click',g.o.restart);},
  dinoDraw(x,g,W,H){const sc=g?Math.floor(g.dist/10):0,night=Math.floor(sc/700)%2===1;const sky=x.createLinearGradient(0,0,0,H);sky.addColorStop(0,night?'#1B1F3A':'#BFE6FF');sky.addColorStop(1,night?'#3A3360':'#FFF3D6');x.fillStyle=sky;x.fillRect(0,0,W,H);
    if(night){x.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<30;i++)x.fillRect((i*137)%W,(i*53)%120,2,2);x.fillStyle='#F2EEDA';x.beginPath();x.arc(680,50,18,0,7);x.fill();}else{x.fillStyle='#FFD86B';x.beginPath();x.arc(690,48,22,0,7);x.fill();}
    (g?g.clouds:[{x:100,y:50},{x:400,y:70}]).forEach(c=>{x.fillStyle=night?'rgba(255,255,255,.15)':'rgba(255,255,255,.9)';x.beginPath();x.arc(c.x,c.y,14,0,7);x.arc(c.x+16,c.y-6,17,0,7);x.arc(c.x+34,c.y,13,0,7);x.fill();});
    const G0=200,off=g?(g.dist*.5)%40:0;x.fillStyle=night?'#4A3F6B':'#E8C98A';x.fillRect(0,G0+40,W,H-G0-40);x.fillStyle=night?'#5E5285':'#C9A86A';x.fillRect(0,G0+40,W,3);for(let i=0;i<22;i++){x.fillRect(i*40-off,G0+52+(i%3)*8,10,2);}
    if(g)g.obs.forEach(b=>{if(b.k==='bat'){const f=Math.sin(g.t*18)>0;x.fillStyle='#5A3A7A';x.beginPath();x.ellipse(b.x+20,b.y+13,9,8,0,0,7);x.fill();x.beginPath();x.moveTo(b.x+20,b.y+12);x.lineTo(b.x,b.y+(f?0:22));x.lineTo(b.x+12,b.y+14);x.moveTo(b.x+20,b.y+12);x.lineTo(b.x+40,b.y+(f?0:22));x.lineTo(b.x+28,b.y+14);x.fill();x.fillStyle='#FFE14D';x.fillRect(b.x+16,b.y+10,3,3);x.fillRect(b.x+22,b.y+10,3,3);}
      else{for(let i=0;i<b.n;i++){const cx=b.x+3+i*18,h=b.h-(i%2)*8;x.fillStyle=night?'#8BE6FF':'#4FB59A';x.beginPath();x.moveTo(cx,G0+40);x.lineTo(cx+8,G0+40-h);x.lineTo(cx+16,G0+40);x.closePath();x.fill();x.fillStyle='rgba(255,255,255,.4)';x.beginPath();x.moveTo(cx+8,G0+40-h);x.lineTo(cx+11,G0+40);x.lineTo(cx+8,G0+40);x.fill();}}});
    if(g)g.pt.forEach(p=>{x.fillStyle=`rgba(200,170,110,${p.l*2})`;x.fillRect(p.x,p.y,3,3);});
    // corredor: robot redondo propio
    const y=g?g.y:G0,duck=g&&g.duck&&g.y>=G0,leg=g&&g.y>=G0?Math.sin(g.t*22):0;x.save();x.translate(62,y);
    if(duck){x.fillStyle='#F06BC8';this.rr4(x,0,22,46,18,9);x.fill();x.fillStyle='#1A1422';this.rr4(x,26,26,16,8,4);x.fill();x.fillStyle='#8BF0FF';x.fillRect(34,28,5,3);}
    else{x.fillStyle='#5A4A7A';x.fillRect(10,30+Math.max(0,leg)*4,6,10);x.fillRect(24,30+Math.max(0,-leg)*4,6,10);x.fillStyle='#F06BC8';this.rr4(x,2,0,36,34,12);x.fill();x.fillStyle='#1A1422';this.rr4(x,14,8,22,12,5);x.fill();x.fillStyle='#8BF0FF';x.fillRect(26+(g&&g.vy<0?1:0),11,6,5);
      x.strokeStyle='#5A4A7A';x.lineWidth=2;x.beginPath();x.moveTo(14,0);x.lineTo(10,-8);x.stroke();x.fillStyle='#FFE14D';x.beginPath();x.arc(10,-9,3,0,7);x.fill();x.fillStyle='rgba(255,255,255,.35)';x.fillRect(6,4,5,10);}
    x.restore();
    this.g4Txt(x,String(sc).padStart(5,'0'),W-16,28,18,night?'#fff':'#3A2A4A','right');if(g&&g.S)0;const S=this.g4().dino;this.g4Txt(x,'Récord '+String(S.best).padStart(5,'0'),W-110,28,13,night?'#ccc':'#7A6A8A','right');
    if(g&&g.flash>0){g.flash-=.016;x.globalAlpha=g.flash;this.g4Txt(x,'+1 ◆',W/2,60,22,'#B57BFF','center');x.globalAlpha=1;}},

  /* =================== ASTEROIDES =================== */
  astView(mv){const o={key:'ast',title:'Asteroides',w:800,h:560,help:'← → para girar, ↑ para acelerar, Espacio para disparar. Rompe las rocas: las grandes se parten. 1 fragmento ◆ cada 1.000 puntos y 1 token si llegas a 10.000.',note:S=>`Récord: <b>${S.best}</b> · Partidas: ${S.games}`};
    this.g4Board(mv,o);o.restart=()=>this.astStart(o);document.getElementById('g4go').addEventListener('click',o.restart);const x=this.ctx4();this.astBg(x,o.w,o.h,0);},
  astBg(x,W,H,t){x.fillStyle='#07060F';x.fillRect(0,0,W,H);for(let i=0;i<90;i++){x.fillStyle=`rgba(255,255,255,${.3+((i*7)%10)/14})`;x.fillRect((i*197)%W,(i*113)%H,(i%5===0)?2:1,(i%5===0)?2:1);}const gr=x.createRadialGradient(W*.75,H*.3,10,W*.75,H*.3,260);gr.addColorStop(0,'rgba(181,123,255,.18)');gr.addColorStop(1,'rgba(181,123,255,0)');x.fillStyle=gr;x.fillRect(0,0,W,H);},
  astStart(o){const W=o.w,H=o.h,g={o,ship:{x:W/2,y:H/2,a:-Math.PI/2,vx:0,vy:0,inv:2},bul:[],rocks:[],ebul:[],ufo:null,pt:[],sc:0,lives:3,wave:0,cd:0,fr:0,tok:false};
    const rock=(x,y,s)=>{const a=Math.random()*7,v=(40+Math.random()*50)*(1+g.wave*.08)*(s===3?1:s===2?1.4:1.9);const pts=[...Array(11)].map((_,i)=>.75+Math.random()*.35);g.rocks.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,s,r:[0,14,26,46][s],pts,rot:Math.random()*7,vr:(Math.random()-.5)*1.5});};
    const wave=()=>{g.wave++;for(let i=0;i<3+g.wave;i++){let x,y;do{x=Math.random()*W;y=Math.random()*H;}while(Math.hypot(x-g.ship.x,y-g.ship.y)<180);rock(x,y,3);}};wave();
    const boom=(x,y,c,n)=>{for(let i=0;i<n;i++){const a=Math.random()*7,v=40+Math.random()*160;g.pt.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:.5+Math.random()*.5,c});}};
    g.key=(k,down)=>[' ','arrowleft','arrowright','arrowup','a','d','w'].includes(k);
    const wrap=b=>{if(b.x<-50)b.x+=W+100;if(b.x>W+50)b.x-=W+100;if(b.y<-50)b.y+=H+100;if(b.y>H+50)b.y-=H+100;};
    g.upd=dt=>{const S=g.ship,K=g.keys;if(S){if(K.arrowleft||K.a)S.a-=4.6*dt;if(K.arrowright||K.d)S.a+=4.6*dt;S.thr=!!(K.arrowup||K.w);if(S.thr){S.vx+=Math.cos(S.a)*300*dt;S.vy+=Math.sin(S.a)*300*dt;if(Math.random()<.6)g.pt.push({x:S.x-Math.cos(S.a)*14,y:S.y-Math.sin(S.a)*14,vx:-Math.cos(S.a)*120+(Math.random()-.5)*40,vy:-Math.sin(S.a)*120+(Math.random()-.5)*40,l:.3,c:'#FFC93C'});}
        const sp=Math.hypot(S.vx,S.vy);if(sp>380){S.vx*=380/sp;S.vy*=380/sp;}S.vx*=1-.35*dt;S.vy*=1-.35*dt;S.x+=S.vx*dt;S.y+=S.vy*dt;wrap(S);S.inv-=dt;g.cd-=dt;
        if(K[' ']&&g.cd<=0&&g.bul.length<7){g.cd=.17;g.bul.push({x:S.x+Math.cos(S.a)*16,y:S.y+Math.sin(S.a)*16,vx:Math.cos(S.a)*600+S.vx,vy:Math.sin(S.a)*600+S.vy,l:.95});}}
      else{g.respawn-=dt;if(g.respawn<=0&&!g.rocks.some(r=>Math.hypot(r.x-W/2,r.y-H/2)<120))g.ship={x:W/2,y:H/2,a:-Math.PI/2,vx:0,vy:0,inv:2.5};}
      g.bul.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;wrap(b);});g.bul=g.bul.filter(b=>b.l>0);
      g.rocks.forEach(r=>{r.x+=r.vx*dt;r.y+=r.vy*dt;r.rot+=r.vr*dt;wrap(r);});
      for(const b of g.bul){for(const r of g.rocks){if(!r.dead&&Math.hypot(b.x-r.x,b.y-r.y)<r.r){r.dead=true;b.l=0;g.sc+=[0,100,50,20][r.s];boom(r.x,r.y,'#C9B8E8',r.s*6);if(r.s>1){rock(r.x,r.y,r.s-1);rock(r.x,r.y,r.s-1);}break;}}
        if(g.ufo&&b.l>0&&Math.hypot(b.x-g.ufo.x,b.y-g.ufo.y)<18){b.l=0;g.sc+=500;boom(g.ufo.x,g.ufo.y,'#8BF0FF',24);g.ufo=null;}}
      g.rocks=g.rocks.filter(r=>!r.dead);
      // ovni
      if(!g.ufo&&g.wave>=2&&Math.random()<dt*.06){const L=Math.random()<.5;g.ufo={x:L?-30:W+30,y:60+Math.random()*(H-120),vx:L?110:-110,cd:1.5};}
      if(g.ufo){const U=g.ufo;U.x+=U.vx*dt;U.y+=Math.sin(g.t*2)*40*dt;U.cd-=dt;if(U.cd<=0&&g.ship){U.cd=1.6;const a=Math.atan2(g.ship.y-U.y,g.ship.x-U.x)+(Math.random()-.5)*.4;g.ebul.push({x:U.x,y:U.y,vx:Math.cos(a)*260,vy:Math.sin(a)*260,l:2.2});}if(U.x<-60||U.x>W+60)g.ufo=null;}
      g.ebul.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;});g.ebul=g.ebul.filter(b=>b.l>0);
      // choques con la nave
      if(g.ship&&g.ship.inv<=0){const S=g.ship;const hit=g.rocks.some(r=>Math.hypot(r.x-S.x,r.y-S.y)<r.r+10)||g.ebul.some(b=>Math.hypot(b.x-S.x,b.y-S.y)<12)||(g.ufo&&Math.hypot(g.ufo.x-S.x,g.ufo.y-S.y)<26);
        if(hit){boom(S.x,S.y,'#FF8A3D',40);g.ship=null;g.lives--;g.respawn=1.5;g.shake=.4;if(g.lives<=0){this.astEnd(g);return;}}}
      g.pt.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt;});g.pt=g.pt.filter(p=>p.l>0);if(g.shake>0)g.shake-=dt;
      if(!g.rocks.length){wave();if(g.ship)g.ship.inv=1.5;}
      if(Math.floor(g.sc/1000)>g.fr)g.fr=Math.floor(g.sc/1000);if(g.sc>=10000&&!g.tok){g.tok=true;this.give(1,'10.000 en Asteroides');}};
    g.draw=(x,W,H)=>{x.save();if(g.shake>0)x.translate((Math.random()-.5)*8,(Math.random()-.5)*8);this.astBg(x,W,H,g.t);
      g.rocks.forEach(r=>{x.save();x.translate(r.x,r.y);x.rotate(r.rot);x.beginPath();r.pts.forEach((p,i)=>{const a=i/r.pts.length*Math.PI*2;x.lineTo(Math.cos(a)*r.r*p,Math.sin(a)*r.r*p);});x.closePath();const gr=x.createRadialGradient(-r.r*.3,-r.r*.3,2,0,0,r.r);gr.addColorStop(0,'#8A7FA8');gr.addColorStop(1,'#3E3656');x.fillStyle=gr;x.fill();x.strokeStyle='#B8ACD8';x.lineWidth=1.5;x.stroke();
        x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.arc(r.r*.25,r.r*.1,r.r*.18,0,7);x.arc(-r.r*.3,r.r*.35,r.r*.12,0,7);x.fill();x.restore();});
      if(g.ufo){const U=g.ufo;x.fillStyle='#8BF0FF';x.beginPath();x.ellipse(U.x,U.y-5,9,7,0,Math.PI,0);x.fill();x.fillStyle='#5A4A7A';x.beginPath();x.ellipse(U.x,U.y,20,7,0,0,7);x.fill();x.fillStyle='#FFE14D';for(let i=-1;i<=1;i++){x.beginPath();x.arc(U.x+i*9,U.y+1,2,0,7);x.fill();}}
      x.fillStyle='#FFE14D';g.bul.forEach(b=>{x.beginPath();x.arc(b.x,b.y,2.5,0,7);x.fill();});x.fillStyle='#FF6B9A';g.ebul.forEach(b=>{x.beginPath();x.arc(b.x,b.y,3.5,0,7);x.fill();});
      g.pt.forEach(p=>{x.globalAlpha=Math.min(1,p.l*2);x.fillStyle=p.c;x.fillRect(p.x-1.5,p.y-1.5,3,3);});x.globalAlpha=1;
      const S=g.ship;if(S&&!(S.inv>0&&Math.floor(g.t*12)%2)){x.save();x.translate(S.x,S.y);x.rotate(S.a);x.fillStyle='#F2EEFF';x.beginPath();x.moveTo(16,0);x.lineTo(-11,-10);x.lineTo(-6,0);x.lineTo(-11,10);x.closePath();x.fill();x.fillStyle='#F06BC8';x.beginPath();x.moveTo(4,0);x.lineTo(-6,-5);x.lineTo(-6,5);x.closePath();x.fill();
        if(S.thr){x.fillStyle='#FFC93C';x.beginPath();x.moveTo(-7,-4);x.lineTo(-16-Math.random()*8,0);x.lineTo(-7,4);x.fill();}x.restore();}
      x.restore();this.g4Txt(x,String(g.sc),16,30,20);this.g4Txt(x,'Oleada '+g.wave,16,52,13,'#C9B8E8');for(let i=0;i<g.lives;i++){x.save();x.translate(W-20-i*22,22);x.rotate(-Math.PI/2);x.fillStyle='#F2EEFF';x.beginPath();x.moveTo(9,0);x.lineTo(-6,-6);x.lineTo(-3,0);x.lineTo(-6,6);x.fill();x.restore();}};
    this.g4Run(o,g);},
  astEnd(g){g.over=true;const rec=this.g4End('ast',g.sc,{xp:Math.min(80,Math.round(g.sc/150)),frags:g.fr,note:g.o.note});setTimeout(()=>{this.g4Over(rec?'¡Nuevo récord!':'Sin naves',`${g.sc} puntos · oleada ${g.wave} · +${g.fr} ◆${g.tok?' · +1 token':''} · Espacio para repetir`);document.getElementById('g4go').addEventListener('click',g.o.restart);},600);},

  /* =================== CRUZA (frogger) =================== */
  frogView(mv){const o={key:'frog',title:'Cruza',w:520,h:600,help:'Flechas o WASD para saltar casilla a casilla. Cruza la carretera, salta por los troncos y llega a las 5 casitas de arriba. 1 fragmento ◆ por casita y 1 token si completas 2 niveles.',note:S=>`Récord: <b>${S.best}</b> · Partidas: ${S.games}`};
    this.g4Board(mv,o);o.restart=()=>this.frogStart(o);document.getElementById('g4go').addEventListener('click',o.restart);this.frogDraw(this.ctx4(),null,o.w,o.h);},
  frogLanes(lv){const k=1+(lv-1)*.18;return[ // fila, tipo, velocidad (px/s), longitud (casillas), separación
    [1,'log',55*k,3,4],[2,'turtle',-70*k,2,3],[3,'log',90*k,5,5],[4,'turtle',-60*k,3,3],[5,'log',70*k,4,4],
    [7,'truck',-60*k,2,5],[8,'car',95*k,1,4],[9,'car',-80*k,1,3],[10,'car',70*k,1,4],[11,'car',-110*k,1,5]];},
  frogStart(o){const C=40,g={o,C,lv:1,lives:3,sc:0,homes:[0,0,0,0,0],fr:0,tok:false,objs:[],tm:30,best:12,hop:0};
    const build=()=>{g.objs=[];this.frogLanes(g.lv).forEach(([row,k,sp,len,gap])=>{const per=len+gap;for(let x=-per*C;x<13*C+per*C;x+=per*C+Math.random()*C)g.objs.push({row,k,sp,x,w:len*C,col:['#E5484D','#3FA8FF','#FFC93C','#7BC67E'][Math.floor(Math.random()*4)],dive:k==='turtle'&&Math.random()<.35,ph:Math.random()*7});});};
    const reset=()=>{g.fx=6;g.fy=12;g.tm=30;g.best=12;g.ride=0;};build();reset();
    const die=why=>{g.lives--;g.dead={t:.8,x:g.fx,y:g.fy,why};g.shake=.3;if(g.lives<=0){g.over=true;setTimeout(()=>this.frogEnd(g),700);}else reset();};
    g.key=(k,down)=>{if(!down||g.dead)return['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(k);const D={arrowup:[0,-1],w:[0,-1],arrowdown:[0,1],s:[0,1],arrowleft:[-1,0],a:[-1,0],arrowright:[1,0],d:[1,0]}[k];if(!D)return false;
      g.fx=Math.max(0,Math.min(12,Math.round(g.fx)+D[0]));g.fy=Math.max(0,Math.min(12,g.fy+D[1]));g.hop=.12;g.dir=D;if(g.fy<g.best){g.best=g.fy;g.sc+=10;}return true;};
    g.upd=dt=>{if(g.dead){g.dead.t-=dt;if(g.dead.t<=0)g.dead=null;return;}g.tm-=dt;if(g.hop>0)g.hop-=dt;if(g.shake>0)g.shake-=dt;
      const W=13*C;g.objs.forEach(b=>{b.x+=b.sp*dt;const per=W+b.w*3;if(b.sp>0&&b.x>W+C*2)b.x-=W+C*8;if(b.sp<0&&b.x<-b.w-C*2)b.x+=W+C*8;b.ph+=dt;});
      if(g.tm<=0){die('time');return;}
      const fy=g.fy,px=g.fx*C+C/2;
      if(fy===0){const slots=[1,3.5,6,8.5,11],i=slots.findIndex(s=>Math.abs(g.fx-s)<.8);if(i>=0&&!g.homes[i]){g.homes[i]=1;g.sc+=50+Math.floor(g.tm)*2;g.fr++;this.addFrags(1);
          if(g.homes.every(Boolean)){g.lv++;g.sc+=500;g.homes=[0,0,0,0,0];build();if(g.lv>=3&&!g.tok){g.tok=true;this.give(1,'2 niveles en Cruza');}}reset();}else die('wall');return;}
      if(fy>=1&&fy<=5){const on=g.objs.find(b=>b.row===fy&&px>b.x+6&&px<b.x+b.w-6&&!(b.dive&&Math.sin(b.ph*1.2)>.6));if(!on){die('water');return;}g.fx+=on.sp*dt/C;if(g.fx<-.4||g.fx>12.4){die('water');return;}}
      else if(fy>=7&&fy<=11){if(g.objs.some(b=>b.row===fy&&px>b.x+4&&px<b.x+b.w-4)){die('car');return;}}};
    g.draw=(x,W,H)=>this.frogDraw(x,g,W,H);this.g4Run(o,g);},
  frogEnd(g){const rec=this.g4End('frog',g.sc,{xp:Math.min(70,Math.round(g.sc/20)),frags:0,note:g.o.note});this.g4Over(rec?'¡Nuevo récord!':'Fin de la partida',`${g.sc} puntos · nivel ${g.lv} · ${g.fr} ◆${g.tok?' · +1 token':''} · Espacio para repetir`);document.getElementById('g4go').addEventListener('click',g.o.restart);},
  frogDraw(x,g,W,H){const C=40,T=40;x.save();if(g&&g.shake>0)x.translate((Math.random()-.5)*6,(Math.random()-.5)*6);
    x.fillStyle='#2E5A3A';x.fillRect(0,0,W,H);
    // casitas
    x.fillStyle='#24452E';x.fillRect(0,T,W,C);[1,3.5,6,8.5,11].forEach((s,i)=>{const cx=s*C+C/2;x.fillStyle='#1E3A5F';x.fillRect(cx-22,T+4,44,C-4);if(g&&g.homes[i]){this.frogBlob(x,cx,T+C/2,1,0);}else{x.fillStyle='rgba(255,255,255,.12)';x.beginPath();x.arc(cx,T+C/2,10,0,7);x.fill();}});
    // río
    const rg=x.createLinearGradient(0,T+C,0,T+C*6);rg.addColorStop(0,'#2E6B9A');rg.addColorStop(1,'#3FA8FF');x.fillStyle=rg;x.fillRect(0,T+C,W,C*5);x.strokeStyle='rgba(255,255,255,.18)';x.lineWidth=1.5;const t=g?g.t:0;for(let i=0;i<24;i++){const yy=T+C+((i*37)%(C*5)),xx=((i*91+t*30)%(W+40))-20;x.beginPath();x.moveTo(xx,yy);x.quadraticCurveTo(xx+8,yy-3,xx+16,yy);x.stroke();}
    // mediana y salida
    x.fillStyle='#7A5AA0';x.fillRect(0,T+C*6,W,C);x.fillStyle='#7A5AA0';x.fillRect(0,T+C*12,W,C);x.fillStyle='rgba(255,255,255,.08)';for(let i=0;i<13;i++){x.fillRect(i*C+2,T+C*6+2,C-4,C-4);x.fillRect(i*C+2,T+C*12+2,C-4,C-4);}
    // carretera
    x.fillStyle='#2A2A33';x.fillRect(0,T+C*7,W,C*5);x.fillStyle='rgba(255,255,255,.35)';for(let r=8;r<12;r++)for(let i=0;i<13;i++)x.fillRect(i*C+8,T+r*C-1,22,2);
    if(g)g.objs.forEach(b=>{const y=T+b.row*C;
      if(b.k==='log'){x.fillStyle='#7A4A2A';this.rr4(x,b.x,y+6,b.w,C-12,10);x.fill();x.fillStyle='#9A6A3A';x.fillRect(b.x+6,y+12,b.w-12,3);x.fillRect(b.x+10,y+22,b.w-30,2);x.fillStyle='#C9965A';x.beginPath();x.ellipse(b.x+b.w-6,y+C/2,5,C/2-7,0,0,7);x.fill();}
      else if(b.k==='turtle'){const under=b.dive&&Math.sin(b.ph*1.2)>.6,half=b.dive&&Math.sin(b.ph*1.2)>.3;for(let i=0;i<b.w/C;i++){const cx=b.x+i*C+C/2;x.globalAlpha=under?.15:half?.55:1;x.fillStyle='#4FA88A';x.beginPath();x.ellipse(cx,y+C/2,15,12,0,0,7);x.fill();x.fillStyle='#2E6B5A';x.beginPath();x.ellipse(cx,y+C/2,9,7,0,0,7);x.fill();x.fillStyle='#7BC67E';x.beginPath();x.arc(cx+(b.sp<0?-16:16),y+C/2,5,0,7);x.fill();x.globalAlpha=1;}}
      else{const L=b.sp<0;x.fillStyle='rgba(0,0,0,.3)';x.fillRect(b.x+3,y+C-8,b.w-6,5);x.fillStyle=b.k==='truck'?'#C9C9D8':b.col;this.rr4(x,b.x+2,y+7,b.w-4,C-14,6);x.fill();if(b.k==='truck'){x.fillStyle=b.col;this.rr4(x,L?b.x+2:b.x+b.w-26,y+7,24,C-14,6);x.fill();}
        x.fillStyle='rgba(180,220,255,.85)';x.fillRect(L?b.x+8:b.x+b.w-16,y+11,8,C-22);x.fillStyle='#FFE14D';x.fillRect(L?b.x+2:b.x+b.w-5,y+10,3,4);x.fillRect(L?b.x+2:b.x+b.w-5,y+C-14,3,4);}});
    if(g){if(g.dead){const d=g.dead;x.font='26px system-ui';x.textAlign='center';x.fillText(d.why==='water'?'💦':d.why==='car'?'💥':'⏰',d.x*C+C/2,T+d.y*C+C/2+9);x.textAlign='left';}
      else this.frogBlob(x,g.fx*C+C/2,T+g.fy*C+C/2-(g.hop>0?6:0),1.05,g.dir);}
    else this.frogBlob(x,6*C+C/2,T+12*C+C/2,1.05,null);
    x.restore();
    // marcador
    x.fillStyle='#14101F';x.fillRect(0,0,W,T);if(g){this.g4Txt(x,'Puntos '+g.sc,12,26,15);this.g4Txt(x,'Nivel '+g.lv,190,26,15,'#FFC93C');x.fillStyle='rgba(255,255,255,.2)';x.fillRect(300,14,120,10);x.fillStyle=g.tm<8?'#E5484D':'#7BC67E';x.fillRect(300,14,120*Math.max(0,g.tm/30),10);for(let i=0;i<g.lives;i++)this.frogBlob(x,W-20-i*24,T/2,.6,null);}
    else this.g4Txt(x,'Cruza',12,26,15);},
  frogBlob(x,X,Y,s,d){x.save();x.translate(X,Y);x.scale(s,s);x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.ellipse(0,12,13,4,0,0,7);x.fill();x.fillStyle='#5FD38A';x.beginPath();x.ellipse(-9,8,6,4,0,0,7);x.ellipse(9,8,6,4,0,0,7);x.fill();x.fillStyle='#7BE3A0';x.beginPath();x.ellipse(0,0,13,12,0,0,7);x.fill();
    x.fillStyle='#fff';x.beginPath();x.arc(-6,-8,5,0,7);x.arc(6,-8,5,0,7);x.fill();x.fillStyle='#1A1422';const dx=d?d[0]*1.5:0,dy=d?d[1]*1.5:0;x.beginPath();x.arc(-6+dx,-8+dy,2.4,0,7);x.arc(6+dx,-8+dy,2.4,0,7);x.fill();x.strokeStyle='#2E8B57';x.lineWidth=1.5;x.beginPath();x.arc(0,2,5,.3,Math.PI-.3);x.stroke();x.restore();},

  /* =================== TIRO AL PLATO =================== */
  skeetView(mv){const o={key:'skeet',title:'Tiro al plato',w:800,h:500,help:'Apunta con el ratón y haz clic para disparar. 10 rondas de 2 platos y 2 disparos por ronda. 1 fragmento ◆ cada 4 aciertos y 1 token si aciertas 18 de 20.',note:S=>`Récord: <b>${S.best}</b> de 20 · Partidas: ${S.games}`};
    this.g4Board(mv,o);o.restart=()=>this.skeetStart(o);document.getElementById('g4go').addEventListener('click',o.restart);this.skeetDraw(this.ctx4(),null,o.w,o.h);},
  skeetStart(o){const W=o.w,H=o.h,g={o,round:0,shots:2,hits:0,plates:[],pt:[],mx:W/2,my:H/2,wait:1,flash:0,score:0,combo:0,shards:[],msg:null};
    const launch=()=>{g.round++;g.shots=2;g.plates=[];const dbl=g.round>2;const n=dbl?2:1;for(let i=0;i<n;i++){const L=Math.random()<.5;const sp=1+g.round*.05;g.plates.push({x:L?-20:W+20,y:H-90,vx:(L?1:-1)*(330+Math.random()*120)*sp,vy:-(420+Math.random()*120),r:16,hit:false,gone:false,d:i*.35});}
      if(g.round<=2){const L=Math.random()<.5;g.plates.push({x:L?-20:W+20,y:H-90,vx:(L?1:-1)*360,vy:-470,r:16,hit:false,gone:false,d:.7});}};
    g.pd=(t,X,Y)=>{g.mx=X;g.my=Y;if(t!=='pointerdown'||g.over)return;if(g.shots<=0||!g.plates.length)return;g.shots--;g.flash=.08;g.recoil=.15;
      let best=null,bd=1e9;g.plates.forEach(p=>{if(p.hit||p.gone||p.d>0)return;const d=Math.hypot(p.x-X,p.y-Y);if(d<p.r+16&&d<bd){bd=d;best=p;}});
      if(best){best.hit=true;g.hits++;g.combo++;const pts=100+(g.combo>1?50*(g.combo-1):0);g.score+=pts;g.msg={t:g.combo>1?`¡Doble! +${pts}`:`+${pts}`,x:best.x,y:best.y,l:.8};for(let i=0;i<14;i++){const a=Math.random()*7,v=60+Math.random()*180;g.shards.push({x:best.x,y:best.y,vx:Math.cos(a)*v+best.vx*.3,vy:Math.sin(a)*v+best.vy*.3,l:1,r:Math.random()*7,s:3+Math.random()*4});}}
      else g.combo=0;for(let i=0;i<6;i++)g.pt.push({x:X+(Math.random()-.5)*10,y:Y+(Math.random()-.5)*10,l:.25});};
    g.upd=dt=>{if(g.flash>0)g.flash-=dt;if(g.recoil>0)g.recoil-=dt;
      if(!g.plates.length||g.plates.every(p=>p.hit||p.gone)){g.wait-=dt;if(g.wait<=0){if(g.round>=10){this.skeetEnd(g);return;}g.combo=0;launch();g.wait=1.1;}}
      g.plates.forEach(p=>{if(p.d>0){p.d-=dt;return;}if(p.hit||p.gone)return;p.vy+=380*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.y>H-60&&p.vy>0||p.x<-60||p.x>W+60)p.gone=true;});
      g.shards.forEach(s=>{s.vy+=400*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.l-=dt;s.r+=dt*8;});g.shards=g.shards.filter(s=>s.l>0);g.pt.forEach(p=>p.l-=dt);g.pt=g.pt.filter(p=>p.l>0);if(g.msg){g.msg.l-=dt;g.msg.y-=40*dt;if(g.msg.l<=0)g.msg=null;}};
    g.draw=(x,W,H)=>this.skeetDraw(x,g,W,H);const cv=document.getElementById('g4cv');cv.style.cursor='none';this.g4Run(o,g);},
  skeetEnd(g){g.over=true;document.getElementById('g4cv').style.cursor='';const fr=Math.floor(g.hits/4);const rec=this.g4End('skeet',g.hits,{xp:10+g.hits*2,frags:fr,token:g.hits>=18?'Tiro al plato: '+g.hits+' de 20':null,note:g.o.note});
    this.g4Over(rec?'¡Nuevo récord!':'Fin de la tanda',`${g.hits} de 20 platos · ${g.score} puntos · +${fr} ◆${g.hits>=18?' · +1 token':''} · Espacio para repetir`);document.getElementById('g4go').addEventListener('click',g.o.restart);},
  skeetDraw(x,g,W,H){const sky=x.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#5BA8E0');sky.addColorStop(.7,'#CFE9FF');sky.addColorStop(1,'#FFE9C2');x.fillStyle=sky;x.fillRect(0,0,W,H);
    x.fillStyle='rgba(255,255,255,.8)';[[120,70],[480,50],[680,100]].forEach(([cx,cy])=>{x.beginPath();x.arc(cx,cy,18,0,7);x.arc(cx+20,cy-8,22,0,7);x.arc(cx+44,cy,16,0,7);x.fill();});
    x.fillStyle='#7FA88A';x.beginPath();x.moveTo(0,H-120);for(let i=0;i<=8;i++)x.lineTo(i*W/8,H-120-Math.sin(i*1.3)*30-20);x.lineTo(W,H);x.lineTo(0,H);x.fill();
    x.fillStyle='#5C8A48';x.fillRect(0,H-70,W,70);[[40,H-70],[90,H-78],[700,H-74],[760,H-70]].forEach(([tx,ty])=>{x.fillStyle='#5A3A2A';x.fillRect(tx-3,ty-10,6,14);x.fillStyle='#3E6B2E';x.beginPath();x.arc(tx,ty-24,20,0,7);x.fill();});
    x.fillStyle='#8A8A9A';x.fillRect(8,H-96,34,26);x.fillRect(W-42,H-96,34,26);
    if(g){g.plates.forEach(p=>{if(p.hit||p.gone||p.d>0)return;x.save();x.translate(p.x,p.y);x.fillStyle='rgba(0,0,0,.2)';x.beginPath();x.ellipse(2,3,p.r,p.r*.45,0,0,7);x.fill();x.fillStyle='#FF7A2E';x.beginPath();x.ellipse(0,0,p.r,p.r*.45,0,0,7);x.fill();x.fillStyle='#FFB070';x.beginPath();x.ellipse(0,-2,p.r*.6,p.r*.22,0,0,7);x.fill();x.restore();});
      g.shards.forEach(s=>{x.save();x.translate(s.x,s.y);x.rotate(s.r);x.globalAlpha=Math.min(1,s.l*1.5);x.fillStyle='#FF7A2E';x.beginPath();x.moveTo(0,0);x.lineTo(s.s,1);x.lineTo(1,s.s);x.fill();x.restore();});x.globalAlpha=1;
      g.pt.forEach(p=>{x.fillStyle=`rgba(80,70,60,${p.l*3})`;x.beginPath();x.arc(p.x,p.y,3,0,7);x.fill();});
      if(g.msg){x.globalAlpha=Math.min(1,g.msg.l*2);this.g4Txt(x,g.msg.t,g.msg.x,g.msg.y,18,'#FFE14D','center');x.globalAlpha=1;}
      // mira
      const r=g.recoil>0?18:14;x.strokeStyle='#E5484D';x.lineWidth=2;x.beginPath();x.arc(g.mx,g.my,r,0,7);x.moveTo(g.mx-r-6,g.my);x.lineTo(g.mx-r+5,g.my);x.moveTo(g.mx+r-5,g.my);x.lineTo(g.mx+r+6,g.my);x.moveTo(g.mx,g.my-r-6);x.lineTo(g.mx,g.my-r+5);x.moveTo(g.mx,g.my+r-5);x.lineTo(g.mx,g.my+r+6);x.stroke();x.fillStyle='#E5484D';x.beginPath();x.arc(g.mx,g.my,2,0,7);x.fill();
      if(g.flash>0){x.fillStyle='rgba(255,240,200,.35)';x.fillRect(0,0,W,H);}
      x.fillStyle='rgba(20,16,32,.6)';this.rr4(x,10,10,250,34,10);x.fill();this.g4Txt(x,`Ronda ${Math.max(1,g.round)}/10`,22,33,15);this.g4Txt(x,`🎯 ${g.hits}`,140,33,15,'#FFE14D');
      for(let i=0;i<2;i++){x.fillStyle=i<g.shots?'#C9A227':'rgba(255,255,255,.25)';this.rr4(x,206+i*18,16,10,22,3);x.fill();}
      this.g4Txt(x,String(g.score),W-16,33,18,'#fff','right');}},

  /* =================== CUEVA (helicóptero) =================== */
  heliView(mv){const o={key:'heli',title:'Cueva',w:800,h:450,help:'Mantén pulsado Espacio o el ratón para subir; suéltalo para bajar. No toques las paredes ni las rocas. 1 fragmento ◆ cada 100 m y 1 token si llegas a 1.000 m.',note:S=>`Récord: <b>${S.best} m</b> · Partidas: ${S.games}`};
    this.g4Board(mv,o);o.restart=()=>this.heliStart(o);document.getElementById('g4go').addEventListener('click',o.restart);this.heliDraw(this.ctx4(),null,o.w,o.h);},
  heliStart(o){const W=o.w,H=o.h,SEG=20,g={o,y:H/2,vy:0,dist:0,sp:210,cave:[],blocks:[],smoke:[],hold:false,fr:0,tok:false};
    let top=60,bot=H-60,dir=0;for(let i=0;i<=W/SEG+2;i++)g.cave.push({t:top,b:bot});
    const add=()=>{const m=g.dist/10,gap=Math.max(150,300-m*.12);dir+=(Math.random()-.5)*14;dir=Math.max(-18,Math.min(18,dir));let c=g.cave[g.cave.length-1],mid=(c.t+c.b)/2+dir;mid=Math.max(gap/2+20,Math.min(H-gap/2-20,mid));g.cave.push({t:mid-gap/2,b:mid+gap/2});};
    g.key=(k,down)=>{if(k===' '||k==='arrowup'||k==='w'){g.hold=down;return true;}return false;};
    g.pd=(t)=>{if(t==='pointerdown')g.hold=true;if(t==='pointerup')g.hold=false;};
    let acc=0;g.upd=dt=>{g.sp=Math.min(420,210+g.dist*.012);g.dist+=g.sp*dt;acc+=g.sp*dt;while(acc>=SEG){acc-=SEG;g.cave.shift();add();if(Math.random()<.05+Math.min(.08,g.dist/60000)&&!g.blocks.some(b=>b.x>W-200)){const c=g.cave[g.cave.length-1],h=40+Math.random()*50;g.blocks.push({x:W+10,y:c.t+30+Math.random()*Math.max(10,c.b-c.t-60-h),w:24,h});}}
      g.off=acc;g.vy+=(g.hold?-1100:800)*dt;g.vy=Math.max(-340,Math.min(400,g.vy));g.y+=g.vy*dt;g.blocks.forEach(b=>b.x-=g.sp*dt);g.blocks=g.blocks.filter(b=>b.x>-40);
      if(Math.random()<.5)g.smoke.push({x:120,y:g.y+4,l:.8,r:3});g.smoke.forEach(s=>{s.x-=g.sp*dt*.8;s.l-=dt;s.r+=dt*10;});g.smoke=g.smoke.filter(s=>s.l>0);
      const i=Math.floor((150+g.off)/SEG),c=g.cave[i]||g.cave[0];if(g.y-10<c.t||g.y+10>c.b||g.blocks.some(b=>150+20>b.x&&150-24<b.x+b.w&&g.y+9>b.y&&g.y-9<b.y+b.h)){this.heliEnd(g);return;}
      const m=Math.floor(g.dist/10);if(Math.floor(m/100)>g.fr){g.fr=Math.floor(m/100);g.flash=.7;}if(m>=1000&&!g.tok){g.tok=true;this.give(1,'1.000 m en la Cueva');}};
    g.draw=(x,W,H)=>this.heliDraw(x,g,W,H);this.g4Run(o,g);},
  heliEnd(g){g.over=true;g.boom=1;const m=Math.floor(g.dist/10);const rec=this.g4End('heli',m,{xp:Math.min(60,Math.round(m/20)),frags:g.fr,note:g.o.note});this.g4Over(rec?'¡Nuevo récord!':'¡Choque!',`${m} m · +${g.fr} ◆${g.tok?' · +1 token':''} · Espacio para repetir`);document.getElementById('g4go').addEventListener('click',g.o.restart);},
  heliDraw(x,g,W,H){const SEG=20,bg=x.createLinearGradient(0,0,W,0);bg.addColorStop(0,'#1A1430');bg.addColorStop(1,'#2A1F48');x.fillStyle=bg;x.fillRect(0,0,W,H);
    x.fillStyle='rgba(181,123,255,.08)';for(let i=0;i<8;i++){const xx=((i*173-(g?g.dist*.2:0))%(W+200)+W+200)%(W+200)-100;x.beginPath();x.arc(xx,H/2+Math.sin(i)*120,60+i*8,0,7);x.fill();}
    const cave=g?g.cave:[...Array(W/SEG+3)].map(()=>({t:60,b:H-60})),off=g?g.off||0:0;
    const rock=x.createLinearGradient(0,0,0,H);rock.addColorStop(0,'#4A3A2A');rock.addColorStop(.5,'#6B5340');rock.addColorStop(1,'#4A3A2A');x.fillStyle=rock;
    x.beginPath();x.moveTo(0,0);cave.forEach((c,i)=>x.lineTo(i*SEG-off,c.t));x.lineTo(W+40,0);x.closePath();x.fill();
    x.beginPath();x.moveTo(0,H);cave.forEach((c,i)=>x.lineTo(i*SEG-off,c.b));x.lineTo(W+40,H);x.closePath();x.fill();
    x.strokeStyle='#8FBF5A';x.lineWidth=3;x.beginPath();cave.forEach((c,i)=>i?x.lineTo(i*SEG-off,c.t):x.moveTo(-off,c.t));x.stroke();x.beginPath();cave.forEach((c,i)=>i?x.lineTo(i*SEG-off,c.b):x.moveTo(-off,c.b));x.stroke();
    if(g){g.blocks.forEach(b=>{x.fillStyle='#8A6A4A';this.rr4(x,b.x,b.y,b.w,b.h,5);x.fill();x.fillStyle='rgba(255,255,255,.15)';x.fillRect(b.x+4,b.y+4,5,b.h-8);});
      g.smoke.forEach(s=>{x.fillStyle=`rgba(220,220,235,${s.l*.4})`;x.beginPath();x.arc(s.x,s.y,s.r,0,7);x.fill();});}
    const y=g?g.y:H/2,tilt=g?Math.max(-.3,Math.min(.3,g.vy/900)):0,t=g?g.t:0;x.save();x.translate(150,y);x.rotate(tilt);
    x.fillStyle='#F06BC8';x.beginPath();x.ellipse(0,0,20,11,0,0,7);x.fill();x.fillRect(-36,-3,22,5);x.fillStyle='#8BF0FF';x.beginPath();x.ellipse(8,-2,8,6,0,0,7);x.fill();x.fillStyle='#5A4A7A';x.fillRect(-10,10,24,3);x.fillRect(-6,8,2,4);x.fillRect(8,8,2,4);
    x.strokeStyle='#2A2230';x.lineWidth=3;const rw=26*Math.abs(Math.cos(t*40));x.beginPath();x.moveTo(-rw,-15);x.lineTo(rw,-15);x.stroke();x.fillRect(-1,-15,2,5);x.beginPath();x.arc(-36,0,5*Math.abs(Math.sin(t*40))+1,0,7);x.stroke();x.restore();
    if(g&&g.boom){x.fillStyle='rgba(255,140,60,.8)';x.beginPath();x.arc(150,y,26,0,7);x.fill();x.fillStyle='rgba(255,230,120,.9)';x.beginPath();x.arc(150,y,13,0,7);x.fill();}
    const m=g?Math.floor(g.dist/10):0;this.g4Txt(x,m+' m',16,32,20);this.g4Txt(x,'Récord '+this.g4().heli.best+' m',16,54,12,'#C9B8E8');if(g&&g.flash>0){g.flash-=.016;x.globalAlpha=g.flash;this.g4Txt(x,'+1 ◆',W/2,60,22,'#B57BFF','center');x.globalAlpha=1;}
    if(!g){x.fillStyle='rgba(255,255,255,.5)';x.font='13px system-ui';x.textAlign='center';x.fillText('Mantén pulsado para subir',W/2,H-24);x.textAlign='left';}},

  /* =================== SOLITARIO =================== */
  solView(mv){const S=this.g4().sol,d3=!!this._sol3;
    mv.innerHTML=this.head('Solitario',true)+`<div class="view jg"><div class="jg-in"><section class="sol-wrap"><div class="sol-top"><div class="seg"><button class="segb" data-sold="1" aria-pressed="${!d3}">Robar 1</button><button class="segb" data-sold="3" aria-pressed="${d3}">Robar 3</button></div>
      <div class="mem-hud"><span>⏱ <b id="solt">0:00</b></span><span>Movimientos <b id="solm">0</b></span></div><button class="ebtn" id="solundo">↶ Deshacer</button><button class="ebtn" id="solauto" hidden>⚡ Terminar solo</button><button class="ebtn" id="solnew">↻ Nueva</button></div>
      <div class="sol-board" id="solb"></div><p class="tnote">Clic en una carta para moverla a donde pueda ir (primero arriba, luego a las columnas). Clic en el mazo para robar. Si ganas: 1 token y 5 fragmentos ◆. Ganadas: ${S.wins} de ${S.games}.</p></section></div></div>`;
    mv.querySelectorAll('[data-sold]').forEach(b=>b.addEventListener('click',()=>{this._sol3=b.dataset.sold==='3';this.solView(mv);}));
    document.getElementById('solnew').addEventListener('click',()=>this.solView(mv));document.getElementById('solundo').addEventListener('click',()=>this.solUndo());document.getElementById('solauto').addEventListener('click',()=>this.solAuto());
    this.solStart();},
  solStart(){this.stopAll();const deck=[];for(let s=0;s<4;s++)for(let r=1;r<=13;r++)deck.push({s,r,up:false});shuffle(deck);
    const G={tab:[...Array(7)].map(()=>[]),stock:[],waste:[],fnd:[[],[],[],[]],moves:0,t0:0,hist:[],d3:!!this._sol3,iv:null,won:false};
    for(let i=0;i<7;i++)for(let j=i;j<7;j++){const c=deck.pop();G.tab[j].push(c);}G.tab.forEach(c=>c[c.length-1].up=true);G.stock=deck;this._sol=G;
    this._gm={stop:()=>clearInterval(G.iv)};this.solRender();},
  solSnap(){const G=this._sol;G.hist.push(JSON.stringify({tab:G.tab,stock:G.stock,waste:G.waste,fnd:G.fnd,moves:G.moves}));if(G.hist.length>200)G.hist.shift();},
  solUndo(){const G=this._sol;if(!G||!G.hist.length||G.won)return;Object.assign(G,JSON.parse(G.hist.pop()));this.solRender();},
  solTick(){const G=this._sol;if(G.t0)return;G.t0=Date.now();G.iv=setInterval(()=>{const el=document.getElementById('solt');if(!el){clearInterval(G.iv);return;}const s=Math.floor((Date.now()-G.t0)/1000);el.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');},500);},
  red(c){return c.s===1||c.s===2;},
  solCanTab(c,col){const top=col[col.length-1];if(!top)return c.r===13;return top.up&&this.red(top)!==this.red(c)&&top.r===c.r+1;},
  solCanF(c,f){const top=f[f.length-1];return top?top.s===c.s&&top.r===c.r-1:c.r===1;},
  solClick(where,i,j){const G=this._sol;if(!G||G.won)return;this.solTick();
    if(where==='stock'){this.solSnap();if(G.stock.length){const n=G.d3?3:1;for(let k=0;k<n&&G.stock.length;k++){const c=G.stock.pop();c.up=true;G.waste.push(c);}}else{G.stock=G.waste.reverse().map(c=>({...c,up:false}));G.waste=[];}G.moves++;this.solRender();return;}
    let cards,from;if(where==='waste'){if(!G.waste.length)return;cards=[G.waste[G.waste.length-1]];from=()=>G.waste.pop();}
    else if(where==='fnd'){const f=G.fnd[i];if(!f.length)return;cards=[f[f.length-1]];from=()=>f.pop();}
    else{const col=G.tab[i];if(!col[j]||!col[j].up)return;cards=col.slice(j);from=()=>col.splice(j);}
    const c=cards[0];let dest=null;
    if(cards.length===1&&where!=='fnd'){const fi=G.fnd.findIndex(f=>this.solCanF(c,f));if(fi>=0)dest=['fnd',fi];}
    if(!dest){const order=[...Array(7).keys()].sort((a,b)=>(G.tab[b].length?1:0)-(G.tab[a].length?1:0));for(const k of order){if(where==='tab'&&k===i)continue;if(this.solCanTab(c,G.tab[k])){if(!G.tab[k].length&&where==='tab'&&j===0)continue;dest=['tab',k];break;}}}
    if(!dest){const el=document.querySelector(`[data-sc="${where}-${i}-${j}"]`);if(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}return;}
    this.solSnap();from();if(dest[0]==='fnd')G.fnd[dest[1]].push(...cards);else G.tab[dest[1]].push(...cards);
    if(where==='tab'){const col=G.tab[i];if(col.length&&!col[col.length-1].up)col[col.length-1].up=true;}G.moves++;this.solRender([dest[0],dest[1]]);this.solCheck();},
  solCheck(){const G=this._sol;if(G.fnd.every(f=>f.length===13)&&!G.won){G.won=true;clearInterval(G.iv);this.g4End('sol',0,{win:1,xp:60,frags:5,token:'Solitario ganado'});this.celebrate(true);
      const b=document.getElementById('solb');if(b)b.insertAdjacentHTML('beforeend',`<div class="mem-win"><b>¡Has ganado!</b><span>${G.moves} movimientos · +1 token · +5 ◆</span><button class="ebtn pri" onclick="Juegos.solView(document.getElementById('mainv'))">Otra partida</button></div>`);}
    const auto=document.getElementById('solauto');if(auto)auto.hidden=G.won||!(G.stock.length===0&&G.waste.length===0&&G.tab.every(c=>c.every(x=>x.up)));},
  solAuto(){const G=this._sol;const step=()=>{if(!G||G.won||this._sol!==G)return;for(let i=0;i<7;i++){const col=G.tab[i];const c=col[col.length-1];if(c){const fi=G.fnd.findIndex(f=>this.solCanF(c,f));if(fi>=0){col.pop();G.fnd[fi].push(c);G.moves++;this.solRender(['fnd',fi]);this.solCheck();setTimeout(step,70);return;}}}};step();},
  solCard(c,attr,cls){const S=['♠','♥','♦','♣'][c.s],R={1:'A',11:'J',12:'Q',13:'K'}[c.r]||c.r;return c.up?`<div class="sol-c up${this.red(c)?' red':''}${cls||''}" ${attr}><span class="sol-tl">${R}<i>${S}</i></span><span class="sol-mid">${c.r>10?['J','Q','K'][c.r-11]:S}</span><span class="sol-br">${R}<i>${S}</i></span></div>`:`<div class="sol-c down${cls||''}" ${attr}></div>`;},
  solRender(hl){const G=this._sol,b=document.getElementById('solb');if(!b)return;document.getElementById('solm').textContent=G.moves;
    const fCls=(k,i)=>hl&&hl[0]===k&&hl[1]===i?' pop':'';
    let h=`<div class="sol-row"><div class="sol-pile stock" data-sp="stock">${G.stock.length?this.solCard({up:false},'',''):'<span class="sol-re">↻</span>'}<span class="sol-n">${G.stock.length}</span></div>
      <div class="sol-pile waste">${G.waste.slice(G.d3?-3:-1).map((c,k,a)=>this.solCard(c,k===a.length-1?'data-sc="waste-0-0"':'',' fan'+k)).join('')}</div><div class="sol-gap"></div>
      ${G.fnd.map((f,i)=>`<div class="sol-pile fnd" data-fi="${i}">${f.length?this.solCard(f[f.length-1],`data-sc="fnd-${i}-0"`,fCls('fnd',i)):`<span class="sol-ghost">${['♠','♥','♦','♣'][i]}</span>`}</div>`).join('')}</div>
      <div class="sol-row tab">${G.tab.map((col,i)=>`<div class="sol-col" data-ti="${i}">${col.length?'':'<div class="sol-empty">K</div>'}${col.map((c,j)=>{let top=0;for(let k=0;k<j;k++)top+=col[k].up?28:12;return this.solCard(c,`data-sc="tab-${i}-${j}" style="top:${top}px"`,(fCls('tab',i)&&j===col.length-1?' pop':''));}).join('')}</div>`).join('')}</div>`;
    b.innerHTML=h;
    b.querySelector('[data-sp]').addEventListener('click',()=>this.solClick('stock'));
    b.querySelectorAll('[data-sc]').forEach(el=>el.addEventListener('click',e=>{e.stopPropagation();const [w,i,j]=el.dataset.sc.split('-');this.solClick(w,+i,+j);}));
    this.solCheck();},
});
// Menú y despacho
const _g4Menu=Juegos.menuExtra;
Juegos.menuExtra=function(){const X=_g4Menu.call(this),S=this.g4();const C=(k,ic,t,d,em)=>`<button class="jg-card" data-jg="${k}"><span class="jg-ic">${ic}</span><b>${t}</b><small>${d}</small><em>${em}</em></button>`;
  X.cards+=C('memory','🃏','Memory','Encuentra las parejas. Con modo BDD: une cada concepto con su definición.',`Ganadas: ${S.memory.wins}`)+
    C('dino','🦖','Corredor','Salta y agáchate para esquivar cristales y murciélagos. 1 ◆ cada 200 puntos; 1 token a los 1.500.',`Récord: ${S.dino.best}`)+
    C('ast','☄️','Asteroides','Gira, acelera y dispara a las rocas, que se parten. Cuidado con el ovni.',`Récord: ${S.ast.best}`)+
    C('frog','🐸','Cruza','Cruza la carretera y el río hasta las 5 casitas. 1 ◆ por casita.',`Récord: ${S.frog.best}`)+
    C('skeet','🎯','Tiro al plato','10 rondas, 2 disparos por ronda. Con 18 de 20, 1 token.',`Récord: ${S.skeet.best} de 20`)+
    C('heli','🚁','Cueva','Mantén pulsado para subir y no toques las paredes. 1 token a los 1.000 m.',`Récord: ${S.heli.best} m`)+
    C('sol','♠️','Solitario','El clásico de cartas, robando 1 o 3. Si ganas, 1 token.',`Ganadas: ${S.sol.wins}`);return X;};
const _g4Render=Juegos.render;
Juegos.render=function(mv){const k=this.sub,V={memory:'memoryView',dino:'dinoView',ast:'astView',frog:'frogView',skeet:'skeetView',heli:'heliView',sol:'solView'}[k];if(V)return this[V](mv);return _g4Render.call(this,mv);};
