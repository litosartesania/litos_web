// Only build a downloadable static review artifact. No hosted/public deployment.
import { cpSync,readFileSync,writeFileSync,rmSync } from 'node:fs';
const dir='preview';
rmSync(dir,{recursive:true,force:true});
cpSync('_site',dir,{recursive:true});
for(const page of ['funerario.html','mobiliario.html']){
 let html=readFileSync(dir+'/'+page,'utf8');
 html=html.replaceAll('action="mailto:litos.artesania@gmail.com"','action="#" onsubmit="return false"');
 html=html.replaceAll('<button type="submit">','<button type="submit" disabled>');
 html=html.replace('</body>','<div role="status" style="position:fixed;bottom:0;left:0;z-index:2147483647;padding:.5rem;background:#251f1b;color:white;font:12px Arial,sans-serif">LITOS · PREVISUALIZACIÓN · ENVÍOS DESACTIVADOS</div></body>');
 writeFileSync(dir+'/'+page,html);
}
console.log('OFFLINE PREVIEW READY — three pages, no real form submission');
