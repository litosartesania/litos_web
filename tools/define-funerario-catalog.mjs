// Original generic vector collection. No customer artwork, photos or inscriptions.
import {mkdirSync,writeFileSync} from 'node:fs';
const root='assets/funerario';
const catalog={version:1,materials:[
 ['sudafrica','Negro Sudáfrica','Granito comercial',true,'Grano gris fino sobre fondo oscuro.','https://grupimar.es/granitos/negro-sudafrica-impala/'],
 ['absoluto','Negro Absoluto','Granito comercial',true,'Negro uniforme de grano muy fino.','https://www.cupastone.es/productos/negro-absoluto/'],
 ['tezal','Negro Tezal','Granito',true,'Grises y negros de grano medio.','https://grupimar.es/granitos/granito-negro-tezal/'],
 ['macael','Blanco Macael','Mármol',false,'Fondo blanco cristalino con vetas grises suaves.','https://www.marmolesmacael.com/catalogo'],
 ['italia','Blanco Italia','Mármol · denominación por confirmar',false,'Interpretación blanca veteada; variedad exacta pendiente.','https://grupocarmenamarmoles.com/catalogo/marmol-blanco-italia/'],
 ['champagne','Blanco Champagne','Granito',false,'Grano medio negro y gris sobre blanco.','https://arteaco.es/home/materiales/granito/gblanco/blancochampagne/'],
 ['quintana','Gris Quintana','Granito',false,'Gris compacto de grano fino a medio.','https://canterasagustintena.com/gris-quintana/']
].map(([id,name,family,dark,description,source])=>({id,name,family,dark,description,source,status:'Recreación orientativa · pendiente de muestra LITOS',variants:[1,2].map(n=>({id:String(n),name:'Recreación '+(n===1?'A':'B'),path:`${root}/materiales/${id}-${n}.webp`}))})),
models:[
 {id:'nicho',name:'Lápida de nicho recta',face:[.11,.19,.78,.65],architecture:'recta',note:'Proporción ilustrativa; introduce las medidas verificadas de la pieza.'},
 {id:'doble',name:'Lápida doble',face:[.14,.19,.72,.60],architecture:'pilastras',note:'Conjunto conceptual con cornisa, pilastras y repisa.'},
 {id:'columbario',name:'Lápida de columbario',face:[.23,.21,.54,.54],architecture:'cuadrada',note:'Geometría cuadrada propia; dimensiones por comprobar.'},
 {id:'portada',name:'Lápida con portada',face:[.20,.16,.60,.66],architecture:'arco',note:'Portada con arco rebajado; secciones por comprobar.'},
 {id:'panteon',name:'Losa para panteón',face:[.12,.29,.76,.43],architecture:'losa',note:'Losa horizontal conceptual; sin especificación constructiva.'}
],
layouts:[
 {id:'centrado',name:'Centrado clásico',text:[.20,.31,.60,.40],symbol:[.40,.08,.20,.19],flower:[.41,.82,.18,.10],separator:[.25,.76,.50,.03]},
 {id:'lateral',name:'Cruz a la izquierda',text:[.40,.20,.45,.55],symbol:[.12,.23,.19,.43],flower:[.15,.73,.16,.13],separator:[.43,.78,.39,.03]},
 {id:'superior',name:'Ornamento superior',text:[.19,.36,.62,.44],symbol:[.44,.09,.12,.12],flower:[.34,.22,.32,.11],separator:[.28,.81,.44,.03]},
 {id:'separadores',name:'Texto con separadores',text:[.19,.34,.62,.40],symbol:[.43,.08,.14,.14],flower:[.43,.84,.14,.09],separator:[.24,.26,.52,.04],secondSeparator:[.24,.78,.52,.04]}
],
fonts:[
 ['aldine','EB Garamond','Serif clásica · aprox. a Aldine','ebgaramond','normal'],
 ['remus','Cinzel','Capital romana · aprox. a Remus','cinzel','normal'],
 ['inglesa','Great Vibes','Caligráfica · aprox. a Inglesa','greatvibes','normal'],
 ['cataneo','Libre Baskerville','Itálica · aprox. a Cataneo','librebaskerville','italic'],
 ['redonda','Noto Sans','Sans redonda · aprox. visual','notosans','normal'],
 ['gotica','UnifrakturMaguntia','Fractura · aprox. a Gótica','unifrakturmaguntia','normal']
].map(([id,name,label,file,style])=>({id,name,label,family:'Litos-'+id,style,weight:400,path:`${root}/fuentes/${file}.woff2`,license:`${root}/fuentes/${file}-OFL.txt`,licenseName:'SIL Open Font License 1.1',source:`https://github.com/google/fonts/tree/main/ofl/${file}`})),
finishes:[{id:'auto',name:'Adaptado a la piedra'},{id:'oscuro',name:'Inciso oscuro'},{id:'claro',name:'Inciso claro'},{id:'blanco',name:'Letra blanca'},{id:'plata',name:'Gris / plateado'},{id:'oro',name:'Dorado'},{id:'relieve',name:'Relieve suave'}],
fields:[{id:'header',label:'Encabezado',max:60,default:'EN RECUERDO',size:21,weight:1},{id:'name',label:'Nombre o denominación',max:100,default:'UN SER QUERIDO',size:39,weight:1.8},{id:'dates',label:'Fechas opcionales',max:60,default:'',size:22,weight:1},{id:'epitaph',label:'Epitafio',max:240,default:'SIEMPRE EN NUESTRA MEMORIA',size:25,weight:2},{id:'extra',label:'Texto adicional',max:160,default:'',size:20,weight:1.5}],
ornaments:[]};
const shape=(d,extra='')=>`<path d="${d}" ${extra}/>`;
const entries=[
 ['cruces','simple','Cruz simple',shape('M50 8V92M20 36H80')],
 ['cruces','clasica','Cruz clásica',shape('M43 6H57V28H80V42H57V94H43V42H20V28H43Z','fill="currentColor" stroke-width="1"')],
 ['cruces','latina','Cruz latina fina',shape('M50 5V94M26 32H74','stroke-width="1.5"')],
 ['cruces','biselada','Cruz biselada',shape('M44 6H56V29H80V41H56V93H44V41H20V29H44Z')+shape('M50 9V90M23 35H77','opacity=".45" stroke-width="1"')],
 ['cruces','pedestal','Cruz con pedestal',shape('M50 5V78M26 31H74M40 78H60V84H69V91H79V96H21V91H31V84H40Z')],
 ['separadores','linea','Línea sencilla',shape('M3 50H97')],
 ['separadores','doble','Doble línea',shape('M3 44H97M3 57H97','stroke-width="1.2"')],
 ['separadores','ornamental','Separador ornamental',shape('M3 50H34M66 50H97M34 50Q43 26 50 50Q57 74 66 50M34 50Q43 74 50 50Q57 26 66 50')],
 ['separadores','extremos','Extremos decorados',shape('M11 50H89M3 50L8 43L13 50L8 57ZM87 50L92 43L97 50L92 57Z','stroke-width="1.4"')],
 ['marcos','fino','Marco fino','<rect x="3" y="3" width="94" height="94" rx=".3" stroke-width=".45"/>'],
 ['marcos','clasico','Marco clásico','<rect x="3" y="3" width="94" height="94" stroke-width=".5"/><rect x="5" y="5" width="90" height="90" stroke-width=".25"/>'],
 ['marcos','bisel','Marco biselado',shape('M3 3H97V97H3ZM5 5H95V95H5M3 3L5 5M97 3L95 5M97 97L95 95M3 97L5 95','stroke-width=".5"')],
 ['marcos','esquinas','Esquinas ornamentales',shape('M4 25V4H25M75 4H96V25M96 75V96H75M25 96H4V75M7 18Q19 19 18 7M82 7Q81 19 93 18M93 82Q81 81 82 93M18 93Q19 81 7 82','stroke-width=".6"')],
 ['flores','rosa','Rosa',shape('M50 98Q44 61 55 37M47 72Q23 72 28 53Q45 54 47 72M49 62Q73 59 73 43Q57 41 49 62M55 37Q30 44 28 24Q22 4 46 9Q60 -1 73 14Q86 32 66 41ZM55 37Q36 28 41 16Q58 10 66 25Q62 36 48 30Q42 25 49 20Q58 16 61 27')],
 ['flores','ramo','Ramo de flores',shape('M32 95L38 30M47 96L53 20M55 96L73 37M35 68L15 50M58 69L84 53M23 22C4 3 3 35 23 22C42 41 43 9 23 22M51 16C32 -3 31 29 51 16C70 35 71 3 51 16M77 33C58 14 57 46 77 33C96 52 97 20 77 33M28 86Q48 78 65 88')],
 ['flores','hojas','Hojas',shape('M15 85Q49 64 84 13M34 70Q10 57 19 39Q43 45 34 70M47 57Q38 31 53 24Q68 43 47 57M58 46Q80 59 91 40Q78 29 58 46M72 29Q65 12 80 5Q95 14 72 29')],
 ['simbolos','paloma','Paloma',shape('M10 61Q28 57 44 41Q35 25 38 9Q54 20 60 38Q78 15 94 20Q86 41 66 52Q76 69 59 75Q39 82 25 67L10 73L18 65ZM58 47L61 47M68 57L79 61M72 63L87 72')],
 ['simbolos','olivo','Rama de olivo',shape('M9 88Q45 61 85 9M24 75Q7 61 15 47Q34 56 24 75M39 61Q20 41 31 28Q50 43 39 61M54 44Q40 22 54 13Q68 31 54 44M67 29Q58 7 75 4Q84 17 67 29M32 69Q53 81 61 65Q47 52 32 69M48 52Q72 63 79 46Q63 36 48 52M64 34Q86 44 94 27Q78 17 64 34')],
 ['simbolos','luz','Luz simbólica',shape('M50 5L56 35L78 21L65 43L95 50L65 56L79 79L56 65L50 95L44 65L21 79L35 56L5 50L35 44L21 21L44 35Z','stroke-width="1.3"')]
];
for(const [category,id,name,body] of entries){
 const path=`${root}/ornamentos/${category}/${id}.svg`;
 mkdirSync(`${root}/ornamentos/${category}`,{recursive:true});
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><title>${name}</title>${body}</svg>`;
 writeFileSync(path,svg+'\n');
 catalog.ornaments.push({id,category,name,path});
}
mkdirSync(`${root}/configuracion`,{recursive:true});
writeFileSync(`${root}/configuracion/catalogo.json`,JSON.stringify(catalog,null,2)+'\n');
console.log(`Defined ${catalog.materials.length} materials, ${entries.length} original SVG ornaments and 6 OFL font approximations.`);
