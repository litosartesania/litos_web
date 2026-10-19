// Add generic vector motifs and locally licensed font choices. Never rewrites source assets.
import {readFileSync,writeFileSync} from 'node:fs';
const base='assets/funerario/';
const catalogPath=base+'configuracion/catalogo.json';
const c=JSON.parse(readFileSync(catalogPath,'utf8'));
const additions=[
 ['flores','lirio','Lirio estilizado','<path d="M49 94Q47 65 51 42M51 43Q29 39 23 20Q39 20 51 43M51 43Q61 15 79 13Q76 35 51 43M51 43Q44 15 50 6Q61 22 51 43M48 68Q27 52 19 60Q28 77 48 68M50 72Q68 53 81 59Q72 77 50 72"/><path d="M49 41L40 25M52 40L61 23" stroke-width="1"/>'],
 ['flores','lavanda','Rama de lavanda','<path d="M49 94Q48 61 53 21M46 75Q32 56 20 59Q26 74 46 75M50 71Q70 52 81 56Q74 72 50 71"/><path d="M53 27Q38 20 44 11Q53 15 53 27M53 27Q70 17 68 8Q55 11 53 27M52 35Q36 28 40 20Q52 25 52 35M52 35Q69 27 69 18Q57 22 52 35M51 44Q36 38 39 30Q51 33 51 44M51 44Q69 35 70 28Q58 30 51 44M50 53Q36 47 40 39Q51 42 50 53M50 53Q67 44 69 37Q58 40 50 53" stroke-width="1.4"/>'],
 ['flores','espiga','Espiga de trigo','<path d="M50 95V21M50 22L39 7M50 22L61 7"/><path d="M50 67Q31 58 33 47Q47 50 50 67M50 67Q69 58 67 47Q53 50 50 67M50 52Q32 44 35 33Q48 36 50 52M50 52Q68 44 65 33Q52 36 50 52M50 37Q35 29 39 19Q49 24 50 37M50 37Q65 29 61 19Q51 24 50 37"/><path d="M48 80Q29 69 20 73M52 80Q71 69 80 73" stroke-width="1.1"/>'],
 ['flores','camelia','Camelia de contorno','<path d="M49 92Q50 73 55 62M52 78Q32 69 25 76Q37 87 52 78M53 73Q70 59 79 66Q70 79 53 73"/><path d="M50 61Q23 67 23 46Q12 32 30 22Q28 6 50 13Q67 3 73 22Q91 27 79 43Q85 60 62 63Z"/><path d="M50 49Q31 43 36 28Q45 20 53 31Q67 22 68 37Q66 50 50 49Z M49 48Q53 39 58 38" stroke-width="1.3"/>'],
 ['simbolos','laurel','Corona de laurel','<path d="M45 85Q8 64 29 20M55 85Q92 64 71 20M42 87Q50 92 58 87"/><path d="M34 70Q15 72 12 59Q27 57 34 70M28 56Q11 53 14 40Q28 42 28 56M27 42Q16 31 23 23Q34 31 27 42M31 29Q26 15 36 12Q40 24 31 29M66 70Q85 72 88 59Q73 57 66 70M72 56Q89 53 86 40Q72 42 72 56M73 42Q84 31 77 23Q66 31 73 42M69 29Q74 15 64 12Q60 24 69 29" stroke-width="1.4"/>'],
 ['simbolos','libro','Libro conmemorativo','<path d="M10 26Q30 19 49 27V77Q29 68 10 75ZM90 26Q70 19 51 27V77Q71 68 90 75ZM49 27Q50 25 51 27M49 77Q50 79 51 77M10 75Q29 82 50 83Q71 82 90 75"/><path d="M18 36Q31 32 42 37M18 45Q31 41 42 46M58 37Q69 32 82 36M58 46Q69 41 82 45" stroke-width="1.2"/>'],
 ['simbolos','pergamino','Pergamino conmemorativo','<path d="M26 18H73Q66 26 73 34V75H26V26Q20 25 20 18Q20 12 26 12H74Q80 12 80 18Q80 25 73 26M26 75Q20 74 20 81Q20 88 27 88H75Q81 88 81 81Q81 75 73 75Z"/><path d="M35 42H65M35 51H61M35 60H66" stroke-width="1.1"/>'],
 ['simbolos','ceramica','Medallón cerámico','<ellipse cx="50" cy="50" rx="33" ry="42"/><ellipse cx="50" cy="50" rx="28" ry="37" stroke-width=".8"/><path d="M32 65Q51 49 68 65M38 42Q50 53 62 42M50 22V36M42 30L49 38M58 30L51 38"/><circle cx="50" cy="44" r="6"/>'],
 ['simbolos','jarron','Jarrón de flores','<path d="M34 50Q35 75 42 85H58Q65 75 66 50ZM34 50H66M39 47H61M45 47V37H55V47M50 37V13M50 24Q33 10 27 20Q33 31 50 24M50 24Q67 10 73 20Q67 31 50 24M50 35Q35 26 30 35Q37 44 50 35M50 35Q65 26 70 35Q63 44 50 35"/><path d="M43 60Q50 57 57 60M42 68Q50 65 58 68" stroke-width="1"/>'],
 ['simbolos','vela','Vela encendida','<path d="M38 40H62V83H38ZM34 84H66M29 89H71M50 40V33M50 31Q37 23 50 7Q64 24 50 31Z"/><path d="M50 26Q47 21 51 15" stroke-width="1"/>']
];
for(const [category,id,name,body] of additions){
 const path=`${base}ornamentos/${category}/${id}.svg`;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><title>${name}</title>${body}</svg>\n`;
 writeFileSync(path,svg);
 if(!c.ornaments.some(item=>item.id===id&&item.category===category))c.ornaments.push({id,name,category,path,publicSelectable:true});
}
for(const [id,name,label,slug] of [
 ['marcellus','Marcellus','Romana serena · aprox. visual','marcellus'],
 ['lora','Lora','Serif contemporánea · aprox. visual','lora'],
 ['cormorant','Cormorant Garamond','Serif ornamental · aprox. visual','cormorantgaramond'],
 ['montserrat','Montserrat','Sans geométrica · aprox. visual','montserrat']
])if(!c.fonts.some(font=>font.id===id))c.fonts.push({id,name,label,family:'Litos-'+id,style:'normal',weight:400,path:`${base}fuentes/${slug}.woff2`,license:`${base}fuentes/${slug}-OFL.txt`,licenseName:'SIL Open Font License 1.1',source:`https://github.com/google/fonts/tree/main/ofl/${slug}`});
c.version=5;
writeFileSync(catalogPath,JSON.stringify(c,null,2)+'\n');
console.log('Added ten original motifs and four OFL font choices.');
