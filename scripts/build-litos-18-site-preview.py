#!/usr/bin/env python3
"""Build isolated review of the actual catalog, preserving verified PNG bytes."""
from pathlib import Path
from shutil import copytree, rmtree
import json

root=Path(__file__).resolve().parents[1]
source=root/'_site'
dest=root/'review-package/site'
manifests=[json.loads((root/p).read_text(encoding='utf-8')) for p in ('docs/LOTE_10_IMAGENES_20261011.json','docs/LOTE_8_IMAGENES_20261011.json')]
assert [len(m['items']) for m in manifests]==[10,8]
items=[i for m in manifests for i in m['items']]
if dest.exists(): rmtree(dest)
copytree(source,dest)
script=(dest/'catalogo-precios.js').read_text(encoding='utf-8')
for entry in items:
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
print('PASS: isolated full-site review with 18 verified PNGs; source and Pages untouched.')
