"""PR72 acceptance: presets, state, all accessories, placement, metric bounds and techniques."""
from pathlib import Path
import json,base64
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
 page=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto((root/'preview/LITOS_CONFIGURADOR_FUNERARIO.html').as_uri())
 page.wait_for_selector('#memorial-workbench[data-ready=true]',state='attached')
 models=page.evaluate('window.LitosMemorialData.catalog.commercialModels')
 for model in models:
  page.locator('[data-preset="'+model['id']+'"] button').click()
  assert page.locator('#memorial-case-detail h5').evaluate('(e)=>e===document.activeElement')
  page.locator('.memorial-case-detail-copy button').first.click()
  page.wait_for_function('()=>!document.querySelector("#memorial-download").disabled')
  for field in ['stone','model','layout','symbol','devotional','ornament','frame','type','finish','accessory']:
   assert page.locator('#memorial-'+field).input_value()==model['state'][field],(model['id'],field)
  assert model['title'] in page.locator('#memorial-caption').inner_text()
  if model['id']=='nicho-cruz-incisa-florero':
   # Relative geometry and fictitious lettering must travel with a selected case.
   assert page.locator('#memorial-symbol-scale').input_value()=='180'
   assert page.locator('#memorial-symbol-x').input_value()=='16'
   assert page.locator('#memorial-symbol-y').input_value()=='65'
   assert page.locator('#memorial-accessory-x').input_value()=='100'
   assert page.locator('#memorial-accessory-scale').input_value()=='75'
   assert page.locator('#memorial-width-mm').input_value()=='1080'
   assert page.locator('#memorial-height-mm').input_value()=='720'
   assert not page.locator('#memorial-show-header').is_checked()
   assert page.locator('#memorial-field-epitaph').input_value()=='D. E. P.'
   bounds=page.locator('[data-slot=symbol] svg').evaluate('(e)=>({w:+e.getAttribute("width"),h:+e.getAttribute("height"),ratio:e.getAttribute("preserveAspectRatio")})')
   assert bounds['h']>bounds['w']*1.2 and bounds['ratio']=='none',bounds
   assert page.locator('[data-slot=accessory][data-accessory=florero]').count()==1
   page.locator('#memorial-canvas').scroll_into_view_if_needed()
   page.screenshot(path=str(root/'preview/LITOS_NICHO_CRUZ_VERTICAL.png'))
  page.locator('#memorial-back-catalog').click()
 page.locator('#memorial-filter-type').select_option('panteon')
 page.locator('#memorial-filter-stone').select_option('oscura')
 assert page.locator('.memorial-case-card').count()==0
 page.locator('#memorial-filter-reset').click()
 assert page.locator('.memorial-case-card').count()==10
 page.locator('#memorial-create').click()
 page.locator('#memorial-reset').click()
 page.locator('.memorial-controls details').evaluate_all('(els)=>els.forEach(e=>e.open=true)')
 # Shared regression scenarios retain full-face cross movement, typography and safe layouts.
 scenarios=page.evaluate((root/'scripts/funerario-scenarios.js').read_text())
 page.locator('.memorial-controls details').evaluate_all('(els)=>els.forEach(e=>e.open=true)')
 for width,height in [(900,700),(500,1100),(1300,450)]:
  page.locator('#memorial-width-mm').fill(str(width));page.locator('#memorial-height-mm').fill(str(height))
  page.wait_for_function('()=>!document.querySelector("#memorial-plan-download").disabled')
  page.wait_for_function('(size)=>{const e=document.querySelector("#CARA_VISTA rect");return e&&+e.getAttribute("width")===size[0]&&+e.getAttribute("height")===size[1]}',arg=[width,height])
  ratio=page.evaluate('()=>{const e=document.querySelector("#CARA_VISTA rect");return +e.getAttribute("width")/+e.getAttribute("height")}')
  assert abs(ratio-width/height)<1e-6
 assert page.locator('.memorial-accessory-card img').evaluate_all('(imgs)=>imgs.every(i=>{const a=i.getBoundingClientRect(),b=i.closest("button").lastElementChild.getBoundingClientRect();return a.bottom<=b.top+1})'),'accessory thumbnails overlap labels'
 for item in page.evaluate('window.LitosMemorialData.catalog.accessories'):
  page.locator('#memorial-accessory').select_option(item['id'])
  page.wait_for_selector('[data-accessory="'+item['id']+'"] image')
  page.wait_for_function('()=>!document.querySelector("#memorial-download").disabled')
  assert page.locator('[data-slot=accessory] image').get_attribute('href').startswith('data:image/webp;')
  boxes=[]
  for scale,x,y in [(25,0,0),(250,100,100)]:
   for key,value in [('scale',scale),('x',x),('y',y)]:
    page.locator('#memorial-accessory-'+key).evaluate('(el,v)=>{el.value=v;el.dispatchEvent(new Event("input"))}',str(value))
   page.wait_for_timeout(60)
   box=json.loads(page.locator('[data-slot=accessory]').get_attribute('data-bounds'));boxes.append(box)
   assert box['x']>=0 and box['y']>=0 and box['x']+box['w']<=1000 and box['y']+box['h']<=1000
  assert boxes[1]['w']>boxes[0]['w'] and boxes[1]['x']>boxes[0]['x'] and boxes[1]['y']>boxes[0]['y']
  assert item['name'] in page.locator('#memorial-plan-measures').inner_text()
  page.locator('#memorial-accessorySide').select_option('left')
  page.wait_for_timeout(60)
  assert page.locator('#memorial-accessory-x').input_value()=='0'
 # Same source artwork, three different depth behaviours, on three stones.
 page.locator('#memorial-reset').click()
 page.locator('#memorial-devotional').select_option('cristo-corona')
 page.wait_for_selector('[data-slot=devotional] image')
 figures=[]
 for stone in ['absoluto','macael','quintana']:
  page.locator('#memorial-stone').select_option(stone)
  for technique in ['grabado','bajorrelieve','aplique 3D']:
   page.locator('#memorial-devotional-technique').select_option(technique)
   page.wait_for_function('(t)=>document.querySelector("[data-slot=devotional]")?.dataset.technique===t',arg=technique)
   page.wait_for_timeout(60)
   assert page.locator('#carved-relief feComposite[operator=out]').count()==2
   assert page.locator('#carved-relief feDropShadow').count()==0
   assert page.locator('#applied-relief feComposite[operator=out]').count()==1
   svg=page.locator('#memorial-slab').evaluate('(e)=>new XMLSerializer().serializeToString(e)')
   figures.append('<figure><figcaption>'+stone+' · '+technique+'</figcaption><img alt="Simulación de '+technique+'" src="data:image/svg+xml;base64,'+base64.b64encode(svg.encode()).decode()+'"></figure>')
 gallery='<!doctype html><html lang="es"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>LITOS · Técnicas comparadas</title><style>body{margin:2rem;background:#eee9e0;color:#30291f;font:16px system-ui}main{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}figure{margin:0}img{width:100%;height:auto}figcaption{padding:.7rem}h1{font:32px Georgia}p{max-width:70ch}@media(max-width:650px){main{grid-template-columns:1fr}}</style><h1>Tres técnicas, tres piedras</h1><p>Comparación de la misma figura original. Simulación de grabado superficial, tallado y aplique independiente. Materiales y fabricación sujetos a validación del taller.</p><main>'+''.join(figures)+'</main></html>'
 (root/'preview/LITOS_TECNICAS_PR72.html').write_text(gallery)
 for w,h in [(320,740),(390,844),(768,1024),(1440,1000)]:
  page.set_viewport_size({'width':w,'height':h})
  page.locator('#memorial-back-catalog').click();page.locator('#memorial-create').click()
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  if w<=768:
   assert page.locator('.memorial-preview-shortcut').is_visible()
   page.locator('.memorial-preview-shortcut').click()
   assert page.locator('#memorial-canvas').bounding_box()['y']>=0
  page.locator('.memorial-controls > details').evaluate_all('(els)=>els.forEach(e=>e.open=false)')
  page.locator('.memorial-controls > details > summary').first.click()
  page.locator('.memorial-next-step').first.click()
  assert page.locator('.memorial-controls > details').nth(1).get_attribute('open') is not None
  page.locator('#memorial-canvas').scroll_into_view_if_needed()
  page.screenshot(path=str(root/f'preview/LITOS_PR72_{w}.png'))
 assert not errors,errors
 browser.close()
print(json.dumps({'status':'PASS','presets':len(models),'accessories':10,'viewports':[320,390,768,1440],'regression':scenarios,'techniques':9,'errors':errors}))
