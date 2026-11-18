/* ===================== Bienvenida (3.9) =====================
   Sale una sola vez: la primera vez que se abre la app (sin nada guardado) o al actualizar a la 3.9 desde una anterior.
   Se recuerda en los ajustes (bvDone, que viajan con GitHub) y en este ordenador; las siguientes actualizaciones ya no la enseñan.
   Se puede saltar entera o por partes, y volver a verla desde Ajustes › Acerca de.
   Está escrita en español y en inglés (según el idioma de la app). */
const BV_EN=()=>{try{return LANG()==='en';}catch(e){return false;}};
const BVT=(es,en)=>BV_EN()?en:es;
const BV_TOPICS_ES=[
  ['proy','Proyectos y carpetas','folder',`<p>Cada ejercicio es un <b>proyecto</b>: una carpeta dentro de <b>Modelados BDD</b> con su enunciado y todos sus diagramas.</p>
    <ul><li><b>Nuevo proyecto</b> (arriba a la izquierda) y escribe el nombre.</li><li>Agrúpalos en carpetas con el botón de carpeta de «Mis proyectos» y arrástralos dentro.</li>
    <li>Clic derecho sobre un proyecto o carpeta: moverlo a otra carpeta, ponerle icono, abrirlo en el explorador… Duplicar, eliminar o abrir en su propia ventana están arriba, en cada proyecto.</li><li>Se guarda solo mientras trabajas (y con <kbd>Ctrl</kbd>+<kbd>S</kbd>). Abajo ves si está todo guardado.</li></ul>`],
  ['enun','Enunciado','enun',`<p>Pega el enunciado del ejercicio en la pestaña <b>Enunciado</b>.</p>
    <ul><li>Subraya con rotuladores de colores lo que son entidades, relaciones y atributos: elige uno y arrastra el ratón sobre las palabras.</li><li>Mientras dibujas, el enunciado puede quedarse en un panel <b>al lado</b> del diagrama.</li></ul>`],
  ['bo','Boceto','bo',`<p>Para pensar antes de dibujar: escribe una entidad por línea.</p>
    <pre>Alumno; DNI, Nombre, Telefonos, Direccion (Calle, Numero, CP)
Curso; Codigo, Nombre
Alumno-Curso; Nota</pre>
    <ul><li><code>Direccion (Calle, Numero, CP)</code> es un atributo compuesto: entre paréntesis van sus subatributos.</li><li>La última línea es un atributo de la relación entre Alumno y Curso: no se dibuja, pero sale al pasar al E-R.</li><li>Pincha un atributo en el dibujo para marcar si es clave, multivaluado, derivado…</li><li>La raya entre el texto y el dibujo se arrastra para dar más sitio a uno u otro.</li><li>Cuando lo tengas, <b>Pasar al E-R</b>.</li></ul>`],
  ['er','Modelo E-R','er',`<p>El diagrama entidad-relación de Chen.</p>
    <ul><li>Pulsa <b>Entidad</b>, <b>Relación</b>, <b>Atributo</b> o <b>Jerarquía</b> en la barra de arriba (o arrástralos hasta donde los quieras).</li><li>Une dos cosas con <kbd>Mayús</kbd>+clic, o selecciona dos entidades y pulsa «Crear una relación».</li>
    <li>Pincha una línea para poner la cardinalidad (mínimo y máximo) con preguntas sencillas; el tipo 1:1, 1:N o N:M sale solo. Arrastra la línea para curvarla.</li>
    <li>Clic derecho en un atributo: clave, único, opcional, multivaluado, derivado, compuesto. También entidades débiles, relaciones identificadoras y jerarquías (ISA).</li><li>Rueda del ratón: zoom. Botón derecho arrastrando: moverte por el lienzo.</li></ul>`],
  ['rel','Relacional y DED','rel',`<p>Las tablas.</p>
    <ul><li><b>Pasar al relacional</b> (desde el E-R) crea las tablas con sus PK y FK; te avisa antes si falta algo, como una entidad sin clave. Luego <b>Pasar al DED</b> y <b>Pasar al SQL</b>.</li><li>En el DED, pincha una relación entre tablas para cambiar sus cardinalidades, pasar la FK al otro lado o hacer que se borre en cascada (entidad débil).</li>
    <li>Relaciona dos tablas con <kbd>Mayús</kbd>+clic. Marca columnas como PK, FK, NN o Único en el panel de la derecha.</li></ul>`],
  ['sql','SQL y Probar','sql',`<p>El código para crear la base de datos.</p>
    <ul><li>Se genera para MySQL, SQL Server, Oracle o PostgreSQL, con datos de ejemplo si quieres. Se puede editar.</li><li>Al revés también: pega un SQL y dibuja las tablas.</li>
    <li>En <b>Probar</b> hay una base de datos de verdad dentro de la app: ejecuta consultas y comprueba que las claves ajenas funcionan.</li></ul>`],
  ['teo','Teoría','teo',`<p>En Inicio y en el botón <b>Teoría</b> de arriba tienes la teoría de clase explicada con dibujos: E-R, entidades débiles, relacional, normalización, DED y SQL (crear tablas y consultas).</p>`],
  ['act','Actividades y examen','act',`<ul><li><b>Crear actividad</b> (en Inicio): escribe un enunciado y sale un código para que tus compañeros lo hagáis a la vez, con tiempo y sin ayudas.</li>
    <li><b>Examen</b>: el profesor crea el examen y os da un código de 4 cifras. Entráis con el código y vuestro nombre; empieza y acaba a la vez para todos y se entrega solo. Durante el examen solo se puede usar el examen.</li></ul>`],
  ['comp','Compartir y exportar','share',`<ul><li><b>Exportar › Código</b>: un texto que empieza por <code>MB1-</code> para pasar proyectos (o una actividad) a otra persona. Ella lo pega en <b>Importar código</b>.</li>
    <li><b>Exportar › Ejercicio</b>: una imagen del ejercicio entero. También a ERDPlus y MySQL Workbench.</li><li><b>Comparar</b>: compara tu diagrama con otro (por ejemplo, la solución) y marca lo que cambia.</li></ul>`],
  ['aj','Ajustes y atajos','gear',`<ul><li><b>Ajustes</b> (arriba a la derecha): tema claro u oscuro, color, fondo propio (imagen o vídeo), tamaño de la interfaz, accesibilidad, modo proyector, cómo se lee la cardinalidad, SQL por defecto, idioma…</li>
    <li><b>Controles</b>: todos los atajos de teclado. En Ajustes › Atajos puedes cambiarlos.</li><li>La app se actualiza sola y te avisa de las novedades.</li></ul>`]
];
const BV_TOPICS_EN=[
  ['proy','Projects and folders','folder',`<p>Each exercise is a <b>project</b>: a folder inside <b>Modelados BDD</b> with its brief and all its diagrams.</p>
    <ul><li><b>New project</b> (top left) and type its name.</li><li>Group them in folders with the folder button of «My projects» and drag them inside.</li>
    <li>Right click on a project or folder: move it to another folder, give it an icon, open it in the file explorer… Duplicate, delete or open in its own window are at the top of each project.</li><li>It saves by itself while you work (and with <kbd>Ctrl</kbd>+<kbd>S</kbd>). The bar at the bottom shows if everything is saved.</li></ul>`],
  ['enun','Brief','enun',`<p>Paste the exercise text in the <b>Brief</b> tab.</p>
    <ul><li>Highlight entities, relationships and attributes with coloured markers: pick one and drag the mouse over the words.</li><li>While you draw, the brief can stay in a panel <b>next to</b> the diagram.</li></ul>`],
  ['bo','Sketch','bo',`<p>To think before drawing: write one entity per line.</p>
    <pre>Student; DNI, Name, Phones, Address (Street, Number, ZIP)
Course; Code, Name
Student-Course; Grade</pre>
    <ul><li><code>Address (Street, Number, ZIP)</code> is a composite attribute: its parts go in brackets.</li><li>The last line is an attribute of the relationship between Student and Course: it is not drawn, but it appears when you move to the E-R.</li><li>Click an attribute in the drawing to mark it as key, multivalued, derived…</li><li>Drag the bar between the text and the drawing to give more room to either one.</li><li>When you are done, <b>To the E-R</b>.</li></ul>`],
  ['er','E-R model','er',`<p>Chen's entity-relationship diagram.</p>
    <ul><li>Click <b>Entity</b>, <b>Relationship</b>, <b>Attribute</b> or <b>Hierarchy</b> in the top bar (or drag them where you want them).</li><li>Join two things with <kbd>Shift</kbd>+click, or select two entities and click «Create a relationship».</li>
    <li>Click a line to set the cardinality (minimum and maximum) with simple questions; the type 1:1, 1:N or N:M is worked out for you. Drag the line to bend it.</li>
    <li>Right click an attribute: key, unique, optional, multivalued, derived, composite. Also weak entities, identifying relationships and hierarchies (ISA).</li><li>Mouse wheel: zoom. Right button dragging: move around the canvas.</li></ul>`],
  ['rel','Relational and DSD','rel',`<p>The tables.</p>
    <ul><li><b>To the relational</b> (from the E-R) creates the tables with their PKs and FKs; it warns you first if something is missing, like an entity without a key. Then <b>To the DSD</b> and <b>To the SQL</b>.</li><li>In the DSD, click a relationship between tables to change its cardinalities, move the FK to the other side or make it delete in cascade (weak entity).</li>
    <li>Relate two tables with <kbd>Shift</kbd>+click. Mark columns as PK, FK, NN or Unique in the right panel.</li></ul>`],
  ['sql','SQL and Test','sql',`<p>The code that creates the database.</p>
    <ul><li>It is generated for MySQL, SQL Server, Oracle or PostgreSQL, with sample data if you want. You can edit it.</li><li>The other way round too: paste some SQL and it draws the tables.</li>
    <li>In <b>Test</b> there is a real database inside the app: run queries and check that the foreign keys work.</li></ul>`],
  ['teo','Theory','teo',`<p>On the Home screen and with the <b>Theory</b> button at the top you have the class theory explained with drawings: E-R, weak entities, relational model, normalization, DSD and SQL (creating tables and queries).</p>`],
  ['act','Activities and exam','act',`<ul><li><b>Create activity</b> (on Home): write a brief and you get a code so your classmates can all do it at the same time, with a timer and no help.</li>
    <li><b>Exam</b>: the teacher creates the exam and gives you a 4-digit code. You join with the code and your name; it starts and ends at the same time for everyone and is handed in by itself. During the exam only the exam can be used.</li></ul>`],
  ['comp','Share and export','share',`<ul><li><b>Export › Code</b>: a text starting with <code>MB1-</code> to pass projects (or an activity) to someone else. They paste it in <b>Import code</b>.</li>
    <li><b>Export › Exercise</b>: an image of the whole exercise. Also to ERDPlus and MySQL Workbench.</li><li><b>Compare</b>: compares your diagram with another one (for example, the solution) and marks what changes.</li></ul>`],
  ['aj','Settings and shortcuts','gear',`<ul><li><b>Settings</b> (top right): light or dark theme, colour, your own background (image or video), interface size, accessibility, projector mode, how cardinality is read, default SQL, language…</li>
    <li><b>Controls</b>: all the keyboard shortcuts. You can change them in Settings › Shortcuts.</li><li>The app updates itself and tells you what is new.</li></ul>`]
];
const BV_TOPICS_LIST=()=>BV_EN()?BV_TOPICS_EN:BV_TOPICS_ES;
const BV_TOPICS=BV_TOPICS_ES; // (compatibilidad)
const BV_ICO={folder:'📁',enun:'📄',bo:'✏️',er:'🔷',rel:'🗂️',sql:'🧪',teo:'📚',act:'⏱️',share:'🔗',gear:'⚙️'};
const Bienvenida={step:0,topic:null,
  done(){try{if(localStorage.getItem('mb:bv'))return true;}catch(e){}try{return !!Settings.get().bvDone;}catch(e){return false;}},
  mark(){try{localStorage.setItem('mb:bv','1');}catch(e){}try{Settings.set('bvDone',true);}catch(e){}try{localStorage.setItem('mb:seen',VERSION);}catch(e){}},
  back(){const el=document.getElementById('bv');if(el&&el.style.display==='none'){el.style.display='';this.render();}},
  maybe(){if(this.done())return false;this.open();return true;},
  STEPS:['hola','carpeta','github','ajustes','menu','clase','fin'],
  open(step){this.step=step?this.STEPS.indexOf(step):0;if(this.step<0)this.step=0;this.topic=null;let el=document.getElementById('bv');
    if(!el){el=document.createElement('div');el.id='bv';el.className='bv notr';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');document.body.appendChild(el);
      el.addEventListener('click',e=>this.click(e));}
    el.setAttribute('aria-label',BVT('Bienvenida','Welcome'));this.render();},
  close(){this.mark();const el=document.getElementById('bv');if(el)el.remove();try{App.renderMain();}catch(e){}},
  render(){const el=document.getElementById('bv');if(!el)return;const k=this.STEPS[this.step],T=BVT,TOP=BV_TOPICS_LIST();
    const dots=`<div class="bv-dots" aria-hidden="true">${this.STEPS.map((s,i)=>`<span class="${i===this.step?'on':i<this.step?'ok':''}"></span>`).join('')}</div>`;
    const nav=()=>`<div class="bv-nav">${this.step>0?`<button class="ebtn" data-bv="back">${T('Atrás','Back')}</button>`:'<span></span>'}${dots}<button class="ebtn pri" data-bv="next">${T('Siguiente','Next')}</button></div>`;
    let h='';
    if(k==='hola')h=`<div class="bv-hero"><div class="bv-brand"><span class="bv-logo" aria-hidden="true"><svg width="44" height="44" viewBox="0 0 44 44"><rect x="3" y="12" width="15" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M18 17.5h6" stroke="currentColor" stroke-width="2.2"/><path d="M24 17.5l7-6 7 6-7 6z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="10.5" cy="33" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10.5 23v6" stroke="currentColor" stroke-width="2"/></svg></span><span class="bv-co">Alegon's Tek</span></div>
        <p class="bv-pre">${T('Alegon\'s Tek presenta','Alegon\'s Tek presents')}</p><h1>Modelado Bases</h1><p class="bv-lead">${T('El programa para hacer los ejercicios de bases de datos de 1º DAW: del enunciado al E-R, de ahí a las tablas, el DED y el SQL.','The app for your 1st-year database exercises: from the brief to the E-R, then to the tables, the DSD and the SQL.')}</p>
        <p>${T('Te enseño cómo funciona en un par de minutos. Todo es opcional: puedes saltar cualquier paso o todo.','Let me show you how it works in a couple of minutes. Everything is optional: you can skip any step, or all of it.')}</p></div>
        <div class="bv-nav"><button class="ebtn" data-bv="skip">${T('Saltar la bienvenida','Skip the welcome')}</button>${dots}<button class="ebtn pri" data-bv="next">${T('Empezar','Start')}</button></div>`;
    else if(k==='carpeta'){const b=App.base;h=`<span class="bv-step">${T('Paso 1 de 3 · opcional','Step 1 of 3 · optional')}</span><h2>${T('¿Dónde se guardan tus proyectos?','Where are your projects saved?')}</h2>
        <p>${T('La app crea una carpeta llamada <b>Modelados BDD</b> y guarda ahí cada proyecto. Puede estar en Documentos, en el Escritorio o en un USB.','The app creates a folder called <b>Modelados BDD</b> and saves each project in it. It can be in Documents, on the Desktop or on a USB stick.')}</p>
        ${b?`<p class="bv-ok">✓ ${T('Ya la tienes en','You already have it in')} <code>${esc(b)}</code></p><div class="row"><button class="ebtn" data-bv="folder-change">${T('Cambiar de sitio…','Move it…')}</button></div>`
          :`<div class="row"><button class="ebtn pri" data-bv="folder-choose">${T('Elegir dónde…','Choose where…')}</button><button class="ebtn" data-bv="folder-default">${T('Usar Documentos','Use Documents')}</button></div><p class="tnote">${T('Si no eliges ahora, te lo preguntará al cerrar la bienvenida.','If you do not choose now, you will be asked when the welcome closes.')}</p>`}
        ${nav()}`;}
    else if(k==='github'){const on=typeof GH!=='undefined'&&GH.on&&GH.on();h=`<span class="bv-step">${T('Paso 2 de 3 · opcional','Step 2 of 3 · optional')}</span><h2>${T('Tus proyectos en todos tus ordenadores','Your projects on all your computers')}</h2>
        <p>${T('Con <b>GitHub</b> tus proyectos y tu progreso se guardan también en internet: los tienes en casa y en clase, y no se pierden aunque se rompa el ordenador.','With <b>GitHub</b> your projects and your progress are also saved online: you have them at home and in class, and they are not lost if the computer breaks.')}</p>
        ${on?`<p class="bv-ok">✓ ${T('GitHub ya está conectado.','GitHub is already connected.')}</p>`:`<ol class="bv-ol">${T('<li>Crea una cuenta gratis en <b>github.com</b> y un repositorio <b>privado</b> vacío (por ejemplo <code>modelados-bdd</code>).</li><li>Instala <b>Git</b> desde <b>git-scm.com</b> con las opciones normales.</li><li>Pulsa el botón de abajo, pega la dirección del repositorio y conecta.</li>','<li>Create a free account on <b>github.com</b> and an empty <b>private</b> repository (for example <code>modelados-bdd</code>).</li><li>Install <b>Git</b> from <b>git-scm.com</b> with the default options.</li><li>Click the button below, paste the repository address and connect.</li>')}</ol>
        <div class="row"><button class="ebtn pri" data-bv="gh">${T('Configurar GitHub ahora','Set up GitHub now')}</button></div><p class="tnote">${T('También puedes hacerlo cuando quieras en Ajustes › GitHub.','You can also do it whenever you want in Settings › GitHub.')}</p>`}${nav()}`;}
    else if(k==='ajustes'){const c=Settings.get(),th=(()=>{try{return localStorage.getItem('mb:theme')||'auto';}catch(e){return 'auto';}})();
      const seg=(key,opts,cur)=>`<div class="seg">${opts.map(([v,l])=>`<button class="segb" data-bvset="${key}" data-v="${v}" aria-pressed="${String(cur)===String(v)}">${l}</button>`).join('')}</div>`;
      h=`<span class="bv-step">${T('Paso 3 de 3 · opcional','Step 3 of 3 · optional')}</span><h2>${T('A tu gusto','Your way')}</h2><p>${T('Lo básico. Todo lo demás está en Ajustes.','The basics. Everything else is in Settings.')}</p>
        <div class="bv-set"><div><b>${T('Tema','Theme')}</b><div class="seg">${[['light',T('Claro','Light')],['dark',T('Oscuro','Dark')],['auto',T('Automático','Automatic')]].map(([v,l])=>`<button class="segb" data-theme-set="${v}" aria-pressed="${th===v}">${l}</button>`).join('')}</div></div>
          <div><b>${T('Idioma','Language')}</b>${seg('lang',[['es','Español'],['en','English']],LANG())}</div>
          <div><b>${T('Tamaño de letras y botones','Size of text and buttons')}</b>${seg('uiScale',[[90,'90 %'],[100,'100 %'],[110,'110 %'],[125,'125 %'],[150,'150 %']],c.uiScale)}</div>
          <div><b>${T('Al abrir la app','When the app opens')}</b>${seg('startScreen',[['home',T('Inicio','Home')],['last',T('Último proyecto','Last project')]],c.startScreen)}</div>
          <div><b>${T('Cómo se lee la cardinalidad del E-R','How E-R cardinality is read')}</b><small>${T('Como en clase: el par junto a cada entidad dice cuántas veces participa ella.','As in class: the pair next to each entity says how many times that entity takes part.')}</small>${seg('cardMode',[['part',T('Junto a la entidad (como en clase)','Next to the entity (as in class)')],['otro',T('Al otro lado','On the other side')]],c.cardMode)}</div>
          <div><b>${T('SQL por defecto','Default SQL')}</b>${seg('sqlDialect',[['mysql','MySQL'],['sqlserver','SQL Server'],['oracle','Oracle'],['postgres','PostgreSQL']],c.sqlDialect)}</div></div>${nav()}`;}
    else if(k==='menu'){const t=this.topic&&TOP.find(x=>x[0]===this.topic);
      if(t){const i=TOP.indexOf(t);h=`<span class="bv-step">${T('Cómo funciona','How it works')} · ${i+1} ${T('de','of')} ${TOP.length}</span><h2><span class="bv-ti" aria-hidden="true">${BV_ICO[t[2]]}</span> ${t[1]}</h2><div class="bv-txt">${t[3]}</div>
          <div class="bv-nav"><button class="ebtn" data-bv="menu">${T('Volver al menú','Back to the menu')}</button>${dots}<button class="ebtn pri" data-bv="${i<TOP.length-1?'topic-next':'next'}">${i<TOP.length-1?T('Siguiente tema','Next topic'):T('Continuar','Continue')}</button></div>`;}
      else h=`<h2>${T('Cómo funciona','How it works')}</h2><p>${T('Elige lo que quieras ver, o pulsa «Verlo todo» para ir tema por tema. Si ya lo conoces, «Saltar».','Pick what you want to see, or click «See it all» to go topic by topic. If you already know it, «Skip».')}</p>
        <div class="bv-grid">${TOP.map(t=>`<button class="bv-card${(this.seen||new Set()).has(t[0])?' seen':''}" data-bvt="${t[0]}"><span class="bv-ti" aria-hidden="true">${BV_ICO[t[2]]}</span><b>${t[1]}</b></button>`).join('')}</div>
        <div class="bv-nav"><button class="ebtn" data-bv="back">${T('Atrás','Back')}</button>${dots}<span class="row"><button class="ebtn" data-bv="next">${T('Saltar','Skip')}</button><button class="ebtn pri" data-bvt="${TOP[0][0]}">${T('Verlo todo','See it all')}</button></span></div>`;}
    else if(k==='clase')h=T(`<h2>🏆 La clasificación de la clase</h2><p>En la app hay una <b>clasificación de 1º DAW</b> con el nivel, la racha y los récords de todos. Funciona con un repositorio de GitHub compartido (<code>alegon-cpu/Clasificiacion-BDD</code>), así que necesitas:</p>
        <ol class="bv-ol"><li><b>Una cuenta de GitHub</b> (github.com, gratis). Apunta tu nombre de usuario.</li>
          <li><b>Git instalado</b> en el ordenador (git-scm.com, con las opciones normales). Es lo que usa la app para hablar con GitHub.</li>
          <li><b>Pide permiso</b>: pásale tu usuario de GitHub a <b>alegon-cpu</b> para que te añada al repositorio de la clasificación.</li>
          <li><b>Acepta la invitación</b>: te llega un correo de GitHub («invited you to collaborate»). Pulsa «Accept invitation».</li>
          <li>La primera vez que la app se conecte, se abre una ventana de GitHub para <b>iniciar sesión</b>: entra con tu cuenta y queda recordado.</li></ol>
        <p>Después eliges tu nombre de jugador (el que ven tus compañeros) y tu puntuación se sube sola. Mientras no tengas permiso, puedes ver la clasificación de los demás.</p>`,
        `<h2>🏆 The class leaderboard</h2><p>The app has a <b>1st-year DAW leaderboard</b> with everyone's level, streak and records. It works with a shared GitHub repository (<code>alegon-cpu/Clasificiacion-BDD</code>), so you need:</p>
        <ol class="bv-ol"><li><b>A GitHub account</b> (github.com, free). Write down your username.</li>
          <li><b>Git installed</b> on the computer (git-scm.com, default options). It is what the app uses to talk to GitHub.</li>
          <li><b>Ask for access</b>: give your GitHub username to <b>alegon-cpu</b> so they add you to the leaderboard repository.</li>
          <li><b>Accept the invitation</b>: you get an email from GitHub («invited you to collaborate»). Click «Accept invitation».</li>
          <li>The first time the app connects, a GitHub window opens to <b>sign in</b>: sign in with your account and it is remembered.</li></ol>
        <p>Then you choose your player name (the one your classmates see) and your score is uploaded by itself. Until you have access, you can see everyone else's leaderboard.</p>`)+nav();
    else if(k==='fin')h=`<div class="bv-hero"><h2>${T('¡Listo!','All set!')}</h2><p class="bv-lead">${T('Ya puedes empezar. Si quieres volver a ver esto, está en Ajustes › Acerca de.','You can start now. If you want to see this again, it is in Settings › About.')}</p></div>
        <div class="bv-nav"><button class="ebtn" data-bv="back">${T('Atrás','Back')}</button>${dots}<span class="row"><button class="ebtn" data-bv="close">${T('Ir a Inicio','Go to Home')}</button><button class="ebtn pri" data-bv="newproj">${T('Crear mi primer proyecto','Create my first project')}</button></span></div>`;
    const sk=T('Saltar la bienvenida','Skip the welcome');
    el.innerHTML=`<div class="bv-card-main bv-${k}">${k!=='hola'&&k!=='fin'?`<button class="bv-x" data-bv="skip" title="${sk}" aria-label="${sk}">✕</button>`:''}${h}</div>`;
    const f=el.querySelector('.ebtn.pri');if(f)try{f.focus({preventScroll:true});}catch(e){}},
  async click(e){const b=e.target.closest('[data-bv],[data-bvt],[data-bvset]');if(!b)return;
    if(b.dataset.bvset){const v=b.dataset.v,k=b.dataset.bvset;
      // el idioma se aplica al volver a abrir la ventana: se recarga y la bienvenida sigue donde estaba
      if(k==='lang'){if(v===LANG())return;Settings.set('lang',v);try{sessionStorage.setItem('mb:bvstep',String(this.step));}catch(e){}location.reload();return;}
      Settings.set(k,/^\d+$/.test(v)?+v:v);this.render();return;}
    if(b.dataset.bvt){this.topic=b.dataset.bvt;(this.seen=this.seen||new Set()).add(this.topic);this.render();return;}
    const TOP=BV_TOPICS_LIST(),a=b.dataset.bv,go=d=>{this.step=Math.max(0,Math.min(this.STEPS.length-1,this.step+d));this.topic=null;this.render();};
    if(a==='next')return go(1);
    if(a==='back'){if(this.topic){this.topic=null;this.render();return;}return go(-1);}
    if(a==='menu'){this.topic=null;this.render();return;}
    if(a==='topic-next'){const i=TOP.findIndex(t=>t[0]===this.topic);this.topic=TOP[i+1][0];this.seen.add(this.topic);this.render();return;}
    if(a==='skip'||a==='close'){this.close();if(!App.base)App.showSetup();return;}
    if(a==='folder-choose'||a==='folder-default'){await App.action({dataset:{act:a==='folder-choose'?'setup-choose':'setup-default'}});this.render();return;}
    if(a==='folder-change'){await App.action({dataset:{act:'basechoose'}});this.render();return;}
    // los ajustes se abren encima: la bienvenida se esconde mientras y vuelve al cerrarlos
    if(a==='gh'){const el=document.getElementById('bv');if(el)el.style.display='none';App.showSettings('github');return;}
    if(a==='newproj'){this.close();if(App.base)await App.newProject('');else App.showSetup();return;}}
};
// tras cambiar el idioma desde la bienvenida, se vuelve al mismo paso
(()=>{let s=null;try{s=sessionStorage.getItem('mb:bvstep');sessionStorage.removeItem('mb:bvstep');}catch(e){}if(s!=null)setTimeout(()=>{if(!Bienvenida.done()){if(!document.getElementById('bv'))Bienvenida.open();Bienvenida.step=+s||0;Bienvenida.render();}},1200);})();
