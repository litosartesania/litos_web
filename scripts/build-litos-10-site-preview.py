#!/usr/bin/env python3
"""Build isolated review of the actual catalog, preserving verified PNG bytes."""
from pathlib import Path
from shutil import copytree, rmtree
import json

root=Path(__file__).resolve().parents[1]
source=root/'_site'
dest=root/'review-package/site'
manifest=json.loads((root/'docs/LOTE_10_IMAGENES_20261011.json').read_text(encoding='utf-8'))
assert len(manifest['items'])==10
if dest.exists(): rmtree(dest)
copytree(source,dest)
script=(dest/'catalogo-precios.js').read_text(encoding='utf-8')
for entry in manifest['items']:
    assert script.count(entry['path'])==1,entry['path']
    assert (dest/entry['path']).is_file(),entry['path']
assert 'img.width=1122;img.height=1402' in script
page=dest/'mobiliario.html'
html=page.read_text(encoding='utf-8')
assert '</body>' in html
note='<div role="status" style="position:fixed;bottom:0;left:0;z-index:2147483646;padding:10px;background:#251f1b;color:white;font:12px Arial">LITOS · PREVISUALIZACIÓN DEL CATÁLOGO · SIN PUBLICAR</div>'
html=html.replace('</body>',note+'</body>')
html=html.replace('</head>','<meta name="robots" content="noindex,nofollow,noarchive"></head>')
page.write_text(html,encoding='utf-8')
print('PASS: isolated full-site review with ten verified PNGs; source and Pages untouched.')
