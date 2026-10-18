#!/usr/bin/env python3
"""Site separation, route integrity, build allowlist and release safety gate."""
from html.parser import HTMLParser
from pathlib import Path
import re,sys,json,hashlib
from urllib.parse import unquote,urlsplit
import ast
root=Path(sys.argv[1] if len(sys.argv)>1 else '_site').resolve()
ast.parse((root.parent/'scripts/check-live-deployment.py').read_text(encoding='utf-8'), filename='scripts/check-live-deployment.py')
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
expected=set(pages+['styles.css','script.js','funerario-personalizador.js','catalogo-precios.js']+[f'assets/{x}' for x in ['favicon.svg','hero-workshop.webp','workshop-strip.webp','limestone-texture.webp','concept-mesa.webp','concept-lavabo.webp','concept-objetos.webp']])
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
for i in extra_selection:
 p=i['path']
 assert i['stone_id']=='travertino' and i['review_status']=='SELECCION_VISUAL_PROVISIONAL'
 assert p=='assets/catalogo/revisiones/20261013/travertino-extra-seleccion/'+i['product_id']+'__travertino.png'
 assert p not in extra_paths and '..' not in Path(p).parts
 b=(root/p).read_bytes()
 assert len(b)==i['size_bytes'] and hashlib.sha256(b).hexdigest()==i['sha256'], ('extra SHA256',p)
 assert b[:8]==b'\x89PNG\r\n\x1a\n'
 assert (int.from_bytes(b[16:20],'big'),int.from_bytes(b[20:24],'big'))==(i['width'],i['height'])==(1086,1448)
 assert (root/'catalogo-precios.js').read_text(encoding='utf-8').count(p)==1
 extra_paths.add(p)
expected.update(extra_paths)
# Twelve owner-supplied reviewed-for-preview ortho plates: SHA, allowlist, projection size.
selected_drawings=json.loads((root.parent/'docs/PLANOS_12_SELECCION_20261013.json').read_text(encoding='utf-8'))['images']
missing_ids={'mesa-aux-bal','consola-rect','banco-rect','lavabo-sobre','encimera-bano','encimera-cocina','balda','panel','bandeja','peana','cuenco','macetero'}
assert len(selected_drawings)==12 and {i['product_id'] for i in selected_drawings}==missing_ids
assert not ({i['product_id'] for i in plans}&missing_ids)
new_drawings=set()
for i in selected_drawings:
 p=i['path']
 assert i['review_status']=='PROPUESTA_PARA_REVISION_NO_PUBLICADA'
 assert p=='assets/catalogo/revisiones/20261013/planos-12-seleccion/'+i['product_id']+'.png'
 assert i['source_path']=='assets/catalogo/revisiones/20261013/planos-12-candidatos/'+i['product_id']+'.png'
 assert p not in new_drawings and '..' not in Path(p).parts
 b=(root/p).read_bytes()
 assert len(b)==i['size_bytes'] and hashlib.sha256(b).hexdigest()==i['sha256'],('new drawing SHA-256',p)
 assert b[:8]==b'\x89PNG\r\n\x1a\n'
 assert (int.from_bytes(b[16:20],'big'),int.from_bytes(b[20:24],'big'))==(i['width'],i['height'])==(1600,1200)
 assert (root/'catalogo-precios.js').read_text(encoding='utf-8').count(p)==1,('new drawing mapping',p)
 new_drawings.add(p)
js=(root/'catalogo-precios.js').read_text(encoding='utf-8')
mapped=re.search(r'const approvedTechnicalDrawings=Object\.freeze\((\{[^\n]*\})\);',js)
assert mapped
drawing_map=json.loads(mapped.group(1))
assert len(drawing_map)==21 and set(drawing_map)==({p['product_id'] for p in plans}|missing_ids)
assert all(drawing_map[i['product_id']]==i['path'] for i in selected_drawings)
expected.update(new_drawings)
# All 8 original owner-provided stone views of Mesa auxiliar pedestal: exact bytes and selection.
mesa_aux_manifest=json.loads((root.parent/'docs/MESA_AUX_PED_8_VARIANTES_20261013.json').read_text(encoding='utf-8'))
mesa_aux_photos=mesa_aux_manifest['images']
stone_set={'caliza','macael','carrara','marquina','granito','cuarcita','calacatta','verde-alpi'}
assert len(mesa_aux_photos)==8 and {x['stone_id'] for x in mesa_aux_photos}==stone_set
assert all(x['product_id']=='mesa-aux-ped' for x in mesa_aux_photos)
mesa_aux_paths=set()
for x in mesa_aux_photos:
 rel=x['path']
 assert rel=='assets/catalogo/revisiones/20261013/mesa-aux-ped-8-seleccion/mesa-aux-ped__'+x['stone_id']+'.png'
 assert x['source_path']=='assets/catalogo/revisiones/20261013/mesa-aux-ped-candidatas-8/mesa-aux-ped__'+x['stone_id']+'.png'
 assert len(x['sha256'])==64 and len(x['git_blob_sha'])==40 and rel not in mesa_aux_paths
 b=(root/rel).read_bytes()
 assert len(b)==x['size_bytes'] and hashlib.sha256(b).hexdigest()==x['sha256'],('mesa auxiliar SHA-256',rel)
 assert b[:8]==b'\x89PNG\r\n\x1a\n'
 assert (int.from_bytes(b[16:20],'big'),int.from_bytes(b[20:24],'big'))==(x['width'],x['height'])==(1122,1402)
 assert (root/'catalogo-precios.js').read_text(encoding='utf-8').count(rel)==1,('mesa auxiliar selection',rel)
 mesa_aux_paths.add(rel)
js=(root/'catalogo-precios.js').read_text(encoding='utf-8')
all_variants=re.search(r'const approvedVariants=Object\.freeze\((\{[^\n]*\})\);',js)
assert all_variants
chosen=json.loads(all_variants.group(1))
assert len(chosen)==189 and chosen['mesa-aux-ped__travertino']=='assets/catalogo/revisiones/20261013/travertino-seleccion/mesa-aux-ped__travertino.png'
assert all(chosen['mesa-aux-ped__'+x['stone_id']]==x['path'] for x in mesa_aux_photos)
expected.update(mesa_aux_paths)
# Mesa auxiliar con baldas: eight newly selected original PNGs, with strict SHA-256 and allowlist.
mesa_bal_manifest=json.loads((root.parent/'docs/MESA_AUX_BAL_8_VARIANTES_20261014.json').read_text(encoding='utf-8'))
mesa_bal_photos=mesa_bal_manifest['images']
bal_ids={'caliza','macael','carrara','marquina','granito','cuarcita','calacatta','verde-alpi'}
assert mesa_bal_manifest['product_id']=='mesa-aux-bal' and len(mesa_bal_photos)==8 and {x['stone_id'] for x in mesa_bal_photos}==bal_ids
mesa_bal_paths=set()
for x in mesa_bal_photos:
 p=x['path']
 assert p=='assets/catalogo/revisiones/20261014/mesa-aux-bal-8-seleccion/mesa-aux-bal__'+x['stone_id']+'.png'
 assert x['source_path'].startswith('assets/catalogo/revisiones/20261014/mesa-aux-baldas-candidatas-8/mesa-aux-baldas__')
 assert p not in mesa_bal_paths and len(x['git_blob_sha'])==40 and len(x['sha256'])==64
 data=(root/p).read_bytes()
 assert data[:8]==b'\x89PNG\r\n\x1a\n'
 assert len(data)==x['size_bytes'] and hashlib.sha256(data).hexdigest()==x['sha256'],('Mesa con baldas SHA',p)
 assert (int.from_bytes(data[16:20],'big'),int.from_bytes(data[20:24],'big'))==(1122,1402)==(x['width'],x['height'])
 assert (root/'catalogo-precios.js').read_text(encoding='utf-8').count(p)==1,('Mesa con baldas mapping',p)
 mesa_bal_paths.add(p)
selected_map=json.loads(re.search(r'const approvedVariants=Object\.freeze\((\{[^\n]*\})\);',(root/'catalogo-precios.js').read_text()).group(1))
assert len(selected_map)==189
assert selected_map['mesa-aux-bal__travertino']=='assets/catalogo/revisiones/20261013/travertino-seleccion/mesa-aux-bal__travertino.png'
assert all(selected_map['mesa-aux-bal__'+i['stone_id']]==i['path'] for i in mesa_bal_photos)
assert all(selected_map['mesa-aux-ped__'+i['stone_id']]==i['path'] for i in mesa_aux_photos)
expected.update(mesa_bal_paths)
# Audit new 80 source PNGs: no generated replacement, no duplicate, no other public assets.
new80=json.loads((root.parent/'docs/LOTE_80_ORIGINALES_20261015.json').read_text(encoding='utf-8'))['images']
new80_products={'balda','banco-rect','consola-rect','cuenco','encimera-bano','encimera-cocina','lavabo-ped','lavabo-sobre','panel','peana'}
assert len(new80)==80 and {i['product_id'] for i in new80}==new80_products
new80_pairs={(i['product_id'],i['stone_id']) for i in new80}
assert len(new80_pairs)==80 and all({stone for product,stone in new80_pairs if product==p}==stone_set for p in new80_products)
new80_paths=set()
for i in new80:
 assert i['filename']==i['product_id']+'__'+i['stone_id']+'.png'
 rel='assets/catalogo/revisiones/20261015/lote-80-originales/'+i['filename']
 assert rel not in new80_paths and '..' not in Path(rel).parts
 b=(root/rel).read_bytes()
 assert b[:8]==bytes((137,80,78,71,13,10,26,10))
 assert len(b)==i['size_bytes'] and hashlib.sha256(b).hexdigest()==i['source_sha256'],('original SHA256',rel)
 assert (int.from_bytes(b[16:20],'big'),int.from_bytes(b[20:24],'big'))==(i['width'],i['height'])
 assert selected_map[i['product_id']+'__'+i['stone_id']]==rel and js.count(rel)==1,('unique map',rel)
 new80_paths.add(rel)
expected.update(new80_paths)
# Eight Bandeja images selected from owner-supplied originals, byte-for-byte.
bandeja=json.loads((root.parent/'docs/BANDEJA_8_SELECCION_20261015.json').read_text(encoding='utf-8'))
bandeja_images=bandeja['images']
assert bandeja['product_id']=='bandeja' and len(bandeja_images)==8
assert {i['stone_id'] for i in bandeja_images}==stone_set and len({i['path'] for i in bandeja_images})==8
bandeja_paths=set()
for i in bandeja_images:
 rel='assets/catalogo/revisiones/20261015/bandeja-8-candidatas/bandeja__'+i['stone_id']+'.png'
 assert i['path']==rel and i['filename']=='bandeja__'+i['stone_id']+'.png'
 assert i['product_id']=='bandeja' and rel not in bandeja_paths
 b=(root/rel).read_bytes()
 assert b[:8]==bytes((137,80,78,71,13,10,26,10))
 assert len(b)==i['size_bytes'] and hashlib.sha256(b).hexdigest()==i['sha256'],('Bandeja original SHA256',rel)
 assert (int.from_bytes(b[16:20],'big'),int.from_bytes(b[20:24],'big'))==(i['width'],i['height']),('Bandeja dimensions',rel)
 assert selected_map['bandeja__'+i['stone_id']]==rel and js.count(rel)==1,('Bandeja selected mapping',rel)
 bandeja_paths.add(rel)
assert selected_map['bandeja__travertino']=='assets/catalogo/revisiones/20261013/travertino-seleccion/bandeja__travertino.png'
expected.update(bandeja_paths)
# Macetero mineral: eight exact original PNGs selected; manifest and hashes are binding.
macetero=json.loads((root.parent/'docs/MACETERO_8_SELECCION_20261015.json').read_text(encoding='utf-8'))
macetero_images=macetero['images']
source_macetero=json.loads((root.parent/'docs/MANIFIESTO_MACETERO_8_20261015.json').read_text(encoding='utf-8'))
macetero_checksum=(root.parent/'docs/MACETERO_8_SHA256_20261015.txt').read_text(encoding='utf-8').splitlines()
assert macetero['product_id']=='macetero' and len(macetero_images)==len(source_macetero['archivos'])==len(macetero_checksum)==8
assert {i['stone_id'] for i in macetero_images}==stone_set and len({i['filename'] for i in macetero_images})==8
assert macetero['master_path']==selected_map['macetero__travertino']=='assets/catalogo/revisiones/20261013/travertino-extra-seleccion/macetero__travertino.png'
macetero_paths=set()
for i in macetero_images:
 rel='assets/catalogo/revisiones/20261015/macetero-8-candidatas/macetero__'+i['stone_id']+'.png'
 assert i['product_id']=='macetero' and i['path']==rel and i['filename']=='macetero__'+i['stone_id']+'.png'
 assert rel not in macetero_paths and i['width']==1024 and i['height']==1536
 assert i['sha256']+'  imagenes/'+i['filename'] in macetero_checksum,('Macetero checksum file',rel)
 assert any(z['filename']==i['filename'] and z['sha256']==i['sha256'] and z['size_bytes']==i['size_bytes'] for z in source_macetero['archivos'])
 b=(root/rel).read_bytes()
 assert b[:8]==bytes((137,80,78,71,13,10,26,10))
 assert (int.from_bytes(b[16:20],'big'),int.from_bytes(b[20:24],'big'))==(1024,1536),('Macetero native dimensions',rel)
 assert len(b)==i['size_bytes'] and hashlib.sha256(b).hexdigest()==i['sha256'],('Macetero SHA-256',rel)
 assert selected_map['macetero__'+i['stone_id']]==rel and js.count(rel)==1,('Macetero selector',rel)
 macetero_paths.add(rel)
expected.update(macetero_paths)
for p in plans:
 data=(root/p['path']).read_bytes()
 assert data[:8]==b'\x89PNG\r\n\x1a\n' and int.from_bytes(data[16:20],'big')==1600 and int.from_bytes(data[20:24],'big')==1200
 assert len(data)==p['size_bytes'] and hashlib.sha256(data).hexdigest()==p['sha256'], ('technical drawing integrity',p['path'])
 assert (root/'catalogo-precios.js').read_text().count(p['path'])==(0 if p['product_id'] in ('consola-esc','mesa-comedor-oval') else 1)

memorial_manifest=json.loads((root.parent/'docs/FUNERARIO_ASSETS_MANIFEST.json').read_text())
memorial_paths={i['path'] for i in memorial_manifest['files']}|{'funerario-recursos.js','funerario-compositor.js','funerario-exportar.js'}
assert len(memorial_manifest['files'])==82
review_manifest=json.loads((root.parent/'docs/FUNERARIO_REVIEW_ASSETS_MANIFEST.json').read_text())
assert len(review_manifest['files'])==0
figure_paths={i['path'] for i in memorial_manifest['files'] if '/ornamentos/religiosas/relieves/' in i['path']}
assert len(figure_paths)==16 and sum('/miniaturas/' in p for p in figure_paths)==8
for i in memorial_manifest['files']:
 b=(root/i['path']).read_bytes()
 assert len(b)==i['bytes'] and hashlib.sha256(b).hexdigest()==i['sha256'],i['path']
memorial_bytes=sum((root/p).stat().st_size for p in memorial_paths)
assert memorial_bytes<3500000,'memorial resource budget exceeded'
expected.update(memorial_paths)
actual={x.relative_to(root).as_posix() for x in root.rglob('*') if x.is_file()}
assert actual==expected,(actual^expected)
for item in items:
 f=root/item['path']
 data=f.read_bytes()
 assert len(data)==item['size_bytes'], ('wrong PNG size',item['path'])
 assert hashlib.sha256(data).hexdigest()==item['sha256'], ('wrong PNG SHA-256',item['path'])
assert sum((root/p).stat().st_size for p in actual-variants-plan_paths-review_paths-selection_paths-extra_paths-new_drawings-mesa_aux_paths-mesa_bal_paths-new80_paths-bandeja_paths-macetero_paths-memorial_paths)<2500000, 'non-variant site unexpectedly large'
assert sum((root/p).stat().st_size for p in actual)<sum(i['size_bytes'] for i in items)+sum(p['size_bytes'] for p in plans)+sum(i['size_bytes'] for i in corrections)+sum(i['size_bytes'] for i in selection)+sum(i['size_bytes'] for i in extra_selection)+sum(i['size_bytes'] for i in selected_drawings)+sum(i['size_bytes'] for i in mesa_aux_photos)+sum(i['size_bytes'] for i in mesa_bal_photos)+sum(i['size_bytes'] for i in new80)+sum(i['size_bytes'] for i in bandeja_images)+sum(i['size_bytes'] for i in macetero_images)+2500000+memorial_bytes, 'site package unexpectedly large'
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
assert 'id="memorial-workbench"' in htmls['funerario.html'] and 'id="memorial-text"' in htmls['funerario.html']
assert 'Lápida de columbario' in htmls['funerario.html'] and 'Lápida con portada' in htmls['funerario.html'] and 'Losa para panteón' in htmls['funerario.html']
assert 'no son estándares' in htmls['funerario.html']
assert 'funerario-personalizador.js' in htmls['funerario.html']
assert not any(token in (root/'funerario-personalizador.js').read_text(encoding='utf8') for token in ('fetch(', 'localStorage', 'sessionStorage', 'XMLHttpRequest', 'sendBeacon', 'innerHTML', 'document.cookie'))
assert 'id="precios"' in htmls['mobiliario.html'] and 'id="material-picker"' in htmls['mobiliario.html'] and htmls['mobiliario.html'].count('<option value=')==10 and htmls['mobiliario.html'].count('value="plano-tecnico"')==1
assert htmls['mobiliario.html'].count('class="catalog-workspace"')==1, 'sidebar layout missing'
assert 'id="material-color"' in htmls['mobiliario.html'] and 'value="verde-alpi"' in htmls['mobiliario.html']
assert 'simulación digital de tonalidad' not in htmls['mobiliario.html']
assert 'styles.css?v=stone-20261015-macetero8' in htmls['mobiliario.html']
assert 'catalogo-precios.js?v=stone-20261015-bandeja8' in htmls['mobiliario.html']
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
 assert 'Colección conceptual · 21 productos · 9 piedras · 21 planos' in htmls['mobiliario.html']
 assert 'Explora 21 conceptos en una galería' not in htmls['mobiliario.html']
 assert 'Imagen conceptual · Línea en estudio' not in htmls['mobiliario.html']
 assert 'Imágenes conceptuales, no portfolio ejecutado' not in htmls['mobiliario.html']
print(f'PASS: five pages, nine material options, 12 source WebP, 63 historical PNG SHA-256 + 14 selected travertine original PNG SHA-256, no tint or collection; {len(actual)} allowlisted files')

