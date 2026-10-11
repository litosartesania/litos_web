#!/usr/bin/env python3
"""Assemble preview of ACTUAL catalog with ten source PNGs, without modifying tracked site."""
from pathlib import Path
from shutil import copytree, copy2, rmtree
import json

root=Path(__file__).resolve().parents[1]
source=root/'_site'
dest=root/'review-package/site'
manifest=json.loads((root/'docs/LOTE_10_IMAGENES_20261011.json').read_text(encoding='utf-8'))
assert len(manifest['items'])==10
if dest.exists(): rmtree(dest)
copytree(source,dest)
target=dest/'assets/catalogo/variantes'
target.mkdir(parents=True,exist_ok=True)
mapping={}
for entry in manifest['items']:
    src=root/entry['path']
    assert src.is_file(),entry['path']
    copy2(src,target/src.name)
    mapping[entry['product_id']+'__'+entry['stone_id']]=entry['path']
script_file=dest/'catalogo-precios.js'
script=script_file.read_text(encoding='utf-8')
old='const approvedVariants=Object.freeze({});'
assert script.count(old)==1
script=script.replace(old,'const approvedVariants=Object.freeze('+json.dumps(mapping,ensure_ascii=False,separators=(',',':'))+');')
old_check="!file.endsWith('.webp')"
assert script.count(old_check)==1
script=script.replace(old_check,"!/\\.(?:png|webp)$/.test(file)")
assert script.count('img.width=720;img.height=900')==1
script=script.replace('img.width=720;img.height=900','img.width=1122;img.height=1402')
script_file.write_text(script,encoding='utf-8')
page=dest/'mobiliario.html'
html=page.read_text(encoding='utf-8')
assert '</body>' in html
note='<div role="status" style="position:fixed;bottom:0;left:0;z-index:2147483646;padding:10px;background:#251f1b;color:white;font:12px Arial">LITOS · PREVISUALIZACIÓN DEL CATÁLOGO · SIN PUBLICAR</div>'
html=html.replace('</body>',note+'</body>')
html=html.replace('</head>','<meta name="robots" content="noindex,nofollow,noarchive"></head>')
page.write_text(html,encoding='utf-8')
print('PASS: offline copy of real 21-piece catalog with ten original images in selector; git source untouched.')
