// Adapt the existing studio in funerario.html; keep the commercial pages and navigation.
import {readFileSync,writeFileSync} from 'node:fs';
const c=JSON.parse(readFileSync('assets/funerario/configuracion/catalogo.json','utf8'));
const options=list=>list.map(x=>`<option value="${x.id}">${x.label||x.name}</option>`).join('');
const select=(id,label,list)=>`<label for="memorial-${id}">${label}</label><select id="memorial-${id}">${options(list)}</select>`;
const none={id:'ninguno',name:'Ninguno'};
const publicOrnaments=c.ornaments.filter(x=>x.publicSelectable!==false);
const ornaments=category=>[none,...publicOrnaments.filter(x=>category.includes(x.category))];
const placement=(prefix,label)=>`<fieldset class="memorial-placement"><legend>${label} · dentro de su zona</legend><label for="memorial-${prefix}-scale">Escala <output id="${prefix}-scale-value">85 %</output></label><input id="memorial-${prefix}-scale" type="range" min="35" max="100" value="85"><label for="memorial-${prefix}-x">Posición horizontal</label><input id="memorial-${prefix}-x" type="range" min="0" max="100" value="50"><label for="memorial-${prefix}-y">Posición vertical</label><input id="memorial-${prefix}-y" type="range" min="0" max="100" value="50"></fieldset>`;
const fields=c.fields.map(f=>`<div class="memorial-text-field"><div class="memorial-field-top"><label for="${f.id==='name'?'memorial-text':'memorial-field-'+f.id}">${f.label}</label><label class="memorial-check"><input id="memorial-show-${f.id}" type="checkbox" checked> Mostrar</label></div><textarea id="${f.id==='name'?'memorial-text':'memorial-field-'+f.id}" data-text-field="${f.id}" rows="${f.id==='epitaph'?3:2}" maxlength="${f.max}" spellcheck="false" aria-describedby="memorial-local">${f.default}</textarea></div>`).join('');
const ui=`<section class="memorial-studio" id="personalizar" aria-labelledby="memorial-title">
 <div class="memorial-studio-heading"><p class="catalog-eyebrow">Estudio de composición · 01 / Materia y memoria</p><h3 id="memorial-title">Un recuerdo,<br><em>tu composición.</em></h3><p>Explora piedra, símbolos e inscripciones. Cada elemento conserva su lugar mientras das forma al conjunto.</p></div>
 <noscript><p>Activa JavaScript para utilizar el configurador local. No se envían inscripciones.</p></noscript>
 <div class="memorial-toolbar" id="memorial-toolbar" aria-label="Selecciones principales del configurador"></div>
 <div class="memorial-workbench" id="memorial-workbench" aria-busy="true">
  <div class="memorial-display"><div class="memorial-stage" id="memorial-canvas"><p>Cargando las muestras y las tipografías…</p></div><p class="memorial-caption" id="memorial-caption">Vista previa orientativa</p><p class="memorial-material-note" id="memorial-material-note">Texturas recreadas, pendientes de validación con muestras LITOS.</p><div class="memorial-actions"><button id="memorial-download" type="button" disabled>Descargar imagen <span aria-hidden="true">↓</span></button><button id="memorial-reset" type="button">Restablecer</button></div><p id="memorial-status" class="memorial-status" role="status" aria-live="polite">Preparando la composición.</p></div>
  <div class="memorial-controls">
   <details open><summary><span>01</span> Piedra y modelo</summary><div class="memorial-panel">
    ${select('stone','Material',c.materials)}<div id="memorial-swatches" class="memorial-swatches" role="group" aria-label="Muestras de piedra"></div>
    ${select('variant','Variante de textura',[{id:'1',name:'Recreación A'},{id:'2',name:'Recreación B'}])}
    ${select('model','Modelo',c.models)}<p id="memorial-model-note" class="memorial-note"></p>
    <label class="memorial-check"><input id="memorial-fixings" type="checkbox"> Mostrar fijaciones</label>
   </div></details>
   <details><summary><span>02</span> Composición y símbolos</summary><div class="memorial-panel">
    ${select('layout','Composición',c.layouts)}
    <div class="memorial-library"><label for="memorial-gallery-category">Biblioteca visual de motivos</label><select id="memorial-gallery-category"><option value="cruces">Cruces</option>${publicOrnaments.some(x=>x.category==="religiosas")?'<option value="religiosas">Imágenes religiosas</option>':""}<option value="flores">Flores y símbolos</option><option value="secondary">Motivo adicional</option><option value="marcos">Marcos</option><option value="separadores">Separadores</option></select><div id="memorial-gallery" class="memorial-gallery" role="group" aria-label="Motivos disponibles"></div><p class="memorial-note">Interpretaciones genéricas inspiradas en categorías observadas, pendientes de revisión visual. Las fotografías reales permanecen privadas.</p></div>
    ${select('symbol','Cruz',[{id:'ninguno',name:'Sin cruz'},...publicOrnaments.filter(x=>x.category==='cruces')])}
    ${placement('symbol','Cruz')}
    ${select('devotional','Imagen religiosa',[{id:'ninguno',name:'Sin imagen religiosa'},...publicOrnaments.filter(x=>x.category==='religiosas')])}
    ${placement('devotional','Imagen religiosa')}
    ${select('ornament','Ornamento floral o simbólico',ornaments(['flores','simbolos']))}
    ${placement('ornament','Ornamento')}
    ${select('secondary','Motivo adicional',[{id:'ninguno',name:'Sin motivo adicional'},...publicOrnaments.filter(x=>x.category==='flores'||x.category==='simbolos')])}
    ${placement('secondary','Motivo adicional')}
    ${select('ornament-finish','Acabado del ornamento',c.finishes)}
    ${select('separator','Separador',ornaments(['separadores']))}
    ${select('frame','Marco',ornaments(['marcos']))}
    <label class="memorial-check"><input id="memorial-guides" type="checkbox"> Ver zonas de composición</label>
    <p class="memorial-note">Los elementos se desplazan dentro de zonas reservadas para proteger la inscripción.</p>
   </div></details>
   <details><summary><span>03</span> Letra y acabado</summary><div class="memorial-panel">
    ${select('type','Tipografía · aproximación visual',c.fonts)}
    <p class="memorial-note">Fuentes libres locales. No equivalen a las matrices históricas del taller.</p>
    ${select('finish','Acabado de la inscripción',c.finishes)}
    <label for="memorial-size">Tamaño de letra <output id="memorial-size-value">100 %</output></label><input type="range" id="memorial-size" min="70" max="150" value="100">
    <label for="memorial-leading">Interlineado <output id="memorial-leading-value">130 %</output></label><input type="range" id="memorial-leading" min="105" max="180" value="130">
    ${select('align','Alineación',[{id:'center',name:'Centrada'},{id:'left',name:'Izquierda'},{id:'right',name:'Derecha'}])}
    <p class="memorial-note">Grabado y relieve son simulaciones visuales; la técnica disponible requiere confirmación del taller.</p>
   </div></details>
   <details><summary><span>04</span> Inscripción editable</summary><div class="memorial-panel">${fields}<p class="memorial-note">La letra se ajusta al espacio. Si no cabe, la vista previa lo indicará y acortará la línea visible; el texto del campo permanece intacto.</p><p id="memorial-local">Tu texto se mantiene solo en la memoria de esta página. No se envía ni se añade a enlaces. Al cerrarla se pierde. La descarga sí incluye lo que aparezca en la vista previa.</p></div></details>
  </div>
 </div>
 <p class="memorial-caption-detail">Recreación digital orientativa, no catálogo de acabados certificados ni plano de fabricación. Las proporciones no son estándares de tamaño. Cada familia tiene geometría propia; cualquier medida, espesor, anclaje o técnica requiere documentación y validación de taller.</p>
</section>`;
let html=readFileSync('funerario.html','utf8');
html=html.replace(/<section class="memorial-studio"[\s\S]*?<\/section>(?=<div class="catalog-grid">)/,ui);
html=html.replace(/<script src="funerario-(?:recursos|compositor|exportar|personalizador)\.js(?:\?[^"]+)?"><\/script>/g,'');
html=html.replace('</body>', ['recursos','compositor','exportar','personalizador'].map(n=>`<script src="funerario-${n}.js?v=funerario-cruces-aprobadas-20261018"></script>`).join('')+'</body>');
writeFileSync('funerario.html',html);
console.log('Updated existing studio; no other page replaced.');
