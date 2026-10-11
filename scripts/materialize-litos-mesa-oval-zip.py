#!/usr/bin/env python3
"""Import only nine user-approved original images from two GitHub ZIP uploads."""
from pathlib import Path
import hashlib,json,struct,zipfile,sys
root=Path(__file__).resolve().parents[1]
transfer=root/'transfer'
names=['LITOS_MESA_OVAL_CONCEPTO2_PARTE_1_20261012.zip','LITOS_MESA_OVAL_CONCEPTO2_PARTE_2_20261012.zip']
archives=[transfer/n for n in names]
if not all(p.is_file() for p in archives):
 print('WAIT: second ZIP not yet uploaded; no files modified')
 sys.exit(0)
assert all(0<p.stat().st_size<25*1024*1024 for p in archives),'ZIP too large'
manifest=json.loads((root/'docs/LOTE_9_MESA_OVAL_20261012.json').read_text())
items=manifest['items']
assert len(items)==manifest['expected_count']==9
indexed={i['path']:i for i in items}
assert len(indexed)==9 and all(p.startswith('assets/catalogo/variantes/mesa-comedor-oval__') and p.endswith('.png') and '..' not in Path(p).parts for p in indexed)
verified={}
for index,archive in enumerate(archives):
 expected=[i['path'] for i in (items[:5] if index==0 else items[5:])]
 allow=set(expected)|{'docs/LOTE_9_MESA_OVAL_20261012.json','LEEME_LOTE_9.txt'}
 with zipfile.ZipFile(archive) as z:
  infos=z.infolist()
  names=[i.filename for i in infos]
  assert len(names)==len(set(names)) and set(names)==allow,'Unexpected ZIP entries'
  for info in infos:
   assert not info.is_dir() and not info.filename.startswith('/') and '..' not in Path(info.filename).parts,'Invalid archive name'
   assert info.file_size<10*1024*1024,'Oversized entry'
   assert ((info.external_attr>>16)&0o170000)!=0o120000,'Symlink rejected'
  source=json.loads(z.read('docs/LOTE_9_MESA_OVAL_20261012.json'))
  source_index={i['path']:i for i in source['items']}
  assert set(source_index)==set(indexed),'Manifest path mismatch'
  for path in expected:
   item=indexed[path]
   assert all(item[field]==source_index[path][field] for field in ('sha256','size_bytes','width','height','product_id','stone_id')),path
   binary=z.read(path)
   assert len(binary)==item['size_bytes'],('Size',path)
   assert hashlib.sha256(binary).hexdigest()==item['sha256'],('SHA',path)
   assert binary[:8]==bytes.fromhex('89504e470d0a1a0a') and binary[12:16]==b'IHDR',('Format',path)
   assert struct.unpack('>II',binary[16:24])==(1122,1402),('Dimensions',path)
   verified[path]=binary
assert len(verified)==9
for path,binary in verified.items():
 output=root/path
 if output.exists():assert output.read_bytes()==binary,('Existing asset mismatch',path)
 else:
  output.parent.mkdir(parents=True,exist_ok=True)
  output.write_bytes(binary)
 print('IMPORTED EXACT BYTES:',path)
print('SUCCESS 9/9 image originals imported to isolated review branch; no Pages deployment')
