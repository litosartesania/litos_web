#!/usr/bin/env python3
"""Zero-dependency static safety checks; run against _site/ after build."""
from pathlib import Path
from html.parser import HTMLParser
import re
import sys

root = Path(sys.argv[1] if len(sys.argv)>1 else '_site').resolve()

class Collector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.hrefs = []
        self.assets = []
        self.forms = []
        self.img_without_dimensions = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, f"duplicate id {a['id']}"
            self.ids.add(a['id'])
        if a.get('href'):
            self.hrefs.append(a['href'])
        if tag in ('img', 'script') and a.get('src'):
            self.assets.append(a['src'])
        if tag == 'link' and a.get('rel') == 'stylesheet':
            self.assets.append(a.get('href'))
        if tag == 'img' and not all(x in a for x in ('width', 'height')):
            self.img_without_dimensions.append(a.get('src'))
        if tag == 'form':
            self.forms.append(a)

html = (root / 'index.html').read_text(encoding='utf-8')
css = (root / 'styles.css').read_text(encoding='utf-8')
js = (root / 'script.js').read_text(encoding='utf-8')
p = Collector()
p.feed(html)
assert p.forms and all(x.get('action','').startswith('mailto:') for x in p.forms), 'form must not submit automatically to external server'
assert not p.img_without_dimensions, p.img_without_dimensions
assert 'docs.google.com/forms' not in (html + js)
assert 'fonts.googleapis.com' not in (html + css)
assert 'formResponse' not in (html + js)
assert 'extremadura' not in (html + css + js).lower(), 'geographic copy must not reappear'
assert 'precios de venta ni ofertas de LITOS' in html, 'market prices require explicit external-price disclaimer'
assert 'id="precios"' in html, 'missing market price section'
assert not any(x.startswith('https://') for x in p.assets), 'remote active assets forbidden'
for anchor in p.hrefs:
    if anchor.startswith('#'):
        assert anchor[1:] in p.ids, f'broken anchor: {anchor}'
for resource in p.assets + re.findall(r'url\([\'\"]?([^\)\'\"]+)', css):
    if resource and not resource.startswith(('data:', '#')):
        assert (root / resource).is_file(), f'missing asset: {resource}'
expected = {'index.html','styles.css','script.js','assets/favicon.svg','assets/hero-workshop.webp','assets/workshop-strip.webp','assets/limestone-texture.webp','assets/concept-mesa.webp','assets/concept-lavabo.webp','assets/concept-objetos.webp'}
actual = {x.relative_to(root).as_posix() for x in root.rglob('*') if x.is_file()}
assert expected == actual, f'unexpected/missing published files {expected ^ actual}'
assert sum(x.stat().st_size for x in root.rglob('*') if x.is_file()) < 2_500_000
if '--production' in sys.argv:
    assert 'Información legal completa pendiente de validación' not in html, 'release blocked: legal/privacy details unverified'
    assert 'Imágenes conceptuales, no portfolio ejecutado' in html, 'release blocked: concepts not clearly labeled'
print(f'PASS: {len(actual)} allowlisted files, all local links/assets resolve; no active external requests or embedded collection forms')
