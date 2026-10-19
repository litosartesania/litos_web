/* Local, ephemeral controls. Inscription content never enters storage, URLs or requests. */
(() => {
  'use strict';
  const root=document.getElementById('memorial-workbench');if(!root)return;
  const $=id=>document.getElementById('memorial-'+id);
  const {catalog,resources}=window.LitosMemorialData;
  const isPublic=item=>item.publicSelectable!==false;
  const publicOrnaments=catalog.ornaments.filter(isPublic);
  // Keep ALL configuration controls in one scrollable left rail, including the motif library.
  // Do not duplicate any input IDs or state: move existing nodes so event listeners stay intact.
  const toolbar=$('toolbar');
  const controls=root.querySelector('.memorial-controls');
  const sidebar=document.createElement('aside');
  sidebar.className='memorial-options';
  sidebar.setAttribute('aria-label','Opciones de personalización de la lápida');
  const overview=document.createElement('details');
  overview.className='memorial-selection-overview';
  overview.setAttribute('aria-label','Resumen de elementos seleccionados');
  const overviewHeading=document.createElement('summary');
  overviewHeading.className='memorial-selection-title';
  const overviewName=document.createElement('span');
  overviewName.textContent='Tu configuración';
  const overviewCompact=document.createElement('span');
  overviewCompact.className='memorial-selection-compact';
  overviewHeading.append(overviewName,overviewCompact);
  const overviewGrid=document.createElement('div');
  overviewGrid.className='memorial-selection-grid';
  overview.append(overviewHeading,overviewGrid);
  root.prepend(sidebar);
  sidebar.append(overview);
  if(toolbar){
    sidebar.append(toolbar);
    for(const id of ['stone','variant','model','layout','type']){
      const input=$(id),label=document.querySelector('label[for="memorial-'+id+'"]');
      if(!input||!label)continue;
      const field=document.createElement('div');field.className='memorial-quick-field';
      field.append(label,input);toolbar.append(field);
    }
    const library=root.querySelector('.memorial-library');
    if(library)toolbar.append(library);
  }
  if(controls)sidebar.append(controls);
  function renderSelection(){
    const selected=[
      ['Piedra','stone'],['Textura','variant'],['Modelo','model'],
      ['Composición','layout'],['Tipografía','type'],['Cruz','symbol'],
      ['Imagen','devotional'],
      ['Ornamento','ornament'],['Adicional','secondary'],['Marco','frame'],
      ['Separador','separator'],['Color','finish']
    ];
    const items=document.createDocumentFragment();
    for(const [label,id] of selected){
      const select=$(id);
      if(!select)continue;
      const item=document.createElement('div');item.className='memorial-selection-item';
      const key=document.createElement('span');key.className='memorial-selection-key';key.textContent=label;
      const value=document.createElement('strong');value.className='memorial-selection-value';
      value.textContent=select.selectedOptions?.[0]?.textContent?.trim()||'Sin seleccionar';
      item.append(key,value);items.append(item);
    }
    overviewGrid.replaceChildren(items);
    const chosen=id=>$(id).selectedOptions?.[0]?.textContent?.trim()||'';
    const short=[chosen('stone'),chosen('layout')];
    if($('devotional').value!=='ninguno')short.push(chosen('devotional'));
    overviewCompact.textContent=short.join(' · ');
    overviewCompact.title=overviewCompact.textContent;
  }
  const initial=()=>({stone:'sudafrica',variant:'1',model:'nicho',layout:'centrado',type:'aldine',finish:'auto',symbol:'clasica',devotional:'ninguno',ornament:'olivo',secondary:'ninguno',separator:'linea',frame:'fino',fixings:false,guides:false,textSize:100,leading:130,align:'center',symbolPlacement:{x:50,y:50,scale:85},devotionalPlacement:{x:50,y:50,scale:85},ornamentPlacement:{x:50,y:50,scale:85},secondaryPlacement:{x:50,y:50,scale:85},fields:Object.fromEntries(catalog.fields.map(f=>[f.id,{text:f.default,visible:true}]))});
  let state=initial(),scene,ready=false,exporting=false,frame;
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
      if(state.devotional===item.id)requestRender();
    });
  }
  const selections={stone:'stone',variant:'variant',model:'model',layout:'layout',type:'type',finish:'finish',symbol:'symbol',devotional:'devotional',ornament:'ornament',secondary:'secondary',separator:'separator',frame:'frame',align:'align'};
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
        const item=box.id?catalog.ornaments.find(candidate=>candidate.id===box.id):null;
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
    for(const option of select.options){
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
    if(figure&&!resources[figure.path]){
      scene=null;$('download').disabled=true;
      root.setAttribute('aria-busy','true');
      const message=pictorialErrors.has(figure.path)?'No se pudo cargar la figura. Elige otra o inténtalo de nuevo.':'Cargando la figura seleccionada…';
      const placeholder=document.createElement('p');placeholder.textContent=message;$('canvas').replaceChildren(placeholder);
      status(message);
      return;
    }
    try{
      scene=window.LitosMemorialComposer.compose(state);
      scene.svg.id='memorial-slab';$('canvas').replaceChildren(scene.svg);
      $('caption').textContent=scene.material.name+' · '+scene.model.name+' · '+scene.layout.name;
      $('material-note').textContent=scene.material.description+' '+scene.material.status+(scene.material.id==='italia'?' · Variedad comercial exacta sin identificar.':'');
      $('model-note').textContent=scene.model.note;
      renderSelection();
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
      state[key]=next;requestRender();
    }
  });
  for(const id of ['fixings','guides'])$(id).addEventListener('change',()=>{state[id]=$(id).checked;requestRender();});
  for(const [id,key] of [['size','textSize'],['leading','leading']])$(id).addEventListener('input',()=>{state[key]=Number($(id).value);requestRender();});
  for(const id of ['width-mm','height-mm'])$(id).addEventListener('input',renderPlan);
  for(const prefix of ['symbol','devotional','ornament','secondary'])for(const suffix of ['x','y','scale'])$(prefix+'-'+suffix).addEventListener('input',()=>{state[prefix+'Placement'][suffix]=Number($(prefix+'-'+suffix).value);requestRender();});
  for(const field of catalog.fields){
    const input=field.id==='name'?$('text'):$('field-'+field.id);
    input.addEventListener('input',()=>{state.fields[field.id].text=input.value.slice(0,field.max);requestRender();});
    $('show-'+field.id).addEventListener('change',()=>{state.fields[field.id].visible=$('show-'+field.id).checked;requestRender();});
  }
  function sync(){
    for(const [id,key] of Object.entries(selections))$(id).value=state[key];
    for(const id of ['fixings','guides'])$(id).checked=state[id];
    $('size').value=state.textSize;$('leading').value=state.leading;
    for(const prefix of ['symbol','devotional','ornament','secondary'])for(const suffix of ['x','y','scale'])$(prefix+'-'+suffix).value=state[prefix+'Placement'][suffix];
    for(const field of catalog.fields){(field.id==='name'?$('text'):$('field-'+field.id)).value=state.fields[field.id].text;$('show-'+field.id).checked=state.fields[field.id].visible;}
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
  window.LitosMemorialComposer.loadFonts().then(()=>{ready=true;render();}).catch(error=>{root.setAttribute('aria-busy','false');status(error.message);});
})();
