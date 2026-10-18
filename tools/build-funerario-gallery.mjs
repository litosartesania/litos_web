import fs from 'node:fs';
import path from 'node:path';

const catalog = JSON.parse(fs.readFileSync('assets/funerario/configuracion/catalogo.json', 'utf8'));
const previous = new Set(['cruces', 'flores', 'marcos', 'separadores', 'simbolos']);
const added = catalog.ornaments.filter(item => item.validation && item.rights);
if (added.length !== 14) throw new Error(`Se esperaban 14 recursos nuevos; encontrados ${added.length}`);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cards = added.map(item => {
  const svg = fs.readFileSync(item.path, 'utf8');
  if (/<script\b|\bon\w+\s*=|<foreignObject\b|(?:href|src)\s*=\s*["']https?:/i.test(svg)) throw new Error(`SVG no apto: ${item.path}`);
  const image = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  return `<article class="card"><div class="image"><img src="${image}" alt="${escape(item.name)}"></div><p class="kind">${escape(item.category)}</p><h2>${escape(item.name)}</h2><p>${escape(item.description)}</p><small>${escape(item.validation)}</small></article>`;
}).join('\n');
const layouts = catalog.layouts.slice(-2).map(item => `<article class="layout"><div class="stone ${escape(item.id)}"><span class="cross">✝</span><span class="devotion">◎<br>motivo</span><span class="inscription">NOMBRE<br><small>Fechas · recuerdo</small></span></div><h2>${escape(item.name)}</h2><p>Esquema de zonas; la composición real se explora en el configurador.</p></article>`).join('');
const html = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LITOS · Biblioteca funeraria fase 2</title><style>
:root{font-family:Arial,sans-serif;color:#242625;background:#f5f2eb}*{box-sizing:border-box}body{margin:0}header,main,footer{max-width:1200px;margin:auto;padding:2rem}header{padding-top:4rem}h1{font-family:Georgia,serif;font-size:clamp(2rem,5vw,4rem);line-height:1.05;margin:.4rem 0 1rem}h2{font-family:Georgia,serif;font-size:1.2rem;margin:.4rem 0}p{line-height:1.55}small,.muted{color:#625f57}.eyebrow,.kind{font-size:.75rem;letter-spacing:.13em;text-transform:uppercase;color:#855b39}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:1rem}.card,.layout{background:#fff;border:1px solid #d9d1c4;border-radius:3px;padding:1rem}.card .image{height:180px;background:#c9c8c5;display:grid;place-items:center}.card img{width:75%;height:75%;object-fit:contain}.card p{margin:.5rem 0}.layouts{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem}.stone{position:relative;margin:auto;width:180px;height:230px;border-radius:25px 25px 4px 4px;border:12px solid #777d82;background:linear-gradient(115deg,#626a6e,#393f44);color:#ece9dd;text-align:center;font-family:Georgia,serif}.stone span{position:absolute}.cross{top:18px;left:18px}.devotion{top:48px;left:12px;font-size:.9rem}.inscription{top:90px;left:75px;font-size:.85rem;line-height:2}.medallonsuperior .devotion{top:18px;left:55px}.medallonsuperior .inscription{top:110px;left:32px}.medallonsuperior .cross{top:20px;left:15px}a{color:#6b422a}
</style><header><p class="eyebrow">LITOS · Revisión visual privada de desarrollo</p><h1>Biblioteca funeraria ampliada</h1><p>14 motivos vectoriales originales añadidos · 19 anteriores → 33 disponibles · dos nuevas composiciones. Ilustraciones genéricas basadas en categorías observadas; no representan encargos particulares ni diseños aprobados para fabricación.</p><p class="muted">Las miniaturas muestran el vector genérico sobre un fondo neutro. La piedra, el acabado y la escala pueden cambiar en el configurador.</p><p><a href="LITOS_CONFIGURADOR_FUNERARIO.html">Abrir configurador autónomo</a></p></header><main><h2>Motivos nuevos</h2><div class="grid">${cards}</div><h2>Composiciones nuevas</h2><div class="layouts">${layouts}</div></main><footer>Prototipos para revisión del taller · 18/10/2026</footer></html>`;
fs.mkdirSync('preview', {recursive:true});
fs.writeFileSync('preview/LITOS_BIBLIOTECA_FUNERARIA_FASE2.html', html);
console.log('Galería autónoma: preview/LITOS_BIBLIOTECA_FUNERARIA_FASE2.html');
