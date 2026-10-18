/* Local, ephemeral controls. Inscription content never enters storage, URLs or requests. */
(() => {
  'use strict';
  const root=document.getElementById('memorial-workbench');if(!root)return;
  const $=id=>document.getElementById('memorial-'+id);
  const {catalog,resources}=window.LitosMemorialData;
  // Move the same interactive controls into the wide toolbar above the larger stone.
  const toolbar=$('toolbar');
  if(toolbar){
    for(const id of ['stone','variant','model','layout','type']){
      const input=$(id),label=document.querySelector('label[for="memorial-'+id+'"]');
      if(!input||!label)continue;
      const field=document.createElement('div');field.className='memorial-quick-field';
      field.append(label,input);toolbar.append(field);
    }
    const library=root.querySelector('.memorial-library');
    if(library)toolbar.append(library);
  }
  const initial=()=>({stone:'sudafrica',variant:'1',model:'nicho',layout:'centrado',type:'aldine',finish:'auto',symbol:'clasica',devotional:'ninguno',ornament:'olivo',secondary:'ninguno',separator:'linea',frame:'fino',ornamentFinish:'auto',fixings:false,guides:false,textSize:100,leading:130,align:'center',symbolPlacement:{x:50,y:50,scale:85},devotionalPlacement:{x:50,y:50,scale:85},ornamentPlacement:{x:50,y:50,scale:85},secondaryPlacement:{x:50,y:50,scale:85},fields:Object.fromEntries(catalog.fields.map(f=>[f.id,{text:f.default,visible:true}]))});
  let state=initial(),scene,ready=false,exporting=false,frame;
  const selections={stone:'stone',variant:'variant',model:'model',layout:'layout',type:'type',finish:'finish',symbol:'symbol',devotional:'devotional',ornament:'ornament',secondary:'secondary',separator:'separator',frame:'frame','ornament-finish':'ornamentFinish',align:'align'};
  const swatches=[];
  for(const material of catalog.materials){
    const button=document.createElement('button');button.type='button';button.className='memorial-swatch';button.dataset.stone=material.id;
    button.setAttribute('aria-label',material.name);button.setAttribute('aria-pressed','false');
    const image=document.createElement('img');image.src=resources[material.variants[0].path];image.alt='';image.width=80;image.height=56;
    const label=document.createElement('span');label.textContent=material.name;button.append(image,label);$('swatches').append(button);swatches.push(button);
    button.addEventListener('click',()=>{state.stone=material.id;$('stone').value=material.id;requestRender();});
  }
  function status(message){$('status').textContent=message;}
  const galleryGroups={cruces:['cruces'],religiosas:['religiosas'],flores:['flores','simbolos'],secondary:['flores','simbolos'],marcos:['marcos'],separadores:['separadores']};
  const gallerySlot={cruces:'symbol',religiosas:'devotional',flores:'ornament',secondary:'secondary',marcos:'frame',separadores:'separator'};
  function selectMotif(slot,id){
    state[slot]=id;$(slot).value=id;
    if((slot==='devotional'||slot==='secondary')&&id!=='ninguno'&&!catalog.layouts.find(x=>x.id===state.layout)?.[slot]){
      state.layout='devocionlateral';$('layout').value=state.layout;
    }
    renderGallery();requestRender();
  }
  function renderGallery(force=false){
    const group=$('gallery-category').value,slot=gallerySlot[group];
    if(!force&&$('gallery').dataset.group===group){
      for(const button of $('gallery').querySelectorAll('button')){
        const selected=state[slot]===button.dataset.itemId;
        button.setAttribute('aria-pressed',String(selected));
        button.setAttribute('aria-label',(selected?'Seleccionado: ':'Elegir: ')+button.querySelector('.memorial-motif-name').textContent);
      }
      return;
    }
    const items=catalog.ornaments.filter(item=>galleryGroups[group].includes(item.category));
    const fragment=document.createDocumentFragment();
    const choices=[{id:'ninguno',name:'Sin elemento',category:''},...items];
    for(const item of choices){
      const button=document.createElement('button');button.type='button';button.className='memorial-motif';
      button.dataset.itemId=item.id;button.dataset.slot=slot;button.setAttribute('aria-pressed',String(state[slot]===item.id));
      button.setAttribute('aria-label',(state[slot]===item.id?'Seleccionado: ':'Elegir: ')+item.name);
      const image=document.createElement('span');image.className='memorial-motif-image';
      if(item.id==='ninguno'){image.textContent='—';image.setAttribute('aria-hidden','true');}
      else{const art=document.createElement('img');art.src='data:image/svg+xml,'+encodeURIComponent(resources[item.path]);art.alt='';art.loading='lazy';art.width=68;art.height=68;image.append(art);}
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
  $('gallery-category').addEventListener('change',()=>renderGallery(true));
  function render(){
    if(!ready)return;
    try{
      scene=window.LitosMemorialComposer.compose(state);
      scene.svg.id='memorial-slab';$('canvas').replaceChildren(scene.svg);
      $('caption').textContent=scene.material.name+' · '+scene.model.name+' · '+scene.layout.name;
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
