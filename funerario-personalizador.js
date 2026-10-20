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
  const initial=()=>({stone:'sudafrica',variant:'1',model:'nicho',layout:'centrado',type:'aldine',finish:'auto',symbol:'clasica',devotional:'ninguno',devotionalTechnique:'aplique 3D',ornament:'olivo',secondary:'ninguno',separator:'linea',frame:'fino',accessory:'ninguno',accessorySide:'right',accessoryFinish:'bronce',fixings:false,guides:false,textSize:100,leading:130,align:'center',symbolPlacement:{x:50,y:50,scale:85},devotionalPlacement:{x:50,y:50,scale:85},ornamentPlacement:{x:50,y:50,scale:85},secondaryPlacement:{x:50,y:50,scale:85},dimensions:null,fields:Object.fromEntries(catalog.fields.map(f=>[f.id,{text:f.default,visible:true}]))});
  let state=initial(),scene,ready=false,exporting=false,frame;

  // Public, anonymous families. No original photograph or private order metadata is bundled.
  const casePresets=catalog.commercialModels;
  const caseHost=document.getElementById('memorial-case-grid');
  const caseDetail=document.getElementById('memorial-case-detail');
  let activePreset=null;
  function presetState(preset){
    const next=initial();
    for(const [k,v] of Object.entries(preset.state))if(Object.prototype.hasOwnProperty.call(next,k)&&typeof next[k]!=='object')next[k]=v;
    next.devotionalTechnique=preset.technique==='aplique 3D'?'aplique 3D':preset.technique==='bajorrelieve'?'bajorrelieve':'grabado';
    const copy={header:'EN RECUERDO',name:'NOMBRE APELLIDO',dates:'DD / MM / AAAA',epitaph:'SIEMPRE EN NUESTRA MEMORIA',extra:''};
    for(const [k,v] of Object.entries(copy))if(next.fields[k])next.fields[k].text=v;
    return next;
  }
  function mode(path){
    if(path!=='explore')$('create').querySelector('strong').textContent='Continuar mi diseño';
    root.closest('.memorial-studio').dataset.path=path;
    $('explore').setAttribute('aria-pressed',String(path==='explore'));
    $('create').setAttribute('aria-pressed',String(path==='create'));
  }
  $('explore').addEventListener('click',()=>{mode('explore');document.querySelector('.memorial-inspiration').scrollIntoView({block:'start'});});
  $('create').addEventListener('click',()=>{activePreset=null;mode('create');root.scrollIntoView({block:'start'});controls.querySelector('details')?.setAttribute('open','');});
  $('back-catalog').addEventListener('click',()=>{mode('explore');document.querySelector('.memorial-inspiration').scrollIntoView({block:'start'});});
  mode('explore');
  function renderPresetImage(preset){
    const image=document.createElement('img');image.alt='';image.loading='lazy';
    try{
      const candidate=presetState(preset);
      const figure=publicOrnaments.find(x=>x.id===candidate.devotional);
      const missing=figure?.format==='image/webp'&&!resources[figure.path];
      if(missing){const thumb=resources[figure.thumbnailPath];if(thumb)resources[figure.path]=thumb;else candidate.devotional='ninguno';}
      let picture;
      try{picture=window.LitosMemorialComposer.compose(candidate);}finally{if(missing)delete resources[figure.path];}
      image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(picture.svg));
    }catch(error){image.alt='Recreación no disponible';}
    return image;
  }
  function showCaseDetail(preset){
    const heading=document.createElement('h5');heading.textContent=preset.title;
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
    const close=document.createElement('button');close.type='button';close.className='memorial-case-detail-close';close.textContent='Cerrar ficha';close.addEventListener('click',()=>{caseDetail.hidden=true;});
    const body=document.createElement('div');body.className='memorial-case-detail-copy';body.append(label,heading,note,facts,action,close);
    caseDetail.replaceChildren(figure,body);caseDetail.hidden=false;caseDetail.scrollIntoView({block:'nearest'});
  }
  function renderCaseGallery(){
    if(!caseHost||!ready)return;
    const fragment=document.createDocumentFragment();
    const filters={type:$('filter-type').value,stoneFamily:$('filter-stone').value,style:$('filter-style').value,technique:$('filter-technique').value,ornamentation:$('filter-ornament').value,accessoryCategory:$('filter-accessory').value};
    const visible=casePresets.filter(p=>Object.entries(filters).every(([key,value])=>!value||p[key]===value));
    $('filter-count').textContent=visible.length?`${visible.length} modelos disponibles en esta selección`:'No hay modelos con esta combinación. Prueba a retirar un filtro.';
    for(const preset of visible){
      const card=document.createElement('article');card.className='memorial-case-card';
      const image=document.createElement('div');image.className='memorial-case-picture';
      image.append(renderPresetImage(preset));
      const copy=document.createElement('div');copy.className='memorial-case-copy';
      const name=document.createElement('h5');name.textContent=preset.title;
      const note=document.createElement('p');note.textContent=preset.note;
      const meta=document.createElement('p');meta.className='memorial-case-meta';meta.textContent=`${preset.type} · ${preset.technique}`;
      const button=document.createElement('button');button.type='button';button.textContent='Ver modelo';button.setAttribute('aria-label','Ver modelo: '+preset.title);
      button.addEventListener('click',()=>showCaseDetail(preset));
      copy.append(meta,name,note,button);card.append(image,copy);fragment.append(card);
    }
    caseHost.replaceChildren(fragment);
  }
  for(const id of ['filter-type','filter-stone','filter-style','filter-technique','filter-ornament','filter-accessory'])$(id).addEventListener('change',()=>{caseDetail.hidden=true;renderCaseGallery();});
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
      if(state.devotional===item.id||state.accessory===item.id)requestRender();
      renderCaseGallery();
    });
  }
  const selections={stone:'stone',variant:'variant',model:'model',layout:'layout',type:'type',finish:'finish',symbol:'symbol',devotional:'devotional',ornament:'ornament',secondary:'secondary',separator:'separator',frame:'frame',accessory:'accessory',accessorySide:'accessorySide',accessoryFinish:'accessoryFinish',align:'align'};
  function renderAccessoryGallery(){
    const host=$('accessory-gallery');if(!host)return;
    const fragment=document.createDocumentFragment();
    for(const item of [{id:'ninguno',name:'Sin complemento'},...catalog.accessories]){
      const button=document.createElement('button');button.type='button';button.className='memorial-accessory-card';button.setAttribute('aria-pressed',String(state.accessory===item.id));
      const picture=document.createElement('span');picture.className='memorial-accessory-card-image';
      if(item.path){const img=document.createElement('img');img.src=resources[item.thumbnailPath]||'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(resources[item.path]);img.alt='';img.loading='lazy';picture.append(img);}else picture.textContent='—';
      const name=document.createElement('span');name.textContent=item.name;button.append(picture,name);
      button.addEventListener('click',()=>{state.accessory=item.id;$('accessory').value=item.id;renderAccessoryGallery();requestRender();});
      fragment.append(button);
    }
    host.replaceChildren(fragment);
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
  // The cards are the selection control. Categories only navigate between card groups;
  // avoid a second large dropdown above the same visual options.
  const categoryTabs=$('category-tabs');
  function buildCategoryTabs(){
    if(!categoryTabs)return;
    const select=$('gallery-category'),fragment=document.createDocumentFragment();
    const categories=new Set();
    for(const option of select.options){
      if(categories.has(option.value))continue;
      categories.add(option.value);
      const button=document.createElement('button');
      button.type='button';
      button.className='memorial-category-tab';
      button.dataset.category=option.value;
      button.textContent=option.label;
      button.setAttribute('aria-pressed',String(select.value===option.value));
      button.addEventListener('click',()=>{
        if(select.value===option.value)return;
        select.value=option.value;
        select.dispatchEvent(new Event('change',{bubbles:true}));
      });
      fragment.append(button);
    }
    categoryTabs.replaceChildren(fragment);
  }
  function renderGallery(force=false){
    const group=$('gallery-category').value,slot=gallerySlot[group];
    if(categoryTabs)for(const button of categoryTabs.querySelectorAll('button')){
      button.setAttribute('aria-pressed',String(button.dataset.category===group));
    }
    if(!force&&$('gallery').dataset.group===group){
      for(const button of $('gallery').querySelectorAll('button')){
        const selected=state[slot]===button.dataset.itemId;
        const item=publicOrnaments.find(candidate=>candidate.id===button.dataset.itemId);
        button.setAttribute('aria-pressed',String(selected));
        button.setAttribute('aria-label',(selected?'Seleccionado: ':'Elegir: ')+button.querySelector('.memorial-motif-name').textContent+(item?.commercialReady===false?', prototipo sin validar':''));
      }
      return;
    }
    const items=publicOrnaments.filter(item=>galleryGroups[group].includes(item.category));
    const fragment=document.createDocumentFragment();
    const choices=[{id:'ninguno',name:'Sin elemento',category:''},...items];
    for(const item of choices){
      const button=document.createElement('button');button.type='button';button.className='memorial-motif';
      button.dataset.itemId=item.id;button.dataset.slot=slot;button.setAttribute('aria-pressed',String(state[slot]===item.id));
      button.setAttribute('aria-label',(state[slot]===item.id?'Seleccionado: ':'Elegir: ')+item.name+(item.commercialReady===false?', prototipo sin validar':''));
      const image=document.createElement('span');image.className='memorial-motif-image';
      if(item.id==='ninguno'){image.textContent='—';image.setAttribute('aria-hidden','true');}
      else{const art=document.createElement('img');const source=resources[item.path];art.src=item.thumbnailPath?(resources[item.thumbnailPath]||item.thumbnailPath):((source||'').startsWith('data:image/')?source:'data:image/svg+xml,'+encodeURIComponent(source));art.alt='';art.loading='lazy';art.width=68;art.height=68;image.append(art);}
      const label=document.createElement('span');label.className='memorial-motif-name';label.textContent=item.name;
      button.append(image,label);
      if(item.commercialReady===false){
        const note=document.createElement('small');note.className='memorial-motif-pending';
        note.textContent='Prototipo sin validar';button.append(note);
        button.title=item.validation;
      }
      button.addEventListener('click',()=>selectMotif(slot,item.id));fragment.append(button);
    }
    $('gallery').replaceChildren(fragment);$('gallery').dataset.group=group;
  }
  const religiousReady=publicOrnaments.some(item=>item.category==='religiosas');
  if(!religiousReady){
    const religiousOption=$('gallery-category').querySelector('option[value="religiosas"]');
    if(religiousOption)religiousOption.remove();
    $('devotional').replaceChildren(new Option('Imágenes en revisión','ninguno'));
    $('devotional').disabled=true;
    const label=document.querySelector('label[for="memorial-devotional"]');
    if(label)label.textContent='Imágenes religiosas · en preparación';
    const note=document.createElement('p');
    note.className='memorial-note';
    note.textContent='Estamos renovando los grabados religiosos; no están disponibles en esta versión orientativa.';
    $('devotional').after(note);
    const placement=$('devotional-scale').closest('fieldset');
    if(placement)placement.hidden=true;
  }
  buildCategoryTabs();
  $('gallery-category').addEventListener('change',()=>renderGallery(true));
  function render(){
    if(!ready)return;
    const figure=publicOrnaments.find(item=>item.id===state.devotional&&item.format==='image/webp');
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
      $('caption').textContent=scene.material.name+' · '+scene.model.name+' · '+scene.layout.name;
      const devotional=catalog.ornaments.find(x=>x.id===state.devotional&&x.category==='religiosas');
      $('technique-note').textContent=devotional?`Imagen religiosa: ${catalog.techniques.find(x=>x.id===state.devotionalTechnique)?.name||state.devotionalTechnique} · Simulación pendiente de validación técnica`:'Motivos y letras: acabado orientativo; técnica final pendiente de confirmar.';
      $('material-note').textContent=scene.material.description+' '+scene.material.status+(scene.material.id==='italia'?' · Variedad comercial exacta sin identificar.':'');
      $('model-note').textContent=scene.model.note;
      swatches.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.stone===state.stone)));
      for(const prefix of ['symbol','devotional','ornament','secondary'])document.getElementById(prefix+'-scale-value').textContent=state[prefix+'Placement'].scale+' %';
      $('size-value').textContent=state.textSize+' %';$('leading-value').textContent=state.leading+' %';
      for(const prefix of ['symbol','devotional','ornament','secondary']){
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
      state[key]=next;if(key==='accessory'||key==='accessoryFinish')renderAccessoryGallery();requestRender();
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
  for(const prefix of ['symbol','devotional','ornament','secondary'])for(const suffix of ['x','y','scale'])$(prefix+'-'+suffix).addEventListener('input',()=>{state[prefix+'Placement'][suffix]=Number($(prefix+'-'+suffix).value);requestRender();});
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
    for(const prefix of ['symbol','devotional','ornament','secondary'])for(const suffix of ['x','y','scale'])$(prefix+'-'+suffix).value=state[prefix+'Placement'][suffix];
    for(const field of catalog.fields){(field.id==='name'?$('text'):$('field-'+field.id)).value=state.fields[field.id].text;$('show-'+field.id).checked=state.fields[field.id].visible;}
    $('width-mm').value=state.dimensions?.widthMm||'';$('height-mm').value=state.dimensions?.heightMm||'';
    renderAccessoryGallery();
  }
  $('reset').addEventListener('click',()=>{state=initial();sync();renderGallery();render();});
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
