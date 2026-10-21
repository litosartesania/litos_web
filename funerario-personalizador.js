/* Local, ephemeral controls. Inscription content never enters storage, URLs or requests. */
(() => {
  'use strict';
  const root=document.getElementById('memorial-workbench');if(!root)return;
  const $=id=>document.getElementById('memorial-'+id);
  const {catalog,resources}=window.LitosMemorialData;
  const isPublic=item=>item.publicSelectable!==false;
  const publicOrnaments=catalog.ornaments.filter(isPublic);
  // Exactly one source of form state; inputs stay inside their five accordions.
  const controls=root.querySelector('.memorial-controls');
  const sidebar=document.createElement('aside');
  sidebar.className='memorial-options';
  sidebar.setAttribute('aria-label','Opciones de personalización de la lápida');
  root.prepend(sidebar);
  if(controls)sidebar.append(controls);
  const previewShortcut=document.createElement('button');previewShortcut.type='button';previewShortcut.className='memorial-preview-shortcut';previewShortcut.textContent='Ver mi lápida ↑';previewShortcut.addEventListener('click',()=>{$('canvas').scrollIntoView({block:'start'});});sidebar.prepend(previewShortcut);
  const initial=()=>({stone:'sudafrica',variant:'1',model:'nicho',layout:'centrado',type:'aldine',finish:'auto',symbol:'clasica',devotional:'ninguno',devotionalTechnique:'aplique 3D',ornament:'olivo',secondary:'ninguno',separator:'linea',frame:'fino',accessory:'ninguno',accessorySide:'right',accessoryFinish:'bronce',accessoryPlacement:{x:100,y:100,scale:100},fixings:false,guides:false,textSize:100,leading:130,align:'center',symbolPlacement:{x:50,y:50,scale:85},devotionalPlacement:{x:50,y:50,scale:85},ornamentPlacement:{x:50,y:50,scale:85},secondaryPlacement:{x:50,y:50,scale:85},dimensions:null,fields:Object.fromEntries(catalog.fields.map(f=>[f.id,{text:f.default,visible:true}]))});
  let state=initial(),scene,ready=false,exporting=false,frame;

  // Public, anonymous families. No original photograph or private order metadata is bundled.
  const casePresets=catalog.commercialModels;
  const caseHost=document.getElementById('memorial-case-grid');
  const caseDetail=document.getElementById('memorial-case-detail');
  let activePreset=null;
  function presetState(preset){
    const next=initial();
    for(const [k,v] of Object.entries(preset.state)){
      if(Object.prototype.hasOwnProperty.call(next,k)&&typeof next[k]!=='object')next[k]=v;
    }
    // Restore each model's deliberate visual proportions, not merely its material
    // and ornament IDs. Only allow numeric placement controls from our public JSON.
    for(const id of ['symbol','devotional','ornament','secondary','accessory']){
      const key=id+'Placement',placement=preset.state[key];
      if(!placement||typeof placement!=='object'||Array.isArray(placement))continue;
      for(const part of ['x','y','scale']){
        const value=placement[part],min=part==='scale'?25:0,max=part==='scale'?250:100;
        if(Number.isFinite(value))next[key][part]=Math.max(min,Math.min(max,value));
      }
    }
    const dimensions=preset.state.dimensions;
    if(dimensions&&Number.isInteger(dimensions.widthMm)&&Number.isInteger(dimensions.heightMm)&&
       dimensions.widthMm>=50&&dimensions.widthMm<=3000&&dimensions.heightMm>=50&&dimensions.heightMm<=3000){
      next.dimensions={widthMm:dimensions.widthMm,heightMm:dimensions.heightMm};
    }
    next.devotionalTechnique=preset.technique==='aplique 3D'?'aplique 3D':preset.technique==='bajorrelieve'?'bajorrelieve':'grabado';
    const copy={header:'EN RECUERDO',name:'NOMBRE APELLIDO',dates:'DD / MM / AAAA',epitaph:'SIEMPRE EN NUESTRA MEMORIA',extra:''};
    for(const [k,v] of Object.entries(copy))if(next.fields[k])next.fields[k].text=v;
    // Only fictional, explicitly public strings can be used in model templates.
    for(const [id,override] of Object.entries(preset.state.fields||{})){
      if(!next.fields[id]||!override||typeof override!=='object')continue;
      if(typeof override.visible==='boolean')next.fields[id].visible=override.visible;
      if(typeof override.text==='string'){
        const specification=catalog.fields.find(f=>f.id===id);
        next.fields[id].text=override.text.slice(0,specification.max);
      }
    }
    return next;
  }
  function mode(path){
    if(path==='create'||path==='customize')$('create').querySelector('strong').textContent='Continuar mi diseño';
    root.closest('.memorial-studio').dataset.path=path;
    $('explore').setAttribute('aria-pressed',String(path==='explore'));
    $('browse-accessories').setAttribute('aria-pressed',String(path==='accessories'));
    $('create').setAttribute('aria-pressed',String(path==='create'||path==='customize'));
  }
  $('explore').addEventListener('click',()=>{mode('explore');document.querySelector('.memorial-inspiration').scrollIntoView({block:'start'});});
  $('create').addEventListener('click',()=>{mode('create');root.scrollIntoView({block:'start'});controls.querySelector('details')?.setAttribute('open','');});
  $('back-catalog').addEventListener('click',()=>{mode('explore');document.querySelector('.memorial-inspiration').scrollIntoView({block:'start'});});
  $('browse-accessories').addEventListener('click',()=>{mode('accessories');$('accessory-shop').scrollIntoView({block:'start'});});
  mode('explore');
  const steps=[...controls.querySelectorAll(':scope > details')];
  for(const [index,step] of steps.entries()){
    const next=steps[index+1];
    if(!next)continue;
    const button=document.createElement('button');button.type='button';button.className='memorial-next-step';button.textContent='Siguiente: '+next.querySelector('summary').textContent.replace(/^\d+\s*/, '');
    button.addEventListener('click',()=>{step.open=false;next.open=true;next.querySelector('summary').focus();next.scrollIntoView({block:'nearest'});});
    step.querySelector('.memorial-panel').append(button);
  }
  function renderPresetImage(preset){
    const image=document.createElement('img');image.alt='';image.loading='lazy';
    try{
      const candidate=presetState(preset);
      const borrowed=[];
      for(const slot of ['symbol','devotional','ornament','secondary']){
        const figure=publicOrnaments.find(x=>x.id===candidate[slot]);
        if(figure?.format!=='image/webp'||resources[figure.path])continue;
        const thumb=resources[figure.thumbnailPath];
        if(thumb){resources[figure.path]=thumb;borrowed.push(figure.path);}else candidate[slot]='ninguno';
      }
      let picture;
      try{picture=window.LitosMemorialComposer.compose(candidate);}finally{for(const path of borrowed)delete resources[path];}
      image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(picture.svg));
    }catch(error){image.alt='Recreación no disponible';}
    return image;
  }
  function showCaseDetail(preset,trigger){
    const heading=document.createElement('h5');heading.textContent=preset.title;heading.tabIndex=-1;
    const label=document.createElement('p');label.className='memorial-case-provenance';label.textContent=preset.provenance==='inspirado'?'Modelo inspirado en trabajos realizados':'Propuesta de diseño';
    const image=renderPresetImage(preset);
    const figure=document.createElement('div');figure.className='memorial-case-detail-picture';figure.append(image);
    const note=document.createElement('p');note.textContent=preset.note;
    const facts=document.createElement('dl');
    for(const [term,value] of [['Tipo',preset.type],['Piedra',preset.stoneFamily],['Técnica',preset.technique],['Complemento',preset.accessoryCategory==='ninguno'?'Sin complemento':preset.accessoryCategory]]){
      const dt=document.createElement('dt');dt.textContent=term;const dd=document.createElement('dd');dd.textContent=value;facts.append(dt,dd);
    }
    const action=document.createElement('button');action.type='button';action.textContent='Personalizar este modelo';
    action.addEventListener('click',()=>{
      activePreset=preset;state=presetState(preset);sync();
      const figure=publicOrnaments.find(x=>x.id===state.devotional);if(figure)loadPictorial(figure);
      renderAccessoryGallery();renderGallery(true);render();mode('customize');root.scrollIntoView({block:'start'});
      status('Modelo cargado. Piedra, forma, técnica y complemento ya están en la composición.');
    });
    const close=document.createElement('button');close.type='button';close.className='memorial-case-detail-close';close.textContent='Cerrar ficha';close.addEventListener('click',()=>{caseDetail.hidden=true;trigger?.focus({preventScroll:true});});
    const body=document.createElement('div');body.className='memorial-case-detail-copy';body.append(label,heading,note,facts,action,close);
    caseDetail.replaceChildren(figure,body);caseDetail.hidden=false;caseDetail.scrollIntoView({block:'start'});heading.focus({preventScroll:true});
  }
  function renderCaseGallery(){
    if(!caseHost||!ready)return;
    const fragment=document.createDocumentFragment();
    const filters={type:$('filter-type').value,stoneFamily:$('filter-stone').value,style:$('filter-style').value,technique:$('filter-technique').value,ornamentation:$('filter-ornament').value,accessoryCategory:$('filter-accessory').value};
    const visible=casePresets.filter(p=>Object.entries(filters).every(([key,value])=>!value||p[key]===value));
    $('filter-count').textContent=visible.length?`${visible.length} modelos disponibles en esta selección`:'No hay modelos con esta combinación. Prueba a retirar un filtro.';
    for(const preset of visible){
      const card=document.createElement('article');card.className='memorial-case-card';card.dataset.preset=preset.id;
      const image=document.createElement('div');image.className='memorial-case-picture';
      image.append(renderPresetImage(preset));
      const copy=document.createElement('div');copy.className='memorial-case-copy';
      const name=document.createElement('h5');name.textContent=preset.title;
      const note=document.createElement('p');note.textContent=preset.note;
      const meta=document.createElement('p');meta.className='memorial-case-meta';meta.textContent=`${preset.type} · ${preset.technique}`;
      const button=document.createElement('button');button.type='button';button.textContent='Ver modelo';button.setAttribute('aria-label','Ver modelo: '+preset.title);
      button.addEventListener('click',()=>showCaseDetail(preset,button));
      copy.append(meta,name,note,button);card.append(image,copy);fragment.append(card);
    }
    caseHost.replaceChildren(fragment);
  }
  for(const id of ['filter-type','filter-stone','filter-style','filter-technique','filter-ornament','filter-accessory'])$(id).addEventListener('change',()=>{caseDetail.hidden=true;renderCaseGallery();});
  $('filter-reset').addEventListener('click',()=>{document.querySelectorAll('.memorial-filters select').forEach(el=>el.value='');caseDetail.hidden=true;renderCaseGallery();});
  const pictorialLoads=new Map(),pictorialErrors=new Map();
  function loadPictorial(item){
    if(item?.format!=='image/webp'||resources[item.path]||pictorialLoads.has(item.path))return;
    pictorialErrors.delete(item.path);
    const image=new Image();
    const promise=new Promise((resolve,reject)=>{
      image.onload=()=>{
        try{
          const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
          canvas.getContext('2d').drawImage(image,0,0);
          resources[item.path]=canvas.toDataURL('image/webp',.97);
          resolve();
        }catch(error){reject(error);}
      };
      image.onerror=()=>reject(new Error('No se pudo cargar la figura.'));
      image.src=item.path;
    });
    pictorialLoads.set(item.path,promise);
    promise.catch(error=>pictorialErrors.set(item.path,error)).finally(()=>{
      pictorialLoads.delete(item.path);
      if(['symbol','devotional','ornament','secondary','accessory'].some(slot=>state[slot]===item.id))requestRender();
      renderCaseGallery();
    });
  }
  const selections={stone:'stone',variant:'variant',model:'model',layout:'layout',type:'type',finish:'finish',symbol:'symbol',devotional:'devotional',ornament:'ornament',secondary:'secondary',separator:'separator',frame:'frame',accessory:'accessory',accessorySide:'accessorySide',accessoryFinish:'accessoryFinish',align:'align'};
  let activeAccessoryFilter='todos';
  function applyAccessoryFilter(){
    const shop=$('accessory-shop-grid');if(!shop)return;
    let visible=0;
    for(const button of shop.querySelectorAll('[data-accessory-choice]')){
      const matches=activeAccessoryFilter==='todos'||button.dataset.category===activeAccessoryFilter;
      button.hidden=!matches;if(matches)visible++;
      button.setAttribute('aria-pressed',String(state.accessory===button.dataset.accessoryChoice));
    }
    for(const button of document.querySelectorAll('[data-accessory-category-filter]')){
      button.setAttribute('aria-pressed',String(button.dataset.accessoryCategoryFilter===activeAccessoryFilter));
    }
    const counter=$('accessory-shop-count');
    if(counter)counter.textContent=visible===1?'1 complemento en esta categoría':visible+' complementos en esta categoría';
  }
  function renderAccessoryGallery(){
    const host=$('accessory-gallery');if(!host)return;
    const fragment=document.createDocumentFragment();
    for(const item of [{id:'ninguno',name:'Sin complemento'},...catalog.accessories]){
      const button=document.createElement('button');button.type='button';button.className='memorial-accessory-card';button.setAttribute('aria-pressed',String(state.accessory===item.id));
      const picture=document.createElement('span');picture.className='memorial-accessory-card-image';
      if(item.path){const img=document.createElement('img');const thumbnail=resources[item.thumbnailPath];img.src=thumbnail?.startsWith('data:image/')?thumbnail:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(thumbnail||resources[item.path]);img.alt='';img.loading='lazy';picture.append(img);}else picture.textContent='—';
      const name=document.createElement('span');name.textContent=item.name;button.append(picture,name);
      button.addEventListener('click',()=>{state.accessory=item.id;$('accessory').value=item.id;renderAccessoryGallery();requestRender();});
      fragment.append(button);
    }
    host.replaceChildren(fragment);
    const shop=$('accessory-shop-grid');
    if(shop&&!shop.childElementCount){
      const filterBar=document.createElement('div');filterBar.className='memorial-shop-filters';
      filterBar.setAttribute('role','group');filterBar.setAttribute('aria-label','Categoría de complementos');
      const groups=[['todos','Todos'],['floreros','Floreros'],['búcaros y jarrones','Búcaros y jarrones'],['jardineras','Jardineras'],['faroles y luz','Faroles y luz'],['repisas y soportes','Repisas y soportes'],['libros y placas','Libros y placas']];
      for(const [key,name] of groups){
        if(key!=='todos'&&!catalog.accessories.some(item=>item.category===key))continue;
        const filter=document.createElement('button');filter.type='button';
        filter.dataset.accessoryCategoryFilter=key;filter.textContent=name;
        filter.addEventListener('click',()=>{activeAccessoryFilter=key;applyAccessoryFilter();});
        filterBar.append(filter);
      }
      const counter=document.createElement('p');counter.id='memorial-accessory-shop-count';
      counter.className='memorial-shop-count';counter.setAttribute('aria-live','polite');
      shop.before(filterBar,counter);
      for(const item of catalog.accessories){
        const button=document.createElement('button');button.type='button';button.className='memorial-shop-item';button.dataset.accessoryChoice=item.id;button.dataset.category=item.category;
        const img=document.createElement('img');const thumb=resources[item.thumbnailPath];img.src=thumb?.startsWith('data:image/')?thumb:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(thumb||resources[item.path]);img.alt='';img.width=160;img.height=160;img.loading='lazy';
        const name=document.createElement('strong');name.textContent=item.name;
        const action=document.createElement('span');action.textContent='Añadir a mi lápida';button.append(img,name,action);
        button.addEventListener('click',()=>{state.accessory=item.id;sync();renderAccessoryGallery();requestRender();mode('customize');steps[1].open=true;root.scrollIntoView({block:'start'});status(item.name+' añadido a tu composición.');});shop.append(button);
      }
    }
    applyAccessoryFilter();
    const selected=catalog.accessories.find(x=>x.id===state.accessory);
    if(selected?.renderPath)loadPictorial({...selected,path:selected.renderPath,format:'image/webp'});
    $('accessory-note').textContent=selected?`${selected.category} · ${selected.mount}. Medidas y disponibilidad pendientes de validación.`:'Elige un complemento para consultar sus condiciones de montaje.';
    const finish=$('accessoryFinish');
    for(const option of finish.options)option.disabled=Boolean(selected&&!selected.finishes.includes(option.value));
    if(selected&&!selected.finishes.includes(state.accessoryFinish)){state.accessoryFinish=selected.finishes[0];finish.value=state.accessoryFinish;}
  }
  $('devotional-technique').addEventListener('change',()=>{state.devotionalTechnique=$('devotional-technique').value;requestRender();});
  const swatches=[];
  for(const material of catalog.materials){
    const button=document.createElement('button');button.type='button';button.className='memorial-swatch';button.dataset.stone=material.id;
    button.setAttribute('aria-label',material.name);button.setAttribute('aria-pressed','false');
    const image=document.createElement('img');image.src=resources[material.variants[0].path];image.alt='';image.width=80;image.height=56;
    const label=document.createElement('span');label.textContent=material.name;button.append(image,label);$('swatches').append(button);swatches.push(button);
    button.addEventListener('click',()=>{state.stone=material.id;$('stone').value=material.id;requestRender();});
  }
  function status(message){$('status').textContent=message;}
  function renderPlan(){
    const host=$('plan-preview'),button=$('plan-download');
    const width=Number($('width-mm').value),height=Number($('height-mm').value);
    const valid=$('width-mm').value!==''&&$('height-mm').value!==''&&Number.isInteger(width)&&Number.isInteger(height)&&width>=50&&width<=3000&&height>=50&&height<=3000;
    button.disabled=!valid||!scene||scene.truncated||scene.unrendered;
    if(!valid){const p=document.createElement('p');p.textContent='Introduce ancho y alto reales en milímetros para ver el plano.';host.replaceChildren(p);$('plan-measures').replaceChildren();return;}
    if(!scene)return;
    try{
      const plan=window.LitosMemorialExport.makePlan(scene,width,height);
      plan.removeAttribute('width');plan.removeAttribute('height');
      plan.classList.add('memorial-plan-svg');host.replaceChildren(plan);
      const list=document.createElement('ol');
      const face=scene.face,rounded=value=>Math.round(value*10)/10;
      for(const box of scene.boxes){
        const row=document.createElement('li');
        const item=box.id?(box.kind==='accessory'?catalog.accessories:catalog.ornaments).find(candidate=>candidate.id===box.id):null;
        const field=box.kind.startsWith('text:')?catalog.fields.find(candidate=>'text:'+candidate.id===box.kind):null;
        const label=field?'Texto: '+field.label:item?.name||({frame:'Marco',separator:'Separador',secondSeparator:'Separador 2'}[box.kind]||box.kind);
        row.textContent=`${label}: X ${rounded((box.x-face.x)/face.w*width)} · Y ${rounded((box.y-face.y)/face.h*height)} · ${rounded(box.w/face.w*width)} × ${rounded(box.h/face.h*height)} mm`;
        list.append(row);
      }
      $('plan-measures').replaceChildren(list);
    }catch(error){const p=document.createElement('p');p.textContent=error.message;host.replaceChildren(p);button.disabled=true;}
  }
  const galleryGroups={cruces:['cruces'],religiosas:['religiosas'],flores:['flores','simbolos'],secondary:['flores','simbolos'],marcos:['marcos'],separadores:['separadores']};
  const gallerySlot={cruces:'symbol',religiosas:'devotional',flores:'ornament',secondary:'secondary',marcos:'frame',separadores:'separator'};
  function selectMotif(slot,id){
    if(id!=='ninguno'&&!publicOrnaments.some(item=>item.id===id)){
      status('Ese motivo sigue en revisión artística y no está disponible en el catálogo público.');
      return;
    }
    state[slot]=id;$(slot).value=id;
    if((slot==='devotional'||slot==='secondary')&&id!=='ninguno'&&!catalog.layouts.find(x=>x.id===state.layout)?.[slot]){
      state.layout='devocionlateral';$('layout').value=state.layout;
    }
    const item=publicOrnaments.find(candidate=>candidate.id===id);
    loadPictorial(item);
    renderGallery();requestRender();
  }
  // Independent image choices live inside each related setting; no second selector bar.
  function renderGallery(force=false){
    for(const [group,slot] of Object.entries(gallerySlot)){
      const host=document.getElementById('memorial-gallery-'+group);
      if(!host)continue;
      if(!force&&host.dataset.ready==='true'){
        for(const button of host.querySelectorAll('button[data-item-id]')){
          const selected=state[slot]===button.dataset.itemId;
          const item=publicOrnaments.find(candidate=>candidate.id===button.dataset.itemId);
          button.setAttribute('aria-pressed',String(selected));
          button.setAttribute('aria-label',(selected?'Seleccionado: ':'Elegir: ')+button.querySelector('.memorial-motif-name').textContent+(item?.commercialReady===false?', prototipo sin validar':''));
        }
        continue;
      }
      const items=publicOrnaments.filter(item=>galleryGroups[group].includes(item.category));
      const fragment=document.createDocumentFragment();
      for(const item of [{id:'ninguno',name:'Sin elemento'},...items]){
        const selected=state[slot]===item.id;
        const button=document.createElement('button');button.type='button';button.className='memorial-motif';
        button.dataset.itemId=item.id;button.dataset.motifSlot=slot;button.setAttribute('aria-pressed',String(selected));
        button.setAttribute('aria-label',(selected?'Seleccionado: ':'Elegir: ')+item.name+(item.commercialReady===false?', prototipo sin validar':''));
        const image=document.createElement('span');image.className='memorial-motif-image';
        if(item.id==='ninguno'){image.textContent='—';image.setAttribute('aria-hidden','true');}
        else{
          const art=document.createElement('img'),source=resources[item.path];
          art.src=item.thumbnailPath?(resources[item.thumbnailPath]||item.thumbnailPath):((source||'').startsWith('data:image/')?source:'data:image/svg+xml,'+encodeURIComponent(source));
          art.alt='';art.loading='lazy';art.width=68;art.height=68;image.append(art);
        }
        const label=document.createElement('span');label.className='memorial-motif-name';label.textContent=item.name;
        button.append(image,label);
        if(item.commercialReady===false){
          const note=document.createElement('small');note.className='memorial-motif-pending';
          note.textContent='Prototipo sin validar';button.append(note);button.title=item.validation;
        }
        button.addEventListener('click',()=>selectMotif(slot,item.id));fragment.append(button);
      }
      host.replaceChildren(fragment);host.dataset.ready='true';
    }
  }
  const religiousReady=publicOrnaments.some(item=>item.category==='religiosas');
  if(!religiousReady){
    $('devotional').replaceChildren(new Option('Imágenes en revisión','ninguno'));
    $('devotional').disabled=true;
    const heading=document.getElementById('memorial-motif-heading-religiosas');
    if(heading)heading.textContent='Imágenes religiosas · en preparación';
    const section=document.querySelector('[data-motif-section="religiosas"]');
    if(section){
      const note=document.createElement('p');note.className='memorial-note';
      note.textContent='Estamos renovando los grabados religiosos; no están disponibles en esta versión orientativa.';
      section.append(note);
    }
    const placement=$('devotional-scale').closest('fieldset');
    if(placement)placement.hidden=true;
  }
  renderGallery(true);
  function render(){
    if(!ready)return;
    const figures=['symbol','devotional','ornament','secondary'].map(slot=>publicOrnaments.find(item=>item.id===state[slot]&&item.format==='image/webp')).filter(Boolean);
    for(const figure of figures)if(!pictorialErrors.has(figure.path))loadPictorial(figure);
    const figure=figures.find(item=>!resources[item.path]);
    const accessory=catalog.accessories.find(item=>item.id===state.accessory);
    const waitingPath=figure&&!resources[figure.path]?figure.path:accessory?.renderPath&&!resources[accessory.renderPath]?accessory.renderPath:null;
    if(waitingPath){
      scene=null;$('download').disabled=true;$('plan-download').disabled=true;$('plan-preview').replaceChildren();$('plan-measures').replaceChildren();
      root.setAttribute('aria-busy','true');
      const message=pictorialErrors.has(waitingPath)?'No se pudo cargar el elemento. Vuelve a seleccionarlo para reintentar.':'Cargando el elemento seleccionado…';
      const placeholder=document.createElement('p');placeholder.textContent=message;$('canvas').replaceChildren(placeholder);
      status(message);
      return;
    }
    try{
      scene=window.LitosMemorialComposer.compose(state);
      scene.svg.id='memorial-slab';$('canvas').replaceChildren(scene.svg);
      $('caption').textContent=(activePreset?'Basado en '+activePreset.title+' · ':'Diseño propio · ')+scene.material.name+' · '+scene.model.name+' · '+scene.layout.name;
      const devotional=catalog.ornaments.find(x=>x.id===state.devotional&&x.category==='religiosas');
      $('technique-note').textContent=devotional?`Imagen religiosa: ${catalog.techniques.find(x=>x.id===state.devotionalTechnique)?.name||state.devotionalTechnique} · Simulación pendiente de validación técnica`:'Motivos y letras: acabado orientativo; técnica final pendiente de confirmar.';
      $('material-note').textContent=scene.material.description+' '+scene.material.status+(scene.material.id==='italia'?' · Variedad comercial exacta sin identificar.':'');
      $('model-note').textContent=scene.model.note;
      swatches.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.stone===state.stone)));
      for(const prefix of ['symbol','devotional','ornament','secondary','accessory'])document.getElementById(prefix+'-scale-value').textContent=state[prefix+'Placement'].scale+' %';
      $('size-value').textContent=state.textSize+' %';$('leading-value').textContent=state.leading+' %';
      for(const prefix of ['symbol','devotional','ornament','secondary','accessory']){
        const disabled=state[prefix]==='ninguno';
        for(const suffix of ['x','y','scale'])$(prefix+'-'+suffix).disabled=disabled;
      }
      if(!exporting)status(scene.warnings.length?scene.warnings.join(' '):scene.adjusted?'Composición actualizada. Tamaño ajustado para mantener el texto dentro de su zona.':'Composición actualizada. Lista para descargar.');
      renderGallery();
      root.setAttribute('aria-busy','false');root.dataset.ready='true';$('download').disabled=exporting||scene.truncated||scene.unrendered;
      renderPlan();
    }catch(error){root.setAttribute('aria-busy','false');status('No se pudo actualizar la vista previa. '+error.message);$('download').disabled=true;}
  }
  function requestRender(){cancelAnimationFrame(frame);frame=requestAnimationFrame(render);}
  for(const [id,key] of Object.entries(selections))$(id).addEventListener('change',()=>{
    if(key==='devotional'||key==='secondary')selectMotif(key,$(id).value);
    else{
      const next=$(id).value;
      if(key==='layout'){
        const layout=catalog.layouts.find(x=>x.id===next);
        if((state.devotional!=='ninguno'&&!layout?.devotional)||(state.secondary!=='ninguno'&&!layout?.secondary)){
          $(id).value=state.layout;
          status('Esta composición no dispone de zona para los motivos seleccionados. Retíralos o utiliza una de las dos composiciones devocionales.');
          return;
        }
      }
      state[key]=next;if(key==='accessorySide'&&next!=='free'){state.accessoryPlacement.x=next==='left'?0:next==='center'?50:100;state.accessoryPlacement.y=100;$('accessory-x').value=state.accessoryPlacement.x;$('accessory-y').value=100;}if(key==='accessory'||key==='accessoryFinish')renderAccessoryGallery();requestRender();
    }
  });
  for(const id of ['fixings','guides'])$(id).addEventListener('change',()=>{state[id]=$(id).checked;requestRender();});
  for(const [id,key] of [['size','textSize'],['leading','leading']])$(id).addEventListener('input',()=>{state[key]=Number($(id).value);requestRender();});

  const dimensionButtons=[...document.querySelectorAll('.memorial-dimension-option')];
  for(const id of ['width-mm','height-mm'])$(id).addEventListener('input',()=>{
    for(const button of dimensionButtons){
      const selected=Number($('width-mm').value)===Number(button.dataset.width)&&Number($('height-mm').value)===Number(button.dataset.height);
      button.setAttribute('aria-pressed',String(selected));
    }
    const widthMm=Number($('width-mm').value),heightMm=Number($('height-mm').value);
    state.dimensions=widthMm>=50&&widthMm<=3000&&heightMm>=50&&heightMm<=3000?{widthMm,heightMm}:null;
    requestRender();
  });
  for(const button of dimensionButtons)button.addEventListener('click',()=>{
    $('width-mm').value=button.dataset.width;
    $('height-mm').value=button.dataset.height;
    $('width-mm').dispatchEvent(new Event('input',{bubbles:true}));
    $('height-mm').dispatchEvent(new Event('input',{bubbles:true}));
    status('Medida observada en muestra histórica. Verificar las cotas reales con el taller.');
  });
  for(const prefix of ['symbol','devotional','ornament','secondary','accessory'])for(const suffix of ['x','y','scale'])$(prefix+'-'+suffix).addEventListener('input',()=>{state[prefix+'Placement'][suffix]=Number($(prefix+'-'+suffix).value);if(prefix==='accessory'){state.accessorySide='free';$('accessorySide').value='free';}requestRender();});
  for(const field of catalog.fields){
    const input=field.id==='name'?$('text'):$('field-'+field.id);
    input.addEventListener('input',()=>{state.fields[field.id].text=input.value.slice(0,field.max);requestRender();});
    $('show-'+field.id).addEventListener('change',()=>{state.fields[field.id].visible=$('show-'+field.id).checked;requestRender();});
  }
  function sync(){
    for(const [id,key] of Object.entries(selections))$(id).value=state[key];
    $('devotional-technique').value=state.devotionalTechnique;
    for(const id of ['fixings','guides'])$(id).checked=state[id];
    $('size').value=state.textSize;$('leading').value=state.leading;
    for(const prefix of ['symbol','devotional','ornament','secondary','accessory'])for(const suffix of ['x','y','scale'])$(prefix+'-'+suffix).value=state[prefix+'Placement'][suffix];
    for(const field of catalog.fields){(field.id==='name'?$('text'):$('field-'+field.id)).value=state.fields[field.id].text;$('show-'+field.id).checked=state.fields[field.id].visible;}
    $('width-mm').value=state.dimensions?.widthMm||'';$('height-mm').value=state.dimensions?.heightMm||'';
    renderAccessoryGallery();
  }
  $('reset').addEventListener('click',()=>{activePreset=null;state=initial();sync();renderGallery();render();});
  $('plan-download').addEventListener('click',()=>{
    if(!scene||scene.truncated||scene.unrendered)return;
    try{window.LitosMemorialExport.downloadPlan(scene,Number($('width-mm').value),Number($('height-mm').value));status('Plano acotado descargado. Coteja las medidas y la tipografía con el taller antes de producir.');}
    catch(error){status(error.message);}
  });
  $('download').addEventListener('click',async()=>{
    if(!ready||exporting)return;
    cancelAnimationFrame(frame);render();
    if(!scene||scene.truncated||scene.unrendered){
      status('Corrige el texto abreviado o selecciona una composición que incluya todas las capas antes de descargar.');
      return;
    }
    exporting=true;$('download').disabled=true;status('Preparando la descarga en tu navegador…');
    try{await window.LitosMemorialExport.download(scene);status('Imagen preparada. La descarga incluye tu inscripción y el aviso de simulación.');}
    catch(error){status(error.message+' La composición sigue disponible.');}
    finally{exporting=false;$('download').disabled=scene.truncated||scene.unrendered;}
  });
  sync();renderGallery();
  window.LitosMemorialComposer.loadFonts().then(()=>{
    ready=true;render();renderCaseGallery();
  }).catch(error=>{root.setAttribute('aria-busy','false');status(error.message);});
})();
