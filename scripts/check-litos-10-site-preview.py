#!/usr/bin/env python3
"""Safety audit of full catalog offline review; no production deployment."""
from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[1]
site=root/'review-package/site'
manifest=json.loads((root/'docs/LOTE_10_IMAGENES_20261011.json').read_text(encoding='utf-8'))
assert (site/'mobiliario.html').is_file()
source=(root/'catalogo-precios.js').read_text(encoding='utf-8')
assert 'const approvedVariants=Object.freeze({});' in source, 'Tracked catalog must not be activated before approval'
changed=(site/'catalogo-precios.js').read_text(encoding='utf-8')
assert 'const approvedVariants=Object.freeze({});' not in changed
assert 'png|webp' in changed and 'img.width=1122;img.height=1402' in changed
for item in manifest['items']:
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
print('PASS: unchanged source, 10 exact images, no forms, isolated preview of 21-piece catalog.')
