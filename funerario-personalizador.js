/* Vista conceptual, local y efimera: sin red, almacenamiento ni formularios. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  if (!$('memorial-workbench')) return;
  const fields={model:$('memorial-model'),stone:$('memorial-stone'),type:$('memorial-type'),finish:$('memorial-finish'),ornament:$('memorial-ornament'),text:$('memorial-text')};
  const slab=$('memorial-slab'),rendered=$('memorial-rendered'),counter=$('memorial-counter'),decoration=$('memorial-decoration'),caption=$('memorial-caption');
  const marks={ninguno:'',cruz:'✝',cenefa:'◇ ◆ ◇',rama:'❧'};
  function update(){
    for(const k of ['model','stone','type','finish'])slab.dataset[k]=fields[k].value;
    rendered.textContent=fields.text.value.trim()||'EN RECUERDO';
    counter.textContent=fields.text.value.length+'/120 caracteres';
    decoration.textContent=marks[fields.ornament.value]||'';
    caption.textContent=[fields.model,fields.stone,fields.type].map(x=>x.selectedOptions[0].textContent).join(' · ');
  }
  for(const input of Object.values(fields))input.addEventListener(input===fields.text?'input':'change',update);
  update();
})();
