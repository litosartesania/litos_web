// One complete review file, usable offline. No hosting, user text or saved browser state.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const html=readFileSync('funerario.html','utf8');
const section=html.match(/<section class="memorial-studio"[\s\S]*?<\/section>/)?.[0];
if(!section)throw Error('Existing studio not found');
const css=readFileSync('styles.css','utf8');
const scripts=['recursos','compositor','exportar','personalizador'].map(n=>'<script>'+readFileSync('funerario-'+n+'.js','utf8').replaceAll('</script','<\\/script')+'</script>').join('');
const out='<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>LITOS · Estudio de composición</title><style>'+css+'</style><style>body{background:#eeeae2}.review-head{max-width:1360px;margin:auto;padding:1.5rem 2.5rem;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #c7bdad}.review-head strong{font:400 1.6rem Georgia,serif;letter-spacing:.14em}.review-head span{font:11px Arial,sans-serif;color:#776650;letter-spacing:.1em}.memorial-studio{border-top:0;margin-bottom:0}.memorial-display{top:10px}@media(max-width:900px){.review-head{padding:1rem}.memorial-display{top:0}}</style></head><body><header class="review-head"><strong>LITOS</strong><span>VISTA PREVIA · SIN ENCARGOS</span></header><main>'+section+'</main>'+scripts+'</body></html>';
mkdirSync('preview',{recursive:true});
writeFileSync('preview/LITOS_CONFIGURADOR_FUNERARIO.html',out);
console.log('Self-contained configurator preview built: '+out.length+' bytes.');
