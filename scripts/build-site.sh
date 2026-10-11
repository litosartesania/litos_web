#!/bin/sh
# Allowlist-only output, never copy code documents, drafts or internal files to Pages.
set -eu
cd "$(dirname "$0")/.."
site="${1:-_site}"
case "$site" in _site|./_site) ;; *) echo "Only _site allowed" >&2; exit 1;; esac
rm -rf -- "$site"; mkdir -p "$site/assets" "$site/assets/catalogo"
for file in index.html funerario.html mobiliario.html aviso-legal.html privacidad.html styles.css script.js catalogo-precios.js; do cp "$file" "$site/$file"; done
for asset in favicon.svg hero-workshop.webp workshop-strip.webp limestone-texture.webp concept-mesa.webp concept-lavabo.webp concept-objetos.webp; do cp "assets/$asset" "$site/assets/$asset"; done
for asset in litos-banco-01.webp litos-banco-02.webp litos-consola-01.webp litos-consola-02.webp litos-lavabo-01.webp litos-lavabo-02.webp litos-mesa-auxiliar-01.webp litos-mesa-auxiliar-02.webp litos-mesa-centro-01.webp litos-mesa-centro-02.webp litos-mesa-comedor-01.webp litos-mesa-comedor-02.webp; do cp "assets/catalogo/$asset" "$site/assets/catalogo/$asset"; done
# Copy only the ten validated original PNGs, unchanged.
mkdir -p "$site/assets/catalogo/variantes"
for asset in consola-esc__travertino.png consola-esc__macael.png consola-esc__verde-alpi.png consola-esc__granito.png consola-esc__marquina.png banco-esc__travertino.png banco-esc__macael.png banco-esc__verde-alpi.png banco-esc__granito.png banco-esc__marquina.png; do
 cp "assets/catalogo/variantes/$asset" "$site/assets/catalogo/variantes/$asset"
done
printf 'Site package: '; du -sh "$site"
