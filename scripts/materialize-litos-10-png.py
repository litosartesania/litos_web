#!/usr/bin/env python3
"""Losslessly materialize previously SHA-256-indexed PNGs from base64 chunks.
Only accepts originals from manifest and never alters artwork or deploys a website.
"""
import base64
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / "docs/LOTE_10_IMAGENES_20261011.json").read_text("utf8"))
assert len(manifest["items"]) == manifest["count_expected"] == 10
staging = ROOT / "transfer/imagenes-20261011"
seen = set()
for image in manifest["items"]:
    path = image["path"]
    assert path.startswith("assets/catalogo/variantes/") and path.endswith(".png")
    assert ".." not in Path(path).parts and path not in seen
    seen.add(path)
    target = ROOT / path
    if target.is_file():
        binary = target.read_bytes()
        origin = "Git blob directo"
    else:
        stem = Path(path).stem
        chunks = [staging / (stem + f".b64.part{i:02d}") for i in (1, 2)]
        if not all(ch.is_file() for ch in chunks):
            raise RuntimeError("Faltan fragmentos para " + path)
        encoded = "".join(ch.read_text("ascii") for ch in chunks)
        binary = base64.b64decode(encoded, validate=True)
        origin = "Base64 restaurado"
    if len(binary) != image["size_bytes"]:
        raise RuntimeError("Tamaño incorrecto: " + path)
    if hashlib.sha256(binary).hexdigest() != image["sha256"]:
        raise RuntimeError("SHA-256 incorrecto: " + path)
    if binary[:8] != bytes.fromhex("89504e470d0a1a0a"):
        raise RuntimeError("No es PNG: " + path)
    import struct
    if struct.unpack(">II", binary[16:24]) != (1122, 1402):
        raise RuntimeError("Dimensiones incorrectas: " + path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(binary)
    print(f"OK {origin}: {path} sha256={image['sha256']}")
unexpected = set()
if staging.exists():
    unexpected = {f.name for f in staging.iterdir() if f.is_file()} - {
        Path(i["path"]).stem + f".b64.part{part:02d}"
        for i in manifest["items"] for part in (1, 2)
    }
if unexpected:
    raise RuntimeError("Fragmentos no previstos: " + str(sorted(unexpected)))
print("SUCCESS 10/10 imágenes originales recuperadas, sin transformaciones.")
