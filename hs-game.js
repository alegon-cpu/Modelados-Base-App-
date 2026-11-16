/* ===================== Ecos de Prisma: motor ===================== */
const HSG={
  /* ---------- dibujo de personajes (chibi propio, hecho con formas) ---------- */
  _spr:{},
  sprite(c,alt){const k=c.id+(alt?'*':'');if(this._spr[k])return this._spr[k];const S=2,cv=document.createElement('canvas');cv.width=64*S;cv.height=72*S;const g=cv.getContext('2d');g.scale(S,S);g.translate(32,40);
    this.drawChibi(g,alt?this.altLook(c):c);return this._spr[k]=cv;},
  altLook(c){const sh=(h,a)=>{const n=parseInt(h.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;[r,g,b]=[g,b,r];return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);};return{...c,hair:sh(c.hair),out:sh(c.out),acc:sh(c.acc)};},
  shade(h,k){const n=parseInt(h.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=x=>Math.max(0,Math.min(255,Math.round(x*k)));return `rgb(${f(r)},${f(g)},${f(b)})`;},
  drawChibi(g,c){const S=this.shade.bind(this),el=HS_EL[c.el].c;
    g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(0,24,13,4,0,0,7);g.fill();
    // arma detrás
    const W=c.w;g.save();g.lineCap='round';
    if(W==='lanza'){g.strokeStyle=S(c.acc,.7);g.lineWidth=2.5;g.beginPath();g.moveTo(-10,22);g.lineTo(16,-26);g.stroke();g.fillStyle=c.acc;g.beginPath();g.moveTo(16,-34);g.lineTo(20,-24);g.lineTo(13,-25);g.closePath();g.fill();g.fillStyle=el;g.fillRect(12,-24,6,3);}
    if(W==='mandoble'){g.fillStyle='#D8DEE8';g.beginPath();g.moveTo(10,10);g.lineTo(26,-24);g.lineTo(30,-21);g.lineTo(15,12);g.closePath();g.fill();g.fillStyle=el;g.fillRect(8,9,9,4);}
    if(W==='arco'){g.strokeStyle=S(c.acc,.8);g.lineWidth=2.5;g.beginPath();g.arc(-16,2,15,-1.2,1.2);g.stroke();g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=.8;g.beginPath();g.moveTo(-10,-12);g.lineTo(-10,16);g.stroke();}
    g.restore();
    // piernas y cuerpo
    g.fillStyle=S(c.out,.6);this.rr(g,-8,12,6,10,2);this.rr(g,2,12,6,10,2);
    g.fillStyle=c.out;g.beginPath();g.moveTo(-11,14);g.lineTo(11,14);g.lineTo(8,-2);g.lineTo(-8,-2);g.closePath();g.fill();
    g.fillStyle=c.acc;g.fillRect(-8,4,16,2.5);
    g.fillStyle=c.skin;this.rr(g,-13,0,5,9,2.5);this.rr(g,8,0,5,9,2.5);
    // pelo de atrás
    g.fillStyle=S(c.hair,.82);const hs=c.hs;
    if(hs===1){this.rr(g,-15,-20,30,30,8);}if(hs===7){this.rr(g,-15,-20,30,20,8);}
    if(hs===2){g.beginPath();g.ellipse(-17,-6,6,12,.3,0,7);g.ellipse(17,-6,6,12,-.3,0,7);g.fill();}
    if(hs===4){g.beginPath();g.arc(0,-28,8,0,7);g.fill();}
    if(hs===5){g.fillStyle=S(c.out,.85);g.beginPath();g.arc(0,-13,17,0,7);g.fill();}
    // cabeza
    g.fillStyle=c.skin;g.beginPath();g.arc(0,-13,13,0,7);g.fill();
    // flequillo
    g.fillStyle=c.hair;
    if(hs===5){g.fillStyle=S(c.out,1);g.beginPath();g.arc(0,-15,15,Math.PI*1.05,Math.PI*1.95);g.lineTo(13,-14);g.quadraticCurveTo(0,-22,-13,-14);g.fill();g.fillStyle=c.hair;g.beginPath();g.arc(0,-17,11,Math.PI*1.1,Math.PI*1.9);g.fill();}
    else if(hs===6){g.beginPath();g.arc(0,-16,13.5,Math.PI,0);g.fill();g.fillStyle=c.out;g.beginPath();g.moveTo(-13,-20);g.quadraticCurveTo(-20,-36,-26,-22);g.lineTo(-10,-24);g.closePath();g.moveTo(13,-20);g.quadraticCurveTo(20,-36,26,-22);g.lineTo(10,-24);g.closePath();g.fill();
      g.fillStyle=c.acc;g.beginPath();g.moveTo(-6,-26);g.quadraticCurveTo(0,-42,6,-26);g.closePath();g.fill();g.fillStyle=c.acc;g.beginPath();g.arc(-26,-22,3,0,7);g.arc(26,-22,3,0,7);g.arc(0,-40,3,0,7);g.fill();}
    else{g.beginPath();g.arc(0,-15,14,Math.PI*1.02,Math.PI*1.98);g.lineTo(13,-12);
      if(hs===3){for(let i=0;i<5;i++){const x=13-i*6.5;g.lineTo(x-3,-8-(i%2)*3);g.lineTo(x-6.5,-12);}}else{g.quadraticCurveTo(6,-20,0,-12);g.quadraticCurveTo(-6,-20,-13,-12);}
      g.closePath();g.fill();
      if(hs===3){g.beginPath();for(let i=0;i<5;i++){const a=Math.PI*(1.1+i*.2);g.moveTo(Math.cos(a)*12,-15+Math.sin(a)*12);g.lineTo(Math.cos(a)*20,-15+Math.sin(a)*20);g.lineTo(Math.cos(a+.25)*12,-15+Math.sin(a+.25)*12);}g.fill();}
      if(hs===1||hs===7){this.rr(g,-14,-16,5,hs===1?22:14,2);this.rr(g,9,-16,5,hs===1?22:14,2);}
      if(hs===0){this.rr(g,-14,-16,4,9,2);this.rr(g,10,-16,4,9,2);}}
    // ojos
    g.fillStyle=c.eye;g.beginPath();g.ellipse(-5,-10,2.6,3.4,0,0,7);g.ellipse(5,-10,2.6,3.4,0,0,7);g.fill();
    g.fillStyle='#fff';g.beginPath();g.arc(-4,-11.5,1,0,7);g.arc(6,-11.5,1,0,7);g.fill();
    g.fillStyle='rgba(255,120,120,.35)';g.beginPath();g.ellipse(-8,-5,2.5,1.4,0,0,7);g.ellipse(8,-5,2.5,1.4,0,0,7);g.fill();
    g.strokeStyle=this.shade(c.skin,.55);g.lineWidth=1;g.beginPath();g.arc(0,-6,1.8,.2,Math.PI-.2);g.stroke();
    // adorno
    g.fillStyle=c.acc;if(hs!==6&&hs!==5){g.beginPath();g.moveTo(8,-24);g.lineTo(12,-22);g.lineTo(9,-19);g.closePath();g.fill();}
    // arma delante
    g.save();g.lineCap='round';
    if(W==='espada'){g.fillStyle='#E8EEF6';g.beginPath();g.moveTo(11,6);g.lineTo(24,-14);g.lineTo(26,-12);g.lineTo(13,8);g.closePath();g.fill();g.fillStyle=c.acc;g.fillRect(9,5,7,3);}
    if(W==='cata'){const gr=g.createRadialGradient(17,-2,1,17,-2,9);gr.addColorStop(0,'#fff');gr.addColorStop(.4,el);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(17,-2,9,0,7);g.fill();}
    if(W==='guante'){g.fillStyle=el;g.beginPath();g.arc(-11,9,4.5,0,7);g.arc(11,9,4.5,0,7);g.fill();}
    if(W==='naipes'){[[-.4,'#fff'],[0,c.acc],[.4,'#fff']].forEach(([a,col])=>{g.save();g.translate(15,4);g.rotate(a);g.fillStyle=col;this.rr(g,-3,-9,7,10,1.5);g.fillStyle=el;g.fillRect(-1,-6,3,3);g.restore();});}
    g.restore();},
  rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();g.fill();},
  /* enemigos */
  foeSprite(shape,col,col2,R){const k=shape+col+col2+R;if(this._spr[k])return this._spr[k];const S=2,D=R*2+24,cv=document.createElement('canvas');cv.width=D*S;cv.height=D*S;const g=cv.getContext('2d');g.scale(S,S);g.translate(D/2,D/2);
    this.drawFoe(g,shape,col,col2,R);return this._spr[k]=cv;},
  drawFoe(g,shape,col,col2,R){const S=this.shade.bind(this);g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(0,R*.85,R*.9,R*.28,0,0,7);g.fill();
    const eyes=(y,sp,c2)=>{g.fillStyle=c2||'#fff';g.beginPath();g.arc(-sp,y,R*.16,0,7);g.arc(sp,y,R*.16,0,7);g.fill();g.fillStyle='#1A1A22';g.beginPath();g.arc(-sp,y,R*.08,0,7);g.arc(sp,y,R*.08,0,7);g.fill();};
    if(shape==='slime'){g.fillStyle=col;g.beginPath();g.moveTo(-R,R*.6);g.quadraticCurveTo(-R,-R,0,-R);g.quadraticCurveTo(R,-R,R,R*.6);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(-R*.35,-R*.45,R*.22,R*.14,-.5,0,7);g.fill();eyes(-R*.05,R*.35);}
    else if(shape==='imp'){g.fillStyle=S(col,.8);g.beginPath();g.moveTo(-R*.6,-R*.5);g.lineTo(-R*.85,-R*1.2);g.lineTo(-R*.2,-R*.7);g.moveTo(R*.6,-R*.5);g.lineTo(R*.85,-R*1.2);g.lineTo(R*.2,-R*.7);g.fill();g.fillStyle=col;g.beginPath();g.arc(0,0,R*.85,0,7);g.fill();eyes(-R*.1,R*.32,'#FFE14D');}
    else if(shape==='bat'){g.fillStyle=S(col,.7);g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(-R*1.4,-R,-R*1.5,R*.3);g.quadraticCurveTo(-R*.8,0,0,R*.3);g.quadraticCurveTo(R*.8,0,R*1.5,R*.3);g.quadraticCurveTo(R*1.4,-R,0,0);g.fill();g.fillStyle=col;g.beginPath();g.arc(0,0,R*.6,0,7);g.fill();eyes(-R*.05,R*.22,'#FF5A5A');}
    else if(shape==='golem'){g.fillStyle=S(col,.75);this.rr(g,-R*1.05,-R*.2,R*.45,R*.9,R*.15);this.rr(g,R*.6,-R*.2,R*.45,R*.9,R*.15);g.fillStyle=col;this.rr(g,-R*.75,-R*.9,R*1.5,R*1.7,R*.25);g.fillStyle=col2;g.fillRect(-R*.5,-R*.35,R,R*.18);eyes(-R*.5,R*.3,col2);}
    else if(shape==='drone'){g.strokeStyle=S(col,.6);g.lineWidth=R*.12;g.beginPath();g.moveTo(-R*1.1,-R*.7);g.lineTo(R*1.1,-R*.7);g.stroke();g.fillStyle=col;g.beginPath();g.arc(0,0,R*.85,0,7);g.fill();g.fillStyle='#1A1A22';g.beginPath();g.arc(0,0,R*.45,0,7);g.fill();g.fillStyle=col2;g.beginPath();g.arc(0,0,R*.28,0,7);g.fill();}
    else if(shape==='mage'){g.fillStyle=col;g.beginPath();g.moveTo(0,-R*1.25);g.lineTo(R*.9,R*.8);g.lineTo(-R*.9,R*.8);g.closePath();g.fill();g.fillStyle='#14121C';g.beginPath();g.arc(0,-R*.2,R*.42,0,7);g.fill();eyes(-R*.2,R*.17,col2);}
    else if(shape==='warden'){g.fillStyle=S(col,.8);g.beginPath();g.arc(0,-R*.2,R*.8,0,7);g.fill();g.fillStyle=col2;g.beginPath();g.moveTo(-R*.2,-R*.6);g.lineTo(R*.9,-R*.5);g.lineTo(R*.8,R*.5);g.lineTo(R*.3,R*.9);g.lineTo(-R*.2,R*.4);g.closePath();g.fill();eyes(-R*.35,R*.28);}
    else if(shape==='bomb'){g.fillStyle='#22222A';g.beginPath();g.arc(0,0,R*.85,0,7);g.fill();g.strokeStyle='#8A6A3A';g.lineWidth=2;g.beginPath();g.moveTo(R*.3,-R*.75);g.quadraticCurveTo(R*.6,-R*1.3,R*.9,-R*1.1);g.stroke();g.fillStyle=col;g.beginPath();g.arc(R*.9,-R*1.1,R*.18,0,7);g.fill();eyes(-R*.05,R*.3,'#FFD84D');}
    else if(shape==='serpent'){g.fillStyle=S(col,.8);for(let i=3;i>0;i--){g.beginPath();g.arc(-i*R*.45,R*.3*Math.sin(i),R*(.75-i*.12),0,7);g.fill();}g.fillStyle=col;g.beginPath();g.ellipse(R*.25,-R*.1,R*.85,R*.7,0,0,7);g.fill();g.fillStyle=col2;g.beginPath();g.moveTo(R*.1,-R*.75);g.lineTo(R*.4,-R*1.25);g.lineTo(R*.6,-R*.7);g.fill();eyes(-R*.25,R*.3,col2);}
    else if(shape==='bird'){g.fillStyle=col2;g.beginPath();g.moveTo(0,-R*.2);g.quadraticCurveTo(-R*1.6,-R*1.3,-R*1.7,R*.2);g.quadraticCurveTo(-R*.9,-R*.1,0,R*.4);g.quadraticCurveTo(R*.9,-R*.1,R*1.7,R*.2);g.quadraticCurveTo(R*1.6,-R*1.3,0,-R*.2);g.fill();g.fillStyle=col;g.beginPath();g.ellipse(0,0,R*.6,R*.8,0,0,7);g.fill();g.fillStyle='#FFE14D';g.beginPath();g.moveTo(-R*.15,-R*.35);g.lineTo(0,-R*.05);g.lineTo(R*.15,-R*.35);g.fill();eyes(-R*.5,R*.22);}
    else if(shape==='mask'){g.fillStyle=col;g.beginPath();g.moveTo(-R,-R*.6);g.quadraticCurveTo(0,-R*1.2,R,-R*.6);g.quadraticCurveTo(R*.9,R*1.1,0,R);g.quadraticCurveTo(-R*.9,R*1.1,-R,-R*.6);g.fill();g.fillStyle='#14121C';g.beginPath();g.ellipse(-R*.4,-R*.2,R*.22,R*.14,-.3,0,7);g.ellipse(R*.4,-R*.2,R*.22,R*.14,.3,0,7);g.fill();g.strokeStyle='#14121C';g.lineWidth=R*.1;g.beginPath();g.arc(0,R*.15,R*.45,.3,Math.PI-.3);g.stroke();g.fillStyle=col2;g.beginPath();g.arc(-R*.7,R*.35,R*.12,0,7);g.arc(R*.7,R*.35,R*.12,0,7);g.fill();}
    else{g.fillStyle=col;g.beginPath();g.arc(0,0,R,0,7);g.fill();eyes(-R*.1,R*.3);}},
  /* ---------- partida ---------- */
  start(host,opts){this.stop();const meta=opts.meta;const G=this.G={host,meta,opts,t:0,ts:1,slowT:0,over:false,pause:false,modal:null,won:false,
      p:{x:0,y:0,dir:[1,0],face:1,inv:0,mv:false,dash:null},team:[],act:0,slots:1,swapCd:0,
      M:{dmg:0,hp:0,cd:1,spd:0,armor:1,regen:0,magnet:0,xp:0,crit:0,cdmg:0,er:0,em:0,ult:0,melee:0,gold:0,elb:{f:0,a:0,r:0,h:0,v:0,t:0,x:0},phoenix:0,lock:0,dice:0},
      foes:[],shots:[],ebul:[],fx:[],txt:[],gems:[],picks:[],sums:[],zones:[],tele:[],
      xp:0,lvl:1,next:5,kills:0,techs:[],tact:0,statTaken:{},relic:null,vetoed:new Set(),rerolls:(meta.g.reroll|0),vetos:(meta.g.veto|0),
      risas:0,caras:0,eye:null,resol:0,shield:0,buff:null,boss:null,bossI:0,bossDone:0,portal:null,portalFails:0,portalNext:105,arena:null,reso:false,
      weather:null,wNext:120,swarmNext:60,spawnAcc:0,chestNext:50,fountNext:90,diceT:10,phoenixT:0,judg:null,judgT:0,
      st:{ults:0,react:0,breaks:0,gf:0,chests:0,sellos:0,lumen:0,elites:0,guards:0,gold:0},msg:null,keys:{},biome:0,biomePrev:0,biomeFade:0,grid:new Map()};
    // equipo
    opts.team.forEach((id,i)=>{const c=HS_BY[id];if(!c)return;const P=(meta.ch[id]&&meta.ch[id].up)||{},cons=(meta.ch[id]&&meta.ch[id].c)|0;
      const max=Math.round((c.hp+(P.vit|0)*8)*(1+.04*cons));G.team.push({c,P,cons,alt:!!(meta.ch[id]&&meta.ch[id].alt&&meta.ch[id].useAlt),lv:{b:1,s:1,u:1},evo:false,hp:max,max,en:c.u.cost*.4,cdB:0,cdS:2+i,alive:true,combo:0,shots:0,tron:0,spin:0,bTimer:0});});
    G.slots=G.team.length;G.act=0;G.cameos=[];G.team.forEach((o,i)=>{if(i>0){const sp=HS_SUPP[o.c.role]||HS_SUPP.dps;sp.f(G.M,o.c);o.cdS=3+i*2.5;}});G.supK=meta.g.form?.8:1;
    if(G.M.hpCut){const m=G.team[0];m.max=Math.round(m.max*.8);m.hp=m.max;}
    if(meta.g.tech){const t=HS_TECH[Math.floor(Math.random()*HS_TECH.length)];G.techs.push({t,lv:1,cd:1,evo:false});}
    // lienzo
    host.innerHTML=`<div class="hs-game"><canvas class="hs-cv" tabindex="0"></canvas><div class="hs-ov" hidden></div></div>`;
    G.cv=host.querySelector('canvas');G.ov=host.querySelector('.hs-ov');G.ctx=G.cv.getContext('2d');this.resize();G.cv.focus();
    G.onRes=()=>this.resize();window.addEventListener('resize',G.onRes);
    const K=G.keys,map={arrowup:'u',w:'u',arrowdown:'d',s:'d',arrowleft:'l',a:'l',arrowright:'r',d:'r'};
    G.kd=e=>{if(!this.G||G.over&&!G.modal)return;if(e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;const k=e.key.toLowerCase();
      if(map[k]){K[map[k]]=1;e.preventDefault();e.stopPropagation();return;}
      if(G.modal){if(k==='escape'&&G.modal==='pause'){this.resume();e.preventDefault();e.stopPropagation();}else if(G.modal==='lvl'&&/^[123]$/.test(k)){const b=G.ov.querySelectorAll('[data-card]')[+k-1];if(b)b.click();e.preventDefault();e.stopPropagation();}return;}
      if(k===' '){this.ult();}else if(k==='r'){this.granFuncion();}else if(k==='tab'||k==='q'){this.cycleTech();}else if(k==='escape'||k==='p'){this.pauseMenu();}else return;
      e.preventDefault();e.stopPropagation();};
    G.ku=e=>{const k=e.key.toLowerCase();if(map[k]){K[map[k]]=0;}};
    window.addEventListener('keydown',G.kd,true);window.addEventListener('keyup',G.ku,true);
    G.blur=()=>{Object.keys(K).forEach(k=>K[k]=0);if(!G.modal&&!G.over)this.pauseMenu();};window.addEventListener('blur',G.blur);
    this.say('¡Sobrevive!',`${HS_BIOME[0].n} · Espacio: definitiva · Tab: técnica`);
    G.last=0;const frame=t=>{if(this.G!==G)return;if(!document.body.contains(G.cv)){this.stop();return;}const dt=Math.min(.05,G.last?(t-G.last)/1000:0);G.last=t;
      if(!G.pause&&!G.modal&&!G.over)this.update(dt);else if(G.over&&!G.modal)this.update(dt*.3,true);this.draw();G.raf=requestAnimationFrame(frame);};
    G.raf=requestAnimationFrame(frame);return G;},
  stop(){const G=this.G;if(!G)return;cancelAnimationFrame(G.raf);window.removeEventListener('keydown',G.kd,true);window.removeEventListener('keyup',G.ku,true);window.removeEventListener('resize',G.onRes);window.removeEventListener('blur',G.blur);this.G=null;},
  resize(){const G=this.G;if(!G)return;const r=G.host.getBoundingClientRect(),d=window.devicePixelRatio||1;G.W=Math.max(480,Math.round(r.width));G.H=Math.max(360,Math.round(Math.min(innerHeight-150,r.width*.62)));
    G.cv.style.width=G.W+'px';G.cv.style.height=G.H+'px';G.cv.width=G.W*d;G.cv.height=G.H*d;G.dpr=d;},
  say(t,sub,col){this.G.msg={t,sub,col,life:3};},
  /* ---------- miembros y daño ---------- */
  am(){return this.G.team[this.G.act];},
  farsa(){return this.G.team.some(m=>m.c.role==='farsa');},
  lead(){return this.G.team.some(m=>m.c.lead);},
  dmgOf(m,base,kind,el){const G=this.G,c=m.c,lv=kind==='u'?m.lv.u:kind==='s'?m.lv.s:kind==='b'?m.lv.b:1;let d=1.4*base*c.atk*(1+.14*(lv-1))*(1+.03*(G.lvl-1));
    d*=1+G.M.dmg+.04*(m.P.fue|0)+.1*m.cons;el=el||c.el;d*=1+(G.M.elb[el]||0);
    if(kind==='u'){d*=1+G.M.ult;if(G.eye)d*=1+c.u.cost*.0025;}
    if(G.buff)d*=1+G.buff.dmg+(G.buff.el===el?.2:0);if(G.st.altar>0)d*=1.25;
    if(this.lead()&&m===this.am())d*=1.2;
    if(c.id==='velka'&&el==='r')d*=1+Math.max(0,G.M.er+.04*(m.P.rec|0))*.4;
    if(c.id==='glacio'&&G.shield>0)d*=1.2;
    const B=HS_BIOME[G.biome];if(B.el===el)d*=1.2;
    if(G.weather){const w=HS_WEATHER[G.weather.k].m[el];if(w)d*=w;}
    return d;},
  critOf(m){const G=this.G;let cr=m.c.crit+G.M.crit+.03*(m.P.cri|0);if(m.c.id==='dado'&&G.shield>0)cr+=.12;return cr;},
  hit(e,d,el,m,src,o){const G=this.G;if(!e||e.dead||e.inv)return 0;o=o||{};m=m||this.am();let mult=1,txtc=null,crit=false;
    if(Math.random()<this.critOf(m)){crit=true;mult*=1.5+G.M.cdmg+(G.caras>0?.25:0)+(e.mark>0?.15:0);}
    // reacciones
    const R=this.react(e,el,d,m);mult*=R;
    if(e.broken>0)mult*=1.25;if(e.shred>0)mult*=1.3;if(e.mark>0)mult*=1.3;
    if(m.c.id==='brasa'&&e.burn>0)mult*=1.15;if(m.c.id==='escarcha'&&e.frozen>0)mult*=1.2;
    let dmg=d*mult;if(e.sh>0){const a=Math.min(e.sh,dmg*(1/1.0));e.sh-=a;dmg-=a*.7;}
    e.hp-=dmg;e.hitT=.12;if(e.ent)e.ent.acc+=dmg*.25;
    this.num(e.x,e.y-e.r,dmg,el,crit);
    // dureza
    if(e.tough>0&&!(e.broken>0)){const weak=e.weak.includes(el)||(e.voidWeak>0&&el==='x');const tw={b:1,s:2.5,u:8,tech:1,eye:.8,perf:6,sum:.6}[src]||1;e.tough-=(weak?1:.2)*tw*(el==='x'?1.5:1);if(e.tough<=0)this.breakFoe(e,el);}
    // energía y Risas
    if((src==='b'||src==='s'||src==='tech')&&m===this.am()){const er=1+G.M.er+.04*(m.P.rec|0);if(m.c.id==='rafaga'&&G.p.mv)m.en+=.4*er;m.en=Math.min(m.c.u.cost,m.en+(src==='b'?1:.5)*er);}
    if(crit&&this.farsa())this.addRisas(m.c.id==='pip'?.7:.35);
    if(crit&&m.c.id==='zuri')G.zuri=Math.min(.2,(G.zuri||0)+.02);
    // ojo de la tormenta
    if(G.eye&&src!=='eye'&&m===this.am()&&G.eye.cd<=0){G.eye.cd=.9;const n=G.eye.evo?2:1;for(let i=0;i<n;i++){const t=this.nearest(e.x,e.y,320,i?e:null)||e;this.bolt(G.eye.ox,G.eye.oy,t,G.eye.m);}}
    if(m.tron>0&&src==='b')G.team.forEach(o2=>{if(o2!==m&&o2.alive)o2.en=Math.min(o2.c.u.cost,o2.en+.8);});
    if(e.hp<=0)this.kill(e,m);return dmg;},
  react(e,el,d,m){const G=this.G;if(el==='x')return 1;const em=1+G.M.em;
    if(el==='v'||el==='t'){if(!e.aura)return 1;const a=e.aura.el;e.aura=null;
      if(el==='v'){this.txtAt(e.x,e.y-e.r-14,'¡Remolino!',HS_EL[a].c);this.near(e.x,e.y,100).forEach(o=>{if(o!==e&&!o.dead){o.aura={el:a,t:2.5};this.hit(o,d*.6*em,a,m,'react');}});this.ring(e.x,e.y,100,HS_EL[a].c);G.st.react++;return 1.2;}
      this.txtAt(e.x,e.y-e.r-14,'¡Cristal!',HS_EL.t.c);G.picks.push({k:'shield',x:e.x+(Math.random()-.5)*30,y:e.y+(Math.random()-.5)*30,el:a,life:12});G.st.react++;return 1.15;}
    if(!e.aura||e.aura.el===el){e.aura={el,t:2.5};return 1;}
    const key=[e.aura.el,el].sort().join(''),R=HS_REACT[key];e.aura=null;if(!R)return 1;G.st.react++;
    this.txtAt(e.x,e.y-e.r-14,R.n,'#FFFFFF');
    if(R.boom){this.ring(e.x,e.y,90,HS_EL.f.c);this.near(e.x,e.y,90).forEach(o=>{if(o!==e&&!o.dead){this.hit(o,d*.8*em,'f',m,'react');this.push(o,e.x,e.y,40);}});}
    if(R.chain){let prev=e;const hit=new Set([e]);for(let i=0;i<R.chain;i++){const n=this.nearest(prev.x,prev.y,160,null,hit);if(!n)break;hit.add(n);this.line(prev.x,prev.y,n.x,n.y,HS_EL.r.c,.25);this.hit(n,d*.5*em,'r',m,'react');prev=n;}}
    if(R.freeze){e.frozen=e.boss?0:R.freeze;if(e.boss)e.slow=Math.max(e.slow||0,2);}
    if(R.shred)e.shred=R.shred;return R.m*em;},
  breakFoe(e,el){const G=this.G;e.broken=3;G.st.breaks++;this.txtAt(e.x,e.y-e.r-26,'¡Ruptura!',HS_EL[el].c,1.3);this.ring(e.x,e.y,e.r+30,HS_EL[el].c);
    if(el==='f')e.burn=5;if(el==='h')e.frozen=e.boss?0:3;if(el==='r')e.shock=5;if(el==='a')e.slow=5;if(el==='v')this.push(e,G.p.x,G.p.y,80);if(el==='t'){e.hp-=e.max*.04;}if(el==='x')e.ent={acc:0,t:3};},
  kill(e,m){const G=this.G;if(e.dead)return;e.dead=true;
    if(e.guard){this.arenaEnd(true);return;}
    if(e.judge)return;
    G.kills++;if(this.farsa())this.addRisas(.15);
    const er=1+G.M.er,mm=this.am();if(mm)mm.en=Math.min(mm.c.u.cost,mm.en+1.4*er*(e.elite?4:1)*(e.boss?20:1));
    const v=e.boss?60:e.elite?8:e.xp||1;G.gems.push({x:e.x,y:e.y,v,big:v>=8});
    if(e.gold){G.st.sellos+=3;G.st.gold++;this.txtAt(e.x,e.y-30,'+3 sellos','#FFD84D',1.4);}
    if(e.elite&&Math.random()<.12)G.picks.push({k:'heal',x:e.x,y:e.y,life:15});
    if(e.boss)this.bossDown(e);
    if(e.role==='bomber'&&!e.fused)this.explode(e,false);},
  addRisas(n){const G=this.G;if(!this.farsa())return;let k=1;if(this.lead())k*=1.3;G.risas=Math.min(100,G.risas+n*k);},
  /* ---------- utilidades ---------- */
  gridBuild(){const G=this.G,M=G.grid;M.clear();for(const e of G.foes){if(e.dead)continue;const k=((e.x>>6)<<16)^(e.y>>6);let a=M.get(k);if(!a)M.set(k,a=[]);a.push(e);}},
  near(x,y,r){const G=this.G,out=[],x0=(x-r)>>6,x1=(x+r)>>6,y0=(y-r)>>6,y1=(y+r)>>6;for(let i=x0;i<=x1;i++)for(let j=y0;j<=y1;j++){const a=G.grid.get((i<<16)^j);if(a)for(const e of a){if(!e.dead&&(e.x-x)**2+(e.y-y)**2<=(r+e.r)**2)out.push(e);}}return out;},
  nearest(x,y,r,not,excl){let best=null,bd=1e18;const list=r>600?this.G.foes:this.near(x,y,r);for(const e of list){if(e.dead||e===not||(excl&&excl.has(e))||e.inv)continue;const d=(e.x-x)**2+(e.y-y)**2;if(d<bd&&d<=r*r*1.2){bd=d;best=e;}}return best;},
  onScreen(){const G=this.G,P=G.p;return G.foes.filter(e=>!e.dead&&Math.abs(e.x-P.x)<G.W/2+40&&Math.abs(e.y-P.y)<G.H/2+40);},
  aim(m,r){const G=this.G,t=this.nearest(G.p.x,G.p.y,r||420);if(t){const dx=t.x-G.p.x,dy=t.y-G.p.y,l=Math.hypot(dx,dy)||1;return{t,ux:dx/l,uy:dy/l};}return{t:null,ux:G.p.dir[0],uy:G.p.dir[1]};},
  push(e,x,y,f){if(e.boss||e.guard)f*=.15;const dx=e.x-x,dy=e.y-y,l=Math.hypot(dx,dy)||1;e.x+=dx/l*f;e.y+=dy/l*f;},
  num(x,y,d,el,crit){const G=this.G;if(!crit&&G.txt.length>55)return;if(G.txt.length>120)G.txt.shift();G.txt.push({x:x+(Math.random()-.5)*14,y,t:String(Math.round(d)),c:crit?'#FFE14D':HS_EL[el]?HS_EL[el].c:'#fff',life:.7,big:crit});},
  txtAt(x,y,t,c,s){this.G.txt.push({x,y,t,c,life:1.1,big:true,s:s||1});},
  ring(x,y,r,c,life){this.G.fx.push({k:'ring',x,y,r,c,life:life||.35,max:life||.35});},
  line(x1,y1,x2,y2,c,life,w){this.G.fx.push({k:'line',x1,y1,x2,y2,c,life:life||.2,max:life||.2,w:w||3});},
  bolt(x,y,t,m){const G=this.G;this.line(x,y,t.x,t.y,HS_EL.r.c,.18,3);this.ring(t.x,t.y,26,HS_EL.r.c,.2);const vm=G.eye&&G.eye.m||m;this.hit(t,this.dmgOf(vm,vm.c.s.d*(G.eye&&G.eye.evo?1.6:1)*.5,'s','r'),'r',vm,'eye');},
  /* ---------- patrones de ataque ---------- */
  fire(m,S,kind,mul){const G=this.G,P=G.p;mul=mul||1;const el=S.el||m.c.el;const D=this.dmgOf(m,S.d,kind,el)*mul*(kind==='s'&&m.evo?1.6:1),src=kind==='tech'?'tech':kind==='perf'?'perf':kind;const A=()=>this.aim(m,S.r?Math.max(S.r*1.6,220):420);
    const melee=1+G.M.melee+.2;
    switch(S.p){
      case 'arc':{const a=A(),ang=Math.atan2(a.uy,a.ux),R=(S.r||80)*1.25;this.near(P.x,P.y,R).forEach(e=>{let da=Math.atan2(e.y-P.y,e.x-P.x)-ang;da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)<=(S.ang||1.6)/2+.25||(m.lv.b>=5&&kind==='b'))this.hit(e,D*melee,el,m,src);});G.fx.push({k:'arc',x:P.x,y:P.y,r:R,a:ang,w:m.lv.b>=5&&kind==='b'?Math.PI*2:(S.ang||1.6),c:HS_EL[el].c,life:.18,max:.18});break;}
      case 'thrust':{const a=A();m.combo=(m.combo||0)+1;const big=S.combo&&m.combo%S.combo===0;const L=(S.r||110)*(big?1.6:1)*1.15,Wd=big?34:22;
        this.near(P.x+a.ux*L/2,P.y+a.uy*L/2,L/2+10).forEach(e=>{const px=e.x-P.x,py=e.y-P.y,along=px*a.ux+py*a.uy,perp=Math.abs(-px*a.uy+py*a.ux);if(along>-10&&along<L&&perp<Wd+e.r)this.hit(e,D*melee*(big?2:1),el,m,src);});
        G.fx.push({k:'thrust',x:P.x,y:P.y,ux:a.ux,uy:a.uy,L,w:Wd,c:HS_EL[el].c,life:.16,max:.16});break;}
      case 'spin':{if(S.dur&&kind==='u'){m.spin=S.dur;m.spinD=D;break;}const R=(S.r||95);this.near(P.x,P.y,R).forEach(e=>this.hit(e,D*melee,el,m,src));G.fx.push({k:'arc',x:P.x,y:P.y,r:R,a:0,w:Math.PI*2,c:HS_EL[el].c,life:.22,max:.22});break;}
      case 'shot':{const a=A();m.shots=(m.shots||0)+1;const ch=S.charge&&m.shots%S.charge===0;const n=(S.n||S.n2||1)+(m.lv.b>=5&&kind==='b'?1:0);
        for(let i=0;i<n;i++){const sp=S.spread?(i-(n-1)/2)*.22:(i-(n-1)/2)*.12,ang=Math.atan2(a.uy,a.ux)+sp;G.shots.push({x:P.x,y:P.y,vx:Math.cos(ang)*(S.spd||560),vy:Math.sin(ang)*(S.spd||560),r:ch?9:6,d:D*(ch?2.2:1),el,m,src,pierce:(S.pierce||0)+(ch?3:0),bounce:S.bounce||0,life:1.4,hitset:new Set()});}break;}
      case 'homing':{const n=(S.n||S.n2||1)+(m.lv.b>=5&&kind==='b'?1:0);for(let i=0;i<n;i++){const ang=Math.random()*7;G.shots.push({x:P.x,y:P.y-10,vx:Math.cos(ang)*200,vy:Math.sin(ang)*200,r:6,d:D,el,m,src,homing:1,life:2.4,pierce:0,hitset:new Set(),dot:S.dot});}break;}
      case 'orbit':{const n=S.n||S.n2||3;for(let i=0;i<n;i++)G.sums.push({k:'orb',a:i/n*Math.PI*2,R:72,d:D*.6,el,m,src,life:S.dur||4,cdmap:new Map()});break;}
      case 'nova':{const R=S.r||110;this.near(P.x,P.y,R).forEach(e=>{this.hit(e,D,el,m,src);if(S.slow)e.slow=Math.max(e.slow||0,2.5);});this.ring(P.x,P.y,R,HS_EL[el].c,.4);break;}
      case 'meteor':{const a=A(),tx=a.t?a.t.x:P.x+a.ux*160,ty=a.t?a.t.y:P.y+a.uy*160;G.zones.push({k:'meteor',x:tx,y:ty,r:S.r||90,t:.55,d:D,el,m,src,pet:S.petrify,burn:m.c.id==='ignis'});break;}
      case 'rain':{const n=S.n||S.n2||6,list=this.onScreen().sort(()=>Math.random()-.5);for(let i=0;i<n;i++){const t=list[i%Math.max(1,list.length)];const x=t?t.x+(Math.random()-.5)*40:P.x+(Math.random()-.5)*400,y=t?t.y+(Math.random()-.5)*40:P.y+(Math.random()-.5)*300;G.zones.push({k:'meteor',x,y,r:46,t:.35+i*.06,d:D,el,m,src,small:1});}break;}
      case 'chain':case 'chainbig':{const n=(S.n||S.n2||3)+(m.c.id==='kel'?1:0);let prev={x:P.x,y:P.y-12};const hs=new Set();for(let i=0;i<n;i++){const t=this.nearest(prev.x,prev.y,i?200:380,null,hs);if(!t)break;hs.add(t);this.line(prev.x,prev.y,t.x,t.y,HS_EL[el].c,.22,S.p==='chainbig'?5:3);this.hit(t,D,el,m,src);prev=t;}break;}
      case 'beam':{m.beam={t:S.dur||3,D,el,k:kind,tick:0};break;}
      case 'vortex':case 'vortexbig':{const a=A(),x=a.t?a.t.x:P.x+a.ux*140,y=a.t?a.t.y:P.y+a.uy*140;G.zones.push({k:'vortex',x,y,r:S.r||120,t:S.dur||1.6,d:D*.35,el,m,src,tick:0,pull:1});break;}
      case 'tornado':{G.zones.push({k:'vortex',follow:1,x:P.x,y:P.y,r:130,t:S.dur||6,d:D*.5,el,m,src,tick:0,pull:1});break;}
      case 'trail':{m.trail={t:S.dur||5,D,el,acc:0,k:kind};break;}
      case 'turret':{G.sums.push({k:'turret',x:P.x+(Math.random()-.5)*40,y:P.y+(Math.random()-.5)*40,d:D,el,m,src:'sum',life:S.dur||10,cd:0,rate:m.c.id==='chispa'?.35:.6});break;}
      case 'summon':case 'summonbig':{const big=S.p==='summonbig';G.sums.push({k:'pet',x:P.x,y:P.y,d:D,el,m,src:'sum',life:S.dur||10,cd:0,rate:(m.c.id==='nox'?.45:.6)*(big?.7:1),big});break;}
      case 'heal':{const h=S.heal||.15;G.team.forEach(o=>{if(o.alive)o.hp=Math.min(o.max,o.hp+o.max*h);});this.ring(P.x,P.y,70,'#7CFFB2',.5);this.txtAt(P.x,P.y-40,'+cura','#7CFFB2');break;}
      case 'healzone':{G.zones.push({k:'heal',follow:1,x:P.x,y:P.y,r:130,t:S.dur||8,d:D*.4,el,m,src,tick:0,heal:S.heal||.04});break;}
      case 'shield':{const v=S.d*(1+.04*(m.P.vit|0))*(m.c.id==='roca'?2:1)*(1+.14*(m.lv.s-1));G.shield=Math.max(G.shield,v*(kind==='perf'?2:1));G.shieldMax=Math.max(G.shield,G.shieldMax||0);this.ring(P.x,P.y,40,HS_EL[el].c,.5);break;}
      case 'buff':{G.buff={t:S.dur||8,dmg:.25,el:m.c.el};if(m.c.id==='rison')this.addRisas(15);this.ring(P.x,P.y,60,HS_EL[el].c,.5);break;}
      case 'dash':{const d=G.p.dir;const x0=P.x,y0=P.y;P.x+=d[0]*170;P.y+=d[1]*170;this.clampArena();P.inv=Math.max(P.inv,.3);const hs=new Set();for(let k=0;k<=8;k++){const x=x0+(P.x-x0)*k/8,y=y0+(P.y-y0)*k/8;this.near(x,y,34).forEach(e=>{if(!hs.has(e)){hs.add(e);this.hit(e,D*melee,el,m,src);}});}this.line(x0,y0,P.x,P.y,HS_EL[el].c,.25,10);break;}
      case 'mark':{const list=this.onScreen().sort((a,b)=>b.hp-a.hp).slice(0,S.n||6);list.forEach(e=>{e.mark=8;this.hit(e,D,el,m,src);});break;}
      case 'taunt':{G.shield=Math.max(G.shield,S.d*2);G.taunt=S.dur||6;this.near(P.x,P.y,200).forEach(e=>{e.slow=Math.max(e.slow||0,3);this.hit(e,D,el,m,src);});this.ring(P.x,P.y,200,HS_EL[el].c,.5);break;}
      case 'crystal':{for(let i=0;i<3;i++)G.picks.push({k:'shield',x:P.x+Math.cos(i*2.1)*60,y:P.y+Math.sin(i*2.1)*60,el:'t',life:14});this.near(P.x,P.y,160).forEach(e=>this.hit(e,D,el,m,src));this.ring(P.x,P.y,160,HS_EL.t.c,.4);break;}
      case 'wave':{const a=A();G.shots.push({x:P.x,y:P.y,vx:a.ux*380,vy:a.uy*380,r:46,d:D,el,m,src,pierce:999,life:1.3,hitset:new Set(),wave:1});break;}
      case 'boomerang':{const a=A();G.shots.push({x:P.x,y:P.y,vx:a.ux*480,vy:a.uy*480,r:12,d:D,el,m,src,pierce:999,life:1.5,hitset:new Set(),boom:1,age:0,spin:0});break;}
      case 'mine':{G.zones.push({k:'mine',x:P.x,y:P.y,r:70,t:20,d:D,el,m,src,arm:.6});break;}
      case 'slash':case 'judgment':{const a=A(),L=Math.hypot(G.W,G.H);const x0=P.x-a.ux*L/2,y0=P.y-a.uy*L/2;
        this.onScreen().forEach(e=>{const px=e.x-x0,py=e.y-y0,perp=Math.abs(-px*a.uy+py*a.ux);if(perp<70+e.r)this.hit(e,D,el,m,src);});
        G.fx.push({k:'slash',x:P.x,y:P.y,ux:a.ux,uy:a.uy,L,c:HS_EL[el].c,life:.55,max:.55});G.shake=.35;
        if(S.p==='judgment'){m.tron=S.dur||7;this.say('Modo Tronante','Su básico corta de lejos y recarga al equipo',HS_EL.r.c);}break;}
      case 'stars':{const n=S.n||12;for(let i=0;i<n;i++){const ang=i/n*Math.PI*2;G.shots.push({x:P.x,y:P.y,vx:Math.cos(ang)*460,vy:Math.sin(ang)*460,r:8,d:D,el,m,src,pierce:1,bounce:3,life:2,hitset:new Set(),star:1});}break;}
      case 'erase':{G.ebul=[];this.onScreen().forEach(e=>{e.voidWeak=10;this.hit(e,D,el,m,src);});G.fx.push({k:'flash',c:HS_EL.x.c,life:.4,max:.4});break;}
      case 'dice':{const roll=1+Math.floor(Math.random()*6);this.txtAt(P.x,P.y-60,'🎲 ×'+roll,'#FFE14D',2);this.onScreen().forEach(e=>this.hit(e,D*roll,el,m,src));G.fx.push({k:'flash',c:HS_EL.t.c,life:.3,max:.3});break;}
      case 'confetti':{this.onScreen().forEach(e=>this.hit(e,D,el,m,src));this.addRisas(25);for(let i=0;i<40;i++)G.fx.push({k:'conf',x:P.x+(Math.random()-.5)*G.W,y:P.y-G.H/2-Math.random()*100,vy:120+Math.random()*120,c:['#F06BC8','#FFC93C','#5FE3B2','#8BE6FF'][i%4],life:2,max:2});break;}
      case 'detonate':{this.onScreen().forEach(e=>{const dots=(e.dots||[]).reduce((s,o)=>s+o.dps*o.t,0)+(e.burn>0?e.burn*8:0);e.dots=[];this.hit(e,D+dots*1.5,el,m,src);});G.fx.push({k:'flash',c:HS_EL.x.c,life:.35,max:.35});break;}
      case 'eye':{G.eye={t:(S.dur||25),cd:0,m,evo:m.evo,ox:P.x,oy:P.y-80};this.ring(P.x,P.y-80,30,HS_EL.r.c,.5);break;}
      case 'wave2':break;
    }},
  /* ---------- acciones del jugador ---------- */
  swap(){}, // ya no se cambia de personaje: hay 1 principal y 2 apoyos
  ult(){const G=this.G,m=this.am();if(!m||!m.alive||m.en<m.c.u.cost)return;m.en=0;G.st.ults++;
    let mul=1;if(m.c.id==='velka'){mul*=1+G.resol*.03;G.resol=0;}else if(G.team.some(o=>o.c.id==='velka'))G.resol=Math.min(60,G.resol+m.c.u.cost/5);
    this.addRisas(10);this.fire(m,m.c.u,'u',mul);G.cut={c:m.c,life:.6,max:.6,alt:m.alt};},
  cycleTech(){const G=this.G;if(G.techs.length<2)return;G.tact=(G.tact+1)%G.techs.length;},
  granFuncion(){const G=this.G;if(G.risas<100||!this.farsa())return;G.risas=0;G.st.gf++;G.slowT=1.5;G.ebul=[];
    G.team.forEach(o=>{o.debuff=0;});const lead=this.lead();
    G.fx.push({k:'mask',life:1.6,max:1.6});
    const performers=G.team.filter(o=>o.c.role==='farsa');
    performers.forEach((o,i)=>{setTimeout(()=>{if(this.G!==G)return;this.fire(o,{...o.c.u,d:o.c.u.d*1.5},'perf',lead?2:1);this.txtAt(G.p.x,G.p.y-90-i*20,o.c.n+'!',HS_EL[o.c.el].c,1.2);},150+i*220);});
    G.caras=10+(lead?3:0);this.say('¡Gran Función!',`${performers.length} actúa${performers.length>1?'n':''} a la vez`,'#F06BC8');},
  /* ---------- bucle ---------- */
  update(dt,dead){const G=this.G;if(G.slowT>0){G.slowT-=dt;dt*=.2;}G.t+=dead?0:dt;const P=G.p;
    if(dead){this.updFx(dt);return;}
    this.gridBuild();
    // bioma
    const bi=Math.floor(G.t/240)%HS_BIOME.length;if(bi!==G.biome){G.biomePrev=G.biome;G.biome=bi;G.biomeFade=2.6;this.say(HS_BIOME[bi].n,'Nuevo bioma');}if(G.biomeFade>0)G.biomeFade-=dt;
    // movimiento
    const K=G.keys,m=this.am();let dx=(K.r|0)-(K.l|0),dy=(K.d|0)-(K.u|0);const l=Math.hypot(dx,dy);P.mv=l>0;
    if(l){dx/=l;dy/=l;P.dir=[dx,dy];if(dx)P.face=dx>0?1:-1;}
    let spd=150*(1+G.M.spd+.03*(m.P.zan|0)+(G.caras>0?.15:0)+(G.zuri||0));if(G.weather&&G.weather.k==='nieve')spd*=.9;if(G.arena&&G.arena.hz==='water'){const A=G.arena;if(Math.hypot(P.x-A.cx,P.y-A.cy)>A.R*.55)spd*=.7;}
    P.x+=dx*spd*dt;P.y+=dy*spd*dt;this.clampArena();if(P.inv>0)P.inv-=dt;
    // equipo
    G.team.forEach((o,i)=>{const on=i===0;if(on){o.hp=Math.min(o.max,o.hp+o.max*(G.M.regen+.002*(o.P.sin|0))*dt);}
      o.cdS=Math.max(0,o.cdS-dt);o.cdB=Math.max(0,o.cdB-dt);if(o.tron>0)o.tron-=dt;if(o.spin>0){o.spin-=dt;o.spinT=(o.spinT||0)-dt;if(o.spinT<=0){o.spinT=.32;this.near(P.x,P.y,110).forEach(e=>this.hit(e,o.spinD,o.c.el,o,'u'));G.fx.push({k:'arc',x:P.x,y:P.y,r:110,a:G.t*8,w:Math.PI*2,c:HS_EL[o.c.el].c,life:.2,max:.2});}}
      if(o.beam){o.beam.t-=dt;o.beam.tick-=dt;if(o.beam.tick<=0){o.beam.tick=.12;const a=this.aim(o,520);G.fx.push({k:'thrust',x:P.x,y:P.y,ux:a.ux,uy:a.uy,L:520,w:12,c:HS_EL[o.beam.el].c,life:.13,max:.13});this.onScreen().forEach(e=>{const px=e.x-P.x,py=e.y-P.y,al=px*a.ux+py*a.uy,pp=Math.abs(-px*a.uy+py*a.ux);if(al>0&&al<520&&pp<16+e.r)this.hit(e,o.beam.D,o.beam.el,o,o.beam.k);});}if(o.beam.t<=0)o.beam=null;}
      if(o.trail){o.trail.t-=dt;o.trail.acc-=dt;if(o.trail.acc<=0){o.trail.acc=.22;G.zones.push({k:'pool',x:P.x,y:P.y,r:34,t:2.2,d:o.trail.D*.35,el:o.trail.el,m:o,src:o.trail.k,tick:0});}if(o.trail.t<=0)o.trail=null;}
      if(!on){ // apoyo: de vez en cuando aparece y hace su ataque extra
        if(o.cdS<=0&&this.nearest(P.x,P.y,480)){o.cdS=Math.max(5,o.c.s.cd*1.35)*G.M.cd*G.supK*(1-.07*(o.lv.s-1));let S=o.c.s;if(S.p==='dash')S={...S,p:'spin',r:130};
          this.fire(o,S,'s',1+.15*(o.lv.s-1));if(o.c.role==='farsa')this.addRisas(3);G.cameos.push({c:o.c,alt:o.alt,side:i===1?-1:1,life:1.1,max:1.1});this.ring(P.x+(i===1?-46:46),P.y-10,26,HS_EL[o.c.el].c,.35);}
        return;}
      const cdk=G.M.cd*(1-.03*(o.P.ref|0));
      if(o.cdB<=0){if(o.tron>0){o.cdB=.3*cdk;const a=this.aim(o,300);const L=270;this.near(P.x+a.ux*L/2,P.y+a.uy*L/2,L/2+20).forEach(e=>{const px=e.x-P.x,py=e.y-P.y,al=px*a.ux+py*a.uy,pp=Math.abs(-px*a.uy+py*a.ux);if(al>-10&&al<L&&pp<34+e.r)this.hit(e,this.dmgOf(o,o.c.b.d*1.6,'b','r')*(1+G.resol*.015),'r',o,'b');});G.fx.push({k:'thrust',x:P.x,y:P.y,ux:a.ux,uy:a.uy,L,w:30,c:'#E6D2FF',life:.15,max:.15});}
        else{o.cdB=o.c.b.cd*cdk;this.fire(o,o.c.b,'b');}}
      if(o.cdS<=0&&this.nearest(P.x,P.y,500)){o.cdS=o.c.s.cd*cdk*(o.evo?.8:1);this.fire(o,o.c.s,'s');if(o.c.role==='farsa')this.addRisas(3);}});
    if(G.cameos.length)G.cameos=G.cameos.filter(c=>(c.life-=dt)>0);
    // técnicas
    G.techs.forEach((T,i)=>{T.cd-=dt;if((G.reso||i===G.tact)&&T.cd<=0&&this.nearest(P.x,P.y,520)){T.cd=T.t.cd*G.M.cd*(T.evo?.75:1);const S={...T.t,d:T.t.d*(1+.25*(T.lv-1))*(T.evo?1.8:1),n:(T.t.n2||1)+(T.evo?2:0),el:T.t.el};this.fire(this.am(),S,'tech');}});
    // estados
    if(G.eye){G.eye.t-=dt;G.eye.cd-=dt;G.eye.ox+=(P.x-G.eye.ox)*Math.min(1,dt*6);G.eye.oy+=(P.y-80-G.eye.oy)*Math.min(1,dt*6);if(G.eye.t<=0)G.eye=null;}
    if(G.buff){G.buff.t-=dt;if(G.buff.t<=0)G.buff=null;}if(G.caras>0)G.caras-=dt;if(G.taunt>0)G.taunt-=dt;if(G.st.altar>0)G.st.altar-=dt;
    if(G.M.dice){G.diceT-=dt;if(G.diceT<=0){G.diceT=10;const r=Math.floor(Math.random()*4);if(r===0)G.team.forEach(o=>o.alive&&(o.hp=Math.min(o.max,o.hp+o.max*.2)));if(r===1)G.team.forEach(o=>o.en=Math.min(o.c.u.cost,o.en+20));if(r===2)this.addRisas(30);if(r===3)this.onScreen().forEach(e=>this.hit(e,40+G.t/10,'x',this.am(),'perf'));this.txtAt(P.x,P.y-50,['🎲 ¡Cura!','🎲 ¡Energía!','🎲 ¡Risas!','🎲 ¡Daño!'][r],'#FFE14D');}}
    if(G.phoenixT>0)G.phoenixT-=dt;
    // clima
    if(!G.arena)this.weather(dt);
    // aparición
    if(!G.arena)this.spawn(dt);
    // enemigos
    this.updFoes(dt);
    this.updShots(dt);this.updZones(dt);this.updSums(dt);this.updPicks(dt);this.updFx(dt);
    if(G.msg){G.msg.life-=dt;if(G.msg.life<=0)G.msg=null;}if(G.shake>0)G.shake-=dt;
    // portal
    this.portalTick(dt);
    if(G.arena){G.arena.t-=dt;G.arena.hzT-=dt;if(G.arena.hzT<=0)this.arenaHazard();if(G.arena.t<=0)this.arenaEnd(false);}
    // subir de nivel
    if(G.xp>=G.next&&!G.modal){G.xp-=G.next;G.lvl++;G.next=this.nextXp(G.lvl);this.levelUp();}},
  nextXp(l){return Math.round(5+l*3.2+Math.pow(l,1.55)*.6);},
  clampArena(){const G=this.G,P=G.p,A=G.arena;if(!A)return;const dx=P.x-A.cx,dy=P.y-A.cy,l=Math.hypot(dx,dy);if(l>A.R-16){P.x=A.cx+dx/l*(A.R-16);P.y=A.cy+dy/l*(A.R-16);}},
  weather(dt){const G=this.G;if(G.weather){G.weather.t-=dt;const W=HS_WEATHER[G.weather.k];
      if(W.bolts){G.weather.b=(G.weather.b||0)-dt;if(G.weather.b<=0){G.weather.b=1.4;const t=this.onScreen()[Math.floor(Math.random()*30)];if(t){this.line(t.x,t.y-400,t.x,t.y,'#E6D2FF',.25,4);t.aura={el:'r',t:2.5};this.hit(t,20+G.t/12,'r',this.am(),'react');}}}
      if(W.wet){G.weather.w=(G.weather.w||0)-dt;if(G.weather.w<=0){G.weather.w=2;this.onScreen().forEach(e=>{if(!e.aura)e.aura={el:'a',t:2.5};});}}
      if(W.sand){G.weather.s=(G.weather.s||0)-dt;if(G.weather.s<=0){G.weather.s=2;const m=this.am();if(!['t'].includes(m.c.el))m.hp=Math.max(1,m.hp-m.max*.012);}}
      if(G.weather.t<=0){G.weather=null;}}
    else if(G.t>=G.wNext){G.wNext+=60;if(Math.random()<.18){const ks=Object.keys(HS_WEATHER),k=ks[Math.floor(Math.random()*ks.length)];G.weather={k,t:60};this.say(HS_WEATHER[k].n,'Cambia el clima');}}},
  spawn(dt){const G=this.G,P=G.p,t=G.t,min=t/60;
    // jefes
    const B=HS_BOSS[G.bossI];if(B&&t>=B.at&&!G.boss){G.bossI++;this.spawnBoss(B);}
    if(t>=1800&&!G.judg){G.judg=1;this.spawnJudge();}
    if(G.judg){G.judgT-=dt;if(G.judgT<=0){G.judgT=5;G.judgN=(G.judgN||0)+1;const k=Math.pow(2,G.judgN);this.addFoe(HS_FOES[3],{hpK:k*8,dmgK:k,elite:1,col:'#F06BC8'});}}
    const alive=G.foes.length;let rate=(1.3+min*.62+Math.pow(min,1.25)*.05);if(G.boss)rate*=.25;
    G.spawnAcc+=rate*dt;while(G.spawnAcc>=1){G.spawnAcc--;if(alive<280)this.addFoe(this.pickFoe());else if(Math.random()<.3)this.addFoe(this.pickFoe(),{elite:1});}
    // élites
    if(min>1.5&&Math.random()<dt*(.04+min*.006)&&!G.boss)this.addFoe(this.pickFoe(),{elite:1});
    // enjambres
    if(t>=G.swarmNext&&!G.boss){G.swarmNext=t+45;const n=Math.min(70,22+Math.floor(t/20)),f=this.pickFoe(true);for(let i=0;i<n;i++){const a=i/n*Math.PI*2,R=Math.max(G.W,G.H)/2+40;this.addFoe(f,{x:P.x+Math.cos(a)*R,y:P.y+Math.sin(a)*R});}this.say('¡Enjambre!','Te rodean',"#FF8A8A");}
    // cofres y fuentes
    if(t>=G.chestNext){G.chestNext=t+65;if(G.picks.filter(p=>p.k==='chest').length<2){const a=Math.random()*7,R=280+Math.random()*220;const rich=Math.random()<.22;G.picks.push({k:'chest',x:P.x+Math.cos(a)*R,y:P.y+Math.sin(a)*R,rich,open:0,life:999});}}
    if(t>=G.fountNext){G.fountNext=t+80+Math.random()*40;const a=Math.random()*7,R=300+Math.random()*200;G.picks.push({k:Math.random()<.5?'fount':'altar',x:P.x+Math.cos(a)*R,y:P.y+Math.sin(a)*R,life:60});}},
  pickFoe(sw){const G=this.G,min=G.t/60;const pool=HS_FOES.filter(f=>{if(f.id==='slime'||f.id==='imp')return true;if(f.id==='bat')return min>=.6;if(f.id==='golem')return min>=2;if(f.role==='shooter')return min>=1.2;if(f.role==='bomber')return min>=1.6;if(f.role)return min>=1.17;return true;});
    if(sw)return pool.filter(f=>!f.role||f.role==='runner')[Math.floor(Math.random()*3)]||pool[0];return pool[Math.floor(Math.random()*pool.length)];},
  addFoe(F,o){const G=this.G,P=G.p;o=o||{};const min=G.t/60;let x=o.x,y=o.y;if(x==null){const a=Math.random()*Math.PI*2,R=Math.hypot(G.W,G.H)/2+30;x=P.x+Math.cos(a)*R;y=P.y+Math.sin(a)*R;}
    const k=(1+min*.36+Math.pow(min,1.6)*.03)*(o.hpK||1);const elite=!!o.elite,gold=elite&&Math.random()<1/4096*40;
    const els=Object.keys(HS_EL),el=Math.random()<.35?els[Math.floor(Math.random()*6)]:null;const B=HS_BIOME[G.biome];
    const col=o.col||(el?HS_EL[el].c:B.d[0]);
    const e={x,y,r:F.r*(elite?1.5:1),hp:F.hp*k*(elite?4:1),max:0,spd:F.spd*(elite?.85:1)*(.9+Math.random()*.2),dmg:F.dmg*(.75+min*.14)*(o.dmgK||1)*(elite?1.25:1),shape:F.shape,role:F.role,col,col2:'#FFE14D',el,elite,gold,
      atkCd:0,cd:2+Math.random()*2,xp:elite?8:1,tough:elite?28:0,toughMax:elite?28:0,weak:elite?this.weak2():[],aura:null,dots:[]};e.max=e.hp;if(gold){e.hp*=2;e.max*=2;e.xp*=5;}if(elite)G.st.elites++;G.foes.push(e);return e;},
  weak2(){const k=Object.keys(HS_EL).sort(()=>Math.random()-.5);return k.slice(0,2);},
  spawnBoss(B){const G=this.G,P=G.p,a=Math.random()*7;const e=this.addFoe({hp:B.hp,spd:58,dmg:22,r:B.r,shape:B.shape},{x:P.x+Math.cos(a)*380,y:P.y+Math.sin(a)*380,col:B.col});
    Object.assign(e,{hp:B.hp*(1+G.lvl*.02),max:B.hp*(1+G.lvl*.02),boss:B,col2:B.col2,tough:B.tough,toughMax:B.tough,weak:B.weak,el:B.el,elite:false,acd:2.5,phase:1});G.boss=e;this.say(B.n,'¡Jefe!',B.col);},
  spawnJudge(){const G=this.G,e=this.addFoe({hp:1,spd:20,dmg:40,r:60,shape:'mask'},{x:G.p.x,y:G.p.y-300,col:'#F06BC8'});e.inv=1;e.judge=1;e.hp=e.max=1e9;this.say('El Juicio del Telón','Ya no se puede ganar: aguanta lo que puedas','#F06BC8');},
  bossDown(e){const G=this.G;G.boss=null;G.bossDone++;G.st.sellos+=1;if(Math.random()<1/3)G.st.sellos+=3;G.st.lumen+=80;this.txtAt(e.x,e.y-60,'¡Jefe vencido!','#FFE14D',1.6);
    if(e.boss.final&&!G.won){G.won=true;this.say('¡Partida completada!','Puedes seguir jugando hasta el minuto 30','#FFE14D');}
    this.relicOffer(HS_RELIC[Math.floor(Math.random()*HS_RELIC.length)]);},
  explode(e,warn){const G=this.G;this.ring(e.x,e.y,72,'#FF8A3D',.35);const P=G.p;if(Math.hypot(P.x-e.x,P.y-e.y)<72)this.hurt(e.dmg);this.near(e.x,e.y,72).forEach(o=>{if(o!==e&&!o.boss)o.hp-=e.dmg*2;if(o.hp<=0&&!o.dead)this.kill(o,this.am());});e.dead=true;},
  updFoes(dt){const G=this.G,P=G.p;let nf=[];
    for(const e of G.foes){if(e.dead)continue;
      if(e.aura){e.aura.t-=dt;if(e.aura.t<=0)e.aura=null;}if(e.hitT>0)e.hitT-=dt;['mark','shred','voidWeak','slow'].forEach(k=>{if(e[k]>0)e[k]-=dt;});
      if(e.broken>0){e.broken-=dt;if(e.broken<=0){e.tough=e.toughMax;}}
      e.dotT=(e.dotT||0)-dt;if(e.dotT<=0){e.dotT=.5;let d=0;if(e.burn>0){d+=6+G.t/30;e.burn-=.5;}if(e.shock>0){d+=5+G.t/30;e.shock-=.5;}(e.dots||[]).forEach(o=>{d+=o.dps*.5;o.t-=.5;});e.dots=(e.dots||[]).filter(o=>o.t>0);if(d>0){e.hp-=d;this.num(e.x,e.y-e.r,d,e.burn>0?'f':'x',false);if(e.hp<=0){this.kill(e,this.am());continue;}}}
      if(e.ent){e.ent.t-=dt;if(e.ent.t<=0){const d=e.ent.acc;e.ent=null;if(d>0){e.hp-=d;this.num(e.x,e.y-e.r,d,'x',true);if(e.hp<=0){this.kill(e,this.am());continue;}}}}
      if(e.frozen>0){e.frozen-=dt;nf.push(e);continue;}if(e.broken>0){nf.push(e);continue;}
      const dx=P.x-e.x,dy=P.y-e.y,l=Math.hypot(dx,dy)||1;let sp=e.spd*(e.slow>0?.5:1)*(G.weather&&G.weather.k==='nieve'?.9:1);
      if(e.boss||e.guard){this.bossAI(e,dt,dx,dy,l);}
      else if(e.role==='shooter'&&l<280){e.cd-=dt;if(e.cd<=0){e.cd=2.2;G.ebul.push({x:e.x,y:e.y,vx:dx/l*190,vy:dy/l*190,r:6,d:e.dmg,life:4,c:'#FF8A8A'});}sp*=-.4;}
      else if(e.role==='healer'){e.cd-=dt;if(e.cd<=0){e.cd=3.5;this.near(e.x,e.y,150).forEach(o=>{o.hp=Math.min(o.max,o.hp+o.max*.07);});this.ring(e.x,e.y,150,'#7CFFB2',.4);}}
      else if(e.role==='shielder'){e.cd-=dt;if(e.cd<=0){e.cd=6;this.near(e.x,e.y,160).slice(0,6).forEach(o=>{o.sh=o.max*.3;});this.ring(e.x,e.y,160,'#8BE6FF',.4);}}
      else if(e.role==='summoner'){e.cd-=dt;if(e.cd<=0){e.cd=6;if(G.foes.length<280)for(let i=0;i<2;i++)this.addFoe(HS_FOES[0],{x:e.x+(Math.random()-.5)*50,y:e.y+(Math.random()-.5)*50});}}
      else if(e.role==='bomber'&&l<55&&!e.fused){e.fused=1;e.fuse=1;}
      if(e.fused){e.fuse-=dt;sp=0;if(e.fuse<=0){this.explode(e);continue;}}
      if(G.taunt>0)sp*=.6;
      if(!e.boss&&!e.guard){e.x+=dx/l*sp*dt;e.y+=dy/l*sp*dt;}
      // separación ligera
      const ns=this.near(e.x,e.y,e.r);for(let i=0;i<ns.length&&i<4;i++){const o=ns[i];if(o===e)continue;const ox=e.x-o.x,oy=e.y-o.y,ol=Math.hypot(ox,oy)||1,ov=(e.r+o.r)-ol;if(ov>0){const f=ov*.3;e.x+=ox/ol*f;e.y+=oy/ol*f;}}
      e.atkCd-=dt;if(l<e.r+14&&e.atkCd<=0&&!e.judge){e.atkCd=.8;this.hurt(e.dmg);}
      if(l>1600&&!e.boss&&!e.guard)continue; // muy lejos: desaparece
      nf.push(e);}
    G.foes=nf;
    // balas enemigas
    G.ebul=G.ebul.filter(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(Math.hypot(b.x-P.x,b.y-P.y)<b.r+12){this.hurt(b.d);return false;}return b.life>0;});
    // avisos (zonas telegrafiadas de jefes)
    G.tele=G.tele.filter(z=>{z.t-=dt;if(z.t<=0){if(z.k==='circle'){if(Math.hypot(P.x-z.x,P.y-z.y)<z.r)this.hurt(z.d);this.ring(z.x,z.y,z.r,z.c,.3);}
      if(z.k==='line'){const px=P.x-z.x,py=P.y-z.y,al=px*z.ux+py*z.uy,pp=Math.abs(-px*z.uy+py*z.ux);if(al>0&&al<z.L&&pp<z.w)this.hurt(z.d);G.fx.push({k:'thrust',x:z.x,y:z.y,ux:z.ux,uy:z.uy,L:z.L,w:z.w,c:z.c,life:.3,max:.3});}
      if(z.k==='charge'&&z.e&&!z.e.dead){z.e.dash={ux:z.ux,uy:z.uy,t:.55,sp:z.L/.55};}return false;}return true;});},
  bossAI(e,dt,dx,dy,l){const G=this.G,P=G.p,B=e.boss||e.gd;const ph=e.hp/e.max<.25?3:e.hp/e.max<.5?2:1;if(ph!==e.phase){e.phase=ph;this.txtAt(e.x,e.y-e.r-30,'¡Fase '+ph+'!',B.col||'#fff',1.4);}
    if(e.dash){e.dash.t-=dt;e.x+=e.dash.ux*e.dash.sp*dt;e.y+=e.dash.uy*e.dash.sp*dt;if(Math.hypot(P.x-e.x,P.y-e.y)<e.r+14&&e.atkCd<=0){e.atkCd=.6;this.hurt(e.dmg*1.4);}if(e.dash.t<=0)e.dash=null;return;}
    if(l>e.r+30){const sp=e.spd*(e.slow>0?.5:1);e.x+=dx/l*sp*dt;e.y+=dy/l*sp*dt;}
    if(e.guard&&G.arena){const A=G.arena,ax=e.x-A.cx,ay=e.y-A.cy,al=Math.hypot(ax,ay);if(al>A.R-e.r){e.x=A.cx+ax/al*(A.R-e.r);e.y=A.cy+ay/al*(A.R-e.r);}}
    e.acd-=dt;if(e.acd>0)return;e.acd=[0,2.4,1.8,1.3][ph];const list=(e.boss?e.boss.atk:['ring','slam','charge','shards']);const k=list[Math.floor(Math.random()*list.length)],c=e.col2||'#fff',d=e.dmg;
    if(k==='slam'){G.tele.push({k:'circle',x:P.x,y:P.y,r:110,t:1,d:d*1.3,c});}
    if(k==='rainf'){for(let i=0;i<5+ph;i++)G.tele.push({k:'circle',x:P.x+(Math.random()-.5)*360,y:P.y+(Math.random()-.5)*260,r:70,t:.9+i*.08,d,c});}
    if(k==='charge'){const ux=dx/l,uy=dy/l;G.tele.push({k:'charge',x:e.x,y:e.y,ux,uy,L:Math.min(520,l+160),w:e.r,t:.8,d,c,e});}
    if(k==='laser'){const ux=dx/l,uy=dy/l;G.tele.push({k:'line',x:e.x,y:e.y,ux,uy,L:900,w:22,t:1,d:d*1.4,c});}
    if(k==='ring'||k==='wave'){const n=k==='wave'?28:14+ph*4,sp=k==='wave'?130:170;for(let i=0;i<n;i++){const a=i/n*Math.PI*2+G.t;G.ebul.push({x:e.x,y:e.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:k==='wave'?10:7,d:d*.6,life:5,c});}}
    if(k==='shards'){const a0=Math.atan2(dy,dx);for(let i=-2;i<=2;i++){const a=a0+i*.18;G.ebul.push({x:e.x,y:e.y,vx:Math.cos(a)*260,vy:Math.sin(a)*260,r:7,d:d*.7,life:4,c});}}},
  hurt(d){const G=this.G,P=G.p,m=this.am();if(P.inv>0||!m)return;let dd=d*G.M.armor*(1-.02*(m.P.arm|0));if(m.tron>0)dd*=.7;if(m.spin>0&&m.c.id==='cendra')dd*=.85;
    if(G.shield>0){const a=Math.min(G.shield,dd);G.shield-=a;dd-=a;}P.inv=.5;if(dd<=0)return;m.hp-=dd;G.hurtT=.25;
    if(m.hp<=0){if(G.M.phoenix&&G.phoenixT<=0){G.phoenixT=60;m.hp=m.max*.4;P.inv=2;this.say('Pluma de ave fénix','¡Te has salvado!','#FFC93C');return;}
      m.hp=0;
      if(G.arena){this.arenaEnd(false,true);}else this.gameOver();}},
  updShots(dt){const G=this.G,P=G.p;G.shots=G.shots.filter(s=>{s.life-=dt;if(s.homing){const t=this.nearest(s.x,s.y,400);if(t){const dx=t.x-s.x,dy=t.y-s.y,l=Math.hypot(dx,dy)||1;s.vx+=(dx/l*520-s.vx)*Math.min(1,dt*5);s.vy+=(dy/l*520-s.vy)*Math.min(1,dt*5);}}
      if(s.boom){s.age+=dt;if(s.age>.55){const dx=P.x-s.x,dy=P.y-s.y,l=Math.hypot(dx,dy)||1;s.vx=dx/l*520;s.vy=dy/l*520;if(l<20)return false;s.hitset.clear&&s.age>.56&&!s.cl&&(s.cl=1,s.hitset.clear());}s.spin+=dt*20;}
      s.x+=s.vx*dt;s.y+=s.vy*dt;
      const hits=this.near(s.x,s.y,s.r);for(const e of hits){if(s.hitset.has(e))continue;s.hitset.add(e);this.hit(e,s.d,s.el,s.m,s.src);if(s.dot)(e.dots=e.dots||[]).push({dps:s.d*.4,t:3});
        if(s.bounce>0){s.bounce--;const n=this.nearest(s.x,s.y,260,e,s.hitset);if(n){const dx=n.x-s.x,dy=n.y-s.y,l=Math.hypot(dx,dy)||1,sp=Math.hypot(s.vx,s.vy);s.vx=dx/l*sp;s.vy=dy/l*sp;}continue;}
        if(s.pierce>0){s.pierce--;continue;}return false;}
      return s.life>0;});},
  updZones(dt){const G=this.G,P=G.p;G.zones=G.zones.filter(z=>{z.t-=dt;if(z.follow){z.x=P.x;z.y=P.y;}
      if(z.k==='meteor'){if(z.t<=0){this.near(z.x,z.y,z.r).forEach(e=>{this.hit(e,z.d,z.el,z.m,z.src);if(z.pet){e.frozen=e.boss?0:z.pet;}});this.ring(z.x,z.y,z.r,HS_EL[z.el].c,.35);if(!z.small)G.shake=.2;if(z.burn)G.zones.push({k:'pool',x:z.x,y:z.y,r:z.r*.7,t:3,d:z.d*.12,el:'f',m:z.m,src:'sum',tick:0});return false;}return true;}
      if(z.k==='mine'){z.arm-=dt;if(z.arm<=0&&this.near(z.x,z.y,26).length){this.near(z.x,z.y,z.r).forEach(e=>this.hit(e,z.d,z.el,z.m,z.src));this.ring(z.x,z.y,z.r,HS_EL[z.el].c,.3);return false;}return z.t>0;}
      z.tick-=dt;if(z.tick<=0){z.tick=.3;const L=this.near(z.x,z.y,z.r);L.forEach(e=>{this.hit(e,z.d,z.el,z.m,z.src);if(z.pull){const dx=z.x-e.x,dy=z.y-e.y,l=Math.hypot(dx,dy)||1;if(!e.boss&&!e.guard){e.x+=dx/l*18;e.y+=dy/l*18;}}});
        if(z.k==='heal'){const m=this.am();m.hp=Math.min(m.max,m.hp+m.max*z.heal*.3);}}
      return z.t>0;});},
  updSums(dt){const G=this.G,P=G.p;G.sums=G.sums.filter(s=>{s.life-=dt;
      if(s.k==='orb'){s.a+=dt*3.2;s.x=P.x+Math.cos(s.a)*s.R;s.y=P.y+Math.sin(s.a)*s.R;this.near(s.x,s.y,14).forEach(e=>{const t=s.cdmap.get(e)||0;if(G.t-t>.45){s.cdmap.set(e,G.t);this.hit(e,s.d,s.el,s.m,'sum');}});}
      if(s.k==='turret'){s.cd-=dt;if(s.cd<=0){const t=this.nearest(s.x,s.y,380);if(t){s.cd=s.rate;const dx=t.x-s.x,dy=t.y-s.y,l=Math.hypot(dx,dy)||1;G.shots.push({x:s.x,y:s.y-14,vx:dx/l*560,vy:dy/l*560,r:5,d:s.d,el:s.el,m:s.m,src:'sum',pierce:0,life:1,hitset:new Set()});}}}
      if(s.k==='pet'){const t=this.nearest(s.x,s.y,360);const tx=t?t.x:P.x-30,ty=t?t.y:P.y+20,dx=tx-s.x,dy=ty-s.y,l=Math.hypot(dx,dy)||1;const sp=t?260:200;if(l>18){s.x+=dx/l*sp*dt;s.y+=dy/l*sp*dt;}
        s.cd-=dt;if(t&&l<40&&s.cd<=0){s.cd=s.rate;this.near(s.x,s.y,s.big?70:44).forEach(e=>this.hit(e,s.d,s.el,s.m,'sum'));G.fx.push({k:'arc',x:s.x,y:s.y,r:s.big?70:44,a:0,w:Math.PI*2,c:HS_EL[s.el].c,life:.15,max:.15});}}
      return s.life>0;});},
  updPicks(dt){const G=this.G,P=G.p,m=this.am(),mag=95*(1+G.M.magnet+.12*(m.P.ima|0));
    G.gems=G.gems.filter(g=>{const dx=P.x-g.x,dy=P.y-g.y,l=Math.hypot(dx,dy);g.age=(g.age||0)+dt;if(l<mag||g.pull||g.age>18){g.pull=1;g.x+=dx/l*480*dt;g.y+=dy/l*480*dt;}if(l<16){const sab=G.team.reduce((s,o)=>s+(o.P.sab|0),0)/Math.max(1,G.team.length);G.xp+=g.v*(1+G.M.xp+.05*sab);return false;}return l<2000;});
    if(G.gems.length>400){const keep=G.gems.slice(-300),lost=G.gems.slice(0,-300).reduce((s,g)=>s+g.v,0);G.gems=keep;if(keep[0])keep[0].v+=lost;}
    G.picks=G.picks.filter(p=>{p.life-=dt;const l=Math.hypot(P.x-p.x,P.y-p.y);
      if(p.k==='shield'&&l<26){G.shield=Math.max(G.shield,0)+30+G.t/12;G.shieldMax=Math.max(G.shieldMax||0,G.shield);this.txtAt(p.x,p.y-20,'+escudo',HS_EL.t.c);return false;}
      if(p.k==='heal'&&l<26){G.team.forEach(o=>o.alive&&(o.hp=Math.min(o.max,o.hp+o.max*.3)));this.txtAt(p.x,p.y-20,'+cura','#7CFFB2');return false;}
      if(p.k==='fount'&&l<40){G.team.forEach(o=>o.alive&&(o.hp=Math.min(o.max,o.hp+o.max*.45)));this.txtAt(p.x,p.y-30,'Fuente: +45 % de vida','#7CFFB2');return false;}
      if(p.k==='altar'&&l<40){G.st.altar=25;this.txtAt(p.x,p.y-30,'Altar: +25 % de daño 25 s','#FFC93C');return false;}
      if(p.k==='chest'){if(l<46){p.open+=dt;if(p.open>=1.5){this.openChest(p);return false;}}else p.open=Math.max(0,p.open-dt);}
      return p.life>0;});},
  openChest(p){const G=this.G;G.st.chests++;const n=p.rich?2+Math.floor(Math.random()*2):1;G.st.sellos+=n;this.txtAt(p.x,p.y-30,`+${n} sello${n>1?'s':''}`,'#FFE14D',1.3);this.ring(p.x,p.y,60,'#FFE14D',.5);
    if(Math.random()<(p.rich?.5:.08))this.relicOffer(HS_RELIC[Math.floor(Math.random()*HS_RELIC.length)]);},
  updFx(dt){const G=this.G;G.fx=G.fx.filter(f=>{f.life-=dt;if(f.k==='conf'){f.y+=f.vy*dt;}return f.life>0;});G.txt=G.txt.filter(t=>{t.life-=dt;t.y-=28*dt;return t.life>0;});if(G.cut){G.cut.life-=dt;if(G.cut.life<=0)G.cut=null;}if(G.hurtT>0)G.hurtT-=dt;},
  /* ---------- portales y arenas ---------- */
  portalTick(dt){const G=this.G,P=G.p;if(G.arena)return;
    if(G.portal){G.portal.t-=dt;if(Math.hypot(P.x-G.portal.x,P.y-G.portal.y)<42){this.arenaStart(G.portal.el);G.portal=null;return;}if(G.portal.t<=0){G.portal=null;this.say('El portal se ha cerrado','');}return;}
    if(G.t>=G.portalNext&&!G.boss){G.portalNext=G.t+30;const ch=.2+.2*G.portalFails;if(Math.random()<ch||G.portalFails>=5){G.portalFails=0;const done=G.meta.guards||{},els=Object.keys(HS_GUARD),w=els.map(k=>done[k]?1:4),tot=w.reduce((a,b)=>a+b,0);let r=Math.random()*tot,el=els[0];for(let i=0;i<els.length;i++){r-=w[i];if(r<=0){el=els[i];break;}}
      const a=Math.random()*7,R=320+Math.random()*120;G.portal={x:P.x+Math.cos(a)*R,y:P.y+Math.sin(a)*R,t:45,el};this.say('¡Portal abierto!',HS_GUARD[el].n+' te espera (45 s)',HS_GUARD[el].col);}else G.portalFails++;}},
  arenaStart(el){const G=this.G,P=G.p,D=HS_GUARD[el];G.saved={foes:G.foes,gems:G.gems,picks:G.picks,ebul:G.ebul,zones:G.zones,tele:G.tele,x:P.x,y:P.y};G.foes=[];G.gems=[];G.picks=[];G.ebul=[];G.zones=[];G.tele=[];
    G.arena={el,hz:D.hz,t:120,cx:P.x,cy:P.y,R:380,hzT:4};const e=this.addFoe({hp:1,spd:70,dmg:24,r:46,shape:D.shape},{x:P.x,y:P.y-220,col:D.col});
    const hp=D.hp*(.6+G.t/600);Object.assign(e,{hp,max:hp,guard:1,gd:D,col2:D.col2,tough:140,toughMax:140,weak:Object.keys(HS_EL).filter(k=>k!==el).sort(()=>Math.random()-.5).slice(0,3),el,acd:2,phase:1,elite:false,dmg:24*(1+G.t/60*.13)});
    G.boss=null;this.say(D.n,'Arena de 2 minutos: vence al guardián',D.col);},
  arenaHazard(){const G=this.G,A=G.arena,P=G.p;A.hzT=3.2;const hz=A.hz,c=HS_GUARD[A.el].col;
    if(hz==='lava'||hz==='quake'||hz==='void'){for(let i=0;i<4;i++)G.tele.push({k:'circle',x:A.cx+(Math.random()-.5)*A.R*1.4,y:A.cy+(Math.random()-.5)*A.R*1.4,r:70,t:1.1,d:18+G.t/20,c});}
    if(hz==='shock'){G.tele.push({k:'circle',x:P.x,y:P.y,r:60,t:1,d:20+G.t/20,c});}
    if(hz==='ice'||hz==='wind'){const a=Math.random()*7;for(let i=0;i<10;i++){const b=a+i/10*Math.PI*2;G.ebul.push({x:A.cx,y:A.cy,vx:Math.cos(b)*150,vy:Math.sin(b)*150,r:8,d:14+G.t/25,life:3,c});}}
    if(hz==='water'){G.tele.push({k:'circle',x:A.cx,y:A.cy,r:A.R*.5,t:1.4,d:16+G.t/25,c});}},
  arenaEnd(win,wiped){const G=this.G,A=G.arena;if(!A)return;const S=G.saved,P=G.p;G.arena=null;G.foes=S.foes;G.gems=S.gems;G.picks=S.picks;G.ebul=[];G.zones=S.zones;G.tele=[];P.x=S.x;P.y=S.y;
    if(win){G.reso=true;G.st.guards++;G.st.sellos+=3;if(Math.random()<.5)G.st.sellos+=5;G.st.lumen+=150;(G.won_g=G.won_g||[]).push(A.el);this.say('¡Resonancia de '+HS_EL[A.el].n+'!','Ahora todas tus técnicas disparan a la vez · +3 sellos',HS_GUARD[A.el].col);}
    else{const m=this.am();m.alive=true;m.hp=Math.max(m.hp,m.max*.3);this.say(wiped?'Te han echado de la arena':'Se acabó el tiempo','Vuelves con el 30 % de vida','#FF8A8A');}},
  /* ---------- cartas al subir de nivel ---------- */
  levelUp(){const G=this.G;G.modal='lvl';const opts=this.cards();this.showCards(opts);},
  cards(){const G=this.G,pool=[];const add=(w,o)=>{if(!G.vetoed.has(o.key))pool.push({w,...o});};
    G.team.forEach((m,i)=>{if(i>0){if(m.lv.s<5)add(2.5,{key:'sup'+m.c.id,t:`Apoyo ${m.c.n}: nv. ${m.lv.s+1}`,d:'Su ataque extra hace +15 % de daño y llega antes',ic:HS_EL[m.c.el].ic,col:HS_EL[m.c.el].c,f:()=>m.lv.s++,who:m.c});return;}[['b','Básico',m.c.b],['s','Habilidad',m.c.s],['u','Definitiva',m.c.u]].forEach(([k,nm])=>{if(m.lv[k]<5)add(3,{key:'lv'+m.c.id+k,t:`${m.c.n}: ${nm} nv. ${m.lv[k]+1}`,d:k==='b'&&m.lv[k]===4?'+14 % de daño y al nivel 5 mejora su forma':'+14 % de daño',ic:HS_EL[m.c.el].ic,col:HS_EL[m.c.el].c,f:()=>m.lv[k]++,who:m.c});});
      if(m.lv.s>=5&&!m.evo&&G.statTaken.reflejos)add(6,{key:'evo'+m.c.id,t:`Ascensión: ${m.c.n}`,d:m.c.id==='velka'?'Su orbe lanza 2 rayos y la habilidad hace +60 % de daño':'Habilidad +60 % de daño y −20 % de enfriamiento',ic:'✨',col:'#FFE14D',f:()=>{m.evo=true;},who:m.c,evo:1});});
    if(G.techs.length<4)HS_TECH.filter(t=>!G.techs.some(x=>x.t.id===t.id)).forEach(t=>add(1,{key:'t'+t.id,t:'Técnica: '+t.n,d:`${HS_EL[t.el].n} · evoluciona con ${HS_STATS[t.stat].n}`,ic:HS_EL[t.el].ic,col:HS_EL[t.el].c,f:()=>{G.techs.push({t,lv:1,cd:0,evo:false});G.tact=G.techs.length-1;}}));
    G.techs.forEach(T=>{if(T.lv<5)add(2,{key:'tl'+T.t.id,t:`${T.t.n} nv. ${T.lv+1}`,d:'+25 % de daño',ic:HS_EL[T.t.el].ic,col:HS_EL[T.t.el].c,f:()=>T.lv++});
      if(T.lv>=5&&!T.evo&&G.statTaken[T.t.stat])add(8,{key:'te'+T.t.id,t:'Evolución: '+T.t.evo,d:'×1,8 de daño, más proyectiles y más rápida',ic:'🌟',col:'#FFE14D',f:()=>T.evo=true,evo:1});});
    Object.entries(HS_STATS).forEach(([k,S])=>add(1.2,{key:'s'+k,t:S.n,d:S.d,ic:S.ic,col:'#C9D1E0',f:()=>{S.f(G.M);G.statTaken[k]=(G.statTaken[k]||0)+1;if(k==='vigor')G.team.forEach(o=>{const n=Math.round(o.max*1.15);o.hp+=n-o.max;o.max=n;});}}));
    const out=[];const P=[...pool];while(out.length<3&&P.length){const tot=P.reduce((s,o)=>s+o.w,0);let r=Math.random()*tot;let i=0;for(;i<P.length;i++){r-=P[i].w;if(r<=0)break;}const o=P.splice(Math.min(i,P.length-1),1)[0];out.push(o);}
    if(!out.length)out.push({key:'heal',t:'Comida',d:'+30 % de vida a todos',ic:'🍙',col:'#7CFFB2',f:()=>G.team.forEach(o=>o.hp=Math.min(o.max,o.hp+o.max*.3))});return out;},
  showCards(opts){const G=this.G,ov=G.ov;ov.hidden=false;
    ov.innerHTML=`<div class="hs-modal"><h3>¡Nivel ${G.lvl}!</h3><p>Elige una mejora (1, 2 o 3)</p><div class="hs-cards">${opts.map((o,i)=>`<button class="hs-card${o.evo?' evo':''}" data-card="${i}" style="--c:${o.col}"><span class="hs-ci">${o.ic}</span><b>${esc(o.t)}</b><small>${esc(o.d)}</small>${G.vetos>0?`<span class="hs-veto" data-veto="${i}" title="Vetar: no vuelve a salir">✕</span>`:''}</button>`).join('')}</div>
      <div class="hs-mrow">${G.rerolls>0?`<button class="ebtn" data-reroll>Cambiar cartas (${G.rerolls})</button>`:''}${G.vetos>0?`<small>Vetos: ${G.vetos}</small>`:''}</div></div>`;
    ov.onclick=e=>{const v=e.target.closest('[data-veto]');if(v){e.stopPropagation();const o=opts[+v.dataset.veto];G.vetoed.add(o.key);G.vetos--;this.showCards(this.cards());return;}
      const r=e.target.closest('[data-reroll]');if(r){G.rerolls--;this.showCards(this.cards());return;}
      const b=e.target.closest('[data-card]');if(b){opts[+b.dataset.card].f();ov.hidden=true;ov.innerHTML='';G.modal=null;G.cv.focus();if(G.xp>=G.next){G.xp-=G.next;G.lvl++;G.next=this.nextXp(G.lvl);this.levelUp();}}};},
  relicOffer(r){const G=this.G;if(G.relic&&G.relic.id===r.id)return;if(!G.relic){this.takeRelic(r);return;}const prev=G.modal;if(prev)return;G.modal='relic';const ov=G.ov;ov.hidden=false;
    ov.innerHTML=`<div class="hs-modal"><h3>Nueva reliquia</h3><p>Solo puedes llevar una. ¿Con cuál te quedas?</p><div class="hs-cards two"><button class="hs-card" data-keep="old"><span class="hs-ci">🏺</span><b>${esc(G.relic.n)}</b><small>${esc(G.relic.d)}</small><em>La que llevas</em></button><button class="hs-card evo" data-keep="new"><span class="hs-ci">🏺</span><b>${esc(r.n)}</b><small>${esc(r.d)}</small><em>Nueva</em></button></div></div>`;
    ov.onclick=e=>{const b=e.target.closest('[data-keep]');if(!b)return;if(b.dataset.keep==='new')this.takeRelic(r,true);ov.hidden=true;ov.innerHTML='';G.modal=null;G.cv.focus();};},
  takeRelic(r,replace){const G=this.G;if(replace&&G.relic){// rehacer modificadores sin la vieja: se guardan las cartas tomadas
      const base=this.baseM();Object.entries(G.statTaken).forEach(([k,n])=>{for(let i=0;i<n;i++)HS_STATS[k].f(base);});G.M=base;}
    G.relic=r;r.f(G.M);this.say('Reliquia: '+r.n,r.d,'#FFC93C');},
  baseM(){return{dmg:0,hp:0,cd:1,spd:0,armor:1,regen:0,magnet:0,xp:0,crit:0,cdmg:0,er:0,em:0,ult:0,melee:0,gold:0,elb:{f:0,a:0,r:0,h:0,v:0,t:0,x:0},phoenix:0,lock:0,dice:0};},
  pauseMenu(){const G=this.G;if(G.modal)return;G.modal='pause';const ov=G.ov;ov.hidden=false;
    ov.innerHTML=`<div class="hs-modal"><h3>Pausa</h3><div class="hs-pstats"><span>Tiempo <b>${this.fmt(G.t)}</b></span><span>Nivel <b>${G.lvl}</b></span><span>Bajas <b>${G.kills}</b></span><span>Sellos <b>${G.st.sellos}</b></span></div>
      ${G.relic?`<p>Reliquia: <b>${esc(G.relic.n)}</b> · ${esc(G.relic.d)}</p>`:''}<p class="hs-keys">WASD/flechas mover · Espacio definitiva · Tab técnica · R Gran Función · Esc pausa</p>
      <div class="hs-mrow"><button class="ebtn pri" data-resume>Seguir</button><button class="ebtn danger" data-quit>Terminar partida</button></div></div>`;
    ov.onclick=e=>{if(e.target.closest('[data-resume]'))this.resume();if(e.target.closest('[data-quit]')){ov.hidden=true;G.modal=null;this.gameOver(true);}};},
  resume(){const G=this.G;G.ov.hidden=true;G.ov.innerHTML='';G.modal=null;G.cv.focus();},
  fmt(t){t=Math.floor(t);return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');},
  gameOver(quit){const G=this.G;if(G.over)return;G.over=true;this.say(quit?'Partida terminada':'Fin de la partida','',"#FF8A8A");setTimeout(()=>{if(this.G===G&&G.opts.onEnd)G.opts.onEnd(this.result());},quit?50:1600);},
  result(){const G=this.G;const fort=G.team.reduce((s,o)=>s+(o.P.for|0),0)/Math.max(1,G.team.length);
    const lumen=Math.round((20+G.t/60*14+G.kills/18+G.st.lumen+G.bossDone*80)*(1+G.M.gold+.08*fort));
    return{time:G.t,kills:G.kills,lvl:G.lvl,bosses:G.bossDone,won:G.won,lumen,sellos:G.st.sellos,ults:G.st.ults,react:G.st.react,breaks:G.st.breaks,gf:G.st.gf,chests:G.st.chests,guards:G.won_g||[],team:G.team.map(o=>o.c.id),elites:G.st.elites,gold:G.st.gold};},
  /* ---------- dibujo ---------- */
  draw(){const G=this.G,g=G.ctx,P=G.p,W=G.W,H=G.H;g.setTransform(G.dpr,0,0,G.dpr,0,0);
    let sx=0,sy=0;if(G.shake>0){sx=(Math.random()-.5)*8;sy=(Math.random()-.5)*8;}
    const cx=Math.round(P.x-W/2+sx),cy=Math.round(P.y-H/2+sy);
    this.drawGround(g,cx,cy,W,H);
    g.save();g.translate(-cx,-cy);
    if(G.arena){const A=G.arena;g.fillStyle='rgba(0,0,0,.55)';g.beginPath();g.rect(cx,cy,W,H);g.arc(A.cx,A.cy,A.R,0,7,true);g.fill();g.strokeStyle=HS_GUARD[A.el].col;g.lineWidth=4;g.beginPath();g.arc(A.cx,A.cy,A.R,0,7);g.stroke();}
    // zonas
    for(const z of G.zones){const c=HS_EL[z.el]?HS_EL[z.el].c:'#fff';if(z.k==='meteor'){g.strokeStyle=c;g.globalAlpha=.6;g.lineWidth=2;g.setLineDash([6,5]);g.beginPath();g.arc(z.x,z.y,z.r,0,7);g.stroke();g.setLineDash([]);g.globalAlpha=1;g.fillStyle=c;g.beginPath();g.arc(z.x,z.y-z.t*400,8,0,7);g.fill();}
      else if(z.k==='mine'){g.fillStyle=c;g.beginPath();g.moveTo(z.x,z.y-9);g.lineTo(z.x+8,z.y);g.lineTo(z.x,z.y+9);g.lineTo(z.x-8,z.y);g.fill();}
      else{g.globalAlpha=z.k==='heal'?.14:.22;g.fillStyle=z.k==='heal'?'#7CFFB2':c;g.beginPath();g.arc(z.x,z.y,z.r,0,7);g.fill();g.globalAlpha=1;if(z.pull){g.strokeStyle=c;g.lineWidth=2;for(let i=0;i<3;i++){g.beginPath();g.arc(z.x,z.y,z.r*(.3+i*.25),G.t*4+i,G.t*4+i+2.2);g.stroke();}}}}
    // avisos
    for(const z of G.tele){g.globalAlpha=.25+.25*Math.sin(G.t*20);g.fillStyle='#FF3B3B';if(z.k==='circle'){g.beginPath();g.arc(z.x,z.y,z.r,0,7);g.fill();}else{g.save();g.translate(z.x,z.y);g.rotate(Math.atan2(z.uy,z.ux));g.fillRect(0,-z.w,z.L,z.w*2);g.restore();}g.globalAlpha=1;}
    // recogibles
    for(const gm of G.gems){g.fillStyle=gm.big?'#FFC93C':'#6BE3FF';g.beginPath();g.moveTo(gm.x,gm.y-(gm.big?7:5));g.lineTo(gm.x+(gm.big?5:3.5),gm.y);g.lineTo(gm.x,gm.y+(gm.big?7:5));g.lineTo(gm.x-(gm.big?5:3.5),gm.y);g.fill();}
    for(const p of G.picks)this.drawPick(g,p);
    if(G.portal){const p=G.portal,c=HS_GUARD[p.el].col;for(let i=0;i<3;i++){g.strokeStyle=c;g.globalAlpha=.8-i*.2;g.lineWidth=4;g.beginPath();g.ellipse(p.x,p.y,30+i*8+Math.sin(G.t*4+i)*3,42+i*8,0,0,7);g.stroke();}g.globalAlpha=1;g.fillStyle='#14121C';g.beginPath();g.ellipse(p.x,p.y,26,38,0,0,7);g.fill();g.fillStyle=c;g.font='bold 12px system-ui';g.textAlign='center';g.fillText(Math.ceil(p.t)+' s',p.x,p.y+60);}
    // invocaciones
    for(const s of G.sums){const c=HS_EL[s.el].c;if(s.k==='orb'){g.fillStyle=c;g.beginPath();g.arc(s.x,s.y,8,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(s.x-2,s.y-2,3,0,7);g.fill();}
      if(s.k==='turret'){g.fillStyle='#2A2A33';g.fillRect(s.x-8,s.y-4,16,14);g.fillStyle=c;g.beginPath();g.arc(s.x,s.y-10,9,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(s.x+2,s.y-12,2.5,0,7);g.fill();}
      if(s.k==='pet'){const R=s.big?20:13;g.fillStyle=c;g.globalAlpha=.85;g.beginPath();g.moveTo(s.x-R,s.y+R*.6);g.quadraticCurveTo(s.x-R,s.y-R,s.x,s.y-R*1.1);g.quadraticCurveTo(s.x+R,s.y-R,s.x+R,s.y+R*.6);g.lineTo(s.x+R*.4,s.y+R*.2);g.lineTo(s.x,s.y+R*.6);g.lineTo(s.x-R*.4,s.y+R*.2);g.closePath();g.fill();g.globalAlpha=1;g.fillStyle='#fff';g.beginPath();g.arc(s.x-R*.35,s.y-R*.2,R*.18,0,7);g.arc(s.x+R*.35,s.y-R*.2,R*.18,0,7);g.fill();}}
    // enemigos
    const vis=G.foes.filter(e=>!e.dead&&Math.abs(e.x-P.x)<W/2+80&&Math.abs(e.y-P.y)<H/2+80).sort((a,b)=>a.y-b.y);
    for(const e of vis)this.drawFoeAt(g,e);
    // jugador
    const m=this.am();if(m){const spr=this.sprite(m.c,m.alt),bob=P.mv?Math.sin(G.t*14)*2:Math.sin(G.t*3)*1;g.save();g.translate(P.x,P.y+bob);if(P.face<0)g.scale(-1,1);if(P.inv>0&&Math.floor(G.t*20)%2)g.globalAlpha=.55;g.drawImage(spr,-42,-58,84,94);g.restore();
      if(m.tron>0){g.strokeStyle=HS_EL.r.c;g.globalAlpha=.5+.3*Math.sin(G.t*20);g.lineWidth=2;g.beginPath();g.arc(P.x,P.y-6,30,0,7);g.stroke();g.globalAlpha=1;}
      if(G.shield>0){g.strokeStyle='rgba(227,180,95,.85)';g.fillStyle='rgba(227,180,95,.12)';g.lineWidth=2;g.beginPath();g.arc(P.x,P.y-6,32,0,7);g.fill();g.stroke();}
      if(G.caras>0){g.font='16px system-ui';g.textAlign='center';g.fillText('🎭',P.x,P.y-56);}}
    if(G.eye){const e=G.eye;g.fillStyle='#14121C';g.beginPath();g.ellipse(e.ox,e.oy,14,9,0,0,7);g.fill();g.strokeStyle=HS_EL.r.c;g.lineWidth=2;g.stroke();g.fillStyle=HS_EL.r.c;g.beginPath();g.arc(e.ox,e.oy,5,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(e.ox,e.oy,2,0,7);g.fill();}
    // disparos
    for(const s of G.shots){const c=HS_EL[s.el].c;if(s.wave){g.save();g.translate(s.x,s.y);g.rotate(Math.atan2(s.vy,s.vx));g.fillStyle=c;g.globalAlpha=.55;g.beginPath();g.ellipse(0,0,14,s.r,0,0,7);g.fill();g.restore();g.globalAlpha=1;continue;}
      if(s.boom){g.save();g.translate(s.x,s.y);g.rotate(s.spin);g.strokeStyle=c;g.lineWidth=4;g.beginPath();g.arc(0,0,11,0,3.4);g.stroke();g.restore();continue;}
      if(s.star){g.fillStyle=c;this.star(g,s.x,s.y,s.r+2);continue;}
      g.fillStyle=c;g.beginPath();g.arc(s.x,s.y,s.r,0,7);g.fill();g.fillStyle='rgba(255,255,255,.75)';g.beginPath();g.arc(s.x,s.y,s.r*.45,0,7);g.fill();}
    for(const b of G.ebul){g.fillStyle=b.c||'#FF8A8A';g.beginPath();g.arc(b.x,b.y,b.r,0,7);g.fill();g.strokeStyle='#14121C';g.lineWidth=1.5;g.stroke();}
    // efectos
    for(const f of G.fx){const a=Math.max(0,f.life/f.max);g.globalAlpha=a;
      if(f.k==='ring'){g.strokeStyle=f.c;g.lineWidth=3;g.beginPath();g.arc(f.x,f.y,f.r*(1.15-a*.15),0,7);g.stroke();}
      if(f.k==='line'){g.strokeStyle=f.c;g.lineWidth=f.w;g.beginPath();g.moveTo(f.x1,f.y1);const mx=(f.x1+f.x2)/2+(Math.random()-.5)*14,my=(f.y1+f.y2)/2+(Math.random()-.5)*14;g.lineTo(mx,my);g.lineTo(f.x2,f.y2);g.stroke();}
      if(f.k==='arc'){g.fillStyle=f.c;g.globalAlpha=a*.45;g.beginPath();g.moveTo(f.x,f.y);g.arc(f.x,f.y,f.r,f.a-f.w/2,f.a+f.w/2);g.closePath();g.fill();g.globalAlpha=a;g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.arc(f.x,f.y,f.r,f.a-f.w/2,f.a+f.w/2);g.stroke();}
      if(f.k==='thrust'){g.save();g.translate(f.x,f.y);g.rotate(Math.atan2(f.uy,f.ux));g.fillStyle=f.c;g.globalAlpha=a*.6;g.fillRect(0,-f.w/2,f.L,f.w);g.globalAlpha=a;g.fillStyle='#fff';g.fillRect(0,-1.5,f.L,3);g.restore();}
      if(f.k==='slash'){g.save();g.translate(f.x,f.y);g.rotate(Math.atan2(f.uy,f.ux));const w=70*(1-a*.3);g.fillStyle=f.c;g.globalAlpha=a*.5;g.fillRect(-f.L/2,-w,f.L,w*2);g.globalAlpha=a;g.fillStyle='#fff';g.fillRect(-f.L/2,-4,f.L,8);g.restore();}
      if(f.k==='conf'){g.fillStyle=f.c;g.fillRect(f.x,f.y,6,4);}
      g.globalAlpha=1;}
    // números
    g.textAlign='center';for(const t of G.txt){g.globalAlpha=Math.min(1,t.life*2);g.font=`${t.big?'bold ':''}${Math.round((t.big?15:12)*(t.s||1))}px system-ui`;g.lineWidth=3;g.strokeStyle='rgba(0,0,0,.65)';g.strokeText(t.t,t.x,t.y);g.fillStyle=t.c;g.fillText(t.t,t.x,t.y);}g.globalAlpha=1;
    g.restore();
    this.drawWeather(g,W,H);
    for(const f of G.fx){if(f.k==='flash'){g.globalAlpha=f.life/f.max*.35;g.fillStyle=f.c;g.fillRect(0,0,W,H);g.globalAlpha=1;}if(f.k==='mask'){const a=f.life/f.max;g.globalAlpha=Math.min(1,a*2)*.9;g.save();g.translate(W/2,H/2);g.scale(1+(1-a)*.4,1+(1-a)*.4);g.drawImage(this.foeSprite('mask','#F06BC8','#FFC93C',90),-114,-114,228,228);g.restore();g.globalAlpha=1;}}
    if(G.hurtT>0){g.fillStyle=`rgba(255,40,40,${G.hurtT*.6})`;g.fillRect(0,0,W,H);}
    this.drawHUD(g,W,H);},
  star(g,x,y,r){g.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,R=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*R,y+Math.sin(a)*R);}g.closePath();g.fill();},
  drawGround(g,cx,cy,W,H){const G=this.G,B=HS_BIOME[G.biome],T=80;
    const paint=(B,alpha)=>{g.globalAlpha=alpha;g.fillStyle=B.g;g.fillRect(0,0,W,H);g.fillStyle=B.g2;const x0=Math.floor(cx/T),y0=Math.floor(cy/T);for(let i=x0;i<=x0+W/T+1;i++)for(let j=y0;j<=y0+H/T+1;j++){if((i+j)&1)g.fillRect(i*T-cx,j*T-cy,T,T);}
      // decoración por casilla (solo se ve)
      const D=160,a0=Math.floor(cx/D),b0=Math.floor(cy/D);for(let i=a0-1;i<=a0+W/D+1;i++)for(let j=b0-1;j<=b0+H/D+1;j++){const h=((i*73856093)^(j*19349663))>>>0;if(h%5>1)continue;const x=i*D+(h%97)-cx,y=j*D+((h>>8)%97)-cy;this.deco(g,B,x,y,h);}g.globalAlpha=1;};
    paint(B,1);if(G.biomeFade>0)paint(HS_BIOME[G.biomePrev],G.biomeFade/2.6);},
  deco(g,B,x,y,h){const c=B.d[h%3],k=B.deco;g.fillStyle=c;
    if(k==='tree'){g.fillStyle='#5A3A2A';g.fillRect(x-3,y,6,12);g.fillStyle=B.d[0];g.beginPath();g.arc(x,y-4,14,0,7);g.fill();g.fillStyle=B.d[1];g.beginPath();g.arc(x-4,y-8,6,0,7);g.fill();}
    else if(k==='rock'){g.beginPath();g.ellipse(x,y,14,9,0,0,7);g.fill();g.fillStyle='rgba(255,255,255,.2)';g.beginPath();g.ellipse(x-4,y-3,5,3,0,0,7);g.fill();}
    else if(k==='crystal'||k==='ice'){g.beginPath();g.moveTo(x,y-18);g.lineTo(x+7,y);g.lineTo(x,y+6);g.lineTo(x-7,y);g.closePath();g.fill();}
    else if(k==='shroom'){g.fillStyle='#F2F2C0';g.fillRect(x-3,y-4,6,10);g.fillStyle=c;g.beginPath();g.arc(x,y-4,10,Math.PI,0);g.fill();}
    else if(k==='water'){g.globalAlpha*=.5;g.beginPath();g.ellipse(x,y,26,10,0,0,7);g.fill();g.globalAlpha=g.globalAlpha*2;}
    else if(k==='lava'){g.fillStyle=h%2?'#FF6B3D':'#2A1A1A';g.beginPath();g.ellipse(x,y,20,9,0,0,7);g.fill();}
    else if(k==='cards'){g.save();g.translate(x,y);g.rotate((h%10-5)*.1);g.fillStyle='#F2F2F2';g.fillRect(-7,-10,14,20);g.fillStyle=c;g.fillRect(-3,-3,6,6);g.restore();}},
  drawPick(g,p){const G=this.G;if(p.k==='shield'){g.fillStyle=HS_EL.t.c;g.beginPath();g.moveTo(p.x,p.y-9);g.lineTo(p.x+7,p.y);g.lineTo(p.x,p.y+9);g.lineTo(p.x-7,p.y);g.fill();}
    if(p.k==='heal'){g.fillStyle='#7CFFB2';g.fillRect(p.x-3,p.y-9,6,18);g.fillRect(p.x-9,p.y-3,18,6);}
    if(p.k==='chest'){g.fillStyle=p.rich?'#C9A227':'#8A5A2A';g.fillRect(p.x-16,p.y-10,32,22);g.fillStyle=p.rich?'#FFE14D':'#C9A227';g.fillRect(p.x-16,p.y-2,32,4);g.fillRect(p.x-3,p.y-4,6,8);if(p.open>0){g.strokeStyle='#FFE14D';g.lineWidth=3;g.beginPath();g.arc(p.x,p.y,30,-Math.PI/2,-Math.PI/2+p.open/1.5*Math.PI*2);g.stroke();}}
    if(p.k==='fount'){g.fillStyle='#B5B5C8';g.fillRect(p.x-14,p.y-4,28,14);g.fillStyle='#6BE3FF';g.beginPath();g.ellipse(p.x,p.y-4,12,4,0,0,7);g.fill();g.fillStyle='#E8E8F0';g.fillRect(p.x-3,p.y-26,6,22);}
    if(p.k==='altar'){g.fillStyle='#5A4A7A';g.fillRect(p.x-12,p.y-6,24,16);g.fillStyle='#FFC93C';this.star(g,p.x,p.y-18,9+Math.sin(G.t*4)*2);}},
  drawFoeAt(g,e){const G=this.G,spr=this.foeSprite(e.shape,e.col,e.col2,Math.round(e.r));const D=e.r*2+24;const bob=Math.sin(G.t*6+e.x*.05)*1.5;
    if(e.elite||e.boss||e.guard){g.strokeStyle=e.gold?'#FFE14D':e.boss||e.guard?'#FF5A5A':'#FFC93C';g.lineWidth=3;g.beginPath();g.arc(e.x,e.y,e.r+4,0,7);g.stroke();}
    g.save();if(e.hitT>0)g.filter='brightness(2.2)';if(e.frozen>0)g.filter='saturate(.2) brightness(1.4)';if(e.fused&&Math.floor(G.t*12)%2)g.filter='brightness(2.5)';g.drawImage(spr,e.x-D/2,e.y-D/2+bob,D,D);g.restore();
    if(e.sh>0){g.strokeStyle='rgba(139,230,255,.8)';g.lineWidth=2;g.beginPath();g.arc(e.x,e.y,e.r+2,0,7);g.stroke();}
    if(e.aura){g.fillStyle=HS_EL[e.aura.el].c;g.beginPath();g.arc(e.x,e.y-e.r-8,4,0,7);g.fill();}
    if(e.mark>0){g.fillStyle=HS_EL.x.c;g.font='bold 12px system-ui';g.textAlign='center';g.fillText('✦',e.x+e.r,e.y-e.r);}
    if(e.elite&&!e.boss){const w=e.r*2.2;g.fillStyle='rgba(0,0,0,.6)';g.fillRect(e.x-w/2,e.y+e.r+6,w,4);g.fillStyle='#FF5A5A';g.fillRect(e.x-w/2,e.y+e.r+6,w*Math.max(0,e.hp/e.max),4);g.fillStyle='#fff';g.fillRect(e.x-w/2,e.y+e.r+11,w*Math.max(0,e.tough/e.toughMax),2.5);
      e.weak.forEach((k,i)=>{g.fillStyle=HS_EL[k].c;g.beginPath();g.arc(e.x-w/2+4+i*9,e.y+e.r+19,3.5,0,7);g.fill();});}
    if(e.broken>0){g.font='bold 11px system-ui';g.textAlign='center';g.fillStyle='#fff';g.fillText('💫',e.x,e.y-e.r-10);}},
  drawWeather(g,W,H){const G=this.G;if(!G.weather)return;const k=G.weather.k,t=G.t;
    if(k==='lluvia'||k==='tormenta'){g.strokeStyle='rgba(180,210,255,.35)';g.lineWidth=1;g.beginPath();for(let i=0;i<90;i++){const x=(i*97+t*500)%W,y=(i*53+t*900)%H;g.moveTo(x,y);g.lineTo(x-4,y+12);}g.stroke();if(k==='tormenta'&&Math.sin(t*3)>.995){g.fillStyle='rgba(255,255,255,.3)';g.fillRect(0,0,W,H);}}
    if(k==='nieve'){g.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<70;i++){const x=(i*131+Math.sin(t+i)*20+t*20)%W,y=(i*71+t*60)%H;g.fillRect(x,y,2.5,2.5);}}
    if(k==='niebla'){g.fillStyle='rgba(200,180,230,.22)';g.fillRect(0,0,W,H);}
    if(k==='arena'){g.fillStyle='rgba(227,180,95,.16)';g.fillRect(0,0,W,H);}
    if(k==='sol'){const gr=g.createRadialGradient(W*.85,0,10,W*.85,0,W*.7);gr.addColorStop(0,'rgba(255,220,120,.28)');gr.addColorStop(1,'rgba(255,220,120,0)');g.fillStyle=gr;g.fillRect(0,0,W,H);}},
  drawHUD(g,W,H){const G=this.G,m=this.am();g.textAlign='left';
    // experiencia
    g.fillStyle='rgba(0,0,0,.5)';g.fillRect(0,0,W,8);g.fillStyle='#6BE3FF';g.fillRect(0,0,W*Math.min(1,G.xp/G.next),8);
    const pill=(x,y,t,a)=>{g.font='bold 13px system-ui';const w=g.measureText(t).width+16;g.fillStyle='rgba(10,10,18,.62)';this.rr(g,a==='c'?x-w/2:a==='r'?x-w:x,y,w,22,11);g.fillStyle='#fff';g.textAlign='center';g.fillText(t,a==='c'?x:a==='r'?x-w/2:x+w/2,y+15.5);g.textAlign='left';};
    pill(W/2,14,this.fmt(G.t)+(G.won?' ✓':''),'c');pill(10,14,'Nv. '+G.lvl);pill(W-10,14,'☠ '+G.kills+'   🎟 '+G.st.sellos,'r');
    let y2=42;const B=HS_BIOME[G.biome];pill(10,y2,B.n+(G.weather?' · '+HS_WEATHER[G.weather.k].n:''));y2+=26;
    const st=[];if(G.eye)st.push('👁 '+Math.ceil(G.eye.t));if(m&&m.tron>0)st.push('⚡ Tronante '+Math.ceil(m.tron));if(G.resol>0)st.push('Resolución '+Math.round(G.resol));if(G.caras>0)st.push('🎭 '+Math.ceil(G.caras));if(G.buff)st.push('✨ '+Math.ceil(G.buff.t));if(G.st.altar>0)st.push('⭐ '+Math.ceil(G.st.altar));if(G.reso)st.push('💠 Resonancia');if(G.relic)st.push('🏺 '+G.relic.n);
    st.forEach(s=>{pill(10,y2,s);y2+=26;});
    // jefe
    const bo=G.boss||G.foes.find(e=>e.guard&&!e.dead);if(bo){const w=Math.min(520,W*.6),x=W/2-w/2,y=44;g.fillStyle='rgba(10,10,18,.7)';this.rr(g,x-8,y-4,w+16,44,8);g.fillStyle='#fff';g.font='bold 13px system-ui';g.textAlign='center';g.fillText((bo.boss?bo.boss.n:bo.gd.n)+(G.arena?' · '+Math.ceil(G.arena.t)+' s':''),W/2,y+11);
      g.fillStyle='#3A2A2A';g.fillRect(x,y+16,w,9);g.fillStyle='#FF5A5A';g.fillRect(x,y+16,w*Math.max(0,bo.hp/bo.max),9);g.fillStyle='#2A2A33';g.fillRect(x,y+28,w,5);g.fillStyle=bo.broken>0?'#FFE14D':'#fff';g.fillRect(x,y+28,w*Math.max(0,bo.broken>0?1:bo.tough/bo.toughMax),5);
      bo.weak.forEach((k,i)=>{g.fillStyle=HS_EL[k].c;g.beginPath();g.arc(x+w+16+i*0,y+20+i*0,0,0,7);g.fill();g.font='12px system-ui';g.fillText(HS_EL[k].ic,x-14-i*16,y+30);});g.textAlign='left';}
    // equipo
    const bx=12,by=H-74;G.team.forEach((o,i)=>{const x=bx+i*62,y=by,on=i===G.act,lock=i>=G.slots;g.fillStyle=on?'rgba(255,255,255,.22)':'rgba(10,10,18,.6)';this.rr(g,x,y,56,62,8);
      if(lock){g.fillStyle='rgba(255,255,255,.5)';g.font='18px system-ui';g.textAlign='center';g.fillText('🔒',x+28,y+36);g.textAlign='left';return;}
      g.save();if(!o.alive)g.filter='grayscale(1) brightness(.5)';g.drawImage(this.sprite(o.c,o.alt),x+6,y-6,44,50);g.restore();
      g.fillStyle='rgba(0,0,0,.6)';g.fillRect(x+4,y+46,48,5);g.fillStyle='#7CFFB2';g.fillRect(x+4,y+46,48*Math.max(0,o.hp/o.max),5);
      g.fillStyle='rgba(0,0,0,.6)';g.fillRect(x+4,y+53,48,4);const full=o.en>=o.c.u.cost;g.fillStyle=full?'#FFE14D':HS_EL[o.c.el].c;g.fillRect(x+4,y+53,48*Math.min(1,o.en/o.c.u.cost),4);
      g.fillStyle='#fff';g.font='bold 11px system-ui';g.fillText(String(i+1),x+5,y+13);if(on&&full){g.fillStyle='#FFE14D';g.fillText('ESP',x+30,y+13);}
      if(o.cdS>0&&on){g.fillStyle='rgba(0,0,0,.45)';g.fillRect(x+40,y+3,12,12*(o.cdS/(o.c.s.cd||1)));}
      if(on){g.strokeStyle=HS_EL[o.c.el].c;g.lineWidth=2;g.strokeRect(x+1,y+1,54,60);}});
    // vida grande del activo
    if(m){const w=Math.min(380,W*.36),x=W/2-w/2,y=H-34;g.fillStyle='rgba(10,10,18,.7)';this.rr(g,x-6,y-18,w+12,40,8);g.fillStyle='#fff';g.font='bold 12px system-ui';g.fillText(m.c.n+(m.c.t?' · '+m.c.t:''),x,y-5);
      g.fillStyle='#3A2A2A';g.fillRect(x,y,w,10);g.fillStyle='#7CFFB2';g.fillRect(x,y,w*Math.max(0,m.hp/m.max),10);if(G.shield>0){g.fillStyle='rgba(227,180,95,.9)';g.fillRect(x,y,w*Math.min(1,G.shield/Math.max(1,m.max)),4);}
      g.fillStyle='#fff';g.font='10px system-ui';g.textAlign='right';g.fillText(Math.ceil(m.hp)+' / '+m.max,x+w,y-5);g.textAlign='left';}
    // risas
    if(this.farsa()){const x=W/2+Math.min(380,W*.36)/2+44,y=H-26,r=20,full=G.risas>=100;g.fillStyle='rgba(10,10,18,.7)';g.beginPath();g.arc(x,y,r+4,0,7);g.fill();g.strokeStyle=full?'#FFE14D':'#F06BC8';g.lineWidth=4;g.beginPath();g.arc(x,y,r,-Math.PI/2,-Math.PI/2+Math.PI*2*G.risas/100);g.stroke();
      g.font='18px system-ui';g.textAlign='center';g.fillText('🎭',x,y+6);g.font='bold 10px system-ui';g.fillStyle=full?'#FFE14D':'#fff';g.fillText(full?'¡R!':Math.floor(G.risas),x,y-r-8);g.textAlign='left';}
    // técnicas
    G.techs.forEach((T,i)=>{const x=W-12-(G.techs.length-i)*44,y=H-52,on=G.reso||i===G.tact;g.fillStyle=on?'rgba(255,255,255,.25)':'rgba(10,10,18,.6)';this.rr(g,x,y,40,40,8);if(on){g.strokeStyle=T.evo?'#FFE14D':HS_EL[T.t.el].c;g.lineWidth=2;g.strokeRect(x+1,y+1,38,38);}
      g.font='18px system-ui';g.textAlign='center';g.fillText(HS_EL[T.t.el].ic,x+20,y+25);g.font='bold 9px system-ui';g.fillStyle='#fff';g.fillText((T.evo?'★':'nv.'+T.lv),x+20,y+37);g.textAlign='left';});
    if(G.techs.length>1){g.fillStyle='rgba(255,255,255,.7)';g.font='10px system-ui';g.textAlign='right';g.fillText(G.reso?'Resonancia: disparan todas':'Tab: cambiar técnica',W-12,H-58);g.textAlign='left';}
    // flecha al portal
    if(G.portal){const P=G.p,dx=G.portal.x-P.x,dy=G.portal.y-P.y;if(Math.abs(dx)>W/2-20||Math.abs(dy)>H/2-20){const a=Math.atan2(dy,dx),r=Math.min(W,H)/2-40;g.save();g.translate(W/2+Math.cos(a)*r,H/2+Math.sin(a)*r);g.rotate(a);g.fillStyle=HS_GUARD[G.portal.el].col;g.beginPath();g.moveTo(14,0);g.lineTo(-8,-10);g.lineTo(-8,10);g.fill();g.restore();}}
    // corte de definitiva
    if(G.cut){const a=G.cut.life/G.cut.max,y=H*.3;g.globalAlpha=Math.min(1,a*3);g.fillStyle=HS_EL[G.cut.c.el].c;g.beginPath();g.moveTo(0,y);g.lineTo(W,y-30);g.lineTo(W,y+70);g.lineTo(0,y+100);g.fill();g.drawImage(this.sprite(G.cut.c,G.cut.alt),W*.15+(1-a)*80,y-60,140,158);g.fillStyle='#fff';g.font='bold 26px system-ui';g.fillText(G.cut.c.n,W*.15+170,y+50);g.globalAlpha=1;}
    // mensaje
    if(G.msg){const a=Math.min(1,G.msg.life);g.globalAlpha=a;g.textAlign='center';g.font='bold 28px system-ui';g.lineWidth=5;g.strokeStyle='rgba(0,0,0,.6)';g.strokeText(G.msg.t,W/2,H*.22);g.fillStyle=G.msg.col||'#fff';g.fillText(G.msg.t,W/2,H*.22);if(G.msg.sub){g.font='14px system-ui';g.strokeText(G.msg.sub,W/2,H*.22+24);g.fillStyle='#fff';g.fillText(G.msg.sub,W/2,H*.22+24);}g.textAlign='left';g.globalAlpha=1;}},
};
