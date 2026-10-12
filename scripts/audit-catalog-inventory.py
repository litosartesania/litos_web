#!/usr/bin/env python3
"""Audit all LITOS catalog PNG manifests against original files and public JS mapping.

Pure Python standard library. Read-only. Does not deploy, re-encode or alter images.
Usage: python3 scripts/audit-catalog-inventory.py [--root REPO] [--min-png 63]
"""
import argparse
import hashlib
import json
import re
import struct
import sys
from collections import Counter
from pathlib import Path

PREFIX = "assets/catalogo/variantes/"
PNG_SIGNATURE = bytes.fromhex("89504e470d0a1a0a")


def extract_json(source, name, pattern):
    match = re.search(pattern, source, re.DOTALL)
    if match is None:
        raise ValueError(f"Cannot find {name} in catalogo-precios.js")
    try:
        return json.loads(match.group(1))
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid {name} JSON literal: {exc}") from exc


def audit(root, min_png):
    errors = []
    source = (root / "catalogo-precios.js").read_text(encoding="utf-8")
    materials = extract_json(source, "materials", r"\bconst materials=(\[[^\n]*?\]);")
    products = extract_json(source, "products", r"\bconst products=(\[[^\n]*?\]);")
    registered = extract_json(source, "approvedVariants", r"\bconst approvedVariants=Object\.freeze\((\{.*?\})\);")
    stone_ids = [item[0] for item in materials]
    product_ids = [item[0] for item in products]
    if len(stone_ids) != len(set(stone_ids)) or not stone_ids:
        errors.append("Material identifiers empty or duplicated")
    if len(product_ids) != len(set(product_ids)) or not product_ids:
        errors.append("Product identifiers empty or duplicated")
    known_stones = set(stone_ids)
    known_products = set(product_ids)
    manifests = sorted((root / "docs").glob("LOTE_*.json"))
    if not manifests:
        errors.append("No docs/LOTE_*.json manifests found")
    by_key = {}
    by_path = {}
    per_product = Counter()
    for manifest_path in manifests:
        try:
            payload = json.loads(manifest_path.read_text(encoding="utf-8"))
            records = payload["items"]
            if not isinstance(records, list) or not records:
                raise ValueError("'items' must be a non-empty list")
        except (ValueError, KeyError, OSError) as exc:
            errors.append(f"Invalid manifest {manifest_path.name}: {exc}")
            continue
        for item in records:
            try:
                product_id = item["product_id"]
                stone_id = item["stone_id"]
                rel = item["path"]
                expected_size = item["size_bytes"]
                digest = item["sha256"]
                dimensions = (item["width"], item["height"])
                key = f"{product_id}__{stone_id}"
                canonical = f"{PREFIX}{key}.png"
                if product_id not in known_products or stone_id not in known_stones:
                    errors.append(f"Unknown product/material pair: {key}")
                if rel != canonical or not isinstance(rel, str):
                    errors.append(f"Non-canonical asset path: {rel}")
                    continue
                if key in by_key or rel in by_path:
                    errors.append(f"Duplicate combination or file path: {key}")
                    continue
                by_key[key] = rel
                by_path[rel] = manifest_path.name
                per_product[product_id] += 1
                if not isinstance(digest, str) or not re.fullmatch(r"[0-9a-f]{64}", digest):
                    errors.append(f"Malformed SHA-256: {rel}")
                    continue
                path = root / rel
                if not path.is_file():
                    errors.append(f"Missing original PNG: {rel}")
                    continue
                data = path.read_bytes()
                if len(data) != expected_size:
                    errors.append(f"Byte size differs: {rel}")
                if hashlib.sha256(data).hexdigest() != digest:
                    errors.append(f"SHA-256 differs: {rel}")
                if len(data) < 24 or data[:8] != PNG_SIGNATURE or data[12:16] != b"IHDR":
                    errors.append(f"Invalid PNG header: {rel}")
                elif struct.unpack(">II", data[16:24]) != dimensions:
                    errors.append(f"PNG dimensions differ: {rel}")
            except (KeyError, TypeError, ValueError) as exc:
                errors.append(f"Malformed item in {manifest_path.name}: {exc}")
    disk_paths = {
        p.relative_to(root).as_posix()
        for p in (root / PREFIX).glob("*.png")
    }
    for rel in sorted(disk_paths - set(by_path)):
        errors.append(f"Unmanifested original PNG: {rel}")
    for key, rel in registered.items():
        if key not in by_key or by_key[key] != rel:
            errors.append(f"JS points to non-manifest asset: {key} -> {rel}")
    for key, rel in by_key.items():
        if registered.get(key) != rel:
            errors.append(f"Manifest PNG not registered in catalog JS: {key}")
    if len(by_key) < min_png:
        errors.append(f"Catalog regression: {len(by_key)} originals, minimum {min_png}")
    if len(by_key) > len(product_ids) * len(stone_ids):
        errors.append("More PNG combinations than products x materials")
    if any(count > len(stone_ids) for count in per_product.values()):
        errors.append("A product has more finishes than defined stones")

    total = len(product_ids) * len(stone_ids)
    complete = sum(count == len(stone_ids) for count in per_product.values())
    print(f"Products: {len(product_ids)}; stones: {len(stone_ids)}; slots: {total}")
    print(f"Manifests: {len(manifests)}; originals: {len(by_key)}; registered: {len(registered)}; on disk: {len(disk_paths)}")
    print(f"Complete products: {complete}; pending slots: {total - len(by_key)}")
    if errors:
        for err in errors:
            print("FAIL:", err, file=sys.stderr)
        return 1
    print(f"PASS: {len(by_key)}/{len(by_key)} original PNG SHA-256 verified; catalog mapping exact")
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--min-png", type=int, default=63,
                        help="minimum number of historically published originals (default 63)")
    args = parser.parse_args()
    if args.min_png < 0:
        parser.error("--min-png must not be negative")
    try:
        return audit(args.root.resolve(), args.min_png)
    except (OSError, ValueError, KeyError, TypeError) as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
