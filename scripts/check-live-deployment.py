#!/usr/bin/env python3
"""Verify the deployed LITOS catalog and all 63 original PNGs from the public Pages URL."""
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from pathlib import Path
import hashlib
import json
import os
import re
import sys
import time

BASE = os.getenv("LITOS_BASE_URL", "https://litosartesania.github.io/litos_web/").rstrip("/") + "/"
RELEASE = os.getenv("GITHUB_SHA", "manual-check")
ROOT = Path(__file__).resolve().parents[1]
MANIFESTS = [json.loads((ROOT / p).read_text(encoding="utf-8")) for p in ("docs/LOTE_10_IMAGENES_20261011.json", "docs/LOTE_8_IMAGENES_20261011.json", "docs/LOTE_9_MESA_OVAL_20261012.json", "docs/LOTE_9_MESA_REDONDA_20261012.json", "docs/LOTE_9_MESA_RECTANGULAR_20261012.json", "docs/LOTE_9_MESA_CENTRO_MON_20261012.json", "docs/LOTE_9_MESA_CENTRO_RED_20261012.json")]
assert [len(m["items"]) for m in MANIFESTS] == [10, 8, 9, 9, 9, 9, 9]
ITEMS = [i for m in MANIFESTS for i in m["items"]]
MEMORIAL = json.loads((ROOT / "docs/FUNERARIO_ASSETS_MANIFEST.json").read_text(encoding="utf-8"))
assert len(MEMORIAL["files"]) == 131
# Read the release URLs from the actual HTML; do not keep a second, stale version string.
MEMORIAL_URLS = re.findall(r'(?:href|src)="((?:styles\.css|funerario-[a-z]+\.js)\?v=[^"]+)"', (ROOT/'funerario.html').read_text())
assert len(MEMORIAL_URLS) == 5
FILES = {
    "funerario.html": (
        'id="memorial-workbench"',
        *MEMORIAL_URLS,
        "Recreación digital orientativa",
    ),
    "mobiliario.html": (
        "Elige la piedra para consultar imágenes conceptuales específicas",
        "styles.css?v=litos-contacto-20261020-v1",
        "catalogo-precios.js?v=stone-20261015-bandeja8",
        "Por ahora no aceptamos encargos.",
        "Colección conceptual · 21 productos · 9 piedras · 21 planos",
        'class="catalog-workspace"',
    ),
    "styles.css": (
        ".memorial-studio",
        ".material-preview",
        ".concept-availability",
        "object-fit:contain",
        ".catalog-workspace>.material-planner",
        "grid-template-columns:clamp(255px,23vw,310px)",
        "filter:none",
    ),
    "catalogo-precios.js": (
        "const approvedVariants=Object.freeze(",
        "consola-esc__travertino",
        "banco-esc__marquina",
        "mesa-comedor-oval__calacatta",
        "mesa-comedor-red__calacatta",
        "mesa-comedor-rect__calacatta",
        "mesa-centro-mon__calacatta",
        "mesa-centro-red__calacatta",
        "macetero__verde-alpi",
        "tonalMockup:false",
    ),
}
FORBIDDEN = {
    "mobiliario.html": ("simulación digital de tonalidad", "Por ahora no aceptamos encargos.", "Imagen conceptual · Línea en estudio, no portfolio ejecutado.", "Explora 21 conceptos en una galería", "Imágenes conceptuales, no portfolio ejecutado"),
    "styles.css": ("--stone-photo-filter", "--stone-preview-tint",
                   ".catalog-mobiliario .material-heading > p{visibility:hidden}"),
    "catalogo-precios.js": ("--stone-photo-filter", "const visual=",
                           "const approvedVariants=Object.freeze({});"),
}

def read_live(file, attempt):
    url = BASE + file + "?verification=" + RELEASE[:12] + "-" + str(attempt)
    req = Request(url, headers={
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "User-Agent": "LITOS-release-verification/2.0",
    })
    with urlopen(req, timeout=30) as response:
        if response.status != 200:
            raise AssertionError(f"{file}: HTTP {response.status}")
        content = response.read()
        print(f"  {file}: HTTP 200, bytes={len(content)}, "
              f"cache-age={response.headers.get('Age','unknown')}", flush=True)
        return content

def check(attempt):
    for file, expected in FILES.items():
        content = read_live(file, attempt).decode("utf-8")
        for needle in expected:
            if needle not in content:
                raise AssertionError(f"{file}: missing release marker: {needle}")
        for needle in FORBIDDEN.get(file, ()):
            if needle in content:
                raise AssertionError(f"{file}: stale or forbidden content: {needle}")
        if file == "catalogo-precios.js":
            for item in ITEMS:
                expected_count=0 if item["path"].startswith("assets/catalogo/variantes/consola-esc__") else 1
                if content.count(item["path"]) != expected_count:
                    raise AssertionError(f"{file}: missing/duplicated PNG map: {item['path']}")
    for name in ("funerario.html", "styles.css", "funerario-recursos.js", "funerario-compositor.js", "funerario-exportar.js", "funerario-personalizador.js"):
        expected = (ROOT / name).read_bytes()
        actual = read_live(name, attempt)
        assert hashlib.sha256(actual).digest() == hashlib.sha256(expected).digest(), ("memorial module mismatch", name)
    for item in MEMORIAL["files"]:
        path = item["path"]
        assert path.startswith("assets/funerario/") and ".." not in Path(path).parts, ("unexpected memorial path", path)
        actual = read_live(path, attempt)
        assert len(actual) == item["bytes"] and hashlib.sha256(actual).hexdigest() == item["sha256"], ("memorial asset mismatch", path)
    script = read_live("catalogo-precios.js", attempt).decode("utf-8")
    for item in REVISIONS:
        rel=item["path"]
        assert rel.startswith("assets/catalogo/revisiones/20261013/") and ".." not in Path(rel).parts
        assert script.count(rel)==1,("revised image not referenced",rel)
        blob=read_live(rel, attempt)
        assert len(blob)==item["size_bytes"] and hashlib.sha256(blob).hexdigest()==item["sha256"],("revised image hash mismatch",rel)
    for item in TRAVERTINE:
        path=item["path"]
        assert path=='assets/catalogo/revisiones/20261013/travertino-seleccion/'+item['product_id']+'__travertino.png'
        assert script.count(path)==1,('new travertine missing in mapping',path)
        blob=read_live(path,attempt)
        assert len(blob)==item['size_bytes'] and hashlib.sha256(blob).hexdigest()==item['sha256'],('new travertine SHA-256',path)
    for i in EXTRA_TRAVERTINE:
        p=i['path']
        assert p=='assets/catalogo/revisiones/20261013/travertino-extra-seleccion/'+i['product_id']+'__travertino.png'
        assert script.count(p)==1,('extra travertine mapping',p)
        b=read_live(p,attempt)
        assert len(b)==i['size_bytes'] and hashlib.sha256(b).hexdigest()==i['sha256'],('extra travertine SHA-256',p)
    for i in NEW_PLANS:
        p=i['path']
        assert p=='assets/catalogo/revisiones/20261013/planos-12-seleccion/'+i['product_id']+'.png'
        assert script.count(p)==1,('new plan mapping',p)
        b=read_live(p,attempt)
        assert len(b)==i['size_bytes'] and hashlib.sha256(b).hexdigest()==i['sha256'],('new plan SHA-256',p)
    for x in MESA_AUX_PHOTOS:
        rel=x['path']
        assert rel=='assets/catalogo/revisiones/20261013/mesa-aux-ped-8-seleccion/mesa-aux-ped__'+x['stone_id']+'.png'
        assert script.count(rel)==1,('mesa auxiliar original missing',rel)
        data=read_live(rel,attempt)
        assert len(data)==x['size_bytes'] and hashlib.sha256(data).hexdigest()==x['sha256'],('mesa auxiliar original SHA256',rel)
    for x in MESA_BAL_PHOTOS:
        rel=x['path']
        assert rel=='assets/catalogo/revisiones/20261014/mesa-aux-bal-8-seleccion/mesa-aux-bal__'+x['stone_id']+'.png'
        assert script.count(rel)==1,('Mesa auxiliar baldas mapping',rel)
        data=read_live(rel,attempt)
        assert len(data)==x['size_bytes'] and hashlib.sha256(data).hexdigest()==x['sha256'],('Mesa auxiliar baldas SHA-256',rel)
    for item in MACETERO8:
        rel=item['path']
        assert rel=='assets/catalogo/revisiones/20261015/macetero-8-candidatas/macetero__'+item['stone_id']+'.png'
        assert script.count(rel)==1,('Macetero mapping missing',rel)
        b=read_live(rel,attempt)
        assert b[:8]==bytes((137,80,78,71,13,10,26,10))
        assert (int.from_bytes(b[16:20],'big'),int.from_bytes(b[20:24],'big'))==(1024,1536)
        assert len(b)==item['size_bytes'] and hashlib.sha256(b).hexdigest()==item['sha256'],('Macetero public SHA-256',rel)
    for item in BANDEJA8:
        rel=item['path']
        assert script.count(rel)==1,('Bandeja selection missing',rel)
        b=read_live(rel,attempt)
        assert len(b)==item['size_bytes'] and hashlib.sha256(b).hexdigest()==item['sha256'],('Bandeja SHA256',rel)
    for item in NEW80:
        rel='assets/catalogo/revisiones/20261015/lote-80-originales/'+item['filename']
        assert script.count(rel)==1,('missing new mapping',rel)
        b=read_live(rel,attempt)
        assert len(b)==item['size_bytes'] and hashlib.sha256(b).hexdigest()==item['source_sha256'],('original SHA256',rel)
    for item in ITEMS:
        rel = item["path"]
        if not rel.startswith("assets/catalogo/variantes/") or ".." in Path(rel).parts:
            raise AssertionError(f"Unexpected manifest path: {rel}")
        data = read_live(rel, attempt)
        if len(data) != item["size_bytes"]:
            raise AssertionError(f"{rel}: unexpected file size")
        if hashlib.sha256(data).hexdigest() != item["sha256"]:
            raise AssertionError(f"{rel}: SHA-256 differs from original")

REVISIONS = json.loads((ROOT/'docs/IMPORTACION_CONSOLA_ESC_20261013.json').read_text())['images']
TRAVERTINE = json.loads((ROOT/'docs/TRAVERTINO_7_REVISION_20261013.json').read_text())['images']
assert len(TRAVERTINE)==7 and len({x['product_id'] for x in TRAVERTINE})==7
EXTRA_TRAVERTINE=json.loads((ROOT/'docs/TRAVERTINO_7_EXTRAS_INTEGRACION_20261013.json').read_text())['images']
assert len(EXTRA_TRAVERTINE)==7 and len({x['product_id'] for x in EXTRA_TRAVERTINE})==7
assert len(REVISIONS)==11
PLANS = json.loads((ROOT/'docs/PLANOS_TECNICOS_20261012.json').read_text())['products']
assert len(PLANS)==9
NEW_PLANS=json.loads((ROOT/'docs/PLANOS_12_SELECCION_20261013.json').read_text(encoding='utf-8'))['images']
assert len(NEW_PLANS)==12 and len({i['product_id'] for i in NEW_PLANS})==12

MESA_AUX_PHOTOS=json.loads((ROOT/'docs/MESA_AUX_PED_8_VARIANTES_20261013.json').read_text(encoding='utf-8'))['images']
assert len(MESA_AUX_PHOTOS)==8 and len({x['stone_id'] for x in MESA_AUX_PHOTOS})==8

MESA_BAL_PHOTOS=json.loads((ROOT/'docs/MESA_AUX_BAL_8_VARIANTES_20261014.json').read_text(encoding='utf-8'))['images']
assert len(MESA_BAL_PHOTOS)==8 and {x['stone_id'] for x in MESA_BAL_PHOTOS}=={'caliza','macael','carrara','marquina','granito','cuarcita','calacatta','verde-alpi'}

NEW80=json.loads((ROOT/'docs/LOTE_80_ORIGINALES_20261015.json').read_text(encoding='utf-8'))['images']
assert len(NEW80)==80 and len({(i['product_id'],i['stone_id']) for i in NEW80})==80

BANDEJA8=json.loads((ROOT/'docs/BANDEJA_8_SELECCION_20261015.json').read_text(encoding='utf-8'))['images']
assert len(BANDEJA8)==8 and {i['stone_id'] for i in BANDEJA8}=={'caliza','macael','carrara','marquina','granito','cuarcita','calacatta','verde-alpi'}

MACETERO8=json.loads((ROOT/'docs/MACETERO_8_SELECCION_20261015.json').read_text(encoding='utf-8'))['images']
assert len(MACETERO8)==8 and {i['stone_id'] for i in MACETERO8}=={'caliza','macael','carrara','marquina','granito','cuarcita','calacatta','verde-alpi'}

for attempt in range(1, 25):
    try:
        check(attempt)
        script=read_live('catalogo-precios.js',attempt).decode('utf-8')
        for p in PLANS:
            assert script.count(p['path'])==(0 if p['product_id'] in ('consola-esc','mesa-comedor-oval') else 1), 'stale approved drawing map'
            data=read_live(p['path'],attempt)
            assert len(data)==p['size_bytes'] and hashlib.sha256(data).hexdigest()==p['sha256'], 'drawing SHA-256 mismatch'

        print("PASS: live Pages HTML/CSS/JS, memorial configurator and 82 public memorial assets, 63 historical PNGs, 80 new original PNGs, 8 Bandeja PNGs, 8 Macetero PNGs, 9 historical drawings, 12 new illustrative drawings, 11 corrected assets and 14 additional travertine originals plus eight Mesa auxiliar pedestal originals, all hash-verified.", flush=True)
        sys.exit(0)
    except (AssertionError, URLError, HTTPError, TimeoutError, UnicodeDecodeError) as exc:
        print(f"WAIT {attempt}/24: {exc}", flush=True)
        if attempt < 24:
            time.sleep(10)
raise SystemExit("FAIL: public GitHub Pages did not pass release verification.")

