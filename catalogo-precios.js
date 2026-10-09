/* Catálogo experimental. Solo lectura: sin red, formularios, pedidos ni datos personales.
 Modelo: referencia de tercero * (0.7 + 0.3 * indice_material/70). Sensibilidad 30% SUPUESTA.
 Los índices son €/m² de placas/revestimientos, no de bloque tallado.
*/
(()=>{'use strict';const root=document.querySelector('.catalog-mobiliario');if(!root)return;
const materials=[["travertino","Travertino beige",70,"#cdb69a","https://preciom2.com/guias/revestimientos/piedra-natural/"],["caliza","Caliza Campaspero",50,"#dfccb1","https://canustone.com/"],["macael","Mármol Blanco Macael",97,"#eeebe6","https://interpiedrahispanica.es/wp-content/uploads/2025/05/TARIFA-BLANCO-MACAEL-MADRID-FEBRERO-2025.pdf"],["carrara","Mármol Carrara",120,"#dddde0","https://preciom2.com/guias/revestimientos/marmol-blanco-carrara/"],["marquina","Mármol Negro Marquina",125,"#343231","https://preciom2.com/guias/revestimientos/marmol-blanco-carrara/"],["granito","Granito gris",65,"#99958f","https://preciom2.com/guias/revestimientos/piedra-natural/"],["cuarcita","Cuarcita común",55,"#aeaaa0","https://preciom2.com/guias/revestimientos/piedra-natural/"],["calacatta","Mármol Calacatta Gold",221,"#f3ebdc","https://www.tiendadelmarmol.com/es/piedranatural/marmol-lujo-calacatta-gold-precio-m2"],["verde-alpi","Mármol Verde Alpi",262,"#174735","https://colourofstone.com/es/shop/piedra-natural/azulejos/verde-alpi/"]];
const products=[["mesa-comedor-oval","Mesa de comedor ovalada","Mesas",4600,"mesa-comedor","west","Mesa de gran formato con apoyos escultóricos",1],["mesa-comedor-red","Mesa de comedor redonda","Mesas",1600,"","west","Tablero redondo; referencia de mesa de construcción mixta",1],["mesa-comedor-rect","Mesa de comedor rectangular","Mesas",2700,"","west","Sobre largo con estructura de apoyo",1],["mesa-centro-mon","Mesa de centro monolítica","Mesas",2200,"mesa-centro","west","Centro de salón con presencia mineral",1],["mesa-centro-red","Mesa de centro circular","Mesas",2000,"","west","Centro de salón en formato circular",1],["mesa-aux-ped","Mesa auxiliar pedestal","Mesas",1200,"mesa-auxiliar","west","Sobre y apoyo mineral de pequeño formato",1],["mesa-aux-bal","Mesa auxiliar con baldas","Mesas",1050,"","west","Mesa de apoyo con dos superficies",1],["consola-esc","Consola escultórica","Consolas",3500,"consola","nat","Consola de volumen arquitectónico",1],["consola-rect","Consola recta","Consolas",2440,"","one","Consola de sobre rectangular",1],["banco-esc","Banco escultórico","Bancos",1900,"banco","bench","Banco de piedra con cantos orgánicos",1],["banco-rect","Banco lineal","Bancos",1900,"","bench","Asiento rectilíneo mineral, viabilidad pendiente",0],["lavabo-ped","Lavabo pedestal","Baño",2500,"lavabo","basin","Pieza de baño con taza y pie",1],["lavabo-sobre","Lavabo de sobreponer","Baño",310,"","san","Lavabo circular de travertino Ø40 cm",1],["encimera-bano","Encimera de baño","Baño",650,"","slab","Propuesta plana con hueco para lavabo",0],["encimera-cocina","Encimera de cocina","Arquitectura",1600,"","slab","Superficie de cocina; montaje no incluido",0],["balda","Balda / repisa de piedra","Arquitectura",250,"","bald","Pieza de balda con canto trabajado",0],["panel","Panel de revestimiento (m²)","Arquitectura",140,"","slab","Importe por m², no por objeto",0],["bandeja","Bandeja de piedra","Objetos",180,"","tray","Bandeja de travertino; comparable directo",1],["peana","Peana escultórica","Objetos",750,"","pedestal","Referente indirecto, precio modelado",0],["cuenco","Cuenco decorativo","Objetos",95,"","small","Pieza tallada pequeña, analogía de accesorio",0],["macetero","Macetero mineral","Objetos",360,"","slab","Pieza conceptual; precio extrapolado",0]];
const links={"west":"https://www.westwing.es/muebles/~travertino/","one":"https://www.1stdibs.com/es/muebles/mesas/mesas-de-consola/mesa-consola-contempor%C3%A1nea-de-travertino/id-f_40367552/","nat":"https://www.naturshome.es/producto/consola-de-travertino/","san":"https://www.sanitino.es/sapho-blok-lavabo-de-piedra-de-400-mm-de-diametro-travertino-beige-pulido-2401-01","tray":"https://t-domecq.com/producto/bandeja-rectangular-con-bordes-de-travertino/","slab":"https://preciom2.com/guias/revestimientos/piedra-natural/","pedestal":"https://www.1stdibs.com/es/muebles/mesas/pedestales/pedestal-de-m%C3%A1rmol-travertino-redondo-facetado-italiano-de-mediados-del-siglo-xx-mina/id-f_34574532/","basin":"https://www.leroymerlin.es/productos/banos/lavabos/lavabo-sobreponer/lavabos-de-travertino-p.html","bench":"https://artemest.com/es-es/products/banco-de-exterior-de-piedra-travertino-gris-tempore","bald":"https://memorialspain.com/products/marmol-blanco-macael-pulido-lapida-columbario","small":"https://www2.hm.com/es_es/productpage.1216320002.html"};
const grid=root.querySelector('.piece-grid');
const sourcePhotos=[...grid.querySelectorAll('.piece-photos')];
const imageSources=Object.fromEntries(['mesa-comedor','mesa-centro','consola','banco','lavabo','mesa-auxiliar'].map((name,i)=>[name,sourcePhotos[i]?.outerHTML]));
const picker=root.querySelector('#material-picker');
const filters=[...root.querySelectorAll('[data-category-filter]')];
if(!grid||!picker) return;
const formatter=new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0});
const safe=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
// Only files that passed source-image and material-specific visual QA belong here.
// The 30 manifest entries are still planned; a planned path is never a rendered asset.
const approvedVariants=Object.freeze({});
const referenceImage=(p)=>{
 const slug=p[4];
 if(slug&&imageSources[slug])return imageSources[slug];
 if(!slug)return '';
 return '<div class="piece-photos">'+[1,2].map(n=>'<figure class="piece-figure"><img src="assets/catalogo/litos-'+slug+'-0'+n+'.webp" loading="lazy" decoding="async" width="720" height="900" alt="Imagen conceptual original '+safe(p[1])+' variante '+n+'"><figcaption>Referencia visual original · piedra sin identificar</figcaption></figure>').join('')+'</div>';
};
const showMaterial=(card,material)=>{
 const host=card.querySelector('.material-preview'), key=card.dataset.product+'__'+material[0];
 const file=approvedVariants[key];
 if(file){
  if(!/^assets\\/catalogo\\/variantes\\/[a-z0-9-]+__[a-z0-9-]+\\.webp$/.test(file))throw Error('Unapproved asset path: '+file);
  host.replaceChildren();
  const figure=document.createElement('figure');figure.className='material-variant-figure';
  const img=document.createElement('img');img.src=file;img.loading='lazy';img.decoding='async';img.width=720;img.height=900;
  img.alt='Imagen conceptual de '+card.querySelector('h3').textContent+' en '+material[1];
  const cap=document.createElement('figcaption');cap.textContent='Imagen conceptual de '+material[1]+' · No es una obra ejecutada';
  figure.append(img,cap);host.append(figure);
 } else {
  // On an unavailable combination do not show a photograph of another stone.
  host.innerHTML='<div class="material-placeholder" role="status"><div class="material-placeholder-symbol" aria-hidden="true"></div><strong>Vista no disponible para este material</strong><span class="material-placeholder-text"></span></div>';
  host.querySelector('.material-placeholder-text').textContent=material[1]+' · imagen propia pendiente de validación';
 }
};
grid.innerHTML=products.map((p,i)=>'<article class="piece-card product-model" data-product="'+safe(p[0])+'" data-category="'+safe(p[2])+'" data-base="'+p[3]+'">'+
'<div class="material-preview" aria-label="Vista del material elegido"></div>'+
(referenceImage(p)?'<details class="concept-reference"><summary>Ver concepto original (piedra no verificada)</summary>'+referenceImage(p)+'</details>':'')+
'<div class="piece-details"><p class="piece-index">'+String(i+1).padStart(2,'0')+' / '+safe(p[2].toUpperCase())+' · '+(p[7]?'COMPARABLE':'EXTRAPOLACIÓN')+'</p><h3>'+safe(p[1])+'</h3><p>'+safe(p[6])+'.</p><div class="piece-benchmark"><span>Estimación en <span class="card-material">travertino</span></span><strong class="piece-amount">'+formatter.format(p[3])+'</strong></div><p class="piece-comparison">Referencia externa: <a href="'+links[p[5]]+'" target="_blank" rel="noopener noreferrer">consultar fuente ↗</a>. '+(p[7]?'Precio orientado por artículo o familia comparable.':'Extrapolación de categoría, sin comparable idéntico.')+' No es tarifa de LITOS.</p></div></article>').join('');
const swatch=root.querySelector('#material-color');
swatch?.addEventListener('click',()=>{
 try{if(typeof picker.showPicker==='function')picker.showPicker();
 else{picker.focus();picker.click()}}
 catch{picker.focus();picker.click()}
});
let category='Todos';
function render(){
 const m=materials.find(x=>x[0]===picker.value)||materials[0];
 root.querySelector('#material-cost').textContent='Índice de piedra: '+m[2]+' €/m²';
 root.querySelector('#material-name').textContent=m[1];
 const a=root.querySelector('#material-source');a.href=m[4];a.title='Consultar precio índice de '+m[1];
 root.querySelector('#material-color').style.backgroundColor=m[3];
 root.dataset.selectedStone=m[0];
 swatch?.setAttribute('aria-label','Elegir otra piedra. Actual: '+m[1]);
 let count=0;
 for(const card of grid.querySelectorAll('.product-model')){
  card.hidden=category!=='Todos'&&card.dataset.category!==category;
  if(!card.hidden)count++;
  const base=Number(card.dataset.base),raw=base*(.7+.3*m[2]/70);
  card.querySelector('.piece-amount').textContent=formatter.format(Math.round(raw/10)*10);
  card.querySelector('.card-material').textContent=m[1];
  showMaterial(card,m);
 }
 root.querySelector('#catalog-count').textContent=count+' propuestas en '+m[1];
}
picker.addEventListener('change',render);
filters.forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.categoryFilter;filters.forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));render()}));
render();
window.LITOS_CATALOG_INFO=Object.freeze({materials:materials.length,products:products.length,modelSensitivity:0.3,tonalMockup:false,approvedVariantImages:Object.keys(approvedVariants).length});
})();