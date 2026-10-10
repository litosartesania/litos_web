# LITOS | Variantes de piedra — lote piloto en revisión
Fecha: 2026-10-10. Rama aislada: `work/stone-variants-review-20261010`.
Repo exclusivo: `litosartesania/litos_web`. **No publicar este lote sin QA y revisión expresa.**

## Alcance
Dos piezas existentes:
- `mesa-comedor-oval` ← `assets/catalogo/litos-mesa-comedor-01.webp` (mesa ovalada sobre dos apoyos cilíndricos).
- `mesa-centro-mon` ← `assets/catalogo/litos-mesa-centro-01.webp` (mesa de centro rectangular con dos apoyos macizos).

Cinco acabados por modelo: `travertino`, `macael`, `verde-alpi`, `granito`, `marquina`. Total: diez nombres reservados.

Ruta prevista por candidato: `assets/catalogo/variantes/<slug-modelo>__<slug-material>.webp`.

## Generación, naturaleza y límites
- Se ha preparado un **lote privado de 10 archivos WebP** y una comparación HTML autónoma, con los archivos fuente presentes en la Biblioteca privada de LITOS. Las piedras son **simulaciones visuales** sobre imágenes conceptuales que el usuario generó previamente; no certifican veta real, mineralogía, pieza construida ni viabilidad de fabricación.
- La geometría aparente y la escena se han conservado mediante máscaras por superficie; se han generado texturas de piedra conceptuales, no un filtro CSS aplicado en el navegador.
- Las dos representaciones de travertino reutilizan las imágenes conceptuales originales, sin asegurar que el material fotografiado sea travertino genuino. Los otros ocho WebP son composiciones editadas.
- **Aviso de control de calidad:** la fidelidad al aspecto geológico concreto de cada piedra y algunas sombras/cantos requieren todavía revisión humana. No sustituir por estas fotos el portafolio de LITOS ni anunciar acabados como producidos.
- El ZIP autónomo se ha entregado como archivo local descargable en la conversación y aún **no está transferido a esta rama de GitHub**. No declarar diez variantes publicadas ni incrementar el contador `approvedVariantImages` mientras falten los diez binarios reales en GitHub y su validación.

## Validaciones realizadas fuera del repositorio
- Las 10 imágenes están en WebP a 880×1100; se comprobó que sus referencias de fuente son las propias de LITOS.
- Comparador offline: 5 botones de selección, 2 imágenes cargadas al seleccionar, vuelta al original, ancho de 390/820/1440 px sin overflow, ninguna solicitud de red observada con Chromium mediante `page.set_content`.
- No se cambió `main`, la publicación, el flujo de contacto, ni los otros repositorios; sin servicios pagos, rastreadores, compras ni datos personales.

## Procedimiento para relevo e integración (pendiente)
1. Recuperar de la entrega local `LITOS_VARIANTES_LUZ_RASANTE_20261010.zip`: los 10 ficheros en `assets/catalogo/variantes/`, `variant-manifest.json`, `VISTA_PREVIA.html` y `LEEME.md`. El ZIP incluye además las 2 referencias y montaje de revisión.
2. Validar la textura de cada piedra con una muestra fiable y comparar máscaras/cantos. Descartar o rehacer los que no superen inspección a resolución completa.
3. Incorporar únicamente WebP aprobados con el nombre exacto. **Nunca asumir que un archivo pendiente existe por estar listado aquí.**
4. Pasar `python3 scripts/check-stone-variants.py --require-all`; comprobar `sh scripts/build-site.sh` y `python3 scripts/check-site.py _site`, navegador en móvil/escritorio y guard de privacidad.
5. Añadir en `catalogo-precios.js` las rutas aprobadas a `approvedVariants`, conservando sus avisos de imagen conceptual y las referencias originales. Actualizar allowlist de `scripts/build-site.sh` y comprobación de páginas. No introducir rutas antes de subir los binarios: impediría verificar que todas cargan.
6. Revisar PR borrador, sin fusionar ni ejecutar despliegue hasta pasar validación visual, funcional y privacidad. Los demás 11 modelos sin imágenes propias seguirán sin fingir que existen.

## Estado de esta rama
**Documentación y controles de integración únicamente**. No contiene aún los nuevos WebP. `approvedVariants` permanece intencionadamente vacío en la web.


## Actualización de verificación — 2026-10-10 (prevalece sobre estado inicial)
- Las 10 imágenes WebP candidatas **SÍ constan ya en GitHub**: `assets/catalogo/variantes/`, rama `work/stone-variants-review-20261010`. Un workflow restringido a esa rama (`.github/workflows/stone-variants-review.yml`) las generó a partir de los originales versionados, pasó `scripts/check-stone-variants.py --require-all` y confirmó commit remoto.
- El algoritmo reproducible usado **en el servidor GitHub** está en `scripts/generate-stone-variants.py`. Usa únicamente dos imágenes originales del mismo repositorio, máscaras geométricas y texturas conceptuales procedurales. No utiliza los datos personales ni servicios externos, ni descarga recursos del exterior al renderizar; las librerías se instalan del ecosistema Python.
- Las imágenes exactas del remoto deben revisarse desde `review/stone-variants.html`, un visor de selección que se incluye, junto con los dos originales y los diez WebP, en el artefacto de GitHub Actions `litos-stone-variants-review-only`. El visor offline carga archivos relativos, no solicita información al visitante.
- Advertencia: el ZIP local de la conversación se preparó **con un lote inicial diferente**, que incorpora materiales de referencia generados y una candidata privada de Verde Alpi; no coincide byte a byte con las imágenes producidas por el generador reproducible en GitHub. La versión del remoto es la única candidata para integrar en el sitio. Nunca confundir los dos lotes ni sus hashes.
- El renderizado técnico y la presencia de diez binarios se han verificado; **aún falta aprobar material/geología, perspectiva, costuras en máscaras, iluminación y contenido visual**. No añadir rutas a `approvedVariants` ni desplegar Pages sin esa aprobación.
