/* ===================== Probar el SQL (SQLite dentro de la app) ===================== */
const Pruebas={
  SQL:null, dbs:{}, // una base de datos de prueba por proyecto (en memoria)
  async engine(){
    if(this.SQL)return this.SQL;
    if(typeof initSqlJs==='undefined')await new Promise((res,rej)=>{const s=document.createElement('script');s.src='node_modules/sql.js/dist/sql-wasm.js';s.onload=res;s.onerror=()=>rej(new Error('No se pudo cargar SQLite.'));document.head.appendChild(s);});
    const wasm=await window.api.sqlWasm();
    this.SQL=await initSqlJs({wasmBinary:wasm});return this.SQL;
  },
  st(p){return this.dbs[p._id]||null;},
  render(v,p){
    const st=this.st(p);
    v.innerHTML=`<div class="ed-tools"><div class="tgroup"><span class="tlab">Crear la base de prueba desde</span><button class="ebtn" data-act="tst-build" data-v="ded">${GL.table}<span>mi DED</span></button><button class="ebtn" data-act="tst-build" data-v="sql">${ICO.sql}<span>mi SQL</span></button></div>
      <div class="tgroup"><button class="ebtn" data-act="tst-fill" ${st?'':'disabled'}>${GL.table}<span>Rellenar con datos de ejemplo</span></button><button class="ebtn" data-act="tst-fk" ${st?'':'disabled'} title="Intenta meter valores que no existen en cada clave ajena y comprueba que la base los rechaza">${GL.fkcol}<span>Comprobar las claves ajenas</span></button><button class="ebtn danger" data-act="tst-empty" ${st?'':'disabled'}>${GL.clear}<span>Vaciar datos</span></button></div>
      <span class="tspace"></span><span class="tnote" id="tststat">${st?esc(this.statText(st)):'Sin base de datos de prueba'}</span></div>
      <div class="tst-main"><aside class="tst-schema" id="tstschema">${this.schemaHTML(p)}</aside>
      <div class="tst-work"><div class="tst-edhead"><span class="lbl">Consultas · se guardan en SQL/pruebas.sql</span><span class="tspace"></span><button class="ebtn pri" data-act="tst-run" ${st?'':'disabled'} title="Ejecutar (Ctrl+Enter). Si seleccionas un trozo, solo se ejecuta ese trozo.">▶<span>Ejecutar</span></button></div>
      <textarea class="sqlbox tst-q" id="tsttxt" spellcheck="false" placeholder="Escribe aquí INSERT, SELECT, UPDATE o DELETE y pulsa Ctrl+Enter.&#10;&#10;Ejemplo:&#10;SELECT * FROM Cliente;">${esc(p.test||'')}</textarea>
      <div class="tst-out" id="tstout">${st?'':this.introHTML()}</div></div></div>`;
    const t=document.getElementById('tsttxt');
    t.addEventListener('input',()=>{p.test=t.value;App.touch(p);});
    t.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();this.run(p);}
      if(e.key==='Tab'){e.preventDefault();const s=t.selectionStart;t.setRangeText('  ',s,t.selectionEnd,'end');p.test=t.value;App.touch(p);}});
    if(st&&st.last)document.getElementById('tstout').innerHTML=st.last;
  },
  introHTML(){return `<div class="tst-intro"><h3>Prueba tus tablas de verdad</h3><ol><li>Pulsa <b>Crear la base de prueba desde mi DED</b> (o desde tu SQL). Se crea una base de datos SQLite dentro de la app, sin instalar nada.</li>
    <li><b>Rellenar con datos de ejemplo</b> mete filas inventadas que respetan las claves.</li><li>Escribe consultas y pulsa <b>Ejecutar</b> (Ctrl+Enter). Si algo no cumple una clave, NOT NULL o UNIQUE, te dice por qué.</li>
    <li><b>Comprobar las claves ajenas</b> intenta meter valores que no existen y te dice si cada FK los rechaza.</li></ol>
    <p class="tnote">SQLite no comprueba la longitud de los VARCHAR ni los tipos exactos: para eso, prueba el script en tu gestor (MySQL, Oracle…).</p></div>`;},
  statText(st){return `Base de prueba (${st.from==='ded'?'desde el DED':'desde el SQL'}): ${st.sc.order.length} tablas, ${this.totalRows(st)} filas`;},
  totalRows(st){let n=0;st.sc.order.forEach(t=>{try{n+=st.db.exec(`SELECT COUNT(*) FROM ${qidD(t.n,'sqlite')}`)[0].values[0][0];}catch(e){}});return n;},
  schemaHTML(p){const st=this.st(p);
    if(!st)return `<p class="lbl">Tablas</p><p class="tnote">Todavía no hay base de datos de prueba.</p>`;
    return `<p class="lbl">Tablas · pulsa para ver sus filas</p>`+st.sc.order.map(t=>{let n='?';try{n=st.db.exec(`SELECT COUNT(*) FROM ${qidD(t.n,'sqlite')}`)[0].values[0][0];}catch(e){}
      return `<button class="tst-t" data-act="tst-show" data-v="${escA(t.n)}"><span class="tst-tn">${esc(t.n)}</span><span class="cnt">${n}</span><span class="tst-cols">${t.cols.map(c=>`<span class="${c.pk?'pk':''}${c.fk?' fk':''}">${c.pk?GL.pkcol:c.fk?GL.fkcol:''}${esc(c.n)}</span>`).join('')}</span></button>`;}).join('');},
  refresh(p){const s=document.getElementById('tstschema');if(s)s.innerHTML=this.schemaHTML(p);const st=this.st(p),x=document.getElementById('tststat');if(x&&st)x.textContent=this.statText(st);
    document.querySelectorAll('[data-act=tst-fill],[data-act=tst-fk],[data-act=tst-empty],[data-act=tst-run]').forEach(b=>b.disabled=!st);App.renderCounts(p);},
  out(p,html){const o=document.getElementById('tstout');if(o){o.innerHTML=html;o.scrollTop=0;}const st=this.st(p);if(st)st.last=html;},
  async build(p,from){
    let tables;
    if(from==='ded'){if(!p.ded.t.length){toast('Tu DED está vacío. Haz el DED o usa «desde mi SQL».','warn');return;}tables=p.ded.t;}
    else{if(!(p.sql||'').trim()){toast('Tu pestaña SQL está vacía.','warn');return;}try{tables=parseSQL(p.sql).tables;}catch(e){toast(e.message,'warn');return;}}
    let sc;try{sc=schemaOf(tables,false);}catch(e){toast(e.message,'warn');return;}
    let SQL;try{SQL=await this.engine();}catch(e){toast('No se pudo iniciar SQLite: '+e.message,'warn');return;}
    const old=this.st(p);if(old)try{old.db.close();}catch(e){}
    const db=new SQL.Database();db.run('PRAGMA foreign_keys = ON;');
    const script=ddl(sc,'sqlite');
    try{db.exec(script);}catch(e){db.close();delete this.dbs[p._id];this.out(p,`<div class="tst-err"><b>No se pudieron crear las tablas.</b><p>${esc(explainSQLite(e.message))}</p></div>`);this.refresh(p);return;}
    this.dbs[p._id]={db,sc,from};this.refresh(p);
    this.out(p,`<div class="tst-ok"><b>Base de datos de prueba creada</b> con ${sc.order.length} tablas.${sc.warn.length?`<ul class="plist">${sc.warn.map(w=>`<li>${esc(w)}</li>`).join('')}</ul>`:''}<details><summary>Ver el CREATE TABLE usado (SQLite)</summary><pre>${esc(script)}</pre></details></div>`);
  },
  fill(p){const st=this.st(p);if(!st)return;const n=Settings.get().sampleRows||5,data=sampleRows(st.sc,n),sql=insertsSQL(st.sc,data,'sqlite');
    try{st.db.exec('BEGIN;'+sql+'COMMIT;');}catch(e){try{st.db.exec('ROLLBACK;');}catch(x){}this.out(p,`<div class="tst-err"><b>No se pudieron meter los datos de ejemplo.</b><p>${esc(explainSQLite(e.message))}</p></div>`);return;}
    this.refresh(p);this.out(p,`<div class="tst-ok"><b>Datos de ejemplo añadidos</b> (hasta ${n} filas por tabla).${data.warn.length?`<ul class="plist">${data.warn.map(w=>`<li>${esc(w)}</li>`).join('')}</ul>`:''}<details><summary>Ver los INSERT</summary><pre>${esc(sql)}</pre></details></div>`);},
  empty(p){const st=this.st(p);if(!st)return;st.db.run('PRAGMA foreign_keys = OFF;');[...st.sc.order].reverse().forEach(t=>{try{st.db.run(`DELETE FROM ${qidD(t.n,'sqlite')}`);}catch(e){}});st.db.run('PRAGMA foreign_keys = ON;');this.refresh(p);this.out(p,`<div class="tst-ok">Datos borrados. Las tablas siguen creadas.</div>`);},
  fkCheck(p){const st=this.st(p);if(!st)return;const rows=[];
    st.sc.order.forEach(t=>t.fks.forEach(f=>{
      const R=rng('fk'+t.n);const vals=t.cols.map((c,i)=>{const j=f.cs.indexOf(c.n);if(j>=0)return /INT|NUM|DEC/i.test(c.ty)?'987654':`'NO_EXISTE'`;
        if(c.fk){const ff=t.fks.find(x=>x.cs.includes(c.n)),pr=ff&&st.db.exec(`SELECT ${qidD(ff.ref[ff.cs.indexOf(c.n)],'sqlite')} FROM ${qidD(ff.par.n,'sqlite')} LIMIT 1`);if(pr&&pr[0])return sqlLit(pr[0].values[0][0],'sqlite');return 'NULL';}
        if(c.pk&&/INT|NUM/i.test(c.ty))return String(900000+i);let v=sampleValue(t,c,900+i,R);if((c.pk||c.uq)&&typeof v==='string')v=('Z'+(900+i)+v).slice(0,Math.max(4,v.length));return sqlLit(v,'sqlite');});
      const sql=`INSERT INTO ${qidD(t.n,'sqlite')} (${t.cols.map(c=>qidD(c.n,'sqlite')).join(', ')}) VALUES (${vals.join(', ')});`;
      let res;st.db.run('SAVEPOINT fkp;');
      try{st.db.run('PRAGMA defer_foreign_keys = OFF;');st.db.run(sql);res={ok:false,msg:'La base ha aceptado un valor que no existe en «'+f.par.n+'».'};}
      catch(e){const m=String(e.message);res=/FOREIGN KEY/i.test(m)?{ok:true,msg:'Rechaza valores que no existen en «'+f.par.n+'».'}:{ok:null,msg:'No se pudo probar: '+explainSQLite(m)};}
      st.db.run('ROLLBACK TO fkp; RELEASE fkp;');
      rows.push(`<tr><td>${res.ok?'<span class="ok">✓</span>':res.ok===false?'<span class="bad">✗</span>':'<span class="mut">–</span>'}</td><td><b>${esc(t.n)}</b>.${f.cs.map(esc).join(', ')} → ${esc(f.par.n)}</td><td>${esc(res.msg)}</td></tr>`);}));
    this.out(p,rows.length?`<div class="tst-ok"><b>Comprobación de las claves ajenas</b><table class="tst-grid fkres"><tbody>${rows.join('')}</tbody></table><p class="tnote">Se ha intentado meter en cada tabla un valor de FK que no existe, y se ha deshecho al momento.</p></div>`:`<div class="tst-ok">No hay claves ajenas que comprobar.</div>`);},
  show(p,name){const t=document.getElementById('tsttxt');const q=`SELECT * FROM ${qidD(name,'sqlite')};`;this.run(p,q);},
  run(p,forced){
    const st=this.st(p);if(!st){toast('Primero crea la base de prueba.','warn');return;}
    const t=document.getElementById('tsttxt');let sql=forced||'';
    if(!sql&&t){sql=t.selectionEnd>t.selectionStart?t.value.slice(t.selectionStart,t.selectionEnd):t.value;}
    if(!sql.trim()){toast('Escribe una consulta para ejecutar.');return;}
    const parts=[];let n=0;
    try{for(const stmt of st.db.iterateStatements(sql)){n++;const q=stmt.getSQL().trim(),cols=stmt.getColumnNames();
        if(cols.length){const rs=[];while(stmt.step()){if(rs.length<500)rs.push(stmt.get());else{rs.more=true;}}
          parts.push(`<div class="tst-res"><div class="tst-q1">${esc(q.length>140?q.slice(0,140)+'…':q)}</div>${rs.length?`<div class="tst-scroll"><table class="tst-grid"><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rs.map(r=>`<tr>${r.map(v=>`<td${v==null?' class="nul"':''}>${v==null?'NULL':esc(String(v))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'<p class="tnote">Sin filas.</p>'}<p class="tnote">${rs.length}${rs.more?'+ (se muestran 500)':''} fila(s)</p></div>`);}
        else{stmt.step();const k=st.db.getRowsModified(),verb=/^\s*insert/i.test(q)?'insertada(s)':/^\s*update/i.test(q)?'modificada(s)':/^\s*delete/i.test(q)?'borrada(s)':null;
          parts.push(`<div class="tst-res small"><div class="tst-q1">${esc(q.length>140?q.slice(0,140)+'…':q)}</div><p class="tnote">${verb?`${k} fila(s) ${verb}`:'Hecho'}.</p></div>`);}
        stmt.free&&stmt.free();}}
    catch(e){parts.push(`<div class="tst-err"><b>Error en la consulta ${n||1}</b><p>${esc(explainSQLite(e.message))}</p><p class="tnote">${esc(e.message)}</p></div>`);}
    this.out(p,parts.join('')||'<p class="tnote">No había nada que ejecutar.</p>');this.refresh(p);
  },
  forget(id){const st=this.dbs[id];if(st){try{st.db.close();}catch(e){}delete this.dbs[id];}}
};
