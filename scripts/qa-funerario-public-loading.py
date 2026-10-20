"""Check public-like HTTP loading of visual prototypes and local PNG export."""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
class QuietHandler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=str(root/'_site')))
thread=Thread(target=server.serve_forever,daemon=True);thread.start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844},accept_downloads=True)
  requests=[];errors=[]
  page.on('request',lambda request:requests.append(request.url))
  page.on('pageerror',lambda error:errors.append(str(error)))
  page.goto(f'http://127.0.0.1:{server.server_port}/funerario.html#personalizar')
  page.wait_for_selector('#memorial-workbench[data-ready="true"]',state='attached')
  page.locator('#memorial-create').click()
  def full_art():return [u for u in requests if '/relieves/' in urlsplit(u).path and '/miniaturas/' not in u]
  assert not full_art(),full_art()
  assert not any('/accesorios/renders/' in u for u in requests),requests
  assert page.locator('#memorial-layout option').count()==9
  assert page.locator('#memorial-devotional option').count()==9
  page.locator('.memorial-controls > details').evaluate_all('(els)=>els.forEach(e=>e.open=true)')
  page.locator('.memorial-category-tab[data-category="religiosas"]').click()
  page.wait_for_function('()=>[...document.querySelectorAll("#memorial-gallery img")].length===8&&[...document.querySelectorAll("#memorial-gallery img")].every(x=>x.complete&&x.naturalWidth>0)')
  assert not full_art(),full_art()
  page.locator('.memorial-motif[data-item-id="cristo-corona"]').click()
  page.wait_for_selector('[data-slot="devotional"] image')
  assert len(full_art())==1 and full_art()[0].endswith('/cristo-corona.webp'),full_art()
  assert page.locator('[data-slot="devotional"] image').get_attribute('href').startswith('data:image/webp;base64,')
  page.locator('#memorial-stone').select_option('quintana')
  page.wait_for_function('()=>document.querySelector("#memorial-slab")?.dataset.stone==="quintana"')
  assert len(full_art())==1,full_art()
  # A failed full accessory must not export the previous composition or the thumbnail.
  page.route('**/accesorios/renders/bucaro.webp',lambda route:route.abort())
  page.locator('#memorial-accessory').select_option('bucaro')
  page.wait_for_function('()=>document.querySelector("#memorial-status").textContent.includes("No se pudo cargar")')
  assert page.locator('#memorial-download').is_disabled()
  assert page.locator('#memorial-plan-download').is_disabled()
  page.unroute('**/accesorios/renders/bucaro.webp')
  page.locator('#memorial-accessory').select_option('bucaro')
  page.wait_for_selector('[data-accessory="bucaro"] image')
  assert page.locator('[data-accessory="bucaro"] image').get_attribute('href').startswith('data:image/webp;')
  page.wait_for_function('()=>!document.querySelector("#memorial-download").disabled')
  page.locator('#memorial-text').evaluate('(el)=>{el.value="TEXTO DE PRUEBA PRIVADO";el.dispatchEvent(new Event("input",{bubbles:true}))}')
  with page.expect_download() as pending:page.locator('#memorial-download').click()
  data=Path(pending.value.path()).read_bytes()
  assert data[:8]==b'\x89PNG\r\n\x1a\n' and int.from_bytes(data[16:20],'big')==2000
  assert not any('TEXTO%20DE%20PRUEBA' in u for u in requests)
  assert not errors,errors
  assert all(u.startswith('blob:') or urlsplit(u).hostname=='127.0.0.1' for u in requests),requests
  print('PASS: eight thumbnails, one selected full image, stone change reuses art, accessory retry recovery, PNG 2000 px, no visitor text requests')
  browser.close()
finally:
 server.shutdown();server.server_close();thread.join(timeout=2)
