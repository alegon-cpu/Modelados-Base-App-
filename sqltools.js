/* ===================== SQL: estructura, dialectos y datos de ejemplo ===================== */
const DIALECTS={mysql:'MySQL',sqlserver:'SQL Server',oracle:'Oracle',postgres:'PostgreSQL'};
const RESERVED=new Set('ORDER GROUP USER TABLE SELECT FROM WHERE KEY INDEX CHECK DEFAULT LEVEL SIZE COMMENT NUMBER DESC ASC RANK VALUES COLUMN FILE MODE OPTION ROW ROWS SESSION START UID ACCESS AUDIT'.split(' '));
const slug=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')||'base_datos';
const qid=s=>qidD(s,'mysql');
function qidD(s,d){s=String(s||'').trim()||'sin_nombre';
  if(/^[A-Za-z_][A-Za-z0-9_]*$/.test(s)&&!RESERVED.has(s.toUpperCase()))return s;
  const c=s.replace(/[`"\[\]]/g,'');return d==='mysql'?'`'+c+'`':d==='sqlserver'?'['+c+']':'"'+c+'"';}
function mapType(ty,d){
  let t=String(ty||'').trim().toUpperCase().replace(/\s+/g,' ');if(!t)t='VARCHAR(45)';
  const m=t.match(/^([A-Z_ ]+?)\s*(\(([^)]*)\))?(\s+UNSIGNED)?$/),base=m?m[1].trim():t,args=m&&m[3]!=null?m[3].replace(/\s/g,''):null,A=args!=null?`(${args})`:'';
  if(d==='mysql'||d==='sqlite')return t;
  if(d==='postgres'){if(/^(DATETIME)$/.test(base))return 'TIMESTAMP';if(base==='TINYINT')return 'SMALLINT';if(base==='DOUBLE')return 'DOUBLE PRECISION';if(/^(BLOB|LONGBLOB)$/.test(base))return 'BYTEA';
    if(/^(MEDIUMTEXT|LONGTEXT|TINYTEXT)$/.test(base))return 'TEXT';if(/^(INT|INTEGER|MEDIUMINT)$/.test(base))return 'INTEGER';return base+A;}
  if(d==='sqlserver'){if(/^(BOOLEAN|BOOL)$/.test(base))return 'BIT';if(/^(TEXT|MEDIUMTEXT|LONGTEXT)$/.test(base))return 'VARCHAR(MAX)';if(base==='DOUBLE')return 'FLOAT';
    if(base==='TIMESTAMP')return 'DATETIME2';if(/^(INTEGER|MEDIUMINT)$/.test(base))return 'INT';return base+A;}
  if(d==='oracle'){if(/^VARCHAR$/.test(base))return 'VARCHAR2'+(A||'(255)');if(/^(TINYINT)$/.test(base))return 'NUMBER(3)';if(base==='SMALLINT')return 'NUMBER(5)';
    if(/^(INT|INTEGER|MEDIUMINT)$/.test(base))return 'NUMBER(10)';if(base==='BIGINT')return 'NUMBER(19)';if(/^(DECIMAL|NUMERIC)$/.test(base))return 'NUMBER'+A;
    if(/^(FLOAT|DOUBLE|REAL)$/.test(base))return 'BINARY_DOUBLE';if(/^(BOOLEAN|BOOL|BIT)$/.test(base))return 'NUMBER(1)';if(/TEXT$/.test(base))return 'CLOB';
    if(/^(DATETIME|TIMESTAMP)$/.test(base))return 'TIMESTAMP';if(base==='TIME')return 'VARCHAR2(8)';return base+A;}
  return t;
}
// Estructura común (orden de creación, PK, UNIQUE y FK agrupadas) a partir de las tablas del DED o del relacional
function schemaOf(src,fromRel){
  const warn=[];
  if(!src.length)throw new Error(fromRel?'Tu relacional no tiene tablas todavía.':'Tu DED no tiene tablas todavía.');
  if(tableDups({t:src.map(t=>({n:t.n,c:t.c}))}))throw new Error('Hay nombres repetidos (en rojo). Cámbialos antes de generar el SQL.');
  const T={};src.forEach(t=>T[lc(t.n)]=t);
  const colsOf=t=>t.c.filter(c=>String(c[0]).trim()).map(c=>{const f=parseF(c[2]);let ty=String(c[1]||'').trim();
    if(fromRel&&(!ty||ty==='VARCHAR(45)'))ty=guessType(c[0],f);return {n:String(c[0]).trim(),ty:ty||guessType(c[0],f),pk:!!f.pk,nn:!!f.pk||!f.nul,uq:!!f.uq,fk:f.fk||null};});
  const S={};src.forEach(t=>{const cs=colsOf(t);S[lc(t.n)]={n:t.n,cols:cs,pk:cs.filter(c=>c.pk).map(c=>c.n),fks:[]};});
  Object.values(S).forEach(t=>{const groups={};t.cols.forEach(c=>{if(c.fk){const k=lc(c.fk);(groups[k]=groups[k]||[]).push(c);}});
    Object.entries(groups).forEach(([k,g])=>{const par=S[k];if(!par){warn.push(`${t.n}: la FK apunta a «${g[0].fk}», que no existe.`);return;}
      const pk=par.cols.filter(c=>c.pk);if(!pk.length){warn.push(`${t.n}: «${par.n}» no tiene clave primaria a la que apuntar.`);return;}
      if(g.length===pk.length&&pk.length>1)t.fks.push({cs:g.map(c=>c.n),par,ref:pk.map(c=>c.n)});
      else g.forEach(c=>{const same=pk.find(x=>lc(x.n)===lc(c.n))||pk.find(x=>lc(c.n).startsWith(lc(x.n)))||pk[0];t.fks.push({cs:[c.n],par,ref:[same.n]});});});});
  const order=[],state={};
  const visit=t=>{const k=lc(t.n);if(state[k])return;state[k]=1;t.fks.forEach(f=>{if(f.par!==t&&!state[lc(f.par.n)])visit(f.par);});state[k]=2;order.push(t);};
  Object.values(S).forEach(visit);
  order.forEach(t=>{if(!t.cols.length)warn.push(`La tabla «${t.n}» no tiene columnas.`);if(!t.pk.length)warn.push(`La tabla «${t.n}» no tiene clave primaria.`);});
  return {order,warn:[...new Set(warn)]};
}
// CREATE TABLE para cada gestor
function ddl(sc,d,opt={}){
  const Q=s=>qidD(s,d),done=new Set(),late=[];let body='';
  sc.order.forEach(t=>{const lines=t.cols.map(c=>`  ${Q(c.n)} ${mapType(c.ty,d)}${c.nn?' NOT NULL':' NULL'}`);
    if(t.pk.length)lines.push(`  PRIMARY KEY (${t.pk.map(Q).join(', ')})`);
    t.cols.filter(c=>c.uq&&!(c.pk&&t.pk.length===1)).forEach(c=>lines.push(`  UNIQUE (${Q(c.n)})`));
    t.fks.forEach(f=>{const fk=`FOREIGN KEY (${f.cs.map(Q).join(', ')}) REFERENCES ${Q(f.par.n)} (${f.ref.map(Q).join(', ')})`;
      if(d==='sqlite'||f.par===t||done.has(lc(f.par.n)))lines.push('  '+fk);else late.push(`ALTER TABLE ${Q(t.n)} ADD ${fk};`);});
    body+=`CREATE TABLE ${Q(t.n)} (\n${lines.join(',\n')}\n)${d==='mysql'?' ENGINE=InnoDB':''};\n\n`;done.add(lc(t.n));});
  if(d==='sqlite')return body;
  const db=slug(opt.name);let head='';
  if(d==='mysql')head=`DROP DATABASE IF EXISTS ${db};\nCREATE DATABASE ${db};\nUSE ${db};\n\n`;
  else if(d==='postgres')head=(LANG()==='en'?`-- In PostgreSQL: create the database and connect to it (in psql: \\c ${db}) before creating the tables.\n`:`-- En PostgreSQL: crea la base de datos y conéctate a ella (en psql: \\c ${db}) antes de crear las tablas.\n`)+`DROP DATABASE IF EXISTS ${db};\nCREATE DATABASE ${db};\n\\c ${db}\n\n`;
  else if(d==='sqlserver')head=`IF DB_ID('${db}') IS NOT NULL DROP DATABASE ${db};\nGO\nCREATE DATABASE ${db};\nGO\nUSE ${db};\nGO\n\n`;
  else if(d==='oracle')head=LANG()==='en'?`-- In Oracle the tables are created in your user (schema): no CREATE DATABASE needed.\n\n`:`-- En Oracle las tablas se crean en tu usuario (esquema): no hace falta CREATE DATABASE.\n\n`;
  let out=head+body;
  if(late.length)out+=(LANG()==='en'?`-- Foreign keys added at the end (the tables point to each other)\n`:`-- Claves ajenas que se añaden al final (las tablas se apuntan entre sí)\n`)+`${late.join('\n')}\n`;
  return out;
}
function genSQL(p,from,d){
  d=d||Settings.get().sqlDialect||'mysql';const sc=schemaOf(p[from].t,from==='rel');
  const fecha=new Date().toLocaleDateString(LANG()==='en'?'en-GB':'es-ES');
  const en=LANG()==='en';let out=en?`-- ${p.name}\n-- Generated from the ${from==='ded'?'DSD':'relational model'} for ${DIALECTS[d]} with Modelado Bases (${fecha})\n`:`-- ${p.name}\n-- Generado desde el ${from==='ded'?'DED':'modelo relacional'} para ${DIALECTS[d]} con Modelado Bases (${fecha})\n`;
  if(from==='rel')out+=en?`-- The relational model has no types: check each column's type.\n`:`-- El relacional no tiene tipos: revisa los tipos de cada columna.\n`;
  sc.warn.forEach(w=>out+=en?`-- Warning: ${t(w)}\n`:`-- Aviso: ${w}\n`);
  out+='\n'+ddl(sc,d,{name:p.name});
  return {sql:out.replace(/\n+$/,'\n'),warn:sc.warn};
}

/* ---------- Datos de ejemplo coherentes ---------- */
const SAMPLE={
  nombres:['Lucía','Hugo','Martina','Mateo','Sofía','Leo','Valeria','Daniel','Paula','Álvaro','Carmen','Pablo','Elena','Marcos','Irene','Javier','Noa','Adrián','Sara','Diego'],
  apellidos:['García','López','Martín','Sánchez','Pérez','Gómez','Ruiz','Díaz','Moreno','Álvarez','Romero','Navarro','Torres','Ramos','Gil','Molina','Ortiz','Castro','Rubio','Serrano'],
  ciudades:['Madrid','Sevilla','Valencia','Bilbao','Zaragoza','Málaga','Granada','Salamanca','Murcia','Valladolid'],
  calles:['Calle Mayor','Avenida de la Paz','Calle del Sol','Plaza España','Calle Real','Paseo del Prado','Calle Luna','Avenida Andalucía'],
  colores:['Rojo','Azul','Verde','Negro','Blanco','Gris','Amarillo'],
  personas:/cliente|alumn|socio|emplead|medic|pacient|persona|profesor|usuari|trabajador|conductor|autor|jugador|lector|huesped|propietari|director|jefe|vendedor|cuidador|veterinari|monitor|tecnic|piloto|pasajer/};
function rng(seed){let s=0;for(const ch of String(seed))s=(s*31+ch.charCodeAt(0))>>>0;s=s||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
const DNI_L='TRWAGMYFPDXBNJZSQVHLCKE';
function sampleValue(t,c,i,R){
  const nm=String(c.n).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase(),ty=String(c.ty||'').toUpperCase(),tn=String(t.n).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
  const len=+((ty.match(/\((\d+)/)||[])[1])||0,pick=a=>a[Math.floor(R()*a.length)],int=(a,b)=>a+Math.floor(R()*(b-a+1)),cut=s=>len&&/CHAR/.test(ty)?String(s).slice(0,len):s;
  const plain=x=>x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''),pN=SAMPLE.nombres[(i*7)%SAMPLE.nombres.length],pA=SAMPLE.apellidos[(i*11)%SAMPLE.apellidos.length],pA2=SAMPLE.apellidos[(i*13+3)%SAMPLE.apellidos.length];
  const date=()=>{const d=new Date(2023,0,1+int(0,1000));return d.toISOString().slice(0,10);};
  if(/^(DATE)$/.test(ty))return {date:date()};
  if(/DATETIME|TIMESTAMP/.test(ty))return {date:date()+` ${String(int(8,20)).padStart(2,'0')}:${pick(['00','15','30','45'])}:00`};
  if(/^TIME/.test(ty)||/^hora/.test(nm))return `${String(int(8,21)).padStart(2,'0')}:${pick(['00','15','30','45'])}:00`;
  if(/BOOL|^BIT/.test(ty))return {bool:R()<.5};
  if(/^(dni|nif|nie)/.test(nm)){const n=int(10000000,99999999);return cut(String(n)+DNI_L[n%23]);}
  if(/mail|correo/.test(nm))return cut(`${plain(pN)}.${plain(pA)}${i+1}@ejemplo.com`);
  if(/tel|movil|fono/.test(nm))return cut(String(int(600000000,699999999)));
  if(/apellido/.test(nm))return cut(/2/.test(nm)?pA2:pA+(/apellidos/.test(nm)?' '+pA2:''));
  if(/^nombre|^nom$/.test(nm))return cut(SAMPLE.personas.test(tn)?pN:`${t.n} ${i+1}`);
  if(/direccion|domicilio|calle/.test(nm))return cut(`${pick(SAMPLE.calles)} ${int(1,120)}`);
  if(/ciudad|localidad|poblacion|municipio/.test(nm))return cut(pick(SAMPLE.ciudades));
  if(/provincia/.test(nm))return cut(pick(SAMPLE.ciudades));
  if(/pais/.test(nm))return cut('España');
  if(/^cp$|postal/.test(nm))return cut(String(int(1000,52999)).padStart(5,'0'));
  if(/color/.test(nm))return cut(pick(SAMPLE.colores));
  if(/sexo|genero/.test(nm))return cut(pick(['H','M']));
  if(/matricula/.test(nm)&&/CHAR/.test(ty))return cut(`${int(1000,9999)} ${'BCDFGHJKLMNPRSTVWXYZ'[int(0,19)]}${'BCDFGHJKLMNPRSTVWXYZ'[int(0,19)]}${'BCDFGHJKLMNPRSTVWXYZ'[int(0,19)]}`);
  if(/edad/.test(nm))return int(18,70);
  if(/nota|calificacion/.test(nm))return /INT/.test(ty)?int(0,10):+(R()*10).toFixed(2);
  if(/precio|importe|total|coste|salario|sueldo|presupuesto|tarifa|pvp/.test(nm))return /INT/.test(ty)?int(5,500):+(5+R()*495).toFixed(2);
  if(/DEC|NUM|FLOAT|DOUBLE|REAL/.test(ty)&&!/NUMBER\(\d+\)$/.test(ty)){const sc=+((ty.match(/,(\d+)/)||[])[1]||2);return +(R()*100).toFixed(sc);}
  if(/INT|NUMBER/.test(ty))return /cant|unidad|stock|plaza|num|capacidad/.test(nm)?int(1,50):int(1,100);
  if(/desc|observ|coment/.test(nm))return cut(`Descripción de ${t.n.toLowerCase()} ${i+1}`);
  return cut(/CHAR\(\d+\)$/.test(ty)&&!/VARCHAR/.test(ty)?String.fromCharCode(65+(i%26)).repeat(Math.max(1,len)):`${c.n} ${i+1}`);
}
function sampleRows(sc,n=5){
  const rows={},warn=[];
  sc.order.forEach(t=>{
    const R=rng(t.n),out=[],seen=new Set(),uqSeen={};
    const fkByCol={};t.fks.forEach(f=>f.cs.forEach((c,j)=>fkByCol[lc(c)]={f,j}));
    const pkIsFk=t.pk.length>0&&t.pk.every(c=>fkByCol[lc(c)]);
    for(let i=0,tries=0;out.length<n&&tries<n*30;tries++,i++){
      const row={},chosen=new Map();
      t.cols.forEach(c=>{const fk=fkByCol[lc(c.n)];
        if(fk){const par=rows[lc(fk.f.par.n)]||(fk.f.par===t?out:null);
          if(!par||!par.length){row[c.n]=c.nn?(fk.f.par===t?(out.length+1):1):null;return;}
          if(!chosen.has(fk.f)){let r=par[Math.floor(R()*par.length)];if(fk.f.par===t&&!c.nn&&out.length===0)r=null;chosen.set(fk.f,r);}
          const r=chosen.get(fk.f);row[c.n]=r?r[fk.f.ref[fk.j]]:null;return;}
        if(c.pk&&t.pk.length===1&&/INT|NUMBER/i.test(c.ty)){row[c.n]=out.length+1;return;}
        let v=sampleValue(t,c,out.length,R);
        if((c.pk||c.uq)&&typeof v==='string'){let k=v,j=2;while((uqSeen[c.n]||new Set()).has(k))k=String(v).slice(0,Math.max(1,String(v).length-2))+j++;v=k;}
        row[c.n]=v;});
      t.cols.filter(c=>c.uq||c.pk).forEach(c=>{(uqSeen[c.n]=uqSeen[c.n]||new Set()).add(JSON.stringify(row[c.n]));});
      const key=JSON.stringify(t.pk.map(c=>row[c]));
      if(t.pk.length&&seen.has(key)){if(pkIsFk)continue;}
      const uqDup=t.cols.some(c=>c.uq&&!c.pk&&out.some(o=>JSON.stringify(o[c.n])===JSON.stringify(row[c.n])&&row[c.n]!=null));
      if(uqDup)continue;
      seen.add(key);out.push(row);}
    if(out.length<n)warn.push(`«${t.n}»: solo caben ${out.length} filas distintas con los datos de las tablas a las que apunta.`);
    rows[lc(t.n)]=out;});
  return {rows,warn};
}
function sqlLit(v,d){
  if(v==null)return 'NULL';
  if(typeof v==='object'&&'bool' in v)return (d==='mysql'||d==='postgres')?(v.bool?'TRUE':'FALSE'):(v.bool?'1':'0');
  if(typeof v==='object'&&'date' in v){const s=`'${v.date}'`;return d==='oracle'?(v.date.length>10?`TIMESTAMP ${s}`:`DATE ${s}`):s;}
  if(typeof v==='number')return String(v);
  return `'${String(v).replace(/'/g,"''")}'`;
}
function insertsSQL(sc,data,d){
  const Q=s=>qidD(s,d);let out='';
  sc.order.forEach(t=>{const rs=data.rows[lc(t.n)]||[];if(!rs.length)return;
    out+=`-- ${t.n}\n`+rs.map(r=>`INSERT INTO ${Q(t.n)} (${t.cols.map(c=>Q(c.n)).join(', ')}) VALUES (${t.cols.map(c=>sqlLit(r[c.n],d)).join(', ')});`).join('\n')+'\n\n';});
  return out;
}
// Mensajes de SQLite explicados
function explainSQLite(msg){
  const m=String(msg||'');let x;
  if(/FOREIGN KEY constraint failed/i.test(m))return 'Clave ajena: ese valor no existe en la tabla a la que apunta (o intentas borrar una fila a la que otras apuntan).';
  if(x=m.match(/NOT NULL constraint failed: ([\w.]+)/i))return `La columna ${x[1]} no puede quedar vacía (NOT NULL).`;
  if(x=m.match(/UNIQUE constraint failed: ([\w., ]+)/i))return `Valor repetido en ${x[1]}: es clave primaria o única y no se puede repetir.`;
  if(x=m.match(/no such table: ([\w.]+)/i))return `No existe la tabla «${x[1]}». Crea la base de datos de prueba o revisa el nombre.`;
  if(x=m.match(/no such column: ([\w.]+)/i))return `No existe la columna «${x[1]}».`;
  if(x=m.match(/near "([^"]*)": syntax error/i))return `Error de sintaxis cerca de «${x[1]}».`;
  if(x=m.match(/table (\S+) already exists/i))return `La tabla ${x[1]} ya existe.`;
  if(/incomplete input/i.test(m))return 'La consulta está incompleta (¿falta un paréntesis o el punto y coma?).';
  return m;
}
