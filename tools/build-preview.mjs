// Only build a downloadable static review artifact. No hosted/public deployment.
import { cpSync,readFileSync,writeFileSync,rmSync } from 'node:fs';
const dir='preview';
rmSync(dir,{recursive:true,force:true});
cpSync('_site',dir,{recursive:true});
for(const page of ['funerario.html','mobiliario.html']){
 let html=readFileSync(dir+'/'+page,'utf8');
 if ((html.match(/<form\b/g)||[]).length!==1 || !html.includes('data-litos-contact') || !html.includes('type="submit" disabled')) throw new Error('Review form must be local and disabled');
 html=html.replace('</body>','<div role="status" style="position:fixed;bottom:0;left:0;z-index:2147483647;padding:.5rem;background:#251f1b;color:white;font:12px Arial,sans-serif">LITOS · PREVISUALIZACIÓN · NO ENVÍA DATOS</div></body>');
 writeFileSync(dir+'/'+page,html);
}
console.log('OFFLINE PREVIEW READY — three pages, local review-only forms disabled');
