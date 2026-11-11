/* ===================== Ajustes ===================== */
const SET_DEF={uiScale:100,accent:'green',contrast:false,reduceMotion:false,thick:false,cb:false,focusAll:false,
  grid:true,snap:false,zoomSpeed:'normal',autoUpdate:true,winStart:'max',onTop:false,sqlDialect:'mysql',sampleRows:5,lang:''};
const Settings={
  _c:null,
  get(){if(this._c)return this._c;let v={};try{v=JSON.parse(localStorage.getItem('mb:set')||'{}')||{};}catch(e){}return this._c={...SET_DEF,...v};},
  set(k,val){const c={...this.get(),[k]:val};this._c=c;try{localStorage.setItem('mb:set',JSON.stringify(c));}catch(e){}this.apply();
    if(k==='winStart'||k==='onTop'){try{window.api.winPref({start:c.winStart,onTop:c.onTop}).catch(()=>{});}catch(e){}}},
  reset(){this._c={...SET_DEF};try{localStorage.setItem('mb:set',JSON.stringify(this._c));}catch(e){}this.apply();try{window.api.winPref({start:SET_DEF.winStart,onTop:SET_DEF.onTop}).catch(()=>{});}catch(e){}},
  apply(){const c=this.get(),r=document.documentElement;
    r.dataset.accent=c.accent;
    r.classList.toggle('hc',!!c.contrast);r.classList.toggle('rm',!!c.reduceMotion);r.classList.toggle('thick',!!c.thick);
    r.classList.toggle('cb',!!c.cb);r.classList.toggle('focusall',!!c.focusAll);
    try{window.api.winZoom(c.uiScale/100).catch(()=>{});}catch(e){}
    if(typeof App!=='undefined'&&App.ed&&App.ed.p&&App.ed.svg)App.ed.render();},
  init(){this.apply();try{window.api.winPref({start:this.get().winStart,onTop:this.get().onTop}).catch(()=>{});}catch(e){}
    const lang0=LANG();
    window.addEventListener('storage',async e=>{if(e.key==='mb:set'){this._c=null;if(LANG()!==lang0){try{await App.flushAll();App.keepPlace();}catch(x){}window.api.reload();return;}this.apply();if(typeof App!=='undefined'&&App.settingsOpen)App.renderSettings();}});}
};

/* ===================== Importar desde ERDPlus ===================== */
function fromERDPlus(text){
  let d;try{d=JSON.parse(String(text||'').replace(/^\uFEFF/,''));}catch(e){throw new Error('El archivo no es un diagrama de ERDPlus válido.');}
  const shapes=Array.isArray(d&&d.shapes)?d.shapes:[],cons=Array.isArray(d&&d.connectors)?d.connectors:[];
  if(!shapes.length)throw new Error('El archivo de ERDPlus no tiene ningún elemento.');
  const ty=s=>String(s.type||'').toLowerCase();
  if(shapes.some(s=>ty(s)==='table')&&!shapes.some(s=>ty(s)==='entity'))
    throw new Error('Ese archivo es un modelo relacional de ERDPlus. Aquí se importan diagramas E-R. Para tablas: en ERDPlus genera el SQL y pégalo en la pestaña SQL («Dibujar desde este SQL»).');
  const byId={},notes=[];
  shapes.forEach(s=>{const dt=s.details||{},x=+dt.x||0,y=+dt.y||0,t=ty(s);
    if(t==='entity')byId[dt.id]={id:uid(),k:/weak/i.test(String(dt.type||''))?'weak':'ent',n:String(dt.name||'Entidad'),x:x+60,y:y+20,f:{}};
    else if(t==='attribute')byId[dt.id]={id:uid(),k:'attr',n:String(dt.name||'atributo'),x:x+45,y:y+15,
      f:{k:!!(dt.isUnique||dt.isPrimaryKey||dt.isKey),o:!!dt.isOptional,d:!!dt.isDerived,m:!!dt.isMultivalued,c:!!dt.isComposite}};
    else if(t==='relationship')byId[dt.id]={id:uid(),k:dt.isIdentifying?'idrel':'rel',n:String(dt.name||'relacion'),x:x+50,y:y+30,f:{},_slots:Array.isArray(dt.slots)?dt.slots:[]};
    else if((t==='label'||t==='text'||t==='note')&&(dt.name||dt.text))notes.push({id:uid(),k:'note',x,y,w:180,c:'y',text:String(dt.name||dt.text)});});
  const nodes=Object.values(byId),links=[];
  if(!nodes.length)throw new Error('No he encontrado entidades, relaciones ni atributos en el archivo.');
  cons.forEach(c=>{const s=byId[c.source],t=byId[c.destination],det=c.details||{};if(!s||!t)return;
    if(isRel(s)||isRel(t)){const r=isRel(s)?s:t,e=r===s?t:s;if(!isEnt(e))return;
      const eid=r===s?c.destination:c.source,sl=r._slots;
      const slot=sl.find(x=>x.slotIndex===det.slotIndex&&(x.entityId==null||x.entityId===eid))||sl.find(x=>x.entityId===eid)||null;
      const mn=slot&&slot.participation?(/mandatory/i.test(slot.participation)?'1':'0'):null,mx=slot&&slot.cardinality?(/one/i.test(slot.cardinality)?'1':'N'):null;
      links.push({id:uid(),a:r.id,b:e.id,mn,mx,c:mn&&mx?`(${mn},${mx})`:null});}
    else if(isAtt(s)||isAtt(t)){const at=isAtt(s)?s:t,ow=at===s?t:s;links.push({id:uid(),a:ow.id,b:at.id,c:null,mn:null,mx:null});}});
  nodes.forEach(n=>delete n._slots);
  // En una entidad débil, la clave es parcial
  const X=erIdx({nodes,links});nodes.filter(isAtt).forEach(a=>{const ow=X.ownerOf(a);if(ow&&ow.k==='weak'&&a.f.k){a.f.k=false;a.f.p=true;}});
  const all=[...nodes,...notes],x0=Math.min(...all.map(n=>n.x)),x1=Math.max(...all.map(n=>n.x)),y0=Math.min(...all.map(n=>n.y)),y1=Math.max(...all.map(n=>n.y));
  const dx=W/2-(x0+x1)/2,dy=H/2-(y0+y1)/2;all.forEach(n=>{n.x=Math.round(n.x+dx);n.y=Math.round(n.y+dy);});
  return {nodes,links,notes};
}

/* ===================== Importar SQL (CREATE TABLE) ===================== */
function splitTop(s,sep){const out=[];let d=0,q=null,cur='';
  for(let i=0;i<s.length;i++){const ch=s[i];
    if(q){cur+=ch;if(ch===q&&s[i-1]!=='\\')q=null;continue;}
    if(ch==="'"||ch==='"'||ch==='`'){q=ch;cur+=ch;continue;}
    if(ch==='(')d++;else if(ch===')')d--;
    if(ch===sep&&d<=0){out.push(cur);cur='';continue;}
    cur+=ch;}
  if(cur.trim())out.push(cur);return out;}
const unq=s=>String(s||'').trim().replace(/^[`"\[]/,'').replace(/[`"\]]$/,'').trim();
const lastPart=s=>{const p=String(s||'').trim().match(/(?:[`"\[][^`"\]]+[`"\]]|[^.\s]+)/g)||[''];return unq(p[p.length-1]);};
const colList=s=>splitTop(String(s||''),',').map(x=>lastPart((x.trim().match(/^(?:[`"\[][^`"\]]+[`"\]]|\S+)/)||[''])[0])).filter(Boolean);
const RX_NAME='(?:[`"\\[][^`"\\]]+[`"\\]]|[^\\s(]+)';
function parseSQL(text){
  const clean=String(text||'').replace(/^\s*GO\s*;?\s*$/gim,';').replace(/^\s*\\.*$/gm,'').replace(/\/\*[\s\S]*?\*\//g,' ').split('\n').map(l=>l.replace(/(^|\s)(--|#).*$/,'$1')).join('\n');
  const stmts=splitTop(clean,';').map(x=>x.trim()).filter(Boolean);
  const tables=[],byName={},warn=[],get=n=>byName[lc(n)];
  const fkRx=new RegExp('^(?:CONSTRAINT\\s+'+RX_NAME+'\\s+)?FOREIGN\\s+KEY\\s*(?:'+RX_NAME+'\\s*)?\\(([^)]*)\\)\\s*REFERENCES\\s+('+RX_NAME+')\\s*\\(([^)]*)\\)','i');
  const pkRx=new RegExp('^(?:CONSTRAINT\\s+'+RX_NAME+'\\s+)?PRIMARY\\s+KEY\\s*(?:'+RX_NAME+'\\s*)?\\(([^)]*)\\)','i');
  const uqRx=new RegExp('^(?:CONSTRAINT\\s+'+RX_NAME+'\\s+)?UNIQUE(?:\\s+(?:KEY|INDEX))?\\s*(?:'+RX_NAME+'\\s*)?\\(([^)]*)\\)','i');
  const constraint=(tb,it)=>{let m;
    if(m=it.match(fkRx)){tb.fks.push({cols:colList(m[1]),ref:lastPart(m[2])});return true;}
    if(m=it.match(pkRx)){tb.pk.push(...colList(m[1]));return true;}
    if(m=it.match(uqRx)){const c=colList(m[1]);if(c.length===1)tb.uq.push(c[0]);return true;}
    if(/^(?:KEY|INDEX|FULLTEXT|SPATIAL|CHECK|CONSTRAINT)\b/i.test(it))return true;
    return false;};
  const createRx=new RegExp('^CREATE\\s+(?:TEMPORARY\\s+)?TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?((?:'+RX_NAME+'\\.)?'+RX_NAME+')\\s*\\(','i');
  for(const st of stmts){
    let m=st.match(createRx);
    if(m){const name=lastPart(m[1]),start=m[0].length-1;let d=0,q=null,end=-1;
      for(let i=start;i<st.length;i++){const ch=st[i];if(q){if(ch===q)q=null;continue;}if(ch==="'"||ch==='"'||ch==='`'){q=ch;continue;}if(ch==='(')d++;else if(ch===')'){d--;if(!d){end=i;break;}}}
      if(end<0){warn.push(`No he podido leer la tabla «${name}» (falta un paréntesis).`);continue;}
      const tb={n:name,cols:[],pk:[],uq:[],fks:[]};
      splitTop(st.slice(start+1,end),',').forEach(raw=>{const it=raw.trim().replace(/\s+/g,' ');if(!it||constraint(tb,it))return;
        const nm=it.match(/^([`"\[][^`"\]]+[`"\]]|\S+)\s*(.*)$/);if(!nm)return;const cn=unq(nm[1]),rest=nm[2]||'';
        const ty=rest.match(/^([A-Za-z_]\w*(?:\s+(?:VARYING|PRECISION))?(?:\s*\([^)]*\))?(?:\s+UNSIGNED)?)/i);
        const type=ty?ty[1].toUpperCase().replace(/\s*\(\s*/,'(').replace(/\s*\)/,')').replace(/\s*,\s*/g,','):'';
        const up=rest.toUpperCase();
        tb.cols.push({n:cn,type,pk:/\bPRIMARY\s+KEY\b/.test(up),nn:/\bNOT\s+NULL\b/.test(up),uq:/\bUNIQUE\b/.test(up)});
        const rf=rest.match(new RegExp('\\bREFERENCES\\s+('+RX_NAME+')','i'));if(rf)tb.fks.push({cols:[cn],ref:lastPart(rf[1])});});
      if(get(name))warn.push(`La tabla «${name}» aparece dos veces: me quedo con la última.`);
      tables.push(tb);byName[lc(name)]=tb;continue;}
    m=st.match(new RegExp('^ALTER\\s+TABLE\\s+(?:ONLY\\s+)?((?:'+RX_NAME+'\\.)?'+RX_NAME+')\\s+([\\s\\S]*)$','i'));
    if(m){const tb=get(lastPart(m[1]));if(!tb){warn.push(`ALTER TABLE sobre «${lastPart(m[1])}», que no se crea en el SQL.`);continue;}
      splitTop(m[2],',').forEach(raw=>{const it=raw.trim().replace(/\s+/g,' ').replace(/^ADD\s+/i,'');constraint(tb,it);});continue;}
  }
  if(!tables.length)throw new Error('No he encontrado ningún CREATE TABLE en el SQL.');
  const out=[...new Map(tables.map(t=>[lc(t.n),t])).values()].map(tb=>{
    const pk=new Set(tb.pk.map(lc)),uq=new Set(tb.uq.map(lc)),fkOf={};
    tb.fks.forEach(f=>{const ref=get(f.ref);if(!ref){warn.push(`${tb.n}: la clave ajena apunta a «${f.ref}», que no está en el SQL.`);return;}f.cols.forEach(c=>fkOf[lc(c)]=ref.n);});
    if(!tb.cols.length)warn.push(`La tabla «${tb.n}» no tiene columnas.`);
    if(!tb.cols.some(c=>c.pk||pk.has(lc(c.n))))warn.push(`La tabla «${tb.n}» no tiene clave primaria.`);
    return {id:uid(),n:tb.n,x:0,y:0,_par:[...new Set(Object.values(fkOf))].filter(n=>lc(n)!==lc(tb.n)),
      c:tb.cols.map(c=>{const isPk=c.pk||pk.has(lc(c.n));return [c.n,c.type||'VARCHAR(45)',joinF({pk:isPk?1:0,nul:(!isPk&&!c.nn)?1:0,uq:(!isPk&&(c.uq||uq.has(lc(c.n))))?1:0,fk:fkOf[lc(c.n)]||null})];})};});
  layoutByFK(out);
  return {tables:out,warn:[...new Set(warn)]};
}
// Coloca las tablas por niveles: arriba las que no apuntan a nadie, debajo las que dependen de ellas
function layoutByFK(tables){
  const by={};tables.forEach(t=>by[lc(t.n)]=t);const lev={};
  const L=(t,stack)=>{const k=lc(t.n);if(lev[k]!=null)return lev[k];if(stack.has(k))return 0;stack.add(k);
    const ps=(t._par||[]).map(n=>by[lc(n)]).filter(Boolean);const v=ps.length?1+Math.max(...ps.map(p=>L(p,stack))):0;stack.delete(k);return lev[k]=v;};
  tables.forEach(t=>L(t,new Set()));
  const rows=[];tables.forEach(t=>{const r=lev[lc(t.n)];(rows[r]=rows[r]||[]).push(t);});
  const flat=[];rows.filter(Boolean).forEach(r=>{for(let i=0;i<r.length;i+=5)flat.push(r.slice(i,i+5));});
  let y=0;const widths=[];
  flat.forEach(row=>{let x=0,h=0;row.forEach(t=>{const s=tableSize(t);t.x=x;t.y=y;x+=s.w+110;h=Math.max(h,s.h);});widths.push(x-110);y+=h+100;});
  const wMax=Math.max(...widths,0);
  flat.forEach((row,i)=>{const off=(wMax-widths[i])/2;row.forEach(t=>t.x+=off);});
  const dx=W/2-wMax/2,dy=H/2-(y-100)/2;
  tables.forEach(t=>{t.x=Math.round(t.x+dx);t.y=Math.round(t.y+dy);delete t._par;});
}
