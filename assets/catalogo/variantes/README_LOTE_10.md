# Lote 10 — consola y banco · 2026-10-11

**Estado: pendientes de subir los 10 PNG.** Las referencias y comprobaciones están registradas en `docs/LOTE_10_IMAGENES_20261011.json`.

- 5 imágenes **Consola escultórica** (`consola-esc`).
- 5 imágenes **Banco escultórico** (`banco-esc`).
- Materiales: travertino beige, Blanco Macael, Verde Alpi, granito gris, Negro Marquina.
- Archivo por combinación: `<producto>__<material>.png`. Resolución: 1122 × 1402 px.
- Estos archivos **son renderizados conceptuales**, no evidencia de obras ejecutadas ni disponibilidad de las piedras.
- Solo subir originales inalterados del lote recibido el 11 de octubre, **NO** versiones generadas procedimentalmente.
- GitHub es público: los archivos PNG serán visibles incluso desde una rama no fusionada.
- No hay autorización para tocar `main`, actualizar `approvedVariants`, ni desplegar Pages.

Cuando se suban los archivos a esta rama con **Add file → Upload files**, el workflow `LITOS · Verificar 10 imágenes de consola y banco` comprobará los 10 PNG frente a su SHA-256 original.

## Actualización 2026-10-11 (verificación completada)
- Los **10 PNG originales** se encuentran en esta carpeta, con el mismo contenido binario que el ZIP de referencia. Las diez sumas Git SHA-1 originales coincidieron antes de mover las rutas; GitHub Actions verificó los SHA-256 y las dimensiones en la rama con resultado `success`: https://github.com/litosartesania/litos_web/actions/runs/38147236466
- El visor independiente `review/lote10-consola-banco.html` permite seleccionar cinco piedras y comparar ambos productos **sin editar píxeles**. El workflow `LITOS · Revisar 10 originales sin desplegar` ofrece ZIP navegable descargable como artefacto. No usa GitHub Pages.
- Pendiente: inspección visual del visor en móviles y escritorio, consentimiento explícito para cualquier uso en catálogo público. `main` sigue sin modificación.
