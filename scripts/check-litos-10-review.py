#!/usr/bin/env python3
"""Check review-only UI references and no leaks/side-effects (stdlib)."""
from pathlib import Path
import json,re,hashlib
root=Path(__file__).resolve().parents[1]
out=root/'review-package'
manifest=json.loads((root/'docs/LOTE_10_IMAGENES_20261011.json').read_text())
html=(out/'index.html').read_text(encoding='utf-8')
assert '<form' not in html.lower()
assert not re.search(r'<(?:iframe|script|link|img)[^>]+(?:https?:)?//',html,re.I)
assert '<meta name="robots" content="noindex,nofollow,noarchive">' in html
assert 'filter:none!important' in html
assert html.count('class="product" data-product=') == 2
assert html.count('data-stone=') == 5
assert "banco-esc__travertino.png" in html and "consola-esc__travertino.png" in html
actual={f.relative_to(out).as_posix() for f in out.rglob('*') if f.is_file()}
expected={'index.html'} | {i['path'] for i in manifest['items']}
assert actual == expected,(actual^expected)
for i in manifest['items']:
    source=root/i['path']
    candidate=out/i['path']
    assert hashlib.sha256(source.read_bytes()).hexdigest()==i['sha256'], i['path']
    assert hashlib.sha256(candidate.read_bytes()).hexdigest()==i['sha256'], i['path']
print('PASS: 10 exact SHA-256 originals, 2 products × 5 stones, 0 collection, offline-only artifact.')
