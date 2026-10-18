// Editorial review gallery; all material images and candidate motifs are local.
import fs from 'node:fs';
const catalog=JSON.parse(fs.readFileSync('assets/funerario/configuracion/catalogo.json','utf8'));
const rejected=new Set(['madre','corona','ala','orantes','palomamedallon']);
const review=catalog.ornaments.filter(o=>o.validation&&o.rights&&!rejected.has(o.id));
const approvedPrototypeIds=new Set(['santiago','doblefilete','moldurada','metalica','florenzada','medalloncruz']);
const proposed=review.filter(o=>approvedPrototypeIds.has(o.id)&&o.category==='cruces'&&o.publicSelectable===true);
if(review.length!==15||proposed.length!==6)throw Error('Unexpected review gallery coverage');
if(proposed.some(o=>o.commercialReady!==false))throw Error('All cross proposals must be commercially unvalidated');
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeSvg=s=>{
 if(/<script\b|\bon\w+\s*=|<foreignObject\b|(?:href|src)\s*=\s*["'](?:https?:|data:|javascript:)/i.test(s))
  throw Error('Untrusted SVG in review gallery');
 return 'data:image/svg+xml;base64,'+Buffer.from(s).toString('base64');
};
const candidates=review.map(item=>{
 const svg=fs.readFileSync(item.path,'utf8');
 return {...item,image:safeSvg(svg)};
});
const materials=[
 ['sudafrica','Negro Sudáfrica','Oscura'],
 ['macael','Blanco Macael','Clara'],
 ['quintana','Gris Quintana','Gris']
].map(([id,name,label])=>{
 const stone=catalog.materials.find(m=>m.id===id);
 if(!stone)throw Error('Unknown material');
 const p=stone.variants[0].path;
 if(!p.startsWith('assets/funerario/materiales/'))throw Error('Unapproved material location');
 return {id,name,label,src:'data:image/webp;base64,'+fs.readFileSync(p).toString('base64')};
});
const cards=candidates.map((item,i)=>`<button type="button" class="motif-card" data-id="${esc(item.id)}" aria-pressed="${i===0?'true':'false'}" aria-label="${esc(item.name)}">
 <span class="mini-slab"><img src="${item.image}" alt="" width="110" height="110" loading="eager" decoding="async"></span>
 <span class="motif-name">${esc(item.name)}</span>
 <span class="meta">${item.publicSelectable===false?'Diseño en revisión':'Prototipo sin validar'}</span>
 </button>`).join('');
const controls=materials.map((m,i)=>`<button type="button" class="material-choice" data-stone="${m.id}" aria-pressed="${i===0?'true':'false'}">${esc(m.name)}</button>`).join('');
const css=String.raw`
:root{
 --ink:#26241f;--muted:#6b6256;--accent:#8b7055;
 --stone-sudafrica:url("${materials[0].src}");
 --stone-macael:url("${materials[1].src}");
 --stone-quintana:url("${materials[2].src}");
 font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--ink);background:#ece7df
}
*{box-sizing:border-box}
body{margin:0}
.shell{width:min(1540px,calc(100% - 48px));margin:0 auto}
.page-head{padding:55px 0 28px;display:grid;grid-template-columns:1fr 280px;gap:30px;align-items:end}
.kicker{font-size:.74rem;text-transform:uppercase;letter-spacing:.2em;color:var(--accent);font-weight:700}
h1{font:400 clamp(2.2rem,5.2vw,5.8rem)/.97 Georgia,serif;letter-spacing:-.045em;margin:14px 0 0}
h1 em{color:#8a7059;font-weight:400}
p{margin:.6rem 0}
.intro{color:var(--muted);font-size:.86rem}
.review-banner{padding:10px 14px;border-top:1px solid #ccbba9;border-bottom:1px solid #ccbba9;margin-bottom:19px;color:#735b40;font-size:.81rem}
.toolbar{background:#e4dbce;border:1px solid #cec0ad;padding:22px;margin-bottom:18px}
.toolbar strong{font-size:.78rem;display:block;margin-bottom:10px}
.stone-choices{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:18px}
button{font:inherit;cursor:pointer}
.material-choice{background:#f7f3ec;color:#25221c;border:1px solid #bfb19d;min-height:44px;padding:8px 18px;font-size:.82rem}
.material-choice[aria-pressed="true"]{background:#292822;color:white;border-color:#292822}
.current-choice{display:flex;justify-content:space-between;align-items:center;gap:20px;border-top:1px solid #ccbba9;padding-top:16px}
.current-choice label{font-size:.75rem;display:block;margin-bottom:6px}
select{min-height:45px;background:#fcf9f3;border:1px solid #b6aa9d;padding:10px 12px;min-width:min(100%,350px)}
.preview{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:16px;align-items:start}
.stage{background:linear-gradient(130deg,#e2dbd0,#d1c7b9);min-width:0;padding:clamp(15px,4vw,48px);display:grid;place-items:center}
.slab{
 aspect-ratio:1.245;width:min(100%,900px);position:relative;
 background-image:var(--stone-sudafrica);background-position:center;background-size:cover;
 border:12px solid #33322d;box-shadow:8px 10px 0 #514c44,17px 22px 19px #655c50aa;
 outline:1px solid #e1ddd3;outline-offset:-21px
}
[data-stone="macael"] .slab{background-image:var(--stone-macael);border-color:#d5d0c7;box-shadow:7px 9px 0 #8d8983,16px 20px 20px #655c50aa;outline-color:#f7f4ee}
[data-stone="quintana"] .slab{background-image:var(--stone-quintana);border-color:#8d8c89;box-shadow:7px 9px 0 #4c4b48,16px 20px 20px #655c50aa;outline-color:#eeece6}
.slab:before{content:"";position:absolute;inset:0;background:linear-gradient(117deg,#fff2 0%,transparent 45%,#0002 100%);pointer-events:none}
.slab .engraving{
 position:absolute;inset:12% 8% auto 8%;height:45%;
 display:flex;align-items:center;justify-content:center;
}
.slab .engraving img{width:clamp(85px,28%,220px);height:100%;object-fit:contain;filter:invert(1) drop-shadow(0 1px 1px #1116)}
[data-stone="macael"] .engraving img,[data-stone="quintana"] .engraving img{filter:drop-shadow(0 -1px 1px #fff9)}
.slab .inscription{position:absolute;bottom:12%;left:5%;right:5%;text-align:center;color:#f3ebdb;font:400 clamp(.6rem,1.5vw,1.2rem) Georgia,serif;letter-spacing:.13em;text-shadow:-1px -1px 1px #0009}
[data-stone="macael"] .inscription,[data-stone="quintana"] .inscription{color:#373532;text-shadow:1px 1px 0 #fff7}
.inscription small{display:block;font-size:.65em;margin-top:10px;letter-spacing:.08em}
.notes{padding:8px 4px}
.notes h2{font:400 1.65rem/1.13 Georgia,serif;margin:.6rem 0 1rem}
.notes p{font-size:.81rem;color:#5c554a}
.notes a{color:#655038}
.editor-link{display:block;text-align:center;background:#292822;color:white!important;padding:14px 12px;margin:24px 0 12px;text-decoration:none;font-size:.83rem}
.library-head{margin:40px 0 18px;display:flex;align-items:baseline;gap:15px}
.library-head h2{font:400 clamp(1.8rem,3vw,2.7rem) Georgia,serif;margin:0}
.library-head p{font-size:.75rem;color:var(--muted)}
.gallery{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;padding-bottom:55px}
.motif-card{background:#f7f3ed;border:1px solid #c9bbab;text-align:left;padding:8px 8px 13px;color:#292720;min-width:0}
.motif-card[aria-pressed="true"]{outline:2px solid #866a49;outline-offset:-2px}
.mini-slab{
 aspect-ratio:1.22;background:var(--stone-sudafrica) center/cover;
 display:grid;place-items:center;border:5px solid #41403e
}
[data-stone="macael"] .mini-slab{background-image:var(--stone-macael);border-color:#d5d0c7}
[data-stone="quintana"] .mini-slab{background-image:var(--stone-quintana);border-color:#8d8c89}
.mini-slab img{max-width:65%;max-height:78%;object-fit:contain;filter:invert(1) drop-shadow(0 1px 1px #1115)}
[data-stone="macael"] .mini-slab img,[data-stone="quintana"] .mini-slab img{filter:drop-shadow(0 -1px 1px #fff9)}
.motif-name{display:block;font:400 1rem/1.15 Georgia,serif;margin:11px 4px 5px}
.meta{display:block;font-size:.65rem;margin:0 4px;color:#866948;letter-spacing:.01em}
button:focus-visible,select:focus-visible,a:focus-visible{outline:3px solid #94714c;outline-offset:3px}
footer{border-top:1px solid #c9c0b3;margin-top:5px;padding:22px 0 50px;color:#695d50;font-size:.73rem}
@media(max-width:1120px){.gallery{grid-template-columns:repeat(4,minmax(0,1fr))}.preview{grid-template-columns:1fr 220px}}
@media(max-width:760px){.shell{width:min(100% - 24px,1540px)}.page-head{grid-template-columns:1fr;padding:30px 0 20px;gap:14px}.preview{grid-template-columns:1fr}.notes{padding:8px 0}.gallery{grid-template-columns:repeat(3,minmax(0,1fr))}.stage{padding:15px}.slab{border-width:6px;outline-offset:-12px}}
@media(max-width:470px){.gallery{grid-template-columns:repeat(2,minmax(0,1fr))}.toolbar{padding:14px}.material-choice{flex:1;padding:7px 9px;font-size:.73rem}.library-head{display:block}.current-choice{display:block}.inscription{font-size:.57rem!important}.slab .engraving img{width:40%}}
`;
const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>LITOS · Estudio de motivos sobre piedra</title><style>${css}</style></head>
<body data-stone="sudafrica"><header class="shell page-head"><div><span class="kicker">LITOS · Estudio funerario / Fase de revisión</span><h1>Materia, luz<br><em>y memoria.</em></h1></div><p class="intro">Un motivo no se valora aislado: debe integrarse con la veta, la luz y el acabado de cada piedra. Estas recreaciones son orientativas.</p></header>
<main class="shell"><div class="review-banner">BIBLIOTECA DE REVISIÓN · Diseños originales sin validación comercial · No es un catálogo de fabricación · Sin fotografías privadas</div>
<section class="toolbar" aria-label="Controles de la composición de revisión"><strong>01 / Elige la piedra</strong><div class="stone-choices" role="group" aria-label="Material">${controls}</div>
<div class="current-choice"><div><label for="motif-select">02 / Elige un motivo para verlo a gran escala</label><select id="motif-select" aria-label="Motivo funerario">${candidates.map((x,i)=>`<option value="${esc(x.id)}" ${i===0?'selected':''}>${esc(x.name)} · ${x.publicSelectable===false?'Revisión':'Prototipo'}</option>`).join('')}</select></div><span class="intro">La inscripción es ficticia. Los motivos no están aprobados para fabricación.</span></div>
</section><section class="preview" aria-label="Vista conceptual a gran tamaño"><div class="stage"><div class="slab"><div class="engraving"><img id="hero-motif" src="${candidates[0].image}" alt="Motivo seleccionado sobre lápida" width="200" height="200"></div><div class="inscription">SIEMPRE EN NUESTRA MEMORIA<small>LITOS · SIMULACIÓN ORIENTATIVA</small></div></div></div><aside class="notes"><span class="kicker">02 / Vista de materia</span><h2 id="selected-name">${esc(candidates[0].name)}</h2><p id="selected-description">${esc(candidates[0].description)}</p><p>Grabado y contraste simulados. La piedra utiliza texturas recreadas del configurador; no son muestras certificadas.</p><p><strong>Estado:</strong> pendiente de revisión estética, técnica y comercial.</p><a class="editor-link" href="LITOS_REVISION_CRUCES_6.html">Abrir el configurador de cruces</a><p>La vista interactiva es autónoma, sin conexión ni datos de clientes.</p></aside></section>
<div class="library-head"><h2>Variaciones de un recuerdo</h2><p>Selecciona un motivo para compararlo en la misma piedra.</p></div><section class="gallery" aria-label="Motivos comparables">${cards}</section></main>
<footer class="shell">Archivo privado de referencias no incorporado · Motivos generados originalmente · LITOS · Revisión 2026</footer>
<script>(()=>{'use strict';
const items=${JSON.stringify(candidates.map(({id,name,description,image})=>({id,name,description,image})))};
const motif=document.getElementById('motif-select'),figure=document.getElementById('hero-motif');
const name=document.getElementById('selected-name'),description=document.getElementById('selected-description');
const cards=[...document.querySelectorAll('.motif-card')];
function selected(id){const item=items.find(x=>x.id===id);if(!item)return;
 motif.value=id;figure.src=item.image;figure.alt=item.name+' sobre una placa de piedra';
 name.textContent=item.name;description.textContent=item.description;
 cards.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===id)));
}
cards.forEach(b=>b.addEventListener('click',()=>selected(b.dataset.id)));
motif.addEventListener('change',()=>selected(motif.value));
document.querySelectorAll('.material-choice').forEach(b=>b.addEventListener('click',()=>{
 document.body.dataset.stone=b.dataset.stone;
 document.querySelectorAll('.material-choice').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
}));
})();</script></body></html>`;
fs.mkdirSync('preview',{recursive:true});
fs.writeFileSync('preview/LITOS_BIBLIOTECA_FUNERARIA_FASE2.html',html);
console.log('LITOS comparative stone gallery: '+review.length+' approved-for-review motifs, 6 candidate crosses, 3 materials');
