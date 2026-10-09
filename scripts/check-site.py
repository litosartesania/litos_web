#!/usr/bin/env python3
"""Site separation, route integrity, build allowlist and release safety gate."""
from html.parser import HTMLParser
from pathlib import Path
import re,sys
from urllib.parse import unquote,urlsplit
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site').resolve()
pages=['index.html','funerario.html','mobiliario.html']
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
expected=set(pages+['styles.css','script.js']+[f'assets/{x}' for x in ['favicon.svg','hero-workshop.webp','workshop-strip.webp','limestone-texture.webp','concept-mesa.webp','concept-lavabo.webp','concept-objetos.webp']])
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
 for form in p.forms:assert form.get('action','').startswith('mailto:')
assert not parsers['index.html'].forms and parsers['index.html'].cards==0 and 'id="precios"' not in htmls['index.html']
for page,count in [('funerario.html',3),('mobiliario.html',4)]:
 p=parsers[page]
 assert p.cards==count and p.prices==count,(page,p.cards,p.prices)
 assert len(p.forms)==1 and 'id="precios"' in htmls[page]
 assert 'No son precios de venta ni ofertas de LITOS' in htmls[page]
assert 'mobiliario' not in htmls['funerario.html'].lower()
assert 'funerario' not in htmls['mobiliario.html'].lower()
assert 'arte funerario' in htmls['index.html'].lower() and 'mobiliario' in htmls['index.html'].lower()
css=(root/'styles.css').read_text();js=(root/'script.js').read_text()
assert 'formResponse' not in js and 'fonts.googleapis.com' not in css
for link in re.findall(r'url\([\'" ]?([^\)\'" ]+)',css):
 if not link.startswith(('data:','#','https:','http:')):assert (root/link).is_file(),link
if '--production' in sys.argv:
 assert not any('Información legal completa pendiente de validación' in html for html in htmls.values()),'release blocked: legal identity/privacy unverified'
 assert 'Imágenes conceptuales, no portfolio ejecutado' in htmls['mobiliario.html']
print(f'PASS: 3 distinct pages, {len(actual)} allowed files, prices/routes/privacy audited')
