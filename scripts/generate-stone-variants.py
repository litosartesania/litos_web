#!/usr/bin/env python3
"""LITOS internal draft generator. No network, client data or paid dependencies.
Conceptual finishes are not proof of genuine stone or fabricated products.
"""
import math
from pathlib import Path
import cv2
import numpy as np
from PIL import Image

SIZE=(880,1100)
SOURCES={'mesa-comedor-oval':'litos-mesa-comedor-01.webp','mesa-centro-mon':'litos-mesa-centro-01.webp'}
MATERIALS={'travertino':(194,170,138),'macael':(218,215,212),'verde-alpi':(30,67,56),'granito':(136,135,132),'marquina':(27,30,31)}
POLYS={
'mesa-comedor-oval':{
'top':[[20,460],[34,454],[75,448],[155,442],[288,438],[440,436],[597,439],[729,443],[816,449],[849,460],[854,475],[849,485],[833,495],[788,503],[696,512],[550,518],[397,520],[244,515],[133,506],[53,495],[24,483]],
'left':[[161,502],[344,505],[354,510],[353,739],[341,752],[319,760],[185,762],[168,753],[162,739]],
'right':[[537,504],[730,502],[729,747],[716,761],[559,765],[540,754]],
},
'mesa-centro-mon':{
'top':[[45,590],[278,567],[424,562],[636,558],[849,605],[494,653]],
'front':[[44,589],[493,653],[493,694],[44,638]],
'side':[[494,653],[848,605],[849,658],[493,694]],
'left':[[119,644],[378,671],[377,780],[356,780],[125,761],[120,752]],
'right':[[395,684],[560,678],[623,674],[735,669],[736,800],[628,835],[397,802]],
}
}

def masks(model):
    out={}
    for name,points in POLYS[model].items():
        m=np.zeros((1100,880),np.uint8)
        cv2.fillPoly(m,[np.array(points,np.int32)],255)
        out[name]=m
    if model=='mesa-centro-mon':
        bowl=np.zeros((1100,880),np.uint8)
        cv2.ellipse(bowl,(368,553),(88,47),0,0,360,255,-1)
        cv2.fillPoly(bowl,[np.array([[282,543],[452,540],[458,567],[449,586],[423,599],[316,598],[293,582]],np.int32)],255)
        books=np.zeros_like(bowl)
        cv2.fillPoly(books,[np.array([[422,569],[508,557],[510,498],[572,495],[577,558],[631,563],[632,611],[428,608]],np.int32)],255)
        out['top']=cv2.bitwise_and(out['top'],cv2.bitwise_not(cv2.dilate(bowl|books,np.ones((4,4),np.uint8))))
    return out

def texture(material,shape,seed):
    h,w=shape
    rng=np.random.default_rng(seed)
    rgb=np.broadcast_to(np.array(MATERIALS[material],np.float32),(h,w,3)).copy()
    cloud=cv2.GaussianBlur(rng.standard_normal((h,w)).astype(np.float32),(0,0),23)
    cloud=(cloud-cloud.mean())/max(cloud.std(),.0001)
    grain=cv2.GaussianBlur(rng.standard_normal((h,w)).astype(np.float32),(0,0),.85)
    grain=(grain-grain.mean())/max(grain.std(),.0001)
    if material=='granito':
        rgb+=(cloud*8+grain*14)[...,None]
        salt=rng.random((h,w))
        rgb[salt<.05]-=rng.uniform(16,44,(salt<.05).sum())[:,None]
        rgb[salt>.95]+=rng.uniform(20,49,(salt>.95).sum())[:,None]
        return np.clip(rgb,0,255)
    rgb+=cloud[...,None]*(12 if material=='verde-alpi' else 4)
    rgb+=grain[...,None]*(5 if material=='verde-alpi' else 2)
    vein=np.zeros((h,w),np.uint8)
    n={'macael':14,'verde-alpi':34,'marquina':29}[material]
    for i in range(n):
        x0=int(rng.uniform(-w*.25,w*1.2))
        y0=int(rng.uniform(-h*.35,h*1.1))
        angle=rng.uniform(-1.2,1.2)
        length=int(rng.uniform(110,510))
        bend=rng.uniform(7,33)
        pts=[(int(x0+t*math.sin(angle)+bend*math.sin(t/50+i)),int(y0+t*math.cos(angle))) for t in range(0,length,3)]
        cv2.polylines(vein,[np.array(pts,np.int32)],False,int(rng.uniform(80,210)),int(rng.choice([1,1,2,3])))
    veins=cv2.GaussianBlur(vein,(0,0),.7).astype(np.float32)/255
    if material=='macael': shade=(132,139,141);opacity=.36
    elif material=='verde-alpi':shade=(170,192,165);opacity=.8
    else: shade=(175,169,160);opacity=.72
    rgb=rgb*(1-veins[...,None]*opacity)+np.array(shade,np.float32)*veins[...,None]*opacity
    return np.clip(rgb,0,255)

def generate(model,stone,source,out):
    orig=np.array(Image.open(source).convert('RGB').resize(SIZE,Image.Resampling.LANCZOS),np.float32)
    result=orig.copy()
    if stone!='travertino':
        gray=cv2.cvtColor(orig.astype(np.uint8),cv2.COLOR_RGB2GRAY).astype(np.float32)
        light=cv2.GaussianBlur(gray,(0,0),13)
        for i,(face,mask) in enumerate(masks(model).items()):
            pigment=texture(stone,gray.shape,5141+list(MATERIALS).index(stone)*101+i*41)
            illum=np.clip(.4+.6*(light/max(np.median(light[mask>0]),1)),.65,1.2)
            if face=='top':illum=np.clip(illum*1.04,.72,1.23)
            elif face in ('right','side'):illum=np.clip(illum*.83,.58,1.12)
            pigment=np.clip(pigment*illum[...,None]+(gray-cv2.GaussianBlur(gray,(0,0),4))[...,None]*.12,0,255)
            alpha=(cv2.GaussianBlur(mask,(3,3),.65).astype(np.float32)/255)[...,None]
            result=result*(1-alpha)+pigment*alpha
    out.parent.mkdir(parents=True,exist_ok=True)
    Image.fromarray(np.uint8(np.clip(result,0,255))).save(out,'WEBP',quality=90,method=6)

def main():
    root=Path(__file__).resolve().parent.parent
    for model,file in SOURCES.items():
        source=root/'assets/catalogo'/file
        if not source.is_file():raise RuntimeError('Missing source: '+str(source))
        for stone in MATERIALS:
            out=root/'assets/catalogo/variantes'/f'{model}__{stone}.webp'
            generate(model,stone,source,out)
            print(out.relative_to(root),out.stat().st_size)

if __name__=='__main__':main()
