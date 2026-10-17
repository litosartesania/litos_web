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
  function ornament(group,id,category,box,placement,color,finish){
    if(id==='ninguno')return;
    const entry=catalog.ornaments.find(x=>x.id===id&&x.category===category);
    if(!entry)return;
    const source=new DOMParser().parseFromString(resources[entry.path],'image/svg+xml').documentElement;
    const factor=clamp(placement.scale,35,100)/100;
    const side=Math.min(box.w,box.h)*factor;
    const x=box.x+(box.w-side)*clamp(placement.x,0,100)/100;
    const y=box.y+(box.h-side)*clamp(placement.y,0,100)/100;
    const g=add(group,'g',{'data-ornament':category+':'+id,'data-zone':JSON.stringify(box),color,fill:'none',stroke:'currentColor','stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round',filter:'url(#engraved)'});
    // Only vetted repository SVG paths are imported, never user content.
    const nested=add(g,'svg',{x,y,width:side,height:side,viewBox:'0 0 100 100','aria-hidden':'true'});
    for(const child of source.children)if(child.localName!=='title')nested.append(document.importNode(child,true));
    return {x,y,w:side,h:side};
  }
  function separator(group,id,box,color){
    if(id==='ninguno')return;
    const entry=catalog.ornaments.find(x=>x.id===id&&x.category==='separadores');
    if(!entry)return;
    const source=new DOMParser().parseFromString(resources[entry.path],'image/svg+xml').documentElement;
    const nested=add(group,'svg',{x:box.x,y:box.y,width:box.w,height:box.h,viewBox:'0 35 100 30',preserveAspectRatio:'none',color,fill:'none',stroke:'currentColor','stroke-width':1.2,'data-ornament':'separadores:'+id,filter:'url(#engraved)'});
    for(const child of source.children)if(child.localName!=='title')nested.append(document.importNode(child,true));
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
    const symbols=add(svg,'g',{'data-layer':'symbols'}),ornaments=add(svg,'g',{'data-layer':'ornaments'});
    const boxes=[];
    const symbolBox=zone(face,layout.symbol),flowerBox=zone(face,layout.flower),textBox=zone(face,layout.text);
    const placedSymbol=ornament(symbols,state.symbol,'cruces',symbolBox,state.symbolPlacement,finish.color,finish);
    if(placedSymbol)boxes.push({kind:'symbol',...placedSymbol});
    const flowerEntry=catalog.ornaments.find(o=>o.id===state.ornament&&(o.category==='flores'||o.category==='simbolos'));
    const placedFlower=ornament(ornaments,state.ornament,flowerEntry?.category,flowerBox,state.ornamentPlacement,paint(state.ornamentFinish,material.dark).color,finish);
    if(placedFlower)boxes.push({kind:'ornament',...placedFlower});
    separator(ornaments,state.separator,zone(face,layout.separator),finish.color);
    if(layout.secondSeparator)separator(ornaments,state.separator,zone(face,layout.secondSeparator),finish.color);
    if(state.frame!=='ninguno'){
      const entry=catalog.ornaments.find(x=>x.category==='marcos'&&x.id===state.frame);
      if(entry){
        const doc=new DOMParser().parseFromString(resources[entry.path],'image/svg+xml');
        const frame=add(ornaments,'svg',{x:face.x+face.w*.025,y:face.y+face.h*.025,width:face.w*.95,height:face.h*.95,viewBox:'0 0 100 100',preserveAspectRatio:'none',color:finish.color,fill:'none',stroke:'currentColor','data-ornament':'marcos:'+state.frame,filter:'url(#engraved)'});
        for(const child of doc.documentElement.children)if(child.localName!=='title')frame.append(document.importNode(child,true));
      }
    }
    const textLayer=add(svg,'g',{'data-layer':'text',id:'memorial-rendered',fill:finish.color,filter:'url(#engraved)'});
    const active=catalog.fields.filter(f=>state.fields[f.id].visible&&state.fields[f.id].text.trim());
    const total=active.reduce((sum,f)=>sum+f.weight,0),gap=active.length>1?Math.min(9,textBox.h*.025):0;
    const usable=textBox.h-gap*Math.max(0,active.length-1);
    let y=textBox.y,adjusted=false;
    const runs=[];
    for(const field of active){
      const box={x:textBox.x,y,w:textBox.w,h:usable*field.weight/total};
      const contents=state.fields[field.id].text;
      const factor=font.id==='inglesa'?1.16:1;
      let size=field.size*state.textSize/100*factor*(face.w/780);
      let lines;
      const leading=clamp(state.leading,105,180)/100;
      // Ample bearing allowance protects calligraphic ascenders/descenders and overhangs.
      for(let n=0;n<120;n++){
        lines=wrap(contents,box.w*.88,font,size);
        if(lines.length*size*leading<=box.h*.82&&lines.every(line=>{measure.font=fontCss(font,size);const m=measure.measureText(line);return Math.max(m.width,(m.actualBoundingBoxLeft||0)+(m.actualBoundingBoxRight||0))<=box.w*.90;}))break;
        size*=.95;adjusted=true;
      }
      const lineHeight=size*leading;
      const anchor={left:'start',center:'middle',right:'end'}[state.align]||'middle';
      const x=state.align==='left'?box.x+box.w*.06:state.align==='right'?box.x+box.w*.94:box.x+box.w/2;
      const baseline=box.y+(box.h-lines.length*lineHeight)/2+size;
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
      for(const box of [symbolBox,flowerBox,textBox])add(guides,'rect',{x:box.x,y:box.y,width:box.w,height:box.h});
    }
    add(svg,'text',{x:500,y:916,'text-anchor':'middle','font-family':'Arial, sans-serif','font-size':13,'letter-spacing':2,fill:'#5e594f'},'LITOS · SIMULACIÓN ORIENTATIVA');
    add(svg,'text',{x:500,y:942,'text-anchor':'middle','font-family':'Arial, sans-serif','font-size':12,fill:'#716c63'},'Textura recreada · No es un plano de fabricación');
    return {svg,runs,boxes,finish,material,model,layout,font,adjusted};
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
