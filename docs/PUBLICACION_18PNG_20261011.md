# LITOS COMERCIAL — Publicación completada: consola y banco 9/9

Fecha: 11 de octubre de 2026.

## Autorización, aislamiento y alcance

El propietario aprobó expresamente publicar las ocho variantes adicionales del segundo lote después de revisar la vista previa. Se usó exclusivamente el repositorio `litosartesania/litos_web` con la cuenta `litosartesania`; sin modificaciones a otros repositorios, proyectos, servicios o procesos.

- PR #10: https://github.com/litosartesania/litos_web/pull/10
- Commit de `main` publicado: `638144cd6c0f59daf4340170e8072af68593359f`
- GitHub Pages y verificación post-despliegue: https://github.com/litosartesania/litos_web/actions/runs/38159245695 — **SUCCESS**.
- URL pública: https://litosartesania.github.io/litos_web/mobiliario.html#catalogo

## Evidencia de funcionamiento público

El workflow de GitHub Pages ejecutó correctamente:

- Build con allowlist estricta y bloqueo de publicación si fallan privacidad, páginas legales o integridad.
- QA de navegación en 5 páginas y en 390, 820 y 1440 píxeles.
- Despliegue a Pages.
- Verificación directa HTTP 200 de HTML, CSS, JS y **los 18 archivos PNG** de las variantes.
- Verificación de los **18 hashes SHA-256 y tamaños exactos** contra `docs/LOTE_10_IMAGENES_20261011.json` y `docs/LOTE_8_IMAGENES_20261011.json`.

El material nuevo quedó incorporado sin recompresión, redimensionado, recoloreado, ni sustitución de los diez originales. El catálogo sigue siendo una exposición conceptual, no un catálogo de obras ejecutadas ni un canal de venta/encargos.

## Progreso actualizado

- **18/189** combinaciones específicas **publicadas y verificadas**, **9,5 %**.
- **Consola escultórica: 9/9** piedras publicadas.
- **Banco escultórico: 9/9** piedras publicadas.
- Los otros **19 modelos** carecen de variante específica material aprobada, y **171/189** combinaciones continúan pendientes. No confundir referencias WebP con una variante terminada.
- La tabla matriz de progreso se mantiene en `docs/PROGRESO_CATALOGO.md` (actualizada en una rama de documentación aislada posterior a la verificación; su merge no debe alterar el catálogo ni los assets).

## Seguridad y mantenimiento

Mantener coste operativo adicional 0 €, privacidad estricta, imágenes conceptuales identificadas como tales y sin formularios de captación. Las imágenes originales sin comprimir pueden penalizar conexiones móviles; cualquier optimización futura debe preservar los originales y requiere revisión separada.

Esta nota reemplaza los estados históricos de “pendiente de publicación” documentados antes del despliegue, sin borrar la trazabilidad.
