#!/usr/bin/env python3
"""Verify received LITOS images byte-for-byte, stdlib only; no network or deployment."""
from pathlib import Path
import hashlib, json, struct, sys
ROOT=Path(__file__).resolve().parent.parent
MANIFEST=ROOT/'docs/LITOS_IMAGENES_MANIFEST_20261011.json'
DATA=json.loads(MANIFEST.read_text(encoding='utf-8'))
EXPECTED=DATA['images']
assert DATA['expected']==20 and len(EXPECTED)==20
errors=[]
seen=set()
for row in EXPECTED:
    rel=row['path']
    if rel in seen or not rel.startswith('assets/catalogo/variantes/') or not rel.endswith('.png') or '..' in Path(rel).parts:
        errors.append('Unapproved/duplicate path: '+rel); continue
    seen.add(rel)
    f=ROOT/rel
    if not f.is_file():
        errors.append('MISSING: '+rel); continue
    raw=f.read_bytes()
    if len(raw)!=row['bytes']:
        errors.append('SIZE DIFFERENT: '+rel)
    sha=hashlib.sha256(raw).hexdigest()
    if sha!=row['sha256']:
        errors.append('SHA-256 DIFFERENT: '+rel)
    if len(raw)<24 or raw[:8]!=bytes.fromhex('89504e470d0a1a0a') or raw[12:16]!=b'IHDR':
        errors.append('NOT PNG: '+rel); continue
    width,height=struct.unpack('>II',raw[16:24])
    if (width,height)!=(row['width'],row['height']):
        errors.append('DIMENSIONS DIFFERENT: '+rel)
    if sha==row['sha256'] and len(raw)==row['bytes'] and (width,height)==(row['width'],row['height']):
        print('OK',rel,sha[:16])
actual={str(p.relative_to(ROOT)) for p in (ROOT/'assets/catalogo/variantes').glob('*.png')}
for extra in sorted(actual-seen): errors.append('UNEXPECTED: '+extra)
if errors:
    for problem in errors: print('ERROR:',problem,file=sys.stderr)
    print(f'FAIL: {len(errors)} errors, images received {len(actual)}/20',file=sys.stderr)
    sys.exit(1)
print('SUCCESS: 20 original images matched (SHA-256, PNG header, dimensions, byte count).')
