"""Static consistency and privacy checks for the isolated memorial implementation."""
from pathlib import Path
import json,hashlib,re,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
catalog=json.loads((root/'assets/funerario/configuracion/catalogo.json').read_text())
manifest=json.loads((root/'docs/FUNERARIO_ASSETS_MANIFEST.json').read_text())
review_manifest=json.loads((root/'docs/FUNERARIO_REVIEW_ASSETS_MANIFEST.json').read_text())
assert len(catalog['materials'])==7 and sum(len(m['variants']) for m in catalog['materials'])==14
assert len(catalog['ornaments'])==47 and len(catalog['fonts'])==6
assert len(catalog['layouts'])==9 and len(catalog['models'])==5
assert len(manifest['files'])==66 and len(review_manifest['files'])==8
face=catalog['models'][0]['face'];assert abs(face[2]/face[3]-97/80)<1e-10
bundle=(root/'funerario-recursos.js').read_text()
pack=json.loads(bundle.split('window.LitosMemorialData=',1)[1].rstrip().rstrip(';'))
assert pack['catalog']==catalog
for entry in manifest['files']+review_manifest['files']:
    data=(root/entry['path']).read_bytes()
    assert len(data)==entry['bytes'] and hashlib.sha256(data).hexdigest()==entry['sha256']
for item in catalog['ornaments']:
    path=root/item['path']
    if path.suffix=='.svg':
        xml=ET.fromstring(path.read_bytes())
        assert all(el.tag.split('}')[-1] in {'svg','title','path','rect','circle','ellipse','g','line','polyline'} for el in xml.iter())
        assert not re.search(r'\b(?:href|onload|onclick)\s*=',path.read_text(),re.I)
        assert pack['resources'][item['path']]==path.read_text()
    else:
        data=path.read_bytes()
        assert path.suffix=='.webp' and data[:4]==b'RIFF' and data[8:16]==b'WEBPVP8X' and data[20]&0x10
        assert len(data)<250_000 and item['path'] not in pack['resources']
    if 'commercialReady' in item:
        assert item['commercialReady'] is False and item['rights'] and item['compatibleLayouts']
        assert all(x>0 for x in item['digitalSize'])
assert sum('commercialReady' in item for item in catalog['ornaments'])==28
assert all(o.get('commercialReady') is False for o in catalog['ornaments'] if o.get('publicSelectable') is False)
# Rejected visuals remain available for review but are not public choices.
rejected={'madre','corona','ala','orantes','palomamedallon'}
candidates={'santiago','doblefilete','moldurada','metalica','florenzada','medalloncruz'}
figuratives={'cristo-corona','cristo-crucificado','virgen-nino','san-jose-nino','angel','paloma-olivo','medallon-mariano','medallon-cristo'}
assert {o['id'] for o in catalog['ornaments'] if o.get('publicSelectable') is False}==rejected|figuratives
assert {x['id'] for x in catalog['layouts'] if x.get('publicSelectable') is False}=={'relievelateral','crucifijolateral','relievesuperior'}
assert all(o.get('visualReview') and o.get('technicalValidation') and o.get('simulatedTechnique') for o in catalog['ornaments'] if o['id'] in figuratives)
assert all(o.get('publicSelectable') is True and o.get('commercialReady') is False for o in catalog['ornaments'] if o['id'] in candidates)
assert all(('value="'+id+'"') in (root/'funerario.html').read_text(encoding='utf8') for id in candidates)
assert all(o.get('commercialReady') is False for o in catalog['ornaments'] if o['id'] in rejected)
assert 'Imágenes religiosas</option>' not in (root/'funerario.html').read_text(encoding='utf8')
assert not any(('value="'+id+'"') in (root/'funerario.html').read_text(encoding='utf8') for id in rejected|figuratives|{'relievelateral','crucifijolateral','relievesuperior'})

for font in catalog['fonts']:
    assert 'SIL OPEN FONT LICENSE Version 1.1' in (root/font['license']).read_text()
    assert ' '.join((root/font['license']).read_text().split()) in ' '.join(bundle.split()), 'standalone font license missing'
for path in ['funerario-personalizador.js','funerario-compositor.js','funerario-exportar.js']:
    js=(root/path).read_text()
    for token in ['fetch(', 'XMLHttpRequest','sendBeacon','localStorage','sessionStorage','document.cookie','console.log','innerHTML','URLSearchParams','location.href=']:
        assert token not in js,(path,token)
assert 'SIMULACIÓN ORIENTATIVA' in (root/'funerario-compositor.js').read_text()
assert 'LITOS-simulacion-orientativa.png' in (root/'funerario-exportar.js').read_text()
assert set(pack['resources'])=={v['path'] for m in catalog['materials'] for v in m['variants']}|{f['path'] for f in catalog['fonts']}|{o['path'] for o in catalog['ornaments'] if o['id'] not in figuratives}
assert {x['path'] for x in review_manifest['files']}=={o['path'] for o in catalog['ornaments'] if o['id'] in figuratives}
print('PASS: 66 public assets, 8 isolated review reliefs, 5 rejected drawings hidden; 6 prototype crosses, OFL licenses and local-only runtime')
