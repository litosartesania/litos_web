"""Pack two original, unlabelled 4x2 texture atlases; never accepts workshop photos.

Usage: python3 tools/prepare-funerario-assets.py ORIGINAL_ATLAS_A ORIGINAL_ATLAS_B
Pillow is needed only to prepare assets, never by visitors or CI.
"""
from pathlib import Path
from PIL import Image
import sys, json

root=Path(__file__).resolve().parents[1]
dest=root/'assets/funerario/materiales'
dest.mkdir(parents=True,exist_ok=True)
ids=['sudafrica','absoluto','tezal','macael','italia','champagne','quintana']
for variant,source in enumerate(sys.argv[1:3],1):
    atlas=Image.open(source).convert('RGB')
    for i,key in enumerate(ids):
        col,row=i%4,i//4
        box=(round(col*atlas.width/4),round(row*atlas.height/2),round((col+1)*atlas.width/4),round((row+1)*atlas.height/2))
        # Extract an entire atlas cell without stretching, tiling or embellishment.
        atlas.crop(box).save(dest/f'{key}-{variant}.webp',quality=87,method=6)
print('Packed 14 original texture fields. Mineral fidelity requires sample approval.')
