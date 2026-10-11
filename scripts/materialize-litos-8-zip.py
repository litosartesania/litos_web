#!/usr/bin/env python3
"""Materialize exactly eight approved PNGs from one owner-uploaded ZIP; no image transformations."""
import hashlib
import json
import struct
import zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
target_manifest=root/'docs/LOTE_8_IMAGENES_20261011.json'
manifest=json.loads(target_manifest.read_text(encoding='utf-8'))
assert len(manifest['items'])==manifest['expected_count']==8
zip_path=root/'transfer/LITOS_LOTE_8_VARIANTES_20261011.zip'
assert zip_path.is_file() and zip_path.stat().st_size<26000000,"Missing or unexpectedly large owner ZIP"
prefix="assets/catalogo/variantes/"
expected={i['path']:i for i in manifest['items']}
assert len(expected)==8 and all(p.startswith(prefix) and p.endswith('.png') and '..' not in Path(p).parts for p in expected)
with zipfile.ZipFile(zip_path) as archive:
    names=[info.filename for info in archive.infolist()]
    permitted=set(expected)|{'docs/LOTE_8_IMAGENES_20261011.json','LEEME_INTEGRACION.md'}
    assert len(names)==len(set(names)) and set(names)==permitted, "Unexpected or missing ZIP members"
    for info in archive.infolist():
        assert not info.is_dir() and info.file_size<10000000, info.filename
        assert (info.external_attr>>16)&0o170000!=0o120000, "Symlink not permitted"
        assert not info.filename.startswith('/') and '..' not in Path(info.filename).parts, info.filename
    source=json.loads(archive.read('docs/LOTE_8_IMAGENES_20261011.json'))
    src={i['path']:i for i in source['items']}
    assert set(src)==set(expected), "Source and target manifests disagree"
    for path,expected_item in expected.items():
        item=src[path]
        for k in ('sha256','size_bytes','width','height','product_id','stone_id'):
            assert item[k]==expected_item[k], (path,k)
    verified={}
    for path,item in expected.items():
        data=archive.read(path)
        assert len(data)==item['size_bytes'],('size',path)
        assert hashlib.sha256(data).hexdigest()==item['sha256'],('SHA256',path)
        assert data[:8]==bytes.fromhex('89504e470d0a1a0a') and data[12:16]==b'IHDR',('PNG',path)
        assert struct.unpack('>II',data[16:24])==(1122,1402),('dimensions',path)
        verified[path]=data
for path,data in verified.items():
    output=root/path
    if output.exists():
        assert output.read_bytes()==data,('existing image mismatch',path)
    else:
        output.parent.mkdir(parents=True,exist_ok=True)
        output.write_bytes(data)
    print("Verified without modification",path)
assert len(verified)==8
print('SUCCESS: 8/8 owner original PNGs materialized byte-for-byte on isolated branch; no Pages deployment')
