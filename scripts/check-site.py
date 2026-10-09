#!/usr/bin/env python3
"""Site separation, route integrity, build allowlist and release safety gate."""
from html.parser import HTMLParser
from pathlib import Path
import re,sys
from urllib.parse import unquote,urlsplit
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site').resolve()
pages=['index.html','funerario.html','mobiliario.html','aviso-legal.html','privacidad.html']
class Inspect(HTMLParser):
 def __init__(self):
  super().__init__(); self.ids=set();self.hrefs=[];self.assets=[];self.forms=[];self.cards=0;self.prices=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:
   assert a['id'] not in self.ids,a['id']
   self.ids.add(a['id'])
  if a.get('href'):self.hrefs.append(a['href'])
  if tag in ('img','script') and a.get('src'):self.assets.append(a['src'])
  if tag=='link' and a.get('rel') in ('stylesheet','icon'):self.assets.append(a.get('href'))
  if tag=='img':assert a.get('width') and a.get('height'),'image missing dimensions'
  if tag=='form':self.forms.append(a)
  if tag=='article' and 'catalog-card' in a.get('class','').split():self.cards+=1
  if tag=='p' and 'catalog-price' in a.get('class','').split():self.prices+=1
expected=set(pages+['styles.css','script.js','catalogo-precios.js']+[f'assets/{x}' for x in ['favicon.svg','hero-workshop.webp','workshop-strip.webp','limestone-texture.webp','concept-mesa.webp','concept-lavabo.webp','concept-objetos.webp']])
expected.update('assets/catalogo/litos-'+x+'.webp' for x in ["banco-01","banco-02","consola-01","consola-02","lavabo-01","lavabo-02","mesa-auxiliar-01","mesa-auxiliar-02","mesa-centro-01","mesa-centro-02","mesa-comedor-01","mesa-comedor-02"])
actual={x.relative_to(root).as_posix() for x in root.rglob('*') if x.is_file()}
assert actual==expected,(actual^expected)
assert sum(x.stat().st_size for x in root.rglob('*') if x.is_file())<2500000
htmls={p:(root/p).read_text() for p in pages}
parsers={}
for page,html in htmls.items():
 p=Inspect();p.feed(html);parsers[page]=p
 assert 'extremadura' not in html.lower()
 assert 'docs.google.com/forms' not in html and 'fonts.googleapis.com' not in html
 assert not any(x.startswith(('https:','http:','//')) for x in p.assets)
 for uri in p.hrefs+p.assets:
  if uri.startswith(('mailto:','tel:','https:','http:','//','data:')):continue
  u=urlsplit(uri)
  if u.path:
   name=unquote(u.path)
   assert not name.startswith('/') and '..' not in Path(name).parts
   assert (root/name).is_file(),(page,uri)
   if u.fragment:
    target=Inspect();target.feed(htmls.get(name,(root/name).read_text()))
    assert unquote(u.fragment) in target.ids
  elif u.fragment:assert unquote(u.fragment) in p.ids,(page,uri)
 assert not p.forms,(page,'informational-only website must not include forms')
assert not parsers['index.html'].forms and parsers['index.html'].cards==0 and 'id="precios"' not in htmls['index.html']
for page,count in [('funerario.html',3)]:
 p=parsers[page]
 assert p.cards==count and p.prices==count,(page,p.cards,p.prices)
 assert not p.forms and 'id="precios"' in htmls[page]
 assert 'No son precios de venta ni ofertas de LITOS' in htmls[page]
assert 'id="precios"' in htmls['mobiliario.html'] and 'id="material-picker"' in htmls['mobiliario.html'] and htmls['mobiliario.html'].count('<option value=')==9
assert 'id="material-color"' in htmls['mobiliario.html'] and 'value="verde-alpi"' in htmls['mobiliario.html']
assert 'simulación digital de tonalidad' in htmls['mobiliario.html']
assert 'https://colourofstone.com/es/shop/piedra-natural/azulejos/verde-alpi/' in (root/'catalogo-precios.js').read_text()
assert htmls['mobiliario.html'].count('class="piece-card"')==6
assert htmls['mobiliario.html'].count('class="piece-amount"')==6
assert all(htmls['mobiliario.html'].count('src="assets/catalogo/litos-'+x+'.webp"')==1 for x in ["banco-01","banco-02","consola-01","consola-02","lavabo-01","lavabo-02","mesa-auxiliar-01","mesa-auxiliar-02","mesa-centro-01","mesa-centro-02","mesa-comedor-01","mesa-comedor-02"])
assert all('–' not in x and '€' in x for x in ["4.600 €","2.200 €","3.500 €","1.900 €","2.500 €","1.200 €"])
assert 'No son precios de venta ni ofertas de LITOS' in htmls['mobiliario.html']
for page in pages:
 assert 'href="aviso-legal.html"' in htmls[page],(page,'missing legal link')
 assert 'href="privacidad.html"' in htmls[page],(page,'missing privacy link')
for page in ('aviso-legal.html','privacidad.html'):
 assert not parsers[page].forms,(page,'legal pages must not collect data')
assert 'GitHub Pages' in htmls['privacidad.html'] and 'IP' in htmls['privacidad.html'],'host IP logs must be disclosed'
assert 'mobiliario' not in htmls['funerario.html'].lower()
assert 'funerario' not in htmls['mobiliario.html'].lower()
assert 'arte funerario' in htmls['index.html'].lower() and 'mobiliario' in htmls['index.html'].lower()
for page in ('index.html','funerario.html','mobiliario.html'):
 assert not parsers[page].forms,(page,'lead collection forbidden')
 assert 'href="#contacto"' not in htmls[page],(page,'lead link forbidden')
 assert 'id="contact-form"' not in htmls[page],(page,'form ID forbidden')
 assert 'solicitar presupuesto' not in htmls[page].lower(),(page,'outdated CTA')
 assert 'no acepta encargos' in htmls[page].lower() or 'no aceptamos encargos' in htmls[page].lower(),(page,'current availability missing')
assert 'no acepta pedidos' in htmls['privacidad.html'].lower() and 'no contiene formularios' in htmls['privacidad.html'].lower()
assert 'no acepta encargos' in htmls['aviso-legal.html'].lower()
css=(root/'styles.css').read_text();js=(root/'script.js').read_text()
assert 'formResponse' not in js and 'fetch(' not in (root/'catalogo-precios.js').read_text() and 'fonts.googleapis.com' not in css and 'new FormData(' not in js
for link in re.findall(r'url\([\'" ]?([^\)\'" ]+)',css):
 if not link.startswith(('data:','#','https:','http:')):assert (root/link).is_file(),link
if '--production' in sys.argv:
 assert not any('[[PENDIENTE_' in html for html in htmls.values()), 'release blocked: missing verified legal identity/address/tax ID'
 assert not any('pendiente de completar' in html.lower() or 'pendiente de validación' in html.lower() for html in (htmls['aviso-legal.html'],htmls['privacidad.html'])), 'release blocked: provisional legal drafts'
 assert all('mailto:' not in htmls[p] for p in pages), 'release blocked: mail contact or lead collection present'
 assert all(not parsers[p].forms for p in pages), 'release blocked: form present'
 assert 'no acepta encargos' in htmls['aviso-legal.html'].lower(), 'release blocked: commercial scope not declared'
 assert 'publicidad remunerada' in htmls['aviso-legal.html'].lower(), 'release blocked: economic purpose unclear'
 assert 'GitHub Pages' in htmls['privacidad.html'] and 'IP' in htmls['privacidad.html'], 'release blocked: technical data processing not described'
 assert 'Imágenes conceptuales, no portfolio ejecutado' in htmls['mobiliario.html']
print(f'PASS: five pages, eight material options, 12 source images, no collection; {len(actual)} allowlisted files')
