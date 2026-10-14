# LITOS — Preparación: Consola recta, ocho variantes

**Fecha:** 2026-10-14  
**Estado:** PREPARADO PARA PRODUCCIÓN VISUAL. **CERO imágenes nuevas generadas, importadas o publicadas.**  
**Producto:** `Consola recta` (`consola-rect`), familia Consolas.  
**Base de trabajo:** `main` en `5c8073873793834f80d5ed0bc2941eff4497c9ce`.

## Verificación previa
- Matriz canónica `docs/PROGRESO_CATALOGO.md`: consola recta **1/9**, travertino ✅ y ocho piedras pendientes. Plano conceptual ✅.
- Catalogo global: **93/189** imágenes de piedra publicadas, **96** pendientes; **9/21** productos completos; **21/21** planos publicados.
- PR #42 fusionada (squash `e5c7b0ecdf435686a8bc9f55777d41fe0a15ab93`); PR #43 fusionada (squash `5c8073873793834f80d5ed0bc2941eff4497c9ce`); Pages run [38602040690](https://github.com/litosartesania/litos_web/actions/runs/38602040690) **SUCCESS**.
- En ramas antiguas `work/consola-9-materiales-2-planos-20261013` y `work/catalogo-consola-banco-18png-20261011` aparecen variantes de `consola-esc` (**Consola escultórica**), no de `consola-rect`. **No reutilizar una geometría distinta**.
- PR experimental #8, **no tocar**.

## Fotografía maestra de referencia — PRESERVAR
- Material: Travertino beige.
- Ruta pública/selección: `assets/catalogo/revisiones/20261013/travertino-extra-seleccion/consola-rect__travertino.png`
- URL de consulta: https://litosartesania.github.io/litos_web/assets/catalogo/revisiones/20261013/travertino-extra-seleccion/consola-rect__travertino.png
- Dimensiones: **1086 × 1448 px**; tamaño: **2.667.336 bytes**.
- Git blob SHA: `ee82c91b45ea65c4a678df09daec8112a864fecb`.
- SHA-256: `f8962c9f9b40f9ef5bd7f6d1e0fa37c08a665605ddbc006c8232a99a2676314a`.
- Manifiesto de origen: `docs/TRAVERTINO_7_EXTRAS_INTEGRACION_20261013.json`.
- Observación pendiente: el manifiesto histórico describió la imagen como alternativa visual de selección provisional. **Validar consistencia geométrica con la lámina antes de producir variantes**. La selección está publicada, pero no constituye prueba de fabricación.
- Lámina conceptual: `assets/catalogo/revisiones/20261013/planos-12-seleccion/consola-rect.png`. Las cotas son ilustrativas, no de fabricación.

## Ocho salidas pendientes (cambiar únicamente la piedra)

| Identificador piedra | Material | Nombre de fichero previsto |
| --- | --- | --- |
| `caliza` | Caliza Campaspero | `consola-rect__caliza.png` |
| `macael` | Blanco Macael | `consola-rect__macael.png` |
| `carrara` | Carrara | `consola-rect__carrara.png` |
| `marquina` | Negro Marquina | `consola-rect__marquina.png` |
| `granito` | Granito gris | `consola-rect__granito.png` |
| `cuarcita` | Cuarcita | `consola-rect__cuarcita.png` |
| `calacatta` | Calacatta Gold | `consola-rect__calacatta.png` |
| `verde-alpi` | Verde Alpi | `consola-rect__verde-alpi.png` |

## Condiciones de producción y QA
1. Usar **únicamente la fotografía maestra de Consola recta**, no la de Consola escultórica. Mantener geometría, proporciones, cámara, sombras coherentes, escenario y mobiliario de apoyo; variar solo material, color y vetas.
2. Comparar las ocho imágenes entre sí y con el travertino; rechazar patas diferentes, dimensiones aparentes alteradas, cambios de orientación, objetos añadidos y texturas mal identificadas.
3. Guardar los ocho PNG aprobados y sus SHA-256 y tamaños en un manifiesto. Entregar un **ZIP real de imágenes** para revisión visual **cuando existan**. No presentar un ZIP vacío o solo documental como lote terminado.
4. Carga original por el usuario a rama aislada; verificar hashes y reutilizar blobs Git idénticos al seleccionar, sin recomprimir.
5. Integración y PR de código solo tras revisión visual. Auditorías de sintaxis, construcción, privacidad, selector 9 piedras, modal, 21 planos, responsive y correspondencia material↔PNG.
6. Desplegar solo después de autorización expresa y verificar en Pages los ocho recursos HTTP 200 + SHA-256 y la conservación de los 93 anteriores. **Entonces** actualizar `PROJECT_CONTEXT.md`, `docs/HANDOFF.md` y `docs/PROGRESO_CATALOGO.md` de 93/189 a 101/189 y 10/21 productos completos, siempre condicionado a verificación real.
7. No modificar PR #8 ni otros repositorios, no instalar servicios de pago y no publicar datos privados. No alterar precios, materiales originales ni avisos legales.

**Esta rama es únicamente de preparación**, no lleva imágenes, no requiere merge y no debe desencadenar cambios de producción.
