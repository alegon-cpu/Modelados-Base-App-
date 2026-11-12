/* ===================== Teoría ===================== */
// Cada tema: id, título, palabras para el buscador y contenido.
const TH=(ic,t)=>`<span class="th-sym">${ic}<span>${t}</span></span>`;
const TEORIA=[
{id:'intro',t:'Cómo se hace un ejercicio',k:'pasos enunciado proceso',h:`
<p>Un ejercicio de bases de datos se resuelve en cuatro pasos. Cada uno sale del anterior:</p>
<ol class="th-steps">
<li><b>Modelo Entidad-Relación (E-R).</b> Lees el enunciado y dibujas <i>qué cosas</i> hay (entidades), <i>qué datos</i> tienen (atributos) y <i>cómo se relacionan</i> (relaciones con su cardinalidad).</li>
<li><b>Modelo relacional.</b> Pasas el E-R a tablas: cada tabla con su clave primaria (PK) y sus claves ajenas (FK).</li>
<li><b>DED</b> (diagrama de estructura de datos). Las mismas tablas, dibujadas con sus tipos de dato y las líneas que las unen.</li>
<li><b>SQL.</b> El código <code>CREATE TABLE</code> que crea esas tablas de verdad en la base de datos.</li></ol>
<div class="th-tip"><b>En la app:</b> haz el E-R, pulsa «Pasar desde mi E-R» en el Relacional y el DED (con el modo fácil se pasan también las relaciones) y en la pestaña SQL pulsa «Generar desde el DED».</div>
<h4>Leer el enunciado</h4>
<ul><li><b>Sustantivos</b> importantes (alumno, curso, pedido) → posibles <b>entidades</b>.</li>
<li><b>Datos</b> de cada cosa (nombre, fecha, precio) → <b>atributos</b>.</li>
<li><b>Verbos</b> que unen dos cosas (un alumno <i>se matricula en</i> cursos) → <b>relaciones</b>.</li>
<li>Palabras como <i>cada, puede, al menos, varios, solo uno</i> → <b>cardinalidades</b>.</li>
<li>Lo que «identifica» o «no se puede repetir» (DNI, código, matrícula) → <b>clave primaria</b>.</li></ul>`},

{id:'boceto',t:'Boceto: pensar antes del E-R',k:'boceto esquema borrador entidades lineas relacionar empezar',h:`
<p>La pestaña <b>Boceto</b> (entre Enunciado y E-R) sirve para pensar el ejercicio antes de dibujar el E-R completo. En el dibujo solo hay <b>entidades</b> y <b>líneas</b> entre ellas con marcas de cero, uno o muchos; los atributos se escriben en la zona de texto de arriba (solo los nombres). Ni rombos ni nombres de relación.</p>
<ol><li>Lee el enunciado y pon una entidad por cada sustantivo importante (Alumno, Curso, Profesor…).</li><li>Une con una línea las que se relacionan (Mayús + clic, o «Unir»).</li><li>En la zona de arriba escribe cada entidad con sus atributos: <code>Alumno; DNI, Nombre, FechaNac</code>. Solo los nombres: la clave y el tipo los decides en el E-R.</li><li>Pulsa una línea y elige, junto a cada entidad, cuántas puede haber: <b>○</b> cero, <b>|</b> uno, <b>pata</b> muchos (es opcional).</li><li>Pulsa <b>Pasar al E-R</b>: se crean las entidades que falten con sus atributos y un rombo por cada línea con sus cardinalidades. Allí marcas las claves y le pones el verbo a cada relación.</li></ol>
<p class="th-tip">Si una entidad no tiene ninguna línea, quizá sobra, o es un atributo de otra.</p>`},
{id:'entidades',t:'Entidades',k:'entidad fuerte debil rectangulo doble',h:`
<p>Una <b>entidad</b> es algo de lo que queremos guardar información y que se puede distinguir de los demás: un alumno, un libro, un pedido.</p>
<div class="th-grid"><div class="th-card">${TH(GL.ent,'Entidad (fuerte)')}<p>Rectángulo. Tiene su propia clave primaria: se identifica sola. Ejemplo: <i>Alumno</i> se identifica por su DNI.</p></div>
<div class="th-card">${TH(GL.weak,'Entidad débil')}<p>Doble rectángulo. <b>No se puede identificar sola</b>: necesita a otra entidad (la fuerte). Va unida a ella con una <b>relación identificadora</b> (doble rombo) y tiene una <b>clave parcial</b> (subrayado discontinuo).</p></div></div>
<div class="th-ex"><b>Ejemplo de débil:</b> la <i>Habitación 12</i> existe en muchos hoteles. Solo sabes cuál es si dices de qué hotel es. Habitación es débil de Hotel, y su clave completa es (CodHotel, NumHabitación).</div>
<div class="th-tip">Pregúntate: «¿puedo saber cuál es sin decir de quién es?». Si la respuesta es no, es débil.</div>`},

{id:'atributos',t:'Atributos',k:'atributo clave primaria parcial opcional derivado multivaluado compuesto elipse',h:`
<p>Los <b>atributos</b> son los datos de una entidad o de una relación. Se dibujan como elipses unidas a su dueño.</p>
<table class="th-tab"><tr><th>Tipo</th><th>Cómo se dibuja</th><th>Para qué</th></tr>
<tr><td>${TH(GL.attr,'Normal')}</td><td>Elipse</td><td>Un dato con un solo valor: nombre, precio.</td></tr>
<tr><td>${TH(GL.key,'Clave primaria')}</td><td>Nombre subrayado</td><td>Identifica a cada ejemplar. No se repite y nunca está vacía.</td></tr>
<tr><td>${TH(GL.partial,'Clave parcial')}</td><td>Subrayado discontinuo</td><td>En una entidad débil: la identifica junto con la clave de la fuerte.</td></tr>
<tr><td>${TH(GL.opt,'Opcional')}</td><td>(O) detrás del nombre</td><td>Puede quedar vacío (NULL): el teléfono fijo, el segundo apellido.</td></tr>
<tr><td>${TH(GL.deriv,'Derivado')}</td><td>Elipse discontinua</td><td>Se calcula a partir de otros: la edad (con la fecha de nacimiento). No se guarda en tablas.</td></tr>
<tr><td>${TH(GL.multi,'Multivaluado')}</td><td>Doble elipse</td><td>Puede tener varios valores: varios teléfonos, varios correos.</td></tr>
<tr><td>${TH(GL.comp,'Compuesto')}</td><td>Elipse con otras elipses colgando</td><td>Formado por partes: Dirección = calle + número + ciudad.</td></tr></table>
<div class="th-tip">La clave primaria debe ser algo que <b>nunca cambie y nunca se repita</b>. Si no hay nada así en el enunciado, inventa un código (CodCliente).</div>`},

{id:'relaciones',t:'Relaciones',k:'relacion rombo binaria reflexiva ternaria identificadora grado atributos de relacion',h:`
<p>Una <b>relación</b> une entidades y se dibuja como un rombo con un verbo: <i>Alumno — se matricula — Curso</i>.</p>
<div class="th-grid"><div class="th-card">${TH(GL.rel,'Binaria')}<p>Une dos entidades. Es la más habitual.</p></div>
<div class="th-card">${TH(GL.rel,'Reflexiva')}<p>Une una entidad consigo misma: un <i>Empleado</i> dirige a otros <i>Empleados</i>.</p></div>
<div class="th-card">${TH(GL.rel,'Ternaria')}<p>Une tres entidades a la vez, cuando el dato solo tiene sentido con las tres: <i>Médico</i> receta <i>Medicamento</i> a <i>Paciente</i>.</p></div>
<div class="th-card">${TH(GL.idrel,'Identificadora')}<p>Doble rombo. Une una entidad débil con la fuerte que la identifica.</p></div></div>
<h4>Atributos en una relación</h4>
<p>Si un dato no es de ninguna de las dos entidades, sino de que estén relacionadas, va en la relación. Ejemplo: la <i>nota</i> no es del alumno ni del curso: es de <i>la matrícula</i> de ese alumno en ese curso.</p>`},

{id:'cardinalidad',t:'Cardinalidad (máximo y mínimo)',k:'cardinalidad minimo maximo participacion 1:1 1:n n:m obligatoria opcional',h:`
<p>En cada línea entre relación y entidad se pone una pareja <b>(mínimo, máximo)</b>. En esta app (como en ERD Plus) la pareja que está <b>junto a una entidad</b> dice <b>cuántos ejemplares de esa entidad</b> puede tener cada ejemplar de la otra.</p>
<div class="th-ex"><b>Ejemplo:</b> Pizzería ¿cuántos Animatrónicos puede tener como máximo? <b>Muchos (N)</b>. ¿Y como mínimo? <b>Ninguno (0)</b>. Junto a Animatrónico va <b>(0,N)</b>.<br>
Animatrónico ¿cuántas Pizzerías puede tener? Como máximo <b>1</b> y como mínimo <b>1</b>. Junto a Pizzería va <b>(1,1)</b>.</div>
<table class="th-tab"><tr><th>Valor</th><th>Significa</th></tr>
<tr><td><b>Mínimo 0</b></td><td>Participación opcional: puede no tener ninguno.</td></tr>
<tr><td><b>Mínimo 1</b></td><td>Participación obligatoria: siempre tiene al menos uno.</td></tr>
<tr><td><b>Máximo 1</b></td><td>Como mucho uno.</td></tr>
<tr><td><b>Máximo N</b></td><td>Puede tener muchos.</td></tr></table>
<h4>Tipo de relación</h4>
<p>Sale de mirar los <b>dos máximos</b>:</p>
<ul><li><b>1:1</b> → los dos máximos son 1 (una persona tiene un pasaporte).</li>
<li><b>1:N</b> → un máximo es 1 y el otro N (una pizzería tiene muchos animatrónicos).</li>
<li><b>N:M</b> → los dos máximos son N (un alumno, muchos cursos; un curso, muchos alumnos).</li></ul>
<div class="th-tip">Haz siempre las dos preguntas, una desde cada entidad. La app te las muestra al pulsar la relación o una de sus líneas.</div>`},

{id:'jerarquias',t:'Jerarquías (generalización / ISA)',k:'isa jerarquia generalizacion especializacion supertipo subtipo total parcial exclusiva solapada disjunta herencia es un',h:`
<p>Una <b>jerarquía</b> (ISA, «es un») se usa cuando varias entidades comparten datos y una es un caso particular de otra: un <i>Titular</i> <b>es un</b> <i>Profesor</i>, un <i>Interino</i> <b>es un</b> <i>Profesor</i>.</p>
<p>Se dibuja con un <b>triángulo</b>: arriba la entidad general (<b>supertipo</b>) y debajo las particulares (<b>subtipos</b>). Los subtipos <b>heredan</b> la clave y los atributos del supertipo, y solo llevan lo suyo.</p>
<h4>Cómo se marca</h4><table class="th-t"><tr><th></th><th>Significa</th></tr>
<tr><td><b>Total</b> (t)</td><td>Todo profesor es de algún subtipo.</td></tr><tr><td><b>Parcial</b> (p)</td><td>Puede haber profesores que no sean de ningún subtipo.</td></tr>
<tr><td><b>Exclusiva</b> (e)</td><td>Cada uno es como mucho de un subtipo.</td></tr><tr><td><b>Solapada</b> (s)</td><td>Uno puede ser de varios subtipos a la vez.</td></tr></table>
<p>Se escribe junto al triángulo: <b>(t,e)</b> total exclusiva, <b>(p,s)</b> parcial solapada… En UML se escribe <i>{completa, disjunta}</i>.</p>
<h4>Al pasar a tablas</h4><ul><li><b>Una tabla por entidad</b> (vale siempre): cada subtipo tiene como PK la del supertipo, que también es FK hacia él.</li>
<li><b>Todo en el supertipo</b>: una sola tabla con las columnas de todos (las de los subtipos pueden quedar vacías) y una columna <i>tipo</i>. Cómodo si los subtipos tienen pocos atributos.</li>
<li><b>Solo los subtipos</b>: cada subtipo copia las columnas del supertipo. Solo si la jerarquía es <b>total</b> (si no, se perderían los que no son de ningún subtipo).</li></ul>
<p class="th-tip">En la app: selecciona el supertipo y pulsa «Jerarquía»; después «Añadir subtipo». En su panel eliges total/parcial, exclusiva/solapada y cómo pasarla a tablas.</p>`},

{id:'ternarias',t:'Relaciones ternarias',k:'ternaria tres entidades cardinalidad grado n-aria',h:`
<p>Una relación <b>ternaria</b> une tres entidades a la vez. Úsala solo cuando el dato necesita las tres juntas: <i>un profesor imparte una asignatura a un grupo</i>. Si se puede partir en dos binarias sin perder información, mejor binarias.</p>
<h4>Cardinalidad en una ternaria</h4><p>Para cada entidad se pregunta: <b>fijando una pareja de las otras dos</b>, ¿cuántas de esta puede haber? Ejemplo: para un profesor y una asignatura, ¿en cuántos grupos? → (1,N).</p>
<h4>Al pasar a tablas</h4><p>Siempre sale una <b>tabla nueva</b> con las PK de las tres entidades como FK. La PK de esa tabla la forman las FK de los lados con máximo N (si todos son 1, basta con dos).</p>
<p class="th-tip">En la app: selecciona las tres entidades (arrastrando en un hueco o con Ctrl+clic) y pulsa «Relación ternaria entre las 3». También puedes unir una tercera entidad a una relación con Mayús + clic.</p>`},

{id:'asociativa',t:'Entidad asociativa',k:'asociativa agregacion relacion como entidad rectangulo rombo matricula',h:`
<p>Una <b>entidad asociativa</b> es una relación que se trata también como entidad: se dibuja el <b>rombo dentro de un rectángulo</b>. Se usa cuando la propia relación tiene que relacionarse con otra entidad.</p>
<p>Ejemplo: un alumno se <i>matricula</i> en una asignatura (N:M). Si además cada matrícula la <i>corrige</i> un profesor, «Matricula» pasa a ser una entidad asociativa unida a Profesor con otra relación.</p>
<h4>Cardinalidad</h4><p>Se pone igual que siempre: en la relación «corrige», junto a Profesor (1,1) porque cada matrícula la corrige un profesor, y junto a Matricula (0,N) porque un profesor corrige muchas.</p>
<h4>Al pasar a tablas</h4><p>Sale una tabla con su nombre (Matricula) cuya <b>PK son las claves de sus entidades</b> (DNI y Codigo) y sus atributos (Nota). Las relaciones con otras entidades se pasan como siempre, tratándola como una entidad más: aquí Matricula recibe el DNI del profesor como FK.</p>
<p class="th-tip">En la app: selecciona la relación y activa «Entidad asociativa» (también en el menú del botón derecho). Luego únela con Mayús + clic a otra entidad: se crea la relación en medio.</p>`},

{id:'paso',t:'Pasar del E-R a tablas',k:'paso relacional reglas transformacion fk tabla intermedia n:m 1:n 1:1 debil multivaluado',h:`
<p>Estas son las reglas para convertir el E-R en el modelo relacional. Son las mismas que usa el botón «Pasar desde mi E-R» con el modo fácil.</p>
<table class="th-tab"><tr><th>En el E-R</th><th>En las tablas</th></tr>
<tr><td>Entidad</td><td>Una tabla con sus atributos. La clave primaria se subraya.</td></tr>
<tr><td>Atributo compuesto</td><td>Se guardan sus partes como columnas (calle, número, ciudad).</td></tr>
<tr><td>Atributo derivado</td><td>No se guarda (se calcula).</td></tr>
<tr><td>Atributo multivaluado</td><td>Tabla aparte: la PK de la entidad + el atributo. Las dos forman la PK.</td></tr>
<tr><td>Relación <b>1:N</b></td><td>La PK del lado «1» pasa como <b>FK</b> a la tabla del lado «N». Si el mínimo junto al lado 1 es 0, la FK puede ser NULL.</td></tr>
<tr><td>Relación <b>1:1</b></td><td>La FK va a una de las dos tablas (mejor a la que participa de forma obligatoria) y se marca <b>UNIQUE</b>.</td></tr>
<tr><td>Relación <b>N:M</b></td><td>Tabla nueva con las PK de las dos entidades como FK; juntas forman su PK. Los atributos de la relación van aquí.</td></tr>
<tr><td>Entidad <b>débil</b></td><td>Su tabla lleva la PK de la fuerte como FK, y su PK es esa FK + la clave parcial.</td></tr>
<tr><td>Relación <b>reflexiva</b></td><td>Igual que su tipo (1:N o N:M), pero la FK se renombra (CodJefe → Empleado).</td></tr>
<tr><td>Relación <b>ternaria</b></td><td>Tabla nueva con las PK de las tres entidades.</td></tr></table>`},

{id:'relacional',t:'Modelo relacional',k:'relacional tabla pk fk clave ajena flecha notacion',h:`
<p>El modelo relacional se escribe como una lista de tablas con sus columnas:</p>
<div class="th-code">Alumno(<u>DNI</u>, Nombre, Apellidos, FechaNac)<br>Curso(<u>CodCurso</u>, Nombre, Horas)<br>Matricula(<u>DNI</u>, <u>CodCurso</u>, Nota)</div>
<ul><li><b>Clave primaria (PK):</b> subrayada. Identifica cada fila: no se repite y no puede ser NULL.</li>
<li><b>Clave ajena (FK):</b> una columna que apunta a la PK de otra tabla. En la app se dibuja con una flecha hacia la tabla a la que apunta (como en ERD Plus).</li>
<li><b>NN</b> (NOT NULL): la columna no puede quedar vacía. <b>Único</b> (UNIQUE): no se repite, pero no es la clave.</li></ul>
<div class="th-tip">Una columna puede ser a la vez PK y FK: pasa en las tablas de las relaciones N:M y en las entidades débiles.</div>`},

{id:'ded',t:'DED (diagrama de estructura de datos)',k:'ded lineas continua discontinua pata de gallo tipos identificadora',h:`
<p>El DED dibuja las tablas con sus columnas y <b>tipos de dato</b>, y une cada FK con la tabla a la que apunta.</p>
<ul><li>${GL.pkcol} Clave primaria &nbsp; ${GL.fkcol} Clave ajena &nbsp; ${GL.nncol} No puede ser nula &nbsp; ${GL.uqcol} Única</li></ul>
<h4>Las líneas: continua o discontinua</h4>
<p>Solo depende de una pregunta: <b>en la tabla que tiene la FK, ¿esa FK forma parte de la PK?</b> (es decir, ¿está subrayada?)</p>
<table class="th-tab"><tr><th>Línea</th><th>Cuándo</th><th>Ejemplos</th></tr>
<tr><td><b>Continua</b> ───</td><td>Sí: la FK es también PK (o parte de ella). Relación <b>identificadora</b>: la fila hija no se puede identificar sin la padre.</td><td>Tabla de una N:M (Matricula: DNI + Codigo) · entidad débil (Linea: NumPedido + NumLinea) · subtipo de una jerarquía (Titular.DNI) · entidad asociativa</td></tr>
<tr><td><b>Discontinua</b> - - -</td><td>No: la FK es una columna normal fuera de la PK. Relación <b>no identificadora</b>.</td><td>1:N normal (Pedido.DNI del cliente) · 1:1 con FK UNIQUE · relación reflexiva (Empleado.DNI_jefe)</td></tr></table>
<h4>Cómo saberlo desde el E-R</h4>
<ul><li><b>N:M</b>, <b>ternaria</b> o <b>asociativa</b> → tabla nueva cuya PK son las FK → <b>continua</b>.</li>
<li><b>Entidad débil</b> con relación identificadora (doble rombo) → la FK entra en su PK → <b>continua</b>.</li>
<li><b>Jerarquía</b> (una tabla por entidad) → el subtipo usa la PK del supertipo como PK y FK → <b>continua</b>.</li>
<li><b>1:N</b> y <b>1:1</b> entre entidades fuertes → la FK va como columna normal → <b>discontinua</b>.</li></ul>
<p class="th-tip">Truco: si en una tabla todas sus FK están subrayadas, todas sus líneas son continuas. En la app, toca la línea y activa o quita «Identificadora».</p>
<h4>Los extremos (pata de gallo)</h4>
<ul><li><b>||</b> uno y solo uno · <b>o|</b> cero o uno · <b>|&lt;</b> uno o muchos · <b>o&lt;</b> cero o muchos.</li>
<li>En el lado de la tabla padre, el círculo aparece si la FK puede ser NULL (participación opcional).</li>
<li>En el lado de la hija sale la pata de gallo (muchos), salvo que la FK sea UNIQUE (1:1).</li></ul>`},

{id:'normalizacion',t:'Normalización (1FN, 2FN, 3FN)',k:'normalizacion forma normal 1fn 2fn 3fn dependencia redundancia',h:`
<p>Normalizar es revisar las tablas para que no repitan información y no den problemas al insertar, modificar o borrar.</p>
<div class="th-card"><h4>1FN · Primera forma normal</h4><p>Cada celda tiene <b>un solo valor</b> (nada de listas como «612…, 699…») y no hay grupos de columnas repetidas (Tel1, Tel2, Tel3). Solución: llevar esos valores a otra tabla.</p></div>
<div class="th-card"><h4>2FN · Segunda forma normal</h4><p>Está en 1FN y, si la PK tiene varias columnas, <b>cada columna depende de toda la clave</b>, no de una parte. En Matricula(<u>DNI</u>, <u>CodCurso</u>, NombreCurso, Nota), NombreCurso depende solo de CodCurso: debe ir en la tabla Curso.</p></div>
<div class="th-card"><h4>3FN · Tercera forma normal</h4><p>Está en 2FN y <b>ninguna columna depende de otra que no sea clave</b>. En Empleado(<u>DNI</u>, CodDepto, NombreDepto), NombreDepto depende de CodDepto: debe ir en la tabla Departamento.</p></div>
<div class="th-tip">Si haces bien el E-R y aplicas las reglas de paso, las tablas suelen salir ya en 3FN.</div>`},

{id:'sql',t:'SQL para crear las tablas',k:'sql create table database primary key foreign key not null unique alter tipos varchar int date decimal',h:`
<div class="th-code">CREATE DATABASE instituto;<br>USE instituto;<br><br>
CREATE TABLE Alumno (<br>&nbsp;&nbsp;DNI CHAR(9) NOT NULL,<br>&nbsp;&nbsp;Nombre VARCHAR(45) NOT NULL,<br>&nbsp;&nbsp;Telefono VARCHAR(15) NULL,<br>&nbsp;&nbsp;PRIMARY KEY (DNI)<br>);<br><br>
CREATE TABLE Matricula (<br>&nbsp;&nbsp;DNI CHAR(9) NOT NULL,<br>&nbsp;&nbsp;CodCurso INT NOT NULL,<br>&nbsp;&nbsp;Nota DECIMAL(4,2) NULL,<br>&nbsp;&nbsp;PRIMARY KEY (DNI, CodCurso),<br>&nbsp;&nbsp;FOREIGN KEY (DNI) REFERENCES Alumno (DNI),<br>&nbsp;&nbsp;FOREIGN KEY (CodCurso) REFERENCES Curso (CodCurso)<br>);</div>
<h4>Tipos de dato más usados</h4>
<table class="th-tab"><tr><td><code>INT</code></td><td>Números enteros (códigos, cantidades).</td></tr>
<tr><td><code>DECIMAL(8,2)</code></td><td>Números con decimales exactos (precios, notas): 8 cifras, 2 decimales.</td></tr>
<tr><td><code>VARCHAR(n)</code></td><td>Texto de hasta n letras.</td></tr><tr><td><code>CHAR(n)</code></td><td>Texto de longitud fija (DNI: CHAR(9)).</td></tr>
<tr><td><code>DATE</code> / <code>TIME</code> / <code>DATETIME</code></td><td>Fecha, hora, o las dos.</td></tr><tr><td><code>BOOLEAN</code></td><td>Sí o no.</td></tr></table>
<h4>Diferencias entre gestores</h4><ul><li><b>MySQL</b>: <code>VARCHAR</code>, <code>BOOLEAN</code>, <code>USE base;</code>.</li><li><b>SQL Server</b>: <code>BIT</code> para sí/no, <code>GO</code> entre bloques.</li><li><b>Oracle</b>: <code>VARCHAR2</code>, <code>NUMBER</code>, sin <code>CREATE DATABASE</code> (las tablas van en tu usuario).</li><li><b>PostgreSQL</b>: <code>TIMESTAMP</code> en vez de <code>DATETIME</code>, <code>\\c base</code> para conectarte.</li></ul>
<p>En la pestaña SQL eliges el gestor y la app te adapta los tipos.</p>
<h4>Restricciones</h4>
<ul><li><code>NOT NULL</code>: obligatoria. <code>NULL</code>: puede quedar vacía.</li><li><code>PRIMARY KEY</code>, <code>UNIQUE</code>, <code>FOREIGN KEY … REFERENCES</code>.</li>
<li>Una tabla con FK se crea <b>después</b> de la tabla a la que apunta. Si dos tablas se apuntan entre sí, la FK se añade al final con <code>ALTER TABLE … ADD FOREIGN KEY</code>.</li></ul>
<div class="th-tip">En la pestaña SQL puedes hacer lo contrario: pegar un script con <code>CREATE TABLE</code> y pulsar «Dibujar desde este SQL» para ver su DED y su relacional.</div>`},

{id:'errores',t:'Errores típicos',k:'errores fallos comunes consejos revisar',h:`
<ul class="th-list"><li><b>Poner la FK en el lado equivocado</b> de una 1:N: siempre va en el lado de los «muchos».</li>
<li><b>Olvidar la tabla intermedia</b> de una N:M: dos tablas no se pueden unir N:M directamente.</li>
<li><b>Atributos en el sitio equivocado:</b> la nota de una matrícula va en la relación, no en Alumno.</li>
<li><b>Guardar datos derivados</b> (edad, total) cuando se pueden calcular.</li>
<li><b>Claves que cambian o se repiten</b> (el nombre) en vez de un código o el DNI.</li>
<li><b>Leer al revés la cardinalidad:</b> la pareja junto a una entidad cuenta ejemplares de esa entidad.</li>
<li><b>Entidades que en realidad son atributos:</b> si solo tiene un dato y no se relaciona con nada más, seguramente es un atributo.</li></ul>`},

{id:'glosario',t:'Glosario',k:'glosario definiciones vocabulario',h:`
<dl class="th-dl"><dt>Ejemplar (ocurrencia)</dt><dd>Cada uno de los elementos de una entidad: el alumno Ana es un ejemplar de Alumno.</dd>
<dt>Clave candidata</dt><dd>Cualquier atributo (o grupo) que podría ser clave primaria. Se elige uno; los demás pueden ser UNIQUE.</dd>
<dt>Clave primaria (PK)</dt><dd>La clave elegida para identificar cada fila.</dd>
<dt>Clave ajena (FK)</dt><dd>Columna que guarda la PK de otra tabla para relacionarlas.</dd>
<dt>Integridad referencial</dt><dd>Una FK solo puede tener valores que existan en la tabla a la que apunta (o NULL si se permite).</dd>
<dt>Participación</dt><dd>Si es obligatorio (mínimo 1) u opcional (mínimo 0) estar en la relación.</dd>
<dt>Grado</dt><dd>Número de entidades que une una relación: binaria (2), ternaria (3)…</dd>
<dt>Dominio</dt><dd>Los valores posibles de un atributo (su tipo de dato y límites).</dd></dl>`}
];

/* ---------- Theory (English) ---------- */
const TEORIA_EN=[
{id:'intro',t:'How to solve an exercise',k:'steps brief process',h:`
<p>A database exercise is solved in four steps. Each one comes from the previous one:</p>
<ol class="th-steps"><li><b>Entity-Relationship model (E-R).</b> Read the brief and draw <i>what things</i> there are (entities), <i>what data</i> they have (attributes) and <i>how they relate</i> (relationships with their cardinality).</li>
<li><b>Relational model.</b> Turn the E-R into tables, each with its primary key (PK) and its foreign keys (FK).</li>
<li><b>DSD</b> (data structure diagram, «DED» in Spanish). The same tables, drawn with their data types and the lines that join them.</li>
<li><b>SQL.</b> The <code>CREATE TABLE</code> code that really creates those tables in the database.</li></ol>
<div class="th-tip"><b>In the app:</b> make the E-R, click «Convert from my E-R» in the Relational and the DSD (with easy mode the relationships are converted too), and in the SQL tab click «Generate from the DSD». Then try it in the Test tab.</div>
<h4>Reading the brief</h4>
<ul><li>Important <b>nouns</b> (student, course, order) → possible <b>entities</b>.</li><li><b>Data</b> about each thing (name, date, price) → <b>attributes</b>.</li>
<li><b>Verbs</b> joining two things (a student <i>enrols in</i> courses) → <b>relationships</b>.</li><li>Words like <i>each, can, at least, several, only one</i> → <b>cardinalities</b>.</li>
<li>Whatever «identifies» or «cannot repeat» (ID number, code, plate) → <b>primary key</b>.</li></ul>`},
{id:'boceto',t:'Sketch: think before the E-R',k:'sketch draft entities lines relate start',h:`
<p>The <b>Sketch</b> tab (between Brief and E-R) is for thinking about the exercise before drawing the full E-R. It only has <b>entities</b> (with their attribute names, without types) and <b>lines</b> between them with zero, one or many marks. No diamonds or relationship names.</p>
<ol><li>Read the brief and add an entity for each important noun (Student, Course, Teacher…).</li><li>Join with a line the ones that are related (Shift + click, or «Connect»).</li><li>In the box above write each entity with its attributes: <code>Student; DNI, Name</code>. Just the names: keys and types are decided in the E-R.</li><li>Click a line and choose, next to each entity, how many there can be: <b>○</b> zero, <b>|</b> one, <b>foot</b> many (optional).</li><li>Click <b>To the E-R</b>: the missing entities with their attributes and one diamond per line with its cardinalities are created there.</li></ol>`},
{id:'entidades',t:'Entities',k:'entity strong weak rectangle double',h:`
<p>An <b>entity</b> is something we want to store information about and that can be told apart from the rest: a student, a book, an order.</p>
<div class="th-grid"><div class="th-card">${TH(GL.ent,'Entity (strong)')}<p>Rectangle. It has its own primary key: it identifies itself. Example: <i>Student</i> is identified by their ID number.</p></div>
<div class="th-card">${TH(GL.weak,'Weak entity')}<p>Double rectangle. <b>It cannot be identified on its own</b>: it needs another entity (the strong one). It is joined to it with an <b>identifying relationship</b> (double diamond) and has a <b>partial key</b> (dashed underline).</p></div></div>
<div class="th-ex"><b>Weak example:</b> <i>Room 12</i> exists in many hotels. You only know which one it is if you say which hotel. Room is weak of Hotel, and its full key is (HotelCode, RoomNumber).</div>
<div class="th-tip">Ask yourself: «can I tell which one it is without saying whose it is?». If not, it is weak.</div>`},
{id:'atributos',t:'Attributes',k:'attribute primary partial optional derived multivalued composite ellipse',h:`
<p><b>Attributes</b> are the data of an entity or a relationship. They are drawn as ellipses joined to their owner.</p>
<table class="th-tab"><tr><th>Type</th><th>How it is drawn</th><th>What for</th></tr>
<tr><td>${TH(GL.attr,'Normal')}</td><td>Ellipse</td><td>Data with a single value: name, price.</td></tr>
<tr><td>${TH(GL.key,'Primary key')}</td><td>Underlined name</td><td>Identifies each instance. It never repeats and is never empty.</td></tr>
<tr><td>${TH(GL.partial,'Partial key')}</td><td>Dashed underline</td><td>In a weak entity: identifies it together with the strong entity's key.</td></tr>
<tr><td>${TH(GL.opt,'Optional')}</td><td>(O) after the name</td><td>Can be empty (NULL): a landline, a second surname.</td></tr>
<tr><td>${TH(GL.deriv,'Derived')}</td><td>Dashed ellipse</td><td>Calculated from others: age (from the birth date). Not stored in tables.</td></tr>
<tr><td>${TH(GL.multi,'Multivalued')}</td><td>Double ellipse</td><td>Can have several values: several phone numbers, several emails.</td></tr>
<tr><td>${TH(GL.comp,'Composite')}</td><td>Ellipse with other ellipses hanging</td><td>Made of parts: Address = street + number + city.</td></tr></table>
<div class="th-tip">The primary key must be something that <b>never changes and never repeats</b>. If there is nothing like that in the brief, make up a code (CustomerId).</div>`},
{id:'relaciones',t:'Relationships',k:'relationship diamond binary recursive ternary identifying degree attributes',h:`
<p>A <b>relationship</b> joins entities and is drawn as a diamond with a verb: <i>Student — enrols in — Course</i>.</p>
<div class="th-grid"><div class="th-card">${TH(GL.rel,'Binary')}<p>Joins two entities. The most common one.</p></div>
<div class="th-card">${TH(GL.rel,'Recursive')}<p>Joins an entity with itself: an <i>Employee</i> manages other <i>Employees</i>.</p></div>
<div class="th-card">${TH(GL.rel,'Ternary')}<p>Joins three entities at once, when the data only makes sense with all three: a <i>Doctor</i> prescribes a <i>Medicine</i> to a <i>Patient</i>.</p></div>
<div class="th-card">${TH(GL.idrel,'Identifying')}<p>Double diamond. Joins a weak entity with the strong one that identifies it.</p></div></div>
<h4>Attributes on a relationship</h4><p>If a piece of data belongs to neither entity but to the fact that they are related, it goes on the relationship. Example: the <i>grade</i> belongs not to the student nor to the course, but to <i>that student's enrolment in that course</i>.</p>`},
{id:'cardinalidad',t:'Cardinality (maximum and minimum)',k:'cardinality minimum maximum participation 1:1 1:n n:m mandatory optional',h:`
<p>Each line between a relationship and an entity gets a pair <b>(minimum, maximum)</b>. In this app (as in ERD Plus) the pair <b>next to an entity</b> says <b>how many instances of that entity</b> each instance of the other one can have.</p>
<div class="th-ex"><b>Example:</b> Pizzeria — how many Animatronics can it have at most? <b>Many (N)</b>. And at least? <b>None (0)</b>. Next to Animatronic goes <b>(0,N)</b>.<br>
Animatronic — how many Pizzerias can it have? At most <b>1</b> and at least <b>1</b>. Next to Pizzeria goes <b>(1,1)</b>.</div>
<table class="th-tab"><tr><th>Value</th><th>Means</th></tr><tr><td><b>Minimum 0</b></td><td>Optional participation: it may have none.</td></tr><tr><td><b>Minimum 1</b></td><td>Mandatory participation: it always has at least one.</td></tr>
<tr><td><b>Maximum 1</b></td><td>At most one.</td></tr><tr><td><b>Maximum N</b></td><td>It can have many.</td></tr></table>
<h4>Relationship type</h4><p>It comes from the <b>two maximums</b>:</p>
<ul><li><b>1:1</b> → both maximums are 1 (a person has one passport).</li><li><b>1:N</b> → one maximum is 1 and the other N (a pizzeria has many animatronics).</li><li><b>N:M</b> → both maximums are N (a student, many courses; a course, many students).</li></ul>
<div class="th-tip">Always ask both questions, one from each entity. The app shows them when you click the relationship or one of its lines.</div>`},
{id:'jerarquias',t:'Hierarchies (generalization / ISA)',k:'isa hierarchy generalization specialization supertype subtype total partial disjoint overlapping inheritance',h:`
<p>A <b>hierarchy</b> (ISA, «is a») is used when one entity is a particular case of another: a <i>Tenured</i> teacher <b>is a</b> <i>Teacher</i>.</p>
<p>It is drawn with a <b>triangle</b>: the general entity (<b>supertype</b>) on top and the particular ones (<b>subtypes</b>) below. Subtypes <b>inherit</b> the key and attributes of the supertype.</p>
<table class="th-t"><tr><td><b>Total</b> (t)</td><td>Every teacher belongs to some subtype.</td></tr><tr><td><b>Partial</b> (p)</td><td>Some teachers may belong to no subtype.</td></tr>
<tr><td><b>Disjoint</b> (e)</td><td>Each one belongs to at most one subtype.</td></tr><tr><td><b>Overlapping</b> (s)</td><td>One can belong to several subtypes.</td></tr></table>
<h4>To tables</h4><ul><li><b>One table per entity</b> (always valid): each subtype's PK is the supertype's PK, also an FK to it.</li><li><b>All in the supertype</b>: one table with every column and a <i>type</i> column.</li><li><b>Only subtypes</b>: each subtype copies the supertype columns. Only if the hierarchy is total.</li></ul>`},

{id:'ternarias',t:'Ternary relationships',k:'ternary three entities cardinality degree',h:`
<p>A <b>ternary</b> relationship joins three entities at once. Use it only when the fact needs all three: <i>a teacher teaches a subject to a group</i>.</p>
<p>Cardinality: for each entity ask, <b>fixing a pair of the other two</b>, how many of this one there can be.</p>
<p>To tables: always a <b>new table</b> with the three PKs as FKs. Its PK is made of the FKs on the sides with maximum N.</p>`},

{id:'asociativa',t:'Associative entity',k:'associative aggregation relationship as entity rectangle diamond enrolment',h:`
<p>An <b>associative entity</b> is a relationship that is also treated as an entity: the <b>diamond is drawn inside a rectangle</b>. Use it when the relationship itself has to be related to another entity.</p>
<p>Example: a student <i>enrols</i> in a subject (N:M). If each enrolment is also <i>marked</i> by a teacher, «Enrolment» becomes an associative entity joined to Teacher with another relationship.</p>
<h4>Cardinality</h4><p>As always: in «marks», next to Teacher (1,1) because each enrolment is marked by one teacher, and next to Enrolment (0,N) because a teacher marks many.</p>
<h4>To tables</h4><p>It becomes a table with its name whose <b>PK is the keys of its entities</b>, plus its attributes. Its relationships with other entities are converted as usual, treating it as one more entity: here it receives the teacher's key as FK.</p>
<p class="th-tip">In the app: select the relationship and turn on «Associative entity» (also in the right-click menu). Then join it to another entity with Shift + click: the relationship is created in the middle.</p>`},

{id:'paso',t:'From E-R to tables',k:'conversion relational rules fk junction table n:m 1:n 1:1 weak multivalued',h:`
<p>These are the rules to turn the E-R into the relational model. They are the same ones the «Convert from my E-R» button uses with easy mode.</p>
<table class="th-tab"><tr><th>In the E-R</th><th>In the tables</th></tr><tr><td>Entity</td><td>A table with its attributes. The primary key is underlined.</td></tr>
<tr><td>Composite attribute</td><td>Its parts are stored as columns (street, number, city).</td></tr><tr><td>Derived attribute</td><td>Not stored (it is calculated).</td></tr>
<tr><td>Multivalued attribute</td><td>A separate table: the entity's PK + the attribute. Both form the PK.</td></tr>
<tr><td><b>1:N</b> relationship</td><td>The PK of the «1» side goes as an <b>FK</b> to the «N» side table. If the minimum next to the 1 side is 0, the FK can be NULL.</td></tr>
<tr><td><b>1:1</b> relationship</td><td>The FK goes to one of the two tables (better the one that participates mandatorily) and is marked <b>UNIQUE</b>.</td></tr>
<tr><td><b>N:M</b> relationship</td><td>A new table with both entities' PKs as FKs; together they form its PK. The relationship's attributes go here.</td></tr>
<tr><td><b>Weak</b> entity</td><td>Its table takes the strong entity's PK as an FK, and its PK is that FK + the partial key.</td></tr>
<tr><td><b>Recursive</b> relationship</td><td>Like its type (1:N or N:M), but the FK is renamed (ManagerId → Employee).</td></tr><tr><td><b>Ternary</b> relationship</td><td>A new table with the PKs of the three entities.</td></tr></table>`},
{id:'relacional',t:'Relational model',k:'relational table pk fk foreign key arrow notation',h:`
<p>The relational model is written as a list of tables with their columns:</p>
<div class="th-code">Student(<u>StudentId</u>, Name, Surname, BirthDate)<br>Course(<u>CourseCode</u>, Name, Hours)<br>Enrolment(<u>StudentId</u>, <u>CourseCode</u>, Grade)</div>
<ul><li><b>Primary key (PK):</b> underlined. Identifies each row: it never repeats and cannot be NULL.</li><li><b>Foreign key (FK):</b> a column that points to another table's PK. In the app it is drawn with an arrow to the table it points to (as in ERD Plus).</li>
<li><b>NN</b> (NOT NULL): the column cannot be empty. <b>Unique</b> (UNIQUE): it never repeats, but it is not the key.</li></ul>
<div class="th-tip">A column can be both PK and FK: it happens in the tables of N:M relationships and in weak entities.</div>`},
{id:'ded',t:'DSD (data structure diagram)',k:'dsd ded lines solid dashed crow foot types identifying',h:`
<p>The DSD draws the tables with their columns and <b>data types</b>, and joins each FK to the table it points to.</p>
<ul><li>${GL.pkcol} Primary key &nbsp; ${GL.fkcol} Foreign key &nbsp; ${GL.nncol} Cannot be null &nbsp; ${GL.uqcol} Unique</li></ul>
<h4>The lines: solid or dashed</h4>
<p>It only depends on one question: <b>in the table that has the FK, is that FK part of the PK?</b> (is it underlined?)</p>
<table class="th-tab"><tr><th>Line</th><th>When</th><th>Examples</th></tr>
<tr><td><b>Solid</b> ───</td><td>Yes: the FK is also the PK (or part of it). <b>Identifying</b> relationship: the child row cannot be identified without the parent.</td><td>N:M table (Enrolment: DNI + Code) · weak entity (Line: OrderNum + LineNum) · hierarchy subtype · associative entity</td></tr>
<tr><td><b>Dashed</b> - - -</td><td>No: the FK is a normal column outside the PK. <b>Non-identifying</b> relationship.</td><td>Normal 1:N (Order.DNI of the customer) · 1:1 with UNIQUE FK · recursive relationship (Employee.boss)</td></tr></table>
<h4>How to tell from the E-R</h4>
<ul><li><b>N:M</b>, <b>ternary</b> or <b>associative</b> → new table whose PK is the FKs → <b>solid</b>.</li>
<li><b>Weak entity</b> with identifying relationship (double diamond) → the FK goes into its PK → <b>solid</b>.</li>
<li><b>Hierarchy</b> (one table per entity) → the subtype uses the supertype's PK as PK and FK → <b>solid</b>.</li>
<li><b>1:N</b> and <b>1:1</b> between strong entities → the FK is a normal column → <b>dashed</b>.</li></ul>
<p class="th-tip">Tip: if all the FKs of a table are underlined, all its lines are solid. In the app, tap the line and turn «Identifying» on or off.</p>
<h4>The ends (crow's foot)</h4><ul><li><b>||</b> one and only one · <b>o|</b> zero or one · <b>|&lt;</b> one or many · <b>o&lt;</b> zero or many.</li>
<li>On the parent side, the circle appears if the FK can be NULL (optional participation).</li><li>On the child side there is a crow's foot (many), unless the FK is UNIQUE (1:1).</li></ul>`},
{id:'normalizacion',t:'Normalization (1NF, 2NF, 3NF)',k:'normalization normal form 1nf 2nf 3nf dependency redundancy',h:`
<p>Normalizing means checking the tables so they do not repeat information and do not cause problems when inserting, updating or deleting.</p>
<div class="th-card"><h4>1NF · First normal form</h4><p>Each cell has <b>a single value</b> (no lists like «612…, 699…») and there are no repeated groups of columns (Tel1, Tel2, Tel3). Solution: move those values to another table.</p></div>
<div class="th-card"><h4>2NF · Second normal form</h4><p>It is in 1NF and, if the PK has several columns, <b>every column depends on the whole key</b>, not on part of it. In Enrolment(<u>StudentId</u>, <u>CourseCode</u>, CourseName, Grade), CourseName depends only on CourseCode: it must go in the Course table.</p></div>
<div class="th-card"><h4>3NF · Third normal form</h4><p>It is in 2NF and <b>no column depends on another non-key column</b>. In Employee(<u>Id</u>, DeptCode, DeptName), DeptName depends on DeptCode: it must go in the Department table.</p></div>
<div class="th-tip">If you make a good E-R and apply the conversion rules, the tables usually come out in 3NF already.</div>`},
{id:'sql',t:'SQL to create the tables',k:'sql create table database primary key foreign key not null unique alter types varchar int date decimal dialect',h:`
<div class="th-code">CREATE DATABASE school;<br>USE school;<br><br>CREATE TABLE Student (<br>&nbsp;&nbsp;StudentId CHAR(9) NOT NULL,<br>&nbsp;&nbsp;Name VARCHAR(45) NOT NULL,<br>&nbsp;&nbsp;Phone VARCHAR(15) NULL,<br>&nbsp;&nbsp;PRIMARY KEY (StudentId)<br>);<br><br>
CREATE TABLE Enrolment (<br>&nbsp;&nbsp;StudentId CHAR(9) NOT NULL,<br>&nbsp;&nbsp;CourseCode INT NOT NULL,<br>&nbsp;&nbsp;Grade DECIMAL(4,2) NULL,<br>&nbsp;&nbsp;PRIMARY KEY (StudentId, CourseCode),<br>&nbsp;&nbsp;FOREIGN KEY (StudentId) REFERENCES Student (StudentId),<br>&nbsp;&nbsp;FOREIGN KEY (CourseCode) REFERENCES Course (CourseCode)<br>);</div>
<h4>Most used data types</h4><table class="th-tab"><tr><td><code>INT</code></td><td>Whole numbers (codes, quantities).</td></tr><tr><td><code>DECIMAL(8,2)</code></td><td>Exact decimal numbers (prices, grades): 8 digits, 2 decimals.</td></tr>
<tr><td><code>VARCHAR(n)</code></td><td>Text up to n characters.</td></tr><tr><td><code>CHAR(n)</code></td><td>Fixed-length text (ID number: CHAR(9)).</td></tr><tr><td><code>DATE</code> / <code>TIME</code> / <code>DATETIME</code></td><td>Date, time, or both.</td></tr><tr><td><code>BOOLEAN</code></td><td>Yes or no.</td></tr></table>
<h4>Differences between database systems</h4><ul><li><b>MySQL</b>: <code>VARCHAR</code>, <code>BOOLEAN</code>, <code>USE base;</code>.</li><li><b>SQL Server</b>: <code>BIT</code> for booleans, <code>GO</code> between blocks.</li><li><b>Oracle</b>: <code>VARCHAR2</code>, <code>NUMBER</code>, no <code>CREATE DATABASE</code> (tables go in your user schema).</li><li><b>PostgreSQL</b>: <code>TIMESTAMP</code> instead of <code>DATETIME</code>, <code>\\c base</code> to connect.</li></ul>
<p>In the SQL tab choose the system and the app adapts the types for you.</p>
<h4>Constraints</h4><ul><li><code>NOT NULL</code>: mandatory. <code>NULL</code>: may be empty.</li><li><code>PRIMARY KEY</code>, <code>UNIQUE</code>, <code>FOREIGN KEY … REFERENCES</code>.</li>
<li>A table with an FK is created <b>after</b> the table it points to. If two tables point to each other, the FK is added at the end with <code>ALTER TABLE … ADD FOREIGN KEY</code>.</li></ul>`},
{id:'errores',t:'Common mistakes',k:'mistakes errors tips review',h:`
<ul class="th-list"><li><b>Putting the FK on the wrong side</b> of a 1:N: it always goes on the «many» side.</li><li><b>Forgetting the junction table</b> of an N:M: two tables cannot be joined N:M directly.</li>
<li><b>Attributes in the wrong place:</b> the grade of an enrolment goes on the relationship, not on Student.</li><li><b>Storing derived data</b> (age, total) when it can be calculated.</li>
<li><b>Keys that change or repeat</b> (the name) instead of a code or ID number.</li><li><b>Reading the cardinality backwards:</b> the pair next to an entity counts instances of that entity.</li>
<li><b>Entities that are really attributes:</b> if it only has one piece of data and relates to nothing else, it is probably an attribute.</li></ul>`},
{id:'glosario',t:'Glossary',k:'glossary definitions vocabulary',h:`
<dl class="th-dl"><dt>Instance (occurrence)</dt><dd>Each element of an entity: the student Ana is an instance of Student.</dd><dt>Candidate key</dt><dd>Any attribute (or group) that could be the primary key. One is chosen; the others can be UNIQUE.</dd>
<dt>Primary key (PK)</dt><dd>The key chosen to identify each row.</dd><dt>Foreign key (FK)</dt><dd>A column that stores another table's PK to relate them.</dd>
<dt>Referential integrity</dt><dd>An FK can only hold values that exist in the table it points to (or NULL if allowed).</dd><dt>Participation</dt><dd>Whether being in the relationship is mandatory (minimum 1) or optional (minimum 0).</dd>
<dt>Degree</dt><dd>Number of entities a relationship joins: binary (2), ternary (3)…</dd><dt>Domain</dt><dd>The possible values of an attribute (its data type and limits).</dd></dl>`}
];
