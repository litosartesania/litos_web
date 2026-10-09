#!/bin/sh
# Allowlist-only static build for GitHub Pages; excludes all research,
# development drafts, internal documents, and unused original media.
set -eu
cd "$(dirname "$0")/.."
site="${1:-_site}"
case "$site" in
  _site|./_site) ;;
  *) printf '%s\n' 'Only the local _site output directory is supported.' >&2; exit 1 ;;
esac
rm -rf -- "$site"
mkdir -p "$site/assets"
for file in index.html styles.css script.js; do cp "$file" "$site/$file"; done
for asset in favicon.svg hero-workshop.webp workshop-strip.webp limestone-texture.webp concept-mesa.webp concept-lavabo.webp concept-objetos.webp; do
  cp "assets/$asset" "$site/assets/$asset"
done
printf 'Static Pages artifact: '
du -sh "$site"
