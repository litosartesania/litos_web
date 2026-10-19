"""Browser acceptance for the self-contained figurative-relief reviewer."""
from pathlib import Path
import base64,json
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
review=root/'preview/LITOS_REVISION_RELIEVES_FASE3.html'
ids=['cristo-corona','cristo-crucificado','virgen-nino','san-jose-nino','angel','paloma-olivo','medallon-mariano','medallon-cristo']
stones=['sudafrica','italia','quintana']
layouts=['relievelateral','crucifijolateral','relievesuperior']
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
 for width,height in [(390,844),(768,1024),(1440,1000)]:
  context=browser.new_context(viewport={'width':width,'height':height},accept_downloads=True,reduced_motion='reduce')
  page=context.new_page();errors=[];external=[]
  page.on('pageerror',lambda error:errors.append(str(error)))
  page.on('request',lambda req:external.append(req.url) if req.url.startswith(('http://','https://')) else None)
  page.goto(review.as_uri())
  page.wait_for_selector('#memorial-workbench[data-ready="true"]')
  assert page.locator('#relief-review-only').count()==1
  assert page.locator('#memorial-devotional option').count()==9
  assert page.locator('#memorial-layout option').count()==9
  assert page.locator('#memorial-gallery-category option[value="religiosas"]').count()==1
  page.locator('.memorial-controls > details').nth(1).locator('summary').click()
  page.locator('.memorial-controls > details').nth(0).locator('summary').click()
  page.locator('.memorial-category-tab[data-category="religiosas"]').click()
  assert page.locator('#memorial-gallery .memorial-motif img').count()==8
  assert page.locator('#memorial-gallery img').evaluate_all('(els)=>els.every(e=>e.src.startsWith("data:image/webp;base64,"))')
  page.locator('#memorial-gallery img').evaluate_all('(els)=>els.forEach(e=>e.loading="eager")')
  page.wait_for_function('()=>[...document.querySelectorAll("#memorial-gallery img")].every(x=>x.complete&&x.naturalWidth>0)')
  count=page.evaluate("""({ids,stones,layouts})=>{
   const c=window.LitosMemorialData.catalog,host=document.createElement('div');
   host.style.cssText='position:fixed;left:-2000px;top:0;width:1000px;height:1000px';document.body.append(host);
   let n=0;
   const overlap=(a,b)=>!(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y);
   for(const stone of stones)for(const id of ids)for(const layout of layouts){
    const state={stone,variant:'1',model:'nicho',layout,type:'aldine',finish:'auto',symbol:'clasica',devotional:id,ornament:'olivo',secondary:'ninguno',separator:'linea',frame:'fino',ornamentFinish:'auto',fixings:false,guides:false,textSize:100,leading:130,align:'center',symbolPlacement:{x:50,y:50,scale:85},devotionalPlacement:{x:50,y:50,scale:100},ornamentPlacement:{x:50,y:50,scale:85},secondaryPlacement:{x:50,y:50,scale:85},fields:Object.fromEntries(c.fields.map(f=>[f.id,{text:f.default,visible:true}]))};
    const scene=window.LitosMemorialComposer.compose(state);host.replaceChildren(scene.svg);
    const art=scene.svg.querySelector('[data-slot="devotional"] image');
    if(!art?.getAttribute('href')?.startsWith('data:image/webp;base64,'))throw Error('raster missing: '+id);
    const reliefStyle=getComputedStyle(art.closest('[data-slot="devotional"]'));
    if(reliefStyle.mixBlendMode!=='normal'||Number(reliefStyle.opacity)!==1)throw Error('translucent relief '+id);
    if(scene.warnings.length||scene.truncated||scene.unrendered)throw Error('invalid composition '+stone+'/'+id+'/'+layout+': '+scene.warnings);
    const figure=scene.boxes.find(x=>x.kind==='devotional');
    for(const box of scene.boxes.filter(x=>x.kind.startsWith('text:')))if(overlap(figure,box))throw Error('figure/text overlap '+id+'/'+layout);
    for(const text of scene.svg.querySelectorAll('text[data-zone]')){
     const z=JSON.parse(text.dataset.zone),b=text.getBBox();
     if(b.x<z.x-1||b.y<z.y-1||b.x+b.width>z.x+z.w+1||b.y+b.height>z.y+z.h+1)throw Error('text overflow '+id+'/'+layout);
    }
    n++;
   }
   host.remove();return n;
  }""",{'ids':ids,'stones':stones,'layouts':layouts})
  assert count==72 and page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  # The six already visible prototype crosses also need a three-stone check.
  cross_count=page.evaluate("""({stones})=>{
   const c=window.LitosMemorialData.catalog;
   let n=0;
   for(const stone of stones)for(const symbol of ['santiago','doblefilete','moldurada','metalica','florenzada','medalloncruz']){
    const state={stone,variant:'1',model:'nicho',layout:'centrado',type:'aldine',finish:'auto',symbol,devotional:'ninguno',ornament:'ninguno',secondary:'ninguno',separator:'ninguno',frame:'ninguno',ornamentFinish:'auto',fixings:false,guides:false,textSize:100,leading:130,align:'center',symbolPlacement:{x:50,y:50,scale:85},devotionalPlacement:{x:50,y:50,scale:100},ornamentPlacement:{x:50,y:50,scale:85},secondaryPlacement:{x:50,y:50,scale:85},fields:Object.fromEntries(c.fields.map(f=>[f.id,{text:f.default,visible:true}]))};
    const scene=window.LitosMemorialComposer.compose(state);
    const art=scene.svg.querySelector('[data-slot="symbol"]');
    if(!art||!art.dataset.technique||scene.warnings.length||scene.truncated||scene.unrendered)throw Error('cross failed '+stone+'/'+symbol);
    if(symbol==='metalica'&&!art.dataset.technique.includes('aplique metálico'))throw Error('metal technique missing');
    n++;
   }
   return n;
  }""",{'stones':stones})
  assert cross_count==18
  # Select a real candidate through the reviewer, change stone, then export the same scene.
  page.locator('#memorial-layout').select_option('relievelateral')
  page.locator('#memorial-devotional').evaluate('(el)=>{el.value="cristo-corona";el.dispatchEvent(new Event("change",{bubbles:true}))}')
  page.wait_for_selector('[data-slot="devotional"] image')
  png_checks=[]
  for stone in stones:
   page.locator('#memorial-stone').select_option(stone)
   page.wait_for_function('(id)=>document.querySelector("#memorial-slab")?.dataset.stone===id',arg=stone)
   assert page.locator('#memorial-download').is_enabled()
   if width==1440:page.locator('#memorial-canvas').screenshot(path=str(root/'preview'/f'LITOS_FASE3_{stone.upper()}_RELIEVE.png'))
   with page.expect_download() as pending:page.locator('#memorial-download').click()
   data=Path(pending.value.path()).read_bytes()
   assert data[:8]==b'\x89PNG\r\n\x1a\n' and int.from_bytes(data[16:20],'big')==2000
   difference=page.evaluate("""async b64=>{
    const svg=document.querySelector('#memorial-slab');
    const zone=JSON.parse(svg.querySelector('[data-slot="devotional"]').dataset.zone);
    const load=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src});
    const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));
    let visible,downloaded;
    try{[visible,downloaded]=await Promise.all([load(url),load('data:image/png;base64,'+b64)]);}finally{URL.revokeObjectURL(url);}
    const canvases=[visible,downloaded].map(im=>{const c=document.createElement('canvas');c.width=c.height=1000;c.getContext('2d').drawImage(im,0,0,1000,1000);return c});
    const a=canvases[0].getContext('2d').getImageData(zone.x,zone.y,zone.w,zone.h).data;
    const b=canvases[1].getContext('2d').getImageData(zone.x,zone.y,zone.w,zone.h).data;
    let sum=0,count=0;for(let i=0;i<a.length;i+=16)for(let k=0;k<3;k++){sum+=Math.abs(a[i+k]-b[i+k]);count++}
    return sum/count;
   }""",base64.b64encode(data).decode('ascii'))
   assert difference<7,(stone,difference)
   png_checks.append({'stone':stone,'art_region_mean_rgb_difference':round(difference,2)})
  assert not errors and not external,(errors,external)
  results.append({'viewport':width,'compositions':count,'cross_compositions':cross_count,'png_comparisons':png_checks,'javascript_errors':0,'external_requests':0})
  context.close()
 for width in (390,1440):
  page=browser.new_page(viewport={'width':width,'height':900});errors=[];external=[]
  page.on('pageerror',lambda error:errors.append(str(error)))
  page.on('request',lambda req:external.append(req.url) if req.url.startswith(('http://','https://')) else None)
  page.goto((root/'preview/LITOS_GALERIA_RELIEVES_FASE3.html').as_uri())
  assert page.locator('.card').count()==8 and page.locator('.stone-button').count()==3
  page.locator('.stone-button[data-stone="quintana"]').click()
  page.locator('.card[data-id="medallon-mariano"]').click()
  assert page.locator('.card[data-id="medallon-mariano"]').get_attribute('aria-pressed')=='true'
  assert page.locator('.stone-button[data-stone="quintana"]').get_attribute('aria-pressed')=='true'
  assert page.locator('#chosen-art').evaluate('(x)=>x.complete&&x.naturalWidth>0')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  if width==1440:page.screenshot(path=str(root/'preview/LITOS_GALERIA_RELIEVES_FASE3.png'),full_page=True)
  assert not errors and not external,(errors,external)
  page.close()
 compare=browser.new_page(viewport={'width':1440,'height':900});errors=[];external=[]
 compare.on('pageerror',lambda error:errors.append(str(error)))
 compare.on('request',lambda req:external.append(req.url) if req.url.startswith(('http://','https://')) else None)
 compare.goto((root/'preview/LITOS_COMPARACION_FIGURAS_FASE3.html').as_uri())
 assert compare.locator('.row').count()==4 and compare.locator('.tile img').count()==8
 compare.wait_for_function('()=>[...document.querySelectorAll(".tile img")].every(x=>x.complete&&x.naturalWidth>0)')
 assert not errors and not external,(errors,external)
 compare.screenshot(path=str(root/'preview/LITOS_COMPARACION_FIGURAS_FASE3.png'),full_page=True)
 compare.close()
 browser.close()
print(json.dumps({'status':'PASS','isolated_candidates':len(ids),'results':results},ensure_ascii=False,indent=2))
