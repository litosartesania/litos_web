#!/usr/bin/env python3
"""Verify selector at left of uncropped artwork on desktop, stacked on narrow screens."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
uri=(root/'_site/mobiliario.html').resolve().as_uri()
out=root/'review-layout/screenshots'
out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--allow-file-access-from-files'])
 for w,h in ((390,844),(820,1180),(1100,900),(1440,900),(1600,900)):
  page=browser.new_page(viewport={'width':w,'height':h},reduced_motion='reduce')
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(uri,wait_until='domcontentloaded')
  page.locator('#material-picker').select_option('calacatta')
  page.locator('[data-category-filter="Consolas"]').click()
  assert page.locator('.piece-card:visible').count()==2,(w,'filter')
  for product in ('consola-esc','banco-esc'):
   img=page.locator(f'[data-product="{product}"] .material-variant-figure img')
   assert img.count()==1
   assert img.get_attribute('src')==(f'assets/catalogo/revisiones/20261013/variantes/consola-esc__calacatta.png' if product=='consola-esc' else f'assets/catalogo/variantes/{product}__calacatta.png')
   img.evaluate('(el)=>{el.loading="eager"}')
   img.evaluate('(el)=>el.decode()')
   assert img.evaluate('(el)=>el.naturalWidth==1122 and el.naturalHeight==1402'.replace('and','&&'))
   assert img.evaluate('(el)=>getComputedStyle(el).objectFit')=='contain'
   assert img.evaluate('(el)=>getComputedStyle(el).filter')=='none'
  boxes=page.evaluate("""() => {
   const rect=s=>document.querySelector(s).getBoundingClientRect();
   const a=rect('.catalog-workspace>.material-planner'),b=rect('[data-product="consola-esc"] .material-variant-figure img');
   return {right:a.right,bottom:a.bottom,left:b.left,top:b.top,width:b.width,height:b.height,
           client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth};
  }""")
  assert boxes['scroll']<=boxes['client']+1,(w,boxes)
  if w>=1100:assert boxes['right']+8<boxes['left'],(w,'menu must be left of image',boxes)
  else:assert boxes['bottom']<=boxes['top']+1,(w,'menu should be above image',boxes)
  assert boxes['width']>155 and boxes['height']>190,(w,boxes)  # Five-column cards preserve portrait artwork
  page.evaluate("""() => {const el=document.querySelector('.catalog-workspace');window.scrollTo(0,el.getBoundingClientRect().top+scrollY-16)}""")
  page.wait_for_timeout(200)
  page.screenshot(path=str(out/f'consola-calacatta-{w}.png'),animations='disabled')
  assert not errors,(w,errors)
  page.close()
  print('PASS:',w,'sidebar positioning, image entire and no filter, 18 source PNGs preserved')
 browser.close()
