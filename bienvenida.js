/* ===================== Bienvenida (3.9) =====================
   Sale una sola vez: la primera vez que se abre la app (sin nada guardado) o al actualizar a la 3.9 desde una anterior.
   Se recuerda en los ajustes (bvDone, que viajan con GitHub) y en este ordenador; las siguientes actualizaciones ya no la enseñan.
   Se puede saltar entera o por partes, y volver a verla desde Ajustes › Acerca de. */
const BV_TOPICS=[
  ['proy','Proyectos y carpetas','folder',`<p>Cada ejercicio es un <b>proyecto</b>: una carpeta dentro de <b>Modelados BDD</b> con su enunciado y todos sus diagramas.</p>
    <ul><li><b>Nuevo proyecto</b> (arriba a la izquierda) y escribe el nombre.</li><li>Agrúpalos en carpetas con el botón de carpeta de «Mis proyectos» y arrástralos dentro.</li>
    <li>Clic derecho sobre un proyecto o carpeta: moverlo a otra carpeta, ponerle icono, abrirlo en el explorador… Duplicar, eliminar o abrir en su propia ventana están arriba, en cada proyecto.</li><li>Se guarda solo mientras trabajas (y con <kbd>Ctrl</kbd>+<kbd>S</kbd>). Abajo ves si está todo guardado.</li></ul>`],
  ['enun','Enunciado','enun',`<p>Pega el enunciado del ejercicio en la pestaña <b>Enunciado</b>.</p>
    <ul><li>Subraya con colores lo que son entidades, relaciones y atributos: selecciona el texto y pulsa <i>Ent.</i>, <i>Rel.</i> o <i>Atr.</i></li><li>Mientras dibujas, el enunciado puede quedarse en un panel <b>al lado</b> del diagrama.</li></ul>`],
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
    <ul><li><b>Pasar al relacional</b> (desde el E-R) crea las tablas con sus PK y FK; te avisa antes si falta algo, como una entidad sin clave. Luego <b>Pasar al DED</b> y <b>Pasar al SQL</b>.</li><li>En el DED, pincha una relación entre tablas para cambiar sus cardinalidades o pasar la FK al otro lado.</li>
    <li>Relaciona dos tablas con <kbd>Mayús</kbd>+clic. Marca columnas como PK, FK, NN o Único en el panel de la derecha.</li></ul>`],
  ['sql','SQL y Probar','sql',`<p>El código para crear la base de datos.</p>
    <ul><li>Se genera para MySQL, SQL Server, Oracle o PostgreSQL, con datos de ejemplo si quieres. Se puede editar.</li><li>Al revés también: pega un SQL y dibuja las tablas.</li>
    <li>En <b>Probar</b> hay una base de datos de verdad dentro de la app: ejecuta consultas y comprueba que las claves ajenas funcionan.</li></ul>`],
  ['teo','Teoría','teo',`<p>En Inicio y en el botón <b>Teoría</b> de arriba tienes la teoría de clase explicada con dibujos: E-R, relacional, normalización, DED y SQL (crear tablas y consultas).</p>`],
  ['act','Actividades y examen','act',`<ul><li><b>Crear actividad</b> (en Inicio): escribe un enunciado y sale un código para que tus compañeros lo hagáis a la vez, con tiempo y sin ayudas.</li>
    <li><b>Examen</b>: el profesor crea el examen y os da un código de 4 cifras. Entráis con el código y vuestro nombre; empieza y acaba a la vez para todos y se entrega solo. Durante el examen solo se puede usar el examen.</li></ul>`],
  ['comp','Compartir y exportar','share',`<ul><li><b>Exportar › Código</b>: un texto que empieza por <code>MB1-</code> para pasar proyectos (o una actividad) a otra persona. Ella lo pega en <b>Importar código</b>.</li>
    <li><b>Exportar › Ejercicio</b>: una imagen del ejercicio entero. También a ERDPlus y MySQL Workbench.</li><li><b>Comparar</b>: compara tu diagrama con otro (por ejemplo, la solución) y marca lo que cambia.</li></ul>`],
  ['aj','Ajustes y atajos','gear',`<ul><li><b>Ajustes</b> (arriba a la derecha): tema claro u oscuro, color, fondo propio (imagen o vídeo), tamaño de la interfaz, accesibilidad, modo proyector, cómo se lee la cardinalidad, SQL por defecto…</li>
    <li><b>Controles</b>: todos los atajos de teclado. En Ajustes › Atajos puedes cambiarlos.</li><li>La app se actualiza sola y te avisa de las novedades.</li></ul>`]
];
const BV_ICO={folder:'📁',enun:'📄',bo:'✏️',er:'🔷',rel:'🗂️',sql:'🧪',teo:'📚',act:'⏱️',share:'🔗',gear:'⚙️'};
const Bienvenida={step:0,topic:null,
  done(){try{if(localStorage.getItem('mb:bv'))return true;}catch(e){}try{return !!Settings.get().bvDone;}catch(e){return false;}},
  mark(){try{localStorage.setItem('mb:bv','1');}catch(e){}try{Settings.set('bvDone',true);}catch(e){}try{localStorage.setItem('mb:seen',VERSION);}catch(e){}},
  back(){const el=document.getElementById('bv');if(el&&el.style.display==='none'){el.style.display='';this.render();}},
  maybe(){if(this.done())return false;this.open();return true;},
  STEPS:['hola','carpeta','github','ajustes','menu','clase','fin'],
  open(step){this.step=step?this.STEPS.indexOf(step):0;if(this.step<0)this.step=0;this.topic=null;let el=document.getElementById('bv');
    if(!el){el=document.createElement('div');el.id='bv';el.className='bv';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','Bienvenida');document.body.appendChild(el);
      el.addEventListener('click',e=>this.click(e));}
    this.render();},
  close(){this.mark();const el=document.getElementById('bv');if(el)el.remove();try{App.renderMain();}catch(e){}},
  render(){const el=document.getElementById('bv');if(!el)return;const k=this.STEPS[this.step],n=this.STEPS.length;
    const dots=`<div class="bv-dots" aria-hidden="true">${this.STEPS.map((s,i)=>`<span class="${i===this.step?'on':i<this.step?'ok':''}"></span>`).join('')}</div>`;
    const nav=(next='Siguiente',back=true)=>`<div class="bv-nav">${back&&this.step>0?'<button class="ebtn" data-bv="back">Atrás</button>':'<span></span>'}${dots}<button class="ebtn pri" data-bv="next">${next}</button></div>`;
    let h='';
    if(k==='hola')h=`<div class="bv-hero"><div class="bv-brand"><span class="bv-logo" aria-hidden="true"><svg width="44" height="44" viewBox="0 0 44 44"><rect x="3" y="12" width="15" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M18 17.5h6" stroke="currentColor" stroke-width="2.2"/><path d="M24 17.5l7-6 7 6-7 6z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="10.5" cy="33" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10.5 23v6" stroke="currentColor" stroke-width="2"/></svg></span><span class="bv-co">Alegon's Tek</span></div>
        <p class="bv-pre">Alegon's Tek presenta</p><h1>Modelado Bases</h1><p class="bv-lead">El programa para hacer los ejercicios de bases de datos de 1º DAW: del enunciado al E-R, de ahí a las tablas, el DED y el SQL.</p>
        <p>Te enseño cómo funciona en un par de minutos. Todo es opcional: puedes saltar cualquier paso o todo.</p></div>
        <div class="bv-nav"><button class="ebtn" data-bv="skip">Saltar la bienvenida</button>${dots}<button class="ebtn pri" data-bv="next">Empezar</button></div>`;
    else if(k==='carpeta'){const b=App.base;h=`<span class="bv-step">Paso 1 de 3 · opcional</span><h2>¿Dónde se guardan tus proyectos?</h2>
        <p>La app crea una carpeta llamada <b>Modelados BDD</b> y guarda ahí cada proyecto. Puede estar en Documentos, en el Escritorio o en un USB.</p>
        ${b?`<p class="bv-ok">✓ Ya la tienes en <code>${esc(b)}</code></p><div class="row"><button class="ebtn" data-bv="folder-change">Cambiar de sitio…</button></div>`
          :`<div class="row"><button class="ebtn pri" data-bv="folder-choose">Elegir dónde…</button><button class="ebtn" data-bv="folder-default">Usar Documentos</button></div><p class="tnote">Si no eliges ahora, te lo preguntará al cerrar la bienvenida.</p>`}
        ${nav()}`;}
    else if(k==='github'){const on=typeof GH!=='undefined'&&GH.on&&GH.on();h=`<span class="bv-step">Paso 2 de 3 · opcional</span><h2>Tus proyectos en todos tus ordenadores</h2>
        <p>Con <b>GitHub</b> tus proyectos y tu progreso se guardan también en internet: los tienes en casa y en clase, y no se pierden aunque se rompa el ordenador.</p>
        ${on?`<p class="bv-ok">✓ GitHub ya está conectado.</p>`:`<ol class="bv-ol"><li>Crea una cuenta gratis en <b>github.com</b> y un repositorio <b>privado</b> vacío (por ejemplo <code>modelados-bdd</code>).</li><li>Instala <b>Git</b> desde <b>git-scm.com</b> con las opciones normales.</li><li>Pulsa el botón de abajo, pega la dirección del repositorio y conecta.</li></ol>
        <div class="row"><button class="ebtn pri" data-bv="gh">Configurar GitHub ahora</button></div><p class="tnote">También puedes hacerlo cuando quieras en Ajustes › GitHub.</p>`}${nav()}`;}
    else if(k==='ajustes'){const c=Settings.get(),th=(()=>{try{return localStorage.getItem('mb:theme')||'auto';}catch(e){return 'auto';}})();
      const seg=(key,opts,cur)=>`<div class="seg">${opts.map(([v,l])=>`<button class="segb" data-bvset="${key}" data-v="${v}" aria-pressed="${String(cur)===String(v)}">${l}</button>`).join('')}</div>`;
      h=`<span class="bv-step">Paso 3 de 3 · opcional</span><h2>A tu gusto</h2><p>Lo básico. Todo lo demás está en Ajustes.</p>
        <div class="bv-set"><div><b>Tema</b><div class="seg">${[['light','Claro'],['dark','Oscuro'],['auto','Automático']].map(([v,l])=>`<button class="segb" data-theme-set="${v}" aria-pressed="${th===v}">${l}</button>`).join('')}</div></div>
          <div><b>Tamaño de letras y botones</b>${seg('uiScale',[[90,'90 %'],[100,'100 %'],[110,'110 %'],[125,'125 %'],[150,'150 %']],c.uiScale)}</div>
          <div><b>Al abrir la app</b>${seg('startScreen',[['home','Inicio'],['last','Último proyecto']],c.startScreen)}</div>
          <div><b>Cómo se lee la cardinalidad del E-R</b><small>Como en clase: el par junto a cada entidad dice cuántas veces participa ella.</small>${seg('cardMode',[['part','Junto a la entidad (como en clase)'],['otro','Al otro lado']],c.cardMode)}</div>
          <div><b>SQL por defecto</b>${seg('sqlDialect',[['mysql','MySQL'],['sqlserver','SQL Server'],['oracle','Oracle'],['postgres','PostgreSQL']],c.sqlDialect)}</div></div>${nav()}`;}
    else if(k==='menu'){const t=this.topic&&BV_TOPICS.find(x=>x[0]===this.topic);
      if(t){const i=BV_TOPICS.indexOf(t);h=`<span class="bv-step">Cómo funciona · ${i+1} de ${BV_TOPICS.length}</span><h2><span class="bv-ti" aria-hidden="true">${BV_ICO[t[2]]}</span> ${t[1]}</h2><div class="bv-txt">${t[3]}</div>
          <div class="bv-nav"><button class="ebtn" data-bv="menu">Volver al menú</button>${dots}<button class="ebtn pri" data-bv="${i<BV_TOPICS.length-1?'topic-next':'next'}">${i<BV_TOPICS.length-1?'Siguiente tema':'Continuar'}</button></div>`;}
      else h=`<h2>Cómo funciona</h2><p>Elige lo que quieras ver, o pulsa «Verlo todo» para ir tema por tema. Si ya lo conoces, «Saltar».</p>
        <div class="bv-grid">${BV_TOPICS.map(t=>`<button class="bv-card${(this.seen||new Set()).has(t[0])?' seen':''}" data-bvt="${t[0]}"><span class="bv-ti" aria-hidden="true">${BV_ICO[t[2]]}</span><b>${t[1]}</b></button>`).join('')}</div>
        <div class="bv-nav"><button class="ebtn" data-bv="back">Atrás</button>${dots}<span class="row"><button class="ebtn" data-bv="next">Saltar</button><button class="ebtn pri" data-bvt="${BV_TOPICS[0][0]}">Verlo todo</button></span></div>`;}
    else if(k==='clase')h=`<h2>🏆 La clasificación de la clase</h2><p>En la app hay una <b>clasificación de 1º DAW</b> con el nivel, la racha y los récords de todos. Funciona con un repositorio de GitHub compartido (<code>alegon-cpu/Clasificiacion-BDD</code>), así que necesitas:</p>
        <ol class="bv-ol"><li><b>Una cuenta de GitHub</b> (github.com, gratis). Apunta tu nombre de usuario.</li>
          <li><b>Git instalado</b> en el ordenador (git-scm.com, con las opciones normales). Es lo que usa la app para hablar con GitHub.</li>
          <li><b>Pide permiso</b>: pásale tu usuario de GitHub a <b>alegon-cpu</b> para que te añada al repositorio de la clasificación.</li>
          <li><b>Acepta la invitación</b>: te llega un correo de GitHub («invited you to collaborate»). Pulsa «Accept invitation».</li>
          <li>La primera vez que la app se conecte, se abre una ventana de GitHub para <b>iniciar sesión</b>: entra con tu cuenta y queda recordado.</li></ol>
        <p>Después eliges tu nombre de jugador (el que ven tus compañeros) y tu puntuación se sube sola. Mientras no tengas permiso, puedes ver la clasificación de los demás.</p>${nav()}`;
    else if(k==='fin')h=`<div class="bv-hero"><h2>¡Listo!</h2><p class="bv-lead">Ya puedes empezar. Si quieres volver a ver esto, está en Ajustes › Acerca de.</p></div>
        <div class="bv-nav"><button class="ebtn" data-bv="back">Atrás</button>${dots}<span class="row"><button class="ebtn" data-bv="close">Ir a Inicio</button><button class="ebtn pri" data-bv="newproj">Crear mi primer proyecto</button></span></div>`;
    el.innerHTML=`<div class="bv-card-main bv-${k}">${k!=='hola'&&k!=='fin'?'<button class="bv-x" data-bv="skip" title="Saltar la bienvenida" aria-label="Saltar la bienvenida">✕</button>':''}${h}</div>`;
    const f=el.querySelector('.ebtn.pri');if(f)try{f.focus({preventScroll:true});}catch(e){}},
  async click(e){const b=e.target.closest('[data-bv],[data-bvt],[data-bvset]');if(!b)return;
    if(b.dataset.bvset){const v=b.dataset.v,k=b.dataset.bvset;Settings.set(k,/^\d+$/.test(v)?+v:v);this.render();return;}
    if(b.dataset.bvt){this.topic=b.dataset.bvt;(this.seen=this.seen||new Set()).add(this.topic);this.render();return;}
    const a=b.dataset.bv,go=d=>{this.step=Math.max(0,Math.min(this.STEPS.length-1,this.step+d));this.topic=null;this.render();};
    if(a==='next')return go(1);
    if(a==='back'){if(this.topic){this.topic=null;this.render();return;}return go(-1);}
    if(a==='menu'){this.topic=null;this.render();return;}
    if(a==='topic-next'){const i=BV_TOPICS.findIndex(t=>t[0]===this.topic);this.topic=BV_TOPICS[i+1][0];this.seen.add(this.topic);this.render();return;}
    if(a==='skip'||a==='close'){this.close();if(!App.base)App.showSetup();return;}
    if(a==='folder-choose'||a==='folder-default'){await App.action({dataset:{act:a==='folder-choose'?'setup-choose':'setup-default'}});this.render();return;}
    if(a==='folder-change'){await App.action({dataset:{act:'basechoose'}});this.render();return;}
    // los ajustes se abren encima: la bienvenida se esconde mientras y vuelve al cerrarlos
    if(a==='gh'){const el=document.getElementById('bv');if(el)el.style.display='none';App.showSettings('github');return;}
    if(a==='newproj'){this.close();if(App.base)await App.newProject('');else App.showSetup();return;}}
};
