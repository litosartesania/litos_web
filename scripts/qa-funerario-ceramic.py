"""The optional ceramic image stays in the browser and exports with the slab."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from tempfile import TemporaryDirectory
from urllib.parse import urlsplit
import struct,zlib
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass

def synthetic_png():
 def chunk(kind,data):return struct.pack('>I',len(data))+kind+data+struct.pack('>I',zlib.crc32(kind+data)&0xffffffff)
 width,height=64,80
 scan=b''.join(b'\0'+b''.join(bytes((x*3%256,y*3%256,155)) for x in range(width)) for y in range(height))
 return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',width,height,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(scan))+chunk(b'IEND',b'')

server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root/'_site')))
thread=Thread(target=server.serve_forever,daemon=True);thread.start()
try:
 with TemporaryDirectory() as temp:
  fixture=Path(temp)/'color-sintetico.png';fixture.write_bytes(synthetic_png())
  with sync_playwright() as p:
   browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
   page=browser.new_page(viewport={'width':390,'height':844},accept_downloads=True)
   requests=[];errors=[]
   page.on('request',lambda req:requests.append(req.url))
   page.on('pageerror',lambda error:errors.append(str(error)))
   page.goto(f'http://127.0.0.1:{server.server_port}/funerario.html#personalizar')
   page.wait_for_selector('#memorial-workbench[data-ready=true]',state='attached')
   page.locator('[data-preset="nicho-ceramica-oval"] button').click()
   page.locator('.memorial-case-detail-copy button').first.click()
   page.locator('.memorial-controls > details').evaluate_all('(els)=>els.forEach(e=>e.open=true)')
   assert page.locator('#memorial-ceramic-upload').is_visible()
   assert page.locator('[data-accessory=ceramica-oval] image').count()==0
   page.locator('#memorial-ceramic-file').set_input_files(str(fixture))
   page.wait_for_selector('[data-accessory=ceramica-oval] image')
   assert page.locator('[data-accessory=ceramica-oval] image').get_attribute('href').startswith('data:image/jpeg;base64,')
   assert page.locator('#memorial-plan-measures').inner_text().find('Fotocerámica oval')>=0 or page.locator('#memorial-plan-download').is_disabled()
   with page.expect_download() as pending:page.locator('#memorial-download').click()
   assert Path(pending.value.path()).read_bytes()[:8]==b'\x89PNG\r\n\x1a\n'
   page.locator('#memorial-ceramic-clear').click()
   page.wait_for_function('()=>!document.querySelector("[data-accessory=ceramica-oval] image")')
   assert not errors,errors
   assert all(u.startswith('blob:') or urlsplit(u).hostname=='127.0.0.1' for u in requests),requests
   browser.close()
   print('PASS: optional synthetic ceramic image, local export and removal; zero third-party requests')
finally:
 server.shutdown();server.server_close();thread.join(timeout=2)
