# LITOS — Web comercial

Web pública de LITOS Artesanía, taller de artesanía en piedra.

## Desarrollo local

El sitio es estático y no requiere instalación:

```sh
python3 -m http.server 4173
```

Abra `http://localhost:4173`.

## Publicación

GitHub Pages publica únicamente el directorio `_site/` generado mediante `scripts/build-site.sh`, desde `main` y solo tras pasar las verificaciones de publicación. No mezclar documentos internos con la web.

El contexto del producto, el benchmark, las decisiones de diseño y el estado del proyecto viven en `PROJECT_CONTEXT.md`. La web comercial pertenece exclusivamente a `litosartesania/litos_web`; no debe mezclarse con el sistema interno de LITOS.

## Seguridad, privacidad y handoff

Consultar [`AGENTS.md`](AGENTS.md) y [`docs/HANDOFF.md`](docs/HANDOFF.md). La publicación produce `_site/` mediante `scripts/build-site.sh` y verifica la lista de archivos públicos con `scripts/check-site.py`.

La web no necesita servidor privado ni servicios de pago. El formulario actual prepara un borrador para el programa de correo del visitante (no envía nada automáticamente). El aviso legal debe validarse antes de publicar.

## Precio orientativo y pruebas de liberación
Los rangos publicados son **comparables externos, no precios ni presupuestos de LITOS**. Investigación y fuentes: `docs/MARKET_STUDY_2026-10.md`. Para validar el contenido público ejecutar `sh scripts/build-site.sh && python3 scripts/check-site.py _site` y `python3 scripts/visual-qa.py`.

**Bloqueo de lanzamiento:** `python3 scripts/check-site.py _site --production` sigue rechazando el aviso legal provisional. No sustituir la web pública antes de acreditar titularidad, contacto legal, derechos de las imágenes y privacidad.
