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
    const map={oscuro:{color:'#302e2b',shadow:'#fff8e8',light:'#161514'},claro:{color:'#dcd7ca',shadow:'#121212',light:'#f5f0e4'},blanco:{color:'#f2efdf',shadow:'#101010',light:'#fff8e8'},plata:{color:dark?'#c2c8c9':'#4d5559',shadow:dark?'#101214':'#e8eef1',light:'#e7edef'},oro:{color:dark?'#c5a56b':'#81622e',shadow:dark?'#17110b':'#fff1d8',light:'#e1c894'},relieve:{color:dark?'#a5a39c':'#68645c',shadow:'#171614',light:'#f7f4e9'}};
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
  function ornament(group,id,category,box,placement,color,slot,face){
    if(id==='ninguno'||!box)return;
    const entry=catalog.ornaments.find(x=>x.id===id&&x.category===category);
    if(!entry||entry.publicSelectable===false)return;
    const resource=resources[entry.path];
    if(!resource)throw Error('Motivo no disponible en esta vista.');
    const raster=entry.path.endsWith('.png')||entry.path.endsWith('.webp');
    const source=raster?null:new DOMParser().parseFromString(resource,'image/svg+xml').documentElement;
    const factor=clamp(placement.scale,25,250)/100;
    const aspect=raster&&entry.digitalSize?entry.digitalSize[0]/entry.digitalSize[1]:1;
    const fullWidth=Math.min(box.w,box.h*aspect),fullHeight=fullWidth/aspect;
    // The layout box supplies the initial size/centre; the sliders span the entire face.
    const fit=Math.min(factor,(face.w*.96)/fullWidth,(face.h*.96)/fullHeight);
    const width=fullWidth*fit,height=fullHeight*fit;
    const homeX=clamp(box.x+(box.w-width)/2,face.x,face.x+face.w-width);
    const homeY=clamp(box.y+(box.h-height)/2,face.y,face.y+face.h-height);
    const travel=(value,first,home,last)=>value<=50?first+(home-first)*value/50:home+(last-home)*(value-50)/50;
    const x=travel(clamp(placement.x,0,100),face.x,homeX,face.x+face.w-width);
    const y=travel(clamp(placement.y,0,100),face.y,homeY,face.y+face.h-height);
    const technique=entry.simulatedTechnique||'incisión';
    const filterName=raster?'stone-relief':technique.includes('aplique metálico')?'metal-applique':technique.includes('talla')?'carved-relief':'engraved';
    const g=add(group,'g',{'data-ornament':category+':'+id,'data-slot':slot,'data-zone':JSON.stringify(box),'data-technique':technique,color,fill:'none',stroke:'currentColor','stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round',filter:`url(#${filterName})`});
    // Only vetted repository SVG paths are imported, never user content.
    const artWidth=raster&&entry.digitalSize?entry.digitalSize[0]:100;
    const artHeight=raster&&entry.digitalSize?entry.digitalSize[1]:100;
    const nested=add(g,'svg',{x,y,width,height,viewBox:`0 0 ${artWidth} ${artHeight}`,'aria-hidden':'true'});
    if(raster){
      if(!resource.startsWith('data:image/png;base64,')&&!resource.startsWith('data:image/webp;base64,'))throw Error('Imagen PNG/WebP incorrecta.');
      add(nested,'image',{href:resource,x:0,y:0,width:artWidth,height:artHeight,preserveAspectRatio:'xMidYMid meet'});
    }else for(const child of source.children)if(child.localName!=='title')nested.append(document.importNode(child,true));
    return {x,y,w:width,h:height};
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
    const relief=add(defs,'filter',{id:'stone-relief',x:'-12%',y:'-12%',width:'124%',height:'128%','color-interpolation-filters':'sRGB'});
    add(relief,'feColorMatrix',{type:'saturate',values:0});
    const tint=finish.color.match(/[0-9a-f]{2}/gi).map(v=>parseInt(v,16)/255);
    add(relief,'feColorMatrix',{type:'matrix',values:`${tint[0]} 0 0 0 0 0 ${tint[1]} 0 0 0 0 0 ${tint[2]} 0 0 0 0 0 1 0`});
    add(relief,'feDropShadow',{dx:1.2,dy:1.7,stdDeviation:1.1,'flood-color':'#11100e','flood-opacity':.43});
    add(relief,'feDropShadow',{dx:-.6,dy:-.8,stdDeviation:.6,'flood-color':'#fffdf6','flood-opacity':.3});
    const carved=add(defs,'filter',{id:'carved-relief',x:'-18%',y:'-18%',width:'136%',height:'136%'});
    add(carved,'feDropShadow',{dx:1.1,dy:1.4,stdDeviation:.7,'flood-color':'#171616','flood-opacity':.62});
    add(carved,'feDropShadow',{dx:-.7,dy:-.8,stdDeviation:.45,'flood-color':'#ffffff','flood-opacity':.52});
    const mount=add(defs,'filter',{id:'metal-applique',x:'-25%',y:'-25%',width:'150%',height:'150%'});
    add(mount,'feDropShadow',{dx:2,dy:2.5,stdDeviation:1.4,'flood-color':'#0d0e0d','flood-opacity':.72});
    add(mount,'feDropShadow',{dx:-.9,dy:-1.1,stdDeviation:.5,'flood-color':'#ffffff','flood-opacity':.55});
    const pattern=add(defs,'pattern',{id:'stone',patternUnits:'userSpaceOnUse',x:face.x,y:face.y,width:Math.max(face.w,face.h),height:Math.max(face.w,face.h)});
    add(pattern,'image',{href:resources[variant.path],x:0,y:0,width:Math.max(face.w,face.h),height:Math.max(face.w,face.h),preserveAspectRatio:'xMidYMid meet'});
    const shape=model.architecture==='arco'?`M${face.x},${face.y+80} Q${face.x+face.w/2},${face.y-60} ${face.x+face.w},${face.y+80} V${face.y+face.h} H${face.x}Z`:`M${face.x},${face.y}H${face.x+face.w}V${face.y+face.h}H${face.x}Z`;
    const clip=add(defs,'clipPath',{id:'slab-clip'});add(clip,'path',{d:shape});
    add(svg,'rect',{x:0,y:0,width:1000,height:1000,fill:'url(#stage-light)'});
    const surface=add(svg,'g',{'data-layer':'surface'});
    add(surface,'path',{d:shape,transform:'translate(11 14)',fill:material.dark?'#161817':'#a29e95',filter:'url(#slab-shadow)'});
    add(surface,'path',{d:shape,fill:'url(#stone)',stroke:'url(#bevel)','stroke-width':10,'stroke-linejoin':'round'});
    const geometry=add(svg,'g',{'data-layer':'geometry'});
    add(geometry,'path',{d:shape,fill:'none',stroke:material.dark?'#a9aaa4':'#fffef9','stroke-width':1.4,opacity:.42});
    if(model.architecture==='pilastras'){
      for(const x of [face.x-20,face.x+face.w-6]){
        add(geometry,'rect',{x,y:face.y-10,width:26,height:face.h+22,fill:'url(#stone)',stroke:'url(#bevel)','stroke-width':3});
        for(let k=1;k<5;k++)add(geometry,'path',{d:`M${x+k*5},${face.y+8}V${face.y+face.h-8}`,stroke:k%2?'#ffffff':'#000000','stroke-width':2,opacity:.18});
      }
      for(const [y,h] of [[face.y-24,27],[face.y+face.h,22]])add(geometry,'rect',{x:face.x-40,y,width:face.w+80,height:h,fill:'url(#stone)',stroke:'url(#bevel)','stroke-width':4});
    }
    if(model.architecture==='losa')add(geometry,'path',{d:`M${face.x},${face.y+face.h+15}H${face.x+face.w+11}`,stroke:'#353632','stroke-width':5,opacity:.8});
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
    const placedDevotional=ornament(symbols,state.devotional||'ninguno','religiosas',devotionalBox,state.devotionalPlacement||{x:50,y:50,scale:85},finish.color,'devotional',face);
    if(placedDevotional)boxes.push({kind:'devotional',id:state.devotional,...placedDevotional});
    else if(state.devotional&&state.devotional!=='ninguno'&&!devotionalBox)warnings.push('La imagen religiosa necesita una composición con zona propia.');
    const flowerEntry=catalog.ornaments.find(o=>o.id===state.ornament&&(o.category==='flores'||o.category==='simbolos'));
    const placedFlower=ornament(ornaments,state.ornament,flowerEntry?.category,flowerBox,state.ornamentPlacement,finish.color,'ornament',face);
    if(placedFlower)boxes.push({kind:'ornament',id:state.ornament,...placedFlower});
    const secondaryEntry=catalog.ornaments.find(o=>o.id===state.secondary&&(o.category==='flores'||o.category==='simbolos'));
    const placedSecondary=ornament(ornaments,state.secondary||'ninguno',secondaryEntry?.category,secondaryBox,state.secondaryPlacement||{x:50,y:50,scale:85},finish.color,'secondary',face);
    if(placedSecondary)boxes.push({kind:'secondary',id:state.secondary,...placedSecondary});
    else if(state.secondary&&state.secondary!=='ninguno'&&!secondaryBox)warnings.push('El motivo adicional necesita una composición con zona propia.');
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
      const box={x:textBox.x,y,w:textBox.w,h:usable*field.weight/total};
      const contents=state.fields[field.id].text;
      const factor=font.id==='inglesa'?1.16:1;
      let size=field.size*state.textSize/100*factor*(face.w/780);
      let lines;
      const leading=clamp(state.leading,105,180)/100;
      // Ample bearing allowance protects calligraphic ascenders/descenders and overhangs.
      const minimum=Math.max(12,field.size*.43*(face.w/780));
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
      const text=add(textLayer,'text',{'data-field':field.id,'data-zone':JSON.stringify(box),'font-family':font.family,'font-style':font.style,'font-weight':400,'font-size':size,'text-anchor':anchor,'xml:space':'preserve'});
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
