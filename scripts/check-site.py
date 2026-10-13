#!/usr/bin/env python3
"""Site separation, route integrity, build allowlist and release safety gate."""
from html.parser import HTMLParser
from pathlib import Path
import re,sys,json,hashlib
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
manifests=[json.loads((root.parent/p).read_text(encoding='utf-8')) for p in ('docs/LOTE_10_IMAGENES_20261011.json','docs/LOTE_8_IMAGENES_20261011.json','docs/LOTE_9_MESA_OVAL_20261012.json','docs/LOTE_9_MESA_REDONDA_20261012.json','docs/LOTE_9_MESA_RECTANGULAR_20261012.json','docs/LOTE_9_MESA_CENTRO_MON_20261012.json','docs/LOTE_9_MESA_CENTRO_RED_20261012.json')]
assert [len(m['items']) for m in manifests]==[10,8,9,9,9,9,9]
items=[i for m in manifests for i in m['items']]
variants={i['path'] for i in items}
assert len(variants)==63 and all(p.startswith('assets/catalogo/variantes/') and p.endswith('.png') and '..' not in Path(p).parts for p in variants)
expected.update(variants)
plans=json.loads((root.parent/'docs/PLANOS_TECNICOS_20261012.json').read_text())['products']
assert len(plans)==9 and len({p['product_id'] for p in plans})==9
assert all(p['review_status']=='REVISADO_CON_HIPOTESIS' and p['width']==1600 and p['height']==1200 and p['path']=='assets/catalogo/planos/'+p['product_id']+'.png' for p in plans)
plan_paths={p['path'] for p in plans}
expected.update(plan_paths)
# User-approved revised originals: nine console materials and two drawings. Old files stay.
corrections=json.loads((root.parent/'docs/IMPORTACION_CONSOLA_ESC_20261013.json').read_text(encoding='utf-8'))['images']
assert len(corrections)==11 and len({x['path'] for x in corrections})==11
stone_ids={'travertino','caliza','macael','carrara','marquina','granito','cuarcita','calacatta','verde-alpi'}
assert {x['stone_id'] for x in corrections if x['kind']=='material_variant'}==stone_ids
assert {x['product_id'] for x in corrections if x['kind']=='technical_drawing'}=={'consola-esc','mesa-comedor-oval'}
for i in corrections:
 rel=i['path']
 assert rel.startswith('assets/catalogo/revisiones/20261013/') and '..' not in Path(rel).parts and rel.endswith('.png')
 assert rel==('assets/catalogo/revisiones/20261013/variantes/consola-esc__'+i['stone_id']+'.png' if i['kind']=='material_variant' else 'assets/catalogo/revisiones/20261013/planos/'+i['product_id']+'.png')
 blob=(root/rel).read_bytes()
 assert len(blob)==i['size_bytes'] and hashlib.sha256(blob).hexdigest()==i['sha256'],('corrected image SHA-256',rel)
 assert blob[:8]==b'\x89PNG\r\n\x1a\n'
 assert (int.from_bytes(blob[16:20],'big'),int.from_bytes(blob[20:24],'big'))==(i['width'],i['height'])
 assert (root/'catalogo-precios.js').read_text(encoding='utf-8').count(rel)==1,('corrected image not selected',rel)
review_paths={x['path'] for x in corrections}
expected.update(review_paths)
# Seven new travertine-only candidates selected from the isolated 20-file QA branch.
selection=json.loads((root.parent/'docs/TRAVERTINO_7_REVISION_20261013.json').read_text(encoding='utf-8'))['images']
expected_ids={'mesa-aux-ped','mesa-aux-bal','lavabo-ped','lavabo-sobre','bandeja','cuenco','balda'}
assert len(selection)==7 and {item['product_id'] for item in selection}==expected_ids
selection_paths=set()
for item in selection:
 path=item['path']
 assert item['stone_id']=='travertino' and item['review_status']=='SELECCION_VISUAL_PROVISIONAL'
 assert path=='assets/catalogo/revisiones/20261013/travertino-seleccion/'+item['product_id']+'__travertino.png'
 assert path not in selection_paths and '..' not in Path(path).parts
 content=(root/path).read_bytes()
 assert len(content)==item['size_bytes'] and hashlib.sha256(content).hexdigest()==item['sha256'], ('new travertine SHA-256',path)
 assert content[:8]==b'\x89PNG\r\n\x1a\n'
 assert (int.from_bytes(content[16:20],'big'),int.from_bytes(content[20:24],'big'))==(1122,1402)
 assert (root/'catalogo-precios.js').read_text(encoding='utf-8').count(path)==1
 selection_paths.add(path)
expected.update(selection_paths)
# Second selected travertine batch: seven unique slugs, original hashes mandatory.
extra_selection=json.loads((root.parent/'docs/TRAVERTINO_7_EXTRAS_INTEGRACION_20261013.json').read_text(encoding='utf-8'))['images']
extra_ids={'consola-rect','banco-rect','encimera-bano','encimera-cocina','panel','peana','macetero'}
assert len(extra_selection)==7 and {i['product_id'] for i in extra_selection}==extra_ids
extra_paths=set()
for entry in extra_selection:
 png=(root/entry['path']).read_bytes()
 print('EXTRA_PNG_DIMENSIONS',entry['product_id'],int.from_bytes(png[16:20],'big'),int.from_bytes(png[20:24],'big'),flush=True)
for i in extra_selection:
 p=i['path']
 assert i['stone_id']=='travertino' and i['review_status']=='SELECCION_VISUAL_PROVISIONAL'
 assert p=='assets/catalogo/revisiones/20261013/travertino-extra-seleccion/'+i['product_id']+'__travertino.png'
 assert p not in extra_paths and '..' not in Path(p).parts
 b=(root/p).read_bytes()
 assert len(b)==i['size_bytes'] and hashlib.sha256(b).hexdigest()==i['sha256'], ('extra SHA256',p)
 assert b[:8]==b'\x89PNG\r\n\x1a\n'
 assert (int.from_bytes(b[16:20],'big'),int.from_bytes(b[20:24],'big'))==(i['width'],i['height'])==(1122,1402)
 assert (root/'catalogo-precios.js').read_text(encoding='utf-8').count(p)==1
 extra_paths.add(p)
expected.update(extra_paths)
for p in plans:
 data=(root/p['path']).read_bytes()
 assert data[:8]==b'\x89PNG\r\n\x1a\n' and int.from_bytes(data[16:20],'big')==1600 and int.from_bytes(data[20:24],'big')==1200
 assert len(data)==p['size_bytes'] and hashlib.sha256(data).hexdigest()==p['sha256'], ('technical drawing integrity',p['path'])
 assert (root/'catalogo-precios.js').read_text().count(p['path'])==(0 if p['product_id'] in ('consola-esc','mesa-comedor-oval') else 1)

actual={x.relative_to(root).as_posix() for x in root.rglob('*') if x.is_file()}
assert actual==expected,(actual^expected)
for item in items:
 f=root/item['path']
 data=f.read_bytes()
 assert len(data)==item['size_bytes'], ('wrong PNG size',item['path'])
 assert hashlib.sha256(data).hexdigest()==item['sha256'], ('wrong PNG SHA-256',item['path'])
assert sum((root/p).stat().st_size for p in actual-variants-plan_paths-review_paths-selection_paths-extra_paths)<2500000, 'non-variant site unexpectedly large'
assert sum((root/p).stat().st_size for p in actual)<sum(i['size_bytes'] for i in items)+sum(p['size_bytes'] for p in plans)+sum(i['size_bytes'] for i in corrections)+sum(i['size_bytes'] for i in selection)+sum(i['size_bytes'] for i in extra_selection)+2500000, 'site package unexpectedly large'
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
assert 'id="precios"' in htmls['mobiliario.html'] and 'id="material-picker"' in htmls['mobiliario.html'] and htmls['mobiliario.html'].count('<option value=')==10 and htmls['mobiliario.html'].count('value="plano-tecnico"')==1
assert htmls['mobiliario.html'].count('class="catalog-workspace"')==1, 'sidebar layout missing'
assert 'id="material-color"' in htmls['mobiliario.html'] and 'value="verde-alpi"' in htmls['mobiliario.html']
assert 'simulación digital de tonalidad' not in htmls['mobiliario.html']
assert 'styles.css?v=stone-20261013-travertino21' in htmls['mobiliario.html']
assert 'catalogo-precios.js?v=stone-20261013-travertino21' in htmls['mobiliario.html']
assert 'material-preview' in (root/'catalogo-precios.js').read_text() and 'tonalMockup:false' in (root/'catalogo-precios.js').read_text()
assert 'referenceByProduct' in (root/'catalogo-precios.js').read_text() and 'concept-availability' in (root/'catalogo-precios.js').read_text()
assert all((root/'catalogo-precios.js').read_text().count(item['path'])==(0 if item['path'].startswith('assets/catalogo/variantes/consola-esc__') else 1) for item in items)
assert 'img.width=1122;img.height=1402' in (root/'catalogo-precios.js').read_text()
assert 'Elige la piedra para consultar imágenes conceptuales específicas' in htmls['mobiliario.html']
assert '--stone-photo-filter' not in (root/'styles.css').read_text() and '--stone-preview-tint' not in (root/'styles.css').read_text()
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
print(f'PASS: five pages, nine material options, 12 source WebP, 63 historical PNG SHA-256 + 14 selected travertine original PNG SHA-256, no tint or collection; {len(actual)} allowlisted files')

