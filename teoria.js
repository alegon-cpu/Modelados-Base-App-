/* ===================== Teoría ===================== */
// Cada tema: id, título, palabras para el buscador y contenido.
const TH=(ic,t)=>`<span class="th-sym">${ic}<span>${t}</span></span>`;
// Dibujo pequeño de Chen para la teoría: A —(rombo)— B, con B débil si hace falta y el rombo doble si es identificadora
const thER=(a,rel,b,o)=>{o=o||{};const w=520,h=110,E=(x,n,dbl)=>`<rect x="${x}" y="40" width="120" height="34" rx="2" fill="none" stroke="var(--c-ent)" stroke-width="1.6"/>${dbl?`<rect x="${x+4}" y="44" width="112" height="26" rx="1" fill="none" stroke="var(--c-ent)" stroke-width="1.2"/>`:''}<text x="${x+60}" y="62" text-anchor="middle" font-size="13" fill="currentColor">${n}</text>`;
  const R=(x,n,dbl)=>`<path d="M${x} 57 l46 -22 l46 22 l-46 22z" fill="none" stroke="var(--c-rel)" stroke-width="1.6"/>${dbl?`<path d="M${x+8} 57 l38 -17 l38 17 l-38 17z" fill="none" stroke="var(--c-rel)" stroke-width="1.1"/>`:''}<text x="${x+46}" y="61" text-anchor="middle" font-size="12" fill="currentColor">${n}</text>`;
  const C=(x,t)=>`<text x="${x}" y="32" text-anchor="middle" font-size="11.5" fill="var(--muted)">${t}</text>`;
  return `<svg class="th-er" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${a} ${rel} ${b}"><line x1="130" y1="57" x2="214" y2="57" stroke="currentColor"/><line x1="306" y1="57" x2="390" y2="57" stroke="currentColor"/>${E(10,a)}${R(214,rel,o.id)}${E(390,b,o.weak)}${C(165,o.ca||'(1,N)')}${C(350,o.cb||'(1,1)')}</svg>`;};
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

{id:'diseno',t:'Las tres fases: conceptual, lógico y físico',k:'diseño conceptual logico fisico refinamiento chen dominio reglas entidad redundancia',h:`
<table class="th-tab"><tr><th>Fase</th><th>Qué se hace</th><th>En clase</th></tr>
<tr><td><b>1. Diseño conceptual</b></td><td>Representar la información de la empresa sin pensar en ningún programa.</td><td>Modelo E-R extendido (papel y ERDPlus).</td></tr>
<tr><td><b>2. Diseño lógico</b></td><td>Pasar el E-R al modelo del gestor (relacional): tablas, PK y FK.</td><td>DED (Workbench) o diagrama referencial (ERDPlus).</td></tr>
<tr><td><b>3. Diseño físico</b></td><td>Crear de verdad la base de datos en un gestor concreto.</td><td>Script SQL (CREATE DATABASE, CREATE TABLE…).</td></tr></table>
<h4>Reglas que cumple toda entidad</h4><ul><li>Tiene existencia propia.</li><li>Cada ejemplar se distingue de los demás (por eso tiene identificador).</li><li>Todos sus ejemplares tienen los mismos atributos.</li></ul>
<p><b>Dominio</b>: el conjunto de valores que puede tomar un atributo (por ejemplo, las notas de 0 a 10). Existe aunque no haya ninguna entidad.</p>
<h4>Quitar redundancias</h4><ul><li>Un atributo que se calcula a partir de otros se quita o se marca como derivado.</li><li>Una relación que se puede «recorrer» por otro camino es redundante: se quita, comprobando que se sigue llegando de una entidad a la otra.</li></ul>
<h4>Refinamiento de Chen (E-R → tablas)</h4>
<table class="th-tab"><tr><th>En el E-R</th><th>Tablas</th></tr>
<tr><td>1:1</td><td>Depende de las cardinalidades mínimas: la FK va al lado que participa obligatoriamente (y lleva UNIQUE).</td></tr>
<tr><td>1:N</td><td>A(<u>a</u>, …) · B(<u>b</u>, …, <i>a</i>)</td></tr>
<tr><td>1:N con B débil (identificación)</td><td>A(<u>a</u>, …) · B(<u><i>a</i>, b</u>, …)</td></tr>
<tr><td>N:M</td><td>C(<u><i>a</i>, <i>b</i></u>, …) <b>o bien</b> C(<u>c</u>, <i>a</i>, <i>b</i>, …) con clave propia</td></tr>
<tr><td>N-aria</td><td>D(<u><i>a</i>, <i>b</i>, <i>c</i></u>, …) o bien D(<u>d</u>, <i>a</i>, <i>b</i>, <i>c</i>, …)</td></tr></table>
<p class="th-tip">En la app: en una N:M (o ternaria, o asociativa) escribe en «Clave propia de su tabla» el nombre, por ejemplo <i>CodDetFac</i>. La tabla tendrá esa PK y las FK quedarán como columnas normales.</p>`},
{id:'boceto',t:'Boceto: pensar antes del E-R',k:'boceto esquema borrador entidades atributos compuesto relacion empezar',h:`
<p>La pestaña <b>Boceto</b> (entre Enunciado y E-R) sirve para pensar el ejercicio antes de dibujar el E-R completo: escribes y el dibujo sale solo, con cada entidad y sus atributos.</p>
<ol><li>Lee el enunciado y escribe arriba <b>una entidad por línea</b> con sus atributos: <code>Alumno; DNI, Nombre, FechaNac</code>.</li>
<li>Un atributo <b>compuesto</b> lleva sus partes entre paréntesis: <code>Alumno; DNI, Direccion (Calle, Numero, CP)</code>.</li>
<li>Los atributos de una <b>relación</b> se escriben con las dos entidades unidas por un guion: <code>Alumno-Curso; Nota</code>. No se dibujan aquí, pero salen en el E-R.</li>
<li><b>Pincha un atributo</b> en el dibujo (o en el panel de la derecha) para marcar si es clave primaria, único, opcional, multivaluado o derivado.</li>
<li>Pulsa <b>Pasar al E-R</b>: se crean las entidades con sus atributos y sus tipos, los compuestos con sus partes y una relación por cada línea <code>A-B</code>. Allí pones las cardinalidades y el verbo de cada relación.</li></ol>
<p class="th-tip">Si una entidad no se relaciona con ninguna, quizá sobra, o es un atributo de otra.</p>`},
{id:'entidades',t:'Entidades',k:'entidad fuerte debil rectangulo doble',h:`
<p>Una <b>entidad</b> es algo de lo que queremos guardar información y que se puede distinguir de los demás: un alumno, un libro, un pedido.</p>
<div class="th-grid"><div class="th-card">${TH(GL.ent,'Entidad (fuerte)')}<p>Rectángulo. Tiene su propia clave primaria: se identifica sola. Ejemplo: <i>Alumno</i> se identifica por su DNI.</p></div>
<div class="th-card">${TH(GL.weak,'Entidad débil')}<p>Doble rectángulo. <b>No puede existir sin</b> otra entidad (la fuerte). Si además <b>no se puede identificar sola</b>, va unida con una <b>relación identificadora</b> (doble rombo) y tiene una <b>clave parcial</b> (subrayado discontinuo). Mira el tema «Entidad débil: existencia e identificación».</p></div></div>
<div class="th-ex"><b>Ejemplo de débil:</b> la <i>Habitación 12</i> existe en muchos hoteles. Solo sabes cuál es si dices de qué hotel es. Habitación es débil de Hotel, y su clave completa es (CodHotel, NumHabitación).</div>
<div class="th-tip">Pregúntate: «¿puedo saber cuál es sin decir de quién es?». Si la respuesta es no, es débil.</div>`},

{id:'debil',t:'Entidad débil: existencia e identificación',k:'debil existencia identificacion dependencia cascade on delete cascade relacion debil regular rombo doble tipos de entidades tipos de atributos tipos de relaciones calculado',h:`
<p>Antes de nada, un repaso de los <b>tipos</b> que hay, porque aquí se juntan varios:</p>
<div class="th-grid"><div class="th-card"><h4>Tipos de entidades</h4><p><b>Regular</b> (fuerte): existe por sí misma. <b>Débil</b>: solo tiene sentido si existe otra. <b>Asociativa</b>: una relación N:M que tratamos como entidad para relacionarla con otra. <b>Supertipo / subtipo</b>: jerarquías (ISA).</p></div>
<div class="th-card"><h4>Tipos de atributos</h4><p>Clave primaria · opcional u obligatorio · derivado (se calcula) o almacenado · multivaluado o univaluado · compuesto o simple. La <b>FK</b> no existe en el E-R: aparece al pasar a tablas. Un <b>calculado</b> no lleva dibujo especial: decides si lo guardas o no (si lo guardas, hay que mantenerlo al día, por ejemplo con un trigger).</p></div>
<div class="th-card"><h4>Tipos de relaciones</h4><p><b>Regular</b>: une dos entidades regulares. <b>Débil</b>: une una regular con una débil. La débil puede ser de dos clases: con <b>dependencia en existencia</b> o con <b>dependencia en identificación</b>.</p></div></div>
<h4>La idea en una frase</h4>
<p>Una entidad es <b>débil</b> cuando sus filas <b>no pueden existir sin</b> la fila de otra entidad. Si se borra la «madre», se tienen que borrar sus «hijas». Casi siempre es una relación 1:N (una madre, muchas hijas).</p>
<p>La pregunta que decide de qué clase es: <b>¿la hija se puede reconocer sola, o solo diciendo de qué madre es?</b></p>
<h4>Ejemplo: edificios y aulas</h4>
<div class="th-ex">Un instituto guarda sus <b>edificios</b> (código, nombre) y sus <b>aulas</b> (número, capacidad). Un aula no tiene sentido si el edificio desaparece.</div>
<h4>1) Dependencia en existencia</h4>
<p>Cada aula tiene un <b>número único en todo el instituto</b> (la 101, la 102, la 205…). Se reconoce sola, pero no puede existir sin su edificio.</p>
${thER('Edificio','tiene','Aula',{weak:1,ca:'(0,N)',cb:'(1,1)'})}
<ul><li>Aula se dibuja con <b>doble rectángulo</b>; el rombo es <b>normal</b>.</li><li>Se pasa a tablas como un 1:N normal: la FK <code>CodEdif</code> va en Aula, <b>fuera</b> de la clave primaria.</li><li>Lo único que cambia: al borrar un edificio se borran solas sus aulas → <code>ON DELETE CASCADE</code>.</li></ul>
<pre class="th-code">CREATE TABLE Aula (<br>&nbsp;&nbsp;NumAula INT NOT NULL,<br>&nbsp;&nbsp;Capacidad TINYINT NOT NULL,<br>&nbsp;&nbsp;CodEdif INT NOT NULL,<br>&nbsp;&nbsp;PRIMARY KEY (NumAula),<br>&nbsp;&nbsp;FOREIGN KEY (CodEdif) REFERENCES Edificio (CodEdif)<br>&nbsp;&nbsp;&nbsp;&nbsp;ON UPDATE NO ACTION ON DELETE CASCADE<br>);</pre>
<h4>2) Dependencia en identificación</h4>
<p>Ahora las aulas se numeran <b>dentro de cada edificio</b>: el edificio A tiene su aula 1, el B también tiene su aula 1… «El aula 1» no dice nada si no dices de qué edificio. Se identifica con <b>el código del edificio + su número</b>.</p>
${thER('Edificio','tiene','Aula',{weak:1,id:1,ca:'(0,N)',cb:'(1,1)'})}
<ul><li>Doble rectángulo y además <b>rombo doble</b> (relación identificadora). El número del aula es una <b>clave parcial</b> (subrayado discontinuo).</li><li>Al pasar a tablas la FK <b>forma parte de la clave primaria</b>: <code>PRIMARY KEY (CodEdif, NumAula)</code>.</li><li>Y también <code>ON DELETE CASCADE</code>.</li></ul>
<pre class="th-code">CREATE TABLE Aula (<br>&nbsp;&nbsp;CodEdif INT NOT NULL,<br>&nbsp;&nbsp;NumAula INT NOT NULL,<br>&nbsp;&nbsp;Capacidad TINYINT NOT NULL,<br>&nbsp;&nbsp;PRIMARY KEY (CodEdif, NumAula),<br>&nbsp;&nbsp;FOREIGN KEY (CodEdif) REFERENCES Edificio (CodEdif)<br>&nbsp;&nbsp;&nbsp;&nbsp;ON UPDATE NO ACTION ON DELETE CASCADE<br>);</pre>
<table class="th-tab"><tr><th></th><th>Existencia</th><th>Identificación</th></tr>
<tr><td>La hija se reconoce…</td><td>sola (número único)</td><td>solo con la madre</td></tr>
<tr><td>Dibujo</td><td>doble rectángulo + rombo normal</td><td>doble rectángulo + rombo doble + clave parcial</td></tr>
<tr><td>FK en la tabla hija</td><td>fuera de la PK, NOT NULL</td><td>dentro de la PK</td></tr>
<tr><td>Al borrar la madre</td><td colspan="2"><code>ON DELETE CASCADE</code>: se borran sus hijas</td></tr></table>
<h4>Qué hace ON DELETE CASCADE</h4>
<p>Con datos de ejemplo: si el edificio 1 tiene las aulas 1 y 2 y haces <code>DELETE FROM Edificio WHERE CodEdif = 1;</code>, la base de datos borra sola esas dos aulas. Sin CASCADE, ese DELETE daría error porque hay aulas que apuntan al edificio. <code>ON UPDATE NO ACTION</code> dice que no se deja cambiar el código de un edificio que tenga aulas. En Oracle solo se escribe <code>ON DELETE CASCADE</code>.</p>
<div class="th-tip"><b>En la app:</b> pon la entidad como <b>débil</b> (doble rectángulo). Si la relación es normal, al pasar a tablas sale como dependencia en existencia; si la marcas como <b>identificadora</b> (rombo doble) y su clave como <b>clave parcial</b>, sale como dependencia en identificación. En los dos casos el SQL lleva el CASCADE. En el relacional o el DED, al pinchar la línea de una FK puedes cambiarlo en «Al borrar una fila de…».</div>`},
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

{id:'derivado',t:'Atributo derivado y atributo calculado',k:'derivado calculado almacenado trigger edad fecha nacimiento ejemplares prestados',h:`
<table class="th-tab"><tr><th></th><th>Derivado</th><th>Calculado</th></tr>
<tr><td>Se puede sacar de otros datos</td><td>Sí</td><td>Sí</td></tr>
<tr><td>¿Se guarda en la tabla?</td><td><b>Nunca</b>: se calcula con una consulta cuando hace falta</td><td><b>Se decide</b>: se guarda si el cálculo es costoso o se usa constantemente</td></tr>
<tr><td>Dibujo</td><td>Óvalo con borde discontinuo</td><td>Óvalo normal (es un atributo almacenado)</td></tr>
<tr><td>Si se guarda</td><td>—</td><td>Hay que mantenerlo <b>siempre</b> actualizado (por ejemplo, con un trigger)</td></tr></table>
<h4>Ejemplos</h4><ul><li><b>Edad</b> (derivado): se guarda la FechaNacimiento y la edad se muestra con una consulta.</li>
<li><b>Ejemplares prestados</b> de un libro (calculado y guardado): se suma 1 en cada préstamo para no recorrer miles de préstamos cada vez.</li>
<li><b>Despachos ocupados</b> de un edificio (calculado, no guardado): se puede contar con una consulta y casi no se consulta.</li></ul>
<p class="th-tip">En la app: «Derivado» dibuja el borde discontinuo y no se pasa a las tablas. Un calculado que se guarda es un atributo normal; puedes escribirlo en una nota para acordarte de que hay que actualizarlo.</p>`},
{id:'relaciones',t:'Relaciones',k:'relacion rombo binaria reflexiva ternaria identificadora grado atributos de relacion',h:`
<p>Una <b>relación</b> une entidades y se dibuja como un rombo con un verbo: <i>Alumno — se matricula — Curso</i>.</p>
<div class="th-grid"><div class="th-card">${TH(GL.rel,'Binaria')}<p>Une dos entidades. Es la más habitual.</p></div>
<div class="th-card">${TH(GL.rel,'Reflexiva')}<p>Une una entidad consigo misma: un <i>Empleado</i> dirige a otros <i>Empleados</i>.</p></div>
<div class="th-card">${TH(GL.rel,'Ternaria')}<p>Une tres entidades a la vez, cuando el dato solo tiene sentido con las tres: <i>Médico</i> receta <i>Medicamento</i> a <i>Paciente</i>.</p></div>
<div class="th-card">${TH(GL.idrel,'Identificadora')}<p>Doble rombo. Une una entidad débil con la fuerte que la identifica.</p></div></div>
<h4>Atributos en una relación</h4>
<p>Si un dato no es de ninguna de las dos entidades, sino de que estén relacionadas, va en la relación. Ejemplo: la <i>nota</i> no es del alumno ni del curso: es de <i>la matrícula</i> de ese alumno en ese curso.</p>`},

{id:'tiposrel',t:'Tipos de relaciones: regular, débil y exclusiva',k:'relacion regular debil existencia identificacion exclusiva nave lanzadera cascade',h:`
<ul><li><b>Regular</b>: une dos entidades regulares.</li><li><b>Débil</b>: une una entidad regular con una débil. Puede ser de dos tipos:</li></ul>
<table class="th-tab"><tr><th></th><th>Dependencia en existencia</th><th>Dependencia en identificación</th></tr>
<tr><td>Qué significa</td><td>La lanzadera no tiene sentido sin su nave, pero se identifica sola (por su número).</td><td>Además, la lanzadera solo se identifica junto con su nave (nave 1 – lanzadera 1, nave 2 – lanzadera 1…).</td></tr>
<tr><td>Dibujo</td><td>Doble rectángulo y rombo simple</td><td>Doble rectángulo y <b>doble rombo</b>; su clave es parcial (subrayado discontinuo)</td></tr>
<tr><td>Tabla</td><td>Lanzadera(<u>Numero</u>, Capacidad, <i>CodNave</i>)</td><td>Lanzadera(<u><i>CodNave</i>, Numero</u>, Capacidad)</td></tr>
<tr><td>FK</td><td colspan="2"><code>ON UPDATE NO ACTION ON DELETE CASCADE</code>: al borrar una nave se borran sus lanzaderas</td></tr></table>
<div class="th-code">CREATE TABLE Lanzadera (<br>&nbsp;&nbsp;CodNave INT NOT NULL,<br>&nbsp;&nbsp;Numero INT NOT NULL,<br>&nbsp;&nbsp;Capacidad TINYINT NOT NULL,<br>&nbsp;&nbsp;PRIMARY KEY (CodNave, Numero),<br>&nbsp;&nbsp;FOREIGN KEY (CodNave) REFERENCES Nave(CodNave)<br>&nbsp;&nbsp;&nbsp;&nbsp;ON UPDATE NO ACTION ON DELETE CASCADE<br>);</div>
<p class="th-tip">En la app: marca la entidad como «Entidad débil». Si su clave es propia (subrayado normal), deja la relación simple: dependencia en existencia. Si su clave es parcial, marca la relación como «Identificadora»: dependencia en identificación.</p>
<h4>Relación exclusiva</h4><p>Una entidad participa en <b>una u otra</b> relación, pero no en las dos a la vez (por ejemplo, un pago lo hace un cliente <i>o</i> una empresa). Se dibuja con un arco que cruza las dos líneas. En las tablas quedan dos FK que admiten NULL, y solo una puede tener valor (se comprueba con un <code>CHECK</code>).</p>
<h4>Según el grado (cuántas entidades asocia)</h4><ul><li><b>Binarias</b>: asocian dos entidades.</li><li><b>N-arias</b>: asocian N entidades, siendo N mayor que 2 (la ternaria es la de 3). Estas relaciones <b>no se dan en el modelo relacional</b>.</li><li><b>Reflexivas</b>: relacionan una entidad consigo misma.</li></ul>
<p>El modelo relacional solo contempla las relaciones <b>reflexivas y binarias</b>. Por eso una N-aria se convierte en una tabla con las claves de todas sus entidades, y esa tabla se une a cada entidad con una relación binaria.</p>
<p class="th-tip">En la app: una reflexiva es una relación con sus dos líneas a la misma entidad. Para una ternaria, une una tercera entidad a la relación con Mayús + clic.</p>`},
{id:'cardinalidad',t:'Cardinalidad (máximo y mínimo)',k:'cardinalidad minimo maximo participacion 1:1 1:n n:m obligatoria opcional',h:`
<p>En cada línea entre relación y entidad se pone una pareja <b>(mínimo, máximo)</b>. La pareja que está <b>junto a una entidad</b> dice <b>cuántas veces participa esa entidad</b> en la relación: con cuántos ejemplares de la otra se puede relacionar cada uno de ella.</p>
<div class="th-ex"><b>Ejemplo:</b> Provincia —pertenece— Comunidad. Cada provincia ¿a cuántas comunidades pertenece? Como mínimo <b>1</b> y como máximo <b>1</b>: junto a Provincia va <b>(1,1)</b>.<br>
Cada comunidad ¿cuántas provincias tiene? Como mínimo <b>1</b> y como máximo <b>muchas (N)</b>: junto a Comunidad va <b>(1,N)</b>. Es una 1:N y, al pasar a tablas, la clave ajena va a <b>Provincia</b> (la que participa como mucho 1 vez).</div>
<p class="tnote">Si en tu clase se lee al revés (la pareja junto a una entidad cuenta cuántas de esa entidad tiene la otra), cámbialo en Ajustes › Lienzo › «Cómo se lee la cardinalidad».</p>
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
<h4>Ejemplo: Empleado (DNI, Nombre) con Directivo (Departamento), Técnico (Máquina) y Comercial (Comisión)</h4>
<table class="th-tab"><tr><th>Opción</th><th>Tablas</th></tr>
<tr><td>Una tabla por entidad</td><td>Empleado(<u>DNI</u>, Nombre)<br>Directivo(<u><i>DNI</i></u>, Departamento)<br>Tecnico(<u><i>DNI</i></u>, Maquina)<br>Comercial(<u><i>DNI</i></u>, Comision)</td></tr>
<tr><td>Todo en el supertipo</td><td>Empleado(<u>DNI</u>, Nombre, Puesto, Departamento (O), Maquina (O), Comision (O))</td></tr>
<tr><td>Solo los subtipos</td><td>Directivo(<u>DNI</u>, Nombre, Departamento)<br>Tecnico(<u>DNI</u>, Nombre, Maquina)<br>Comercial(<u>DNI</u>, Nombre, Comision)</td></tr></table>
<p>En el <b>DED</b> la primera opción se ve como líneas <b>continuas 1 a 0..1</b> desde Empleado a cada subtipo (el DNI del subtipo es PK y FK). En el DED no se dibuja el triángulo.</p>
<h4>Cómo se dibuja según dónde</h4>
<table class="th-tab"><tr><th></th><th>Exclusiva</th><th>Total</th></tr>
<tr><td>Apuntes (triángulo)</td><td>Arco debajo del triángulo (sin arco: inclusiva)</td><td>Círculo encima del triángulo (sin círculo: parcial)</td></tr>
<tr><td>ERDPlus (círculo)</td><td><b>d</b> = <i>Disjointed</i> (con <b>o</b> = <i>Overlapping</i>, inclusiva)</td><td>Doble línea del supertipo al círculo</td></tr></table>
<p>Las cuatro combinaciones: <b>exclusiva total</b>, <b>exclusiva parcial</b>, <b>inclusiva total</b> e <b>inclusiva parcial</b>. Total: al dar de alta un empleado hay que rellenar ya los datos de su puesto. Parcial: se puede dejar para después.</p>
<p>ERDPlus añade al supertipo un campo que dice de qué subtipo es (por ejemplo <b>Puesto</b>). Con la posibilidad 2 («solo los subtipos») y jerarquía parcial, las columnas propias de cada subtipo admiten NULL.</p>
<p class="th-tip">En la app: en <b>Ajustes › Lienzo › Símbolo de la jerarquía</b> eliges triángulo ES, el de los apuntes o el de ERDPlus. En la jerarquía, «Campo que dice el tipo» añade la columna Puesto al supertipo.</p>
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
<tr><td>Relación <b>1:N</b></td><td>La PK de la entidad que tiene muchas pasa como <b>FK</b> a la que participa como mucho 1 vez (la que tiene (x,1) a su lado). Si esa participación tiene mínimo 0, la FK puede ser NULL.</td></tr>
<tr><td>Relación <b>1:1</b></td><td>La FK va a una de las dos tablas (mejor a la que participa de forma obligatoria) y se marca <b>UNIQUE</b>.</td></tr>
<tr><td>Relación <b>N:M</b></td><td>Tabla nueva con las PK de las dos entidades como FK; juntas forman su PK. Los atributos de la relación van aquí.</td></tr>
<tr><td>Entidad <b>débil</b></td><td>Su tabla lleva la PK de la fuerte como FK, y su PK es esa FK + la clave parcial.</td></tr>
<tr><td>Relación <b>reflexiva</b></td><td>Igual que su tipo (1:N o N:M), pero la FK se renombra (CodJefe → Empleado).</td></tr>
<tr><td>Relación <b>ternaria</b></td><td>Tabla nueva con las PK de las tres entidades.</td></tr></table>`},

{id:'varias',t:'Varias relaciones entre las mismas entidades',k:'varias relaciones mismas entidades dos fk misma tabla salida llegada rol fk compuesta una linea',h:`
<p>Dos entidades pueden estar unidas por <b>más de una relación</b>, cada una con su significado. Ejemplo de los caminos: una <i>Etapa</i> <b>sale de</b> una <i>Localidad</i>, <b>llega a</b> otra y <b>pasa por</b> varias.</p>
${thER('Etapa','salida','Localidad',{ca:'(1,1)',cb:'(0,N)'})}${thER('Etapa','llegada','Localidad',{ca:'(1,1)',cb:'(0,N)'})}
<p>Cada relación <b>se pasa por separado</b>, con su regla de siempre:</p>
<table class="th-tab"><tr><th>Relación</th><th>Tipo</th><th>En las tablas</th></tr>
<tr><td>salida</td><td>1:N</td><td>Una FK en <i>Etapa</i>: <b>CodLoc_salida</b> → Localidad</td></tr>
<tr><td>llegada</td><td>1:N</td><td>Otra FK en <i>Etapa</i>: <b>CodLoc_llegada</b> → Localidad</td></tr>
<tr><td>recorrido</td><td>N:M</td><td>Tabla <i>recorrido</i>(<u>CodCam, Numero, CodLoc</u>)</td></tr></table>
<div class="th-code">Etapa(<u>CodCam, Numero</u>, NumKm, <i>CodLoc_salida</i>, <i>CodLoc_llegada</i>)<br>recorrido(<u><i>CodCam, Numero</i>, <i>CodLoc</i></u>)</div>
<h4>Nombres de las FK</h4><p>Las dos FK no pueden llamarse igual. Ponles el nombre del <b>papel</b> que hacen (salida, llegada, jefe, origen…). La app lo hace sola al pasar a tablas: la PK del padre + el nombre de la relación.</p>
<h4>En el DED</h4><ul><li>Salen <b>dos líneas</b> entre Etapa y Localidad: una por cada FK.</li>
<li>Una <b>FK compuesta</b> (<i>CodCam + Numero</i> hacia Etapa) es <b>una sola</b> clave ajena: se dibuja con <b>una</b> línea, aunque tenga dos columnas.</li></ul>
<p class="th-tip">En la app: pincha cada línea del DED para ver qué columnas forman esa FK y cambiar sus cardinalidades por separado.</p>`},

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

{id:'herramientas',t:'ERDPlus y MySQL Workbench paso a paso',k:'erdplus workbench herramienta case exportar importar diagrama referencial forward engineer identificadora no identificadora',h:`
<p>En clase el E-R se pasa a <b>ERDPlus</b> y el DED a <b>MySQL Workbench</b>. La app trabaja con los dos.</p>
<h4>ERDPlus (E-R y diagrama referencial)</h4><ol>
<li>En la pestaña E-R pulsa <b>ERDPlus › Exportar</b>: se guarda un archivo que se abre en erdplus.com.</li>
<li>En ERDPlus, cada atributo tiene sus casillas: <i>Unique</i> (clave, sale subrayado), <i>Multivalued</i>, <i>Optional</i>, <i>Composite</i>, <i>Derived</i>.</li>
<li>En cada relación, cada entidad tiene <i>Cardinality</i> (One / Many) y <i>Participation</i> (Mandatory / Optional): es el (mín,máx) de la app.</li>
<li>Para el <b>diagrama referencial</b>, en ERDPlus conviertes el E-R a esquema relacional (<i>Convert to Relational Schema</i>): salen las tablas con la PK subrayada y una flecha por cada FK.</li>
<li>Para volver a la app: guarda el diagrama de ERDPlus y en la app pulsa <b>ERDPlus › Importar</b>.</li></ol>
<p class="th-tip">ERDPlus no tiene marca de «único» ni triángulo de jerarquía. La app exporta un atributo único como «DNI (U)» y cada subtipo como una relación 1:1 llamada «es». Al importar lo vuelve a montar.</p>
<h4>MySQL Workbench (DED y SQL)</h4><ol>
<li><i>File › New Model</i> y luego <i>Add Diagram</i>. Cada tabla se crea con la herramienta de tabla y se le ponen columnas y tipos.</li>
<li>Las relaciones se hacen con las herramientas de la izquierda:
<table class="th-tab"><tr><th>Herramienta</th><th>Línea</th><th>Cuándo</th></tr>
<tr><td>1:n identificadora</td><td>continua</td><td>La FK entra en la PK del hijo: entidad débil, tablas de N:M.</td></tr>
<tr><td>1:n no identificadora</td><td>discontinua</td><td>La FK es una columna normal: relación 1:N.</td></tr>
<tr><td>1:1 identificadora</td><td>continua</td><td>Subtipo de una jerarquía: su PK es la FK.</td></tr>
<tr><td>1:1 no identificadora</td><td>discontinua</td><td>Relación 1:1 (la FK queda UNIQUE).</td></tr>
<tr><td>n:m identificadora</td><td>continua</td><td>Crea sola la tabla intermedia.</td></tr></table></li>
<li>Para sacar el SQL: <i>Database › Forward Engineer</i> (crea la base de datos) o <i>File › Export › Forward Engineer SQL CREATE Script</i> (guarda el .sql).</li>
<li>Para llevarlo a la app: en la pestaña SQL, <b>Importar .mwb / .sql</b>. Se dibujan el DED y el relacional.</li></ol>
<p class="th-tip">Al revés también: en la app, «Pasar al SQL» y <b>Exportar .sql</b>. Ese archivo se abre en Workbench con <i>File › Open SQL Script</i> y se ejecuta, o se importa con <i>Database › Reverse Engineer</i> para tener el diagrama.</p>`},

{id:'errores',t:'Errores típicos',k:'errores fallos comunes consejos revisar',h:`
<ul class="th-list"><li><b>Poner la FK en el lado equivocado</b> de una 1:N: siempre va en el lado de los «muchos».</li>
<li><b>Olvidar la tabla intermedia</b> de una N:M: dos tablas no se pueden unir N:M directamente.</li>
<li><b>Atributos en el sitio equivocado:</b> la nota de una matrícula va en la relación, no en Alumno.</li>
<li><b>Guardar datos derivados</b> (edad, total) cuando se pueden calcular.</li>
<li><b>Claves que cambian o se repiten</b> (el nombre) en vez de un código o el DNI.</li>
<li><b>Leer al revés la cardinalidad:</b> la pareja junto a una entidad dice cuántas veces participa esa entidad (cada provincia pertenece a (1,1) comunidad).</li>
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
{id:'diseno',t:'The three phases: conceptual, logical and physical',k:'design conceptual logical physical chen refinement domain entity rules redundancy',h:`
<table class="th-tab"><tr><th>Phase</th><th>What you do</th><th>In class</th></tr>
<tr><td><b>1. Conceptual design</b></td><td>Represent the company's information without thinking about any program.</td><td>Extended E-R model (paper and ERDPlus).</td></tr>
<tr><td><b>2. Logical design</b></td><td>Turn the E-R into the DBMS model (relational): tables, PK and FK.</td><td>DSD (Workbench) or referential diagram (ERDPlus).</td></tr>
<tr><td><b>3. Physical design</b></td><td>Actually create the database in a specific DBMS.</td><td>SQL script (CREATE DATABASE, CREATE TABLE…).</td></tr></table>
<h4>Rules every entity follows</h4><ul><li>It exists on its own.</li><li>Each instance can be told apart from the others (so it has an identifier).</li><li>All its instances have the same attributes.</li></ul>
<p><b>Domain</b>: the set of values an attribute can take (for example marks from 0 to 10). It exists even if there is no entity.</p>
<h4>Removing redundancy</h4><ul><li>An attribute computed from others is removed or marked as derived.</li><li>A relationship you can «travel» another way is redundant: remove it, checking you can still get from one entity to the other.</li></ul>
<h4>Chen's refinement (E-R → tables)</h4>
<table class="th-tab"><tr><th>In the E-R</th><th>Tables</th></tr>
<tr><td>1:1</td><td>Depends on the minimum cardinalities: the FK goes to the side that takes part compulsorily (and is UNIQUE).</td></tr>
<tr><td>1:N</td><td>A(<u>a</u>, …) · B(<u>b</u>, …, <i>a</i>)</td></tr>
<tr><td>1:N with weak B (identification)</td><td>A(<u>a</u>, …) · B(<u><i>a</i>, b</u>, …)</td></tr>
<tr><td>N:M</td><td>C(<u><i>a</i>, <i>b</i></u>, …) <b>or</b> C(<u>c</u>, <i>a</i>, <i>b</i>, …) with its own key</td></tr>
<tr><td>N-ary</td><td>D(<u><i>a</i>, <i>b</i>, <i>c</i></u>, …) or D(<u>d</u>, <i>a</i>, <i>b</i>, <i>c</i>, …)</td></tr></table>
<p class="th-tip">In the app: in an N:M (or ternary, or associative) type the name in «Own key of its table», for example <i>CodDetFac</i>. The table gets that PK and the FKs become normal columns.</p>`},
{id:'boceto',t:'Sketch: think before the E-R',k:'sketch draft entities attributes composite relationship start',h:`
<p>The <b>Sketch</b> tab (between Brief and E-R) is for thinking about the exercise before drawing the full E-R: you type and the drawing appears by itself, with each entity and its attributes.</p>
<ol><li>Read the brief and write above <b>one entity per line</b> with its attributes: <code>Student; DNI, Name, BirthDate</code>.</li>
<li>A <b>composite</b> attribute has its parts in brackets: <code>Student; DNI, Address (Street, Number, ZIP)</code>.</li>
<li>Attributes of a <b>relationship</b> are written with both entities joined by a dash: <code>Student-Course; Grade</code>. They are not drawn here, but they appear in the E-R.</li>
<li><b>Click an attribute</b> in the drawing (or in the right panel) to mark it as primary key, unique, optional, multivalued or derived.</li>
<li>Click <b>To the E-R</b>: the entities are created with their attributes and types, composites with their parts and one relationship for each <code>A-B</code> line. There you add the cardinalities and each relationship's verb.</li></ol>
<p class="th-tip">If an entity is not related to any other, maybe it is not needed, or it is an attribute of another one.</p>`},
{id:'entidades',t:'Entities',k:'entity strong weak rectangle double',h:`
<p>An <b>entity</b> is something we want to store information about and that can be told apart from the rest: a student, a book, an order.</p>
<div class="th-grid"><div class="th-card">${TH(GL.ent,'Entity (strong)')}<p>Rectangle. It has its own primary key: it identifies itself. Example: <i>Student</i> is identified by their ID number.</p></div>
<div class="th-card">${TH(GL.weak,'Weak entity')}<p>Double rectangle. <b>It cannot exist without</b> another entity (the strong one). If it also <b>cannot be identified on its own</b>, it is joined with an <b>identifying relationship</b> (double diamond) and has a <b>partial key</b> (dashed underline). See «Weak entity: existence and identification».</p></div></div>
<div class="th-ex"><b>Weak example:</b> <i>Room 12</i> exists in many hotels. You only know which one it is if you say which hotel. Room is weak of Hotel, and its full key is (HotelCode, RoomNumber).</div>
<div class="th-tip">Ask yourself: «can I tell which one it is without saying whose it is?». If not, it is weak.</div>`},
{id:'debil',t:'Weak entity: existence and identification',k:'weak existence identification dependency cascade on delete cascade weak relationship regular double diamond entity types attribute types relationship types calculated',h:`
<p>First, a quick review of the <b>types</b> involved:</p>
<div class="th-grid"><div class="th-card"><h4>Entity types</h4><p><b>Regular</b> (strong): exists on its own. <b>Weak</b>: only makes sense if another one exists. <b>Associative</b>: an N:M relationship we treat as an entity to relate it to another one. <b>Supertype / subtype</b>: hierarchies (ISA).</p></div>
<div class="th-card"><h4>Attribute types</h4><p>Primary key · optional or mandatory · derived (calculated) or stored · multivalued or single-valued · composite or simple. The <b>FK</b> does not exist in the E-R: it appears when converting to tables. A <b>calculated</b> one has no special notation: you decide whether to store it (if you do, it must be kept up to date, for example with a trigger).</p></div>
<div class="th-card"><h4>Relationship types</h4><p><b>Regular</b>: joins two regular entities. <b>Weak</b>: joins a regular entity with a weak one. It can be of two kinds: with <b>existence dependency</b> or with <b>identification dependency</b>.</p></div></div>
<h4>The idea in one sentence</h4>
<p>An entity is <b>weak</b> when its rows <b>cannot exist without</b> a row of another entity. If the «parent» is deleted, its «children» must be deleted too. It is almost always a 1:N relationship.</p>
<p>The question that decides which kind it is: <b>can the child be recognised on its own, or only by saying whose it is?</b></p>
<h4>Example: buildings and classrooms</h4>
<div class="th-ex">A school stores its <b>buildings</b> (code, name) and its <b>classrooms</b> (number, capacity). A classroom makes no sense if the building disappears.</div>
<h4>1) Existence dependency</h4>
<p>Each classroom has a <b>number that is unique in the whole school</b> (101, 102, 205…). It can be recognised on its own, but it cannot exist without its building.</p>
${thER('Building','has','Classroom',{weak:1,ca:'(0,N)',cb:'(1,1)'})}
<ul><li>Classroom is drawn as a <b>double rectangle</b>; the diamond is <b>normal</b>.</li><li>It becomes tables like a normal 1:N: the FK <code>BuildCode</code> goes in Classroom, <b>outside</b> the primary key.</li><li>The only change: deleting a building deletes its classrooms → <code>ON DELETE CASCADE</code>.</li></ul>
<pre class="th-code">CREATE TABLE Classroom (<br>&nbsp;&nbsp;RoomNum INT NOT NULL,<br>&nbsp;&nbsp;Capacity TINYINT NOT NULL,<br>&nbsp;&nbsp;BuildCode INT NOT NULL,<br>&nbsp;&nbsp;PRIMARY KEY (RoomNum),<br>&nbsp;&nbsp;FOREIGN KEY (BuildCode) REFERENCES Building (BuildCode)<br>&nbsp;&nbsp;&nbsp;&nbsp;ON UPDATE NO ACTION ON DELETE CASCADE<br>);</pre>
<h4>2) Identification dependency</h4>
<p>Now classrooms are numbered <b>inside each building</b>: building A has its room 1, building B also has a room 1… «Room 1» means nothing unless you say which building. It is identified by <b>the building code + its number</b>.</p>
${thER('Building','has','Classroom',{weak:1,id:1,ca:'(0,N)',cb:'(1,1)'})}
<ul><li>Double rectangle plus a <b>double diamond</b> (identifying relationship). The room number is a <b>partial key</b> (dashed underline).</li><li>In the tables the FK <b>is part of the primary key</b>: <code>PRIMARY KEY (BuildCode, RoomNum)</code>.</li><li>And also <code>ON DELETE CASCADE</code>.</li></ul>
<pre class="th-code">CREATE TABLE Classroom (<br>&nbsp;&nbsp;BuildCode INT NOT NULL,<br>&nbsp;&nbsp;RoomNum INT NOT NULL,<br>&nbsp;&nbsp;Capacity TINYINT NOT NULL,<br>&nbsp;&nbsp;PRIMARY KEY (BuildCode, RoomNum),<br>&nbsp;&nbsp;FOREIGN KEY (BuildCode) REFERENCES Building (BuildCode)<br>&nbsp;&nbsp;&nbsp;&nbsp;ON UPDATE NO ACTION ON DELETE CASCADE<br>);</pre>
<table class="th-tab"><tr><th></th><th>Existence</th><th>Identification</th></tr>
<tr><td>The child is recognised…</td><td>on its own (unique number)</td><td>only with the parent</td></tr>
<tr><td>Drawing</td><td>double rectangle + normal diamond</td><td>double rectangle + double diamond + partial key</td></tr>
<tr><td>FK in the child table</td><td>outside the PK, NOT NULL</td><td>inside the PK</td></tr>
<tr><td>Deleting the parent</td><td colspan="2"><code>ON DELETE CASCADE</code>: its children are deleted</td></tr></table>
<h4>What ON DELETE CASCADE does</h4>
<p>With sample data: if building 1 has rooms 1 and 2 and you run <code>DELETE FROM Building WHERE BuildCode = 1;</code>, the database deletes those two rooms by itself. Without CASCADE that DELETE would fail because some rooms point to the building. <code>ON UPDATE NO ACTION</code> means the code of a building that has rooms cannot be changed. In Oracle you only write <code>ON DELETE CASCADE</code>.</p>
<div class="th-tip"><b>In the app:</b> make the entity <b>weak</b> (double rectangle). If the relationship is normal, converting to tables gives an existence dependency; if you mark it as <b>identifying</b> (double diamond) and its key as a <b>partial key</b>, you get an identification dependency. In both cases the SQL has the CASCADE. In the relational model or the DSD, click the line of an FK to change it under «When a row of … is deleted».</div>`},
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
{id:'derivado',t:'Derived attribute and calculated attribute',k:'derived calculated stored trigger age birth date borrowed copies',h:`
<table class="th-tab"><tr><th></th><th>Derived</th><th>Calculated</th></tr>
<tr><td>Can be obtained from other data</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Is it stored in the table?</td><td><b>Never</b>: computed with a query when needed</td><td><b>You decide</b>: stored if computing it is costly or it is used constantly</td></tr>
<tr><td>Drawing</td><td>Dashed oval</td><td>Normal oval (it is a stored attribute)</td></tr>
<tr><td>If stored</td><td>—</td><td>It must <b>always</b> be kept up to date (for example with a trigger)</td></tr></table>
<h4>Examples</h4><ul><li><b>Age</b> (derived): the birth date is stored and the age is shown with a query.</li>
<li><b>Borrowed copies</b> of a book (calculated and stored): add 1 on each loan so you don't go through thousands of loans every time.</li>
<li><b>Occupied offices</b> in a building (calculated, not stored): it can be counted with a query and is rarely needed.</li></ul>
<p class="th-tip">In the app: «Derived» draws the dashed border and is not taken to the tables. A stored calculated attribute is a normal attribute; you can write a note to remember it must be updated.</p>`},
{id:'relaciones',t:'Relationships',k:'relationship diamond binary recursive ternary identifying degree attributes',h:`
<p>A <b>relationship</b> joins entities and is drawn as a diamond with a verb: <i>Student — enrols in — Course</i>.</p>
<div class="th-grid"><div class="th-card">${TH(GL.rel,'Binary')}<p>Joins two entities. The most common one.</p></div>
<div class="th-card">${TH(GL.rel,'Recursive')}<p>Joins an entity with itself: an <i>Employee</i> manages other <i>Employees</i>.</p></div>
<div class="th-card">${TH(GL.rel,'Ternary')}<p>Joins three entities at once, when the data only makes sense with all three: a <i>Doctor</i> prescribes a <i>Medicine</i> to a <i>Patient</i>.</p></div>
<div class="th-card">${TH(GL.idrel,'Identifying')}<p>Double diamond. Joins a weak entity with the strong one that identifies it.</p></div></div>
<h4>Attributes on a relationship</h4><p>If a piece of data belongs to neither entity but to the fact that they are related, it goes on the relationship. Example: the <i>grade</i> belongs not to the student nor to the course, but to <i>that student's enrolment in that course</i>.</p>`},
{id:'tiposrel',t:'Kinds of relationships: regular, weak and exclusive',k:'relationship regular weak existence identification exclusive ship shuttle cascade',h:`
<ul><li><b>Regular</b>: joins two regular entities.</li><li><b>Weak</b>: joins a regular entity with a weak one. Two kinds:</li></ul>
<table class="th-tab"><tr><th></th><th>Existence dependency</th><th>Identification dependency</th></tr>
<tr><td>Meaning</td><td>The shuttle makes no sense without its ship, but it is identified on its own (by its number).</td><td>Also, the shuttle is only identified together with its ship (ship 1 – shuttle 1, ship 2 – shuttle 1…).</td></tr>
<tr><td>Drawing</td><td>Double rectangle and single diamond</td><td>Double rectangle and <b>double diamond</b>; its key is partial (dashed underline)</td></tr>
<tr><td>Table</td><td>Lanzadera(<u>Numero</u>, Capacidad, <i>CodNave</i>)</td><td>Lanzadera(<u><i>CodNave</i>, Numero</u>, Capacidad)</td></tr>
<tr><td>FK</td><td colspan="2"><code>ON UPDATE NO ACTION ON DELETE CASCADE</code>: deleting a ship deletes its shuttles</td></tr></table>
<div class="th-code">CREATE TABLE Lanzadera (<br>&nbsp;&nbsp;CodNave INT NOT NULL,<br>&nbsp;&nbsp;Numero INT NOT NULL,<br>&nbsp;&nbsp;Capacidad TINYINT NOT NULL,<br>&nbsp;&nbsp;PRIMARY KEY (CodNave, Numero),<br>&nbsp;&nbsp;FOREIGN KEY (CodNave) REFERENCES Nave(CodNave)<br>&nbsp;&nbsp;&nbsp;&nbsp;ON UPDATE NO ACTION ON DELETE CASCADE<br>);</div>
<p class="th-tip">In the app: mark the entity as «Weak entity». If its key is its own (normal underline), keep a single diamond: existence dependency. If its key is partial, mark the relationship as «Identifying»: identification dependency.</p>
<h4>Exclusive relationship</h4><p>An entity takes part in <b>one or the other</b> relationship, but not both (for example, a payment is made by a customer <i>or</i> a company). It is drawn with an arc across both lines. In the tables there are two FKs that allow NULL, and only one may have a value (checked with a <code>CHECK</code>).</p>
<h4>By degree (how many entities it joins)</h4><ul><li><b>Binary</b>: join two entities.</li><li><b>N-ary</b>: join N entities, N greater than 2 (ternary is 3). These relationships <b>do not exist in the relational model</b>.</li><li><b>Recursive</b>: join an entity with itself.</li></ul>
<p>The relational model only has <b>recursive and binary</b> relationships. That is why an N-ary becomes a table with the keys of all its entities, and that table is joined to each entity with a binary relationship.</p>
<p class="th-tip">In the app: a recursive relationship has both lines to the same entity. For a ternary, join a third entity to the relationship with Shift + click.</p>`},
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
<h4>Example: Empleado (DNI, Nombre) with Directivo (Departamento), Tecnico (Maquina) and Comercial (Comision)</h4>
<table class="th-tab"><tr><th>Option</th><th>Tables</th></tr>
<tr><td>One table per entity</td><td>Empleado(<u>DNI</u>, Nombre)<br>Directivo(<u><i>DNI</i></u>, Departamento)<br>Tecnico(<u><i>DNI</i></u>, Maquina)<br>Comercial(<u><i>DNI</i></u>, Comision)</td></tr>
<tr><td>Everything in the supertype</td><td>Empleado(<u>DNI</u>, Nombre, Puesto, Departamento (O), Maquina (O), Comision (O))</td></tr>
<tr><td>Only the subtypes</td><td>Directivo(<u>DNI</u>, Nombre, Departamento)<br>Tecnico(<u>DNI</u>, Nombre, Maquina)<br>Comercial(<u>DNI</u>, Nombre, Comision)</td></tr></table>
<p>In the <b>DSD</b> the first option shows as <b>solid 1 to 0..1</b> lines from Empleado to each subtype (the subtype's DNI is PK and FK). The triangle is not drawn in the DSD.</p>
<h4>How it is drawn depending on where</h4>
<table class="th-tab"><tr><th></th><th>Exclusive</th><th>Total</th></tr>
<tr><td>Class notes (triangle)</td><td>Arc under the triangle (no arc: inclusive)</td><td>Circle above the triangle (no circle: partial)</td></tr>
<tr><td>ERDPlus (circle)</td><td><b>d</b> = <i>Disjointed</i> (<b>o</b> = <i>Overlapping</i>, inclusive)</td><td>Double line from the supertype to the circle</td></tr></table>
<p>The four combinations: <b>exclusive total</b>, <b>exclusive partial</b>, <b>inclusive total</b> and <b>inclusive partial</b>. Total: when an employee is registered, the data of their job must be filled in. Partial: it can be left for later.</p>
<p>ERDPlus adds a field to the supertype that says which subtype it is (for example <b>Puesto</b>). With option 2 («only the subtypes») and a partial hierarchy, each subtype's own columns allow NULL.</p>
<p class="th-tip">In the app: in <b>Settings › Canvas › Hierarchy symbol</b> choose the ES triangle, the class-notes one or the ERDPlus one. In the hierarchy, «Field that says the type» adds the Puesto column to the supertype.</p>
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
{id:'varias',t:'Several relationships between the same entities',k:'several relationships same entities two fk same table departure arrival role composite fk one line',h:`
<p>Two entities can be joined by <b>more than one relationship</b>, each with its own meaning. In the trails example: a <i>Stage</i> <b>starts at</b> a <i>Town</i>, <b>ends at</b> another and <b>passes through</b> several.</p>
${thER('Etapa','salida','Localidad',{ca:'(1,1)',cb:'(0,N)'})}${thER('Etapa','llegada','Localidad',{ca:'(1,1)',cb:'(0,N)'})}
<p>Each relationship <b>is converted on its own</b>, with the usual rule:</p>
<table class="th-tab"><tr><th>Relationship</th><th>Type</th><th>In the tables</th></tr>
<tr><td>salida</td><td>1:N</td><td>An FK in <i>Etapa</i>: <b>CodLoc_salida</b> → Localidad</td></tr>
<tr><td>llegada</td><td>1:N</td><td>Another FK in <i>Etapa</i>: <b>CodLoc_llegada</b> → Localidad</td></tr>
<tr><td>recorrido</td><td>N:M</td><td>Table <i>recorrido</i>(<u>CodCam, Numero, CodLoc</u>)</td></tr></table>
<div class="th-code">Etapa(<u>CodCam, Numero</u>, NumKm, <i>CodLoc_salida</i>, <i>CodLoc_llegada</i>)<br>recorrido(<u><i>CodCam, Numero</i>, <i>CodLoc</i></u>)</div>
<h4>FK names</h4><p>The two FKs cannot have the same name. Name them after the <b>role</b> they play (departure, arrival, boss, origin…). The app does it when converting to tables: the parent's PK + the relationship name.</p>
<h4>In the DSD</h4><ul><li>There are <b>two lines</b> between Etapa and Localidad: one per FK.</li>
<li>A <b>composite FK</b> (<i>CodCam + Numero</i> to Etapa) is <b>a single</b> foreign key: it is drawn with <b>one</b> line, even though it has two columns.</li></ul>
<p class="th-tip">In the app: click each DSD line to see which columns make up that FK and change its cardinalities separately.</p>`},

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
{id:'herramientas',t:'ERDPlus and MySQL Workbench step by step',k:'erdplus workbench case tool export import referential diagram forward engineer identifying non-identifying',h:`
<p>In class the E-R goes to <b>ERDPlus</b> and the DSD to <b>MySQL Workbench</b>. The app works with both.</p>
<h4>ERDPlus (E-R and referential diagram)</h4><ol>
<li>In the E-R tab click <b>ERDPlus › Export</b>: you get a file that opens in erdplus.com.</li>
<li>In ERDPlus each attribute has its boxes: <i>Unique</i> (key, underlined), <i>Multivalued</i>, <i>Optional</i>, <i>Composite</i>, <i>Derived</i>.</li>
<li>In each relationship, each entity has <i>Cardinality</i> (One / Many) and <i>Participation</i> (Mandatory / Optional): that is the app's (min,max).</li>
<li>For the <b>referential diagram</b>, convert the E-R to a relational schema in ERDPlus (<i>Convert to Relational Schema</i>): you get the tables with the PK underlined and one arrow per FK.</li>
<li>To come back to the app: save the ERDPlus diagram and click <b>ERDPlus › Import</b> in the app.</li></ol>
<p class="th-tip">ERDPlus has no «unique» mark and no hierarchy triangle. The app exports a unique attribute as «DNI (U)» and each subtype as a 1:1 relationship called «es». On import it rebuilds them.</p>
<h4>MySQL Workbench (DSD and SQL)</h4><ol>
<li><i>File › New Model</i> and then <i>Add Diagram</i>. Create each table with the table tool and add its columns and types.</li>
<li>Relationships are made with the tools on the left:
<table class="th-tab"><tr><th>Tool</th><th>Line</th><th>When</th></tr>
<tr><td>1:n identifying</td><td>solid</td><td>The FK goes into the child's PK: weak entity, N:M tables.</td></tr>
<tr><td>1:n non-identifying</td><td>dashed</td><td>The FK is a normal column: 1:N relationship.</td></tr>
<tr><td>1:1 identifying</td><td>solid</td><td>Subtype of a hierarchy: its PK is the FK.</td></tr>
<tr><td>1:1 non-identifying</td><td>dashed</td><td>1:1 relationship (the FK is UNIQUE).</td></tr>
<tr><td>n:m identifying</td><td>solid</td><td>Creates the junction table by itself.</td></tr></table></li>
<li>To get the SQL: <i>Database › Forward Engineer</i> (creates the database) or <i>File › Export › Forward Engineer SQL CREATE Script</i> (saves the .sql).</li>
<li>To bring it into the app: in the SQL tab, <b>Import .mwb / .sql</b>. The DSD and the relational model are drawn.</li></ol>
<p class="th-tip">The other way too: in the app, «Go to SQL» and <b>Export .sql</b>. Open that file in Workbench with <i>File › Open SQL Script</i> and run it, or import it with <i>Database › Reverse Engineer</i> to get the diagram.</p>`},

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
