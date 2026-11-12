/* ===================== Inicio: proyectos recientes y teoría con imágenes ===================== */
const Recent={
  get(){try{return JSON.parse(localStorage.getItem('mb:recent')||'[]')||[];}catch(e){return [];}},
  touch(folder){if(!folder)return;const l=this.get().filter(x=>x.f!==folder);l.unshift({f:folder,t:Date.now()});try{localStorage.setItem('mb:recent',JSON.stringify(l.slice(0,40)));}catch(e){}},
  rename(a,b){const l=this.get().map(x=>x.f===a?{...x,f:b}:x);try{localStorage.setItem('mb:recent',JSON.stringify(l));}catch(e){}}
};
const ago=t=>{const s=Math.max(1,Math.round((Date.now()-t)/1000)),en=LANG()==='en';
  if(s<60)return en?'just now':'ahora mismo';const m=Math.round(s/60);if(m<60)return en?`${m} min ago`:`hace ${m} min`;
  const h=Math.round(m/60);if(h<24)return en?`${h} h ago`:`hace ${h} h`;const d=Math.round(h/24);return en?`${d} day(s) ago`:`hace ${d} día${d>1?'s':''}`;};

/* ---------- Diagramas de ejemplo para la teoría (los dibuja la propia app) ---------- */
// Atributos: * clave, ~ clave parcial, ? opcional, / derivado, + multivaluado, Nombre(Pila,Apellidos) compuesto
function mkER(ents,rels=[],isas=[]){
  const ed=new Editor(null),m={nodes:[],links:[],notes:[]};ed.p={er:m};ed.mode='er';const by={},own=[];
  ents.forEach(([n,x,y,at,wk])=>{const e={id:uid(),k:wk?'weak':'ent',n,x,y,f:{}};m.nodes.push(e);by[n]=e;own.push([e,at||[]]);});
  rels.forEach(([n,x,y,ends,at,idr])=>{const r={id:uid(),k:idr?'idrel':'rel',n,x,y,f:{}};m.nodes.push(r);own.push([r,at||[]]);
    ends.forEach(([en,mn,mx])=>m.links.push({id:uid(),a:r.id,b:by[en].id,mn,mx,c:`(${mn},${mx})`}));});
  isas.forEach(([sup,x,y,subs,tot,dis])=>{const i={id:uid(),k:'isa',n:'',x,y,f:{tot,dis,map:'each'}};m.nodes.push(i);
    m.links.push({id:uid(),a:i.id,b:by[sup].id,c:null,mn:null,mx:null,sup:1});subs.forEach(s=>m.links.push({id:uid(),a:i.id,b:by[s].id,c:null,mn:null,mx:null}));});
  // Atributos en abanico, por el hueco más grande que dejan las líneas del elemento
  const X=()=>erIdx(m);m.nodes.forEach(n=>ed.size(n));
  const fan=(o,list,away)=>{if(!list.length)return;const x=X();
    const dirs=x.linksOf(o.id).map(l=>x.other(l,o.id)).filter(n=>n&&!isAtt(n)).map(n=>Math.atan2(n.y-o.y,n.x-o.x));if(away!=null)dirs.push(away);
    let a0=Math.PI/2,span=2*Math.PI;
    if(dirs.length){const d=[...dirs].sort((p,q)=>p-q);let best=-1;d.forEach((v,i)=>{const nx=i+1<d.length?d[i+1]:d[0]+2*Math.PI,g=nx-v;if(g>best){best=g;a0=v;span=g;}});}
    const pad=Math.min(0.55,span/4),from=a0+pad,len=span-2*pad,n=list.length;
    list.forEach((a,i)=>{const ang=!dirs.length?-Math.PI/2+i*2*Math.PI/n:n===1?a0+span/2:from+len*i/(n-1),rx=o.w/2+a.w/2+(isAtt(o)?12:26),ry=o.h/2+13+(isAtt(o)?16:34);
      const k=!dirs.length&&n>3?1.45:n>4?1.15:1;a.x=Math.round(o.x+Math.cos(ang)*rx*k);a.y=Math.round(o.y+Math.sin(ang)*ry*k*(n>4?1.1:1));});};
  const addAt=(o,spec)=>{let s=spec,f={};while('*~?/+'.includes(s[0])){f[{'*':'k','~':'p','?':'o','/':'d','+':'m'}[s[0]]]=true;s=s.slice(1);}
    const cm=s.match(/^(.+)\((.+)\)$/);const a={id:uid(),k:'attr',n:cm?cm[1]:s,x:o.x,y:o.y,f};if(cm)f.c=true;ed.size(a);m.nodes.push(a);m.links.push({id:uid(),a:o.id,b:a.id,c:null,mn:null,mx:null});
    return [a,cm?cm[2].split(',').map(p=>p.trim()):[]];};
  own.forEach(([o,at])=>{const made=at.map(sp=>addAt(o,sp));fan(o,made.map(x=>x[0]));
    made.forEach(([a,parts])=>{if(!parts.length)return;const kids=parts.map(p=>addAt(a,p)[0]);fan(a,kids,Math.atan2(o.y-a.y,o.x-a.x));});});
  return m;
}
function mkTables(list){return {t:list.map(([n,x,y,c])=>({id:uid(),n,x,y,c:c.map(([a,b,f])=>[a,b,f||''])})),notes:[]};}
function figSVG(mode,m){
  const ed=new Editor(null);ed.p={[mode]:m};ed.mode=mode;let inner,bs;
  if(mode==='er'||mode==='bo'){inner=ed.erString(false);bs=m.nodes.map(n=>[n.x-n.w/2,n.y-n.h/2,n.x+n.w/2,n.y+n.h/2]);
    m.nodes.filter(isIsa).forEach(n=>bs.push([n.x,n.y,n.x+n.w/2+110,n.y+10]));}
  else{inner=ed.tablesString(false);bs=m.t.map(t=>mode==='ded'?[t.x,t.y,t.x+t.w,t.y+t.h]:[t.x-26,t.y,t.x+t.rw,t.y+18+t.rh]);}
  const p=34,x0=Math.min(...bs.map(b=>b[0]))-p,y0=Math.min(...bs.map(b=>b[1]))-p,x1=Math.max(...bs.map(b=>b[2]))+p,y1=Math.max(...bs.map(b=>b[3]))+p,w=x1-x0,h=y1-y0;
  return `<svg class="th-svg" viewBox="${f1(x0)} ${f1(y0)} ${f1(w)} ${f1(h)}" style="max-width:${Math.round(w)}px" role="img">${inner}</svg>`;
}
const TH_FIGS={
  'er-ejemplo':()=>figSVG('er',mkER([['Alumno',0,0,['*DNI','Nombre','?Telefono']],['Curso',560,0,['*Codigo','Nombre','Horas']]],[['matricula',280,0,[['Alumno','0','N'],['Curso','1','N']],['Nota']]])),
  'bo-ejemplo':()=>{const m={nodes:[],links:[],notes:[]},A={id:uid(),k:'ent',n:'Alumno',x:0,y:0,f:{at:['DNI','Nombre']}},C={id:uid(),k:'ent',n:'Curso',x:330,y:0,f:{at:['Codigo','Nombre']}},P={id:uid(),k:'ent',n:'Profesor',x:330,y:170,f:{at:['DNI','Nombre']}};
    m.nodes.push(A,C,P);m.links.push({id:uid(),a:A.id,b:C.id,ea:'0N',eb:'1N'},{id:uid(),a:P.id,b:C.id,ea:'11',eb:'0N'});return figSVG('bo',m);},
  'er-entidades':()=>figSVG('er',mkER([['Pedido',0,0,['*Num','Fecha']],['Linea',520,0,['~NumLinea','Cantidad'],true]],[['tiene',260,0,[['Pedido','1','1'],['Linea','1','N']],[],true]])),
  'er-atributos':()=>figSVG('er',mkER([['Persona',0,0,['*DNI','?Telefono','/Edad','+Email','Nombre(Pila,Apellidos)']]])),
  'er-relaciones':()=>figSVG('er',mkER([['Profesor',0,0,['*DNI','Nombre']],['Asignatura',520,0,['*Codigo','Nombre']]],[['imparte',260,0,[['Profesor','1','1'],['Asignatura','0','N']],['Horario']]])),
  'er-card':()=>figSVG('er',mkER([['Cliente',0,0,['*DNI','Nombre']],['Pedido',540,0,['*Num','Fecha']]],[['realiza',270,0,[['Cliente','1','1'],['Pedido','0','N']]]])),
  'er-ternaria':()=>figSVG('er',mkER([['Profesor',0,0,['*DNI']],['Asignatura',560,0,['*Codigo']],['Grupo',280,290,['*Codigo']]],[['imparte',280,40,[['Profesor','1','1'],['Asignatura','1','N'],['Grupo','1','N']]]])),
  'er-isa':()=>figSVG('er',mkER([['Profesor',260,0,['*DNI','Nombre']],['Titular',0,300,['Plaza']],['Interino',520,300,['FinContrato']]],[],[['Profesor',260,150,['Titular','Interino'],true,true]])),
  'rel-ejemplo':()=>figSVG('rel',mkTables([['Alumno',0,0,[['DNI','CHAR(9)','pk'],['Nombre','VARCHAR(45)'],['Telefono','VARCHAR(15)','null']]],['Curso',560,0,[['Codigo','INT','pk'],['Nombre','VARCHAR(45)'],['Horas','INT']]],
    ['Matricula',260,150,[['DNI','CHAR(9)','pk fk:Alumno'],['Codigo','INT','pk fk:Curso'],['Nota','DECIMAL(4,2)','null']]]])),
  'rel-1n':()=>figSVG('rel',mkTables([['Cliente',0,0,[['DNI','CHAR(9)','pk'],['Nombre','VARCHAR(45)']]],['Pedido',330,0,[['Num','INT','pk'],['Fecha','DATE'],['DNI','CHAR(9)','fk:Cliente']]]])),
  'ded-ejemplo':()=>figSVG('ded',mkTables([['Alumno',0,0,[['DNI','CHAR(9)','pk'],['Nombre','VARCHAR(45)'],['Telefono','VARCHAR(15)','null']]],['Curso',560,0,[['Codigo','INT','pk'],['Nombre','VARCHAR(45)'],['Horas','INT']]],
    ['Matricula',270,200,[['DNI','CHAR(9)','pk fk:Alumno'],['Codigo','INT','pk fk:Curso'],['Nota','DECIMAL(4,2)','null']]]])),
  'ded-1n':()=>figSVG('ded',mkTables([['Cliente',0,0,[['DNI','CHAR(9)','pk'],['Nombre','VARCHAR(45)']]],['Pedido',400,0,[['Num','INT','pk'],['Fecha','DATE'],['DNI','CHAR(9)','fk:Cliente']]]]))
};
const figCache={};
const fig=(k,cap)=>{try{if(!figCache[k])figCache[k]=TH_FIGS[k]();}catch(e){return '';}return `<figure class="th-fig">${figCache[k]}${cap?`<figcaption>${cap}</figcaption>`:''}</figure>`;};

/* ---------- SQL: consultas (texto nuevo) ---------- */
const tbl=(head,rows)=>`<div class="th-tbl"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td${c==='NULL'?' class="nul"':''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const code=s=>`<pre class="th-code">${esc(s)}</pre>`;
const DATOS=`<div class="th-row">${tbl(['DNI','Nombre','Ciudad'],[['111A','Ana','Valencia'],['222B','Luis','Madrid'],['333C','Marta','Valencia'],['444D','Pablo','NULL']])}${tbl(['Codigo','Nombre','Horas'],[['1','Bases de datos','160'],['2','Programación','250'],['3','Lenguajes de marcas','130']])}${tbl(['DNI','Codigo','Nota'],[['111A','1','8.5'],['111A','2','6'],['222B','1','4'],['333C','3','9']])}</div><p class="th-cap">Alumno · Curso · Matricula</p>`;
const SQL_Q=[
 {id:'q-datos',t:'Las tablas de los ejemplos',h:`<p>Todas las consultas de este capítulo usan estas tres tablas. Puedes copiarlas en la pestaña <b>Probar</b> y ejecutarlas tú.</p>${DATOS}`},
 {id:'q-select',t:'SELECT: elegir columnas',h:`<p>Un SELECT dice <b>qué columnas</b> quieres y <b>de qué tabla</b>. <code>*</code> son todas.</p>${code('SELECT Nombre, Ciudad\nFROM Alumno;')}${tbl(['Nombre','Ciudad'],[['Ana','Valencia'],['Luis','Madrid'],['Marta','Valencia'],['Pablo','NULL']])}
   <p>Con <code>AS</code> cambias el nombre de la columna en el resultado, y con <code>DISTINCT</code> quitas repetidos:</p>${code('SELECT DISTINCT Ciudad AS Poblacion\nFROM Alumno;')}`},
 {id:'q-where',t:'WHERE: filtrar filas',h:`<p><code>WHERE</code> se queda solo con las filas que cumplen la condición.</p>${code("SELECT Nombre\nFROM Alumno\nWHERE Ciudad = 'Valencia';")}${tbl(['Nombre'],[['Ana'],['Marta']])}
   <table class="th-t"><tr><th>Operador</th><th>Ejemplo</th></tr><tr><td><code>= &lt;&gt; &lt; &gt; &lt;= &gt;=</code></td><td><code>Horas &gt;= 150</code></td></tr><tr><td><code>AND OR NOT</code></td><td><code>Ciudad = 'Valencia' AND Nota &gt; 5</code></td></tr>
   <tr><td><code>BETWEEN</code></td><td><code>Nota BETWEEN 5 AND 7</code></td></tr><tr><td><code>IN</code></td><td><code>Codigo IN (1, 3)</code></td></tr><tr><td><code>LIKE</code></td><td><code>Nombre LIKE 'M%'</code> (empieza por M)</td></tr><tr><td><code>IS NULL</code></td><td><code>Ciudad IS NULL</code> (nunca <code>= NULL</code>)</td></tr></table>`},
 {id:'q-order',t:'ORDER BY y LIMIT',h:`<p><code>ORDER BY</code> ordena (<code>ASC</code> de menor a mayor, <code>DESC</code> al revés). <code>LIMIT</code> se queda con las primeras filas.</p>${code('SELECT Nombre, Horas\nFROM Curso\nORDER BY Horas DESC\nLIMIT 2;')}${tbl(['Nombre','Horas'],[['Programación','250'],['Bases de datos','160']])}<p class="th-tip">En SQL Server es <code>SELECT TOP 2 …</code> y en Oracle <code>FETCH FIRST 2 ROWS ONLY</code>.</p>`},
 {id:'q-group',t:'Contar y agrupar: COUNT, SUM, AVG, GROUP BY, HAVING',h:`<p>Las funciones de agregado resumen muchas filas en un valor: <code>COUNT</code>, <code>SUM</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code>.</p>${code('SELECT COUNT(*) AS Alumnos\nFROM Alumno;')}${tbl(['Alumnos'],[['4']])}
   <p>Con <code>GROUP BY</code> el resumen se hace por grupos. <code>HAVING</code> filtra los grupos (el <code>WHERE</code> filtra filas antes de agrupar).</p>${code('SELECT DNI, AVG(Nota) AS Media\nFROM Matricula\nGROUP BY DNI\nHAVING AVG(Nota) >= 5;')}${tbl(['DNI','Media'],[['111A','7.25'],['333C','9']])}
   <p class="th-tip">Regla: todo lo que esté en el SELECT y no sea un agregado tiene que estar en el GROUP BY.</p>`},
 {id:'q-join',t:'JOIN: juntar tablas',h:`<p>Un <code>JOIN</code> une filas de dos tablas que coinciden en una columna (normalmente la FK con la PK).</p>${code('SELECT a.Nombre, c.Nombre AS Curso, m.Nota\nFROM Matricula m\nJOIN Alumno a ON a.DNI = m.DNI\nJOIN Curso c ON c.Codigo = m.Codigo;')}
   ${tbl(['Nombre','Curso','Nota'],[['Ana','Bases de datos','8.5'],['Ana','Programación','6'],['Luis','Bases de datos','4'],['Marta','Lenguajes de marcas','9']])}
   <p><code>LEFT JOIN</code> saca también las filas de la izquierda que no tienen pareja (con NULL):</p>${code('SELECT a.Nombre, m.Codigo\nFROM Alumno a\nLEFT JOIN Matricula m ON m.DNI = a.DNI\nWHERE m.Codigo IS NULL;')}${tbl(['Nombre','Codigo'],[['Pablo','NULL']])}<p class="th-cap">Alumnos sin ninguna matrícula.</p>`},
 {id:'q-sub',t:'Subconsultas',h:`<p>Una consulta dentro de otra. Útil para comparar con un valor calculado o con una lista.</p>${code('SELECT Nombre\nFROM Curso\nWHERE Horas > (SELECT AVG(Horas) FROM Curso);')}${tbl(['Nombre'],[['Programación']])}${code('SELECT Nombre\nFROM Alumno\nWHERE DNI IN (SELECT DNI FROM Matricula WHERE Nota >= 8);')}${tbl(['Nombre'],[['Ana'],['Marta']])}`},
 {id:'q-dml',t:'INSERT, UPDATE y DELETE',h:`${code("INSERT INTO Alumno (DNI, Nombre, Ciudad)\nVALUES ('555E', 'Sara', 'Alicante');")}${code("UPDATE Matricula\nSET Nota = 5\nWHERE DNI = '222B' AND Codigo = 1;")}${code("DELETE FROM Matricula\nWHERE Nota < 5;")}
   <p class="th-tip">Sin <code>WHERE</code>, un UPDATE o un DELETE cambia o borra <b>todas</b> las filas. Prueba antes con un SELECT con el mismo WHERE.</p>`},
 {id:'q-orden',t:'En qué orden se ejecuta',h:`<p>Se escribe en un orden, pero la base de datos lo hace en otro. Por eso no puedes usar un alias del SELECT en el WHERE.</p><ol><li><code>FROM</code> y <code>JOIN</code>: qué filas hay</li><li><code>WHERE</code>: filtra filas</li><li><code>GROUP BY</code>: hace grupos</li><li><code>HAVING</code>: filtra grupos</li><li><code>SELECT</code>: calcula las columnas</li><li><code>ORDER BY</code> y <code>LIMIT</code></li></ol>`}
];
const SQL_Q_EN=[
 {id:'q-datos',t:'The example tables',h:`<p>All the queries in this chapter use these three tables. You can try them in the <b>Test</b> tab.</p>${DATOS}`},
 {id:'q-select',t:'SELECT: choose columns',h:`${code('SELECT Nombre, Ciudad\nFROM Alumno;')}<p><code>*</code> means all columns, <code>AS</code> renames a column and <code>DISTINCT</code> removes repeated rows.</p>`},
 {id:'q-where',t:'WHERE: filter rows',h:`${code("SELECT Nombre\nFROM Alumno\nWHERE Ciudad = 'Valencia';")}<p>Operators: <code>= &lt;&gt; &lt; &gt;</code>, <code>AND OR NOT</code>, <code>BETWEEN</code>, <code>IN</code>, <code>LIKE 'M%'</code>, <code>IS NULL</code> (never <code>= NULL</code>).</p>`},
 {id:'q-order',t:'ORDER BY and LIMIT',h:`${code('SELECT Nombre, Horas\nFROM Curso\nORDER BY Horas DESC\nLIMIT 2;')}`},
 {id:'q-group',t:'COUNT, SUM, AVG, GROUP BY, HAVING',h:`${code('SELECT DNI, AVG(Nota) AS Media\nFROM Matricula\nGROUP BY DNI\nHAVING AVG(Nota) >= 5;')}<p>WHERE filters rows before grouping; HAVING filters the groups.</p>`},
 {id:'q-join',t:'JOIN: combine tables',h:`${code('SELECT a.Nombre, c.Nombre AS Curso, m.Nota\nFROM Matricula m\nJOIN Alumno a ON a.DNI = m.DNI\nJOIN Curso c ON c.Codigo = m.Codigo;')}<p><code>LEFT JOIN</code> also keeps rows with no match (NULL).</p>`},
 {id:'q-sub',t:'Subqueries',h:`${code('SELECT Nombre\nFROM Curso\nWHERE Horas > (SELECT AVG(Horas) FROM Curso);')}`},
 {id:'q-dml',t:'INSERT, UPDATE and DELETE',h:`${code("UPDATE Matricula\nSET Nota = 5\nWHERE DNI = '222B';")}<p>Without WHERE, UPDATE and DELETE affect <b>every</b> row.</p>`},
 {id:'q-orden',t:'Execution order',h:`<ol><li>FROM / JOIN</li><li>WHERE</li><li>GROUP BY</li><li>HAVING</li><li>SELECT</li><li>ORDER BY / LIMIT</li></ol>`}
];
// Capítulos: E-R, Relacional, DED, SQL (crear) y SQL (consultas). Cada apartado puede llevar sus dibujos.
const TH_CH=[
 {id:'er',t:'Modelo E-R',te:'E-R model',ico:'er',sec:['intro','boceto','entidades','atributos','relaciones','cardinalidad','ternarias','jerarquias','errores','glosario'],
  figs:{intro:[['er-ejemplo','Un E-R completo: entidades, relación con su atributo y cardinalidades.']],boceto:[['bo-ejemplo','Boceto: solo las entidades y, en las líneas, marcas de cero, uno o muchos. Los atributos se escriben en la zona de texto de arriba.']],entidades:[['er-entidades','Entidad débil (doble rectángulo) unida con una relación identificadora (doble rombo).']],
    atributos:[['er-atributos','Clave (subrayado), opcional (O), derivado (discontinuo), multivaluado (doble óvalo) y compuesto.']],relaciones:[['er-relaciones','Relación binaria con un atributo propio (Horario).']],cardinalidad:[['er-card','Un cliente realiza de 0 a N pedidos; cada pedido es de 1 solo cliente.']],
    ternarias:[['er-ternaria','Relación ternaria: un profesor imparte una asignatura a un grupo.']],jerarquias:[['er-isa','Jerarquía total y exclusiva (t,e).']]}},
 {id:'rel',t:'Modelo relacional',te:'Relational model',ico:'rel',sec:['relacional','paso','normalizacion'],figs:{relacional:[['rel-ejemplo','Relacional de alumnos y cursos: PK subrayada y flechas de cada FK a su tabla.']],paso:[['er-card','Este E-R…'],['rel-1n','…pasa a estas tablas: la FK va al lado N (Pedido).']]}},
 {id:'ded',t:'DED',te:'DSD',ico:'ded',sec:['ded'],figs:{ded:[['ded-ejemplo','DED de alumnos y cursos: tipos de dato, PK, FK y patas en las líneas.'],['ded-1n','Línea continua o discontinua según si la FK forma parte de la PK.']]}},
 {id:'sqlc',t:'SQL: crear tablas',te:'SQL: create tables',ico:'sql',sec:['sql'],figs:{sql:[['ded-ejemplo','Este DED se convierte en el script de abajo.']]}},
 {id:'sqlq',t:'SQL: consultas',te:'SQL: queries',ico:'test',q:true}
];
const thSections=ch=>{const en=LANG()==='en';if(ch.q)return en?SQL_Q_EN:SQL_Q;const TL=en?TEORIA_EN:TEORIA;return ch.sec.map(id=>TL.find(x=>x.id===id)).filter(Boolean);};
function theoryHTML(chId,secId,q){
  const en=LANG()==='en',ch=TH_CH.find(c=>c.id===chId)||TH_CH[0],qq=lc(q||'');
  const nav=TH_CH.map(c=>{const ss=thSections(c),hits=qq?ss.filter(s=>lc(s.t+' '+(s.k||'')+' '+s.h.replace(/<[^>]+>/g,' ')).includes(qq)):ss;
    if(qq&&!hits.length)return '';
    return `<div class="thn-ch${c===ch?' on':''}"><button class="thn-c" data-thc="${c.id}">${ICO[c.ico]||''}<span>${esc(en?c.te:c.t)}</span></button>${(c===ch||qq)?`<div class="thn-s">${hits.map(s=>`<button class="thn-b" data-thc="${c.id}" data-ths="${s.id}" aria-current="${c===ch&&s.id===secId}">${esc(s.t)}</button>`).join('')}</div>`:''}</div>`;}).join('')||`<p class="tnote">${en?'Nothing matches.':'Nada coincide.'}</p>`;
  const ss=thSections(ch);
  const body=ss.map(s=>`<section class="th-sec" id="ths-${s.id}"><h3>${esc(s.t)}</h3>${((ch.figs||{})[s.id]||[]).map(([k,c])=>fig(k,en?'':c)).join('')}${s.h}</section>`).join('');
  return `<div class="thv"><aside class="thv-nav"><input type="search" class="th-q" id="thq2" placeholder="${en?'Search the theory':'Buscar en la teoría'}" value="${escA(q||'')}" aria-label="Buscar en la teoría">${nav}</aside>
    <article class="thv-art th-art" id="thart2"><h2>${esc(en?ch.te:ch.t)}</h2>${body}</article></div>`;
}
