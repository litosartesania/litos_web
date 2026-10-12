#!/usr/bin/env python3
"""Safety audit of full catalog offline review; no production deployment."""
from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[1]
site=root/'review-package/site'
manifests=[json.loads((root/p).read_text(encoding='utf-8')) for p in ('docs/LOTE_10_IMAGENES_20261011.json','docs/LOTE_8_IMAGENES_20261011.json','docs/LOTE_9_MESA_OVAL_20261012.json','docs/LOTE_9_MESA_REDONDA_20261012.json','docs/LOTE_9_MESA_RECTANGULAR_20261012.json','docs/LOTE_9_MESA_CENTRO_MON_20261012.json','docs/LOTE_9_MESA_CENTRO_RED_20261012.json')]
assert [len(m['items']) for m in manifests]==[10,8,9,9,9,9,9]
items=[i for m in manifests for i in m['items']]
assert (site/'mobiliario.html').is_file()
source=(root/'catalogo-precios.js').read_text(encoding='utf-8')
assert 'const approvedVariants=Object.freeze({});' not in source, 'Review branch must contain mapping; main stays unchanged'
changed=(site/'catalogo-precios.js').read_text(encoding='utf-8')
assert source==changed, 'Review copy must preserve exact source JavaScript'
assert 'png|webp' in changed and 'img.width=1122;img.height=1402' in changed
for item in items:
    path=item['path']
    assert changed.count(path)==1, path
    remote_copy=site/path
    assert remote_copy.is_file()
    assert hashlib.sha256(remote_copy.read_bytes()).hexdigest()==item['sha256'],path
for page in ('index.html','funerario.html','mobiliario.html','aviso-legal.html','privacidad.html'):
    html=(site/page).read_text(encoding='utf-8')
    assert '<form' not in html.lower(),page
    assert 'fonts.googleapis.com' not in html,page
assert 'LITOS · PREVISUALIZACIÓN DEL CATÁLOGO · SIN PUBLICAR' in (site/'mobiliario.html').read_text(encoding='utf-8')
print('PASS: 63 source mappings on review branch, 63 original PNGs hashed, no forms, isolated preview.')
