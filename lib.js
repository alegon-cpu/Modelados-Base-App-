/* ===================== Dibujo E-R ===================== */
const CH=6.6; // ancho aprox. de carácter mono 11px
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const f1=n=>Math.round(n*10)/10;
const seg=(a,b,c='mk')=>`<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" class="${c}"/>`;
function parseAttr(a){
  if(typeof a==='object') return {label:'( '+a.n+' )',comp:a.c,cs:a.cs||'d'};
  let s=a,o={};
  while('_-~*'.includes(s[0])){o[s[0]]=1;s=s.slice(1);}
  if(s.endsWith('?')){o.opt=1;s=s.slice(0,-1);}
  o.label=s+(o.opt?' (O)':''); o.k=o['_'];o.p=o['-'];o.d=o['~'];o.m=o['*'];
  return o;
}
const rxOf=l=>Math.max(30,l.length*3.45+14);
function placeGroup(g,cx,cy,ew,eh){
  const [s,items,dx=0,dy=0]=g, at=items.map(parseAttr);
  at.forEach(a=>a.rx=rxOf(a.label));
  const gap=26;
  if(s==='l'||s==='r'){
    const step=32,h=(at.length-1)*step;
    at.forEach((a,i)=>{a.y=cy+dy-h/2+i*step;a.x=s==='l'?cx-ew/2-gap-a.rx+dx:cx+ew/2+gap+a.rx+dx;});
  } else {
    const tot=at.reduce((t,a)=>t+2*a.rx,0)+12*(at.length-1); let x=cx+dx-tot/2;
    at.forEach(a=>{a.x=x+a.rx;x+=2*a.rx+12;a.y=s==='u'?cy-eh/2-gap-13+dy:cy+eh/2+gap+13+dy;});
  }
  return at;
}
function ovalSVG(a){
  let s='';
  if(a.m) s+=`<ellipse cx="${f1(a.x)}" cy="${f1(a.y)}" rx="${f1(a.rx+4)}" ry="17" class="att"/>`;
  s+=`<ellipse cx="${f1(a.x)}" cy="${f1(a.y)}" rx="${f1(a.rx)}" ry="13" class="att${a.d?' dr':''}"/>`;
  s+=`<text x="${f1(a.x)}" y="${f1(a.y+3.8)}" text-anchor="middle" class="tx">${esc(a.label)}</text>`;
  if(a.k||a.p){const w=(a.p?a.label:a.label).length*CH;s+=`<line x1="${f1(a.x-w/2)}" y1="${f1(a.y+6.5)}" x2="${f1(a.x+w/2)}" y2="${f1(a.y+6.5)}" class="ul${a.p?' p':''}"/>`;}
  return s;
}
function hitRect(cx,cy,w,h,dx,dy){
  const tx=dx?(w/2)/Math.abs(dx):Infinity, ty=dy?(h/2)/Math.abs(dy):Infinity, t=Math.min(tx,ty);
  return [cx+dx*t,cy+dy*t];
}
function marker(P,u,many,min0,cls='mk',ocls='mo'){
  const n=[-u[1],u[0]], at=d=>[P[0]+u[0]*d,P[1]+u[1]*d], off=(p,k)=>[p[0]+n[0]*k,p[1]+n[1]*k];
  let s='';
  if(many){const A=at(14);s+=seg(A,off(P,7),cls)+seg(A,P,cls)+seg(A,off(P,-7),cls);}
  else {const B=at(7);s+=seg(off(B,7),off(B,-7),cls);}
  if(min0){const C=at(many?21:17);s+=`<circle cx="${f1(C[0])}" cy="${f1(C[1])}" r="4.5" class="${ocls}"/>`;}
  else {const B=at(many?19:13);s+=seg(off(B,7),off(B,-7),cls);}
  return s;
}
function drawER(er){
  let L='',SH='',MK='',TX='';
  const E={};
  er.ents.forEach(e=>{e.w=Math.max(110,e.n.length*7.8+34);e.h=40;E[e.n]=e;});
  const doAttrs=(o,w,h)=>(o.a||[]).forEach(g=>placeGroup(g,o.x,o.y,w,h).forEach(a=>{
    L+=seg([o.x,o.y],[a.x,a.y],'ln'); SH+=ovalSVG(a);
    if(a.comp) placeGroup([a.cs,a.comp],a.x,a.y,2*a.rx,26).forEach(c=>{L+=seg([a.x,a.y],[c.x,c.y],'ln');SH+=ovalSVG(c);});
  }));
  er.ents.forEach(e=>{
    doAttrs(e,e.w,e.h);
    SH+=`<rect x="${f1(e.x-e.w/2)}" y="${e.y-e.h/2}" width="${f1(e.w)}" height="${e.h}" class="ent"/>`;
    if(e.weak) SH+=`<rect x="${f1(e.x-e.w/2+4)}" y="${e.y-e.h/2+4}" width="${f1(e.w-8)}" height="${e.h-8}" class="ent" style="fill:none"/>`;
    SH+=`<text x="${e.x}" y="${e.y+4.5}" text-anchor="middle" class="tb">${esc(e.n)}</text>`;
  });
  er.rels.forEach(r=>{
    const dw=Math.max(96,r.n.length*7.6+40), dh=48;
    doAttrs(r,dw,dh);
    r.e.forEach(en=>{
      const e=E[en.to];
      let P = en.anc ? [e.x+en.anc[0],e.y+en.anc[1]] : hitRect(e.x,e.y,e.w,e.h,r.x-e.x,r.y-e.y);
      L+=seg([r.x,r.y],P,'ln');
      const len=Math.hypot(r.x-P[0],r.y-P[1]), u=[(r.x-P[0])/len,(r.y-P[1])/len];
      const m=en.c.match(/\((\w),(\w)\)/), min0=m[1]==='0', many=m[2]!=='1';
      MK+=marker(P,u,many,min0);
      const sd=en.side||1, n=[-u[1]*sd,u[0]*sd];
      const lp=[P[0]+u[0]*32+n[0]*13,P[1]+u[1]*32+n[1]*13];
      const anchor=n[0]<-.35?'end':n[0]>.35?'start':'middle';
      TX+=`<text x="${f1(lp[0])}" y="${f1(lp[1]+4)}" text-anchor="${anchor}" class="card">${esc((en.role?en.role+' ':'')+en.c)}</text>`;
    });
    const pts=`${r.x},${r.y-dh/2} ${r.x+dw/2},${r.y} ${r.x},${r.y+dh/2} ${r.x-dw/2},${r.y}`;
    SH+=`<polygon points="${pts}" class="dia"/>`;
    if(r.id) SH+=`<polygon points="${r.x},${r.y-dh/2+6} ${r.x+dw/2-11},${r.y} ${r.x},${r.y+dh/2-6} ${r.x-dw/2+11},${r.y}" class="dia" style="fill:none"/>`;
    SH+=`<text x="${r.x}" y="${r.y+1}" text-anchor="middle" class="tr">${esc(r.n)}</text><text x="${r.x}" y="${r.y+14}" text-anchor="middle" class="tt">${esc(r.t)}</text>`;
  });
  return `<svg viewBox="0 0 ${er.W} ${er.H}" style="min-width:${Math.round(er.W*0.72)}px" role="img" aria-label="Diagrama entidad-relación">${L}${SH}${MK}${TX}</svg>`;
}

/* ===================== Dibujo DED ===================== */
function prepTables(d){
  const T={};
  d.t.forEach(t=>{
    t.cols=t.c.map(c=>{const f=(c[2]||'').split(' ');const o={n:c[0],ty:c[1],pk:f.includes('pk'),nul:f.includes('null'),uq:f.includes('uq')};const fk=f.find(x=>x.startsWith('fk:'));if(fk)o.fk=fk.slice(3);return o;});
    t.w=Math.max(150,t.n.length*8+40,...t.cols.map(c=>(c.n.length+1+c.ty.length+(c.uq?3:0))*7.2+44));
    t.h=26+t.cols.length*20+8; t.cx=t.x+t.w/2; t.cy=t.y+t.h/2; T[t.n]=t;
  });
  return T;
}
function icon(c,x,y){
  if(c.pk){const cl=c.fk?'ifk':'ipk';return `<circle cx="${x+3}" cy="${y}" r="3.4" class="${cl}"/><rect x="${x+5}" y="${y-1.2}" width="7" height="2.4" class="${cl}"/><rect x="${x+9.5}" y="${y}" width="2" height="3" class="${cl}"/>`;}
  const p=`${x+6},${y-4.5} ${x+10.5},${y} ${x+6},${y+4.5} ${x+1.5},${y}`;
  if(c.fk) return `<polygon points="${p}" class="ifk"/>`;
  if(c.nul) return `<polygon points="${p}" class="inul"/>`;
  return `<polygon points="${p}" class="icol"/>`;
}
function rectExit(t,p,q){
  const vx=q[0]-p[0],vy=q[1]-p[1];
  const tx=vx>0?(t.x+t.w-p[0])/vx:vx<0?(t.x-p[0])/vx:Infinity;
  const ty=vy>0?(t.y+t.h-p[1])/vy:vy<0?(t.y-p[1])/vy:Infinity;
  const k=Math.min(tx,ty);return [p[0]+vx*k,p[1]+vy*k];
}
// Ruta en ángulo recto entre dos cajas (del borde de A al borde de B)
function routeOrtho(A,B,off){
  const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
  const gx=Math.max(B.x-(A.x+A.w),A.x-(B.x+B.w)),gy=Math.max(B.y-(A.y+A.h),A.y-(B.y+B.h));
  if(gx>=16&&gx>=gy){const right=A.x+A.w<=B.x,xa=right?A.x+A.w:A.x,xb=right?B.x:B.x+B.w;
    const lo=Math.max(A.y,B.y)+12,hi=Math.min(A.y+A.h,B.y+B.h)-12;
    if(lo<=hi){const y=cl((lo+hi)/2+off,lo,hi);return [[xa,y],[xb,y]];}
    const ya=cl(A.y+A.h/2+off,A.y+8,A.y+A.h-8),yb=cl(B.y+B.h/2+off,B.y+8,B.y+B.h-8),mx=(xa+xb)/2;return [[xa,ya],[mx,ya],[mx,yb],[xb,yb]];}
  if(gy>=16){const down=A.y+A.h<=B.y,ya=down?A.y+A.h:A.y,yb=down?B.y:B.y+B.h;
    const lo=Math.max(A.x,B.x)+16,hi=Math.min(A.x+A.w,B.x+B.w)-16;
    if(lo<=hi){const x=cl((lo+hi)/2+off,lo,hi);return [[x,ya],[x,yb]];}
    const xa=cl(A.x+A.w/2+off,A.x+10,A.x+A.w-10),xb=cl(B.x+B.w/2+off,B.x+10,B.x+B.w-10),my=(ya+yb)/2;return [[xa,ya],[xa,my],[xb,my],[xb,yb]];}
  // muy juntas: sale por la derecha de A y entra por arriba o abajo de B
  const y=A.y+A.h/2+off,xb=B.x+B.w/2,yb=B.y>A.y?B.y:B.y+B.h;return [[A.x+A.w,y],[Math.max(A.x+A.w+20,xb),y],[Math.max(A.x+A.w+20,xb),yb]];
}
const unitV=(p,q)=>{const l=Math.hypot(q[0]-p[0],q[1]-p[1])||1;return[(q[0]-p[0])/l,(q[1]-p[1])/l];};
function endLabel(P,u,txt){const n=[-u[1],u[0]],lp=[P[0]+u[0]*20+n[0]*12,P[1]+u[1]*20+n[1]*12],an=n[0]<-.35?'end':n[0]>.35?'start':'middle';
  return `<text x="${f1(lp[0])}" y="${f1(lp[1]+4)}" text-anchor="${an}" class="card">${txt}</text>`;}
function drawDED(d){
  const T=prepTables(d); let LK='',BX='',MK='';
  const links=[]; d.t.forEach(t=>t.cols.forEach(c=>{if(c.fk&&T[c.fk])links.push({ch:t,pa:T[c.fk],c});}));
  const pairs={}; links.forEach(l=>{const k=[l.ch.n,l.pa.n].sort().join('|');(pairs[k]=pairs[k]||[]).push(l);});
  Object.values(pairs).forEach(arr=>arr.forEach((l,j)=>l.off=(j-(arr.length-1)/2)*26));
  links.forEach(l=>{
    const {ch,pa,c}=l, key=(ch.id||ch.n)+'|'+c.fk, dash=(c.pk?'':' dash')+(d.selFk===key?' lsel':''), HIT=s=>d.hit?s.replace(/class="lk[^"]*"/,`class="hitl" fill="none" data-fk="${esc(key).replace(/"/g,'&quot;')}"`):'';
    const childOne=(c.pk&&ch.cols.filter(x=>x.pk).length===1)||c.uq;
    if(ch===pa){
      const x2=ch.x+ch.w,y2=ch.y+ch.h;
      const sp=`<path d="M${x2-34},${y2} V${y2+26} H${x2+26} V${y2-34} H${x2}" class="lk${dash}"/>`;LK+=sp+HIT(sp);
      MK+=marker([x2-34,y2],[0,1],!childOne,true,'lkm','lko')+marker([x2,y2-34],[1,0],false,c.nul,'lkm','lko');
      return;
    }
    let A,B,uA,uB;
    if(d.ortho){const pts=routeOrtho(ch,pa,l.off);A=pts[0];B=pts[pts.length-1];uA=unitV(pts[0],pts[1]);uB=unitV(pts[pts.length-1],pts[pts.length-2]);
      const sp=`<polyline points="${pts.map(p=>f1(p[0])+','+f1(p[1])).join(' ')}" class="lk${dash}"/>`;LK+=sp+HIT(sp);}
    else{let p=[ch.cx,ch.cy],q=[pa.cx,pa.cy]; const len=Math.hypot(q[0]-p[0],q[1]-p[1]), n=[-(q[1]-p[1])/len,(q[0]-p[0])/len];
      p=[p[0]+n[0]*l.off,p[1]+n[1]*l.off]; q=[q[0]+n[0]*l.off,q[1]+n[1]*l.off];
      A=rectExit(ch,p,q);B=rectExit(pa,q,p);
      const sp=`<line x1="${f1(A[0])}" y1="${f1(A[1])}" x2="${f1(B[0])}" y2="${f1(B[1])}" class="lk${dash}"/>`;LK+=sp+HIT(sp);
      uA=unitV(A,B);uB=[-uA[0],-uA[1]];}
    if(d.not==='uml')MK+=endLabel(A,uA,childOne?'0..1':'0..*')+endLabel(B,uB,c.nul?'0..1':'1');
    else MK+=marker(A,uA,!childOne,true,'lkm','lko')+marker(B,uB,false,c.nul,'lkm','lko');
  });
  d.t.forEach(t=>{
    BX+=`<rect x="${t.x}" y="${t.y}" width="${f1(t.w)}" height="${t.h}" rx="6" class="tbox"/>`;
    BX+=`<path d="M${t.x},${t.y+26} V${t.y+6} a6,6 0 0 1 6,-6 H${f1(t.x+t.w-6)} a6,6 0 0 1 6,6 V${t.y+26} Z" class="thd"/>`;
    BX+=`<text x="${t.x+10}" y="${t.y+17.5}" class="thx${t._dup?' dup':''}">${esc(t.n)}</text>`;
    t.cols.forEach((c,i)=>{const y=t.y+26+10+i*20;
      BX+=icon(c,t.x+9,y);
      BX+=`<text x="${t.x+27}" y="${y+4}" class="cx${c.pk?' cpk':''}${c.fk?' cfk':''}${t._dupCols&&t._dupCols.has(String(c.n).toLowerCase())?' dup':''}">${esc(c.n)} <tspan class="cty">${esc(c.ty)}</tspan>${c.uq?' <tspan class="uq">UQ</tspan>':''}</text>`;});
  });
  return `<svg viewBox="0 0 ${d.W} ${d.H}" style="min-width:${Math.round(d.W*0.72)}px" role="img" aria-label="Diagrama de estructura de datos">${LK}${MK}${BX}</svg>`;
}

/* ===================== Relacional (diagrama referencial) ===================== */
function drawRef(d,fixed){
  const T=prepTables(d), RH=18;
  const tagsOf=c=>(c.nul?'(O)':'')+(c.uq?'(UQ)':'')+(c.fk?'(FK)':'');
  d.t.forEach(t=>{
    t.rw=Math.max(120,t.n.length*7.6+20,...t.cols.map(c=>c.n.length*7.2+(tagsOf(c)?tagsOf(c).length*6+14:0)+22));
    t.ry=t.y+18; t.rh=t.cols.length*RH+8;
    t.rowY=i=>t.ry+4+i*RH+RH/2;
  });
  let LN='',BX='';
  d.t.forEach(t=>t.cols.forEach((c,i)=>{
    if(!c.fk||!T[c.fk])return; const pa=T[c.fk], pi=Math.max(0,pa.cols.findIndex(x=>x.pk));
    const sy=t.rowY(i), ey=pa.rowY(pi);
    let pts, ex, dir;
    if(pa===t){const x=t.x;pts=[[x,sy],[x-22,sy],[x-22,ey],[x,ey]];ex=x;dir=1;}
    else if(pa.x>=t.x+t.rw){const mx=(t.x+t.rw+pa.x)/2;pts=d.ortho?[[t.x+t.rw,sy],[mx,sy],[mx,ey],[pa.x,ey]]:[[t.x+t.rw,sy],[t.x+t.rw+14,sy],[pa.x-16,ey],[pa.x,ey]];ex=pa.x;dir=1;}
    else if(pa.x+pa.rw<=t.x){const mx=(t.x+pa.x+pa.rw)/2;pts=d.ortho?[[t.x,sy],[mx,sy],[mx,ey],[pa.x+pa.rw,ey]]:[[t.x,sy],[t.x-14,sy],[pa.x+pa.rw+16,ey],[pa.x+pa.rw,ey]];ex=pa.x+pa.rw;dir=-1;}
    else {const xl=Math.min(t.x,pa.x)-18;pts=[[t.x,sy],[xl,sy],[xl,ey],[pa.x,ey]];ex=pa.x;dir=1;}
    const key=(t.id||t.n)+'|'+c.fk,PP=pts.map(p=>f1(p[0])+','+f1(p[1])).join(' ');
    LN+=`<polyline points="${PP}" class="rarr${d.selFk===key?' lsel':''}"/>`+(d.hit?`<polyline points="${PP}" class="hitl" fill="none" data-fk="${esc(key).replace(/"/g,'&quot;')}"/>`:'');
    LN+=`<polygon points="${ex},${ey} ${ex-8*dir},${ey-4.5} ${ex-8*dir},${ey+4.5}" class="rhead"/>`;
  }));
  d.t.forEach(t=>{
    BX+=`<text x="${f1(t.x+t.rw/2)}" y="${t.ry-5}" text-anchor="middle" class="rnm${t._dup?' dup':''}">${esc(t.n)}</text>`;
    BX+=`<rect x="${t.x}" y="${t.ry}" width="${f1(t.rw)}" height="${t.rh}" class="rbox"/>`;
    t.cols.forEach((c,i)=>{const y=t.rowY(i)+4, tg=tagsOf(c);
      BX+=`<text x="${t.x+8}" y="${y}" class="rcol${c.pk?' rpk':''}${c.fk?' rfk':''}${t._dupCols&&t._dupCols.has(String(c.n).toLowerCase())?' dup':''}">${esc(c.n)}${tg?`<tspan class="rtag" dx="8">${tg}</tspan>`:''}</text>`;
      if(c.pk) BX+=`<line x1="${t.x+8}" y1="${y+3}" x2="${f1(t.x+8+c.n.length*7.2)}" y2="${y+3}" class="rul"/>`;});
  });
  if(fixed) return `<svg>${LN}${BX}</svg>`;
  const H=Math.max(...d.t.map(t=>t.ry+t.rh))+20, W=Math.max(...d.t.map(t=>t.x+t.rw))+20;
  return `<svg viewBox="-30 0 ${W+30} ${H}" style="min-width:${Math.round((W+30)*0.72)}px" role="img" aria-label="Diagrama referencial">${LN}${BX}</svg>`;
}
