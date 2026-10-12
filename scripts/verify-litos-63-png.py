#!/usr/bin/env python3
"""Verify all 63 owner-supplied LITOS PNG originals without external dependencies."""
from pathlib import Path
import hashlib, json, struct, sys

root = Path(__file__).resolve().parents[1]
manifests = [json.loads((root / p).read_text(encoding="utf-8")) for p in ("docs/LOTE_10_IMAGENES_20261011.json", "docs/LOTE_8_IMAGENES_20261011.json", "docs/LOTE_9_MESA_OVAL_20261012.json", "docs/LOTE_9_MESA_REDONDA_20261012.json", "docs/LOTE_9_MESA_RECTANGULAR_20261012.json", "docs/LOTE_9_MESA_CENTRO_MON_20261012.json", "docs/LOTE_9_MESA_CENTRO_RED_20261012.json")]
assert [len(m["items"]) for m in manifests] == [10, 8, 9, 9, 9, 9, 9]
items = [i for m in manifests for i in m["items"]]
errors = []
seen = set()
for i in items:
    rel = i["path"]
    if rel in seen or not rel.startswith("assets/catalogo/variantes/") or ".." in Path(rel).parts or not rel.endswith(".png"):
        errors.append("RUTA NO PERMITIDA O DUPLICADA: " + rel)
        continue
    seen.add(rel)
    f = root / rel
    if not f.is_file():
        errors.append("FALTA: " + rel)
        continue
    data = f.read_bytes()
    if len(data) != i["size_bytes"]:
        errors.append("TAMAÑO DISTINTO: " + rel)
    if hashlib.sha256(data).hexdigest() != i["sha256"]:
        errors.append("SHA-256 DISTINTO: " + rel)
    if len(data) < 24 or data[:8] != bytes.fromhex("89504e470d0a1a0a") or data[12:16] != b"IHDR":
        errors.append("NO ES PNG: " + rel)
        continue
    if struct.unpack(">II", data[16:24]) != (i["width"], i["height"]):
        errors.append("DIMENSIONES DISTINTAS: " + rel)
    print("REVISADO:", rel)
additional = {str(p.relative_to(root)) for p in (root / "assets/catalogo/variantes").glob("*.png")} - seen
if additional:
    errors.append("PNG ADICIONALES NO CATALOGADOS: " + ", ".join(sorted(additional)))
if errors:
    for e in errors:
        print("ERROR:", e, file=sys.stderr)
    print("FAILED: originals were not uploaded intact.", file=sys.stderr)
    sys.exit(1)
print("SUCCESS: 63/63 PNG originales íntegros.")
