/* ===================== Fondos personalizados =====================
   Las imágenes se copian a «.fondos» dentro de la carpeta de proyectos, así viajan con GitHub igual que los proyectos y el progreso.
   El fondo elegido y su intensidad van en los ajustes (también sincronizados). */
const CBG={_cache:{},list:[],
  async refresh(){try{this.list=await window.api.bgList()||[];}catch(e){this.list=[];}return this.list;},
  async url(n){if(!n)return null;if(this._cache[n])return this._cache[n];try{const u=await window.api.bgRead(n);if(u)this._cache[n]=u;return u;}catch(e){return null;}},
  async apply(){const c=Settings.get(),R=document.documentElement;let el=document.getElementById('cbg');
    const u=c.cbg?await this.url(c.cbg):null;
    if(!u){R.classList.remove('has-cbg');if(el)el.remove();return;}
    if(!el){el=document.createElement('div');el.id='cbg';el.setAttribute('aria-hidden','true');document.body.prepend(el);}
    el.style.backgroundImage=`url("${u}")`;el.classList.toggle('blur',!!c.cbgBlur);
    const k=Math.max(10,Math.min(95,+c.cbgStr||55));R.style.setProperty('--cbg-k',(100-k)+'%');R.classList.add('has-cbg');},
  async add(){try{const r=await window.api.bgAdd();if(!r)return null;await this.refresh();Settings.set('cbg',r.name);if(typeof GH!=='undefined'&&GH.saved)GH.saved();toast('Fondo añadido. Se guarda en tu carpeta y se sube a GitHub con lo demás.');return r.name;}
    catch(e){toast(e.message||'No se pudo añadir la imagen.','warn');return null;}},
  async del(n){try{await window.api.bgDel(n);delete this._cache[n];await this.refresh();if(Settings.get().cbg===n)Settings.set('cbg','');if(typeof GH!=='undefined'&&GH.saved)GH.saved();}catch(e){toast(e.message,'warn');}},
  // Bloque de ajustes (Apariencia)
  async settingsHTML(){await this.refresh();const c=Settings.get(),cur=c.cbg;
    const thumbs=await Promise.all(this.list.map(async b=>({b,u:await this.url(b.name)})));
    return `<p class="set-g">Fondo personalizado</p><div class="set-row col"><div class="set-lab"><b>Tu propio fondo</b><small>Pon una foto o un dibujo detrás de la app. Se guarda en tu carpeta de proyectos (en «.fondos») y se sube a GitHub, así lo tienes en todos tus ordenadores.</small></div>
      <div class="cbg-grid"><button class="cbg-it none" data-cbg="" aria-pressed="${!cur}"><span>Sin fondo</span></button>
        ${thumbs.map(({b,u})=>`<div class="cbg-it" aria-pressed="${cur===b.name}"><button class="cbg-pick" data-cbg="${escA(b.name)}" style="background-image:url(&quot;${u||''}&quot;)" title="${escA(b.name)}"></button><button class="cbg-del" data-cbgdel="${escA(b.name)}" title="Borrar este fondo" aria-label="Borrar ${escA(b.name)}">✕</button></div>`).join('')}
        <button class="cbg-it add" data-cbgadd><span>＋ Añadir imagen…</span><small>PNG, JPG, WEBP o GIF · máx. 15 MB</small></button></div></div>
      ${cur?`<div class="set-row"><div class="set-lab"><b>Cuánto se ve</b><small>Más alto: el fondo se ve más; más bajo: se lee mejor.</small></div><div class="seg">${[[25,'Poco'],[45,'Medio'],[65,'Bastante'],[85,'Mucho']].map(([v,l])=>`<button class="segb" data-setv="cbgStr" data-v="${v}" aria-pressed="${+c.cbgStr===v}">${l}</button>`).join('')}</div></div>
      <label class="chk"><input type="checkbox" data-set="cbgBlur" ${c.cbgBlur?'checked':''}><span class="chk-t">Desenfocar el fondo<small>Queda más suave y se leen mejor los textos.</small></span><span class="sw" aria-hidden="true"></span></label>`:''}`;},
  async onClick(e){const add=e.target.closest('[data-cbgadd]');if(add){await this.add();App.renderSettings();return true;}
    const d=e.target.closest('[data-cbgdel]');if(d){if(!d.dataset.armed){d.dataset.armed='1';d.textContent='¿Borrar?';d.classList.add('armed');setTimeout(()=>{if(d.isConnected){delete d.dataset.armed;d.textContent='✕';d.classList.remove('armed');}},3000);return true;}await this.del(d.dataset.cbgdel);App.renderSettings();return true;}
    const p=e.target.closest('[data-cbg]');if(p){Settings.set('cbg',p.dataset.cbg);App.renderSettings();return true;}return false;}};
setTimeout(()=>{try{CBG.apply();}catch(e){}},200);
