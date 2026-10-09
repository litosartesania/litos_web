#!/usr/bin/env python3
"""Validate portable standalone and multi-page preview, without dependencies or network."""
from pathlib import Path
from html.parser import HTMLParser
import sys

root = Path(sys.argv[1] if len(sys.argv)>1 else 'preview')
standalone = root/'LITOS_PREVISUALIZACION_AUTONOMA.html'
assert standalone.is_file(), 'standalone preview missing'
assert 100_000 < standalone.stat().st_size < 4_000_000, 'unexpected standalone size'

class Inspector(HTMLParser):
 def __init__(self):
  super().__init__(); self.views=[];self.external=[];self.forms=[];self.images=0;self.styles=0;self.scripts=0;self.routes=set()
 def handle_starttag(self, tag, attrs):
  a=dict(attrs)
  if 'data-view' in a:self.views.append(a['data-view'])
  if tag=='form':self.forms.append(a)
  if tag=='img':
   self.images+=1
   if not a.get('src','').startswith('data:image/'):self.external.append((tag,a.get('src')))
  if tag=='script':
   if a.get('src'):self.external.append((tag,a['src']))
   else:self.scripts+=1
  if tag=='link' and a.get('rel') in ('stylesheet','preload'):self.external.append((tag,a.get('href')))
  if tag in ('iframe','source','video','audio') and a.get('src'):self.external.append((tag,a.get('src')))
  if tag=='style':self.styles+=1
  if tag=='a' and a.get('href') in ('index.html','funerario.html','mobiliario.html','aviso-legal.html','privacidad.html'):self.routes.add(a['href'])

html=standalone.read_text(encoding='utf-8')
p=Inspector();p.feed(html)
assert p.views==['inicio','funerario','mobiliario','aviso-legal','privacidad'],p.views
assert p.images>=5 and p.styles>=1 and p.scripts>=1
assert not p.external,p.external
assert not p.forms, 'preview must not contain forms'
assert 'type="submit"' not in html and 'id="contact-form"' not in html
assert p.routes=={'index.html','funerario.html','mobiliario.html','aviso-legal.html','privacidad.html'},p.routes
assert 'name="robots" content="noindex,nofollow"' in html
# The catalog's inline JavaScript contains literal image-path templates, not loaded resources.
# Inspector above validates actual img/script tags and refuses any remote or relative src.
assert 'window.LITOS_CATALOG_INFO' in html, 'interactive catalog code must be embedded'
for page in ('index.html','funerario.html','mobiliario.html'):
 assert (root/page).is_file(),page
assert '<form' not in (root/'index.html').read_text()
for page in ('funerario.html','mobiliario.html'):
 content=(root/page).read_text()
 assert '<form' not in content and 'solicitar presupuesto' not in content.lower()
print('PASS: portable five-view preview is self-contained, images embedded and commercial forms absent')
