"""Static consistency and privacy checks for the isolated memorial implementation."""
from pathlib import Path
import json,hashlib,re,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
catalog=json.loads((root/'assets/funerario/configuracion/catalogo.json').read_text())
manifest=json.loads((root/'docs/FUNERARIO_ASSETS_MANIFEST.json').read_text())
assert len(catalog['materials'])==7 and sum(len(m['variants']) for m in catalog['materials'])==14
assert len(catalog['ornaments'])==33 and len(catalog['fonts'])==6
assert len(catalog['layouts'])==6 and len(catalog['models'])==5
assert len(manifest['files'])==60
face=catalog['models'][0]['face'];assert abs(face[2]/face[3]-97/80)<1e-10
bundle=(root/'funerario-recursos.js').read_text()
pack=json.loads(bundle.split('window.LitosMemorialData=',1)[1].rstrip().rstrip(';'))
assert pack['catalog']==catalog
for entry in manifest['files']:
    data=(root/entry['path']).read_bytes()
    assert len(data)==entry['bytes'] and hashlib.sha256(data).hexdigest()==entry['sha256']
for item in catalog['ornaments']:
    path=root/item['path'];xml=ET.fromstring(path.read_bytes())
    assert all(el.tag.split('}')[-1] in {'svg','title','path','rect','circle','ellipse','g','line','polyline'} for el in xml.iter())
    assert not re.search(r'\b(?:href|onload|onclick)\s*=',path.read_text(),re.I)
    assert pack['resources'][item['path']]==path.read_text()
    if 'commercialReady' in item:
        assert item['commercialReady'] is False and item['rights'].startswith('Vector original genérico')
        assert item['digitalSize']==[100,100] and item['compatibleLayouts']
assert sum('commercialReady' in item for item in catalog['ornaments'])==14
for font in catalog['fonts']:
    assert 'SIL OPEN FONT LICENSE Version 1.1' in (root/font['license']).read_text()
    assert ' '.join((root/font['license']).read_text().split()) in ' '.join(bundle.split()), 'standalone font license missing'
for path in ['funerario-personalizador.js','funerario-compositor.js','funerario-exportar.js']:
    js=(root/path).read_text()
    for token in ['fetch(', 'XMLHttpRequest','sendBeacon','localStorage','sessionStorage','document.cookie','console.log','innerHTML','URLSearchParams','location.href=']:
        assert token not in js,(path,token)
assert 'SIMULACIÓN ORIENTATIVA' in (root/'funerario-compositor.js').read_text()
assert 'LITOS-simulacion-orientativa.png' in (root/'funerario-exportar.js').read_text()
assert set(pack['resources'])=={v['path'] for m in catalog['materials'] for v in m['variants']}|{f['path'] for f in catalog['fonts']}|{o['path'] for o in catalog['ornaments']}
print('PASS: memorial catalog, 60 asset hashes, OFL licenses, safe vectors and ephemeral local-only runtime')
