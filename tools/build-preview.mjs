#!/usr/bin/env node
/**
 * LITOS public-site package builder. No external dependencies or network calls.
 *
 * node tools/build-preview.mjs                 => preview/ (forms disabled)
 * node tools/build-preview.mjs --production    => dist/ (only after review)
 *
 * IMPORTANT: 'preview' is a local, downloadable artifact, NOT a hosted staging URL.
 * It does not sanitize already-public GitHub history or other existing pages.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { extname, join, normalize, sep } from 'node:path';

const production = process.argv.includes('--production');
const out = production ? 'dist' : 'preview';
const rootFiles = ['index.html', 'styles.css', 'script.js'];
const allowedAssetExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.avif', '.gif', '.woff', '.woff2']);

function fail(message) {
  console.error('SITE AUDIT FAILED:', message);
  process.exitCode = 1;
}
for (const name of rootFiles) {
  if (!existsSync(name)) fail('Missing root file: ' + name);
}
if (process.exitCode) process.exit(process.exitCode);

const html = readFileSync('index.html', 'utf8');
const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]));
const referencedAssets = new Set();

for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
  const ref = match[1].trim();
  if (/^(?:https?:|mailto:|tel:|data:|\/\/)/i.test(ref)) continue;
  if (ref.startsWith('#')) {
    if (ref.length > 1 && !ids.has(decodeURIComponent(ref.slice(1)))) fail('Broken anchor: ' + ref);
    continue;
  }
  const local = decodeURIComponent(ref.split(/[?#]/, 1)[0]);
  if (!local || local.startsWith('/') || local.includes('\\') ||
      normalize(local).split(sep).includes('..')) {
    fail('Unexpected local URL: ' + ref);
    continue;
  }
  if (!rootFiles.includes(local) && !local.startsWith('assets/')) {
    fail('Unallowlisted local dependency: ' + local);
  } else if (!existsSync(local)) {
    fail('Missing dependency: ' + local);
  } else if (local.startsWith('assets/')) {
    referencedAssets.add(local);
  }
}

const css = readFileSync('styles.css', 'utf8');
for (const match of css.matchAll(/url\(\s*["']?([^)"']+)/g)) {
  const ref = match[1].trim();
  if (/^(?:data:|https?:|\/\/|#)/i.test(ref)) continue;
  if (!ref.startsWith('assets/') || !existsSync(ref)) {
    fail('Invalid CSS local asset: ' + ref);
  } else referencedAssets.add(ref);
}
if (process.exitCode) process.exit(process.exitCode);

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'assets'), { recursive: true });

for (const name of rootFiles.filter(n => n !== 'index.html')) copyFileSync(name, join(out, name));
for (const asset of referencedAssets) {
  if (!allowedAssetExtensions.has(extname(asset).toLowerCase())) {
    fail('Unapproved asset type: ' + asset);
    continue;
  }
  copyFileSync(asset, join(out, asset));
}
if (process.exitCode) process.exit(process.exitCode);

let page = html;
if (!production) {
  // Explicitly block accidental transmission of a real request from an offline review.
  page = page.replace(/<form\b/gi, '<form onsubmit="return false" ');
  page = page.replace(/(<form\b[^>]*\baction=)["'][^"']*["']/gi, '$1"#"');
  page = page.replace(/(<button\b[^>]*\btype=["']submit["'][^>]*)(>)/gi, '$1 disabled$2');
  const warning = '<div role="status" style="position:fixed;bottom:0;left:0;z-index:2147483647;background:#251f1b;color:#fff;padding:8px 12px;font:12px sans-serif;pointer-events:none">LITOS · VISTA PREVIA LOCAL · FORMULARIOS DESACTIVADOS</div>';
  page = page.replace('</body>', warning + '\n</body>');
}
writeFileSync(join(out, 'index.html'), page, 'utf8');
console.log('OK:', production ? 'production candidate' : 'offline review', '| files:', rootFiles.length + referencedAssets.size, '| assets:', referencedAssets.size);
