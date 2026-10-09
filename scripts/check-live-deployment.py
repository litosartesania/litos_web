#!/usr/bin/env python3
"""Confirm GitHub Pages serves the corrected stone explorer, not merely a successful deployment."""
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
import os
import sys
import time

BASE = "https://litosartesania.github.io/litos_web/"
RELEASE = os.getenv("GITHUB_SHA", "manual-check")
FILES = {
    "mobiliario.html": (
        "Explora las imágenes conceptuales originales",
        "styles.css?v=stone-20261009-3",
        "catalogo-precios.js?v=stone-20261009-3",
    ),
    "styles.css": (
        ".material-preview",
        ".concept-availability",
    ),
    "catalogo-precios.js": (
        "Referencias visuales originales",
        "tonalMockup:false",
    ),
}
FORBIDDEN = {
    "mobiliario.html": ("simulación digital de tonalidad",),
    "styles.css": ("--stone-photo-filter", "--stone-preview-tint", ".catalog-mobiliario .material-heading > p{visibility:hidden}"),
    "catalogo-precios.js": ("--stone-photo-filter", "const visual="),
}

def check(attempt):
    for file, expected in FILES.items():
        url = BASE + file + "?verification=" + RELEASE[:12] + "-" + str(attempt)
        req = Request(url, headers={"Cache-Control":"no-cache", "Pragma":"no-cache", "User-Agent":"LITOS-release-verification/1.0"})
        with urlopen(req, timeout=18) as res:
            content = res.read().decode("utf-8")
            age = res.headers.get("Age", "unknown")
            print(f"  {file}: HTTP {res.status}, bytes={len(content)}, cache-age={age}", flush=True)
        for needle in expected:
            if needle not in content:
                raise AssertionError(f"{file}: expected text not visible: {needle}")
        for needle in FORBIDDEN.get(file, ()):
            if needle in content:
                raise AssertionError(f"{file}: stale or misleading text still served: {needle}")

for attempt in range(1, 25):
    try:
        check(attempt)
        print("PASS: GitHub Pages serves corrected material HTML, CSS and JS.",flush=True)
        sys.exit(0)
    except (AssertionError, URLError, HTTPError, TimeoutError, UnicodeDecodeError) as exc:
        print(f"WAIT {attempt}/24: {exc}",flush=True)
        if attempt < 24:
            time.sleep(10)
raise SystemExit("FAIL: public Pages URL has not reflected the expected release; inspect caching/deployment.")
