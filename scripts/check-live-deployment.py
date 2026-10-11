#!/usr/bin/env python3
"""Verify the deployed LITOS catalog and all 18 original PNGs from the public Pages URL."""
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from pathlib import Path
import hashlib
import json
import os
import sys
import time

BASE = "https://litosartesania.github.io/litos_web/"
RELEASE = os.getenv("GITHUB_SHA", "manual-check")
ROOT = Path(__file__).resolve().parents[1]
MANIFESTS = [json.loads((ROOT / p).read_text(encoding="utf-8")) for p in ("docs/LOTE_10_IMAGENES_20261011.json", "docs/LOTE_8_IMAGENES_20261011.json")]
assert [len(m["items"]) for m in MANIFESTS] == [10, 8]
ITEMS = [i for m in MANIFESTS for i in m["items"]]
FILES = {
    "mobiliario.html": (
        "Elige la piedra para consultar imágenes conceptuales específicas",
        "styles.css?v=stone-20261011-18png",
        "catalogo-precios.js?v=stone-20261011-18png",
        "Por ahora no aceptamos encargos.",
        "Imágenes conceptuales, no portfolio ejecutado",
    ),
    "styles.css": (
        ".material-preview",
        ".concept-availability",
        "object-fit:contain",
        "filter:none",
    ),
    "catalogo-precios.js": (
        "const approvedVariants=Object.freeze(",
        "consola-esc__travertino",
        "banco-esc__marquina",
        "tonalMockup:false",
    ),
}
FORBIDDEN = {
    "mobiliario.html": ("simulación digital de tonalidad", "<form"),
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
                if content.count(item["path"]) != 1:
                    raise AssertionError(f"{file}: missing/duplicated PNG map: {item['path']}")
    for item in ITEMS:
        rel = item["path"]
        if not rel.startswith("assets/catalogo/variantes/") or ".." in Path(rel).parts:
            raise AssertionError(f"Unexpected manifest path: {rel}")
        data = read_live(rel, attempt)
        if len(data) != item["size_bytes"]:
            raise AssertionError(f"{rel}: unexpected file size")
        if hashlib.sha256(data).hexdigest() != item["sha256"]:
            raise AssertionError(f"{rel}: SHA-256 differs from original")

for attempt in range(1, 25):
    try:
        check(attempt)
        print("PASS: live Pages HTML/CSS/JS and all 18 unmodified PNG originals.", flush=True)
        sys.exit(0)
    except (AssertionError, URLError, HTTPError, TimeoutError, UnicodeDecodeError) as exc:
        print(f"WAIT {attempt}/24: {exc}", flush=True)
        if attempt < 24:
            time.sleep(10)
raise SystemExit("FAIL: public GitHub Pages did not pass release verification.")
