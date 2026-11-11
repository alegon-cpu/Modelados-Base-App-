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
<h4>Las líneas</h4>
<table class="th-tab"><tr><th>Línea</th><th>Cuándo</th></tr>
<tr><td><b>Continua</b></td><td>Relación <b>identificadora</b>: la FK forma parte de la PK de la tabla hija (débiles y tablas de N:M).</td></tr>
<tr><td><b>Discontinua</b></td><td>Relación <b>no identificadora</b>: la FK es una columna normal.</td></tr></table>
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
