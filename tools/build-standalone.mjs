// Standalone review: all CSS/images in one HTML, with three commercial pages and two legal views.
// Not published. Informational only: no commercial lead-capture elements.
import {readFileSync,writeFileSync} from 'node:fs';
const files=['index.html','funerario.html','mobiliario.html','aviso-legal.html','privacidad.html'];
const names=['inicio','funerario','mobiliario','aviso-legal','privacidad'];
const assets=['favicon.svg','hero-workshop.webp','workshop-strip.webp','limestone-texture.webp','concept-mesa.webp','concept-lavabo.webp','concept-objetos.webp',"catalogo/litos-banco-01.webp","catalogo/litos-banco-02.webp","catalogo/litos-consola-01.webp","catalogo/litos-consola-02.webp","catalogo/litos-lavabo-01.webp","catalogo/litos-lavabo-02.webp","catalogo/litos-mesa-auxiliar-01.webp","catalogo/litos-mesa-auxiliar-02.webp","catalogo/litos-mesa-centro-01.webp","catalogo/litos-mesa-centro-02.webp","catalogo/litos-mesa-comedor-01.webp","catalogo/litos-mesa-comedor-02.webp"];
const replace=(original)=>{
  let text=original;
  for(const n of assets){
    const mime=n.endsWith('.svg')?'image/svg+xml':'image/webp';
    const uri='data:'+mime+';base64,'+readFileSync('preview/assets/'+n).toString('base64');
    text=text.replaceAll('src="assets/'+n+'"','src="'+uri+'"');
    text=text.replaceAll('url("assets/'+n+'")','url("'+uri+'")');
  }
  return text;
};
const css=replace(readFileSync('preview/styles.css','utf8'));
const bodies=files.map((file,i)=>{
  const src=readFileSync('preview/'+file,'utf8');
  const m=src.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if(!m)throw Error('Body missing: '+file);
  const body=replace(m[1].replace(/<script\s+src="script\.js"\s*><\/script>/g,''));
  if(body.includes('src="assets/'))throw Error('Unresolved resource: '+file);
  return '<div data-view="'+names[i]+'"'+(i?' hidden':'')+'>'+body+'</div>';
});
const script=String.raw`
(()=>{
 const all=[...document.querySelectorAll('[data-view]')];
 const route=href=>({'index.html':'inicio','funerario.html':'funerario','mobiliario.html':'mobiliario','aviso-legal.html':'aviso-legal','privacidad.html':'privacidad'})[href.split(/[?#]/)[0]];
 const selected=()=>location.hash.match(/^#!(inicio|funerario|mobiliario|aviso-legal|privacidad)$/)?.[1]||'inicio';
 let current;
 function show(name,push=false){
  if(!all.some(x=>x.dataset.view===name))name='inicio';
  if(push)history.pushState(null,'','#!'+name);
  all.forEach(v=>v.hidden=v.dataset.view!==name);
  current=name;
  document.body.classList.remove('menu-open');
  document.querySelector('#preview-view').textContent=name;
  document.title='LITOS · '+name+' · Vista previa';
  window.scrollTo(0,0);
 }
 document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]');if(!a)return;
  const v=a.closest('[data-view]');if(!v||v.hidden)return;
  const href=a.getAttribute('href'),next=route(href);
  if(next){e.preventDefault();show(next,true);return;}
  if(href.startsWith('#')){e.preventDefault();v.querySelector('[id="'+href.slice(1)+'"]')?.scrollIntoView({behavior:'smooth'});return;}
  if(href.startsWith('mailto:')){e.preventDefault();return;}
 });
 document.querySelectorAll('[data-view] .menu-button').forEach(btn=>{
   const view=btn.closest('[data-view]');const menu=view.querySelector('.mobile-menu');
   function set(open){btn.setAttribute('aria-expanded',String(open));menu.hidden=!open;document.body.classList.toggle('menu-open',open);view.querySelector('main').inert=open;view.querySelector('.site-footer').inert=open;}
   btn.addEventListener('click',()=>set(btn.getAttribute('aria-expanded')!=='true'));
   view.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>set(false)));
   document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
 });
 if (document.querySelector('form')) throw new Error('Unexpected form in informational preview');
 window.addEventListener('hashchange',()=>show(selected()));
 window.addEventListener('popstate',()=>show(selected()));
 show(selected());
})();`;
const html='<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>LITOS — Vista previa</title><style>'+css+'</style><style>[data-view][hidden]{display:none!important}.preview-label{position:fixed;bottom:0;right:0;z-index:2147483646;background:#261f19;color:#fff;padding:7px 11px;font:12px sans-serif;pointer-events:none}</style></head><body>'+bodies.join('')+'<div role="status" class="preview-label">LITOS · VISTA PREVIA · <span id="preview-view">inicio</span> · sin encargos</div><script>'+script+'</script></body></html>';
writeFileSync('preview/LITOS_PREVISUALIZACION_AUTONOMA.html',html);
console.log('Standalone offline preview built, embedded assets and five linked views');
