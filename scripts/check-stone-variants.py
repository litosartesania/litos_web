#!/usr/bin/env python3
"""LITOS stone variant package verifier (stdlib; no networking or credentials).

Default: validates variants that are present and reports missing candidates.
--require-all: blocks integration until all 10 WebP files exist and are non-identical
for the five different materials of each table.
"""
import argparse
import hashlib
from pathlib import Path

MODELS = ("mesa-comedor-oval", "mesa-centro-mon")
STONES = ("travertino", "macael", "verde-alpi", "granito", "marquina")


def inspect_webp(path: Path):
    data = path.read_bytes()
    if len(data) < 4096:
        raise ValueError("Too small to be a credible product image")
    if data[0:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise ValueError("Invalid WebP RIFF signature")
    return hashlib.sha256(data).hexdigest(), len(data)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".", help="Root folder containing assets/catalogo/variantes")
    parser.add_argument("--require-all", action="store_true")
    args = parser.parse_args()
    folder = Path(args.root) / "assets" / "catalogo" / "variantes"
    errors, missing, seen = [], [], {}
    for model in MODELS:
        for stone in STONES:
            key = f"{model}__{stone}"
            path = folder / f"{key}.webp"
            if not path.exists():
                missing.append(key)
                continue
            try:
                sha, count = inspect_webp(path)
                if sha in seen and stone != "travertino":
                    errors.append(f"{key}: duplicate of {seen[sha]}")
                seen[sha] = key
                print(f"OK {key}: {count} bytes sha256={sha}")
            except Exception as exc:
                errors.append(f"{key}: {exc}")
    print(f"present={len(seen)}/10; pending={len(missing)}")
    if missing:
        print("PENDING:", ", ".join(missing))
    if args.require_all and missing:
        errors.append(f"{len(missing)} material variants missing")
    if errors:
        for err in errors:
            print("ERROR:", err)
        raise SystemExit(1)


if __name__ == "__main__":
    main()
