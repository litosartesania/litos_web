/* Original SVG compositor. Normalized zones are visual guides, never workshop dimensions. */
(() => {
  'use strict';
  const {catalog,resources}=window.LitosMemorialData;
  const NS='http://www.w3.org/2000/svg';
  const measure=document.createElement('canvas').getContext('2d');
  const find=(list,id)=>list.find(x=>x.id===id)||list[0];
  function node(tag,attrs={},text){
    const el=document.createElementNS(NS,tag);
    for(const [key,value] of Object.entries(attrs))el.setAttribute(key,String(value));
    if(text!==undefined)el.textContent=text;
    return el;
  }
  function add(parent,tag,attrs,text){const el=node(tag,attrs,text);parent.append(el);return el;}
  const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,Number(v)));
  function zone(face,z){return {x:face.x+z[0]*face.w,y:face.y+z[1]*face.h,w:z[2]*face.w,h:z[3]*face.h};}
  function paint(finish,dark){
    if(finish==='auto')finish=dark?'claro':'oscuro';
    const map={oscuro:{color:'#302e2b',shadow:'#fff8e8',light:'#161514'},claro:{color:'#dcd7ca',shadow:'#121212',light:'#f5f0e4'},blanco:{color:'#f2efdf',shadow:'#101010',light:'#fff8e8'},plata:{color:dark?'#c2c8c9':'#4d5559',shadow:dark?'#101214':'#e8eef1',light:'#e7edef'},oro:{color:dark?'#c5a56b':'#81622e',shadow:dark?'#17110b':'#fff1d8',light:'#e1c894'},relieve:{color:dark?'#a5a39c':'#a6a195',shadow:'#171614',light:'#f7f4e9'}};
    return {...map[finish],id:finish};
  }
  function fontCss(font,size){return `${font.style} 400 ${size}px "${font.family}",serif`;}
  function wrap(text,width,font,size){
    measure.font=fontCss(font,size);
    const lines=[];
    for(const para of text.split('\n')){
      if(!para.trim()){lines.push('');continue;}
      let current='';
      for(const word of para.trim().split(/\s+/u)){
        const combined=current?current+' '+word:word;
        if(measure.measureText(combined).width<=width){current=combined;continue;}
        if(current){lines.push(current);current='';}
        // Split a long unbroken string by Unicode code point, never insert markup.
        for(const char of Array.from(word)){
          if(current&&measure.measureText(current+char).width>width){lines.push(current);current='';}
          current+=char;
        }
      }
      lines.push(current);
    }
    return lines;
  }
  function ornament(group,id,category,box,placement,color,slot,face,techniqueOverride,surfaceDark=false){
    if(id==='ninguno'||!box)return;
    const entry=catalog.ornaments.find(x=>x.id===id&&x.category===category);
    if(!entry||entry.publicSelectable===false)return;
    const resource=resources[entry.path];
    if(!resource)throw Error('Motivo no disponible en esta vista.');
    const raster=entry.path.endsWith('.png')||entry.path.endsWith('.webp');
    const source=raster?null:new DOMParser().parseFromString(resource,'image/svg+xml').documentElement;
    const factor=clamp(placement.scale,25,250)/100;
    // Certain engraved crosses are deliberately tall: a square placement
    // container compresses them compared with actual workshop compositions.
    const aspect=raster&&entry.digitalSize?entry.digitalSize[0]/entry.digitalSize[1]:
      Number.isFinite(entry.displayAspect)&&entry.displayAspect>0?entry.displayAspect:1;
    const fullWidth=Math.min(box.w,box.h*aspect),fullHeight=fullWidth/aspect;
    // The layout box supplies the initial size/centre; the sliders span the entire face.
    const fit=Math.min(factor,(face.w*.96)/fullWidth,(face.h*.96)/fullHeight);
    const width=fullWidth*fit,height=fullHeight*fit;
    const homeX=clamp(box.x+(box.w-width)/2,face.x,face.x+face.w-width);
    const homeY=clamp(box.y+(box.h-height)/2,face.y,face.y+face.h-height);
    const travel=(value,first,home,last)=>value<=50?first+(home-first)*value/50:home+(last-home)*(value-50)/50;
    const x=travel(clamp(placement.x,0,100),face.x,homeX,face.x+face.w-width);
    const y=travel(clamp(placement.y,0,100),face.y,homeY,face.y+face.h-height);
    const technique=techniqueOverride||entry.simulatedTechnique||'grabado';
    const filterName=technique==='aplique 3D'?'applied-relief':technique==='bajorrelieve'||technique.includes('talla')?'carved-relief':technique==='metal'||technique.includes('aplique metálico')?'metal-applique':raster?'pictorial-engraved':'engraved';
    const g=add(group,'g',{'data-ornament':category+':'+id,'data-slot':slot,'data-zone':JSON.stringify(box),'data-technique':technique,color,fill:'none',stroke:'currentColor','stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round',filter:`url(#${filterName})`});
    if(raster&&technique==='grabado')g.style.mixBlendMode=surfaceDark?'screen':'multiply';
    // Only vetted repository SVG paths are imported, never user content.
    const artWidth=raster&&entry.digitalSize?entry.digitalSize[0]:100;
    const artHeight=raster&&entry.digitalSize?entry.digitalSize[1]:100;
    const nested=add(g,'svg',{x,y,width,height,viewBox:`0 0 ${artWidth} ${artHeight}`,
      // Anisotropic scaling is intentional only for vetted elongated silhouettes.
      preserveAspectRatio:!raster&&entry.displayShape==='vertical'?'none':'xMidYMid meet',
      'aria-hidden':'true'});
    if(raster){
      if(!resource.startsWith('data:image/png;base64,')&&!resource.startsWith('data:image/webp;base64,'))throw Error('Imagen PNG/WebP incorrecta.');
      add(nested,'image',{href:resource,x:0,y:0,width:artWidth,height:artHeight,preserveAspectRatio:'xMidYMid meet'});
    }else for(const child of source.children)if(child.localName!=='title')nested.append(document.importNode(child,true));
    return {x,y,w:width,h:height};
  }
  // Independent original silhouettes; no accessory dimensions or fixings are certified.
  function accessory(group,state,face,slot='accessory'){
    const kind=state[slot]||'ninguno';
    const item=catalog.accessories?.find(x=>x.id===kind);
    if(!item)return null;
    const selectedFinish=state[slot+'Finish'];
    const finish=item.finishes.includes(selectedFinish)?selectedFinish:item.finishes[0];
    const colors={bronce:['#ad8d5f','#574329','#e6cc95'],acero:['#adb8bd','#4c5b62','#e7eef0'],piedra:['#c6c2b9','#77736c','#efebe2'],porcelana:['#eeece6','#aeadab','#ffffff']};
    const [fill,edge,light]=colors[finish];
    const placement=state[slot+'Placement']||{x:state.accessorySide==='left'?0:100,y:100,scale:100};
    const aspect=item.digitalSize?item.digitalSize[0]/item.digitalSize[1]:item.aspect;
    const base=Math.min(face.w*(aspect>1.4?.25:.18),aspect>1.4?180:140);
    const w=Math.min(base*clamp(placement.scale,25,250)/100,face.w*.6,face.h*.65*aspect);
    const h=w/aspect;
    const first=Math.max(24,face.x-w*.58),last=Math.min(976-w,face.x+face.w-w*.42);
    const x=first+(last-first)*clamp(placement.x,0,100)/100;
    const y=face.y+(face.h-h)*clamp(placement.y,0,100)/100;
    const g=add(group,'g',{'data-slot':slot,'data-accessory':kind,'data-accessory-finish':finish,'data-bounds':JSON.stringify({x,y,w,h}),filter:'url(#accessory-contact)'});
    add(g,'ellipse',{cx:x+w*.5,cy:y+h*.96,rx:w*.42,ry:Math.max(2,h*.035),fill:'#181714',opacity:.32});
    const render=resources[item.renderPath]||resources[item.thumbnailPath];
    if(render?.startsWith('data:image/')){add(g,'image',{href:render,x,y,width:w,height:h,preserveAspectRatio:'xMidYMid meet'});}
    else{
      const source=new DOMParser().parseFromString(resources[item.path],'image/svg+xml').documentElement;
      const nested=add(g,'svg',{x,y,width:w,height:h,viewBox:'0 0 100 100',style:`color:${fill};--edge:${edge};--shine:${light}`,'aria-hidden':'true'});
      if(kind==='ceramica-oval'&&state.ceramicImage?.startsWith('data:image/')){
        const clipId=slot+'-ceramic-photo-clip';
        const clip=add(nested,'clipPath',{id:clipId});
        add(clip,'ellipse',{cx:50,cy:48,rx:23.5,ry:35});
        add(nested,'ellipse',{cx:50,cy:53,rx:30,ry:43,fill:'#252424',opacity:.24});
        add(nested,'ellipse',{cx:50,cy:48,rx:30,ry:43,fill:'#f4f3ee',stroke:'#a9a9a3','stroke-width':1.5});
        add(nested,'image',{href:state.ceramicImage,x:26,y:12,width:48,height:72,preserveAspectRatio:'xMidYMid slice','clip-path':`url(#${clipId})`});
        add(nested,'ellipse',{cx:50,cy:48,rx:24,ry:35.5,fill:'none',stroke:'#faf9f3','stroke-width':1.8});
      }else for(const child of source.children)if(child.localName!=='title')nested.append(document.importNode(child,true));
    }
    return {kind:slot,id:kind,x,y,w,h};
  }
  function separator(group,id,box,color){
    if(id==='ninguno')return;
    const entry=catalog.ornaments.find(x=>x.id===id&&x.category==='separadores');
    if(!entry)return;
    const source=new DOMParser().parseFromString(resources[entry.path],'image/svg+xml').documentElement;
    const nested=add(group,'svg',{x:box.x,y:box.y,width:box.w,height:box.h,viewBox:'0 35 100 30',preserveAspectRatio:'none',color,fill:'none',stroke:'currentColor','stroke-width':1.2,'data-ornament':'separadores:'+id,filter:'url(#engraved)'});
    for(const child of source.children)if(child.localName!=='title')nested.append(document.importNode(child,true));
    return box;
  }
  function compose(state){
    const material=find(catalog.materials,state.stone),model=find(catalog.models,state.model),layout=find(catalog.layouts,state.layout),font=find(catalog.fonts,state.type);
    const variant=find(material.variants,state.variant);
    const face={x:model.face[0]*1000,y:model.face[1]*1000,w:model.face[2]*1000,h:model.face[3]*1000};
    if(state.dimensions?.widthMm&&state.dimensions?.heightMm){
      const ratio=state.dimensions.widthMm/state.dimensions.heightMm;
      if(Number.isFinite(ratio)&&ratio>0){
        const centerX=face.x+face.w/2,centerY=face.y+face.h/2;
        if(ratio>face.w/face.h)face.h=face.w/ratio;else face.w=face.h*ratio;
        face.x=centerX-face.w/2;face.y=centerY-face.h/2;
      }
    }
    const finish=paint(state.finish,material.dark);
    const svg=node('svg',{xmlns:NS,viewBox:'0 0 1000 1000',width:1000,height:1000,role:'img','aria-labelledby':'memorial-svg-title memorial-svg-description','data-model':model.id,'data-stone':material.id,'data-variant':variant.id,'data-type':font.id,'data-finish':finish.id,'data-layout':layout.id});
    add(svg,'title',{id:'memorial-svg-title'},'Composición orientativa en '+material.name);
    add(svg,'desc',{id:'memorial-svg-description'},'Recreación digital por capas. '+model.name+'. '+layout.name+'. No es un plano de fabricación.');
    const defs=add(svg,'defs');
    add(defs,'style',{},`@font-face{font-family:"${font.family}";src:url("${resources[font.path]}") format("woff2");font-style:${font.style};font-weight:400}`);
    const stage=add(defs,'radialGradient',{id:'stage-light',cx:'.25',cy:'.12',r:'.95'});
    add(stage,'stop',{offset:0,'stop-color':'#f4f0e9'});add(stage,'stop',{offset:1,'stop-color':'#d6cec1'});
    const polish=add(defs,'linearGradient',{id:'polish',x1:0,y1:0,x2:1,y2:1});
    add(polish,'stop',{offset:0,'stop-color':'#ffffff','stop-opacity':.13});add(polish,'stop',{offset:.32,'stop-color':'#ffffff','stop-opacity':.015});add(polish,'stop',{offset:1,'stop-color':'#000000','stop-opacity':.09});
    const bevel=add(defs,'linearGradient',{id:'bevel',x1:0,y1:0,x2:.8,y2:1});
    add(bevel,'stop',{offset:0,'stop-color':material.dark?'#5a5b59':'#f8f7f0'});add(bevel,'stop',{offset:1,'stop-color':material.dark?'#131514':'#89877f'});
    const shadow=add(defs,'filter',{id:'slab-shadow',x:'-30%',y:'-30%',width:'170%',height:'180%'});
    add(shadow,'feDropShadow',{dx:12,dy:22,stdDeviation:15,'flood-color':'#403b32','flood-opacity':.3});
    const filter=add(defs,'filter',{id:'engraved',x:'-12%',y:'-15%',width:'125%',height:'135%','color-interpolation-filters':'sRGB'});
    add(filter,'feDropShadow',{dx:finish.id==='relieve'?1:-.45,dy:finish.id==='relieve'?1.5:-.55,stdDeviation:.25,'flood-color':finish.shadow,'flood-opacity':.65});
    add(filter,'feDropShadow',{dx:.3,dy:.65,stdDeviation:.2,'flood-color':finish.light,'flood-opacity':.45});
    const incisedImage=add(defs,'filter',{id:'pictorial-engraved',x:'-5%',y:'-5%',width:'110%',height:'110%','color-interpolation-filters':'sRGB'});
    add(incisedImage,'feColorMatrix',{type:'saturate',values:0});
    add(incisedImage,'feComponentTransfer');
    const incisedTransfer=incisedImage.lastChild;
    for(const key of ['R','G','B'])add(incisedTransfer,'feFunc'+key,{type:'linear',slope:material.dark?.32:.24,intercept:material.dark?.39:.28});
    add(incisedTransfer,'feFuncA',{type:'linear',slope:.82});
    const relief=add(defs,'filter',{id:'applied-relief',x:'-22%',y:'-22%',width:'144%',height:'150%','color-interpolation-filters':'sRGB'});
    add(relief,'feColorMatrix',{type:'saturate',values:0});
    // The independent white applique keeps its own material on every stone.
    add(relief,'feColorMatrix',{type:'matrix',values:'0.46 0 0 0 0.52 0 0.45 0 0 0.51 0 0 0.44 0 0.49 0 0 0 1 0',result:'white-figure'});
    add(relief,'feOffset',{in:'SourceAlpha',dx:2.4,dy:3.2,result:'extruded-alpha'});
    add(relief,'feComposite',{in:'extruded-alpha',in2:'SourceAlpha',operator:'out',result:'side-alpha'});
    add(relief,'feFlood',{'flood-color':'#b4ac9d',result:'side-color'});
    add(relief,'feComposite',{in:'side-color',in2:'side-alpha',operator:'in',result:'side'});
    const volume=add(relief,'feMerge');add(volume,'feMergeNode',{in:'side'});add(volume,'feMergeNode',{in:'white-figure'});
    add(relief,'feDropShadow',{dx:4.2,dy:5.4,stdDeviation:3.2,'flood-color':'#11100e','flood-opacity':.65});
    add(relief,'feDropShadow',{dx:-.8,dy:-1.1,stdDeviation:.5,'flood-color':'#fffdf6','flood-opacity':.42});
    const carved=add(defs,'filter',{id:'carved-relief',x:'-18%',y:'-18%',width:'136%',height:'136%'});
    add(carved,'feColorMatrix',{type:'saturate',values:0});
    const stoneTone=material.dark?'0.12':'0.52',stoneSlope=material.dark?'0.30':'0.39';
    add(carved,'feColorMatrix',{type:'matrix',values:`${stoneSlope} 0 0 0 ${stoneTone} 0 ${stoneSlope} 0 0 ${stoneTone} 0 0 ${stoneSlope} 0 ${stoneTone} 0 0 0 1 0`,result:'carved-tone'});
    add(carved,'feImage',{href:resources[variant.path],x:face.x,y:face.y,width:Math.max(face.w,face.h),height:Math.max(face.w,face.h),preserveAspectRatio:'none',result:'carved-stone'});
    add(carved,'feComposite',{in:'carved-stone',in2:'SourceAlpha',operator:'in',result:'carved-grain'});
    add(carved,'feComposite',{in:'carved-tone',in2:'carved-grain',operator:'arithmetic',k1:0,k2:.72,k3:.28,k4:0,result:'stone-carving'});
    // Inset edge lighting stays inside the cut silhouette, with no floating shadow.
    add(carved,'feGaussianBlur',{in:'SourceAlpha',stdDeviation:.65,result:'cut-alpha'});
    for(const [name,dx,dy,color,opacity] of [['cut-shadow',1.3,1.6,'#171616',.72],['cut-light',-1,-1.2,'#fffdf6',.65]]){
      add(carved,'feOffset',{in:'cut-alpha',dx,dy,result:name+'-offset'});
      add(carved,'feComposite',{in:'SourceAlpha',in2:name+'-offset',operator:'out',result:name+'-rim'});
      add(carved,'feFlood',{'flood-color':color,'flood-opacity':opacity,result:name+'-color'});
      add(carved,'feComposite',{in:name+'-color',in2:name+'-rim',operator:'in',result:name});
    }
    const cut=add(carved,'feMerge');for(const name of ['stone-carving','cut-shadow','cut-light'])add(cut,'feMergeNode',{in:name});
    const mount=add(defs,'filter',{id:'metal-applique',x:'-25%',y:'-25%',width:'150%',height:'150%'});
    add(mount,'feDropShadow',{dx:2,dy:2.5,stdDeviation:1.4,'flood-color':'#0d0e0d','flood-opacity':.72});
    add(mount,'feDropShadow',{dx:-.9,dy:-1.1,stdDeviation:.5,'flood-color':'#ffffff','flood-opacity':.55});
    const contact=add(defs,'filter',{id:'accessory-contact',x:'-35%',y:'-35%',width:'170%',height:'180%'});
    add(contact,'feDropShadow',{dx:2.5,dy:4,stdDeviation:2,'flood-color':'#11100e','flood-opacity':.62});
    const pattern=add(defs,'pattern',{id:'stone',patternUnits:'userSpaceOnUse',x:face.x,y:face.y,width:Math.max(face.w,face.h),height:Math.max(face.w,face.h)});
    add(pattern,'image',{href:resources[variant.path],x:0,y:0,width:Math.max(face.w,face.h),height:Math.max(face.w,face.h),preserveAspectRatio:'xMidYMid meet'});
    const shape=model.architecture==='arco'?`M${face.x},${face.y+80} Q${face.x+face.w/2},${face.y-60} ${face.x+face.w},${face.y+80} V${face.y+face.h} H${face.x}Z`:`M${face.x},${face.y}H${face.x+face.w}V${face.y+face.h}H${face.x}Z`;
    const clip=add(defs,'clipPath',{id:'slab-clip'});add(clip,'path',{d:shape});
    add(svg,'rect',{x:0,y:0,width:1000,height:1000,fill:'url(#stage-light)'});
    const surface=add(svg,'g',{'data-layer':'surface'});
    add(surface,'path',{d:shape,transform:'translate(11 14)',fill:material.dark?'#161817':'#a29e95',filter:'url(#slab-shadow)'});
    add(surface,'path',{d:shape,fill:'url(#stone)',stroke:'url(#bevel)','stroke-width':10,'stroke-linejoin':'round'});
    const geometry=add(svg,'g',{'data-layer':'geometry','data-architecture':model.architecture});
    add(geometry,'path',{d:shape,fill:'none',stroke:material.dark?'#a9aaa4':'#fffef9','stroke-width':1.4,opacity:.42});
    if(model.architecture==='pilastras'||model.architecture==='pilastras-altas'){
      // Architectural elements are recreated as stone relief, never as a copied
      // private photograph or a physically certified manufacturing profile.
      for(const x of [face.x-20,face.x+face.w-6]){
        add(geometry,'rect',{x,y:face.y-10,width:26,height:face.h+22,fill:'url(#stone)',stroke:'url(#bevel)','stroke-width':3});
        for(let k=1;k<5;k++)add(geometry,'path',{d:`M${x+k*5},${face.y+8}V${face.y+face.h-8}`,stroke:k%2?'#ffffff':'#000000','stroke-width':2,opacity:.18});
      }
      for(const [y,h] of [[face.y-24,27],[face.y+face.h,22]])add(geometry,'rect',{x:face.x-40,y,width:face.w+80,height:h,fill:'url(#stone)',stroke:'url(#bevel)','stroke-width':4});
    }
    if(model.architecture==='cornisa'||model.architecture==='repisa'){
      add(geometry,'rect',{x:face.x-16,y:face.y+face.h,width:face.w+32,height:24,fill:'url(#stone)',stroke:'url(#bevel)','stroke-width':3});
      if(model.architecture==='cornisa'){
        add(geometry,'rect',{x:face.x-28,y:face.y-27,width:face.w+56,height:30,fill:'url(#stone)',stroke:'url(#bevel)','stroke-width':4});
        for(const x of [face.x-13,face.x+face.w-9])add(geometry,'rect',{x,y:face.y,width:22,height:face.h,fill:'url(#stone)',stroke:'url(#bevel)','stroke-width':2});
      }
    }
    if(model.architecture==='arcos-gemelos'){
      const color=material.dark?'#ccc8bc':'#6c6962';
      add(geometry,'rect',{x:face.x+face.w*.025,y:face.y+face.h*.05,
        width:face.w*.95,height:face.h*.90,rx:2,fill:'none',
        stroke:color,'stroke-width':2.1,opacity:.46,filter:'url(#engraved)'});
      for(let column=0;column<2;column++){
        const x=face.x+face.w*(.085+column*.46),w=face.w*.37;
        const top=face.y+face.h*.17,bottom=face.y+face.h*.86;
        add(geometry,'path',{d:`M${x},${bottom}V${top+face.h*.24}Q${x+w/2},${top-face.h*.12} ${x+w},${top+face.h*.24}V${bottom}`,
          fill:'none',stroke:color,'stroke-width':2.8,opacity:.43,filter:'url(#engraved)',
          'data-architecture-component':column?'arch-right':'arch-left'});
      }
    }
    if(model.architecture==='losa'||model.architecture==='losa-anillas')
      add(geometry,'path',{d:`M${face.x},${face.y+face.h+15}H${face.x+face.w+11}`,stroke:'#353632','stroke-width':5,opacity:.8});
    if(model.architecture==='losa-anillas'){
      add(geometry,'rect',{x:face.x+face.w*.045,y:face.y+face.h*.085,
        width:face.w*.91,height:face.h*.83,rx:3,fill:'none',
        stroke:material.dark?'#bebbb3':'#aaa49b','stroke-width':2.5,filter:'url(#engraved)'});
      for(const anchor of [.11,.89]){
        const x=face.x+face.w*anchor,y=face.y+face.h*.18;
        add(geometry,'circle',{cx:x,cy:y-3,r:9,stroke:'#565b5c','stroke-width':3.5,fill:'none',
          filter:'url(#metal-applique)','data-architecture-component':'ring'});
        add(geometry,'circle',{cx:x,cy:y-13,r:4,fill:'#9aa0a0',stroke:'#565b5c','stroke-width':1});
      }
    }
    if(state.fixings){
      const pos=[[.065,.08],[.935,.08],[.065,.92],[.935,.92]];
      for(const [px,py] of pos){
        const x=face.x+face.w*px,y=face.y+face.h*py;
        add(geometry,'circle',{cx:x,cy:y,r:4.8,fill:'#a9aaa4',stroke:'#626661','stroke-width':1.3});
        add(geometry,'path',{d:`M${x-2},${y+1}L${x+2},${y-1}`,stroke:'#404340','stroke-width':1});
      }
    }
    const effects=add(svg,'g',{'data-layer':'surface-effects','clip-path':'url(#slab-clip)'});
    add(effects,'rect',{x:face.x,y:face.y,width:face.w,height:face.h,fill:'url(#polish)'});
    const symbols=add(svg,'g',{'data-layer':'symbols','clip-path':'url(#slab-clip)'}),ornaments=add(svg,'g',{'data-layer':'ornaments','clip-path':'url(#slab-clip)'});
    const boxes=[],warnings=[];
    const symbolBox=zone(face,layout.symbol),flowerBox=zone(face,layout.flower),textBox=zone(face,layout.text);
    const devotionalBox=layout.devotional?zone(face,layout.devotional):null;
    const secondaryBox=layout.secondary?zone(face,layout.secondary):null;
    const placedSymbol=ornament(symbols,state.symbol,'cruces',symbolBox,state.symbolPlacement,finish.color,'symbol',face);
    if(placedSymbol)boxes.push({kind:'symbol',id:state.symbol,...placedSymbol});
    const placedDevotional=ornament(symbols,state.devotional||'ninguno','religiosas',devotionalBox,state.devotionalPlacement||{x:50,y:50,scale:85},'#f0efe8','devotional',face,state.devotionalTechnique||'aplique 3D',material.dark);
    if(placedDevotional)boxes.push({kind:'devotional',id:state.devotional,...placedDevotional});
    else if(state.devotional&&state.devotional!=='ninguno'&&!devotionalBox)warnings.push('La imagen religiosa necesita una composición con zona propia.');
    const flowerEntry=catalog.ornaments.find(o=>o.id===state.ornament&&(o.category==='flores'||o.category==='simbolos'));
    const placedFlower=ornament(ornaments,state.ornament,flowerEntry?.category,flowerBox,state.ornamentPlacement,finish.color,'ornament',face,undefined,material.dark);
    if(placedFlower)boxes.push({kind:'ornament',id:state.ornament,...placedFlower});
    const secondaryEntry=catalog.ornaments.find(o=>o.id===state.secondary&&(o.category==='flores'||o.category==='simbolos'));
    const placedSecondary=ornament(ornaments,state.secondary||'ninguno',secondaryEntry?.category,secondaryBox,state.secondaryPlacement||{x:50,y:50,scale:85},finish.color,'secondary',face,undefined,material.dark);
    if(placedSecondary)boxes.push({kind:'secondary',id:state.secondary,...placedSecondary});
    else if(state.secondary&&state.secondary!=='ninguno'&&!secondaryBox)warnings.push('El motivo adicional necesita una composición con zona propia.');
    const accessoryLayer=add(svg,'g',{'data-layer':'accessories'});
    for(const slot of ['accessory','accessory2']){
      const placed=accessory(accessoryLayer,state,face,slot);
      if(placed)boxes.push(placed);
    }
    const firstSeparator=separator(ornaments,state.separator,zone(face,layout.separator),finish.color);
    if(firstSeparator)boxes.push({kind:'separator',id:state.separator,...firstSeparator});
    if(layout.secondSeparator){const second=separator(ornaments,state.separator,zone(face,layout.secondSeparator),finish.color);if(second)boxes.push({kind:'secondSeparator',id:state.separator,...second});}
    if(state.frame!=='ninguno'){
      const entry=catalog.ornaments.find(x=>x.category==='marcos'&&x.id===state.frame);
      if(entry){
        const doc=new DOMParser().parseFromString(resources[entry.path],'image/svg+xml');
        const frame=add(ornaments,'svg',{x:face.x+face.w*.025,y:face.y+face.h*.025,width:face.w*.95,height:face.h*.95,viewBox:'0 0 100 100',preserveAspectRatio:'none',color:finish.color,fill:'none',stroke:'currentColor','data-ornament':'marcos:'+state.frame,filter:'url(#engraved)'});
        for(const child of doc.documentElement.children)if(child.localName!=='title')frame.append(document.importNode(child,true));
        boxes.push({kind:'frame',id:state.frame,x:face.x+face.w*.025,y:face.y+face.h*.025,w:face.w*.95,h:face.h*.95});
      }
    }
    const textLayer=add(svg,'g',{'data-layer':'text',id:'memorial-rendered',fill:finish.color,filter:'url(#engraved)'});
    const active=catalog.fields.filter(f=>state.fields[f.id].visible&&state.fields[f.id].text.trim());
    const total=active.reduce((sum,f)=>sum+f.weight,0),gap=active.length>1?Math.min(9,textBox.h*.025):0;
    const usable=textBox.h-gap*Math.max(0,active.length-1);
    let y=textBox.y,adjusted=false,truncated=false;
    const runs=[];
    for(const field of active){
      const box=layout.fieldZones?.[field.id]?zone(face,layout.fieldZones[field.id]):{x:textBox.x,y,w:textBox.w,h:usable*field.weight/total};
      const contents=state.fields[field.id].text;
      const factor=font.id==='inglesa'?1.16:1;
      const designSize=layout.fontHeight?.[field.id]?layout.fontHeight[field.id]*face.h:field.size*(face.w/780);
      let size=designSize*state.textSize/100*factor;
      let lines;
      const leading=clamp(state.leading,105,180)/100;
      // Ample bearing allowance protects calligraphic ascenders/descenders and overhangs.
      const minimum=Math.max(8,designSize*.43);
      for(let n=0;n<120;n++){
        lines=wrap(contents,box.w*.88,font,size);
        if(lines.length*size*leading<=box.h*.82&&lines.every(line=>{measure.font=fontCss(font,size);const m=measure.measureText(line);return Math.max(m.width,(m.actualBoundingBoxLeft||0)+(m.actualBoundingBoxRight||0))<=box.w*.90;}))break;
        if(size*.95<minimum){
          size=minimum;lines=wrap(contents,box.w*.88,font,size);
          const capacity=Math.max(1,Math.floor(box.h*.82/(size*leading)));
          if(lines.length>capacity){
            lines=lines.slice(0,capacity);
            let tail=lines[capacity-1];measure.font=fontCss(font,size);
            while(tail&&measure.measureText(tail+'…').width>box.w*.86)tail=tail.slice(0,-1);
            lines[capacity-1]=tail.trimEnd()+'…';
            truncated=true;warnings.push('El campo «'+field.label+'» es demasiado largo: la vista previa muestra solo el comienzo. Reduce el texto para habilitar la descarga.');
          }
          adjusted=true;break;
        }
        size*=.95;adjusted=true;
      }
      const lineHeight=size*leading;
      const anchor={left:'start',center:'middle',right:'end'}[state.align]||'middle';
      const x=state.align==='left'?box.x+box.w*.06:state.align==='right'?box.x+box.w*.94:box.x+box.w/2;
      measure.font=fontCss(font,size);
      const sample=measure.measureText('ÁgjpqÉÑ');
      const ascent=Math.max(size*.7,sample.actualBoundingBoxAscent||0);
      const descent=Math.max(size*.12,sample.actualBoundingBoxDescent||0);
      const inkHeight=ascent+descent+Math.max(0,lines.length-1)*lineHeight;
      const baseline=box.y+(box.h-inkHeight)/2+ascent;
      const text=add(textLayer,'text',{'data-field':field.id,'data-zone':JSON.stringify(box),'font-family':font.family,'font-style':font.style,'font-weight':400,'font-size':size,'data-height-ratio':size/face.h,'text-anchor':anchor,'xml:space':'preserve'});
      lines.forEach((line,i)=>{
        add(text,'tspan',{x,y:baseline+i*lineHeight},line);
        runs.push({text:line,x,y:baseline+i*lineHeight,size,font:fontCss(font,size),align:state.align,color:finish.color});
      });
      boxes.push({kind:'text:'+field.id,...box});
      y+=box.h+gap;
    }
    if(state.guides){
      const guides=add(svg,'g',{'data-layer':'guides',fill:'none',stroke:material.dark?'#d0ba86':'#6d5030','stroke-width':1.2,'stroke-dasharray':'5 5',opacity:.7});
      for(const box of [symbolBox,flowerBox,textBox,devotionalBox,secondaryBox].filter(Boolean))add(guides,'rect',{x:box.x,y:box.y,width:box.w,height:box.h});
    }
    add(svg,'text',{x:500,y:916,'text-anchor':'middle','font-family':'Arial, sans-serif','font-size':13,'letter-spacing':2,fill:'#5e594f'},'LITOS · SIMULACIÓN ORIENTATIVA');
    add(svg,'text',{x:500,y:942,'text-anchor':'middle','font-family':'Arial, sans-serif','font-size':12,fill:'#716c63'},'Textura recreada · No es un plano de fabricación');
    const movable=boxes.filter(b=>['symbol','devotional','ornament','secondary'].includes(b.kind));
    const texts=boxes.filter(b=>b.kind.startsWith('text:'));
    const intersects=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
    if(movable.some(a=>texts.some(b=>intersects(a,b))))warnings.push('Un motivo se superpone con la inscripción. Revisa su posición antes de usar el plano.');
    const addedAccessories=boxes.filter(b=>b.kind==='accessory'||b.kind==='accessory2');
    if(addedAccessories.some(a=>texts.some(b=>intersects(a,b))))warnings.push('Un complemento se superpone con el texto; revisa su colocación real.');
    if(addedAccessories.length===2&&intersects(addedAccessories[0],addedAccessories[1]))warnings.push('Los dos complementos se superponen; revisa su colocación real.');
    if(movable.some((a,i)=>movable.slice(i+1).some(b=>intersects(a,b))))warnings.push('Dos motivos se superponen. Revisa la composición.');
    return {svg,face,runs,boxes,inscription:active.map(field=>({id:field.id,label:field.label,text:state.fields[field.id].text})),finish,material,model,layout,font,adjusted,warnings,truncated,unrendered: Boolean((state.devotional&&state.devotional!=='ninguno'&&!devotionalBox)||(state.secondary&&state.secondary!=='ninguno'&&!secondaryBox))};
  }
  async function loadFonts(){
    const outcomes=await Promise.allSettled(catalog.fonts.map(async f=>{
      const face=new FontFace(f.family,`url("${resources[f.path]}")`,{style:f.style,weight:'400'});
      await face.load();document.fonts.add(face);
    }));
    if(outcomes.some(x=>x.status==='rejected'))throw Error('No se han podido cargar todas las tipografías locales. Recarga la vista previa.');
    await document.fonts.ready;
  }
  window.LitosMemorialComposer={compose,loadFonts,paint};
})();
