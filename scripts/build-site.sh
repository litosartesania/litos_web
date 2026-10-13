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
# Copy only the eight additional owner-supplied PNGs, preserving bytes.
for asset in consola-esc__caliza.png consola-esc__carrara.png consola-esc__cuarcita.png consola-esc__calacatta.png banco-esc__caliza.png banco-esc__carrara.png banco-esc__cuarcita.png banco-esc__calacatta.png; do
 cp "assets/catalogo/variantes/$asset" "$site/assets/catalogo/variantes/$asset"
done

# Copy nine concept-2 oval dining table variants with exact original byte content.
for asset in mesa-comedor-oval__travertino.png mesa-comedor-oval__caliza.png mesa-comedor-oval__macael.png mesa-comedor-oval__carrara.png mesa-comedor-oval__marquina.png mesa-comedor-oval__granito.png mesa-comedor-oval__cuarcita.png mesa-comedor-oval__calacatta.png mesa-comedor-oval__verde-alpi.png; do
 cp "assets/catalogo/variantes/$asset" "$site/assets/catalogo/variantes/$asset"
done

# Nine verified originals of the round dining table, copied without altering bytes.
for asset in mesa-comedor-red__travertino.png mesa-comedor-red__caliza.png mesa-comedor-red__macael.png mesa-comedor-red__carrara.png mesa-comedor-red__marquina.png mesa-comedor-red__granito.png mesa-comedor-red__cuarcita.png mesa-comedor-red__calacatta.png mesa-comedor-red__verde-alpi.png; do
 cp "assets/catalogo/variantes/$asset" "$site/assets/catalogo/variantes/$asset"
done

# Add nine approved rectangular dining table PNG originals unchanged.
for asset in mesa-comedor-rect__travertino.png mesa-comedor-rect__caliza.png mesa-comedor-rect__macael.png mesa-comedor-rect__carrara.png mesa-comedor-rect__marquina.png mesa-comedor-rect__granito.png mesa-comedor-rect__cuarcita.png mesa-comedor-rect__calacatta.png mesa-comedor-rect__verde-alpi.png; do
 cp "assets/catalogo/variantes/$asset" "$site/assets/catalogo/variantes/$asset"
done

# 18 new coffee table images, copied verbatim from the verified originals.
for asset in mesa-centro-mon__travertino.png mesa-centro-mon__caliza.png mesa-centro-mon__macael.png mesa-centro-mon__carrara.png mesa-centro-mon__marquina.png mesa-centro-mon__granito.png mesa-centro-mon__cuarcita.png mesa-centro-mon__calacatta.png mesa-centro-mon__verde-alpi.png mesa-centro-red__travertino.png mesa-centro-red__caliza.png mesa-centro-red__macael.png mesa-centro-red__carrara.png mesa-centro-red__marquina.png mesa-centro-red__granito.png mesa-centro-red__cuarcita.png mesa-centro-red__calacatta.png mesa-centro-red__verde-alpi.png; do
 cp "assets/catalogo/variantes/$asset" "$site/assets/catalogo/variantes/$asset"
done
printf 'Site package with all 63 verified PNGs: '; du -sh "$site"


# Nine reviewed conceptual drawings, copied verbatim.
mkdir -p "$site/assets/catalogo/planos"
for asset in mesa-comedor-oval.png mesa-comedor-red.png mesa-comedor-rect.png mesa-centro-mon.png mesa-centro-red.png consola-esc.png banco-esc.png mesa-aux-ped.png lavabo-ped.png; do
 cp "assets/catalogo/planos/$asset" "$site/assets/catalogo/planos/$asset"
done

# Explicitly allowlist only the eleven corrected originals reviewed 2026-10-13.
# The prior 63 variants and 9 technical sheets remain unchanged and still ship.
mkdir -p "$site/assets/catalogo/revisiones/20261013/variantes" "$site/assets/catalogo/revisiones/20261013/planos"
for material in travertino caliza macael carrara marquina granito cuarcita calacatta verde-alpi; do
 cp "assets/catalogo/revisiones/20261013/variantes/consola-esc__$material.png" "$site/assets/catalogo/revisiones/20261013/variantes/consola-esc__$material.png"
done
for model in consola-esc mesa-comedor-oval; do
 cp "assets/catalogo/revisiones/20261013/planos/$model.png" "$site/assets/catalogo/revisiones/20261013/planos/$model.png"
done

# Seven selected original travertine PNGs, strictly allowlisted by reviewed slug.
# Unselected candidates remain ONLY in isolated candidate branch; not published.
mkdir -p "$site/assets/catalogo/revisiones/20261013/travertino-seleccion"
for model in mesa-aux-ped mesa-aux-bal lavabo-ped lavabo-sobre bandeja cuenco balda; do
 cp "assets/catalogo/revisiones/20261013/travertino-seleccion/${model}__travertino.png" "$site/assets/catalogo/revisiones/20261013/travertino-seleccion/${model}__travertino.png"
done

# Seven additional concept renders, copied unchanged and only when explicitly selected.
mkdir -p "$site/assets/catalogo/revisiones/20261013/travertino-extra-seleccion"
for model in consola-rect banco-rect encimera-bano encimera-cocina panel peana macetero; do
 cp "assets/catalogo/revisiones/20261013/travertino-extra-seleccion/${model}__travertino.png" "$site/assets/catalogo/revisiones/20261013/travertino-extra-seleccion/${model}__travertino.png"
done

# Do not stage all review candidates or SVGs in public Pages. Only 12 SHA-verified
# conceptual orthographic PNGs are included in the published asset allowlist.
mkdir -p "$site/assets/catalogo/revisiones/20261013/planos-12-seleccion"
for model in mesa-aux-bal consola-rect banco-rect lavabo-sobre encimera-bano encimera-cocina balda panel bandeja peana cuenco macetero; do
 cp "assets/catalogo/revisiones/20261013/planos-12-seleccion/${model}.png" "$site/assets/catalogo/revisiones/20261013/planos-12-seleccion/${model}.png"
done

# Eight approved Mesa auxiliar pedestal materials; only selected original PNGs.
mkdir -p "$site/assets/catalogo/revisiones/20261013/mesa-aux-ped-8-seleccion"
for stone in caliza macael carrara marquina granito cuarcita calacatta verde-alpi; do
 cp "assets/catalogo/revisiones/20261013/mesa-aux-ped-8-seleccion/mesa-aux-ped__${stone}.png" "$site/assets/catalogo/revisiones/20261013/mesa-aux-ped-8-seleccion/mesa-aux-ped__${stone}.png"
done
