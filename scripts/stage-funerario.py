"""Explicit public allowlist for generic memorial resources. No directory glob copying."""
from pathlib import Path
import json,sys,re,hashlib,shutil
root=Path(__file__).resolve().parents[1]
site=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
manifest=json.loads((root/'docs/FUNERARIO_ASSETS_MANIFEST.json').read_text())
for item in manifest['files']:
    path=item['path']
    assert re.fullmatch(r'assets/funerario/(materiales/(sudafrica|absoluto|tezal|macael|italia|champagne|quintana)-[12]\.webp|fuentes/(ebgaramond|cinzel|greatvibes|librebaskerville|notosans|unifrakturmaguntia)(\.woff2|-OFL\.txt)|ornamentos/(cruces|religiosas|separadores|marcos|flores|simbolos)/[a-z]+\.svg|configuracion/catalogo\.json)',path),path
    data=(root/path).read_bytes()
    assert len(data)==item['bytes'] and hashlib.sha256(data).hexdigest()==item['sha256'],path
    target=site/path;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
for name in ('funerario-recursos.js','funerario-compositor.js','funerario-exportar.js'):
    shutil.copyfile(root/name,site/name)
print(f'Staged {len(manifest["files"])} vetted memorial assets and three local composition modules.')
