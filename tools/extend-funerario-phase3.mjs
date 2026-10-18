// Idempotent review-only extension. Run after the phase-2 and six-cross catalog definitions.
import {readFileSync,writeFileSync} from 'node:fs';
const path='assets/funerario/configuracion/catalogo.json';
const c=JSON.parse(readFileSync(path,'utf8'));
const crossTechniques={santiago:'aplicación coloreada conceptual',doblefilete:'incisión de doble filete',moldurada:'talla en relieve conceptual',metalica:'aplique metálico conceptual',florenzada:'talla ornamental conceptual',medalloncruz:'incisión en medallón'};
for(const item of c.ornaments)if(crossTechniques[item.id])item.simulatedTechnique=crossTechniques[item.id];
const base='assets/funerario/ornamentos/religiosas/relieves/';
const motifs=[
  ['cristo-corona','Cristo con corona de espinas','Busto en bajorrelieve de piedra clara',[1024,936]],
  ['cristo-crucificado','Cristo crucificado','Figura escultórica sobre cruz sencilla',[683,1024]],
  ['virgen-nino','Virgen con Niño','Figura maternal de medio cuerpo con pliegues tallados',[683,1024]],
  ['san-jose-nino','San José con Niño','Figura paterna de medio cuerpo en relieve',[683,1024]],
  ['angel','Ángel funerario','Figura de ángel con alas y ropaje esculpidos',[683,1024]],
  ['paloma-olivo','Paloma con olivo','Ave en relieve con rama de olivo',[1024,853]],
  ['medallon-mariano','Medallón mariano','Retrato mariano genérico dentro de aro escultórico',[1024,960]],
  ['medallon-cristo','Medallón de Cristo','Busto de Cristo en medallón ovalado',[683,1024]],
];
const layouts=[
 {id:'relievelateral',name:'Relieve lateral grande',text:[.44,.2,.43,.56],symbol:[.12,.07,.13,.11],devotional:[.08,.21,.30,.55],flower:[.12,.79,.13,.10],secondary:[.72,.82,.13,.08],separator:[.46,.78,.4,.025]},
 {id:'crucifijolateral',name:'Crucifijo vertical lateral',text:[.43,.21,.43,.55],symbol:[.75,.07,.11,.11],devotional:[.09,.13,.29,.66],flower:[.13,.84,.12,.07],secondary:[.70,.84,.13,.07],separator:[.45,.79,.39,.025]},
 {id:'relievesuperior',name:'Relieve superior amplio',text:[.20,.49,.60,.33],symbol:[.12,.08,.12,.12],devotional:[.32,.07,.36,.37],flower:[.76,.08,.12,.12],secondary:[.42,.86,.16,.08],separator:[.25,.45,.50,.025]},
].map(x=>({...x,publicSelectable:false,visualReview:'Composición experimental; pendiente de revisión del taller.'}));
for(const [id,name,description,digitalSize] of motifs){
 if(c.ornaments.some(x=>x.id===id))continue;
 const file=base+id+'.webp';
 if(!readFileSync(file).length)throw Error('Recurso vacío: '+file);
 c.ornaments.push({id,category:'religiosas',name,description,path:file,format:'image/webp',digitalSize,
  simulatedFinish:'bajorrelieve de piedra clara; tratamiento visual orientativo',
  simulatedTechnique:'bajorrelieve',compatibleLayouts:['devocionlateral','medallonsuperior',...layouts.map(x=>x.id)],
  validation:'Propuesta artística; no validada para fabricación',rights:'Imagen original generada desde descripción genérica; derechos y uso comercial pendientes de revisión',
  visualReview:'Pendiente de revisión artística del propietario',technicalValidation:'Pendiente de validación del taller',
  commercialReady:false,publicSelectable:false});
}
for(const item of layouts)if(!c.layouts.some(x=>x.id===item.id))c.layouts.push(item);
c.version=4;
writeFileSync(path,JSON.stringify(c,null,2)+'\n');
console.log(`Fase 3: ${c.ornaments.length} motivos, ${c.layouts.length} composiciones; nuevos candidatos ocultos.`);
