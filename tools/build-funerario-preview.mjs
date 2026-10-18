// One complete review file, usable offline. No hosting, user text or saved browser state.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const html=readFileSync('funerario.html','utf8');
const section=html.match(/<section class="memorial-studio"[\s\S]*?<\/section>/)?.[0];
if(!section)throw Error('Existing studio not found');
const css=readFileSync('styles.css','utf8');
const scriptFor=n=>'<script>'+readFileSync('funerario-'+n+'.js','utf8').replaceAll('</script','<\\/script')+'</script>';
const scripts=['recursos','compositor','exportar','personalizador'].map(scriptFor).join('');
// Review ONLY: mark the six unpublished crosses selectable in the standalone copy in memory.
// Never edit catalog.json or production selectors; all religious drawings remain rejected.
const reviewerIds=['santiago','doblefilete','moldurada','metalica','florenzada','medalloncruz'];
const reviewBootstrap=`<script>(()=>{'use strict';
const candidates=new Set(${JSON.stringify(reviewerIds)});
const catalog=window.LitosMemorialData.catalog;
const select=document.getElementById('memorial-symbol');
for(const item of catalog.ornaments){
 if(!candidates.has(item.id))continue;
 if(item.category!=='cruces'||item.commercialReady!==false||item.publicSelectable!==false)throw Error('Candidate flag mismatch: '+item.id);
 item.publicSelectable=true;
 select.append(new Option(item.name+' · SOLO REVISIÓN',item.id));
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

console.log('Self-contained configurator preview built: '+out.length+' bytes.');
