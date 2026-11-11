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
  const drop=typeof Settings==='undefined'||Settings.get().sqlDrop!==false;
  if(d==='mysql')head=`${drop?`DROP DATABASE IF EXISTS ${db};\n`:''}CREATE DATABASE ${db};\nUSE ${db};\n\n`;
  else if(d==='postgres')head=(LANG()==='en'?`-- In PostgreSQL: create the database and connect to it (in psql: \\c ${db}) before creating the tables.\n`:`-- En PostgreSQL: crea la base de datos y conéctate a ella (en psql: \\c ${db}) antes de crear las tablas.\n`)+`${drop?`DROP DATABASE IF EXISTS ${db};\n`:''}CREATE DATABASE ${db};\n\\c ${db}\n\n`;
  else if(d==='sqlserver')head=`${drop?`IF DB_ID('${db}') IS NOT NULL DROP DATABASE ${db};\nGO\n`:''}CREATE DATABASE ${db};\nGO\nUSE ${db};\nGO\n\n`;
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
// Explica en palabras sencillas un error de SQLite (y da una pista para arreglarlo)
function explainSQLite(msg){
  const m=String(msg||''),en=LANG()==='en',T=(es,e)=>en?e:es;let x;
  const near=(m.match(/near "([^"]*)": syntax error/i)||[])[1];
  if(/FOREIGN KEY constraint failed/i.test(m))return T('Clave ajena: ese valor no existe en la tabla a la que apunta, o intentas borrar (o cambiar) una fila a la que otras filas apuntan.\nPista: inserta antes la fila de la tabla «padre», o borra primero las filas que apuntan a ella.','Foreign key: that value does not exist in the referenced table, or you are deleting (or changing) a row that other rows point to.\nTip: insert the «parent» row first, or delete the rows that point to it first.');
  if(x=m.match(/NOT NULL constraint failed: ([\w.]+)/i))return T(`La columna ${x[1]} no puede quedar vacía (es NOT NULL).\nPista: dale un valor en el INSERT, o quítale el NOT NULL si de verdad puede faltar.`,`Column ${x[1]} cannot be empty (it is NOT NULL).\nTip: give it a value in the INSERT, or remove NOT NULL if it really can be missing.`);
  if(x=m.match(/UNIQUE constraint failed: ([\w., ]+)/i))return T(`Valor repetido en ${x[1]}: es clave primaria o UNIQUE y no se puede repetir.\nPista: cambia el valor, o comprueba con SELECT qué fila lo tiene ya.`,`Repeated value in ${x[1]}: it is a primary key or UNIQUE and cannot be repeated.\nTip: change the value, or check with SELECT which row already has it.`);
  if(x=m.match(/CHECK constraint failed: (.+)/i))return T(`El valor no cumple la condición CHECK (${x[1]}).`,`The value does not meet the CHECK condition (${x[1]}).`);
  if(x=m.match(/no such table: ([\w.]+)/i))return T(`No existe la tabla «${x[1]}».\nPista: revisa el nombre (mayúsculas, tildes, plural) o crea la base de prueba otra vez.`,`Table «${x[1]}» does not exist.\nTip: check the name, or create the test database again.`);
  if(x=m.match(/no such column: ([\w."]+)/i))return T(`No existe la columna «${x[1]}».\nPista: revisa el nombre y de qué tabla es. Si querías escribir un texto, ponlo entre comillas simples: 'así'.`,`Column «${x[1]}» does not exist.\nTip: check the name and its table. If you meant a text, use single quotes: 'like this'.`);
  if(x=m.match(/ambiguous column name: ([\w.]+)/i))return T(`La columna «${x[1]}» está en varias tablas de la consulta y no sé cuál quieres.\nPista: pon delante el nombre de la tabla: Tabla.${x[1]}`,`Column «${x[1]}» is in several tables of the query.\nTip: put the table name before it: Table.${x[1]}`);
  if(x=m.match(/table (\S+) has (\d+) columns but (\d+) values were supplied/i))return T(`La tabla ${x[1]} tiene ${x[2]} columnas pero has dado ${x[3]} valores.\nPista: escribe la lista de columnas: INSERT INTO ${x[1]} (col1, col2…) VALUES (…)`,`Table ${x[1]} has ${x[2]} columns but you gave ${x[3]} values.\nTip: list the columns: INSERT INTO ${x[1]} (col1, col2…) VALUES (…)`);
  if(x=m.match(/(\d+) values for (\d+) columns/i))return T(`Has puesto ${x[1]} valores para ${x[2]} columnas: tiene que haber el mismo número.`,`You gave ${x[1]} values for ${x[2]} columns: they must match.`);
  if(x=m.match(/table (\S+) already exists/i))return T(`La tabla ${x[1]} ya existe.\nPista: usa DROP TABLE ${x[1]}; antes, o CREATE TABLE IF NOT EXISTS.`,`Table ${x[1]} already exists.\nTip: DROP TABLE ${x[1]}; first, or CREATE TABLE IF NOT EXISTS.`);
  if(x=m.match(/duplicate column name: (\S+)/i))return T(`La columna «${x[1]}» aparece dos veces en la tabla.`,`Column «${x[1]}» appears twice in the table.`);
  if(x=m.match(/no such function: (\w+)/i)){const f=x[1].toUpperCase(),tip={NOW:"datetime('now')",CURDATE:"date('now')",CURRENT_DATE:"date('now')",SYSDATE:"datetime('now')",GETDATE:"datetime('now')",YEAR:"strftime('%Y', fecha)",MONTH:"strftime('%m', fecha)",DAY:"strftime('%d', fecha)",DATEDIFF:"julianday(f1) - julianday(f2)",CONCAT:"a || b",LEN:'length(…)',ISNULL:'ifnull(…)',NVL:'ifnull(…)',TO_DATE:"date('2024-01-31')"}[f];
    return T(`SQLite no tiene la función ${f}()${tip?`. Aquí se escribe: ${tip}`:''}.\nTu gestor (MySQL, Oracle…) sí puede tenerla: esto solo afecta a la base de prueba.`,`SQLite has no ${f}() function${tip?`. Here use: ${tip}`:''}.\nYour DBMS (MySQL, Oracle…) may have it: this only affects the test database.`);}
  if(x=m.match(/wrong number of arguments to function (\w+)/i))return T(`La función ${x[1]}() lleva otro número de datos entre los paréntesis.`,`Function ${x[1]}() takes a different number of arguments.`);
  if(x=m.match(/misuse of (?:aggregate|window) function (\w+)/i)||(x=m.match(/misuse of aggregate: (\w+)/i)))return T(`No puedes usar ${x[1]}() en el WHERE.\nPista: para filtrar por un total usa GROUP BY … HAVING ${x[1]}(…) > …`,`You cannot use ${x[1]}() in WHERE.\nTip: to filter by a total use GROUP BY … HAVING ${x[1]}(…) > …`);
  if(/a GROUP BY clause is required before HAVING/i.test(m))return T('Has puesto HAVING sin GROUP BY.\nPista: HAVING va después de GROUP BY; para filtrar filas sueltas usa WHERE.','HAVING without GROUP BY.\nTip: HAVING goes after GROUP BY; to filter rows use WHERE.');
  if(x=m.match(/sub-select returns (\d+) columns - expected 1/i))return T(`La subconsulta devuelve ${x[1]} columnas y aquí solo cabe una.\nPista: en la subconsulta pon solo la columna que necesitas: (SELECT id FROM …)`,`The subquery returns ${x[1]} columns but only one fits here.`);
  if(/SELECTs to the left and right of (UNION|INTERSECT|EXCEPT)/i.test(m))return T('Los SELECT de un UNION tienen que devolver el mismo número de columnas.','Both SELECTs in a UNION must return the same number of columns.');
  if(/ORDER BY term out of range/i.test(m))return T('En el ORDER BY has puesto un número de columna que no existe en el SELECT.','ORDER BY uses a column number that is not in the SELECT.');
  if(/row value misused/i.test(m))return T('Hay paréntesis con varios valores donde solo va uno.\nPista: revisa los paréntesis del WHERE o del SET.','A list of values in parentheses is used where only one fits.');
  if(/datatype mismatch/i.test(m))return T('El tipo de dato no encaja.\nPista: en SQLite pasa sobre todo al poner un texto en una columna INTEGER PRIMARY KEY.','Data type mismatch (usually text in an INTEGER PRIMARY KEY).');
  if(/foreign key mismatch/i.test(m))return T('Una clave ajena apunta a columnas que no son PRIMARY KEY ni UNIQUE en la tabla a la que apunta.\nPista: la FK debe apuntar a la clave primaria de la otra tabla.','A foreign key points to columns that are not PRIMARY KEY or UNIQUE.');
  if(/Cannot add a NOT NULL column with default value NULL/i.test(m))return T('Para añadir con ALTER TABLE una columna NOT NULL, ponle un DEFAULT.','To ADD a NOT NULL column with ALTER TABLE, give it a DEFAULT.');
  if(/cannot (start|commit|rollback) a transaction/i.test(m))return T('Problema con BEGIN / COMMIT / ROLLBACK: hay una transacción abierta de más (o ninguna).','Problem with BEGIN / COMMIT / ROLLBACK.');
  if(x=m.match(/unrecognized token: "?(.{0,20})/i))return T(`Hay algo que no entiendo cerca de «${x[1]}».\nPista: ¿falta cerrar una comilla '…'? Los textos van entre comillas simples.`,`Unrecognized text near «${x[1]}».\nTip: is a quote missing? Texts go in single quotes.`);
  if(/incomplete input/i.test(m))return T('La consulta está incompleta.\nPista: ¿falta cerrar un paréntesis o una comilla, o terminar la sentencia?','The query is incomplete.\nTip: is a parenthesis or a quote missing?');
  if(near!=null){const N=near.toUpperCase(),tips={
      AUTO_INCREMENT:T('En SQLite no existe AUTO_INCREMENT (es de MySQL). En la base de prueba no hace falta: quítalo, o usa INTEGER PRIMARY KEY.','SQLite has no AUTO_INCREMENT (it is MySQL). Remove it, or use INTEGER PRIMARY KEY.'),
      ENGINE:T('ENGINE=InnoDB es solo de MySQL. Quítalo para probar aquí.','ENGINE=InnoDB is MySQL only. Remove it to test here.'),
      DATABASE:T('SQLite no tiene CREATE DATABASE ni USE: la base de prueba ya está creada. Quita esas líneas.','SQLite has no CREATE DATABASE / USE: the test database already exists. Remove those lines.'),
      USE:T('SQLite no tiene USE: la base de prueba ya está creada. Quita esa línea.','SQLite has no USE. Remove that line.'),
      SHOW:T("SQLite no tiene SHOW TABLES. Usa: SELECT name FROM sqlite_master WHERE type='table';","SQLite has no SHOW TABLES. Use: SELECT name FROM sqlite_master WHERE type='table';"),
      DESCRIBE:T('SQLite no tiene DESCRIBE. Usa: PRAGMA table_info(Tabla);','SQLite has no DESCRIBE. Use: PRAGMA table_info(Table);'),
      DESC:T('Si querías ver la tabla, en SQLite es: PRAGMA table_info(Tabla);','To see a table in SQLite: PRAGMA table_info(Table);'),
      TOP:T('TOP es de SQL Server. Aquí se escribe al final: … LIMIT 10','TOP is SQL Server. Here write at the end: … LIMIT 10'),
      GO:T('GO es de SQL Server. Quítalo para probar aquí.','GO is SQL Server. Remove it here.'),
      MODIFY:T('SQLite no tiene ALTER TABLE … MODIFY. En la base de prueba, cambia la tabla en el DED y créala otra vez.','SQLite has no ALTER TABLE … MODIFY.'),
      ')':T('¿Sobra una coma antes del paréntesis de cierre, o falta un valor?','Is there an extra comma before the closing parenthesis?'),
      ',':T('¿Sobra una coma, o falta algo entre dos comas?','Extra comma, or something missing between two commas?'),
      FROM:T('¿Sobra una coma justo antes de FROM, o falta poner columnas en el SELECT?','Extra comma right before FROM, or no columns in SELECT?'),
      WHERE:T('¿Falta el FROM, o sobra una coma antes del WHERE?','Missing FROM, or an extra comma before WHERE?'),
      VALUES:T('¿Falta la lista de columnas entre paréntesis, o un paréntesis antes de VALUES?','Missing column list or a parenthesis before VALUES?'),
      ON:T('ON va después de JOIN Tabla: … JOIN Tabla2 ON Tabla1.col = Tabla2.col','ON goes after JOIN Table: … JOIN T2 ON T1.col = T2.col'),
      '':T('Falta algo al final de la sentencia.','Something is missing at the end.')}[N];
    const kw=/^(SELECT|FROM|WHERE|ORDER|GROUP|TABLE|ORDER|BY|INTO|SET|KEY|INDEX|CHECK|DEFAULT|PRIMARY|REFERENCES|LIMIT|DATE|TIME|USER|GROUPS|VALUES|INSERT|UPDATE|DELETE)$/i.test(near);
    return T(`Error de sintaxis cerca de «${near}».`,`Syntax error near «${near}».`)+(tips?'\n'+T('Pista: ','Tip: ')+tips:kw?T(`\nPista: «${near}» es una palabra reservada; si es el nombre de una tabla o columna, cámbialo o ponlo entre comillas dobles.`,`\nTip: «${near}» is a reserved word; if it is a table or column name, rename it or quote it.`):T('\nPista: revisa comas, paréntesis y comillas justo antes de esa palabra.','\nTip: check commas, parentheses and quotes right before that word.'));}
  return m;
}
