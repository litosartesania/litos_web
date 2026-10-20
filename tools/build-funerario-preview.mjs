// One complete review file, usable offline. No hosting, user text or saved browser state.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const html=readFileSync('funerario.html','utf8');
// The memorial studio contains a nested inspiration section; take the whole studio.
const section=html.match(/<section class="memorial-studio"[\s\S]*?<\/section>(?=<div class="catalog-grid">)/)?.[0];
if(!section)throw Error('Existing studio not found');
const css=readFileSync('styles.css','utf8');
const catalog=JSON.parse(readFileSync('assets/funerario/configuracion/catalogo.json','utf8'));
const offlineArt=Object.fromEntries(catalog.ornaments.filter(x=>x.publicSelectable!==false&&x.format==='image/webp').flatMap(x=>[x.path,x.thumbnailPath].map(path=>[path,'data:image/webp;base64,'+readFileSync(path).toString('base64')])));
for(const item of catalog.accessories)offlineArt[item.renderPath]='data:image/webp;base64,'+readFileSync(item.renderPath).toString('base64');
const scriptFor=n=>'<script>'+readFileSync('funerario-'+n+'.js','utf8').replaceAll('</script','<\\/script')+'</script>'+(n==='recursos'?'<script>Object.assign(window.LitosMemorialData.resources,'+JSON.stringify(offlineArt)+');</script>':'');
const scripts=['recursos','compositor','exportar','personalizador'].map(scriptFor).join('');
// Cross comparison remains an offline review of prototypes already selectable publicly.
const reviewerIds=['santiago','doblefilete','moldurada','metalica','florenzada','medalloncruz'];
const reviewBootstrap=`<script>(()=>{'use strict';
const candidates=new Set(${JSON.stringify(reviewerIds)});
const catalog=window.LitosMemorialData.catalog;
const select=document.getElementById('memorial-symbol');
for(const item of catalog.ornaments){
 if(!candidates.has(item.id))continue;
 if(item.category!=='cruces'||item.commercialReady!==false||item.publicSelectable!==true)throw Error('Approved prototype flag mismatch: '+item.id);
 if(![...select.options].some(option=>option.value===item.id))throw Error('Cross option missing: '+item.id);
}
if(select.options.length<11)throw Error('Review options missing');
})();</script>`;
const reviewScripts=scriptFor('recursos')+reviewBootstrap+['compositor','exportar','personalizador'].map(scriptFor).join('');
const out='<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>LITOS · Estudio de composición</title><style>'+css+'</style><style>body{background:#eeeae2}.review-head{max-width:1360px;margin:auto;padding:1.5rem 2.5rem;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #c7bdad}.review-head strong{font:400 1.6rem Georgia,serif;letter-spacing:.14em}.review-head span{font:11px Arial,sans-serif;color:#776650;letter-spacing:.1em}.memorial-studio{border-top:0;margin-bottom:0}.memorial-display{top:10px}@media(max-width:900px){.review-head{padding:1rem}.memorial-display{top:0}}@media(max-width:600px){.memorial-studio{margin-left:0;margin-right:0}}</style></head><body><header class="review-head"><strong>LITOS</strong><span>VISTA PREVIA · SIN ENCARGOS</span></header><main>'+section+'</main>'+scripts+'</body></html>';
mkdirSync('preview',{recursive:true});
writeFileSync('preview/LITOS_CONFIGURADOR_FUNERARIO.html',out);
const review=out.replace('<title>LITOS · Estudio de composición</title>',
 '<title>LITOS · Revisión de seis cruces · NO COMERCIAL</title>')
 .replace('<header class="review-head">','<p id="review-only-notice" style="text-align:center;background:#694c35;color:white;padding:12px;margin:0;font:700 13px Arial,sans-serif">ENTORNO DE REVISIÓN OFFLINE · SEIS CRUCES CANDIDATAS · NO APROBADAS COMERCIALMENTE</p><header class="review-head">')
 .replace(scripts,reviewScripts);
if(review===out||!review.includes(reviewBootstrap)||!review.includes('review-only-notice'))throw Error('Review injection missing');
writeFileSync('preview/LITOS_REVISION_CRUCES_6.html',review);

const localBootstrap="<script>(()=>{\n'use strict';\nconst data=window.LitosMemorialData;\nconst path='revisor/arte-local.png';\ndata.catalog.ornaments.push({id:'arte_local_temporal',category:'religiosas',name:'Imagen pictórica local (solo revisión)',path,commercialReady:false,publicSelectable:true,validation:'No validado comercialmente; se usa solo en memoria del navegador.'});\ndata.resources[path]='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9lC1UAAAAASUVORK5CYII=';\ndocument.getElementById('memorial-gallery-category').append(new Option('Imagen pictórica local (offline)','religiosas'));\ndocument.getElementById('memorial-devotional').append(new Option('Imagen pictórica local · NO VALIDADA','arte_local_temporal'));\n})();</script>";
const localHandler="<script>(()=>{\n'use strict';\nconst picker=document.getElementById('litos-local-upload');\nconst message=document.getElementById('litos-local-message');\npicker.addEventListener('change',async()=>{\n const f=picker.files?.[0];if(!f)return;\n if(!['image/png','image/webp'].includes(f.type)||f.size>5242880||f.size<100){\n  message.textContent='Solo PNG/WebP de hasta 5 MB.';picker.value='';return;\n }\n try{\n  const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Lectura local fallida.'));reader.readAsDataURL(f);});\n  const image=new Image();image.src=data;await image.decode();\n  if(image.width>4096||image.height>4096||image.width<32||image.height<32)throw Error('La imagen debe tener entre 32 y 4096 píxeles por lado.');\n  window.LitosMemorialData.resources['revisor/arte-local.png']=data;\n  const layout=document.getElementById('memorial-layout');layout.value='devocionlateral';layout.dispatchEvent(new Event('change',{bubbles:true}));\n  const category=document.getElementById('memorial-gallery-category');category.value='religiosas';category.dispatchEvent(new Event('change',{bubbles:true}));\n  const devotional=document.getElementById('memorial-devotional');devotional.value='arte_local_temporal';devotional.dispatchEvent(new Event('change',{bubbles:true}));\n  message.textContent='Imagen cargada localmente. Cambia piedra y tamaño, o exporta PNG; se perderá al cerrar.';\n }catch(error){message.textContent='No se pudo cargar la imagen: '+error.message;}\n finally{picker.value='';}\n});\n})();</script>";
const localPanel="<div id=\"litos-private-load\" style=\"padding:16px;max-width:1200px;margin:0 auto;background:#e8dec9;border:1px solid #b7a58d;color:#28241f;font:14px Arial,sans-serif\"><strong>PRUEBA LOCAL, NO PUBLICADA</strong> · Elige un archivo PNG/WebP desde tu dispositivo; no se envía a ningún servidor. <label>Imagen: <input id=\"litos-local-upload\" type=\"file\" accept=\"image/png,image/webp\"></label> <span id=\"litos-local-message\" role=\"status\">Sin imagen.</span></div>";
const localReview=out.replace('<title>LITOS · Estudio de composición</title>','<title>LITOS · Revisión pictórica local</title>')
 .replace('<header class="review-head">',localPanel+'<header class="review-head">')
 .replace(scripts,scriptFor('recursos')+localBootstrap+['compositor','exportar','personalizador'].map(scriptFor).join('')+localHandler);
if(!localReview.includes('litos-local-upload')||!localReview.includes('arte_local_temporal'))throw Error('Local image review injection missing');
writeFileSync('preview/LITOS_REVISION_FIGURATIVOS_LOCALES.html',localReview);
const reliefIds=['cristo-corona','cristo-crucificado','virgen-nino','san-jose-nino','angel','paloma-olivo','medallon-mariano','medallon-cristo'];
const reliefLayoutIds=['relievelateral','crucifijolateral','relievesuperior'];
const reliefBootstrap=`<script>(()=>{'use strict';
const data=window.LitosMemorialData,ids=new Set(${JSON.stringify(reliefIds)}),layoutIds=new Set(${JSON.stringify(reliefLayoutIds)});
const devotional=document.getElementById('memorial-devotional'),layout=document.getElementById('memorial-layout');
for(const item of data.catalog.ornaments){
 if(!ids.has(item.id))continue;
 if(item.commercialReady!==false||item.publicSelectable!==true||item.format!=='image/webp')throw Error('Prototipo figurativo no disponible: '+item.id);
 if(![...devotional.options].some(option=>option.value===item.id)||!data.resources[item.path])throw Error('Recurso offline no disponible: '+item.id);
}
for(const item of data.catalog.layouts){
 if(!layoutIds.has(item.id))continue;
 if(item.publicSelectable!==true||![...layout.options].some(option=>option.value===item.id))throw Error('Composición no disponible: '+item.id);
}
if(devotional.options.length!==9||layout.options.length!==9)throw Error('Faltan recursos de revisión');
})();</script>`;
const reliefScripts=scriptFor('recursos')+reliefBootstrap+['compositor','exportar','personalizador'].map(scriptFor).join('');
const reliefReview=out.replace('<title>LITOS · Estudio de composición</title>','<title>LITOS · Revisión de relieves fase 3</title>')
 .replace('<header class="review-head">','<p id="relief-review-only" style="text-align:center;background:#694c35;color:white;padding:12px;margin:0;font:700 13px Arial,sans-serif">COMPARACIÓN OFFLINE · OCHO FIGURAS Y TRES COMPOSICIONES PÚBLICAS COMO PROTOTIPOS · SIN VALIDACIÓN DE FABRICACIÓN</p><header class="review-head">')
 .replace(scripts,reliefScripts)
 .replace('</body></html>',`<script>addEventListener('load',()=>{const l=document.getElementById('memorial-layout'),d=document.getElementById('memorial-devotional');l.value='relievelateral';l.dispatchEvent(new Event('change',{bubbles:true}));d.value='cristo-corona';d.dispatchEvent(new Event('change',{bubbles:true}));});</script></body></html>`);
if(!reliefReview.includes(reliefBootstrap)||!reliefReview.includes('relief-review-only'))throw Error('Relief review injection missing');
writeFileSync('preview/LITOS_REVISION_RELIEVES_FASE3.html',reliefReview);
console.log('Self-contained configurator preview built: '+out.length+' bytes.');
