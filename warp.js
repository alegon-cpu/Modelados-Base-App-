/* ===================== 2.6: animación de tiradas, cursores, fondos animados y estelas ===================== */
const reduceMotion=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}};
const isDarkUI=()=>{try{const sk=Juegos.skinMode();if(sk)return sk==='dark';}catch(e){}const t=document.documentElement.getAttribute('data-theme');if(t)return t==='dark';try{return matchMedia('(prefers-color-scheme: dark)').matches;}catch(e){return false;}};
const RCOL={c:'#9AA6B2',r:'#4FA3FF',e:'#B66DFF',l:'#FFC94A',m:'#FF3D7F'};

const FX={
  // ---------- cursores: [svg, punto de clic x, y] ----------
  CUR:{
    'l-cursor':[`<svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'><path d='M3 23l2-6L18 4l4 4L9 21z' fill='#F2C14E' stroke='#222' stroke-width='1.4'/><path d='M3 23l2-6 4 4z' fill='#F4D9B0' stroke='#222' stroke-width='1.2'/><path d='M3 23l1-3 2 2z' fill='#222'/><path d='M16 6l4 4' stroke='#222' stroke-width='1.2'/></svg>`,2,24],
    'e-cur0':[`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><defs><filter id='g' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='1.6'/></filter></defs><path d='M4 3v21l6-6 4.5 9.5 4-2L14 16h8.5z' fill='#00F0FF' filter='url(#g)' opacity='.9'/><path d='M4 3v21l6-6 4.5 9.5 4-2L14 16h8.5z' fill='#0B2A33' stroke='#5FF6FF' stroke-width='1.6' stroke-linejoin='round'/></svg>`,4,3],
    'e-cur1':[`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path d='M29 2C19 3 10 10 7 21l-2 7 4-4c10-2 18-10 20-22z' fill='#FFFFFF' stroke='#5A5F6B' stroke-width='1.3'/><path d='M27 4C20 9 13 16 6 27' fill='none' stroke='#8A6FD1' stroke-width='1.4'/><path d='M15 12l4 1M12 16l4 1M10 20l3 1' stroke='#B9BECB' stroke-width='1'/><path d='M3 30l3-4' stroke='#222' stroke-width='2' stroke-linecap='round'/></svg>`,3,30],
    'e-cur2':[`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path d='M27 29L11 13' stroke='#2A1A12' stroke-width='4' stroke-linecap='round'/><path d='M27 29l-4-4' stroke='#F5F5F5' stroke-width='4' stroke-linecap='round'/><path d='M9 1.5l2 4.6 5 .5-3.8 3.3 1.1 4.9L9 12.2l-4.3 2.6 1.1-4.9L2 6.6l5-.5z' fill='#FFD84A' stroke='#9A6B00' stroke-width='1'/></svg>`,9,8],
    'e-cur3':[`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><g fill='#F7A8C4' stroke='#7A3550' stroke-width='1.3'><ellipse cx='16' cy='21' rx='8' ry='6.5'/><ellipse cx='7' cy='12' rx='3' ry='3.8'/><ellipse cx='13' cy='7.5' rx='3' ry='3.8'/><ellipse cx='19.5' cy='7.5' rx='3' ry='3.8'/><ellipse cx='25' cy='12' rx='3' ry='3.8'/></g></svg>`,16,4],
    'e-cur4':[`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path d='M2 2l5 1 14 14-4 4L3 7z' fill='#DDE3EA' stroke='#3B4450' stroke-width='1.3'/><path d='M4 4l14 14' stroke='#FFFFFF' stroke-width='1'/><path d='M15 23l8-8 2 2-8 8z' fill='#C9A227' stroke='#5C4500' stroke-width='1.2'/><path d='M21 21l6 6' stroke='#5A3A1E' stroke-width='3.4' stroke-linecap='round'/><circle cx='28' cy='28' r='2' fill='#C9A227' stroke='#5C4500'/></svg>`,2,2],
    'l-cur0':[`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><defs><filter id='g' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='2'/></filter></defs><path d='M3 3l17 17' stroke='#B44CFF' stroke-width='7' stroke-linecap='round' filter='url(#g)'/><path d='M3 3l17 17' stroke='#F3DDFF' stroke-width='2.6' stroke-linecap='round'/><path d='M19 23l4-4 7 7-4 4z' fill='#7B828C' stroke='#2B2F35' stroke-width='1.2'/><path d='M18 18l4 4' stroke='#2B2F35' stroke-width='3'/></svg>`,3,3],
    'l-cur1':[`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path d='M24 24l6 7-3-7 7 3z' fill='#FF8A1F'/><path d='M23 23l4 5-1-4 4 1z' fill='#FFE14A'/><path d='M3 3c9 0 16 4 19 11l-8 8C7 19 3 12 3 3z' fill='#F1F4F8' stroke='#38404A' stroke-width='1.3'/><path d='M3 3c4 0 7 1 9 3-3 1-5 3-6 6-2-2-3-5-3-9z' fill='#E5484D'/><circle cx='13' cy='13' r='3' fill='#5AB0F0' stroke='#38404A' stroke-width='1.2'/><path d='M18 18l3 6-4 2-3-6zM18 18l6 3-2 4-6-3z' fill='#E5484D' stroke='#38404A' stroke-width='1'/></svg>`,3,3],
    'l-cur2':[`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><defs><linearGradient id='c' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#7CF2FF'/><stop offset='.35' stop-color='#B66DFF'/><stop offset='.7' stop-color='#FF6BB5'/><stop offset='1' stop-color='#FFD84A'/></linearGradient><filter id='g' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='1.8'/></filter></defs><path d='M3 3l18 6 7 19-19-7z' fill='url(#c)' filter='url(#g)' opacity='.8'/><path d='M3 3l18 6 7 19-19-7z' fill='url(#c)' stroke='#FFFFFF' stroke-width='1.3' stroke-linejoin='round'/><path d='M3 3l12 12 6-6M15 15l-6 6M15 15l13 13' stroke='#FFFFFF' stroke-opacity='.7' stroke-width='.9' fill='none'/></svg>`,3,3],
    'x-cur0':[`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><defs><pattern id='p' width='6' height='6' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'><rect width='6' height='6' fill='#FFFFFF'/><rect width='3' height='6' fill='#E5484D'/></pattern></defs><path d='M4 4c0-3 6-3 6 0v20' fill='none' stroke='#5A1010' stroke-width='6.4' stroke-linecap='round'/><path d='M4 4c0-3 6-3 6 0v20' fill='none' stroke='url(#p)' stroke-width='4.6' stroke-linecap='round'/><path d='M24 18l2 3 3 .5-2.2 2 .6 3-2.4-1.5-2.6 1.5.6-3-2.2-2 3-.5z' fill='#FFD84A' stroke='#9A6B00' stroke-width='.8'/></svg>`,4,2],
    'l-cur3':[`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><defs><linearGradient id='f' x1='0' y1='1' x2='0' y2='0'><stop offset='0' stop-color='#FF5A1F'/><stop offset='.55' stop-color='#FFB020'/><stop offset='1' stop-color='#FFF3A0'/></linearGradient><linearGradient id='b' x1='0' y1='1' x2='0' y2='0'><stop offset='0' stop-color='#2D7BFF'/><stop offset='1' stop-color='#C9F2FF'/></linearGradient></defs><path d='M16 2c2 6 9 9 9 17a9 9 0 0 1-18 0c0-5 3-7 4-11 1 3 2 4 3 4 0-4 1-7 2-10z' fill='url(#f)' stroke='#8A2A00' stroke-width='1.2'/><path d='M16 15c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-5 0 1 1 2 1 2 0-2 0-3 1-5z' fill='url(#b)'/></svg>`,16,2]},
  _curUrl:{},
  cursorImg(id){const c=this.CUR[id];if(!c)return null;return this._curUrl[id]||(this._curUrl[id]='data:image/svg+xml,'+encodeURIComponent(c[0]));},
  cursorCss(id){const c=this.CUR[id];if(!c)return '';const u=this.cursorImg(id);
    return `html[data-cur] body,html[data-cur] .ed-cv,html[data-cur] .ed-cv svg,html[data-cur] button,html[data-cur] .ebtn,html[data-cur] a,html[data-cur] .rw,html[data-cur] .jg-card{cursor:url("${u}") ${c[1]} ${c[2]},auto}`;},

  // ---------- fondos animados (se ven en Inicio, Juegos y Teoría) ----------
  _bg:null,
  bg(kind,season){if(reduceMotion())kind=null;const cur=this._bg;if(cur&&cur.kind===kind&&!!cur.season===!!season)return;if(cur){cancelAnimationFrame(cur.raf);cur.cv.remove();removeEventListener('resize',cur.rs);this._bg=null;}if(!kind)return;
    const cv=document.createElement('canvas');cv.id='mbbg';cv.className='bg-'+kind+(season?' season':'');document.body.appendChild(cv);const g=cv.getContext('2d');
    const B={kind,cv,g,P:[],t0:performance.now(),last:0,season};this._bg=B;
    const rs=()=>{cv.width=innerWidth;cv.height=innerHeight;B.P=this.bgSeed(kind,cv.width,cv.height);};B.rs=rs;rs();addEventListener('resize',rs);
    const step=t=>{B.raf=requestAnimationFrame(step);const vis=typeof App!=='undefined'&&!!App.home&&!document.hidden&&!(typeof Juegos!=='undefined'&&((Juegos._snk&&!Juegos._snk.over)||(Juegos._gm&&Juegos.sub!=='ruleta')));
      cv.style.display=vis?'':'none';if(!vis||t-B.last<32)return;const dt=Math.min(80,t-(B.last||t));B.last=t;this.bgDraw(B,(t-B.t0)/1000,dt/16.7);};
    B.raf=requestAnimationFrame(step);},
  bgSeed(k,W,H){const R=Math.random,P=[];
    if(k==='galaxia'){for(let i=0;i<220;i++)P.push({x:R()*W,y:R()*H,r:R()*1.6+.3,ph:R()*6.3,sp:R()*.04+.01});}
    if(k==='sakura'){for(let i=0;i<46;i++)P.push({x:R()*W,y:R()*H,s:R()*7+6,vy:R()*.6+.45,vx:R()*.5+.2,a:R()*6.3,va:(R()-.5)*.05,ph:R()*6.3});}
    if(k==='luciernagas'){for(let i=0;i<42;i++)P.push({x:R()*W,y:R()*H,vx:(R()-.5)*.5,vy:(R()-.5)*.5,ph:R()*6.3,r:R()*2+1.5});}
    if(k==='nieve'){for(let i=0;i<150;i++)P.push({x:R()*W,y:R()*H,r:R()*2.6+.6,vy:R()*.7+.3,ph:R()*6.3});}
    if(k==='otono')for(let i=0;i<38;i++)P.push({x:R()*W,y:R()*H,s:R()*10+9,vy:R()*.7+.4,vx:R()*.6-.1,a:R()*6.3,va:(R()-.5)*.06,ph:R()*6.3,c:['#D9622B','#E8A33D','#B5402A','#C98A2B','#8E5A2B'][i%5]});
    if(k==='halloween'){for(let i=0;i<14;i++)P.push({x:R()*W,y:R()*H*.7,s:R()*14+16,vx:R()*1.2+.5,ph:R()*6.3,e:'🦇'});for(let i=0;i<6;i++)P.push({x:R()*W,y:H-30-R()*40,s:R()*14+26,vx:0,ph:R()*6.3,e:'🎃',fix:1});}
    if(k==='corazones')for(let i=0;i<30;i++)P.push({x:R()*W,y:R()*H,s:R()*12+10,vy:-(R()*.6+.3),ph:R()*6.3,c:['#FF4D7E','#FF8AB3','#E5484D','#FFB3CD'][i%4]});
    if(k==='verano')for(let i=0;i<40;i++)P.push({x:R()*W,y:R()*H,r:R()*10+4,vy:-(R()*.5+.2),ph:R()*6.3});
    if(k==='navidad'){for(let i=0;i<110;i++)P.push({x:R()*W,y:R()*H,r:R()*2.2+.6,vy:R()*.6+.25,ph:R()*6.3});}
    if(k==='aurora'){for(let i=0;i<70;i++)P.push({x:R()*W,y:R()*H*.6,r:R()*1.2+.3,ph:R()*6.3});}
    return P;},
  bgDraw(B,t,f){const {g,cv,P,kind}=B,W=cv.width,H=cv.height,dk=isDarkUI();g.clearRect(0,0,W,H);
    if(kind==='galaxia'){
      // nebulosas suaves
      [[.25,.3,'180,80,255'],[.72,.62,'60,140,255'],[.55,.2,'255,80,170']].forEach(([x,y,c],i)=>{const cx=W*x+Math.sin(t*.07+i)*40,cy=H*y+Math.cos(t*.05+i)*30,r=Math.max(W,H)*.32;const gr=g.createRadialGradient(cx,cy,0,cx,cy,r);gr.addColorStop(0,`rgba(${c},${dk?.22:.1})`);gr.addColorStop(1,`rgba(${c},0)`);g.fillStyle=gr;g.fillRect(0,0,W,H);});
      P.forEach(p=>{const a=.45+.55*Math.sin(t*2+p.ph);g.fillStyle=dk?`rgba(255,255,255,${a})`:`rgba(70,60,160,${a*.8})`;g.beginPath();g.arc(p.x,p.y,p.r,0,6.3);g.fill();p.x-=p.sp*f;if(p.x<0)p.x+=W;});
      // estrella fugaz de vez en cuando
      if(!B.sh&&Math.random()<.006*f)B.sh={x:Math.random()*W*.8+W*.2,y:Math.random()*H*.4,k:0};
      if(B.sh){const s=B.sh;s.k+=.02*f;const x=s.x-s.k*W*.35,y=s.y+s.k*H*.25,gr=g.createLinearGradient(x,y,x+90,y-64);gr.addColorStop(0,dk?'rgba(255,255,255,.95)':'rgba(90,70,200,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');g.strokeStyle=gr;g.lineWidth=2;g.beginPath();g.moveTo(x,y);g.lineTo(x+90,y-64);g.stroke();if(s.k>1)B.sh=null;}}
    if(kind==='aurora'){g.save();g.globalCompositeOperation=dk?'lighter':'source-over';
      [['70,255,170',.0,.32],['80,200,255',1.7,.4],['190,110,255',3.1,.26]].forEach(([c,o,yy])=>{for(let k=0;k<3;k++){g.beginPath();for(let x=0;x<=W;x+=16){const y=H*yy+Math.sin(x/220+t*.6+o+k*.4)*50+Math.sin(x/90+t*1.1+o)*14+k*10;x?g.lineTo(x,y):g.moveTo(x,y);}
        g.strokeStyle=`rgba(${c},${(dk?.16:.22)-k*.04})`;g.lineWidth=60-k*16;g.stroke();}});g.restore();
      P.forEach(p=>{const a=.3+.4*Math.sin(t*1.5+p.ph);g.fillStyle=dk?`rgba(255,255,255,${a})`:`rgba(40,120,110,${a*.6})`;g.fillRect(p.x,p.y,p.r*1.6,p.r*1.6);});}
    if(kind==='sakura'){P.forEach(p=>{p.y+=p.vy*f;p.x+=(p.vx+Math.sin(t+p.ph)*.6)*f;p.a+=p.va*f;if(p.y>H+20){p.y=-20;p.x=Math.random()*W;}if(p.x>W+20)p.x=-20;
      g.save();g.translate(p.x,p.y);g.rotate(p.a);g.scale(1,.55+.45*Math.abs(Math.sin(t*1.3+p.ph)));g.fillStyle=dk?'rgba(255,183,213,.85)':'rgba(240,120,165,.75)';
      g.beginPath();g.moveTo(0,-p.s);g.bezierCurveTo(p.s*.9,-p.s*.6,p.s*.7,p.s*.6,0,p.s);g.bezierCurveTo(-p.s*.7,p.s*.6,-p.s*.9,-p.s*.6,0,-p.s);g.fill();g.restore();});}
    if(kind==='luciernagas'){g.save();g.globalCompositeOperation=dk?'lighter':'source-over';P.forEach(p=>{p.vx+=(Math.random()-.5)*.05;p.vy+=(Math.random()-.5)*.05;p.vx*=.98;p.vy*=.98;p.x=(p.x+p.vx*f+W)%W;p.y=(p.y+p.vy*f+H)%H;
      const a=Math.max(0,Math.sin(t*1.4+p.ph)),R=p.r*7,gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,R);gr.addColorStop(0,dk?`rgba(225,255,120,${.9*a})`:`rgba(150,170,20,${.75*a})`);gr.addColorStop(1,'rgba(225,255,120,0)');g.fillStyle=gr;g.fillRect(p.x-R,p.y-R,R*2,R*2);});g.restore();}
    if(kind==='otono')P.forEach(p=>{p.y+=p.vy*f;p.x+=(p.vx+Math.sin(t*.9+p.ph)*.7)*f;p.a+=p.va*f;if(p.y>H+20){p.y=-20;p.x=Math.random()*W;}if(p.x>W+20)p.x=-20;
      g.save();g.translate(p.x,p.y);g.rotate(p.a);g.scale(1,.6+.4*Math.abs(Math.sin(t*1.2+p.ph)));g.fillStyle=p.c;g.globalAlpha=.85;g.beginPath();g.moveTo(0,-p.s);g.quadraticCurveTo(p.s*.8,0,0,p.s);g.quadraticCurveTo(-p.s*.8,0,0,-p.s);g.fill();
      g.strokeStyle='rgba(80,40,10,.5)';g.lineWidth=1;g.beginPath();g.moveTo(0,-p.s);g.lineTo(0,p.s*1.2);g.stroke();g.restore();});
    if(kind==='halloween'){g.textAlign='center';g.textBaseline='middle';P.forEach(p=>{if(!p.fix){p.x+=p.vx*f;if(p.x>W+40){p.x=-40;p.y=Math.random()*H*.7;}}
      const y=p.fix?p.y+Math.sin(t*1.5+p.ph)*3:p.y+Math.sin(t*3+p.ph)*14;g.font=`${p.s}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;g.globalAlpha=p.fix?.9:.75;
      if(p.fix){const gr=g.createRadialGradient(p.x,y,0,p.x,y,p.s*1.4);gr.addColorStop(0,'rgba(255,150,30,.35)');gr.addColorStop(1,'rgba(255,150,30,0)');g.fillStyle=gr;g.fillRect(p.x-p.s*1.4,y-p.s*1.4,p.s*2.8,p.s*2.8);}
      g.save();g.translate(p.x,y);if(!p.fix)g.scale(1,.8+.2*Math.sin(t*12+p.ph));g.fillStyle='#000';g.fillText(p.e,0,0);g.restore();});g.globalAlpha=1;}
    if(kind==='corazones')P.forEach(p=>{p.y+=p.vy*f;p.x+=Math.sin(t+p.ph)*.4*f;if(p.y<-20){p.y=H+20;p.x=Math.random()*W;}const z=p.s*(1+.08*Math.sin(t*4+p.ph));g.save();g.translate(p.x,p.y);g.fillStyle=p.c;g.globalAlpha=.7;
      g.beginPath();g.moveTo(0,z*.35);g.bezierCurveTo(-z,-z*.3,-z*.4,-z,0,-z*.45);g.bezierCurveTo(z*.4,-z,z,-z*.3,0,z*.35);g.fill();g.restore();});
    if(kind==='verano'){const sx=W*.88,sy=H*.12,gr=g.createRadialGradient(sx,sy,0,sx,sy,Math.max(W,H)*.45);gr.addColorStop(0,'rgba(255,214,90,.45)');gr.addColorStop(1,'rgba(255,214,90,0)');g.fillStyle=gr;g.fillRect(0,0,W,H);
      g.save();g.translate(sx,sy);g.rotate(t*.05);g.fillStyle='rgba(255,214,90,.12)';for(let i=0;i<12;i++){g.rotate(Math.PI/6);g.beginPath();g.moveTo(0,0);g.lineTo(Math.max(W,H),-40);g.lineTo(Math.max(W,H),40);g.fill();}g.restore();
      P.forEach(p=>{p.y+=p.vy*f;p.x+=Math.sin(t+p.ph)*.5*f;if(p.y<-20){p.y=H+20;p.x=Math.random()*W;}g.strokeStyle=dk?'rgba(140,220,255,.55)':'rgba(40,150,200,.45)';g.lineWidth=1.4;g.beginPath();g.arc(p.x,p.y,p.r,0,6.3);g.stroke();g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.arc(p.x-p.r*.35,p.y-p.r*.35,p.r*.22,0,6.3);g.fill();});}
    if(kind==='navidad'){const cols=['#FF4D4D','#FFD84A','#3DDC84','#4FA3FF','#FF8AD8'];
      for(let row=0;row<2;row++){const y0=row?H-34:20,amp=16,step=46;g.strokeStyle=dk?'rgba(220,220,220,.5)':'rgba(40,60,40,.45)';g.lineWidth=1.6;g.beginPath();for(let x=0;x<=W;x+=8){const y=y0+Math.sin(x/step*Math.PI)*amp*(row?-1:1);x?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();
        for(let i=0,x=step/2;x<W;x+=step,i++){const y=y0+Math.sin(x/step*Math.PI)*amp*(row?-1:1),on=Math.sin(t*3+i*1.7+row)>-.2,c=cols[(i+row*2)%cols.length];
          if(on){const gr=g.createRadialGradient(x,y+6,0,x,y+6,18);gr.addColorStop(0,c+'AA');gr.addColorStop(1,c+'00');g.fillStyle=gr;g.fillRect(x-18,y-12,36,36);}
          g.fillStyle=on?c:c+'55';g.beginPath();g.ellipse(x,y+7,4.5,7,0,0,6.3);g.fill();g.fillStyle='#556';g.fillRect(x-2.5,y-1,5,4);}}
      P.forEach(p=>{p.y+=p.vy*f;p.x+=Math.sin(t*.8+p.ph)*.3*f;if(p.y>H+5){p.y=-5;p.x=Math.random()*W;}g.fillStyle=dk?'rgba(255,255,255,.8)':'rgba(120,150,190,.65)';g.beginPath();g.arc(p.x,p.y,p.r,0,6.3);g.fill();});}
    if(kind==='nieve'){P.forEach(p=>{p.y+=p.vy*f;p.x+=Math.sin(t*.8+p.ph)*.35*f;if(p.y>H+5){p.y=-5;p.x=Math.random()*W;}g.fillStyle=dk?'rgba(255,255,255,.85)':'rgba(120,150,190,.7)';g.beginPath();g.arc(p.x,p.y,p.r,0,6.3);g.fill();});}},

  // ---------- estela del ratón ----------
  _tr:null,
  trail(kind){if(reduceMotion())kind=null;const cur=this._tr;if(cur&&cur.kind===kind)return;if(cur){cancelAnimationFrame(cur.raf);cur.cv.remove();removeEventListener('mousemove',cur.mv,true);removeEventListener('resize',cur.rs);this._tr=null;}if(!kind)return;
    const cv=document.createElement('canvas');cv.id='mbtrail';document.body.appendChild(cv);const g=cv.getContext('2d'),T={kind,cv,g,P:[],pts:[],run:false,lx:null,ly:null};this._tr=T;
    const rs=()=>{const d=devicePixelRatio||1;cv.width=innerWidth*d;cv.height=innerHeight*d;g.setTransform(d,0,0,d,0,0);};T.rs=rs;rs();addEventListener('resize',rs);
    const R=Math.random;
    T.mv=e=>{const x=e.clientX,y=e.clientY,dx=T.lx==null?0:x-T.lx,dy=T.ly==null?0:y-T.ly,sp=Math.hypot(dx,dy);T.lx=x;T.ly=y;const n=Math.min(6,1+Math.floor(sp/10));
      if(kind==='arcoiris')T.pts.push({x,y,life:1});
      else for(let i=0;i<n;i++){const k=i/n,px=x-dx*k,py=y-dy*k;
        if(kind==='estrellas')T.P.push({x:px,y:py,vx:(R()-.5)*1.2,vy:(R()-.5)*1.2+.4,s:R()*4+3,a:R()*6.3,life:1,dec:.018+R()*.012,c:['#FFD84A','#FFFFFF','#FFB347','#9AD8FF'][i%4]});
        if(kind==='fuego')T.P.push({x:px+(R()-.5)*6,y:py+(R()-.5)*6,vx:(R()-.5)*.8,vy:-R()*1.6-.4,s:R()*6+4,life:1,dec:.03+R()*.02});
        if(kind==='copos'&&R()<.55)T.P.push({x:px,y:py,vx:(R()-.5)*1,vy:R()*.8+.3,s:R()*8+9,a:R()*6.3,va:(R()-.5)*.08,life:1,dec:.014+R()*.01});
        if(kind==='magia'&&R()<.6)T.P.push({x:px,y:py,vx:(R()-.5)*.6,vy:-R()*.6,s:R()*3+2,grow:R()*.25+.15,life:1,dec:.02+R()*.01,h:R()<.5?280:190});}
      if(!T.run){T.run=true;T.raf=requestAnimationFrame(step);}};
    const step=()=>{g.clearRect(0,0,innerWidth,innerHeight);
      if(kind==='arcoiris'){T.pts.forEach(p=>p.life-=.045);T.pts=T.pts.filter(p=>p.life>0).slice(-40);g.lineCap='round';
        for(let i=1;i<T.pts.length;i++){const a=T.pts[i-1],b=T.pts[i];g.strokeStyle=`hsla(${(i*12+performance.now()/6)%360},95%,60%,${b.life})`;g.lineWidth=2+b.life*9;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();}}
      else{g.save();if(kind==='fuego'||kind==='magia')g.globalCompositeOperation='lighter';
        T.P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.life-=p.dec;
          if(kind==='estrellas'){p.vy+=.03;p.a+=.12;g.save();g.globalAlpha=Math.max(0,p.life);g.translate(p.x,p.y);g.rotate(p.a);g.fillStyle=p.c;g.beginPath();for(let j=0;j<10;j++){const r=j%2?p.s*.42:p.s;g.lineTo(Math.cos(j*Math.PI/5)*r,Math.sin(j*Math.PI/5)*r);}g.closePath();g.fill();g.restore();}
          if(kind==='fuego'){const r=p.s*p.life,gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,r+1);gr.addColorStop(0,`rgba(255,240,150,${p.life})`);gr.addColorStop(.4,`rgba(255,140,30,${p.life*.8})`);gr.addColorStop(1,'rgba(255,40,0,0)');g.fillStyle=gr;g.beginPath();g.arc(p.x,p.y,r+1,0,6.3);g.fill();}
          if(kind==='copos'){p.a+=p.va;g.save();g.globalAlpha=Math.max(0,p.life);g.translate(p.x,p.y);g.rotate(p.a);g.font=`${p.s}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;g.textAlign='center';g.textBaseline='middle';g.fillStyle=isDarkUI()?'#E8FBFF':'#5AA9D6';g.fillText('❄',0,0);g.restore();}
          if(kind==='magia'){p.s+=p.grow;g.strokeStyle=`hsla(${p.h+(1-p.life)*60},100%,70%,${p.life})`;g.lineWidth=1.6;g.beginPath();g.arc(p.x,p.y,p.s,0,6.3);g.stroke();g.fillStyle=`hsla(${p.h},100%,85%,${p.life*.25})`;g.fill();}});
        g.restore();T.P=T.P.filter(p=>p.life>0);if(T.P.length>400)T.P.splice(0,T.P.length-400);}
      if(T.P.length||T.pts.length)T.raf=requestAnimationFrame(step);else{T.run=false;g.clearRect(0,0,innerWidth,innerHeight);}};
    addEventListener('mousemove',T.mv,true);}
};

/* ---------- Animación de la tirada (estilo «salto» de Honkai: Star Rail) ---------- */
const Warp={
  play(res){return new Promise(done=>{
    if(reduceMotion()||!res||!res.length){done();return;}
    const order='crelm',best=res.reduce((b,o)=>order.indexOf(o.it.r)>order.indexOf(b)?o.it.r:b,'c'),WC={c:['#4FA3FF','80,163,255','#0d1d4a'],r:['#4FA3FF','80,163,255','#0d1d4a'],e:['#B66DFF','190,120,255','#2a0f4d'],l:['#FFC94A','255,205,90','#3d2c05'],m:['#FF3D7F','255,255,255','#1a0f30']}[best],col=WC[0];
    const ov=document.createElement('div');ov.id='warp';ov.className='wp-'+best;ov.innerHTML=`<canvas></canvas><div class="wp-stage" aria-live="polite"></div><button class="wp-skip" type="button">⏭ Saltar animación</button><p class="wp-hint">Haz clic para seguir</p>`;
    document.body.appendChild(ov);const cv=ov.querySelector('canvas'),g=cv.getContext('2d'),stage=ov.querySelector('.wp-stage');
    const rs=()=>{cv.width=innerWidth;cv.height=innerHeight;};rs();addEventListener('resize',rs);
    const R=Math.random,W=()=>cv.width,H=()=>cv.height,N=420,S=[];for(let i=0;i<N;i++)S.push({x:(R()-.5)*2,y:(R()-.5)*2,z:R()});
    const hue=best==='m',big='lm'.includes(best),T_COMET=hue?1500:1100,T_FLASH=hue?3700:big?2700:2300,T_CARDS=T_FLASH+(hue?900:big?650:350);
    let t0=performance.now(),raf=0,phase='warp',idx=-1,shake=0,rings=[],sparks=[],closed=false;
    const close=()=>{if(closed)return;closed=true;cancelAnimationFrame(raf);removeEventListener('resize',rs);removeEventListener('keydown',key,true);ov.classList.add('out');setTimeout(()=>{ov.remove();done();},260);};
    const stars=n=>'★'.repeat(n);
    const showCard=i=>{const o=res[i],x=o.it,r=x.r;stage.innerHTML=`<div class="wp-card r-${r}">${'lm'.includes(r)?'<span class="wp-rays" aria-hidden="true"></span>':''}${r==='m'?'<span class="wp-banner">¡MÍTICO!</span>':r==='l'?'<span class="wp-banner">¡LEGENDARIO!</span>':''}
      <div class="wp-th">${Juegos.rewardThumb(x,true)}</div><div class="wp-stars">${stars(RAR[r].st)}</div><b class="wp-name">${esc(x.n)}</b><small>${RAR[r].n} · ${Juegos.kindName[x.kind]||''}</small>
      ${o.dup?`<em class="dup">Repetido · +${RAR[r].frag} ◆</em>`:'<em class="new">¡Nuevo!</em>'}${res.length>1?`<span class="wp-count">${i+1} / ${res.length}</span>`:''}</div>`;
      if('lm'.includes(r)){burst(innerWidth/2,innerHeight/2,r==='m'?160:90,r);rings.push({r:0,a:1,m:r==='m'});if(r==='m')shake=1;}};
    const burst=(x,y,n,r)=>{for(let i=0;i<n;i++){const a=R()*6.3,v=R()*9+3;sparks.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1,h:r==='m'?R()*360:null,c:RCOL[r]});}};
    const next=()=>{if(phase==='warp'){t0=performance.now()-T_CARDS;return;}if(phase!=='cards')return;idx++;if(idx>=res.length){close();return;}showCard(idx);};
    const key=e=>{if(e.key==='Escape'){e.preventDefault();close();}else if(e.key===' '||e.key==='Enter'){e.preventDefault();next();}};
    ov.addEventListener('click',e=>{if(e.target.closest('.wp-skip')){close();return;}next();});addEventListener('keydown',key,true);
    const frame=now=>{raf=requestAnimationFrame(frame);const t=now-t0,w=W(),h=H(),cx=w/2,cy=h/2;
      // fondo
      const bg=g.createRadialGradient(cx,cy,0,cx,cy,Math.max(w,h)*.7);if(hue){const hh=(now/12)%360;bg.addColorStop(0,`hsl(${hh},70%,${t<T_FLASH?14+Math.min(10,t/T_FLASH*10):12}%)`);bg.addColorStop(.6,`hsl(${(hh+120)%360},60%,6%)`);bg.addColorStop(1,'#03040c');}else{bg.addColorStop(0,WC[2]);bg.addColorStop(1,'#03040c');}g.fillStyle=bg;g.fillRect(0,0,w,h);
      let ox=0,oy=0;if(shake>0){ox=(R()-.5)*22*shake;oy=(R()-.5)*22*shake;shake=Math.max(0,shake-.025);}g.save();g.translate(ox,oy);
      // túnel de estrellas: acelera hasta el cometa y luego se calma
      const sp=phase==='cards'?.004:t<T_COMET?.006+Math.pow(t/T_COMET,2)*.06:Math.max(.008,.066-(t-T_COMET)/1600*.06);
      g.lineCap='round';
      const rot=hue&&phase!=='cards'?Math.min(.035,t/T_FLASH*.035):0,cr=Math.cos(rot),sr=Math.sin(rot);
      S.forEach(s=>{if(rot){const nx=s.x*cr-s.y*sr;s.y=s.x*sr+s.y*cr;s.x=nx;}const pz=s.z;s.z-=sp;if(s.z<=.02){s.x=(R()-.5)*2;s.y=(R()-.5)*2;s.z=1;return;}const k=Math.max(w,h)*.55,x1=cx+s.x/pz*k*.5,y1=cy+s.y/pz*k*.5,x2=cx+s.x/s.z*k*.5,y2=cy+s.y/s.z*k*.5;
        const a=Math.min(1,(1-s.z)*1.4);g.strokeStyle=hue?`hsla(${(s.x*180+now/8)%360},90%,75%,${a})`:`rgba(${WC[1]},${a})`;g.lineWidth=(1-s.z)*2.6+.3;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();});
      // cometa
      const comet=(ang,c,size,k)=>{const e=1-Math.pow(1-k,3),r0=Math.hypot(w,h)*.62,hx=cx+Math.cos(ang)*r0*(1-e),hy=cy+Math.sin(ang)*r0*(1-e),len=size*5.5,tx=hx+Math.cos(ang)*len,ty=hy+Math.sin(ang)*len;
        for(let j=0;j<3;j++)sparks.push({x:hx,y:hy,vx:(R()-.5)*2+Math.cos(ang)*1.5,vy:(R()-.5)*2+Math.sin(ang)*1.5,life:.8,h:hue?R()*360:null,c});
        const gr=g.createLinearGradient(hx,hy,tx,ty);gr.addColorStop(0,'#FFFFFF');gr.addColorStop(.15,c);gr.addColorStop(1,'rgba(0,0,0,0)');g.strokeStyle=gr;g.lineWidth=size*.27;g.beginPath();g.moveTo(hx,hy);g.lineTo(tx,ty);g.stroke();
        const rg=g.createRadialGradient(hx,hy,0,hx,hy,size);rg.addColorStop(0,'rgba(255,255,255,1)');rg.addColorStop(.3,c);rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.beginPath();g.arc(hx,hy,size,0,6.3);g.fill();};
      if(t>T_COMET*.55&&t<T_FLASH){const k=Math.min(1,(t-T_COMET*.55)/(T_FLASH-T_COMET*.55));
        if(hue){// mítica: tres cometas arcoíris que giran en espiral hasta el centro y un remolino de anillos
          for(let i=0;i<3;i++)comet(-Math.PI/2+i*2.094+k*2.4,`hsl(${(now/3+i*120)%360},100%,65%)`,70,k);
          g.save();g.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const rr=(1-k)*Math.min(w,h)*.5*(1+i*.12)+20;g.strokeStyle=`hsla(${(i*51+now/4)%360},100%,60%,${.25+.35*k})`;g.lineWidth=6+k*6;g.beginPath();g.arc(cx,cy,rr,now/400+i,now/400+i+2.2+k*3);g.stroke();}g.restore();}
        else comet(-0.62,col,big?60:44,k);}
      // chispas y ondas
      g.save();g.globalCompositeOperation='lighter';sparks.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vx*=.97;p.vy*=.97;p.life-=.016;g.fillStyle=p.h!=null?`hsla(${p.h},100%,65%,${Math.max(0,p.life)})`:p.c;g.globalAlpha=Math.max(0,p.life);g.beginPath();g.arc(p.x,p.y,2.2,0,6.3);g.fill();});g.restore();g.globalAlpha=1;
      sparks=sparks.filter(p=>p.life>0);if(sparks.length>900)sparks.splice(0,sparks.length-900);
      rings.forEach(r=>{r.r+=18;r.a-=.018;g.lineWidth=r.m?10:6;g.strokeStyle=r.m?`hsla(${(r.r/2+now/5)%360},100%,65%,${Math.max(0,r.a)})`:`rgba(${r.c||'255,215,110'},${Math.max(0,r.a)})`;g.beginPath();g.arc(cx,cy,r.r,0,6.3);g.stroke();});rings=rings.filter(r=>r.a>0);
      g.restore();
      // destello
      if(t>=T_FLASH&&t<T_CARDS+200){const k=(t-T_FLASH)/(T_CARDS+200-T_FLASH);g.fillStyle=hue?`hsla(${(now/4)%360},100%,92%,${1-k})`:`rgba(255,255,255,${1-k})`;g.fillRect(0,0,w,h);
        if(!ov.dataset.flash){ov.dataset.flash='1';if(big){rings.push({r:0,a:1,m:hue});if(hue){setTimeout(()=>rings.push({r:0,a:1,m:true}),180);setTimeout(()=>rings.push({r:0,a:1,m:true}),360);}burst(cx,cy,hue?420:140,best);shake=hue?1.4:.5;}else rings.push({r:0,a:.7,c:WC[1]});}}
      if(phase==='warp'&&t>=T_CARDS){phase='cards';ov.classList.add('cards');next();}};
    raf=requestAnimationFrame(frame);});}
};
