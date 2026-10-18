// Generic, original vectors informed by aggregate visual categories, never copied from a private photograph.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const root='assets/funerario';
const path=`${root}/configuracion/catalogo.json`;
const catalog=JSON.parse(readFileSync(path,'utf8'));
const P=d=>`<path d="${d}"/>`;
const entries=[
 ['cruces','calada','Cruz calada','Doble contorno inciso; lectura clara sobre piedra pulida.',P('M43 6H57V29H80V43H57V94H43V43H20V29H43Z M47 12V34H26V38H47V88H53V38H74V34H53V12Z')],
 ['cruces','lobulada','Cruz de remates curvos','Brazos de extremos redondeados, recreación geométrica genérica.',P('M45 12Q36 5 36 15Q36 21 45 22V34H28Q23 26 17 32Q10 39 20 44Q24 45 28 41H45V79Q36 83 40 91Q44 99 50 92Q56 99 60 91Q64 83 55 79V41H72Q76 45 80 44Q90 39 83 32Q77 26 72 34H55V22Q64 21 64 15Q64 5 55 12Z')],
 ['cruces','radiante','Cruz con rayos discretos','Cruz lineal con rayos separados para grabado de alto contraste.',P('M50 13V88M27 39H73M50 2V8M50 93V98M13 39H21M79 39H87M29 18L35 25M71 18L65 25M29 66L35 59M71 66L65 59')],
 ['religiosas','madre','Madre y niño · silueta','Interpretación mariana esquemática, sin imagen particular ni advocación concreta.',P('M25 89Q28 44 45 24Q49 19 54 24Q76 45 79 89M35 86Q37 61 47 48Q54 39 62 50Q72 63 69 86M45 29Q44 20 50 17Q57 18 56 28Q52 34 45 29M50 13Q50 4 57 6Q65 8 64 17M59 44Q58 37 64 35Q71 35 72 42Q70 48 64 49M44 58Q56 66 72 56M20 90H84M31 74Q23 60 29 44M74 43Q83 61 77 75')],
 ['religiosas','corona','Corona de espinas','Símbolo cristológico abstracto, sin reproducir un relieve figurativo.',P('M19 51Q20 22 50 19Q80 22 81 51Q80 79 50 81Q20 79 19 51Z M25 51Q28 29 50 27Q72 29 75 51Q72 71 50 73Q28 71 25 51Z M16 33L29 40M24 17L36 31M48 11L50 28M76 17L64 31M84 33L71 40M84 68L70 61M76 83L64 69M50 90L50 72M24 83L36 69M16 68L30 61')],
 ['religiosas','ala','Ala de ángel','Ala de trazo inciso para un motivo devocional no figurativo.',P('M22 83Q31 42 78 16Q65 47 38 62Q57 48 83 38Q67 68 35 75Q54 70 72 61Q58 86 22 83Z M23 83Q48 59 77 18')],
 ['religiosas','orantes','Manos orantes','Dos manos estilizadas, interpretación original de gesto de oración.',P('M45 88Q29 76 31 60L34 38Q35 31 40 32L44 60L46 15Q47 7 51 8Q55 9 54 17L56 60L62 30Q65 25 69 28Q72 31 69 38L65 66Q64 79 55 88M45 88H55M39 39L43 73M62 38L58 73M32 89H68')],
 ['religiosas','palomamedallon','Paloma en medallón','Ave esquemática dentro de un óvalo independiente de la inscripción.',P('M50 5C25 5 12 24 12 50C12 76 25 95 50 95C75 95 88 76 88 50C88 24 75 5 50 5Z M23 57Q40 54 49 39Q45 29 48 24Q60 32 62 43Q74 32 82 35Q76 48 62 55Q65 68 51 70Q38 68 32 61L23 65Z M60 48L64 47')],
 ['flores','rosaabierta','Rosa lateral','Rosa de tallo curvo con pétalos abiertos, distinta de la rosa frontal.',P('M13 87Q41 77 67 54M40 74Q26 60 18 66Q26 77 40 74M54 63Q46 48 55 43Q66 51 54 63M67 54Q54 48 51 37Q47 27 59 19Q66 4 79 13Q94 14 91 29Q95 45 77 49Z M60 32Q64 19 77 20Q85 23 78 34Q74 40 64 38Q58 37 60 32 M67 26Q74 27 71 34')],
 ['flores','ramaflor','Rama de flores pequeñas','Floración ligera para un campo ornamental secundario.',P('M20 87Q48 63 78 17M34 71Q19 61 20 48Q34 51 34 71M51 54Q43 38 50 29Q62 38 51 54M65 36Q76 46 87 34Q79 23 65 36M28 47L25 39M18 47L10 44M23 53L12 58M53 26L51 17M47 30L39 24M56 32L63 24M79 17L77 8M76 21L67 17M83 21L91 16')],
 ['marcos','oval','Medallón ovalado','Contorno oval para una imagen religiosa independiente.',`<ellipse cx="50" cy="50" rx="42" ry="46" stroke-width=".7"/><ellipse cx="50" cy="50" rx="38" ry="42" stroke-width=".35"/>${P('M50 2V8M50 92V98M2 50H8M92 50H98')}`],
 ['marcos','cornisa','Marco de cornisa','Filetes superiores y laterales inspirados en conjuntos moldurados.',P('M7 8H93M4 12H96M8 18H92M11 18V94H89V18M15 22V90H85V22M4 12L11 18M96 12L89 18M7 94H93')],
 ['separadores','hojas','Separador con hojas','Dos hojas pequeñas en el eje de una línea fina.',P('M3 50H36M64 50H97M36 50Q45 31 51 37Q51 47 36 50M64 50Q55 31 49 37Q49 47 64 50')],
 ['separadores','roseta','Separador con roseta','Flor geométrica central de cuatro pétalos.',P('M3 50H40M60 50H97M50 39Q43 42 50 50Q57 42 50 39M50 61Q43 58 50 50Q57 58 50 61M39 50Q42 43 50 50Q42 57 39 50M61 50Q58 43 50 50Q58 57 61 50')],
];
const newLayouts=[
 {id:'devocionlateral',name:'Imagen a la izquierda',text:[.43,.20,.43,.58],symbol:[.10,.08,.16,.16],devotional:[.12,.28,.25,.36],flower:[.13,.76,.15,.12],secondary:[.65,.82,.15,.10],separator:[.45,.79,.38,.025]},
 {id:'medallonsuperior',name:'Medallón superior',text:[.20,.47,.60,.36],symbol:[.14,.08,.14,.15],devotional:[.36,.08,.28,.30],flower:[.75,.08,.12,.15],secondary:[.41,.86,.18,.08],separator:[.25,.42,.50,.025]},
];
for(const layout of newLayouts)if(!catalog.layouts.some(x=>x.id===layout.id))catalog.layouts.push(layout);
for(const [category,id,name,description,body] of entries){
 const asset=`${root}/ornamentos/${category}/${id}.svg`;
 mkdirSync(`${root}/ornamentos/${category}`,{recursive:true});
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><title>${name}</title>${body}</svg>\n`;
 writeFileSync(asset,svg);
 const metadata={id,category,name,description,path:asset,format:'image/svg+xml',digitalSize:[100,100],simulatedFinish:'incisión, relieve o contraste de color',compatibleLayouts:category==='religiosas'?newLayouts.map(x=>x.id):catalog.layouts.map(x=>x.id),validation:'Prototipo visual pendiente de revisión del taller',rights:'Vector original genérico; no calco de obra particular',commercialReady:false};
 const previous=catalog.ornaments.findIndex(x=>x.id===id&&x.category===category);
 if(previous<0)catalog.ornaments.push(metadata);else catalog.ornaments[previous]=metadata;
}
catalog.version=2;
writeFileSync(path,JSON.stringify(catalog,null,2)+'\n');
console.log(`Extended memorial catalog to ${catalog.ornaments.length} original vectors and ${catalog.layouts.length} compositions.`);
