// Shared browser assertions, executed unchanged by local review and CI.
async () => {
  const assert=(ok,message)=>{if(!ok)throw Error(message);};
  const {catalog}=window.LitosMemorialData;
  const raf=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const select=async(id,value)=>{
    const el=document.getElementById('memorial-'+id);el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}));await raf();
    const figure=['devotional','ornament','secondary'].includes(id)&&catalog.ornaments.find(x=>x.id===value&&x.format==='image/webp');
    if(figure){
      const deadline=Date.now()+10000;
      while(!window.LitosMemorialData.resources[figure.path]&&Date.now()<deadline)await new Promise(resolve=>setTimeout(resolve,30));
      assert(window.LitosMemorialData.resources[figure.path],'selected figure loaded: '+value);
      await raf();
    }
  };
  const field=document.getElementById('memorial-text');
  const inscription='TEXTO FICTICIO DE PRUEBA';
  field.value=inscription;field.dispatchEvent(new Event('input',{bubbles:true}));await raf();
  const locationBefore=location.href;
  for(const material of catalog.materials)for(const variant of material.variants){
    await select('stone',material.id);await select('variant',variant.id);
    const svg=document.getElementById('memorial-slab');
    assert(svg.dataset.stone===material.id&&svg.dataset.variant===variant.id,'material/variant selection');
    assert(svg.querySelector('[data-field="name"]').textContent.includes(inscription),'material must retain text');
    assert(svg.querySelector('image').getAttribute('href').startsWith('data:image/webp;base64,'),'embedded texture');
  }
  for(const item of catalog.ornaments.filter(x=>x.publicSelectable!==false)){
    const target=item.category==='cruces'?'symbol':item.category==='religiosas'?'devotional':item.category==='separadores'?'separator':item.category==='marcos'?'frame':'ornament';
    await select(target,item.id);
    assert(document.querySelector(`[data-ornament="${item.category}:${item.id}"]`),'ornament present: '+item.id);
    await select(target,'ninguno');
    assert(!document.querySelector(`[data-ornament="${item.category}:${item.id}"]`),'ornament removable: '+item.id);
  }
  assert(document.querySelector('#memorial-gallery-religiosas'),'figurative group available');
  assert(document.querySelectorAll('#memorial-devotional option').length===9,'eight approved visual prototypes');
  assert(!document.getElementById('memorial-devotional').disabled,'devotional selector available');
  assert(!document.querySelector('[data-slot="devotional"]'),'devotional scene empty');
  assert(document.querySelectorAll('#memorial-gallery-religiosas .memorial-motif img').length===8,'eight figurative thumbnails');
  const galleryChoice=document.querySelector('#memorial-gallery-flores [data-item-id="rosaabierta"]');
  assert(galleryChoice&&galleryChoice.querySelector('img').src.startsWith('data:image/svg+xml,'),'neutral ornament gallery');
  galleryChoice.click();await raf();
  assert(document.querySelector('[data-ornament="flores:rosaabierta"]'),'gallery selects neutral floral ornament');
  await select('secondary','rosaabierta');
  assert(document.querySelector('[data-slot="secondary"][data-ornament="flores:rosaabierta"]'),'secondary motif combines with a neutral ornament');
  await select('secondary','ninguno');
  await select('symbol','latina');await select('ornament','rosa');
  const scale=document.getElementById('memorial-symbol-scale');scale.value='35';scale.dispatchEvent(new Event('input'));await raf();
  const sizeBefore=Number(document.querySelector('[data-ornament="cruces:latina"] svg').getAttribute('width'));
  scale.value='100';scale.dispatchEvent(new Event('input'));await raf();
  assert(Number(document.querySelector('[data-ornament="cruces:latina"] svg').getAttribute('width'))>sizeBefore,'symbol scale');
  const x=document.getElementById('memorial-symbol-x');x.value='0';x.dispatchEvent(new Event('input'));await raf();
  const xBefore=Number(document.querySelector('[data-ornament="cruces:latina"] svg').getAttribute('x'));
  scale.value='50';scale.dispatchEvent(new Event('input'));x.value='100';x.dispatchEvent(new Event('input'));await raf();
  assert(Number(document.querySelector('[data-ornament="cruces:latina"] svg').getAttribute('x'))>xBefore,'symbol position');
  const ySlider=document.getElementById('memorial-symbol-y');
  ySlider.value='0';ySlider.dispatchEvent(new Event('input'));await raf();
  const top=Number(document.querySelector('[data-ornament="cruces:latina"] svg').getAttribute('y'));
  ySlider.value='100';ySlider.dispatchEvent(new Event('input'));await raf();
  const bottom=Number(document.querySelector('[data-ornament="cruces:latina"] svg').getAttribute('y'));
  const currentFace=catalog.models.find(model=>model.id===document.getElementById('memorial-model').value).face;
  const crossHeight=Number(document.querySelector('[data-ornament="cruces:latina"] svg').getAttribute('height'));
  assert(Math.abs(top-currentFace[1]*1000)<.01&&Math.abs(bottom+crossHeight-(currentFace[1]+currentFace[3])*1000)<.01,'cross spans face vertically');
  scale.value='250';scale.dispatchEvent(new Event('input'));await raf();
  assert(Number(document.querySelector('[data-ornament="cruces:latina"] svg').getAttribute('width'))>sizeBefore*2,'expanded scale');
  for(const finish of catalog.finishes){await select('finish',finish.id);assert(document.getElementById('memorial-slab').dataset.finish,'engraving finish');}
  await select('finish','oro');
  assert(document.querySelector('[data-slot="symbol"]').getAttribute('color')===document.querySelector('[data-layer="text"]').getAttribute('fill'),'common ornament and text color');
  for(const font of catalog.fonts){await select('type',font.id);assert(document.fonts.check(`24px "${font.family}"`),'loaded font: '+font.id);}
  field.value='<img src=x onerror=alert(1)>';field.dispatchEvent(new Event('input'));await raf();
  assert(!document.querySelector('#memorial-rendered img'),'literal user text');
  assert(document.querySelector('[data-field="name"]').textContent.includes('<img'),'text preserved literally');
  assert(location.href===locationBefore,'inscription must not enter URL');
  const makeState=(model,layout,type,long)=>({stone:'absoluto',variant:'2',model,layout,type,finish:'auto',symbol:'clasica',devotional:'ninguno',ornament:'olivo',secondary:catalog.layouts.find(x=>x.id===layout).secondary?'rosaabierta':'ninguno',separator:'ornamental',frame:'fino',ornamentFinish:'auto',fixings:true,guides:false,textSize:150,leading:180,align:'center',symbolPlacement:{x:50,y:50,scale:100},devotionalPlacement:{x:50,y:50,scale:100},ornamentPlacement:{x:50,y:50,scale:100},secondaryPlacement:{x:50,y:50,scale:100},fields:Object.fromEntries(catalog.fields.map(f=>[f.id,{text:long?('Texto ficticio con áéíóú ñ y signos. ').repeat(9).slice(0,f.max):f.default,visible:true}]))});
  let compositions=0;
  const host=document.createElement('div');host.style.cssText='position:fixed;left:-2000px;top:0;width:1000px;height:1000px';document.body.append(host);
  for(const model of catalog.models)for(const layout of catalog.layouts)for(const font of catalog.fonts)for(const long of [false,true]){
    const scene=window.LitosMemorialComposer.compose(makeState(model.id,layout.id,font.id,long));host.replaceChildren(scene.svg);
    for(const text of scene.svg.querySelectorAll('text[data-zone]')){
      const zone=JSON.parse(text.dataset.zone),box=text.getBBox();
      assert(box.x>=zone.x-1&&box.y>=zone.y-1&&box.x+box.width<=zone.x+zone.w+1&&box.y+box.height<=zone.y+zone.h+1,`text overflow: ${model.id}/${layout.id}/${font.id}/${long}: ${JSON.stringify({zone,box:{x:box.x,y:box.y,w:box.width,h:box.height}})}`);
    }
    const textBoxes=scene.boxes.filter(b=>b.kind.startsWith('text:'));
    for(const decor of scene.boxes.filter(b=>['symbol','devotional','ornament','secondary'].includes(b.kind)))for(const text of textBoxes){
      assert(decor.x+decor.w<=text.x||text.x+text.w<=decor.x||decor.y+decor.h<=text.y||text.y+text.h<=decor.y,`symbol/text overlap: ${model.id}/${layout.id}/${font.id}/${decor.kind}/${text.kind}`);
    }
    const decorative=scene.boxes.filter(b=>['symbol','devotional','ornament','secondary'].includes(b.kind));
    for(let a=0;a<decorative.length;a++)for(let b=a+1;b<decorative.length;b++){
      const one=decorative[a],two=decorative[b];
      assert(one.x+one.w<=two.x||two.x+two.w<=one.x||one.y+one.h<=two.y||two.y+two.h<=one.y,`motif/motif overlap: ${model.id}/${layout.id}/${font.id}`);
    }
    compositions++;
  }
  host.remove();
  document.getElementById('memorial-reset').click();await raf();
  document.getElementById('memorial-width-mm').value='970';document.getElementById('memorial-width-mm').dispatchEvent(new Event('input'));
  document.getElementById('memorial-height-mm').value='800';document.getElementById('memorial-height-mm').dispatchEvent(new Event('input'));
  const plan=window.LitosMemorialExport.makePlan(window.LitosMemorialComposer.compose(makeState('nicho','centrado','aldine',false)),970,800);
  assert(plan.getAttribute('data-units')==='mm'&&plan.querySelector('[id="CARA_VISTA"] rect').getAttribute('width')==='970','dimensioned workshop plan');
  await raf();
  assert(!document.getElementById('memorial-plan-download').disabled,'plan download enabled with real dimensions');
  const name=document.getElementById('memorial-text');
  const visible=document.getElementById('memorial-show-name');visible.checked=false;visible.dispatchEvent(new Event('change'));await raf();
  assert(!document.querySelector('[data-field="name"]'),'hide field');
  visible.checked=true;visible.dispatchEvent(new Event('change'));await raf();
  assert(document.querySelector('[data-field="name"]'),'restore field');
  for(const align of ['left','right','center']){await select('align',align);assert(document.querySelector('[data-field="name"]').getAttribute('text-anchor')===({left:'start',right:'end',center:'middle'})[align],'alignment');}
  document.getElementById('memorial-reset').click();await raf();
  const face=catalog.models.find(x=>x.id==='nicho').face;
  assert(face[2]>0&&face[3]>0,'conceptual face dimensions');
  assert(document.documentElement.scrollWidth<=innerWidth+1,'page overflow');
  // Accordions defer offscreen thumbnails: request them before testing image integrity.
  const allImages=[...document.images];
  for(const img of allImages)img.loading='eager';
  await Promise.all(allImages.map(img=>img.decode()));
  assert(allImages.every(img=>img.complete&&img.naturalWidth>0),'broken image');
  return {compositions,materials:catalog.materials.length,variants:14,ornaments:catalog.ornaments.length,fonts:catalog.fonts.length,layouts:catalog.layouts.length,overflow:0};
}
