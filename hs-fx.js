/* ===================== Ecos de Prisma: lo visual =====================
   Suelo con textura por bioma, sprites con contorno y animación al andar, partículas con brillo,
   efectos de golpes, muertes, HUD y cinemáticas. Sustituye el dibujo básico de hs-game.js. */
(()=>{
const TAU=Math.PI*2;
const _hit=HSG.hit,_kill=HSG.kill,_levelUp=HSG.levelUp,_start=HSG.start,_ult=HSG.ult,_gf=HSG.granFuncion,_breakFoe=HSG.breakFoe,_react=HSG.react,_addFoe=HSG.addFoe;
Object.assign(HSG,{
  /* ---------- sprites con contorno y 3 poses al andar ---------- */
  outline(src,col,w){const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const g=c.getContext('2d');
    const sil=document.createElement('canvas');sil.width=src.width;sil.height=src.height;const s=sil.getContext('2d');s.drawImage(src,0,0);s.globalCompositeOperation='source-in';s.fillStyle=col;s.fillRect(0,0,sil.width,sil.height);
    for(let a=0;a<8;a++)g.drawImage(sil,Math.cos(a/8*TAU)*w,Math.sin(a/8*TAU)*w);g.drawImage(src,0,0);return c;},
  sprite(c,alt,pose){pose=pose|0;const k=c.id+(alt?'*':'')+'|'+pose;if(this._spr[k])return this._spr[k];const S=2,cv=document.createElement('canvas');cv.width=64*S;cv.height=72*S;const g=cv.getContext('2d');g.scale(S,S);g.translate(32,40);
    this.drawChibi(g,alt?this.altLook(c):c,pose);return this._spr[k]=this.outline(cv,'rgba(20,16,32,.92)',2.2);},
  drawChibi(g,c,pose){pose=pose||0;const S=this.shade.bind(this),el=HS_EL[c.el].c,W=c.w,hs=c.hs;
    g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(0,24,13,4,0,0,TAU);g.fill();
    // capa o pelo largo detrás
    if(c.role==='farsa'||c.r===5){g.fillStyle=S(c.out,.7);g.beginPath();g.moveTo(-10,-2);g.quadraticCurveTo(-18+pose,14,-14,20);g.lineTo(14,20);g.quadraticCurveTo(18-pose,14,10,-2);g.closePath();g.fill();}
    g.save();g.lineCap='round';
    if(W==='lanza'){g.strokeStyle=S(c.acc,.6);g.lineWidth=2.6;g.beginPath();g.moveTo(-11,22);g.lineTo(16,-27);g.stroke();g.fillStyle='#E9EEF7';g.beginPath();g.moveTo(17,-37);g.lineTo(21,-25);g.lineTo(13,-26);g.closePath();g.fill();g.fillStyle=el;g.fillRect(12,-25,7,3);g.fillStyle=c.acc;g.beginPath();g.arc(-11,22,2,0,TAU);g.fill();}
    if(W==='mandoble'){const gr=g.createLinearGradient(10,10,28,-22);gr.addColorStop(0,'#9AA6B8');gr.addColorStop(1,'#F4F7FC');g.fillStyle=gr;g.beginPath();g.moveTo(10,10);g.lineTo(26,-25);g.lineTo(31,-21);g.lineTo(15,12);g.closePath();g.fill();g.fillStyle=el;g.fillRect(7,8,11,4);}
    if(W==='arco'){g.strokeStyle=S(c.acc,.8);g.lineWidth=2.8;g.beginPath();g.arc(-16,2,15,-1.2,1.2);g.stroke();g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=.8;g.beginPath();g.moveTo(-10,-12);g.lineTo(-10,16);g.stroke();}
    g.restore();
    // piernas (andando: se adelantan y atrasan)
    g.fillStyle=S(c.out,.5);this.rr(g,-8,12-Math.max(0,pose)*2,6,10,2);this.rr(g,2,12-Math.max(0,-pose)*2,6,10,2);
    g.fillStyle='#2A2230';this.rr(g,-9,19-Math.max(0,pose)*2,8,4,2);this.rr(g,1,19-Math.max(0,-pose)*2,8,4,2);
    // cuerpo con sombreado
    const bg=g.createLinearGradient(-10,-2,10,14);bg.addColorStop(0,S(c.out,1.18));bg.addColorStop(1,S(c.out,.78));g.fillStyle=bg;g.beginPath();g.moveTo(-11,15);g.lineTo(11,15);g.lineTo(8,-2);g.lineTo(-8,-2);g.closePath();g.fill();
    g.fillStyle=c.acc;g.fillRect(-8,4,16,2.5);g.fillStyle='rgba(255,255,255,.25)';g.fillRect(-2,-2,4,6);
    g.fillStyle=el;g.beginPath();g.arc(0,1,2.2,0,TAU);g.fill();
    // brazos
    g.fillStyle=S(c.out,.9);this.rr(g,-13,-1+pose*.6,5,8,2.5);this.rr(g,8,-1-pose*.6,5,8,2.5);g.fillStyle=c.skin;g.beginPath();g.arc(-10.5,8+pose*.6,2.5,0,TAU);g.arc(10.5,8-pose*.6,2.5,0,TAU);g.fill();
    // pelo de atrás
    g.fillStyle=S(c.hair,.78);
    if(hs===1){this.rr(g,-15,-20,30,31,9);}if(hs===7){this.rr(g,-15,-20,30,21,8);}
    if(hs===2){g.beginPath();g.ellipse(-17,-5,6,13,.3,0,TAU);g.ellipse(17,-5,6,13,-.3,0,TAU);g.fill();g.fillStyle=c.acc;g.beginPath();g.arc(-15,-15,2.5,0,TAU);g.arc(15,-15,2.5,0,TAU);g.fill();g.fillStyle=S(c.hair,.78);}
    if(hs===4){g.beginPath();g.arc(0,-28,8,0,TAU);g.fill();g.fillStyle=c.acc;g.fillRect(-7,-24,14,2.5);}
    if(hs===5){g.fillStyle=S(c.out,.8);g.beginPath();g.arc(0,-13,17.5,0,TAU);g.fill();}
    // cabeza
    const hg=g.createRadialGradient(-4,-17,2,0,-13,14);hg.addColorStop(0,S(c.skin,1.06));hg.addColorStop(1,S(c.skin,.93));g.fillStyle=hg;g.beginPath();g.arc(0,-13,13,0,TAU);g.fill();
    // flequillo
    const hair=g.createLinearGradient(0,-30,0,-8);hair.addColorStop(0,S(c.hair,1.12));hair.addColorStop(1,S(c.hair,.9));g.fillStyle=hair;
    if(hs===5){g.fillStyle=S(c.out,1);g.beginPath();g.arc(0,-15,15.5,Math.PI*1.05,Math.PI*1.95);g.lineTo(13,-14);g.quadraticCurveTo(0,-22,-13,-14);g.fill();g.fillStyle=hair;g.beginPath();g.arc(0,-17,11,Math.PI*1.1,Math.PI*1.9);g.fill();g.fillStyle=c.acc;g.beginPath();g.arc(0,-29,2.6,0,TAU);g.fill();}
    else if(hs===6){g.beginPath();g.arc(0,-16,13.5,Math.PI,0);g.fill();g.fillStyle=c.out;g.beginPath();g.moveTo(-13,-20);g.quadraticCurveTo(-20,-37,-27,-22);g.lineTo(-10,-24);g.closePath();g.moveTo(13,-20);g.quadraticCurveTo(20,-37,27,-22);g.lineTo(10,-24);g.closePath();g.fill();
      g.fillStyle=S(c.out,1.3);g.beginPath();g.moveTo(-6,-26);g.quadraticCurveTo(0,-43,6,-26);g.closePath();g.fill();g.fillStyle=c.acc;g.beginPath();g.arc(-27,-22,3,0,TAU);g.arc(27,-22,3,0,TAU);g.arc(0,-41,3,0,TAU);g.fill();}
    else{g.beginPath();g.arc(0,-15,14,Math.PI*1.02,Math.PI*1.98);g.lineTo(13,-12);
      if(hs===3){for(let i=0;i<5;i++){const x=13-i*6.5;g.lineTo(x-3,-8-(i%2)*3);g.lineTo(x-6.5,-12);}}else{g.quadraticCurveTo(6,-20,0,-12);g.quadraticCurveTo(-6,-20,-13,-12);}
      g.closePath();g.fill();
      if(hs===3){g.beginPath();for(let i=0;i<5;i++){const a=Math.PI*(1.1+i*.2);g.moveTo(Math.cos(a)*12,-15+Math.sin(a)*12);g.lineTo(Math.cos(a)*21,-15+Math.sin(a)*21);g.lineTo(Math.cos(a+.25)*12,-15+Math.sin(a+.25)*12);}g.fill();}
      if(hs===1||hs===7){this.rr(g,-14.5,-16,5,hs===1?23:14,2);this.rr(g,9.5,-16,5,hs===1?23:14,2);}
      if(hs===0){this.rr(g,-14,-16,4,9,2);this.rr(g,10,-16,4,9,2);}}
    // brillo del pelo
    if(hs!==5){g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=1.6;g.lineCap='round';g.beginPath();g.arc(0,-15,10,Math.PI*1.25,Math.PI*1.45);g.stroke();}
    // ojos grandes
    g.fillStyle='#fff';g.beginPath();g.ellipse(-5,-10,3.4,4.2,0,0,TAU);g.ellipse(5,-10,3.4,4.2,0,0,TAU);g.fill();
    const eg=g.createLinearGradient(0,-14,0,-6);eg.addColorStop(0,S(c.eye,.7));eg.addColorStop(1,S(c.eye,1.25));g.fillStyle=eg;g.beginPath();g.ellipse(-4.6,-9.6,2.6,3.5,0,0,TAU);g.ellipse(5.4,-9.6,2.6,3.5,0,0,TAU);g.fill();
    g.fillStyle='#1A1422';g.beginPath();g.arc(-4.4,-9.4,1.2,0,TAU);g.arc(5.6,-9.4,1.2,0,TAU);g.fill();
    g.fillStyle='#fff';g.beginPath();g.arc(-3.6,-11.4,1.1,0,TAU);g.arc(6.4,-11.4,1.1,0,TAU);g.arc(-5.4,-8,.5,0,TAU);g.arc(4.6,-8,.5,0,TAU);g.fill();
    g.strokeStyle=S(c.hair,.5);g.lineWidth=1.1;g.beginPath();g.moveTo(-8.5,-14.5);g.lineTo(-2,-14);g.moveTo(8.5,-14.5);g.lineTo(2,-14);g.stroke();
    g.fillStyle='rgba(255,110,130,.35)';g.beginPath();g.ellipse(-8.5,-5,2.6,1.4,0,0,TAU);g.ellipse(8.5,-5,2.6,1.4,0,0,TAU);g.fill();
    g.strokeStyle=S(c.skin,.5);g.lineWidth=1;g.beginPath();g.arc(0,-5.5,1.6,.25,Math.PI-.25);g.stroke();
    if(hs!==6&&hs!==5){g.fillStyle=c.acc;g.beginPath();g.moveTo(8,-25);g.lineTo(12.5,-22.5);g.lineTo(9,-19);g.closePath();g.fill();}
    // arma delante
    g.save();g.lineCap='round';
    if(W==='espada'){const gr=g.createLinearGradient(11,6,25,-14);gr.addColorStop(0,'#AEB8C8');gr.addColorStop(1,'#FFFFFF');g.fillStyle=gr;g.beginPath();g.moveTo(11,6);g.lineTo(24,-15);g.lineTo(26.5,-12.5);g.lineTo(13,8);g.closePath();g.fill();g.fillStyle=c.acc;g.fillRect(8,5,8,3);g.fillStyle=el;g.fillRect(14,-4,2,6);}
    if(W==='cata'){const gr=g.createRadialGradient(18,-3,1,18,-3,11);gr.addColorStop(0,'#fff');gr.addColorStop(.35,el);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(18,-3,11,0,TAU);g.fill();g.strokeStyle=c.acc;g.lineWidth=1;g.beginPath();g.ellipse(18,-3,10,3,.4,0,TAU);g.stroke();}
    if(W==='guante'){g.fillStyle=el;g.beginPath();g.arc(-11,9,4.8,0,TAU);g.arc(11,9,4.8,0,TAU);g.fill();g.fillStyle='rgba(255,255,255,.6)';g.beginPath();g.arc(-12,7.5,1.6,0,TAU);g.arc(10,7.5,1.6,0,TAU);g.fill();}
    if(W==='naipes'){[[-.45,'#fff'],[0,c.acc],[.45,'#fff']].forEach(([a,col])=>{g.save();g.translate(15,4);g.rotate(a);g.fillStyle=col;this.rr(g,-3.5,-10,7.5,11,1.5);g.fillStyle=el;this.star(g,.3,-4.5,2.6);g.restore();});}
    g.restore();},
  foeSprite(shape,col,col2,R){const k=shape+col+col2+R;if(this._spr[k])return this._spr[k];const S=2,D=R*2+24,cv=document.createElement('canvas');cv.width=D*S;cv.height=D*S;const g=cv.getContext('2d');g.scale(S,S);g.translate(D/2,D/2);
    this.drawFoe(g,shape,col,col2,R);
    // brillo y sombreado encima
    g.globalCompositeOperation='source-atop';const gr=g.createRadialGradient(-R*.4,-R*.5,R*.1,0,0,R*1.4);gr.addColorStop(0,'rgba(255,255,255,.28)');gr.addColorStop(.5,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(0,0,0,.28)');g.fillStyle=gr;g.fillRect(-D/2,-D/2,D,D);
    return this._spr[k]=this.outline(cv,'rgba(16,12,24,.9)',2);},
  // brillo de un color (para proyectiles y partículas)
  glow(c,R){const k='glow'+c+R;if(this._spr[k])return this._spr[k];const cv=document.createElement('canvas');cv.width=cv.height=R*2;const g=cv.getContext('2d');const gr=g.createRadialGradient(R,R,0,R,R,R);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.18,c);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,R*2,R*2);return this._spr[k]=cv;},
  /* ---------- suelo con textura (patrón sin costuras por bioma) ---------- */
  groundPat(i){const k='gp'+i;if(this._spr[k])return this._spr[k];const B=HS_BIOME[i],N=512,cv=document.createElement('canvas');cv.width=cv.height=N;const g=cv.getContext('2d');let seed=i*977+13;const R=()=>(seed=(seed*16807)%2147483647)/2147483647;
    g.fillStyle=B.g;g.fillRect(0,0,N,N);
    const wrap=(f)=>{for(const dx of [-N,0,N])for(const dy of [-N,0,N]){g.save();g.translate(dx,dy);f();g.restore();}};
    for(let n=0;n<26;n++){const x=R()*N,y=R()*N,r=40+R()*110,c=R()<.5?B.g2:this.shade(B.g,.86);wrap(()=>{const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');g.globalAlpha=.55;g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();g.globalAlpha=1;});}
    const k2=B.deco;
    for(let n=0;n<420;n++){const x=R()*N,y=R()*N,v=R();wrap(()=>{
      if(k2==='tree'||k2==='shroom'){g.strokeStyle=v<.5?this.shade(B.g2,1.25):this.shade(B.g,.75);g.lineWidth=1.3;g.beginPath();g.moveTo(x,y);g.lineTo(x-2,y-5);g.moveTo(x+2,y);g.lineTo(x+3,y-6);g.stroke();if(v>.97){g.fillStyle=B.d[1+(n%2)];g.beginPath();g.arc(x,y-6,2.2,0,TAU);g.fill();}}
      else if(k2==='rock'){if(v<.4){g.fillStyle=this.shade(B.g,v<.2?.8:1.15);g.beginPath();g.ellipse(x,y,2+v*5,1.5+v*3,0,0,TAU);g.fill();}else if(v>.93){g.strokeStyle=this.shade(B.g,.75);g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+14,y+4);g.lineTo(x+22,y+1);g.stroke();}}
      else if(k2==='lava'){if(v>.9){g.strokeStyle='rgba(255,107,61,.55)';g.lineWidth=1.4;g.beginPath();g.moveTo(x,y);g.lineTo(x+10,y+6);g.lineTo(x+18,y+3);g.stroke();}else if(v<.3){g.fillStyle=this.shade(B.g,.7);g.fillRect(x,y,2,2);}}
      else if(k2==='ice'){if(v>.9){g.strokeStyle='rgba(255,255,255,.6)';g.lineWidth=1;g.beginPath();g.moveTo(x-3,y);g.lineTo(x+3,y);g.moveTo(x,y-3);g.lineTo(x,y+3);g.stroke();}else if(v<.25){g.fillStyle='rgba(255,255,255,.35)';g.fillRect(x,y,2,2);}}
      else if(k2==='water'){if(v>.9){g.strokeStyle='rgba(191,232,255,.35)';g.lineWidth=1.2;g.beginPath();g.arc(x,y,6+v*6,.3,2.8);g.stroke();}}
      else if(k2==='crystal'){if(v>.94){g.fillStyle='rgba(181,123,255,.45)';g.beginPath();g.moveTo(x,y-5);g.lineTo(x+2.5,y);g.lineTo(x,y+3);g.lineTo(x-2.5,y);g.fill();}else if(v<.3){g.fillStyle=this.shade(B.g,1.2);g.fillRect(x,y,1.5,1.5);}}
      else if(k2==='cards'){if(v>.96){g.fillStyle='rgba(240,107,200,.3)';this.star(g,x,y,4);}else if(v<.2){g.fillStyle='rgba(255,201,60,.18)';g.fillRect(x,y,2,2);}}});}
    // baldosas sueltas / camino
    if(k2==='cards'||k2==='rock'){g.strokeStyle='rgba(0,0,0,.12)';g.lineWidth=1;for(let x=0;x<=N;x+=64){g.beginPath();g.moveTo(x,0);g.lineTo(x,N);g.stroke();}for(let y=0;y<=N;y+=64){g.beginPath();g.moveTo(0,y);g.lineTo(N,y);g.stroke();}}
    return this._spr[k]=cv;},
  drawGround(g,cx,cy,W,H){const G=this.G;const paint=(i,alpha)=>{const pat=this.groundPat(i),N=512;g.globalAlpha=alpha;const ox=((cx%N)+N)%N,oy=((cy%N)+N)%N;for(let x=-ox;x<W;x+=N)for(let y=-oy;y<H;y+=N)g.drawImage(pat,x,y);
      const B=HS_BIOME[i],D=170,a0=Math.floor(cx/D),b0=Math.floor(cy/D);const list=[];for(let a=a0-1;a<=a0+W/D+1;a++)for(let b=b0-1;b<=b0+H/D+1;b++){const h=((a*73856093)^(b*19349663))>>>0;if(h%7>2)continue;list.push([a*D+(h%113)-cx,b*D+((h>>8)%113)-cy,h]);}
      list.sort((p,q)=>p[1]-q[1]).forEach(([x,y,h])=>this.deco(g,B,x,y,h));g.globalAlpha=1;};
    paint(G.biome,1);if(G.biomeFade>0)paint(G.biomePrev,G.biomeFade/2.6);},
  deco(g,B,x,y,h){const k=B.deco,c=B.d[h%3],S=this.shade.bind(this),t=this.G?this.G.t:0;
    g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(x,y+10,16,5,0,0,TAU);g.fill();
    if(k==='tree'){g.fillStyle='#5A3A2A';this.rr(g,x-3.5,y-2,7,14,2);[[0,-12,17,B.d[0]],[-8,-6,11,S(B.d[0],.85)],[8,-6,11,S(B.d[0],.9)],[-3,-17,8,S(B.d[0],1.2)]].forEach(([dx,dy,r,cc])=>{g.fillStyle=cc;g.beginPath();g.arc(x+dx,y+dy,r,0,TAU);g.fill();});if(h%4===0){g.fillStyle=B.d[2];g.beginPath();g.arc(x+6,y-14,2.2,0,TAU);g.arc(x-6,y-8,2.2,0,TAU);g.fill();}}
    else if(k==='rock'){g.fillStyle=S(c,.85);g.beginPath();g.moveTo(x-16,y+8);g.lineTo(x-12,y-8);g.lineTo(x+2,y-13);g.lineTo(x+15,y-4);g.lineTo(x+16,y+8);g.closePath();g.fill();g.fillStyle=S(c,1.15);g.beginPath();g.moveTo(x-12,y-8);g.lineTo(x+2,y-13);g.lineTo(x+4,y-3);g.lineTo(x-8,y);g.closePath();g.fill();if(h%3===0){g.fillStyle='#4FA88A';g.fillRect(x-2,y-16,4,9);}}
    else if(k==='crystal'||k==='ice'){const cc=k==='ice'?'#E8F6FF':c;[[0,-22,8],[-9,-12,5],[8,-10,6]].forEach(([dx,dy,w])=>{g.fillStyle=S(cc,.85);g.beginPath();g.moveTo(x+dx,y+dy);g.lineTo(x+dx+w,y+6);g.lineTo(x+dx-w,y+6);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.moveTo(x+dx,y+dy);g.lineTo(x+dx+w*.35,y+6);g.lineTo(x+dx,y+6);g.closePath();g.fill();});
      if(k==='crystal'){g.globalCompositeOperation='lighter';g.globalAlpha*=.35+.15*Math.sin(t*2+h);g.drawImage(this.glow(HS_EL.r.c,26),x-26,y-30);g.globalAlpha=1;g.globalCompositeOperation='source-over';}}
    else if(k==='shroom'){g.fillStyle='#F2F2C0';this.rr(g,x-3.5,y-6,7,14,2);g.fillStyle=c;g.beginPath();g.arc(x,y-6,12,Math.PI,0);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(x-5,y-11,2,0,TAU);g.arc(x+4,y-13,1.6,0,TAU);g.fill();
      if(h%2===0){g.globalCompositeOperation='lighter';g.globalAlpha*=.3;g.drawImage(this.glow(c,22),x-22,y-28);g.globalAlpha=1;g.globalCompositeOperation='source-over';}}
    else if(k==='water'){g.fillStyle='rgba(63,168,255,.35)';g.beginPath();g.ellipse(x,y,30,12,0,0,TAU);g.fill();g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=1.2;g.beginPath();g.ellipse(x,y,14+6*Math.sin(t*2+h),5+2*Math.sin(t*2+h),0,0,TAU);g.stroke();}
    else if(k==='lava'){g.fillStyle='#2A1A1A';g.beginPath();g.ellipse(x,y,26,11,0,0,TAU);g.fill();const gr=g.createRadialGradient(x,y,2,x,y,22);gr.addColorStop(0,'#FFE14D');gr.addColorStop(.5,'#FF6B3D');gr.addColorStop(1,'rgba(255,107,61,0)');g.fillStyle=gr;g.globalAlpha*=.75+.25*Math.sin(t*3+h);g.beginPath();g.ellipse(x,y,22,9,0,0,TAU);g.fill();g.globalAlpha=1;}
    else if(k==='cards'){g.save();g.translate(x,y);g.rotate((h%10-5)*.12);g.fillStyle='#F7F2FF';this.rr(g,-9,-13,18,25,2);g.fillStyle=c;this.star(g,0,0,5);g.fillStyle=c;g.font='bold 7px system-ui';g.fillText('A',-7,-6);g.restore();}},
  /* ---------- partículas ---------- */
  part(x,y,c,n,o){const G=this.G;if(!G)return;o=o||{};const P=G.parts||(G.parts=[]);for(let i=0;i<n;i++){if(P.length>650)P.shift();const a=o.a!=null?o.a+(Math.random()-.5)*(o.sp||1):Math.random()*TAU,v=(o.v||120)*(.4+Math.random()*.8);
    P.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-(o.up||0),life:(o.life||.5)*(.6+Math.random()*.6),max:o.life||.5,c,s:(o.s||3)*(.6+Math.random()*.7),glow:o.glow!==false,grav:o.grav||0,drag:o.drag||2.5,k:o.k});}},
  updParts(dt){const G=this.G;if(!G.parts)return;G.parts=G.parts.filter(p=>{p.life-=dt;p.vx*=1-p.drag*dt;p.vy=p.vy*(1-p.drag*dt)+p.grav*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;return p.life>0;});
    if(G.dying)G.dying=G.dying.filter(d=>(d.life-=dt)>0);},
  hit(e,d,el,m,src,o){const was=e&&!e.dead,hp=e?e.hp:0;const r=_hit.call(this,e,d,el,m,src,o);if(was&&this.G&&r>0){const c=HS_EL[el]?HS_EL[el].c:'#fff';if(src!=='react'&&Math.random()<.6)this.part(e.x,e.y,c,2,{v:160,life:.28,s:2.6});e.squash=.12;}return r;},
  kill(e,m){const G=this.G;if(!e||e.dead)return _kill.call(this,e,m);const spr=this.foeSprite(e.shape,e.col,e.col2,Math.round(e.r));(G.dying=G.dying||[]).push({x:e.x,y:e.y,spr,D:e.r*2+24,life:.28,max:.28});if(G.dying.length>60)G.dying.shift();
    this.part(e.x,e.y,e.col,e.boss?40:e.elite?14:6,{v:e.boss?260:150,life:e.boss?1:.45,s:e.boss?5:3});if(e.boss||e.guard){G.shake=.6;this.part(e.x,e.y,'#FFE14D',30,{v:340,life:1.2,s:4});}
    return _kill.call(this,e,m);},
  breakFoe(e,el){_breakFoe.call(this,e,el);this.part(e.x,e.y,'#FFFFFF',18,{v:260,life:.6,s:3});this.part(e.x,e.y,HS_EL[el].c,18,{v:200,life:.7,s:4});this.G.shake=Math.max(this.G.shake||0,.25);},
  levelUp(){const G=this.G;this.part(G.p.x,G.p.y,'#6BE3FF',30,{v:220,life:.9,s:3.5,up:60});this.part(G.p.x,G.p.y,'#FFE14D',16,{v:160,life:1,s:3});_levelUp.call(this);},
  ult(){const m=this.am(),ok=m&&m.alive&&m.en>=m.c.u.cost;_ult.call(this);if(ok){const G=this.G;this.part(G.p.x,G.p.y,HS_EL[m.c.el].c,40,{v:320,life:.8,s:4});}},
  addFoe(F,o){const e=_addFoe.call(this,F,o);if(e)e.age=0;return e;},
  num(x,y,d,el,crit){const G=this.G;if(!crit&&G.txt.length>32)return;if(G.txt.length>120)G.txt.shift();G.txt.push({x:x+(Math.random()-.5)*16,y,t:String(Math.round(d)),c:crit?'#FFE14D':HS_EL[el]?HS_EL[el].c:'#fff',life:.8,max:.8,big:crit});},
  txtAt(x,y,t,c,s){this.G.txt.push({x,y,t,c,life:1.2,max:1.2,big:true,s:s||1,word:1});},
  /* ---------- dibujo ---------- */
  draw(){const G=this.G,g=G.ctx,P=G.p,W=G.W,H=G.H;g.setTransform(G.dpr,0,0,G.dpr,0,0);g.imageSmoothingEnabled=true;
    if(!G.over||G.modal)this.updParts(Math.min(.05,(G.last2?(performance.now()-G.last2)/1000:0)*(G.slowT>0?.2:1)));G.last2=performance.now();
    if(!G.trail)G.trail=[];
    let sx=0,sy=0;if(G.shake>0){const k=Math.min(1,G.shake)*10;sx=(Math.random()-.5)*k;sy=(Math.random()-.5)*k;}
    const cx=Math.round(P.x-W/2+sx),cy=Math.round(P.y-H/2+sy);
    this.drawGround(g,cx,cy,W,H);
    g.save();g.translate(-cx,-cy);
    if(G.arena){const A=G.arena,c=HS_GUARD[A.el].col;g.fillStyle='rgba(6,4,14,.62)';g.beginPath();g.rect(cx,cy,W,H);g.arc(A.cx,A.cy,A.R,0,TAU,true);g.fill();
      g.strokeStyle=c;g.lineWidth=5;g.beginPath();g.arc(A.cx,A.cy,A.R,0,TAU);g.stroke();g.globalCompositeOperation='lighter';for(let i=0;i<24;i++){const a=i/24*TAU+G.t*.3;g.globalAlpha=.4;g.drawImage(this.glow(c,18),A.cx+Math.cos(a)*A.R-18,A.cy+Math.sin(a)*A.R-18);}g.globalAlpha=1;g.globalCompositeOperation='source-over';
      g.strokeStyle=c;g.globalAlpha=.25;g.lineWidth=2;g.setLineDash([10,14]);g.beginPath();g.arc(A.cx,A.cy,A.R*.55,G.t*.5,G.t*.5+TAU);g.stroke();g.setLineDash([]);g.globalAlpha=1;}
    // zonas
    for(const z of G.zones){const c=HS_EL[z.el]?HS_EL[z.el].c:'#fff';
      if(z.k==='meteor'){const a=1-Math.max(0,z.t)/.6;g.strokeStyle=c;g.globalAlpha=.75;g.lineWidth=2;g.beginPath();g.arc(z.x,z.y,z.r,0,TAU);g.stroke();g.globalAlpha=.18;g.fillStyle=c;g.beginPath();g.arc(z.x,z.y,z.r*a,0,TAU);g.fill();g.globalAlpha=1;
        const my=z.y-z.t*520;g.globalCompositeOperation='lighter';g.drawImage(this.glow(c,22),z.x-22+z.t*80,my-22);g.strokeStyle=c;g.lineWidth=5;g.globalAlpha=.5;g.beginPath();g.moveTo(z.x+z.t*80,my);g.lineTo(z.x+z.t*80+30,my-60);g.stroke();g.globalAlpha=1;g.globalCompositeOperation='source-over';}
      else if(z.k==='mine'){g.fillStyle='#2A2230';g.beginPath();g.arc(z.x,z.y,8,0,TAU);g.fill();g.fillStyle=c;g.globalAlpha=.6+.4*Math.sin(G.t*8);this.star(g,z.x,z.y,6);g.globalAlpha=1;}
      else{const cc=z.k==='heal'?'#7CFFB2':c;const gr=g.createRadialGradient(z.x,z.y,z.r*.2,z.x,z.y,z.r);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,cc);g.globalAlpha=.32;g.fillStyle=gr;g.beginPath();g.arc(z.x,z.y,z.r,0,TAU);g.fill();g.globalAlpha=.6;g.strokeStyle=cc;g.lineWidth=1.5;g.beginPath();g.arc(z.x,z.y,z.r,0,TAU);g.stroke();g.globalAlpha=1;
        if(z.pull){g.strokeStyle=cc;g.lineWidth=2.5;for(let i=0;i<4;i++){g.globalAlpha=.7-i*.12;g.beginPath();g.arc(z.x,z.y,z.r*(.25+i*.2),G.t*5+i*1.6,G.t*5+i*1.6+2);g.stroke();}g.globalAlpha=1;}
        if(z.k==='heal'&&Math.random()<.3)this.part(z.x+(Math.random()-.5)*z.r*1.4,z.y+(Math.random()-.5)*z.r*1.2,'#7CFFB2',1,{v:20,up:40,life:.8,s:2.5,drag:1});}}
    // avisos de los jefes
    for(const z of G.tele){const pulse=.3+.2*Math.sin(G.t*18);if(z.k==='circle'){g.fillStyle=`rgba(255,59,59,${pulse})`;g.beginPath();g.arc(z.x,z.y,z.r,0,TAU);g.fill();g.strokeStyle='rgba(255,90,90,.9)';g.lineWidth=2;g.beginPath();g.arc(z.x,z.y,z.r,0,TAU);g.stroke();g.fillStyle='rgba(255,120,120,.35)';g.beginPath();g.arc(z.x,z.y,z.r*(1-Math.max(0,z.t)),0,TAU);g.fill();}
      else{g.save();g.translate(z.x,z.y);g.rotate(Math.atan2(z.uy,z.ux));g.fillStyle=`rgba(255,59,59,${pulse})`;g.fillRect(0,-z.w,z.L,z.w*2);g.strokeStyle='rgba(255,90,90,.9)';g.lineWidth=2;g.strokeRect(0,-z.w,z.L,z.w*2);g.restore();}}
    // recogibles
    g.globalCompositeOperation='lighter';for(const gm of G.gems){const c=gm.big?'#FFC93C':'#6BE3FF';g.globalAlpha=.55;g.drawImage(this.glow(c,10),gm.x-10,gm.y-10);}g.globalAlpha=1;g.globalCompositeOperation='source-over';
    for(const gm of G.gems){const c=gm.big?'#FFC93C':'#6BE3FF',s=gm.big?7:5,b=Math.sin(G.t*5+gm.x)*1.5;g.fillStyle=c;g.beginPath();g.moveTo(gm.x,gm.y-s+b);g.lineTo(gm.x+s*.7,gm.y+b);g.lineTo(gm.x,gm.y+s+b);g.lineTo(gm.x-s*.7,gm.y+b);g.fill();g.fillStyle='rgba(255,255,255,.75)';g.beginPath();g.moveTo(gm.x,gm.y-s+b);g.lineTo(gm.x+s*.35,gm.y+b);g.lineTo(gm.x,gm.y+b);g.fill();}
    for(const p of G.picks)this.drawPick(g,p);
    if(G.portal)this.drawPortal(g,G.portal);
    // invocaciones
    for(const s of G.sums)this.drawSum(g,s);
    // enemigos (los que mueren se desvanecen)
    for(const d of (G.dying||[])){const a=d.life/d.max,sc=1+(1-a)*.5;g.globalAlpha=a;g.save();g.translate(d.x,d.y);g.scale(sc,sc*(.6+a*.4));g.filter='brightness(2)';g.drawImage(d.spr,-d.D/2,-d.D/2,d.D,d.D);g.restore();g.globalAlpha=1;}
    const vis=G.foes.filter(e=>!e.dead&&Math.abs(e.x-P.x)<W/2+90&&Math.abs(e.y-P.y)<H/2+90).sort((a,b)=>a.y-b.y);
    for(const e of vis)this.drawFoeAt(g,e);
    // jugador
    this.drawPlayer(g);
    // disparos
    g.globalCompositeOperation='lighter';
    for(const s of G.shots){const c=HS_EL[s.el].c;if(s.wave||s.boom)continue;const R=s.r*3;g.drawImage(this.glow(c,Math.round(R)),s.x-R,s.y-R,R*2,R*2);const sp=Math.hypot(s.vx,s.vy)||1;g.strokeStyle=c;g.globalAlpha=.45;g.lineWidth=s.r*1.2;g.lineCap='round';g.beginPath();g.moveTo(s.x,s.y);g.lineTo(s.x-s.vx/sp*s.r*4,s.y-s.vy/sp*s.r*4);g.stroke();g.globalAlpha=1;}
    g.globalCompositeOperation='source-over';
    for(const s of G.shots){const c=HS_EL[s.el].c;
      if(s.wave){g.save();g.translate(s.x,s.y);g.rotate(Math.atan2(s.vy,s.vx));const gr=g.createLinearGradient(-20,0,16,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,c);g.fillStyle=gr;g.globalAlpha=.75;g.beginPath();g.ellipse(0,0,18,s.r,0,-Math.PI/2,Math.PI/2);g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.ellipse(0,0,18,s.r,0,-Math.PI/2,Math.PI/2);g.stroke();g.restore();g.globalAlpha=1;continue;}
      if(s.boom){g.save();g.translate(s.x,s.y);g.rotate(s.spin);g.strokeStyle=c;g.lineWidth=5;g.beginPath();g.arc(0,0,12,0,3.4);g.stroke();g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.arc(0,0,12,0,3.4);g.stroke();g.restore();continue;}
      if(s.star){g.fillStyle=c;this.star(g,s.x,s.y,s.r+3);g.fillStyle='#fff';this.star(g,s.x,s.y,s.r*.6);continue;}
      g.fillStyle='#fff';g.beginPath();g.arc(s.x,s.y,s.r*.55,0,TAU);g.fill();}
    for(const b of G.ebul){g.globalCompositeOperation='lighter';g.globalAlpha=.6;g.drawImage(this.glow(b.c||'#FF5A5A',Math.round(b.r*2.4)),b.x-b.r*2.4,b.y-b.r*2.4);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.fillStyle=b.c||'#FF8A8A';g.beginPath();g.arc(b.x,b.y,b.r,0,TAU);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(b.x,b.y,b.r*.45,0,TAU);g.fill();g.strokeStyle='rgba(20,10,20,.8)';g.lineWidth=1.5;g.beginPath();g.arc(b.x,b.y,b.r,0,TAU);g.stroke();}
    // efectos de ataque
    for(const f of G.fx)this.drawFx(g,f);
    // partículas
    g.globalCompositeOperation='lighter';for(const p of (G.parts||[])){const a=p.life/p.max;g.globalAlpha=Math.min(1,a*1.4);if(p.glow){const R=p.s*2.2;g.drawImage(this.glow(p.c,8),p.x-R,p.y-R,R*2,R*2);}else{g.fillStyle=p.c;g.fillRect(p.x-p.s/2,p.y-p.s/2,p.s,p.s);}}g.globalAlpha=1;g.globalCompositeOperation='source-over';
    // números
    g.textAlign='center';g.lineJoin='round';for(const t of G.txt){const a=t.life/(t.max||1),pop=a>.8?1+(a-.8)*2.5:1;g.globalAlpha=Math.min(1,t.life*2.5);const fs=Math.round((t.big?(t.word?17:16):12)*(t.s||1)*pop);g.font=`${t.big?'800 ':'600 '}${fs}px system-ui`;g.lineWidth=t.word?5:3.5;g.strokeStyle='rgba(14,10,24,.8)';g.strokeText(t.t,t.x,t.y);g.fillStyle=t.c;g.fillText(t.t,t.x,t.y);}g.globalAlpha=1;
    g.restore();
    this.drawWeather(g,W,H);
    // luz: viñeta y tono del bioma
    g.drawImage(this.vignette(W,H),0,0,W,H);
    for(const f of G.fx){if(f.k==='flash'){g.globalAlpha=f.life/f.max*.4;g.fillStyle=f.c;g.fillRect(0,0,W,H);g.globalAlpha=1;}if(f.k==='mask')this.drawMask(g,W,H,f);}
    if(G.hurtT>0){const gr=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.7);gr.addColorStop(0,'rgba(255,40,40,0)');gr.addColorStop(1,`rgba(255,30,30,${G.hurtT*1.6})`);g.fillStyle=gr;g.fillRect(0,0,W,H);}
    const m=this.am();if(m&&m.hp<m.max*.25&&!G.over){const gr=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.7);gr.addColorStop(0,'rgba(255,0,0,0)');gr.addColorStop(1,`rgba(200,0,30,${.18+.1*Math.sin(G.t*6)})`);g.fillStyle=gr;g.fillRect(0,0,W,H);}
    if(G.slowT>0){g.fillStyle=`rgba(40,10,60,${Math.min(.35,G.slowT*.3)})`;g.fillRect(0,0,W,H);}
    this.drawHUD(g,W,H);},
  vignette(W,H){const k='vig'+W+'x'+H;if(this._spr[k])return this._spr[k];const cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');const gr=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.38,W/2,H/2,Math.hypot(W,H)*.55);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(6,4,16,.5)');g.fillStyle=gr;g.fillRect(0,0,W,H);return this._spr[k]=cv;},
  drawPlayer(g){const G=this.G,P=G.p,m=this.am();if(!m)return;
    // polvo al andar y estela
    if(P.mv&&Math.random()<.25)this.part(P.x+(Math.random()-.5)*10,P.y+20,'rgba(230,220,200,.8)',1,{v:20,up:10,life:.45,s:3,glow:false,drag:3});
    G.trail.push({x:P.x,y:P.y});if(G.trail.length>6)G.trail.shift();
    const pose=P.mv?[0,1,0,-1][Math.floor(G.t*10)%4]:0,spr=this.sprite(m.c,m.alt,pose),bob=P.mv?Math.abs(Math.sin(G.t*10))*-2:Math.sin(G.t*3)*1;
    // aura del elemento a los pies
    g.globalCompositeOperation='lighter';g.globalAlpha=.35+.1*Math.sin(G.t*4);g.drawImage(this.glow(HS_EL[m.c.el].c,34),P.x-34,P.y-14,68,40);g.globalAlpha=1;g.globalCompositeOperation='source-over';
    if(P.inv>.3||m.tron>0||G.caras>0){G.trail.forEach((t,i)=>{g.globalAlpha=i/G.trail.length*.25;g.save();g.translate(t.x,t.y+bob);if(P.face<0)g.scale(-1,1);g.drawImage(spr,-42,-58,84,94);g.restore();});g.globalAlpha=1;}
    g.save();g.translate(P.x,P.y+bob);if(P.face<0)g.scale(-1,1);if(P.inv>0&&Math.floor(G.t*20)%2)g.globalAlpha=.55;const sq=m.squash>0?1-m.squash:1;g.scale(1/sq*.98+.02,sq);g.drawImage(spr,-42,-58,84,94);g.restore();g.globalAlpha=1;
    (G.cameos||[]).forEach(c=>{const a=c.life/c.max,inA=Math.min(1,(1-a)*6),outA=Math.min(1,a*3),x=P.x+c.side*(52+(1-inA)*20),y=P.y-4-(1-a)*10;g.globalAlpha=inA*outA;
      g.globalCompositeOperation='lighter';g.drawImage(this.glow(HS_EL[c.c.el].c,40),x-40,y-50);g.globalCompositeOperation='source-over';g.save();g.translate(x,y);if(c.side>0)g.scale(-1,1);g.drawImage(this.sprite(c.c,c.alt),-34,-48,68,76);g.restore();
      g.font='800 11px system-ui';g.textAlign='center';g.lineWidth=4;g.strokeStyle='rgba(14,10,24,.8)';g.strokeText(c.c.n,x,y-52);g.fillStyle=HS_EL[c.c.el].c;g.fillText(c.c.n,x,y-52);g.globalAlpha=1;});
    if(m.tron>0){g.globalCompositeOperation='lighter';for(let i=0;i<3;i++){const a=G.t*6+i*2.1;g.strokeStyle=HS_EL.r.c;g.globalAlpha=.6;g.lineWidth=2;g.beginPath();g.moveTo(P.x+Math.cos(a)*26,P.y-10+Math.sin(a)*30);g.lineTo(P.x+Math.cos(a+.4)*34,P.y-10+Math.sin(a+.4)*20);g.lineTo(P.x+Math.cos(a+.7)*24,P.y-10+Math.sin(a+.7)*34);g.stroke();}g.globalAlpha=1;g.globalCompositeOperation='source-over';if(Math.random()<.3)this.part(P.x+(Math.random()-.5)*40,P.y-10+(Math.random()-.5)*50,HS_EL.r.c,1,{v:40,life:.3,s:2.5});}
    if(G.shield>0){const a=.5+.15*Math.sin(G.t*4);g.strokeStyle=`rgba(255,214,120,${a})`;g.fillStyle='rgba(227,180,95,.1)';g.lineWidth=2.5;g.beginPath();for(let i=0;i<6;i++){const an=i/6*TAU+G.t*.5;g.lineTo(P.x+Math.cos(an)*38,P.y-8+Math.sin(an)*38);}g.closePath();g.fill();g.stroke();}
    if(G.caras>0){g.font='18px system-ui';g.textAlign='center';g.fillText('🎭',P.x+Math.sin(G.t*3)*6,P.y-66);}
    if(G.eye){const e=G.eye,c=HS_EL.r.c;g.globalCompositeOperation='lighter';g.globalAlpha=.6;g.drawImage(this.glow(c,30),e.ox-30,e.oy-30);g.globalAlpha=1;g.globalCompositeOperation='source-over';
      g.fillStyle='#1A1422';g.beginPath();g.ellipse(e.ox,e.oy,16,10,0,0,TAU);g.fill();g.strokeStyle=c;g.lineWidth=2.5;g.stroke();g.fillStyle=c;g.beginPath();g.arc(e.ox,e.oy,5.5,0,TAU);g.fill();g.fillStyle='#FFE14D';g.beginPath();g.arc(e.ox,e.oy,2.5,0,TAU);g.fill();
      g.strokeStyle='rgba(181,123,255,.5)';g.lineWidth=1.5;g.beginPath();g.arc(e.ox,e.oy,22,G.t*3,G.t*3+1.5);g.stroke();g.beginPath();g.arc(e.ox,e.oy,22,G.t*3+Math.PI,G.t*3+Math.PI+1.5);g.stroke();}},
  drawSum(g,s){const G=this.G,c=HS_EL[s.el].c;
    if(s.k==='orb'){g.globalCompositeOperation='lighter';g.drawImage(this.glow(c,20),s.x-20,s.y-20);g.globalCompositeOperation='source-over';g.fillStyle='#fff';g.beginPath();g.arc(s.x,s.y,4.5,0,TAU);g.fill();}
    if(s.k==='turret'){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(s.x,s.y+12,13,4,0,0,TAU);g.fill();g.fillStyle='#3A3448';g.beginPath();g.moveTo(s.x-11,s.y+11);g.lineTo(s.x+11,s.y+11);g.lineTo(s.x+6,s.y-4);g.lineTo(s.x-6,s.y-4);g.closePath();g.fill();
      g.globalCompositeOperation='lighter';g.globalAlpha=.7;g.drawImage(this.glow(c,18),s.x-18,s.y-28);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.fillStyle=c;g.beginPath();g.arc(s.x,s.y-10,8,0,TAU);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(s.x+2,s.y-12,3,0,TAU);g.fill();
      const a=Math.min(1,s.life/2);g.fillStyle='rgba(0,0,0,.5)';g.fillRect(s.x-10,s.y+14,20,3);g.fillStyle=c;g.fillRect(s.x-10,s.y+14,20*Math.min(1,s.life/10),3);g.globalAlpha=1;}
    if(s.k==='pet'){const R=s.big?22:14,b=Math.sin(G.t*6+s.x*.1)*3;g.globalCompositeOperation='lighter';g.globalAlpha=.5;g.drawImage(this.glow(c,R*2),s.x-R*2,s.y-R*2+b);g.globalAlpha=1;g.globalCompositeOperation='source-over';
      g.fillStyle=c;g.globalAlpha=.9;g.beginPath();g.moveTo(s.x-R,s.y+R*.6+b);g.quadraticCurveTo(s.x-R,s.y-R+b,s.x,s.y-R*1.1+b);g.quadraticCurveTo(s.x+R,s.y-R+b,s.x+R,s.y+R*.6+b);g.lineTo(s.x+R*.45,s.y+R*.15+b);g.lineTo(s.x,s.y+R*.6+b);g.lineTo(s.x-R*.45,s.y+R*.15+b);g.closePath();g.fill();g.globalAlpha=1;
      g.fillStyle='#fff';g.beginPath();g.ellipse(s.x-R*.35,s.y-R*.2+b,R*.2,R*.26,0,0,TAU);g.ellipse(s.x+R*.35,s.y-R*.2+b,R*.2,R*.26,0,0,TAU);g.fill();g.fillStyle='#1A1422';g.beginPath();g.arc(s.x-R*.3,s.y-R*.15+b,R*.09,0,TAU);g.arc(s.x+R*.4,s.y-R*.15+b,R*.09,0,TAU);g.fill();}},
  drawPortal(g,p){const G=this.G,c=HS_GUARD[p.el].col;g.globalCompositeOperation='lighter';g.globalAlpha=.6;g.drawImage(this.glow(c,70),p.x-70,p.y-80,140,160);g.globalAlpha=1;g.globalCompositeOperation='source-over';
    g.save();g.translate(p.x,p.y);for(let i=0;i<5;i++){g.rotate(G.t*.8+i);g.strokeStyle=i%2?c:'#fff';g.globalAlpha=.7-i*.1;g.lineWidth=3;g.beginPath();g.ellipse(0,0,28+i*5,40+i*6,0,0,4);g.stroke();}g.restore();g.globalAlpha=1;
    const gr=g.createRadialGradient(p.x,p.y,2,p.x,p.y,34);gr.addColorStop(0,'#fff');gr.addColorStop(.3,c);gr.addColorStop(1,'#14101F');g.fillStyle=gr;g.beginPath();g.ellipse(p.x,p.y,24,36,0,0,TAU);g.fill();
    if(Math.random()<.4)this.part(p.x+(Math.random()-.5)*50,p.y+(Math.random()-.5)*70,c,1,{v:30,up:30,life:.8,s:3});
    g.font='800 13px system-ui';g.textAlign='center';g.lineWidth=4;g.strokeStyle='rgba(14,10,24,.8)';const t=HS_GUARD[p.el].n+' · '+Math.ceil(p.t)+' s';g.strokeText(t,p.x,p.y+62);g.fillStyle=c;g.fillText(t,p.x,p.y+62);},
  drawPick(g,p){const G=this.G,b=Math.sin(G.t*3+p.x)*2;
    if(p.k==='shield'){g.globalCompositeOperation='lighter';g.globalAlpha=.6;g.drawImage(this.glow(HS_EL.t.c,16),p.x-16,p.y-16+b);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.fillStyle=HS_EL.t.c;g.beginPath();g.moveTo(p.x,p.y-10+b);g.lineTo(p.x+8,p.y+b);g.lineTo(p.x,p.y+10+b);g.lineTo(p.x-8,p.y+b);g.fill();g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.moveTo(p.x,p.y-10+b);g.lineTo(p.x+3,p.y+b);g.lineTo(p.x,p.y+b);g.fill();}
    if(p.k==='heal'){g.globalCompositeOperation='lighter';g.globalAlpha=.6;g.drawImage(this.glow('#7CFFB2',16),p.x-16,p.y-16+b);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.fillStyle='#7CFFB2';this.rr(g,p.x-3.5,p.y-10+b,7,20,2);this.rr(g,p.x-10,p.y-3.5+b,20,7,2);}
    if(p.k==='chest'){g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(p.x,p.y+14,20,5,0,0,TAU);g.fill();const c1=p.rich?'#C9A227':'#8A5A2A',c2=p.rich?'#FFE14D':'#C9A227';
      if(p.rich){g.globalCompositeOperation='lighter';g.globalAlpha=.35+.15*Math.sin(G.t*3);g.drawImage(this.glow('#FFC93C',40),p.x-40,p.y-44);g.globalAlpha=1;g.globalCompositeOperation='source-over';}
      g.fillStyle=this.shade(c1,.8);this.rr(g,p.x-17,p.y-2,34,15,3);g.fillStyle=c1;g.beginPath();g.moveTo(p.x-17,p.y-1);g.quadraticCurveTo(p.x,p.y-20,p.x+17,p.y-1);g.closePath();g.fill();g.fillStyle=c2;g.fillRect(p.x-17,p.y-3,34,3.5);g.fillRect(p.x-3,p.y-6,6,9);g.fillRect(p.x-14,p.y-14,3,25);g.fillRect(p.x+11,p.y-14,3,25);
      if(p.open>0){g.strokeStyle='#FFE14D';g.lineWidth=4;g.lineCap='round';g.beginPath();g.arc(p.x,p.y,32,-Math.PI/2,-Math.PI/2+p.open/1.5*TAU);g.stroke();if(Math.random()<.3)this.part(p.x,p.y-6,'#FFE14D',1,{v:60,up:40,life:.5,s:2.5});}}
    if(p.k==='fount'){g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(p.x,p.y+12,22,6,0,0,TAU);g.fill();g.fillStyle='#B5B5C8';this.rr(g,p.x-18,p.y-2,36,14,4);g.fillStyle='#6BE3FF';g.beginPath();g.ellipse(p.x,p.y-2,15,5,0,0,TAU);g.fill();g.fillStyle='#E8E8F0';this.rr(g,p.x-4,p.y-30,8,28,2);g.fillStyle='#E8E8F0';g.beginPath();g.arc(p.x,p.y-32,7,0,TAU);g.fill();
      if(Math.random()<.4)this.part(p.x,p.y-34,'#9BEFFF',1,{a:-Math.PI/2,sp:1.6,v:70,life:.7,s:2.2,grav:160,drag:.5});}
    if(p.k==='altar'){g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(p.x,p.y+12,18,5,0,0,TAU);g.fill();g.fillStyle='#5A4A7A';this.rr(g,p.x-14,p.y-6,28,18,3);g.fillStyle='#7A6A9A';g.fillRect(p.x-16,p.y-8,32,4);g.globalCompositeOperation='lighter';g.globalAlpha=.7;g.drawImage(this.glow('#FFC93C',22),p.x-22,p.y-42);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.fillStyle='#FFE14D';this.star(g,p.x,p.y-20+b,9+Math.sin(G.t*4)*1.5);}},
  drawFoeAt(g,e){const G=this.G,R=Math.round(e.r),spr=this.foeSprite(e.shape,e.col,e.col2,R),D=(e.r*2+24)*1.3;e.age=(e.age||0)+.016;const born=Math.min(1,(e.age||1)/.3);
    const bob=Math.sin(G.t*7+e.x*.05)*1.6,sq=e.squash>0?(e.squash-=.016,1-e.squash*1.2):1;
    if(e.boss||e.guard){g.globalCompositeOperation='lighter';g.globalAlpha=.25+.1*Math.sin(G.t*3);g.drawImage(this.glow(e.col2||'#FF5A5A',Math.round(e.r*2)),e.x-e.r*2,e.y-e.r*2);g.globalAlpha=1;g.globalCompositeOperation='source-over';}
    if(e.elite||e.boss||e.guard){const c=e.gold?'#FFE14D':e.boss||e.guard?'#FF5A5A':'#FFC93C';g.strokeStyle=c;g.lineWidth=2.5;g.globalAlpha=.8;g.beginPath();g.ellipse(e.x,e.y+e.r*.8,e.r*1.1,e.r*.4,0,0,TAU);g.stroke();g.globalAlpha=1;if(e.gold&&Math.random()<.3)this.part(e.x+(Math.random()-.5)*e.r*2,e.y+(Math.random()-.5)*e.r*2,'#FFE14D',1,{v:20,up:30,life:.6,s:2.5});}
    g.save();g.globalAlpha=born;g.translate(e.x,e.y+bob+(1-born)*14);g.scale((2-sq)*(.6+born*.4),sq*(.6+born*.4));
    if(e.hitT>0)g.filter='brightness(2.4) saturate(.5)';else if(e.frozen>0)g.filter='saturate(.25) brightness(1.5) hue-rotate(160deg)';else if(e.fused&&Math.floor(G.t*12)%2)g.filter='brightness(2.6)';else if(e.broken>0)g.filter='brightness(.85)';
    g.drawImage(spr,-D/2,-D/2,D,D);g.restore();g.globalAlpha=1;
    if(e.frozen>0){g.fillStyle='rgba(191,232,255,.35)';g.beginPath();g.moveTo(e.x-e.r,e.y+e.r*.8);g.lineTo(e.x-e.r*.6,e.y-e.r);g.lineTo(e.x+e.r*.7,e.y-e.r*.9);g.lineTo(e.x+e.r,e.y+e.r*.8);g.closePath();g.fill();}
    if(e.sh>0){g.strokeStyle='rgba(139,230,255,.85)';g.lineWidth=2;g.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU;g.lineTo(e.x+Math.cos(a)*(e.r+5),e.y+Math.sin(a)*(e.r+5));}g.closePath();g.stroke();}
    if(e.burn>0&&Math.random()<.2)this.part(e.x+(Math.random()-.5)*e.r,e.y-e.r*.3,HS_EL.f.c,1,{v:15,up:50,life:.5,s:3});
    if(e.shock>0&&Math.random()<.15)this.part(e.x+(Math.random()-.5)*e.r*1.6,e.y+(Math.random()-.5)*e.r*1.6,HS_EL.r.c,1,{v:60,life:.2,s:2.5});
    if(e.aura){const c=HS_EL[e.aura.el].c;g.globalCompositeOperation='lighter';g.globalAlpha=.8;g.drawImage(this.glow(c,9),e.x-9,e.y-e.r-17);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.font='10px system-ui';g.textAlign='center';g.fillText(HS_EL[e.aura.el].ic,e.x,e.y-e.r-8);}
    if(e.mark>0){g.save();g.translate(e.x,e.y);g.rotate(G.t*2);g.strokeStyle=HS_EL.x.c;g.lineWidth=1.5;g.beginPath();g.arc(0,0,e.r+7,0,1.2);g.moveTo(Math.cos(Math.PI)*(e.r+7),0);g.arc(0,0,e.r+7,Math.PI,Math.PI+1.2);g.stroke();g.restore();}
    if(e.elite&&!e.boss){const w=Math.max(30,e.r*2.2),y=e.y+e.r+8;g.fillStyle='rgba(10,8,18,.75)';this.rr(g,e.x-w/2-1,y-1,w+2,8,3);g.fillStyle='#FF5A5A';g.fillRect(e.x-w/2,y,w*Math.max(0,e.hp/e.max),3.5);g.fillStyle=e.broken>0?'#FFE14D':'#F2F2F2';g.fillRect(e.x-w/2,y+4.5,w*Math.max(0,e.broken>0?1:e.tough/e.toughMax),2);
      e.weak.forEach((k,i)=>{g.fillStyle=HS_EL[k].c;g.beginPath();g.arc(e.x-w/2+5+i*10,y+13,4,0,TAU);g.fill();g.strokeStyle='rgba(10,8,18,.8)';g.lineWidth=1;g.stroke();});}
    if(e.broken>0){g.save();g.translate(e.x,e.y-e.r-12);for(let i=0;i<3;i++){const a=G.t*5+i*2.1;g.fillStyle='#FFE14D';this.star(g,Math.cos(a)*10,Math.sin(a)*4,3.5);}g.restore();}},
  drawFx(g,f){const a=Math.max(0,f.life/f.max);
    if(f.k==='ring'){const r=f.r*(1.1-a*.25);g.globalCompositeOperation='lighter';g.strokeStyle=f.c;g.globalAlpha=a*.9;g.lineWidth=2+a*6;g.beginPath();g.arc(f.x,f.y,r,0,TAU);g.stroke();g.globalAlpha=a*.18;g.fillStyle=f.c;g.beginPath();g.arc(f.x,f.y,r,0,TAU);g.fill();g.globalAlpha=1;g.globalCompositeOperation='source-over';return;}
    if(f.k==='line'){if(!f.pts){f.pts=[];const n=7;for(let i=0;i<=n;i++){const t=i/n;f.pts.push([f.x1+(f.x2-f.x1)*t+(i&&i<n?(Math.random()-.5)*22:0),f.y1+(f.y2-f.y1)*t+(i&&i<n?(Math.random()-.5)*22:0)]);}}
      g.globalCompositeOperation='lighter';g.lineJoin='round';[[f.w*3.5,.3,f.c],[f.w*1.4,.9,f.c],[Math.max(1,f.w*.5),1,'#fff']].forEach(([w,al,c])=>{g.strokeStyle=c;g.globalAlpha=a*al;g.lineWidth=w;g.beginPath();f.pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();});g.globalAlpha=1;g.globalCompositeOperation='source-over';return;}
    if(f.k==='arc'){const t=1-a,a0=f.a-f.w/2,a1=f.a+f.w/2,full=f.w>=TAU-.01;g.globalCompositeOperation='lighter';
      for(let i=0;i<4;i++){const rr=f.r*(.55+i*.13+t*.15);g.strokeStyle=i===3?'#fff':f.c;g.globalAlpha=a*(i===3?.95:.35+i*.15);g.lineWidth=i===3?2.5:6-i;g.lineCap='round';g.beginPath();if(full)g.arc(f.x,f.y,rr,f.a+t*4,f.a+t*4+TAU*.85);else g.arc(f.x,f.y,rr,a0+t*.3,a1-t*.1+(i*.05));g.stroke();}
      g.globalAlpha=a*.16;g.fillStyle=f.c;g.beginPath();g.moveTo(f.x,f.y);g.arc(f.x,f.y,f.r,full?0:a0,full?TAU:a1);g.closePath();g.fill();g.globalAlpha=1;g.globalCompositeOperation='source-over';return;}
    if(f.k==='thrust'){g.save();g.translate(f.x,f.y);g.rotate(Math.atan2(f.uy,f.ux));g.globalCompositeOperation='lighter';g.fillStyle=f.c;g.globalAlpha=a*.55;g.beginPath();g.moveTo(0,-f.w/2*a);g.lineTo(f.L,0);g.lineTo(0,f.w/2*a);g.closePath();g.fill();
      g.globalAlpha=a;g.fillStyle='#fff';g.beginPath();g.moveTo(0,-2);g.lineTo(f.L*(1-(1-a)*.3),0);g.lineTo(0,2);g.closePath();g.fill();g.globalCompositeOperation='source-over';g.restore();g.globalAlpha=1;return;}
    if(f.k==='slash'){g.save();g.translate(f.x,f.y);g.rotate(Math.atan2(f.uy,f.ux));const w=80*(.4+a*.6);g.globalCompositeOperation='lighter';const gr=g.createLinearGradient(0,-w,0,w);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.5,f.c);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.globalAlpha=a;g.fillRect(-f.L/2,-w,f.L,w*2);
      g.fillStyle='#fff';g.fillRect(-f.L/2,-3*a-1,f.L,6*a+2);for(let i=0;i<10;i++){g.globalAlpha=a*.5;g.fillRect(-f.L/2+((i*137+f.max*999)%f.L),-w*.7+((i*53)%(w*1.4)),60,1.5);}g.globalCompositeOperation='source-over';g.restore();g.globalAlpha=1;return;}
    if(f.k==='conf'){g.fillStyle=f.c;g.save();g.translate(f.x,f.y);g.rotate(f.y*.05);g.fillRect(-3,-2,6,4);g.restore();return;}},
  drawMask(g,W,H,f){const a=f.life/f.max,t=1-a;g.save();g.globalAlpha=Math.min(1,a*2.2);
    // telón y foco
    g.fillStyle='rgba(20,6,26,.55)';g.fillRect(0,0,W,H);const cw=W*.18*Math.min(1,t*4);g.fillStyle='#8A1F3A';g.fillRect(0,0,cw,H);g.fillRect(W-cw,0,cw,H);g.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<6;i++){g.fillRect(cw*i/6,0,2,H);g.fillRect(W-cw*i/6,0,2,H);}
    const sp=g.createRadialGradient(W/2,H/2,10,W/2,H/2,Math.min(W,H)*.6);sp.addColorStop(0,'rgba(255,240,200,.45)');sp.addColorStop(1,'rgba(255,240,200,0)');g.fillStyle=sp;g.fillRect(0,0,W,H);
    for(let i=0;i<14;i++){const an=i/14*TAU+t*2;g.strokeStyle=i%2?'rgba(240,107,200,.4)':'rgba(255,201,60,.4)';g.lineWidth=8;g.beginPath();g.moveTo(W/2,H/2);g.lineTo(W/2+Math.cos(an)*W,H/2+Math.sin(an)*W);g.stroke();}
    g.translate(W/2,H/2);const s=.6+Math.min(1,t*4)*.5+t*.2;g.scale(s,s);g.rotate(Math.sin(t*10)*.08);g.drawImage(this.foeSprite('mask','#F06BC8','#FFC93C',90),-114,-114,228,228);
    g.rotate(-Math.sin(t*10)*.08);g.font='900 34px system-ui';g.textAlign='center';g.lineWidth=7;g.strokeStyle='#1A0A20';g.strokeText('¡GRAN FUNCIÓN!',0,150);g.fillStyle='#FFE14D';g.fillText('¡GRAN FUNCIÓN!',0,150);g.restore();g.globalAlpha=1;},
  drawWeather(g,W,H){const G=this.G;if(!G.weather)return;const k=G.weather.k,t=G.t;
    if(k==='lluvia'||k==='tormenta'){g.fillStyle='rgba(30,40,70,.18)';g.fillRect(0,0,W,H);g.strokeStyle='rgba(190,215,255,.42)';g.lineWidth=1.2;g.beginPath();for(let i=0;i<140;i++){const x=((i*97.3+t*520)%(W+40))-20,y=(i*53.7+t*980)%H;g.moveTo(x,y);g.lineTo(x-5,y+15);}g.stroke();if(k==='tormenta'&&(Math.sin(t*2.3)>.993||Math.sin(t*1.7+1)>.996)){g.fillStyle='rgba(230,220,255,.4)';g.fillRect(0,0,W,H);}}
    if(k==='nieve'){g.fillStyle='rgba(220,235,255,.12)';g.fillRect(0,0,W,H);for(let i=0;i<110;i++){const x=(i*131+Math.sin(t*.8+i)*30+t*25)%W,y=(i*71+t*(40+i%3*15))%H,s=1.5+i%3;g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.arc(x,y,s,0,TAU);g.fill();}}
    if(k==='niebla'){for(let i=0;i<5;i++){const x=((i*311+t*20)%(W+400))-200,y=(i*173)%H;const gr=g.createRadialGradient(x,y,10,x,y,260);gr.addColorStop(0,'rgba(210,190,240,.32)');gr.addColorStop(1,'rgba(210,190,240,0)');g.fillStyle=gr;g.fillRect(0,0,W,H);}}
    if(k==='arena'){g.fillStyle='rgba(227,180,95,.18)';g.fillRect(0,0,W,H);g.fillStyle='rgba(240,200,130,.6)';for(let i=0;i<120;i++){const x=(i*97+t*400)%W,y=(i*61+Math.sin(t+i)*20)%H;g.fillRect(x,y,3,1.2);}}
    if(k==='sol'){const gr=g.createRadialGradient(W*.85,-20,10,W*.85,-20,W*.8);gr.addColorStop(0,'rgba(255,225,130,.38)');gr.addColorStop(1,'rgba(255,225,130,0)');g.fillStyle=gr;g.fillRect(0,0,W,H);g.globalCompositeOperation='lighter';for(let i=0;i<4;i++){g.fillStyle=`rgba(255,230,160,${.05})`;g.beginPath();g.moveTo(W*.85,0);g.lineTo(W*.85-W*(.3+i*.2),H);g.lineTo(W*.85-W*(.22+i*.2),H);g.closePath();g.fill();}g.globalCompositeOperation='source-over';}},
  /* ---------- HUD ---------- */
  panel(g,x,y,w,h,r,a){const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,`rgba(34,28,52,${a||.82})`);gr.addColorStop(1,`rgba(14,10,24,${a||.82})`);g.fillStyle=gr;this.rr(g,x,y,w,h,r);g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=1;g.beginPath();g.moveTo(x+r,y+.5);g.lineTo(x+w-r,y+.5);g.stroke();},
  bar(g,x,y,w,h,v,c1,c2){g.fillStyle='rgba(0,0,0,.55)';this.rr(g,x,y,w,h,h/2);if(v>0){const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,c1);gr.addColorStop(1,c2||this.shade(c1,.7));g.fillStyle=gr;this.rr(g,x,y,Math.max(h,w*Math.min(1,v)),h,h/2);g.fillStyle='rgba(255,255,255,.25)';g.fillRect(x+h/2,y+1,Math.max(0,w*Math.min(1,v)-h),h*.3);}},
  drawHUD(g,W,H){const G=this.G,m=this.am();g.textAlign='left';
    // experiencia arriba
    this.bar(g,8,6,W-16,9,G.xp/G.next,'#8BF0FF','#2E9FD9');
    const pill=(x,y,t,a,col)=>{g.font='700 13px system-ui';const w=g.measureText(t).width+20;const X=a==='c'?x-w/2:a==='r'?x-w:x;this.panel(g,X,y,w,24,12);g.fillStyle=col||'#fff';g.textAlign='center';g.fillText(t,X+w/2,y+16.5);g.textAlign='left';return w;};
    // nivel como insignia
    this.panel(g,10,20,52,52,12);g.fillStyle='#8BF0FF';g.font='700 10px system-ui';g.textAlign='center';g.fillText('NIVEL',36,36);g.fillStyle='#fff';g.font='900 22px system-ui';g.fillText(G.lvl,36,61);g.textAlign='left';
    // reloj
    const tw=110;this.panel(g,W/2-tw/2,20,tw,34,12);g.fillStyle=G.won?'#FFE14D':'#fff';g.font='800 20px system-ui';g.textAlign='center';g.fillText(this.fmt(G.t),W/2,44);g.textAlign='left';
    if(!G.won&&G.t<900){const nb=HS_BOSS.find(b=>b.at>G.t);if(nb&&!G.boss){g.font='600 10px system-ui';g.fillStyle='rgba(255,255,255,.65)';g.textAlign='center';g.fillText('Jefe en '+this.fmt(nb.at-G.t),W/2,66);g.textAlign='left';}}
    pill(W-10,20,'☠ '+G.kills+'   🎟 '+G.st.sellos,'r');
    let y2=80;const B=HS_BIOME[G.biome];pill(10,y2,(B.el?HS_EL[B.el].ic+' ':'')+B.n+(G.weather?' · '+HS_WEATHER[G.weather.k].n:''));y2+=30;
    const st=[];if(G.eye)st.push(['👁 Orbe '+Math.ceil(G.eye.t)+' s',HS_EL.r.c]);if(m&&m.tron>0)st.push(['⚡ Tronante '+Math.ceil(m.tron)+' s',HS_EL.r.c]);if(G.resol>0&&G.team[0].c.id==='velka')st.push(['Resolución '+Math.round(G.resol),'#E6D2FF']);if(G.caras>0)st.push(['🎭 Caras de la Farsa '+Math.ceil(G.caras)+' s','#F06BC8']);if(G.buff)st.push(['✨ +25 % daño '+Math.ceil(G.buff.t)+' s','#FFE14D']);if(G.st.altar>0)st.push(['⭐ Altar '+Math.ceil(G.st.altar)+' s','#FFC93C']);if(G.reso)st.push(['💠 Resonancia','#8BF0FF']);if(G.relic)st.push(['🏺 '+G.relic.n,'#FFC93C']);
    st.slice(0,5).forEach(([s,c])=>{pill(10,y2,s,'l',c);y2+=28;});
    // jefe
    const bo=G.boss||G.foes.find(e=>e.guard&&!e.dead);if(bo&&!bo.dead){const w=Math.min(560,W*.56),x=W/2-w/2,y=74;this.panel(g,x-10,y-4,w+20,52,10);const nm=(bo.boss?bo.boss.n:bo.gd.n);
      g.fillStyle='#fff';g.font='800 14px system-ui';g.textAlign='center';g.fillText(nm+(G.arena?'  ·  '+Math.ceil(G.arena.t)+' s':''),W/2,y+13);g.textAlign='left';
      for(let i=1;i<=3;i++){g.fillStyle=bo.phase>=i?'#FF5A5A':'rgba(255,255,255,.25)';g.beginPath();g.arc(x+w-30+i*10,y+9,3.5,0,TAU);g.fill();}
      this.bar(g,x,y+20,w,11,bo.hp/bo.max,'#FF7A7A','#C2283A');this.bar(g,x,y+34,w,6,bo.broken>0?1:bo.tough/bo.toughMax,bo.broken>0?'#FFE14D':'#FFFFFF','#B8B8C8');
      g.font='13px system-ui';bo.weak.forEach((k,i)=>{g.fillText(HS_EL[k].ic,x+i*18,y+13);});}
    // principal y apoyos abajo a la izquierda
    const main=G.team[0];if(main){const cx=48,cy=H-48,el=HS_EL[main.c.el].c,full=main.en>=main.c.u.cost;this.panel(g,10,H-88,76,78,14,.9);
      g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=5;g.beginPath();g.arc(cx,cy,30,0,TAU);g.stroke();g.strokeStyle=full?'#FFE14D':el;g.beginPath();g.arc(cx,cy,30,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,main.en/main.c.u.cost));g.stroke();
      if(full){g.globalCompositeOperation='lighter';g.globalAlpha=.45+.3*Math.sin(G.t*6);g.drawImage(this.glow('#FFE14D',42),cx-42,cy-42);g.globalAlpha=1;g.globalCompositeOperation='source-over';}
      g.save();g.beginPath();g.arc(cx,cy,26,0,TAU);g.clip();g.fillStyle=this.shade(el,.35);g.fillRect(cx-26,cy-26,52,52);g.drawImage(this.sprite(main.c,main.alt),cx-34,cy-30,68,76);g.restore();
      if(main.cdS>0){g.fillStyle='rgba(10,8,18,.45)';g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,26,-Math.PI/2,-Math.PI/2+TAU*(main.cdS/(main.c.s.cd||1)));g.closePath();g.fill();}
      g.font='800 10px system-ui';g.textAlign='center';g.fillStyle=full?'#FFE14D':'rgba(255,255,255,.8)';g.fillText(full?'¡ESPACIO!':Math.floor(main.en/main.c.u.cost*100)+' %',cx,H-14);g.textAlign='left';}
    G.team.slice(1).forEach((o,k)=>{const x=96+k*58,cx=x+24,cy=H-44,el=HS_EL[o.c.el].c,tot=Math.max(5,o.c.s.cd*1.35)*G.M.cd*G.supK*(1-.07*(o.lv.s-1)),p=1-Math.min(1,o.cdS/tot);
      this.panel(g,x,H-82,48,72,12,.82);g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=3.5;g.beginPath();g.arc(cx,cy-6,19,0,TAU);g.stroke();g.strokeStyle=el;g.beginPath();g.arc(cx,cy-6,19,-Math.PI/2,-Math.PI/2+TAU*p);g.stroke();
      g.save();g.beginPath();g.arc(cx,cy-6,16,0,TAU);g.clip();g.fillStyle=this.shade(el,.35);g.fillRect(cx-16,cy-22,32,32);g.drawImage(this.sprite(o.c,o.alt),cx-21,cy-26,42,48);g.restore();
      g.font='700 9px system-ui';g.textAlign='center';g.fillStyle='rgba(255,255,255,.75)';g.fillText('APOYO',cx,H-72);g.fillStyle='#fff';g.fillText(o.c.n.split(' ')[0],cx,H-16);g.textAlign='left';});
    // vida del activo
    if(m){const w=Math.min(400,W*.34),x=W/2-w/2,y=H-40;this.panel(g,x-10,y-22,w+20,48,12);g.fillStyle='#fff';g.font='800 13px system-ui';g.fillText(m.c.n,x,y-6);g.fillStyle='rgba(255,255,255,.6)';g.font='italic 11px system-ui';g.fillText(m.c.t,x+g.measureText(m.c.n).width+40,y-6);
      this.bar(g,x,y,w,12,m.hp/m.max,m.hp<m.max*.25?'#FF7A7A':'#8BFFC0',m.hp<m.max*.25?'#C2283A':'#2FA86A');if(G.shield>0)this.bar(g,x,y-2,w*Math.min(1,G.shield/Math.max(1,m.max)),4,1,'#FFE08A','#E3B45F');
      g.fillStyle='#fff';g.font='700 10px system-ui';g.textAlign='right';g.fillText(Math.ceil(m.hp)+' / '+m.max,x+w,y-6);g.textAlign='left';
      const full=m.en>=m.c.u.cost;this.bar(g,x,y+15,w,4,m.en/m.c.u.cost,full?'#FFE14D':HS_EL[m.c.el].c);}
    // risas
    if(this.farsa()){const x=W/2+Math.min(400,W*.34)/2+48,y=H-30,r=22,full=G.risas>=100;if(full){g.globalCompositeOperation='lighter';g.globalAlpha=.4+.3*Math.sin(G.t*6);g.drawImage(this.glow('#F06BC8',44),x-44,y-44);g.globalAlpha=1;g.globalCompositeOperation='source-over';}
      this.panel(g,x-r-5,y-r-5,(r+5)*2,(r+5)*2,r+5);g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=5;g.beginPath();g.arc(x,y,r,0,TAU);g.stroke();g.strokeStyle=full?'#FFE14D':'#F06BC8';g.beginPath();g.arc(x,y,r,-Math.PI/2,-Math.PI/2+TAU*G.risas/100);g.stroke();
      g.drawImage(this.foeSprite('mask','#F06BC8','#FFC93C',12),x-18,y-18,36,36);g.font='800 11px system-ui';g.textAlign='center';g.fillStyle=full?'#FFE14D':'#fff';g.fillText(full?'¡Pulsa R!':'Risas '+Math.floor(G.risas),x,y-r-9);g.textAlign='left';}
    // técnicas
    G.techs.forEach((T,i)=>{const x=W-12-(G.techs.length-i)*48,y=H-56,on=G.reso||i===G.tact,c=HS_EL[T.t.el].c;this.panel(g,x,y,44,44,10,on?.95:.6);
      if(on){g.strokeStyle=T.evo?'#FFE14D':c;g.lineWidth=2.5;g.strokeRect(x+1.5,y+1.5,41,41);}
      const cd=Math.max(0,T.cd)/(T.t.cd||1);g.font='20px system-ui';g.textAlign='center';g.globalAlpha=on?1:.5;g.fillText(HS_EL[T.t.el].ic,x+22,y+27);g.globalAlpha=1;if(on&&cd>0){g.fillStyle='rgba(10,8,18,.5)';g.fillRect(x+2,y+2,40,40*cd);}
      g.font='800 9px system-ui';g.fillStyle=T.evo?'#FFE14D':'#fff';g.fillText(T.evo?'★ EVO':'nv. '+T.lv,x+22,y+40);g.textAlign='left';});
    if(G.techs.length>1){g.fillStyle='rgba(255,255,255,.75)';g.font='600 10px system-ui';g.textAlign='right';g.fillText(G.reso?'Resonancia: disparan todas':'Tab: cambiar técnica',W-12,H-62);g.textAlign='left';}
    // flecha al portal
    if(G.portal){const P=G.p,dx=G.portal.x-P.x,dy=G.portal.y-P.y;if(Math.abs(dx)>W/2-20||Math.abs(dy)>H/2-20){const a=Math.atan2(dy,dx),r=Math.min(W,H)/2-46,c=HS_GUARD[G.portal.el].col;g.save();g.translate(W/2+Math.cos(a)*r,H/2+Math.sin(a)*r);g.globalCompositeOperation='lighter';g.globalAlpha=.6;g.drawImage(this.glow(c,22),-22,-22);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.rotate(a);g.fillStyle=c;g.beginPath();g.moveTo(16,0);g.lineTo(-8,-11);g.lineTo(-3,0);g.lineTo(-8,11);g.fill();g.restore();}}
    // corte de definitiva
    if(G.cut){const a=G.cut.life/G.cut.max,t=1-a,y=H*.32,c=HS_EL[G.cut.c.el].c,ein=Math.min(1,t*5),eout=a<.25?a/.25:1;g.save();g.globalAlpha=eout;
      const gr=g.createLinearGradient(0,y,W,y);gr.addColorStop(0,this.shade(c,.45));gr.addColorStop(.5,c);gr.addColorStop(1,this.shade(c,.45));g.fillStyle=gr;g.beginPath();g.moveTo(W*(1-ein),y+10);g.lineTo(W,y-14);g.lineTo(W,y+60);g.lineTo(W*(1-ein),y+84);g.closePath();g.fill();
      g.globalAlpha=eout*.5;g.fillStyle='#fff';for(let i=0;i<14;i++){const ly=y-20+((i*37)%120),lx=((i*211+t*2400)%(W+300))-150;g.fillRect(W-lx,ly,120,2);}g.globalAlpha=eout;
      g.drawImage(this.sprite(G.cut.c,G.cut.alt),W*.12+(1-ein)*-160,y-50,120,136);g.fillStyle='#fff';g.font='900 30px system-ui';g.lineWidth=6;g.strokeStyle='rgba(14,10,24,.6)';g.strokeText(G.cut.c.n,W*.12+140,y+40);g.fillText(G.cut.c.n,W*.12+140,y+40);
      g.font='italic 700 14px system-ui';g.fillStyle='rgba(255,255,255,.85)';g.fillText(G.cut.c.t,W*.12+142,y+60);g.restore();}
    // mensaje
    if(G.msg){const a=Math.min(1,G.msg.life*1.5),sc=G.msg.life>2.7?1+(G.msg.life-2.7)*1.2:1;g.save();g.globalAlpha=a;g.textAlign='center';g.translate(W/2,H*.24);g.scale(sc,sc);g.font='900 30px system-ui';g.lineWidth=7;g.lineJoin='round';g.strokeStyle='rgba(14,10,24,.75)';g.strokeText(G.msg.t,0,0);g.fillStyle=G.msg.col||'#fff';g.fillText(G.msg.t,0,0);
      if(G.msg.sub){g.font='600 14px system-ui';g.lineWidth=4;g.strokeText(G.msg.sub,0,24);g.fillStyle='#fff';g.fillText(G.msg.sub,0,24);}g.restore();}},
});
})();
