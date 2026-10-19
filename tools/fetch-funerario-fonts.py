"""Fetch four OFL Latin fonts from official Google Fonts endpoints once."""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import quote
import re

root = Path(__file__).resolve().parents[1] / 'assets/funerario/fuentes'
fonts = {
    'marcellus': 'Marcellus',
    'lora': 'Lora',
    'cormorantgaramond': 'Cormorant Garamond',
    'montserrat': 'Montserrat',
}
ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

def get(url):
    with urlopen(Request(url, headers={'User-Agent': ua}), timeout=20) as response:
        return response.read()

for slug, family in fonts.items():
    css = get('https://fonts.googleapis.com/css2?family=' + quote(family).replace('%20', '+') + '&display=swap').decode()
    latin = css.split('/* latin */')[-1]
    match = re.search(r'url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)', latin)
    if not match:
        raise RuntimeError('Latin WOFF2 unavailable for ' + family)
    font = get(match.group(1))
    license_text = get('https://raw.githubusercontent.com/google/fonts/main/ofl/' + slug + '/OFL.txt')
    license_text = b'\n'.join(line.rstrip() for line in license_text.splitlines()) + b'\n'
    if not font.startswith(b'wOF2') or b'SIL OPEN FONT LICENSE Version 1.1' not in license_text:
        raise RuntimeError('Invalid font or license: ' + family)
    (root / (slug + '.woff2')).write_bytes(font)
    (root / (slug + '-OFL.txt')).write_bytes(license_text)
    print(family, len(font), len(license_text))
