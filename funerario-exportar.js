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
  window.LitosMemorialExport={download};
})();
