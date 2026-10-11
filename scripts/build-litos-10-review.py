#!/usr/bin/env python3
"""Build an offline-only, privacy-safe LITOS review package. No deployment."""
from pathlib import Path
from shutil import copy2, rmtree
import json

root=Path(__file__).resolve().parents[1]
out=root/'review-package'
manifest=json.loads((root/'docs/LOTE_10_IMAGENES_20261011.json').read_text())
assert len(manifest['items']) == 10
if out.exists():
    rmtree(out)
(out/'assets/catalogo/variantes').mkdir(parents=True)
page=(root/'review/lote10-consola-banco.html').read_text()
page=page.replace('../assets/catalogo/variantes/','assets/catalogo/variantes/')
(out/'index.html').write_text(page,encoding='utf-8')
for item in manifest['items']:
    original=root/item['path']
    assert original.is_file(), item['path']
    copy2(original,out/item['path'])
print('PREVIEW OK: 10 PNG originals; offline review-package/index.html; no production deployment')
