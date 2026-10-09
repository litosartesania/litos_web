#!/usr/bin/env python3
"""Offline browser QA for three separate LITOS pages. Requires local Playwright and Chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,re
root=Path(__file__).resolve().parents[1]
site=root/'_site'
def inline(page):
 html=(site/page).read_text()
 css=(site/'styles.css').read_text()
 js=(site/'script.js').read_text()
 assets=['hero-workshop.webp','workshop-strip.webp','concept-mesa.webp','concept-lavabo.webp','concept-objetos.webp','limestone-texture.webp']+['catalogo/litos-'+x+'.webp' for x in ["banco-01","banco-02","consola-01","consola-02","lavabo-01","lavabo-02","mesa-auxiliar-01","mesa-auxiliar-02","mesa-centro-01","mesa-centro-02","mesa-comedor-01","mesa-comedor-02"]]
 for asset in assets:
  uri='data:image/webp;base64,'+base64.b64encode((site/'assets'/asset).read_bytes()).decode()
  css=css.replace('url("assets/'+asset+'")','url("'+uri+'")')
  html=html.replace('src="assets/'+asset+'"','src="'+uri+'"')
 html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+css+'</style>')
 html=html.replace('<script src="script.js"></script>','<script>'+js+'</script>')
 if page=='mobiliario.html':
  catalog=(site/'catalogo-precios.js').read_text()
  html=html.replace('<script src="catalogo-precios.js"></script>','<script>'+catalog+'</script>')
 return re.sub(r'<link rel="icon"[^>]+>','',html)
with sync_playwright() as app:
 browser=app.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(390,844),(820,1180),(1440,900)]:
  for file in ['index.html','funerario.html','mobiliario.html','aviso-legal.html','privacidad.html']:
   page=browser.new_page(viewport={'width':width,'height':height},reduced_motion='reduce')
   errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.set_content(inline(file))
   for image in page.locator('img').all():image.evaluate('(x)=>x.loading="eager"')
   page.wait_for_timeout(150)
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
    else:
     assert page.locator('.piece-card').count()==21
     assert page.locator('.piece-photos img').count()==12
     assert page.locator('.piece-amount').count()==21
     assert page.locator('#material-picker option').count()==8
     before=page.locator('[data-product="mesa-comedor-oval"] .piece-amount').inner_text()
     page.locator('#material-picker').select_option('calacatta')
     after=page.locator('[data-product="mesa-comedor-oval"] .piece-amount').inner_text()
     assert before!=after,(width,before,after)
     assert 'Calacatta' in page.locator('#catalog-count').inner_text()
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
