/* Local, ephemeral controls. Inscription content never enters storage, URLs or requests. */
(() => {
  'use strict';
  const root=document.getElementById('memorial-workbench');if(!root)return;
  const $=id=>document.getElementById('memorial-'+id);
  const {catalog,resources}=window.LitosMemorialData;
  const initial=()=>({stone:'sudafrica',variant:'1',model:'nicho',layout:'centrado',type:'aldine',finish:'auto',symbol:'clasica',ornament:'olivo',separator:'linea',frame:'fino',ornamentFinish:'auto',fixings:false,guides:false,textSize:100,leading:130,align:'center',symbolPlacement:{x:50,y:50,scale:85},ornamentPlacement:{x:50,y:50,scale:85},fields:Object.fromEntries(catalog.fields.map(f=>[f.id,{text:f.default,visible:true}]))});
  let state=initial(),scene,ready=false,exporting=false,frame;
  const selections={stone:'stone',variant:'variant',model:'model',layout:'layout',type:'type',finish:'finish',symbol:'symbol',ornament:'ornament',separator:'separator',frame:'frame','ornament-finish':'ornamentFinish',align:'align'};
  const swatches=[];
  for(const material of catalog.materials){
    const button=document.createElement('button');button.type='button';button.className='memorial-swatch';button.dataset.stone=material.id;
    button.setAttribute('aria-label',material.name);button.setAttribute('aria-pressed','false');
    const image=document.createElement('img');image.src=resources[material.variants[0].path];image.alt='';image.width=80;image.height=56;
    const label=document.createElement('span');label.textContent=material.name;button.append(image,label);$('swatches').append(button);swatches.push(button);
    button.addEventListener('click',()=>{state.stone=material.id;$('stone').value=material.id;requestRender();});
  }
  function status(message){$('status').textContent=message;}
  function render(){
    if(!ready)return;
    try{
      scene=window.LitosMemorialComposer.compose(state);
      scene.svg.id='memorial-slab';$('canvas').replaceChildren(scene.svg);
      $('caption').textContent=scene.material.name+' · '+scene.model.name+' · '+scene.layout.name;
      $('material-note').textContent=scene.material.description+' '+scene.material.status+(scene.material.id==='italia'?' · Variedad comercial exacta sin identificar.':'');
      $('model-note').textContent=scene.model.note;
      swatches.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.stone===state.stone)));
      document.getElementById('symbol-scale-value').textContent=state.symbolPlacement.scale+' %';
      document.getElementById('ornament-scale-value').textContent=state.ornamentPlacement.scale+' %';
      $('size-value').textContent=state.textSize+' %';$('leading-value').textContent=state.leading+' %';
      for(const prefix of ['symbol','ornament']){
        const disabled=state[prefix]==='ninguno';
        for(const suffix of ['x','y','scale'])$(prefix+'-'+suffix).disabled=disabled;
      }
      if(!exporting)status(scene.adjusted?'Composición actualizada. Tamaño ajustado para mantener el texto dentro de su zona.':'Composición actualizada. Lista para descargar.');
      root.setAttribute('aria-busy','false');root.dataset.ready='true';$('download').disabled=exporting;
    }catch(error){root.setAttribute('aria-busy','false');status('No se pudo actualizar la vista previa. '+error.message);$('download').disabled=true;}
  }
  function requestRender(){cancelAnimationFrame(frame);frame=requestAnimationFrame(render);}
  for(const [id,key] of Object.entries(selections))$(id).addEventListener('change',()=>{state[key]=$(id).value;requestRender();});
  for(const id of ['fixings','guides'])$(id).addEventListener('change',()=>{state[id]=$(id).checked;requestRender();});
  for(const [id,key] of [['size','textSize'],['leading','leading']])$(id).addEventListener('input',()=>{state[key]=Number($(id).value);requestRender();});
  for(const prefix of ['symbol','ornament'])for(const suffix of ['x','y','scale'])$(prefix+'-'+suffix).addEventListener('input',()=>{state[prefix+'Placement'][suffix]=Number($(prefix+'-'+suffix).value);requestRender();});
  for(const field of catalog.fields){
    const input=field.id==='name'?$('text'):$('field-'+field.id);
    input.addEventListener('input',()=>{state.fields[field.id].text=input.value.slice(0,field.max);requestRender();});
    $('show-'+field.id).addEventListener('change',()=>{state.fields[field.id].visible=$('show-'+field.id).checked;requestRender();});
  }
  function sync(){
    for(const [id,key] of Object.entries(selections))$(id).value=state[key];
    for(const id of ['fixings','guides'])$(id).checked=state[id];
    $('size').value=state.textSize;$('leading').value=state.leading;
    for(const prefix of ['symbol','ornament'])for(const suffix of ['x','y','scale'])$(prefix+'-'+suffix).value=state[prefix+'Placement'][suffix];
    for(const field of catalog.fields){(field.id==='name'?$('text'):$('field-'+field.id)).value=state.fields[field.id].text;$('show-'+field.id).checked=state.fields[field.id].visible;}
  }
  $('reset').addEventListener('click',()=>{state=initial();sync();render();});
  $('download').addEventListener('click',async()=>{
    if(!ready||exporting)return;
    cancelAnimationFrame(frame);render();
    exporting=true;$('download').disabled=true;status('Preparando la descarga en tu navegador…');
    try{await window.LitosMemorialExport.download(scene);status('Imagen preparada. La descarga incluye tu inscripción y el aviso de simulación.');}
    catch(error){status(error.message+' La composición sigue disponible.');}
    finally{exporting=false;$('download').disabled=false;}
  });
  sync();
  window.LitosMemorialComposer.loadFonts().then(()=>{ready=true;render();}).catch(error=>{root.setAttribute('aria-busy','false');status(error.message);});
})();
