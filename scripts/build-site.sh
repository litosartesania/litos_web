#!/bin/sh
# Allowlist-only output, never copy code documents, drafts or internal files to Pages.
set -eu
cd "$(dirname "$0")/.."
site="${1:-_site}"
case "$site" in _site|./_site) ;; *) echo "Only _site allowed" >&2; exit 1;; esac
rm -rf -- "$site"; mkdir -p "$site/assets"
for file in index.html funerario.html mobiliario.html aviso-legal.html privacidad.html styles.css script.js; do cp "$file" "$site/$file"; done
for asset in favicon.svg hero-workshop.webp workshop-strip.webp limestone-texture.webp concept-mesa.webp concept-lavabo.webp concept-objetos.webp; do cp "assets/$asset" "$site/assets/$asset"; done
printf 'Site package: '; du -sh "$site"
