#!/usr/bin/env python3
"""Offline browser QA for three separate LITOS pages. Requires local Playwright and Chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,re
root=Path(__file__).resolve().parents[1]
site=root/'_site'
def inline(page):
 html=(site/page).read_text()
 if page=='mobiliario.html':
  assert 'simulación digital de tonalidad' not in html
  assert 'Explora las imágenes conceptuales originales' in html
  assert 'href="styles.css?v=stone-20261015-macetero8"' in html
  assert 'src="catalogo-precios.js?v=stone-20261015-macetero8"' in html
 css=(site/'styles.css').read_text()
 js=(site/'script.js').read_text()
 assets=['hero-workshop.webp','workshop-strip.webp','concept-mesa.webp','concept-lavabo.webp','concept-objetos.webp','limestone-texture.webp']+['catalogo/litos-'+x+'.webp' for x in ["banco-01","banco-02","consola-01","consola-02","lavabo-01","lavabo-02","mesa-auxiliar-01","mesa-auxiliar-02","mesa-centro-01","mesa-centro-02","mesa-comedor-01","mesa-comedor-02"]]
 for asset in assets:
  uri='data:image/webp;base64,'+base64.b64encode((site/'assets'/asset).read_bytes()).decode()
  css=css.replace('url("assets/'+asset+'")','url("'+uri+'")')
  html=html.replace('src="assets/'+asset+'"','src="'+uri+'"')
 html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+css+'</style>')
 html=html.replace('<link rel="stylesheet" href="styles.css?v=stone-20261015-macetero8">','<style>'+css+'</style>')
 html=html.replace('<script src="script.js"></script>','<script>'+js+'</script>')
 if page=='mobiliario.html':
  catalog=(site/'catalogo-precios.js').read_text()
  html=html.replace('<script src="catalogo-precios.js?v=stone-20261015-macetero8"></script>','<script>'+catalog+'</script>')
 return re.sub(r'<link rel="icon"[^>]+>','',html)
with sync_playwright() as app:
 browser=app.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--allow-file-access-from-files'])
 for width,height in [(390,844),(820,1180),(1440,900)]:
  for file in ['index.html','funerario.html','mobiliario.html','aviso-legal.html','privacidad.html']:
   page=browser.new_page(viewport={'width':width,'height':height},reduced_motion='reduce')
   errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto((site/file).resolve().as_uri(),wait_until='domcontentloaded')
   for image in page.locator('img').all():image.evaluate('(x)=>x.loading="eager"')
   page.wait_for_function("() => [...document.images].every(im => im.complete && im.naturalWidth > 0)", timeout=15000)
   sizes=page.evaluate('''() => ({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,images:[...document.images].every(x=>x.complete&&x.naturalWidth>0)})''')
   assert sizes['scroll']<=sizes['width']+1 and sizes['images'],(file,width,sizes)
   assert not errors,(file,width,errors)
   if width<=1080:
    page.locator('.menu-button').click()
    assert page.locator('.mobile-menu').is_visible()
    page.keyboard.press('Escape')
    assert not page.locator('.mobile-menu').is_visible()
   if file=='index.html':
    assert page.locator('a.path[href="funerario.html"]').count()==1
    assert page.locator('a.path[href="mobiliario.html"]').count()==1
    assert page.locator('form').count()==0
   elif file in ('funerario.html','mobiliario.html'):
    if file=='funerario.html':
     assert page.locator('.catalog-card').count()==3
     assert page.locator('.catalog-price').count()==3
     assert page.locator('#memorial-workbench').count()==1
     assert page.locator('#memorial-model option').count()==5
     assert page.locator('#memorial-stone option').count()==7
     assert page.locator('#memorial-type option').count()==6
     page.locator('#memorial-model').select_option('columbario')
     page.locator('#memorial-stone').select_option('macael')
     page.locator('#memorial-type').select_option('inglesa')
     page.locator('#memorial-finish').select_option('relieve')
     page.locator('#memorial-ornament').select_option('cruz')
     page.locator('#memorial-text').fill('SIEMPRE EN NUESTRA MEMORIA')
     assert page.locator('#memorial-slab').get_attribute('data-model')=='columbario'
     assert page.locator('#memorial-slab').get_attribute('data-stone')=='macael'
     assert page.locator('#memorial-slab').get_attribute('data-type')=='inglesa'
     assert 'SIEMPRE EN NUESTRA MEMORIA' in page.locator('#memorial-rendered').inner_text()
     assert page.locator('#memorial-decoration').inner_text()=='✝'
     page.locator('#memorial-text').fill('<img src=x onerror=alert(1)>')
     assert page.locator('#memorial-rendered img').count()==0
     assert page.locator('form').count()==0
    else:
     assert page.locator('.piece-card').count()==21
     assert page.locator('.piece-photos img').count()==0
     assert page.locator('.piece-amount').count()==21
     assert page.locator('#material-picker option').count()==10
     assert page.evaluate('window.LITOS_CATALOG_INFO.materials')==9
     assert page.locator('#material-color').get_attribute('title')=='Abrir selector de piedras'
     before=page.locator('[data-product="mesa-comedor-oval"] .piece-amount').inner_text()
     page.locator('#material-picker').select_option('calacatta')
     after=page.locator('[data-product="mesa-comedor-oval"] .piece-amount').inner_text()
     assert before!=after,(width,before,after)
     assert 'Calacatta' in page.locator('#catalog-count').inner_text()
     page.locator('#material-picker').select_option('granito')
     assert page.locator('#catalog-count').inner_text().endswith('Granito gris')
     assert page.locator('.material-preview .material-placeholder').count()==0,(width,'granito must have no placeholders',page.locator('.material-preview .material-placeholder').count())
     assert page.locator('[data-product="mesa-aux-ped"] .material-variant-figure img').get_attribute('src')=='assets/catalogo/revisiones/20261013/mesa-aux-ped-8-seleccion/mesa-aux-ped__granito.png'
     assert page.locator('.piece-grid .material-variant-figure img').count()==21,(width,'specific granite product pictures',page.locator('.piece-grid .material-variant-figure img').count())
     assert page.locator('.material-preview .piece-photos').count()==0
     assert page.locator('.concept-availability').count()==0
     assert page.locator('.concept-reference').count()==0
     assert page.locator('.material-placeholder').count()==0
     assert 'no representan necesariamente la piedra' in page.locator('.material-heading > p').inner_text() or 'no muestran necesariamente la piedra' in page.locator('.material-heading > p').inner_text()
     original_images=page.locator('.material-preview img').evaluate_all('(nodes)=>nodes.map(n=>n.getAttribute("src"))')
     assert all(src.startswith('assets/catalogo/') or src.startswith('data:image/webp;') for src in original_images)
     granite_filter=page.locator('.material-variant-figure img').first.evaluate('(e)=>getComputedStyle(e).filter')
     assert granite_filter=='none',(width,granite_filter)
     granite_price=page.locator('[data-product="mesa-comedor-oval"] .piece-amount').inner_text()
     page.locator('#material-picker').select_option('verde-alpi')
     green_price=page.locator('[data-product="mesa-comedor-oval"] .piece-amount').inner_text()
     green_filter=page.locator('.material-variant-figure img').first.evaluate('(e)=>getComputedStyle(e).filter')
     assert green_filter=='none',(width,green_filter)
     assert 'Verde Alpi' in page.locator('#catalog-count').inner_text()
     assert green_price!=granite_price,(width,green_price,granite_price)
     assert page.locator('[data-product="macetero"] .material-variant-figure img').count()==1
     assert page.locator('.material-preview img').evaluate_all('(nodes)=>nodes.map(n=>n.getAttribute("src"))')!=original_images
     for model in ('consola-esc','banco-esc','mesa-comedor-oval','mesa-comedor-red','mesa-comedor-rect','mesa-centro-mon','mesa-centro-red'):
      image=page.locator(f'[data-product="{model}"] .material-variant-figure img')
      assert image.get_attribute('src')==(f'assets/catalogo/revisiones/20261013/variantes/consola-esc__verde-alpi.png' if model=='consola-esc' else f'assets/catalogo/variantes/{model}__verde-alpi.png')
      image.evaluate('(el)=>{el.loading="eager"}')
      image.evaluate('(el)=>el.decode()')
      assert image.evaluate('(el)=>el.naturalWidth===1122&&el.naturalHeight===1402')
      assert image.evaluate('(el)=>getComputedStyle(el).filter')=='none'

     # Product 06 now has its nine distinct stone renderings, independently of drawings.
     for stone in ('caliza','macael','carrara','marquina','granito','cuarcita','calacatta','verde-alpi'):
      page.locator('#material-picker').select_option(stone)
      new=page.locator('[data-product="mesa-aux-ped"] .material-variant-figure img')
      assert new.count()==1
      assert new.get_attribute('src')=='assets/catalogo/revisiones/20261013/mesa-aux-ped-8-seleccion/mesa-aux-ped__'+stone+'.png'
      new.evaluate('(im)=>{im.loading="eager"}')
      new.evaluate('(im)=>im.decode()')
      assert new.evaluate('(im)=>im.naturalWidth===1122&&im.naturalHeight===1402')
      assert new.evaluate('(im)=>getComputedStyle(im).filter')=='none'
     # Ten newly selected products: correct material-specific graphics.
     page.locator('#material-picker').select_option('granito')
     for model in ('balda','banco-rect','consola-rect','cuenco','encimera-bano','encimera-cocina','lavabo-ped','lavabo-sobre','panel','peana'):
      im=page.locator(f'[data-product="{model}"] .material-variant-figure img')
      assert im.count()==1 and im.get_attribute('src')==f'assets/catalogo/revisiones/20261015/lote-80-originales/{model}__granito.png'
      im.evaluate('(e)=>{e.loading="eager"}')
      im.evaluate('(e)=>e.decode()')
      assert im.evaluate('(e)=>e.naturalWidth>1000&&e.naturalHeight>1300')
     # Bandeja: 8 selected stone-specific originals, 7 at 1122x1402 and granite at 1086x1448.
     for stone in ('caliza','macael','carrara','marquina','granito','cuarcita','calacatta','verde-alpi'):
      page.locator('#material-picker').select_option(stone)
      image=page.locator('[data-product="bandeja"] .material-variant-figure img')
      assert image.count()==1 and image.get_attribute('src')==f'assets/catalogo/revisiones/20261015/bandeja-8-candidatas/bandeja__{stone}.png'
      image.evaluate('(e)=>{e.loading="eager"}')
      image.evaluate('(e)=>e.decode()')
      assert image.evaluate('(e)=>e.naturalWidth===1086&&e.naturalHeight===1448' if stone=='granito' else '(e)=>e.naturalWidth===1122&&e.naturalHeight===1402')
      assert image.evaluate('(e)=>getComputedStyle(e).filter')=='none'
     # Final product Macetero: identical 1024x1536 originals in all eight stone variants.
     for stone in ('caliza','macael','carrara','marquina','granito','cuarcita','calacatta','verde-alpi'):
      page.locator('#material-picker').select_option(stone)
      im=page.locator('[data-product="macetero"] .material-variant-figure img')
      assert im.count()==1 and im.get_attribute('src')==f'assets/catalogo/revisiones/20261015/macetero-8-candidatas/macetero__{stone}.png'
      assert (im.get_attribute('width'),im.get_attribute('height'))==('1024','1536')
      im.evaluate('(e)=>{e.loading="eager"}')
      im.evaluate('(e)=>e.decode()')
      assert im.evaluate('(e)=>e.naturalWidth===1024&&e.naturalHeight===1536')
      assert im.evaluate('(e)=>getComputedStyle(e).filter')=='none'
      assert page.locator('.material-variant-figure img').count()==21 and page.locator('.material-placeholder').count()==0
     # Mesa auxiliar con baldas: all eight additional specific stone materials.
     assert page.evaluate('window.LITOS_CATALOG_INFO.approvedVariantImages')==189
     for stone in ('caliza','macael','carrara','marquina','granito','cuarcita','calacatta','verde-alpi'):
      page.locator('#material-picker').select_option(stone)
      im=page.locator('[data-product="mesa-aux-bal"] .material-variant-figure img')
      assert im.count()==1 and im.get_attribute('src')=='assets/catalogo/revisiones/20261014/mesa-aux-bal-8-seleccion/mesa-aux-bal__'+stone+'.png'
      im.evaluate('(x)=>{x.loading="eager"}')
      im.evaluate('(x)=>x.decode()')
      assert im.evaluate('(x)=>x.naturalWidth===1122&&x.naturalHeight===1402')
      assert im.evaluate('(x)=>getComputedStyle(x).filter')=='none'
     # New candidate previews: nine original material views remain untouched, seven added for travertine.
     page.locator('#material-picker').select_option('travertino')
     for model in ('mesa-aux-ped','mesa-aux-bal','lavabo-ped','lavabo-sobre','bandeja','cuenco','balda'):
      image=page.locator(f'[data-product="{model}"] .material-variant-figure img')
      assert image.count()==1
      assert image.get_attribute('src')=='assets/catalogo/revisiones/20261013/travertino-seleccion/'+model+'__travertino.png'
      image.evaluate('(el)=>{el.loading="eager"}')
      image.evaluate('(el)=>el.decode()')
      assert image.evaluate('(el)=>el.naturalWidth===1122&&el.naturalHeight===1402')
     for model in ('consola-rect','banco-rect','encimera-bano','encimera-cocina','panel','peana','macetero'):
      image=page.locator(f'[data-product="{model}"] .material-variant-figure img')
      assert image.count()==1
      assert image.get_attribute('src')=='assets/catalogo/revisiones/20261013/travertino-extra-seleccion/'+model+'__travertino.png'
      image.evaluate('(el)=>{el.loading="eager"}')
      image.evaluate('(el)=>el.decode()')
      assert image.evaluate('(el)=>el.naturalWidth===1086&&el.naturalHeight===1448')
     assert page.locator('.material-variant-figure img').count()==21
     assert page.locator('.material-placeholder').count()==0
     # Nine new renderings must match the catalog material and never reuse outdated console art.
     for stone in ('travertino','caliza','macael','carrara','marquina','granito','cuarcita','calacatta','verde-alpi'):
      page.locator('#material-picker').select_option(stone)
      console=page.locator('.piece-grid [data-product="consola-esc"] .material-variant-figure img')
      assert console.count()==1
      assert console.get_attribute('src')=='assets/catalogo/revisiones/20261013/variantes/consola-esc__'+stone+'.png'
      console.evaluate('(e)=>{e.loading="eager"}')
      console.evaluate('(e)=>e.decode()')
      assert console.evaluate('(e)=>e.naturalWidth===1122&&e.naturalHeight===1402')
     page.locator('#material-picker').select_option('verde-alpi')
     assert page.locator('[data-product="consola-rect"] .material-variant-figure img').is_visible()
     assert 'colourofstone.com' in page.locator('#material-source').get_attribute('href')
     # Technical view is a tenth presentation option, NOT a tenth stone.
     last_price=page.locator('[data-product="mesa-comedor-oval"] .piece-amount').inner_text()
     page.locator('#material-picker').select_option('plano-tecnico')
     assert page.locator('.technical-placeholder').count()==0
     assert page.locator('.technical-drawing-figure img').count()==21
     for image in page.locator('.technical-drawing-figure img').all():
      image.evaluate('(el)=>{el.loading="eager"}')
      image.evaluate('(el)=>el.decode()')
      assert image.evaluate("(el)=>el.naturalWidth===(el.src.includes('/revisiones/20261013/planos/')?1448:1600)&&el.naturalHeight===(el.src.includes('/revisiones/20261013/planos/')?1086:1200)")
     assert page.locator('#material-source').is_hidden()
     assert all(page.locator(f'[data-product="{id}"] .technical-drawing-figure img').get_attribute('src')=='assets/catalogo/revisiones/20261013/planos-12-seleccion/'+id+'.png' for id in ('mesa-aux-bal','consola-rect','banco-rect','lavabo-sobre','encimera-bano','encimera-cocina','balda','panel','bandeja','peana','cuenco','macetero'))
     assert page.locator('#catalog-count').inner_text().endswith('(21/21 disponibles)')
     assert page.locator('[data-product="mesa-comedor-oval"] .piece-amount').inner_text()==last_price
     assert page.locator('.technical-drawing-figure img').count()==21
     for corrected in ('mesa-comedor-oval','consola-esc'):
      revised=page.locator('.piece-grid [data-product="'+corrected+'"] .technical-drawing-figure img')
      assert revised.get_attribute('src')=='assets/catalogo/revisiones/20261013/planos/'+corrected+'.png'
      revised.evaluate('(e)=>e.decode()')
     page.locator('#material-picker').select_option('verde-alpi')
     assert page.locator('.technical-placeholder').count()==0
     assert page.locator('#material-source').is_visible()
     page.locator('[data-category-filter="Baño"]').click()
     assert page.locator('.piece-card:visible').count()==3
     page.locator('[data-category-filter="Todos"]').click()
     assert page.locator('.piece-card:visible').count()==21
    assert page.locator('form').count()==0
    assert page.locator('.project-status').count()==1
    assert page.get_by_text('Por ahora no aceptamos encargos.').count()==1
   else:
    assert page.locator('.legal-content h2').count()>3
    assert page.locator('form').count()==0
   print('PASS',file,width)
   page.close()
 browser.close()

