/* Entirely local PNG export. No request, file upload or personal text in filenames. */
(() => {
  'use strict';
  const imageFrom=source=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('No se pudo rasterizar la composición.'));image.src=source;});
  async function download(scene){
    await document.fonts.ready;
    const clone=scene.svg.cloneNode(true);
    // Canvas uses the same already-loaded FontFace as live SVG, avoiding SVG-as-image font fallback.
    clone.querySelector('[data-layer="text"]').remove();
    clone.querySelector('[data-layer="guides"]')?.remove();
    const xml=new XMLSerializer().serializeToString(clone);
    const source=URL.createObjectURL(new Blob([xml],{type:'image/svg+xml;charset=utf-8'}));
    let image;
    try{image=await imageFrom(source);}finally{URL.revokeObjectURL(source);}
    const canvas=document.createElement('canvas');canvas.width=2000;canvas.height=2000;
    const ctx=canvas.getContext('2d');
    if(!ctx)throw Error('Tu navegador no permite exportar la imagen.');
    ctx.scale(2,2);ctx.drawImage(image,0,0,1000,1000);
    ctx.textBaseline='alphabetic';
    for(const run of scene.runs){
      ctx.font=run.font;ctx.textAlign=run.align;
      ctx.fillStyle=scene.finish.shadow;
      ctx.fillText(run.text,run.x-.45,run.y-.55);
      ctx.fillStyle=scene.finish.light;ctx.globalAlpha=.45;
      ctx.fillText(run.text,run.x+.3,run.y+.65);
      ctx.globalAlpha=1;ctx.fillStyle=run.color;
      ctx.fillText(run.text,run.x,run.y);
    }
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
    if(!blob)throw Error('La exportación no está disponible. Inténtalo de nuevo.');
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='LITOS-simulacion-orientativa.png';document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),30000);
    return blob;
  }
  const SVG='http://www.w3.org/2000/svg';
  function add(parent,tag,attributes={},content){
    const element=document.createElementNS(SVG,tag);
    for(const [name,value] of Object.entries(attributes))element.setAttribute(name,String(value));
    if(content!==undefined)element.textContent=content;
    parent.append(element);return element;
  }
  function makePlan(scene,width,height){
    if(!Number.isInteger(width)||!Number.isInteger(height)||width<50||height<50||width>3000||height>3000)throw Error('Introduce ancho y alto reales entre 50 y 3000 mm.');
    if(scene.truncated||scene.unrendered)throw Error('Corrige los elementos incompletos antes de generar el plano.');
    const f=scene.face, ox=58,oy=57, rows=scene.boxes.length+scene.inscription.length;
    const pageWidth=Math.max(width+110,480),pageHeight=height+142+rows*8;
    const svg=add(document.createDocumentFragment(),'svg',{xmlns:SVG,width:pageWidth+'mm',height:pageHeight+'mm',viewBox:`0 0 ${pageWidth} ${pageHeight}`,'data-units':'mm',role:'img'});
    add(svg,'title',{},'LITOS · Plano de colocación orientativo');
    add(svg,'desc',{},'Todas las cotas están en milímetros y dependen de las medidas de cara vista introducidas. Revisar en taller; no es plantilla de corte.');
    add(svg,'desc',{},scene.inscription.map(field=>field.label+': '+field.text).join(' | '));
    add(svg,'rect',{width:pageWidth,height:pageHeight,fill:'#fffdf9'});
    add(svg,'text',{x:ox,y:17,'font-family':'Arial, sans-serif','font-size':7,fill:'#282723','font-weight':'bold'},'LITOS · PLANO DE COLOCACIÓN');
    add(svg,'text',{x:ox,y:26,'font-family':'Arial, sans-serif','font-size':4,fill:'#59544d'},`${scene.model.name} · ${scene.material.name} · ${scene.layout.name}`);
    const drawing=add(svg,'g',{id:'CARA_VISTA',fill:'none',stroke:'#2f3131','stroke-width':'.6'});
    add(drawing,'rect',{x:ox,y:oy,width,height});
    const dimensions=add(svg,'g',{id:'COTAS',fill:'none',stroke:'#6c6258','stroke-width':'.35'});
    add(dimensions,'path',{d:`M${ox} ${oy-9}H${ox+width}M${ox} ${oy-12}V${oy-6}M${ox+width} ${oy-12}V${oy-6}M${ox-9} ${oy}V${oy+height}M${ox-12} ${oy}H${ox-6}M${ox-12} ${oy+height}H${ox-6}`});
    add(svg,'text',{x:ox+width/2,y:oy-12,'text-anchor':'middle','font-family':'Arial, sans-serif','font-size':5,fill:'#453d36'},width+' mm');
    add(svg,'text',{x:ox-15,y:oy+height/2,transform:`rotate(-90 ${ox-15} ${oy+height/2})`,'text-anchor':'middle','font-family':'Arial, sans-serif','font-size':5,fill:'#453d36'},height+' mm');
    const position=box=>({x:(box.x-f.x)/f.w*width,y:(box.y-f.y)/f.h*height,w:box.w/f.w*width,h:box.h/f.h*height});
    const fmt=value=>Number(value.toFixed(1));
    const names={symbol:'Cruz',devotional:'Imagen',ornament:'Motivo',secondary:'Adicional',separator:'Separador',secondSeparator:'Separador 2',frame:'Marco'};
    const catalog=window.LitosMemorialData.catalog;
    const labels=[];
    scene.boxes.forEach((box,index)=>{
      const p=position(box),kind=box.kind;
      const item=box.id?catalog.ornaments.find(entry=>entry.id===box.id):null;
      const inscription=kind.startsWith('text:')?scene.inscription.find(field=>'text:'+field.id===kind):null;
      const label=inscription?'Texto · '+inscription.label:(names[kind]||kind)+(item?' · '+item.name:'');
      const color=kind.startsWith('text:')?'#536784':kind==='frame'?'#8a7561':'#986749';
      const group=add(svg,'g',{id:'ELEMENTO_'+(index+1),fill:'none',stroke:color,'stroke-width':'.45'});
      add(group,'rect',{x:fmt(ox+p.x),y:fmt(oy+p.y),width:fmt(p.w),height:fmt(p.h)});
      add(svg,'text',{x:fmt(ox+p.x+2),y:fmt(oy+p.y+Math.min(6,p.h/2)),'font-family':'Arial, sans-serif','font-size':4,fill:color},String(index+1));
      labels.push(`${index+1}. ${label}   X ${fmt(p.x)} · Y ${fmt(p.y)} · ${fmt(p.w)} × ${fmt(p.h)} mm`);
    });
    let y=oy+height+13;
    add(svg,'text',{x:ox,y,'font-family':'Arial, sans-serif','font-size':5,'font-weight':'bold',fill:'#282723'},'ELEMENTOS · ORIGEN EN ESQUINA SUPERIOR IZQUIERDA');
    for(const line of labels){y+=8;add(svg,'text',{x:ox,y,'font-family':'Arial, sans-serif','font-size':4.3,fill:'#393630'},line);}
    for(const field of scene.inscription){y+=8;add(svg,'text',{x:ox,y,'font-family':'Arial, sans-serif','font-size':4.3,fill:'#393630'},field.label+': '+field.text.replace(/\s+/gu,' ').slice(0,95));}
    y+=9;add(svg,'text',{x:ox,y,'font-family':'Arial, sans-serif','font-size':4.3,fill:'#393630'},'Letra: '+scene.font.name+' (aproximación) · Color común: '+scene.finish.id);
    y+=8;add(svg,'text',{x:ox,y,'font-family':'Arial, sans-serif','font-size':4.3,fill:'#9a352b','font-weight':'bold'},'REVISAR MEDIDAS, CANTO, FIJACIONES, TIPOGRAFÍA Y TÉCNICA. NO USAR PARA CORTE.');
    if(scene.warnings.length){y+=8;add(svg,'text',{x:ox,y,'font-family':'Arial, sans-serif','font-size':4.3,fill:'#9a352b'},scene.warnings.join(' ').slice(0,120));}
    return svg;
  }
  function downloadPlan(scene,width,height){
    const svg=makePlan(scene,width,height);
    const blob=new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='LITOS-plano-colocacion-orientativo.svg';document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),30000);
    return blob;
  }
  window.LitosMemorialExport={download,makePlan,downloadPlan};
})();
