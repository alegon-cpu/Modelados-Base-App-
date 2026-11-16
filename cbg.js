/* ===================== Fondos personalizados =====================
   Imágenes: se copian a «.fondos» dentro de la carpeta de proyectos, así viajan con GitHub igual que los proyectos y el progreso.
   Vídeos (MP4/WEBM, también los de tipo vídeo de Wallpaper Engine): se quedan solo en este ordenador; no se suben.
   El fondo elegido y su intensidad van en los ajustes (también sincronizados). */
const CBG={_cache:{},list:[],
  isVid(n){return String(n||'').startsWith('v:');},
  async refresh(){try{this.list=await window.api.bgList()||[];}catch(e){this.list=[];}return this.list;},
  async url(n){if(!n)return null;if(this._cache[n])return this._cache[n];try{const u=await window.api.bgRead(n);if(u)this._cache[n]=u;return u;}catch(e){return null;}},
  async apply(){const c=Settings.get(),R=document.documentElement;let el=document.getElementById('cbg');
    const u=c.cbg?await this.url(c.cbg):null;
    if(!u){R.classList.remove('has-cbg');if(el)el.remove();return;}
    if(!el){el=document.createElement('div');el.id='cbg';el.setAttribute('aria-hidden','true');document.body.prepend(el);}
    el.classList.toggle('blur',!!c.cbgBlur);
    if(this.isVid(c.cbg)){el.style.backgroundImage='';let v=el.querySelector('video');if(!v){el.innerHTML='<video muted loop autoplay playsinline disablepictureinpicture></video>';v=el.querySelector('video');}
      if(v.getAttribute('src')!==u){v.src=u;}v.muted=true;v.play().catch(()=>{});}
    else{el.innerHTML='';el.style.backgroundImage=`url("${u}")`;}
    const k=Math.max(10,Math.min(95,+c.cbgStr||45));R.style.setProperty('--cbg-k',(100-k)+'%');R.classList.add('has-cbg');},
  // el vídeo se pausa con la ventana escondida o mientras juegas, para no gastar
  tick(){const v=document.querySelector('#cbg video');if(!v)return;const busy=document.hidden||(typeof Juegos!=='undefined'&&(Juegos._gm||(Juegos._snk&&!Juegos._snk.over)));if(busy&&!v.paused)v.pause();else if(!busy&&v.paused)v.play().catch(()=>{});},
  async add(){try{const r=await window.api.bgAdd();if(!r)return null;await this.refresh();Settings.set('cbg',r.name);if(!r.video&&typeof GH!=='undefined'&&GH.saved)GH.saved();
      toast(r.video?'Vídeo añadido. Se queda solo en este ordenador: no se sube a GitHub.':'Fondo añadido. Se guarda en tu carpeta y se sube a GitHub con lo demás.');return r.name;}
    catch(e){toast(e.message||'No se pudo añadir el archivo.','warn');return null;}},
  async del(n){try{await window.api.bgDel(n);delete this._cache[n];await this.refresh();if(Settings.get().cbg===n)Settings.set('cbg','');if(!this.isVid(n)&&typeof GH!=='undefined'&&GH.saved)GH.saved();}catch(e){toast(e.message,'warn');}},
  // Bloque de ajustes (Apariencia)
  async settingsHTML(){await this.refresh();const c=Settings.get(),cur=c.cbg;
    const thumbs=await Promise.all(this.list.map(async b=>({b,u:await this.url(b.name)})));const missing=cur&&!this.list.some(b=>b.name===cur);
    const it=({b,u})=>`<div class="cbg-it" aria-pressed="${cur===b.name}">${b.video?`<video class="cbg-vid" src="${escA(u||'')}" muted preload="metadata"></video>`:''}<button class="cbg-pick" data-cbg="${escA(b.name)}" ${b.video?'':`style="background-image:url(&quot;${u||''}&quot;)"`} title="${escA(b.file)}"></button>${b.video?'<span class="cbg-badge">🎬 Vídeo · solo este PC</span>':''}<button class="cbg-del" data-cbgdel="${escA(b.name)}" title="Borrar este fondo" aria-label="Borrar ${escA(b.file)}">✕</button></div>`;
    return `<p class="set-g">Fondo personalizado</p><div class="set-row col"><div class="set-lab"><b>Tu propio fondo</b><small>Pon una foto, un dibujo o un vídeo detrás de la app. Las imágenes se guardan en tu carpeta de proyectos (en «.fondos») y se suben a GitHub. Los vídeos se quedan solo en este ordenador.</small></div>
      <div class="cbg-grid"><button class="cbg-it none" data-cbg="" aria-pressed="${!cur}"><span>Sin fondo</span></button>${thumbs.map(it).join('')}
        <button class="cbg-it add" data-cbgadd><span>＋ Añadir…</span><small>Imagen o MP4/WEBM</small></button></div>
      ${missing?`<p class="cbg-note">El fondo elegido${this.isVid(cur)?' es un vídeo que está en otro ordenador':' no está en esta carpeta'}. Elige otro o añádelo aquí.</p>`:''}
      <p class="cbg-note">Wallpaper Engine: sirven los fondos de tipo <b>vídeo</b>. Al pulsar «Añadir», si tienes Steam, se abre su carpeta de fondos: entra en la carpeta de uno y elige el archivo .mp4. Los de tipo escena o web no se pueden usar.</p></div>
      ${cur&&!missing?`<div class="set-row"><div class="set-lab"><b>Cuánto se ve</b><small>Más alto: el fondo se ve más; más bajo: se lee mejor.</small></div><div class="seg">${[[25,'Poco'],[45,'Medio'],[65,'Bastante'],[85,'Mucho']].map(([v,l])=>`<button class="segb" data-setv="cbgStr" data-v="${v}" aria-pressed="${+c.cbgStr===v}">${l}</button>`).join('')}</div></div>
      <label class="chk"><input type="checkbox" data-set="cbgBlur" ${c.cbgBlur?'checked':''}><span class="chk-t">Desenfocar el fondo<small>Queda más suave y se leen mejor los textos.</small></span><span class="sw" aria-hidden="true"></span></label>`:''}`;},
  async onClick(e){const add=e.target.closest('[data-cbgadd]');if(add){await this.add();App.renderSettings();return true;}
    const d=e.target.closest('[data-cbgdel]');if(d){if(!d.dataset.armed){d.dataset.armed='1';d.textContent='¿Borrar?';d.classList.add('armed');setTimeout(()=>{if(d.isConnected){delete d.dataset.armed;d.textContent='✕';d.classList.remove('armed');}},3000);return true;}await this.del(d.dataset.cbgdel);App.renderSettings();return true;}
    const p=e.target.closest('[data-cbg]');if(p){Settings.set('cbg',p.dataset.cbg);App.renderSettings();return true;}return false;}};
setTimeout(()=>{try{CBG.apply();}catch(e){}},200);
document.addEventListener('visibilitychange',()=>CBG.tick());setInterval(()=>CBG.tick(),1000);
