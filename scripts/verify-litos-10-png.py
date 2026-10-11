#!/usr/bin/env python3
"""Verify LITOS 10 PNG originals without external dependencies."""
from pathlib import Path
import hashlib, json, struct, sys

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / "docs/LOTE_10_IMAGENES_20261011.json").read_text(encoding="utf-8"))
items = manifest["items"]
assert manifest["count_expected"] == len(items) == 10
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
print("SUCCESS: 10/10 PNG originales íntegros.")
